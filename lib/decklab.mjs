// decklab's test bench: one proposed change to a deck, measured the same way whoever
// proposed it. `scripts/rift try --deck "<name>" "-Edge of Night" "+Elnuk Herd"`.
//
// The worksheets in decklab/ are where a deck is argued out (identity, how it wins, goal
// tiers, jobs, cards). This is stage 5: it tests what was picked and never picks. Every
// measure is labelled with what it means, and none of them is a win rate:
//   - rules      lib/decks.mjs deckChecks, the same eleven the app runs
//   - shape      counts off the list: curve, Hidden, printed Power by colour
//   - goldfish   lib/sim.mjs with the legend's Gold and hiding on: what you can *use*, not
//                what you hold
//   - field      lib/versus.mjs against the S and A tiers in data/field.json, each legend's
//                legal lists weighted two ways (popularity: lists; results: placings)

import { effectsOf, bodyOf, weigh, versus } from "./versus.mjs";
import { buildDeck, playGame, rng, POLICIES } from "./sim.mjs";

/* ── the change ──────────────────────────────────────────────────────────── */
// "+Elnuk Herd", "-2 Edge of Night", "sb+2 Rebuke", "sb-Existential Dread". Names match the
// catalog exactly (any case), else by a unique prefix; an ambiguous or unknown name throws.
export function parseChanges(args, cards) {
  const names = [...new Set(cards.filter((c) => !/Rune|Legend/.test(c.t || "")).map((c) => c.n))];
  const find = (q) => {
    const l = q.toLowerCase();
    const exact = names.filter((n) => n.toLowerCase() === l);
    if (exact.length) return exact[0];
    const pre = names.filter((n) => n.toLowerCase().startsWith(l));
    if (pre.length === 1) return pre[0];
    throw new Error(pre.length ? `"${q}" matches ${pre.length} cards: ${pre.slice(0, 6).join(", ")}` : `no card called "${q}"`);
  };
  return args.map((a) => {
    const m = /^(sb)?([+-])\s*(\d+)?\s*(.+)$/i.exec(a.trim());
    if (!m) throw new Error(`can't read "${a}": write it as +Name, -2 Name, sb+Name`);
    return { side: m[1] ? "sb" : "main", qty: (m[2] === "-" ? -1 : 1) * Number(m[3] || 1), name: find(m[4]) };
  });
}

// A copy of the deck with the changes made. Removing takes the printing the deck already
// runs; adding prefers a printing already in the deck, else the base printing.
export function applyChanges(deck, changes, cards, BY) {
  const out = { ...deck, cards: { ...(deck.cards || {}) }, sb: { ...(deck.sb || {}) } };
  const base = new Map();
  for (const c of cards) if (!base.has(c.n) || (!c.v && base.get(c.n).v)) base.set(c.n, c);
  for (const ch of changes) {
    const side = ch.side === "sb" ? out.sb : out.cards;
    const have = Object.keys(side).filter((k) => BY.get(k)?.n === ch.name);
    if (ch.qty < 0) {
      let left = -ch.qty;
      for (const k of have) { const take = Math.min(left, side[k]); side[k] -= take; left -= take; if (!side[k]) delete side[k]; }
      if (left) throw new Error(`the ${ch.side === "sb" ? "sideboard" : "main deck"} has ${-ch.qty - left} ${ch.name}, not ${-ch.qty}`);
    } else {
      const k = have[0] || base.get(ch.name)?.c;
      side[k] = (side[k] || 0) + ch.qty;
    }
  }
  return out;
}

/* ── shape ───────────────────────────────────────────────────────────────── */
export function shapeOf(deck, BY) {
  const main = Object.entries(deck.cards || {}).map(([k, q]) => [BY.get(k), q]).filter(([c]) => c && !/Legend|Rune|Battlefield/.test(c.t));
  const sum = (f) => main.reduce((a, [c, q]) => a + (f(c) ? q : 0), 0);
  const n = sum(() => true);
  const power = {};
  for (const [c, q] of main) for (const d of c.d || []) if (c.p) power[d] = (power[d] || 0) + c.p * q;
  const hidden = (c) => /\[Hidden\]/.test(c.x || "");
  return {
    cards: n, units: sum((c) => /Unit/.test(c.t)), spells: sum((c) => /Spell/.test(c.t)), gear: sum((c) => /Gear/.test(c.t)),
    cheap: sum((c) => (c.e || 0) <= 2), big: sum((c) => (c.e || 0) >= 5),
    avg: main.reduce((a, [c, q]) => a + (c.e || 0) * q, 0) / (n || 1),
    hidden: sum(hidden), hiddenNonUnit: sum((c) => hidden(c) && !/Unit/.test(c.t)),
    power, side: Object.values(deck.sb || {}).reduce((a, q) => a + q, 0),
  };
}

// The deck's answers: main-deck cards that can be used against an attack on their turn
// (a Reaction or Action, or a flip from face down) and that remove or turn a unit of any
// size. Gust-style bounces capped by Might don't count: the attack that matters is big.
export function answerNames(deck, BY) {
  const out = new Set();
  for (const k of Object.keys(deck.cards || {})) {
    const c = BY.get(k);
    if (!c) continue;
    const x = c.x || "";
    const quick = /\[Reaction\]|\[Action\]|\[Hidden\]/.test(x);
    if (quick && effectsOf(c).some((e) => ["swap", "kill", "banish", "stun"].includes(e.kind) || (e.kind === "bounce" && !e.needsFour && e.max == null)) && !effectsOf(c).some((e) => e.max != null && e.kind !== "pump"))
      out.add(c.n);
  }
  return [...out];
}

/* ── field ───────────────────────────────────────────────────────────────── */
// fieldDecks: [{ label, n (lists), placed, theirs: [{card, share, avg}] }].
// Each measure is a share-weighted mean over the legends, by popularity and by results.
export function fieldOf(deck, BY, fieldDecks) {
  const rows = (side, sb = false) => Object.entries(side || {}).map(([k, qty]) => ({ card: BY.get(k), qty, share: 1, sb }))
    .filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t));
  const ours = [...rows(deck.cards), ...rows(deck.sb, true)];
  const main = ours.filter((r) => !r.sb);
  const per = fieldDecks.map((fd) => {
    const V = versus(ours, fd.theirs);
    const share = (name) => fd.theirs.find((r) => r.card.n === name)?.share || 0;
    // Spells Defy can counter (no more than 4 Energy and 1 Power), times how often they run it.
    const defyable = main.filter((r) => /Spell/.test(r.card.t) && (r.card.e || 0) <= 4 && (r.card.p || 0) <= 1).reduce((a, r) => a + r.qty, 0);
    // Their regular big units (6+ Might, in a quarter of their lists): how many copies of
    // our main deck answer each, and how many of those are free on their turn (face down).
    const big = V.ourAnswers.filter((a) => a.body.might >= 6 && a.share >= 0.25);
    const copies = (a, pred) => {
      const names = new Set(a.answers.filter((x) => !x.sb && x.ok !== false && pred(x)).map((x) => x.card.n));
      return main.filter((r) => names.has(r.card.n)).reduce((s, r) => s + r.qty, 0);
    };
    const bigAns = big.length ? big.reduce((s, a) => s + copies(a, () => true), 0) / big.length : null;
    const bigFree = big.length ? big.reduce((s, a) => s + copies(a, (x) => /\[Hidden\]/.test(x.card.x || "")), 0) / big.length : null;
    // How exposed our units are to removal limited by Might (Gust and kin): the mean, over
    // our unit copies, of the most-run such card that reaches them outside a fight.
    const unitCopies = V.theirAnswers.reduce((s, r) => s + r.qty, 0);
    const exposed = V.theirAnswers.reduce((s, r) => s + r.qty * Math.max(0, ...r.hits.filter((h) => h.limited).map((h) => h.share)), 0) / (unitCopies || 1);
    // A blast (Graves): the share of their unit copies it kills alone.
    const blast = main.some((r) => effectsOf(r.card).some((e) => e.kind === "blast"));
    const theirUnits = fd.theirs.filter((r) => /Unit/.test(r.card.t));
    const all = theirUnits.reduce((s, r) => s + r.share * r.avg, 0);
    const blastMight = Math.max(0, ...main.filter((r) => effectsOf(r.card).some((e) => e.kind === "blast")).map((r) => r.card.m || 0));
    const blastAlone = blast ? theirUnits.filter((r) => (r.card.m || 0) <= blastMight).reduce((s, r) => s + r.share * r.avg, 0) / (all || 1) : null;
    return { ...fd, defyable, defy: share("Defy"), defyHits: defyable * share("Defy"), bigAns, bigFree, bigCount: big.length, exposed, blastAlone };
  });
  const w = (f, key) => {
    const xs = per.filter((p) => f(p) != null);
    const tot = xs.reduce((s, p) => s + p[key], 0);
    return tot ? xs.reduce((s, p) => s + f(p) * p[key], 0) / tot : null;
  };
  const both = (f) => ({ pop: w(f, "n"), res: w(f, "placed") });
  return {
    per,
    defyHits: both((p) => p.defyHits),
    bigAns: both((p) => p.bigAns), bigFree: both((p) => p.bigFree),
    exposed: both((p) => p.exposed), blastAlone: both((p) => p.blastAlone),
  };
}

export { bodyOf, weigh };

/* ── the engine report: the full model, the same way for every deck ─────────── */
// Opponent scenarios (labelled, never a guess) and policies (how you play). Every report runs
// all three scenarios, eight turns, with hiding on.
export const SCENARIOS = {
  quiet: {},
  normal: { tricksPerTurn: 0.5, deathsPerTurn: 0.7, attacksPerTurn: 0.6 },
  heavy: { tricksPerTurn: 1, deathsFrom: 2, deathsPerTurn: 1.3, attacksPerTurn: 1 },
};
export const DEFAULT_POLICY = { keepForEvelynn: true, holdUp: 0, dais: false, bandleTree: false };

export function engineReport(deck, cat, { games = 6000, turns = 8, policy = {}, keys = null, seed = 7000 } = {}) {
  const d = buildDeck(deck.cards, cat);
  const k = keys || answerNames(deck, cat.BY);
  const out = {};
  for (const [name, sc] of Object.entries(SCENARIOS)) {
    const A = {}; const add = (x, v) => (A[x] = (A[x] || 0) + v);
    for (let i = 0; i < games; i++) {
      const g = playGame(d, rng(seed + i), i % 2 === 1, POLICIES["keep all"], k, null, { hide: true, turns, engine: { ...sc, ...DEFAULT_POLICY, ...policy } }), e = g.engine;
      add("energy", g.spent.slice(0, 4).reduce((a, b) => a + b, 0)); add("u2", g.units[1]); add("two2", g.units[1] >= 2 ? 1 : 0);
      add("u5", g.units[4]); add("m5", g.might[4]); add("u8", g.units[turns - 1]); add("stuck3", g.stuck[2] ? 1 : 0);
      add("attacks", e.attacks); add("answered", e.answered); add("eve", e.evelynnPoints); add("fp", e.fizzPlays); add("fh", e.fizzHits);
      add("revives", e.matHits); add("replays", e.replays); add("tb", e.trickBlocked); add("drawn", e.drawn); add("gold", g.gold[turns - 1]);
      add("merc", e.power2From4 / Math.max(1, turns - 3)); add("kills", e.kills); add("goldMade", e.goldMade);
    }
    const per = (x) => (A[x] || 0) / games;
    out[name] = { energy: per("energy"), u2: per("u2"), two2: per("two2"), u5: per("u5"), m5: per("m5"), u8: per("u8"), stuck3: per("stuck3"),
      answered: A.attacks ? A.answered / A.attacks : null, evelynn: per("eve"), fizz: A.fp ? A.fh / A.fp : null, revives: per("revives"),
      replays: per("replays"), tricksBlocked: per("tb"), drawn: per("drawn"), goldLeft: per("gold"),
      merc: per("merc"), kills: per("kills"), goldMade: per("goldMade") };
  }
  return { keys: k, scenarios: out };
}

/* ── the deck's goal tiers ───────────────────────────────────────────────── */
// decklab/<deck>.tiers.json: each tier's measures, with the worksheet's own targets (min,
// max) or a direction (up, down). Scored before and after a change, tier by tier, so a change
// is read against the plan: a gain on tier 3 doesn't excuse a loss on tier 0.
const dig = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
export function scoreTiers(spec, before, after) {
  return spec.tiers.map((t) => ({
    tier: t.tier, goal: t.goal,
    rows: t.measures.map((m) => {
      const b = dig(before, m.key), a = dig(after, m.key);
      const inRange = (v) => v == null ? null : (m.min == null || v >= m.min - 1e-9) && (m.max == null || v <= m.max + 1e-9);
      let verdict = "same";
      // Below the noise a few thousand shuffles leave, a change is no change: 1.5 points on a
      // share, else 3% of the value (at least 0.05). A target crossed always counts.
      const share = /answered|fizz|two2|stuck|exposed/.test(m.key);
      const noise = m.noise ?? (share ? 0.015 : Math.max(0.05, 0.03 * Math.abs(b ?? 0)));
      const crossed = (m.min != null || m.max != null) && inRange(a) !== inRange(b);
      if (b != null && a != null && (Math.abs(a - b) > noise || crossed)) {
        if (m.dir) verdict = (m.dir === "up") === (a > b) ? "better" : "worse";
        else verdict = inRange(a) && !inRange(b) ? "better" : !inRange(a) && inRange(b) ? "worse" : inRange(a) ? "same" : "worse";
      }
      return { ...m, before: b, after: a, inBefore: inRange(b), inAfter: inRange(a), verdict };
    }),
  }));
}
