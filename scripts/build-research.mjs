#!/usr/bin/env node
// Regenerates data/research.json: for every legend, what the model thinks the deck is
// built to do, and the questions where that model and the winning lists disagree.
// Fetches nothing — it reads data/decks.json, data/synergy.json, the catalog,
// docs/archetypes.md and docs/research.md, so it runs after build-archetypes.
//
//   node scripts/build-research.mjs
//
// Why it exists. The engine finder (lib/engines.mjs) reads card text and suggests cards
// that feed what a deck does. Text is not play: it suggested Karthus to Rek'Sai, a card
// in 0 of 61 placed Rek'Sai lists and 89% of LeBlanc's. When a long-legal card that a
// legend's winners never play looks like a fit, the likelier explanation is that the
// winners know something the pattern does not. So such a card is not suggested; it is
// queued as a question, with the evidence that usually explains it gathered up front:
//
//   - elsewhere: who does play it, and how much (a real card, or one nobody plays)
//   - engine:    whether it feeds the deck's main engine or a side one
//   - cost:      its Energy against the deck's curve, its Power against the domain the
//                winning list already asks most of
//   - slot:      the core cards already at its cost and type
//   - radiance:  new cards in the same engine and colours, which may change the answer
//
// The answer is hand-written in docs/research.md (### <id>, **Verdict:**, **Answer:**),
// and the verdict decides what the site does with the card: skip keeps it out, test
// lets it be suggested with the answer beside it, model means the reader was wrong (fix
// lib/engines.mjs). Brand-new cards are never questions — nobody has had the chance to
// play them — they are labelled untested instead.
//
// A second kind of question: the model itself disagreeing with what is written. When
// docs/archetypes.md names an engine for a legend and the model's main engine is a
// different one, one of them is wrong; Rek'Sai's "Engine: deaths" was.

import { readFile, writeFile } from "node:fs/promises";
import { indexCatalog, SET_LEGAL_FROM } from "../lib/decks.mjs";
import { counter } from "../lib/consensus.mjs";
import { deckEngines, engineTags, ENGINES } from "../lib/engines.mjs";
import { MIN_PLACED, SKIP_SHARE, VERDICTS, itemId, docEngineLine, docEngineKeys } from "../lib/research.mjs";

const ELSEWHERE = 0.3;   // a skipped card is a question only if some legend plays it this much
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const readDoc = async (f) => { try { return await readFile(new URL(`../docs/${f}`, import.meta.url), "utf8"); } catch { return ""; } };
const round = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;
const pct = (x) => `${Math.round(x * 100)}%`;

// The answers: "### <id>" sections with **Verdict:** and **Answer:** lines.
export function parseAnswers(md) {
  const out = new Map();
  // Code fences hold examples of the format, not answers.
  for (const sec of md.replace(/^```[\s\S]*?^```/gm, "").split(/^### /m).slice(1)) {
    const id = sec.split("\n")[0].trim();
    const verdict = (sec.match(/^\*\*Verdict:\*\*\s*(\w+)/m) || [])[1] || null;
    const answer = (sec.match(/^\*\*Answer:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/m) || [])[1]?.replace(/\s+/g, " ").trim() || null;
    out.set(id, { verdict, answer });
  }
  return out;
}

const main = async () => {
  const [cat, extras, banned, snap, syn] = await Promise.all([read("cards.json"), read("extras.json"), read("banned.json"), read("decks.json"), read("synergy.json")]);
  const [archMd, resMd] = await Promise.all([readDoc("archetypes.md"), readDoc("research.md")]);
  const known = new Set(cat.cards.map((c) => c.c));
  const all = [...cat.cards, ...(extras.cards || []).filter((c) => c.c && !known.has(c.c))];
  const idx = indexCatalog(all, banned);
  const byShort = new Map(idx.cards.map((c) => [c.c.replace(/\/\d+$/, ""), c]));
  const card = (code) => idx.BY.get(code) || byShort.get(String(code).replace(/\/\d+$/, "")) || null;
  const byName = new Map(idx.cards.filter((c) => !c.v).map((c) => [c.n, c]));
  const { consensus } = counter(idx, card);
  const answers = parseAnswers(resMd);

  const usable = snap.decks.filter((d) => d.lg && card(d.lg) && !Object.keys(d.cards).some((k) => idx.bannedNames.has(card(k)?.n)));
  const byLegend = new Map();
  for (const d of usable) { const n = idx.legendName(card(d.lg)); (byLegend.get(n) || byLegend.set(n, []).get(n)).push(d); }
  const legendCards = new Map();
  for (const c of idx.cards) if (c.t === "Legend" && !c.v && !/ - Starter$/.test(c.n)) { const n = idx.legendName(c); if (!legendCards.has(n)) legendCards.set(n, c); }

  // A card is new if it was not legal for the whole window: nobody has had the chance to
  // skip it. Today that is Radiance; the next set arrives the same way.
  const legalFrom = (c) => SET_LEGAL_FROM[c.s] || (banned?.standard?.upcoming || []).find((u) => u.set === c.s)?.from || null;
  const isNew = (c) => !!idx.notYetStandard(c) || (legalFrom(c) || "") > snap.window.from;

  const legends = {}, items = [];
  for (const [name, L] of legendCards) {
    const lists = byLegend.get(name) || [];
    const placed = lists.filter((d) => (d.tour && d.pl != null) || Number(d.cp) > 0);
    const legendTags = engineTags(L).map((t) => t.engine);
    const docLine = docEngineLine(archMd, name);
    const row = { placed: placed.length, lists: lists.length, legendEngines: [...new Set(legendTags)], doc: docLine, flags: [] };
    legends[name] = row;
    if (!legendTags.length) row.flags.push("legend-unread");
    if (placed.length < MIN_PLACED) { row.flags.push("thin"); if (!lists.length) continue; }
    const from = placed.length >= MIN_PLACED ? placed : lists;

    // The winners' share of each card, by name.
    const have = new Map();
    for (const d of from) for (const n of new Set(Object.keys(d.cards).map((k) => card(k)?.n).filter(Boolean))) have.set(n, (have.get(n) || 0) + 1);
    const share = (n) => (have.get(n) || 0) / from.length;

    const con = consensus(from);
    const conRows = con.main.map((r) => ({ ...r, c: card(r.code) })).filter((r) => r.c);
    const E = deckEngines(con.cards, idx, { max: 999 });
    row.engines = E.map((e) => e.key);
    // Only a loop is the deck's engine; a list with none (a curve, removal, ramp) has no main.
    row.main = E[0]?.loop ? E[0].key : null;
    row.core = conRows.filter((r) => r.inc >= 0.6).map((r) => r.name);
    // Signature cards (played far more here than by the colours) that tag no engine: the
    // deck is doing something with them the reader cannot see.
    row.unread = Object.entries(syn.cards).filter(([n, c]) => c.legends.some((l) => l.name === name && l.share >= 0.5 && l.lift >= 2.5))
      .filter(([n]) => byName.get(n) && !engineTags(byName.get(n)).length).map(([n]) => n);

    // The Power the winning list already asks of each domain, per 40 cards.
    const powerAsk = {};
    for (const r of conRows) if (r.c.p && (r.c.d || []).length === 1) powerAsk[r.c.d[0]] = (powerAsk[r.c.d[0]] || 0) + r.copies * r.c.p;
    const costs = conRows.flatMap((r) => Array(r.copies).fill(r.c.e ?? 0));
    const avgCost = round(costs.reduce((a, b) => a + b, 0) / (costs.length || 1), 1);
    const atOrBelow = (e) => costs.filter((x) => x <= e).length;

    // Doc vs model: the hand-written engine should name the model's main one, "none"
    // included — a doc that says a deck has no engine, or a reader that finds none where
    // the doc names one, is the same disagreement.
    const want = docEngineKeys(docLine), got = row.main || "none";
    if (want.length && !want.includes(got)) {
      const id = `${itemId(name, "engine")}`;
      items.push({ id, kind: "doc", legend: name, card: null,
        title: `docs/archetypes.md says the engine is "${docLine.split(" — ")[0]}"; the cards say ${got === "none" ? "no engine" : ENGINES.find((e) => e.key === got).name}`,
        evidence: [`Model's engines, strongest first: ${E.map((e) => e.name + (e.loop ? "" : " (incidental)")).join(" > ") || "none"}`, `Legend text: ${L.x ? `"${String(L.x).slice(0, 160)}"` : "none"}`],
        hypotheses: ["One of the two is wrong: read the legend's text, a winning list and any guide before changing either. Kha'Zix was settled by Jun's guide: the deck's own payoffs say movement, though the legend's trigger is winning fights."] });
    }

    row.cards = {};
    if (placed.length < MIN_PLACED) continue;   // absence from a handful of lists proves nothing
    const seen = new Set();
    const champ = idx.championOf(L);
    for (const [rank, e] of E.entries()) {
      const qs = [];
      for (const cand of e.candidates) {
        if (seen.has(cand.name)) continue;
        seen.add(cand.name);
        const c = byName.get(cand.name) || card(cand.code);
        if (isNew(c)) { row.cards[cand.name] = { status: "untested", share: round(share(cand.name)) }; continue; }
        const s = share(cand.name);
        if (s >= SKIP_SHARE) continue;
        // Who plays it, leaving out its own champion's legend: Master Yi, Honed is in Yi
        // decks because it is Yi's card, which says nothing about whether it is good.
        const own = idx.championOf(c);
        const homes = (syn.cards[cand.name]?.legends || []).filter((l) => l.name !== name && legendCards.has(l.name) && !(own && own !== champ && idx.championOf(legendCards.get(l.name)) === own))
          .sort((a, b) => b.share - a.share);
        // A question only when it could matter: a payoff (what an engine is for), or an
        // enabler of the deck's main engine; and some other legend plays it heavily. A
        // card nobody plays anywhere is skipped without one — the field has answered it.
        // Only an engine that loops in this list counts: a payoff for a pattern the deck
        // touches by accident (two stray Empower cards) does not fit the deck.
        const asks = e.loop && homes.some((h) => h.share >= ELSEWHERE) && (cand.roles.includes("payoff") || rank === 0);
        row.cards[cand.name] = { status: "skipped", share: round(s), ...(asks ? { id: itemId(name, `engine-${e.key}`) } : {}) };
        if (!asks) continue;
        const why = [];
        const dom = (c.d || [])[0];
        if (c.p && dom) why.push(`${c.e}E + ${c.p} ${dom}; the winning list already asks ${powerAsk[dom] || 0} ${dom} Power${(powerAsk[dom] || 0) >= Math.max(...Object.values(powerAsk), 0) ? ", its most-asked domain" : ""}`);
        else if ((c.e ?? 0) > avgCost) why.push(`${c.e} Energy against an average of ${avgCost}`);
        const rivals = conRows.filter((r) => r.c.t === c.t && r.c.e === c.e && r.inc >= 0.6).map((r) => r.name);
        if (rivals.length) why.push(`competes at ${c.e} Energy with ${rivals.slice(0, 3).join(", ")}`);
        qs.push({ name: cand.name, id: itemId(name, cand.name), role: cand.roles.includes("payoff") ? "payoff" : "enabler", share: round(s), with: have.get(cand.name) || 0,
          homes: homes.slice(0, 2).map((h) => ({ name: h.name, share: h.share, lists: h.lists })), why });
      }
      if (!qs.length) continue;
      // One question per legend and engine: why the winners skip this engine's cards. A
      // card can still be answered on its own (its own ### id), which overrides.
      const hyp = [];
      if (rank > 0) hyp.push(`${e.name} is this deck's #${rank + 1} engine; its main one is ${E[0].name}. Its cards here may be insurance, not a plan.`);
      const fuel = [...new Map(e.payoffs.concat(e.enablers).filter((x) => !x.legend).map((x) => [x.name, x])).values()];
      if (qs.some((q) => q.role === "payoff")) hyp.push(`A payoff is worth what it multiplies: here ${fuel.map((x) => `${x.qty} ${x.name}`).join(", ") || "nothing in the list"}.`);
      hyp.push(`The winning list averages ${avgCost} Energy with ${atOrBelow(2)} of 40 cards at 2 or less; the most-asked Power is ${Object.entries(powerAsk).sort((a, b) => b[1] - a[1]).map(([d, n]) => `${d} ${n}`).join(", ") || "none"}.`);
      const rad = idx.cards.filter((x) => !x.v && isNew(x) && (x.d || []).every((d) => d === "Colorless" || (L.d || []).includes(d)) && engineTags(x).some((t) => t.engine === e.key)).map((x) => x.n);
      if (rad.length) hyp.push(`New cards add ${rad.length} to ${e.name} in these colours (${rad.slice(0, 4).join(", ")}${rad.length > 4 ? ", …" : ""}); an old reason may not hold.`);
      items.push({ id: itemId(name, `engine-${e.key}`), kind: "skipped", legend: name, engine: e.key, rank,
        title: `Why do ${name}'s winners skip ${qs.length === 1 ? qs[0].name : `${qs.length} ${e.name} cards`}?`,
        evidence: [`${from.length} placed lists. ${E.map((x) => x.name).join(" > ")}, strongest first.`], hypotheses: hyp, cards: qs });
    }
  }

  for (const it of items) {
    const a = answers.get(it.id);
    if (a) Object.assign(it, { verdict: a.verdict, answer: a.answer });
    for (const q of it.cards || []) { const b = answers.get(q.id); if (b) Object.assign(q, { verdict: b.verdict, answer: b.answer }); }
  }
  const ids = new Set(items.flatMap((i) => [i.id, ...(i.cards || []).map((q) => q.id)]));
  const stale = [...answers.keys()].filter((id) => !ids.has(id));
  // Open questions first, the legends with the most evidence first within them.
  items.sort((a, b) => (!!a.verdict - !!b.verdict) || (legends[b.legend].placed - legends[a.legend].placed) || a.id.localeCompare(b.id));

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "data/decks.json (placed lists), data/synergy.json, the catalog, docs/archetypes.md, docs/research.md",
    note: "Questions, not findings: a long-legal card that fits a legend's engine by its text, that the legend's winning lists skip and some other legend plays heavily. The evidence is counted; the hypotheses are the usual explanations, checked against the numbers; the answer is hand-written in docs/research.md.",
    window: snap.window, thresholds: { minPlaced: MIN_PLACED, skipShare: SKIP_SHARE, elsewhere: ELSEWHERE }, verdicts: VERDICTS,
    open: items.filter((i) => !i.verdict).length, answered: items.filter((i) => i.verdict).length, stale,
    legends, items,
  };
  await writeFile(new URL("../data/research.json", import.meta.url), JSON.stringify(out) + "\n");
  console.log(`${items.length} research questions (${out.answered} answered, ${out.open} open) over ${Object.keys(legends).length} legends${stale.length ? ` · ${stale.length} stale answers: ${stale.join(", ")}` : ""}`);
  const per = new Map();
  for (const i of items) per.set(i.legend, (per.get(i.legend) || 0) + 1);
  for (const [l, n] of [...per].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${l} (${legends[l].placed} placed)`);
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-research: ${e.message}`); process.exit(1); });
