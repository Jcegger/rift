// Model games on every core (Node only; the browser never loads this). Each worker loads the catalog, builds the
// players once and plays the game indices the pool hands it with lib/match.mjs matchGame or lib/turn.mjs closeGame. A game's
// result depends only on its index (its seed, its foe, who goes first), so a pooled run equals the serial one, record
// for record; lib/match.test.mjs checks it.
//
//   const R = await matchReportPar(deck, cat, foes, { games: 200 });   // same shape as matchReport
//   const C = await closeReportPar(deck, cat, foes, { games: 200 });    // same shape as closeReport

import { Worker } from "node:worker_threads";
import { availableParallelism } from "node:os";
import { matchPlayers, matchGame, matchAggregate } from "./match.mjs";
import { closeReport, closeAggregate } from "./turn.mjs";

// RIFT_WORKERS caps the pool (1 = serial). Default: half the logical cores (hyperthreads share a core, and timing on a
// 56-thread box was no faster past ~16 per pool), at most one per game.
export function poolSize(games) {
  const cap = Number(process.env.RIFT_WORKERS) || Math.max(1, Math.min(16, Math.floor(availableParallelism() / 2)));
  return Math.max(1, Math.min(cap, games));
}

// A queue, not fixed slices: games run 0.4 to 8 s, so each worker asks for the next index when it finishes one.
async function runPool(kind, deck, foeLists, opts) {
  const W = poolSize(opts.games - (opts.start || 0));
  let next = opts.start || 0;
  const out = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise((res, rej) => {
    const wk = new Worker(new URL("./match-worker.mjs", import.meta.url), { workerData: { kind, cards: deck.cards, foeLists: foeLists.map((d) => ({ label: d.label, cards: d.cards })), opts } });
    const feed = () => { if (next < opts.games) wk.postMessage(next++); else wk.postMessage(null); };
    wk.on("message", (m) => { if (m === "ready") return feed(); out.push(...m); feed(); });
    wk.once("error", rej);
    wk.once("exit", (code) => (code ? rej(new Error(`match-pool worker ${w} exited ${code}`)) : res()));
  })));
  return out;
}

export async function matchReportPar(deck, cat, foeLists, opts = {}) {
  return matchAggregate(await matchRecordsPar(deck, cat, foeLists, opts));
}
// The per-game records for games [start, games): a search plays more games for the candidates still in, and appends.
export async function matchRecordsPar(deck, cat, foeLists, opts = {}) {
  const o = { games: 400, start: 0, ...opts };
  if (o.games <= o.start) return [];
  if (poolSize(o.games - o.start) === 1) { const { me, them } = matchPlayers(deck, cat, foeLists, o.like); const out = []; for (let i = o.start; i < o.games && them.length; i++) out.push(matchGame(me, them, i, o)); return out; }
  return runPool("match", deck, foeLists, o);
}
export async function closeReportPar(deck, cat, foeLists, opts = {}) {
  const o = { games: 200, ...opts };
  if (poolSize(o.games) === 1) return closeReport(deck, cat, foeLists, o);
  return closeAggregate(await runPool("close", deck, foeLists, o), o);
}

