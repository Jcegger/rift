// Tests for lib/identity.mjs and lib/pool.mjs (`rift identity`, `rift pool`), on the real catalog
// and snapshot. No network.
//
//   node lib/identity.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog, mainOf } from "./decks.mjs";
import { atLeastOne, readIdentity, checkList, NEEDS } from "./identity.mjs";
import { legendPool, LABELS, MIN_TWIN_GOOD } from "./pool.mjs";
import { tagsOf } from "./interactions.mjs";
import { jobsOf } from "./jobs.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cards = [...R("cards.json").cards, ...(R("extras.json").cards || [])];
const idx = indexCatalog(cards, R("banned.json"));
const cat = { cards, BY: idx.BY, idx };
const code = (name, t) => { const c = cards.find((x) => x.n === name && (!t || x.t === t) && !x.v); if (!c) throw new Error(`no ${name}`); return c.c; };
const byName = (n) => cards.find((x) => x.n === n && !x.v);

let failed = 0;
const ok = (label, cond, detail = "") => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`); };

console.log("consistency odds (docs/deckbuilding-theory.md table)");
ok("8 copies, 4 seen: 61%", Math.round(100 * atLeastOne(8, 4)) === 61, atLeastOne(8, 4));
ok("3 copies, 8 seen: 50%", Math.round(100 * atLeastOne(3, 8)) === 50);
ok("12 copies, 10 seen: 98%", Math.round(100 * atLeastOne(12, 10)) === 98);
ok("0 copies: 0", atLeastOne(0, 9) === 0);

console.log("identity block");
const md = "# brew\n\n```identity\n{\"plan\": \"p\", \"jobs\": {\"removal\": {\"by\": 9, \"target\": 0.75}}}\n```\n";
ok("reads the fenced block", readIdentity(md)?.jobs?.removal?.target === 0.75);
ok("no block → null", readIdentity("# nothing") === null);
let threw = false; try { readIdentity("```identity\n{bad\n```"); } catch { threw = true; }
ok("bad JSON says so", threw);

// The legal Rek'Sai shell from lib/decks.test.mjs.
const base = () => ({ id: "t", name: "t", sb: {}, cards: {
  [code("Void Burrower", "Legend")]: 1, [code("Rek'Sai, Breacher")]: 1, [code("Void Rush")]: 3,
  [code("Cleave")]: 3, [code("Inferna")]: 3, [code("Carrion Dredger")]: 3, [code("Noxus Hopeful")]: 3,
  [code("Falling Star")]: 3, [code("Cull the Weak")]: 3, [code("Mischievous Marai")]: 3, [code("Hidden Blade")]: 3,
  [code("Undertitan")]: 3, [code("Blood Rush")]: 3, [code("Sacrifice")]: 3, [code("Deathgrip")]: 3,
  [code("Fury Rune")]: 7, [code("Order Rune")]: 5,
  [code("Grove of the God-Willow")]: 1, [code("Altar to Unity")]: 1, [code("Back-Alley Bar")]: 1 } });
const rule = (r, re) => r.rules.find((x) => re.test(x.label));

console.log("rules");
{
  const d = base();
  const r = checkList(d, idx, { anchor: { name: "itself", main: mainOf(d.cards, (c) => idx.BY.get(c)) } });
  ok("one champion copy passes", rule(r, /champion's units/).ok === true, rule(r, /champion's units/).val);
  ok("0 changes against itself", r.change === 0);
  const two = base(); two.cards[code("Rek'Sai, Breacher")] = 2; two.cards[code("Deathgrip")] = 2;
  ok("two champion copies fail", rule(checkList(two, idx), /champion's units/).ok === false);
  ok("no anchor is a warning", rule(checkList(d, idx), /anchor/).ok === "warn");
  const far = base(); for (const n of ["Void Rush", "Cleave", "Inferna", "Carrion Dredger", "Noxus Hopeful", "Falling Star"]) delete far.cards[code(n)];
  for (const n of ["Hextech Ray", "Stupefy", "Tideturner", "Gust", "Rebuke", "Defy"]) far.cards[code(n)] = 3;
  const rf = checkList(far, idx, { anchor: { name: "base", main: mainOf(base().cards, (c) => idx.BY.get(c)) } });
  ok("18 changes reads as a new deck", rf.change === 18 && rule(rf, /anchor/).ok === "new", `${rf.change}`);
}

console.log("jobs");
{
  const r = checkList(base(), idx, { identity: { jobs: { removal: { by: 9, target: 0.75 }, closer: { cards: ["Undertitan"], target: 0.9 } } } });
  const rem = r.jobs.find((j) => j.job === "removal"), cl = r.jobs.find((j) => j.job === "closer");
  ok("removal counted from card text", rem.copies >= 9, rem.cards.join(", "));
  ok("a job the identity names cards for counts only those", cl.copies === 3 && cl.ok === false, `${cl.copies}, ${Math.round(100 * cl.p)}%`);
  ok("Rebuke is a bounce usable on their turn", jobsOf(byName("Rebuke")).jobs.has("bounce") && jobsOf(byName("Rebuke")).theirTurn);
  ok("Ezreal, Prodigy is a mid unit that draws", ["mid-unit", "draw"].every((j) => jobsOf(byName("Ezreal, Prodigy")).jobs.has(j)));
}

console.log("enablers");
{
  // A card that needs a resource only cards make, dropped into a list with nothing that makes it.
  const needy = cards.find((c) => !c.v && /Unit|Spell|Gear/.test(c.t) && tagsOf(c).consumes.some((x) => x.spec === "high" && NEEDS.has(x.res))
    && (c.d || []).every((d) => ["Fury", "Order", "Colorless"].includes(d)));
  if (!needy) ok("a needy Fury/Order card exists to test with", false);
  else {
    const d = base(); d.cards[needy.c] = (d.cards[needy.c] || 0) + 1; d.cards[code("Deathgrip")] = 2;
    const res = tagsOf(needy).consumes.find((x) => x.spec === "high" && NEEDS.has(x.res)).res;
    const made = Object.keys(base().cards).some((k) => tagsOf(idx.BY.get(k)).produces.some((p) => p.res === res));
    const r = checkList(d, idx);
    ok(`${needy.n} (needs ${res}) is flagged unless the list makes it`, made || r.orphans.some((o) => o.card === needy.n), made ? "the shell makes it" : "");
  }
}

console.log("pool");
{
  const legend = cards.find((c) => c.t === "Legend" && !c.v && idx.legendName(c) === "Sivir, Battle Mistress");
  const P = legendPool(cat, R("decks.json").decks, legend);
  const names = new Set(P.cards.map((r) => r.card.n));
  ok("Sivir's own signature is in", names.has("On the Hunt"));
  ok("another champion's signature is not", !P.cards.some((r) => idx.signatureOf(r.card) && idx.signatureOf(r.card) !== "Sivir"));
  ok("never Aurora", !names.has("Dazzling Aurora"));
  ok("nothing banned", !P.cards.some((r) => idx.bannedNames.has(r.card.n)));
  ok("nothing off-domain", P.cards.every((r) => (r.card.d || []).every((d) => ["Body", "Chaos", "Colorless"].includes(d))));
  ok("sorted by evidence label", P.cards.every((r, i) => !i || LABELS.indexOf(P.cards[i - 1].label) <= LABELS.indexOf(r.label)));
  const thin = new Set(P.twins.filter((t) => t.good < MIN_TWIN_GOOD).map((t) => t.legend));
  ok("'proven under' never rests on a legend with too few good finishes", !P.cards.some((r) => r.under && thin.has(r.under.legend)));
  const eve = P.cards.find((r) => r.card.n === "Evelynn, Entrancing");
  ok("another legend's own champion is marked as such", !eve?.under || eve.under.theirChampion);
}

console.log(failed ? `\n${failed} FAILED` : "\nall identity and pool tests pass");
process.exit(failed ? 1 : 0);
