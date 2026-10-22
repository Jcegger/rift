#!/usr/bin/env node
// Regenerates data/field.json: the field forecast — for every legend, what the experts grade
// it, what its record says, and who is playing it in the new format. lib/field.mjs holds the
// rules; this gathers the evidence. `scripts/rift field` reads the file.
//
//   node scripts/build-field.mjs            # fetch what is new, rebuild
//   node scripts/build-field.mjs --offline  # rebuild from the cached events only
//
// Sources:
// - Rift Atlas event pages (riftatlas.com/events/<slug>, data from TopDeck.gg): players, rounds,
//   the per-legend metagame (pilots, top 8s, match win rate) and the top 32 with legends. Its
//   robots.txt allows the pages and disallows /api/, which is not used.
// - riftbound.gg's tournament API (api.dotgg.gg/cgfw/gettournament): standings with each
//   player's legend, usually the top half, for the events Rift Atlas does not carry.
// - data/topdecks.json (Riot's RQ tables), data/decks.json (placeholders, uploaded placings),
//   data/events.json (riftbound.gg's event list), data/archetypes.json (the legends),
//   model/expert-predictions.json (grades), model/preseason-inputs.json (card reads, as notes).
//
// Events are cached in the output and fetched once: a finished event does not change, so only
// events from the last REFETCH_DAYS days are fetched again. riftdecks.com carries more events
// but its robots.txt disallows this kind of tool by name, so it is not a source.

import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { indexCatalog } from "../lib/decks.mjs";
import { NEVER_PLAY } from "../lib/avoid.mjs";
import { gradeFor, consensus, recordRatio, recordTier, disagreement, groupOf, handedOver, resultsRatio, LETTERS, DISAGREE_TIERS, MIN_E, FORMAT_FROM } from "../lib/field.mjs";

const RA = "https://riftatlas.com";
const DOTGG = "https://api.dotgg.gg/cgfw/gettournament?game=riftbound&slug=";
const UA = "rift-field/1.0 (personal Riftbound notes; one request every few seconds)";
const MIN_PLAYERS = 16;      // smaller events are not fetched
const MAJOR = 40;            // a top-16 finish counts at events this size and up
const WINDOW_DAYS = 60;      // events this recent are fetched (the deck snapshot's window)
const REFETCH_DAYS = 3;      // events this recent are fetched again: standings settle late
const MAX_FETCH = 60;        // new pages per run, so a first run or a busy weekend is spread out
const GAP_RA = 3000, GAP_DOTGG = 2000;

// One-on-one Constructed only: a 2v2 team event's placings are a pair's, not a deck's.
const singles = (name, format) => (format == null || /^constructed$/i.test(format)) && !/\b(2v2|team|trios|sealed|draft|limited|pre-?rift)\b/i.test(name);

const args = process.argv.slice(2);
const offline = args.includes("--offline");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const read = async (p) => JSON.parse(await readFile(new URL(`../${p}`, import.meta.url), "utf8"));
const unesc = (s) => String(s).replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const norm = (s) => unesc(s).toLowerCase().replace(/[^a-z0-9]+/g, "");
const day = (d) => new Date(d + "T00:00:00Z").getTime() / 864e5;
const r3 = (x) => Math.round(x * 1000) / 1000;

async function get(url, { json = false, attempt = 0 } = {}) {
  const r = await fetch(url, { headers: { "user-agent": UA } });
  if (r.status === 429 && attempt < 3) { await sleep(15000 * (attempt + 1)); return get(url, { json, attempt: attempt + 1 }); }
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return json ? r.json() : r.text();
}

/* ── Rift Atlas ─────────────────────────────────────────────────────────── */
// The events list: slug and player count per row. Dates there have no year; the event page's
// meta description has the full one, so dates come from the page.
export function parseEventList(html) {
  const rows = [];
  for (const m of html.matchAll(/<a[^>]*href="\/events\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const players = /(\d+) players/.exec(m[2]);
    if (players) rows.push({ slug: m[1], players: Number(players[1]) });
  }
  return [...new Map(rows.map((r) => [r.slug, r])).values()];
}

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
export function parseEventPage(html, slug) {
  const title = /<title>([^<]*?): results and decklists/.exec(html);
  const meta = /\((\d+) players, ([A-Z][a-z]{2}) (\d{1,2}), (\d{4})\)/.exec(html);
  if (!title || !meta) throw new Error(`riftatlas ${slug}: page shape changed (no title or players/date line)`);
  const dt = `${meta[4]}-${String(MONTHS[meta[2]]).padStart(2, "0")}-${meta[3].padStart(2, "0")}`;
  const rounds = /(\d+) rounds/.exec(html.replace(/<!-- -->/g, ""));
  // The metagame: one <li> per legend, the legend's full name in a title attribute, then
  // share, pilots, top 8s and win rate as the row's last three numbers.
  const meta_ = [];
  const mi = html.indexOf(">Metagame<"), si = html.indexOf(">Standings<");
  if (mi > 0) {
    const seg = html.slice(mi, si > mi ? si : undefined);
    for (const li of seg.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
      const name = /title="([^"]+)"/.exec(li[1]);
      const tail = [...li[1].matchAll(/tabular-nums[^>]*>(\d+)(%?)</g)].map((x) => [Number(x[1]), x[2]]);
      if (!name || tail.length < 3) continue;
      const [pilots, top8, wr] = tail.slice(-3);
      if (!wr[1]) continue;
      meta_.push({ legend: unesc(name[1]), pilots: pilots[0], top8: top8[0], winRate: wr[0] / 100 });
    }
  }
  // Standings: the top 32 are on the page, each with a legend (or "—" when unknown).
  const standings = [];
  if (si > 0) {
    let ol = html.slice(si); ol = ol.slice(0, ol.indexOf("</ol>"));
    for (const li of ol.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
      const pl = /<span[^>]*>(\d+)<\/span>/.exec(li[1]);
      const lg = /title="([^"]+)"/.exec(li[1]);
      if (pl) standings.push({ pl: Number(pl[1]), legend: lg ? unesc(lg[1]) : null });
    }
  }
  return { src: "riftatlas", slug, name: unesc(title[1]), dt, players: Number(meta[1]), rounds: rounds ? Number(rounds[1]) : null, meta: meta_, standings };
}

/* ── riftbound.gg ───────────────────────────────────────────────────────── */
function parseDotgg(t, slug, codeToLegend) {
  if (!t || !Array.isArray(t.standings)) throw new Error(`dotgg ${slug}: no standings array`);
  const dt = new Date(Number(t.date) * 1000).toISOString().slice(0, 10);
  return { src: "riftbound.gg", slug, name: unesc(t.name), dt, players: Number(t.players_count) || null, rounds: null, meta: null,
    standings: t.standings.map((s) => ({ pl: Number(s.standing_place), legend: codeToLegend(s.archetype_key) })).filter((s) => s.pl > 0) };
}

const main = async () => {
  const [catRaw, banned, snap, topdecks, eventsJson, arche, experts, inputs] = await Promise.all([
    read("data/cards.json"), read("data/banned.json"), read("data/decks.json"), read("data/topdecks.json"),
    read("data/events.json"), read("data/archetypes.json"), read("model/expert-predictions.json"), read("model/preseason-inputs.json")]);
  const prev = await read("data/field.json").catch(() => null);
  const cards = catRaw.cards || catRaw;
  const idx = indexCatalog(cards, banned);
  const legends = arche.legends.map((l) => l.name);
  const legendSet = new Set(legends);
  const byCode = new Map(cards.filter((c) => c.t === "Legend").map((c) => [c.c.split("/")[0], idx.legendName(c)]));
  const codeToLegend = (k) => (k && byCode.get(String(k).split("/")[0])) || null;
  // Lists cite short codes ("OGN-160"), the catalog keys on full ones ("OGN-160/298").
  const byShort = new Map(cards.map((c) => [c.c.split("/")[0], c]));
  const cardOf = (k) => idx.BY.get(k) || byShort.get(String(k).split("/")[0]) || null;
  const legendOfList = (d) => { const L = cardOf(d.lg); return L ? idx.legendName(L) : null; };
  const newest = Object.keys(FORMAT_FROM).sort((a, b) => FORMAT_FROM[b].localeCompare(FORMAT_FROM[a]))[0];
  const lastSet = Object.keys(FORMAT_FROM).sort((a, b) => FORMAT_FROM[b].localeCompare(FORMAT_FROM[a]))[1] || null;
  const legalFrom = FORMAT_FROM[newest];
  const lastFrom = Object.values(FORMAT_FROM).filter((d) => d < legalFrom).sort().at(-1);
  const isNewLegend = (name) => [...byCode].some(([code, n]) => n === name && code.startsWith(`${newest}-`));
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString().slice(0, 10);

  /* ── events: cached, then what is new ──────────────────────────────────── */
  const cache = new Map((prev?.events || []).map((e) => [`${e.src}:${e.slug}`, e]));
  const fresh = (e) => e && day(today) - day(e.dt) > REFETCH_DAYS;
  const log = { fetched: 0, cached: 0, failed: [] };
  let budget = MAX_FETCH;
  const raEvents = [];
  if (!offline) {
    const list = parseEventList(await get(`${RA}/events`));
    if (!list.length) throw new Error("riftatlas /events: no event rows — the page changed shape");
    // Biggest first: a run that hits MAX_FETCH has still read the events that matter.
    for (const row of list.filter((r) => r.players >= MIN_PLAYERS && singles(r.slug.replace(/-/g, " "))).sort((x, y) => y.players - x.players)) {
      const key = `riftatlas:${row.slug}`, c = cache.get(key);
      if (fresh(c)) { raEvents.push(c); log.cached++; continue; }
      if (budget-- <= 0) { if (c) raEvents.push(c); continue; }
      try { await sleep(GAP_RA); const e = parseEventPage(await get(`${RA}/events/${row.slug}`), row.slug); if (e.dt >= from) raEvents.push(e); log.fetched++; }
      catch (err) { log.failed.push(String(err.message || err)); if (c) raEvents.push(c); }
    }
  } else raEvents.push(...[...cache.values()].filter((e) => e.src === "riftatlas"));
  const seen = new Set(raEvents.map((e) => norm(e.name)));
  const dotEvents = [];
  // riftbound.gg lists every store event (871 of 16+ players in 60 days, 22 Oct 2026), too many
  // to fetch politely. Fetched: the majors, every event of the new format, and any event whose
  // top legends (data/events.json `top`) include one of the new set's legends.
  const newFormatHint = (e) => e.dt >= legalFrom || /radiance|preview/i.test(e.name) || (e.top || []).some(([k]) => String(k).startsWith(`${newest}-`));
  const candidates = (eventsJson.events || []).filter((e) => e.slug && singles(e.name, e.format) && e.dt >= from && (e.players || 0) >= MIN_PLAYERS && !seen.has(norm(e.name)) && ((e.players || 0) >= MAJOR || newFormatHint(e)))
    .sort((x, y) => (newFormatHint(y) - newFormatHint(x)) || (y.players || 0) - (x.players || 0));
  for (const ev of candidates) {
    const key = `riftbound.gg:${ev.slug}`, c = cache.get(key);
    if (offline || fresh(c)) { if (c) { dotEvents.push(c); log.cached++; } continue; }
    if (budget-- <= 0) { if (c) dotEvents.push(c); continue; }
    try { await sleep(GAP_DOTGG); dotEvents.push(parseDotgg(await get(DOTGG + encodeURIComponent(ev.slug), { json: true }), ev.slug, codeToLegend)); log.fetched++; }
    catch (err) { log.failed.push(String(err.message || err)); if (c) dotEvents.push(c); }
  }
  // Only what was fetched is cached; what is derived from it (hidden, kind, …) is recomputed
  // every run, so a cached event never carries yesterday's reading.
  const DERIVED = ["hidden", "hiddenAs", "hiddenTop16", "radiance", "kind"];
  // A cached event stays whatever picked it: the evidence does not depend on today's selection
  // rule (or on data/events.json still carrying the `top` legends that found it).
  const have_ = new Set([...raEvents, ...dotEvents].map((e) => `${e.src}:${e.slug}`));
  for (const [k, c] of cache) if (!have_.has(k) && c.dt >= from) { (c.src === "riftatlas" ? raEvents : dotEvents).push(c); log.cached++; }
  const events = [...raEvents, ...dotEvents].filter((e) => e.dt >= from && singles(e.name))
    .map((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !DERIVED.includes(k))));
  if (!events.length) throw new Error("no events at all — both sources failed and nothing is cached");

  /* ── placeholders ─────────────────────────────────────────────────────── */
  // build-decks.mjs holds placeholder lists apart (players hiding their deck). Both sites file
  // them under the legend they were uploaded with (Yasuo, "Unforgiven", at Showdown 5), so at an
  // event with placeholders that legend's count, top 8s, win rate and standings are not a
  // legend's: they are subtracted, nulled and counted as hidden.
  const hiddenAt = new Map();
  for (const h of snap.hidden || []) {
    if (!h.ev) continue;
    const k = norm(h.ev), x = hiddenAt.get(k) || { n: 0, as: new Map() };
    x.n++;
    const as = legends.find((n) => h.ln && n.endsWith(`, ${h.ln}`)) || null;
    if (as) x.as.set(as, (x.as.get(as) || 0) + 1);
    hiddenAt.set(k, x);
  }
  for (const e of events) {
    const h = hiddenAt.get(norm(e.name));
    e.hidden = h?.n || 0;
    e.hiddenAs = h ? [...h.as.keys()] : [];
    // The format is what was played, not what the event is called: "RADIANCE CASE PRIZE"
    // events ran Vendetta (22 Oct 2026). A new-set legend in the field is the proof; the name
    // only decides what is worth fetching.
    e.radiance = e.dt >= legalFrom || [...(e.meta || []), ...e.standings].some((x) => x.legend && isNewLegend(x.legend));
    e.kind = e.dt >= legalFrom ? "season" : e.radiance ? "preview" : "last";
  }
  const masked = (e, legend) => e.hiddenAs.includes(legend);

  /* ── per legend ───────────────────────────────────────────────────────── */
  // Last format's RQ tables: Day 2 against Day 1 (Riot's Top Decks articles).
  const rq = topdecks.events.filter((e) => e.field?.length && e.published >= lastFrom && e.published < legalFrom && e.field.some((x) => x.d2 != null));
  const D1all = rq.reduce((t, e) => t + e.field.reduce((u, x) => u + x.d1, 0), 0);
  const recordOf = (name) => {
    let O = 0, E = 0, d1 = 0;
    for (const e of rq) {
      const D1 = e.field.reduce((t, x) => t + x.d1, 0), D2 = e.field.reduce((t, x) => t + (x.d2 || 0), 0);
      const x = e.field.find((f) => f.legend === name);
      if (x) { O += x.d2 || 0; E += x.d1 * D2 / D1; d1 += x.d1; }
    }
    const ratio = recordRatio(O, E);
    return { rqs: rq.length, d1, d2: O, E: r3(E), share: D1all ? r3(d1 / D1all) : null, ratio: r3(ratio), tier: E >= MIN_E ? recordTier(ratio) : null };
  };
  // Top-16 finishes at 40+ player events: standings first, then Riot's RQ top decks, then
  // uploaded lists for events neither covers.
  const majors = events.filter((e) => (e.players || 0) >= MAJOR);
  const finishes = new Map(legends.map((n) => [n, []]));
  const covered = new Set(majors.map((e) => norm(e.name)));
  for (const e of majors) for (const s of e.standings) {
    if (s.pl > 16 || !s.legend) continue;
    if (masked(e, s.legend)) { (e.hiddenTop16 ??= []).push(s.pl); continue; }
    finishes.get(s.legend)?.push({ ev: e.name, dt: e.dt, kind: e.kind, players: e.players, pl: s.pl });
  }
  for (const e of topdecks.events.filter((e) => e.published >= from && e.decks?.length)) {
    // Riot titles an RQ "Los Angeles' Top Decks"; riftbound.gg lists the same event as
    // "Riftbound Regional Qualifier - Los Angeles". Either one covers it.
    const city = norm(e.title.replace(/'s? Top Decks$/i, ""));
    if (covered.has(norm(e.title)) || majors.some((m) => /regional qualifier/i.test(m.name) && norm(m.name).endsWith(city))) continue;
    covered.add(norm(e.title));
    const seenLeg = new Set();
    for (const d of e.decks) if (d.overall <= 16 && legendSet.has(d.legend) && !seenLeg.has(`${d.legend}:${d.overall}`)) {
      seenLeg.add(`${d.legend}:${d.overall}`);
      finishes.get(d.legend).push({ ev: e.title, dt: e.published, kind: e.published >= legalFrom ? "season" : "last", players: e.day1, pl: d.overall });
    }
  }
  const listEvents = new Map();
  for (const d of snap.decks) if (d.ev && d.pl && d.ec >= MAJOR && d.dt >= from && !covered.has(norm(d.ev))) (listEvents.get(d.ev) || listEvents.set(d.ev, []).get(d.ev)).push(d);
  for (const [ev, ds] of listEvents) for (const d of ds) {
    const n = legendOfList(d);
    if (d.pl <= 16 && legendSet.has(n)) finishes.get(n).push({ ev, dt: d.dt, kind: d.dt >= legalFrom ? "season" : "last", players: d.ec, pl: d.pl, fromLists: true });
  }

  // The new format's events: per-legend pilots, top 8s and win rate where Rift Atlas has a
  // metagame, standings counts (top half only) where only riftbound.gg does.
  const newFormat = events.filter((e) => e.kind !== "last");
  const play = new Map(legends.map((n) => [n, []]));
  for (const e of newFormat) {
    if (e.meta?.length) for (const m of e.meta) {
      if (!play.has(m.legend)) continue;
      if (masked(e, m.legend)) {
        const real = Math.max(0, m.pilots - e.hidden);
        if (real) play.get(m.legend).push({ ev: e.name, dt: e.dt, kind: e.kind, players: e.players, rounds: e.rounds, pilots: real, top8: null, winRate: null, note: `${e.hidden} placeholder lists filed here removed; its top 8s and win rate are theirs` });
        continue;
      }
      play.get(m.legend).push({ ev: e.name, dt: e.dt, kind: e.kind, players: e.players, rounds: e.rounds, pilots: m.pilots, top8: m.top8, winRate: m.winRate });
    } else {
      const counts = new Map();
      for (const s of e.standings) if (s.legend && !masked(e, s.legend)) counts.set(s.legend, (counts.get(s.legend) || 0) + 1);
      for (const [n, k] of counts) if (play.has(n)) play.get(n).push({ ev: e.name, dt: e.dt, kind: e.kind, players: e.players, rounds: null, pilots: k, top8: e.standings.filter((s) => s.legend === n && s.pl <= 8).length, winRate: null, partial: `top ${e.standings.length} of ${e.players} only` });
    }
  }

  // Grades. Only strength calls; Jay's own call is kept beside them, never inside.
  const resolve = (k) => legendSet.has(k) ? k : (legends.filter((n) => n.split(",")[0] === k).length === 1 ? legends.find((n) => n.split(",")[0] === k) : null);
  const grades = new Map(legends.map((n) => [n, []]));
  const jay = new Map(), other = new Map(legends.map((n) => [n, []]));
  for (const s of experts.sources) for (const [k, g] of Object.entries(s.p || {})) {
    const n = resolve(k); if (!n) continue;
    if (s.id === "jayegger-call") { jay.set(n, g); continue; }
    const v = s.kind === "strength" ? gradeFor(g, s.scale) : null;
    const src = { id: s.id, who: s.who, url: s.url, date: s.date };
    if (v == null) other.get(n).push({ ...src, said: g, kind: s.kind });
    else grades.get(n).push({ ...src, said: g, value: r3(v) });
  }

  // Aurora: how many of the legend's recent lists run a never-play card (lib/avoid.mjs). The
  // field keeps them; the CLI marks them opponent-only.
  const auroraShare = new Map();
  for (const n of legends) {
    const ls = snap.decks.filter((d) => d.dt >= from && legendOfList(d) === n);
    const hit = ls.filter((d) => Object.keys(d.cards).some((c) => NEVER_PLAY.has(cardOf(c)?.n))).length;
    if (ls.length) auroraShare.set(n, r3(hit / ls.length));
  }

  // RESULTS: the new format's sanctioned events, never its previews (an online event before the
  // legal date is a preview, not a result). Top 8s against pilots where Rift Atlas has the
  // metagame; Day 2 against Day 1 from Riot's RQ tables. Weighted to the recent (HALF_LIFE).
  const seasonRQ = topdecks.events.filter((e) => e.field?.length && e.published >= legalFrom && e.field.some((x) => x.d2 != null));
  const seasonMajors = events.filter((e) => e.kind === "season" && (e.players || 0) >= MAJOR);
  const over = handedOver({ rqTables: seasonRQ.length, majors: seasonMajors.length });
  const age = (dt) => Math.max(0, day(today) - day(dt));
  const resultRows = new Map(legends.map((n) => [n, []]));
  for (const e of events.filter((e) => e.kind === "season" && e.meta?.length && e.players)) {
    const cut = Math.min(8, e.players), T = e.meta.reduce((t, m) => t + m.top8, 0) || cut;
    for (const m of e.meta) if (resultRows.has(m.legend) && !masked(e, m.legend)) resultRows.get(m.legend).push({ o: m.top8, e: m.pilots * T / e.players, age: age(e.dt) });
  }
  for (const e of seasonRQ) {
    const D1 = e.field.reduce((t, x) => t + x.d1, 0), D2 = e.field.reduce((t, x) => t + (x.d2 || 0), 0);
    for (const x of e.field) if (resultRows.has(x.legend)) resultRows.get(x.legend).push({ o: x.d2 || 0, e: x.d1 * D2 / D1, age: age(e.published) });
  }

  const out = legends.map((name) => {
    const isNew = isNewLegend(name);
    const rec = isNew ? null : recordOf(name);
    const pl = play.get(name);
    const pilots = pl.reduce((t, x) => t + x.pilots, 0);
    const con = consensus(grades.get(name).map((g) => g.value));
    const expertTier = con && con.n >= 2 ? con.tier : null;
    const res = resultsRatio(resultRows.get(name));
    const results = { O: r3(res.O), E: r3(res.E), ratio: r3(res.ratio), tier: res.tier };
    // Before the handover the tier is the experts'; after it, the new format's results',
    // wherever they are deep enough — the experts' grade stays beside it as the cross-check.
    const tierFrom = over && res.tier ? "results" : expertTier ? "experts" : null;
    const tier = tierFrom === "results" ? res.tier : expertTier;
    const flags = [];
    const dis = tierFrom === "experts" ? disagreement(tier, rec) : null;
    if (dis) flags.push(`${lastSet} record: ${dis.says}`);
    if (tierFrom === "results" && expertTier && Math.abs(LETTERS.indexOf(expertTier) - LETTERS.indexOf(tier)) >= DISAGREE_TIERS) flags.push(`creators said ${expertTier}`);
    if (!tier) flags.push(con && con.n ? "not enough grades" : "no grades");
    if ((auroraShare.get(name) || 0) >= 0.3) flags.push("Aurora builds: opponent only");
    return {
      legend: name, isNew,
      tier, tierFrom, expertTier, results,
      experts: con ? { n: con.n, median: r3(con.median), q1: r3(con.q1), q3: r3(con.q3), lo: r3(con.lo), hi: r3(con.hi), agreement: con.agreement } : null,
      grades: grades.get(name), otherCalls: other.get(name), jay: jay.get(name) ?? null,
      record: rec,
      top16: finishes.get(name).sort((a, b) => b.dt.localeCompare(a.dt)),
      play: pl.sort((a, b) => b.dt.localeCompare(a.dt)), pilots,
      group: groupOf(pilots, rec ? rec.share : null),
      aurora: auroraShare.get(name) ?? null,
      notes: (inputs.rows || []).filter((r) => r.legend === name).map((r) => ({ why: r.why, cards: r.cards || [], verified: !!r.verified })),
      flags,
    };
  });

  const doc = {
    generatedAt: today, set: newest, legalFrom, lastSet, lastFormatFrom: lastFrom,
    // forecast: no sanctioned result in the new format yet · early: results, not yet enough to
    // hand over · results: handed over (lib/field.mjs handedOver).
    phase: over ? "results" : events.some((e) => e.kind === "season") ? "early" : "forecast",
    handover: { rqTables: seasonRQ.length, majors: seasonMajors.length },
    note: "Counts and quotes, no score (lib/field.mjs). TIER is the experts' median grade; RECORD is last format's RQ Day 2 conversion and top-16s at 40+ player events; PLAY is the new format's events. Placeholder lists count as hidden, never as a legend.",
    rules: { minPlayers: MIN_PLAYERS, major: MAJOR, windowDays: WINDOW_DAYS },
    sources: { rq: rq.map((e) => e.title), events: events.length, newFormat: newFormat.length, majors: majors.length, fetched: log.fetched, cached: log.cached, failed: log.failed.length },
    legends: out,
    events: events.sort((a, b) => b.dt.localeCompare(a.dt)),
  };
  await writeFile(new URL("../data/field.json", import.meta.url), JSON.stringify(doc) + "\n");
  console.log(`field: ${out.length} legends · ${events.length} events (${newFormat.length} ${newest}-format, ${majors.length} with ${MAJOR}+ players) · fetched ${log.fetched}, cached ${log.cached}${log.failed.length ? `, FAILED ${log.failed.length}: ${log.failed.slice(0, 3).join("; ")}` : ""}`);
  console.log(`  placeholders: ${events.filter((e) => e.hidden).map((e) => `${e.name} ${e.hidden} (filed as ${e.hiddenAs.join(", ") || "?"})`).join(" · ") || "none"}`);
};

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main().catch((e) => { console.error(e.stack || e); process.exit(1); });
