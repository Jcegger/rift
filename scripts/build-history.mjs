#!/usr/bin/env node
// Appends today's row to data/history.json: the only file here that remembers.
//
//   node scripts/build-history.mjs
//
// Source: data/decks.json and data/tiers.json, both already on disk. It fetches
// nothing — it is the recorder at the end of the daily job, not another builder.
//
// Why this exists. Every view in the app answers "right now", which was the honest
// thing to do while the data was refreshed by hand and might be three months old. The
// daily workflow changed that: it produces a dated snapshot every morning and nothing
// reads yesterday's. So the tab that ranks a Tier 1 deck three hundred dollars away
// cannot say whether that deck is climbing or dying, which is half the decision.
//
// Mining the answer back out of git does not work, and it is worth writing down why
// rather than rediscovering it. The archive's oldest snapshot holds 250 decks against
// today's 475, and it predates the Vendetta-aware rewrite of build-decks. Diffing the
// two says Blade Dancer fell from 13.6% to 2.9%, which is not a fact about Blade
// Dancer — it is the sample doubling and the method changing underneath. History has
// to be captured deliberately, with the method recorded beside the numbers, or it
// measures its own construction.
//
// Hence two rules the shape below exists to enforce:
//
//   Store inputs, not conclusions. Rows hold legend codes and deck counts, never
//   archetype names or shares. Folding a legend to an archetype needs the catalog and
//   the name index, and that fold has changed twice already; a row that stored the
//   output would have frozen whichever version was current the day it was written.
//   The app folds at render time with its own functions, so history follows the code.
//
//   Record the window. Every row carries the `days` figure build-decks ran with. The
//   app refuses to compare rows whose windows differ, because that comparison is the
//   exact mistake described above.
//
// Legend codes are interned into a shared array and each row's counts are positional
// against it, which is what keeps a year of daily rows to roughly 90KB rather than
// 365KB. Tier lists move weekly, so they are appended only when they actually change.

import { writeFile, readFile } from "node:fs/promises";

const url = (f) => new URL(`../data/${f}`, import.meta.url);
const readJson = async (f) => JSON.parse(await readFile(url(f), "utf8"));

// Two tier lists are the same list when every champion sits where it did. Compared as
// a sorted string so a reordered scrape does not read as a week of movement.
const tierKey = (rows) =>
  rows.map((r) => `${r.champion}|${r.epithet || ""}|${r.tier}`).sort().join("\n");

const main = async () => {
  const snap = await readJson("decks.json");
  if (!Array.isArray(snap.decks) || !snap.decks.length) throw new Error("no decks in data/decks.json");
  const today = snap.generatedAt;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today || "")) throw new Error(`decks.json has no usable generatedAt: ${today}`);

  let prior = { legends: [], days: [], weeks: [] };
  try {
    const on = await readJson("history.json");
    prior = { legends: on.legends || [], days: on.days || [], weeks: on.weeks || [] };
  } catch { /* first run */ }

  // Interned and append-only: a code's position is a permanent id, so old rows stay
  // readable when a new legend shows up. Never sort this array.
  const legends = prior.legends.slice();
  const index = new Map(legends.map((c, i) => [c, i]));
  const idOf = (code) => {
    if (!index.has(code)){ index.set(code, legends.length); legends.push(code); }
    return index.get(code);
  };

  const counts = new Map();
  let unidentified = 0;
  for (const d of snap.decks){
    if (!d.lg){ unidentified++; continue; }
    const i = idOf(d.lg);
    counts.set(i, (counts.get(i) || 0) + 1);
  }
  // Positional against `legends`, zero-filled, so the app can index straight in.
  const c = Array.from({ length: legends.length }, (_, i) => counts.get(i) || 0);

  const row = {
    d: today,
    n: snap.decks.length,
    w: (snap.window && snap.window.days) || null,
    u: unidentified,
    c,
  };

  // Idempotent by date: the workflow runs twice a day, and the evening pass should
  // correct the morning's row rather than sit beside it.
  const days = prior.days.filter((r) => r.d !== today);
  days.push(row);
  days.sort((a, b) => a.d.localeCompare(b.d));

  const weeks = prior.weeks.slice();
  let tierNote = "unchanged";
  try {
    const t = await readJson("tiers.json");
    if (Array.isArray(t.tiers) && t.tiers.length){
      const rows = t.tiers.map((r) => [r.champion, r.epithet || null, r.tier]);
      const last = weeks[weeks.length - 1];
      const same = last && tierKey(last.tiers.map(([champion, epithet, tier]) => ({ champion, epithet, tier })))
                         === tierKey(t.tiers);
      if (!same){
        // Same-day correction overwrites; a genuinely new list appends.
        if (last && last.d === today) weeks[weeks.length - 1] = { d: today, week: t.week ?? null, tiers: rows };
        else weeks.push({ d: today, week: t.week ?? null, tiers: rows });
        tierNote = last ? `changed, week ${last.week} -> ${t.week}` : `first list, week ${t.week}`;
      }
    }
  } catch { /* no tier list today; the deck row still stands */ }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "derived from data/decks.json and data/tiers.json by scripts/build-history.mjs",
    note: "Deck counts per legend printing, one row per day, positional against `legends`. " +
          "`w` is the window build-decks ran with; rows with different windows are not comparable " +
          "and the app refuses to compare them. Tier lists are appended only when they change.",
    legends,
    days,
    weeks,
  };
  await writeFile(url("history.json"), JSON.stringify(out) + "\n");

  const span = days.length > 1 ? `${days[0].d} to ${days[days.length - 1].d}` : days[0].d;
  console.log(`history: ${days.length} day${days.length === 1 ? "" : "s"} (${span}), ` +
              `${legends.length} legends seen, ${weeks.length} tier list${weeks.length === 1 ? "" : "s"} (${tierNote})`);
  console.log(`today: ${row.n} decks, window ${row.w}d, ${row.u} without an identifiable legend`);

  // The window is what makes rows comparable, so a change to it is worth saying out
  // loud: it silently truncates how far back the app is willing to look.
  const windows = new Set(days.map((r) => r.w));
  if (windows.size > 1)
    console.log(`WARNING: ${windows.size} different deck windows in the archive (${[...windows].join(", ")}d) — ` +
                `only rows sharing today's ${row.w}d window will be compared`);

  if (days.length < 8)
    console.log(`note: ${days.length} of the 8 days a week-on-week comparison needs; movement stays hidden until then`);
};

main().catch((e) => {
  console.error("\nbuild-history failed:", e.message);
  process.exit(1);
});
