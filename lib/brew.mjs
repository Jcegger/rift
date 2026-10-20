// A brew: a winning list, changed on purpose. Shared by scripts/build-brews.mjs
// (data/brews.json) and anything that wants one on demand.
//
// Built from docs/deckbuilding.md, not from card text alone — the first version of this
// file generated 40s from scratch and could not tell a good card from an on-theme one.
//
//   ANCHOR — a legend with winning lists: their consensus, with the role swaps
//            lib/swaps.mjs finds a reason for (other winners' choices, research answered
//            "test", and new cards that do a job for less). No reason, no change.
//   PORT   — a legend with too few lists to anchor on: the best-placed list of another
//            legend in the same colours, keeping its shared core and replacing its
//            legend's own package (champion, signatures, engine payoffs) with this one's —
//            how players build a legend nobody has built. Then the same swaps.
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

//   shell: { legend, name, lists, con, engine } — the best-placed same-colour legend; ctx.own:
//   this legend's few lists' shares, if any; ctx.engine: its engine keys and heading subs.
export function portBrew(L, idx, shell, card, ctx, meta = {}) {
  const champ = idx.championOf(L), shellChamp = idx.championOf(shell.legend);
  const keys = new Set((ctx.engine || []).filter((k) => k !== "none"));
  const shellKeys = new Set((shell.engine || []).filter((k) => !keys.has(k)));
  const theirs = (c) => idx.signatureOf(c) === shellChamp || (c.t === "Unit" && idx.championOf(c) === shellChamp)
    || engineTags(c).some((t) => t.role === "payoff" && shellKeys.has(t.engine));
  const all = shell.con.main.map((r) => ({ c: card(r.code), copies: r.copies, inc: r.inc })).filter((r) => r.c && MAIN.includes(r.c.t));
  let rows = all.filter((r) => !theirs(r.c)).map((r) => ({ ...r, why: `kept from ${shell.name}'s winning lists (${Math.round(r.inc * 100)}%)` }));
  const cut = all.filter((r) => theirs(r.c));
  const ident = new Set((L.d || []).filter((d) => d !== "Colorless"));
  const has = (n) => rows.some((r) => r.c.n === n);
  const legal = (c) => !c.v && MAIN.includes(c.t) && (c.d || []).every((d) => d === "Colorless" || ident.has(d)) && !idx.bannedNames.has(c.n)
    && !(idx.notYetStandard(c) && !idx.notYetStandard(c).from) && !/ - Starter$/.test(c.n);
  const uniq = (xs) => xs.filter((c, i) => xs.findIndex((x) => x.n === c.n) === i);
  const fits = (c) => Object.keys(cardVotes(c).sub).filter((k) => keys.has(k)).length;
  const passed = (c) => c.s !== "RAD" && ctx.quality?.get(c.n)?.n >= 30 && ctx.quality.get(c.n).rate < 0.03 && !((ctx.own?.get(c.n) || 0) >= 0.15);
  const add = [];
  // The chosen champion: the one this legend's own lists run most, else the best fit.
  const champs = uniq(idx.cards.filter((c) => legal(c) && c.t === "Unit" && c.n.startsWith(`${champ}, `)))
    .sort((a, b) => ((ctx.own?.get(b.n) || 0) - (ctx.own?.get(a.n) || 0)) || (fits(b) - fits(a)) || (valueOf(b) - valueOf(a)));
  if (champs[0]) add.push({ c: champs[0], copies: 1, change: "port", why: "chosen champion (one copy, as 77% of winning lists run)" });
  // Signatures at 3 or none: 3 of the best one if it does something for this plan.
  const sig = uniq(idx.cards.filter((c) => legal(c) && idx.signatureOf(c) === champ)).sort((a, b) => fits(b) - fits(a) || valueOf(b) - valueOf(a))[0];
  if (sig && (fits(sig) || rolesOf(sig).some((r) => r.size >= 0.6)))
    add.push({ c: sig, copies: Math.min(SIG_MAX, /\[Unique\]/.test(sig.x || "") ? 1 : 3), change: "port", why: `signature at 3 (winning lists run 3 or none): ${fits(sig) ? "fits the plan" : `a strong ${ROLES[mainRole(sig)] || "card"}`}` });
  // The legend's engine payoffs, for the slots the shell's own package left.
  const need = () => 40 - rows.concat(add).reduce((a, r) => a + r.copies, 0);
  const payoffs = uniq(idx.cards.filter((c) => legal(c) && !has(c.n) && !add.some((a) => a.c.n === c.n) && !idx.signatureOf(c) && !passed(c)
    && !(c.t === "Unit" && idx.championOf(c) === champ) && engineTags(c).some((t) => t.role === "payoff" && keys.has(t.engine))))
    .sort((a, b) => ((ctx.own?.get(b.n) || 0) - (ctx.own?.get(a.n) || 0)) || ((ctx.quality?.get(b.n)?.rate || 0) - (ctx.quality?.get(a.n)?.rate || 0)) || (valueOf(b) - valueOf(a)));
  for (const c of payoffs) { if (need() <= 0) break; add.push({ c, copies: Math.min(need(), (c.e ?? 0) >= 5 ? 2 : 3), change: "port", why: `pays off ${[...keys].join("/")}, this legend's plan` }); }
  rows = rows.concat(add);
  add.length = 0;   // merged: need() must not count them twice
  // Back to 40: trim the shell's least-played kept cards, or top up from its flex.
  while (need() < 0) { const r = rows.filter((x) => x.change !== "port").sort((a, b) => a.inc - b.inc)[0]; if (!r) break; r.copies--; if (!r.copies) rows.splice(rows.indexOf(r), 1); }
  for (const f of (shell.con.flex || [])) { if (need() <= 0) break; const c = card(f.code); if (c && legal(c) && !theirs(c) && !has(c.n)) rows.push({ c, copies: Math.min(need(), 2), inc: f.inc, why: `from ${shell.name}'s flex (${Math.round(f.inc * 100)}%)` }); }
  // Still short: the cards players in these colours pick most, never another legend's own.
  const strong = uniq(idx.cards.filter((c) => legal(c) && !has(c.n) && !idx.signatureOf(c) && !theirs(c) && !passed(c) && ctx.quality?.get(c.n)?.rate != null))
    .sort((a, b) => ctx.quality.get(b.n).rate - ctx.quality.get(a.n).rate);
  for (const c of strong) { if (need() <= 0) break; rows.push({ c, copies: Math.min(need(), (c.e ?? 0) >= 5 ? 2 : 3), inc: 0, change: "port", why: `a strong card in these colours: ${Math.round(ctx.quality.get(c.n).rate * 100)}% of lists that can run it` }); }
  const swaps = suggestSwaps(rows.map((r) => ({ ...r, inc: r.inc ?? 1 })), { idx, legend: L, ...ctx, budget: 6 });
  return finish(L, idx, apply(rows, swaps, idx), extrasOf(shell.con, card), { ...meta, kind: "port", shell: shell.name, shellLists: shell.lists, cut: cut.map((r) => `${r.copies} ${r.c.n}`), swaps: [...swaps], more: swaps.more || [] });
}
