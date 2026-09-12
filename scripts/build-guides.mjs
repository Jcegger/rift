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
const OUT = new URL("../data/guides.json", import.meta.url);

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
const guides = [];

for (const file of files) {
  const src = await readFile(new URL(file, GUIDES), "utf8");
  const fm = frontmatter(src);
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  guides.push({
    slug: file.replace(/\.md$/, ""),
    file: `guides/${file}`,
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
