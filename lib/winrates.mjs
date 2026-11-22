// Reads data/winrates.json (RiftLite's community matrix: online, user-submitted games).
// RiftLite names a legend by champion ("Kai'Sa"), adding the title only where a champion
// has two legends ("Master Yi, Wuju Bladesman"). A lookup tries the full legend name, then
// the champion, and says which it matched.
export function matchup(W, ours, theirs) {
  if (!W?.pairs?.length) return null;
  const champ = (s) => String(s || "").split(", ")[0];
  for (const [a, b] of [[ours, theirs], [ours, champ(theirs)], [champ(ours), theirs], [champ(ours), champ(theirs)]]) {
    const p = W.pairs.find((x) => x.a === a && x.b === b);
    if (p) return p;
  }
  return null;
}

// One line for the CLI: "RiftLite: 48% over 70 online games" or why there's nothing.
export function matchupLine(W, ours, theirs) {
  if (!W) return "RiftLite win rate: no data/winrates.json";
  const p = matchup(W, ours, theirs);
  const when = `${W.filters?.window || "?"}, ${W.generatedAt}`;
  if (!p) return `RiftLite win rate: no online games logged for ${ours} vs ${theirs} (${when})`;
  return `RiftLite win rate: ${p.a} ${Math.round(p.wr)}% vs ${p.b} over ${p.n} online games (user-submitted; ${when})${p.n < 30 ? " · under 30 games: noise" : ""}`;
}
