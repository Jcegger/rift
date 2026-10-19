#!/usr/bin/env node
// Regenerates data/archetypes.json: what each legend's decks look like, measured, and
// what each colour pair's legends share. Fetches nothing — it reads data/decks.json,
// data/synergy.json and the catalog, so it runs after build-synergy in the refresh.
//
//   node scripts/build-archetypes.mjs
//
// The numbers are the half of an archetype that can be counted: the representative list
// (counted the same way as the Radiance consensus, lib/consensus.mjs, but over every
// placed list), its mix and curve, how much of it is interaction, how fast it develops
// in the goldfish, which engines its text runs on, and the cards it plays far more than
// its colours do. The label on top — aggro, tempo, midrange, control, ramp, combo — is a
// reading of those numbers by fixed thresholds, printed beside them so it can be argued
// with. The other half, what the deck is trying to do and how it wins, is written by hand
// in docs/archetypes.md and shown next to these.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";
import { deckEngines } from "../lib/engines.mjs";
import { inferLegend } from "../lib/infer.mjs";
import { buildDeck, simulate, classify } from "../lib/sim.mjs";

const MIN_PLACED = 5;     // below this a legend's profile is read from all its lists, labelled
const GAMES = 1000;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;

// The label, from the measured profile. Thresholds are set against decks whose style is
// not in question (README "Archetypes" lists them) and printed with the label.
export function label(p) {
  const why = [];
  if (p.topCopies >= 12) { why.push(`${p.topCopies} copies of one card`); return { label: "combo", why }; }
  // Ramp is accelerating toward something: big cards, not just a Gold token or two.
  if (p.big >= 6 || (p.ramp >= 4 && p.big >= 3)) { why.push(`${p.big} cards at 7+ Energy`, `${p.ramp} rune or Energy accelerants`); return { label: "ramp", why }; }
  // Spell-heavy is not control on its own (Irelia's spells are Reactions, not answers).
  if (p.interaction >= 12) { why.push(`${p.interaction} interaction`, `${p.spells} spells / ${p.units} units`); return { label: "control", why }; }
  if (p.avgCost <= 2.7 && p.units >= 20 && p.interaction <= 8) { why.push(`average cost ${p.avgCost}`, `${p.units} units`, `${p.interaction} interaction`); return { label: "aggro", why }; }
  if (p.reactive >= 10 && p.avgCost <= 3.2) { why.push(`${p.reactive} Hidden or Reaction cards`, `average cost ${p.avgCost}`); return { label: "tempo", why }; }
  why.push(`average cost ${p.avgCost}`, `${p.units} units / ${p.spells} spells`, `${p.interaction} interaction`);
  return { label: "midrange", why };
}

const main = async () => {
  const [cat, extras, banned, snap, syn] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("synergy.json")]);
  const known = new Set(cat.cards.map((c) => c.c));
  const all = [...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))];
  const idx = indexCatalog(all, banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const { consensus } = counter(idx, card);

  const usable = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const byLegend = new Map();
  for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }

  // Every legend in the catalog gets a row, with no lists if it has none: "no evidence" is
  // an answer. Starter legends fold onto their base (lib/decks.mjs identity).
  const legendCards = new Map();
  // A Starter printing folds onto its base legend, but counts when it is the only printing:
  // Master Yi, Wuju Bladesman exists only in a starter deck and has hundreds of lists.
  for (const c of idx.cards) if (c.t === "Legend" && !c.v) {
    const n = idx.legendName(c), had = legendCards.get(n);
    if (!had || (/ - Starter$/.test(had.n) && !/ - Starter$/.test(c.n))) legendCards.set(n, c);
  }

  const legends = [];
  for (const [name, L] of legendCards) {
    const lists = byLegend.get(name) || [];
    // A placed list is upstream's record (tour + place) OR a place the author claims in the
    // title (cp) — filtering on tour alone hides every RQ result (README "Results the flag
    // does not carry"); Kha'Zix's Barcelona and Utrecht finishes are claims.
    const placed = lists.filter((d) => (d.tour && d.pl != null) || Number(d.cp) > 0);
    const from = placed.length >= MIN_PLACED ? placed : lists;
    const domains = (L.d || []).filter((d) => d !== "Colorless").sort();
    const row = { name, code: L.c, champion: idx.championOf(L), domains, pair: domains.join("/"), legendText: L.x || "",
      isNew: (idx.byId.get(idx.identity(L)) || [L]).every((p) => p.s === "RAD"),
      lists: lists.length, placed: placed.length, claimed: placed.filter((d) => !d.tour).length, basis: !lists.length ? "none" : from === placed ? "placed" : "all lists",
      radShare: lists.length ? round(lists.filter((d) => Object.keys(d.cards).some((k) => card(k)?.s === "RAD")).length / lists.length) : 0 };
    // The archetype inferred from the cards alone (lib/infer.mjs): legend, chosen champion,
    // signature, colour pair, then the cards that should (or, with no lists, can) be in it.
    if (!from.length) { legends.push({ ...row, inferred: inferLegend(L, idx, null) }); continue; }
    const con = consensus(from);
    const mainRows = con.main.map((r) => ({ ...r, c: card(r.code) })).filter((r) => r.c);
    const sum = (f) => mainRows.reduce((a, r) => a + (f(r) ? r.copies : 0), 0);
    const units = sum((r) => r.c.t === "Unit"), spells = sum((r) => r.c.t === "Spell"), gear = sum((r) => r.c.t === "Gear");
    const costs = mainRows.flatMap((r) => Array(r.copies).fill(r.c.e ?? 0));
    // Without reminder text: a Gold token's "(… [Add] …)" is not a ramp card.
    const text = (r) => String(r.c.x || "").replace(/\([^)]*\)/g, " ");
    const profile = {
      units, spells, gear,
      avgCost: round(costs.reduce((a, b) => a + b, 0) / (costs.length || 1), 1),
      cheap: sum((r) => (r.c.e ?? 0) <= 2), big: sum((r) => (r.c.e ?? 0) >= 7),
      interaction: sum((r) => classify(r.c).role === "interaction"),
      draw: sum((r) => /\bdraw \d|\bdraw (a|one|two)\b/i.test(text(r))),
      ramp: sum((r) => /channel \d+ rune|\[add\]/i.test(text(r)) && r.c.t !== "Rune"),
      reactive: sum((r) => /\[hidden\]|\[reaction\]/i.test(text(r))),
      topCopies: Math.max(0, ...mainRows.map((r) => r.copies)),
    };
    const { label: lab, why } = label(profile);
    let sim = null;
    try {
      const s = simulate(buildDeck(con.cards, { BY: idx.BY }), { games: GAMES, seed: 1 });
      const e4 = (x) => x.spent.slice(0, 4).reduce((a, b) => a + b, 0);
      sim = { energy: round(e4(s.play), 1), units3: round(s.play.units[2], 1), might4: round(s.play.might[3], 1) };
    } catch { /* a list the sim cannot read stays unsimulated */ }
    const engines = deckEngines(con.cards, idx, { max: 0 }).slice(0, 3)
      .map((e) => ({ key: e.key, name: e.name, loop: e.loop, payoffs: e.payoffs.map((p) => p.legend ? "the legend" : p.name), enablers: e.enablers.map((p) => p.legend ? "the legend" : p.name) }));
    // The cards this legend plays far more than its colours do: its package.
    const pkg = Object.entries(syn.cards).map(([n, c]) => ({ n, l: c.legends.find((x) => x.name === name), rad: c.rad }))
      .filter((x) => x.l && x.l.share >= 0.5 && x.l.lift >= 2.5).sort((a, b) => b.l.lift * b.l.share - a.l.lift * a.l.share).slice(0, 8)
      .map((x) => ({ name: x.n, share: x.l.share, lift: x.l.lift, rad: x.rad }));
    legends.push({ ...row, from: from.length, profile, label: lab, why, sim, engines, package: pkg, inferred: inferLegend(L, idx, mainRows),
      core: mainRows.filter((r) => r.inc >= 0.75).map((r) => r.name) });
  }

  // Colour pairs: their legends, and the cards most of the pair's lists share regardless
  // of legend — what the colours themselves bring.
  const pairs = new Map();
  for (const l of legends) (pairs.get(l.pair) || pairs.set(l.pair, []).get(l.pair)).push(l);
  const pairRows = [];
  for (const [pair, ls] of [...pairs].sort()) {
    const lists = ls.flatMap((l) => (byLegend.get(l.name) || []).filter((d) => (d.tour && d.pl != null) || Number(d.cp) > 0));
    const has = new Map();
    for (const d of lists) for (const n of new Set(Object.keys(d.cards).map((k) => card(k)).filter((c) => c && !["Legend", "Rune", "Battlefield"].includes(c.t)).map((c) => c.n)))
      has.set(n, (has.get(n) || 0) + 1);
    const legendsWith = (n) => ls.filter((l) => (byLegend.get(l.name) || []).some((d) => Object.keys(d.cards).some((k) => card(k)?.n === n))).length;
    const staples = [...has].filter(([, k]) => lists.length && k / lists.length >= 0.4).map(([n, k]) => ({ name: n, share: round(k / lists.length), legends: legendsWith(n) }))
      .filter((x) => x.legends >= 2).sort((a, b) => b.share - a.share).slice(0, 10);
    pairRows.push({ pair, legends: ls.map((l) => ({ name: l.name, label: l.label || null, placed: l.placed, isNew: l.isNew })).sort((a, b) => b.placed - a.placed),
      placed: lists.length, staples });
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "data/decks.json (placed lists, or every list below 5 placed), data/synergy.json, data/cards.json",
    note: "Measured, not judged — the hand-written archetype in docs/archetypes.md is the one to read; this label is the numbers' view of the same deck: the representative list is counted from the lists, the label is a fixed-threshold reading of its numbers (see `why`). Game plans are hand-written in docs/archetypes.md.",
    window: snap.window,
    pairs: pairRows, legends: legends.sort((a, b) => a.pair.localeCompare(b.pair) || b.placed - a.placed),
  };
  await writeFile(new URL("../data/archetypes.json", import.meta.url), JSON.stringify(out) + "\n");
  console.log(`${legends.length} legends over ${pairRows.length} colour pairs`);
  for (const l of legends) if (l.profile) console.log(`  ${l.pair.padEnd(12)} ${l.name.slice(0, 32).padEnd(32)} ${String(l.placed).padStart(3)}p ${(l.label || "").padEnd(8)} u${l.profile.units} s${l.profile.spells} g${l.profile.gear} cost ${l.profile.avgCost} int ${l.profile.interaction} react ${l.profile.reactive} draw ${l.profile.draw} big ${l.profile.big} top ${l.profile.topCopies}${l.sim ? ` · E4 ${l.sim.energy} U3 ${l.sim.units3}` : ""}`);
};

main().catch((e) => { console.error(`build-archetypes: ${e.message}`); process.exit(1); });
