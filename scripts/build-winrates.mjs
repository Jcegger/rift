#!/usr/bin/env node
// Regenerates data/winrates.json: legend-vs-legend win rates from RiftLite's community
// matchup matrix (riftlite.com/community/matrix), at its defaults: Radiance season, all
// formats, the latest 7,000 matches.
//
//   node scripts/build-winrates.mjs
//
// What the numbers are. RiftLite's players log their games automatically while playing
// online (TCGA, RiftAtlas) and may contribute them; nothing is scraped from Riot. So these
// are **online, user-submitted** matches: a different field from paper events, and a cell
// of 30 games is noise. Every pair keeps its game count so readers can say so.
//
// One request a day. robots.txt allows /community (it disallows only /meta-studio). The page
// is server-rendered and large (~20MB); each matrix cell carries its numbers in an
// aria-label: "Pooled for Kai'Sa: 48.1% vs Riven from 70 captures. Native pilot records: …".
// "Pooled" is the row legend's win rate against the column legend over every capture of the
// pairing, whichever side logged it. Legends are named by champion ("Kai'Sa"), with the
// legend's title only where a champion has two ("Master Yi, Wuju Bladesman"); they ship as
// RiftLite prints them and readers match them.
//
// Fails without writing if the parse comes up short, so the refresh keeps yesterday's file.

import { writeFile } from "node:fs/promises";

const PAGE = "https://www.riftlite.com/community/matrix";
const UA = "Mozilla/5.0 (rift.jayegger.com win-rate builder; +https://rift.jayegger.com)";
const OUT = new URL("../data/winrates.json", import.meta.url);
const MIN_PAIRS = 300;   // 21 Nov 2026: 2,064 cells with games. Far fewer means the page changed shape.

const unescape = (s) => s.replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

export function parseMatrix(html) {
  const page = unescape(html);
  const pairs = new Map();
  const re = /aria-label="Pooled for ([^:"]+): ([\d.]+)% vs ([^"]+?) from (\d+) captures?\./g;
  for (const m of page.matchAll(re)) {
    const [, a, wr, b, n] = m;
    pairs.set(`${a}\u0000${b}`, { a, b, wr: Number(wr), n: Number(n) });
  }
  const selected = [...page.matchAll(/<option[^>]*selected[^>]*>([^<]*)<\/option>/g)].map((m) => m[1].trim());
  return { pairs: [...pairs.values()], filters: selected.slice(0, 3) };
}

async function main() {
  const r = await fetch(PAGE, { headers: { "User-Agent": UA, "Accept-Language": "en-US" } });
  if (!r.ok) throw new Error(`${PAGE}: ${r.status} ${r.statusText}`);
  const { pairs, filters } = parseMatrix(await r.text());
  if (pairs.length < MIN_PAIRS) throw new Error(`only ${pairs.length} matrix cells parsed (expected ${MIN_PAIRS}+); page changed shape? Keeping the last file.`);
  if (!/radiance/i.test(filters[0] || "")) throw new Error(`the matrix's default season is "${filters[0]}", not Radiance; keeping the last file.`);
  pairs.sort((x, y) => x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
  const games = new Map();
  for (const p of pairs) games.set(p.a, (games.get(p.a) || 0) + p.n);
  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: PAGE,
    note: "RiftLite community matchup matrix: online matches (TCGA, RiftAtlas) logged by RiftLite users, not paper events. wr = row legend's win % vs the column legend over n games (pooled, either side's log). Small n is noise.",
    filters: { season: filters[0] || null, format: filters[1] || null, window: filters[2] || null },
    legends: [...games].map(([legend, n]) => ({ legend, games: n })).sort((x, y) => y.games - x.games),
    pairs,
  };
  await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`winrates: ${pairs.length} pairs, ${games.size} legends, filters ${Object.values(out.filters).join(" · ")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
