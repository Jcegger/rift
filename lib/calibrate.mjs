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
import { rng } from "./sim.mjs";

// RiftLite names a legend by champion, or "Champion, Title" where a champion has two; a deck names its legend card.
export function rlNameOf(legendCard, rlNames) {
  if (!legendCard) return null;
  const champ = (legendCard.g || [])[0] || "", full = `${champ}, ${legendCard.n}`;
  if (rlNames.has(full)) return full;
  if (rlNames.has(champ) && ![...rlNames].some((n) => n.startsWith(`${champ}, `))) return champ;
  return null;
}

// The calibration set: RiftLite's most-played legends that have lists since `since` (39+ main cards, any legality: RiftLite's
// window is mostly before the 23 Nov bans), and each one's lists. Shared by `rift calibrate` and check.mjs's solver gate.
export function calibrationSet(cat, decks, W, { since = "2026-10-16", N = 12 } = {}) {
  const rlNames = new Set(W.legends.map((l) => l.legend));
  const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const mainSize = (d) => Object.entries(d.cards || {}).reduce((a, [k, q]) => a + (/Legend|Rune|Battlefield/.test(cat.BY.get(k)?.t || "Rune") ? 0 : q), 0);
  const by = {};
  for (const d of decks) { if ((d.dt || "") < since || mainSize(d) < 39) continue; const n = rlNameOf(legendOf(d), rlNames); if (n) (by[n] ||= []).push(d); }
  const legends = W.legends.slice().sort((a, b) => b.games - a.games).map((l) => l.legend).filter((n) => by[n]?.length).slice(0, N);
  return { legends, by };
}

// A legend's representative lists: placed lists by placing, then the newest.
export function topLists(lists, k = 3) {
  const placed = lists.filter((d) => d.tour && d.pl != null).sort((a, b) => a.pl - b.pl || (b.dt || "").localeCompare(a.dt || ""));
  const rest = lists.filter((d) => !placed.includes(d)).sort((a, b) => (b.dt || "").localeCompare(a.dt || ""));
  return [...placed, ...rest].slice(0, k);
}

// The decks RiftLite's players actually logged (data/riftlite-decks.json via data/matches.json's dk), as model lists:
// per legend, its k most-played complete decks since `since`, by games. 25 Nov: the tournament lists the model plays
// aren't what RiftLite's online players run (91% of tournament Riven lists ran Riven, Broken Blade; 2 of 83 RiftLite
// Riven decks did), so comparing the two mixes the model's error with a deck mismatch. Returns { L: [{ label, cards,
// games }] } with cards as catalog codes; a legend with no mappable deck is left out, and `misses` names what didn't map.
export function riftliteLists(cat, matches, decks, legends, { since = "", k = 3 } = {}) {
  const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9']+/g, " ").trim();
  const byName = new Map(); for (const c of cat.cards) if (!c.v && c.t !== "Legend" && !byName.has(norm(c.n))) byName.set(norm(c.n), c);
  const legendCard = (L) => {
    const [champ, title] = L.split(/,\s*/);
    const ls = cat.cards.filter((c) => c.t === "Legend" && !c.v && (c.g || [])[0] === champ);
    return (title && ls.find((c) => norm(c.n).startsWith(norm(title)))) || ls[0] || null;
  };
  const out = {}, misses = {};
  for (const L of legends) {
    const games = new Map();
    for (const m of matches) if (m.dk && m.a === L && m.d >= since && decks[m.dk]) games.set(m.dk, (games.get(m.dk) || 0) + 1);
    const lg = legendCard(L); if (!lg) { misses[L] = "no legend card"; continue; }
    const lists = [];
    for (const [dk, n] of [...games].sort((a, b) => b[1] - a[1])) {
      const d = decks[dk], cards = { [lg.c]: 1 }; let ok = true;
      for (const [q, name] of [...d.champion, ...d.main, ...d.runes, ...d.battlefields]) {
        const c = byName.get(norm(name)); if (!c) { ok = false; misses[name] = (misses[name] || 0) + 1; break; }
        cards[c.c] = (cards[c.c] || 0) + q;
      }
      if (ok) lists.push({ label: L, cards, games: n, dk });
      if (lists.length >= k) break;
    }
    if (lists.length) out[L] = lists;
  }
  return { lists: out, misses };
}

// A second real side (25 Nov): RiftAtlas tournament results from data/field.json. Each event gives a legend's match win
// rate, its pilots and the rounds. A legend's rate is Σ winRate·pilots·rounds / Σ pilots·rounds over events on or after
// `since`. The weight is a rough count of matches: byes, drops and the top cut aren't separable from field.json, so the
// interval (Wilson on that count) is approximate. It's against the whole field, not only the calibration set. These are
// tournament players on tournament lists, as the model's lists are; RiftLite is online players on their own decks, and
// the two agree only loosely (r 0.15 over 17 legends on 25 Nov). Names: RiftAtlas uses "Champion, Title"; RiftLite (the
// set's names) uses the champion alone unless a champion has two legends.
export function riftatlasRows(field, legends, { since = field.legalFrom || "", min = 100 } = {}) {
  const acc = new Map();
  for (const e of field.events || []) {
    if ((e.dt || "") < since || !e.rounds) continue;
    for (const m of e.meta || []) {
      if (m.winRate == null || !m.pilots) continue;
      const L = legends.find((x) => x === m.legend) || legends.find((x) => !x.includes(",") && x === m.legend.split(",")[0]);
      if (!L) continue;
      const x = acc.get(L) || { w: 0, n: 0, events: 0 }, g = m.pilots * e.rounds;
      x.w += m.winRate * g; x.n += g; x.events++; acc.set(L, x);
    }
  }
  const rows = new Map(), thin = [];
  for (const L of legends) {
    const x = acc.get(L);
    if (!x || x.n < min) { thin.push(`${L} (${x ? x.n : 0})`); continue; }
    const iv = wilson(Math.round(x.w), x.n);
    rows.set(L, { p: x.w / x.n, lo: iv.lo, hi: iv.hi, n: x.n, events: x.events });
  }
  return { rows, thin, since };
}

// RiftLite's win rate for a legend over the opponents in `set` (pooled: Σ wr·n / Σ n), and its interval.
// The matrix's pairs rebuilt from its match records on or after a day (data/winrates.json `matches`, scripts/build-winrates.mjs
// parseMatches): pooled like the page's labels, both directions. calibrate --real-since: real numbers after the 23 Nov bans.
export function pairsSince(matches, since) {
  const t = new Map(), add = (a, b, w) => { const k = `${a}\u0000${b}`, x = t.get(k) || { a, b, w: 0, n: 0 }; x.w += w; x.n++; t.set(k, x); };
  for (const m of matches || []) if (m.d >= since && m.a !== m.b) { add(m.a, m.b, m.w); add(m.b, m.a, 1 - m.w); }
  return [...t.values()].map((x) => ({ a: x.a, b: x.b, wr: (100 * x.w) / x.n, n: x.n }));
}
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
// r's 95% interval (Fisher z). With 12 legends it's about ±0.5: one calibration can't tell r 0.1 from 0.3.
export function rInterval(r, n) {
  if (r == null || n < 4) return { lo: null, hi: null };
  const z = Math.atanh(Math.max(-0.999999, Math.min(0.999999, r))), se = 1 / Math.sqrt(n - 3);
  return { lo: Math.tanh(z - 1.96 * se), hi: Math.tanh(z + 1.96 * se) };
}
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

// ── swaps: does the model rank one-card changes the way good finishes do? (`rift calibrate --swaps`) ──
// mains: per list, name → copies (lib/decks.mjs mainOf); good: per list, a good finish (lib/placing.mjs isGoodPlacing).
// A card's lift: mean copies in good-finish lists minus mean copies in the legend's other placed lists, with a bootstrap
// interval (lists resampled within each group). Only cards in at least minShare of the lists.
export function lifts(mains, good, { minShare = 0.15, boots = 300, seed = 7 } = {}) {
  const G = mains.filter((_, i) => good[i]), R = mains.filter((_, i) => !good[i]);
  const names = new Map();
  for (const m of mains) for (const n of m.keys()) names.set(n, (names.get(n) || 0) + 1);
  const keep = [...names].filter(([, k]) => k >= minShare * mains.length).map(([n]) => n);
  const mean = (xs, n) => xs.reduce((a, m) => a + (m.get(n) || 0), 0) / (xs.length || 1);
  const out = new Map();
  if (!G.length || !R.length) return out;
  const r = rng(seed), pick = (xs) => Array.from(xs, () => xs[Math.floor(r() * xs.length)]);
  const samples = Array.from({ length: boots }, () => [pick(G), pick(R)]);
  for (const n of keep) {
    const bs = samples.map(([g, x]) => mean(g, n) - mean(x, n)).sort((a, b) => a - b);
    out.set(n, { lift: mean(G, n) - mean(R, n), lo: bs[Math.floor(0.025 * boots)], hi: bs[Math.floor(0.975 * boots)], share: names.get(n) / mains.length, samples: bs.length ? samples.map(([g, x]) => mean(g, n) - mean(x, n)) : [] });
  }
  return out;
}
// The list closest to all the others (fewest changed copies in total): the legend's typical good finish.
export function medoid(mains, dist) {
  let best = -1, bd = Infinity;
  for (let i = 0; i < mains.length; i++) { let d = 0; for (let j = 0; j < mains.length; j++) if (i !== j) d += dist(mains[i], mains[j]); if (d < bd) { bd = d; best = i; } }
  return best;
}
// One-card swaps from a base main (name → copies), in lift order: k "toward winners" (lowest-lift base card out, highest
// lift in) and k "away" (the reverse). keepOut: names never taken out (the champion, signatures). A card goes in only
// while the base has fewer than maxCopies of it. Real effect = lift(in) − lift(out), its interval from the same resamples.
export function pickSwaps(base, L, { k = 4, keepOut = new Set(), maxCopies = 3 } = {}) {
  const inBase = [...base.keys()].filter((n) => L.has(n) && !keepOut.has(n)).sort((a, b) => L.get(a).lift - L.get(b).lift);
  const all = [...L.keys()].sort((a, b) => L.get(b).lift - L.get(a).lift);
  const swaps = [], seen = new Set();
  const add = (out, inn, dir) => {
    const key = `${out}>${inn}`; if (out === inn || seen.has(key) || (base.get(inn) || 0) >= maxCopies) return false;
    seen.add(key);
    const a = L.get(inn).samples, b = L.get(out).samples, d = a.map((x, i) => x - b[i]).sort((x, y) => x - y);
    swaps.push({ out, in: inn, dir, real: L.get(inn).lift - L.get(out).lift, lo: d[Math.floor(0.025 * d.length)], hi: d[Math.floor(0.975 * d.length)] });
    return true;
  };
  for (const [outs, ins, dir] of [[inBase, all, "toward"], [inBase.slice().reverse(), all.slice().reverse(), "away"]]) {
    let made = 0;
    for (let i = 0; i < outs.length && made < k; i++) for (const inn of ins) { if (add(outs[i], inn, dir)) { made++; break; } }
  }
  return swaps;
}
