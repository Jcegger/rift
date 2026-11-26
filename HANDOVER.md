# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-25 (model's job settled with Jay; real sources: RiftAtlas first; trash-class misreads fixed)

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

0a. **What the model is for, and the real sources (25 Nov, late).** Detail: `docs/model-calibration.md` (top section and
   "Real sources disagree"), `notes/miss-trace-2026-11-25.md`.
   - **Decided with Jay:** the sim won't predict real win rates well enough to judge one-card swaps. Real data comes
     first for list and swap verdicts (`rift lifts`, the `deck-build` skill). The model is for mechanisms: reading,
     closing turns, speed, stuck cards, ranking inside the model. Its own bar is directional: r against RiftAtlas
     tournaments with the interval above 0, no legend 20+ points off. Not met yet (r 0.20 this format, 0.35 all events).
   - **Real sources:** RiftLite (online, its users' own decks) and RiftAtlas (tournaments, the model's population)
     barely agree (r 0.04–0.19). RiftLite's decks aren't tournament lists: 2 of 83 Riven decks ran Broken Blade, against
     91% of tournament lists. Tournament data is the main reference now.
   - **Built today:**
     - `data/matches.json` (every RiftLite match, growing daily) and `data/riftlite-decks.json`;
     - `lib/realfit.mjs` (fitted post-ban column, bootstrap, noise ceiling);
     - calibrate's `--real-since`, `--decks riftlite`, RiftAtlas column, `--save` / `--model-from` (saved column:
       `docs/calibration-model.json`);
     - `rift lifts`; `rift cards --suspects`.
   - **Misreads fixed today:**
     - 14 Mordekaiser, Dominating; 15 Irelia, Fervent;
     - the trash class: Fizz, Trickster, Glasc Mixologist, Spectral Matron, Gust Monk, Aspiring Engineer, Guerilla
       Warfare;
     - "up to N" targets now reach their weakest units (Bilgewater Tracker).

     Turn tests 208–215.
   - **Measured and left opt-in:**
     - `--hidden` lifts the reactive decks (Ornn 16 → 28%) but also Volibear and Mordekaiser;
     - `--caution` adds little;
     - `--equip` didn't help: tried and dropped (25 Nov), the result in docs/model-calibration.md.
   - **Next, in order:**
     1. After the 29–30 Nov weekend: rebuild `field.json`, then `calibrate --model-from docs/calibration-model.json`
        against post-ban RiftAtlas events and the grown RiftLite archive. Rerun the model only after a code change.
     2. (Done 25 Nov, late: a fresh model column with the trash fixes; every r unmoved, within noise. Immortal Phoenix
        and Rumble, Hotheaded are read too, after it, tests 216–217. Fights now count which kills are our spells', by
        §429.5.c. Today's rules premises went through `rules-question`: §383.4.b, §417.1/§429.1, §385.2, §383.3.b.)
     3. (Done 25 Nov, late: **[Flow]**, 17 cards and about 10,000 played copies. The turn solver casts a spell from the
        trash for its Flow cost and banishes it, test 218. Also **"…and draw it"** counts as a draw, so Lightning Rush,
        in 100% of Kennen (Heart of the Tempest) lists, is cast at all; in 20 traced games, 34 casts, 16 of them by
        Flow. Not yet: Flow inside a fight (the fight solver casts from hand only), and the opponent's Flow.)
        Suspects left (`rift cards --suspects`, 51): Kennen's [Burn], and his conquer granting [Flow] to a trash spell
        (doable now on top of Flow), Kharox (their trash, tracked only in part). The rest read as intended. Phoenix's edge case, killing our own Phoenix with a spell (FAQ: it may
        return), isn't modelled.
     4. Jay's pasted Sivir list (Battle Mistress, close to his own): parked at his word. It goes through `deck-build`
        when he asks.
     5. Parked: Thrill of the Hunt, Deathgrip from base; an Ornn / reactive-deck policy flag only with a trace showing a
        clear, general mistake.

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
