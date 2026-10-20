// A brew: a winning list, changed on purpose. Shared by scripts/build-brews.mjs
// (data/brews.json) and anything that wants one on demand.
//
// Built from docs/deckbuilding.md, not from card text alone — the first version of this
// file generated 40s from scratch and could not tell a good card from an on-theme one.
//
//   ANCHOR — a legend with winning lists: their consensus, with the role swaps
//            lib/swaps.mjs finds a reason for (other winners' choices, research answered
//            "test", and new cards that do a job for less). No reason, no change.
//   COLOURS — a legend with too few lists to anchor on: its colours' winners' cards,
//            averaged per legend, plus its own package and its own few lists. The first
//            version ported one same-colour legend's list instead; the blind test
//            (lib/blind.test.mjs) showed that lost to plain popularity. Then the same swaps.
//
// One chosen champion (77% of winning lists run exactly one) and signatures at 3 or none
// (43% / 35%). Never priced. Every change says why; nothing here has been played.

import { suggestSwaps } from "./swaps.mjs";
import { engineTags } from "./engines.mjs";
import { valueOf, rolesOf, mainRole, ROLES } from "./roles.mjs";
import { cardVotes } from "./infer.mjs";
import { deckChecks, SIG_MAX } from "./decks.mjs";

const MAIN = ["Unit", "Spell", "Gear"];

// rows: [{ c, copies, inc }]; extras: runes/battlefields { code: qty }.
function finish(L, idx, rows, extras, meta) {
  const cards = { [L.c]: 1 };
  for (const r of rows) cards[r.c.c] = (cards[r.c.c] || 0) + r.copies;
  for (const [k, q] of Object.entries(extras)) cards[k] = (cards[k] || 0) + q;
  const checks = deckChecks({ cards, sb: {} }, idx).filter((k) => k.ok !== true);
  return { ...meta, cards, checks, legal: checks.every((k) => k.ok === "later"), legalFrom: checks.find((k) => k.ok === "later")?.val || null,
    rows: rows.map((r) => ({ code: r.c.c, name: r.c.n, qty: r.copies, type: r.c.t, cost: r.c.e ?? null, role: ROLES[mainRole(r.c)] || "", inc: r.inc ?? null, why: r.why || null, change: r.change || null })),
    radCards: rows.filter((r) => r.c.s === "RAD").reduce((a, r) => a + r.copies, 0) };
}

const apply = (rows, swaps, idx) => {
  const out = rows.map((r) => ({ ...r }));
  for (const s of swaps) {
    const i = out.findIndex((r) => r.c.n === s.out);
    if (i < 0) continue;
    const c = idx.cards.find((x) => x.c === s.inCode);
    const left = out[i].copies - s.copies;
    out.splice(i, 1, ...(left > 0 ? [{ ...out[i], copies: left }] : []), { c, copies: s.copies, inc: null, change: s.kind, why: s.why });
  }
  return out;
};
const extrasOf = (con, card) => {
  const out = {};
  for (const [k, q] of Object.entries(con.cards || {})) { const c = card(k); if (c?.t === "Rune" || c?.t === "Battlefield") out[c.c] = (out[c.c] || 0) + q; }
  return out;
};

//   con: lib/consensus.mjs consensus of the anchor lists; card: code resolver; ctx: what
//   suggestSwaps takes (pool, quality, own, isNew, research, engine).
export function anchorBrew(L, idx, con, card, ctx, meta = {}) {
  const rows = con.main.map((r) => ({ c: card(r.code), copies: r.copies, inc: r.inc })).filter((r) => r.c && MAIN.includes(r.c.t));
  // A consensus can miss the champion when the deck runs few units (Jayce runs 3): add the
  // champion unit its lists run most, for the least-played card.
  const champ = idx.championOf(L);
  if (!rows.some((r) => r.c.t === "Unit" && r.c.n.startsWith(`${champ}, `))) {
    const f = (con.flex || []).map((x) => ({ c: card(x.code), inc: x.inc })).find((x) => x.c?.t === "Unit" && x.c.n.startsWith(`${champ}, `))
      || { c: idx.cards.filter((c) => !c.v && c.t === "Unit" && c.n.startsWith(`${champ}, `) && !idx.bannedNames.has(c.n)).sort((a, b) => valueOf(b) - valueOf(a))[0], inc: 0 };
    const low = rows.filter((r) => !idx.signatureOf(r.c)).sort((a, b) => a.inc - b.inc)[0];
    if (f.c && low) { low.copies--; if (!low.copies) rows.splice(rows.indexOf(low), 1); rows.push({ c: f.c, copies: 1, inc: f.inc, change: "champion", why: `the chosen champion — ${Math.round(f.inc * 100)}% of these lists run it, under the consensus cut` }); }
  }
  const swaps = suggestSwaps(rows, { idx, legend: L, ...ctx });
  return finish(L, idx, apply(rows, swaps, idx), extrasOf(con, card), { ...meta, kind: "anchor", swaps: [...swaps], more: swaps.more || [] });
}

// COLOURS — a legend with too few lists to anchor on, built the way lib/blind.test.mjs
// found closest to real winning lists when a legend's own lists are hidden: the cards its
// colours' winners pick, averaged per legend (so the most-played legends do not drown the
// rest), plus its own package — one chosen champion, its signature at 3, a lift for cards
// that fit its plan — and its own lists' choices when it has a few. Blind, that shares about
// 20 of 40 cards with what winners play (ceiling: 36, two halves of their lists): it beats
// porting one other legend's list (14) and plain popularity (17.6). The rest is judgement
// only play reveals; the swaps follow.
//   shares: [{ name, domains: Set, share: Map(card name -> share of its lists) }] for the
//   OTHER legends with enough lists; ctx.own: this legend's few lists' shares.
export function coloursBrew(L, idx, shares, card, ctx, meta = {}) {
  const champ = idx.championOf(L), name = idx.legendName(L);
  const ident = new Set((L.d || []).filter((d) => d !== "Colorless"));
  const keys = new Set((ctx.engine || []).filter((k) => k !== "none"));
  const uniq = new Map();
  for (const c of idx.cards) if (!c.v && MAIN.includes(c.t) && !uniq.has(c.n) && (c.d || []).every((d) => d === "Colorless" || ident.has(d)) && !idx.bannedNames.has(c.n)
    && !(idx.signatureOf(c) && idx.signatureOf(c) !== champ) && !(idx.notYetStandard(c) && !idx.notYetStandard(c).from) && !/ - Starter$/.test(c.n)) uniq.set(c.n, c);
  // How the colours' winners rate a card: the average share across the legends that can play it.
  const rate = (c) => {
    const ds = (c.d || []).filter((d) => d !== "Colorless");
    let s = 0, n = 0;
    for (const x of shares) { if (x.name === name || !ds.every((d) => x.domains.has(d))) continue; s += x.share.get(c.n) || 0; n++; }
    return Math.max(n ? s / n : 0, ctx.own?.get(c.n) || 0);
  };
  const fits = (c) => engineTags(c).some((t) => keys.has(t.engine)) || Object.keys(cardVotes(c).sub).some((k) => keys.has(k));
  const rows = [];
  const count = () => rows.reduce((a, r) => a + r.copies, 0);
  const put = (c, q, why, change = "built") => { q = Math.min(q, 40 - count(), /\[Unique\]/.test(c.x || "") ? 1 : 3); if (q > 0 && !rows.some((r) => r.c.n === c.n)) rows.push({ c, copies: q, inc: rate(c), change, why }); };
  const champs = [...uniq.values()].filter((c) => c.t === "Unit" && c.n.startsWith(`${champ}, `)).sort((a, b) => ((ctx.own?.get(b.n) || 0) - (ctx.own?.get(a.n) || 0)) || (valueOf(b) - valueOf(a)));
  if (champs[0]) put(champs[0], 1, "chosen champion (one copy, as 77% of winning lists run)");
  const sig = [...uniq.values()].filter((c) => idx.signatureOf(c) === champ).sort((a, b) => ((ctx.own?.get(b.n) || 0) - (ctx.own?.get(a.n) || 0)) || (valueOf(b) - valueOf(a)))[0];
  if (sig) put(sig, 3, "signature at 3 (winning lists run 3 or none)");
  const ranked = [...uniq.values()].filter((c) => !(c.t === "Unit" && c.n.startsWith(`${champ}, `)) && !idx.signatureOf(c))
    .map((c) => { const r = rate(c); return { c, r, s: r * (fits(c) ? 1.5 : 1) }; }).filter((x) => x.r > 0).sort((a, b) => b.s - a.s);
  for (const x of ranked) {
    if (count() >= 40) break;
    const own = ctx.own?.get(x.c.n) || 0;
    put(x.c, x.r >= 0.5 ? 3 : x.r >= 0.25 ? 2 : 1, own >= x.r && own > 0 ? `${Math.round(own * 100)}% of this legend's own lists` : `the colours' winners run it (${Math.round(x.r * 100)}% on average across their legends)${fits(x.c) ? "; fits the plan" : ""}`);
  }
  const extras = {};
  const runeCards = ctx.runeCards || {};
  const doms = [...ident];
  if (doms.length === 2) { const ask = Object.fromEntries(doms.map((d) => [d, 0])); for (const r of rows) for (const d of (r.c.d || []).filter((d) => ident.has(d))) ask[d] += (r.c.p || 0) * r.copies; const t = ask[doms[0]] + ask[doms[1]]; const k = Math.min(9, Math.max(3, Math.round(12 * (t ? ask[doms[0]] / t : 0.5)))); if (runeCards[doms[0]]) extras[runeCards[doms[0]]] = k; if (runeCards[doms[1]]) extras[runeCards[doms[1]]] = 12 - k; }
  else if (doms[0] && runeCards[doms[0]]) extras[runeCards[doms[0]]] = 12;
  for (const b of (ctx.battlefields || []).slice(0, 3)) extras[b.code] = 1;
  const swaps = suggestSwaps(rows.map((r) => ({ ...r, inc: Math.min(r.inc, 0.79) })), { idx, legend: L, ...ctx, budget: ctx.swapBudget ?? 6 });
  return finish(L, idx, apply(rows, swaps, idx), extras, { ...meta, kind: "colours", swaps: [...swaps], more: swaps.more || [] });
}
