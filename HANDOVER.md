# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`jayegger-site/HANDOVER.md`.

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
   pool** (`lib/cardtext.mjs`, an effect language; `rift cards --coverage`): 88% of played copies compile, and the
   solver plays 83% (from 33%); floor gate in check.mjs (`model/cardtext-floor.json`, 86% / 81%). Left, by weight:
   the unread tail (411 cards, ~12% of copies; heaviest Baron Nashor's Pit, Bomb tokens, Smoke and Mirrors),
   unevaluated conditions (Level/XP, rune counts), [Level], gear statics at a battlefield (Portable Portal),
   combat triggers beyond the blast (run before the fight on the strongest target, a heuristic), and their
   unattached gear, which the match.mjs snapshot doesn't pass. Later: move lib/sim.mjs and lib/match.mjs onto
   the same language, so the model boards `try --close` uses get as rich as the solver.

1. **Jay reads `notes/how-claude-reads-riftbound.md`** and marks what's wrong; fold corrections into the handbook
   or memory.
2. **Radiance bans live since 2026-11-23 (done that day):** `ANNOUNCED_BANS` emptied (upstream flags all ten; 22 Constructed
   bans, `banned.json` unchanged). **Next:** check the 24 Nov refresh is green and finishes inside 40 minutes. The post-ban
   field is 2 lists so far (`scripts/rift meta --since 2026-11-23`); no matchup advice from it until after 29-30 Nov.
3. **Drifted tests settled (23 Nov):** `infer.test` passes again. `engines.test`: Pyke and Renekton read right now and are
   off KNOWN_MISSES; Riven (71 of 957 lists left legal) and Irelia (37 of 428) are on it as TEMPORARY. After 29-30 Nov,
   re-read both entries in `docs/archetypes.md` from post-ban lists and take them off.
4. **Sim gaps still open** (README, "Keywords the sims do not read"): Trinity Force's hold point and other conquer/hold
   strips, Level/Hunt, Weaponmaster, Quick-Draw, Legion. `scripts/rift fight` can't take gear yet, and its comma split
   breaks champion names ("Rengar, Trophy Hunter").
5. **Baron Pit settled (21 Nov):** it gates the eighth-point conquest. A battlefield token is a battlefield
   (§185.2.d), and community judges agree (rules-rulings.md). No Riot staff ruling yet, but it isn't open anymore.
6. Log each new game in the app's journal and the worksheet's games table (`decklab/sivir-ready.md`).
