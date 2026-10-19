#!/usr/bin/env node
// Regenerates data/ideas.json: what each legend is playing in the Radiance era, and the
// list the evidence converges on. Fetches nothing — it reads data/decks.json, the
// catalog and the ban list, so it runs after build-decks in the daily refresh.
//
//   node scripts/build-ideas.mjs
//
// Radiance changes every legend, not just the nine it introduced, so "the era" is
// defined by format rather than by legend:
//
// - A Radiance-format event is one where at least ERA_SHARE of the lists the snapshot
//   holds for it play a Radiance card. Online events ran Radiance before its paper
//   release (Haven's "Radiance Preview", NovaRiftbound's Showdown #5); every Vendetta
//   event in October has none at all, so the split is not a judgement call today. Every
//   placed list from such an event counts, whichever legend and whether or not it
//   plays a Radiance card itself.
// - A brew is an unplaced list with a Radiance card in it, posted since the set was
//   revealed. Weaker evidence, used only when a legend has fewer than MIN_PLACED placed
//   lists, and always labelled as such.
//
// The consensus is counted, not chosen: how many lists run each card and in how many
// copies. Nothing here is invented — a legend with no evidence gets no list, and every
// row says how many lists it came from. Sideboards are not in the deck feed, so a
// consensus is main deck, runes and battlefields only.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { indexCatalog, deckStats, deckChecks } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";

const ERA_SET = "RAD";
const ERA_FROM = "2026-10-09";   // Radiance revealed in full (Riot's errata and rules, 9 Oct)
const ERA_LEGAL = "2026-10-23";  // Radiance's release, TR §601.3.c.6.a. Kept here, not read from
                                 // lib/decks.mjs, whose entry is deleted once the set is legal
const ERA_SHARE = 0.3;
const MIN_PLACED = 3;
const DRIFT = 0.2;               // a card's share moving this much since a build was written
const BEFORE_DAYS = 60;          // the Vendetta baseline a legend's changes are read against
const LISTS_KEPT = 6;

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x) => Math.round(x * 100) / 100;

const main = async () => {
  const [cat, extras, banned, snap] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json")]);
  const known = new Set(cat.cards.map((c) => c.c));
  const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
  // The feed cites "OGN-042" for "OGN-042/298"; resolve both.
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const isEra = (code) => card(code)?.s === ERA_SET || String(code).startsWith(`${ERA_SET}-`);

  // Banned cards make a list illegal now, whatever it did then; such lists are skipped.
  const bannedNow = (d) => Object.keys(d.cards).some((code) => idx.bannedNames.has(card(code)?.n));
  const decks = snap.decks.filter((d) => d.lg && card(d.lg));
  const legendOf = (d) => idx.legendName(card(d.lg));

  /* ── which events were Radiance-format ─────────────────────────────────── */
  const byEvent = new Map();
  for (const d of decks) if (d.tour && d.ev) (byEvent.get(d.ev) || byEvent.set(d.ev, []).get(d.ev)).push(d);
  const events = [];
  for (const [name, ls] of byEvent) {
    const rad = ls.filter((d) => Object.keys(d.cards).some(isEra)).length;
    if (rad / ls.length >= ERA_SHARE)
      events.push({ name, players: ls[0].ec || null, lists: ls.length, radLists: rad, date: ls.map((d) => d.dt).sort()[0] });
  // Played before the set was legal: unsanctioned, online, on a platform that had the
  // cards early. Real games, not the results of the format — the pages say which.
  // (The date is when the lists were posted, the nearest thing the feed has.)
  for (const e of events) e.preRelease = e.date < ERA_LEGAL;
  }
  events.sort((a, b) => b.date.localeCompare(a.date) || (b.players || 0) - (a.players || 0));
  const eraEvents = new Set(events.map((e) => e.name));
  const firstEra = events.map((e) => e.date).sort()[0] || ERA_FROM;
  const beforeFrom = new Date(Date.parse(firstEra) - BEFORE_DAYS * 86400000).toISOString().slice(0, 10);

  const skipped = { banned: 0 };
  const keep = (d) => { if (bannedNow(d)) { skipped.banned++; return false; } return true; };
  const placed = decks.filter((d) => d.tour && eraEvents.has(d.ev) && d.pl != null).filter(keep);
  const brews = decks.filter((d) => !d.tour && d.dt >= ERA_FROM && Object.keys(d.cards).some(isEra)).filter(keep);
  const before = decks.filter((d) => d.tour && d.ev && !eraEvents.has(d.ev) && d.pl != null && d.dt >= beforeFrom && d.dt < firstEra).filter(keep);

  const { tally, consensus } = counter(idx, card);

  /* ── per legend ────────────────────────────────────────────────────────── */
  const names = [...new Set([...placed, ...brews].map(legendOf))];
  const legends = [];
  for (const name of names) {
    const P = placed.filter((d) => legendOf(d) === name).sort((a, b) => a.pl / (a.ec || 999) - b.pl / (b.ec || 999));
    const B = brews.filter((d) => legendOf(d) === name).sort((a, b) => b.vw - a.vw);
    const V = before.filter((d) => legendOf(d) === name);
    const L = card(P[0]?.lg || B[0].lg);
    const prints = idx.byId.get(idx.identity(L)) || [L];
    const basis = P.length >= MIN_PLACED ? "placed" : B.length >= MIN_PLACED ? "brews" : "none";
    const con = basis === "placed" ? consensus(P) : basis === "brews" ? consensus(B) : null;

    // What moved against the same legend's placed Vendetta lists.
    let changes = null;
    if (con && V.length >= MIN_PLACED) {
      const now = tally(basis === "placed" ? P : B), was = tally(V);
      const nN = basis === "placed" ? P.length : B.length, nV = V.length;
      const inc = (t, id, n) => (t.get(id)?.lists || 0) / n;
      const ids = new Set([...now.keys(), ...was.keys()]);
      const rows = [...ids].map((id) => ({ id, x: now.get(id) || was.get(id), a: inc(now, id, nN), b: inc(was, id, nV) }))
        .filter((r) => r.x.type !== "Rune");
      changes = {
        vs: nV, since: beforeFrom,
        added: rows.filter((r) => r.a >= 0.4 && r.b <= 0.15).sort((p, q) => q.a - p.a).slice(0, 10)
          .map((r) => ({ code: r.x.code, name: r.x.name, now: round(r.a), before: round(r.b), radiance: card(r.x.code)?.s === ERA_SET })),
        dropped: rows.filter((r) => r.b >= 0.5 && r.a <= 0.15).sort((p, q) => q.b - p.b).slice(0, 10)
          .map((r) => ({ code: r.x.code, name: r.x.name, now: round(r.a), before: round(r.b) })),
      };
    }
    // How much of a list's main deck the consensus shares, by card name and copies. A
    // legend can run two different decks (Kennen at Haven: an Order Illaoi build won,
    // most of the field ran Chaos), and a consensus blends them; this says which lists
    // it actually describes.
    const mainNames = (cards) => {
      const m = new Map();
      for (const [code, q] of Object.entries(cards)) { const c = card(code); if (c && !["Legend", "Rune", "Battlefield"].includes(c.t)) m.set(c.n, (m.get(c.n) || 0) + q); }
      return m;
    };
    const conMain = con ? mainNames(con.cards) : null;
    const overlap = (cards) => {
      if (!conMain) return null;
      const m = mainNames(cards); let shared = 0, total = 0;
      for (const [n, q] of m) { total += q; shared += Math.min(q, conMain.get(n) || 0); }
      return total ? round(shared / Math.max(total, 40)) : null;
    };
    const runesIn = (cards) => Object.entries(cards).reduce((a, [code, q]) => a + (card(code)?.t === "Rune" ? q : 0), 0);
    const trim = (d) => ({ s: d.s, h: d.h, ev: d.ev || null, pl: d.pl ?? null, players: d.ec || null, dt: d.dt, vw: d.vw, cards: d.cards, overlap: overlap(d.cards), runes: runesIn(d.cards) });
    const from = basis === "placed" ? P : basis === "brews" ? B : [];
    // Every card's share of those lists, by name — what the tweak bench draws its bars from.
    const shares = {};
    if (from.length) for (const x of tally(from).values()) if (x.type !== "Legend") shares[x.name] = round(x.lists / from.length);
    const close = con ? from.filter((d) => overlap(d.cards) >= 0.7).length : 0;
    const noRunes = from.filter((d) => !runesIn(d.cards)).length;
    legends.push({
      name, champion: idx.championOf(L), code: L.c, domains: L.d || [],
      isNew: prints.every((c) => c.s === ERA_SET),
      placed: P.length, top8: P.filter((d) => d.pl <= 8).length,
      best: P[0] ? { pl: P[0].pl, players: P[0].ec || null, ev: P[0].ev } : null,
      finishes: P.slice(0, 12).map((d) => [d.pl, d.ec || null, d.ev]),
      brews: B.length, before: V.length, basis, consensus: con, changes,
      // Lists within 70% of the consensus, and lists the feed carries without a rune deck.
      close, noRunes, shares,
      lists: [...P.slice(0, LISTS_KEPT), ...B.slice(0, basis === "placed" ? 0 : 3)].map((d) => ({ ...trim(d), brew: !d.tour })),
    });
  }
  // Results first, then brews; within each, more placed lists and better finishes first.
  const finish = (l) => (l.best ? l.best.pl / (l.best.players || 999) : 9);
  legends.sort((a, b) => b.top8 - a.top8 || b.placed - a.placed || finish(a) - finish(b) || b.brews - a.brews || a.name.localeCompare(b.name));

  // The nine new legends, including any with no lists at all: "no evidence yet" is an
  // answer the page should give rather than leave out.
  const newLegends = idx.cards.filter((c) => c.t === "Legend" && c.s === ERA_SET && !c.v)
    .map((c) => ({ name: idx.legendName(c), code: c.c, domains: c.d || [] }));

  /* ── Claude's builds ─────────────────────────────────────────────────────
     Hand-written, one JSON file each in builds/. They are carried into ideas.json so
     the site makes one request, and checked on the way: a build that breaks a deck
     rule, names a legend that is not its list's, or is missing a field fails the
     build rather than reaching the page. */
  const builds = [];
  const NEED = ["id", "legend", "date", "title", "summary", "basis", "plan", "cards"];
  for (const f of (await readdir(new URL("../builds/", import.meta.url)).catch(() => [])).filter((f) => f.endsWith(".json")).sort()) {
    const b = JSON.parse(await readFile(new URL(`../builds/${f}`, import.meta.url), "utf8"));
    const missing = NEED.filter((k) => b[k] == null);
    if (missing.length) throw new Error(`builds/${f}: missing ${missing.join(", ")}`);
    const cards = Object.fromEntries(Object.entries(b.cards).map(([k, n]) => [card(k)?.c || k, n]));
    const sb = Object.fromEntries(Object.entries(b.sb || {}).map(([k, n]) => [card(k)?.c || k, n]));
    const deck = { id: b.id, name: b.title, cards, sb };
    const broken = deckChecks(deck, idx, deckStats(deck, idx, {})).filter((k) => k.ok === false);
    if (broken.length) throw new Error(`builds/${f}: breaks ${broken.map((k) => `${k.label} (${k.val})`).join(", ")}`);
    const L = deckStats(deck, idx, {}).legend;
    if (!L || idx.legendName(L) !== b.legend) throw new Error(`builds/${f}: legend "${b.legend}" is not the list's (${L ? idx.legendName(L) : "none"})`);
    // Has the field moved since the build was written? The build file records what it
    // was made against (events, list count, card shares); today's counts are compared to
    // that. New events, or a card whose share moved by DRIFT or more, mark it out of date —
    // a prompt to revise it, not a change made to it.
    const now = legends.find((l) => l.name === b.legend);
    if (b.snapshot && now) {
      const was = b.snapshot, newEvents = events.filter((e) => !was.events.includes(e.name));
      const names = new Set([...Object.keys(was.shares || {}), ...Object.keys(now.shares || {})]);
      const moved = [...names].map((n) => ({ name: n, was: was.shares?.[n] || 0, now: now.shares?.[n] || 0 }))
        .filter((r) => Math.abs(r.now - r.was) >= DRIFT).sort((x, y) => Math.abs(y.now - y.was) - Math.abs(x.now - x.was)).slice(0, 10)
        .map((r) => ({ ...r, inBuild: Object.keys(cards).some((k) => card(k)?.n === r.name) }));
      b.drift = { stale: newEvents.length > 0 || moved.length > 0, since: was.date, listsThen: was.placed, listsNow: now.placed,
        newEvents: newEvents.map((e) => ({ name: e.name, players: e.players, date: e.date, preRelease: e.preRelease })), moved };
    } else b.drift = null;
    builds.push(b);
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "data/decks.json, read against data/cards.json and data/banned.json",
    note: "Counts, not opinions: each consensus row says how many of the lists play it. Main deck, runes and battlefields only — the deck feed carries no sideboards. Basis 'brews' means fewer than 3 placed lists and the count is of unplaced lists instead.",
    era: { set: ERA_SET, from: ERA_FROM, legalFrom: ERA_LEGAL, allPreRelease: events.length > 0 && events.every((e) => e.preRelease), rule: `an event counts as Radiance-format when ${ERA_SHARE * 100}% or more of its lists here play a Radiance card`, events, placed: placed.length, brews: brews.length, before: before.length, beforeFrom, skippedBanned: skipped.banned },
    newLegends,
    legends,
    builds,
  };
  await writeFile(new URL("../data/ideas.json", import.meta.url), JSON.stringify(out) + "\n");

  console.log(`Radiance-format events: ${events.length}`);
  for (const e of events) console.log(`  ${e.date}  ${String(e.players ?? "?").padStart(4)} players  ${e.lists} lists (${e.radLists} with RAD)  ${e.name}`);
  console.log(`placed ${placed.length} · brews ${brews.length} · Vendetta baseline ${before.length} since ${beforeFrom}${skipped.banned ? ` · ${skipped.banned} older lists skipped for cards banned since` : ""}`);
  console.log(`\n${legends.length} legends · ${legends.filter((l) => l.basis === "placed").length} with a placed consensus, ${legends.filter((l) => l.basis === "brews").length} from brews`);
  for (const l of legends.slice(0, 14))
    console.log(`  ${l.name.padEnd(34)} ${l.isNew ? "NEW" : "   "} placed ${String(l.placed).padStart(2)} · top8 ${l.top8} · best ${l.best ? `#${l.best.pl}/${l.best.players ?? "?"}` : "—"} · brews ${String(l.brews).padStart(3)} · ${l.basis}${l.consensus?.checks.filter((k) => k.ok === false).length ? " · CONSENSUS BREAKS A RULE" : ""}`);
  console.log(`\n${builds.length} Claude build${builds.length === 1 ? "" : "s"}: ${builds.map((b) => b.title).join(" · ") || "none"}`);
  if (!events.length) console.log("\nNOTE: no Radiance-format event in the snapshot. Consensus comes from brews only.");
};

main().catch((e) => { console.error(`build-ideas: ${e.message}`); process.exit(1); });
