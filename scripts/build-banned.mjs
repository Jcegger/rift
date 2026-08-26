#!/usr/bin/env node
// Regenerates data/banned.json: cards banned from sanctioned Constructed play.
//
//   node scripts/build-banned.mjs
//
// Source: riftbound.gg's card database (api.dotgg.gg/cgfw/getcards?game=riftbound),
// which carries a `banned` flag per printing. No key and no auth. That is the same
// data behind their /rules/banned-cards page, and it is keyed by the exact code form
// deck lists use, so no name matching is involved.
//
// Riot bans outright rather than restricting, so there is no restricted list.
//
// One entry cannot come from the flag. Master Yi - Wuju Bladesman - Starter is
// banned in 2v2 Constructed only, and their database marks it legal because it is
// legal in 1v1. It is listed here as a separate format, taken from the ban page. If
// a future 2v2 ban lands, it will need adding by hand, which is why the format is
// recorded explicitly rather than folded into one list.

import { writeFile, readFile } from "node:fs/promises";

const API = "https://api.dotgg.gg/cgfw/getcards?game=riftbound";

// Bans that their `banned` flag does not express, with the reason recorded.
const EXTRA_FORMAT_BANS = [
  { format: "2v2", code: "OGS-019", name: "Master Yi - Wuju Bladesman - Starter",
    note: "banned 2026-07-24 for overshadowing every other 2v2 Legend option" },
];

function normColl(seg) {
  let s = String(seg ?? "").replace(/\s+/g, "");
  if (!s) return null;
  s = s.replace(/[-_]P$/i, "");
  s = s.replace(/\/\d+$/, "");
  const star = /\*/.test(s) || /star$/i.test(s);
  s = s.replace(/\*/g, "").replace(/[-_]?star$/i, "");
  s = s.replace(/[-_]/g, "");
  const m = /^([A-Za-z]*)0*(\d+)([A-Za-z]*)$/.exec(s);
  return m ? `${m[1].toUpperCase()}${Number(m[2])}${m[3].toUpperCase()}${star ? "*" : ""}` : null;
}
function keyOf(code) {
  const m = /^([A-Za-z]{2,5})[-\s]+(.+)$/.exec(String(code ?? "").trim());
  if (!m) return null;
  const n = normColl(m[2]);
  return n ? `${m[1].toUpperCase()}|${n}` : null;
}
// Strip a trailing variant letter: a ban covers the card, not one printing of it.
const baseKey = (k) => {
  if (!k) return null;
  const [set, coll] = k.split("|");
  const m = /^([A-Za-z]*\d+)[A-Za-z]+(\*?)$/.exec(coll);
  return m ? `${set}|${m[1]}${m[2]}` : k;
};

const main = async () => {
  process.stdout.write("fetching card database… ");
  const r = await fetch(API, {
    headers: { "User-Agent": "rift.jayegger.com ban list builder", Origin: "https://riftbound.gg" },
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const all = await r.json();
  if (!Array.isArray(all)) throw new Error("unexpected payload shape");
  console.log(`${all.length} cards`);

  const cat = JSON.parse(await readFile(new URL("../data/cards.json", import.meta.url), "utf8"));
  let extra = [];
  try {
    extra = JSON.parse(await readFile(new URL("../data/extras.json", import.meta.url), "utf8")).cards || [];
  } catch { /* optional */ }
  const known = new Map();
  for (const c of cat.cards.concat(extra)) {
    const k = keyOf(c.c);
    if (k && !known.has(k)) known.set(k, c);
  }

  // Group the flagged printings by the card they are printings of.
  const byCard = new Map();
  for (const c of all) {
    if (String(c.banned) !== "1") continue;
    const k = baseKey(keyOf(c.id));
    if (!k) continue;
    const e = byCard.get(k) || { key: k, codes: [], name: null, type: c.type || null };
    e.codes.push(c.id);
    // Prefer the plain name over "... (Some Promo)".
    const clean = (c.name || "").replace(/\s*\(.*\)\s*$/, "").trim();
    if (!e.name || clean.length < e.name.length) e.name = clean;
    byCard.set(k, e);
  }

  const constructed = [...byCard.values()].map((e) => {
    const hit = known.get(e.key);
    return {
      key: e.key,
      name: hit ? hit.n : e.name,
      type: hit ? hit.t || e.type : e.type,
      code: hit ? hit.c : e.codes[0],
      printings: e.codes.sort(),
      inCatalog: !!hit,
    };
  }).sort((a, b) => (a.type || "").localeCompare(b.type || "") || a.name.localeCompare(b.name));

  const byFormat = {};
  for (const b of EXTRA_FORMAT_BANS) {
    const k = baseKey(keyOf(b.code));
    const hit = known.get(k);
    (byFormat[b.format] ??= []).push({
      key: k, name: hit ? hit.n : b.name, type: hit ? hit.t : null,
      code: hit ? hit.c : b.code, note: b.note, inCatalog: !!hit,
    });
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "api.dotgg.gg/cgfw/getcards (banned flag) + riftbound.gg/rules/banned-cards for format-specific bans",
    note: "Riot bans outright; there is no restricted list. A ban covers the card, so every printing of it is banned.",
    constructed,
    byFormat,
  };
  await writeFile(new URL("../data/banned.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");

  console.log(`\n${constructed.length} cards banned in Constructed:`);
  for (const b of constructed)
    console.log(`  ${(b.type || "?").padEnd(12)} ${b.name.padEnd(24)} ${b.code}` +
      `${b.printings.length > 1 ? `  (${b.printings.length} printings)` : ""}` +
      `${b.inCatalog ? "" : "   <-- NOT IN CATALOG"}`);
  for (const [fmt, list] of Object.entries(byFormat)) {
    console.log(`\nplus ${list.length} banned in ${fmt} only:`);
    for (const b of list) console.log(`  ${b.name}  ${b.code}${b.inCatalog ? "" : "   <-- NOT IN CATALOG"}`);
  }
  const missing = constructed.filter((b) => !b.inCatalog).length;
  if (missing) console.log(`\nWARNING: ${missing} banned cards are not in the catalog, so decks using them cannot be flagged`);
};

main().catch((e) => {
  console.error("\nbuild-banned failed:", e.message);
  process.exit(1);
});
