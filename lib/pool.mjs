// A legend's legal card pool, by job, with the evidence for each card: candidates, never picks.
//
// Why evidence first: writing lists from card text failed every time it was tried (the brews
// retired 23 Oct 2026; Draft B shelved 21 Nov). Card text says what a card does; lists say which
// cards winners pick. So each card carries what the lists say about it, and the pool sorts on that:
//   proven here      in 15%+ of this legend's good finishes (lib/placing.mjs isGoodPlacing)
//   crowd here       in 15%+ of this legend's posted lists, short of that in good finishes
//   proven under X   in 15%+ of good finishes of another legend with the same domains (say whose)
//   theory           none of these: card text only
// The collection is never a sort key (CLAUDE.md: cost is never the axis).

import { jobsOf, JOBS } from "./jobs.mjs";
import { isGoodPlacing } from "./placing.mjs";
import { NEVER_PLAY } from "./avoid.mjs";

export const MIN_SHARE = 0.15;
export const MIN_HERE_GOOD = 5;   // "proven here" needs this many good finishes of this legend (28 Nov audit: 1 of 2 read as 50%)
export const MIN_TWIN_GOOD = 5;   // "proven under X" needs X to have this many good finishes, or one list is 50%
export const LABELS = ["proven here", "crowd here", "proven under", "theory"];

const sameDomains = (a, b) => {
  const x = [...(a || [])].sort().join("|"), y = [...(b || [])].sort().join("|");
  return x === y;
};

// cat: { cards, BY, idx }; decks: data/decks.json's decks; legend: the Legend card.
export function legendPool(cat, decks, legend, { since = "2026-10-23" } = {}) {
  const { idx } = cat;
  const champ = idx.championOf(legend);
  const doms = new Set([...(legend.d || []), "Colorless"]);
  const legal = (c) => !c.v && /^(Unit|Spell|Gear)$/.test(c.t || "") && (c.d || []).every((d) => doms.has(d))
    && !idx.bannedNames.has(c.n) && !idx.notYetStandard(c) && !NEVER_PLAY.has(c.n)
    && (!idx.signatureOf(c) || idx.signatureOf(c) === champ);
  const seen = new Set();
  const cards = cat.cards.filter((c) => legal(c) && !seen.has(c.n) && seen.add(c.n));

  // The lists: this legend's, and other legends' with the same domains.
  const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const here = [], twins = new Map();
  for (const d of decks) {
    if ((d.dt || "") < since) continue;
    const l = legendOf(d); if (!l) continue;
    const names = new Map();
    for (const [code, q] of Object.entries(d.cards || {})) { const c = cat.BY.get(code); if (c) names.set(c.n, (names.get(c.n) || 0) + q); }
    const row = { names, good: isGoodPlacing(d) };
    if (idx.legendName(l) === idx.legendName(legend)) here.push(row);
    else if (sameDomains(l.d, legend.d)) {
      const k = idx.legendName(l);
      if (!twins.has(k)) twins.set(k, []);
      twins.get(k).push(row);
    }
  }
  const share = (rows, n) => (rows.length ? rows.filter((r) => r.names.has(n)).length / rows.length : null);
  const copies = (rows, n) => { const w = rows.filter((r) => r.names.has(n)); return w.length ? w.reduce((a, r) => a + r.names.get(n), 0) / w.length : null; };
  const goodHere = here.filter((r) => r.good);

  const out = cards.map((c) => {
    const { jobs, theirTurn } = jobsOf(c);
    const posted = share(here, c.n), good = share(goodHere, c.n);
    let under = null;
    for (const [k, rows] of twins) {
      const gs = rows.filter((r) => r.good);
      if (gs.length < MIN_TWIN_GOOD) continue;
      const g = share(gs, c.n);
      // Another legend's own champion unit is "proven" by that legend's ability, not on its own (Draft B, 21 Nov).
      const theirChampion = c.t === "Unit" && c.n.startsWith(k.split(",")[0] + ", ");
      if (g != null && g >= MIN_SHARE && (!under || g > under.good)) under = { legend: k, good: g, lists: gs.length, theirChampion };
    }
    const label = good != null && good >= MIN_SHARE && goodHere.length >= MIN_HERE_GOOD ? "proven here"
      : posted != null && posted >= MIN_SHARE ? "crowd here"
      : under ? "proven under" : "theory";
    return { card: c, jobs: [...jobs], theirTurn, posted, good, copies: copies(here, c.n), under, label };
  });
  const rank = (r) => LABELS.indexOf(r.label);
  out.sort((a, b) => rank(a) - rank(b) || (b.good ?? 0) - (a.good ?? 0) || (b.posted ?? 0) - (a.posted ?? 0)
    || (b.under?.good ?? 0) - (a.under?.good ?? 0) || a.card.n.localeCompare(b.card.n));
  return { legend, champion: champ, lists: here.length, good: goodHere.length,
    twins: [...twins].map(([k, rows]) => ({ legend: k, lists: rows.length, good: rows.filter((r) => r.good).length })),
    cards: out, jobs: JOBS };
}
