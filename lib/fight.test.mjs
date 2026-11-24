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

ok("Disarm (§831): Evelynn attacking Staunch Survivor takes it alone (−1 Might on the defender)", out({ units: C("Evelynn, In Control") }, { units: C("Staunch Survivor") }) === "conquer");
ok("Disarm is an attack trigger only: a 4-Might attacker into a defending Evelynn trades", out({ units: C("Momentary Companion") }, { units: C("Evelynn, In Control") }) === "trade");
{
  const keepIt = fight({ units: C("Traveling Merchant") }, { units: C("Evelynn, In Control", "Staunch Survivor"), faceDown: C("Switcheroo"), keep: true });
  ok("keep: a hold that needs no flip keeps Evelynn's face-down card", keepIt.outcome === "hold" && keepIt.end.spentD.length === 0);
  const mustFlip = fight({ units: heron }, { units: C("Evelynn, In Control"), faceDown: C("Switcheroo"), keep: true });
  ok("keep never costs the hold: against a 7 it still flips Switcheroo", mustFlip.outcome === "hold" && mustFlip.end.spentD.length === 1);
}

// Damage assignment order (§467.2.c.3, §815, §826). A 4-Might attacker can kill a 3 but not a 6.
{
  const alive = (r) => r.end.alive.filter((x) => x.side === "D").map((x) => x.card.n).sort().join(", ");
  const tank = fight({ units: C("Vanguard Sergeant") }, { units: C("Stormclaw Ursine", "Shipyard Skulker") });
  ok("Tank (§815): the 4 goes on Stormclaw Ursine first, so the Skulker it could have killed lives", alive(tank) === "Shipyard Skulker, Stormclaw Ursine", alive(tank));
  const back = fight({ units: C("Vanguard Sergeant") }, { units: C("Evelynn, Entrancing", "Shipyard Skulker") });
  ok("Backline (§826): Evelynn, Entrancing is assigned last, so the Skulker dies and she lives", alive(back) === "Evelynn, Entrancing", alive(back));
}

// ── Feature 1 (24 Nov): spells inside fights. Responses to a spell (§813.1.c.1), costs from the board (§356). ──
{
  const T = (n, m) => ({ n, t: "Unit", m, x: "" });
  const [disc, defy, rebuttal, lullaby, ray, spirit] = C("Discipline", "Defy", "Rebuttal", "Lilting Lullaby", "Hextech Ray", "Unyielding Spirit");
  // Their Defy counters our pump: 4 + 2 would beat 5; countered, it doesn't.
  ok("our Discipline (4 → 6) beats their 5", out({ units: [T("Four", 4)], hand: [disc], budget: { e: 2 } }, { units: [T("Five", 5)] }) === "conquer");
  ok("their Defy counters it: hold", out({ units: [T("Four", 4)], hand: [disc], budget: { e: 2 } }, { units: [T("Five", 5)], hand: [defy], budget: { e: 1, p: 1 } }) === "hold");
  ok("…from face down too (free)", out({ units: [T("Four", 4)], hand: [disc], budget: { e: 2 } }, { units: [T("Five", 5)], faceDown: [defy] }) === "hold");
  // Our Defy counters their trick.
  ok("their Discipline (5 → 7) holds against our 6", out({ units: [T("Six", 6)] }, { units: [T("Five", 5)], hand: [disc], budget: { e: 2 } }) === "hold");
  ok("our Defy counters it: conquer", out({ units: [T("Six", 6)], hand: [defy], budget: { e: 1, p: 1 } }, { units: [T("Five", 5)], hand: [disc], budget: { e: 2 } }) === "conquer");
  // Rebuttal: pay {A} more and their Discipline is ours (+2 on our unit).
  ok("Rebuttal takes over their Discipline: 8 vs 5, conquer", out({ units: [T("Six", 6)], hand: [rebuttal], budget: { e: 1, p: 2 } }, { units: [T("Five", 5)], hand: [disc], budget: { e: 2 } }) === "conquer");
  // Lilting Lullaby counters and locks: their second Discipline can't follow. One Defy only stops the first.
  const two = { units: [T("Five", 5)], hand: [disc, disc], budget: { e: 4 } };
  ok("one Defy: their second Discipline holds", out({ units: [T("Six", 6)], hand: [defy], budget: { e: 1, p: 1 } }, two) === "hold");
  ok("Lilting Lullaby: countered and locked: conquer", out({ units: [T("Six", 6)], hand: [lullaby], budget: { e: 2, p: 2 } }, two) === "conquer");
  // Helm of Suppression (ours): their spells cost [e1] more, so 2 Energy no longer pays Discipline.
  ok("Helm's tax: their Discipline is out of reach: conquer", out({ units: [T("Six", 6)] }, { units: [T("Five", 5)], hand: [disc], budget: { e: 2 }, tax: { e: 1, p: 0 } }) === "conquer");
  // Vex, Cheerless in our attack: their spells cost [e1]{A} more.
  const [vex, wild, syndra] = C("Vex, Cheerless", "Alpha Wildclaw", "Syndra, Transcendent");
  ok("a plain 5 + 3 into their 7 with Discipline: hold", out({ units: [T("Five", 5), T("Three", 3)] }, { units: [T("Seven", 7)], hand: [disc], budget: { e: 2 } }) === "hold");
  ok("Vex, Cheerless + 3: their Discipline now costs [e3]{A}: conquer", out({ units: [vex, T("Three", 3)] }, { units: [T("Seven", 7)], hand: [disc], budget: { e: 2 } }) === "conquer");
  // Alpha Wildclaw: our smaller unit there can't be chosen by their spells (their Ray can't kill the 3).
  ok("a plain 7 + 3 into their 9 with Hextech Ray: the Ray kills the 3, hold", out({ units: [T("Seven", 7), T("Three", 3)] }, { units: [T("Nine", 9)], hand: [ray], budget: { e: 1, p: 1 } }) === "hold");
  ok("Alpha Wildclaw + 3: the 3 can't be chosen: not a hold", out({ units: [wild, T("Three", 3)] }, { units: [T("Nine", 9)], hand: [ray], budget: { e: 1, p: 1 } }) !== "hold");
  // Unyielding Spirit: their Ray's damage is prevented.
  ok("Unyielding Spirit: the Ray does nothing: not a hold", out({ units: [T("Seven", 7), T("Three", 3)], hand: [spirit], budget: { e: 1, p: 1 } }, { units: [T("Nine", 9)], hand: [ray], budget: { e: 1, p: 1 } }) !== "hold");
  // Syndra, Transcendent: our Discipline repeated for [e2]{Chaos}: 6 + 2 + 2 beats 9.
  ok("Syndra without the Repeat budget: 8 vs 9, hold", out({ units: [syndra], hand: [disc], budget: { e: 2 } }, { units: [T("Nine", 9)] }) === "hold");
  ok("Syndra repeats Discipline: 10 vs 9, conquer", out({ units: [syndra], hand: [disc], budget: { e: 4, p: 1 } }, { units: [T("Nine", 9)] }) === "conquer");
}

console.log(failed ? `\n${failed} FAILED` : "\nall fight checks pass");
process.exit(failed ? 1 : 0);
