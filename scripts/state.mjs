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
    console.log(`  ${r.qty}x  ${pad(nm, 30)} ${pad(r.code, 14)} ${pad(ty, 11)} ` +
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
    console.log(`  ${pad(c.n, 30)} ${pad(c.c, 14)} ${pad(c.t, 11)} ${pad(money(c.mp), 7)} ${bits.join(" · ") || "—"}`);
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
  const S = await loadState();
  const cat = await loadCatalog();
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

main().catch((e) => { console.error("\nstate failed:", e.message); process.exit(1); });
