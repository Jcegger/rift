#!/usr/bin/env node
// Regenerates data/brews.json: a brew for every legend — a legal 40 built from its own
// cards outward by lib/brew.mjs — with why each card is in, a goldfish run, and how far
// it is from what the legend's lists actually play. Fetches nothing; it reads the deck
// snapshot, the catalog, docs/archetypes.md and data/research.json, so it runs after
// build-research in the refresh.
//
//   node scripts/build-brews.mjs [legend substring]
//
// What it computes for lib/brew.mjs:
// - QUALITY: for each card, the share of lists that could play it (their legend's
//   colours allow it) that do. A Radiance card is counted only over lists posted since
//   Radiance was revealed, so its preview adoption counts and its absence from Vendetta
//   does not. Fewer than MIN_ELIGIBLE such lists is unknown, not zero.
// - TEMPLATES: the units and cost curve of real decks of each main archetype, averaged
//   over legends whose heading in docs/archetypes.md names that archetype.
// - BATTLEFIELDS: the three the legend's lists use most, else its colour pair's, else
//   the field's.
// The runes start from the Power the brew asks of each domain and take the simulator's
// rune sweep when it says a split plays better.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";
import { inferLegend, MAINS } from "../lib/infer.mjs";
import { brew, BUCKETS, W } from "../lib/brew.mjs";
import { docEngineLine, docEngineKeys } from "../lib/research.mjs";
import { buildDeck, simulate, sweepRunes } from "../lib/sim.mjs";

const MIN_ELIGIBLE = 5;
const MIN_PLACED = 5;
const RAD_REVEALED = "2026-09-25";   // Radiance previews began at the Los Angeles RQ
const GAMES = 2000;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;

const main = async () => {
  const only = (process.argv[2] || "").toLowerCase();
  const [cat, extras, banned, snap, R] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("research.json").catch(() => null)]);
  const md = await readFile(new URL("../docs/archetypes.md", import.meta.url), "utf8").catch(() => "");
  const known = new Set(cat.cards.map((c) => c.c));
  const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const { consensus } = counter(idx, card);

  const usable = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const identOf = (d) => (card(d.lg).d || []).filter((x) => x !== "Colorless").sort().join("/");
  const hasRad = (d) => Object.keys(d.cards).some((k) => card(k)?.s === "RAD");

  // QUALITY, counted per colour identity first so each card sums the identities that allow it.
  const lists = { all: new Map(), era: new Map() }, has = { all: new Map(), era: new Map() };
  for (const d of usable) {
    const id = identOf(d);
    const era = d.dt >= RAD_REVEALED || hasRad(d);
    for (const k of era ? ["all", "era"] : ["all"]) {
      lists[k].set(id, (lists[k].get(id) || 0) + 1);
      for (const n of new Set(Object.keys(d.cards).map((x) => card(x)?.n).filter(Boolean))) {
        const m = has[k].get(n) || has[k].set(n, new Map()).get(n);
        m.set(id, (m.get(id) || 0) + 1);
      }
    }
  }
  const quality = new Map();
  for (const c of idx.cards) {
    if (c.v || quality.has(c.n) || !["Unit", "Spell", "Gear"].includes(c.t)) continue;
    const k = c.s === "RAD" ? "era" : "all";
    const ds = (c.d || []).filter((x) => x !== "Colorless");
    let n = 0, w = 0;
    for (const [id, cnt] of lists[k]) if (ds.every((x) => id.split("/").includes(x))) { n += cnt; w += has[k].get(c.n)?.get(id) || 0; }
    quality.set(c.n, n >= MIN_ELIGIBLE ? { rate: round(w / n, 3), n, era: k === "era" } : { rate: null, n: 0, era: k === "era" });
  }

  // The legends, Starter-only printings included (the Bladesman).
  const legends = new Map();
  for (const c of idx.cards) if (c.t === "Legend" && !c.v) { const n = idx.legendName(c), h = legends.get(n); if (!h || (/ - Starter$/.test(h.n) && !/ - Starter$/.test(c.n))) legends.set(n, c); }
  const byLegend = new Map();
  for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }
  const headingMain = (name) => {
    const h = (md.match(new RegExp(`^### ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} — ([^\\n*·]+)`, "m")) || [])[1] || "";
    return MAINS.find((m) => h.trim().split(/[\s,]+/).includes(m)) || null;
  };
  const coreOf = (name) => {
    const ls = byLegend.get(name) || [];
    const placed = ls.filter((d) => (d.tour && d.pl != null) || Number(d.cp) > 0);
    const from = placed.length >= MIN_PLACED ? placed : ls;
    return from.length ? { from, con: consensus(from) } : null;
  };

  // TEMPLATES from the consensus lists of legends whose heading names each main archetype.
  const acc = Object.fromEntries(MAINS.map((m) => [m, { n: 0, units: 0, buckets: BUCKETS.map(() => 0) }]));
  const cores = new Map();
  for (const [name] of legends) {
    const core = coreOf(name); cores.set(name, core);
    const m = headingMain(name);
    if (!core || !m || core.from.length < MIN_PLACED) continue;
    const rows = core.con.main.map((r) => ({ ...r, c: card(r.code) })).filter((r) => r.c && ["Unit", "Spell", "Gear"].includes(r.c.t));
    const t = acc[m]; t.n++;
    for (const r of rows) { t.units += r.c.t === "Unit" ? r.copies : 0; t.buckets[BUCKETS.findIndex(([lo, hi]) => (r.c.e ?? 0) >= lo && (r.c.e ?? 0) <= hi)] += r.copies; }
  }
  const templates = {};
  for (const [m, t] of Object.entries(acc)) if (t.n) {
    const b = t.buckets.map((x) => x / t.n), s = b.reduce((a, x) => a + x, 0);
    templates[m] = { from: t.n, units: Math.round(t.units / t.n), buckets: b.map((x) => Math.round((x * 40) / s)) };
  }

  const bfOf = (lsts) => {
    const cnt = new Map();
    for (const d of lsts) for (const [k] of Object.entries(d.cards)) { const c = card(k); if (c?.t === "Battlefield" && !idx.bannedNames.has(c.n)) { const e = cnt.get(c.n) || { name: c.n, code: c.c, n: 0 }; e.n++; cnt.set(c.n, e); } }
    return [...cnt.values()].sort((a, b) => b.n - a.n);
  };
  const runeCards = {};
  for (const c of idx.cards) if (c.t === "Rune" && !c.v && (c.d || []).length === 1 && !runeCards[c.d[0]]) runeCards[c.d[0]] = c.c;

  const brews = [];
  for (const [name, L] of legends) {
    if (only && !name.toLowerCase().includes(only)) continue;
    const core = cores.get(name);
    const coreRows = core ? core.con.main.map((r) => ({ ...r, c: card(r.code) })).filter((r) => r.c) : null;
    const inferred = inferLegend(L, idx, coreRows);
    const pairLists = usable.filter((d) => identOf(d) === (L.d || []).filter((x) => x !== "Colorless").sort().join("/"));
    const bfs = [];
    for (const src of [bfOf(byLegend.get(name) || []), bfOf(pairLists), bfOf(usable)]) for (const b of src) if (bfs.length < 3 && !bfs.some((x) => x.name === b.name)) bfs.push(b);
    const weights = process.env.BREW_W ? Object.fromEntries(process.env.BREW_W.split(",").map((x, i) => [["fit", "quality", "main"][i], Number(x)])) : W;
    // Its own lists' shares, by name, when it has any.
    let own = null;
    if (core) { own = new Map(); for (const d of core.from) for (const n of new Set(Object.keys(d.cards).map((k) => card(k)?.n).filter(Boolean))) own.set(n, (own.get(n) || 0) + 1 / core.from.length); }
    const b = brew(L, idx, { inferred, main: headingMain(name) || inferred.main, engine: docEngineKeys(docEngineLine(md, name)), quality, own, templates, research: R, battlefields: bfs, runeCards, weights });

    // Runes: take the sweep's split when it plays better.
    let sim = null;
    try {
      const deck = buildDeck(b.cards, { BY: idx.BY });
      const sw = sweepRunes(deck, { games: 1000 });
      if (sw?.change) {
        const [d1, d2] = sw.doms;
        b.runes = { [d1]: sw.best.k, [d2]: 12 - sw.best.k };
        for (const [d, n] of Object.entries(b.runes)) if (runeCards[d]) b.cards[runeCards[d]] = n;
        b.runeNote = `the rune sweep plays ${sw.best.split} better than the Power split`;
      }
      const s = simulate(buildDeck(b.cards, { BY: idx.BY }), { games: GAMES, seed: 1 });
      sim = { energy: round(s.play.spent.slice(0, 4).reduce((a, x) => a + x, 0), 1), units3: round(s.play.units[2], 1), twoUnitsByT3: round(s.play.twoUnitsByT3), noPlayT1T2: round(s.play.noPlayT1T2) };
    } catch { /* a brew the sim cannot read stays unsimulated */ }

    // How far from what the legend's lists play: copies in common, of 40.
    let vs = null;
    if (core) {
      const have = new Map(coreRows.filter((r) => ["Unit", "Spell", "Gear"].includes(r.c.t)).map((r) => [r.c.n, r.copies]));
      const common = b.rows.reduce((a, r) => a + Math.min(r.qty, have.get(r.name) || 0), 0);
      vs = { lists: core.from.length, common, of: 40, notInLists: b.rows.filter((r) => !have.has(r.name)).map((r) => r.name) };
    }
    brews.push({ ...b, sim, vsLists: vs, radCards: b.rows.filter((r) => r.rad).reduce((a, r) => a + r.qty, 0),
      legal: b.checks.every((k) => k.ok === "later"), legalFrom: b.checks.find((k) => k.ok === "later")?.val || null });
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "lib/brew.mjs over the catalog, data/decks.json (quality, battlefields, templates), docs/archetypes.md (main archetype), data/research.json (held-back cards)",
    note: "Brews, not results: built by rule from each legend's own cards outward — chosen champion, signature, then the cards that fit its sub-archetypes, weighted by how often players pick them when they can. Nobody has played these lists. Every card says why it is in.",
    templates, brews,
  };
  if (!only) await writeFile(new URL("../data/brews.json", import.meta.url), JSON.stringify(out));
  console.log(`${brews.length} brews · templates: ${Object.entries(templates).map(([m, t]) => `${m} u${t.units} [${t.buckets.join(" ")}] (${t.from})`).join(" · ")}`);
  for (const b of brews) console.log(`  ${b.legal ? "  " : "!!"} ${b.legend.slice(0, 32).padEnd(32)} ${(b.subName + " " + b.main).padEnd(26)} champ ${String(b.champion).slice(0, 24).padEnd(24)} RAD ${String(b.radCards).padStart(2)} · ${b.vsLists ? `${b.vsLists.common}/40 shared with ${b.vsLists.lists} lists` : "no lists"}${b.sim ? ` · E4 ${b.sim.energy} U3 ${b.sim.units3}` : ""}${b.legal ? "" : ` · ${b.checks.filter((k) => k.ok === false).map((k) => `${k.label}: ${k.val}`).join("; ")}`}`);
  if (only) for (const b of brews) { for (const r of b.rows) console.log(`     ${r.qty} ${r.name.padEnd(30)} ${String(r.cost).padStart(2)} ${r.type.padEnd(5)} ${r.role.padEnd(9)} ${r.why}`); console.log(`     runes ${JSON.stringify(b.runes)} ${b.runeNote || ""} · battlefields ${b.battlefields.map((x) => x.name).join(", ")}`); }
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-brews: ${e.message}`); process.exit(1); });
