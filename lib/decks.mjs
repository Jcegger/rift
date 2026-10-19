// Deck maths shared by the app (app/index.html) and the CLI (scripts/state.mjs).
//
// One copy on purpose. The old app and the CLI each grew their own idea of "owned"
// and "legal", and they disagreed: the CLI counted the exact printing a deck cited,
// so owning the alt art of a card read as owning none. Anything both surfaces answer
// lives here, in plain ES with no imports, so a browser and Node load the same file.
//
// Inputs are the repo's own shapes: catalog cards from data/cards.json (c, n, t, d, g,
// v, e, p, mp, x), the synced state's `inv` (code -> { n, f }) and a deck
// ({ id, name, cards: {code: qty}, sb: {code: qty} }).
//
// The rules are the handbook's (docs/rules.md, "Your deck"), cited where they are used.

export const MAIN_SIZE = 40;      // TR §601.1.b: exactly 40 in competition; the Chosen Champion counts
export const RUNE_COUNT = 12;     // §103.4
export const BATTLEFIELDS = 3;    // §103.5.c, each a different name
export const MAX_COPIES = 3;      // §103.3.b, by name, main + sideboard together; runes exempt
export const SIG_MAX = 3;         // §103.3.d: signature cards, 3 total regardless of name
export const SB_MAX = 10;         // TR §601.1.c.1
export const SB_BANNED_TYPES = new Set(["Legend", "Rune", "Battlefield"]);   // TR §601.1.c.2

// When a set becomes Standard-legal, for sets announced but not yet in TR §601.3.c.
// Riot's date, not an estimate (Radiance release, playriftbound.com). Drop an entry
// once data/banned.json's `standard.sets` carries the set.
export const SET_LEGAL_FROM = { RAD: "2026-10-23" };

const stripStarter = (n) => String(n || "").replace(/ - Starter$/, "");

/* ── the catalog, indexed once ───────────────────────────────────────────── */
export function indexCatalog(cards, banned = null) {
  const BY = new Map(cards.map((c) => [c.c, c]));
  // A legend's champion is the tag some champion unit is named after: Kennen's legend
  // is tagged ["Yordle", "Kennen"].
  const champs = new Set(cards.filter((c) => c.t === "Unit" && c.n.includes(", ")).map((c) => c.n.split(", ")[0]));
  const championOf = (c) => (c?.g || []).find((g) => champs.has(g)) || null;

  // Identity: what counts as "the same card" for owning it and for the copy limit.
  // Names include the subtitle (§103.3.b.2), so a name is a card; printings (alt art,
  // overnumber, a reprint in a later set) share it. Starter legends fold onto the base.
  const identity = (c) => {
    if (!c) return null;
    if (c.t === "Rune") return `Rune|${c.n}`;
    if (c.t === "Legend") return `Legend|${championOf(c) || ""}|${stripStarter(c.n)}`;
    return `${c.t}|${c.n}`;
  };
  const byId = new Map();
  for (const c of cards) {
    const id = identity(c);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(c);
  }
  // A signature card is a non-unit tagged with a champion (Blade of the Exile: Riven).
  const signatureOf = (c) => (c && c.t !== "Unit" && c.t !== "Legend" ? championOf(c) : null);
  const legendName = (c) => (c && c.t === "Legend" ? `${championOf(c) || "?"}, ${stripStarter(c.n)}` : null);

  const today = new Date().toISOString().slice(0, 10);
  const bannedNames = new Set((banned?.constructed || [])
    .filter((b) => !b.effective || b.effective <= today).map((b) => b.name));
  const stdSets = Array.isArray(banned?.standard?.sets) ? new Set(banned.standard.sets) : null;
  // Legal if a card of that name is printed in a Standard set (TR §601.2.a).
  const stdIds = stdSets ? new Set(cards.filter((c) => stdSets.has(c.s)).map(identity)) : null;
  const notYetStandard = (c) => {
    if (!stdIds || !c || stdIds.has(identity(c))) return null;
    const up = (banned?.standard?.upcoming || []).find((u) => u.set === c.s);
    return { set: c.s, from: up?.from || SET_LEGAL_FROM[c.s] || null };
  };

  return { cards, BY, byId, identity, championOf, signatureOf, legendName, bannedNames, notYetStandard };
}

// "Your deck can have any number of cards named X." on X itself.
export const unlimitedCopies = (c) => !!c && new RegExp(`deck can have any number of cards named ${c.n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(c.x || "");

/* ── what you own ────────────────────────────────────────────────────────── */
// identity -> copies owned, summed over every printing, normal and foil.
export function ownedByIdentity(inv, idx) {
  const out = new Map();
  for (const [code, e] of Object.entries(inv || {})) {
    const q = (e?.n || 0) + (e?.f || 0);
    if (!q) continue;
    const id = idx.identity(idx.BY.get(code));
    if (id) out.set(id, (out.get(id) || 0) + q);
  }
  return out;
}

// The cheapest market price among a card's printings, or null when none is priced.
// Null is "no price", never $0 — the repo's rule is that unknown prints as unknown.
export function bestPrice(card, idx) {
  let best = null;
  for (const c of idx.byId.get(idx.identity(card)) || []) {
    if (c.mp > 0 && (best == null || c.mp < best.price)) best = { price: c.mp, code: c.c };
  }
  return best;
}

const ZONE = (c) => !c ? "unknown" : c.t === "Legend" ? "legend" : c.t === "Rune" ? "rune"
  : c.t === "Battlefield" ? "battlefield" : "main";

/* ── one deck against the collection ─────────────────────────────────────── */
export function deckStats(deck, idx, inv) {
  const own = ownedByIdentity(inv, idx);
  const rowsOf = (cards) => Object.entries(cards || {}).filter(([, q]) => q > 0)
    .map(([code, qty]) => { const card = idx.BY.get(code) || null; return { code, qty, card, id: card ? idx.identity(card) : `?|${code}`, zone: ZONE(card) }; });
  const rows = rowsOf(deck.cards);
  const side = rowsOf(deck.sb);

  // Copies the main deck takes, per identity, so two printings of one card in the same
  // list share what you own, and the sideboard gets only what is left over.
  const mainUse = new Map();
  for (const r of rows) mainUse.set(r.id, (mainUse.get(r.id) || 0) + r.qty);
  const left = new Map([...mainUse.keys()].map((id) => [id, own.get(id) || 0]));
  for (const r of rows) {
    const have = r.card ? left.get(r.id) : 0;
    r.have = r.card ? own.get(r.id) || 0 : 0;
    r.short = Math.max(0, r.qty - have);
    left.set(r.id, Math.max(0, have - r.qty));
  }
  const spare = new Map();
  for (const r of side) {
    if (!spare.has(r.id)) spare.set(r.id, Math.max(0, (own.get(r.id) || 0) - (mainUse.get(r.id) || 0)));
    const have = r.card ? spare.get(r.id) : 0;
    r.have = have;
    r.short = Math.max(0, r.qty - have);
    spare.set(r.id, Math.max(0, have - r.qty));
  }

  const price = (r) => {
    if (!r.short || !r.card) return null;
    const p = bestPrice(r.card, idx);
    r.price = p ? p.price : null;
    r.cost = p ? Math.round(p.price * r.short * 100) / 100 : null;
    return r.cost;
  };
  const sum = (list) => {
    let total = 0, unpriced = 0, cards = 0;
    for (const r of list) { if (!r.short) continue; cards += r.short; const c = price(r); if (c == null) unpriced += r.short; else total += c; }
    return { cards, total: Math.round(total * 100) / 100, unpriced };
  };
  const zoneCount = (z) => rows.filter((r) => r.zone === z).reduce((a, r) => a + r.qty, 0);
  const legendRow = rows.find((r) => r.zone === "legend") || null;
  return {
    rows, side,
    legend: legendRow?.card || null,
    count: { legend: zoneCount("legend"), main: zoneCount("main"), rune: zoneCount("rune"),
             battlefield: zoneCount("battlefield"), unknown: zoneCount("unknown"),
             side: side.reduce((a, r) => a + r.qty, 0) },
    mainGap: sum(rows), sideGap: sum(side),
  };
}

/* ── the deck's rules, as checks ─────────────────────────────────────────── */
// Each check: { key, label, ok, val, detail? }. `ok` is true, false, or "later" for a
// card that is legal from a known future date (a new set before release).
export function deckChecks(deck, idx, st = null) {
  st = st || deckStats(deck, idx, {});
  const L = st.legend;
  const champ = L ? idx.championOf(L) : null;
  const ident = new Set(L?.d || []);
  const all = [...st.rows, ...st.side].filter((r) => r.card);
  const out = [];
  const add = (key, label, ok, val, detail) => out.push({ key, label, ok, val, detail });

  add("legend", "One Legend", st.count.legend === 1, L ? idx.legendName(L) : `${st.count.legend}`);
  add("main", `Main deck: ${MAIN_SIZE}`, st.count.main === MAIN_SIZE, `${st.count.main} / ${MAIN_SIZE}`);
  const hasChamp = champ && st.rows.some((r) => r.zone === "main" && r.card.t === "Unit" && r.card.n.startsWith(champ + ", "));
  add("champion", "A champion unit for the Chosen Champion", !!hasChamp, hasChamp ? champ : "none",
    "§103.3.a.2: a champion unit whose tag matches the Legend");
  add("runes", `Runes: ${RUNE_COUNT}`, st.count.rune === RUNE_COUNT, `${st.count.rune} / ${RUNE_COUNT}`);
  const bfNames = st.rows.filter((r) => r.zone === "battlefield").map((r) => r.card.n);
  add("battlefields", `Battlefields: ${BATTLEFIELDS}, all different`,
    bfNames.length === BATTLEFIELDS && new Set(bfNames).size === BATTLEFIELDS, `${bfNames.length} / ${BATTLEFIELDS}`);

  // Domain identity: every domain on the card must be one of the Legend's (§103.2.b.4).
  const offDomain = L ? all.filter((r) => r.zone !== "legend" && (r.card.d || []).some((d) => d !== "Colorless" && !ident.has(d))) : [];
  add("domains", L ? `Inside ${[...ident].join(" / ")}` : "Inside the Legend's domains", L ? !offDomain.length : false,
    offDomain.length ? `${new Set(offDomain.map((r) => r.card.n)).size} off` : "ok", offDomain.map((r) => r.card.n));

  // Copies by name across main + sideboard, runes exempt (§103.3.b).
  const byName = new Map();
  for (const r of all) if (r.zone !== "rune") byName.set(r.card.n, (byName.get(r.card.n) || 0) + r.qty);
  const unique = new Set(all.filter((r) => /\[Unique\]/.test(r.card.x || "")).map((r) => r.card.n));
  // Card text beats the rule (the golden rule): Spiderling's "Your deck can have any
  // number of cards named Spiderling" lifts the cap for that name.
  const unlimited = new Set(all.filter((r) => unlimitedCopies(r.card)).map((r) => r.card.n));
  const over = [...byName].filter(([n, q]) => !unlimited.has(n) && q > (unique.has(n) ? 1 : MAX_COPIES));
  add("copies", `No more than ${MAX_COPIES} of a name`, !over.length, over.length ? `${over.length} over` : "ok",
    over.map(([n, q]) => `${q}× ${n}`));

  // Signatures: only the Legend's champion's, and 3 in total (§103.3.d).
  const sigs = all.filter((r) => idx.signatureOf(r.card));
  const wrongSig = sigs.filter((r) => idx.signatureOf(r.card) !== champ);
  const sigTotal = sigs.reduce((a, r) => a + r.qty, 0);
  add("signatures", champ ? `Signatures: ${champ}'s only, ${SIG_MAX} total` : "Signatures match the Legend",
    !wrongSig.length && sigTotal <= SIG_MAX, wrongSig.length ? `${wrongSig.length} wrong` : `${sigTotal} / ${SIG_MAX}`,
    wrongSig.map((r) => `${r.card.n} is ${idx.signatureOf(r.card)}'s`));

  add("sideboard", `Sideboard: ${SB_MAX} or fewer`, st.count.side <= SB_MAX && !st.side.some((r) => r.card && SB_BANNED_TYPES.has(r.card.t)),
    `${st.count.side} / ${SB_MAX}`);

  const bans = all.filter((r) => idx.bannedNames.has(r.card.n));
  add("banned", "Nothing banned", !bans.length, bans.length ? `${bans.length} banned` : "ok", bans.map((r) => r.card.n));

  const later = all.map((r) => [r, idx.notYetStandard(r.card)]).filter(([, s]) => s);
  const dates = [...new Set(later.map(([, s]) => s.from))];
  add("standard", "Standard-legal", later.length ? (dates.every(Boolean) ? "later" : false) : true,
    later.length ? (dates.every(Boolean) ? `from ${dates.sort().pop()}` : `${later.length} not legal`) : "ok",
    later.map(([r, s]) => `${r.card.n} (${s.set}${s.from ? `, legal ${s.from}` : ""})`));

  if (st.count.unknown) add("unknown", "Every card in the catalog", false, `${st.count.unknown} unknown`);
  return out;
}

/* ── the journal ─────────────────────────────────────────────────────────── */
// S.journal: [{ at, deck, opp, res: "W"|"L"|"D" }], oldest first. One entry per game
// or per match, whatever was tapped; the record never pretends to know which.
export function journalRecord(journal, deckId = null) {
  const out = new Map();
  for (const g of journal || []) {
    if (deckId && g.deck !== deckId) continue;
    const r = out.get(g.opp) || { w: 0, l: 0, d: 0 };
    if (g.res === "W") r.w++; else if (g.res === "L") r.l++; else r.d++;
    out.set(g.opp, r);
  }
  return out;
}
