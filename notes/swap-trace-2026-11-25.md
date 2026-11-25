# Swap trace, 2026-11-25: why the model disagrees on Yordle/Rengar swaps

Narrow re-run of the 24 Nov swap calibration at 2000 games a swap (interval about ±0.2, was ±0.6 at 240), from
`scripts/rift calibrate --swaps --only "Yordle;Rengar" --card "Reckless Innovator;Edge of Night;Ride the Wind;Nidalee, Cat Form" --games 2000`
(70 min on the home PC). The disagreement is real: the model likes Reckless Innovator and dislikes Edge of Night, the
opposite of good finishes.

```
| legend | swap | real lift (95%) | model margin (95%) |
|---|---|---|---|
| Yordle, Heart of the Tempest | −1 Trifarian Captain +1 Edge of Night | +0.37 (+0.18 to +0.58) | -0.01 (-0.20 to +0.17) |
| Yordle, Heart of the Tempest | −1 Nocturne, Horrifying +1 Edge of Night | +0.35 (+0.16 to +0.59) | -0.17 (-0.35 to +0.01) |
| Yordle, Heart of the Tempest | −1 Reckless Innovator +1 Edge of Night | +0.33 (+0.10 to +0.55) | -0.17 (-0.36 to +0.02) |
| Yordle, Heart of the Tempest | −1 Ride the Wind +1 Edge of Night | +0.31 (-0.00 to +0.57) | +0.03 (-0.16 to +0.21) |
| Yordle, Heart of the Tempest | −1 Edge of Night +1 Reckless Innovator | -0.33 (-0.55 to -0.10) | +0.12 (-0.07 to +0.30) |
| Yordle, Heart of the Tempest | −1 Tideturner +1 Reckless Innovator | -0.25 (-0.48 to -0.01) | +0.04 (-0.15 to +0.22) |
| Yordle, Heart of the Tempest | −1 An Offer You Can't Refuse +1 Reckless Innovator | -0.22 (-0.46 to -0.02) | +0.33 (+0.15 to +0.51) |
| Yordle, Heart of the Tempest | −1 Gust +1 Reckless Innovator | -0.20 (-0.45 to +0.04) | +0.10 (-0.09 to +0.28) |
| Rengar, Pridestalker | −1 Nidalee, Cat Form +1 Rampage | +0.37 (+0.06 to +0.69) | -0.13 (-0.29 to +0.04) |

Across 9 swaps: Pearson r -0.76 (95%: -0.95 to -0.19), Spearman ρ -0.75.
Where the real lift's interval excludes 0 (7 swaps), the model has the same sign for 0; where both intervals exclude 0 (1), 0 agree.
- Yordle, Heart of the Tempest: same sign 0 of 6 clear swaps; r -0.73 over 8
- Rengar, Pridestalker: same sign 0 of 1 clear swaps; r unknown over 1
```

## Two misreads (found with `rift trace`, 80 games a swap)

1. **"Kill a gear" never finds a target.** `candidates()` in `lib/turn.mjs` rejects a target of kind `gear`, so An
   Offer You Can't Refuse (`kill`, `{who: "unit", kind: "gear"}`, `lib/cardtext.mjs` parseTarget) is a dead card:
   drawn in 24 of 80 games, left the hand in 4. Enemy loose gear (Seals, Gold tokens) isn't on the solver's board at
   all; only equipment on their units is (`lib/turn.mjs` Akshan note).
2. **Face-down cards are open information.** `posFor` in `lib/match.mjs` gives each side the other's face-down cards;
   `--hidden` hides only the hand. Edge of Night works as an ambush (`rift fight --attack "Trifarian Captain" --defend
   "Fizz, Trickster" --down "Edge of Night"`: the defender flips it for +2), but the model's attacker sees it and
   doesn't attack there. Every [Hidden] card is undervalued, Sivir's included.

Reckless Innovator's own reading looks right (Accelerate; a Gold or a draw each time it exhausts).

## Plan (approved overnight, not started: waits on Jay's go)

1. Gear removal: the opponent's gear on the solver's board (attached equipment, plus loose gear as `their.gear` in
   `posFor`); `candidates`/`targetSets` return gear when `spec.kind === "gear"`; `kill` on a gear drops it (equipment's
   Might goes, a Gold token takes 1 from their budget); Offer's "plays a Gold gear token" gives them +1 Power next turn;
   `solverMain` maps it back onto `O.gear`. Tests in `lib/turn.test.mjs`: a closing turn won by stripping a blocker's
   equipment, its no-win twin, and Offer uncastable with no enemy gear. A plain bug: stays either way.
2. Hidden face-down cards: when a side plans, the other's face-down cards are guesses from their unseen cards, seeded
   per game and turn like hidden hands; the fight itself keeps the real card. Test: an attacker sometimes walks into a
   face-down Edge of Night. Changes every model number: keep only if the calibrations don't get worse.
3. Measure each fix separately: the narrow run above (70 min), then `calibrate --legends 20` (14 min; r 0.11 must not
   drop); a full `calibrate --swaps --write` (50 min) only if the narrow r turns positive.
4. Record in `docs/model-calibration.md`, README "Swaps", HANDOVER, the hub.
