#!/usr/bin/env node
// Regenerates data/tiers.json: riftbound.gg's weekly meta tier list, per Legend.
//
//   node scripts/build-tiers.mjs
//
// Source: the HTML of https://riftbound.gg/tier-list/. There is no API for this one —
// it is a WordPress page — so this is a scrape, and a brittle one. It is worth it
// because a curated weekly Tier 1-5 list is the honest answer to "which decks are
// actually good", the thing this app otherwise refuses to invent a number for. The
// app crosses it with the collection on the Next tab; Meta shows it as-is, cited.
//
// The parse keys on two stable-ish shapes in their markup:
//
//   <p><strong>Tier N</strong></p>                     marks a tier
//   <figcaption class="wp-element-caption"><a href="GUIDE">Champion</a> …</figcaption>
//                                                       one Legend, in rank order
//
// Champions are named plainly (Kennen, Master Yi, Kai'Sa, Rek'Sai, Lee Sin), which is
// how the Legends tab names them too, so the join in the app is by champion. The one
// champion with two legends — Master Yi, Wuju Bladesman vs Wuju Master — is told apart
// by the epithet in its guide slug, so that is parsed out where a "-guide" URL carries
// it and left null otherwise.
//
// If the fetch or the parse comes up short the script exits non-zero and writes
// nothing, so a redesign of their page fails the daily job loudly instead of shipping
// an empty or half-read tier list. check.mjs asserts the file has a plausible legend
// count for the same reason.

import { writeFile } from "node:fs/promises";

const PAGE = "https://riftbound.gg/tier-list/";
const UA = "Mozilla/5.0 (rift.jayegger.com tier builder; +https://rift.jayegger.com)";
const MIN_LEGENDS = 20;   // the list has run ~50; well under this means the parse broke

const decode = (s) => String(s || "")
  .replace(/&#8217;|&#039;|&#39;/g, "'").replace(/&#8211;|&#8212;/g, "-")
  .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();

// "kennen-heart-of-the-tempest-guide" + champion "Kennen" -> "Heart of the Tempest".
// Only the "-guide" slugs carry an epithet; "-best-decks-cards", "-champion-spotlight-…"
// and "#anchor" links do not, and those return null.
function epithetFromGuide(url, champion) {
  const m = /riftbound\.gg\/([a-z0-9-]+)-guide\/?$/.exec(url || "");
  if (!m) return null;
  let slug = m[1];
  const champSlug = champion.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (slug.startsWith(champSlug + "-")) slug = slug.slice(champSlug.length + 1);
  else return null;
  if (!slug) return null;
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const main = async () => {
  process.stdout.write("fetching tier list… ");
  const r = await fetch(PAGE, { headers: { "User-Agent": UA, "Accept-Language": "en-US" } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${PAGE}`);
  let html = await r.text();
  html = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  console.log(`${(html.length / 1024).toFixed(0)}kb`);

  // Narrow to the tier list itself: from the first "Tier 1" marker to the tier
  // explanations that follow it. Everything above is nav and a table of contents that
  // repeats the same phrases.
  const start = html.search(/<strong>\s*Tier\s*1\s*<\/strong>/i);
  if (start < 0) throw new Error("no 'Tier 1' marker — page structure changed");
  const after = html.slice(start);
  const stop = after.search(/Tier\s+Explanations|<h2/i);
  const block = stop > 0 ? after.slice(0, stop) : after;

  const token = /<strong>\s*Tier\s*([0-9]+)\s*<\/strong>|<figcaption class="wp-element-caption">([\s\S]*?)<\/figcaption>/gi;
  const tiers = [];
  let tier = null, rank = 0, m;
  while ((m = token.exec(block))) {
    if (m[1]) { tier = Number(m[1]); rank = 0; continue; }
    if (tier == null) continue;
    const cap = m[2];
    const a = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(cap);
    const champion = decode((a ? a[2] : cap).replace(/<[^>]+>/g, "").replace(/[\u{1F000}-\u{1FAFF}←-⇿☀-➿]/gu, ""));
    if (!champion) continue;
    const guide = a ? a[1] : null;
    tiers.push({ champion, tier, rank: ++rank, guide, epithet: epithetFromGuide(guide, champion) });
  }

  if (tiers.length < MIN_LEGENDS) throw new Error(`only ${tiers.length} legends parsed (expected >= ${MIN_LEGENDS})`);

  // The set the list is for, and the most recent weekly report, both from the report
  // links on the page. Report slugs read
  // "riftbound-meta-tier-list-best-decks-for-<set>-week-<n>-report".
  let set = null, report = null, week = -1;
  for (const rm of html.matchAll(/href="(https:\/\/riftbound\.gg\/riftbound-meta-tier-list-best-decks-for-([a-z0-9-]+?)-week-(\d+)-report\/?)"/gi)) {
    const w = Number(rm[3]);
    if (w > week) { week = w; report = rm[1]; set = rm[2].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
  }
  if (!set) {
    const sm = /updated for [^.]*?Set\s*\d+\s*-\s*([A-Za-z]+)/i.exec(html);
    if (sm) set = sm[1];
  }

  const dupes = tiers.filter((t, i) => tiers.findIndex((x) => x.champion === t.champion) !== i)
                     .map((t) => t.champion);

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: PAGE,
    set: set || null,
    report: report || null,
    week: week >= 0 ? week : null,
    note: "riftbound.gg's curated weekly tier list, scraped from the page HTML. Tier 1 is best. " +
          "Ranks are within a tier. The app joins these to archetypes by champion; Master Yi has two legends and is split by the epithet in its guide slug.",
    tiers,
  };
  await writeFile(new URL("../data/tiers.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");

  const byTier = new Map();
  for (const t of tiers) byTier.set(t.tier, (byTier.get(t.tier) || 0) + 1);
  console.log(`\n${tiers.length} legends over ${byTier.size} tiers` +
              (set ? `, for ${set}${week >= 0 ? ` week ${week}` : ""}` : ""));
  for (const [k, n] of [...byTier].sort((a, b) => a[0] - b[0])) {
    const names = tiers.filter((t) => t.tier === k).map((t) => t.champion);
    console.log(`  Tier ${k}: ${n.toString().padStart(2)}  ${names.slice(0, 8).join(", ")}${names.length > 8 ? ", …" : ""}`);
  }
  if (dupes.length) console.log(`\nchampions in two tiers (expected for Master Yi): ${[...new Set(dupes)].join(", ")}`);
  const noGuide = tiers.filter((t) => !t.guide).map((t) => t.champion);
  if (noGuide.length) console.log(`no guide link: ${noGuide.join(", ")}`);
};

main().catch((e) => {
  console.error("\nbuild-tiers failed:", e.message);
  process.exit(1);
});
