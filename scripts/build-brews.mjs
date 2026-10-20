#!/usr/bin/env node
// Regenerates data/brews.json: for every legend, a winning list changed on purpose
// (lib/brew.mjs) — its winners' consensus with the role swaps lib/swaps.mjs has a reason
// for, or, for a legend too thin to anchor on, a port of a proven list in its colours.
// Fetches nothing; it reads the deck snapshot, the catalog, docs/archetypes.md and
// data/research.json, so it runs after build-research in the refresh.
//
//   node scripts/build-brews.mjs [legend substring]
//
// The method is docs/deckbuilding.md's; the swap logic is backtested against the Radiance
// previews in lib/swaps.test.mjs. What it computes here:
// - ANCHOR LISTS: a legend's placed lists from Radiance-format events when it has
//   MIN_PLACED of them, else all its placed lists.
// - SHELLS for ports: the same-colour legend with MIN_SHELL+ placed lists that shares the
//   most of this legend's plan (Engine line and heading), most placed lists breaking ties.
// - QUALITY: the share of lists that could play a card that do, for the "passed over" rule.
// - NEW: a card from a set legal for under NEW_DAYS — no results can have judged it yet.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog, SET_LEGAL_FROM } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";
import { headingSubKeys } from "../lib/infer.mjs";
import { anchorBrew, portBrew } from "../lib/brew.mjs";
import { docEngineLine, docEngineKeys } from "../lib/research.mjs";
import { buildDeck, simulate, sweepRunes } from "../lib/sim.mjs";

const MIN_PLACED = 5, MIN_SHELL = 10, MIN_ELIGIBLE = 5, NEW_DAYS = 30, GAMES = 2000;
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
  const today = new Date().toISOString().slice(0, 10);

  const usable = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const placedOf = (d) => (d.tour && d.pl != null) || Number(d.cp) > 0;
  const identOf = (L) => (L.d || []).filter((x) => x !== "Colorless").sort().join("/");
  const names = (d) => new Set(Object.keys(d.cards).map((k) => card(k)?.n).filter(Boolean));
  const newSet = (s) => { const from = SET_LEGAL_FROM[s] || (banned?.standard?.upcoming || []).find((u) => u.set === s)?.from; return !!from && (from > today || (Date.parse(today) - Date.parse(from)) / 864e5 < NEW_DAYS); };
  const isNew = (c) => newSet(c.s);
  // A Radiance-format event: half or more of its lists run a card from the newest set.
  const evs = new Map();
  for (const d of usable) { if (!d.ev) continue; const v = evs.get(d.ev) || evs.set(d.ev, { n: 0, nw: 0 }).get(d.ev); v.n++; if (Object.keys(d.cards).some((k) => card(k) && newSet(card(k).s))) v.nw++; }
  const newEvents = new Set([...evs].filter(([, v]) => v.n >= 8 && v.nw / v.n >= 0.5).map(([e]) => e));

  // QUALITY: share of the lists whose colours allow a card that run it.
  const lists = new Map(), has = new Map();
  for (const d of usable) { const id = identOf(card(d.lg)); lists.set(id, (lists.get(id) || 0) + 1); for (const n of names(d)) { const m = has.get(n) || has.set(n, new Map()).get(n); m.set(id, (m.get(id) || 0) + 1); } }
  const quality = new Map();
  for (const c of idx.cards) {
    if (c.v || quality.has(c.n) || !["Unit", "Spell", "Gear"].includes(c.t)) continue;
    const ds = (c.d || []).filter((x) => x !== "Colorless");
    let n = 0, w = 0;
    for (const [id, k] of lists) if (ds.every((x) => id.split("/").includes(x))) { n += k; w += has.get(c.n)?.get(id) || 0; }
    quality.set(c.n, n >= MIN_ELIGIBLE ? { rate: round(w / n, 3), n } : { rate: null, n: 0 });
  }

  const legends = new Map();
  for (const c of idx.cards) if (c.t === "Legend" && !c.v) { const n = idx.legendName(c), h = legends.get(n); if (!h || (/ - Starter$/.test(h.n) && !/ - Starter$/.test(c.n))) legends.set(n, c); }
  const byLegend = new Map();
  for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }
  const heading = (name) => (md.match(new RegExp(`^### ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} — ([^\\n*·]+)`, "m")) || [])[1]?.trim() || "";
  const engineOf = (name) => [...new Set([...docEngineKeys(docEngineLine(md, name)), ...headingSubKeys(heading(name))])].filter((k) => k !== "none");
  // The lists a legend is anchored on: Radiance-format placings if there are enough.
  const anchorLists = (name) => {
    const placed = (byLegend.get(name) || []).filter(placedOf);
    const era = placed.filter((d) => newEvents.has(d.ev));
    return era.length >= MIN_PLACED ? { ds: era, era: true } : placed.length >= MIN_PLACED ? { ds: placed, era: false } : null;
  };
  const shareMap = (ds) => { if (!ds || ds.length < MIN_PLACED) return null; const m = new Map(); for (const d of ds) for (const n of names(d)) m.set(n, (m.get(n) || 0) + 1 / ds.length); return m; };
  const poolOf = (L) => {
    const ident = new Set((L.d || []).filter((x) => x !== "Colorless")), seen = new Set();
    return idx.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).every((x) => x === "Colorless" || ident.has(x)) && !idx.bannedNames.has(c.n)
      && !(idx.notYetStandard(c) && !idx.notYetStandard(c).from) && !/ - Starter$/.test(c.n) && !seen.has(c.n) && seen.add(c.n));
  };
  const runeCards = {};
  for (const c of idx.cards) if (c.t === "Rune" && !c.v && (c.d || []).length === 1 && !runeCards[c.d[0]]) runeCards[c.d[0]] = c.c;

  const brews = [];
  for (const [name, L] of legends) {
    if (only && !name.toLowerCase().includes(only)) continue;
    const engine = engineOf(name);
    const ctx = { pool: poolOf(L), quality, isNew, research: R, engine };
    const meta = { legend: name, code: L.c, heading: heading(name), engine };
    const a = anchorLists(name);
    let b;
    if (a) {
      b = anchorBrew(L, idx, consensus(a.ds), card, { ...ctx, own: shareMap(a.ds), ownLists: a.ds.length },
        { ...meta, basis: `${a.ds.length} placed ${name.split(",")[0]} lists${a.era ? " from Radiance-format events" : ""}`, lists: a.ds.length });
    } else {
      // A port: the same-colour legend whose plan overlaps most, with enough placings.
      const shells = [...legends].filter(([n, S]) => n !== name && identOf(S) === identOf(L) && anchorLists(n)?.ds.length >= MIN_SHELL)
        .map(([n, S]) => ({ name: n, legend: S, lists: anchorLists(n).ds.length, overlap: engineOf(n).filter((k) => engine.includes(k)).length }))
        .sort((x, y) => y.overlap - x.overlap || y.lists - x.lists);
      const s = shells[0];
      if (!s) { brews.push({ ...meta, kind: "none", why: `no list to anchor on: under ${MIN_PLACED} placed ${name.split(",")[0]} lists and no proven list in its colours`, swaps: [], rows: [] }); continue; }
      const own = byLegend.get(name) || [];
      b = portBrew(L, idx, { ...s, con: consensus(anchorLists(s.name).ds), engine: engineOf(s.name) }, card, { ...ctx, own: shareMap(own), ownLists: own.length },
        { ...meta, basis: `ported from ${s.lists} placed ${s.name.split(",")[0]} lists (same colours${s.overlap ? ", same plan" : ""})`, lists: own.filter(placedOf).length });
    }

    // Goldfish, and whether another rune split plays better (offered, never applied to an
    // anchor — its runes are the winners').
    try {
      const deck = buildDeck(b.cards, { BY: idx.BY });
      const sw = sweepRunes(deck, { games: 1000 });
      if (sw?.change) b.runeNote = `the rune sweep plays ${sw.best.split} better`;
      const s = simulate(deck, { games: GAMES, seed: 1 });
      b.sim = { energy: round(s.play.spent.slice(0, 4).reduce((x, y) => x + y, 0), 1), units3: round(s.play.units[2], 1), twoUnitsByT3: round(s.play.twoUnitsByT3) };
    } catch { /* a list the sim cannot read stays unsimulated */ }
    // Worth showing: a port, a new card doing a job better, or a research answer. Swaps that
    // only pick between the winners' own alternatives are the consensus's flex, which the idea
    // page already shows.
    b.worth = b.kind === "port" || b.swaps.some((s) => s.kind !== "alt");
    brews.push(b);
  }

  const out = {
    generatedAt: today,
    source: "lib/brew.mjs and lib/swaps.mjs over data/decks.json (anchor lists, shells, quality), the catalog, docs/archetypes.md (each legend's plan), data/research.json",
    note: "Winning lists changed on purpose, not generated: each starts from its legend's winners (or, for a legend too thin to anchor on, a proven list in its colours) and changes only what has a reason — other winners' choices, a research answer, or a new card doing a job for less. Untested: log games with them in the match journal.",
    method: "docs/deckbuilding.md", newEvents: [...newEvents], brews,
  };
  if (!only) await writeFile(new URL("../data/brews.json", import.meta.url), JSON.stringify(out));
  const worth = brews.filter((b) => b.worth);
  console.log(`${brews.length} legends · ${worth.length} brews worth showing (${brews.filter((b) => b.kind === "port").length} ports, ${brews.filter((b) => b.kind === "anchor" && b.swaps.length).length} anchors with swaps) · ${brews.filter((b) => b.kind === "none").length} with nothing to anchor on`);
  for (const b of brews) console.log(`  ${b.kind === "none" ? "--" : b.legal ? "  " : "!!"} ${b.legend.slice(0, 32).padEnd(32)} ${b.kind.padEnd(6)} ${String(b.swaps.length).padStart(2)} swaps · ${b.basis || b.why}${b.sim ? ` · E4 ${b.sim.energy}` : ""}${b.kind !== "none" && !b.legal ? ` · ${b.checks.filter((k) => k.ok === false).map((k) => `${k.label}: ${k.val}`).join("; ")}` : ""}`);
  if (only) for (const b of brews) {
    if (b.cut?.length) console.log(`     cut from the shell: ${b.cut.join(", ")}`);
    for (const r of b.rows.filter((r) => r.change)) console.log(`     ${r.change.padEnd(7)} ${r.qty} ${r.name.padEnd(28)} ${r.why}`);
    for (const s of b.swaps) console.log(`     swap    out ${s.copies} ${s.out} → in ${s.in}: ${s.why}`);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-brews: ${e.message}`); process.exit(1); });
