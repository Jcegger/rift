// Engines read from card text: what a deck is trying to do over and over, and which
// cards feed it. Shared by the site (idea pages, the tweak bench) and scripts/rift.
//
// The data half (data/synergy.json) finds combos people already play. This half is for
// cards nobody has played yet — a new Radiance card has no lists, but its text says
// "when I move, draw 1" as plainly as Stellacorn Herder's does. Each engine is a pair of
// patterns: PAYOFFS trigger off a game event ("when I move"), ENABLERS cause it ("move a
// friendly unit", Ganking, readying a unit so it can move again). A deck has an engine
// when it holds payoffs for it; the cards worth trying are the payoffs and enablers it
// is missing.
//
// It is pattern-matching, and says so: every match carries the sentence that matched, so
// a reader can see why a card was suggested and throw out the ones the pattern got wrong.
// It does not know timing, targeting or whether two cards actually combo — that is for
// the reader, or a judge.

// Card text with symbols spelled out and reminder text — "(I can move from battlefield
// to battlefield.)" — removed, so a keyword's explanation is not mistaken for card text.
export function plainText(c) {
  return String(c?.x || "")
    .replace(/:rb_energy_(\d+):/g, "[$1]").replace(/:rb_rune_rainbow:/g, "[A]").replace(/:rb_rune_(\w+):/g, (_, d) => `[${d[0].toUpperCase()}]`)
    .replace(/:rb_might:/g, " Might").replace(/:rb_exhaust:/g, "[E]")
    .replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
}
const sentences = (t) => t.split(/(?<=[.!])\s+|\n/).map((s) => s.trim()).filter(Boolean);

export const ENGINES = [
  { key: "move", name: "Movement", what: "units that pay off when they move, and ways to move or re-ready them",
    // Moving an enemy unit is a different engine (Blast Cone's): it never triggers "when I move".
    exclude: /\benemy\b/i,
    payoff: /\bwhen (i|a friendly unit|you|one or more friendly units) moves?\b|\bwhen i move\b/i,
    enabler: /\bmove (a|an|up to \w+|any number of|another|your|that|it|them|me)\b[^.]*\bunits?\b|\bmove (it|me|them)\b|\[ganking\]|\bready (a|another|up to \w+)? ?(friendly )?unit|\bready (it|me)\b|\bto ready it\b/i },
  { key: "exhaust", name: "Exhaust triggers", what: "units that pay off when they become exhausted, and costs that exhaust them",
    payoff: /\bwhen (i|a friendly unit) becomes? exhausted\b/i,
    enabler: /\bexhaust (a|another|up to \w+)? ?friendly unit\b|\bas an additional cost[^.]*exhaust\b|\bready (a|another)? ?(friendly )?unit|\bready (it|me)\b/i },
  { key: "buff", name: "Buffs", what: "cards that spend or count buffs, and cards that hand them out",
    payoff: /\bspend (a|my|its|any number of|\w+) buffs?\b|\bif (i|it) (have|has) a buff\b|\bbuffed\b|\bfor each buff\b/i,
    enabler: /\[buff\]|\bbuff (a|another|up to \w+|it|me|them|each|all)\b/i },
  { key: "offhand", name: "Plays from elsewhere", what: "payoffs for playing cards from anywhere but your hand, and cards that do it",
    payoff: /\bplay a card from anywhere other than your hand\b|\bplay(ed)? from (your )?(trash|deck)\b[^.]*\bwhen\b/i,
    enabler: /\[flow\]|\bplay (this|me|it) from your trash\b|\bfrom the top of your (main )?deck\b[^.]*\bplay\b|\bsee me\b[^.]*\bplay me\b|\bthen (its owner )?plays? it\b/i },
  // Rek'Sai's engine, which the first version of this file could not see — so it read the
  // deck by the only engine it knew (its incidental Deathknells). Reveal the top cards and
  // play one: the legend on conquest, Void Rush, Swarm Queen on attack; paid off by cards
  // that care how they arrived (Breacher's Accelerate, Undertitan's [Add] as it's revealed).
  { key: "reveal", name: "Top of the deck", what: "cards that reveal and play from the top of your deck, and cards that pay off arriving that way",
    payoff: /\bas i'?m revealed\b|\bplayed from anywhere other than (a player's|your) hand\b|\bwhen (you|a player) reveals?\b/i,
    // Your own deck only: revealing an opponent's top card (Drakehound Packmaster) feeds nothing here.
    exclude: /\bopponent'?s?\b[^.]*\bdeck\b/i,
    enabler: /\breveal the top (\d+ cards?|card)\b|\breveals? cards from the top\b|\blook at the top \d+ cards?\b[^.]*\b(play|banish)\b|\byou may play one\b/i },
  { key: "trash", name: "Trash size", what: "cards that get better with a full trash, and cards that fill it",
    payoff: /\bfor each card in your trash\b|\bcards? in your trash\b[^.]*\b(less|more|\+)/i,
    enabler: /\binto your trash\b|\bput the rest into your trash\b|\bdiscard (\d|a|one|two|up to)/i },
  { key: "tokens", name: "Tokens", what: "cards that count or pay off tokens, and cards that make them",
    payoff: /\bfor each (friendly )?token\b|\btoken units?\b[^.]*\b(get|have|gain|\+)|\bkill any number of friendly [a-z]+ tokens\b|\bfor each other unit you control here with my name\b/i,
    enabler: /\bplay (a|an|one|two|three|four|that many|\d) [^.]*\btokens?\b/i },
  { key: "death", name: "Deaths", what: "payoffs for friendly units dying, and ways to kill your own",
    payoff: /\[deathknell\]|\bwhen (a friendly unit|another friendly unit|one of your units) dies\b/i,
    enabler: /\bkill (a|another|up to \w+|any number of)? ?friendly (unit|[a-z]+ token)s?\b|\bkill (me|it|this)\b[^.]*\bcost\b|\bas an additional cost[^.]*\bkill\b|\bkills? (one|two|\w+) of (their|your) (own )?units\b/i },
  { key: "discard", name: "Discard", what: "cards that pay off being discarded, and cards that discard",
    payoff: /\bwhen you discard (me|this|a card|one or more cards)\b/i,
    enabler: /\bdiscard (\d|a|one|two|up to|that)\b/i },
  { key: "hidden", name: "Facedown", what: "payoffs for playing from facedown, and Hidden cards",
    payoff: /\b(played|play(s)?) [^.]*from face ?down\b|\bif i was played from face ?down\b/i,
    enabler: /\[hidden\]/i },
  { key: "spells", name: "Spells", what: "payoffs for casting spells",
    payoff: /\bwhen you play a spell\b|\bspells you play\b|\bthe next spell you play\b|\bfor each spell\b/i,
    enabler: null },
  { key: "gear", name: "Gear", what: "payoffs for gear and equipment, and gear to feed them",
    payoff: /\[show off\] a gear\b|\bfor each (friendly )?gear\b|\bwhen you play a gear\b|\bequipped\b/i,
    enabler: null, enablerType: "Gear" },
];

// card -> [{ engine, role: "payoff" | "enabler", text }]
export function engineTags(c) {
  if (!c || ["Rune", "Battlefield"].includes(c.t)) return [];
  const t = plainText(c), out = [];
  for (const e of ENGINES) {
    for (const role of ["payoff", "enabler"]) {
      const re = e[role];
      let hit = null;
      if (re) hit = sentences(t).find((s) => re.test(s) && !(e.exclude && e.exclude.test(s))) || null;
      else if (role === "enabler" && e.enablerType && c.t === e.enablerType) hit = `${c.t}`;
      if (hit) out.push({ engine: e.key, role, text: hit.length > 180 ? hit.slice(0, 177) + "…" : hit });
    }
  }
  return out;
}

// A list's engines: for each engine with at least one payoff in the list, its payoffs and
// enablers, and the legal cards in the list's domains that would add to either.
//   cards: the deck's {code: qty}; idx: lib/decks.mjs indexCatalog; opts.shares: name -> share
//   of the field's lists (data/ideas.json), so known cards can be told from untried ones.
export function deckEngines(cards, idx, { shares = {}, max = 8 } = {}) {
  const rows = Object.entries(cards).map(([code, qty]) => ({ c: idx.BY.get(code), qty })).filter((r) => r.c);
  const L = rows.find((r) => r.c.t === "Legend")?.c || null;
  const ident = new Set((L?.d || []).filter((d) => d !== "Colorless"));
  const inDeck = new Set(rows.map((r) => r.c.n));
  const tagged = rows.flatMap((r) => engineTags(r.c).map((t) => ({ ...t, c: r.c, qty: r.qty })));
  // The legend counts too: Irelia's "ready it" is the deck's biggest movement enabler.
  const champ = L ? idx.championOf(L) : null;
  const legal = (c) => !c.v && !["Legend", "Rune", "Battlefield", "Token"].includes(c.t) && c.t
    && (c.d || []).every((d) => d === "Colorless" || ident.has(d)) && !idx.bannedNames.has(c.n)
    && !(idx.signatureOf(c) && idx.signatureOf(c) !== champ);
  const out = [];
  for (const e of ENGINES) {
    const payoffs = tagged.filter((t) => t.engine === e.key && t.role === "payoff");
    if (!payoffs.length) continue;
    const enablers = tagged.filter((t) => t.engine === e.key && t.role === "enabler");
    const seen = new Set();
    const candidates = [];
    for (const c of idx.cards) {
      if (seen.has(c.n) || inDeck.has(c.n) || !legal(c)) continue;
      // A type-based enabler (any gear) is too broad to suggest from; only its payoffs are.
      const tags = engineTags(c).filter((t) => t.engine === e.key && (e.enabler || t.role === "payoff"));
      if (!tags.length) continue;
      seen.add(c.n);
      const later = idx.notYetStandard(c);
      if (later && !later.from) continue;     // not in Standard and no date it will be
      candidates.push({ code: c.c, name: c.n, set: c.s, roles: [...new Set(tags.map((t) => t.role))], text: tags[0].text,
        share: shares[c.n] ?? null, legalFrom: later?.from || null });
    }
    // Payoffs first (a deck with an engine wants more of what it is for), new cards before
    // known ones, then what the field already plays.
    candidates.sort((a, b) => (b.roles.includes("payoff") - a.roles.includes("payoff")) || ((b.set === "RAD") - (a.set === "RAD")) || ((b.share || 0) - (a.share || 0)) || a.name.localeCompare(b.name));
    out.push({ key: e.key, name: e.name, what: e.what,
      payoffs: payoffs.map((t) => ({ name: t.c.n, qty: t.qty, text: t.text, legend: t.c.t === "Legend" })),
      enablers: enablers.map((t) => ({ name: t.c.n, qty: t.qty, text: t.text, legend: t.c.t === "Legend" })),
      candidates: candidates.slice(0, max), more: Math.max(0, candidates.length - max) });
  }
  // Which engine is the deck's own. The legend is the one card always in play, so an
  // engine it takes part in comes first (Irelia readies, Kennen pays off plays from
  // elsewhere, Rek'Sai reveals). After that an engine is a payoff AND what feeds it, so
  // rank by the smaller of the two: nine self-contained Deathknell bodies with one way to
  // kill them are not the deck's engine, which is how Rek'Sai was misread at first.
  const copies = (xs) => xs.reduce((a, p) => a + p.qty, 0);
  const rank = (e) => [e.payoffs.concat(e.enablers).some((x) => x.legend) ? 1 : 0, Math.min(copies(e.payoffs), copies(e.enablers)), copies(e.payoffs) + copies(e.enablers)];
  return out.sort((a, b) => { const x = rank(a), y = rank(b); return y[0] - x[0] || y[1] - x[1] || y[2] - x[2]; });
}
