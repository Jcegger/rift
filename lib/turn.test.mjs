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
ok("blind: Svellsongur's copied text isn't played", !turnReads(C("Svellsongur")));
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

console.log(failed ? `\n${failed} failed` : "\nall turn tests pass");
process.exit(failed ? 1 : 0);
