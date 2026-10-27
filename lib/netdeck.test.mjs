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
import { netdeckMaker, group, mainOf, changed, SPLIT, SPLIT_EDGE } from "./netdeck.mjs";

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
    // Was: across the legends that split, grouped beats random by half a card. On 27 Oct 2026
    // that average fell to 0.1 while Fiora (+1.8) and Wuju Yi (+1.2) split into real decks and
    // Kennen (−1.9) split worse than chance, so the rule moved into netdecks() per legend
    // (SPLIT_EDGE). What is asserted now is that rule, both ways.
    const shown = [...byLegend].map(([name, ds]) => ({ name, gs: netdecks(ds).filter((g) => !g.avoid.length) }));
    const several = shown.filter((x) => x.gs.length > 1);
    ok(`every legend shown as several decks earned it per legend (${several.map((x) => `${x.name.split(",")[0]} +${x.gs[0].split.edge}`).join(", ") || "none"})`,
       several.every((x) => x.gs.every((g) => g.split && g.split.kept && g.split.edge >= SPLIT_EDGE)));
    const merged = shown.filter((x) => x.gs.length === 1 && x.gs[0].split);
    ok(`and every legend counted as one deck despite grouping missed the bar (${merged.map((x) => `${x.name.split(",")[0]} ${x.gs[0].split.edge ?? "unmeasured"}`).join(", ") || "none"})`,
       merged.every((x) => !x.gs[0].split.kept && (x.gs[0].split.edge == null || x.gs[0].split.edge < SPLIT_EDGE)));
  }
}

/* ── the crowd's list ─────────────────────────────────────────────────────
   Ported from the blind test (lib/blind.test.mjs, retired with the brews on 23 Oct 2026),
   whose crowd scenario is the evidence for showing a crowd's list at all: for each legend
   with CROWD_MIN+ distinct good finishes and MIN_CROWD+ posted lists, how many of its
   winners' 40 does the count of its posted lists get? Against the CEILING, two random halves
   of the winners against each other. And again without posts titled "- copy": many posted
   lists are copies of winning ones, which flatters the crowd for exactly the legends that
   have results — and a crowd's list is only ever shown for legends that do not. */
{
  const CROWD_MIN = 10;
  const { MIN_CROWD } = await import("./netdeck.mjs");
  const winnersOf = new Map(byLegend);
  const posted = new Map();
  const goodS = new Set([...byLegend.values()].flat().map((d) => d.s));
  for (const d of snap.decks) {
    if (d.tour || goodS.has(d.s) || !d.lg || !card(d.lg) || Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n))) continue;
    const n = idx.legendName(card(d.lg)); (posted.get(n) || posted.set(n, []).get(n)).push(d);
  }
  const rows = [];
  seed = 7;
  for (const [name, W] of winnersOf) {
    const P = posted.get(name) || [], Pn = P.filter((d) => !/-\s*copy\b/i.test(d.h || ""));
    if (W.length < CROWD_MIN || P.length < MIN_CROWD) continue;
    const truth = mainOf(consensus(W).cards, card);
    let ceil = 0;
    for (let k = 0; k < 5; k++) { const s = shuffle([...W]), h = Math.floor(s.length / 2); ceil += 40 - changed(mainOf(consensus(s.slice(0, h)).cards, card), mainOf(consensus(s.slice(h)).cards, card)); }
    rows.push({ name, w: W.length, p: P.length, ceiling: ceil / 5, crowd: 40 - changed(mainOf(consensus(P).cards, card), truth),
      noCopies: Pn.length >= MIN_CROWD ? 40 - changed(mainOf(consensus(Pn).cards, card), truth) : null });
  }
  const m = (k) => { const xs = rows.map((r) => r[k]).filter((x) => x != null); return xs.reduce((a, b) => a + b, 0) / xs.length; };
  console.log(`\nThe crowd's list, over ${rows.length} legends with ${CROWD_MIN}+ good finishes and ${MIN_CROWD}+ posted lists — of the winners' 40:`);
  console.log(`  ceiling (two halves of the winners) ${m("ceiling").toFixed(1)} · crowd ${m("crowd").toFixed(1)} · crowd without "- copy" posts ${m("noCopies").toFixed(1)} (${rows.filter((r) => r.noCopies != null).length} legends)`);
  ok("before results, a legend's posted lists get within a few cards of its winners (30+ of 40)", m("crowd") >= 30);
  ok("…and still do without the copies of other lists (30+)", m("noCopies") >= 30);
}

console.log(failed ? `\n${failed} FAILED` : "\nall net-deck checks pass");
process.exit(failed ? 1 : 0);
