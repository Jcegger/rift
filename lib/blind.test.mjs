// The blind test: can the brew system, never shown a legend's lists, build something close
// to what that legend's winners actually play?
//
// For every legend with MIN placed lists: hide all of its lists from everything
// (scripts/build-brews.mjs makeBrewer({ hide })), build it as if nobody had played it —
// from its colours (lib/brew.mjs coloursBrew) — and count the copies it shares with the
// winners' real consensus, out of 40 — the build alone, before swaps (those deviate from
// current winners on purpose, and lib/swaps.test.mjs scores them). Against:
//   CEILING    two random halves of the legend's own winning lists, against each other:
//              winners mostly converge, so this is what a perfect guess could reach;
//   POPULAR    the colours' most-picked cards (per list), filled to 40 — whether any of this
//              beats plain popularity.
// History (19–20 Oct 2026): porting one same-colour legend's list scored 14.2 against a
// ceiling of 36.2 and popularity's 17.5 — worse than popularity — which is why the builder
// now builds from colours: per-legend card shares, its own package and plan (19.6). What
// did not help: weighting other legends by a plan read from card text (18.7) — text says
// what a deck does, not which cards winners choose for it.
// Run twice: reading the legend's plan from docs/archetypes.md (written with its lists in
// view, so a slight leak), and BLIND, from card text alone (lib/infer.mjs).
//
//   node lib/blind.test.mjs [legend substring]

import { readFileSync } from "node:fs";
import { makeBrewer } from "../scripts/build-brews.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const data = { cat: R("cards.json"), extras: R("extras.json"), banned: R("banned.json"), snap: R("decks.json"), R: R("research.json"),
  md: readFileSync(new URL("../docs/archetypes.md", import.meta.url), "utf8") };
const MIN = 10;
const only = (process.argv[2] || "").toLowerCase();
const full = makeBrewer(data);
const { idx, card } = full;
const MAIN = ["Unit", "Spell", "Gear"];

const mainOf = (cards) => { const m = new Map(); for (const [k, q] of Object.entries(cards)) { const c = card(k); if (c && MAIN.includes(c.t)) m.set(c.n, (m.get(c.n) || 0) + q); } return m; };
const shared = (a, b) => { let s = 0; for (const [n, q] of a) s += Math.min(q, b.get(n) || 0); return s; };
const conMain = (con) => mainOf(Object.fromEntries(con.main.map((r) => [r.code, r.copies])));
const rng = (seed) => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

const rows = [];
for (const [name, L] of full.legends) {
  if (only && !name.toLowerCase().includes(only)) continue;
  const a = full.anchorLists(name);
  if (!a || a.ds.length < MIN) continue;
  const truth = conMain(full.consensus(a.ds));
  // CEILING: split halves, five times.
  const r = rng(7); let ceil = 0;
  for (let i = 0; i < 5; i++) {
    const ds = a.ds.slice().sort(() => r() - 0.5), h = Math.floor(ds.length / 2);
    ceil += shared(conMain(full.consensus(ds.slice(0, h))), conMain(full.consensus(ds.slice(h)))) / 5;
  }
  const row = { name, lists: a.ds.length, ceiling: Math.round(ceil) };
  for (const [key, blindEngine] of [["doc", false], ["blind", true]]) {
    const h = makeBrewer({ ...data, hide: name, blindEngine });
    const b = h.brew(name, { noSwaps: true });
    if (b.kind === "none") { row[key] = null; continue; }
    row[key] = shared(mainOf(b.cards), truth);
    if (key === "doc") {
      // POPULAR: the colours' most-picked cards (from the lists that remain), 3 each.
      const ident = new Set((L.d || []).filter((d) => d !== "Colorless"));
      const pop = [...h.quality].filter(([n, q]) => q.rate != null && (() => { const c = idx.cards.find((x) => x.n === n && !x.v); return c && MAIN.includes(c.t) && (c.d || []).every((d) => d === "Colorless" || ident.has(d)) && !idx.signatureOf(c) && !idx.bannedNames.has(n); })())
        .sort((x, y) => y[1].rate - x[1].rate);
      const pm = new Map(); let n = 0;
      for (const [nm] of pop) { if (n >= 40) break; const q = Math.min(3, 40 - n); pm.set(nm, q); n += q; }
      row.popular = shared(pm, truth);
    }
  }
  rows.push(row);
}

const avg = (k) => { const xs = rows.map((x) => x[k]).filter((x) => x != null); return xs.length ? Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 10) / 10 : null; };
console.log("legend".padEnd(32), "lists", "ceiling", "built(doc)", "built(blind)", "popular");
for (const x of rows.sort((p, q) => q.lists - p.lists))
  console.log(x.name.slice(0, 31).padEnd(32), String(x.lists).padStart(5), String(x.ceiling).padStart(7), String(x.doc ?? "—").padStart(10), String(x.blind ?? "—").padStart(12), String(x.popular ?? "—").padStart(7));
console.log(`\naverage shared with the winners' consensus, of 40 — ceiling ${avg("ceiling")} · built, doc plan ${avg("doc")} · built, blind ${avg("blind")} · most popular ${avg("popular")}`);

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };
if (!only) {
  ok("a blind build beats the colours' most popular cards", avg("blind") > avg("popular"));
  ok("by at least a card on average", avg("blind") >= avg("popular") + 1);
}
console.log(failed ? `\n${failed} FAILED` : "\nblind test done");
process.exit(failed ? 1 : 0);
