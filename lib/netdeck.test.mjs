// Tests for lib/netdeck.mjs, then its measurement on the real lists.
//
//   node lib/netdeck.test.mjs           # checks, and the leave-one-out table (~30 s)
//
// The measurement asks what the deckbuilding doc's blind test asks — how many of a winning
// list's 40 does a method get, from the other winners alone — over every legend with LOO_MIN+
// distinct good finishes in the snapshot. Each list is hidden in turn and scored against:
//   median     lib/consensus.mjs over all the legend's other lists: highest share first, at
//              the median count — what the net decks count each group with
//   karsten    Frank Karsten's numbered-copy aggregate over the same lists (below): the
//              research's pick, kept as the comparison
//   grouped    the median count per group (lib/netdeck.mjs group()), the group closest to the
//              hidden list — what a reader gets who knows which of the legend's decks they want
//   random     the control for "grouped": the same lists dealt at random into groups of the
//              same sizes, the best of those counts — the gain from having a choice at all
// "grouped" earns its place by beating "median" where legends split, not losing where they
// do not, and beating "random" by more than half a card: real decks, not more options.

import { readFile } from "node:fs/promises";
import { indexCatalog, unlimitedCopies, MAX_COPIES } from "./decks.mjs";
import { counter } from "./consensus.mjs";
import { isGoodPlacing } from "./placing.mjs";
import { netdeckMaker, group, mainOf, changed, SPLIT } from "./netdeck.mjs";

let failed = 0;
const ok = (what, cond) => { console.log(`${cond ? "  ok  " : "  FAIL"} ${what}`); if (!cond) failed++; };

// Karsten: every copy is its own entry (1st, 2nd, 3rd); the 40 most common entries, by name.
function karsten(lists, card) {
  const t = new Map();
  for (const d of lists) for (const [n, q] of mainOf(d.cards, card)) for (let k = 1; k <= q; k++) t.set(`${n}#${k}`, { n, k, c: (t.get(`${n}#${k}`)?.c || 0) + 1 });
  const out = new Map();
  let size = 0;
  for (const x of [...t.values()].sort((a, b) => b.c - a.c || a.k - b.k || a.n.localeCompare(b.n))) {
    if (size >= 40) break;
    if ((out.get(x.n) || 0) !== x.k - 1) continue;
    out.set(x.n, x.k); size++;
  }
  return out;
}

/* ── grouping, on a toy catalog ─────────────────────────────────────────── */
{
  const cards = Array.from({ length: 30 }, (_, i) => ({ c: `F${i}`, n: `Filler ${String(i).padStart(2, "0")}`, t: "Unit" }));
  const by = new Map(cards.map((c) => [c.c, c]));
  const card = (k) => by.get(k) || null;
  // Karsten's Abzan: two plans under one legend sharing 4 copies must not be counted together.
  const P = (ids) => ({ cards: { ...Object.fromEntries(ids.map((i) => [`F${i}`, 3])), F28: 3, F29: 1 } });
  const one = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], two = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const lists = [P(one), P(one), P(two), P(one), P(two), P(two)];
  const G = group(lists.map((d) => mainOf(d.cards, card)));
  ok("two plans are two groups", G.length === 2 && G.every((g) => g.length === 3));
  ok("a list is 0 copies from itself and 36 from the other plan", changed(mainOf(lists[0].cards, card), mainOf(lists[0].cards, card)) === 0 && changed(mainOf(lists[0].cards, card), mainOf(lists[2].cards, card)) === 36);
  const near = P(one); near.cards.F0 = 1; near.cards.F24 = 2;
  ok("a list 2 copies off its plan joins it", group([...lists, near].map((d) => mainOf(d.cards, card))).some((g) => g.length === 4 && g.includes(6)));
  ok("Karsten, for the comparison: never the 1st Searing Blood over the 3rd Searing Blaze",
    (() => { const k = karsten([{ cards: { F0: 1, F1: 39 } }, { cards: { F0: 3, F1: 37 } }, { cards: { F0: 3, F2: 3, F1: 34 } }], (c) => ({ F0: { n: "Blaze", t: "Spell" }, F1: { n: "Mountain", t: "Unit" }, F2: { n: "Blood", t: "Spell" } })[c]); return k.get("Blaze") === 3 && !k.has("Blood"); })());
}

/* ── the real lists ───────────────────────────────────────────────────── */
const LOO_MIN = 8;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const [cat, extras, banned, snap] = await Promise.all(["cards.json", "extras.json", "banned.json", "decks.json"].map(read));
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
const { consensus } = counter(idx, card);
const { netdecks, oneFinish } = netdeckMaker(idx, card);
const usable = snap.decks.filter((d) => d.lg && card(d.lg) && isGoodPlacing(d) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
const byLegend = new Map();
for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }
// One finish, one list: a hidden list's own repost left among "the rest" would score it.
for (const [n, ds] of byLegend) byLegend.set(n, oneFinish(ds));
console.log(`\n${usable.length} good placings, ${[...byLegend.values()].reduce((a, d) => a + d.length, 0)} distinct finishes`);

// Every counted group is a legal deck, and an Aurora list never shares a group with a clean one.
let legal = 0, all = 0, mixed = 0;
for (const ds of byLegend.values()) for (const g of netdecks(ds)) {
  if (g.status === "single") continue;
  all++; if (!g.misses.some((m) => m.startsWith("breaks"))) legal++;
  const au = g.members.map((m) => ds.find((d) => d.s === m.s)).map((d) => Object.keys(d.cards).some((k) => card(k)?.n === "Dazzling Aurora"));
  if (au.some(Boolean) && !au.every(Boolean)) mixed++;
}
ok(`every counted group is a legal deck (${legal} of ${all})`, legal === all);
ok("no group mixes Aurora and non-Aurora lists", mixed === 0);
ok("no finish is counted twice", [...byLegend.values()].every((ds) => netdecks(ds).reduce((a, g) => a + g.lists, 0) === ds.length));

// Seeded, so the control reads the same on every run.
const RANDOM_DEALS = 5;
let seed = 1;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const shared = (d, m) => 40 - changed(mainOf(d.cards, card), m);
const countOf = (L) => (L.length >= 3 ? mainOf(consensus(L).cards, card) : mainOf(L[0].cards, card));
function measure(cut) {
  seed = 1;
  const rows = [];
  for (const [name, ds] of byLegend) {
    if (ds.length < LOO_MIN) continue;
    const s = { median: 0, karsten: 0, grouped: 0, random: 0 }, n = ds.length;
    let splits = 0;
    for (let i = 0; i < n; i++) {
      const x = ds[i], rest = ds.filter((_, j) => j !== i);
      s.median += shared(x, mainOf(consensus(rest).cards, card));
      s.karsten += shared(x, karsten(rest, card));
      const G = group(rest.map((d) => mainOf(d.cards, card)), cut);
      if (G.length > 1) splits++;
      s.grouped += Math.max(...G.map((g) => shared(x, countOf(g.map((j) => rest[j])))));
      let r = 0;
      for (let k = 0; k < RANDOM_DEALS; k++) {
        const deck = shuffle(rest.map((_, j) => j));
        let at = 0;
        r += Math.max(...G.map((g) => { const L = deck.slice(at, at + g.length).map((j) => rest[j]); at += g.length; return shared(x, countOf(L)); }));
      }
      s.random += r / RANDOM_DEALS;
    }
    rows.push({ name, n, split: splits / n, ...Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v / n])) });
  }
  return rows;
}
const mean = (rows, k) => rows.reduce((a, r) => a + r[k], 0) / rows.length;
const f1 = (x) => x.toFixed(1).padStart(5);
console.log(`\nLeave-one-out over ${[...byLegend.values()].filter((d) => d.length >= LOO_MIN).length} legends with ${LOO_MIN}+ distinct good finishes — cards of a hidden winner's 40 each method gets`);
for (const cut of [20, SPLIT, 28]) {
  const rows = measure(cut), sp = rows.filter((r) => r.split >= 0.5), one = rows.filter((r) => r.split < 0.5);
  console.log(`\n  cut ${cut}${cut === SPLIT ? " (SPLIT)" : ""}        median karsten grouped  random`);
  const line = (label, R) => console.log(`  ${label}   ${f1(mean(R, "median"))}  ${f1(mean(R, "karsten"))}   ${f1(mean(R, "grouped"))}   ${f1(mean(R, "random"))}`);
  line(`all ${String(rows.length).padStart(2)} legends `, rows);
  if (sp.length) { line(`${String(sp.length).padStart(2)} that split `, sp); console.log(`                   (${sp.map((r) => r.name.split(",")[0]).join(", ")})`); }
  if (one.length) line(`${String(one.length).padStart(2)} one deck   `, one);
  if (cut === SPLIT) {
    // A tie (32.5 each, 23 Oct 2026), so the counter the brews already use stays. If Karsten
    // pulls clearly ahead, that is a reason to switch.
    ok("Karsten's aggregate is no better than the median count by more than 0.2", mean(rows, "karsten") - mean(rows, "median") <= 0.2);
    ok("grouping does not lose where a legend is one deck", one.length === 0 || mean(one, "grouped") >= mean(one, "median") - 0.3);
    ok("grouping beats one count where a legend splits", sp.length === 0 || mean(sp, "grouped") > mean(sp, "median"));
    ok("and beats the same choice dealt at random by half a card: real decks, not more options", sp.length === 0 || mean(sp, "grouped") > mean(sp, "random") + 0.5);
  }
}

console.log(failed ? `\n${failed} FAILED` : "\nall net-deck checks pass");
process.exit(failed ? 1 : 0);
