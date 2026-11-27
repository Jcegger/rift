---
name: deck-brew
description: Building a Riftbound deck from scratch with Jay, in gated stages that confirm the deck's identity before any card is picked. Use for "build from scratch", "brew", "new concept", "rebuild around X". Reached from deck-build; for a list that starts from a net deck, use deck-netdeck.
---

# Brewing a deck from scratch, gate by gate

Jay argues the early stages out with you; tools test what was picked and never pick. The one from-scratch attempt so
far (Draft B, 21 Nov, `decklab/sivir-new.md`) jumped to cards, broke the measured rules, and was shelved. The cure is
the **gate**: a stage ends only when Jay confirms it in his own words. Quote them in the identity block's `gates`, with
the date and `"confirmed": true`. Your proposal, his "sounds fine" to a question he didn't get to answer, or silence
don't count as a gate. At each gate, stop the turn on the question.

Every stage writes into one worksheet: copy `decklab/_brew-template.md` to `decklab/<legend>-<concept>.md` before
stage 1.

## Before stage 1

Read the `deck-build` skill's "Read first" list (deckbuilding.md, theory, archetypes, strategy) and its pre-flight.
Done when you can name the measured rules this brew must meet (one champion copy, signatures 3 or 0, change budget,
core / flex) without looking.

## Stages

1. **Field, top-down.** `rift field --tiers`, `rift meta --since <format start>`, `rift field --for <legend>`. Write the
   top 5 decks to beat: their dominant units, removal, Defy, Charm and speed, each with its count.
   **Gate 1:** Jay confirms the top 5 we build against.
2. **Identity, in stages: one gate each** (memory `identity-by-phase`). Ask Jay questions at every stage rather than
   presenting a finished identity.
   - **2a, direction:** 2–3 options. Each names its engine in card text (every rules premise goes through the
     `rules-question` skill), the gap in the field it uses, and the legend line it pays off. Must-haves are decided
     here, together. Jay picks one.
   - **2b, early** (turns 1–3): what the deck does, and what it must stop.
   - **2c, mid** (turns 4–6): how it builds its advantage, and what it spends.
   - **2d, lethal:** the exact closing turn from 6–7 points, on which turn, and what breaks it.
   - **2e, gives up:** what it is weak to, on purpose.

   Write each phase to the block (`early`, `mid`, `lethal`, `givesUp`; `plan` and `winCondition` sum them up) and
   quote Jay's words for each gate.
3. **Worth doing, and roles.** The `worthDoing` sentence (what it does that the net deck and Jay's current list don't,
   and which matchups that wins), then beatdown or control against each of the top 5. With no honest sentence, the
   brew ends here: say so and offer `deck-netdeck` or tuning. **Gate 3.**
4. **Goal tiers and yardstick, set before any card.** The tiers the deck is judged on, and the yardstick with the result
   that would kill the concept. They stay fixed from here on, so the list can't win only on the measure it was built
   for. **Gate 4.**
5. **Jobs and counts.** Each job gets a target ("one by the 9th card seen, 75%") and its copies off the consistency
   table (`docs/deckbuilding-theory.md`). Use `lib/jobs.mjs` job names where they fit; name the cards for any other
   job. **Gate 5:** Jay confirms the jobs and counts.
6. **Anchor, then cards by job.**
   - **Anchor:** the nearest real list (`rift ideas <legend>`), or Jay's current deck. Keep its role-players.
   - **Cards:** `rift pool <legend> --job <job>` for each job. Pick evidence first, and label every card proven here,
     crowd here, proven under X (say whose legend proved it, and what that legend gave it) or theory.
   - Write the list to `decklab/<legend>-<concept>.deck.txt` (paste text), never to the app.

   Done when every job's copies meet its count and the list is 40.
7. **Audit.** Run `rift identity --file <draft>.deck.txt --id <worksheet> --anchor <anchor>`. Then fix or argue for every FAIL, NEW,
   jobless card and stranded enabler. Then write turns 1–4 front to back, a normal draw, on the play and on the draw.
   The audit can't see conditions like "4+ units here" (Bedeviling Stranger needing Faefolk), so read every kept
   card's text for what it relies on. **Gate 6:** Jay reads the draft card by card and confirms it is still the
   identity from gate 2.
8. **Test.** The same test for every change (memory `coop-deckbuilding`):
   - real data first: `rift lifts --legend <L> --deck file:<name>` where 5+ good and 5+ other lists exist;
   - then `rift try --file`, `rift search --file`, `--close`, quoted as mechanism checks, never win rates;
   - the benchmark beside it, on the goal tiers and the yardstick.

   State confidence (low until games exist) and the result that would reverse it.
9. **Freeze.** Only on Jay's yes: `deck-write` puts it in the app. Write watch items, and play about 10 logged games
   before scrapping the concept. Add a line to HANDOVER.

Done when the worksheet has every gate quoted, the audit is clean or every exception is argued, and Jay has the
tested list with its confidence.
