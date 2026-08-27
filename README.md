# rift.jayegger.com

A personal Riftbound TCG decision tool: given what I own, what the meta is
playing, and what is legal, it says what to acquire next and whether a trade is
worth taking. It also keeps a collection, a set-completion view and a trade list,
because those are what the answers are computed from.

The distinction matters, because the collection half is a mirror. riftbound.gg is
where cards actually get entered — its scanner beats typing — and every import
replaces the owned counts, so browsing the catalog here duplicates a site that
does it better. What that site cannot do is hold the collection and the meta in
the same hand: it knows the cards and it knows the decks, never both at once.
Everything downstream of that join is the point of this app, and the app opens on
it rather than on the card grid.

Single self-contained `index.html`, no build step. State caches in localStorage
and syncs to Supabase (single-user, the same pattern as the LSAT and reading
trackers). Hosted on GitHub Pages behind Cloudflare.

## Layout

- `index.html` - the whole app. Vanilla JS, no dependencies, no bundler.
- `data/cards.json` - the card catalog, generated and committed. Loaded at boot.
- `data/extras.json` - printings Riot does not publish, merged in at load.
- `data/decks.json` - recent decklists, the meta snapshot.
- `data/banned.json` - cards banned from sanctioned Constructed play.
- `data/events.json` - the tournament archive, with player counts and coverage.
- `data/news.json` - riftbound.gg's posts: title, date, tag, link.
- `scripts/build-catalog.mjs` - regenerates the catalog from Riot's gallery feed.
- `scripts/build-decks.mjs` - regenerates the deck snapshot.
- `scripts/build-banned.mjs` - regenerates the ban list.
- `scripts/build-events.mjs` - regenerates the tournament archive and its coverage.
- `scripts/build-news.mjs` - regenerates the news feed.
- `scripts/check.mjs` - the regression checks; run it after touching the engine.
- `.github/workflows/refresh.yml` - rebuilds all of the above daily and commits.
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

**Meta** is the reference view: what is being played, how much of it is evidence, what
is banned, and what riftbound.gg is writing about it. It compares nothing to the
collection — that all lives on Next.

**Next** is the tab the app opens on, the only one that answers a question rather than
displaying a state, and the only one that compares anything to the collection: what is
buildable, what is within reach, what to buy and in what order. See below.

**Legends** is the champion roster: which champions you can actually play, and for
the rest, whether you are missing the legend, a champion unit, or both. See below.

**News** is riftbound.gg's own posts, filterable by tag, with the set and rules posts
pulled out separately because those are the two kinds that make this app's data wrong.

**Import** pulls the collection in from riftbound.gg, which is where cards
actually get entered because its scanner beats typing.

## Next: what to acquire

Meta answers "what can I build?". Next answers "what do I do next?", and it is
three panels.

**Best cards to get** ranks every card standing between the collection and any
archetype by how many archetypes are short of it. A common wanted by nine decks
outranks the last card of one. This is the buy-anyway list: it ignores which deck
is being built, so it is the right thing to read at a store.

**The plan** names a deck to finish, buys its shortfall, re-scores, and repeats
for up to three decks. Within a target, the cards other open archetypes also want
come first, so a plan abandoned halfway leaves the collection better placed than
working down a flat shortfall list would. Copy it, or push the whole thing onto
the wants list.

**Trade or buy** splits that plan against a scanned partner's surplus, which is
the difference between a shopping list and a shopping list you can act on.

Two findings shaped this, and both are worth keeping written down because the
obvious design contradicts them.

**Greedy on an aggregate score does not converge.** The natural implementation is
one pass over cards, each scored by the meta share it unblocks. It fails, and the
failure is structural rather than a tuning problem: any aggregate prefers breadth,
so a card wanted by eight half-built decks always outscores the last card of one,
and "unblocks a deck outright" is a signal that only appears at the final card,
far too late to steer anything. Measured against the real snapshot, that version
spent 29 cards without finishing a single deck. Naming a target first makes
convergence structural. The check in `acquisitionPath` is that the plan completes
its first deck in exactly the minimum number of cards, which it now does from an
empty collection, a staples-only collection and a deep one.

**Popularity is a weak signal in this meta, and is treated as one.** 47
archetypes split the snapshot between them and the most-played takes 4.4%, so
ranking by share separates almost nothing, while cards short spans 9 to 44. If a
dominant deck ever emerges, share becomes worth weighting again and that ranking
should be revisited — the ordering lives in `byTarget` and `cardLeverage`.

**Which deck to target is now a choice, not a calculation.** Substituting real gap cost
for the list-price proxy changed the answer badly enough to matter: on one collection the
old ordering picked a nine-card gap costing **$55** over a fourteen-card gap costing
**$4**. Five more cards for fifty-one fewer dollars. Across four test collections the two
orderings pick different targets every time, with $6 to $51 between them.

Money is the constraint you cannot argue with. But fifty-six cards is fifty-six things to
find even when they are commons, and there is no honest rate of exchange between dollars
and that hunting — the same objection that stopped a fabricated per-card price and a
fabricated credibility score. So both orderings are offered, `S.planBy` picks between
them, cheapest is the default, and both numbers stay on screen with a line naming what
the other measure would have chosen.

**There is now a third mode, `score`, and it is the blended number this section spent
three paragraphs refusing.** It exists because sometimes you want the list ordered top to
bottom and will argue with the result rather than weigh four columns by hand. It is
opt-in, never the default, and built so it cannot be quoted out of context:

    score = 0.5 · close  +  0.2 · meta  +  0.3 · strong

- **close** — cards short and gap dollars, each normalised and inverted, averaged. An
  unpriced gap scores zero on the dollar half, the way `byCost` already brackets it.
- **meta** — `0.6 · share + 0.4 · freshness` of the archetype's newest list. Small weight,
  because popularity is still a weak signal here.
- **strong** — `0.40 · events + 0.35 · log(players) + 0.25 · best finish`, from the
  tournament evidence the Meta tab shows. An archetype with **no** tournament record takes
  the median `strong` of the ones that have a record, not zero — zero would just re-sort
  the list by "did anyone enter this at an event", which 38 of 482 decks did.

Every component is normalised 0–1 **across the open archetypes on screen right now**, so a
score means "relative to your current options" and moves with the collection. All three
parts stay visible on every candidate row (`blend 71 · close 88 · meta 40 · strong 55`),
which is the concession to the objection that an uninterpretable index is worse than a
crude number you can argue with. The weights live in `SCORE_W`, the maths in
`annotateTargetScores`, and `scripts/check.mjs` holds it to: components in range, the
median substitution actually happening, the plan still converging, and the blend not
collapsing onto `byCost`.

**The history, since the reasoning still holds for ties.**
Against a staples-only collection, 13 archetypes tie at exactly 38 cards short.
Their shares span 0.6% to 4.0%, which is noise; the price of the list each one would
build spans $45 to $301, which is not — and before the representative list was
itself chosen on price, that same tie spanned $63 to $1352. Ranking it by share
picked the most expensive deck in it. Targets are now chosen by cards short, then
by list price, then by share, and the tie is displayed rather than settled
silently: **Candidate targets** lists the ten closest archetypes with gap, cost
and share side by side, and the summary calls out a deck a card or two further
out that costs less than half as much.

Fixing this exposed a second bug worth recording. `scorePool` (the planner) and
`metaArchetypes` (the Meta tab) both pick a representative list per archetype, and
once the planner learned to prefer the cheaper of two equally close lists, the two
disagreed: the same archetype at the same card gap was a $210 list to one and a
$3,586 list to the other. Both now break that tie on price, and the harness
asserts the two agree on every archetype's gap *and* price. The lesson generalises
— any ranking added to one of those functions has to be added to both.

**Per-card prices do exist, and finding them changed the ordering.** I had this wrong
for a while: the deck feed carries only a total per list, and rather than reconstruct a
per-card figure from 480 deck totals over 887 unknowns — underdetermined, with error bars
far too wide to spend money against — the app quoted whole-list prices and said so. But
`api.dotgg.gg/cgfw/getcards` carries `price` and `foilPrice` per printing. The
reconstruction was never needed.

A card is costed by **the cheapest of its printings**, because buildability goes by card
and that is the one you would actually buy. Taking a minimum also happens to immunise
the total against their junk listings — a Calm Rune is offered at $8,888 in foil, and a
nonsense high price can never win a minimum, so no threshold is needed. 1,065 of 1,189
printings carry a price; a total covering one of the other 124 is shown with a `+` to
mark it as a floor.

Then the whole point: a gap can be priced. **Candidate targets** shows what your missing
cards cost beside what the whole list costs, and the difference is the information — a
cheap gap into an expensive list means the chase cards are still ahead of you. The plan
totals itself, each line carries its own cost, and the copied shopping list has prices in
it.

The same valuation feeds the trade matcher. "What of theirs do I need" used to
mean my explicit wants plus the gaps in the five archetypes I was closest to,
which undersold a scan badly: a card someone is giving away can be the last piece
of the sixth-closest deck, or sit in four shortfalls at once, and neither showed
up. Now the whole meta's leverage counts, and rows are ranked by what they unblock
rather than by how many spare copies the partner happens to hold.

The plan's targets are quoted both summed and unioned, because adding shortfalls
up overstates what covering several decks costs. How much it overstates by turns
out to depend on the collection, in a direction worth knowing: from empty, the
targets come to 110 cards summed against 90 unioned, and from a staples-only
collection 76 against 64. From a deep collection it is 27 against 26 — almost no
overlap at all. That is not a bug in the union. A thin collection is missing the staples
every deck runs, so the gaps intersect; a deep one already has those, and what is
left is precisely each archetype's own cards. Overlap is therefore an early-game
saving that disappears exactly when the decks get close, which is the opposite of
what "buy the cards that appear in the most decks" advice assumes.

`metaPool()` is the single definition of which lists count, so the ban toggle on
the Meta tab cannot mean two different things on two tabs.

## Legends

A deck is built around one Legend, and a Legend needs a champion unit to work: the
game puts a Chosen Champion in its own zone, which cards like Hallowed Tomb
reference. So playability is two questions, not one — the legend, and at least one
unit of its champion — and either half can be the thing you are missing.

**The tab is keyed by champion, not by legend.** You do not set out to play Loose
Cannon, you set out to play Jinx, so the champion name leads every row and the
epithet sits beside it as the cross-reference to Meta and Next, which name archetypes
by epithet. Rows are grouped by which half is missing, because the four states need
different fixes:

| | legend | units | what to do |
|---|---|---|---|
| **playable** | held | ≥1 held | nothing |
| **need a unit** | held | none | buy any one of the units listed |
| **need the legend** | not held | ≥1 held | buy the one legend printing named |
| **need both** | not held | none | both |

"Need a unit" is the state worth watching, and the only one the tab badge counts: you
own the card and cannot use it. The two wants buttons follow the split — missing units
go on at a full playset, a missing legend at one copy, because a deck runs exactly one.

A legend counts as held at **one copy of any printing**. The three-copy playset target
the rest of the app uses does not apply.

It is nearly one legend per champion, and the grouping has to survive the exception:
**49 legends over 48 champions**, because Master Yi has two — *Wuju Bladesman -
Starter* and *Wuju Master* — sharing all four of his champion units. Holding either
legend makes him playable, so the champion is the row and both epithets ride on it.

The **48 champions with units but no legend** (Tryndamere, Caitlyn, Vayne, …) are left
out, with a line saying so. Nothing about them can ever become playable, so a verdict
column would read the same forever.

The first thing worth checking was whether any legend has no champion unit printed at
all. **None does.** All 49 have between two and four, and every one sits inside its
legend's own domains, so no legend is unplayable on paper — which is why the tab is
about ownership. The check still asserts it, so a future set that ships a legend
without one surfaces instead of the claim quietly going stale.

### Two bugs this uncovered

**Legend printings did not fold, so every gap was inflated.** `identityOf()` folds
variants by set plus base collector number, which reaches an alt art because `066a`
sits beside `066`. A legend's signature and overnumber are printed at a different
number entirely — `UNL-189` is base Bashful Bloom and `UNL-230*` is its signature —
so nothing numeric could ever join them. Owning a legend therefore failed to satisfy
a deck citing another of its printings: **74 of 490 decks across 31 archetypes
reported a missing legend even when you owned every base legend printed.** 45 of 51
legend names were spread across more than one identity. Legends now fold by name,
the way runes already did, and `scripts/check.mjs` asserts the count is zero.

**One legend was counted as two archetypes.** riftbound.gg writes
`Champion - Epithet` where Riot writes the epithet alone, so *Lillia - Bashful Bloom*
and *Bashful Bloom* are the same card — identical type and domains — that the Meta
tab listed as two archetypes competing against each other in the same cards-short
tie. Same for *Ivern - Green Father*. The ban page already showed this quirk
(`Draven - Vanquisher`); the Secret Garden promos bring it into the catalog itself.

### The dash naming, and why it cannot be guessed

The fold is data-driven, because the same separator marks something else entirely.
`Wuju Bladesman - Starter` is a real, distinct legend and the highest-share
archetype in the snapshot; stripping its prefix would delete it. So for a name
containing `" - "` there are two candidate readings, and one is accepted only if it
names a card that actually exists:

- swap to comma form — `Vi - Destructive` → `Vi, Destructive` (the Arcane Box Set units)
- take the tail — `Lillia - Bashful Bloom` → `Bashful Bloom` (the Secret Garden legends)

`Wuju Bladesman - Starter` yields neither `Wuju Bladesman, Starter` nor `Starter`, so
it stays put. Across the catalog this merges exactly the eight cards it should — six
Arcane units that already exist under a comma name, two Secret Garden legends — and
leaves all four `- Starter` legends alone. Roster: 51 names, 49 legends, each with a
base printing.

### Resolving the champion

The champion is a tag, but the tag list mixes champions with regions and races, so it
has to be picked out. A champion is a name that cards are named *after*: `Jinx, Rebel`
makes Jinx one, while `Zaun` and `Yordle` never appear before a comma and never
qualify. Only the prefix counts and not the whole card name — a token is named plainly
`Bird`, and admitting bare names let Bird pose as the champion of the Shurima bird
units, which is how *Emperor of the Sands* briefly looked like a legend with no
champion unit in the game.

Two further details are load-bearing:

- **A unit is filed under every champion it is tagged with, not one picked from the
  list.** Tag order carries no meaning: `Azir, Ascendant` is tagged `Bird, Azir,
  Shurima`. Asking a unit "who is your champion" and taking the first answer filed
  both Azir units under Bird. Membership is the question, not extraction.
- **Tags beat names.** `Yi, Honed` and `Yi, Meditative` are tagged `Master Yi` but
  named "Yi, …", so matching on the name prefix alone would miss half of Master Yi's
  four champion units.

Cards from products Riot does not publish carry **no tags at all** — all 25 entries in
`data/extras.json` — so those fall back to their own name prefix.

Legends are excluded from **Spares** for the same reason runes are, from the other
direction. A deck runs exactly one, so every copy past the first looks spare, and now
that printings fold, holding a base plus a signature plus an overnumber reads as three
copies of one card. Those extras are chase printings, not trade filler.

## Finishes, and foil-only printings

Riot does not publish finishes, because a foil is a print treatment rather than a
separate card. That is why Normal and Foil are separate counts on each printing here.
It also means the app could not tell that **512 of 1,189 printings only exist in foil** —
champion cards, signatures, showcases, alt arts, most of the interesting half of the
game — so a Normal count on one of them is a typo rather than a card.

`build-catalog.mjs` now enriches the catalog from riftbound.gg's card database, which
carries `hasNormal` and `hasFoil` per printing, and writes `fo: 1` on the foil-only
ones. Only the unambiguous case is recorded: their flag disagrees with their own price
data on a few dozen promos, which is the difference between "this finish does not exist"
and "we have no listing for it", so the flag is only set where a foil-only marking and a
zero normal price agree. If that fetch fails the catalog ships without finish flags and
says so, and the app claims nothing.

The Import tab then names any printing holding a Normal count it cannot have. Nothing is
corrected automatically, and that is deliberate: **import replaces owned counts on every
pull**, so a local fix would be silently undone on the next one and the app would
quietly disagree with its own source forever. The real fix is at riftbound.gg, so the
panel exists to name the rows and there is a copyable list. "Record as foil" is offered
for when the numbers need to be right in the meantime; it moves the finish rather than
choosing a new total, because the copies exist and only the finish was wrong.

One case it cannot catch, for a reason worth knowing: a foil-only printing Riot does not
publish at all. `VEN-R02a` is a foil-only alt-art Calm Rune absent from the gallery, so
the importer attributes its copies to `VEN-R02`, where a Normal count is perfectly legal.
The import report already lists such fallbacks under "Matched to the base printing" —
that is the only place they show up.

## Performance

An audit of where the time goes turned up that **every `render()` cost 150–440ms on
every tab**, and that the cost grew linearly with the deck archive. Three causes, all
now fixed, and the fixes matter more than the numbers because two of them were on a path
to making the app unusable rather than merely slow:

**Deck requirements were re-resolved on every render.** Resolving a list means a
`matchRow` call per card, and `evalDeck` was doing it afresh for all 480 decks whenever
Meta or Next rendered. Requirements depend only on the deck and the catalog, never on
what is owned, so they are now computed once per deck and kept, along with each deck's
ban status. `metaArchetypes` went from 121ms to 4ms.

**The tab badges recomputed the whole meta.** Badges refresh even when their own tab is
shut, so `metaArchetypes` was being paid on every render of every tab. The badges only
need each archetype's gap, which `scorePool` already gives more cheaply, so they use
that. The checks compare the exact figures the badges display against the tabs' own,
since the two now travel by different routes.

**News matching rebuilt the champion roster per post.** 94 posts times a 48-champion
roster made rendering the feed the slowest thing in the app at 294ms. Champion *names*
come from the catalog and never change with ownership, so they are indexed once.

| | before | after | at 8× the archive |
|---|---|---|---|
| `metaArchetypes` | 121ms | 4ms | 39ms |
| `render()` on Next | 231ms | 36ms | 220ms |
| `render()` on News | 436ms | 68ms | — |
| `render()` on a cheap tab | 175ms | 4ms | 12ms |

At eight times the current deck archive the app is now faster than it was at one times.
Catalog growth was never the problem: the legend and champion rosters stay under 5ms
even at 1,964 printings, so a new set costs nothing.

Every one of those caches is collection-independent, which is what makes them safe.
They are dropped in `buildNameIndex()` and `loadBans()` — the two things that can change
the answer — and the invalidation lives there rather than at the call site, because the
first version wired it into `boot()` and a test that republished the catalog another way
caught the stale result immediately.

Payload is 195KB gzipped for the whole site, data included, which is not yet worth
optimising.

## Checks

```
node scripts/check.mjs
```

Runs `index.html`'s script in node with the DOM stubbed out and asserts against the
real catalog and the real deck snapshot. No dependencies and no build step, same as
the rest of `scripts/`.

It exists because the bugs in this app have not been the kind you spot by reading. An
acquisition path that looked perfectly reasonable spent 29 cards without finishing a
single deck. Two functions quietly disagreed about which list an archetype was,
pricing the same deck at $210 and $3,586. Owning a legend failed to satisfy a deck
citing another of its printings, across 74 decks. All three were invisible until
measured, and all three are now asserted, along with the naming fold, champion
resolution, the plan's invariants, and every view rendering across five synthetic
collections — including one that owns every legend and no units, which is the only
way to reach the need-a-unit state the Legends tab exists to report, and one that
owns every unit and no legend, which is the only way to reach its mirror.

The blended `score` ordering has its own block: every sub-score in range, the
no-record archetypes actually taking the rated median rather than a zero, the plan
still converging under it, the blend not collapsing onto `byCost`, and the tab
rendering its formula and per-row sub-scores rather than a bare number.

Several of the assertions are about layout rather than correctness, because the first
Legends tab was unreadable: it rendered a full-height card per legend, 51 of them and
970 lines of text, to convey an answer that was two rows long, and it listed the same
legend twice because "held" is a superset of "held but unfieldable". So the checks now
require that the four states partition the champion roster exactly once each, that
each champion appears in exactly one bucket on the page, that the champion name leads
every row, and that panel count is fixed by the layout instead of growing with the
roster.

## Why Meta and Next split the way they do

They used to overlap: both ranked archetypes against the collection, so the same question
got answered twice and neither did it well. Measuring the three sections Meta owned across
five collection sizes settled it.

| | Ready | Close (5-card default) | Ideal |
|---|---|---|---|
| empty / thin / mid | 0 | 0 | 12 |
| deep | 0 | 11 | 12 |
| owns every printing | 47 | 0 | 12 |

**Ready was empty unless you owned literally every printing**, and it led the tab.
**Close returned nothing at its default threshold** at any realistic collection size.
**Ideal was always exactly 12 rows** ranked by a share signal that maxes at 4.4%, and it
never reacted to the collection at all — the same list forever.

So Ideal is gone, replaced by a collection-independent popularity table that reads
honestly: only 3 of the top 12 archetypes have any tournament record, and among those the
field sizes run 14, 50, 151, 216. Ready and Close moved to Next as **Buildable now** and
**Within reach**, and Next's candidate table now covers only what falls outside the
threshold, so no archetype is detailed in one place and listed in another. The tab badge
Meta used to carry is gone too: it showed a buildable count that is zero at every
realistic collection size, which is a permanent untruth in the tab bar.

**"Within reach" is measured in dollars**, because a card threshold compresses this set
and money spreads it out: at a mid-sized collection *within $25* selects 9 archetypes
where *within 20 cards* selects 20. It uses a new `nearSpend` key rather than repurposing
the old `closeThreshold`, since a stored `5` reinterpreted as `$5` would silently select
almost nothing.

Two panels are capped at six detailed entries, with the remainder listed compactly.
That is not cosmetic: a generous threshold put twenty full panels on Next, and owning
every card put fifty-three, which is the wall the Legends tab already had to be rescued
from once. The checks now hold both tabs to it — Next to 16 panels and Meta to 4 — so
panel count is fixed by the layout rather than growing with the archetype count.

## Freshness

Every recommendation here is a claim about the current meta, and it is only as good as
the snapshot behind it. The app used to print the date the snapshot was taken and never
work out how long ago that was, which meant a three-month-old file recommended a dead
meta with total confidence.

`.github/workflows/refresh.yml` now rebuilds all five data files daily and commits
them. Pages serves this repo directly, so the commit *is* the deploy — no build step
and no other infrastructure. It runs `scripts/check.mjs` before committing and fails
without committing if anything is wrong: every source is a public endpoint that can
change shape without warning, and stale data that works beats fresh data that lies.
Commits carry a one-line summary of what moved, so the history reads as a changelog
rather than 365 identical entries.

Automation makes surfacing the age *more* important, not less, because a cron that
quietly stops looks exactly like one that is working. So `dataAge()` computes the age
of each file and the masthead carries an indicator beside the sync dot, amber and then
red as things rot. Meta and Next each say so above their output, since those are the
two tabs whose answers are worthless when the snapshot is old.

Thresholds are keyed to how fast each thing actually moves. riftbound.gg publishes a
meta tier list weekly, so the deck snapshot warns past 10 days and shouts past 21. The
card catalog only changes when a set drops, so it gets 60, or it would cry wolf every
fortnight.

## News

`data/news.json` is riftbound.gg's own posts. The endpoint is
`api.dotgg.gg/cgfw/getposts`, and two things about it are worth knowing before touching
it.

**It ignores the `game` parameter.** Asking for riftbound returns the entire DotGG
network — GTA 6, Path of Exile, Honkai, Marvel Snap, thirty-odd sites — so the filter on
`source` does the real work and the page count is set by how far back you want to reach
rather than how many posts you want. Eight pages is 1,600 posts fetched to keep 94,
covering February to August, tagged News 31, Events 22, Metagame 18, Legends 15, Guides
4, Sets 2, Rules 2.

**`post_content` is always empty.** There is no body text to be had, only the title, the
date, the tags and `post_name`, which is the full URL. So this links out rather than
reproducing anything.

The feed is the least interesting part. The joins are the point:

- A post tagged **Legends** is a guide to one champion, so it appears on that champion's
  row in the Legends tab. 15 of the 48 champions have one.
- **Metagame** and **Events** posts appear on Meta as an outside reading to check the
  computed one against — this app infers the meta from deck lists, they watch the events.
- **Sets** and **Rules** are the two tags that mean our own data is about to be wrong, so
  a recent one becomes a banner and the tab badge counts them. It is earning its keep
  already: Set 6 and Set 7 spoiler posts are both live, which means the catalog will need
  rebuilding.

Champion matching happens in the app, not the build script. Resolving
`Vex - Gloomist Guide` to a champion needs the same name fold `identityOf` uses, and a
second copy of that logic would drift the way the deck parser nearly did. So the script
ships raw titles and the app joins them against the live roster.

Their titles come in two shapes, both real — `Jayce, Defender of Tomorrow - Best Decks
& Synergies` and `Vex - Gloomist Guide - Best Decks & Cards` — so the parse takes the
head, strips a marketing tail, tries `champion, legend` and falls back to champion
alone. The check asserts **all 15** Legends posts still resolve, so if they change
convention it fails loudly instead of quietly dropping every guide link.

## Tournaments

`data/events.json` is the tournament archive from `api.dotgg.gg/cgfw/gettournaments`:
30 events, May to August, with player counts. Deck entries already carried an event name
and a finishing place but nothing about how big the event was, so a 9-player local and a
433-player major weighed the same. The join is by exact event name, and it holds — every
event named on a deck matches a row, asserted in the checks because if it ever breaks the
credibility numbers silently become zero.

Making the join possible is how the real problem became visible. Of 480 decks only **38
are tournament-flagged**, covering **12 of 30 events** — 1,567 of 2,615 players. Convergence
#2 (257 players) and CCS $25,000 Qualifier #3 (243 players) contribute nothing at all, and
only **9 of 47 archetypes** have any tournament evidence whatsoever. That gap is upstream
and cannot be closed here, so Meta states it rather than implying it away.

Credibility is deliberately **not a score**. A weighted number would need a made-up
exchange rate between players and recency, and an uninterpretable figure is worse than a
crude one you can argue with — the same reason there is no per-card price anywhere in this
app. Instead: how many distinct events an archetype turned up at, how many players sat
behind them, and when the last one was. Players are summed over distinct *events*, not
decks, because three lists out of one 433-player event are one event's worth of evidence
and summing per deck would claim 1,299 players of support.

Two honest limits on that number. It measures the size of the room, not how well the deck
did — one entry in a 433-player event finished #158, so the finish is shown beside it. And
it does not feed the two default target orderings: `byTarget` under `cost` or `cards` stays
cards short, then list price, then share, because that ordering was measured and validated.
Credibility is displayed there, not weighted in. The one place it does feed selection is
the opt-in `score` mode (see *Next: what to acquire*), where it is the `strong` term —
still displayed in full beside the blended number, never folded away.

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
