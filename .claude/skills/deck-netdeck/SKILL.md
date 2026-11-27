---
name: deck-netdeck
description: Building Jay's deck from a net deck: pick a winning list, confirm he wants to pilot it, then change only its flex slots for his field. Use for "net deck", "what should I play", "pick up <legend>", "start from the winning list". Reached from deck-build; for a new concept use deck-brew.
---

# Building from a net deck, gate by gate

The crowd's lists share about 33 of 40 cards with eventual winners (`docs/deckbuilding.md`), so a net deck is the
strongest start there is. The work is choosing which one, confirming Jay wants to pilot it, and touching only its flex.
A **gate** ends a stage only when Jay confirms it in his own words. Quote them, with the date, in the worksheet's
identity block (`decklab/_brew-template.md`, `"mode": "netdeck"`), and stop the turn on the question.

## Stages

1. **Legend.** Rank candidates by conversion, not popularity: `rift field --tiers`, `rift poll`, `rift meta --since
   <format start>`. Then read them against his taste (memory `deck-taste`: engine decks with decisions, nothing
   oppressive at a casual night) and never Aurora (`lib/avoid.mjs`). Offer 2–3 with one line each on how they win.
   **Gate 1:** Jay picks the legend.
2. **The list.** `rift ideas <legend>` shows the groups (net, early, crowd), their finishes and events, and the closest
   real list. Recommend one group and say why. **Gate 2:** Jay picks the group. Write its count to
   `decklab/<legend>-net.deck.txt`, taking the closest real list's 40, or the group count when that's within a card.
3. **Its identity, read off the list.**
   - Fill `plan`, `winCondition` and `givesUp` from `docs/archetypes.md` and the list itself.
   - Run `rift identity --file <list>.deck.txt --anchor net` for jobs, core / mid / flex and the rules.
   - Write turns 1–4 on the play and on the draw, and the decisions the pilot makes each turn.

   **Gate 3:** Jay confirms this is a deck he wants to pilot: how it wins, and the decisions it asks of him.
4. **Flex only.** A budget of 6–9 changes, about 4 flex copies, and core cards (80%+ of lists) untouched.
   - **Candidates:** `rift lifts --legend <L> --deck file:<name>` (good finishes' choices, with intervals), `rift rising
     <legend>`, and his local field (`rift journal`, `rift field --for <legend>`).
   - Each change is a role swap with a reason (the `deck-build` pre-flight), checked with `rift try --file` as a
     mechanism check.

   **Gate 4:** Jay approves each flex change.
5. **Sideboard and freeze.** Sideboard against the top 5 with `rift versus <legend> --file <list>.deck.txt`. Then
   `rift identity` once more: every rule ok or argued. Freeze; `deck-write` only on his yes. Write watch items, and
   add a line to HANDOVER.

Done when the worksheet quotes gates 1–4, the list is within budget of its net deck, and Jay has it with what would
make him change it.
