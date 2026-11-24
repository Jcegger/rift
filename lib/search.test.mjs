// lib/search.mjs with a fake player: each "deck" is a margin offset plus the same per-game noise, so the bench's pairing
// is exact and the answer is known. Run with node.
import assert from "node:assert/strict";
import { halving } from "./search.mjs";
import { rng } from "./sim.mjs";
const noise = (i) => { const r = rng(900 + i); return Math.round((r() - 0.5) * 8); };
const play = async (deck, s, e) => Array.from({ length: e - s }, (_, k) => { const i = s + k, m = noise(i) + deck.off + Math.round((rng(7000 + i * 31 + deck.id)() - 0.5) * 6);
  return { i, at8: [Math.max(0, 5 + m), 5], winner: m > 0 ? 0 : m < 0 ? 1 : null }; });
const cands = [{ label: "much worse", deck: { off: -3, id: 1 } }, { label: "same", deck: { off: 0, id: 2 } }, { label: "a bit better", deck: { off: 0.5, id: 3 } },
  { label: "same again", deck: { off: 0, id: 4 } }, { label: "worse", deck: { off: -1.5, id: 5 } }];
const res = await halving({ base: { label: "as is", deck: { off: 0, id: 0 } }, cands, play, games: 40, budget: 3000, keep: 2 });
for (const r of res.rows) console.log(`  ${r.label}: ${r.games} games, margin ${r.margin.toFixed(2)}${r.out ? `, out ${r.out}` : ""}`);
const by = Object.fromEntries(res.rows.map((r) => [r.label, r]));
assert.ok(by["much worse"].out?.startsWith("round 1"), "a clearly bad swap leaves in round 1");
assert.ok(by["worse"].out, "a worse swap leaves");
assert.ok(!by["a bit better"].out, "the best stays in");
assert.equal(res.rows[0].label, "a bit better", "and ranks first");
assert.ok(by["much worse"].games < by["a bit better"].games, "games go to the ones still in");
assert.ok(res.spent <= 3000, "the budget holds");
for (const r of res.rows) assert.ok(r.vsBase.n === r.games, "each row is paired with the base over its own games");
{ // Nothing beats the deck as it is: the worse swaps still leave, against it.
  const r2 = await halving({ base: { label: "as is", deck: { off: 0, id: 0 } }, cands: [cands[0], cands[4]], play, games: 40, budget: 3000, keep: 0, maxRounds: 3 });
  assert.ok(r2.rows.every((r) => r.out && /than as is/.test(r.out)), "worse swaps leave against the deck as it is");
}
console.log(`all search checks pass (${res.rounds} rounds, ${res.spent} games)`);
