// Tests for lib/placing.mjs: what counts as a good placement.
//
//   node lib/placing.test.mjs

import { isGoodPlacing, placingClass } from "./placing.mjs";

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

console.log(failed ? `\n${failed} FAILED` : "\nall placing checks pass");
process.exit(failed ? 1 : 0);
