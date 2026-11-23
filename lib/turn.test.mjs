// Tests for lib/turn.mjs: closing-turn positions with known answers by the rules. No network.
//
//   node lib/turn.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { solveTurn, breakers, turnReads, TURN_READERS } from "./turn.mjs";
import { fight } from "./fight.mjs";

const cat = await loadCatalog();
const C = (n) => { const c = cat.cards.find((x) => x.n === n && !x.v); if (!c) throw new Error(`no card ${n}`); return c; };
let failed = 0;
const ok = (label, cond, detail = "") => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`); };
const runes = (chaos, body, ready = true) => [...Array(chaos).fill("Chaos"), ...Array(body).fill("Body")].map((d) => ({ d, ready }));
const U = (n, side, at, ready = true) => ({ card: C(n), side, at, ready });
const show = (r) => `${r.win ? "WIN" : "no win"}, ${r.score.join("–")}: ${r.line.join(" | ")}`;

for (const [k, [re, name]] of Object.entries(TURN_READERS)) ok(`reader ${k} matches ${name}'s real text`, re.test(C(name).x || ""));
ok("reads: On the Hunt, Boots, Sivir, Graves, Faefolk", ["On the Hunt", "Boots of Swiftness", "Sivir, Mercenary", "Graves, Blasting Through", "Irresistible Faefolk"].every((n) => turnReads(C(n))));
ok("blind: Ember Monk's flip trigger isn't played", !turnReads(C("Ember Monk")));

const sivir = C("Sivir, Mercenary");
{
  // 1. 6 + hold A = 7; B empty; Sivir with Accelerate walks into B: both scored, 8.
  const pos = { score: [6, 5], ctrl: [0, null], beginning: true, units: [U("Stalwart Poro", 0, 0)], champ: sivir, runes: runes(4, 2) };
  const r = solveTurn(pos);
  ok("1. hold A to 7, Sivir (Accelerate) walks into empty B: win", r.win && r.kind === "hold + conquest", show(r));
  const r2 = solveTurn({ ...pos, runes: runes(4, 0) });
  ok("1b. without the Energy for Accelerate she enters exhausted: no win", !r2.win, show(r2));
}
{
  // 2. 6, no hold; one small defender at each; Sivir + On the Hunt conquers both.
  const pos = { score: [6, 5], ctrl: [1, 1], units: [U("Stalwart Poro", 1, 0), U("Stalwart Poro", 1, 1)], champ: sivir, hand: [C("On the Hunt")], runes: runes(5, 3) };
  const r = solveTurn(pos);
  ok("2. Sivir conquers A, On the Hunt readies her, she ganks into B: win", r.win && r.kind === "double conquest", show(r));
  const r2 = solveTurn({ ...pos, hand: [] });
  ok("2b. without On the Hunt: one conquest, 7, no win", !r2.win && r2.score[0] === 7, show(r2));
}
{
  // 3. At 7, a conquest without the other battlefield scored: draw, no point.
  const r = solveTurn({ score: [7, 5], ctrl: [null, null], units: [U("Stalwart Poro", 0, -1)], runes: [] });
  ok("3. at 7, conquering only one battlefield draws instead of scoring (§473.1.b.1)", !r.win && r.score[0] === 7 && r.drew === 1, show(r));
}
{
  // 4. Faefolk walks into A and pulls B's Heron in; Switcheroo face down at A beats it; Sivir walks into B.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Irresistible Faefolk", 0, -1), U("Astral Heron", 1, 1)],
    down: [[[C("Switcheroo")], []], [[], []]], champ: sivir, runes: runes(4, 2) };
  const r = solveTurn(pos);
  ok("4. Faefolk pulls B's defender into A, Sivir walks into the empty B: win", r.win && r.line.some((l) => /pulls their Astral Heron/.test(l)), show(r));
  const r2 = solveTurn({ ...pos, units: pos.units.filter((u) => u.card.n !== "Irresistible Faefolk") });
  ok("4b. without Faefolk, Sivir (6) can't beat the Heron (7) at B", !r2.win, show(r2));
}
{
  // 5. Their face-down Switcheroo at B stops the walk-in fight; and Switcheroo in hand breaks the line.
  const base = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir, runes: runes(4, 2) };
  const r = solveTurn(base);
  ok("5. Sivir (6) beats a Stalwart Poro (3 defending) at B: win", r.win, show(r));
  const r2 = solveTurn({ ...base, down: [[[], []], [[], [C("Switcheroo")]]] });
  ok("5b. their face-down Switcheroo at B swaps Sivir's Might away: no win", !r2.win, show(r2));
  const br = breakers({ ...base, their: { hand: [], budget: { e: 2, p: 2 } } }, [C("Switcheroo"), C("Stalwart Poro")]);
  ok("5c. what breaks it: Switcheroo held up (2 Energy, 2 Power)", br.includes("Switcheroo") && !br.includes("Stalwart Poro"), br.join(", "));
}
{
  // 6. Battlefield → battlefield needs Ganking (§810): Boots give it.
  const pos = { score: [6, 5], ctrl: [0, null], beginning: true, units: [U("Stalwart Poro", 0, 0)], runes: runes(1, 0) };
  const r = solveTurn(pos);
  ok("6. a unit without Ganking at A can't move to B: no win", !r.win, show(r));
  const r2 = solveTurn({ ...pos, gear: [C("Boots of Swiftness")] });
  ok("6b. Boots equipped (1 Chaos) give it Ganking: A → B, win", r2.win && r2.line.some((l) => /equip Boots/.test(l)), show(r2));
}
{
  // 7. Graves attacks two Stalwart Poros (3 defending each): his blast (4) clears them.
  const r = solveTurn({ score: [4, 5], ctrl: [null, 1], units: [U("Graves, Blasting Through", 0, -1), U("Stalwart Poro", 1, 1), U("Stalwart Poro", 1, 1)], runes: [] });
  ok("7. Graves's blast clears two 3-Might defenders: B conquered", r.score[0] === 5 && r.ctrl[1] === 0, show(r));
}

// ── families the executor plays from the card text (lib/cardtext.mjs) ──
const R = (d, n) => Array(n).fill({ d, ready: true });
{
  // 8. On-play −N to all enemies: Thousand-Tailed Watcher drops B's Vex (4) to 1; a 2-Might unit takes B.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Traveling Merchant", 0, -1), U("Vanguard Sergeant", 1, 1)],
    hand: [C("Thousand-Tailed Watcher")], runes: R("Mind", 8) };
  const r = solveTurn(pos);
  ok("8. Thousand-Tailed Watcher's -3 (minimum 1) drops B's Vanguard Sergeant (4) to 1; a 2-Might unit takes B: win", r.win && r.line.some((l) => /Thousand-Tailed/.test(l)), show(r));
  ok("8b. without it, 2 Might into a 4: no win", !solveTurn({ ...pos, hand: [] }).win);
}
{
  // 9. A spell move of an enemy unit: Charm sends B's Heron away; a Poro walks into B.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Astral Heron", 1, 1)], hand: [C("Charm")], runes: R("Calm", 2) };
  const r = solveTurn(pos);
  ok("9. Charm moves their Heron out of B, a Poro walks in: win", r.win && r.line.some((l) => /cast Charm/.test(l)), show(r));
}
{
  // 10. Their trigger on our play: Vex, Apathetic at a battlefield stuns Sivir as she's played; she can't move.
  const base = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir, runes: runes(4, 2) };
  const r = solveTurn({ ...base, units: [...base.units, U("Vex, Apathetic", 1, 1)] });
  ok("10. Vex at B stuns the Sivir you play; she can't move: no win", !r.win && r.line.some((l) => /stunned and can't move/.test(l)), show(r));
  const r2 = solveTurn({ ...base, units: [...base.units, U("Vex, Apathetic", 1, -1)] });
  ok("10b. Vex in their base isn't at a battlefield: Sivir walks into B, win", r2.win, show(r2));
}
{
  // 11. "Opponents can't play cards this turn" (Brynhir) shuts off their face-down Switcheroo (playing from face down is playing, §811.1.c.3).
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir,
    hand: [C("Brynhir Thundersong")], down: [[[], []], [[], [C("Switcheroo")]]], runes: [...runes(4, 2), ...R("Fury", 6)] };
  const r = solveTurn(pos);
  ok("11. Brynhir first, then Sivir: their Switcheroo can't be played, win", r.win && r.line.some((l) => /can't play cards/.test(l)), show(r));
}
{
  // 12. On-play ready: First Mate readies an exhausted Sivir at A (2 Power spent: Ganking); she ganks into B.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Sivir, Mercenary", 0, 0, false), U("Stalwart Poro", 1, 1)], hand: [C("First Mate")], runes: R("Body", 3), spent: 2 };
  const r = solveTurn(pos);
  ok("12. First Mate readies Sivir at A, she ganks into B: win", r.win && r.line.some((l) => /First Mate/.test(l)), show(r));
  ok("12b. without First Mate she stays exhausted: no win", !solveTurn({ ...pos, hand: [] }).win);
}
{
  // 13. An activated [Add]: Seal of Discord's Chaos is the second Chaos Sivir's Accelerate needs.
  const pos = { score: [6, 5], ctrl: [0, null], beginning: true, units: [U("Stalwart Poro", 0, 0)], champ: sivir, runes: [...R("Body", 5), ...R("Chaos", 1)] };
  ok("13. one Chaos rune: no Accelerate, no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, gear: [C("Seal of Discord")] });
  ok("13b. Seal of Discord adds the second Chaos: Sivir enters ready, walks into B, win", r.win && r.line.some((l) => /Seal of Discord/.test(l)), show(r));
}
{
  // 14. Spell damage: Falling Star (3 and 3) kills B's Poro; Sivir walks in.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Astral Heron", 1, 1)], hand: [C("Falling Star")], runes: R("Fury", 2) };
  const r = solveTurn(pos);
  ok("14. Falling Star's 3 + 3 isn't enough for a 7-Might Heron: no win", !r.win, show(r));
  const r2 = solveTurn({ ...pos, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Vanguard Sergeant", 1, 1)] });
  ok("14b. it kills a 4-Might Vanguard Sergeant (3 + 3 on one unit), a Poro walks in: win", r2.win && r2.line.some((l) => /Vanguard Sergeant \(B\) dies/.test(l)), show(r2));
  const r3 = solveTurn({ ...pos, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Vex, Apathetic", 1, 1)] });
  ok("14c. Vex's Deflect makes each Falling Star target cost 1 more Power, which two Fury runes can't pay: no win", !r3.win, show(r3));
}

{
  // 15. Their Ambush from hand joins B's defence (§822.1.b): Vi, Peacekeeper (5) next to a Poro (3) holds against Sivir (6).
  const base = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir, runes: runes(4, 2) };
  const r = solveTurn({ ...base, their: { hand: [C("Vi, Peacekeeper")], budget: { e: 5, p: 1 } } });
  ok("15. their Vi ambushes into B's fight: Sivir is held, no win", !r.win && r.line.some((l) => /ambushes in/.test(l)), show(r));
  ok("15b. without the Energy to pay for her, Sivir takes B: win", solveTurn({ ...base, their: { hand: [C("Vi, Peacekeeper")], budget: { e: 2, p: 1 } } }).win);
}
{
  // 16. Rengar, Trophy Hunter can Ambush where there are enemy units (§822.1.d): played straight into B, he takes it.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], hand: [C("Rengar, Trophy Hunter")], runes: R("Body", 6) };
  const r = solveTurn(pos);
  ok("16. Rengar, Trophy Hunter played straight into B beats the Poro: win", r.win && r.line.some((l) => /straight into B/.test(l)), show(r));
}
{
  // 17. [Repeat]: Bellows Breath (1 to up to three units at one place), paid twice, clears two 2-Might Poros at B.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Stalwart Poro", 1, 1), U("Stalwart Poro", 1, 1)], hand: [C("Bellows Breath")], runes: R("Mind", 4) };
  const r = solveTurn(pos);
  ok("17. Bellows Breath with its Repeat kills both Poros at B, a Poro walks in: win", r.win && r.line.some((l) => /repeat Bellows Breath/.test(l)), show(r));
  // One rune is exhausted for the Energy and recycled for the Power (docs/rules.md, Resources), so one pays the cast and not the Repeat.
  ok("17b. with one Mind rune there's no Repeat, and 1 damage each isn't enough: no win", !solveTurn({ ...pos, runes: R("Mind", 1) }).win);
}

{
  // 18. "You may play me to an open battlefield" (§170.11.c: unoccupied and uncontrolled): Sneaky Deckhand conquers B as it's played.
  const pos = { score: [6, 5], ctrl: [0, null], beginning: true, units: [U("Stalwart Poro", 0, 0)], hand: [C("Sneaky Deckhand")], runes: R("Chaos", 3) };
  const r = solveTurn(pos);
  ok("18. Sneaky Deckhand played straight onto the open B: win", r.win && r.line.some((l) => /open B/.test(l)), show(r));
}
{
  // 19. Sabotage recycles a non-unit card from their hand: the Switcheroo that would stop Sivir is gone.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir, hand: [C("Sabotage")],
    runes: [...runes(4, 2), ...R("Body", 2)], their: { hand: [C("Switcheroo")], budget: { e: 2, p: 2 } } };
  ok("19. their Switcheroo held up stops Sivir without Sabotage", !solveTurn({ ...pos, hand: [] }).win);
  const r = solveTurn(pos);
  ok("19b. Sabotage first strips it, then Sivir takes B: win", r.win && r.line.some((l) => /Switcheroo is recycled/.test(l)), show(r));
}
{
  // 20. The Waters' Wage from face down on our turn: three ready Gold, which pay Sivir's Accelerate (Body runes only,
  // so no Chaos Power without it). Gold stays if unused; only this turn's spending is searched.
  const pos = { score: [6, 5], ctrl: [0, null], beginning: true, units: [U("Stalwart Poro", 0, 0)], champ: sivir, runes: runes(0, 5) };
  ok("20. no Chaos Power: Sivir can't Accelerate, no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, down: [[[C("The Waters' Wage")], []], [[], []]] });
  ok("20b. The Waters' Wage flipped: 3 ready Gold pay Accelerate, Sivir takes B: win", r.win && r.line.some((l) => /3 ready Gold/.test(l)), show(r));
}
{
  // 21. Smoke and Mirrors: a ready [Temporary] token stuck at A (no Ganking) swaps with an exhausted unit at base,
  // then walks from base into B, which they control and left empty. Without [Temporary] there's no swap.
  const sprite = { n: "Sprite token", t: "Unit", m: 3, x: "[Temporary]", token: true };
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 3),
    units: [{ card: sprite, side: 0, at: 0, ready: true }, U("Mega-Mech", 0, -1, false)] };
  ok("21. without Smoke and Mirrors the token can't reach B: no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, hand: [C("Smoke and Mirrors")] });
  ok("21b. swap, then the token walks into B: win", r.win && r.line.some((l) => /swap places/.test(l)), show(r));
  const plain = { ...sprite, n: "Plain token", x: "" };
  ok("21c. no [Temporary]: no swap, no win", !solveTurn({ ...pos, units: [{ ...pos.units[0], card: plain }, pos.units[1]], hand: [C("Smoke and Mirrors")] }).win);
}
{
  // 22. Elder Dragon: "any amount of your damage is enough to kill enemy units". Its play trigger's 1 damage kills
  // their 8-Might Mega-Mech holding B, and a Poro walks in from base. In a fight, a 2-Might defender trades with it.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Body", 16),
    units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Mega-Mech", 1, 1)] };
  ok("22. their Mega-Mech holds B: no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, hand: [C("Elder Dragon")] });
  ok("22b. Elder Dragon's 1 damage kills it; the Poro takes B: win", r.win && r.line.some((l) => /Mega-Mech \(B\) dies/.test(l)), show(r));
  ok("22c. fight: Mega-Mech conquers a Poro", fight({ units: [C("Mega-Mech")] }, { units: [C("Stalwart Poro")] }).outcome === "conquer");
  ok("22d. fight with any-damage-kills on the Poro's side: trade", fight({ units: [C("Mega-Mech")] }, { units: [C("Stalwart Poro")], anyDamageKills: true }).outcome === "trade");
}
{
  // 23. Karthus, Eternal: their Hunting Dog dies in our attack on B, and with Karthus at their base its Deathknell
  // (a 1-Might Bird token to base) triggers twice.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Fury", 3), hand: [C("Hextech Ray")],
    units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Hunting Dog", 1, 1)] };
  const birds = (r) => r.line.filter((l) => /Bird token/.test(l)).length;
  const r1 = solveTurn(pos), r2 = solveTurn({ ...pos, units: [...pos.units, U("Karthus, Eternal", 1, -1)] });
  ok("23. Hunting Dog dies: one Bird", r1.win && birds(r1) === 1, show(r1));
  ok("23b. with their Karthus: two Birds", r2.win && birds(r2) === 2, show(r2));
}
{
  // 24. Siphoning Strike: 4 damage, or 7 "instead" with 7+ runes. Their 6-Might unit holds B; at 7 runes it dies.
  const wall = { n: "Wall token", t: "Unit", m: 6, x: "", token: true };
  const pos = (k) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Calm", k), hand: [C("Siphoning Strike")],
    units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), { card: wall, side: 1, at: 1, ready: true }] });
  ok("24. 6 runes: 4 damage, the 6-Might unit holds B: no win", !solveTurn(pos(6)).win);
  const r = solveTurn(pos(7));
  ok("24b. 7 runes: 7 damage kills it, a Poro takes B: win", r.win && r.line.some((l) => /Wall token \(B\) dies/.test(l)), show(r));
  ok("24c. Tomb-Raider Barbara plays (her enemy-gear text changes nothing on the solver's board)", turnReads(C("Tomb-Raider Barbara")));
}
{
  // 25. Ahri, Alluring: "When I hold, you score 1 point." From 6, holding A gives 7 and her trigger 8, no conquest needed
  // (points from an effect skip the Final Point rule, §473.1.a.1). A plain unit holding A stops at 7.
  const pos = (u) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [U(u, 0, 0), U("Mega-Mech", 1, 1)] });
  ok("25. a Poro holds A: 7, no win", !solveTurn(pos("Stalwart Poro")).win);
  const r = solveTurn(pos("Ahri, Alluring"));
  ok("25b. Ahri holds A and scores 1: win", r.win && r.line.some((l) => /score 1/.test(l)), show(r));
}
{
  // 26. Tags: Bubble Bot readies "another friendly Mech". An exhausted Mega-Mech (a Mech) at base gets readied and walks
  // into B; Playful Phantom isn't a Mech, so it stays exhausted.
  const pos = (u) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 4), hand: [C("Bubble Bot")],
    units: [U("Stalwart Poro", 0, 0), U(u, 0, -1, false)] });
  const r = solveTurn(pos("Mega-Mech"));
  ok("26. Bubble Bot readies the Mega-Mech, which takes B: win", r.win, show(r));
  ok("26b. Playful Phantom isn't a Mech: no win", !solveTurn(pos("Playful Phantom")).win);
}

console.log(failed ? `\n${failed} failed` : "\nall turn tests pass");
process.exit(failed ? 1 : 0);
