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

console.log("decks");
const deck = (names) => Object.fromEntries(names.map(([q, n, t]) => [card(n, t).c, q]));
const irelia = deckEngines(deck([[1, "Blade Dancer", "Legend"], [3, "Stellacorn Herder"], [3, "Tideturner"]]), idx);
const move = irelia.find((e) => e.key === "move");
ok("an Irelia list with Herder has a movement engine", !!move);
ok("and counts the legend among its enablers", move && move.enablers.some((x) => x.legend));
ok("and suggests movement payoffs it does not run", move && move.candidates.length > 0 && move.candidates.every((c) => c.name !== "Stellacorn Herder"));
ok("suggestions stay inside the legend's domains", move && move.candidates.every((c) => (card(c.name).d || []).every((d) => d === "Colorless" || card("Blade Dancer", "Legend").d.includes(d))));
ok("a list with no payoff for an engine does not get it", !deckEngines(deck([[1, "Blade Dancer", "Legend"], [3, "Tideturner"]]), idx).some((e) => e.key === "move"));

console.log(failed ? `\n${failed} FAILED` : "\nall engine checks pass");
process.exit(failed ? 1 : 0);
