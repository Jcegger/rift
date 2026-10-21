// A legend's distinct builds, found in its lists — or one build, when its lists are one deck
// with flex slots. Most legends are one deck (two winning lists of a legend share about 31 of
// 40 cards, docs/deckbuilding.md); a few are two (Yasuo plays a Spiderling swarm or a movement
// deck with almost nothing in common). Crowd lists are noisy — incomplete uploads and one-off
// brews pull a naive split apart — so a split is accepted only when it is:
//
// - SIZEABLE: each side holds MIN_SHARE of the lists and MIN_LISTS of them;
// - DISTINCT: SIGNATURES+ cards are in SIG_IN of one side's lists and at most SIG_OUT of the
//   other's — whole cards the two builds disagree on, not a flex slot;
// - STABLE: re-run on STABLE_RUNS random 80% subsamples, the lists land on the same side
//   STABLE_AGREE of the time. A split that moves with the sample is noise.
//
// The split is a 2-medoid clustering on Jaccard similarity of card names, seeded from many
// starts and deterministic (seeded RNG), so the same snapshot always gives the same builds.

import { avoidedIn } from "./avoid.mjs";

export const MIN_SHARE = 0.2, MIN_LISTS = 8, SIGNATURES = 4, SIG_IN = 0.6, SIG_OUT = 0.2;
export const STABLE_RUNS = 6, STABLE_AGREE = 0.85, MIN_MAIN = 35;

const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function split(S) {
  let best = null;
  const starts = Math.min(S.length, 40);
  for (let s = 0; s < starts; s++) {
    let a = s, b = S.map((x, i) => [jac(S[s], x), i]).sort((p, q) => p[0] - q[0] || p[1] - q[1])[0][1];
    let ga = [], gb = [];
    for (let it = 0; it < 6; it++) {
      ga = []; gb = [];
      S.forEach((x, i) => (jac(x, S[a]) >= jac(x, S[b]) ? ga : gb).push(i));
      if (!ga.length || !gb.length) break;
      const med = (g) => g.reduce((bm, i) => { const v = g.reduce((t, j) => t + jac(S[i], S[j]), 0); return v > bm[0] ? [v, i] : bm; }, [-1, g[0]])[1];
      a = med(ga); b = med(gb);
    }
    if (!ga.length || !gb.length) continue;
    const fit = (ga.reduce((t, i) => t + jac(S[i], S[a]), 0) + gb.reduce((t, i) => t + jac(S[i], S[b]), 0)) / S.length;
    if (!best || fit > best.fit) best = { fit, a, b, ga, gb };
  }
  return best;
}

// Card shares within a group of lists.
const shares = (S, g) => { const m = new Map(); for (const i of g) for (const n of S[i]) m.set(n, (m.get(n) || 0) + 1 / g.length); return m; };

//   lists: the legend's decks (snapshot rows); names(d): the set of a list's main-deck card
//   names (units, spells, gear); size(d): its main-deck copy count.
// Returns [{ id, label, lists: [decks], signature: [names], share, aurora: [names] }], one
// entry when the legend is a single deck.
export function buildsOf(legend, lists, names, size) {
  const ds = lists.filter((d) => size(d) >= MIN_MAIN);
  const one = () => [{ id: legend, label: null, lists: ds.length ? ds : lists, signature: [], share: 1, aurora: auroraOf(ds.length ? ds : lists, names) }];
  if (ds.length < 2 * MIN_LISTS) return one();
  const S = ds.map(names);
  const s = split(S);
  if (!s) return one();
  const n = S.length, small = Math.min(s.ga.length, s.gb.length);
  if (small < MIN_LISTS || small / n < MIN_SHARE) return one();
  const A = shares(S, s.ga), B = shares(S, s.gb);
  const sig = (X, Y) => [...X].filter(([k, v]) => v >= SIG_IN && (Y.get(k) || 0) <= SIG_OUT).sort((p, q) => (q[1] - (Y.get(q[0]) || 0)) - (p[1] - (Y.get(p[0]) || 0))).map(([k]) => k);
  const sa = sig(A, B), sb = sig(B, A);
  if (sa.length + sb.length < SIGNATURES) return one();
  // Stability: does each list keep its side when 20% of the lists are dropped?
  const r = rng(n * 7919 + small);
  let agree = 0, seen = 0;
  for (let run = 0; run < STABLE_RUNS; run++) {
    const keep = S.map((_, i) => i).filter(() => r() < 0.8);
    const t = split(keep.map((i) => S[i]));
    if (!t) return one();
    const sideA = new Set(s.ga), tA = new Set(t.ga.map((j) => keep[j]));
    let same = 0; for (const i of keep) same += sideA.has(i) === tA.has(i);
    agree += Math.max(same, keep.length - same); seen += keep.length;   // either labelling
  }
  if (agree / seen < STABLE_AGREE) return one();
  // A side with no signature of its own is named by what it leaves out.
  const label = (sg, other) => sg.length ? sg.slice(0, 2).join(" + ") : `without ${other.slice(0, 2).join(" + ")}`;
  return [[s.ga, sa, sb], [s.gb, sb, sa]].sort((p, q) => q[0].length - p[0].length).map(([g, sg, other]) => {
    const L = g.map((i) => ds[i]);
    return { id: `${legend}|${sg[0] || `without ${other[0]}`}`, label: label(sg, other), lists: L, signature: sg.slice(0, 6), share: g.length / n, aurora: auroraOf(L, names) };
  });
}

// Never-play cards (lib/avoid.mjs) in half or more of these lists: the build is one Jay never plays.
function auroraOf(lists, names) {
  const c = new Map();
  for (const d of lists) for (const x of avoidedIn(names(d))) c.set(x, (c.get(x) || 0) + 1);
  return [...c].filter(([, k]) => k / (lists.length || 1) >= 0.5).map(([x]) => x);
}
