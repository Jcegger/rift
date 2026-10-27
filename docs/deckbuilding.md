---
title: Deckbuilding — How Winning Lists Are Actually Built
subtitle: Riftbound — measured from 1,240 placed lists (20 Aug–19 Oct 2026), against what the guides say, and what it means for building a deck
author: rift toolchain
date: 2026-10-19
---

The layer between [archetypes.md](archetypes.md) (what each deck is for) and a list. Written
to answer one question before building anything that suggests decks: **how do the players
who win build, and how far do they stray from each other?** Every number is counted from
`data/decks.json` — 4,067 legal lists, 1,240 of them placed (upstream's record or a claimed
finish) — on 2026-10-19. The script is not kept; the method is described with each finding
so it can be re-run.

**The headline: start from what wins and change it on purpose.** A brew built from card
text alone (`lib/brew.mjs`, Oct 2026) shared about half its cards with real lists and could
not tell a good card from an on-theme one. The pros' lists already carry that judgement.
What follows says how much of a list is settled, where players disagree, and how new cards
get in.

---

## 1. A 40 is about 18 cards

- **17.8 distinct cards per 40.** Of the names in a placed list, **45% are 3-ofs, 29%
  2-ofs, 26% 1-ofs.** "If a card is good enough, run three" is how winners build; 1-ofs
  are the hedges and the champion.
- **Champion units: one.** 93% of good finishes run exactly one copy across all of their
  champion's units — the Chosen Champion in its zone and nothing else — and 7% run 2+.
  *(Corrected 23 Oct 2026: this read 77%, with "11% with none are incomplete uploads". They
  were complete; their champion was printed in alt art, whose code the readers could not
  place — see "Re-measured" below.)* Guides that suggest "up to 4" describe what is
  legal, not what wins.
- **Signature cards: all or nothing.** 43% of lists run 3, 35% run none, 22% in between. A
  signature is either part of the plan or not worth the slot.

## 2. Most of a list is settled

For legends with 15+ placed lists, the consensus 40 splits by how many of the legend's
winners run each card:

| | copies of 40 |
|---|---|
| **Core** — in 80%+ of winning lists | **27.9** |
| **Mid** — 60–80% | **7.6** |
| **Flex** — under 60% | **4.5** |

It varies by deck: Rengar 37/1/2 and LeBlanc 36/4/0 are nearly fixed lists; Kennen 25/13/2
and Irelia 25/11/4 argue about a quarter of the deck; Viktor 19/11/10 is the least settled
established deck in the format.

## 3. How far winners stray

- **A winning list shares a median 34 of 40 cards with its legend's consensus** — it
  changes about **6**. The middle 80% change between 1 and 16. Past 16 it is a different
  deck under the same legend.
- **Two winning lists of the same legend differ by a median 9 copies.** That is the normal
  room pros give each other.
- **Top-8 finishes stay slightly closer to the consensus** (33.8 shared) than other placed
  lists (32.2). Straying is not rewarded on average, so a change needs a reason.

**Re-measured 23 Oct 2026, on complete lists.** §1–3 were counted on any recorded finish
(last place included), with claimed results counted once per repost, and with every card
printed in alt art missing — 22% of placed lists were short a card or more, because the deck
snapshot kept the feed's codes ("UNL-150A") and nothing downstream could place them. On the
364 distinct good finishes (lib/placing.mjs `goodFinishes`) of 23 Oct:

| | was | now |
|---|---|---|
| distinct cards per 40 | 17.8 | 18.4 |
| 3-ofs / 2-ofs / 1-ofs | 45 / 29 / 26% | 45 / 27 / 28% |
| exactly one champion unit / none | 77% / 11% | **93% / 0%** |
| signatures at 3 / none / between | 43 / 35 / 22% | 44 / 31 / 25% |
| core / mid / flex copies (legends with 15+) | 27.9 / 7.6 / 4.5 | 30.5 / 5.3 / 4.2 |
| a winner shares with its consensus (median) | 34 | 35 |
| two winners differ by (median copies) | 9 | 8 |
| top-8 lists vs other placings, shared with consensus | 33.8 vs 32.2 | **32.9 vs 34.2** |

The shape holds. One finding reverses: **top-8 lists now sit further from the consensus
than other good finishes**, not closer, so "straying is not rewarded" in §3 is not supported
— on good finishes, the best ones stray a little more. A change still needs a reason; it is
no longer evidence against changing.

## 4. Changes are like for like — by role

- Between two winning lists of a legend, **61% of cut cards have a card of the same type
  within one Energy coming in**, and another 23% one of the same type. Players swap a 2-drop
  for a 2-drop, a trick for a trick.
- **New cards come in by role, not by type.** In the two Radiance-format events (the
  NovaRiftbound Showdown and the Haven Radiance Preview), the Radiance cards older legends
  took up replaced what did the same job:
  - **Trifarian Captain** (a 2-Energy unit that digs a unit or gear from the top 4) took
    Kennen's card-advantage slots — Salvage 81→20%, Ezreal, Prodigy 91→45% — and LeBlanc's
    Watchful Sentry (92→0%).
  - **Bilgewater Tracker** (3-Energy unit, 1 damage to two units) and **Lost to the Sands**
    (4 damage or kill a gear) replaced Kai'Sa's Progress Day and Rocket Barrage, spells
    doing the same work.
  - **Bedeviling Stranger** and **An Offer You Can't Refuse** went into Kennen, Riven and
    Vex as interaction.
- **What gets adopted first is efficiency, not theme.** The most-taken Radiance cards are
  generically strong cards for their colour, not payoffs for a legend's engine: 27% of
  placed Radiance-event lists of older legends ran no Radiance card at all, the rest about 3
  copies. Engine payoffs wait for testing; good role-players get in at once.
- **"Core" is not untouchable.** Kennen's Ezreal, Prodigy and Shadow Order Disciple were in
  91% of its Vendetta wins and fell to 45% when Trifarian Captain arrived. A clearly better
  card for the same role displaces a core card; a sideways one never does.

## 5. Placed and unplaced lists look alike

| | units | average cost | cards at ≤2 Energy |
|---|---|---|---|
| top 8 | 18.9 | 2.81 | 22.4 |
| placed | 18.7 | 2.87 | 21.9 |
| unplaced | 18.9 | 2.94 | 20.4 |

Winners run slightly **cheaper** decks with more 2-drops, and fewer units than the beginner
guides' 20–24. The shape is not what separates them; the card choices are.

## 6. Pilots matter, a little

Of 71 players with two or more upstream placings, the first finish predicts the later ones
weakly (r = 0.25). Players whose first finish was in the top 15% of the field averaged 40%
of the field afterwards; everyone else 53%. A proven pilot's list deserves more weight than
an unknown's — **as a tiebreak, not a verdict**; ten players is a small sample.

---

## What this means for building a deck

1. **Anchor on a winning list or its legend's consensus** — never a 40 from card text.
2. **Change the flex and mid slots first.** About 12 copies of a typical consensus are open
   to argument; that is where to look.
3. **Every change is a role swap with a reason**: out a card, in one doing the same job
   better. The reasons that hold up are a better card for the role (a new set's most of
   all), an answer to the field, or a research question answered "test".
4. **Budget about 6–9 changes.** That is how far winners stray from each other. More than
   about 16 is a new deck and should be called one.
5. **One champion, and signatures at 3 or 0.**
6. **For a new set, look for efficient role-players before engine payoffs**: the first wave
   of adoption is cards that do an existing job better.
7. **Weight pilots lightly** — a tiebreak between lists, not a reason to copy one.

## What was built from this

> *Retired 23 Oct 2026:* everything in this section and the next — the brews, swaps, roles, blind test, backtest and scoreboard — was swept, and is in git history. On complete lists the swaps' backtest found 2 of the 11 cards pros adopted, below its own bar, and the brews' crowd anchor lives on as the crowd's list in the net decks ("Net decks", below). The sections are kept as the record of what was measured and why.

`data/brews.json` (`scripts/build-brews.mjs`, `lib/brew.mjs`, `lib/swaps.mjs`,
`lib/roles.mjs`) replaces the first, from-scratch brews: each is a legend's winning list
changed on purpose, by the rules above — role swaps only, about 9 copies at most, one
champion, signatures at 3 or none, the legend's own cards and its plan's cards never cut,
and nothing claimed to outdo a card whose text the role reader cannot read. A legend too
thin to anchor on is built from what its colours' winners play.

**The blind test.** Hide a legend's lists, build it, and count what it shares with its
real winners' consensus, over the 26 legends with 10+ placings (`lib/blind.test.mjs`):

| | of 40 |
|---|---|
| ceiling — two random halves of the legend's own winning lists | **36.2** |
| **the crowd** — placings hidden, its posted lists kept | **33.1** |
| built blind from its colours: per-legend card shares + its own package | 19.6 |
| the colours' most popular cards | 17.6 |
| porting one same-colour legend's list (the first design) | 14.2 |

What it taught. **Winners converge** — two halves of a legend's lists share 36 of 40. **So
does the crowd**: a legend's unplaced lists share 33–34 of 40 with its winners', and even
the first 10 lists ever posted share 31.6. Proven pilots' lists did no better than the
crowd's, view counts slightly worse, and elite finishes (top 8 at 64+ players) agree with
all placings on 37.6 of 40 — **in this game the strong players and the crowd build nearly
the same lists**. Where they part, the first placings steer the crowd — the crowd plus a
legend's first two results predicts its later winners (34.9) better than the crowd (33.8) or
the results alone (30.8). *(22 Oct 2026: the example that stood here, Yasuo's "winners" all
playing a Spiderling swarm, was 12 placeholder lists from players hiding their decks before
the RC; `build-decks.mjs` now holds those apart. These three numbers were measured with them
in, and before good placings replaced any finish. **Rerun on 22 Oct, on good placings**, over the
15 legends with 12+ of them and 8+ unplaced lists (first two placings against the consensus of
the rest): the crowd alone 36.7, the crowd plus the first two at ×10 36.5 (×1 36.6, ×3 36.7,
×20 35.9), the first two alone 32.4. With and without the placeholders the same to 0.1. So the
steering no longer earns its weight; `FIRST_W` stays at 10 because this page freezes thresholds
until the forward scoreboard has 30+ scored suggestions, and that is where to settle it. The
blind test, rerun the same day over the 15 legends with 10+ good placings: ceiling 36.3, the
crowd 37.1, built from colours 18.2, most popular 16.5.)* Building blind from colours, with no lists
at all, reaches only half the ceiling: a winning list is mostly its colours' staples plus its
legend's own package, and card text does not say which cards winners choose (weighting
other legends by a plan read from text made it worse, 18.7).

**The backtest.** Run on the Vendetta winning lists of the six older legends that placed in
the Radiance previews, using only what was known before Radiance, its "new card, same job"
swaps were adopted by the pros **3 times out of 7 (43%) — against 3.9% for a random
Radiance card in the same colours** — finding 3 of the 11 cards the pros took up (Reckless
Innovator and Battle Preparations for Irelia, Elnuk Herd for Rengar). Its misses are as
telling: pros cut LeBlanc's Watchful Sentry, a payoff of its own death engine, for Trifarian
Captain — a change the rules here refuse to make. About eleven times chance on a small
sample: good leads, not verdicts. `lib/swaps.test.mjs` keeps it above 4× chance; it is a
guard, not a target.

**The audit (19 Oct 2026).** The first pass changed 5 copies over 2.8 swaps — light against
the 6 winners stray. The causes were caution, not evidence: pros' alternatives were off for
legends with under 10 lists, had to match by role rather than by slot (61% of real cuts are
the same type within one Energy), took whole slots instead of splitting them, and could be
vetoed by the value read. Fixed, plus three misreads (a Reaction replaced by a unit;
moving an enemy treated as moving your own; Rampage's fight read as a pump), the brews
change about 5 copies over 4 swaps and offer one or two more beside the list — core cards
(80%+ of winning lists) only ever among those offered.

**Good placings, not any finish (21 Oct 2026).** Everything above counted a list as "placed"
if it had any recorded finish — last place included. Of the 562 verified finishes with a
field size, 209 (37%) were in the bottom half; Zed's four "first results", each weighted 10×
in its crowd, were 144th of 206, 47th, and two claimed top-512s. The brews' anchor and the
scoreboard now use `lib/placing.mjs`: a verified finish in the top 25% of its field or a top
8 of 32+ players; with no field size, a top 8; a claim, top 8 or better, still a claim. The
§1–6 measurements were taken on all placings and are not re-run. Re-run on good placings,
the blind test reads: ceiling 36.4 of 40, **crowd 37.1**, built blind 18.4, the colours'
most popular cards 16.9. The crowd now beats the ceiling — half of a legend's good placings
is a smaller, noisier sample than all of its posted lists — which says a consensus of 5
good placings (the anchor's MIN_PLACED) is likely worse than the crowd's. **So MIN_PLACED is
now 10** — a knob changed on new evidence, against the freeze, by decision on 21 Oct 2026;
below 10 good placings a legend anchors on its crowd, its good placings weighted 10×.
Riot's Top Decks articles count too (`riotRows()`): an RQ's Top 8, and its **Best Of** — the
best finisher on each other legend — when that finish clears the same cut. Of the window's
three RQs, 77 of Riot's 111 lists were already uploaded; 31 more join. The backtest
(`lib/swaps.test.mjs`) keeps its own definition of an adopted card (30%+ of the
Radiance-preview lists), unchanged at 3 of 7.

## Net-deck first — and what is fitted to what

At its core this is net-decking: the brew **is** its legend's consensus — its winners', or
before results its crowd's — and the only changes applied are labelled **experiments** (a
new card doing a job for less, a card rising in posted lists, a research "test" answer). What
other winners play instead is listed as **options**, not applied: swapping a majority card
for a minority one is variation, not improvement, and it was where most of the knobs lived.

The experiments still rest on thresholds, and the evidence behind several is small. Where
each came from:

| knob | value | set from |
|---|---|---|
| core / flex share | 80% / 60% | the measured core–mid–flex split (§2) |
| change budget | ~9 copies | how far winners stray from each other (§3) |
| crowd anchor | 8+ lists; first placings ×10 | the blind test (34.9 vs 33.8 at ×10 — a small gain) |
| placings to anchor alone | 10 good placings (was 5 of any finish) | the blind test on good placings: crowd 37.1 beats half of them, 36.4 (21 Oct) |
| new-card swaps per list | at most 2 | the previews' first wave (~3 Radiance copies), **and the backtest** |
| core cards never changed; plan and engine cards kept; Reaction speed respected | — | **the backtest** and the audit |
| alternative = 15% of a legend's lists, 2+ lists | — | judgement |
| passed over = under 3% of 30+ eligible lists | — | judgement |
| value margins (lib/roles.mjs) | +0.15 flex | judgement; the role reader itself is hand-written |
| rising = +15 points, 20%+ now, gaining 10 on the card out | — | judgement, untested |

**The backtest has 11 adopted cards behind it, and about five design choices were made
against it** — that is the overfitting risk, and it is why it now only guards (above 4×
chance) instead of steering. **The thresholds are frozen as of 20 Oct 2026.** From here a
knob changes only on the forward scoreboard (`data/swaplog.json`, scored on good placings 28 days after each
suggestion first appears), once a kind has 30+ scored suggestions — out-of-sample evidence,
which the backtest never was. It scores 28 days after a suggestion against the legend's good
placings, and only where both 28-day windows hold 10+ of them — so most of the log will
never be scored, and the first scores land in mid-November.

## Net decks — what earns the name (23 Oct 2026)

The idea page used to show one consensus per legend: every Radiance-format list with any
recorded finish, counted together. Three things were wrong with that, and the net decks
(`lib/netdeck.mjs`) fix each.

**How others do it.** Frank Karsten's aggregate lists ([ChannelFireball, 2015](https://web.archive.org/web/20201111223914/https://www.channelfireball.com/articles/magic-math-a-new-way-to-determine-an-aggregate-deck-list-rg-dragons/))
showed why an average deck fails — it takes inferior cards, loses each plan's synergy when
two builds are mixed ("an awkward mess"), and lands on fractions — and counted every copy
as its own entry instead. [ManaVault](https://manavault.gg/blog/archetypes-forest-from-trees)
groups decks by density clustering on weighted card vectors, wants 5–10 similar lists before
calling a group real, leaves the rest unclassified, and prefers a real list (the medoid) to a
synthetic one. HSReplay defines an archetype by a core of cards with inclusion rates, and
academic Hearthstone work clusters decks on shared cards (DBSCAN, k-means, fuzzy multisets).
[thoughtscour](https://thoughtscour.bearblog.dev/deck-archetypes-are-hurting-mtg-metagame-reporting/)
argues labels hide the version differences that matter — which is the case for showing
each group's list rather than a name.

**What this does, and what the data changed.**

1. **One finish, one list.** 127 of 656 good placings were reposts of a claimed finish
   through deck sites' "copy" button; measured on distinct finishes, they were 26% of the
   lists. A claim titled for another champion — a copied Rek'Sai top 4 rebuilt as
   Mordekaiser — is not its list's finish. Only good placings count (§ "Good placings").
2. **Never-play lists partitioned first** (`lib/avoid.mjs`): an Aurora build can neither
   lend its results to a clean group nor hide inside one. Its group is kept for the field.
3. **Split where lists are more than half a deck apart**: average linkage on changed copies,
   merging while two groups average 24 or fewer apart. Density clustering needs more lists
   than most legends have. **The split is kept only where that legend's own lists earn it**
   (since 27 Oct 2026): the measurement below, run per legend, must beat random groups by
   half a card. Otherwise, or under 8 lists, the legend is counted as one deck, and the
   group records the edge it measured (`split`).
4. **Counted with `lib/consensus.mjs`**, the brews' counter, not Karsten's method — see below.

**The measurement** (`lib/netdeck.test.mjs`): hide each of a legend's distinct good finishes
in turn, build from the rest, and count the hidden list's 40 the result gets — the blind
test's yardstick — over the 16 legends with 8+. The control deals the same lists into random
groups of the same sizes, so a gain from merely having more options to pick from in
hindsight does not pass for structure.

| cut | legends split | one count | grouped | random groups |
|---|---|---|---|---|
| 16 (§3's "different deck") | 9 | 31.6 | 32.7 | 32.3 |
| 20 | 5 | 30.2 | 31.1 | 30.8 |
| **24** | **4** | **30.3** | **31.7** | **31.0** |
| 28 | 3 | 29.1 | 30.4 | 29.9 |

**The structure is real but small.** Grouping beats one count by about a card and a half
where a legend splits, but most of that is having a choice: over random groups it gains
0.4–0.7 cards. The margin is largest at 24, where four legends split — Kennen, Master Yi,
Viktor and Fiora, the same four at every cut tried — so those four are two decks, and the
rest are one. Legends that are one deck lose nothing either way. **Karsten's aggregate tied
the median count** (32.9 of 40 each), because once lists are grouped there is little left to
blend; the test keeps it as the comparison.

*The first run of this (earlier on 23 Oct) put the cut at 20 with a 1.1-card margin. That was
measured on lists missing their alt-art cards, which made lists look further apart than they
are: the cut had been fitted to the gaps. Re-run on complete lists, it moved to 24.*

*27 Oct 2026, with the LDXP Sacramento 25k's lists in: across the legends that split, grouped
beat random by 0.1, not 0.7. The average hid two stories. Per legend: Fiora +1.8 and Master
Yi, Wuju Bladesman +1.2 (that one was the Aurora pair, which policy already separates), while
Kennen −1.9, LeBlanc −0.5, Viktor −0.3 and Vex −0.1 split no better than chance, or worse. So
the half-card bar moved inside `netdecks()`, per legend, and the test asserts it both ways.
Some legends do have several decks; this says which ones the lists can show.*

**What qualifies.** A group is a **net deck** only when all of these hold:

| bar | why |
|---|---|
| 3+ good finishes | under 3 there is nothing to count; the best list is shown as played |
| from 2+ events | one event's lists can be one team's list |
| 2+ of them recorded | claims are the authors' own titles (CLAUDE.md) |
| its lists a median 9 or fewer copies from the count | the room two winners give each other (§3); further, the count describes no list |
| a legal 40 | lib/decks.mjs |

A group that misses a bar is **early**, and the page names the miss. Preview events are
labelled as previews. This format's net decks come first; the last format's follow, still
legal, because on Radiance's release day it is nearly all the evidence: three Radiance net
decks and 25 Vendetta ones (23 Oct, with that day's lists).

These bars are judgement against the sources above, not fitted; they join the frozen
thresholds and change on the same terms.

## What the guides say, and where they part from the data

- riftbound.gg's [Deckbuilding 101](https://riftbound.gg/deckbuilding-101-building-your-first-riftbound-deck/):
  9–12 low-cost units, 6–9 low-to-medium spells, more units than spells, start runes at 6/6
  and move to 5/7 or 4/8 if resources are a problem; build the main deck first.
- riftboundguide.com's [How to Build a Riftbound Deck from Scratch](https://riftboundguide.com/2026/05/12/how-to-build-a-riftbound-deck/):
  20–24 units (8–10 at 1–2 Energy, 6–8 at 3–4, 2–4 at 5+), 8–12 spells, 4–8 gear only if
  rewarded; "if a unit is good enough, run 3"; test 5–10 games and swap 2–3 cards at a time.
- **Where the data parts from them:** winners run **fewer units (18.7)** and **one
  champion copy**, and signatures at 3 or none. The guides are for a first deck; the
  numbers above are for a winning one.
- Jun ([his notes](jun.md) §7) agrees with the data on
  sideboarding: curve first, keep the unit-to-spell balance, **variety beats copies** in
  the flex.

General TCG writing on flex slots and adapting to a new set ([an example](https://marvelsnapzone.com/flex-slots-adjusting-to-the-meta/))
says the same in outline — keep a consistent core, adapt in the flex — but none we found
measures it. These numbers are the measurement for this game.
