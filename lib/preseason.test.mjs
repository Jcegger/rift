// Tests for lib/preseason.mjs: the maths of the preseason model, on hand-made numbers, so a
// change to a constant or a formula shows up here before it moves a ranking.
//
//   node lib/preseason.test.mjs

import { score, judgment, logRatio, fitPopularity, rankSim, pool, priorStrength, K_PRIOR, K_NEW, VS_CAP, POINT, UNVERIFIED , POP_FLOOR } from "./preseason.mjs";

let failed = 0;
const ok = (what, cond) => { console.log(`${cond ? "  ok  " : "  FAIL"} ${what}`); if (!cond) failed++; };
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;

ok("no data and an average target is ×1.00", near(logRatio(0, 0, 5, 1), 0));
ok("no data sits on the target", near(Math.exp(logRatio(0, 0, 5, 0.5)), 0.5));
ok("lots of data overrides the target", Math.abs(Math.exp(logRatio(400, 200, 5, 0.5)) - 2) < 0.05);
ok("pool sums weighted rows", (() => { const p = pool([{ o: 4, e: 2 }, { o: 2, e: 2, w: 0.5 }]); return p.O === 5 && p.E === 3; })());

const j = judgment([{ component: "transfers", points: 2, verified: true }, { component: "schedule", points: -2, verified: false }]);
ok("an unverified row counts half", near(j.total, 2 - 2 * UNVERIFIED) && near(j.by.schedule, -2 * UNVERIFIED));

const base = { ret: { O: 0, E: 0 } };
ok("one judgment point moves the prior by POINT", near(score({ ...base, rows: [{ component: "transfers", points: 1, verified: true }] }).prior, POINT));
ok("with no results the score is the prior", near(score(base).post, score(base).prior) && score(base).resultsWeight === 0);
const strong = score({ ...base, season: { O: 40, E: 20 } });
ok("a new legend's prior is weak: K_NEW expected tops of results carry half its score", near(score({ ...base, season: { O: K_NEW, E: K_NEW } }).resultsWeight, 0.5));
ok("a full returning record makes the prior strong, near K_PRIOR", priorStrength(1e6) > K_PRIOR - 0.01 && priorStrength(0) === K_NEW);
ok("a vs row counts as much as its target is good, capped", (() => { const r = [{ component: "schedule", points: 2, verified: true, vs: ["X"] }]; return near(judgment(r, () => 0.5).total, 1) && near(judgment(r, () => 9).total, 2 * VS_CAP); })());
ok("a new legend's prior is all popularity", near(score({ ret: { O: 0, E: 0 }, target: 1.5 }).prior, Math.log(1.5)));
ok("an established legend's prior is ~60% its record, ~40% popularity", (() => { const s = score({ ret: { O: 2000, E: 1000 }, target: 1 }); return s.carry > 0.59 && s.carry < 0.6 && near(s.prior, s.carry * s.retLog, 1e-9); })());
ok("strong results pull an average prior up", strong.post > 0.5 && strong.post < Math.log(2));
ok("the range widens with no data", score(base).hi - score(base).lo > score({ ret: { O: 200, E: 120 } }).hi - score({ ret: { O: 200, E: 120 } }).lo);

const pop = fitPopularity([{ share: 0.1, O: 30, E: 15 }, { share: 0.05, O: 12, E: 12 }, { share: 0.01, O: 1, E: 6 }, { share: 0.02, O: 3, E: 8 }], 1.8);
ok("popularity fit: more popular converts better here", pop.slope > 0);
ok("the target is bounded by the floor and the cap", pop.target(0.9) <= 1.8 && pop.target(0.0001) >= POP_FLOOR && pop.target(0) === POP_FLOOR);

const items = [{ post: 1, sd: 0.01 }, { post: 0, sd: 0.01 }, { post: -1, sd: 0.01 }];
const sim = rankSim(items, 500);
ok("rank simulation keeps a clear order", sim[0].p10 === 1 && sim[0].p90 === 1 && sim[2].p10 === 3);
ok("rank simulation is deterministic", JSON.stringify(rankSim(items, 200)) === JSON.stringify(rankSim(items, 200)));

console.log(failed ? `\n${failed} FAILED` : "\nall preseason checks pass");
process.exit(failed ? 1 : 0);
