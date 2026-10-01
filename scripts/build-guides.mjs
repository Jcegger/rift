#!/usr/bin/env node
// Builds data/guides.json: the manifest of the deck dossiers in guides/.
//
//   node scripts/build-guides.mjs
//
// Fetches nothing. The .md files in guides/ stay the single source of truth —
// this only records what exists, so the app can list the guides without reading
// every file at boot. The app fetches the .md itself when a guide is opened.
//
// scripts/build-guide (no 's') is the other half: the same .md to a Word doc.

import { readdir, readFile, writeFile } from "node:fs/promises";

const GUIDES = new URL("../guides/", import.meta.url);
const ROOT = new URL("../", import.meta.url);
const OUT = new URL("../data/guides.json", import.meta.url);

/* Pages that belong on the same shelf but are not deck dossiers. A dossier is about
   one list; these are about the game, so they carry no legend or champion and the
   shelf would label them "Dossier" by default. `kicker` is what it says instead.
   Listed explicitly rather than globbed from docs/, because most of docs/ is reference
   material for this repo — the rules dumps, the FAQ — and has no business in the app. */
const EXTRA = [
  { file: "docs/fundamentals.md", kicker: "Reference · every deck" },
];

// The frontmatter is pandoc's, so read it rather than inventing a second one.
function frontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z-]+):\s*(.*)$/.exec(line);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const firstMatch = (src, re) => (re.exec(src) || [])[1]?.trim() || null;

const files = (await readdir(GUIDES)).filter((f) => f.endsWith(".md")).sort();
const entries = [
  ...files.map((f) => ({ path: `guides/${f}`, url: new URL(f, GUIDES), kicker: null })),
  ...EXTRA.map((e) => ({ path: e.file, url: new URL(e.file, ROOT), kicker: e.kicker })),
];
const guides = [];

for (const { path: file, url, kicker } of entries) {
  const src = await readFile(url, "utf8");
  const fm = frontmatter(src);
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  guides.push({
    slug: file.replace(/^.*\//, "").replace(/\.md$/, ""),
    file,
    kicker,
    title: fm.title || file,
    subtitle: fm.subtitle || null,
    date: fm.date || null,
    // Both live in the standee block at the top of every dossier.
    legend: firstMatch(body, /\*\*Legend:\*\*\s*([^(·\n]+)/),
    champion: firstMatch(body, /\*\*Champion:\*\*\s*([^·\n]+)/),
    // Section headings, so the app can render a table of contents without the body.
    sections: [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
    words: body.split(/\s+/).filter(Boolean).length,
  });
}

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source: "guides/*.md in this repo",
  note: "Manifest only. The app fetches the .md body on demand; the .md is the source of truth.",
  guides,
};

await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`data/guides.json: ${guides.length} guide(s)`);
for (const g of guides) console.log(`  ${g.slug} — ${g.sections.length} sections, ${g.words} words`);
