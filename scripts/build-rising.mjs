#!/usr/bin/env node
// Regenerates data/rising.json — which cards each legend's posted lists are taking up or
// dropping. Fetches nothing; runs after build-ideas in the refresh.
//
//   node scripts/build-rising.mjs
//
// Per legend, each card's share of its posted lists in the last RECENT days of the snapshot
// against the PRIOR days before them. Posted lists, not only placings: they move first. A
// legend needs MIN lists in each window to have a trend.
//
// Read it with its context, which the file now carries (23 Oct 2026):
// - A list's date is when it was POSTED, not played (build-decks.mjs), and the snapshot has
//   holes: no posted list was captured for 12–16 Oct. `window.coverage` says which days each
//   window actually holds and which it is missing, so "the 14 days before" is never quoted
//   for a window that holds nine.
// - MIN is 5: a legend at the bar moves a card 20 points with one list. `lists` per legend
//   says how many each share is of.
// - Around a set's release the "rising" cards are mostly the new set arriving — real, but a
//   format change rather than a trend inside one.
// The swap scoreboard that lived here (data/swaplog.json) was retired with the brews on
// 23 Oct 2026.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";

const RECENT = 7, PRIOR = 14, MIN = 5, SHOW = 5, KEEP = 0.05;
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const pct = (x) => Math.round(x * 100);
const day = (s, n) => new Date(Date.parse(s) + n * 864e5).toISOString().slice(0, 10);

const main = async () => {
  const [cat, extras, banned, snap] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json")]);
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

  // Which days each window really holds posted lists for, and which it is missing.
  const today = new Date().toISOString().slice(0, 10);
  const posted = new Set(usable.filter((d) => !d.tour).map((d) => d.dt));
  const span = (from, until) => { const all = []; for (let d = from; d <= until; d = day(d, 1)) all.push(d); return { days: all.filter((d) => posted.has(d)).length, of: all.length, missing: all.filter((d) => !posted.has(d)) }; };
  const coverage = { recent: span(recentFrom, to), prior: span(priorFrom, day(recentFrom, -1)) };

  await writeFile(new URL("../data/rising.json", import.meta.url), JSON.stringify({
    generatedAt: today, source: "data/decks.json (posted lists, placed or not)",
    note: `Each card's share of a legend's posted lists in the last ${RECENT} days against the ${PRIOR} before, by posting date. Posted lists move first; a change is a signal, not a result. A legend needs ${MIN} lists in each window, so read a share against its list count, and a window against the days it actually holds.`,
    window: { recent: [recentFrom, to], prior: [priorFrom, day(recentFrom, -1)], coverage, min: MIN }, legends }));
  const ls = Object.keys(legends).length;
  console.log(`${ls} legends with a trend (${recentFrom}–${to}, lists on ${coverage.recent.days} of ${coverage.recent.of} days, vs ${priorFrom}–${day(recentFrom, -1)}, ${coverage.prior.days} of ${coverage.prior.of}${coverage.prior.missing.length ? `; missing ${coverage.prior.missing.join(", ")}` : ""})`);
  for (const [n, v] of Object.entries(legends).sort((p, q) => q[1].lists.now - p[1].lists.now).slice(0, 8))
    console.log(`  ${n.slice(0, 30).padEnd(30)} ${String(v.lists.now).padStart(3)}/${String(v.lists.before).padEnd(3)} ↑ ${v.rising.map((r) => `${r.name} ${r.before}→${r.now}`).join(", ") || "—"}`);
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-rising: ${e.message}`); process.exit(1); });
