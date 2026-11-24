// Model games on every core (Node only; the browser never loads this). Each worker loads the catalog, builds the
// players once and plays its slice of game indices with lib/match.mjs matchGame or lib/turn.mjs closeGame. A game's
// result depends only on its index (its seed, its foe, who goes first), so a pooled run equals the serial one, record
// for record; lib/match.test.mjs checks it.
//
//   const R = await matchReportPar(deck, cat, foes, { games: 200 });   // same shape as matchReport
//   const C = await closeReportPar(deck, cat, foes, { games: 200 });    // same shape as closeReport

import { Worker } from "node:worker_threads";
import { availableParallelism } from "node:os";
import { matchReport, matchAggregate } from "./match.mjs";
import { closeReport, closeAggregate } from "./turn.mjs";

// RIFT_WORKERS caps the pool (1 = serial). Default: every core but one, at most one per game.
export function poolSize(games) {
  const cap = Number(process.env.RIFT_WORKERS) || Math.max(1, availableParallelism() - 1);
  return Math.max(1, Math.min(cap, games));
}

async function runPool(kind, deck, foeLists, opts) {
  const W = poolSize(opts.games);
  const jobs = Array.from({ length: W }, (_, w) => new Promise((res, rej) => {
    const wk = new Worker(new URL("./match-worker.mjs", import.meta.url), { workerData: { kind, cards: deck.cards, foeLists: foeLists.map((d) => ({ label: d.label, cards: d.cards })), opts, w, W } });
    wk.once("message", res); wk.once("error", rej);
    wk.once("exit", (code) => { if (code) rej(new Error(`match-pool worker ${w} exited ${code}`)); });
  }));
  return (await Promise.all(jobs)).flat();
}

export async function matchReportPar(deck, cat, foeLists, opts = {}) {
  const o = { games: 400, ...opts };
  if (poolSize(o.games) === 1) return matchReport(deck, cat, foeLists, o);
  return matchAggregate(await runPool("match", deck, foeLists, o));
}
export async function closeReportPar(deck, cat, foeLists, opts = {}) {
  const o = { games: 200, ...opts };
  if (poolSize(o.games) === 1) return closeReport(deck, cat, foeLists, o);
  return closeAggregate(await runPool("close", deck, foeLists, o), o);
}

