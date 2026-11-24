// How far the model games track real results: `scripts/rift calibrate`, written to docs/model-calibration.md.
//
// Real side: data/winrates.json (RiftLite, online games logged by its users). Its pairs are small (the largest is
// about 50 games), so the main comparison is per legend: each legend's pooled win rate over its whole row (400–700
// games, about ±4 points), against the model's win rate for that legend's lists against the other legends in the set.
// Pairs with n ≥ minPair are compared too, each with its own interval, as a second look.
//
// Model side: for each legend, its top lists (placed first, then newest) play the other legends' top lists in
// lib/match.mjs games, both seats. A game with no one at 8 by turn 12 is a timeout and counts for neither side.

import { wilson } from "./stats.mjs";

// RiftLite names a legend by champion, or "Champion, Title" where a champion has two; a deck names its legend card.
export function rlNameOf(legendCard, rlNames) {
  if (!legendCard) return null;
  const champ = (legendCard.g || [])[0] || "", full = `${champ}, ${legendCard.n}`;
  if (rlNames.has(full)) return full;
  if (rlNames.has(champ) && ![...rlNames].some((n) => n.startsWith(`${champ}, `))) return champ;
  return null;
}

// A legend's representative lists: placed lists by placing, then the newest.
export function topLists(lists, k = 3) {
  const placed = lists.filter((d) => d.tour && d.pl != null).sort((a, b) => a.pl - b.pl || (b.dt || "").localeCompare(a.dt || ""));
  const rest = lists.filter((d) => !placed.includes(d)).sort((a, b) => (b.dt || "").localeCompare(a.dt || ""));
  return [...placed, ...rest].slice(0, k);
}

// RiftLite's win rate for a legend over the opponents in `set` (pooled: Σ wr·n / Σ n), and its interval.
export function realRow(W, name, set) {
  let w = 0, n = 0;
  for (const p of W.pairs) if (p.a === name && set.has(p.b) && p.b !== name) { w += (p.wr / 100) * p.n; n += p.n; }
  const iv = wilson(Math.round(w), n);
  return { n, p: n ? w / n : null, lo: iv.lo, hi: iv.hi };
}

export function pearson(xs, ys) {
  const n = xs.length; if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
}
const ranks = (xs) => { const o = xs.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]); const r = Array(xs.length);
  for (let i = 0; i < o.length;) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2; i = j + 1; } return r; };
export const spearman = (xs, ys) => pearson(ranks(xs), ranks(ys));
export const mae = (xs, ys) => xs.reduce((a, x, i) => a + Math.abs(x - ys[i]), 0) / (xs.length || 1);

// Model results from records: recs[i] = { me, recs: matchGame records whose label is the opponent legend }.
// Returns per legend { w, l } over all its games (as us and as the opponent) and per ordered pair.
export function modelTable(runs) {
  const leg = {}, pair = {};
  const add = (a, b, win) => {
    (leg[a] ||= { w: 0, l: 0, t: 0 }); (pair[`${a}|${b}`] ||= { w: 0, l: 0, t: 0 });
    const k = win == null ? "t" : win ? "w" : "l"; leg[a][k]++; pair[`${a}|${b}`][k]++;
  };
  for (const { me, recs } of runs) for (const g of recs) {
    const win = g.winner == null ? null : g.winner === 0;
    add(me, g.label, win); add(g.label, me, win == null ? null : !win);
  }
  return { leg, pair };
}
