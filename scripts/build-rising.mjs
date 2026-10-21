#!/usr/bin/env node
// Regenerates data/rising.json — which cards each legend's lists are taking up or dropping —
// and keeps data/swaplog.json, the scoreboard for the brews' suggestions. Fetches nothing;
// runs after build-brews in the refresh.
//
//   node scripts/build-rising.mjs
//
// RISING: per legend, each card's share of its posted lists in the last RECENT days of the
// snapshot against the PRIOR days before them. Posted lists, not only placings: a legend's
// crowd tracks its winners closely (docs/deckbuilding.md, the blind test: 33 of 40 cards),
// and moves first. A legend needs MIN lists in each window to have a trend.
//
// SCOREBOARD: every swap a brew suggests (data/brews.json) is logged the first day it
// appears. It is scored against the legend's good placings (lib/placing.mjs), not its posted
// lists: what the crowd copies is not what wins, and a RISING suggestion — read from posted
// lists — would otherwise grade itself. BASE is the card's share of the good placings in the
// SETTLE days before the suggestion, AFTER its share in the SETTLE days after; adopted if it
// gained ADOPT points. Good placings are thin — no legend had 10 in a week in Oct 2026, 19
// had 10+ over 28 days — hence the 28 days, and a suggestion with under MIN_GOOD in either
// window stays unscored rather than scored on noise. The log is the one file here that is
// not rebuilt from scratch — it is history, like data/history.json.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";
import { isGoodPlacing, riotRows } from "../lib/placing.mjs";

const RECENT = 7, PRIOR = 14, MIN = 5, SHOW = 5, KEEP = 0.05, SETTLE = 28, ADOPT = 0.1, MIN_GOOD = 10;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const pct = (x) => Math.round(x * 100);
const day = (s, n) => new Date(Date.parse(s) + n * 864e5).toISOString().slice(0, 10);

const main = async () => {
  const [cat, extras, banned, snap, brews, topdecks] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("brews.json").catch(() => null), read("topdecks.json").catch(() => null)]);
  const log = await read("swaplog.json").catch(() => ({ entries: [] }));
  const known = new Set(cat.cards.map((c) => c.c));
  const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const usable = snap.decks.filter((d) => d.lg && card(d.lg) && d.dt && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const to = snap.window?.to || usable.map((d) => d.dt).sort().pop();
  const recentFrom = day(to, -RECENT + 1), priorFrom = day(recentFrom, -PRIOR);
  const names = (d) => new Set(Object.keys(d.cards).map((k) => card(k)).filter((c) => c && ["Unit", "Spell", "Gear"].includes(c.t)).map((c) => c.n));
  const byLegend = new Map();
  for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }

  const legends = {};
  for (const [name, ds] of byLegend) {
    const now = ds.filter((d) => d.dt >= recentFrom), before = ds.filter((d) => d.dt >= priorFrom && d.dt < recentFrom);
    if (now.length < MIN || before.length < MIN) continue;
    const share = (xs) => { const m = new Map(); for (const d of xs) for (const n of names(d)) m.set(n, (m.get(n) || 0) + 1 / xs.length); return m; };
    const a = share(now), b = share(before);
    const cards = {};
    for (const n of new Set([...a.keys(), ...b.keys()])) {
      const x = a.get(n) || 0, y = b.get(n) || 0;
      if (x < KEEP && y < KEEP) continue;
      const c = idx.cards.find((k) => k.n === n && !k.v);
      cards[n] = { now: pct(x), before: pct(y), delta: pct(x) - pct(y), ...(c?.s === "RAD" ? { rad: true } : {}) };
    }
    const sorted = Object.entries(cards).sort((p, q) => q[1].delta - p[1].delta);
    legends[name] = { lists: { now: now.length, before: before.length }, cards,
      rising: sorted.filter(([, v]) => v.delta >= 10).slice(0, SHOW).map(([n, v]) => ({ name: n, ...v })),
      falling: sorted.reverse().filter(([, v]) => v.delta <= -10).slice(0, SHOW).map(([n, v]) => ({ name: n, ...v })) };
  }

  // SCOREBOARD: log new suggestions, score settled ones, against good placings.
  const today = new Date().toISOString().slice(0, 10);
  // Good placings: the snapshot's, and Riot's Top 8 and Best Of lists judged by the same cut.
  const byName = new Map();
  for (const c of idx.cards) if (!c.v && !byName.has(c.n)) byName.set(c.n, c);
  const riot = riotRows(topdecks, snap, card, byName).filter((d) => !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const good = new Map();
  for (const d of [...usable, ...riot]) if (isGoodPlacing(d)) { const n = idx.legendName(card(d.lg)); (good.get(n) || good.set(n, []).get(n)).push(d); }
  // A card's share of a legend's good placings dated in [from, until).
  const goodShare = (legend, from, until, inn, out) => {
    const ds = (good.get(legend) || []).filter((d) => d.dt >= from && d.dt < until);
    const of = (n) => (ds.length ? pct(ds.filter((d) => names(d).has(n)).length / ds.length) : null);
    return { from, until, n: ds.length, in: of(inn), out: of(out) };
  };
  const key = (l, s) => `${l}|${s.out}|${s.in}`;
  const have = new Set(log.entries.map((e) => e.key));
  for (const b of brews?.brews || []) for (const s of (b.swaps || []).concat(b.more || [], b.options || [])) {
    const k = key(b.legend, s);
    if (have.has(k)) continue;
    const t = legends[b.legend]?.cards || {};
    log.entries.push({ key: k, legend: b.legend, out: s.out, in: s.in, kind: s.kind, applied: (b.swaps || []).includes(s), first: today,
      inThen: t[s.in]?.now ?? null, outThen: t[s.out]?.now ?? null });
    have.add(k);
  }
  for (const e of log.entries) {
    // Entries logged before good placings were the measure get their base read now: the
    // snapshot keeps 60 days, so the 28 before their first day are still in it.
    if (!e.base) e.base = goodShare(e.legend, day(e.first, -SETTLE), e.first, e.in, e.out);
    if (e.scored || day(e.first, SETTLE) > to) continue;           // not settled in the data yet
    e.after = goodShare(e.legend, day(e.first, 1), day(e.first, SETTLE + 1), e.in, e.out);
    e.scored = today;
    if (e.base.n < MIN_GOOD || e.after.n < MIN_GOOD) { e.adopted = null; continue; }   // too few results to say
    e.adopted = e.after.in - e.base.in >= pct(ADOPT);
  }
  const scored = log.entries.filter((e) => e.scored);
  const judged = scored.filter((e) => e.adopted != null);
  const rate = (xs) => ({ n: xs.length, adopted: xs.filter((e) => e.adopted).length });
  const board = { kinds: Object.fromEntries(["alt", "upgrade", "test", "rising"].map((k) => [k, rate(judged.filter((e) => e.kind === k))])),
    logged: log.entries.length, scored: judged.length, thin: scored.length - judged.length, settle: SETTLE, minGood: MIN_GOOD };

  await writeFile(new URL("../data/swaplog.json", import.meta.url), JSON.stringify({
    note: `Every swap a brew has suggested, from the first day it appeared. base and after are the card's share of the legend's good placings (lib/placing.mjs) in the ${SETTLE} days before and after; adopted if it gained 10+ points, null when either window has under ${MIN_GOOD} good placings. inThen/outThen are its share of posted lists that day, kept for reference. History: never rebuilt, only added to.`,
    settle: SETTLE, adopt: ADOPT, entries: log.entries }));
  await writeFile(new URL("../data/rising.json", import.meta.url), JSON.stringify({
    generatedAt: today, source: "data/decks.json (posted lists, placed or not), data/brews.json, data/swaplog.json",
    note: `Each card's share of a legend's posted lists in the last ${RECENT} days against the ${PRIOR} before. Posted lists move first and track winners closely; a change is a signal, not a result.`,
    window: { recent: [recentFrom, to], prior: [priorFrom, day(recentFrom, -1)] }, legends, scoreboard: board }));
  const ls = Object.keys(legends).length;
  console.log(`${ls} legends with a trend (${recentFrom}–${to} vs ${priorFrom}–${day(recentFrom, -1)}) · ${log.entries.length} suggestions logged, ${judged.length} scored on good placings, ${scored.length - judged.length} settled with too few to say`);
  for (const [n, v] of Object.entries(legends).sort((p, q) => q[1].lists.now - p[1].lists.now).slice(0, 8))
    console.log(`  ${n.slice(0, 30).padEnd(30)} ${String(v.lists.now).padStart(3)}/${String(v.lists.before).padEnd(3)} ↑ ${v.rising.map((r) => `${r.name} ${r.before}→${r.now}`).join(", ") || "—"}`);
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-rising: ${e.message}`); process.exit(1); });
