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
// - A posted Radiance list (counted as `brews`) is an unplaced list with a Radiance card in
//   it, posted since the set was revealed: the Find table's count of what is being tried.
//
// Each legend's net decks (lib/netdeck.mjs) are counted from its good finishes, this format
// and the last apart; where a format has none, its posted lists make the crowd's list,
// labelled as such. Counted, not chosen: every row says how many lists it came from. The
// deck feed carries no sideboards, so a count is main deck, runes and battlefields only.
//
// Claude's hand-written builds (builds/) and the one-blend consensus were retired on
// 23 Oct 2026: the builds were written against counts that turned out to be wrong, and a
// blend of every finish, good or not, describes no deck anyone played.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";
import { finishesMaker, riotRows } from "../lib/placing.mjs";
import { netdeckMaker } from "../lib/netdeck.mjs";

const ERA_SET = "RAD";
const LAST_SET = { set: "VEN", name: "Vendetta" };   // the format before it, for net decks
const ERA_NAME = "Radiance";
const ERA_FROM = "2026-10-09";   // Radiance revealed in full (Riot's errata and rules, 9 Oct)
const ERA_LEGAL = "2026-10-23";  // Radiance's release, TR §601.3.c.6.a. Kept here, not read from
                                 // lib/decks.mjs, whose entry is deleted once the set is legal
const ERA_SHARE = 0.3;
const MIN_PLACED = 3;
const BEFORE_DAYS = 60;          // the Vendetta baseline a legend's changes are read against
const LISTS_KEPT = 6;

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const round = (x) => Math.round(x * 100) / 100;

const main = async () => {
  const [cat, extras, banned, snap, topdecks] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("topdecks.json").catch(() => null)]);
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

  const { tally } = counter(idx, card);

  /* ── good finishes, by format ─────────────────────────────────────────────
     Every legend's good finishes (lib/placing.mjs goodFinishes, Riot's Top 8 and Best Of
     lists included), split by format and never mixed: this one's, and the last one's — still
     legal, and for most legends all the evidence there is today. A list with a Radiance card
     — the legend included — is a Radiance list whatever its event: a claim carries no event
     to classify it by, and "Riven wins NovaRiftbound's Showdown 5" had filed a Radiance
     legend under Vendetta. Claims before the legal date are previews, like their events. */
  const byName = new Map();
  for (const c of idx.cards) if (!c.v && !byName.has(c.n)) byName.set(c.n, c);
  const riot = topdecks ? riotRows(topdecks, snap, card, byName).filter((d) => card(d.lg)) : [];
  const legal = [...decks, ...riot].filter((d) => !bannedNow(d));
  const { goodFinishes } = finishesMaker(idx, card);
  const good = goodFinishes(legal), goodSlugs = new Set(good.map((d) => d.s));
  const isNow = (d) => eraEvents.has(d.ev) || Object.keys(d.cards).some(isEra);
  const preRelease = new Map(events.map((e) => [e.name, e.preRelease]));
  const preview = (d) => (d.ev && preRelease.has(d.ev) ? preRelease.get(d.ev) : d.dt < ERA_LEGAL);
  const goodOf = (name, f) => good.filter((d) => legendOf(d) === name && (f === "now") === isNow(d));

  /* ── net decks, and the crowd's list where there are none ──────────────────
     lib/netdeck.mjs: good finishes split into the decks they are, counted and judged. Where a
     format has no counted net deck for a legend, its posted lists (no good finish among them)
     are counted the same way as the crowd's list — labelled as what people post, not what
     wins. Every legend with a list gets an entry. */
  const { netdecks, crowdDecks } = netdeckMaker(idx, card);
  const netByLegend = {};
  for (const name of [...new Set(legal.map(legendOf))].filter(Boolean).sort()) {
    const posted = legal.filter((d) => legendOf(d) === name && !goodSlugs.has(d.s) && !d.tour);
    const entry = {};
    for (const f of ["now", "last"]) {
      const groups = netdecks(goodOf(name, f), f === "now" ? { preview } : {});
      const counted = groups.some((g) => g.count && !g.avoid.length);
      entry[f] = counted ? groups : [...groups, ...crowdDecks(posted.filter((d) => (f === "now") === isNow(d)))];
    }
    if (entry.now.length || entry.last.length) netByLegend[name] = entry;
  }

  /* ── per legend: the Radiance-format record ──────────────────────────────── */
  const names = [...new Set([...placed, ...brews].map(legendOf))];
  const legends = [];
  for (const name of names) {
    const P = placed.filter((d) => legendOf(d) === name).sort((a, b) => a.pl / (a.ec || 999) - b.pl / (b.ec || 999));
    const B = brews.filter((d) => legendOf(d) === name).sort((a, b) => b.vw - a.vw);
    const V = before.filter((d) => legendOf(d) === name);
    const L = card(P[0]?.lg || B[0].lg);
    const prints = idx.byId.get(idx.identity(L)) || [L];
    // What moved: the share of good finishes playing each card, this format against the last.
    const GN = goodOf(name, "now"), GL = goodOf(name, "last");
    let changes = null;
    if (GN.length >= MIN_PLACED && GL.length >= MIN_PLACED) {
      const now = tally(GN), was = tally(GL);
      const inc = (t, id, n) => (t.get(id)?.lists || 0) / n;
      const rows = [...new Set([...now.keys(), ...was.keys()])].map((id) => ({ x: now.get(id) || was.get(id), a: inc(now, id, GN.length), b: inc(was, id, GL.length) }))
        .filter((r) => r.x.type !== "Rune");
      changes = {
        vs: GL.length, now: GN.length,
        added: rows.filter((r) => r.a >= 0.4 && r.b <= 0.15).sort((p, q) => q.a - p.a).slice(0, 10)
          .map((r) => ({ code: r.x.code, name: r.x.name, now: round(r.a), before: round(r.b), radiance: card(r.x.code)?.s === ERA_SET })),
        dropped: rows.filter((r) => r.b >= 0.5 && r.a <= 0.15).sort((p, q) => q.b - p.b).slice(0, 10)
          .map((r) => ({ code: r.x.code, name: r.x.name, now: round(r.a), before: round(r.b) })),
      };
    }
    // Every card's share of the format's good finishes (or, short of MIN_PLACED, its posted
    // Radiance lists), by name — what the tweak bench draws its bars from.
    const from = GN.length >= MIN_PLACED ? GN : B;
    const shares = {};
    if (from.length) for (const x of tally(from).values()) if (x.type !== "Legend") shares[x.name] = round(x.lists / from.length);
    const runesIn = (cards) => Object.entries(cards).reduce((a, [code, q]) => a + (card(code)?.t === "Rune" ? q : 0), 0);
    const trim = (d) => ({ s: d.s, h: d.h, ev: d.ev || null, pl: d.pl ?? null, players: d.ec || null, dt: d.dt, vw: d.vw, cards: d.cards, runes: runesIn(d.cards) });
    legends.push({
      name, champion: idx.championOf(L), code: L.c, domains: L.d || [],
      isNew: prints.every((c) => c.s === ERA_SET),
      placed: P.length, top8: P.filter((d) => d.pl <= 8).length,
      best: P[0] ? { pl: P[0].pl, players: P[0].ec || null, ev: P[0].ev } : null,
      finishes: P.slice(0, 12).map((d) => [d.pl, d.ec || null, d.ev]),
      brews: B.length, before: V.length, changes, shares, sharesFrom: from === GN ? "good" : "posted",
      lists: [...P.slice(0, LISTS_KEPT), ...B.slice(0, P.length >= MIN_PLACED ? 0 : 3)].map((d) => ({ ...trim(d), brew: !d.tour })),
    });
  }
  // Results first, then posted lists; within each, more placed lists and better finishes first.
  const finish = (l) => (l.best ? l.best.pl / (l.best.players || 999) : 9);
  legends.sort((a, b) => b.top8 - a.top8 || b.placed - a.placed || finish(a) - finish(b) || b.brews - a.brews || a.name.localeCompare(b.name));

  // The nine new legends, including any with no lists at all: "no evidence yet" is an
  // answer the page should give rather than leave out.
  const newLegends = idx.cards.filter((c) => c.t === "Legend" && c.s === ERA_SET && !c.v)
    .map((c) => ({ name: idx.legendName(c), code: c.c, domains: c.d || [] }));

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "data/decks.json, read against data/cards.json and data/banned.json",
    note: "Counts, not opinions: each net deck row says how many of its lists play it. Main deck, runes and battlefields only — the deck feed carries no sideboards. A 'crowd' group is counted from posted lists, not results.",
    era: { set: ERA_SET, from: ERA_FROM, legalFrom: ERA_LEGAL, allPreRelease: events.length > 0 && events.every((e) => e.preRelease), rule: `an event counts as Radiance-format when ${ERA_SHARE * 100}% or more of its lists here play a Radiance card`, events, placed: placed.length, brews: brews.length, before: before.length, beforeFrom, skippedBanned: skipped.banned },
    newLegends,
    legends,
    formats: { now: { set: ERA_SET, name: ERA_NAME }, last: LAST_SET },
    netdecks: netByLegend,
  };
  await writeFile(new URL("../data/ideas.json", import.meta.url), JSON.stringify(out) + "\n");

  console.log(`Radiance-format events: ${events.length}`);
  for (const e of events) console.log(`  ${e.date}  ${String(e.players ?? "?").padStart(4)} players  ${e.lists} lists (${e.radLists} with RAD)  ${e.name}`);
  console.log(`placed ${placed.length} · brews ${brews.length} · Vendetta baseline ${before.length} since ${beforeFrom}${skipped.banned ? ` · ${skipped.banned} older lists skipped for cards banned since` : ""}`);
  const nd = Object.values(netByLegend).flatMap((x) => [...x.now.map((g) => ({ ...g, f: "now" })), ...x.last.map((g) => ({ ...g, f: "last" }))]);
  const byStatus = (f) => ["net", "early", "single", "crowd"].map((s) => `${nd.filter((g) => g.f === f && g.status === s && !g.avoid.length).length} ${s}`).join(", ");
  console.log(`\nnet decks over ${Object.keys(netByLegend).length} legends · ${ERA_NAME}: ${byStatus("now")} · ${LAST_SET.name}: ${byStatus("last")} · ${nd.filter((g) => g.avoid.length).length} never-play groups kept for the field`);
  if (!events.length) console.log("\nNOTE: no Radiance-format event in the snapshot.");
};

main().catch((e) => { console.error(`build-ideas: ${e.message}`); process.exit(1); });
