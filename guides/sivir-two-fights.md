---
title: Sivir, One Army Two Fights — Deck Guide
subtitle: Riftbound, Radiance — Battle Mistress (Body/Chaos). Midrange to 6, then take the second battlefield from many angles. The list, how it wins, battlefield picks, the close, and every matchup in Jay's field.
author: rift toolchain
date: 2026-10-30
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main (Champion included) + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend · **Sideboard:** 10 of 10
> **Superseded.** Written 30 Oct 2026 in a session that was not pushed until 3 Nov. The same draft became the trap list, [Sivir Is Trying Her Best — The Trap](sivir-one-army.md), now Jay's main deck. Kept for the record; its Nilah, Rampage and battlefield reasoning is not in the trap list.

**Was saved in the app as** `Sivir: One Army, Two Fights (draft)` · **Worksheet:** [decklab/sivir-two-fights.md](../decklab/sivir-two-fights.md)
**Sister deck:** [Sivir Is Trying Her Best](sivir-trying-her-best.md) (R5). 16 cards and all three battlefields differ.
**Record:** none yet. Log every game under the deck's name: opponent, first or second, battlefield, **which route won**.
**Collection status:** all owned except Nidalee, Cat Form ×2

**Nothing here is a win rate.** Numbers are goldfish (`scripts/sim`, `scripts/rift try`), list shares
since 23 Oct, or hand-played samples (8 games a version), and say which.

---

## 1. The list

| | |
|---|---|
| **Units (22 + champion)** | 3 Irresistible Faefolk · 2 Bedeviling Stranger · 2 Staunch Survivor · 3 Reckless Innovator · 2 Fizz, Trickster · 2 First Mate · 2 Nidalee, Cat Form · 2 Nilah, Joyful Ascetic · 2 Vex, Apathetic · 2 Rengar, Trophy Hunter · *Sivir, Mercenary* |
| **Spells (14)** | 3 Ride the Wind · 3 Punch First · 3 Star-Crossed · 2 Rebuke · 1 Rampage · 1 Abandon · 1 Sabotage |
| **Gear (3)** | 2 Portable Portal · 1 The Good Stuff |
| **Battlefields** | Zaun Warrens · Amateur Recital · Windswept Hillock (§3) |
| **Runes** | 6 Body · 6 Chaos (`scripts/sim`: every split spends the same Energy) |
| **Sideboard** | 2 Graves, Blasting Through · 2 Unyielding Spirit · 1 An Offer You Can't Refuse · 1 Switcheroo · 1 On the Hunt · 1 Ravenbloom Prefect · 1 Gust · 1 Repulse |

---

## 2. How it wins

**Midrange to 6, then take the second battlefield.** The last points come one of four ways:

| route | how |
|---|---|
| **1. Two fights** | win A, then reach B the same turn and win there |
| **2. Split** | a unit from base to each battlefield, when both are lightly held |
| **3. Hold, then one fight** | holding A at the start of your turn scores it, so one conquest of B wins from 6 |
| **4. Hold at 7** | a hold is never gated (§473.1.a.1): hold again and win |

**In practice holds close most games** (routes 3 and 4). What makes this deck different from R5 is
**how it takes B**: Faefolk's pull, the Portal and Hillock's Ganking, Ride the Wind, Nilah, Rengar's
Ambush. The two-fight turn is a finisher, never the plan.

**The five rules that matter most:**
1. **Hold at 7 and win.** The eighth point by conquer needs both battlefields scored that turn.
2. **Readying doesn't move units battlefield to battlefield.** Only Ganking does (Portal, Hillock,
   Sivir switched on), or Ride the Wind's effect move.
3. **Fighting doesn't exhaust; moving does.** Units that won a fight at A are still ready.
4. **Move into B in one group.** The first unit to arrive starts B's fight and shuts off further
   normal moves.
5. **Gold made this turn can't be spent this turn** (it enters exhausted). Plan Sivir's 2 Power from
   runes or earlier Gold.

---

## 3. Battlefields

Every battlefield used in a decided game is retired for the match (§488.5), so each has a slot.

| pick | battlefield | why |
|---|---|---|
| **Game 1 (blind)** | **Zaun Warrens** (loot on conquer) | pitch the situational card (Sabotage, Abandon, Ride the Wind into Defy). **Against Kennen pick Hillock**: 87 Kennen lists run Warrens and use it better |
| **Going first** | **Amateur Recital** ("When you hold here, you may move a unit at a battlefield to its base") | your hold sends B's defender home before your turn: route 3 into an empty B. **Whoever holds it uses it: never leave it empty or held by one small unit** |
| **Going second** | **Windswept Hillock** ("Units here have Ganking") | a free Portal: an army holding it moves to the other battlefield every turn. Their units there get it too |

---

## 4. Mulligan and the first turns

**Keep** any two units on the draw. On the play, count **only Faefolk and Stranger as turn-1 plays**:
Staunch needs a Body rune (stuck on colour turn 1 on the play: 24%, goldfish). A hand with Innovator
and no 2-drop is still a keep on the play: turn-2 Innovator with Accelerate enters ready and takes a
battlefield.

**Keep first:** Vex, Innovator, Rengar, First Mate, Faefolk. **Bottom first:** Punch First, Sabotage,
Staunch. Against big-unit decks (Rengar, LeBlanc's Dragons), a third unit over a second spell.

**A normal game:** 2-drop turn 1 → first point turn 2 → 3-drops and even trades turns 3–4 → reach 6
with a closer in hand turns 5–6 → the close, after the terminal scan (can either player reach 8 before
the other acts again?).

---

## 5. The close

**Lines from 6** (any one finishes when A is already scored this turn):

| line | needs | stopped by |
|---|---|---|
| **Portal at A, after A is won** | Portal (2E; pay a Body to ready one unit). Every unit at A gets Ganking; can't be answered when played on the closing turn | Warden cancels the ready (not the Ganking) |
| **Hold Hillock or a Portal'd A, the army walks to B** | nothing extra | their refills at B |
| **Recital's hold** sends B's defender home | Recital, held | Deflect taxes it |
| **Faefolk walks into A, pulls B's defender in** | Faefolk; B empties | its pull chooses: Deflect, Not So Fast, "can't be chosen" |
| **Ride the Wind** a unit from A to B, ready | 2E 1P | Defy; their Vex's "can't move" on her own unit |
| **Nilah with Accelerate** (4E + Body), ready that turn | Nilah | **their Vex stuns anything played that turn** |
| **Sivir with Accelerate**, 2 Power spent turns on her Ganking | Sivir (always in the Champion Zone) | their Vex; a spell on her at B |
| **Rengar Ambushes onto B** | 5E 1P, 6 Might | their Vex |
| **Clear B first:** Rebuke (Defy can't touch it), Rampage, Star-Crossed | the spell | Rampage and Star-Crossed are Defy-able |

**Play notes:**
1. **Portal after A is won, never before.**
2. **Take the two-fight turn only when the battlefield you leave stays held.** Leave one unit at A.
3. **Send two threats at B, not one.** A lone attacker at B is the likeliest failure.
4. **Nilah + Sivir together:** Nilah's Accelerate Body counts toward Sivir's 2 Power.
5. **Cast Rebuke at B first** to see their answer before committing.

---

## 6. Matchups and sideboard

Sideboarding is 1-for-1 between games, never before game 1. Rows are from the stress tests'
opponent's-view audit (local field) and field audit (S tier), adapted to the locked list.

| vs | what they do to you | your plan | in | out |
|---|---|---|---|---|
| **Kennen** (often) | Rhasa, Nocturne; their Ride the Wind refills B; Hard Bargain; Offer can kill a resting Portal | Vex out before the Rhasa turns; two threats at B; 2 Energy spare for Hard Bargain; Portal only on the closing turn. **Pick Hillock** | Graves, Repulse | 2 Stranger |
| **Kai'Sa** (rising) | Watcher and Falling Star sweep the hold; Brynhir; Time Warp from 6 with 10+ runes; **Temporal Breach on her Rockfall Path banishes for good** | hold your own battlefield; keep two units in hand until after Watcher; Sabotage Time Warp or Falling Star; nothing you need on her Rockfall Path (Abandon or Star-Crossed in response) | 2 Unyielding Spirit | 1 Rebuke, 1 Faefolk |
| **Vex** | her Vex stuns everything you play; Defy; Back Off at B; Evelynn pulls your holder | **Rebuke their Vex first**; close with units already on the board (a Portal at a held A, Faefolk played the turn before) | 2 Graves | Sabotage, 1 Ride the Wind |
| **Rengar** | Ambush at 7 Might; Thrill refills B; Sabotage takes your Star-Crossed | your Vex out before their attack (every Ambush is a unit played, so it's stunned); defend, then hold at 7; never attack B into 6 open runes | 2 Graves | 1 Ride the Wind, 1 Faefolk |
| **Diana** | answers inside your fights: Moonfall, Ride the Wind, Tideturner, Hard Bargain | split the attack across both battlefields; Sabotage Moonfall first | Gust, Repulse | 2 Stranger |
| **Akali** | small damage (Shuriken Flip, her ping, Marai) kills Faefolk and Stranger; Defy 94% | hold your own battlefield; bait Defy with Ride the Wind or Sabotage; Punch First can't be countered | 2 Graves | 2 Stranger |
| **Ornn** | big equipped units; Charm moves your unit | race; Rebuke strands their equipment; keep two units at A against Charm | Prefect, Offer | Sabotage, 1 Star-Crossed |
| **Lilia** | no legal lists in the data since 16 Oct | log the first game and her list | — | — |
| **LeBlanc** | Sacrifice on Rex with Karthus; Hidden Blade at B; Harnessed Dragons | close early, before Rex and Karthus are both out; bounce Rex first (no deathknell) | 2 Unyielding Spirit | 1 Nidalee, 1 Stranger |
| **Riven** | Defy, Tideturner at B; Baron (then only the hold at 7 wins) | Rebuke B's lone defender, then two threats | Switcheroo, Repulse | Sabotage, 1 Ride the Wind |
| **Irelia** | 3–4 one-Energy tricks up; her Vex | score early, then hold; walk Sivir in from base | Switcheroo, Repulse | 1 Ride the Wind, 1 Stranger |
| **Master Yi** | Ruin Runner can't be chosen; +2 to a lone defender | split early; Faefolk pulls the lone defender; hold at 7 | 2 Graves | Sabotage, 1 Stranger |

---

## 7. What to log, and what decides it

Per game: opponent, first or second, battlefield picked, **which route won** (two fights, split,
hold-then-conquer, hold at 7), and whether the Portal or Faefolk took B.

**Watch items** (a list change only when a logged game trips one):
- **Ran out of cards?** Fix: +1 Ezreal, Prodigy for a Bedeviling Stranger, or a second The Good Stuff.
- **A lone big unit with no bounce in hand?** Fix: a second Rampage for Sabotage or Abandon.
- **Turn 1 on the play:** a play, or Staunch stuck behind Chaos runes?
- **Recital or the Portal used against you?**

After a few Nexus Nights, the journal decides between this deck and R5.
