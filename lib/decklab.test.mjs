// Tests for lib/decklab.mjs, against the real catalog. No network.
//
//   node lib/decklab.test.mjs

import { loadCatalog } from "../scripts/state.mjs";
import { parseChanges, applyChanges, shapeOf, answerNames, fieldOf, engineReport, SCENARIOS, scoreTiers } from "./decklab.mjs";

const cat = await loadCatalog();
const card = (n) => cat.cards.find((c) => c.n === n && !c.v);
let failed = 0;
const ok = (label, cond, detail = "") => {
  if (!cond) failed++;
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
};
const throws = (f) => { try { f(); return false; } catch { return true; } };

console.log("reading a change");
const ch = parseChanges(["-2 Edge of Night", "+elnuk herd", "sb+Rebuke", "sb-Existential Dread"], cat.cards);
ok("counts, case and sides read", ch[0].qty === -2 && ch[1].name === "Elnuk Herd" && ch[1].qty === 1 && ch[2].side === "sb" && ch[3].qty === -1);
ok("a unique prefix is enough", parseChanges(["+Tail-Cloaked"], cat.cards)[0].name === "Tail-Cloaked Matriarch");
ok("an ambiguous name is refused", throws(() => parseChanges(["+Evelynn"], cat.cards)));
ok("an unknown name is refused", throws(() => parseChanges(["+Not A Card"], cat.cards)));
ok("a change with no sign is refused", throws(() => parseChanges(["Gust"], cat.cards)));

console.log("making it");
const edge = card("Edge of Night"), sw = card("Switcheroo"), gust = card("Gust");
const deck = { name: "t", cards: { [edge.c]: 2, [sw.c]: 2 }, sb: { [gust.c]: 1 } };
const after = applyChanges(deck, parseChanges(["-Edge of Night", "+Switcheroo", "sb-Gust"], cat.cards), cat.cards, cat.BY);
ok("removes from the printing the deck runs", after.cards[edge.c] === 1);
ok("adds to the printing the deck already runs", after.cards[sw.c] === 3);
ok("the sideboard changes on its own side", !(gust.c in after.sb));
ok("the original deck is untouched", deck.cards[edge.c] === 2 && deck.sb[gust.c] === 1);
ok("removing more than the deck has is refused", throws(() => applyChanges(deck, parseChanges(["-3 Edge of Night"], cat.cards), cat.cards, cat.BY)));

console.log("shape and answers");
const sh = shapeOf(after, cat.BY);
ok("shape counts the main deck only", sh.cards === 4 && sh.gear === 1 && sh.spells === 3 && sh.side === 0);
ok("Hidden spells and gear counted", sh.hidden === 4 && sh.hiddenNonUnit === 4);
ok("printed Power by colour", sh.power.Chaos === 6);
const ans = answerNames({ cards: { [sw.c]: 1, [gust.c]: 1, [card("Star-Crossed").c]: 1, [card("Punch First").c]: 1 } }, cat.BY);
ok("Switcheroo and Star-Crossed answer any size; Gust and Punch First don't", ans.includes("Switcheroo") && ans.includes("Star-Crossed") && !ans.includes("Gust") && !ans.includes("Punch First"));

console.log("field");
const row = (n, share) => ({ card: card(n), share, avg: 1 });
const fd = [{ label: "A", n: 3, placed: 1, theirs: [row("Defy", 1), row("Astral Heron", 0.5), row("Gust", 0.5)] },
            { label: "B", n: 1, placed: 3, theirs: [row("Astral Heron", 0.5)] }];
const f = fieldOf({ cards: { [sw.c]: 3, [gust.c]: 2, [card("Staunch Survivor").c]: 3 } }, cat.BY, fd);
ok("Defy-countered spells weight by popularity and by results", Math.abs(f.defyHits.pop - 1.5) < 1e-9 && Math.abs(f.defyHits.res - 0.5) < 1e-9, `${f.defyHits.pop} · ${f.defyHits.res}`);
ok("Switcheroo copies answer a 7-Might unit, free from face down", f.bigAns.pop === 3 && f.bigFree.pop === 3);
ok("Gust exposure counts only where they run Gust", f.per[0].exposed > 0 && f.per[1].exposed === 0);

console.log("engine report");
const sc2 = card("Star-Crossed");
const small = { cards: { [cat.cards.find((c) => c.t === "Legend" && c.n === "Battle Mistress").c]: 1, [card("Staunch Survivor").c]: 3, [card("Traveling Merchant").c]: 3,
  [sw.c]: 3, [sc2.c]: 3, [card("Fizz, Trickster").c]: 3, [card("Ezreal, Prodigy").c]: 3, [card("Evelynn, In Control").c]: 3, [card("Tail-Cloaked Matriarch").c]: 3,
  [card("Punch First").c]: 3, [card("Gust").c]: 3, [card("Tideturner").c]: 3, [card("Bedeviling Stranger").c]: 3, [card("Rampage").c]: 3,
  [cat.cards.find((c) => c.t === "Rune" && c.d?.[0] === "Body" && !c.v).c]: 6, [cat.cards.find((c) => c.t === "Rune" && c.d?.[0] === "Chaos" && !c.v).c]: 6 } };
const rep = engineReport(small, cat, { games: 400 });
ok("the report runs every scenario", Object.keys(rep.scenarios).join() === Object.keys(SCENARIOS).join());
ok("quiet has no attacks to answer; pressure does", rep.scenarios.quiet.answered === null && rep.scenarios.normal.answered != null);
ok("the same seed gives the same report", JSON.stringify(engineReport(small, cat, { games: 200 })) === JSON.stringify(engineReport(small, cat, { games: 200 })));

console.log("goal tiers");
const spec = { tiers: [{ tier: 0, goal: "g", measures: [{ key: "x.up", dir: "up" }, { key: "x.share", dir: "up" }, { key: "x.range", min: 18, max: 22 }] }] };
const sc3 = scoreTiers(spec, { x: { up: 1.0, share: 0.40, range: 18 } }, { x: { up: 1.2, share: 0.41, range: 17 } })[0].rows;
ok("a real gain in a direction is better", sc3[0].verdict === "better");
ok("a move inside the noise is the same", sc3[1].verdict === "same");
ok("leaving the worksheet's target range is worse", sc3[2].verdict === "worse" && sc3[2].inAfter === false);

console.log(failed ? `\n${failed} FAILED` : "\nall decklab checks pass");
process.exit(failed ? 1 : 0);
