# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-25 (master measured; fixes 14–15 (Mordekaiser, Irelia, Fervent); Ornn read as play policy)

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
- **Builder tooling (24 Nov, second session; Jay: build the tools before any swap):**
  - Model games run on a 16-worker pool. `try --points --close` went from 5m53 to about 1 min.
  - Every before → after prints a 95% interval and "within noise".
  - A swap keeps the deck's card order, so a null swap reads exactly 0.
  - New: `rift search` (many swaps, halving, intervals) and `rift calibrate` (model vs RiftLite).
  - The bench names the goldfish keywords it skips.
  - Two findings set the agenda (README "Swap search" and "Calibration"; `notes/builder-research.md`):
    - **One-card swaps are inside the noise at 120 games**, so they need about 800+ games each.
    - **The model doesn't track real results yet**: r 0.17 per legend (`docs/model-calibration.md`). Sett and Ornn
      sink it; without them r is 0.53. Until that's fixed, model numbers rank swaps inside the model only.
- How a card is done (if a new set lands): `rift cards "<name>"`, an override in `lib/cardtext-overrides.mjs` or grammar
  in `lib/cardtext.mjs`, an op in ENGINE_OPS and RUN_OPS + an applyOp case, a closing-turn test with its no-win twin.
- Rules, play advice, deck proposals and deck writes go through the `rules-question`, `play-advice`, `deck-build` and
  `deck-write` skills. rift commits and pushes finished work once `scripts/check.mjs` passes.

## Next

0a. **Model misreads and the calibration (25 Nov).** Detail: `notes/miss-trace-2026-11-25.md`; numbers:
   `docs/model-calibration.md` "25 Nov runs"; the bar before `rift build` is in that doc's top section (Jay, 25 Nov).
   - **On master:** fixes 1–13. Gear can be killed or bounced (Offer works); each side plans against guessed face-down
     cards (fix 2, `--open-down` turns it off); spell follow-ons, rune readying, fight spells and keyword tricks, Decree,
     Deathgrip, Ki Barrier, escapes, Riposte, Repulse, attack/defend triggers, Not So Fast's targets, Guardian Angel and
     Brutalizer (fix 13, 50a0a34). Hold-up code merged as flags: `--hold-up W`, `--caution C`, `--no-defend-all`.
   - **Results (20 legends, today's data):** r 0.30 with every fix; the pre-fix model (c2e7a80) scores 0.31, so 24 Nov's
     0.11 → 0.30 is the data. Hold-up 0.5 and 1 aren't better (0.31, 0.26) and push Irelia down (39% → 32%, real 61%),
     so the default stays 0. Narrow swap run: r −0.58 with fix 2 (0 of 7 same sign); bar item 2 is far off.
   - **Done 25 Nov (second session):**
     - Master measured: r 0.30, 12.2 error, Ornn still 16%, so fix 13 didn't move him.
     - `--hidden --caution 0.5`: r 0.25, so it stays opt-in. It lifts Ornn to 29%, Diana to 35% and Irelia to 43%.
     - Fixes 14 (Mordekaiser, Dominating's discard-to-kill) and 15 (Irelia, Fervent's +1 when chosen).
     - The empowered states (Steel Paws, Kayle, Ambessa) and Sett's buff were already right.
     - Thrill of the Hunt and Deathgrip from base are parked.
     - Ornn's games read: no misread; it's play policy.
     - `rift trace --full` and `--open-down` added.
     - Detail is in the notes, "Still unread" and "Ornn's games read".
   - **Next, in order:**
     1. A 20-legend run with fixes 14–15 in (the first step after this push), as its own row.
     2. Ornn and the reactive decks as play policy, behind a flag and measured against the calibration:
        - attach Equipment before developing more units;
        - hold runes for Defy when the hand has it;
        - start from what `--caution` changes, since it's the one setting that lifts all three (Ornn, Diana, Irelia).
     3. Reckless Innovator is still overrated (−Offer +Innovator: model +0.31, real −0.22): a policy lead, not a
        misread (Main 4 isn't it).
     4. Irelia's games with `rift trace --full`, as for Ornn: what she holds up (Defy, Not So Fast) and when.
     5. After 2026-11-30: both calibrations again on post-ban data (bar item 3).
   - **Tools:** `calibrate --swaps --only "<legend>;…" --card "<card>;…"` (narrow run), `rift trace --only <legend>
     --out "<card>" --in "<card>" [--games 60] [--verbose N]`.
   - **riftjudge.com:** the `rules-question` skill's last lookup step, verified answers only, as a lead (Jay, 25 Nov).
0. **Make the model track real results.** Done 24 Nov:
   - Fiora's crash fixed (Sett 15% → 43%); solver errors are reported and gated.
   - Budget tested: 150 nodes stays (600 and 2000 are worse).
   - Hidden hands built (`--hidden`; less extreme but not clearly better over 20 legends, so it stays opt-in).
   - r prints with its interval; 20-legend runs.

   Where it stands (25 Nov): r 0.30 over 20 legends (−0.16 to 0.66), mean error 12.5 points, the model too extreme
   (13–80% vs real 31–69%). Next, from `notes/builder-research.md`:
   - The biggest misses: Ornn (16%, real 49), Diana (26%, real 53), Irelia (39%, real 61), Volibear (63%, real 35),
     Ekko (66%, real 35). Add a `trace` hook in `playMatch` that logs
     both sides' turns, and read their games against Nasus. Ornn's own turns look sensible; its units die on the
     opponent's turn.
   - Why the model is too extreme: snowballing in 12-turn games? Compare its win rates by game length.

   Re-run `rift calibrate --legends 20` after each fix (14 min) on the same `data/winrates.json`. Target: r's interval
   above 0. Until then, model numbers rank swaps inside the model only.
1. **Sivir changes after the first post-ban weekend (29–30 Nov) and games.** Candidates are in
   `decklab/sivir-search.json` (sivir-tune.md C1, C1b, C3, C4, C5 plus a dead-card plant):
   `rift search --deck "Sivir Is Trying Her Best" --cands decklab/sivir-search.json --budget 6000`. Read it against
   the calibration. Deck work goes through the `deck-build` skill. Bounty Board (`decklab/sivir-brew.md`) is a whole
   list, so it gets a `try`, not a search.
2. **After 29–30 Nov:** re-read Riven, Irelia and Renata Glasc, Chem-Baroness in `docs/archetypes.md` from post-ban
   lists and take them off `KNOWN_MISSES` (`lib/engines.test.mjs`, TEMPORARY). The post-ban field is thin until then
   (`scripts/rift meta --since 2026-11-23`); no matchup advice from it yet. Guide §9 rows are pre-ban (its note says so).
3. **Check on the devices:** the Kobo's new "Riftbound" reading collection and "Questions" sheet (kobo HANDOVER item 0);
   the site's tweak bench now loads `lib/cardtext.mjs` in the browser (lib/sim.mjs imports it): open rift.jayegger.com's
   bench once to confirm it still runs.
4. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong; fold corrections into the handbook or
   memory.
5. **Goldfish gaps:** only Predict, Vision, Flow and resource-making Level/Legion/Repeat lines change goldfish numbers
   (README "Keywords the goldfish does not read"). `rift try` names them. Each needs a guessed play policy, so they get
   built only when a deck Jay plays runs one (research log item 7).
6. **Refresh timing:** GitHub fires the scheduled runs 4–10 hours late and sometimes skips one; if that starts to matter,
   start the refresh from a scheduled cloud agent and keep one GitHub cron as a backup.
7. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).

## Decided

- 2026-11-25: a swap result at 240 games is noise (±0.6 margin); confirm a disagreement at 2000 games with a narrow
  run before tracing it.
- 2026-11-25: hold-up stays opt-in (default 0): over 20 legends it wasn't better and moved Irelia the wrong way.
- 2026-11-25: fix 2 (face-down cards hidden) merged: not worse over 20 legends, narrow r −0.77 → −0.58.
- 2026-11-25: the gear-target fix stays whatever it does to the numbers (a plain bug); hiding face-down cards stays
  only if the calibrations don't get worse.

## Rejected

- 2026-11-25: blaming Reckless Innovator's reading. Its text is read right; it wins in the model because the cards it's
  compared against are broken there.
