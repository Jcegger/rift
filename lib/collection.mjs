// Collection maths for the app (index.html): importing from Piltover Archive (the
// source of truth since 24 Oct 2026) or a file, the list of new copies to file, foil-only
// typos, spares and trade matching.
//
// Ported from the old app (old/index.html), where each of these was a function over a
// global `S`. Here every function takes the state object it works on, so the app can
// apply an import to a fresh copy of the Supabase row inside a read-modify-write and
// a test can run the same code in Node. Behaviour is the old app's, line for line,
// apart from what the comments flag; lib/collection.test.mjs holds it to that.
//
// State shape (the synced row): inv: code -> { n normal, f foil, w want, t trade,
// o on the way, os its source label }, tags: code -> [names], newq: code -> {q, f, at}.

/* ── reading a file ──────────────────────────────────────────────────────── */
// Minimal RFC4180 parser: quoted fields, escaped quotes, CRLF, trailing newline.
export function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  const s = String(text).replace(/^﻿/, "");   // strip BOM
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else q = false;
      } else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch !== "\r") field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// The same column aliases riftbound.gg's own importer accepts, plus the ones its
// export, a TCGplayer export and a Piltover export use.
export const COLS = {
  id: ["cardid", "card id", "id", "card", "id_normal", "idnormal", "variant number"],
  name: ["name", "cardname", "card name", "productname", "product name"],
  set: ["set", "setid", "set id", "setcode", "set code", "edition"],
  number: ["number", "cardnumber", "card number", "collectornumber", "collector number", "no", "#"],
  normal: ["normal", "standard", "count", "qty", "quantity", "amount", "owned", "nonfoil", "non-foil"],
  foil: ["foil", "foils", "foilqty", "foil quantity"],
};
function mapHeader(header) {
  const norm = header.map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
  const out = {};
  for (const key in COLS) {
    const i = norm.findIndex((h) => COLS[key].includes(h));
    if (i >= 0) out[key] = i;
  }
  return out;
}

/* ── matching a row to a printing ────────────────────────────────────────── */
// Normalize a collector segment. Tokens and basic runes are letter-prefixed (T03, R01,
// SP1) and carry their own suffixes (T04s, R02a), so the prefix survives while the
// zero-padding does not.
//   "001" -> "1"   "066a" -> "66A"   "304*" / "304-star" -> "304*"   "T04s" -> "T4S"
export function normColl(seg) {
  let s = String(seg ?? "").replace(/\s+/g, "");
  if (!s) return null;
  // Deck lists carry printing markers the gallery does not: "-P" for a promo.
  s = s.replace(/[-_]P$/i, "");
  s = s.replace(/\/\d+$/, "");
  const star = /\*/.test(s) || /star$/i.test(s);
  s = s.replace(/\*/g, "").replace(/[-_]?star$/i, "");
  s = s.replace(/[-_]/g, "");   // "263-a" is just "263a"
  const m = /^([A-Za-z]*)0*(\d+)([A-Za-z]*)$/.exec(s);
  if (!m) return null;
  return `${m[1].toUpperCase()}${Number(m[2])}${m[3].toUpperCase()}${star ? "*" : ""}`;
}
// Drop a trailing letter suffix, keeping any prefix: "T4S" -> "T4", "66A" -> "66".
// Only a fallback, for printings Riot's gallery does not publish.
function baseColl(norm) {
  const m = /^([A-Za-z]*\d+)[A-Za-z]+(\*?)$/.exec(String(norm || ""));
  return m ? m[1] + m[2] : null;
}
function collKey(setId, number) {
  const n = normColl(number);
  return setId && n ? `${String(setId).toUpperCase().trim()}|${n}` : null;
}
// "OGN-066a/298", "UNL-T01", "VEN-SP1/006", and Riot's id "ogn-299-star-298".
function splitCode(code) {
  const m = /^([A-Za-z]{2,5})[-\s]+(.+)$/.exec(String(code ?? "").trim());
  if (!m) return null;
  const seg = m[2].replace(/\/\d+$/, "").replace(/[-_]star\b/i, "*").replace(/[-_]\d+$/, "");
  return { set: m[1].toUpperCase(), seg };
}
const keyFromCode = (code) => { const p = splitCode(code); return p ? collKey(p.set, p.seg) : null; };

// matcher(cards)(row) -> { card, exact } | null. exact:false means that printing is not
// in Riot's gallery and the copies went to the same-numbered base card, which the
// import report says rather than hides.
export function matcher(cards) {
  const byId = new Map(), byCode = new Map(), byColl = new Map(), byName = new Map();
  for (const c of cards) {
    if (c.ri) byId.set(c.ri.toLowerCase(), c);
    byCode.set(c.c.toLowerCase(), c);
    const k = keyFromCode(c.c);
    if (k && !byColl.has(k)) byColl.set(k, c);
    // Names map to base printings only, so a bare name never resolves to a chase card.
    const nk = c.n.toLowerCase();
    if (!c.v && !byName.has(nk)) byName.set(nk, c);
  }
  return (r) => {
    const keys = [];
    if (r.id) {
      const id = String(r.id).toLowerCase().trim();
      const hit = byId.get(id) || byCode.get(id);
      if (hit) return { card: hit, exact: true };
      keys.push(keyFromCode(r.id));
    }
    if (r.set && r.number) keys.push(collKey(r.set, r.number));
    if (r.number) keys.push(keyFromCode(r.number));
    for (const k of keys) if (k && byColl.has(k)) return { card: byColl.get(k), exact: true };
    for (const k of keys) {
      if (!k) continue;
      const [set, coll] = k.split("|");
      const base = baseColl(coll);
      const hit = base && byColl.get(`${set}|${base}`);
      if (hit) return { card: hit, exact: false };
    }
    if (r.name) {
      const hit = byName.get(String(r.name).toLowerCase().trim());
      if (hit) return { card: hit, exact: true };
    }
    return null;
  };
}

// Piltover Archive's public collection, as worker/ serves it at /piltover:
// { source: "piltover", collection: [{ card: "OGN-076a", standard: 3 }] }. One count per
// printing: Piltover's public data has no normal/foil split, so every copy reads as normal.
function readPiltoverJSON(d) {
  const int = (v) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? Math.min(999, n) : 0; };
  const rows = d.collection.map((x) => ({ id: x.card, name: "", set: "", number: "", n: int(x.standard), f: 0, bare: false }));
  return { rows, cols: ["card", "quantity"], kind: "piltover" };
}

// riftbound.gg's own shape, straight off /cgfw/getuserdata (through worker/). Richer
// than its CSV: trade and wishlist counts per finish, and custom tags.
function readCollectionJSON(text) {
  const d = JSON.parse(text);
  if (d && d.source === "piltover" && Array.isArray(d.collection)) return readPiltoverJSON(d);
  const list = Array.isArray(d) ? d : (d.collection || d.cards || d.data);
  if (!Array.isArray(list)) throw new Error("No collection array in that JSON.");
  const int = (v) => { const n = Math.floor(Number(String(v ?? "").trim())); return Number.isFinite(n) && n > 0 ? Math.min(999, n) : 0; };
  const rows = list.map((x) => ({
    id: x.card ?? x.cardid ?? x.card_id ?? x.id ?? "",
    name: x.name ?? "", set: x.set ?? x.setId ?? "", number: x.number ?? "",
    n: int(x.standard ?? x.normal ?? x.qty ?? x.quantity),
    f: int(x.foil),
    t: int(x.trade) + int(x.trade_foil),
    w: int(x.wish) + int(x.wish_foil) + int(x.wishlist),
    tags: ((x.extra_data || {}).customTags || []).map((t) => t && t.name).filter(Boolean),
    bare: false,
  }));
  return { rows, cols: ["card", "standard", "foil", "trade", "wish", "customTags"], kind: "json" };
}
function readCollectionCSV(text) {
  const grid = parseCSV(text);
  if (!grid.length) throw new Error("That file has no rows in it.");
  const cols = mapHeader(grid[0]);
  // Against null, not truthiness: column 0 is a perfectly good match.
  if (cols.id == null && cols.name == null && cols.number == null)
    throw new Error("No card column found. Expected one of: cardid, name, or number.");
  const num = (v) => { const n = Math.floor(Number(String(v ?? "").trim())); return Number.isFinite(n) && n > 0 ? Math.min(999, n) : 0; };
  const rows = grid.slice(1).map((cells) => ({
    id: cols.id != null ? cells[cols.id] : "",
    name: cols.name != null ? cells[cols.name] : "",
    set: cols.set != null ? cells[cols.set] : "",
    number: cols.number != null ? cells[cols.number] : "",
    n: cols.normal != null ? num(cells[cols.normal]) : 0,
    f: cols.foil != null ? num(cells[cols.foil]) : 0,
    // A file with no quantity column at all means one copy per listed row.
    bare: cols.normal == null && cols.foil == null,
  }));
  return { rows, cols: Object.keys(cols) };
}

/* ── the import ──────────────────────────────────────────────────────────── */
// Mirror owned counts from an import into `state` (mutated). Owned counts are replaced
// wholesale, so a card removed at the source drops to zero here; Want and Trade
// survive unless state.mirrorTradeWish is on and the source is riftbound.gg's JSON.
// Gains are banked in state.newq (the new copies to file, which `scripts/rift intake`
// reads), and "on the way" retires as copies land.
//
// A Piltover pull carries totals only, so for it a printing is compared and banked by
// its total: the first pull moving every foil count onto normal is not a change, and
// not 750 new copies to file.
export function applyImport(state, text, match, today = new Date().toISOString().slice(0, 10)) {
  state.inv = state.inv || {};
  state.newq = state.newq || {};
  const trimmed = String(text).trim();
  const isJSON = trimmed.startsWith("{") || trimmed.startsWith("[");
  const { rows, cols, kind } = isJSON ? readCollectionJSON(trimmed) : readCollectionCSV(trimmed);
  const mirror = !!state.mirrorTradeWish && kind === "json";
  const totals = kind === "piltover";
  const held0 = (code) => { const e = state.inv[code] || {}; return { n: e.n || 0, f: e.f || 0 }; };

  const owned = new Map();   // code -> {n, f, t, w}
  const tags = {};
  const unmatched = [], approx = [];
  for (const r of rows) {
    const hit = match(r);
    if (!hit) {
      const label = [r.name, r.id, r.set && r.number ? `${r.set} ${r.number}` : r.number].filter(Boolean).join(" · ");
      if (label) unmatched.push(label);
      continue;
    }
    const { card, exact } = hit;
    if (!exact) approx.push(`${r.id || r.number} → ${card.c}`);
    const prev = owned.get(card.c) || { n: 0, f: 0, t: 0, w: 0 };
    // Duplicate rows for one printing (one per finish, say) add up rather than clobber.
    owned.set(card.c, { n: prev.n + (r.bare ? 1 : r.n), f: prev.f + r.f, t: prev.t + (r.t || 0), w: prev.w + (r.w || 0) });
    if (r.tags && r.tags.length) tags[card.c] = [...new Set([...(tags[card.c] || []), ...r.tags])];
  }
  // Tags are riftbound.gg's; a Piltover pull has none to give, so it leaves them be.
  if (!totals) state.tags = tags;

  let added = 0, changed = 0, cleared = 0, queued = 0;
  const before = new Map(Object.keys(state.inv).map((c) => [c, held0(c)]));

  // Copies this pull gained, banked as the new copies to file. A first pull has nothing
  // to have gained against, and banking a whole collection as "new" would be a list
  // nobody could clear honestly. Split by finish: a foil is not a spare normal.
  const heldBefore = [...before.values()].reduce((a, x) => a + x.n + x.f, 0);
  const bank = (code, n, f) => {
    if (!heldBefore || !(n > 0 || f > 0)) return;
    const e = state.newq[code] || { q: 0, f: 0 };
    if (n > 0) e.q = (e.q || 0) + n;
    if (f > 0) e.f = (e.f || 0) + f;
    e.at = today;
    state.newq[code] = e;
    queued += Math.max(0, n) + Math.max(0, f);
  };

  // A full-catalog export lists every card including those held at zero; fold the zero
  // rows in with the cards the file omits: both mean "no longer owned".
  const zeroed = new Set();
  for (const [code, q] of owned) if (!q.n && !q.f) zeroed.add(code);
  const drop = (code) => {
    const e = state.inv[code];
    if (!e) return;
    if (e.n || e.f) cleared++;
    delete e.n; delete e.f;
    if (!Object.keys(e).length) delete state.inv[code];
  };
  for (const code of Object.keys(state.inv)) if (!owned.has(code) || zeroed.has(code)) drop(code);

  for (const [code, q] of owned) {
    if (zeroed.has(code) && !(mirror && (q.t || q.w))) continue;
    const had = before.get(code);
    const e = { ...(state.inv[code] || {}) };
    e.n = q.n; e.f = q.f;
    if (mirror) { e.t = q.t; e.w = q.w; }
    for (const k of ["n", "f", "t", "w"]) if (!e[k]) delete e[k];
    if (Object.keys(e).length) state.inv[code] = e; else delete state.inv[code];
    if (zeroed.has(code)) continue;
    // An entry that existed only to hold a Want counts as newly owned, not changed.
    if (!had || (!had.n && !had.f)) added++;
    else if (totals ? had.n + had.f !== q.n + q.f : had.n !== q.n || had.f !== q.f) changed++;
    if (totals) bank(code, (q.n + q.f) - (had ? had.n + had.f : 0), 0);
    else bank(code, q.n - (had ? had.n : 0), q.f - (had ? had.f : 0));
  }

  // Copies that have landed retire "on the way" by that much, so it never only grows.
  let arrived = 0;
  for (const code of Object.keys(state.inv)) {
    const e = state.inv[code];
    const q = e.o || 0;
    if (!q) continue;
    const had = before.get(code);
    const rise = ((e.n || 0) + (e.f || 0)) - (had ? had.n + had.f : 0);
    if (rise <= 0) continue;
    const left = Math.max(0, q - rise);
    arrived += q - left;
    if (left) e.o = left; else { delete e.o; delete e.os; }
    if (!Object.keys(e).length) delete state.inv[code];
  }

  const copies = [...owned.values()].reduce((a, q) => a + q.n + q.f, 0);
  return { rows: rows.length, matched: owned.size - zeroed.size, copies, mirror, kind,
    added, changed, cleared, queued, unmatched, approx, arrived, cols };
}

/* ── hand-kept counts ────────────────────────────────────────────────────── */
// Want (w), Trade (t) and On the way (o) are the fields an import leaves alone, so
// they are the ones the app edits. Owned counts (n, f) come from the pull only.
export function setCount(state, code, field, val) {
  state.inv = state.inv || {};
  const v = Math.max(0, Math.min(999, Math.floor(Number(val) || 0)));
  const e = { ...(state.inv[code] || {}) };
  if (v) e[field] = v; else delete e[field];
  // A source label with nothing on the way is an orphan; the two clear together.
  if (field === "o" && !v) delete e.os;
  if (Object.keys(e).length) state.inv[code] = e; else delete state.inv[code];
}
export function setSource(state, code, label) {
  const s = String(label || "").trim().slice(0, 40);
  const e = { ...(state.inv?.[code] || {}) };
  if (s && (e.o || 0) > 0) e.os = s; else delete e.os;
  if (Object.keys(e).length) state.inv[code] = e; else delete state.inv[code];
}

/* ── new copies to file ─────────────────────────────────────────────────── */
// Copies the source has gained since this was last cleared, clamped to what is held now,
// so a correction over there walks the list back without bookkeeping of its own. Kept
// as `newq` in the row (it began as the Piltover worklist); `scripts/rift intake` reads it.
export function newqRows(state, BY) {
  return Object.entries(state.newq || {})
    .map(([code, e]) => {
      const held = state.inv?.[code] || {};
      const n = Math.min(e.q || 0, held.n || 0), f = Math.min(e.f || 0, held.f || 0);
      return { code, card: BY.get(code), at: e.at || "", n, f, q: n + f };
    })
    .filter((r) => r.card && r.q > 0)
    .sort((a, b) => b.at.localeCompare(a.at) || a.code.localeCompare(b.code));
}
export const newqText = (rows) => rows.map((r) => `${r.q}x ${r.code} ${r.card.n}${r.f ? ` (${r.f} foil)` : ""}`).join("\n");

/* ── spares and trades ───────────────────────────────────────────────────── */
// Copies past the playset, by card identity (lib/decks.mjs), so alt arts count as the
// card. Runes and legends are left out: lists run nine of a rune, and a legend's extra
// printings are chase cards, not trade filler.
export function spares(inv, idx, keep = 3) {
  const by = new Map();
  for (const [code, e] of Object.entries(inv || {})) {
    const q = (e?.n || 0) + (e?.f || 0);
    const card = idx.BY.get(code);
    if (!q || !card || card.t === "Rune" || card.t === "Legend" || card.t === "Token") continue;
    const id = idx.identity(card);
    const x = by.get(id) || { id, card, copies: 0 };
    x.copies += q;
    if (!card.v && x.card.v) x.card = card;     // label by the base printing
    by.set(id, x);
  }
  return [...by.values()].filter((x) => x.copies > keep)
    .map((x) => ({ ...x, surplus: x.copies - keep }))
    .sort((a, b) => b.surplus - a.surplus || a.card.n.localeCompare(b.card.n));
}

// A partner's public riftbound.gg profile, reduced to identities. Most people never fill
// in a trade list, so their surplus past the playset stands in for one.
export function readPartner(user, payload, match, idx, keep = 3) {
  const int = (v) => { const n = Math.floor(Number(String(v ?? "").trim())); return Number.isFinite(n) && n > 0 ? n : 0; };
  const byId = new Map();
  for (const x of payload?.collection || []) {
    const hit = match({ id: x.card ?? x.cardid ?? x.id ?? "" });
    if (!hit) continue;
    const id = idx.identity(hit.card);
    const e = byId.get(id) || { card: hit.card, copies: 0, trade: 0, wish: 0 };
    e.copies += int(x.standard ?? x.normal) + int(x.foil);
    e.trade += int(x.trade) + int(x.trade_foil);
    e.wish += int(x.wish) + int(x.wish_foil);
    if (!hit.card.v && e.card.v) e.card = hit.card;
    byId.set(id, e);
  }
  const offers = new Map(), wants = new Map();
  for (const [id, e] of byId) {
    const isRune = e.card.t === "Rune";
    const give = e.trade || (isRune ? 0 : Math.max(0, e.copies - keep));
    if (give > 0) offers.set(id, { card: e.card, qty: give, explicit: !!e.trade });
    if (e.wish > 0) wants.set(id, { card: e.card, qty: e.wish });
  }
  return { user, name: payload?.user?.nickname || user, offers, wants, rows: (payload?.collection || []).length };
}

// The two directions of a trade. "What I need" is your explicit wants plus the cards
// your own decks are short of — not the whole meta's, as the old app had it: the site
// is built around the decks you actually play now.
//   needs: Map identity -> { card, qty, why }
export function tradeMatch(partner, needs, mySpares) {
  const sp = new Map(mySpares.map((s) => [s.id, s]));
  const theyGive = [], youGive = [];
  for (const [id, o] of partner.offers) {
    const n = needs.get(id);
    if (n) theyGive.push({ card: o.card, qty: Math.min(o.qty, n.qty), why: n.why });
  }
  for (const [id, w] of partner.wants) {
    const s = sp.get(id);
    if (s) youGive.push({ card: s.card, qty: Math.min(w.qty, s.surplus) });
  }
  const by = (a, b) => b.qty - a.qty || a.card.n.localeCompare(b.card.n);
  return { theyGive: theyGive.sort(by), youGive: youGive.sort(by) };
}
