// What counts as a good placement — the one definition the brews' anchor (scripts/build-brews.mjs)
// and the swap scoreboard (scripts/build-rising.mjs) share. A recorded finish alone is not
// one: 37% of the verified finishes with a known field size are in its bottom half, last
// place included.
//
// - A record (upstream vouched for it: `tour`, `pl`) with a field size (`ec`): the top 25%
//   of the field, or a top 8 at an event of 32+ players — so a top 8 of 15 does not count.
// - A record without a field size: a top 8. The size is unknown and is never estimated.
// - A claim (the author's own title, `cp`): top 8 or better. Claims carry no field size, and
//   stay a separate, weaker class (CLAUDE.md, "Distinguish a record from a claim").

export const TOP_SHARE = 0.25, TOP_N = 8, MIN_FIELD = 32;

export const isRecord = (d) => !!d.tour && d.pl != null;

export const isGoodPlacing = (d) => {
  if (isRecord(d)) return d.ec ? d.pl / d.ec <= TOP_SHARE || (d.pl <= TOP_N && d.ec >= MIN_FIELD) : d.pl <= TOP_N;
  const cp = Number(d.cp);
  return cp > 0 && cp <= TOP_N;
};

// "record", "claim", or null when the list is not a good placing.
export const placingClass = (d) => (isGoodPlacing(d) ? (isRecord(d) ? "record" : "claim") : null);

// Riot's Top Decks articles (data/topdecks.json) as deck-snapshot rows, so the same test
// applies to them. Each article prints an RQ's Top 8 and the best finisher on every other
// legend ("Best Of") with its overall rank — the only record of a thin legend's best result
// at an RQ, and often not uploaded anywhere else. A Best Of is a good placing only by the
// same cut as any finish (567th of 1,962 is not; 20th is). The field size is the archive's
// player count for the event when it has one, else the sum of Riot's Day 1 table (below
// announced attendance, so the cut is stricter, never looser); with neither, a top 8 only.
// Kept to the snapshot's window, and skipped where the snapshot already has the same finish.
export function riotRows(topdecks, snap, card, byName) {
  const short = (code) => String(code).replace(/\/\d+$/, "");
  const from = snap.window?.from || "";
  const tour = snap.decks.filter((d) => d.tour && d.ev);
  const out = [];
  for (const e of topdecks?.events || []) {
    const city = e.slug.replace(/s?-top-decks$/, "").replace(/-/g, " ");
    const rq = tour.filter((d) => d.ev.toLowerCase().includes(city) && /regional qualifier|\brq\b/i.test(d.ev));
    const ev = rq[0]?.ev || e.title;
    const dt = rq.map((d) => d.dt).sort()[0] || e.published;
    if (dt < from) continue;
    const day1 = (e.field || []).reduce((n, f) => n + (f.d1 || 0), 0);
    const ec = rq.find((d) => d.ec)?.ec || day1 || null;
    for (const t of e.decks) {
      const lg = card(t.legendCode);
      if (!lg) continue;
      if (rq.some((d) => d.pl === t.overall && short(d.lg) === short(t.legendCode))) continue;   // already in the snapshot
      const cards = {};
      const add = (code, n) => { if (code) cards[short(code)] = (cards[short(code)] || 0) + n; };
      add(t.legendCode, 1);                                   // snapshot lists carry the legend too
      for (const [n, , code] of t.main || []) add(code, n);
      add(byName.get(t.champion)?.c, 1);
      for (const b of t.battlefields || []) add(byName.get(b)?.c, 1);
      for (const [n, r] of t.runes || []) add(byName.get(r)?.c, n);
      out.push({ s: `riot:${e.slug}:${t.overall}`, h: `${t.player} — ${e.title}`, lg: t.legendCode, ev, pl: t.overall, ec, dt, tour: 1, cp: null,
        riot: t.overall <= 8 ? "top8" : "bestof", legendRank: t.legendRank, cards });
    }
  }
  return out;
}
