#!/usr/bin/env node
// Consistency simulator: plays a deck against nobody, thousands of times, and reports
// what its draws and runes let it do. Any deck, any legend.
//
//   scripts/sim riven                      # a saved deck, by name
//   scripts/sim --legend "rogue assassin"  # the best-placing legal list for a legend
//   scripts/sim --field 12                 # the 12 legends with the most top-8s, side by side
//   options: --games N (default 20000) · --seed S · --since YYYY-MM-DD (default 2026-09-15)
//            --champion "Riven, Broken Blade" · --key "Meditation,Blade of the Exile" · --json
//
// What it is, and what it is not. A goldfish: no opponent, and no card text — a card is
// its cost, its type, its domain and its Might. That is enough to answer the questions a
// deck's mana base and curve decide, and nothing else:
//   - does the opening hand have plays, and what should a mulligan send back
//   - how much Energy the deck actually spends by turn 4 (tempo, the classic proxy)
//   - how often a card sits in hand for want of the right Power domain
//   - how much board (units, Might) it has to contest battlefields with by turn 3–4
//   - how often named key cards have been seen by a given turn
// It does NOT say who wins a matchup. Points are capped at one per battlefield per turn
// (§470), so an unopposed deck scores on the same clock whatever it plays; a "turns to
// 8" figure would be the same number for every deck and is deliberately not reported.
//
// Rules modelled, each from docs/rules.md: 40-card main deck, the Chosen Champion starts
// in the Champion Zone and is castable from there (§103.2.a, §108.3.d); 4-card opening
// hand and one mulligan of up to 2 cards to the bottom (§116, §117); channel 2 ready runes
// a turn, the player going second channels 1 extra on their first turn (§315.3.b,
// §485.7); draw 1 every turn, including the first player's first (§315.4.b); a card
// costing E Energy and P Power needs max(E, P) runes, E of them ready, P of them of its
// domain and recycled to the bottom of the rune deck (§164.2, rules.md "Resources");
// units enter exhausted (§143.4), so a unit can first move the turn after it is played.

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadState, loadCatalog, bannedNameSet, standardNameSet, deckIsLegal } from "./state.mjs";

const url = (f) => new URL(`../data/${f}`, import.meta.url);
const readJson = async (f) => JSON.parse(await readFile(f, "utf8"));
const TURNS = 5;

// ── a seeded RNG, so a run can be reproduced and two decks compared on equal footing ──
function rng(seed) {
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
export function classify(c) {
  if (c.t !== "Spell") return { role: "proactive", draws: 0, needsUnit: false, channels: 0 };
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
  // The Chosen Champion: a champion unit whose champion tag matches the legend (§103.2.a.2).
  // The list does not say which copy was chosen, so take the one named, else the cheapest.
  const isChamp = (x) => x.t === "Unit" && x.n.includes(", ") && champTags.has(x.n.split(", ")[0]);
  let champ = null;
  const cands = main.filter(isChamp);
  if (opts.champion) champ = cands.find((x) => x.n.toLowerCase() === opts.champion.toLowerCase()) || null;
  if (!champ && cands.length) champ = cands.slice().sort((a, b) => a.e - b.e || a.n.localeCompare(b.n))[0];
  if (champ) main.splice(main.indexOf(champ), 1);
  return { legend, champ, main, runes, unknown };
}

// ── one turn's plays: spend as much as the runes allow ──────────────────────────
// Exact search over the hand (hands are small): maximise Energy spent, then units, then
// keep Power spending low, because every rune recycled for Power shrinks next turn.
function choosePlays(hand, champ, board, ready, unitsOnBoard) {
  const pool = (champ ? [...hand, champ] : hand.slice()).filter((c) => c.role !== "interaction" && (!c.needsUnit || unitsOnBoard > 0));
  const byDom = {};
  for (const d of board) byDom[d] = (byDom[d] || 0) + 1;
  let best = { idx: [], spend: 0, units: 0, power: 0, need: {} };
  const n = Math.min(pool.length, 12);
  for (let mask = 1; mask < 1 << n; mask++) {
    let e = 0, units = 0, power = 0; const need = {}; const idx = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) {
      const c = pool[i]; e += c.e; idx.push(i);
      if (c.t === "Unit") units++;
      if (c.p) { power += c.p; const dom = c.d.find((x) => byDom[x]) || c.d[0]; need[dom] = (need[dom] || 0) + c.p; }
    }
    if (e > ready || power > board.length) continue;
    if (Object.entries(need).some(([d, q]) => (byDom[d] || 0) < q)) continue;
    if (e > best.spend || (e === best.spend && (units > best.units || (units === best.units && power < best.power))))
      best = { idx, spend: e, units, power, need };
  }
  return { ...best, pool };
}

// ── one game ────────────────────────────────────────────────────────────────
// policy(hand) returns the cards to send to the bottom (at most 2).
function playGame(deck, r, onDraw, policy, keySet, forceBottom = null) {
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
  const out = { opener, spent: [], units: [], might: [], stuck: [], seen: [] };
  let unitsOnBoard = 0, mightOnBoard = 0;
  const seen = new Set(hand.map((c) => c.n));
  for (let t = 1; t <= TURNS; t++) {
    const ch = t === 1 && onDraw ? 3 : 2;
    for (let i = 0; i < ch && runeDeck.length; i++) board.push(runeDeck.shift());
    if (lib.length) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
    // Main phase: play, and if a cantrip drew cards, look again with what is left.
    let ready = board.length, spent = 0, extraRunes = 0;
    for (let pass = 0; pass < 4; pass++) {
      const pick = choosePlays(hand, champ, board, ready, unitsOnBoard);
      if (!pick.idx.length) break;
      const played = pick.idx.map((i) => pick.pool[i]);
      let drew = 0;
      for (const c of played) {
        if (c === champ) champ = null; else hand.splice(hand.indexOf(c), 1);
        if (c.t === "Unit") { unitsOnBoard++; mightOnBoard += c.m; }
        drew += c.drawsAlone != null && unitsOnBoard === 0 ? c.drawsAlone : c.draws;
        extraRunes += c.channels;
      }
      spent += pick.spend; ready -= pick.spend;
      // Power is paid by recycling runes of that domain to the bottom of the rune deck;
      // already-exhausted runes go first, so a recycle only costs Energy once those run out.
      for (const [d, q] of Object.entries(pick.need || {}))
        for (let i = 0; i < q; i++) { const j = board.indexOf(d); if (j > -1) { board.splice(j, 1); runeDeck.push(d); } }
      ready = Math.min(ready, board.length);
      for (let i = 0; i < drew && lib.length; i++) { const c = lib.shift(); hand.push(c); seen.add(c.n); }
      if (!drew) break;
    }
    for (let i = 0; i < extraRunes && runeDeck.length; i++) board.push(runeDeck.shift());
    // Stuck: a card left in hand whose Energy the board could pay but whose Power domain it can't.
    const doms = new Set(board);
    const stuck = hand.some((c) => c.role !== "interaction" && c.p && c.e <= board.length && !c.d.some((d) => doms.has(d)));
    out.spent.push(spent); out.units.push(unitsOnBoard); out.might.push(mightOnBoard); out.stuck.push(stuck);
    out.seen.push(keySet.length ? keySet.some((k) => seen.has(k)) : null);
  }
  return out;
}

// ── mulligan policies ────────────────────────────────────────────────────────
const POLICIES = {
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
  const bestName = Object.keys(res).sort((a, b) => score(res[b]) - score(res[a]))[0];

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
    best: bestName, play: summarise(best.play), draw: summarise(best.draw), guide, games,
  };
}

// ── where decks come from ────────────────────────────────────────────────────
async function fieldLists(cat, since, allSets) {
  const snap = await readJson(url("decks.json"));
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const bannedNames = bannedNameSet(banned);
  const std = allSets ? null : standardNameSet(banned, cat.cards);
  return snap.decks.filter((d) => (d.dt || "") >= since && deckIsLegal(d, cat.BY, bannedNames, std));
}
const bestPlacing = (lists) => lists.slice().sort((a, b) =>
  ((a.pl ?? 1e9) / (a.ec || 1)) - ((b.pl ?? 1e9) / (b.ec || 1)) || (b.vw || 0) - (a.vw || 0))[0];
const placeText = (d) => (d.pl != null && d.ec ? `${d.pl} of ${d.ec}, ${d.ev}` : "no placement on record");

// ── output ──────────────────────────────────────────────────────────────────
const f1 = (x) => x.toFixed(1), pct = (x) => `${Math.round(x * 100)}%`;
function report(title, src, deck, s, keys) {
  console.log(`\n${title}`);
  console.log(`  ${src}`);
  console.log(`  legend ${deck.legend ? deck.legend.n : "not in list"} · champion zone: ${deck.champ ? deck.champ.n : "none found"}` +
    ` · ${deck.main.length + (deck.champ ? 1 : 0)} main · ${deck.runes.length} runes` +
    (deck.unknown.length ? ` · ${deck.unknown.length} codes not in catalog: ${deck.unknown.join(", ")}` : ""));
  const runeMix = deck.runes.reduce((m, d) => ((m[d] = (m[d] || 0) + 1), m), {});
  const inter = [...new Set(deck.main.filter((c) => c.role === "interaction").map((c) => c.n))];
  console.log(`  interaction held, not cast (${deck.main.filter((c) => c.role === "interaction").length}): ${inter.join(", ") || "none"}`);
  console.log(`  runes ${Object.entries(runeMix).map(([d, q]) => `${q} ${d}`).join(" / ")} · ${s.games} games, half on the play`);
  console.log(`\n  MULLIGAN  best policy: ${s.best}   (Energy spent turns 1–4: ` +
    Object.entries(s.policies).map(([k, v]) => `${k} ${f1(v)}`).join(" · ") + ")");
  const top = s.guide.slice(0, 5), bot = s.guide.slice(-5).reverse();
  console.log(`  keep first   ${top.map((g) => `${g.n} (+${f1(g.keep)})`).join(", ")}`);
  console.log(`  bottom first ${bot.filter((g) => g.keep < 0).map((g) => `${g.n} (${f1(g.keep)})`).join(", ") || "nothing loses tempo by being kept"}`);
  console.log(`\n               turn      1     2     3     4     5`);
  for (const side of ["play", "draw"]) {
    const x = s[side];
    console.log(`  on the ${side.padEnd(4)}  Energy spent ${x.spent.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`             units on board ${x.units.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`             Might on board ${x.might.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`        stuck on Power domain ${x.stuck.map((v) => pct(v).padStart(5)).join(" ")}`);
    if (x.seen) console.log(`   seen ${keys.join(" / ").slice(0, 20).padEnd(20)} ${x.seen.map((v) => pct(v).padStart(5)).join(" ")}`);
    console.log(`        no play turns 1–2: ${pct(x.noPlayT1T2)} · 2+ units by turn 3: ${pct(x.twoUnitsByT3)}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (k, d = null) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
  const games = Number(opt("--games", 20000)), seed = Number(opt("--seed", 1));
  const since = opt("--since", "2026-09-15");
  const keys = (opt("--key", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const json = args.includes("--json");
  const words = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && !["--json", "--all-sets"].includes(args[i - 1])));
  const cat = await loadCatalog();

  if (opt("--field")) {
    const lists = await fieldLists(cat, since, args.includes("--all-sets"));
    const by = new Map();
    for (const d of lists) { if (!by.has(d.ln)) by.set(d.ln, []); by.get(d.ln).push(d); }
    const rank = [...by.entries()].map(([ln, ls]) => ({ ln, ls, t8: ls.filter((d) => d.pl != null && d.pl <= 8).length, n: ls.length }))
      .sort((a, b) => b.t8 - a.t8 || b.n - a.n).slice(0, Number(opt("--field")));
    const rows = [];
    for (const a of rank) {
      const d = bestPlacing(a.ls);
      const deck = buildDeck(d.cards, cat, { legendCard: cat.BY.get(d.lg) });
      const s = simulate(deck, { games: Math.min(games, 6000), seed });
      rows.push({ ln: a.ln, t8: a.t8, s, deck });
    }
    if (json) { console.log(JSON.stringify(rows.map((r) => ({ legend: r.ln, top8: r.t8, ...r.s })), null, 1)); return; }
    console.log(`\nFIELD · best-placing legal list per legend since ${since} · on the play / on the draw\n`);
    console.log(`  ${"legend".padEnd(30)} t8  mulligan        Energy T1–4   units T3   Might T4   no play T1–2   stuck T3`);
    for (const r of rows) {
      const p = r.s.play, q = r.s.draw;
      const e4 = (x) => x.spent.slice(0, 4).reduce((a, b) => a + b, 0);
      console.log(`  ${r.ln.slice(0, 30).padEnd(30)} ${String(r.t8).padStart(2)}  ${r.s.best.padEnd(15)} ${f1(e4(p)).padStart(4)} / ${f1(e4(q)).padEnd(4)}  ` +
        `${f1(p.units[2])} / ${f1(q.units[2])}  ${f1(p.might[3]).padStart(4)} / ${f1(q.might[3]).padEnd(4)}  ` +
        `${pct(p.noPlayT1T2).padStart(4)} / ${pct(q.noPlayT1T2).padEnd(4)}    ${pct(p.stuck[2])} / ${pct(q.stuck[2])}`);
    }
    console.log(`\n  A goldfish: no opponent; card text read only for draw, channel and what needs a target. Curve and mana, not who wins.`);
    return;
  }

  let list, title, src;
  if (opt("--legend")) {
    const q = opt("--legend").toLowerCase();
    const lists = (await fieldLists(cat, since, args.includes("--all-sets"))).filter((d) => (d.ln || "").toLowerCase().includes(q));
    if (!lists.length) { console.log(`no legal list since ${since} for a legend matching "${q}"`); process.exit(1); }
    const d = bestPlacing(lists);
    list = d.cards; title = `${d.ln.toUpperCase()} · best-placing list of ${lists.length}`; src = `${d.h || d.s} · ${placeText(d)}`;
  } else {
    const S = await loadState();
    const q = words.join(" ").toLowerCase();
    const d = (S.decks || []).find((x) => x.name.toLowerCase().includes(q));
    if (!q || !d) { console.log(`saved decks: ${(S.decks || []).map((x) => x.name).join(" · ")}`); process.exit(q ? 1 : 0); }
    list = d.cards; title = d.name.toUpperCase(); src = "your saved deck (main deck only; sideboard not shuffled)";
  }
  const deck = buildDeck(list, cat, { champion: opt("--champion") });
  const s = simulate(deck, { games, seed, keys });
  if (json) { console.log(JSON.stringify({ title, src, champion: deck.champ?.n, ...s }, null, 1)); return; }
  report(title, src, deck, s, keys);
  console.log(`\n  A goldfish: no opponent; card text read only for draw, channel and what needs a target. Curve and mana, not who wins.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => { console.error("\nsim failed:", e.message); process.exit(1); });
