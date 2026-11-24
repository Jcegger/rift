// Card text → a small effect language, for every card in the pool. `rift cards --coverage`.
//
// Riftbound's templating is regular: an optional trigger ("When you play me,"), an optional
// condition ("if you control 3 or more other gear,"), then effects, each an op with a target,
// an amount and a duration ("give enemy units -3 Might this turn, to a minimum of 1 Might").
// This reads those pieces and combines them, so one grammar covers wordings no single card
// pattern would. Cards it can't parse get a hand-written entry in lib/cardtext-overrides.mjs,
// in the same language.
//
// Every sentence of a card ends in one of three states:
//   read     compiled to effects (whether the turn engine plays each op is ENGINE_OPS below);
//   noTurn   classified as having no effect on this turn's points, with a reason ("draw":
//            the drawn card is unknown; "later": next turn's resources; "theirTurn": only on
//            the opponent's turn; "reminder": rules reminder text);
//   unread   nothing matched; listed by `rift cards --coverage`.
//
// The language (one ability):
//   { trigger, cond, cost, effects: [{ op, target, n, until, ... }], text }
// trigger: play | playFaceDown | attack | defend | attackOrDefend | move | conquer | hold | die |
//   exhausted | readied | youPlayCard | youPlaySpell | youPlayFirst | oppPlaysUnit | enemyDies |
//   friendlyDies | conquerHere | holdHere | startTurn | endTurn | static | activated | spell |
//   whenTakesDamage | other
// target: { who: me | it | unit | units | each | upTo, side: enemy | friendly | any, where:
//   here | bf | base | any, max: N (Might), other: bool, attacking: bool, choose: bool }

import { OVERRIDES } from "./cardtext-overrides.mjs";

// ── normalising ──
// Symbols: Might → M, Energy → [eN], a rune → {Fury}, any rune → {A}, exhaust → {T}.
export function normalise(x) {
  return String(x || "")
    .replace(/:rb_might:|\bMights?\b/g, "M")
    .replace(/:rb_energy_(\d+):/g, "[e$1]")
    .replace(/:rb_rune_rainbow:/g, "{A}")
    .replace(/:rb_rune_(\w+):/g, (_, d) => `{${d[0].toUpperCase()}${d.slice(1)}}`)
    .replace(/:rb_exhaust:/g, "{T}")
    .replace(/ /g, " ");
}
const REMINDER = /\s*\((?:[^()]|\([^()]*\))*\)/g;
// A card's text as sentences, reminder text removed (kept apart: a line that is only reminder
// text is "reminder", unless it states an effect the card relies on, like "(I enter exhausted.)").
export function sentencesOf(card) {
  const x = normalise(card.x);
  const out = [];
  for (const rawLine of x.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const bare = line.replace(REMINDER, "").trim();
    if (!bare) { out.push({ text: line, reminderOnly: true }); continue; }
    // "choose one —" modes run together without a space ("exhausted.)Pay"): split them back out.
    const fixed = bare.replace(/([.)])(?=[A-Z])/g, "$1 ");
    // Sentences, but keep an ability's cost and effect together ("{T}: [Add] {A}.").
    for (const s of fixed.split(/(?<=\.)\s+(?=[A-Z[{])/)) if (s.trim()) out.push({ text: s.trim() });
  }
  return out;
}

// ── keywords ──
// Every bracketed keyword in the pool, and how the turn engine treats it. "rule" is the
// docs/rules.md Keywords entry it rests on.
export const KEYWORDS = {
  Reaction: "timing", Action: "timing", Hidden: "hide", Ambush: "ambush", Accelerate: "enterReady",
  Deflect: "deflect", Assault: "assault", Shield: "shield", Tank: "tank", Backline: "backline",
  Ganking: "ganking", Equip: "equip", "Quick-Draw": "quickDraw", Deploy: "deploy", Temporary: "temporary",
  Repeat: "repeat", Stun: "op", Add: "op", Buff: "op", Empower: "empower", Empowered: "cond", Deathknell: "trigger",
  Legion: "cond", Level: "cond", Mighty: "cond", Disarm: "disarm", Burn: "op", "Show Off": "showOff",
  Flow: "flow", Predict: "op", Hunt: "op", Vision: "op", Weaponmaster: "weaponmaster", Unique: "deckbuilding",
};

// ── targets ──
const NUM = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5 };
const num = (w) => (w == null ? null : /^\d+$/.test(w) ? Number(w) : NUM[String(w).toLowerCase()] ?? null);
export function parseTarget(t) {
  const s = t.trim().replace(/\.$/, "");
  const o = { side: "any", where: "any", choose: true };
  if (/^(me|myself)$/i.test(s)) return { who: "me", choose: false };
  if (/^(it|that unit|them|this|that card|that gear|the friendly unit|the enemy unit|the chosen units?|those units|each of them|both|that enemy unit|that friendly unit|the unit)$/i.test(s)) return { who: "it", choose: false };
  if (/^(your units|your other units|other friendly units|friendly units here|your units here)$/i.test(s)) return { who: "each", side: "friendly", other: /other/i.test(s), where: /here/i.test(s) ? "here" : "any", choose: false };
  let m;
  if ((m = /^up to (\w+) of them$/i.exec(s))) return { who: "it", n: num(m[1]), choose: true };
  if ((m = /^(?:each of )?up to (\w+) (.*)$/i.exec(s))) { const inner = parseTarget(`a ${m[2].replace(/units/, "unit")}`); return inner && { ...inner, who: "upTo", n: num(m[1]) }; }
  if ((m = /^(all|each) (.*)$/i.exec(s)) || /^(enemy|friendly|other friendly|other) units\b/i.test(s) || /^units\b/i.test(s)) {
    const rest = m ? m[2] : s;
    const inner = parseTarget(`a ${rest.replace(/units/, "unit")}`);
    return inner && { ...inner, who: "each", choose: false };
  }
  if (!(m = /^(a|an|another|one|two|three|any|the) (.*)$/i.exec(s))) return null;
  if (/^another$/i.test(m[1])) o.other = true;
  let r = m[2];
  const take = (re, f) => { const x = re.exec(r); if (x) { f(x); r = r.replace(re, " ").replace(/\s+/g, " ").trim(); } return !!x; };
  take(/\bother\b/i, () => { o.other = true; });
  take(/\b(enemy|opposing)\b/i, () => { o.side = "enemy"; });
  take(/\bfriendly\b/i, () => { o.side = "friendly"; });
  take(/\battacking\b/i, () => { o.attacking = true; });
  take(/\bdefending\b/i, () => { o.defending = true; });
  take(/\bstunned\b/i, () => { o.stunned = true; });
  take(/\b(?:that )?you control\b/i, () => { o.side = "friendly"; });
  take(/\b(?:here|there)\b/i, () => { o.where = "here"; });
  take(/\bwithout \[(\w+)\]/i, (x) => { o.without = x[1]; });
  take(/\bat a battlefield\b/i, () => { o.where = "bf"; });
  take(/\b(?:in|at) (?:your |a |its )?base\b/i, () => { o.where = "base"; });
  take(/\bat battlefields\b/i, () => { o.where = "bf"; });
  take(/\bat each location\b/i, () => { o.eachLocation = true; });
  take(/\bat (?:the same|that) (?:location|battlefield)\b/i, () => { o.sameLoc = true; });
  take(/\bat another location\b/i, () => { o.where = "elsewhere"; });
  take(/\bat a different location\b/i, () => { o.where = "elsewhere"; });
  take(/\bin combat\b/i, () => { o.inCombat = true; });
  take(/\bwith (\d+) M or less\b/i, (x) => { o.max = Number(x[1]); });
  take(/\bwith (\d+) M or more\b/i, (x) => { o.min = Number(x[1]); });
  take(/\bwith less M than me\b/i, () => { o.lessThanMe = true; });
  if (/^(unit|units)$/i.test(r)) return { ...o, who: "unit", kind: "unit" };
  // A tag ("another friendly Mech", "a Dragon"): a unit carrying it (card.g; a token's name is its tag).
  if (/^[A-Z][a-z'-]+$/.test(r) && !/^(Gear|Spell|Rune|Runes|Battlefield|Legend|Champion|Gold|Bomb|Equipment|Card|Token)$/.test(r)) return { ...o, who: "unit", kind: "unit", tag: r.replace(/s$/, "") };
  if (/^(gear)$/i.test(r)) return { ...o, who: "unit", kind: "gear" };
  if (/^(unit or gear|gear or unit)$/i.test(r)) return { ...o, who: "unit", kind: "permanent" };
  if (/^(spell)$/i.test(r)) return { ...o, who: "unit", kind: "spell" };
  if (/^(rune|runes)$/i.test(r)) return { ...o, who: "unit", kind: "rune" };
  return null;
}

// ── effects ──
// One clause → one effect, or null. Clauses come from splitting a sentence on ". ", ", then ",
// " and " (where both halves are effects).
const UNTIL = (s) => (/this turn/i.test(s) ? "turn" : /this combat/i.test(s) ? "combat" : "lasting");
const NO_TURN = [
  // card flow: the cards involved are unknown, so this turn's search can't use them
  [/^(?:you may )?draw (\d+|a card|cards)/i, "draw"], [/^(?:you may )?discard (\d+|a card)/i, "draw"],
  [/^(?:then )?draw (\d+)/i, "draw"], [/^its controller draws/i, "draw"], [/^they draw/i, "draw"],
  [/^look at the top/i, "draw"], [/^reveal the top/i, "draw"], [/^you may reveal/i, "draw"], [/^recycle the rest/i, "draw"],
  [/^put the rest/i, "draw"], [/^you and that player each draw/i, "draw"], [/^recycle (?:it|that card|this|them|me|\d+ cards?|a card)/i, "draw"], [/^\[predict\]/i, "draw"],
  [/^\[vision\]/i, "draw"], [/^choose an opponent\.? they reveal their hand/i, "draw"], [/^they reveal their hand/i, "draw"],
  [/^you can look at their facedown/i, "draw"], [/^choose an opponent$/i, "draw"], [/^shuffle/i, "draw"],
  // resources that arrive exhausted or later (§415.4)
  [/^play (?:a|\w+) gold gear tokens? exhausted/i, "later"],
  // Bomb tokens made at end of turn (Hexplosive Minefield) are next turn's. Bombs played now are the "bomb" op below.
  [/^play that many bomb (?:gear )?tokens?\b/i, "later"], [/^channel (\d+|a) runes? exhausted/i, "later"],
  [/^take a turn after this one/i, "later"], [/^banish this$/i, "later"],
  // cards the solver can't see: the trash, the top of the deck, "from among them"
  [/from (?:your|any|their|a player's) trash|in (?:your|their) trash|from among them|top card of your main deck|top (?:\d+ )?cards? of (?:your|their) main deck|^\[burn \d+\]|^they \[burn|until your next ending phase|^put \d+ into your hand|^draw any you didn't|^shuffle|^reveal cards from the top/i, "unknownCards"],
];
export function parseEffect(clause) {
  let s = clause.trim().replace(/\.$/, "").replace(/^then,? /i, "").replace(/^and /i, "").replace(/ instead$/i, "");
  for (const [re, why] of NO_TURN) if (re.test(s)) return { op: "noTurn", why, text: s };
  let m;
  const T = (t) => parseTarget(t);
  const opt = /^you may /i.test(s); s = s.replace(/^you may /i, "");
  const E = (o) => ({ ...o, ...(opt ? { optional: true } : {}) });
  if ((m = /^deal (\d+) (?:damage )?to (.+?)(?:\s+this turn)?$/i.exec(s)) && T(m[2])) return E({ op: "damage", n: Number(m[1]), target: T(m[2]) });
  if ((m = /^deal (\d+) (?:damage )?split among (.+)$/i.exec(s))) return E({ op: "damage", n: Number(m[1]), split: true, target: T(m[2]) || { who: "each", side: "any" } });
  if ((m = /^deal damage equal to my M to (.+)$/i.exec(s)) && T(m[1])) return E({ op: "damage", n: "myMight", target: T(m[1]) });
  if ((m = /^deal damage equal to (?:its|their) M to (.+)$/i.exec(s)) && T(m[1])) return E({ op: "damage", n: "itsMight", target: T(m[1]) });
  if (/^they deal damage equal to their M to each other/i.test(s)) return E({ op: "fight" });
  if ((m = /^give (.+?) ([+-]\d+) M( this turn)? and (.+?) ([+-]\d+) M( this turn)?$/i.exec(s)) && T(m[1]) && T(m[4])) return E({ op: "swing", a: { target: T(m[1]), n: Number(m[2]) }, b: { target: T(m[4]), n: Number(m[5]) }, until: m[3] || m[6] ? "turn" : "lasting" });
  if ((m = /^give (.+?) \+M equal to (?:its|my) M( this turn)?$/i.exec(s)) && T(m[1])) return E({ op: "might", n: "itsMight", target: T(m[1]), until: m[2] ? "turn" : "lasting" });
  if ((m = /^give (.+?) ([+-])(\d+) M(?: and \[(\w[\w ]*?)(?: (\d+))?\])?( this turn| this combat)?(?:, to a minimum of (\d+) M)?$/i.exec(s)) && T(m[1])) {
    const n = Number(m[3]) * (m[2] === "-" ? -1 : 1);
    return E({ op: "might", n, target: T(m[1]), until: m[6] ? UNTIL(m[6]) : "lasting", floor: m[7] ? Number(m[7]) : null, ...(m[4] ? { keyword: m[4], kn: m[5] ? Number(m[5]) : 1 } : {}) });
  }
  if ((m = /^give (.+?) \[(\w[\w -]*?)(?: (\d+))?\]( this turn| this combat)?$/i.exec(s)) && T(m[1])) return E({ op: "keyword", keyword: m[2], n: m[3] ? Number(m[3]) : 1, target: T(m[1]), until: m[4] ? UNTIL(m[4]) : "lasting" });
  if ((m = /^\[?buff\]? (.+)$/i.exec(s)) && T(m[1])) return E({ op: "buff", target: T(m[1]) });
  if ((m = /^choose (.+?)(?: and (.+))?$/i.exec(s)) && T(m[1]) && (!m[2] || T(m[2]))) return E({ op: "choose", target: T(m[1]), target2: m[2] ? T(m[2]) : null });
  if (/^choose a battlefield(?: where you have units)?$/i.test(s)) return E({ op: "chooseBf", mine: /where you have units/i.test(s) });
  if (/^choose a non-unit card from it, and recycle that card$/i.test(s)) return E({ op: "strip" });
  if ((m = /^the next card you play this turn costs ((?:\[e\d+\]|\{\w+\})+) less$/i.exec(s))) return E({ op: "discountNext", cost: m[1] });
  if ((m = /^spend (?:my|a|its) buff to (.+)$/i.exec(s)) && parseEffect(m[1])) return E({ ...parseEffect(m[1]), spendBuff: true });
  if ((m = /^pay ((?:\{\w+\}|\[e\d+\])+) to (.+)$/i.exec(s)) && parseEffect(m[2])) return E({ ...parseEffect(m[2]), pay: m[1] });
  if ((m = /^(?:its controller|its owner|they) (?:plays?|channels?) .*(?:gold gear token|runes?) exhausted$/i.exec(s))) return { op: "noTurn", why: "later", text: s };
  if ((m = /^\[?stun\]? (.+)$/i.exec(s)) && T(m[1])) return E({ op: "stun", target: T(m[1]) });
  // Points from an effect (§473.1.a.1: not bound by the Final Point rule; the win is checked at cleanup, §194.2).
  if ((m = /^(?:you )?score (\d+) points?$/i.exec(s))) return E({ op: "score", n: Number(m[1]) });
  if ((m = /^kill (.+)$/i.exec(s)) && T(m[1])) return E({ op: "kill", target: T(m[1]) });
  if ((m = /^banish (.+)$/i.exec(s)) && T(m[1]) && !/then its owner plays/i.test(s)) return E({ op: "banish", target: T(m[1]) });
  if ((m = /^return (.+?) to (?:its|their) owners?'?s?'? hands?$/i.exec(s)) && T(m[1])) return E({ op: "bounce", target: T(m[1]) });
  if ((m = /^return (.+?) and (.+?) to their owners' hands$/i.exec(s)) && T(m[1]) && T(m[2])) return E({ op: "bounce2", target: T(m[1]), target2: T(m[2]) });
  if ((m = /^return me to my owner's hand$/i.exec(s))) return E({ op: "bounce", target: { who: "me", choose: false } });
  if ((m = /^recall (.+)$/i.exec(s)) && T(m[1])) return E({ op: "recall", target: T(m[1]) });
  if ((m = /^ready (.+)$/i.exec(s)) && T(m[1].replace(/^your units$/i, "friendly units"))) return E({ op: "ready", target: T(m[1].replace(/^your units$/i, "friendly units")) });
  if ((m = /^ready (up to )?(\d+|a|one|two) runes?$/i.exec(s))) return E({ op: "readyRunes", n: num(m[2]) });
  if ((m = /^exhaust (.+)$/i.exec(s)) && T(m[1])) return E({ op: "exhaust", target: T(m[1]) });
  if ((m = /^heal (.+)$/i.exec(s)) && T(m[1])) return E({ op: "heal", target: T(m[1]) });
  if ((m = /^move (.+?)(?: to (base|here|my battlefield|that battlefield|your base|its base|a battlefield|its location|my location|the same location|a battlefield you control|an open battlefield|another battlefield))?( and ready it)?$/i.exec(s)) && T(m[1])) {
    return E({ op: "move", target: T(m[1]), to: m[2] ? m[2].toLowerCase() : "any", ready: !!m[3] });
  }
  if ((m = /^move me to (?:its|their) location and it to my original location$/i.exec(s))) return E({ op: "swapPlaces" });
  if (/^choose (?:a|another) unit you control at another location$/i.test(s)) return E({ op: "choose", target: { who: "unit", side: "friendly", where: "elsewhere", other: true } });
  if ((m = /^channel (\d+|a|one|two) runes?$/i.exec(s))) return E({ op: "channel", n: num(m[1]) });
  if ((m = /^\[add\] ((?:\{\w+\}|\[e\d+\])+)(.*)$/i.exec(s))) {
    const syms = [...m[1].matchAll(/\{(\w+)\}|\[e(\d+)\]/g)];
    return E({ op: "add", power: syms.filter((x) => x[1]).map((x) => x[1]), energy: syms.reduce((a, x) => a + (x[2] ? Number(x[2]) : 0), 0), spellsOnly: /only to play spells/i.test(m[2]) });
  }
  if ((m = /^play (a|an|one|two|three|four|five|\d+) (ready )?(\d+) M (\w+(?: \w+)?) unit tokens?(?: with ((?:\[[^\]]+\]\s*(?:and\s*)?)+))?(?: to (your base|here|that battlefield|my battlefield|a battlefield you control|its location))?(.*)$/i.exec(s))) {
    return E({ op: "token", count: num(m[1]), ready: !!m[2], might: Number(m[3]), name: m[4], keywords: m[5] ? [...m[5].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]) : [], to: (m[6] || "your base").toLowerCase() });
  }
  // A Bomb gear token (§187.12: [Deploy]; its Deathknell deals 2 to an enemy unit there and kills our other Bombs there).
  if ((m = /^play (a|an|one|two|three|four|\d+) bomb (?:gear )?tokens? to (?:a|a single) battlefield$/i.exec(s))) return E({ op: "bomb", count: num(m[1]) });
  // XP is a player resource (§728) that Level reads continuously (§824.1.b.1): gaining it can switch a Level ability on this turn.
  if ((m = /^(?:you )?gain (\d+) xp$/i.exec(s))) return E({ op: "xp", n: Number(m[1]) });
  if ((m = /^(?:you )?gain (\d+) xp for each friendly unit$/i.exec(s))) return E({ op: "xp", n: Number(m[1]), perFriendlyUnit: true });
  if ((m = /^counter (.+)$/i.exec(s))) {
    const k = /costs no more than \[e(\d+)\] and no more than \{A\}/i.exec(s);
    return E({ op: "counter", maxE: k ? Number(k[1]) : null, maxP: k ? 1 : null, what: m[1] });
  }
  if ((m = /^\[?empower\]? (.+)$/i.exec(s)) && (T(m[1]) || /^something here$/i.test(m[1]))) return E({ op: "empower", target: T(m[1]) || { who: "unit", where: "here", side: "friendly" } });
  if (/^disempower it at end of turn$/i.test(s)) return E({ op: "noop", why: "expires" });
  if (/^attach (?:it|this) to (.+)$/i.test(s)) return E({ op: "attach" });
  if ((m = /^swap the M of two units(?: at the same battlefield)?(?: this turn)?$/i.exec(s))) return E({ op: "swap" });
  if (/^opponents can't play cards this turn$/i.test(s)) return E({ op: "lock" });
  if ((m = /^(?:they|its controller) can't move (it|them) this turn$/i.exec(s)) || (m = /^(it|they) can't move this turn$/i.exec(s))) return E({ op: "noMove", target: { who: "it", choose: false }, until: "turn" });
  if ((m = /^its base M becomes (\d+)( this turn)?$/i.exec(s))) return E({ op: "baseMight", n: Number(m[1]), until: m[2] ? "turn" : "lasting", target: { who: "it", choose: false } });
  if ((m = /^give \+M equal to its M to (.+?)( this turn)?$/i.exec(s)) && T(m[1])) return E({ op: "might", n: "refMight", target: T(m[1]), until: m[2] ? "turn" : "lasting" });
  if ((m = /^move any number of (.+?) to (their base|base|here|that battlefield)$/i.exec(s)) && T(`a ${m[1].replace(/units/, "unit")}`)) return E({ op: "move", target: { ...T(`a ${m[1].replace(/units/, "unit")}`), who: "upTo", n: 9 }, to: m[2].toLowerCase() });
  if ((m = /^banish (.+?), then its owner plays it to (the same location|any battlefield|its base)(?:, ignoring its cost)?$/i.exec(s)) && T(m[1])) return E({ op: "redeploy", target: T(m[1]), to: m[2].toLowerCase() });
  if ((m = /^prevent the next (\d+) damage that would be dealt to (it|me|a friendly unit) this turn$/i.exec(s))) return E({ op: "prevent", n: Number(m[1]), target: T(m[2]) || { who: "it" } });
  if ((m = /^(.+?) can't be chosen by enemy spells(?: and abilities)?( this turn)?$/i.exec(s)) && T(m[1])) return E({ op: "protect", target: T(m[1]), until: m[2] ? "turn" : "lasting" });
  if ((m = /^give (.+?) ((?:\[[^\]]+\](?:,? (?:and )?)?){2,})( this turn)?$/i.exec(s)) && T(m[1])) return E({ op: "keyword", keywords: [...m[2].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), target: T(m[1]), until: m[3] ? "turn" : "lasting" });
  if ((m = /^give (up to \w+ units) each ([+-]\d+) M( this turn)?$/i.exec(s)) && T(m[1])) return E({ op: "might", n: Number(m[2]), target: T(m[1]), until: m[3] ? "turn" : "lasting" });
  if (/^choose a player$/i.test(s)) return E({ op: "choose", target: { who: "player" } });
  if (/^they discard \d+$/i.test(s)) return { op: "noTurn", why: "draw", text: s };
  if ((m = /^each player kills one of their units$/i.exec(s))) return E({ op: "edict" });
  if ((m = /^\[burn (\d+)\]$/i.exec(s))) return E({ op: "noTurn", why: "draw", text: s });
  if ((m = /^\[hunt (\d+)\]$/i.exec(s))) return E({ op: "noTurn", why: "later", text: s });
  return null;
}

// ── triggers and conditions ──
const TRIGGERS = [
  // 23 Nov, batch 6
  [/^the first time i win a combat each turn,\s*/i, () => "winCombat"], [/^when i die in combat,\s*/i, () => "dieInCombat"], [/^when i conquer or hold,\s*/i, () => "conquerOrHold"],
  [/^when i'm played and when i conquer,\s*/i, () => "playAndConquer"], [/^when i move from a location,\s*/i, () => "moveFrom"],
  [/^the first time i move each turn,\s*/i, () => "firstMove"], [/^the second time i move each turn,\s*/i, () => "secondMove"],
  [/^when another non-recruit unit you control dies,\s*/i, () => "friendlyDies"], [/^when you play another unit,\s*/i, () => "youPlayOtherUnit"],
  [/^when another friendly unit becomes exhausted,\s*/i, () => "allyExhausted"], [/^when you stun an enemy unit(?: at a battlefield)?,\s*/i, () => "youStun"],
  [/^when you play (?:me|this)(?: from face down)?(?: on your turn)?(?: to a battlefield)?(?: or when you conquer here)?,\s*/i, (m) => (/face down/i.test(m[0]) ? "playFaceDown" : "play")],
  [/^when you play me or (?:when )?i attack,\s*/i, () => "playOrAttack"],
  [/^when you play a gear,\s*/i, () => "youPlayGear"], [/^when you play your second card in a turn,\s*/i, () => "youPlaySecond"], [/^when it dies this turn,\s*/i, () => "itDies"], [/^when you win a combat here,\s*/i, () => "winCombatHere"],
  [/^the first time i conquer each turn,\s*/i, () => "conquer"], [/^when you choose or ready me,\s*/i, () => "readied"],
  [/^when you play or move this,\s*/i, () => "play"], [/^when i'm played,\s*/i, () => "play"], [/^when i take damage,\s*/i, () => "takeDamage"],
  [/^when (?:you|a friendly unit) (?:attacks?|defends?)[^,]*,\s*/i, () => "allyFights"], [/^when this leaves the board,\s*/i, () => "leaves"],
  [/^when a combat that i was in ends,\s*/i, () => "combatEnds"], [/^when i become \[empowered\],\s*/i, () => "empowered"],
  [/^when i attack or defend(?: alone)?,\s*/i, () => "attackOrDefend"], [/^when i attack,\s*/i, () => "attack"], [/^when i defend,\s*/i, () => "defend"],
  [/^when i move(?: to a battlefield)?,\s*/i, () => "move"], [/^when i conquer(?: after an attack)?,\s*/i, () => "conquer"], [/^when i hold,\s*/i, () => "hold"],
  [/^when i win a combat,\s*/i, () => "winCombat"], [/^when i die,\s*/i, () => "die"], [/^\[deathknell\]\s*(?:—|\[>\])\s*/i, () => "die"],
  [/^when i become exhausted,\s*/i, () => "exhausted"], [/^when i become ready,\s*/i, () => "readied"],
  [/^when you play your first card each turn,\s*/i, () => "youPlayFirst"], [/^when you play a spell,\s*/i, () => "youPlaySpell"],
  [/^when you play a (?:card|unit)(?: from face down)?,\s*/i, () => "youPlayCard"], [/^when you play a card from \[hidden\],\s*/i, () => "youPlayFaceDown"],
  [/^when an opponent plays a unit(?= while| ?,)\s*,?\s*/i, () => "oppPlaysUnit"],
  [/^(?:once each turn, )?when an enemy unit dies(?= while| ?,)\s*,?\s*/i, () => "enemyDies"],
  [/^when (?:a|another) friendly unit dies,\s*/i, () => "friendlyDies"], [/^when (?:one or more )?enemy units die,\s*/i, () => "enemyDies"],
  [/^when you conquer(?: here)?,\s*/i, () => "conquerHere"], [/^when you hold(?: here)?,\s*/i, () => "holdHere"],
  [/^when an opponent (?:holds|conquers) here,\s*/i, () => "theirs"],
  [/^at the start of your (?:turn|beginning phase),\s*/i, () => "startTurn"], [/^at (?:the )?end of (?:your |the )?turn,\s*/i, () => "endTurn"],
  [/^when any unit takes damage this turn,\s*/i, () => "whenTakesDamage"], [/^when a friendly unit attacks or defends alone,\s*/i, () => "allyAlone"],
  [/^when you recycle a rune,\s*/i, () => "recycle"], [/^when you \[stun\] an enemy unit(?: at a battlefield)?,\s*/i, () => "youStun"],
  [/^when (?:a|an|another) (?:friendly )?unit (?:moves|is played)[^,]*,\s*/i, () => "other"],
];
const CONDS = [
  /^if you've spent at least [^,]+ this turn,\s*/i, /^if you control [^,]+,\s*/i, /^if you paid the additional cost,\s*/i,
  /^if i'm at a battlefield,\s*/i, /^if it's not your turn,\s*/i, /^if you showed off(?: a card)?,\s*/i, /^if you played this from your hand,\s*/i,
  /^if (?:i|it|you) [^,]+,\s*/i, /^\[legion\]\s*(?:—|\[>\])\s*/i, /^\[empowered\]\s*\[>\]\s*\[>>\]\s*/i, /^\[empowered\]\s*\[>\]\s*/i, /^\[level \d+\]\s*\[>\]\s*/i, /^\[mighty\]\s*\[>\]\s*/i,
  /^\[empowered\]\s*\[>\]\s*\[>>\]\s*/i, /^while i'm [^,]+,\s*/i, /^while i'm at a battlefield,\s*/i, /^once each turn,\s*/i, /^then do this:\s*/i, /^then,? do the following[^:]*:\s*/i, /^if you do,\s*/i, /^do this:\s*/i, /^if (?:there are|it has|it is|you have|it was|that unit) [^,]+,\s*/i, /^otherwise,\s*/i, /^if an? [^,]+,\s*/i, /^if [^,]{3,80},\s*/i,
];

// One sentence → an ability (or a static, a cost, a keyword line), or null.
export function parseSentence(text) {
  let s = text.trim();
  // Lines that are only keywords (with costs): "[Hidden]", "[Assault 2]", "[Repeat] [e1]{Mind}", "[Equip] {Chaos}".
  if (/^(?:\[[^\]]+\](?:\s*(?:—\s*)?(?:\{\w+\}|\[e\d+\])+(?:,\s*(?:\{\w+\}|\[e\d+\])+)*(?: or [^.]+)?)?,?\s*)+\.?$/.test(s)) return { kind: "keywords", text };
  if (/^equip (?:\[e\d+\]|\{\w+\})+\.?$/i.test(s)) return { kind: "keywords", text };
  if (/^(?:hidden|action|reaction)\.?$/i.test(s)) return { kind: "keywords", text };
  if (/^\[flow\]/i.test(s)) return { kind: "noTurn", why: "unknownCards", text };   // played from the trash, which the solver can't see
  // Activated: "COST: [Reaction] — EFFECT" / "{T}: [Add] {A}" / "Kill this, {T}: …".
  let m;
  s = s.replace(/^\[(reaction|action)\]\s*\[>\]\s*(?=(?:\[e\d+\]|\{\w+\}|kill this))/i, "");
  // Modes and type branches: "Spell — Draw 1." / "Unit — Give me +3 M this turn."
  if ((m = /^(spell|gear|unit|rune)\s*—\s*(.+)$/i.exec(s)) && effectsOfClause(m[2])) return { kind: "ability", trigger: "mode", mode: m[1], effects: effectsOfClause(m[2]), text };
  if ((m = /^((?:\[e\d+\]|\{\w+\}|kill this|exhaust me|recycle [^:]+|discard \d+|spend \d+ xp|, ?|\s)+):\s*(?:\[(reaction|action)\]\s*—\s*)?(.+)$/i.exec(s))) {
    const eff = effectsOfClause(m[3]);
    return eff && { kind: "ability", trigger: "activated", cost: m[1].trim(), speed: m[2] ? m[2].toLowerCase() : "main", effects: eff, text };
  }
  // Additional costs and show-offs: read with the card's play.
  if (/^(?:as an additional cost to play (?:this|me), |you may [^.]* as an additional cost to play (?:this|me)|as you play (?:this|me), you may (?:pay|spend|kill|exhaust|discard))/i.test(s)) return { kind: "cost", optional: !/^as an additional cost/i.test(s), text };
  if (/^\[show off\]/i.test(s)) return { kind: "cost", optional: true, showOff: true, text };
  if ((m = /^this costs \[e(\d+)\] less if (.+)$/i.exec(s))) return { kind: "static", op: "costLess", n: Number(m[1]), cond: m[2], text };
  // Statics about me.
  if ((m = /^i have \+(\d+) M for each (.+?)\.?$/i.exec(s))) return { kind: "static", op: "myMight", n: Number(m[1]), per: m[2], text };
  if ((m = /^i have \+(\d+) M and ((?:\[[^\]]+\](?:,? (?:and )?)?)+)\.?$/i.exec(s))) return { kind: "static", op: "myMight", n: Number(m[1]), keywords: [...m[2].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), text };
  if ((m = /^i have ((?:\[[^\]]+\](?:,? (?:and )?)?)+) while (.+?)\.?$/i.exec(s))) return { kind: "static", op: "myKeywords", keywords: [...m[1].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), cond: m[2], text };
  if ((m = /^(?:this|i) costs? ((?:\[e\d+\]|\{\w+\})+) less(?: instead)?\.?$/i.exec(s))) return { kind: "static", op: "costLess", cost: m[1], text };
  if ((m = /^your spells(?: and abilities)? cost ((?:\[e\d+\]|\{\w+\})+) less/i.exec(s))) return { kind: "static", op: "spellsCostLess", cost: m[1], text };
  if ((m = /^your (\w+?)s have \+(\d+) M/i.exec(s))) return { kind: "static", op: "aura", n: Number(m[2]), tag: m[1], text };
  if ((m = /^your (\w+?)s (?:each )?have ((?:\[[^\]]+\](?:,? (?:and )?)?)+)\.?$/i.exec(s))) return { kind: "static", op: "auraKeyword", tag: m[1], keywords: [...m[2].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), text };
  if ((m = /^(?:while [^,]+, )?i have \+(\d+) M(?: and \[(\w+)\])?\.?$/i.exec(s))) return { kind: "static", op: "myMight", n: Number(m[1]), keyword: m[2] || null, cond: /^while/i.test(s) ? s.split(",")[0] : null, text };
  if ((m = /^if you've spent at least ((?:\{\w+\})+) this turn, i have \+(\d+) M and \[(\w+)\]\.?$/i.exec(s))) return { kind: "static", op: "myMight", n: Number(m[2]), keyword: m[3], cond: { spentPower: m[1].match(/\{/g).length }, text };
  if ((m = /^other friendly units(?: here)? have \+(\d+) M\.?$/i.exec(s))) return { kind: "static", op: "aura", n: Number(m[1]), here: /here/.test(s), text };
  if ((m = /^i cost \[e(\d+)\] less(?: for each ([^.]+))?\.?$/i.exec(s))) return { kind: "static", op: "costLess", n: Number(m[1]), per: m[2] || null, text };
  if (/^i (?:can't be chosen by enemy spells|enter exhausted|enter ready)/i.test(s)) return { kind: "static", op: /exhausted/.test(s) ? "enterExhausted" : /ready/.test(s) ? "enterReady" : "untargetable", text };
  if (/^i don'?t deal combat damage\.?$/i.test(s)) return { kind: "static", op: "noCombat", text };
  if (/^i don'?t deal combat damage unless/i.test(s)) return { kind: "static", op: "noCombat", cond: s, text };
  if ((m = /^(?:other )?friendly units(?: here)? have ((?:\[[^\]]+\](?:,? (?:and )?)?)+)\.?$/i.exec(s))) return { kind: "static", op: "auraKeyword", keywords: [...m[1].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), here: /here/.test(s), other: /^other/i.test(s), text };
  if ((m = /^i have ((?:\[[^\]]+\](?:,? (?:and )?)?)+)\.?$/i.exec(s))) return { kind: "static", op: "myKeywords", keywords: [...m[1].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]), text };
  if (/^this enters exhausted\.?$/i.test(s)) return { kind: "static", op: "enterExhausted", text };
  if (/^your deck can have any number/i.test(s)) return { kind: "noTurn", why: "deckbuilding", text };
  if (/^i can be played to a battlefield you're attacking\.?$/i.test(s) || /^i can \[ambush\] to a battlefield where there are enemy units/i.test(s)) return { kind: "static", op: "ambushAnywhere", text };
  if (/^units with 0 M can conquer and hold/i.test(s)) return { kind: "noTurn", why: "reminder", text };
  if (/^you may play me to an open battlefield\.?$/i.test(s)) return { kind: "static", op: "playToOpen", text };
  if (/^optional additional costs you pay cost \[e1\] or \{A\} less\.?$/i.test(s)) return { kind: "static", op: "extraCostLess", text };
  // Spell-play choices: "As you play this, you may pay X as an additional cost."
  if (/^as you play (?:this|me), you may pay .* as an additional cost\.?$/i.test(s) || /^you may pay .* as an additional cost to play me\.?$/i.test(s)) return { kind: "cost", optional: true, text };
  // Triggers and conditions, then the effects.
  let trigger = null, cond = null;
  // Conditions and triggers in any order: "[Empowered][>] When I conquer, …", "When you play me, if …, …".
  for (let guard = 0; guard < 5; guard++) {
    const c = CONDS.find((re) => re.test(s));
    if (c) { const x = c.exec(s); cond = [cond, x[0].replace(/,\s*$/, "")].filter(Boolean).join("; "); s = s.slice(x[0].length); continue; }
    if (trigger) break;
    // "When you play me or when I hold," / "When you play me or another Dragon," → play (plus another occasion).
    const combo = /^when you play (?:me|this) or (?:when |at |the first time )?[^,]+,\s*/i.exec(s);
    if (combo && !/^when you play me or (?:when )?i attack,/i.test(s)) { trigger = "play"; s = s.slice(combo[0].length); continue; }
    let hit = false;
    for (const [re, f] of TRIGGERS) { const x = re.exec(s); if (x) { trigger = f(x); s = s.slice(x[0].length); hit = true; break; } }
    // A trigger the table doesn't know: the effect is still read, and "unmodeled" keeps it out of what the solver plays.
    // If its effects are all no-effect-this-turn (draw, later), the sentence is filed that way whatever the trigger.
    if (!hit) { const u = /^(?:when(?:ever)?|the (?:first|next|second) time|at the (?:start|end) of)\b[^,]{3,120},\s*/i.exec(s); if (u && !/ —\s*$/.test(u[0])) { trigger = "unmodeled"; s = s.slice(u[0].length); hit = true; } }
    if (!hit) break;
  }
  if (cond || trigger) { const st = cond && !trigger ? parseSentence(s) : null; if (st && st.kind === "static") return { ...st, cond: [cond, st.cond].filter(Boolean).join("; "), text }; }
  if ((m = /^choose (one|two)(?: that hasn't been chosen this turn)? —\s*(.*)$/i.exec(s))) {
    const first = m[2] && effectsOfClause(m[2]);
    return { kind: "ability", trigger: trigger || "spell", cond, modal: true, pick: m[1].toLowerCase() === "two" ? 2 : 1, modes: first ? [{ effects: first, text: m[2] }] : [], effects: [], text };
  }
  if (/^do the following based on/i.test(s)) return { kind: "ability", trigger: trigger || "spell", cond, branch: true, modes: [], effects: [], text };
  const eff = effectsOfClause(s);
  if (!eff) return null;
  return { kind: "ability", trigger: trigger || "spell", cond, effects: eff, text };
}
// A clause list: "Deal 3 to a unit at a battlefield. Its controller draws 2." / "discard 1, then draw 1".
function effectsOfClause(s) {
  const whole = parseEffect(s.replace(/\.$/, ""));
  if (whole && (/, then its owner plays it/i.test(s) || /, and recycle that card/i.test(s) || !/[.,]/.test(s.replace(/\.$/, "")))) return [whole];
  const parts = s.replace(/\.$/, "").split(/,? then |\. |, and (?=[a-z])/i).map((x) => x.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    let e = parseEffect(p);
    if (!e && / and /.test(p)) { const [a, b] = p.split(/ and (?=(?:give|deal|draw|ready|play|kill|return|move|\[stun\]|stun|exhaust|channel|buff|gain|\[buff\]))/i); const ea = a && parseEffect(a), eb = b && parseEffect(b); if (ea && eb) { out.push(ea, eb); continue; } }
    if (!e) return null;
    out.push(e);
  }
  return out;
}

// ── a card ──
// { abilities, statics, keywords, sentences: [{ text, state: read|noTurn|unread, why? }] }
// Cached by name and text: the solver copies cards per unit, and every copy reads the same.
const cache = new Map();
export function compile(card) {
  if (!card) return null;
  const key = `${card.n}\u0000${card.x || ""}`;
  if (cache.has(key)) return cache.get(key);
  const over = OVERRIDES[card.n];
  const keywords = {};
  for (const m of normalise(card.x).replace(REMINDER, "").matchAll(/\[([A-Z][A-Za-z' -]+?)(?: (\d+))?\]/g)) if (KEYWORDS[m[1]]) keywords[m[1]] = m[2] ? Number(m[2]) : (keywords[m[1]] || 1);
  const out = { name: card.n, keywords, abilities: [], statics: [], sentences: [] };
  for (const s of sentencesOf(card)) {
    if (s.reminderOnly) {
      if (/I enter exhausted/i.test(s.text)) { out.statics.push({ op: "enterExhausted", text: s.text }); out.sentences.push({ text: s.text, state: "read" }); }
      else out.sentences.push({ text: s.text, state: "noTurn", why: "reminder" });
      continue;
    }
    const o = over?.[s.text];
    const p = o !== undefined ? (o && o.kind !== "noTurn" ? { ...o, text: s.text } : o) : parseSentence(s.text);
    if (!p) { out.sentences.push({ text: s.text, state: "unread" }); continue; }
    if (p.kind === "keywords") {
      // "[Empower] — [e1], {T}" / "[Empower] {Chaos}{Chaos}": an activated ability that empowers me.
      const em = /^\[empower\]\s*(?:—\s*)?((?:\[e\d+\]|\{\w+\}|,|\s)+)/i.exec(s.text);
      if (em) out.abilities.push({ kind: "ability", trigger: "activated", cost: em[1].trim(), speed: "main", effects: [{ op: "empower", target: { who: "me", choose: false } }], text: s.text });
      const rp = /\[repeat\]\s*((?:\[e\d+\]|\{\w+\})+)/i.exec(s.text);
      if (rp) out.repeat = rp[1];
      out.sentences.push({ text: s.text, state: "read", keywords: true }); continue;
    }
    if (p.kind === "noTurn") { out.sentences.push({ text: s.text, state: "noTurn", why: p.why }); continue; }
    if (p.kind === "static") { out.statics.push(p); out.sentences.push({ text: s.text, state: "read" }); continue; }
    if (p.kind === "cost") { out.sentences.push({ text: s.text, state: "read", cost: true }); continue; }
    // An override that wrote this sentence into the ability before it (a spell's follow-on, which doesn't join on its own).
    if (p.kind === "folded") { out.sentences.push({ text: s.text, state: "read", continues: out.abilities[out.abilities.length - 1]?.text }); continue; }
    // A sentence with no trigger on a unit or gear continues the ability before it ("[Stun] it.
    // They can't move it this turn."): its effects join that ability.
    const prev = out.abilities[out.abilities.length - 1];
    // After "choose one —" (or a type branch, Hwei), the next lines are its modes, not more effects.
    if (prev && (prev.modal || prev.branch) && (p.trigger === "spell" || p.trigger === "mode") && !p.modal) {
      prev.modes = [...(prev.modes || []), { effects: p.effects || [], mode: p.mode || null, text: s.text }];
      const no3 = (p.effects || []).length && p.effects.every((e) => e.op === "noTurn" || e.op === "noop");
      out.sentences.push({ text: s.text, state: no3 ? "noTurn" : "read", why: no3 ? p.effects.find((e) => e.why)?.why : undefined, mode: true });
      continue;
    }
    // A follow-on sentence with its own condition ("If it is stunned, kill it." / "Otherwise, …" / "If X, … instead." /
    // "If you do, …") belongs to the ability before it: its effects join that ability with an effect-level condition, so
    // they see its "it", "there" and "if you do". The ability's own condition moves down onto its effects first, so an
    // "Otherwise" branch can run when it's false.
    if (p.kind === "ability" && p.trigger === "spell" && p.cond && prev && !prev.modal && !prev.branch && !p.modal && !p.branch && prev.trigger !== "mode") {
      const own = /^otherwise$/i.test(String(p.cond).trim()) ? (prev._lastCond ? `not(${prev._lastCond.split("; ").join("|")})` : p.cond) : p.cond;
      const instead = /\binstead\.?$/i.test(s.text);
      const both = (a, b) => [a, b].filter(Boolean).join("; ");
      let effs = (prev.effects || []).map((e) => ({ ...e, ...(prev.cond ? { cond: both(prev.cond, e.cond) } : {}) }));
      if (instead) { const last = new Set(prev._lastIdx || effs.map((_, i) => i)); effs = effs.map((e, i) => (last.has(i) ? { ...e, cond: both(e.cond, `not(${String(own).split("; ").join("|")})`) } : e)); }
      const add = (p.effects || []).map((e) => ({ ...e, cond: both(own, e.cond) }));
      Object.assign(prev, { effects: [...effs, ...add], cond: null, _lastCond: own, _lastIdx: add.map((_, i) => effs.length + i) });
      const no = add.length && add.every((e) => e.op === "noTurn" || e.op === "noop");
      out.sentences.push({ text: s.text, state: no ? "noTurn" : "read", why: no ? add.find((e) => e.why)?.why : undefined, continues: prev.text });
      continue;
    }
    if (p.trigger === "spell" && !/Spell/.test(card.t || "") && prev && !p.cond) {
      prev.effects = [...(prev.effects || []), ...(p.effects || [])];
      const effs2 = p.effects || [];
      const no2 = effs2.length && effs2.every((e) => e.op === "noTurn" || e.op === "noop");
      out.sentences.push({ text: s.text, state: no2 ? "noTurn" : "read", why: no2 ? effs2.find((e) => e.why)?.why : undefined, continues: prev.text });
      continue;
    }
    if (p.kind === "ability") { p._lastCond = p.cond || null; p._lastIdx = (p.effects || []).map((_, i) => i); }
    out.abilities.push(p);
    const effs = p.effects || [];
    const allNo = effs.length && effs.every((e) => e.op === "noTurn" || e.op === "noop");
    const theirs = p.trigger === "theirs";
    out.sentences.push({ text: s.text, state: allNo || theirs ? "noTurn" : "read", why: theirs ? "theirTurn" : allNo ? effs.find((e) => e.why)?.why : undefined });
  }
  // A modal "choose one —" line takes the next sentences as its modes.
  cache.set(key, out);
  return out;
}

// ── what the turn engine plays ──
// lib/turn.mjs's executor (and lib/fight.mjs inside combat). A card is fully read only when every
// sentence compiled AND each trigger, op, static, condition and keyword is one of these. Keep this
// in step with turn.mjs RUN_OPS, condMet and effCard.
// Conditions the solver evaluates, by kind (lib/turn.mjs condMet switches on the key). One table,
// so "known" here and "evaluated" there can't drift apart.
export const COND_KINDS = [
  // "not(A|B)": the else-branch of a known condition (an unknown inner condition stays unknown).
  ["not", /^not\((.*)\)$/i],
  ["legion", /^\[legion\]/i], ["paidExtra", /^if you paid the additional cost/i], ["did", /^if you do\b/i],
  ["atBf", /^(?:if|while) i'm at a battlefield$/i], ["always", /^once each turn|^then do this|^then,? do the following/i],
  ["spent", /^if you've spent at least ((?:\{\w+\})+)/i], ["empowered", /^\[empowered\]|^if (?:i'm|it's) \[empowered\]/i],
  ["mighty", /^\[mighty\]|^while i'm \[mighty\]|^if i was \[mighty\]/i], ["buffed", /^while i'm buffed/i], ["stunned", /^if it(?: is|'s)(?: already)? stunned/i],
  ["notYourTurn", /^if it's not your turn/i], ["oppNear", /^if an opponent's score is within (\d+) points? of the victory score/i],
  ["controlTag", /^if you control an? (\w+)$|^you control an? (\w+)\.?$/i], ["gearCount", /^if you control (two|three|\d+) or more (?:other )?gear/i],
  ["faceDownBf", /^if you control a facedown card (?:at a battlefield|here)/i], ["controlThisBf", /^if you control this battlefield/i],
  ["enemyDied", /^if an enemy unit has died this turn/i], ["oppControlsBf", /^if an opponent controls a battlefield/i],
  ["handSize", /^if you have (two|three|\d+) or fewer cards in your hand/i], ["anotherHere", /^while you have another unit here/i],
  ["playedToBf", /^(?:if )?you've played a unit or gear to a battlefield this turn/i], ["showedOff", /^if you showed off(?: a (?:card|unit))?/i],
  ["fourThere", /^if there are 4 or more units there/i], ["fromFaceDown", /^if it's your turn and you played this from face ?down/i], ["runeCount", /^if you control (\d+) or more runes/i], ["onlyUnitThere", /^if it is the only unit you control there/i], ["enemyAloneHere", /^if an enemy unit is alone here/i],
  ["empoweredThrice", /^while i'm \[empowered\] three times/i],
  // 23 Nov, batch 5: conditions the board answers.
  ["fromHand", /^if you played this from your hand/i], ["diedAlone", /^if i died alone/i], ["notDiedAlone", /^if i didn't die alone/i],
  ["stunnedEnemyHere", /^while there's a stunned enemy unit here/i], ["selfEmpowered", /^if this is \[empowered\]/i],
  ["anyEmpowered", /^(?:if )?you control something that's \[empowered\]/i], ["refBuffed", /^if it's already buffed/i],
  ["refMaxMight", /^if it has (\d+) M or less/i], ["refEnemy", /^if it was an enemy unit/i], ["refFriendly", /^if it was a friendly unit/i],
  ["beginningPhase", /^if it's your beginning phase/i], ["readyEnemyHere", /^if there is a ready enemy unit here/i],
  ["oneOtherHere", /^(?:if there is |i'm at a battlefield with )?exactly one other unit you control(?: here)?/i],
  ["undamaged", /^if i haven't been dealt damage this turn/i], ["deployGearHere", /^(?:while |if )there(?:'s| is) a friendly gear with \[deploy\] (?:at my battlefield|here)/i],
  ["runesMax", /^if you control (\d+) or fewer runes/i], ["runesMin", /^while you have (\d+)\+ runes/i], ["playedToBfSelf", /^if you play me to a battlefield/i],
  ["crowdAtMyBf", /^while there are (\d+) or more other friendly units and\/or gear at my battlefield/i], ["unitDied", /^if a unit died this turn/i],
  ["notNearVictory", /^if your score is not within (\d+) points? of the victory score/i], ["discarded", /^if you've discarded a card this turn/i],
  ["level", /^\[level (\d+)\]/i], ["noOpenBf", /^if there are no open battlefields/i], ["bfTwoUnits", /^if you control a battlefield with exactly two units there/i], ["twoThere", /^if you have exactly two units there/i], ["attackingWithAnother", /^while i'm attacking with another unit/i], ["oneOnOne", /^if i'm one on one/i], ["oppStunned", /^if an opponent controls a stunned unit/i], ["choseEnemy", /^if you've chosen an enemy unit this turn/i], ["allFourTags", /^if your units have all of the following tags/i], ["playedAllThree", /^if you've played a non-token unit, a non-token gear, and a spell this turn/i], ["refEmpowered", /^if the chosen unit is \[empowered\]/i], ["fourAndFour", /^if you have exactly 4 cards in hand and exactly 4 units at battlefields/i],
];
export const condKind = (c) => { for (const [k, re] of COND_KINDS) { const m = re.exec(String(c).trim()); if (m) return { k, m }; } return null; };
export function condKnown(cond) {
  if (!cond) return true;
  if (typeof cond === "object") return cond.spentPower != null;
  return String(cond).split("; ").every((c) => { const n = /^not\((.*)\)$/i.exec(c.trim()); return n ? condKnown(n[1].split("|").join("; ")) : !!condKind(c); });
}
export const ENGINE_OPS = new Set(["chooseBf", "strip", "discountNext", "redeploy", "prevent", "swapPlaces", "damage", "might", "swing", "stun", "kill", "banish", "bounce", "bounce2", "recall", "ready", "exhaust", "move", "token", "buff",
  "keyword", "add", "channel", "readyRunes", "lock", "protect", "noMove", "heal", "edict", "empower", "fight", "choose", "noTurn", "noop", "attach", "counter", "swap", "gold", "swapTwo", "score", "baseMight", "enterReadyTurn", "nextUnitAnywhere", "winGame", "addPit", "bomb", "killGear", "freeGear", "moveGear", "xp", "decree", "winXp", "buffOnPlay", "pullFromHand", "nextUnitReady", "disempower", "discard", "playSelf",
  "noSpells", "takeControl", "foxFire", "readyUpTo", "edictThere", "theirDiscard",
  "bulletTime", "returnAll", "doubleDamage", "scoreOpp", "buffPlus", "powerToEnergy", "detach",
  "attachEquip", "spellBonusNext", "dieOnDamage", "tentacles", "possess",
  "equipFromHand", "duel", "theirEdict", "bounceTotal", "overt", "energyToPower", "kato", "noSpellDamage", "nameSpell"]);
export const ENGINE_TRIGGERS = new Set(["winCombat", "dieInCombat", "conquerOrHold", "empowered", "thirdMove", "playOrScore", "playOrFirstGear", "discardMe", "playAndConquer", "moveFrom", "firstMove", "secondMove", "friendlyDies", "youPlayOtherUnit", "allyExhausted", "youStun", "holdHere", "allyFights", "allyAttacksHere", "combatEnds", "youPlayGear", "readied", "youPlayFaceDown", "playOrAttack", "youPlayFirst", "youPlaySecond", "spell", "play", "playFaceDown", "move", "die", "conquer", "hold", "exhausted", "oppPlaysUnit", "youPlaySpell", "youPlayCard", "activated", "attack", "defend", "attackOrDefend"]);
// Combat triggers are lib/fight.mjs's: only the blast (Graves) is read there.
// "At the start of your Beginning Phase … you win the game" (Gutter Palace): solveTurn checks it before holds.
const startWin = (a) => a.trigger === "startTurn" && (a.effects || []).every((e) => e.op === "winGame");
const fightTrigger = (a) => /^(attack|defend|attackOrDefend)$/.test(a.trigger) && (a.effects || []).every((e) => e.op === "damage" && e.n === "myMight" && e.target?.who === "each");
export const ENGINE_STATICS = new Set(["playToOpen", "extraCostLess", "ambushAnywhere", "myMight", "myKeywords", "aura", "auraKeyword", "noCombat", "enterExhausted", "enterReady", "costLess", "untargetable", "anyDamageKills", "deathknellTwice", "tagCostLess", "costLessHighestMight", "accelNotFromHand", "empowerCap", "gearBonusDamage", "deathknellTwiceHere", "vilemaw", "spellsCostLess", "gearCostLess", "tokensReady", "noMoveToBase", "unitsToOpen", "spellBonusDamage", "uncounterable", "extraMinus", "holdTwiceHere", "jhinCost", "blastCone", "othersEnterReady", "leona", "assaultPerGear", "equipQuickDraw", "playToLoneEnemy", "unitsToLoneEnemy", "noOppPoints", "saboteur", "zilean", "multiBuff", "ivernTag", "mistfall", "wardenNoAmbush", "conquerTwiceHere", "uncounterableSelf", "bottled", "assaultPerEnemyHere", "gearhead", "noReady", "helm", "vexCheerless", "wildclaw", "hierophant", "gangplank", "syndra", "ireliaGraceful", "feline", "fightOnly", "backlineText", "kaynNoDamage", "ignoreTank", "excessStrike", "ava", "stalkingWolf"]);
export const ENGINE_KEYWORDS = new Set(["Reaction", "Action", "Hidden", "Accelerate", "Assault", "Shield", "Tank", "Backline", "Ganking", "Equip", "Disarm", "Stun",
  "Deflect", "Unique", "Temporary", "Deathknell", "Legion", "Empowered", "Add", "Buff", "Deploy", "Show Off", "Ambush", "Repeat", "Empower", "Mighty", "Quick-Draw", "Flow", "Level", "Hunt"]);
// Activated-ability costs the solver doesn't pay (lib/turn.mjs skips these abilities): killing, exhausting or
// discarding something, recycling. "Spend my buff" it does pay.
// Since 23 Nov (batch 6) the solver pays "kill this", "kill / exhaust a friendly unit", "discard 1" and "spend N XP".
export const UNPAID_COST = /recycle|discard [2-9]/i;
// "For each …" counts the solver can take from the board (lib/turn.mjs perCount).
export const PER_KINDS = [/^other unit you control here(?: with my name)?$/i, /^friendly gear$/i, /^token unit you control$/i, /^other exhausted unit you control$/i, /^other friendly unit here$/i, /^enemy unit here$/i, /^time i'm \[empowered\]$/i, /^buffed friendly unit at my battlefield$/i, /^your points?$/i];
// (costs) "for each point you scored from holding this turn": Needlessly Large Yordle.
// "I cost [eN] less for each …" counts the solver takes from the board (lib/turn.mjs costNow). The trash isn't on it.
export const COST_PER = [/^tags? among your units$/i, /^point you scored from holding this turn$/i, /^gear you control$/i, /^exhausted unit you control$/i, /^card you've played this turn(?:, to a minimum of \[e\d+\])?$/i, /^battlefield you've conquered this turn$/i, /^of your \[mighty\] units$/i];
export const costPerKnown = (per) => COST_PER.some((re) => re.test(String(per).trim()));
export const perKnown = (per) => !per || PER_KINDS.some((re) => re.test(String(per).trim()));
export function engineReads(card, c = compile(card)) {
  const why = [];
  for (const k of Object.keys(c.keywords)) if (!ENGINE_KEYWORDS.has(k) && KEYWORDS[k] !== "op") why.push(`[${k}]`);
  for (const st of c.statics) {
    if (!ENGINE_STATICS.has(st.op)) why.push(`static ${st.op}`);
    else if ((st.per && !(st.op === "costLess" ? costPerKnown(st.per) : perKnown(st.per))) || (st.tag && !["aura", "auraKeyword", "tagCostLess"].includes(st.op))) why.push(`static ${st.op} (counted)`);
    else if (!condKnown(st.cond)) why.push("condition");
  }
  for (const a of c.abilities) {
    if (c.sentences.find((x) => x.text === a.text)?.state === "noTurn") continue;
    if (a.trigger === "mode") { why.push("modal"); continue; }
    if (a.branch) { why.push("type branch"); continue; }
    if (a.modal && !(a.modes || []).length) { why.push("modal"); continue; }
    for (const md of a.modes || []) for (const e of md.effects) if (!ENGINE_OPS.has(e.op)) why.push(`op ${e.op}`);
    if (!ENGINE_TRIGGERS.has(a.trigger) && !fightTrigger(a) && !startWin(a)) why.push(`trigger ${a.trigger}`);
    if (!condKnown(a.cond)) why.push("condition");
    for (const e of a.effects || []) { if (!ENGINE_OPS.has(e.op)) why.push(`op ${e.op}`); if (e.cond && e.op !== "noTurn" && !condKnown(e.cond)) why.push("condition"); }
    if (a.trigger === "activated" && UNPAID_COST.test(a.cost || "")) why.push("activated cost");
  }
  for (const s of c.sentences) if (s.state === "unread") why.push("unread text");
  return { ok: why.length === 0, why: [...new Set(why)] };
}

// Coverage over a set of cards, weighted by played copies when given.
// engine(card) → { ok, why }: what the solver plays. Defaults to engineReads (this language's ops).
export function coverage(cards, weight = () => 1, engine = null) {
  const R = { cards: 0, compiled: 0, engine: 0, w: 0, wCompiled: 0, wEngine: 0, sentences: 0, states: { read: 0, noTurn: 0, unread: 0 }, why: {}, unread: [], gaps: {} };
  for (const card of cards) {
    const c = compile(card), w = weight(card);
    const compiled = c.sentences.every((s) => s.state !== "unread");
    const eng = engine ? engine(card) : engineReads(card, c);
    R.cards++; R.w += w; if (compiled) { R.compiled++; R.wCompiled += w; } if (eng.ok) { R.engine++; R.wEngine += w; }
    for (const s of c.sentences) { R.sentences++; R.states[s.state]++; if (s.state === "noTurn") R.why[s.why || "?"] = (R.why[s.why || "?"] || 0) + 1; if (s.state === "unread") R.unread.push({ card: card.n, text: s.text, w }); }
    for (const g of eng.why) { const x = (R.gaps[g] ||= { cards: 0, w: 0 }); x.cards++; x.w += w; }
  }
  R.unread.sort((a, b) => b.w - a.w);
  return R;
}

// The legal pool's coverage, weighted by copies in lists played since `since`.
// cards: the catalog's cards; decks: data/decks.json's decks; legal: a Set of legal names (null = all).
export function poolCoverage(cards, decks, legal, { since = "2026-10-23", engine = null } = {}) {
  const byCode = new Map(), byName = new Map();
  for (const c of cards) { byCode.set(c.c, c); byCode.set(String(c.c).replace(/\/\d+$/, ""), c); if (!byName.has(c.n) || !c.v) byName.set(c.n, c); }
  const copies = new Map(); let lists = 0;
  for (const d of decks) {
    if ((d.dt || "") < since) continue; lists++;
    for (const [k, q] of Object.entries(d.cards || {})) { const c = byCode.get(k) || byCode.get(String(k).replace(/\/\d+$/, "")); if (c) copies.set(c.n, (copies.get(c.n) || 0) + q); }
  }
  const pool = [...byName.values()].filter((c) => /Unit|Spell|Gear/.test(c.t || "") && !c.token && (!legal || legal.has(c.n)));
  const R = coverage(pool, (c) => copies.get(c.n) || 0, engine);
  return { ...R, lists, since, copiesOf: (n) => copies.get(n) || 0 };
}
