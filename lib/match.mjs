// Whole games, two decks, scored by the rules: `scripts/rift try` (points) and `lib/decklab.mjs`.
//
// The goldfish (lib/sim.mjs) plays one deck alone and can't see points. This plays our deck
// against a real list from the field, both sides with the same plain policy, and scores what
// the rules score (docs/rules.md, "The shape of a game"):
//   - two battlefields (1v1, §487.4); Hold: each battlefield you control at your Beginning
//     Phase, 1 point (§315.2.b.2); Conquer: gaining control of one you haven't scored this
//     turn, 1 point; once per battlefield per turn either way (§471, §472);
//   - the eighth point by Conquer only if you have Scored every battlefield this turn, else
//     draw 1 instead (§473.1.b); Hold and card points are never gated (§473.1.a.1);
//   - a win at a cleanup with 8 or more and strictly more than the other (§194.2);
//   - combat by lib/fight.mjs: both sides' best line with their tricks and face-down cards;
//     defenders left standing recall the attackers (§468.1.a), a mutual wipe leaves the
//     battlefield uncontrolled (§468.5.b), and a hidden card at a battlefield its controller
//     loses is trashed (§323.6.a);
//   - a battlefield with none of its controller's units left stops being theirs (§323.5):
//     removal that kills the last defender stops a hold.
//   - Evelynn, In Control's point (§383.2.a.1: she holds with a facedown card there), Sivir,
//     Mercenary's +2 Might and Ganking after two Power spent this turn, Battle Mistress's Gold.
//
// The policy, both sides: develop greedily (most expensive first), remove a unit that holds a
// battlefield alone or has 3+ Might, hide at battlefields you control, take empty
// battlefields, attack where the fight calculator says you conquer (or trade away their
// hold), then send the rest out to defend. What it doesn't play: other legends' abilities,
// most card text beyond the reader's effects, holding up mana on purpose, and hidden
// information (each side's fights see the other's hand). Its numbers are model games: read
// them as points and how they're made, never as a win rate.

import { effectsOf, bodyOf } from "./versus.mjs";
import { buildDeck, engineOf, rng, tokensOf } from "./sim.mjs";
import { fight } from "./fight.mjs";

const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const MERC = /spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have \+(\d+) :rb_might:/i;
const PLAY_DRAW = /when you play me, draw (\d+)/i;

// A list (code → copies) as a player: catalog cards, one object per copy.
export function playerOf(list, cat) {
  const d = buildDeck(list, cat);
  const main = [];
  let champ = null;
  for (const [code, q] of Object.entries(list)) {
    const c = cat.BY.get(code);
    if (!c || /Legend|Battlefield|Rune/.test(c.t)) continue;
    for (let i = 0; i < q; i++) {
      const copy = { ...c };
      if (!champ && d.champ && c.n === d.champ.n) { champ = copy; continue; }
      main.push(copy);
    }
  }
  const lx = (d.legend?.x || "").replace(/\([^)]*\)/g, "");
  // Legends played: Gold (Battle Mistress), a token ability (Azir's kind), and an added Power
  // for spells only (Kai'Sa's): "[E]: Add [A]. Use only to play spells."
  return { main, champ, runes: d.runes.slice(), legendGold: d.legendGold, readyOnDeath: d.readyOnDeath, ability: d.ability,
    spellPower: /add :rb_rune_rainbow:\. use only to play spells/i.test(lx) };
}

const fx = (c) => (c.fx ??= effectsOf(c));
const isUnit = (c) => /Unit/.test(c.t);
const hidden = (c) => /\[Hidden\]/i.test(c.x || "");
const quick = (c) => /\[Reaction\]|\[Action\]/i.test(c.x || "");
// Removal the policy casts in its main phase: kill, banish, bounce, single-target damage.
const removalOf = (c) => !isUnit(c) && fx(c).find((e) => ["kill", "banish", "fight", "move"].includes(e.kind) || (e.kind === "bounce" && !e.needsFour && !e.needsFriendly)
  || (e.kind === "damage" && !e.split && !e.many));
const counterOf = (c) => fx(c).find((e) => e.kind === "counter");
// Whether a counter stops this spell (Defy: printed cost at most [4] and one Power, §206; Not
// So Fast: a spell that chooses their unit; a tax counter when the caster has nothing left).
const stops = (k, c, casterSpare) => k.maxE != null ? (c.e || 0) <= k.maxE && (c.p || 0) <= k.maxP : k.tax != null ? casterSpare < k.tax : true;
const tokens = (c) => (c.tok ??= tokensOf(c.x));
// A card fight.mjs can use (a trick or an answer), so worth keeping and hiding first.
const trick = (c) => !isUnit(c) && fx(c).some((e) => ["pump", "minus", "swap", "stun", "bounce", "kill", "damage"].includes(e.kind));

function newPlayer(side, deck, r) {
  return { side, lib: shuffle(deck.main.map((c) => ({ ...c })), r), hand: [], runeDeck: shuffle(deck.runes.slice(), r), board: [],
    champ: deck.champ ? { ...deck.champ } : null, units: [], trash: [], score: 0, gold: 0, goldNext: 0,
    legendGold: deck.legendGold, readyOnDeath: deck.readyOnDeath, legendReady: false, power: 0,
    ability: deck.ability, spellPower: deck.spellPower, add: 0,
    st: { holds: 0, conquers: 0, stops: 0, eve: 0, gated: 0, mercTurns: 0, turnsFrom4: 0 } };
}

// ── paying: Energy from ready runes; Power from Gold, then recycling a rune of that colour ──
function payPlan(P, e, dom, q, spell = false) {
  const ready = P.board.filter((x) => x.ready), spent = new Set();
  // Exhaust for Energy the runes Power won't need first.
  const order = ready.slice().sort((a, b) => (a.d === dom) - (b.d === dom));
  if (order.length < e) return null;
  for (let i = 0; i < e; i++) spent.add(order[i]);
  const add = spell ? Math.min(P.add, q) : 0;
  let gold = Math.min(P.gold, q - add), need = q - add - gold;
  const recycle = [];
  const pool = P.board.filter((x) => (dom === "rainbow" || x.d === dom)).sort((a, b) => (spent.has(b) || !b.ready) - (spent.has(a) || !a.ready));
  for (const x of pool) { if (!need) break; if (x.ready && !spent.has(x)) { /* a ready rune recycled is Energy lost, fine */ } recycle.push(x); need--; }
  if (need) return null;
  return { spent, gold, recycle, add };
}
function pay(P, plan) {
  for (const x of plan.spent) x.ready = false;
  P.gold -= plan.gold; P.add -= plan.add || 0;
  for (const x of plan.recycle) {
    P.board.splice(P.board.indexOf(x), 1); P.runeDeck.push(x.d);
    if (P.legendGold && P.legendReady) { P.legendReady = false; P.goldNext++; }
  }
  P.power += plan.gold + plan.recycle.length + (plan.add || 0);
}
const costOf = (c) => ({ e: c.e || 0, dom: (c.d || [])[0] || "rainbow", q: c.p || 0 });
const canPay = (P, c) => { const k = costOf(c); return payPlan(P, k.e, k.dom, k.q, /Spell/.test(c.t)); };

function draw(P, n = 1) { for (let i = 0; i < n && P.lib.length; i++) P.hand.push(P.lib.shift()); }

// ── the game ─────────────────────────────────────────────────────────────────────────────
export function playMatch(deckA, deckB, r, { maxTurns = 12, firstB = false } = {}) {
  const Ps = [newPlayer(0, deckA, r), newPlayer(1, deckB, r)];
  const bfs = [0, 1].map(() => ({ ctrl: null, down: [[], []] }));
  for (const P of Ps) draw(P, 4);
  let uid = 0, winner = null, endTurn = null;
  const at8 = [null, null];
  const mk = (c, at) => ({ id: ++uid, c, at, ready: false });
  const token = (m) => ({ n: `${m} Might token`, t: "Unit", e: 0, p: 0, m, x: "", token: true });
  const unitsAt = (P, b) => P.units.filter((u) => u.at === b);
  const mercOn = (P, u) => MERC.test(u.c.x || "") && P.power >= 2;
  const cardFor = (P, u) => (mercOn(P, u) ? { ...u.c, m: (u.c.m || 0) + Number(MERC.exec(u.c.x)[1]) } : u.c);
  const ganks = (P, u) => /\[Ganking\]/i.test((u.c.x || "").replace(MERC, "")) || mercOn(P, u);
  const win = () => { for (const P of Ps) { const O = Ps[1 - P.side]; if (P.score >= 8 && P.score > O.score) return P.side; } return null; };

  // Control changes (§323.5, §323.6.a): no units of the controller there → uncontrolled, and a
  // hidden card at a battlefield its controller doesn't control goes to the trash.
  const cleanup = () => {
    bfs.forEach((bf, b) => {
      if (bf.ctrl != null && !unitsAt(Ps[bf.ctrl], b).length) bf.ctrl = null;
      for (const s of [0, 1]) if (bf.ctrl !== s && bf.down[s].length) { Ps[s].trash.push(...bf.down[s]); bf.down[s] = []; }
    });
  };
  const die = (P, u) => {
    P.units.splice(P.units.indexOf(u), 1); if (!u.c.token) P.trash.push(u.c);
    const O = Ps[1 - P.side]; if (O.readyOnDeath && O.legendGold) O.legendReady = true;
  };
  const score = (P, b, scored, how) => {
    if (scored.has(b)) return;
    scored.add(b);
    if (how === "conquer" && P.score >= 7 && !scored.has(1 - b)) { P.st.gated++; draw(P); return; }
    P.score++; P.st[how === "conquer" ? "conquers" : "holds"]++;
  };

  // A fight at battlefield b: attacker side s with these units, against what's there.
  const doFight = (A, D, b, attackers, commit) => {
    const map = new Map(), cardsA = attackers.map((u) => { const c = cardFor(A, u); map.set(c, u); return c; });
    const defs = unitsAt(D, b), cardsD = defs.map((u) => { const c = cardFor(D, u); map.set(c, u); return c; });
    const budget = (P) => ({ e: P.board.filter((x) => x.ready).length, p: P.gold + P.board.length });
    const res = fight({ units: cardsA, hand: A.hand.filter((c) => quick(c) && trick(c)), budget: budget(A) },
      { units: cardsD, hand: D.hand.filter((c) => quick(c) && trick(c)), faceDown: bfs[b].down[D.side].slice(), budget: budget(D) }, { maxPlies: 6, maxNodes: 4000 });
    if (!commit) return res;
    const end = res.end;
    const alive = new Set(end.alive.map((x) => x.card));
    // Spent cards: from hand or face down, to the trash (a hidden Elnuk goes to the bottom).
    for (const [P, list, bA] of [[A, end.spentA, end.budgetA], [D, end.spentD, end.budgetD]]) {
      const b0 = budget(P), eUsed = b0.e - bA.e, pUsed = b0.p - bA.p;
      for (const c of list) {
        const hi = P.hand.indexOf(c), di = bfs[b].down[P.side].indexOf(c);
        if (hi > -1) P.hand.splice(hi, 1); else if (di > -1) bfs[b].down[P.side].splice(di, 1);
        if (isUnit(c)) { if (engineOf(c).flipRecycle) P.lib.push(c); else if (alive.has(c)) P.units.push(mk(c, b)); else P.trash.push(c); }
        else P.trash.push(c);
      }
      if (eUsed > 0 || pUsed > 0) { const plan = payPlan(P, Math.max(0, eUsed), "rainbow", Math.max(0, pUsed)); if (plan) pay(P, plan); }
    }
    for (const [c, u] of map) if (!alive.has(c)) die(u === undefined ? null : (A.units.includes(u) ? A : D), u);
    for (const u of attackers) if (A.units.includes(u)) { u.ready = false; if (res.outcome !== "conquer") u.at = -1; else u.at = b; }
    return res;
  };

  for (let turn = 1; turn <= maxTurns * 2 && winner == null; turn++) {
    const s = (turn + (firstB ? 1 : 0)) % 2 === 1 ? 0 : 1, P = Ps[s], O = Ps[1 - s], myTurn = Math.ceil(turn / 2);
    const scored = new Set();
    // Awaken.
    for (const u of P.units) u.ready = true;
    for (const x of P.board) x.ready = true;
    P.gold += P.goldNext; P.goldNext = 0; P.legendReady = !!P.legendGold; P.power = 0; P.add = P.spellPower ? 1 : 0;
    // Beginning: Evelynn's point, then Hold.
    bfs.forEach((bf, b) => {
      if (bf.ctrl !== s) return;
      const eves = unitsAt(P, b).filter((u) => engineOf(u.c).holdPoint).length;
      if (eves && bf.down[s].length) { P.score += eves; P.st.eve += eves; }
      score(P, b, scored, "hold");
    });
    if ((winner = win()) != null) { endTurn = turn; break; }
    // Channel and draw.
    for (let i = 0; i < (turn === 2 ? 3 : 2) && P.runeDeck.length; i++) P.board.push({ d: P.runeDeck.shift(), ready: true });
    draw(P);

    // Main 1: removal at a unit holding a battlefield alone, or any 3+ Might unit there. The
    // other side counters it if it can: a counter face down (free, §811.1.b) or in hand.
    for (const c of P.hand.slice()) {
      const e = removalOf(c); if (!e || !P.hand.includes(c)) continue;
      const champ = e.kind === "fight" ? P.units.slice().sort((a, b) => (cardFor(P, b).m || 0) - (cardFor(P, a).m || 0))[0] : null;
      if (e.kind === "fight" && !champ) continue;
      // A fight (Rampage): ours deals its Might to theirs and takes theirs back; cast only when ours
      // survives and theirs dies, paying the optional Body for +2 when it takes that (its text).
      const mine = e.kind === "fight" ? cardFor(P, champ).m || 0 : 0;
      const fits = (u) => { const m = u.c.m || 0; return e.kind === "damage" ? e.n >= m : e.kind === "fight" ? (mine > m || (e.bonus && mine + e.bonus > m)) : e.kind === "move" ? true : e.max == null || m <= e.max; };
      const targets = O.units.filter((u) => u.at >= 0 && fits(u));
      const alone = targets.find((u) => bfs[u.at].ctrl === O.side && unitsAt(O, u.at).length === 1);
      const t = alone || (e.kind === "move" ? null : targets.filter((u) => (u.c.m || 0) >= 3).sort((a, b) => (b.c.m || 0) - (a.c.m || 0))[0]);
      const boost = e.kind === "fight" && t && mine <= (t.c.m || 0);
      const plan = t && (boost ? payPlan(P, c.e || 0, "Body", 1, true) : canPay(P, c));
      if (!plan) continue;
      pay(P, plan); P.hand.splice(P.hand.indexOf(c), 1); P.trash.push(c);
      const spare = P.board.filter((x) => x.ready).length;
      const down = bfs.flatMap((bf) => bf.down[O.side]).find((k) => counterOf(k) && stops(counterOf(k), c, spare));
      const held = !down && O.hand.find((k) => counterOf(k) && stops(counterOf(k), c, spare) && canPay(O, k));
      if (down) { const bf = bfs.find((x) => x.down[O.side].includes(down)); bf.down[O.side].splice(bf.down[O.side].indexOf(down), 1); O.trash.push(down); continue; }
      if (held) { pay(O, canPay(O, held)); O.hand.splice(O.hand.indexOf(held), 1); O.trash.push(held); continue; }
      const where = t.at, wasTheirs = bfs[where].ctrl === O.side;
      if (e.kind === "bounce") { O.units.splice(O.units.indexOf(t), 1); O.hand.push(t.c); }
      else if (e.kind === "move") t.at = -1;
      else die(O, t);
      cleanup();
      if (wasTheirs && bfs[where].ctrl == null) P.st.stops++;
    }
    // Main 2: develop, most expensive first; the champion waits in the Champion Zone.
    for (;;) {
      const cands = [...P.hand.filter((c) => isUnit(c) || (!trick(c) && !removalOf(c) && !counterOf(c) && (/draw \d/i.test(c.x || "") || tokens(c).units.length) && !/Gear/.test(c.t))), ...(P.champ ? [P.champ] : [])]
        .filter((c) => canPay(P, c)).sort((a, b) => (b.e || 0) - (a.e || 0) || isUnit(b) - isUnit(a));
      const c = cands[0]; if (!c) break;
      pay(P, canPay(P, c));
      if (c === P.champ) P.champ = null; else P.hand.splice(P.hand.indexOf(c), 1);
      if (isUnit(c)) {
        const u = mk(c, -1); P.units.push(u);
        // Accelerate (1 Energy and a Power of its colour): enter ready, when it can be paid.
        if (/\[Accelerate\]/i.test(c.x || "")) { const plan = payPlan(P, 1, (c.d || [])[0], 1); if (plan) { pay(P, plan); u.ready = true; } }
        const m = PLAY_DRAW.exec(c.x || ""); if (m) draw(P, Number(m[1]));
      } else { P.trash.push(c); const m = /draw (\d+)/i.exec(c.x || ""); if (m) draw(P, Number(m[1])); }
      for (const k of tokens(c).units) if (!k.temp) P.units.push(mk(token(k.m), -1));
    }
    // A legend that makes a unit token: once a turn, when it can be paid.
    if (P.ability) { const plan = payPlan(P, P.ability.e, "rainbow", P.ability.p); if (plan) { pay(P, plan); for (const k of P.ability.tok.units) if (!k.temp) P.units.push(mk(token(k.m), -1)); } }
    // Hide at battlefields you control, a trick first (one facedown card each, §107.3.b.1): before
    // attacking (the Power counts toward Mercenary's two) and again after (a battlefield just taken).
    const hideNow = () => {
      bfs.forEach((bf, b) => {
      if (bf.ctrl !== s || bf.down[s].length) return;
      const c = P.hand.filter(hidden).sort((a, b2) => trick(b2) - trick(a))[0];
      const plan = c && payPlan(P, 0, "rainbow", 1);
      if (plan) { pay(P, plan); P.hand.splice(P.hand.indexOf(c), 1); bf.down[s].push(c); }
      });
    };
    hideNow();
    if (myTurn >= 4) { P.st.turnsFrom4++; if (P.units.some((u) => mercOn(P, u))) P.st.mercTurns++; }

    // Main 3: attack. Their battlefields first (a conquer there also stops their hold), then empty ones.
    const order = [0, 1].sort((a, b) => (bfs[b].ctrl === O.side) - (bfs[a].ctrl === O.side));
    for (const b of order) {
      if (bfs[b].ctrl === s || winner != null) continue;
      const free = P.units.filter((u) => u.ready && (u.at === -1 || (u.at !== b && ganks(P, u) && unitsAt(P, u.at).length > 1)));
      if (!free.length) continue;
      if (!unitsAt(O, b).length) {
        // Empty: the weakest free unit walks in and conquers (a showdown nobody contests).
        const u = free.sort((a, c) => (a.c.m || 0) - (c.c.m || 0))[0];
        u.at = b; u.ready = false; bfs[b].ctrl = s; cleanup(); score(P, b, scored, "conquer");
      } else {
        let team = free.slice().sort((a, c) => (c.c.m || 0) - (a.c.m || 0));
        const wasTheirs = bfs[b].ctrl === O.side;
        let res = doFight(P, O, b, team, false);
        const good = (x) => x.outcome === "conquer" || (x.outcome === "trade" && wasTheirs);
        if (!good(res)) continue;
        // Send no more than it takes: drop the weakest while the result holds.
        while (team.length > 1) { const t2 = team.slice(0, -1), r2 = doFight(P, O, b, t2, false); if (r2.outcome === res.outcome) { team = t2; res = r2; } else break; }
        res = doFight(P, O, b, team, true);
        if (res.outcome === "conquer") { bfs[b].ctrl = s; cleanup(); score(P, b, scored, "conquer"); if (wasTheirs) P.st.stops++; }
        else { if (res.outcome === "trade" && wasTheirs) { bfs[b].ctrl = null; P.st.stops++; } cleanup(); }
      }
      if ((winner = win()) != null) { endTurn = turn; break; }
    }
    // Main 4: the rest go out to defend, to the battlefield you control with the least there.
    for (const u of P.units.filter((x) => x.ready && x.at === -1)) {
      const mine = [0, 1].filter((b) => bfs[b].ctrl === s).sort((a, b) => unitsAt(P, a).length - unitsAt(P, b).length);
      if (mine.length) { u.at = mine[0]; u.ready = false; }
    }
    hideNow();
    if (myTurn === 8 && at8[s] == null) at8[s] = P.score;
  }
  for (const s of [0, 1]) if (at8[s] == null) at8[s] = Ps[s].score;
  return { winner, endTurn, at8, score: Ps.map((P) => P.score), st: Ps.map((P) => P.st) };
}

// Our deck against the field: one game per list in `foes` (real S/A lists), alternating who
// goes first. Points and how they're made, averaged.
export function matchReport(deck, cat, foeLists, { games = 400, seed = 11000, maxTurns = 12 } = {}) {
  const me = playerOf(deck.cards, cat);
  const them = foeLists.map((d) => ({ label: d.label, p: playerOf(d.cards, cat) })).filter((f) => f.p.main.length >= 30);
  const A = { diff: [], games: 0, at8: 0, their8: 0, holds: 0, conquers: 0, stops: 0, eve: 0, gated: 0, theirHolds: 0, theirStops: 0, first8: 0, theirFirst8: 0, merc: 0, mercN: 0 };
  const per = {};
  for (let i = 0; i < games && them.length; i++) {
    const f = them[i % them.length], r = rng(seed + i);
    const g = playMatch(me, f.p, r, { maxTurns, firstB: i % 2 === 1 });
    const s = g.st[0], o = g.st[1];
    A.games++; A.diff.push(g.at8[0] - g.at8[1]); A.at8 += g.at8[0]; A.their8 += g.at8[1]; A.holds += s.holds; A.conquers += s.conquers; A.stops += s.stops; A.eve += s.eve;
    A.gated += s.gated; A.theirHolds += o.holds; A.theirStops += o.stops; A.first8 += g.winner === 0; A.theirFirst8 += g.winner === 1;
    A.merc += s.mercTurns; A.mercN += s.turnsFrom4;
    const p = (per[f.label] ||= { games: 0, at8: 0, their8: 0, first8: 0 }); p.games++; p.at8 += g.at8[0]; p.their8 += g.at8[1]; p.first8 += g.winner === 0;
  }
  const n = A.games || 1;
  // diff: each game's point margin at turn 8, for paired comparisons (same games, two decks).
  return { diff: A.diff, games: A.games, margin8: (A.at8 - A.their8) / n, points8: A.at8 / n, theirPoints8: A.their8 / n, holds: A.holds / n, conquers: A.conquers / n, stops: A.stops / n,
    eve: A.eve / n, gated: A.gated / n, theirHolds: A.theirHolds / n, theirStops: A.theirStops / n,
    first8: A.first8 / n, theirFirst8: A.theirFirst8 / n, merc: A.mercN ? A.merc / A.mercN : null,
    per: Object.fromEntries(Object.entries(per).map(([k, p]) => [k, { games: p.games, points8: p.at8 / p.games, theirPoints8: p.their8 / p.games, first8: p.first8 / p.games }])) };
}
