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
//   - Each side assigns lethal damage one unit at a time, Tank units first and Backline last
//     (§815, §826), the cheapest kills first within that (§467.2.c.3);
//     then deaths, then attackers are recalled if any defender stands (§468.1.a).
//   - Result (§468.3): the defender holds if it still has units there; the attacker conquers
//     if only it does; both gone is a trade (the battlefield is left uncontrolled).
//   - Attack and defend triggers (Graves's blast) go on the chain first; while it exists only
//     Reactions can be played, and face-down cards have Reaction (§811.1.b). Then the showdown:
//     Actions and Reactions, alternating, the attacker first (§466.2.c.1.a), until both pass.
//   - Responses (§813.1.c.1: Reactions are played in Closed States; "a spell" is one finalized on the
//     chain, §355.9.a.2): when a spell is played, the other side may answer it with a counter
//     (Defy, Lilting Lullaby) or take it over (Rebuttal, Mystic Reversal) before it resolves.
//   - Costs (§356): taxes and discounts from the board (Helm of Suppression, Vex, Cheerless, Irelia,
//     Graceful) apply to spells, face-down ones too: "ignoring its cost" zeroes the base, and increases
//     still apply (§356.1.b.3). Syndra, Transcendent's Repeat is paid as the spell is played (§820).
//   - Simplified: no responses other than counters and takeovers (a pump resolves before the next play;
//     a counter can be countered back once, not a third time), and the attacker always makes the first move
//     in the chain window.

import { effectsOf, bodyOf } from "./versus.mjs";
import { engineOf } from "./sim.mjs";

let uid = 0;
const unit = (card, side) => {
  const b = bodyOf(card), e = engineOf(card);
  return { id: ++uid, n: card.n, card, side, base: card.m || 0, mod: 0, dmg: card._dmg || 0, assault: b.attack - b.might, shield: b.defend - b.might,
    // "I must be assigned combat damage last" is Backline's own wording (§826.3, §467.2.c.6): Soraka, Wanderer; Caitlyn, Patrolling.
    tank: b.tank, backline: b.backline || /i must be assigned combat damage last/i.test(card.x || ""),
    // _stunned / _dmg: a stun or damage from earlier in the turn (lib/turn.mjs passes them in).
    stunned: !!card._stunned, prevent: card._prevent || 0, blast: effectsOf(card).some((x) => x.kind === "blast"),
    // Disarm X (§831): an attack trigger, "give an enemy unit here -X Might this turn"; X defaults to 1.
    disarm: Number((/\[Disarm (\d+)\]/i.exec(card.x || "") || [])[1] || (/\[Disarm\]/i.test(card.x || "") ? 1 : 0)), noCombat: /i don'?t deal combat damage/i.test(card.x || ""),
    floor: 0, eng: e,
    // Board modifiers on spells (docs/rules-rulings.md, "Fight solver premises"):
    vexC: /while i'm in combat, friendly spells cost/i.test(card.x || ""), irelia: /your spells that choose me cost/i.test(card.x || ""),
    wildclaw: /units here with less might than me can't be chosen by enemy spells/i.test(card.x || ""),
    spellImmune: !!card._runes7 && /prevent all damage that enemy spells and abilities would deal to me/i.test(card.x || ""),
    gangplank: !!card._empowered && /if a spell or ability that chooses me would stun me/i.test(card.x || ""),
    syndra: /your spells have \[repeat\]/i.test(card.x || ""),
    // Combat internals (feature 2): Kayn, Unleashed after two moves; Dune Surfer; Ava Achiever.
    noDamage: (card._moves || 0) >= 2 && /if i have moved twice this turn, i don't take damage/i.test(card.x || ""),
    ignoreTank: /you ignore \[tank\] while assigning combat damage here/i.test(card.x || ""),
    ava: /when i attack, you may pay :rb_rune_mind: to play a card with \[hidden\]/i.test(card.x || "") };
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
    // Ambush from hand: played as a Reaction to a battlefield where you have units (§822.1.b); a
    // unit that "can be played to a battlefield you're attacking" (Rengar, Pouncing) joins an attack.
    else if (/\[ambush\]|can be played to a battlefield you're attacking/.test(x)) out.push({ kind: "ambush", card, speed: "reaction", cost });
    // A [Reaction] or [Action] unit is played into a showdown at a battlefield its side controls (lib/turn.mjs passes it
    // only for the defender there), like an ambusher.
    else if (/\[reaction\]|\[action\]/.test(x)) out.push({ kind: "ambush", card, speed: /\[reaction\]/.test(x) ? "reaction" : "action", cost });
    return out;
  }
  // Takeovers: Rebuttal (Energy cost ≤ 4; pay {A} to take it, otherwise counter it), Mystic Reversal (any spell).
  if (/gain control of (?:it|a spell)/.test(x)) { const m = /energy cost no more than :rb_energy_(\d+):/.exec(x); return [{ kind: "steal", maxE: m ? Number(m[1]) : null, extraP: /you may pay :rb_rune_rainbow:/.test(x) ? 1 : 0, orCounter: /otherwise, counter it/.test(x), card, speed: "reaction", cost }]; }
  if (/prevent all spell and ability damage/.test(x)) return [{ kind: "fog", card, speed, cost }];   // Unyielding Spirit
  if (/in combat with an enemy fury/.test(x)) return [{ kind: "pump", n: 4, needsEnemy: "Fury", card, speed, cost }];   // Decree of Focus
  for (const f of fx) {
    if (f.kind === "counter") out.push({ kind: "counter", maxE: f.maxE ?? null, maxP: f.maxP ?? null, lock: /can't play spells this turn/.test(x), card, speed: "reaction", cost });
    else if (f.kind === "pump" && !f.equip) out.push({ kind: "pump", n: f.n, card, speed, cost });
    else if (f.kind === "pump" && f.equip && faceDown) out.push({ kind: "pump", n: f.n, card, speed, cost, lasting: true });
    else if (f.kind === "minus") out.push({ kind: "minus", n: f.n, floor: /minimum of 1/.test(x) ? 1 : 0, all: !!f.all, card, speed, cost });
    else if (f.kind === "swap") out.push({ kind: "swap", card, speed, cost });
    else if (f.kind === "bounce" && f.needsFriendly) out.push({ kind: "starcrossed", card, speed, cost });
    else if (f.kind === "bounce" && !f.needsFour) out.push({ kind: "bounce", max: f.max, card, speed, cost });
    else if (f.kind === "stun") out.push({ kind: "stun", attackingOnly: /attacking/.test(x), card, speed, cost });
    // "If it's attacking, deal 4 to it instead" (Sudden Storm); "If you control a facedown card, deal 4 to it instead" (Monster
    // Harpoon: side.faceDownOwned, from lib/turn.mjs).
    else if (f.kind === "damage" && !f.split) { const atk = /if it's attacking, deal (\d+) to it instead/.exec(x), fdc = /if you control a facedown card, deal (\d+) to it instead/.exec(x);
      out.push({ kind: "damage", n: f.n, ...(atk ? { nAttacking: Number(atk[1]) } : {}), ...(fdc ? { nFaceDown: Number(fdc[1]) } : {}), card, speed, cost }); }
    else if (f.kind === "kill") out.push({ kind: "kill", max: f.max, card, speed, cost });
  }
  // Defiant Dance-style swings come out as a pump and a minus: one card, one play.
  const pump = out.find((m) => m.kind === "pump"), minus = out.find((m) => m.kind === "minus");
  if (pump && minus) return [{ kind: "swing", n: pump.n, m: minus.n, card, speed, cost }];
  return out.length ? [out[0]] : [];
}

// side: { units: [card], hand: [card], allReaction (Kai'Sa, Rebel: its spells have [Reaction]), faceDown: [card] (defender only), base: [card] (units
// elsewhere, for Tideturner), budget: { e, p }, keep (defender only): a hold that keeps a
// face-down card unflipped is worth more (Evelynn, In Control scores with one there, §383.2.a.1) }.
// maxNodes: a search budget (lib/match.mjs plays thousands of fights; some boards explode).
// Past it, each line still open resolves as if both sides passed from there.
export function fight(attacker, defender, { maxPlies = 12, maxNodes = Infinity } = {}) {
  uid = 0;
  const st = {
    units: [...attacker.units.map((c) => unit(c, "A")), ...defender.units.map((c) => unit(c, "D"))],
    A: { moves: (attacker.hand || []).filter((c) => !(attacker.banned || []).includes(c.n)).flatMap((c) => movesOf(c)).map((m, i) => ({ ...m, ...(attacker.allReaction && m.speed === "main" ? { speed: "reaction" } : {}), key: `A${i}` })), budget: copyBudget({ e: 0, p: 0, ...attacker.budget }), kills: !!attacker.anyDamageKills, tax: attacker.tax || null, faceDownOwned: !!attacker.faceDownOwned },
    D: { moves: [...(defender.hand || []).filter((c) => !(defender.banned || []).includes(c.n)).flatMap((c) => movesOf(c)).map((m) => (defender.allReaction && m.speed === "main" ? { ...m, speed: "reaction" } : m)), ...(defender.faceDown || []).filter((c) => !(defender.banned || []).includes(c.n)).flatMap((c) => movesOf(c, { faceDown: true }).map((m) => ({ ...m, fd: true })))].map((m, i) => ({ ...m, key: `D${i}` })),
      budget: copyBudget({ e: 0, p: 0, ...defender.budget }), base: (defender.base || []).slice(), keep: !!defender.keep && (defender.faceDown || []).length > 0, kills: !!defender.anyDamageKills, tax: defender.tax || null, faceDownOwned: !!defender.faceDownOwned || (defender.faceDown || []).length > 0 },
    used: new Set(), chain: [], log: [], fog: !!(attacker.fog || defender.fog), avaUsed: false,
  };
  // Ava Achiever (attacking): one card with [Hidden] from hand for {Mind}, ignoring its cost; a unit joins the attack.
  for (const c of attacker.avaHand || []) {
    const ms = /Unit/.test(c.t || "") ? [{ kind: "ambush", card: c, speed: "reaction" }] : movesOf(c);
    for (const m of ms) st.A.moves.push({ ...m, cost: { e: 0, p: 1 }, ava: true, key: `A${st.A.moves.length}` });
  }
  // Attack triggers first, then defend triggers (§466.2.d.1): Graves's blast, Disarm (attackers only).
  for (const u of st.units) {
    if (u.blast) st.chain.push({ src: u.id, side: u.side });
    if (u.disarm && u.side === "A") st.chain.push({ src: u.id, side: "A", disarm: u.disarm });
  }
  const memo = new Map(); memo.nodes = 0; memo.max = maxNodes;
  const res = solve(st, "A", 0, false, maxPlies, memo);
  return { outcome: res.outcome, line: res.line, value: res.value, end: res.end };
}

const clone = (st) => ({ ...st, units: st.units.map((u) => ({ ...u })), A: { ...st.A, budget: copyBudget(st.A.budget) },
  D: { ...st.D, budget: copyBudget(st.D.budget), base: st.D.base.slice() }, used: new Set(st.used), chain: st.chain.slice(), log: st.log.slice() });
const alive = (st, side) => st.units.filter((u) => u.side === side);
// Damage to a unit, less any prevention it still has ("Prevent the next 7 damage", Ki Barrier).
// kills: the damage comes from a side whose damage is always lethal to enemy units (Elder Dragon's static).
const hurt = (v, n, kills = false) => { if (v.noDamage) return; const b = Math.min(v.prevent || 0, n); v.prevent = (v.prevent || 0) - b; v.dmg += n - b; if (kills && n - b > 0) v.doomed = true; };
const killCheck = (st) => { st.units = st.units.filter((u) => !(u.dmg > 0 && (u.dmg >= might(u) || u.doomed))); };

// A spell (not a unit, an ambush or a face-down unit) and what it costs here (§356): the side's tax (Helm of Suppression),
// Vex, Cheerless (+[e1]{A} for the side facing her, −[e1]{A} to a minimum of [e1] for hers), Irelia, Graceful ([e1] or
// {A} less when the spell chooses her).
const isSpellMove = (mv) => /Spell/.test(mv.card?.t || "") && mv.kind !== "flip" && mv.kind !== "ambush";
// Power by domain (24 Nov): a budget may carry dom (runes by domain: a rune recycles for Power ready or not) and any (Gold,
// added {A}). A card's own Power must come from its domains (any of a multi-domain card's, §135.2.e.6; a no-domain card's
// from any); cost increases (taxes, Vex) are {A}. Without dom (an opponent typed in as E/P) only the totals count.
const domsOf = (mv) => (mv.ava ? ["Mind"] : (mv.card?.d || []).length ? mv.card.d : null);   // Ava Achiever's cost is {Mind}
const copyBudget = (b) => ({ ...b, ...(b.dom ? { dom: { ...b.dom } } : {}) });
function canPay(b, c, mv) {
  if (c.e > b.e || c.p > b.p) return false;
  if (!b.dom) return true;
  const ds = domsOf(mv), own = Math.min(c.p, mv.cost?.p ?? c.p);
  const fromDoms = ds ? ds.reduce((a, d) => a + (b.dom[d] || 0), 0) : Infinity;
  return own <= fromDoms + (b.any || 0);
}
function spend(b, c, mv) {
  b.e -= c.e; b.p -= c.p;
  if (!b.dom) return;
  const ds = domsOf(mv) || Object.keys(b.dom);
  let own = Math.min(c.p, mv.cost?.p ?? c.p), rest = c.p - own;
  for (const d of ds) { const k = Math.min(own, b.dom[d] || 0); b.dom[d] = (b.dom[d] || 0) - k; own -= k; }
  const k = Math.min(own + rest, b.any || 0); b.any = (b.any || 0) - k; rest = Math.max(0, rest - Math.max(0, k - own)); own = Math.max(0, own - k);
  for (const d of Object.keys(b.dom)) { const k2 = Math.min(rest, b.dom[d]); b.dom[d] -= k2; rest -= k2; }
}
function costOf(st, mv, side, tg = []) {
  let e = mv.cost.e, p = mv.cost.p;
  if (!isSpellMove(mv)) return { e, p };
  const other = side === "A" ? "D" : "A";
  e += st[side].tax?.e || 0; p += st[side].tax?.p || 0;
  if (alive(st, other).some((u) => u.vexC)) { e += 1; p += 1; }
  if (alive(st, side).some((u) => u.vexC)) { e = Math.max(Math.min(e, 1), e - 1); p = Math.max(0, p - 1); }
  if (tg.some((u) => u && u.side === side && u.irelia)) { if (e > 0) e -= 1; else p = Math.max(0, p - 1); }
  return { e, p };
}
// Alpha Wildclaw: "Your units here with less Might than me can't be chosen by enemy spells and abilities."
const shielded = (st, v, side) => v.side !== side && alive(st, v.side).some((w) => w.wildclaw && w.id !== v.id && might(v) < might(w));

function resolveChain(st) {
  const t = st.chain.pop();
  const src = st.units.find((u) => u.id === t.src);
  if (t.disarm) {
    // The attacker picks the target: the biggest defender (simplified).
    const v = alive(st, "D").sort((a, b) => might(b) - might(a))[0];
    if (v) { v.mod -= t.disarm; st.log.push(`Disarm: ${v.n} −${t.disarm}`); }
    return;
  }
  // Unyielding Spirit prevents ability damage; Esteemed Hierophant (7+ runes) takes none from enemy abilities.
  if (src && !st.fog) for (const v of alive(st, t.side === "A" ? "D" : "A")) if (!v.spellImmune) hurt(v, might(src), st[t.side].kills);   // read on resolution (§359.3.f.2)
  killCheck(st);
  st.log.push(src ? `${src.n}'s blast resolves for ${might(src)}` : "the blast's source is gone");
}

// Combat damage, cleanup and the result, from the defender's side: 2 hold, 1 trade, 0 conquer.
function damage(st) {
  const A = alive(st, "A"), D = alive(st, "D");
  const total = (xs) => xs.reduce((s, u) => s + (u.stunned || u.noCombat ? 0 : fighting(u)), 0);
  // §467.2.c: full lethal on one unit before the next (§467.2.c.3), never more than lethal while
  // others are unassigned (§467.2.c.4), Tank units first and Backline units last (§815, §826). The
  // assigner picks the order within that, so cheapest kill first, which kills the most. What is
  // left after the last kill it can afford still lands, short of lethal, on the next unit in line.
  // A unit with both Tank and Backline lets the assigner choose (§467.2.c.8); it is read as Tank.
  // Dune Surfer: its side assigns without the Tank requirement.
  const rank = (u, noTank) => (u.tank && !noTank ? 0 : u.backline ? 2 : 1);
  // Returns the excess: what's left once every unit has lethal assigned (§467.2.c.4), for Sivir, Ambitious.
  const assign = (amount, targets, kills, noTank) => {
    const order = targets.slice().sort((a, b) => rank(a, noTank) - rank(b, noTank) || (might(a) - a.dmg) - (might(b) - b.dmg));
    for (const v of order) {
      if (amount <= 0) break;
      // Lethal counts what's prevented (replacement effects apply at assignment, §467.2.c.5).
      // With "any amount of your damage is enough to kill", lethal is 1 past what's prevented.
      const need = kills ? 1 + (v.prevent || 0) : Math.max(1, might(v) - v.dmg + (v.prevent || 0));
      const n = Math.min(need, amount); hurt(v, n, kills); amount -= n;
    }
    return Math.max(0, amount);
  };
  const ta = total(A), td = total(D);
  const excessA = assign(ta, D, st.A.kills, A.some((u) => u.ignoreTank)), excessD = assign(td, A, st.D.kills, D.some((u) => u.ignoreTank));
  killCheck(st);
  const a = alive(st, "A").length, d = alive(st, "D").length;
  const outcome = d > 0 ? "hold" : a > 0 ? "conquer" : "trade";
  // end: what is left and what was spent, for a caller playing whole games (lib/match.mjs).
  const spent = (S) => S.moves.filter((m) => st.used.has(m.key)).map((m) => m.card);
  const end = { alive: st.units.map((u) => ({ side: u.side, card: u.card })), spentA: spent(st.A), spentD: spent(st.D),
    budgetA: copyBudget(st.A.budget), budgetD: copyBudget(st.D.budget), excessA, excessD };
  // A hold that kept the face-down card unflipped beats one that flipped it, never a hold over a trade.
  const kept = st.D.keep && outcome === "hold" && !st.D.moves.some((m) => m.fd && st.used.has(m.key)) ? 0.5 : 0;
  return { outcome, end, value: (outcome === "hold" ? 2 : outcome === "trade" ? 1 : 0) + kept + 0.01 * (d - a) };
}

function legalTargets(st, mv, side) {
  const mine = alive(st, side), theirs = alive(st, side === "A" ? "D" : "A").filter((v) => !shielded(st, v, side));
  switch (mv.kind) {
    case "pump": return mv.needsEnemy && !alive(st, side === "A" ? "D" : "A").some((v) => (v.card.d || []).includes(mv.needsEnemy)) ? [] : mine.map((u) => [u]);
    case "fog": return [[]];
    case "counter": case "steal": return [];   // only as an answer to a spell (solve's response window)
    case "swing": return mine.flatMap((u) => theirs.map((v) => [u, v]));
    case "minus": return mv.all ? [theirs] : theirs.map((v) => [v]);
    case "swap": return mine.flatMap((u) => theirs.map((v) => [u, v]));
    case "bounce": return theirs.filter((v) => mv.max == null || might(v) <= mv.max).map((v) => [v]);
    case "starcrossed": return theirs.map((v) => [v]);
    case "stun": return theirs.filter((v) => !mv.attackingOnly || v.side === "A").map((v) => [v]);
    case "damage": return theirs.map((v) => [v]);
    case "kill": return theirs.filter((v) => mv.max == null || might(v) <= mv.max).map((v) => [v]);
    case "flip": return side === "D" ? [[]] : [];
    case "ambush": return [[]];
    default: return [];
  }
}

function apply(st, mv, side, tg, cost = mv.cost) {
  const S = st[side];
  spend(S.budget, cost, mv); st.used.add(mv.key);
  if (mv.ava) st.avaUsed = true;
  effect(st, mv, side, tg);
}
// Gangplank, Naval (Empowered): a stun, -Might or return aimed at him gives him +3 instead.
const plank = (st, v, side, name) => { if (v && v.gangplank && v.side !== side) { v.mod += 3; st.log.push(`${name} turns into +3 on ${v.n}`); return true; } return false; };
function effect(st, mv, side, tg) {
  const name = mv.card.n;
  if (["stun", "minus", "bounce", "starcrossed"].includes(mv.kind) && tg.length === 1 && plank(st, tg[0], side, name)) return;
  if (mv.kind === "swing" && plank(st, tg[1], side, name)) { tg[0].mod += mv.n; return; }
  switch (mv.kind) {
    case "fog": st.fog = true; st.log.push(`${side === "D" ? "you" : "they"}: ${name}: spell and ability damage is prevented`); break;
    case "pump": tg[0].mod += mv.n; st.log.push(`${side === "D" ? "you" : "they"}: ${name} +${mv.n} on ${tg[0].n}`); break;
    case "swing": tg[0].mod += mv.n; tg[1].mod -= mv.m; st.log.push(`${side === "D" ? "you" : "they"}: ${name} (+${mv.n} ${tg[0].n}, −${mv.m} ${tg[1].n})`); break;
    case "minus": for (const v of tg) v.mod = Math.max(mv.floor ? 1 - v.base - (v.side === "A" ? v.assault : v.shield) : -Infinity, v.mod - mv.n); st.log.push(`${side === "D" ? "you" : "they"}: ${name} −${mv.n} on ${tg.map((v) => v.n).join(", ")}`); break;
    case "swap": { const [u, v] = tg, mu = might(u), mvv = might(v); u.mod += mvv - mu; v.mod += mu - mvv; st.log.push(`${side === "D" ? "you" : "they"}: ${name} swaps ${u.n} and ${v.n}`); break; }
    case "bounce": case "starcrossed": st.units = st.units.filter((u) => u.id !== tg[0].id); st.log.push(`${side === "D" ? "you" : "they"}: ${name} returns ${tg[0].n}`); break;
    case "stun": tg[0].stunned = true; st.log.push(`${side === "D" ? "you" : "they"}: ${name} stuns ${tg[0].n}`); break;
    case "damage": { if (st.fog || tg[0].spellImmune) { st.log.push(`${side === "D" ? "you" : "they"}: ${name}'s damage to ${tg[0].n} is prevented`); break; }
      const n = mv.nAttacking && tg[0].side === "A" ? mv.nAttacking : mv.nFaceDown && st[side].faceDownOwned ? mv.nFaceDown : mv.n;
      hurt(tg[0], n, st[side].kills); killCheck(st); st.log.push(`${side === "D" ? "you" : "they"}: ${name} deals ${n} to ${tg[0].n}`); break; }
    case "kill": st.units = st.units.filter((u) => u.id !== tg[0].id); st.log.push(`${side === "D" ? "you" : "they"}: ${name} kills ${tg[0].n}`); break;
    case "ambush": {
      // It arrives during the combat and gets its designation at the next cleanup; its attack or
      // defend trigger still fires (§466.2.c.3.a, §383.4.e).
      const u = unit(mv.card, side); st.units.push(u); if (u.blast) st.chain.push({ src: u.id, side });
      st.log.push(`${side === "D" ? "you" : "they"}: ${name} ambushes in (${u.base} Might)`);
      break;
    }
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

// The other side's answers to a spell: each counter or takeover it holds (unused, affordable, the spell within its
// limits). A counter spends both cards and the spell does nothing (Lilting Lullaby also locks the caster's spells); a
// takeover plays the spell's effect for the taker on its own targets (Rebuttal: {A} more, else it counters).
// A counter can itself be countered (a Reaction answers anything on the chain, §813.1.c): the side that played the spell
// may answer their counter with one of its own; then both are spent and the spell resolves. One level: a counter to that
// counter isn't searched. settle / better: solve()'s, to keep the better of "countered" and "countered back".
function responses(st, mv, side, tg, cc, settle = null, better = null) {
  const other = side === "A" ? "D" : "A", O = st[other], out = [];
  for (const r of O.moves) {
    if (st.used.has(r.key) || (r.kind !== "counter" && r.kind !== "steal") || O.noSpells) continue;
    const pe = mv.card.e || 0, pp = mv.card.p || 0;
    if ((r.maxE != null && pe > r.maxE) || (r.maxP != null && pp > r.maxP)) continue;
    const rc = costOf(st, r, other, []);
    const base = () => { const s3 = clone(st); spend(s3[side].budget, cc, mv); s3.used.add(mv.key); spend(s3[other].budget, rc, r); s3.used.add(r.key); return s3; };
    if ((r.kind === "counter" || r.orCounter) && canPay(O.budget, rc, r)) {
      const s3 = base(); if (r.lock) s3[side].noSpells = true;
      s3.log.push(`${other === "D" ? "you" : "they"}: ${r.card.n} counters ${mv.card.n}${r.lock ? "; no more spells for them this turn" : ""}`);
      let pick = s3;
      const S = st[side];
      if (settle && better && !S.noSpells) for (const r2 of S.moves) {
        if (r2.key === mv.key || st.used.has(r2.key) || r2.kind !== "counter") continue;
        if ((r2.maxE != null && (r.card.e || 0) > r2.maxE) || (r2.maxP != null && (r.card.p || 0) > r2.maxP)) continue;
        const c2 = costOf(st, r2, side, []);
        const b2 = copyBudget(S.budget); spend(b2, cc, mv); if (!canPay(b2, c2, r2)) continue;
        const s4 = clone(st), t4 = tg.map((u) => s4.units.find((x) => x.id === u.id));
        apply(s4, mv, side, t4, cc);
        spend(s4[side].budget, c2, r2); s4.used.add(r2.key);
        spend(s4[other].budget, rc, r); s4.used.add(r.key);
        s4.log.push(`${other === "D" ? "you" : "they"}: ${r.card.n} counters ${mv.card.n}; ${side === "D" ? "you" : "they"}: ${r2.card.n} counters it back`);
        if (better(side, settle(s4), settle(pick))) pick = s4;
      }
      out.push(pick);
    }
    if (r.kind === "steal" && canPay(O.budget, { e: rc.e, p: rc.p + (r.extraP || 0) }, r)) {
      for (const tg2 of legalTargets(st, mv, other)) {
        const s3 = base(); if (r.extraP) spend(s3[other].budget, { e: 0, p: r.extraP }, { card: {}, cost: { p: 0 } });   // Rebuttal's {A}
        s3.log.push(`${other === "D" ? "you" : "they"}: ${r.card.n} takes over ${mv.card.n}`);
        effect(s3, mv, other, tg2.map((u) => s3.units.find((x) => x.id === u.id)));
        out.push(s3);
      }
    }
  }
  return out;
}

// Minimax over plays: side to act, consecutive passes, plies left. Defender maximises.
function solve(st, side, passes, _unused, plies, memo) {
  const inChain = st.chain.length > 0;
  if (passes >= 2) {
    if (inChain) { const s2 = clone(st); resolveChain(s2); return solve(s2, "A", 0, false, plies, memo); }
    const s2 = clone(st); const r = damage(s2); return { ...r, line: s2.log };
  }
  if (plies <= 0 || ++memo.nodes > memo.max) { const s2 = clone(st); while (s2.chain.length) resolveChain(s2); const r = damage(s2); return { ...r, line: s2.log }; }
  const key = `${side}|${passes}|${inChain}|${[...st.used].sort().join(",")}|${st.units.map((u) => `${u.id}:${u.mod}:${u.dmg}:${u.stunned ? 1 : 0}`).join(";")}|${st.chain.length}|${st.fog ? 1 : 0}${st.A.noSpells ? 1 : 0}${st.D.noSpells ? 1 : 0}`;
  if (memo.has(key)) return memo.get(key);
  const S = st[side], other = side === "A" ? "D" : "A";
  let best = solve(st, other, passes + 1, false, plies, memo);   // pass
  const better = (who, a, b) => (who === "D" ? a.value > b.value : a.value < b.value);
  const settle = (s2) => (!alive(s2, "A").length || !alive(s2, "D").length ? { ...damage(s2), line: s2.log } : solve(s2, other, 0, false, plies - 1, memo));
  for (const mv of S.moves) {
    if (st.used.has(mv.key)) continue;
    if (inChain && mv.speed !== "reaction") continue;
    if (!inChain && mv.speed === "main") continue;
    if (S.noSpells && isSpellMove(mv)) continue;   // Lilting Lullaby
    if (mv.ava && (st.avaUsed || !alive(st, "A").some((u) => u.ava))) continue;   // Ava Achiever: once, while she's there
    for (const tg of legalTargets(st, mv, side)) {
      const c = costOf(st, mv, side, tg);
      // Syndra, Transcendent alive: the spell may be repeated for [e2]{Chaos} more (§820: an optional additional cost).
      for (const rep of isSpellMove(mv) && alive(st, side).some((u) => u.syndra) ? [false, true] : [false]) {
        const cc = rep ? { e: c.e + 2, p: c.p + 1 } : c;
        if (!canPay(S.budget, cc, mv)) continue;
        // Targets are found on this state but the play happens on a copy: look them up there.
        const s2 = clone(st); const t2 = tg.map((u) => s2.units.find((x) => x.id === u.id));
        apply(s2, mv, side, t2, cc);
        if (rep && t2.every(Boolean)) { effect(s2, mv, side, t2); s2.log.push(`  (repeated: Syndra)`); }
        // The answer: the other side lets it resolve, or counters it, or takes it over; it picks its best.
        let cand = settle(s2);
        if (isSpellMove(mv)) for (const s3 of responses(st, mv, side, tg, cc, settle, better)) { const r3 = settle(s3); if (better(other, r3, cand)) cand = r3; }
        // Strictly better wins; on a tie the line where someone plays is kept, so the report
        // shows the fight that happens ("you flip Switcheroo, they swap it back"), not a pass.
        if (better(side, cand, best) || (cand.value === best.value && !best.line.length && cand.line.length)) best = cand;
      }
    }
  }
  memo.set(key, best);
  return best;
}
