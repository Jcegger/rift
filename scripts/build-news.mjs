#!/usr/bin/env node
// Regenerates data/news.json: riftbound.gg's posts, tagged and dated.
//
//   node scripts/build-news.mjs [--pages 8]
//
// Source: api.dotgg.gg/cgfw/getposts. No key and no auth.
//
// Two things about this endpoint are worth knowing before touching it.
//
// It ignores `game`. Asking for riftbound returns the whole DotGG network: GTA 6,
// Path of Exile, Honkai, Marvel Snap, thirty-odd sites. Only a tenth of any page is
// ours, so the filter on `source` is doing the real work and the page count is set by
// how far back we want to reach rather than by how many posts we want.
//
// `post_content` is always empty. There is no body text to be had, only the title,
// the date, the tags and `post_name`, which is the full URL. That is enough for a
// feed that links out, and it is all this file claims to be.
//
// No champion matching happens here, deliberately. Resolving "Vex - Gloomist Guide"
// to a champion needs the same name fold the app uses, and a second copy of that
// logic is exactly the hazard the deck parser already warns about. The raw title
// ships and the app joins it against the live roster.

import { writeFile } from "node:fs/promises";

const API = "https://api.dotgg.gg/cgfw/getposts?game=riftbound";
const SOURCE = "riftbound.gg";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Their titles are HTML-escaped: "Best Decks &amp; Synergies".
const unescape = (s) => String(s ?? "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#8217;/g, "'")
  .replace(/&nbsp;/g, " ").replace(/&#8211;|&#8212;/g, "-")
  .replace(/&hellip;/g, "…").trim();

const day = (unix) => {
  const n = Number(unix);
  return Number.isFinite(n) && n > 0 ? new Date(n * 1000).toISOString().slice(0, 10) : null;
};

const tagsOf = (raw) => {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  try {
    const p = JSON.parse(raw || "[]");
    return Array.isArray(p) ? p.map((t) => String(t).trim()).filter(Boolean) : [];
  } catch { return []; }
};

const main = async () => {
  const pages = Math.max(1, arg("pages", 8));
  const posts = new Map();          // url -> post, deduped across pages
  let fetched = 0;

  for (let page = 1; page <= pages; page++) {
    process.stdout.write(`page ${page}… `);
    const r = await fetch(`${API}&page=${page}`, {
      headers: { "User-Agent": "rift.jayegger.com news builder", Origin: "https://riftbound.gg" },
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} on page ${page}`);
    const batch = await r.json();
    if (!Array.isArray(batch)) throw new Error("unexpected payload shape");
    if (!batch.length) { console.log("empty, stopping"); break; }
    fetched += batch.length;
    let kept = 0;
    for (const p of batch) {
      if (p.source !== SOURCE) continue;
      const url = p.post_name || null;
      const dt = day(p.post_date);
      const title = unescape(p.post_title);
      if (!url || !dt || !title) continue;
      if (!posts.has(url)) kept++;
      posts.set(url, {
        title, dt, url,
        tags: tagsOf(p.tags),
        author: p.author || null,
      });
    }
    console.log(`${batch.length} posts, ${kept} new from ${SOURCE}`);
    await sleep(300);
  }

  const list = [...posts.values()].sort((a, b) => b.dt.localeCompare(a.dt) || a.title.localeCompare(b.title));
  const byTag = {};
  for (const p of list) for (const t of (p.tags.length ? p.tags : ["Untagged"])) byTag[t] = (byTag[t] || 0) + 1;

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: `api.dotgg.gg/cgfw/getposts, filtered to ${SOURCE}`,
    note: "Titles only; the endpoint carries no body text. Champion matching is done in the app so the name fold is not duplicated.",
    pagesRead: pages,
    postsSeen: fetched,
    tags: byTag,
    posts: list,
  };
  await writeFile(new URL("../data/news.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");

  console.log(`\nkept ${list.length} ${SOURCE} posts out of ${fetched} seen` +
              ` (${(list.length / (fetched || 1) * 100).toFixed(1)}% of the network feed)`);
  console.log(`covering ${list[list.length - 1].dt} to ${list[0].dt}`);
  console.log("by tag:");
  for (const [t, n] of Object.entries(byTag).sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(n).padStart(3)}  ${t}`);
  console.log("\nmost recent:");
  for (const p of list.slice(0, 6))
    console.log(`  ${p.dt}  [${(p.tags[0] || "?").padEnd(9)}] ${p.title.slice(0, 66)}`);

  const untagged = list.filter((p) => !p.tags.length).length;
  if (untagged) console.log(`\nNOTE: ${untagged} posts carry no tag, so they land in the feed but no context panel.`);
  if (list.length < 20) console.log(`\nWARNING: only ${list.length} posts kept. Their feed may have changed shape, or --pages is too low.`);
};

main().catch((e) => {
  console.error("\nbuild-news failed:", e.message);
  process.exit(1);
});
