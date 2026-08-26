#!/usr/bin/env node
// Regenerates data/events.json: the tournament archive, with player counts.
//
//   node scripts/build-events.mjs
//
// Source: riftbound.gg's tournament list (api.dotgg.gg/cgfw/gettournaments). No key
// and no auth, one request, no pagination.
//
// Why this exists separately from the deck snapshot. Deck entries already carry an
// event name and a finishing place, but nothing about how big the event was, so a
// 9-player local and a 433-player major weighed the same. This file supplies the
// size, and the join is by exact event name, which holds: every event named on a
// deck in the current snapshot matches a row here.
//
// It also measures how thin the tournament evidence actually is. The endpoint lists
// every event; the deck snapshot only has lists for some of them. Recording both
// lets the app say what its meta reading rests on instead of implying it rests on
// everything.

import { writeFile, readFile } from "node:fs/promises";

const API = "https://api.dotgg.gg/cgfw/gettournaments?game=riftbound";

const day = (unix) => {
  const n = Number(unix);
  return Number.isFinite(n) && n > 0 ? new Date(n * 1000).toISOString().slice(0, 10) : null;
};
const int = (v) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const main = async () => {
  process.stdout.write("fetching tournaments… ");
  const r = await fetch(API, {
    headers: { "User-Agent": "rift.jayegger.com event builder", Origin: "https://riftbound.gg" },
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const raw = await r.json();
  if (!Array.isArray(raw)) throw new Error("unexpected payload shape");
  console.log(`${raw.length} events`);

  const events = raw
    .map((e) => ({
      name: e.name || null,
      dt: day(e.date),
      players: int(e.players_count),
      format: e.format || null,
      winner: e.winner_name || null,
      country: e.winner_country || null,
      slug: e.slug || null,
    }))
    .filter((e) => e.name && e.dt)
    .sort((a, b) => b.dt.localeCompare(a.dt));

  // Cross-reference the deck snapshot, if there is one, so the report says plainly how
  // much of the tournament scene the meta reading can actually see.
  let coverage = null;
  try {
    const snap = JSON.parse(await readFile(new URL("../data/decks.json", import.meta.url), "utf8"));
    const named = new Map();
    for (const d of snap.decks || []) if (d.ev) named.set(d.ev, (named.get(d.ev) || 0) + 1);
    const byName = new Map(events.map((e) => [e.name, e]));
    const matched = [...named.keys()].filter((n) => byName.has(n));
    const players = events.reduce((a, e) => a + e.players, 0);
    const seen = events.filter((e) => named.has(e.name)).reduce((a, e) => a + e.players, 0);
    coverage = {
      events: events.length,
      eventsWithDecks: matched.length,
      players,
      playersWithDecks: seen,
      unresolvedDeckEvents: [...named.keys()].filter((n) => !byName.has(n)),
      decksByEvent: Object.fromEntries([...named].sort((a, b) => b[1] - a[1])),
    };
  } catch { /* no snapshot yet; the file is still worth writing */ }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "api.dotgg.gg/cgfw/gettournaments (riftbound.gg)",
    note: "Player counts weight a deck's credibility. Coverage records how many events the deck snapshot actually has lists for, which is well short of all of them.",
    coverage,
    events,
  };
  await writeFile(new URL("../data/events.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");

  const dts = events.map((e) => e.dt);
  console.log(`\n${events.length} events from ${dts[dts.length - 1]} to ${dts[0]}`);
  console.log("largest:");
  for (const e of events.slice().sort((a, b) => b.players - a.players).slice(0, 6))
    console.log(`  ${String(e.players).padStart(4)}p  ${e.dt}  ${e.name.slice(0, 62)}`);

  if (coverage) {
    const pct = coverage.players ? (coverage.playersWithDecks / coverage.players * 100).toFixed(0) : "0";
    console.log(`\ncoverage: the deck snapshot has lists for ${coverage.eventsWithDecks} of ` +
                `${coverage.events} events, ${coverage.playersWithDecks} of ${coverage.players} players (${pct}%)`);
    const absent = events.filter((e) => !(e.name in (coverage.decksByEvent || {})))
                         .sort((a, b) => b.players - a.players).slice(0, 5);
    if (absent.length) {
      console.log("biggest events with no lists at all:");
      for (const e of absent) console.log(`  ${String(e.players).padStart(4)}p  ${e.dt}  ${e.name.slice(0, 58)}`);
    }
    if (coverage.unresolvedDeckEvents.length) {
      // The join is by exact name. If it ever stops holding, the weighting silently
      // loses those decks, so say so rather than letting it pass.
      console.log(`\nWARNING: ${coverage.unresolvedDeckEvents.length} event names on decks match no event here:`);
      for (const n of coverage.unresolvedDeckEvents.slice(0, 8)) console.log(`  ${n}`);
    }
  }
};

main().catch((e) => {
  console.error("\nbuild-events failed:", e.message);
  process.exit(1);
});
