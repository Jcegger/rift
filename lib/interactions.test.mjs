// Tests for lib/interactions.mjs: the loops it must find from text alone, the false ones it
// must flag, and the cross-links it must not draw. Real catalog, errata applied. No network.
//
//   node lib/interactions.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { tagsOf, graphOf, loopsOf, linksOf, hubsOf } from "./interactions.mjs";

const cat = await loadCatalog();
const card = (n) => cat.cards.find((c) => c.n === n && !c.v);
const deck = (...ns) => graphOf(ns.map((n) => ({ card: card(n), qty: 1 })));
const has = (g, from, res, to) => g.edges.some((e) => e.from === from && e.res === res && e.to === to);
let failed = 0;
const ok = (label, cond, detail = "") => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`); };

console.log("loops it must find, from text alone");
const L = loopsOf(deck("Fizz, Trickster", "Star-Crossed"));
ok("Fizz recasts Star-Crossed, which returns Fizz to replay", L.some((l) => l.cards.length === 2 && l.links.some((e) => e.res === "recast") && l.links.some((e) => e.res === "ownToHand")));
const M = deck("Tail-Cloaked Matriarch", "Ezreal, Prodigy");
ok("Matriarch revives Ezreal, whose play effect fires again", has(M, "Tail-Cloaked Matriarch", "revive", "Ezreal, Prodigy"));
ok("Ezreal's discard feeds Matriarch's trash", has(M, "Ezreal, Prodigy", "trashUnit", "Tail-Cloaked Matriarch"));
const big = loopsOf(deck("Fizz, Trickster", "Star-Crossed", "Tail-Cloaked Matriarch"));
ok("Star-Crossed resets an Empowered Matriarch, who revives Fizz, who recasts Star-Crossed", big.some((l) => l.cards.length === 3 && l.weakest === 3));
ok("Ezreal discounts Mercenary's Accelerate and Rampage's optional Body", has(deck("Ezreal, Prodigy", "Sivir, Mercenary", "Rampage"), "Ezreal, Prodigy", "optCost", "Sivir, Mercenary") && has(deck("Ezreal, Prodigy", "Rampage"), "Ezreal, Prodigy", "optCost", "Rampage"));
ok("Tornado empowers Matriarch", has(deck("Tornado Warrior", "Tail-Cloaked Matriarch"), "Tornado Warrior", "empower", "Tail-Cloaked Matriarch"));
ok("Emperor's Dais returns Fizz to replay", has(deck("Emperor's Dais", "Fizz, Trickster"), "Emperor's Dais", "ownToHand", "Fizz, Trickster"));
ok("Sigil of the Storm's recycle feeds Battle Mistress", has(deck("Sigil of the Storm", "Battle Mistress"), "Sigil of the Storm", "recycleRune", "Battle Mistress"));
ok("Tideturner's swap moves Traveling Merchant, firing its move trigger", has(deck("Tideturner", "Traveling Merchant"), "Tideturner", "move", "Traveling Merchant"));
ok("Bandle Tree's extra hide feeds Evelynn, In Control", has(deck("Bandle Tree", "Evelynn, In Control"), "Bandle Tree", "facedown", "Evelynn, In Control"));
const hub = hubsOf(deck("Battle Mistress", "Rampage", "Punch First"), ["Battle Mistress"])[0];
ok("Rampage's kill readies Battle Mistress", hub.fedBy.some((x) => x.res === "enemyDeath" && x.cards.includes("Rampage")));

console.log("false loops it must flag");
const T = loopsOf(deck("Tornado Warrior", "Tail-Cloaked Matriarch"));
ok("Tornado revived face up can't empower again (from face down only)", T.length > 0 && T.every((l) => l.flags.length > 0));

console.log("links it must not draw");
const X = deck("Tideturner", "Fizz, Trickster", "Tornado Warrior", "Switcheroo", "Elnuk Herd");
ok("one unit's play effect doesn't trigger another's", !X.edges.some((e) => e.res === "playMe" && e.from !== e.to));
ok("a hidden card's flip doesn't trigger another card's own 'from face down'", !X.edges.some((e) => e.res === "flipSelf" && e.from !== e.to));
ok("a spell's trip to the trash is low; Fizz's recast is high", linksOf(X).every((e) => e.spec === "high"));
const tags = tagsOf(card("Tail-Cloaked Matriarch"));
ok("Matriarch reads as reviving and as Empower-once", tags.produces.some((x) => x.res === "revive") && tags.consumes.some((x) => x.res === "empowerReset"));

console.log(failed ? `\n${failed} FAILED` : "\nall interaction checks pass");
process.exit(failed ? 1 : 0);
