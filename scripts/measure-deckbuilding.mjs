// Re-measures docs/deckbuilding.md §1–5 (how winning lists are built) on today's archive,
// and the questions docs/deckbuilding-theory.md asks of the data. Kept so the numbers can be
// re-run; the 19–23 Oct originals were counted by a script nobody kept.
//
//   node scripts/measure-deckbuilding.mjs [--since 2026-10-23] [--until YYYY-MM-DD]
//
// Pool: legal lists today (bans applied), played since --since. Good finishes are
// lib/placing.mjs's (top quarter of a 32+ field, or a top 8), one per finish.
import { readFileSync } from "node:fs";
import { indexCatalog, mainOf, changed, MAIN_SIZE } from "../lib/decks.mjs";
import { finishesMaker, isRecord } from "../lib/placing.mjs";

const ROOT = new URL("..", import.meta.url);
const read = (f) => JSON.parse(readFileSync(new URL(f, ROOT), "utf8"));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const SINCE = opt("--since", "2026-10-23"), UNTIL = opt("--until", "9999");

const cat = read("data/cards.json"), banned = read("data/banned.json"), snap = read("data/decks.json");
let events = new Map();
try { events = new Map(read("data/events.json").events.map((e) => [e.name, e.dt])); } catch { /* optional */ }
const idx = indexCatalog(cat.cards, banned);
const bare = new Map();
for (const c of cat.cards) { bare.set(c.c, c); bare.set(String(c.c).replace(/\/\d+$/, ""), c); }
const card = (code) => bare.get(code) || bare.get(String(code).replace(/\/\d+$/, "")) ||
  bare.get(String(code).replace(/\/\d+$/, "").replace(/[a-z]$/i, "")) || null;

const playedOn = (d) => (d.tour && d.ev && events.get(d.ev)) || d.dt || "";
const legal = (d) => !Object.keys(d.cards || {}).some((k) => { const c = card(k); return c && idx.bannedNames.has(c.n); });
const pool = snap.decks.filter((d) => legal(d) && playedOn(d) >= SINCE && playedOn(d) <= UNTIL);
const legendOf = (d) => card(d.lg) || Object.keys(d.cards || {}).map(card).find((c) => c?.t === "Legend") || null;
const { goodFinishes } = finishesMaker(idx, card);
const good = goodFinishes(pool).filter((d) => legendOf(d));
const top8 = good.filter((d) => isRecord(d) && d.pl <= 8);

const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
const pct = (n, d) => `${Math.round((100 * n) / (d || 1))}%`;
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "—");
const main = (d) => mainOf(d.cards, card);
const champOf = (d) => idx.championOf(legendOf(d));

console.log(`pool: ${pool.length} legal lists played ${SINCE} → ${UNTIL === "9999" ? "today" : UNTIL}; ${good.length} good finishes (one per finish), ${top8.length} recorded top 8s\n`);

// §1 shape of a 40
{
  const distinct = [], split = { 3: 0, 2: 0, 1: 0 }; let names = 0;
  const champ = { 0: 0, 1: 0, 2: 0 }, sig = { 3: 0, 0: 0, between: 0 };
  for (const d of good) {
    const m = main(d); distinct.push(m.size);
    for (const q of m.values()) { names++; split[Math.min(3, q)]++; }
    const ch = champOf(d); let cu = 0, sg = 0;
    for (const [n, q] of m) { const c = idx.byId.get(`Unit|${n}`)?.[0]; if (c && idx.championOf(c) === ch) cu += q;
      const s = idx.byId.get(`Spell|${n}`)?.[0] || idx.byId.get(`Gear|${n}`)?.[0]; if (s && idx.signatureOf(s) === ch) sg += q; }
    champ[Math.min(2, cu)]++; sig[sg >= 3 ? 3 : sg === 0 ? 0 : "between"]++;
  }
  console.log("§1 A 40");
  console.log(`  distinct cards per 40: ${f1(mean(distinct))}`);
  console.log(`  3-ofs / 2-ofs / 1-ofs: ${pct(split[3], names)} / ${pct(split[2], names)} / ${pct(split[1], names)}`);
  console.log(`  champion units (all of the legend's champion's units): none ${pct(champ[0], good.length)} · one ${pct(champ[1], good.length)} · two+ ${pct(champ[2], good.length)}`);
  console.log(`  signatures: 3 ${pct(sig[3], good.length)} · none ${pct(sig[0], good.length)} · between ${pct(sig.between, good.length)}\n`);
}

// §2–3 consensus, core/mid/flex, distance
const byLegend = new Map();
for (const d of good) { const k = idx.legendName(legendOf(d)); if (!byLegend.has(k)) byLegend.set(k, []); byLegend.get(k).push(d); }
const consensus = (lists) => {
  const seen = new Map();
  for (const d of lists) for (const [n, q] of main(d)) { const r = seen.get(n) || { in: 0, qs: [] }; r.in++; r.qs.push(q); seen.set(n, r); }
  const rows = [...seen].map(([n, r]) => ({ n, share: r.in / lists.length, q: Math.round(med(r.qs)) })).sort((a, b) => b.share - a.share);
  const m = new Map(); let total = 0;
  for (const r of rows) { if (total >= MAIN_SIZE) break; const q = Math.min(r.q, MAIN_SIZE - total); m.set(r.n, q); total += q; }
  return { m, share: new Map(rows.map((r) => [r.n, r.share])) };
};
{
  const tiers = { core: [], mid: [], flex: [] }, shared = [], pair = [], off16 = [];
  const big = [...byLegend].filter(([, l]) => l.length >= 15);
  for (const [, lists] of big) {
    const { m, share } = consensus(lists);
    let core = 0, mid = 0, flex = 0;
    for (const [n, q] of m) { const s = share.get(n); if (s >= 0.8) core += q; else if (s >= 0.6) mid += q; else flex += q; }
    tiers.core.push(core); tiers.mid.push(mid); tiers.flex.push(flex);
    for (const d of lists) { const ch = changed(main(d), m); shared.push(MAIN_SIZE - ch); off16.push(ch > 16 ? 1 : 0); }
    for (let i = 0; i < lists.length; i++) for (let j = i + 1; j < lists.length; j++) pair.push(changed(main(lists[i]), main(lists[j])));
  }
  console.log(`§2–3 Consensus (legends with 15+ good finishes: ${big.length}; ${big.map(([k, l]) => `${k.split(",")[0]} ${l.length}`).join(", ")})`);
  console.log(`  core / mid / flex copies: ${f1(mean(tiers.core))} / ${f1(mean(tiers.mid))} / ${f1(mean(tiers.flex))}`);
  console.log(`  a good finish shares with its consensus (median): ${med(shared)} of 40; more than 16 off: ${pct(off16.filter(Boolean).length, off16.length)}`);
  console.log(`  two good finishes of one legend differ by (median copies): ${med(pair)}\n`);
}

// §5 shape by placing
{
  const shape = (lists) => {
    const u = [], cost = [], cheap = [], small = [];
    for (const d of lists) { let units = 0, e = 0, n = 0, ch = 0, sm = 0;
      for (const [nm, q] of main(d)) { const c = ["Unit", "Spell", "Gear"].map((t) => idx.byId.get(`${t}|${nm}`)?.[0]).find(Boolean); if (!c) continue;
        if (c.t === "Unit") { units += q; if ((c.e ?? 0) >= 2 && (c.e ?? 0) <= 4) sm += q; }
        e += (c.e || 0) * q; n += q; if ((c.e || 0) <= 2) ch += q; }
      u.push(units); cost.push(e / (n || 1)); cheap.push(ch); small.push(sm); }
    return `units ${f1(mean(u))} · avg cost ${mean(cost).toFixed(2)} · ≤2 Energy ${f1(mean(cheap))} · 2–4 cost units ${f1(mean(small))}`;
  };
  const goodSet = new Set(good);
  const unplaced = pool.filter((d) => isRecord(d) && !goodSet.has(d) && legendOf(d));
  console.log("§5 Shape by placing");
  console.log(`  top 8 (${top8.length}): ${shape(top8)}`);
  console.log(`  good finishes (${good.length}): ${shape(good)}`);
  console.log(`  recorded, not a good finish (${unplaced.length}): ${shape(unplaced)}\n`);
}

// New: do off-consensus lists place? A time split, so the consensus can't contain the lists it
// grades: consensus from good finishes before --split (default: the window's midpoint by date),
// graded on recorded lists after it, by distance from their legend's earlier consensus.
{
  const dates = pool.map(playedOn).filter(Boolean).sort();
  const SPLIT = opt("--split", dates[Math.floor(dates.length / 2)]);
  const before = new Map();
  for (const d of good) { if (playedOn(d) >= SPLIT) continue; const k = idx.legendName(legendOf(d)); if (!before.has(k)) before.set(k, []); before.get(k).push(d); }
  const bands = [[0, 6], [7, 12], [13, 16], [17, 40]];
  const rows = bands.map(() => ({ n: 0, good: 0 }));
  const goodSet = new Set(good);
  let legends = 0;
  for (const [k, lists] of before) {
    if (lists.length < 10) continue; legends++;
    const { m } = consensus(lists);
    for (const d of pool) { if (!isRecord(d) || !d.ec || playedOn(d) < SPLIT || idx.legendName(legendOf(d)) !== k) continue;
      const ch = changed(main(d), m); const b = bands.findIndex(([lo, hi]) => ch >= lo && ch <= hi); rows[b].n++; if (goodSet.has(d)) rows[b].good++; }
  }
  console.log(`New: recorded lists from ${SPLIT} on, by distance from their legend's consensus before ${SPLIT} (${legends} legends with 10+ earlier good finishes) → good-finish rate`);
  bands.forEach(([lo, hi], i) => console.log(`  ${lo}–${hi} copies off: ${rows[i].n} lists, ${pct(rows[i].good, rows[i].n)} good finishes`));
}
