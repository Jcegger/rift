# Picking a deck with Next

The Next tab answers one question — *what do I build?* — and the panel that answers it
is **Find my deck**. This is how it thinks, how to steer it, and how to read what it
tells you.

## The ranking: tier first, then cost

Every archetype riftbound.gg ranks is crossed with your collection and sorted:

1. **already buildable** (own every card)
2. **fits your budget** (if one is set)
3. **tier** — Tier 1 is best
4. **gap cost** — cheapest to finish, within the tier
5. rank inside the tier, then name

The order that matters is **tier before cost**. A Tier 2 deck that costs $40 outranks a
Tier 3 deck that costs $3, because cheaper is not better — the cheapest thing to finish
is almost never the deck you actually want. If you want the pure cost ordering it is
right below, in **Every open deck, by cost**.

"Best" comes from [riftbound.gg's weekly tier list](https://riftbound.gg/tier-list/),
scraped into `data/tiers.json` and cited on the Meta tab. The app does not invent a
power score — it borrows one. Prices are the cheapest printing of each card from
dotgg's per-printing data.

## The three constraints

None of these is a form. They are controls on the panel, all synced across devices.

### Budget — soft

Type a dollar figure into **Budget $**. It does **not** hide what is over it — the best
deck is often more than you want to spend right now, and hiding it defeats the point. It
greys the rows that do not fit, names the best pick that does, and adds one line:

> $98 more unlocks Tier 1 Kennen — Heart of the Tempest ($398).

Blank or `0` means no budget: pure tier order, nothing greyed. Stored in `nearSpend`.

### Only legends I own

Owning the Legend is usually the single most expensive card in a deck, and it is a cost
you have already paid. Tick this to narrow the list to archetypes whose Legend is in
hand; those rows carry a **●**.

### Won't buy

Click any chase card in a gap — a $60 Legend, a $37 gear you would rather not be the
person playing — and the tool stops costing every deck as if you would buy it, from then
on. It leaves a chip you click to undo. Stored in `noBuy`, by card name.

This is the honest way to say "not that card": the gap math recomputes without it, so a
deck that was $190 with the card shows its real price without it, and a deck that
*needs* it drops down the list.

## Reading a row

```
● Tier 2  Kai'Sa — Daughter of the Void · spell combo-tempo · best #2
          $7 in 15 cheap cards + Kai'Sa, Survivor @ $68   [2 picks / 9 ▸]
          $76 · 23 short · $140 list
          played $210 · 31 short
```

- **●** — you own the Legend.
- **Tier 2** — riftbound.gg's placement.
- **spell combo-tempo** — the deck's shape, computed from its card types:
  `unit midrange` / `spell combo-tempo` / `gear engine` / `mixed`. Answers "is this an
  engine?" without a human in the loop.
- **best #2** — the archetype's best finish on tournament record, when there is one.
- **the breakdown** — where the money is. Not a flat missing-card list: the cheap bulk
  as one figure, then the price spikes named. `$76 · 23 short` that reads as
  `$7 + Kai'Sa, Survivor @ $68` is telling you the deck is basically $8 plus one chase
  card — click that card in the breakdown to exclude it and see the cheap build.
- **build ↗** — that Legend's guide and decklists on riftbound.gg.
- **[2 picks / 9 ▸]** — opens every individual build folded into the row: the
  most-played one, the best tournament or claimed result, the cheapest well-viewed one,
  then all nine most-viewed first. Pin any of them to make the whole tab follow it.
- **played $210 · 31 short** — what the *most-played* build of this Legend costs you.

### Why a row quotes two prices

The main figure measures the list closest to your collection, which is usually the
cheapest and often a precon. That number is true and misleading on its own: on one
snapshot it read `$13 · 9 short` for Rengar, against a 14-view budget list, while the
build people actually play was `$302 · 29 short`. Thirty-seven of forty-nine archetypes
disagreed the same way, and one of the cheap anchors was a list called
`Nasus - Default`.

So the row carries both, and adds `· budget list` when the cheap figure it is quoting
is the budget pick. **A row with no second line is the useful case** — it means the
list nearest your collection *is* the one people play, so the price you are reading is
the real deck.

The second line is hidden while the archetype is expanded, since the picks underneath
already break it down list by list.

## The helper lines above the list

- **Best pick** — the top row, restated, with its breakdown. If a budget is set, the
  best that fits.
- **$X more unlocks …** — the best deck a little more money would reach: a better tier,
  or the same tier just over your budget.
- **Low-risk first buy** — when the best pick is a real investment (> $50) and something
  two tiers cheaper sits under $15, it gets named. Not "buy this instead" — cheaper
  isn't better — but a cheap way to learn the game before committing real money.

## What it deliberately does not do

- **Encode "annoying" or "fun".** The app cannot know that. Tier is a rough proxy (a
  Tier 1 deck is often the one the room is sick of); the rest is a judgement call.
- **Fabricate a power number.** There is no blended score. Strength is riftbound.gg's
  tier, shown as a tier, and nothing more.
- **Filter by tier.** Tier 1 decks are shown like any other. If you do not want one,
  that is what "won't buy" and your own judgement are for.

## A worked read

Deep-ish collection, engine-lover, ~$300, wants to win, mostly casual:

1. **Budget $300.** Best pick within budget surfaces; the greyed rows show what a
   bigger budget would reach.
2. **Only legends I own.** The list drops to the Legends already in hand — the fastest,
   cheapest paths, because the biggest card is bought.
3. Scan the **breakdowns.** A $76 deck that is `$7 + one $68 card` is a $10 deck with an
   optional chase. Click the chase card → it is gone, and the real number shows.
4. Read the **composition tags** for the shape you want — `gear engine` if you like
   building a machine, `unit midrange` to learn combat with the fewest moving parts.
5. Take the **low-risk first buy** if the deck you want is expensive: learn on the $3
   deck, save the $300 for the one you actually want.
