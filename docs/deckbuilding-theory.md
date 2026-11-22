# Deckbuilding theory, for Riftbound

The principles behind a good list, from Riot, Riftbound writers and the best of other card games, each checked
against our data where it can be. Sources and quotes: [deckbuilding-sources.md](deckbuilding-sources.md).
Measurements: [deckbuilding.md](deckbuilding.md) (re-measured 21 Nov 2026). Written 21 Nov 2026.

Two modes, and they need different methods:

- **Tuning** an existing list or net deck: the measured rules in `deckbuilding.md` (anchor, role swaps, one
  champion, signatures 3 or 0, budget).
- **Brewing** a new concept: the method in §2 below. It still anchors where it can, and it has to earn its place,
  because new decks under a legend (more than 16 copies off its consensus) placed about a third less often.

## 1. Principles

| principle | source | our data |
|---|---|---|
| **The legend sets the plan.** Its always-on ability is the strategy; the deck exists to use it. | Riot primer | — |
| **Do something worth doing.** A new deck must beat something the existing decks don't, or it's just a worse net deck. Ask what the plan *pays* you. | Chapin 2010 | Agrees: decks 17+ off consensus place ~⅓ less often, so the payoff has to be real |
| **Top-down, then bottom-up.** Survey what the field has (dominant units, cheap removal, card advantage, counters), then look for what's *missing*: a gap is where a new deck lives. | Chapin 2009 | — |
| **The field isn't random.** Build against the predicted field: "beat that, not just join it." | Chapin 2010 | `rift field`, `rift meta` |
| **Who's the beatdown.** In each matchup, one deck is the aggressor and one the controller; playing the wrong role loses. Decide it per matchup, and build so both roles are available where needed. | Flores 1999 (from memory) | — |
| **Front to back, not best case.** Write what a normal draw does on turns 1–4. Decks designed on best cases are weak. | Chapin 2009 | `rift try` goldfish |
| **Early plays, reliably.** 9+ small units; a play on turns 1–3. | Riot primer; Snap.fan | Agrees: winners run 14.3 units at 2–4 Energy and 22.5 cards at ≤2 |
| **Card quality and rate.** Cut cards that cost too much for what they do; "the right card for the job." | Chapin 2009 | Agrees: shape barely separates winners from the rest; card choice does |
| **Pillars.** Enough card advantage *and* interaction: Riot says 6+ interactive spells; Karsten says 4+ of each pillar. | Riot; Karsten (Lorcana) | — |
| **Copies by job.** Max for essentials, fewer for diminishing returns, 2 for splits, 1 for toolbox. | Karsten (Lorcana) | Agrees: 41% 3-ofs, 28% 2-ofs, 30% 1-ofs |
| **One champion; signatures 3 or 0.** | our data | Riot's "play more of your champion" disagrees: 93% of winners run one. Signatures: 55% run 3, 36% none, 10% between |
| **Few flex slots, no over-teching.** Tech that's good in every matchup; about 4 flex copies. | Snap.fan; Karsten | Agrees: core 30 / mid 6 / flex 4 copies |
| **Resources are built with the spells.** Runes 6–6, skewed toward the heavier Power domain; check colour misses. | Riot; Duke; Karsten | `rift try` "stuck on colour" |
| **Stay at 40.** | Riot; Karsten | Legal size is exactly 40 |
| **Consistency is math.** Set a target for each job ("a second-move card by the 9th card seen, 75%") and count copies with the table below. | Karsten | — |
| **Judge by conversion, not popularity.** | riftbound.gg | `rift field` placings |
| **Test before scrapping, and know the sample.** ~10 games before dropping an idea; 100 before calling a brew good; one great pilot can fake a result. | Snap.fan; LoR | Pilots matter weakly (r = 0.25) |

### Consistency table (40 cards, no mulligan)

Chance (%) of at least one copy among the first *n* cards seen. The opening hand is 4; each draw adds one. The
mulligan (up to 2 to the bottom) raises these a little.

| copies \ cards seen | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|
| 2 | 19 | 24 | 28 | 32 | 36 | 40 | 44 |
| 3 | 28 | 34 | 39 | 45 | 50 | 55 | 59 |
| 4 | 36 | 43 | 49 | 55 | 61 | 66 | 70 |
| 5 | 43 | 51 | 58 | 64 | 69 | 74 | 78 |
| 6 | 49 | 58 | 65 | 71 | 76 | 81 | 85 |
| 8 | 61 | 69 | 76 | 82 | 86 | 90 | 92 |
| 10 | 70 | 78 | 85 | 89 | 92 | 95 | 96 |
| 12 | 78 | 85 | 90 | 94 | 96 | 97 | 98 |

A single 3-of plan piece is a coin flip by the 8th card. Anything the deck needs every game wants 8+ cards doing
that job (Karsten's "rule of eight" holds at 40 too: 8 copies is 61% in the opening 4).

## 2. Brewing a new concept

1. **Field, top-down.** `rift field` and `rift meta --since <date>`: the decks to beat, their dominant units,
   removal, card advantage, counters (Defy), movement (Charm).
2. **Gap, bottom-up.** What's missing or unanswered across those decks, and which of our legend's cards exploit it.
3. **Worth doing.** One sentence: what this deck does that the legend's net deck (or Jay's current list) doesn't, and
   which matchups that should win. With no answer, stop here and tune instead.
4. **Roles.** Beatdown or control against each of the top 5. Check that the deck can play the role it needs.
5. **Anchor anyway.** Start from the nearest real list (the legend's net deck or crowd, or a proven list of a
   legend in the same domains). Keep its role-players; change by job. Count the changes: past 16 it's a new deck,
   so say so.
6. **Jobs and counts.** Each job gets a target ("by the 9th card seen, 75%") and its copies from the table. Each
   card is checked against what it depends on: a synergy needs its enabler in the list.
7. **Front to back.** Write turns 1–4 of a normal draw on the play and on the draw, not the best case.
8. **Test.** `rift try` against the benchmark, on the deck's own goal tiers and on the measure the brew was built
   for. Then about 10 games before scrapping. Report confidence low until results exist; one pilot's 10 games
   can't prove a brew.
