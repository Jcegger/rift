---
title: Riven, The Exile — Radiance Gauntlet & Sideboard
subtitle: Riftbound, Radiance season (from 23 October 2026) — who a local Skirmish will bring, how Riven plays into each, and what to board
author: rift toolchain
date: 2026-10-19
---

**This is a prediction.** Radiance is not legal until **23 October**, nobody has played
Radiance constructed in a sanctioned event, and every plan below is a reading of the cards
and the last format's results, **untested in a real game**. Each box says what it rests on.
When your rounds disagree with it, your rounds win: log them in the journal and this page
gets rewritten from them.

**Legend:** The Exile (Calm/Chaos) · **Champion:** Riven, Broken Blade

**Your list:** `Riven v1 (Radiance theory)`: 40 main, 12 runes (6 Calm / 6 Chaos), 3
battlefields (Grove of the God-Willow, Hunters' Circle, Packed Amphitheater), 10 sideboard.
Read it live with `scripts/rift deck riven`.

---

## The field, from the evidence

**One RQ counts.** Stacked Deck and Ekko, Recurrent were banned on **18 September**, after
Singapore and before Los Angeles. So **RQ Los Angeles (late September) is the only RQ in
the current format**, and it was 2026's last. Riot's article gives the full Top 8 and a Day
1 / Day 2 table by legend (`data/topdecks.json`). **Converts** is Day 2 share ÷ Day 1 share:
above 1.00 the deck beat the field, below it lost to it. Day 1 was 1,962 players and Day 2
was 371, both as summed from Riot's table.

| legend | domains | Day 1 | converts | LA Top 8 | riftbound.gg |
|---|---|---|---|---|---|
| **Irelia, Blade Dancer** | Calm/Chaos | 193 (9.8%) | 1.32 | **2nd**, 5th | Tier 1 |
| **Kennen, Heart of the Tempest** | Order/Chaos | 165 (8.4%) | **2.02** | — (Best-Of #13) | Tier 1 |
| Jayce, Defender of Tomorrow | Mind/Body | 153 (7.8%) | 1.14 | — | Tier 3 |
| **LeBlanc, Deceiver** | Mind/Order | 149 (7.6%) | 1.35 | — | Tier 2 |
| **Rengar, Pridestalker** | Fury/Body | 92 (4.7%) | 1.15 | **1st** | Tier 1 |
| Akali, Rogue Assassin | Fury/Calm | 83 (4.2%) | 0.76 | 7th | Tier 2 |
| Vex, Gloomist | Calm/Chaos | 81 (4.1%) | 1.24 | — | Tier 3 |
| **Azir, Emperor of the Sands** | Calm/Order | 79 (4.0%) | 1.07 | 3rd, 4th | Tier 2 |
| **Master Yi, Wuju Bladesman** | Calm/Body | 75 (3.8%) | 1.20 | 6th | Tier 1 |
| Ornn, Fire Below the Mountain | Calm/Mind | 50 (2.5%) | 1.27 | 8th | Tier 3 |

**Two facts stand out.** **Kennen converted at twice the field rate** and put more players
into Day 2 than any other legend (63), yet missed the Top 8. Riot's own read is that players
"came into the event with plans for countering it". **Irelia was the most-played deck and
the finalist.** Both carry into Radiance with nothing banned.

**What a local Skirmish adds.** Locals over-index on two things in a new set's first weeks.
**The precons:** the Radiance Showdown box is **Seraphine vs. Evelynn**, so expect both,
mostly stock. **Hype brews of the nine new legends.** Those are unknown decks, so play your
own game.

**The gauntlet, in the order you're most likely to face it:** Irelia, Kennen, Rengar, Master
Yi, LeBlanc, Azir, Jayce, then Vex, Akali and Ornn, with Seraphine and Evelynn mixed in from
day one.

---

## Your deck in one paragraph

**Riven turns every unit you play into a card.** The Exile makes units played to a
battlefield you control **enter ready**. A ready unit can pay an exhaust cost the turn it
lands, and an exhausted unit **still defends** (§466.2.c.3). So Meditation draws 2, Life
from Stone draws and ramps, Hunker Down cycles, Blade of the Exile equips, and Riven,
Deserter readies a unit, all at almost no cost. **You win by out-carding the opponent at the
battlefield you hold**, not by racing. The sim says the curve is smooth, no mulligan policy
beats keeping, and 6/6 runes are right. Keep Life from Stone > Reckless Innovator >
Meditation, and bottom Janna, Caitlyn or Blade first.

**What beats you:** decks that **take the battlefield away** before the engine runs (aggro
with pump: Rengar, Yi), and decks that **ready their own units better than you do** (Irelia).

---

## The sideboard card that matters: Mageseeker Warden

Read its two lines against this field:

> *While I'm at a battlefield, opponents can only play units to their base.*
> *While I'm at a battlefield, spells and abilities can't ready enemy units and gear.*

**That switches off the engine of seven of the ten decks above:**

| deck | what Warden stops |
|---|---|
| **Irelia** | her legend's ready, the whole deck's engine |
| **Rengar** | Trophy Hunter's Ambush onto a battlefield (he comes down in base), and **Thrill of the Hunt banishes their unit and leaves it banished** |
| **Azir** | the ready from Arise! ("ready two of them") and from Guards! |
| **LeBlanc** | her legend's Reflection token at a battlefield |
| **Jayce** | his legend readying gear |
| **Akali** | the Empowered ready on her legend |
| **Ornn** | Pit Crew readying when a gear is played |

The Thrill of the Hunt line is a **derived ruling**: Warden's restriction makes the play
fail to finalize (§355.17.b, whose own example is Warden), the failed play is undone
(§358.5), and nothing undoes the banish. (Re-derived against the 2026-10-09 Core Rules,
which dropped the §358.3.a sentence the first version leaned on; same answer.) It's recorded in
[rules-rulings.md](../docs/rules-rulings.md). **Ask the judge before you rely on it.** The rest is
Warden's plain text.

**The catch:** Warden is 6 Energy + 1 Calm, it's a 5 Might body, and it only works **while
it's at a battlefield**. Land it on a battlefield you already hold. Riven makes it enter ready
there, so it can defend or pay an exhaust cost the same turn. Expect them to point Falling
Star, Hidden Blade or Rampage at it.

**Recommendation: a second Warden in the board, for Ki Burst.** Ki Burst comes in for one
matchup below (Yi); Warden comes in for seven.

---

## How to use the boxes

**Their plan** is what the deck is trying to do, from the LA and Singapore Top lists (cards
in 75%+ of them). **Respect** lists their cards that punish you, with what each one costs,
because whether Defy or Hush can stop a spell depends on its cost:

- **Defy** counters a spell costing **≤4 Energy and ≤1 Power**.
- **Hush** counters a spell costing **2+ Power**. In this field that means **Punch First,
  Falling Star, Switcheroo, Rebuke, Mirror Image** and the big Mind finishers.
- **Not So Fast** counters an enemy spell or ability **that chooses your unit or gear**.
- **Gust** returns a ≤3 Might unit at a battlefield. **A token returned to hand stops
  existing** (§186.1), so Gust is removal against Sand Soldiers, Tentacles and Reflections.

**Board** is one-for-one, in → out. Out-cards are chosen from the four that do least against
most decks: Bedeviling Stranger (needs 4+ units at a battlefield), Lonely Poro, Scuttle Crab
(0 Might) and Zhonya's Hourglass (dead against decks with little removal).

---

## Irelia, Blade Dancer — Calm/Chaos · LA finalist · the mirror of your colors

**Their plan.** Every time Irelia's player chooses a friendly unit (Discipline, Defiant Dance,
Ride the Wind, an equip), her legend can **ready it**. Their units attack, then stand up to
defend, and Stellacorn Herder draws every time it moves. They run the same reactions you do:
**3 Defy, Discipline, Not So Fast, Gust, Star-Crossed.**

**Respect.** Defiant Dance (1E 1P, +2 theirs / −2 yours, a Reaction, combat-deciding).
Boots of Swiftness. Their Defy against your Star-Crossed.

**Your plan.** **Warden is the matchup.** With it at a battlefield, their legend does nothing.
Before it lands, **trade on card count rather than combat**: they need fights to use their
pump spells, and every fight you decline is a Defiant Dance rotting in hand. **Hold Defy for
Defiant Dance in a combat that decides a battlefield**, not for a cantrip.

**Board.** +Mageseeker Warden, +Gust, +Gust → −Bedeviling Stranger, −Lonely Poro,
−Zhonya's Hourglass. Gust hits Herder (3), Tideturner, Scuttle Crab and their Boots carrier
before it equips.

## Kennen, Heart of the Tempest — Order/Chaos · best converter at LA

**Their plan.** Play cards from **anywhere but hand** (Nocturne revealed off the top, Flow
replays from the trash, Up from the Deep) to empower Kennen, then give a unit Assault 2.
Tempo units with **Ganking** (Nocturne, Shadow Order Disciple), and Rhasa the Sunderer
late, cheap off a full trash. Seal of Discord ramps them.

**Respect.** **Switcheroo** (2E 2P, Hidden, swaps Might in a fight). Gust and Star-Crossed on
your best unit. Ride the Wind.

**Your plan.** **Vex, Apathetic stuns every unit they play while she's at a battlefield,
Nocturne off the deck and Tentacles included.** That's their whole tempo plan. Bring in the
second Vex and land her early. **Hush the Switcheroo.** Defy Lightning Rush only if nothing
better is coming. Up from the Deep and Ride the Wind are better targets. Warden does little
here.

**Board.** +Vex, Apathetic, +Hush, +Not So Fast → −Bedeviling Stranger, −Lonely Poro,
−Zhonya's Hourglass.

## Rengar, Pridestalker — Fury/Body · won LA

**Their plan.** Go wide fast. The legend gives +1 Might per unit played, Punch First adds
+5, Rampage is a fight-as-removal, and Ambushers (Grim Apothecary, Rengar, Trophy Hunter)
drop onto **your** battlefield mid-combat. **Sabotage** reveals your hand and recycles a
non-unit card, which means your reactions.

**Respect.** **Punch First** (1E 2P: Hush it). Rampage (3E: Defy it). Thrill of the Hunt
(2E 1P: Defy it, or let Warden strand it). Sabotage.

**Your plan.** **Survive to the engine.** Warden stops every Ambush onto a battlefield. Hush
answers the +5. Against Sabotage, **cast your cheap cantrips on your own terms** (Meditation,
Life from Stone at the end of their turn) rather than holding a full hand of reactions for
them to pick through. Caitlyn's ping kills most of their 2–3 drops. Star-Crossed is your
answer to Trophy Hunter.

**Board.** +Mageseeker Warden, +Hush, +Hush, +Gust → −Scuttle Crab, −Scuttle Crab,
−Bedeviling Stranger, −Siren of the Shallows.

## Master Yi, Wuju Bladesman — Calm/Body · Tier 1

**Their plan.** A unit **defending alone gets +2 Might**. They hold battlefields with one big
defender, pump it (Punch First, Discipline) and Charm your attacker away. Rengar, Trophy
Hunter Ambushes in.

**Respect.** Punch First (Hush). Charm (1E 1P: Defy). Their own Defy.

**Your plan.** **A stunned unit deals no combat damage**, and that beats a lone defender
however big it is. Riven, Broken Blade's stun mode, Back Off and Ki Burst are your answers,
and Riven's exhaust engine is what turns Ki Burst's cost into a free stun. **Attack with two**,
so their pump goes on one and the other connects.

**Board.** +Hush, +Hush, +Back Off, +Ki Burst → −Bedeviling Stranger, −Lonely Poro,
−Zhonya's Hourglass, −Zhonya's Hourglass.

## LeBlanc, Deceiver — Mind/Order · converts 1.35

**Their plan.** Value from dying. Karthus, Eternal doubles Deathknells, Ruined Rex deals 4
when it dies, and Glasc Mixologist replays a unit from the trash. When they conquer or hold,
the legend copies a unit there.

**Respect.** Mirror Image (3E 2P: Hush). Hidden Blade (kills at a battlefield, you draw 2).
Deathgrip.

**Your plan.** **Bounce, don't kill.** Star-Crossed and Gust send a unit to hand with no
Deathknell, and a Reflection token returned to hand is gone. **Killing a Ruined Rex is
Falling Star on your own unit.** Caitlyn's ping is weak here. Warden stops the legend's token
at a battlefield.

**Board.** +Gust, +Gust, +Hush, +Mageseeker Warden → −Caitlyn, −Caitlyn,
−Bedeviling Stranger, −Lonely Poro.

## Azir, Emperor of the Sands — Calm/Order · 3rd and 4th at LA

**Their plan.** Equipment. On a turn they play one, the legend can make a Sand Soldier
(and Soldiers have Weaponmaster). **Arise!** (6E 1P) makes a Soldier per Equipment and readies two of them.

**Respect.** **Arise!:** neither Defy (over 4 Energy) nor Hush (only 1 Power) can counter
it. **Warden is the answer.** Its Soldiers come down in base and can't be readied. Also
respect Hidden Blade, Guards! and Back Off.

**Your plan.** **Gust a Soldier and it's gone.** Acceptable Losses makes each player kill
one of their gear, so cast it when **you have none** and it's pure removal of their best
Equipment.

**Board.** +Mageseeker Warden, +Acceptable Losses, +Gust, +Gust → −Bedeviling Stranger,
−Lonely Poro, −Zhonya's Hourglass, −Zhonya's Hourglass.

## Jayce, Defender of Tomorrow — Mind/Body · ramp

**Their plan.** Ramp (Catalyst of Aeons) into Dazzling Aurora (9E gear that plays a free unit
each turn) and Elder Dragon (12E). The legend readies gear.

**Respect.** Elder Dragon. Aurora. Sabotage.

**Your plan.** **Pressure before turn 6** and **Defy the Catalyst** (4E 0P). **Star-Crossed
an Elder Dragon**, since a 12-drop sent to hand is a turn they don't get back. Acceptable
Losses kills the Aurora once you have no gear of your own on board.

**Board.** +Acceptable Losses, +Mageseeker Warden → −Zhonya's Hourglass, −Zhonya's
Hourglass.

## Vex, Gloomist · Akali, Rogue Assassin · Ornn, Fire Below the Mountain

- **Vex (Calm/Chaos control).** Astral Heron (7 Might: Star-Crossed it), Switcheroo and
  Rebuke (both 2 Power: **Hush**). Board +Hush, +Hush, +Not So Fast → −Bedeviling Stranger,
  −Lonely Poro, −Zhonya's Hourglass.
- **Akali (Fury/Calm).** Shuriken Flip kills your 1–2 Might units and Falling Star (2 Power:
  **Hush**) kills two. Warden stops the Empowered ready. Board +Hush, +Hush, +Mageseeker
  Warden → −Siren of the Shallows, −Siren of the Shallows, −Bedeviling Stranger.
- **Ornn (Calm/Mind gear).** Board +Acceptable Losses, +Mageseeker Warden → −Zhonya's
  Hourglass, −Zhonya's Hourglass.

## Radiance newcomers

- **Seraphine, Starry-Eyed Songstress (Mind/Order, precon).** Exhausting her and three units
  makes a spell 2 cheaper, so expect big spells early. **Hush** the 2+ Power ones and keep
  Defy for the cheap ones.
- **Evelynn, Agony's Embrace (Body/Chaos, precon).** Draws when she plays a card from
  facedown, so expect Hidden cards. **Scuttle Crab's Deathknell lets you look at facedown
  cards**, so keep both in.
- **Everyone else** (Ekko, Ziggs, Mordekaiser, Orianna, K'Sante, Jarvan IV): no list exists
  yet. Play your engine, and write down what they did.

---

## Board at a glance

| vs | in | out |
|---|---|---|
| Irelia | Warden, Gust ×2 | Stranger, Poro, Zhonya |
| Kennen | Vex, Hush, Not So Fast | Stranger, Poro, Zhonya |
| Rengar | Warden, Hush ×2, Gust | Scuttle ×2, Stranger, Siren |
| Master Yi | Hush ×2, Back Off, Ki Burst | Stranger, Poro, Zhonya ×2 |
| LeBlanc | Gust ×2, Hush, Warden | Caitlyn ×2, Stranger, Poro |
| Azir | Warden, Acceptable Losses, Gust ×2 | Stranger, Poro, Zhonya ×2 |
| Jayce | Acceptable Losses, Warden | Zhonya ×2 |
| Vex | Hush ×2, Not So Fast | Stranger, Poro, Zhonya |
| Akali | Hush ×2, Warden | Siren ×2, Stranger |
| Ornn | Acceptable Losses, Warden | Zhonya ×2 |

**How many matchups each board card comes in for:** Warden 7, Hush 6, Gust 4, Acceptable Losses 3,
Not So Fast 2, Vex 1, Back Off 1, Ki Burst 1. **That's the case for the second Warden.**

## What would change this page

- **Your rounds.** One tap in the journal per round (opponent, W/L). After about five
  rounds against the same legend, its box is rewritten from what happened.
- **The first Radiance results.** The first Radiance Skirmishes (from 9 November) and any
  big event that posts lists. `data/topdecks.json` picks up Riot's articles automatically.
- **A judge on Warden vs. Thrill of the Hunt.** If the ruling goes the other way, Rengar's
  box loses one line, and nothing else changes.
