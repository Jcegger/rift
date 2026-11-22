// Golden tests for lib/cardtext.mjs: real catalog text → the effect language. No network.
//
//   node lib/cardtext.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { compile } from "./cardtext.mjs";

const cat = await loadCatalog();
const C = (n) => { const c = cat.cards.find((x) => x.n === n && !x.v); if (!c) throw new Error(`no card ${n}`); return c; };
let failed = 0;
const ok = (label, cond, detail = "") => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`); };
const ab = (n, i = 0) => compile(C(n)).abilities[i];
const eff = (n, i = 0, j = 0) => ab(n, i)?.effects?.[j];
const st = (n, i = 0) => compile(C(n)).statics[i];
const unread = (n) => compile(C(n)).sentences.filter((s) => s.state === "unread").map((s) => s.text);
const show = (x) => JSON.stringify(x);

// triggers
ok("play: Thousand-Tailed Watcher gives enemy units -3 this turn, minimum 1", ab("Thousand-Tailed Watcher").trigger === "play"
  && eff("Thousand-Tailed Watcher").op === "might" && eff("Thousand-Tailed Watcher").n === -3 && eff("Thousand-Tailed Watcher").floor === 1
  && eff("Thousand-Tailed Watcher").target.who === "each" && eff("Thousand-Tailed Watcher").target.side === "enemy" && eff("Thousand-Tailed Watcher").until === "turn", show(eff("Thousand-Tailed Watcher")));
ok("play: First Mate readies another unit", ab("First Mate").trigger === "play" && eff("First Mate").op === "ready" && eff("First Mate").target.other === true, show(eff("First Mate")));
ok("play: Pit Rookie buffs another friendly unit", eff("Pit Rookie").op === "buff" && eff("Pit Rookie").target.side === "friendly", show(eff("Pit Rookie")));
ok("attack or defend: Graves deals his Might to all enemy units here", ab("Graves, Blasting Through").trigger === "attackOrDefend"
  && eff("Graves, Blasting Through").n === "myMight" && eff("Graves, Blasting Through").target.who === "each" && eff("Graves, Blasting Through").target.where === "here", show(eff("Graves, Blasting Through")));
ok("attack: Vi, Peacekeeper stuns an enemy unit here", ab("Vi, Peacekeeper").trigger === "attack" && eff("Vi, Peacekeeper").op === "stun", show(ab("Vi, Peacekeeper")));
ok("move: Irresistible Faefolk moves an enemy unit to that battlefield", ab("Irresistible Faefolk").trigger === "move" && eff("Irresistible Faefolk").op === "move"
  && eff("Irresistible Faefolk").target.side === "enemy" && eff("Irresistible Faefolk").optional, show(eff("Irresistible Faefolk")));
ok("Vex, Apathetic: and they can't move it this turn (the next sentence joins the trigger)", eff("Vex, Apathetic", 0, 1)?.op === "noMove", show(ab("Vex, Apathetic")));
ok("opponent plays a unit: Vex, Apathetic stuns it", ab("Vex, Apathetic").trigger === "oppPlaysUnit" && eff("Vex, Apathetic").op === "stun" && eff("Vex, Apathetic").target.who === "it", show(ab("Vex, Apathetic")));
ok("conquer: Kai'Sa, Survivor's draw is no effect this turn (draw)", compile(C("Kai'Sa, Survivor")).sentences.some((s) => s.state === "noTurn" && s.why === "draw"));
ok("conquer: Plundering Poro's Gold arrives exhausted, no effect this turn (later)", compile(C("Plundering Poro")).sentences.some((s) => s.state === "noTurn" && s.why === "later"));
ok("Deathknell: Carrion Dredger plays a 1-Might Bird token with Deflect to base", ab("Carrion Dredger").trigger === "die" && eff("Carrion Dredger").op === "token"
  && eff("Carrion Dredger").might === 1 && eff("Carrion Dredger").keywords.includes("Deflect") && eff("Carrion Dredger").to === "your base", show(eff("Carrion Dredger")));
ok("activated: Seal of Discord adds Chaos for {T}", ab("Seal of Discord").trigger === "activated" && eff("Seal of Discord").op === "add" && eff("Seal of Discord").power[0] === "Chaos", show(ab("Seal of Discord")));
// spells
ok("spell: Falling Star deals 3 twice", ab("Falling Star").effects.length === 1 && ab("Falling Star", 1).effects[0].n === 3 && eff("Falling Star").op === "damage", show(compile(C("Falling Star")).abilities));
ok("spell: Charm moves an enemy unit", eff("Charm").op === "move" && eff("Charm").target.side === "enemy", show(eff("Charm")));
ok("spell: Defy counters spells costing 4 Energy and 1 Power or less", eff("Defy").op === "counter" && eff("Defy").maxE === 4 && eff("Defy").maxP === 1, show(eff("Defy")));
ok("spell: On the Hunt readies each friendly unit", eff("On the Hunt").op === "ready" && eff("On the Hunt").target.who === "each" && eff("On the Hunt").target.side === "friendly", show(eff("On the Hunt")));
ok("spell: Ride the Wind moves a friendly unit and readies it", eff("Ride the Wind").op === "move" && eff("Ride the Wind").ready && eff("Ride the Wind").target.side === "friendly", show(eff("Ride the Wind")));
ok("spell: Sprite Burst plays two ready 3-Might Sprites with Temporary", eff("Sprite Burst").op === "token" && eff("Sprite Burst").count === 2 && eff("Sprite Burst").ready && eff("Sprite Burst").keywords.includes("Temporary"), show(eff("Sprite Burst")));
ok("spell: Realm of Death swings -2 / +2", eff("Realm of Death").op === "swing" && eff("Realm of Death").a.n === -2 && eff("Realm of Death").b.n === 2, show(eff("Realm of Death")));
ok("spell: Hidden Blade kills a unit at a battlefield; its controller's draw is no effect this turn", eff("Hidden Blade").op === "kill" && eff("Hidden Blade").target.where === "bf" && eff("Hidden Blade", 1, 0).op === "noTurn", show(ab("Hidden Blade")));
ok("spell: Gust returns a unit at a battlefield with 3 Might or less", eff("Gust").op === "bounce" && eff("Gust").target.max === 3 && eff("Gust").target.where === "bf", show(eff("Gust")));
// statics and costs
ok("static: Sivir, Mercenary +2 and Ganking after 2 Power spent", st("Sivir, Mercenary").op === "myMight" && st("Sivir, Mercenary").n === 2 && st("Sivir, Mercenary").keyword === "Ganking" && st("Sivir, Mercenary").cond.spentPower === 2, show(st("Sivir, Mercenary")));
ok("static: Graves deals no combat damage", compile(C("Graves, Blasting Through")).statics.some((x) => x.op === "noCombat"));
ok("static: Rhasa costs 1 less per card in your trash", st("Rhasa the Sunderer").op === "costLess" && st("Rhasa the Sunderer").per, show(st("Rhasa the Sunderer")));
ok("static with a condition: Noxus Hopeful's Legion discount", st("Noxus Hopeful").op === "costLess" && /legion/i.test(st("Noxus Hopeful").cond || ""), show(st("Noxus Hopeful")));
ok("static: Portable Portal gives friendly units here Ganking", st("Portable Portal").op === "auraKeyword" && st("Portable Portal").keywords.includes("Ganking"), show(st("Portable Portal")));
ok("keywords: Sivir has Accelerate; Rengar, Trophy Hunter has Ambush", compile(C("Sivir, Mercenary")).keywords.Accelerate && compile(C("Rengar, Trophy Hunter")).keywords.Ambush);
// reminder text and honesty
ok("reminder text isn't read as effects (Hidden's reminder)", !compile(C("Switcheroo")).abilities.some((a) => /hide now/i.test(a.text)));
ok("unread stays unread: Zhonya's replacement is listed, not guessed", unread("Zhonya's Hourglass").length >= 1);

console.log(failed ? `\n${failed} failed` : "\nall cardtext tests pass");
process.exit(failed ? 1 : 0);
