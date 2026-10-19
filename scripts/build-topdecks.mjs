#!/usr/bin/env node
// Regenerates data/topdecks.json: Riot's own "X's Top Decks" articles, one per
// Regional Qualifier, parsed into decklists, finishes and the Day 1 / Day 2 field.
//
//   node scripts/build-topdecks.mjs
//
// Source: playriftbound.com/en-us/news/organizedplay/ — the article pages are
// Next.js and carry their whole body as HTML inside __NEXT_DATA__. No key, no auth.
//
// Why this exists. data/decks.json comes from riftbound.gg's deck API, and that API
// only knows the tournament lists someone uploaded there. RQ Los Angeles, the last RQ
// of 2026, had three of its eight Top 8 lists on riftbound.gg and not the winner's.
// riftdecks.com and Mobalytics carry full standings but sit behind Cloudflare and
// refuse a script. Riot's article is the primary record anyway: every Top 8 list and
// the best finisher on each legend ("Best-Of"), each with its overall ranking and its
// rank among that legend's players, as text, plus a table of how many players
// brought each legend to Day 1 and how many of them made Day 2.
//
// That table is the most useful number Riftbound publishes. Day 2 share over Day 1
// share is a conversion rate, which says how a deck did against the real field — not
// how popular it was. The tier list is built on it.
//
// What the articles do not say, this file does not say either. There is no event date
// (only the article's publish date), no player count (Day 1 is the sum of Riot's own
// table, labelled as such) and no placings below the ones Riot printed.

import { writeFile, readFile } from "node:fs/promises";

const BASE = "https://playriftbound.com";
const INDEX = `${BASE}/en-us/news/organizedplay/`;
const UA = "rift.jayegger.com top-decks builder";
const PAUSE = 1500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const get = async (url) => {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-US" }, redirect: "follow" });
    if (r.ok) return r.text();
    if (attempt >= 3 || (r.status !== 429 && r.status < 500)) throw new Error(`${r.status} ${url}`);
    await sleep(20000 * (attempt + 1));
  }
};

const nextData = (html) => {
  const m = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error("no __NEXT_DATA__ — the page changed shape");
  return JSON.parse(m[1]);
};

const text = (s) => String(s ?? "")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&apos;|&#8217;|’/g, "'")
  .replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

// Every richText body on the page, in order. The article is one or more of these.
const bodyOf = (data) => {
  const out = [];
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (o.richText && typeof o.richText.body === "string") out.push(o.richText.body);
    for (const v of Object.values(o)) walk(v);
  };
  walk(data.props?.pageProps?.page?.blades);
  return out.join("\n");
};

const SP = "(?:\\s|&nbsp;)*";

// "<strong>Main Deck:</strong>&nbsp;<br>1 Abandon&nbsp;<br>2 Charm" -> [[1,"Abandon"],[2,"Charm"]]
const section = (chunk, label) => {
  // Layouts vary by article. Most write "<strong>Legend:</strong>&nbsp;<br>1 X</p>";
  // Lille runs every section into one cell separated by <br>s; Barcelona puts each
  // card in its own <p>; Vancouver prints the legend with no count. So a section ends
  // at the next label or cell, and a line is a <br> or a paragraph.
  const re = new RegExp(`<strong>${SP}${label}${SP}:?${SP}</strong>${SP}:?([\\s\\S]*?)(?=<strong>|</td>)`, "i");
  const m = re.exec(chunk);
  if (!m) return null;
  const rows = [];
  for (const line of m[1].split(/<br\s*\/?>|<\/p>/)) {
    const t = text(line);
    const r = /^(\d+)\s*x?\s+(.+)$/.exec(t);
    if (r) rows.push([Number(r[1]), r[2].trim()]);
    // Vancouver's legend and Sydney's battlefields come without a count.
    else if (t && /^(Legend|Champion|Battlefields\?)$/.test(label)) rows.push([1, t]);
  }
  return rows;
};

const parseDecks = (body) => {
  const decks = [];
  const parts = body.split(/<h3>/).slice(1);
  for (const part of parts) {
    // Ranks are read from the text, not the markup: the colon sits inside the <strong>
    // in most articles and outside it in Utrecht's and Atlanta's, and Vegas puts the
    // whole header, ranks included, inside the <h3>.
    const head = text(part.slice(0, part.search(/<strong>[^<]*Legend(?:&nbsp;|\s)*:?(?:&nbsp;|\s)*<\/strong>|Legend:/) >>> 0));
    const lr = /Legend Rank\s*:?\s*#?(\d+)\s*\/\s*(\d+)/i.exec(head);
    const ov = /Overall Rank(?:ing)?\s*:?\s*#?(\d+)/i.exec(head);
    const player = text(part.slice(0, part.indexOf("</h3>"))).replace(/\s*Legend Rank.*$/i, "");
    const legend = section(part, "Legend");
    const main = section(part, "Main Deck");
    if (!legend?.length || !main?.length) continue;   // a heading that isn't a deck
    decks.push({
      player,
      overall: ov ? Number(ov[1]) : null,
      legendRank: lr ? [Number(lr[1]), Number(lr[2])] : null,
      legend: legend[0][1],
      champion: section(part, "Champion")?.[0]?.[1] ?? null,
      main,
      battlefields: (section(part, "Battlefields?") || []).map(([, n]) => n),
      runes: section(part, "Rune Pool") || [],
      side: section(part, "Sideboard") || [],
    });
  }
  // A deck can appear twice: once featured (winner, finalist) and again in its
  // section, and Vegas spells the winner two ways. Same finish, same legend, same list
  // is one deck. Not keyed on list alone: two players can register the same 39.
  const seen = new Set();
  return decks.filter((d) => {
    const k = `${d.overall}|${d.legend}|${JSON.stringify(d.main)}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
};

// The Day 1 / Day 2 table. Rows whose name cell is coloured were "not competing for
// Best-Of" per the articles' own legend.
const parseField = (body) => {
  const tables = body.match(/<table[\s\S]*?<\/table>/g) || [];
  const t = tables.find((x) => /% of Field/i.test(x));
  if (!t) return null;
  const rows = [];
  for (const tr of t.match(/<tr>[\s\S]*?<\/tr>/g) || []) {
    const cells = tr.match(/<td[\s\S]*?<\/td>/g) || [];
    if (cells.length < 5) continue;
    const name = text(cells[0]);
    const nums = cells.slice(1, 5).map(text);
    if (!/^\d+$/.test(nums[0])) continue;   // the header row
    rows.push({
      name,
      d1: Number(nums[0]),
      d2: /^\d+$/.test(nums[2]) ? Number(nums[2]) : null,
      noBestOf: /background-color/i.test(cells[0]) || undefined,
    });
  }
  return rows.length ? rows : null;
};

// Riot's table says "Irelia", "Master Yi, WB", "Renata", "Kai'sa", and once
// "Master Yi, Wuju Bladesmen". Resolve to the catalog's "Champion, Epithet" so it joins
// against everything else. A bare champion with two legends is settled by which of them
// the article's own decks play; anything still ambiguous stays null, not guessed.
// A legend's tags are usually just its champion, but Kennen's and Ziggs' are
// ["Yordle", name]. The champion is the tag some champion unit is named after.
let unitChamps = null;
const legendName = (cards, c) => {
  if (c.t !== "Legend" || !c.g?.length) return null;
  unitChamps ??= new Set(cards.filter((u) => u.t === "Unit" && u.n.includes(", ")).map((u) => u.n.split(", ")[0]));
  const champ = c.g.find((g) => unitChamps.has(g)) ?? c.g[c.g.length - 1];
  return `${champ}, ${c.n.replace(/ - Starter$/, "")}`;
};

const fold = (x) => String(x).toLowerCase().replace(/[’']/g, "'");
const legendIndex = (cards) => {
  const by = new Map();   // folded champion -> Set of "Champion, Epithet"
  for (const c of cards) {
    const full = legendName(cards, c);
    if (!full) continue;
    const k = fold(full.split(", ")[0]);
    if (!by.has(k)) by.set(k, new Set());
    by.get(k).add(full);
  }
  return (short, inArticle) => {
    const [champ, tag] = short.split(/,\s*/);
    const key = [...by.keys()].find((k) => k === fold(champ)) ?? [...by.keys()].find((k) => k.startsWith(fold(champ) + " "));
    const opts = key ? [...by.get(key)] : [];
    if (!tag) {
      if (opts.length === 1) return opts[0];
      const played = opts.filter((o) => inArticle.has(o));
      return played.length === 1 ? played[0] : null;
    }
    const epi = (o) => o.split(", ")[1];
    const initials = (o) => epi(o).split(/\s+/).map((w) => w[0]).join("").toUpperCase();
    return opts.find((o) => initials(o) === tag.toUpperCase())
      ?? opts.find((o) => fold(epi(o)).split(" ")[0] === fold(tag).split(" ")[0])
      ?? null;
  };
};

const nameIndex = (cards) => {
  const by = new Map();
  for (const c of cards) {
    if (c.v) continue;   // variants share their base's name
    const names = [c.n];
    if (c.t === "Legend") names.push(legendName(cards, c));
    for (const n of names) {
      const k = n.toLowerCase().replace(/[’']/g, "'");
      if (!by.has(k)) by.set(k, c.c);
    }
  }
  return (n) => by.get(String(n).toLowerCase().replace(/[’']/g, "'")) || null;
};

const main = async () => {
  const cards = JSON.parse(await readFile(new URL("../data/cards.json", import.meta.url), "utf8")).cards;
  const toLegend = legendIndex(cards);
  const toCode = nameIndex(cards);

  const index = JSON.stringify(nextData(await get(INDEX)));
  const slugs = [...new Set(index.match(/\/news\/organizedplay\/[a-z0-9-]+-top-decks/g) || [])];
  if (!slugs.length) throw new Error("no Top Decks articles linked from the index — the page changed shape");

  let prior = { events: [] };
  try { prior = JSON.parse(await readFile(new URL("../data/topdecks.json", import.meta.url), "utf8")); } catch { /* first run */ }
  const events = new Map(prior.events.map((e) => [e.slug, e]));

  let fetched = 0, failed = [];
  for (const path of slugs) {
    const slug = path.split("/").pop();
    const url = `${BASE}/en-us${path}/`;
    await sleep(PAUSE);
    let data;
    try { data = nextData(await get(url)); }
    catch (e) { failed.push(`${slug}: ${e.message}`); continue; }
    const s = JSON.stringify(data);
    const title = text(/"title": ?"([^"]*Top Decks[^"]*)"/.exec(s)?.[1]?.replace(/\\u2019/g, "'"));
    const published = /"publishDate": ?"(\d{4}-\d\d-\d\d)/.exec(s)?.[1] ?? null;
    const body = bodyOf(data);
    const decks = parseDecks(body);
    const field = parseField(body);
    if (!decks.length) { failed.push(`${slug}: no decks parsed`); continue; }
    for (const d of decks) {
      d.legendCode = toCode(d.legend);
      for (const k of ["main", "side"]) d[k] = d[k].map(([n, name]) => [n, name, toCode(name)]);
    }
    const inArticle = new Set(decks.map((d) => d.legend));
    if (field) for (const r of field) r.legend = toLegend(r.name, inArticle);
    events.set(slug, {
      slug, url, title, published,
      summary: text(/"description": ?\{"type": ?"html", ?"body": ?"([^"]*)"/.exec(s)?.[1]?.replace(/\\u2019/g, "'")),
      day1: field ? field.reduce((a, r) => a + r.d1, 0) : null,
      day2: field && field.every((r) => r.d2 != null) ? field.reduce((a, r) => a + r.d2, 0) : null,
      field,
      decks,
    });
    fetched++;
    console.log(`${slug}: ${decks.length} decks, ${field ? field.length + " field rows" : "no field table"}`);
  }
  if (!fetched) throw new Error(`nothing fetched: ${failed.join("; ")}`);

  const list = [...events.values()].sort((a, b) => String(b.published).localeCompare(String(a.published)));
  let names = 0, unresolved = new Set();
  for (const e of list) for (const d of e.decks) for (const [, n, c] of [...d.main, ...d.side]) { names++; if (!c) unresolved.add(n); }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: INDEX,
    note: "Riot's Top Decks articles. `overall` and `legendRank` are Riot's; `day1`/`day2` are sums of Riot's field table, not announced attendance. `published` is the article date, not the event date.",
    failed: failed.length ? failed : undefined,
    unresolved: [...unresolved].sort(),
    events: list,
  };
  await writeFile(new URL("../data/topdecks.json", import.meta.url), JSON.stringify(out) + "\n");
  console.log(`${list.length} events, ${list.reduce((a, e) => a + e.decks.length, 0)} decks; ${unresolved.size} card names of ${names} rows unresolved${failed.length ? `; failed: ${failed.join("; ")}` : ""}`);
};

main().catch((e) => { console.error("build-topdecks failed:", e.message); process.exit(1); });
