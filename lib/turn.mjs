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
export function turnReads(card, { inTheirHand = false } = {}) {
  if (!card) return false;
  const x = card.x || "";
  if (isUnit(card)) {
    if (inTheirHand) return !strip(x);   // their units in hand are never played (Ambush into a fight isn't modelled)
    return x.split("\n").every((l) => READ_LINES.some((re) => re.test(l)) || !strip(l));
  }
  if (READY_ALL.test(x) || MOVE_READY.test(x)) return true;
  if (/Gear/.test(card.t) && EQUIP.test(x)) return true;
  const e = fx(card);
  return e.length > 0 && e.every((k) => ["pump", "minus", "swap", "stun", "damage", "kill", "fight", "counter"].includes(k.kind) || (k.kind === "bounce" && !k.needsFour));
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
  runes: s.runes.map((r) => ({ ...r })), their: { ...s.their, hand: s.their.hand.slice() }, log: s.log.slice(), used: s.used.slice() });
const BF = ["A", "B"];
const where = (at) => (at < 0 ? "base" : BF[at]);
const mercOn = (s, u) => u.side === 0 && MERC.test(u.card.x || "") && s.spent >= 2;
const effCard = (s, u) => {
  const c = withGear(u.card, u.gear);
  const merc = mercOn(s, u) ? Number(MERC.exec(u.card.x)[1]) : 0;
  return merc || u.bonus ? { ...c, m: (c.m || 0) + merc + (u.bonus || 0) } : c;
};
const ganks = (s, u) => keywordOf(withGear(u.card, u.gear).x, "Ganking").always > 0 || mercOn(s, u);
const ours = (s, at) => s.units.filter((u) => u.side === 0 && (at === undefined || u.at === at));
const theirs = (s, at) => s.units.filter((u) => u.side === 1 && (at === undefined || u.at === at));

// Paying, as lib/match.mjs pays: Energy from ready runes (not the Power colour first), Power from
// ready Gold, then recycling runes of that colour (exhausted ones first, so no Energy is lost).
function pay(s, e, d, q) {
  const ready = s.runes.filter((r) => r.ready).sort((a, b) => (a.d === d) - (b.d === d));
  if (ready.length < e) return false;
  for (let i = 0; i < e; i++) ready[i].ready = false;
  const gold = Math.min(s.gold, q); let need = q - gold;
  const pool = s.runes.filter((r) => d === "rainbow" || r.d === d).sort((a, b) => a.ready - b.ready);
  if (pool.length < need) return false;
  for (const r of pool) { if (!need) break; s.runes.splice(s.runes.indexOf(r), 1); need--; }
  s.gold -= gold; s.spent += q;
  return true;
}
const budgetOf = (s) => ({ e: s.runes.filter((r) => r.ready).length, p: s.gold + s.runes.length });

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
  const mine = us.map((u) => { const c = effCard(s, u); map.set(c, u); return c; });
  const foes = them.map((u) => { map.set(u.card, u); return u.card; });
  const ourHand = s.hand.filter((c) => quick(c) && trick(c));
  const theirHand = s.their.hand.filter((c) => quick(c) && trick(c));
  const ourSide = { units: mine, hand: ourHand, budget: budgetOf(s) };
  const theirSide = { units: foes, hand: theirHand, budget: { ...s.their.budget } };
  let r;
  const key = `F|${b}|${attacker}|${mine.map((c) => `${idOf(map.get(c))}:${c.m}`).join(",")}|${foes.map(idOf).join(",")}|${ourHand.map(idOf).join(",")}|${theirHand.map(idOf).join(",")}|${ourSide.budget.e}/${ourSide.budget.p}|${theirSide.budget.e}/${theirSide.budget.p}|${s.down[b].map((x) => x.map(idOf).join("+")).join("/")}`;
  if (memo.fights.has(key)) r = memo.fights.get(key);
  else {
    r = attacker === 0
      ? fight(ourSide, { ...theirSide, faceDown: s.down[b][1].slice(), base: theirs(s, -1).map((u) => u.card) }, { maxPlies: 8, maxNodes: memo.fightNodes })
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
  const verb = them.length ? `fight at ${BF[b]} (${attacker === 0 ? "you attack" : "they attack"}): ${mine.map((c) => `${c.n} ${c.m}`).join(" + ")} vs ${foes.map((c) => `${c.n} ${c.m || 0}`).join(" + ")}${s.down[b][attacker === 0 ? 1 : 0].length ? " + face down" : ""}`
    : `walk into ${BF[b]}${theirHand.length ? " (they may answer)" : ""}`;
  // fight() writes its line from the defender's side ("you" defend); when we attack, swap the words.
  const line = attacker === 0 ? r.line.map((l) => l.replace(/^(you|they)\b/, (w) => (w === "you" ? "they" : "you")).replace(/^you: flip/, "they: flip")) : r.line;
  s.log.push(`  ${verb}${line.length ? ` · ${line.join(" · ")}` : ""}`);
  const outcome = r.outcome;   // the defender's view: hold, trade, conquer
  const atk = attacker, def = 1 - attacker;
  const sideUnits = (side) => s.units.filter((u) => u.side === side && u.at === b);
  if (outcome === "conquer" || (!them.length && sideUnits(0).length)) {
    if (s.ctrl[b] !== atk) { s.ctrl[b] = atk; s.down[b][def] = []; score(s, b, atk); }
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

// After units of ours arrive at b (a move or a spell move): Faefolk's pull, then the combat.
function arrive(s, b, movers, memo) {
  const out = [];
  const pullers = movers.filter((u) => MOVE_PULL.test(u.card.x || ""));
  const base = () => { const t = clone(s); finishArrival(t, b, memo); return t; };
  out.push(base());
  if (pullers.length) {
    for (const v of theirs(s).filter((u) => u.at !== b)) {
      const t = clone(s); const tv = t.units.find((u) => u.uid === v.uid); const from = tv.at; tv.at = b;
      t.log.push(`  ${pullers[0].card.n} pulls their ${v.card.n} from ${where(from)} into ${BF[b]}`);
      if (from >= 0 && t.ctrl[from] === 1 && !theirs(t, from).length) { t.ctrl[from] = null; t.down[from][1] = []; t.log.push(`  ${BF[from]} has no units of theirs left: they lose it (§323.5)`); }
      finishArrival(t, b, memo); out.push(t);
    }
  }
  return out;
}
function finishArrival(s, b, memo) {
  const attacker = s.ctrl[b] === 0 ? 1 : 0;   // we contested it unless it was already ours
  resolveAt(s, b, attacker, memo);
}

// ── our actions from a state: each returns { min?: true, children: [state] } ──
function actions(s, memo) {
  const out = [];
  const label = (t, x) => { t.log.push(x); return t; };
  // Move: ready units, to a battlefield (a subset of the eligible units).
  for (const b of [0, 1]) {
    const elig = ours(s).filter((u) => u.ready && u.at !== b && (u.at === -1 || ganks(s, u)));
    if (!elig.length) continue;
    const foes = theirs(s, b).length, mine = s.ctrl[b] === 0;
    let subsets;
    if (!foes && mine) subsets = elig.filter((u) => MOVE_PULL.test(u.card.x || "")).map((u) => [u]);
    else if (!foes) subsets = elig.map((u) => [u]);
    else {
      const pick = elig.slice().sort((x, y) => (effCard(s, y).m || 0) - (effCard(s, x).m || 0)).slice(0, 5);
      subsets = [];
      for (let m = 1; m < 1 << pick.length; m++) subsets.push(pick.filter((_, i) => m & (1 << i)));
      if (elig.length > 5) subsets.push(elig);
    }
    for (const sub of subsets) {
      const t = clone(s);
      const ms = sub.map((u) => t.units.find((x) => x.uid === u.uid));
      for (const u of ms) { u.ready = false; }
      label(t, `move ${ms.map((u) => `${u.card.n} (${where(u.at)})`).join(" + ")} → ${BF[b]}`);
      t.used.push(...ms.map((u) => u.card.n));
      const froms = [...new Set(ms.map((u) => u.at))];
      for (const u of ms) u.at = b;
      for (const f of froms) vacate(t, f);
      out.push({ children: arrive(t, b, ms, memo), tag: "move" });
    }
  }
  // Play a unit from hand or the Champion Zone, to base; with Accelerate, ready.
  const units = [...s.hand.filter(isUnit), ...(s.champ ? [s.champ] : [])];
  const seen = new Set();
  for (const c of units) {
    if (seen.has(c.n)) continue; seen.add(c.n);
    for (const accel of ACCEL.test(c.x || "") ? [true, false] : [false]) {
      const t = clone(s);
      if (!pay(t, c.e || 0, dom(c), c.p || 0)) continue;
      if (accel && !pay(t, 1, dom(c), 1)) continue;
      if (c === s.champ) t.champ = null; else t.hand.splice(t.hand.indexOf(c), 1);
      const u = mkUnit(c, 0, -1, accel); t.units.push(u); t.used.push(c.n);
      label(t, `play ${c.n}${accel ? " with Accelerate (enters ready)" : ""}${c === s.champ ? " from the Champion Zone" : ""}`);
      out.push({ children: [t], tag: "unit" });
    }
  }
  // Hide a card at a battlefield we control (1 Power): only while it would switch Mercenary on.
  if (s.spent < 2 && [...ours(s), ...units.map((c) => ({ card: c }))].some((u) => MERC.test(u.card.x || ""))) {
    const c = s.hand.find((x) => /\[Hidden\]/i.test(x.x || ""));
    const b = [0, 1].find((k) => s.ctrl[k] === 0 && s.down[k][0].length === 0);
    if (c && b != null) { const t = clone(s); if (pay(t, 0, "rainbow", 1)) { t.hand.splice(t.hand.indexOf(c), 1); t.down[b][0].push(c); label(t, `hide ${c.n} at ${BF[b]} (1 Power)`); out.push({ children: [t], tag: "hide" }); } }
  }
  // Spells.
  const spells = s.hand.filter(isSpell); const seenS = new Set();
  for (const c of spells) {
    if (seenS.has(c.n)) continue; seenS.add(c.n);
    const x = c.x || "";
    const cast = (fn, what) => {
      const t = clone(s);
      if (!pay(t, c.e || 0, dom(c), c.p || 0)) return;
      t.hand.splice(t.hand.indexOf(c), 1); t.used.push(c.n);
      label(t, `cast ${c.n}${what ? `: ${what}` : ""}`);
      const countered = counterChildren(t, c);
      const done = clone(t); fn(done);
      out.push({ children: [done], min: countered.length ? countered : null, tag: c.n });
    };
    if (READY_ALL.test(x)) cast((t) => { for (const u of ours(t)) u.ready = true; }, "ready your units");
    else if (MOVE_READY.test(x)) {
      for (const u of ours(s)) for (const b of [0, 1]) {
        if (u.at === b) continue;
        const t = clone(s);
        if (!pay(t, c.e || 0, dom(c), c.p || 0)) continue;
        t.hand.splice(t.hand.indexOf(c), 1); t.used.push(c.n);
        label(t, `cast ${c.n}: ${u.card.n} (${where(u.at)}) → ${BF[b]}, ready`);
        const countered = counterChildren(t, c);
        const tu = t.units.find((y) => y.uid === u.uid); const from = tu.at; tu.at = b; tu.ready = true; vacate(t, from);
        out.push({ children: arrive(t, b, [tu], memo), min: countered.length ? countered : null, tag: c.n });
      }
    } else if (removalOf(c)) {
      const e = removalOf(c);
      for (const v of theirs(s).filter((u) => u.at >= 0)) {
        const vm = v.card.m || 0;
        if ((e.kind === "bounce" || e.kind === "kill") && e.max != null && vm > e.max) continue;
        if (e.kind === "damage" && e.n < vm) continue;
        let champ = null;
        if (e.kind === "fight") { champ = ours(s).sort((a, b2) => (effCard(s, b2).m || 0) - (effCard(s, a).m || 0))[0]; if (!champ || (effCard(s, champ).m || 0) < vm) continue; }   // Rampage's optional +2 (an extra Body) isn't played
        cast((t) => {
          const tv = t.units.find((y) => y.uid === v.uid); const at = tv.at;
          t.units = t.units.filter((y) => y !== tv); if (e.kind === "bounce") t.their.hand.push(v.card);
          if (champ) { const tc = t.units.find((y) => y.uid === champ.uid); if (vm >= (effCard(t, tc).m || 0)) t.units = t.units.filter((y) => y !== tc); }
          t.kills += e.kind === "bounce" ? 0 : 1;
          t.log.push(`  ${v.card.n} (${where(at)}) ${e.kind === "bounce" ? "returned to hand" : "dies"}`);
          if (t.ctrl[at] === 1 && !theirs(t, at).length) { t.ctrl[at] = null; t.down[at][1] = []; t.log.push(`  ${BF[at]} has no units of theirs left: they lose it (§323.5)`); }
        }, `${v.card.n}`);
      }
    }
  }
  // Equip: gear on the board or in hand onto a unit of ours (Boots: +2 Might and Ganking).
  for (const g of [...s.gear.map((c) => ({ c, inHand: false })), ...s.hand.filter((c) => /Gear/.test(c.t) && EQUIP.test(c.x || "")).map((c) => ({ c, inHand: true }))]) {
    const m = EQUIP.exec(g.c.x || ""); if (!m) continue;
    const d = m[1][0].toUpperCase() + m[1].slice(1);
    for (const u of ours(s).filter((u2) => u2.ready)) {
      const t = clone(s);
      if (g.inHand && !pay(t, g.c.e || 0, dom(g.c), g.c.p || 0)) continue;
      if (!pay(t, 0, d, 1)) continue;
      if (g.inHand) t.hand.splice(t.hand.indexOf(g.c), 1); else t.gear.splice(t.gear.indexOf(g.c), 1);
      t.units.find((y) => y.uid === u.uid).gear.push(g.c); t.used.push(g.c.n);
      label(t, `${g.inHand ? "play and " : ""}equip ${g.c.n} on ${u.card.n}`);
      out.push({ children: [t], tag: g.c.n });
    }
  }
  return out;
}
// Their counters that stop spell c: in hand (paid from what they kept open) or face down (free).
function counterChildren(t, c) {
  const out = [];
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
const keyOf = (s) => [s.units.map((u) => `${u.uid}${u.side}${u.at}${u.ready ? 1 : 0}${u.gear.length}`).sort().join(","), s.hand.map(idOf).sort().join(","), s.champ ? 1 : 0,
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
    log: [], used: [], drew: 0, conquers: 0, kills: 0,
  };
  const startScore = s.score[0];
  if (pos.beginning) for (const b of [0, 1]) if (s.ctrl[b] === 0 && ours(s, b).length) { s.scored.push(b); s.score[0]++; s.log.push(`hold ${BF[b]} → ${s.score[0]}`); }
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
