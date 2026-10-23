// What a legend's deck is, inferred from the cards in the order a deck is built:
//
//   1. the legend's ability and what it costs to use,
//   2. the chosen champion unit's ability and cost (§103.3.a.2: it is always available),
//   3. the signature spell or gear,
//   4. the colour pair — what its card pool leans toward,
//   5. the cards that should be in it (its winners' core) or, with no lists, can be.
//
// Each layer votes for a MAIN archetype (aggro, tempo, midrange, control, ramp) and for
// SUB-archetypes (the engine or mechanic the deck is built on: movement, isolation, Empower,
// Deploy, tokens…). Earlier layers weigh more, because they are fixed by the legend while
// the later ones are choices. Every vote carries the card and the words that cast it.
//
// This is an inference from text, independent of how the deck was named by hand
// (docs/archetypes.md) or measured from its lists' numbers (scripts/build-archetypes.mjs),
// so the three can be compared. It is pattern-matching and says so.

import { plainText, engineTags, docEngineKeys } from "./engines.mjs";

export const MAINS = ["aggro", "tempo", "midrange", "control", "ramp"];
export let WEIGHTS = [5, 4, 3, 2, 1];
export const setWeights = (w) => { WEIGHTS = w; };

// Main-archetype signals: [pattern, votes]. Read on plain text (no reminder text).
const MAIN_SIGNALS = [
  [/\[assault\b/i, { aggro: 1 }, "Assault"],
  [/\[accelerate\]|\benters? ready\b|\benter ready\b/i, { aggro: 1 }, "enters ready"],
  [/\+\d+ might this turn\b/i, { aggro: 0.7, tempo: 0.3 }, "a pump"],
  [/\[legion\]/i, { aggro: 0.6, midrange: 0.4 }, "Legion"],
  [/\bwhen you play a unit\b/i, { aggro: 1 }, "pays off playing units"],
  [/\[ambush\]/i, { aggro: 0.5, tempo: 0.5 }, "Ambush"],
  [/\[ganking\]/i, { tempo: 0.7, aggro: 0.3 }, "Ganking"],
  [/\[hidden\]/i, { tempo: 0.7, control: 0.3 }, "Hidden"],
  [/\breturn (a|an|another|up to \w+)? ?(friendly |enemy )?(unit|gear|card)[^.]*\bhand\b/i, { tempo: 1 }, "bounce"],
  // Moving is how most decks fight in this game, not a style on its own: a lean, not a vote.
  [/\bmove (a|an|up to \w+|another|it|me|that)\b/i, { tempo: 0.5, midrange: 0.5 }, "moves units"],
  [/\bready (a|another|up to \w+)? ?(friendly )?unit\b|\bready (it|me)\b/i, { tempo: 0.8, aggro: 0.2 }, "readies a unit"],
  [/\bwhen you win a combat\b|\bwhen (i|a friendly unit|one or more friendly units) attacks?\b|\bwhile i'?m an attacker\b/i, { aggro: 1 }, "pays off attacking"],
  [/\bdraw \d|\bdraw (a|one|two)\b/i, { midrange: 0.6, control: 0.4 }, "card draw"],
  [/\[buff\]|\bbuff (a|another|it|me|each)\b/i, { midrange: 1 }, "buffs"],
  [/\[deathknell\]/i, { midrange: 1 }, "Deathknell value"],
  [/\bfrom your trash\b/i, { midrange: 1 }, "recursion"],
  [/\[shield\b|\[tank\]|\[deflect\b/i, { midrange: 0.7, control: 0.3 }, "a hard body"],
  [/\bkill (a|an|another|up to \w+|any number of)? ?(enemy )?(unit|gear)\b|\bdeal \d+ (damage )?to (a|an|up to \w+|each|all)\b/i, { control: 1 }, "removal"],
  [/\bcounter (a|that|the next)\b/i, { control: 1 }, "a counterspell"],
  [/-\d+ might\b/i, { control: 1 }, "shrinks"],
  [/\[stun\]|\bstun (a|an|up to \w+|each|all|it|that)\b/i, { control: 0.6, tempo: 0.4 }, "stuns"],
  [/\b(each|all|every) enemy units?\b/i, { control: 1 }, "hits every enemy unit"],
  [/\bopponents? can'?t\b/i, { control: 1 }, "denies the opponent"],
  [/\[add\]|\bchannel \d+ runes?\b|\bready (up to )?\d+ runes\b/i, { ramp: 1 }, "ramps"],
  [/\bcosts? \[\d+\] less\b|\breduce the cost\b/i, { ramp: 0.5, midrange: 0.5 }, "discounts"],
  [/\byou win the game\b|\bscore a point\b|\bscores? \d+ points?\b/i, { ramp: 0.6, control: 0.4 }, "an alternate way to score"],
];

// Sub-archetypes: the engine keys from lib/engines.mjs, plus mechanics a deck can be built
// on that are not a payoff loop. Each is [key, name, pattern].
const SUB_SIGNALS = [
  // Two opposite uses of "alone": stranding an ENEMY unit to beat it (Kha'Zix), and holding
  // with ONE friendly unit that is stronger by itself (Master Yi, Wuju Bladesman).
  ["isolation", "isolation", /\benemy unit is alone\b|\bmove an enemy unit\b/i],
  ["lone", "lone defender", /\b(friendly unit|unit you control|i) (defends|attacks|is|am)? ?alone\b|\bthe only unit\b|\bdied alone\b|\bdefends alone\b/i],
  ["ambush", "Ambush", /\[ambush\]/i],
  ["shield", "Shield", /\[shield\b/i],
  ["equipment", "Equipment", /\bequipment\b|\[equip\b|\[weaponmaster\]/i],
  ["deploy", "Deploy", /\[deploy\]/i],
  ["bounce", "bounce and replay", /\breturn (a|an|another) friendly (unit|card)[^.]*\bhand\b/i],
  ["shrink", "shrink", /-\d+ might\b/i],
  ["removal", "removal", /\bkill (a|an|up to \w+)? ?(enemy )?unit\b|\bdeal \d+ (damage )?to\b|\bcounter (a|that)\b/i],
  ["gold", "Gold", /\bgold\b/i],
  ["bombs", "bombs", /\bbomb\b/i],
  ["clones", "clones", /\bclone\b|\bcopy of\b/i],
  ["recruits", "Recruits", /\brecruit\b/i],
  ["tribes", "tribes", /\byour (mechs|birds|cats|dogs|poros)\b|\bmechs?\b|\bbird, cat, dog\b/i],
  ["bigcost", "big top end", /\bcost \[?[7-9]\]? or more\b|\b\[?[7-9]\]? or more\b/i],
  ["showdown", "showdowns", /\bshowdowns?\b/i],
];
const ENGINE_NAMES = { move: "movement", exhaust: "exhaust", buff: "buffs", offhand: "plays from elsewhere", reveal: "top of the deck",
  trash: "trash", tokens: "tokens", death: "deaths", discard: "discard", hidden: "facedown", spells: "spells", gear: "gear",
  combat: "winning fights", mighty: "Mighty", empower: "Empower", legion: "Legion", xp: "XP", stun: "stuns" };
export const SUB_NAMES = { ...ENGINE_NAMES, ...Object.fromEntries(SUB_SIGNALS.map(([k, n]) => [k, n])) };

// One card's votes: { main: {aggro…}, sub: {key: weight}, why: [..] }. Costs count too: a
// cheap unit is an aggro card, a 7-drop a ramp card, whatever their text says.
export function cardVotes(c) {
  const t = plainText(c), main = {}, sub = {}, why = [];
  const add = (o, k, v) => { o[k] = (o[k] || 0) + v; };
  for (const [re, v, label] of MAIN_SIGNALS) if (re.test(t)) { for (const [k, x] of Object.entries(v)) add(main, k, x); why.push(label); }
  const e = Number(c.e), unit = c.t === "Unit";
  // Midrange is bodies that win on value, and cost is most of what says so.
  if (unit && e <= 2) { add(main, "aggro", 0.6); why.push(`a ${e}-cost unit`); }
  else if (unit && e >= 3 && e <= 5) { add(main, "midrange", 0.6); why.push(`a ${e}-cost unit`); }
  else if (unit && e >= 6) { add(main, "ramp", 0.5); add(main, "control", 0.3); why.push(`a ${e}-cost unit`); }
  if (e >= 7) { add(main, "ramp", 0.6); why.push(`${e} Energy`); }
  // Sub-archetypes: engines read by lib/engines.mjs (payoffs count double — a payoff is a
  // choice, a feeder is usually a good card anyway), then the extra mechanics.
  for (const tag of engineTags(c)) if (!(tag.text === c.t)) add(sub, tag.engine, tag.role === "payoff" ? 1 : 0.5);
  for (const [k, , re] of SUB_SIGNALS) if (re.test(t)) add(sub, k, 1);
  return { main, sub, why };
}

// A legend's activated ability that costs [0]–[1] and an exhaust is used every turn; its
// effect counts once more. One that costs [3]+ is a late-game sink.
function legendVotes(L) {
  const v = cardVotes(L);
  // Energy or Power the legend adds that can only be spent on one thing (Kai'Sa's for
  // spells, Darius's with Legion, Ornn's for gear) fuels that thing; it is not ramp.
  if (/\[add\]/i.test(plainText(L)) && /\buse only to\b|\bspend this (energy|power) only\b|\[legion\]/i.test(plainText(L))) {
    delete v.main.ramp; v.why.push("its mana is only for one kind of play");
  }
  const cost = /\[(\d+)\][^.:]*\[E\]:|\[(\d+)\], \[E\]:/i.exec(plainText(L));
  const n = cost ? Number(cost[1] ?? cost[2]) : null;
  if (n != null && n <= 1) { for (const k of Object.keys(v.main)) v.main[k] *= 1.5; v.why.push(`its ability costs [${n}]: used every turn`); }
  if (n != null && n >= 3) { v.main.ramp = (v.main.ramp || 0) + 0.5; v.why.push(`its ability costs [${n}]: a late-game sink`); }
  return v;
}

// Sum card votes, each normalised to 1, weighted by copies; then the layer to 1 overall.
function layer(cards) {
  const main = {}, sub = {}, ev = [];
  let n = 0;
  for (const { c, w = 1, v = cardVotes(c) } of cards) {
    const ms = Object.values(v.main).reduce((a, b) => a + b, 0);
    for (const [k, x] of Object.entries(v.main)) main[k] = (main[k] || 0) + (w * x) / (ms || 1);
    for (const [k, x] of Object.entries(v.sub)) sub[k] = (sub[k] || 0) + w * x;
    n += w;
    if (v.why.length || Object.keys(v.sub).length) ev.push({ card: c.n, why: v.why, sub: Object.keys(v.sub) });
  }
  const norm = (o) => { const s = Object.values(o).reduce((a, b) => a + b, 0); return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, s ? x / s : 0])); };
  return { main: norm(main), sub: norm(sub), evidence: ev, count: n };
}

// The colour pair's lean: how far the pool of cards in exactly these domains departs from
// the whole catalog, per main archetype. Only the departures vote.
function pairLean(domains, idx) {
  const pool = (ds) => idx.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).length && (c.d || []).every((d) => ds.includes(d)));
  const all = layer(pool(["Fury", "Calm", "Mind", "Body", "Chaos", "Order"]).map((c) => ({ c })));
  const mine = layer(pool(domains).map((c) => ({ c })));
  const main = {};
  for (const k of MAINS) main[k] = Math.max(0, (mine.main[k] || 0) - (all.main[k] || 0));
  const s = Object.values(main).reduce((a, b) => a + b, 0);
  return { main: Object.fromEntries(MAINS.map((k) => [k, s ? main[k] / s : 0])), sub: {}, evidence: [{ card: domains.join("/"), why: MAINS.filter((k) => main[k] > 0.005).map((k) => `more ${k} cards than the catalog (${Math.round((mine.main[k] || 0) * 100)}% vs ${Math.round((all.main[k] || 0) * 100)}%)`), sub: [] }], count: 1 };
}

// legend: its card; idx: lib/decks.mjs indexCatalog; core: [{ c, copies, inc }] from the
// legend's winners' consensus, or null when it has no lists.
export function inferLegend(L, idx, core = null) {
  const champ = idx.championOf(L);
  const domains = (L.d || []).filter((d) => d !== "Colorless");
  const isChampUnit = (c) => c.t === "Unit" && !c.v && idx.championOf(c) === champ;
  // 2. The chosen champion: the champion unit the winners run most; with no lists, each.
  const champs = core ? core.filter((r) => isChampUnit(r.c)).sort((a, b) => b.inc - a.inc || a.c.e - b.c.e) : [];
  const chosen = champs.length ? [champs[0].c] : idx.cards.filter((c) => isChampUnit(c) && !idx.bannedNames.has(c.n)).filter((c, i, xs) => xs.findIndex((x) => x.n === c.n) === i);
  // 3. Signature spells and gear.
  const sigs = idx.cards.filter((c) => !c.v && c.t !== "Unit" && c.t !== "Legend" && idx.signatureOf(c) === champ).filter((c, i, xs) => xs.findIndex((x) => x.n === c.n) === i);
  // 5. Should (the winners' core) or, with no lists, can: the legal pool in its colours
  // that shares a sub-archetype with layers 1–3.
  const early = [layer([{ c: L, v: legendVotes(L) }]), layer(chosen.map((c) => ({ c }))), layer(sigs.map((c) => ({ c })))];
  const earlySubs = new Set(early.flatMap((l) => Object.entries(l.sub).filter(([, x]) => x >= 0.2).map(([k]) => k)));
  let fifth, basis;
  if (core?.length) { fifth = layer(core.filter((r) => !isChampUnit(r.c) && r.c.t !== "Legend").map((r) => ({ c: r.c, w: r.copies * r.inc }))); basis = "should: the winners' core"; }
  else {
    const can = idx.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).every((d) => d === "Colorless" || domains.includes(d))
      && !idx.bannedNames.has(c.n) && !(idx.signatureOf(c) && idx.signatureOf(c) !== champ) && Object.keys(cardVotes(c).sub).some((k) => earlySubs.has(k)));
    fifth = layer(can.filter((c, i, xs) => xs.findIndex((x) => x.n === c.n) === i).map((c) => ({ c }))); basis = "can: the legal cards that fit layers 1–3";
  }
  const layers = [
    { n: 1, name: "legend", cards: [L.n], ...early[0] },
    { n: 2, name: "chosen champion", cards: chosen.map((c) => c.n), ...early[1] },
    { n: 3, name: "signature", cards: sigs.map((c) => c.n), ...early[2] },
    { n: 4, name: "colour pair", cards: [domains.join("/")], ...pairLean(domains, idx) },
    { n: 5, name: basis, cards: [], ...fifth },
  ];
  const score = (pick) => { const out = {}; layers.forEach((l, i) => { for (const [k, x] of Object.entries(pick(l))) out[k] = (out[k] || 0) + WEIGHTS[i] * x; }); return out; };
  const rank = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
  const mains = rank(score((l) => l.main)), subs = rank(score((l) => l.sub));
  const total = mains.reduce((a, [, x]) => a + x, 0) || 1;
  return {
    mainScores: Object.fromEntries(mains.map(([k, x]) => [k, Math.round((x / total) * 1000) / 1000])),
    main: mains[0]?.[0] || null, mainShare: Math.round(((mains[0]?.[1] || 0) / total) * 100) / 100,
    runnerUp: mains[1]?.[0] || null,
    sub: subs[0]?.[0] || null, subName: SUB_NAMES[subs[0]?.[0]] || null, subs: subs.slice(0, 4).map(([k, x]) => ({ key: k, name: SUB_NAMES[k] || k, score: Math.round(x * 100) / 100 })),
    layers: layers.map((l) => ({ n: l.n, name: l.name, cards: l.cards, main: rank(l.main).filter(([, x]) => x > 0).slice(0, 2).map(([k]) => k),
      sub: rank(l.sub).slice(0, 3).map(([k]) => k), evidence: l.evidence.slice(0, 6) })),
  };
}

// The sub-archetype keys a hand-written heading names ("stun control", "lone-defender
// midrange", "bomb tempo"): its engine words as docs/archetypes.md's Engine lines use them,
// plus the mechanics above. Used to keep a brew on the deck's written plan when the
// inference misreads it (Vex reads as movement; its heading says stun).
const HEADING_WORDS = { isolation: /\bisolat/i, lone: /\blone\b/i, ambush: /\bambush/i, shield: /\bshield/i, equipment: /\bequip/i,
  deploy: /\bdeploy/i, bounce: /\bbounce|\bre-?buy/i, shrink: /\bshrink/i, removal: /\bremoval|\bburn\b/i, gold: /\bgold\b/i,
  bombs: /\bbomb/i, clones: /\bclone/i, recruits: /\brecruit/i, tribes: /\btribe|\bmech/i, bigcost: /\bbig\b/i, showdown: /\bshowdown/i };
export function headingSubKeys(label) {
  const t = String(label || "").replace(/-/g, " ").replace(new RegExp(`\\b(${MAINS.join("|")})\\b`, "gi"), " ");
  const eng = docEngineKeys(t).filter((k) => k !== "none" && k !== "ready");
  return [...new Set([...eng, ...Object.keys(HEADING_WORDS).filter((k) => HEADING_WORDS[k].test(t))])];
}
