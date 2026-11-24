# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-24 (end of session)

## State

- Main deck: **Sivir Is Trying Her Best**, back to Jay's earlier list since 24 Nov (Ride the Wind ×3 main; Acceptable
  Losses in the sideboard; 9eab02c, row backed up in `backups/state-pre-ridethewind-2026-11-24.json`). Guide, both
  sheets, the brief and the worksheet log match it; reMarkable and Kobo have it. Jay: "we can work on changes later now
  that our system is better."
- **The turn solver reads every card and legend** (`lib/cardtext.mjs`, `lib/turn.mjs`, `lib/fight.mjs`): 963/963 legal
  cards and 58/58 legends, every printing and errata wording (check.mjs gates all three). No known simplifications or
  blind spots are left; the rules premises behind it are `docs/rules-rulings.md` "Turn solver premises" (1)–(10) and
  "Fight solver premises". Commits 3c078c7 through e32f6b5 (24 Nov); turn tests up to 205.
- **Model games are played by the solver** since e32f6b5 (`lib/match.mjs` `policy: "solver"`; `--greedy` for the old
  policy). `try --points`/`--close` default to 60 games, about 2 minutes for both. Numbers from before 24 Nov aren't
  comparable (Sivir deck: points by turn 8 6.75 vs 5.58; close from 7 40%).
- How a card is done (if a new set lands): `rift cards "<name>"`, an override in `lib/cardtext-overrides.mjs` or grammar
  in `lib/cardtext.mjs`, an op in ENGINE_OPS and RUN_OPS + an applyOp case, a closing-turn test with its no-win twin.
- Rules, play advice, deck proposals and deck writes go through the `rules-question`, `play-advice`, `deck-build` and
  `deck-write` skills. rift commits and pushes finished work once `scripts/check.mjs` passes.

## Next

1. **Sivir changes after the first post-ban weekend (29–30 Nov) and games.** Judge any swap with the rebuilt system:
   `rift try --deck "Sivir Is Trying Her Best" "-N Card" "+N Card" --points --close`. Candidates on file:
   `decklab/sivir-tune.md` (first: −1 Ember Monk +1 Ezreal) and `decklab/sivir-brew.md` (Bounty Board, low confidence);
   their numbers predate the solver-played games, so re-run them. Deck work through the `deck-build` skill.
2. **After 29–30 Nov:** re-read Riven, Irelia and Renata Glasc, Chem-Baroness in `docs/archetypes.md` from post-ban
   lists and take them off `KNOWN_MISSES` (`lib/engines.test.mjs`, TEMPORARY). The post-ban field is thin until then
   (`scripts/rift meta --since 2026-11-23`); no matchup advice from it yet. Guide §9 rows are pre-ban (its note says so).
3. **Check on the devices:** the Kobo's new "Riftbound" reading collection and "Questions" sheet (kobo HANDOVER item 0);
   the site's tweak bench now loads `lib/cardtext.mjs` in the browser (lib/sim.mjs imports it): open rift.jayegger.com's
   bench once to confirm it still runs.
4. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong; fold corrections into the handbook or
   memory.
5. **Goldfish gaps** (README, "Keywords the sims do not read"): the bench measures consistency only; Trinity Force's hold
   point, Level/Hunt, Weaponmaster, Quick-Draw and Legion still aren't in it (the solver-played model games do read them).
6. **Refresh timing:** GitHub fires the scheduled runs 4–10 hours late and sometimes skips one; if that starts to matter,
   start the refresh from a scheduled cloud agent and keep one GitHub cron as a backup.
7. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).
