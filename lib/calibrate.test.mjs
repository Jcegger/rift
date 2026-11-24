// lib/calibrate.mjs: the pure parts. Run with node.
import assert from "node:assert/strict";
import { rlNameOf, topLists, realRow, pearson, spearman, mae, modelTable, rInterval, lifts, medoid, pickSwaps } from "./calibrate.mjs";
const names = new Set(["Kai'Sa", "Master Yi, Wuju Bladesman", "Master Yi"]);
assert.equal(rlNameOf({ n: "Daughter of the Void", g: ["Kai'Sa"] }, names), "Kai'Sa", "a champion with one legend is named by champion");
assert.equal(rlNameOf({ n: "Wuju Bladesman", g: ["Master Yi"] }, names), "Master Yi, Wuju Bladesman", "a champion with two is named in full");
assert.equal(rlNameOf({ n: "Other Title", g: ["Master Yi"] }, names), null, "the bare champion isn't guessed when a titled one exists");
assert.deepEqual(topLists([{ dt: "2026-11-01" }, { tour: 1, pl: 3, dt: "2026-10-20" }, { tour: 1, pl: 1, dt: "2026-10-18" }, { dt: "2026-11-05" }], 3).map((d) => d.pl ?? d.dt),
  [1, 3, "2026-11-05"], "placed lists first by placing, then the newest");
const W = { pairs: [{ a: "A", b: "B", wr: 60, n: 100 }, { a: "A", b: "C", wr: 40, n: 50 }, { a: "A", b: "D", wr: 0, n: 500 }] };
assert.ok(Math.abs(realRow(W, "A", new Set(["A", "B", "C"])).p - (60 + 20) / 150) < 1e-9, "a real row pools over the set's opponents only");
assert.ok(Math.abs(pearson([1, 2, 3, 4], [2, 4, 6, 8]) - 1) < 1e-9 && Math.abs(pearson([1, 2, 3], [3, 2, 1]) + 1) < 1e-9, "Pearson ±1");
assert.ok(Math.abs(spearman([1, 2, 3, 10], [1, 4, 9, 16]) - 1) < 1e-9, "Spearman reads rank only");
assert.equal(mae([0.5, 0.6], [0.4, 0.8]), (0.1 + 0.2) / 2);
const T = modelTable([{ me: "A", recs: [{ label: "B", winner: 0 }, { label: "B", winner: 1 }, { label: "C", winner: null }] }]);
assert.deepEqual(T.leg.A, { w: 1, l: 1, t: 1 }); assert.deepEqual(T.leg.B, { w: 1, l: 1, t: 0 }); assert.deepEqual(T.pair["B|A"], { w: 1, l: 1, t: 0 });
{ const i = rInterval(0.29, 12); assert.ok(i.lo < -0.3 && i.hi > 0.7, `r 0.29 over 12 legends: ${i.lo.toFixed(2)} to ${i.hi.toFixed(2)}`); }
{ // Lift and swaps on hand-made lists: winners run 3 Good and 0 Bad, the rest 1 Good and 3 Bad; Filler is in all.
  const M = (g, b, f = 2) => new Map([["Good", g], ["Bad", b], ["Filler", f], ["Rare", 0]].filter(([, q]) => q));
  const mains = [...Array(20)].map((_, i) => (i < 8 ? M(3, 0) : M(1, 3)));
  const good = mains.map((_, i) => i < 8);
  const L = lifts(mains, good, { boots: 200 });
  assert.ok(Math.abs(L.get("Good").lift - 2) < 1e-9 && Math.abs(L.get("Bad").lift + 3) < 1e-9 && L.get("Filler").lift === 0, "lift: winners' mean copies minus the rest's");
  assert.ok(L.get("Good").lo > 0 && L.get("Bad").hi < 0, "a clean split's interval excludes 0");
  assert.ok(!L.has("Rare"), "cards under minShare don't count");
  const base = new Map([["Good", 1], ["Bad", 3], ["Filler", 2]]);
  const S = pickSwaps(base, L, { k: 1 });
  const tw = S.find((x) => x.dir === "toward"), aw = S.find((x) => x.dir === "away");
  assert.ok(tw.out === "Bad" && tw.in === "Good" && Math.abs(tw.real - 5) < 1e-9 && tw.lo > 0, "toward winners: lowest-lift card out, highest in");
  assert.ok(aw.out === "Good" && aw.in === "Filler" && aw.real < 0, "away: the reverse (Bad is at 3 already, so the next-lowest goes in)");
  assert.ok(pickSwaps(new Map([["Good", 3], ["Bad", 1]]), L, { k: 1 }).every((x) => x.in !== "Good"), "never past 3 copies");
  assert.ok(pickSwaps(base, L, { k: 1, keepOut: new Set(["Bad"]) }).every((x) => x.out !== "Bad"), "keepOut is never taken out");
  assert.equal(medoid([new Map([["a", 3]]), new Map([["a", 2], ["b", 1]]), new Map([["a", 3]])], (x, y) => [...x].reduce((s, [n, q]) => s + Math.max(0, q - (y.get(n) || 0)), 0)), 0, "medoid: the list nearest the rest");
}
console.log("all calibrate checks pass");
