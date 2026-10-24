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
//   node scripts/state.mjs meta            # archetype shares over sanctioned-legal lists
//   node scripts/state.mjs meta diana      # one archetype: card play rates, best finishes
//   node scripts/state.mjs meta leblanc --since 2026-09-15   # only lists played after a date
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

import { readFile } from "node:fs/promises";
import { PRE_RIFT_KITS, PRE_RIFT_PROMO } from "../lib/kits.mjs";
import { indexCatalog, deckStats as libDeckStats, deckChecks, journalRecord, deckText, SB_MAX } from "../lib/decks.mjs";
import { pathToFileURL } from "node:url";
import { versus, weigh, effectsOf, looksInteractive } from "../lib/versus.mjs";
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
  const bannedNames = new Set((banned.constructed || []).map((b) => b.name));
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
   EVENT's date (data/events.json), other lists by posting date. */
export function bannedNameSet(banned) {
  return new Set((banned.constructed || []).map((b) => b.name));
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
// Per deck, the record against each opponent, then the last ten games.
function cmdJournal(S, args) {
  const games = S.journal || [];
  if (!games.length) { console.log("no games logged yet (log them on the Decks page of app/)"); return; }
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
  console.log(`  their cards shown when in ${pct(min).trim()}+ of lists (interaction from ${pct(min / 2).trim()}). Card by card; nothing here is a win rate.\n`);

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
    const tags = [b.deflect ? `Deflect ${b.deflect}` : "", b.tank ? "Tank" : "", b.hidden ? "Hidden" : "", b.ambush ? "Ambush" : ""].filter(Boolean).join(", ");
    const seen = new Set();
    const fmt = (a) => `${a.ok === false ? "✗ " : ""}${a.card.n}${a.note ? ` (${a.note})` : ""}`;
    const uniq = r.answers.filter((a) => { const k = a.card.n + (a.sb ? "|sb" : ""); if (seen.has(k)) return false; seen.add(k); return true; });
    const main = uniq.filter((a) => !a.sb), sb = uniq.filter((a) => a.sb && !main.some((m) => m.card.n === a.card.n));
    console.log(`    ${pct(r.share)} ×${r.avg.toFixed(1)} ${r.card.n} · ${b.might} Might${b.defend > b.might ? ` (${b.defend} defending)` : ""}${tags ? ` · ${tags}` : ""}`);
    console.log(`         ${main.map(fmt).join(" · ") || "nothing in the main deck"}`);
    if (sb.length) console.log(`         sb: ${sb.map((a) => a.card.n).join(" · ")}`);
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

async function main() {
  const [cmd = "summary", ...args] = process.argv.slice(2);
  if (cmd === "rising") return cmdRising(args);
  if (cmd === "poll") return cmdPoll(args);
  if (cmd === "field") return cmdField(args);
  const cat = await loadCatalog();
  if (cmd === "ideas") return cmdIdeas(cat, args);
  // meta reads only the archive and the catalog, so it works offline and never
  // touches the live Supabase row.
  if (cmd === "meta") return cmdMeta(cat, args);
  if (cmd === "event") return cmdEvent(args);
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
  };
  const fn = table[cmd];
  if (!fn) { console.error(`unknown command "${cmd}" — try: ${Object.keys(table).join(", ")}`); process.exit(2); }
  await fn();
}

// Run only as a script: check.mjs imports the legality helpers above without a CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => { console.error("\nstate failed:", e.message); process.exit(1); });
