#!/usr/bin/env node
// Runs index.html's script in node with the DOM stubbed out, then asserts against the
// real catalog and the real deck snapshot. No dependencies and no build step, the same
// as the rest of scripts/.
//
// This exists because the bugs in this app have not been the kind you spot by reading.
// An acquisition path that looked perfectly reasonable spent 29 cards without
// finishing a single deck; two functions quietly disagreed about which list an
// archetype was, pricing the same deck at $210 and $3,586; and owning a legend failed
// to satisfy a deck citing another of its printings, inflating 74 of 490 decks. All
// three were invisible until measured, and all three are asserted below.
//
//   node scripts/check.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(ROOT, f), 'utf8'));

/* ── the DOM, as little of it as the script touches ──────────────────────── */
const els = new Map();
const mkEl = (id) => ({
  id, innerHTML: '', textContent: '', value: '', title: '',
  style: {}, dataset: {},
  classList: { toggle(){}, add(){}, remove(){} },
  querySelector: () => null, querySelectorAll: () => [], closest: () => null,
  addEventListener(){}, focus(){}, insertAdjacentHTML(){}, appendChild(){},
  remove(){}, getBoundingClientRect: () => ({}),
});
globalThis.location = { search: '', origin: 'https://x', pathname: '/' };
globalThis.document = {
  getElementById(id){ if (!els.has(id)) els.set(id, mkEl(id)); return els.get(id); },
  querySelectorAll: () => [], querySelector: () => null,
  body: { addEventListener(){} }, createElement: () => mkEl('new'), addEventListener(){},
};
globalThis.localStorage = { getItem: () => null, setItem(){}, removeItem(){} };
globalThis.IntersectionObserver = class { observe(){} };
globalThis.navigator = { clipboard: { writeText: async () => {} } };
globalThis.window = { innerWidth: 1200, innerHeight: 900, addEventListener(){}, scrollTo(){} };

/* ── load the app, minus its boot call ──────────────────────────────────── */
// The app is deliberately one scope with no module system, so re-exporting its
// internals from inside that scope is how a test reaches them.
const page = readFileSync(join(ROOT, 'index.html'), 'utf8');
const js = page.slice(page.indexOf('<script>') + 8, page.lastIndexOf('</script>'))
               .replace(/\nboot\(\);\s*$/, '\n');
const NAMED = [
  'gameName', 'buildNameIndex', 'identityOf', 'championOf', 'legendRoster', 'legendText',
  'championRoster', 'CH_STATES', 'legendlessChampions',
  'foilOnlyProblems', 'foilOnlyText', 'renderFoilOnly', 'championIndex',
  'deckLegalForConstructed', 'cardCost', 'gapCost', 'cost', 'costIndex',
  'daysSince', 'dataAge', 'staleNote', 'newsChampion', 'guideByChampion', 'dataAlerts',
  'renderNews', 'credibility',
  'archetypeName', 'metaPool', 'metaArchetypes', 'scorePool', 'cardLeverage', 'loadBans',
  'acquisitionPath', 'unionGap', 'pathText', 'ownedIdentities', 'evalDeck', 'matchRow',
  'spares', 'tradeMatch', 'readPartner', 'readyShareOf', 'owned', 'byTarget',
  'annotateCompounding', 'establishedArchetypes', 'isEstablished', 'byCost', 'byCards', 'byPlanTarget',
  'tierByArchetype',
  'render', 'renderLegends', 'renderNext', 'renderMeta', 'renderTrade', 'renderSets',
];
const A = new Function(`${js}
  ;return { ${NAMED.join(', ')},
    get CAT(){return CAT}, set CAT(v){CAT=v},
    get BY(){return BY}, set BY(v){BY=v},
    set MATCH(v){MATCH=v},
    get DECKS(){return DECKS}, set DECKS(v){DECKS=v},
    set DECKS_AT(v){DECKS_AT=v}, set DECKS_WINDOW(v){DECKS_WINDOW=v},
    get S(){return S}, set TAB(v){TAB=v},
    get PARTNER(){return PARTNER}, set PARTNER(v){PARTNER=v},
    forgetDeckCaches, deckRequirements, deckBansCached,
    get CHAMPS(){return CHAMPS}, get NAMES(){return NAMES},
    get NEWS(){return NEWS}, set NEWS(v){NEWS=v},
    set NEWS_AT(v){NEWS_AT=v}, get NEWS_AT(){return NEWS_AT},
    set DECKS_AT(v2){DECKS_AT=v2}, get DECKS_AT(){return DECKS_AT},
    set BANNED_AT(v){BANNED_AT=v},
    set EVENTS(v){EVENTS=v}, get EVENTS(){return EVENTS},
    set EVENTS_AT(v){EVENTS_AT=v}, set EVENTS_COVER(v){EVENTS_COVER=v},
    set TIERS(v){TIERS=v}, get TIERS(){return TIERS},
    set TIERS_AT(v){TIERS_AT=v}, set TIERS_INFO(v){TIERS_INFO=v},
    set NEWS_GUIDES(v){NEWS_GUIDES=v} };
`)();

/* ── the real data, in the order boot() loads it ────────────────────────── */
const cat = read('data/cards.json');
const known = new Set(cat.cards.map((c) => c.c));
const extras = (read('data/extras.json').cards || []).filter((c) => c.c && !known.has(c.c));
cat.cards = cat.cards.concat(extras);
A.CAT = cat;
A.BY = Object.fromEntries(cat.cards.map((c) => [c.c, c]));
A.MATCH = null;
A.buildNameIndex();
const snap = read('data/decks.json');
A.DECKS = snap.decks;
A.DECKS_AT = snap.generatedAt;
A.DECKS_WINDOW = snap.window;
A.loadBans(read('data/banned.json'));
let news = null, events = null, tiers = null;
try {
  news = read('data/news.json');
  A.NEWS = news.posts;
  A.NEWS_AT = news.generatedAt;
} catch { /* optional */ }
try {
  events = read('data/events.json');
  A.EVENTS = events.events;
  A.EVENTS_AT = events.generatedAt;
  A.EVENTS_COVER = events.coverage;
} catch { /* optional */ }
try {
  tiers = read('data/tiers.json');
  A.TIERS = Array.isArray(tiers.tiers) && tiers.tiers.length ? tiers.tiers : null;
  A.TIERS_AT = tiers.generatedAt;
  A.TIERS_INFO = A.TIERS ? { set: tiers.set, report: tiers.report, week: tiers.week, source: tiers.source } : null;
} catch { /* optional */ }

let failures = 0;
const ok = (name, cond, detail) => {
  if (!cond) failures++;
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const section = (t) => console.log(`\n${t}`);

console.log(`catalog ${cat.cards.length} printings (+${extras.length} Riot does not publish), ` +
            `${A.DECKS.length} decks, ${A.metaPool().length} sanctioned-legal`);

/* ══ the dash naming ═════════════════════════════════════════════════════ */
section('The dash naming');
{
  const dashed = cat.cards.filter((c) => / - /.test(c.n || ''));
  const merged = dashed.filter((c) => A.gameName(c) !== c.n);
  const kept = dashed.filter((c) => A.gameName(c) === c.n);
  ok('every dash-named card is classified', dashed.length === merged.length + kept.length,
     `${dashed.length} dashed: ${merged.length} folded, ${kept.length} left alone`);
  // The four "- Starter" legends are real, distinct legends. Wuju Bladesman - Starter
  // is a top-share archetype; a naive prefix-strip would delete it.
  const starters = dashed.filter((c) => / - Starter$/.test(c.n));
  ok('the "- Starter" legends survive the fold', starters.length === 4 &&
     starters.every((c) => A.gameName(c) === c.n), `${starters.length} kept intact`);
  ok('a fold only ever lands on a name that exists',
     merged.every((c) => A.NAMES.has(A.gameName(c))), `${merged.length} folded`);
  // Every fold must join two printings of the same card, never two different cards.
  ok('folded cards keep their type',
     merged.every((c) => (A.BY[c.c].t) === (cat.cards.find((x) => x.n === A.gameName(c)) || {}).t));
}

/* ══ legend identity ═════════════════════════════════════════════════════ */
section('Legend identity');
{
  const legends = cat.cards.filter((c) => c.t === 'Legend');
  const roster = new Set(legends.map((c) => A.gameName(c)));
  ok('the roster folds to one entry per legend', roster.size === 49,
     `${new Set(legends.map((c) => c.n)).size} names -> ${roster.size} legends`);

  const withBase = new Set(legends.filter((c) => !c.v).map((c) => A.gameName(c)));
  const noBase = [...roster].filter((n) => !withBase.has(n));
  ok('every legend has a base printing', noBase.length === 0, noBase.join(', ') || 'all 49');

  // The bug this file was written for: signature and overnumber are printed at a
  // different collector number than the base, so nothing numeric can join them.
  const byLegend = new Map();
  for (const c of legends){
    const k = A.gameName(c);
    if (!byLegend.has(k)) byLegend.set(k, new Set());
    byLegend.get(k).add(A.identityOf(c));
  }
  const split = [...byLegend].filter(([, ids]) => ids.size > 1);
  ok('all printings of a legend share one identity', split.length === 0,
     split.length ? split.slice(0, 3).map(([n]) => n).join(', ') : `${byLegend.size} legends`);

  ok('base, signature and overnumber of one legend agree',
     A.identityOf(A.BY['UNL-189/219']) === A.identityOf(A.BY['UNL-230*/219']) &&
     A.identityOf(A.BY['UNL-189/219']) === A.identityOf(A.BY['UNL-230/219']),
     A.identityOf(A.BY['UNL-189/219']));

  // The Arcane Box Set reprints a handful of units under the dash name.
  ok('an Arcane reprint is the card it reprints',
     A.identityOf(A.BY['ARC-005']) === A.identityOf(A.BY['OGN-202a/298']),
     `ARC-005 -> ${A.identityOf(A.BY['ARC-005'])}`);
}

/* ══ champions ═══════════════════════════════════════════════════════════ */
section('Champions');
{
  const roster = A.legendRoster();
  ok('a champion resolves for every legend', roster.every((l) => l.champ),
     `${roster.length} legends`);
  // Region and race tags must never win over the champion. Heart of the Tempest is
  // tagged both Yordle and Kennen.
  const kennen = roster.find((l) => l.name === 'Heart of the Tempest');
  ok('a race tag does not beat the champion', !kennen || kennen.champ === 'Kennen',
     kennen ? `${kennen.name} -> ${kennen.champ}` : 'legend not in this snapshot');
  ok('every legend has a champion unit printed', roster.every((l) => l.units.length),
     `min ${Math.min(...roster.map((l) => l.units.length))}, ` +
     `max ${Math.max(...roster.map((l) => l.units.length))} per legend`);
  // If this ever fails it is news, not a bug: it means a champion unit sits outside
  // its legend's domains and the Legends tab should stop claiming otherwise.
  const offDomain = [];
  for (const l of roster){
    const id = new Set(l.rep.d || []);
    for (const u of l.units)
      if ((u.card.d || []).length && !(u.card.d || []).every((d) => id.has(d) || d === 'Colorless'))
        offDomain.push(`${l.name}/${u.card.n}`);
  }
  ok('champion units sit inside their legend’s domains', offDomain.length === 0,
     offDomain.slice(0, 3).join(', ') || 'all on-domain');
  ok('champion units are deduped across printings',
     roster.every((l) => new Set(l.units.map((u) => A.identityOf(u.card))).size === l.units.length));
}

/* ══ archetypes ══════════════════════════════════════════════════════════ */
section('Archetypes');
{
  const names = new Set(A.DECKS.map((d) => A.archetypeName(d)));
  const raw = new Set(A.DECKS.map((d) => d.ln));
  ok('the Secret Garden promos stop forming their own archetypes',
     !names.has('Lillia - Bashful Bloom') && !names.has('Ivern - Green Father'),
     `${raw.size} legend names -> ${names.size} archetypes`);
  ok('archetype names are legend names', [...names].every((n) => A.NAMES.has(n) || n === 'Unidentified'));
}

/* ══ the legend gap, which is what the fix was for ═══════════════════════ */
section('The legend gap');
{
  A.S.inv = {};
  for (const c of cat.cards) if (c.t === 'Legend' && !c.v) A.S.inv[c.c] = { n: 1 };
  const owned = A.ownedIdentities();
  const stuck = A.DECKS.filter((d) => A.evalDeck(d, owned).missing.some((m) => m.card.t === 'Legend'));
  ok('owning one base copy of every legend leaves no deck short a legend',
     stuck.length === 0, `${stuck.length} of ${A.DECKS.length} decks`);

  // And the other direction: a legend held only as its signature still counts.
  A.S.inv = { 'UNL-230*/219': { n: 1 } };
  const sigOnly = A.ownedIdentities();
  const bloom = A.DECKS.find((d) => A.archetypeName(d) === 'Bashful Bloom');
  ok('a signature-only holding satisfies a deck citing the base',
     !bloom || !A.evalDeck(bloom, sigOnly).missing.some((m) => m.card.t === 'Legend'),
     bloom ? bloom.lg : 'no such deck');

  // Legends are chase printings, not trade filler.
  A.S.inv = {};
  for (const c of cat.cards) if (c.t === 'Legend') A.S.inv[c.c] = { n: 3 };
  ok('legends are never offered as spares',
     !A.spares().some((s) => s.card.t === 'Legend'), `${A.spares().length} spares`);
}

/* ══ the two code paths must agree ═══════════════════════════════════════ */
section('scorePool vs metaArchetypes');
const collections = {
  'empty': {},
  'staples only': null,
  'deep': null,
  'everything': null,
};
{
  // Deterministic synthetic collections: three of every card played in at least `pct`
  // of the snapshot, nine of every rune. Deep on staples, empty on the tail, which is
  // the shape a real collection has.
  const freq = new Map();
  for (const d of A.DECKS){
    const seen = new Set();
    for (const code of Object.keys(d.cards || {})){
      const hit = A.matchRow({ id: code });
      if (!hit || seen.has(hit.card.c)) continue;
      seen.add(hit.card.c);
      freq.set(hit.card.c, (freq.get(hit.card.c) || 0) + 1);
    }
  }
  const synth = (pct) => {
    const inv = {};
    for (const [code, n] of freq){
      const c = A.BY[code];
      if (!c) continue;
      if (c.t === 'Rune' || c.v === 'rune') inv[code] = { n: 9 };
      else if (n / A.DECKS.length >= pct) inv[code] = { n: 3 };
    }
    return inv;
  };
  collections['staples only'] = synth(0.25);
  collections['deep'] = synth(0.08);
  const all = {};
  for (const c of cat.cards) all[c.c] = { n: 9 };
  collections['everything'] = all;
  // Every legend, no units: the one state the other collections never reach, and the
  // question the Legends tab exists to answer.
  const legendsOnly = {};
  for (const c of cat.cards) if (c.t === 'Legend' && !c.v) legendsOnly[c.c] = { n: 1 };
  collections['legends but no units'] = legendsOnly;
}

for (const [label, inv] of Object.entries(collections)){
  A.S.inv = inv;
  const pool = A.metaPool();
  const arch = A.metaArchetypes(pool);
  const scored = A.scorePool(pool, A.ownedIdentities());
  const drift = [];
  for (const g of scored){
    const m = arch.find((x) => x.name === g.name);
    if (!m) { drift.push(`${g.name} missing from metaArchetypes`); continue; }
    if (g.short !== m.best.ev.missingCopies) drift.push(`${g.name} gap ${g.short}/${m.best.ev.missingCopies}`);
    if ((g.deck.pr ?? null) !== (m.best.deck.pr ?? null)) drift.push(`${g.name} price ${g.deck.pr}/${m.best.deck.pr}`);
  }
  ok(`[${label}] the two rankings agree on gap and price`, drift.length === 0,
     drift.slice(0, 2).join('; ') || `${scored.length} archetypes`);

  // The badge is computed from scorePool for speed while the tabs use metaArchetypes.
  // That is only safe while the two agree, so the figure the badge actually displays is
  // compared against the tab's own, read out of the rendered DOM rather than recomputed.
  A.TAB = 'next';
  A.render();
  const badge = els.get('tn-next').textContent;
  const tabSpends = arch.filter((g) => g.best.ev.missingCopies > 0)
                        .map((g) => A.gapCost(g.best.ev.missing))
                        .filter((x) => x.unpriced === 0).map((x) => x.total);
  if (tabSpends.length){
    const min = Math.min(...tabSpends);
    const want = min < 1 ? `$${min.toFixed(2)}` : `$${Math.round(min)}`;
    ok(`[${label}] the Next badge is the cheapest gap on the tab`, badge === want,
       `badge "${badge}", cheapest $${min.toFixed(2)}`);
  } else {
    ok(`[${label}] the Next badge is empty when nothing is priceable`, badge === '' || badge.startsWith('+'),
       `badge "${badge}"`);
  }
  // Meta no longer carries one, because the count it used to show is zero unless you own
  // every printing in the game.
  A.TAB = 'meta';
  A.render();
  // The stub only creates an element once something asks for it, so an absent entry is
  // the strongest form of this assertion: nothing in the app touches that badge at all.
  const metaBadge = els.get('tn-meta');
  ok(`[${label}] Meta carries no badge`, !metaBadge || metaBadge.textContent === '',
     metaBadge ? `"${metaBadge.textContent}"` : 'never written to');
}

/* ══ the acquisition path ════════════════════════════════════════════════ */
section('The acquisition path');
for (const mode of ['cost', 'cards'])
for (const [label0, inv] of Object.entries(collections)){
  A.S.planBy = mode;
  const label = `${label0} · by ${mode}`;
  A.S.inv = inv;
  const pool = A.metaPool();
  const arch = A.metaArchetypes(pool);
  const plan = A.acquisitionPath(pool, 3, 24);
  const steps = plan.steps;
  const open = arch.filter((g) => g.best.ev.missingCopies > 0);
  const bad = [];

  if (steps.some((s, i) => i && s.cum <= steps[i - 1].cum)) bad.push('cumulative total not increasing');
  if (steps.some((s) => s.copies <= 0)) bad.push('a step buys nothing');
  if (steps.some((s, i) => i && s.readyShare < steps[i - 1].readyShare)) bad.push('buildable share went down');
  if (open.length && !steps.length) bad.push('decks are open but the plan is empty');
  const ownedNow = A.ownedIdentities();
  for (const s of steps) if (s.need <= (ownedNow.get(s.id) || 0)) bad.push(`${s.card.n} is already owned`);
  if (steps.length && steps[steps.length - 1].cum !== steps.reduce((a, s) => a + s.copies, 0))
    bad.push('cumulative total does not match the lines');
  const declared = new Set(plan.targets.map((t) => t.name));
  if (steps.some((s) => !declared.has(s.target))) bad.push('a step belongs to no declared target');
  // A card may recur under a later target that wants more of it, but never twice under
  // the same target, and a repeat has to be flagged as one.
  const perTarget = new Set(), seen = new Set();
  for (const s of steps){
    const k = `${s.target}|${s.id}`;
    if (perTarget.has(k)) bad.push(`${s.card.n} twice under ${s.target}`);
    perTarget.add(k);
    if (seen.has(s.id) !== !!s.again) bad.push(`${s.card.n} repeat flag wrong`);
    seen.add(s.id);
  }
  const first = steps.findIndex((s) => s.unlocked.length > 0);
  const minGap = open.length ? Math.min(...open.map((g) => g.best.ev.missingCopies)) : null;
  // The failure this file was written for: a plan that never finishes anything.
  if (open.length && first < 0 && !plan.truncated) bad.push('the plan never completes a deck');
  if (first >= 0 && steps[first].cum < minGap) bad.push('completed a deck for less than its gap');
  // The target must be optimal on whichever axis is selected, against the same
  // established-first, then non-redundant, then compounding rule acquisitionPath uses.
  if (plan.targets.length){
    const t = plan.targets[0];
    const have = A.ownedIdentities();
    const built = arch.filter((g) => g.best.ev.missingCopies === 0).map((g) => ({ name: g.name, deck: g.best.deck }));
    const estOpen = open.filter((g) => A.isEstablished(g.name));
    const rows = (estOpen.length ? estOpen : open).map((g) => ({
      name: g.name, short: g.best.ev.missingCopies, distinct: g.best.ev.distinctMissing,
      share: g.share, deck: g.best.deck, gap: A.gapCost(g.best.ev.missing),
    }));
    A.annotateCompounding(rows, have, built);
    const picked = rows.find((g) => g.name === t.name);
    if (!picked){
      bad.push(`target ${t.name} is outside the ${estOpen.length ? 'established' : 'open'} pool`);
    } else if (mode === 'cards'){
      const minShort = Math.min(...rows.map((g) => g.short));
      if (picked.short !== minShort) bad.push(`target ${picked.short} short, pool min ${minShort}`);
      const tied = rows.filter((g) => g.short === minShort);
      const nonRed = tied.filter((g) => !g.redundantOf);
      if (picked.redundantOf && nonRed.length) bad.push('redundant target over a non-redundant one at min short');
      const best = Math.max(...(nonRed.length ? nonRed : tied).map((g) => g.overlapCredit));
      if (picked.overlapCredit + 1e-6 < best)
        bad.push(`target credit ${picked.overlapCredit.toFixed(2)}, best tied ${best.toFixed(2)}`);
    } else {
      const minBucket = Math.min(...rows.map((g) => g.costBucket));
      if (picked.costBucket !== minBucket) bad.push(`target bucket ${picked.costBucket}, pool min ${minBucket}`);
      const inBucket = rows.filter((g) => g.costBucket === minBucket);
      const nonRed = inBucket.filter((g) => !g.redundantOf);
      if (picked.redundantOf && nonRed.length) bad.push('redundant target over a non-redundant one in the cheapest bucket');
      const best = Math.max(...(nonRed.length ? nonRed : inBucket).map((g) => g.overlapCredit));
      if (picked.overlapCredit + 1e-6 < best)
        bad.push(`target credit ${picked.overlapCredit.toFixed(2)}, best in bucket ${best.toFixed(2)}`);
    }
  }
  // Overlap can never make a set of decks cost more than the sum of their gaps.
  const planned = plan.targets.map((t) => arch.find((g) => g.name === t.name)).filter(Boolean);
  const union = A.unionGap(planned);
  const sum = planned.reduce((a, g) => a + g.best.ev.missingCopies, 0);
  if (union.copies > sum) bad.push(`union ${union.copies} exceeds sum ${sum}`);

  ok(`[${label}] the plan holds together`, bad.length === 0,
     bad.slice(0, 2).join('; ') ||
     `${steps.length} buys, ${plan.targets.length} targets, first completion at ` +
     `${first >= 0 ? `${steps[first].cum} cards (minimum ${minGap})` : 'none'}` +
     `, overlap ${sum}->${union.copies}`);
}

/* ══ the age of the committed data ═══════════════════════════════════════
   Everything else in this file tests the engine against whatever data happens to be
   checked out, which means a pipeline that died three weeks ago passes all of it. The
   section below is the only one that asks whether the files are actually current.

   It runs first, deliberately: the Freshness section that follows mutates DECKS_AT to
   drive dataAge() through its bands, and reading the real ages before any of that
   removes the ordering coupling entirely.

   Behind --max-age because a stale local checkout is normal and should not fail the
   everyday run. The daily workflow passes the flag after it has committed, so a source
   past its shelf life turns the job red without holding up the data that did refresh.
   The thresholds are the app's own FRESH_LIMITS rather than a second set invented for
   CI: 'bad' is the exact line at which the page stops calling its own output advice. */
{
  const gate = process.argv.includes('--max-age');
  section(gate ? 'The age of the committed data' : 'The age of the committed data (reporting only, pass --max-age to enforce)');
  for (const a of A.dataAge()){
    const detail = `${a.at || 'missing'}, ${a.days == null ? 'age unknown' : `${a.days}d`}` +
                   ` (warns at ${a.warn}, bad at ${a.bad})`;
    if (gate) ok(`${a.label} is inside its shelf life`, a.state !== 'bad', detail);
    else console.log(`  --   ${a.label}: ${detail} — ${a.state}`);
  }
}

/* ══ freshness ═══════════════════════════════════════════════════════════ */
section('Freshness');
{
  const iso = (d) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  ok('daysSince counts whole days', A.daysSince(iso(0)) === 0 && A.daysSince(iso(14)) === 14,
     `today=${A.daysSince(iso(0))}, a fortnight ago=${A.daysSince(iso(14))}`);
  ok('an unparseable date reads as unknown, not as day zero',
     A.daysSince(null) === null && A.daysSince('not a date') === null);
  // A build stamped in the future must not read as maximally stale.
  ok('a clock skewed behind the build clamps to zero', A.daysSince(iso(-3)) === 0);

  const keep = A.DECKS_AT;
  const band = (days) => { A.DECKS_AT = iso(days); return A.dataAge().find((a) => a.key === 'decks').state; };
  ok('a day-old snapshot is current', band(1) === 'ok', band(1));
  ok('a fortnight-old snapshot warns', band(14) === 'warn', band(14));
  ok('a year-old snapshot is bad', band(365) === 'bad', band(365));
  ok('a missing date is unknown rather than fine', (A.DECKS_AT = null, A.dataAge().find((a) => a.key === 'decks').state) === 'unknown');
  // The whole point: the warning has to reach the tabs that make recommendations.
  A.DECKS_AT = iso(365);
  const loud = A.staleNote('decks', 'the plan below');
  ok('a stale snapshot produces a warning for the recommending tabs',
     loud.includes('365 days old') && loud.includes('build-decks'), `${loud.length} chars`);
  ok('a current snapshot produces no warning at all',
     (A.DECKS_AT = iso(0), A.staleNote('decks', 'x')) === '');

  // The --max-age gate above is itself a guard nothing else would notice going wrong,
  // which is the exact shape of bug this file exists for. Its rule is one line, so
  // assert that line against the same synthetic dates rather than the real files.
  const gated = (days) => { A.DECKS_AT = iso(days); return A.dataAge().some((a) => a.state === 'bad'); };
  ok('the age gate fires on a snapshot past its shelf life', gated(365) === true);
  ok('the age gate passes on a fresh snapshot', gated(0) === false);
  A.DECKS_AT = keep;
}

/* ══ news ════════════════════════════════════════════════════════════════ */
section('News');
if (!news) ok('news snapshot present', false, 'data/news.json missing — run build-news.mjs');
else {
  ok('the feed is riftbound only', news.posts.length > 20 && news.posts.every((p) => p.url.includes('riftbound.gg')),
     `${news.posts.length} posts`);
  ok('every post has a date, a title and a link',
     news.posts.every((p) => p.dt && p.title && p.url));
  ok('titles are unescaped', !news.posts.some((p) => /&amp;|&#\d+;|&quot;/.test(p.title)),
     news.posts.filter((p) => p.title.includes('&')).length + ' contain a literal &');
  ok('the feed is newest first',
     news.posts.every((p, i) => !i || news.posts[i - 1].dt >= p.dt));

  // The join is the reason the feed is worth having. If their title convention changes,
  // this must fail rather than quietly dropping every guide link.
  const legends = news.posts.filter((p) => (p.tags || []).includes('Legends'));
  const joined = legends.filter((p) => A.newsChampion(p.title));
  ok('every Legends post resolves to a champion', joined.length === legends.length,
     `${joined.length} of ${legends.length}` +
     (joined.length < legends.length
       ? ' — unresolved: ' + legends.filter((p) => !A.newsChampion(p.title)).map((p) => p.title).slice(0, 3).join(' | ')
       : ''));
  // The index is a fast stand-in for the champion roster. Every champion in the roster
  // must be findable through it, or news matching silently stops working for some.
  const roster = A.championRoster();
  const viaIndex = roster.filter((c) => A.newsChampion(c.champ) === c.champ);
  ok('every champion is reachable by name through the index', viaIndex.length === roster.length,
     `${viaIndex.length} of ${roster.length}`);
  const pairs = roster.flatMap((c) => c.epithets.map((ep) => [`${c.champ}, ${ep}`, c.champ]));
  const viaPair = pairs.filter(([t, champ]) => A.newsChampion(t) === champ);
  ok('every champion is reachable by champion-and-legend too', viaPair.length === pairs.length,
     `${viaPair.length} of ${pairs.length} pairs`);

  ok('both title conventions resolve',
     A.newsChampion('Diana, Scorn of the Moon Guide - Best Decks & Cards') === 'Diana' &&
     A.newsChampion('Vex - Gloomist Guide - Best Decks & Cards') === 'Vex');
  ok('a title that names no champion resolves to nothing',
     A.newsChampion('Could Valorant Cards Come to Riftbound?') === null &&
     A.newsChampion('') === null);

  A.NEWS_GUIDES = null;
  const guides = A.guideByChampion();
  ok('guides map to champions in the roster', [...guides.keys()].every((c) =>
     A.championRoster().some((r) => r.champ === c)), `${guides.size} champions have a guide`);
  ok('each champion keeps only its newest guide',
     [...guides.values()].every((g) => (g.tags || []).includes('Legends')));

  // Sets and Rules posts are the two that mean our own data is going stale.
  const alerts = A.dataAlerts();
  ok('alerts are recent Sets or Rules posts only',
     alerts.every((p) => p.age <= 30 && (p.tags.includes('Sets') || p.tags.includes('Rules'))),
     `${alerts.length} alert${alerts.length === 1 ? '' : 's'}`);
}

/* ══ events and credibility ══════════════════════════════════════════════ */
section('Events');
if (!events) ok('event archive present', false, 'data/events.json missing — run build-events.mjs');
else {
  ok('every event has a name, date and player count',
     events.events.every((e) => e.name && e.dt && Number.isFinite(e.players)), `${events.events.length} events`);
  // The join by exact name is what carries player counts onto decks. If it breaks, the
  // credibility numbers silently become zero.
  const byName = new Set(events.events.map((e) => e.name));
  const deckEvents = new Set(A.DECKS.filter((d) => d.ev).map((d) => d.ev));
  const unresolved = [...deckEvents].filter((n) => !byName.has(n));
  ok('every event named on a deck resolves to the archive', unresolved.length === 0,
     unresolved.slice(0, 3).join(', ') || `${deckEvents.size} event names matched`);
  ok('every tournament deck carries a player count',
     A.DECKS.filter((d) => d.tour && d.ev).every((d) => Number(d.ec) > 0),
     `${A.DECKS.filter((d) => d.tour).length} tournament decks`);

  A.S.inv = {};
  const arch = A.metaArchetypes(A.metaPool());
  const withEv = arch.filter((g) => g.evCount);
  ok('credibility counts distinct events, not decks',
     withEv.every((g) => g.evCount <= g.tourLists),
     `${withEv.length} archetypes have tournament evidence`);
  // Three lists out of one 433-player event must not claim 1,299 players of support.
  ok('players are never double counted across lists from one event',
     withEv.every((g) => {
       const evs = new Set(g.rows.filter((r) => r.deck.tour && r.deck.ev).map((r) => r.deck.ev));
       let cap = 0;
       for (const n of evs){ const e = events.events.find((x) => x.name === n); cap += e ? e.players : 0; }
       return g.evPlayers === cap;
     }));
  ok('an archetype with no tournament lists claims no evidence',
     arch.filter((g) => !g.tourLists).every((g) => !g.evCount && !g.evPlayers && !g.evNewest));
}

/* ══ the tier list ══════════════════════════════════════════════════════════
   data/tiers.json is scraped from riftbound.gg's tier-list page, so the shape is
   asserted here and the join is measured: a redesign of their page that broke the
   parse would otherwise ship a thin or mis-joined list quietly.                     */
section('The tier list');
if (!tiers) {
  ok('tier list present', false, 'data/tiers.json missing — run build-tiers.mjs');
} else {
  const T = tiers.tiers;
  ok('every tier entry has a champion, a tier and a rank',
     Array.isArray(T) && T.length >= 20 &&
     T.every((t) => t.champion && Number.isInteger(t.tier) && t.tier >= 1 && Number.isInteger(t.rank) && t.rank >= 1),
     `${T.length} legends`);
  ok('tiers run 1..N with no gaps',
     (() => { const ns = [...new Set(T.map((t) => t.tier))].sort((a, b) => a - b);
              return ns[0] === 1 && ns.every((n, i) => n === i + 1); })(),
     [...new Set(T.map((t) => t.tier))].sort((a, b) => a - b).join(','));
  ok('ranks within a tier are 1..k with no gaps',
     [...new Set(T.map((t) => t.tier))].every((tn) => {
       const rs = T.filter((t) => t.tier === tn).map((t) => t.rank).sort((a, b) => a - b);
       return rs.every((r, i) => r === i + 1);
     }));
  ok('tiers.json names the set and links the report',
     typeof tiers.set === 'string' && /^https:\/\/riftbound\.gg\//.test(tiers.report || ''),
     `${tiers.set} — ${tiers.report}`);

  // The join. Champions come from riftbound.gg named plainly; the app maps them to
  // archetypes through the legend roster, and only to legends someone is playing.
  A.S.inv = {};
  const map = A.tierByArchetype();
  const played = new Set(A.DECKS.map(A.archetypeName));
  ok('every joined tier lands on a played archetype', [...map.keys()].every((n) => played.has(n)),
     [...map.keys()].filter((n) => !played.has(n)).slice(0, 3).join(', ') || `${map.size} joined`);
  ok('most of the tier list resolves to a played archetype', map.size >= 25,
     `${map.size} of ${T.length} entries joined`);

  // Master Yi has two legends sitting in two different tiers, which is the whole case
  // the epithet parsed from each guide slug exists to separate. This used to assert that
  // exactly one of them was played and that it was Tier 1; both of those are facts about
  // last week's data rather than about the join, and both have since stopped being true.
  // So assert the mechanism instead: every played Wuju archetype lands on the tier of the
  // entry whose epithet names its legend, whichever ones people are playing and wherever
  // riftbound.gg moves them.
  const yi = [...map.entries()].filter(([n]) => /wuju/i.test(n));
  const epithetTier = (name) => {
    const hits = T.filter((r) => r.epithet &&
      new RegExp(r.epithet.replace(/[^A-Za-z]+/g, '[^A-Za-z]*'), 'i').test(name));
    return hits.length === 1 ? hits[0].tier : null;
  };
  ok('each played Master Yi archetype lands on its own legend\'s tier',
     yi.length >= 1 && yi.every(([n, v]) => v.tier === epithetTier(n)),
     yi.map(([n, v]) => `${n}=T${v.tier}, epithet says T${epithetTier(n)}`).join('; ') || 'none');

  // Meta renders the raw list; Next renders it crossed with the collection, tier-first.
  A.S.inv = collections['deep'];
  A.renderMeta();
  const meta = els.get('v-meta').innerHTML;
  ok('Meta shows the tier list with the report link',
     meta.includes('TIER LIST') && /Tier 1/.test(meta) && meta.includes(tiers.report),
     'panel present');

  A.S.planBy = 'cost';
  A.S.nearSpend = 0;             // no budget: pure tier ranking
  A.S.ownLegendOnly = false;
  A.S.noBuy = [];
  A.S.inv = collections['empty'];   // nothing buildable, so tier order is global
  A.renderNext();
  const next = els.get('v-next').innerHTML;
  const panelStart = next.indexOf('FIND MY DECK');
  ok('Next shows the Find my deck panel', panelStart > -1, 'panel present');
  const panelEnd = next.indexOf('EVERY OPEN DECK', panelStart);
  const seg = panelStart > -1 ? next.slice(panelStart, panelEnd > -1 ? panelEnd : panelStart + 9000) : '';
  const rowTiers = [...seg.matchAll(/>Tier (\d)</g)].map((m) => Number(m[1]));
  ok('Find my deck rows are ordered best tier first (no budget, nothing buildable)',
     rowTiers.length > 1 && rowTiers.every((n, i) => !i || n >= rowTiers[i - 1]), rowTiers.join(','));

  // The three constraints actually do something.
  A.S.noBuy = ['Baron Nashor'];
  A.renderNext();
  ok('a "won\'t buy" entry is shown as a removable chip',
     els.get('v-next').innerHTML.includes('data-unban-card="Baron Nashor"'));
  A.S.noBuy = [];
  // Own the legend for exactly two tiered archetypes, then restrict to owned legends.
  A.S.inv = {};
  const tieredNames = new Set([...A.tierByArchetype().keys()]);
  const pick = A.legendRoster().filter((l) => tieredNames.has(l.name)).slice(0, 2);
  A.S.inv = Object.fromEntries(pick.map((l) => [l.rep.c, { n: 1 }]));
  A.S.ownLegendOnly = false;
  A.renderNext();
  const allRows = (els.get('v-next').innerHTML.match(/build ↗/g) || []).length;
  A.S.ownLegendOnly = true;
  A.renderNext();
  const h = els.get('v-next').innerHTML;
  const ownRows = (h.match(/build ↗/g) || []).length;
  ok('"only legends I own" narrows to legends you hold',
     h.includes('FIND MY DECK') && ownRows > 0 && ownRows <= 2 && ownRows < allRows &&
     pick.every((l) => h.includes(l.name)),
     `${ownRows} of ${allRows} rows, owning ${pick.map((l) => l.name).join(' + ')}`);
  A.S.ownLegendOnly = false;
  A.S.inv = collections['deep'];

  // Freshness knows about it.
  ok('dataAge tracks the tier list', A.dataAge().some((a) => a.key === 'tiers'));
}

/* ══ finishes ════════════════════════════════════════════════════════════ */
section('Finishes');
{
  const flagged = cat.cards.filter((c) => c.fo);
  ok('the catalog carries finish flags', flagged.length > 100,
     `${flagged.length} of ${cat.cards.length} printings are foil-only`);
  // The flag must only ever mean "this finish does not exist", never "no price listed",
  // so it is only set where riftbound.gg's flag and its own price data agree.
  ok('the flag is only ever the unambiguous case', flagged.every((c) => c.fo === 1));

  // A clean collection must produce no complaint at all.
  A.S.inv = {};
  for (const c of cat.cards) if (!c.fo) A.S.inv[c.c] = { n: 1 };
  ok('normal counts on printings that come in normal are never flagged',
     A.foilOnlyProblems().length === 0, `${Object.keys(A.S.inv).length} rows held`);
  ok('and the panel stays out of the way', A.renderFoilOnly() === '');

  // Foil counts on a foil-only printing are correct and must never be flagged.
  A.S.inv = {};
  for (const c of flagged) A.S.inv[c.c] = { f: 2 };
  ok('foil counts on foil-only printings are never flagged', A.foilOnlyProblems().length === 0,
     `${flagged.length} foil-only printings held in foil`);

  // Normal counts on them are always flagged, whether or not foils sit beside them.
  A.S.inv = {};
  for (const c of flagged.slice(0, 20)) A.S.inv[c.c] = { n: 1, f: 1 };
  const mixed = A.foilOnlyProblems();
  ok('a normal count on a foil-only printing is flagged even beside a foil count',
     mixed.length === 20, `${mixed.length} of 20`);
  ok('the flagged rows report the counts they actually hold',
     mixed.every((p) => p.normal === 1 && p.foil === 1));
  ok('the copied list names every flagged printing',
     mixed.every((p) => A.foilOnlyText(mixed).includes(p.code)));

  // The offered fix moves the finish without inventing or losing copies.
  const before = Object.values(A.S.inv).reduce((a, e) => a + (e.n || 0) + (e.f || 0), 0);
  for (const p of mixed){
    const e = { ...A.S.inv[p.code] };
    e.f = (e.f || 0) + p.normal;
    delete e.n;
    A.S.inv[p.code] = e;
  }
  const after = Object.values(A.S.inv).reduce((a, e) => a + (e.n || 0) + (e.f || 0), 0);
  ok('the fix resolves every complaint', A.foilOnlyProblems().length === 0);
  ok('the fix moves copies rather than inventing or dropping them', before === after,
     `${before} before, ${after} after`);
}

/* ══ prices ══════════════════════════════════════════════════════════════ */
section('Prices');
{
  const priced = cat.cards.filter((c) => c.mp > 0);
  ok('the catalog carries per-printing prices', priced.length > 800,
     `${priced.length} of ${cat.cards.length} printings`);
  ok('no price is zero or negative', priced.every((c) => c.mp > 0));

  // A card is costed by the cheapest of its printings, because that is the one you
  // would buy and because a minimum cannot be dragged up by a junk listing.
  const idx = A.costIndex();
  const byId = new Map();
  for (const c of priced){
    const id = A.identityOf(c);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(c.mp);
  }
  const wrong = [...byId].filter(([id, list]) => idx.get(id) !== Math.min(...list));
  ok('a card costs the least of its printings', wrong.length === 0,
     `${byId.size} cards priced` + (wrong.length ? `; first off: ${wrong[0][0]}` : ''));

  // The junk listing this rule exists to survive: a Calm Rune with an $8,888 foil.
  const rune = cat.cards.find((c) => c.n === 'Calm Rune' && !c.v);
  ok('a junk high listing never becomes a card price',
     !rune || A.cardCost(rune) === undefined || A.cardCost(rune) < 5,
     rune ? `Calm Rune costs ${A.cardCost(rune)}` : 'no base Calm Rune');

  // Totals must be arithmetic, and must never quietly skip what they cannot price.
  const sample = [{ card: priced[0], short: 3 }, { card: priced[1], short: 2 }];
  const g = A.gapCost(sample);
  const expect = A.cardCost(priced[0]) * 3 + A.cardCost(priced[1]) * 2;
  ok('a gap total is the sum of its parts', Math.abs(g.total - expect) < 1e-9 && g.priced === 5 && g.complete,
     `$${g.total.toFixed(2)} over ${g.priced} copies`);
  // A printing with no listing is not the same as a card with no price: an unlisted alt
  // art is still costed by its base printing, which is the behaviour we want. So this
  // needs a card where *no* printing of it is priced.
  const unpriced = cat.cards.find((c) => A.cardCost(c) === undefined);
  ok('an unlisted printing is still costed by a priced sibling',
     cat.cards.some((c) => !c.mp && A.cardCost(c) !== undefined),
     `${cat.cards.filter((c) => !c.mp && A.cardCost(c) !== undefined).length} printings priced via a sibling`);
  if (unpriced){
    const mixed = A.gapCost([{ card: priced[0], short: 1 }, { card: unpriced, short: 4 }]);
    ok('an unpriced card is counted as unpriced, not as free',
       mixed.unpriced === 4 && mixed.priced === 1 && !mixed.complete,
       `${mixed.priced} priced, ${mixed.unpriced} not`);
    ok('and the figure is marked as a floor', A.cost(mixed).endsWith('+'), A.cost(mixed));
  }
  ok('an all-unpriced gap says so rather than showing $0',
     A.cost({ total: 0, priced: 0, unpriced: 3, complete: false }) === 'no prices');
  ok('an empty gap is free', A.gapCost([]).total === 0 && A.gapCost([]).complete);

  // The number that matters: the plan's own total must equal the sum of its lines.
  A.S.inv = collections['deep'];
  const plan = A.acquisitionPath(A.metaPool(), 3, 24);
  const lineSum = plan.steps.filter((x) => x.each !== undefined)
                            .reduce((a, x) => a + x.each * x.copies, 0);
  const planTotal = A.gapCost(plan.steps.map((x) => ({ card: x.card, short: x.copies })));
  ok('the plan total matches its own lines', Math.abs(planTotal.total - lineSum) < 1e-6,
     `${A.cost(planTotal)} over ${plan.steps.length} buys`);
  ok('every step carries a unit cost or is honest about not having one',
     plan.steps.every((x) => x.each === undefined || x.each > 0));
}

/* ══ the caches ══════════════════════════════════════════════════════════ */
section('Caches');
{
  // Deck requirements and legality are cached because resolving them is what made the
  // Meta tab slow. Caching is only safe while the invalidation is honest, so both
  // things that can change the answer are exercised here.
  const withBans = A.DECKS.filter((d) => !A.deckLegalForConstructed(d)).length;
  ok('some decks are illegal to begin with', withBans > 0, `${withBans} of ${A.DECKS.length}`);

  // Emptying the ban list must make everything legal again, which it cannot do if the
  // cached legality outlives the list it was computed from.
  A.loadBans({ generatedAt: '2026-01-01', constructed: [], byFormat: {} });
  const afterEmpty = A.DECKS.filter((d) => !A.deckLegalForConstructed(d)).length;
  ok('reloading the ban list invalidates cached legality', afterEmpty === 0,
     `${afterEmpty} still illegal after emptying the list`);
  A.loadBans(read('data/banned.json'));
  ok('and restoring it brings the same decks back',
     A.DECKS.filter((d) => !A.deckLegalForConstructed(d)).length === withBans);

  // Republishing the catalog must re-resolve requirements. A deck whose cards no longer
  // exist has to come back as unresolvable rather than as its remembered answer.
  const sample = A.DECKS.find((d) => Object.keys(d.cards || {}).length > 10);
  const before = A.deckRequirements(sample).needById.size;
  const realCat = A.CAT, realBY = A.BY;
  A.CAT = { ...realCat, cards: [] };
  A.BY = {};
  A.MATCH = null;
  A.buildNameIndex();
  const stripped = A.deckRequirements(sample).needById.size;
  ok('republishing the catalog invalidates cached requirements', stripped === 0,
     `${before} identities before, ${stripped} against an empty catalog`);
  A.CAT = realCat; A.BY = realBY; A.MATCH = null; A.buildNameIndex();
  ok('and the real catalog resolves them again',
     A.deckRequirements(sample).needById.size === before);

  // The cache must not change any answer, only the time taken to get it.
  A.S.inv = collections['deep'];
  A.forgetDeckCaches();
  const cold = A.metaArchetypes(A.metaPool()).map((g) => `${g.name}:${g.best.ev.missingCopies}:${g.best.deck.pr}`).sort();
  const warm = A.metaArchetypes(A.metaPool()).map((g) => `${g.name}:${g.best.ev.missingCopies}:${g.best.deck.pr}`).sort();
  ok('a warm cache gives the same answer as a cold one',
     cold.length === warm.length && cold.every((x, i) => x === warm[i]),
     `${cold.length} archetypes identical`);
}

/* ══ Find my deck: the budget is a soft lens ═══════════════════════════════
   A budget must not hide what is over it — the whole point is that the best deck is
   often more than you want to spend right now. So a tight budget marks rows, it does
   not drop them, and widening it only ever moves rows from "over" to "fits".            */
section('Find my deck constraints');
{
  A.S.inv = collections['deep'];
  A.S.planBy = 'cost';
  A.S.ownLegendOnly = false;
  A.S.noBuy = [];

  A.S.nearSpend = 0;
  A.renderNext();
  const all = (els.get('v-next').innerHTML.match(/build ↗/g) || []).length;
  A.S.nearSpend = 1;
  A.renderNext();
  const tight = els.get('v-next').innerHTML;
  const stillAll = (tight.match(/build ↗/g) || []).length;
  ok('a tight budget hides nothing, only greys it', stillAll === all && /opacity:\.5/.test(tight),
     `${all} rows at $0, ${stillAll} at $1`);

  const overAt = (b) => { A.S.nearSpend = b; A.renderNext();
    return (els.get('v-next').innerHTML.match(/opacity:\.5/g) || []).length; };
  const o10 = overAt(10), o1000 = overAt(1000);
  ok('raising the budget only ever un-greys rows', o1000 <= o10, `${o10} over at $10, ${o1000} at $1000`);

  // "won't buy" actually cuts a card out of the gap math.
  A.S.nearSpend = 0;
  const arch = A.metaArchetypes(A.metaPool());
  const withGap = arch.filter((g) => g.best.ev.missingCopies > 0 && A.gapCost(g.best.ev.missing).unpriced === 0);
  const target = withGap.map((g) => ({ g, m: g.best.ev.missing.slice().sort((a, b) =>
      (A.cardCost(b.card) || 0) - (A.cardCost(a.card) || 0)) }))
    .find((x) => x.m[0] && A.cardCost(x.m[0].card) > 1);
  if (target){
    const before = A.gapCost(target.g.best.ev.missing).total;
    A.S.noBuy = [target.m[0].card.n];
    const after = A.gapCost(target.g.best.ev.missing.filter((x) => x.card.n !== target.m[0].card.n)).total;
    ok('a "won\'t buy" card drops out of the gap cost', after < before - 0.5,
       `${target.g.name}: $${before.toFixed(0)} -> $${after.toFixed(0)} without ${target.m[0].card.n}`);
    A.S.noBuy = [];
  }
  A.S.nearSpend = 25;
}

/* ══ layout bounds ══════════════════════════════════════════════════════ */
section('Layout');
{
  // Same rule the Legends tab is held to, for the same reason: a generous threshold put
  // twenty full panels on Next and 1,015 lines of text to convey an answer a few rows
  // long. Panel count must be fixed by the layout, not grow with the archetype count.
  const lines = (h) => h.replace(/<[^>]+>/g, '\n').replace(/&#?\w+;/g, '')
                        .split('\n').map((x) => x.trim()).filter(Boolean).length;
  for (const [label, inv] of Object.entries(collections)){
    for (const spend of [5, 25, 500]){
      A.S.inv = inv;
      A.S.nearSpend = spend;
      A.renderNext();
      const h = els.get('v-next').innerHTML;
      const panels = (h.match(/class="panel"/g) || []).length;
      ok(`[${label} · $${spend}] Next stays bounded`, panels <= 16 && lines(h) <= 900,
         `${panels} panels, ${lines(h)} text lines`);
    }
    A.S.nearSpend = 25;
    A.renderMeta();
    const m = els.get('v-meta').innerHTML;
    // Five fixed panels now: the overview, the tier list, the news block, what is being
    // played, and (only when the news block is empty) nothing in its place. Still fixed
    // by the layout, not growing with the archetype count.
    ok(`[${label}] Meta stays a reference page`,
       (m.match(/class="panel"/g) || []).length <= 5 && lines(m) <= 260,
       `${(m.match(/class="panel"/g) || []).length} panels, ${lines(m)} text lines`);
  }
}

/* ══ the sections really moved ═══════════════════════════════════════════ */
section('The move');
{
  A.S.inv = collections['deep'];
  A.renderMeta();
  const meta = els.get('v-meta').innerHTML;
  A.renderNext();
  const next = els.get('v-next').innerHTML;
  for (const gone of ['READY DECKS', 'CLOSE DECKS', 'IDEAL DECKS'])
    ok(`Meta no longer renders ${gone}`, !meta.includes(gone));
  ok('Meta still carries the reference material',
     ['THE META', 'WHAT IS BEING PLAYED'].every((x) => meta.includes(x)));
  ok('Meta points at Next for anything collection-relative', /<b>Next<\/b>/.test(meta));
  ok('Next owns the collection-relative sections',
     next.includes('FIND MY DECK') && next.includes('WHAT TO DO NEXT'));
  // The moved panels carry delegated-handler buttons; the markup has to come with them.
  A.S.inv = collections['everything'];
  A.renderNext();
  const owned = els.get('v-next').innerHTML;
  ok('buildable archetypes appear on Next once everything is owned',
     owned.includes('BUILDABLE NOW'), 'panel present');
  ok('the moved panels keep their actions',
     owned.includes('data-meta-copy') && owned.includes('data-meta-save'));
  A.S.inv = collections['deep'];
}

/* ══ the two orderings ═══════════════════════════════════════════════════ */
section('Target ordering');
{
  let differed = 0, savings = [];
  for (const [label, inv] of Object.entries(collections)){
    if (label === 'everything') continue;
    A.S.inv = inv;
    const pool = A.metaPool();
    A.S.planBy = 'cost';
    const cheap = A.acquisitionPath(pool, 1, 24).targets[0];
    A.S.planBy = 'cards';
    const few = A.acquisitionPath(pool, 1, 24).targets[0];
    if (!cheap || !few) continue;
    const arch = A.metaArchetypes(pool);
    const gapOf = (n) => { const g = arch.find((x) => x.name === n); return g ? A.gapCost(g.best.ev.missing).total : 0; };
    if (cheap.name !== few.name){ differed++; savings.push(gapOf(few.name) - gapOf(cheap.name)); }
  }
  ok('the two orderings genuinely disagree, so the choice is not decoration', differed > 0,
     `${differed} of 4 collections pick a different target` +
     (savings.length ? `, cheapest saving $${Math.min(...savings).toFixed(0)} to $${Math.max(...savings).toFixed(0)}` : ''));
  A.S.planBy = 'cost';
}

/* ══ compounding, redundancy and the fringe gate ═══════════════════════════
   The three refinements that sit inside cost and cards. None is a fabricated index:
   the compounding credit is the price of cards you would buy anyway, the fringe gate
   is a list-count threshold, and redundancy is a card-overlap fraction. Each is held
   to a definition here.                                                              */
section('Compounding and the fringe gate');
{
  // The gate splits the roster and matches its own rule exactly.
  const est = A.establishedArchetypes();
  const rawLists = new Map(), rawTour = new Map();
  for (const d of A.DECKS){
    const k = A.archetypeName(d);
    rawLists.set(k, (rawLists.get(k) || 0) + 1);
    if (d.tour) rawTour.set(k, (rawTour.get(k) || 0) + 1);
  }
  const wantEst = new Set([...rawLists].filter(([k, n]) => n >= 4 || rawTour.get(k)).map(([k]) => k));
  ok('the fringe gate matches its rule', est.size === wantEst.size && [...est].every((k) => wantEst.has(k)),
     `${est.size} established`);
  ok('the gate actually splits the roster', est.size > 5 && est.size < rawLists.size,
     `${est.size} of ${rawLists.size} established`);

  // Overlap credit: synthetic candidates that share exactly one priced card.
  const priced = A.DECKS.find((d) => Object.keys(d.cards).some((c) => {
    const hit = A.matchRow({ id: c }); return hit && A.cardCost(hit.card) != null;
  }));
  {
    const have = new Map();
    const solo = [{ name: 'solo', deck: priced }];
    A.annotateCompounding(solo, have, []);
    ok('a gap no other candidate shares earns no compounding credit', solo[0].overlapCredit === 0,
       `credit ${solo[0].overlapCredit}`);
    const pair = [{ name: 'a', deck: priced }, { name: 'b', deck: priced }];
    A.annotateCompounding(pair, have, []);
    ok('two candidates short of the same cards credit the shared value',
       pair[0].overlapCredit > 0 && pair[0].overlapCredit === pair[1].overlapCredit);
    const fullGap = A.gapCost([...A.deckRequirements(priced).needById.values()]
      .map((n) => ({ card: n.card, short: n.qty }))).total;
    ok('the credit never exceeds the priced gap', pair[0].overlapCredit <= fullGap + 1e-6,
       `credit ${pair[0].overlapCredit.toFixed(2)} vs gap ${fullGap.toFixed(2)}`);
    // Redundancy: same list on both sides is a full reprint; a different list is not.
    const other = A.DECKS.find((d) => d !== priced && A.archetypeName(d) !== A.archetypeName(priced));
    const red = [{ name: 'x', deck: priced }];
    A.annotateCompounding(red, have, [{ name: 'B', deck: priced }]);
    ok('a deck that reprints a buildable one is flagged redundant',
       red[0].redundantOf === 'B' && red[0].redundantFrac === 1);
    const notRed = [{ name: 'y', deck: priced }];
    A.annotateCompounding(notRed, have, [{ name: 'C', deck: other }]);
    ok('a deck that shares little with the buildable set is not flagged',
       notRed[0].redundantOf === null);
  }

  // byCost / byCards stay pure: this is what "within reach for $X" reads, so it must be
  // strictly cheapest (or fewest) first, with compounding nowhere in it. byPlanTarget
  // is the one that buckets and then breaks ties on redundancy and compounding.
  for (const [label, inv] of Object.entries(collections)){
    if (label === 'everything') continue;
    A.S.inv = inv;
    const pool = A.metaPool();
    const arch = A.metaArchetypes(pool);
    const have = A.ownedIdentities();
    const built = arch.filter((g) => g.best.ev.missingCopies === 0).map((g) => ({ name: g.name, deck: g.best.deck }));
    const cand = arch.filter((g) => g.best.ev.missingCopies > 0).map((g) => ({
      name: g.name, short: g.best.ev.missingCopies, distinct: g.best.ev.distinctMissing,
      share: g.share, lists: g.lists, deck: g.best.deck, gap: A.gapCost(g.best.ev.missing),
    }));
    if (cand.length < 3){ ok(`[${label}] too few open archetypes to order`, true, `${cand.length}`); continue; }
    A.annotateCompounding(cand, have, built);

    A.S.planBy = 'cost';
    const byPrice = cand.slice().sort(A.byCost);
    const pricedRun = byPrice.filter((c) => c.gap.unpriced === 0);
    const priceBad = pricedRun.findIndex((c, i) => i && c.gap.total + 1e-6 < pricedRun[i - 1].gap.total);
    ok(`[${label}] byCost is strictly cheapest-gap first`, priceBad < 0,
       priceBad < 0 ? `${pricedRun.length} priced, monotone`
         : `${pricedRun[priceBad].name} $${pricedRun[priceBad].gap.total} after $${pricedRun[priceBad - 1].gap.total}`);

    A.S.planBy = 'cards';
    const byFew = cand.slice().sort(A.byCards);
    const fewBad = byFew.findIndex((c, i) => i && c.short < byFew[i - 1].short);
    ok(`[${label}] byCards is strictly fewest-cards first`, fewBad < 0, `${byFew.length} ordered`);

    // byPlanTarget: cost bucket first, then non-redundant, then more overlap credit.
    A.S.planBy = 'cost';
    const byPlan = cand.slice().sort(A.byPlanTarget);
    const bad = [];
    for (let i = 1; i < byPlan.length; i++){
      const p = byPlan[i - 1], q = byPlan[i];
      if (p.costBucket > q.costBucket) bad.push(`bucket ${p.costBucket} before ${q.costBucket}`);
      if (p.costBucket === q.costBucket){
        const pr = p.redundantOf ? 1 : 0, qr = q.redundantOf ? 1 : 0;
        if (pr > qr) bad.push(`redundant ${p.name} before non-redundant ${q.name}`);
        if (pr === qr && p.overlapCredit + 1e-6 < q.overlapCredit)
          bad.push(`${p.name} (credit ${p.overlapCredit.toFixed(2)}) before ${q.name} (${q.overlapCredit.toFixed(2)})`);
      }
    }
    ok(`[${label}] byPlanTarget is bucket, then non-redundant, then compounding`, bad.length === 0,
       bad.slice(0, 2).join('; ') || `${byPlan.length} ordered`);
  }

  // renderNext: the by-cost list is cheapest-first, and the headline target is the deck
  // the plan actually commits to — the two must agree.
  for (const label of ['empty', 'staples only', 'deep']){
    A.S.inv = collections[label];
    A.S.planBy = 'cost';
    A.renderNext();
    const html = els.get('v-next').innerHTML;
    const rankedStart = html.indexOf('EVERY OPEN DECK, BY COST');
    const rankedEnd = html.indexOf('BEST CARDS TO GET', rankedStart);
    const ranked = rankedStart > -1 ? html.slice(rankedStart, rankedEnd > -1 ? rankedEnd : undefined) : '';
    const gaps = [...ranked.matchAll(/>\s*\$([\d,]+(?:\.\d+)?)\+? gap</g)].map((m) => Number(m[1].replace(/,/g, '')));
    const monotone = gaps.every((g, i) => !i || g + 0.001 >= gaps[i - 1]);
    ok(`[${label}] the ranked list on Next is cheapest-gap first`, gaps.length > 1 && monotone,
       monotone ? `${gaps.length} rows` : `gaps ${gaps.slice(0, 8).join(', ')}`);
    const plan = A.acquisitionPath(A.metaPool(), 3, 24);
    if (plan.targets[0]){
      const headline = html.match(/best next target is\s*<b[^>]*>([^<]+)<\/b>/);
      ok(`[${label}] the headline target is the plan's first target`,
         headline && headline[1].trim() === plan.targets[0].name,
         headline ? `"${headline[1].trim()}" vs "${plan.targets[0].name}"` : 'no headline match');
    }
  }

  // The renderNext copy explains the two tie-breakers and no longer offers a score mode.
  A.S.inv = collections['deep'];
  A.S.planBy = 'cost';
  A.renderNext();
  const h = els.get('v-next').innerHTML;
  ok('Next explains compounding and redundancy',
     /[Cc]ompounding:/.test(h) && /[Rr]edundancy:/.test(h) && !h.includes('data-plan-by="score"'),
     'copy present, no score chip');
}

/* ══ the views render ════════════════════════════════════════════════════ */
section('Rendering');
{
  const junk = /undefined|NaN|\[object Object\]/;
  const check = (label, id, fn, must) => {
    let detail = '';
    try {
      fn();
      const h = els.get(id) ? els.get(id).innerHTML : '';
      if (h.length < 120) throw new Error(`rendered ${h.length} chars`);
      const m = junk.exec(h);
      if (m) throw new Error(`contains "${m[0]}": …${h.slice(Math.max(0, m.index - 70), m.index + 40).replace(/\s+/g, ' ')}…`);
      for (const t of must || []) if (!h.includes(t)) throw new Error(`missing "${t}"`);
      detail = `${h.length} chars`;
    } catch (e){ ok(label, false, e.message); return; }
    ok(label, true, detail);
  };

  for (const [label, inv] of Object.entries(collections)){
    A.S.inv = inv;
    A.PARTNER = null;
    check(`[${label}] Legends renders`, 'v-legends', () => A.renderLegends(),
          ['CHAMPIONS', 'PLAYABLE', 'NEED A UNIT', 'NEED THE LEGEND', 'NEED BOTH',
           'LEGEND PRINTINGS']);
    A.S.planBy = 'cost';
    check(`[${label}] Next renders (by cost)`, 'v-next', () => A.renderNext(), ['WHAT TO DO NEXT', 'THE PLAN']);
    A.S.planBy = 'cards';
    check(`[${label}] Next renders (by cards)`, 'v-next', () => A.renderNext(), ['WHAT TO DO NEXT', 'THE PLAN']);
    A.S.planBy = 'cost';
    check(`[${label}] Meta renders`, 'v-meta', () => A.renderMeta(), ['THE META']);
    check(`[${label}] Sets renders`, 'v-sets', () => A.renderSets(), []);
    check(`[${label}] News renders`, 'v-news', () => A.renderNews(), ['NEWS']);
  }

  // Every tab, so the dispatch and the badges are exercised too.
  A.S.inv = collections['deep'];
  let threw = null;
  try {
    for (const tab of ['collection','sets','trade','decks','meta','next','legends','news','sync']){
      A.TAB = tab; A.render();
    }
  } catch (e){ threw = e.message; }
  ok('every tab dispatches', !threw, threw || 'all nine');

  // A partner, so the trade matcher and the trade/buy split are covered.
  const plan = A.acquisitionPath(A.metaPool(), 3, 24);
  const wanted = plan.steps.slice(0, 4).map((s) => s.card.c);
  const mine = Object.keys(A.S.inv).slice(0, 3);
  for (const c of mine) A.S.inv[c] = { n: 6 };
  A.PARTNER = A.readPartner('partner', { user: { user_id: 7, nickname: 'partner' }, collection: [
    ...wanted.map((c) => ({ card: c, standard: 9 })),
    ...mine.map((c) => ({ card: c, standard: 1, wish: 2 })),
  ]});
  const m = A.tradeMatch();
  ok('a scan produces both sides of a trade', m && m.theyGive.length > 0 && m.youGive.length > 0,
     m ? `${m.theyGive.length} take / ${m.youGive.length} give` : 'no match');
  const firstPlain = m.theyGive.findIndex((x) => !x.unlocks.length);
  const lastUnlock = m.theyGive.reduce((acc, x, i) => (x.unlocks.length ? i : acc), -1);
  ok('rows that complete a deck sort first', !(firstPlain >= 0 && lastUnlock > firstPlain));
  check('Trade renders with a partner', 'v-trade', () => A.renderTrade(),
        ['partner', 'You take', 'You give']);
  check('Next renders the trade/buy split', 'v-next', () => A.renderNext(),
        ['gettable in trade', 'have to be bought']);

  // No snapshot at all: the tabs must degrade rather than throw.
  const keep = A.DECKS;
  A.DECKS = null;
  A.PARTNER = null;
  let degraded = null;
  try { A.renderNext(); A.renderLegends(); A.TAB = 'next'; A.render(); }
  catch (e){ degraded = e.message; }
  ok('the tabs survive a missing deck snapshot', !degraded, degraded || 'guidance shown instead');
  A.DECKS = keep;

  // The state the tab exists to report: legend in hand, no unit to field it.
  A.S.inv = collections['legends but no units'];
  const stuck = A.championRoster();
  ok('owning every legend and no units puts every champion in NEED A UNIT',
     stuck.filter((c) => c.state === 'needUnit').length === 48 &&
     stuck.filter((c) => c.playable).length === 0,
     `${stuck.filter((c) => c.state === 'needUnit').length} need a unit, ` +
     `${stuck.filter((c) => c.playable).length} playable`);
  ok('every champion needing a unit names the units that would fix it',
     stuck.filter((c) => c.state === 'needUnit').every((c) => c.units.length > 0));
  check('Legends renders the need-a-unit bucket', 'v-legends', () => A.renderLegends(),
        ['NEED A UNIT', 'any of:']);
  const stuckTxt = A.legendText(A.legendRoster());
  ok('the copied text lists them under the right heading',
     /NEED A UNIT \(48\)/.test(stuckTxt), `${stuckTxt.split('\n').length} lines`);

  // Master Yi is the one champion with two legends, and the grouping has to survive it.
  A.S.inv = {};
  const grouped = A.championRoster();
  ok('the roster is keyed by champion, not by legend', grouped.length === 48,
     `${A.legendRoster().length} legends -> ${grouped.length} champions`);
  const yi = grouped.find((c) => c.champ === 'Master Yi');
  ok('a champion with two legends is one row carrying both', yi && yi.epithets.length === 2,
     yi ? yi.epithets.join(' / ') : 'Master Yi missing');
  ok('every champion in the roster has a legend', grouped.every((c) => c.legends.length > 0));
  // The legendless count is rendered, so it must be derived rather than written down.
  const legendless = A.legendlessChampions();
  ok('legendless champions are counted, not hardcoded', legendless.length === 48,
     `${legendless.length} champions have units but no legend`);
  ok('no champion is both in the roster and counted as legendless',
     !legendless.some((t) => grouped.some((c) => c.champ === t)));
  A.renderLegends();
  ok('the rendered legendless count matches the computed one',
     els.get('v-legends').innerHTML.includes(`${legendless.length} further`));
  // Holding either of Master Yi's legends plus a unit must make him playable.
  for (const l of yi.legends){
    A.S.inv = { [l.rep.c]: { n: 1 }, [yi.units[0].card.c]: { n: 1 } };
    const one = A.championRoster().find((c) => c.champ === 'Master Yi');
    ok(`holding ${l.name} plus a unit makes Master Yi playable`, one.playable, one.state);
  }

  // The four states must partition the champion roster exactly once each. The previous
  // legend-keyed version listed an unfieldable legend twice, because "held" is a
  // superset of "blocked" — which is what made the tab unreadable.
  for (const [label, inv] of Object.entries(collections)){
    A.S.inv = inv;
    const r = A.championRoster();
    const counted = A.CH_STATES.reduce((a, [k]) => a + r.filter((c) => c.state === k).length, 0);
    ok(`[${label}] the four states partition the champion roster`, counted === r.length,
       `${counted} of ${r.length} counted once`);
    ok(`[${label}] playable means both halves in hand`,
       r.every((c) => c.playable === (c.heldLegend && c.unitsOwned > 0)));
    A.renderLegends();
    const h = els.get('v-legends').innerHTML;
    // A champion must appear in exactly one bucket's section of the page.
    const bounds = A.CH_STATES.map(([, label2]) => h.indexOf(`>${label2} `));
    const dupes = [];
    for (const c of r){
      let hits = 0;
      for (let i = 0; i < bounds.length; i++){
        const end = i + 1 < bounds.length ? bounds[i + 1] : h.indexOf('LEGEND PRINTINGS');
        if (h.slice(bounds[i], end).includes(`>${c.champ}<`)) hits++;
      }
      if (hits !== 1) dupes.push(`${c.champ} in ${hits}`);
    }
    ok(`[${label}] each champion appears in exactly one bucket`, dupes.length === 0,
       dupes.slice(0, 3).join(', ') || `${r.length} champions placed once`);
  }

  // And the inverse: every unit, no legends, so nothing is blocked but nothing is held.
  const unitsOnly = {};
  for (const c of cat.cards) if (c.t !== 'Legend') unitsOnly[c.c] = { n: 3 };
  A.S.inv = unitsOnly;
  const noLegends = A.championRoster();
  ok('owning every unit but no legend puts everyone in NEED THE LEGEND',
     noLegends.every((c) => c.state === 'needLegend'),
     `${noLegends.filter((c) => c.state === 'needLegend').length} of ${noLegends.length}`);
  ok('each of those names the legend printing to go and get',
     noLegends.every((c) => c.legendToGet && c.legendToGet.rep.c));

  // The copied text is a deliverable too.
  A.S.inv = collections['deep'];
  const txt = A.legendText(A.legendRoster());
  ok('the copied champion gaps are clean', !junk.test(txt), `${txt.split('\n').length} lines`);
  ok('the copied text is champion-first', /^CHAMPIONS/.test(txt));
  ok('an empty plan copies without throwing', /nothing to buy/.test(A.pathText([])));
}

console.log(failures ? `\n${failures} FAILED` : '\nall checks pass');
process.exit(failures ? 1 : 0);
