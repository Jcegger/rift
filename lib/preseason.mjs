// The preseason model: a prediction for every legend's builds before a set has results, which
// the results then take over from as they arrive — the shape of Bill Connelly's SP+, whose
// preseason projection is last season plus returning production, phased out as games are
// played. The method in prose was guides/radiance-tier-prediction.md (retired 26 Oct 2026, in git history); this is it in numbers.
//
// Everything is on ONE scale: observed over expected top finishes (O/E), in logs. A legend's
// "top finishes" are Day 2 at an RQ (Riot's tables) or the top 25% at an event whose lists
// cover most of its field; "expected" is what an average deck with the same pilots would
// have. ×1.00 is average; Vendetta's Kennen was ×1.76.
//
//   prior     = c × ln O/E of RETURNING strength (last format, shrunk by K_RET expected tops)
//             + (1 − c) × ln POPULARITY TARGET (what a legend that much of the field registers
//               converts, fitted on the last format's RQ tables each run, bounded by the
//               strongest real deck), where c = CARRYOVER × the share of a full record the
//               legend has — so a new legend is all popularity, an established one 80/20 before
//               registrations (CARRY_PRE), moving to 30/70 as they arrive.
//
// Both halves are measured, not assumed (21 Oct 2026, on Riot's nine RQ write-ups):
// - CARRYOVER: a legend's best-finish rank correlates 0.69 from Spiritforged to Unleashed and
//   0.50 from Unleashed to Vendetta, against 0.84 between events inside one format — about
//   60% of a legend's edge survives a new set.
// - Popularity: at each set's first RQ the share of the field on a new legend predicted its
//   result (rank correlation 0.67, 0.75, 0.32), the most-registered new legend became a top
//   deck three times of three (Draven, LeBlanc, Kennen), and new legends did no worse than
//   old (Vendetta's first RQ: Day 2 ×1.08 against ×0.96) — so no hype discount.
//             + POINT × the judgment points (model/preseason-inputs.json): transfers,
//               schedule, recruiting, hype — rules-unverified rows count UNVERIFIED
//   posterior = ln( (O_season + K_PRIOR · e^prior) / (E_season + K_PRIOR) )
//
// The prior is pseudo-results, and as strong as the evidence behind it: K_PRIOR expected tops
// for a legend with a full returning record, down to K_NEW for a new legend, whose prior is a
// guess — so a new legend's first results move it fast, an established one's slowly.
// A judgment row with `vs` is an answer to (or a weakness against) particular decks; it
// counts as much as those decks are predicted to be good (their ×, capped at VS_CAP), from a
// first pass of the model — an answer to a deck nobody fears is worth little.
// Previously: the prior is pseudo-results: K_PRIOR expected tops of them. A legend at 5% of a 2,000-player
// RQ with an 18% Day 2 expects 18 tops, so one such RQ outweighs the prediction about 2 to 1;
// a legend with 3 pilots stays mostly on its prior. Online previews count PREVIEW_W.
//
// The constants are a starting guess, said so: they get recalibrated from the scorecard once
// predictions can be graded, the way the brews' thresholds wait on data/swaplog.json.

export const K_RET = 5;          // returning O/E shrinks toward ×1.00 by this many expected tops
export const K_PRIOR = 10;       // a full-record prediction is worth this many expected tops of results
export const K_NEW = 3;          // a new legend's prediction, a guess, is worth this many
export const VS_CAP = 1.5;       // a `vs` row counts at most 1.5× (against a predicted ×1.5 deck)
export const PREVIEW_W = 0.5;    // an online preview before the legal date counts half
export const POINT = 0.15;       // one judgment point = 0.15 in ln O/E (about ×1.16)
export const UNVERIFIED = 0.5;   // a rules-unverified judgment counts half
// CARD_W: how much the judgment rows (what the new cards do, model/preseason-inputs.json) count
// in the published score. 0 until 22 Oct 2026 (data only, Jay's call of 21 Oct); now a third
// (Jay, 22 Oct: "card-based predictions ... with light weight"). At full weight they swamped the
// data (Kai'Sa ×1.97, Vex into S): the rows are hand-written, never graded, and a legend with
// more rows collects more points. A third keeps the biggest read near ×1.25. The data-only score
// is published beside it, so the scorecard can say whether the card reads helped.
export const CARD_W = 1 / 3;
export const CARRYOVER = 0.6;    // the share of last format's edge that survives a new set (measured)
// The returning/popularity blend shifts as registrations arrive. Backtested on Vendetta's three
// RQs (Unleashed strength against registration share, predicting Day 2 conversion): last format
// alone 0.42–0.59 rank correlation, registration share alone 0.57–0.79, the best blend 30/70 to
// 20/80. Before a format's first RQ the popularity read is posted lists and previews — far
// noisier — so the blend starts at CARRY_PRE and moves to CARRY_REG as registrations reach
// thousands (half-way at REG_HALF registered pilots).
// CARRY_PRE (22 Oct 2026) was CARRYOVER, a different number borrowed as a weight. Measured
// instead: Vendetta's public lists posted 23 Sep–2 Oct track that window's LA RQ registrations
// at r 0.53, flattened (log slope 0.45: brewers spread across legends, registrants bunch on
// the best decks, and nobody re-posts an unchanged list), so the pre-RQ popularity read
// predicts results at about 0.53 × 0.68 ≈ 0.36, against about 0.6 for last format. Weighting
// each by r²/(1 − r²) gives 0.79 on last format. A starting guess like the rest, regraded on
// the scorecard. (Last format's registrations are no better a popularity read: 0.50 and 0.08
// across the two set changes with tables, 0.90 inside a format.)
export const CARRY_PRE = 0.8;
export const CARRY_REG = 0.3, REG_HALF = 500;
export const carryFor = (registered) => CARRY_PRE - (CARRY_PRE - CARRY_REG) * registered / (registered + REG_HALF);
export const POINT_SD = 0.5;     // each judgment point is uncertain by half a point
export const Z80 = 1.2816;       // the ranges shown are 80% intervals
export const POP_FLOOR = 0.5;    // the popularity target's floor (the fit extrapolates to ×0.10 at
                                 // the thinnest legends); its cap is the strongest real deck, per run
export const DRAWS = 4000;       // simulated seasons for the rank ranges
export const COMPONENTS = ["transfers", "schedule", "recruiting", "hype"];

export const logRatio = (O, E, k, t = 1) => Math.log((O + k * t) / (E + k));
// Approximate sd of a log O/E ratio from Poisson counts (delta method).
export const sdLog = (O, E, k) => Math.sqrt(1 / (O + k) + 1 / (E + k));

// Sum observed/expected over rows of { o, e, w } (w weights a row, e.g. a preview).
export const pool = (rows) => rows.reduce((t, r) => ({ O: t.O + r.o * (r.w ?? 1), E: t.E + r.e * (r.w ?? 1) }), { O: 0, E: 0 });

// Prior strength from the returning evidence: K_NEW with none, K_PRIOR with a lot.
export const priorStrength = (retE) => K_NEW + (K_PRIOR - K_NEW) * retE / (retE + K_RET);

// Judgment rows -> points, per component and in total. vsRatio(names) gives the predicted ×
// of the decks a `vs` row is about (1 when unknown).
export function judgment(rows, vsRatio = () => 1) {
  const by = Object.fromEntries(COMPONENTS.map((c) => [c, 0]));
  let total = 0, abs = 0;
  for (const r of rows) {
    const vs = r.vs?.length ? Math.min(VS_CAP, Math.max(0, vsRatio(r.vs))) : 1;
    const p = r.points * (r.verified ? 1 : UNVERIFIED) * vs;
    by[r.component] += p; total += p; abs += Math.abs(p);
  }
  return { by, total, abs, n: rows.length };
}

//   ret: { O, E } returning; adj: ln build adjustment (0 for one-build legends);
//   rows: judgment rows; season: { O, E } results in the new format (previews weighted).
//   target: the popularity target (×) now; lastTarget: what a legend as popular as this one was
//   last format converted. established: false for a legend new in this set.
// An established legend's absence is information: zero pilots across three 2,000-player RQs is
// a measured share of zero, not "unknown" — its returning strength shrinks toward lastTarget
// (the floor, for a legend nobody played), it keeps the full carryover, and its prior the full
// K_PRIOR. Only a new legend starts from popularity alone, with the weak K_NEW prior.
export function score({ ret, target = 1, lastTarget = 1, established = true, adj = 0, rows = [], season = { O: 0, E: 0 }, vsRatio, carryover = CARRY_PRE, cardWeight = 1 }) {
  const j = judgment(rows, vsRatio);
  const K = established ? K_PRIOR : K_NEW;
  const retLog = established ? logRatio(ret.O, ret.E, K_RET, lastTarget) : 0;
  const c = established ? carryover : 0;
  const prior = c * retLog + (1 - c) * Math.log(target) + adj + POINT * cardWeight * j.total;
  const sdPrior = Math.sqrt(sdLog(ret.O, ret.E, K_RET) ** 2 + (POINT * cardWeight * POINT_SD) ** 2 * j.abs);
  const post = Math.log((season.O + K * Math.exp(prior)) / (season.E + K));
  const w = season.E / (season.E + K);
  const sd = Math.sqrt(((1 - w) * sdPrior) ** 2 + (w * sdLog(season.O, season.E, 1)) ** 2 * (season.E > 0 ? 1 : 0));
  return { retLog, carry: c, adj, judgment: j, prior, post, priorStrength: K, resultsWeight: w, sd, lo: post - Z80 * sd, hi: post + Z80 * sd };
}

// The popularity fit: ln O/E against ln share across legends with real samples (weighted by
// expected tops). Returns the target for a share, bounded.
export function fitPopularity(points, cap = Infinity) {
  const P = points.filter((p) => p.E >= 5 && p.share > 0);
  const W = P.map((p) => p.E), sw = W.reduce((a, b) => a + b, 0);
  const X = P.map((p) => Math.log(p.share)), Y = P.map((p) => Math.log((p.O + 0.5) / (p.E + 0.5)));
  const mx = X.reduce((t, x, i) => t + x * W[i], 0) / sw, my = Y.reduce((t, y, i) => t + y * W[i], 0) / sw;
  const sxx = X.reduce((t, x, i) => t + W[i] * (x - mx) ** 2, 0), sxy = X.reduce((t, x, i) => t + W[i] * (x - mx) * (Y[i] - my), 0);
  const syy = Y.reduce((t, y, i) => t + W[i] * (y - my) ** 2, 0);
  const b = sxx ? sxy / sxx : 0, r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  const target = (share) => share > 0 ? Math.min(cap, Math.max(POP_FLOOR, Math.exp(my + b * (Math.log(share) - mx)))) : POP_FLOOR;
  return { n: P.length, slope: b, r, meanLog: my, meanLogShare: mx, target };
}

// Rank ranges by simulation: draw every build's score from its range, rank, repeat. Returns the
// 10th–90th percentile rank and the chance of a top-10 finish. Deterministic (seeded).
export function rankSim(items, draws = DRAWS, seed = 20261023) {
  let s = seed;
  const rnd = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = () => { const u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const ranks = items.map(() => []), top10 = items.map(() => 0);
  for (let d = 0; d < draws; d++) {
    const v = items.map((x, i) => [x.post + x.sd * gauss(), i]).sort((a, b) => b[0] - a[0]);
    v.forEach(([, i], k) => { ranks[i].push(k + 1); if (k < 10) top10[i]++; });
  }
  return items.map((_, i) => { const r = ranks[i].sort((a, b) => a - b); return { p10: r[Math.floor(draws * 0.1)], p90: r[Math.floor(draws * 0.9)], top10: top10[i] / draws }; });
}
