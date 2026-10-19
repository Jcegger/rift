// A brew: a legal 40 built from a legend's own cards outward, for legends nobody has
// built yet and as a second opinion on the ones they have. Shared by
// scripts/build-brews.mjs (data/brews.json) and anything that wants one on demand.
//
// It builds in the order lib/infer.mjs reads a deck:
//
//   1. the legend, and what lib/infer.mjs says its deck is (main + sub-archetypes),
//   2. the chosen champion — the champion unit that fits those sub-archetypes best,
//   3. its signature cards (3 copies in total, §103.3.d),
//   4. the colour pair's legal pool,
//   5. scored and filled to a curve taken from real decks of the same main archetype.
//
// A card's score is FIT (its sub-archetype votes against the deck's, payoffs counting
// double: a payoff is dead without its engine, so running one is a choice), QUALITY
// (how often players pick it when their legend's colours allow it — for a Radiance card,
// in the Radiance-era lists, and unknown, not zero, before anyone has), and MAIN (its
// main-archetype votes against the deck's). Never price: cost is not the axis.
//
// Nothing here is tested in a game. Every card says why it is in, and the brew says it is
// a brew. Cards the legend's winners skip (data/research.json) stay out until answered.

import { cardVotes } from "./infer.mjs";
import { deckChecks, MAIN_SIZE, RUNE_COUNT, SIG_MAX } from "./decks.mjs";
import { suggestible, statusOf } from "./research.mjs";

export const W = { fit: 3, quality: 4, main: 1 };
export const BUCKETS = [[0, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 99]];
const bucketOf = (e) => BUCKETS.findIndex(([lo, hi]) => (e ?? 0) >= lo && (e ?? 0) <= hi);
const UNKNOWN_QUALITY = 0.15;   // a card nobody could have played yet: neither good nor bad
const OWN_W = 0.6;

// The shape of real decks of each main archetype: units, and copies per cost bucket, per
// 40. templates: { main: { units, buckets: [n…] } } from scripts/build-brews.mjs.
//   main: the main archetype to build to — the hand-written heading's when it has one
//   (guides and judgement beat the inference on pace), else the inferred one.
//   engine: the engine keys docs/archetypes.md's Engine line names — the settled answer the
//   engine reader is tested against — which the brew builds toward as well as the inference.
//   own: name -> share of this legend's own lists, when it has some. A card the deck's
//   players pick almost always (Irelia's Boots of Swiftness, in 120 of 121) is good IN this
//   deck even where it is middling across its colours; it counts at OWN_W so a brew still
//   explores rather than copying the consensus.
export function brew(L, idx, { inferred, main = inferred.main, engine = [], quality, own = null, templates, research = null, battlefields = [], runeCards = {}, weights = W }) {
  const champ = idx.championOf(L);
  const name = idx.legendName(L);
  const ident = new Set((L.d || []).filter((d) => d !== "Colorless"));
  const subs = inferred.subs.slice(0, 3);
  const subW = Object.fromEntries(subs.map((s, i) => [s.key, s.score * [1, 0.6, 0.35][i]]));
  for (const k of engine) if (k !== "none") subW[k] = Math.max(subW[k] || 0, subs[0]?.score || 1);
  const sw = Object.values(subW).reduce((a, b) => a + b, 0) || 1;
  const mainScores = inferred.mainScores || {};
  const tpl = templates[main] || templates.midrange;

  const legal = (c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).every((d) => d === "Colorless" || ident.has(d))
    && !idx.bannedNames.has(c.n) && !(idx.signatureOf(c) && idx.signatureOf(c) !== champ)
    && !(idx.notYetStandard(c) && !idx.notYetStandard(c).from) && !/ - Starter$/.test(c.n);
  const pool = [];
  const seen = new Set();
  for (const c of idx.cards) if (legal(c) && !seen.has(c.n)) { seen.add(c.n); pool.push(c); }

  const score = (c) => {
    const v = cardVotes(c);
    const fit = Object.entries(v.sub).reduce((a, [k, x]) => a + (subW[k] || 0) * x, 0) / sw;
    const ms = Object.values(v.main).reduce((a, b) => a + b, 0) || 1;
    const main = Object.entries(v.main).reduce((a, [k, x]) => a + (mainScores[k] || 0) * (x / ms), 0);
    const q = quality.get(c.n);
    const qual = Math.max(q?.rate ?? UNKNOWN_QUALITY, OWN_W * (own?.get(c.n) || 0));
    const fitSubs = Object.keys(v.sub).filter((k) => subW[k]);
    return { c, v, fit, main, qual, q, fitSubs, total: weights.fit * fit + weights.quality * qual + weights.main * main };
  };
  const held = (c) => research && !suggestible(statusOf(research, name, c.n));

  const out = new Map();   // name -> { c, qty, role, why }
  const count = () => [...out.values()].reduce((a, r) => a + r.qty, 0);
  const add = (s, qty, role, why) => out.set(s.c.n, { c: s.c, qty, role, why, rad: s.c.s === "RAD", untried: !s.q || s.q.n === 0, share: s.q?.rate ?? null });

  // 2. The chosen champion: the champion unit that scores best for this deck; 2 copies
  // (one starts in the Champion Zone, §103.2.a.1, the other is a draw).
  // §103.3.a.2: a champion unit, "<champion>, <title>" — Tibbers carries Annie's tag but is not one.
  const champs = pool.filter((c) => c.t === "Unit" && idx.championOf(c) === champ && c.n.startsWith(`${champ}, `)).map(score).sort((a, b) => b.total - a.total);
  if (champs[0]) add(champs[0], 2, "champion", `chosen champion: ${champs[0].fitSubs.length ? `fits ${champs[0].fitSubs.join(", ")}` : "the best-scoring champion unit"}`);
  // 3. Signatures, 3 in total, best first.
  const sigs = pool.filter((c) => idx.signatureOf(c) === champ).map(score).sort((a, b) => b.total - a.total);
  // A [Unique] card is one copy (§103.3.b); Shurelya's Requiem is a Unique signature.
  const cap = (c) => /\[Unique\]/.test(c.x || "") ? 1 : 3;
  let sigLeft = SIG_MAX;
  for (const s of sigs) { if (!sigLeft) break; const q = Math.min(cap(s.c), sigs.length === 1 ? sigLeft : Math.min(sigLeft, s === sigs[0] ? 2 : 1)); add(s, q, "signature", "signature card"); sigLeft -= q; }

  // 5. Fill to the template's curve and unit count, best score first.
  const want = tpl.buckets.slice();
  let unitsWant = tpl.units;
  for (const r of out.values()) { want[bucketOf(r.c.e)] -= r.qty; if (r.c.t === "Unit") unitsWant -= r.qty; }
  const ranked = pool.filter((c) => !out.has(c.n) && !held(c)).map(score).sort((a, b) => b.total - a.total);
  const copiesFor = (s) => Math.min(cap(s.c), (s.c.e ?? 0) >= 7 ? 1 : (s.c.e ?? 0) >= 5 ? 2 : 3);
  const reason = (s) => [s.fitSubs.length ? `fits ${s.fitSubs.join(", ")}` : null,
    s.q?.n ? `${Math.round(s.q.rate * 100)}% of lists that can${s.q.era ? " (Radiance era)" : ""}` : "untried",
    s.c.s === "RAD" ? "Radiance" : null].filter(Boolean).join("; ");
  const room = () => MAIN_SIZE - count();
  for (const pass of [0, 1]) {
    for (const s of ranked) {
      if (!room()) break;
      if (out.has(s.c.n)) continue;
      const b = bucketOf(s.c.e), unit = s.c.t === "Unit";
      // First pass keeps to the template; the second fills whatever is left.
      if (pass === 0 && (want[b] <= 0 || (unit && unitsWant <= 0) || (!unit && room() - Math.max(0, unitsWant) <= 0))) continue;
      const qty = Math.min(copiesFor(s), room(), pass === 0 ? Math.max(1, want[b]) : cap(s.c));
      add(s, qty, s.fitSubs.length ? "fit" : "staple", reason(s));
      want[b] -= qty; if (unit) unitsWant -= qty;
    }
  }

  // Runes: split by the Power the list asks of each domain (a two-domain card asks half
  // of each); scripts/build-brews.mjs refines it with the simulator's rune sweep.
  const doms = [...ident];
  const ask = Object.fromEntries(doms.map((d) => [d, 0]));
  for (const r of out.values()) { const ds = (r.c.d || []).filter((d) => ident.has(d)); for (const d of ds) ask[d] += (r.c.p || 0) * r.qty / ds.length; }
  const total = Object.values(ask).reduce((a, b) => a + b, 0);
  let first = doms.length === 2 ? Math.min(9, Math.max(3, Math.round(RUNE_COUNT * (total ? ask[doms[0]] / total : 0.5)))) : RUNE_COUNT;
  const runes = doms.length === 2 ? { [doms[0]]: first, [doms[1]]: RUNE_COUNT - first } : { [doms[0]]: RUNE_COUNT };

  const cards = {};
  cards[L.c] = 1;
  for (const r of out.values()) cards[r.c.c] = (cards[r.c.c] || 0) + r.qty;
  for (const [d, n] of Object.entries(runes)) if (runeCards[d]) cards[runeCards[d]] = n;
  for (const b of battlefields.slice(0, 3)) cards[b.code] = 1;
  const checks = deckChecks({ cards, sb: {} }, idx).filter((k) => k.ok !== true);

  return {
    legend: name, code: L.c, champion: champs[0]?.c.n || null, main, inferredMain: inferred.main, sub: subs[0]?.key || null, subName: subs[0]?.name || null,
    subs: subs.map((s) => s.name),
    rows: [...out.values()].sort((a, b) => ({ champion: 0, signature: 1, fit: 2, staple: 3 })[a.role] - ({ champion: 0, signature: 1, fit: 2, staple: 3 })[b.role] || (a.c.e ?? 0) - (b.c.e ?? 0) || a.c.n.localeCompare(b.c.n))
      .map((r) => ({ code: r.c.c, name: r.c.n, qty: r.qty, type: r.c.t, cost: r.c.e ?? null, role: r.role, why: r.why, rad: r.rad, untried: r.untried, share: r.share })),
    runes, battlefields: battlefields.slice(0, 3), cards, checks,
  };
}
