# decklab — building decks together

One worksheet per deck project. Not on the site and not generated: a deck here is argued
out with Jay, a step at a time. Jay owns the calls, the taste and the plan; Claude brings the
reads and the data, says how sure it is, and doesn't reverse a call without new evidence.

## The stages

Each worksheet runs in order, each stage agreed before the next.

| stage | what happens | who leads |
|---|---|---|
| **1. Identity** | the legend, its colours and champion, the archetype: what the deck *is*, and why it's worth playing | Jay, with Claude's reads of the legend and the field |
| **2. How it wins** | the plan (how it scores, what it does early, its engine, how it closes), the **goal tiers** that rank what a card is for, and its role in each likely matchup | together |
| **3. Jobs and targets** | the jobs the plan needs, with target counts, before any card is named. Targets start from what winning lists look like and bend to the plan | together; Claude brings the measured shapes (`lib/placing.mjs`, `data/archetypes.json`) |
| **4. Card by card** | every legal card read against the jobs: its role, its rules checked, its evidence, what it competes with | Claude reads, Jay decides |
| **5. Test** | every change measured the same way, whoever proposed it (below) | the tools |
| **6. Freeze and play** | the list goes out to test; it changes only when a logged game trips one of its watch items | Jay's games, in the match journal |

## Testing a change: `scripts/rift try`

```
scripts/rift try --deck "nexus night" "-Edge of Night" "+Elnuk Herd"
scripts/rift try --deck "nexus night" "-2 Rampage" "+2 Rebuke" "sb+2 Rampage" "sb-2 Rebuke"
```

Before and after, side by side (`lib/decklab.mjs`):

- **rules** — the eleven deck checks the app runs;
- **shape** — curve, Hidden, printed Power by colour;
- **goldfish** — `lib/sim.mjs` with the legend's Gold and hiding on: units by turn 2 and 3,
  stuck on colour, cards face down, and **an answer usable on their turn** (face down, or paid
  from what developing left), not cards in hand;
- **field** — the S and A tiers of `data/field.json`, each legend's legal lists weighted two
  ways (popularity: lists; results: placings): spells Defy would counter, answers per regular
  6+ Might unit and how many are free from face down, exposure to Might-limited removal, and
  a blast's reach when the deck has one;
- **answers** — for each S/A legend's units in 25%+ of its lists, the main-deck copies that
  answer them (`lib/versus.mjs`), shown only where the change moved the count, or left none.

Then read it against the deck's goal tiers from stage 2: when a worksheet has a
`decklab/<deck>.tiers.json` (its tiers' measures, with the worksheet's own targets or a
direction), `try` scores the change tier by tier, counting a change only when it beats the
shuffle's noise. Other tools for the same stage: `scripts/rift loops` (interactions and
loops from card text), `scripts/rift fight` (one combat, best play both sides),
and `try --sweep "<card>" --with "<a>, <b>"` (one slot against the named candidates).
Points come from `lib/match.mjs` and only with `--points`: whole model games against the
field's real lists on one plain policy. It is not fit to rank decks (README), so tier 0 reads
"—" without it, and the answer is the table, not the model. The tools test what was picked;
they never pick. For one matchup in detail, `scripts/rift versus <legend> --deck "<name>"`.

## Working rules

- **Every proposed change goes through `try`**, Jay's or Claude's. Nothing is in because of
  who suggested it.
- **Start from what breaks the plan**, then look for the card that fixes it, not card against
  card.
- **Each change logs a decision record** in section 5: what it fixes, the evidence, how sure
  (high, moderate, none), and the result that would reverse it.
- **Label every number**: in hand or usable, goldfish or field, popularity or results.
- **No 100%.** An untested list is untested.

Rules claims follow CLAUDE.md: handbook first, verbatim where it is load-bearing. Evidence
follows the repo's standing rules: no invented numbers, cost is never the axis, and no deck
running Dazzling Aurora.

Worksheets: [sivir-ready.md](sivir-ready.md), Sivir rebuilt around Sivir as the finisher, "Ready and Gank" (stage 2, opened 29 Oct 2026); [sivir-matchups.md](sivir-matchups.md), v1 and v2 against every S–B legend, one at a time (opened 28 Oct 2026); [sivir-v2.md](sivir-v2.md), Sivir v2 on the winners' job structure (stage 3, opened 28 Oct 2026; v1 stays in play); [archetype-taxonomy.md](archetype-taxonomy.md), the archetype map (stage 1, opened 27 Oct 2026; not a deck, run the same way). The Sivir and Kai'Sa worksheets were retired on 26 Oct 2026, and the Sivir bench on 28 Oct (git history); the deck in play is `guides/sivir-trying-her-best.md`.
