#!/usr/bin/env node
// Regenerates data/winrates.json: legend-vs-legend win rates from RiftLite's community
// matchup matrix (riftlite.com/community/matrix), at its defaults: Radiance season, all
// formats, the latest 7,000 matches.
//
//   node scripts/build-winrates.mjs
//
// What the numbers are. RiftLite's players log their games automatically while playing
// online (TCGA, RiftAtlas) and may contribute them; nothing is scraped from Riot. So these
// are **online, user-submitted** matches: a different field from paper events, and a cell
// of 30 games is noise. Every pair keeps its game count so readers can say so.
//
// One request a day. robots.txt allows /community (it disallows only /meta-studio). The page
// is server-rendered and large (~20MB); each matrix cell carries its numbers in an
// aria-label: "Pooled for Kai'Sa: 48.1% vs Riven from 70 captures. Native pilot records: …".
// "Pooled" is the row legend's win rate against the column legend over every capture of the
// pairing, whichever side logged it. Legends are named by champion ("Kai'Sa"), with the
// legend's title only where a champion has two ("Master Yi, Wuju Bladesman"); they ship as
// RiftLite prints them and readers match them.
//
// Fails without writing if the parse comes up short, so the refresh keeps yesterday's file.

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const PAGE = "https://www.riftlite.com/community/matrix";
const UA = "Mozilla/5.0 (rift.jayegger.com win-rate builder; +https://rift.jayegger.com)";
const OUT = new URL("../data/winrates.json", import.meta.url);
const MIN_PAIRS = 300;   // 21 Nov 2026: 2,064 cells with games. Far fewer means the page changed shape.

const unescape = (s) => s.replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

export function parseMatrix(html) {
  const page = unescape(html);
  const pairs = new Map();
  const re = /aria-label="Pooled for ([^:"]+): ([\d.]+)% vs ([^"]+?) from (\d+) captures?\./g;
  for (const m of page.matchAll(re)) {
    const [, a, wr, b, n] = m;
    pairs.set(`${a}\u0000${b}`, { a, b, wr: Number(wr), n: Number(n) });
  }
  const selected = [...page.matchAll(/<option[^>]*selected[^>]*>([^<]*)<\/option>/g)].map((m) => m[1].trim());
  return { pairs: [...pairs.values()], filters: selected.slice(0, 3) };
}

// The match records the page embeds (its date filters run over them in the browser): one per logged match, from the
// logger's side. Kept: a short key from the match id (repeats), day, both legends, the logger's result, format. Never names. Incomplete games are dropped,
// and so are records RiftLite marks superseded or merged into another (a duplicate log). 25 Nov: lets calibrate compare
// against games after a date (the 23 Nov bans) without a second fetch.
// The logger's deck, when the record carries a complete one (about 30% do; 25 Nov): its sections by card name, and a
// short key over them, so the same list played many times is stored once (data/riftlite-decks.json). Names only.
export function deckOf(rec) {
  const at = rec.indexOf('"deckSnapshot":{'); if (at < 0) return null;
  const snap = rec.slice(at);
  const sect = (k) => { const j = snap.indexOf(`"${k}":[`); if (j < 0) return []; const e = snap.indexOf("]", j); return [...snap.slice(j, e).matchAll(/"qty":(\d+),"name":"([^"]+)"/g)].map((x) => [Number(x[1]), unescape(x[2])]); };
  const legend = (/"legendEntry":\{"qty":\d+,"name":"([^"]+)"/.exec(snap) || [])[1];
  const deck = { legend: legend ? unescape(legend) : null, champion: sect("champion"), main: sect("mainDeck"), runes: sect("runes"), battlefields: sect("battlefields") };
  const n = [...deck.main, ...deck.champion].reduce((a, [q]) => a + q, 0);
  if (!deck.legend || n < 39 || n > 41) return null;
  const canon = JSON.stringify(["champion", "main", "runes", "battlefields"].map((k) => deck[k].slice().sort((x, y) => x[1].localeCompare(y[1]))).concat([deck.legend]));
  return { key: createHash("sha1").update(canon).digest("hex").slice(0, 12), deck };
}

export function parseMatches(html, decks = null) {
  const page = html.replace(/\\"/g, '"');
  const starts = [...page.matchAll(/"id":"riftlite-[0-9a-f]+"/g)].map((m) => m.index);
  const out = [], seen = new Set();
  starts.forEach((at, i) => {
    const rec = page.slice(at, starts[i + 1] ?? at + 60000);
    const m = /^"id":"(riftlite-[0-9a-f]+)"[^{}]*?"date":"(\d{4}-\d\d-\d\d)[^"]*","result":"([^"]+)","myChampion":"([^"]+)","oppChampion":"([^"]+)"[^{}]*?"fmt":"([^"]*)"/.exec(rec);
    if (!m || seen.has(m[1])) return;
    seen.add(m[1]);
    if (/"superseded":true/.test(rec) || /"mergedIntoMatchId":"[^"]+"/.test(rec)) return;
    const w = { Win: 1, Loss: 0, Draw: 0.5 }[m[3]];
    if (w == null) return;   // Incomplete
    const dk = deckOf(rec);
    if (dk && decks) decks.set(dk.key, dk.deck);
    out.push({ k: m[1].slice(9, 21), d: m[2], a: unescape(m[4]), b: unescape(m[5]), w, fmt: m[6], ...(dk ? { dk: dk.key } : {}) });   // k: 12 hex of RiftLite's opaque match id, to skip repeats; dk: the logger's deck
  });
  return out;
}

// Each legend's pooled win rate from the records, as the matrix's labels pool it (every capture, either side's log).
export function poolMatches(matches, since = "") {
  const t = new Map(), add = (l, w) => { const x = t.get(l) || { w: 0, n: 0 }; x.w += w; x.n++; t.set(l, x); };
  for (const m of matches) if (m.d >= since && m.a !== m.b) { add(m.a, m.w); add(m.b, 1 - m.w); }
  return t;
}

// data/matches.json: every match record ever parsed, kept past the page's 7,000-match window, so a sample since a date
// (the 23 Nov bans) keeps growing. One record per line; repeats skipped by k. Calibrate reads it (--real-since).
const ARCHIVE = new URL("../data/matches.json", import.meta.url);
export function mergeMatches(old, fresh) {
  const keys = new Set(old.map((m) => m.k)), add = fresh.filter((m) => !keys.has(m.k));
  return { all: [...old, ...add].sort((x, y) => x.d.localeCompare(y.d) || x.k.localeCompare(y.k)), added: add.length };
}
async function archiveMatches(fresh) {
  let old = [];
  try { old = JSON.parse(await readFile(ARCHIVE, "utf8")).matches || []; } catch { /* first run */ }
  const { all, added } = mergeMatches(old, fresh);
  const note = "RiftLite match records (scripts/build-winrates.mjs parseMatches), kept past the page's window: k = 12 hex of RiftLite's match id (repeats only), d = day, a/b = the logger's legend / its opponent's, w = a's result (1, 0, 0.5), fmt. No names.";
  await writeFile(ARCHIVE, `{\n "note": ${JSON.stringify(note)},\n "updated": "${new Date().toISOString().slice(0, 10)}",\n "matches": [\n${all.map((m) => `  ${JSON.stringify(m)}`).join(",\n")}\n ]\n}\n`);
  return { total: all.length, added };
}

// data/riftlite-decks.json: every complete deck a match record carried, by its key (matches' dk). Kept like the matches.
const DECKS = new URL("../data/riftlite-decks.json", import.meta.url);
async function archiveDecks(fresh) {
  let old = {};
  try { old = JSON.parse(await readFile(DECKS, "utf8")).decks || {}; } catch { /* first run */ }
  for (const [k, d] of fresh) if (!old[k]) old[k] = d;
  const keys = Object.keys(old).sort();
  const note = "Complete decks from RiftLite match records (scripts/build-winrates.mjs deckOf), by card name; data/matches.json's dk points here. Sections: legend (RiftLite's champion name), champion, main, runes, battlefields as [qty, name].";
  await writeFile(DECKS, `{\n "note": ${JSON.stringify(note)},\n "updated": "${new Date().toISOString().slice(0, 10)}",\n "decks": {\n${keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(old[k])}`).join(",\n")}\n }\n}\n`);
}

async function main() {
  // --from <file>: a saved copy of the page (tests, or a second build the same day without a second request).
  const from = process.argv.indexOf("--from");
  let html;
  if (from > -1) html = await readFile(process.argv[from + 1], "utf8");
  else {
    const r = await fetch(PAGE, { headers: { "User-Agent": UA, "Accept-Language": "en-US" } });
    if (!r.ok) throw new Error(`${PAGE}: ${r.status} ${r.statusText}`);
    html = await r.text();
  }
  const { pairs, filters } = parseMatrix(html);
  const decks = new Map(), matches = parseMatches(html, decks);
  if (pairs.length < MIN_PAIRS) throw new Error(`only ${pairs.length} matrix cells parsed (expected ${MIN_PAIRS}+); page changed shape? Keeping the last file.`);
  if (!/radiance/i.test(filters[0] || "")) throw new Error(`the matrix's default season is "${filters[0]}", not Radiance; keeping the last file.`);
  // The records must pool to the labels' numbers (25 Nov: within 0.8 points for the 20 most-played legends); a gap means
  // the record parse broke, so they're left out rather than shipped wrong.
  const lab = new Map(); for (const p of pairs) { const x = lab.get(p.a) || { w: 0, n: 0 }; x.w += (p.wr / 100) * p.n; x.n += p.n; lab.set(p.a, x); }
  const rec = poolMatches(matches);
  const gaps = [...lab].sort((a, b) => b[1].n - a[1].n).slice(0, 20).map(([l, x]) => { const y = rec.get(l); return y ? Math.abs(100 * (y.w / y.n - x.w / x.n)) : 100; });
  const recordsOk = matches.length >= 1000 && Math.max(...gaps) <= 3;
  if (!recordsOk) console.error(`match records left out: ${matches.length} parsed, largest gap to the labels ${Math.max(...gaps).toFixed(1)} points`);
  pairs.sort((x, y) => x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
  const games = new Map();
  for (const p of pairs) games.set(p.a, (games.get(p.a) || 0) + p.n);
  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: PAGE,
    note: "RiftLite community matchup matrix: online matches (TCGA, RiftAtlas) logged by RiftLite users, not paper events. wr = row legend's win % vs the column legend over n games (pooled, either side's log). Small n is noise.",
    filters: { season: filters[0] || null, format: filters[1] || null, window: filters[2] || null },
    legends: [...games].map(([legend, n]) => ({ legend, games: n })).sort((x, y) => y.games - x.games),
    pairs,
  };
  await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");
  const archived = recordsOk ? await archiveMatches(matches) : null;
  if (archived) await archiveDecks(decks);
  console.log(`winrates: ${pairs.length} pairs, ${games.size} legends, ${archived ? `${matches.length} match records (archive ${archived.total}, ${archived.added} new)` : "no match records"}, filters ${Object.values(out.filters).join(" · ")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
