// Tests for lib/engines.mjs against the real catalog: the engines this repo already
// knows by name are found, and the known false friends are not.
//
//   node lib/engines.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog } from "./decks.mjs";
import { engineTags, deckEngines } from "./engines.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const idx = indexCatalog([...R("cards.json").cards, ...(R("extras.json").cards || [])], R("banned.json"));
const card = (name, t) => idx.cards.find((c) => c.n === name && (!t || c.t === t) && !c.v);
const has = (name, engine, role, t) => engineTags(card(name, t)).some((x) => x.engine === engine && x.role === role);

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };

console.log("tags");
ok("Stellacorn Herder pays off movement", has("Stellacorn Herder", "move", "payoff"));
ok("Irelia's legend enables movement (it readies a chosen unit)", has("Blade Dancer", "move", "enabler", "Legend"));
ok("Reckless Innovator pays off becoming exhausted", has("Reckless Innovator", "exhaust", "payoff"));
ok("Ki Burst's cost exhausts a friendly unit", has("Ki Burst", "exhaust", "enabler"));
ok("Kennen's legend pays off plays from elsewhere", has("Heart of the Tempest", "offhand", "payoff", "Legend"));
ok("Lightning Rush's Flow is a play from elsewhere", has("Lightning Rush", "offhand", "enabler"));
ok("Rhasa the Sunderer counts the trash", has("Rhasa the Sunderer", "trash", "payoff"));
ok("moving an enemy unit is not movement (Blast Cone)", !has("Blast Cone", "move", "payoff") && !has("Blast Cone", "move", "enabler"));
ok("Cull the Weak feeds deaths (each player kills one of their units)", has("Cull the Weak", "death", "enabler"));
ok("reminder text is not read as card text", !engineTags(card("Nocturne, Horrifying")).some((x) => /battlefield to battlefield/.test(x.text)));

ok("Rek'Sai's legend reveals and plays from the top", has("Void Burrower", "reveal", "enabler", "Legend"));
ok("Void Rush reveals and plays from the top", has("Void Rush", "reveal", "enabler"));
ok("Rek'Sai, Breacher pays off units played from elsewhere", has("Rek'Sai, Breacher", "reveal", "payoff"));
ok("Undertitan pays off being revealed", has("Undertitan", "reveal", "payoff"));

console.log("decks");
const deck = (names) => Object.fromEntries(names.map(([q, n, t]) => [card(n, t).c, q]));
const irelia = deckEngines(deck([[1, "Blade Dancer", "Legend"], [3, "Stellacorn Herder"], [3, "Tideturner"]]), idx);
const move = irelia.find((e) => e.key === "move");
ok("an Irelia list with Herder has a movement engine", !!move);
ok("and counts the legend among its enablers", move && move.enablers.some((x) => x.legend));
ok("and suggests movement payoffs it does not run", move && move.candidates.length > 0 && move.candidates.every((c) => c.name !== "Stellacorn Herder"));
ok("suggestions stay inside the legend's domains", move && move.candidates.every((c) => (card(c.name).d || []).every((d) => d === "Colorless" || card("Blade Dancer", "Legend").d.includes(d))));
// The regression that started this: Rek'Sai read as a Deathknell deck because its patterns
// knew no other engine. Its first engine must be the top of the deck.
{
  const rek = deckEngines(deck([[1, "Void Burrower", "Legend"], [1, "Rek'Sai, Breacher"], [3, "Undertitan"], [3, "Void Rush"], [3, "Carrion Dredger"], [3, "Honest Broker"]]), idx);
  ok("Rek'Sai's strongest engine is the top of the deck, not deaths", rek[0]?.key === "reveal", rek.map((e) => e.key).join(", "));
}
ok("a list with no payoff for an engine does not get it", !deckEngines(deck([[1, "Blade Dancer", "Legend"], [3, "Tideturner"]]), idx).some((e) => e.key === "move"));

console.log("tags, round two");
ok("Void Assault moves a friendly unit (the enemy half does not void it)", has("Void Assault", "move", "enabler"));
ok("Irresistible Faefolk pays off moving", has("Irresistible Faefolk", "move", "payoff"));
ok("Void Assault and Faefolk drag an enemy in: they choose the fight", has("Void Assault", "combat", "enabler") && has("Irresistible Faefolk", "combat", "enabler"));
ok("Rengar's legend pumps fights", has("Pridestalker", "combat", "enabler", "Legend"));
ok("Draven's legend pays off winning combats", has("Glorious Executioner", "combat", "payoff", "Legend"));
ok("Inferna's own Assault is a combat payoff", has("Inferna", "combat", "payoff"));
ok("Kennen's legend hands out Assault, it is not an attacker", !has("Heart of the Tempest", "combat", "payoff", "Legend"));
ok("Kennen's legend empowering itself is not an Empower engine", !engineTags(card("Heart of the Tempest", "Legend")).some((x) => x.engine === "empower"));
ok("Ambessa's legend pays off empowering", has("Matriarch of War", "empower", "payoff", "Legend"));
ok("Fiora's legend pays off Mighty", has("Grand Duelist", "mighty", "payoff", "Legend"));
ok("Darius's legend is a Legion payoff", has("Hand of Noxus", "legion", "payoff", "Legend"));
ok("Leona's legend pays off stuns", has("Radiant Dawn", "stun", "payoff", "Legend"));
ok("Master Yi's legend levels up", has("Wuju Master", "xp", "payoff", "Legend"));
ok("Jayce's legend readies gear", has("Defender of Tomorrow", "gear", "payoff", "Legend"));
ok("LeBlanc's legend's Temporary copy dies (feeds deaths)", has("Deceiver", "death", "enabler", "Legend"));
ok("Sivir's legend readying itself is not movement", !has("Battle Mistress", "move", "enabler", "Legend"));
ok("Gold is not a token board", !has("Bloodharbor Ripper", "tokens", "enabler", "Legend"));
ok("Mordekaiser's legend turns dead units into Power (a death payoff)", has("Iron Revenant", "death", "payoff", "Legend"));

// The answer key is docs/archetypes.md: every legend's "- **Engine:**" line, hand-written
// from its plan ("none" for a deck with no loop: a curve, removal or ramp). The reader's
// strongest loop must be one the line names, for every legend except KNOWN_MISSES, each
// with why. A fix shows up as a known miss that now passes — take it off the list. When
// the reader and the line disagree, either may be wrong: Kha'Zix's line was right and the
// reader was not, which Jun's guide settled.
console.log("the field (consensus of each legend's placed lists vs docs/archetypes.md)");
const { docEngineLine, docEngineKeys } = await import("./engines.mjs");
const archMd = readFileSync(new URL("../docs/archetypes.md", import.meta.url), "utf8");
const KEY = Object.fromEntries([...archMd.matchAll(/^### (.+?) — /gm)].map((m) => [m[1], docEngineKeys(docEngineLine(archMd, m[1]))]));
{ const bad = Object.entries(KEY).filter(([, k]) => !k.length).map(([n]) => n);
  ok(`every legend in docs/archetypes.md has an Engine line the reader can match${bad.length ? `: not ${bad.join(", ")}` : ""}`, !bad.length); }
const KNOWN_MISSES = {
  "Diana, Scorn of the Moon": "her legend's showdown-only Energy is not a pattern; Hwei and Merchant make a real movement loop.",
  "Renekton, Butcher of the Sands": "a unit-ramp curve whose Assault and pumps add up to a combat loop.",
  "Sivir, Battle Mistress": "Gold and Ganking are not patterns; a Hidden loop is the strongest left.",
  "Zed, Master of Shadows": "Shadow Clone isn't read as a token maker; 4 placed lists.",
  "Pyke, Bloodharbor Ripper": "bounce-and-replay is not an engine the reader knows; 3 placed lists.",
  // 23 Oct 2026, OPEN: counted on good finishes (12), Vex's winners run enough Hidden cards for
  // the reader to call a Hidden loop; the Engine line says none. Either may be wrong — one of
  // the entries docs/archetypes.md flags to re-read.
  "Vex, Gloomist": "open: on good finishes the reader sees a Hidden loop, the doc says none; re-read the entry.",
};
{
  const { counter } = await import("./consensus.mjs");
  const { finishesMaker } = await import("./placing.mjs");
  const snap = R("decks.json");
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const cardOf = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const { consensus } = counter(idx, cardOf);
  // Placed = a good finish, once per finish (lib/placing.mjs), the definition every builder uses.
  const { goodFinishes } = finishesMaker(idx, cardOf);
  const by = new Map();
  for (const d of snap.decks) {
    if (!d.lg || !cardOf(d.lg) || Object.keys(d.cards).some((k) => idx.bannedNames.has(cardOf(k)?.n))) continue;
    const n = idx.legendName(cardOf(d.lg)); (by.get(n) || by.set(n, []).get(n)).push(d);
  }
  let hit = 0, tot = 0, lists = 0, listsHit = 0;
  for (const [name, answers] of Object.entries(KEY)) {
    const all = by.get(name) || [];
    if (!all.length) continue;
    const placed = goodFinishes(all);
    const E = deckEngines(consensus(placed.length >= 10 ? placed : all).cards, idx, { max: 0 });
    const got = E[0]?.loop ? E[0].key : "none", right = answers.includes(got);
    tot++; hit += right; lists += placed.length; listsHit += right * placed.length;
    if (KNOWN_MISSES[name]) { if (right) ok(`${name} is on KNOWN_MISSES but now reads right (${got}): take it off`, false); continue; }
    if (!right) ok(`${name}: expected ${answers.join(" or ")}, the reader says ${got} [${E.map((e) => e.key + (e.loop ? "*" : "")).join(", ")}]`, false);
  }
  // A legend with real results and no section is invisible to this key: Master Yi, Wuju
  // Bladesman (a Starter-only printing, Tier 1) went unwritten that way.
  const unwritten = [...by.entries()].filter(([n, ds]) => !KEY[n] && goodFinishes(ds).length >= 10).map(([n]) => n);
  ok(`every legend with 10+ placed lists has a section in docs/archetypes.md${unwritten.length ? `: not ${unwritten.join(", ")}` : ""}`, !unwritten.length);
  ok(`every legend not on KNOWN_MISSES reads right: ${hit} of ${tot} legends, ${listsHit} of ${lists} placed lists`, tot - hit === Object.keys(KNOWN_MISSES).filter((n) => by.has(n)).length);
}

console.log(failed ? `\n${failed} FAILED` : "\nall engine checks pass");
process.exit(failed ? 1 : 0);
