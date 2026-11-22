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
