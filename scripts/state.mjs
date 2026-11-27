#!/usr/bin/env node
// Reads the live collection/deck state and answers questions about it from the
// command line, so a shell session (or Claude Code) never has to open the app.
//
//   node scripts/state.mjs                 # one-screen summary
//   node scripts/state.mjs deck            # every saved deck, cards vs. still-to-get
//   node scripts/state.mjs deck sivir      # one deck, main + sideboard, per-card
//   node scripts/state.mjs card body rune  # every catalog card matching the words, with owned/want/trade
//   node scripts/state.mjs want            # outstanding wants (want > owned), with gap $
//   node scripts/state.mjs trade           # copies flagged for trade
//   node scripts/state.mjs sets            # base-set completion
//   node scripts/state.mjs raw             # the raw state JSON, pretty-printed
//   node scripts/state.mjs versus kennen --deck "nexus night"   # head to head, card by card
//   node scripts/state.mjs try --deck "nexus night" "-Edge of Night" "+Elnuk Herd"   # test a change
//   node scripts/state.mjs loops --deck "nexus night"   # every interaction and loop, from card text
//   node scripts/state.mjs close --score 6-5 --hold A --a "Stalwart Poro" --cz "Sivir, Mercenary" --runes "4 Chaos, 2 Body"   # can this board win this turn?
//   node scripts/state.mjs fight --attack "Astral Heron" --defend "Staunch Survivor, Traveling Merchant" --down Switcheroo --their Discipline --their-budget 2/0
//   node scripts/state.mjs meta            # archetype shares over sanctioned-legal lists
//   node scripts/state.mjs meta diana      # one archetype: card play rates, best finishes
//   node scripts/state.mjs meta leblanc --since 2026-09-15   # only lists played after a date
//   node scripts/state.mjs bans "Card A" "Card B"   # what a ban takes: your decks, then every archetype
//   node scripts/state.mjs bans                     # the same, for the announced bans in banned.json
//   node scripts/state.mjs event 660038    # a store event from Riot's locator: standings + legends
//   node scripts/state.mjs intake riven    # after scanning new cards: what landed, the kit checked, where to file it
//
// Where the data comes from. The app keeps everything personal — owned counts,
// decks, wants, tags, settings — in localStorage under `rb_state`, and mirrors it
// to a public Supabase row on every change. That row is this script's source:
// same URL and publishable key the app ships with (index.html, the SUPA_* consts),
// readable with no login. Catalog facts (names, types, prices, set sizes) come
// from data/cards.json + data/extras.json, already on disk.
//
//   RIFT_STATE=path/to/state.json node scripts/state.mjs …   # offline: read a saved copy instead
//
// The shape: state.inv is code -> { n, f, w, t } — normal owned, foil owned,
// want, for-trade. owned = n + f. A deck is { id, name, cards: {code: qty},
// sb: {code: qty} }, where `sb` is the sideboard and is absent on decks that have
// none. "still to get" for a deck is the app's own math: sum of max(0, qty - owned),
// counted over both halves — owned copies go to the main deck first, because at
// registration the sideboard is physically separate cards and cannot share them.
//
// Sideboard rules, Tournament Rules §601.1.c: at most 10 cards (a ceiling, not a
// fixed size; it was 8 before the 2026-07-24 update), main-deck card types only,
// and the 3-copies-of-a-name limit spans main deck and sideboard together. Runes
// are exempt from that limit. This script reports all three, because a deck read
// here without them looks legal when it is not.

import { readFile, writeFile } from "node:fs/promises";
import { realAfter, rWithNoise } from "../lib/realfit.mjs";
import { PRE_RIFT_KITS, PRE_RIFT_PROMO } from "../lib/kits.mjs";
import { indexCatalog, deckStats as libDeckStats, deckChecks, journalRecord, deckText, parseDeckText, SB_MAX } from "../lib/decks.mjs";
import { basename } from "node:path";
import { pathToFileURL } from "node:url";
import { versus, weigh, effectsOf, looksInteractive, unreadSentences, withGear } from "../lib/versus.mjs";
import { parseChanges, applyChanges, shapeOf, answerNames, fieldOf, engineReport, SCENARIOS, scoreTiers, foesOf, blindSpots } from "../lib/decklab.mjs";
import { matchReportPar, closeReportPar, matchRecordsPar } from "../lib/match-pool.mjs";
import { halving } from "../lib/search.mjs";
import { POLICY_SOLVE, matchPlayers, matchGame } from "../lib/match.mjs";
import { calibrationSet, topLists, realRow, pairsSince, riftliteLists, riftatlasRows, pearson, spearman, mae, modelTable, rInterval, lifts, medoid, pickSwaps } from "../lib/calibrate.mjs";
import { mainOf, changed } from "../lib/decks.mjs";
import { isRecord, isGoodPlacing } from "../lib/placing.mjs";
import { paired, wilson, twoRates } from "../lib/stats.mjs";

// The S/A field's lists as opponents for lib/match.mjs, in a fixed shuffled order, so a before
// and an after play the same opponents in the same order (paired games).
function foeLists(fieldDecks) {
  const out = fieldDecks.flatMap((f) => f.lists.map((d) => ({ label: f.label.replace(/ \([SA]\)$/, "").split(",")[0], cards: d.cards })));
  const r = rng(5); for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
function printPoints(pb, pa, games, policy = "solver") {
  const n2 = (x) => (x == null ? "—" : x.toFixed(2)), pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`);
  console.log(`\n  POINTS (lib/match.mjs: ${games} model games against real S/A lists, the same games before and after)`);
  const rows = [["our points by turn 8", "points8", n2], ["their points by turn 8", "theirPoints8", n2], ["  ours from holds / conquers", null],
    ["holds a game", "holds", n2], ["conquers a game", "conquers", n2], ["their holds stopped (taken, traded, cleared)", "stops", n2],
    ["Evelynn's points a game", "eve", n2], ["eighth point gated (drew instead)", "gated", n2], ["their holds a game", "theirHolds", n2],
    ["our holds they stopped", "theirStops", n2], ...(policy === "greedy" ? [["Mercenary on (turns 4+)", "merc", pc]] : [])];
  for (const [label, key, f] of rows) { if (!key) continue; const b = f(pb[key]), a = f(pa[key]); console.log(`  ${label.padEnd(46)}${(b === a ? b : `${b} → ${a}`).padEnd(22)}`); }
  // Is the change bigger than the games' noise? Same games before and after, so per-game differences (paired).
  const sg = (x) => `${x >= 0 ? "+" : ""}${x.toFixed(2)}`;
  const verdict = (d) => (d.n ? `${sg(d.mean)} (95%: ${sg(d.lo)} to ${sg(d.hi)})${d.noise ? ", within noise" : ""}` : "—");
  console.log(`  ${"after − before, our points by turn 8".padEnd(46)}${verdict(paired(pa.pts, pb.pts))}`);
  console.log(`  ${"after − before, margin by turn 8".padEnd(46)}${verdict(paired(pa.diff, pb.diff))}`);
  const wr = (r) => { const k = r.win.filter((x) => x === 1).length, n = r.win.filter((x) => x != null).length, w = wilson(k, n);
    return n ? `${pc(w.p)} (${pc(w.lo)}–${pc(w.hi)})` : "—"; };
  console.log(`  ${"won (8 points first; timeouts apart)".padEnd(46)}${wr(pb)} → ${wr(pa)}; win − loss after − before ${verdict(paired(pa.win, pb.win))}`);
  console.log(`  ${"timeouts (no one at 8 by turn 12)".padEnd(46)}${pb.timeouts} → ${pa.timeouts} of ${pb.games}`);
  for (const [lbl, r] of [["before", pb], ["after", pa]]) if (r.solveErrors?.some((n) => n)) console.log(`  SOLVER ERRORS (${lbl}): ${r.solveErrors[0]} of our Main Phases and ${r.solveErrors[1]} of theirs were skipped because the solver threw; these numbers are wrong until that's fixed`);
  console.log("  How far model games track real results: docs/model-calibration.md (24 Nov: r 0.11 over 20 legends, interval -0.35 to 0.52; a ranking inside the model, not evidence a swap wins real games).");
  console.log(policy === "greedy"
    ? "  Model games, both sides on the greedy policy (--greedy); card text beyond its readers is not played, which favours unit-heavy decks. Points and how they're made, not win rates."
    : "  Model games, both sides' Main Phases played by the turn solver (lib/turn.mjs, every card's text, a small search a turn); not comparable with the greedy numbers from before 24 Nov. Points and how they're made, not win rates.");
}
// The turn solver's report: before → after when there's a change.
function printClose(cb, ca, games, policy = "solver") {
  const pc = (x) => `${Math.round(100 * x)}%`, n2 = (x) => x.toFixed(2);
  const two = (f) => (ca ? `${f(cb)} → ${f(ca)}` : f(cb));
  console.log(`\n  CLOSE (lib/turn.mjs: the turn solver on every turn of ours from 6 points after holds, in ${games} model games against real S/A lists)`);
  console.log(`  ${"from".padEnd(8)}${"positions".padEnd(16)}${"a winning line".padEnd(22)}${"the model won".padEnd(22)}${"points that turn: solver / model"}`);
  for (let i = 0; i < 2; i++) {
    const t = (r) => r.tiers[i];
    const small = (r) => (t(r).n < 30 ? "*" : "");
    console.log(`  ${String(t(cb).start).padEnd(8)}${two((r) => `${t(r).n}${small(r)}`).padEnd(16)}${two((r) => pc(t(r).win)).padEnd(22)}${two((r) => pc(t(r).policyWin)).padEnd(22)}${two((r) => `${n2(t(r).gained)} / ${n2(t(r).policyGained)}`)}`);
  }
  if (ca) for (let i = 0; i < 2; i++) {
    const t = (r) => r.tiers[i], k = (r) => Math.round(t(r).win * t(r).n), g = twoRates(k(cb), t(cb).n, k(ca), t(ca).n);
    if (g.diff != null) console.log(`  from ${t(cb).start}: a winning line, after − before ${Math.round(100 * g.diff)} points (95%: ${Math.round(100 * g.lo)} to ${Math.round(100 * g.hi)})${g.noise ? ", within noise" : ""}`);
  }
  const list = (xs, n = 8, of = null) => xs.slice(0, n).map(([k, v]) => `${k} ${of ? pc(v / of) : v}`).join(", ") || "none";
  for (const [label, r] of ca ? [["before", cb], ["after", ca]] : [["", cb]]) {
    const head = label ? `  ${label}: ` : "  ";
    console.log(`${head}winning lines ${r.wins}: ${list(r.kinds)}`);
    console.log(`${head}your cards the winning lines use (moved, played, cast or equipped): ${list(r.cards, 12)}`);
    console.log(`${head}what breaks a winning line (each card of their list added to their hand; ${r.breakChecked} lines checked): ${list(r.breakers, 8)}`);
    console.log(`${head}the solver can't see (share of positions): ${list(r.blind, 10, r.positions)}${r.capped ? `; ${r.capped} searches hit the node cap` : ""}`);
  }
  console.log(`  * under 30 positions. A close rate on model boards, not a win rate: the boards come from ${policy === "greedy" ? "the greedy model's games" : "model games played by the solver at a small budget"} ("the model" columns: what that play did), their hand is known to the solver, and their next turn isn't searched.`);
}
import { graphOf, loopsOf, linksOf, hubsOf, bridgesOf, RESOURCES } from "../lib/interactions.mjs";
import { fight } from "../lib/fight.mjs";
import { solveTurn, breakers, turnReads, BOMB } from "../lib/turn.mjs";
import { poolCoverage, compile, engineReads } from "../lib/cardtext.mjs";
import { matchupLine } from "../lib/winrates.mjs";
import { avoidedIn } from "../lib/avoid.mjs";
import { legendPool, MIN_SHARE } from "../lib/pool.mjs";
import { checkList, readIdentity } from "../lib/identity.mjs";
import { JOBS } from "../lib/jobs.mjs";
import { buildDeck, playGame, rng, POLICIES } from "../lib/sim.mjs";

const SUPA_URL = "https://gnujcqoyjovhqkquwapd.supabase.co";
const SUPA_KEY = "sb_publishable_U9pC2YEA9YB2KxPog6t3SA_T03Jid1g";
const SUPA_TABLE = "riftbound";
const SUPA_ID = "jay";

const url = (f) => new URL(`../data/${f}`, import.meta.url);
const readJson = async (f) => JSON.parse(await readFile(f, "utf8"));

// Type order the app sorts deck rows by; anything unknown sinks to the bottom.
const TYPES = ["Legend", "Champion Unit", "Unit", "Spell", "Gear", "Rune", "Battlefield"];
const typeRank = (t) => { const i = TYPES.indexOf(t); return i < 0 ? 99 : i; };


const money = (n) => (n == null ? "" : `$${n.toFixed(2)}`);
// A card's cost as it is paid: Energy, then Power. Power is `p` in the catalog (Riot's
// feed carries it; absent means 0). It is a count, not a colour: the domain it is paid
// in is the card's own, which a two-domain card leaves to the rules (§135.2.e.6).
const cost = (c) => {
  if (!c || (c.e == null && !c.p)) return "";
  return `${c.e ?? 0}E` + (c.p ? ` ${c.p}P` : "");
};
const pad = (s, n) => String(s).padEnd(n);

export async function loadState() {
  const S = await loadSavedState();
  if (fileDecks.length) S.decks = [...(S.decks || []), ...fileDecks];
  return S;
}

async function loadSavedState() {
  if (process.env.RIFT_STATE) {
    const raw = await readJson(process.env.RIFT_STATE);
    return Array.isArray(raw) ? raw[0].data : (raw.data || raw);
  }
  const r = await fetch(
    `${SUPA_URL}/rest/v1/${SUPA_TABLE}?id=eq.${SUPA_ID}&select=data`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } },
  );
  if (!r.ok) throw new Error(`Supabase ${r.status} ${r.statusText}`);
  const rows = await r.json();
  if (!rows.length || !rows[0].data) throw new Error("no state row for id=" + SUPA_ID);
  return rows[0].data;
}

// Other rows in the same table, written by the Plex server (egger-theater plans/kobo-komga.md):
// "kobo" is the Kobo's status, "table-inbox" the games read off the reMarkable's match sheets.
// Missing row → null, so the commands still work before the server has written anything.
export async function loadRow(id) {
  const r = await fetch(
    `${SUPA_URL}/rest/v1/${SUPA_TABLE}?id=eq.${encodeURIComponent(id)}&select=data,updated_at`,
    { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } },
  );
  if (!r.ok) throw new Error(`Supabase ${r.status} ${r.statusText}`);
  const rows = await r.json();
  return rows.length && rows[0].data ? { ...rows[0].data, rowUpdated: rows[0].updated_at } : null;
}

export async function loadCatalog() {
  const cat = await readJson(url("cards.json"));
  let extras = { cards: [] };
  try { extras = await readJson(url("extras.json")); } catch { /* optional */ }
  let banned = { constructed: [] };
  try { banned = await readJson(url("banned.json")); } catch { /* optional */ }
  // Riot's card feed serves PRINTED text, not current text — errata are published
  // separately and never flow back into it, so cards.json confidently shows superseded
  // wording on 52 cards. data/errata.json carries the corrections, each one verified by
  // build-errata.mjs against the catalog's own text, so overlay them here: every reader
  // of this script gets the card as it actually plays.
  let errata = { cards: [] };
  try { errata = await readJson(url("errata.json")); } catch { /* optional */ }
  const cards = [...(cat.cards || []), ...(extras.cards || [])];
  const fix = new Map();
  for (const e of errata.cards || [])
    if (e.status === "catalog-stale" && e.name && e.new) fix.set(e.name, e.new);
  let errataApplied = 0;
  const errataNames = new Set();
  for (const c of cards) {
    const t = fix.get(c.n);
    if (t == null || c.x === t) continue;
    c.x = t; c.errata = true; errataApplied++; errataNames.add(c.n);
  }
  const BY = new Map(cards.map((c) => [c.c, c]));
  const bannedNames = bannedNameSet(banned);
  return { cards, BY, idx: indexCatalog(cards, banned), sets: cat.sets || [], bannedNames, errataApplied,
           errataCards: errataNames.size, errataAt: errata.generatedAt };
}

const mk = (S) => {
  const inv = (code) => S.inv?.[code] || {};
  const owned = (code) => (inv(code).n || 0) + (inv(code).f || 0);
  return { S, inv, owned, want: (c) => inv(c).w || 0, trade: (c) => inv(c).t || 0 };
};

function deckRows(deck, cat) {
  const { BY } = cat;
  return Object.entries(deck.cards || {})
    .map(([code, qty]) => ({ code, qty, card: BY.get(code) || null }))
    .sort((a, b) =>
      typeRank(a.card?.t) - typeRank(b.card?.t) ||
      (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
}

/* Deck maths comes from lib/decks.mjs, the copy the app uses too. Owning is by card
   identity there (every printing of a name counts), where this file used to count only
   the exact printing a deck cited — so owning the alt art read as owning none, and the
   CLI and the app could disagree about the same deck. The shape below is what the
   commands here print from. */
function deckStats(deck, cat, q) {
  const st = libDeckStats(deck, cat.idx, q.S.inv || {});
  const shape = (r) => ({ ...r, card: r.card, have: r.have, short: r.short });
  const rows = st.rows.map(shape).sort((a, b) =>
    typeRank(a.card?.t) - typeRank(b.card?.t) || (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
  const side = st.side.map(shape).sort((a, b) =>
    typeRank(a.card?.t) - typeRank(b.card?.t) || (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
  const checks = deckChecks(deck, cat.idx, st);
  const failing = checks.filter((k) => k.ok === false);
  const bans = [...rows, ...side].filter((r) => r.card && cat.bannedNames.has(r.card.n));
  const copies = rows.reduce((a, r) => a + r.qty, 0);
  const sideCopies = side.reduce((a, r) => a + r.qty, 0);
  return { rows, side, copies, distinct: rows.length, missing: st.mainGap.cards, gap: st.mainGap.total,
           unpriced: st.mainGap.unpriced + st.sideGap.unpriced, unknown: st.count.unknown, bans,
           sideCopies, sideDistinct: side.length, sideMissing: st.sideGap.cards, sideGap: st.sideGap.total,
           totalMissing: st.mainGap.cards + st.sideGap.cards,
           totalGap: Math.round((st.mainGap.total + st.sideGap.total) * 100) / 100,
           checks, issues: failing.filter((k) => k.key !== "banned" && k.key !== "unknown")
             .map((k) => `${k.label}: ${k.val}${k.detail && [].concat(k.detail).length ? ` (${[].concat(k.detail).slice(0, 6).join(", ")})` : ""}`),
           later: checks.find((k) => k.key === "standard" && k.ok === "later") || null };
}

function findDecks(S, needle) {
  const decks = S.decks || [];
  if (!needle) return decks;
  const n = needle.toLowerCase();
  return decks.filter((d) => (d.name || "").toLowerCase().includes(n));
}

// ── commands ────────────────────────────────────────────────────────────────

function cmdSummary(S, cat, q) {
  const codes = Object.keys(S.inv || {});
  let copies = 0, foils = 0, distinct = 0;
  for (const c of codes) {
    const e = S.inv[c];
    const o = (e.n || 0) + (e.f || 0);
    if (o) distinct++;
    copies += o; foils += e.f || 0;
  }
  const wants = codes.filter((c) => (S.inv[c].w || 0) > q.owned(c));
  const trades = codes.filter((c) => (S.inv[c].t || 0) > 0);
  console.log(`COLLECTION  ${distinct} distinct · ${copies} copies · ${foils} foil`);
  console.log(`WANTS       ${wants.length} cards short of their want count`);
  console.log(`TRADE       ${trades.length} cards flagged for trade`);
  console.log(`SETTINGS    playset ${S.playset} · plan by ${S.planBy} · budget ${money(S.nearSpend)}` +
              `${S.noBuy?.length ? ` · noBuy ${S.noBuy.join(", ")}` : ""}`);
  // Say that the card text here is not the card text Riot serves. The app shows this
  // per card with a chip; on the command line it would otherwise be invisible.
  // Printings, not cards: an errata applies to a name, and a name can have several
  // printings (The Boss has three), so the two numbers differ and both are worth saying.
  if (cat.errataApplied)
    console.log(`ERRATA      ${cat.errataCards} cards corrected on read across ` +
                `${cat.errataApplied} printings (data/errata.json, ${cat.errataAt})`);
  console.log("");
  const decks = S.decks || [];
  if (!decks.length) { console.log("DECKS       none saved"); return; }
  console.log(`DECKS (${decks.length})`);
  for (const d of decks) {
    const st = deckStats(d, cat, q);
    console.log(`  ${pad(d.name, 30)} ${st.copies} cards` +
      (st.sideCopies ? ` +${st.sideCopies} sb` : "") + " · " +
      (st.totalMissing ? `${st.totalMissing} to get (${money(st.totalGap)})` : "complete") +
      (st.unknown ? ` · ${st.unknown} unknown` : "") +
      (st.bans.length ? ` · ${st.bans.length} BANNED` : "") +
      (st.issues.length ? ` · ${st.issues.length} RULES ISSUE${st.issues.length > 1 ? "S" : ""}` : ""));
  }
}

function cmdDeck(S, cat, q, args) {
  const needle = args.join(" ").trim();
  const decks = findDecks(S, needle);
  if (!decks.length) { console.log(needle ? `no deck matching "${needle}"` : "no decks saved"); return; }
  if (!needle || decks.length > 1) {
    for (const d of decks) {
      const st = deckStats(d, cat, q);
      console.log(`${pad(d.name, 30)} ${st.copies} cards` +
        (st.sideCopies ? ` +${st.sideCopies} sb` : "") + ` · ${st.distinct} distinct · ` +
        (st.totalMissing ? `${st.totalMissing} to get (${money(st.totalGap)})` : "complete"));
    }
    if (decks.length > 1) console.log(`\n(${decks.length} decks matched — narrow the query for a full breakdown)`);
    return;
  }
  const d = decks[0];
  const st = deckStats(d, cat, q);
  const line = (r, ownLabel) => {
    const nm = r.card ? r.card.n : "??? NOT IN CATALOG";
    const ty = r.card?.t || "";
    console.log(`  ${r.qty}x  ${pad(nm, 30)} ${pad(r.code, 14)} ${pad(ty, 11)} ${pad(cost(r.card), 7)} ` +
      `${ownLabel} ${r.have}${r.short ? `   NEED ${r.short}  ${money((r.card?.mp || 0) * r.short)}` : ""}`);
  };
  console.log(`${d.name}\n`);
  for (const r of st.rows) line(r, "own");
  if (st.side.length) {
    // "spare" rather than "own": what is left after the main deck takes its copies,
    // which is the number that decides whether the sideboard is actually playable.
    console.log(`\n  SIDEBOARD  ${st.sideCopies} of ${SB_MAX}\n`);
    for (const r of st.side) line(r, "spare");
  }
  console.log(`\n  ${st.copies} cards · ${st.distinct} distinct` +
    (st.sideCopies ? ` · +${st.sideCopies} sideboard` : "") +
    ` · ${st.totalMissing} still to get · gap ${money(st.totalGap)}` +
    (st.unpriced ? ` + ${st.unpriced} unpriced` : ""));
  if (st.sideMissing) console.log(`  of that: ${st.missing} main + ${st.sideMissing} sideboard`);
  // The Power budget, because Power is the resource a turn runs out of first: the main
  // deck's cards that need it, grouped by how much.
  const byP = new Map();
  for (const r of st.rows) {
    if (!r.card || !r.card.p || r.card.t === "Legend") continue;
    byP.set(r.card.p, (byP.get(r.card.p) || []).concat(`${r.qty}x ${r.card.n}`));
  }
  if (byP.size) {
    const free = st.rows.filter((r) => r.card && !r.card.p && !["Legend", "Rune", "Battlefield"].includes(r.card.t))
      .reduce((a, r) => a + r.qty, 0);
    console.log(`\n  POWER  ${free} main-deck cards cost no Power`);
    for (const [pw, list] of [...byP].sort((a, b) => b[0] - a[0])) console.log(`    ${pw}P  ${list.join(", ")}`);
  }
  if (st.unknown) console.log(`  ${st.unknown} card(s) not in the catalog`);
  if (st.bans.length) console.log(`  NOT CONSTRUCTED-LEGAL: ${st.bans.map((r) => r.card.n).join(", ")}`);
  for (const x of st.issues) console.log(`  RULES: ${x}`);
  if (st.later) console.log(`  NOT YET STANDARD: ${st.later.detail.length} card(s), legal ${st.later.val}`);
}

function cmdCard(S, cat, q, args) {
  const terms = args.map((s) => s.toLowerCase()).filter(Boolean);
  if (!terms.length) { console.log("usage: card <words>"); return; }
  const hits = cat.cards.filter((c) => {
    const hay = `${c.n} ${c.c} ${c.t} ${(c.g || []).join(" ")}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
  if (!hits.length) { console.log("no catalog card matches"); return; }
  hits.sort((a, b) => typeRank(a.t) - typeRank(b.t) || a.n.localeCompare(b.n));
  for (const c of hits.slice(0, 60)) {
    const e = S.inv?.[c.c] || {};
    const bits = [];
    if (e.n) bits.push(`${e.n} owned`);
    if (e.f) bits.push(`${e.f} foil`);
    if (e.w) bits.push(`want ${e.w}`);
    if (e.t) bits.push(`trade ${e.t}`);
    console.log(`  ${pad(c.n, 30)} ${pad(c.c, 14)} ${pad(c.t, 11)} ${pad(cost(c), 7)} ${pad(money(c.mp), 7)} ${bits.join(" · ") || "—"}`);
  }
  if (hits.length > 60) console.log(`  … and ${hits.length - 60} more`);
  // One hit means the caller wanted that card, so print what it actually does. The
  // text here is errata-corrected, which is the whole reason to read it from this
  // script rather than from data/cards.json directly.
  if (hits.length === 1 && hits[0].x) {
    const c = hits[0];
    console.log("");
    for (const line of String(c.x).split("\n")) console.log(`    ${line}`);
    if (c.errata) console.log(`    (errata-corrected; data/cards.json still shows the printed text)`);
  }
}

/* ── meta: what an archetype actually plays ────────────────────────────────
   Every hand-rolled read of data/decks.json made the same mistake: it counted lists
   no sanctioned player could register. The archive keeps them on purpose — `dt` is
   when a list was POSTED, not when its event ran (see build-decks.mjs), so a
   Singapore list from before the ban turns up dated weeks after it, and on
   2026-10-08 986 of 3,008 rows held a banned card. The app has always filtered them
   (metaPool / deckLegalForConstructed); this is the same filter for the CLI, so a
   rules answer and the Meta tab are drawn from the same lists.

   Legality is judged by card NAME, as the app does, because a ban covers every
   printing. A code the catalog does not know cannot be judged and counts as legal,
   which is also what the app does.

   Legal is not the same as post-ban: a pre-ban list that happened to run none of the
   banned cards passes. `--since DATE` is the stricter cut — vouched lists by their
   EVENT's date (data/events.json), other lists by posting date.

   An announced ban (`effective` in the future) is not live yet: those cards stay legal until
   that date, as in lib/decks.mjs. */
export function bannedNameSet(banned, today = new Date().toISOString().slice(0, 10)) {
  return new Set((banned.constructed || []).filter((b) => !b.effective || b.effective <= today).map((b) => b.name));
}

export function codeName(BY, code) {
  if (BY.has(code)) return BY.get(code).n;
  // Decks carry the bare code (OGN-183, UNL-150A); the catalog keys carry the set
  // size (OGN-183/298). Index both spellings once.
  if (!BY._bare) {
    BY._bare = new Map();
    for (const [k, c] of BY) {
      const bare = k.split("/")[0];
      if (!BY._bare.has(bare)) BY._bare.set(bare, c.n);
    }
  }
  // Alternate art (UNL-150A) and promo (OGN-183-P) codes fold to the base printing.
  return BY._bare.get(code) || BY._bare.get(code.replace(/-[A-Z]+$/, "").replace(/(\d)[a-z]+$/i, "$1")) || null;
}

/* Names printed in a Standard set (TR §601.3.c, carried in banned.json as `standard`).
   A card is legal only if a card of its name is (§601.2.a): a reprint in an unreleased
   set stays legal, a new card there does not. Names fold the dash spelling the same way
   the app's gameName does, so "Lillia - Bashful Bloom" is the card "Bashful Bloom".
   Null when the list does not say, and then nothing is gated on it. */
export function standardNameSet(banned, cards) {
  const sets = banned?.standard?.sets;
  if (!Array.isArray(sets) || !sets.length) return null;
  const std = new Set(sets);
  const names = new Set(cards.map((c) => c.n));
  const fold = (n) => {
    if (!n || !n.includes(" - ")) return n;
    const comma = n.replace(" - ", ", ");
    if (names.has(comma)) return comma;
    const tail = n.slice(n.indexOf(" - ") + 3);
    return names.has(tail) ? tail : n;
  };
  const out = new Set(cards.filter((c) => std.has(c.s)).map((c) => fold(c.n)));
  out.fold = fold;
  return out;
}

export function deckIsLegal(deck, BY, bannedNames, stdNames = null) {
  return !Object.keys(deck.cards || {}).some((k) => {
    const n = codeName(BY, k);
    if (bannedNames.has(n)) return true;
    return !!(n && stdNames && !stdNames.has(stdNames.fold(n)));
  });
}

// An archived list's legend card and its archetype name ("Kennen, Heart of the Tempest").
// Shared by meta and bans so the two name archetypes identically.
function archetypeOf(cat) {
  const { BY } = cat;
  const legend = (d) => (d.lg && BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  // The champion is whichever of the legend's tags names a unit ("Kennen", not
  // "Yordle"), and a Starter printing is the same archetype as the base legend.
  const champs = new Set(cat.cards.filter((c) => c.t && c.t.includes("Unit") && c.n.includes(","))
    .map((c) => c.n.slice(0, c.n.indexOf(","))));
  const label = (d) => {
    const l = legend(d);
    let champ = l && (l.g || []).find((t) => champs.has(t));
    // The Secret Garden promos are "Lillia - Bashful Bloom" with no tags at all, for the
    // legend "Bashful Bloom"; fold them, as the app's archetypeName does.
    let ln = (d.ln || "").replace(/ - Starter$/, "");
    const dash = ln.indexOf(" - ");
    if (dash > -1 && champs.has(ln.slice(0, dash))) { champ = ln.slice(0, dash); ln = ln.slice(dash + 3); }
    if (!ln) return "Unidentified";
    return champ && !ln.includes(champ) ? `${champ}, ${ln}` : ln;
  };
  return { legend, label };
}

/* ── bans: what a ban takes, from your decks and from the whole field ──────────
   `bans "Card A" "Card B"` — or no names, for the announced bans banned.json carries
   (`effective` set). The pool is meta's: legal lists, from the current format's legal
   date unless --since says otherwise. Legality is judged WITHOUT the cards asked about,
   so this reads the same before and after they are added to ANNOUNCED_BANS — otherwise
   the lists it is meant to count would already be filtered out.

   The field covers every archetype, Aurora decks included (Jay plays against them). The
   replacements offered for Jay's own decks come only from that legend's lists that run
   none of the cards and no never-play card (lib/avoid.mjs). Counts, never a forecast:
   "lists left" is what remains of the archive, not a prediction of next week's field. */
async function cmdBans(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const sinceArg = opt("--since");
  if (sinceArg != null && !/^\d{4}-\d{2}-\d{2}$/.test(sinceArg)) {
    console.log('usage: bans ["Card name" …] [--since YYYY-MM-DD]'); return;
  }
  const words = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--since");
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const field = await readJson(url("field.json")).catch(() => null);
  const since = sinceArg || field?.legalFrom || null;

  // Which cards. A name is matched exactly, else by substring, and must land on one card.
  const allNames = [...new Set(cat.cards.map((c) => c.n))];
  let targets = [];
  if (!words.length) {
    targets = (banned.constructed || []).filter((b) => b.effective).map((b) => b.name);
    if (!targets.length) { console.log('no announced bans in data/banned.json — name the cards: bans "Card A" "Card B"'); return; }
    console.log(`announced bans from data/banned.json: ${targets.join(", ")}`);
  } else {
    for (const w of words) {
      const lw = w.toLowerCase();
      const exact = allNames.find((n) => n.toLowerCase() === lw);
      const hits = exact ? [exact] : allNames.filter((n) => n.toLowerCase().includes(lw));
      if (hits.length !== 1) {
        console.log(hits.length ? `"${w}" matches ${hits.length} cards — be more specific: ${hits.slice(0, 8).join(" · ")}` : `no card named like "${w}"`);
        return;
      }
      targets.push(hits[0]);
    }
  }
  const T = new Set(targets);
  const byName = new Map();
  for (const c of cat.cards) if (!byName.has(c.n)) byName.set(c.n, c);

  // The pool: meta's, judged without the targets.
  const snap = await readJson(url("decks.json"));
  let evDate = new Map();
  try { evDate = new Map((await readJson(url("events.json"))).events.map((e) => [e.name, e.dt])); } catch { /* posting dates */ }
  const bn = new Set([...bannedNameSet(banned)].filter((n) => !T.has(n)));
  const std = standardNameSet(banned, cat.cards);
  const { legend, label } = archetypeOf(cat);
  const playedOn = (d) => (d.tour && d.ev && evDate.get(d.ev)) || d.dt || null;
  const pool = snap.decks.filter((d) => deckIsLegal(d, cat.BY, bn, std) && (!since || (playedOn(d) || "") >= since));
  const namesOf = (cards) => {
    const m = new Map();
    for (const [k, q] of Object.entries(cards || {})) { const n = codeName(cat.BY, k) || k; m.set(n, (m.get(n) || 0) + q); }
    return m;
  };
  const hitOf = (d) => { const m = namesOf(d.cards); return targets.filter((t) => m.has(t)).map((t) => [t, m.get(t)]); };
  const pct = (x) => `${(100 * x).toFixed(x < 0.1 && x > 0 ? 1 : 0)}%`;

  console.log(`\nBANS  ${targets.map((t) => `${t} (${byName.get(t)?.t || "?"})`).join(" · ")}`);
  console.log(`pool: ${pool.length} legal lists${since ? ` played since ${since}` : ""} (meta's filter, judged without these cards)`);

  // ── your decks ──
  console.log(`\nYOUR DECKS`);
  const decks = S.decks || [];
  for (const deck of decks) {
    const main = namesOf(deck.cards), side = namesOf(deck.sb);
    const lose = targets.map((t) => [t, main.get(t) || 0, side.get(t) || 0]).filter(([, a, b]) => a || b);
    if (!lose.length) { console.log(`  ${pad(deck.name, 52)} untouched`); continue; }
    console.log(`  ${deck.name}`);
    for (const [t, a, b] of lose) console.log(`    loses ${a ? `${a}× ${t}` : ""}${a && b ? " + " : ""}${b ? `${b}× ${t} (side)` : ""}`);
    // What this legend's clean lists run that the deck does not, ranked by how many run it.
    const lg = [...main.keys()].map((n) => byName.get(n)).find((c) => c?.t === "Legend");
    if (!lg) { console.log(`    (no legend in the deck — no replacements to read)`); continue; }
    const same = pool.filter((d) => legend(d)?.n?.replace(/ - Starter$/, "") === lg.n.replace(/ - Starter$/, ""));
    const hitN = same.filter((d) => hitOf(d).length).length;
    const auroraN = same.filter((d) => !hitOf(d).length && avoidedIn(namesOf(d.cards).keys()).length).length;
    const clean = same.filter((d) => !hitOf(d).length && !avoidedIn(namesOf(d.cards).keys()).length);
    const types = new Set(lose.map(([t]) => byName.get(t)?.t).filter(Boolean));
    console.log(`    ${same.length ? label(same[0]) : lg.n}: ${same.length} lists in the pool · ${hitN} run ${targets.length > 1 ? "one of these" : "it"}` +
      `${auroraN ? ` · ${auroraN} more are Aurora (never offered)` : ""} · ${clean.length} clean to read from`);
    if (clean.length < 3) { console.log(`    too few clean lists to read replacements from${clean.length ? "" : " — none"}`); continue; }
    const rate = new Map();
    for (const d of clean) for (const [n, q] of namesOf(d.cards)) {
      if (main.has(n)) continue;
      const r = rate.get(n) || { lists: 0, copies: 0 }; r.lists++; r.copies += q; rate.set(n, r);
    }
    const ranked = [...rate].map(([n, r]) => ({ n, ...r, card: byName.get(n) }))
      .filter((r) => r.card && r.card.t !== "Legend" && r.card.t !== "Rune" && !T.has(r.n))
      .sort((a, b) => (types.has(b.card.t) - types.has(a.card.t)) || b.lists - a.lists).slice(0, 8);
    if (!ranked.length) { console.log(`    the clean lists run nothing this deck does not already`); continue; }
    console.log(`    the clean lists run, and this deck does not:`);
    for (const r of ranked) console.log(`      ${pad(pct(r.lists / clean.length), 5)} ${pad(r.n, 34)} ${pad(r.card.t, 12)} avg ${(r.copies / r.lists).toFixed(1)} where run`);
  }

  // ── the field ──
  const by = new Map();
  for (const d of pool) {
    const k = label(d);
    const r = by.get(k) || { n: 0, hit: 0, copies: 0, tour: 0, tourHit: 0, aurora: 0, per: new Map() };
    const h = hitOf(d);
    r.n++; if (d.tour) r.tour++;
    if (avoidedIn(namesOf(d.cards).keys()).length) r.aurora++;
    if (h.length) {
      r.hit++; if (d.tour) r.tourHit++;
      for (const [t, q] of h) { r.copies += q; r.per.set(t, (r.per.get(t) || 0) + 1); }
    }
    by.set(k, r);
  }
  const hitLists = pool.filter((d) => hitOf(d).length).length;
  console.log(`\nTHE FIELD  ${hitLists} of ${pool.length} lists (${pct(hitLists / (pool.length || 1))}) run at least one of these`);
  for (const t of targets) {
    const n = pool.filter((d) => namesOf(d.cards).has(t)).length;
    console.log(`  ${pad(t, 34)} in ${n} lists (${pct(n / (pool.length || 1))})`);
  }
  const rows = [...by].filter(([, r]) => r.hit).sort((a, b) => b[1].hit - a[1].hit);
  if (rows.length) {
    console.log(`\n  ${pad("archetype", 40)} ${pad("lists", 6)} ${pad("share", 6)} ${pad("hit", 5)} ${pad("hit%", 5)} ${pad("vouched hit", 12)} ${pad("left", 5)} copies/hit list${targets.length > 1 ? " · which" : ""}`);
    for (const [k, r] of rows) {
      const which = targets.length > 1 ? " · " + [...r.per].map(([t, n]) => `${t} ${pct(n / r.hit)}`).join(", ") : "";
      const thin = r.n < 5 ? " (thin)" : "";
      console.log(`  ${pad(k.slice(0, 40), 40)} ${pad(r.n, 6)} ${pad(pct(r.n / pool.length), 6)} ${pad(r.hit, 5)} ${pad(pct(r.hit / r.n), 5)} ${pad(r.tour ? `${r.tourHit}/${r.tour}` : "—", 12)} ${pad(r.n - r.hit, 5)} ${(r.copies / r.hit).toFixed(1)}${which}${thin}${r.aurora ? ` · ${r.aurora} Aurora lists (opponent-only)` : ""}`);
    }
  }
  const untouched = [...by].filter(([, r]) => !r.hit).sort((a, b) => b[1].n - a[1].n);
  if (untouched.length) console.log(`\n  untouched (${untouched.length}): ${untouched.map(([k, r]) => `${k} ${r.n}`).join(" · ")}`);
  if (words.length && targets.some((t) => !(banned.constructed || []).some((b) => b.name === t)))
    console.log(`\nNEXT  once Riot announces: add each to ANNOUNCED_BANS in scripts/build-banned.mjs with its effective date, then node scripts/build-banned.mjs`);
}

async function cmdMeta(cat, args) {
  const all = args.includes("--all");
  const si = args.indexOf("--since");
  const since = si > -1 ? args[si + 1] : null;
  if (since != null && !/^\d{4}-\d{2}-\d{2}$/.test(since)) {
    console.log("usage: meta [legend words] [--since YYYY-MM-DD] [--all]"); return;
  }
  const terms = args.filter((a, i) => !a.startsWith("--") && !(si > -1 && i === si + 1))
    .map((s) => s.toLowerCase());
  const snap = await readJson(url("decks.json"));
  let evDate = new Map();
  try {
    evDate = new Map((await readJson(url("events.json"))).events.map((e) => [e.name, e.dt]));
  } catch { /* optional: --since then falls back to posting dates */ }
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const bannedNames = bannedNameSet(banned);
  const stdNames = standardNameSet(banned, cat.cards);
  const { BY } = cat;

  const { legend, label } = archetypeOf(cat);
  // The date that means "when was this played": the event's, when upstream vouched for one.
  const playedOn = (d) => (d.tour && d.ev && evDate.get(d.ev)) || d.dt || null;

  let pool = snap.decks;
  const illegal = all ? 0 : pool.filter((d) => !deckIsLegal(d, BY, bannedNames, stdNames)).length;
  if (!all) pool = pool.filter((d) => deckIsLegal(d, BY, bannedNames, stdNames));
  const beforeSince = pool.length;
  if (since) pool = pool.filter((d) => (playedOn(d) || "") >= since);
  const head = `${snap.decks.length} archived lists · ${all ? "illegal lists included" : `${illegal} hold a banned card or one no Standard set prints (${(banned.standard?.sets || []).join(" ")}) and are dropped`}` +
    (since ? ` · ${beforeSince - pool.length} more played before ${since}` : "");

  if (!terms.length) {
    const by = new Map();
    for (const d of pool) {
      const k = label(d);
      const r = by.get(k) || { n: 0, tour: 0, claims: 0, best: null };
      r.n++;
      if (d.tour) {
        r.tour++;
        if (d.pl != null && d.ec && (!r.best || d.pl / d.ec < r.best.pl / r.best.ec)) r.best = d;
      }
      if (d.cp != null) r.claims++;
      by.set(k, r);
    }
    console.log(head);
    console.log(`${pool.length} lists in the pool\n`);
    console.log(`  ${pad("archetype", 40)} ${pad("lists", 6)} ${pad("share", 7)} ${pad("vouched", 8)} ${pad("claims", 7)} best vouched finish`);
    for (const [k, r] of [...by].sort((a, b) => b[1].n - a[1].n)) {
      const best = r.best ? `${r.best.pl} of ${r.best.ec}, ${r.best.ev}` : "—";
      console.log(`  ${pad(k, 40)} ${pad(r.n, 6)} ${pad((100 * r.n / pool.length).toFixed(1) + "%", 7)} ${pad(r.tour, 8)} ${pad(r.claims, 7)} ${best}`);
    }
    return;
  }

  const mine = pool.filter((d) => {
    const l = legend(d);
    const hay = `${d.ln || ""} ${l ? (l.g || []).join(" ") : ""} ${label(d)}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
  if (!mine.length) { console.log(`${head}\nno lists in the pool match "${terms.join(" ")}"`); return; }
  const names = [...new Set(mine.map(label))];
  console.log(head);
  console.log(`${names.join(" + ")}: ${mine.length} lists · ${mine.filter((d) => d.tour).length} vouched · ${mine.filter((d) => d.cp != null).length} with a claimed finish`);

  // A card's rate is the share of lists holding at least one copy, printings folded.
  const rate = new Map();
  for (const d of mine) {
    const seen = new Map();
    for (const [k, q] of Object.entries(d.cards || {})) {
      const n = codeName(BY, k) || k;
      seen.set(n, (seen.get(n) || 0) + q);
    }
    for (const [n, q] of seen) {
      const r = rate.get(n) || { lists: 0, copies: 0 };
      r.lists++; r.copies += q;
      rate.set(n, r);
    }
  }
  const byName = new Map(cat.cards.map((c) => [c.n, c]));
  console.log(`\n  ${pad("in", 9)} ${pad("avg", 4)} ${pad("card", 30)} ${pad("type", 11)} cost`);
  for (const [n, r] of [...rate].sort((a, b) => b[1].lists - a[1].lists || a[0].localeCompare(b[0]))) {
    if (r.lists / mine.length < 0.1) break;
    const c = byName.get(n);
    const how = cost(c) + (c && c.m != null ? ` · ${c.m} Might` : "");
    console.log(`  ${pad(`${r.lists}/${mine.length}`, 9)} ${pad((r.copies / r.lists).toFixed(1), 4)} ${pad(n, 30)} ${pad(c ? c.t : "?", 11)} ${how}`);
  }

  // Known field sizes first, by how deep into the field the finish was; a place in a
  // field of unknown size cannot be ranked against them, so those follow by place.
  const vouched = mine.filter((d) => d.tour && d.pl != null).sort((a, b) =>
    (!a.ec - !b.ec) || (a.ec && b.ec ? a.pl / a.ec - b.pl / b.ec : a.pl - b.pl));
  if (vouched.length) {
    console.log(`\n  best vouched finishes (record: upstream placed it)`);
    for (const d of vouched.slice(0, 10))
      console.log(`    ${pad(d.pl + (d.ec ? ` of ${d.ec}` : " of unknown"), 14)} ${pad(playedOn(d) || "", 11)} ${d.ev} — ${d.h}`);
  }
  const claims = mine.filter((d) => d.cp != null).sort((a, b) => a.cp - b.cp);
  if (claims.length) {
    console.log(`\n  claimed finishes (the author's title, not a record)`);
    for (const d of claims.slice(0, 8)) console.log(`    ${pad("top " + d.cp, 10)} ${d.ce || "unnamed event"} — ${d.h}`);
  }
}

/* ── event: a store event from Riot's locator ─────────────────────────────
   Local events are not in data/events.json (riftbound.gg's registry carries a
   country at most), but Riot's store locator (locator.riftbound.uvsgames.com) reads a
   public, read-only API that has them: the event, every registration with its final
   place and record, and per-round standings that carry each player's
   "deck-defining card" — the legend, when the store recorded one. Many stores never
   do, and then the legend is unknown and printed as unknown.
   Three requests per event plus registration pages, paced; nothing is cached. */
const LOCATOR = "https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2";

async function locatorGet(path) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(`${LOCATOR}/${path}`, { headers: { "User-Agent": "rift.jayegger.com cli" } });
    if ((r.status === 429 || r.status >= 500) && attempt < 3) { await sleep(2000 * 2 ** attempt); continue; }
    if (!r.ok) throw new Error(`locator ${r.status} on ${path}`);
    return r.json();
  }
}
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// One event: its header, every registration, and the legend each player was recorded
// on (from the standings, so only once rounds exist).
async function loadEvent(id) {
  const ev = await locatorGet(`events/${id}/`);
  const regs = [];
  for (let page = 1; page && page < 20; ) {
    const r = await locatorGet(`events/${id}/registrations/?page=${page}`);
    regs.push(...(r.results || []));
    page = r.next_page_number || null;
    if (page) await sleep(500);
  }
  const rounds = (ev.tournament_phases || []).flatMap((p) => p.rounds || [])
    .filter((r) => r.standings_status === "GENERATED");
  const legendOf = new Map();
  for (const rd of rounds.slice(-2)) {          // the last two rounds carry every finisher
    await sleep(500);
    const st = await locatorGet(`tournament-rounds/${rd.id}/standings/`);
    for (const row of st.standings || []) {
      const card = row.user_event_status?.deck_defining_card?.name;
      if (card) legendOf.set(row.player?.id, card);
    }
  }
  return { ev, regs, legendOf };
}

const eventId = (s) => String(s || "").replace(/.*\/events\//, "").replace(/\D.*$/, "");

async function cmdEvent(args) {
  const si = args.indexOf("--scout");
  const ni = args.indexOf("--scout-near");
  const id = eventId(args[0]);
  let scoutIds = si > -1 ? args.slice(si + 1).filter((a) => !a.startsWith("--")).map(eventId).filter(Boolean) : [];
  if (!id) {
    console.log("usage: event <locator id or URL> [--scout <other event ids…>]   e.g. event 501411 --scout 508101 660031");
    return;
  }
  const { ev, regs, legendOf } = await loadEvent(id);
  // --scout-near [miles]: every earlier Summoner Skirmish within that radius of this
  // event, over the 60 days before it. The locator's own search, so it finds stores
  // this repo has never heard of.
  if (ni > -1 && ev.latitude != null) {
    const miles = Number(args[ni + 1]) || 10;
    const iso = (t) => new Date(t).toISOString().replace(/\.\d+Z$/, "Z");
    const before = encodeURIComponent(iso(ev.start_datetime || Date.now()));
    const after = encodeURIComponent(iso(Date.parse(ev.start_datetime || Date.now()) - 60 * 86400000));
    for (let page = 1; page && page < 10; ) {
      const r = await locatorGet(`events/?latitude=${ev.latitude}&longitude=${ev.longitude}&num_miles=${miles}` +
        `&name=Skirmish&page_size=100&page=${page}&start_date_after=${after}&start_date_before=${before}`);
      for (const e of r.results || [])
        if (e.game_type === "RIFTBOUND" && /skirmish/i.test(e.name) && String(e.id) !== id && e.starting_player_count)
          scoutIds.push(String(e.id));
      page = r.next_page_number || null;
      await sleep(500);
    }
    scoutIds = [...new Set(scoutIds)];
    console.error(`scouting ${scoutIds.length} Skirmishes within ${miles} miles…`);
  }
  const local = new Map();   // every recorded legend across the scouted events: the local meta
  let localPlayers = 0, localKnown = 0, localEvents = 0;
  const tz = ev.timezone || "UTC";
  const when = ev.start_datetime
    ? new Date(ev.start_datetime).toLocaleString("en-US", { timeZone: tz, dateStyle: "medium", timeStyle: "short" })
    : "unknown";
  const phases = ev.tournament_phases || [];
  const swiss = phases.find((p) => p.round_type === "SWISS");
  const cut = phases.find((p) => p.rank_required_to_enter_phase);
  const placed = regs.filter((r) => r.final_place_in_standings != null)
    .sort((a, b) => a.final_place_in_standings - b.final_place_in_standings);
  console.log(`${ev.name}`);
  console.log(`  ${ev.store?.name || "unknown store"} · ${ev.full_address || ev.store?.full_address || ""}`);
  // A finished event's registered count is not its field; the registrations are.
  const field = placed.length ? `${regs.length} players` : `${ev.registered_user_count ?? "?"} of ${ev.capacity ?? "?"} registered`;
  console.log(`  ${when} (${tz}) · ${ev.cost_in_cents != null ? money(ev.cost_in_cents / 100) : "fee unknown"} · ` +
    `${field} · ${ev.rules_enforcement_level || "enforcement unknown"}`);
  const bo = swiss?.effective_maximum_number_of_game_wins_per_match;
  console.log(`  ${bo ? `best of ${bo * 2 - 1}` : "match length unknown"} · ` +
    `${ev.settings?.round_duration_in_minutes ? `${ev.settings.round_duration_in_minutes}-minute rounds` : "round time unknown"} · ` +
    `${swiss?.number_of_rounds ? `${swiss.number_of_rounds} Swiss rounds` : "Swiss rounds not set"}` +
    `${cut ? ` · top ${cut.rank_required_to_enter_phase} cut` : ""} · ${ev.settings?.event_lifecycle_status || ev.event_status || ""}`);
  if (ev.description) console.log(`\n  ${String(ev.description).trim().split("\n").join("\n  ")}`);
  if (!regs.length) { console.log("\n  no registrations visible"); return; }

  // Scouting: the same player (by locator user id) at other events, and what they played.
  const seen = new Map();   // user id -> ["Ornn (Silk Road Gaming 3 Oct, 1st)", …]
  for (const sid of scoutIds) {
    await sleep(500);
    let o;
    try { o = await loadEvent(sid); } catch (e) { console.error(`  skipped ${sid}: ${e.message}`); continue; }
    localEvents++;
    localPlayers += o.regs.length;
    for (const leg of o.legendOf.values()) { localKnown++; local.set(leg, (local.get(leg) || 0) + 1); }
    const tag = `${o.ev.store?.name || sid} ${o.ev.start_datetime ? new Date(o.ev.start_datetime).toLocaleDateString("en-US", { timeZone: o.ev.timezone || "UTC", month: "short", day: "numeric" }) : ""}`;
    for (const r of o.regs) {
      const uid = r.user?.id;
      if (!uid) continue;
      const leg = o.legendOf.get(uid);
      const place = r.final_place_in_standings != null ? `, ${r.final_place_in_standings} of ${o.regs.length}` : "";
      seen.set(uid, (seen.get(uid) || []).concat(`${leg ? leg.split(",")[0] : "legend not recorded"} (${tag}${place})`));
    }
  }

  const rows = placed.length ? placed : regs;
  console.log(`\n  ${placed.length ? "final standings" : "registered"}${scoutIds.length ? ` · scouted against ${scoutIds.length} other event(s)` : ""}`);
  for (const r of rows) {
    const place = r.final_place_in_standings != null ? pad(r.final_place_in_standings, 3) : "   ";
    const rec = placed.length ? pad(`${r.matches_won}-${r.matches_lost}-${r.matches_drawn}`, 7) : "";
    const here = legendOf.get(r.user?.id) || (placed.length ? "legend not recorded" : "");
    const elsewhere = (seen.get(r.user?.id) || []).join("; ");
    console.log(`    ${place} ${pad(r.user?.best_identifier || r.best_identifier || "?", 22)} ${rec}${here}${elsewhere ? `${here ? "  ·  " : ""}${elsewhere}` : ""}`);
  }
  if (legendOf.size) {
    const tally = new Map();
    for (const n of legendOf.values()) tally.set(n, (tally.get(n) || 0) + 1);
    console.log(`\n  legends recorded for ${legendOf.size} of ${regs.length}: ` +
      [...tally].sort((a, b) => b[1] - a[1]).map(([n, k]) => `${n} ${k}`).join(" · "));
  } else if (placed.length) console.log(`\n  no legends recorded at this event`);
  if (scoutIds.length) {
    const tally = new Map();
    let known = 0;
    for (const r of regs) {
      const legs = (seen.get(r.user?.id) || []).filter((x) => !x.startsWith("legend not recorded"));
      if (!legs.length) continue;
      known++;
      const last = legs[legs.length - 1].split(" (")[0];
      tally.set(last, (tally.get(last) || 0) + 1);
    }
    if (local.size) {
      console.log(`\n  local meta: ${localKnown} legends recorded across ${localEvents} events (${localPlayers} entries, ` +
        `${localPlayers - localKnown} not recorded)`);
      for (const [n, k] of [...local].sort((a, b) => b[1] - a[1]))
        console.log(`    ${pad(k, 4)} ${pad((100 * k / localKnown).toFixed(1) + "%", 7)} ${n}`);
    }
    console.log(`\n  ${known} of ${regs.length} have a legend on record elsewhere (most recent listed event): ` +
      ([...tally].sort((a, b) => b[1] - a[1]).map(([n, k]) => `${n} ${k}`).join(" · ") || "none"));
  }
}

function cmdWant(S, cat, q) {
  const rows = Object.keys(S.inv || {})
    .map((code) => ({ code, card: cat.BY.get(code), w: S.inv[code].w || 0, have: q.owned(code) }))
    .filter((r) => r.w > r.have)
    .map((r) => ({ ...r, short: r.w - r.have, cost: (r.card?.mp || 0) * (r.w - r.have) }))
    .sort((a, b) => typeRank(a.card?.t) - typeRank(b.card?.t) || (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
  if (!rows.length) { console.log("nothing outstanding — every want is covered"); return; }
  let total = 0;
  for (const r of rows) {
    total += r.cost;
    console.log(`  need ${r.short}x  ${pad(r.card?.n || r.code, 30)} ${pad(r.code, 14)} ${money(r.cost)}`);
  }
  console.log(`\n  ${rows.length} cards · ${money(total)} to close every want`);
}

function cmdTrade(S, cat, q) {
  const rows = Object.keys(S.inv || {})
    .map((code) => ({ code, card: cat.BY.get(code), t: S.inv[code].t || 0, have: q.owned(code) }))
    .filter((r) => r.t > 0)
    .sort((a, b) => typeRank(a.card?.t) - typeRank(b.card?.t) || (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
  if (!rows.length) { console.log("nothing flagged for trade"); return; }
  for (const r of rows)
    console.log(`  ${r.t}x  ${pad(r.card?.n || r.code, 30)} ${pad(r.code, 14)} (own ${r.have}) ${money(r.card?.mp)}`);
  console.log(`\n  ${rows.length} cards flagged`);
}

function cmdSets(S, cat, q) {
  for (const set of cat.sets) {
    const base = cat.cards.filter((c) => c.s === set.id && c.no <= set.base);
    const have = base.filter((c) => q.owned(c.c)).length;
    const play = base.filter((c) => q.owned(c.c) >= (S.playset || 3)).length;
    console.log(`  ${pad(set.id, 5)} ${pad(set.name, 20)} ${pad(`${have}/${set.base}`, 9)} owned · ${play} at playset`);
  }
}

// The one-tap match journal the app (app/) writes: S.journal, [{at, deck, opp, res}].
// Per deck, the record against each opponent, then the last ten games. Then the games read off
// the reMarkable's match sheets (the "table-inbox" row) that the app's journal doesn't have yet.
async function cmdJournal(S, args) {
  const games = S.journal || [];
  let inbox = null;
  try { inbox = await loadRow("table-inbox"); } catch { /* offline or no row: the app's journal alone */ }
  const fromSheets = (inbox?.entries || []).filter((e) =>
    !games.some((g) => g.at.slice(0, 10) === e.at.slice(0, 10) && g.opp.toLowerCase().startsWith((e.opp || "").toLowerCase().split(",")[0])));
  const printSheets = () => {
    if (!fromSheets.length) return;
    console.log(`\nFROM THE MATCH SHEETS  (read off the reMarkable, not in the app's journal yet)`);
    for (const e of fromSheets) {
      const score = (e.games || []).map((g) => `${g.me}-${g.opp}`).join(" ");
      console.log(`    ${e.at.slice(0, 10)} ${e.res || "?"} ${pad(e.opp || "(opponent unread)", 28)} ${score}${e.unsure ? "  (check: " + e.unsure + ")" : ""}`);
      if (e.next) console.log(`        next time: ${e.next}`);
    }
    console.log(`    source: ${inbox.source || "match-night"} · read ${String(inbox.rowUpdated || "").slice(0, 16).replace("T", " ")}`);
  };
  if (!games.length) { console.log("no games logged yet (log them on the Decks page of app/)"); printSheets(); return; }
  const decks = findDecks(S, args.join(" ").trim());
  const name = new Map((S.decks || []).map((d) => [d.id, d.name]));
  const ids = new Set(decks.map((d) => d.id));
  const pick = games.filter((g) => !args.length || ids.has(g.deck));
  const by = new Map();
  for (const g of pick) { if (!by.has(g.deck)) by.set(g.deck, []); by.get(g.deck).push(g); }
  for (const [id, gs] of by) {
    const w = gs.filter((g) => g.res === "W").length, l = gs.filter((g) => g.res === "L").length;
    console.log(`${name.get(id) || `(deleted deck ${id})`}  ${w}-${l}`);
    for (const [opp, r] of journalRecord(gs)) console.log(`    ${pad(opp, 34)} ${r.w}-${r.l}${r.d ? `-${r.d}` : ""}`);
    console.log("    last games: " + gs.slice(-10).map((g) => `${g.at.slice(0, 10)} ${g.res} ${g.opp.split(",")[0]}`).join(" · "));
  }
  printSheets();
}

/* ── kobo: what the Kobo Libra Colour has, from the server's "kobo" row ─────── */
// The sheets travel rift (guides/kobo.txt) → GitHub (kobo-sheets branch) → Plex server
// (Komga) → Kobo over Wi-Fi. This reads each stage, so a stuck one shows.
async function cmdKobo() {
  const K = await loadRow("kobo");
  let published = null;
  try {
    const r = await fetch("https://raw.githubusercontent.com/Jcegger/rift/kobo-sheets/manifest.json");
    if (r.ok) published = await r.json();
  } catch { /* offline */ }
  const pub = new Map((published?.items || []).map((i) => [i.file, i]));
  if (!K) {
    console.log("no word from the server yet (the \"kobo\" row is missing: egger-theater plans/kobo-komga.md)");
    if (published) for (const i of published.items) console.log(`  published  ${pad(i.collection, 14)} ${i.title}`);
    else console.log("nothing published yet either (the kobo-sheets branch is built by .github/workflows/kobo-sheets.yml)");
    return;
  }
  const when = (t) => (t ? String(t).slice(0, 16).replace("T", " ") : "never");
  console.log(`KOBO  server checked ${when(K.checkedAt)} · Kobo last synced ${when(K.lastKoboSync)}`);
  for (const [name, items] of Object.entries(K.collections || {})) {
    console.log(`\n  ${name.toUpperCase()}`);
    for (const i of items) {
      const p = pub.get(i.file);
      const state = p && p.version !== i.version ? "update on its way" : i.onKobo ? "on the Kobo" : "waiting for the Kobo to sync";
      const read = i.progress != null ? `  read ${Math.round(i.progress * 100)}%` : "";
      console.log(`    ${pad(i.title, 30)} ${pad(state, 28)}${read}`);
    }
  }
  const missing = [...pub.values()].filter((p) => !Object.values(K.collections || {}).flat().some((i) => i.file === p.file));
  for (const p of missing) console.log(`    ${pad(p.title, 30)} new; the server picks it up within 10 minutes`);
  if (K.errors?.length) { console.log("\n  PROBLEMS"); for (const e of K.errors) console.log(`    ${e}`); }
}

/* ── ideas: the Radiance-era consensus per legend (data/ideas.json) ─────────── */
// Offline, like meta. With a legend, it also compares your saved deck for that legend,
// if the Supabase row can be read.
async function cmdIdeas(cat, args) {
  const I = await readJson(url("ideas.json"));
  const pct = (x) => `${Math.round(x * 100)}%`.padStart(4);
  const q = args.join(" ").toLowerCase();
  if (!q) {
    console.log(`RADIANCE ERA · ${I.era.events.length} events · ${I.era.placed} placed lists · ${I.era.brews} brews · built ${I.generatedAt}`);
    for (const e of I.era.events) console.log(`  ${e.date}  ${String(e.players ?? "?").padStart(4)} players  ${e.name}`);
    // The best playable net deck per legend: this format's, else the last one's (lib/netdeck.mjs).
    const net = (name) => { for (const f of ["now", "last"]) { const g = (I.netdecks?.[name]?.[f] || []).find((x) => !x.avoid.length); if (g) return `${g.status} ${g.lists}${f === "last" ? ` (${I.formats.last.name})` : ""}`; } return "—"; };
    console.log(`\n  ${pad("legend", 34)} new  placed top8  best      brews  net deck`);
    for (const l of I.legends) console.log(`  ${pad(l.name, 34)} ${l.isNew ? "NEW" : "   "}  ${String(l.placed).padStart(6)} ${String(l.top8).padStart(4)}  ${pad(l.best ? `#${l.best.pl}/${l.best.players ?? "?"}` : "—", 8)} ${String(l.brews).padStart(5)}  ${net(l.name)}`);
    const older = Object.keys(I.netdecks || {}).filter((n) => !I.legends.some((l) => l.name === n));
    if (older.length) console.log(`\n  only ${I.formats.last.name} finishes: ${older.map((n) => `${n.split(",")[0]} (${net(n)})`).join(" · ")}`);
    const quiet = I.newLegends.filter((n) => !I.legends.some((l) => l.name === n.name));
    if (quiet.length) console.log(`\n  new legends with no lists yet: ${quiet.map((n) => n.name).join(" · ")}`);
    return;
  }
  // The archetype first: what the deck is for, measured and as written (docs/archetypes.md).
  const AR = await readJson(url("archetypes.json")).catch(() => null);
  const arch = AR?.legends.find((x) => x.name.toLowerCase().includes(q));
  if (arch) {
    const md = await readFile(new URL("../docs/archetypes.md", import.meta.url), "utf8").catch(() => "");
    const sec = md.split(/^(?=##+ )/m).find((b) => b.startsWith(`### ${arch.name} —`));
    const p = arch.profile;
    console.log(`ARCHETYPE ${arch.name}: ${sec ? sec.split("\n")[0].split(" — ")[1].replace(/\*.*$/, "").replace(/[\s·]+$/, "") : "not written"}` +
      (p ? ` · measured ${arch.label} (u${p.units} s${p.spells} g${p.gear}, cost ${p.avgCost}, ${p.interaction} interaction)` : ""));
    const f = arch.inferred;
    // The sub-archetype only: the inferred main (aggro…ramp) is about half right.
    if (f?.subName) console.log(`  built on, from the cards: ${f.subName} (also ${f.subs.slice(1).map((x) => x.name).join(", ")}) · ` +
      f.layers.map((l) => `${l.n} ${l.name}: ${l.sub[0] || "—"}`).join(" · "));
    // Bullets wrap in the source; a continuation line is indented, so fold it back in.
    if (sec) console.log(sec.split("\n").slice(1).join("\n").replace(/\n {2,}(?=\S)/g, " ").split("\n")
      .filter((x) => /^- \*\*/.test(x)).map((x) => "  " + x.replace(/\*\*/g, "")).join("\n"));
    console.log("");
  }
  // A legend with Radiance-era lists, or with only good finishes in the last format.
  const lname = [...new Set([...I.legends.map((x) => x.name), ...Object.keys(I.netdecks || {})])].sort().find((n) => n.toLowerCase().includes(q));
  const l = I.legends.find((x) => x.name === lname) || null, N = I.netdecks?.[lname] || null;
  if (!l && !N) { console.log(`no lists for a legend matching "${q}"`); process.exit(arch ? 0 : 1); }
  console.log(`${lname.toUpperCase()}${l?.isNew ? " (new in Radiance)" : ""}${l ? ` · ${l.placed} Radiance-format finishes (any) · top 8 ×${l.top8} · ${l.brews} brews` : ""}`);
  if (l) console.log(`finishes: ${l.finishes.map(([p, n]) => `#${p}/${n ?? "?"}`).join(" ") || "none"}`);
  // Net decks (lib/netdeck.mjs): good finishes, one per finish, split into the decks they are.
  const finish = (p) => (p.pl != null ? `#${p.pl}/${p.players ?? "?"}` : p.cp ? `claimed top ${p.cp}` : "?");
  for (const f of ["now", "last"]) {
    const gs = N?.[f] || [], fmt = I.formats.now && I.formats[f].name;
    console.log(`\n${fmt.toUpperCase()} NET DECKS${f === "last" ? " (last format, still legal)" : ""}${gs.length ? "" : ": no good finish yet"}`);
    for (const g of gs) {
      const tag = g.avoid.length ? `NOT FOR YOU — runs ${g.avoid.join(", ")} (lib/avoid.mjs); shown for the field` : { net: "NET DECK", early: "EARLY", single: "AS PLAYED", crowd: "CROWD'S LIST — what people post, not what wins" }[g.status];
      console.log(`  ${tag}${g.preview ? " · online preview" : ""}${g.marks.length ? ` · with ${g.marks.join(" · ")}` : ""}`);
      console.log(g.status === "crowd" ? `    ${g.lists} posted lists, ${g.copies} titled as copies · posted ${g.from} to ${g.through}`
        : `    ${g.lists} finishes · ${g.events} events · ${g.records} recorded${g.claims ? `, ${g.claims} claimed` : ""} · best ${finish(g.best)}${g.best.ev ? ` at ${g.best.ev}` : ""} · latest ${g.through}`);
      for (const m of g.misses) if (g.status === "early") console.log(`    not a net deck yet: ${m}`);
      if (g.avoid.length) continue;
      if (g.count) {
        console.log(`    ${g.count.main.map((r) => `${r.copies} ${r.name} ${pct(r.inc).trim()}`).join(" · ")}`);
        console.log(`    runes: ${g.count.runes.map((r) => `${r.copies} ${r.name}`).join(", ")} · battlefields: ${g.count.battlefields.map((b) => b.name).join(", ")}`);
        if (g.count.flex.length) console.log(`    flex: ${g.count.flex.map((r) => `${r.name} ${pct(r.inc).trim()}`).join(" · ")}`);
        console.log(`    closest real list: ${g.closest.h}${g.status === "crowd" ? "" : ` (${finish(g.closest)})`}, ${g.closest.changed} copies off`);
      } else console.log(`    ${g.best.h}`);
    }
  }
  // The leading playable net deck — this format's, else the last one's — is what the rest reads.
  const lead = ["now", "last"].map((f) => (N?.[f] || []).find((g) => g.count && !g.avoid.length)).find(Boolean);
  const c = lead?.count ? { ...lead.count, cards: lead.cards } : null;
  if (!c) return;
  if (l?.changes) {
    console.log(`\nSINCE ${I.formats.last.name.toUpperCase()} · share of good finishes, ${l.changes.now} ${I.formats.now.name} against ${l.changes.vs} ${I.formats.last.name}`);
    if (l.changes.added.length) console.log(`  in:  ${l.changes.added.map((r) => `${r.name} ${pct(r.before).trim()}→${pct(r.now).trim()}`).join(" · ")}`);
    if (l.changes.dropped.length) console.log(`  out: ${l.changes.dropped.map((r) => `${r.name} ${pct(r.before).trim()}→${pct(r.now).trim()}`).join(" · ")}`);
  } else if (l?.isNew) console.log("\nnew legend: no Vendetta lists to compare");
  try {
    const S = await loadState();
    const mine = (S.decks || []).filter((d) => Object.keys(d.cards || {}).some((k) => cat.BY.get(k)?.t === "Legend" && cat.idx.legendName(cat.BY.get(k)) === lname));
    for (const d of mine) {
      const name = (k) => cat.BY.get(k)?.n || k;
      const have = new Map(); for (const [k, n] of Object.entries(d.cards)) have.set(name(k), (have.get(name(k)) || 0) + n);
      // Against the playable net deck nearest this deck (this format's first), not one blend.
      const mainHave = new Map([...have].filter(([n]) => !/^(Rune|Legend|Battlefield)$/.test(cat.BY.get(Object.keys(d.cards).find((k) => name(k) === n))?.t || "")));
      const off = (g) => { let s = 0, t = 0; for (const [n, q] of mainHave) { t += q; s += Math.min(q, g.count.main.find((r) => r.name === n)?.copies || 0); } return Math.max(t, 40) - s; };
      const near = ["now", "last"].map((f) => (N?.[f] || []).filter((g) => g.count && !g.avoid.length).map((g) => ({ g, f, off: off(g) })).sort((a, b) => a.off - b.off)[0]).find(Boolean);
      if (!near) continue;
      const c = near.g.count;
      const add = c.main.filter((r) => (have.get(r.name) || 0) < r.copies).map((r) => `${r.copies - (have.get(r.name) || 0)} ${r.name} (${pct(r.inc).trim()})`);
      const inc = new Map([...c.main, ...c.flex].map((r) => [r.name, r.inc]));
      const cut = [...have].filter(([n]) => { const t = cat.BY.get(Object.keys(d.cards).find((k) => name(k) === n))?.t; return t !== "Rune" && t !== "Legend" && t !== "Battlefield" && (inc.get(n) || 0) < 0.2; }).map(([n, k]) => `${k} ${n}`);
      console.log(`\nYOUR "${d.name}" vs the nearest ${I.formats[near.f].name} net deck${near.g.marks.length ? ` (with ${near.g.marks.join(" · ")})` : ""}, ${near.off} copies off\n  add: ${add.join(" · ") || "nothing"}\n  played by under 20%: ${cut.join(" · ") || "nothing"}`);
    }
  } catch { /* offline: the net decks stand on their own */ }
}

// rising: which cards each legend's posted lists are taking up or dropping (data/rising.json),
// with the days each window really holds. Offline, read-only.
async function cmdRising(args) {
  const q = args.join(" ").toLowerCase();
  const Rz = await readJson(url("rising.json")).catch(() => null);
  if (!Rz) { console.error("no data/rising.json — run node scripts/build-rising.mjs"); process.exit(1); }
  const cov = Rz.window.coverage, held = (c) => (c && c.days < c.of ? ` (lists on ${c.days} of ${c.of} days; none captured ${c.missing.join(", ")})` : "");
  console.log(`RISING · ${Rz.window.recent.join("–")}${held(cov?.recent)} against ${Rz.window.prior.join("–")}${held(cov?.prior)} · posted lists, by posting date\n  ${Rz.note}`);
  const rows = Object.entries(Rz.legends).filter(([n]) => !q || n.toLowerCase().includes(q)).sort((a, b) => b[1].lists.now - a[1].lists.now);
  for (const [n, v] of rows.slice(0, q ? 3 : 15)) {
    console.log(`\n${n} · ${v.lists.now} lists this week, ${v.lists.before} before`);
    if (v.rising.length) console.log(`  up:   ${v.rising.map((r) => `${r.name}${r.rad ? "*" : ""} ${r.before}→${r.now}%`).join(" · ")}`);
    if (v.falling.length) console.log(`  down: ${v.falling.map((r) => `${r.name}${r.rad ? "*" : ""} ${r.before}→${r.now}%`).join(" · ")}`);
  }
  if (!rows.length) console.log(q ? `\nno trend for "${q}" (needs 5+ lists in each window)` : "");
  console.log("\n  (* = Radiance)");
}

// poll: the preseason model (data/preseason.json, lib/preseason.mjs) — every legend's builds
// ranked, a prediction until the new format has results, then the results. Offline, read-only.
async function cmdPoll(args) {
  const q = args.join(" ").toLowerCase();
  const P = await readJson(url("preseason.json")).catch(() => null);
  if (!P) { console.error("no data/preseason.json — run node scripts/build-preseason.mjs"); process.exit(1); }
  const flags = (x) => [x.isNew ? "new" : "", x.noBestOf ? "no Best-Of" : "", x.aurora.length ? "AURORA: opponent only" : ""].filter(Boolean).join(", ");
  const name = (x) => `${x.legend}${x.build ? ` — ${x.build}` : ""}`;
  const hits = q ? P.builds.filter((x) => name(x).toLowerCase().includes(q)) : [];
  if (!q || !hits.length) {
    const w = Math.max(...P.builds.map((x) => x.season.weight));
    console.log(`POLL · ${P.set}, legal ${P.legalFrom} · built ${P.generatedAt} · ${P.builds.length} builds · ${w < 0.5 ? "a PREDICTION: results carry at most " + Math.round(w * 100) + "% of any score" : "results-led"}
  ×ratio = observed over expected top finishes (×1.00 average) · (range) = 10th–90th percentile rank · % = chance of a top-10 finish`);
    const line = (x) => console.log(`  ${pad(String(x.rank), 3)}${pad(`(${x.rankRange.join("–")})`, 8)} ${pad(Math.round(x.top10 * 100) + "%", 4)} ${pad(name(x).slice(0, 54), 55)} ×${x.ratio}${x.uncertain ? "  uncertain" : ""}${flags(x) ? `  [${flags(x)}]` : ""}`);
    let tier = null;
    for (const x of P.builds.filter((b) => !b.notEnoughData)) {
      if (x.tier && x.tier !== tier) { tier = x.tier; const cut = P.tiers?.[tier]; console.log(`\n  ${tier} TIER${cut ? ` · ×${cut}+` : " · below ×0.65"}`); }
      line(x);
    }
    const thin = P.builds.filter((b) => b.notEnoughData);
    if (thin.length) { console.log(`\n  NOT ENOUGH DATA · almost no record last format and no ${P.set} pilots yet`); thin.forEach(line); }
    console.log(`\n  "uncertain": the score's 80% range spans more than ×2 — could plausibly be several tiers higher or lower`);
    if (q) console.log(`
no build matching "${q}"`);
    console.log(`
scripts/rift poll <legend> for the reasons behind one`);
    return;
  }
  for (const x of hits.slice(0, 3)) {
    const R = x.returning;
    console.log(`
${pad(String(x.rank), 3)}${name(x)} · ${x.tier ? `${x.tier} tier · ` : ""}×${x.ratio} · ranks ${x.rankRange.join("–")} · top-10 ${Math.round(x.top10 * 100)}%${flags(x) ? ` · ${flags(x)}` : ""}`);
    if (x.build) console.log(`  build: ${Math.round(x.share * 100)}% of its ${x.lists} lists · signature ${x.signature.join(", ")}`);
    const Pp = x.popularity;
    console.log(`  RETURNING  ×${R.ratio} — ${x.isNew ? "new legend, no last format" : `${R.O} top finishes against ${R.E} expected last format, shrunk toward ×${R.lastTarget} (what a legend at ${(R.lastShare * 100).toFixed(1)}% of last format's RQ fields converted)`}${R.buildAdj ? `; this build ${R.buildAdj > 0 ? "+" : ""}${R.buildAdj} vs its legend` : ""} · counts ${Math.round(R.carry * 100)}%`);
    console.log(`  POPULARITY ×${Pp.target} — ${(Pp.share * 100).toFixed(1)}% of the field (${Pp.pilots} pilots at ${P.set} events, plus ${(Pp.posted * 100).toFixed(1)}% of posted lists) · counts ${100 - Math.round(R.carry * 100)}%`);
    console.log(!x.judgment.weight ? `  JUDGMENT   not in the score — reasons to talk through (model/preseason-inputs.json):` : `  CARD READS ${x.judgment.points >= 0 ? "+" : ""}${x.judgment.points} points at weight ${x.judgment.weight} (${Object.entries(x.judgment.by).filter(([, v]) => v).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(", ") || "none"}) · without them ×${x.dataOnly?.ratio} (${x.dataOnly?.tier})`);
    for (const r of x.judgment.rows) console.log(`    ${pad(r.component, 10)} ${r.points > 0 ? "+" : ""}${r.points}${r.verified ? "" : " (unverified)"}  ${r.why}`);
    console.log(`  RESULTS    ${x.season.O} top finishes against ${x.season.E} expected in ${P.set} (previews at half) — ${Math.round(x.season.weight * 100)}% of the score`);
  }
}

// field: what Jay will face and how good it is (data/field.json, lib/field.mjs). Counts and
// quotes, no score: the tier is the creators' median grade, the record and the new format's
// play sit beside it, and a thin sample is shown with its count, never used to move a tier.
async function cmdField(args) {
  const F = await readJson(url("field.json")).catch(() => null);
  if (!F) { console.error("no data/field.json — run node scripts/build-field.mjs"); process.exit(1); }
  const tiersView = args.includes("--tiers");
  const forAt = args.indexOf("--for");
  const forQ = forAt > -1 ? args.slice(forAt + 1).join(" ").toLowerCase() : "";
  const q = args.filter((a, i) => !a.startsWith("--") && (forAt < 0 || i < forAt)).join(" ").toLowerCase();
  const short = (n) => n.split(",")[0];
  const pct = (x) => x == null ? "—" : `${Math.round(x * 100)}%`;
  const newFmt = F.events.filter((e) => e.kind !== "last");
  const hidden = newFmt.reduce((t, e) => t + (e.hidden || 0), 0);
  // The new format's evidence leads; last set's record is one labelled column at the end.
  const top16 = (x) => { const n = x.top16.filter((t) => t.kind !== "last").length; return n ? String(n) : "—"; };
  const rec = (x) => x.isNew ? "new" : !x.record?.d1 ? "0 pilots" : x.record.tier ? `${x.record.tier} ${pct(x.record.share)}` : `thin ${pct(x.record.share)}`;
  const exp = (x) => !x.tier ? `? ${x.experts ? `${x.experts.n}×` : "no grades"}` : x.tierFrom === "results" ? `${x.tier} results` : `${x.tier} ${x.experts.n}× ${x.experts.agreement}`;
  const play = (x) => x.pilots ? `${x.pilots}p ${x.play.reduce((t, p) => t + (p.top8 || 0), 0)}t8` : "—";
  const flags = (x) => x.flags.length ? `  [${x.flags.join("; ")}]` : "";
  const H = F.handover || { rqTables: 0, majors: 0 };
  const phase = F.phase === "results" ? "RESULTS-LED: tiers from " + F.set + " results, creators as the cross-check"
    : `${F.phase === "early" ? "EARLY RESULTS" : "a FORECAST"}: tiers are the creators' until the first ${F.set} RQ table or 5 ${F.set} events of ${F.rules.major}+ (${H.majors} so far)`;
  console.log(`FIELD · ${F.set}, legal ${F.legalFrom} · built ${F.generatedAt} · ${phase}
  ${newFmt.length} ${F.set}-format events (${newFmt.map((e) => `${e.name.slice(0, 24)} ${e.players}`).join(" · ")})${hidden ? ` · ${hidden} placeholder lists counted as hidden, not as a legend` : ""}
  tier = ${F.phase === "results" ? `${F.set} results where deep enough, else ` : ""}the creators' median grade · top16 = ${F.set} finishes at ${F.rules.major}+ player events · play = ${F.set} pilots and top 8s · ${F.lastSet} = last set's RQ record and Day 1 share, context only`);
  const head = () => console.log(`  ${pad("legend", 30)} ${pad("tier", 14)} ${pad("top16", 6)} ${pad("play", 9)} ${pad("group", 9)} ${F.lastSet}`);
  const row = (x) => console.log(`  ${pad(x.legend.slice(0, 29), 30)} ${pad(exp(x), 14)} ${pad(top16(x), 6)} ${pad(play(x), 9)} ${pad(x.group, 9)} ${pad(rec(x), 9)}${flags(x)}`);
  const order = ["S", "A", "B", "C", "D", "F"];
  const nTop16 = (x) => x.top16.filter((t) => t.kind !== "last").length;
  const byTier = (a, b) => order.indexOf(a.tier) - order.indexOf(b.tier) || (b.experts?.median ?? 0) - (a.experts?.median ?? 0) || nTop16(b) - nTop16(a) || b.pilots - a.pilots;

  if (forQ) {
    const me = F.legends.find((x) => x.legend.toLowerCase().includes(forQ));
    if (!me) { console.log(`\nno legend matching "${forQ}"`); return; }
    const guides = await guideHeadings();
    const mine = short(me.legend).toLowerCase().replace(/[^a-z0-9]/g, "");
    const opp = F.legends.filter((x) => x.group === "LIKELY" && x !== me).sort((a, b) => b.pilots - a.pilots || (b.record?.share || 0) - (a.record?.share || 0));
    console.log(`\nGAUNTLET for ${me.legend} — the LIKELY field, most played first`);
    for (const x of opp) {
      // Only guides written for the legend being prepared (its file is named after it).
      const g = guides.filter((h) => h.file.includes(mine) && h.text.includes(short(x.legend))).map((h) => h.file);
      console.log(`  ${pad(x.legend.slice(0, 32), 33)} ${pad(play(x), 9)} ${pad(pct(x.record?.share), 5)} tier ${x.tier || "?"}  ${g.length ? `guide: ${[...new Set(g)].join(", ")}` : "no matchup guide"}${x.flags.includes("Aurora builds: opponent only") ? "  (Aurora builds)" : ""}`);
    }
    return;
  }

  const hits = q ? F.legends.filter((x) => x.legend.toLowerCase().includes(q)) : [];
  if (q && hits.length) {
    for (const x of hits.slice(0, 2)) {
      console.log(`\n${x.legend}${x.isNew ? ` · new in ${F.set}` : ""} · tier ${x.tier || "not enough grades"} · ${x.group}${flags(x)}`);
      const e = x.experts;
      console.log(`  CREATORS ${e ? `median ${e.median.toFixed(2)} (${x.tier || "?"}) from ${e.n}, middle half ${e.q1.toFixed(1)}–${e.q3.toFixed(1)}, range ${e.lo.toFixed(1)}–${e.hi.toFixed(1)} · ${e.agreement}` : "none graded it"}`);
      for (const g of x.grades) console.log(`    ${pad(g.id, 22)} ${g.said}`);
      for (const g of x.otherCalls) console.log(`    ${pad(g.id, 22)} ${g.said}  (${g.kind === "strength" ? "not a grade" : g.kind}, not counted)`);
      if (x.jay) console.log(`    ${pad("your call", 22)} ${x.jay}  (kept apart, graded against the creators)`);
      if (x.results?.E > 0) console.log(`  RESULTS  ${x.results.O.toFixed(1)} top finishes against ${x.results.E.toFixed(1)} expected in ${F.set}, recent weighted — ×${x.results.ratio.toFixed(2)}${x.results.tier ? ` (${x.results.tier})` : ", too few to read yet"}${x.tierFrom === "results" ? " · sets the tier" : ""}`);
      const r = x.record;
      console.log(`  ${pad(F.lastSet, 8)} ${x.isNew ? "new legend, no last format" : !r.d1 ? `no pilots at last format's ${r.rqs} RQs` : `${r.d2} Day 2s from ${r.d1} Day 1 pilots at ${r.rqs} RQs, against ${r.E.toFixed(0)} expected — ×${r.ratio.toFixed(2)}${r.tier ? ` (${r.tier})` : ", too few to read"} · ${pct(r.share)} of Day 1`}`);
      const t = x.top16.filter((f) => f.kind !== "last"), tl = x.top16.length - t.length;
      console.log(`  TOP 16   ${t.length} at ${F.set} events of ${F.rules.major}+ players${t.length ? ":" : ""}${tl ? `  (and ${tl} at ${F.lastSet} events in the last ${F.rules.windowDays} days — last set's, context only)` : ""}`);
      for (const f of t.slice(0, 8)) console.log(`    ${f.dt} ${pad(`#${f.pl}`, 4)} of ${pad(f.players, 5)} ${f.ev.slice(0, 60)}${f.kind === "preview" ? "  (preview)" : ""}`);
      if (t.length > 8) console.log(`    … ${t.length - 8} more`);
      console.log(`  ${pad(F.set, 8)} ${x.pilots ? `${x.pilots} pilots:` : "not played at any event yet"}`);
      for (const p of x.play) console.log(`    ${p.dt} ${pad(p.pilots + "p", 4)} ${p.top8 != null ? `${p.top8} top 8` : "top 8 —"}  ${p.winRate != null ? `${pct(p.winRate)} of matches (${p.rounds} rounds)` : ""} ${p.ev.slice(0, 50)} (${p.players})${p.partial ? ` · ${p.partial}` : ""}${p.note ? ` · ${p.note}` : ""}`);
      if (x.aurora) console.log(`  AURORA   ${pct(x.aurora)} of its recent lists run Dazzling Aurora — those are opponent-only (lib/avoid.mjs)`);
      if (x.notes.length) {
        console.log(`  RADIANCE ADDED  card reads, not scored (model/preseason-inputs.json):`);
        for (const n of x.notes) console.log(`    ${n.verified ? "verified  " : "unverified"} ${n.why}`);
      }
    }
    return;
  }

  if (tiersView) {
    console.log(`\nTIERS — ${F.phase === "results" ? `${F.set} results, creators beside them` : `the creators' grades, ${F.set} play beside them`}; "${F.lastSet} record: X" marks last set's record two tiers away, as context`);
    head();
    let t = null;
    for (const x of F.legends.filter((x) => x.tier).sort(byTier)) {
      if (x.tier !== t) { t = x.tier; console.log(`\n  ${t}`); }
      row(x);
    }
    const thin = F.legends.filter((x) => !x.tier);
    if (thin.length) { console.log(`\n  NOT ENOUGH GRADES · under two creators graded it`); thin.sort((a, b) => b.pilots - a.pilots).forEach(row); }
  } else {
    console.log(`\nWHAT YOU WILL FACE — LIKELY at 3+ ${F.set} pilots or 5%+ of last Day 1; POSSIBLE 1–2 pilots or 2–5%`);
    head();
    for (const g of ["LIKELY", "POSSIBLE", "RARE", "UNKNOWN"]) {
      const xs = F.legends.filter((x) => x.group === g).sort((a, b) => b.pilots - a.pilots || (b.record?.share || 0) - (a.record?.share || 0));
      if (!xs.length) continue;
      console.log(`\n  ${g} (${xs.length})`);
      (g === "RARE" ? xs.slice(0, 8) : xs).forEach(row);
      if (g === "RARE" && xs.length > 8) console.log(`  … ${xs.length - 8} more`);
    }
  }
  if (q) console.log(`\nno legend matching "${q}"`);
  console.log(`\nscripts/rift field --tiers · field <legend> for the evidence · field --for <your legend> for a gauntlet`);
}

// Headings in guides/*.md, for matching an opponent to a guide that covers it.
async function guideHeadings() {
  const { readdir } = await import("node:fs/promises");
  const dir = new URL("../guides/", import.meta.url);
  const out = [];
  for (const f of (await readdir(dir)).filter((f) => f.endsWith(".md"))) {
    const text = await readFile(new URL(f, dir), "utf8");
    for (const line of text.split("\n")) if (/^#{1,4} /.test(line)) out.push({ file: `guides/${f}`, text: line });
  }
  return out;
}

// ── versus: one of my decks against a legend's field, card by card ─────────────
// lib/versus.mjs reads what each card does; this picks the lists and prints. Their pool
// is the legal lists played since --since (default: Radiance's first online events),
// optionally one event (--event nova). Shares are over that pool, so a card "in 76%" is in
// three lists of four. Speed is the goldfish (lib/sim.mjs, keep-all, on the play): units
// and Might on board, the same numbers the deck worksheets quote. Nothing here is a win rate.
async function cmdVersus(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const since = opt("--since") || "2026-10-16";
  const event = (opt("--event") || "").toLowerCase();
  const min = Number(opt("--min") || 0.25);
  const deckName = opt("--deck");
  const flags = new Set(["--since", "--event", "--min", "--deck"]);
  const terms = args.filter((a, i) => !a.startsWith("--") && !flags.has(args[i - 1])).map((t) => t.toLowerCase());
  const decks = findDecks(S, deckName || "\u0000");
  if (!terms.length || decks.length !== 1) {
    console.log('usage: versus <legend words> --deck "<one of your decks>" [--event nova] [--since YYYY-MM-DD] [--min 0.25]');
    if (deckName && decks.length !== 1) console.log(`  --deck "${deckName}" matches ${decks.length} decks: ${decks.map((d) => d.name).join(" · ") || "none"}`);
    return;
  }
  const deck = decks[0];
  const snap = await readJson(url("decks.json"));
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const bn = bannedNameSet(banned), std = standardNameSet(banned, cat.cards);
  const { BY } = cat;
  const byName = new Map();
  for (const c of cat.cards) if (!byName.has(c.n) || (!c.v && byName.get(c.n).v)) byName.set(c.n, c);
  const legendOf = (d) => (d.lg && BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const words = (d) => { const l = legendOf(d); return `${d.ln || ""} ${(l?.g || []).join(" ")} ${l?.n || ""}`.toLowerCase(); };
  const lists = snap.decks.filter((d) => (d.dt || "") >= since && deckIsLegal(d, BY, bn, std)
    && terms.every((t) => words(d).includes(t)) && (!event || (d.ev || "").toLowerCase().includes(event)));
  if (!lists.length) { console.log(`No legal lists for "${terms.join(" ")}" since ${since}${event ? ` at "${event}"` : ""}.`); return; }
  const legend = legendOf(lists[0]);
  const champ = (legend?.g || []).find((t) => cat.cards.some((c) => c.n.startsWith(`${t}, `))) || "";
  const vouched = lists.filter((d) => d.tour && d.pl != null);
  const best = vouched.slice().sort((a, b) => a.pl / (a.ec || 1e9) - b.pl / (b.ec || 1e9))[0];

  const weights = weigh(lists, (code) => codeName(BY, code));
  const theirs = [...weights].map(([n, w]) => ({ card: byName.get(n), ...w })).filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t));
  const ours = [
    ...Object.entries(deck.cards || {}).map(([code, qty]) => ({ card: BY.get(code), qty, share: 1 })),
    ...Object.entries(deck.sb || {}).map(([code, qty]) => ({ card: BY.get(code), qty, share: 1, sb: true })),
  ].filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t));
  const V = versus(ours, theirs.filter((r) => r.share >= min || effectsOf(r.card).length && r.share >= min / 2));
  const pct = (x) => `${Math.round(100 * x)}%`.padStart(4);
  const named = (rows) => rows.map((h) => `${h.card.n} ${pct(h.share).trim()}`).join(" · ");

  console.log(`VERSUS  ${deck.name}\n  against ${champ ? champ + ", " : ""}${legend?.n || lists[0].ln} · ${lists.length} legal lists since ${since}${event ? ` at "${event}"` : ""} · ${vouched.length} with a recorded placing${best ? ` (best ${best.pl} of ${best.ec}, ${best.ev})` : ""}`);
  console.log(`  their cards shown when in ${pct(min).trim()}+ of lists (interaction from ${pct(min / 2).trim()}). Card by card; nothing here is a win rate.`);
  {
    // The one win rate: RiftLite's online, user-submitted games (data/winrates.json), legend vs legend.
    const champOf = (c) => (c?.g || []).find((t) => cat.cards.some((x) => x.n.startsWith(`${t}, `)));
    const ourLegend = Object.keys(deck.cards || {}).map((k) => cat.BY.get(k)).find((c) => c?.t === "Legend");
    let W = null;
    try { W = await readJson(url("winrates.json")); } catch { /* reported in the line */ }
    console.log(`  ${matchupLine(W, champOf(ourLegend) || ourLegend?.n || "?", champ || legend?.n || "?")}\n`);
  }

  // Speed: the goldfish on the play, ours against the average of theirs.
  const gold = (list, games) => {
    const d = buildDeck(list, cat); const r = rng(7); let u = 0, m = 0;
    for (let i = 0; i < games; i++) { const g = playGame(d, r, false, POLICIES["keep all"], []); u += g.units[2]; m += g.might[3]; }
    return { u: u / games, m: m / games };
  };
  const me = gold(deck.cards, 4000);
  const sample = lists.slice(0, 30);
  const them = sample.map((d) => gold(d.cards, 600)).reduce((a, x) => ({ u: a.u + x.u / sample.length, m: a.m + x.m / sample.length }), { u: 0, m: 0 });
  console.log(`  SPEED (goldfish, on the play)   units by turn 3   Might by turn 4`);
  console.log(`    yours                         ${me.u.toFixed(1).padStart(4)}              ${me.m.toFixed(1).padStart(4)}`);
  console.log(`    theirs (${sample.length} lists)${" ".repeat(Math.max(1, 19 - String(sample.length).length))}${them.u.toFixed(1).padStart(4)}              ${them.m.toFixed(1).padStart(4)}\n`);

  const reach = (h) => h.kind === "gearkill" ? "a gear" : h.kind === "stun" ? "stun a unit" : h.kind === "move" ? "move a unit"
    : h.kind === "fight" ? `fight: ${h.reachNote}`
    : h.kind === "edict" ? "each player kills one of theirs (you choose yours)"
    : `${h.kind === "damage" ? `${h.max} damage${h.split ? " split" : ""} to` : h.kind} ${h.max == null ? "any unit" : h.kind === "damage" ? "a unit" : `a unit ≤${h.max} Might`}${h.battlefield ? " at a battlefield" : ""}`;
  const speedWord = (s) => (s === "main" ? "their turn" : s === "hidden" ? "from face down" : s);
  console.log(`  THEIR REMOVAL  (in their lists)`);
  for (const h of V.suite) console.log(`    ${pct(h.share)} ${pad(h.card.n, 28)} ${pad(reach(h), 38)} ${speedWord(h.speed)}`);
  console.log(`\n  YOUR UNITS AGAINST IT  (Might outside a fight / in one; any-unit answers above reach every unit)`);
  for (const r of V.theirAnswers) {
    const b = r.body;
    const lim = r.hits.filter((h) => h.limited);
    const outside = lim.filter((h) => h.when !== "always"), always = lim.filter((h) => h.when === "always");
    const safe = V.suite.filter((h) => h.max != null && h.kind !== "gearkill" && !lim.some((x) => x.card.n === h.card.n));
    const parts = [];
    if (always.length) parts.push(`hit by ${named(always)}`);
    if (outside.length) parts.push(`hit outside a fight only by ${named(outside)}`);
    if (safe.length) parts.push(`out of reach of ${safe.map((h) => h.card.n).join(", ")}`);
    console.log(`    ${r.qty}x ${pad(r.card.n, 28)} ${pad(b.might === Math.max(b.attack, b.defend) ? `${b.might}` : `${b.might} / ${Math.max(b.attack, b.defend)}`, 6)} ${parts.join(" · ") || "only the any-unit answers"}`);
  }
  const gk = V.suite.filter((h) => h.kind === "gearkill");
  if (V.ourGear.length) console.log(`    ${V.ourGear.map((r) => `${r.qty}x ${r.card.n}`).join(", ")} (gear): ${gk.length ? `killed by ${named(gk)}` : "no gear removal in their lists"}`);
  console.log(`\n  THEIR COUNTERS TO YOUR SPELLS`);
  for (const r of V.theirCounters) {
    console.log(`    ${r.qty}x ${pad(`${r.card.n} [${r.card.e}E ${r.card.p || 0}P]`, 34)} ${r.hits.length ? r.hits.map((h) => `${h.card.n} ${pct(h.share).trim()} (${h.how})`).join(" · ") : "—"}`);
  }

  console.log(`\n  YOUR ANSWERS TO THEIR UNITS  (biggest first; ✗ = the card can't, sb = sideboard)`);
  for (const r of V.ourAnswers.filter((r) => r.share >= min).sort((a, b) => b.body.might - a.body.might || b.share - a.share)) {
    const b = r.body;
    const tags = [b.deflect ? `Deflect ${b.deflect}` : "", b.tank ? "Tank" : "", b.hidden ? "Hidden" : "", b.ambush ? "Ambush" : "", b.untargetable ? "can't be chosen" : ""].filter(Boolean).join(", ");
    const seen = new Set();
    const fmt = (a) => `${a.ok === false ? "✗ " : ""}${a.card.n}${a.note ? ` (${a.note})` : ""}`;
    const uniq = r.answers.filter((a) => { const k = a.card.n + (a.sb ? "|sb" : ""); if (seen.has(k)) return false; seen.add(k); return true; });
    const main = uniq.filter((a) => !a.sb), sb = uniq.filter((a) => a.sb && !main.some((m) => m.card.n === a.card.n));
    console.log(`    ${pct(r.share)} ×${r.avg.toFixed(1)} ${r.card.n} · ${b.might} Might${b.defend > b.might ? ` (${b.defend} defending)` : ""}${tags ? ` · ${tags}` : ""}`);
    console.log(`         ${main.map(fmt).join(" · ") || "nothing in the main deck"}`);
    if (sb.length) console.log(`         sb: ${sb.map((a) => a.ok === false ? fmt(a) : a.card.n).join(" · ")}`);
  }
  console.log(`\n  THEIR FIGHT TRICKS  (what a fight of yours has to beat)`);
  const byCard = new Map();
  for (const t of V.tricks.filter((t) => t.share >= min / 2)) {
    const what = t.kind === "pump" ? `+${t.n}${t.equip ? " (equipment)" : ""}` : t.kind === "minus" ? `-${t.n}${t.all ? " to all your units" : ""}`
      : t.kind === "redeploy" ? (t.same ? "blinks a unit (saves or resets it)" : "replays a unit to any battlefield") : t.kind === "protect" ? "protects a unit" : t.kind;
    const r = byCard.get(t.card.n) || { t, what: [] };
    r.what.push(what); byCard.set(t.card.n, r);
  }
  for (const { t, what } of byCard.values())
    console.log(`    ${pct(t.share)} ${pad(t.card.n, 28)} ${pad(what.join(" / "), 34)} ${t.speed === "main" ? "their turn only" : speedWord(t.speed)}`);

  const unread = theirs.filter((r) => r.share >= min && looksInteractive(r.card) && !effectsOf(r.card).length && !/Unit/.test(r.card.t));
  if (unread.length) console.log(`\n  NOT READ (looks like interaction; check by hand): ${named(unread)}`);
}

// ── try: one proposed change, measured the same way whoever proposed it ───────
// lib/decklab.mjs. Before and after, side by side: rules, shape, the goldfish with the
// legend's Gold and hiding (what you can use, not what you hold), and the field: the S and
// A tiers of data/field.json, each legend's legal lists since --since, weighted by
// popularity (lists) and by results (placings). Changes: "+Name", "-2 Name", "sb+Name".
async function cmdTry(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const since = opt("--since") || "2026-10-16";
  const games = Number(opt("--games") || 20000);
  const flags = new Set(["--since", "--deck", "--games", "--policy", "--sweep", "--with", "--qty", "--points-games", "--close-games", "--hold-up"]);
  // --hold-up W (model games only): what a reaction kept for their turn is worth to the solver, both sides (lib/turn.mjs
  // heldValue; calibrate --hold-up). Points games only (not --close). Off by default; without it the options are exactly as before.
  const holdUp = Number(opt("--hold-up")) || 0, hu = holdUp ? { solve: { ...POLICY_SOLVE, holdUp } } : {};
  const specs = args.filter((a, i) => !flags.has(a) && !flags.has(args[i - 1]) && a !== "--no-engine" && a !== "--points" && a !== "--close" && a !== "--greedy");
  // Model games' policy: the turn solver (default since 24 Nov) or --greedy (the older plain policy, ~90x faster).
  const mpolicy = args.includes("--greedy") ? "greedy" : "solver";
  // --policy "holdUp=3,dais,bandleTree,keepForEvelynn=false": how you play, for the engine report.
  const policy = {};
  for (const kv of (opt("--policy") || "").split(",").map((x) => x.trim()).filter(Boolean)) {
    const [k, v] = kv.split("="); policy[k] = v == null ? true : v === "false" ? false : isNaN(Number(v)) ? v : Number(v);
  }
  const sweepCard = opt("--sweep"), sweepWith = (opt("--with") || "").split(/;/.test(opt("--with") || "") ? ";" : ",").map((x) => x.trim()).filter(Boolean);
  const decks = findDecks(S, opt("--deck") || "\u0000");
  if (decks.length !== 1 || (!specs.length && !sweepCard && !args.includes("--close"))) {
    console.log('usage: try --deck "<one of your decks>" "-Card" "+Card" ["-2 Card"] ["sb+Card"] [--policy "holdUp=3,dais"] [--no-engine] [--points] [--close] [--hold-up 0.5] [--greedy]   (--greedy: model games on the old plain policy, ~90x faster)');
    console.log('       try --deck "<one of your decks>" --sweep "Card in the deck" --with "Candidate A, Candidate B" (or "A; B" when a name has a comma) [--policy …]');
    if (opt("--deck") && decks.length !== 1) console.log(`  --deck matches ${decks.length} decks: ${decks.map((d) => d.name).join(" · ") || "none"}`);
    return;
  }
  const before = decks[0];
  if (sweepCard) return trySweep(before, cat, sweepCard, sweepWith, policy, Number(opt("--games") || 3000), opt("--qty") ? Number(opt("--qty")) : null, since, Number(opt("--points-games")) || 60);
  let changes, after;
  try { changes = parseChanges(specs, cat.cards); after = applyChanges(before, changes, cat.cards, cat.BY); }
  catch (e) { console.log(`try: ${e.message}`); return; }

  // The field: S and A tiers, as data/field.json grades them today.
  const field = await readJson(url("field.json"));
  const tiers = field.legends.filter((l) => l.tier === "S" || l.tier === "A");
  const snap = await readJson(url("decks.json"));
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const bn = bannedNameSet(banned), std = standardNameSet(banned, cat.cards);
  const byName = new Map();
  for (const c of cat.cards) if (!byName.has(c.n) || (!c.v && byName.get(c.n).v)) byName.set(c.n, c);
  const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const pool = snap.decks.filter((d) => (d.dt || "") >= since && deckIsLegal(d, cat.BY, bn, std));
  const fieldDecks = tiers.map((t) => {
    const title = t.legend.replace(/ - Starter$/, "");
    const lists = pool.filter((d) => { const l = legendOf(d); const n = (l?.n || d.ln || "").replace(/ - Starter$/, ""); return title === n || title.endsWith(`, ${n}`); });
    const theirs = [...weigh(lists, (code) => codeName(cat.BY, code))].map(([n, w]) => ({ card: byName.get(n), ...w }))
      .filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t) && (r.share >= 0.25 || (effectsOf(r.card).length && r.share >= 0.125)));
    return { label: `${title} (${t.tier})`, n: lists.length, placed: lists.filter((d) => d.tour && d.pl != null).length, theirs, lists };
  }).filter((fd) => fd.n);

  const keys = [...new Set([...answerNames(before, cat.BY), ...answerNames(after, cat.BY)])];
  const gold = (deck) => {
    const d = buildDeck(deck.cards, cat);
    const out = {};
    for (const side of ["play", "draw"]) {
      const r = rng(1); const gs = [];
      for (let i = 0; i < games / 2; i++) gs.push(playGame(d, r, side === "draw", POLICIES["keep all"], keys, null, { hide: true }));
      const avg = (f) => gs.reduce((a, g) => a + f(g), 0) / gs.length;
      out[side] = { energy: avg((g) => g.spent.slice(0, 4).reduce((a, b) => a + b, 0)), u2: avg((g) => g.units[1]), u3: avg((g) => g.units[2]),
        two3: avg((g) => (g.units[2] >= 2 ? 1 : 0)), stuck: avg((g) => (g.stuck[2] ? 1 : 0)), down4: avg((g) => g.facedown[3]),
        ans3: avg((g) => (g.answer[2] ? 1 : 0)), ans5: avg((g) => (g.answer[4] ? 1 : 0)) };
    }
    return out;
  };
  const rows = [];
  const add = (label, b, a, fmt, better = 0) => rows.push({ label, b, a, fmt, better });
  const pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`), n1 = (x) => (x == null ? "—" : x.toFixed(1)), n2 = (x) => (x == null ? "—" : x.toFixed(2)), n0 = (x) => String(x);

  const chB = deckChecks(before, cat.idx).filter((k) => k.ok === false).map((k) => k.label);
  const chA = deckChecks(after, cat.idx).filter((k) => k.ok === false).map((k) => k.label);
  const sB = shapeOf(before, cat.BY), sA = shapeOf(after, cat.BY);
  const gB = gold(before), gA = gold(after);
  const fB = fieldOf(before, cat.BY, fieldDecks), fA = fieldOf(after, cat.BY, fieldDecks);

  console.log(`TRY  ${before.name}\n  ${changes.map((c) => `${c.qty > 0 ? "+" : ""}${c.qty} ${c.name}${c.side === "sb" ? " (sideboard)" : ""}`).join(" · ")}`);
  console.log(`  rules: before ${chB.length ? "FAIL " + chB.join(", ") : "all pass"} · after ${chA.length ? "FAIL " + chA.join(", ") : "all pass"}`);
  {
    const bl = [...new Set([...blindSpots(before.cards, cat.BY), ...blindSpots(after.cards, cat.BY)])];
    const bd = [...new Set([...blindSpots(before.cards, cat.BY, "board"), ...blindSpots(after.cards, cat.BY, "board")])];
    console.log(`  the bench can't see: ${bl.length ? bl.join(", ") : "none of the resource text"}; it measures consistency only, so ${bd.length} cards' board and combat text (and every attack, conquest and point) is the points model's (--points, --close)`);
  }
  console.log(`  answers the goldfish tracks (any size, usable on their turn): ${keys.join(", ") || "none"}`);
  console.log(`  field: ${fieldDecks.length} S/A legends, ${fieldDecks.reduce((a, f) => a + f.n, 0)} lists since ${since} (${fieldDecks.reduce((a, f) => a + f.placed, 0)} placed)\n`);

  add("SHAPE  main cards / sideboard", `${sB.cards} / ${sB.side}`, `${sA.cards} / ${sA.side}`, n0);
  add("  units · spells · gear", `${sB.units} · ${sB.spells} · ${sB.gear}`, `${sA.units} · ${sA.spells} · ${sA.gear}`, n0);
  add("  cheap (≤2 Energy)", sB.cheap, sA.cheap, n0, 1);
  add("  5+ Energy", sB.big, sA.big, n0, -1);
  add("  average cost", sB.avg, sA.avg, n2);
  add("  Hidden (spells and gear)", `${sB.hidden} (${sB.hiddenNonUnit})`, `${sA.hidden} (${sA.hiddenNonUnit})`, n0);
  add("  printed Power", JSON.stringify(sB.power).replace(/[{}"]/g, ""), JSON.stringify(sA.power).replace(/[{}"]/g, ""), n0);
  for (const side of ["play", "draw"]) {
    const B = gB[side], A = gA[side];
    add(`GOLDFISH ${side}  Energy turns 1–4`, B.energy, A.energy, n1, 1);
    add("  units by turn 2 / 3", `${n1(B.u2)} / ${n1(B.u3)}`, `${n1(A.u2)} / ${n1(A.u3)}`, n0);
    add("  two units by turn 3", B.two3, A.two3, pc, 1);
    add("  stuck on colour, turn 3", B.stuck, A.stuck, pc, -1);
    add("  face down by turn 4", B.down4, A.down4, n1, 1);
    add("  an answer usable on their turn, t3 / t5", `${pc(B.ans3)} / ${pc(B.ans5)}`, `${pc(A.ans3)} / ${pc(A.ans5)}`, n0);
  }
  const both = (x, f) => `${f(x.pop)} · ${f(x.res)}`;
  add("FIELD (popularity · results)  Defy-countered spells, expected", both(fB.defyHits, n1), both(fA.defyHits, n1), n0);
  add("  answer copies per regular 6+ unit", both(fB.bigAns, n1), both(fA.bigAns, n1), n0);
  add("    of which free from face down", both(fB.bigFree, n1), both(fA.bigFree, n1), n0);
  add("  unit exposure to Might-limited removal", both(fB.exposed, pc), both(fA.exposed, pc), n0);
  if (fB.blastAlone.pop != null || fA.blastAlone.pop != null) add("  their unit copies a blast kills alone", both(fB.blastAlone, pc), both(fA.blastAlone, pc), n0);

  const w = Math.max(...rows.map((r) => r.label.length)) + 2;
  console.log(`  ${pad("", w)}${pad("before", 22)}${pad("after", 22)}`);
  for (const r of rows) {
    const f = (v) => (typeof v === "number" ? r.fmt(v) : v);
    // An arrow only where the shown value moved: below display precision is noise.
    const delta = typeof r.b === "number" && typeof r.a === "number" && f(r.a) !== f(r.b) ? `  ${r.a > r.b ? "▲" : "▼"}` : "";
    console.log(`  ${pad(r.label, w)}${pad(f(r.b), 22)}${pad(f(r.a), 22)}${delta}`);
  }
  printAnswerDelta(before, after, cat, fieldDecks);
  let rb = null, ra = null;
  if (!args.includes("--no-engine")) {
    const eg = Math.max(2000, Math.round(games / 4));
    rb = engineReport(before, cat, { games: eg, policy, foes: foesOf(before, cat, fieldDecks) });
    ra = engineReport(after, cat, { games: eg, policy, foes: foesOf(after, cat, fieldDecks) });
    printEngine(rb, ra, policy, eg);
  }
  // The points model is opt-in: it plays whole games on a plain policy and is not fit to rank
  // decks (README, lib/match.mjs). Its goal-tier rows read "—" without it.
  let pb = null, pa = null;
  if (args.includes("--points")) {
    const pg = Number(opt("--points-games")) || (mpolicy === "greedy" ? 600 : 60), foes = foeLists(fieldDecks);
    [pb, pa] = await Promise.all([matchReportPar(before, cat, foes, { games: pg, policy: mpolicy, ...hu }), matchReportPar(after, cat, foes, { games: pg, policy: mpolicy, like: before.cards, ...hu })]);
    printPoints(pb, pa, pg, mpolicy);
    if (holdUp) console.log(`  hold-up ${holdUp}: both sides value a reaction kept for the other's turn (off by default)`);
  }
  // The turn solver on model boards (lib/turn.mjs): opt-in, like the points model.
  if (args.includes("--close")) {
    const cg = Number(opt("--close-games")) || (mpolicy === "greedy" ? 300 : 60), foes = foeLists(fieldDecks);
    const [cb, ca] = await Promise.all([closeReportPar(before, cat, foes, { games: cg, policy: mpolicy }), specs.length ? closeReportPar(after, cat, foes, { games: cg, policy: mpolicy, like: before.cards }) : null]);
    printClose(cb, ca, cg, mpolicy);
    if (holdUp) console.log(`  hold-up isn't applied here: the closing search asks what wins this turn, and its boards come from closeGame's own games (lib/turn.mjs)`);
  }
  // The deck's goal tiers, if its worksheet has a tiers file: the change read against the plan.
  const spec = await loadTiers(before.name);
  if (spec) {
    const tb = scoreTiers(spec, { shape: sB, field: fB, engine: rb?.scenarios, points: pb }, { shape: sA, field: fA, engine: ra?.scenarios, points: pa });
    printTiers(tb, spec);
  }
  console.log(`\n  Card text and counts only: nothing here is a win rate. Read it against the deck's goal tiers in its worksheet.`);
}

// The change read as answers (lib/versus.mjs): for each S/A legend's units in 25%+ of its
// lists, the main-deck answer copies before and after. Shown only where the count moved, and
// any unit left with none. Card text, no score.
function printAnswerDelta(before, after, cat, fieldDecks) {
  const rowsOf = (deck) => [
    ...Object.entries(deck.cards || {}).map(([code, qty]) => ({ card: cat.BY.get(code), qty, share: 1 })),
    ...Object.entries(deck.sb || {}).map(([code, qty]) => ({ card: cat.BY.get(code), qty, share: 1, sb: true })),
  ].filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t));
  const copies = (deck, theirs) => {
    const qty = new Map(); for (const r of rowsOf(deck)) if (!r.sb) qty.set(r.card.n, (qty.get(r.card.n) || 0) + r.qty);
    const V = versus(rowsOf(deck), theirs);
    return new Map(V.ourAnswers.filter((r) => r.share >= 0.25).map((r) => {
      const live = new Set(r.answers.filter((a) => !a.sb && a.ok !== false).map((a) => a.card.n));
      return [r.card.n, { n: [...live].reduce((s, n) => s + (qty.get(n) || 0), 0), share: r.share }];
    }));
  };
  // One line per legend and move ("9 → 10: Riven, Broken Blade, Astral Heron"), so a swap that
  // touches every unit reads as one line, not twenty.
  const lines = [];
  for (const fd of fieldDecks) {
    const B = copies(before, fd.theirs), A = copies(after, fd.theirs);
    const groups = new Map();
    for (const [n, a] of A) {
      const b = B.get(n)?.n ?? 0;
      if (a.n === b && a.n > 0) continue;
      const k = `${b} → ${a.n}${a.n === 0 ? " NO ANSWER" : a.n > b ? " ▲" : a.n < b ? " ▼" : ""}`;
      groups.set(k, [...(groups.get(k) || []), `${n} ${Math.round(100 * a.share)}%`]);
    }
    for (const [k, units] of groups) lines.push(`    ${pad(fd.label, 34)} ${pad(k, 16)} ${units.slice(0, 3).join(", ")}${units.length > 3 ? ` +${units.length - 3} more` : ""}`);
  }
  console.log(`\n  ANSWERS  main-deck copies that answer each S/A unit in 25%+ of its lists (lib/versus.mjs); only what moved, or has none`);
  console.log(lines.length ? lines.join("\n") : "    no change");
}

// ── gaps: what the card readers don't act on ─────────────────────────────────
// Every card the S/A field runs (25%+ of a legend's lists), with each sentence that looks
// like it changes a fight, a target or the board and that lib/versus.mjs reads as nothing.
// A gap here is a place a versus or try answer can be silently wrong. Unknown, printed.
async function cmdGaps(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const since = opt("--since") || "2026-10-16", top = Number(opt("--top")) || 40;
  const fieldDecks = await fieldDecksFor(cat, since);
  const by = new Map();
  for (const fd of fieldDecks) for (const r of fd.theirs) {
    if (r.share < 0.25) continue;
    const g = by.get(r.card.n) || { card: r.card, share: 0, legends: [] };
    g.legends.push(`${fd.label.split(",")[0]} ${Math.round(100 * r.share)}%`);
    g.share = Math.max(g.share, r.share); by.set(r.card.n, g);
  }
  const rows = [...by.values()].map((g) => ({ ...g, unread: unreadSentences(g.card) })).filter((g) => g.unread.length)
    .sort((a, b) => b.share - a.share);
  console.log(`GAPS  ${by.size} cards in 25%+ of an S/A legend's lists since ${since}: ${rows.length} with a sentence the readers don't act on`);
  console.log(`  (lib/versus.mjs unreadSentences: looks like it changes a fight, a target or the board; check by hand before trusting versus or try on it)\n`);
  for (const g of rows.slice(0, top)) {
    console.log(`  ${g.card.n}  · ${g.legends.slice(0, 3).join(", ")}${g.legends.length > 3 ? ` +${g.legends.length - 3}` : ""}`);
    for (const s of g.unread) console.log(`      ${s.length > 150 ? s.slice(0, 147) + "…" : s}`);
  }
  if (rows.length > top) console.log(`\n  … ${rows.length - top} more (--top N)`);
}

// decklab/<deck>.tiers.json whose "deck" names this deck.
async function loadTiers(deckName) {
  const { readdir } = await import("node:fs/promises");
  const dir = new URL("../decklab/", import.meta.url);
  for (const f of (await readdir(dir).catch(() => [])).filter((x) => x.endsWith(".tiers.json"))) {
    const spec = await readJson(new URL(f, dir)).catch(() => null);
    if (spec && deckName.toLowerCase().includes(String(spec.deck).toLowerCase())) return { ...spec, file: `decklab/${f}` };
  }
  return null;
}
function printTiers(tiers, spec) {
  const f = (v, m) => (v == null ? "—" : /answered|fizz|two2|stuck|exposed/.test(m.key) ? `${Math.round(100 * v)}%` : Number.isInteger(v) ? String(v) : v.toFixed(2));
  console.log(`\n  GOAL TIERS (${spec.file}): read the change against the plan, top tier first`);
  for (const t of tiers) {
    const better = t.rows.filter((r) => r.verdict === "better").length, worse = t.rows.filter((r) => r.verdict === "worse").length;
    console.log(`    tier ${t.tier} — ${t.goal}: ${better} better, ${worse} worse`);
    for (const r of t.rows) {
      const target = r.min != null || r.max != null ? ` (target ${r.min ?? ""}–${r.max ?? ""}${r.inAfter === false ? ", OUT" : ""})` : "";
      const mark = r.verdict === "better" ? "▲" : r.verdict === "worse" ? "▼" : " ";
      console.log(`      ${mark} ${r.label.padEnd(44)} ${f(r.before, r).padStart(7)} → ${f(r.after, r).padEnd(7)}${target}`);
    }
  }
}

// The engine report, before and after: eight turns, all three scenarios, the same policy.
function printEngine(rb, ra, policy, games) {
  const pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`), n1 = (x) => (x == null ? "—" : x.toFixed(1)), n2 = (x) => (x == null ? "—" : x.toFixed(2));
  console.log(`\n  ENGINE (lib/sim.mjs, ${games} games a scenario, 8 turns, hiding on; policy ${JSON.stringify({ keepForEvelynn: true, holdUp: 0, dais: false, ...policy }).replace(/[{}"]/g, "")})`);
  const rows = [["units by turn 5", "u5", n1], ["Might by turn 5", "m5", n1], ["attacks answered (Switcheroo, Star-Crossed…)", "answered", pc],
    ["Evelynn's points by turn 8", "evelynn", n2], ["Fizz finds a spell", "fizz", pc], ["Matriarch revives a game", "revives", n2],
    ["replays a game (Star-Crossed, Dais)", "replays", n2], ["tricks crowded out by Energy", "tricksBlocked", n2], ["extra cards drawn", "drawn", n1],
    ["Evelynn taken off the board a game", "eveRemoved", n2], ["her battlefield lost a game", "eveLost", n2],
    ["Mercenary on: turns 4–8, 2+ Power spent", "merc", pc], ["kills a game (readies the legend)", "kills", n2], ["Gold made a game", "goldMade", n2]];
  console.log(`  ${"".padEnd(46)}${["quiet", "normal", "heavy"].map((x) => x.padEnd(22)).join("")}`);
  for (const [label, key, f] of rows) {
    const cells = ["quiet", "normal", "heavy"].map((s) => { const b = rb.scenarios[s][key], a = ra.scenarios[s][key]; const fb = f(b), fa = f(a);
      return `${fb === fa ? fb : `${fb} → ${fa}`}`.padEnd(22); });
    console.log(`  ${label.padEnd(46)}${cells.join("")}`);
  }
  console.log(`  scenarios: ${Object.entries(SCENARIOS).map(([k, v]) => `${k} ${JSON.stringify(v).replace(/[{}"]/g, "") || "no pressure"}`).join(" · ")}`);
  if (rb.foes) console.log(`  normal and heavy play one of ${rb.foes} real S/A lists: its removal goes at Evelynn, its big unit at her battlefield (foesOf)`);
}

// The S and A legends' legal lists since `since`, with their weighted cards (try and its sweeps).
async function fieldDecksFor(cat, since) {
    const field = await readJson(url("field.json")), snap = await readJson(url("decks.json"));
    const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
    const bn = bannedNameSet(banned), std = standardNameSet(banned, cat.cards);
    const byName = new Map(); for (const c of cat.cards) if (!byName.has(c.n) || (!c.v && byName.get(c.n).v)) byName.set(c.n, c);
    const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
    const pool = snap.decks.filter((d) => (d.dt || "") >= since && deckIsLegal(d, cat.BY, bn, std));
    return field.legends.filter((l) => l.tier === "S" || l.tier === "A").map((t) => {
      const title = t.legend.replace(/ - Starter$/, "");
      const lists = pool.filter((d) => { const n = (legendOf(d)?.n || d.ln || "").replace(/ - Starter$/, ""); return title === n || title.endsWith(`, ${n}`); });
      const theirs = [...weigh(lists, (code) => codeName(cat.BY, code))].map(([n, w]) => ({ card: byName.get(n), ...w }))
        .filter((r) => r.card && !/Legend|Rune|Battlefield/.test(r.card.t) && (r.share >= 0.25 || (effectsOf(r.card).length && r.share >= 0.125)));
      return { label: title, n: lists.length, placed: lists.filter((d) => d.tour && d.pl != null).length, theirs, lists };
    }).filter((fd) => fd.n);
}

// One slot, many candidates: the same engine report for each, compact, against the deck as is.
async function trySweep(deck, cat, card, candidates, policy, games, qtyOpt, since, pgames = 60) {
  const inDeck = Object.entries(deck.cards || {}).filter(([k]) => cat.BY.get(k)?.n.toLowerCase().startsWith(card.toLowerCase()));
  if (!inDeck.length) { console.log(`try --sweep: the main deck has no "${card}"`); return; }
  const name = cat.BY.get(inDeck[0][0]).n, have = inDeck.reduce((a, [, q]) => a + q, 0), qty = Math.min(qtyOpt || have, have);
  // The field is the same S/A field try uses: the opponents under pressure, and the tiers' field measures.
  const spec = await loadTiers(deck.name);
  const fieldDecks = await fieldDecksFor(cat, since);
  const base = engineReport(deck, cat, { games, policy, foes: foesOf(deck, cat, fieldDecks) });
  const foes = foeLists(fieldDecks);   // --points-games (60): for intervals and many candidates use `rift search`
  const basePts = await matchReportPar(deck, cat, foes, { games: pgames });
  const tierWord = (after, rep, pts) => {
    if (!spec) return "";
    const tb = scoreTiers(spec, { shape: shapeOf(deck, cat.BY), field: fieldOf(deck, cat.BY, fieldDecks), engine: base.scenarios, points: basePts },
      { shape: shapeOf(after, cat.BY), field: fieldOf(after, cat.BY, fieldDecks), engine: rep.scenarios, points: pts });
    return "  " + tb.map((t) => { const b = t.rows.filter((r) => r.verdict === "better").length, w = t.rows.filter((r) => r.verdict === "worse").length; return `t${t.tier === "always" ? "*" : t.tier}:${b ? "+" + b : ""}${w ? "−" + w : ""}${!b && !w ? "=" : ""}`; }).join(" ");
  };
  const pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`);
  const line = (label, r) => { const N = r.scenarios.normal, H = r.scenarios.heavy, Q = r.scenarios.quiet;
    return `  ${label.padEnd(34)} ${r.pts.points8.toFixed(2).padStart(6)} ${r.pts.theirPoints8.toFixed(2).padStart(6)} ${Q.energy.toFixed(1).padStart(6)} ${pc(Q.two2).padStart(6)} ${N.u5.toFixed(1).padStart(6)} ${H.u5.toFixed(1).padStart(6)} ${pc(N.answered).padStart(7)} ${pc(H.answered).padStart(7)} ${N.evelynn.toFixed(2).padStart(7)} ${pc(N.fizz).padStart(6)} ${N.revives.toFixed(2).padStart(6)} ${N.tricksBlocked.toFixed(2).padStart(6)}`; };
  console.log(`SWEEP  ${deck.name}: ${qty} of ${have} ${name} → each candidate (${games} games a scenario, 8 turns; policy ${JSON.stringify({ keepForEvelynn: true, ...policy }).replace(/[{}"]/g, "")})`);
  console.log(`  ${"".padEnd(34)} ${"pts8".padStart(6)} ${"thr8".padStart(6)} ${"Energy".padStart(6)} ${"2u t2".padStart(6)} ${"u5 nrm".padStart(6)} ${"u5 hvy".padStart(6)} ${"ans nrm".padStart(7)} ${"ans hvy".padStart(7)} ${"Eve pts".padStart(7)} ${"Fizz".padStart(6)} ${"revive".padStart(6)} ${"crowd".padStart(6)}`);
  base.pts = basePts;
  console.log(line(`as is (${qty} ${name})`, base));
  for (const cand of candidates) {
    let after;
    try { after = applyChanges(deck, parseChanges([`-${qty} ${name}`, `+${qty} ${cand}`], cat.cards), cat.cards, cat.BY); }
    catch (e) { console.log(`  ${cand}: ${e.message}`); continue; }
    const rules = deckChecks(after, cat.idx).filter((x) => x.ok === false).map((x) => x.label);
    const rep = engineReport(after, cat, { games, policy, foes: foesOf(after, cat, fieldDecks) });
    const pts = rep.pts = await matchReportPar(after, cat, foes, { games: pgames, like: deck.cards });
    console.log(line(`${qty} ${parseChanges([`+${cand}`], cat.cards)[0].name}${rules.length ? " (rules: " + rules.join(", ") + ")" : ""}`, rep) + tierWord(after, rep, pts));
  }
  console.log(`  pts8 / thr8 = our and their points by turn 8 (lib/match.mjs, ${pgames} model games) · Energy = spent turns 1–4 (quiet) · 2u t2 = two units by turn 2 · u5 = units by turn 5 · ans = attacks answered · Eve pts = Evelynn's points by turn 8 (normal) · crowd = tricks crowded out by Energy (normal). Not win rates.`);
  if (spec) console.log(`  t0…t4, t* = the goal tiers (${spec.file}): measures better (+) or worse (−) past the noise, = for no change.`);
}

// ── search: many swaps, the same model games, games added while a swap is still in ──────────────────────────────
// lib/search.mjs. Ranks candidate changes by margin at turn 8 against the S/A field (paired with the deck as it is), and
// drops one only when it is clearly worse than the leader. Points model only: run `try --close` on what's left.
//   search --deck "<name>" --cands decklab/<file>.json      [{ "label": "C1", "changes": ["-1 Ember Monk", "+1 Ezreal, Prodigy"] }, …]
//   search --deck "<name>" --swap "-1 Ember Monk | +1 Ezreal, Prodigy" --swap "…"
//   [--games 60] [--budget 2400] [--keep 3] [--greedy] [--since DATE]
async function cmdSearch(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const all = (k) => args.flatMap((a, i) => (args[i - 1] === k ? [a] : []));
  const decks = findDecks(S, opt("--deck") || "\u0000");
  let specs = all("--swap").map((s) => ({ label: s, changes: s.split("|").map((x) => x.trim()).filter(Boolean) }));
  if (opt("--cands")) specs = specs.concat(JSON.parse(await readFile(new URL(`../${opt("--cands")}`, import.meta.url), "utf8")));
  if (decks.length !== 1 || !specs.length) {
    console.log('usage: search --deck "<one of your decks>" (--cands decklab/<file>.json | --swap "-1 A | +1 B" …) [--games 60] [--budget 2400] [--keep 3] [--hold-up 0.5] [--greedy]');
    if (opt("--deck") && decks.length !== 1) console.log(`  --deck matches ${decks.length} decks: ${decks.map((d) => d.name).join(" · ") || "none"}`);
    return;
  }
  const base = decks[0], since = opt("--since") || "2026-10-16", policy = args.includes("--greedy") ? "greedy" : "solver";
  const games = Number(opt("--games") || (policy === "greedy" ? 400 : 60)), budget = Number(opt("--budget") || games * 40), keep = Number(opt("--keep") || 3);
  const holdUp = Number(opt("--hold-up")) || 0, hu = holdUp ? { solve: { ...POLICY_SOLVE, holdUp } } : {};   // as in try --hold-up
  const cands = [];
  for (const sp of specs) {
    try {
      const ch = parseChanges(sp.changes, cat.cards), deck = applyChanges(base, ch, cat.cards, cat.BY);
      const main = ch.filter((c) => c.side !== "sb");
      cands.push({ label: sp.label, deck, changed: main.reduce((a, c) => a + Math.abs(c.qty), 0) / 2, side: ch.length - main.length,
        rules: deckChecks(deck, cat.idx).filter((k) => k.ok === false).map((k) => k.label) });
    } catch (e) { console.log(`  ${sp.label}: ${e.message}`); }
  }
  const foes = foeLists(await fieldDecksFor(cat, since));
  const t0 = Date.now();
  console.log(`SEARCH  ${base.name}: ${cands.length} candidates, ${games} model games each to start (${policy}), doubled while a candidate is still in; budget ${budget} games${holdUp ? `; hold-up ${holdUp}` : ""}`);
  const res = await halving({ base: { label: "as is", deck: base }, cands, games, budget, keep,
    play: (deck, start, end) => matchRecordsPar(deck, cat, foes, { start, games: end, policy, like: base.cards, ...hu }), log: (m) => console.log(`  ${m}`) });
  const sg = (x) => `${x >= 0 ? "+" : ""}${x.toFixed(2)}`, pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`);
  const iv = (d) => (d.n ? `${sg(d.mean)} (${sg(d.lo)} to ${sg(d.hi)})` : "—");
  console.log(`\n  ${"candidate".padEnd(40)}${"games".padStart(6)}  ${"margin vs as is (95%)".padEnd(26)}${"points vs as is (95%)".padEnd(26)}${"won (95%)".padEnd(16)}pre-flight`);
  const b = res.base;
  console.log(`  ${"as is".padEnd(40)}${String(b.games).padStart(6)}  ${"".padEnd(26)}${"".padEnd(26)}${`${pc(b.won.p)} (${pc(b.won.lo)}–${pc(b.won.hi)})`.padEnd(16)}`);
  for (const r of res.rows) {
    const c = cands.find((x) => x.label === r.label);
    const pre = [`${c.changed} main change${c.changed === 1 ? "" : "s"}${c.side ? ` + ${c.side} sideboard` : ""}`, c.rules.length ? `rules: ${c.rules.join(", ")}` : "rules pass"].join(" · ");
    console.log(`  ${(r.out ? "  " : "▸ ") + r.label.slice(0, 37).padEnd(38)}${String(r.games).padStart(6)}  ${iv(r.vsBase).padEnd(26)}${iv(r.points).padEnd(26)}${`${pc(r.won.p)} (${pc(r.won.lo)}–${pc(r.won.hi)})`.padEnd(16)}${pre}`);
    if (r.out) console.log(`      out ${r.out}`);
  }
  const errs = [res.base, ...res.rows].reduce((a, r) => a + (r.solveErrors || 0), 0);
  if (errs) console.log(`\n  SOLVER ERRORS: ${errs} Main Phases skipped because the solver threw; the table is wrong until that's fixed`);
  console.log(`\n  ▸ still in: not shown worse than the leader, which is not the same as better than the deck as is (read "margin vs as is").`);
  console.log(`  Margin = our points minus theirs by turn 8 in model games against real S/A lists, the same games for every row. Sideboard changes don't play here.`);
  console.log(`  How far the model's swap rankings track good finishes (docs/model-calibration.md, Swaps, 24 Nov): r 0.31 (0.07 to 0.52) over 64 swaps in 8 legends, the same sign 30 of 48 times; weakest on Yordle's and Rengar's Reckless Innovator, Edge of Night, Ride the Wind and Nidalee swaps, which Sivir runs. Then \`try --close\` and the deck-build skill on what's left. ${res.spent} games, ${Math.round((Date.now() - t0) / 1000)} s.`);
}

// ── calibrate: model games against RiftLite's real win rates ─────────────────────────────────────────────────────
// lib/calibrate.mjs. Each of the top legends (by RiftLite games) plays its best list against the others' top lists,
// both seats; the model's win rate per legend is set beside RiftLite's pooled row over the same opponents.
//   calibrate [--legends 12] [--reps 4] [--lists 3] [--since 2026-10-16] [--greedy] [--write]
// Lists are not filtered by today's bans: RiftLite's window is mostly before the 23 Nov bans, so the model plays the
// lists those games were played with. --write puts the result in docs/model-calibration.md.
// ── calibrate --swaps: does the model rank one-card changes the way good finishes do? ───────────────────────────
// For each legend with the most placed lists: its typical good finish (the medoid) is the base; each card's lift is its
// mean copies in good-finish lists minus in the legend's other placed lists (lib/calibrate.mjs lifts); one-card swaps are
// picked in lift order, toward winners and away (pickSwaps). The model's effect is the paired margin by turn 8 over the
// same games against the S/A field, the swap keeping the base's card order (like). Real and model effects are then set
// side by side: the deckbuilding question, where the legend table (plain calibrate) asks a different one.
//   calibrate --swaps [--legends 8] [--min 80] [--k 4] [--games 240] [--since 2026-10-16] [--hidden] [--open-down] [--hold-up W] [--caution C] [--no-defend-all] [--write]
//     [--only "Yordle;Rengar"] [--card "Reckless Innovator;Nidalee, Cat Form"]   narrow re-run: those legends, swaps of those cards
// The legends, bases and swaps `calibrate --swaps` plays; `rift trace` reads the same ones.
async function swapSets(cat, opt) {
  const since = opt("--since") || "2026-10-16", N = Number(opt("--legends") || 8), MIN = Number(opt("--min") || 80), K = Number(opt("--k") || 4);
  const list = (k) => (opt(k) ? opt(k).split(";").map((x) => x.trim().toLowerCase()).filter(Boolean) : null);
  const only = list("--only"), cardsOnly = list("--card");
  const snap = await readJson(url("decks.json"));
  const card = (code) => cat.BY.get(code);
  const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const by = {};
  for (const d of snap.decks) {
    if ((d.dt || "") < since || !isRecord(d)) continue;
    const l = legendOf(d); if (!l) continue;
    const m = mainOf(d.cards, card); if ([...m.values()].reduce((a, b) => a + b, 0) < 39) continue;
    (by[`${(l.g || [])[0]}, ${l.n}`] ||= []).push({ d, m, good: isGoodPlacing(d) });
  }
  const legends = Object.entries(by).filter(([, v]) => v.length >= MIN && v.some((x) => x.good) && v.some((x) => !x.good)).sort((a, b) => b[1].length - a[1].length)
    .filter(([L]) => !only || only.some((o) => L.toLowerCase().includes(o))).slice(0, N);
  const foes = foeLists(await fieldDecksFor(cat, since));
  const sets = legends.map(([L, xs]) => {
    const goodXs = xs.filter((x) => x.good);
    const base = goodXs[medoid(goodXs.map((x) => x.m), changed)].d;
    const champ = String(L).split(", ")[0];
    const keepOut = new Set([...mainOf(base.cards, card).keys()].filter((n) => n.startsWith(`${champ}, `)));
    const Lf = lifts(xs.map((x) => x.m), xs.map((x) => x.good));
    const swaps = [];
    for (const sw of pickSwaps(mainOf(base.cards, card), Lf, { k: K + 2, keepOut })) {
      if (swaps.filter((x) => x.dir === sw.dir).length >= K) continue;
      try {
        const deck = applyChanges({ cards: base.cards }, parseChanges([`-1 ${sw.out}`, `+1 ${sw.in}`], cat.cards), cat.cards, cat.BY);
        const baseFails = new Set(deckChecks({ cards: base.cards }, cat.idx).filter((c) => c.ok === false).map((c) => c.label));   // pre-ban lists fail 'Nothing banned': only a rule the swap breaks counts
        if (deckChecks(deck, cat.idx).some((c) => c.ok === false && !baseFails.has(c.label) && !/sideboard/i.test(c.label))) continue;
        swaps.push({ ...sw, deck });
      } catch { /* a name parseChanges can't place: skip it */ }
    }
    if (cardsOnly) swaps.splice(0, swaps.length, ...swaps.filter((sw) => [sw.out, sw.in].some((x) => cardsOnly.includes(x.toLowerCase()))));   // the same swaps as the full run, narrowed
    return { L, xs, goodXs, base, swaps };
  });
  return { since, MIN, narrow: !!(only || cardsOnly), sets, foes };
}

async function calibrateSwaps(cat, args, opt) {
  const G = Number(opt("--games") || 240), hiddenHands = args.includes("--hidden"), hiddenDown = !args.includes("--open-down");
  // --hold-up W: what a reaction held for their turn is worth to the solver; --caution C: hidden hands only (lib/match.mjs).
  const holdUp = Number(opt("--hold-up")) || 0, caution = Number(opt("--caution")) || 0, solve = holdUp ? { solve: { ...POLICY_SOLVE, holdUp } } : {}, defendAll = !args.includes("--no-defend-all");
  const { since, MIN, narrow, sets, foes } = await swapSets(cat, opt);
  const legends = sets.map((x) => [x.L]);
  const t0 = Date.now();
  console.log(`CALIBRATE --swaps  ${sets.length} legends with ${MIN}+ placed lists since ${since}; ${G} model games a swap against the S/A field (${foes.length} lists), ${hiddenHands ? "hidden" : "open"} hands`);
  const rows = [];
  for (const { L, xs, goodXs, base, swaps } of sets) {
    const play = (cards, like) => matchRecordsPar({ cards }, cat, foes, { games: G, hiddenHands, hiddenDown, caution, defendAll, ...solve, ...(like ? { like } : {}) });
    const b = await play(base.cards);
    const margin = (recs) => recs.map((g) => g.at8[0] - g.at8[1]);
    for (const sw of swaps) {
      const d = paired(margin(await play(sw.deck.cards, base.cards)), margin(b));
      rows.push({ L, ...sw, model: d.mean, mlo: d.lo, mhi: d.hi });
    }
    console.log(`  ${L}: ${xs.length} placed lists (${goodXs.length} good finishes), ${swaps.length} swaps, ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  const sg = (x) => (x == null ? "—" : `${x >= 0 ? "+" : ""}${x.toFixed(2)}`);
  const lines = [];
  const out = (x = "") => { console.log(x); lines.push(x); };
  out(`\n| legend | swap | real lift (95%) | model margin (95%) |\n|---|---|---|---|`);
  for (const r of rows) out(`| ${r.L} | −1 ${r.out} +1 ${r.in} | ${sg(r.real)} (${sg(r.lo)} to ${sg(r.hi)}) | ${sg(r.model)} (${sg(r.mlo)} to ${sg(r.mhi)}) |`);
  const xs = rows.map((r) => r.model), ys = rows.map((r) => r.real), rr = pearson(xs, ys), ri = rInterval(rr, rows.length);
  const clear = rows.filter((r) => r.lo > 0 || r.hi < 0), agree = clear.filter((r) => Math.sign(r.model) === Math.sign(r.real)).length;
  const both = rows.filter((r) => (r.lo > 0 || r.hi < 0) && (r.mlo > 0 || r.mhi < 0)), bothAgree = both.filter((r) => Math.sign(r.model) === Math.sign(r.real)).length;
  out(`\nAcross ${rows.length} swaps: Pearson r ${rr == null ? "unknown" : rr.toFixed(2)} (95%: ${ri.lo == null ? "?" : ri.lo.toFixed(2)} to ${ri.hi == null ? "?" : ri.hi.toFixed(2)}), Spearman ρ ${spearman(xs, ys)?.toFixed(2) ?? "unknown"}.`);
  out(`Where the real lift's interval excludes 0 (${clear.length} swaps), the model has the same sign for ${agree}; where both intervals exclude 0 (${both.length}), ${bothAgree} agree.`);
  for (const [L] of legends) { const rs = rows.filter((r) => r.L === L); const c = rs.filter((r) => r.lo > 0 || r.hi < 0); out(`- ${L}: same sign ${c.filter((r) => Math.sign(r.model) === Math.sign(r.real)).length} of ${c.length} clear swaps; r ${pearson(rs.map((r) => r.model), rs.map((r) => r.real))?.toFixed(2) ?? "unknown"} over ${rs.length}`); }
  out(`\n${rows.length} swaps, ${(rows.length + legends.length) * G} model games, ${Math.round((Date.now() - t0) / 1000)} s.`);
  if (args.includes("--write") && narrow) console.log("\n  not written: --only/--card is a narrow run; the doc keeps the full table");
  else if (args.includes("--write")) {
    const f = new URL("../docs/model-calibration.md", import.meta.url), fs = await import("node:fs/promises");
    let doc = await fs.readFile(f, "utf8").catch(() => "");
    doc = doc.replace(/\n## Swaps[\s\S]*$/, "").trimEnd();
    doc += `\n\n## Swaps (does the model rank one-card changes the way good finishes do?)\n\nRun ${new Date().toISOString().slice(0, 10)}: \`scripts/rift calibrate ${args.filter((a) => a !== "--write").join(" ")}\`. ` +
      `Per legend, the base is its typical good finish (the medoid good-finish list since ${since}); a card's real lift is its mean copies in good finishes ` +
      `(lib/placing.mjs: top quarter of 32+, or a top 8) minus in the legend's other placed lists, ±95% by bootstrap; a swap's real effect is lift(in) − lift(out). ` +
      `Model: the paired margin by turn 8 over ${G} games against the S/A field, the swap keeping the base's card order.\n` + lines.join("\n") + "\n";
    await fs.writeFile(f, doc);
    console.log("\n  wrote the Swaps section of docs/model-calibration.md");
  }
}

// ── trace: what a swapped card does in the model games (one calibrate --swaps swap, played serially) ──────────────
// The base and the swapped list play the same games (seed, opponent, seat) as calibrate; per swapped card: how often it's
// drawn, when it's cast, and the margin at turn 8 when it's cast vs. drawn and never cast. --verbose N prints N games turn
// by turn (both sides: score, cards that left the hand, the solver's line).
//   trace --only <legend> --out "<card>" --in "<card>" [--games 60] [--verbose 0] [--full] [--since …] [--min 80]
async function cmdTrace(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const G = Number(opt("--games") || 60), V = Number(opt("--verbose") || 0), out = opt("--out"), inn = opt("--in"), FULL = args.includes("--full");   // --full: the solver's whole line (fights, deaths), not just the plays
  if (!opt("--only") || !out || !inn) { console.log('trace --only <legend> --out "<card>" --in "<card>" [--games 60] [--verbose N]'); return; }
  const { sets, foes } = await swapSets(cat, opt);
  if (sets.length !== 1) { console.log(sets.length ? `${sets.length} legends match: ${sets.map((x) => x.L).join(" · ")}` : "no legend matching that"); return; }
  const { L, base } = sets[0];
  const deck = applyChanges({ cards: base.cards }, parseChanges([`-1 ${out}`, `+1 ${inn}`], cat.cards), cat.cards, cat.BY);
  const runs = { base: matchPlayers({ cards: base.cards }, cat, foes), swap: matchPlayers({ cards: deck.cards }, cat, foes, base.cards) };
  console.log(`TRACE  ${L}: −1 ${out} +1 ${inn}, ${G} games each against the S/A field (${foes.length} lists), the same deals`);
  const res = {}, nm = (x) => x.toLowerCase();
  for (const [k, { me, them }] of Object.entries(runs)) {
    res[k] = [];
    for (let i = 0; i < G; i++) {
      const ev = [], g = matchGame(me, them, i, { trace: (e) => ev.push(e), hiddenDown: !args.includes("--open-down") });
      res[k].push({ g, ev });
      if (i < V) {
        console.log(`\n── ${k} game ${i} vs ${g.label} (${i % 2 ? "they" : "we"} go first): ${g.at8[0]}–${g.at8[1]} at turn 8, ${g.winner == null ? "timeout" : g.winner === 0 ? "we win" : "they win"} ──`);
        for (const e of ev) {
          console.log(`  T${e.myTurn} ${e.side ? "them" : "us  "} ${e.before.join("–")} → ${e.score.join("–")}  left hand: ${e.left.join(", ") || "—"}${e.champ ? `; champion ${e.champ}` : ""}`);
          if (e.side === 0) console.log(`         hand ${e.hand.join(", ")}; board ${e.units.join(", ") || "—"}; gear ${e.gear.join(", ") || "—"}`);
          for (const l of (FULL ? e.full : e.line) || []) console.log(`         · ${l}`);
        }
      }
    }
  }
  const sg = (x) => `${x >= 0 ? "+" : ""}${x.toFixed(2)}`;
  const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const d = paired(res.swap.map((r) => r.g.at8[0] - r.g.at8[1]), res.base.map((r) => r.g.at8[0] - r.g.at8[1]));
  console.log(`\nMargin at turn 8: swap − base ${sg(d.mean)} (95%: ${sg(d.lo)} to ${sg(d.hi)}) over ${G} paired games.`);
  for (const [k, c] of [["base", out], ["swap", inn]]) {
    const rows = res[k].map(({ g, ev }) => {
      const ours = ev.filter((e) => e.side === 0 && e.myTurn <= 8);
      const drawn = ours.some((e) => e.hand.some((n) => nm(n) === nm(c)));
      const cast = ours.find((e) => e.left.some((n) => nm(n) === nm(c)));
      return { drawn, castT: cast ? cast.myTurn : null, m: g.at8[0] - g.at8[1] };
    });
    const dr = rows.filter((r) => r.drawn), ca = dr.filter((r) => r.castT != null), no = dr.filter((r) => r.castT == null);
    const turns = {}; for (const r of ca) turns[r.castT] = (turns[r.castT] || 0) + 1;
    console.log(`  ${c} (${k}): drawn by turn 8 in ${dr.length}/${G}; left the hand in ${ca.length} (turn ${Object.entries(turns).map(([t, n]) => `${t}:${n}`).join(" ") || "—"}), stuck in ${no.length}; ` +
      `margin when it left ${ca.length ? sg(mean(ca.map((r) => r.m))) : "—"}, when stuck ${no.length ? sg(mean(no.map((r) => r.m))) : "—"}, not drawn ${sg(mean(rows.filter((r) => !r.drawn).map((r) => r.m)))}`);
  }
  console.log(`  "left the hand" counts a play, a hide or a discard; --verbose shows which.`);
}

// ── lifts: how good finishes build a legend (real data first; 25 Nov: model numbers rank inside the model only) ──────
// Per card: mean copies in good-finish lists minus the legend's other placed lists (lib/calibrate.mjs lifts), with a
// bootstrap interval. --deck "<one of your decks>" puts your copies beside each card. Only cards in 15%+ of the lists.
//   lifts --legend <legend> [--since 2026-10-23] [--deck "<deck>"]
async function cmdLifts(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const want = (opt("--legend") || "").toLowerCase(), since = opt("--since") || "2026-10-23";
  if (!want) { console.log('lifts --legend <legend> [--since 2026-10-23] [--deck "<deck>"]'); return; }
  const snap = await readJson(url("decks.json"));
  const card = (code) => cat.BY.get(code);
  const legendOf = (d) => (d.lg && cat.BY.get(d.lg)) || cat.cards.find((c) => c.t === "Legend" && c.n === d.ln) || null;
  const by = {};
  for (const d of snap.decks) {
    if ((d.dt || "") < since || !isRecord(d)) continue;
    const l = legendOf(d); if (!l) continue;
    const name = `${(l.g || [])[0]}, ${l.n}`; if (!name.toLowerCase().includes(want)) continue;
    const m = mainOf(d.cards, card); if ([...m.values()].reduce((a, b) => a + b, 0) < 39) continue;
    (by[name] ||= []).push({ m, good: isGoodPlacing(d) });
  }
  const names = Object.keys(by);
  if (names.length !== 1) { console.log(names.length ? `${names.length} legends match: ${names.join(" · ")}` : `no placed lists for "${want}" since ${since}`); return; }
  const xs = by[names[0]], good = xs.filter((x) => x.good).length;
  if (good < 5 || xs.length - good < 5) { console.log(`LIFTS  ${names[0]}: ${xs.length} placed lists since ${since}, ${good} good finishes. Too few to compare (5+ of each needed); try an earlier --since.`); return; }
  const Lf = lifts(xs.map((x) => x.m), xs.map((x) => x.good));
  let mine = null;
  if (opt("--deck")) { const dk = (S.decks || []).find((d) => d.name.toLowerCase() === opt("--deck").toLowerCase()); if (!dk) { console.log(`no deck "${opt("--deck")}"`); return; } mine = mainOf(dk.cards, card); }
  console.log(`LIFTS  ${names[0]}: ${xs.length} placed lists since ${since}, ${good} good finishes (lib/placing.mjs isGoodPlacing)`);
  console.log(`  lift = copies in good finishes − copies in the other placed lists (95% bootstrap); share = lists running it${mine ? "; yours = your copies" : ""}\n`);
  const sg = (x) => `${x >= 0 ? "+" : ""}${x.toFixed(2)}`;
  for (const [n, x] of [...Lf].sort((a, b) => b[1].lift - a[1].lift)) {
    const clear = x.lo > 0 ? "  more in winners" : x.hi < 0 ? "  fewer in winners" : "";
    console.log(`  ${sg(x.lift).padStart(6)} (${sg(x.lo)} to ${sg(x.hi)})  ${String(Math.round(100 * x.share)).padStart(3)}%  ${mine ? `${String(mine.get(n) || 0).padStart(2)}  ` : ""}${n}${clear}`);
  }
  if (mine) { const off = [...mine.keys()].filter((n) => !Lf.has(n)); if (off.length) console.log(`\n  yours, in under 15% of placed lists: ${off.join(", ")}`); }
}

async function cmdCalibrate(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  if (args.includes("--swaps")) return calibrateSwaps(cat, args, opt);
  const since = opt("--since") || "2026-10-16", N = Number(opt("--legends") || 12), reps = Number(opt("--reps") || 4), K = Number(opt("--lists") || 3);
  const policy = args.includes("--greedy") ? "greedy" : "solver", nodes = Number(opt("--nodes")) || null, hiddenHands = args.includes("--hidden"), hiddenDown = !args.includes("--open-down");   // --open-down: each side sees the other's face-down cards (the model before 25 Nov); --nodes: the solver budget a Main Phase; --hidden: plan on a guess at their hand
  const holdUp = Number(opt("--hold-up")) || 0, caution = Number(opt("--caution")) || 0, defendAll = !args.includes("--no-defend-all");   // see calibrate --swaps
  let W = await readJson(url("winrates.json"));
  const snap = await readJson(url("decks.json"));
  const { legends, by } = calibrationSet(cat, snap.decks, W, { since, N });   // the set: the whole window's most-played
  // --real-since D: the real side from the match records on or after D (the 23 Nov bans), not the whole window.
  const realSince = opt("--real-since");
  if (realSince) {
    let A; try { A = (await readJson(url("matches.json"))).matches; } catch { console.log("no data/matches.json: run scripts/build-winrates.mjs"); return; }
    const n = A.filter((m) => m.d >= realSince).length;
    W = { ...W, matches: A, pairs: pairsSince(A, realSince), filters: { ...W.filters, window: `${n} matches since ${realSince} (data/matches.json)` } };
  }
  // --decks riftlite: each legend plays the decks RiftLite's players logged (data/riftlite-decks.json), not tournament lists.
  if (opt("--decks") === "riftlite") {
    let A, D; try { A = (await readJson(url("matches.json"))).matches; D = (await readJson(url("riftlite-decks.json"))).decks; } catch { console.log("no data/matches.json or data/riftlite-decks.json: run scripts/build-winrates.mjs"); return; }
    const r = riftliteLists(cat, A, D, legends, { since: opt("--decks-since") || "", k: K });
    const missing = legends.filter((L) => !r.lists[L]);
    if (missing.length) console.log(`  no RiftLite decks for ${missing.join(", ")}: left out`);
    if (Object.keys(r.misses).length) console.log(`  unmapped: ${JSON.stringify(r.misses)}`);
    legends.splice(0, legends.length, ...legends.filter((L) => r.lists[L]));
    for (const L of legends) by[L] = r.lists[L];
  }
  const set = new Set(legends);
  const t0 = Date.now();
  console.log(`CALIBRATE  ${legends.length} legends (top by RiftLite games, with lists since ${since}): ${legends.join(", ")}`);
  console.log(`  each plays its best list against the others' top ${K} lists, ${reps} rounds (both seats), ${policy} policy, ${nodes || POLICY_SOLVE.maxNodes} nodes a Main Phase${hiddenHands ? ", hidden hands" : ", open hands"}${holdUp ? `, hold-up ${holdUp}` : ""}${caution ? `, caution ${caution}` : ""}${defendAll ? "" : ", no defend-all"}`);
  const runs = [];
  // --model-from <file>: a saved model column (--save), compared again with today's real sides without replaying games.
  const modelFrom = opt("--model-from");
  let saved = null;
  if (modelFrom) { saved = JSON.parse(await readFile(modelFrom, "utf8")); legends.splice(0, legends.length, ...saved.legends); console.log(`  model column from ${modelFrom} (${saved.at}, ${saved.flags})`); }
  for (const L of saved ? [] : legends) {
    const me = topLists(by[L], 1)[0];
    const foes = legends.filter((M) => M !== L).flatMap((M) => topLists(by[M], K).map((d) => ({ label: M, cards: d.cards })));
    const recs = await matchRecordsPar({ cards: me.cards }, cat, foes, { games: foes.length * reps, policy, ...(nodes || holdUp ? { solve: { ...POLICY_SOLVE, ...(nodes ? { maxNodes: nodes } : {}), ...(holdUp ? { holdUp } : {}) } } : {}), hiddenHands, hiddenDown, caution, defendAll });
    runs.push({ me: L, recs });
    process.stdout.write(`  ${L}: ${recs.length} games\n`);
  }
  const { leg, pair } = saved || modelTable(runs);
  if (opt("--save")) { await writeFile(opt("--save"), JSON.stringify({ at: new Date().toISOString().slice(0, 10), flags: args.filter((a) => a.startsWith("--")).join(" "), legends, leg, pair })); console.log(`  model column saved to ${opt("--save")}`); }
  const errs = runs.flatMap((r) => r.recs).reduce((a, g) => a + (g.solveErrors ? g.solveErrors[0] + g.solveErrors[1] : 0), 0);
  if (errs) console.log(`  SOLVER ERRORS: ${errs} Main Phases skipped because the solver threw`);
  const rows = legends.map((L) => { const m = leg[L] || { w: 0, l: 0, t: 0 }, iv = wilson(m.w, m.w + m.l), r = realRow(W, L, set);
    return { L, model: iv.p, mlo: iv.lo, mhi: iv.hi, mn: m.w + m.l, mt: m.t, real: r.p, rlo: r.lo, rhi: r.hi, rn: r.n }; }).filter((r) => r.real != null && r.model != null);
  const xs = rows.map((r) => r.model), ys = rows.map((r) => r.real);
  const pc = (x) => (x == null ? "—" : `${Math.round(100 * x)}%`), f2 = (x) => (x == null ? "unknown" : x.toFixed(2));
  const side = rows.filter((r) => (r.model - 0.5) * (r.real - 0.5) > 0).length;
  const pairs = W.pairs.filter((p) => p.a < p.b && set.has(p.a) && set.has(p.b) && p.n >= 30).map((p) => {
    const m = pair[`${p.a}|${p.b}`] || { w: 0, l: 0 }, mi = wilson(m.w, m.w + m.l), ri = wilson(Math.round((p.wr / 100) * p.n), p.n);
    return { a: p.a, b: p.b, model: mi.p, mlo: mi.lo, mhi: mi.hi, mn: m.w + m.l, real: p.wr / 100, rlo: ri.lo, rhi: ri.hi, rn: p.n };
  });
  const lines = [];
  const out = (x = "") => { console.log(x); lines.push(x); };
  out(`\n| legend | model win % (95%) | games | real win % (95%) | games |\n|---|---|---|---|---|`);
  for (const r of rows.sort((a, b) => b.real - a.real)) out(`| ${r.L} | ${pc(r.model)} (${pc(r.mlo)}–${pc(r.mhi)}) | ${r.mn}${r.mt ? ` +${r.mt} timeouts` : ""} | ${pc(r.real)} (${pc(r.rlo)}–${pc(r.rhi)}) | ${r.rn} |`);
  const rr = pearson(xs, ys), ri = rInterval(rr, rows.length);
  out(`\nPer legend (${rows.length}): Pearson r ${f2(rr)} (95%: ${f2(ri.lo)} to ${f2(ri.hi)}), Spearman ρ ${f2(spearman(xs, ys))}, mean absolute error ${(100 * mae(xs, ys)).toFixed(1)} points, the same side of 50% for ${side} of ${rows.length}.`);
  out(`Spread: the model's legend win rates run ${pc(Math.min(...xs))}–${pc(Math.max(...xs))}; RiftLite's ${pc(Math.min(...ys))}–${pc(Math.max(...ys))}.`);
  if (pairs.length) {
    out(`\nPairs with at least 30 RiftLite games (${pairs.length}; the row legend's win %):\n\n| pair | model (95%) | games | real (95%) | games |\n|---|---|---|---|---|`);
    for (const p of pairs) out(`| ${p.a} vs ${p.b} | ${pc(p.model)} (${pc(p.mlo)}–${pc(p.mhi)}) | ${p.mn} | ${pc(p.real)} (${pc(p.rlo)}–${pc(p.rhi)}) | ${p.rn} |`);
    const pm = pairs.filter((p) => p.model != null);
    out(`\nPairs: the same side of 50% for ${pm.filter((p) => (p.model - 0.5) * (p.real - 0.5) > 0).length} of ${pm.length}; intervals overlap for ${pm.filter((p) => p.mlo <= p.rhi && p.rlo <= p.mhi).length} of ${pm.length}.`);
  }
  // The other real sides (25 Nov): RiftAtlas tournaments (data/field.json), and with --real-since the fitted RiftLite
  // column (lib/realfit.mjs). Each with its own r; RiftLite and RiftAtlas against each other too.
  const modelP = new Map(legends.map((L) => { const m = leg[L] || { w: 0, l: 0 }; return [L, m.w + m.l ? m.w / (m.w + m.l) : null]; }).filter(([, p]) => p != null));
  let F = null; try { F = await readJson(url("field.json")); } catch { /* reported below */ }
  if (F) {
    const ra = riftatlasRows(F, legends, { since: opt("--atlas-since") || undefined });
    const ls = legends.filter((L) => ra.rows.has(L) && modelP.has(L));
    out(`\nRiftAtlas tournaments (data/field.json, events since ${ra.since}; win rate against the whole field, weighted by pilots × rounds):\n\n| legend | model | RiftAtlas (95%) | pilot-rounds | RiftLite |\n|---|---|---|---|---|`);
    for (const L of ls.slice().sort((a, b) => ra.rows.get(b).p - ra.rows.get(a).p)) { const x = ra.rows.get(L), rl = rows.find((r) => r.L === L); out(`| ${L} | ${pc(modelP.get(L))} | ${pc(x.p)} (${pc(x.lo)}–${pc(x.hi)}) | ${x.n} | ${rl ? pc(rl.real) : "—"} |`); }
    if (ra.thin.length) out(`Left out (under 100 pilot-rounds): ${ra.thin.join(", ")}.`);
    if (ls.length >= 3) {
      const xa = ls.map((L) => modelP.get(L)), ya = ls.map((L) => ra.rows.get(L).p), ri2 = rInterval(pearson(xa, ya), ls.length);
      const both = ls.filter((L) => rows.some((r) => r.L === L));
      out(`Per legend (${ls.length}): model vs RiftAtlas r ${f2(pearson(xa, ya))} (95%: ${f2(ri2.lo)} to ${f2(ri2.hi)}), mean absolute error ${(100 * mae(xa, ya)).toFixed(1)} points, the same side of 50% for ${ls.filter((L) => (modelP.get(L) - 0.5) * (ra.rows.get(L).p - 0.5) > 0).length} of ${ls.length}. RiftLite vs RiftAtlas (${both.length}): r ${f2(pearson(both.map((L) => rows.find((r) => r.L === L).real), both.map((L) => ra.rows.get(L).p)))}.`);
    }
  } else out("\nRiftAtlas: no data/field.json.");
  if (realSince && W.matches) {
    const fit = realAfter(W.matches, legends, realSince), q = rWithNoise(modelP, fit, pearson);
    out(`\nRiftLite since ${realSince}, fitted (lib/realfit.mjs: Bradley–Terry, earlier games as the prior, τ ${fit.tau.toFixed(2)}; ${fit.post} games inside the set): model r ${f2(q.r)} (bootstrap 95%: ${f2(q.lo)} to ${f2(q.hi)}); noise ceiling ${f2(q.ceiling)}, the r a perfect model could reach against data this noisy.`);
    out(`| legend | model | fitted (95%) | before ${realSince} |\n|---|---|---|---|`);
    for (const L of legends.filter((x) => fit.rows.has(x) && modelP.has(x))) { const x = fit.rows.get(L); out(`| ${L} | ${pc(modelP.get(L))} | ${pc(x.p)} (${pc(x.lo)}–${pc(x.hi)}) | ${pc(x.before)} |`); }
  }
  out(`\n${runs.reduce((a, r) => a + r.recs.length, 0)} model games (solver errors: ${errs}), ${Math.round((Date.now() - t0) / 1000)} s. RiftLite: ${W.filters?.window || "?"}, ${W.filters?.season || "?"}, generated ${W.generatedAt}.`);
  if (args.includes("--write")) {
    const head = `# How far the model games track real results\n\nWritten by \`scripts/rift calibrate${args.length ? " " + args.filter((a) => a !== "--write").join(" ") : ""}\` on ${new Date().toISOString().slice(0, 10)} (lib/calibrate.mjs). ` +
      `Real: RiftLite's community matrix (data/winrates.json: online games logged by its users, pooled). Model: lib/match.mjs games, ${policy} policy; ` +
      `each legend's best list (placed first, then newest, since ${since}) against the other legends' top ${K} lists, ${reps} rounds, both seats. ` +
      `Lists are not filtered by the 23 Nov bans, to match RiftLite's mostly pre-ban window. Timeouts count for neither side.\n`;
    await (await import("node:fs/promises")).writeFile(new URL("../docs/model-calibration.md", import.meta.url), head + lines.join("\n") + "\n");
    console.log("\n  wrote docs/model-calibration.md");
  }
}

// ── loops: a deck's interactions and loops, derived from card text ─────────────
// lib/interactions.mjs. Built blind (from the cards and the rules), so it finds loops nobody
// listed; every one is for a rules check before anything is built on it. --bridges also reads
// the legal pool for cards outside the deck that would link to two or more cards in it.
async function cmdLoops(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const decks = findDecks(S, opt("--deck") || "\u0000");
  if (decks.length !== 1) { console.log('usage: loops --deck "<one of your decks>" [--bridges]'); return; }
  const deck = decks[0];
  const rows = [...Object.entries(deck.cards || {}).map(([k, q]) => ({ card: cat.BY.get(k), qty: q })),
    ...Object.entries(deck.sb || {}).map(([k, q]) => ({ card: cat.BY.get(k), qty: q, sb: true }))].filter((r) => r.card && r.card.t !== "Rune");
  const g = graphOf(rows);
  const loops = loopsOf(g);
  const mainNames = new Set(rows.filter((r) => !r.sb).map((r) => r.card.n));
  const sbNames = new Set(rows.filter((r) => r.sb && !mainNames.has(r.card.n)).map((r) => r.card.n));
  const mark = (n) => (sbNames.has(n) ? `${n} (sb)` : n);
  const spec = (k) => ["", "low", "mid", "high"][k];
  console.log(`LOOPS  ${deck.name}\n  ${g.nodes.length} cards (legend, champion, battlefields, sideboard included) · ${g.edges.length} links · ${loops.length} loops`);
  console.log(`  Read from card text, not from a list of known combos. Rules-check each before building on it.\n`);
  console.log(`  LOOPS (strongest first; a link is as strong as its weaker end)`);
  for (const l of loops) {
    console.log(`    [${spec(l.weakest)}] ${l.links.map((e) => `${mark(e.from)} —${e.res}→`).join(" ")} ${mark(l.links[0].from)}`);
    for (const f of l.flags) console.log(`          ⚠ ${f}`);
  }
  console.log(`\n  STRONG LINKS (one card makes what another uses)`);
  const by = new Map();
  for (const e of linksOf(g)) { const k = `${e.from}|${e.res}`; (by.get(k) || by.set(k, []).get(k)).push(e.to); }
  for (const [k, tos] of by) { const [from, res] = k.split("|"); console.log(`    ${mark(from)} —${res}→ ${tos.map(mark).join(", ")}`); }
  console.log(`\n  HUBS (the legend and the champion, every strength)`);
  const legend = rows.find((r) => r.card.t === "Legend")?.card.n;
  const champ = rows.find((r) => r.card.t === "Unit" && legend && (cat.cards.find((c) => c.n === legend)?.g || []).some((t) => r.card.n.startsWith(`${t}, `)))?.card.n;
  for (const h of hubsOf(g, [legend, champ].filter(Boolean))) {
    console.log(`    ${h.card.n}`);
    const show = (xs, dir) => xs.forEach((x) => console.log(`      ${dir} [${x.spec}] ${RESOURCES[x.res] || x.res}: ${x.cards.length > 10 ? x.cards.slice(0, 10).map(mark).join(", ") + ` +${x.cards.length - 10} more` : x.cards.map(mark).join(", ")}`));
    show(h.fedBy, "fed by"); show(h.feeds, "feeds ");
  }
  if (args.includes("--bridges")) {
    const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
    const bn = bannedNameSet(banned), std = standardNameSet(banned, cat.cards);
    const doms = new Set([...(cat.cards.find((c) => c.n === legend)?.d || []), "Colorless"]);
    const seen = new Set();
    const pool = cat.cards.filter((c) => !c.v && /Unit|Spell|Gear/.test(c.t || "") && !seen.has(c.n) && seen.add(c.n) && (c.d || []).every((d) => doms.has(d))
      && !bn.has(c.n) && (!std || std.has(std.fold(c.n))) && !/\[Signature\]/.test(c.x || ""));
    console.log(`\n  BRIDGES (legal cards outside the deck that link strongly to 2+ cards in it)`);
    for (const b of bridgesOf(g, pool).slice(0, 25)) console.log(`    ${b.card.n.padEnd(30)} ${b.touches.length}: ${b.touches.map(mark).join(", ")}`);
  }
}

// ── names on the command line (fight, close) ─────────────────────────────────
// A name is exact or a unique prefix; the unvarianted printing wins.
function cardFinder(cat) {
  const names = [...new Set(cat.cards.map((c) => c.n))];
  const pick = (n) => cat.cards.find((c) => c.n === n && !c.v) || cat.cards.find((c) => c.n === n);
  const find = (q) => {
    const l = q.trim().toLowerCase(); const ex = names.find((n) => n.toLowerCase() === l);
    if (ex) return pick(ex);
    const pre = names.filter((n) => n.toLowerCase().startsWith(l));
    if (pre.length !== 1) throw new Error(pre.length ? `"${q}" matches ${pre.slice(0, 5).join(", ")}` : `no card called "${q}"`);
    return pick(pre[0]);
  };
  return { names, find };
}

// A list of names. A name can hold a comma ("Sivir, Mercenary"): split on ";" when the list has one, else on ","
// and re-join two halves that only make a card together. Each item keeps any "*" or "+ gear" suffix for the caller.
function nameItems(raw, names) {
  const s = raw || "";
  const parts = s.split(/;/.test(s) ? ";" : ",").map((x) => x.trim()).filter(Boolean); const out = [];
  const base = (x) => x.split("+")[0].replace(/\*$/, "").trim().toLowerCase();
  for (let i = 0; i < parts.length; i++) {
    const two = i + 1 < parts.length ? `${parts[i]}, ${parts[i + 1]}` : null;
    if (two && !names.some((n) => n.toLowerCase() === base(parts[i])) && names.some((n) => n.toLowerCase() === base(two))) { out.push(two); i++; }
    else out.push(parts[i]);
  }
  return out;
}

// ── fight: one combat at one battlefield, both sides playing their best line ────
// lib/fight.mjs. You defend (the usual question for a hold deck); --you-attack flips it.
// Names are comma-separated, exact or a unique prefix (";" between names that hold a comma). A unit wears
// gear with "+": "Rengar, Trophy Hunter + Long Sword" (withGear, as lib/turn.mjs sees it). Budgets are
// Energy/Power you can still pay on that turn: "3/1". Face-down cards are free.
function cmdFight(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const { names, find } = cardFinder(cat);
  const list = (k) => nameItems(opt(k), names).map(find);
  const unitsOf = (k) => nameItems(opt(k), names).map((x) => {
    const [u, ...gs] = x.split("+").map((y) => y.trim()).filter(Boolean);
    const gear = gs.map(find);
    for (const g of gear) if (!/Gear/.test(g.t || "")) throw new Error(`"${g.n}" is a ${g.t || "card"}, not gear`);
    return withGear(find(u), gear);
  });
  const budget = (k) => { const [e, p] = (opt(k) || "0/0").split("/").map(Number); return { e: e || 0, p: p || 0 }; };
  let them, you;
  try {
    them = { units: unitsOf("--attack"), hand: list("--their"), budget: budget("--their-budget") };
    you = { units: unitsOf("--defend"), hand: list("--hand"), faceDown: list("--down"), base: unitsOf("--base"), budget: budget("--budget") };
  } catch (e) { console.log(`fight: ${e.message}`); return; }
  if (!them.units.length || !you.units.length) {
    console.log('usage: fight --attack "<their units>" --defend "<your units>" [--down "<your face-down cards>"] [--hand "<your hand>"] [--budget E/P]');
    console.log('             [--base "<your units elsewhere>"] [--their "<their hand>"] [--their-budget E/P] [--you-attack]');
    console.log('       a unit wears gear with "+": "Rengar, Trophy Hunter + Long Sword"; ";" between names that hold a comma');
    return;
  }
  const named = (c) => c.n + (c.gear?.length ? ` (${c.gear.join(", ")})` : "");
  // Elder Dragon on a side (in the fight or at its base): that side's damage kills any enemy unit it reaches.
  const kills = (cs) => cs.some((c) => compile(c).statics.some((x) => x.op === "anyDamageKills"));
  them.anyDamageKills = kills(them.units); you.anyDamageKills = kills([...you.units, ...you.base]);
  const youAttack = args.includes("--you-attack");
  const r = youAttack ? fight({ units: you.units, hand: you.hand, budget: you.budget, anyDamageKills: you.anyDamageKills }, { units: them.units, hand: them.hand, budget: them.budget, anyDamageKills: them.anyDamageKills })
    : fight(them, you);
  const word = youAttack ? { hold: "THEY HOLD", conquer: "YOU CONQUER", trade: "TRADE (both wiped; the battlefield is left uncontrolled)" }
    : { hold: "YOU HOLD", conquer: "THEY CONQUER", trade: "TRADE (both wiped; the battlefield is left uncontrolled)" };
  console.log(`FIGHT  ${(youAttack ? you : them).units.map(named).join(" + ")} attack ${(youAttack ? them : you).units.map(named).join(" + ")}`);
  console.log(`  → ${word[r.outcome]}`);
  console.log(`  best line, both sides: ${r.line.length ? r.line.join(" · ") : "nobody needs to play anything"}`);
  console.log(`  Rules: totals with Assault and Shield, lethal one unit at a time, attackers recalled if a defender stands; triggers on the chain take Reactions only; each play resolves before the next (simplified).`);
}

// ── close: can this board win this turn? (lib/turn.mjs) ─────────────────────────
// A position typed in from a real game. Units are comma-separated names (a name twice is two
// copies); "Name*" is exhausted. Battlefields: A and B, and the Baron Pit when it's on the board (--pit, with or
// without units; --hold P); --hold names the ones you control at the start of your turn (they score first).
// Runes: "4 Chaos, 2 Body", all ready.
function cmdClose(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const { names, find } = cardFinder(cat);
  const items = (k) => nameItems(opt(k), names);
  const list = (k) => items(k).map((x) => find(x.replace(/\*$/, "")));
  let pos;
  try {
    const units = [];
    const add = (k, side, at) => { for (const x of items(k)) units.push({ card: find(x.replace(/\*$/, "")), side, at, ready: !/\*$/.test(x) }); };
    add("--a", 0, 0); add("--b", 0, 1); add("--base", 0, -1); add("--their-a", 1, 0); add("--their-b", 1, 1); add("--their-base", 1, -1);
    const hold = (opt("--hold") || "").toUpperCase();
    const pit = args.includes("--pit") || args.includes("--their-pit") || hold.includes("P");
    if (pit) { const v = opt("--pit"); if (v && !v.startsWith("--")) add("--pit", 0, 2); add("--their-pit", 1, 2); }
    const ctrl = (pit ? [0, 1, 2] : [0, 1]).map((b) => (hold.includes("ABP"[b]) ? 0 : units.some((u) => u.side === 1 && u.at === b) ? 1 : null));
    const [us, them] = (opt("--score") || "0-0").split(/[-–/]/).map(Number);
    const runes = (opt("--runes") || "").split(",").map((x) => x.trim()).filter(Boolean).flatMap((x) => { const m = /^(\d+)\s+(\w+)/.exec(x); return m ? Array(Number(m[1])).fill({ d: m[2][0].toUpperCase() + m[2].slice(1).toLowerCase(), ready: true }) : []; });
    const [te, tp] = (opt("--their-budget") || "0/0").split("/").map(Number);
    // Gear at base (--gear) and at a battlefield (--gear-a/-b/-pit; "Bomb" is a Bomb token).
    const gearIn = (k) => items(k).map((x) => (/^bombs?$/i.test(x.trim()) ? { ...BOMB } : find(x)));
    const gearOn = [["--gear", -1], ["--gear-a", 0], ["--gear-b", 1], ["--gear-pit", 2]].flatMap(([k, at]) => gearIn(k).map((g) => [g, at]));
    pos = { score: [us || 0, them || 0], ctrl, beginning: true, units, hand: list("--hand"), champ: opt("--cz") ? find(opt("--cz")) : null, gear: gearOn.map((x) => x[0]), gearAt: gearOn.map((x) => x[1]),
      down: [[list("--down-a"), list("--their-down-a")], [list("--down-b"), list("--their-down-b")], ...(pit ? [[[], []]] : [])], runes, gold: Number(opt("--gold") || 0),
      their: { hand: list("--their"), budget: { e: te || 0, p: tp || 0 }, xp: Number(opt("--their-xp") || 0), runes: opt("--their-runes") != null ? Number(opt("--their-runes")) : null }, xp: Number(opt("--xp") || 0),
      trash: opt("--trash") != null ? list("--trash") : null, listTag: opt("--list-tag") || null,
      legend: opt("--legend") ? { card: find(opt("--legend")), ready: !args.includes("--legend-exhausted") } : null };
    pos.breakWith = list("--breakers");
  } catch (e) { console.log(`close: ${e.message}`); return; }
  if (!pos.units.length && !pos.champ) {
    console.log('usage: close --score 6-5 --hold A --a "<your units at A>" --b "…" --base "…" [--cz "Sivir, Mercenary"] [--hand "On the Hunt"] [--gear "Boots of Swiftness"]');
    console.log('             --runes "4 Chaos, 3 Body" [--gold 1] [--down-a "<your face-down card>"] --their-a "…" --their-b "…" [--their-base "…"]');
    console.log('             [--their-down-b "…"] [--their "<their hand>"] [--their-budget E/P] [--breakers "<cards to try in their hand>"]   (Name* = exhausted; ";" between names with commas)');
    console.log('             [--pit ["<your units at the Baron Pit>"]] [--their-pit "…"] [--hold P]   (the Baron Pit on the board: a third battlefield)');
    console.log('             [--gear-a "…"] [--gear-b "…"] [--gear-pit "…"]   (your gear at a battlefield; "Bomb" is a Bomb token)');
    console.log('             [--xp N] [--their-xp N]   (XP for [Level]; Hunt and "gain N XP" add to it this turn)');
    console.log('             [--legend "<your legend>"] [--legend-exhausted]   (its {T} abilities are played)');
    console.log('             [--their-runes N] [--trash "<cards in your trash>"]   (unknown when left out: conditions on them aren\'t met)');
    console.log('             [--list-tag Tag]   (the tag The List named on an earlier turn)');
    return;
  }
  const r = solveTurn(pos);
  console.log(`CLOSE  from ${pos.score.join("–")}${pos.ctrl.some((x) => x === 0) ? `, holding ${pos.ctrl.map((_, b) => b).filter((b) => pos.ctrl[b] === 0).map((b) => ["A", "B", "the Pit"][b]).join(" and ")}` : ""}`);
  console.log(`  → ${r.win ? `WIN (${r.kind})` : `no win this turn: best is ${r.score.join("–")}${r.drew ? `, ${r.drew} drawn at the 8th-point gate` : ""}`}`);
  console.log(`  best line:\n    ${r.line.join("\n    ") || "nothing to do"}`);
  if (r.win && pos.breakWith.length) { const br = breakers(pos, pos.breakWith); console.log(`  what breaks it (each added to their hand, paid from what they kept open): ${br.join(", ") || "none of these"}`); }
  if (r.blind.length) console.log(`  the solver can't see: ${r.blind.join(", ")}`);
  console.log(`  Rules: holds first; moves exhaust, A ↔ B needs Ganking; each combat by \`fight\` (their best answer with the hand you gave); the 8th point by conquest needs every battlefield scored (the Pit too, once it's on the board). Only your turn: their next turn isn't searched.${r.capped ? " Search hit its node cap." : ""}`);
}

// ── cards: how much of the card pool the turn solver reads (lib/cardtext.mjs) ─────
//   cards --coverage [--top N]   the legal pool: compiled, played by the engine, unread text, gaps
//   cards "<name>"               one card: its sentences, their states, what the engine lacks
async function cmdCards(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const name = args.filter((a, i) => !a.startsWith("--") && !String(args[i - 1] || "").startsWith("--top")).join(" ").trim();
  if (args.includes("--suspects")) {
    // Readings that do nothing this turn but name a board action (lib/cardtext.mjs noopSuspects), by played copies.
    const snap = await readJson(url("decks.json")), copies = new Map();
    for (const d of snap.decks) for (const [code, q] of Object.entries(d.cards || {})) { const k = cat.BY.get(code); if (k) copies.set(k.n, (copies.get(k.n) || 0) + q); }
    const xs = (await import("../lib/cardtext.mjs")).noopSuspects(cat.cards, copies).filter((x) => x.copies > 0);
    console.log(`SUSPECTS  ${xs.length} sentences on played cards read as doing nothing this turn, though they name a board action. Most are right; read each once.\n`);
    for (const x of xs.slice(0, Number(opt("--top")) || 40)) console.log(`  ${String(x.copies).padStart(5)}  ${x.card} [${x.why}]  ${String(x.text).slice(0, 110)}`);
    return;
  }
  if (name && !args.includes("--coverage")) {
    const c = cat.cards.find((x) => x.n.toLowerCase() === name.toLowerCase() && !x.v) || cat.cards.find((x) => x.n.toLowerCase().startsWith(name.toLowerCase()));
    if (!c) { console.log(`cards: no card called "${name}"`); return; }
    const k = compile(c), e = engineReads(c, k);
    console.log(`${c.n}  (${c.t})  engine: ${e.ok ? "plays all of it" : `lacks ${e.why.join(", ")}`}`);
    for (const s of k.sentences) console.log(`  ${s.state.padEnd(7)}${s.why ? ` (${s.why})` : ""}  ${s.text}`);
    for (const a of k.abilities) console.log(`    → ${a.trigger}${a.cond ? ` [if ${a.cond}]` : ""}: ${(a.effects || []).map((x) => x.op + (x.n != null ? ` ${x.n}` : "") + (x.target ? ` @${x.target.who}/${x.target.side || ""}/${x.target.where || ""}` : "")).join(", ")}`);
    for (const st of k.statics) console.log(`    → static ${st.op}${st.n != null ? ` ${st.n}` : ""}${st.cond ? ` [${typeof st.cond === "string" ? st.cond : JSON.stringify(st.cond)}]` : ""}`);
    return;
  }
  const banned = await readJson(url("banned.json")).catch(() => ({}));
  const snap = await readJson(url("decks.json"));
  // Until lib/turn.mjs runs this language, "played" is its own reader (turnReads), not the language's ops.
  const R = poolCoverage(cat.cards, snap.decks, standardNameSet(banned, cat.cards), { engine: (c) => ({ ok: turnReads(c), why: turnReads(c) ? [] : engineReads(c).why.length ? engineReads(c).why : ["the solver's own reader"] }) });
  const pc = (a, b) => `${Math.round((100 * a) / (b || 1))}%`;
  console.log(`CARD TEXT COVERAGE  ${R.cards} legal cards; weighted by copies in ${R.lists} lists since ${R.since}`);
  console.log(`  compiled (every sentence read or classified)   ${R.compiled} cards (${pc(R.compiled, R.cards)}) · ${pc(R.wCompiled, R.w)} of played copies`);
  console.log(`  played by the turn solver today                ${R.engine} cards (${pc(R.engine, R.cards)}) · ${pc(R.wEngine, R.w)} of played copies`);
  const RL = poolCoverage(cat.cards, snap.decks, standardNameSet(banned, cat.cards), { types: /Legend/, engine: (c) => ({ ok: turnReads(c), why: turnReads(c) ? [] : engineReads(c).why }) });
  console.log(`  legends played by the turn solver               ${RL.engine} of ${RL.cards} (${pc(RL.engine, RL.cards)}) · ${pc(RL.wEngine, RL.w)} of played legends`);
  console.log(`  sentences: ${R.sentences} · read ${R.states.read} · no effect this turn ${R.states.noTurn} (${Object.entries(R.why).map(([k, v]) => `${k} ${v}`).join(", ")}) · unread ${R.states.unread}`);
  const top = Number(opt("--top") || 25);
  console.log(`\n  WHAT THE ENGINE LACKS (cards · played copies)`);
  for (const [k, v] of Object.entries(R.gaps).sort((a, b) => b[1].w - a[1].w).slice(0, top)) console.log(`    ${k.padEnd(28)}${String(v.cards).padStart(5)}  ${v.w}`);
  console.log(`\n  UNREAD TEXT, heaviest first (lib/cardtext-overrides.mjs takes a hand-written entry)`);
  for (const u of R.unread.slice(0, top)) console.log(`    ${String(u.w).padStart(5)}  ${u.card.padEnd(28).slice(0, 28)} ${u.text.slice(0, 110)}`);
}

// ── intake: new product into the collection ───────────────────────────────────
// Cards get entered on Piltover Archive and reach the app on its next pull, which banks
// every gained copy in the list of new copies to file (`newq`) until it is cleared. So "what's new" is already recorded, and this reads it: what landed, a Pre-Rift
// champion pack checked card by card (lib/kits.mjs), scans worth a second look, and where
// each copy goes in the boxes. Read only; nothing to run before scanning.
// The physical layout (decided 2026-10-17): the first PLAYSET copies of a name go in the
// playset boxes by domain; copies past it go to bulk; legends, signatures, battlefields,
// runes and tokens are deck pieces.
const PLAYSET_BOX = { Fury: "playset box 1", Calm: "playset box 1", Mind: "playset box 1", Body: "playset box 2", Chaos: "playset box 2", Order: "playset box 2" };

function cmdIntake(S, cat, args) {
  const key = (c) => c.replace(/\/\d+$/, "").toUpperCase();
  const byKey = new Map(cat.cards.map((c) => [key(c.c), c]));
  const cardOf = (k) => cat.BY.get(k) || byKey.get(key(k)) || byKey.get(key(k).replace(/-P\d*$/, "")) || byKey.get(key(k).replace(/[A-Z]+$/, "")) || null;
  const gained = Object.entries(S.newq || {}).map(([k, e]) => ({ k: key(k), c: cardOf(k), n: e.q || 0, f: e.f || 0, at: e.at }))
    .filter((r) => r.n + r.f > 0);
  if (!gained.length) {
    console.log("INTAKE  nothing new since the list was last cleared.");
    console.log("  Added on Piltover Archive? Open the app once so it pulls, then run this again.");
    return;
  }
  const name = (r) => r.c?.n || `(unknown ${r.k})`;
  const total = gained.reduce((a, r) => a + r.n + r.f, 0), foils = gained.reduce((a, r) => a + r.f, 0);
  const since = gained.map((r) => r.at).filter(Boolean).sort()[0];
  console.log(`INTAKE  ${total} new copies (${foils} foil)${since ? ` since ${since}` : ""}. If your stack has a different count, a card was missed or scanned twice.`);
  const by = (f) => { const m = {}; for (const r of gained) m[f(r)] = (m[f(r)] || 0) + r.n + r.f; return Object.entries(m).map(([k, n]) => `${k} ${n}`).join(" · "); };
  console.log(`  by set ${by((r) => r.k.split("-")[0])} · by rarity ${by((r) => r.c?.r || "?")}\n`);

  // The champion pack, card by card: a kit card counts if any printing of its name landed.
  const champ = args.join(" ").toLowerCase();
  const kitName = champ && Object.keys(PRE_RIFT_KITS).find((n) => n.toLowerCase().startsWith(champ));
  if (champ && !kitName) console.log(`  No Pre-Rift kit for "${champ}" — kits: ${Object.keys(PRE_RIFT_KITS).join(", ")}\n`);
  if (kitName) {
    const got = new Set(gained.map((r) => r.c?.n));
    const kit = PRE_RIFT_KITS[kitName].map(cardOf);
    const missing = kit.filter((c) => !got.has(c.n));
    console.log(`  ${kitName.toUpperCase()} PACK  ${kit.length - missing.length} of ${kit.length} scanned${missing.length ? "" : " ✓"}`);
    for (const c of missing) console.log(`    missing  ${c.n} (${key(c.c)})`);
    console.log("");
  }

  // Worth a second look: an unknown code, another set in a Pre-Rift scan, several of one
  // rare, a special printing.
  const flags = [];
  for (const r of gained) {
    if (!r.c) flags.push(`${r.k}: not in the catalog`);
    else if (kitName && !/^RAD-/.test(r.k)) flags.push(`${name(r)} (${r.k}): not a Radiance card — misread?`);
    if (r.c && ["Rare", "Epic", "Showcase"].includes(r.c.r) && r.n + r.f >= 3) flags.push(`${name(r)}: ${r.n + r.f} copies of a ${r.c.r} — scanned twice?`);
    if (!/^[A-Z]+-[A-Z]?\d+$/.test(r.k)) flags.push(`${name(r)} (${r.k}): alt art or promo — the one in your hand?`);
  }
  if (flags.length) { console.log("  CHECK"); for (const f of flags) console.log(`    ${f}`); console.log(""); }

  // Filing, by name across printings: copies up to the playset go to the playset boxes.
  const playset = S.playset || 3;
  const ownedNow = (n) => Object.entries(S.inv || {}).filter(([k]) => cardOf(k)?.n === n).reduce((a, [, e]) => a + (e.n || 0) + (e.f || 0), 0);
  const names = new Map();
  for (const r of gained) if (r.c) { const g = names.get(r.c.n) || { c: r.c, n: 0 }; g.n += r.n + r.f; names.set(r.c.n, g); }
  const plan = {};
  const put = (where, line) => (plan[where] = plan[where] || []).push(line);
  for (const [n, { c, n: g }] of names) {
    if (["Legend", "Battlefield", "Rune"].includes(c.t) || /-T\d/i.test(c.c) || cat.idx.signatureOf?.(c)) { put("deck pieces", `${g} ${n}`); continue; }
    const dom = (c.d || []).find((d) => PLAYSET_BOX[d]);
    const toSet = Math.max(0, Math.min(g, playset - (ownedNow(n) - g)));
    if (toSet) put(dom ? `${PLAYSET_BOX[dom]} · ${dom}` : "playset · colourless", `${toSet} ${n}`);
    if (g - toSet) put(dom ? `bulk · ${dom}` : "bulk · colourless", `${g - toSet} ${n}`);
  }
  console.log(`  FILE TO`);
  for (const where of Object.keys(plan).sort()) console.log(`    ${where.padEnd(24)} ${plan[where].join(", ")}`);
  console.log("\n  Then Clear the list in the app (Collection → Import → New, to file), which also empties this one.");
}

// pool: a legend's legal cards (its domains + Colorless, unbanned, Standard, its own signature only,
// never Aurora), by job (lib/jobs.mjs), each with what the lists say (lib/pool.mjs). Candidates for
// the deck-brew skill's "cards by job" step, not picks; the collection is never a sort key.
//   pool <legend> [--job removal] [--since 2026-10-23] [--all]
// Without --job: each job's top 8 by evidence (--all for every card).
async function cmdPool(cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const flags = new Set(["--job", "--since"]);
  const words = args.filter((a, i) => !a.startsWith("--") && !flags.has(args[i - 1])).join(" ").toLowerCase();
  const job = opt("--job"), since = opt("--since") || "2026-10-23", all = args.includes("--all");
  if (!words || (job && !JOBS[job])) {
    console.log("usage: pool <legend> [--job <job>] [--since 2026-10-23] [--all]");
    console.log("  jobs: " + Object.entries(JOBS).map(([k, v]) => `${k} (${v})`).join(" · "));
    return;
  }
  const byName = new Map();
  for (const c of cat.cards) if (c.t === "Legend" && !c.v && (cat.idx.legendName(c) || "").toLowerCase().includes(words) && !byName.has(cat.idx.legendName(c))) byName.set(cat.idx.legendName(c), c);
  if (byName.size !== 1) { console.log(byName.size ? `${byName.size} legends match: ${[...byName.keys()].join(" · ")}` : `no legend matching "${words}"`); return; }
  const [lname, legend] = [...byName][0];
  const snap = await readJson(url("decks.json"));
  const P = legendPool(cat, snap.decks, legend, { since });
  const pct = (x) => (x == null ? "  —" : `${Math.round(100 * x)}%`.padStart(4));
  console.log(`POOL  ${lname} (${(legend.d || []).join(" + ")} + Colorless): ${P.cards.length} legal cards · ${P.lists} posted lists since ${since}, ${P.good} good finishes`);
  if (!P.good) console.log(`  no good finishes for ${lname} since ${since}, so nothing here can read "proven here"; an earlier --since may find some`);
  if (P.twins.length) console.log(`  same domains: ${P.twins.map((t) => `${t.legend} (${t.lists} lists, ${t.good} good)`).join(" · ")}`);
  console.log(`  CANDIDATES, NOT PICKS. Sorted by evidence: proven here (${Math.round(MIN_SHARE * 100)}%+ of this legend's good finishes) › crowd here › proven under another legend (named) › theory (card text only)`);
  console.log(`  good = share of good finishes · posted = share of posted lists · cp = copies when run · ⟲ = usable on their turn\n`);
  const row = (r) => `    ${pad(r.card.n, 30)} ${pad(`${r.card.t[0]} ${cost(r.card)}`, 9)} ${pct(r.good)} ${pct(r.posted)} ${r.copies ? r.copies.toFixed(1).padStart(4) : "   —"}  ${r.theirTurn ? "⟲" : " "} ${r.label === "proven under" ? `proven under ${r.under.legend.split(",")[0]} (${pct(r.under.good).trim()}${r.under.theirChampion ? ", its champion" : ""})` : r.label}${job ? "" : ""}  ${r.jobs.filter((j) => j !== job).join(", ")}`;
  const head = `    ${pad("card", 30)} ${pad("cost", 9)} good posted  cp     evidence   other jobs`;
  for (const [j, what] of Object.entries(JOBS)) {
    if (job && j !== job) continue;
    const rs = P.cards.filter((r) => r.jobs.includes(j));
    if (!rs.length) continue;
    const show = job || all ? rs : rs.slice(0, 8);
    console.log(`  ${j.toUpperCase()}  ${what} · ${rs.length} cards${show.length < rs.length ? `, top ${show.length}` : ""}`);
    console.log(head);
    for (const r of show) console.log(row(r));
    console.log("");
  }
  const none = P.cards.filter((r) => !r.jobs.length);
  if (!job && none.length) console.log(`  NO JOB READ (${none.length}): ${none.slice(0, 20).map((r) => r.card.n).join(", ")}${none.length > 20 ? " …" : ""}`);
}

// identity: a list checked against its identity (lib/identity.mjs): the measured rules as code, copies
// and odds per job against the identity's targets, key cards, enablers, and core/flex against the
// legend's lists. The deck-brew skill's audit step and deck-netdeck's "read its identity" step.
//   identity --deck "<deck>" | --file draft.deck.txt  [--id decklab/<brew>.md]  [--anchor "<deck>" | --anchor net]
// --anchor net: the nearest playable net deck (data/ideas.json), as `ideas` picks it. Two --file
// flags load two drafts; name the second as the anchor with --anchor "file:<name>".
async function cmdIdentity(S, cat, args) {
  const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
  const decks = findDecks(S, opt("--deck") || "\u0000");
  if (decks.length !== 1) {
    console.log('usage: identity --deck "<deck>" | --file draft.deck.txt  [--id decklab/<brew>.md]  [--anchor "<deck>" | --anchor net]');
    if (opt("--deck")) console.log(`  --deck matches ${decks.length} decks: ${decks.map((d) => d.name).join(" · ") || "none"}`);
    return;
  }
  const deck = decks[0], card = (code) => cat.BY.get(code);
  const identity = opt("--id") ? readIdentity(await readFile(opt("--id"), "utf8")) : null;
  if (opt("--id") && !identity) { console.log(`${opt("--id")}: no \`\`\`identity block`); return; }
  const legend = Object.keys(deck.cards).map(card).find((c) => c?.t === "Legend");
  const lname = legend ? cat.idx.legendName(legend) : null;
  let anchor = null;
  const a = opt("--anchor") || identity?.anchor || null;
  if (a === "net") {
    const I = await readJson(url("ideas.json"));
    const mine = mainOf(deck.cards, card);
    const near = ["now", "last"].flatMap((f) => (I.netdecks?.[lname]?.[f] || []).filter((g) => g.count && !g.avoid.length)
      .map((g) => ({ f, g, main: new Map(g.count.main.map((r) => [r.name, r.copies])) })))
      .map((x) => ({ ...x, off: changed(mine, x.main) })).sort((x, y) => x.off - y.off)[0];
    if (near) anchor = { name: `the nearest ${I.formats[near.f].name} net deck (${near.g.status}, ${near.g.lists} lists)`, main: near.main };
    else console.log(`  no playable net deck for ${lname}: no anchor`);
  } else if (a) {
    const ad = findDecks(S, a);
    if (ad.length !== 1) { console.log(`--anchor "${a}" matches ${ad.length} decks: ${ad.map((d) => d.name).join(" · ") || "none"}`); return; }
    anchor = { name: ad[0].name, main: mainOf(ad[0].cards, card) };
  }
  // The legend's posted lists this format, for core / mid / flex.
  const snap = await readJson(url("decks.json"));
  const lists = snap.decks.filter((d) => (d.dt || "") >= "2026-10-23" && d.lg && card(d.lg) && cat.idx.legendName(card(d.lg)) === lname).map((d) => mainOf(d.cards, card));
  const R = checkList(deck, cat.idx, { identity, anchor, lists });

  const mark = (ok) => (ok === true ? "ok  " : ok === false ? "FAIL" : ok === "new" ? "NEW " : ok === "later" ? "later" : "warn");
  console.log(`IDENTITY  ${deck.name}${R.legend ? ` · ${R.legend}` : ""}${identity ? ` · against ${opt("--id")}` : " · no identity block (rules and synergies only)"}`);
  if (identity) {
    for (const [k, label] of [["plan", "plan"], ["early", "early (1–3)"], ["mid", "mid (4–6)"], ["lethal", "lethal"], ["winCondition", "wins by"], ["givesUp", "gives up"], ["worthDoing", "worth doing"], ["yardstick", "yardstick"]])
      if (identity[k]) console.log(`  ${pad(label, 12)} ${identity[k]}`);
    const open = (identity.gates || []).filter((g) => !g.confirmed);
    if (open.length) console.log(`  gates not yet confirmed by Jay: ${open.map((g) => g.gate).join(", ")}`);
  }
  console.log(`\n  RULES (docs/deckbuilding.md, measured on good finishes)`);
  for (const r of R.rules) console.log(`    ${mark(r.ok)} ${r.label}: ${r.val}`);
  console.log(`\n  JOBS  copies · chance of one by the Nth card seen (no mulligan; docs/deckbuilding-theory.md table)${identity?.jobs ? " · target" : ""}`);
  for (const j of R.jobs) console.log(`    ${j.ok === false ? "FAIL" : j.ok ? "ok  " : "    "} ${pad(j.job, 14)} ${String(j.copies).padStart(2)}  ${String(Math.round(100 * j.p)).padStart(3)}% by ${j.by}${j.target != null ? ` (target ${Math.round(100 * j.target)}%)` : ""}  ${j.cards.join(", ")}`);
  console.log(`    interaction copies ${R.interaction} (Riot: 6+) · usable on their turn ${R.theirTurn}`);
  if (R.jobless.length) console.log(`    ${"warn"} doing none of the identity's jobs (cut, or argue for it): ${R.jobless.join(", ")}`);
  if (R.keys.length) { console.log(`\n  KEY CARDS`); for (const k of R.keys) console.log(`    ${k.copies ? "ok  " : "FAIL"} ${k.copies} ${k.name}`); }
  console.log(`\n  ENABLERS  a card that names a resource nothing else in the list makes (lib/interactions.mjs, pattern-read: check the text)`);
  if (!R.orphans.length) console.log(`    none found`);
  for (const o of R.orphans) console.log(`    warn ${o.card} needs ${o.means}: "${o.why}"`);
  if (R.shape) {
    const fmt = (rs) => rs.map((r) => `${r.q} ${r.n} ${Math.round(100 * r.s)}%`).join(", ") || "—";
    const cp = (rs) => rs.reduce((a, r) => a + r.q, 0);
    console.log(`\n  CORE / FLEX  share of ${R.shape.lists} posted ${R.legend} lists since 2026-10-23 running each card (good finishes: core ~30, mid ~6, flex ~4 copies)`);
    console.log(`    core 80%+  ${cp(R.shape.core)} copies: ${fmt(R.shape.core)}`);
    console.log(`    mid        ${cp(R.shape.mid)} copies: ${fmt(R.shape.mid)}`);
    console.log(`    flex <60%  ${cp(R.shape.flex)} copies: ${fmt(R.shape.flex)}`);
  }
}

// --file decklab/<name>.deck.txt: a draft in Piltover paste text (what `export` writes), played as
// one more deck named "file:<name>" next to the saved ones. It lives in memory only: nothing is
// written to the app. With no --deck, the command gets --deck "file:<name>", so
// `try --file x.deck.txt "-A" "+B"` works as `try --deck` does.
let fileDecks = [];
async function takeFileArgs(args, cat) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--file") { out.push(args[i]); continue; }
    const path = args[++i];
    if (!path) throw new Error("--file needs a path");
    const text = await readFile(path, "utf8");
    const { cards, sb, unknown } = parseDeckText(text, cat.idx);
    if (unknown.length) throw new Error(`${path}: can't read ${unknown.length} line(s): ${unknown.slice(0, 5).join(" · ")}`);
    const name = "file:" + basename(path).replace(/(\.deck)?\.txt$/, "");
    fileDecks.push({ id: name, name, cards, sb, file: path });
  }
  const cmd = process.argv[2];
  if (fileDecks.length && ["deck", "decks", "export"].includes(cmd) && !out.length) out.push(fileDecks[0].name);
  else if (fileDecks.length && !out.includes("--deck") && ["try", "search", "versus", "loops", "lifts", "identity"].includes(cmd))
    out.push("--deck", fileDecks[0].name);
  return out;
}

async function main() {
  const [cmd = "summary", ...rawArgs] = process.argv.slice(2);
  if (cmd === "rising") return cmdRising(rawArgs);
  if (cmd === "poll") return cmdPoll(rawArgs);
  if (cmd === "field") return cmdField(rawArgs);
  if (cmd === "kobo") return cmdKobo();
  const cat = await loadCatalog();
  const args = await takeFileArgs(rawArgs, cat);
  if (cmd === "ideas") return cmdIdeas(cat, args);
  // meta reads only the archive and the catalog, so it works offline and never
  // touches the live Supabase row.
  if (cmd === "meta") return cmdMeta(cat, args);
  if (cmd === "event") return cmdEvent(args);
  if (cmd === "fight") return cmdFight(cat, args);
  if (cmd === "close") return cmdClose(cat, args);
  if (cmd === "cards") return cmdCards(cat, args);
  if (cmd === "gaps") return cmdGaps(cat, args);
  if (cmd === "pool") return cmdPool(cat, args);
  const S = await loadState();
  const q = mk(S);
  const table = {
    summary: () => cmdSummary(S, cat, q),
    deck: () => cmdDeck(S, cat, q, args),
    decks: () => cmdDeck(S, cat, q, args),
    // The deck page's "Copy list": Piltover Archive's paste format, to stdout.
    export: () => {
      const ds = findDecks(S, args.join(" ").trim());
      if (ds.length !== 1) { console.log(ds.length ? `${ds.length} decks match — narrow it: ${ds.map((d) => d.name).join(" · ")}` : "no deck matching that"); return; }
      process.stdout.write(deckText(ds[0], cat.idx));
    },
    card: () => cmdCard(S, cat, q, args),
    want: () => cmdWant(S, cat, q),
    wants: () => cmdWant(S, cat, q),
    trade: () => cmdTrade(S, cat, q),
    sets: () => cmdSets(S, cat, q),
    raw: () => console.log(JSON.stringify(S, null, 2)),
    journal: () => cmdJournal(S, args),
    intake: () => cmdIntake(S, cat, args),
    versus: () => cmdVersus(S, cat, args),
    try: () => cmdTry(S, cat, args),
    search: () => cmdSearch(S, cat, args),
    calibrate: () => cmdCalibrate(S, cat, args),
    lifts: () => cmdLifts(S, cat, args),
    trace: () => cmdTrace(cat, args),
    loops: () => cmdLoops(S, cat, args),
    bans: () => cmdBans(S, cat, args),
    identity: () => cmdIdentity(S, cat, args),
  };
  const fn = table[cmd];
  if (!fn) { console.error(`unknown command "${cmd}" — try: ${Object.keys(table).join(", ")}, fight, gaps`); process.exit(2); }
  await fn();
}

// Run only as a script: check.mjs imports the legality helpers above without a CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => { console.error("\nstate failed:", e.message); process.exit(1); });
