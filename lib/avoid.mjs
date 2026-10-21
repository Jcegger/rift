// Decks Jay will never play, whatever they win. An "Aurora deck" is one running Dazzling
// Aurora (9E gear: at the end of your turn, reveal until a unit, banish it, play it free) —
// Jayce Aurora, and any other list built on it. Jay's standing rule, 21 Oct 2026.
//
// It applies to what is SUGGESTED to Jay: a brew running one of these is kept but never
// offered (`worth` false; the CLI says why), and a swap never brings one in. It does NOT
// apply to the field: matchups, gauntlets, meta tables and scouting must still know these
// decks, because Jay plays against them.

export const NEVER_PLAY = new Set(["Dazzling Aurora"]);

// The never-play cards among a list's card names.
export const avoidedIn = (names) => [...names].filter((n) => NEVER_PLAY.has(n));
