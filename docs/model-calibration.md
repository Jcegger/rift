# How far the model games track real results

Run 24 Nov 2026 with `scripts/rift calibrate --legends 20` (open hands) and `--legends 20 --hidden` (lib/calibrate.mjs), solver policy, 150 nodes a Main Phase.
- **Real:** RiftLite's community matrix (data/winrates.json, refreshed 24 Nov: online games logged by its users, pooled).
- **Model:** lib/match.mjs games. Each legend's best list (placed first, then newest, since 2026-10-16) plays the other legends' top 3 lists, 4 rounds, both seats.
- Lists aren't filtered by the 23 Nov bans, to match RiftLite's mostly pre-ban window. Timeouts count for neither side.

**Summary:**

| | r (95%) | mean error | right side of 50% | model spread |
|---|---|---|---|---|
| open hands | 0.11 (−0.35 to 0.52) | 14.2 points | 9 of 20 | 16–81% |
| hidden hands | 0.04 (−0.41 to 0.48) | 13.8 points | 9 of 20 | 27–74% |

**The bar before building on the model (Jay, 25 Nov):** fixes to misreads go in whatever these numbers say; changes to
how the model plays go in only if the calibrations don't get worse; `rift build`, swap searches and deck advice from
model numbers wait until all three hold:
1. `calibrate --legends 20`: the r interval's lower end above 0.
2. Narrow swap run (`calibrate --swaps --only "Yordle;Rengar" …`, "Swaps" below): the same sign as the real result in at
   least 5 of 7 clear swaps, and r positive.
3. Both re-checked on post-ban data once there is enough of it (after 2026-11-30).

RiftLite's spread is 31–68%. The model doesn't track real results yet, so its numbers rank changes inside the model and nothing more. The biggest misses are Volibear and Ekko (about 30 points high), and Ornn, Diana and Irelia (22–33 low). Earlier runs on the morning's data, and what each fix did, are in README "Calibration" and notes/builder-research.md.

## 25 Nov runs (RiftLite data regenerated 25 Nov)

`calibrate --legends 20`, open hands, solver policy, 4560 games each:

| commit | flags | r (95%) | mean error | right side | model spread |
|---|---|---|---|---|---|
| c2e7a80 (before the 25 Nov fixes) | | 0.31 (−0.16 to 0.66) | 12.1 | 11 of 20 | 15–82% |
| ede1589 (fixes 1, 3–9) | | 0.30 (−0.17 to 0.65) | 12.3 | 11 of 20 | not recorded |
| 2bff612 (+ fix 2, face-down cards hidden) | | 0.30 (−0.16 to 0.66) | 12.4 | 12 of 20 | not recorded |
| 10e3ecf (hold-up branch: fixes 1–12) | | 0.30 (−0.16 to 0.66) | 12.5 | 12 of 20 | 13–80% |
| 10e3ecf | `--hold-up 0.5` | 0.31 (−0.15 to 0.66) | 12.7 | 11 of 20 | 16–82% |
| 10e3ecf | `--hold-up 1` | 0.26 (−0.21 to 0.63) | 12.7 | 11 of 20 | 18–79% |
| 0c7a3d9 (master: fixes 1–13) | | 0.30 (−0.16 to 0.66) | 12.2 | 12 of 20 | 16–80% |
| 0c7a3d9 | `--hidden --caution 0.5` | 0.25 (−0.22 to 0.62) | 11.7 | 10 of 20 | 29–75% |
| fb50976 (+ fixes 14–15: Mordekaiser, Dominating; Irelia, Fervent) | | 0.30 (−0.17 to 0.65) | 12.4 | 11 of 20 | 16–80% |
| 84f74a0 | `--hidden` | 0.24 (−0.23 to 0.61) | 12.3 | 9 of 20 | 28–75% |

- **24 Nov's r 0.11 → 0.31 is the data, not the fixes:** the pre-fix model scores the same as the fixed one on today's
  data. Over 20 legends the fixes neither help nor hurt; they are misreads, so they stay (the bar above).
- **Hold-up stays off** (default `holdUp: 0`, `--hold-up W` to try it). It isn't better, and it moves Irelia the wrong
  way (39% → 32%, real 61%) while Rengar climbs (55% → 69–72%, real 54%). Holding runes costs tempo the model's
  opponents don't punish for it.
- Ornn is still the biggest miss (13–18%, real 47%); fix 13 (Guardian Angel, Brutalizer, 50a0a34) came after these runs.
- **Fix 13 didn't move Ornn** (0c7a3d9: 16%, real 47%); master scores what 10e3ecf did.
- **Fixes 14–15 are inside the noise** (fb50976): Mordekaiser 55% → 57% (real 41), Irelia 40% → 41% (real 61).
  They're misreads, so they stay (the bar).
- **Hidden hands do the lifting, not caution** (84f74a0 `--hidden`): Ornn 28%, Diana 33%, Irelia 44%, about what
  `--hidden --caution 0.5` gave (29, 35, 43). Volibear (68%) and Mordekaiser (61%) rise as well, so r falls to 0.24, and it
  stays opt-in. With open hands each side plans around the other's real reactions, so the reactive decks' Defy and Not So
  Fast never catch anyone. Hiding hands lifts them, but it also lifts the proactive decks that are already too high.
- **`--equip W` (branch `worktree-equip-flag`, not merged): no gain.** It adds a value per Equipment attached in the
  model games. On the same 20 Ornn games, Ornn already attaches about 86% of the time (Guardian Angel 24 of 28,
  Brutalizer 42 of 46). With `--equip 0.5` he won 3 of 20 (5 without), margin at turn 8 −3.10 (−2.35). The earlier
  "6 of 10" came from a 6-game sample.
- **`--hidden --caution 0.5` stays opt-in**: r 0.30 → 0.25 and 12 → 10 on the right side, so it fails the bar, though
  the error (11.7) and the spread (29–75%, real 31–69%) are better. It moves every reactive deck the right way: Ornn
  16% → 29%, Diana 28% → 35%, Irelia 40% → 43% (real 47, 52, 61). Volibear (63% → 68%, real 35) and Mordekaiser
  (55% → 60%, real 41) go the wrong way. A lead for the hold-up work: guessing their hand cautiously helps the decks
  that answer on the opponent's turn.

Narrow swap run (`--swaps --only "Yordle;Rengar" --card "Reckless Innovator;Edge of Night;Ride the Wind;Nidalee, Cat
Form" --games 2000`, 9 swaps, 7 clear): r −0.76 at c2e7a80 (0 of 7 same sign); −0.77 at ede1589 (1 of 7); −0.58 with
fix 2 (0 of 7). Bar item 2 is far off.

## Open hands (the default)

| legend | model win % (95%) | games | real win % (95%) | games |
|---|---|---|---|---|
| Lillia | 81% (78%–85%) | 456 | 68% (62%–74%) | 236 |
| Irelia | 39% (34%–43%) | 456 | 61% (55%–67%) | 259 |
| Rek'Sai | 53% (49%–58%) | 452 +4 timeouts | 60% (55%–65%) | 320 |
| Vex | 50% (46%–55%) | 454 +2 timeouts | 58% (54%–62%) | 532 |
| Rengar | 69% (65%–73%) | 456 | 57% (51%–62%) | 292 |
| Diana | 26% (22%–31%) | 456 | 53% (48%–59%) | 285 |
| Sett | 42% (38%–47%) | 456 | 53% (48%–59%) | 323 |
| Kai'Sa | 55% (51%–60%) | 447 +9 timeouts | 53% (48%–58%) | 397 |
| Viktor | 65% (60%–69%) | 454 +2 timeouts | 53% (47%–59%) | 279 |
| Nasus | 44% (40%–49%) | 456 | 51% (46%–57%) | 320 |
| Orianna | 41% (36%–45%) | 456 | 50% (44%–56%) | 262 |
| Ornn | 16% (13%–19%) | 455 +1 timeouts | 49% (43%–54%) | 320 |
| Riven | 50% (46%–55%) | 456 | 48% (43%–53%) | 388 |
| Evelynn | 56% (51%–60%) | 454 +2 timeouts | 45% (40%–50%) | 409 |
| Fiora | 51% (46%–55%) | 455 +1 timeouts | 45% (38%–52%) | 216 |
| Pyke | 31% (27%–35%) | 452 +4 timeouts | 45% (39%–51%) | 243 |
| Mordekaiser | 58% (54%–63%) | 456 | 41% (36%–46%) | 385 |
| Ekko | 66% (62%–70%) | 456 | 35% (28%–43%) | 159 |
| Volibear | 63% (59%–67%) | 456 | 35% (28%–41%) | 205 |
| Ezreal | 42% (37%–46%) | 449 +7 timeouts | 31% (27%–36%) | 356 |

Per legend (20): Pearson r 0.11 (95%: -0.35 to 0.52), Spearman ρ 0.02, mean absolute error 14.2 points, the same side of 50% for 9 of 20.
Spread: the model's legend win rates run 16%–81%; RiftLite's 31%–68%.

Pairs with at least 30 RiftLite games (12; the row legend's win %):

| pair | model (95%) | games | real (95%) | games |
|---|---|---|---|---|
| Evelynn vs Kai'Sa | 43% (26%–63%) | 23 | 32% (20%–50%) | 33 |
| Evelynn vs Mordekaiser | 58% (39%–76%) | 24 | 78% (61%–89%) | 32 |
| Evelynn vs Vex | 58% (39%–76%) | 24 | 38% (24%–53%) | 40 |
| Ezreal vs Vex | 39% (22%–59%) | 23 | 36% (21%–53%) | 31 |
| Kai'Sa vs Riven | 42% (24%–61%) | 24 | 54% (41%–67%) | 52 |
| Kai'Sa vs Vex | 52% (33%–71%) | 23 | 45% (30%–62%) | 35 |
| Mordekaiser vs Vex | 46% (28%–65%) | 24 | 40% (26%–55%) | 40 |
| Orianna vs Riven | 21% (9%–40%) | 24 | 35% (21%–53%) | 31 |
| Ornn vs Vex | 8% (2%–26%) | 24 | 50% (33%–67%) | 30 |
| Rengar vs Vex | 88% (69%–96%) | 24 | 39% (26%–54%) | 43 |
| Riven vs Vex | 67% (47%–82%) | 24 | 29% (16%–45%) | 32 |
| Vex vs Viktor | 29% (15%–49%) | 24 | 46% (30%–60%) | 36 |

Pairs: the same side of 50% for 6 of 12; intervals overlap for 9 of 12.

4560 model games (solver errors: 0), 806 s. RiftLite: Latest 7,000, Radiance season, generated 2026-11-24.

## Hidden hands (`--hidden`)

| legend | model win % (95%) | games | real win % (95%) | games |
|---|---|---|---|---|
| Lillia | 74% (70%–78%) | 456 | 68% (62%–74%) | 236 |
| Irelia | 43% (38%–47%) | 456 | 61% (55%–67%) | 259 |
| Rek'Sai | 51% (47%–56%) | 454 +2 timeouts | 60% (55%–65%) | 320 |
| Vex | 55% (50%–60%) | 456 | 58% (54%–62%) | 532 |
| Rengar | 59% (55%–64%) | 456 | 57% (51%–62%) | 292 |
| Diana | 36% (31%–40%) | 456 | 53% (48%–59%) | 285 |
| Sett | 34% (30%–39%) | 456 | 53% (48%–59%) | 323 |
| Kai'Sa | 46% (42%–51%) | 456 | 53% (48%–58%) | 397 |
| Viktor | 72% (68%–76%) | 456 | 53% (47%–59%) | 279 |
| Nasus | 46% (41%–50%) | 456 | 51% (46%–57%) | 320 |
| Orianna | 35% (30%–39%) | 456 | 50% (44%–56%) | 262 |
| Ornn | 27% (23%–31%) | 456 | 49% (43%–54%) | 320 |
| Riven | 54% (50%–59%) | 456 | 48% (43%–53%) | 388 |
| Evelynn | 58% (53%–62%) | 456 | 45% (40%–50%) | 409 |
| Fiora | 47% (42%–51%) | 456 | 45% (38%–52%) | 216 |
| Pyke | 28% (24%–32%) | 456 | 45% (39%–51%) | 243 |
| Mordekaiser | 65% (61%–70%) | 455 +1 timeouts | 41% (36%–46%) | 385 |
| Ekko | 68% (63%–72%) | 456 | 35% (28%–43%) | 159 |
| Volibear | 65% (60%–69%) | 456 | 35% (28%–41%) | 205 |
| Ezreal | 38% (33%–42%) | 455 +1 timeouts | 31% (27%–36%) | 356 |

Per legend (20): Pearson r 0.04 (95%: -0.41 to 0.48), Spearman ρ 0.02, mean absolute error 13.8 points, the same side of 50% for 9 of 20.
Spread: the model's legend win rates run 27%–74%; RiftLite's 31%–68%.

Pairs with at least 30 RiftLite games (12; the row legend's win %):

| pair | model (95%) | games | real (95%) | games |
|---|---|---|---|---|
| Evelynn vs Kai'Sa | 46% (28%–65%) | 24 | 32% (20%–50%) | 33 |
| Evelynn vs Mordekaiser | 58% (39%–76%) | 24 | 78% (61%–89%) | 32 |
| Evelynn vs Vex | 54% (35%–72%) | 24 | 38% (24%–53%) | 40 |
| Ezreal vs Vex | 38% (21%–57%) | 24 | 36% (21%–53%) | 31 |
| Kai'Sa vs Riven | 29% (15%–49%) | 24 | 54% (41%–67%) | 52 |
| Kai'Sa vs Vex | 42% (24%–61%) | 24 | 45% (30%–62%) | 35 |
| Mordekaiser vs Vex | 42% (24%–61%) | 24 | 40% (26%–55%) | 40 |
| Orianna vs Riven | 33% (18%–53%) | 24 | 35% (21%–53%) | 31 |
| Ornn vs Vex | 13% (4%–31%) | 24 | 50% (33%–67%) | 30 |
| Rengar vs Vex | 63% (43%–79%) | 24 | 39% (26%–54%) | 43 |
| Riven vs Vex | 63% (43%–79%) | 24 | 29% (16%–45%) | 32 |
| Vex vs Viktor | 46% (28%–65%) | 24 | 46% (30%–60%) | 36 |

Pairs: the same side of 50% for 7 of 12; intervals overlap for 11 of 12.

4560 model games (solver errors: 0), 962 s. RiftLite: Latest 7,000, Radiance season, generated 2026-11-24.

## Swaps (does the model rank one-card changes the way good finishes do?)

Run 2026-11-24: `scripts/rift calibrate --swaps`. Per legend, the base is its typical good finish (the medoid good-finish list since 2026-10-16); a card's real lift is its mean copies in good finishes (lib/placing.mjs: top quarter of 32+, or a top 8) minus in the legend's other placed lists, ±95% by bootstrap; a swap's real effect is lift(in) − lift(out). Model: the paired margin by turn 8 over 240 games against the S/A field, the swap keeping the base's card order.

| legend | swap | real lift (95%) | model margin (95%) |
|---|---|---|---|
| Riven, The Exile | −1 Battle Preparations +1 Blitzcrank, Impassive | +0.23 (+0.08 to +0.37) | +0.27 (-0.33 to +0.88) |
| Riven, The Exile | −1 Reckless Innovator +1 Blitzcrank, Impassive | +0.21 (+0.06 to +0.36) | +0.07 (-0.52 to +0.66) |
| Riven, The Exile | −1 Star-Crossed +1 Blitzcrank, Impassive | +0.20 (+0.04 to +0.35) | +0.10 (-0.53 to +0.73) |
| Riven, The Exile | −1 Baron Nashor +1 Blitzcrank, Impassive | +0.20 (+0.02 to +0.35) | +0.03 (-0.61 to +0.67) |
| Riven, The Exile | −1 Blitzcrank, Impassive +1 Ki Burst | -0.28 (-0.44 to -0.13) | -0.41 (-1.03 to +0.21) |
| Riven, The Exile | −1 Gust +1 Ki Burst | -0.26 (-0.44 to -0.07) | -0.02 (-0.65 to +0.60) |
| Riven, The Exile | −1 Switcheroo +1 Ki Burst | -0.25 (-0.42 to -0.12) | -0.01 (-0.61 to +0.59) |
| Riven, The Exile | −1 Astral Heron +1 Ki Burst | -0.24 (-0.42 to -0.05) | -0.05 (-0.63 to +0.53) |
| Kai'Sa, Daughter of the Void | −1 Watchful Sentry +1 The Empyrean | +0.36 (-0.01 to +0.67) | -0.14 (-0.79 to +0.50) |
| Kai'Sa, Daughter of the Void | −1 Smoke Screen +1 The Empyrean | +0.33 (+0.12 to +0.52) | -0.01 (-0.66 to +0.63) |
| Kai'Sa, Daughter of the Void | −1 Plundering Poro +1 The Empyrean | +0.25 (-0.04 to +0.49) | -0.13 (-0.80 to +0.54) |
| Kai'Sa, Daughter of the Void | −1 Noxus Hopeful +1 The Empyrean | +0.24 (-0.01 to +0.45) | -0.18 (-0.80 to +0.44) |
| Kai'Sa, Daughter of the Void | −1 The Empyrean +1 Smoke Screen | -0.33 (-0.52 to -0.12) | -0.07 (-0.71 to +0.56) |
| Kai'Sa, Daughter of the Void | −1 Brynhir Thundersong +1 Smoke Screen | -0.33 (-0.49 to -0.16) | -0.05 (-0.68 to +0.57) |
| Kai'Sa, Daughter of the Void | −1 Bilgewater Tracker +1 Smoke Screen | -0.32 (-0.46 to -0.13) | -0.17 (-0.86 to +0.51) |
| Kai'Sa, Daughter of the Void | −1 Temporal Breach +1 Smoke Screen | -0.30 (-0.46 to -0.12) | +0.32 (-0.34 to +0.97) |
| Yordle, Heart of the Tempest | −1 Trifarian Captain +1 Edge of Night | +0.37 (+0.18 to +0.58) | +0.05 (-0.57 to +0.67) |
| Yordle, Heart of the Tempest | −1 Nocturne, Horrifying +1 Edge of Night | +0.35 (+0.16 to +0.59) | -0.13 (-0.79 to +0.52) |
| Yordle, Heart of the Tempest | −1 Reckless Innovator +1 Edge of Night | +0.33 (+0.10 to +0.55) | -0.12 (-0.72 to +0.48) |
| Yordle, Heart of the Tempest | −1 Ride the Wind +1 Edge of Night | +0.31 (-0.00 to +0.57) | +0.15 (-0.54 to +0.84) |
| Yordle, Heart of the Tempest | −1 Edge of Night +1 Reckless Innovator | -0.33 (-0.55 to -0.10) | +0.05 (-0.56 to +0.66) |
| Yordle, Heart of the Tempest | −1 Tideturner +1 Reckless Innovator | -0.25 (-0.48 to -0.01) | +0.09 (-0.57 to +0.75) |
| Yordle, Heart of the Tempest | −1 An Offer You Can't Refuse +1 Reckless Innovator | -0.22 (-0.46 to -0.02) | +0.40 (-0.22 to +1.02) |
| Yordle, Heart of the Tempest | −1 Gust +1 Reckless Innovator | -0.20 (-0.45 to +0.04) | +0.10 (-0.50 to +0.69) |
| Master Yi, Wuju Bladesman - Starter | −1 Sabotage +1 Pit Rookie | +0.51 (+0.19 to +0.87) | +0.33 (-0.31 to +0.97) |
| Master Yi, Wuju Bladesman - Starter | −1 En Garde +1 Pit Rookie | +0.50 (+0.10 to +0.93) | +0.25 (-0.43 to +0.92) |
| Master Yi, Wuju Bladesman - Starter | −1 Defy +1 Pit Rookie | +0.45 (+0.14 to +0.78) | +0.16 (-0.51 to +0.83) |
| Master Yi, Wuju Bladesman - Starter | −1 Onslaught +1 Pit Rookie | +0.43 (+0.09 to +0.78) | -0.01 (-0.64 to +0.62) |
| Master Yi, Wuju Bladesman - Starter | −1 Pit Rookie +1 Sabotage | -0.51 (-0.87 to -0.19) | -0.32 (-1.01 to +0.38) |
| Master Yi, Wuju Bladesman - Starter | −1 Tomb-Raider Barbara +1 Sabotage | -0.33 (-0.68 to -0.03) | -0.20 (-0.89 to +0.48) |
| Master Yi, Wuju Bladesman - Starter | −1 Scuttle Crab +1 Sabotage | -0.32 (-0.66 to +0.03) | -0.40 (-1.09 to +0.30) |
| Master Yi, Wuju Bladesman - Starter | −1 Charm +1 Sabotage | -0.30 (-0.56 to +0.00) | -0.07 (-0.78 to +0.64) |
| Vex, Gloomist | −1 Charm +1 Rebuke | +0.59 (+0.25 to +0.98) | -0.10 (-0.78 to +0.57) |
| Vex, Gloomist | −1 Zhonya's Hourglass +1 Rebuke | +0.42 (+0.06 to +0.78) | +0.21 (-0.49 to +0.92) |
| Vex, Gloomist | −1 Defy +1 Rebuke | +0.40 (+0.17 to +0.67) | +0.06 (-0.60 to +0.72) |
| Vex, Gloomist | −1 Back Off +1 Rebuke | +0.37 (-0.06 to +0.83) | -0.10 (-0.81 to +0.61) |
| Vex, Gloomist | −1 Boots of Swiftness +1 Mutated Mouser | -1.31 (-1.78 to -0.85) | -0.13 (-0.79 to +0.54) |
| Vex, Gloomist | −1 Steel Paws +1 Mutated Mouser | -1.29 (-1.91 to -0.74) | -0.05 (-0.75 to +0.64) |
| Vex, Gloomist | −1 Tornado Warrior +1 Mutated Mouser | -1.25 (-1.86 to -0.68) | -0.04 (-0.71 to +0.62) |
| Vex, Gloomist | −1 Astral Heron +1 Mutated Mouser | -1.23 (-1.78 to -0.72) | -0.01 (-0.69 to +0.67) |
| Rek'Sai, Void Burrower | −1 Imperial Decree +1 Vi, Peacekeeper | +0.46 (-0.03 to +0.98) | +0.26 (-0.31 to +0.83) |
| Rek'Sai, Void Burrower | −1 Hunting Dog +1 Vi, Peacekeeper | +0.43 (-0.00 to +0.84) | +0.13 (-0.46 to +0.71) |
| Rek'Sai, Void Burrower | −1 Noxus Hopeful +1 Vi, Peacekeeper | +0.31 (+0.04 to +0.59) | +0.04 (-0.52 to +0.60) |
| Rek'Sai, Void Burrower | −1 Long Sword +1 Vi, Peacekeeper | +0.25 (-0.14 to +0.63) | +0.12 (-0.45 to +0.69) |
| Rek'Sai, Void Burrower | −1 Concert Poster +1 Blood Rush | -0.84 (-1.55 to -0.08) | +0.05 (-0.45 to +0.56) |
| Rek'Sai, Void Burrower | −1 Shimmering Swimmer +1 Blood Rush | -0.70 (-1.50 to +0.15) | -0.18 (-0.75 to +0.38) |
| Rek'Sai, Void Burrower | −1 Bilgewater Tracker +1 Blood Rush | -0.60 (-1.33 to +0.06) | -0.01 (-0.59 to +0.56) |
| Rek'Sai, Void Burrower | −1 Rengar, Pouncing +1 Blood Rush | -0.52 (-1.23 to +0.19) | -0.23 (-0.80 to +0.35) |
| Rengar, Pridestalker | −1 Nidalee, Cat Form +1 Rampage | +0.37 (+0.06 to +0.69) | -0.17 (-0.74 to +0.39) |
| Rengar, Pridestalker | −1 Sabotage +1 Rampage | +0.36 (-0.00 to +0.71) | +0.04 (-0.46 to +0.54) |
| Rengar, Pridestalker | −1 Ferrous Forerunner +1 Rampage | +0.29 (+0.01 to +0.60) | -0.05 (-0.57 to +0.46) |
| Rengar, Pridestalker | −1 Grim Apothecary +1 Rampage | +0.29 (-0.03 to +0.61) | +0.02 (-0.51 to +0.55) |
| Rengar, Pridestalker | −1 Rampage +1 Darius, Trifarian | -0.42 (-0.71 to -0.12) | +0.12 (-0.44 to +0.69) |
| Rengar, Pridestalker | −1 Noxus Hopeful +1 Darius, Trifarian | -0.37 (-0.63 to -0.09) | +0.10 (-0.44 to +0.63) |
| Rengar, Pridestalker | −1 Pit Rookie +1 Darius, Trifarian | -0.32 (-0.54 to -0.03) | +0.03 (-0.55 to +0.61) |
| Rengar, Pridestalker | −1 Inferna +1 Darius, Trifarian | -0.31 (-0.53 to -0.11) | -0.05 (-0.60 to +0.50) |
| Irelia, Blade Dancer | −1 En Garde +1 Astral Heron | +1.33 (+0.58 to +1.97) | +0.23 (-0.46 to +0.91) |
| Irelia, Blade Dancer | −1 Charm +1 Astral Heron | +1.13 (+0.32 to +1.76) | +0.15 (-0.47 to +0.77) |
| Irelia, Blade Dancer | −1 Ride the Wind +1 Astral Heron | +1.06 (+0.36 to +1.63) | +0.06 (-0.64 to +0.76) |
| Irelia, Blade Dancer | −1 Gust +1 Astral Heron | +1.05 (+0.40 to +1.65) | -0.13 (-0.79 to +0.53) |
| Irelia, Blade Dancer | −1 Astral Heron +1 Battle Preparations | -1.49 (-2.18 to -0.70) | -0.32 (-1.00 to +0.37) |
| Irelia, Blade Dancer | −1 Switcheroo +1 Battle Preparations | -1.08 (-1.64 to -0.43) | -0.07 (-0.75 to +0.61) |
| Irelia, Blade Dancer | −1 Rebuke +1 Battle Preparations | -1.04 (-1.56 to -0.47) | +0.07 (-0.59 to +0.74) |
| Irelia, Blade Dancer | −1 Zhonya's Hourglass +1 Battle Preparations | -0.97 (-1.61 to -0.31) | +0.10 (-0.57 to +0.76) |

Across 64 swaps: Pearson r 0.31 (95%: 0.07 to 0.52), Spearman ρ 0.34.
Where the real lift's interval excludes 0 (48 swaps), the model has the same sign for 30; where both intervals exclude 0 (0), 0 agree.
- Riven, The Exile: same sign 8 of 8 clear swaps; r 0.70 over 8
- Kai'Sa, Daughter of the Void: same sign 3 of 5 clear swaps; r -0.36 over 8
- Yordle, Heart of the Tempest: same sign 1 of 6 clear swaps; r -0.51 over 8
- Master Yi, Wuju Bladesman - Starter: same sign 5 of 6 clear swaps; r 0.89 over 8
- Vex, Gloomist: same sign 6 of 7 clear swaps; r 0.34 over 8
- Rek'Sai, Void Burrower: same sign 1 of 2 clear swaps; r 0.71 over 8
- Rengar, Pridestalker: same sign 1 of 6 clear swaps; r -0.58 over 8
- Irelia, Blade Dancer: same sign 5 of 8 clear swaps; r 0.51 over 8

64 swaps, 17280 model games, 2945 s.
