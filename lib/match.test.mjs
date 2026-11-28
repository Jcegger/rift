// lib/match.mjs: whole games scored by the rules. Run with node.
import assert from "node:assert/strict";
import { playMatch as playAny, playerOf, READERS } from "./match.mjs";
// These checks are about the greedy policy's own readers and counters (flips, channels, Gold): pinned to it. The solver
// policy (the default since 24 Nov) has its own checks at the end.
const playMatch = (a, b, r, o = {}) => playAny(a, b, r, { policy: "greedy", ...o });
import { rng } from "./sim.mjs";
import { loadCatalog } from "../scripts/state.mjs";

// Every card-text reader matches the real card it was written for. Two (Innovator's Gold, Gutter
// Guardian's Add) were tested only against hand-typed text and matched nothing real until 21 Nov 2026.
{
  const cat = await loadCatalog();
  for (const [name, [re, card]] of Object.entries(READERS)) {
    const c = cat.cards.find((x) => x.n === card && !x.v);
    assert.ok(c, `${name}: no card called ${card}`);
    assert.ok(re.test(c.x || ""), `${name} matches ${card}'s catalog text`);
  }
}

const unit = (n, e, m, x = "") => ({ n, t: "Unit", e, p: 0, m, d: ["Body"], x });
const deck = (cards) => ({ main: cards, champ: null, runes: Array(12).fill("Body"), legendGold: false, readyOnDeath: false, ability: null, spellPower: false });
const vanilla = () => deck(Array.from({ length: 40 }, (_, i) => unit(`Bear ${i}`, 2, 3)));

// A game ends with a winner at 8 or more and ahead, or runs out of turns; the same seed plays the same game.
const g1 = playMatch(vanilla(), vanilla(), rng(3)), g2 = playMatch(vanilla(), vanilla(), rng(3));
assert.deepEqual(g1.score, g2.score, "deterministic for a seed");
if (g1.winner != null) { assert.ok(g1.score[g1.winner] >= 8); assert.ok(g1.score[g1.winner] > g1.score[1 - g1.winner]); }

// Points come only from holds, conquers and Evelynn: every point is accounted for.
for (let s = 1; s <= 20; s++) {
  const g = playMatch(vanilla(), vanilla(), rng(s));
  for (const i of [0, 1]) assert.equal(g.score[i], g.st[i].holds + g.st[i].conquers + g.st[i].eve, "points add up");
}

// Against an empty deck the other side walks in: conquers both battlefields and wins on holds.
const empty = deck([]);
const g3 = playMatch(vanilla(), empty, rng(1));
assert.equal(g3.winner, 0);
assert.ok(g3.st[0].conquers >= 2 && g3.st[0].holds >= 1);
// The eighth point by Conquer is gated (§473.1.b): no win comes from a conquer at 7 without the other battlefield scored.
assert.ok(g3.score[0] >= 8);

// A mirror is roughly even across seats.
let w0 = 0, n = 200;
for (let s = 0; s < n; s++) { const g = playMatch(vanilla(), vanilla(), rng(100 + s), { firstB: s % 2 === 1 }); w0 += g.winner === 0 ? 1 : 0; }
assert.ok(w0 > n * 0.3 && w0 < n * 0.7, `mirror seat balance ${w0}/${n}`);

console.log("all match checks pass");

// Hidden units hidden on an earlier turn come down on your own turn for free (§811.1.b).
{
  const hid = (n) => ({ n, t: "Unit", e: 3, p: 0, m: 3, d: ["Chaos"], x: "[Hidden] (Hide now.)" });
  const hiders = deck(Array.from({ length: 40 }, (_, i) => (i % 2 ? hid(`Lurker ${i}`) : unit(`Bear ${i}`, 2, 3))));
  let flips = 0; for (let s = 0; s < 30; s++) flips += playMatch(hiders, vanilla(), rng(400 + s)).st[0].flips;
  assert.ok(flips > 30, `hidden units flip on their owner's turn (${flips} in 30 games)`);
  // Momentary Companion flipped on their turn is [Temporary]; on yours it stays.
  const temp = { n: "Momentary", t: "Unit", e: 4, p: 0, m: 4, d: ["Chaos"], x: "[Hidden] When you play me, if it's not your turn, give me [Temporary]." };
  const g = playMatch(deck(Array.from({ length: 40 }, (_, i) => (i % 2 ? { ...temp } : unit(`Bear ${i}`, 2, 3)))), vanilla(), rng(9));
  assert.equal(g.score[0], g.st[0].holds + g.st[0].conquers + g.st[0].eve);
}
// K'Sante channels a rune when he holds; Reckless Innovator makes a Gold when he exhausts.
{
  const ks = { n: "K'Sante, Courageous", t: "Unit", e: 5, p: 0, m: 4, d: ["Body"], x: "[Accelerate] [Shield 2] When I hold, channel 1 rune." };
  let ch = 0; for (let s = 0; s < 20; s++) ch += playMatch(deck(Array.from({ length: 40 }, (_, i) => (i % 4 ? unit(`Bear ${i}`, 2, 3) : { ...ks }))), vanilla(), rng(500 + s)).st[0].channeled;
  assert.ok(ch > 0, "K'Sante channels on a hold");
  const inn = { ...(await loadCatalog()).cards.find((c) => c.n === "Reckless Innovator" && !c.v), d: ["Chaos"] };   // the real text
  let gold = 0; for (let s = 0; s < 20; s++) gold += playMatch(deck(Array.from({ length: 40 }, (_, i) => (i % 4 ? unit(`Bear ${i}`, 2, 3) : { ...inn }))), vanilla(), rng(600 + s)).st[0].innovGold;
  assert.ok(gold > 0, "Innovator makes Gold when he exhausts");
}
// The trash engine: Merchant and Ezreal loot, Fizz recasts removal from the trash, Matriarch revives.
{
  const merch = { n: "Traveling Merchant", t: "Unit", e: 2, p: 0, m: 2, d: ["Chaos"], x: "When I move, discard 1, then draw 1." };
  const ez = { n: "Ezreal, Prodigy", t: "Unit", e: 3, p: 1, m: 3, d: ["Chaos"], x: "When you play me, discard 1, then draw 2." };
  const fizz = { n: "Fizz, Trickster", t: "Unit", e: 3, p: 1, m: 3, d: ["Chaos"], x: "When you play me, you may play a spell from your trash with Energy cost no more than :rb_energy_3:, ignoring its Energy cost. Then recycle it." };
  const kill = { n: "Zap", t: "Spell", e: 2, p: 0, d: ["Chaos"], x: "Kill a unit at a battlefield." };
  const mat = { n: "Tail-Cloaked Matriarch", t: "Unit", e: 4, p: 0, m: 4, d: ["Chaos"], x: "[Empower] :rb_energy_2::rb_rune_chaos: When I become [Empowered], you may choose a unit in your trash with Energy cost no more than :rb_energy_3: and Power cost no more than :rb_rune_rainbow: and play it to your base, ignoring its cost." };
  const mix = () => ({ ...deck(Array.from({ length: 40 }, (_, i) => ({ ...[merch, ez, fizz, kill, mat, unit(`Bear ${i}`, 2, 3)][i % 6] }))), runes: [...Array(6).fill("Body"), ...Array(6).fill("Chaos")] });
  const tot = { loots: 0, fizz: 0, revives: 0 };
  for (let s = 0; s < 40; s++) { const g = playMatch(mix(), vanilla(), rng(700 + s)); for (const k of Object.keys(tot)) tot[k] += g.st[0][k]; assert.equal(g.score[0], g.st[0].holds + g.st[0].conquers + g.st[0].eve); }
  assert.ok(tot.loots > 0, "Merchant loots when it moves");
  assert.ok(tot.fizz > 0, "Fizz recasts removal from the trash");
  assert.ok(tot.revives > 0, "Matriarch revives from the trash");
}
// Star-Crossed returns their unit and one of yours: yours goes back to hand to replay.
{
  const sc = { n: "Star-Crossed", t: "Spell", e: 3, p: 1, d: ["Chaos"], x: "[Reaction] Return a friendly unit and an enemy unit to their owners' hands." };
  const d = () => ({ ...deck(Array.from({ length: 40 }, (_, i) => (i % 4 ? unit(`Bear ${i}`, 2, 3) : { ...sc }))), runes: [...Array(6).fill("Body"), ...Array(6).fill("Chaos")] });
  let resets = 0; for (let s = 0; s < 30; s++) resets += playMatch(d(), vanilla(), rng(800 + s)).st[0].resets;
  assert.ok(resets > 0, "Star-Crossed returns a friendly unit to hand");
}
// ── the solver policy (default since 24 Nov): lib/turn.mjs plays each Main Phase ──
{
  const cat = await loadCatalog();
  const { readFileSync } = await import("node:fs");
  const decks = JSON.parse(readFileSync(new URL("../data/decks.json", import.meta.url), "utf8")).decks.filter((d) => d.lg && Object.keys(d.cards).length > 30).slice(-40);
  const ps = decks.slice(0, 4).map((d) => playerOf(d.cards, cat)).filter((p) => p.main.length >= 30);
  let done = 0, errors = 0, scored = 0;
  for (let i = 0; i < 4; i++) { const g = playAny(ps[i % ps.length], ps[(i + 1) % ps.length], rng(700 + i)); done += g.winner != null || g.endTurn == null; errors += (g.st[0].solveErrors || 0) + (g.st[1].solveErrors || 0); scored += g.score[0] + g.score[1]; }
  assert.equal(errors, 0, `solver games: ${errors} Main Phases failed to solve`);
  assert.ok(scored > 8, `solver games score points (${scored} over 4 games)`);
  console.log(`  ok   solver policy: 4 real-list games, ${scored} points scored, no solve errors`);
  // A card the greedy policy never read: Bilgewater Tracker ("When you play me, deal 1 to each of up to 2 units") against a
  // deck of 1 Might units. The solver plays the damage, so the same games (fixed seeds) end with a wider margin.
  const unit = (n, e, m, x = "") => ({ n, t: "Unit", e, p: 0, m, x, d: ["Fury"] });
  const tracker = cat.cards.find((c) => c.n === "Bilgewater Tracker" && !c.v);
  const deckOf = (cards) => ({ main: cards, champ: null, runes: Array(12).fill("Fury"), battlefields: [] });
  const margin = (policy) => { let m = 0; for (let i = 0; i < 6; i++) { const g = playAny(deckOf(Array.from({ length: 40 }, (_, j) => (j % 2 ? { ...tracker } : unit(`Bear ${j}`, 2, 2)))), deckOf(Array.from({ length: 40 }, (_, j) => unit(`One ${j}`, 1, 1))), rng(800 + i), { maxTurns: 8, policy }); m += g.at8[0] - g.at8[1]; } return m; };
  const mg = margin("greedy"), ms = margin("solver");
  assert.ok(ms > mg, `Bilgewater Tracker's damage played by the solver: margin ${ms} vs greedy ${mg}`);
  console.log(`  ok   solver policy: Bilgewater Tracker's play damage widens the margin (${ms} vs greedy ${mg})`);
}
// A changed list keeps its places: an added card takes a removed card's place, the rest stay put (deckOrder's like).
{
  const cat = await loadCatalog();
  const { deckOrder } = await import("./match.mjs");
  const code = (n) => cat.cards.find((c) => c.n === n && !c.v).c;
  const [a, b, x, z] = ["Gust", "Rebuke", "Switcheroo", "Edge of Night"].map(code);
  const base = { [a]: 2, [b]: 1, [z]: 2 }, after = { [a]: 1, [b]: 1, [z]: 2, [x]: 1 };
  const o0 = deckOrder(base, cat), o1 = deckOrder(after, cat, base);
  assert.equal(o1.length, o0.length);
  assert.deepEqual(o1.map((k, i) => (k === o0[i] ? "=" : `${cat.BY.get(o0[i]).n}>${cat.BY.get(k).n}`)).filter((v) => v !== "="), ["Gust>Switcheroo"], "only the swapped place changes");
  assert.deepEqual(deckOrder(base, cat, base), o0, "a list like itself is its own order");
  console.log("  ok   a swap keeps every other card's place (deckOrder)");
}
// The pool (lib/match-pool.mjs) plays each game by its index, so pooled and serial runs are the same games, record for record.
{
  const cat = await loadCatalog();
  const { readFileSync } = await import("node:fs");
  const { matchReport } = await import("./match.mjs");
  const { matchReportPar } = await import("./match-pool.mjs");
  const snap = JSON.parse(readFileSync(new URL("../data/decks.json", import.meta.url), "utf8"));
  const ds = snap.decks.filter((d) => d.cards && Object.values(d.cards).reduce((a, b) => a + b, 0) >= 40).slice(-6);
  const deck = { cards: ds[0].cards }, foes = ds.slice(1).map((d, k) => ({ label: `f${k}`, cards: d.cards }));
  const o = { games: 4, policy: "greedy" };
  const a = matchReport(deck, cat, foes, o), b = await matchReportPar(deck, cat, foes, o);
  assert.deepEqual(b, a, "pooled games equal serial games");
  console.log(`  ok   pooled model games equal serial ones (${a.games} games, ${a.timeouts} timeouts)`);
  // Hidden hands (each side plans on a guess at the other's hand, seeded per game and turn): still the same games pooled.
  const oh = { games: 3, policy: "solver", hiddenHands: true };
  const ah = matchReport(deck, cat, foes, oh), bh = await matchReportPar(deck, cat, foes, oh);
  assert.deepEqual(bh, ah, "pooled hidden-hand games equal serial ones");
  assert.equal(ah.solveErrors[0] + ah.solveErrors[1], 0, "hidden hands: no solver errors");
  console.log(`  ok   hidden hands: pooled equals serial, no solver errors (${ah.games} games)`);
  // trace (rift trace) only reads: the same games with it on, one event per turn played, the last one on the final score.
  const { matchPlayers, matchGame } = await import("./match.mjs");
  const { me, them } = matchPlayers(deck, cat, foes);
  for (let i = 0; i < 2; i++) {
    const ev = [], plain = matchGame(me, them, i), traced = matchGame(me, them, i, { trace: (e) => ev.push(e) });
    assert.deepEqual(traced, plain, "trace doesn't change the game");
    assert.ok(ev.length > 0 && ev.every((e, k) => e.turn === k + 1), "an event for every turn, in order");   // a win by hold ends before that turn's event
    assert.ok(ev.every((e) => Array.isArray(e.left) && Array.isArray(e.units)), "events carry what left the hand and the board");
  }
  console.log("  ok   trace: the same games, an event every turn");
  // defendAll false (25 Nov): "Main 4" (ready units at base sent out to defend) never runs.
  const main4 = (o) => { let n = 0; for (let i = 0; i < 6; i++) { const g = matchGame(me, them, i, o); n += g.s.defended; } return n; };
  const withMain4 = main4({}), without = main4({ defendAll: false });
  assert.equal(without, 0, "defendAll false: Main 4 never moves a unit");
  console.log(`  ok   defendAll false: Main 4 moved ${withMain4} units in 6 games by default, none without`);
  // Battlefields played as text (27 Nov): Amateur Recital sends one of their units home on our hold; Hallowed Tomb
  // returns our dead Chosen Champion on our hold. Forced onto every game with ourBf; a plain battlefield fires neither.
  const sum = (o, k) => { let n = 0; for (let i = 0; i < 12; i++) n += matchGame(me, them, i, o).s[k]; return n; };
  const rec = sum({ ourBf: "Amateur Recital" }, "recitals"), tomb = sum({ ourBf: "Hallowed Tomb" }, "tombs");
  assert.ok(rec > 0, "Amateur Recital moves a unit home on some hold");
  assert.equal(sum({ ourBf: "Forbidding Waste" }, "recitals") + sum({ ourBf: "Forbidding Waste" }, "tombs"), 0, "other battlefields fire neither");
  console.log(`  ok   Amateur Recital sent ${rec} units home in 12 games; Hallowed Tomb returned the champion ${tomb} times`);
}
// Caution (25 Nov): runes up and a reaction in their deck: the guess at their hand holds one (caution 1), and nothing changes
// with caution 0, with no runes up, or when the guess already holds one.
{
  const { cautious } = await import("./match.mjs");
  const cat = await loadCatalog();
  const nsf = cat.cards.find((c) => c.n === "Not So Fast" && !c.v), body = { n: "Body", t: "Unit", m: 3, e: 3, x: "" };
  const O = (ready) => ({ board: Array(3).fill(0).map(() => ({ ready, d: "Calm" })), gold: 0 });
  const zero = () => 0;
  assert.deepEqual(cautious([body], [nsf], O(true), 1, zero).map((c) => c.n), ["Not So Fast"]);
  assert.deepEqual(cautious([body], [nsf], O(true), 0, zero).map((c) => c.n), ["Body"]);
  assert.deepEqual(cautious([body], [nsf], O(false), 1, zero).map((c) => c.n), ["Body"]);
  assert.deepEqual(cautious([nsf], [body], O(true), 1, zero).map((c) => c.n), ["Not So Fast"]);
  console.log("  ok   caution: open runes put a reaction in the guess");
}
console.log("all match checks pass (greedy readers, flips, Temporary, hold and exhaust triggers, trash engine, Star-Crossed; the solver policy)");
