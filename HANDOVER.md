# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-25 (swap trace: two model misreads found)

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

0a. **Swap disagreement: two misreads found, fixes planned (25 Nov).** Detail, numbers and the plan:
   `notes/swap-trace-2026-11-25.md`.
   - At 2000 games a swap, the Yordle/Rengar swaps of Reckless Innovator, Edge of Night, Ride the Wind and Nidalee
     disagree with good finishes for real: r −0.76 over 9 swaps, the sign wrong in all 7 clear ones. The 24 Nov
     table's r 0.31 over 64 swaps still stands (`docs/model-calibration.md` "Swaps").
   - Causes: "Kill a gear" never finds a target, so An Offer You Can't Refuse is dead in model games; and each side sees
     the other's face-down cards, so Edge of Night (and every [Hidden] card) never ambushes.
   - New tools (c2e7a80): `calibrate --swaps --only "<legend>;…" --card "<card>;…"` (narrow re-run of the same
     swaps; `--write` refuses on it), and `rift trace --only <legend> --out "<card>" --in "<card>" [--games 60]
     [--verbose N]` (when a swapped card is drawn and leaves the hand; turn logs with the solver's lines).
   - **Fix 1 done (25 Nov, 8051bd4, on master):** "kill a gear" finds targets (their Equipment, loose gear, Gold tokens).
     16 cards were affected. Offer now leaves the hand in 15 of 24 draws (was 4). Tests 161c–f.
   - **Fix 2 written, on branch `hidden-down` (a846638), not merged:** each side plans against guessed face-down cards
     and replays the plan against the real ones (`--open-down` turns it off). Tests 161g–i. It is merged only if the
     calibrations don't get worse (Decided).
   - **Measuring (started 25 Nov, home PC, running from pinned copies of the code):** narrow run and
     `calibrate --legends 20`, first at 8051bd4, then at a846638. Compare with r −0.76 (narrow) and r 0.11 (20 legends).
     If a session ends before they finish, re-run them.
   - **Fix 3 done (25 Nov, a624dbb, on master):** a spell's follow-on acts on its choice. 10 spells did nothing in model
     games (Challenge, Rampage, …; `notes/miss-trace-2026-11-25.md`). Its narrow run and 20-legend run are queued after
     fix 2's, at a624dbb (fixes 1 and 3; `hidden-down` predates it, so merge master into it if it stays).
   - **Fixes 4 and 5 (25 Nov, master):** "ready up to 2 runes" now readies runes (eff6c25), and keyword tricks play in fights
     (23b43f4; `lib/fight.mjs` read 94 fight spells as blank). The remaining blank fight spells are in
     `notes/miss-trace-2026-11-25.md`.
   - **Fixes 6–9 (25 Nov, master):** Decree, Deathgrip, Ki Barrier, escapes (Flash, Emperor's Divide, Retreat), Riposte,
     Repulse, the fight spells and Siren's Song now play in fights. Model games also never passed any of these to a
     fight (`trick()` filter; now `fightPlays()`). Detail and what's left: `notes/miss-trace-2026-11-25.md`.
   - **Runs (one queue, home PC, restarted 25 Nov about 11:40, since the first queue measured pre-fix-4 code):**
     `calibrate --legends 20`, then the narrow run, each on ede1589 (master, all misread fixes) and on 2bff612
     (`hidden-down`: master + fix 2). They decide fix 2 and give the new baseline. If the session ends first, re-run
     them.
   - **Fix 10 (25 Nov, 1df95b7):** gear can be killed or returned mid-fight (Offer, Detonate, Factory Recall, …).
   - **First results (20 legends, RiftLite data regenerated 25 Nov):**
     - master ede1589: r 0.30 (−0.17 to 0.65), error 12.3, 11 of 20 on the right side of 50%;
     - with fix 2: r 0.30 (−0.16 to 0.66), error 12.4, 12 of 20.
     - Fix 2 is not worse here; the narrow runs decide.
     - The old r 0.11 was on 24 Nov's data, so part of the change may be the data. To separate them, run the pre-fix
       model (c2e7a80) on today's data, once the queue is done.
   - **The bar before `rift build`** is in `docs/model-calibration.md` (Jay, 25 Nov). Until it's met, keep fixing misreads;
     no swap advice from model numbers.
   - **riftjudge.com (checked 25 Nov):** a fan Q&A site; an AI writes the answers and community arbiters verify them.
     It's current (rules of 2026-10-09), with no API and no reuse terms. Use it only as a lead in the `rules-question`
     skill (verified answers only, never cited as a ruling); it adds nothing to the errata. Added as the skill's last
     lookup step, for when sources 1–4 leave us unsure (Jay, 25 Nov).
0. **Make the model track real results.** Done 24 Nov:
   - Fiora's crash fixed (Sett 15% → 43%); solver errors are reported and gated.
   - Budget tested: 150 nodes stays (600 and 2000 are worse).
   - Hidden hands built (`--hidden`; less extreme but not clearly better over 20 legends, so it stays opt-in).
   - r prints with its interval; 20-legend runs.

   Where it stands: r 0.11 over 20 legends (−0.35 to 0.52), mean error 14 points, the model too extreme (16–81% vs
   real 31–68%). Next, from `notes/builder-research.md`:
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
- 2026-11-25: the gear-target fix stays whatever it does to the numbers (a plain bug); hiding face-down cards stays
  only if the calibrations don't get worse.

## Rejected

- 2026-11-25: blaming Reckless Innovator's reading. Its text is read right; it wins in the model because the cards it's
  compared against are broken there.
