// Tests for lib/field.mjs: how grades are read, agreed on and checked against the record.
//
//   node lib/field.test.mjs

import { gradeValue, gradeOf, gradeFor, letterOf, consensus, recordRatio, recordTier, disagreement, groupOf, handedOver, resultsRatio } from "./field.mjs";

let failed = 0;
const ok = (what, cond) => { console.log(`${cond ? "  ok  " : "  FAIL"} ${what}`); if (!cond) failed++; };
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;

ok("letters read S 5 … F 0", gradeValue("S") === 5 && gradeValue("F") === 0 && gradeValue("b") === 3);
ok("low/high move a third", near(gradeValue("low A"), 4 - 1 / 3) && near(gradeValue("high C"), 2 + 1 / 3));
ok("tier numbers read as letters", gradeValue("1") === 5 && gradeValue("1.5") === 4 && gradeValue("Tier 2.5") === 2);
ok("a rank, a card score or a group is not a grade", [gradeValue("4/5"), gradeValue("top group"), gradeValue("best legend"), gradeValue("bottom")].every((v) => v === null));
ok("a rank is not a tier number", gradeFor("2", "rank 1–9, new legends") === null && gradeFor("1", "Tier 1 / 1.5 / 2 / 2.5") === 5 && gradeFor("A", "rank 1–9") === 4);
ok("'C or B' and 'A/B' are between them", gradeOf("C or B") === 2.5 && gradeOf("low S or high A") === 4.5 && gradeOf("A/B") === 3.5);
ok("a card score is not a between-grade", gradeOf("4/5") === null);

// Kennen, 22 Oct 2026: S from LotharHS and Zelonius, Tier 1 from Takolandia and Digi Slots.
const k = consensus(["S", "S", "1", "1"].map(gradeOf));
ok("Kennen's four full-coverage grades make S, agreed", k.tier === "S" && k.agreement === "agree");
ok("one outlier among many does not split", consensus([5, 5, 5, 5, 5, 5, 4, 4, 3]).agreement === "agree");
ok("a spread middle half splits", consensus([5, 5, 2, 2, 4, 1]).agreement === "split");
ok("under three grades is thin", consensus([5, 4]).agreement === "thin");
ok("no grades, no tier", consensus([]) === null);
ok("letterOf rounds to the nearest grade", letterOf(4.6) === "S" && letterOf(4.4) === "A" && letterOf(-1) === "F");

// Kennen's Vendetta RQs: 202 Day 2s against about 115 expected — S on the record.
ok("Kennen's record is S", recordTier(recordRatio(202, 115)) === "S");
ok("no record reads average (A)", recordTier(recordRatio(0, 0)) === "A");
ok("a record two tiers off is flagged", disagreement("S", { tier: "B", E: 40 })?.by === -2);
ok("one tier off is not", disagreement("S", { tier: "A", E: 40 }) === null);
ok("a thin record is never flagged", disagreement("S", { tier: "D", E: 3 }) === null);

ok("no new-format results: the experts keep the tier", !handedOver({ rqTables: 0, majors: 4 }));
ok("five 40+ player events hand over", handedOver({ majors: 5 }));
ok("Riot's first RQ table hands over", handedOver({ rqTables: 1, majors: 0 }));
ok("a week-old result counts more than a month-old one", (() => {
  const fresh = resultsRatio([{ o: 4, e: 2, age: 0 }, { o: 0, e: 2, age: 28 }]), stale = resultsRatio([{ o: 0, e: 2, age: 0 }, { o: 4, e: 2, age: 28 }]);
  return fresh.ratio > stale.ratio;
})());
ok("thin new-format results give no tier", resultsRatio([{ o: 2, e: 1, age: 0 }]).tier === null);
ok("enough results give one", resultsRatio([{ o: 12, e: 6, age: 0 }]).tier === "S");

ok("3 preview pilots is LIKELY", groupOf(3, null) === "LIKELY");
ok("5% of last Day 1 is LIKELY", groupOf(0, 0.06) === "LIKELY");
ok("1 pilot is POSSIBLE", groupOf(1, 0) === "POSSIBLE");
ok("a new legend nobody played is UNKNOWN, not RARE", groupOf(0, null) === "UNKNOWN");
ok("an old legend nobody plays is RARE", groupOf(0, 0.001) === "RARE");

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log("\nall passed");
