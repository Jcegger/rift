---
title: Sivir, Power — deckbuilding worksheet
subtitle: Battle Mistress (Body/Chaos), post-ban Radiance. Rebuilding "Sivir Is Trying Her Best" around what only Battle Mistress does, instead of a half-copy of the Evelynn deck. Built with Jay a stage at a time.
started: 2026-11-17
status: stages 1–2 agreed 17 Nov 2026; stage 3 closed with no change (list stays; play pattern and watch items)
---

How this worksheet works: [README.md](README.md). Stages in order (how it wins → jobs → card by
card → checks → log), each agreed with Jay before the next. The live list,
"Sivir Is Trying Her Best", stays as it is until stage 3 is agreed.

## Why a rebuild (17 Nov 2026)

Jay: "i don't want to just copy a deck that is ultimately better at their strategy."

The trap half of the current list (7 Hidden cards, a face-down card waiting at A, Ember Monk paid
by face-down plays) is the **Evelynn, Agony's Embrace** plan. Evelynn is Body/Chaos too, is the
most-played deck that stays legal after the ban (332 lists since 23 Oct, 38 placed at 32+ player
events), and her legend draws a card every time she plays from face down. Ours draws nothing for
it. Every Hidden card we add makes this a worse Evelynn. It is probably also the "foot in two
camps" and "doing too many things" the table has twice named.

**This has been tried in part before.** `sivir-ready.md` §2 (29 Oct) drafted a Power-led plan:
"raid, don't hold", ready threats, win in one turn from 6. Jay rebuilt it into the trap list on
31 Oct and the raid version was never played. Since then the journal says the opposite of
"raid": all five wins came from **holding one battlefield**, and all four losses from leaving it
(going for the second battlefield, overcommitting, a Faefolk misplay). So this keeps the hold and
changes what defends it.

## What only Battle Mistress does

Card text, then the rules that make it work:

- **Battle Mistress:** "When you recycle a rune, you may exhaust me to play a Gold gear token
  exhausted. When one or more enemy units die, ready me."
- **A Gold token:** "[Reaction] Kill this, exhaust: Add 1 Power of any domain" (§187.5). It readies
  only in your Awaken Phase (§416.3.a), so a Gold made on their turn is usable on your next turn,
  and one made on your own turn waits a round.
- **Sivir, Mercenary:** "[Accelerate] If you've spent at least 2 Power this turn, I have +2 Might
  and [Ganking]." Accelerate's Chaos counts toward the 2 (`sivir-ready.md` §1). Power from Gold
  is Power of any domain (§135.2.e.5.b), so it counts too. Ganking lets her standard move go
  battlefield to battlefield (§810.1.b). She starts in the Champion Zone and never has to be drawn.

So the deck's three edges, none of which Evelynn has:

1. **More Power than anyone.** Every Power paid from a rune can make a Gold, so 2-Power cards are
   cheaper for us than for any other Body/Chaos deck.
2. **Kills pay twice.** An enemy death readies the legend for another Gold. Removal that kills is
   worth more to us than removal that bounces.
3. **A champion that closes without being drawn.** Two Power spent turns Sivir into a 6-Might
   unit with Ganking, out of the Champion Zone, every game.

## 1. How it wins — drafted 17 Nov 2026, to agree

**Hold one battlefield (A) with bodies, and defend it with Power from your hand, not traps on the
board.** Cards stay in hand until they're needed, paid with Power the legend keeps refilling. When
they attack A, kill what attacks (the legend readies, the next Power payment makes Gold). Then
**close with Sivir**: from 6, the hold at A scores 7, and Sivir, readied by Accelerate with 2 Power
spent, takes B for 8. Or the hold at 7 wins on its own (§473.1.a.1).

**Why "in hand, not face down":** a hidden card costs 1 Power to hide and A holds one at a time
(§811.1.b), and Evelynn is paid a card for each flip while we aren't. A Reaction or Action held in
hand costs nothing until it's cast, can be cast at any battlefield, and its Power can come from Gold.
Hidden cards stay only where the card is strong without Evelynn's draw.

**What changes from the current list, in principle** (cards are stage 3):
- **The defence moves from the board to the hand**: fewer Hidden cards, more Reaction and Action
  answers that cost Power.
- **Kill over bounce, where the choice is close**: a kill feeds the legend, a bounce doesn't. Bounce
  stays where it's the only answer (big units, can't-be-killed).
- **Faefolk's pull stops being the only route to B.** It is 1 Might and dies to every ping in the
  field. Sivir with Ganking can walk A → B herself, and a kill at B empties it.
- **Kept:** the one-hold discipline and the terminal scan (`docs/strategy.md` §0), Sivir as the
  closer, Gold as the resource.

**Decisions for Jay** (with Claude's recommendation):

| question | options | recommendation |
|---|---|---|
| Hold, or raid? | hold one (the journal) · raid (the 29 Oct plan) | **hold one**: nine games of evidence against none |
| Kill, or bounce? | lean kill · keep the mix | **lean kill where it's close**: kills feed the legend |
| How many Hidden cards? | keep ~7 · cut to the strong ones · none | **cut to the ones that stand alone** (Stranger, Switcheroo are the likely survivors); decided card by card in stage 3 |

**What would make this wrong:** if the deck runs short of **Energy**, not Power (the bench already
shows about 1.3 tricks a game stuck for Energy). Then more Power cards make it worse, and the fix
is cheaper cards, not a different plan. Log it in the next games.

**Agreed 17 Nov 2026** (Jay: "agree with all three"): hold one, lean kill, Hidden cards only where
they stand alone.

## 2. Jobs and targets — drafted 17 Nov 2026, to agree

**Where the live list starts** (`scripts/rift try`, goldfish on the play, 5000 games; field = 11 S/A
legends, 2672 lists since 16 Oct):

| measure | now | what it says about the plan |
|---|---|---|
| an answer usable on their turn, turn 3 / turn 5 | **5% / 56%** | the defence the plan leans on is mostly not there yet |
| kills a game, normal pressure | **0.31** | the legend's second trigger barely fires |
| Gold made a game, normal | 3.52 | the engine works; it's what we spend it on |
| Mercenary on (2+ Power spent), turns 4–8 | 26–38% | Sivir is a 4-Might body two turns in three, unless she's Accelerated |
| tricks crowded out by Energy, normal | 1.29 | the risk from stage 1, already visible |
| units · spells · gear / avg cost / cheap | 22 · 16 · 2 / 2.55 / 20 | |
| Hidden | 8 | |

**What the winners look like** (`data/archetypes.json`, placed lists, 16 Sep–15 Nov; profile =
the representative list): Riven 20 units · 14 spells, avg 3.0, 23 cheap, 7 interaction, 11 draw;
Master Yi 18 · 20, avg 2.4, 27 cheap, 9 interaction, 9 draw; Viktor 13 · 24, avg 2.8, 11
interaction. The decks that hold and answer run about 18–20 units and 9–11 interaction. Ours runs
more bodies and less draw than any of them (Battle Mistress's own lists: 6 draw).

| # | job | target | measured by |
|---|---|---|---|
| 1 | **Answers from hand, castable on their turn**: Reactions, plus Actions during their attack's showdown at A | **10**, of which **6 kill** | "an answer usable on their turn" t5 up from 56%; "kills a game" up from 0.31 |
| 2 | **Holders**: units ≤3 Energy that stand at A and survive a ping | **10** | units by turn 3 stays ≥3.0; exposure to Might-limited removal down from 37% |
| 3 | **The close**: Sivir, plus units or moves that take B on the turn the hold scores 7 | **Sivir + 3** | stage 3 names them; Faefolk is no longer the only one |
| 4 | **Cards that keep the hand full**: draw, or a body that replaces itself | **5** | "extra cards drawn" up from 1.3 |
| 5 | **Power sinks worth the Gold**: cards whose Power cost buys more than a rune would | most of jobs 1–4 cost Power; no card in **only** for its Power | Gold made stays ≥3.5; Mercenary on goes up |
| 6 | **Hidden, standalone only** | **≤3** | Hidden down from 8 |

**Overall shape this implies:** about 19 units, 19 spells, 2 gear; average cost 2.6 or less; 20+
cheap. Cards may fill two jobs (a Reaction that kills and draws counts for 1 and 4).

**Why these numbers:** 10 answers and 5 draw are the hold-and-answer winners' range (9–11
interaction; draw 6–11), shaded down for draw because the legend's Gold is our extra resource.
10 holders keeps "units by turn 3" where it is while 3 unit slots move to answers. Sivir + 3
closers is what `sivir-ready.md` §3 settled on and nothing since says otherwise. These are
targets to test against, not measurements.

**Agreed 17 Nov 2026** (Jay: "whatever u think is best!"): targets as drafted.

**The Energy check:** job 1's answers should mostly cost **2 Energy or less**, so the hand can hold
one up after developing. Stage 3 watches "tricks crowded out by Energy" (1.29 now) and doesn't let
it rise.

## 3. Card by card — round 1 drafted 17 Nov 2026, to decide

Round 1 removes the Evelynn plan and fills job 1 (the gap). The units that close and hold (Faefolk
×3, Stranger ×2, Vex ×2, Rengar ×2) stay for now; round 2 reads them.

**The pool, read** (every legal Body/Chaos spell and unit, `data/cards.json`; play rates from the
573 Body/Chaos lists of 50+ cards posted since 23 Oct, 61 placed, 22 Battle Mistress):

| card | job | read | placed B/C lists |
|---|---|---|---|
| **Challenge** 2E 1P | 1 (kill) | Action: our unit and theirs deal their Might to each other. In the showdown when they attack A, our defender kills the attacker *before* combat. With Punch First it kills anything | 1.6%; 18% of Battle Mistress lists |
| **Cannon Barrage** 2E 1P | 1 (kill) | Reaction: 2 to every enemy unit in combat. Defending A against two or three small attackers it kills them all, and it's one legend ready however many die | 0% |
| **Staunch Survivor** 2E 1P | 2 | 2 Might, Shield 2 (4 Might defending): a two-drop that holds A and survives pings | 0%; 23% of BM lists |
| Spoils of War | 4 | Reaction draw 2, 2E 1P after an enemy died that turn. Good with kills, but the bench can't see its draw. **Round 2 / sideboard** | 0% |
| Rampage (in the list) | kill, **our turn only** | No Action tag: main phase only. Clears B for Sivir, not a defence | 85% |
| ~~Bullet Time~~ | | **Not legal for us**: Miss Fortune's signature card (`lib/decks.mjs`, §103.3.d). The 28 Oct note in `sivir-v2.md` missed that | |

**Round 1:** −1 Ember Monk, −1 Evelynn, Entrancing, −2 Tideturner, −1 Edge of Night · +2 Challenge,
+2 Cannon Barrage, +1 Staunch Survivor. All five cut cards are the trap plan's (Monk is paid by
face-down plays; Evelynn, Tideturner and Edge are Hidden).

**Bench** (`scripts/rift try`, 5000 games a scenario; "normal" = the sim's middle pressure):

| measure | now | round 1 | job / target |
|---|---|---|---|
| kills a game, normal / heavy | 0.31 / 0.54 | **0.91 / 1.67** | 1: up ✓ |
| an answer usable on their turn, t3 / t5 (play) | 5% / 56% | 7% / 61% | 1: up ✓ (t3 still weak) |
| Gold made a game, normal | 3.52 | 3.79 | 5: ≥3.5 ✓ |
| tricks crowded out by Energy, normal | 1.29 | 1.28 | Energy check: not up ✓ |
| units by turn 3 (play) | 3.0 | 2.9 | 2: ≥3.0, within a tenth |
| units · spells · gear | 22 · 16 · 2 | 19 · 20 · 1 | shape ~19 · 19 · 2 ✓ |
| Hidden | 8 | 3 (Stranger ×2, Switcheroo) | 6: ≤3 ✓ |
| extra cards drawn, normal | 1.5 | 1.4 | 4: **not up** (Ezreal, Innovator, Nidalee unchanged) |
| Defy-countered spells, expected | 4.2 | 5.9 | cost: more spells. Defy is in 23% of legal-after-ban lists (weigh, don't veto) |
| Mercenary on, turns 4–8, normal | 34% | 32% | flat |

A tested alternative, Spoils of War in place of Staunch Survivor, scored kills 0.94 but units by
turn 3 fell to 2.7. Staunch keeps the board; Spoils waits for round 2.

**Jobs after round 1:** 1: Gust ×2, Dread, Star-Crossed ×2, Rebuke ×2, Punch First ×3, Challenge ×2,
Barrage ×2, Switcheroo, plus Ambush (Nidalee ×3, Rengar ×2); kills on their turn: Challenge,
Barrage, Punch First = 7 · 2: 14 units at 3 Energy or less · 3: Sivir, Rengar ×2, Ride the Wind
×3, Faefolk ×3 · 4: Ezreal ×2, Innovator ×3, Nidalee ×3 · 6: 3 Hidden.

**Second look, 17 Nov 2026 (Jay: "do u like this better? think hard"):** not as drafted.
- **"Kills a game" counts kill spells cast, not kills.** `lib/sim.mjs:77` marks any spell that
  deals damage as a kill and counts every cast (`:434`), with no board and no Might check. A
  2-damage Barrage into 4-Might attackers counts as a kill. So 0.31 → 0.91 overstates it.
- **What the kill trigger is worth, measured:** Gold 3.52 → 3.79, about **0.3 Gold a game**. Edge 2
  ("kills pay twice") is the weakest of the three, and round 1 spent four slots on it.
- **Challenge needs our Might.** Our holders are 1–3 Might, so it usually kills only with Punch
  First, Nidalee or Rengar. Barrage kills only 2-Might attackers outright.
- **Neither has results behind it**: 0% and 1.6% of placed Body/Chaos lists. That could be because
  they don't fit Evelynn, or because they're weak. We can't tell yet.
- **Round 1 lost board**: Might by turn 5, normal, 14.9 → 12.8, and the hold is what has won.
- **The plan is already half in the list**: Ambush (Nidalee ×3, Rengar ×2) is defence from hand,
  paid with Power, that also holds A. That is the truest form of stage 1.

**Round 1, smaller** (Claude's recommendation): −1 Ember Monk, −1 Edge of Night · +1 Staunch
Survivor, +1 Challenge. Removes the two cards that only pay the trap plan and costs no board.

| measure | now | round 1 | smaller |
|---|---|---|---|
| units by turn 3 (play) | 3.0 | 2.9 | **3.2** |
| Might by turn 5, normal | 14.9 | 12.8 | 14.6 |
| an answer usable on their turn, t5 (play) | 56% | 61% | 58% |
| kill spells cast, normal | 0.31 | 0.91 | 0.49 |
| Gold made, normal | 3.52 | 3.79 | 3.63 |
| Defy-countered spells | 4.2 | 5.9 | 4.7 |
| Hidden | 8 | 3 | 6 |

Evelynn, Entrancing and Tideturner stay until a game shows them as dead without her legend.

**Third look (Jay: "u sure you're not just making a change for change sake?"): no change.** The
journal (5-4, 2–3 Nov) loses on play, not cards: leaving the hold, overcommitting, a Faefolk
misplay. No game names Ember Monk or Edge of Night as dead. The smaller swap's gains (units by
turn 3 +0.2, Gold +0.1) are a model's, for two cards with no results behind them. By this repo's
own rule (README, stage 6) a frozen list changes when a logged game trips a watch item, and none
has. **The list stays.** What this worksheet produced is a way of playing it, and the watch items:

- **Play:** hold A; keep Power up on their turn for Ambush (Nidalee, Rengar) and answers rather
  than spending it all on your turn; close with Sivir from 6.
- **Watch, log in the journal:** Ember Monk stuck in hand or played as a plain 4-Energy unit with
  no face-down card to pay him · Edge of Night never flipped · a trick you couldn't cast for
  Energy (the stage 1 risk) · an attack on A you had no answer for. Two of the same in a week
  reopens stage 3 with the smaller swap ready.

**Round 2, still open:** Faefolk's count now that it isn't the only route to B; Stranger (needs 4
units at a battlefield); Vex at 4 Energy; job 4's draw (Spoils); restoring Acceptable Losses to
the sideboard.

## Log

- **17 Nov 2026:** worksheet started after the post-ban review. Jay: don't copy a deck that's better
  at its own strategy. Stage 1 drafted; not agreed yet. Withdrawn along the way: +3 Pyke, Returned
  (his trigger is enemy deaths, the deck's removal mostly bounces, and the bench doesn't model him)
  and +1 Edge of Night (Evelynn's evidence for a Hidden card, without Evelynn's draw).
