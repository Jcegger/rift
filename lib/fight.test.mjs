// Tests for lib/fight.mjs: board states with known answers by the rules. No network.
//
//   node lib/fight.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { fight } from "./fight.mjs";

const cat = await loadCatalog();
const C = (...ns) => ns.map((n) => cat.cards.find((c) => c.n === n && !c.v));
let failed = 0;
const ok = (label, cond, detail = "") => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`); };
const out = (A, D) => fight(A, D).outcome;
const heron = C("Astral Heron");

ok("a 7-Might attacker beats two 2-drops (Shield counted: Staunch defends at 4)", out({ units: heron }, { units: C("Staunch Survivor", "Traveling Merchant") }) === "conquer");
ok("a face-down Switcheroo turns it into a hold", out({ units: heron }, { units: C("Staunch Survivor", "Traveling Merchant"), faceDown: C("Switcheroo") }) === "hold");
ok("…through their Discipline", out({ units: heron, hand: C("Discipline"), budget: { e: 2 } }, { units: C("Staunch Survivor", "Traveling Merchant"), faceDown: C("Switcheroo") }) === "hold");
ok("Graves alone can't blast a 7 and deals no combat damage", out({ units: heron }, { units: C("Graves, Blasting Through") }) === "conquer");
ok("Elnuk's +3 face down makes Graves blast for 7", out({ units: heron }, { units: C("Graves, Blasting Through"), faceDown: C("Elnuk Herd") }) === "hold");
ok("Tideturner swaps Graves in from base; he still defends and blasts", out({ units: heron }, { units: C("Staunch Survivor"), faceDown: C("Tideturner"), base: C("Graves, Blasting Through") }) === "hold");
ok("Star-Crossed from hand needs its cost: none, no answer", out({ units: heron }, { units: C("Staunch Survivor", "Traveling Merchant"), hand: C("Star-Crossed"), budget: { e: 0 } }) === "conquer");
ok("Star-Crossed held up (3 Energy, 1 Power) returns the Heron", out({ units: heron }, { units: C("Staunch Survivor", "Traveling Merchant"), hand: C("Star-Crossed"), budget: { e: 3, p: 1 } }) === "hold");
ok("Punch First (Action) can't answer a trigger on the chain, but works in the showdown", out({ units: heron }, { units: C("Staunch Survivor"), hand: C("Punch First"), budget: { e: 1, p: 2 } }) === "hold");
ok("equal totals both die: a trade", out({ units: C("Traveling Merchant") }, { units: C("Tideturner") }) === "trade");

console.log(failed ? `\n${failed} FAILED` : "\nall fight checks pass");
process.exit(failed ? 1 : 0);
