// What job a card does in a deck, and roughly how well for what it costs.
//
// docs/deckbuilding.md: winners swap a card for one doing the same job — 61% of cuts are
// replaced by the same type within one Energy — and a new set's cards come in by ROLE, not
// type (Trifarian Captain, a unit that digs a card, took Kennen's card-advantage slots from
// Salvage, a spell). So a swap is "a better card for this role", and that needs two
// things: the roles a card fills, and a rough value to compare two cards in one role.
//
// The value is a reading of the text, built to be argued with, not a rating:
// - each role is sized by what the text says (draw 2 > draw 1, 4 damage > 1, any unit >
//   a unit in a base);
// - a unit's body counts on top of its effects — a body plus a card beats a card alone,
//   which is most of why units with play effects replace spells;
// - Energy and Power are subtracted, Power more heavily: it costs the next turn's runes
//   (docs/fundamentals.md §4), so Captain at no Power beats Salvage at one.
//
// lib/swaps.mjs compares cards in a role with it; it is checked by a backtest against the
// Radiance previews (scripts/backtest-swaps.mjs), not tuned to taste.

import { plainText } from "./engines.mjs";

export const ROLES = {
  body: "an early body", threat: "a threat", draw: "card advantage", removal: "removal", sweep: "area damage", displace: "moving an enemy",
  counter: "a counter", trick: "a combat trick", protect: "protection", disrupt: "disruption", ramp: "ramp", move: "movement",
};

const num = (re, t, d = 1) => { const m = re.exec(t); return m ? Number(m[1]) || d : 0; };
const sentence = (t, re) => t.split(/(?<=[.!])\s+/).find((s) => re.test(s)) || null;

// card -> [{ role, size, why }]
export function rolesOf(c) {
  if (!c || !["Unit", "Spell", "Gear"].includes(c.t)) return [];
  const t = plainText(c), out = [];
  const add = (role, size, why) => { const r = out.find((x) => x.role === role); if (r) r.size = Math.max(r.size, size); else out.push({ role, size: Math.round(size * 100) / 100, why }); };
  // Card advantage: draws, digs, recursion. A loot (discard then draw) nets less.
  const draw = num(/\bdraw (\d+)/i, t) || (/\bdraw (a|one) card|\bdraw 1\b/i.test(t) ? 1 : 0);
  const loot = /\bdiscard \d[^.]*then draw|\bdiscard 1, then draw 1\b/i.test(t);
  if (draw) add("draw", loot ? Math.max(0.3, draw - num(/\bdiscard (\d+)/i, t)) * 0.6 : draw * 0.6 * (/\[deathknell\]/i.test(t) ? 0.8 : 1), loot ? "loots" : `draws ${draw}`);
  // A dig's "…and draw it" usually sits a sentence after "look at the top N" (Trifarian Captain).
  if (/\blook at the top \d+ cards?[\s\S]{0,220}?\b(draw (it|that|one)|into your hand|put (it|one) in your hand)/i.test(t)) add("draw", 0.6, "digs a card from the top");
  if (/\bfrom your trash\b[^.]*\b(play|return|into your hand)|\breturn[^.]*from your trash\b/i.test(t)) add("draw", 0.5, "buys back from the trash");
  // Removal, sized by damage and by where it reaches.
  const reach = /\bin a base\b/i.test(t) ? 0.7 : 1;
  const dmg = num(/\bdeal (\d+)(?: damage)? to (?:a|an|target|one|that)\b/i, t);
  if (dmg) add("removal", Math.min(1.2, dmg / 4) * reach, `deals ${dmg}`);
  if (/\bkill (a|an|target|that|another)? ?(enemy )?unit\b|\bbanish (a|an) (enemy )?unit\b/i.test(t)) add("removal", 1 * reach, "kills a unit");
  // A fight: Rampage's two units "deal damage equal to their Might to each other".
  if (/\bdeal damage equal to (its|their|my) mights?\b/i.test(t)) add("removal", 0.9, "makes a fight");
  if (/\bkill a gear\b|\bkill (a|an) (unit or gear|gear or unit)\b/i.test(t)) add("removal", 0.4, "kills a gear");
  // A bounce behind a condition ("if there are 4 or more units there") is removal some of the
  // time; returning your OWN unit as well (Star-Crossed) also saves it — protection.
  const bounce = sentence(t, /\breturn (a|an|target)? ?(enemy )?unit[^.]*\bhand\b|\breturn a friendly unit and an enemy unit\b|\breturn an enemy unit\b/i);
  if (bounce) add("removal", 0.7 * (/\bif\b|\bunless\b/i.test(bounce) ? 0.6 : 1), /\bif\b/i.test(bounce) ? "bounces a unit, on a condition" : "bounces a unit");
  if (/\breturn a friendly unit and an enemy unit\b|\breturn (a|your) friendly unit[^.]*\bhand\b/i.test(t)) add("protect", 0.4, "saves your own unit");
  if (/-\d+ might\b/i.test(t) && /\benemy|\ba unit\b/i.test(t)) add("removal", 0.5, "shrinks");
  const sweepDmg = num(/\bdeal (\d+)(?: damage)? to (?:each|all|every|each of up to \d+|up to \d+)\b/i, t);
  if (sweepDmg || /\b(each|all|every) enemy units?\b/i.test(t)) add("sweep", Math.max(0.6, Math.min(1.5, (sweepDmg || 2) / 2)), sweepDmg ? `deals ${sweepDmg} to several` : "hits every enemy unit");
  if (/\bcounter (a|that|the next) spell\b|\bcounter a spell\b/i.test(t)) add("counter", 0.9, "counters a spell");
  if (/\+(\d+) might this turn\b/i.test(t)) add("trick", Math.min(1.2, num(/\+(\d+) might this turn/i, t) / 3), `+${num(/\+(\d+) might this turn/i, t)} Might`);
  if (/\[stun\]|\bstun (a|an|up to|each|all|it)\b/i.test(t)) add("disrupt", 0.6, "stuns");
  if (/\breveal (their|your opponent'?s?) hand\b|\bthey reveal their hand\b|\bopponents? discards?\b/i.test(t)) add("disrupt", 0.5, "attacks the hand");
  if (/\bthe next time [^.]*would die\b|\brecall\b|\bcan'?t be chosen\b|\bprevent\b/i.test(t)) add("protect", 0.6, "protects a unit");
  if (/\[add\]|\bchannel \d+ runes?\b|\bready (up to )?\d+ runes\b/i.test(t)) add("ramp", 0.7, "ramps");
  // Moving an ENEMY (Charm, Faefolk's drag) is a fight-picking, removal-like job; moving your
  // own is tempo. Different jobs: one never stands in for the other.
  if (/\bmove (an|any number of|up to \w+) enemy units?\b|\bmove an enemy\b/i.test(t)) add("displace", 0.6, "moves an enemy");
  if (/\bmove (a|up to \w+|another|it|me|that|any number of) (friendly )?(unit|gear)s?\b|\bmove (it|me|them)\b/i.test(t)) add("move", 0.4, "moves your units");
  if (c.t === "Unit") {
    const e = Number(c.e) || 0;
    add(e >= 5 ? "threat" : "body", 0.3 + Math.max(0, ((Number(c.m) || 0) - e) * 0.2), `${c.m ?? 0} Might for ${e}`);
  }
  return out;
}

// One number: what the roles add up to, plus keywords and the body, minus what it costs.
export function valueOf(c) {
  const rs = rolesOf(c), t = plainText(c);
  let v = rs.reduce((a, r) => a + r.size, 0);
  if (/\bchoose one\b/i.test(t)) v += 0.25;                         // modal: right more often
  if (/\[accelerate\]|\benters? ready\b/i.test(t)) v += 0.3;
  if (/\[deflect/i.test(t)) v += 0.25;
  if (/\[ganking\]/i.test(t)) v += 0.15;
  if (/\[hidden\]/i.test(t)) v += 0.2;                              // flexible: now or later, for 1 Power
  if (/\[repeat\]/i.test(t)) v += 0.2;
  if (c.t === "Unit") v += (Number(c.m) || 0) * 0.15;
  // "I cost [2] less" (Noxus Hopeful's Legion): usually met, so most of the discount counts.
  const less = /\bi cost \[(\d+)\] less\b/i.exec(t);
  if (less) v += Number(less[1]) * 0.15 * 0.7;
  return Math.round((v - (Number(c.e) || 0) * 0.15 - (Number(c.p) || 0) * 0.35) * 100) / 100;
}

// The role a card mainly fills: its biggest, with a body as the fallback for units.
export const mainRole = (c) => { const rs = rolesOf(c).filter((r) => !["body", "threat"].includes(r.role) || rolesOf(c).length === 1); return (rs.sort((a, b) => b.size - a.size)[0] || rolesOf(c)[0])?.role || null; };

// Whether the roles above account for what a card does. A unit read only as a body, or a
// card read as nothing, whose text has an ability anyway (Rhasa's cost that shrinks with the
// trash, Fizz casting from the trash, Matriarch's replay, Ambush), is NOT understood — and a
// card we cannot read cannot be said to be outdone (lib/swaps.mjs protects it).
export function understood(c) {
  const rest = plainText(c).replace(/\[[A-Za-z][^\]]*\]/g, " ").replace(/\s+/g, " ").trim();   // keywords out, costs kept
  const real = rolesOf(c).filter((r) => !["body", "threat"].includes(r.role));
  return real.length > 0 || rest.length < 25;
}

// How fast a card can be played: a replacement must be at least as fast as what it replaces.
// A Reaction works mid-fight; a unit never does — the swaps that crossed types in the
// Radiance previews replaced turn-speed cards (Salvage, Progress Day), never Reactions.
// [Hidden] is Reaction speed ("react with later"), as is [Ambush].
export const SPEED = { turn: 0, action: 1, reaction: 2 };
export function speedOf(c) {
  const t = String(c?.x || "");
  if (/\[(reaction|hidden|ambush)\]/i.test(t)) return "reaction";
  if (/\[action\]/i.test(t)) return "action";
  return "turn";
}
