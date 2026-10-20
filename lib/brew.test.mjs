// Tests for lib/brew.mjs through data/brews.json (scripts/build-brews.mjs): every brew is
// a legal winning list changed on purpose — anchored on its legend's winners or ported from
// a proven list in its colours — and every change has a reason. The swap logic itself is
// backtested in lib/swaps.test.mjs.
//
//   node lib/brew.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog, deckChecks, MAIN_SIZE } from "./decks.mjs";
import { BUDGET } from "./swaps.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cat = R("cards.json"), extras = R("extras.json");
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], R("banned.json"));
const B = R("brews.json");
const built = B.brews.filter((b) => b.kind !== "none");
const brewOf = (n) => B.brews.find((b) => b.legend === n);
const names = (n) => new Set((brewOf(n)?.rows || []).map((r) => r.name));

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };

console.log("every brew");
const legends = new Set(idx.cards.filter((c) => c.t === "Legend" && !c.v).map((c) => idx.legendName(c)));
ok(`one row per legend (${B.brews.length} of ${legends.size})`, B.brews.length === legends.size);
const illegal = built.filter((b) => deckChecks({ cards: b.cards, sb: {} }, idx).some((k) => k.ok === false));
ok(`passes every deck rule${illegal.length ? `: not ${illegal.map((b) => b.legend).join(", ")}` : ""}`, !illegal.length);
ok(`has ${MAIN_SIZE} main-deck cards`, built.every((b) => b.rows.reduce((a, r) => a + r.qty, 0) === MAIN_SIZE));
ok("is anchored on its own winners or built from its colours' winners — never from text alone", built.every((b) => ["anchor", "colours"].includes(b.kind) && b.basis));
ok("says why every change is made", built.every((b) => b.rows.filter((r) => r.change).every((r) => r.why) && b.swaps.every((s) => s.why && s.kind)));
ok(`changes at most ${BUDGET} copies by swaps (winners stray about 6 from consensus)`, built.every((b) => b.swaps.reduce((a, s) => a + s.copies, 0) <= BUDGET));
ok("never swaps out the legend's own champion or signature cards", built.every((b) => b.swaps.every((s) => {
  const c = idx.cards.find((x) => x.n === s.out && !x.v), ch = idx.championOf(idx.BY.get(b.code));
  return !(idx.signatureOf(c) || (c.t === "Unit" && idx.championOf(c) === ch));
})));
ok("a colours-built brew carries one chosen champion and no other champion's signature", built.filter((b) => b.kind === "colours").every((b) => {
  const ch = idx.championOf(idx.BY.get(b.code));
  return b.rows.filter((r) => r.name.startsWith(`${ch}, `) && r.type === "Unit").reduce((a, r) => a + r.qty, 0) >= 1
    && b.rows.every((r) => { const c = idx.cards.find((x) => x.n === r.name && !x.v); return !idx.signatureOf(c) || idx.signatureOf(c) === ch; });
}));
ok("only brews with a reason are shown (built from colours, a new card for a job, or a research answer)", B.brews.filter((b) => b.worth).every((b) => b.kind === "colours" || b.swaps.some((s) => s.kind !== "alt")));

console.log("decks");
ok("Irelia keeps her core: Stellacorn Herder and Defiant Dance", names("Irelia, Blade Dancer").has("Stellacorn Herder") && names("Irelia, Blade Dancer").has("Defiant Dance"));
ok("Kennen keeps Rhasa — a card the role reader cannot read is never 'outdone'", names("Kennen, Heart of the Tempest").has("Rhasa the Sunderer"));
ok("the Bladesman keeps its lone-defender tricks", names("Master Yi, Wuju Bladesman").has("En Garde") && names("Master Yi, Wuju Bladesman").has("Discipline"));
ok("Jayce's brew has a chosen champion though his consensus runs 3 units", built.find((b) => b.legend.startsWith("Jayce")).rows.some((r) => r.name.startsWith("Jayce, ")));
ok("a thin legend is built from its colours (Garen)", brewOf("Garen, Might of Demacia")?.kind === "colours");

console.log(failed ? `\n${failed} FAILED` : "\nall brew checks pass");
process.exit(failed ? 1 : 0);
