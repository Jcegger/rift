// A legend's net decks: its good placings split into the decks they actually are, each
// counted into one list, and each judged on whether it has earned the name. Used by
// scripts/build-ideas.mjs (data/ideas.json `netdecks`); the method and its measurement are
// in docs/deckbuilding.md, "Net decks", and lib/netdeck.test.mjs.
//
//   const { netdecks } = netdeckMaker(idx, card)
//   netdecks(lists, { preview }) -> [group]
//
// Four steps:
//
// 0. ONE FINISH, ONE LIST (lib/placing.mjs oneFinishEach): reposts of a claimed finish were
//    26% of the good placings measured here. A claim titled for another champion is dropped.
// 1. PARTITION by policy before any statistics: a list running a never-play card
//    (lib/avoid.mjs) is never grouped with one that does not, so an Aurora build cannot
//    lend its results to a clean one or hide inside it. Its group is kept for the field.
// 2. GROUP by changed copies (main deck, by name): average-linkage merging while two groups'
//    lists are on average SPLIT copies apart or closer — half a deck. Measured, not assumed
//    (23 Oct 2026, on distinct finishes): the deckbuilding doc's 16 (§3, "a different
//    deck") split eight legends, but its groups beat the same lists dealt into random groups
//    of the same sizes by 0.9 cards of 40; at 20 the margin peaks (1.1; 0.7 at 24, 0.4 at
//    28), over five legends that really are two decks. Density clustering (ManaVault's
//    DBSCAN) needs more lists than a legend has; this needs none.
// 3. COUNT each group with lib/consensus.mjs, the counter the brews use. Frank Karsten's
//    numbered-copy aggregate (ChannelFireball, 7 Apr 2015) was the research's pick — it
//    cannot blend two plans' halves — but once lists are grouped there is little left to
//    blend, and it measured a tie (32.5 of 40 each); the test keeps it as the comparison.
//
// Then QUALIFY. A group is a "net" deck only when all of these hold; otherwise it is
// "early" (3+ lists that miss a test, each miss named) or "single" (1–2 lists: the best
// real list as played, never counted into a 40):
//   - MIN_LISTS good placings (lib/placing.mjs), from MIN_EVENTS events — one event's lists
//     can be one team's — and MIN_RECORDS of them records, not the authors' own claims;
//   - COHESION: its lists sit a median NEAR copies or fewer from the count, the room two
//     winners give each other (§3) — further, and the count describes no list;
//   - a legal deck (lib/decks.mjs deckChecks).

import { MAIN_SIZE } from "./decks.mjs";
import { counter } from "./consensus.mjs";
import { isRecord, oneFinishEach } from "./placing.mjs";
import { NEVER_PLAY } from "./avoid.mjs";

export const SPLIT = 20, NEAR = 9, MIN_LISTS = 3, MIN_EVENTS = 2, MIN_RECORDS = 2, SAME_FINISH = 4, MARK_IN = 0.6, MARK_OUT = 0.25;
const NOT_MAIN = new Set(["Legend", "Rune", "Battlefield"]);

// A list's main deck by card name: name -> copies.
export const mainOf = (cards, card) => {
  const m = new Map();
  for (const [code, q] of Object.entries(cards)) { const c = card(code); if (c && !NOT_MAIN.has(c.t)) m.set(c.n, (m.get(c.n) || 0) + q); }
  return m;
};
// Copies of a that b does not have, against a 40: 0 is the same main deck, 40 a different one.
export const changed = (a, b) => {
  let shared = 0, total = 0;
  for (const [n, q] of a) { total += q; shared += Math.min(q, b.get(n) || 0); }
  return Math.max(total, MAIN_SIZE) - shared;
};

// Average linkage: merge the closest two groups while their lists are on average `cut` apart
// or closer. Deterministic: ties go to the lower indices. Largest group first.
export function group(mains, cut = SPLIT) {
  const D = mains.map((a) => mains.map((b) => changed(a, b)));
  let G = mains.map((_, i) => [i]);
  const avg = (A, B) => { let s = 0; for (const i of A) for (const j of B) s += (D[i][j] + D[j][i]) / 2; return s / (A.length * B.length); };
  for (;;) {
    let best = null;
    for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) {
      const d = avg(G[i], G[j]);
      if (d <= cut && (!best || d < best.d)) best = { i, j, d };
    }
    if (!best) break;
    G = G.filter((_, k) => k !== best.i && k !== best.j).concat([[...G[best.i], ...G[best.j]].sort((a, b) => a - b)]);
  }
  return G.sort((a, b) => b.length - a.length || a[0] - b[0]);
}

// How well a list finished, 0 (last) to 1 (first). A claim or a record with no field size
// is read as a finish in a field of 32 — for ordering only, never printed.
const finishOf = (d) => (d.pl != null ? 1 - (d.pl - 1) / Math.max(d.ec || 32, d.pl) : Number(d.cp) > 0 ? 1 - (Number(d.cp) - 1) / 32 : 0);
const placeOf = (d) => ({ s: d.s, h: d.h, ev: d.ev || null, pl: d.pl ?? null, players: d.ec || null, cp: d.pl == null ? Number(d.cp) || null : null, dt: d.dt });

export function netdeckMaker(idx, card) {
  const { consensus } = counter(idx, card);
  // A claim lives in its title, and a copied list keeps its title: "Rek'Sai Top 4 at Showdown
  // Series Bristol - copy 2" was rebuilt as Mordekaiser, a legend that event never saw (23 Oct
  // 2026). A claim whose title names another champion, and not its own, is not its finish.
  const champs = [...new Set(idx.cards.filter((c) => c.t === "Legend").map((c) => idx.championOf(c)).filter(Boolean))]
    .map((n) => [n, new RegExp(`(^|[^\\w])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`, "i")]);
  const claimIsOther = (d) => {
    if (isRecord(d)) return false;
    const own = idx.championOf(card(d.lg)), named = champs.filter(([, re]) => re.test(d.h || "")).map(([n]) => n);
    return named.length > 0 && !named.includes(own);
  };
  const oneFinish = (lists) => oneFinishEach(lists.filter((d) => !claimIsOther(d)), (r, d) => changed(mainOf(r.cards, card), mainOf(d.cards, card)) <= SAME_FINISH);

  //   lists: one legend's good placings in one format, each { s, h, ev, pl, ec, cp, tour, dt, lg, cards }.
  //   preview: (d) -> true when the list's event was played before its format was legal.
  function netdecks(all, { preview = () => false } = {}) {
    const lists = oneFinish(all);
    const bad = (d) => [...new Set(Object.keys(d.cards).map((k) => card(k)?.n).filter((n) => NEVER_PLAY.has(n)))].sort();
    const parts = new Map();
    for (const d of lists) { const k = bad(d).join("|"); (parts.get(k) || parts.set(k, []).get(k)).push(d); }
    const out = [];
    for (const [avoidKey, ds] of parts) {
      const mains = ds.map((d) => mainOf(d.cards, card));
      for (const ix of group(mains)) {
        const L = ix.map((i) => ds[i]), M = ix.map((i) => mains[i]);
        const best = [...L].sort((a, b) => finishOf(b) - finishOf(a) || (b.ec || 0) - (a.ec || 0))[0];
        const events = new Set(L.map((d) => d.ev || d.ce || d.s)).size, records = L.filter(isRecord).length;
        const g = { status: null, misses: [], lists: L.length, events, records, claims: L.length - records,
          avoid: avoidKey ? avoidKey.split("|") : [], preview: L.every(preview),
          through: L.map((d) => d.dt).sort().at(-1), score: Math.round(100 * finishOf(best)) / 100,
          best: placeOf(best), members: L.map(placeOf) };
        if (L.length < MIN_LISTS) {
          Object.assign(g, { status: "single", misses: [`${L.length} list${L.length === 1 ? "" : "s"}: ${MIN_LISTS} needed to count one`], cards: best.cards, count: null, near: null, closest: null });
        } else {
          const c = consensus(L), cm = mainOf(c.cards, card);
          const dist = M.map((m) => changed(m, cm));
          const near = [...dist].sort((x, y) => x - y)[Math.floor((dist.length - 1) / 2)];
          const ci = dist.indexOf(Math.min(...dist));
          if (events < MIN_EVENTS) g.misses.push(`${events} event: ${MIN_EVENTS} needed, so one room's or one team's list cannot pass for the field's`);
          if (records < MIN_RECORDS) g.misses.push(`${records} recorded finish${records === 1 ? "" : "es"}: ${MIN_RECORDS} needed; the rest are the authors' own claims`);
          if (near > NEAR) g.misses.push(`its lists sit a median ${near} copies from the count: more than ${NEAR}, so the count describes none of them`);
          const broken = c.checks.filter((k) => k.ok === false);
          if (broken.length) g.misses.push(`breaks ${broken.map((k) => `${k.label} (${k.val})`).join(", ")}`);
          const { cards, ...count } = c;
          Object.assign(g, { status: g.misses.length ? "early" : "net", cards, count, near,
            // The real list closest to the count: what to look at if the count feels synthetic.
            closest: { ...placeOf(L[ci]), changed: dist[ci] } });
        }
        // Each card's share of the group's lists, by name, for telling groups apart below.
        const share = new Map();
        for (const m of M) for (const n of m.keys()) share.set(n, (share.get(n) || 0) + 1 / M.length);
        out.push(Object.defineProperty(g, "share", { value: share, enumerable: false }));
      }
    }
    // What tells a group from the legend's others: cards most of its lists run (MARK_IN) and
    // no other group's lists much do (MARK_OUT). Only where there is more than one group.
    for (const g of out) {
      const others = out.filter((o) => o !== g);
      g.marks = !others.length ? [] : [...g.share].map(([n, s]) => ({ n, s, o: Math.max(...others.map((o) => o.share.get(n) || 0)) }))
        .filter((x) => x.s >= MARK_IN && x.o <= MARK_OUT).sort((a, b) => b.s - b.o - (a.s - a.o) || a.n.localeCompare(b.n)).slice(0, 3).map((x) => x.n);
    }
    // Playable first, then the strongest evidence, then the most lists and the best finish.
    const rank = { net: 0, early: 1, single: 2 };
    return out.sort((a, b) => (a.avoid.length ? 1 : 0) - (b.avoid.length ? 1 : 0) || rank[a.status] - rank[b.status] || b.lists - a.lists || b.score - a.score);
  }

  return { netdecks, oneFinish };
}
