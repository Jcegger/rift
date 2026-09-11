#!/usr/bin/env node
// Regenerates docs/rules-full.md and data/rules.json: the Riftbound rules, verbatim.
//
//   node scripts/build-rules.mjs           # rebuild only if Riot's date moved
//   node scripts/build-rules.mjs --force   # rebuild regardless
//
// Source: the Rules Hub at playriftbound.com/en-us/rules-hub/, which links the Core
// Rules and Tournament Rules PDFs and prints the date each was last updated. Those
// two facts have to come from the same place, because the PDF URLs are content
// hashes — every revision is a new URL, so a hardcoded link does not go stale, it
// goes *permanent*, silently serving the rules from a previous set forever. The hub
// page is the only thing that knows which hash is current.
//
// Why this reads PDFs at all. Riot publishes the rules as PDF and nothing else: no
// API, no HTML edition, no plain text. The alternative was a human retyping 2,381
// numbered rules every time a set lands, four times a year, which is not a process
// that survives contact with a Tuesday.
//
// The extractor is deliberately small, and it is small because these two files are a
// narrow case rather than the general one. Both are Google Docs exports: PDF 1.4,
// classic xref tables, no object streams, FlateDecode only, and every font Type0 /
// Identity-H carrying a ToUnicode CMap. So the whole job is: inflate the content
// stream, map glyph ids through ToUnicode, and put the glyphs back in reading order.
// It is not a PDF library and must not become one — if Riot ever changes publishing
// tools the honest failure is this script reporting zero rules, which it does, rather
// than a dependency quietly half-reading the new shape.
//
// Reading order is the only part that takes care. The text is laid out one glyph per
// `Td` inside per-word `BT` blocks, so content-stream order gives you the words but
// not the lines, and the page-level `1 0 0 -1 0 792 cm` flips the y axis. Hence the
// full CTM: compose the matrices, take the device position of each glyph, group by y,
// sort by x. Line breaks then fall out of the geometry instead of being guessed.
//
// Verified against pypdf over both documents: identical text for all 2,381 rules,
// plus two rules pypdf ran onto one line that the geometry here separates correctly.

import { writeFile, readFile, rename } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HUB = "https://playriftbound.com/en-us/rules-hub/";
// The Rules Hub links the two PDFs and nothing else. The FAQs — which outrank the Core
// Rules — live only under news, so a second index has to be read or they are invisible.
const NEWS = "https://playriftbound.com/en-us/news/rules-and-releases/";
const UA = "rift.jayegger.com rules builder";

/* ── the hub page: which PDFs are current, and how Riot dates them ───────── */

const MONTHS = ["january","february","march","april","may","june","july",
                "august","september","october","november","december"];

// "(last updated: July 16, 2026)" -> "2026-07-16". Date-only, like every other
// generatedAt in data/, so a same-day rerun is a no-op rather than a commit.
function isoDate(s) {
  const m = /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/.exec(s || "");
  if (!m) return null;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  if (mo < 0) return null;
  return `${m[3]}-${String(mo + 1).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
}

async function hubDocs() {
  const r = await fetch(HUB, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`rules hub ${r.status} ${r.statusText}`);
  // The page ships the same markup twice, once server-rendered and once inside the
  // Next.js payload with the angle brackets escaped. Unescaping first means one
  // regex covers both, and deduping on URL means the double copy costs nothing.
  const html = (await r.text())
    .replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"');
  const out = new Map();
  const re = /<a[^>]+href="(https:\/\/[^"]+\.pdf)"[^>]*>([^<]+)<\/a>\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(html))) {
    const [, url, label, paren] = m;
    const key = /tournament/i.test(label) ? "tournament" : /core/i.test(label) ? "core" : null;
    if (!key || out.has(key)) continue;
    out.set(key, { key, title: label.trim(), url, updated: isoDate(paren) });
  }
  for (const k of ["core", "tournament"]) {
    const d = out.get(k);
    if (!d) throw new Error(`rules hub no longer links a ${k} rules PDF`);
    if (!d.updated) throw new Error(`rules hub gave no "last updated" date for the ${d.title}`);
  }
  return [out.get("core"), out.get("tournament")];
}

/* ── the PDF, as far as text ─────────────────────────────────────────────── */

function pdf(buf) {
  const s = buf.toString("latin1");
  const objs = new Map();
  const re = /(\d+)\s+0\s+obj\b/g;
  let m;
  while ((m = re.exec(s))) {
    const a = re.lastIndex, b = s.indexOf("endobj", a);
    if (b > 0) objs.set(Number(m[1]), [a, b]);
  }
  const body = (n) => { const o = objs.get(n); return o ? s.slice(o[0], o[1]) : ""; };

  function stream(n) {
    const o = objs.get(n);
    if (!o) return null;
    const b = s.slice(o[0], o[1]);
    const i = b.indexOf("stream");
    if (i < 0) return null;
    let j = i + 6;
    if (b[j] === "\r") j++;
    if (b[j] === "\n") j++;
    const k = b.lastIndexOf("endstream");
    const raw = buf.subarray(o[0] + j, o[0] + (k < 0 ? b.length : k));
    if (!/\/FlateDecode/.test(b.slice(0, i))) return raw;
    try { return inflateSync(raw); } catch { return null; }
  }

  // Page order comes from the /Pages tree. Object number happens to match it in both
  // of today's files, which is exactly the kind of coincidence that reorders the
  // rulebook one revision from now without anyone noticing.
  const pages = [];
  const walk = (n, seen) => {
    if (seen.has(n)) return;
    seen.add(n);
    const b = body(n);
    if (/\/Type\s*\/Page[^s]/.test(b)) { pages.push(n); return; }
    const kids = /\/Kids\s*\[([^\]]*)\]/.exec(b);
    if (!kids) return;
    for (const k of kids[1].matchAll(/(\d+)\s+0\s+R/g)) walk(Number(k[1]), seen);
  };
  for (const [n] of objs) {
    const b = body(n);
    if (/\/Type\s*\/Pages\b/.test(b) && !/\/Parent\b/.test(b)) { walk(n, new Set()); break; }
  }
  if (!pages.length) for (const [n, o] of objs)
    if (/\/Type\s*\/Page[^s]/.test(s.slice(o[0], o[1]))) pages.push(n);

  const cmaps = new Map();
  const utf16 = (h) => {
    let o = "";
    for (let i = 0; i + 4 <= h.length; i += 4) o += String.fromCharCode(parseInt(h.slice(i, i + 4), 16));
    return o;
  };
  function cmapOf(fn) {
    if (cmaps.has(fn)) return cmaps.get(fn);
    const map = new Map();
    const tu = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(body(fn));
    const cs = tu && stream(Number(tu[1]));
    if (cs) {
      const t = cs.toString("latin1");
      for (const blk of t.match(/beginbfchar([\s\S]*?)endbfchar/g) || [])
        for (const x of blk.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g))
          map.set(parseInt(x[1], 16), utf16(x[2]));
      for (const blk of t.match(/beginbfrange([\s\S]*?)endbfrange/g) || [])
        for (const x of blk.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
          const lo = parseInt(x[1], 16), hi = parseInt(x[2], 16), d = parseInt(x[3], 16);
          for (let c = lo; c <= hi && c - lo < 65536; c++) map.set(c, String.fromCharCode(d + (c - lo)));
        }
    }
    cmaps.set(fn, map);
    return map;
  }

  const mul = (a, b) => [
    a[0]*b[0] + a[1]*b[2], a[0]*b[1] + a[1]*b[3],
    a[2]*b[0] + a[3]*b[2], a[2]*b[1] + a[3]*b[3],
    a[4]*b[0] + a[5]*b[2] + b[4], a[4]*b[1] + a[5]*b[3] + b[5],
  ];
  const N = "[-\\d.]+";
  const TOK = new RegExp(
    `(q)\\b|(Q)\\b|(${N})\\s+(${N})\\s+(${N})\\s+(${N})\\s+(${N})\\s+(${N})\\s+(cm|Tm)\\b` +
    `|\\/(F\\d+)\\s+(${N})\\s+Tf|(${N})\\s+(${N})\\s+(?:Td|TD)\\b|(T\\*)|(BT)\\b` +
    `|<([0-9A-Fa-f]*)>\\s*Tj|\\[([^\\]]*)\\]\\s*TJ`, "g");

  function pageLines(pn) {
    const d = body(pn);
    const fonts = new Map();
    for (const f of d.matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g)) fonts.set(f[1], Number(f[2]));
    const cs = /\/Contents\s+(?:(\d+)\s+0\s+R|\[([^\]]*)\])/.exec(d);
    if (!cs) return [];
    const nums = cs[1] ? [Number(cs[1])] : [...cs[2].matchAll(/(\d+)\s+0\s+R/g)].map((x) => Number(x[1]));
    const parts = nums.map(stream).filter(Boolean);
    if (!parts.length) return [];
    const t = Buffer.concat(parts).toString("latin1");

    let ctm = [1, 0, 0, 1, 0, 0], tm = ctm, tlm = ctm, cm = null, size = 1;
    const stack = [], glyphs = [];
    let m;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(t))) {
      if (m[1]) { stack.push(ctm); continue; }
      if (m[2]) { ctm = stack.pop() || ctm; continue; }
      if (m[9]) {
        const v = m.slice(3, 9).map(Number);
        if (m[9] === "cm") ctm = mul(v, ctm); else { tm = v; tlm = v; }
        continue;
      }
      if (m[10]) { cm = cmapOf(fonts.get(m[10])); size = Number(m[11]); continue; }
      if (m[12] !== undefined) { tlm = mul([1, 0, 0, 1, Number(m[12]), Number(m[13])], tlm); tm = tlm; continue; }
      if (m[14]) { tlm = mul([1, 0, 0, 1, 0, -size], tlm); tm = tlm; continue; }
      if (m[15]) { tm = [1, 0, 0, 1, 0, 0]; tlm = tm; continue; }
      const hexes = m[16] !== undefined ? [m[16]] : [...m[17].matchAll(/<([0-9A-Fa-f]*)>/g)].map((x) => x[1]);
      let txt = "";
      for (const h of hexes)
        for (let i = 0; i + 4 <= h.length; i += 4) txt += cm?.get(parseInt(h.slice(i, i + 4), 16)) ?? "";
      if (txt) { const dev = mul(tm, ctm); glyphs.push({ x: dev[4], y: dev[5], t: txt }); }
    }
    // Group by device y (2pt buckets, well under the ~15pt leading), then left to
    // right. The page flip means larger y is higher up the page, hence descending.
    const rows = new Map();
    for (const g of glyphs) {
      const k = Math.round(g.y / 2);
      (rows.get(k) || rows.set(k, []).get(k)).push(g);
    }
    return [...rows.entries()].sort((a, b) => b[0] - a[0])
      .map(([, gs]) => gs.sort((a, b) => a.x - b.x).map((g) => g.t).join("").replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }

  return { pages: pages.length, lines: pages.flatMap(pageLines) };
}

/* ── lines back into rules ───────────────────────────────────────────────── */

// A rule number is three digits, then any number of .1 / .a / .1 parts, then a dot:
// 807, 807.1, 807.1.b, 807.1.b.2. Only ever at the start of a line, which is why the
// geometry above has to be right — reflowing on the numbers alone would split every
// "See rule 318. Cleanups" cross-reference into a phantom rule.
const RULE = /^(\d{3}(?:\.\d+|\.[a-z])*)\.\s*(.*)$/;

// Riot's PDF sets fi/fl as single ligature glyphs, so the ToUnicode map hands back
// "battleﬁeld" and "Deﬂect" — one codepoint, not two. That is a property of the font
// and not of the wording, and leaving it in makes the verbatim file unsearchable for
// the exact words people type: `grep Deflect` finds nothing across 72 cards' worth of
// keyword. Folding the ligatures back out is the one edit made to Riot's text.
const LIGATURES = { "\uFB00": "ff", "\uFB01": "fi", "\uFB02": "fl", "\uFB03": "ffi", "\uFB04": "ffl", "\uFB05": "st", "\uFB06": "st" };
const unligature = (s) => s.replace(/[\uFB00-\uFB06]/g, (c) => LIGATURES[c] || c);

function toRules(lines) {
  const out = [];
  for (const raw of lines) {
    const line = unligature(raw).replace(/\s+/g, " ").trim();
    if (!line) continue;
    const m = RULE.exec(line);
    if (m) out.push({ n: m[1], text: m[2] });
    else if (out.length) out[out.length - 1].text += " " + line;   // a wrapped line
    // anything before the first rule is the cover block, and is dropped
  }
  for (const r of out) r.text = r.text.replace(/\s+/g, " ").trim();
  return out;
}

// A heading is a rule whose text is a bare title: no sentence in it, no terminal
// period. That is how the document distinguishes "800. Keywords" from "801. A
// Keyword is a specific term…", and it is the only structure the PDF gives us.
const isHeading = (r) => r.text.length <= 60 && /^[A-Z(“"]/.test(r.text) &&
                         !/[.:;]\s*$/.test(r.text) && !/\d/.test(r.text) &&
                         !/\b(is|are|a|an|the|may|must|can|will)\b/.test(r.text);

const depth = (n) => n.split(".").length;

/* ── supplements: the FAQs, which outrank the PDFs ───────────────────────── */

// Riot publishes a rules FAQ per set, and the Vendetta one says in as many words:
// "In places where the FAQ differs from the Core Rules Document, the FAQ takes
// precedence. When a new Core Rules Document is released, it will take precedence."
// So the newest of the two wins, and right now that is the FAQ — it is dated
// 2026-08-14 against the Core Rules' 2026-07-16.
//
// None of them are linked from the Rules Hub. They are news articles, which is exactly
// why the first version of this builder never saw them: it watched the hub, the hub
// watches the PDFs, and a whole tier of binding rulings sat outside the system. Hence
// reading the news index too, and hence discovering by pattern rather than by a
// hardcoded list — the next set's FAQ should appear on its own.

const ARTICLE = /\/en-us\/news\/[a-z0-9-]+\/([a-z0-9-]*(?:faq|errata|clarifications|patch-notes)[a-z0-9-]*)\/?/g;

const kindOf = (slug) =>
  /errata/.test(slug) ? "errata" : /faq|clarification/.test(slug) ? "faq" : "patch-notes";

// Both index pages ship the same markup twice, once rendered and once inside the
// Next.js payload with the brackets escaped. Unescaping first means one pass covers
// both, and deduping on the slug means the doubling costs nothing.
export const unescapeHtml = (h) => h
  .replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&")
  .replace(/\\"/g, '"').replace(/\\\//g, "/");

async function discoverSupplements() {
  const found = new Map();
  for (const idx of [NEWS, HUB]) {
    let html;
    try {
      const r = await fetch(idx, { headers: { "User-Agent": UA } });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      html = unescapeHtml(await r.text());
    } catch (e) {
      console.log(`  ! could not read ${idx}: ${e.message}`);
      continue;
    }
    for (const m of html.matchAll(ARTICLE)) {
      const slug = m[1];
      if (found.has(slug)) continue;
      // The news index IS the rules-and-releases section, so anything matching there is
      // rules content. The hub is a marketing page that happens to link the two PDFs,
      // and it also links things like a product-drawing FAQ — so from the hub, a bare
      // "faq" is not enough; it has to name rules, errata, patch notes or clarifications.
      if (idx === HUB && !/rules|errata|clarification|patch-notes/.test(slug)) continue;
      const path = m[0].replace(/\/$/, "");
      found.set(slug, {
        slug, kind: kindOf(slug),
        url: path.startsWith("http") ? path : `https://playriftbound.com${path}`,
      });
    }
  }
  return [...found.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.slug.localeCompare(b.slug));
}

// Dating from the index turned out to be wrong — the listing's payload interleaves
// cards, so proximity matching handed the Unleashed FAQ the Vendetta FAQ's date. The
// article's own page is unambiguous: find the publishDate nearest to the article's own
// slug, which the page repeats around its canonical link.
//
// The hash matters more than the date. A page edited in place keeps its publishDate,
// and a ruling that changes silently is exactly the failure this whole exercise is
// about, so what gets compared between runs is the text itself.
async function loadSupplement(doc) {
  const r = await fetch(doc.url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${doc.slug} ${r.status} ${r.statusText}`);
  const raw = await r.text();
  const html = unescapeHtml(raw);
  let published = null;
  for (const m of html.matchAll(new RegExp(doc.slug, "g"))) {
    // Forward only. A backward window can return the PRECEDING article's date, which
    // is exactly how the index-level dating went wrong before.
    const w = html.slice(m.index, m.index + 2000);
    const d = /"publish(?:ed)?(?:At|Date)":"(\d{4}-\d{2}-\d{2})/.exec(w);
    if (d) { published = d[1]; break; }
  }
  const text = articleText(raw);
  if (!text || text.length < 400)
    throw new Error(`${doc.slug}: article body not found (the page's shape has changed)`);
  // The Origins FAQ once came out as 97 headings and no answers. Headings without
  // bodies are the signature of content this extractor cannot see, so refuse to write
  // it rather than ship a file that looks complete.
  const ls = text.split("\n").filter(Boolean);
  const heads = ls.filter((l) => /^#{2,4} /.test(l)).length;
  if (heads > 4 && heads / ls.length > 0.5)
    throw new Error(`${doc.slug}: ${heads} of ${ls.length} lines are headings — answers ` +
      `are neither in the DOM nor recoverable from the payload`);
  return { ...doc, published, text, chars: text.length,
           sha: createHash("sha256").update(text).digest("hex").slice(0, 12) };
}

// The article body sits in one container, which is the only stable handle on these
// pages — everything around it is navigation and related-article furniture.
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " ",
                   rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201c", rdquo: "\u201d",
                   mdash: "\u2014", ndash: "\u2013", hellip: "\u2026" };
const decode = (t) => t
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, e) => ENTITIES[e.toLowerCase()] ?? m)
  .replace(/\s+/g, " ").trim();

// Decode a JSON string body: < and friends, plus the usual escapes.
const fromJson = (t) => t
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\//g, "/").replace(/\\\\/g, "\\");

// Some of these pages are accordions, and that broke the first version badly. Riot's
// Origins FAQ is 97 collapsed question/answer pairs whose served DOM contains the
// questions with *empty* answer containers — the answers exist only in the page's JSON
// payload. A DOM-only pass produced a 16KB file of 97 bare headings and no rulings, and
// nothing noticed, because the output was long and looked structured. Confidently
// wrong, silently: the exact failure mode this repo keeps having to design against.
//
// So the payload is read as well and answers are stitched back under their question.
function accordionAnswers(raw) {
  const out = new Map();
  // Match the RAW payload. Decoding first would turn \" into " and destroy the very
  // string boundaries this pattern relies on — which is how the first attempt silently
  // recovered nothing and shrank the file instead of filling it.
  const re = /"label":"((?:[^"\\]|\\.)*?)","content":\{"type":"html","body":"((?:[^"\\]|\\.)*?)"\}/g;
  for (const m of raw.matchAll(re)) {
    const label = decode(fromJson(m[1]).replace(/<[^>]+>/g, " "));
    const body = fromJson(m[2])
      .replace(/<\/(p|li|h\d)>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " ")
      .split("\n").map(decode).filter(Boolean);
    if (label && body.length) out.set(label, body);
  }
  return out;
}

export function articleText(raw) {
  const html = unescapeHtml(raw);
  const answers = accordionAnswers(raw);
  // Start at the article's rich-text container and run to the end of the document.
  //
  // This looks lazy and I tried to fix it twice; both attempts lost real content. The
  // page's section headings and its appendix sit BETWEEN sections rather than inside the
  // rich-text container, so bounding each container at its own </section> silently drops
  // about sixty headings and relocates the appendix. Filtering to ArticleRichTextBlade
  // sections does the same. Running to the end and stopping at furniture is what
  // actually reproduces the page.
  //
  // The stop list below is therefore load-bearing, not a nicety: it is the only thing
  // between this and the related-articles carousel at the foot of every page. Verified
  // against all four live pages — no navigation, no carousel, no captions.
  const key = 'data-testid="rich-text-html"';
  const i = html.indexOf(key);
  if (i < 0) {
    // A pure accordion page has no rich-text body at all; its content is all payload.
    if (!answers.size) return null;
    const only = [];
    for (const [q, body] of answers) only.push(`\n#### ${q}`, ...body);
    return only.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  const body = html.slice(i);
  const out = [];
  // th/td are in the list because the Unleashed FAQ quotes Core Rules text inside
  // two-column tables; without them 20 rule quotations vanished with no visible damage.
  for (const m of body.matchAll(/<(h1|h2|h3|h4|p|li|th|td)\b[^>]*>([\s\S]*?)<\/\1>|<hr\b[^>]*>/gi)) {
    if (!m[1]) { out.push("---"); continue; }
    const tag = m[1].toLowerCase();
    const strong = /^\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*$/i.exec(m[2]);
    // Inner tags become a SPACE, not nothing. The non-greedy match lets a nested <li>
    // close its parent, and deleting the tags outright welded two bullets into one
    // sentence in the committed file: `…"one power of this card's domain"[C] in
    // Accelerate costs…` was two separate rules glued together. <br> did the same.
    const txt = decode((strong ? strong[1] : m[2]).replace(/<[^>]+>/g, " "));
    if (!txt) continue;
    if (tag === "h1") out.push(`\n## ${txt}`);
    else if (tag === "h2") out.push(`\n### ${txt}`);
    else if (tag === "h3" || tag === "h4") out.push(`\n#### ${txt}`);
    else if (tag === "li") out.push(`- ${txt}`);
    else out.push(strong ? `**${txt}**` : txt);
    // A collapsed question keeps its answer in the payload, not the DOM.
    const ans = answers.get(txt);
    if (ans) { out.push(...ans); answers.delete(txt); }
    // Furniture follows the body; stop at the first sign of it. One exact string was
    // too thin a net — it appears on none of the four pages today, so nothing was
    // actually stopping the crawl but luck about which tags the footer uses.
    if (FURNITURE.test(txt)) { out.pop(); break; }
  }
  // Anything the DOM never mentioned still has to reach the file.
  for (const [q, ans] of answers) out.push(`\n#### ${q}`, ...ans);
  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Not every FAQ claims the same authority, and asserting a blanket "these outrank the
// Core Rules" would be the same over-reach this file keeps having to correct. Only the
// Vendetta FAQ states the precedence rule; only the Origins one carries Riot's
// "may no longer reflect Riftbound's rules" banner. So the status is read out of each
// document rather than asserted over all of them, and a future set's FAQ will be
// labelled by whatever it actually says.
// Headings that mean the article is over and the page's chrome has begun.
const FURNITURE = /^(Related Articles|More Articles|You might also like|Recommended|Read More|Latest News|Share this article|Sign Up|Newsletter)$/i;

const SUPERSEDED = /may no longer reflect/i;
const PRECEDENCE = /the FAQ takes precedence/i;
const statusOf = (d) => SUPERSEDED.test(d.text) ? "superseded by Riot's own banner"
  : PRECEDENCE.test(d.text) ? "claims precedence over the Core Rules"
  : "no stated precedence";

function faqMarkdown(docs) {
  const ranked = [...docs].sort((a, b) => (b.published || "").localeCompare(a.published || ""));
  const current = ranked.find((d) => PRECEDENCE.test(d.text));
  const L = ["# Riftbound rules FAQs, verbatim", "",
    "Riot's per-set rules FAQs, generated by `scripts/build-rules.mjs`. They are binding",
    "rulings, they are **not** linked from Riot's Rules Hub — they are news articles — and",
    "they do not all carry the same authority, so read the status on each.", ""];
  if (current)
    L.push(`**${current.slug}** (${current.published}) states: *"In places where the FAQ differs`,
           `from the Core Rules Document, the FAQ takes precedence. When a new Core Rules Document`,
           `is released, it will take precedence over any points that differ from this document."*`,
           "",
           `So compare that date against the Core Rules date in [rules-full.md](rules-full.md):`,
           `whichever is newer wins. Older FAQs are historical unless they say otherwise.`, "");
  for (const d of ranked)
    L.push(`- **${d.slug}** — ${d.published || "date unknown"} · ${statusOf(d)} · [source](${d.url})`);
  for (const d of ranked) {
    L.push("", "---", "", `# ${d.slug}`, "",
           `*Published ${d.published || "date unknown"} — ${statusOf(d)}. [Source](${d.url}).*`,
           "", d.text);
  }
  return L.join("\n") + "\n";
}

/* ── the markdown ────────────────────────────────────────────────────────── */

function markdown(docs) {
  const L = [];
  L.push("# Riftbound rules, verbatim");
  L.push("");
  L.push("Generated by `scripts/build-rules.mjs` from the PDFs linked on Riot's");
  L.push("[Rules Hub](" + HUB + "). Every rule below is Riot's own wording, unedited — this file is");
  L.push("the text that the rule numbers in [rules.md](rules.md) resolve against, and the thing to");
  L.push("grep when a ruling is contested. Do not hand-edit it; rerun the builder.");
  L.push("");
  for (const d of docs) L.push(`- **${d.title}** — last updated ${d.updated}, ${d.rules.length} rules over ${d.pages} pages`);
  L.push("");
  for (const d of docs) {
    L.push("");
    L.push(`# ${d.title}`);
    L.push("");
    L.push(`*Riot Games, last updated ${d.updated}. [Source PDF](${d.url}).*`);
    L.push("");
    for (const r of d.rules) {
      if (isHeading(r) && depth(r.n) === 1) { L.push(""); L.push(`## ${r.n}. ${r.text}`); L.push(""); }
      else if (isHeading(r)) { L.push(""); L.push(`### ${r.n}. ${r.text}`); L.push(""); }
      else L.push(`${"  ".repeat(depth(r.n) - 1)}- **${r.n}.** ${r.text}`);
    }
  }
  L.push("");
  return L.join("\n");
}

/* ── the index the app and check.mjs read ────────────────────────────────── */

function index(docs) {
  const sections = [], terms = {};
  for (const d of docs)
    for (const r of d.rules)
      if (isHeading(r) && depth(r.n) <= 2) sections.push({ doc: d.key, n: r.n, title: r.text });

  // Every bracketed term a card can print resolves to a rule, but not to the same
  // kind of rule: [Assault 2] is a keyword from the glossary at 800, [Predict 2] is
  // a game action from 412, and the cards themselves format the two identically.
  // Recording which is which is the only way to answer "what does this bracket mean"
  // without a human knowing the answer already.
  const core = docs.find((d) => d.key === "core");
  const glossary = core.rules.findIndex((r) => /^Keyword Glossary$/i.test(r.text));
  if (glossary >= 0)
    for (const r of core.rules.slice(glossary + 1))
      if (depth(r.n) === 1 && isHeading(r)) terms[r.text] = { rule: r.n, kind: "keyword" };

  const actions = core.rules.findIndex((r) => /^Types of Actions$/i.test(r.text));
  if (actions >= 0)
    for (const r of core.rules.slice(actions + 1)) {
      if (depth(r.n) === 1 && !isHeading(r)) break;
      if (depth(r.n) === 1 && isHeading(r) && !terms[r.text]) terms[r.text] = { rule: r.n, kind: "action" };
    }
  // Mighty is neither: it is a unit state defined in the 700s, and it prints in
  // brackets on cards exactly like a keyword does.
  for (const r of core.rules)
    if (depth(r.n) === 1 && isHeading(r) && !terms[r.text] && /^(Mighty|Buff|Attachment|Inactive|XP)$/.test(r.text))
      terms[r.text] = { rule: r.n, kind: "other" };

  return { sections, terms };
}

/* ── the report ──────────────────────────────────────────────────────────── */

// The builder's job is not finished when it writes a file, it is finished when it has
// said what moved. A set landing renames nothing and adds keywords, so the two things
// worth shouting about are a keyword that appeared and a bracket on a card that
// resolves to no rule at all.
async function crossCheck(terms) {
  let cards;
  try { cards = JSON.parse(await readFile(join(ROOT, "data/cards.json"), "utf8")); }
  catch { return null; }
  const seen = new Map();
  for (const c of cards.cards || [])
    for (const b of String(c.x || "").matchAll(/\[([A-Za-z][A-Za-z'\- ]*?)(?:\s+[0-9X]+)?\]/g)) {
      const k = b[1].trim();
      seen.set(k, (seen.get(k) || 0) + 1);
    }
  const known = new Map(Object.keys(terms).map((k) => [k.toLowerCase(), k]));
  const unknown = [...seen].filter(([k]) => !known.has(k.toLowerCase()) && k.toUpperCase() !== k);
  return { pool: seen, unknown, at: cards.generatedAt };
}

/* ── writing ─────────────────────────────────────────────────────────────── */

// The house rule is that a builder writes its output in one go at the end, so a failure
// leaves the previous file byte-identical. This one produces three files, and writeFile
// truncates before it writes — so a crash mid-way would leave a truncated file, not the
// old one. Writing to temporaries and renaming keeps that promise: rename is atomic, so
// each file is either entirely the old one or entirely the new one, and the three swaps
// happen after all the fetching, parsing and verification is done.
async function writeAll(files) {
  const staged = [];
  for (const [path, body] of files) {
    const tmp = `${path}.tmp`;
    await writeFile(tmp, body);
    staged.push([tmp, path]);
  }
  for (const [tmp, path] of staged) await rename(tmp, path);
}

/* ── main ────────────────────────────────────────────────────────────────── */

const main = async () => {
  const force = process.argv.includes("--force");
  process.stdout.write("reading the rules hub… ");
  const found = await hubDocs();
  console.log(found.map((d) => `${d.title} ${d.updated}`).join(", "));

  let prev = null;
  try { prev = JSON.parse(await readFile(join(ROOT, "data/rules.json"), "utf8")); } catch { /* first run */ }
  // Compare the URL as well as the date. The URLs are content hashes, so a re-export
  // under a new hash with the printed date unchanged would otherwise pin us to the old
  // PDF forever — which is the failure this file's header is about.
  const moved = !prev || found.some((d) => prev.docs?.[d.key]?.updated !== d.updated
                                        || prev.docs?.[d.key]?.url !== d.url);
  if (prev && moved)
    for (const d of found)
      if (prev.docs?.[d.key]?.updated !== d.updated)
        console.log(`  ${d.title}: ${prev.docs?.[d.key]?.updated || "(new)"} -> ${d.updated}`);

  // The supplements move on their own schedule — the Vendetta FAQ landed a month after
  // the Core Rules it overrides — so they are checked on every run regardless of
  // whether the PDFs moved. This is the part the first version of the builder lacked.
  process.stdout.write("reading the news index… ");
  const listed = await discoverSupplements();
  console.log(`${listed.length} supplement pages`);

  // Every page is fetched every run, because the hash is the point: a ruling edited in
  // place keeps its publishDate, and that is precisely the change worth catching. It is
  // ~13 page loads, which is a fair price for not trusting a date field.
  // A single 404 must not abort the rules rebuild: the PDFs are the load-bearing half
  // and a supplement that vanishes is news, not a crash. Carry the previous copy and
  // say so, in the same graded-failure spirit as the workflow.
  const supp = [];
  for (const d of listed) {
    process.stdout.write(`  ${d.slug}… `);
    try {
      const full = await loadSupplement(d);
      console.log(`${full.published || "undated"}, ${(full.chars / 1024).toFixed(0)}KB`);
      supp.push(full);
    } catch (e) {
      const kept = (prev?.supplements || []).find((x) => x.slug === d.slug);
      console.log(`FAILED — ${e.message}`);
      if (kept) supp.push({ ...kept, text: "" });
      else console.log(`    (never fetched before, so it is simply absent)`);
    }
  }

  const known = new Map((prev?.supplements || []).map((d) => [d.slug, d]));
  const appeared = supp.filter((d) => !known.has(d.slug));
  const edited = supp.filter((d) => known.has(d.slug) && known.get(d.slug).sha !== d.sha);
  const vanished = [...known.keys()].filter((k) => !supp.some((d) => d.slug === k));
  for (const d of appeared) console.log(`  NEW SUPPLEMENT  ${d.slug} (${d.kind}, ${d.published || "undated"})`);
  for (const d of edited) console.log(`  TEXT CHANGED    ${d.slug} — the page was edited in place`);
  for (const k of vanished) console.log(`  GONE            ${k} — Riot removed or renamed this page`);

  const suppMoved = !prev?.supplements || appeared.length || edited.length || vanished.length;
  if (!moved && !suppMoved && !force) {
    console.log(`\nunchanged since ${prev.generatedAt} — nothing to rebuild (pass --force to rebuild anyway)`);
    return;
  }

  // FAQs are kept in full because they are binding text. Errata and patch notes are
  // tracked and hashed here but parsed by build-errata.mjs, which owns the card data.
  const faqs = supp.filter((d) => d.kind === "faq");

  // If only the supplements moved, the PDFs on disk are still correct: carry their
  // stamp forward rather than pulling 57MB to reproduce a byte-identical file.
  if (!moved && !force) {
    const stamp = { ...prev, generatedAt: new Date().toISOString().slice(0, 10),
                    supplements: supp.map(({ text, ...d }) => d) };
    await writeAll([
      [join(ROOT, "docs/rules-faq.md"), faqMarkdown(faqs)],
      [join(ROOT, "data/rules.json"), JSON.stringify(stamp, null, 1) + "\n"],
    ]);
    console.log(`\ndocs/rules-faq.md   ${faqs.length} FAQs, ${supp.length} supplements tracked`);
    console.log(`the PDFs did not move, so docs/rules-full.md is unchanged`);
    if (appeared.length || edited.length)
      console.log(`\nA supplement moved. The FAQs OUTRANK the Core Rules — docs/rules.md is ` +
                  `hand-written and does NOT rebuild itself; read the new text and bring it up to date.`);
    return;
  }

  const docs = [];
  for (const d of found) {
    process.stdout.write(`fetching ${d.title}… `);
    const r = await fetch(d.url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`${d.title} ${r.status} ${r.statusText}`);
    const buf = Buffer.from(await r.arrayBuffer());
    const { pages, lines } = pdf(buf);
    const rules = toRules(lines);
    if (!rules.length) throw new Error(
      `${d.title}: no numbered rules found in ${pages} pages. The PDF's shape has changed ` +
      `and this extractor no longer reads it — see the header of this file.`);
    console.log(`${(buf.length / 1048576).toFixed(1)}MB, ${pages} pages, ${rules.length} rules`);
    docs.push({ ...d, pages, rules });
  }

  const { sections, terms } = index(docs);
  const cross = await crossCheck(terms);

  const stamp = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: HUB,
    docs: Object.fromEntries(docs.map((d) => [d.key, {
      title: d.title, updated: d.updated, url: d.url, pages: d.pages, rules: d.rules.length,
    }])),
    sections,
    terms,
    supplements: supp.map(({ text, ...d }) => d),
  };

  await writeAll([
    [join(ROOT, "docs/rules-full.md"), markdown(docs)],
    [join(ROOT, "docs/rules-faq.md"), faqMarkdown(faqs)],
    [join(ROOT, "data/rules.json"), JSON.stringify(stamp, null, 1) + "\n"],
  ]);

  console.log(`\ndocs/rules-full.md  ${docs.reduce((a, d) => a + d.rules.length, 0)} rules, ${sections.length} sections`);
  console.log(`docs/rules-faq.md   ${faqs.length} FAQs, ${supp.length} supplements tracked`);
  console.log(`data/rules.json     ${Object.keys(terms).length} bracketable terms ` +
              `(${Object.values(terms).filter((t) => t.kind === "keyword").length} keywords, ` +
              `${Object.values(terms).filter((t) => t.kind === "action").length} actions)`);

  if (appeared.length || edited.length)
    console.log(`\nA supplement moved. The FAQs OUTRANK the Core Rules until a newer Core ` +
                `Rules Document is published — read the new text before trusting docs/rules.md.`);

  if (prev?.terms) {
    const added = Object.keys(terms).filter((k) => !prev.terms[k]);
    const gone = Object.keys(prev.terms).filter((k) => !terms[k]);
    if (added.length) console.log(`\nNEW    ${added.join(", ")}`);
    if (gone.length) console.log(`GONE   ${gone.join(", ")} — check docs/rules.md still describes the game`);
  }
  if (cross) {
    console.log(`\ncross-checked against the catalog dated ${cross.at}: ${cross.pool.size} bracketed terms in card text`);
    if (cross.unknown.length)
      console.log(`UNKNOWN  ${cross.unknown.map(([k, n]) => `${k} (${n} cards)`).join(", ")}\n` +
                  `         printed on cards but matching no rule. Either the rules moved or the ` +
                  `extractor missed a glossary entry; check.mjs fails on this.`);
    // Keywords only. Game actions are defined in the rules but written on cards as
    // plain verbs ("Draw 1", not "[Draw 1]"), so listing those as unprinted would
    // report thirty non-events and bury the one that matters.
    const unused = Object.keys(terms).filter((k) => terms[k].kind === "keyword" && !cross.pool.has(k));
    if (unused.length) console.log(`unprinted  ${unused.join(", ")} — a keyword the rules define that no card in the pool prints`);
  }
  if (docs.some((d) => d.updated !== prev?.docs?.[d.key]?.updated) || appeared.length || edited.length)
    console.log(`\nThe rules moved. docs/rules.md is hand-written and does NOT rebuild itself — ` +
                `read the patch notes and bring it up to date. Note the FAQs OUTRANK the Core ` +
                `Rules until a newer Core Rules Document is published.`);
};

// Only run when executed directly — build-errata.mjs imports the article extractor
// rather than keeping a second copy of it.
if (import.meta.url === pathToFileURL(process.argv[1] || "").href)
  main().catch((e) => { console.error(`\nbuild-rules: ${e.message}`); process.exit(1); });
