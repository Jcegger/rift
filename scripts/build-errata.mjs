#!/usr/bin/env node
// Regenerates data/errata.json: the current text of every card Riot has errata'd.
//
//   node scripts/build-errata.mjs
//
// Why this has to exist. Riot's card feed serves what was PRINTED, not what is current.
// Errata are published separately, as news articles, and never flow back into the data
// — so `data/cards.json` confidently shows superseded text. Spot-checking twelve
// errata'd cards against the catalog, ten were stale, including Zhonya's Hourglass
// (in a quarter of tournament lists) and two cards in a deck of mine. Reading a card in
// this app and reading it at a table gave different answers.
//
// The source is the errata pages tracked in data/rules.json by build-rules.mjs, so run
// that first; this script deliberately does not rediscover them. Their shape is
// unusually kind: an <h1> per set, an <h2> per card, then the FULL new text and the
// FULL old text, not just the changed fragment — which is what makes the result
// checkable rather than a hopeful string replacement.
//
// The check that matters is at the bottom: every entry's OLD text should match what the
// catalog currently says. When it does, the errata is real and the catalog is stale.
// When the NEW text matches instead, Riot has folded the errata into the feed and the
// entry is a no-op. When NEITHER matches, either the parse drifted or the card was
// renamed, and that is reported rather than silently written.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { articleText } from "./build-rules.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "rift.jayegger.com errata builder";

/* ── comparing Riot's two dialects ───────────────────────────────────────── */

// The card feed writes symbols as :rb_might:; the errata pages write them as [M]. Worse,
// errata use [C] ("one power of this card's domain") where the card prints the actual
// domain symbol, so a Chaos card's :rb_rune_chaos: and the errata's [C] are the same
// thing written two ways. Both sides are therefore collapsed: every domain power symbol,
// [C] included, becomes <P>, and energy becomes <N>. Precision is lost on which domain,
// which does not matter for "is this the same sentence".
// [A] is kept DISTINCT from a domain symbol. Collapsing them was a real bug: an errata
// whose only change is "[C]" -> "[A]" (pay your own domain -> pay any domain) compared
// equal to the printed text, was filed as "Riot already folded this in", and the
// correction then never reached the card.
//
// Punctuation is kept for the same reason. Stripping it made a parenthesis-only errata
// invisible, and one of those is live: Edge of Night's correction is exactly
// "attach it to a unit you control (here)." against "...control here."
//
// Riot's pages also use U+02BC / U+02EE where the card data uses ordinary curly quotes,
// so those fold too — otherwise one side loses a word boundary and nothing matches.
const canon = (t) => String(t || "")
  .replace(/:rb_energy_(\d+):/g, (_, n) => `<${n}>`)
  .replace(/:rb_rune_rainbow:/g, "<ANY>")
  .replace(/:rb_rune_[a-z]+:/g, "<P>")
  .replace(/:rb_might:/g, "<M>").replace(/:rb_exhaust:/g, "<E>")
  .replace(/\[(\d+)\]/g, (_, n) => `<${n}>`)
  .replace(/\[A\]/g, "<ANY>")
  .replace(/\[[RGBOPYC]\]/g, "<P>")
  .replace(/\[M\]|\[S\]/g, "<M>").replace(/\[E\]|\[T\]/g, "<E>")
  .replace(/[‘’ʼ]/g, "'").replace(/[“”ˮ]/g, '"')
  .replace(/[—–]/g, "-").replace(/[ ]/g, " ")
  .toLowerCase().replace(/[^a-z0-9<>'"+.,;:()/-]+/g, " ")
  .replace(/\s+/g, " ").trim();

// The same comparison with every power symbol flattened together, used only as a
// fallback when the strict form fails. See the status logic in main().
// canon() lowercases at the end, so the tokens are already <any> / <p> by the time this
// runs — matching on the uppercase form finds nothing and the fallback never fires.
const loose = (t) => canon(t).replace(/<any>/gi, "<p>");

/* ── parsing an errata page ──────────────────────────────────────────────── */

// Two page shapes, because Riot changed format between sets.
//
// The later pages label the halves:
//   ## Spiritforged Cards        <- which set the card is from
//   ### Draven, Vanquisher       <- the card
//   **[NEW TEXT]**  ...lines...  ▲  **[OLD TEXT]**  ...lines...
//
// The Origins and Spiritforged pages just run the new text and then the old text under
// the card name with nothing marking the boundary. Guessing the split by counting
// paragraphs would be a coin flip on any multi-line card, so those entries come out as
// an ordered list of blocks and the SPLIT IS RESOLVED AGAINST THE CATALOG instead: the
// old half is whichever tail matches what data/cards.json currently says. That turns an
// ambiguous parse into a verified one, and when no split matches, the entry is reported
// rather than guessed at.
function parseErrata(md, source) {
  const out = [];
  const marked = /\[NEW TEXT\]/i.test(md);
  let set = null, card = null, mode = null;
  let buf = { new: [], old: [] }, blocks = [];
  const flush = () => {
    if (card) {
      if (marked && (buf.new.length || buf.old.length))
        out.push({ card, set, source, new: buf.new.join("\n").trim(), old: buf.old.join("\n").trim() });
      else if (!marked && blocks.length >= 2) out.push({ card, set, source, blocks: [...blocks] });
    }
    buf = { new: [], old: [] }; blocks = [];
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    // The Spiritforged page uses ## for card names as well as for its set headings, so
    // the only thing separating "## Origins Cards" from "## Falling Star" is the word
    // Cards. Anything else at ## or ### is a card.
    if ((m = /^## (.+?) Cards$/.exec(line))) { flush(); card = null; set = m[1]; continue; }
    if ((m = /^###? (.+)$/.exec(line))) { flush(); card = m[1]; mode = null; continue; }
    if (/^\*\*\[NEW TEXT\]\*\*$/i.test(line)) { mode = "new"; continue; }
    if (/^\*\*\[OLD TEXT\]\*\*$/i.test(line)) { mode = "old"; continue; }
    if (/^(?:#+\s*)?(---|▲)$/.test(line)) {
      if (line.endsWith("---")) { flush(); card = null; }
      mode = null; continue;
    }
    if (/^\*\*/.test(line) || /^\[Download/i.test(line) || !card) continue;
    if (marked) { if (mode) buf[mode].push(line); }
    else blocks.push(line);
  }
  flush();
  return out;
}

// For an unmarked entry, find the boundary that makes one half agree with the catalog.
//
// Usually that is the OLD half — the whole point of this file is that the catalog is
// behind. But for the handful Riot has already folded into the feed it is the NEW half
// that matches, so both are tried; searching for the old one first keeps the common
// case honest. Prefers the latest possible split so a multi-line new text stays intact.
//
// Some entries carry a trailing editorial footnote ("Note: Text only differs for the
// English version of the card"), which is not card text and has to come off first or it
// lands in the old half and blocks every split.
function resolveSplit(entry, catalogText) {
  const now = canon(catalogText);
  const blocks = entry.blocks.filter((b) => !/^note:/i.test(b.trim()));
  for (let k = blocks.length - 1; k >= 1; k--) {
    const oldHalf = blocks.slice(k).join("\n"), newHalf = blocks.slice(0, k).join("\n");
    if (canon(oldHalf) === now) return { new: newHalf, old: oldHalf, resolved: true };
  }
  for (let k = blocks.length - 1; k >= 1; k--) {
    const oldHalf = blocks.slice(k).join("\n"), newHalf = blocks.slice(0, k).join("\n");
    if (canon(newHalf) === now) return { new: newHalf, old: oldHalf, resolved: true };
  }
  const h = Math.ceil(blocks.length / 2);
  return { new: blocks.slice(0, h).join("\n"), old: blocks.slice(h).join("\n"), resolved: false };
}

/* ── main ────────────────────────────────────────────────────────────────── */

const main = async () => {
  const rules = JSON.parse(await readFile(join(ROOT, "data/rules.json"), "utf8"));
  const pages = (rules.supplements || []).filter((d) => d.kind === "errata");
  if (!pages.length) throw new Error(
    "data/rules.json tracks no errata pages — run build-rules.mjs first");

  const entries = [];
  const counts = new Map();
  for (const pg of pages) {
    process.stdout.write(`${pg.slug}… `);
    const r = await fetch(pg.url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`${pg.slug} ${r.status} ${r.statusText}`);
    const md = articleText(await r.text());
    if (!md) throw new Error(`${pg.slug}: article body not found`);
    const got = parseErrata(md, pg.slug);
    console.log(`${got.length} cards`);
    // A page that yields nothing is a parse failure, not an empty page: each of these
    // articles exists to list cards. Without this, one page silently contributing zero
    // still produced a complete-looking errata.json that every check passed.
    if (!got.length) throw new Error(
      `${pg.slug}: parsed 0 cards. The page's shape has changed — see the header.`);
    counts.set(pg.slug, got.length);
    entries.push(...got);
  }
  if (!entries.length) throw new Error(
    "no errata parsed from any page — the pages' shape has changed, see the header");

  const cat = JSON.parse(await readFile(join(ROOT, "data/cards.json"), "utf8"));
  const byName = new Map();
  // Names are matched case- and apostrophe-insensitively: the errata pages write
  // "Leblanc, Deceiver" where the card is "LeBlanc, Deceiver", and a curly apostrophe
  // on one side is not a different card.
  // Separators drift between the two sources — the errata write "Dark Child, Starter"
  // where the card is "Dark Child - Starter" — so comma and dash both collapse.
  const key = (n) => String(n).replace(/[‘’]/g, "'").replace(/\s*[,\-–—]\s*/g, " ")
                              .toLowerCase().replace(/\s+/g, " ").trim();
  for (const c of cat.cards) if (!byName.has(key(c.n))) byName.set(key(c.n), c);
  // Legends are stored under their epithet alone — "Deceiver", not "LeBlanc, Deceiver"
  // — which is the same dash-naming quirk the README describes for the catalog. So a
  // two-part name also gets tried as its tail.
  const byTail = new Map();
  for (const c of cat.cards)
    if (c.t === "Legend" && !byTail.has(key(c.n))) byTail.set(key(c.n), c);

  let stale = 0, current = 0, unmatched = 0, missing = 0, noop = 0;
  const cards = [];
  for (const e of entries) {
    // Split on the comma BEFORE key() flattens it, or a two-word champion name
    // ("Lee Sin, Blind Monk") yields the tail "sin blind monk" and resolves nothing.
    const comma = /^[^,]+,\s*(.+)$/.exec(e.card);
    const tail = comma ? key(comma[1]) : "";
    const c = byName.get(key(e.card)) || (tail && (byTail.get(tail) || byName.get(tail)));
    if (!c) { missing++; cards.push({ ...e, blocks: undefined, status: "no-such-card" }); continue; }
    const { blocks, ...rest } = e;
    const halves = blocks ? resolveSplit(e, c.x) : { new: e.new, old: e.old, resolved: true };
    const now = canon(c.x), looseNow = loose(c.x);
    const status =
        canon(halves.old) === now ? "catalog-stale"
      : canon(halves.new) === now ? "current"
      : loose(halves.old) === looseNow ? "catalog-stale"
      : loose(halves.new) === looseNow ? "current"
      : "no-match";
    // If the two halves are indistinguishable once symbols are flattened, the "errata"
    // carries no change this pipeline can see. Never silently treat that as applied.
    if (status !== "no-match" && loose(halves.new) === loose(halves.old)) noop++;
    if (status === "current") current++;
    else if (status === "catalog-stale") stale++;
    else unmatched++;
    // `card` is Riot's spelling and `name` is the catalog's — they differ on
    // apostrophes and separators ("Emperor's Dais" vs "Emperor’s Dais"), and consumers
    // have to join on the catalog's spelling or the overlay silently misses.
    cards.push({ ...rest, name: c.n, new: halves.new, old: halves.old, code: c.c, status });
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "Riot's per-set errata pages, as tracked in data/rules.json",
    note: "`new` is the current text and supersedes what data/cards.json carries for that card.",
    catalogAt: cat.generatedAt,
    pages: pages.map((p) => ({ slug: p.slug, url: p.url, published: p.published,
                               count: counts.get(p.slug) || 0 })),
    cards,
  };
  await writeFile(join(ROOT, "data/errata.json"), JSON.stringify(out, null, 1) + "\n");

  console.log(`\ndata/errata.json  ${cards.length} errata'd cards from ${pages.length} pages`);
  console.log(`  ${stale} where the catalog still shows the OLD text (the reason this file exists)`);
  console.log(`  ${current} Riot has already folded into the feed`);
  if (unmatched) console.log(`  ${unmatched} match neither old nor new — parse drift or a reworded card:\n` +
    cards.filter((c) => c.status === "no-match").map((c) => `      ${c.card}`).join("\n"));
  if (noop) console.log(`  ${noop} whose old and new text differ only in symbol notation — worth a look`);
  if (missing) console.log(`  ${missing} name no card in the catalog:\n` +
    cards.filter((c) => c.status === "no-such-card").map((c) => `      ${c.card}`).join("\n"));
};

main().catch((e) => { console.error(`\nbuild-errata: ${e.message}`); process.exit(1); });
