// Tests for lib/swaps.mjs, and the backtest that keeps it honest.
//
// The Radiance previews are a natural experiment: older legends had Vendetta winning lists,
// then pros took Radiance cards into them at the NovaRiftbound Showdown and the Haven
// Radiance Preview. Run the swap logic on the Vendetta lists, with only what was known
// before Radiance (no adoption data for its cards), and score its "new card, same job"
// swaps against what the pros did. At the time of writing: 7 predicted, 3 adopted (43%),
// against 3.9% for a random Radiance card in the legend's colours. The test guards that the
// method stays well above chance; the sample is small, so it is not a target to tune to.
//
//   node lib/swaps.test.mjs

import { readFileSync } from "node:fs";
const ROOT = new URL("../", import.meta.url).pathname;
const { indexCatalog } = await import(ROOT + "lib/decks.mjs");
const { counter } = await import(ROOT + "lib/consensus.mjs");
const { suggestSwaps } = await import(ROOT + "lib/swaps.mjs");
const { docEngineLine, docEngineKeys } = await import(ROOT + "lib/research.mjs");
const MD = readFileSync(ROOT + "docs/archetypes.md", "utf8");
const R = (f) => JSON.parse(readFileSync(ROOT + "data/" + f, "utf8"));
const cat = R("cards.json"), extras = R("extras.json"), banned = R("banned.json"), snap = R("decks.json");
const known = new Set(cat.cards.map((c) => c.c));
const idx = indexCatalog([...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))], banned);
const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
const { consensus } = counter(idx, card);
const usable = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
const placedOf = (d) => (d.tour && d.pl != null) || Number(d.cp) > 0;
const RAD_EV = new Set(["NovaRiftbound's $2,000 Online Showdown 5", "Haven Online Challenger Series #5 - October 11th 2026 (Radiance Preview)"]);
const hasRad = (d) => Object.keys(d.cards).some((k) => card(k)?.s === "RAD");
const names = (d) => new Set(Object.keys(d.cards).map((k) => card(k)?.n).filter(Boolean));
const leg = (d) => idx.legendName(card(d.lg));
const before = usable.filter((d) => !RAD_EV.has(d.ev) && !hasRad(d));
// Quality from before Radiance only.
const identOf = (d) => (card(d.lg).d || []).filter((x) => x !== "Colorless").sort().join("/");
const lists = new Map(), has = new Map();
for (const d of before) { const id = identOf(d); lists.set(id, (lists.get(id) || 0) + 1); for (const n of names(d)) { const m = has.get(n) || has.set(n, new Map()).get(n); m.set(id, (m.get(id) || 0) + 1); } }
const quality = new Map();
for (const c of idx.cards) { if (c.v || quality.has(c.n)) continue; const ds = (c.d || []).filter((x) => x !== "Colorless"); let n = 0, w = 0; for (const [id, k] of lists) if (ds.every((x) => id.split("/").includes(x))) { n += k; w += has.get(c.n)?.get(id) || 0; } quality.set(c.n, { rate: n ? w / n : null, n }); }

const after = usable.filter((d) => RAD_EV.has(d.ev) && placedOf(d));
const legends = [...new Set(after.map(leg))].filter((L) => after.filter((d) => leg(d) === L).length >= 3);
let pred = 0, predHit = 0, outHit = 0, adoptedTotal = 0, adoptedFound = 0, baseNum = 0, baseDen = 0;
const share = (ds, n) => ds.filter((d) => names(d).has(n)).length / (ds.length || 1);
for (const L of legends) {
  const Lc = idx.cards.find((c) => c.t === "Legend" && !c.v && idx.legendName(c) === L);
  if (Lc.s === "RAD") continue;
  const ven = before.filter((d) => leg(d) === L && placedOf(d)), rad = after.filter((d) => leg(d) === L);
  if (ven.length < 5) continue;
  const con = consensus(ven);
  const anchor = con.main.map((r) => ({ c: card(r.code), copies: r.copies, inc: r.inc })).filter((r) => r.c && ["Unit", "Spell", "Gear"].includes(r.c.t));
  const own = new Map(); for (const d of ven) for (const n of names(d)) own.set(n, (own.get(n) || 0) + 1 / ven.length);
  const ident = new Set((Lc.d || []).filter((x) => x !== "Colorless"));
  const seen = new Set();
  const pool = idx.cards.filter((c) => !c.v && ["Unit", "Spell", "Gear"].includes(c.t) && (c.d || []).every((x) => x === "Colorless" || ident.has(x)) && !idx.bannedNames.has(c.n) && !seen.has(c.n) && seen.add(c.n));
  const swaps = suggestSwaps(anchor, { idx, legend: Lc, pool, quality, own, isNew: (c) => c.s === "RAD", engine: docEngineKeys(docEngineLine(MD, L)) });
  const radPool = pool.filter((c) => c.s === "RAD" && !(idx.signatureOf(c) && idx.signatureOf(c) !== idx.championOf(Lc)));
  const adopted = radPool.filter((c) => share(rad, c.n) >= 0.3).map((c) => c.n);
  adoptedTotal += adopted.length; baseNum += adopted.length; baseDen += radPool.length;
  const ups = swaps.filter((s) => s.kind === "upgrade");
  for (const s of ups) { pred++; const hit = adopted.includes(s.in); predHit += hit; const fell = share(ven, s.out) - share(rad, s.out) >= 0.3; outHit += fell; }
  adoptedFound += adopted.filter((n) => ups.some((s) => s.in === n)).length;
  console.log(`\n${L} — ${ven.length} Vendetta lists → ${rad.length} Radiance-preview lists · adopted (30%+): ${adopted.join(", ") || "none"}`);
  for (const s of swaps) console.log(`   ${s.kind.padEnd(7)} out ${s.out.padEnd(24)} in ${s.in.padEnd(26)} ${s.kind === "upgrade" ? (adopted.includes(s.in) ? "✓ ADOPTED" : "· not adopted") + (share(ven, s.out) - share(rad, s.out) >= 0.3 ? ", out card fell ✓" : "") : ""}`);
}
console.log(`\nUPGRADE predictions: ${pred}, adopted ${predHit} (precision ${pred ? Math.round(predHit / pred * 100) : 0}%), out-card actually fell in ${outHit}`);
console.log(`adopted Radiance cards found: ${adoptedFound} of ${adoptedTotal} (recall ${adoptedTotal ? Math.round(adoptedFound / adoptedTotal * 100) : 0}%)`);
console.log(`chance: a random Radiance card in the legend's colours is adopted ${Math.round(baseNum / baseDen * 1000) / 10}% of the time`);

let failed = 0;
const ok = (label, cond) => { if (!cond) failed++; console.log(`  ${cond ? "ok  " : "FAIL"} ${label}`); };
const chance = baseNum / baseDen, precision = pred ? predHit / pred : 0;
console.log("\nbacktest");
ok(`new-card swaps are adopted at 4x chance or better (${Math.round(precision * 100)}% vs ${Math.round(chance * 1000) / 10}%)`, precision >= 4 * chance);
ok(`and find at least a quarter of the cards pros adopted (${adoptedFound} of ${adoptedTotal})`, adoptedFound / adoptedTotal >= 0.25);
const { understood } = await import(ROOT + "lib/roles.mjs");
const nm = (n) => idx.cards.find((c) => c.n === n && !c.v);
console.log("rules");
ok("a card the role reader cannot read is protected from new-card swaps (Rhasa, Fizz, Matriarch)", ["Rhasa the Sunderer", "Fizz, Trickster", "Tail-Cloaked Matriarch"].every((n) => !understood(nm(n))));
ok("Trifarian Captain reads as card advantage and outvalues Salvage", (await import(ROOT + "lib/roles.mjs")).valueOf(nm("Trifarian Captain")) > (await import(ROOT + "lib/roles.mjs")).valueOf(nm("Salvage")));
console.log(failed ? `\n${failed} FAILED` : "\nall swap checks pass");
process.exit(failed ? 1 : 0);
