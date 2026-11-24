// One worker of lib/match-pool.mjs: its slice of game indices (w, w + W, …), played with the same functions as a serial
// run. Kept out of match-pool.mjs because it imports scripts/state.mjs, which imports the pool: in one file that cycle
// deadlocks the worker's top-level await.
import { parentPort, workerData } from "node:worker_threads";
import { loadCatalog } from "../scripts/state.mjs";
import { matchPlayers, matchGame } from "./match.mjs";
import { closeGame } from "./turn.mjs";

const { kind, cards, foeLists, opts, w, W } = workerData;
const cat = await loadCatalog();
const { me, them } = matchPlayers({ cards }, cat, foeLists);
const out = [];
for (let i = w; i < opts.games && them.length; i += W) {
  if (kind === "match") out.push(matchGame(me, them, i, opts)); else out.push(...closeGame(me, them, i, opts));
}
parentPort.postMessage(out);
