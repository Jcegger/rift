// lib/calibrate.mjs: the pure parts. Run with node.
import assert from "node:assert/strict";
import { rlNameOf, topLists, realRow, pearson, spearman, mae, modelTable, rInterval } from "./calibrate.mjs";
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
console.log("all calibrate checks pass");
