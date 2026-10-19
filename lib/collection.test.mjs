// Tests for lib/collection.mjs, against the real catalog and a synthetic collection.
// No network. When this was ported from the old app it was also run against the old
// app's own applyImport on Jay's real riftbound.gg pull and agreed on every count.
//
//   node lib/collection.test.mjs

import { readFileSync } from "node:fs";
import { indexCatalog } from "./decks.mjs";
import { applyImport, matcher, normColl, parseCSV, setCount, setSource, foilOnlyProblems,
  newqRows, newqCSV, spares, readPartner, tradeMatch } from "./collection.mjs";

const R = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const cards = [...R("cards.json").cards, ...(R("extras.json").cards || [])];
const idx = indexCatalog(cards, R("banned.json"));
const match = matcher(cards);
const base = (name, t) => cards.find((c) => c.n === name && (!t || c.t === t) && !c.v);

let failed = 0;
const ok = (label, cond, detail = "") => {
  if (!cond) failed++;
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
};
const json = (rows) => JSON.stringify({ collection: rows });

const a = cards.find((c) => !c.v && c.t === "Unit"), b = cards.find((c) => !c.v && c.t === "Spell");
const alt = cards.find((c) => c.v === "alt");

console.log("matching");
ok("public code resolves", match({ id: a.c })?.card === a);
ok("zero-padding and denominator are noise", normColl("001/298") === "1" && normColl("066a") === "66A" && normColl("T04s") === "T4S");
ok("star spelled out is the star printing", normColl("299-star") === "299*");
ok("a bare name resolves to the base printing only", match({ name: a.n })?.card.v == null);
ok("an alt art resolves to itself", alt && match({ id: alt.c })?.card === alt);
ok("an unknown row resolves to nothing", match({ id: "ZZZ-999", name: "Not a card" }) === null);
ok("CSV: quotes, escaped quotes, CRLF", JSON.stringify(parseCSV('a,"b,""c"""\r\n1,2\r\n')) === JSON.stringify([["a", 'b,"c"'], ["1", "2"]]));

console.log("import");
let s = { inv: {}, newq: {} };
let r = applyImport(s, json([{ card: a.c, standard: 2, foil: 1 }]), match, "2026-10-01");
ok("first pull imports owned counts", s.inv[a.c].n === 2 && s.inv[a.c].f === 1 && r.added === 1);
ok("first pull banks nothing for Piltover", !Object.keys(s.newq).length);

setCount(s, a.c, "w", 3);
setCount(s, b.c, "o", 2); setSource(s, b.c, "TCG order");
r = applyImport(s, json([{ card: a.c, standard: 3, foil: 1 }, { card: b.c, standard: 1 }]), match, "2026-10-02");
ok("a pull replaces owned counts", s.inv[a.c].n === 3);
ok("Want survives a pull", s.inv[a.c].w === 3);
ok("gains are banked for Piltover, by finish", s.newq[a.c]?.q === 1 && s.newq[b.c]?.q === 1 && s.newq[a.c].at === "2026-10-02");
ok("an arrival retires On the way by that much", s.inv[b.c].o === 1 && s.inv[b.c].os === "TCG order" && r.arrived === 1);

r = applyImport(s, json([{ card: a.c, standard: 3, foil: 1 }]), match, "2026-10-03");
ok("a card gone from riftbound.gg drops to zero here", !s.inv[b.c]?.n && r.cleared === 1);
ok("but its On the way is kept", s.inv[b.c]?.o === 1);
ok("the worklist clamps to what is held", newqRows(s, idx.BY).every((x) => x.code !== b.c));

s.mirrorTradeWish = true;
applyImport(s, json([{ card: a.c, standard: 3, foil: 1, wish: 1, trade: 2 }]), match);
ok("mirroring copies riftbound.gg's trade and wish counts", s.inv[a.c].w === 1 && s.inv[a.c].t === 2);
s.mirrorTradeWish = false;

r = applyImport({ inv: {}, newq: {} }, "cardid,normal\nZZZ-1,1\n" + `${a.c},2`, match);
ok("CSV import reports unmatched rows", r.unmatched.length === 1 && r.matched === 1);
let threw = false;
try { applyImport({ inv: {} }, "colour,qty\nred,1", match); } catch { threw = true; }
ok("a CSV with no card column is refused", threw);

console.log("counts");
const t = { inv: { [a.c]: { n: 1, o: 2, os: "x" } } };
setCount(t, a.c, "o", 0);
ok("clearing On the way clears its label", !("os" in t.inv[a.c]));
setCount(t, a.c, "w", -4);
ok("counts clamp at zero", !("w" in t.inv[a.c]));
setSource(t, a.c, "orphan");
ok("a label needs something on the way", !("os" in t.inv[a.c]));

console.log("foil-only and Piltover");
const fo = cards.find((c) => c.fo && c.t !== "Rune" && !/-T\d/.test(c.c));
if (fo) {
  const p = foilOnlyProblems({ [fo.c]: { n: 2 } }, idx.BY);
  ok("a Normal count on a foil-only printing is named", p.length === 1 && p[0].normal === 2);
  const csv = newqCSV([{ code: fo.c, card: fo, n: 2, f: 0, q: 2 }]).split("\n");
  ok("the Piltover file moves it to Foil", csv.length === 2 && csv[1].includes(",true,2,"));
}
const rune = cards.find((c) => c.t === "Rune");
ok("runes are left out of the Piltover file", newqCSV([{ code: rune.c, card: rune, n: 3, f: 0, q: 3 }]).split("\n").length === 1);
ok("the Piltover file drops the set size", newqCSV([{ code: a.c, card: a, n: 1, f: 0, q: 1 }]).split("\n")[1].startsWith(a.c.replace(/\/\d+$/, "") + ","));

console.log("spares and trades");
const altOf = cards.find((c) => c.v === "alt" && c.t === "Unit" && base(c.n, "Unit"));
const baseOf = base(altOf.n, "Unit");
const inv = { [baseOf.c]: { n: 3 }, [altOf.c]: { f: 2 }, [rune.c]: { n: 9 } };
const sp = spares(inv, idx, 3);
ok("spares count every printing of a card", sp.length === 1 && sp[0].surplus === 2 && sp[0].card === baseOf);
ok("runes are never spare", !sp.some((x) => x.card.t === "Rune"));
const partner = readPartner("p", { user: { user_id: 1 }, collection: [
  { card: b.c, standard: 5 }, { card: baseOf.c, standard: 0, wish: 1 }] }, match, idx, 3);
ok("a partner's surplus stands in for an empty trade list", partner.offers.get(idx.identity(b))?.qty === 2);
const m = tradeMatch(partner, new Map([[idx.identity(b), { card: b, qty: 1, why: "a deck" }]]), sp);
ok("both directions of a trade", m.theyGive.length === 1 && m.theyGive[0].qty === 1 && m.youGive.length === 1 && m.youGive[0].qty === 1);

console.log(failed ? `\n${failed} FAILED` : "\nall collection checks pass");
process.exit(failed ? 1 : 0);
