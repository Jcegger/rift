// Tests for lib/versus.mjs, against the real catalog (errata applied). No network.
//
//   node lib/versus.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { effectsOf, bodyOf, weigh, versus, looksInteractive } from "./versus.mjs";

const cat = await loadCatalog();
const card = (n) => cat.cards.find((c) => c.n === n && !c.v) || cat.cards.find((c) => c.n === n);
const fx = (n) => effectsOf(card(n));
const has = (n, kind, o = {}) => fx(n).some((e) => e.kind === kind && Object.entries(o).every(([k, v]) => e[k] === v));

let failed = 0;
const ok = (label, cond, detail = "") => {
  if (!cond) failed++;
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
};

console.log("reading effects");
ok("Gust bounces 3 Might or less at a battlefield, at Reaction", has("Gust", "bounce", { max: 3, battlefield: true, speed: "reaction" }));
ok("Star-Crossed bounces any unit and needs one of yours", has("Star-Crossed", "bounce", { max: null, needsFriendly: true }));
ok("Bedeviling Stranger's bounce is marked as needing 4 units", has("Bedeviling Stranger", "bounce", { needsFour: true }));
ok("a friendly bounce is not removal (Grim Apothecary)", !fx("Grim Apothecary").length);
ok("Falling Star's two 3s can land on one unit: 6", has("Falling Star", "damage", { n: 6 }));
ok("Scorched Earth splits 5", has("Scorched Earth", "damage", { n: 5, split: true }));
ok("Burn Away banishes 3 Might or less, and kills a gear", has("Burn Away", "banish", { max: 3 }) && has("Burn Away", "gearkill"));
ok("Wind and Ghosts: banish 3 or less, else bounce", has("Wind and Ghosts", "banish", { max: 3 }) && has("Wind and Ghosts", "bounce", { max: null }));
ok("Defy: no more than 4 Energy and 1 Power", has("Defy", "counter", { maxE: 4, maxP: 1 }));
ok("Hard Bargain taxes 2", has("Hard Bargain", "counter", { tax: 2 }));
ok("Not So Fast counters only spells that choose their unit", has("Not So Fast", "counter", { choosesTheirs: true }));
ok("Defiant Dance is both +2 and -2", has("Defiant Dance", "pump", { n: 2 }) && has("Defiant Dance", "minus", { n: 2 }));
ok("Punch First is +5 at Action", has("Punch First", "pump", { n: 5, speed: "action" }));
ok("Edge of Night is +2 from face down", has("Edge of Night", "pump", { n: 2, speed: "hidden", equip: true }));
ok("Switcheroo swaps, from face down", has("Switcheroo", "swap", { speed: "hidden" }));
ok("Rampage is a fight with +2", has("Rampage", "fight", { bonus: 2 }));
ok("Graves blasts for his Might", has("Graves, Blasting Through", "blast"));
ok("Thousand-Tailed Watcher: -3 to all, floor 1", has("Thousand-Tailed Watcher", "minus", { n: 3, all: true, floor: 1 }));
ok("Thrill of the Hunt replays their unit", has("Thrill of the Hunt", "redeploy"));
ok("Baited Hook kills its owner's unit, not ours", !fx("Baited Hook").length);
ok("Mel banishes only 3 Might or less", has("Mel, Defiant Soul", "banish", { max: 3 }));
ok("Cull the Weak is an edict", has("Cull the Weak", "edict"));
ok("Temporal Breach is a blink, not removal", has("Temporal Breach", "redeploy", { same: true }) && !has("Temporal Breach", "banish"));
ok("a Flow reminder is not interaction (Lightning Rush)", !looksInteractive(card("Lightning Rush")));

console.log("bodies");
const st = bodyOf(card("Staunch Survivor"));
ok("Staunch Survivor: 2 outside a fight, 4 in one", st.might === 2 && st.attack === 4 && st.defend === 4);
ok("Sivir, Mercenary: 4, up to 6", bodyOf(card("Sivir, Mercenary")).best === 6);
ok("Vex, Apathetic has Deflect 1", bodyOf(card("Vex, Apathetic")).deflect === 1);

console.log("head to head");
const row = (n, share = 1, extra = {}) => ({ card: card(n), share, qty: 1, avg: 1, ...extra });
const V = versus(
  [row("Staunch Survivor"), row("Evelynn, In Control"), row("Graves, Blasting Through"), row("Punch First"), row("Rampage"),
   row("Edge of Night"), row("Switcheroo"), row("Star-Crossed"), row("Sivir, Mercenary"), row("Wind and Ghosts", 1, { sb: true })],
  [row("Gust", 0.8), row("Defy", 0.9), row("Not So Fast", 0.7), row("Astral Heron", 0.3), row("Discipline", 0.9)],
);
const ans = (n) => V.theirAnswers.find((r) => r.card.n === n).hits;
ok("Gust reaches Staunch Survivor only outside a fight", ans("Staunch Survivor").some((h) => h.card.n === "Gust" && h.when === "outside a fight"));
ok("Gust can't reach Evelynn", !ans("Evelynn, In Control").some((h) => h.card.n === "Gust"));
const ctr = (n) => V.theirCounters.find((r) => r.card.n === n).hits.map((h) => h.card.n);
ok("Defy can't counter Punch First (two Power)", !ctr("Punch First").includes("Defy"));
ok("Defy counters Rampage (its Body is an additional cost, §206)", ctr("Rampage").includes("Defy"));
ok("Not So Fast can't reach a pump on our own unit", !ctr("Punch First").includes("Not So Fast"));
ok("Not So Fast reaches Star-Crossed", ctr("Star-Crossed").includes("Not So Fast"));
const heron = V.ourAnswers.find((r) => r.card.n === "Astral Heron").answers;
const g = heron.find((a) => a.card.n === "Graves, Blasting Through");
ok("Graves can't blast a 7 alone or with +2, but can with a swap or +5 first", !/alone|\+2 flipped/.test(g.note) && /swap/.test(g.note) && /\+5 cast first/.test(g.note));
ok("Rampage reaches a 7 only through Mercenary or a pump", /Sivir, Mercenary at 6/.test(heron.find((a) => a.card.n === "Rampage").note));
ok("Switcheroo answers a big unit in a fight", heron.some((a) => a.card.n === "Switcheroo"));
ok("sideboard answers are marked", heron.some((a) => a.card.n === "Wind and Ghosts" && a.sb));
ok("Baron Nashor can't be chosen", bodyOf(card("Baron Nashor")).untargetable && !bodyOf(card("Astral Heron")).untargetable);
ok("Vex's stun names the unit only in its trigger: not a target (§355.10.c)", has("Vex, Apathetic", "stun", { targets: false }));
ok("Graves's blast is not a target; Rampage and Switcheroo are", has("Graves, Blasting Through", "blast", { targets: false }) && has("Rampage", "fight", { targets: true }) && has("Switcheroo", "swap", { targets: true }));
const VB = versus([row("Vex, Apathetic"), row("Switcheroo"), row("Star-Crossed"), row("Rampage"), row("Graves, Blasting Through")], [row("Baron Nashor", 0.4)]);
const baron = VB.ourAnswers.find((r) => r.card.n === "Baron Nashor").answers;
const live = (n) => baron.some((a) => a.card.n === n && a.ok !== false);
ok("against Baron, only Vex's stun and Graves's blast are live", live("Vex, Apathetic") && !live("Switcheroo") && !live("Star-Crossed") && !live("Rampage") && baron.some((a) => a.card.n === "Graves, Blasting Through"));
ok("their targeted removal skips an untargetable unit of ours", !versus([row("Baron Nashor")], [row("Gust", 0.8), row("Rebuke", 0.5)]).theirAnswers[0].hits.some((h) => h.card.n === "Rebuke"));
ok("weights are shares of lists", weigh([{ cards: { a: 2 } }, { cards: { a: 1, b: 3 } }], (c) => c).get("a").share === 1);

console.log(failed ? `\n${failed} FAILED` : "\nall versus checks pass");
process.exit(failed ? 1 : 0);
