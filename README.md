# rift.jayegger.com

A personal Riftbound TCG collection manager: owned counts by finish, base-set
completion, a shareable trade list, and deck lists checked against what I
actually own.

Single self-contained `index.html`, no build step. State caches in localStorage
and syncs to Supabase (single-user, the same pattern as the LSAT and reading
trackers). Hosted on GitHub Pages behind Cloudflare.

## Layout

- `index.html` - the whole app. Vanilla JS, no dependencies, no bundler.
- `data/cards.json` - the card catalog, generated and committed. Loaded at boot.
- `data/extras.json` - printings Riot does not publish, merged in at load.
- `scripts/build-catalog.mjs` - regenerates the catalog from Riot's gallery feed.
- `schema.sql` - the Supabase table and its policies.
- `worker/` - the Cloudflare Worker that proxies the riftbound.gg profile.
- `fonts/` - Press Start 2P and Syne Mono, self-hosted to match jayegger.com.

## The four views

**Collection** filters all 1,197 printings by set, type, rarity, domain, printing
class, imported tag, and free text over names, codes, ability text, tags, and artists. Each
card takes four counts: Normal, Foil, Want, Trade. Grid view is for identifying
cards, table view is for bulk entry. Edits patch in place rather than
re-rendering, so scroll position and focus survive typing.

**Sets** shows base-set completion per set, broken out by rarity, plus progress
toward a playset of every card and how many variants of each class you hold.

**Trade** turns the Trade counts into a haves list and the Want counts into a
wants list, where a want shows the shortfall against what you own rather than
the target. Copy it as text for a Discord post, or share the read-only view.

**Decks** builds lists against the collection and reports what you are short.
"Add shortfall to wants" pushes the gap onto the trade list.

**Import** pulls the collection in from riftbound.gg, which is where cards
actually get entered because its scanner beats typing.

## Import

riftbound.gg is the source of truth for what I own, because its card scanner beats
typing. This tool mirrors it and adds what it does not do. Every import replaces
the owned counts, so a correction over there lands here too, while Want and Trade
are left alone because they exist only in this tool. Re-importing the same data is
a verified no-op.

Three ways in, in order of how little work they are:

1. **Automatic.** Deploy `worker/` and paste its URL into the Import tab. Turn on
   "Pull on every load" and the collection refreshes every time the page opens.
   See `worker/README.md` for why a proxy is needed at all.
2. **A file.** Either the JSON a public profile returns, or riftbound.gg's CSV
   export.
3. **Paste.** Drop either straight into the Import tab.

The JSON is the better source. A public profile carries more than the CSV does:
`standard` and `foil` counts, `trade` and `wish` counts, and the custom tags used
to label where a card came from. Tags come across on import, show on each card,
and get their own filter. Trade and wishlist are ignored unless "Mirror trade and
wishlist" is on, which is off by default so that "Add shortfall to wants" survives
a pull.

Matching tries the most specific key it can: a card id, then set plus collector
number, then a bare name. Everything normalizes, including zero-padding, letter
suffixes, stars, and the letter-prefixed token, rune and promo codes, so
`OGN-066a/298`, `ogn-066a-298` and `OGN` + `066a` all land on the same printing.
A bare name resolves only to base printings, so a plain "Fury Rune" never silently
becomes the alt art. A printing Riot does not publish at all falls back to the
same-numbered base card, and the report says which rows did that.

Rows that match nothing are listed rather than dropped. The expected cause is a
card the catalog cannot know about: the **Arcane Box Set**, or a set Riot has
announced but not released. riftbound.gg's catalog is larger than Riot's gallery
for exactly that reason.

### The catalog gap

Riot's gallery quietly omits some real printings. It reports 1,197 cards and
serves 1,189, and repeated passes never produce the rest, so this is not a
pagination race. Eight of the missing ones are tokens and basic runes that turned
up in a real collection, so they live in `data/extras.json`, which is merged at
load and drops any entry Riot later starts publishing. Their art is hot-linked
from dotgg's CDN, since Riot has none.

## Card data

`data/cards.json` is generated from the same publishing-content feed that powers
Riot's official gallery at riftbound.leagueoflegends.com/en-us/card-gallery. No
key and no auth. Refresh it when a set drops:

```
node scripts/build-catalog.mjs
```

The script prints a report and flags a set whose base count stops matching the
size Riot declares, which is the signal that the upstream shape changed.

Two things it handles that matter for the completion math:

- **Printing classes.** The collector code carries them: `066` is a base
  printing, `066a` an alternate art, `304*` a signature, anything above the set
  size an overnumber, and `T01` / `R01` / `SP1` are tokens, basic runes and
  promos. Only base printings count toward a set's denominator, so chase cards
  never make a set look incomplete.
- **A live, racy feed.** It paginates over a list that reorders between
  requests, so the same card sometimes lands on two pages. The script dedupes on
  the stable id and reports the drift.

Finishes are not in Riot's data, because a foil is a print treatment rather than
a separate card. That is why Normal and Foil are separate counts on each
printing, tracked on my side.

## Sync

One Supabase row holds the whole state as JSON, written debounced on every edit
and read on load, with localStorage as the offline cache. Run `schema.sql` once
against the project, then check the dot in the header: green is synced, red
means it saved locally but could not reach Supabase.

The publishable key in `index.html` is public by design and row-level security
is what guards the table. The policies in `schema.sql` allow anonymous reads and
writes to this one table, which is the same tradeoff the LSAT tracker makes: it
is a single-user tool with no secrets in it, and the cost of someone finding it
is a vandalized card list restorable from a backup. Use the Backup button.

## Hosting

GitHub Pages serves the repo root. `CNAME` claims the subdomain, which needs a
Cloudflare DNS record: `CNAME rift -> jcegger.github.io`, DNS only, not
proxied, so Pages can issue the certificate.

Not affiliated with or endorsed by Riot Games. Card galleries and deck builders
are permitted under Riot's policy on fan projects; automated gameplay tools are
not, and this is neither.
