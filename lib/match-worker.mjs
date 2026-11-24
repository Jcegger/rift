// One worker of lib/match-pool.mjs: it plays the game indices the pool sends, one at a time, with the same functions as a
// serial run, and exits on null. Kept out of match-pool.mjs because it imports scripts/state.mjs, which imports the pool:
// in one file that cycle deadlocks the worker's top-level await.
import { parentPort, workerData } from "node:worker_threads";
import { loadCatalog } from "../scripts/state.mjs";
import { matchPlayers, matchGame } from "./match.mjs";
import { closeGame } from "./turn.mjs";

const { kind, cards, foeLists, opts } = workerData;
const cat = await loadCatalog();
const { me, them } = matchPlayers({ cards }, cat, foeLists, opts.like);
parentPort.on("message", (i) => {
  if (i == null || !them.length) { parentPort.close(); return; }
  parentPort.postMessage(kind === "match" ? [matchGame(me, them, i, opts)] : closeGame(me, them, i, opts));
});
parentPort.postMessage("ready");
