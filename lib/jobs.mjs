// What a card does for a deck, read from its compiled text (lib/cardtext.mjs), never from regexes
// over the raw text. A card can hold several jobs (Ezreal, Prodigy: a mid unit that draws).
// Used by `rift pool` (candidates by job) and `rift identity` (a list's copies by job).
//
// These are the jobs docs/deckbuilding-theory.md counts: early plays, interaction (removal, bounce,
// stun, counter), card flow, and the plan's pieces (move, pump, ramp). "theirTurn" is a tag, not a
// job: an interaction or pump card with Reaction, Action or Hidden, the same cards the goldfish
// counts as "an answer usable on their turn" (lib/decklab.mjs answerNames). Which jobs a deck
// needs, and how many, is the identity's call.

import { compile } from "./cardtext.mjs";

export const JOBS = {
  "early-unit": "unit costing 2 or less: a play on turns 1–3",
  "mid-unit": "unit costing 3–4",
  "top-unit": "unit costing 5+",
  removal: "kills, damages, fights or banishes an enemy unit",
  bounce: "returns an enemy unit to hand",
  stun: "stuns",
  counter: "counters a spell",
  draw: "draws or returns cards to hand",
  move: "moves or readies a friendly unit",
  pump: "adds Might or keywords",
  token: "makes units",
  ramp: "adds Energy or Power, or cuts costs",
  gear: "gear",
};
export const INTERACTION = new Set(["removal", "bounce", "stun", "counter"]);

const REMOVAL = new Set(["kill", "damage", "banish", "fight", "edict", "splitKill", "takeControl", "duel", "edictThere", "theirEdict", "possess", "swing"]);
const BOUNCE = new Set(["bounce", "bounce2", "returnAll", "bounceTotal"]);
const MOVE = new Set(["move", "ready", "redeploy", "swapPlaces", "grantReady", "readyUpTo", "nextUnitReady", "nextUnitAnywhere", "readyLegend"]);
const PUMP = new Set(["might", "buff", "keyword", "empower", "buffPlus", "multiBuff", "swap"]);
const RAMP = new Set(["add", "channel", "gold", "readyRunes", "costLess", "spellsCostLess", "gearCostLess", "discountNext", "powerToEnergy", "energyToPower"]);
const DRAW = new Set(["trashToHand", "fromTrash"]);

function opsOf(compiled) {
  const out = [];
  const walk = (e) => {
    if (!e || typeof e !== "object") return;
    if (Array.isArray(e)) { e.forEach(walk); return; }
    if (e.op) out.push(e);
    for (const v of Object.values(e)) if (v && typeof v === "object") walk(v);
  };
  walk(compiled);
  return out;
}

// → { jobs: Set, theirTurn: bool }
export function jobsOf(card) {
  const jobs = new Set();
  if (!card) return { jobs, theirTurn: false };
  if (card.t === "Unit") jobs.add((card.e ?? 0) <= 2 ? "early-unit" : (card.e ?? 0) <= 4 ? "mid-unit" : "top-unit");
  if (card.t === "Gear") jobs.add("gear");
  let k = null;
  try { k = compile(card); } catch { k = null; }
  for (const e of k ? opsOf(k) : []) {
    const side = e.target?.side;
    if (REMOVAL.has(e.op) && side !== "friendly") jobs.add("removal");
    else if (BOUNCE.has(e.op) && side !== "friendly") jobs.add("bounce");
    else if (e.op === "stun") jobs.add("stun");
    else if (e.op === "counter") jobs.add("counter");
    else if ((e.op === "noTurn" && e.why === "draw") || DRAW.has(e.op)) jobs.add("draw");
    else if (MOVE.has(e.op) && side !== "enemy") jobs.add("move");
    else if (PUMP.has(e.op) && side !== "enemy" && !(e.op === "might" && e.n < 0)) jobs.add("pump");
    else if (e.op === "token") jobs.add("token");
    else if (RAMP.has(e.op)) jobs.add("ramp");
  }
  // Bounce of a friendly and an enemy together (Star-Crossed) is still an answer.
  if (k && opsOf(k).some((e) => e.op === "bounce2")) jobs.add("bounce");
  const kw = k?.keywords || {};
  const theirTurn = card.t !== "Unit" && !!(kw.Reaction || kw.Action || kw.Hidden) && [...jobs].some((j) => INTERACTION.has(j) || j === "pump");
  return { jobs, theirTurn };
}
