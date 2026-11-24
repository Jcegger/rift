# How far the model games track real results

Written by `scripts/rift calibrate --legends 12 --reps 4 --lists 3` on 2026-11-24 (lib/calibrate.mjs). Real: RiftLite's community matrix (data/winrates.json: online games logged by its users, pooled). Model: lib/match.mjs games, solver policy; each legend's best list (placed first, then newest, since 2026-10-16) against the other legends' top 3 lists, 4 rounds, both seats. Lists are not filtered by the 23 Nov bans, to match RiftLite's mostly pre-ban window. Timeouts count for neither side.

| legend | model win % (95%) | games | real win % (95%) | games |
|---|---|---|---|---|
| Rek'Sai | 61% (55%–66%) | 264 | 61% (54%–67%) | 229 |
| Vex | 49% (43%–55%) | 264 | 58% (52%–63%) | 349 |
| Viktor | 74% (68%–79%) | 264 | 56% (49%–63%) | 189 |
| Rengar | 61% (55%–67%) | 263 +1 timeouts | 56% (50%–63%) | 218 |
| Kai'Sa | 63% (57%–69%) | 261 +3 timeouts | 56% (50%–61%) | 290 |
| Sett | 15% (11%–20%) | 264 | 53% (47%–60%) | 222 |
| Nasus | 53% (47%–59%) | 264 | 51% (45%–58%) | 220 |
| Ornn | 17% (13%–22%) | 264 | 49% (43%–56%) | 228 |
| Evelynn | 49% (43%–55%) | 264 | 45% (39%–51%) | 265 |
| Riven | 56% (50%–62%) | 264 | 44% (38%–50%) | 280 |
| Mordekaiser | 56% (50%–62%) | 263 +1 timeouts | 40% (34%–46%) | 257 |
| Ezreal | 48% (42%–54%) | 263 +1 timeouts | 33% (27%–38%) | 253 |

Per legend (12): Pearson r 0.17, Spearman ρ 0.42, mean absolute error 13.1 points, the same side of 50% for 8 of 12.
Spread: the model's legend win rates run 15%–74%; RiftLite's 33%–61%.

Pairs with at least 30 RiftLite games (9; the row legend's win %):

| pair | model (95%) | games | real (95%) | games |
|---|---|---|---|---|
| Evelynn vs Kai'Sa | 29% (15%–49%) | 24 | 30% (17%–47%) | 33 |
| Evelynn vs Vex | 50% (31%–69%) | 24 | 33% (20%–48%) | 40 |
| Ezreal vs Vex | 54% (35%–72%) | 24 | 41% (26%–58%) | 34 |
| Kai'Sa vs Riven | 63% (43%–79%) | 24 | 53% (40%–66%) | 51 |
| Kai'Sa vs Vex | 63% (43%–79%) | 24 | 48% (33%–64%) | 37 |
| Mordekaiser vs Vex | 46% (28%–65%) | 24 | 37% (24%–54%) | 37 |
| Rengar vs Vex | 54% (35%–72%) | 24 | 33% (20%–48%) | 40 |
| Riven vs Vex | 54% (35%–72%) | 24 | 31% (18%–49%) | 32 |
| Vex vs Viktor | 29% (15%–49%) | 24 | 54% (38%–71%) | 31 |

Pairs: the same side of 50% for 3 of 9; intervals overlap for 9 of 9.

1584 model games, 380 s. RiftLite: Latest 7,000, Radiance season, generated 2026-11-24.
