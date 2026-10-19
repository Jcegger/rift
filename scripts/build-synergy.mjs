#!/usr/bin/env node
// Regenerates data/synergy.json: which cards are played together far more than chance,
// and which legends each card belongs to. Fetches nothing — it reads data/decks.json.
//
//   node scripts/build-synergy.mjs
//
// This is how the repo finds combos without understanding them. Stellacorn Herder is in
// 9% of placed lists and 96% of placed Irelia lists, because Irelia's legend readies a
// chosen unit and Herder draws whenever it moves. Nothing here knows that sentence; it
// sees the 96% and says the two go together.
//
// The baseline is what makes it mean something. Two Calm/Chaos cards appear together
// mostly because only Calm/Chaos decks can play either, so "together more than chance" is
// measured against the lists that COULD play both — those whose legend's domains include
// every domain on both cards — never against the whole snapshot. A pair is reported when
// the second card appears with the first at least LIFT times as often as it does in those
// lists, in at least MIN_CO lists. It is a count of what people build, not a proof that
// the cards combo: two good cards in the same colours can pass it too.
//
// Lists playing a card banned since are left out, so an old format's staples do not pass
// as today's partners. Unplaced brews are kept: a new card's partners show up in brews
// long before it has results, which is exactly when they are worth knowing.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";

const MIN_LISTS = 8;      // a card needs this many lists before its partners mean anything
const MIN_CO = 4;
const LIFT = 2;
const MIN_SHARE = 0.3;    // and the partner must be in at least this share of the card's lists
const KEEP = 8;

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x) => Math.round(x * 100) / 100;

const main = async () => {
  const [cat, extras, banned, snap] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json")]);
  const known = new Set(cat.cards.map((c) => c.c));
  const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;

  // One record per list: its legend, its identity (the legend's domains) and the set of
  // card names in it, runes, battlefields and the legend itself left out.
  const lists = [];
  let skipped = 0;
  for (const d of snap.decks) {
    const L = d.lg && card(d.lg);
    if (!L) continue;
    const names = new Set();
    let bannedHere = false;
    for (const code of Object.keys(d.cards)) {
      const c = card(code);
      if (!c || ["Legend", "Rune", "Battlefield", "Token"].includes(c.t)) continue;
      if (idx.bannedNames.has(c.n)) bannedHere = true;
      names.add(c.n);
    }
    if (bannedHere) { skipped++; continue; }
    lists.push({ legend: idx.legendName(L), ident: [...(L.d || [])].filter((x) => x !== "Colorless").sort().join("+"), names });
  }

  // Per identity: how many lists, and how many play each card.
  const idents = new Map();
  for (const l of lists) {
    const e = idents.get(l.ident) || { n: 0, has: new Map() };
    e.n++;
    for (const n of l.names) e.has.set(n, (e.has.get(n) || 0) + 1);
    idents.set(l.ident, e);
  }
  const domainsOf = new Map();
  for (const c of idx.cards) if (!domainsOf.has(c.n)) domainsOf.set(c.n, (c.d || []).filter((x) => x !== "Colorless"));
  const fits = (ident, doms) => doms.every((x) => ident.split("+").includes(x));
  // Among lists whose identity covers every domain in `doms`: how many, and how many play `name`.
  const eligible = (doms, name) => {
    let n = 0, has = 0, hasA = 0;
    for (const [ident, e] of idents) if (fits(ident, doms)) { n += e.n; has += e.has.get(name) || 0; }
    return { n, has };
  };

  // Lists per card, and co-occurrence for every pair of cards with enough lists.
  const count = new Map();
  for (const l of lists) for (const n of l.names) count.set(n, (count.get(n) || 0) + 1);
  const big = new Set([...count].filter(([, n]) => n >= MIN_LISTS).map(([n]) => n));
  const co = new Map();   // a -> Map(b -> lists with both)
  for (const l of lists) {
    const ns = [...l.names].filter((n) => big.has(n));
    for (const a of ns) {
      const m = co.get(a) || co.set(a, new Map()).get(a);
      for (const b of ns) if (a !== b) m.set(b, (m.get(b) || 0) + 1);
    }
  }

  // Legend affinity: the card's share of a legend's lists against its share of every list
  // that could play it.
  const byLegend = new Map();
  for (const l of lists) (byLegend.get(l.legend) || byLegend.set(l.legend, []).get(l.legend)).push(l);

  const isRad = new Map();
  for (const c of idx.cards) if (!isRad.has(c.n)) isRad.set(c.n, (idx.byId.get(idx.identity(c)) || [c]).every((p) => p.s === "RAD"));

  const cards = {};
  for (const a of big) {
    const da = domainsOf.get(a) || [];
    const base = eligible(da, a);
    const legends = [];
    for (const [lg, ls] of byLegend) {
      if (ls.length < 5 || !fits(ls[0].ident, da)) continue;
      const share = ls.filter((l) => l.names.has(a)).length / ls.length;
      const lift = base.n ? share / (base.has / base.n) : 0;
      if (share >= MIN_SHARE && lift >= LIFT) legends.push({ name: lg, share: round(share), lift: round(lift), lists: ls.length });
    }
    legends.sort((x, y) => y.share - x.share || y.lift - x.lift);
    const withs = [];
    for (const [b, both] of co.get(a) || []) {
      if (both < MIN_CO) continue;
      const doms = [...new Set([...da, ...(domainsOf.get(b) || [])])];
      // P(b | a), over the lists with a that could also play b; against P(b) over every
      // list that could play both.
      let aCanB = 0;
      for (const [ident, e] of idents) if (fits(ident, doms)) aCanB += e.has.get(a) || 0;
      const pba = aCanB ? both / aCanB : 0;
      const e = eligible(doms, b);
      const pb = e.n ? e.has / e.n : 0;
      const lift = pb ? pba / pb : 0;
      if (pba >= MIN_SHARE && lift >= LIFT) withs.push({ name: b, share: round(pba), lift: round(lift), co: both, rad: isRad.get(b) || false });
    }
    withs.sort((x, y) => y.share * Math.log(y.lift) - x.share * Math.log(x.lift));
    if (!legends.length && !withs.length) continue;
    cards[a] = { n: count.get(a), rad: isRad.get(a) || false, legends: legends.slice(0, 4), with: withs.slice(0, KEEP) };
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "data/decks.json, placed lists and brews, read against data/cards.json",
    note: `Counts of what people build together, not proof of a combo. A partner is reported when it appears with the card at least ${LIFT}x as often as in every list that could play both, in ${MIN_CO}+ lists and ${MIN_SHARE * 100}%+ of the card's lists.`,
    lists: lists.length, skippedBanned: skipped, window: snap.window,
    cards,
  };
  await writeFile(new URL("../data/synergy.json", import.meta.url), JSON.stringify(out) + "\n");
  console.log(`${lists.length} lists (${skipped} skipped for cards banned since) · ${big.size} cards with ${MIN_LISTS}+ lists · ${Object.keys(cards).length} with partners or a home legend`);
  for (const n of ["Stellacorn Herder", "Reckless Innovator", "Nocturne, Horrifying", "Spiderling"]) {
    const c = cards[n]; if (!c) { console.log(`  ${n}: nothing`); continue; }
    console.log(`  ${n} (${c.n} lists): legends ${c.legends.map((l) => `${l.name} ${Math.round(l.share * 100)}% ×${l.lift}`).join(", ") || "—"}`);
    console.log(`      with ${c.with.map((w) => `${w.name} ${Math.round(w.share * 100)}% ×${w.lift}`).join(", ") || "—"}`);
  }
};

main().catch((e) => { console.error(`build-synergy: ${e.message}`); process.exit(1); });
