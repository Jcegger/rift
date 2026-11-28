---
title: Sivir Is Trying Her Best — Matchups
subtitle: Riftbound, Radiance — the twelve matchups that decide a Nexus Night, one chapter each. Their plan, the cards that beat you, your mulligan, the first three turns on the play and on the draw, the battlefield, the sideboard, the turns that decide it, and the close
author: rift toolchain
date: 2026-11-28
---

**Companion to [the main guide](sivir-one-army.md).** The guide's §9 table is the one-page summary, and the table sheet carries the same sideboard lines. This file explains them. The list is the one frozen on 27 Nov: Sivir; Faefolk ×3, Evelynn, Stranger ×2, Tideturner ×2, Innovator ×3, Ezreal ×3, Nidalee ×3, Ember Monk, Vex ×2, Rengar ×2; Punch First ×3, Switcheroo ×3, Gust ×2, Rebuke ×2, Star-Crossed ×2, Rampage ×2, Existential Dread; Boots, Edge of Night.

**How to read the numbers.**
- **"85%"** is the share of that legend's legal lists from 29 Oct to 28 Nov 2026 that run at least one copy (`rift meta <legend> --since 2026-10-29`; lists holding a card banned on 23 Nov are dropped). "×2.4" is the average copies in those lists. Only 6 to 32 lists per legend have been posted since the ban, so the window starts a month back. **Re-count after 30 Nov**, when the first post-ban weekend lands.
- **Speed** is the goldfish's units and Might by turn 4, on the play (`rift versus`). Yours: **3.4 units, 15.8 Might.**
- **Model** numbers are paired games from the 27–28 Nov audit (`decklab/sivir-tune.md`): this list against the 26 Nov list, on the corrected model. The model tracks real results only moderately (legends r about 0.2), so read them as a lean, not a win rate.
- **Real** results: RiftLite has 0 to 2 logged games for each of these pairs, too few to quote. Your journal games were played with earlier versions of the list.
- **Runes:** on the play you have 2 on turn 1, 4 on turn 2 and 6 on turn 3; on the draw 3, 5 and 7 (the player going second channels one extra on their first turn, §488.7). Every Power you pay by recycling a rune costs you that rune. So "turn 2" can mean two two-drops, or a three-drop with Gust up, and 4-cost cards (their Vex, your Vex and Ember Monk) can land on turn 2.
- **Your legend is visible before battlefields are picked.** Legends go to the Legend Zone at setup (§111), and each player picks a battlefield after that (§488.5). So you can choose game 1's battlefield by matchup; the seat is still unknown (§115). The default is the guide's: **Sigil** in game 1, **Amateur Recital** after a loss (you'll go first), **Forbidding Waste** after a win. A battlefield used in a decided game is retired (§488.5), so **when a chapter opens with Forbidding Waste (Master Yi, Kai'Sa), Sigil takes its place after a win.**
- **"Calm"** is the domain Defy, Discipline and En Garde come from. A Calm deck can counter your 1-Power spells.
- **Where a chapter says "not measured",** the model has no separate run for that matchup (it's inside the field run: 75%, up from 69%), and RiftLite has no games for the pair.

**Rules every chapter leans on** (checked in the main guide §4 and §10):
- **Only Reactions answer a spell.** An Action (Punch First, Rebuke, Switcheroo, Dread) is played on your turn or in a showdown while you have focus, never in response. So in a showdown where they hold removal, **cast your pump first**, before they act.
- **Defy** counters a spell costing 4 Energy or less and 1 Power or less, by printed cost (§206): Gust, Rampage, Star-Crossed and Existential Dread. Punch First, Rebuke and Switcheroo are out of its reach.
- **A token sent to hand stops existing** (§186.1). Gust, Stranger and Star-Crossed kill Sand Soldiers, Reflections, Tentacles and Sprites outright.
- **"Can't be chosen"** (Ruin Runner, Baron Nashor, Akali, Silent, Twilight Shroud) blanks every targeted card you run: Faefolk's pull, Stranger, Switcheroo, Gust, Rebuke, Rampage, Recital's move. Fight it, or Graves it.

| | legend | tier | where the game is decided | in | out |
|---|---|---|---|---|---|
| [1](#1-master-yi-wuju-bladesman) | **Master Yi** | S | fight his units at A, where they lose the +2 | Graves | a Rampage |
| [2](#2-kaisa-daughter-of-the-void) | **Kai'Sa** | A | the closing showdown at B, against two removal spells | Unyielding Spirit ×2, Sabotage | Stranger ×2, a Rampage |
| [3](#3-riven-the-exile) | **Riven** | S | before Baron lands | Offer, Acceptable Losses, Ruin Runner ×2 | Rampage ×2, Faefolk, Evelynn |
| [4](#4-kennen-heart-of-the-tempest) | **Kennen** | S | his face-down stun and Hidden Blade | Sabotage, Ruin Runner | Edge of Night, a Stranger |
| [5](#5-irelia-blade-dancer) | **Irelia** | S | the turn she's tapped out | Ruin Runner ×2 | Rampage ×2 |
| [6](#6-vex-gloomist) | **Vex** | A | her Vex, Apathetic, gone before Sivir | Sabotage, Ruin Runner | Rampage ×2 |
| [7](#7-rengar-pridestalker) | **Rengar** | A | his attacks into A | Graves ×2 | Rebuke, a Switcheroo |
| [8](#8-leblanc-deceiver) | **LeBlanc** | A | bounce, don't kill | Graves ×2 | Rampage ×2 |
| [9](#9-evelynn-agonys-embrace) | **Evelynn** | A | taking her battlefield | Ruin Runner | Edge of Night |
| [10](#10-jayce-defender-of-tomorrow) | **Jayce** | A | the race before his late game | Offer, Acceptable Losses, Prefect | Stranger ×2, Evelynn |
| [11](#11-azir-emperor-of-the-sands) | **Azir** | A | his gear, and the Arise! turn | Offer, Acceptable Losses, Prefect | Stranger, a Switcheroo, Edge |
| [12](#12-diana-scorn-of-the-moon) | **Diana** | B (local) | making her spend first | Ruin Runner ×2 | Stranger ×2 |

---

## 1. Master Yi, Wuju Bladesman

**The matchup you lost twice at the 24 Nov Nexus Night, and the one the 27 Nov changes were built for.** It's winnable when you fight on your terms: every one of his units loses its legend bonus the moment it attacks.

**Their plan.** *"While a friendly unit defends alone, it gets +2 Might."* Yi holds battlefields with one unit and makes each one hard to attack. Master Yi, Tempered (71%) gains 2 XP each time he conquers or holds, and at Level 6 he gets Deflect and Ganking. Scuttle Crab (56%) is his cheap holder. The top end is Rengar, Trophy Hunter (42%), Ruin Runner (42%) and Master Yi, Unstoppable (26%, 12 Might). He's slower than you on board: **2.9 units and 13.2 Might** by turn 4, against your 15.8.

**The cards that beat you.**
- **Charm** (57%, 1E 1P, his turn): *"Move an enemy unit."* It pulls your lone holder out of A, or drags a unit from your base into his battlefield, where *you* attack his lone defender at +2 (the guide's 27 Nov ruling, §190.3.a.1).
- **His tricks on a lone defender:** Discipline (77%, +2 and a card), En Garde (66%, +1, and +1 more when alone: so +4 with the legend), Punch First (65%, +5), Onslaught (37%, +6 on his turn), Grim Resolve (28%, +3).
- **Defy** (76%) counters Gust, Star-Crossed, Rampage and Dread.
- **Ruin Runner** (42%) can't be chosen: no pull, bounce, swap or Recital move touches it.
- **Alpha Strike** (40%): his unit deals its Might split among your units at battlefields. One cast can clear your two-drops off A.
- **Back Off** (29%), hidden: a stun from his battlefield's face-down slot.

**Your role: the beatdown at his battlefield, the trap at yours.** A lone defender of his wins its fight at B. The same unit pulled into A is an attacker, not alone as a defender, and fights at its printed Might. **Every fight you want is at A.**

**Mulligan.** Keep two two-drops plus Switcheroo, Punch First or Gust. **Keep Rengar and Nidalee here**, an exception to the guide's general send-back: Ambush answers his attacks into A, and his Charm can't touch a card in your hand. **Send back** Rampage and Star-Crossed (Defy), and Boots.

**On the play.** Turn 1: a two-drop to a battlefield; it becomes A. Turn 2: a second unit at A, so a Charm can't strand a lone holder. Turn 3: hide Switcheroo at A (fights against Yi are one-on-one, so it beats Stranger here), and keep Gust open.
**On the draw.** He gets a battlefield first; let him. Turn 1: a two-drop to the other battlefield, Gust up with your third rune. Turn 2: second holder at A. Turn 3: hide, and leave nothing precious in base.

**Battlefield.** **Game 1: Forbidding Waste.** *"While a unit here is defending alone, it has −2 Might,"* which cancels his legend's +2 there. Win game 1 and Waste is retired: Sigil after a win, Recital after a loss. His own picks: Grove of the God-Willow (47%, draws on hold) and Gardens of Becoming (28%). Contest Grove early: every hold is a card for him.

**Sideboard.** **Graves in, a Rampage out.** Graves defends A against a wide attack. Rampage is a Defy target, and the one you need least here.

**The turns that decide it.**
- **Turns 3–5: Master Yi, Tempered arrives** and starts banking XP. Answer him before Level 6, while he has no Deflect: Rebuke (Defy can't touch it), or Faefolk walks into A and pulls him in.
- **Every turn of his: count Charm.** With 1 Energy and 1 Power open, assume it. Two units at A, and nothing in base you can't afford to fight a lone defender with.
- **Bait Defy with Gust** before the turn you need Star-Crossed or Dread.
- **The close.** Pull B's defender into A with Faefolk or Evelynn: it attacks, without the +2. B is empty, and Sivir walks in. His answers in B's showdown are thin, and one is real: Rengar, Trophy Hunter by Ambush (*"can be played to a battlefield where there are enemy units"*). He arrives as B's only defender, so his legend makes him 8 against Sivir's 6. **Hold Punch First for Sivir** (Defy can't counter it) and cast it once he's committed.

**What wins it:** two holders at A, his units dying there one at a time, Tempered answered before Level 6. **What loses it:** a lone holder Charmed out, units parked in base, and attacking his lone defender at B.

**Evidence.**
- **Model:** this list won 76% against Yi lists (69% for the 26 Nov list; 960 paired games, +0.61 points at turn 8).
- **Your journal:** 0–2 (logged 25 Nov), with the earlier list.
- **Real data:** no RiftLite games for the pair.

---

## 2. Kai'Sa, Daughter of the Void

**The hardest matchup in the model, and the one where the close needs the most care.** She won't attack your trap. She kills what you leave on the board and waits for Sivir.

**Their plan.** Her legend exhausts to add 1 Power of any colour *for spells only*, so she always has one more spell than her runes suggest. She holds a battlefield, kills your units from range, and wins late. She has the field's deepest removal:
- **Hextech Ray** (93%): 3 damage to a unit at a battlefield, Action.
- **Falling Star** (86%): 3 damage, twice, her turn only.
- **Singularity** (71%): 6 to each of up to two units, her turn only.
- **Bellows Breath** (72%): 1 to up to three units at one place, with Repeat.
- **Void Seeker** (51%): 4 damage and a card, Action.

The tricks are Stupefy (92%, −1 and a card), **Smoke Screen** (85%, −4 to a minimum of 1) and Temporal Breach (47%). **Thousand-Tailed Watcher** (81%) gives all your units −3 (to a minimum of 1) the turn it lands. Her late game is **Time Warp** (72%): 10 Energy and 4 Power for an extra turn. She counters nothing of yours. **2.7 units and 14.9 Might** by turn 4.

**Her battlefields matter more than anyone's.**
- **Void Gate** (90%): *"Spells and abilities affecting units here each deal 1 Bonus Damage."* Bellows Breath there deals 2 to three units, which clears every two-drop you own; Hextech Ray deals 4.
- **Rockfall Path** (77%): *"Units can't be played here,"* so no Ambush and no face-down unit can be played there.
- **Frozen Fortress** (57%): 1 to each unit there at each Beginning Phase; Faefolk dies to it.
- **Never make Void Gate or Rockfall your A.** Frozen Fortress only with units of 2+ Might, never Faefolk.

**Your role: the beatdown.** She's control, so the trap idles. Bring it to her: Faefolk and Evelynn pull her B holder into A, and you race to hold at 7.

**Mulligan.** Units with 3+ Might matter more than usual (Ember Monk, Nidalee, Ezreal, Vex survive Bellows Breath). Keep two two-drops and a three-drop. Keep Punch First: it saves Sivir (below). **Send back** Stranger (she rarely attacks into A), Gust (her units are big) and Boots.

**On the play.** Turn 1: a two-drop to a battlefield that isn't Void Gate or Rockfall. Turn 2: a three-drop or a second unit. Turn 3: Ember Monk or Nidalee at A; hide Switcheroo, not Stranger.
**On the draw.** Same, but expect Bellows Breath on turn 2 or 3. **Don't commit three two-drops to one battlefield.**

**Battlefield.** **Game 1: Forbidding Waste.** She holds a battlefield with one big unit, and the −2 there makes it yours to take. Win it and Sigil comes next; lose it and Recital.

**Sideboard.**
- **In:** Unyielding Spirit ×2 (*"Prevent all spell and ability damage this turn,"* Reaction) and Sabotage (takes Time Warp, Smoke Screen or a Ray from her hand).
- **Out:** Stranger ×2 and a Rampage.

**The turns that decide it.**
- **Her Watcher turn** (7 Energy and 1 Power; 8 and 2 to Accelerate it ready). Your units at A drop to 1 Might and her 7-Might Watcher attacks. **Switcheroo face down at A is the answer**: swap Mights, and your unit is 7 against her 1. Punch First (+5) on a 1-Might unit isn't enough. Existential Dread stuns it, and its Repeat bounces it.
- **The close: she needs two cards to kill a 6-Might Sivir** in B's showdown. Smoke Screen (−4, to 2) then Hextech Ray (3) does it. No single card does: Falling Star and Singularity are her turn only.
  - **Game 1, before sideboarding:** cast Punch First on Sivir the moment you get focus in B's showdown. At 11, Smoke Screen leaves her at 7 and Ray deals 3 (4 at Void Gate). Killing her then takes a third card (Void Seeker).
  - **After sideboarding:** walk in with Unyielding Spirit held. It's a Reaction, so cast it in response to the Ray.
- **Count Time Warp.** From about her turn 8, a hold at 7 can be answered by an extra turn. Your terminal scan covers two turns of hers.

**What wins it:** holders she can't Bellows, the Watcher turn met with Switcheroo, Sivir walking in with protection. **What loses it:** two-drops spread on Void Gate, Faefolk on Frozen Fortress, and Sivir walking in naked against open Power.

**Evidence.**
- **Model:** 54% against Kai'Sa lists, the lowest of the matchups measured (47% for the 26 Nov list; 960 paired games, +0.41).
- **Real data:** no RiftLite games for the pair.

---

## 3. Riven, The Exile

**A race against one card.** Before Baron Nashor, this is a fight you win with the trap. After Baron, you win only by holding at 7.

**Their plan.** *"Units you play to battlefields you control enter ready,"* so her units can be played and attack in the same turn. **Expect one more attacker than her board shows.**
- **Her engine:** Reckless Innovator (96%), Riven, Deserter (76%, exhausts a friendly unit to ready another), Blade of the Exile (88%, +3 equipment) and The Good Stuff (64%).
- **The same hidden tricks you run:** Stranger (79%), Tideturner (65%), Switcheroo (57%), Gust (69%), Star-Crossed (64%), Rebuke (49%).
- **The top end:** Blitzcrank (63%), Astral Heron (40%, 7 Might, discounts her next card) and **Baron Nashor** (41%, 10E 3P, can't be chosen, +2 to her other units, and adds a third battlefield).

**2.7 units and 13.0 Might** by turn 4. Only 7 lists have been posted since the ban took Riven, Broken Blade, so expect fewer Rivens than her S tier suggests.

**The cards that beat you.**
- **Defy** (92%) and **Discipline** (89%).
- **Her face-down cards:** your own tricks, aimed back at you.
- **Blitzcrank:** *"When you play me to a battlefield, you may move an enemy unit to here,"* which drags your lone holder away.
- **Scuttle Crab** (72%): when it dies, she sees your hand and face-down cards for the turn. **Bounce it, don't kill it**, on the turn you need the trap hidden.

**Your role: the beatdown before Baron, then control.** Press her battlefield early. **Rebuke the first Astral Heron**: its discount is how Baron comes down a turn early.

**Mulligan.** Keep two two-drops and Punch First or Switcheroo (Defy-proof). **Send back** Rampage (out after sideboarding anyway), Star-Crossed and Gust (all Defy targets).

**On the play.** Turn 1: a two-drop to a battlefield. Turn 2: a second unit at A. Turn 3: hide **Stranger**: ready units mean wide attacks, and wide attacks are Stranger's.
**On the draw.** She can play to her battlefield and attack A on her turn 2. Keep two at A from your turn 2, and Gust up for her Stranger (it misses if Stranger leaves before its bounce resolves, §811.1.d.3.a).

**Battlefield.** **Sigil of the Storm** in game 1. Her conquests there recycle a rune, and Baron needs 13 resources. Her own picks: Hunters' Circle (81%), Rakelstake (69%) and Windswept Hillock (43%, Ganking there).

**Sideboard.** **In:** An Offer You Can't Refuse and Acceptable Losses for the Blade, Ruin Runner ×2 as holders Blitzcrank can't move. **Out:** Rampage ×2 (Defy), a Faefolk and Evelynn. You'll pull less and race more.

**The turns that decide it.**
- **Turns 4–6: the Blade.** Kill it with Offer while it's on a unit that matters.
- **Turn 6+: Baron.** Count her Energy and Power: 10 and 3, less with a Heron at a battlefield.
- **Once Baron is out:** he can't be pulled, bounced or swapped, and the Pit is a third battlefield. The guide's reading is that a conquest for the 8th point then needs the Pit scored too. **Win by holding A at 7.**
- **The close before Baron:** the normal pull-and-walk. Her answers in B's showdown are Rebuke and Star-Crossed on Sivir: hold Gust for her Stranger, and close when she's short of 2 Power.

**What wins it:** pressure before turn 6, the Heron answered, two holders against Blitzcrank. **What loses it:** a slow game into Baron, and Gust or Rampage cast into open Defy.

**Evidence:** not measured.

---

## 4. Kennen, Heart of the Tempest

**Wide and small, and it fights with face-down cards.** Your trap is at its best against wide boards, and Rampage is clean.

**Their plan.** *"When you play a card from anywhere other than your hand, empower me."* Face-down cards and Flow spells from the trash power his legend, which then gives a unit Assault 2.
- **The engine:** Lightning Rush (75%) and Up from the Deep (58%, two 1-Might Tentacles), both replayable with Flow; Fizz (60%).
- **The units:** Trifarian Captain (47%), Traveling Merchant (42%), Tail-Cloaked Matriarch (40%).
- **Face down:** Kennen, Keeper of Balance (53%, a 2-Might unit that stuns for 2 Energy) and Tornado Warrior (33%).
- **The top end:** Baron Nashor (32%).

**3.4 units but only 11.8 Might** by turn 4: as many bodies as you, each smaller.

**The cards that beat you.**
- **Kennen, Keeper of Balance, face down:** a stun in the middle of your fight, from his battlefield.
- **Hidden Blade** (30%): kills a unit at a battlefield. Its controller draws 2, but Sivir in B is dead.
- **Cull the Weak** (42%): each player kills one of their own units. **Keep a spare unit** (a Faefolk in base) so it never takes a holder.
- **Hard Bargain** (32%): counters a spell unless you pay 2. Keep 2 Energy spare when the spell matters.
- **Star-Crossed** (61%) and **Gust** (46%) on your Stranger before it resolves.
- **Baron Nashor** (32%).

**Your role: control.** You win the early fights on Might. Let him come to A, where Stranger's four units come easily against his wide board.

**Mulligan.** Keep two two-drops, Gust (a Tentacle token is gone for good, §186.1; a Captain goes back to hand) and Rampage (no Defy). **Send back** Boots and Star-Crossed.

**On the play.** Turn 1: a two-drop. Turn 2: a second unit at A, or Ezreal. Turn 3: hide Stranger at A.
**On the draw.** Same. His Tentacles are 1 Might each, so a 2-Might holder survives their attack.

**Battlefield.** Game 1: **Sigil of the Storm**. His picks are Zaun Warrens (53%, loot on conquest) and Minefield (44%, mills him on conquest: it feeds his Flow).

**Sideboard.** **In:** Sabotage (takes Hidden Blade or Hard Bargain out of his hand) and Ruin Runner. **Out:** Edge of Night and a Stranger. His Star-Crossed and Gust answer Stranger, and one copy is enough against his board.

**The turns that decide it.**
- **His face-down card at his battlefield.** Assume Keeper of Balance. Attack there only when the stun doesn't lose you the fight.
- **Turn 5–6: Assault 2 turns.** A Tentacle with Assault 2 is 3 Might, attacking. Your 4-Might holders still beat it.
- **The close.** Hidden Blade is the card that stops Sivir. **Sabotage first, or pull with Faefolk and Boots a holder** so you have two ways into B.

**What wins it:** fights at A against small attackers, Rampage on his best unit, a spare unit for Cull. **What loses it:** a Keeper stun at the wrong moment, and Sivir walking into Hidden Blade.

**Evidence:** not measured.

---

## 5. Irelia, Blade Dancer

**She answers more of your cards than any S-tier deck.** She answers every targeted card you own, and some twice.

**Their plan.** *"When you choose a friendly unit, you may exhaust me and pay 1 to ready it."* Every trick she casts can also ready the unit. Her board is small and sticky:
- **Irelia, Fervent** (98%): Deflect, +1 whenever chosen or readied.
- **Vex, Apathetic** (76%).
- **Tideturner** (92%), Reckless Innovator (82%), Scuttle Crab (90%).
- **Akali, Silent** (34%): can't be chosen.

The tricks:
- Discipline (100%), **Defiant Dance** (98%, +2 to hers and −2 to yours: a 4-point swing for 1E 1P), En Garde (80%), Battle Preparations (40%);
- **Not So Fast** (80%), **Defy** (98%), **Charm** (80%);
- Twilight Shroud (48%, a unit can't be chosen this turn).

**Only 2.4 units and 10.6 Might** by turn 4: she's the slowest board in the S tier.

**The cards that beat you.**
- **Not So Fast:** *"Counter an enemy spell or ability that chooses a friendly unit or gear."* It counters Faefolk's pull, Stranger's bounce, Rebuke, and Switcheroo on her unit.
- **Defy:** Gust, Star-Crossed, Dread and Rampage.
- **Defiant Dance** reverses any even fight.
- **Scuttle Crab:** dying, it shows her your face-down cards.
- **Vex, Apathetic:** stuns Sivir as she lands.

**Your role: the beatdown.** She's slow on board and rich in answers. Develop wide, hold A with two, and make her spend her answers on her own turn. **Close only when she's tapped out:** Not So Fast is 2E 1P, Defiant Dance 1E 1P, Discipline 2E.

**Mulligan.** Units over spells. Keep two two-drops and two of Nidalee, Ezreal, Innovator and Vex. **Send back** Rampage, Star-Crossed and Gust, all Defy targets.

**On the play.** Turn 1: a two-drop to the battlefield that isn't Targon's Peak. Turn 2: a second unit at A, or a three-drop. Turn 3: two more plays. Hide Switcheroo only when she's spent her Power for the turn.
**On the draw.** Same. She rarely attacks before turn 3.

**Battlefield.** **Sigil** in game 1, as usual. Hers: Targon's Peak (92%, readies 2 runes on conquest), Abandoned Hall (90%, every spell pumps her unit there) and Sunken Temple (88%). **Don't fight at Abandoned Hall** when she has cards in hand.

**Sideboard.** **Ruin Runner ×2 in, Rampage ×2 out.** Ruin Runner can't be chosen, so Charm, Gust, Star-Crossed and Defiant Dance's −2 all miss it.

**The turns that decide it.**
- **Every turn she leaves Power up, assume Not So Fast.** Use the turn for units, not for the pull.
- **Kill or bounce her Vex before Sivir**, with Rebuke (Defy can't touch it; Not So Fast can).
- **The close:** wait for the turn she spends below 2E 1P, or bait with a Rebuke on Irelia, Fervent first. A booted holder walking A → B chooses nothing, so it's the close she can't counter.

**What wins it:** a wider board than hers, Ruin Runner at A, a close on her empty turn. **What loses it:** a pull into Not So Fast, and Rampage or Gust into Defy.

**Evidence:** not measured.

---

## 6. Vex, Gloomist

**A race to hold at 7.** She won't walk into A, and her own Vex shuts off your closing turn until she's gone.

**Their plan.** *"When you or an ally hold, you may exhaust me to draw 1."* She holds, draws, and answers.
- **Vex, Apathetic** (98%): every unit you play while she's at a battlefield is stunned and can't move that turn.
- **Face down:** Back Off (83%, a stun), Switcheroo (70%), Stranger (58%) and Evelynn (60%), paid by Bandle Scouts' Academy (55%, a Gold for each hide).
- **Reactions:** Defy (83%), Discipline (77%), Star-Crossed (68%), Gust (53%), Not So Fast (45%).
- **Holders:** Mutated Mouser (51%, 3 defending, Tank) and Steel Paws (41%).

**3.3 units and 13.8 Might** by turn 4.

**The cards that beat you.**
- **Her Vex, Apathetic.** Sivir played while Vex is at a battlefield is stunned and can't walk to B. So is a Faefolk played that turn.
- **Back Off** at her battlefield stuns your attacker mid-fight.
- **Defy and Not So Fast:** your Gust, Star-Crossed, Rampage and Dread, and your pulls.

**Your role: the beatdown.** She's control; race to hold at 7 and bring the trap to her.

**Mulligan.** Keep Rebuke (your answer to her Vex) and two two-drops. **Put Faefolk on the board early:** a unit already in play isn't stunned by Vex, so a Faefolk in base from turn 2 can still walk on the closing turn. **Send back** Rampage (out after sideboarding) and Boots.

**On the play.** Turn 1: a two-drop to a battlefield. Turn 2: Faefolk to base, or a second holder. Turn 3: a three-drop and a hide. Her Vex costs 4 Energy, so it can land as early as her turn 2: get your units down first.
**On the draw.** Same, one turn behind her: her Vex can already be out when your turn 2 starts. Play units before it where you can, and Ambush after it only if the stun doesn't matter.

**Battlefield.** Sigil in game 1. Hers: Startipped Peak (58%, a rune on hold) and the Academy (55%). **Taking her Academy** trashes her face-down card there (§107.3.d) and stops the Gold.

**Sideboard.** **Sabotage and Ruin Runner in, Rampage ×2 out.** Sabotage strips Back Off or Defy before the closing turn.

**The turns that decide it.**
- **Her Vex lands:** remove her the turn before you close, or on the closing turn before Sivir. **Rebuke** her: Deflect makes it 3 Power, which turns on Sivir's +2 and Ganking by itself. Or pull her into A with Faefolk (1 more Power for Deflect) and kill her there.
- **The close that ignores Vex:** a booted holder already at A walks to B. It isn't played that turn, so Vex doesn't stun it.

**What wins it:** Faefolk on the board before her Vex, Rebuke saved for her, a booted second closer. **What loses it:** Sivir played into an untouched Vex, and fights at her battlefield into Back Off.

**Evidence.**
- **Model:** not measured.
- **Real data:** RiftLite has 2 games (both losses), too few to read.
- **The guide's verdict (1 Nov):** one of the two worst matchups.

---

## 7. Rengar, Pridestalker

**He attacks A with everything, and A is where your cards are.** Your best matchup in the room.

**Their plan.** *"When you play a unit, give a unit +1 Might this turn."* Every unit he plays pumps another, and most of them can arrive mid-fight.
- **Ambush:** Inferna (90%, +2 attacking), Nidalee (83%), Grim Apothecary (81%), Rengar, Trophy Hunter (92%).
- **Hidden:** Elnuk Herd (65%, +3 to a friend).
- **Thrill of the Hunt** (90%): banishes his unit and replays it at any battlefield, for free.
- **Your own card:** Irresistible Faefolk (81%).
- **His spells:** Punch First (81%), Rampage (77%) and Sabotage (65%).

**3.5 units and 16.1 Might** by turn 4: the one deck here faster than yours. He counters nothing.

**The cards that beat you.**
- **His Faefolk pulls your holder** out of A. Keep two there.
- **Thrill of the Hunt** saves a bounced or pulled unit and drops it on an empty battlefield. The guide's §6 has the worked example: pulling B's defender into A while he has 2E 1P open hands him B.
- **Sabotage:** he sees your hand and recycles your best spell. **Hide Switcheroo early**: a face-down card is safe from it.

**Your role: control.** Let him come. Stranger fires against his wide attacks, Dread and Switcheroo against his single big attacker, and your Vex stuns every Ambush unit he plays.

**Mulligan.** Keep two two-drops and Stranger, Dread or Vex. Rampage is good here (no Defy). **Send back** Boots and Star-Crossed.

**On the play.** Turn 1: a two-drop. Turn 2: a second holder at A. Turn 3: hide Stranger at A; keep Gust up for Inferna or Pit Rookie.
**On the draw.** He'll attack on his turn 2 with a pumped two-drop. Keep Gust open from your turn 1 (you have three runes).

**Battlefield.** **Game 1: Sigil of the Storm.** His: Seat of Power (75%, draws on conquest for each other battlefield he controls) and Hunters' Circle (52%).

**Sideboard.** **Graves ×2 in, Rebuke and a Switcheroo out.** Graves defending A deals his 4 Might to every attacker there.

**The turns that decide it.**
- **Turn 3–4: his first wide attack into A.** Flip Stranger and return Rengar or the biggest attacker.
- **Vex at A on turn 4** turns off his Ambush turns.
- **The close:** pull only when he can't pay 2E 1P for Thrill. Otherwise close with a hold at 7.

**What wins it:** a trap at A when he attacks, two holders against his Faefolk. **What loses it:** pulling into an open Thrill, and spells left in hand for Sabotage.

**Evidence:** not measured. **The guide's verdict (1 Nov):** your best matchup.

---

## 8. LeBlanc, Deceiver

**Everything of hers wants to die,** so the matchup turns on bouncing instead of killing.

**Their plan.** *"When you conquer or hold, you may discard 1 and exhaust me to play a ready Reflection token there. It becomes a copy of another unit there."* The Reflection has Temporary.
- **Death engines:** LeBlanc, Fragmented (90%, a card on death), Karthus, Eternal (89%, every Deathknell triggers twice), Glasc Mixologist (88%, replays a 3-cost unit from the trash), Ruined Rex (83%, 4 damage to your unit on death).
- **Ways to kill her own units:** Sacrifice (81%), Deathgrip (80%), Dusk Rose Lab (92%).
- **Removal:** Hidden Blade (80%), Vi, Peacekeeper (84%, Ambush, stuns your unit when she attacks), Cull the Weak (59%).
- **Thousand-Tailed Watcher** (69%): −3 to all your units.
- **Windswept Hillock** (89%): every unit there has Ganking, hers and yours.

**3.3 units and 13.4 Might** by turn 4. She counters none of your spells.

**The cards that beat you.**
- **Deathgrip and Sacrifice** (Reactions): she kills her own target in response, so your bounce misses and she draws.
- **Ruined Rex:** kill it and it deals 4 to one of your units, twice with Karthus.
- **Hidden Blade** on Sivir in B.
- **The Watcher turn,** as against Kai'Sa: your units at A drop to 1.

**Your role: control.** Hold A; let her attack into it.

**Mulligan.** Keep two two-drops and Gust or Stranger: bounces are your removal here, and **Gust on a Reflection kills it for good** (§186.1). **Send back** Rampage (out after sideboarding) and Boots.

**On the play.** Turn 1: a two-drop, not to Windswept Hillock if she'll control it. Turn 2: a second holder. Turn 3: hide Stranger, or Switcheroo once the Watcher is live (her turn 7).
**On the draw.** Same.

**Battlefield.** **Game 1: Sigil of the Storm.** She brings Forbidding Waste too (46%); hold it with two.

**Sideboard.** **Graves ×2 in, Rampage ×2 out.** Graves's damage kills her attackers. That feeds her death triggers, but A stays yours, and that's the trade you want.

**The turns that decide it.**
- **The bounce turn.** Bait Deathgrip and Sacrifice first, with a lesser bounce or a fight, then flip Stranger.
- **Ruined Rex:** bounce it, never fight it to the death.
- **The close:** Hidden Blade is her answer. Pull B's defender into A with Faefolk, and keep Star-Crossed (a Reaction) to save Sivir if the Blade comes.

**What wins it:** bounces instead of kills, Reflections Gusted, Deathgrip baited. **What loses it:** Rampage into Ruined Rex and Karthus, and her Watcher turn met without a face-down Switcheroo.

**Evidence:** not measured.

---

## 9. Evelynn, Agony's Embrace

**The face-down mirror**, and the most-posted deck in the field (414 lists). Whoever owns the other's battlefield owns the other's face-down card.

**Their plan.** *"Once each turn, when you play a card from face down, draw 1. Then, if it's not your turn, discard 1."* She hides every turn and draws off it.
- **Paying for it:** Bandle Scouts' Academy (95%, a Gold each time she hides there) and Bandle Tree (43%, a second face-down slot).
- **Hidden units:** Evelynn, Entrancing (93%), Gutter Guardian (80%), Pyke, Returned (70%, Gold when your units die), Momentary Companion (53%).
- **Tricks:** Hold 'Em (79%, +3), Edge of Night (64%), Switcheroo (63%), Punch First (54%), Rampage (64%), Star-Crossed (62%), Vex (58%).
- **Last Caress** (38%): her next unit can be played to any battlefield, even from face down.

**3.4 units and 15.7 Might** by turn 4: the same speed as yours.

**The cards that beat you.**
- **Her face-down card at her battlefield:** Evelynn, Gutter Guardian, Pyke, Momentary Companion, Switcheroo or Edge, flipped at Reaction speed.
- **Vex, Apathetic** (58%), the same problem as against Vex.
- **Last Caress:** a surprise unit on your B in the closing showdown.

**Your role: the beatdown at her battlefield.** **Conquering her battlefield trashes her face-down card there** (§107.3.d). The Academy is usually her A; take it and her engine stops.

**Mulligan.** Keep two two-drops and Rampage (no Defy: clean here). Keep Faefolk: pulling her Academy holder into your A empties it. **Send back** Boots and Star-Crossed.

**On the play.** Turn 1: a two-drop toward her likely battlefield, or the neutral one. Turn 2: a second unit; walk Faefolk at her Academy when she holds it with one unit. Turn 3: hide your own card at A.
**On the draw.** She'll hide on turn 1 or 2. Plan your first conquest of her battlefield for turn 3.

**Battlefield.** **Game 1: Sigil of the Storm.** Her picks: the Academy (95%), Rakelstake (44%), Bandle Tree (43%) and Startipped Peak (34%).

**Sideboard.** **Ruin Runner in, Edge of Night out.** Her Switcheroo and Rampage aim at your holders; Ruin Runner can't be chosen by either.

**The turns that decide it.**
- **Every conquest of hers trashes your card at A** if she takes it. Two holders, always.
- **Her Vex:** gone before Sivir.
- **The close:** pull her B holder into A, then walk Sivir in. Hold 2 Power for Punch First against a Last Caress unit.

**What wins it:** her battlefield taken with her face-down card on it, Rampage on her best unit. **What loses it:** losing A with your trap on it, and Sivir into her Vex.

**Evidence.**
- **Model:** 71% against Evelynn lists (61% for the 26 Nov list; 960 paired games, +0.94, the largest gain of the three matchups measured).
- **Your journal:** 0–2 on 3 Nov, with the earlier list.
- **Real data:** RiftLite has 1 game.

---

## 10. Jayce, Defender of Tomorrow

**Ramp with a slow start.** The trap barely matters; the race does.

**Their plan.** *"1 Energy, exhaust: Ready a gear"* (two gear when empowered).
- **Ramp:** Platewyrm Egg (65%, gear that makes Energy) and Acceleration Gate (70%, readies up to 4 units, gear or runes).
- **The top end:** Jayce, Brilliant Inventor (55%, 6 Might), Elder Dragon (32%, 10 Might: *"Any amount of your damage is enough to kill enemy units"*), The Empyrean and Gentle Gemdragon (30% each, 8 Might).
- **Tricks:** Retreat (42%): returns his own unit to hand and channels a rune, so it saves a unit from your Rampage and ramps him.

**2.2 units and 12.4 Might** by turn 4: tied with Azir for the fewest units of these twelve. His removal is light (Wages of Pain 22%, Shock Blast 18%).

**The cards that beat you.** His late units outsize everything you own: Elder Dragon kills any unit it damages. Acceleration Gate gives him a second attack in one turn.

**Your role: the beatdown.** Ramp, so race. Get to 6 before his 8-Might units arrive.

**Mulligan.** Keep two two-drops and a three-drop. Keep Rebuke (it answers an Elder Dragon for good: 12 Energy to replay). **Send back** Stranger (he rarely attacks wide) and Star-Crossed.

**On the play.** Turn 1: a two-drop to a battlefield. Turn 2: a second unit, then walk at his battlefield. Turn 3: conquer; hold where you can.
**On the draw.** Same. He has nothing to stop a turn-2 attack.

**Battlefield.** **Game 1: Sigil of the Storm.** Each conquest of his there recycles a rune, which slows the ramp. His picks vary (Ornn's Forge, Piltovan Forge and Veiled Temple, 37% each).

**Sideboard.** **An Offer You Can't Refuse, Acceptable Losses and Ravenbloom Prefect in; Stranger ×2 and Evelynn out.** Kill the Egg early: it's the ramp.

**The turns that decide it.**
- **Turns 2–5:** you're ahead on board; take points.
- **Turn 6+: his first 8-Might unit.** Rebuke it, or let it sit at his battlefield while you hold A to 7.
- **Acceleration Gate** readies his attackers for a second fight. Keep Gust or Dread for the second attack.

**What wins it:** points before turn 6, his Egg killed. **What loses it:** a slow game, and fighting the Elder Dragon.

**Evidence.** **Model:** not measured on its own. **Real data:** none for the pair; Jayce's tier is A on thin data ("2× thin").

---

## 11. Azir, Emperor of the Sands

**Gear, then a board of tokens in one turn.** Your bounces are removal here, and his gear is what matters.

**Their plan.** *"Your Sand Soldiers have Weaponmaster,"* and his legend makes a 2-Might Sand Soldier (1 Energy and exhaust) on any turn he's played an Equipment.
- **Gear in every list:** B.F. Sword, Brutalizer, Doran's Shield and Eye of the Herald (100% each); Hand Hammer and Soul Sword (86%).
- **Soldiers:** Guards! (99%, hidden) and **Arise!** (97%, 6E 1P: a Soldier for each Equipment he controls, two of them ready).
- **The champion:** Azir, Sovereign (97%) moves his tokens to the fight when he attacks.
- **Answers:** Discipline (99%), Defy (99%), Back Off (83%) and Hidden Blade (82%).
- **Battlefield:** Trifarian War Camp (96%, +1 Might to every unit there).

**2.2 units and 12.6 Might** by turn 4: slow until Arise!.

**The cards that beat you.**
- **Arise!**, the turn his board doubles.
- **Defy** on Gust, Star-Crossed and Rampage.
- **Hidden Blade** on Sivir.
- **Back Off** from his battlefield's face-down slot.

**Your role: the beatdown, then the trap.** Press before Arise!. When it comes, his ready Soldiers attack A, and A is where your trap is.

**Mulligan.** Keep two two-drops and Rebuke or Switcheroo (Defy-proof). **Send back** Rampage, Star-Crossed and Gust: all Defy targets, though a Gust on a Sand Soldier still kills it when Defy is spent.

**On the play.** Turn 1: a two-drop. Turn 2: a second unit; attack his battlefield before the gear piles up. Turn 3: hide at A.
**On the draw.** Same.

**Battlefield.** **Game 1: Sigil of the Storm.** His Trifarian War Camp gives every unit there +1, but his units fight there most, so avoid fighting him on it.

**Sideboard.** **An Offer You Can't Refuse, Acceptable Losses and Ravenbloom Prefect in; Stranger, a Switcheroo and Edge of Night out.** Prefect banishes the Equipment as it's played. Offer kills B.F. Sword (+3) on the unit that matters.

**The turns that decide it.**
- **Turn 6: Arise!.** Count his Equipment: that's the number of Soldiers. Keep Stranger or Dread for the attack it starts.
- **Every bounce on a token is a kill** (§186.1).
- **The close:** Hidden Blade is his answer to Sivir. Bait it, or close with a booted holder.

**What wins it:** gear killed on the right unit, pressure before turn 6, tokens bounced. **What loses it:** Gust and Rampage into Defy, and an Arise! turn with A held by one unit.

**Evidence:** not measured.

---

## 12. Diana, Scorn of the Moon

**B tier in the wider field, and your worst matchup at Sip & Play.** She answers every fight.

**Their plan.** *"Exhaust: Add 1 Energy. Spend this Energy only during showdowns."* Her extra Energy is always there for your fights, and her deck is made of answers:
- **Reaction bounces:** Gust (98%), Star-Crossed (98%).
- **Reaction shrinks:** Stupefy (97%), Eclipse (91%, −4), Smoke Screen (58%).
- **Counters:** Hard Bargain (86%, *"Counter a spell unless its controller pays 2"*).
- **Moonfall** (94%, Action): *"Choose a battlefield where you have units. You may move up to one enemy unit to that battlefield. Then give enemy units there −2 Might this turn."*
- **Her units:** Vex, Apathetic (86%), Hwei (96%, 5 Might), Diana, Lunari (100%), Ravenbloom Student (91%), Tideturner (90%).

**3.1 units and 13.0 Might** by turn 4.

**The cards that beat you.**
- **Gust on your Stranger** before its bounce resolves.
- **Moonfall** in B's showdown: it moves Sivir out to her battlefield, at −2.
- **Hard Bargain:** a spell of yours without 2 spare Energy is countered.
- **Vex, Apathetic.**

**Your role: the beatdown, slowly.** Make her spend first. Energy she spends on her own turn isn't there for your showdowns, and her legend's extra Energy alone pays for little more than Stupefy.

**Mulligan.** Units. Keep two two-drops and two of Nidalee, Ezreal, Innovator and Vex. **Send back** Star-Crossed and Rampage.

**On the play.** Turn 1: a two-drop not on Targon's Peak. Turn 2: a second unit at A, or a three-drop. Turn 3: two more plays. Hide only what she can't Gust (Switcheroo, Edge of Night).
**On the draw.** Same. Diana, Lunari (3 Energy) comes early; Hwei (5 Might) from turn 3.

**Battlefield.** **Game 1: Sigil of the Storm.** Hers: Abandoned Hall (89%) and Targon's Peak (80%).

**Sideboard.** **Ruin Runner ×2 in, Stranger ×2 out.** Ruin Runner at A has nothing for Moonfall, Gust or Star-Crossed to aim at. Stranger is 2 Might, and her Gust is everywhere.

**The turns that decide it.**
- **Her Vex:** Rebuke with 2 spare Energy for Hard Bargain.
- **Gust her 2–3-Might bodies** on her turn, when she's spent her showdown Energy.
- **The close:** units, not spells. A booted Ruin Runner walking A → B can't be Moonfalled. Sivir walks in only after she's spent Moonfall or her Power.

**What wins it:** Ruin Runner at A, her answers spent on lesser threats first. **What loses it:** Stranger into Gust, Sivir into Moonfall, and spells cast without 2 spare Energy.

**Evidence.**
- **Model:** not measured.
- **Real data:** RiftLite has 1 game.
- **The guide's verdict (1 Nov):** your worst matchup.

---

## Sources and method

- **Counts:** `scripts/rift meta <legend> --since 2026-10-29` and `scripts/rift versus <legend> --deck "Sivir Is Trying Her Best" --since 2026-10-29`, run 28 Nov 2026 on the data built 25–28 Nov. Card text is quoted from `data/cards.json` with errata applied.
- **Tiers:** `rift field --tiers` (results-led).
- **Model:** `decklab/sivir-tune.md`, "Audit, 27–28 Nov".
- **Rules:** the main guide §4 and §10 and `docs/rules-rulings.md`. Two claims new to this file: §186.1 (a token that goes to hand stops existing) and §111 with §488.5 (legends are placed before battlefields are picked).
- **What it doesn't claim:** none of these plans has been tested at a table with this list. Log each game with its battlefield and the turn it was decided.
