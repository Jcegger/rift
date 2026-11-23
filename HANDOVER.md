# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-23

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

0. **Sivir (21 Nov):** −3 Ride the Wind +3 On the Hunt is **live** (row backed up; guides, sheets, brief updated;
   reMarkable pushed). Two tracks for Jay to read: `decklab/sivir-tune.md` (hold; first candidate −1 Ember Monk
   +1 Ezreal) and `decklab/sivir-brew.md` ("Bounty Board": 3 Graves main, a kill engine; new deck, low confidence,
   loses on answers). Decide after the first post-ban weekend (29–30 Nov) and games. Deck work goes through the
   `deck-build` skill (`docs/deckbuilding-theory.md` added 21 Nov). **RiftLite win rates** are a daily source
   (`data/winrates.json`, online user-submitted games; `rift versus` prints the line); watch the first refresh with
   11 sources. **Testing is three layers** (README "Simulator"): the goldfish now prints "the bench can't see"
   and reads Graves, Pyke, Broker, Academy and Gutter Guardian. **The turn solver is built** (`lib/turn.mjs`:
   `rift close` for a typed-in position, `try --close` on model boards; results in both decklab docs): from 7 a
   winning line exists 39% of the time vs the model's 22%; C1 leans better (46%); On the Hunt and Ride the Wind
   close the same; Bounty Board closes worse (34%, 2% from 6). **Since 22 Nov it reads card text for the whole
   pool** (`lib/cardtext.mjs`, an effect language; `rift cards --coverage`): 90.5% of played copies compile, and the
   solver plays 84.8% (23 Nov, from 88% / 83%); floor gate in check.mjs (`model/cardtext-floor.json`, 88% / 83%).
   **Goal: 100%** (Jay, 23 Nov). Compiled 100% = every sentence read or filed no-effect with a true reason; never file a
   points effect that way to move the number. Read on 23 Nov (turn tests 20-26): The Waters' Wage (`gold`), Smoke and
   Mirrors (`swapTwo`), Elder Dragon (`anyDamageKills`, fights too), Karthus (Deathknell twice), Siphoning Strike and
   Tomb-Raider Barbara (`runeCount`), scoring as a points effect (`score`: it had been filed no-effect; Ahri, Alluring),
   tags in targets and auras (Bubble Bot, Rumble), unknown triggers read as `unmodeled` (or no-effect when the effect
   is only a draw), stun/XP/Bomb grammar. A new op needs ENGINE_OPS (cardtext) and RUN_OPS (turn); a spell's
   follow-on sentence doesn't join the ability before it, so overrides fold it (`kind: "folded"`). To find the next
   batch: dump `poolCoverage(...).unread` and peel triggers/conditions as `parseSentence` does, to see which half fails.
   ~410 unread sentences remain, mostly one-offs. Left, heaviest first: Baron Nashor (the Baron Pit is a third battlefield; the solver has A and B), Jayce, Man of
   Progress (free gear from hand), Rek'Sai, Breacher, Kayle, Justified (Empower cap plus a counted Might static),
   Acceptable Losses, Mirror Image; then unevaluated conditions (Level/XP), [Level], gear statics at a battlefield,
   combat triggers beyond the blast, and their unattached gear, which the match.mjs snapshot doesn't pass. Later: move lib/sim.mjs and lib/match.mjs onto
   the same language, so the model boards `try --close` uses get as rich as the solver.

1. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong; fold corrections into the handbook
   or memory.
2. **Radiance bans live since 2026-11-23 (done that day):** `ANNOUNCED_BANS` emptied (upstream flags all ten; 22 Constructed
   bans, `banned.json` unchanged). First refresh on the new code (manual, 23 Nov 20:09 UTC) was green in 9 minutes (data bf0a507, site b514fb5). GitHub fires the scheduled runs 4-10 hours late and sometimes skips one; if that starts to matter, start the refresh from a scheduled cloud agent and keep one GitHub cron as a backup. The post-ban
   field is 2 lists so far (`scripts/rift meta --since 2026-11-23`); no matchup advice from it until after 29-30 Nov.
3. **Drifted tests settled (23 Nov):** `infer.test` passes again. `engines.test`: Pyke and Renekton read right now and are
   off KNOWN_MISSES; Riven (71 of 957 lists left legal) and Irelia (37 of 428) are on it as TEMPORARY. After 29-30 Nov,
   re-read both entries in `docs/archetypes.md` from post-ban lists and take them off.
4. **Sim gaps still open** (README, "Keywords the sims do not read"): Trinity Force's hold point and other conquer/hold
   strips, Level/Hunt, Weaponmaster, Quick-Draw, Legion.
5. **Baron Pit settled (21 Nov):** it gates the eighth-point conquest. A battlefield token is a battlefield
   (§185.2.d), and community judges agree (rules-rulings.md). No Riot staff ruling yet, but it isn't open anymore.
6. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).
