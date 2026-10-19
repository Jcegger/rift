// Tests for lib/decks.mjs, against the real catalog and hand-made decks that break
// one rule each. No network: the collection here is synthetic.
//
//   node lib/decks.test.mjs        (or scripts/rift's node: see README)

import { readFileSync } from "node:fs";
import { indexCatalog, deckStats, deckChecks, ownedByIdentity, bestPrice, journalRecord } from "./decks.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const idx = indexCatalog([...R("cards.json").cards, ...(R("extras.json").cards || [])], R("banned.json"));
const code = (name, t) => {
  const c = idx.cards.find((x) => x.n === name && (!t || x.t === t) && !x.v);
  if (!c) throw new Error(`no catalog card ${name}`);
  return c.c;
};

let failed = 0;
const ok = (label, cond, detail = "") => {
  if (!cond) failed++;
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
};
const check = (deck, key) => deckChecks(deck, idx, deckStats(deck, idx, {})).find((k) => k.key === key);

// A legal Rek'Sai shell: legend, 40 main, 12 runes, 3 battlefields.
const base = () => ({
  id: "t", name: "test",
  cards: {
    [code("Void Burrower", "Legend")]: 1,
    [code("Rek'Sai, Breacher")]: 3,
    [code("Void Rush")]: 3,
    [code("Cleave")]: 3, [code("Inferna")]: 3, [code("Carrion Dredger")]: 3, [code("Noxus Hopeful")]: 3,
    [code("Falling Star")]: 3, [code("Cull the Weak")]: 3, [code("Mischievous Marai")]: 3, [code("Hidden Blade")]: 3,
    [code("Undertitan")]: 3, [code("Blood Rush")]: 3, [code("Sacrifice")]: 3, [code("Deathgrip")]: 1,
    [code("Fury Rune")]: 7, [code("Order Rune")]: 5,
    [code("Grove of the God-Willow")]: 1, [code("Altar to Unity")]: 1, [code("Back-Alley Bar")]: 1,
  },
  sb: {},
});

console.log("legal deck");
{
  const d = base();
  const st = deckStats(d, idx, {});
  ok("counts 1 / 40 / 12 / 3", st.count.legend === 1 && st.count.main === 40 && st.count.rune === 12 && st.count.battlefield === 3,
    JSON.stringify(st.count));
  const bad = deckChecks(d, idx, st).filter((k) => k.ok !== true);
  ok("every check passes", !bad.length, bad.map((k) => `${k.key}: ${k.val}`).join(", "));
}

console.log("each rule, broken once");
{
  const d = base(); d.cards[code("Cleave")] = 4;
  ok("4 copies fails copies", check(d, "copies").ok === false);
  ok("…and the main count", check(d, "main").ok === false);
}
{
  const d = base(); delete d.cards[code("Deathgrip")]; d.sb[code("Cleave")] = 1;
  ok("3 main + 1 side of a name fails copies (they count together)", check(d, "copies").ok === false);
}
{
  const d = base(); delete d.cards[code("Deathgrip")]; d.cards[code("Defy")] = 1;
  ok("a Calm card in a Fury/Order deck fails domains", check(d, "domains").ok === false, check(d, "domains").detail.join(", "));
}
{
  const d = base(); delete d.cards[code("Deathgrip")]; d.cards[code("Blade of the Exile")] = 1;
  const k = check(d, "signatures");
  ok("Riven's signature with Rek'Sai fails signatures", k.ok === false, k.detail.join(", "));
}
{
  const d = base(); d.cards[code("Fury Rune")] = 8;
  ok("13 runes fails runes", check(d, "runes").ok === false);
}
{
  const d = base(); d.cards[code("Altar to Unity")] = 2; delete d.cards[code("Back-Alley Bar")];
  ok("a repeated battlefield fails battlefields", check(d, "battlefields").ok === false);
}
{
  const d = base(); d.sb[code("Fury Rune")] = 1;
  ok("a rune in the sideboard fails sideboard", check(d, "sideboard").ok === false);
}
{
  const d = base();
  for (const n of ["Gust", "Charm", "Defy", "Discipline", "Back Off", "Hush", "Not So Fast", "Ki Burst", "Acceptable Losses", "Star-Crossed", "Rebuke"]) d.sb[code(n)] = 1;
  ok("11 sideboard cards fails sideboard", check(d, "sideboard").ok === false, check(d, "sideboard").val);
}
{
  const d = base(); delete d.cards[code("Deathgrip")]; d.cards[code("Stacked Deck")] = 1;
  ok("a banned card fails banned", check(d, "banned").ok === false);
}
{
  const d = base(); delete d.cards[code("Rek'Sai, Breacher")];
  ok("no champion unit fails champion", check(d, "champion").ok === false);
}
{
  const d = base(); d.cards[code("Mischievous Marai")] = 2; d.cards[code("Siren of the Shallows")] = 1;
  const k = check(d, "standard");
  // Off-domain too, but the point here is the date: a Radiance card reads "later".
  ok("a Radiance card before release reads 'later', not illegal", k.ok === "later" || idx.notYetStandard(idx.BY.get(code("Siren of the Shallows"))) === null,
    k.val);
}

console.log("owning and pricing");
{
  const alt = idx.cards.find((x) => x.n === "Riven, Broken Blade" && x.v === "alt");
  const baseCode = code("Riven, Broken Blade");
  const own = ownedByIdentity({ [alt.c]: { n: 1 }, [baseCode]: { f: 1 } }, idx);
  ok("an alt art and a foil base count as 2 of one card", own.get(idx.identity(alt)) === 2);
  const d = { cards: { [baseCode]: 3 }, sb: { [baseCode]: 1 } };
  const st = deckStats(d, idx, { [alt.c]: { n: 2 } });
  ok("owning 2 alts: main is 1 short, sideboard has no spare", st.rows[0].short === 1 && st.side[0].short === 1,
    `main short ${st.rows[0].short}, side short ${st.side[0].short}`);
  const unpriced = idx.cards.find((x) => !x.mp && x.t === "Unit" && !(idx.byId.get(idx.identity(x)) || []).some((y) => y.mp));
  if (unpriced) {
    const s2 = deckStats({ cards: { [unpriced.c]: 1 }, sb: {} }, idx, {});
    ok("an unpriced card is counted as unpriced, not $0", s2.mainGap.unpriced === 1 && s2.rows[0].cost === null, unpriced.n);
    ok("bestPrice of an unpriced card is null", bestPrice(unpriced, idx) === null);
  } else ok("an unpriced card exists to test with", false);
}

console.log("journal");
{
  const j = [{ deck: "a", opp: "Irelia", res: "W" }, { deck: "a", opp: "Irelia", res: "L" }, { deck: "b", opp: "Irelia", res: "W" }, { deck: "a", opp: "Kennen", res: "D" }];
  const r = journalRecord(j, "a");
  ok("record per opponent, one deck", r.get("Irelia").w === 1 && r.get("Irelia").l === 1 && r.get("Kennen").d === 1);
  ok("all decks", journalRecord(j).get("Irelia").w === 2);
}

// Card text lifts the copy limit: 39 Spiderling is a legal main deck (Yasuo, Nova #3).
{
  const spider = idx.cards.find((c) => c.n === "Spiderling" && !c.v);
  const yasuo = idx.cards.find((c) => c.t === "Legend" && /Unforgiven/.test(c.n) && !c.v);
  const d = { id: "s", name: "s", cards: { [yasuo.c]: 1, [spider.c]: 39, [code("Yasuo, Windrider")]: 1 }, sb: {} };
  const k = deckChecks(d, idx, deckStats(d, idx, {})).find((x) => x.key === "copies");
  ok("a card that allows any number of copies is not over the limit", k && k.ok === true, k && k.val);
}

console.log(failed ? `\n${failed} FAILED` : "\nall deck tests pass");
process.exit(failed ? 1 : 0);
