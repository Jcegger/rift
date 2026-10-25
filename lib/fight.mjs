// The fight calculator: one combat at one battlefield, played out by the rules, both sides
// choosing their best line. `scripts/rift fight`.
//
// For the board states a matchup turns on ("their Astral Heron attacks my Staunch Survivor
// and Traveling Merchant; I have Switcheroo face down; they hold Discipline"), not for whole
// games: it never prints a win rate. Card effects come from lib/versus.mjs's reader and the
// simulator's (lib/sim.mjs engineOf), so a card reads the same here as everywhere else.
//
// The rules it plays (docs/rules.md, Combat; verbatim where cited):
//   - Combat damage is two totals: each side's Might, Assault while attacking and Shield while
//     defending added (§807, §814); stunned units contribute nothing (§424.1.b); a unit that
//     "doesn't deal combat damage" (Graves) adds nothing.
//   - Each side assigns lethal damage one unit at a time, the cheapest kills first (§467.2.c.3);
//     then deaths, then attackers are recalled if any defender stands (§468.1.a).
//   - Result (§468.3): the defender holds if it still has units there; the attacker conquers
//     if only it does; both gone is a trade (the battlefield is left uncontrolled).
//   - Attack and defend triggers (Graves's blast) go on the chain first; while it exists only
//     Reactions can be played, and face-down cards have Reaction (§811.1.b). Then the showdown:
//     Actions and Reactions, alternating, the attacker first (§466.2.c.1.a), until both pass.
//   - Simplified: each play resolves before the next (no responding on the chain to a pump),
//     and the attacker always makes the first move in the chain window.

import { effectsOf, bodyOf } from "./versus.mjs";
import { engineOf } from "./sim.mjs";

let uid = 0;
const unit = (card, side) => {
  const b = bodyOf(card), e = engineOf(card);
  return { id: ++uid, n: card.n, card, side, base: card.m || 0, mod: 0, dmg: 0, assault: b.attack - b.might, shield: b.defend - b.might,
    stunned: false, blast: effectsOf(card).some((x) => x.kind === "blast"),
    // Disarm X (§831): an attack trigger, "give an enemy unit here -X Might this turn"; X defaults to 1.
    disarm: Number((/\[Disarm (\d+)\]/i.exec(card.x || "") || [])[1] || (/\[Disarm\]/i.test(card.x || "") ? 1 : 0)), noCombat: /i don'?t deal combat damage/i.test(card.x || ""),
    floor: 0, eng: e };
};
// Everyone here is in combat, so Assault (attacking) and Shield (defending) are part of a
// unit's Might for everything: damage dealt, lethal damage, swaps (§807, §814).
const might = (u) => Math.max(0, u.base + u.mod + (u.side === "A" ? u.assault : u.shield));
const fighting = might;

// What a card can do here, as moves. kind: pump | minus | swap | bounce | stun | damage | kill |
// starcrossed | flip (a hidden unit joining as a defender).
function movesOf(card, { faceDown = false } = {}) {
  const fx = effectsOf(card), e = engineOf(card), x = (card.x || "").toLowerCase();
  const speed = faceDown ? "reaction" : /\[reaction\]/.test(x) ? "reaction" : /\[action\]/.test(x) ? "action" : "main";
  const cost = faceDown ? { e: 0, p: 0 } : { e: card.e || 0, p: card.p || 0 };
  const out = [];
  if (/Unit/.test(card.t || "")) {
    if (faceDown) out.push({ kind: "flip", card, speed, cost, pump: e.flipRecycle ? 3 : 0, swapIn: e.swapMove, bounce4: /4 or more units/.test(x) });
    return out;
  }
  for (const f of fx) {
    if (f.kind === "pump" && !f.equip) out.push({ kind: "pump", n: f.n, card, speed, cost });
    else if (f.kind === "pump" && f.equip && faceDown) out.push({ kind: "pump", n: f.n, card, speed, cost, lasting: true });
    else if (f.kind === "minus") out.push({ kind: "minus", n: f.n, floor: /minimum of 1/.test(x) ? 1 : 0, all: !!f.all, card, speed, cost });
    else if (f.kind === "swap") out.push({ kind: "swap", card, speed, cost });
    else if (f.kind === "bounce" && f.needsFriendly) out.push({ kind: "starcrossed", card, speed, cost });
    else if (f.kind === "bounce" && !f.needsFour) out.push({ kind: "bounce", max: f.max, card, speed, cost });
    else if (f.kind === "stun") out.push({ kind: "stun", attackingOnly: /attacking/.test(x), card, speed, cost });
    else if (f.kind === "damage" && !f.split) out.push({ kind: "damage", n: f.n, card, speed, cost });
    else if (f.kind === "kill") out.push({ kind: "kill", max: f.max, card, speed, cost });
  }
  // Defiant Dance-style swings come out as a pump and a minus: one card, one play.
  const pump = out.find((m) => m.kind === "pump"), minus = out.find((m) => m.kind === "minus");
  if (pump && minus) return [{ kind: "swing", n: pump.n, m: minus.n, card, speed, cost }];
  return out.length ? [out[0]] : [];
}

// side: { units: [card], hand: [card], faceDown: [card] (defender only), base: [card] (units
// elsewhere, for Tideturner), budget: { e, p }, keep (defender only): a hold that keeps a
// face-down card unflipped is worth more (Evelynn, In Control scores with one there, §383.2.a.1) }.
// maxNodes: a search budget (lib/match.mjs plays thousands of fights; some boards explode).
// Past it, each line still open resolves as if both sides passed from there.
export function fight(attacker, defender, { maxPlies = 12, maxNodes = Infinity } = {}) {
  uid = 0;
  const st = {
    units: [...attacker.units.map((c) => unit(c, "A")), ...defender.units.map((c) => unit(c, "D"))],
    A: { moves: (attacker.hand || []).flatMap((c) => movesOf(c)).map((m, i) => ({ ...m, key: `A${i}` })), budget: { e: 0, p: 0, ...attacker.budget } },
    D: { moves: [...(defender.hand || []).flatMap((c) => movesOf(c)), ...(defender.faceDown || []).flatMap((c) => movesOf(c, { faceDown: true }).map((m) => ({ ...m, fd: true })))].map((m, i) => ({ ...m, key: `D${i}` })),
      budget: { e: 0, p: 0, ...defender.budget }, base: (defender.base || []).slice(), keep: !!defender.keep && (defender.faceDown || []).length > 0 },
    used: new Set(), chain: [], log: [],
  };
  // Attack triggers first, then defend triggers (§466.2.d.1): Graves's blast, Disarm (attackers only).
  for (const u of st.units) {
    if (u.blast) st.chain.push({ src: u.id, side: u.side });
    if (u.disarm && u.side === "A") st.chain.push({ src: u.id, side: "A", disarm: u.disarm });
  }
  const memo = new Map(); memo.nodes = 0; memo.max = maxNodes;
  const res = solve(st, "A", 0, false, maxPlies, memo);
  return { outcome: res.outcome, line: res.line, value: res.value, end: res.end };
}

const clone = (st) => ({ ...st, units: st.units.map((u) => ({ ...u })), A: { ...st.A, budget: { ...st.A.budget } },
  D: { ...st.D, budget: { ...st.D.budget }, base: st.D.base.slice() }, used: new Set(st.used), chain: st.chain.slice(), log: st.log.slice() });
const alive = (st, side) => st.units.filter((u) => u.side === side);
const killCheck = (st) => { st.units = st.units.filter((u) => !(u.dmg > 0 && u.dmg >= might(u))); };

function resolveChain(st) {
  const t = st.chain.pop();
  const src = st.units.find((u) => u.id === t.src);
  if (t.disarm) {
    // The attacker picks the target: the biggest defender (simplified).
    const v = alive(st, "D").sort((a, b) => might(b) - might(a))[0];
    if (v) { v.mod -= t.disarm; st.log.push(`Disarm: ${v.n} −${t.disarm}`); }
    return;
  }
  if (src) for (const v of alive(st, t.side === "A" ? "D" : "A")) v.dmg += might(src);   // read on resolution (§359.3.f.2)
  killCheck(st);
  st.log.push(src ? `${src.n}'s blast resolves for ${might(src)}` : "the blast's source is gone");
}

// Combat damage, cleanup and the result, from the defender's side: 2 hold, 1 trade, 0 conquer.
function damage(st) {
  const A = alive(st, "A"), D = alive(st, "D");
  const total = (xs) => xs.reduce((s, u) => s + (u.stunned || u.noCombat ? 0 : fighting(u)), 0);
  const assign = (amount, targets) => { for (const v of targets.slice().sort((a, b) => (might(a) - a.dmg) - (might(b) - b.dmg))) { const need = Math.max(1, might(v) - v.dmg); if (amount >= need) { v.dmg += need; amount -= need; } else break; } };
  const ta = total(A), td = total(D);
  assign(ta, D); assign(td, A);
  killCheck(st);
  const a = alive(st, "A").length, d = alive(st, "D").length;
  const outcome = d > 0 ? "hold" : a > 0 ? "conquer" : "trade";
  // end: what is left and what was spent, for a caller playing whole games (lib/match.mjs).
  const spent = (S) => S.moves.filter((m) => st.used.has(m.key)).map((m) => m.card);
  const end = { alive: st.units.map((u) => ({ side: u.side, card: u.card })), spentA: spent(st.A), spentD: spent(st.D),
    budgetA: { ...st.A.budget }, budgetD: { ...st.D.budget } };
  // A hold that kept the face-down card unflipped beats one that flipped it, never a hold over a trade.
  const kept = st.D.keep && outcome === "hold" && !st.D.moves.some((m) => m.fd && st.used.has(m.key)) ? 0.5 : 0;
  return { outcome, end, value: (outcome === "hold" ? 2 : outcome === "trade" ? 1 : 0) + kept + 0.01 * (d - a) };
}

function legalTargets(st, mv, side) {
  const mine = alive(st, side), theirs = alive(st, side === "A" ? "D" : "A");
  switch (mv.kind) {
    case "pump": return mine.map((u) => [u]);
    case "swing": return mine.flatMap((u) => theirs.map((v) => [u, v]));
    case "minus": return mv.all ? [theirs] : theirs.map((v) => [v]);
    case "swap": return mine.flatMap((u) => theirs.map((v) => [u, v]));
    case "bounce": return theirs.filter((v) => mv.max == null || might(v) <= mv.max).map((v) => [v]);
    case "starcrossed": return theirs.map((v) => [v]);
    case "stun": return theirs.filter((v) => !mv.attackingOnly || v.side === "A").map((v) => [v]);
    case "damage": return theirs.map((v) => [v]);
    case "kill": return theirs.filter((v) => mv.max == null || might(v) <= mv.max).map((v) => [v]);
    case "flip": return side === "D" ? [[]] : [];
    default: return [];
  }
}

function apply(st, mv, side, tg) {
  const S = st[side];
  S.budget.e -= mv.cost.e; S.budget.p -= mv.cost.p; st.used.add(mv.key);
  const name = mv.card.n;
  switch (mv.kind) {
    case "pump": tg[0].mod += mv.n; st.log.push(`${side === "D" ? "you" : "they"}: ${name} +${mv.n} on ${tg[0].n}`); break;
    case "swing": tg[0].mod += mv.n; tg[1].mod -= mv.m; st.log.push(`${side === "D" ? "you" : "they"}: ${name} (+${mv.n} ${tg[0].n}, −${mv.m} ${tg[1].n})`); break;
    case "minus": for (const v of tg) v.mod = Math.max(mv.floor ? 1 - v.base - (v.side === "A" ? v.assault : v.shield) : -Infinity, v.mod - mv.n); st.log.push(`${side === "D" ? "you" : "they"}: ${name} −${mv.n} on ${tg.map((v) => v.n).join(", ")}`); break;
    case "swap": { const [u, v] = tg, mu = might(u), mvv = might(v); u.mod += mvv - mu; v.mod += mu - mvv; st.log.push(`${side === "D" ? "you" : "they"}: ${name} swaps ${u.n} and ${v.n}`); break; }
    case "bounce": case "starcrossed": st.units = st.units.filter((u) => u.id !== tg[0].id); st.log.push(`${side === "D" ? "you" : "they"}: ${name} returns ${tg[0].n}`); break;
    case "stun": tg[0].stunned = true; st.log.push(`${side === "D" ? "you" : "they"}: ${name} stuns ${tg[0].n}`); break;
    case "damage": tg[0].dmg += mv.n; killCheck(st); st.log.push(`${side === "D" ? "you" : "they"}: ${name} deals ${mv.n} to ${tg[0].n}`); break;
    case "kill": st.units = st.units.filter((u) => u.id !== tg[0].id); st.log.push(`${side === "D" ? "you" : "they"}: ${name} kills ${tg[0].n}`); break;
    case "flip": {
      if (mv.pump) { const best = alive(st, "D").sort((a, b) => b.base - a.base)[0]; if (best) { best.mod += mv.pump; st.log.push(`you: flip ${name}, +${mv.pump} on ${best.n}`); } }
      else if (mv.swapIn && st.D.base.length) {
        // Tideturner: it takes the place of a unit of yours elsewhere, which arrives here and
        // defends; a late arrival still gets its defend trigger (§466.2.c.3.a, §383.4.e).
        const pick = st.D.base.sort((a, b) => (effectsOf(b).some((x) => x.kind === "blast") - effectsOf(a).some((x) => x.kind === "blast")) || (b.m || 0) - (a.m || 0))[0];
        st.D.base.splice(st.D.base.indexOf(pick), 1);
        const u = unit(pick, "D"); st.units.push(u); if (u.blast) st.chain.push({ src: u.id, side: "D" });
        st.log.push(`you: flip ${name}, swapping in ${pick.n}`);
      } else {
        const u = unit(mv.card, "D"); st.units.push(u);
        if (mv.bounce4 && st.units.length >= 4) { const v = alive(st, "A").sort((a, b) => might(b) - might(a))[0]; if (v) { st.units = st.units.filter((x) => x.id !== v.id); st.log.push(`you: flip ${name}, 4+ units: returns ${v.n}`); break; } }
        st.log.push(`you: flip ${name} (${u.base} Might) to defend`);
      }
      break;
    }
  }
}

// Minimax over plays: side to act, consecutive passes, plies left. Defender maximises.
function solve(st, side, passes, _unused, plies, memo) {
  const inChain = st.chain.length > 0;
  if (passes >= 2) {
    if (inChain) { const s2 = clone(st); resolveChain(s2); return solve(s2, "A", 0, false, plies, memo); }
    const s2 = clone(st); const r = damage(s2); return { ...r, line: s2.log };
  }
  if (plies <= 0 || ++memo.nodes > memo.max) { const s2 = clone(st); while (s2.chain.length) resolveChain(s2); const r = damage(s2); return { ...r, line: s2.log }; }
  const key = `${side}|${passes}|${inChain}|${[...st.used].sort().join(",")}|${st.units.map((u) => `${u.id}:${u.mod}:${u.dmg}:${u.stunned ? 1 : 0}`).join(";")}|${st.chain.length}`;
  if (memo.has(key)) return memo.get(key);
  const S = st[side], other = side === "A" ? "D" : "A";
  let best = solve(st, other, passes + 1, false, plies, memo);   // pass
  for (const mv of S.moves) {
    if (st.used.has(mv.key)) continue;
    if (inChain && mv.speed !== "reaction") continue;
    if (!inChain && mv.speed === "main") continue;
    if (mv.cost.e > S.budget.e || mv.cost.p > S.budget.p) continue;
    for (const tg of legalTargets(st, mv, side)) {
      // Targets are found on this state but the play happens on a copy: look them up there.
      const s2 = clone(st); apply(s2, mv, side, tg.map((u) => s2.units.find((x) => x.id === u.id)));
      if (!alive(s2, "A").length || !alive(s2, "D").length) {
        const r = damage(s2); const cand = { ...r, line: s2.log };
        if ((side === "D" && cand.value > best.value) || (side === "A" && cand.value < best.value)) best = cand;
        continue;
      }
      const cand = solve(s2, other, 0, false, plies - 1, memo);
      // Strictly better wins; on a tie the line where someone plays is kept, so the report
      // shows the fight that happens ("you flip Switcheroo, they swap it back"), not a pass.
      if ((side === "D" && cand.value > best.value) || (side === "A" && cand.value < best.value) || (cand.value === best.value && !best.line.length && cand.line.length)) best = cand;
    }
  }
  memo.set(key, best);
  return best;
}
