# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-26 (Sivir candidates re-run as mechanism checks after the Flow fixes; C1 reversed)

## State

- Main deck: **Sivir Is Trying Her Best**, back to Jay's earlier list since 24 Nov (Ride the Wind ×3 main; Acceptable
  Losses in the sideboard; 9eab02c, row backed up in `backups/state-pre-ridethewind-2026-11-24.json`). Guide, both
  sheets, the brief and the worksheet log match it; reMarkable and Kobo have it.
- **What the model is for** (settled with Jay, 25 Nov; `docs/model-calibration.md` top section):
  - Simulating whole games won't predict real win rates well enough to judge one-card swaps.
  - **Real data comes first for list and swap verdicts:** `rift lifts --legend <L> --deck "<deck>"` (good finishes'
    card choices, with intervals); the `deck-build` skill reads it first.
  - **The model is for mechanisms:** exact card reading, closing turns, speed, stuck cards, ranking inside the model.
  - Its own bar is directional: r against RiftAtlas tournaments with the interval above 0, and no legend 20+ points off.
    Not met yet: r 0.19 this format, 0.33 all events (`docs/calibration-model.json`, before Flow).
- **Real sources** (`docs/model-calibration.md` "Real sources disagree"):
  - RiftAtlas tournaments (`data/field.json`): the model's population, and the main reference.
  - RiftLite: online players on their own decks. It barely agrees with RiftAtlas (r 0.04–0.19). Before the bans, 2 of 83
    RiftLite Riven decks ran Broken Blade, against 91% of tournament lists.
  - `data/matches.json` archives every RiftLite match daily, past its 7,000-match window. `lib/realfit.mjs` fits a
    post-ban column with intervals and a noise ceiling (0.92 now).
  - Calibrate takes `--real-since`, `--decks riftlite`, `--save` / `--model-from`. A saved column compares again with new
    data in seconds.
- **Reading:** 963/963 cards, 58/58 legends. Since 25 Nov it also reads:
  - Mordekaiser, Dominating; Irelia, Fervent;
  - the trash class: Fizz, Glasc Mixologist, Spectral Matron, Gust Monk, Aspiring Engineer, Guerilla Warfare;
  - Immortal Phoenix (spell kills attributed by §429.5.c); Rumble, Hotheaded;
  - **[Flow]** (17 cards), with Kennen's Flow grant;
  - "…and draw it" (Lightning Rush, until then never cast);
  - "up to N" targets.

  Turn tests up to 219. `rift cards --suspects` lists where the next misread may hide. `check.mjs` fails on a card
  named twice in `lib/cardtext-overrides.mjs`.
- How a card is done: `rift cards "<name>"`, an override in `lib/cardtext-overrides.mjs` or grammar in
  `lib/cardtext.mjs`, an op in ENGINE_OPS and RUN_OPS + an applyOp case, a closing-turn test with its no-win twin. The
  rules premise goes through `rules-question` before it's coded.
- Rules, play advice, deck proposals and deck writes go through the `rules-question`, `play-advice`, `deck-build` and
  `deck-write` skills. rift commits and pushes finished work once `scripts/check.mjs` passes.

## Next

1. **After the 29–30 Nov weekend (the first post-ban one):**
   - One fresh model column, since the saved one predates Flow and the last fixes: `scripts/rift calibrate --legends 20
     --save docs/calibration-model.json --real-since 2026-11-23` (15 min).
   - Then `calibrate --model-from docs/calibration-model.json` against the rebuilt `field.json` (post-ban RiftAtlas
     events, `--atlas-since 2026-11-23`) and the grown RiftLite archive. Record it in `docs/model-calibration.md`.
2. **Sivir after that weekend:**
   - `rift lifts --legend "battle mistress"`. Only 11 placed lists ever, so lifts may stay too thin; say so.
   - Done 26 Nov, ahead of it: the `decklab/sivir-search.json` candidates as mechanism checks (`decklab/sivir-tune.md`,
     "Re-run 26 Nov"). C1 (+Ezreal) reversed and now reads worse; C3 (Switcheroo for Dread) leans positive on
     answers only; C4 trades kills for answers. That section says what the lifts must show for each.
   - Jay's pasted Battle Mistress list (close to his own; in this session's chat, 25 Nov) is parked at his word. It goes
     through `deck-build` when he asks.
3. **After 29–30 Nov:** re-read Riven, Irelia and Renata Glasc, Chem-Baroness in `docs/archetypes.md` from post-ban
   lists and take them off `KNOWN_MISSES` (`lib/engines.test.mjs`, TEMPORARY).
4. **Reading gaps left:**
   - Flow inside a fight (the fight solver casts from hand only), and the opponent's Flow.
   - Kennen's [Burn] (mills our own deck, whose order the solver doesn't know).
   - Kharox (their trash, tracked only in part).
   - Killing our own Immortal Phoenix with a spell (the FAQ says it may return).
   - Thrill of the Hunt and Deathgrip from base (they need the attacker's base passed into fights).
5. **Check on the devices:**
   - The Kobo's "Riftbound" reading collection and "Questions" sheet (kobo HANDOVER item 0).
   - Open rift.jayegger.com's tweak bench once: it loads `lib/cardtext.mjs` in the browser.
6. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong.
7. **Refresh timing:** GitHub fires scheduled runs 4–10 hours late and sometimes skips one. If that matters, start the
   refresh from a scheduled cloud agent and keep one GitHub cron as a backup.
8. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).

## Decided

- 2026-11-25: the model's job is mechanisms; list and swap verdicts start from real data (`rift lifts`). The model's
  bar is directional against tournaments. Why: whole-game sims can't resolve one-card swaps, and the real sources
  disagree with each other.
- 2026-11-25: RiftAtlas tournaments are the main real reference; RiftLite is second. Why: RiftLite's decks aren't the
  tournament lists the model plays.
- 2026-11-25: misreads are fixed whatever the numbers do; play-policy changes need a trace that shows a clear, general
  mistake, and a calibration that doesn't get worse.
- 2026-11-25: hold-up, `--hidden` and `--caution` stay opt-in. `--hidden` lifts the reactive decks but also Volibear
  and Mordekaiser, which are already too high.
- 2026-11-25: a swap result at 240 games is noise (±0.6 margin).

## Rejected

- 2026-11-25: `--equip W` (a value per attached Equipment). Ornn already attaches about 86%; with it he won 3 of 20,
  without it 5.
- 2026-11-25: chasing r with play-policy tweaks; none passed the bar.
- 2026-11-25: blaming Reckless Innovator's reading. Its text is read right; it wins in the model because the cards it's
  compared against are broken there.
