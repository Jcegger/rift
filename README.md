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
- `data/decks.json` - recent decklists, the meta snapshot.
- `data/banned.json` - cards banned from sanctioned Constructed play.
- `scripts/build-catalog.mjs` - regenerates the catalog from Riot's gallery feed.
- `scripts/build-decks.mjs` - regenerates the deck snapshot.
- `scripts/build-banned.mjs` - regenerates the ban list.
- `schema.sql` - the Supabase table and its policies.
- `worker/` - the Cloudflare Worker that proxies the riftbound.gg profile.
- `fonts/` - Press Start 2P and Syne Mono, self-hosted to match jayegger.com.

## The views

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

It also computes two things without being told anything. **Spares** is everything
held past the playset target, which is what can be traded away without breaking a
deck, derived from the collection so it stays right without setting a single Trade
count by hand. Basic runes are excluded, since lists happily run nine of one.

**Trade opportunities** reads any public riftbound.gg profile the same way it
reads mine, so a partner's username works out both directions at once: their
spares that fill my gaps, and my spares on their wishlist. Most people never fill
in a trade list, so their surplus past a playset stands in for it. My side of
"what I need" is explicit wants first, then the gap in the archetypes I am closest
to, which makes it useful before a single want has been typed in.

**Decks** builds lists against the collection and reports what you are short.
"Add shortfall to wants" pushes the gap onto the trade list.

**Meta** ranks tournament decks against the collection, in three sections:
**Ready** decks with every card already owned, **Close** decks within a tunable
number of cards, and **Ideal** decks, the meta ranked by tournament share
regardless of what is owned. Each one can be copied, saved into Decks, or have
its gap pushed onto the wants list.

**Import** pulls the collection in from riftbound.gg, which is where cards
actually get entered because its scanner beats typing.

## The meta

`data/decks.json` is a snapshot of what people are playing right now, from
riftbound.gg's public deck API. Refresh it whenever:

```
node scripts/build-decks.mjs [--days 60] [--max 700]
```

It draws on two sources deliberately, because neither is enough alone.

**Popularity comes from recent public decks.** There are hundreds from the last
few weeks and three quarters of them play Vendetta.

**Credibility comes from tournament entries**, which carry an event and a
finishing place, the only hard evidence a list is good. They lag badly: the whole
tournament archive is 452 decks and 329 of them come from one event in May,
before Vendetta existed. Building the meta from tournament data alone produced a
snapshot where Vendetta appeared in 10% of decks, which is what prompted the
rewrite. The script now warns if the newest set is under-represented, since that
is the shape of the mistake.

Two filters earn their keep. Clones: 248 of 450 public decks were named
"... - copy" and 450 lists collapsed to 303 distinct fingerprints, so counting
them raw measures copying rather than play. And size, because a half-built brew
is not a deck.

Decks are grouped into archetypes by their Legend, and each archetype is shown as
whichever of its lists you are closest to finishing. Three details matter and are
easy to get wrong:

- **Deck lists use code forms the gallery does not.** `OGN-202-P` is a promo
  printing, `UNL-230-STAR` a signature spelled out, `OGN-263-a` a hyphenated
  variant suffix, and `OGN-166` omits the denominator entirely. All fold to the
  base card. The parser is duplicated in `scripts/build-decks.mjs` and must stay
  identical to the one in `index.html`, or the snapshot resolves cards the app
  cannot.

- **Buildability goes by card, not printing.** An alt art, signature or
  overnumber satisfies a slot calling for the base card, so a list citing
  `UNL-113A` is covered by owning `UNL-113`.
- **Basic runes count by name.** Fury Rune is Fury Rune whether it came from
  Origins, Unleashed or Vendetta. Tournament lists lean on this: nine copies of a
  single rune is normal, and matching runes by printing would report every deck
  as impossible.

When nothing is within the threshold, Close shows the five shortest paths anyway
and says so, because an empty section teaches nothing.

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

## Bans

Riot's gallery carries no legality data at all, so the ban list comes from
riftbound.gg's card database, which has a `banned` flag per printing:

```
node scripts/build-banned.mjs
```

That flag is keyed by the exact code form deck lists use, so no name matching is
involved, which matters because the ban page writes `Draven - Vanquisher` where
the card is actually `Draven, Vanquisher`. Riot bans outright rather than
restricting, so there is no restricted list, and a ban covers the card, meaning
every printing of it including alt arts.

One entry cannot come from the flag. **Master Yi - Wuju Bladesman - Starter** is
banned in 2v2 Constructed only, and their database marks it legal because it is
legal in 1v1. It is recorded as a separate format in `banned.json`, taken from
the ban page, and the app labels it as format-specific rather than lumping it in.

This is not cosmetic. 65 of the ~490 snapshot lists run a banned card, and 42 of
those are dated *after* the ban, so filtering by date does not work. The Meta tab
therefore shows sanctioned-legal lists by default, with a toggle to include the
rest, and flags any deck with exactly which banned cards it runs. Bans also show
on the card in the Collection tab, which has a Banned filter, and on saved decks.

The honest consequence: the collection's one buildable meta deck, Loose Cannon,
runs 3x Fight or Flight, 3x Scrapheap and 1x Reaver's Row. It is fine at a
kitchen table and not legal at an event, and the app now says so instead of
calling it ready.

### The catalog gap

Riot's gallery quietly omits some real printings. It reports 1,197 cards and
serves 1,189, and repeated passes never produce the rest, so this is not a
pagination race. What it misses turned up in a real collection and in real
decklists: tokens, basic runes, and two whole products, the **Arcane Box Set**
(ARC) and the **Secret Garden Set** (SGN). All 25 live in `data/extras.json`,
merged at load, dropping any entry Riot later starts publishing. Names, types and
art come from riftbound.gg's card database rather than being guessed at.

The Secret Garden legends mattered more than their count suggests: they are the
Legends of several decks, and without them those decks had no identifiable
archetype at all.

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

GitHub Pages serves the repo root at **https://rift.jayegger.com**, with
`jcegger.github.io/rift` still serving the same build.

The Cloudflare record is `CNAME rift -> jcegger.github.io`, proxied. If it ever
returns Cloudflare **error 1016**, the target is unresolvable: that happened once
because the target was missing a dot, and 1016 is exactly what Cloudflare reports
when it resolves the record but not what the record points at. Both proxy settings
work, matching `lsat` (DNS only) and `reading` (proxied); proxied needs Cloudflare
SSL on **Full** or the redirect loops.

`.nojekyll` is present because the site is plain static files, and building it as
a Jekyll site only added ways to fail. Pages builds here also fail intermittently
with an empty error message; requesting another build
(`gh api repos/Jcegger/rift/pages/builds -X POST`) has cleared it every time.

Not affiliated with or endorsed by Riot Games. Card galleries and deck builders
are permitted under Riot's policy on fan projects; automated gameplay tools are
not, and this is neither.
