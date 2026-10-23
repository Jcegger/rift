// Tests for lib/placing.mjs: what counts as a good placement.
//
//   node lib/placing.test.mjs

import { isGoodPlacing, placingClass, oneFinishEach } from "./placing.mjs";

let failed = 0;
const ok = (what, cond) => { console.log(`${cond ? "  ok  " : "  FAIL"} ${what}`); if (!cond) failed++; };

ok("last place is not a good placing", !isGoodPlacing({ tour: 1, pl: 74, ec: 74 }));
ok("top 25% of a known field is", isGoodPlacing({ tour: 1, pl: 50, ec: 206 }));
ok("just outside it is not", !isGoodPlacing({ tour: 1, pl: 52, ec: 206 }));
ok("a top 8 at 32+ players is, though outside the top 25%", isGoodPlacing({ tour: 1, pl: 8, ec: 32 }));
ok("a top 8 of 15 is not", !isGoodPlacing({ tour: 1, pl: 8, ec: 15 }));
ok("a top 3 of 15 is (top 25%)", isGoodPlacing({ tour: 1, pl: 3, ec: 15 }));
ok("no field size: a top 8 is", isGoodPlacing({ tour: 1, pl: 8, ec: null }));
ok("no field size: 9th is not", !isGoodPlacing({ tour: 1, pl: 9, ec: null }));
ok("a claimed top 8 is, as a claim", placingClass({ cp: 8 }) === "claim");
ok("a claimed top 512 is not", !isGoodPlacing({ cp: 512 }));
ok("a posted list with no finish is not", !isGoodPlacing({ tour: 0, pl: null, cp: null }));
ok("a record is a record", placingClass({ tour: 1, pl: 1, ec: 200 }) === "record");

{
  const c = (h, dt, extra = {}) => ({ lg: "X", h, cp: 4, ce: null, dt, ...extra });
  const out = oneFinishEach([c("Azir Top 4 Barcelona RQ - copy", "2026-10-03"), c("Azir Top 4 Barcelona RQ", "2026-10-01"), c("Azir Top 4 Barcelona RQ - copy 2", "2026-10-05")]);
  ok("a claim and its copies are one finish, the first post kept", out.length === 1 && out[0].dt === "2026-10-01");
  ok("two claimed places at one event are two finishes", oneFinishEach([c("A Top 4 RQ", "1"), { ...c("A Top 4 RQ", "2"), cp: 8 }]).length === 2);
  const rec = { lg: "X", tour: 1, pl: 1, ec: 74, ev: "Showdown", dt: "2" };
  ok("a claim at a record's place with its list is that record", oneFinishEach([rec, { ...c("X wins Showdown", "3"), cp: 1 }], () => true).length === 1);
  ok("…and a different list at that place is not", oneFinishEach([rec, { ...c("X wins Showdown", "3"), cp: 1 }], () => false).length === 2);
  ok("a claim naming the record's event and place is that record, however edited",
    oneFinishEach([rec, { ...c("X wins Showdown - copy 7", "3"), cp: 1, ce: "Showdown" }], () => false).length === 1);
  ok("…but not at another place", oneFinishEach([rec, { ...c("X Top 4 Showdown", "3"), cp: 4, ce: "Showdown" }], () => false).length === 2);
}

console.log(failed ? `\n${failed} FAILED` : "\nall placing checks pass");
process.exit(failed ? 1 : 0);
