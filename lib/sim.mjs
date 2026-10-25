// The consistency simulator's engine, shared by scripts/sim.mjs (the CLI) and the site's
// tweak bench. Plain ES with no imports, so a browser and Node load the same file; all it
// needs from a catalog is `BY`, a Map of code -> card. What it models and what it does not
// is written up at the top of scripts/sim.mjs and in README "Simulator".

export const TURNS = 5;

// ── a seeded RNG, so a run can be reproduced and two decks compared on equal footing ──
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (xs, r) => {
  for (let i = xs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [xs[i], xs[j]] = [xs[j], xs[i]]; }
  return xs;
};

// ── turning a decklist into what the sim plays ───────────────────────────────────
function resolver(cat) {
  const bare = new Map();
  for (const [k, c] of cat.BY) { const b = k.split("/")[0].toUpperCase(); if (!bare.has(b)) bare.set(b, c); }
  return (code) => cat.BY.get(code)
    || bare.get(code.split("/")[0].toUpperCase())
    || bare.get(code.split("/")[0].replace(/-[A-Z]+$/, "").replace(/(\d)[a-z]+$/i, "$1").toUpperCase())
    || null;
}

/* What a card does in a goldfish, read from its text (reminder text in parentheses
   removed first). Interaction — counters, removal, bounce, stun — has nothing to aim at
   with no opponent, so it is held rather than cast, and left out of the mulligan guide:
   its value is decided by the matchup, which this sim cannot see. Draw and channel
   effects are played out, because they are the deck's own engine. A spell that exhausts,
   readies or buffs a friendly unit needs one already on the board. */
const COUNT = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4 };
// Tokens a card makes the moment it is played: "When you play me, play two 1 Might Recruit
// unit tokens", or a spell or gear that simply says "Play a …". A token from some other
// trigger (when I move, Deathknell, on an opponent's turn) needs things the sim does not
// have, so it is left out rather than guessed at.
export function tokensOf(text) {
  const x = (text || "").replace(/\([^)]*\)/g, "").toLowerCase();
  const out = { units: [], gold: 0 };
  for (const sentence of x.split(/(?<=\.)\s+|\n/)) {
    const immediate = /when you play me, play|^\s*(\[[^\]]+\]\s*)*play /.test(sentence)
      && !/deathknell|when i |at start|opponent's turn|when you (conquer|hold|win)/.test(sentence);
    if (!immediate) continue;
    for (const m of sentence.matchAll(/play (a|an|one|two|three|four) (ready )?(\d+) :rb_might: [a-z' ]+? unit tokens?( with \[temporary\])?/g))
      for (let i = 0; i < COUNT[m[1]]; i++) out.units.push({ m: Number(m[3]), temp: !!m[4] });
    for (const m of sentence.matchAll(/play (a|an|one|two|three|four) gold gear tokens?/g)) out.gold += COUNT[m[1]];
  }
  return out;
}

// What a card does for the trash-and-recursion engine (opts.engine only): play and move
// triggers that discard, draw or burn, Fizz's recast, Matriarch's revive, and spells that are
// fight tricks (cast in the pressure scenarios).
export function engineOf(c) {
  const x = (c.x || "").replace(/\([^)]*\)/g, "").toLowerCase();
  const n = (re) => { const m = re.exec(x); return m ? Number(m[1]) : 0; };
  const pd = /when you play me, discard (\d+), then draw (\d+)/.exec(x);
  const md = /when i move, discard (\d+), then draw (\d+)/.exec(x);
  const rv = /\[empower\] :rb_energy_(\d+)::rb_rune_(\w+):[\s\S]*when i become \[empowered\], you may choose a unit in your trash with energy cost no more than :rb_energy_(\d+):/.exec(x);
  return {
    playDiscard: pd ? Number(pd[1]) : 0, playDraw: pd ? Number(pd[2]) : 0,
    moveDiscard: md ? Number(md[1]) : 0, moveDraw: md ? Number(md[2]) : 0,
    moveBurn: n(/when i move, you may \[burn (\d+)\]/),
    recastMax: n(/when you play me, you may play a spell from your trash with energy cost no more than :rb_energy_(\d+):/),
    revive: rv ? { e: Number(rv[1]), d: rv[2][0].toUpperCase() + rv[2].slice(1), max: Number(rv[3]) } : null,
    trick: c.t === "Spell" && /counter a spell|enemy|deal \d+ to|return a unit|\[stun\]|stun a unit|kill a unit|banish|give a (friendly )?unit [+-]|swap the/.test(x),
    // A trick that kills an enemy unit outright (readies a legend that readies on deaths);
    // a bounce never does.
    kills: c.t === "Spell" && /deal damage equal to their mights|deal \d+ to (a|an|each|all)|kill (a|an) (enemy )?unit/.test(x) && !/friendly unit\. if you do/.test(x),
    // Loops found by lib/interactions.mjs and checked against the rules:
    ownBounce: /return a friendly unit and an enemy unit|return (a|another) friendly unit/.test(x),   // Star-Crossed: replay your own
    holdPoint: /when i hold, if you control a facedown card here, score 1 point/.test(x),             // Evelynn, In Control
    flipEmpower: /when you play me from face down, you may empower something here/.test(x),           // Tornado Warrior
    swapMove: /move me to its location and it to my original location/.test(x),                      // Tideturner: the other unit moves too
    flipRecycle: /recycle me if i was played from face down/.test(x),                                 // Elnuk Herd
  };
}

export function classify(c) {
  const tok = tokensOf(c.x);
  const eng = engineOf(c);
  if (c.t !== "Spell") return { role: "proactive", draws: 0, needsUnit: false, channels: 0, tok, mb: c.t === "Gear" ? (c.mb || 0) : 0, eng };
  const x = (c.x || "").replace(/\([^)]*\)/g, "").toLowerCase();
  const interaction = /counter a spell|enemy|deal \d+ to|return a unit|\[stun\]|stun a unit|kill a unit|banish/.test(x);
  const cond = /you may exhaust a friendly unit\. if you do, draw (\d+)\. otherwise, draw (\d+)/.exec(x);
  const draw = /draw (\d+)/.exec(x);
  const chan = /channel (\d+) rune/.exec(x);
  return {
    role: interaction ? "interaction" : "proactive",
    draws: cond ? Number(cond[1]) : draw ? Number(draw[1]) : 0,
    drawsAlone: cond ? Number(cond[2]) : null,
    needsUnit: !cond && /(exhaust|ready) a friendly unit|give a unit|friendly unit/.test(x),
    channels: chan ? Number(chan[1]) : 0,
    tok, mb: 0, eng,
  };
}

export function buildDeck(list, cat, opts = {}) {
  const card = resolver(cat);
  const legend = Object.keys(list).map(card).find((c) => c && c.t === "Legend") || opts.legendCard || null;
  const champTags = new Set(legend?.g || []);
  const main = [], runes = [], unknown = [];
  for (const [code, q] of Object.entries(list)) {
    const c = card(code);
    if (!c) { unknown.push(code); continue; }
    if (c.t === "Legend" || c.t === "Battlefield") continue;
    if (c.t === "Rune") { for (let i = 0; i < q; i++) runes.push((c.d || [])[0]); continue; }
    const k = classify(c);
    // Hidden cards can be hidden for one Power of any colour and played free later (§811.1.b);
    // `quick` marks what can be played on the opponent's turn (Reaction, Action, or a flip).
    const hidden = /\[Hidden\]/i.test(c.x || "");
    const quick = /\[Reaction\]|\[Action\]/i.test(c.x || "");
    for (let i = 0; i < q; i++) main.push({ n: c.n, t: c.t, e: c.e ?? 0, p: c.p ?? 0, d: c.d || [], m: c.m ?? 0, hidden, quick, ...k });
  }
  // The Chosen Champion: a champion unit whose champion tag matches the legend (§103.3.a.2).
  // The list does not say which copy was chosen, so take the one named, else the cheapest.
  const isChamp = (x) => x.t === "Unit" && x.n.includes(", ") && champTags.has(x.n.split(", ")[0]);
  let champ = null;
  const cands = main.filter(isChamp);
  if (opts.champion) champ = cands.find((x) => x.n.toLowerCase() === opts.champion.toLowerCase()) || null;
  if (!champ && cands.length) champ = cands.slice().sort((a, b) => a.e - b.e || a.n.localeCompare(b.n))[0];
  if (champ) main.splice(main.indexOf(champ), 1);
  // A legend whose activated ability makes a unit ("1 Energy, exhaust: play a 1 Might
  // Recruit") develops the board every turn it is used. Modelled as a card that never
  // leaves the Legend Zone and can be used once a turn (it exhausts). Conditions after the
  // cost ("use only if…") are not checked, so read these decks' numbers as a ceiling.
  let ability = null;
  const lx = (legend?.x || "").replace(/\([^)]*\)/g, "").toLowerCase();
  const la = /:rb_energy_(\d+):(:rb_rune_rainbow:)?, :rb_exhaust:: play (a|an) (ready )?(\d+) :rb_might: [a-z' ]+? unit token( with \[temporary\])?/.exec(lx);
  if (la) ability = { n: "legend ability", t: "Ability", e: Number(la[1]), p: la[2] ? 1 : 0, d: ["rainbow"], m: 0, role: "proactive",
    draws: 0, needsUnit: false, channels: 0, mb: 0, tok: { units: [{ m: Number(la[5]), temp: !!la[6] }], gold: 0 } };
  // A legend that turns a rune recycle into Gold (Battle Mistress: "When you recycle a rune,
  // you may exhaust me to play a Gold gear token exhausted"). Once a turn in a goldfish: it
  // readies at your Awaken, and its other trigger (enemy units dying) never happens here.
  // The Gold enters exhausted, so it pays a Power from your next turn on, any colour.
  const legendGold = /when you recycle a rune, you may exhaust me to play a gold gear token/.test(lx);
  const readyOnDeath = /when one or more enemy units die, ready me/.test(lx);
  return { legend, champ, main, runes, unknown, ability, legendGold, readyOnDeath };
}

// ── one turn's plays: spend as much as the runes allow ──────────────────────────
// Exact search over the hand (hands are small): maximise Energy spent, then units, then
// keep Power spending low, because every rune recycled for Power shrinks next turn.
function choosePlays(hand, champ, board, ready, unitsOnBoard, ability, gold, extras = []) {
  const pool = [...hand, ...(champ ? [champ] : []), ...(ability ? [ability] : []), ...extras]
    .filter((c) => c.role !== "interaction" && (!c.needsUnit || unitsOnBoard > 0));
  const byDom = {};
  for (const d of board) byDom[d] = (byDom[d] || 0) + 1;
  let best = { idx: [], spend: 0, units: 0, power: 0, need: {}, gold: 0 };
  const n = Math.min(pool.length, 12);
  for (let mask = 1; mask < 1 << n; mask++) {
    let e = 0, units = 0, power = 0; const need = {}; const idx = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) {
      const c = pool[i]; e += c.e; idx.push(i);
      if (c.t === "Unit" || c.revives) units++;
      if (c.p) { power += c.p; const dom = c.d.find((x) => byDom[x]) || c.d[0]; need[dom] = (need[dom] || 0) + c.p; }
    }
    if (e > ready) continue;
    // Domain Power comes from recycling runes of that domain; Gold pays any domain, so it
    // covers a shortfall. A rainbow cost (a legend ability's) takes any spare rune, then Gold.
    let short = 0, used = 0;
    for (const [d, q] of Object.entries(need)) if (d !== "rainbow") { short += Math.max(0, q - (byDom[d] || 0)); used += Math.min(q, byDom[d] || 0); }
    if (short > gold) continue;
    const rainbow = need.rainbow || 0, spare = board.length - used;
    if (rainbow > spare + (gold - short)) continue;
    const goldUsed = short + Math.max(0, rainbow - spare);
    if (e > best.spend || (e === best.spend && (units > best.units || (units === best.units && power < best.power))))
      best = { idx, spend: e, units, power, need, gold: goldUsed };
  }
  return { ...best, pool };
}

// ── one game ────────────────────────────────────────────────────────────────
// policy(hand) returns the cards to send to the bottom (at most 2).
// opts.hide: hide a Hidden card after developing, once a turn from turn 2 while a unit is on
// board (so a battlefield is held), at most two face down (one per battlefield). It costs one
// Power of any colour: Gold first, else a recycled rune. Development comes first; the hide uses
// what is left. Off by default, so the builders' numbers don't move.
//
// opts.engine: the trash-and-recursion engine, off by default. A trash, filled by spells cast,
// discards, burns and units that die. Units played go to base and move out the next turn (how
// a unit reaches a battlefield), which fires move triggers (Traveling Merchant, Shadow Order
// Disciple); Ezreal-style play effects discard then draw; Fizz recasts a spell from the trash
// if one fits and its Power can be paid; Matriarch's Empower is a play option that revives the
// best unit in the trash, whose play effect then fires. Discards are chosen: a spell for Fizz
// or a unit for Matriarch when the trash lacks one, else the most expensive card in hand.
// The opponent is a scenario, never a guess (the goldfish can't see one):
//   { extraMoves: moves per mover per turn after the first (0 holding, 1 attacking),
//     tricksFrom, tricksPerTurn: fight tricks cast from hand with what developing left,
//     deathsFrom, deathsPerTurn: your cheapest units that die each turn }
// Fractions are chances. Results in out.engine and out.trashSpells / out.trashUnits.
export function playGame(deck, r, onDraw, policy, keySet, forceBottom = null, opts = {}) {
  const lib = shuffle(deck.main.slice(), r);
  const runeDeck = shuffle(deck.runes.slice(), r);
  let hand = lib.splice(0, 4);
  const opener = hand.slice();
  const bottom = forceBottom ? forceBottom(hand) : policy(hand);
  if (bottom.length) {
    hand = hand.filter((c) => !bottom.includes(c));
    hand.push(...lib.splice(0, bottom.length));
    lib.push(...bottom);
  }
  let champ = deck.champ;
  const board = []; // rune domains on the board
  const out = { opener, spent: [], units: [], might: [], stuck: [], seen: [], runes: [], hand: [], drawn: 0,
    gold: [], facedown: [], react: [], answer: [], answerDown: [], answerHand: [] };
  let unitsOnBoard = 0, mightOnBoard = 0, gold = 0, temp = [];
  let goldNext = 0;            // Gold made this turn: exhausted until your next Awaken
  const down = [];             // face-down cards
  const keys = new Set(keySet || []);
  const seen = new Set(hand.map((c) => c.n));
  const sc = opts.engine ? { extraMoves: 0, tricksFrom: 2, tricksPerTurn: 0, deathsFrom: 3, deathsPerTurn: 0,
    attacksFrom: 2, attacksPerTurn: 0, holdUp: 0, holdFrom: 3, dais: false, bandleTree: false, keepForEvelynn: false, ...opts.engine } : null;
  const E = sc ? { trash: [], bodies: [], movers: [], mats: [], fizzPlays: 0, fizzHits: 0, fizzUnpaid: 0, matChances: 0, matHits: 0,
    tricks: 0, burns: 0, deaths: 0, discards: 0, drawn: 0, kills: 0,
    pay: { develop: 0, hide: 0, fizz: 0, empower: 0, trick: 0 }, fromRunes: 0, fromGold: 0, goldMade: 0, goldFromKills: 0,
    hideBlocked: 0, trickBlocked: 0, empowerSkipped: 0, powerTurns: [], power2From4: 0,
    attacks: 0, answered: 0, answeredDown: 0, answeredHand: 0, unitFlips: 0, replays: 0, daisReplays: 0, tornadoRevives: 0,
    swapMoves: 0, evelynnPoints: 0, reserved: 0, eveRemoved: 0, eveLost: 0, eveHeld: 0, keeperFlips: 0, eveTurns: 0, eveBare: 0, eveFirst: 0 } : null;
  let daisDone = false, tornadoReset = [];
  // sc.foe: one real field list as the opponent (lib/decklab.mjs foesOf): its cards that take
  // the scorer off the board ("R"), its big units by Energy cost, and whether its most-played big
  // unit and trick break the scorer's hold with one or two of our bodies beside her. It draws 4
  // and 1 a turn and has 2 runes a turn; sc.focus is the chance it aims at the scorer.
  const foe = E && sc.foe ? sc.foe : null, foeUsed = new Set();
  let foeDeck = null;
  if (foe) {
    foeDeck = Array(foe.size).fill("-");
    for (let i = 0; i < foe.removal; i++) foeDeck[i] = "R";
    foe.breakers.forEach((e, i) => { foeDeck[foe.removal + i] = { e }; });
    shuffle(foeDeck, r);
  }
  const foeHas = (t, f) => foeDeck.findIndex((x, j) => j < Math.min(foeDeck.length, 4 + t) && !foeUsed.has(j) && f(x));
  if (E) { out.trashSpells = []; out.trashUnits = []; }
  const fizzFits = (c, max) => c.t === "Spell" && c.e <= max;
  const reviveFits = (c, max) => c.t === "Unit" && c.e <= max && (c.p || 0) <= 1;
  const hasFizz = deck.main.some((c) => c.eng?.recastMax), hasMat = deck.main.some((c) => c.eng?.revive);
  // A unit dying: to the trash (a token just ceases to exist, §186.1).
  const leaveDead = (u) => {
    E.bodies.splice(E.bodies.indexOf(u), 1); if (!u.token) E.trash.push(u); E.deaths++;
    unitsOnBoard--; mightOnBoard -= u.m;
    const mi = E.mats.findIndex((m) => m.c === u); if (mi > -1) E.mats.splice(mi, 1);
    const vi = E.movers.findIndex((m) => m.c === u); if (vi > -1) E.movers.splice(vi, 1);
  };
  // opts.turns: how many turns to play (default TURNS). The clock needs more than the curve:
  // Evelynn is a turn-4 play whose points come on turns 5–8.
  const lastTurn = opts.turns || TURNS;
  for (let t = 1; t <= lastTurn; t++) {
    const paidAtStart = E ? E.fromRunes + E.fromGold : 0;
    // [Temporary] units die at the start of their controller's Beginning Phase.
    for (const m of temp) { unitsOnBoard--; mightOnBoard -= m; }
    temp = [];
    let abilityUsed = false;
    // Awaken: last turn's Gold readies, and so does the legend.
    gold += goldNext; goldNext = 0;
    let legendReady = !!deck.legendGold;
    let readiedByKill = false;
    const recycle = (j) => {
      runeDeck.push(board[j]); board.splice(j, 1);
      if (E) E.fromRunes++;
      if (legendReady) { legendReady = false; goldNext++; if (E) { E.goldMade++; if (readiedByKill) E.goldFromKills++; } }
    };
    // Engine helpers: pay a Power (Gold first, then a rune of that colour), draw, discard.
    const payPower = (dom, q, sink) => {
      const doms = {}; for (const d of board) doms[d] = (doms[d] || 0) + 1;
      if (q > gold + (doms[dom] || 0)) return false;
      for (let i = 0; i < q; i++) { if (gold > 0) { gold--; E.fromGold++; } else recycle(board.indexOf(dom)); }
      if (sink) E.pay[sink] += q;
      return true;
    };
    const drawN = (k) => { for (let i = 0; i < k && lib.length; i++) { const c = lib.shift(); hand.push(c); seen.add(c.n); if (E) E.drawn++; } };
    const discardOne = () => {
      if (!hand.length) return;
      const pick = (f) => hand.filter(f).sort((a, b) => b.e - a.e)[0];
      let c = null;
      if (hasFizz && !E.trash.some((x) => fizzFits(x, 3))) c = pick((x) => fizzFits(x, 3));
      if (!c && hasMat && !E.trash.some((x) => reviveFits(x, 3))) c = pick((x) => reviveFits(x, 3));
      if (!c) c = hand.slice().sort((a, b) => b.e - a.e)[0];
      hand.splice(hand.indexOf(c), 1); E.trash.push(c); E.discards++;
    };
    // Fizz's recast, after the play that brought him in is paid for: the best spell in the trash
    // whose Power can still be paid, which goes to the bottom of the deck after.
    const fizzQueue = [];
    const resolveFizz = () => {
      while (fizzQueue.length) {
        const max = fizzQueue.shift();
        E.fizzPlays++;
        const target = E.trash.filter((x) => fizzFits(x, max)).sort((a, b) => (b.p || 0) - (a.p || 0) || b.e - a.e)
          .find((x) => payPower(x.d[0], x.p || 0, "fizz"));
        if (target) { E.fizzHits++; E.trash.splice(E.trash.indexOf(target), 1); lib.push(target); }
        else if (E.trash.some((x) => fizzFits(x, max))) E.fizzUnpaid++;   // a target, but its Power couldn't be paid
      }
    };
    // A unit arriving (played, or revived): its play effects, and its place on the board.
    const arrive = (c) => {
      let drew = 0;
      E.bodies.push(c);
      if (c.eng?.moveDiscard || c.eng?.moveBurn) E.movers.push({ c, since: t, moves: 0 });
      if (c.eng?.playDiscard || c.eng?.playDraw) { for (let i = 0; i < c.eng.playDiscard; i++) discardOne(); drew += c.eng.playDraw; }
      if (c.eng?.recastMax) fizzQueue.push(c.eng.recastMax);   // resolved once this play's costs are paid
      if (c.eng?.revive) E.mats.push({ c, empowered: false });
      return drew;
    };
    const fireMove = (c) => {
      if (c.eng?.moveDiscard) { for (let i = 0; i < c.eng.moveDiscard; i++) discardOne(); drawN(c.eng.moveDraw); }
      if (c.eng?.moveBurn && lib.length) { E.trash.push(lib.shift()); E.burns++; }
    };
    const leave = (u) => {
      E.bodies.splice(E.bodies.indexOf(u), 1); unitsOnBoard--; mightOnBoard -= u.m;
      const mi = E.mats.findIndex((m) => m.c === u); if (mi > -1) E.mats.splice(mi, 1);
      const vi = E.movers.findIndex((m) => m.c === u); if (vi > -1) E.movers.splice(vi, 1);
    };
    // Return your best unit to hand to play again (Star-Crossed's friendly half, Emperor's Dais):
    // an Empowered Matriarch with something to revive, a Fizz with a spell waiting, Ezreal,
    // then any unit with a play effect. A fresh copy is a new object (§124.1).
    const replayBest = () => {
      const score = (u) => (E.mats.some((m) => m.c === u && m.empowered) && E.trash.some((x) => reviveFits(x, 3)) ? 4 : 0)
        + (u.eng?.recastMax && E.trash.some((x) => fizzFits(x, u.eng.recastMax)) ? 3 : 0) + (u.eng?.playDraw ? 2 : 0)
        + (u.eng?.playDiscard || u.eng?.swapMove ? 1 : 0);
      const u = E.bodies.filter((b) => !b.token && score(b) > 0).sort((a, b) => score(b) - score(a))[0];
      if (!u) return false;
      leave(u); hand.push(u); E.replays++;
      return true;
    };
    // The clock: Evelynn, In Control scores when she holds with a face-down card there. Checked
    // at your Beginning Phase, so the card had to survive their turn unflipped (§383.2.a.1).
    if (E && unitsOnBoard > 0 && down.length) E.evelynnPoints += Math.min(E.bodies.filter((b) => b.eng?.holdPoint).length, down.length);
    // Where her points go: Beginning Phases with her on board, and how many had no face-down card.
    if (E && E.bodies.some((b) => b.eng?.holdPoint)) { E.eveTurns++; if (!down.length) E.eveBare++; if (!E.eveFirst) E.eveFirst = t; }
    const ch = t === 1 && onDraw ? 3 : 2;
    for (let i = 0; i < ch && runeDeck.length; i++) board.push(runeDeck.shift());
    if (lib.length) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
    // Main phase: play, and if a cantrip drew cards, look again with what is left.
    let ready = board.length, spent = 0, extraRunes = 0;
    out.runes.push(board.length);
    // Units that came in on an earlier turn move out now: their move triggers fire, once for
    // the first move and extraMoves more each turn after.
    if (E) for (const mv of E.movers) {
      if (mv.since >= t) continue;
      const times = mv.moves === 0 ? 1 : sc.extraMoves;
      for (let k = 0; k < times; k++) { mv.moves++; fireMove(mv.c); }
    }
    // Emperor's Dais (sc.dais): the first time you take the second battlefield (three units on
    // board, from turn 2), pay 1 to return a unit to hand and leave a 2-Might Sand Soldier.
    if (E && sc.dais && !daisDone && t >= 2 && unitsOnBoard >= 3 && ready >= 1) {
      daisDone = true;
      if (replayBest()) { ready -= 1; spent += 1; E.daisReplays++; const tok = { n: "Sand Soldier", t: "Unit", m: 2, e: 0, p: 0, token: true }; E.bodies.push(tok); unitsOnBoard++; mightOnBoard += 2; }
    }
    // Hold Energy up (sc.holdUp) from turn holdFrom when an answer you could cast is in hand.
    const holdable = E && sc.holdUp > 0 && t >= sc.holdFrom && hand.some((c) => keys.has(c.n) && c.quick);
    const reserve = holdable ? Math.min(sc.holdUp, ready) : 0;
    if (E) E.reserved += reserve;
    for (let pass = 0; pass < 4; pass++) {
      // Matriarch's Empower, when a unit in the trash is worth reviving.
      const extras = E ? E.mats.filter((m) => !m.empowered && E.trash.some((x) => reviveFits(x, m.c.eng.revive.max)))
        .slice(0, E.trash.filter((x) => reviveFits(x, 3)).length)   // never more Empowers than units to revive
        .map((m) => ({ n: "Empower", t: "Ability", e: m.c.eng.revive.e, p: 1, d: [m.c.eng.revive.d], m: 0, role: "proactive",
          draws: 0, needsUnit: false, channels: 0, mb: 0, tok: { units: [], gold: 0 }, revives: m })) : [];
      // opts.t1NoPower: on turn 1, prefer plays that cost no Power (a recycled rune is an Energy
      // short on turn 2); a Power card goes down only when nothing free can be played.
      // t1NoPower: "strict" never spends Power on turn 1, passing instead.
      const devReady = ready - (E ? reserve : 0);
      let pick = choosePlays(opts.t1NoPower && t === 1 ? hand.filter((c) => !c.p) : hand, champ, board, devReady, unitsOnBoard, abilityUsed ? null : deck.ability, gold, extras);
      if (opts.t1NoPower === true && t === 1 && !pick.idx.length) pick = choosePlays(hand, champ, board, devReady, unitsOnBoard, abilityUsed ? null : deck.ability, gold, extras);
      const played = pick.idx.map((i) => pick.pool[i]);
      if (E && pass === 0) E.empowerSkipped += extras.filter((x) => !played.includes(x)).length;
      if (!pick.idx.length) break;
      let drew = 0;
      for (const c of played) {
        if (c.revives) {
          // Empower: revive the best unit in the trash to base, ignoring its cost; it is played,
          // so its own play effect fires.
          c.revives.empowered = true; E.matHits++;
          const u = E.trash.filter((x) => reviveFits(x, c.revives.c.eng.revive.max)).sort((a, b) => b.e - a.e || b.m - a.m)[0];
          if (!u) continue;
          E.trash.splice(E.trash.indexOf(u), 1);
          unitsOnBoard++; mightOnBoard += u.m; drew += arrive(u);
          continue;
        }
        if (c === champ) champ = null; else if (c === deck.ability) abilityUsed = true; else hand.splice(hand.indexOf(c), 1);
        if (c.t === "Unit") { unitsOnBoard++; mightOnBoard += c.m; if (E) drew += arrive(c); }
        if (c.mb && unitsOnBoard > 0) mightOnBoard += c.mb; // equipment attached to a unit
        for (const u of c.tok?.units || []) { unitsOnBoard++; mightOnBoard += u.m; if (u.temp) temp.push(u.m); }
        gold += c.tok?.gold || 0;
        if (E && c.t === "Spell") E.trash.push(c);
        drew += c.drawsAlone != null && unitsOnBoard === 0 ? c.drawsAlone : c.draws;
        extraRunes += c.channels;
      }
      spent += pick.spend; ready -= pick.spend;
      // Power is paid by recycling runes of that domain to the bottom of the rune deck;
      // already-exhausted runes go first, so a recycle only costs Energy once those run out.
      // Gold covers what the board's colours can't. With a Gold-making legend, banked Gold pays
      // first, and a rune is recycled only for what the Gold can't cover (that recycle still
      // makes next turn's Gold): recycling a rune while Gold sits unspent just shrinks the board.
      let goldLeft = gold;
      if (E) { const emp = played.filter((c) => c.revives).reduce((a, c) => a + c.p, 0); E.pay.empower += emp; E.pay.develop += (pick.power || 0) - emp; }
      for (const [d, q] of Object.entries(pick.need || {}))
        for (let i = 0; i < q; i++) {
          let j = d === "rainbow" ? -1 : board.indexOf(d);
          const preferGold = deck.legendGold && goldLeft > 0;
          if ((j < 0 || preferGold) && goldLeft > 0) { goldLeft--; if (E) E.fromGold++; continue; }
          if (j < 0) j = board.length - 1;
          if (j > -1) recycle(j);
        }
      gold = goldLeft;
      if (E) resolveFizz();
      ready = Math.min(ready, board.length);
      if (E) drawN(drew); else for (let i = 0; i < drew && lib.length; i++) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
      if (!drew) break;
    }
    for (let i = 0; i < extraRunes && runeDeck.length; i++) board.push(runeDeck.shift());
    // Pressure scenario: fight tricks cast with what developing left, into the trash.
    if (E && t >= sc.tricksFrom) {
      const want = Math.floor(sc.tricksPerTurn) + (r() < sc.tricksPerTurn % 1 ? 1 : 0);
      for (let k = 0; k < want; k++) {
        const c = hand.filter((x) => x.eng?.trick && x.e <= ready).sort((a, b) => a.e - b.e)[0];
        if (!c || !payPower(c.d[0], c.p || 0, "trick")) { if (hand.some((x) => x.eng?.trick)) E.trickBlocked++; break; }
        ready -= c.e; spent += c.e; hand.splice(hand.indexOf(c), 1); E.trash.push(c); E.tricks++;
        if (c.eng.ownBounce) replayBest();
        // A kill readies a legend that readies on deaths: the next recycle this turn makes Gold.
        if (c.eng.kills) { E.kills++; if (deck.readyOnDeath && deck.legendGold && !legendReady) { legendReady = true; readiedByKill = true; } }
        ready = Math.min(ready, board.length);
      }
    }
    if (E) { for (const m of E.mats) if (!m.empowered) E.matChances++; }
    // Hide one card with what development left: one Power, any colour.
    if (opts.hide && t >= 2 && unitsOnBoard > 0 && down.length < (E && sc.bandleTree ? 3 : 2)) {
      const cands = hand.filter((c) => c.hidden);
      // An answer (a key card) first, then interaction, then the rest.
      cands.sort((a, b) => (keys.has(b.n) - keys.has(a.n)) || ((b.role === "interaction") - (a.role === "interaction")));
      const c = cands[0];
      if (c && (gold > 0 || board.length > 0)) {
        if (gold > 0) { gold--; if (E) E.fromGold++; } else { const j = board.length - 1; recycle(j); ready = Math.min(ready, board.length); }
        if (E) E.pay.hide++;
        hand.splice(hand.indexOf(c), 1); down.push(c);
      } else if (c && E) E.hideBlocked++;
    }
    // Power paid on your own turn: Sivir, Mercenary's "spent at least [A][A] this turn" (+2 Might, Ganking).
    if (E) { const p = E.fromRunes + E.fromGold - paidAtStart; E.powerTurns.push(p); if (t >= 4 && p >= 2) E.power2From4++; }
    // Their turn: what could you use against an attack? A face-down card, free (§811.1.b);
    // or a Reaction or Action from hand, paid from the runes still ready (Energy) and from
    // runes of its colour, recycled whether ready or not, plus ready Gold (Power).
    const doms2 = {};
    for (const d of board) doms2[d] = (doms2[d] || 0) + 1;
    const castable = (c) => c.quick && c.e <= ready && Math.max(0, (c.p || 0) - (doms2[c.d[0]] || 0)) <= gold;
    const handUse = hand.filter((c) => c.role === "interaction" && castable(c));
    out.gold.push(gold + goldNext); out.facedown.push(down.length);
    out.react.push(down.length > 0 || handUse.length > 0);
    if (keys.size) {
      const inDown = down.some((c) => keys.has(c.n)), inHand = hand.some((c) => keys.has(c.n) && castable(c));
      out.answerDown.push(inDown); out.answerHand.push(inHand); out.answer.push(inDown || inHand);
    }
    // Their turn (sc.attacksPerTurn): they attack a hold. You answer with a face-down answer
    // (free), else an answer from hand paid from what's ready (held up or left over) and Gold,
    // else flip a hidden unit to defend. One response per attack. Flipped spells go to the
    // trash; Star-Crossed's friendly half replays your best unit; a flipped Tornado next to a
    // Matriarch empowers her (she revives now, free) and disempowers at end of turn; a flipped
    // Tideturner swaps with a Traveling Merchant, which moves.
    // Their removal goes at the scorer first (sc.focus), before they attack.
    const scorer = E && E.bodies.find((b) => b.eng?.holdPoint);
    if (foe && scorer && t >= 2 && r() < (sc.focus ?? 1)) {
      const j = foeHas(t, (x) => x === "R");
      if (j > -1) { foeUsed.add(j); leaveDead(scorer); E.eveRemoved++; }
    }
    if (E && t >= sc.attacksFrom && r() < sc.attacksPerTurn) {
      E.attacks++;
      const eve = E.bodies.find((b) => b.eng?.holdPoint);
      if (foe && eve && down.length && sc.keepForEvelynn && r() < (sc.focus ?? 1)) {
        // They attack her battlefield. Her bodies hold unless a big unit they can pay for breaks
        // the hold (the fight check); the other units split between the two battlefields.
        const big = foeHas(t, (x) => typeof x === "object" && x.e <= 2 * t) > -1;
        const beside = Math.min(2, Math.floor((unitsOnBoard - 1) / 2));
        const breaks = big && (beside >= 2 ? foe.lose2 : beside === 1 ? foe.lose1 : true);
        const doms4 = {}; for (const d of board) doms4[d] = (doms4[d] || 0) + 1;
        const hAns = hand.filter((c) => keys.has(c.n) && c.quick && c.e <= ready && Math.max(0, (c.p || 0) - (doms4[c.d[0]] || 0)) <= gold).sort((a, b) => a.e - b.e)[0];
        if (!breaks) E.eveHeld++;
        else if (hAns && payPower(hAns.d[0], hAns.p || 0, "trick")) {
          ready -= hAns.e; hand.splice(hand.indexOf(hAns), 1); E.trash.push(hAns); E.answered++; E.answeredHand++;
          if (hAns.eng?.ownBounce) replayBest();
        } else if (keys.has(down[0].n) || down[0].eng?.flipRecycle
          || (down[0].t === "Unit" && (beside + 1 >= 3 || !(beside + 1 >= 2 ? foe.lose2 : foe.lose1)))) {
          // (a hidden unit saves the hold only if one more body beside her is enough)
          // Flip the card kept for her: the hold survives, her point this turn doesn't.
          const k = down.shift(); E.keeperFlips++; E.answered++; E.answeredDown++;
          if (k.t === "Spell") { E.trash.push(k); if (k.eng?.ownBounce) replayBest(); }
          else if (k.eng?.flipRecycle) lib.push(k); else { unitsOnBoard++; mightOnBoard += k.m; E.bodies.push(k); }
        } else {
          // The battlefield is lost: the face-down card there is trashed (§323.6.a) and she dies.
          const k = down.shift(); E.trash.push(k); leaveDead(eve); E.eveLost++;
        }
      } else {
      // sc.keepForEvelynn, the guide's rule: with Evelynn on board, her battlefield keeps one
      // face-down card unflipped (bodies and hand answers defend it); only the others flip.
      const keeper = sc.keepForEvelynn && E.bodies.some((b) => b.eng?.holdPoint) ? 1 : 0;
      const flippable = down.length > keeper ? down.slice(keeper) : [];
      const downAns = flippable.find((c) => keys.has(c.n));
      const doms3 = {}; for (const d of board) doms3[d] = (doms3[d] || 0) + 1;
      const handAns = hand.filter((c) => keys.has(c.n) && c.quick && c.e <= ready && Math.max(0, (c.p || 0) - (doms3[c.d[0]] || 0)) <= gold).sort((a, b) => a.e - b.e)[0];
      if (downAns) {
        down.splice(down.indexOf(downAns), 1); E.answered++; E.answeredDown++;
        if (downAns.t === "Spell") E.trash.push(downAns);
        if (downAns.eng?.ownBounce) replayBest();
      } else if (handAns && payPower(handAns.d[0], handAns.p || 0, "trick")) {
        ready -= handAns.e; hand.splice(hand.indexOf(handAns), 1); E.trash.push(handAns); E.answered++; E.answeredHand++;
        if (handAns.eng?.ownBounce) replayBest();
      } else {
        const unit = flippable.find((c) => c.t === "Unit");
        if (unit) {
          down.splice(down.indexOf(unit), 1); E.unitFlips++;
          if (unit.eng?.flipRecycle) lib.push(unit);   // Elnuk: +3 to a defender, then to the bottom of the deck
          else { unitsOnBoard++; mightOnBoard += unit.m; E.bodies.push(unit); }
          if (unit.eng?.flipEmpower) {
            const m = E.mats.find((x) => !x.empowered && E.trash.some((y) => reviveFits(y, x.c.eng.revive.max)));
            if (m) {
              m.empowered = true; E.tornadoRevives++; E.matHits++;
              const u = E.trash.filter((y) => reviveFits(y, m.c.eng.revive.max)).sort((a, b) => b.e - a.e || b.m - a.m)[0];
              E.trash.splice(E.trash.indexOf(u), 1); unitsOnBoard++; mightOnBoard += u.m; drawN(arrive(u)); resolveFizz();
              tornadoReset.push(m);   // "Disempower it at end of turn"
            }
          }
          if (unit.eng?.swapMove) { const mer = E.bodies.find((b) => b.eng?.moveDiscard); if (mer) { fireMove(mer); E.swapMoves++; } }
        }
      }
    }
    }
    for (const m of tornadoReset) m.empowered = false;
    tornadoReset = [];
    // Pressure scenario: your cheapest units die at the end of the turn, into the trash.
    if (E && t >= sc.deathsFrom) {
      const want = Math.floor(sc.deathsPerTurn) + (r() < sc.deathsPerTurn % 1 ? 1 : 0);
      for (let k = 0; k < want && E.bodies.length; k++) {
        const u = E.bodies.slice().sort((a, b) => a.m - b.m || a.e - b.e)[0];
        leaveDead(u);
      }
    }
    if (E) { out.trashSpells.push(E.trash.filter((x) => fizzFits(x, 3)).length); out.trashUnits.push(E.trash.filter((x) => reviveFits(x, 3)).length); }
    // Stuck: a card left in hand whose Energy the board could pay but whose Power domain it can't.
    const doms = new Set(board);
    const stuck = hand.some((c) => c.role !== "interaction" && c.p && c.e <= board.length && !c.d.some((d) => doms.has(d)));
    out.hand.push(hand.length);
    out.spent.push(spent); out.units.push(unitsOnBoard); out.might.push(mightOnBoard); out.stuck.push(stuck);
    out.seen.push(keySet.length ? keySet.some((k) => seen.has(k)) : null);
  }
  if (E) out.engine = { pay: E.pay, fromRunes: E.fromRunes, fromGold: E.fromGold, goldMade: E.goldMade, goldFromKills: E.goldFromKills,
    kills: E.kills, hideBlocked: E.hideBlocked, trickBlocked: E.trickBlocked, empowerSkipped: E.empowerSkipped,
    fizzPlays: E.fizzPlays, fizzHits: E.fizzHits, fizzUnpaid: E.fizzUnpaid, matChances: E.matChances, matHits: E.matHits,
    tricks: E.tricks, burns: E.burns, deaths: E.deaths, discards: E.discards, drawn: E.drawn,
    attacks: E.attacks, answered: E.answered, answeredDown: E.answeredDown, answeredHand: E.answeredHand, unitFlips: E.unitFlips,
    replays: E.replays, daisReplays: E.daisReplays, tornadoRevives: E.tornadoRevives, swapMoves: E.swapMoves,
    evelynnPoints: E.evelynnPoints, reserved: E.reserved, powerTurns: E.powerTurns, power2From4: E.power2From4,
    eveRemoved: E.eveRemoved, eveLost: E.eveLost, eveHeld: E.eveHeld, keeperFlips: E.keeperFlips,
    eveTurns: E.eveTurns, eveBare: E.eveBare, eveFirst: E.eveFirst };
  return out;
}

// ── mulligan policies ────────────────────────────────────────────────────────
export const POLICIES = {
  "keep all": () => [],
  "bottom 5+ cost": (h) => h.filter((c) => c.e >= 5).sort((a, b) => b.e - a.e).slice(0, 2),
  "bottom 4+ cost": (h) => h.filter((c) => c.e >= 4).sort((a, b) => b.e - a.e).slice(0, 2),
  "need a 2-drop": (h) => (h.some((c) => c.e <= 2 && c.t === "Unit")
    ? h.filter((c) => c.e >= 5).sort((a, b) => b.e - a.e).slice(0, 2)
    : h.slice().sort((a, b) => b.e - a.e).slice(0, 2)),
};
const tempo = (g) => g.spent.slice(0, 4).reduce((a, b) => a + b, 0);

export function simulate(deck, { games = 20000, seed = 1, keys = [], hide = false } = {}) {
  const po = { hide };
  const res = {};
  for (const [name, pol] of Object.entries(POLICIES)) {
    const acc = { play: [], draw: [] };
    for (const side of ["play", "draw"]) {
      const r = rng(seed);
      for (let i = 0; i < games / 2; i++) acc[side].push(playGame(deck, r, side === "draw", pol, keys, null, po));
    }
    res[name] = acc;
  }
  const score = (acc) => [...acc.play, ...acc.draw].reduce((a, g) => a + tempo(g), 0) / (acc.play.length + acc.draw.length);
  // "keep all" is the baseline; another policy wins only by a margin the shuffle can't make.
  const ranked = Object.keys(res).sort((a, b) => score(res[b]) - score(res[a]));
  const bestName = score(res[ranked[0]]) - score(res["keep all"]) >= 0.2 ? ranked[0] : "keep all";
  const flat = Math.max(...Object.values(res).map(score)) - Math.min(...Object.values(res).map(score)) < 0.2;

  // Per-card mulligan value: replay the same shuffles, once keeping the card and once
  // bottoming it, and compare Energy spent over turns 1–4. Same deck order both times, so
  // the difference is the decision and not the luck.
  const delta = new Map();
  const r = rng(seed + 7);
  for (let i = 0; i < Math.min(games, 8000); i++) {
    const s = Math.floor(r() * 2 ** 31);
    const onDraw = i % 2 === 1;
    const base = playGame(deck, rng(s), onDraw, POLICIES[bestName], [], null, po);
    for (const c of new Set(base.opener.map((x) => x.n))) {
      const keep = playGame(deck, rng(s), onDraw, () => [], [], (h) => POLICIES[bestName](h).filter((x) => x.n !== c), po);
      const bot = playGame(deck, rng(s), onDraw, () => [], [], (h) => {
        const others = POLICIES[bestName](h).filter((x) => x.n !== c).slice(0, 1);
        return [h.find((x) => x.n === c), ...others];
      }, po);
      const d = delta.get(c) || { n: 0, sum: 0 };
      d.n++; d.sum += tempo(keep) - tempo(bot);
      delta.set(c, d);
    }
  }
  const reactive = new Set(deck.main.filter((c) => c.role === "interaction").map((c) => c.n));
  const guide = [...delta.entries()].filter(([n, d]) => d.n >= 50 && !reactive.has(n))
    .map(([n, d]) => ({ n, keep: d.sum / d.n, seen: d.n })).sort((a, b) => b.keep - a.keep);

  const summarise = (games) => {
    const T = (f) => Array.from({ length: TURNS }, (_, t) => games.reduce((a, g) => a + f(g, t), 0) / games.length);
    return {
      spent: T((g, t) => g.spent[t]), units: T((g, t) => g.units[t]), might: T((g, t) => g.might[t]),
      stuck: T((g, t) => (g.stuck[t] ? 1 : 0)), seen: keys.length ? T((g, t) => (g.seen[t] ? 1 : 0)) : null,
      noPlayT1T2: games.filter((g) => g.spent[0] + g.spent[1] === 0).length / games.length,
      twoUnitsByT3: games.filter((g) => g.units[2] >= 2).length / games.length,
    };
  };
  const best = res[bestName];
  return {
    policies: Object.fromEntries(Object.entries(res).map(([k, v]) => [k, score(v)])),
    best: bestName, flat, play: summarise(best.play), draw: summarise(best.draw), guide, games,
  };
}

// ── rune split ───────────────────────────────────────────────────────────────
// The guides' advice is "count your Power pips and skew toward the demanding domain";
// this tests it. Every split from 3/9 to 9/3 on the same shuffles, scored on Energy spent
// turns 1–4, with how often a card sits stuck on its domain by turn 3 as the tiebreak.
export function sweepRunes(deck, { games = 4000, seed = 1, hide = false } = {}) {
  const doms = (deck.legend?.d || [...new Set(deck.runes)]).slice(0, 2);
  if (doms.length < 2) return null;
  const listed = deck.runes.filter((d) => d === doms[0]).length;
  const rows = [];
  for (let k = 3; k <= 9; k++) {
    const d2 = { ...deck, runes: [...Array(k).fill(doms[0]), ...Array(12 - k).fill(doms[1])] };
    let e = 0, stuck = 0, n = 0;
    for (const side of [false, true]) {
      const r = rng(seed);
      for (let i = 0; i < games / 2; i++) { const g = playGame(d2, r, side, POLICIES["keep all"], [], null, { hide }); e += tempo(g); stuck += g.stuck[2] ? 1 : 0; n++; }
    }
    rows.push({ split: `${k} ${doms[0]} / ${12 - k} ${doms[1]}`, k, energy: e / n, stuck: stuck / n });
  }
  // A tenth of an Energy over four turns is noise, so ties go to fewer stuck hands, then
  // to the split the deck already runs.
  const tenth = (x) => Math.round(x * 10);
  const best = rows.slice().sort((a, b) => tenth(b.energy) - tenth(a.energy) ||
    Math.round(a.stuck * 100) - Math.round(b.stuck * 100) || (a.k === listed ? -1 : b.k === listed ? 1 : 0))[0];
  // Only call a different split better when the gain is real: +0.2 Energy over turns 1–4,
  // or 3 points fewer hands stuck on a domain. Anything smaller is the shuffle talking.
  // It must also not be meaningfully worse on the other measure (0.2 Energy, 1 point stuck),
  // or a split that buys a little tempo by stranding cards would be recommended.
  const listedRow = rows.find((x) => x.k === listed) || null;
  if (!listedRow) return { doms, listed, rows, best, listedRow, change: false };
  const improves = (x) => x.k !== listed &&
    ((x.energy - listedRow.energy >= 0.2 && x.stuck - listedRow.stuck <= 0.01) ||
     (listedRow.stuck - x.stuck >= 0.03 && listedRow.energy - x.energy <= 0.2));
  // Of the splits that improve, take the smallest move that is within a point of the best
  // stuck rate: a 6/6 deck that is fixed by 5/7 should not be told to play 3/9.
  const good = rows.filter(improves);
  const floor = Math.min(...good.map((x) => x.stuck));
  const cands = good.filter((x) => x.stuck <= floor + 0.01)
    .sort((a, b) => Math.abs(a.k - listed) - Math.abs(b.k - listed) || b.energy - a.energy);
  return { doms, listed, rows, best: cands[0] || listedRow, listedRow, change: !!cands.length };
}

