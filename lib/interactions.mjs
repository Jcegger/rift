// Interactions and loops, derived from card text: `scripts/rift loops --deck "<name>"`.
//
// Listing a deck's combos from memory inherits the lister's blind spots. This reads each
// card (the legend, the champion and the battlefields included) for the resources it
// PRODUCES and the ones it CONSUMES or triggers on, draws an edge wherever one card makes
// something another uses, and finds the cycles: a cycle is a loop. Built blind — from the
// cards and the rules, not from a list of known combos — so known combos can test it.
//
// Pattern matching, like lib/engines.mjs whose text cleaner it shares: every tag keeps the
// sentence that matched, and nothing here knows timing or targeting. Each loop it finds is
// for a rules check (docs/rules.md first) before anything is built on it.
//
// Specificity. Nearly every card spends Power and every spell lands in the trash, so links
// through those are everywhere and mean little. Each tag is "high" (a card that names the
// resource: "a spell from your trash"), "mid" (a card that makes it on purpose: discard,
// burn) or "low" (a side effect of playing anything). A link's strength is the weaker of
// its two ends, and loops are ranked on their weakest link.

import { plainText } from "./engines.mjs";

const RANK = { high: 3, mid: 2, low: 1 };

// What each resource means, in words, for the report.
export const RESOURCES = {
  ownToHand: "your own unit back to your hand (it can be played again)",
  playMe: "a unit's own play effect (fires each time it is played)",
  revive: "a unit played from your trash",
  recast: "a spell played from your trash",
  trashSpell: "a spell in your trash",
  trashUnit: "a unit in your trash",
  trashAny: "cards in your trash, any kind",
  discard: "a discard",
  empower: "Empowered",
  empowerReset: "Empower usable again (disempowered, or a fresh copy of the card)",
  powerSpent: "Power spent this turn",
  recycleRune: "a rune recycled",
  gold: "Gold",
  enemyDeath: "an enemy unit dying",
  move: "a unit moving",
  facedown: "a card face down",
  flip: "a card played from face down (any card)",
  flipSelf: "this card played from face down",
  conquer: "a conquer",
  hold: "a hold",
  ready: "a unit readied",
  optCost: "an optional additional cost (Accelerate, Repeat, \"you may pay … as an additional cost\")",
};

// produce: [resource, pattern, specificity]; consume: the same. Patterns run on one
// sentence of plainText, lower-cased. Card-level facts (a Power cost, being a spell, Hidden)
// are added in tagsOf.
const PRODUCE = [
  ["ownToHand", /\breturn (a|another) friendly unit\b|\breturn a unit you control\b|\breturn a friendly unit and an enemy unit\b/, "high"],
  ["revive", /\b(a|an) unit in your trash\b[^.]*\bplay it\b|\bplay (it|a unit) from your trash\b/, "high"],
  ["recast", /\bplay a spell from your trash\b/, "high"],
  ["discard", /\bdiscard (\d+|a|one|two)\b/, "mid"],
  ["trashAny", /\b\[burn \d+\]|\binto your trash\b/, "mid"],
  ["trashUnit", /\bkill (a|another) friendly unit\b|\bkill me\b/, "high"],
  ["empower", /\bempower (something|a unit|another|it|them)\b/, "high"],
  ["empowerReset", /\bdisempower (it|me|something|a unit)\b/, "high"],
  ["recycleRune", /\brecycle (one of your|a) runes?\b|\byou must recycle\b[^.]*\brune/, "high"],
  ["gold", /\bgold gear token\b/, "high"],
  ["enemyDeath", /\bkill (a|an|all|each) (enemy )?units?\b|\bdeal \d+ to (a|an|each|all)\b|\bdeal damage equal to (my|their)\b|\bthey deal damage\b/, "mid"],
  ["move", /\bmove (a|an|another|up to \w+) friendly unit\b|\bmove (me|it) to\b|\[ganking\]/, "mid"],
  ["ready", /\bready (a|another|up to \w+|your)? ?(friendly )?units?\b|\bready (it|me)\b/, "mid"],
  ["facedown", /\bhide an additional card\b/, "high"],
  ["optCost", /\boptional additional costs? you pay cost\b/, "high"],
];
const CONSUME = [
  ["playMe", /\bwhen you play me\b|\bwhen i'?m played\b/, "high"],
  ["trashSpell", /\bspell (in|from) your trash\b/, "high"],
  ["trashUnit", /\bunit (in|from) your trash\b/, "high"],
  ["trashAny", /\bcards? (in|from) your trash\b|\bfor each card in your trash\b|\brecycle \d+ cards? from your trash\b/, "high"],
  ["discard", /\bwhen (you discard|i'?m discarded|discarded)\b/, "high"],
  ["empower", /\bwhen (i|it|a unit) becomes? \[?empowered\b|\[empowered\]/, "high"],
  ["empowerReset", /\buse only if not empowered\b|\bplay only if not empowered\b/, "high"],
  ["powerSpent", /\bif you'?ve spent at least\b|\bwhen you spend\b/, "high"],
  ["recycleRune", /\bwhen you recycle a rune\b/, "high"],
  ["enemyDeath", /\bwhen (one or more )?enemy units? (die|dies)\b|\bwhen an enemy unit dies\b/, "high"],
  ["move", /\bwhen (i|a friendly unit) moves?\b/, "high"],
  ["facedown", /\bif you control a facedown card\b|\bwhen you hide\b/, "high"],
  ["flip", /\bplay(ed)? a card from face ?down\b|\ba card from \[hidden\]/, "high"],
  ["flipSelf", /\bplay (this|me) from face ?down\b|\bif i was played from face ?down\b/, "high"],
  ["conquer", /\bwhen (you|i) conquer\b/, "high"],
  ["hold", /\bwhen (you|i) hold\b/, "high"],
  ["ready", /\b\[e\]:|\bexhaust (a|another) friendly unit\b/, "mid"],
  ["gold", /\bgear you control\b|\bfor each gear\b/, "mid"],
  ["optCost", /\bas an additional cost\b|\[repeat\]/, "high"],
];

const sentencesOf = (c) => plainText(c).toLowerCase().split(/(?<=[.!])\s+|\n/).map((s) => s.trim()).filter(Boolean);

// One card's tags: { produces: [{res, spec, why}], consumes: [...] }.
export function tagsOf(c) {
  const produces = [], consumes = [];
  for (const s of sentencesOf(c)) {
    for (const [res, re, spec] of PRODUCE) if (re.test(s)) produces.push({ res, spec, why: s });
    for (const [res, re, spec] of CONSUME) if (re.test(s)) consumes.push({ res, spec, why: s });
  }
  const whole = plainText(c).toLowerCase(), raw = String(c.x || "").toLowerCase();
  // Effects that run across two sentences: "choose a unit in your trash … Play it".
  if (/\bunit in your trash\b[\s\S]*\bplay it\b/.test(whole) && !produces.some((x) => x.res === "revive"))
    produces.push({ res: "revive", spec: "high", why: "chooses a unit in your trash and plays it" });
  // [Empower] is "use only if not Empowered" (the words are reminder text, which plainText drops).
  if (/\[empower\]/.test(raw) && !consumes.some((x) => x.res === "empowerReset"))
    consumes.push({ res: "empowerReset", spec: "high", why: "[Empower] can be used only if not Empowered" });
  // [Accelerate] is an optional additional cost (§805); the words are reminder text.
  if (/\[accelerate\]/.test(raw) && !consumes.some((x) => x.res === "optCost"))
    consumes.push({ res: "optCost", spec: "high", why: "[Accelerate] is an optional additional cost (§805)" });
  // A produce read from a "when you play me from face down" sentence only happens on a flip.
  // A card whose text opens on that trigger ("When you play me from face down, … Disempower it
  // at end of turn") makes every text effect part of it.
  const flipOnly = /^\s*(\[hidden\]\s*)?when you play me from face ?down\b/.test(whole);
  for (const x of produces) if (/from face ?down/.test(x.why) || (flipOnly && !/^(Hidden|a spell|a unit|any unit|units|costs|Power|hiding)/i.test(x.why))) x.needsFlip = true;
  // A discard puts a card in your trash, of either kind.
  if (produces.some((x) => x.res === "discard")) for (const res of ["trashSpell", "trashUnit", "trashAny"])
    produces.push({ res, spec: "mid", why: "a discarded card goes to your trash" });
  if (produces.some((x) => x.res === "trashAny" && /burn|into your trash/.test(x.why))) for (const res of ["trashSpell", "trashUnit"])
    produces.push({ res, spec: "mid", why: "a burned card goes to your trash (a spell or a unit)" });
  const t = c.t || "";
  // Card-level facts: what playing it makes, whatever the text says.
  if (/Spell/.test(t)) produces.push({ res: "trashSpell", spec: "low", why: "a spell goes to the trash once cast" });
  if (/Unit/.test(t)) {
    produces.push({ res: "trashUnit", spec: "low", why: "a unit goes to the trash when it dies" });
    produces.push({ res: "move", spec: "low", why: "any unit can move (§144)" });
    produces.push({ res: "conquer", spec: "low", why: "units take battlefields" });
  }
  if ((c.p || 0) > 0) {
    produces.push({ res: "powerSpent", spec: "low", why: `costs ${c.p} Power` });
    produces.push({ res: "recycleRune", spec: "low", why: "Power is paid by recycling a rune (§164.2.b)" });
  }
  if (/\[hidden\]/i.test(c.x || "")) {
    produces.push({ res: "facedown", spec: "mid", why: "Hidden: it can be hidden" });
    produces.push({ res: "flip", spec: "mid", why: "Hidden: it is played from face down, which counts as playing it (§811.1.b)" });
    produces.push({ res: "flipSelf", spec: "mid", why: "Hidden: it can be played from face down" });
    produces.push({ res: "powerSpent", spec: "low", why: "hiding costs [A]" });
    // A flipped unit is played, so its own play effect fires.
    if (/Unit/.test(t) && consumes.some((x) => x.res === "playMe")) produces.push({ res: "playMe", spec: "mid", why: "a flip plays it again: its play effect fires" });
  }
  // A card that consumes "play me" is worth replaying: returning it to hand resets it.
  if (consumes.some((x) => x.res === "playMe") && /Unit/.test(t)) consumes.push({ res: "ownToHand", spec: "high", why: "back to hand, it can be played again and its play effect fires again" });
  // Leaving the board makes a fresh object (§124.1): an Empower-once card can Empower again.
  if (consumes.some((x) => x.res === "empowerReset")) consumes.push({ res: "ownToHand", spec: "high", why: "a fresh copy of the card is not Empowered (§124.1)" });
  // Playing a unit from the trash plays it, so its play effect fires.
  if (consumes.some((x) => x.res === "playMe") && /Unit/.test(t) && (c.e || 0) <= 3) consumes.push({ res: "revive", spec: "high", why: "revived from the trash, it is played: its play effect fires" });
  // A cheap spell can be recast from the trash.
  if (/Spell/.test(t) && (c.e || 0) <= 3) consumes.push({ res: "recast", spec: "high", why: "a spell of 3 Energy or less can be recast from the trash" });
  // Gold pays Power.
  if ((c.p || 0) > 0) consumes.push({ res: "gold", spec: "low", why: "Gold pays its Power" });
  return { produces, consumes };
}

// The deck's graph. cards: [{card, qty}] (legend, champion, battlefields included).
export function graphOf(cards) {
  const nodes = cards.map((r) => ({ ...r, tags: tagsOf(r.card) }));
  const edges = [];
  for (const a of nodes) for (const b of nodes) {
    for (const p of a.tags.produces) for (const q of b.tags.consumes) {
      if (p.res !== q.res) continue;
      // A card's own play effect, or its own "from face down", only ever links to itself.
      if (["playMe", "flipSelf"].includes(p.res) && a !== b) continue;
      if (a === b && !["ownToHand", "empowerReset", "flipSelf", "playMe"].includes(p.res)) continue;
      const spec = RANK[p.spec] <= RANK[q.spec] ? p.spec : q.spec;
      edges.push({ from: a.card.n, to: b.card.n, res: p.res, spec, why: [p.why, q.why], needsFlip: !!p.needsFlip });
    }
  }
  // One edge per pair and resource, the strongest.
  const best = new Map();
  for (const e of edges) { const k = `${e.from}|${e.to}|${e.res}`; if (!best.has(k) || RANK[e.spec] > RANK[best.get(k).spec]) best.set(k, e); }
  return { nodes, edges: [...best.values()] };
}

// Loops: cycles of 2 to 4 cards (a card may loop on itself), every link at least `min`
// strong and at least one link "high". Reported once per set of cards, strongest first.
export function loopsOf(graph, { min = "mid", maxLen = 4 } = {}) {
  const ok = graph.edges.filter((e) => RANK[e.spec] >= RANK[min]);
  const out = new Map(graph.nodes.map((n) => [n.card.n, []]));
  for (const e of ok) out.get(e.from)?.push(e);
  const found = new Map();
  const walk = (start, at, path, seen) => {
    for (const e of out.get(at) || []) {
      if (e.to === start && path.length + 1 >= 1) {
        const cyc = [...path, e];
        if (!cyc.some((x) => x.spec === "high")) continue;
        const key = [...new Set(cyc.map((x) => x.from))].sort().join(" + ") + " :: " + cyc.map((x) => x.res).sort().join(",");
        const weakest = Math.min(...cyc.map((x) => RANK[x.spec]));
        // Rules flags, from what the loop's own links say. A unit played from the trash
        // arrives face up, so its "when you play me from face down" can't fire (§811.1.b).
        const flags = [];
        cyc.forEach((x, i) => { const next = cyc[(i + 1) % cyc.length]; if (x.res === "revive" && next.needsFlip) flags.push(`${next.from} is revived face up, so its "from face down" effect doesn't fire`); });
        if (!found.has(key) || weakest > found.get(key).weakest) found.set(key, { cards: [...new Set(cyc.map((x) => x.from))], links: cyc, weakest, flags });
      } else if (!seen.has(e.to) && path.length + 1 < maxLen) {
        walk(start, e.to, [...path, e], new Set([...seen, e.to]));
      }
    }
  };
  for (const n of graph.nodes) walk(n.card.n, n.card.n, [], new Set([n.card.n]));
  return [...found.values()].sort((a, b) => b.weakest - a.weakest || a.cards.length - b.cards.length);
}

// Strong links that aren't part of any loop: one card feeding another.
export function linksOf(graph, { min = "high" } = {}) {
  return graph.edges.filter((e) => RANK[e.spec] >= RANK[min] && e.from !== e.to)
    .sort((a, b) => a.res.localeCompare(b.res) || a.from.localeCompare(b.from));
}

// Cards outside the deck that would link strongly to two or more cards in it.
export function bridgesOf(graph, pool, { min = "high", atLeast = 2 } = {}) {
  const inDeck = new Set(graph.nodes.map((n) => n.card.n));
  const out = [];
  for (const c of pool) {
    if (inDeck.has(c.n)) continue;
    const t = tagsOf(c);
    const touches = new Set();
    for (const n of graph.nodes) {
      const link = (p, q) => p.res === q.res && RANK[p.spec] >= RANK[min] && RANK[q.spec] >= RANK[min];
      if (t.produces.some((p) => n.tags.consumes.some((q) => link(p, q))) || n.tags.produces.some((p) => t.consumes.some((q) => link(p, q)))) touches.add(n.card.n);
    }
    if (touches.size >= atLeast) out.push({ card: c, touches: [...touches] });
  }
  return out.sort((a, b) => b.touches.length - a.touches.length);
}

// The legend and the champion, at any strength: what feeds them and what they feed. Their
// links are mostly "low" (any Power payment recycles a rune), which the loop ranking filters
// out, so they get their own view — the legend is the deck's economy.
export function hubsOf(graph, names) {
  return names.map((n) => {
    const node = graph.nodes.find((x) => x.card.n === n);
    if (!node) return null;
    const feeds = graph.edges.filter((e) => e.from === n && e.to !== n);
    const fedBy = graph.edges.filter((e) => e.to === n && e.from !== n);
    const group = (es, side) => {
      const by = new Map();
      for (const e of es) { const k = `${e.res}|${e.spec}`; (by.get(k) || by.set(k, []).get(k)).push(side === "to" ? e.to : e.from); }
      return [...by].map(([k, cs]) => { const [res, spec] = k.split("|"); return { res, spec, cards: [...new Set(cs)] }; })
        .sort((a, b) => RANK[b.spec] - RANK[a.spec] || b.cards.length - a.cards.length);
    };
    return { card: node.card, fedBy: group(fedBy, "from"), feeds: group(feeds, "to") };
  }).filter(Boolean);
}
