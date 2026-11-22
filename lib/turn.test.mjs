// Tests for lib/turn.mjs: closing-turn positions with known answers by the rules. No network.
//
//   node lib/turn.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { solveTurn, breakers, turnReads, TURN_READERS } from "./turn.mjs";

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

console.log(failed ? `\n${failed} failed` : "\nall turn tests pass");
process.exit(failed ? 1 : 0);
