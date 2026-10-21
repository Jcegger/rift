#!/usr/bin/env node
// Regenerates data/preseason.json: every legend's builds ranked by lib/preseason.mjs — a
// prediction from returning strength and scored judgments, taken over by the new format's
// results as they arrive. Fetches nothing; runs after build-rising in the refresh.
//
//   node scripts/build-preseason.mjs [legend substring]   # a substring prints that legend's detail
//   node scripts/build-preseason.mjs --preview=1 --carryover=0.8 [legend]   # what-if: writes nothing
//   node scripts/build-preseason.mjs --with-judgment                        # ...with the judgment rows
//
// The published ranking is DATA ONLY (Jay's call, 21 Oct): measured relationships, no hand
// scores. The judgment rows in model/preseason-inputs.json are kept, validated and shown beside
// each build as "not in the score" — reasons to talk through, promoted only by agreement.
//
// Sources, all already in data/ or hand-written:
// - RETURNING strength: Riot's RQ Day 1 / Day 2 tables (data/topdecks.json) from before the
//   newest set was legal, and every earlier event whose uploaded lists cover COVERAGE of its
//   field (data/decks.json), top quarter as the cut — the same cut as a good placing.
// - SEASON results: the same two sources from the legal date on; online previews before it
//   (a Radiance-format event, RAD_SHARE of its lists running the new set) at PREVIEW_W.
// - BUILDS: lib/builds.mjs. Riot's tables count a legend, not a build, so a build's own
//   returning strength comes from the full-field events only, relative to its legend there.
// - JUDGMENTS: model/preseason-inputs.json — hand-written, one row per scored reason, with its
//   cards, rules and source. check.mjs enforces the fields.

import { readFile, writeFile } from "node:fs/promises";
import { makeBrewer } from "./build-brews.mjs";
import { SET_LEGAL_FROM } from "../lib/decks.mjs";
import { buildsOf } from "../lib/builds.mjs";
import { score, rankSim, fitPopularity, pool, logRatio, carryFor, K_RET, K_PRIOR, K_NEW, VS_CAP, PREVIEW_W, POINT, UNVERIFIED, POP_FLOOR, CARRYOVER, CARRY_REG, REG_HALF, COMPONENTS } from "../lib/preseason.mjs";

const COVERAGE = 0.5, MIN_FIELD = 32, TOP = 0.25, RAD_SHARE = 0.3, MARKER_SHARE = 0.5, ERA_PCT = 0.05, ALPHA = 100;
const NO_BEST_OF = new Set(["OGN", "OGS", "SFD"]);   // Riot, RC prizing, 15 Oct 2026
// Tiers on the model's own scale, observed over expected top finishes: S converts 40%+ above
// an average deck, A above average, B within 20% below, C within 35% below, D the rest. Fixed
// cuts, so a tier means the same thing every day; on 21 Oct they fell on the natural breaks.
export const TIERS = [["S", 1.4], ["A", 1.0], ["B", 0.8], ["C", 0.65], ["D", 0]];
// UNCERTAIN: the 80% range of the score spans a factor of e^0.8 ≈ 2.2 or more — on 21 Oct the
// legends split cleanly at this width (0.65 or less for those with a record, 0.83+ for Riven,
// Kai'Sa, Yasuo, Lux, Evelynn, Mordekaiser, Viktor). A rank range can't do this: mid-table
// ranks are always wide. NOT ENOUGH DATA: an established legend with under LITTLE expected top
// finishes last format and no pilots at a new-format event — no record either way. Its score is
// kept, but it is shown apart, not as D. A new legend is always scored: the crowd is its evidence.
const WIDE_LOG = 0.8, LITTLE = 3;
const tierOf = (ratio) => TIERS.find(([, cut]) => ratio >= cut)[0];
const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const r3 = (x) => Math.round(x * 1000) / 1000;

const main = async () => {
  const args = process.argv.slice(2);
  const num = (k) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? Number(a.split("=")[1]) : null; };
  const withJudgment = args.includes("--with-judgment");
  const whatIf = { preview: num("preview"), carryover: num("carryover"), noJudgment: !withJudgment };
  const isWhatIf = whatIf.preview != null || whatIf.carryover != null || withJudgment;
  const previewW = whatIf.preview ?? PREVIEW_W;
  const only = (args.find((a) => !a.startsWith("--")) || "").toLowerCase();
  const [cat, extras, banned, snap, topdecks] = await Promise.all(["cards.json", "extras.json", "banned.json", "decks.json", "topdecks.json"].map(read));
  const inputs = JSON.parse(await readFile(new URL("../model/preseason-inputs.json", import.meta.url), "utf8"));
  const m = makeBrewer({ cat, extras, banned, snap });
  const { idx, card, legends, byLegend } = m;
  const newest = Object.keys(SET_LEGAL_FROM).sort((a, b) => SET_LEGAL_FROM[b].localeCompare(SET_LEGAL_FROM[a]))[0];
  const legalFrom = SET_LEGAL_FROM[newest];
  const mainOf = (d) => Object.keys(d.cards).map((k) => [card(k), d.cards[k]]).filter(([c]) => c && ["Unit", "Spell", "Gear"].includes(c.t));
  const names = (d) => new Set(mainOf(d).map(([c]) => c.n));
  const size = (d) => mainOf(d).reduce((t, [, q]) => t + q, 0);
  const legendOf = (d) => idx.legendName(card(d.lg));

  // Full-field events: lists cover most of the field, so a legend's share of the top quarter
  // can be read against its share of the field.
  const evs = new Map();
  for (const d of m.usable) if (d.tour && d.pl != null && d.ec && d.ev) (evs.get(d.ev) || evs.set(d.ev, []).get(d.ev)).push(d);
  const full = [];
  for (const [ev, ds] of evs) {
    const ec = ds[0].ec;
    if (ec < MIN_FIELD || ds.length / ec < COVERAGE) continue;
    const dt = ds.map((d) => d.dt).sort()[0];
    const rad = ds.filter((d) => mainOf(d).some(([c]) => c.s === newest)).length / ds.length;
    const kind = dt >= legalFrom ? "season" : rad >= RAD_SHARE ? "preview" : "returning";
    const cut = Math.ceil(ec * TOP), T = ds.filter((d) => d.pl <= cut).length;
    full.push({ ev, dt, ec, lists: ds.length, kind, cut, T, ds });
  }
  // O/E for a set of lists at full-field events of the given kinds.
  const oeFull = (pred, kinds) => {
    const rows = [];
    for (const e of full) {
      if (!kinds.includes(e.kind)) continue;
      const mine = e.ds.filter(pred);
      if (!mine.length) continue;
      rows.push({ o: mine.filter((d) => d.pl <= e.cut).length, e: mine.length * e.T / e.ds.length, w: e.kind === "preview" ? previewW : 1 });
    }
    return pool(rows);
  };
  // Riot's RQ tables: Day 2 against Day 1, per legend.
  const rq = topdecks.events.filter((e) => e.field?.length && e.field.some((x) => x.d2 != null) && e.field.reduce((t, x) => t + (x.d2 || 0), 0) > 0);
  const oeRQ = (name, kind) => pool(rq.filter((e) => (e.published >= legalFrom ? "season" : "returning") === kind).flatMap((e) => {
    const D1 = e.field.reduce((t, x) => t + x.d1, 0), D2 = e.field.reduce((t, x) => t + (x.d2 || 0), 0);
    const x = e.field.find((f) => f.legend === name);
    return x ? [{ o: x.d2 || 0, e: x.d1 * D2 / D1 }] : [];
  }));
  const add = (a, b) => ({ O: a.O + b.O, E: a.E + b.E });

  // Judgment rows, matched to legends and, by marker card, to builds.
  const rows = inputs.rows || [];
  const unknownLegend = rows.filter((r) => !legends.has(r.legend)).map((r) => r.legend);
  if (unknownLegend.length) throw new Error(`model/preseason-inputs.json names unknown legends: ${[...new Set(unknownLegend)].join(", ")}`);

  // POPULARITY, measured the way it predicted at every past set launch: the share of the field
  // that REGISTERS a legend at tournaments of the new format (Radiance-format events: previews
  // now, sanctioned events after the legal date), topped up by its share of the lists posted
  // since the new set's lists began, worth ALPHA pilots — so a handful of preview pilots does
  // not swing it alone (preview pilots count PREVIEW_W, like preview results; one RQ's ~2,000
  // registrations outweigh the posted lists by itself). Counted per BUILD: a build's pilots are
  // the registered lists in it, its posted share its legend's times the build's share of lists.
  // One basis for every legend, old and new.
  const isNewLegend = (L) => L.c.split("-")[0] === newest;
  const radDates = m.usable.filter((d) => d.dt && mainOf(d).some(([c]) => c.s === newest)).map((d) => d.dt).sort();
  const eraFrom = radDates[Math.floor(radDates.length * ERA_PCT)] || legalFrom;
  const era = m.usable.filter((d) => d.dt && d.dt >= eraFrom);
  const posted = new Map();
  for (const d of era) { const n = legendOf(d); posted.set(n, (posted.get(n) || 0) + 1 / era.length); }
  const pilotW = new Map(); let pilotN = 0;           // registered list -> its weight
  for (const e of full.filter((e) => e.kind !== "returning")) for (const d of e.ds) { const w = e.kind === "preview" ? previewW : 1; pilotW.set(d, w); pilotN += w; }
  const rqPilots = new Map();                            // season RQ tables: legend-level only
  for (const e of rq.filter((e) => e.published >= legalFrom)) for (const x of e.field) { rqPilots.set(x.legend, (rqPilots.get(x.legend) || 0) + x.d1); pilotN += x.d1; }
  // Popularity is read per LEGEND, the level the fit was measured at (Riot's tables count
  // legends): splitting a legend into builds must not split its popularity — Evelynn's two
  // builds each took half and both fell to the floor. Builds then differ by their own record
  // and results. (A build's own registrations are still shown, for reading.)
  const popOf = (name, lists) => {
    const p = lists.reduce((t, d) => t + (pilotW.get(d) || 0), 0) + (rqPilots.get(name) || 0);
    return { pilots: p, share: (p + ALPHA * (posted.get(name) || 0)) / (pilotN + ALPHA) };
  };
  // The fit: last format's RQ tables, a legend's share of Day 1 against its Day 2 conversion —
  // what a legend that much of the field registers converts. Capped at the strongest real deck.
  const retRQ = rq.filter((e) => e.published < legalFrom);
  const D1all = retRQ.reduce((t, e) => t + e.field.reduce((u, x) => u + x.d1, 0), 0);
  const fitPts = [...legends].filter(([, L]) => !isNewLegend(L)).map(([name]) => {
    const r = oeRQ(name, "returning"), d1 = retRQ.reduce((t, e) => t + (e.field.find((x) => x.legend === name)?.d1 || 0), 0);
    return { share: d1 / (D1all || 1), O: r.O, E: r.E };
  });
  const cap = Math.max(1, ...fitPts.filter((p) => p.E >= 20).map((p) => Math.exp(logRatio(p.O, p.E, K_RET))));
  const pop = fitPopularity(fitPts, cap);
  const lastShare = new Map([...legends].filter(([, L]) => !isNewLegend(L)).map(([name], i) => [name, fitPts[i].share]));
  // Registrations in the new format so far (previews weighted): how far the blend has moved.
  const carry = whatIf.carryover ?? carryFor(pilotN);

  // Every build's inputs (the clustering is the slow part, so it runs once), then the scores.
  const cases = [];
  const unmatched = [];
  for (const [name, L] of legends) {
    const lists = byLegend.get(name) || [];
    const builds = lists.length ? buildsOf(name, lists, names, size) : [{ id: name, label: null, lists: [], signature: [], share: 1, aurora: [] }];
    const isLegend = (d) => legendOf(d) === name;
    const retLegend = add(oeRQ(name, "returning"), oeFull(isLegend, ["returning"]));
    const seasonRQ = oeRQ(name, "season");
    const fullLegendRet = oeFull(isLegend, ["returning"]);
    const mine = rows.filter((r) => r.legend === name);
    for (const r of mine.filter((r) => r.marker)) {
      const hit = builds.some((b) => b.lists.length && b.lists.filter((d) => names(d).has(r.marker)).length / b.lists.length >= MARKER_SHARE);
      if (!hit) unmatched.push(`${name}: ${r.marker}`);
    }
    for (const b of builds) {
      const inB = new Set(b.lists);
      const pred = builds.length > 1 ? (d) => inB.has(d) : isLegend;
      // A build's returning strength relative to its legend, at the full-field events only.
      let adj = 0;
      if (builds.length > 1) { const fb = oeFull(pred, ["returning"]); adj = logRatio(fb.O, fb.E, K_RET) - logRatio(fullLegendRet.O, fullLegendRet.E, K_RET); }
      const markerShare = (mk) => b.lists.length ? b.lists.filter((d) => names(d).has(mk)).length / b.lists.length : 0;
      const use = mine.filter((r) => !r.marker || markerShare(r.marker) >= MARKER_SHARE);
      const season = add(seasonRQ, oeFull(pred, ["season", "preview"]));
      const pp = popOf(name, lists);
      cases.push({ name, L, b, target: pop.target(pp.share), lastTarget: pop.target(lastShare.get(name) || 0), established: !isNewLegend(L), pp, retLegend, adj, use, season });
    }
  }
  const unknownVs = rows.flatMap((r) => (r.vs || []).filter((v) => !legends.has(v)).map((v) => `${r.legend} vs ${v}`));
  if (unknownVs.length) throw new Error(`model/preseason-inputs.json: unknown vs legends: ${unknownVs.join(", ")}`);
  // Pass 1 scores every build with `vs` rows at face value; pass 2 weights each by how good
  // the decks it answers came out of pass 1 (a legend's best build).
  const run = (vsRatio) => cases.map((c) => ({ c, s: score({ ret: c.retLegend, target: c.target, lastTarget: c.lastTarget, established: c.established, adj: c.adj, rows: whatIf.noJudgment ? [] : c.use, season: c.season, vsRatio, carryover: carry }) }));
  const first = run(() => 1);
  const best = new Map();
  for (const { c, s } of first) best.set(c.name, Math.max(best.get(c.name) ?? -Infinity, Math.exp(s.post)));
  const vsRatio = (vs) => vs.reduce((t, v) => t + (best.get(v) ?? 1), 0) / vs.length;
  const out = run(vsRatio).map(({ c: { name, L, b, target, lastTarget, pp, retLegend, adj, use, season }, s }) => ({
    id: b.id, legend: name, build: b.label, signature: b.signature, share: r3(b.share), lists: b.lists.length,
    set: L.c.split("-")[0], isNew: L.c.split("-")[0] === newest, noBestOf: NO_BEST_OF.has(L.c.split("-")[0]), aurora: b.aurora,
    returning: { O: r3(retLegend.O), E: r3(retLegend.E), lastShare: r3(lastShare.get(name) || 0), lastTarget: r3(lastTarget), ratio: r3(Math.exp(s.retLog)), carry: r3(s.carry), buildAdj: r3(adj) },
    popularity: { share: r3(pp.share), pilots: r3(pp.pilots), posted: r3(posted.get(name) || 0), target: r3(target) },
    judgment: { points: r3(s.judgment.total), by: Object.fromEntries(Object.entries(s.judgment.by).map(([k, v]) => [k, r3(v)])),
      applied: withJudgment,
      rows: use.map((r) => ({ component: r.component, points: r.points, verified: r.verified, why: r.why, ...(r.vs ? { vs: r.vs, vsWeight: r3(Math.min(VS_CAP, vsRatio(r.vs))) } : {}) })) },
    season: { O: r3(season.O), E: r3(season.E), weight: r3(s.resultsWeight), priorStrength: r3(s.priorStrength) },
    prior: r3(s.prior), score: r3(s.post), ratio: r3(Math.exp(s.post)), lo: r3(s.lo), hi: r3(s.hi), sd: s.sd, post: s.post,
  }));
  out.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const rr = rankSim(out);
  out.forEach((x, i) => { x.rank = i + 1; x.rankRange = [rr[i].p10, rr[i].p90]; x.top10 = r3(rr[i].top10); x.tier = tierOf(x.ratio);
    x.uncertain = x.hi - x.lo >= WIDE_LOG;
    x.notEnoughData = !x.isNew && x.returning.E < LITTLE && x.popularity.pilots < 1;
    delete x.sd; delete x.post; });

  const file = {
    generatedAt: new Date().toISOString().slice(0, 10), set: newest, legalFrom,
    method: "lib/preseason.mjs; guides/radiance-tier-prediction.md is the method in prose",
    tiers: Object.fromEntries(TIERS), uncertainWidth: WIDE_LOG, littleData: LITTLE,
    constants: { K_RET, K_PRIOR, K_NEW, VS_CAP, CARRYOVER, CARRY_REG, REG_HALF, carryNow: r3(carry), PREVIEW_W, POINT, UNVERIFIED, POP_FLOOR, CARRYOVER, COVERAGE, MIN_FIELD, TOP, components: COMPONENTS },
    popularity: { legends: pop.n, slope: r3(pop.slope), r: r3(pop.r), cap: r3(cap), pilots: pilotN, postedSince: eraFrom, alpha: ALPHA },
    note: "Data only: the judgment rows are listed per build but not in the score. A prediction until the new format has results, then the results. ratio is observed over expected top finishes (×1.00 = average); lo/hi are an 80% range in logs; rankRange is the 10th–90th percentile rank over simulated seasons and top10 the chance of a top-10 finish. Judgment rows are hand-written in model/preseason-inputs.json.",
    sources: {
      rq: rq.map((e) => ({ event: e.title, published: e.published, kind: e.published >= legalFrom ? "season" : "returning" })),
      fullField: full.map((e) => ({ event: e.ev, date: e.dt, players: e.ec, lists: e.lists, kind: e.kind })),
    },
    unmatchedMarkers: unmatched, builds: out,
  };
  if (!only && !isWhatIf) await writeFile(new URL("../data/preseason.json", import.meta.url), JSON.stringify(file));
  const rqN = rq.length, ff = full.reduce((t, e) => ({ ...t, [e.kind]: (t[e.kind] || 0) + 1 }), {});
  console.log(`${isWhatIf ? `WHAT-IF (nothing written): previews ×${previewW}${whatIf.carryover != null ? `, carryover ${whatIf.carryover}` : ""}${withJudgment ? ", WITH the judgment rows" : ""}\n` : ""}popularity fit: ${pop.n} legends, slope ${r3(pop.slope)}, r ${r3(pop.r)}, cap ×${r3(cap)} · ${r3(pilotN)} pilots (weighted) in ${newest} events + posted lists since ${eraFrom} (worth ${ALPHA} pilots)`);
  console.log(`${out.length} builds of ${legends.size} legends · returning: ${rq.filter((e) => e.published < legalFrom).length} RQ tables + ${ff.returning || 0} full-field events · season: ${rq.filter((e) => e.published >= legalFrom).length} RQ + ${ff.season || 0} full-field + ${ff.preview || 0} previews (×${PREVIEW_W}) · ${rows.length} judgment rows${unmatched.length ? ` · UNMATCHED markers: ${unmatched.join("; ")}` : ""}`);
  for (const x of out.filter((x) => !only || x.legend.toLowerCase().includes(only)).slice(0, only ? 99 : 15))
    console.log(`  ${x.tier} ${String(x.rank).padStart(2)} (${x.rankRange.join("–")}, top-10 ${Math.round(x.top10 * 100)}%) ${x.legend.slice(0, 30)}${x.build ? ` — ${x.build}` : ""} ×${x.ratio}  [ret ×${x.returning.ratio} at ${Math.round(x.returning.carry * 100)}% · pop ×${x.popularity.target} (${(x.popularity.share * 100).toFixed(1)}%) · judg ${x.judgment.points >= 0 ? "+" : ""}${x.judgment.points} · results ${Math.round(x.season.weight * 100)}%]${x.aurora.length ? " AURORA" : ""}`);
};

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(`build-preseason: ${e.message}`); process.exit(1); });
