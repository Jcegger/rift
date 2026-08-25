# riftbound.jayegger.com

A personal Riftbound TCG collection manager: owned counts by finish, base-set
completion, a shareable trade list, and deck lists checked against what I
actually own.

Single self-contained `index.html`, no build step. State caches in localStorage
and syncs to Supabase (single-user, the same pattern as the LSAT and reading
trackers). Hosted on GitHub Pages behind Cloudflare.

## Layout

- `index.html` - the whole app. Vanilla JS, no dependencies, no bundler.
- `data/cards.json` - the card catalog, generated and committed. Loaded at boot.
- `scripts/build-catalog.mjs` - regenerates the catalog from Riot's gallery feed.
- `schema.sql` - the Supabase table and its policies.
- `fonts/` - Press Start 2P and Syne Mono, self-hosted to match jayegger.com.

## The four views

**Collection** filters all 1,189 printings by set, type, rarity, domain, printing
class, and free text over names, codes, ability text, tags, and artists. Each
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
Cloudflare DNS record: `CNAME riftbound -> jcegger.github.io`, DNS only, not
proxied, so Pages can issue the certificate.

Not affiliated with or endorsed by Riot Games. Card galleries and deck builders
are permitted under Riot's policy on fan projects; automated gameplay tools are
not, and this is neither.
