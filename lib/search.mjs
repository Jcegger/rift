// Swap search: many candidate changes to one deck, each played on the same model games as the deck as it is, the games
// added in rounds while a candidate is still in it. `scripts/rift search`. It ranks; it never picks. A candidate leaves
// only when it is clearly worse than the leader, which may be the deck as it is (the paired 95% interval of its margin
// minus the leader's is below 0),
// never for being in the bottom half by noise, so "still in" means "not shown worse", not "good".
//
//   const res = await halving({ base, cands: [{ label, deck }], play: (deck, start, end) => records, games: 60, budget: 2000 })
//
// play(deck, start, end) returns lib/match.mjs matchGame records for games [start, end) (lib/match-pool.mjs
// matchRecordsPar), so every deck's game i is the same deal, opponent and seat.

import { paired, wilson } from "./stats.mjs";

const margin = (recs) => recs.map((g) => g.at8[0] - g.at8[1]);
const pts = (recs) => recs.map((g) => g.at8[0]);
const winLoss = (recs) => recs.map((g) => (g.winner == null ? null : g.winner === 0 ? 1 : 0));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);

export function summarize(base, c) {
  const won = c.recs.filter((g) => g.winner === 0).length, decided = c.recs.filter((g) => g.winner != null).length;
  return {
    label: c.label, games: c.recs.length, out: c.out || null,
    margin: mean(margin(c.recs)), vsBase: paired(margin(c.recs), margin(base.recs.slice(0, c.recs.length))),
    points: paired(pts(c.recs), pts(base.recs.slice(0, c.recs.length))),
    winLoss: paired(winLoss(c.recs), winLoss(base.recs.slice(0, c.recs.length))),
    won: wilson(won, decided), timeouts: c.recs.length - decided,
  };
}

export async function halving({ base, cands, play, games = 60, budget = 2000, keep = 3, maxRounds = 5, log = () => {} }) {
  base.recs = await play(base.deck, 0, games);
  const live = cands.map((c) => ({ ...c, recs: [] }));
  for (const c of live) c.recs = await play(c.deck, 0, games);
  let spent = games * (live.length + 1), n = games, round = 1;
  // The deck as it is races too (never dropped): a swap clearly worse than it leaves even when no other swap leads.
  const rank = () => [base, ...live.filter((c) => !c.out)].sort((a, b) => mean(margin(b.recs)) - mean(margin(a.recs)));
  for (;;) {
    const inn = rank(), lead = inn[0];
    for (const c of inn) {
      if (c === lead || c === base) continue;
      const d = paired(margin(c.recs), margin(lead.recs));
      if (d.n && d.hi < 0) c.out = `round ${round}: worse than ${lead.label} by ${(-d.mean).toFixed(2)} (95%: ${(-d.hi).toFixed(2)} to ${(-d.lo).toFixed(2)}) over ${d.n} games`;
    }
    const still = live.filter((c) => !c.out);
    log(`round ${round}: ${n} games, ${still.length} of ${live.length} still in (leader: ${rank()[0].label})`);
    if (still.length <= keep || round >= maxRounds) break;
    const more = n;   // double the games
    if (spent + more * (still.length + 1) > budget) { log(`budget: ${spent} games played, next round would need ${more * (still.length + 1)} more`); break; }
    base.recs.push(...(await play(base.deck, n, n + more)));
    for (const c of still) c.recs.push(...(await play(c.deck, n, n + more)));
    spent += more * (still.length + 1); n += more; round++;
  }
  const rows = live.map((c) => summarize(base, c)).sort((a, b) => (!!a.out - !!b.out) || b.margin - a.margin);
  return { base: summarize(base, base), rows, spent, games: n, rounds: round };
}
