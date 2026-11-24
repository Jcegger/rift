# Builder research: what could make the deck tools better

Started 24 Nov 2026, alongside the builder work (blind spots, the worker pool, intervals, `rift search`,
`rift calibrate`). Each item says what it would change, what it costs, and what we know. **Nothing here gets built
without Jay's yes.** When an item is built or dropped, move it to the end with the date and the commit.

## What we learned building it (24 Nov)

- **The deals pair exactly, the games don't.** Only the shuffle draws on a game's seed, and a changed list keeps the
  old list's order (`deckOrder`). Still, one different card changes both solvers' lines from the first turn it's
  drawn, so before and after barely correlate. Per-game margin spread is about ±4.5 points, which gives a 95% interval
  of about ±0.8 at 120 games. One-card swaps read within ±0.3, so they need roughly 800+ games each.
- **The model sees harm, faintly.** Three dead off-domain cards read −0.68 at 120 games, inside the noise. Six read
  −1.32, outside it.
- **Speed.** 16 workers on a queue (half the threads). `try --points --close` went from 5m53 to 1m03. A 7-candidate
  search at 120 games each takes about 3 minutes.
- **Calibration** (`docs/model-calibration.md`, solver policy, 1,584 games): **the model doesn't track real results
  yet.**
  - Per legend: r 0.17, mean error 13 points, the right side of 50% for 8 of 12.
  - Sett and Ornn sink it (15% and 17% in the model, 53% and 49% real). Without them r is 0.53 and the error 8.8.
  - Overrated: Viktor (+18), Riven, Mordekaiser, Ezreal (+12 to +16). Underrated: Vex (−9), the most reactive deck.
  - Pairs with 30+ real games: 3 of 9 on the right side of 50%, though every interval overlaps (24 model games a pair).

  Until this improves, search and try numbers rank swaps inside the model; they aren't evidence a swap wins real
  games.

## Candidates

In the order the calibration suggests: first what makes the model wrong, then what makes it cheaper.

0. **Why Sett and Ornn lose in the model.**
   - **Sett: found and fixed** (aa2198b, 24 Nov). Fiora, Victorious's Mighty keywords recursed until the solver threw,
     and the match skipped the Main Phase: 11 times in 6 games. Sett 15% → 43% (real 53%); r 0.17 → 0.29, error
     13.1 → 10.2. A check.mjs gate now fails on any solver error in a calibration legend's game.
   - **Ornn: still 14% (real 49%), and not the search budget.**
     - At 600 nodes Ornn is the same 14%, and r drops to 0.27 overall.
     - Traced turn by turn (24 Nov), the solver's own turns are sensible: a 2-drop on turn 1, empty battlefields
       conquered, Sterak's Gage attached for a 6-Might attack.
     - Its small units then die defending on the opponent's turn.
     - Suspects, to check in this order:
       1. How the match plays our side on *their* turn: defending, Reactions. Ornn's Defy ×3 and Charm are held up in
          reality.
       2. Whether the best-placed list is representative: `topLists` picks one list; try the crowd list.
       3. Twelve turns to 8 points favours fast decks; check how often Ornn games would have gone longer.
     - Next step: play Ornn's top 3 lists against Nasus with a per-turn log of their turn too (a `trace` hook in
       playMatch for both sides).

1. **Hidden hands in model fights.** Both sides see each other's hand when the fight calculator plays combat tricks
   (lib/match.mjs header). Reactive decks get credit for tricks the opponent would have played around, and proactive
   decks get punished for walking into them. Fix: sample the hand from the opponent's list for the fight search
   (determinization). Cost: medium (fight.mjs plus match.mjs; a test that open-hand and sampled agree when the hand
   is empty). Would change: matchups that turn on tricks. Check it against the calibration table's worst legends.
2. **Variance reduction for search.** Pairing on deals isn't enough (see above). Options:
   - Common random numbers inside the solver: seed its tie-breaks per turn, not per game.
   - Antithetic seats: always play each deal from both seats and average the two.
   - A control variate: regress the margin on "the swapped card was drawn by turn N" and read the effect only from
     games where it was.

   The last is the cheapest and most direct: a swap can't matter in games where neither card was drawn, about half the
   games for a 1-of by turn 8. Cost: small (records carry when each changed card was drawn). Would change: the games
   needed per swap, perhaps by half.
3. **Sequential stopping.** Stop a candidate once its interval against the leader is decided, rather than at fixed
   doublings. Small. Mostly saves time on clear losers, which halving already drops.
4. **Weight the field by meta share.** Today foes come round-robin over the S/A lists (`i % n`), so a legend with
   many posted lists dominates. Weight by share of placings or of RiftLite games instead. Small. Would change which
   matchups the margin averages over.
5. **Sideboard mode for search.** Play the swaps against one legend's lists only (`--vs <legend>`), for sideboard
   plans (sivir-tune.md S1, S2, C5). Small: foes filter plus the existing halving.
6. **Mulligans in model games.** The goldfish has a mulligan guide; model games keep every opening hand (lib/match.mjs
   has no mulligan step). Using
   the guide's keep rule in `playMatch` would make early turns more realistic. Small to medium.
7. **Goldfish card selection: Predict, Vision, Flow.** These are the keywords left that change goldfish numbers (`rift
   try` names them). Each needs a play policy: what to recycle when you look at the top, when to recast from the
   trash. A guessed policy would move numbers by how good the guess is. None is in Sivir Is Trying Her Best. Build
   only when a deck Jay plays runs one.
8. **More real data for calibration.** RiftLite's pairs top out around 50 games, so per-matchup truth is ±15 points.
   Options: a longer RiftLite window, paper event match results where pairings are published (`data/events`), and
   Jay's journal once it has 50+ games per deck. Data only, no code. Would change how sharp the calibration can be.
