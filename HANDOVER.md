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
- rift now commits and pushes finished work once `scripts/check.mjs` passes (Jay, 21 Nov; dotclaude 2a93368).
- **21 Nov audit done** (commits from 9ed5076 on): gear strips (`xb`), keywords read as the card has them
  (`keywordOf`), gear on units (`withGear`), Tank/Backline in fights, Riot's "Mights" rewording (Switcheroo had been
  invisible to the tools since 28 Oct), Reckless Innovator's Gold in both sims, readers tested against real cards
  (`READERS`), the handbook's Radiance FAQ section, Rengar's Ambush corrected in the deck brief. The refresh had been
  cancelled by its time limit three runs running (20–21 Nov): tests now run after the commit, the limit is 40 minutes,
  and a cancel opens the tracking issue. A hand-started run then lost its data to a push race (I pushed mid-run), so
  the data commit now rebases and retries.

## Next

0. **Sivir: decide −3 Ride the Wind +3 On the Hunt with Jay** (bench 21 Nov in `decklab/sivir-new.md`'s shelved
   note). Draft B is shelved. New `deck-build` skill (reads `docs/deckbuilding.md` first) is required for deck work.

1. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong; fold corrections into the handbook
   or memory.
2. **2026-11-23, Radiance bans take effect:** the field report's numbers shift on their own, and `build-banned.mjs` will
   report the `ANNOUNCED_BANS` entries as redundant: delete them, then check the next day's refresh is green and
   finishes inside 40 minutes. Then re-read the field (`scripts/rift meta --since 2026-11-23`) before any matchup advice.
3. **Two report-only tests are red on drifted data:** `lib/infer.test.mjs` (Kha'Zix's top two no longer include
   isolation; red in CI) and `lib/engines.test.mjs` (Riven reads no exhaust engine, because it applies the announced
   bans early and drops 99% of Riven lists for Broken Blade; red locally). Re-derive both expectations after the 23rd.
   Until 21 Nov the CI step couldn't name a failing file (it now uses TAP), so watch the run summary.
4. **Sim gaps still open** (README, "Keywords the sims do not read"): Trinity Force's hold point and other conquer/hold
   strips, Level/Hunt, Weaponmaster, Quick-Draw, Legion. `scripts/rift fight` can't take gear yet, and its comma split
   breaks champion names ("Rengar, Trophy Hunter").
5. **Baron Pit settled (21 Nov):** it gates the eighth-point conquest. A battlefield token is a battlefield
   (§185.2.d), and community judges agree (rules-rulings.md). No Riot staff ruling yet, but it isn't open anymore.
6. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).
