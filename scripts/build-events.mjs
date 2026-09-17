#!/usr/bin/env node
// Regenerates data/events.json: the tournament archive, with player counts.
//
//   node scripts/build-events.mjs
//
// Source: riftbound.gg's tournament list (api.dotgg.gg/cgfw/gettournaments). No key
// and no auth.
//
// PAGINATION, added 2026-09-16. Upstream used to return its whole archive in one
// response. On 2026-09-11 it became a rolling window of 30 rows per page, which broke
// this builder silently: it still got 200 and still got 30 events, but they were the
// most recent three days of 8-to-40-player locals. data/events.json went from
// June-to-August with Dallas at 433 players to a 72-hour slice whose biggest event was
// 41, every deck's event stopped resolving, and every tournament deck lost its player
// count. `&page=N` walks back from there.
//
// ACCUMULATION, same change. Pagination reaches roughly 18 days in 30 pages, so even a
// full crawl no longer sees the majors this file used to carry. The archive is
// therefore append-only: rows already committed are kept, fetched rows are merged over
// them by slug, and nothing is ever dropped because upstream stopped serving it. That
// also makes the daily run cheap - it stops at the first page with nothing new on it.
//
// Be polite. The endpoint 429s after about ten rapid requests, so pages are spaced and
// a 429 backs off rather than failing the build.
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
const PAGE_CAP = 40;        // ~1,150 events; far past where the window runs dry
const PAGE_PAUSE = 1500;    // upstream 429s at roughly ten rapid requests
const RETRY_PAUSE = 45000;
const RETRIES = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const day = (unix) => {
  const n = Number(unix);
  return Number.isFinite(n) && n > 0 ? new Date(n * 1000).toISOString().slice(0, 10) : null;
};
const int = (v) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const main = async () => {
  // What is already committed. Upstream no longer serves this far back, so it is the
  // floor the crawl merges onto rather than something to be replaced.
  let kept = [];
  try {
    const prev = JSON.parse(await readFile(new URL("../data/events.json", import.meta.url), "utf8"));
    kept = Array.isArray(prev.events) ? prev.events : [];
  } catch { /* first run */ }
  const key = (e) => e.slug || `${e.name}|${e.dt}`;
  const have = new Set(kept.map(key));

  /* The workflow runs this twice: once as a source, and again after build-decks so the
     coverage figures see the new snapshot. That second pass used to be "cheap, one
     request" and pagination made it a second full crawl, back to back with build-decks
     hammering the same host — which is how both passes started 429ing each other.
     --coverage-only recomputes from the committed archive and touches the network not
     at all, which is what the second pass always meant to do. */
  if (process.argv.includes("--coverage-only")) {
    if (!kept.length) throw new Error("--coverage-only needs a committed data/events.json");
    console.log(`coverage-only: recomputing against ${kept.length} committed events, no fetch`);
    return finish(kept);
  }

  process.stdout.write("fetching tournaments… ");
  const raw = [];
  let page = 1, stop = "page cap";
  for (; page <= PAGE_CAP; page++) {
    let body = null;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      const r = await fetch(`${API}&page=${page}`, {
        headers: { "User-Agent": "rift.jayegger.com event builder", Origin: "https://riftbound.gg" },
      });
      if (r.status === 429) {
        if (attempt === RETRIES) throw new Error("429 after " + RETRIES + " backoffs");
        await sleep(RETRY_PAUSE);
        continue;
      }
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} on page ${page}`);
      const text = await r.text();
      if (!text.trim().startsWith("[")) throw new Error(`non-JSON payload on page ${page}`);
      body = JSON.parse(text);
      break;
    }
    if (!Array.isArray(body)) throw new Error("unexpected payload shape");
    if (!body.length) { stop = `page ${page} empty`; break; }
    raw.push(...body);
    // Stop at the first page that tells us nothing we did not already have, from this
    // crawl or from the committed file. That is what keeps the daily run to one page.
    const fresh = body.filter((e) => {
      const k = e.slug || `${e.name}|${day(e.date)}`;
      return !have.has(k);
    }).length;
    for (const e of body) have.add(e.slug || `${e.name}|${day(e.date)}`);
    if (!fresh) { stop = `page ${page} had nothing new`; break; }
    if (page < PAGE_CAP) await sleep(PAGE_PAUSE);
  }
  console.log(`${raw.length} rows over ${Math.min(page, PAGE_CAP)} page(s) — stopped: ${stop}`);

  const fetched = raw
    .map((e) => ({
      name: e.name || null,
      dt: day(e.date),
      players: int(e.players_count),
      format: e.format || null,
      winner: e.winner_name || null,
      country: e.winner_country || null,
      slug: e.slug || null,
    }))
    .filter((e) => e.name && e.dt);

  // Merge: fetched rows win on a key collision (player counts get revised upward as
  // an event is reported), committed rows survive when upstream no longer serves them.
  const merged = new Map(kept.map((e) => [key(e), e]));
  let added = 0, revised = 0;
  for (const e of fetched) {
    const k = key(e);
    if (!merged.has(k)) added++;
    else if (JSON.stringify(merged.get(k)) !== JSON.stringify(e)) revised++;
    merged.set(k, e);
  }
  const events = [...merged.values()].sort((a, b) => b.dt.localeCompare(a.dt));
  console.log(`archive: ${kept.length} kept + ${added} new (${revised} revised) = ${events.length}`);

  return finish(events);
};

// Everything downstream of having an events list: coverage against the deck snapshot,
// the file, and the report. Shared by the crawling path and --coverage-only.
const finish = async (events) => {
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

    /* ── the blind spot ────────────────────────────────────────────────────────
       unresolvedDeckEvents only ever looked at `ev`, the event upstream vouches for,
       and every one of those resolves by construction — so it wrote [] and read as a
       clean bill of health. The decks that name an event nobody here has heard of use
       `ce`, the claim, and there are 25 of those against 30 registry rows with zero
       overlap: the registry is Pittsburgh, Dallas and the CCS rooms, the claims are
       Guangzhou, Utrecht, Barcelona and Sydney. Counting them here is the difference
       between a file that says it covers the scene and one that says which scene. */
    const claimedBy = new Map();
    const resolved = new Map();
    for (const d of snap.decks || []) if (d.ce) {
      claimedBy.set(d.ce, (claimedBy.get(d.ce) || 0) + 1);
      // build-decks resolves the claim, including across upstream's own prefix
      // inconsistency, so an exact-name test here would undercount what is actually known.
      if (d.cm) resolved.set(d.ce, d.cm);
    }
    const unmatchedClaims = [...claimedBy.keys()].filter((n) => !resolved.has(n));
    const claimsByRegion = {};
    for (const d of snap.decks || [])
      if (d.ce) claimsByRegion[d.rg || "unknown"] = (claimsByRegion[d.rg || "unknown"] || 0) + 1;
    const regions = {};
    for (const e of events) {
      const r = (snap.decks || []).find((d) => d.ev === e.name && d.rg)?.rg || "unknown";
      regions[r] = (regions[r] || 0) + 1;
    }

    coverage = {
      events: events.length,
      eventsWithDecks: matched.length,
      players,
      playersWithDecks: seen,
      unresolvedDeckEvents: [...named.keys()].filter((n) => !byName.has(n)),
      // Events named only by a deck's own title, which the registry does not carry.
      claimedEvents: claimedBy.size,
      claimedEventsUnmatched: unmatchedClaims.length,
      // Claimed name -> the archive row it turned out to be, where they differ.
      claimedEventAliases: Object.fromEntries([...resolved].filter(([c, r]) => c !== r)),
      claimedDecksByRegion: claimsByRegion,
      registryEventsByRegion: regions,
      unresolvedClaimEvents: unmatchedClaims.sort(),
      decksByEvent: Object.fromEntries([...named].sort((a, b) => b[1] - a[1])),
    };
  } catch { /* no snapshot yet; the file is still worth writing */ }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "api.dotgg.gg/cgfw/gettournaments (riftbound.gg), paginated and accumulated",
    note: "Player counts weight a deck's credibility. Coverage records how many events the deck snapshot actually has lists for, which is well short of all of them. Upstream's archive is North American and online only: claimedEvents counts events that decks name and this file has never heard of, and none of them have ever matched.",
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
    if (coverage.claimedEvents) {
      const reg = Object.entries(coverage.claimedDecksByRegion).sort((a, b) =>
        (b[0] === "North America") - (a[0] === "North America") || b[1] - a[1]);
      const claimDecks = reg.reduce((a, [, n]) => a + n, 0);
      console.log(`\n${coverage.claimedEventsUnmatched} of ${coverage.claimedEvents} events named ` +
                  `only by a deck's own title have no row here; the ${claimDecks} decks claiming them: ` +
                  reg.map(([k, n]) => `${k} ${n}`).join(", "));
      for (const n of coverage.unresolvedClaimEvents.slice(0, 8)) console.log(`  ${n}`);
      if (coverage.unresolvedClaimEvents.length > 8)
        console.log(`  …and ${coverage.unresolvedClaimEvents.length - 8} more`);
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
