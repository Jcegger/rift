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
import { fight, AMBUSH_PLAYS } from "./fight.mjs";
import { compile, engineReads, condKind, condKnown, perKnown, UNPAID_COST, normalise } from "./cardtext.mjs";

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
// What a fight can use from hand besides tricks: counters, takeovers (Rebuttal), Unyielding Spirit, Decree of Focus (lib/fight.mjs movesOf).
// anySpeed: Kai'Sa, Rebel in the fight gives our spells [Reaction].
const fightSpell = (c, anySpeed = false) => !isUnit(c) && (anySpeed || quick(c)) && (trick(c) || !!fx(c).find((e) => e.kind === "counter") || /gain control of (?:it|a spell)|prevent all spell and ability damage|in combat with an enemy fury/i.test(c.x || ""));
const counterOf = (c) => fx(c).find((e) => e.kind === "counter");
const stops = (k, c) => (k.maxE != null ? (c.e || 0) <= k.maxE && (c.p || 0) <= (k.maxP ?? 99) : k.tax == null);
// Main-phase removal: one enemy unit at a battlefield.
const removalOf = (c) => isSpell(c) && fx(c).find((e) => (e.kind === "bounce" && !e.needsFour && !e.needsFriendly) || e.kind === "kill" || e.kind === "fight" || (e.kind === "damage" && !e.split && !e.many));
// A card's own-domain Power ([C], §135.2.e.6): on a multi-domain card "any power of that card's Domains" (§135.2.e.6.c:
// signature spells such as Public Execution, Body/Order). No domain: [A] (§135.2.e.6.b).
const dom = (c) => ((c.d || []).length > 1 ? c.d.slice() : (c.d || [])[0] || "rainbow");
const domOk = (d, x) => d === "rainbow" || x === d || (Array.isArray(d) && d.includes(x));

let ids = new WeakMap(), nextId = 0;
const idOf = (o) => { if (!ids.has(o)) ids.set(o, ++nextId); return ids.get(o); };

// ── what the solver reads: a card is read when every sentence of its text is one it plays ──
const READ_LINES = [MERC, MOVE_PULL, BLAST, /i don'?t deal combat damage/i, /if there are 4 or more units there, you may return an enemy unit there/i, /^when i (attack|defend|attack or defend), deal damage equal to my might to an enemy unit here/i];
const strip = (x) => String(x || "").replace(/\([^)]*\)/g, "").replace(/\[[A-Za-z' ]+(?: \d+)?\]/g, "").replace(/:rb_\w+:/g, "").trim();
// Whether the solver plays this card's text: lib/cardtext.mjs's compiler and the executor here.
// Their units in hand are never played by the solver (an Ambush into a fight isn't modelled).
export function turnReads(card, { inTheirHand = false } = {}) {
  if (!card) return false;
  // A unit in their hand matters on our turn only if they can play it then: [Ambush] into our fight, or a [Reaction] /
  // [Action] unit into a showdown at a battlefield they control (lib/fight.mjs plays its body and keywords, not its "When
  // you play me"). Any other unit can't be played on our turn, so its text can't change it (until 24 Nov every unit with
  // text was reported as a blind spot).
  if (inTheirHand && isUnit(card)) {
    const x = card.x || "";
    if (/\[Ambush\]|can be played to a battlefield you're attacking|\[(?:Reaction|Action)\]/i.test(x)) {
      const k = compile(card), plays = k.abilities.some((a) => /^play/.test(a.trigger) && (a.effects || []).some((e) => e.op !== "noTurn" && e.op !== "noop"));
      const norm = String(card.x || "").replace(/:rb_might:/g, "M").replace(/\s+/g, " ").toLowerCase();
      return engineReads(card, k).ok && (!plays || AMBUSH_PLAYS.some(([re]) => re.test(norm)));   // lib/fight.mjs plays these
    }
    return true;
  }
  return engineReads(card).ok;
}
export function turnBlindSpots(pos) {
  const out = new Set();
  for (const u of pos.units || []) if (!turnReads(u.card)) out.add(u.card.n);
  for (const c of [...(pos.hand || []), ...(pos.champ ? [pos.champ] : []), ...(pos.gear || [])]) if (!turnReads(c)) out.add(c.n);
  for (const c of pos.their?.hand || []) if (!turnReads(c, { inTheirHand: true })) out.add(c.n);
  for (const b of pos.down || []) for (const side of b) for (const c of side) if (!turnReads(c)) out.add(c.n);
  if (pos.legend?.card && !turnReads(pos.legend.card)) out.add(pos.legend.card.n);
  return [...out].sort();
}

// ── state ──
const clone = (s) => ({ ...s, units: s.units.map((u) => ({ ...u, gear: u.gear.slice() })), ctrl: s.ctrl.slice(), scored: s.scored.slice(), theirScored: s.theirScored.slice(),
  score: s.score.slice(), down: s.down.map((b) => [b[0].slice(), b[1].slice()]), hand: s.hand.slice(), gear: s.gear.slice(), gearMeta: s.gearMeta.slice(), legend: s.legend ? { ...s.legend } : null,
  runes: s.runes.map((r) => ({ ...r })), their: { ...s.their, hand: s.their.hand.slice(), budget: { ...s.their.budget } }, log: s.log.slice(), used: s.used.slice(),
  pool: s.pool.map((x) => ({ ...x })), gearUsed: s.gearUsed.slice(), hidNow: s.hidNow.slice(), trash: s.trash ? s.trash.slice() : null });
// Battlefields: A and B, and the Baron Pit once Baron Nashor adds it (a battlefield token is a battlefield, §185.2.d).
const BF = ["A", "B", "Pit"];
const bfsOf = (s) => s.ctrl.map((_, i) => i);
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
  // Auras from other friendly units; a tag aura ("Your Mechs have …") reaches every unit with the tag, its source included.
  for (const v of s.units) if (v.side === u.side) for (const st of compile(v.card).statics) {
    const self = v === u || v.uid === u.uid;
    if (st.tag ? !hasTag(u.card, st.tag) : self && !st.includeSelf) continue;
    if (st.empoweredOnly && !u.empowered) continue;   // Aurok General
    if ((st.buffedOnly && !u.buffed) || (st.tokenOnly && !u.card.token)) continue;   // Lee Sin, Centered; Soul Shepherd
    if (st.op === "aura" && (!st.here || v.at === u.at) && staticOn(s, v, st)) m += st.n;
    if (st.op === "auraKeyword" && (!st.here || v.at === u.at) && staticOn(s, v, st)) for (const k of st.keywords) kw.push(`[${k}]`);
  }
  // Our legend's auras ("Your units have +1 M", Wuju Master) and Purifier ("Your Equipment each give [Assault]").
  if (u.side === 0) for (const st of legendStatics(s)) {
    if (st.op === "aura" && !st.here && (!st.tag || hasTag(u.card, st.tag))) m += st.n;
    if (st.op === "auraKeyword" && !st.here && (!st.tag || hasTag(u.card, st.tag))) for (const k of st.keywords) kw.push(`[${k}]`);
    if (st.op === "equipAssault" && u.gear.length) kw.push(`[Assault ${u.gear.length}]`);
    // Wuju Bladesman: a friendly unit defending alone gets +2 (on our turn, only when they attack us: Faefolk's pull).
    if (st.op === "defendAlone" && s.fight && s.fight.attacker === 1 && u.at === s.fight.b && ours(s, u.at).length === 1) m += st.n;
  }
  // Leona, Zealot: stunned enemy units at her battlefield have -8, to a minimum of 1.
  if (u.stunned && s.units.some((v) => v.side !== u.side && v.at === u.at && compile(v.card).statics.some((x) => x.op === "leona"))) m = Math.max(1, m - 8);
  // Ancient Warmonger: [Assault] equal to the enemy units here. Gearhead: Equipment give double their Might.
  if (compile(u.card).statics.some((x) => x.op === "assaultPerEnemyHere")) { const n = s.units.filter((v) => v.side !== u.side && v.at === u.at).length; if (n) kw.push(`[Assault ${n}]`); }
  if (compile(u.card).statics.some((x) => x.op === "gearhead")) m += u.gear.reduce((a, g) => a + (g.m || 0), 0);
  // Repair Specialist: [Assault] equal to the number of gear we control.
  if (u.side === 0 && compile(u.card).statics.some((x) => x.op === "assaultPerGear")) { const n = s.gear.length + s.units.filter((v) => v.side === 0).reduce((a, v) => a + v.gear.length, 0); if (n) kw.push(`[Assault ${n}]`); }
  // Auras from our unattached gear: "Friendly units here have …" reaches units at the gear's battlefield; without "here", all of ours.
  if (u.side === 0) s.gear.forEach((g, i) => { for (const st of compile(g).statics) {
    if (st.op !== "aura" && st.op !== "auraKeyword") continue;
    if (st.here && gearAt(s, i) !== u.at) continue;
    if (st.tag && !hasTag(u.card, st.tag)) continue;
    if (st.cond && !condMet(s, st.cond, { side: 0, here: gearAt(s, i), gid: s.gearMeta[i].gid })) continue;   // "If I'm [Empowered]" reads the gear's own status
    if ((st.buffedOnly && !u.buffed) || (st.tokenOnly && !u.card.token)) continue;   // Spirit's Refuge
    if (st.op === "aura") m += st.n; else for (const k of st.keywords) kw.push(`[${k}]`);
  } });
  // For lib/fight.mjs: Gangplank, Naval's Empowered replacement; Esteemed Hierophant's 7+ runes (theirs aren't on the
  // board: read as met, the cautious side).
  // "I don't deal combat damage unless X" (Orianna, Exquisite; Sacred Protector): lib/fight.mjs reads the plain line, written only while X is false.
  let x0 = c.x || "";
  for (const st of compile(u.card).statics) if (st.op === "noCombat" && st.unless) {
    x0 = x0.replace(/I don'?t deal combat damage unless[^\n]*/gi, "").trim();
    if (!condMet(s, st.unless, { src: u, side: u.side, here: u.at })) x0 += "\nI don't deal combat damage.";
  }
  return { ...c, m, x: [x0, ...kw].filter(Boolean).join("\n"), _stunned: !!u.stunned, _dmg: u.dmg || 0, _prevent: u.prevent || 0,
    _empowered: !!u.empowered, _runes7: runes7(s, u.side), _moves: u.moves || 0 };
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
  if (/^time i'm \[empowered\]/.test(p)) return Number(u.empowered || 0);
  if (/^your points?/.test(p)) return s.score[u.side] || 0;   // Draven, Showboat
  if (/^of your units with \[temporary\] at my battlefield/.test(p)) return u.at < 0 ? 0 : s.units.filter((v) => v.side === u.side && v.at === u.at && keywordOf([v.card.x || "", ...(v.kw || [])].join("\n"), "Temporary").always > 0).length;   // Petal Pixie (herself included); printed or granted, not effCard (that recursed through her own count)
  if (/^buffed friendly unit at my battlefield/.test(p)) return mine.filter((v) => v.at === u.at && v.buffed).length + (u.buffed ? 1 : 0);
  return 0;
}
const ganks = (s, u) => !u.noMove && keywordOf(effCard(s, u).x, "Ganking").always > 0;
const ours = (s, at) => s.units.filter((u) => u.side === 0 && (at === undefined || u.at === at));
const theirs = (s, at) => s.units.filter((u) => u.side === 1 && (at === undefined || u.at === at));

// Paying, as lib/match.mjs pays: Energy from ready runes (not the Power colour first), Power from
// ready Gold, then recycling runes of that colour (exhausted ones first, so no Energy is lost).
// kind (what's being paid for): "unit", "gear", "spell", "unitAbility", "gearAbility", "legendAbility"; restricted Adds
// read it (legends, 24 Nov): Fire Below the Mountain's {A} only for gear and gear abilities, Iron Revenant's only for
// units or gear, Butcher of the Sands' Energy only for units and unit abilities.
function pay(s, e, d, q, spell = false, kind = null) {
  if (spell) { const fs = Math.min(s.spellE || 0, e); s.spellE = (s.spellE || 0) - fs; e -= fs; }   // Lux, Crownguard: Energy only for spells
  if (kind === "unit" || kind === "unitAbility") { const fu = Math.min(s.extraEUnits || 0, e); s.extraEUnits = (s.extraEUnits || 0) - fu; e -= fu; }
  const fromExtra = Math.min(s.extraE || 0, e); s.extraE -= fromExtra; e -= fromExtra;
  // Chem-Baroness within 3 points of victory: each Gold also adds [e1]; a Gold may pay Energy that way (its {A} goes to the pool).
  const renata = s.legend && compile(s.legend.card).statics.some((x) => x.op === "renataGold") && s.score[0] >= 5;
  if (renata) while (e > 0 && s.gold > 0 && s.runes.filter((r) => r.ready).length < e) { s.gold--; e--; s.pool.push({ d: "A" }); }
  // Added Power first ([Add] from Seal of Discord and the like; "use only to play spells" only on a spell).
  const okFor = (x) => !((x.spellsOnly && !spell) || (x.gearOnly && kind !== "gear" && kind !== "gearAbility") || (x.notSpells && (spell || /Ability/.test(kind || ""))));
  for (let i = s.pool.length - 1; i >= 0 && q > 0; i--) { const x = s.pool[i]; if (!okFor(x) || (!domOk(d, x.d) && x.d !== "A")) continue; s.pool.splice(i, 1); q--; s.spent++; }
  const ready = s.runes.filter((r) => r.ready).sort((a, b) => domOk(d, a.d) - domOk(d, b.d));   // spend Energy from runes we won't need for Power
  if (ready.length < e) return false;
  for (let i = 0; i < e; i++) ready[i].ready = false;
  const gold = Math.min(s.gold, q); let need = q - gold;
  const pool = s.runes.filter((r) => domOk(d, r.d) || r.d === "?").sort((a, b) => a.ready - b.ready);
  if (pool.length < need) return false;
  for (const r of pool) { if (!need) break; s.runes.splice(s.runes.indexOf(r), 1); need--; }
  s.gold -= gold; s.spent += q;
  if (renata && gold) s.extraE = (s.extraE || 0) + gold;   // the Gold's extra [e1] each
  return true;
}
// Our fight budget's Power by domain (lib/fight.mjs canPay): runes by domain (recycled for Power, ready or not), and
// Gold, unknown-domain runes and added Power as "any".
const domBudget = (s) => {
  const dom = {}; let any = s.gold + s.pool.length;
  for (const r of s.runes) if (r.d === "?") any++; else dom[r.d] = (dom[r.d] || 0) + 1;
  return { dom, any };
};
const budgetOf = (s) => ({ e: s.runes.filter((r) => r.ready).length + (s.extraE || 0) + (s.spellE || 0) + (s.extraEUnits || 0) + (s.legend?.ready && compile(s.legend.card).statics.some((x) => x.op === "showdownEnergy") ? 1 : 0), p: s.gold + s.runes.length + s.pool.length });

// [Hunt X]: "When I Conquer or Hold, my controller gains X XP" (§823.1.c.1), summed across a unit's Hunt (§823.2). It's the
// Conquer itself, so it pays even when the point is swapped for a draw at the gate.
function hunt(s, b, side) {
  const x = s.units.filter((u) => u.side === side && u.at === b).reduce((n, u) => n + keywordOf(effCard(s, u).x, "Hunt").always, 0);
  if (!x) return;
  if (side === 0) { s.xp = (s.xp || 0) + x; s.xpGained = true; } else s.their.xp = (s.their.xp || 0) + x;
  s.log.push(`  ${side === 0 ? "you" : "they"} gain ${x} XP (Hunt)`);
}
function score(s, b, side) {
  if (side === 1 && hasStatic(s, 0, "noOppPoints")) return;   // Tianna Crownguard at a battlefield: they can't gain points
  const scored = side === 0 ? s.scored : s.theirScored;
  if (scored.includes(b)) return;
  scored.push(b);
  if (side === 0) s.conqueredN = (s.conqueredN || 0) + 1;   // Bloodscent Swarm counts battlefields conquered (a draw at the gate still conquered)
  hunt(s, b, side);
  if (s.score[side] >= 7 && scored.length < s.ctrl.length) { if (side === 0) { s.drew++; s.log.push(`  ${BF[b]} conquered at 7: the 8th point needs every battlefield scored (§473.1.b.1), so you draw instead`); } return; }
  s.score[side]++;
  if (side === 0) s.conquers++;
  s.log.push(`  ${side === 0 ? "you" : "they"} conquer ${BF[b]} → ${s.score[side]}`);
}
const won = (s) => !!s.wonGame || (s.score[0] >= 8 && s.score[0] > s.score[1]);

// Rogue Assassin (our legend, ready and Empowered): "{T}: If it's your turn, move a friendly unit in a showdown to base and
// if I'm [Empowered], ready it." When we attack into their units, the combat is resolved both ways (as is, and with our
// strongest attacker sent home ready before damage) and the better is kept by a look ahead (bestResult).
function resolveAt(s, b, attacker, memo, noRescue = false) {
  const can = !noRescue && attacker === 0 && s.legend?.ready && s.legend.empowered && legendHas(s, "akaliRescue") && ours(s, b).length && theirs(s, b).length;
  if (!can) return resolveCore(s, b, attacker, memo);
  const pre = clone(s), y = clone(s);
  y.akaliTry = true; resolveCore(y, b, attacker, memo); y.akaliTry = false;   // the rescue happens after the attack triggers
  resolveCore(s, b, attacker, memo);
  const best = bestResult([clone(s), y], pre, 0, memo);
  if (best) Object.assign(s, best);
}
// A combat (or an uncontested arrival) at b. attacker: 0 us, 1 them.
function resolveCore(s, b, attacker, memo) {
  const us = ours(s, b), them = theirs(s, b);
  if (!us.length && !them.length) return;
  if (!them.length && s.ctrl[b] === 0) return;
  if (!us.length) return;   // their units arriving where we have none: not on our turn
  const map = new Map();
  const us1 = ours(s, b), them1 = theirs(s, b);
  if (!us1.length || (!them1.length && them.length)) { if (us1.length && !them1.length && s.ctrl[b] !== 0) conquerBf(s, b, memo); return; }
  us.splice(0, us.length, ...us1); them.splice(0, them.length, ...them1);
  s.fight = { b, attacker };   // for "while I'm attacking with another unit" and "one on one"
  // Attack and defend triggers the fight calculator doesn't play itself (it plays the blast and
  // Disarm): run first, on the strongest target (a heuristic, not a search). Then both sides are read
  // again, so their pumps, stuns and kills reach the fight (until 23 Nov the Might was taken before them).
  for (const [side, us2] of [[attacker, attacker === 0 ? us : them], [1 - attacker, attacker === 0 ? them : us]]) for (const u0 of us2) {
    const u = unitRef(s, u0); if (!u) continue;
    const role = side === attacker ? "attack" : "defend";
    for (const a of compile(u.card).abilities.filter((x) => (x.trigger === role || x.trigger === "attackOrDefend" || (role === "attack" && x.trigger === "playOrAttack")) && !(x.effects || []).every((e) => e.op === "damage" && e.n === "myMight" && e.target?.who === "each"))) {
      const v = unitRef(s, u0); if (!v) continue;
      // Each choice of target, then the one that leaves this fight best for the trigger's side (their Might there lowest, ours highest).
      const res = runAbility(s, a, { side, src: v, here: b }, memo, false);
      const edge = (x) => x.units.filter((w) => w.at === b).reduce((n, w) => n + (w.side === side ? 1 : -1) * mightOf(x, w), 0);
      const best = res.reduce((m, x) => (edge(x) > edge(m) ? x : m), res[0] || s);
      if (best && best !== s) Object.assign(s, best);
    }
  }
  // Our gear's fight triggers: Mask of Foresight (a friendly unit attacks or defends alone: +1 to it), Demacian Standard
  // (friendly units attack here: +2 to one of them, the strongest).
  { const now = ours(s, b);
    if (now.length) s.gear.forEach((g, i) => { for (const a of compile(g).abilities) {
      if (a.trigger === "allyFights" && (!/alone/i.test(a.text) || now.length === 1)) runAbility(s, a, { side: 0, ref: [unitRef(s, now[0]) || now[0]], here: b, card: g, fromGear: true }, memo, true);
      if (a.trigger === "allyAttacksHere" && attacker === 0 && gearAt(s, i) === b) { const best = ours(s, b).sort((x, y) => mightOf(s, y) - mightOf(s, x))[0]; if (best) runAbility(s, a, { side: 0, ref: [best], here: b, card: g, fromGear: true }, memo, true); }
    } }); }
  us.splice(0, us.length, ...ours(s, b)); them.splice(0, them.length, ...theirs(s, b));
  if (s.akaliTry && us.length && them.length) {
    s.akaliTry = false;
    const pick = us.slice().sort((x, z) => mightOf(s, z) - mightOf(s, x))[0];
    s.legend.ready = false; pick.at = -1; pick.ready = true;
    s.log.push(`  ${s.legend.card.n}: ${pick.card.n} leaves the showdown for base, readied`);
    us.splice(0, us.length, ...ours(s, b));
  }
  if (!us.length || !them.length) s.fight = null;
  if (!us.length) return;
  if (!them.length) { if (s.ctrl[b] !== 0) conquerBf(s, b, memo); return; }
  const mine = us.map((u) => { const c = effCard(s, u); map.set(c, u); return c; });
  // Their units as they are now too (this turn's -M, their auras, stuns), not the printed card.
  const foes = them.map((u) => { const c = effCard(s, u); map.set(c, u); return c; });
  // Vilemaw: "Enemy units here with less M than me don't deal combat damage." fight() reads that line from a unit's text.
  for (const [side, xs] of [[0, foes], [1, mine]]) {
    const vm = Math.max(0, ...s.units.filter((u) => u.side === side && u.at === b && compile(u.card).statics.some((x) => x.op === "vilemaw")).map((u) => mightOf(s, u)));
    if (vm) for (const c of xs) if ((c.m || 0) < vm) c.x = `${c.x || ""}\nI don't deal combat damage.`;
  }
  const ambush = (c) => isUnit(c) && /\[Ambush\]|can be played to a battlefield you're attacking/i.test(c.x || "");
  // Kai'Sa, Rebel in this fight: that side's spells have [Reaction] (lib/fight.mjs side.allReaction).
  const kaisa = (side) => s.units.some((u) => u.side === side && u.at === b && compile(u.card).statics.some((x) => x.op === "kaisa"));
  const ourHand = s.hand.filter((c) => fightSpell(c, kaisa(0)) || (ambush(c) && attacker === 0 ? /attacking|\[Ambush\]/i.test(c.x || "") : ambush(c)));
  const quickUnit = (c) => isUnit(c) && s.ctrl[b] === 1 && /\[(?:Reaction|Action)\]/i.test(c.x || "");   // to a battlefield they control
  const theirHand = s.their.locked ? [] : s.their.hand.filter((c) => (fightSpell(c, kaisa(1)) || ambush(c) || quickUnit(c)) && !(s.their.noSpells && isSpell(c)) && !(isUnit(c) && hasStatic(s, 0, "wardenNoAmbush")));   // Mageseeker Warden: their units only to base
  // Elder Dragon anywhere on a side: that side's damage kills any enemy unit it reaches.
  const killsFor = (side) => s.units.some((u) => u.side === side && compile(u.card).statics.some((x) => x.op === "anyDamageKills"));
  // Imperial Decree: any unit dealt damage this turn dies, on both sides.
  // Helm of Suppression (ours) taxes their spells; Fallen Feline (ours, at a battlefield) bans the spell names it named.
  // Ava Achiever attacking: one [Hidden] card from our hand, for {Mind} (lib/fight.mjs avaHand).
  const avaHand = attacker === 0 && ours(s, b).some((u) => compile(u.card).statics.some((x) => x.op === "ava")) ? s.hand.filter((c) => /\[Hidden\]/i.test(c.x || "") && !ourHand.includes(c)) : [];
  const ourSide = { units: mine, hand: ourHand, avaHand, allReaction: kaisa(0), faceDownOwned: s.down.some((x) => x[0].length), budget: { ...budgetOf(s), ...domBudget(s) }, anyDamageKills: killsFor(0) || !!s.decree, fog: !!s.fog };
  const theirSide = { units: foes, hand: theirHand, allReaction: kaisa(1), faceDownOwned: s.down.some((x) => x[1].length), budget: { ...s.their.budget }, anyDamageKills: killsFor(1) || !!s.decree, tax: helmTax(s), banned: felineBanned(s) };
  let r;
  const key = `F|${b}|${attacker}|${mine.map((c) => `${idOf(map.get(c))}:${c.m}`).join(",")}|${foes.map((c) => `${idOf(map.get(c))}:${c.m}${c._stunned ? "s" : ""}`).join(",")}|${ourHand.map(idOf).join(",")}|${theirHand.map(idOf).join(",")}|${ourSide.budget.e}/${ourSide.budget.p}/${JSON.stringify(ourSide.budget.dom)}${ourSide.budget.any}|${theirSide.budget.e}/${theirSide.budget.p}/${JSON.stringify(theirSide.budget.dom || "")}${theirSide.budget.any ?? ""}|${s.down[b].map((x) => x.map(idOf).join("+")).join("/")}|${+ourSide.anyDamageKills}${+theirSide.anyDamageKills}|${+ourSide.faceDownOwned}${+theirSide.faceDownOwned}${+ourSide.allReaction}${+theirSide.allReaction}|${[...mine, ...foes].map((c) => `${(c.x || "").length}${c._runes7 ? "r" : ""}`).join(",")}`;   // text: Orianna's "unless" line comes and goes
  // A cached fight holds the card objects of the call that ran it: survivors are translated by position.
  let alive;
  if (memo.fights.has(key)) { const hit = memo.fights.get(key); r = hit.r; const was = new Set(r.end.alive.map((x) => x.card)); alive = new Set([...hit.mine.map((c, i) => (was.has(c) ? mine[i] : null)), ...hit.foes.map((c, i) => (was.has(c) ? foes[i] : null)), ...r.end.alive.map((x) => x.card)].filter(Boolean)); }
  else {
    r = attacker === 0
      ? fight(ourSide, { ...theirSide, faceDown: s.their.locked || saboteurAt(s, b) ? [] : s.down[b][1].filter((c) => !(s.their.noSpells && isSpell(c))), base: theirs(s, -1).map((u) => u.card) }, { maxPlies: 8, maxNodes: memo.fightNodes })
      : fight(theirSide, { ...ourSide, faceDown: s.down[b][0].slice(), base: ours(s, -1).map((u) => effCard(s, u)) }, { maxPlies: 8, maxNodes: memo.fightNodes });
    memo.fights.set(key, { r, mine, foes }); memo.fightCalls++;
    alive = new Set(r.end.alive.map((x) => x.card));
  }
  const [endUs, endThem] = attacker === 0 ? [r.end.budgetA, r.end.budgetD] : [r.end.budgetD, r.end.budgetA];
  const [spentUs, spentThem] = attacker === 0 ? [r.end.spentA, r.end.spentD] : [r.end.spentD, r.end.spentA];
  // Our resources spent in the fight: Energy from ready runes, Power from Gold then runes.
  const b0 = ourSide.budget, eUsed = Math.max(0, b0.e - endUs.e), pUsed = Math.max(0, b0.p - endUs.p);
  // Scorn of the Moon's [e1] for showdowns (in the budget while the legend is ready): spent when the fight used more than the rest.
  let eLeft = eUsed;
  if (s.legend?.ready && compile(s.legend.card).statics.some((x) => x.op === "showdownEnergy") && eUsed > b0.e - 1) { s.legend.ready = false; eLeft--; s.log.push(`  ${s.legend.card.n}: [Add] [e1] in the showdown`); }
  // Power by the domains the fight spent (lib/fight.mjs spend), then what came from Gold and added Power.
  if (eLeft) pay(s, eLeft, "rainbow", 0);
  let pLeft = pUsed;
  for (const [d, n] of Object.entries(b0.dom || {})) { const k = Math.min(pLeft, n - (endUs.dom?.[d] ?? n)); if (k > 0 && pay(s, 0, d, k)) pLeft -= k; }
  if (pLeft) pay(s, 0, "rainbow", pLeft);
  s.their.budget = { ...endThem };   // with what's left of their Power by domain, when the position gave it
  s.used.push(...spentUs.map((c) => c.n));
  // A unit that ambushed in from hand and survived stays at the battlefield (until 24 Nov it vanished with the card).
  for (const c of spentUs) { const i = s.hand.indexOf(c); if (i > -1) { s.hand.splice(i, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 0, b, false)); } else { const j = s.down[b][0].indexOf(c); if (j > -1) s.down[b][0].splice(j, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 0, b, false)); } }
  for (const c of spentThem) { const i = s.their.hand.indexOf(c); if (i > -1) { s.their.hand.splice(i, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 1, b, false)); } else { const j = s.down[b][1].indexOf(c); if (j > -1) s.down[b][1].splice(j, 1); if (isUnit(c) && alive.has(c)) s.units.push(mkUnit(c, 1, b, false)); } }
  const logAt = s.log.length;   // the fight's own line goes here, before what its deaths set off (Deathknells)
  // Sent home by an ambusher's play effect (Janna, Savior): not dead, at base. A cached fight's cards map by position.
  const homeCards = new Set(r.end.home || []), cardOfU = (u) => [...map].find(([, v]) => v === u)?.[0];
  const isHome = (u) => { const c = cardOfU(u); if (homeCards.has(c)) return true; const hit = memo.fights.get(key); if (!hit || hit.mine === mine) return false; const i = mine.indexOf(c), j = foes.indexOf(c); return (i > -1 && homeCards.has(hit.mine[i])) || (j > -1 && homeCards.has(hit.foes[j])); };
  const homeUs = us.filter(isHome), homeThem = them.filter(isHome);
  const deadUs = us.filter((u) => !alive.has(cardOfU(u)) && !homeUs.includes(u)), deadThem = them.filter((u) => !alive.has(cardOfU(u)) && !homeThem.includes(u));
  for (const u of [...homeUs, ...homeThem]) { u.at = -1; s.log.push(`  ${u.side === 0 ? "your" : "their"} ${u.card.n} is sent to base`); }
  const lone = new Map([...deadUs, ...deadThem].map((u) => [u, aloneAt(s.units, u)]));   // dying together isn't alone
  s.units = s.units.filter((u) => !deadUs.includes(u) && !deadThem.includes(u));
  s.kills += deadThem.length; s.died = (s.died || 0) + deadUs.length + deadThem.length;
  if (deadThem.length) fireLegend(s, "legendEnemyDies", {}, memo);
  for (const u of deadUs) if (!u.banishOnDie) toTrash(s, u.card);
  for (const u of [...deadUs, ...deadThem]) if (!u.banishOnDie) deathknell(s, u, b, memo, lone.get(u));   // banished instead (Smite): no Deathknell
  // "When one or more friendly units die" (Demacian Illuminators): once for the combat's deaths on each side.
  for (const side of [0, 1]) if ([...deadUs, ...deadThem].some((u) => u.side === side && !u.banishOnDie)) fire(s, s.units.filter((v) => v.side === side), "friendliesDie", {}, memo);   // at the battlefield they died at (Kog'Maw, Caustic)
  // "When I die in combat" (Draven, Audacious: they score 1).
  for (const u of [...deadUs, ...deadThem]) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "dieInCombat")) runAbility(s, a, { side: u.side, src: null, card: u.card, here: b }, memo, true);
  // "When a combat that I was in ends" (Mournful Witness), for the units that came out of it.
  fire(s, [...us, ...them], "combatEnds", { here: b }, memo);
  const verb = them.length ? `fight at ${BF[b]} (${attacker === 0 ? "you attack" : "they attack"}): ${mine.map((c) => `${c.n} ${c.m}`).join(" + ")} vs ${foes.map((c) => `${c.n} ${c.m || 0}`).join(" + ")}${s.down[b][attacker === 0 ? 1 : 0].length ? " + face down" : ""}`
    : `walk into ${BF[b]}${theirHand.length ? " (they may answer)" : ""}`;
  // fight() writes its line from the defender's side ("you" defend); when we attack, swap the words.
  const line = attacker === 0 ? r.line.map((l) => l.replace(/^(you|they)\b/, (w) => (w === "you" ? "they" : "you")).replace(/^you: flip/, "they: flip")) : r.line;
  s.log.splice(logAt, 0, `  ${verb}${line.length ? ` · ${line.join(" · ")}` : ""}`);
  s.fight = null;
  const outcome = r.outcome;   // the defender's view: hold, trade, conquer
  const atk = attacker, def = 1 - attacker;
  const sideUnits = (side) => s.units.filter((u) => u.side === side && u.at === b);
  if (outcome === "conquer" || (!them.length && sideUnits(0).length)) {
    if (s.ctrl[b] !== atk) {
      if (atk === 0) conquerBf(s, b, memo, attacker === 0 ? r.end.excessA || 0 : 0);
      else { s.ctrl[b] = atk; s.down[b][def] = []; score(s, b, atk); }
      // Grim Resolve: "When it wins a combat this turn, gain 2 XP."
      // "The first time I win a combat each turn" (Draven, Audacious: you score 1).
      if (atk === 0 && them.length) for (const u of ours(s, b)) if (!u.wonOnce) { u.wonOnce = true; fire(s, [u], "winCombat", { here: b }, memo); }
      if (atk === 0 && them.length) fireLegend(s, "youWinCombat", { here: b }, memo);   // Voidreaver: gain 1 XP
      if (atk === 0 && them.length) for (const u of ours(s, b)) if (u.winXp) { s.xp = (s.xp || 0) + u.winXp; s.xpGained = true; s.log.push(`  ${u.card.n} won a combat: you gain ${u.winXp} XP`); }
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

// We take battlefield b: by a fight or by walking in (until 24 Nov a walk-in scored but skipped "When I conquer" triggers).
// excess: combat damage past lethal we assigned after an attack (Tryndamere, Barbarian; Sivir, Ambitious).
function conquerBf(s, b, memo, excess = 0) {
  const open = s.ctrl[b] == null;   // Yone, Blademaster: "an open battlefield" (uncontrolled; our units were the only ones there)
  s.ctrl[b] = 0; s.down[b][1] = []; score(s, b, 0);
  // Conquer triggers of the units that took it (Lucian, Merciless: ready me).
  const ctimes = 1 + ours(s, b).filter((u) => compile(u.card).statics.some((x) => x.op === "conquerTwiceHere")).length;   // Red Brambleback
  for (let ct = 0; ct < ctimes; ct++) for (const u of ours(s, b)) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "conquer" || x.trigger === "playAndConquer" || x.trigger === "playOrScore" || x.trigger === "conquerOrHold" || (open && x.trigger === "conquerOpen"))) runAbility(s, a, { side: 0, src: u, here: b, excess }, memo, true);
  // Our legend: "When you conquer" (The Boss, Blade Dancer, Piltover Enforcer), "When you conquer or hold" (Deceiver).
  for (const trig of ["legendConquer", "youConquerOrHold"]) fireLegend(s, trig, { here: b, excess }, memo);
  // Sivir, Ambitious: "When I conquer after an attack, if you assigned 5 or more excess damage to enemy units, you may deal
  // that much to an enemy unit." Anywhere: the most valuable enemy it kills (a defender at a battlefield first), else none.
  if (excess >= 5 && ours(s, b).some((u) => compile(u.card).statics.some((x) => x.op === "excessStrike"))) {
    const tgt = theirs(s).filter((u) => mightOf(s, u) - (u.dmg || 0) <= excess).sort((x, y) => (y.at >= 0) - (x.at >= 0) || mightOf(s, y) - mightOf(s, x))[0];
    if (tgt) { s.log.push(`  Sivir, Ambitious: ${excess} excess damage to their ${tgt.card.n} (${where(tgt.at)})`); applyOp(s, { op: "damage", n: excess }, [tgt], { side: 0, here: b }, memo); }
  }
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
      case "empowered": return !!me?.empowered || (!me && ctx.gid != null && gearEmp(s, ctx.gid)) || (!me && !!ctx.legend && !!s.legend?.empowered);   // a gear's (gearMeta) or our legend's own status
      case "mighty": return !!me && mightOf(s, me) >= 5;
      case "buffed": return !!me?.buffed;
      case "stunned": return [].concat(ctx.ref || []).some((u) => u.stunned);
      case "notYourTurn": return side !== 0;
      case "fromFaceDown": return side === 0 && !!ctx.faceDown;   // the solver only plays our turn
      case "runeCount": return side === 0 && s.runes.length >= Number(m[1]);   // their runes aren't on the board
      case "oppNear": return s.score[1 - side] >= 8 - Number(m[1]);
      case "controlTag": { const tag = (m[1] || m[2]).toLowerCase(); return mine.some((u) => (u.card.g || []).some((g) => g.toLowerCase() === tag || g.toLowerCase() + "s" === tag)); }
      case "gearCount": return (side === 0 ? s.gear.length + s.units.filter((u) => u.side === 0).reduce((a, u) => a + u.gear.length, 0) : 0) >= (NUMW[m[1]] || Number(m[1]));
      case "faceDownBf": return bfsOf(s).some((b) => s.down[b][side].length && (!/here/i.test(raw) || b === ctx.here));
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
      case "empoweredThrice": return Number(me?.empowered || 0) >= 3;
      case "not": { const inner = m[1].split("|").join("; "); return condKnown(inner) && !condMet(s, inner, ctx); }
      case "fromHand": return !!ctx.fromHand;
      case "diedAlone": return ctx.diedAlone === true;
      case "notDiedAlone": return ctx.diedAlone === false;
      case "stunnedEnemyHere": { const at = me ? me.at : ctx.here; return at != null && s.units.some((v) => v.side !== side && v.at === at && v.stunned); }
      case "selfEmpowered": return !!me?.empowered || (!me && ctx.gid != null && gearEmp(s, ctx.gid)) || (!me && !!ctx.legend && !!s.legend?.empowered);
      case "anyEmpowered": return mine.some((u) => u.empowered);
      case "refBuffed": return [].concat(ctx.ref || []).some((u) => (unitRef(s, u) || u).buffed);
      case "refMaxMight": return [].concat(ctx.ref || []).some((u) => mightOf(s, unitRef(s, u) || u) <= Number(m[1]));
      case "refEnemy": return [].concat(ctx.ref || []).some((u) => u.side !== side);
      case "refFriendly": return [].concat(ctx.ref || []).some((u) => u.side === side);
      case "beginningPhase": return false;   // the solver searches the Main Phase (Beginning-Phase triggers run before it)
      case "readyEnemyHere": { const at = me ? me.at : ctx.here; return at != null && at >= 0 && s.units.some((v) => v.side !== side && v.at === at && v.ready !== false); }
      case "oneOtherHere": { const at = me ? me.at : ctx.here; if (/battlefield/i.test(raw) && !(at >= 0)) return false; return mine.filter((u) => u.at === at && u.uid !== me?.uid).length === 1; }
      case "undamaged": return !(me?.dmg > 0);
      case "deployGearHere": { const at = me ? me.at : ctx.here; return side === 0 && at >= 0 && s.gear.some((g, i) => gearAt(s, i) === at && compile(g).keywords.Deploy); }
      case "runesMax": return side === 0 && s.runes.length <= Number(m[1]);
      case "runesMin": return side === 0 && s.runes.length >= Number(m[1]);
      case "playedToBfSelf": return !!ctx.self && ctx.here != null && ctx.here >= 0;
      case "crowdAtMyBf": { if (!me || me.at < 0) return false; const n = mine.filter((u) => u.uid !== me.uid && u.at === me.at).length + (side === 0 ? s.gear.filter((g, i) => gearAt(s, i) === me.at).length : 0); return n >= Number(m[1]); }
      case "unitDied": return (s.died || 0) > 0;
      case "notNearVictory": return s.score[side] < 8 - Number(m[1]);
      case "discarded": return (s.discarded || 0) > 0;   // discards paid as activation costs
      case "level": return (side === 0 ? s.xp || 0 : s.their.xp || 0) >= Number(m[1]);
      case "noOpenBf": return !bfsOf(s).some((b) => s.ctrl[b] == null && !s.units.some((u) => u.at === b));
      case "refEmpowered": return [].concat(ctx.ref || []).some((u) => (unitRef(s, u) || u).empowered);
      case "bfTwoUnits": return bfsOf(s).some((b) => s.ctrl[b] === side && s.units.filter((u) => u.at === b).length === 2);
      case "twoThere": return ctx.here != null && ctx.here >= 0 && mine.filter((u) => u.at === ctx.here).length === 2;
      case "attackingWithAnother": return !!s.fight && s.fight.attacker === side && !!me && me.at === s.fight.b && mine.filter((u) => u.at === s.fight.b).length > 1;
      case "oneOnOne": return !!s.fight && !!me && me.at === s.fight.b && mine.filter((u) => u.at === s.fight.b).length === 1 && s.units.filter((u) => u.side !== side && u.at === s.fight.b).length === 1;
      case "choseEnemy": return !!s.choseEnemy;
      case "oppStunned": return s.units.some((u) => u.side !== side && u.stunned);
      case "allFourTags": return tagsAmong(s, side) >= 4;
      case "playedAllThree": return !!s.playedKinds && ["unit", "gear", "spell"].every((k) => s.playedKinds.includes(k));
      case "fourAndFour": return side === 0 && s.hand.length === 4 && s.units.filter((u) => u.side === 0 && u.at >= 0).length === 4;
      // 24 Nov, polish.
      case "excess": return (ctx.excess || 0) >= Number(m[1]);   // Tryndamere, Barbarian: passed in by the conquest after an attack
      case "fightAlone": return !!s.fight && !!me && me.at === s.fight.b && mine.filter((u) => u.at === s.fight.b).length === 1;
      case "bigSpell": return side === 0 && (s.maxSpellE || 0) >= Number(m[1]);
      case "lastSpellBig": return side === 0 && (s.lastSpellE || 0) >= Number(m[1]);
      case "xpGained": return side === 0 ? !!s.xpGained : false;
      case "beginDeath": return side === 0 && !!s.beginDeaths;
      // Their rune count comes from the position (pos.their.runes); unknown is not met. Ours at the start of the Beginning
      // Phase is before this turn's Channel Phase: the runes now less the two channelled (none at the 12-rune cap).
      case "fewerRunes": return side === 0 && s.their.runes != null && s.runesAtBeginning < s.their.runes;
      case "refAttacking": { const r = [].concat(ctx.ref || [])[0]; return !!r && !!s.fight && s.fight.attacker === r.side && r.at === s.fight.b; }
      case "gearHere": return side === 0 && !!me && me.at >= 0 && (s.gear.some((g, i) => gearAt(s, i) === me.at) || mine.some((u) => u.at === me.at && u.gear.length));
      case "inShowdown": return !!s.fight && !!me && me.at === s.fight.b;
      case "playedEquip": return side === 0 && !!s.playedEquip;   // Emperor of the Sands
      case "petInTrash": return side === 0 && !!s.trash && s.trash.some((c) => trashPlayable(c, 2, 1) && TAGS4.some((g) => hasTag(c, g)));   // Undying Loyalty
      default: return false;
    }
  });
}
// Ops this executor plays outside combat.
export const RUN_OPS = new Set(["gold", "swapTwo", "score", "chooseBf", "strip", "discountNext", "redeploy", "prevent", "swapPlaces", "damage", "might", "swing", "stun", "kill", "banish", "bounce", "bounce2", "recall", "ready", "exhaust", "move", "token", "buff",
  "keyword", "add", "channel", "readyRunes", "lock", "protect", "noMove", "heal", "edict", "empower", "fight", "choose", "noTurn", "noop", "attach", "baseMight", "enterReadyTurn", "nextUnitAnywhere", "winGame", "addPit", "bomb", "killGear", "freeGear", "moveGear", "xp", "decree", "winXp", "buffOnPlay", "pullFromHand", "nextUnitReady", "disempower", "discard", "playSelf", "noSpells", "takeControl", "foxFire", "readyUpTo", "edictThere", "theirDiscard", "bulletTime", "returnAll", "doubleDamage", "scoreOpp", "buffPlus", "powerToEnergy", "detach", "attachEquip", "spellBonusNext", "dieOnDamage", "tentacles", "possess", "equipFromHand", "duel", "theirEdict", "bounceTotal", "overt", "energyToPower", "kato", "noSpellDamage", "nameSpell", "readyLegend", "profiteer", "theirMove", "whirlwind", "judgment", "invert", "chronobreak", "portalRepeat", "splitKill", "grantReady", "grenade", "attachToRef", "takeEquipFromRef", "playLesser", "hwei", "akshan", "fromTrash", "readyGear", "moveEquip"]);
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
    if (spec.tag && !hasTag(u.card, spec.tag)) return false;
    if (spec.token && !u.card.token) return false;
    if (spec.namedTag) return false;
    // The List: a unit with the named tag. Played this turn (no name yet), the naming is the tag of the
    // unit it will hit: {T} works once a turn, so naming as it's played and choosing the unit later come to the same thing.
    if (spec.listTag) { const nm = ctx.gid != null ? s.gearMeta.find((m) => m.gid === ctx.gid)?.named : null; if (nm ? !hasTag(u.card, nm) : !(u.card.g || []).length) return false; }
    if (spec.exhausted && u.ready) return false;
    const r0 = [].concat(ctx.ref || [])[0], rr = r0 && (unitRef(s, r0) || r0);
    if (spec.lessThanRef && !(rr && mightOf(s, u) < mightOf(s, rr))) return false;   // Public Execution
    if (spec.where === "refLoc" && !(rr && rr.at >= 0 && u.at === rr.at)) return false;   // Heroic Charge: at its location
    if (spec.otherThanRef && rr && u.uid === rr.uid) return false;   // Crescent Strike: each other enemy there
    if (spec.damaged && !(u.dmg > 0)) return false;   // Warwick, Hunter
    if (spec.notTag && hasTag(u.card, spec.notTag)) return false;   // Ocean Drake
    if (spec.equipped && !u.gear.length) return false;   // Strike Down
    if (spec.domain && !(u.card.d || []).includes(spec.domain)) return false;   // the Decrees: an enemy Calm / Chaos / Body unit
    if (spec.empoweredOnly && !u.empowered) return false;   // Sanction
    if (spec.lessThanMe && !(ctx.src && mightOf(s, u) < mightOf(s, unitRef(s, ctx.src) || ctx.src))) return false;   // "with less M than me" (parsed since 22 Nov, enforced 24 Nov)
    if (spec.notLastExhausted && s.lastExhausted && u.uid === s.lastExhausted.uid) return false;   // Forgotten Signpost   // The List: the named tag isn't known from a position
    if (spec.choose !== false && u.side !== ctx.side && (u.protected || compile(u.card).statics.some((x) => x.op === "untargetable"))) return false;
    return true;
  });
}
function targetSets(s, spec, ctx) {
  if (!spec) return [[]];
  if (spec.who === "me") return ctx.src ? [[ctx.src]] : [[]];
  if (spec.who === "it") return [[].concat(ctx.ref || [])];
  if (spec.who === "it2") return [[].concat(ctx.ref2 || [])];
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
// ── gear on the board: s.gear (cards) and s.gearMeta ({ at, gid }), index-aligned; at -1 is base ──
// A Bomb (§187.12): a gear token with [Deploy] and "[Deathknell][>] Deal 2 to an enemy unit here and kill all other Bombs you control here."
export const BOMB = { n: "Bomb token", t: "Gear", token: true, g: ["Bomb"], x: "[Deploy]" };
const isBomb = (g) => !!g?.token && (g.g || []).includes("Bomb");
const gearAt = (t, i) => t.gearMeta?.[i]?.at ?? -1;
let nextGid = 0;
function addGear(t, card, at) { t.gear.push(card); t.gearMeta.push({ at, gid: ++nextGid }); return t.gearMeta[t.gearMeta.length - 1].gid; }
function dropGear(t, i) { t.gear.splice(i, 1); t.gearMeta.splice(i, 1); }
const amplifiersAt = (t, at) => (at < 0 ? 0 : t.gear.filter((g, i) => gearAt(t, i) === at && compile(g).statics.some((x) => x.op === "deathknellTwiceHere")).length);
// Ziggs, Short-Fused: "Abilities of friendly gear deal 1 Bonus Damage."
const gearBonus = (t, side) => t.units.filter((u) => u.side === side).reduce((n, u) => n + compile(u.card).statics.filter((x) => x.op === "gearBonusDamage").reduce((a, x) => a + (x.n || 1), 0), 0);
// One of our gear dies (index i). A Bomb takes the other Bombs we control there with it, and each Deathknell deals 2
// to an enemy unit there: branched over the targets, deduplicated, capped. Other gear runs its own Deathknell.
function killGearAt(t, i, memo) {
  const g = t.gear[i], at = gearAt(t, i);
  dropGear(t, i);
  t.log.push(`  your ${g.n}${at >= 0 ? ` (${BF[at]})` : ""} dies`);
  // Battlefield Armorer: a friendly gear that dies at a battlefield may go back to hand for [e1] (a token stops existing).
  const armorer = at >= 0 && !g.token && ours(t).some((u) => compile(u.card).abilities.some((x) => x.trigger === "gearDiesAtBf"));
  const back = armorer ? (() => { const y = clone(t); if (!pay(y, 1, "rainbow", 0)) return null; y.hand.push(g); y.log.push(`  Battlefield Armorer: ${g.n} returns to your hand ([e1])`); return y; })() : null;
  if (!isBomb(g)) {
    for (const y of [t, back].filter(Boolean)) for (const a of compile(g).abilities.filter((x) => x.trigger === "die")) runAbility(y, a, { side: 0, src: null, here: at, card: g, fromGear: true }, memo, true);
    return back ? [t, back] : [t];
  }
  if (at < 0) return [t];
  let n = 1;
  for (let j = t.gear.length - 1; j >= 0; j--) if (isBomb(t.gear[j]) && gearAt(t, j) === at) { dropGear(t, j); n++; }
  if (n > 1) t.log.push(`  ${n - 1} more Bomb${n > 2 ? "s" : ""} at ${BF[at]} ${n > 2 ? "die" : "dies"} with it`);
  const karthus = t.units.some((x) => x.side === 0 && compile(x.card).statics.some((st) => st.op === "deathknellTwice")) ? 1 : 0;
  return blast(t, at, n * (1 + karthus + amplifiersAt(t, at)), memo);
}
function blast(t, at, k, memo) {
  let states = [t];
  for (let i = 0; i < k; i++) {
    const next = [], seen = new Set();
    for (const x of states) {
      const foes = candidates(x, { who: "unit", side: "enemy", where: "here", choose: true }, { side: 0, here: at });
      if (!foes.length) { next.push(x); continue; }
      for (const f of foes.slice(0, 4)) {
        const y = clone(x);
        const extra = deflectOf(y, f); if (extra && !payFor(y, 0, "rainbow", extra, 0)) continue;
        y.log.push(`  a Bomb's Deathknell hits their ${f.card.n} (${BF[at]})`);
        for (const z of applyOp(y, { op: "damage", n: 2 }, [f], { side: 0, here: at, fromGear: true }, memo)) {
          const key = z.units.filter((u) => u.side === 1).map((u) => `${u.uid}:${u.dmg || 0}`).join(",");
          if (!seen.has(key)) { seen.add(key); next.push(z); }
        }
      }
    }
    states = next.length ? next.slice(0, 12) : states;
  }
  return states;
}

// A dead unit's Deathknell, for its controller. Karthus, Eternal on that side (still on the board after the death)
// makes each trigger an additional time; if Karthus is the one that died, his static has left with him.
// Detonation Amplifier: our gear at that battlefield makes Deathknells there trigger an additional time, each.
function deathknell(t, u, here, memo, alone = false) {
  const times = 1 + (t.units.some((x) => x.side === u.side && compile(x.card).statics.some((st) => st.op === "deathknellTwice")) ? 1 : 0) + (u.side === 0 ? amplifiersAt(t, u.at) : 0);
  for (let i = 0; i < times; i++) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "die")) runAbility(t, a, { side: u.side, src: null, here, card: u.card, diedAlone: alone }, memo, true);
  // "When another non-Recruit unit you control dies" (Viktor, Leader).
  fire(t, t.units.filter((v) => v.side === u.side && v.uid !== u.uid), "friendlyDies", {}, memo, (a) => !(/non-recruit/i.test(a.text) && hasTag(u.card, "Recruit")));
  // Vanguard Helm (our gear, attached or not): "When a buffed friendly unit dies, buff another friendly unit."
  if (u.side === 0 && u.buffed) for (const g of [...t.gear, ...ours(t).flatMap((v) => v.gear)]) for (const a of compile(g).abilities.filter((x) => x.trigger === "buffedDies")) runAbility(t, a, { side: 0, src: null, card: g, here }, memo, true);
}
// Something of ours just had its Might changed (from m0): Fiora, Worthy (a unit becomes [Mighty]: pay {Order} to ready it),
// Renekton, Brute (10 or more: empower me), Ahri, Confident (we reduced an enemy's Might at her battlefield: +1 to her).
function mightChanged(t, u0, m0, ctx, memo) {
  const u = unitRef(t, u0); if (!u) return;
  const m1 = mightOf(t, u);
  if (u.side === 0 && m0 < 5 && m1 >= 5) for (const v of ours(t)) for (const a of compile(v.card).abilities.filter((x) => x.trigger === "becomeMighty")) runAbility(t, a, { side: 0, src: v, here: v.at, ref: [u] }, memo, true);
  if (m0 < 10 && m1 >= 10) fire(t, [u], "might10", {}, memo);
  if (ctx.side === 0 && u.side === 1 && m1 < m0 && u.at >= 0) fire(t, ours(t, u.at), "reduceEnemyHere", {}, memo);
}
// We readied a friendly unit: Pirate's Haven (gear) gives it +1 M this turn.
function youReadied(t, u, memo) {
  for (const g of [...t.gear, ...ours(t).flatMap((v) => v.gear)]) for (const a of compile(g).abilities.filter((x) => x.trigger === "youReadyUnit")) runAbility(t, a, { side: 0, src: null, card: g, ref: [u], fromGear: true }, memo, true);
  fire(t, ours(t), "youReadyUnit", { ref: [u] }, memo);
}
// Esteemed Hierophant's "While you control 7 or more runes": ours from the board; theirs from pos.their.runes (unknown: met,
// the cautious read).
const runes7 = (s, side) => (side === 0 ? s.runes.length >= 7 : s.their.runes != null ? s.their.runes >= 7 : true);
const hasStatic = (t, side, op) => t.units.some((u) => u.side === side && compile(u.card).statics.some((x) => x.op === op && staticOn(t, u, x))) || (side === 0 && legendHas(t, op));
// Our legend's statics (Wuju Master, The Exile, Purifier …): its own conditions read with the legend as "me".
const legendStatics = (t) => (t.legend ? compile(t.legend.card).statics.filter((x) => !x.cond || condMet(t, x.cond, { side: 0, legend: true })) : []);
const legendHas = (t, op) => legendStatics(t).some((x) => x.op === op);
// A unit of ours played outside the main play loop enters ready: its own unconditional "I enter ready", a "the next unit
// enters ready" effect, or Magma Wurm (until 24 Nov those plays ignored the Wurm: from the trash, from the discard, free).
// Rek'Sai, Breacher (ours on the board): "Friendly units played from anywhere other than a player's hand have [Accelerate]":
// face down, from the trash, from the discard (the Champion Zone is the play loop's). Each state gets a paid-Accelerate twin
// where the unit enters ready ([e1] and its [C]; multi-domain: any, as in the play loop).
function withAccel(states, u, c) {
  const out = states.slice();
  for (const x of states) {
    if (!ours(x).some((w) => compile(w.card).statics.some((st) => st.op === "accelNotFromHand"))) continue;
    const y = clone(x), v = unitRef(y, u);
    if (!v || v.ready || !pay(y, 1, (c.d || []).length > 1 ? "rainbow" : dom(c), 1)) continue;
    v.ready = true; y.log.push(`  ${c.n} has [Accelerate] (Rek'Sai, Breacher): paid, it enters ready`); out.push(y);
  }
  return out;
}
// The Exile (legend): units we play to a battlefield we control enter ready.
const entersReady = (t, c, b = -1) => compile(c).statics.some((x) => x.op === "enterReady" && !x.cond) || !!t.enterReady || hasStatic(t, 0, "othersEnterReady") || (b >= 0 && t.ctrl[b] === 0 && legendHas(t, "exileReady"));
const TAGS4 = ["Bird", "Cat", "Dog", "Poro"];
// Ivern, Friend to All takes the tag our units lack, so he adds one when one is missing.
const tagsAmong = (t, side) => { const n = TAGS4.filter((g) => t.units.some((u) => u.side === side && hasTag(u.card, g))).length; return Math.min(4, n + (n < 4 && t.units.some((u) => u.side === side && compile(u.card).statics.some((x) => x.op === "ivernTag")) ? 1 : 0)); };   // Daisy!, Friendship
// Helm of Suppression: their spells cost [e1] more, or [e1]{A} more while it's Empowered.
const helmTax = (t) => { const i = t.gear.findIndex((g) => compile(g).statics.some((x) => x.op === "helm")); return i < 0 ? { e: 0, p: 0 } : { e: 1, p: t.gearMeta[i].empowered ? 1 : 0 }; };
const gearEmp = (t, gid) => !!t.gearMeta.find((m) => m.gid === gid)?.empowered;
const felineBanned = (t) => (t.units.some((u) => u.side === 0 && compile(u.card).statics.some((x) => x.op === "feline" && staticOn(t, u, x))) ? t.felineNames || [] : []);
// The opponent's own choice (Angler Wyrm, Call to Battle, Whirlwind, Divine Judgment): of the states their options lead to,
// the one worst for us by the solver's own score (valueOf), from the turn's start.
// Each option is scored by our best continuation from it (a short search: depth 3, 300 nodes), so the opponent sees what we
// would do next (Whirlwind: they return our only attacker, not the unit that already scored). Without the turn's memo
// (the hold step), the state's own score.
// follow(x): our own choices that come next in the same effect (Whirlwind's reply); an option scores our best of them.
function theirPick(states, memo, before, follow = (x) => [x]) {
  if (states.length < 2) return states[0];
  const one = (y) => (memo?.start ? search(y, memo.start, 3, { states: new Map(), fights: memo.fights, nodes: 0, maxNodes: 300, fightNodes: memo.fightNodes, fightCalls: 0, start: memo.start }).v : valueOf(y, before));
  const score = (x) => Math.max(...follow(x).map(one));
  let best = states[0], bv = score(best);
  for (const x of states.slice(1)) { const v = score(x); if (v < bv) { best = x; bv = v; } }
  return best;
}
// A unit leaving the board without dying (recycled, returned): its battlefield loses its controller if no unit of theirs is left (§323.5).
function leaveBoard(t, u, toHand) {
  const from = u.at; t.units = t.units.filter((v) => v.uid !== u.uid);
  if (toHand && !u.card.token) (u.side === 0 ? t.hand : t.their.hand).push(u.card);
  if (from >= 0 && t.ctrl[from] === u.side && !t.units.some((v) => v.side === u.side && v.at === from)) { t.ctrl[from] = null; t.down[from][u.side] = []; }
}
const saboteurAt = (t, b) => t.units.some((u) => u.side === 0 && u.at === b && compile(u.card).statics.some((x) => x.op === "saboteur"));
// Run one trigger on a set of units, in place (src = each unit, here = where it is unless ctx says otherwise).
function fire(t, units, trig, ctx, memo, pred = () => true) {
  for (const u0 of units) {
    const u = unitRef(t, u0); if (!u) continue;
    for (const a of compile(u.card).abilities.filter((x) => x.trigger === trig && pred(x, u))) { const v = unitRef(t, u0); if (v) runAbility(t, a, { side: v.side, src: v, here: v.at, ...ctx }, memo, true); }
  }
}
// Our legend's triggers (it isn't a unit: fire() never saw it). "Exhaust me" in the ability needs it ready and exhausts it;
// "you may" (or an exhaust cost) makes it optional; the result with the best look ahead is kept (bestResult).
function fireLegend(t, trig, ctx, memo, pred = () => true) {
  if (!t.legend) return;
  for (const a of compile(t.legend.card).abilities.filter((x) => x.trigger === trig && pred(x))) {
    const exhaust = !!a.exhaustMe || /exhaust me/i.test(a.text || "");
    if (exhaust && !t.legend.ready) continue;
    if (a.needsDiscard && !t.hand.length) continue;   // "you may discard 1 and exhaust me": a cost (Deceiver)
    const c = { side: 0, src: null, legend: true, card: t.legend.card, ...ctx };
    if (!condMet(t, a.cond, c)) continue;
    const y = clone(t); if (exhaust) y.legend.ready = false;
    y.log.push(`  ${t.legend.card.n} (legend)${a.text ? `: ${a.text.replace(/^[^,]*,\s*/, "")}` : ""}`);
    const res = runAbility(y, { ...a, cond: null }, c, memo, false);
    const opts = a.optional || exhaust || /you may/i.test(a.text || "") ? [clone(t), ...res] : res;
    const best = bestResult(opts, t, 0, memo); if (best && best !== t) Object.assign(t, best);
  }
}
// "Alone": no other friendly unit at the same location (§740.2.a), taken before the unit leaves.
const aloneAt = (units, u) => !units.some((x) => x.side === u.side && x.uid !== u.uid && x.at === u.at);
function dieOutside(t, u, memo, why = "dies") {
  if (u.banishOnDie && why === "dies") why = "is banished instead (Smite)";
  const alone = aloneAt(t.units, u);
  t.units = t.units.filter((x) => x.uid !== u.uid);
  if (u.side === 0 && !/returns/i.test(why) && !/banish/i.test(why)) toTrash(t, u.card);
  t.died = (t.died || 0) + 1;
  t.log.push(`  ${u.side === 0 ? "your" : "their"} ${u.card.n} (${where(u.at)}) ${why}`);
  if (u.side === 1) { t.kills++; if (!/returns/i.test(why)) fireLegend(t, "legendEnemyDies", {}, memo); }   // Battle Mistress: ready me
  // Deathknell (not on a banish or a return): its effects, for its controller. Until 24 Nov only "dies" ran it, so a
  // [Temporary] death or a Shard of Undoing kill skipped Deathknells.
  if (!/banish|returns/i.test(why)) { deathknell(t, u, u.at, memo, alone); fire(t, t.units.filter((v) => v.side === u.side), "friendliesDie", {}, memo); }
  for (const b of bfsOf(t)) if (t.ctrl[b] != null && !t.units.some((x) => x.side === t.ctrl[b] && x.at === b)) { const was = t.ctrl[b]; t.ctrl[b] = null; t.down[b][was] = []; t.log.push(`  ${BF[b]} has no units of ${was === 0 ? "yours" : "theirs"} left: it's uncontrolled (§323.5)`); }
}
function mkToken(e) { return { n: `${e.name} token`, t: "Unit", m: e.might, x: (e.keywords || []).map((k) => `[${k}]`).join("\n"), token: true, g: [e.name] }; }
// A unit's tags (card.g): "Mech", "Dragon"; a token's name is its tag ("Recruit token" is a Recruit).
const hasTag = (card, tag) => (card.g || []).some((g) => g.toLowerCase() === String(tag).toLowerCase());
// A unit card in our trash that "a unit with cost no more than [eE] and no more than {A}×P" allows (Undying Loyalty).
const trashPlayable = (c, e, p) => isUnit(c) && (c.e || 0) <= e && (c.p || 0) <= p;
// Into our trash, when the position gave it (discards, our spells once cast, our non-token units that die).
const toTrash = (t, c) => { if (t.trash && c && !c.token) t.trash.push(c); };
// One op on state t (targets already mapped to t's units). Returns the states it can lead to.
function applyOp(t, e, set, ctx, memo) {
  const us = set.map((u) => unitRef(t, u)).filter(Boolean);
  const who = ctx.side === 0 ? "you" : "they";
  switch (e.op) {
    case "damage": {
      // ifRunes: "if you control N or more runes, deal M instead" (Siphoning Strike); only our runes are on the board.
      // ifEmpowered: "if I'm [Empowered], deal N instead" (Akali). refShield: "damage equal to its [Shield]" (Ntofo Strikes).
      const ref0 = [].concat(ctx.ref || [])[0], src0 = ctx.src && (unitRef(t, ctx.src) || ctx.src);
      // myShield: Armored Tusker. discardedCost: Get Excited! (the card just discarded).
      // Primordial Roar: the shown unit's Might (the best unit in hand, which is the one we'd show).
      if (e.n === "shownMight") { const k = Math.max(0, ...t.hand.filter(isUnit).map((c) => c.m || 0)); if (!k) return [t]; return applyOp(t, { ...e, n: k }, set, ctx, memo); }
      if (e.n === "myAssault") { const k = src0 ? keywordOf(effCard(t, src0).x, "Assault").always : 0; if (!k) return [t]; return applyOp(t, { ...e, n: k }, set, ctx, memo); }   // Lucian, Gunslinger
      if (e.n === "bestGearCost") { const k = Math.max(0, ...t.gear.map((g) => g.e || 0)); if (!t.gear.length || !k) return [t]; return applyOp(t, { ...e, n: k }, set, ctx, memo); }   // Improvised Projectile
      if (e.n === "itsDamage") { const out = []; for (const u of us) { const k = u.dmg || 0; if (k) for (const y of applyOp(t, { ...e, n: k }, [u], ctx, memo)) out.push(y); } return out.length ? out.slice(-1) : [t]; }   // Morgana, Vindictive
      if (e.n === "refMight" || e.n === "twoPerEquipment") { const r = ref0 && (unitRef(t, ref0) || ref0); const k = e.n === "refMight" ? (r ? mightOf(t, r) : 0) : 2 * (src0?.gear?.length || 0); if (!k) return [t]; return applyOp(t, { ...e, n: k }, set, ctx, memo); }   // Stormbringer, Riven, Shattered
      if (e.n === "myShield" || e.n === "discardedCost") { const k = e.n === "myShield" ? (src0 ? keywordOf(effCard(t, src0).x, "Shield").always : 0) : t.lastDiscard?.e || 0; if (!k) return [t]; return applyOp(t, { ...e, n: k }, set, ctx, memo); }
      const n = e.ifRunes && ctx.side === 0 && t.runes.length >= e.ifRunes.min ? e.ifRunes.n
        : e.ifEmpowered && src0?.empowered ? e.ifEmpowered
        : e.n === "refShield" ? (ref0 ? keywordOf(effCard(t, unitRef(t, ref0) || ref0).x, "Shield").always : 0)
        : (e.n === "myMight" ? (ctx.src ? mightOf(t, unitRef(t, ctx.src) || ctx.src) : 0) : e.n === "itsMight" ? 0 : e.n) + (ctx.fromGear ? gearBonus(t, ctx.side) : 0) + t.units.filter((u) => u.side === ctx.side && compile(u.card).statics.some((x) => x.op === "spellBonusDamage")).length   // Annie, Fiery
        + (ctx.side === 0 && t.nextSpellBonus && ctx.card && isSpell(ctx.card) ? 1 : 0);   // Ravenborn Tome
      const kills = t.units.some((v) => v.side === ctx.side && compile(v.card).statics.some((x) => x.op === "anyDamageKills"));
      for (const u of us) {
        if (compile(u.card).statics.some((st) => st.noDamageOutsideCombat && staticOn(t, u, st))) continue;   // Ambessa, The Wolf (outside a fight)
        if (t.fog) continue;   // Unyielding Spirit: all spell and ability damage this turn is prevented
        // Esteemed Hierophant: enemy spells' and abilities' damage is prevented while its controller has 7+ runes (until 24 Nov
        // only fights read it, so our main-phase damage killed it).
        if (u.side !== ctx.side && runes7(t, u.side) && compile(u.card).statics.some((x) => x.op === "hierophant")) { t.log.push(`  ${u.card.n}: the damage is prevented (7+ runes)`); continue; }
        if ((u.moves || 0) >= 2 && compile(u.card).statics.some((x) => x.op === "kaynNoDamage")) continue;   // Kayn, Unleashed
        const nn = u.doubleDmg ? 2 * n : n;   // Lotus Trap (outside fights)
        if (e.banishOnDie) u.banishOnDie = true;   // Smite: if it dies this turn, it's banished instead
        const blk = Math.min(u.prevent || 0, nn); u.prevent = (u.prevent || 0) - blk; u.dmg = (u.dmg || 0) + nn - blk; if (u.dmg > 0 && (u.dmg >= mightOf(t, u) || ((t.decree || u.dieOnDamage || (kills && u.side !== ctx.side)) && nn - blk > 0))) dieOutside(t, u, memo); }   // Noxian Guillotine: dieOnDamage
      return [t];
    }
    case "baseMight": { const n = e.n === "playedCost" ? ctx.played?.e || 0 : e.n; for (const u of us) u.bonus = (u.bonus || 0) + n - (u.card.m || 0); return [t]; }   // Piltovan Guidebot: the played card's Energy cost   // "its base M becomes N": gear still adds
    case "might": for (const u of us) { const m0 = mightOf(t, u); let n = e.n === "itsMight" ? 0 : e.n === "minusExhaustedMine" ? -t.units.filter((v) => v.side === ctx.side && !v.ready).length : e.n === "tagsAmong" ? tagsAmong(t, ctx.side)
        : e.n === "itsOwnMight" ? mightOf(t, u)   // Last Stand: double it
        : e.n === "returnedGearE" ? ctx.returnedGearE || 0   // Spirit of the Forge
        : e.n === "toBestOther" ? Math.max(0, ...t.units.filter((v) => v.side === u.side && v.uid !== u.uid).map((v) => mightOf(t, v) - mightOf(t, u)))   // Convergent Mutation
        : e.n === "toRefPlusOne" ? (() => { const r = [].concat(ctx.ref || [])[0], rv = r && (unitRef(t, r) || r); return Math.max(0, (rv ? mightOf(t, rv) : 0) - mightOf(t, u)) + 1; })()   // Dame the Despoiler
        : e.n === "myMight" ? (ctx.src ? mightOf(t, unitRef(t, ctx.src) || ctx.src) : 0) : e.n === "twoPerEnemyThere" ? 2 * t.units.filter((v) => v.side !== u.side && v.at === u.at && u.at >= 0).length : e.n;
      if (n < 0 && e.target?.choose !== false && hasStatic(t, ctx.side, "extraMinus")) n -= 1;   // Mel, Newly Awakened
      u.bonus = (u.bonus || 0) + n; if (e.floor != null) u.bonus = Math.max(u.bonus, e.floor - (withGear(u.card, u.gear).m || 0)); if (e.keyword) u.kw = [...(u.kw || []), `[${e.keyword}${e.kn > 1 ? ` ${e.kn}` : ""}]`]; mightChanged(t, u, m0, ctx, memo); } return [t];
    case "keyword": for (const u of us) { const n = e.n === "itsMight" ? mightOf(t, u) : e.n === "itsShield" ? keywordOf(effCard(t, u).x, "Shield").always : e.n;   // Pride of Nazumah: [Assault] equal to its [Shield]
      if (!n && e.n === "itsShield") continue; u.kw = [...(u.kw || []), ...(e.keywords || [e.keyword]).map((k) => `[${k}${n > 1 && !e.keywords ? ` ${n}` : ""}]`)]; } return [t];   // Brawl: [Assault] equal to its Might
    case "stun": for (const u of us) u.stunned = true;
      // "When you stun an enemy unit (at a battlefield)": Vex, Mocking moves there; Eclipse Herald readies.
      for (const u of us) if (u.side !== ctx.side && u.at >= 0) fire(t, t.units.filter((v) => v.side === ctx.side), "youStun", { here: u.at }, memo);
      if (ctx.side === 0 && us.some((u) => u.side === 1)) fireLegend(t, "youStun", {}, memo);   // Radiant Dawn: buff a friendly unit
      return [t];
    case "noMove": for (const u of us) u.noMove = true; return [t];
    case "protect": for (const u of us) u.protected = true; return [t];
    case "heal": for (const u of us) u.dmg = 0; return [t];
    // Empowered is a count: once, unless the unit says it can be more (Kayle, Justified: up to three).
    // A gear empowering itself ("[Empower] — {T}" on Hextech Disc, Rage Amplifier, Helm): its status lives in gearMeta.
    case "empower": if (!us.length && e.target?.who === "me" && ctx.gid != null) { const i = t.gearMeta.findIndex((m) => m.gid === ctx.gid); if (i > -1 && !t.gearMeta[i].empowered) { t.gearMeta[i] = { ...t.gearMeta[i], empowered: true }; t.log.push(`  ${t.gear[i].n} is Empowered`); if (ctx.side === 0) fireLegend(t, "youEmpowerOther", {}, memo); } return [t]; }
      for (const u of us) { const cap = compile(u.card).statics.find((x) => x.op === "empowerCap")?.n || 1, was = Number(u.empowered || 0); u.empowered = Math.min(cap, was + 1); if (!was) fire(t, [u], "empowered", {}, memo); }
      if (ctx.side === 0 && us.some((u) => u.side === 0)) fireLegend(t, "youEmpowerOther", {}, memo);   // Soul's Reflection, Matriarch of War: empower me
      return [t];   // Mel, Defiant Soul
    case "enterReadyTurn": if (ctx.side === 0) { t.enterReady = true; t.log.push("  units you play this turn enter ready"); } return [t];
    case "nextUnitAnywhere": if (ctx.side === 0) t.nextUnit = { anywhere: true, buff: !!e.buff }; return [t];
    // Baron Nashor: "add the Baron Pit battlefield token to the board if it's not there already. If you do, I enter there."
    // Entering an open battlefield he contests it and conquers when the showdown closes (as an open-battlefield play).
    case "addPit": {
      if (ctx.side !== 0 || t.ctrl.length > 2) return [t];
      t.ctrl.push(null); t.down.push([[], []]);
      const b = t.ctrl.length - 1, me = ctx.src && unitRef(t, ctx.src);
      t.log.push("  the Baron Pit is added to the board: a third battlefield");
      if (me) { me.at = b; t.playedToBf = true; t.log.push(`  ${me.card.n} enters the Baron Pit`); finishArrival(t, b, memo); }
      return [t];
    }
    // From a hold trigger (Explosimian) this runs in place: runAbility keeps the battlefield with the best look ahead.
    case "bomb": {
      if (ctx.side !== 0) return [t];
      const out = [];
      for (const b of bfsOf(t)) { const y = clone(t); for (let i = 0; i < (e.count || 1); i++) addGear(y, { ...BOMB }, b); y.log.push(`  ${e.count > 1 ? `${e.count} Bombs` : "a Bomb"} to ${BF[b]}`); out.push(y); }
      return out;
    }
    // Kill our gear: one (Acceptable Losses, Jayce, Detonation Amplifier), or any number of Bombs (Hexplosive Minefield:
    // a set of battlefields, since one Bomb there takes the rest). No states when there's nothing to kill ("if you do" is false).
    case "killGear": {
      if (ctx.side !== 0) return [t];
      const idx = t.gear.map((_, i) => i).filter((i) => (!e.tag || hasTag(t.gear[i], e.tag)) && !(e.other && t.gearMeta[i].gid === ctx.gid) && (e.maxE == null || (t.gear[i].e || 0) <= (e.maxE === "myMight" ? (ctx.src ? mightOf(t, unitRef(t, ctx.src) || ctx.src) : 0) : e.maxE)));
      if (!idx.length) return [];
      const out = [];
      if (e.any) {
        const bfs = [...new Set(idx.map((i) => gearAt(t, i)).filter((a) => a >= 0))];
        for (let mask = 1; mask < 1 << bfs.length; mask++) {
          let states = [clone(t)];
          for (const b of bfs.filter((_, j) => mask & (1 << j))) states = states.flatMap((y) => { const i = y.gear.findIndex((g, k) => (!e.tag || hasTag(g, e.tag)) && gearAt(y, k) === b); return i < 0 ? [y] : killGearAt(y, i, memo); });
          out.push(...states);
        }
      } else {
        const seen = new Set();
        for (const i of idx) { const k = `${t.gear[i].n}@${gearAt(t, i)}`; if (seen.has(k)) continue; seen.add(k); out.push(...killGearAt(clone(t), i, memo)); }
      }
      return out;
    }
    case "freeGear": if (ctx.side === 0 && !(e.onlyIfDid && ctx.did === false)) { t.freeGear = e.maxE; t.log.push(`  the next gear (Energy cost ${e.maxE} or less) ignores its Energy cost`); } return [t];
    // Command: Attack: a friendly gear with [Deploy] to another battlefield (§830.1.b.2).
    case "moveGear": {
      if (ctx.side !== 0) return [t];
      const out = [], seen = new Set();
      t.gear.forEach((g, i) => { if (!compile(g).keywords.Deploy) return; for (const b of bfsOf(t)) { if (b === gearAt(t, i) || seen.has(`${g.n}@${gearAt(t, i)}>${b}`)) continue; seen.add(`${g.n}@${gearAt(t, i)}>${b}`); const y = clone(t); y.gearMeta[i] = { ...y.gearMeta[i], at: b }; y.log.push(`  ${g.n} ${where(gearAt(t, i))} → ${BF[b]}`); out.push(y); } });
      return out.length ? out : [t];
    }
    case "xp": {
      const n = (e.n || 1) * (e.perFriendlyUnit ? t.units.filter((u) => u.side === ctx.side).length : 1);   // Scrutinizing Sergeant: per friendly unit
      if (ctx.side === 0) { t.xp = (t.xp || 0) + n; t.xpGained = true; } else t.their.xp = (t.their.xp || 0) + n;
      t.log.push(`  ${who} gain ${n} XP`); return [t];
    }
    case "decree": t.decree = true; t.log.push("  any unit dealt damage this turn dies"); return [t];
    case "winXp": for (const u of us) u.winXp = (u.winXp || 0) + (e.n || 1); return [t];
    case "buffOnPlay": if (ctx.side === 0) t.buffOnPlay = true; return [t];
    // Bone Skewer: a unit from their hand (in the position) is played to the chosen battlefield, stunned.
    case "pullFromHand": {
      if (ctx.side !== 0 || ctx.here == null || ctx.here < 0) return [t];
      const out = [], seen = new Set();
      for (const c of t.their.hand.filter(isUnit)) {
        if (seen.has(c.n)) continue; seen.add(c.n);
        const y = clone(t); y.their.hand.splice(y.their.hand.indexOf(c), 1);
        const u = mkUnit(c, 1, ctx.here, true); if (e.stun) u.stunned = true; y.units.push(u);
        y.log.push(`  they play ${c.n} from hand to ${BF[ctx.here]}${e.stun ? ", stunned" : ""}`);
        if (ours(y, ctx.here).length && y.ctrl[ctx.here] === 0) resolveAt(y, ctx.here, 1, memo);
        out.push(y);
      }
      return out.length ? out : [t];
    }
    case "nextUnitReady": if (ctx.side === 0) { t.nextUnit = { ready: true, buff: e.buff !== false }; t.log.push("  the next unit you play enters ready and buffed"); } return [t];
    case "disempower": for (const u of us) u.empowered = 0; return [t];
    // Discard a card from hand (branched over distinct cards). Flame Chompers may then be played for {Fury}.
    // Hwei, Brooding Painter: draw 1 (unknown), then discard one: a known card from hand gives its type's effect.
    case "hwei": {
      if (ctx.side !== 0) return [t];
      const out = [t];   // discarding the card just drawn
      const src = ctx.src && unitRef(t, ctx.src);
      for (const c of [...new Set(t.hand)].slice(0, 6)) for (const y of discardCard(clone(t), c, memo)) {
        const me = src && unitRef(y, src);
        if (isUnit(c) && me) { me.bonus = (me.bonus || 0) + 3; y.log.push(`  ${me.card.n}: a unit discarded, +3 M`); }
        else if (/Gear/.test(c.t || "")) { let n = 2; for (const r of y.runes) if (!r.ready && n > 0) { r.ready = true; n--; } y.log.push("  a gear discarded: ready up to 2 runes"); }
        out.push(y);
      }
      return out;
    }
    // Akshan, Mischievous: an enemy gear to our base; Equipment (the only enemy gear on the board, on their units) attaches to him.
    case "akshan": {
      const me = ctx.src && unitRef(t, ctx.src); if (!me || ctx.side !== 0) return [t];
      const out = [];
      for (const v of theirs(t)) for (const g of [...new Set(v.gear)]) { const y = clone(t), from = unitRef(y, v); from.gear.splice(from.gear.indexOf(g), 1); y.log.push(`  Akshan takes ${g.n} from their ${v.card.n}`); out.push(...attachStates(y, unitRef(y, me), g, memo)); }
      return out.length ? out : [t];
    }
    // Undying Loyalty: play a unit from our trash ([e2] or less, {A} or less), ignoring its cost; with a pet there, a pet
    // (that's the [e2] discount the card was paid with).
    case "fromTrash": {
      if (ctx.side !== 0 || !t.trash) return [t];
      let ok = [...new Set(t.trash.filter((c) => trashPlayable(c, e.maxE, e.maxP)))];
      if (ok.some((c) => TAGS4.some((g) => hasTag(c, g)))) ok = ok.filter((c) => TAGS4.some((g) => hasTag(c, g)));
      const out = [];
      for (const c of ok.slice(0, 5)) { const y = clone(t); y.trash.splice(y.trash.indexOf(c), 1); const u = mkUnit(c, 0, -1, entersReady(y, c)); y.units.push(u); y.log.push(`  play ${c.n} from your trash`); onWePlay(y, c, memo); onOurUnitPlayed(y, u, memo); fireLegend(y, "youPlayNotFromHand", {}, memo);
        let ys = [y]; for (const a of compile(c).abilities.filter((x) => x.trigger === "play")) ys = ys.flatMap((z) => runAbility(z, a, { side: 0, src: unitRef(z, u), here: -1, self: true, card: c }, memo)); out.push(...withAccel(ys, u, c)); }
      return out.length ? out : [t];
    }
    // Defender of Tomorrow: ready N of our exhausted gear (their {T} can be used again).
    case "readyGear": { let n = e.n || 1; for (let i = t.gearUsed.length - 1; i >= 0 && n > 0; i--) if (/^g\d+$/.test(t.gearUsed[i])) { t.gearUsed.splice(i, 1); n--; } return [t]; }
    // Grandmaster at Arms: move an attached Equipment of ours to another unit of ours.
    case "moveEquip": {
      if (ctx.side !== 0) return [t];
      const out = [];
      for (const from of ours(t).filter((u) => u.gear.length)) for (const g of [...new Set(from.gear)]) for (const to of ours(t).filter((u) => u.uid !== from.uid)) {
        const y = clone(t), f = unitRef(y, from); f.gear.splice(f.gear.indexOf(g), 1); y.log.push(`  ${g.n} moves from ${from.card.n} to ${to.card.n}`); out.push(...attachStates(y, unitRef(y, to), g, memo));
      }
      return out.length ? out : [t];
    }
    case "discard": { if (ctx.side !== 0) return [t]; const out = e.afterDraw || e.optional ? [clone(t)] : []; for (const c of [...new Set(t.hand)].slice(0, 6)) out.push(...discardCard(clone(t), c, memo)); return out.length ? out : [t]; }
    // Cataclysm (and their spell locks): their spells leave their fight hand and can't counter.
    case "noSpells": if (ctx.side === 0) { t.their.noSpells = true; t.log.push("  they can't play spells this turn"); } return [t];
    // Hostile Takeover: the unit is ours; if none of theirs remain there, we take the battlefield (§348.2.a).
    case "takeControl": for (const u of us) { u.side = ctx.side; t.log.push(`  you take control of ${u.card.n} (${where(u.at)})`); if (u.at >= 0 && !theirs(t, u.at).length && t.ctrl[u.at] !== 0) { t.ctrl[u.at] = 0; t.down[u.at][1] = []; score(t, u.at, 0); } } return [t];
    // Fox-Fire: at one battlefield, the most enemy units with total Might 4 or less (smallest first).
    case "foxFire": {
      if (ctx.side !== 0) return [t];
      const out = [];
      for (const b of bfsOf(t)) { const xs = theirs(t, b).sort((x, y) => mightOf(t, x) - mightOf(t, y)); let sum = 0; const kill = []; for (const u of xs) { const m = mightOf(t, u); if (sum + m <= (e.total || 4)) { sum += m; kill.push(u); } } if (!kill.length) continue; const y = clone(t); for (const u of kill) { const v = unitRef(y, u); if (v) dieOutside(y, v, memo); } out.push(y); }
      return out.length ? out : [t];
    }
    // Acceleration Gate: our exhausted units first (strongest first), then runes.
    case "readyUpTo": { if (ctx.side !== 0) return [t]; let n = e.n || 1; for (const u of ours(t).filter((u) => !u.ready).sort((a, b) => mightOf(t, b) - mightOf(t, a))) if (n > 0) { u.ready = true; n--; } for (const r of t.runes) if (!r.ready && n > 0) { r.ready = true; n--; } t.log.push("  ready up to 4"); return [t]; }
    // Atakhan: "the defender must kill one of their units here": they choose, so their weakest.
    case "edictThere": { const xs = t.units.filter((u) => u.side !== ctx.side && u.at === ctx.here).sort((a, b) => mightOf(t, a) - mightOf(t, b)); if (xs[0]) dieOutside(t, xs[0], memo); return [t]; }
    // Mindsplitter: a card from their hand (in the position) is discarded.
    case "theirDiscard": { if (ctx.side !== 0) return [t]; const out = []; for (const c of [...new Set(t.their.hand)].filter((x) => !e.domain || (x.d || []).includes(e.domain))) { const y = clone(t); y.their.hand.splice(y.their.hand.indexOf(c), 1); y.log.push(`  they discard ${c.n}`); out.push(y); } return out.length ? out : [t]; }
    // Bullet Time: pay X Power, X damage to every enemy unit at one battlefield.
    case "bulletTime": {
      if (ctx.side !== 0) return [t];
      const out = [];
      for (const b of bfsOf(t)) { const foes = theirs(t, b); if (!foes.length) continue; for (let x = 1; x <= Math.min(8, budgetOf(t).p); x++) { const y = clone(t); if (!pay(y, 0, "rainbow", x, true)) break; y.log.push(`  pay ${x} Power: ${x} to every enemy at ${BF[b]}`); out.push(...applyOp(y, { op: "damage", n: x }, theirs(y, b), { ...ctx, here: b }, memo)); } }
      return out.length ? out : [t];
    }
    // Downwell: every unit and gear goes back to its owner's hand (tokens cease to exist).
    case "returnAll": {
      for (const u of t.units) { if (u.card.token) continue; if (u.side === 0) t.hand.push(u.card); else t.their.hand.push(u.card); }
      t.units = []; for (const g of t.gear) if (!g.token) t.hand.push(g); t.gear = []; t.gearMeta = [];
      for (const b of bfsOf(t)) { t.ctrl[b] = null; t.down[b] = [[], []]; }
      t.log.push("  every unit and gear returns to hand"); return [t];
    }
    case "doubleDamage": for (const u of us) u.doubleDmg = true; return [t];
    case "scoreOpp": { const side = 1 - ctx.side; if (side === 1 && hasStatic(t, 0, "noOppPoints")) return [t]; t.score[side] += e.n || 1; t.log.push(`  ${side === 0 ? "you" : "they"} score ${e.n || 1} (${t.score.join("–")})`); return [t]; }
    case "buffPlus": if (ctx.side === 0 && !t.buffPlus) { t.buffPlus = true; for (const u of ours(t)) if (u.buffed) u.bonus = (u.bonus || 0) + 1; t.log.push("  buffs give +1 more this turn"); } return [t];
    // Hextech Anomaly: pay X Power for X Energy (branched over X).
    case "powerToEnergy": { if (ctx.side !== 0) return [t]; const out = []; for (let x = 1; x <= Math.min(6, t.runes.length + t.gold); x++) { const y = clone(t); if (!pay(y, 0, "rainbow", x)) break; y.extraE += x; y.log.push(`  ${x} Power into ${x} Energy`); out.push(y); } return out.length ? out : [t]; }
    // Strike Down: an Equipment comes off the chosen unit (it stays on the board, unattached, at base).
    case "detach": { const r = [].concat(ctx.ref || [])[0], v = r && unitRef(t, r); if (v && v.gear.length) { const g = v.gear.pop(); addGear(t, g, -1); t.log.push(`  ${g.n} detaches from ${v.card.n}`); } return [t]; }
    // Angle Shot: one of our unattached Equipment onto one of our units (branched).
    case "attachEquip": {
      if (ctx.side !== 0) return [t];
      const out = [];
      t.gear.forEach((g, i) => { if (!/\[Equip\]/.test(g.x || "")) return; for (const u of ours(t)) { const y = clone(t); dropGear(y, i); y.log.push(`  ${g.n} attaches to ${u.card.n}`); out.push(...attachStates(y, unitRef(y, u), g, memo)); } });
      return out.length ? out : [t];
    }
    case "spellBonusNext": if (ctx.side === 0) { t.nextSpellBonus = 1; t.log.push("  the next spell deals 1 Bonus Damage"); } return [t];
    case "dieOnDamage": for (const u of us) u.dieOnDamage = true; return [t];
    // Tricksy Tentacles: at one battlefield, their units with total Might 8 or less (smallest first) to their base.
    case "tentacles": {
      if (ctx.side !== 0) return [t];
      const out = [];
      for (const b of bfsOf(t)) { const xs = theirs(t, b).sort((x, y) => mightOf(t, x) - mightOf(t, y)); let sum = 0; const go2 = []; for (const u of xs) { const m = mightOf(t, u); if (sum + m <= (e.total || 8)) { sum += m; go2.push(u); } } if (!go2.length) continue; const y = clone(t); for (const u of go2) unitRef(y, u).at = -1; if (!theirs(y, b).length && y.ctrl[b] === 1) { y.ctrl[b] = null; y.down[b][1] = []; } y.log.push(`  their ${go2.map((u) => u.card.n).join(" + ")} (${BF[b]}) go to base`); out.push(y); }
      return out.length ? out : [t];
    }
    // Possession: the unit becomes ours and is recalled; its battlefield is left without it (no conquest).
    case "possess": for (const u of us) { const from = u.at; u.side = ctx.side; u.at = -1; t.log.push(`  you take ${u.card.n} and recall it`); if (from >= 0 && t.ctrl[from] === 1 && !theirs(t, from).length) { t.ctrl[from] = null; t.down[from][1] = []; } } return [t];
    // Rell, Magnetic: an Equipment from hand (Energy cost ≤ maxE), free, attached to me.
    case "equipFromHand": {
      const me = ctx.src && unitRef(t, ctx.src); if (!me || ctx.side !== 0) return [t];
      const c = t.hand.find((x) => /\[Equip\]/.test(x.x || "") && (x.e || 0) <= (e.maxE ?? 99)); if (!c) return [t];
      t.hand.splice(t.hand.indexOf(c), 1); me.gear.push(c); t.log.push(`  ${me.card.n} plays ${c.n} from hand, attached`); return [t];
    }
    // Cataclysmic Duel: each player keeps one unit. We choose (branched); they keep their strongest.
    case "duel": {
      if (ctx.side !== 0) return [t];
      const out = [], theirsKeep = theirs(t).sort((a, b) => mightOf(t, b) - mightOf(t, a))[0];
      for (const keep of ours(t).slice(0, 6)) { const y = clone(t); for (const u of [...y.units]) if (u.uid !== keep.uid && u.uid !== theirsKeep?.uid) { const v = unitRef(y, u); if (v) dieOutside(y, v, memo); } y.log.push(`  each player keeps one: your ${keep.card.n}${theirsKeep ? `, their ${theirsKeep.card.n}` : ""}`); out.push(y); }
      return out.length ? out : [t];
    }
    // King's Edict: they choose one of their own units: their weakest dies.
    case "theirEdict": { const xs = theirs(t).sort((a, b) => mightOf(t, a) - mightOf(t, b)); if (xs[0]) dieOutside(t, xs[0], memo); return [t]; }
    // Decree of Discord: their units of a domain, total Might ≤ N, back to hand (smallest first).
    case "bounceTotal": {
      if (ctx.side !== 0) return [t];
      let sum = 0; const xs = theirs(t).filter((u) => !e.domain || (u.card.d || []).includes(e.domain)).sort((a, b) => mightOf(t, a) - mightOf(t, b));
      for (const u of xs) { const m = mightOf(t, u); if (sum + m > (e.total || 5)) continue; sum += m; const from = u.at; t.units = t.units.filter((v) => v.uid !== u.uid); if (!u.card.token) t.their.hand.push(u.card); t.log.push(`  their ${u.card.n} returns to hand`); if (from >= 0 && t.ctrl[from] === 1 && !theirs(t, from).length) { t.ctrl[from] = null; t.down[from][1] = []; } }
      return [t];
    }
    // Overt Operation: each exhausted friendly unit spends its buff to ready.
    case "overt": for (const u of ours(t)) if (u.buffed && !u.ready) { u.buffed = false; u.bonus = (u.bonus || 0) - 1; u.ready = true; t.log.push(`  ${u.card.n} spends its buff to ready`); } return [t];
    // Ancient Henge: X Energy into X {A} (branched).
    case "energyToPower": { if (ctx.side !== 0) return [t]; const out = []; for (let x = 1; x <= Math.min(6, t.runes.filter((r) => r.ready).length); x++) { const y = clone(t); if (!pay(y, x, "rainbow", 0)) break; for (let i = 0; i < x; i++) y.pool.push({ d: "A" }); y.log.push(`  ${x} Energy into ${x} {A}`); out.push(y); } return out.length ? out : [t]; }
    // Kato the Arm: another friendly unit gets my keywords and +my Might this turn.
    case "kato": { const me = ctx.src && unitRef(t, ctx.src); if (!me) return [t]; const mm = mightOf(t, me), kws = Object.entries(compile(me.card).keywords).map(([k, n]) => `[${k}${n > 1 ? ` ${n}` : ""}]`); for (const u of us) { u.bonus = (u.bonus || 0) + mm; u.kw = [...(u.kw || []), ...kws]; } return [t]; }
    case "noSpellDamage": t.fog = true; t.log.push("  spell and ability damage is prevented this turn"); return [t];
    // Fallen Feline: name a spell (their hand is in the position: branched over its spell names).
    case "nameSpell": { if (ctx.side !== 0) return [t]; const names = [...new Set(t.their.hand.filter(isSpell).map((c) => c.n))]; if (!names.length) return [t]; return names.map((n) => { const y = clone(t); y.felineNames = [...(y.felineNames || []), n]; y.log.push(`  name ${n}`); return y; }); }
    // Heartening Soul / Royal Entourage: ready our legend.
    case "readyLegend": if (ctx.side === 0 && t.legend && !t.legend.ready) { t.legend.ready = true; t.log.push(`  ${t.legend.card.n} is readied`); } return [t];
    // Profiteer: disempower one of ours (a unit or the legend) to empower another (branched).
    case "profiteer": {
      if (ctx.side !== 0) return [t];
      const from = [...ours(t).filter((u) => u.empowered).map((u) => ({ u })), ...(t.legend?.empowered ? [{ legend: true }] : [])];
      const to = [...ours(t).filter((u) => !u.empowered).map((u) => ({ u })), ...(t.legend && !t.legend.empowered ? [{ legend: true }] : [])];
      const out = [];
      for (const f of from) for (const g of to) {
        if (f.u && g.u && f.u.uid === g.u.uid) continue;
        const y = clone(t);
        if (f.legend) y.legend.empowered = false; else unitRef(y, f.u).empowered = 0;
        if (g.legend) y.legend.empowered = true; else { const v = unitRef(y, g.u); v.empowered = 1; fire(y, [v], "empowered", {}, memo); }
        y.log.push(`  Profiteer: ${f.legend ? y.legend.card.n : f.u.card.n} → ${g.legend ? y.legend.card.n : g.u.card.n} Empowered`);
        out.push(y);
      }
      return out.length ? out : [t];
    }
    // Angler Wyrm / Call to Battle: they move a unit they control to that battlefield (their choice: the worst for us).
    // Arriving where we hold, it attacks.
    case "theirMove": {
      if (ctx.side !== 0) return [t];
      const r0 = [].concat(ctx.ref || [])[0], rr = r0 && unitRef(t, r0);
      const d = /refLocation/.test(e.to) ? rr?.at : ctx.src ? (unitRef(t, ctx.src) || ctx.src).at : ctx.here;
      if (d == null || d < 0) return [t];
      const opts = [];
      for (const u of theirs(t).filter((v) => v.at !== d)) {
        const y = clone(t), v = unitRef(y, u), from = v.at; v.at = d;
        if (from >= 0 && y.ctrl[from] === 1 && !theirs(y, from).length) { y.ctrl[from] = null; y.down[from][1] = []; }
        y.log.push(`  they move ${v.card.n} (${where(from)}) to ${BF[d]}`);
        if (ours(y, d).length) resolveAt(y, d, 1, memo);
        opts.push(y);
      }
      return opts.length ? [theirPick(opts, memo, t)] : [t];
    }
    // Whirlwind: starting with the next player (§115.1: them), each may return a unit to its owner's hand. They choose first
    // (the worst for us, or none); then we choose (branched, or none).
    case "whirlwind": {
      const replies = (x) => [clone(x), ...x.units.map((u) => { const y = clone(x); leaveBoard(y, unitRef(y, u), true); y.log.push(`  you return ${u.card.n}`); return y; })];
      const theirOpts = [clone(t), ...t.units.map((u) => { const y = clone(t); leaveBoard(y, unitRef(y, u), true); y.log.push(`  they return ${u.card.n}`); return y; })];
      return replies(theirPick(theirOpts, memo, t, replies));
    }
    // Divine Judgment: each player keeps 2 units, 2 gear, 2 runes and 2 cards in hand; the rest are recycled (§417.1: gone
    // this turn). We branch over the pair of units we keep; they keep the pair worst for us and their two best fight cards.
    case "judgment": {
      const pairs = (xs) => { if (xs.length <= 2) return [xs]; const out = []; for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) out.push([xs[i], xs[j]]); return out.slice(0, 10); };
      const keepOnly = (y, side, keep) => { for (const u of y.units.filter((v) => v.side === side && !keep.some((k) => k.uid === v.uid))) leaveBoard(y, u, false); };
      const base = clone(t);
      const gearKeep = base.gear.map((g, i) => i).sort((a, b) => (base.gear[b].e || 0) - (base.gear[a].e || 0)).slice(0, 2);
      base.gear = gearKeep.map((i) => t.gear[i]); base.gearMeta = gearKeep.map((i) => t.gearMeta[i]);
      base.runes = base.runes.slice().sort((a, b) => b.ready - a.ready).slice(0, 2);
      base.hand = base.hand.slice().sort((a, b) => isSpell(b) - isSpell(a)).slice(0, 2);
      base.their.hand = base.their.hand.slice().sort((a, b) => fightSpell(b) - fightSpell(a)).slice(0, 2);
      base.log.push("  Divine Judgment: each player keeps 2 units, 2 gear, 2 runes, 2 cards");
      const theirsKept = theirPick(pairs(theirs(base)).map((pr) => { const y = clone(base); keepOnly(y, 1, pr); return y; }), memo, t);
      return pairs(ours(theirsKept)).map((pr) => { const y = clone(theirsKept); keepOnly(y, 0, pr); return y; });
    }
    // Invert Timelines: each player discards their hand and draws 4. Ours: gone, the 4 are unknown (draw). Theirs: 4 unknown
    // cards the solver can't see, so as the cautious reading their known hand stays (never credited with stripping it).
    case "invert": if (ctx.side === 0) { t.hand = []; t.log.push("  you discard your hand (and draw 4 unknown cards)"); } return [t];
    // Chronobreak: X of our units (X = the Power paid) banished and played back where they were: stunned or damaged ones first.
    case "chronobreak": {
      if (ctx.side !== 0) return [t];
      const xs = ours(t).sort((a, b) => (b.stunned || b.dmg > 0 ? 1 : 0) - (a.stunned || a.dmg > 0 ? 1 : 0)).slice(0, ctx.paidX || 0);
      let y = t; for (const u of xs) { const v = unitRef(y, u); if (v) y = applyOp(y, { op: "redeploy", to: "same location", target: { who: "it" } }, [v], ctx, memo)[0] || y; }
      return [y];
    }
    case "portalRepeat": if (ctx.side === 0) { t.portalRepeat = true; t.log.push("  the next spell has [Repeat] equal to its cost"); } return [t];
    // Alpha Strike: the chosen unit's Might, split among enemy units at battlefields: lethal to the cheapest first, one
    // battlefield first then the others (branched by battlefield); 1 XP per kill.
    case "splitKill": {
      const r = [].concat(ctx.ref || [])[0], rv = r && unitRef(t, r); if (!rv || ctx.side !== 0) return [t];
      const out = [];
      for (const first of bfsOf(t).filter((b) => theirs(t, b).length)) {
        const y = clone(t); let left = mightOf(y, unitRef(y, rv)), kills = 0;
        const order = theirs(y).filter((u) => u.at >= 0).sort((a, b) => (b.at === first) - (a.at === first) || (mightOf(y, a) - (a.dmg || 0)) - (mightOf(y, b) - (b.dmg || 0)));
        for (const u of order) { if (left <= 0) break; const need = Math.max(1, mightOf(y, u) - (u.dmg || 0)), n = Math.min(need, left); left -= n; const v = unitRef(y, u); if (!v) continue; v.dmg = (v.dmg || 0) + n; if (v.dmg >= mightOf(y, v)) { dieOutside(y, v, memo); kills++; } }
        if (kills) { y.xp = (y.xp || 0) + kills; y.xpGained = true; y.log.push(`  ${kills} killed: gain ${kills} XP`); }
        out.push(y);
      }
      return out.length ? out : [t];
    }
    case "grantReady": for (const u of us) u.grantReady = true; return [t];
    // Dancing Grenade: recast for {A}, each time 1 more Bonus Damage (3, then 4, …): 0-3 recasts, each on the best enemy target.
    case "grenade": {
      if (ctx.side !== 0) return [t];
      const out = [t]; let y = t;
      for (let i = 1; i <= 3; i++) {
        y = clone(y); if (!pay(y, 0, "rainbow", 1, true)) break;
        const n = 2 + i, foes = theirs(y).sort((a, b) => ((mightOf(y, b) - (b.dmg || 0) <= n) - (mightOf(y, a) - (a.dmg || 0) <= n)) || mightOf(y, b) - mightOf(y, a));
        if (!foes[0]) break;
        y.log.push(`  Dancing Grenade again ({A}): ${n} to their ${foes[0].card.n}`);
        y = applyOp(y, { op: "damage", n }, [foes[0]], ctx, memo)[0] || y; out.push(y);
      }
      return out;
    }
    // Relentless Pursuit: one of our unattached Equipment onto the moved unit, free. Azir, Ascendant: one of the swapped
    // unit's Equipment onto him.
    case "attachToRef": {
      const r = [].concat(ctx.ref || [])[0], rv = r && unitRef(t, r); if (!rv) return [t];
      const out = [t];
      t.gear.forEach((g, i) => { if (!/\[Equip\]/.test(g.x || "")) return; const y = clone(t); dropGear(y, i); y.log.push(`  ${g.n} attaches to ${rv.card.n}`); out.push(...attachStates(y, unitRef(y, rv), g, memo)); });
      return out;
    }
    case "takeEquipFromRef": {
      const r = [].concat(ctx.ref || [])[0], rv = r && unitRef(t, r), me = ctx.src && unitRef(t, ctx.src); if (!rv || !me || !rv.gear.length) return [t];
      return [t, ...rv.gear.map((g) => { const y = clone(t), from = unitRef(y, rv); from.gear.splice(from.gear.indexOf(g), 1); y.log.push(`  ${g.n} moves to ${me.card.n}`); return attachStates(y, unitRef(y, me), g, memo)[0]; })];
    }
    // Transpositionist: after returning a friendly unit, play a unit from hand with less Might than it had, free (to base).
    case "playLesser": {
      const r = [].concat(ctx.ref || [])[0]; if (!r || ctx.side !== 0) return [t];
      const cap = r.card.m || 0, out = [t];
      for (const c of [...new Set(t.hand.filter((x) => isUnit(x) && (x.m || 0) < cap))]) { const y = clone(t); y.hand.splice(y.hand.indexOf(c), 1); const u = mkUnit(c, 0, -1, entersReady(y, c)); y.units.push(u); y.log.push(`  play ${c.n} free (less Might than ${r.card.n})`); onWePlay(y, c, memo); onOurUnitPlayed(y, u, memo); out.push(y); }
      return out;
    }
    case "winGame": if (ctx.side === 0) { t.wonGame = true; t.log.push(`  ${ctx.card?.n || "it"}: you win the game`); } return [t];
    // Lee Sin, Ascetic can have any number of buffs; Stand United makes each buff +1 more this turn.
    case "buff": for (const u of us) if (!u.buffed || compile(u.card).statics.some((x) => x.op === "multiBuff")) { const m0 = mightOf(t, u); u.buffed = true; u.bonus = (u.bonus || 0) + 1 + (t.buffPlus && u.side === 0 ? 1 : 0);
      // Mistfall: when we buff an exhausted friendly unit, pay {Body} and exhaust it to ready that unit.
      if (u.side === 0 && !u.ready) { const i = t.gear.findIndex((g, k) => compile(g).statics.some((x) => x.op === "mistfall") && !t.gearUsed.includes(`g${t.gearMeta[k].gid}`)); if (i > -1) { const y = clone(t); if (pay(y, 0, "Body", 1)) { Object.assign(t, y); unitRef(t, u).ready = true; t.gearUsed.push(`g${t.gearMeta[i].gid}`); t.log.push(`  Mistfall readies ${u.card.n}`); } } } mightChanged(t, u, m0, ctx, memo); if (u.side === ctx.side) fire(t, [u], "buffMe", {}, memo); } return [t];
    case "kill": for (const u of us) dieOutside(t, u, memo); return [t];
    case "banish": for (const u of us) dieOutside(t, u, memo, "is banished"); if (us.some((u) => u.side === 0 && !u.card.token)) fireLegend(t, "youBanishOwn", {}, memo); return [t];   // Master of Shadows
    case "bounce": case "bounce2": {
      const all = e.op === "bounce2" ? [...us, ...[].concat(ctx.ref2 || []).map((u) => unitRef(t, u)).filter(Boolean)] : us;
      for (const u of all) { dieOutside(t, u, memo, "returns to hand"); if (!u.card.token) (u.side === 0 ? t.hand : t.their.hand).push(u.card); }
      return [t];
    }
    case "recall": for (const u of us) { const from = u.at; u.at = -1; vacate(t, from); } return [t];
    case "ready": { const rs = us.filter((u) => !compile(u.card).statics.some((x) => x.op === "noReady")); for (const u of rs) u.ready = true; fire(t, rs.filter((u) => u.side === ctx.side), "readied", {}, memo);
      if (ctx.side === 0) for (const u of rs.filter((v) => v.side === 0)) youReadied(t, u, memo);   // Pirate's Haven
      return [t]; }   // Maduli can't be readied   // Irelia, Fervent
    case "exhaust": for (const u of us) u.ready = false; return [t];
    case "lock": if (ctx.side === 0) { t.their.locked = true; t.log.push("  they can't play cards this turn"); } return [t];
    case "add": t.pool.push(...(e.power || []).map((d) => ({ d, spellsOnly: !!e.spellsOnly, gearOnly: !!e.gearOnly, notSpells: !!e.notSpells })));
      if (e.spellsOnly) t.spellE = (t.spellE || 0) + (e.energy || 0); else if (e.unitsOnly) t.extraEUnits = (t.extraEUnits || 0) + (e.energy || 0); else t.extraE += e.energy || 0; return [t];
    case "channel": for (let i = 0; i < (e.n || 1); i++) t.runes.push({ d: "?", ready: true }); return [t];
    case "readyRunes": { let n = e.n || 1; for (const r of t.runes) if (!r.ready && n > 0) { r.ready = true; n--; } return [t]; }
    case "edict": {
      for (const side of [0, 1]) { if (side === ctx.side && e.skipMineIfPaid && ctx.paidExtra) continue; const mine = t.units.filter((u) => u.side === side).sort((a, b) => (a.card.token ? -1 : 0) - (b.card.token ? -1 : 0) || mightOf(t, a) - mightOf(t, b)); if (mine[0]) dieOutside(t, mine[0], memo); }
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
    case "discountNext": { const k = costParts(e.cost); t.discount = { e: k.e, p: k.p, spellsOnly: !!e.spellsOnly, unitsOnly: !!e.unitsOnly }; t.log.push(`  the next card costs ${e.cost} less`); return [t]; }
    case "prevent": for (const u of us) u.prevent = (u.prevent || 0) + e.n; return [t];
    case "redeploy": {
      // Banished and played again (Temporal Breach, Thrill of the Hunt): a fresh unit, exhausted, with its play effects.
      const out = [];
      for (const u of us) {
        const dests = /same location/.test(e.to) ? [u.at] : /base/.test(e.to) ? [-1] : bfsOf(t);
        for (const d of dests) {
          const t2 = clone(t); const v = unitRef(t2, u); if (!v) continue;
          const from = v.at; t2.units = t2.units.filter((x) => x.uid !== v.uid);
          const nu = mkUnit(v.card, v.side, d, compile(v.card).statics.some((x) => x.op === "enterReady")); t2.units.push(nu);   // "I enter ready" (Ekko)
          t2.log.push(`  ${v.card.n} is banished and played again at ${where(d)}`);
          if (from !== d) vacate(t2, from);
          let st2 = [t2];
          for (const a of compile(nu.card).abilities.filter((x) => x.trigger === "play")) st2 = st2.flatMap((x) => runAbility(x, a, { side: nu.side, src: unitRef(x, nu), here: d }, memo));
          for (const x of st2) { if (d >= 0 && nu.side === 0 && theirs(x, d).length && x.ctrl[d] !== 0) resolveAt(x, d, 0, memo); else if (d >= 0 && nu.side === 0 && x.ctrl[d] !== 0 && !theirs(x, d).length) conquerBf(x, d, memo); }
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
    // Points from an effect: not bound by the Final Point rule (§473.1.a.1); won() checks at the end, as cleanup does (§194.2).
    case "score": t.score[ctx.side] += e.n || 1; t.log.push(`  ${who} score ${e.n || 1} (${t.score.join("–")})`); return [t];
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
      const r0 = [].concat(ctx.ref || [])[0];
      let dests = /open battlefield/.test(e.to) ? bfsOf(t).filter((b) => t.ctrl[b] == null && !t.units.some((u) => u.at === b))   // §170.11.c
        : /battlefield you control/.test(e.to) ? bfsOf(t).filter((b) => t.ctrl[b] === ctx.side)   // Call to Battle
        : /different battlefield/.test(e.to) ? (us[0] ? bfsOf(t).filter((b) => b !== us[0].at) : [])   // Imposing Challenger
        : /weaker enemy battlefield/.test(e.to) ? (() => { const me = ctx.src && unitRef(t, ctx.src); return me ? bfsOf(t).filter((b) => { const en = t.units.filter((v) => v.side !== me.side && v.at === b); return en.length && en.reduce((a, v) => a + mightOf(t, v), 0) < mightOf(t, me); }) : []; })()   // Maduli
        : /theirUnitLocation/.test(e.to) ? (() => { const mv = us[0]; return mv ? [-1, ...bfsOf(t)].filter((l) => t.units.some((v) => v.side === mv.side && v.uid !== mv.uid && v.at === l)) : []; })()   // Temptation
        : /lastExhaustedLoc/.test(e.to) ? (t.lastExhausted ? [t.lastExhausted.at] : [])   // Forgotten Signpost
        : /refLocation/.test(e.to) ? (r0 && (unitRef(t, r0) || r0).at >= 0 ? [(unitRef(t, r0) || r0).at] : [])   // Zenith Blade: that enemy unit's battlefield
        : /where you have units/.test(e.to) ? bfsOf(t).filter((b) => t.units.some((u) => u.side === ctx.side && u.at === b))
        : /occupied enemy battlefield/.test(e.to) ? bfsOf(t).filter((b) => t.units.some((u) => u.side !== ctx.side && u.at === b))
        : /to or from (?:your |its )?base/.test(e.to) ? (us[0] ? (us[0].at < 0 ? bfsOf(t) : [-1]) : [])   // Unforgiven
        : /that battlefield|here|my battlefield|my location/.test(e.to) ? [ctx.here] : /base/.test(e.to) ? [-1] : [-1, ...bfsOf(t)];
      if ([0, 1].some((sd) => hasStatic(t, sd, "noMoveToBase"))) dests = dests.filter((d) => d !== -1);   // Minotaur Reckoner
      const out = [];
      for (const d of dests) {
        if (d == null) continue;
        if (us.some((u) => u.at === d)) continue;
        const t2 = clone(t); const ms = us.map((u) => unitRef(t2, u)).filter(Boolean);
        if (!ms.length) continue;
        const froms = [...new Set(ms.map((u) => u.at))];
        for (const u of ms) { u.at = d; if (e.ready) u.ready = true; if (u.side === 0) { u.moves = (u.moves || 0) + 1; if (u.moves === 3) fire(t2, [u], "thirdMove", {}, memo); } }
        // Shadow Dash: "If you have exactly two units there, they each get +1 M this turn."
        if (e.twoBonus && d >= 0) { const mine2 = t2.units.filter((u) => u.side === ctx.side && u.at === d); if (mine2.length === 2) for (const u of mine2) u.bonus = (u.bonus || 0) + e.twoBonus; }
        // Blast Cone: when we move an enemy unit, exhaust it to stun that unit.
        if (ctx.side === 0 && ms[0].side === 1) t2.gear.forEach((g, i) => { if (compile(g).statics.some((x) => x.op === "blastCone") && !t2.gearUsed.includes(`g${t2.gearMeta[i].gid}`)) { t2.gearUsed.push(`g${t2.gearMeta[i].gid}`); for (const u of ms) u.stunned = true; t2.log.push(`  Blast Cone stuns ${ms.map((u) => u.card.n).join(" + ")}`); } });
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
      // Heimerdinger, Academy Instructor (ours, at a battlefield): each unit token may be a 3 M Mech instead: both are branches.
      if (ctx.side === 0 && !e._heimer && !e.copyRef && !e.copySelf && ours(t).some((u) => u.at >= 0 && compile(u.card).statics.some((x) => x.op === "heimerMech"))) {
        const alt = clone(t);
        return [...applyOp(t, { ...e, _heimer: true }, set, ctx, memo), ...applyOp(alt, { ...e, _heimer: true, name: "Mech", might: 3, keywords: [] }, set, ctx, memo)];
      }
      const loc = /base/.test(e.to) ? -1 : ctx.here ?? -1;
      // copyRef (Mirror Image): the token becomes a copy of the chosen unit (its printed card), with the token's keywords.
      const r0 = e.copyRef ? [].concat(ctx.ref || [])[0] : null;
      if (e.copyRef && !r0) return [t];
      const self = e.copySelf ? ctx.src?.card || ctx.card : null;   // Keeper of Masks: copies of me
      const card = r0 ? { ...r0.card, token: true, x: [r0.card.x || "", ...(e.keywords || []).map((k) => `[${k}]`)].filter(Boolean).join("\n") } : self ? { ...self, token: true } : mkToken(e);
      // Zilean, Time Mage (at a battlefield): once a turn, one more copy.
      let count = e.count || 1;
      if (ctx.side === 0 && !t.zileanUsed && hasStatic(t, 0, "zilean")) { t.zileanUsed = true; count++; }
      for (let i = 0; i < count; i++) { const u = mkUnit(card, ctx.side, loc, !!e.ready || (ctx.side === 0 && !!t.enterReady) || hasStatic(t, ctx.side, "tokensReady") || hasStatic(t, ctx.side, "othersEnterReady") || (ctx.side === 0 && loc >= 0 && t.ctrl[loc] === 0 && legendHas(t, "exileReady"))); t.units.push(u); if (ctx.side === 0) { onOurUnitPlayed(t, u, memo); fire(t, ours(t).filter((v) => v.uid !== u.uid), "youPlayToken", {}, memo); } }   // Lillia, Protector of Dreams
      if (r0) { t.log.push(`  ${who}: a ready Reflection token, a copy of ${r0.card.n}, to ${where(loc)}`); return [t]; }
      // Emperor of the Sands: our Sand Soldiers have [Weaponmaster] (one of our Equipment attaches as each is played).
      if (ctx.side === 0 && hasTag(card, "Sand Soldier") && legendHas(t, "sandWeaponmaster")) {
        t.log.push(`  ${who}: ${count > 1 ? `${count} ` : ""}${e.might}-Might ${e.name} token${count > 1 ? "s" : ""} to ${where(loc)} ([Weaponmaster])`);
        let ys = [t]; for (const u of t.units.slice(-count)) ys = ys.flatMap((y) => { const v = unitRef(y, u); return v ? weaponmaster(y, v, memo) : [y]; });
        return ys;
      }
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
  if (a.modal && a.repeatCosts) {
    // Curtain Call: "Choose one you haven't already chosen", [Repeat] [e1] / {A} / [e1]{A}: 1-4 different modes, each extra
    // paid with the cheapest unpaid Repeat instance (§820.1.c: each instance once).
    const ms = a.modes, costs = a.repeatCosts.slice().sort((x, y) => x.e + x.p - (y.e + y.p)), out = [];
    const sets = []; const rec = (i, cur) => { if (cur.length) sets.push(cur); if (cur.length > costs.length) return; for (let j = i; j < ms.length; j++) rec(j + 1, [...cur, ms[j]]); }; rec(0, []);
    for (const set of sets.filter((x) => x.length <= 1 + costs.length)) {
      const y = clone(s); let okPay = true;
      for (const c of costs.slice(0, set.length - 1)) if (!pay(y, c.e, "rainbow", c.p, true)) { okPay = false; break; }
      if (!okPay) continue;
      if (set.length > 1) y.log.push(`  ${set.length} modes (Repeat ${set.length - 1}×)`);
      out.push(...runAbility(y, { ...a, modal: false, modes: null, repeatCosts: null, effects: set.flatMap((x) => x.effects) }, ctx, memo, false));
    }
    if (inPlace) { const best = bestResult(out, s, ctx.side ?? 0, memo); if (best) Object.assign(s, best); return [s]; }
    return out.length ? out : [s];
  }
  if (a.modal && (a.modes || []).length) {
    // Choose one (or two): each mode, or each pair of modes, is a branch.
    const ms = a.modes, picks = a.pick === 2 ? ms.flatMap((x, i) => ms.slice(i + 1).map((y) => [x, y])) : ms.map((x) => [x]);
    const res = picks.flatMap((pk) => runAbility(s, { ...a, modal: false, modes: null, effects: pk.flatMap((x) => x.effects) }, ctx, memo, false));
    if (inPlace) { const best = bestResult(res, s, ctx.side ?? 0, memo); if (best) Object.assign(s, best); return [s]; }
    return res.length ? res : [s];
  }
  const effs = a.effects || [];
  const go = (t, i, c) => {
    if (i >= effs.length) return [t];
    // "Draw 1, then discard 1": the card drawn (unknown) may be the one discarded.
    const e = effs[i].op === "discard" && effs.slice(0, i).some((x) => x.op === "noTurn" && x.why === "draw") ? { ...effs[i], afterDraw: true } : effs[i];
    if (!RUN_OPS.has(e.op) || e.op === "noTurn" || e.op === "noop") return go(t, i + 1, c);
    if (e.cond && !condMet(t, e.cond, c)) return go(t, i + 1, c);   // a joined follow-on's own condition (lib/cardtext.mjs compile)
    if (e.op === "chooseBf") {
      const bfs = bfsOf(t).filter((b) => (!e.mine || t.units.some((u) => u.side === c.side && u.at === b)) && (!e.controlled || t.ctrl[b] === c.side) && (!e.enemyOccupied || t.units.some((u) => u.side !== c.side && u.at === b)));
      const out = []; for (const b of bfs) out.push(...go(t, i + 1, { ...c, here: b }));
      return out.length ? out : go(t, i + 1, c);
    }
    if (e.op === "choose") {
      const sets = targetSets(t, e.target, c), sets2 = e.target2 ? targetSets(t, e.target2, c) : [[]];
      const out = [];
      for (const x of sets.slice(0, 8)) for (const y of sets2.slice(0, 8)) {
        if (e.sameLoc && x[0] && y[0] && x[0].at !== y[0].at) continue;   // "at the same battlefield"
        let tc = t; if (c.side === 0 && [...x, ...y].some((u) => u.side !== 0) && !t.choseEnemy) { tc = clone(t); tc.choseEnemy = true; }
        out.push(...go(tc, i + 1, { ...c, ref: x, ref2: y }));
      }
      return out.length ? out : go(t, i + 1, c);
    }
    // Our legend as "me" (ready / empower / disempower / exhaust me), with an optional "pay X to".
    if (c.legend && e.target?.who === "me" && t.legend && ["ready", "empower", "disempower", "exhaust"].includes(e.op)) {
      const y = clone(t); let ok = true;
      if (e.pay) { const k = costParts(e.pay); ok = pay(y, k.e, k.d, k.p, false, "legendAbility"); }
      const out = [];
      if (ok) {
        if (e.op === "ready") y.legend.ready = true; else if (e.op === "exhaust") y.legend.ready = false;
        else if (e.op === "empower") { if (!y.legend.empowered) { y.legend.empowered = true; y.log.push(`  ${y.legend.card.n} is Empowered`); } }
        else y.legend.empowered = false;
        out.push(...go(y, i + 1, { ...c, did: true }));
      }
      if (e.optional || !ok) out.push(...go(t, i + 1, { ...c, did: false }));
      return out;
    }
    const out = [];
    const sets = e.op === "swing" ? [[]] : targetSets(t, e.target, c);
    for (const set of sets.slice(0, 10)) {
      if (e.target?.choose !== false && e.target?.who === "unit" && !set.length) continue;
      const t2 = clone(t);
      // Paying for it: an optional "pay X to …", and Deflect on each enemy unit chosen.
      const extra = e.ignoreDeflect ? 0 : set.filter((u) => u.side !== c.side && e.target?.choose !== false).reduce((n, u) => n + deflectOf(t, u), 0);   // Decree of Insight ignores Deflect
      if (e.pay) { const k = costParts(e.pay); if (!payFor(t2, k.e, k.d, k.p, c.side)) continue; }
      if (e.payXp) { if (c.side !== 0 || (t2.xp || 0) < e.payXp) continue; t2.xp -= e.payXp; }   // "spend N XP to …" (Kha'Zix, Evolving Hunter)
      if (c.side === 0 && e.target?.choose !== false && set.some((u) => u.side !== 0)) t2.choseEnemy = true;   // Hungry Wolf
      if (extra && !payFor(t2, 0, "rainbow", extra, c.side)) continue;
      if (e.op === "swing") { const a1 = targetSets(t2, e.a.target, c)[0] || [], b1 = targetSets(t2, e.b.target, c)[0] || []; for (const u of a1) unitRef(t2, u).bonus += e.a.n; for (const u of b1) unitRef(t2, u).bonus += e.b.n; out.push(...go(t2, i + 1, { ...c, did: true })); continue; }
      // "It" follows a chosen target, not an effect on each unit (Stormbringer: "…to all enemy units…, then move your unit there").
      for (const t3 of applyOp(t2, e, set, c, memo)) {
        // Blade Dancer: "When you choose a friendly unit" (our spells and abilities, not the legend's own).
        if (c.side === 0 && !c.legend && e.target?.choose !== false && e.target?.who === "unit") { const fr = set.filter((u) => u.side === 0).map((u) => unitRef(t3, u)).filter(Boolean); if (fr.length) fireLegend(t3, "youChooseFriendly", { ref: fr }, memo); }
        out.push(...go(t3, i + 1, { ...c, ref: set.length && e.target?.who !== "each" ? set : c.ref, did: true }));
      }
    }
    if (e.optional || !out.length) out.push(...go(t, i + 1, { ...c, did: false }));
    return out;
  };
  const res = go(inPlace ? s : clone(s), 0, ctx);
  if (inPlace) { const best = bestResult(res, s, ctx.side ?? 0, memo); if (best && best !== s) Object.assign(s, best); return [s]; }
  return res;
}
// A trigger run in place (fire(), holds, deaths) can't branch the search, so it keeps its best result: ours by a short
// look ahead (depth 2), theirs worst for us. Until 24 Nov it kept the first (Explosimian's Bombs landed at A; Demacian
// Illuminators buffed whichever unit came first). Inside a look-ahead already, the state's own value decides.
function bestResult(res, before, side, memo) {
  const seen = new Map(); for (const y of res) { const k = keyOf(y); if (!seen.has(k)) seen.set(k, y); }
  const xs = [...seen.values()].slice(0, 6);
  if (xs.length < 2) return xs[0];
  const start = memo?.start || before;
  const ahead = (y) => (memo?.inner ? valueOf(y, start)
    : search(y, start, 2, { states: new Map(), fights: memo?.fights || new Map(), nodes: 0, maxNodes: 150, fightNodes: memo?.fightNodes || 500, fightCalls: 0, start, inner: true }).v);
  let best = xs[0], bv = ahead(best);
  for (const y of xs.slice(1)) { const v = ahead(y); if (side === 0 ? v > bv : v < bv) { best = y; bv = v; } }
  return best;
}
const costParts = (txt) => { const e = [...String(txt).matchAll(/\[e(\d+)\]/g)].reduce((a, m) => a + Number(m[1]), 0); const ps = [...String(txt).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((d) => d !== "T"); return { e, p: ps.length, d: ps[0] === "A" || !ps.length ? "rainbow" : ps[0] }; };
function payFor(t, e, d, p, side) { if (side === 0) return pay(t, e, d, p); if ((t.their.budget.e < e) || (t.their.budget.p < p)) return false; t.their.budget.e -= e; t.their.budget.p -= p; return true; }
// Their triggers on our plays (Vex, Apathetic: stun it, it can't move), then ours (Ravenbloom +1 on a spell).
function discardCard(t, c, memo) {
  t.hand.splice(t.hand.indexOf(c), 1); toTrash(t, c); t.discarded = (t.discarded || 0) + 1; t.lastDiscard = c; t.log.push(`  discard ${c.n}`);
  fire(t, ours(t), "youDiscard", {}, memo);   // Jinx, Rebel
  const out = [t];
  // "When you discard me, you may pay [e1] to give a friendly unit +2 M this turn" (Mask Mother): each choice is a branch.
  for (const a of compile(c).abilities.filter((x) => x.trigger === "discardMe" && !(x.effects || []).some((e) => e.op === "playSelf")))
    for (const y of runAbility(t, a, { side: 0, src: null, card: c }, memo)) if (y !== t) out.push(y);
  // "When you discard me, you may pay {Fury} to play me" (Flame Chompers): played to base, exhausted.
  for (const a of compile(c).abilities.filter((x) => x.trigger === "discardMe")) for (const e of a.effects || []) if (e.op === "playSelf" && isUnit(c)) {
    const y = clone(t), k = costParts(e.pay || ""); if (!pay(y, 0, k.d, k.p)) continue;
    const u = mkUnit(c, 0, -1, entersReady(y, c)); y.units.push(u); y.log.push(`  ${c.n} is played from the discard (${e.pay})`);
    onWePlay(y, c, memo); onOurUnitPlayed(y, u, memo); fireLegend(y, "youPlayNotFromHand", {}, memo); out.push(...withAccel([y], u, c));
  }
  return out;
}
function onOurUnitPlayed(t, u, memo) {
  if (t.buffOnPlay && !u.buffed) { u.buffed = true; u.bonus = (u.bonus || 0) + 1; t.log.push(`  ${u.card.n} is buffed (Rally the Troops)`); }
  fire(t, ours(t).filter((v) => v.uid !== u.uid), "youPlayOtherUnit", {}, memo);   // Cithria of Cloudfield, Reluctant Leader
  for (const v of theirs(t)) for (const a of compile(v.card).abilities.filter((x) => x.trigger === "oppPlaysUnit")) {
    if (!condMet(t, a.cond, { side: 1, src: v })) continue;
    runAbility(t, a, { side: 1, src: v, ref: [u], here: v.at }, memo, true);
    t.log.push(`  their ${v.card.n}: your ${u.card.n} is stunned${a.effects.some((e) => e.op === "noMove") ? " and can't move this turn" : ""}`);
  }
}
function onWePlay(t, card, memo) {
  t.played++;
  if (!isSpell(card) && (card.e || 0) >= 7) fireLegend(t, "youPlayCost7", {}, memo);   // Curator of the Sands: ready up to 2 runes
  // Swain, Visionary: a non-token unit, a non-token gear and a spell played this turn.
  const kind = isUnit(card) && !card.token ? "unit" : /Gear/.test(card.t || "") && !card.token ? "gear" : isSpell(card) ? "spell" : null;
  if (kind && !(t.playedKinds || []).includes(kind)) t.playedKinds = [...(t.playedKinds || []), kind];
  for (const u of ours(t)) for (const a of compile(u.card).abilities) {
    if ((a.trigger === "youPlayFirst" && t.played === 1) || (a.trigger === "youPlaySecond" && t.played === 2)) runAbility(t, a, { side: 0, src: u, here: u.at }, memo, true);
  }
  for (const u of ours(t)) for (const a of compile(u.card).abilities) {
    const big = a.trigger === "youPlayCost" && (card.e || 0) >= Number((/\[e(\d+)\] or more/i.exec(a.text) || [])[1] || 99) && (!/a spell/i.test(a.text) || isSpell(card));   // Lux, Illuminated; Sanctum Conservator
    if ((a.trigger === "youPlaySpell" && isSpell(card)) || a.trigger === "youPlayCard" || big) for (const x of runAbility(t, a, { side: 0, src: u, here: u.at, played: card }, memo, true)) void x;
  }
}
// Cost of a card for us now: printed, less what the engine can evaluate of its discounts.
function costNow(t, c) {
  let e = c.e || 0, pLess = 0;
  // Jhin, Meticulous Killer: after a spell paid [e4] or more this turn, he costs only {Mind}.
  if (t.bigSpell && compile(c).statics.some((x) => x.op === "jhinCost")) return { e: 0, d: "Mind", p: 1 };
  for (const st of compile(c).statics.filter((x) => x.op === "costLess")) {
    if (st.cond && !condMet(t, st.cond, { self: true })) continue;
    if (st.per) {
      // "I cost [eN] less for each …" (lib/cardtext.mjs COST_PER); the trash isn't on the board, so those stay full price.
      const p = String(st.per).toLowerCase(), k = /^gear you control/.test(p) ? t.gear.length + ours(t).reduce((a, u) => a + u.gear.length, 0)
        : /^exhausted unit you control/.test(p) ? ours(t).filter((u) => !u.ready).length : /^card you've played this turn/.test(p) ? t.played
        : /^battlefield you've conquered this turn/.test(p) ? t.conqueredN || 0 : /^tags? among your units/.test(p) ? tagsAmong(t, 0)
        : /^point you scored from holding this turn/.test(p) ? t.holdPoints || 0 : /^of your \[mighty\] units/.test(p) ? ours(t).filter((u) => mightOf(t, u) >= 5).length
        : /^card in your trash/.test(p) ? (t.trash ? t.trash.length : null) : /^card with my name in your trash/.test(p) ? (t.trash ? t.trash.filter((x) => x.n === c.n).length : null) : null;   // Rhasa; Shadowblade Lurker
      if (k == null) continue;
      const floor = /minimum of \[e(\d+)\]/.exec(p);
      e = Math.max(floor ? Math.min(e, Number(floor[1])) : 0, e - (st.n || 0) * k);
      if (st.pLess) pLess += st.pLess * k;   // Needlessly Large Yordle: {Calm} less too
      continue;
    }
    e -= st.n != null ? st.n : costParts(st.cost || "").e;
    if (st.cost) pLess += costParts(st.cost).p;   // Keeper of Law: [e2]{Order} less
  }
  // Herald of Scales: our Dragons cost [e2] less, to a minimum of [e1]. Sky Splitter: less by our highest Might.
  for (const u of ours(t)) for (const st of compile(u.card).statics) if (st.op === "tagCostLess" && hasTag(c, st.tag) && e > st.min) e = Math.max(st.min, e - st.n);
  if (compile(c).statics.some((x) => x.op === "costLessHighestMight")) e -= Math.max(0, ...ours(t).map((u) => mightOf(t, u)));
  if (t.freeGear != null && /Gear/.test(c.t || "") && (c.e || 0) <= t.freeGear) e = 0;   // Jayce, Man of Progress
  let p = Math.max(0, (c.p || 0) - pLess);
  // Eager Apprentice (and "your spells cost less"): spells, to a minimum. Orianna, Mechanical Marvel: one gear a turn [e1]{A} less.
  if (isSpell(c)) for (const u of ours(t)) for (const st of compile(u.card).statics.filter((x) => x.op === "spellsCostLess")) if (staticOn(t, u, st)) { const n = st.n ?? costParts(st.cost || "").e, min = st.min ?? 0; if (e > min) e = Math.max(min, e - n); }
  if (/Gear/.test(c.t || "") && !t.oriannaUsed && ours(t).some((u) => compile(u.card).statics.some((st) => st.op === "gearCostLess" && staticOn(t, u, st)))) { e -= 1; p = Math.max(0, p - 1); }
  if (t.discount && (!t.discount.spellsOnly || isSpell(c)) && (!t.discount.unitsOnly || isUnit(c))) { e -= t.discount.e; p = Math.max(0, p - t.discount.p); }   // Boy Who Shattered Time: units only   // Raging Firebrand: spells only
  return { e: Math.max(0, e), d: dom(c), p };
}

// ── our actions from a state: each returns { min?, children: [state] } ──
function actions(s, memo) {
  const out = [];
  const label = (t, x) => { t.log.push(x); return t; };
  // Move: ready units, to a battlefield (a subset of the eligible units).
  for (const b of bfsOf(s)) {
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
      const froms = [...new Set(ms.map((u) => u.at))], fromOf = new Map(ms.map((u) => [u.uid, u.at]));
      for (const u of ms) { u.at = b; u.moves = (u.moves || 0) + 1; }
      for (const f of froms) vacate(t, f);
      // Leaving, counting moves, and the exhaust the move cost: Lillia's Sprite where she left, Akali's first move, Riven, Deserter.
      for (const u of ms) { fire(t, [u], "moveFrom", { here: fromOf.get(u.uid) }, memo); if (fromOf.get(u.uid) >= 0) fire(t, [u], "moveFromBf", {}, memo); fire(t, [u], u.moves === 1 ? "firstMove" : u.moves === 2 ? "secondMove" : u.moves === 3 ? "thirdMove" : "-", {}, memo); }   // moveFromBf: Harpoon Squad
      for (const u of ms) fire(t, ours(t).filter((v) => v.uid !== u.uid), "allyExhausted", {}, memo);
      // "When I become exhausted" (the move's cost exhausted them): Riven's choice, Innovator's Gold.
      let pre = [t];
      // Stealthy Pursuer: "When a friendly unit moves from my location, I may be moved with it."
      const pursuers = ours(t).filter((u) => froms.includes(u.at) && u.at !== b && compile(u.card).statics.some((x) => x.op === "pursuer"));
      if (pursuers.length) { const y = clone(t); for (const u of pursuers) { const v = unitRef(y, u); vacate(y, v.at); v.at = b; y.log.push(`  ${v.card.n} moves with them`); } pre.push(y); }
      for (const m of ms) for (const a of compile(m.card).abilities.filter((x) => x.trigger === "exhausted")) pre = pre.flatMap((x) => runAbility(x, a, { side: 0, src: unitRef(x, m), here: b }, memo));
      out.push({ children: pre.flatMap((x) => arrive(x, b, ours(x, b).filter((u) => ms.some((m) => m.uid === u.uid) || compile(u.card).statics.some((z) => z.op === "pursuer")), memo)), tag: "move" });
    }
  }
  // Play a card from hand or the Champion Zone, its abilities run from the card text.
  const cards = [...s.hand, ...(s.champ ? [s.champ] : [])];
  const seen = new Set();
  for (const c of cards) {
    if (seen.has(c.n)) continue; seen.add(c.n);
    if (compile(c).statics.some((x) => x.op === "stalkingWolf")) continue;   // played only by its own path below
    const k = compile(c), cost = costNow(s, c);
    const extraTxt = k.sentences.find((x) => x.cost) && /pay ((?:\{\w+\}|\[e\d+\])+)/i.exec(k.sentences.find((x) => x.cost).text);
    // Rek'Sai, Breacher: units played from anywhere but a hand have [Accelerate] (the Champion Zone here; face down, the trash and the discard: withAccel).
    const accel = isUnit(c) && (k.keywords.Accelerate || (c === s.champ && ours(s).some((u) => compile(u.card).statics.some((x) => x.op === "accelNotFromHand"))));
    // [Show Off]: reveal a card from hand (or pick a friendly one) of the named kind, if there is one.
    const so = k.sentences.find((x) => x.cost && /^\[show off\]/i.test(x.text));
    const canShow = so && (/a gear/i.test(so.text) ? s.hand.some((x) => x !== c && /Gear/.test(x.t || "")) || s.gear.length > 0
      : /\[hidden\]/i.test(so.text) ? s.hand.some((x) => x !== c && /\[Hidden\]/i.test(x.x || "")) : s.hand.length > 1 || ours(s).length > 0);
    // Crescent Guardian: the additional cost can be paid only after a spell this turn.
    // Bard, Mercurial: "You may exhaust your legend as an additional cost to play me."
    const legendExtra = /exhaust your legend/i.test(k.sentences.find((x) => x.cost)?.text || "") && !!s.legend?.ready;
    const extraOk = (extraTxt || legendExtra) && !(/if you've played a spell this turn/i.test(k.sentences.find((x) => x.cost)?.text || "") && !(s.playedKinds || []).includes("spell"));
    // Optional additional costs, each an option (§355.1.a, §356.2): pay X; exhaust the legend; spend buffs (Kraken Hunter,
    // Wallop); discard a card (Brazen Buccaneer); return a friendly gear (Spirit of the Forge); kill friendly units
    // (Commander Ledros); pay any amount of Power (Chronobreak). The card's own text says what paying it buys.
    const costTxt = k.sentences.find((x) => x.cost)?.text || "", raw = c.x || "";
    const de = Number((/reduce my cost by :rb_energy_(\d+):/i.exec(raw) || [])[1] || 0), perOne = /reduce my cost by :rb_rune_\w+: for each/i.test(raw), free = /ignore this spell's cost/i.test(raw);
    const extraOpts = [{ paid: false }];
    if (extraOk && legendExtra) extraOpts.push({ paid: true, pre: (t) => { t.legend.ready = false; return true; } });
    else if (extraOk) extraOpts.push({ paid: true, post: (t) => { const x = costParts(extraTxt[1]); return pay(t, x.e, x.d, x.p, isSpell(c)); } });
    const buffed = ours(s).filter((u) => u.buffed).sort((a, b) => mightOf(s, a) - mightOf(s, b));
    const spend = (n) => (t) => { for (const u of buffed.slice(0, n)) { const v = unitRef(t, u); v.buffed = false; v.bonus = (v.bonus || 0) - 1; } t.log.push(`  spend ${n} buff${n > 1 ? "s" : ""}`); return true; };
    if (/spend any number of buffs as an additional cost/i.test(costTxt)) for (let n = 1; n <= buffed.length; n++) extraOpts.push({ paid: true, dp: perOne ? n : 0, pre: spend(n) });
    else if (/spend a buff as an additional cost/i.test(costTxt) && buffed.length) extraOpts.push({ paid: true, free, pre: spend(1) });
    if (/discard a card as an additional cost/i.test(costTxt)) for (const h of [...new Set(s.hand)].filter((x) => x !== c).slice(0, 5)) extraOpts.push({ paid: true, de, pre: (t) => { discardCard(t, h, memo); return true; } });
    if (/return a friendly gear to its owner's hand as an additional cost/i.test(costTxt)) for (const g of s.gear) extraOpts.push({ paid: true, ctx: { returnedGearE: g.e || 0 }, pre: (t) => { const j = t.gear.indexOf(g); if (j < 0) return false; dropGear(t, j); t.hand.push(g); t.log.push(`  return ${g.n} to hand`); return true; } });
    if (/kill any number of friendly units as an additional cost/i.test(costTxt)) { const weak = ours(s).sort((a, b) => mightOf(s, a) - mightOf(s, b)); for (let n = 1; n <= Math.min(4, weak.length); n++) extraOpts.push({ paid: true, dp: perOne ? n : 0, pre: (t) => { for (const u of weak.slice(0, n)) { const v = unitRef(t, u); if (v) dieOutside(t, v, memo); } return true; } }); }
    // Atakhan: kill a friendly unit; he costs its Energy and Power less (its Power as {Order}).
    if (/each energy it costs/i.test(raw) && /kill a friendly unit as an additional cost/i.test(raw)) for (const u of ours(s).slice(0, 5)) extraOpts.push({ paid: true, de: u.card.e || 0, dp: u.card.p || 0, pre: (t) => { const v = unitRef(t, u); if (!v) return false; t.log.push(`  kill ${v.card.n} (Atakhan's additional cost)`); dieOutside(t, v, memo); return true; } });
    // Starry-Eyed Songstress (legend): exhaust her and three ready friendly units to play a spell for [e2] less.
    if (isSpell(c) && s.legend?.ready && legendHas(s, "songstress")) { const rd = ours(s).filter((u) => u.ready).sort((a, b) => mightOf(s, a) - mightOf(s, b)); if (rd.length >= 3) extraOpts.push({ de: 2, pre: (t) => { t.legend.ready = false; for (const u of rd.slice(0, 3)) unitRef(t, u).ready = false; t.log.push(`  exhaust ${t.legend.card.n} and ${rd.slice(0, 3).map((u) => u.card.n).join(", ")}: [e2] less`); return true; } }); }
    if (/pay any amount of power/i.test(costTxt)) for (let x = 1; x <= Math.min(budgetOf(s).p, ours(s).length, 4); x++) extraOpts.push({ paid: true, ctx: { paidX: x }, post: (t) => pay(t, 0, "rainbow", x, isSpell(c)) });
    for (const ac of accel ? [true, false] : [false]) for (const opt of extraOpts) {
      const paidExtra = !!opt.paid;
      const t = clone(s);
      if (opt.pre && !opt.pre(t)) continue;
      const ce = opt.free ? 0 : Math.max(0, cost.e - (opt.de || 0)), cp = opt.free ? 0 : Math.max(0, cost.p - (opt.dp || 0));
      if (!pay(t, ce, cost.d, cp, isSpell(c), isSpell(c) ? "spell" : isUnit(c) ? "unit" : "gear")) continue;
      if ((!t.discount?.spellsOnly || isSpell(c)) && (!t.discount?.unitsOnly || isUnit(c))) t.discount = null;
      // Optional additional costs cost [e1] less with Ezreal, Prodigy out (his static).
      const cheap = ours(s).some((u) => compile(u.card).statics.some((x) => x.op === "extraCostLess"));
      // Accelerate's [C] on a multi-domain unit: the modern FAQs read it as [A], any domain (docs/rules.md symbols table; the FAQ wins).
      if (ac && !pay(t, cheap ? 0 : 1, (c.d || []).length > 1 ? "rainbow" : dom(c), 1)) continue;
      if (opt.post && !opt.post(t)) continue;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      t.used.push(c.n);
      const ctx = { side: 0, paidExtra, self: true, card: c, showedOff: !!canShow, fromHand: c !== s.champ, ...(opt.ctx || {}) };
      if (isUnit(c)) {
        // Where: our base or a battlefield we control (§355.2.a; until 24 Nov only the base). From a battlefield a unit
        // needs Ganking to reach another, so it's the base's equal or worse unless it enters ready there (The Exile) or
        // its text reads where it was played.
        const pre = clone(t);   // before the base play mutates t
        for (const loc of [-1, ...bfsOf(t).filter((b) => t.ctrl[b] === 0)]) {
          const t1 = loc < 0 ? t : clone(pre), lctx = { ...ctx, here: loc };
          const ready = ac || k.statics.some((x) => x.op === "enterReady" && (!x.cond || condMet(t1, x.cond, lctx))) || !!t1.enterReady || hasStatic(t1, 0, "othersEnterReady")   // Magma Wurm (already on the board)
            || k.statics.some((x) => x.alsoEnterReady && condMet(t1, x.cond, { side: 0, self: true }))   // Monch
            || (loc >= 0 && legendHas(t1, "exileReady"));   // The Exile
          if (loc >= 0 && !ready && !k.abilities.length && !k.statics.length) continue;   // a plain unit exhausted at a battlefield: base is as good
          const u = mkUnit(c, 0, loc, ready); t1.units.push(u); if (loc >= 0) t1.playedToBf = true;
          if (t1.nextUnit) { if (t1.nextUnit.buff) { u.buffed = true; u.bonus += 1; } if (t1.nextUnit.ready) u.ready = true; t1.nextUnit = null; }   // Last Caress / Nami
          label(t1, `play ${c.n}${loc >= 0 ? ` to ${BF[loc]}` : ""}${ac ? " with Accelerate (enters ready)" : ""}${c === s.champ ? " from the Champion Zone" : ""}`);
          onWePlay(t1, c, memo); onOurUnitPlayed(t1, u, memo);
          if (c === s.champ) fireLegend(t1, "youPlayNotFromHand", {}, memo);
          let states = [t1];
          for (const a of k.abilities.filter((x) => x.trigger === "play" || x.trigger === "playOrAttack" || x.trigger === "playAndConquer" || x.trigger === "playOrScore" || x.trigger === "playOrFirstGear")) states = states.flatMap((x) => runAbility(x, a, { ...lctx, src: unitRef(x, u) }, memo));
          if (k.keywords.Weaponmaster) states = states.flatMap((x) => { const v = unitRef(x, u); return v ? weaponmaster(x, v, memo) : [x]; });
          out.push({ children: states, tag: "unit" });
        }
      } else if (isSpell(c)) {
        label(t, `cast ${c.n}`);
        if (cost.e >= 4) t.bigSpell = true;
        t.lastSpellE = cost.e; t.maxSpellE = Math.max(t.maxSpellE || 0, cost.e);   // Revna, Prepared Neophyte
        // Countered back (our own counter): the spell resolves as below, from that state.
        const countered = counterChildren(t, c, (y) => { onWePlay(y, c, memo); let ys = [y]; for (const a of k.abilities.filter((x) => x.trigger === "spell")) ys = ys.flatMap((x) => runAbility(x, a, ctx, memo)); for (const x of ys) toTrash(x, c); return ys; }, memo);
        onWePlay(t, c, memo);
        let states = [clone(t)];
        for (const a of k.abilities.filter((x) => x.trigger === "spell")) states = states.flatMap((x) => runAbility(x, a, ctx, memo));
        for (const x of states) { x.nextSpellBonus = 0; toTrash(x, c); }   // Ravenborn Tome: used by this spell; the spell goes to the trash
        // Square Up: "[Repeat] — Discard 1". Temporal Portal: the next spell has [Repeat] equal to its cost.
        if (/\[Repeat\]\s*—\s*Discard 1/i.test(c.x || "")) { const again = []; for (const x of states.slice(0, 4)) for (const h of [...new Set(x.hand)].slice(0, 4)) { const y = clone(x); discardCard(y, h, memo); y.log.push(`  repeat ${c.n} (discard ${h.n})`); let ys = [y]; for (const a of k.abilities.filter((z) => z.trigger === "spell")) ys = ys.flatMap((z) => runAbility(z, a, ctx, memo)); again.push(...ys); } states.push(...again); }
        if (t.portalRepeat) { const again = []; for (const x of states.slice(0, 6)) { const y = clone(x); y.portalRepeat = false; if (!pay(y, cost.e, cost.d, cost.p, true)) continue; y.log.push(`  repeat ${c.n} (Temporal Portal)`); let ys = [y]; for (const a of k.abilities.filter((z) => z.trigger === "spell")) ys = ys.flatMap((z) => runAbility(z, a, ctx, memo)); again.push(...ys); } for (const x of states) x.portalRepeat = false; states.push(...again); }
        // [Repeat]: pay its cost to do it all again.
        if (k.repeat) { const rc = costParts(k.repeat); const again = []; for (const x of states.slice(0, 6)) { const y = clone(x); if (!pay(y, rc.e, rc.d, rc.p, true)) continue; y.log.push(`  repeat ${c.n}`); let ys = [y]; for (const a of k.abilities.filter((z) => z.trigger === "spell")) ys = ys.flatMap((z) => runAbility(z, a, ctx, memo)); again.push(...ys); } states.push(...again); }
        out.push({ children: states, min: countered.length ? countered : null, tag: c.n });
      } else if (/Gear/.test(c.t || "")) {
        const deploy = k.keywords.Deploy;
        // Deploy: "may be played to any Battlefield, including enemy occupied and open battlefields" (§830.1.b.1).
        for (const here of deploy ? bfsOf(s) : [-1]) {
          const t2 = clone(t); if (here >= 0) t2.playedToBf = true;
          if (t2.freeGear != null && (c.e || 0) <= t2.freeGear) t2.freeGear = null;
          // [Quick-Draw]: "When you play it, attach it to a unit you control."
          const host = (k.keywords["Quick-Draw"] || (/\[Equip\]/.test(c.x || "") && hasStatic(t2, 0, "equipQuickDraw"))) && ours(t2).sort((x, y) => mightOf(t2, y) - mightOf(t2, x))[0];   // Jax, Unmatched
          let gid = null;
          if (host) { const ys = attachStates(t2, host, c, memo); if (ys[0] && ys[0] !== t2) Object.assign(t2, ys[0]); t2.log.push(`  attached to ${host.card.n}`); } else gid = addGear(t2, c, here);
          label(t2, `play ${c.n}${here >= 0 ? ` to ${BF[here]}` : ""}`);
          onWePlay(t2, c, memo);
          fire(t2, ours(t2), "youPlayGear", {}, memo);   // Pit Crew
          if (deploy && here >= 0) fireLegend(t2, "youPlayDeployGear", { here }, memo);   // Exemplar of Demacia: move a friendly unit there
          if (/\[Equip\]/.test(c.x || "")) t2.playedEquip = true;   // Emperor of the Sands' token ability
          if (!c.token && !t2.gearPlayed) { t2.gearPlayed = true; fire(t2, ours(t2), "playOrFirstGear", {}, memo); }   // Jayce, Brilliant Inventor
          if (ours(t2).some((u) => compile(u.card).statics.some((st) => st.op === "gearCostLess" && staticOn(t2, u, st)))) t2.oriannaUsed = true;
          let states = [t2];
          for (const a of k.abilities.filter((x) => x.trigger === "play" || x.trigger === "playOrAttack" || x.trigger === "playAndConquer" || x.trigger === "playOrScore" || x.trigger === "playOrFirstGear")) states = states.flatMap((x) => runAbility(x, a, { ...ctx, here, gid }, memo));
          out.push({ children: states, tag: c.n });
        }
      }
    }
  }
  // A unit that may be played to an open battlefield (Sneaky Deckhand): unoccupied and uncontrolled
  // (§170.11.c); played there, it contests it and conquers when the showdown closes (§190.3.a.1, §348.2.a).
  for (const c of cards.filter((x, i, a) => a.findIndex((y) => y.n === x.n) === i)) {
    if (!isUnit(c) || !(compile(c).statics.some((x) => x.op === "playToOpen") || hasStatic(s, 0, "unitsToOpen"))) continue;   // Miss Fortune, Buccaneer
    for (const b of bfsOf(s)) {
      if (s.ctrl[b] != null || s.units.some((u) => u.at === b)) continue;
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, cost.e, cost.d, cost.p)) continue;
      if ((!t.discount?.spellsOnly || isSpell(c)) && (!t.discount?.unitsOnly || isUnit(c))) t.discount = null;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, b, entersReady(t, c, b)); t.units.push(u); t.used.push(c.n); t.playedToBf = true;
      label(t, `play ${c.n} straight onto the open ${BF[b]}`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      resolveAt(t, b, 0, memo);
      out.push({ children: [t], tag: "open" });
    }
  }
  // Stalking Wolf: its additional cost kills one of our Bird/Cat/Dog/Poro units; it may go to that unit's battlefield,
  // "even if you don't have other units there", and contests it; otherwise to base.
  for (const c of cards.filter((x, i, a) => compile(x).statics.some((y) => y.op === "stalkingWolf") && a.findIndex((y) => y.n === x.n) === i)) {
    for (const pet of ours(s).filter((u) => TAGS4.some((g) => hasTag(u.card, g)))) for (const toPet of pet.at >= 0 ? [true, false] : [false]) {
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, cost.e, cost.d, cost.p)) continue;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const at = toPet ? pet.at : -1;
      dieOutside(t, unitRef(t, pet), memo);
      const u = mkUnit(c, 0, at, false); t.units.push(u); t.used.push(c.n); if (at >= 0) t.playedToBf = true;
      label(t, `play ${c.n}, killing ${pet.card.n}${at >= 0 ? `, straight to ${BF[at]}` : ""}`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      if (at >= 0) finishArrival(t, at, memo);
      out.push({ children: [t], tag: c.n });
    }
  }
  // Last Caress: the next unit we play may go to any battlefield, buffed; it contests it on arrival (as an open-battlefield play).
  // Here to Help: to a battlefield we control, [e3] less.
  if (s.nextUnit?.anywhere) for (const c of cards.filter((x, i, a) => isUnit(x) && a.findIndex((y) => y.n === x.n) === i)) {
    for (const b of bfsOf(s).filter((k) => !s.nextUnit.mine || s.ctrl[k] === 0)) {
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, Math.max(0, cost.e - (s.nextUnit.discount || 0)), cost.d, cost.p)) continue;
      if ((!t.discount?.spellsOnly || isSpell(c)) && (!t.discount?.unitsOnly || isUnit(c))) t.discount = null;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, b, entersReady(t, c, b)); t.units.push(u); t.used.push(c.n); t.playedToBf = true;
      if (t.nextUnit.buff) { u.buffed = true; u.bonus += 1; }
      const why = t.nextUnit.mine ? "Here to Help" : "Last Caress, buffed";
      t.nextUnit = null;
      label(t, `play ${c.n} straight to ${BF[b]} (${why})`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      for (const a of compile(c).abilities.filter((x) => x.trigger === "play" || x.trigger === "playOrAttack" || x.trigger === "playAndConquer" || x.trigger === "playOrScore" || x.trigger === "playOrFirstGear")) runAbility(t, a, { side: 0, self: true, card: c, src: unitRef(t, u), here: b, fromHand: c !== s.champ }, memo, true);
      finishArrival(t, b, memo);
      out.push({ children: [t], tag: "caress" });
    }
  }
  // A unit that can [Ambush] to a battlefield with enemy units (Rengar, Trophy Hunter): played straight in, it contests it.
  for (const c of seen.size ? cards.filter((x, i, a) => a.findIndex((y) => y.n === x.n) === i) : []) {
    // Arachnoid Horror: to a battlefield where an enemy unit is alone (itself, or any of ours while it's on the board).
    const anywhere = isUnit(c) && compile(c).statics.some((x) => x.op === "ambushAnywhere");
    const lone = isUnit(c) && (compile(c).statics.some((x) => x.op === "playToLoneEnemy") || hasStatic(s, 0, "unitsToLoneEnemy"));
    if (!anywhere && !lone) continue;
    for (const b of bfsOf(s)) {
      if (!theirs(s, b).length || (!anywhere && theirs(s, b).length !== 1)) continue;
      const t = clone(s), cost = costNow(t, c);
      if (!pay(t, cost.e, cost.d, cost.p)) continue;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, b, entersReady(t, c, b)); t.units.push(u); t.used.push(c.n); t.playedToBf = true;
      label(t, `play ${c.n} straight into ${BF[b]} (it can Ambush where there are enemy units)`);
      onWePlay(t, c, memo); onOurUnitPlayed(t, u, memo);
      resolveAt(t, b, 0, memo);
      out.push({ children: [t], tag: "ambush" });
    }
  }
  // Our face-down cards, hidden on an earlier turn: played free, at their battlefield (§811.1.b, §811.1.d).
  for (const b of bfsOf(s)) for (const c of s.down[b][0]) {
    if (s.hidNow.includes(c.n + b)) continue;
    const t = clone(s); t.down[b][0].splice(t.down[b][0].indexOf(c), 1); t.used.push(c.n);
    const k = compile(c), ctx = { side: 0, card: c, here: b, restrictHere: b, self: true, faceDown: true };
    label(t, `play ${c.n} from face down at ${BF[b]}`);
    onWePlay(t, c, memo);
    fire(t, ours(t), "youPlayFaceDown", {}, memo);   // Ember Monk
    fireLegend(t, "youPlayNotFromHand", {}, memo);   // Heart of the Tempest: empower me
    let states = [t], min = null;
    if (isUnit(c)) {
      const u = mkUnit(c, 0, b, false); t.units.push(u); onOurUnitPlayed(t, u, memo);
      for (const a of k.abilities.filter((x) => x.trigger === "playFaceDown" || x.trigger === "play")) states = states.flatMap((x) => runAbility(x, a, { ...ctx, src: unitRef(x, u) }, memo));
      states = withAccel(states, u, c);
    } else if (isSpell(c)) {
      const countered = counterChildren(t, c, (y) => { let ys = [y]; for (const a of k.abilities.filter((x) => x.trigger === "spell")) ys = ys.flatMap((x) => runAbility(x, a, ctx, memo)); return ys; }, memo); min = countered.length ? countered : null;
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
    const b = bfsOf(s).find((k) => s.ctrl[k] === 0 && s.down[k][0].length === 0);
    // Swift Scout (legend): hide for [e1] instead of {A}.
    if (c && b != null && legendHas(s, "hideForEnergy")) { const t = clone(s); if (pay(t, 1, "rainbow", 0)) { t.hand.splice(t.hand.indexOf(c), 1); t.down[b][0].push(c); t.hidNow.push(c.n + b); label(t, `hide ${c.n} at ${BF[b]} ([e1], Swift Scout)`); fire(t, ours(t), "youHide", {}, memo); out.push({ children: [t], tag: "hide" }); } }
    if (c && b != null) { const t = clone(s); if (pay(t, 0, "rainbow", 1)) { t.hand.splice(t.hand.indexOf(c), 1); t.down[b][0].push(c); t.hidNow.push(c.n + b); label(t, `hide ${c.n} at ${BF[b]} (1 Power)`); fire(t, ours(t), "youHide", {}, memo); out.push({ children: [t], tag: "hide" }); } }
  }
  // Activated abilities of our units and gear ("{T}: [Add] {Chaos}", "[e1], {T}: …").
  const sources = [...ours(s).map((u) => ({ u, card: u.card, id: `u${u.uid}` })), ...s.gear.map((g, i) => ({ card: g, id: `g${s.gearMeta[i].gid}`, at: gearAt(s, i), gid: s.gearMeta[i].gid }))];
  // Heimerdinger, Inventor: every {T} ability of our legend, units and gear; using one exhausts him. Dominus: "{A}{A}: Ready me."
  for (const h of ours(s).filter((u) => compile(u.card).statics.some((x) => x.op === "heimer"))) {
    const abil = [...ours(s).filter((u) => u.uid !== h.uid).map((u) => u.card), ...s.gear, ...(s.legend ? [s.legend.card] : [])].flatMap((c) => compile(c).abilities.filter((a) => a.trigger === "activated" && /\{T\}/.test(a.cost || "")));
    if (abil.length) sources.push({ u: h, card: h.card, id: `heimer${h.uid}`, abil });
  }
  for (const u of ours(s).filter((w) => w.grantReady)) sources.push({ u, card: u.card, id: `dominus${u.uid}`, abil: [{ trigger: "activated", cost: "{A}{A}", speed: "main", effects: [{ op: "ready", target: { who: "me", choose: false } }], text: "{A}{A}: Ready me. (Dominus)" }] });
  // Our legend: its own activated abilities, and Heartening Soul's "{T}: Give a unit +3 M this turn" while Soul is ours.
  if (s.legend) {
    const abil = [...compile(s.legend.card).abilities.filter((x) => x.trigger === "activated")];
    if (ours(s).some((u) => compile(u.card).statics.some((x) => x.op === "legendPump"))) abil.push({ trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "might", n: 3, until: "turn", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "{T}: Give a unit +3 M this turn. (Heartening Soul)" });
    sources.push({ card: s.legend.card, legend: true, id: "legend", at: -1, abil });
  }
  for (const src of sources) for (const a of (src.abil || compile(src.card).abilities).filter((x) => x.trigger === "activated")) {
    if (UNPAID_COST.test(a.cost)) continue;
    const spendBuff = /spend my buff/i.test(a.cost);
    if (spendBuff && !src.u?.buffed) continue;
    const xpCost = /spend (\d+) xp/i.exec(a.cost);
    if (/disempower this/i.test(a.cost) && !(src.gid != null && gearEmp(s, src.gid))) continue;   // Hextech Disc, Glowstone
    if (/disempower me/i.test(a.cost) && !(src.legend ? s.legend.empowered : src.u?.empowered)) continue;   // Heart of the Tempest, Soul's Reflection …
    if (/banish a unit or gear from your trash/i.test(a.cost) && !(s.trash && s.trash.some((x) => isUnit(x) || /Gear/.test(x.t || "")))) continue;   // Iron Revenant
    if (a.cond && !condMet(s, a.cond, { side: 0, src: src.u || null, legend: !!src.legend, gid: src.gid })) continue;   // "[Empowered][>]", "Use only if …"
    if (xpCost && (s.xp || 0) < Number(xpCost[1])) continue;
    const tap = /\{T\}/.test(a.cost);
    if (tap && (src.legend ? !s.legend.ready : src.u ? !src.u.ready : s.gearUsed.includes(src.id))) continue;
    if (!tap && s.gearUsed.includes(`${src.id}|${a.text}`)) continue;   // a non-exhaust ability: once a turn here (not a rule; a search bound)
    // "Recycle N from your trash" / "Recycle a unit from your trash" (Vi, Destructive; Assembly Rig): only with pos.trash.
    const rt = /recycle (\d+|a unit) from your trash/i.exec(a.cost || "");
    if (rt && !(s.trash && (rt[1] === "a unit" ? s.trash.some(isUnit) : s.trash.length >= Number(rt[1])))) continue;
    const t = clone(s); const k = costParts(a.cost);
    if (rt) { if (rt[1] === "a unit") t.trash.splice(t.trash.findIndex(isUnit), 1); else t.trash.splice(0, Number(rt[1])); }
    // "This ability costs [eN] less for each rune you control" (Grumpy Rockbear, Frostcoat Mother) / "… if you control 4 or fewer runes" (Baccai Sandspinner).
    for (const x of compile(src.card).sentences) { const m1 = /costs \[e(\d+)\] less for each rune you control/i.exec(x.text), m2 = /costs \[e(\d+)\] less if you control (\d+) or fewer runes/i.exec(x.text); if (m1) k.e = Math.max(0, k.e - Number(m1[1]) * s.runes.length); if (m2 && s.runes.length <= Number(m2[2])) k.e = Math.max(0, k.e - Number(m2[1])); }
    // Bashful Bloom: "This ability costs [e1] less for each friendly unit with [Temporary]."
    if (compile(src.card).sentences.some((x) => /costs \[e1\] less for each friendly unit with \[temporary\]/i.test(x.text))) k.e = Math.max(0, k.e - ours(s).filter((u) => keywordOf([u.card.x || "", ...(u.kw || [])].join("\n"), "Temporary").always > 0).length);
    if (!pay(t, k.e, k.d, k.p, false, src.u ? "unitAbility" : src.legend ? "legendAbility" : "gearAbility")) continue;
    if (/disempower me/i.test(a.cost)) { if (src.legend) t.legend.empowered = false; else unitRef(t, src.u).empowered = 0; }
    if (/banish a unit or gear from your trash/i.test(a.cost)) { const j = t.trash.findIndex((x) => isUnit(x) || /Gear/.test(x.t || "")); t.trash.splice(j, 1); fireLegend(t, "youBanishOwn", {}, memo); }
    if (tap) { if (src.legend) t.legend.ready = false; else if (src.u) unitRef(t, src.u).ready = false; else t.gearUsed.push(src.id); } else t.gearUsed.push(`${src.id}|${a.text}`);
    if (spendBuff) { const v = unitRef(t, src.u); v.buffed = false; v.bonus = (v.bonus || 0) - 1; }   // the buff's +1 leaves with it
    if (xpCost) t.xp -= Number(xpCost[1]);
    if (/disempower this/i.test(a.cost)) { const gi = t.gearMeta.findIndex((m) => m.gid === src.gid); t.gearMeta[gi] = { ...t.gearMeta[gi], empowered: false }; }
    label(t, `${src.card.n}: ${a.text.replace(/^.*?:\s*/, "")}`);
    if (src.gid != null || (!src.u && !src.legend && /Gear/.test(src.card.t || ""))) fire(t, ours(t), "gearAbility", {}, memo);   // Prize of Progress
    // Costs paid with the board: kill this (gear leaves; a unit dies), kill or exhaust a friendly unit, discard a card.
    let cs = [t];
    if (/kill this/i.test(a.cost)) { if (src.u) dieOutside(t, unitRef(t, src.u), memo); else dropGear(t, t.gearMeta.findIndex((m) => m.gid === src.gid)); }
    if (/kill a friendly unit or gear/i.test(a.cost)) cs = [...ours(t).filter((u) => !src.u || u.uid !== src.u.uid).slice(0, 4).map((u) => { const y = clone(t); dieOutside(y, unitRef(y, u), memo); return y; }), ...t.gear.map((_, i) => i).filter((i) => t.gearMeta[i].gid !== src.gid).slice(0, 4).flatMap((i) => killGearAt(clone(t), i, memo))];   // Malzahar, Fanatic
    else if (/kill a friendly unit/i.test(a.cost)) cs = ours(t).filter((u) => !src.u || u.uid !== src.u.uid).slice(0, 4).map((u) => { const y = clone(t); dieOutside(y, unitRef(y, u), memo); return y; });
    if (/exhaust a friendly unit/i.test(a.cost)) cs = ours(t).filter((u) => u.ready).slice(0, 5).map((u) => { const y = clone(t); const v = unitRef(y, u); v.ready = false; y.lastExhausted = { uid: v.uid, at: v.at }; y.log.push(`  exhaust ${v.card.n}`); fire(y, ours(y).filter((w) => w.uid !== v.uid), "allyExhausted", {}, memo); return y; });
    if (/discard 1/i.test(a.cost)) cs = [...new Set(t.hand)].slice(0, 5).flatMap((c) => discardCard(clone(t), c, memo));
    if (/discard a gear/i.test(a.cost)) cs = [...new Set(t.hand.filter((c) => /Gear/.test(c.t || "")))].slice(0, 5).flatMap((c) => discardCard(clone(t), c, memo));   // Sky Cruiser
    if (/discard a spell/i.test(a.cost)) cs = [...new Set(t.hand.filter(isSpell))].slice(0, 5).flatMap((c) => discardCard(clone(t), c, memo));   // Mel, Defiant Soul
    if (/kill a friendly gear/i.test(a.cost)) cs = t.gear.map((_, i) => i).filter((i) => t.gearMeta[i].gid !== src.gid).slice(0, 4).flatMap((i) => killGearAt(clone(t), i, memo));   // Whirling Twirligig
    const after = (y) => ({ side: 0, src: src.u ? unitRef(y, src.u) || null : null, here: src.u ? src.u.at : src.at, fromGear: !src.u && !src.legend, gid: src.gid, legend: !!src.legend });
    out.push({ children: cs.flatMap((y) => runAbility(y, a, after(y), memo)), tag: src.card.n });
  }
  // Lady of Clockwork (legend): at the start of our Main Phase, [e1]: a friendly gear becomes a unit with Might equal to its
  // Energy cost, at the gear's location; ready unless the gear was exhausted.
  if (!s.used.length && !s.clockUsed && legendHas(s, "clockwork")) s.gear.forEach((g, i) => {
    if (!(g.e > 0)) return;
    const t = clone(s); t.clockUsed = true; if (!pay(t, 1, "rainbow", 0, false, "legendAbility")) return;
    const at = gearAt(t, i), gid = t.gearMeta[i].gid; dropGear(t, i);
    t.units.push(mkUnit({ ...g, t: "Unit", m: g.e, gearUnit: true }, 0, at, !t.gearUsed.includes(`g${gid}`)));
    label(t, `${t.legend.card.n}: ${g.n} becomes a ${g.e}-Might unit (${where(at)})`);
    out.push({ children: [t], tag: "clockwork" });
  });
  // Bottled Constellation: at the start of our Main Phase (before anything is played or moved), kill 3 other units/gear to score 1.
  if (!s.used.length && !s.bottledUsed) s.gear.forEach((g, i) => {
    if (!compile(g).statics.some((x) => x.op === "bottled")) return;
    const others = [...ours(s).map((u) => ({ u, m: mightOf(s, u) })), ...s.gear.map((x, k) => ({ gid: s.gearMeta[k].gid, m: 0 })).filter((x) => x.gid !== s.gearMeta[i].gid)].sort((a, b) => a.m - b.m);
    if (others.length < 3) return;
    let t = clone(s); t.bottledUsed = true;
    for (const o of others.slice(0, 3)) { if (o.u) { const v = unitRef(t, o.u); if (v) dieOutside(t, v, memo); } else { const k = t.gearMeta.findIndex((m) => m.gid === o.gid); if (k > -1) t = killGearAt(t, k, memo)[0]; } }
    t.score[0] += 1; label(t, `Bottled Constellation: kill three, score 1 (${t.score.join("–")})`);
    out.push({ children: [t], tag: "bottled" });
  });
  // Equip: our unattached Equipment onto a unit of ours, for its Equip cost (equipCost).
  for (const g of s.gear) {
    if (!/\[Equip\]/.test(g.x || "")) continue;
    for (const u of ours(s)) for (const opt of equipCost(s, g, u)) {
      const t = clone(s);
      if (!payEquip(t, opt, unitRef(t, u), memo)) continue;
      dropGear(t, t.gear.indexOf(g));
      t.used.push(g.n);
      label(t, `equip ${g.n} on ${u.card.n}`);
      out.push({ children: attachStates(t, unitRef(t, u), g, memo), tag: g.n });
    }
  }
  return out;
}
// Attaching Equipment g to our unit u on state t, with what attaching does (effect text is appended to the unit's rules text,
// §136.2.c). Svellsongur copies the unit's text into its effect text: the unit has its text twice. Shady Spectacles: the
// unit becomes a copy of another friendly unit (printed traits, §479.1; its gear and statuses stay): branched.
function attachStates(t, u, g, memo = null) {
  const v = unitRef(t, u) || u;
  v.gear.push(g);
  if (/copy that unit's text to this equipment's effect text/i.test(g.x || "") && !v.card._sv) v.card = { ...v.card, x: `${v.card.x || ""}\n${v.card.x || ""}`, _sv: true };
  let out = [t];
  if (/becomes a copy of that unit/i.test(g.x || "")) {
    const others = ours(t).filter((w) => w.uid !== v.uid);
    if (others.length) out = others.map((w) => { const y = clone(t), me = unitRef(y, v); me.card = { ...w.card, token: v.card.token }; y.log.push(`  ${v.card.n} becomes a copy of ${w.card.n} (Shady Spectacles)`); return y; });
  }
  // Aphelios, Exalted: "When you attach an Equipment to me, choose one that hasn't been chosen this turn": each mode left is a branch.
  const m = memo || { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 };
  return out.flatMap((y) => {
    const me = unitRef(y, v); if (!me || me.side !== 0) return [y];
    let ys = [y];
    for (const a of compile(me.card).abilities.filter((x) => x.trigger === "attachedMe" && x.modal)) ys = ys.flatMap((z) => {
      const left = (a.modes || []).map((md, i) => [md, i]).filter(([md, i]) => !(unitRef(z, v)?.chosenModes || []).includes(i) && md.effects.some((e) => e.op !== "noTurn"));
      if (!left.length) return [z];
      return left.flatMap(([md, i]) => { const w = clone(z), mv = unitRef(w, v); mv.chosenModes = [...(mv.chosenModes || []), i]; w.log.push(`  ${mv.card.n}: ${md.text}`); return runAbility(w, { ...a, modal: false, modes: null, effects: md.effects }, { side: 0, src: mv, here: mv.at }, m); });
    });
    return ys;
  });
}
// An Equipment's Equip cost options for unit u (§819): "[Equip] <Energy><runes>", "— {rune}, Kill a friendly unit",
// "— Spend N XP", "— {A} or exhaust a friendly unit"; Hextech Gauntlets' Energy is less by the chosen unit's Might.
// "— Recycle 2 cards from your trash" (Last Rites) can't be paid: the trash isn't on the board. Until 24 Nov only
// "[Equip] {Rune}" was read, so 22 Equipment (Skyfall of Areion, Boneshiver, Blighted Battleaxe, …) were never equipped.
function equipCost(t, g, u) {
  const x = g.x || "";
  if (/\[Equip\][^\n]*recycle \d+ cards? from your trash/i.test(x)) return [];
  let m;
  if ((m = /\[Equip\]\s*—\s*Spend (\d+) XP/i.exec(x))) return [{ e: 0, d: "rainbow", p: 0, xp: Number(m[1]) }];
  if ((m = /\[Equip\]\s*—\s*:rb_rune_(\w+):,\s*Kill a friendly unit/i.exec(x))) return [{ e: 0, d: m[1][0].toUpperCase() + m[1].slice(1), p: 1, kill: true }];
  if (/\[Equip\]\s*—\s*:rb_rune_rainbow: or exhaust a friendly unit/i.test(x)) return [{ e: 0, d: "rainbow", p: 1 }, { e: 0, d: "rainbow", p: 0, exhaust: true }];
  if ((m = /\[Equip\]\s*((?::rb_energy_\d+:|:rb_rune_\w+:)+)/i.exec(x))) {
    const k = costParts(normalise(m[1]));
    if (/reduced by the might of the unit you choose/i.test(x)) k.e = Math.max(0, k.e - mightOf(t, u));   // Hextech Gauntlets
    return [{ e: k.e, d: k.d, p: k.p }];
  }
  return [];
}
// Pay an Equip option on state t (for unit u); false if it can't be paid. less: Power off (Weaponmaster pays {A} less).
function payEquip(t, opt, u, memo, less = 0) {
  if (opt.xp) { if ((t.xp || 0) < opt.xp) return false; t.xp -= opt.xp; return true; }
  if (!pay(t, opt.e, opt.d, Math.max(0, opt.p - less), false, "gearAbility")) return false;   // Equip is the gear's ability
  if (opt.kill) { const v = ours(t).filter((w) => w.uid !== u.uid).sort((a, b) => mightOf(t, a) - mightOf(t, b))[0]; if (!v) return false; dieOutside(t, v, memo); }
  if (opt.exhaust) { const v = ours(t).filter((w) => w.uid !== u.uid && w.ready).sort((a, b) => mightOf(t, a) - mightOf(t, b))[0]; if (!v) return false; v.ready = false; }
  return true;
}
// [Weaponmaster] (§821): on play, one of our Equipment (unattached, or on another unit) attaches to it for its Equip cost
// {A} less, ignoring Equip's timing; it isn't a target (§821.1.c.6). Branched over the Equipment; "none" is the first state.
function weaponmaster(t, u, memo) {
  const out = [t];
  const pool = [...t.gear.map((g, i) => ({ g, i })), ...ours(t).filter((w) => w.uid !== u.uid).flatMap((w) => w.gear.map((g) => ({ g, from: w })))].filter((x) => /\[Equip\]/.test(x.g.x || ""));
  for (const it of pool) for (const opt of equipCost(t, it.g, u)) {
    const y = clone(t), me = unitRef(y, u);
    if (!payEquip(y, opt, me, memo, 1)) continue;
    if (it.from) { const w = unitRef(y, it.from); w.gear.splice(w.gear.indexOf(it.g), 1); } else dropGear(y, y.gear.indexOf(it.g));
    y.log.push(`  Weaponmaster: ${it.g.n} attaches to ${u.card.n}`);
    out.push(...attachStates(y, unitRef(y, u), it.g, memo));
  }
  return out;
}
// Their counters that stop spell c: in hand (paid from what they kept open) or face down (free).
// Their counter to our spell c: each way they can stop it (the search's `min`). If our hand holds a counter that stops
// theirs and we can pay it, that branch is ours to answer (§813.1.c): both counters are spent and the spell resolves
// (resolve(state) → its results; the best one by bestResult). One level: their counter to our counter isn't searched.
function counterChildren(t, c, resolve = null, memo = null) {
  const out = [];
  const back = (u, k) => {
    if (!resolve) return u;
    const tax = { e: 0, p: 0 };
    for (const q of [...new Set(u.hand.filter((x) => counterOf(x) && stops(counterOf(x), k)))]) {
      const y = clone(u); if (!pay(y, (q.e || 0) + tax.e, dom(q), q.p || 0, true)) continue;
      y.hand.splice(y.hand.indexOf(q), 1); y.used.push(q.n); toTrash(y, q); y.log.push(`  you counter their ${k.n} with ${q.n}: ${c.n} resolves`);
      const rs = resolve(y); if (rs.length) return bestResult(rs, y, 0, memo) || rs[0];
    }
    return u;
  };
  if (t.their.locked || t.their.noSpells) return out;
  if (compile(c).statics.some((x) => x.op === "uncounterableSelf")) return out;   // Decree of Rage
  if (hasStatic(t, 0, "uncounterable")) return out;   // Mel, Newly Awakened (Empowered)
  const tax = helmTax(t), banned = felineBanned(t);
  const k = t.their.hand.find((x) => counterOf(x) && !banned.includes(x.n) && stops(counterOf(x), c) && (x.e || 0) + tax.e <= t.their.budget.e && (x.p || 0) + tax.p <= t.their.budget.p);
  if (k) { const u = clone(t); u.their.hand.splice(u.their.hand.indexOf(k), 1); u.their.budget.e -= (k.e || 0) + tax.e; u.their.budget.p -= k.p || 0; u.log.push(`  they counter it with ${k.n}`); out.push(back(u, k)); }
  for (const b of bfsOf(t)) {
    if (saboteurAt(t, b)) continue;   // Noxus Saboteur: their hidden cards there can't be revealed
    const d = t.down[b][1].find((x) => counterOf(x) && !banned.includes(x.n) && stops(counterOf(x), c) && tax.e <= t.their.budget.e);   // face down: base cost zero, the tax still applies (§356.1.b.3)
    if (d) { const u = clone(t); u.down[b][1].splice(u.down[b][1].indexOf(d), 1); u.log.push(`  they counter it with a face-down ${d.n}`); out.push(back(u, d)); break; }
  }
  return out;
}

// Value of a stopping point: a win first, then points, their holds stopped, battlefields kept.
function valueOf(s, start) {
  const stopped = bfsOf(start).filter((b) => start.ctrl[b] === 1 && s.ctrl[b] !== 1).length;
  return (won(s) ? 1e6 : 0) + 1000 * (s.score[0] - start.score[0]) - 1000 * (s.score[1] - start.score[1]) + 100 * stopped
    + 10 * s.ctrl.filter((x) => x === 0).length + s.drew + 0.1 * ours(s).length - 0.01 * s.log.length;
}
// A unit's card is part of its key: a copy (Shady Spectacles) or doubled text (Svellsongur) changes what it is.
const keyOf = (s) => [s.units.map((u) => `${u.uid}${u.card.n}${u.card._sv ? "*" : ""}${u.side}${u.at}${u.ready ? 1 : 0}${u.gear.length}|${u.bonus || 0}|${u.dmg || 0}|${u.stunned ? 1 : 0}${u.noMove ? 1 : 0}${u.buffed ? 1 : 0}|${(u.kw || []).join("")}`).sort().join(","),
  `${s.legend ? `L${s.legend.ready ? 1 : 0}${s.legend.empowered ? 1 : 0}` : ""}/${s.xp || 0}/${s.extraEUnits || 0}/${s.discount ? `${s.discount.e}${s.discount.p}` : ""}/${s.pool.length}/${s.extraE}/${Math.min(2, s.played)}/${s.their.locked ? 1 : 0}/${s.gear.map((g, i) => `${g.n}@${gearAt(s, i)}`).join(",")}/${s.gearUsed.join("")}`, s.hand.map(idOf).sort().join(","), s.champ ? 1 : 0,
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
// their: { hand, budget: { e, p }, runes (their rune count; unknown: conditions on it aren't met) }, xpGained (XP gained earlier
// this turn), runesAtBeginning (default: runes less the two channelled this turn) }.
export function solveTurn(pos, { maxNodes = 4000, fightNodes = 3000, depth = 8 } = {}) {
  ids = new WeakMap(); nextId = 0; nextGid = 0;
  const s = {
    // ctrl with three entries: the Baron Pit is already on the board.
    score: pos.score.slice(), ctrl: (pos.ctrl || [null, null]).slice(), scored: (pos.scored || []).slice(), theirScored: [],
    units: pos.units.map((u) => ({ ...mkUnit(u.card, u.side, u.at, u.side === 0 ? u.ready !== false : true), gear: (u.gear || []).slice(), bonus: (u.bonus || 0) + (u.buffed ? 1 : 0), buffed: !!u.buffed, empowered: u.empowered || 0 })),
    down: (pos.ctrl || [null, null]).map((_, b) => [((pos.down || [])[b]?.[0] || []).slice(), ((pos.down || [])[b]?.[1] || []).slice()]),
    hand: (pos.hand || []).slice(), champ: pos.champ || null, gear: (pos.gear || []).slice(), gearMeta: (pos.gear || []).map((_, i) => ({ at: pos.gearAt?.[i] ?? -1, gid: ++nextGid, empowered: !!pos.gearEmpowered?.[i] })),
    runes: (pos.runes || []).map((r) => ({ d: r.d, ready: r.ready !== false })), gold: pos.gold || 0, spent: pos.spent || 0,
    their: { hand: (pos.their?.hand || []).slice(), budget: { e: 0, p: 0, ...(pos.their?.budget || {}) }, xp: pos.their?.xp || 0, runes: pos.their?.runes ?? null }, xp: pos.xp || 0, xpGained: !!pos.xpGained, died: 0,
    felineNames: (pos.felineNames || []).slice(),   // spells a Fallen Feline already on the board named
    // Our legend (Legend Zone, not a location): its {T} abilities exhaust it (§135.2.e.2); it readies each Awaken Phase.
    legend: pos.legend?.card ? { card: pos.legend.card, ready: pos.legend.ready !== false, empowered: !!pos.legend.empowered } : null,
    log: [], used: [], drew: 0, conquers: 0, kills: 0, pool: [], extraE: 0, played: 0, gearUsed: [], hidNow: [], discount: null,
    // Our trash (pos.trash: cards); null when the position doesn't give it, and then what counts it isn't played.
    trash: pos.trash ? pos.trash.slice() : null,
  };
  // The List already on the board: the tag it named (pos.listTag); one played this turn names one as it's played.
  s.gearMeta.forEach((m, i) => { if (compile(s.gear[i]).statics.some((x) => x.op === "listTag")) m.named = pos.listTag || "?"; });   // "?": not given, so nothing matches
  for (const u of s.units) if (u.gear.some((g) => /copy that unit's text to this equipment's effect text/i.test(g.x || "")) && !u.card._sv) u.card = { ...u.card, x: `${u.card.x || ""}\n${u.card.x || ""}`, _sv: true };   // Svellsongur
  const startScore = s.score[0];
  // [Temporary] (§816.1.b–c): our Temporary units die at the start of our Beginning Phase, before scoring, so they never hold
  // (until 24 Nov the solver let them). Not at a battlefield with our LeBlanc, Everywhere at Once. Shard of Undoing: the first
  // friendly death in the Beginning Phase makes them kill one of their units (their choice).
  if (pos.beginning) {
    const bm = { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 };
    // Its own [Temporary], not one its text gives something else (Lillia, Fae Fawn's Sprite): keywordOf's `always`.
    const doomed = ours(s).filter((u) => keywordOf(u.card.x || "", "Temporary").always > 0 && !(u.at >= 0 && ours(s, u.at).some((w) => compile(w.card).statics.some((x) => x.op === "leblancTemporary"))));
    for (const u of doomed) { const v = unitRef(s, u); if (v) dieOutside(s, v, bm, "dies ([Temporary])"); }
    s.beginDeaths = doomed.length;   // Shadow Watcher
    if (doomed.length && s.gear.some((g) => compile(g).statics.some((x) => x.op === "shard"))) {
      const opts = theirs(s).map((u) => { const y = clone(s); dieOutside(y, unitRef(y, u), bm, "is killed (Shard of Undoing)"); return y; });
      if (opts.length) Object.assign(s, theirPick(opts, null, s));
    }
  }
  // Runes we had at the start of the Beginning Phase: before this turn's Channel Phase, which channels two (pos.runesAtBeginning
  // when the rune deck ran out).
  s.runesAtBeginning = pos.runesAtBeginning ?? Math.max(0, s.runes.length - 2);
  // "If you control fewer runes than an opponent at the start of your Beginning Phase" (Oasis Raider, Forsaken Baccai).
  if (pos.beginning) for (const u of ours(s)) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "beginRunes")) { const v = unitRef(s, u); if (v) runAbility(s, a, { side: 0, src: v, here: v.at }, { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 }, true); }
  // Start of our Beginning Phase (Gutter Palace's alternate win), before holds are scored.
  if (pos.beginning) for (const src of [...ours(s).map((u) => ({ u, card: u.card })), ...s.gear.map((g) => ({ card: g }))])
    for (const a of compile(src.card).abilities.filter((x) => x.trigger === "startTurn" && (x.effects || []).every((e) => e.op === "winGame")))
      runAbility(s, a, { side: 0, src: src.u || null, card: src.card }, { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 }, true);
  if (pos.beginning) for (const b of bfsOf(s)) if (s.ctrl[b] === 0 && ours(s, b).length) {
    s.scored.push(b); s.score[0]++; s.holdPoints = (s.holdPoints || 0) + 1; s.log.push(`hold ${BF[b]} → ${s.score[0]}`); hunt(s, b, 0);
    // Our gear here: "When you hold here, return this to its owner's hand" (The Good Stuff). Optional returns stay.
    for (let i = s.gear.length - 1; i >= 0; i--) if (gearAt(s, i) === b) for (const a of compile(s.gear[i]).abilities.filter((x) => x.trigger === "holdHere"))
      if ((a.effects || []).some((e) => e.op === "bounce" && e.target?.who === "it" && !e.optional)) { const g = s.gear[i]; dropGear(s, i); s.hand.push(g); s.log.push(`  ${g.n} returns to your hand`); break; }
    const holdTimes = 1 + ours(s, b).filter((u) => compile(u.card).statics.some((x) => x.op === "holdTwiceHere")).length;   // Blue Sentinel
    for (let ht = 0; ht < holdTimes; ht++) for (const u of ours(s, b)) for (const a of compile(u.card).abilities.filter((x) => x.trigger === "hold" || x.trigger === "playOrScore" || x.trigger === "conquerOrHold")) runAbility(s, a, { side: 0, src: u, here: b }, { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 }, true);
    fireLegend(s, "youConquerOrHold", { here: b }, { states: new Map(), fights: new Map(), nodes: 0, maxNodes: 0, fightNodes: 500, fightCalls: 0 });   // Deceiver
  }
  const holds = s.scored.length;
  const start = clone(s);
  const memo = { states: new Map(), fights: new Map(), nodes: 0, maxNodes, fightNodes, fightCalls: 0, start };
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
