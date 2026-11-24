// Tests for lib/turn.mjs: closing-turn positions with known answers by the rules. No network.
//
//   node lib/turn.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { solveTurn, breakers, turnReads, TURN_READERS, BOMB } from "./turn.mjs";
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
ok("blind: a sentence nobody reads isn't played (every real card is read since 24 Nov)", !turnReads({ n: "Moon Card", t: "Unit", m: 2, x: "When the moon is full, transform into a wolf." }));
ok("read since 23 Nov: Ember Monk's face-down trigger", turnReads(C("Ember Monk")));

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
  // (Since 24 Nov an ambusher that survives stays on the board, so the best line no longer attacks into her at all.)
  ok("15. their Vi in hand (Ambush into B's fight) stops Sivir: no win", !r.win, show(r));
  ok("15c. without Vi: win", solveTurn(base).win);
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
  // (A [Temporary] token dies at the start of our Beginning Phase, §816.1.b–c, so this starts after A has scored: 7.)
  const pos = { score: [7, 5], ctrl: [0, 1], scored: [0], runes: R("Mind", 3),
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

{
  // 27. Sett, Brawler: "Spend my buff: Give me +4 M this turn." Buffed he's 5; spending it makes him 8 (the buff's +1
  // leaves). Their 6-Might unit holds B: buffed Sett loses that fight, Sett after spending wins it.
  const wall = { n: "Wall token", t: "Unit", m: 6, x: "", token: true };
  const pos = (buffed) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [],
    units: [U("Stalwart Poro", 0, 0), { ...U("Sett, Brawler", 0, -1), buffed }, { card: wall, side: 1, at: 1, ready: true }] });
  const r = solveTurn(pos(true));
  ok("27. buffed Sett spends it (+4), takes B: win", r.win && r.line.some((l) => /Sett, Brawler: Give me \+4/.test(l)), show(r));
  ok("27b. no buff to spend: no win", !solveTurn(pos(false)).win);
}
{
  // 28. Dragon Form: a unit's base Might becomes 5 this turn. A 2-Might Poro becomes 5 and beats their 4-Might unit at B.
  const wall = { n: "Wall token", t: "Unit", m: 4, x: "", token: true };
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Order", 3),
    units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), { card: wall, side: 1, at: 1, ready: true }] };
  ok("28. no Dragon Form: no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, hand: [C("Dragon Form")] });
  ok("28b. Dragon Form on the Poro (5), it takes B: win", r.win, show(r));
}
{
  // 29. High Note: -M equal to the number of exhausted units we control. Two exhausted at base: their 3-Might unit at B
  // drops to 1 and a Poro (2) takes it. With none exhausted it's -0.
  const wall = { n: "Wall token", t: "Unit", m: 3, x: "", token: true };
  const pos = (tired) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 3), hand: [C("High Note")],
    units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), ...Array(tired).fill(0).map(() => U("Mega-Mech", 0, -1, false)), { card: wall, side: 1, at: 1, ready: true }] });
  const r = solveTurn(pos(2));
  ok("29. two exhausted units: High Note -2, the Poro takes B: win", r.win, show(r));
  ok("29b. none exhausted: no win", !solveTurn(pos(0)).win);
}

{
  // 30. Confront: units we play this turn enter ready. A Poro from hand walks into B, which they control and left empty.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: [...R("Body", 2), ...R("Calm", 2)], units: [U("Stalwart Poro", 0, 0)] };
  ok("30. a Poro from hand enters exhausted: no win", !solveTurn({ ...pos, hand: [C("Stalwart Poro")] }).win);
  const r = solveTurn({ ...pos, hand: [C("Confront"), C("Stalwart Poro")] });
  ok("30b. Confront, then the Poro enters ready and takes B: win", r.win, show(r));
}
{
  // 31. Last Caress: the next unit goes straight to any battlefield, buffed. A Poro (2, 3 buffed) beats their 2-Might unit at B.
  const wall = { n: "Wall token", t: "Unit", m: 2, x: "", token: true };
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: [...R("Body", 2), ...R("Calm", 2)],
    units: [U("Stalwart Poro", 0, 0), { card: wall, side: 1, at: 1, ready: true }] };
  ok("31. without Last Caress: no win", !solveTurn({ ...pos, hand: [C("Stalwart Poro")] }).win);
  const r = solveTurn({ ...pos, hand: [C("Last Caress"), C("Stalwart Poro")] });
  ok("31b. Last Caress, the Poro goes to B buffed (3 vs 2): win", r.win && r.line.some((l) => /Last Caress/.test(l)), show(r));
}
{
  // 32. Mirror Image: a ready token copy of our exhausted Mega-Mech walks into B past their 6-Might unit.
  const wall = { n: "Wall token", t: "Unit", m: 6, x: "", token: true };
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 6),
    units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), { card: wall, side: 1, at: 1, ready: true }] };
  ok("32. the Mega-Mech is exhausted: no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, hand: [C("Mirror Image")] });
  ok("32b. Mirror Image copies it, ready; the copy takes B: win", r.win && r.line.some((l) => /copy of Mega-Mech/.test(l)), show(r));
}
{
  // 33. Gutter Palace: at the start of our Beginning Phase, exactly 4 cards in hand and 4 units at battlefields wins.
  const four = [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, 1), U("Stalwart Poro", 0, 1)];
  const pos = (n) => ({ score: [3, 5], ctrl: [0, 0], beginning: true, runes: [], gear: [C("Gutter Palace")], units: four, hand: Array(n).fill(C("Stalwart Poro")) });
  const r = solveTurn(pos(4));
  ok("33. 4 in hand, 4 at battlefields: win at 3 points", r.win && r.line.some((l) => /win the game/.test(l)), show(r));
  ok("33b. 3 in hand: no win", !solveTurn(pos(3)).win);
}
{
  // 34. Kayle, Justified: empowered up to three times, +2 M each. Empowered twice, one more [Empower] makes her 9 with
  // Ganking, past their 8-Might unit at B. Once empowered, one more makes her 7: no.
  const wall = { n: "Wall token", t: "Unit", m: 8, x: "", token: true };
  const pos = (n) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Order", 3),
    units: [U("Stalwart Poro", 0, 0), { ...U("Kayle, Justified", 0, -1), empowered: n }, { card: wall, side: 1, at: 1, ready: true }] });
  const r = solveTurn(pos(2));
  ok("34. empowered twice, once more: 9, takes B: win", r.win, show(r));
  ok("34b. empowered once, once more: 7, no win", !solveTurn(pos(1)).win);
}
{
  // 35. Herald of Scales: our Dragons cost [e2] less. Blazing Scorcher (5) costs 3, so it and its Accelerate fit in 5
  // runes and it takes B. With a Poro holding A instead of Herald it costs 5: no win.
  const pos = (holder) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [...R("Fury", 3), ...R("Body", 2)],
    units: [U(holder, 0, 0)], hand: [C("Confront"), C("Blazing Scorcher")] });
  const r = solveTurn(pos("Herald of Scales"));
  ok("35. Herald: Scorcher costs 3, so its Accelerate fits too; it takes B: win", r.win, show(r));
  ok("35b. no Herald: no win", !solveTurn(pos("Stalwart Poro")).win);
}

{
  // 36. Baron Nashor adds the Baron Pit, a third battlefield, and enters there (docs/rules-rulings.md: "The Baron Pit is a
  // battlefield"). He conquers the open Pit; from 6, after holding A, that's at 7 with B unscored: a draw, not the 8th.
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Chaos", 13), units: [U("Stalwart Poro", 0, 0)], hand: [C("Baron Nashor")] };
  const r = solveTurn(pos);
  ok("36. Baron takes the Pit at 7 with B unscored: draw, no win", !r.win && r.line.some((l) => /Baron Pit/.test(l)) && r.line.some((l) => /every battlefield/.test(l)), show(r));
  // From 5 with nothing held, the Pit's conquest is an ordinary point: 6.
  const r2 = solveTurn({ ...pos, score: [5, 5], ctrl: [null, 1], beginning: false });
  ok("36b. from 5: Baron conquers the Pit, 6", r2.score[0] === 6 && r2.line.some((l) => /conquer Pit/.test(l)), show(r2));
  // A conquest that draws at the gate still Scores the battlefield (§470.1, §471.1): Baron first (the Pit draws), then a
  // Poro conquers B with A, the Pit and B all Scored: the 8th. The other order draws twice.
  const r3 = solveTurn({ ...pos, units: [...pos.units, U("Stalwart Poro", 0, -1)] });
  const iBaron = r3.line.findIndex((l) => /play Baron/.test(l)), iB = r3.line.findIndex((l) => /conquer B → 8/.test(l));
  ok("36c. Baron, then a Poro takes B: win (Pit Scored by the draw)", r3.win && iBaron > -1 && iB > iBaron, show(r3));
}
{
  // 37. A Pit already on the board: hold A to 7, then a Poro walks into empty B. With two battlefields that's the 8th;
  // with the Pit unscored the conquest draws instead.
  const pos = (ctrl) => ({ score: [6, 5], ctrl, beginning: true, runes: [], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1)] });
  ok("37. two battlefields: hold A, conquer B: win", solveTurn(pos([0, 1])).win);
  const r = solveTurn(pos([0, 1, null]));
  ok("37b. the Pit on the board and unscored: no win", !r.win, show(r));
  ok("37c. the Pit held too: hold A and the Pit, 8: win", solveTurn({ ...pos([0, 1, 0]), units: [...pos([0, 1, 0]).units, U("Stalwart Poro", 0, 2)] }).win);
}

{
  // 38-45. Bombs (§187.12): "[Deathknell][>] Deal 2 to an enemy unit here and kill all other Bombs you control here."
  // Their N-Might unit holds B; a Poro at base walks in once it's gone. Without the Bomb the Poro trades with a 2.
  const wall = (m) => ({ card: { n: `Wall ${m}`, t: "Unit", m, x: "", token: true }, side: 1, at: 1, ready: true });
  const base = (m, extra = {}) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Fury", 3), units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), wall(m)], ...extra });
  const bombs = (...at) => ({ gear: at.map(() => ({ ...BOMB })), gearAt: at });
  ok("38. a Bomb at B, no way to kill it: no win", !solveTurn(base(2, bombs(1))).win);
  const r = solveTurn(base(2, { ...bombs(1), hand: [C("Hexplosive Minefield")] }));
  ok("38b. Hexplosive Minefield kills it: 2 to their unit, the Poro takes B: win", r.win && r.line.some((l) => /Deathknell hits/.test(l)), show(r));
  ok("39. one Bomb vs a 4-Might unit: no win", !solveTurn(base(4, { ...bombs(1), hand: [C("Hexplosive Minefield")] })).win);
  const r39 = solveTurn(base(4, { ...bombs(1, 1), hand: [C("Hexplosive Minefield")] }));
  ok("39b. two Bombs at B chain: 4 damage: win", r39.win && r39.line.some((l) => /1 more Bomb/.test(l)), show(r39));
  // 40. Amateur Demolitionist plays a Bomb to B, which they hold (Deploy: any battlefield, §830.1.b.1); Minefield sets it off.
  const r40 = solveTurn(base(2, { runes: R("Fury", 6), hand: [C("Amateur Demolitionist"), C("Hexplosive Minefield")] }));
  ok("40. Demolitionist's Bomb to B, then Minefield: win", r40.win && r40.line.some((l) => /a Bomb to B/.test(l)), show(r40));
  ok("40b. Demolitionist alone: no win", !solveTurn(base(2, { runes: R("Fury", 6), hand: [C("Amateur Demolitionist")] })).win);
  // 41. Ziggs, Short-Fused: friendly gear abilities deal 1 Bonus Damage, so one Bomb deals 3.
  const z = (who) => base(3, { ...bombs(1), hand: [C("Hexplosive Minefield")], units: [...base(3).units, U(who, 0, -1, false)] });
  ok("41. one Bomb vs a 3-Might unit: no win", !solveTurn(z("Mega-Mech")).win);
  ok("41b. with Ziggs, Short-Fused it deals 3: win", solveTurn(z("Ziggs, Short-Fused")).win);
  // 42. Detonation Amplifier at B: the Bomb's Deathknell triggers an additional time (2 + 2).
  const r42 = solveTurn(base(4, { gear: [{ ...BOMB }, C("Detonation Amplifier")], gearAt: [1, 1], hand: [C("Hexplosive Minefield")] }));
  ok("42. Amplifier at B: one Bomb hits twice, 4: win", r42.win, show(r42));
  // 44. Acceptable Losses: our only gear is a Bomb at B, so it dies and goes off.
  const r44 = solveTurn(base(2, { ...bombs(1), runes: R("Chaos", 1), hand: [C("Acceptable Losses")] }));
  ok("44. Acceptable Losses kills our Bomb at B: win", r44.win, show(r44));
  // 45. Command: Attack moves our Bomb from A to B, then Minefield. With the Bomb left at A it hits nothing.
  const pos45 = base(2, { ...bombs(0), runes: [...R("Calm", 3), ...R("Fury", 4)] });
  ok("45. the Bomb at A: no win", !solveTurn({ ...pos45, hand: [C("Hexplosive Minefield")] }).win);
  const r45 = solveTurn({ ...pos45, hand: [C("Command: Attack"), C("Hexplosive Minefield")] });
  ok("45b. Command: Attack moves it to B, Minefield: win", r45.win && r45.line.some((l) => /Bomb token A → B/.test(l)), show(r45));
}
{
  // 43. Jayce, Man of Progress: kill a friendly gear (our Banner at A), then a gear of Energy cost 7 or less plays for no
  // Energy: Portable Portal to A, whose units have Ganking, so the Poro there ganks into B. No gear to kill: no Portal.
  const pos = (gear) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 4), units: [U("Stalwart Poro", 0, 0)],
    hand: [C("Jayce, Man of Progress"), C("Portable Portal")], gear, gearAt: gear.map(() => 0) });
  const r = solveTurn(pos([C("Banner of Conquest")]));
  // All 4 runes go to Jayce, so the Portal after him can only be free.
  const iJ = r.line.findIndex((l) => /play Jayce/.test(l)), iP = r.line.findIndex((l) => /play Portable Portal/.test(l));
  ok("43. Jayce (all 4 runes) kills the Banner, Portal plays free to A, the Poro ganks into B: win", r.win && iJ > -1 && iP > iJ && r.line.some((l) => /ignores its Energy cost/.test(l)), show(r));
  ok("43b. nothing to kill: the free gear never comes", !solveTurn(pos([])).line.some((l) => /ignores its Energy cost/.test(l)));
  ok("43c. Portal costs its Energy otherwise: 1 rune, no Portal, no win", !solveTurn({ ...pos([]), runes: R("Mind", 1), hand: [C("Portable Portal")] }).win);
}
{
  // 46. Portable Portal at A: friendly units there have Ganking. 47. Banner of Conquest played to B, which they hold
  // (§830.1.b.1): units there have Assault, so the Poro attacks at 3 and beats their 2.
  const pos46 = (gear) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [U("Stalwart Poro", 0, 0)], gear, gearAt: gear.map(() => 0) });
  ok("46. no Portal: the Poro at A can't reach B: no win", !solveTurn(pos46([])).win);
  ok("46b. Portal at A: it ganks into B: win", solveTurn(pos46([C("Portable Portal")])).win);
  const wall = { card: { n: "Wall 2", t: "Unit", m: 2, x: "", token: true }, side: 1, at: 1, ready: true };
  const pos47 = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Fury", 2), units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), wall] };
  ok("47. no Banner: the Poro trades: no win", !solveTurn(pos47).win);
  const r = solveTurn({ ...pos47, hand: [C("Banner of Conquest")] });
  ok("47b. Banner to B (theirs), Assault: 3 vs 2: win", r.win && r.line.some((l) => /play Banner of Conquest to B/.test(l)), show(r));
}

{
  // 48. Bedeviling Stranger from hand: "choose a battlefield. If there are 4 or more units there, you may return an enemy
  // unit there." Until 23 Nov the second sentence was a spell trigger on a unit and never ran. Four 2-Might units hold B;
  // our Mega-Mech (8) trades with all four, but with one returned it takes 6 and conquers.
  const w = () => ({ card: { n: "Wall 2", t: "Unit", m: 2, x: "", token: true }, side: 1, at: 1, ready: true });
  const pos = { score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Chaos", 2), units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1), w(), w(), w(), w()] };
  ok("48. Mega-Mech into four 2-Might units: trade, no win", !solveTurn(pos).win);
  const r = solveTurn({ ...pos, hand: [C("Bedeviling Stranger")] });
  ok("48b. Bedeviling Stranger returns one, Mega-Mech takes B: win", r.win, show(r));
}
{
  // 49. XP and Level (§824.1.b.1: active while you have N or more XP; §823.1.c.1: Hunt gains XP on a hold). A Mosstomper
  // holding A has Hunt 2; from 1 XP that's 3, so the other Mosstomper has Level 3's +1 (4) and beats their 3 at B.
  const wall = { card: { n: "Wall 3", t: "Unit", m: 3, x: "", token: true }, side: 1, at: 1, ready: true };
  const pos = (xp) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], xp, units: [U("Mosstomper", 0, 0), U("Mosstomper", 0, -1), wall] });
  const r = solveTurn(pos(1));
  ok("49. 1 XP + Hunt 2 = 3: Level 3, Mosstomper 4 vs 3: win", r.win && r.line.some((l) => /gain 2 XP \(Hunt\)/.test(l)), show(r));
  ok("49b. 0 XP + 2 = 2: no Level, 3 vs 3: no win", !solveTurn(pos(0)).win);
}
{
  // 50. Dune Drake: "When I attack, give me +2 M this turn if there is a ready enemy unit here." The pump now reaches the
  // fight (attack triggers run before the Might is read).
  const drake = C("Dune Drake"), m = drake.m || 0;
  const wall = { card: { n: "Wall", t: "Unit", m: m + 1, x: "", token: true }, side: 1, at: 1, ready: true };
  const r = solveTurn({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [U("Stalwart Poro", 0, 0), U("Dune Drake", 0, -1), wall] });
  ok(`50. Dune Drake (${m}+2) beats a ${m + 1} at B: win`, r.win, show(r));
}
{
  // 51. Kennen, Keeper of Balance: "When you play me or I attack, you may pay [e2] to [Stun] a unit." and "While there's
  // a stunned enemy unit here, I have +2 M." Attacking B he stuns their 4: 4 vs a stunned 4, he survives and conquers.
  const wall = { card: { n: "Wall 4", t: "Unit", m: 4, x: "", token: true }, side: 1, at: 1, ready: true };
  const pos = (n) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Order", n), units: [U("Stalwart Poro", 0, 0), U("Kennen, Keeper of Balance", 0, -1), wall] });
  const r = solveTurn(pos(2));
  ok("51. Kennen stuns their 4 as he attacks and has +2: win", r.win, show(r));
  ok("51b. no Energy for the stun: no win", !solveTurn(pos(0)).win);
}

{
  // 52-60. Triggers and costs read on 23 Nov (batch 6). Their N-Might unit holds B unless said otherwise.
  const wall = (m, at = 1) => ({ card: { n: `Wall ${m}`, t: "Unit", m, x: "", token: true }, side: 1, at, ready: true });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 52. Imperial Decree: any unit dealt damage this turn dies. Hextech Ray's 3 kills their 8.
  const p52 = (hand) => P({ runes: [...R("Order", 7), ...R("Fury", 2)], hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), wall(8)] });
  ok("52. Hextech Ray alone: 3 into an 8, no win", !solveTurn(p52([C("Hextech Ray")])).win);
  const r52 = solveTurn(p52([C("Imperial Decree"), C("Hextech Ray")]));
  ok("52b. Imperial Decree, then the Ray kills it: win", r52.win, show(r52));
  // 53. Mask of Foresight: a lone attacker gets +1. 2 vs 2 trades; 3 vs 2 conquers.
  const p53 = (gear) => P({ gear, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), wall(2)] });
  ok("53. no Mask: trade, no win", !solveTurn(p53([])).win);
  ok("53b. Mask of Foresight: the lone Poro is 3: win", solveTurn(p53([C("Mask of Foresight")])).win);
  // 54. Pit Crew: "When you play a gear, ready me." Exhausted at base, readied by Banner of Conquest, it walks into an empty B.
  const p54 = (hand) => P({ runes: R("Fury", 2), hand, units: [U("Stalwart Poro", 0, 0), U("Pit Crew", 0, -1, false)] });
  ok("54. no gear to play: Pit Crew stays exhausted, no win", !solveTurn(p54([])).win);
  const r54 = solveTurn(p54([C("Banner of Conquest")]));
  ok("54b. a gear readies Pit Crew, it takes B: win", r54.win, show(r54));
  // 55. Ember Monk: "When you play a card from [Hidden], +2 M." A face-down Bedeviling Stranger at A plays free: Monk 6 vs 5.
  const p55 = (down) => P({ down, units: [U("Stalwart Poro", 0, 0), U("Ember Monk", 0, -1), wall(5)] });
  ok("55. Monk 4 vs 5: no win", !solveTurn(p55([[[], []], [[], []]])).win);
  const r55 = solveTurn(p55([[[C("Bedeviling Stranger")], []], [[], []]]));
  ok("55b. a face-down play first: Monk 6 vs 5: win", r55.win, show(r55));
  // 56. Lillia, Fae Fawn ganks A → B (Portable Portal at A) and leaves a Sprite at A. A cleanup falls between the move and
  // her trigger (rules.md "cleanups fall between the FEPR steps"), so A is lost first (§323.5); A was already scored.
  const r56 = solveTurn(P({ gear: [C("Portable Portal")], gearAt: [0], units: [U("Lillia, Fae Fawn", 0, 0)] }));
  ok("56. Lillia takes B and leaves a Sprite at A: win", r56.win && r56.line.some((l) => /Sprite token to A/.test(l)), show(r56));
  // 57. Vex, Mocking: stun their unit at B (Back Off) and Vex, exhausted at base, moves there and wins the fight.
  const p57 = (hand) => P({ runes: R("Calm", 3), hand, units: [U("Stalwart Poro", 0, 0), U("Vex, Mocking", 0, -1, false), wall(2)] });
  ok("57. no stun: Vex can't move, no win", !solveTurn(p57([])).win);
  const r57 = solveTurn(p57([C("Back Off")]));
  ok("57b. Back Off stuns it, Vex moves to B and takes it: win", r57.win, show(r57));
  // 58. Riven, Deserter: "Exhaust a friendly unit: Ready a unit." Exhaust the Poro at base, ready the Mega-Mech (8 vs 6).
  const p58 = (holder) => P({ units: [U(holder, 0, 0), U("Stalwart Poro", 0, -1), U("Mega-Mech", 0, -1, false), wall(6)] });
  ok("58. a Poro holds A instead of Riven: no win", !solveTurn(p58("Stalwart Poro")).win);
  const r58 = solveTurn(p58("Riven, Deserter"));
  ok("58b. Riven exhausts a friendly unit (himself, holding A, is legal), readies the Mega-Mech: win", r58.win && r58.line.some((l) => /Riven, Deserter: Ready a unit/.test(l)), show(r58));
  // 60. Divining Shells: "Kill this, {T}: Give a unit +2 M this turn." A Poro (2) beats a 3 with it.
  const p60 = (gear) => P({ gear, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), wall(3)] });
  ok("60. no Shells: no win", !solveTurn(p60([])).win);
  const r60 = solveTurn(p60([C("Divining Shells")]));
  ok("60b. Shells killed for +2: win", r60.win, show(r60));
  // 61. The Good Stuff at A returns to hand when A is held.
  ok("61. The Good Stuff returns on the hold", solveTurn(P({ gear: [C("The Good Stuff")], gearAt: [0], units: [U("Stalwart Poro", 0, 0)] })).line.some((l) => /The Good Stuff returns/.test(l)));
}

{
  // 62-68. One-offs read on 23 Nov (batch 7).
  const tok = (n, m, side, at, ready = true, g = []) => ({ card: { n, t: "Unit", m, x: "", token: true, g }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 62. Vilemaw: enemy units here with less Might than him deal no combat damage. Into two 4s at B, he kills both and lives.
  const p62 = (who) => P({ units: [U("Stalwart Poro", 0, 0), who, tok("Wall 4", 4, 1, 1), tok("Wall 4", 4, 1, 1)] });
  ok("62. a plain 8 into two 4s: trade, no win", !solveTurn(p62(tok("Big 8", 8, 0, -1))).win);
  const r62 = solveTurn(p62(U("Vilemaw", 0, -1)));
  ok("62b. Vilemaw (8): the 4s deal nothing, he takes B: win", r62.win, show(r62));
  // 63. Ekko, Revolutionary: discard 1, [e1]{Fury}: banished and played again at base, and he enters ready. Exhausted at A,
  // he comes back ready and walks into an empty B.
  const p63 = (hand) => P({ runes: R("Fury", 2), hand, units: [U("Stalwart Poro", 0, 0), U("Ekko, Revolutionary", 0, 0, false)] });
  ok("63. nothing to discard: no win", !solveTurn(p63([])).win);
  const r63 = solveTurn(p63([C("Stalwart Poro")]));
  ok("63b. Ekko re-enters ready, takes B: win", r63.win && r63.line.some((l) => /banished and played again at base/.test(l)), show(r63));
  // 64. Zed, Without a Sound swaps with a ready Shadow Clone holding A; the Clone, now at base, walks into an empty B.
  const clone = () => tok("Shadow Clone token", 2, 0, 0, true, ["Shadow Clone"]);
  const p64 = (who) => P({ runes: R("Chaos", 2), units: [clone(), who] });
  ok("64. a Poro instead of Zed: the Clone can't reach B, no win", !solveTurn(p64(U("Stalwart Poro", 0, -1, false))).win);
  const r64 = solveTurn(p64(U("Zed, Without a Sound", 0, -1, false)));
  ok("64b. Zed swaps, the Clone takes B: win", r64.win, show(r64));
  // 65. Demon Shade moves an exhausted unit onto an open battlefield (§170.11.c): B is open, the Poro conquers it.
  const p65 = (hand) => P({ ctrl: [0, null], runes: R("Chaos", 3), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1, false)] });
  ok("65. no Demon Shade: no win", !solveTurn(p65([])).win);
  const r65 = solveTurn(p65([C("Demon Shade")]));
  ok("65b. Demon Shade moves it to open B: win", r65.win, show(r65));
  // 66. Bone Skewer (a unit from their hand, played stunned to the chosen battlefield) and Here to Help (a unit straight to a
  // battlefield we hold, [e3] less) are read; neither changes a closing line on these boards, so this checks the reading only.
  ok("66. read: Bone Skewer, Here to Help", turnReads(C("Bone Skewer")) && turnReads(C("Here to Help")));
  // 67. Nami, Headstrong: on her hold, the next unit we play enters ready and buffed: a Poro from hand walks into an empty B.
  const p67 = (holder) => P({ runes: R("Calm", 2), hand: [C("Stalwart Poro")], units: [U(holder, 0, 0)] });
  ok("67. a Poro holds A instead of Nami: the new Poro is exhausted, no win", !solveTurn(p67("Stalwart Poro")).win);
  const r67 = solveTurn(p67("Nami, Headstrong"));
  ok("67b. Nami holds A, the next Poro enters ready: win", r67.win, show(r67));
}

{
  // 68-75. One-offs read on 23 Nov (batch 8).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 68. Hostile Takeover: their only unit at B becomes ours, so B is ours (§348.2.a): a conquest.
  const p68 = (hand) => P({ runes: R("Mind", 8), hand, units: [U("Stalwart Poro", 0, 0), tok("Wall 5", 5, 1, 1)] });
  ok("68. no takeover: no win", !solveTurn(p68([])).win);
  const r68 = solveTurn(p68([C("Hostile Takeover")]));
  ok("68b. Hostile Takeover takes their unit at B: win", r68.win && r68.line.some((l) => /take control/.test(l)), show(r68));
  // 69. Fox-Fire: their two 2s at B total 4, both die; a Poro walks in.
  const p69 = (hand) => P({ runes: R("Calm", 3), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), tok("Wall 2", 2, 1, 1)] });
  ok("69. no Fox-Fire: no win", !solveTurn(p69([])).win);
  ok("69b. Fox-Fire clears B: win", solveTurn(p69([C("Fox-Fire")])).win);
  // 70. Zenith Blade: stun their 3 at B, then move our exhausted Mega-Mech there (an effect move needs no ready unit).
  const p70 = (hand) => P({ runes: R("Calm", 5), hand, units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), tok("Wall 3", 3, 1, 1)] });
  ok("70. no Zenith Blade: no win", !solveTurn(p70([])).win);
  const r70 = solveTurn(p70([C("Zenith Blade")]));
  ok("70b. Zenith Blade stuns and moves the Mega-Mech in: win", r70.win, show(r70));
  // 71. Stormbringer: the Mega-Mech in base deals 8 to every enemy at B, then moves there.
  const p71 = (hand) => P({ runes: R("Fury", 8), hand, units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), tok("Wall 7", 7, 1, 1)] });
  ok("71. no Stormbringer: no win", !solveTurn(p71([])).win);
  const r71 = solveTurn(p71([C("Stormbringer")]));
  ok("71b. Stormbringer clears B and moves in: win", r71.win, show(r71));
  // 72. Renata Glasc: our tokens enter ready. Recruit the Vanguard's Recruits walk into an empty B.
  const p72 = (holder) => P({ runes: R("Order", 6), hand: [C("Recruit the Vanguard")], units: [U(holder, 0, 0)] });
  ok("72. no Renata: the Recruits are exhausted, no win", !solveTurn(p72("Stalwart Poro")).win);
  const r72 = solveTurn(p72("Renata Glasc, Industrialist"));
  ok("72b. Renata: a ready Recruit takes B: win", r72.win, show(r72));
  // 73. Atakhan: on his attack they kill one of their units there (their weakest); 7 then beats the other 4.
  const p73 = (who) => P({ units: [U("Stalwart Poro", 0, 0), who, tok("Wall 4", 4, 1, 1), tok("Wall 4", 4, 1, 1)] });
  ok("73. a plain 7 into two 4s: no win", !solveTurn(p73(tok("Big 7", 7, 0, -1))).win);
  const r73 = solveTurn(p73(U("Atakhan", 0, -1)));
  ok("73b. Atakhan: they lose one, he takes B: win", r73.win, show(r73));
  // 74. Cataclysm: their spells are locked, face-down ones too, so their Switcheroo at B can't answer Sivir.
  const p74 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 1, 1)], champ: C("Sivir, Mercenary"), runes: [...runes(4, 2), ...R("Body", 5)], hand, down: [[[], []], [[], [C("Switcheroo")]]] });
  ok("74. their face-down Switcheroo: no win", !solveTurn(p74([])).win);
  const r74 = solveTurn(p74([C("Cataclysm")]));
  ok("74b. Cataclysm locks their spells and moves Sivir into B: win", r74.win, show(r74));
  // 75. Annie, Fiery: our spell damage +1. Hextech Ray deals 4 and kills their 4.
  const p75 = (holder) => P({ runes: R("Fury", 2), hand: [C("Hextech Ray")], units: [U(holder, 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 4", 4, 1, 1)] });
  ok("75. no Annie: 3 into a 4, no win", !solveTurn(p75("Stalwart Poro")).win);
  const r75 = solveTurn(p75("Annie, Fiery"));
  ok("75b. Annie: the Ray deals 4: win", r75.win, show(r75));
  ok("76. read: Yasuo, Windrider (third move scores), Fight or Flight, Mindsplitter, Jhin", ["Yasuo, Windrider", "Fight or Flight", "Mindsplitter", "Jhin, Meticulous Killer"].every((n) => turnReads(C(n))));
}

{
  // 77-86. One-offs read on 23 Nov (batch 9).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 77. Public Execution: choose our Mega-Mech; kill an enemy with less Might (their 6 at B); a Poro walks in.
  // Public Execution is Body/Order: its [C] Power is paid with either (§135.2.e.6.c), so Order runes alone do.
  const p77 = (big) => P({ runes: R("Order", 3), hand: [C("Public Execution")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U(big, 0, -1, false), tok("Wall 6", 6, 1, 1)] });
  ok("77. only Poros to choose: nothing smaller than 2 to kill, no win", !solveTurn(p77("Stalwart Poro")).win);
  ok("77b. the Mega-Mech: their 6 dies: win", solveTurn(p77("Mega-Mech")).win);
  // 78. Leona, Zealot: stunned enemy units at her battlefield have -8 (min 1). Back Off stuns their 9; Leona (6) beats a 1.
  const p78 = (who) => P({ runes: R("Calm", 3), hand: [C("Back Off")], units: [U("Stalwart Poro", 0, 0), who, tok("Wall 9", 9, 1, 1)] });
  ok("78. a plain 6 into a stunned 9: no win", !solveTurn(p78(tok("Six", 6, 0, -1))).win);
  const r78 = solveTurn(p78(U("Leona, Zealot", 0, -1)));
  ok("78b. Leona: the stunned 9 is 1: win", r78.win, show(r78));
  // 79. Magma Wurm: other friendly units enter ready. A Poro from hand walks into an empty B.
  const p79 = (holder) => P({ runes: R("Calm", 2), hand: [C("Stalwart Poro")], units: [U(holder, 0, 0)] });
  ok("79. no Wurm: no win", !solveTurn(p79("Stalwart Poro")).win);
  ok("79b. Magma Wurm holds A: the new Poro is ready: win", solveTurn(p79("Magma Wurm")).win);
  // 80. Last Breath: ready our exhausted Mega-Mech; it deals 8 to their 7 at B, then walks in.
  const p80 = (hand) => P({ runes: R("Calm", 5), hand, units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), tok("Wall 7", 7, 1, 1)] });
  ok("80. no Last Breath: no win", !solveTurn(p80([])).win);
  ok("80b. Last Breath: win", solveTurn(p80([C("Last Breath")])).win);
  // 81. Bullet Time: pay 2 Power, 2 to every enemy at B: their two 2s die.
  const p81 = (hand) => P({ runes: R("Chaos", 4), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), tok("Wall 2", 2, 1, 1)] });
  ok("81. no Bullet Time: no win", !solveTurn(p81([])).win);
  ok("81b. Bullet Time for 2: win", solveTurn(p81([C("Bullet Time")])).win);
  // 82. Draven, Showboat: his Might is increased by our points (6): 9 beats their 8.
  const p82 = (who) => P({ units: [U("Stalwart Poro", 0, 0), who, tok("Wall 8", 8, 1, 1)] });
  ok("82. a plain 3: no win", !solveTurn(p82(tok("Three", 3, 0, -1))).win);
  ok("82b. Draven at 6 points is 9: win", solveTurn(p82(U("Draven, Showboat", 0, -1))).win);
  // 83. Warwick, Hunter: on attack, every damaged enemy there dies. Hextech Ray (3) into their 10, then Warwick.
  const p83 = (who) => P({ runes: R("Fury", 2), hand: [C("Hextech Ray")], units: [U("Stalwart Poro", 0, 0), who, tok("Wall 10", 10, 1, 1)] });
  ok("83. a plain 5 after the Ray: 8 of 10, no win", !solveTurn(p83(tok("Five", 5, 0, -1))).win);
  const r83 = solveTurn(p83(U("Warwick, Hunter", 0, -1)));
  ok("83b. Warwick kills the damaged 10: win", r83.win, show(r83));
  // 84. Arachnoid Horror: played straight to a battlefield where an enemy unit is alone. Two enemies there: no.
  const p84 = (foes) => P({ runes: R("Body", 7), hand: [C("Arachnoid Horror")], units: [U("Stalwart Poro", 0, 0), ...foes] });
  ok("84. two enemies at B: can't be played there, no win", !solveTurn(p84([tok("Wall 2", 2, 1, 1), tok("Wall 2", 2, 1, 1)])).win);
  const r84 = solveTurn(p84([tok("Wall 4", 4, 1, 1)]));
  ok("84b. their 4 is alone: Horror (6) is played into B: win", r84.win, show(r84));
  // 85. Fiora, Peerless: one on one, her Might doubles (3 → 6) and beats their lone 5. With a second enemy there, no.
  const p85 = (foes) => P({ units: [U("Stalwart Poro", 0, 0), U("Fiora, Peerless", 0, -1), ...foes] });
  ok("85. their 5 and a 1: not one on one, no win", !solveTurn(p85([tok("Wall 5", 5, 1, 1), tok("Wall 1", 1, 1, 1)])).win);
  const r85 = solveTurn(p85([tok("Wall 5", 5, 1, 1)]));
  ok("85b. one on one: 6 vs 5: win", r85.win, show(r85));
  // 86. Renata Glasc, Mastermind: "[e4]{Mind}x4, {T}: Score 1 point", only while at a battlefield.
  const p86 = (at) => P({ ctrl: [0, 1], runes: R("Mind", 8), units: [U("Stalwart Poro", 0, 0), U("Renata Glasc, Mastermind", 0, at, at >= 0)] });
  ok("86. Renata exhausted at base: no point, no win", !solveTurn(p86(-1)).win);
  const r86 = solveTurn(p86(0));
  ok("86b. Renata at A: hold to 7, score 1: win", r86.win, show(r86));
}

{
  // 87-92. Batch 10.
  const tok = (n, m, side, at, ready = true, g = []) => ({ card: { n, t: "Unit", m, x: "", token: true, g }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 87. Corrupted Dragon: on attack, their units there with 5 M or less go to base. Their 6 and 5: the 5 leaves, 10 beats 6.
  const p87 = (who) => P({ units: [U("Stalwart Poro", 0, 0), who, tok("Wall 6", 6, 1, 1), tok("Wall 5", 5, 1, 1)] });
  ok("87. a plain 10 into 6 + 5: no win", !solveTurn(p87(tok("Ten", 10, 0, -1))).win);
  const r87 = solveTurn(p87(U("Corrupted Dragon", 0, -1)));
  ok("87b. Corrupted Dragon sends the 5 home and beats the 6: win", r87.win, show(r87));
  // 88. Draven, Audacious: the first combat he wins each turn scores 1. From 6 with nothing held: conquer B (7) + 1 = 8.
  const p88 = (who) => ({ score: [6, 5], ctrl: [null, 1], beginning: true, runes: [], units: [who, tok("Wall 3", 3, 1, 1)] });
  ok("88. a plain 6 conquers B: 7, no win", !solveTurn(p88(tok("Six", 6, 0, -1))).win);
  const r88 = solveTurn(p88(U("Draven, Audacious", 0, -1)));
  ok("88b. Draven wins the fight: +1, 8: win", r88.win, show(r88));
  // 89. Ivern, Friend to All takes the tag we lack; holding A with Bird, Cat and Dog on board, all four: hold (7) + 1 = 8.
  const pets = (...gs) => gs.map((g) => tok(`${g} token`, 1, 0, -1, false, [g]));   // exhausted: they only lend their tags
  const p89 = (gs) => P({ ctrl: [0, 1], units: [U("Ivern, Friend to All", 0, 0), ...pets(...gs)] });
  ok("89. Bird and Cat only (three with Ivern): 7, no win", !solveTurn(p89(["Bird", "Cat"])).win);
  const r89 = solveTurn(p89(["Bird", "Cat", "Dog"]));
  ok("89b. Bird, Cat, Dog and Ivern's Poro: hold scores 1 more: win", r89.win, show(r89));
  // 90. Raging Firebrand: the next spell costs [e5] less. He enters base; Stormbringer (6 → 1) uses him: 4 to their 4, he moves in.
  const plainFirebrand = { ...C("Raging Firebrand"), n: "Plain Firebrand", x: "" };
  const p90 = (f) => P({ runes: R("Fury", 7), hand: [f, C("Stormbringer")], units: [U("Stalwart Poro", 0, 0), tok("Wall 4", 4, 1, 1)] });
  ok("90. without the discount Stormbringer is out of reach: no win", !solveTurn(p90(plainFirebrand)).win);
  const r90 = solveTurn(p90(C("Raging Firebrand")));
  ok("90b. Raging Firebrand, then a cheap Stormbringer: win", r90.win, show(r90));
  // 91. Vi, Hotheaded: "[e2]{Fury}: Double my M this turn." 3 → 6 beats their 5.
  const p91 = (n) => P({ runes: R("Fury", n), units: [U("Stalwart Poro", 0, 0), U("Vi, Hotheaded", 0, -1), tok("Wall 5", 5, 1, 1)] });
  ok("91. no runes: 3 vs 5, no win", !solveTurn(p91(0)).win);
  ok("91b. Vi doubles to 6: win", solveTurn(p91(3)).win);
  ok("92. read: Tianna Crownguard, Swain, Visionary, Noxus Saboteur, Monch, Udyr, Wildman, Strike Down", ["Tianna Crownguard", "Swain, Visionary", "Noxus Saboteur", "Monch", "Udyr, Wildman", "Strike Down"].every((n) => turnReads(C(n))));
}

{
  // 93-99. Batch 11.
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 93. Temptation: their unit at B moves to a location where they have another unit (their base), so B opens.
  const p93 = (hand) => P({ runes: R("Chaos", 2), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 4", 4, 1, 1), tok("Spare", 1, 1, -1)] });
  ok("93. no Temptation: no win", !solveTurn(p93([])).win);
  ok("93b. Temptation sends their 4 home: a Poro takes B: win", solveTurn(p93([C("Temptation")])).win);
  // 94. Tricksy Tentacles: their 4 + 4 at B (total 8) go to their base.
  const p94 = (hand) => P({ runes: R("Calm", 5), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 4", 4, 1, 1), tok("Wall 4", 4, 1, 1)] });
  ok("94. no Tentacles: no win", !solveTurn(p94([])).win);
  ok("94b. Tricksy Tentacles clears B: win", solveTurn(p94([C("Tricksy Tentacles")])).win);
  // 95. Kog'Maw, Caustic dies attacking their 3 at B; his Deathknell deals 4 to every unit there; a Poro then takes B.
  const p95 = (who) => P({ units: [U("Stalwart Poro", 0, 0), who, U("Stalwart Poro", 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("95. a plain 1 dies, their 3 lives: no win", !solveTurn(p95(tok("One", 1, 0, -1))).win);
  const r95 = solveTurn(p95(U("Kog'Maw, Caustic", 0, -1)));
  ok("95b. Kog'Maw's Deathknell clears B, the Poro walks in: win", r95.win, show(r95));
  // 96. Decree of Rage: 4 to an enemy Calm unit. Their Stalwart Poro (Calm) dies; a plain 2 isn't Calm, so it stays.
  const p96 = (foe) => P({ runes: R("Fury", 2), hand: [C("Decree of Rage")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), foe] });
  ok("96. their plain 2 isn't Calm: no target, trade, no win", !solveTurn(p96(tok("Two", 2, 1, 1))).win);
  ok("96b. their Calm Poro dies to the Decree: win", solveTurn(p96(U("Stalwart Poro", 1, 1))).win);
  // 97. Angle Shot attaches our Boots (they equip for {Chaos}; we have only Fury) to the Poro at A: Ganking, into B.
  const p97 = (hand) => P({ runes: R("Fury", 2), hand, gear: [C("Boots of Swiftness")], units: [U("Stalwart Poro", 0, 0)] });
  ok("97. no Chaos for the equip: no win", !solveTurn(p97([])).win);
  const r97 = solveTurn(p97([C("Angle Shot")]));
  ok("97b. Angle Shot attaches the Boots for free: win", r97.win, show(r97));
  // 98. Bottled Constellation: at the start of our Main Phase, kill 3 other units/gear to score 1. Hold A (7) + 1.
  const p98 = (gear) => P({ gear, units: [U("Stalwart Poro", 0, 0), tok("One", 1, 0, -1, false), tok("One", 1, 0, -1, false), tok("One", 1, 0, -1, false), tok("Wall 9", 9, 1, 1)] });
  ok("98. no Constellation: 7, no win", !solveTurn(p98([])).win);
  const r98 = solveTurn(p98([C("Bottled Constellation")]));
  ok("98b. Bottled Constellation scores 1: win", r98.win, show(r98));
  // 99. Possession: take their 9 at B and recall it: B is empty (not conquered); a Poro then walks in.
  const p99 = (hand) => P({ runes: R("Chaos", 11), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 9", 9, 1, 1)] });
  ok("99. no Possession: no win", !solveTurn(p99([])).win);
  const r99 = solveTurn(p99([C("Possession")]));
  ok("99b. Possession empties B, a Poro takes it: win", r99.win && !r99.line.some((l) => /take control[^]*conquer B/.test(l)), show(r99));
  ok("100. read: Lucian, Gunslinger, Noxian Guillotine, Stare Down, Mistfall, Crescent Guardian, Siphon Power", ["Lucian, Gunslinger", "Noxian Guillotine", "Stare Down", "Mistfall", "Crescent Guardian", "Siphon Power"].every((n) => turnReads(C(n))));
}

{
  // 101-106. Batch 12, the last one-offs.
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 101. Rell, Magnetic: on attack, an Equipment of cost ≤ 2 from hand, free, attached: Doran's Blade makes her 6 vs their 5.
  const p101 = (hand) => P({ hand, units: [U("Stalwart Poro", 0, 0), U("Rell, Magnetic", 0, -1), tok("Wall 5", 5, 1, 1)] });
  ok("101. no Equipment in hand: 4 vs 5, no win", !solveTurn(p101([])).win);
  const r101 = solveTurn(p101([C("Doran's Blade")]));
  ok("101b. Rell attaches Doran's Blade as she attacks: win", r101.win, show(r101));
  // 102. Kha'Zix, Evolving Hunter: on attack, spend 3 XP to deal his Might (5) to an enemy there: their 5 dies, he beats the 3.
  const p102 = (xp) => P({ xp, units: [U("Stalwart Poro", 0, 0), U("Kha'Zix, Evolving Hunter", 0, -1), tok("Wall 5", 5, 1, 1), tok("Wall 3", 3, 1, 1)] });
  ok("102. no XP: 5 vs 5 + 3, no win", !solveTurn(p102(0)).win);
  const r102 = solveTurn(p102(3));
  ok("102b. 3 XP spent: win", r102.win, show(r102));
  // 103. Marching Orders: our exhausted Mega-Mech (8) and their 7 at B deal their Might to each other; a Poro walks in.
  const p103 = (hand) => P({ runes: R("Body", 3), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Mega-Mech", 0, -1, false), tok("Wall 7", 7, 1, 1)] });
  ok("103. no Marching Orders: no win", !solveTurn(p103([])).win);
  ok("103b. Marching Orders: their 7 dies: win", solveTurn(p103([C("Marching Orders")])).win);
  // 104. Cataclysmic Duel: each player keeps one unit. We keep the Poro at base; they keep their 9 (at their base); their 2 at
  // B dies, and the Poro walks in. (A was held at the start of the turn, so its Poro dying costs nothing.)
  const p104 = (hand) => P({ runes: R("Body", 11), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), tok("Big 9", 9, 1, -1)] });
  ok("104. no Duel: the Poro trades with their 2, no win", !solveTurn(p104([])).win);
  const r104 = solveTurn(p104([C("Cataclysmic Duel")]));
  ok("104b. Cataclysmic Duel: win", r104.win, show(r104));
  // 105. Maduli the Gatekeeper (exhausted; it can't be readied): {Chaos} moves it to an enemy battlefield weaker than it.
  const p105 = (n) => P({ runes: R("Chaos", n), units: [U("Stalwart Poro", 0, 0), U("Maduli the Gatekeeper", 0, -1, false), tok("Wall 4", 4, 1, 1)] });
  ok("105. no Chaos: no win", !solveTurn(p105(0)).win);
  const r105 = solveTurn(p105(1));
  ok("105b. Maduli moves into B (6 > 4) and takes it: win", r105.win, show(r105));
  // 106. Last Stand: double a friendly unit's Might: a Poro (2 → 4) beats their 3.
  const p106 = (hand) => P({ runes: R("Calm", 4), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("106. no Last Stand: no win", !solveTurn(p106([])).win);
  ok("106b. Last Stand: 4 vs 3: win", solveTurn(p106([C("Last Stand")])).win);
}

{
  // 107-108. Feature 1: spells inside fights.
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  // 107. Their Defy counters our Discipline in the fight at B (a Poro, 2 + 2, would beat their 3); our Defy answers theirs.
  const p107 = (ourHand, their) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [...R("Calm", 4)], hand: ourHand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 3", 3, 1, 1)], their });
  const r107 = solveTurn(p107([C("Discipline")], { hand: [], budget: { e: 0, p: 0 } }));
  ok("107. Discipline in the fight at B: 4 vs 3: win", r107.win, show(r107));
  ok("107b. their Defy held up counters it: no win", !solveTurn(p107([C("Discipline")], { hand: [C("Defy")], budget: { e: 1, p: 1 } })).win);
  // A 4 beats their 3 alone; their Discipline (3 + 2) would hold B; our Defy counters it.
  const p107c = (ourHand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Calm", 4), hand: ourHand, units: [U("Stalwart Poro", 0, 0), tok("Four", 4, 0, -1), tok("Wall 3", 3, 1, 1)], their: { hand: [C("Discipline")], budget: { e: 2, p: 0 } } });
  ok("107c. their Discipline holds B against our 4: no win", !solveTurn(p107c([])).win);
  const r107c = solveTurn(p107c([C("Defy")]));
  ok("107d. our Defy counters it: win", r107c.win, show(r107c));
  // 108. Fallen Feline (at A) named Switcheroo: their face-down Switcheroo at B can't be played, so Sivir takes B (test 5b's breaker).
  const p108 = (names) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, units: [U("Fallen Feline", 0, 0), U("Stalwart Poro", 1, 1)], champ: sivir, runes: runes(4, 2), down: [[[], []], [[], [C("Switcheroo")]]], felineNames: names });
  ok("108. Feline named nothing: their Switcheroo stops Sivir: no win", !solveTurn(p108([])).win);
  const r108 = solveTurn(p108(["Switcheroo"]));
  ok("108b. Feline named Switcheroo: win", r108.win, show(r108));
}

{
  // 109-111. Feature 2: combat internals.
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  // 109. Sivir, Ambitious conquers B (7 into their 2: 5 excess) and deals 5 to their 4 at A; a Poro then takes A. 6 → 7 → 8.
  const p109 = (who) => ({ score: [6, 5], ctrl: [1, 1], beginning: true, runes: [], units: [who, U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), tok("Wall 4", 4, 1, 0)] });
  ok("109. a plain 7 takes B; the Poro can't beat their 4 at A: no win", !solveTurn(p109(tok("Seven", 7, 0, -1))).win);
  const r109 = solveTurn(p109(U("Sivir, Ambitious", 0, -1)));
  ok("109b. Sivir, Ambitious's 5 excess kills their 4 at A; the Poro takes A: win", r109.win && r109.line.some((l) => /excess damage/.test(l)), show(r109));
  // 110. Ava Achiever attacks B (their 7) and pays {Mind} to play Momentary Companion (Hidden, 4) into the attack: 8 vs 7.
  const p110 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Mind", 1), hand, units: [U("Stalwart Poro", 0, 0), U("Ava Achiever", 0, -1), tok("Wall 7", 7, 1, 1)] });
  ok("110. Ava alone: 4 vs 7, no win", !solveTurn(p110([])).win);
  const r110 = solveTurn(p110([C("Momentary Companion")]));
  ok("110b. Ava plays her Hidden Companion into the attack: win", r110.win, show(r110));
  // 111. Stalking Wolf: its additional cost kills our Poro at A, and it may go straight to A ("even if you don't have other units there").
  const r111 = solveTurn({ score: [3, 5], ctrl: [0, 1], beginning: true, runes: R("Order", 5), hand: [C("Stalking Wolf")], units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false)] });
  ok("111. read: Stalking Wolf (played by killing a pet), Soraka, Kayn, Dune Surfer", ["Stalking Wolf", "Soraka, Wanderer", "Kayn, Unleashed", "Dune Surfer", "Ava Achiever", "Sivir, Ambitious"].every((n) => turnReads(C(n))) && !!r111);
}

{
  // 112-116. Feature 3: legends on the board (pos.legend: { card, ready, empowered }).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const monk = (ready) => ({ card: C("Blind Monk"), ready });
  // 112. Heartening Soul readies our exhausted legend, which now has "{T}: Give a unit +3 M this turn": a Poro (2 → 5) beats their 4.
  const p112 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Calm", 8), hand, legend: monk(false), units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 4", 4, 1, 1)] });
  ok("112. legend exhausted, no Soul: no win", !solveTurn(p112([])).win);
  const r112 = solveTurn(p112([C("Heartening Soul")]));
  ok("112b. Heartening Soul readies the legend; its +3 wins B: win", r112.win && r112.line.some((l) => /Heartening Soul\)|\+3/.test(l)), show(r112));
  // 113. Royal Entourage readies an exhausted Blind Monk, whose "[e1], {T}: Buff a friendly unit" makes a Poro 3 vs their 2.
  const p113 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Calm", 5), hand, legend: monk(false), units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1)] });
  ok("113. Monk exhausted: 2 vs 2, no win", !solveTurn(p113([])).win);
  const r113 = solveTurn(p113([C("Royal Entourage")]));
  ok("113b. Royal Entourage readies Monk; the buff wins B: win", r113.win, show(r113));
  ok("113c. a ready Blind Monk is used on its own: win", solveTurn({ ...p113([]), legend: monk(true) }).win);
  // 114. Bard, Mercurial: exhaust our legend as the additional cost; then any number of our units move to an open battlefield.
  const p114 = (ready) => ({ score: [6, 5], ctrl: [0, null], beginning: true, runes: R("Mind", 5), hand: [C("Bard, Mercurial")], legend: monk(ready), units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1, false)] });
  ok("114. legend already exhausted: no cost to pay, no move, no win", !solveTurn(p114(false)).win);
  const r114 = solveTurn(p114(true));
  ok("114b. Bard exhausts the legend and moves the Poro to open B: win", r114.win, show(r114));
  // 115. Profiteer: disempower our Empowered token to empower Mournful Witness ([Empowered] +2; it can only empower itself
  // after a combat), which then beats their 3.
  const p115 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Body", 5), hand, units: [{ ...tok("Charged", 1, 0, 0), empowered: 1 }, U("Mournful Witness", 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("115. Witness (2) into their 3: no win", !solveTurn(p115([])).win);
  const r115 = solveTurn(p115([C("Profiteer")]));
  ok("115b. Profiteer moves Empowered to the Witness (+2): win", r115.win, show(r115));
  ok("116. read: Heartening Soul, Royal Entourage, Bard, Mercurial, Profiteer", ["Heartening Soul", "Royal Entourage", "Bard, Mercurial", "Profiteer"].every((n) => turnReads(C(n))));
}

{
  // 117-120. Feature 4: gear Empowered status (pos.gearEmpowered, index-aligned with pos.gear).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  const units = () => [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 3", 3, 1, 1)];
  // 117. "Your units have +2 M" (Ephemeral Ward): every unit we control. Until 24 Nov "unit" was read as a tag and gave nothing.
  ok("117. no Ward: 2 vs 3, no win", !solveTurn(P({ units: units() })).win);
  ok("117b. Ephemeral Ward: 4 vs 3: win", solveTurn(P({ units: units(), gear: [C("Ephemeral Ward")] })).win);
  // 118. Rage Amplifier: +1, or +2 while Empowered. +1 makes a Poro 3 (a trade with their 3); +2 makes it 4.
  const amp = (emp, runes = []) => P({ runes, units: units(), gear: [C("Rage Amplifier")], gearEmpowered: [emp] });
  ok("118. Amplifier not Empowered: 3 vs 3, no win", !solveTurn(amp(false)).win);
  ok("118b. Amplifier Empowered: 4 vs 3: win", solveTurn(amp(true)).win);
  const r118 = solveTurn(amp(false, R("Fury", 7)));
  ok("118c. its own [Empower] [e6]{Fury} this turn: win", r118.win && r118.line.some((l) => /Rage Amplifier is Empowered/.test(l)), show(r118));
  // 119. Hextech Disc: "Disempower this, [e1], {T}: Play a 3 M Mech unit token to your base." With Renata Glasc (our tokens
  // enter ready) the Mech walks into an empty B. Not Empowered, the Disc can't pay it.
  const disc = (emp) => P({ runes: R("Body", 1), units: [U("Renata Glasc, Industrialist", 0, 0)], gear: [C("Hextech Disc")], gearEmpowered: [emp] });
  ok("119. Disc not Empowered: no Mech, no win", !solveTurn(disc(false)).win);
  const r119 = solveTurn(disc(true));
  ok("119b. Disc Empowered: a ready Mech takes B: win", r119.win, show(r119));
  // 120. Helm of Suppression Empowered: their spells cost [e1]{A} more. Their Discipline (2) with 3 Energy and no Power: payable
  // under the plain tax (3), not under the Empowered one (3 + {A}).
  const helm = (emp) => P({ units: [U("Stalwart Poro", 0, 0), tok("Four", 4, 0, -1), tok("Wall 3", 3, 1, 1)], gear: [C("Helm of Suppression")], gearEmpowered: [emp], their: { hand: [C("Discipline")], budget: { e: 3, p: 0 } } });
  ok("120. Helm not Empowered: their Discipline (3 Energy) holds B: no win", !solveTurn(helm(false)).win);
  ok("120b. Helm Empowered: they can't pay the {A}: win", solveTurn(helm(true)).win);
}

{
  // 121-125. Feature 5: the opponent's own choices (theirPick: the option worst for us, by our best continuation).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  // 121. Angler Wyrm ({T}): they must move a unit to its battlefield (A). Their lone 4 at B goes, attacks the Wyrm and dies;
  // B opens and a Poro takes it. With a spare unit at their base, they send that instead.
  const p121 = (spare) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [U("Angler Wyrm", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 4", 4, 1, 1), ...(spare ? [tok("Spare", 1, 1, -1)] : [])] });
  const r121 = solveTurn(p121(false));
  ok("121. Angler Wyrm drags their only unit off B: win", r121.win && r121.line.some((l) => /they move Wall 4/.test(l)), show(r121));
  ok("121b. with a spare at their base, they send it: no win", !solveTurn(p121(true)).win);
  // 122. Call to Battle: move our Mega-Mech to A (ours); they move a unit to A. Their lone 2 at B goes and dies; a Poro takes B.
  const p122 = (spare) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Body", 3), hand: [C("Call to Battle")], units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), ...(spare ? [tok("Spare", 1, 1, -1)] : [])] });
  ok("122. Call to Battle pulls their lone defender: win", solveTurn(p122(false)).win);
  ok("122b. a spare at their base goes instead: no win", !solveTurn(p122(true)).win);
  // 123. Whirlwind: they return a unit first (our only attacker), then we return their defender: B is empty but nobody's left
  // to walk in. With two attackers (together still short of their 5), they can stop only one.
  const p123 = (n) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Chaos", 5), hand: [C("Whirlwind")], units: [U("Stalwart Poro", 0, 0), ...Array(n).fill(0).map(() => U("Stalwart Poro", 0, -1)), tok("Wall 5", 5, 1, 1)] });
  ok("123. one attacker: they return it first: no win", !solveTurn(p123(1)).win);
  const r123 = solveTurn(p123(2));
  ok("123b. two attackers (4, short of their 5): one is returned, we return their 5, the other walks in: win", r123.win && r123.line.some((l) => /cast Whirlwind/.test(l)), show(r123));
  // 124. Divine Judgment: their four 2s at B are cut to the two they keep; our Mega-Mech (8) beats two 2s but not four.
  const p124 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Order", 9), hand, units: [U("Stalwart Poro", 0, 0), tok("Seven", 7, 0, -1), ...Array(4).fill(0).map(() => tok("Wall 2", 2, 1, 1))] });
  ok("124. a 7 into four 2s: no win", !solveTurn(p124([])).win);
  const r124 = solveTurn(p124([C("Divine Judgment")]));
  ok("124b. Divine Judgment leaves them two: 7 vs 4: win", r124.win, show(r124));
  ok("125. read: Invert Timelines (our hand goes; their known hand is kept)", turnReads(C("Invert Timelines")));
}

{
  // 126-133. Feature 6: unusual costs (Equip cost forms, Weaponmaster, additional costs as options, repeats).
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 126. Skyfall of Areion: "[Equip] [e1]{Fury}" (until 24 Nov only "[Equip] {Rune}" was read). Poro 2 + 2 beats their 3.
  const p126 = (n) => P({ runes: R("Fury", n), gear: [C("Skyfall of Areion")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("126. no runes to equip: no win", !solveTurn(p126(0)).win);
  ok("126b. Skyfall equipped for [e1]{Fury}: win", solveTurn(p126(2)).win);
  // 127. Weaponmaster (Veteran Poro): on play, Skyfall attaches for its Equip cost {A} less ([e1] only). Confront makes it ready.
  const p127 = (gear) => P({ runes: R("Body", 5), hand: [C("Confront"), C("Veteran Poro")], gear, units: [U("Stalwart Poro", 0, 0), tok("Wall 3", 3, 1, 1)] });
  ok("127. no Equipment: Veteran Poro 2 vs 3, no win", !solveTurn(p127([])).win);
  const r127 = solveTurn(p127([C("Skyfall of Areion")]));
  ok("127b. Weaponmaster attaches Skyfall on play: win", r127.win && r127.line.some((l) => /Weaponmaster: Skyfall/.test(l)), show(r127));
  // 128. Hextech Gauntlets: "[Equip] [e3]{A}", the Energy less by the chosen unit's Might: on a 3, just {A}. 3 + 3 beats 5.
  const p128 = (n) => P({ runes: R("Fury", n), gear: [C("Hextech Gauntlets")], units: [U("Stalwart Poro", 0, 0), tok("Three", 3, 0, -1), tok("Wall 5", 5, 1, 1)] });
  ok("128. no rune: no win", !solveTurn(p128(0)).win);
  ok("128b. Gauntlets for {A} on the 3: win", solveTurn(p128(1)).win);
  // 129. Wallop: spend a buff to ignore its cost; ready our exhausted Mega-Mech, which takes B. No buff to spend, no runes: no.
  const p129 = (buffed) => P({ hand: [C("Wallop")], units: [{ ...U("Stalwart Poro", 0, 0), buffed }, U("Mega-Mech", 0, -1, false), tok("Wall 7", 7, 1, 1)] });
  ok("129. nothing to spend: no win", !solveTurn(p129(false)).win);
  const r129 = solveTurn(p129(true));
  ok("129b. Wallop for a buff readies the Mega-Mech: win", r129.win && r129.line.some((l) => /spend 1 buff/.test(l)), show(r129));
  // 130. Spirit of the Forge: return a gear (Skyfall, [e3]); it enters ready with +3: 7 vs their 6.
  const p130 = (gear) => P({ runes: R("Mind", 7), hand: [C("Spirit of the Forge")], gear, units: [U("Stalwart Poro", 0, 0), tok("Wall 6", 6, 1, 1)] });
  ok("130. no gear to return: it enters exhausted, no win", !solveTurn(p130([])).win);
  const r130 = solveTurn(p130([C("Skyfall of Areion")]));
  ok("130b. Spirit returns Skyfall: ready, 7 vs 6: win", r130.win, show(r130));
  // 131. Temporal Portal ({A}, {T}): the next spell repeats for its cost again. Discipline twice: 2 + 4 beats their 5.
  const p131 = (gear) => P({ runes: R("Calm", 5), hand: [C("Discipline")], gear, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 5", 5, 1, 1)] });
  ok("131. no Portal: 4 vs 5, no win", !solveTurn(p131([])).win);
  const r131 = solveTurn(p131([C("Temporal Portal")]));
  ok("131b. Portal repeats Discipline: win", r131.win && r131.line.some((l) => /Temporal Portal/.test(l)), show(r131));
  // 132. Square Up: "[Repeat] — Discard 1": Assault 4 twice. A Poro attacks at 2 + 8 into their 9.
  const p132 = (hand) => P({ runes: R("Fury", 4), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 9", 9, 1, 1)] });
  ok("132. nothing to discard: 6 vs 9, no win", !solveTurn(p132([C("Square Up")])).win);
  const r132 = solveTurn(p132([C("Square Up"), C("Stalwart Poro")]));
  ok("132b. a discard repeats it: 10 vs 9: win", r132.win, show(r132));
  ok("133. read: Kraken Hunter, Brazen Buccaneer, Commander Ledros, Chronobreak", ["Kraken Hunter", "Brazen Buccaneer", "Commander Ledros", "Chronobreak"].every((n) => turnReads(C(n))));
}

{
  // 134-143. Feature 7: copies and one-of-a-kind effects; [Temporary] at the Beginning Phase.
  const tok = (n, m, side, at, ready = true, x = "") => ({ card: { n, t: "Unit", m, x, token: true }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 134. A [Temporary] unit dies at the start of our Beginning Phase, before scoring (§816.1.b–c): it never holds.
  const r134 = solveTurn({ score: [7, 5], ctrl: [0, 1], beginning: true, runes: [], units: [tok("Sprite", 3, 0, 0, true, "[Temporary]")] });
  ok("134. a Temporary Sprite alone at A doesn't hold it: no win at 7", !r134.win && r134.line.some((l) => /dies \(\[Temporary\]\)/.test(l)), show(r134));
  const r134b = solveTurn({ score: [7, 5], ctrl: [0, 1], beginning: true, runes: [], units: [tok("Sprite", 3, 0, 0, true, "[Temporary]"), U("LeBlanc, Everywhere at Once", 0, 0)] });
  ok("134b. at LeBlanc, Everywhere at Once's battlefield it doesn't die", !r134b.line.some((l) => /Temporary/.test(l)), show(r134b));
  // 135. Shard of Undoing: that death makes them kill one of their units: their only one, at B. A Poro walks in.
  const p135 = (gear) => P({ gear, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Sprite", 1, 0, -1, true, "[Temporary]"), tok("Wall 4", 4, 1, 1)] });
  ok("135. no Shard: no win", !solveTurn(p135([])).win);
  const r135 = solveTurn(p135([C("Shard of Undoing")]));
  ok("135b. Shard of Undoing: their wall dies, B is ours: win", r135.win, show(r135));
  // 136. Svellsongur: the unit's text is copied into the Equipment's effect text, so it has it twice: [Assault 3] twice (§807.2).
  const p136 = (gear) => P({ units: [U("Stalwart Poro", 0, 0), { ...tok("Raider", 2, 0, -1, true, "[Assault 3]"), gear }, tok("Wall 7", 7, 1, 1)] });
  ok("136. Raider (2 + Assault 3) into their 7: no win", !solveTurn(p136([])).win);
  ok("136b. with Svellsongur: 2 + 3 + 3 = 8: win", solveTurn(p136([C("Svellsongur")])).win);
  // 137. Shady Spectacles ([e1]{Order}): the equipped Poro becomes a copy of our exhausted Mega-Mech (8) and takes B.
  const p137 = (n) => P({ runes: R("Order", n), gear: [C("Shady Spectacles")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Mega-Mech", 0, -1, false), tok("Wall 7", 7, 1, 1)] });
  ok("137. no runes: no win", !solveTurn(p137(0)).win);
  const r137 = solveTurn(p137(2));
  ok("137b. Spectacles: the Poro becomes a Mega-Mech copy: win", r137.win && r137.line.some((l) => /becomes a copy of Mega-Mech/.test(l)), show(r137));
  // 138. Heimerdinger, Inventor (at A, where he can't attack from) uses our exhausted legend's {T} ability, Blind Monk's buff:
  // the Poro from base (3) beats their 2.
  const p138 = (who) => P({ runes: R("Calm", 1), legend: { card: C("Blind Monk"), ready: false }, units: [U("Stalwart Poro", 0, 0), who, U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1)] });
  ok("138. a plain unit at A instead: no buff, trade, no win", !solveTurn(p138(tok("Three", 3, 0, 0))).win);
  const r138 = solveTurn(p138(U("Heimerdinger, Inventor", 0, 0)));
  ok("138b. Heimerdinger borrows the Monk's buff: win", r138.win, show(r138));
  // 139. Curtain Call: Repeat buys a second mode: 2 damage kills their 2, -4 empties their 3; one mode isn't enough.
  const p139 = (n) => P({ runes: R("Fury", n), hand: [C("Curtain Call")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 2", 2, 1, 1), tok("Wall 3", 3, 1, 1)] });
  ok("139. one mode only (4 runes): no win", !solveTurn(p139(4)).win);
  const r139 = solveTurn(p139(5));
  ok("139b. more modes for Repeats: win", r139.win && r139.line.some((l) => /modes \(Repeat/.test(l)), show(r139));
  // 140. Alpha Strike: our Mega-Mech's 8 split among their 3 + 3 + 2 at B kills all three; a Poro walks in.
  const p140 = (hand) => P({ runes: R("Calm", 4), hand, units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), U("Mega-Mech", 0, -1, false), tok("W3", 3, 1, 1), tok("W3b", 3, 1, 1), tok("W2", 2, 1, 1)] });
  ok("140. no Alpha Strike: no win", !solveTurn(p140([])).win);
  ok("140b. Alpha Strike clears B: win", solveTurn(p140([C("Alpha Strike")])).win);
  // 141. Dominus: double our exhausted Mega-Mech (16) and give it "{A}{A}: Ready me": it takes B from their 9.
  const p141 = (n) => P({ runes: R("Fury", n), hand: [C("Dominus")], units: [U("Stalwart Poro", 0, 0), U("Mega-Mech", 0, -1, false), tok("Wall 9", 9, 1, 1)] });
  // (Runes recycle for Power even when exhausted, so 4 runes pay Dominus and {A}{A}: the twin is without Dominus.)
  ok("141. without Dominus: no win", !solveTurn({ ...p141(6), hand: [] }).win);
  const r141 = solveTurn(p141(6));
  ok("141b. Dominus, then {A}{A}: Ready me: win", r141.win, show(r141));
  // 142. Dancing Grenade: 2, then again for {A}: 3 more. Their 5 at B dies; a Poro walks in.
  const p142 = (n) => P({ runes: R("Fury", n), hand: [C("Dancing Grenade")], units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), tok("Wall 5", 5, 1, 1)] });
  ok("142. without Dancing Grenade: no win", !solveTurn({ ...p142(4), hand: [] }).win);
  const r142 = solveTurn(p142(4));
  ok("142b. the recast deals 3: win", r142.win, show(r142));
  // 143. Stealthy Pursuer (exhausted) moves with the Poro leaving base: 2 + 4 beats their 5.
  const p143 = (who) => P({ units: [U("Stalwart Poro", 0, 0), U("Stalwart Poro", 0, -1), who, tok("Wall 5", 5, 1, 1)] });
  ok("143. a plain exhausted 4 stays: no win", !solveTurn(p143(tok("Four", 4, 0, -1, false))).win);
  const r143 = solveTurn(p143(U("Stealthy Pursuer", 0, -1, false)));
  ok("143b. Stealthy Pursuer moves with it: win", r143.win, show(r143));
}

{
  // ── 24 Nov, polish: the last 49 cards ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  const hold = () => tok("Holder", 1, 0, 0);
  // 144. Orianna, Exquisite (4) deals combat damage only with a friendly gear here: a Bomb at B. Alone she can't beat their 3.
  const p144 = (extra) => P({ units: [hold(), U("Orianna, Exquisite", 0, -1), tok("Wall 3", 3, 1, 1)], ...extra });
  ok("144. Orianna without a gear at B deals no damage: no win", !solveTurn(p144({})).win);
  const r144 = solveTurn(p144({ gear: [{ ...BOMB }], gearAt: [1] }));
  ok("144b. a friendly Bomb at B: she deals damage: win", r144.win, show(r144));
  // 145. Sacred Protector (6) deals damage only with exactly one other unit of ours at its battlefield.
  const p145 = (more) => P({ units: [hold(), U("Sacred Protector", 0, -1), ...more, tok("Wall 5", 5, 1, 1)] });
  ok("145. Protector alone: no damage, no win", !solveTurn(p145([])).win);
  const r145 = solveTurn(p145([tok("One", 1, 0, -1)]));
  ok("145b. Protector and one other (6 + 1 vs 5): win", r145.win, show(r145));
  // 146. Wielder of Water: +2 while attacking alone (4 vs 3).
  ok("146. a plain 2 into their 3: no win", !solveTurn(P({ units: [hold(), tok("Two", 2, 0, -1), tok("Wall 3", 3, 1, 1)] })).win);
  const r146 = solveTurn(P({ units: [hold(), U("Wielder of Water", 0, -1), tok("Wall 3", 3, 1, 1)] }));
  ok("146b. Wielder of Water attacking alone: win", r146.win, show(r146));
  // 147. Tryndamere (8) from 5: hold A (6), conquer B (7), 5+ excess scores 1 (8).
  const p147 = (w) => ({ ...P({ units: [hold(), U("Tryndamere, Barbarian", 0, -1), tok("Wall", w, 1, 1)] }), score: [5, 5] });
  ok("147. into their 4 (4 excess): 7, no win", !solveTurn(p147(4)).win);
  const r147 = solveTurn(p147(3));
  ok("147b. into their 3 (5 excess): the extra point, win", r147.win && r147.line.some((l) => /you score 1/.test(l)), show(r147));
  // 148. "When I conquer" fires on a walk-in to an empty battlefield (until 24 Nov only after a fight).
  const conq = { card: { n: "Moon Conqueror", t: "Unit", m: 2, x: "When I conquer, you score 1 point." }, side: 0, at: -1, ready: true };
  const p148 = (u) => ({ score: [5, 5], ctrl: [0, null], beginning: true, runes: [], units: [hold(), u] });
  ok("148. a plain 2 walks into empty B: 7, no win", !solveTurn(p148(tok("Two", 2, 0, -1))).win);
  const r148 = solveTurn(p148(conq));
  ok("148b. a conquer trigger on the walk-in scores: win", r148.win, show(r148));
  // 149. Yone conquers B while it was uncontrolled: 5 to their unit in base. With B theirs, not.
  const r149 = solveTurn({ score: [3, 5], ctrl: [null, null], runes: [], units: [U("Yone, Blademaster", 0, -1), tok("Their 5", 5, 1, -1)] });
  ok("149. Yone takes an uncontrolled B: their base unit takes 5 and dies", r149.line.some((l) => /Their 5 \(base\) dies/.test(l)), show(r149));
  const r149b = solveTurn({ score: [3, 5], ctrl: [null, 1], runes: [], units: [U("Yone, Blademaster", 0, -1), tok("Their 5", 5, 1, -1), tok("W1", 1, 1, 1)] });
  ok("149b. B was theirs: no hit", !r149b.line.some((l) => /Their 5 \(base\) dies/.test(l)), show(r149b));
  // 150. Smite kills their 3 at B (banished instead: no Deathknell); a 3 walks in.
  const p150 = (hand) => P({ runes: R("Fury", 3), hand, units: [hold(), tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1, true, [], "")] });
  ok("150. without Smite: 3 into 4, no win", !solveTurn(p150([])).win);
  const r150 = solveTurn({ ...p150([C("Smite")]), units: [hold(), tok("Three", 3, 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("150b. Smite kills their 3, the 3 walks in: win", r150.win, show(r150));
  // 151. Monster Harpoon: 4 instead of 2 while we control a facedown card. 4 kills their 4 at B before combat; our 3 walks in.
  const p151 = (down) => P({ runes: R("Fury", 2), hand: [C("Monster Harpoon")], units: [hold(), tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1)], down });
  ok("151. no facedown card: 2 damage, trade, no win", !solveTurn(p151([[[], []], [[], []]])).win);
  const r151 = solveTurn(p151([[[C("Switcheroo")], []], [[], []]]));
  ok("151b. a facedown card at A: 4 damage, win", r151.win, show(r151));
  // 152. Kai'Sa, Rebel in a fight: our main-speed Twilight Shroud is played there (lib/fight.mjs allReaction). 5 (their 6 Disarmed to 5) + 1.
  const wall6 = { n: "Wall 6", t: "Unit", m: 6, x: "" };
  ok("152. without [Reaction] the Shroud stays in hand: trade", fight({ units: [C("Kai'Sa, Rebel")], hand: [C("Twilight Shroud")], budget: { e: 1, p: 0 } }, { units: [wall6] }).outcome !== "conquer");
  ok("152b. Kai'Sa gives it [Reaction]: conquer", fight({ units: [C("Kai'Sa, Rebel")], hand: [C("Twilight Shroud")], budget: { e: 1, p: 0 }, allReaction: true }, { units: [wall6] }).outcome === "conquer");
  // 153. Wily Newtfish holds A, then (XP gained this turn: +1 and Ganking) moves to B: 5 vs 4.
  const p153 = (xpGained) => ({ ...P({ units: [U("Wily Newtfish", 0, 0), tok("Wall 4", 4, 1, 1)] }), xpGained });
  ok("153. no XP gained: no Ganking, no win", !solveTurn(p153(false)).win);
  const r153 = solveTurn(p153(true));
  ok("153b. XP gained: Newtfish ganks to B, win", r153.win, show(r153));
  // 154. Shadow Watcher enters ready when a friendly unit died in the Beginning Phase (our [Temporary] 1).
  const p154 = (more) => P({ runes: R("Calm", 5), hand: [C("Shadow Watcher")], units: [hold(), ...more, tok("Wall 4", 4, 1, 1)] });
  ok("154. nothing died: Watcher enters exhausted, no win", !solveTurn(p154([])).win);
  const r154 = solveTurn(p154([tok("Temp", 1, 0, -1, true, [], "[Temporary]")]));
  ok("154b. our Temporary unit died: Watcher enters ready and takes B, win", r154.win, show(r154));
  // 155. Oasis Raider at A: fewer runes than them at the start of the Beginning Phase: +2 and Ganking (6 vs 5).
  const p155 = (their) => P({ units: [U("Oasis Raider", 0, 0), tok("Wall 5", 5, 1, 1)], their });
  ok("155. their runes unknown: no win", !solveTurn(p155({ hand: [] })).win);
  const r155 = solveTurn(p155({ hand: [], runes: 4 }));
  ok("155b. they have more runes: Raider ganks to B, win", r155.win, show(r155));
  // 156. Jinx, Rebel (exhausted at base) readies with +1 when Chemtech Enforcer's play discards: 6 vs 5.
  const p156 = (hand) => P({ runes: R("Fury", 2), hand, units: [hold(), U("Jinx, Rebel", 0, -1, false), tok("Wall 5", 5, 1, 1)] });
  ok("156. nothing discarded: no win", !solveTurn(p156([C("Smite")])).win);
  const r156 = solveTurn(p156([C("Chemtech Enforcer"), C("Smite")]));
  ok("156b. the Enforcer's discard readies Jinx: win", r156.win, show(r156));
  // 157. Fiora, Worthy: Twilight Shroud makes our exhausted 4 Mighty; {Order} readies it; 5 vs 4.
  const p157 = (fiora) => P({ runes: [{ d: "Calm", ready: true }, { d: "Order", ready: true }], hand: [C("Twilight Shroud")], units: [hold(), fiora, tok("Four", 4, 0, -1, false), tok("Wall 4", 4, 1, 1)] });
  ok("157. no Fiora: the 4 stays exhausted, no win", !solveTurn(p157(tok("Plain", 1, 0, 0))).win);
  const r157 = solveTurn(p157(U("Fiora, Worthy", 0, 0)));
  ok("157b. Fiora readies the newly Mighty unit: win", r157.win, show(r157));
  // 158. Vi, Destructive at A recycles a card from the trash for +1 and ganks: 4 vs 3.
  const p158 = (trash) => ({ ...P({ units: [U("Vi, Destructive", 0, 0), tok("Wall 3", 3, 1, 1)] }), trash });
  ok("158. trash unknown: 3 into 3, no win", !solveTurn(p158(null)).win);
  const r158 = solveTurn(p158([C("Smite")]));
  ok("158b. recycle 1 from the trash: win", r158.win, show(r158));
  // 159. The List named Poro: their Poro-tagged 4 at B gets -2; our 3 walks in.
  const p159 = (listTag) => ({ ...P({ gear: [C("The List")], units: [hold(), tok("Three", 3, 0, -1), tok("Poro 4", 4, 1, 1, true, ["Poro"])] }), listTag });
  ok("159. the List's name unknown: no win", !solveTurn(p159(null)).win);
  const r159 = solveTurn(p159("Poro"));
  ok("159b. it named Poro: win", r159.win, show(r159));
  // 160. Hwei moves, draws, discards a unit from hand: +3 (8 vs 7).
  const p160 = (hand) => P({ hand, units: [hold(), U("Hwei, Brooding Painter", 0, -1), tok("Wall 7", 7, 1, 1)] });
  ok("160. nothing known to discard: no win", !solveTurn(p160([])).win);
  const r160 = solveTurn(p160([C("Stalwart Poro")]));
  ok("160b. discard a unit: +3, win", r160.win, show(r160));
  // 161. Akshan (paid {Body}{Body}) takes Long Sword off their 3 at B; our 4 walks in.
  const p161 = (hand) => P({ runes: R("Body", 6), hand, units: [hold(), tok("Four", 4, 0, -1), { ...tok("Wall 3", 3, 1, 1), gear: [C("Long Sword")] }] });
  ok("161. without Akshan: 4 into 5, no win", !solveTurn(p161([])).win);
  const r161 = solveTurn(p161([C("Akshan, Mischievous")]));
  ok("161b. Akshan takes the Sword: win", r161.win && r161.line.some((l) => /Akshan takes Long Sword/.test(l)), show(r161));
}

{
  // ── 24 Nov, bugs: the polished cards that had no closing turn (each found a bug or proves its hook) ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  const hold = () => tok("Holder", 1, 0, 0);
  const wurm = () => U("Magma Wurm", 0, -1, false);   // "Other friendly units enter ready": a unit played now can attack
  // 162. Atakhan: killing our Mega-Mech ([e7]) as the additional cost makes him [e3]{Order}{Order}{Order}; his attack makes them kill their 6.
  const p162 = (more) => P({ runes: R("Order", 6), hand: [C("Atakhan")], units: [hold(), wurm(), ...more, tok("Wall 6", 6, 1, 1)] });
  ok("162. nothing to kill: full price, no win", !solveTurn(p162([])).win);
  const r162 = solveTurn(p162([U("Mega-Mech", 0, -1, false)]));
  ok("162b. kill the Mega-Mech: Atakhan for [e3], win", r162.win && r162.line.some((l) => /Atakhan's additional cost/.test(l)), show(r162));
  // 163. Rhasa costs [e1] less per card in our trash (8: [e2]{Chaos}).
  const p163 = (trash) => ({ ...P({ runes: R("Chaos", 3), hand: [C("Rhasa the Sunderer")], units: [hold(), wurm(), tok("Wall 5", 5, 1, 1)] }), trash });
  ok("163. trash unknown: no win", !solveTurn(p163(null)).win);
  ok("163b. 8 cards in the trash: win", solveTurn(p163(Array(8).fill(C("Smite")))).win);
  // 164. Shadowblade Lurker: [e2] less per Lurker in the trash.
  const p164 = (trash) => ({ ...P({ runes: R("Chaos", 1), hand: [C("Shadowblade Lurker")], units: [hold(), wurm(), tok("Wall 4", 4, 1, 1)] }), trash });
  ok("164. trash unknown: no win", !solveTurn(p164(null)).win);
  ok("164b. two Lurkers in the trash: [e1], win", solveTurn(p164([C("Shadowblade Lurker"), C("Shadowblade Lurker")])).win);
  // 165. Noxian Drummer's Recruit token is played where he moved ("token here" read as base until 24 Nov); with Heimerdinger,
  // Academy Instructor at a battlefield it's a 3 M Mech instead: 3 + 3 vs 5.
  const p165 = (atA) => P({ units: [atA, U("Noxian Drummer", 0, -1), tok("Wall 5", 5, 1, 1)] });
  const r165a = solveTurn(p165(tok("Plain", 5, 0, 0)));
  ok("165. the Recruit joins him at his battlefield, but 3 + 1 vs 5: no win", !r165a.win && !r165a.line.some((l) => /Recruit token to base/.test(l)), show(r165a));
  const r165 = solveTurn(p165(U("Heimerdinger, Academy Instructor", 0, 0)));
  ok("165b. Heimerdinger makes it a 3 M Mech: win", r165.win && r165.line.some((l) => /Mech token to B/.test(l)), show(r165));
  // 166. Undying Loyalty plays a Stalwart Poro from the trash (Magma Wurm: it enters ready; until 24 Nov a trash play ignored him).
  const p166 = (trash) => ({ ...P({ runes: R("Order", 1), hand: [C("Undying Loyalty")], units: [hold(), wurm(), tok("Wall 1", 1, 1, 1)] }), trash });
  ok("166. trash unknown: no win", !solveTurn(p166(null)).win);
  const r166 = solveTurn(p166([C("Stalwart Poro")]));
  ok("166b. the Poro from the trash ([e2] less: a pet) takes B: win", r166.win, show(r166));
  // 167. Lux, Illuminated: +3 when we play a spell costing [e5] or more (Progress Day): 8 vs 7.
  const p167 = (hand) => P({ runes: R("Mind", 7), hand, units: [hold(), U("Lux, Illuminated", 0, -1), tok("Wall 7", 7, 1, 1)] });
  ok("167. no big spell: no win", !solveTurn(p167([])).win);
  ok("167b. Progress Day pumps Lux: win", solveTurn(p167([C("Progress Day")])).win);
  // 168. Sanctum Conservator readies when we play a card costing [e7] or more (Tryndamere).
  const p168 = (hand) => P({ runes: R("Fury", 9), hand, units: [hold(), U("Sanctum Conservator", 0, -1, false), tok("Wall 4", 4, 1, 1)] });
  ok("168. no big card: it stays exhausted, no win", !solveTurn(p168([])).win);
  ok("168b. Tryndamere readies it: win", solveTurn(p168([C("Tryndamere, Barbarian")])).win);
  // 169. Renekton, Brute at 9 pays [e1] for 10: Empowered, so [Ganking]; he moves A → B.
  const p169 = (bonus) => P({ runes: R("Body", 1), units: [{ ...U("Renekton, Brute", 0, 0), bonus }, tok("Wall 9", 9, 1, 1)] });
  ok("169. at 8 + 1: no Ganking, no win", !solveTurn(p169(4)).win);
  ok("169b. at 9 + 1 = 10: empowered, ganks: win", solveTurn(p169(5)).win);
  // 170. Pirate's Haven: Fiora readies our newly Mighty 5 and the Haven adds 1: 6 vs 5.
  const p170 = (gear) => P({ runes: [{ d: "Calm", ready: true }, { d: "Order", ready: true }], hand: [C("Twilight Shroud")], gear, units: [hold(), U("Fiora, Worthy", 0, 0), tok("Four", 4, 0, -1, false), tok("Wall 5", 5, 1, 1)] });
  ok("170. no Haven: 5 vs 5 trades, no win", !solveTurn(p170([])).win);
  ok("170b. the Haven's +1 on the ready: win", solveTurn(p170([C("Pirate's Haven")])).win);
  // 171. Prize of Progress: +1 when we use a gear's ability (Orb of Regret's -1 on their 4): 4 vs 3.
  const p171 = (who) => P({ gear: [C("Orb of Regret")], units: [hold(), who, tok("Wall 4", 4, 1, 1)] });
  ok("171. a plain 3: 3 vs 3 trades, no win", !solveTurn(p171(tok("Three", 3, 0, -1))).win);
  ok("171b. Prize of Progress gets +1: win", solveTurn(p171(U("Prize of Progress", 0, -1))).win);
  // 172. Aphelios, Exalted: attaching Doran's Shield buys a mode, the buff: 4 + 1 + 1 vs 5.
  const p172 = (who) => P({ runes: R("Calm", 1), gear: [C("Doran's Shield")], units: [hold(), who, tok("Wall 5", 5, 1, 1)] });
  ok("172. a plain 4 with the Shield: 5 vs 5, no win", !solveTurn(p172(tok("Four", 4, 0, -1))).win);
  const r172 = solveTurn(p172(U("Aphelios, Exalted", 0, -1)));
  ok("172b. Aphelios buffs on the attach: win", r172.win && r172.line.some((l) => /Aphelios, Exalted: Buff/.test(l)), show(r172));
  // 173. Petal Pixie: +1 for our [Temporary] unit with her (this crashed the solver: her count recursed). Mid-turn at 7, A scored.
  const p173 = (who) => ({ score: [7, 5], ctrl: [0, 1], scored: [0], runes: [], units: [hold(), who, tok("Temp", 1, 0, -1, true, [], "[Temporary]"), tok("Wall 3", 3, 1, 1)] });
  ok("173. a plain 2 and the Temporary 1: trade, no win", !solveTurn(p173(tok("Two", 2, 0, -1))).win);
  ok("173b. Pixie (3) and the Temporary 1: win", solveTurn(p173(U("Petal Pixie", 0, -1))).win);
}

{
  // ── 24 Nov, bugs: a trigger run in place keeps its best result, not its first ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  // 174. Explosimian holds A: its three Bombs go to B (the first battlefield, A, until 24 Nov), so Orianna, Exquisite has a
  // friendly gear there and deals damage.
  const r174 = solveTurn({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [U("Explosimian", 0, 0), U("Orianna, Exquisite", 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("174. Explosimian's Bombs land at B for Orianna: win", r174.win && r174.line.some((l) => /Bombs to B/.test(l)), show(r174));
  // 175. Our [Temporary] unit dies in the Beginning Phase; Demacian Illuminators buffs the 4 at base (not the holder at A,
  // the first friendly unit): 5 vs 4.
  const p175 = (who) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [tok("Holder", 1, 0, 0), who, tok("Four", 4, 0, -1), tok("Temp", 1, 0, -1, true, [], "[Temporary]"), tok("Wall 4", 4, 1, 1)] });
  ok("175. no Illuminators: 4 vs 4, no win", !solveTurn(p175(tok("Plain", 1, 0, -1, false))).win);
  const r175 = solveTurn(p175(U("Demacian Illuminators", 0, -1, false)));
  ok("175b. the buff goes to the attacker: win", r175.win, show(r175));
}

{
  // ── 24 Nov, the last three simplifications ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  const hold = () => tok("Holder", 1, 0, 0);
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  // 176. A counter can be countered: our Smite on their 3 at B, their Abandon counters it, our Defy counters Abandon.
  const p176 = (hand) => P({ runes: [...R("Fury", 3), ...R("Calm", 2)], hand, units: [hold(), tok("Three", 3, 0, -1), tok("Wall 3", 3, 1, 1)], their: { hand: [C("Abandon")], budget: { e: 2, p: 0 } } });
  ok("176. their Abandon stops Smite: no win", !solveTurn(p176([C("Smite")])).win);
  const r176 = solveTurn(p176([C("Smite"), C("Defy")]));
  ok("176b. our Defy counters Abandon: win", r176.win, show(r176));
  const wall3 = { n: "Wall 3", t: "Unit", m: 3, x: "" }, three = { n: "Three", t: "Unit", m: 3, x: "" };
  ok("176c. fight: their Abandon on our Smite, no Defy: no conquest", fight({ units: [three], hand: [C("Smite")], budget: { e: 3, p: 2 } }, { units: [wall3], hand: [C("Abandon")], budget: { e: 2, p: 0 } }).outcome !== "conquer");
  ok("176d. fight: our Defy counters it back: conquer", fight({ units: [three], hand: [C("Smite"), C("Defy")], budget: { e: 3, p: 2 } }, { units: [wall3], hand: [C("Abandon")], budget: { e: 2, p: 0 } }).outcome === "conquer");
  // 177. Rek'Sai, Breacher: a Stalwart Poro played from the trash (Undying Loyalty) has [Accelerate]: paid, it enters ready.
  const p177 = (who) => ({ ...P({ runes: [...R("Order", 1), ...R("Calm", 2)], hand: [C("Undying Loyalty")], units: [hold(), who, tok("Wall 1", 1, 1, 1)] }), trash: [C("Stalwart Poro")] });
  ok("177. no Rek'Sai: the Poro enters exhausted, no win", !solveTurn(p177(tok("Plain", 1, 0, -1, false))).win);
  const r177 = solveTurn(p177(U("Rek'Sai, Breacher", 0, -1, false)));
  ok("177b. Rek'Sai: Accelerate from the trash, win", r177.win && r177.line.some((l) => /Accelerate\] \(Rek'Sai/.test(l)), show(r177));
  // 178. Esteemed Hierophant reads their rune count (7+: our spell damage is prevented, in the main phase too).
  const p178 = (runes) => P({ runes: R("Mind", 5), hand: [C("Falling Comet")], units: [hold(), tok("One", 1, 0, -1), U("Esteemed Hierophant", 1, 1)], their: { hand: [], runes } });
  ok("178. they have 7 runes: Falling Comet is prevented, no win", !solveTurn(p178(7)).win);
  ok("178b. their runes unknown: read as 7+, no win", !solveTurn(p178(null)).win);
  const r178 = solveTurn(p178(6));
  ok("178c. they have 6: the Comet kills it, win", r178.win, show(r178));
}

{
  // ── 24 Nov, legends: on model boards, and every legend's text read (pos.legend: { card, ready, empowered }) ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  const P = (extra) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], ...extra });
  const hold = () => tok("Holder", 1, 0, 0);
  const L = (n, ready = true, empowered = false) => ({ card: C(n), ready, empowered });
  const pair = (num, what, make, yes, no = null) => {
    ok(`${num}. ${what}: without it, no win`, !solveTurn(make(no)).win);
    const r = solveTurn(make(yes)); ok(`${num}b. ${what}: win`, r.win, show(r));
  };
  // 179. Units can be played to a battlefield we control (§355.2.a); The Exile makes them enter ready: Vi (Ganking) from A to B.
  pair(179, "The Exile: Vi played to A enters ready and ganks", (leg) => P({ runes: R("Fury", 3), hand: [C("Vi, Destructive")], units: [hold(), tok("Wall 2", 2, 1, 1)], legend: leg }), L("The Exile"));
  // 180. Daughter of the Void's {A} pays On the Hunt's second Power (one rune): our exhausted 4 readies.
  pair(180, "Daughter of the Void's {A} for a spell", (leg) => P({ runes: R("Body", 1), hand: [C("On the Hunt")], units: [hold(), tok("Four", 4, 0, -1, false), tok("Wall 3", 3, 1, 1)], legend: leg }), L("Daughter of the Void"));
  // 181. Heart of the Tempest (Empowered): disempower, {T}: [Assault 2] on our 3 vs their 4.
  pair(181, "Heart of the Tempest's [Assault 2]", (leg) => P({ units: [hold(), tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Heart of the Tempest", true, true), L("Heart of the Tempest", true, false));
  // 182. Bashful Bloom: [e4], {T}: a ready 3 M Sprite.
  pair(182, "Bashful Bloom's Sprite", (leg) => P({ runes: R("Calm", 4), units: [hold(), tok("Wall 2", 2, 1, 1)], legend: leg }), L("Bashful Bloom"));
  // 183. Deceiver: holding A, discard 1 and exhaust her: a ready Reflection copy of our Ganking 4 at A takes B.
  pair(183, "Deceiver's Reflection on the hold", (leg) => P({ hand: [C("Smite")], units: [tok("Ganker", 4, 0, 0, false, [], "[Ganking]"), tok("Wall 3", 3, 1, 1)], legend: leg }), L("Deceiver"));
  // 184. Unforgiven: [e2], {T}: our exhausted 4 moves from base to B (a move by ability needs no ready unit).
  pair(184, "Unforgiven moves an exhausted unit to B", (leg) => P({ runes: R("Body", 2), units: [hold(), tok("Four", 4, 0, -1, false), tok("Wall 3", 3, 1, 1)], legend: leg }), L("Unforgiven"));
  // 185. Soul's Reflection (Empowered): -2 on their 4.
  pair(185, "Soul's Reflection's -2", (leg) => P({ units: [hold(), tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Soul's Reflection", true, true), L("Soul's Reflection", true, false));
  // 186. Matriarch of War (Empowered): disempower, {A}, {T}: ready our exhausted 4.
  pair(186, "Matriarch of War readies a unit", (leg) => P({ runes: R("Body", 1), units: [hold(), tok("Four", 4, 0, -1, false), tok("Wall 3", 3, 1, 1)], legend: leg }), L("Matriarch of War", true, true), L("Matriarch of War", true, false));
  // 187. Wuju Master: [Level 6] our units have +1 (3 + 1 vs 3).
  pair(187, "Wuju Master at Level 6", (xp) => ({ ...P({ units: [hold(), tok("Three", 3, 0, -1), tok("Wall 3", 3, 1, 1)], legend: L("Wuju Master") }), xp }), 6, 5);
  // 188. Purifier: our Equipment give [Assault] (3 + Doran's Shield 1 + Assault 1 vs 4).
  pair(188, "Purifier's [Assault] per Equipment", (leg) => P({ units: [hold(), { ...tok("Three", 3, 0, -1), gear: [C("Doran's Shield")] }, tok("Wall 4", 4, 1, 1)], legend: leg }), L("Purifier"));
  // 189. Pride of Nazumah: [Assault] equal to [Shield] (3 + Assault 2 vs 4).
  pair(189, "Pride of Nazumah's Assault from Shield", (leg) => P({ runes: R("Body", 1), units: [hold(), tok("Shield3", 3, 0, -1, true, [], "[Shield 2]"), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Pride of Nazumah"));
  // 190. Grandmaster at Arms: {T}: Long Sword moves from our holder to the attacker (3 + 2 vs 4).
  pair(190, "Grandmaster at Arms moves an Equipment", (leg) => P({ units: [{ ...hold(), gear: [C("Long Sword")] }, tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Grandmaster at Arms"));
  // 191. Lady of Clockwork: at the start of the Main Phase, [e1]: Skyfall of Areion ([e3]) becomes a ready 3 M unit.
  pair(191, "Lady of Clockwork's gear unit", (leg) => P({ runes: R("Calm", 1), gear: [C("Skyfall of Areion")], units: [hold(), tok("Wall 2", 2, 1, 1)], legend: leg }), L("Lady of Clockwork"));
  // 192. Starry-Eyed Songstress: exhaust her and three units: Falling Comet for [e3] kills their 5; the fourth unit walks in.
  pair(192, "Starry-Eyed Songstress pays for a spell", (leg) => P({ runes: R("Mind", 3), hand: [C("Falling Comet")], units: [hold(), tok("One", 1, 0, -1), tok("A1", 1, 0, -1), tok("A2", 1, 0, -1), tok("Wall 5", 5, 1, 1)], legend: leg }), L("Starry-Eyed Songstress"));
  // 193. Defender of Tomorrow: ready Orb of Regret and use it twice (their 4 → 2).
  pair(193, "Defender of Tomorrow readies a gear", (leg) => P({ runes: R("Mind", 1), gear: [C("Orb of Regret")], units: [hold(), tok("Three", 3, 0, -1), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Defender of Tomorrow"));
  // 194. Blade Dancer: Twilight Shroud chooses our exhausted 4; she's exhausted and {A} paid to ready it.
  pair(194, "Blade Dancer readies a chosen unit", (leg) => P({ runes: R("Calm", 3), hand: [C("Twilight Shroud")], units: [hold(), tok("Four", 4, 0, -1, false), tok("Wall 4", 4, 1, 1)], legend: leg }), L("Blade Dancer"));
  // 195. Piltover Enforcer: from 5, a conquest with 4 excess at B readies our Ganking 6; it takes the Pit (the 8th, all scored).
  pair(195, "Piltover Enforcer readies after excess", (leg) => ({ score: [5, 5], ctrl: [0, 1, 1], beginning: true, runes: [], units: [hold(), tok("Six", 6, 0, -1, true, [], "[Ganking]"), tok("W2", 2, 1, 1), tok("W1", 1, 1, 2)], legend: leg }), L("Piltover Enforcer"));
  // 196. Model boards carry the legend: playerOf reads it from the list; a closing position from playMatch has it.
  const list = JSON.parse((await import("node:fs")).readFileSync(new URL("../data/decks.json", import.meta.url), "utf8")).decks.find((d) => d.lg && Object.keys(d.cards).length > 30);
  const { playerOf, playMatch } = await import("./match.mjs"); const { rng } = await import("./sim.mjs");
  const me = playerOf(list.cards, cat);
  ok("196. playerOf reads the list's legend", !!me.legend && /Legend/.test(me.legend.t), me.legend?.n);
  let seenLegend = null;
  for (let i = 0; i < 20 && !seenLegend; i++) playMatch(me, me, rng(500 + i), { closeFrom: 5, onMain: (pos) => { if (!seenLegend) seenLegend = pos.legend; }, onMainEnd: () => {} });
  ok("196b. a model-board position has the legend", !!seenLegend?.card && seenLegend.card.n === me.legend.n, seenLegend?.card?.n);
}

{
  // ── 24 Nov, the last simplifications: Power by domain in fights, Rogue Assassin, their hand ──
  const tok = (n, m, side, at, ready = true, g = [], x = "") => ({ card: { n, t: "Unit", m, x, token: true, g }, side, at, ready });
  const three = { n: "Three", t: "Unit", m: 3, x: "" }, wall3 = { n: "Wall 3", t: "Unit", m: 3, x: "" };
  // 197. Smite ({Fury}) can't be paid with Calm runes inside a fight (until 24 Nov fight budgets were totals).
  ok("197. fight: Smite on two Calm runes: no conquest", fight({ units: [three], hand: [C("Smite")], budget: { e: 2, p: 2, dom: { Calm: 2 }, any: 0 } }, { units: [wall3] }).outcome !== "conquer");
  ok("197b. fight: on two Fury runes: conquer", fight({ units: [three], hand: [C("Smite")], budget: { e: 2, p: 2, dom: { Fury: 2 }, any: 0 } }, { units: [wall3] }).outcome === "conquer");
  const p197 = (d) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R(d, 2), hand: [C("Smite")], units: [tok("H", 1, 0, 0), tok("Three", 3, 0, -1), tok("Wall 3", 3, 1, 1)] });
  ok("197c. a closing turn with Calm runes: no win", !solveTurn(p197("Calm")).win);
  ok("197d. with Fury runes: win", solveTurn(p197("Fury")).win);
  // 198. Rogue Assassin (Empowered): Atakhan attacks B (they kill their 1), leaves the showdown readied, attacks again (they
  // kill their 9) and takes B.
  const p198 = (emp) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], legend: { card: C("Rogue Assassin"), ready: true, empowered: emp }, units: [tok("H", 1, 0, 0), U("Atakhan", 0, -1), tok("Wall 9", 9, 1, 1), tok("Wall 1", 1, 1, 1)] });
  ok("198. not Empowered: one attack, no win", !solveTurn(p198(false)).win);
  const r198 = solveTurn(p198(true));
  ok("198b. Empowered: the rescue and a second attack: win", r198.win && r198.line.some((l) => /leaves the showdown for base, readied/.test(l)), show(r198));
  // 199. Their units that can't be played on our turn aren't blind spots; one with a play effect it would bring is.
  ok("199. Watchful Sentry and Wrath of the Freljord in their hand are read", ["Watchful Sentry", "Wrath of the Freljord"].every((n) => turnReads(C(n), { inTheirHand: true })));
  ok("199b. Janna, Savior ([Reaction], a play effect lib/fight.mjs plays) is read too", turnReads(C("Janna, Savior"), { inTheirHand: true }));
  // 200. Their [Reaction] unit (Shen, Kinkou) joins the defence of a battlefield they control: our 4 into their 2 + 3.
  const p200 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [tok("H", 1, 0, 0), tok("Four", 4, 0, -1), tok("Wall 2", 2, 1, 1)], their: { hand, budget: { e: 9, p: 9 } } });
  ok("200. nothing in their hand: win", solveTurn(p200([])).win);
  ok("200b. their Shen, Kinkou is played into B: no win", !solveTurn(p200([C("Shen, Kinkou")])).win);
}

{
  // ── 24 Nov, units that come into a fight play their play effects (lib/fight.mjs AMBUSH_PLAYS) ──
  const tok = (n, m, side, at, ready = true) => ({ card: { n, t: "Unit", m, x: "", token: true }, side, at, ready });
  // 201. Their Janna, Savior ([Reaction]) at B sends our 6 home before combat; B holds. The 6 survives at base.
  const p201 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: [], units: [tok("H", 1, 0, 0), tok("Six", 6, 0, -1), tok("Wall 3", 3, 1, 1)], their: { hand, budget: { e: 9, p: 9 } } });
  ok("201. their hand empty: win", solveTurn(p201([])).win);
  ok("201b. their Janna sends our attacker home: no win", !solveTurn(p201([C("Janna, Savior")])).win);
  // 202. Our Lord Broadmane ambushes into our attack: our other attacker gets [Assault] (3 + 1 + 5 vs 8).
  const p202 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Fury", 6), hand, units: [tok("H", 1, 0, 0), tok("Three", 3, 0, -1), tok("Wall 8", 8, 1, 1)] });
  ok("202. a plain 5 M ambusher: trade, no win", !solveTurn(p202([{ n: "Plain Ambusher", t: "Unit", e: 5, p: 1, d: ["Fury"], m: 5, x: "[Ambush]" }])).win);
  ok("202b. Lord Broadmane's [Assault]: win", solveTurn(p202([C("Lord Broadmane")])).win);
  // 203. Our Morgana, Vindictive ambushes after Smite: their 6 with 3 marked takes 3 more and dies before combat.
  const p203 = (hand) => ({ score: [6, 5], ctrl: [0, 1], beginning: true, runes: R("Fury", 9), hand, units: [tok("H", 1, 0, 0), tok("Two", 2, 0, -1), tok("Wall 6", 6, 1, 1)] });
  const r203 = solveTurn(p203([C("Smite"), C("Morgana, Vindictive")]));
  ok("203. Morgana doubles Smite's marked damage: win", r203.win && r203.line.some((l) => /Morgana, Vindictive deals 3 more/.test(l)), show(r203));
  ok("203b. no damage marked: Morgana's play does nothing", !solveTurn(p203([C("Morgana, Vindictive")])).line.some((l) => /deals \d+ more/.test(l)));
}

{
  // 204. A face-down gear with no unit of ours to attach to stays at its battlefield as gear (with its metadata: until 24 Nov
  // it skipped gearMeta and the next gear ability crashed the solver).
  const r204 = solveTurn({ score: [3, 5], ctrl: [null, 0], beginning: false, scored: [], runes: R("Mind", 1), gear: [C("Orb of Regret")], units: [{ card: { n: "Two", t: "Unit", m: 2, x: "", token: true }, side: 0, at: -1, ready: true }], down: [[[], []], [[C("Edge of Night")], []]] });
  ok("204. face-down Edge of Night with no host, then Orb of Regret: no crash", !!r204, r204?.line?.join(" | "));
}

{
  // 205. For lib/match.mjs: solveTurn returns its final state; units keep a link to the position's (src); what it leaves for
  // later turns is counted (Scuttle Crab: "When you play me, draw 1"; Kinkou Initiate's draw has a condition: not counted).
  const mine = { card: { n: "Holder", t: "Unit", m: 1, x: "", token: true }, side: 0, at: 0, ready: true };
  const r205 = solveTurn({ score: [2, 2], ctrl: [0, null], scored: [0], runes: R("Calm", 4), hand: [C("Scuttle Crab")], units: [mine] }, { develop: true });
  ok("205. the final state comes back, with the position's unit linked", !!r205.state && r205.state.units.some((u) => u.src === mine), show(r205));
  ok("205b. Scuttle Crab's draw is counted for later", r205.state.drawsLater === 1 && r205.line.some((l) => /play Scuttle Crab/.test(l)), `drawsLater ${r205.state.drawsLater}`);
  const r205c = solveTurn({ score: [2, 2], ctrl: [0, null], scored: [0], runes: R("Calm", 4), hand: [C("Kinkou Initiate")], units: [mine] }, { develop: true });
  ok("205c. Kinkou Initiate's conditional draw isn't", !r205c.state.drawsLater, `drawsLater ${r205c.state.drawsLater}`);
}

console.log(failed ? `\n${failed} failed` : "\nall turn tests pass");
process.exit(failed ? 1 : 0);
