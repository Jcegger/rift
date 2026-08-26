#!/usr/bin/env node
// Regenerates data/cards.json from Riot's own card gallery feed.
//
//   node scripts/build-catalog.mjs
//
// Source: the same publishing-content list that powers the official gallery at
// riftbound.leagueoflegends.com/en-us/card-gallery. No key, no auth, no scraping
// of a Next.js build id. Card galleries and deck builders are permitted under
// Riot's legal jibber jabber policy; automated gameplay tools are not.

import { writeFile } from "node:fs/promises";

const CHANNEL = "https://content.publishing.riotgames.com/publishing-content/v2.0/public/channel/riftbound_website/list";
// Riot does not publish finishes, because a foil is a print treatment rather than a
// separate card, so which printings exist in which finish has to come from elsewhere.
// riftbound.gg's card database carries hasNormal and hasFoil per printing, and it
// matters: 835 of their 1,422 printings are foil-only, so a Normal count on one of
// those is a data-entry mistake rather than a card. Optional — a failure here costs the
// flags and nothing else.
const FINISHES = "https://api.dotgg.gg/cgfw/getcards?game=riftbound";
const PAGE = 200;
const IMG_PREFIX = "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/";

async function getJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": "rift.jayegger.com catalog builder" } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.json();
}

// Pull every page of a smart list.
//
// The feed is live and paginates over a list that can reorder between requests, so
// the same card occasionally lands on two pages while another is skipped. Dedupe on
// the stable id and report the drift rather than shipping a catalog with twins in it.
async function getList(name) {
  const seen = new Map();
  let dupes = 0;
  let from = 0;
  let total = Infinity;
  while (from < total) {
    const d = await getJSON(`${CHANNEL}/${name}?locale=en_US&from=${from}&limit=${PAGE}`);
    total = d.metadata?.totalItems ?? d.data.length;
    if (!d.data.length) break;
    for (const item of d.data) {
      const key = item.id ?? item.publicCode ?? JSON.stringify(item);
      if (seen.has(key)) dupes++;
      else seen.set(key, item);
    }
    from += PAGE;
  }
  return { items: [...seen.values()], claimed: total, dupes };
}

const label = (n) => n?.value?.label ?? null;
const num = (n) => {
  const v = n?.value?.id ?? n?.value?.label;
  return v === undefined || v === null || v === "" ? null : Number(v);
};

// Strip Riot's rich-text HTML down to plain text we can search.
function plain(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// Riftbound's collector-code grammar. A publicCode is SET-<collector>[/<denominator>],
// and the collector segment carries the whole story:
//   066        plain number within the set size -> base printing
//   066a       letter suffix                    -> alternate art
//   304*       star                             -> signature (a subset of overnumbers)
//   299+       number above the set size        -> overnumber
//   T01        T prefix                         -> token / helper card, outside the set numbering
//   R01        R prefix                         -> basic rune, outside the set numbering
//   SP1/006    SP prefix                        -> promo subset with its own denominator
//
// Only "" (base) counts toward base-set completion. The rest are tracked but never
// inflate a set's denominator.
function variantOf(publicCode, baseSize) {
  const m = /^[A-Z]+-([^/]+)(?:\/(\d+))?$/.exec(publicCode || "");
  if (!m) return "";
  const collector = m[1];

  if (/^T\d+$/i.test(collector)) return "token";
  if (/^R\d+$/i.test(collector)) return "rune";
  if (/^SP\d+/i.test(collector)) return "promo";

  const nm = /^0*(\d+)([a-z]*)(\*?)$/.exec(collector);
  if (!nm) return "";
  if (nm[3]) return "sig";
  if (baseSize && Number(nm[1]) > baseSize) return "over";
  if (nm[2]) return "alt";
  return "";
}

function imageRef(card) {
  const url = card.cardImage?.url || "";
  if (!url.startsWith(IMG_PREFIX)) return url; // keep absolute if the CDN path ever moves
  return url.slice(IMG_PREFIX.length).replace(/\?.*$/, "");
}

const main = async () => {
  process.stdout.write("fetching sets… ");
  const sets = (await getList("riftbound_gallery_sets")).items.map((s) => ({
    id: s.id,
    name: s.name,
    base: s.collectorNumberMax ?? null,
  }));
  console.log(`${sets.length}`);

  process.stdout.write("fetching cards… ");
  const { items: raw, claimed, dupes } = await getList("riftbound_gallery_cards");
  console.log(`${raw.length}${raw.length !== claimed ? ` (feed claims ${claimed})` : ""}` +
    `${dupes ? `, dropped ${dupes} duplicate page hit${dupes > 1 ? "s" : ""}` : ""}`);

  const baseSize = Object.fromEntries(sets.map((s) => [s.id, s.base]));

  // ── finishes, from riftbound.gg ────────────────────────────────────────────
  // Keyed by their id form ("OGN-066a"), which is the collector code without the
  // denominator, so it is matched on the way in rather than guessed at later.
  const finishes = new Map();
  try {
    process.stdout.write("fetching finishes… ");
    const r = await fetch(FINISHES, {
      headers: { "User-Agent": "rift.jayegger.com catalog builder", Origin: "https://riftbound.gg" },
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const rows = await r.json();
    if (!Array.isArray(rows)) throw new Error("unexpected payload shape");
    for (const x of rows) {
      const hasNormal = String(x.hasNormal) === "1";
      const hasFoil = String(x.hasFoil) === "1";
      // Their own price data contradicts the flag on a few dozen promos, which is the
      // difference between "this finish does not exist" and "we have no listing for
      // it". Only an unambiguous case is recorded, so nothing downstream calls a real
      // card a mistake.
      const normalPrice = Number(x.price) || 0;
      const foilPrice = Number(x.foilPrice) || 0;
      const sure = !hasNormal && hasFoil && normalPrice === 0;
      // What this printing costs in the cheapest finish it actually comes in. A
      // foil-only printing is priced as a foil because that is the only way to own it.
      const cost = hasNormal && normalPrice > 0 ? normalPrice : foilPrice;
      finishes.set(x.id, { hasNormal, hasFoil, foilOnly: sure, cost });
    }
    console.log(`${rows.length} rows, ${[...finishes.values()].filter((f) => f.foilOnly).length} unambiguously foil-only`);
  } catch (e) {
    console.log(`could not read finishes (${e.message}); the catalog will carry none`);
  }
  const finishOf = (publicCode) => {
    // "OGN-066a/298" -> "OGN-066a"; runes, tokens and promos have no denominator.
    const id = String(publicCode || "").split("/")[0];
    return finishes.get(id) || finishes.get(publicCode) || null;
  };

  const cards = raw
    .map((c) => {
      const setId = c.set?.value?.id ?? null;
      const card = {
        c: c.publicCode,
        ri: c.id, // Riot's own id ("ogn-066a-298"), kept so imports can match on it
        n: c.name,
        s: setId,
        no: c.collectorNumber,
        v: variantOf(c.publicCode, baseSize[setId]),
        t: c.cardType?.type?.[0]?.label ?? null,
        r: label(c.rarity),
        d: (c.domain?.values ?? []).map((x) => x.label),
        e: num(c.energy),
        m: num(c.might),
        p: num(c.power),
        mb: num(c.mightBonus),
        g: c.tags?.tags ?? [],
        a: (c.illustrator?.values ?? []).map((x) => x.label),
        o: c.orientation === "landscape" ? 1 : null, // battlefields are wide
        x: plain(c.text?.richText?.body) || plain(c.effect?.richText?.body),
        i: imageRef(c),
      };
      // Only the unambiguous foil-only case is recorded, and only as a flag, so the
      // absence of it never implies anything. Written as 1 rather than true because the
      // empty-key pass below then drops it from every card it does not apply to.
      const fin = finishOf(c.publicCode);
      if (fin && fin.foilOnly) card.fo = 1;
      // Rounded to cents. Their foil listings carry obvious junk — a Calm Rune priced at
      // $8,888 — but the app costs a card by the cheapest of its printings, and a
      // nonsense high price can never win a minimum, so it is left in rather than
      // second-guessed with a threshold.
      if (fin && fin.cost > 0) card.mp = Math.round(fin.cost * 100) / 100;
      // drop empty keys so the committed JSON stays small
      for (const k of Object.keys(card)) {
        const v = card[k];
        if (v === null || v === "" || (Array.isArray(v) && !v.length)) delete card[k];
      }
      return card;
    })
    .sort((a, b) => (a.s === b.s ? (a.no - b.no) || a.c.localeCompare(b.c) : a.s.localeCompare(b.s)));

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "content.publishing.riotgames.com / riftbound_gallery_cards" +
            (finishes.size ? " + api.dotgg.gg/cgfw/getcards for finishes" : ""),
    imagePrefix: IMG_PREFIX,
    sets,
    cards,
  };
  await writeFile(new URL("../data/cards.json", import.meta.url), JSON.stringify(out) + "\n");

  // ── report, so a bad upstream change is obvious instead of silent ──
  const tally = (fn) => cards.reduce((m, c) => ((m[fn(c)] = (m[fn(c)] || 0) + 1), m), {});
  console.log("\nby set:");
  for (const s of sets) {
    const mine = cards.filter((c) => c.s === s.id);
    const base = mine.filter((c) => !c.v).length;
    const flag = s.base && base !== s.base ? `  <-- MISMATCH, expected ${s.base}` : "";
    console.log(`  ${s.id.padEnd(4)} ${String(mine.length).padStart(4)} printings   ${String(base).padStart(3)} base of ${s.base}   ${mine.length - base} variants${flag}`);
  }
  console.log("\nby variant: ", tally((c) => c.v || "base"));
  console.log("by type:    ", tally((c) => c.t));
  console.log("by rarity:  ", tally((c) => c.r));
  const codeClashes = cards.length - new Set(cards.map((c) => c.c)).size;
  console.log(`\n${cards.length} printings, ${codeClashes} duplicate codes, ${new Set(cards.map((c) => c.n)).size} distinct names`);
  const missingImg = cards.filter((c) => !c.i).length;
  if (missingImg) console.log(`WARNING: ${missingImg} cards have no image`);
  if (finishes.size){
    const fo = cards.filter((c) => c.fo).length;
    const unknown = cards.filter((c) => !finishOf(c.c)).length;
    const priced = cards.filter((c) => c.mp);
    console.log(`\n${fo} printings are foil-only, so a Normal count on one is a mistake`);
    if (unknown) console.log(`  ${unknown} printings are not in their database, so carry no finish flag`);
    const ps = priced.map((c) => c.mp).sort((a, b) => a - b);
    console.log(`  ${priced.length} printings carry a price, $${ps[0]} to $${ps[ps.length - 1]}, ` +
      `median $${ps[Math.floor(ps.length / 2)].toFixed(2)}`);
    const unpriced = cards.length - priced.length;
    if (unpriced) console.log(`  ${unpriced} carry none, so a gap containing them is quoted as a floor`);
  } else {
    console.log("\nNOTE: no finish flags this run, so the app cannot flag foil-only mistakes");
  }
};

main().catch((e) => {
  console.error("\nbuild-catalog failed:", e.message);
  process.exit(1);
});
