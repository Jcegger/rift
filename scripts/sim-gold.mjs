#!/usr/bin/env node
// scripts/sim-gold.mjs — a Gold-aware goldfish for Sivir, Battle Mistress, and the numbers behind
// builds/sivir-gold-midrange-radiance.json (21 Oct 2026). lib/sim.mjs counts Energy and curve;
// it can't see Gold, which is Sivir's whole engine, so this models it.
//
//   node scripts/sim-gold.mjs            # the build against its variants, 20,000 games each
//
// A Gold-aware goldfish for Sivir, Battle Mistress. Models what lib/sim.mjs does not:
// Power paid by recycling runes (a recycled rune leaves the board), Battle Mistress (once per
// readying: recycle -> an exhausted Gold, ready next turn), Gold as rainbow Power, Hidden
// (pay [A] to hide at a held battlefield, one per battlefield, play it free from next turn),
// The Waters' Wage flipped on your turn (three READY Gold), Reckless Innovator (assumed to
// exhaust every turn after it lands -> a Gold), Sivir's threshold (2 Power spent this turn),
// and Black Market ([A][A]: draw 1, paid from Gold only). No opponent, no combat, no deaths.
// Added 21 Oct for the Radiance redo: Bushwhack Trap (cast at a held battlefield: one more hide
// slot there while you hold it), Momentary Companion (a Hidden 4-Might unit flipped free — its
// Might counts as "free Might"), Bandle Scouts' Academy (a Gold whenever you hide there), and
// the game's battlefield drawn from the deck's three (opt.bfs), not a fixed one-in-three.
import { indexCatalog } from "../lib/decks.mjs";
import { readFileSync } from "fs";
const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cat = R("cards.json"), ex = R("extras.json"), ban = R("banned.json");
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(ex.cards || []).filter((c) => c.c && !known.has(c.c))], ban);
const C = (n) => { const c = idx.cards.find((x) => x.n === n && !x.v); if (!c) throw new Error(n); return { n, t: c.t, e: c.e || 0, p: c.p || 0, d: (c.d || [])[0], hidden: /\[Hidden\]/.test(c.x || "") }; };
function rng(s) { return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); }
const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const SLOT_PRIORITY = { "The Waters' Wage": 4, "Momentary Companion": 3.5, "Tornado Warrior": 3, "Edge of Night": 2, "Switcheroo": 1 };

function game(list, runes, r, onDraw, opt) {
  const lib = shuffle(Object.entries(list).flatMap(([n, q]) => Array(q).fill(n)).filter((n) => n !== "Sivir, Mercenary").map(C), r);
  const rdeck = shuffle([...Array(runes.Body).fill("Body"), ...Array(runes.Chaos).fill("Chaos")], r);
  const hand = lib.splice(0, 4);
  let sivir = C("Sivir, Mercenary"), board = [], goldR = 0, goldX = 0, legend = true, slots = [], trap = false, innov = 0, trashSpells = 0;
  // The game's battlefield: one of the deck's three at random (opt.bfs), or the old one-in-three Black Market.
  const bf = opt.bfs ? opt.bfs[Math.floor(r() * opt.bfs.length)] : (opt.bm && r() < 1 / 3 ? "Black Market" : null);
  const bm = bf === "Black Market", academy = bf === "Bandle Scouts' Academy";
  const m = { spent: 0, gold: 0, sivir6: null, sivirAt: null, graves: null, drawn: 0, wageFlips: 0, runes6: 0, freeMight: 0, hides: 0 };
  for (let t = 1; t <= 7; t++) {
    board.forEach((x) => (x.ready = true)); goldR += goldX; goldX = 0; legend = true;
    for (let i = 0; i < (t === 1 && onDraw ? 3 : 2) && rdeck.length; i++) board.push({ d: rdeck.shift(), ready: true });
    if (lib.length) hand.push(lib.shift());                 // a draw every turn, the first player's first included (README, Simulator)
    goldX += innov; m.gold += innov;                        // Innovators that landed earlier exhaust: a Gold each
    const held = t >= 2 && r() < opt.held;
    let pw = 0, E = () => board.filter((x) => x.ready).length;
    const payE = (n) => { for (const x of board) if (n > 0 && x.ready) { x.ready = false; n--; } };
    // Pay one Power of domain d (or any): an exhausted rune first while the legend is ready (a Gold
    // for next turn), then Gold, then an exhausted rune, then a ready one (costing its Energy).
    const canPay = (d, n, eNeed) => { const rd = board.filter((x) => !d || x.d === d); return goldR + rd.length >= n && E() - eNeed >= Math.max(0, n - goldR - rd.filter((x) => !x.ready).length); };
    const payP = (d) => {
      const pick = (f) => board.findIndex((x) => (!d || x.d === d) && f(x));
      let j = legend ? pick((x) => !x.ready) : -1;
      if (j >= 0) { rdeck.push(board.splice(j, 1)[0].d); legend = false; goldX++; m.gold++; pw++; return; }
      if (goldR > 0) { goldR--; pw++; return; }
      j = pick((x) => !x.ready); if (j < 0) j = pick(() => true);
      const was = board[j].ready; rdeck.push(board.splice(j, 1)[0].d); if (legend) { legend = false; goldX++; m.gold++; } pw++;
      return was;
    };
    const cast = (c) => { payE(c.e); for (let i = 0; i < c.p; i++) payP(c.d); m.spent += c.e + c.p; };
    // 1. Cards hidden on an earlier turn: play them free (Wage: three ready Gold). Losing the
    //    battlefield loses them, and the Trap with it (an opponent's hold kills a Deploy gear).
    if (!held) { slots = []; trap = false; }
    else for (const sl of slots.filter((x) => x.t0 < t)) {
      if (sl.c.n === "The Waters' Wage") { goldR += 3; m.gold += 3; m.wageFlips++; } else m.spent += sl.c.e + sl.c.p;
      if (sl.c.n === "Momentary Companion") m.freeMight += 4;
      slots.splice(slots.indexOf(sl), 1);
    }
    // 2. Main phase, greedy: the most expensive castable card, units first; Sivir from the Champion Zone.
    for (let guard = 0; guard < 12; guard++) {
      const opts = hand.filter((c) => c.n !== "The Waters' Wage" || !held).filter((c) => c.n !== "Momentary Companion" || !held).filter((c) => c.n !== "Bushwhack Trap" || (held && !trap)).filter((c) => E() >= c.e && canPay(c.d, c.p, c.e));
      if (sivir && E() >= 4 && canPay("Chaos", 1, 4)) opts.push(sivir);
      if (!opts.length) break;
      opts.sort((a, b) => (b.t === "Unit") - (a.t === "Unit") || b.e + b.p - (a.e + a.p));
      const c = opts[0];
      cast(c);
      if (c === sivir) { sivir = null; m.sivirAt = t; m.sivirPw = pw; }
      else hand.splice(hand.indexOf(c), 1);
      if (c.n === "Graves, Blasting Through" && m.graves == null) m.graves = t;
      if (c.n === "Reckless Innovator") innov++;
      if (c.n === "Bushwhack Trap") trap = true;
      if (c.n === "The Waters' Wage") { goldX++; m.gold++; }
      if (c.n === "Ezreal, Prodigy" && lib.length) { hand.push(...lib.splice(0, 2)); trashSpells++; m.drawn += 1; }
      if (c.n === "Fizz, Trickster" && trashSpells > 0) m.spent += 2;   // a free spell from the trash
      if (c.t === "Spell") trashSpells++;
    }
    // 3. Hide the best Hidden cards at a held battlefield, paying [A] each: one slot, two with the Trap.
    while (held && slots.length < (trap ? 2 : 1)) {
      const h = hand.filter((c) => c.hidden && SLOT_PRIORITY[c.n]).sort((a, b) => SLOT_PRIORITY[b.n] - SLOT_PRIORITY[a.n])[0];
      if (!h || !canPay(null, 1, 0)) break;
      payP(null); hand.splice(hand.indexOf(h), 1); slots.push({ c: h, t0: t }); m.spent += 1; m.hides++;
      if (academy) { goldX++; m.gold++; }                  // Bandle Scouts' Academy: a Gold for the hide
    }
    // 4. Black Market: [A][A] draw 1, from Gold only.
    if (bm && goldR >= 2) { goldR -= 2; pw += 2; m.drawn++; m.spent += 2; if (lib.length) hand.push(lib.shift()); }
    if (m.sivirAt === t && pw >= 2 && m.sivir6 == null) m.sivir6 = t;
    if (m.sivir6 == null && !sivir && pw >= 2) m.sivir6 = t;            // on board, threshold met this turn
    if (t === 6) m.runes6 = board.length;
    if (t <= 6) m["s" + t] = m.spent;
  }
  return m;
}
export function run(list, runes, opt, games = 20000) {
  const acc = { spent6: 0, gold: 0, drawn: 0, wageFlips: 0, runes6: 0, sivir6by5: 0, sivir6by6: 0, gravesBy6: 0, freeMight: 0, hides: 0, n: 0 };
  for (let i = 0; i < games; i++) {
    const m = game(list, runes, rng(i * 7919 + 1), i % 2 === 1, opt);
    acc.freeMight += m.freeMight; acc.hides += m.hides;
    acc.n++; acc.spent6 += m.s6; acc.gold += m.gold; acc.drawn += m.drawn; acc.wageFlips += m.wageFlips; acc.runes6 += m.runes6;
    acc.sivir6by5 += m.sivir6 != null && m.sivir6 <= 5; acc.sivir6by6 += m.sivir6 != null && m.sivir6 <= 6; acc.gravesBy6 += m.graves != null && m.graves <= 6;
  }
  const f = (k, d = 1) => (acc[k] / acc.n).toFixed(d), pc = (k) => Math.round((acc[k] / acc.n) * 100) + "%";
  if (opt.raw) return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, v / acc.n]));
  return `spent T1-6 ${f("spent6")} · Gold ${f("gold")} · hides ${f("hides")} · free Might ${f("freeMight")} · extra cards ${f("drawn", 2)} · runes T6 ${f("runes6")} · Sivir 6 Might by T5 ${pc("sivir6by5")} · Graves by T6 ${pc("gravesBy6")}`;
}

// The build and the variants it was chosen over (see the build's "audit" changes).
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync: rf } = await import("fs");
  const b = JSON.parse(rf(new URL("../builds/sivir-gold-midrange-radiance.json", import.meta.url), "utf8"));
  const name = (k) => idx.cards.find((c) => c.c.replace(/\/\d+$/, "") === k && !c.v)?.n;
  const list = {};
  for (const [k, q] of Object.entries(b.cards)) { const c = idx.cards.find((x) => x.c.replace(/\/\d+$/, "") === k && !x.v); if (["Unit", "Spell", "Gear"].includes(c?.t)) list[c.n] = q; }
  const runes = { Body: 0, Chaos: 0 };
  for (const [k, q] of Object.entries(b.cards)) { const n = name(k); if (n === "Body Rune") runes.Body = q; if (n === "Chaos Rune") runes.Chaos = q; }
  const withWage = { ...list, "The Waters' Wage": 2, "Tornado Warrior": (list["Tornado Warrior"] || 0) - 1, "Traveling Merchant": (list["Traveling Merchant"] || 0) - 1 };
  for (const held of [0.5, 0.8]) {
    console.log(`held ${held}  build, Black Market   ${run(list, runes, { held, bm: true })}`);
    console.log(`held ${held}  build, Sandswept Tomb ${run(list, runes, { held, bm: false })}`);
    console.log(`held ${held}  +2 Waters' Wage       ${run(withWage, runes, { held, bm: true })}`);
  }
}
