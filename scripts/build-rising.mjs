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
// appears, with the card's share then. Once a suggestion is SETTLE days old, it is scored:
// adopted if the card in has gained ADOPT points in the legend's lists since. The log is the
// one file here that is not rebuilt from scratch — it is history, like data/history.json.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";

const RECENT = 7, PRIOR = 14, MIN = 5, SHOW = 5, KEEP = 0.05, SETTLE = 7, ADOPT = 0.1;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const pct = (x) => Math.round(x * 100);
const day = (s, n) => new Date(Date.parse(s) + n * 864e5).toISOString().slice(0, 10);

const main = async () => {
  const [cat, extras, banned, snap, brews] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("brews.json").catch(() => null)]);
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

  // SCOREBOARD: log new suggestions, score settled ones.
  const today = new Date().toISOString().slice(0, 10);
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
    if (e.inThen == null || (Date.parse(today) - Date.parse(e.first)) / 864e5 < SETTLE) continue;
    const t = legends[e.legend]?.cards || {};
    if (t[e.in] == null && !legends[e.legend]) continue;     // no trend this week: leave as it was
    e.inNow = t[e.in]?.now ?? 0; e.outNow = t[e.out]?.now ?? 0; e.scored = today;
    e.adopted = e.inNow - e.inThen >= pct(ADOPT);
  }
  const scored = log.entries.filter((e) => e.scored);
  const rate = (xs) => (xs.length ? { n: xs.length, adopted: xs.filter((e) => e.adopted).length } : { n: 0, adopted: 0 });
  const board = { kinds: Object.fromEntries(["alt", "upgrade", "test", "rising"].map((k) => [k, rate(scored.filter((e) => e.kind === k))])), logged: log.entries.length, scored: scored.length };

  await writeFile(new URL("../data/swaplog.json", import.meta.url), JSON.stringify({
    note: "Every swap a brew has suggested, from the first day it appeared, scored once a week old: adopted if the card in gained 10+ points in the legend's posted lists since. History: never rebuilt, only added to.",
    settle: SETTLE, adopt: ADOPT, entries: log.entries }));
  await writeFile(new URL("../data/rising.json", import.meta.url), JSON.stringify({
    generatedAt: today, source: "data/decks.json (posted lists, placed or not), data/brews.json, data/swaplog.json",
    note: `Each card's share of a legend's posted lists in the last ${RECENT} days against the ${PRIOR} before. Posted lists move first and track winners closely; a change is a signal, not a result.`,
    window: { recent: [recentFrom, to], prior: [priorFrom, day(recentFrom, -1)] }, legends, scoreboard: board }));
  const ls = Object.keys(legends).length;
  console.log(`${ls} legends with a trend (${recentFrom}–${to} vs ${priorFrom}–${day(recentFrom, -1)}) · ${log.entries.length} suggestions logged, ${scored.length} scored`);
  for (const [n, v] of Object.entries(legends).sort((p, q) => q[1].lists.now - p[1].lists.now).slice(0, 8))
    console.log(`  ${n.slice(0, 30).padEnd(30)} ${String(v.lists.now).padStart(3)}/${String(v.lists.before).padEnd(3)} ↑ ${v.rising.map((r) => `${r.name} ${r.before}→${r.now}`).join(", ") || "—"}`);
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-rising: ${e.message}`); process.exit(1); });
