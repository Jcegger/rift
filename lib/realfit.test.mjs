import { test } from "node:test";
import assert from "node:assert/strict";
import { fitBT, realAfter, rWithNoise } from "./realfit.mjs";
import { pearson } from "./calibrate.mjs";

const sig = (x) => 1 / (1 + Math.exp(-x));
let seed = 42;   // mulberry32: a plain LCG's consecutive draws correlate, which biased the fit by 2 points
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// A league with known strengths: n games between random pairs, results drawn from Bradley–Terry.
const league = (theta, n, d = "2026-11-24") => {
  const ls = Object.keys(theta), out = [];
  for (let i = 0; i < n; i++) {
    const a = ls[Math.floor(rnd() * ls.length)]; let b = a; while (b === a) b = ls[Math.floor(rnd() * ls.length)];
    out.push({ d, a, b, w: rnd() < sig(theta[a] - theta[b]) ? 1 : 0 });
  }
  return out;
};
const T = { A: 0.6, B: 0.3, C: 0, D: -0.3, E: -0.6 };
const L = Object.keys(T);
const fieldOf = (l) => L.filter((m) => m !== l).reduce((a, m) => a + sig(T[l] - T[m]), 0) / (L.length - 1);

test("recovers known strengths: equal-field win % within 2 points at 20,000 games", () => {
  const f = fitBT(league(T, 20000), L);
  for (const l of L) assert.ok(Math.abs(f.field.get(l) - fieldOf(l)) < 0.02, `${l}: ${f.field.get(l)} vs ${fieldOf(l)}`);
});

test("the prior: with no games after the date a legend keeps its earlier number; with many, the data wins", () => {
  const before = { theta: new Map(L.map((l) => [l, 0])) };
  const none = fitBT([], L, { prior: { mu: new Map(L.map((l) => [l, T[l]])), tau: 0.2 } });
  for (const l of L) assert.ok(Math.abs(none.theta.get(l) - T[l]) < 1e-9);
  const many = fitBT(league(T, 20000), L, { prior: { mu: before.theta, tau: 0.2 } });
  for (const l of L) assert.ok(Math.abs(many.field.get(l) - fieldOf(l)) < 0.03, `${l} washed out`);
});

test("realAfter: intervals cover the truth, and a perfect model sits under the noise ceiling", () => {
  const ms = [...league(T, 4000, "2026-11-20"), ...league(T, 1500, "2026-11-24")];
  const real = realAfter(ms, L, "2026-11-23", { B: 100 });
  assert.equal(real.post, 1500);
  for (const l of L) { const r = real.rows.get(l); assert.ok(r.lo <= fieldOf(l) && fieldOf(l) <= r.hi, `${l} interval`); }
  const perfect = new Map(L.map((l) => [l, fieldOf(l)]));
  const q = rWithNoise(perfect, real, pearson);
  assert.ok(q.r > 0.9 && q.ceiling > 0.9 && q.ceiling <= 1, JSON.stringify(q));
});
