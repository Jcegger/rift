#!/usr/bin/env node
// Regenerates data/report.json: the Radiance field report's data, for jayegger.com. What the
// creators said before release, what the previews showed, and — once results exist — what
// happened, as three voices side by side. No creator is graded: the page compares voices
// (the creators' consensus, the previews), never individuals. Fetches nothing; runs after
// build-field.
//
//   node scripts/build-report.mjs
//
// Sources: data/field.json (the grades, per-legend play and the phase), model/expert-
// predictions.json (sources, panel credits, timestamps), data/preseason.json (each legend's
// main builds, from lib/builds.mjs).

import { readFile, writeFile } from "node:fs/promises";
import { letterOf, counted, REACH } from "../lib/field.mjs";

const read = async (p) => JSON.parse(await readFile(new URL(`../${p}`, import.meta.url), "utf8"));
const r2 = (x) => Math.round(x * 100) / 100;

// Callouts need enough creators behind them to mean anything.
const MIN_CALLS = 6;
// Callouts quote calls made once every card was known: Radiance's preview season ended 9 Oct
// 2026, and a call made before it (Miguel Challenger rated legend abilities on 7 Oct) is fair
// in the jury but would misrepresent its maker as a headline take.
const REVEALS_DONE = "2026-10-10";
// A creators' invitational is creators playing pet decks (Aserty's: Garen, Jinx, Teemo): listed
// with the previews, kept out of what they showed.
const isCreatorEvent = (name) => /creator/i.test(name);
// The checkpoints the comparison is judged at, written down before any result exists.
const CHECKPOINTS = [
  { id: "week1", label: "First look", after: "2026-10-26", note: "After Radiance's first weekend (Sat 24 and Sun 25 Oct). One weekend is a first look, not a verdict." },
  { id: "stuttgart", label: "RC Stuttgart", after: "2026-11-09", note: "After Radiance's first Regional Championship, from 5 Nov." },
];

const main = async () => {
  const [F, X, P, RISE] = await Promise.all([read("data/field.json"), read("model/expert-predictions.json"), read("data/preseason.json").catch(() => null), read("data/rising.json").catch(() => null)]);
  // Only sources with reach or results (lib/field.mjs counted) appear on the page at all.
  const sources = X.sources.filter((s) => s.id !== "jayegger-call" && counted(s));
  const leftOut = X.sources.filter((s) => s.id !== "jayegger-call" && !counted(s)).length;
  // Context sources (a previous format's tier list) inform the rows but are not Radiance calls.
  const calls = sources.filter((s) => s.kind !== "context");
  const byId = new Map(sources.map((s) => [s.id, s]));
  // A link straight to the moment a call is made, where it has been checked.
  const linkFor = (id, legend) => {
    const s = byId.get(id); if (!s) return null;
    const at = s.at && (s.at[legend] ?? s.at[legend.split(",")[0]]);
    return at != null && /youtube\.com\/watch/.test(s.url) ? `${s.url}&t=${at}s` : s.url;
  };
  const buildsOf = (legend) => (P?.builds || []).filter((b) => b.legend === legend && b.build && b.lists >= 5)
    .sort((a, b) => b.lists - a.lists).slice(0, 2).map((b) => ({ name: b.build, lists: b.lists }));

  // Every legend, graded or not: a legend nobody graded is part of the field too (Garen).
  const legends = F.legends.map((x) => {
    const pre = x.play.filter((p) => p.kind === "preview" && !isCreatorEvent(p.ev));
    const major = pre.filter((p) => (p.players || 0) >= F.rules.major);
    const top16 = x.top16.filter((t) => t.kind === "preview" && !isCreatorEvent(t.ev)).length;
    const majorPilots = major.reduce((t, p) => t + p.pilots, 0);
    return {
      legend: x.legend, champion: x.legend.split(",")[0], isNew: x.isNew,
      said: x.experts ? { tier: letterOf(x.experts.median), median: r2(x.experts.median), n: x.experts.n, q1: r2(x.experts.q1), q3: r2(x.experts.q3),
        agreement: x.experts.agreement, grades: x.grades.map((g) => ({ id: g.id, who: g.who, said: g.said, value: g.value, url: linkFor(g.id, x.legend) })) } : { tier: null, median: null, n: 0, grades: [] },
      previews: { pilots: pre.reduce((t, p) => t + p.pilots, 0), top8: pre.reduce((t, p) => t + (p.top8 || 0), 0), top16,
        // A rate needs a denominator worth reading: pilots at the 40+ player events the top 16s come from.
        top16Rate: majorPilots >= 5 ? r2(top16 / majorPilots) : null, majorPilots, events: pre.length },
      happened: x.tierFrom === "results" ? { tier: x.tier, ratio: x.results.ratio } : null,
      builds: buildsOf(x.legend),
      // A source that ranks rather than grades ("rank 1–9"): shown on the row as it was given,
      // never turned into a letter (any cut would decide its grades for it).
      // Context, not a call: a proven team's last tier list of the previous format.
      context: x.otherCalls.filter((o) => byId.get(o.id)?.kind === "context").map((o) => ({ id: o.id, who: o.who, said: o.said, scale: byId.get(o.id).scale, url: byId.get(o.id).url })),
      ranks: x.otherCalls.filter((o) => /rank/i.test(byId.get(o.id)?.scale || "") && /^\d+$/.test(String(o.said)))
        .map((o) => ({ id: o.id, who: o.who, rank: Number(o.said), of: Object.keys(byId.get(o.id).p || {}).length, url: linkFor(o.id, x.legend) })),
      aurora: (x.aurora || 0) >= 0.3,
    };
  });

  // Callouts. Hot takes are named, kindly, as boldness: never as right or wrong.
  const deep = legends.filter((l) => l.said.n >= MIN_CALLS);
  // Most agreed: the biggest share of a legend's grades on one letter (all of them = unanimous).
  const agreed = deep.map((l) => { const at = l.said.grades.filter((g) => letterOf(g.value) === l.said.tier).length; return { legend: l.legend, tier: l.said.tier, at, n: l.said.n, share: at / l.said.n }; })
    .sort((a, b) => b.share - a.share || b.n - a.n).slice(0, 3);
  const divided = [...deep].sort((a, b) => (b.said.q3 - b.said.q1) - (a.said.q3 - a.said.q1) ||
    (Math.max(...b.said.grades.map((g) => g.value)) - Math.min(...b.said.grades.map((g) => g.value))) - (Math.max(...a.said.grades.map((g) => g.value)) - Math.min(...a.said.grades.map((g) => g.value))))[0];
  // Each callout features a different legend, and a creator appears in at most one of them.
  const quoteOf = (id, legend) => { const q = byId.get(id)?.quotes; return q ? q[legend] ?? q[legend.split(",")[0]] ?? null : null; };
  const takes = deep.filter((l) => l.legend !== divided?.legend).flatMap((l) => l.said.grades.filter((g) => (byId.get(g.id)?.date || "") >= REVEALS_DONE).map((g) => ({ legend: l.legend, id: g.id, who: g.who, said: g.said, url: g.url, quote: quoteOf(g.id, l.legend), date: byId.get(g.id)?.date, scale: byId.get(g.id)?.scale, video: /youtube\.com/.test(byId.get(g.id)?.url || ""), field: l.said.tier, gap: r2(g.value - l.said.median) })));
  const pick = (xs, n) => { const out = [], used = new Set(); for (const t of xs) { if (used.has(t.legend) || used.has(t.id)) continue; out.push(t); used.add(t.legend); used.add(t.id); if (out.length === n) break; } return out; };
  const high = pick(takes.filter((t) => t.gap >= 1).sort((a, b) => b.gap - a.gap), 2);
  const usedHigh = new Set(high.flatMap((t) => [t.legend, t.id]));
  const low = pick(takes.filter((t) => t.gap <= -1 && !usedHigh.has(t.legend) && !usedHigh.has(t.id)).sort((a, b) => a.gap - b.gap), 2);

  // Older legends Radiance moved: on riftbound.gg's most-buffed list, or a new card in 40%+ of its
  // posted lists. For each: its Vendetta grade(s) against its Radiance grade, its preview play, and
  // the cards its lists picked up and cut — inside its own lists (7 days against the 14 before), so
  // a flood of new legends' lists can't pass for players cutting a card.
  const buffed = new Set(Object.keys(X.sources.find((s) => s.id === "riftboundgg-buffed")?.p || {}));
  const MIN_LISTS = 10, ADOPT = 40, SHOW_IN = 20, SHOW_MOVE = 15;
  const movers = legends.filter((l) => !l.isNew).map((l) => {
    const r = RISE?.legends?.[l.legend];
    const enough = r && r.lists.now >= MIN_LISTS && r.lists.before >= MIN_LISTS;
    const cards = enough ? Object.entries(r.cards).filter(([n]) => !n.includes(",")) : [];
    const inn = cards.filter(([, v]) => v.rad && v.now >= SHOW_IN && v.now - v.before >= SHOW_MOVE).sort((a, b) => b[1].now - a[1].now).slice(0, 3).map(([n, v]) => ({ card: n, before: v.before, now: v.now }));
    const out = cards.filter(([, v]) => !v.rad && v.before - v.now >= SHOW_MOVE).sort((a, b) => (b[1].before - b[1].now) - (a[1].before - a[1].now)).slice(0, 2).map(([n, v]) => ({ card: n, before: v.before, now: v.now }));
    const isBuffed = buffed.has(l.champion) || buffed.has(l.legend);
    return { legend: l.legend, champion: l.champion, buffed: isBuffed, vendetta: l.context, radiance: l.said.n ? { tier: l.said.tier, n: l.said.n } : null,
      previews: { pilots: l.previews.pilots, top8: l.previews.top8 }, lists: enough ? r.lists : null, inn, out, qualifies: isBuffed || inn.some((c) => c.now >= ADOPT) };
  }).filter((m) => m.qualifies && (m.inn.length || m.previews.pilots || m.radiance))
    .sort((a, b) => b.previews.pilots - a.previews.pilots || (b.inn[0]?.now || 0) - (a.inn[0]?.now || 0));

  // "Play this weekend": the creators' S, with top 8s at the previews to show for it.
  const playNow = legends.filter((l) => l.said.tier === "S" && l.previews.top8 >= 2 && !l.aurora)
    .sort((a, b) => b.previews.top8 - a.previews.top8).map((l) => ({ legend: l.legend, top8: l.previews.top8, pilots: l.previews.pilots, builds: l.builds }));

  const ev = F.events.filter((e) => e.kind !== "last");
  const doc = {
    generatedAt: F.generatedAt, set: F.set, legalFrom: F.legalFrom, phase: F.phase, handover: F.handover,
    frozen: X.collected,
    sources: sources.map((s) => ({ id: s.id, who: s.who, url: s.url, date: s.date, kind: s.kind, scale: s.scale, scope: s.scope, note: s.note || null, panel: s.panel || [] })),
    rule: { reach: REACH, leftOut },
    counts: { sources: calls.length, grades: legends.reduce((t, l) => t + l.said.n, 0), legends: legends.length },
    previews: { events: ev.map((e) => ({ name: e.name, dt: e.dt, players: e.players, hidden: e.hidden || 0, creators: isCreatorEvent(e.name) })), hidden: ev.reduce((t, e) => t + (e.hidden || 0), 0) },
    callouts: { agreed, divided: divided ? { legend: divided.legend, lo: letterOf(Math.min(...divided.said.grades.map((g) => g.value))), hi: letterOf(Math.max(...divided.said.grades.map((g) => g.value))), n: divided.said.n } : null, high, low },
    playNow, movers,
    checkpoints: CHECKPOINTS,
    legends,
  };
  await writeFile(new URL("../data/report.json", import.meta.url), JSON.stringify(doc) + "\n");
  console.log(`report: ${legends.length} legends, ${doc.counts.grades} grades from ${calls.length} sources · most agreed ${agreed.map((u) => `${u.legend.split(",")[0]} ${u.at}/${u.n} ${u.tier}`).join(", ")} · most divided ${divided?.legend.split(",")[0]} · high ${high.map((t) => `${t.who.split(" ")[0]} ${t.legend.split(",")[0]} ${t.said} (field ${t.field})`).join("; ")} · low ${low.map((t) => `${t.who.split(" ")[0]} ${t.legend.split(",")[0]} ${t.said} (field ${t.field})`).join("; ")} · play now ${playNow.map((p) => p.legend.split(",")[0]).join(", ")}`);
};

main().catch((e) => { console.error(e.stack || e); process.exit(1); });
