# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-28 (frozen list audited and locked; bounce ≠ kill model fix 3570cc2; guides to coaching depth with 12 matchup chapters, e4ac839)

## State

- Main deck: **Sivir Is Trying Her Best**, **locked 28 Nov** (−3 Ride the Wind: +2 Switcheroo, +1 Ezreal). Audited
  27–28 Nov (`decklab/sivir-tune.md` "Audit, 27–28 Nov"): against the 26 Nov list it gains beyond noise on the field
  (69→75%), Yi (69→76%), Kai'Sa (47→54%) and Evelynn (61→71%); closing from 7 dips 35→32%, within noise. Everything is
  owned (Nidalee ×3 added 28 Nov). Watch items in `notes/handover.md`. Journal: 0–2 against Master Yi, logged 25 Nov.
- **Guides (28 Nov):** `guides/sivir-one-army.md` (now with sequencing, six opening hands, §13 two annotated model games),
  the new `guides/sivir-one-army-matchups.md` (12 chapters, counts from 29 Oct–28 Nov lists), both sheets. On the
  reMarkable and the Kobo. The old v1, v2 and Two Fights guides were deleted (ae2897a; in git history).
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
- **Sivir from scratch (26–27 Nov), `decklab/sivir-scratch.md`:** the gates went through 2a–5 with Jay (a Body/Chaos
  fight deck: 2-Power tricks, Fizz recasts, kills, Sivir's double conquest). Drafts v1 and v2 are in `decklab/`. In the
  model, v2 wins 46–57% against Trying Her Best's 66–70%, so it's **shelved by gate 4's rule** unless real games say
  otherwise. None of its ideas improved Trying Her Best in the model (Sabotage neutral; On the Hunt for Ride the Wind
  worse). Gate 6 (Jay's card-by-card read) never happened. **Jay, 27 Nov: "fix the model and we can work off the my
  existing deck, which we know isn't bad!"** Trying Her Best is the deck to improve.
- **Building a deck (26 Nov):** `deck-brew` (from scratch; gates: field, identity picked then restated, worth doing,
  tiers and yardstick, jobs, the draft is the identity) and `deck-netdeck` (legend, list, its identity, flex only).
  The worksheet is `decklab/_brew-template.md`, with a ```identity block. Tools: `--file <draft>.deck.txt` on every
  deck command, `rift pool <legend> [--job]`, `rift identity [--id] [--anchor net]` (README "Building from scratch").
  Not yet run with Jay: the first real brew is the test. `identity` can't see "4+ units here"-style conditions.
- Rules, play advice, deck proposals and deck writes go through the `rules-question`, `play-advice`, `deck-build` and
  `deck-write` skills. rift commits and pushes finished work once `scripts/check.mjs` passes.

## Next

1. **After the 29–30 Nov weekend (the first post-ban one):**
   - One fresh model column, since the saved one predates Flow and the last fixes: `scripts/rift calibrate --legends 20
     --save docs/calibration-model.json --real-since 2026-11-23` (15 min).
   - Then `calibrate --model-from docs/calibration-model.json` against the rebuilt `field.json` (post-ban RiftAtlas
     events, `--atlas-since 2026-11-23`) and the grown RiftLite archive. Record it in `docs/model-calibration.md`.
2. **Sivir (Trying Her Best) after that weekend:**
   - `rift lifts --legend "battle mistress"`. Only 11 placed lists ever, so lifts may stay too thin; say so. Sabotage is
     first in line: +1.53 copies in Sivir's good finishes (interval above 0, since August), neutral in the model as a
     swap for Existential Dread (27 Nov).
   - **Re-count the matchup file:** `rift meta <legend> --since 2026-11-23` for its 12 legends, then update the
     percentages there and in the guide's §9 note (`notes/handover.md` has the line).
   - No list changes before 5–10 logged games with the locked list (Jay, 28 Nov: "we'll just keep it locked in").
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

- 2026-11-28: the list is locked; no more tinkering until real games (Jay). Why: every measured matchup gained beyond
  noise, and the model's fit to real results is moderate.
- 2026-11-28: valueOf counts their units in hand (+0.3 against −0.4 on board), so a bounce isn't scored as a kill
  (test 222; calibration within noise, r 0.22).
- 2026-11-28: against Master Yi and Kai'Sa, Forbidding Waste in game 1 (legends are visible before the pick, §111,
  §488.5); Sigil after a win, Recital after a loss.

## Rejected

- 2026-11-25: `--equip W` (a value per attached Equipment). Ornn already attaches about 86%; with it he won 3 of 20,
  without it 5.
- 2026-11-25: chasing r with play-policy tweaks; none passed the bar.
- 2026-11-28: ChatGPT's 1 Ride the Wind / 2 Switcheroo / 3 Ezreal. Untested (Jay stopped the run); its worry rested on
  Hidden congestion, and Switcheroo can be cast face up. Real data leans against Ride the Wind (−1.27 per copy).
- 2026-11-27: Hallowed Tomb for Amateur Recital. It tied in the model (73 vs 75% field, 55% both vs Kai'Sa); try it at the
  table only if Kai'Sa keeps killing Sivir.
- 2026-11-25: blaming Reckless Innovator's reading. Its text is read right; it wins in the model because the cards it's
  compared against are broken there.
