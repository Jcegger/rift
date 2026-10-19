// Tests for lib/infer.mjs against the real catalog and data/archetypes.json: the
// sub-archetypes the cards plainly say are found, and the main archetype is reported
// against what is written by hand — with the agreement printed, because it is weak.
//
//   node lib/infer.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog } from "./decks.mjs";
import { inferLegend, cardVotes, MAINS } from "./infer.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cat = R("cards.json"), extras = R("extras.json");
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], R("banned.json"));
const A = R("archetypes.json");
const card = (name, t) => idx.cards.find((c) => c.n === name && (!t || c.t === t) && !c.v);
const inf = (legend) => A.legends.find((l) => l.name === legend)?.inferred;
const top = (legend, n = 1) => (inf(legend)?.subs || []).slice(0, n).map((s) => s.key);

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };

console.log("cards");
ok("Inferna's Assault is an aggro card", (cardVotes(card("Inferna")).main.aggro || 0) > 0);
ok("Defy is a control card", (cardVotes(card("Defy")).main.control || 0) > 0);
ok("Kai'Sa's legend mana, only for spells, is not ramp", !inferLegend(card("Daughter of the Void", "Legend"), idx).layers[0].main.includes("ramp"));
ok("a lone defender is not isolation (Bladesman vs Kha'Zix)", "lone" in cardVotes(card("Wuju Bladesman - Starter", "Legend")).sub && !("isolation" in cardVotes(card("Wuju Bladesman - Starter", "Legend")).sub));

console.log("legends (data/archetypes.json)");
ok("every legend has an inferred main and five layers", A.legends.every((l) => MAINS.includes(l.inferred?.main) && l.inferred.layers.length === 5));
ok("Kai'Sa is built on spells", top("Kai'Sa, Daughter of the Void")[0] === "spells");
ok("Jarvan IV is built on Deploy", top("Jarvan IV, Exemplar of Demacia")[0] === "deploy");
ok("Ziggs is built on bombs", top("Ziggs, Hexplosives Expert")[0] === "bombs");
ok("Viktor is built on Recruits", top("Viktor, Herald of the Arcane")[0] === "recruits");
ok("Rumble is built on a tribe", top("Rumble, Mechanized Menace")[0] === "tribes");
ok("Kha'Zix's top two include isolation", top("Kha'Zix, Voidreaver", 2).includes("isolation"));
ok("the Bladesman's top two include the lone defender", top("Master Yi, Wuju Bladesman", 2).includes("lone"));
ok("Master Yi, Wuju Bladesman has a row (it exists only as a Starter printing)", !!A.legends.find((l) => l.name === "Master Yi, Wuju Bladesman")?.profile);

// The main archetype against the heading's main word in docs/archetypes.md, where it has one.
// Pace is how a deck is played, which card text says little about: this is reported, and
// only guarded against getting worse. Raise the floor when it improves.
const md = readFileSync(new URL("../docs/archetypes.md", import.meta.url), "utf8");
let hit = 0, n = 0;
for (const [, name, label] of md.matchAll(/^### (.+?) — ([^\n*·]+)/gm)) {
  const want = MAINS.find((m) => label.trim().split(/[\s,]+/).includes(m));
  if (!want || !inf(name)) continue;
  n++; hit += inf(name).main === want;
}
const FLOOR = 20;
ok(`inferred main matches the heading on ${hit} of ${n} (floor ${FLOOR})`, hit >= FLOOR);

console.log(failed ? `\n${failed} FAILED` : "\nall infer checks pass");
process.exit(failed ? 1 : 0);
