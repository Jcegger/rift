---
name: deck-build
description: Proposing a deck, list, card swap or sideboard for Jay, or judging whether one is better. Use for "build me a deck", "is this list better", "what should I cut", "should I play X", brews, rebuilds and sideboard plans. Before any list or swap reaches Jay.
---

# Building or changing a deck

`docs/deckbuilding.md` is measured from placed lists: how winners actually build. A list
built from card text alone, or from theory about an engine, has failed every time this repo
tried it. On 21 Nov 2026 a "from scratch" Sivir broke five of the doc's rules in one draft
(two champions, a split signature, ~20 changes, a synergy cut from under a kept card, and
"proven" cards that were proven under another legend). So the doc comes first, every time.

## Read first

1. **`docs/deckbuilding.md`**: its "What this means for building a deck" list is the rule
   set. The rest says where each rule comes from.
2. **`docs/archetypes.md`**: what the legend's deck is for.
3. **`docs/strategy.md`** §2–3: the problem the deck solves, and what its resources become.
4. **Tools:** `scripts/rift ideas <legend>` (the net deck or crowd, and how far Jay's deck
   sits from it), `rift rising <legend>`, then `rift try` and `rift versus` for each change.

## Pre-flight

A list or swap goes to Jay only after every line below is true, or is named as broken with
the reason:

- **Anchor:** it starts from a named list (a winner's, the legend's consensus, the crowd, or
  Jay's own current deck) and says which.
- **One champion unit**; **signatures at 3 or 0**, and only the legend's champion's
  (another legend's signature is illegal: §103.3.d).
- **Change count** against the anchor, stated. Budget 6–9; past ~16 it is a new deck and is
  called one.
- **Role swaps:** each change names the role, the card out, the card in, and the reason
  (better at the role, an answer to the field, or a research "test").
- **Synergies intact:** every kept card's enabler is still in the list.
- **Evidence under this legend:** "proven" means proven with this legend. A card proven
  under another legend says whose, and what that legend gave it.
- **The yardstick is set before building**, and the result is reported on the deck's own
  goal tiers too, so a list can't win only on the measure it was built for.

Then the house rules: co-op stages and the same test for every change (memory
`coop-deckbuilding`), confidence stated with what would reverse it, rules premises through
`rules-question`, and any app change through `deck-write`.
