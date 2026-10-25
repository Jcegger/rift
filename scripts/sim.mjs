#!/usr/bin/env node
// Consistency simulator: plays a deck against nobody, thousands of times, and reports
// what its draws and runes let it do. Any deck, any legend.
//
//   scripts/sim riven                      # a saved deck, by name
//   scripts/sim --legend "rogue assassin"  # the best-placing legal list for a legend
//   scripts/sim --field 12                 # the 12 legends with the most top-8s, side by side
//   options: --games N (default 20000) · --seed S · --since YYYY-MM-DD (default 2026-09-15) · --all-sets
//            --champion "Riven, Broken Blade" · --key "Meditation,Blade of the Exile" · --json
//
// What it is, and what it is not. A goldfish: no opponent. A card is its cost, type, domain
// and Might, plus what its text does for its own side — draws, channels, tokens made on
// play, Gold, equipment Might, and whether it is interaction to hold (see classify and
// tokensOf below). That is enough to answer the questions a deck's mana base and curve
// decide, and nothing else:
//   - does the opening hand have plays, and what should a mulligan send back
//   - how much Energy the deck actually spends by turn 4 (tempo, the classic proxy)
//   - how often a card sits in hand for want of the right Power domain
//   - how much board (units, Might) it has to contest battlefields with by turn 3–4
//   - how often named key cards have been seen by a given turn
//   - with a Gold-making legend, its Gold; with lib/sim.mjs's opts.hide, hiding, and whether a
//     key answer could be used on the opponent's turn (face down, or paid from what's left)
// It does NOT say who wins a matchup. Points are capped at one per battlefield per turn
// (§472), so an unopposed deck scores on the same clock whatever it plays; a "turns to
// 8" figure would be the same number for every deck and is deliberately not reported.
//
// Rules modelled, each from docs/rules.md: 40-card main deck, the Chosen Champion starts
// in the Champion Zone and is castable from there (§103.3.a, §108.3.d); 4-card opening
// hand and one mulligan of up to 2 cards to the bottom (§116, §117); channel 2 ready runes
// a turn, the player going second channels 1 extra on their first turn (§315.3.b,
// §487.7); draw 1 every turn, including the first player's first (§315.4.b); a card
// costing E Energy and P Power needs max(E, P) runes, E of them ready, P of them of its
// domain and recycled to the bottom of the rune deck (§164.2, rules.md "Resources");
// units enter exhausted (§143.4), so a unit can first move the turn after it is played.

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadState, loadCatalog, bannedNameSet, standardNameSet, deckIsLegal } from "./state.mjs";

const url = (f) => new URL(`../data/${f}`, import.meta.url);
const readJson = async (f) => JSON.parse(await readFile(f, "utf8"));
import { rng, tokensOf, classify, engineOf, buildDeck, playGame, POLICIES, simulate, sweepRunes, TURNS } from "../lib/sim.mjs";
export { rng, tokensOf, classify, engineOf, buildDeck, playGame, POLICIES, simulate, sweepRunes };

// ── where decks come from ────────────────────────────────────────────────────
async function fieldLists(cat, since, allSets) {
  const snap = await readJson(url("decks.json"));
  const banned = await readJson(url("banned.json")).catch(() => ({ constructed: [] }));
  const bannedNames = bannedNameSet(banned);
  const std = allSets ? null : standardNameSet(banned, cat.cards);
  return snap.decks.filter((d) => (d.dt || "") >= since && deckIsLegal(d, cat.BY, bannedNames, std));
}
const bestPlacing = (lists) => lists.slice().sort((a, b) =>
  ((a.pl ?? 1e9) / (a.ec || 1)) - ((b.pl ?? 1e9) / (b.ec || 1)) || (b.vw || 0) - (a.vw || 0))[0];
const placeText = (d) => (d.pl != null && d.ec ? `${d.pl} of ${d.ec}, ${d.ev}` : "no placement on record");

// ── output ──────────────────────────────────────────────────────────────────
const f1 = (x) => x.toFixed(1), pct = (x) => `${Math.round(x * 100)}%`;
function report(title, src, deck, s, keys) {
  console.log(`\n${title}`);
  console.log(`  ${src}`);
  console.log(`  legend ${deck.legend ? deck.legend.n : "not in list"} · champion zone: ${deck.champ ? deck.champ.n : "none found"}` +
    ` · ${deck.main.length + (deck.champ ? 1 : 0)} main · ${deck.runes.length} runes` +
    (deck.unknown.length ? ` · ${deck.unknown.length} codes not in catalog: ${deck.unknown.join(", ")}` : ""));
  const runeMix = deck.runes.reduce((m, d) => ((m[d] = (m[d] || 0) + 1), m), {});
  const inter = [...new Set(deck.main.filter((c) => c.role === "interaction").map((c) => c.n))];
  console.log(`  interaction held, not cast (${deck.main.filter((c) => c.role === "interaction").length}): ${inter.join(", ") || "none"}`);
  console.log(`  runes ${Object.entries(runeMix).map(([d, q]) => `${q} ${d}`).join(" / ")} · ${s.games} games, half on the play`);
  console.log(`\n  MULLIGAN  ${s.flat ? "no policy beats keeping (the curve is smooth)" : `best policy: ${s.best}`}   (Energy spent turns 1–4: ` +
    Object.entries(s.policies).map(([k, v]) => `${k} ${f1(v)}`).join(" · ") + ")");
  const top = s.guide.slice(0, 5), bot = s.guide.slice(-5).reverse();
  console.log(`  keep first   ${top.map((g) => `${g.n} (+${f1(g.keep)})`).join(", ")}`);
  console.log(`  bottom first ${bot.filter((g) => g.keep < 0).map((g) => `${g.n} (${f1(g.keep)})`).join(", ") || "nothing loses tempo by being kept"}`);
  const sw = sweepRunes(deck, { games: Math.min(s.games, 4000) });
  if (sw) {
    const L = sw.listedRow;
    console.log(`\n  RUNES  listed ${L ? L.split : "not a 2-domain split"} · best ${sw.best.split}` +
      (L && sw.change ? `  (${sw.best.energy >= L.energy ? "+" : ""}${f1(sw.best.energy - L.energy)} Energy T1–4, stuck by T3 ${pct(L.stuck)} → ${pct(sw.best.stuck)})` : "  (no split is meaningfully better)"));
    console.log(`         ${sw.rows.map((x) => `${x.k}/${12 - x.k} ${f1(x.energy)}`).join(" · ")}`);
  }
  console.log(`\n               turn      1     2     3     4     5`);
  for (const side of ["play", "draw"]) {
    const x = s[side];
    console.log(`  on the ${side.padEnd(4)}  Energy spent ${x.spent.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`             units on board ${x.units.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`             Might on board ${x.might.map((v) => f1(v).padStart(5)).join(" ")}`);
    console.log(`        stuck on Power domain ${x.stuck.map((v) => pct(v).padStart(5)).join(" ")}`);
    if (x.seen) console.log(`   seen ${keys.join(" / ").slice(0, 20).padEnd(20)} ${x.seen.map((v) => pct(v).padStart(5)).join(" ")}`);
    console.log(`        no play turns 1–2: ${pct(x.noPlayT1T2)} · 2+ units by turn 3: ${pct(x.twoUnitsByT3)}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (k, d = null) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
  const games = Number(opt("--games", 20000)), seed = Number(opt("--seed", 1));
  const since = opt("--since", "2026-09-15");
  const keys = (opt("--key", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const json = args.includes("--json");
  const words = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && !["--json", "--all-sets"].includes(args[i - 1])));
  const cat = await loadCatalog();

  if (opt("--field")) {
    const lists = await fieldLists(cat, since, args.includes("--all-sets"));
    const by = new Map();
    // One row per legend: riftbound.gg names some lists "Lillia - Bashful Bloom" and others
    // "Bashful Bloom". Fold the dash form onto the epithet, but a "- Starter" legend is a
    // different card and keeps its own row.
    const legendKey = (ln) => (/ - /.test(ln) && !/ - Starter$/.test(ln) ? ln.slice(ln.indexOf(" - ") + 3) : ln);
    for (const d of lists) { if (!d.ln) continue; const k = legendKey(d.ln); if (!by.has(k)) by.set(k, []); by.get(k).push(d); }
    const rank = [...by.entries()].map(([ln, ls]) => ({ ln, ls, t8: ls.filter((d) => d.pl != null && d.pl <= 8).length, n: ls.length }))
      .sort((a, b) => b.t8 - a.t8 || b.n - a.n).slice(0, Number(opt("--field")));
    const rows = [];
    for (const a of rank) {
      const d = bestPlacing(a.ls);
      const deck = buildDeck(d.cards, cat, { legendCard: cat.BY.get(d.lg) });
      const s = simulate(deck, { games: Math.min(games, 6000), seed });
      const sw = sweepRunes(deck, { games: 2000, seed });
      rows.push({ ln: a.ln, t8: a.t8, s, deck, sw });
    }
    if (json) { console.log(JSON.stringify(rows.map((r) => ({ legend: r.ln, top8: r.t8, runes: r.sw, ...r.s })), null, 1)); return; }
    const scope = args.includes("--all-sets") ? "list (any set, Radiance included)" : "legal list";
    console.log(`\nFIELD · best-placing ${scope} per legend since ${since} · on the play / on the draw\n`);
    console.log(`  ${"legend".padEnd(30)} t8  inter  mulligan        Energy T1–4   units T3   Might T4   no play T1–2   stuck T3   runes`);
    for (const r of rows) {
      const p = r.s.play, q = r.s.draw;
      const e4 = (x) => x.spent.slice(0, 4).reduce((a, b) => a + b, 0);
      const inter = r.deck.main.filter((c) => c.role === "interaction").length;
      console.log(`  ${r.ln.slice(0, 30).padEnd(30)} ${String(r.t8).padStart(2)}  ${String(inter).padStart(5)}  ${r.s.best.padEnd(15)} ${f1(e4(p)).padStart(4)} / ${f1(e4(q)).padEnd(4)}  ` +
        `${f1(p.units[2])} / ${f1(q.units[2])}  ${f1(p.might[3]).padStart(4)} / ${f1(q.might[3]).padEnd(4)}  ` +
        `${pct(p.noPlayT1T2).padStart(4)} / ${pct(q.noPlayT1T2).padEnd(4)}    ${(pct(p.stuck[2]) + " / " + pct(q.stuck[2])).padEnd(10)} ` +
        (r.sw && r.sw.listedRow ? (r.sw.change ? `${r.sw.listed}/${12 - r.sw.listed} → ${r.sw.best.k}/${12 - r.sw.best.k} (stuck ${pct(r.sw.listedRow.stuck)} → ${pct(r.sw.best.stuck)})` : `${r.sw.listed}/${12 - r.sw.listed} fine`) : "—"));
    }
    console.log(`\n  inter = interaction cards held, not cast. A goldfish rewards tapping out, so a deck that
  holds up answers reads lower on Energy by design: that is a different style, not a worse
  deck. These numbers are consistency, never a ranking. Curve and mana, not who wins.`);
    return;
  }

  let list, title, src;
  if (opt("--legend")) {
    const q = opt("--legend").toLowerCase();
    const lists = (await fieldLists(cat, since, args.includes("--all-sets"))).filter((d) => (d.ln || "").toLowerCase().includes(q));
    if (!lists.length) { console.log(`no legal list since ${since} for a legend matching "${q}"`); process.exit(1); }
    const d = bestPlacing(lists);
    list = d.cards; title = `${d.ln.toUpperCase()} · best-placing list of ${lists.length}`; src = `${d.h || d.s} · ${placeText(d)}`;
  } else {
    const S = await loadState();
    const q = words.join(" ").toLowerCase();
    const d = (S.decks || []).find((x) => x.name.toLowerCase().includes(q));
    if (!q || !d) { console.log(`saved decks: ${(S.decks || []).map((x) => x.name).join(" · ")}`); process.exit(q ? 1 : 0); }
    list = d.cards; title = d.name.toUpperCase(); src = "your saved deck (main deck only; sideboard not shuffled)";
  }
  const deck = buildDeck(list, cat, { champion: opt("--champion") });
  const s = simulate(deck, { games, seed, keys });
  if (json) { console.log(JSON.stringify({ title, src, champion: deck.champ?.n, ...s }, null, 1)); return; }
  report(title, src, deck, s, keys);
  console.log(`\n  A goldfish: no opponent, so interaction is held and nothing here says who wins a matchup.
  Consistency and curve only; see README "Simulator" for what card text is read.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => { console.error("\nsim failed:", e.message); process.exit(1); });
