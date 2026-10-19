// Counting a set of decklists into the list they add up to: how many lists play each
// card and in how many copies, then the deck those counts make. Shared by
// scripts/build-ideas.mjs (the Radiance-era consensus) and scripts/build-archetypes.mjs
// (each legend's representative list). Moved here unchanged from build-ideas.mjs.
//
//   const { tally, consensus } = counter(idx, card)
//   idx: lib/decks.mjs indexCatalog · card: code -> catalog card (resolving short codes)

import { deckStats, deckChecks, unlimitedCopies, MAX_COPIES } from "./decks.mjs";

const round = (x) => Math.round(x * 100) / 100;

export function counter(idx, card) {
  /* ── counting a set of lists ───────────────────────────────────────────── */
  // identity -> { lists containing it, copies per list, which printings }
  function tally(lists) {
    const t = new Map();
    for (const d of lists) {
      const per = new Map();
      for (const [code, q] of Object.entries(d.cards)) {
        const c = card(code);
        if (!c || c.t === "Legend") continue;
        const id = idx.identity(c);
        const e = per.get(id) || { c, q: 0, codes: {} };
        e.q += q; e.codes[c.c] = (e.codes[c.c] || 0) + q;
        per.set(id, e);
      }
      for (const [id, e] of per) {
        const x = t.get(id) || { id, type: e.c.t, name: e.c.n, lists: 0, copies: [], codes: {} };
        x.lists++; x.copies.push(e.q);
        for (const [k, n] of Object.entries(e.codes)) x.codes[k] = (x.codes[k] || 0) + n;
        t.set(id, x);
      }
    }
    for (const x of t.values()) {
      // The printing most lists cite, preferring the base one on a tie.
      x.code = Object.entries(x.codes).sort((a, b) => b[1] - a[1] || (card(a[0]).v ? 1 : 0) - (card(b[0]).v ? 1 : 0))[0][0];
      const s = [...x.copies].sort((a, b) => a - b);
      x.median = s[Math.floor((s.length - 1) / 2)];
      x.avg = s.reduce((a, b) => a + b, 0) / s.length;
    }
    return t;
  }

  // The list the counts add up to: highest inclusion first at its median count, until
  // 40 main; runes split by the average count per rune, to 12; the 3 most-run
  // battlefields. Legend from the most common printing.
  function consensus(lists) {
    const t = tally(lists), n = lists.length;
    const rows = [...t.values()].map((x) => ({ ...x, inc: x.lists / n }));
    const mainRows = rows.filter((x) => x.type !== "Rune" && x.type !== "Battlefield").sort((a, b) => b.inc - a.inc || b.avg - a.avg || a.name.localeCompare(b.name));
    const cards = {};
    let main = 0;
    const out = [];
    for (const x of mainRows) {
      if (main >= 40) break;
      const q = Math.min(x.median, 40 - main, unlimitedCopies(card(x.code)) ? 40 : MAX_COPIES);
      if (q <= 0) continue;
      cards[x.code] = q; main += q;
      out.push({ code: x.code, name: x.name, type: x.type, inc: round(x.inc), lists: x.lists, copies: q, median: x.median });
    }
    const runeRows = rows.filter((x) => x.type === "Rune");
    const tot = runeRows.reduce((a, x) => a + x.copies.reduce((p, q) => p + q, 0) / n, 0) || 1;
    const share = runeRows.map((x) => ({ x, exact: 12 * (x.copies.reduce((p, q) => p + q, 0) / n) / tot }));
    let given = 0;
    for (const s of share) { s.q = Math.floor(s.exact); given += s.q; }
    for (const s of [...share].sort((a, b) => (b.exact - b.q) - (a.exact - a.q))) { if (given >= 12) break; s.q++; given++; }
    const runes = share.filter((s) => s.q > 0).map((s) => ({ code: s.x.code, name: s.x.name, copies: s.q, inc: round(s.x.lists / n) }));
    for (const r of runes) cards[r.code] = r.copies;
    const bfs = rows.filter((x) => x.type === "Battlefield").sort((a, b) => b.inc - a.inc || a.name.localeCompare(b.name)).slice(0, 3)
      .map((x) => ({ code: x.code, name: x.name, inc: round(x.inc), lists: x.lists }));
    for (const b of bfs) cards[b.code] = 1;
    const lgCount = {};
    for (const d of lists) lgCount[d.lg] = (lgCount[d.lg] || 0) + 1;
    const lg = card(Object.entries(lgCount).sort((a, b) => b[1] - a[1])[0][0]);
    cards[lg.c] = 1;
    const deck = { id: "consensus", name: "consensus", cards, sb: {} };
    const checks = deckChecks(deck, idx, deckStats(deck, idx, {})).filter((k) => k.ok !== true).map((k) => ({ label: k.label, val: k.val, ok: k.ok }));
    // Everything at 20% or more, beyond what made the 40: the flex a reader chooses from.
    const flex = mainRows.filter((x) => !(x.code in cards) && x.inc >= 0.2)
      .map((x) => ({ code: x.code, name: x.name, type: x.type, inc: round(x.inc), lists: x.lists, median: x.median }));
    return { from: n, legend: lg.c, main: out, runes, battlefields: bfs, flex, cards, checks };
  }

  return { tally, consensus };
}
