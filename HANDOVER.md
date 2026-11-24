# Handover

Where the last session stopped. Rewrite it at the end of a session; git is the log. The deck brief (live list, plan,
what to watch, ready swaps, rules corrections) is `notes/handover.md`. The cross-project list is one line per thread in
`~/projects/dotclaude/HUB.md`.

**Updated:** 2026-11-23 (evening)

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
   pool** (`lib/cardtext.mjs`, an effect language; `rift cards --coverage`): **99.33% of played copies compile, and the
   solver plays 97.7%** (24 Nov, from 90.5% / 84.8% on 23 Nov morning); floor gate in check.mjs
   (`model/cardtext-floor.json`, 99% / 97%). **Goal: 100%** (Jay, 23 Nov). Compiled 100% = every sentence read or filed
   no-effect with a true reason; never file a points effect that way to move the number.
   **Done 23 Nov evening** (a993d82, 4291db6, 50589e5, 223a9ae, c7f1b6f, 8ee4a8e, c6bd360, 003a1b3, ca7ca48, 41d19bd, 28ee778, 47ceafa; turn tests 27-106): multi-domain [C] Power paid with any of the card's domains
   (§135.2.e.6.c; Jay: two-domain Power is usually a signature spell); the ~200 heaviest
   one-offs (Vilemaw, Ekko, Zed, Demon Shade, Bone Skewer, Nami, Lacerate and more, or filed with reasons); ~20 triggers on
   existing hooks (hold, fights, plays, moves, deaths, stuns, ready), Imperial Decree, counted discounts, costs paid with
   the board (kill this, kill/exhaust a friendly unit, discard 1, spend XP); follow-on sentences with their
   own condition join the ability before them (Bedeviling Stranger's bounce from hand had never run); XP is this turn's
   (Level, Hunt, "gain N XP": rules-rulings.md "Turn solver premises (4)"; `rift close --xp`); ~20 more conditions;
   attack/defend triggers now run before the fight reads Might (their pumps were lost); gear has a location and Bombs are
   modelled (Minefield, Acceptable Losses, Jayce, Command: Attack, Detonation Amplifier, Ziggs, gear auras; Deploy to any
   battlefield, §830.1.b.1; `rift close --gear-b Bomb`); Baron Nashor's Pit is a third battlefield
   (battlefields come from the position; `rift close --pit`; a conquest that draws at the gate still Scores, so at 7
   "Baron first, then conquer B" wins: rules-rulings.md, Baron entry), Confront, Last Caress, Mirror Image, Gutter
   Palace's alternate win, Kayle (Empowered as a count), Herald of Scales, Sky Splitter, Rek'Sai (Champion Zone only),
   Sett's "Spend my buff", Dragon Form, High Note, Facebreaker, Akali, Ntofo Strikes and about 15 sentences filed
   no-effect with reasons. **A solver bug fixed:** fights took their units as printed cards, so -M on an enemy unit
   was lost at combat (now effCard, like ours; a cached fight maps survivors by position). `UNPAID_COST` is one
   pattern for the reader and the solver (a "kill/exhaust a friendly unit" cost would have run free).
   **Every one-off is settled. Jay (24 Nov): build the seven missing features, one at a time.** Done: *spells inside
   fights* (4989d56: a response window, so counters and takeovers answer spells in fights, ours and theirs; board cost
   and targeting modifiers; rules-rulings.md "Fight solver premises") and *combat internals* (fb5ceb5: Backline wording,
   Kayn, Dune Surfer, excess damage for Sivir, Ambitious, Ava Achiever, Stalking Wolf; ambushers from hand now stay on the
   board; cardtext.test fails on a card named twice in the overrides). Left, 35 cards, in this order:
   - *Legends on the board*: Heartening Soul, Royal Entourage, Bard, Mercurial, Profiteer.
   - *Gear Empowered status*: Rage Amplifier's +2, Hextech Disc, Glowstone, Helm of Suppression's larger tax.
   - *The opponent's own choices*: Angler Wyrm, Call to Battle, Whirlwind, Divine Judgment, Invert Timelines.
   - *Unusual costs*: Kraken Hunter, Wallop, Brazen Buccaneer, Spirit of the Forge, Commander Ledros, Square Up,
     Chronobreak, Temporal Portal, Hextech Gauntlets, Irelia, Graceful.
   - *Copies and one-of-a-kind effects*: Svellsongur, Shady Spectacles, Heimerdinger, Inventor, Dominus, Transpositionist,
     Azir, Ascendant's Equipment swap, Akshan, Relentless Pursuit, Curtain Call, Alpha Strike's split, Dancing Grenade,
     Stealthy Pursuer, Shard of Undoing.
   Known simplifications (in code comments): hold and fight triggers run in place (a fight trigger now takes the target
   that's best for its side; hold triggers still take the first, so Explosimian's Bombs land at A); Rek'Sai, Breacher's
   Accelerate only from the Champion Zone; Lotus Trap and Ambessa's damage rules apply outside fights only.
   How a batch is done: `rift cards "<name>"`, an override in `lib/cardtext-overrides.mjs` (or grammar in
   `lib/cardtext.mjs`), a new op in ENGINE_OPS and RUN_OPS + an applyOp case (`lib/turn.mjs`), a closing-turn test with
   its no-win twin, the floor raised. Later: move lib/sim.mjs and lib/match.mjs onto the same language, so the model
   boards `try --close` uses get as rich as the solver.

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
