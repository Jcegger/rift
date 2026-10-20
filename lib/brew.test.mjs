// Tests for lib/brew.mjs through data/brews.json (scripts/build-brews.mjs): every brew is
// a legal deck built the way it says, and the cards the plan names are in it.
//
//   node lib/brew.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog, deckChecks, MAIN_SIZE } from "./decks.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cat = R("cards.json"), extras = R("extras.json");
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], R("banned.json"));
const B = R("brews.json");
const brewOf = (n) => B.brews.find((b) => b.legend === n);
const names = (n) => new Set((brewOf(n)?.rows || []).map((r) => r.name));

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };

console.log("every brew");
const legends = new Set(idx.cards.filter((c) => c.t === "Legend" && !c.v).map((c) => idx.legendName(c)));
ok(`one per legend (${B.brews.length} of ${legends.size})`, B.brews.length === legends.size);
const illegal = B.brews.filter((b) => deckChecks({ cards: b.cards, sb: {} }, idx).some((k) => k.ok === false));
ok(`passes every deck rule (Radiance cards legal from the 23rd)${illegal.length ? `: not ${illegal.map((b) => b.legend).join(", ")}` : ""}`, !illegal.length);
ok(`has ${MAIN_SIZE} main-deck cards`, B.brews.every((b) => b.rows.reduce((a, r) => a + r.qty, 0) === MAIN_SIZE));
ok("has a chosen champion named for its legend's champion", B.brews.every((b) => b.champion && b.champion.startsWith(idx.championOf(idx.BY.get(b.code)) + ", ")));
ok("says why every card is in", B.brews.every((b) => b.rows.every((r) => r.why)));
ok("never offers a card the legend's winners skip, unless its question says test", (() => {
  const RES = R("research.json");
  return B.brews.every((b) => b.rows.every((r) => { const s = RES.legends?.[b.legend]?.cards?.[r.name]; return r.role === "signature" || r.role === "champion" || !s || s.status !== "skipped"; }));
})());

ok("a long-legal card almost nobody picks is in only as a champion unit, a choice its own lists make, or a flagged idea", B.brews.every((b) => {
  const ideas = b.rows.filter((r) => r.role === "idea").length;
  return ideas <= 2 && b.rows.every((r) => r.rad || r.share == null || r.share >= 0.03 || r.role !== "staple");
}));

console.log("plans");
ok("Vex's brew follows its heading (stun control), not just the inference: 15+ of 40 shared with its lists", (brewOf("Vex, Gloomist")?.vsLists?.common || 0) >= 15);
ok("the Bladesman brew runs the lone-defender tricks (En Garde, Lonely Poro)", names("Master Yi, Wuju Bladesman").has("En Garde") && names("Master Yi, Wuju Bladesman").has("Lonely Poro"));
ok("Irelia's brew runs Stellacorn Herder (Herder in 98% of her lists)", names("Irelia, Blade Dancer").has("Stellacorn Herder"));
ok("Kha'Zix's brew follows its Engine line: movement payoffs are in", ["Shadow Order Disciple", "Irresistible Faefolk", "Traveling Merchant"].some((n) => names("Kha'Zix, Voidreaver").has(n)));
ok("a Radiance legend's brew uses Radiance cards", (brewOf("Riven, The Exile")?.radCards || 0) >= 8);
ok("a Unique card is never more than one copy (Shurelya's Requiem)", B.brews.every((b) => b.rows.every((r) => !/\[Unique\]/.test(idx.cards.find((c) => c.n === r.name)?.x || "") || r.qty === 1)));

console.log(failed ? `\n${failed} FAILED` : "\nall brew checks pass");
process.exit(failed ? 1 : 0);
