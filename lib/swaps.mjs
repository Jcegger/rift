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

import { rolesOf, valueOf, mainRole, understood, ROLES } from "./roles.mjs";
import { statusOf, suggestible } from "./research.mjs";
import { engineTags, ENGINES } from "./engines.mjs";
import { cardVotes } from "./infer.mjs";

const ENGINE_KEYS = new Set(ENGINES.map((e) => e.key));

export const BUDGET = 9;            // copies changed, at most
// A new set's first wave is small: in the Radiance previews, older legends' placed lists ran
// about 3 Radiance copies and 27% ran none. So at most this many UPGRADE swaps per list.
export const UPGRADES = 2;
const ALT_OWN = 0.15, PASSED = 0.03, CORE = 0.8;
const MARGIN = { flex: 0.15, core: 0.45 };

//   anchor: [{ c, copies, inc }] — the list to change and how many of the legend's
//     winners run each card; idx; legend: its card;
//   pool: the legal cards to choose from; quality: name -> { rate, n } across lists that
//     could play it; own: name -> share of this legend's winning lists;
//   isNew: card -> true for a set with no results yet; research: data/research.json;
//   engine: the deck's engine keys (a payoff for one is a small plus).
export function suggestSwaps(anchor, { idx, legend, pool, quality = new Map(), own = new Map(), isNew = () => false, research = null, engine = [], budget = BUDGET }) {
  own = own || new Map();   // under 10 lists, a legend's own shares are not evidence (null)
  const champ = idx.championOf(legend), name = idx.legendName(legend);
  const inList = new Set(anchor.map((r) => r.c.n));
  const keys = new Set(engine.filter((k) => k !== "none"));
  const cap = (c) => /\[Unique\]/.test(c.x || "") ? 1 : 3;
  const offered = (c) => {
    if (inList.has(c.n) || idx.signatureOf(c) || (c.t === "Unit" && idx.championOf(c) === champ)) return false;
    const st = research && statusOf(research, name, c.n);
    if (st && !suggestible(st)) return false;
    const q = quality.get(c.n), o = own.get(c.n) || 0;
    return isNew(c) || o >= ALT_OWN || !(q?.n >= 30 && q.rate < PASSED);
  };
  const cands = pool.filter(offered).map((c) => ({ c, v: valueOf(c), role: mainRole(c), roles: new Set(rolesOf(c).map((r) => r.role)) }));

  const options = [];
  for (const r of anchor) {
    const c = r.c;
    if (idx.signatureOf(c) || (c.t === "Unit" && idx.championOf(c) === champ)) continue;   // the legend's own cards stay
    // So do the payoffs of its engine: they are what the deck is for (Kennen's Rhasa,
    // LeBlanc's Karthus), not a slot a cheaper card can fill.
    if (engineTags(c).some((t) => t.role === "payoff" && keys.has(t.engine))) continue;
    // And the cards of a plan that is not an engine — the heading's sub-archetype (the
    // Bladesman's lone defender: En Garde's "+1 more if it is the only unit").
    if (Object.keys(cardVotes(c).sub).some((k) => keys.has(k) && !ENGINE_KEYS.has(k))) continue;
    const role = mainRole(c), v = valueOf(c), core = r.inc >= CORE, readable = understood(c);
    for (const k of cands) {
      if (Math.abs((k.c.e ?? 0) - (c.e ?? 0)) > 1) continue;
      // Same job; a card with no readable role can only be matched slot for slot (same
      // type, same cost), and only by what other winners run instead.
      const sameSlot = k.c.t === c.t && (k.c.e ?? 0) === (c.e ?? 0);
      if (role ? !(k.role === role || k.roles.has(role)) : !sameSlot) continue;
      const delta = Math.round((k.v - v) * 100) / 100;
      const o = own.get(k.c.n) || 0;
      const st = research && statusOf(research, name, k.c.n);
      let kind = null;
      if (o >= ALT_OWN && delta >= -0.1 && !core) kind = "alt";
      else if (st?.verdict === "test") kind = "test";
      else if (isNew(k.c) && readable && role && delta >= (core ? MARGIN.core : MARGIN.flex)) kind = "upgrade";
      if (!kind) continue;
      const fit = engineTags(k.c).some((t) => t.role === "payoff" && keys.has(t.engine)) ? 0.1 : 0;
      const score = { alt: 1, test: 0.9, upgrade: 0.5 }[kind] + delta + o + fit - (core ? 0.3 : 0) - r.inc * 0.3;
      options.push({ out: c, in: k.c, kind, delta, role, core, inc: r.inc, own: o, score, copies: Math.min(r.copies, cap(k.c)) });
    }
  }
  options.sort((a, b) => b.score - a.score);
  const usedOut = new Set(), usedIn = new Set(), picked = [];
  let spent = 0, ups = 0;
  for (const o of options) {
    if (usedOut.has(o.out.n) || usedIn.has(o.in.n) || spent + o.copies > budget || (o.kind === "upgrade" && ups >= UPGRADES)) continue;
    if (o.kind === "upgrade") ups++;
    usedOut.add(o.out.n); usedIn.add(o.in.n); spent += o.copies;
    picked.push({
      out: o.out.n, in: o.in.n, inCode: o.in.c, copies: o.copies, role: o.role, kind: o.kind, delta: o.delta, core: o.core,
      why: o.kind === "alt" ? `${Math.round(o.own * 100)}% of this legend's winning lists run ${o.in.n}; ${o.role ? `same job (${ROLES[o.role] || o.role})` : "same slot (type and cost)"} as ${o.out.n}, in ${Math.round(o.inc * 100)}%`
        : o.kind === "test" ? `its research question was answered "test" (docs/research.md)`
        : `does ${o.out.n}'s job (${ROLES[o.role] || o.role}) for less: ${o.delta > 0 ? "+" : ""}${o.delta} by lib/roles.mjs${o.core ? ` — replaces a core card (${Math.round(o.inc * 100)}%), so only because it is clearly better` : ""}`,
    });
  }
  return picked;
}
