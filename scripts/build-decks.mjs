#!/usr/bin/env node
// Regenerates data/decks.json: what people are actually playing right now.
//
//   node scripts/build-decks.mjs [--days 60] [--max 700]
//
// Source: riftbound.gg's public deck API (api.dotgg.gg/cgfw/getdecks). No key and
// no auth.
//
// Two sources, deliberately:
//
//   Public decks are the live meta. There are hundreds from the last few weeks and
//   three quarters of them play Vendetta.
//
//   Tournament decks carry an event and a finishing place, which is the only hard
//   evidence of a list being good, but they lag badly. The whole tournament archive
//   is 452 decks and 329 of those come from one event in May, before Vendetta
//   existed. Building the meta from tournament data alone produced a snapshot where
//   Vendetta barely appeared, which is what prompted this rewrite.
//
// So: popularity comes from recent public decks, credibility from tournament
// placements, and everything outside the window is dropped.
//
// Two filters earn their keep. Clones: 248 of 450 public decks were named
// "... - copy" and 450 lists collapsed to 303 distinct fingerprints, so counting
// them raw would have measured copying rather than play. And size, since a
// half-built brew is not a deck.

import { writeFile, readFile } from "node:fs/promises";

const API = "https://api.dotgg.gg/cgfw/getdecks";
// The API caps a page at 30 no matter what limit you ask for.
const PAGE = 30;
const MIN_SIZE = 50;

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
};

const FILTERS = (tournament) => ({
  hascrd: [], nothascrd: [], youtube: 0, smartsrch: "", format: "", date: "",
  color: [], collection: 0, topset: "", at: 0, is_tournament: tournament ? 1 : "",
  legalonly: 1, priceMin: "", priceMax: "", placement: "", leader: "",
});

/* ── results the flag does not carry ──────────────────────────────────────────
   Upstream's is_tournament flag covers 38 of 475 lists and every one of them is from
   July, before the Aspirant's Climb ban. Meanwhile fifty lists announce a result in
   their own title — "Ornn Wins Barcelona RQ", "Sivir Top 8 S4 Beijing City Challenge",
   "Renata Glasc Top 128 Nanjing Regional" — and not one of them is flagged. The deck
   that made this obvious is a genuine Top 8 that riftbound.gg serves with
   is_tournament: "0", no event and no placement, so the app read a placing deck as an
   anonymous brew.

   What is parsed here is therefore a *claim by the deck's author*, not a record. It is
   kept in its own fields and never written to `tour`, `ev`, `pl` or `ec`, because those
   mean "upstream says so" and this does not. It also never gets a player count: the
   events these name are mostly absent from the tournament archive, and a field size
   invented to fill the column would be exactly the made-up number this project refuses
   to produce elsewhere. */

// Ordered: the most specific pattern that matches wins, so "Top 8" is not read as 8th.
// Ordered: the most specific pattern that matches wins, so "Top 8" is not read as 8th.
const PLACE_PATTERNS = [
  [/\bundefeated\b|\bx-0\b/i, () => null],          // a result, but not a placing
  [/\bwins?\b|\bwinner\b|\b1st\s+place\b/i, () => 1],
  [/\btop\s*(\d{1,3})\b/i, (m) => Number(m[1])],
  [/\b(\d{1,3})(?:st|nd|rd|th)\s+place\b/i, (m) => Number(m[1])],
];

// "Sivir Top 8 S4 Beijing City Challenge - copy" -> { place: 8, event: "S4 Beijing City Challenge" }
// Returns null when the title claims nothing, which is the common case.
const claimFromTitle = (title) => {
  const raw = String(title || "").replace(/\s*-\s*copy(\s*\d+)?\s*$/i, "").trim();
  if (!raw) return null;
  for (const [re, read] of PLACE_PATTERNS) {
    const m = raw.match(re);
    if (!m) continue;
    // Everything after the result phrase is the event, minus a leading "at"/"of"/"@".
    let event = raw.slice(m.index + m[0].length)
                   .replace(/^\s*(?:at|in|of|@|-|–|,)\s*/i, "")
                   .replace(/\s*\([^)]*\)\s*$/, "")
                   .trim();
    // A bare "Top 8" names no event, and a single word is usually the rest of a deck
    // name rather than a tournament.
    if (event.length < 4 || !/\s/.test(event)) event = null;
    return { place: read(m), event };
  }
  return null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Their API rate limits, and a full run is dozens of requests, so pace it and back
// off rather than dying half way and writing a truncated file.
async function getPage(page, filters, attempt = 0) {
  const rq = { page, limit: PAGE, srt: "date", direct: "desc", type: "",
               my: 0, myarchive: 0, fav: 0, getdecks: filters };
  const r = await fetch(`${API}?game=riftbound&rq=${encodeURIComponent(JSON.stringify(rq))}`, {
    headers: { "User-Agent": "rift.jayegger.com deck builder", Origin: "https://riftbound.gg" },
  });
  if (r.status === 429 || r.status >= 500) {
    if (attempt >= 5) throw new Error(`${r.status} ${r.statusText} after ${attempt} retries`);
    const wait = 3000 * 2 ** attempt;
    process.stdout.write(`(${r.status}, waiting ${wait / 1000}s) `);
    await sleep(wait);
    return getPage(page, filters, attempt + 1);
  }
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  await sleep(400);
  const d = await r.json();
  return Array.isArray(d) ? d : [];
}

// Newest first, until a page stops adding anything.
async function getAll(filters, max) {
  const seen = new Map();
  for (let page = 1; page <= 80 && seen.size < max; page++) {
    const batch = await getPage(page, filters);
    if (!batch.length) break;
    const before = seen.size;
    for (const d of batch) if (!seen.has(d.slug)) seen.set(d.slug, d);
    if (seen.size === before) break;
  }
  return [...seen.values()];
}

// Kept identical to the copy in index.html: the two must agree or a deck that the
// snapshot resolves will read as unmatched in the app.
function normColl(seg) {
  let s = String(seg ?? "").replace(/\s+/g, "");
  if (!s) return null;
  // "-P" marks a promo printing and "-STAR" a signature, spelled out. A promo Annie
  // is still Annie, so both fold to the base printing.
  s = s.replace(/[-_]P$/i, "");
  s = s.replace(/\/\d+$/, "");
  const star = /\*/.test(s) || /star$/i.test(s);
  s = s.replace(/\*/g, "").replace(/[-_]?star$/i, "");
  s = s.replace(/[-_]/g, "");   // "263-a" is just "263a"
  const m = /^([A-Za-z]*)0*(\d+)([A-Za-z]*)$/.exec(s);
  return m ? `${m[1].toUpperCase()}${Number(m[2])}${m[3].toUpperCase()}${star ? "*" : ""}` : null;
}
function keyOf(code) {
  const m = /^([A-Za-z]{2,5})[-\s]+(.+)$/.exec(String(code ?? "").trim());
  if (!m) return null;
  const n = normColl(m[2]);
  return n ? `${m[1].toUpperCase()}|${n}` : null;
}

const deckSize = (d) => Object.values(d.deck || {}).reduce((a, q) => a + (Number(q) || 0), 0);
const deckDate = (d) => (d.date ? new Date(Number(d.date) * 1000).toISOString().slice(0, 10) : null);

const main = async () => {
  const days = arg("days", 60);
  const max = arg("max", 700);

  const cat = JSON.parse(await readFile(new URL("../data/cards.json", import.meta.url), "utf8"));

  // Event sizes, so a tournament deck can carry how big its event was. Optional: the
  // snapshot is still usable without it, the decks just lose their credibility weight.
  // The join is by exact event name, which holds today and is reported on if it stops.
  let eventByName = new Map();
  try {
    const ev = JSON.parse(await readFile(new URL("../data/events.json", import.meta.url), "utf8"));
    eventByName = new Map((ev.events || []).map((e) => [e.name, e]));
  } catch {
    console.log("  (no data/events.json yet; run build-events.mjs for credibility weights)");
  }
  let extra = [];
  try {
    extra = JSON.parse(await readFile(new URL("../data/extras.json", import.meta.url), "utf8")).cards || [];
  } catch { /* optional */ }
  const byKey = new Map();
  for (const c of cat.cards.concat(extra)) {
    const k = keyOf(c.c);
    if (k && !byKey.has(k)) byKey.set(k, c);
  }
  // Deck lists cite printings the gallery never published, mostly alt-art basic
  // runes like "VEN-R02a". Fall back to the same-numbered base printing.
  // Legend names, longest first, for the fallback below.
  const legendNames = [...new Set(cat.cards.filter((c) => c.t === "Legend").map((c) => c.n))]
    .sort((a, b) => b.length - a.length);

  const lookup = (code) => {
    const k = keyOf(code);
    if (!k) return null;
    if (byKey.has(k)) return byKey.get(k);
    const [set, coll] = k.split("|");
    const m = /^([A-Za-z]*\d+)[A-Za-z]+(\*?)$/.exec(coll);
    return m ? byKey.get(`${set}|${m[1]}${m[2]}`) || null : null;
  };

  process.stdout.write("fetching public decks… ");
  const pub = await getAll(FILTERS(false), max);
  console.log(pub.length);
  process.stdout.write("fetching tournament decks… ");
  const tour = await getAll(FILTERS(true), max);
  console.log(tour.length);

  // The window is measured from the freshest deck seen, not from today, so a quiet
  // week does not silently empty the file.
  const newest = [...pub, ...tour].map(deckDate).filter(Boolean).sort().pop();
  const cutoff = new Date(new Date(newest).getTime() - days * 86400000).toISOString().slice(0, 10);

  const tourSlugs = new Set(tour.map((d) => d.slug));
  const inWindow = (d) => {
    const dt = deckDate(d);
    return dt && dt >= cutoff && deckSize(d) >= MIN_SIZE;
  };

  // Clones are a user artifact, so one entry per distinct list. Tournament entries
  // are never collapsed: two players bringing the same 56 cards is real signal.
  const bestOf = new Map();
  let clones = 0;
  for (const d of pub.filter(inWindow)) {
    if (tourSlugs.has(d.slug)) continue;
    const fp = d.fingerprint || d.slug;
    const prev = bestOf.get(fp);
    if (!prev){ bestOf.set(fp, d); continue; }
    clones++;
    // Keep the most-viewed, and prefer a name that is not "... - copy".
    const score = (x) => (Number(x.views) || 0) - (/\bcopy\b/i.test(x.humanname || "") ? 1000 : 0);
    if (score(d) > score(prev)) bestOf.set(fp, d);
  }

  const shape = (d, isTour) => {
    const cards = {};
    let legend = null, size = 0;
    const unknown = [];
    for (const [code, qty] of Object.entries(d.deck || {})) {
      const q = Number(qty) || 0;
      if (!q) continue;
      cards[code] = q;
      size += q;
      const c = lookup(code);
      if (!c) unknown.push(code);
      else if (c.t === "Legend" && !legend) legend = c;
    }
    if (!legend) {
      // A handful of lists omit the Legend card but name the archetype, so read it
      // off the title rather than dropping the deck into "unidentified".
      const hn = (d.humanname || "").toLowerCase();
      const hit = legendNames.find((n) => hn.includes(n.toLowerCase()));
      if (hit) legend = cat.cards.find((c) => c.t === "Legend" && c.n === hit);
    }
    const t = d.tournament || {};
    // Only for lists upstream did not flag: a deck cannot carry both a record and a
    // claim, so the two can never be double-counted downstream.
    const claim = isTour ? null : claimFromTitle(d.humanname);
    return {
      s: d.slug,
      h: (d.humanname || "").trim(),
      lg: legend ? legend.c : null,
      ln: legend ? legend.n : null,
      ev: t.tournament_name || null,
      pl: t.place ?? null,
      // How many players the event drew. A 9-player local and a 433-player major used
      // to weigh the same, which is the whole reason this is carried through.
      ec: (eventByName.get(t.tournament_name || "") || {}).players || null,
      dt: deckDate(d),
      vw: Number(d.views) || 0,
      pr: Math.round(Number(d.price) || 0),
      sz: size,
      tour: isTour ? 1 : 0,
      // A placing the author claims in the title, never a record. No player count:
      // these events are mostly absent from the archive and an invented field size
      // would be the made-up number this project refuses to produce.
      cp: claim ? claim.place : null,
      ce: claim ? claim.event : null,
      cards,
      _unknown: unknown,
    };
  };

  const decks = [
    ...tour.filter(inWindow).map((d) => shape(d, true)),
    ...[...bestOf.values()].map((d) => shape(d, false)),
  ].filter((d) => d.sz > 0);

  const claimed = decks.filter((d) => d.cp != null || d.ce);
  const unknown = new Map();
  for (const d of decks){
    for (const c of d._unknown) unknown.set(c, (unknown.get(c) || 0) + 1);
    delete d._unknown;
  }
  decks.sort((a, b) => (b.tour - a.tour) || (b.dt || "").localeCompare(a.dt || ""));

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "api.dotgg.gg/cgfw/getdecks (riftbound.gg): recent public decks for popularity, tournament entries for placings",
    window: { from: cutoff, to: newest, days },
    decks,
  };
  await writeFile(new URL("../data/decks.json", import.meta.url), JSON.stringify(out) + "\n");

  // ── report ────────────────────────────────────────────────────────────
  const tourN = decks.filter((d) => d.tour).length;
  console.log(`\nwindow ${cutoff} to ${newest} (${days}d)`);
  console.log(`${decks.length} decks kept: ${tourN} tournament, ${decks.length - tourN} public` +
    `${clones ? `, ${clones} clones collapsed` : ""}`);

  const sets = {};
  for (const d of decks)
    for (const s of new Set(Object.keys(d.cards).map((c) => c.split("-")[0].trim().toUpperCase())))
      sets[s] = (sets[s] || 0) + 1;
  console.log("\ndecks containing each set:");
  for (const [s, n] of Object.entries(sets).sort((a, b) => b[1] - a[1]))
    console.log(`  ${s}  ${String(n).padStart(4)}  ${(n / decks.length * 100).toFixed(0)}%`);

  const arch = {};
  for (const d of decks) {
    const k = d.ln || "unidentified";
    (arch[k] ??= { n: 0, tour: 0, best: 999 });
    arch[k].n++;
    if (d.tour) arch[k].tour++;
    if (d.pl && d.pl < arch[k].best) arch[k].best = d.pl;
  }
  const ranked = Object.entries(arch).sort((a, b) => b[1].n - a[1].n);
  console.log(`\n${ranked.length} archetypes. most played:`);
  for (const [name, v] of ranked.slice(0, 12))
    console.log(`  ${name.padEnd(30)} ${String(v.n).padStart(3)} decks  ` +
      `${(v.n / decks.length * 100).toFixed(1).padStart(5)}%` +
      (v.tour ? `  ${v.tour} tourn` : "") + (v.best < 999 ? `  best #${v.best}` : ""));

  // How much of the tournament scene the snapshot can actually see. The point is not
  // the number, it is that the number is small and the app should say so rather than
  // implying its meta reading rests on every event that happened.
  const tourDecks = decks.filter((d) => d.tour);
  // The claims, reported apart from the records because that is what they are. If this
  // number ever collapses, the titles changed shape and the parser stopped reading them.
  if (claimed.length){
    const placed = claimed.filter((d) => d.cp != null);
    const named = claimed.filter((d) => d.ce);
    console.log(`\n${claimed.length} lists claim a result in their own title ` +
      `(${placed.length} with a placing, ${named.length} naming an event), ` +
      `against ${tourDecks.length} upstream actually flags`);
    for (const d of claimed.slice().sort((a, b) => (a.cp ?? 999) - (b.cp ?? 999)).slice(0, 5))
      console.log(`  ${d.cp != null ? `#${String(d.cp).padStart(3)}` : "  -"}  ${d.ln || "?"} — ${(d.ce || "no event named").slice(0, 44)}`);
    const knownEvent = named.filter((d) => eventByName.has(d.ce)).length;
    console.log(`  ${knownEvent} of ${named.length} claimed events match a row in data/events.json, ` +
      `so the rest carry no field size and are never given one`);
  } else {
    console.log(`\nWARNING: no list claims a result in its title — the title parser reads nothing, ` +
      `which previously matched 50 of 475 lists and is the shape of an upstream rename`);
  }

  if (tourDecks.length){
    const sized = tourDecks.filter((d) => d.ec);
    const evs = new Set(tourDecks.map((d) => d.ev).filter(Boolean));
    console.log(`\n${tourDecks.length} tournament decks across ${evs.size} events` +
      `${eventByName.size ? `, ${sized.length} with an event size attached` : ""}`);
    if (eventByName.size && sized.length < tourDecks.length)
      console.log(`  WARNING: ${tourDecks.length - sized.length} tournament decks name an event ` +
        `that data/events.json does not list, so they carry no credibility weight`);
    if (eventByName.size){
      const missing = [...eventByName.values()].filter((e) => !evs.has(e.name));
      const biggest = missing.sort((a, b) => b.players - a.players).slice(0, 3);
      if (biggest.length)
        console.log(`  ${missing.length} of ${eventByName.size} known events contributed no lists; ` +
          `biggest: ${biggest.map((e) => `${e.name} (${e.players}p)`).join(", ")}`);
    }
  }

  // The guard for the mistake that prompted this rewrite: if the newest set is
  // barely present, the window or the source is wrong.
  const newestSet = (cat.sets || []).slice(-1)[0];
  const latest = Object.keys(sets).length
    ? Object.entries(sets).find(([s]) => s === (newestSet && newestSet.id)) : null;
  if (newestSet){
    const share = latest ? latest[1] / decks.length * 100 : 0;
    const line = `${newestSet.id} (${newestSet.name}) appears in ${share.toFixed(0)}% of kept decks`;
    console.log(`\n${share < 25 ? "WARNING: " : ""}${line}`);
    if (share < 25) console.log("  The newest set should be widely played. Check --days and the source mix.");
  }
  if (unknown.size)
    console.log(`\n${unknown.size} card codes not in the catalog: ` +
      [...unknown.entries()].slice(0, 10).map(([c, n]) => `${c} (x${n})`).join(", "));
  const noLegend = decks.filter((d) => !d.lg).length;
  if (noLegend) console.log(`\nWARNING: ${noLegend} decks have no identifiable Legend`);
};

main().catch((e) => {
  console.error("\nbuild-decks failed:", e.message);
  process.exit(1);
});
