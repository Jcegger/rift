// The turn solver: can this board win this turn? `scripts/rift close`, and `try --close`.
//
// Layer 2 of the three testing layers (README, "What the bench is"). The goldfish (lib/sim.mjs)
// can't see attacks or points; the whole-game model (lib/match.mjs) plays a greedy policy that
// attacks only where one fight wins. This searches our whole Main Phase from a position, both
// battlefields, every order of plays, and resolves each combat with lib/fight.mjs (both sides'
// best line with their tricks, face-down cards and the budget they kept open). It reports the
// best line and whether it wins: never a win rate.
//
// The rules it plays (docs/rules.md; docs/rules-rulings.md "Turn solver premises"):
//   - Hold points first (§315.2.b.2): each battlefield we control at the start scores 1.
//   - Standard Move (§144): ready units, exhausted as the cost; several to one destination are
//     one move (§144.3). Base → battlefield; battlefield → battlefield only with Ganking (§810).
//   - Arriving where the enemy is makes a combat with every unit there (§466.2.c.3); the side
//     whose arrival contested it attacks (§466.2.c.1). Losing attackers go back to base (§468.1.a.2).
//     Arriving at an empty battlefield conquers it once the showdown closes (§348.2.a); their
//     Reactions can still answer the unit (fight() with no defenders).
//   - Conquer: 1 point per battlefield per turn (§471, §472). At 7+, the conquest's point needs
//     every battlefield scored this turn, else draw 1 (§473.1.b.1). We win with 8+ and strictly
//     more than them (§194.2).
//   - Power spent this turn counts toward Sivir, Mercenary's two (hides, Accelerate, Gold: the
//     Mercenary ruling). Gold made this turn enters exhausted and adds nothing until it readies
//     (§415.4), so Battle Mistress's and Pyke's Gold are not part of the turn.
//   - Their counters (Defy) answer our main-phase spells when they can pay; they choose whether to.
// Simplified: one combat's Might is fixed when it starts (Power spent inside a fight doesn't turn
// Mercenary on mid-fight); a unit bounced in a fight is gone, not replayable; Tideturner's swap
// is read by fight() but where the swapped unit ends up isn't tracked.

import { effectsOf, keywordOf, withGear } from "./versus.mjs";
import { engineOf } from "./sim.mjs";
import { fight } from "./fight.mjs";
import { compile, engineReads, condKind, perKnown } from "./cardtext.mjs";

export const MERC = /spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have \+(\d+) :rb_might: and \[Ganking\]/i;
export const READY_ALL = /^ready your units\.?$/im;                                        // On the Hunt
export const MOVE_READY = /move a friendly unit and ready it/i;                             // Ride the Wind
export const MOVE_PULL = /when i move to a battlefield, you may move an enemy unit to that battlefield/i; // Irresistible Faefolk
const EQUIP = /\[Equip\] :rb_rune_(\w+):/i;
const ACCEL = /\[Accelerate\]/i;
const BLAST = /deal damage equal to my might to all enemy units here/i;
// Each reader and the card it was written for (lib/turn.test.mjs holds them to the real text).
export const TURN_READERS = { MERC: [MERC, "Sivir, Mercenary"], READY_ALL: [READY_ALL, "On the Hunt"],
  MOVE_READY: [MOVE_READY, "Ride the Wind"], MOVE_PULL: [MOVE_PULL, "Irresistible Faefolk"], EQUIP: [EQUIP, "Boots of Swiftness"] };

const isUnit = (c) => /Unit/.test(c?.t || "");
const isSpell = (c) => /Spell/.test(c?.t || "");
const quick = (c) => /\[Reaction\]|\[Action\]/i.test(c.x || "");
const fx = (c) => (c._fx ??= effectsOf(c));
const TRICK = new Set(["pump", "minus", "swap", "stun", "bounce", "kill", "damage"]);
const trick = (c) => !isUnit(c) && fx(c).some((e) => TRICK.has(e.kind) && !e.needsFour && !e.equip);
const counterOf = (c) => fx(c).find((e) => e.kind === "counter");
const stops = (k, c) => (k.maxE != null ? (c.e || 0) <= k.maxE && (c.p || 0) <= (k.maxP ?? 99) : k.tax == null);
// Main-phase removal: one enemy unit at a battlefield.
const removalOf = (c) => isSpell(c) && fx(c).find((e) => (e.kind === "bounce" && !e.needsFour && !e.needsFriendly) || e.kind === "kill" || e.kind === "fight" || (e.kind === "damage" && !e.split && !e.many));
const dom = (c) => (c.d || [])[0] || "rainbow";

let ids = new WeakMap(), nextId = 0;
const idOf = (o) => { if (!ids.has(o)) ids.set(o, ++nextId); return ids.get(o); };

// ── what the solver reads: a card is read when every sentence of its text is one it plays ──
const READ_LINES = [MERC, MOVE_PULL, BLAST, /i don'?t deal combat damage/i, /if there are 4 or more units there, you may return an enemy unit there/i, /^when i (attack|defend|attack or defend), deal damage equal to my might to an enemy unit here/i];
const strip = (x) => String(x || "").replace(/\([^)]*\)/g, "").replace(/\[[A-Za-z' ]+(?: \d+)?\]/g, "").replace(/:rb_\w+:/g, "").trim();
// Whether the solver plays this card's text: lib/cardtext.mjs's compiler and the executor here.
// Their units in hand are never played by the solver (an Ambush into a fight isn't modelled).
export function turnReads(card, { inTheirHand = false } = {}) {
  if (!card) return false;
  if (inTheirHand && isUnit(card)) return !strip(card.x);
  return engineReads(card).ok;
}
export function turnBlindSpots(pos) {
  const out = new Set();
  for (const u of pos.units || []) if (!turnReads(u.card)) out.add(u.card.n);
  for (const c of [...(pos.hand || []), ...(pos.champ ? [pos.champ] : []), ...(pos.gear || [])]) if (!turnReads(c)) out.add(c.n);
  for (const c of pos.their?.hand || []) if (!turnReads(c, { inTheirHand: true })) out.add(c.n);
  for (const b of pos.down || []) for (const side of b) for (const c of side) if (!turnReads(c)) out.add(c.n);
  return [...out].sort();
}

// ── state ──
const clone = (s) => ({ ...s, units: s.units.map((u) => ({ ...u, gear: u.gear.slice() })), ctrl: s.ctrl.slice(), scored: s.scored.slice(), theirScored: s.theirScored.slice(),
  score: s.score.slice(), down: s.down.map((b) => [b[0].slice(), b[1].slice()]), hand: s.hand.slice(), gear: s.gear.slice(),
  runes: s.runes.map((r) => ({ ...r })), their: { ...s.their, hand: s.their.hand.slice(), budget: { ...s.their.budget } }, log: s.log.slice(), used: s.used.slice(),
  pool: s.pool.map((x) => ({ ...x })), gearUsed: s.gearUsed.slice(), hidNow: s.hidNow.slice() });
const BF = ["A", "B"];
const where = (at) => (at < 0 ? "base" : BF[at]);
// A unit as it is now: printed Might with gear, this turn's bonuses, its statics (Sivir, Mercenary's
// +2 and Ganking once 2 Power is spent), other friendly units' auras, granted keywords, and the
// stun and damage it carries into a fight.
const staticOn = (s, u, st) => !st.cond || (typeof st.cond === "object" ? (st.cond.spentPower == null || (u.side === 0 && s.spent >= st.cond.spentPower)) : condMet(s, st.cond, { src: u, side: u.side }));
const effCard = (s, u) => {
  const c = withGear(u.card, u.gear);
  let m = (c.m || 0) + (u.bonus || 0);
  const kw = [...(u.kw || [])];
  for (const st of compile(u.card).statics) {
    if ((st.per && !perKnown(st.per)) || !staticOn(s, u, st)) continue;
    if (st.op === "myMight") { m += st.n * (st.per ? perCount(s, u, st.per) : 1); if (st.keyword) kw.push(`[${st.keyword}]`); for (const k of st.keywords || []) kw.push(`[${k}]`); }
    if (st.op === "myKeywords") for (const k of st.keywords || []) kw.push(`[${k}]`);
  }
  for (const v of s.units) if (v !== u && v.uid !== u.uid && v.side === u.side) for (const st of compile(v.card).statics) {
    if (st.op === "aura" && !st.tag && (!st.here || v.at === u.at) && staticOn(s, v, st)) m += st.n;
    if (st.op === "auraKeyword" && (!st.here || v.at === u.at) && staticOn(s, v, st)) for (const k of st.keywords) kw.push(`[${k}]`);
  }
  return { ...c, m, x: [c.x || "", ...kw].filter(Boolean).join("\n"), _stunned: !!u.stunned, _dmg: u.dmg || 0, _prevent: u.prevent || 0 };
};
// "For each …" on the board (cardtext PER_KINDS).
function perCount(s, u, per) {
  const p = String(per).trim().toLowerCase(), mine = s.units.filter((v) => v.side === u.side && v.uid !== u.uid);
  if (/^other unit you control here with my name/.test(p)) return mine.filter((v) => v.at === u.at && v.card.n === u.card.n).length;
  if (/^other (?:unit you control|friendly unit) here/.test(p)) return mine.filter((v) => v.at === u.at).length;
  if (/^friendly gear/.test(p)) return u.side === 0 ? s.gear.length + s.units.filter((v) => v.side === 0).reduce((a, v) => a + v.gear.length, 0) : 0;
  if (/^token unit you control/.test(p)) return mine.filter((v) => v.card.token).length + (u.card.token ? 1 : 0);
  if (/^other exhausted unit you control/.test(p)) return mine.filter((v) => !v.ready).length;
  if (/^enemy unit here/.test(p)) return s.units.filter((v) => v.side !== u.side && v.at === u.at).length;
  return 0;
}
const ganks = (s, u) => !u.noMove && keywordOf(effCard(s, u).x, "Ganking").always > 0;
const ours = (s, at) => s.units.filter((u) => u.side === 0 && (at === undefined || u.at === at));
const theirs = (s, at) => s.units.filter((u) => u.side === 1 && (at === undefined || u.at === at));

// Paying, as lib/match.mjs pays: Energy from ready runes (not the Power colour first), Power from
// ready Gold, then recycling runes of that colour (exhausted ones first, so no Energy is lost).
function pay(s, e, d, q, spell = false) {
  const fromExtra = Math.min(s.extraE || 0, e); s.extraE -= fromExtra; e -= fromExtra;
  // Added Power first ([Add] from Seal of Discord and the like; "use only to play spells" only on a spell).
  for (let i = s.pool.length - 1; i >= 0 && q > 0; i--) { const x = s.pool[i]; if ((x.spellsOnly && !spell) || (d !== "rainbow" && x.d !== d && x.d !== "A")) continue; s.pool.splice(i, 1); q--; s.spent++; }
  const ready = s.runes.filter((r) => r.ready).sort((a, b) => (a.d === d) - (b.d === d));
  if (ready.length < e) return false;
  for (let i = 0; i < e; i++) ready[i].ready = false;
  const gold = Math.min(s.gold, q); let need = q - gold;
  const pool = s.runes.filter((r) => d === "rainbow" || r.d === d || r.d === "?").sort((a, b) => a.ready - b.ready);
  if (pool.length < need) return false;
  for (const r of pool) { if (!need) break; s.runes.splice(s.runes.indexOf(r), 1); need--; }
  s.gold -= gold; s.spent += q;
  return true;
}
const budgetOf = (s) => ({ e: s.runes.filter((r) => r.ready).length + (s.extraE || 0), p: s.gold + s.runes.length + s.pool.length });

function score(s, b, side) {
  const scored = side === 0 ? s.scored : s.theirScored;
  if (scored.includes(b)) return;
  scored.push(b);
  if (s.score[side] >= 7 && scored.length < 2) { if (side === 0) { s.drew++; s.log.push(`  ${BF[b]} conquered at 7: the 8th point needs both battlefields scored (§473.1.b.1), so you draw instead`); } return; }
  s.score[side]++;
  if (side === 0) s.conquers++;
  s.log.push(`  ${side === 0 ? "you" : "they"} conquer ${BF[b]} → ${s.score[side]}`);
}
const won = (s) => s.score[0] >= 8 && s.score[0] > s.score[1];

// A combat (or an uncontested arrival) at b. attacker: 0 us, 1 them.
function resolveAt(s, b, attacker, memo) {
  const us = ours(s, b), them = theirs(s, b);
  if (!us.length && !them.length) return;
  if (!them.length && s.ctrl[b] === 0) return;
  if (!us.length) return;   // their units arriving where we have none: not on our turn
  const map = new Map();
  const us1 = ours(s, b), them1 = theirs(s, b);
  if (!us1.length || (!them1.length && them.length)) { if (us1.length && !them1.length && s.ctrl[b] !== 0) { s.ctrl[b] = 0; s.down[b][1] = []; score(s, b, 0); } return; }
  us.splice(0, us.length, ...us1); them.splice(0, them.length, ...them1);
  const mine = us.map((u) => { const c = effCard(s, u); map.set(c, u); return c; });
  const foes = them.map((u) => { map.set(u.card, u); return u.card; });
  // Attack and defend triggers the fight calculator doesn't play itself (it plays the blast and
  // Disarm): run first, on the strongest target (a heuristic, not a search).
  for (const [side, us2] of [[attacker, attacker === 0 ? us : them], [1 - attacker, attacker === 0 ? them : us]]) for (const u of us2) {
    const role = side === attacker ? "attack" : "defend";
    for (const a of compile(u.card).abilities.filter((x) => (x.trigger === role || x.trigger === "attackOrDefend") && !(x.effects || []).every((e) => e.op === "damage" && e.n === "myMight" && e.target?.who === "each"))) runAbility(s, a, { side, src: u, here: b }, memo, true);
  }
  const ambush = (c) => isUnit(c) && /\[Ambush\]|can be played to a battlefield you're attacking/i.test(c.x || "");
  const ourHand = s.hand.filter((c) => (quick(c) && trick(c)) || (ambush(c) && attacker === 0 ? /attacking|\[Ambush\]/i.test(c.x || "") : ambush(c)));
  const theirHand = s.their.locked ? [] : s.their.hand.filter((c) => (quick(c) && trick(c)) || ambush(c));
  // Elder Dragon anywhere on a side: that side's damage kills any enemy unit it reaches.
  const killsFor = (side) => s.units.some((u) => u.side === side && compile(u.card).statics.some((x) => x.op === "anyDamageKills"));
  const ourSide = { units: mine, hand: ourHand, budget: budgetOf(s), anyDamageKills: killsFor(0) };
  const theirSide = { units: foes, hand: theirHand, budget: { ...s.their.budget }, anyDamageKills: killsFor(1) };
  let r;
  const key = `F|${b}|${attacker}|${mine.map((c) => `${idOf(map.get(c))}:${c.m}`).join(",")}|${foes.map(idOf).join(",")}|${ourHand.map(idOf).join(",")}|${theirHand.map(idOf).join(",")}|${ourSide.budget.e}/${ourSide.budget.p}|${theirSide.budget.e}/${theirSide.budget.p}|${s.down[b].map((x) => x.map(idOf).join("+")).join("/")}|${+ourSide.anyDamageKills}${+theirSide.anyDamageKills}`;
  if (memo.fights.has(key)) r = memo.fights.get(key);
  else {
    r = attacker === 0
      ? fight(ourSide, { ...theirSide, faceDown: s.their.locked ? [] : s.down[b][1].slice(), base: theirs(s, -1).map((u) => u.card) }, { maxPlies: 8, maxNodes: memo.fightNodes })
      : fight(theirSide, { ...ourSide, faceDown: s.down[b][0].slice(), base: ours(s, -1).map((u) => effCard(s, u)) }, { maxPlies: 8, maxNodes: memo.fightNodes });
    memo.fights.set(key, r); memo.fightCalls++;
  }
  const alive = new Set(r.end.alive.map((x) => x.card));
  const [endUs, endThem] = attacker === 0 ? [r.end.budgetA, r.end.budgetD] : [r.end.budgetD, r.end.budgetA];
  const [spentUs, spentThem] = attacker === 0 ? [r.end.spentA, r.end.spentD] : [r.end.spentD, r.end.spentA];
  // Our resources spent in the fight: Energy from ready runes, Power from Gold then runes.
  const b0 = ourSide.budget, eUsed = Math.max(0, b0.e - endUs.e), pUsed = Math.max(0, b0.p - endUs.p);
  if (eUsed || pUsed) pay(s, eUsed, "rainbow", pUsed);
  s.their.budget = { e: endThem.e, p: endThem.p };
  s.used.push(...spentUs.map((c) => c.n));
  for (const c of spentUs) { const i = s.hand.indexOf(c); if (i > -1) s.hand.splice(i, 1); else { const j = s.down[b][0].indexOf(c); if (j > -1) s.down[b][0].splice(j, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 0, b, false)); } }
  for (const c of spentThem) { const i = s.their.hand.indexOf(c); if (i > -1) s.their.hand.splice(i, 1); else { const j = s.down[b][1].indexOf(c); if (j > -1) s.down[b][1].splice(j, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 1, b, false)); } }
  const deadUs = us.filter((u) => !alive.has([...map].find(([, v]) => v === u)[0])), deadThem = them.filter((u) => !alive.has(u.card));
  s.units = s.units.filter((u) => !deadUs.includes(u) && !deadThem.includes(u));
  s.kills += deadThem.length;
  for (const u of [...deadUs, ...deadThem]) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "die")) runAbility(s, a, { side: u.side, src: null, here: -1 }, memo, true);
  const verb = them.length ? `fight at ${BF[b]} (${attacker === 0 ? "you attack" : "they attack"}): ${mine.map((c) => `${c.n} ${c.m}`).join(" + ")} vs ${foes.map((c) => `${c.n} ${c.m || 0}`).join(" + ")}${s.down[b][attacker === 0 ? 1 : 0].length ? " + face down" : ""}`
    : `walk into ${BF[b]}${theirHand.length ? " (they may answer)" : ""}`;
  // fight() writes its line from the defender's side ("you" defend); when we attack, swap the words.
  const line = attacker === 0 ? r.line.map((l) => l.replace(/^(you|they)\b/, (w) => (w === "you" ? "they" : "you")).replace(/^you: flip/, "they: flip")) : r.line;
  s.log.push(`  ${verb}${line.length ? ` · ${line.join(" · ")}` : ""}`);
  const outcome = r.outcome;   // the defender's view: hold, trade, conquer
  const atk = attacker, def = 1 - attacker;
  const sideUnits = (side) => s.units.filter((u) => u.side === side && u.at === b);
  if (outcome === "conquer" || (!them.length && sideUnits(0).length)) {
    if (s.ctrl[b] !== atk) {
      s.ctrl[b] = atk; s.down[b][def] = []; score(s, b, atk);
      // Conquer triggers of the units that took it (Lucian, Merciless: ready me).
      if (atk === 0) for (const u of ours(s, b)) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "conquer")) runAbility(s, a, { side: 0, src: u, here: b }, memo, true);
    }
  } else if (outcome === "hold") {
    for (const u of sideUnits(atk)) u.at = -1;   // recalled (§468.1.a.2)
    s.log.push(`  ${def === 0 ? "you hold" : "they hold"} ${BF[b]}; the attackers go back to base`);
  } else {
    s.ctrl[b] = null; s.down[b] = [[], []];
    s.log.push(`  trade at ${BF[b]}: nobody controls it`);
  }
  if (s.ctrl[b] != null && !sideUnits(s.ctrl[b]).length) s.ctrl[b] = null;   // §323.5
}

// Each unit gets its own copy of its card: two copies of one card must stay two units in fight().
// A battlefield with none of its controller's units left stops being theirs; their face-down cards go (§323.5, §323.6.a).
function vacate(s, from) {
  if (from >= 0 && s.ctrl[from] === 0 && !ours(s, from).length) { s.ctrl[from] = null; s.down[from][0] = []; s.log.push(`  ${BF[from]} left empty: it's no longer yours`); }
}
function mkUnit(card, side, at, ready) { return { card: { ...card }, side, at, ready, gear: [], bonus: 0, uid: idOf({}) }; }

// After units of ours arrive at b (a move or a spell move): their move triggers (Faefolk's pull,
// read from the card text), then the combat.
function arrive(s, b, movers, memo) {
  let states = [clone(s)];
  for (const m of movers) for (const a of compile(m.card).abilities.filter((x) => x.trigger === "move"))
    states = states.flatMap((t) => { const u = unitRef(t, m); return u ? runAbility(t, a, { side: 0, src: u, here: b }, memo) : [t]; });
  for (const t of states) finishArrival(t, b, memo);
  return states;
}
function finishArrival(s, b, memo) {
  const attacker = s.ctrl[b] === 0 ? 1 : 0;   // we contested it unless it was already ours
  resolveAt(s, b, attacker, memo);
}

// ── the effect language, run (lib/cardtext.mjs) ──
// Conditions the engine evaluates (lib/cardtext.mjs condKnown lists them); any other condition
// counts as not met, so the effect doesn't happen and the card is reported as not fully read.
const NUMW = { two: 2, three: 3 };
function condMet(s, cond, ctx) {
  if (!cond) return true;
  return String(cond).split("; ").every((raw) => {
    const hit = condKind(raw); if (!hit) return false;
    const { k, m } = hit, me = ctx.src, side = ctx.side ?? 0, mine = s.units.filter((u) => u.side === side);
    switch (k) {
      case "legion": return s.played > (ctx.self ? 1 : 0);
      case "paidExtra": return !!ctx.paidExtra;
      case "did": return ctx.did !== false;
      case "atBf": return !!me && me.at >= 0;
      case "always": return true;
      case "spent": return s.spent >= m[1].match(/\{/g).length;
      case "empowered": return !!me?.empowered;
      case "mighty": return !!me && mightOf(s, me) >= 5;
      case "buffed": return !!me?.buffed;
      case "stunned": return [].concat(ctx.ref || []).some((u) => u.stunned);
      case "notYourTurn": return side !== 0;
      case "fromFaceDown": return side === 0 && !!ctx.faceDown;   // the solver only plays our turn
      case "oppNear": return s.score[1 - side] >= 8 - Number(m[1]);
      case "controlTag": { const tag = (m[1] || m[2]).toLowerCase(); return mine.some((u) => (u.card.g || []).some((g) => g.toLowerCase() === tag || g.toLowerCase() + "s" === tag)); }
      case "gearCount": return (side === 0 ? s.gear.length + s.units.filter((u) => u.side === 0).reduce((a, u) => a + u.gear.length, 0) : 0) >= (NUMW[m[1]] || Number(m[1]));
      case "faceDownBf": return [0, 1].some((b) => s.down[b][side].length && (!/here/i.test(raw) || b === ctx.here));
      case "controlThisBf": return ctx.here >= 0 && s.ctrl[ctx.here] === side;
      case "enemyDied": return s.kills > 0;
      case "oppControlsBf": return s.ctrl.some((x) => x === 1 - side);
      case "handSize": return side === 0 && s.hand.length <= (NUMW[m[1]] || Number(m[1]));
      case "anotherHere": return !!me && mine.some((u) => u.uid !== me.uid && u.at === me.at);
      case "playedToBf": return !!s.playedToBf;
      case "showedOff": return !!ctx.showedOff;
      case "fourThere": return ctx.here != null && ctx.here >= 0 && s.units.filter((u) => u.at === ctx.here).length >= 4;
      case "onlyUnitThere": { const r = [].concat(ctx.ref || [])[0]; return !!r && mine.filter((u) => u.at === r.at).length === 1; }
      case "enemyAloneHere": return ctx.here >= 0 && s.units.filter((u) => u.side !== side && u.at === ctx.here).length === 1;
      default: return false;
    }
  });
}
// Ops this executor plays outside combat.
export const RUN_OPS = new Set(["gold", "swapTwo", "chooseBf", "strip", "discountNext", "redeploy", "prevent", "swapPlaces", "damage", "might", "swing", "stun", "kill", "banish", "bounce", "bounce2", "recall", "ready", "exhaust", "move", "token", "buff",
  "keyword", "add", "channel", "readyRunes", "lock", "protect", "noMove", "heal", "edict", "empower", "fight", "choose", "noTurn", "noop", "attach"]);
const unitRef = (t, u) => t.units.find((x) => x.uid === u.uid);
const mightOf = (s, u) => effCard(s, u).m || 0;
function candidates(s, spec, ctx) {
  return s.units.filter((u) => {
    if (spec.side === "enemy" && u.side === ctx.side) return false;
    if (spec.side === "friendly" && u.side !== ctx.side) return false;
    if (spec.other && ctx.src && u.uid === ctx.src.uid) return false;
    if (spec.where === "here" && u.at !== ctx.here) return false;
    if (spec.where === "bf" && u.at < 0) return false;
    if (spec.where === "base" && u.at >= 0) return false;
    if (spec.where === "elsewhere" && u.at === ctx.here) return false;
    if (spec.max != null && mightOf(s, u) > spec.max) return false;
    if (spec.min != null && mightOf(s, u) < spec.min) return false;
    if (spec.attacking || spec.defending || spec.inCombat) return false;            // nothing is in combat in the open state
    if (spec.stunned && !u.stunned) return false;
    if (spec.without && compile(u.card).keywords[spec.without]) return false;
    if (spec.kind && spec.kind !== "unit" && spec.kind !== "permanent") return false;
    if (spec.choose !== false && u.side !== ctx.side && (u.protected || compile(u.card).statics.some((x) => x.op === "untargetable"))) return false;
    return true;
  });
}
function targetSets(s, spec, ctx) {
  if (!spec) return [[]];
  if (spec.who === "me") return ctx.src ? [[ctx.src]] : [[]];
  if (spec.who === "it") return [[].concat(ctx.ref || [])];
  if (spec.who === "battlefield" || spec.who === "player") return [[]];
  const xs = candidates(s, spec, ctx).sort((a, b) => (a.side !== ctx.side) - (b.side !== ctx.side) || mightOf(s, b) - mightOf(s, a)).reverse();
  if (ctx.restrictHere != null) for (let i = xs.length - 1; i >= 0; i--) if (xs[i].at !== ctx.restrictHere) xs.splice(i, 1);
  if (spec.who === "each") return [xs];
  if (spec.who === "upTo") {
    const n = Math.min(spec.n || 1, xs.length), out = [[]];
    const pick = xs.slice().sort((a, b) => mightOf(s, b) - mightOf(s, a)).slice(0, 5);
    for (let m = 1; m < 1 << pick.length; m++) { const set = pick.filter((_, i) => m & (1 << i)); if (set.length <= n) out.push(set); }
    return out.slice(0, 16);
  }
  return xs.map((u) => [u]);
}
// Deflect: choosing an enemy unit with Deflect N costs N more Power (§ Deflect).
const deflectOf = (s, u) => keywordOf(effCard(s, u).x, "Deflect").always;
function dieOutside(t, u, memo, why = "dies") {
  t.units = t.units.filter((x) => x.uid !== u.uid);
  t.log.push(`  ${u.side === 0 ? "your" : "their"} ${u.card.n} (${where(u.at)}) ${why}`);
  if (u.side === 1) t.kills++;
  // Deathknell (not on a banish): its effects, for its controller.
  if (why === "dies") for (const a of compile(u.card).abilities.filter((x) => x.trigger === "die")) runAbility(t, a, { side: u.side, src: null, here: u.at, card: u.card }, memo, true);
  for (const b of [0, 1]) if (t.ctrl[b] != null && !t.units.some((x) => x.side === t.ctrl[b] && x.at === b)) { const was = t.ctrl[b]; t.ctrl[b] = null; t.down[b][was] = []; t.log.push(`  ${BF[b]} has no units of ${was === 0 ? "yours" : "theirs"} left: it's uncontrolled (§323.5)`); }
}
function mkToken(e) { return { n: `${e.name} token`, t: "Unit", m: e.might, x: (e.keywords || []).map((k) => `[${k}]`).join("\n"), token: true }; }
// One op on state t (targets already mapped to t's units). Returns the states it can lead to.
function applyOp(t, e, set, ctx, memo) {
  const us = set.map((u) => unitRef(t, u)).filter(Boolean);
  const who = ctx.side === 0 ? "you" : "they";
  switch (e.op) {
    case "damage": {
      const n = e.n === "myMight" ? (ctx.src ? mightOf(t, unitRef(t, ctx.src) || ctx.src) : 0) : e.n === "itsMight" ? 0 : e.split ? e.n : e.n;
      const kills = t.units.some((v) => v.side === ctx.side && compile(v.card).statics.some((x) => x.op === "anyDamageKills"));
      for (const u of us) { const blk = Math.min(u.prevent || 0, n); u.prevent = (u.prevent || 0) - blk; u.dmg = (u.dmg || 0) + n - blk; if (u.dmg > 0 && (u.dmg >= mightOf(t, u) || (kills && u.side !== ctx.side && n - blk > 0))) dieOutside(t, u, memo); }
      return [t];
    }
    case "might": for (const u of us) { const n = e.n === "itsMight" ? 0 : e.n; u.bonus = (u.bonus || 0) + n; if (e.floor != null) u.bonus = Math.max(u.bonus, e.floor - (withGear(u.card, u.gear).m || 0)); if (e.keyword) u.kw = [...(u.kw || []), `[${e.keyword}${e.kn > 1 ? ` ${e.kn}` : ""}]`]; } return [t];
    case "keyword": for (const u of us) u.kw = [...(u.kw || []), ...(e.keywords || [e.keyword]).map((k) => `[${k}${e.n > 1 && !e.keywords ? ` ${e.n}` : ""}]`)]; return [t];
    case "stun": for (const u of us) u.stunned = true; return [t];
    case "noMove": for (const u of us) u.noMove = true; return [t];
    case "protect": for (const u of us) u.protected = true; return [t];
    case "heal": for (const u of us) u.dmg = 0; return [t];
    case "empower": for (const u of us) u.empowered = true; return [t];
    case "buff": for (const u of us) if (!u.buffed) { u.buffed = true; u.bonus = (u.bonus || 0) + 1; } return [t];
    case "kill": for (const u of us) dieOutside(t, u, memo); return [t];
    case "banish": for (const u of us) dieOutside(t, u, memo, "is banished"); return [t];
    case "bounce": case "bounce2": {
      const all = e.op === "bounce2" ? [...us, ...[].concat(ctx.ref2 || []).map((u) => unitRef(t, u)).filter(Boolean)] : us;
      for (const u of all) { dieOutside(t, u, memo, "returns to hand"); if (!u.card.token) (u.side === 0 ? t.hand : t.their.hand).push(u.card); }
      return [t];
    }
    case "recall": for (const u of us) { const from = u.at; u.at = -1; vacate(t, from); } return [t];
    case "ready": for (const u of us) u.ready = true; return [t];
    case "exhaust": for (const u of us) u.ready = false; return [t];
    case "lock": if (ctx.side === 0) { t.their.locked = true; t.log.push("  they can't play cards this turn"); } return [t];
    case "add": t.pool.push(...(e.power || []).map((d) => ({ d, spellsOnly: !!e.spellsOnly }))); t.extraE += e.energy || 0; return [t];
    case "channel": for (let i = 0; i < (e.n || 1); i++) t.runes.push({ d: "?", ready: true }); return [t];
    case "readyRunes": { let n = e.n || 1; for (const r of t.runes) if (!r.ready && n > 0) { r.ready = true; n--; } return [t]; }
    case "edict": {
      for (const side of [0, 1]) { const mine = t.units.filter((u) => u.side === side).sort((a, b) => (a.card.token ? -1 : 0) - (b.card.token ? -1 : 0) || mightOf(t, a) - mightOf(t, b)); if (mine[0]) dieOutside(t, mine[0], memo); }
      return [t];
    }
    case "fight": {
      const [a, b] = [[].concat(ctx.ref || [])[0], [].concat(ctx.ref2 || [])[0]].map((u) => u && unitRef(t, u));
      if (!a || !b) return [t];
      const ma = mightOf(t, a), mb = mightOf(t, b);
      a.dmg = (a.dmg || 0) + mb; b.dmg = (b.dmg || 0) + ma;
      for (const u of [a, b]) if (u.dmg >= mightOf(t, u) && u.dmg > 0) dieOutside(t, u, memo);
      return [t];
    }
    case "swing": return [t];
    case "strip": {
      // Their best non-unit card leaves their hand: a counter first, then a trick, then anything.
      const h = t.their.hand.filter((c) => !isUnit(c));
      const pick = h.find((c) => counterOf(c)) || h.find((c) => quick(c) && trick(c)) || h[0];
      if (pick) { t.their.hand.splice(t.their.hand.indexOf(pick), 1); t.log.push(`  they reveal their hand; ${pick.n} is recycled`); }
      return [t];
    }
    case "discountNext": { const k = costParts(e.cost); t.discount = { e: k.e, p: k.p }; t.log.push(`  the next card costs ${e.cost} less`); return [t]; }
    case "prevent": for (const u of us) u.prevent = (u.prevent || 0) + e.n; return [t];
    case "redeploy": {
      // Banished and played again (Temporal Breach, Thrill of the Hunt): a fresh unit, exhausted, with its play effects.
      const out = [];
      for (const u of us) {
        const dests = /same location/.test(e.to) ? [u.at] : /base/.test(e.to) ? [-1] : [0, 1];
        for (const d of dests) {
          const t2 = clone(t); const v = unitRef(t2, u); if (!v) continue;
          const from = v.at; t2.units = t2.units.filter((x) => x.uid !== v.uid);
          const nu = mkUnit(v.card, v.side, d, false); t2.units.push(nu);
          t2.log.push(`  ${v.card.n} is banished and played again at ${where(d)}`);
          if (from !== d) vacate(t2, from);
          let st2 = [t2];
          for (const a of compile(nu.card).abilities.filter((x) => x.trigger === "play")) st2 = st2.flatMap((x) => runAbility(x, a, { side: nu.side, src: unitRef(x, nu), here: d }, memo));
          for (const x of st2) { if (d >= 0 && nu.side === 0 && theirs(x, d).length && x.ctrl[d] !== 0) resolveAt(x, d, 0, memo); else if (d >= 0 && nu.side === 0 && x.ctrl[d] !== 0 && !theirs(x, d).length) { x.ctrl[d] = 0; x.down[d][1] = []; score(x, d, 0); } }
          out.push(...st2);
        }
      }
      return out.length ? out : [t];
    }
    case "swapPlaces": {
      const other = [].concat(ctx.ref || [])[0], me = ctx.src && unitRef(t, ctx.src), o = other && unitRef(t, other);
      if (!me || !o) return [t];
      const a = me.at, b2 = o.at; me.at = b2; o.at = a;
      t.log.push(`  ${me.card.n} and ${o.card.n} swap places (${where(a)} ↔ ${where(b2)})`);
      return [t];
    }
    // Two chosen units trade locations (Smoke and Mirrors): at different locations, and only if one has [Temporary].
    case "swapTwo": {
      const a1 = [].concat(ctx.ref || [])[0], b1 = [].concat(ctx.ref2 || [])[0], x = a1 && unitRef(t, a1), y = b1 && unitRef(t, b1);
      const temp = (u) => /\[Temporary\]/i.test(u.card.x || "") || (u.kw || []).some((k) => /Temporary/i.test(k));
      if (!x || !y || x === y || x.at === y.at || !(temp(x) || temp(y))) return [];
      const a = x.at; x.at = y.at; y.at = a;
      t.log.push(`  ${x.card.n} and ${y.card.n} swap places (${where(y.at)} ↔ ${where(x.at)})`);
      return [t];
    }
    case "move": {
      // A spell or trigger move: no Ganking needed (§451.1); destinations from the text.
      const dests = /that battlefield|here|my battlefield|my location/.test(e.to) ? [ctx.here] : /base/.test(e.to) ? [-1] : [-1, 0, 1];
      const out = [];
      for (const d of dests) {
        if (d == null) continue;
        if (us.some((u) => u.at === d)) continue;
        const t2 = clone(t); const ms = us.map((u) => unitRef(t2, u));
        const froms = [...new Set(ms.map((u) => u.at))];
        for (const u of ms) { u.at = d; if (e.ready) u.ready = true; }
        const by = ctx.src?.card?.n || ctx.card?.n;
        t2.log.push(ms[0].side !== ctx.side ? `  ${by || who} pulls ${ms[0].side === 0 ? "your" : "their"} ${ms.map((u) => u.card.n).join(" + ")} from ${froms.map(where).join("/")} into ${where(d)}`
          : `  ${by ? `${by}: ` : ""}${ms.map((u) => u.card.n).join(" + ")} ${froms.map(where).join("/")} → ${where(d)}${e.ready ? ", ready" : ""}`);
        for (const f of froms) { vacate(t2, f); if (f >= 0 && t2.ctrl[f] === 1 && !theirs(t2, f).length) { t2.ctrl[f] = null; t2.down[f][1] = []; } }
        if (d >= 0) {
          const mineMoved = ms[0].side === 0;
          if (mineMoved) { out.push(...arrive(t2, d, ms, memo, true)); continue; }
          if (ours(t2, d).length && t2.ctrl[d] === 0) resolveAt(t2, d, 1, memo);      // their unit pulled into ours: they attack
        }
        out.push(t2);
      }
      return out.length ? out : [t];
    }
    case "token": {
      const loc = /base/.test(e.to) ? -1 : ctx.here ?? -1;
      for (let i = 0; i < (e.count || 1); i++) { const u = mkUnit(mkToken(e), ctx.side, loc, !!e.ready); t.units.push(u); if (ctx.side === 0) onOurUnitPlayed(t, u, memo); }
      t.log.push(`  ${who}: ${e.count > 1 ? `${e.count} ` : ""}${e.might}-Might ${e.name} token${e.count > 1 ? "s" : ""} to ${where(loc)}${e.ready ? ", ready" : ""}`);
      return [t];
    }
    // Gold gear tokens: ready ones pay Power this turn (pay() spends s.gold); exhausted ones add nothing until they ready (§415.4).
    case "gold": if (ctx.side === 0 && e.ready) t.gold += e.n || 1; t.log.push(`  ${who}: ${e.n || 1} ${e.ready ? "ready" : "exhausted"} Gold`); return [t];
    default: return [t];   // noTurn, noop, attach, counter (theirs), unknown
  }
}
// An ability's effects in order: branches over targets and "you may"; returns the end states.
function runAbility(s, a, ctx, memo, inPlace = false) {
  if (!condMet(s, a.cond, ctx)) return inPlace ? [s] : [s];
  if (a.modal && (a.modes || []).length) {
    // Choose one (or two): each mode, or each pair of modes, is a branch.
    const ms = a.modes, picks = a.pick === 2 ? ms.flatMap((x, i) => ms.slice(i + 1).map((y) => [x, y])) : ms.map((x) => [x]);
    const res = picks.flatMap((pk) => runAbility(s, { ...a, modal: false, modes: null, effects: pk.flatMap((x) => x.effects) }, ctx, memo, false));
    if (inPlace) { if (res[0]) Object.assign(s, res[0]); return [s]; }
    return res.length ? res : [s];
  }
  const effs = a.effects || [];
  const go = (t, i, c) => {
    if (i >= effs.length) return [t];
    const e = effs[i];
    if (!RUN_OPS.has(e.op) || e.op === "noTurn" || e.op === "noop") return go(t, i + 1, c);
    if (e.op === "chooseBf") {
      const bfs = [0, 1].filter((b) => !e.mine || t.units.some((u) => u.side === c.side && u.at === b));
      const out = []; for (const b of bfs) out.push(...go(t, i + 1, { ...c, here: b }));
      return out.length ? out : go(t, i + 1, c);
    }
    if (e.op === "choose") {
      const sets = targetSets(t, e.target, c), sets2 = e.target2 ? targetSets(t, e.target2, c) : [[]];
      const out = [];
      for (const x of sets.slice(0, 8)) for (const y of sets2.slice(0, 8)) out.push(...go(t, i + 1, { ...c, ref: x, ref2: y }));
      return out.length ? out : go(t, i + 1, c);
    }
    const out = [];
    const sets = e.op === "swing" ? [[]] : targetSets(t, e.target, c);
    for (const set of sets.slice(0, 10)) {
      if (e.target?.choose !== false && e.target?.who === "unit" && !set.length) continue;
      const t2 = clone(t);
      // Paying for it: an optional "pay X to …", and Deflect on each enemy unit chosen.
      const extra = set.filter((u) => u.side !== c.side && e.target?.choose !== false).reduce((n, u) => n + deflectOf(t, u), 0);
      if (e.pay) { const k = costParts(e.pay); if (!payFor(t2, k.e, k.d, k.p, c.side)) continue; }
      if (extra && !payFor(t2, 0, "rainbow", extra, c.side)) continue;
      if (e.op === "swing") { const a1 = targetSets(t2, e.a.target, c)[0] || [], b1 = targetSets(t2, e.b.target, c)[0] || []; for (const u of a1) unitRef(t2, u).bonus += e.a.n; for (const u of b1) unitRef(t2, u).bonus += e.b.n; out.push(...go(t2, i + 1, { ...c, did: true })); continue; }
      for (const t3 of applyOp(t2, e, set, c, memo)) out.push(...go(t3, i + 1, { ...c, ref: set.length ? set : c.ref, did: true }));
    }
    if (e.optional || !out.length) out.push(...go(t, i + 1, { ...c, did: false }));
    return out;
  };
  const res = go(inPlace ? s : clone(s), 0, ctx);
  if (inPlace) { const first = res[0]; if (first && first !== s) Object.assign(s, first); return [s]; }
  return res;
}
const costParts = (txt) => { const e = [...String(txt).matchAll(/\[e(\d+)\]/g)].reduce((a, m) => a + Number(m[1]), 0); const ps = [...String(txt).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((d) => d !== "T"); return { e, p: ps.length, d: ps[0] === "A" || !ps.length ? "rainbow" : ps[0] }; };
function payFor(t, e, d, p, side) { if (side === 0) return pay(t, e, d, p); if ((t.their.budget.e < e) || (t.their.budget.p < p)) return false; t.their.budget.e -= e; t.their.budget.p -= p; return true; }
// Their triggers on our plays (Vex, Apathetic: stun it, it can't move), then ours (Ravenbloom +1 on a spell).
function onOurUnitPlayed(t, u, memo) {
  for (const v of theirs(t)) for (const a of compile(v.card).abilities.filter((x) => x.trigger === "oppPlaysUnit")) {
    if (!condMet(t, a.cond, { side: 1, src: v })) continue;
    runAbility(t, a, { side: 1, src: v, ref: [u], here: v.at }, memo, true);
    t.log.push(`  their ${v.card.n}: your ${u.card.n} is stunned${a.effects.some((e) => e.op === "noMove") ? " and can't move this turn" : ""}`);
  }
}
function onWePlay(t, card, memo) {
  t.played++;
  for (const u of ours(t)) for (const a of compile(u.card).abilities) {
    if ((a.trigger === "youPlayFirst" && t.played === 1) || (a.trigger === "youPlaySecond" && t.played === 2)) runAbility(t, a, { side: 0, src: u, here: u.at }, memo, true);
  }
  for (const u of ours(t)) for (const a of compile(u.card).abilities) {
    if ((a.trigger === "youPlaySpell" && isSpell(card)) || a.trigger === "youPlayCard") for (const x of runAbility(t, a, { side: 0, src: u, here: u.at }, memo, true)) void x;
  }
}
// Cost of a card for us now: printed, less what the engine can evaluate of its discounts.
function costNow(t, c) {
  let e = c.e || 0;
  for (const st of compile(c).statics.filter((x) => x.op === "costLess")) {
    if (st.per || (st.cond && !condMet(t, st.cond, { self: true }))) continue;
    e -= st.n != null ? st.n : costParts(st.cost || "").e;
  }
  let p = c.p || 0;
  if (t.discount) { e -= t.discount.e; p = Math.max(0, p - t.discount.p); }
  return { e: Math.max(0, e), d: dom(c), p };
}

// ── our actions from a state: each returns { min?, children: [state] } ──
function actions(s, memo) {
  const out = [];
  const label = (t, x) => { t.log.push(x); return t; };
  // Move: ready units, to a battlefield (a subset of the eligible units).
  for (const b of [0, 1]) {
    const elig = ours(s).filter((u) => u.ready && !u.noMove && u.at !== b && (u.at === -1 || ganks(s, u)));
    if (!elig.length) continue;
    const foes = theirs(s, b).length, mine = s.ctrl[b] === 0;
    const movesSomething = (u) => compile(u.card).abilities.some((a) => a.trigger === "move" && (a.effects || []).some((e) => RUN_OPS.has(e.op) && e.op !== "noTurn"));
    let subsets;
    if (!foes && mine) subsets = elig.filter(movesSomething).map((u) => [u]);
    else if (!foes) subsets = elig.map((u) => [u]);
    else {
      const pick = elig.slice().sort((x, y) => (effCard(s, y).m || 0) - (effCard(s, x).m || 0)).slice(0, 5);
      subsets = [];
      for (let m = 1; m < 1 << pick.length; m++) subsets.push(pick.filter((_, i) => m & (1 << i)));
      if (elig.length > 5) subsets.push(elig);
    }
    for (const sub of subsets) {
      const t = clone(s);
      const ms = sub.map((u) => unitRef(t, u));
      for (const u of ms) u.ready = false;
      label(t, `move ${ms.map((u) => `${u.card.n} (${where(u.at)})`).join(" + ")} → ${BF[b]}`);
      t.used.push(...ms.map((u) => u.card.n));
      const froms = [...new Set(ms.map((u) => u.at))];
      for (const u of ms) u.at = b;
      for (const f of froms) vacate(t, f);
      // "When I become exhausted" (the move's cost exhausted them): Riven's choice, Innovator's Gold.
      let pre = [t];
      for (const m of ms) for (const a of compile(m.card).abilities.filter((x) => x.trigger === "exhausted")) pre = pre.flatMap((x) => runAbility(x, a, { side: 0, src: unitRef(x, m), here: b }, memo));
      out.push({ children: pre.flatMap((x) => arrive(x, b, ms.map((m) => unitRef(x, m)).filter(Boolean), memo)), tag: "move" });
    }
  }
  // Play a card from hand or the Champion Zone, its abilities run from the card text.
  const cards = [...s.hand, ...(s.champ ? [s.champ] : [])];
  const seen = new Set();
  for (const c of cards) {
    if (seen.has(c.n)) continue; seen.add(c.n);
    const k = compile(c), cost = costNow(s, c);
    const extraTxt = k.sentences.find((x) => x.cost) && /pay ((?:\{\w+\}|\[e\d+\])+)/i.exec(k.sentences.find((x) => x.cost).text);
    const accel = isUnit(c) && k.keywords.Accelerate;
    // [Show Off]: reveal a card from hand (or pick a friendly one) of the named kind, if there is one.
    const so = k.sentences.find((x) => x.cost && /^\[show off\]/i.test(x.text));
    const canShow = so && (/a gear/i.test(so.text) ? s.hand.some((x) => x !== c && /Gear/.test(x.t || "")) || s.gear.length > 0
      : /\[hidden\]/i.test(so.text) ? s.hand.some((x) => x !== c && /\[Hidden\]/i.test(x.x || "")) : s.hand.length > 1 || ours(s).length > 0);
    for (const ac of accel ? [true, false] : [false]) for (const paidExtra of extraTxt ? [true, false] : [false]) {
      const t = clone(s);
      if (!pay(t, cost.e, cost.d, cost.p, isSpell(c))) continue;
      t.discount = null;
      // Optional additional costs cost [e1] less with Ezreal, Prodigy out (his static).
      const cheap = ours(s).some((u) => compile(u.card).statics.some((x) => x.op === "extraCostLess"));
      if (ac && !pay(t, cheap ? 0 : 1, dom(c), 1)) continue;
      if (paidExtra) { const x = costParts(extraTxt[1]); if (!pay(t, x.e, x.d, x.p, isSpell(c))) continue; }
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      t.used.push(c.n);
      const ctx = { side: 0, paidExtra, self: true, card: c, showedOff: !!canShow };
      if (isUnit(c)) {
        const ready = ac || k.statics.some((x) => x.op === "enterReady");
        const u = mkUnit(c, 0, -1, ready); t.units.push(u);
        label(t, `play ${c.n}${ac ? " with Accelerate (enters ready)" : ""}${c === s.champ ? " from the Champion Zone" : ""}`);
        onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
        let states = [t];
        for (const a of k.abilities.filter((x) => x.trigger === "play")) states = states.flatMap((x) => runAbility(x, a, { ...ctx, src: unitRef(x, u), here: -1 }, memo));
        out.push({ children: states, tag: "unit" });
      } else if (isSpell(c)) {
        label(t, `cast ${c.n}`);
        const countered = counterChildren(t, c);
        onWePlay(t, c, memo);
        let states = [clone(t)];
        for (const a of k.abilities.filter((x) => x.trigger === "spell")) states = states.flatMap((x) => runAbility(x, a, ctx, memo));
        // [Repeat]: pay its cost to do it all again.
        if (k.repeat) { const rc = costParts(k.repeat); const again = []; for (const x of states.slice(0, 6)) { const y = clone(x); if (!pay(y, rc.e, rc.d, rc.p, true)) continue; y.log.push(`  repeat ${c.n}`); let ys = [y]; for (const a of k.abilities.filter((z) => z.trigger === "spell")) ys = ys.flatMap((z) => runAbility(z, a, ctx, memo)); again.push(...ys); } states.push(...again); }
        out.push({ children: states, min: countered.length ? countered : null, tag: c.n });
      } else if (/Gear/.test(c.t || "")) {
        const deploy = k.keywords.Deploy;
        for (const here of deploy ? [0, 1].filter((b) => s.ctrl[b] === 0) : [-1]) {
          const t2 = clone(t); if (here >= 0) t2.playedToBf = true;
          // [Quick-Draw]: "When you play it, attach it to a unit you control."
          const host = k.keywords["Quick-Draw"] && ours(t2).sort((x, y) => mightOf(t2, y) - mightOf(t2, x))[0];
          if (host) { host.gear.push(c); t2.log.push(`  attached to ${host.card.n}`); } else t2.gear.push(c);
          label(t2, `play ${c.n}${here >= 0 ? ` to ${BF[here]}` : ""}`);
          onWePlay(t2, c, memo);
          let states = [t2];
          for (const a of k.abilities.filter((x) => x.trigger === "play")) states = states.flatMap((x) => runAbility(x, a, { ...ctx, here }, memo));
          out.push({ children: states, tag: c.n });
        }
      }
    }
  }
  // A unit that may be played to an open battlefield (Sneaky Deckhand): unoccupied and uncontrolled
  // (§170.11.c); played there, it contests it and conquers when the showdown closes (§190.3.a.1, §348.2.a).
  for (const c of cards.filter((x, i, a) => a.findIndex((y) => y.n === x.n) === i)) {
    if (!isUnit(c) || !compile(c).statics.some((x) => x.op === "playToOpen")) continue;
    for (const b of [0, 1]) {
      if (s.ctrl[b] != null || s.units.some((u) => u.at === b)) continue;
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, cost.e, cost.d, cost.p)) continue;
      t.discount = null;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, b, false); t.units.push(u); t.used.push(c.n); t.playedToBf = true;
      label(t, `play ${c.n} straight onto the open ${BF[b]}`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      resolveAt(t, b, 0, memo);
      out.push({ children: [t], tag: "open" });
    }
  }
  // A unit that can [Ambush] to a battlefield with enemy units (Rengar, Trophy Hunter): played straight in, it contests it.
  for (const c of seen.size ? cards.filter((x, i, a) => a.findIndex((y) => y.n === x.n) === i) : []) {
    if (!isUnit(c) || !compile(c).statics.some((x) => x.op === "ambushAnywhere")) continue;
    for (const b of [0, 1]) {
      if (!theirs(s, b).length) continue;
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, cost.e, cost.d, cost.p)) continue;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, b, false); t.units.push(u); t.used.push(c.n); t.playedToBf = true;
      label(t, `play ${c.n} straight into ${BF[b]} (it can Ambush where there are enemy units)`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      resolveAt(t, b, 0, memo);
      out.push({ children: [t], tag: "ambush" });
    }
  }
  // Our face-down cards, hidden on an earlier turn: played free, at their battlefield (§811.1.b, §811.1.d).
  for (const b of [0, 1]) for (const c of s.down[b][0]) {
    if (s.hidNow.includes(c.n + b)) continue;
    const t = clone(s); t.down[b][0].splice(t.down[b][0].indexOf(c), 1); t.used.push(c.n);
    const k = compile(c), ctx = { side: 0, card: c, here: b, restrictHere: b, self: true, faceDown: true };
    label(t, `play ${c.n} from face down at ${BF[b]}`);
    onWePlay(t, c, memo);
    let states = [t], min = null;
    if (isUnit(c)) {
      const u = mkUnit(c, 0, b, false); t.units.push(u); onOurUnitPlayed(t, u, memo);
      for (const a of k.abilities.filter((x) => x.trigger === "playFaceDown" || x.trigger === "play")) states = states.flatMap((x) => runAbility(x, a, { ...ctx, src: unitRef(x, u) }, memo));
    } else if (isSpell(c)) {
      const countered = counterChildren(t, c); min = countered.length ? countered : null;
      for (const a of k.abilities.filter((x) => x.trigger === "spell")) states = states.flatMap((x) => runAbility(x, a, ctx, memo));
    } else {
      // Gear from face down: attached to a unit of ours here when its text says so (Edge of Night).
      const host = ours(t, b).sort((x, y) => mightOf(t, y) - mightOf(t, x))[0];
      if (host && k.abilities.some((a) => (a.effects || []).some((e) => e.op === "attach"))) { host.gear.push(c); t.log.push(`  attached to ${host.card.n}`); } else t.gear.push(c);
    }
    out.push({ children: states, min, tag: c.n });
  }
  // Hide a card at a battlefield we control (1 Power), while it would switch on a "spent Power" static.
  const wantsSpend = [...ours(s).map((u) => u.card), ...cards].some((c) => compile(c).statics.some((x) => x.cond?.spentPower > s.spent));
  if (wantsSpend) {
    const c = s.hand.find((x) => /\[Hidden\]/i.test(x.x || ""));
    const b = [0, 1].find((k) => s.ctrl[k] === 0 && s.down[k][0].length === 0);
    if (c && b != null) { const t = clone(s); if (pay(t, 0, "rainbow", 1)) { t.hand.splice(t.hand.indexOf(c), 1); t.down[b][0].push(c); t.hidNow.push(c.n + b); label(t, `hide ${c.n} at ${BF[b]} (1 Power)`); out.push({ children: [t], tag: "hide" }); } }
  }
  // Activated abilities of our units and gear ("{T}: [Add] {Chaos}", "[e1], {T}: …").
  const sources = [...ours(s).map((u) => ({ u, card: u.card, id: `u${u.uid}` })), ...s.gear.map((g, i) => ({ card: g, id: `g${i}${g.n}` }))];
  for (const src of sources) for (const a of compile(src.card).abilities.filter((x) => x.trigger === "activated")) {
    if (/kill this|recycle|discard/i.test(a.cost)) continue;
    const tap = /\{T\}/.test(a.cost);
    if (tap && (src.u ? !src.u.ready : s.gearUsed.includes(src.id))) continue;
    if (!tap && s.gearUsed.includes(`${src.id}|${a.text}`)) continue;   // a non-exhaust ability: once a turn here (not a rule; a search bound)
    const t = clone(s); const k = costParts(a.cost);
    if (!pay(t, k.e, k.d, k.p)) continue;
    if (tap) { if (src.u) unitRef(t, src.u).ready = false; else t.gearUsed.push(src.id); } else t.gearUsed.push(`${src.id}|${a.text}`);
    label(t, `${src.card.n}: ${a.text.replace(/^.*?:\s*/, "")}`);
    out.push({ children: runAbility(t, a, { side: 0, src: src.u ? unitRef(t, src.u) : null, here: src.u?.at ?? -1 }, memo), tag: src.card.n });
  }
  // Equip: gear on the board onto a unit of ours (Boots: +2 Might and Ganking).
  for (const g of s.gear) {
    const m = EQUIP.exec(g.x || ""); if (!m) continue;
    const d = m[1][0].toUpperCase() + m[1].slice(1);
    for (const u of ours(s)) {
      const t = clone(s);
      if (!pay(t, 0, d, 1)) continue;
      t.gear.splice(t.gear.indexOf(g), 1);
      unitRef(t, u).gear.push(g); t.used.push(g.n);
      label(t, `equip ${g.n} on ${u.card.n}`);
      out.push({ children: [t], tag: g.n });
    }
  }
  return out;
}
// Their counters that stop spell c: in hand (paid from what they kept open) or face down (free).
function counterChildren(t, c) {
  const out = [];
  if (t.their.locked) return out;
  const k = t.their.hand.find((x) => counterOf(x) && stops(counterOf(x), c) && (x.e || 0) <= t.their.budget.e && (x.p || 0) <= t.their.budget.p);
  if (k) { const u = clone(t); u.their.hand.splice(u.their.hand.indexOf(k), 1); u.their.budget.e -= k.e || 0; u.their.budget.p -= k.p || 0; u.log.push(`  they counter it with ${k.n}`); out.push(u); }
  for (const b of [0, 1]) {
    const d = t.down[b][1].find((x) => counterOf(x) && stops(counterOf(x), c));
    if (d) { const u = clone(t); u.down[b][1].splice(u.down[b][1].indexOf(d), 1); u.log.push(`  they counter it with a face-down ${d.n}`); out.push(u); break; }
  }
  return out;
}

// Value of a stopping point: a win first, then points, their holds stopped, battlefields kept.
function valueOf(s, start) {
  const stopped = [0, 1].filter((b) => start.ctrl[b] === 1 && s.ctrl[b] !== 1).length;
  return (won(s) ? 1e6 : 0) + 1000 * (s.score[0] - start.score[0]) - 1000 * (s.score[1] - start.score[1]) + 100 * stopped
    + 10 * s.ctrl.filter((x) => x === 0).length + s.drew + 0.1 * ours(s).length - 0.01 * s.log.length;
}
const keyOf = (s) => [s.units.map((u) => `${u.uid}${u.side}${u.at}${u.ready ? 1 : 0}${u.gear.length}|${u.bonus || 0}|${u.dmg || 0}|${u.stunned ? 1 : 0}${u.noMove ? 1 : 0}${u.buffed ? 1 : 0}|${(u.kw || []).join("")}`).sort().join(","),
  `${s.pool.length}/${s.extraE}/${Math.min(2, s.played)}/${s.their.locked ? 1 : 0}/${s.gear.length}/${s.gearUsed.join("")}`, s.hand.map(idOf).sort().join(","), s.champ ? 1 : 0,
  s.runes.map((r) => `${r.d[0]}${r.ready ? 1 : 0}`).sort().join(""), s.gold, Math.min(2, s.spent), s.ctrl.join(), s.scored.join(), s.score.join(),
  s.their.hand.map(idOf).sort().join(","), `${s.their.budget.e}/${s.their.budget.p}`, s.down.map((b) => b.map((x) => x.map(idOf).join("+")).join("/")).join("|")].join("#");

function search(s, start, depth, memo) {
  if (won(s)) return { v: valueOf(s, start), s };
  const k = keyOf(s);
  if (memo.states.has(k)) return memo.states.get(k);
  let best = { v: valueOf(s, start), s };
  if (depth > 0 && ++memo.nodes <= memo.maxNodes) {
    for (const a of actions(s, memo)) {
      // Our choices (which child) maximise; their choice (counter or not) minimises.
      let r = null;
      for (const c of a.children) { const x = search(c, start, depth - 1, memo); if (!r || x.v > r.v) r = x; }
      if (a.min) for (const c of a.min) { const x = search(c, start, depth - 1, memo); if (x.v < r.v) r = x; }
      if (r && r.v > best.v) best = r;
    }
  }
  memo.states.set(k, best);
  return best;
}

// pos: { score: [us, them], ctrl: [A, B] (0 us, 1 them, null), beginning: true to score our holds
// first (else scored: battlefields already scored this turn), units: [{ card, side, at, ready }],
// down: [[ours at A, theirs at A], [ours at B, theirs at B]], hand, champ, gear (unattached on our
// board), runes: [{ d, ready }], gold (ready), spent (Power already spent this turn),
// their: { hand, budget: { e, p } } }.
export function solveTurn(pos, { maxNodes = 4000, fightNodes = 3000, depth = 8 } = {}) {
  ids = new WeakMap(); nextId = 0;
  const s = {
    score: pos.score.slice(), ctrl: (pos.ctrl || [null, null]).slice(), scored: (pos.scored || []).slice(), theirScored: [],
    units: pos.units.map((u) => ({ ...mkUnit(u.card, u.side, u.at, u.side === 0 ? u.ready !== false : true), gear: (u.gear || []).slice(), bonus: u.bonus || 0 })),
    down: (pos.down || [[[], []], [[], []]]).map((b) => [(b[0] || []).slice(), (b[1] || []).slice()]),
    hand: (pos.hand || []).slice(), champ: pos.champ || null, gear: (pos.gear || []).slice(),
    runes: (pos.runes || []).map((r) => ({ d: r.d, ready: r.ready !== false })), gold: pos.gold || 0, spent: pos.spent || 0,
    their: { hand: (pos.their?.hand || []).slice(), budget: { e: 0, p: 0, ...(pos.their?.budget || {}) } },
    log: [], used: [], drew: 0, conquers: 0, kills: 0, pool: [], extraE: 0, played: 0, gearUsed: [], hidNow: [], discount: null,
  };
  const startScore = s.score[0];
  if (pos.beginning) for (const b of [0, 1]) if (s.ctrl[b] === 0 && ours(s, b).length) {
    s.scored.push(b); s.score[0]++; s.log.push(`hold ${BF[b]} → ${s.score[0]}`);
    for (const u of ours(s, b)) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "hold")) runAbility(s, a, { side: 0, src: u, here: b }, { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 }, true);
  }
  const holds = s.scored.length;
  const start = clone(s);
  const memo = { states: new Map(), fights: new Map(), nodes: 0, maxNodes, fightNodes, fightCalls: 0 };
  const r = won(s) ? { v: valueOf(s, start), s } : search(s, start, depth, memo);
  const e = r.s;
  const kind = !won(e) ? null : e.conquers >= 2 ? "double conquest" : holds && e.conquers ? "hold + conquest" : holds ? "hold" : "other";
  return { win: won(e), score: e.score, gained: e.score[0] - startScore, line: e.log, kind, used: e.used, drew: e.drew, conquers: e.conquers,
    ctrl: e.ctrl, capped: memo.nodes > maxNodes, nodes: memo.nodes, fights: memo.fightCalls, blind: turnBlindSpots(pos) };
}

// What breaks a winning line: each card (from their list) added to their hand, re-solved.
export function breakers(pos, cards, opts = {}) {
  const out = [];
  const seen = new Set();
  for (const c of cards) {
    if (seen.has(c.n) || !((quick(c) && trick(c)) || counterOf(c))) continue;
    seen.add(c.n);
    const r = solveTurn({ ...pos, their: { ...pos.their, hand: [...(pos.their?.hand || []), c] } }, opts);
    if (!r.win) out.push(c.n);
  }
  return out;
}

// ── boards from model games: `try --close` ──
// Plays lib/match.mjs games against real field lists; on each of our turns from 5 points (after
// holds), solves the position and records what the greedy policy actually did from it. A close
// rate on model boards: how often a winning line existed, not a win rate.
import { playMatch, playerOf } from "./match.mjs";
import { rng } from "./sim.mjs";

export function closeReport(deck, cat, foeLists, { games = 200, seed = 11000, maxTurns = 12, breakCheck = 60, solve = {} } = {}) {
  const me = playerOf(deck.cards, cat);
  const them = foeLists.map((d) => ({ label: d.label, p: playerOf(d.cards, cat) })).filter((f) => f.p.main.length >= 30);
  const names = new Set([...me.main, ...(me.champ ? [me.champ] : [])].map((c) => c.n));
  const rows = [];
  let checked = 0;
  for (let i = 0; i < games && them.length; i++) {
    const f = them[i % them.length], r = rng(seed + i);
    const bfNames = [me.battlefields[i % Math.max(1, me.battlefields.length)] || null,
      f.p.battlefields.length ? f.p.battlefields[Math.floor(i / 2) % f.p.battlefields.length] : null];
    let pending = null;
    // From 6 (after holds): from 5 two conquests reach 7 at most, so no win exists to find.
    playMatch(me, f.p, r, { maxTurns, firstB: i % 2 === 1, bfNames, closeFrom: 6,
      onMain: (pos) => { pending = { pos, res: solveTurn(pos, solve), label: f.label, list: f.p.main, start: pos.score[0] }; },
      onMainEnd: ({ won: w, score: sc }) => {
        if (!pending) return;
        const row = { label: pending.label, start: Math.min(7, pending.start), win: pending.res.win, kind: pending.res.kind, gained: pending.res.gained,
          policyWon: w, policyGained: sc - pending.start, capped: pending.res.capped, blind: pending.res.blind,
          cards: pending.res.win ? [...new Set(pending.res.used)].filter((n) => names.has(n)) : [] };
        if (pending.res.win && checked < breakCheck) { checked++; row.breakers = breakers(pending.pos, pending.list, solve); }
        rows.push(row); pending = null;
      } });
  }
  const by = (k) => { const m = {}; for (const x of rows) { const v = k(x); if (v == null) continue; for (const y of [].concat(v)) m[y] = (m[y] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  const tiers = [6, 7].map((sc) => { const xs = rows.filter((x) => x.start === sc); const n = xs.length || 1;
    return { start: sc, n: xs.length, win: xs.filter((x) => x.win).length / n, policyWin: xs.filter((x) => x.policyWon).length / n,
      gained: xs.reduce((a, x) => a + x.gained, 0) / n, policyGained: xs.reduce((a, x) => a + x.policyGained, 0) / n }; });
  const wins = rows.filter((x) => x.win);
  return { games, positions: rows.length, tiers, kinds: by((x) => x.kind), cards: by((x) => x.cards), wins: wins.length,
    breakChecked: wins.filter((x) => x.breakers).length, breakers: by((x) => x.breakers), blind: by((x) => x.blind), capped: rows.filter((x) => x.capped).length,
    perFoe: Object.fromEntries(by((x) => x.label).map(([l, n]) => [l, { n, win: rows.filter((x) => x.label === l && x.win).length / n }])), rows };
}
