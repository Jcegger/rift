// The few statistics the bench needs to say whether a difference is a difference. 95% intervals throughout.
//
//   paired(after, before)  same games, two decks: the mean of the per-game differences ± its interval
//   wilson(k, n)           a rate's interval (wins of games, wins of positions), honest at small n and near 0 or 1
//   twoRates(k1,n1,k2,n2)  two rates from different samples (close's positions): the gap ± its interval (Newcombe)

const Z = 1.96;

export function meanSe(xs) {
  const v = xs.filter((x) => x != null);
  const n = v.length;
  if (!n) return { n: 0, mean: null, se: null };
  const m = v.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1)) : 0;
  return { n, mean: m, se: sd / Math.sqrt(n) };
}

// Pairs where either side is null (a timeout) are dropped from both.
export function paired(after, before) {
  const d = [];
  for (let i = 0; i < Math.min(after.length, before.length); i++) if (after[i] != null && before[i] != null) d.push(after[i] - before[i]);
  const { n, mean, se } = meanSe(d);
  if (!n) return { n: 0, mean: null, lo: null, hi: null, noise: true };
  return { n, mean, se, lo: mean - Z * se, hi: mean + Z * se, noise: mean - Z * se <= 0 && mean + Z * se >= 0 };
}

export function wilson(k, n) {
  if (!n) return { p: null, lo: null, hi: null, n: 0 };
  const p = k / n, d = 1 + (Z * Z) / n;
  const c = (p + (Z * Z) / (2 * n)) / d, h = (Z * Math.sqrt((p * (1 - p)) / n + (Z * Z) / (4 * n * n))) / d;
  return { p, lo: Math.max(0, c - h), hi: Math.min(1, c + h), n };
}

// Newcombe's hybrid score interval for p2 − p1.
export function twoRates(k1, n1, k2, n2) {
  if (!n1 || !n2) return { diff: null, lo: null, hi: null, noise: true };
  const a = wilson(k1, n1), b = wilson(k2, n2), diff = b.p - a.p;
  const lo = diff - Math.sqrt((b.p - b.lo) ** 2 + (a.hi - a.p) ** 2), hi = diff + Math.sqrt((b.hi - b.p) ** 2 + (a.p - a.lo) ** 2);
  return { diff, lo, hi, noise: lo <= 0 && hi >= 0 };
}
