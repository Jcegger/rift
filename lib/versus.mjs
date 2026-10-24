// Head to head, card by card: one deck against a legend's lists. `scripts/rift versus`.
//
// Not a game simulator. Who wins a matchup depends on play this cannot see, and a win
// rate made up by a model is the kind of number this repo does not print. What it can
// say exactly is which of their cards answers which of ours, and the other way round,
// read off the card text: their bounce, damage, kills, stuns, counters and fight tricks
// against our units and spells; our answers against their units, Might by Might. Every
// card of theirs is weighted by how many of their lists run it, so "Gust (76%)" means
// three lists in four.
//
// The effect reader is a set of patterns over card text, tuned on the Radiance field's
// interaction (Oct 2026). A card whose text looks like interaction but matches no
// pattern is listed as unread rather than silently skipped.

/* ── reading a card's interaction ────────────────────────────────────────── */
const KW = (x, k) => new RegExp(`\\[${k}\\]`, "i").test(x);
// Hidden cards are played from face down with Reaction (§811.1.b).
const speedOf = (x) => KW(x, "Reaction") ? "reaction" : KW(x, "Hidden") ? "hidden" : KW(x, "Action") ? "action" : "main";
// Might is printed both as the symbol and as the word ("equal to my Might"); fold both to M.
const clean = (x) => String(x || "").replace(/\s*\([^)]*\)/g, "").replace(/:rb_might:|\bMight\b/g, "M").replace(/:rb_energy_(\d+):/g, "[$1]");

// Every effect a card has that touches units, spells or fights. Units count only for the
// effects they carry (a play or attack trigger); their bodies are read separately.
export function effectsOf(card) {
  const x = clean(card.x);
  const sp = speedOf(x);
  const out = [];
  const add = (kind, o = {}) => out.push({ kind, speed: sp, ...o });
  // Modal cards run their modes together ("battlefield.Kill a gear"), so split first.
  const parts = x.split(/(?<=[a-z.])(?=[A-Z])|\. |\n|\|/).map((s) => s.trim()).filter(Boolean);
  for (const s of parts) {
    let m;
    // A swing: one unit up, another down (Defiant Dance). Both halves count.
    if ((m = /give a unit \+(\d+) M this turn and another unit -(\d+) M/i.exec(s))) {
      add("pump", { n: Number(m[1]) }); add("minus", { n: Number(m[2]) }); continue;
    }
    // Banish-then-replay is a blink (Temporal Breach) or a redeploy (Thrill of the Hunt):
    // a trick that saves or resets a unit, not removal.
    if (/banish (?:a|a friendly) unit, then its owner plays it/i.test(s)) { add("redeploy", { same: /same location/i.test(s) }); continue; }
    // Wind and Ghosts: small units banished, the rest bounced.
    if (/if it has (\d+) M or less, banish it/i.test(s)) { add("banish", { max: Number(/(\d+) M or less/.exec(s)[1]) }); continue; }
    if (/^otherwise, return it to its owner's hand/i.test(s)) { add("bounce", { max: null, battlefield: true }); continue; }
    if ((m = /return (?:a|an|up to \w+)? ?(enemy |friendly )?units? (at a battlefield )?(?:with (\d+) M or less )?(?:there )?to (?:its|their) owners?'?s? hands?/i.exec(s))) {
      if (m[1] === "friendly ") continue;   // their own tempo trick, not removal
      add("bounce", { max: m[3] ? Number(m[3]) : null, battlefield: !!m[2], needsFour: /4 or more units/i.test(x) });
    } else if (/return a friendly unit and an enemy unit/i.test(s)) add("bounce", { max: null, battlefield: false, needsFriendly: true });
    else if ((m = /deal (\d+)(?: damage)? split among units/i.exec(s))) add("damage", { n: Number(m[1]), split: true });
    else if ((m = /deal (\d+) to (each of up to \w+|up to \w+|all|each|a) (?:enemy )?units?/i.exec(s))) add("damage", { n: Number(m[1]), many: /each|all|up to/i.test(m[2]) });
    else if (/deal damage equal to my M to all enemy units/i.test(s)) add("blast", {});
    else if (/deal damage equal to their Mights to each other/i.test(s)) add("fight", { bonus: /give the friendly unit \+(\d+)/i.test(x) ? Number(/give the friendly unit \+(\d+)/i.exec(x)[1]) : 0 });
    else if ((m = /kill (?:a|an) (?:enemy )?unit(?: at a battlefield)?(?: with (\d+) M or less)?/i.exec(s)) && !/friendly unit/i.test(s)) add("kill", { max: m[1] ? Number(m[1]) : null });
    else if ((m = /banish (?:a|an) (?:enemy )?unit(?: at a battlefield)?(?: with (\d+) M or less)?/i.exec(s)) && !/friendly|from among them|top \d+ cards/i.test(s)) add("banish", { max: m[1] ? Number(m[1]) : null });
    // An edict: each player kills one of their own, so the victim picks the least loss.
    else if (/each player kills one of their units/i.test(s)) add("edict", {});
    else if (/\[Stun\] (?:a|an|it|an attacking enemy) ?unit|\[Stun\] it/i.test(s)) add("stun", {});
    else if ((m = /give enemy units -(\d+) M/i.exec(s))) add("minus", { n: Number(m[1]), all: true, floor: /minimum of (\d+)/i.test(s) ? 1 : 0 });
    else if ((m = /give (?:a|another|an enemy) unit -(\d+) M/i.exec(s)) || (m = /and another unit -(\d+) M/i.exec(s))) add("minus", { n: Number(m[1]) });
    else if (/^move an enemy unit/i.test(s)) add("move", {});
    if (/kill (?:a|up to one) gear|or a gear\b/i.test(s)) add("gearkill", {});
    else if ((m = /counter a spell that costs no more than \[(\d+)\] and no more than :rb_rune_rainbow:/i.exec(s))) add("counter", { maxE: Number(m[1]), maxP: 1 });
    else if ((m = /counter a spell unless its controller pays \[(\d+)\]/i.exec(s))) add("counter", { tax: Number(m[1]) });
    else if (/counter an enemy spell or ability that chooses a friendly unit/i.test(s)) add("counter", { choosesTheirs: true });
    else if (/^counter a spell/i.test(s)) add("counter", {});
    else if (/can't be chosen by enemy spells/i.test(s)) add("protect", { untargetable: true });
    else if (/if a friendly unit would die/i.test(s)) add("protect", { saves: true });
    else if ((m = /give (?:a|a friendly) unit \+(\d+) M this turn/i.exec(s))) {
      const extra = /additional \+(\d+) M/i.exec(x);
      add("pump", { n: Number(m[1]) + (extra ? Number(extra[1]) : 0), cond: !!extra });
    } else if (/swap the M of two units/i.test(s)) add("swap", {});
  }
  // "Deal 3 to a unit. Deal 3 to a unit." can be the same unit twice (Falling Star).
  const single = out.filter((e) => e.kind === "damage" && !e.many && !e.split);
  if (single.length > 1) { single[0].n = single.reduce((a, e) => a + e.n, 0); single[0].twice = true; out.splice(0, out.length, ...out.filter((e) => !single.slice(1).includes(e))); }
  // Equipment is a pump from its Might bonus (§137.3); from face down it attaches at
  // Reaction speed, otherwise Equip is our-turn only (§381).
  if (/Equipment/.test((card.g || []).join(" ")) && card.m) add("pump", { n: card.m, equip: true });
  return out;
}

// Looks like interaction but read as nothing: shown, so a pattern gap can't hide a card.
export const looksInteractive = (card) => /deal|kill|return|counter|stun|banish|-\d+ M|swap|move an enemy/i.test(clean(card.x));

/* ── bodies ──────────────────────────────────────────────────────────────── */
// A unit's Might out of a fight (printed) and in one (Assault while attacking, Shield
// while defending; §807, §814). Gust and damage spells read the first; a fight the second.
export function bodyOf(card) {
  const x = card.x || "";
  const assault = Number((/\[Assault (\d+)\]/i.exec(x) || [])[1] || (/\[Assault\]/i.test(x) ? 1 : 0));
  const shield = Number((/\[Shield (\d+)\]/i.exec(x) || [])[1] || (/\[Shield\]/i.test(x) ? 1 : 0));
  const deflect = Number((/\[Deflect (\d+)\]/i.exec(x) || [])[1] || (/\[Deflect\]/i.test(x) ? 1 : 0));
  // A conditional "I have +N M" (Sivir, Mercenary after two Power spent) is a ceiling.
  const cond = /if [^.]*, I have \+(\d+) (?::rb_might:|Might)/i.exec(x);
  return { might: card.m || 0, attack: (card.m || 0) + assault, defend: (card.m || 0) + shield, deflect,
    best: (card.m || 0) + (cond ? Number(cond[1]) : 0),
    tank: /\[Tank\]/i.test(x), hidden: /\[Hidden\]/i.test(x), ambush: /\[Ambush\]/i.test(x) };
}

/* ── their field ─────────────────────────────────────────────────────────── */
// Per card name: the share of lists running it and copies per list that runs it.
export function weigh(lists, nameOf) {
  const by = new Map();
  for (const d of lists) {
    const seen = new Map();
    for (const [code, q] of Object.entries(d.cards || {})) {
      const n = nameOf(code);
      if (n) seen.set(n, (seen.get(n) || 0) + q);
    }
    for (const [n, q] of seen) {
      const r = by.get(n) || { lists: 0, copies: 0 };
      r.lists++; r.copies += q;
      by.set(n, r);
    }
  }
  for (const r of by.values()) { r.share = r.lists / lists.length; r.avg = r.copies / r.lists; }
  return by;
}

/* ── the comparison ──────────────────────────────────────────────────────── */
// ours / theirs: [{ card, share (1 for our own list), qty, sb }]. Our sideboard (sb)
// counts only as answers to their cards, marked; what they can hit is our main deck.
// Returns plain rows for the CLI to print; every judgement carries the card behind it.
export function versus(oursAll, theirs) {
  const ours = oursAll.filter((r) => !r.sb);
  const units = (side) => side.filter((r) => /Unit/.test(r.card.t));
  const fx = (side) => side.flatMap((r) => effectsOf(r.card).map((e) => ({ ...e, card: r.card, share: r.share, qty: r.qty, sb: !!r.sb })));
  const ourFx = fx(oursAll).filter((e) => !(e.sb && e.kind === "pump")), theirFx = fx(theirs);

  // Their fight effects (Rampage) kill a unit of ours when their unit, plus the bonus and
  // their best pre-fight pump, reaches it. Measured with their most-played big unit.
  const theirPre = Math.max(0, ...theirFx.filter((e) => e.kind === "pump" && !e.equip).map((e) => e.n));
  const theirBig = units(theirs).filter((r) => r.share >= 0.5).reduce((a, r) => Math.max(a, r.card.m || 0), 0);
  for (const e of theirFx) if (e.kind === "fight") { e.n = theirBig + e.bonus; e.reachNote = `their ${theirBig}-Might unit +${e.bonus}${theirPre ? `, or more after a +${theirPre}` : ""}`; }

  // 1. Their answers to each of our units.
  const theirAnswers = units(ours).map((r) => {
    const b = bodyOf(r.card);
    const hits = [];
    for (const e of theirFx) {
      let when = null;
      if (e.kind === "bounce" && !e.needsFour) {
        if (e.max == null) when = "always";
        else if (b.might <= e.max) when = Math.max(b.attack, b.defend) > e.max ? "outside a fight" : "always";
      } else if (e.kind === "damage" && !e.split) {
        if (b.might <= e.n) when = Math.max(b.attack, b.defend) > e.n ? "outside a fight" : "always";
      } else if (e.kind === "damage" && e.split) {
        if (b.might <= e.n) when = "always";
      } else if (e.kind === "kill") {
        if (e.max == null || b.might <= e.max) when = "always";
      } else if (e.kind === "banish") { if (e.max == null || b.might <= e.max) when = "always"; }
      else if (e.kind === "fight") { if (b.might <= e.n + theirPre) when = Math.max(b.attack, b.defend) > e.n + theirPre ? "outside a fight" : "always"; }
      else if (e.kind === "stun") when = "always";
      if (when) hits.push({ card: e.card, share: e.share, kind: e.kind, when, speed: e.speed, n: e.n ?? e.max, limited: (e.n ?? e.max) != null && e.kind !== "fight" });
    }
    return { card: r.card, qty: r.qty, body: b, hits: dedupe(hits) };
  });

  // Their removal suite, once: what each card does and how far it reaches.
  const suite = dedupe(theirFx.filter((e) => ["bounce", "damage", "kill", "banish", "stun", "gearkill", "move", "fight", "edict"].includes(e.kind) && !e.needsFour)
    .map((e) => ({ card: e.card, share: e.share, kind: e.kind, max: e.kind === "fight" ? null : e.n ?? e.max ?? null, speed: e.speed, split: e.split, many: e.many, battlefield: e.battlefield, reachNote: e.reachNote })));
  const ourGear = ours.filter((r) => /Gear/.test(r.card.t));

  // 2. Their counters against each of our spells (and gear played from hand).
  const counters = theirFx.filter((e) => e.kind === "counter");
  const theirCounters = ours.filter((r) => /Spell/.test(r.card.t)).map((r) => {
    const c = r.card, x = clean(c.x);
    // Not So Fast reads "chooses a friendly unit" from their side: our spells aimed at
    // their units. A pump goes on our own unit, so it is out of its reach.
    const choosesTheirs = effectsOf(c).some((e) => ["bounce", "kill", "damage", "fight", "swap", "stun", "banish", "minus"].includes(e.kind));
    const hits = [];
    for (const e of counters) {
      if (e.maxE != null) { if ((c.e || 0) <= e.maxE && (c.p || 0) <= e.maxP) hits.push({ card: e.card, share: e.share, how: "counters it" }); }
      else if (e.tax != null) hits.push({ card: e.card, share: e.share, how: `unless you pay [${e.tax}]` });
      else if (e.choosesTheirs) { if (choosesTheirs) hits.push({ card: e.card, share: e.share, how: "when it chooses their unit" }); }
      else hits.push({ card: e.card, share: e.share, how: "counters it" });
    }
    return { card: c, qty: r.qty, hits: dedupe(hits) };
  });

  // 3. Our answers to each of their units. Pumps we can add: before a fight (our turn,
  // any speed) and during one (Reaction: hidden cards and Reactions from hand).
  const pre = Math.max(0, ...ourFx.filter((e) => e.kind === "pump").map((e) => e.n));
  const during = Math.max(0, ...ourFx.filter((e) => e.kind === "pump" && (e.speed === "reaction" || e.speed === "hidden")).map((e) => e.n));
  const swapDuring = ourFx.some((e) => e.kind === "swap" && (e.speed === "hidden" || e.speed === "reaction"));
  const ourBodies = units(ours).map((r) => ({ card: r.card, ...bodyOf(r.card) }));
  const ourAnswers = units(theirs).map((r) => {
    const b = bodyOf(r.card);
    const ans = [];
    for (const e of ourFx) {
      if (e.kind === "bounce" && !e.needsFour && (e.max == null || b.might <= e.max)) ans.push({ sb: e.sb, card: e.card, note: e.max == null ? "" : `≤${e.max}` });
      else if (e.kind === "kill" && (e.max == null || b.might <= e.max)) ans.push({ sb: e.sb, card: e.card, note: "" });
      else if (e.kind === "banish" && (e.max == null || b.might <= e.max)) ans.push({ sb: e.sb, card: e.card, note: e.max == null ? "banish" : `banish ≤${e.max}` });
      else if (e.kind === "stun") ans.push({ sb: e.sb, card: e.card, note: "stun (no combat damage this turn)" });
      else if (e.kind === "swap") ans.push({ sb: e.sb, card: e.card, note: "in a fight there: your unit takes its Might" });
      else if (e.kind === "damage" && b.might <= e.n) ans.push({ sb: e.sb, card: e.card, note: `${e.n} dmg` });
      else if (e.kind === "fight") {
        // Kills it when our unit's Might + the bonus reaches theirs; survives when it beats it.
        // Fight effects have no Action here (Rampage), so a pre-fight pump stacks on them.
        const need = b.might - e.bonus;
        const plain = ourBodies.filter((u) => u.might >= need);
        const cond = ourBodies.filter((u) => u.might < need && u.best >= need).map((u) => `${u.card.n} at ${u.best}`);
        const pumped = need - pre;
        let note, ok = true;
        if (need <= 0) note = "with any unit";
        else if (plain.length) note = `with a ${need}+ Might unit`;
        else if (cond.length) note = `only ${[...new Set(cond)].join(", ")}${pre ? `, or ${pumped <= 0 ? "any unit" : `a ${pumped}+ Might unit`} after a +${pre}` : ""}`;
        else if (pre && ourBodies.some((u) => u.might >= pumped)) note = `only after a +${pre} on ${pumped <= 0 ? "any unit" : `a ${pumped}+ Might unit`}`;
        else { note = `needs ${need}+ Might: none in the deck`; ok = false; }
        ans.push({ sb: e.sb, card: e.card, note, ok });
      } else if (e.kind === "blast") {
        const m = (e.card.m || 0);
        const ways = [];
        if (m >= b.might) ways.push("alone");
        else {
          if (m + during >= b.might) ways.push(`with a +${during} flipped in the fight`);
          if (swapDuring) ways.push("with a hidden swap (defending)");
          if (m + pre >= b.might) ways.push(`with +${pre} cast first (attacking only)`);
        }
        ans.push({ sb: e.sb, card: e.card, note: ways.length ? ways.join("; ") : `can't reach ${b.might}`, ok: ways.length > 0 });
      }
    }
    return { card: r.card, share: r.share, avg: r.avg, body: b, answers: ans };
  });

  // 4. Their fight tricks: what a fight of ours has to beat.
  const tricks = theirFx.filter((e) => ["pump", "minus", "swap", "stun", "move", "protect", "redeploy"].includes(e.kind) && /Spell|Gear/.test(e.card.t) || (e.kind === "stun" && /Unit/.test(e.card.t)) || (e.kind === "minus" && /Unit/.test(e.card.t)));
  return { suite, ourGear, theirAnswers, theirCounters, ourAnswers, tricks: dedupe(tricks.map((e) => ({ card: e.card, share: e.share, kind: e.kind, n: e.n, speed: e.speed, all: e.all, equip: e.equip, same: e.same }))), pre, during };
}

// One row per card (a two-mode card can match twice).
function dedupe(rows) {
  const seen = new Map();
  for (const r of rows) {
    const k = `${r.card.n}|${r.kind || ""}|${r.how || ""}|${r.note || ""}`;
    if (!seen.has(k)) seen.set(k, r);
  }
  return [...seen.values()].sort((a, b) => (b.share ?? 1) - (a.share ?? 1));
}
