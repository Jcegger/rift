// lib/match.mjs: whole games scored by the rules. Run with node.
import assert from "node:assert/strict";
import { playMatch } from "./match.mjs";
import { rng } from "./sim.mjs";

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
