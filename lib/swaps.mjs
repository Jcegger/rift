// Changes to a winning list, each a role swap with a reason (docs/deckbuilding.md):
//
// - a winning list changes a median 6 cards from its legend's consensus and two winners
//   differ by 9, so the budget is about 9 copies — more is a different deck;
// - cuts are replaced like for like: the same role (lib/roles.mjs), within one Energy;
// - the flex and mid slots (in under 80% of the legend's winning lists) change first. A
//   core card goes only for a clearly better card for its role — Kennen's 91% Ezreal,
//   Prodigy fell to Trifarian Captain — never for a sideways one.
//
// The reasons that hold up, strongest first:
//   ALT     — other winners of this legend run the card instead (15%+ of its lists): the
//             pros' own disagreement, the lowest-risk change there is;
//   TEST    — a research question about the card was answered "test" (docs/research.md);
//   UPGRADE — a card from a set too new to have results that does the same job for less
//             (valueOf). New sets get in by efficiency first, not by theme.
// A long-legal card the field has passed on (under 3% of the lists that could play it, and
// under 15% of this legend's) is never offered: that question has been answered.
//
// The thresholds are FROZEN as of 20 Oct 2026 (docs/deckbuilding.md, "what is fitted to
// what"): the backtest has 11 adopted cards and several choices were made against it, so it
// only guards now. A knob changes on the forward scoreboard (data/swaplog.json), once a kind
// has 30+ scored suggestions — not on the backtest.

import { rolesOf, valueOf, mainRole, understood, speedOf, SPEED, ROLES } from "./roles.mjs";
import { statusOf, suggestible } from "./research.mjs";
import { engineTags, ENGINES } from "./engines.mjs";
import { cardVotes } from "./infer.mjs";
import { NEVER_PLAY } from "./avoid.mjs";

const ENGINE_KEYS = new Set(ENGINES.map((e) => e.key));

export const BUDGET = 9;            // copies changed, at most
// A new set's first wave is small: in the Radiance previews, older legends' placed lists ran
// about 3 Radiance copies and 27% ran none. So at most this many UPGRADE swaps per list.
export const UPGRADES = 2;
// RISING: a card up RISE points this week and in RISE_NOW% of posted lists — at most RISINGS a
// list, labelled as the riskiest kind; data/swaplog.json scores it on good placings 28 days later.
export const RISINGS = 2; const RISE = 15, RISE_NOW = 20, FALL = -15;
const ALT_OWN = 0.15, PASSED = 0.03, CORE = 0.8, FLEX = 0.6;
const MARGIN = { flex: 0.15, core: 0.45 };

//   anchor: [{ c, copies, inc }] — the list to change and how many of the legend's
//     winners run each card; idx; legend: its card;
//   pool: the legal cards to choose from; quality: name -> { rate, n } across lists that
//     could play it; own: name -> share of this legend's winning lists;
//   isNew: card -> true for a set with no results yet; research: data/research.json;
//   engine: the deck's engine keys (a payoff for one is a small plus).
//   stats: an object to count why candidates were turned down (for audits).
//   ownLists: how many lists `own` was counted from — an alternative needs 2 of them at least.
//   ownLabel: what `own` was counted from, for the reasons ("winning lists", or "posted lists"
//   for a legend anchored on its crowd).
//   trend: card name -> { now, delta } in points, this legend's posted lists this week against
//   the two before (data/rising.json). The crowd moves first and tracks winners closely, so a
//   card rising fast is a lead (RISING), and an alternative falling fast is not offered.
//   kinds: only these kinds (a Set), e.g. the experiments without the winners' alternatives.
export function suggestSwaps(anchor, { idx, legend, pool, quality = new Map(), own = new Map(), ownLists = 0, ownLabel = "winning lists", isNew = () => false, research = null, engine = [], budget = BUDGET, upgrades = UPGRADES, trend = null, kinds = null, stats = null }) {
  const no = (k) => { if (stats) stats[k] = (stats[k] || 0) + 1; };
  own = own || new Map();
  // Another winner's choice: 15% of the legend's lists, and at least two lists — with five,
  // one list is 20% and proves nothing.
  const altOwn = Math.max(ALT_OWN, ownLists ? 2 / ownLists - 1e-9 : ALT_OWN);
  const champ = idx.championOf(legend), name = idx.legendName(legend);
  const inList = new Set(anchor.map((r) => r.c.n));
  const keys = new Set(engine.filter((k) => k !== "none"));
  const cap = (c) => /\[Unique\]/.test(c.x || "") ? 1 : 3;
  const offered = (c) => {
    if (inList.has(c.n) || idx.signatureOf(c) || (c.t === "Unit" && idx.championOf(c) === champ)) return false;
    if (NEVER_PLAY.has(c.n)) return false;                    // lib/avoid.mjs: Jay never plays it
    const st = research && statusOf(research, name, c.n);
    if (st && !suggestible(st)) return false;
    const q = quality.get(c.n), o = own.get(c.n) || 0;
    return isNew(c) || o >= altOwn || !(q?.n >= 30 && q.rate < PASSED);
  };
  const cands = pool.filter(offered).map((c) => ({ c, v: valueOf(c), role: mainRole(c), roles: new Set(rolesOf(c).map((r) => r.role)) }));

  const options = [];
  for (const r of anchor) {
    const c = r.c;
    if (idx.signatureOf(c) || (c.t === "Unit" && idx.championOf(c) === champ)) { no("out: legend's own card"); continue; }   // the legend's own cards stay
    // So do the payoffs of its engine: they are what the deck is for (Kennen's Rhasa,
    // LeBlanc's Karthus), not a slot a cheaper card can fill.
    if (engineTags(c).some((t) => t.role === "payoff" && keys.has(t.engine))) { no("out: engine payoff"); continue; }
    // And the cards of a plan that is not an engine — the heading's sub-archetype (the
    // Bladesman's lone defender: En Garde's "+1 more if it is the only unit").
    if (Object.keys(cardVotes(c).sub).some((k) => keys.has(k) && !ENGINE_KEYS.has(k))) { no("out: heading-plan card"); continue; }
    if (stats) stats["out: open"] = (stats["out: open"] || 0) + 1;
    const role = mainRole(c), v = valueOf(c), core = r.inc >= CORE, readable = understood(c);
    const speed = SPEED[speedOf(c)];
    for (const k of cands) {
      if (Math.abs((k.c.e ?? 0) - (c.e ?? 0)) > 1) continue;
      if (SPEED[speedOf(k.c)] < speed) { no("pair: too slow for the slot"); continue; }
      // Same job; a card with no readable role can only be matched slot for slot (same
      // type, same cost), and only by what other winners run instead.
      const sameSlot = k.c.t === c.t && (k.c.e ?? 0) === (c.e ?? 0);
      const sameJob = role && (k.role === role || k.roles.has(role));
      // Winners fill each other's slots like for like by type and cost as much as by job
      // (61% of cuts: same type, within one Energy) — so another winner's choice qualifies on
      // either. A new card has to do the same job.
      const winnersSlot = (own.get(k.c.n) || 0) >= altOwn && k.c.t === c.t;
      if (!sameJob && !winnersSlot && !(!role && sameSlot)) continue;
      const delta = Math.round((k.v - v) * 100) / 100;
      const o = own.get(k.c.n) || 0;
      const st = research && statusOf(research, name, k.c.n);
      let kind = null;
      const tIn = trend?.get?.(k.c.n) || trend?.[k.c.n] || null;
      // Winners chose it: a rough value read does not overrule them — the crowd moving away
      // from it this week does.
      if (o >= altOwn && !core && !(tIn && tIn.delta <= FALL)) kind = "alt";
      else if (st?.verdict === "test") kind = "test";
      // A card we cannot read is protected where winners rely on it (core and mid); a flex
      // card is one they already disagree about.
      else if (isNew(k.c) && sameJob && (readable || r.inc < FLEX) && delta >= (core ? MARGIN.core : MARGIN.flex)) kind = "upgrade";
      // …and gaining on the card it replaces: if both are rising, the crowd is not moving
      // from one to the other.
      else if (tIn && tIn.delta >= RISE && tIn.now >= RISE_NOW && !core && tIn.delta - ((trend?.get?.(c.n) || trend?.[c.n])?.delta ?? 0) >= 10
        && (sameJob || (k.c.t === c.t && Math.abs((k.c.e ?? 0) - (c.e ?? 0)) <= 1))) kind = "rising";
      if (kind && kinds && !kinds.has(kind)) continue;
      if (!kind) {
        if (o >= altOwn && core) no("pair: alt blocked (core card)");
        else if (isNew(k.c) && !readable) no("pair: new card blocked (out card unreadable)");
        else if (isNew(k.c) && !role) no("pair: new card blocked (no role)");
        else if (isNew(k.c)) no(`pair: new card below margin (${core ? "core" : "flex"})`);
        else no("pair: no reason (old card, not a winners' choice)");
        continue;
      }
      const fit = engineTags(k.c).some((t) => t.role === "payoff" && keys.has(t.engine)) ? 0.1 : 0;
      const tOut = trend?.get?.(c.n) || trend?.[c.n] || null;
      const score = { alt: 1, test: 0.9, upgrade: 0.5, rising: 0.4 }[kind] + delta + o + fit - (core ? 0.3 : 0) - r.inc * 0.3
        + (tIn ? tIn.delta / 100 : 0) - (tOut ? tOut.delta / 100 : 0);
      // Winners split slots: an alternative run by fewer lists takes its share of the copies
      // (2 + 1), not the whole slot. A better new card takes the slot.
      const share = kind === "alt" ? Math.max(1, Math.round(r.copies * o / (o + r.inc))) : r.copies;
      options.push({ out: c, in: k.c, kind, delta, role, core, inc: r.inc, own: o, score, copies: Math.min(share, cap(k.c)), tIn, tOut });
    }
  }
  options.sort((a, b) => b.score - a.score);
  const usedOut = new Set(), usedIn = new Set(), picked = [], more = [];
  let spent = 0, ups = 0, rises = 0;
  for (const o of options) {
    if (usedOut.has(o.out.n) || usedIn.has(o.in.n)) continue;
    // Over the budget or the new-card cap: still a reasoned change, offered beside the list.
    // A core card (in 80%+ of winning lists) is never changed in the list itself: the one
    // core card that fell in the Radiance previews (Kennen's Ezreal, Prodigy) gave no sign by
    // value that it would. A strong case to replace one is offered beside the list instead.
    if (spent + o.copies > budget || (o.kind === "upgrade" && ups >= upgrades) || (o.kind === "rising" && rises >= RISINGS) || o.core) {
      no(o.core ? "pick: core card (offered, not applied)" : spent + o.copies > budget ? "pick: over budget" : o.kind === "rising" ? "pick: rising cap" : "pick: upgrade cap");
      if (more.length < 6 && !more.some((m) => m.out.n === o.out.n || m.in.n === o.in.n) && !picked.some((p) => p.out === o.out.n || p.in === o.in.n)) more.push(o);
      continue;
    }
    if (o.kind === "upgrade") ups++;
    if (o.kind === "rising") rises++;
    usedOut.add(o.out.n); usedIn.add(o.in.n); spent += o.copies;
    picked.push(describe(o));
  }
  picked.more = more.map(describe);
  return picked;
  function describe(o) {
    return {
      out: o.out.n, in: o.in.n, inCode: o.in.c, copies: o.copies, role: o.role, kind: o.kind, delta: o.delta, core: o.core,
      why: o.kind === "alt" ? `${Math.round(o.own * 100)}% of this legend's ${ownLabel} run ${o.in.n}; ${o.role && (mainRole(o.in) === o.role || rolesOf(o.in).some((x) => x.role === o.role)) ? `same job (${ROLES[o.role] || o.role})` : `same slot (a ${o.in.t.toLowerCase()}, ${o.in.e ?? 0} Energy for ${o.out.e ?? 0})`} as ${o.out.n}, in ${Math.round(o.inc * 100)}%`
        : o.kind === "test" ? `its research question was answered "test" (docs/research.md)`
        : o.kind === "rising" ? `rising in this legend's posted lists: ${o.tIn.now - o.tIn.delta}% → ${o.tIn.now}% this week${o.tOut ? `, while ${o.out.n} went ${o.tOut.now - o.tOut.delta}% → ${o.tOut.now}%` : ""} — the crowd moves first; a lead, not a result`
        : `does ${o.out.n}'s job (${ROLES[o.role] || o.role}) for less: ${o.delta > 0 ? "+" : ""}${o.delta} by lib/roles.mjs${o.core ? ` — replaces a core card (${Math.round(o.inc * 100)}%), so only because it is clearly better` : ""}`,
    };
  }
}
