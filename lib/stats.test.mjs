// lib/stats.mjs against hand-worked values. Run with node.
import assert from "node:assert/strict";
import { paired, wilson, twoRates } from "./stats.mjs";
const near = (a, b, e = 0.005) => Math.abs(a - b) < e;
{ const w = wilson(5, 10); assert.ok(near(w.lo, 0.2366) && near(w.hi, 0.7634), "Wilson 5/10 is 24–76%"); }
{ const w = wilson(0, 20); assert.ok(w.lo === 0 && near(w.hi, 0.1611), "Wilson 0/20 tops out near 16%, not 0"); }
{ const d = paired([1, 2, 3, 4], [0, 2, 2, 3]); assert.ok(near(d.mean, 0.75) && near(d.se, 0.25) && !d.noise, "paired: mean of the differences, its SE"); }
{ const d = paired([1, null, 3], [1, 2, 3]); assert.ok(d.n === 2 && d.mean === 0 && d.noise, "paired: a timeout drops the pair; identical runs are noise"); }
{ const g = twoRates(5, 33, 1, 36); assert.ok(g.noise && g.lo < 0 && g.hi > 0, "15% → 3% on ~35 positions is within noise"); }
{ const g = twoRates(10, 100, 60, 100); assert.ok(!g.noise && g.lo > 0.35, "10% → 60% on 100 each is not"); }
console.log("all stats checks pass");
