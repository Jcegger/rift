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

export function classify(c) {
  const tok = tokensOf(c.x);
  if (c.t !== "Spell") return { role: "proactive", draws: 0, needsUnit: false, channels: 0, tok, mb: c.t === "Gear" ? (c.mb || 0) : 0 };
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
    tok, mb: 0,
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
    for (let i = 0; i < q; i++) main.push({ n: c.n, t: c.t, e: c.e ?? 0, p: c.p ?? 0, d: c.d || [], m: c.m ?? 0, ...k });
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
  return { legend, champ, main, runes, unknown, ability };
}

// ── one turn's plays: spend as much as the runes allow ──────────────────────────
// Exact search over the hand (hands are small): maximise Energy spent, then units, then
// keep Power spending low, because every rune recycled for Power shrinks next turn.
function choosePlays(hand, champ, board, ready, unitsOnBoard, ability, gold) {
  const pool = [...hand, ...(champ ? [champ] : []), ...(ability ? [ability] : [])]
    .filter((c) => c.role !== "interaction" && (!c.needsUnit || unitsOnBoard > 0));
  const byDom = {};
  for (const d of board) byDom[d] = (byDom[d] || 0) + 1;
  let best = { idx: [], spend: 0, units: 0, power: 0, need: {}, gold: 0 };
  const n = Math.min(pool.length, 12);
  for (let mask = 1; mask < 1 << n; mask++) {
    let e = 0, units = 0, power = 0; const need = {}; const idx = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) {
      const c = pool[i]; e += c.e; idx.push(i);
      if (c.t === "Unit") units++;
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
export function playGame(deck, r, onDraw, policy, keySet, forceBottom = null) {
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
  const out = { opener, spent: [], units: [], might: [], stuck: [], seen: [], runes: [], hand: [], drawn: 0 };
  let unitsOnBoard = 0, mightOnBoard = 0, gold = 0, temp = [];
  const seen = new Set(hand.map((c) => c.n));
  for (let t = 1; t <= TURNS; t++) {
    // [Temporary] units die at the start of their controller's Beginning Phase.
    for (const m of temp) { unitsOnBoard--; mightOnBoard -= m; }
    temp = [];
    let abilityUsed = false;
    const ch = t === 1 && onDraw ? 3 : 2;
    for (let i = 0; i < ch && runeDeck.length; i++) board.push(runeDeck.shift());
    if (lib.length) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
    // Main phase: play, and if a cantrip drew cards, look again with what is left.
    let ready = board.length, spent = 0, extraRunes = 0;
    out.runes.push(board.length);
    for (let pass = 0; pass < 4; pass++) {
      const pick = choosePlays(hand, champ, board, ready, unitsOnBoard, abilityUsed ? null : deck.ability, gold);
      if (!pick.idx.length) break;
      const played = pick.idx.map((i) => pick.pool[i]);
      let drew = 0;
      for (const c of played) {
        if (c === champ) champ = null; else if (c === deck.ability) abilityUsed = true; else hand.splice(hand.indexOf(c), 1);
        if (c.t === "Unit") { unitsOnBoard++; mightOnBoard += c.m; }
        if (c.mb && unitsOnBoard > 0) mightOnBoard += c.mb; // equipment attached to a unit
        for (const u of c.tok?.units || []) { unitsOnBoard++; mightOnBoard += u.m; if (u.temp) temp.push(u.m); }
        gold += c.tok?.gold || 0;
        drew += c.drawsAlone != null && unitsOnBoard === 0 ? c.drawsAlone : c.draws;
        extraRunes += c.channels;
      }
      spent += pick.spend; ready -= pick.spend; gold -= pick.gold || 0;
      // Power is paid by recycling runes of that domain to the bottom of the rune deck;
      // already-exhausted runes go first, so a recycle only costs Energy once those run out.
      let goldLeft = pick.gold || 0;
      for (const [d, q] of Object.entries(pick.need || {}))
        for (let i = 0; i < q; i++) {
          let j = d === "rainbow" ? -1 : board.indexOf(d);
          if (j < 0 && goldLeft > 0) { goldLeft--; continue; }
          if (j < 0) j = board.length - 1;
          if (j > -1) { runeDeck.push(board[j]); board.splice(j, 1); }
        }
      ready = Math.min(ready, board.length);
      for (let i = 0; i < drew && lib.length; i++) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
      if (!drew) break;
    }
    for (let i = 0; i < extraRunes && runeDeck.length; i++) board.push(runeDeck.shift());
    // Stuck: a card left in hand whose Energy the board could pay but whose Power domain it can't.
    const doms = new Set(board);
    const stuck = hand.some((c) => c.role !== "interaction" && c.p && c.e <= board.length && !c.d.some((d) => doms.has(d)));
    out.hand.push(hand.length);
    out.spent.push(spent); out.units.push(unitsOnBoard); out.might.push(mightOnBoard); out.stuck.push(stuck);
    out.seen.push(keySet.length ? keySet.some((k) => seen.has(k)) : null);
  }
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

export function simulate(deck, { games = 20000, seed = 1, keys = [] } = {}) {
  const res = {};
  for (const [name, pol] of Object.entries(POLICIES)) {
    const acc = { play: [], draw: [] };
    for (const side of ["play", "draw"]) {
      const r = rng(seed);
      for (let i = 0; i < games / 2; i++) acc[side].push(playGame(deck, r, side === "draw", pol, keys));
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
    const base = playGame(deck, rng(s), onDraw, POLICIES[bestName], []);
    for (const c of new Set(base.opener.map((x) => x.n))) {
      const keep = playGame(deck, rng(s), onDraw, () => [], [], (h) => POLICIES[bestName](h).filter((x) => x.n !== c));
      const bot = playGame(deck, rng(s), onDraw, () => [], [], (h) => {
        const others = POLICIES[bestName](h).filter((x) => x.n !== c).slice(0, 1);
        return [h.find((x) => x.n === c), ...others];
      });
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
export function sweepRunes(deck, { games = 4000, seed = 1 } = {}) {
  const doms = (deck.legend?.d || [...new Set(deck.runes)]).slice(0, 2);
  if (doms.length < 2) return null;
  const listed = deck.runes.filter((d) => d === doms[0]).length;
  const rows = [];
  for (let k = 3; k <= 9; k++) {
    const d2 = { ...deck, runes: [...Array(k).fill(doms[0]), ...Array(12 - k).fill(doms[1])] };
    let e = 0, stuck = 0, n = 0;
    for (const side of [false, true]) {
      const r = rng(seed);
      for (let i = 0; i < games / 2; i++) { const g = playGame(d2, r, side, POLICIES["keep all"], []); e += tempo(g); stuck += g.stuck[2] ? 1 : 0; n++; }
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

