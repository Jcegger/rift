# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`jayegger-site/HANDOVER.md`.

**Updated:** 2026-11-21

## State

- Main deck: **Sivir Is Trying Her Best**, locked for testing since 1 Nov. Change it only from game results. Nexus Night
  3 Nov went 2–1 in matches (games 5–4); Jay's takeaways: don't spend too much Power early, and Innovator is better as
  Gold early, draw later.
- Rules, play advice and deck writes go through the `rules-question`, `play-advice` and `deck-write` skills
  (2026-11-21); `scripts/check.mjs` reads the rules lookup order from the `rules-question` skill.

## Next

1. **2026-11-23, Radiance bans take effect:** the field report's numbers shift on their own, and `build-banned.mjs` will
   report the `ANNOUNCED_BANS` entries as redundant: delete them, then check the next day's refresh is green.
2. **Card data drops equipment keywords:** `data/cards.json` misses keywords printed in the bonus strip (Boots of
   Swiftness' Ganking). Fix the builder (`scripts/build-*.mjs`) and re-check the other 40 equipment.
3. **Judge question before an event:** does a Baron Pit gate the 8th-point conquest?
4. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).
