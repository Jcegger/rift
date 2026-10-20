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
- **Champion units: one.** 77% of placed lists run exactly one copy across all of their
  champion's units — the Chosen Champion in its zone and nothing else. 2+ is rare (11%); the
  11% with none are incomplete uploads, since a legal deck must have one. Guides that suggest "up to 4" describe what is
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
the same lists**. Where they part, the pros are ahead: Yasuo's 26 posted lists play
movement; all 12 of its winners play the Spiderling swarm. So the first placings steer the
crowd — the crowd plus a legend's first two results predicts its later winners (34.9) better
than the crowd (33.8) or the results alone (30.8). Building blind from colours, with no lists
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
- Jun ([his notes](../guides/khazix-voidreaver-jun.md) §7) agrees with the data on
  sideboarding: curve first, keep the unit-to-spell balance, **variety beats copies** in
  the flex.

General TCG writing on flex slots and adapting to a new set ([an example](https://marvelsnapzone.com/flex-slots-adjusting-to-the-meta/))
says the same in outline — keep a consistent core, adapt in the flex — but none we found
measures it. These numbers are the measurement for this game.
