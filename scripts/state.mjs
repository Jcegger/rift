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
//   node scripts/state.mjs piltover        # full Piltover Archive import CSV (Replace mode)
//   node scripts/state.mjs meta            # archetype shares over sanctioned-legal lists
//   node scripts/state.mjs meta diana      # one archetype: card play rates, best finishes
//   node scripts/state.mjs meta leblanc --since 2026-09-15   # only lists played after a date
//   node scripts/state.mjs event 660038    # a store event from Riot's locator: standings + legends
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
import { pathToFileURL } from "node:url";

const SUPA_URL = "https://gnujcqoyjovhqkquwapd.supabase.co";
const SUPA_KEY = "sb_publishable_U9pC2YEA9YB2KxPog6t3SA_T03Jid1g";
const SUPA_TABLE = "riftbound";
const SUPA_ID = "jay";

const url = (f) => new URL(`../data/${f}`, import.meta.url);
const readJson = async (f) => JSON.parse(await readFile(f, "utf8"));

// Type order the app sorts deck rows by; anything unknown sinks to the bottom.
const TYPES = ["Legend", "Champion Unit", "Unit", "Spell", "Gear", "Rune", "Battlefield"];
const typeRank = (t) => { const i = TYPES.indexOf(t); return i < 0 ? 99 : i; };

const SB_MAX = 10;                                        // §601.1.c.1
const SB_BANNED_TYPES = new Set(["Legend", "Rune", "Battlefield"]);  // §601.1.c.2
const MAX_COPIES = 3;                                     // §601.1.c.3, runes exempt

const money = (n) => (n == null ? "" : `$${n.toFixed(2)}`);
// A card's cost as it is paid: Energy, then Power. Power is `p` in the catalog (Riot's
// feed carries it; absent means 0). It is a count, not a colour: the domain it is paid
// in is the card's own, which a two-domain card leaves to the rules (§135.2.e.6).
const cost = (c) => {
  if (!c || (c.e == null && !c.p)) return "";
  return `${c.e ?? 0}E` + (c.p ? ` ${c.p}P` : "");
};
const pad = (s, n) => String(s).padEnd(n);

async function loadState() {
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

async function loadCatalog() {
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
  return { cards, BY, sets: cat.sets || [], bannedNames, errataApplied,
           errataCards: errataNames.size, errataAt: errata.generatedAt };
}

const mk = (S) => {
  const inv = (code) => S.inv?.[code] || {};
  const owned = (code) => (inv(code).n || 0) + (inv(code).f || 0);
  return { inv, owned, want: (c) => inv(c).w || 0, trade: (c) => inv(c).t || 0 };
};

function deckRows(deck, cat) {
  const { BY } = cat;
  return Object.entries(deck.cards || {})
    .map(([code, qty]) => ({ code, qty, card: BY.get(code) || null }))
    .sort((a, b) =>
      typeRank(a.card?.t) - typeRank(b.card?.t) ||
      (a.card?.n || a.code).localeCompare(b.card?.n || b.code));
}

function deckStats(deck, cat, q) {
  const rows = deckRows(deck, cat);
  const side = deckRows({ cards: deck.sb }, cat);
  let copies = 0, missing = 0, gap = 0, unknown = 0;
  let sideCopies = 0, sideMissing = 0, sideGap = 0;
  const bans = [];
  const mainByCode = new Map();
  for (const r of rows) {
    copies += r.qty;
    const have = r.card ? q.owned(r.code) : 0;
    const short = Math.max(0, r.qty - have);
    r.have = have; r.short = short;
    missing += short;
    mainByCode.set(r.code, (mainByCode.get(r.code) || 0) + r.qty);
    if (!r.card) unknown++;
    if (r.card && short) gap += (r.card.mp || 0) * short;
    if (r.card && cat.bannedNames.has(r.card.n)) bans.push(r);
  }
  for (const r of side) {
    sideCopies += r.qty;
    const own = r.card ? q.owned(r.code) : 0;
    r.have = Math.max(0, own - (mainByCode.get(r.code) || 0));   // spare after the main deck
    r.short = Math.max(0, r.qty - r.have);
    sideMissing += r.short;
    if (!r.card) unknown++;
    if (r.card && r.short) sideGap += (r.card.mp || 0) * r.short;
    if (r.card && cat.bannedNames.has(r.card.n)) bans.push(r);
  }
  return { rows, side, copies, distinct: rows.length, missing, gap, unknown, bans,
           sideCopies, sideDistinct: side.length, sideMissing, sideGap,
           totalMissing: missing + sideMissing, totalGap: gap + sideGap,
           issues: deckIssues(rows, side) };
}

// The rules a hand-entered deck breaks, as sentences. Kept separate from the ban
// list because a ban is a property of a card and these are properties of the deck.
function deckIssues(rows, side) {
  const out = [];
  const n = side.reduce((a, r) => a + r.qty, 0);
  if (n > SB_MAX) out.push(`sideboard is ${n} cards, ${n - SB_MAX} over the ${SB_MAX}-card limit`);
  const bad = side.filter((r) => r.card && SB_BANNED_TYPES.has(r.card.t));
  if (bad.length) out.push(`cannot be in a sideboard: ${
    bad.map((r) => `${r.card.n} (${r.card.t.toLowerCase()})`).join(", ")}`);
  const byName = new Map();
  for (const r of rows.concat(side)) {
    if (!r.card || r.card.t === "Rune") continue;
    byName.set(r.card.n, (byName.get(r.card.n) || 0) + r.qty);
  }
  const over = [...byName].filter(([, v]) => v > MAX_COPIES).sort((a, b) => b[1] - a[1]);
  if (over.length) out.push(`over ${MAX_COPIES} copies across main deck and sideboard: ${
    over.map(([nm, v]) => `${v}x ${nm}`).join(", ")}`);
  return out;
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
    ` · ${st.totalMissing} still to get · gap ${money(st.totalGap)}`);
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

export function deckIsLegal(deck, BY, bannedNames) {
  return !Object.keys(deck.cards || {}).some((k) => bannedNames.has(codeName(BY, k)));
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
  const illegal = all ? 0 : pool.filter((d) => !deckIsLegal(d, BY, bannedNames)).length;
  if (!all) pool = pool.filter((d) => deckIsLegal(d, BY, bannedNames));
  const beforeSince = pool.length;
  if (since) pool = pool.filter((d) => (playedOn(d) || "") >= since);
  const head = `${snap.decks.length} archived lists · ${all ? "banned lists included" : `${illegal} hold a banned card and are dropped`}` +
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

// Piltover Archive import CSV — a full carbon-copy snapshot of the collection.
// Jay's Piltover binder is never edited directly, so re-importing with Piltover's
// "Replace" mode (not "Merge") each time keeps it in sync with no drift to track.
const PILTOVER_HEADER = "Variant Number,Card Name,Set,Set Prefix,Rarity,Variant Type,Variant Label,Foil,Quantity,Language,Condition,Grading Company,Grading Value,Grading Label,Notes";

function csvEsc(s) {
  if (s == null) return "";
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function cmdPiltover(S, cat) {
  const rows = [];
  for (const [code, e] of Object.entries(S.inv || {})) {
    let n = e.n || 0;
    let f = e.f || 0;
    if (n + f <= 0) continue;
    const card = cat.BY.get(code);
    if (!card) continue; // not in catalog — nothing to map to a Piltover variant
    if (card.t === "Rune") continue;
    if (/-T\d/.test(code)) continue;
    if (card.fo && n > 0) { f += n; n = 0; } // foil-only printing recorded as Normal
    const num = code.replace(/\/\d+$/, "");
    if (n > 0) rows.push([num, card.n, false, n]);
    if (f > 0) rows.push([num, card.n, true, f]);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
  const lines = [PILTOVER_HEADER];
  for (const [num, name, foil, qty] of rows) {
    lines.push([num, name, "", "", "", "", "", foil, qty, "English", "", "", "", "", ""].map(csvEsc).join(","));
  }
  process.stdout.write(lines.join("\r\n") + "\r\n");
}

function cmdSets(S, cat, q) {
  for (const set of cat.sets) {
    const base = cat.cards.filter((c) => c.s === set.id && c.no <= set.base);
    const have = base.filter((c) => q.owned(c.c)).length;
    const play = base.filter((c) => q.owned(c.c) >= (S.playset || 3)).length;
    console.log(`  ${pad(set.id, 5)} ${pad(set.name, 20)} ${pad(`${have}/${set.base}`, 9)} owned · ${play} at playset`);
  }
}

async function main() {
  const [cmd = "summary", ...args] = process.argv.slice(2);
  const cat = await loadCatalog();
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
    card: () => cmdCard(S, cat, q, args),
    want: () => cmdWant(S, cat, q),
    wants: () => cmdWant(S, cat, q),
    trade: () => cmdTrade(S, cat, q),
    sets: () => cmdSets(S, cat, q),
    raw: () => console.log(JSON.stringify(S, null, 2)),
    piltover: () => cmdPiltover(S, cat),
  };
  const fn = table[cmd];
  if (!fn) { console.error(`unknown command "${cmd}" — try: ${Object.keys(table).join(", ")}`); process.exit(2); }
  fn();
}

// Run only as a script: check.mjs imports the legality helpers above without a CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => { console.error("\nstate failed:", e.message); process.exit(1); });
