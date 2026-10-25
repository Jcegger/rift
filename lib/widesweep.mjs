// One slot against every legal card: `scripts/rift try --sweep "<card>" --with all`.
//
// Each candidate replaces the slot in a copy of the deck, and the copy plays the same paired
// games against the field as the deck does (lib/match.mjs), so the difference in point margin
// at turn 8 is the change alone, with its standard error. Candidates are every card the deck
// could legally run (the app's checks after the swap), never one running Dazzling Aurora
// (lib/avoid.mjs). Spread over worker threads; each thread loads the catalogue itself.

import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { availableParallelism } from "node:os";
import { matchReport } from "./match.mjs";
import { applyChanges, parseChanges } from "./decklab.mjs";
import { deckChecks } from "./decks.mjs";
import { NEVER_PLAY } from "./avoid.mjs";

const paired = (base, rep) => {
  const d = rep.diff.map((x, i) => x - base.diff[i]), n = d.length, m = d.reduce((s, x) => s + x, 0) / n;
  const sd = Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, n - 1));
  return { margin: m, se: sd / Math.sqrt(n) };
};

// Every card name the deck could take `qty` of in place of `card`.
export function candidatesFor(deck, cat, card, qty) {
  const names = [...new Set(cat.cards.filter((c) => /Unit|Spell|Gear/.test(c.t) && c.v !== "token" && typeof c.e === "number" && !NEVER_PLAY.has(c.n)).map((c) => c.n))];
  const out = [];
  for (const n of names) {
    if (n === card) continue;
    let after;
    try { after = applyChanges(deck, parseChanges([`-${qty} ${card}`, `+${qty} ${n}`], cat.cards), cat.cards, cat.BY); } catch { continue; }
    if (deckChecks(after, cat.idx).some((x) => x.ok === false)) continue;
    out.push(n);
  }
  return out;
}

async function runChunk({ deck, foes, games, items, catalogUrl }) {
  const { loadCatalog } = await import(catalogUrl);
  const cat = await loadCatalog();
  const base = matchReport(deck, cat, foes, { games });
  const rows = [];
  for (const it of items) {
    const after = applyChanges(deck, parseChanges(it.specs, cat.cards), cat.cards, cat.BY);
    const rep = matchReport(after, cat, foes, { games });
    rows.push({ name: it.label, slot: it.slot, cand: it.cand, ...paired(base, rep), points8: rep.points8, theirPoints8: rep.theirPoints8, stops: rep.stops, eve: rep.eve });
  }
  return { base: { points8: base.points8, theirPoints8: base.theirPoints8, stops: base.stops, eve: base.eve }, rows };
}

// Run change items ({ label, specs }) on worker threads against the deck, paired.
async function runItems({ deck, foes, games, items, threads, catalogUrl, onProgress }) {
  const chunks = Array.from({ length: Math.min(threads, items.length) }, (_, i) => items.filter((_, j) => j % threads === i));
  let done = 0;
  const slim = { cards: deck.cards, sideboard: deck.sideboard, name: deck.name, legend: deck.legend, battlefields: deck.battlefields, champion: deck.champion };
  const results = await Promise.all(chunks.map((chunk) => new Promise((res, rej) => {
    const w = new Worker(new URL(import.meta.url), { workerData: { deck: slim, foes, games, items: chunk, catalogUrl } });
    w.on("message", (m) => { done += m.rows.length; onProgress?.(done, items.length); res(m); });
    w.on("error", rej);
  })));
  return { base: results[0]?.base, rows: results.flatMap((r) => r.rows).sort((a, b) => b.margin - a.margin) };
}

export async function wideSweep({ deck, cat, card, qty, foes, games = 2400, threads = Math.max(1, availableParallelism() - 1), catalogUrl, onProgress }) {
  const names = candidatesFor(deck, cat, card, qty);
  const items = names.map((n) => ({ label: n, slot: card, cand: n, specs: [`-${qty} ${card}`, `+${qty} ${n}`] }));
  const r = await runItems({ deck, foes, games, items, threads, catalogUrl, onProgress });
  return { ...r, candidates: names.length, games };
}

// Many slots × many candidates, one copy each: every legal "-1 slot +1 candidate".
export async function gridSweep({ deck, cat, slots, cands, foes, games = 1200, threads = Math.max(1, availableParallelism() - 1), catalogUrl, onProgress }) {
  const items = [];
  for (const slot of slots) for (const cand of cands) {
    if (slot === cand) continue;
    const specs = [`-1 ${slot}`, `+1 ${cand}`];
    let after;
    try { after = applyChanges(deck, parseChanges(specs, cat.cards), cat.cards, cat.BY); } catch { continue; }
    if (deckChecks(after, cat.idx).some((x) => x.ok === false)) continue;
    items.push({ label: `${slot} → ${cand}`, slot, cand, specs });
  }
  const r = await runItems({ deck, foes, games, items, threads, catalogUrl, onProgress });
  return { ...r, pairs: items.length, games };
}

if (!isMainThread && workerData?.items) runChunk(workerData).then((m) => parentPort.postMessage(m));
