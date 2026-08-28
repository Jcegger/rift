#!/usr/bin/env node
// Reads the live collection/deck state and answers questions about it from the
// command line, so a shell session (or Claude Code) never has to open the app.
//
//   node scripts/state.mjs                 # one-screen summary
//   node scripts/state.mjs deck            # every saved deck, cards vs. still-to-get
//   node scripts/state.mjs deck sivir      # one deck, full per-card breakdown
//   node scripts/state.mjs card body rune  # every catalog card matching the words, with owned/want/trade
//   node scripts/state.mjs want            # outstanding wants (want > owned), with gap $
//   node scripts/state.mjs trade           # copies flagged for trade
//   node scripts/state.mjs sets            # base-set completion
//   node scripts/state.mjs raw             # the raw state JSON, pretty-printed
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
// want, for-trade. owned = n + f. A deck is { id, name, cards: {code: qty} }.
// "still to get" for a deck is the app's own math: sum of max(0, qty - owned).

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
  const cards = [...(cat.cards || []), ...(extras.cards || [])];
  const BY = new Map(cards.map((c) => [c.c, c]));
  const bannedNames = new Set((banned.constructed || []).map((b) => b.name));
  return { cards, BY, sets: cat.sets || [], bannedNames };
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
  let copies = 0, missing = 0, gap = 0, unknown = 0;
  const bans = [];
  for (const r of rows) {
    copies += r.qty;
    const have = r.card ? q.owned(r.code) : 0;
    const short = Math.max(0, r.qty - have);
    r.have = have; r.short = short;
    missing += short;
    if (!r.card) unknown++;
    if (r.card && short) gap += (r.card.mp || 0) * short;
    if (r.card && cat.bannedNames.has(r.card.n)) bans.push(r);
  }
  return { rows, copies, distinct: rows.length, missing, gap, unknown, bans };
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
  console.log("");
  const decks = S.decks || [];
  if (!decks.length) { console.log("DECKS       none saved"); return; }
  console.log(`DECKS (${decks.length})`);
  for (const d of decks) {
    const st = deckStats(d, cat, q);
    console.log(`  ${pad(d.name, 30)} ${st.copies} cards · ` +
      (st.missing ? `${st.missing} to get (${money(st.gap)})` : "complete") +
      (st.unknown ? ` · ${st.unknown} unknown` : "") +
      (st.bans.length ? ` · ${st.bans.length} BANNED` : ""));
  }
}

function cmdDeck(S, cat, q, args) {
  const needle = args.join(" ").trim();
  const decks = findDecks(S, needle);
  if (!decks.length) { console.log(needle ? `no deck matching "${needle}"` : "no decks saved"); return; }
  if (!needle || decks.length > 1) {
    for (const d of decks) {
      const st = deckStats(d, cat, q);
      console.log(`${pad(d.name, 30)} ${st.copies} cards · ${st.distinct} distinct · ` +
        (st.missing ? `${st.missing} to get (${money(st.gap)})` : "complete"));
    }
    if (decks.length > 1) console.log(`\n(${decks.length} decks matched — narrow the query for a full breakdown)`);
    return;
  }
  const d = decks[0];
  const st = deckStats(d, cat, q);
  console.log(`${d.name}\n`);
  for (const r of st.rows) {
    const nm = r.card ? r.card.n : "??? NOT IN CATALOG";
    const ty = r.card?.t || "";
    console.log(`  ${r.qty}x  ${pad(nm, 30)} ${pad(r.code, 14)} ${pad(ty, 11)} ` +
      `own ${r.have}${r.short ? `   NEED ${r.short}  ${money((r.card?.mp || 0) * r.short)}` : ""}`);
  }
  console.log(`\n  ${st.copies} cards · ${st.distinct} distinct · ${st.missing} still to get · gap ${money(st.gap)}`);
  if (st.unknown) console.log(`  ${st.unknown} card(s) not in the catalog`);
  if (st.bans.length) console.log(`  NOT CONSTRUCTED-LEGAL: ${st.bans.map((r) => r.card.n).join(", ")}`);
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
  };
  const fn = table[cmd];
  if (!fn) { console.error(`unknown command "${cmd}" — try: ${Object.keys(table).join(", ")}`); process.exit(2); }
  fn();
}

main().catch((e) => { console.error("\nstate failed:", e.message); process.exit(1); });
