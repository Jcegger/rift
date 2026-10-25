#!/usr/bin/env node
// Tests for scripts/sim.mjs: the rules it claims to model, and the card-text reads it
// relies on, checked against real cards. Run: node scripts/sim.test.mjs
import { loadCatalog } from "./state.mjs";
import { tokensOf, classify, engineOf, buildDeck, playGame, POLICIES, rng, simulate } from "./sim.mjs";

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

console.log("\nthe trash-and-recursion engine, and the Power budget");
const eng = (n) => engineOf(cat.cards.find((c) => c.n === n && !c.v));
ok("Ezreal discards 1 and draws 2 on play", eng("Ezreal, Prodigy").playDiscard === 1 && eng("Ezreal, Prodigy").playDraw === 2);
ok("Traveling Merchant discards and draws when it moves", eng("Traveling Merchant").moveDiscard === 1 && eng("Traveling Merchant").moveDraw === 1);
ok("Shadow Order Disciple burns 1 when it moves", eng("Shadow Order Disciple").moveBurn === 1);
ok("Fizz recasts a spell of 3 Energy or less", eng("Fizz, Trickster").recastMax === 3);
ok("Matriarch's Empower is 2 Energy and a Chaos, reviving 3 or less", JSON.stringify(eng("Tail-Cloaked Matriarch").revive) === JSON.stringify({ e: 2, d: "Chaos", max: 3 }));
ok("Rampage kills; Star-Crossed and Gust only bounce", eng("Rampage").kills && !eng("Star-Crossed").kills && !eng("Gust").kills && eng("Gust").trick);
ok("Battle Mistress readies when enemy units die", deckFor("Battle Mistress").readyOnDeath === true);
const byN = (n) => cat.cards.find((c) => c.n === n && !c.v).c;
const elist = { [bm.c]: 1, [rune("Body").c]: 6, [rune("Chaos").c]: 6 };
for (const [n, q] of [["Ezreal, Prodigy", 3], ["Traveling Merchant", 3], ["Shadow Order Disciple", 3], ["Fizz, Trickster", 3], ["Tail-Cloaked Matriarch", 3],
  ["Punch First", 3], ["Gust", 3], ["Rampage", 3], ["Star-Crossed", 3], ["Switcheroo", 3], ["Staunch Survivor", 3], ["Tideturner", 3], ["Tornado Warrior", 1]]) elist[byN(n)] = q;
const ed = buildDeck(elist, cat, {});
let ebad = { trash: 0, fizz: 0, books: 0, gold: 0 }, fizzSeen = 0, revived = 0, drew = 0;
for (const onDraw of [false, true]) {
  const r = rng(21);
  for (let i = 0; i < 1500; i++) {
    const g = playGame(ed, r, onDraw, POLICIES["keep all"], [], null, { hide: true, engine: { tricksPerTurn: 0.7, deathsPerTurn: 0.7 } }), e = g.engine;
    if (g.trashSpells.some((x) => x < 0) || g.trashUnits.some((x) => x < 0)) ebad.trash++;
    if (e.fizzHits + e.fizzUnpaid > e.fizzPlays) ebad.fizz++;
    const spent = Object.values(e.pay).reduce((a, b) => a + b, 0);
    if (spent !== e.fromRunes + e.fromGold) ebad.books++;
    if (g.gold.some((x) => x < 0)) ebad.gold++;
    fizzSeen += e.fizzHits; revived += e.matHits; drew += e.drawn;
  }
}
ok("the trash never goes negative", ebad.trash === 0);
ok("Fizz never hits more than he's played", ebad.fizz === 0);
ok("every Power spent is paid by exactly one rune or one Gold", ebad.books === 0, `${ebad.books} games off`);
ok("Gold never goes negative with the engine on", ebad.gold === 0);
ok("the engine runs: Fizz recasts, Matriarch revives, Ezreal and Merchant draw", fizzSeen > 0 && revived > 0 && drew > 0);
ok("the engine is off unless asked", playGame(ed, rng(5), false, POLICIES["keep all"], []).engine === undefined);

console.log("\nloops, their turn, and the clock");
ok("Star-Crossed reads as returning your own unit", eng("Star-Crossed").ownBounce === true && !eng("Gust").ownBounce);
ok("Evelynn, In Control reads as a hold point", eng("Evelynn, In Control").holdPoint === true);
ok("Tornado empowers when flipped; Tideturner's swap moves the other unit; Elnuk recycles when flipped",
  eng("Tornado Warrior").flipEmpower && eng("Tideturner").swapMove && eng("Elnuk Herd").flipRecycle);
const lp = { ...elist, [byN("Evelynn, In Control")]: 3, [byN("Tornado Warrior")]: 3 };
const ld = buildDeck(lp, cat, {});
const runL = (sc, n = 1200) => { const A = { dais: 0, eve: 0, ans: 0, att: 0, hand: 0, bad: 0, u: 0 }; const r = rng(31);
  for (let i = 0; i < n; i++) { const g = playGame(ld, r, i % 2 === 1, POLICIES["keep all"], ["Switcheroo", "Star-Crossed"], null, { hide: true, turns: 8, engine: sc }), e = g.engine;
    A.dais += e.daisReplays; A.eve += e.evelynnPoints; A.ans += e.answered; A.att += e.attacks; A.hand += e.answeredHand; if (g.units.some((x) => x < 0) || e.answered > e.attacks) A.bad++; A.u += g.units[7]; }
  return A; };
const q = runL({}), dais = runL({ dais: true }), att = runL({ attacksPerTurn: 1 }), keep = runL({ attacksPerTurn: 1, keepForEvelynn: true }), hold = runL({ attacksPerTurn: 1, holdUp: 3 });
ok("Emperor's Dais replays a unit when on", dais.dais > 0 && q.dais === 0);
ok("Evelynn scores in a quiet game", q.eve > 0);
ok("keeping a face-down card for Evelynn scores more under attack than flipping it", keep.eve > att.eve, `${keep.eve} vs ${att.eve}`);
ok("holding Energy up answers more attacks from hand", hold.hand > att.hand, `${hold.hand} vs ${att.hand}`);
ok("never more answers than attacks, never negative units", [q, dais, att, keep, hold].every((x) => x.bad === 0));
ok("eight turns are played when asked", playGame(ld, rng(3), false, POLICIES["keep all"], [], null, { turns: 8, engine: {} }).units.length === 8);

console.log(fails ? `\n${fails} FAILED` : "\nall sim tests pass");
process.exit(fails ? 1 : 0);
