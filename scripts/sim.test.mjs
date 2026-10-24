#!/usr/bin/env node
// Tests for scripts/sim.mjs: the rules it claims to model, and the card-text reads it
// relies on, checked against real cards. Run: node scripts/sim.test.mjs
import { loadCatalog } from "./state.mjs";
import { tokensOf, classify, buildDeck, playGame, POLICIES, rng, simulate } from "./sim.mjs";

let fails = 0;
const ok = (name, cond, detail = "") => {
  console.log(`  ${cond ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!cond) fails++;
};
const cat = await loadCatalog();
const card = (n) => cat.cards.find((c) => c.n === n && !c.v) || cat.cards.find((c) => c.n === n);

console.log("\ncard text reads");
const toks = (n) => tokensOf(card(n).x);
ok("Faithful Manufactor makes one 1-Might Recruit on play", JSON.stringify(toks("Faithful Manufactor").units) === '[{"m":1,"temp":false}]');
ok("Vanguard Captain makes two Recruits", toks("Vanguard Captain").units.length === 2);
ok("Sprite Call makes a Temporary 3-Might Sprite", toks("Sprite Call").units[0]?.temp === true && toks("Sprite Call").units[0]?.m === 3);
ok("Machine Evangel's Deathknell tokens are not counted on play", toks("Machine Evangel").units.length === 0);
ok("Noxian Drummer's on-move token is not counted on play", toks("Noxian Drummer").units.length === 0);
ok("Viktor, Innovator's opponent's-turn token is not counted", toks("Viktor, Innovator").units.length === 0);
const k = (n) => classify(card(n));
ok("Defy is interaction", k("Defy").role === "interaction");
ok("Gust (bounce) is interaction", k("Gust").role === "interaction");
ok("Falling Star (removal) is interaction", k("Falling Star").role === "interaction");
ok("Meditation is proactive, draws 2 with a unit, 1 without", k("Meditation").role === "proactive" && k("Meditation").draws === 2 && k("Meditation").drawsAlone === 1 && !k("Meditation").needsUnit);
ok("Discipline needs a unit and draws 1", k("Discipline").needsUnit && k("Discipline").draws === 1);
ok("Life from Stone channels a rune and draws 1", k("Life from Stone").channels === 1 && k("Life from Stone").draws === 1);
ok("units are never interaction", cat.cards.filter((c) => c.t === "Unit").every((c) => classify(c).role === "proactive"));

console.log("\nlegend abilities");
const deckFor = (legendName) => {
  const lg = cat.cards.find((c) => c.t === "Legend" && c.n === legendName);
  return buildDeck({ [lg.c]: 1 }, cat, { legendCard: lg });
};
ok("Viktor's legend makes a 1-Might Recruit for 1 Energy", deckFor("Herald of the Arcane").ability?.e === 1 && deckFor("Herald of the Arcane").ability?.tok.units[0].m === 1);
ok("Azir's legend makes a 2-Might Sand Soldier", deckFor("Emperor of the Sands").ability?.tok.units[0].m === 2);
ok("Lillia's legend makes a Temporary Sprite", deckFor("Bashful Bloom").ability?.tok.units[0].temp === true);
ok("Riven's legend is not an activated ability", deckFor("The Exile").ability === null);

console.log("\nrules, over 4,000 games of a real deck");
// A synthetic two-domain deck from real cards, so the test does not depend on a saved deck.
const pick = cat.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && c.d?.length === 1 && ["Calm", "Chaos"].includes(c.d[0]));
const list = {};
for (const c of pick.slice(0, 14)) list[c.c] = 3;
const rune = (d) => cat.cards.find((c) => c.t === "Rune" && c.d?.[0] === d && !c.v);
list[rune("Calm").c] = 6; list[rune("Chaos").c] = 6;
const deck = buildDeck(list, cat, {});
ok("deck has 12 runes", deck.runes.length === 12);
let bad = { spend: 0, t1: 0, units: 0, hand: 0 };
for (const onDraw of [false, true]) {
  const r = rng(42);
  for (let i = 0; i < 2000; i++) {
    const g = playGame(deck, r, onDraw, POLICIES["keep all"], []);
    g.spent.forEach((e, t) => { if (e > g.runes[t]) bad.spend++; });   // channelled runes arrive after the Main Phase here
    if (g.runes[0] !== (onDraw ? 3 : 2)) bad.t1++;
    if (g.units.some((u) => u < 0)) bad.units++;
    if (g.hand.some((h) => h < 0)) bad.hand++;
  }
}
ok("first turn channels 2 on the play, 3 on the draw (§487.7)", bad.t1 === 0, `${bad.t1} wrong`);
ok("never spends Energy the board cannot make", bad.spend === 0, `${bad.spend} turns over`);
ok("unit and hand counts never go negative", bad.units === 0 && bad.hand === 0);
const a = simulate(deck, { games: 1000, seed: 9 }), b = simulate(deck, { games: 1000, seed: 9 });
ok("same seed, same result", JSON.stringify(a) === JSON.stringify(b));
const r1 = playGame(deck, rng(5), false, POLICIES["keep all"], []);
ok("turn-1 Energy on the play is at most 2", r1.spent[0] <= 2);

console.log("\nGold, hiding and their turn");
ok("Battle Mistress makes Gold on a recycle", deckFor("Battle Mistress").legendGold === true);
ok("other legends don't", deckFor("The Exile").legendGold === false);
// A Body/Chaos deck under Battle Mistress, from real cards: Power-heavy, with Hidden cards.
const bm = cat.cards.find((c) => c.t === "Legend" && c.n === "Battle Mistress");
const bc = cat.cards.filter((c) => !c.v && ["Unit", "Spell"].includes(c.t) && c.d?.length === 1 && ["Body", "Chaos"].includes(c.d[0]) && (c.e || 0) <= 4);
const glist = { [bm.c]: 1 };
for (const c of [...bc.filter((c) => c.p).slice(0, 8), ...bc.filter((c) => /\[Hidden\]/.test(c.x || "")).slice(0, 5)]) glist[c.c] = 3;
glist[rune("Body").c] = 6; glist[rune("Chaos").c] = 6;
const gd = buildDeck(glist, cat, {});
const noGold = { ...gd, legendGold: false };
const energy = (d, opts) => { const r = rng(3); let e = 0; for (let i = 0; i < 2000; i++) e += playGame(d, r, false, POLICIES["keep all"], [], null, opts).spent.slice(0, 4).reduce((x, y) => x + y, 0); return e / 2000; };
ok("the legend's Gold never costs Energy", energy(gd, {}) >= energy(noGold, {}) - 0.01, `${energy(gd, {}).toFixed(2)} vs ${energy(noGold, {}).toFixed(2)}`);
let gbad = { gold: 0, down: 0, early: 0, spend: 0 };
const hiddenNames = gd.main.filter((c) => c.hidden).map((c) => c.n);
for (const onDraw of [false, true]) {
  const r = rng(11);
  for (let i = 0; i < 2000; i++) {
    const g = playGame(gd, r, onDraw, POLICIES["keep all"], hiddenNames.slice(0, 1), null, { hide: true });
    if (g.gold.some((x) => x < 0)) gbad.gold++;
    if (g.facedown.some((x) => x > 2)) gbad.down++;
    if (g.facedown[0] > 0) gbad.early++;
    g.spent.forEach((e, t) => { if (e > g.runes[t]) gbad.spend++; });
  }
}
ok("Gold never goes negative", gbad.gold === 0);
ok("never more than two face down, one per battlefield", gbad.down === 0);
ok("nothing is hidden on turn 1 (no battlefield held yet)", gbad.early === 0);
ok("hiding never spends Energy the board cannot make", gbad.spend === 0);
const off = playGame(gd, rng(5), false, POLICIES["keep all"], []);
ok("hiding is off unless asked", off.facedown.every((x) => x === 0));

console.log(fails ? `\n${fails} FAILED` : "\nall sim tests pass");
process.exit(fails ? 1 : 0);
