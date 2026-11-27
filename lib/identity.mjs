// A deck's identity, and a list checked against it: `rift identity`.
//
// The identity is what Jay confirms at the deck-brew skill's gates (the plan, how it wins, what it
// gives up, the jobs and their targets, the key cards), written as a fenced ```identity block of
// JSON in the brew's worksheet (decklab/_brew-template.md). The list is checked three ways:
//   rules      the measured rules of docs/deckbuilding.md as code: the legal checks (lib/decks.mjs
//              deckChecks), one copy across the legend's champion units (§59), signatures 3 or 0
//              (§65), the change count against the named anchor (§86: 6–9 tuning, past 16 a new
//              deck), and never Aurora (lib/avoid.mjs)
//   jobs       every card's jobs (lib/jobs.mjs, or the identity's own list for a job it names
//              cards for), copies per job, and the chance of one by the Nth card seen against the
//              job's target (the consistency table in docs/deckbuilding-theory.md, exact)
//   synergies  a card that names a resource (lib/interactions.mjs, "high") that nothing else in the
//              list makes: an enabler cut from under a kept card
// With no identity block, the rules and synergy parts still run, and jobs are counted untargeted.

import { deckChecks, deckStats, mainOf, changed } from "./decks.mjs";
import { jobsOf, INTERACTION } from "./jobs.mjs";
import { tagsOf, RESOURCES } from "./interactions.mjs";
import { NEVER_PLAY } from "./avoid.mjs";

export const TUNE_BUDGET = 9, NEW_DECK = 16;   // docs/deckbuilding.md §3
export const CORE = 0.8, FLEX = 0.6;
// Resources only cards make, so a card waiting on one is stranded without its maker. Left out: what
// play makes anyway (a spell in the trash, a move, a hold, a conquer, a death, Power spent) and what
// a card only benefits from (being recast or revived: Rebuke "can be recast" isn't a need).
export const NEEDS = new Set(["gold", "empower", "discard", "facedown", "flip", "ready", "recycleRune"]);            // docs/deckbuilding.md §2: core 80%+ of lists, flex under 60%

// P(at least one of `copies` among the first `seen` cards of a `size`-card deck), no mulligan.
export function atLeastOne(copies, seen, size = 40) {
  if (copies <= 0) return 0;
  if (seen >= size) return 1;
  let none = 1;
  for (let i = 0; i < seen; i++) none *= (size - copies - i) / (size - i);
  return 1 - Math.max(0, none);
}

// The first ```identity block in a worksheet → object (null when there's none).
export function readIdentity(markdown) {
  const m = String(markdown).match(/```identity\s*\n([\s\S]*?)\n```/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { throw new Error(`the identity block isn't valid JSON: ${e.message}`); }
}

// deck: { cards, sb } (codes → copies); idx: the catalog index; card: code → card.
// anchor: null or { name, main: Map(name → copies) }; lists: null or [Map(name → copies)] (the legend's posted lists).
export function checkList(deck, idx, { identity = null, anchor = null, lists = null } = {}) {
  const card = (code) => idx.BY.get(code);
  const st = deckStats(deck, idx, {});
  const L = st.legend, champ = L ? idx.championOf(L) : null;
  const main = mainOf(deck.cards, card);
  const size = [...main.values()].reduce((a, b) => a + b, 0) || 40;

  // ── rules
  const rules = [];
  const add = (ok, label, val) => rules.push({ ok, label, val });
  for (const k of deckChecks(deck, idx, st)) if (k.ok !== true) add(k.ok === "later" ? "later" : false, k.label, `${k.val}${k.detail?.length ? `: ${[].concat(k.detail).slice(0, 6).join(", ")}` : ""}`);
  const champCopies = champ ? [...main].filter(([n]) => n.startsWith(champ + ", ")).reduce((a, [, q]) => a + q, 0) : 0;
  add(champCopies === 1, "one copy across the champion's units (93% of good finishes)", `${champCopies}${champCopies > 1 ? `: ${[...main].filter(([n]) => n.startsWith(champ + ", ")).map(([n, q]) => `${q} ${n}`).join(", ")}` : ""}`);
  const sig = [...main].filter(([n]) => { const c = idx.cards.find((x) => x.n === n); return c && idx.signatureOf(c) === champ; }).reduce((a, [, q]) => a + q, 0);
  add(sig === 0 || sig === 3, "signatures at 3 or 0 (90% of good finishes)", `${sig}`);
  const aurora = [...main.keys()].filter((n) => NEVER_PLAY.has(n));
  add(!aurora.length, "no Aurora (Jay's rule)", aurora.length ? aurora.join(", ") : "none");
  let change = null;
  if (anchor) {
    change = changed(main, anchor.main);
    add(change <= NEW_DECK ? (change <= TUNE_BUDGET ? true : "warn") : "new",
      `changes against the anchor, ${anchor.name} (tune 6–9; past ${NEW_DECK} is a new deck)`, `${change}`);
  } else add("warn", "an anchor named (every list starts from one)", "none given");

  // ── jobs
  const named = new Map();   // job → Set(card names) the identity assigns by hand
  for (const [j, spec] of Object.entries(identity?.jobs || {})) if (spec.cards) named.set(j, new Set(spec.cards));
  const perCard = new Map();
  for (const n of main.keys()) {
    const c = idx.cards.find((x) => x.n === n && !x.v) || idx.cards.find((x) => x.n === n);
    const { jobs, theirTurn } = jobsOf(c);
    for (const [j, set] of named) if (set.has(n)) jobs.add(j);
    perCard.set(n, { card: c, jobs, theirTurn });
  }
  const jobRows = [];
  const want = identity?.jobs ? Object.keys(identity.jobs) : [...new Set([...perCard.values()].flatMap((r) => [...r.jobs]))];
  for (const j of want) {
    const spec = identity?.jobs?.[j] || {};
    const cards = [...perCard].filter(([, r]) => (spec.cards ? named.get(j).has(r.card?.n) : r.jobs.has(j)));
    const copies = cards.reduce((a, [n]) => a + main.get(n), 0);
    const by = spec.by ?? 9, target = spec.target ?? null;
    const p = atLeastOne(copies, by, size);
    jobRows.push({ job: j, copies, by, p, target, ok: target == null ? null : p >= target, cards: cards.map(([n]) => `${main.get(n)} ${n}`) });
  }
  const theirTurn = [...perCard].filter(([, r]) => r.theirTurn).reduce((a, [n]) => a + main.get(n), 0);
  const interaction = [...perCard].filter(([, r]) => [...r.jobs].some((j) => INTERACTION.has(j))).reduce((a, [n]) => a + main.get(n), 0);
  // With an identity, a card that does none of its jobs is cut or argued for.
  const jobless = identity?.jobs ? [...perCard].filter(([, r]) => ![...r.jobs].some((j) => want.includes(j))).map(([n]) => `${main.get(n)} ${n}`) : [];

  // ── key cards
  const keys = (identity?.keyCards || []).map((n) => ({ name: n, copies: main.get(n) || 0 }));

  // ── synergies: a "high" consumer with no producer among the other cards (legend and battlefields count)
  const whole = Object.entries(deck.cards).map(([code, q]) => ({ card: card(code), q })).filter((r) => r.card);
  const tags = whole.map((r) => ({ name: r.card.n, t: tagsOf(r.card) }));
  const orphans = [];
  for (const a of tags) for (const need of a.t.consumes.filter((x) => x.spec === "high")) {
    if (!NEEDS.has(need.res)) continue;
    const made = tags.some((b) => b.name !== a.name && b.t.produces.some((p) => p.res === need.res));
    if (!made) orphans.push({ card: a.name, res: need.res, means: RESOURCES[need.res] || need.res, why: need.why });
  }

  // ── core / flex against the legend's posted lists
  let shape = null;
  if (lists?.length) {
    const share = (n) => lists.filter((m) => m.has(n)).length / lists.length;
    const rows = [...main].map(([n, q]) => ({ n, q, s: share(n) }));
    shape = { lists: lists.length,
      core: rows.filter((r) => r.s >= CORE), mid: rows.filter((r) => r.s >= FLEX && r.s < CORE), flex: rows.filter((r) => r.s < FLEX) };
  }

  return { legend: L ? idx.legendName(L) : null, champion: champ, size, rules, change, jobs: jobRows, jobless, theirTurn, interaction, keys, orphans, shape, identity };
}
