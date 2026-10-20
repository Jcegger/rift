// The research queue, read. data/research.json (scripts/build-research.mjs) says, for each
// legend with enough placed lists, which suggestible cards the winning lists skip and
// what has been found out about why (docs/research.md). Shared by the site, scripts/rift
// and the builder, so a card the winners skip reads the same everywhere.
//
// The principle: a legal card that has been available all along and that a legend's
// winning lists leave out is not an untried idea — it is a question. Suggest it only
// once the question has an answer that says to test it.

export const MIN_PLACED = 10;     // below this, absence from placed lists proves nothing
export const SKIP_SHARE = 0.05;   // in fewer than this share of placed lists = skipped
export const VERDICTS = { skip: "Winners are right to skip it", test: "Worth testing anyway", model: "The model was wrong" };

// docs/archetypes.md's "- **Engine:** <name> — why" line for a legend, if it has one.
export const docEngineLine = (md, legend) => {
  const sec = String(md).split(/^### /m).find((s) => s.startsWith(`${legend} —`));
  return sec ? ((sec.match(/^- \*\*Engine:\*\*\s*([^\n]*)/m) || [])[1] || null) : null;
};
// The engine keys (lib/engines.mjs) an Engine line names, from the words before its " — ".
// "none" is a deck with no loop. Shared by the research builder, which raises a question
// when the reader disagrees, and lib/engines.test.mjs, which scores the reader against it.
const ENGINE_WORDS = { none: /^\s*none\b/i, move: /\bmov(e|es|ement|ing)\b/i, exhaust: /\bexhaust/i, buff: /\bbuff/i,
  offhand: /\bplays? from elsewhere|\bfrom (the )?trash|\boff[- ]hand/i, reveal: /\breveal|\btop of (the |your )?deck/i, trash: /\btrash/i,
  tokens: /\btoken/i, death: /\bdeath|\bdeathknell|\bdies\b|\bsacrific|\baristocrat/i, discard: /\bdiscard/i, hidden: /\bhidden|\bface ?down/i, spells: /\bspells?\b/i,
  gear: /\bgear|equip/i, legion: /\blegion/i, combat: /\bcombat|\bfights?\b|\bassault/i, mighty: /\bmighty/i, empower: /\bempower/i,
  xp: /\bxp\b|\blevel/i, stun: /\bstun/i };
export const docEngineKeys = (line) => {
  const head = String(line || "").split(/ — |\. /)[0];
  return Object.keys(ENGINE_WORDS).filter((k) => ENGINE_WORDS[k].test(head));
};

// Kebab id for a legend/card pair: "reksai-void-burrower--karthus-eternal".
export const slug = (s) => String(s).toLowerCase().normalize("NFKD").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const itemId = (legend, card) => `${slug(legend)}--${slug(card)}`;

// The research row for a card in a legend's deck, or null when there is nothing to say.
//   { status: "skipped" | "untested", share, placed, id?, verdict?, answer? }
export function statusOf(R, legend, name) {
  const L = R?.legends?.[legend];
  const s = L?.cards?.[name];
  if (!s) return null;
  const item = s.id ? (R.items || []).find((i) => i.id === s.id) : null;
  // A card answered on its own overrides its engine's answer.
  const own = item?.cards?.find((q) => q.name === name);
  const by = own?.verdict ? own : item;
  return { ...s, placed: L.placed, verdict: by?.verdict || null, answer: by?.answer || null };
}

// Whether a suggestion may be offered as an add. A skipped card is held back until its
// question is answered "test".
export const suggestible = (st) => !st || st.status !== "skipped" || st.verdict === "test";

// deckEngines() output with each candidate's research attached, the held-back ones moved
// to their own list so a panel can show them as questions instead of suggestions.
export function annotateEngines(engines, R, legend) {
  return engines.map((e) => {
    const all = e.candidates.map((c) => ({ ...c, research: statusOf(R, legend, c.name) }));
    return { ...e, candidates: all.filter((c) => suggestible(c.research)), held: all.filter((c) => !suggestible(c.research)) };
  });
}
