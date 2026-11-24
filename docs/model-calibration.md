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

RiftLite's spread is 31–68%. The model doesn't track real results yet, so its numbers rank changes inside the model and nothing more. The biggest misses are Volibear and Ekko (about 30 points high), and Ornn, Diana and Irelia (22–33 low). Earlier runs on the morning's data, and what each fix did, are in README "Calibration" and notes/builder-research.md.

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
