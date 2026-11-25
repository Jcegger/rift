import { test } from "node:test";
import assert from "node:assert/strict";
import { matchup, matchupLine } from "./winrates.mjs";

const W = { generatedAt: "2026-11-21", filters: { window: "Latest 7,000" }, pairs: [
  { a: "Kai'Sa", b: "Riven", wr: 48.1, n: 70 },
  { a: "Master Yi, Wuju Bladesman", b: "Vex", wr: 55, n: 12 },
] };

test("matches by champion when RiftLite drops the title", () => {
  assert.equal(matchup(W, "Kai'Sa, Daughter of the Void", "Riven, The Exile").wr, 48.1);
});
test("matches the full name where RiftLite keeps it", () => {
  assert.equal(matchup(W, "Master Yi, Wuju Bladesman", "Vex, Gloomist").n, 12);
});
test("says so when there are no games, and flags small samples", () => {
  assert.match(matchupLine(W, "Sivir, Battle Mistress", "Vex, Gloomist"), /no online games/);
  assert.match(matchupLine(W, "Master Yi, Wuju Bladesman", "Vex, Gloomist"), /under 30 games/);
  assert.match(matchupLine(W, "Kai'Sa", "Riven"), /48% vs Riven over 70 online games/);
});

// scripts/build-winrates.mjs parseMatches: the page's embedded match records, escaped as in its RSC payload.
test("parseMatches keeps day, legends, result and format; drops incomplete, superseded, merged and repeats", async () => {
  const { parseMatches, poolMatches } = await import("../scripts/build-winrates.mjs");
  const rec = (id, date, result, me, opp, extra = "") => `{\\"id\\":\\"riftlite-${id}\\",\\"username\\":\\"someone\\",\\"date\\":\\"${date}T10:00:00.000Z\\",\\"result\\":\\"${result}\\",\\"myChampion\\":\\"${me}\\",\\"oppChampion\\":\\"${opp}\\",\\"oppName\\":\\"other\\",\\"fmt\\":\\"Bo1\\",\\"games\\":[{\\"result\\":\\"Win\\"}],\\"superseded\\":false${extra}}`;
  const html = [
    rec("a1", "2026-11-24", "Win", "Vex", "Ornn"),
    rec("a2", "2026-11-22", "Loss", "Kai&#x27;Sa", "Vex"),
    rec("a3", "2026-11-24", "Incomplete", "Vex", "Ornn"),
    rec("a4", "2026-11-24", "Win", "Vex", "Ornn", `,\\"mergedIntoMatchId\\":\\"riftlite-a1\\"`),
    rec("a5", "2026-11-24", "Win", "Vex", "Ornn").replace(`\\"superseded\\":false`, `\\"superseded\\":true`),
    rec("a1", "2026-11-24", "Win", "Vex", "Ornn"),
  ].join(",");
  const ms = parseMatches(html);
  assert.deepEqual(ms.map(({ k, ...m }) => m), [{ d: "2026-11-24", a: "Vex", b: "Ornn", w: 1, fmt: "Bo1" }, { d: "2026-11-22", a: "Kai'Sa", b: "Vex", w: 0, fmt: "Bo1" }]);
  const { mergeMatches } = await import("../scripts/build-winrates.mjs");
  const merged = mergeMatches([ms[0]], ms);
  assert.equal(merged.added, 1); assert.equal(merged.all.length, 2); assert.equal(merged.all[0].d, "2026-11-22");
  assert.ok(!JSON.stringify(ms).includes("someone"));
  const all = poolMatches(ms), post = poolMatches(ms, "2026-11-23");
  assert.deepEqual(all.get("Vex"), { w: 2, n: 2 });
  assert.deepEqual(post.get("Vex"), { w: 1, n: 1 });
});
