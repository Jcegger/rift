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
import { headingSubKeys, inferLegend } from "../lib/infer.mjs";
import { anchorBrew, coloursBrew } from "../lib/brew.mjs";
import { docEngineLine, docEngineKeys } from "../lib/research.mjs";
import { buildDeck, simulate, sweepRunes } from "../lib/sim.mjs";

// MIN_CROWD: with fewer placings, a legend's posted lists are the anchor — the consensus of
// a legend's unplaced lists shares 34 of 40 cards with its winners' (lib/blind.test.mjs).
const MIN_PLACED = 5, MIN_CROWD = 8, FIRST_W = 10, MIN_ELIGIBLE = 5, NEW_DAYS = 30, GAMES = 2000;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;

// The builder's inputs, with one legend optionally HIDDEN — its lists removed from
// everything (quality, shells, its own shares) and its research flags dropped — so it can
// be built blind and compared with what its winners actually play (lib/blind.test.mjs).
// blindEngine: read the legend's plan from card text alone (lib/infer.mjs), not from
// docs/archetypes.md, whose Engine lines were written with its lists in view.
//   hideMode: "all" hides every list of the legend (blind); "placed" only its placings, as
//   a legend looks before it has results (its posted lists remain).
//   rising: data/rising.json, the crowd's movement this week, for RISING swaps (none when a
//   legend is hidden: its own lists made the trend).
export function makeBrewer({ cat, extras, banned, snap, R = null, md = "", rising = null, hide = null, hideMode = "all", blindEngine = false }) {
  const known = new Set(cat.cards.map((c) => c.c));
  const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const { consensus } = counter(idx, card);
  const today = new Date().toISOString().slice(0, 10);

  const usableAll = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const placedOf0 = (d) => (d.tour && d.pl != null) || Number(d.cp) > 0;
  const usable = hide ? usableAll.filter((d) => idx.legendName(card(d.lg)) !== hide || (hideMode === "placed" && !placedOf0(d))) : usableAll;
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
  const engineOf = (name) => blindEngine && name === hide
    ? inferLegend(legends.get(name), idx, null).subs.slice(0, 2).map((x) => x.key)
    : [...new Set([...docEngineKeys(docEngineLine(md, name)), ...headingSubKeys(heading(name))])].filter((k) => k !== "none");
  // The lists a legend is anchored on: Radiance-format placings if there are enough.
  const anchorLists = (name) => {
    const placed = (byLegend.get(name) || []).filter(placedOf);
    const era = placed.filter((d) => newEvents.has(d.ev));
    if (era.length >= MIN_PLACED) return { ds: era, era: true, basis: "placed" };
    if (placed.length >= MIN_PLACED) return { ds: placed, era: false, basis: "placed" };
    // No results yet: the crowd's list. Every posted list counts, placed or not — and the
    // first placings steer it, each worth FIRST_W posted lists: the crowd plus a legend's
    // first two results predicts its later winners better (34.9 of 40) than either alone
    // (crowd 33.8, two results 30.8). Pros sometimes find what the crowd has not — Yasuo's
    // crowd plays movement; every winner plays the Spiderling swarm.
    const all = byLegend.get(name) || [];
    if (all.length < MIN_CROWD) return null;
    const un = all.filter((d) => !placedOf(d));
    return { ds: [...un, ...placed.flatMap((d) => Array(FIRST_W).fill(d))], era: false, basis: placed.length ? "crowd+results" : "crowd", lists: all.length, placed: placed.length };
  };
  const shareMap = (ds, min = MIN_PLACED) => { if (!ds || ds.length < min) return null; const m = new Map(); for (const d of ds) for (const n of names(d)) m.set(n, (m.get(n) || 0) + 1 / ds.length); return m; };
  const poolOf = (L) => {
    const ident = new Set((L.d || []).filter((x) => x !== "Colorless")), seen = new Set();
    return idx.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).every((x) => x === "Colorless" || ident.has(x)) && !idx.bannedNames.has(c.n)
      && !(idx.notYetStandard(c) && !idx.notYetStandard(c).from) && !/ - Starter$/.test(c.n) && !seen.has(c.n) && seen.add(c.n));
  };
  const runeCards = {};
  for (const c of idx.cards) if (c.t === "Rune" && !c.v && (c.d || []).length === 1 && !runeCards[c.d[0]]) runeCards[c.d[0]] = c.c;


  return { idx, card, consensus, legends, byLegend, placedOf, anchorLists, heading, engineOf, usable, usableAll, quality, newEvents, poolOf, isNew, shareMap, R,
    brew: (name, opts = {}) => brewOne(name, opts) };

  // noSwaps: the build alone, before any swap — what lib/blind.test.mjs scores (swaps deviate
  // from current winners on purpose; lib/swaps.test.mjs scores those).
  function brewOne(name, { forcePort = false, noSwaps = false } = {}) {
    const L = legends.get(name);
    const engine = engineOf(name);
    const ctx = { pool: poolOf(L), quality, isNew, research: name === hide ? null : R, engine, trend: name === hide ? null : rising?.legends?.[name]?.cards || null, ...(noSwaps ? { swapBudget: 0 } : {}) };
    const meta = { legend: name, code: L.c, heading: heading(name), engine };
    const a = forcePort ? null : anchorLists(name);
    if (a) return anchorBrew(L, idx, consensus(a.ds), card, { ...ctx, own: shareMap(a.ds), ownLists: a.lists ?? a.ds.length, ownLabel: a.basis === "placed" ? "winning lists" : "posted lists" },
      { ...meta, crowd: a.basis !== "placed",
        basis: a.basis === "crowd" ? `${a.lists} posted ${name.split(",")[0]} lists — no results yet, so the crowd's list (posted lists predict winners' closely)`
          : a.basis === "crowd+results" ? `${a.lists} posted ${name.split(",")[0]} lists, its ${a.placed} placing${a.placed === 1 ? "" : "s"} weighted ${FIRST_W}× — the crowd, steered by its first results`
          : `${a.ds.length} placed ${name.split(",")[0]} lists${a.era ? " from Radiance-format events" : ""}`, lists: a.lists ?? a.ds.length });
    // Too few lists to anchor on: build it from its colours' winners and its own cards.
    const own = byLegend.get(name) || [];
    const bfCount = new Map();
    for (const d of (own.length >= 2 ? own : usable.filter((x) => identOf(card(x.lg)) === identOf(L))))
      for (const k of Object.keys(d.cards)) { const c = card(k); if (c?.t === "Battlefield" && !idx.bannedNames.has(c.n)) { const e = bfCount.get(c.n) || { name: c.n, code: c.c, n: 0 }; e.n++; bfCount.set(c.n, e); } }
    const battlefields = [...bfCount.values()].sort((x, y) => y.n - x.n).slice(0, 3);
    return coloursBrew(L, idx, legendShares(), card, { ...ctx, own: own.length >= 2 ? shareMap(own, 2) : null, ownLists: own.length, runeCards, battlefields, swapBudget: noSwaps ? 0 : undefined },
      { ...meta, basis: `built from its colours' winning lists${own.length >= 2 ? ` and its own ${own.length} lists` : ""}`, lists: own.filter(placedOf).length });
  }
  // Each legend's card shares from its anchor lists, for building from colours.
  function legendShares() {
    if (legendShares.cache) return legendShares.cache;
    // Placed lists when a legend has enough, else all its lists: thin legends' choices count too.
    const src = (n) => { const all = byLegend.get(n) || [], placed = all.filter(placedOf); return placed.length >= MIN_PLACED ? placed : all.length >= MIN_PLACED ? all : null; };
    return (legendShares.cache = [...legends].map(([n, S]) => { const ds = src(n); return ds ? { name: n, domains: new Set((S.d || []).filter((d) => d !== "Colorless")), share: shareMap(ds) } : null; }).filter(Boolean));
  }
}

const main = async () => {
  const only = (process.argv[2] || "").toLowerCase();
  const [cat, extras, banned, snap, R, rising] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("research.json").catch(() => null), read("rising.json").catch(() => null)]);
  const md = await readFile(new URL("../docs/archetypes.md", import.meta.url), "utf8").catch(() => "");
  // The trend is the last build-rising run's (it runs after this, to log these suggestions).
  const brewer = makeBrewer({ cat, extras, banned, snap, R, md, rising });
  const { idx, legends, newEvents } = brewer;
  const today = new Date().toISOString().slice(0, 10);
  const brews = [];
  for (const [name] of legends) {
    if (only && !name.toLowerCase().includes(only)) continue;
    const b = brewer.brew(name);
    if (b.kind === "none") { brews.push(b); continue; }

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
    // Worth showing: a legend with no results (the crowd's list or one built from colours —
    // the only list it has), or an experiment to try.
    b.worth = b.kind === "colours" || b.crowd || b.swaps.length > 0;
    brews.push(b);
  }

  const out = {
    generatedAt: today,
    source: "lib/brew.mjs and lib/swaps.mjs over data/decks.json (anchor lists, shells, quality), the catalog, docs/archetypes.md (each legend's plan), data/research.json",
    note: "Net-deck plus experiments: each starts from its legend's winners' consensus (or, before results, the crowd's list) and applies only labelled experiments — a new card doing a job for less, a card rising in posted lists, a research answer. What other winners play instead is listed as options, not applied. Untested: log games in the match journal.",
    method: "docs/deckbuilding.md", newEvents: [...newEvents], brews,
  };
  if (!only) await writeFile(new URL("../data/brews.json", import.meta.url), JSON.stringify(out));
  const worth = brews.filter((b) => b.worth);
  console.log(`${brews.length} legends · ${worth.length} brews worth showing (${brews.filter((b) => b.crowd).length} from the crowd's lists, ${brews.filter((b) => b.kind === "colours").length} built from colours, ${brews.filter((b) => b.swaps.length).length} with experiments) · ${brews.filter((b) => b.kind === "none").length} with nothing to anchor on`);
  for (const b of brews) console.log(`  ${b.kind === "none" ? "--" : b.legal ? "  " : "!!"} ${b.legend.slice(0, 32).padEnd(32)} ${b.kind.padEnd(6)} ${String(b.swaps.length).padStart(2)} swaps · ${b.basis || b.why}${b.sim ? ` · E4 ${b.sim.energy}` : ""}${b.kind !== "none" && !b.legal ? ` · ${b.checks.filter((k) => k.ok === false).map((k) => `${k.label}: ${k.val}`).join("; ")}` : ""}`);
  if (only) for (const b of brews) {
    for (const r of b.rows.filter((r) => r.change)) console.log(`     ${r.change.padEnd(7)} ${r.qty} ${r.name.padEnd(28)} ${r.why}`);
    for (const s of b.swaps) console.log(`     swap    out ${s.copies} ${s.out} → in ${s.in}: ${s.why}`);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-brews: ${e.message}`); process.exit(1); });
