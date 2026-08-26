#!/usr/bin/env node
// Regenerates data/decks.json: recent tournament decklists, which is what "the meta"
// actually means here.
//
//   node scripts/build-decks.mjs [--limit 250]
//
// Source: riftbound.gg's public deck API (api.dotgg.gg/cgfw/getdecks), filtered to
// tournament entries only. No key and no auth. Every entry carries its event, the
// player's placement, and the full list, so meta share is counted from real results
// rather than guessed at.

import { writeFile, readFile } from "node:fs/promises";

const API = "https://api.dotgg.gg/cgfw/getdecks";
// The API caps a page at 30 no matter what limit you ask for, so asking for more and
// treating a short page as the end stops after one page.
const PAGE = 30;
const DEFAULT_LIMIT = 250;

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

// The filter object the site itself sends, with tournament entries only.
const filters = {
  hascrd: [], nothascrd: [], youtube: 0, smartsrch: "", format: "", date: "",
  color: [], collection: 0, topset: "", at: 0, is_tournament: 1, legalonly: 1,
  priceMin: "", priceMax: "", placement: "", leader: "",
};

async function getPage(page, limit) {
  const rq = { page, limit, srt: "date", direct: "desc", type: "", my: 0, myarchive: 0, fav: 0, getdecks: filters };
  const url = `${API}?game=riftbound&rq=${encodeURIComponent(JSON.stringify(rq))}`;
  const r = await fetch(url, {
    headers: { "User-Agent": "rift.jayegger.com deck builder", Origin: "https://riftbound.gg" },
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const d = await r.json();
  return Array.isArray(d) ? d : [];
}

// Match a deck's card code to the catalog. Deck lists use forms the gallery does not:
// "OGN-166" without a denominator, and uppercase variant suffixes like "UNL-113A".
function normColl(seg) {
  let s = String(seg ?? "").replace(/\s+/g, "");
  if (!s) return null;
  const star = /\*/.test(s) || /star$/i.test(s);
  s = s.replace(/\*/g, "").replace(/[-_]?star$/i, "");
  const m = /^([A-Za-z]*)0*(\d+)([A-Za-z]*)$/.exec(s);
  return m ? `${m[1].toUpperCase()}${Number(m[2])}${m[3].toUpperCase()}${star ? "*" : ""}` : null;
}
function keyOf(code) {
  const m = /^([A-Za-z]{2,5})[-\s]+(.+)$/.exec(String(code ?? "").trim());
  if (!m) return null;
  const n = normColl(m[2].replace(/\/\d+$/, ""));
  return n ? `${m[1].toUpperCase()}|${n}` : null;
}

const main = async () => {
  const want = Number(arg("limit", DEFAULT_LIMIT));

  const cat = JSON.parse(await readFile(new URL("../data/cards.json", import.meta.url), "utf8"));
  let extra = [];
  try {
    extra = JSON.parse(await readFile(new URL("../data/extras.json", import.meta.url), "utf8")).cards || [];
  } catch { /* optional */ }
  const byKey = new Map();
  for (const c of cat.cards.concat(extra)) {
    const k = keyOf(c.c);
    if (k && !byKey.has(k)) byKey.set(k, c);
  }
  // Deck lists cite printings the gallery never published, mostly alt-art basic runes
  // like "VEN-R02a". Fall back to the same-numbered base printing.
  const lookup = (code) => {
    const k = keyOf(code);
    if (!k) return null;
    if (byKey.has(k)) return byKey.get(k);
    const [set, coll] = k.split("|");
    const m = /^([A-Za-z]*\d+)[A-Za-z]+(\*?)$/.exec(coll);
    return m ? byKey.get(`${set}|${m[1]}${m[2]}`) || null : null;
  };

  process.stdout.write("fetching tournament decks… ");
  const raw = [];
  const seenSlug = new Set();
  for (let page = 1; raw.length < want && page <= 60; page++) {
    const batch = await getPage(page, PAGE);
    if (!batch.length) break;
    const before = raw.length;
    for (const d of batch) {
      if (!seenSlug.has(d.slug)) { seenSlug.add(d.slug); raw.push(d); }
    }
    // Stop when a page adds nothing new, which is how the end actually shows up.
    if (raw.length === before) break;
  }
  console.log(`${raw.length}`);

  const unknown = new Map();
  const decks = raw.slice(0, want).map((d) => {
    const cards = {};
    let legend = null, size = 0;
    for (const [code, qty] of Object.entries(d.deck || {})) {
      const q = Number(qty) || 0;
      if (!q) continue;
      cards[code] = q;
      size += q;
      const c = lookup(code);
      if (!c) unknown.set(code, (unknown.get(code) || 0) + 1);
      else if (c.t === "Legend" && !legend) legend = { code: c.c, name: c.n };
    }
    const t = d.tournament || {};
    return {
      s: d.slug,
      h: (d.humanname || "").trim(),
      lg: legend ? legend.code : null,
      ln: legend ? legend.name : null,
      ev: t.tournament_name || null,
      pl: t.place ?? null,
      dt: d.date ? new Date(Number(d.date) * 1000).toISOString().slice(0, 10) : null,
      vw: Number(d.views) || 0,
      pr: Math.round(Number(d.price) || 0),
      sz: size,
      cards,
    };
  }).filter((d) => d.sz > 0);

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "api.dotgg.gg/cgfw/getdecks (tournament entries, riftbound.gg)",
    decks,
  };
  await writeFile(new URL("../data/decks.json", import.meta.url), JSON.stringify(out) + "\n");

  // ── report ────────────────────────────────────────────────────────────
  const byArch = {};
  for (const d of decks) {
    const k = d.ln || "unidentified";
    (byArch[k] ??= { n: 0, best: 999 });
    byArch[k].n++;
    if (d.pl && d.pl < byArch[k].best) byArch[k].best = d.pl;
  }
  const ranked = Object.entries(byArch).sort((a, b) => b[1].n - a[1].n);
  console.log(`\n${decks.length} decks, ${ranked.length} archetypes, ` +
    `${new Set(decks.map((d) => d.ev)).size} events`);
  console.log("\ntop archetypes by tournament appearances:");
  for (const [name, v] of ranked.slice(0, 12)) {
    const share = ((v.n / decks.length) * 100).toFixed(1);
    console.log(`  ${name.padEnd(30)} ${String(v.n).padStart(3)} decks  ${share.padStart(5)}%` +
      (v.best < 999 ? `   best finish #${v.best}` : ""));
  }
  const sizes = [...new Set(decks.map((d) => d.sz))].sort((a, b) => a - b);
  console.log(`\ndeck sizes seen: ${sizes.join(", ")}`);
  if (unknown.size) {
    console.log(`\n${unknown.size} card codes not in the catalog:`);
    console.log("  " + [...unknown.entries()].slice(0, 12).map(([c, n]) => `${c} (x${n})`).join(", "));
  }
  const noLegend = decks.filter((d) => !d.lg).length;
  if (noLegend) console.log(`\nWARNING: ${noLegend} decks have no identifiable Legend`);
};

main().catch((e) => {
  console.error("\nbuild-decks failed:", e.message);
  process.exit(1);
});
