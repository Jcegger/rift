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

import { mainOf, changed } from "./decks.mjs";

export const TOP_SHARE = 0.25, TOP_N = 8, MIN_FIELD = 32;

export const isRecord = (d) => !!d.tour && d.pl != null;

export const isGoodPlacing = (d) => {
  if (isRecord(d)) return d.ec ? d.pl / d.ec <= TOP_SHARE || (d.pl <= TOP_N && d.ec >= MIN_FIELD) : d.pl <= TOP_N;
  const cp = Number(d.cp);
  return cp > 0 && cp <= TOP_N;
};

// One finish, one list. Deck sites' "copy" button reposts a list under its author's title,
// so "Azir Top 4 Barcelona RQ - copy", "- copy 2"… each arrive as a claim of the same top 4:
// 127 of the snapshot's 656 good placings on 23 Oct 2026, every one a claim (records were
// all unique). Claims of one legend at one claimed event and place are one finish, kept as
// the earliest post. A claim at a record's place is that record: when it names the record's
// event, however edited its list ("Riven wins Showdown 5 - copy 7" was the winner's list
// 5 copies changed); otherwise — no event, or one spelled differently — when it has nearly
// the record's 40 (`same`, the caller's test). The copies stay posted lists — this is only about counting finishes.
const titleOf = (d) => String(d.ce || d.h || "").replace(/\s*-\s*copy(\s*\d+)?\s*$/i, "").trim().toLowerCase();
const evOf = (s) => String(s || "").trim().toLowerCase();
export function oneFinishEach(lists, same = () => false) {
  const recs = lists.filter(isRecord), seen = new Set(), out = [...recs];
  for (const d of lists.filter((d) => !isRecord(d)).sort((a, b) => String(a.dt).localeCompare(String(b.dt)))) {
    const k = `${d.lg}|${titleOf(d)}|${d.cp}`;
    const isRec = (r) => r.lg === d.lg && r.pl === Number(d.cp) && ((d.ce && evOf(d.ce) === evOf(r.ev)) || same(r, d));
    if (seen.has(k) || recs.some(isRec)) continue;
    seen.add(k); out.push(d);
  }
  return out;
}

// The finishes every builder counts, in one place (23 Oct 2026; before it each builder had
// its own: two took any finish, last place included, and none removed reposts).
//
//   const { goodFinishes, oneFinish } = finishesMaker(idx, card)
//   goodFinishes(lists): good placings, one per finish, claims titled for their own champion
//   oneFinish(lists): the same, for lists already known to be good placings
//
// A claim lives in its title, and a copied list keeps its title: "Rek'Sai Top 4 at Showdown
// Series Bristol - copy 2" was rebuilt as Mordekaiser, a legend that event never saw. A claim
// whose title names another champion, and not its own, is not its finish. A claim within
// SAME_FINISH copies of a record at its place is that record (oneFinishEach's `same`).
export const SAME_FINISH = 4;
export function finishesMaker(idx, card) {
  const champs = [...new Set(idx.cards.filter((c) => c.t === "Legend").map((c) => idx.championOf(c)).filter(Boolean))]
    .map((n) => [n, new RegExp(`(^|[^\\w])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`, "i")]);
  const claimIsOther = (d) => {
    if (isRecord(d)) return false;
    const own = idx.championOf(card(d.lg)), named = champs.filter(([, re]) => re.test(d.h || "")).map(([n]) => n);
    return named.length > 0 && !named.includes(own);
  };
  const same = (r, d) => changed(mainOf(r.cards, card), mainOf(d.cards, card)) <= SAME_FINISH;
  const oneFinish = (lists) => oneFinishEach(lists.filter((d) => !claimIsOther(d)), same);
  return { oneFinish, goodFinishes: (lists) => oneFinish(lists.filter(isGoodPlacing)), claimIsOther };
}

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
