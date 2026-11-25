// The real side of the calibration, estimated rather than pooled (25 Nov; Jay: post-ban numbers are closer to the truth,
// even thin). RiftLite's match records (data/matches.json) after a date are few (about 100 games a legend in the first
// days after the 23 Nov bans), so:
//
// - Bradley–Terry: one strength per legend, fitted from every game between legends of the set at once. P(a beats b) =
//   σ(θa − θb); a draw counts half. A legend's number is its expected win rate against an equal mix of the others in the
//   set: the same quantity the model's games measure (each opponent played equally). A pooled row instead weights each
//   opponent by how often it was actually met.
// - A prior from before the date: θ ~ N(θ_before, τ²). τ is fitted from the data (empirical Bayes, method of moments):
//   how far legends moved across the date beyond what sampling noise explains. A legend with few games after the date
//   leans on its earlier number; with many, the prior washes out.
// - The bootstrap (matches resampled with replacement) gives each legend's interval, r's interval against a model
//   column, and the noise ceiling: the r a perfect model could reach against data this noisy.

const sig = (x) => 1 / (1 + Math.exp(-x));

// MAP fit by coordinate Newton steps. prior: { mu: Map(legend → θ), tau } or null (a weak ridge keeps θ finite).
export function fitBT(matches, legends, { prior = null, iters = 60 } = {}) {
  const idx = new Map(legends.map((l, i) => [l, i])), n = legends.length;
  const games = matches.filter((m) => idx.has(m.a) && idx.has(m.b) && m.a !== m.b).map((m) => [idx.get(m.a), idx.get(m.b), m.w]);
  const by = Array.from({ length: n }, () => []);
  for (const [a, b, w] of games) { by[a].push([b, w]); by[b].push([a, 1 - w]); }
  const mu = legends.map((l) => prior?.mu?.get(l) ?? 0), prec = prior ? 1 / (prior.tau * prior.tau) : 0.01;
  const th = mu.slice(), se = Array(n).fill(0);
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      let g = -(th[i] - mu[i]) * prec, h = prec;
      for (const [j, w] of by[i]) { const p = sig(th[i] - th[j]); g += w - p; h += p * (1 - p); }
      th[i] += g / h; se[i] = 1 / Math.sqrt(h);
    }
    if (!prior) { const c = th.reduce((a, b) => a + b, 0) / n; for (let i = 0; i < n; i++) th[i] -= c; }   // only differences matter
  }
  const field = legends.map((_, i) => legends.reduce((a, _, j) => (j === i ? a : a + sig(th[i] - th[j])), 0) / (n - 1));
  return { theta: new Map(legends.map((l, i) => [l, th[i]])), se: new Map(legends.map((l, i) => [l, se[i]])),
    field: new Map(legends.map((l, i) => [l, field[i]])), games: new Map(legends.map((l, i) => [l, by[i].length])) };
}

// τ by method of moments: the spread of (after − before) strengths, less the sampling variance of the after fit.
export function fitTau(before, after, legends) {
  const d = legends.map((l) => after.theta.get(l) - before.theta.get(l)), m = d.reduce((a, b) => a + b, 0) / d.length;
  const v = d.reduce((a, x) => a + (x - m) ** 2, 0) / (d.length - 1);
  const noise = legends.reduce((a, l) => a + after.se.get(l) ** 2 + before.se.get(l) ** 2, 0) / legends.length;
  return Math.sqrt(Math.max(0.01, v - noise));   // at least 0.1 on the logit scale (about 2.5 points)
}

// A deterministic RNG so a run's bootstrap is repeatable.
const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// The real column after `since`: the fit, its bootstrap intervals, and the bootstrap replicates (for r's interval).
export function realAfter(matches, legends, since, { B = 300, seed = 7 } = {}) {
  const set = new Set(legends), inSet = matches.filter((m) => set.has(m.a) && set.has(m.b) && m.a !== m.b);
  const pre = inSet.filter((m) => m.d < since), post = inSet.filter((m) => m.d >= since);
  // The whole estimate (prior, τ, posterior) from one sample of each side; the bootstrap redraws both, so the prior's
  // own noise is in the intervals (a first version redrew only the later games: ±1.5 points, far too sure).
  const estimate = (pr, po) => {
    const before = fitBT(pr, legends), tau = fitTau(before, fitBT(po, legends), legends);
    return { fit: fitBT(po, legends, { prior: { mu: before.theta, tau } }), before, tau };
  };
  const { fit: est, before, tau } = estimate(pre, post), g = mulberry(seed), reps = [];
  const draw = (xs) => xs.map(() => xs[Math.floor(g() * xs.length)]);
  for (let b = 0; b < B; b++) reps.push(estimate(draw(pre), draw(post)).fit.field);
  const q = (xs, p) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))];
  const rows = new Map(legends.map((l) => { const xs = reps.map((r) => r.get(l)); return [l, { p: est.field.get(l), lo: q(xs, 0.025), hi: q(xs, 0.975), n: est.games.get(l), before: before.field.get(l) }]; }));
  return { rows, reps, tau, pre: pre.length, post: post.length };
}

// r between a model column and the real one, its bootstrap interval, and the noise ceiling: sqrt(true variance / observed
// variance) of the real column, the correlation a perfect model would have with it.
export function rWithNoise(model, real, pearson) {
  const ls = [...model.keys()].filter((l) => real.rows.has(l));
  const xs = ls.map((l) => model.get(l)), r = pearson(xs, ls.map((l) => real.rows.get(l).p));
  const rs = real.reps.map((rep) => pearson(xs, ls.map((l) => rep.get(l)))).filter((x) => x != null).sort((a, b) => a - b);
  const ys = ls.map((l) => real.rows.get(l).p), my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const obs = ys.reduce((a, y) => a + (y - my) ** 2, 0) / (ys.length - 1);
  const noise = ls.reduce((a, l) => { const v = real.reps.map((rep) => rep.get(l)), m = v.reduce((x, y) => x + y, 0) / v.length; return a + v.reduce((x, y) => x + (y - m) ** 2, 0) / (v.length - 1); }, 0) / ls.length;
  return { r, lo: rs[Math.floor(0.025 * rs.length)], hi: rs[Math.floor(0.975 * rs.length)], ceiling: Math.sqrt(Math.max(0, obs - noise) / obs), sd: Math.sqrt(obs), noiseSd: Math.sqrt(noise) };
}
