---
title: Archetypes — What Each Legend Is Trying to Do
subtitle: Riftbound, every legend placed on two axes — the overarching archetype and the family of its engine — with game plans, engines, what each fears, how Sivir meets it, and what each entry stands on
author: rift toolchain
date: 2026-10-28
---

The layer above the cards. [rules.md](rules.md) says what the rules are, [strategy.md](strategy.md)
says how to choose a line, and the deck guides in `guides/` go deep on one deck. This page says
**what every legend's deck is for**: how it wins, the engine it runs on, the cards that make it
itself, what beats it, and what the matchup turns on from Sivir's side
([Sivir Is Trying Her Best](../guides/sivir-trying-her-best.md)).

## How to read this page

**Two axes** (agreed with Jay, 28 Oct 2026; the reasoning is in
`decklab/archetype-taxonomy.md`). Every heading reads **Overarching · Family**:

- **Overarching: how the deck wins the race.** *Aggro*, *tempo*, *midrange* or *control*,
  **judged**, with the measured profile as evidence. Ramp is not one of them: every player has
  all 12 runes by turn 6 (§315.3.b.1), so ramp only gets a deck to the same mana sooner; a ramp
  deck is placed by what it ramps into. Control, in Riftbound, is mostly holding.
- **Family: the engine, the loop the deck runs**, one of eleven (below). **A deck is in a family
  for its payoffs, not its card counts**: most Radiance decks run some Hidden, and that alone
  makes nobody a Facedown deck. Empower is a switch, placed by what it turns on.
- **Tags** sit after the heading: *combo* (the win is a specific interaction), *Aurora* (runs
  Dazzling Aurora; never suggested for Jay, always covered as an opponent).

**Evidence.** Each entry says what it stands on, best first: **Radiance results** (recorded
good finishes from 23 Oct 2026, Radiance's legal date, one-on-one events only), then claims,
then posted lists. Most Radiance results so far come from one event, the LDXP Sacramento 25k,
and its top 13 are not in the data yet: one big room is still one room. An entry with no
Radiance results says so; its plan is Vendetta evidence and the cards' text. Live numbers
(shares, the measured profile) are on each legend's page in the app, not copied here, so they
cannot go stale.

**Sources and calls.** Where an outside guide names the deck, **Sources** quotes it with its
date and set. **An expert-sourced call stands over a reading of the profile, unless the Radiance
results contradict it**; a **Call** line says which way a heading went and why, dated. The
measured label (`data/archetypes.json`) calls tempo for any deck with 10+ Hidden or Reaction
cards, which most Radiance decks now pass, so a measured "tempo" alone moves nothing. Each
**Engine** line is the answer key the engine reader is tested against (`lib/engines.test.mjs`);
it can differ from the family, as Riven's does. Game plans are readings of the cards, not tested
lines, and matchup notes say what a matchup turns on, never who is favoured.

**A legend can play more than one deck.** The map places each legend by its representative
list; a **Variants** line names the others: two speeds of the same legend, Aurora builds, and
decks the lists split into (`lib/netdeck.mjs`).

**The families.**

- **Fights:** winning combats: bigger units, pumps, buffs, Mighty, stuns.
- **Movement:** payoffs for moving or exhausting, and ways to move again.
- **Gear:** equipment and gear as the threat.
- **Go-wide:** many bodies: tokens, and payoffs for units dying.
- **Card flow:** value from the trash, the top of the deck, discards, playing from elsewhere.
- **Spells:** spell count and spell payoffs.
- **Facedown:** Hidden as the plan, paid off by the legend or the deck.
- **Holds:** rewarded for controlling or holding battlefields.
- **Ramp:** reaching the 12-rune cap early, or making big cards cheap.
- **Extra resources:** a second currency built and spent: Gold, XP.
- **No engine:** a curve or a removal suite with no loop.

## The map

Every legend, by its representative list. Variants (two speeds, Aurora builds) are on each entry.

| family | Aggro | Tempo | Midrange | Control |
|---|---|---|---|---|
| **Fights** | Ambessa, Darius, Rengar |  | Draven, K'Sante, Lee Sin, Leona, Rumble, Sett |  |
| **Movement** | Kha'Zix, Vi | Irelia, Miss Fortune, Yasuo |  | Akali |
| **Gear** | Jarvan IV, Lucian, Ornn | Ziggs | Jax, Orianna |  |
| **Go-wide** | Rek'Sai | Azir, Lillia | Garen, LeBlanc, Mordekaiser, Zed | Viktor |
| **Card flow** | Jinx |  | Ekko, Kennen |  |
| **Spells** |  | Diana | Mel | Jhin, Kai'Sa, Lux, Seraphine |
| **Facedown** | Teemo | Evelynn |  |  |
| **Holds** |  |  | Ivern, Poppy, Riven | Ahri, Master Yi (Wuju Bladesman), Renata Glasc, Shen, Vex |
| **Ramp** |  |  | Fiora, Renekton, Volibear | Jayce *combo*, Nasus |
| **Extra resources** | Sivir | Pyke | Master Yi (Wuju Master) |  |
| **No engine** |  |  |  | Annie, Ezreal |

## Aggro — a cheap curve, many units, little interaction: close before they stabilize

**Aggro · Fights:** Rengar, Pridestalker, Ambessa, Matriarch of War, Darius, Hand of Noxus.

### Rengar, Pridestalker — Aggro · Fights
*Body / Fury.* **Evidence:** Radiance results, 10 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** 30 units. The legend gives +1 Might whenever you play a unit, and the units arrive
  where it hurts — Ambush (Inferna, Grim Apothecary, Nidalee, Cat Form, Rengar, Trophy Hunter, which
  can be played to a battlefield with enemy units) and Reaction (Rengar, Pouncing (*in none of the 10 Radiance results*), into a
  battlefield you are attacking). Thrill of the Hunt replays a unit at any battlefield.
- **Also in nearly every Radiance result** (90%+, not named above): Noxus Hopeful, First Mate, Pit Rookie, Sabotage, Punch First, Irresistible Faefolk, Rampage, Ferrous Forerunner.
- **Wins by:** fights the opponent cannot plan for, because the attackers are still in hand.
- **Fears:** answers held for the moment Ambush units land; mass shrink.
- **From Sivir:** *hold.* The fastest deck here (16.1 Might by turn 4); Rampage 93%; no counters; Noxus Hopeful in 98%. Bring in 2 Graves; take out 2 Sabotage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** winning fights — the legend pumps a unit for every unit you play, and Ambush puts them into the fight.
- **Sources:** riftbound.gg guide (Vendetta, 30 Aug 2026): "the top aggressive legend", "a very proactive game plan": win the early showdowns, then keep making threats, drawing off Kai'Sa, Survivor, Kinkou Initiate and Nidalee, Cat Form.

### Ambessa, Matriarch of War — Aggro · Fights
*Body / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** two speeds: midrange 58%, aggro 40% of lists.
- **Plan:** Empower everything (Legion Marauder, Kayle, Justified, Solari Sunhawk, both Ambessas);
  the legend empowers itself whenever you empower something else and spends it to ready a unit.
  Guttural Roar gives +4 to an Empowered unit. Ambessa, Respected and Feared kills a smaller enemy
  when she attacks while Empowered.
- **Against it:** the Empower costs are paid up front; answers after the investment are the
  efficient ones.
- **Engine:** Empower — the legend empowers itself whenever you empower something else, and spends it to ready a unit; the list is Empower cards.
- **Sources:** riftbound.gg guide (Vendetta, 14 Aug 2026): no label; "built around winning … on the board", with Ambessa, The Wolf as the chosen champion and Empower cards.

### Darius, Hand of Noxus — Aggro · Fights
*Fury / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend adds Energy with Legion; Darius, Trifarian grows and readies on your second card each turn; Spectral Matron and Baited Hook replay units from the trash.
- **Engine:** Legion — the legend adds Energy on the second card; Darius, Trifarian grows on it.
- **Call (20 Oct 2026):** aggro. The riftbound.gg guide (6 Jul 2026): Darius "plays in a hurry", because Legion's extra rune is worth most early, so it develops as much as it can as fast as it can.

**Aggro · Movement:** Vi, Piltover Enforcer, Kha'Zix, Voidreaver.

### Vi, Piltover Enforcer — Aggro · Movement
*Fury / Order.* **Evidence:** Radiance results, 3 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
The legend readies a unit after conquering with 3+ excess damage; Hextech Gauntlets, Vault Breaker (Assault 2 and Ganking), Vi, Peacekeeper stuns on attack.
- **Engine:** gear, winning fights and moving on — Assault wins the fight, Ganking (Vault Breaker, Gem Jammer, Rengar, Unseen, Jhin) moves the winner to the next battlefield, and the legend readies it after a big conquest. (27 Oct 2026: written from one list; the 100 lists since lean on Ganking.)

### Kha'Zix, Voidreaver — Aggro · Movement
*Body / Chaos.* **Evidence:** Radiance results, 2 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Variants:** two speeds: Jun's Aggro and Midrange lists (in the app), and the field splits the same way (aggro 49%, midrange 40% of lists).
- **Plan:** the legend gains XP when you win a combat and spends it to buff a unit or **walk an
  exhausted friendly unit home** from a battlefield. Kha'Zix, Mutating Horror gets +2 Might and 2
  XP when an enemy unit is **alone** at his battlefield — so the deck moves enemies into lonely
  spots (Void Assault moves a friendly then an enemy; Irresistible Faefolk drags an enemy to its
  battlefield). Develop first, spells second ([Jun](jun.md)).
- **Wins by:** a stream of won fights that pay XP, then conquests the walk-home keeps from being
  punished.
- **From Sivir:** *hold with two.* His +2 is only against a lone enemy unit; Star-Crossed 100%, Rampage 87%, Vex 73%, Rengar 73%. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** movement — in to win the fight, out before the retake. Won fights pay the XP that
  buys the walk home; the list's payoffs (Shadow Order Disciple, Faefolk, Traveling Merchant) are
  for moving, and Jun's test for Void Assault is "does my own unit need to move this turn?"
- **Fears:** decks that never present a lone unit (go-wide boards), and mass shrink (−Might to all
  enemies) that turns its +2 into nothing.
- **Measured vs. named:** the numbers say aggro; Jun's plan is midrange (develop, then win the
  late game). The deep dive is the deck guide (retired guide, in git history) and the
  matchup guide (retired guide, in git history); where they disagree with this page,
  they win.
- **Sources:** riftbound.gg guide (Unleashed, updated 5 Jul 2026): "midrange strategy", built on units that gain XP with Hidden, Ambush and Chaos disruption; Jun (post-ban): midrange, develop units first.

**Aggro · Gear:** Jarvan IV, Exemplar of Demacia, Ornn, Fire Below the Mountain, Lucian, Purifier.

### Jarvan IV, Exemplar of Demacia — Aggro · Gear *(Radiance)*
*Body / Order.* **Evidence:** Radiance results, 2 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Variants:** two speeds: midrange 56%, aggro 41% of lists.
- **Plan:** cheap Deploy gear at battlefields — Concert Poster (Recruit tokens), Pillaged Armory
  (buffs), Demacian Standard (+2 to an attacker) — and the legend moves a friendly unit to the
  battlefield you just deployed to. Jarvan IV, Martial Paragon gives Deploy gear Action and ramps on
  conquests there.
- **Fears:** Deploy gear dies when an opponent **holds** its battlefield (rules.md, Deploy) — the
  deck must keep the battlefields it builds on.
- **Engine:** gear — Deploy gear; the legend converts each one into a move to that battlefield.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 14 Oct 2026): no label; a "conquer driven strategy", Pillaged Armory "a core card".

### Ornn, Fire Below the Mountain — Aggro · Gear
*Calm / Mind.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** 20 gear. The legend adds Power for gear; Pit Crew readies when you play a gear; Poro
  Snax and Patched Porobot draw; Ornn, Blacksmith finds gear; Ornn, Forge God has +1 Might per
  friendly gear.
- **Against it:** gear removal is unit removal here.
- **Engine:** gear — twenty gear; the legend's Power, Pit Crew and Ornn, Forge God pay them off.
- **Call (20 Oct 2026):** aggro. The riftbound.gg guide (30 Aug 2026) says Ornn left the midrange build after Unleashed and in Vendetta plays "a super fast-paced strategy" of cheap gear. That fits an average cost of 2.0. This replaces the 20 Oct midrange call, which went by the measured label.
- **Call (28 Oct 2026):** Aggro · Gear: the 20 Oct aggro call stands (riftbound.gg, "a super fast-paced strategy"); the taxonomy first read midrange from 15 units and 13 draw, and source precedence reverted it.

### Lucian, Purifier — Aggro · Gear
*Body / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** the legend gives every Equipment Assault; Lucian, Merciless readies the first time he
  conquers; Relentless Pursuit moves and equips in one card. Low interaction (2) — it means to win
  the board, not answer yours.
- **Against it:** with so little interaction, it cannot stop a big unit it did not race.
- **Engine:** gear — Equipment is the investment; the legend turns each one into Assault.

**Aggro · Go-wide:** Rek'Sai, Void Burrower.

### Rek'Sai, Void Burrower — Aggro · Go-wide
*Fury / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** the most units on the board by turn 3 of any deck here (4.2 in the goldfish). Token
  makers (Faithful Manufactor, Noxian Emissary, Vanguard Captain), Deathknell units that leave value
  (Carrion Dredger's Bird, Honest Broker's Gold), Noxus Hopeful cheap with Legion. When you conquer,
  the legend reveals the top 2 and plays one; Rek'Sai, Breacher gives units played from anywhere but
  hand Accelerate; Undertitan gives the others +2 the turn it lands. Blood Rush and Cleave turn the
  wide board into attackers.
- **Wins by:** more battlefields contested than the opponent can defend, then Undertitan.
- **From Sivir:** *hold.* The widest board; Cull the Weak 95%, Falling Star 90%. Bring in 2 Graves; take out 2 Sabotage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** reveal — the top of the deck. Conquer, flip two, play one: the legend on conquest,
  Void Rush any time, Breacher's Accelerate so the flipped unit fights now, Undertitan's [Add] 2 as
  it is revealed. Every conquest is a gamble on the top two, which is why the deck is all cheap
  bodies (27 of 40 at 2 or less): almost anything flipped is playable. Legion (Noxus Hopeful,
  Vanguard Captain) rewards the second card each turn. The Deathknell units are insurance that
  makes losing a fight cheap, not a plan to build on — winners run none of the Deathknell payoffs
  (Karthus 0 of 61; the research queue, retired 23 Oct 2026).
- **Fears:** area effects — Bellows Breath, Imperial Decree, Thousand-Tailed Watcher — and Vex,
  Apathetic stunning each unit you play.
- **Call (20 Oct 2026):** midrange. The riftbound.gg guide (14 Sep 2026): Rek'Sai "looks like an aggressive legend, but actually plays closer to an off-tempo strategy". Fury develops the board, Order disrupts the opponent's, and both serve the legend's conquests. The same guide series uses "off-tempo" for midrange (Master Yi, Wuju Master).

**Aggro · Card flow:** Jinx, Loose Cannon.

### Jinx, Loose Cannon — Aggro · Card flow
*Chaos / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Jinx, Demolitionist discards 2, Flame Chompers plays itself when discarded, Jinx, Rebel readies when you discard; the legend draws 1 at the start of your turn when your hand is down to one card or none.
- **Engine:** discard — Flame Chompers and Jinx, Rebel pay off discarding; the legend wants an empty hand.

**Aggro · Facedown:** Teemo, Swift Scout.

### Teemo, Swift Scout — Aggro · Facedown
*Chaos / Mind.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend hides for [1] instead of [A] and returns Teemos to hand to re-hide; Teemo, Strategist pings for every Hidden card in the top 5; Guerilla Warfare rebuys Hidden cards and hides for free; Nocturne, Horrifying is played for one Power when seen on top.
- **Engine:** facedown — Hidden swarm; the legend re-hides Teemos.
- **Call (20 Oct 2026):** aggro, the same call as Evelynn: the Hidden cards are cheap threats and pings, not answers. It measures aggro over its 50 lists.

**Aggro · Extra resources:** Sivir, Battle Mistress.

### Sivir, Battle Mistress — Aggro · Extra resources
*Body / Chaos.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** Aurora in 10 of 36 lists. Jay's own deck, *Sivir Is Trying Her Best*, is a different deck: **Midrange · Extra resources** by the same measure (cost 2.8, 14 cheap, 9 draw), rebuilt away from this fast curve ([the guide](../guides/sivir-trying-her-best.md)).
- **Plan:** the legend makes Gold when you recycle a rune and readies when enemy units die; Sivir,
  Mercenary gets +2 Might and Ganking once you have spent two Power. A fast, combat-first deck.
- **Engine:** none — a fast combat curve; Gold and Ganking are not patterns the reader knows.
- **Call (28 Oct 2026):** Aggro · Extra resources for the field's lists; Gold is the payoff the engine reader cannot see.

## Tempo — cheap and reactive: stay ahead by winning exchanges

**Tempo · Movement:** Irelia, Blade Dancer, Miss Fortune, Bounty Hunter, Yasuo, Unforgiven.

### Irelia, Blade Dancer — Tempo · Movement
*Calm / Chaos.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** when you choose a friendly unit, the legend can exhaust itself and take [A] to ready
  it, and it readies itself when you conquer — so a unit attacks or moves, a spell chooses it, and
  it goes again. Stellacorn Herder (98% of lists) draws every time it moves; Irelia, Fervent grows
  whenever chosen or readied; Defiant Dance and En Garde win fights on the opponent's commit.
- **Wins by:** out-acting the opponent: more moves, more fights, more cards drawn from them.
- **From Sivir:** *press; attack with two.* The slowest S deck on board (10.9 Might by turn 4); she wins fights with Reactions; Defy 98% **and** Not So Fast 80% hit your targeted spells. Bring in 1 Graves, Siren's Song; take out 2 Sabotage, 1 Rampage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** ready → move → draw (Herder). Her idea page's Engines panel lists the Radiance
  cards that would feed it (Lulu, Whimsical is the one the experiment tries).
- **Fears:** answers that do not choose (mass effects), and stuns that stop the readied unit acting.

### Miss Fortune, Bounty Hunter — Tempo · Movement
*Body / Chaos.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** **Aurora in 67 of 101 lists: the Aurora build (Ramp · *Aurora*, Orb's "Midrange Ramp") is the majority.** This entry is the clean deck.
- **Plan:** the legend gives Ganking; Miss Fortune, Buccaneer lets units be played to **open**
  battlefields; Miss Fortune, Captain readies something the first time she moves. A movement deck
  that contests battlefields you thought were safe.
- **Engine:** movement — Ganking from the legend, and Miss Fortune, Captain readies on her first move.

### Yasuo, Unforgiven — Tempo · Movement
*Calm / Chaos.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** Calm/Chaos spells move units and protect them: Ride the Wind, Charm, Tideturner,
  Discipline and Defy in nearly every list. The legend moves a friendly unit to or from base,
  Yasuo, Windrider has Ganking and scores a point the third time he moves in a turn, and the
  movement payoffs are Stellacorn Herder, Treasure Hunter and Traveling Merchant.
- **Fears:** removal on its few units. riftbound.gg: the units "tend to be fragile, limiting our
  ability to thrive without continuously using support cards".
- **Engine:** movement (Yasuo, Windrider, Ride the Wind, Tideturner, the legend).
- **Sources:** riftbound.gg guide (updated 21 Apr 2026): Calm/Chaos "to take the tempo rapidly".
- **Call (22 Oct 2026):** tempo. This heading said Spiderling-token aggro from 12 "placed" lists of
  39 Spiderlings and a Yasuo at NovaRiftbound's Showdown 5. They were placeholders: players hiding
  their real lists before the RC (Nova said so; one was the 3rd-place Kennen). `build-decks.mjs`
  now holds such lists apart, and Yasuo has no good placings left.

**Tempo · Gear:** Ziggs, Hexplosives Expert.

### Ziggs, Hexplosives Expert — Tempo · Gear *(Radiance)*
*Chaos / Fury.* **Evidence:** Radiance results, 2 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend, Amateur Demolitionist, Satchel Charge and both Ziggs make **Bomb gear tokens
  at battlefields** (Deploy; when one dies it deals 2 to an enemy there and kills your other Bombs
  there). Hexplosive Minefield kills your own Bombs on purpose and replaces them at end of turn;
  Detonate kills any gear and draws. Ziggs, Short-Fused gives friendly gear abilities 1 bonus damage.
- **Against it:** the Bombs are gear — they die to gear removal, and to an opponent holding there.
- **From Sivir:** *be the beatdown; hold their Bomb battlefields.* Bombs are gear tokens that die when you hold there; **Detonate (92%) kills your Edge**; Shimmering Swimmer 76% (2), Falling Star 52%. Bring in 2 Unyielding Spirit, Prefect; take out 2 Edge of Night, 1 Sabotage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** tokens (Bomb gear) — made at battlefields, killed on purpose and remade.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 14 Oct 2026): "tempo deck": Bombs clear the showdown; a "hold oriented" side build.

**Tempo · Go-wide:** Azir, Emperor of the Sands, Lillia, Bashful Bloom.

### Azir, Emperor of the Sands — Tempo · Go-wide
*Calm / Order.* **Evidence:** Radiance results, 4 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** three units, sixteen gear. Cheap Equipment (Doran's Shield, Eye of the Herald, Soul
  Sword, Hand Hammer); the legend makes a 2-Might Sand Soldier after you play an Equipment, and Sand
  Soldiers have Weaponmaster. **Arise! makes a Sand Soldier for each Equipment you control and readies
  two**; Guards! is a Hidden one. Azir, Sovereign brings token units along when he attacks.
- **Wins by:** the turn Arise! turns its gear into a board.
- **Fears:** gear removal, and area damage into 2-Might soldiers.
- **From Sivir:** *press before the equipment lands.* Hidden Blade 86%, Back Off 86%; Defy 93%. Bring in 2 Offer, Prefect; take out 2 Sabotage, 1 Star-Crossed. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** tokens from gear — Equipment makes Sand Soldiers, and Arise! makes one per Equipment.
- **Call (20 Oct 2026):** tempo. The riftbound.gg guide (8 Sep 2026): Azir "focuses on controlling its opponent's development and pace", making units every turn against slow decks. This replaces the 20 Oct midrange call; the measured tempo was right.
- **Call (28 Oct 2026):** Tempo · Go-wide: the 20 Oct call stands (riftbound.gg, "controlling its opponent's development and pace"); his Radiance results run Defy, Discipline, Hidden Blade and Back Off in every list.

### Lillia, Bashful Bloom — Tempo · Go-wide
*Calm / Mind.* **Evidence:** Radiance results, 3 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
The legend makes ready 3-Might Temporary Sprites, cheaper per Temporary unit you have; Sprite Burst makes two; Smoke and Mirrors swaps a Temporary unit across battlefields; Unchecked Power deals 12 to everything at battlefields.
- **Engine:** tokens — the legend makes Sprites, cheaper for each Temporary unit you have.
- **Sources:** riftbound.gg guide (Unleashed, 12 Jul 2026): "value oriented play style": trade temporary 3-Might Sprites for real units, scaling toward the endgame while it does.

**Tempo · Spells:** Diana, Scorn of the Moon.

### Diana, Scorn of the Moon — Tempo · Spells
*Chaos / Mind.* **Evidence:** Radiance results, 5 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
The legend adds Energy only during showdowns; Diana, Lunari Predicts when a showdown starts; Diana, No Longer Human grows per spell; Moonfall pulls an enemy in and shrinks them; Hwei moves and filters.
- **Also in nearly every Radiance result** (90%+, not named above): Stupefy, Gust, Ride the Wind, Tideturner, Flash, Eclipse, Hwei, Brooding Painter.
- **Engine:** spells — showdown spells on the legend's showdown-only Energy.
- **Sources:** riftbound.gg guide (14 Sep 2026): no label; a "fast-paced legend", or "an attrition war": cheap support spells on the legend's Energy, Ravenbloom Student and Hwei.
- **Call (20 Oct 2026):** tempo. The legend's Energy exists only in showdowns, so the deck spends it mid-fight on cheap spells. The guide calls it "fast-paced", and it measures tempo.

**Tempo · Facedown:** Evelynn, Agony's Embrace.

### Evelynn, Agony's Embrace — Tempo · Facedown *(Radiance)*
*Body / Chaos.* **Evidence:** Radiance results, 6 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** almost everything is Hidden. The legend draws 1 the first time each turn you play a
  card from face down (and discards 1 if it is not your turn). Evelynn, Consuming (*in none of the 6 Radiance results*) readies and grows
  when you play a card from face down; Evelynn, In Control (*in none of the 6 Radiance results*) **scores a point when she holds with a
  facedown card of yours there**. Momentary Companion and Bedeviling Stranger are the new Hidden
  bodies.
- **Also in nearly every Radiance result** (90%+, not named above): Edge of Night, Switcheroo, Star-Crossed, Evelynn, Entrancing, Pyke, Returned, Vex, Apathetic.
- **Wins by:** hiding at every battlefield it controls and never playing into your open mana.
- **Against it:** a facedown card can only act at its own battlefield (rules.md, Hidden). Taking
  the battlefield trashes what it hid there.
- **From Sivir:** *press her hide spots.* Taking a battlefield trashes her face-down cards; Momentary Companion (73%) and other Hidden units; Star-Crossed 51%, Siren's Song 49%. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** facedown — the legend and Evelynn, Consuming pay off playing from face down, and nearly every card is Hidden.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 14 Oct 2026): no label; "pressure our opponent quickly", revealing Hidden cards on her own turn.
- **Call (19 Oct 2026):** aggro, not tempo. Its 42 Radiance-era lists measure aggro (19 Radiance cards in the 40, 31 Hidden or Reaction), and the guide's plan is to "pressure our opponent quickly" — the Hidden cards are threats here, not answers.
- **Call (28 Oct 2026):** Tempo · Facedown, replacing the 19 Oct aggro call: her 6 Radiance results average 3.2 with 8 cards at 2 or less, not an aggro curve.

**Tempo · Extra resources:** Pyke, Bloodharbor Ripper.

### Pyke, Bloodharbor Ripper — Tempo · Extra resources
*Chaos / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend returns a friendly unit to hand for Gold (re-buy play effects); Piercing Light, Bewitching Spirit's discard.
- **Engine:** none — bounce and replay for Gold.
- **Sources:** riftbound.gg guide (Unleashed, 8 Jul 2026): "a disruptive strategy" and "a value war": Chaos more than Fury; discard and bounce in slow games.
- **Call (20 Oct 2026):** control. The riftbound.gg guide (8 Jul 2026) calls it "a disruptive strategy aimed at scaling while controlling the resources available to both players", winning "through sheer value". That is control, not a race.

## Midrange — bigger bodies and value: trade into a better late board

**Midrange · Fights:** K'Sante, Pride of Nazumah, Draven, Glorious Executioner, Lee Sin, Blind Monk, Leona, Radiant Dawn, Rumble, Mechanized Menace, Sett, The Boss.

### K'Sante, Pride of Nazumah — Midrange · Fights *(Radiance)*
*Body / Calm.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend turns Shield into Assault (`Give a friendly unit "I have [Assault] equal to
  my [Shield]" this turn`), so Shield cards (Block, Mutated Mouser, Nazuman Ntofo, Ntofo Strikes)
  attack as well as defend. K'Sante, Dauntless doubles a unit's Shield when he attacks or defends.
- **Against it:** the cheapest curve in the game here (average cost 1.9). Shield is per combat;
  removal outside combat ignores it.
- **Engine:** winning fights — the legend converts Shield into Assault, so the Shield cards are fuel for attacks.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 15 Oct 2026): no label; a "showdown type of legend", good at holding, using Shield offensively. Read against the aggro label here.
- **Call (19 Oct 2026):** midrange, not aggro. Shield works on both sides of a fight, the guide reads it as a holding legend, and 16 of the 40 are Radiance cards nobody has played yet; the cheap curve (2.3 in 21 Radiance-era lists) is brews building low, not a plan to race.
- **Call (28 Oct 2026):** Midrange · Fights: the 19 Oct call stands (a holding legend), over a tempo reading of a cheap curve.

### Draven, Glorious Executioner — Midrange · Fights
*Chaos / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend draws whenever you win a combat; Draven, Showboat has your points as extra Might; Spinning Axe and Overzealous Fan (kill it on defence to send an attacker home) keep fights one-sided.
- **Engine:** winning fights — the legend draws for every combat won.
- **Call (20 Oct 2026):** midrange. The riftbound.gg guide (14 Sep 2026): Draven "stayed true to its midrange play style" in Vendetta; it lacks an early champion unit to race with.
- **Call (28 Oct 2026):** Midrange · Fights: the 20 Oct call stands (riftbound.gg, "stayed true to its midrange play style"), over an aggro reading of 25 units.

### Lee Sin, Blind Monk — Midrange · Fights
*Body / Calm.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** cheap units early, then the legend's `[1], [E]: Buff a friendly unit` every turn, so
  every unit carries a buff. Lee Sin, Centered gives other buffed units at his battlefield +2
  Might; Wizened Elder and Stand United pay off buffs again.
- **Wins by:** a battlefield of buffed units that out-Might anything sent at it.
- **Fears:** answers to the one battlefield it stacks; going wide matters less if the buffs sit on
  two units.
- **Against it:** removal before the buffs accumulate is worth more than removal after.
- **Engine:** buffs — the legend buffs a unit every turn; Lee Sin, Centered, Wizened Elder and Stand United pay the buffs off.

### Leona, Radiant Dawn — Midrange · Fights
*Calm / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend buffs when you stun; Leona, Determined stuns on attack; **Leona, Zealot gives stunned enemies at her battlefield −8 Might** and enters ready late in the game; Zenith Blade stuns and moves in.
- **Engine:** stuns into buffs — the legend buffs a unit whenever you stun, and Call to Glory (3 in the lists) spends the buffs; Leona, Zealot gives stunned enemies −8. (27 Oct 2026: written from one list; the 69 lists since play both loops.)

### Rumble, Mechanized Menace — Midrange · Fights
*Fury / Mind.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Mech synergies: Bubble Bot readies a Mech, Production Surge makes one, Forecaster gives Vision, both Rumbles boost Mechs, Breakneck Mech gives them Deflect and Ganking.
- **Engine:** none — Mech tribe, which the reader does not read.
- **Call (20 Oct 2026):** midrange, as measured. It builds a Mech board.

### Sett, The Boss — Midrange · Fights
*Body / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** two speeds: midrange 71%, aggro 28% of lists.
- **Plan:** buff everything (Pit Rookie, Cithria of Cloudfield, Kinkou Monk, Arena Bar), then cash
  buffs in: Call to Glory is free if you spend a buff; Sett, Kingpin gets +1 Might per buffed unit at
  his battlefield; Sett, Brawler spends his buff for +4. The legend saves a buffed unit from dying
  (spend the buff, recall it).
- **Fears:** removal that ignores the save (it costs a buff and the legend's exhaust, once).
- **Engine:** buffs — buff everything, then cash the buffs in.

**Midrange · Gear:** Orianna, Lady of Clockwork, Jax, Grandmaster at Arms.

### Orianna, Lady of Clockwork — Midrange · Gear *(Radiance)*
*Calm / Mind.* **Evidence:** Radiance results, 2 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** at the start of your Main Phase the legend turns a gear into a unit with Might equal to
  its cost. So expensive gear — Resplendent Rostrum (8), The Ball (5), Gravity Field (5) — become
  big units, and Command: Attack (92%) moves Deploy gear or digs for gear. Orianna, Mechanical
  Marvel discounts gear.
- **Against it:** one gear is a unit at a time; it changes only when she picks another.
- **Engine:** gear — the legend turns expensive gear into units.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 15 Oct 2026): no label; "seize the board" with Orianna, Exquisite, then "snowball".
- **Call (20 Oct 2026):** midrange. The guide's plan is "seize the board" and then "snowball". It isn't ramp: the legend turns a gear into a unit of that gear's cost but adds no Energy. The measured tempo comes from counting Hidden and Reaction cards, which also calls Bladesman tempo.

### Jax, Grandmaster at Arms — Midrange · Gear
*Body / Calm.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Plan:** Equipment-dense (Brutalizer, Guardian Angel, Doran's Blade); the legend moves
  Equipment between units, so killing the carrier does not kill the investment. Jax, Unmatched
  gives Equipment in hand Quick-Draw; Lucian, Merciless readies the first time he conquers.
- **Wins by:** re-equipping a fresh threat each turn faster than you can remove them.
- **Against it:** the gear is the real board. Answers to gear, or to the unit at the moment the
  Equipment is moving, beat answers to units.
- **Engine:** gear — Equipment is the investment; the legend moves it to a fresh carrier.

**Midrange · Go-wide:** LeBlanc, Deceiver, Mordekaiser, Iron Revenant, Garen, Might of Demacia, Zed, Master of Shadows.

### LeBlanc, Deceiver — Midrange · Go-wide
*Mind / Order.* **Evidence:** Radiance results, 8 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** thirty units, most with Deathknell (Ruined Rex deals 4, Glasc Mixologist replays a small
  unit from the trash, Black Rose Dignitary and Soaring Scout channel, LeBlanc, Fragmented draws), and
  **Karthus, Eternal makes every Deathknell trigger an additional time**. The legend copies a unit at a
  battlefield you conquer or hold (Temporary, so it dies — and triggers — again). Sacrifice and Baited
  Hook kill its own units on purpose.
- **Also in nearly every Radiance result** (90%+, not named above): Thousand-Tailed Watcher, Honest Broker, Vi, Peacekeeper, Mirror Image.
- **Wins by:** trading every unit for more than it is worth.
- **Fears:** answers that don't kill — bounce, Banish — so no Deathknell fires.
- **From Sivir:** *hold; bounce, don't kill.* It wants its units to die; Hidden Blade 84% (kill any, from face down); Cull the Weak 35% (keep a spare small body); Ruined Rex (100%, 6), Rift Herald and Watcher (7). Bring in — (Graves is too small here). ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** deaths — Deathknell units and Karthus doubling them; the legend's Temporary copy dies and triggers again.
- **Sources:** riftbound.gg guide (Unleashed, 3 Jul 2026): no single label, "value or tempo": built on Deathknell; a snowball build (Baited Hook) or a slower draw-and-answer one.

### Mordekaiser, Iron Revenant — Midrange · Go-wide *(Radiance)*
*Fury / Order.* **Evidence:** Radiance results, 5 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** the legend banishes a unit or gear from your trash for Power (units and gear only), so
  every death fuels the next play. Mordekaiser, Twice Slain (*in none of the 5 Radiance results*) (Assault 3) survives by killing another
  friendly unit; Mordekaiser, Dominating discards to kill a unit or gear on play and attack. Realm
  of Death is removal that pumps your side.
- **Also in nearly every Radiance result** (90%+, not named above): Kai'Sa, Survivor, Realm of Death, Honest Broker, Vi, Peacekeeper.
- **Against it:** the trash is its mana — what it has banished is gone for good.
- **From Sivir:** *hold; bounce his big ones.* Realm of Death 91%, Mordekaiser kills any unit (76%), Hidden Blade 61%; 8-Might Mordekaiser. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** deaths — every death puts fuel in the trash for the legend's Power.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 15 Oct 2026): no label; wins "through brute force", Baited Hook (*in none of the 5 Radiance results*) to cheat a champion out early.
- **Call (20 Oct 2026):** ramp. This corrects the 20 Oct midrange call, which wrongly said the deck has no top end: its champions cost 7 and 9, Rift Herald 8 and Ferrous Forerunner 6. The riftbound.gg guide (15 Oct 2026) wins "through brute force", with the legend paying the Power and Baited Hook cheating Twice Slain out early. The sacrifices are how it gets there. Midrange would describe the fodder, but the plan is the big units.

### Garen, Might of Demacia — Midrange · Go-wide
*Body / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend draws 2 when you conquer with four or more units at that battlefield; Recruit the Vanguard, Faithful Manufactor and Noxian Drummer make the four, Garen, Commander leads them.
- **Engine:** winning fights (wide) — the conquest with four units is the payoff; Recruits are the fuel.

### Zed, Master of Shadows — Midrange · Go-wide
*Chaos / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Shadow Clone tokens; Zed, Without a Sound swaps places with a clone; the legend empowers whenever you banish a card you own; Perfect Execution readies with Assault 3.
- **Engine:** tokens (Shadow Clones) — Zed swaps places with them.
- **Call (20 Oct 2026):** midrange, as measured. The clones are a board to swap with, not a race.

**Midrange · Card flow:** Kennen, Heart of the Tempest, Ekko, Boy Who Shattered Time.

### Kennen, Heart of the Tempest — Midrange · Card flow
*Chaos / Order.* **Evidence:** Radiance results, 26 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Variants:** in Vendetta his lists split into two decks (lib/netdeck.mjs); in Radiance, one.
- **Plan:** the legend empowers **whenever you play a card from anywhere other than your hand**, then
  disempowers to give a unit Assault 2. So the deck plays from the trash and the top of the deck:
  Lightning Rush (Flow), Fizz, Trickster (casts a spell from the trash), Tail-Cloaked Matriarch
  (replays a unit from the trash), Nocturne off the top, Kennen, Storm of Shuriken (gives a trash
  spell Flow when he conquers). Rhasa the Sunderer costs 1 less per card in the trash, which all of
  this fills.
- **Also in nearly every Radiance result** (90%+, not named above): Traveling Merchant, Nocturne, Horrifying, Seal of Discord, Trifarian Captain, Switcheroo, Star-Crossed, Gust, Ride the Wind.
- **Wins by:** a long game of free value that turns into Assault on the attack.
- **Fears:** early pressure before the trash fills; Rhasa and the Flow cards are its late game.
- **From Sivir:** *press early.* The trash engine; Rhasa (79%, 6 Might, cheap late); Star-Crossed 85%, Gust 77%; Switcheroo in most lists; their Offer and Salvage reach your Edge. Bring in 2 Offer, Prefect; take out 2 Sabotage, 1 Tornado. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** plays from elsewhere — the legend converts each one into Assault; Flow, Fizz and Matriarch feed it.
- **Sources:** riftbound.gg guide (Vendetta, 8 Aug 2026): the "Tempo-Miracle list" is the top build, with an "off-tempo approach" beside it. Post-ban (riftbound.gg, 7 Oct 2026): "combo deck": a Rhasa the Sunderer swing turn with Last Rites to bring it back, filling the trash until then.
- **Call (19 Oct 2026):** midrange, not tempo. Since the ban the deck is the post-ban guide's: fill the trash, hold the scoreboard, one Rhasa the Sunderer turn — Rhasa is in 196 of 231 lists and 66 of the 74 since 10 Oct, Last Rites in 183 and 61. It does not race (tempo) and holds only 5 interaction (control).

### Ekko, Boy Who Shattered Time — Midrange · Card flow *(Radiance)*
*Fury / Mind.* **Evidence:** Radiance results, 3 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
The legend discounts the next unit by 2 and kills it at end of turn; Ekko, Ingenious returns a friendly unit as his cost (re-use play effects); Chronobreak banishes and replays your units; Temporal Breach. A deck of play effects used twice.
- **Engine:** none — re-buying play effects, which the reader does not read.
- **Sources:** riftbound.gg guide (Radiance theorycraft, Oct 2026): "Tempo" for the main build, a "combo oriented play style" beside it, built on Chronobreak.

**Midrange · Spells:** Mel, Soul's Reflection.

### Mel, Soul's Reflection — Midrange · Spells
*Chaos / Mind.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
Applied Researchers (spells cost less while Empowered), Shock Blast (cheaper with anything Empowered), Rebuttal steals a spell; Mel, Defiant Soul banishes a small enemy when empowered.
- **Engine:** Empower and spells — Applied Researchers and Shock Blast are cheaper while something is Empowered.
- **Sources:** riftbound.gg guide (Vendetta, 8 Aug 2026): "midrange, value oriented play style": removal and early units, then Rebuttal to lock a battlefield.

**Midrange · Holds:** Riven, The Exile, Ivern, Green Father, Poppy, Keeper of the Hammer.

### Riven, The Exile — Midrange · Holds *(Radiance)*
*Calm / Chaos.* **Evidence:** Radiance results, 46 good finishes from 2 events (LDXP
Sacramento 25k; Club9 Clash #3), as of 28 Oct 2026 — the most of any legend.
- **Plan:** **units you play to battlefields you control enter ready**, so a battlefield she
  holds is a launchpad: play there, act at once. Riven, Broken Blade (100% of results) and
  Reckless Innovator (98%) pay off becoming exhausted; Blade of the Exile (100%, ×3) equips by
  exhausting a unit. Cheap bodies to take battlefields: Bedeviling Stranger and Tideturner
  (96%), Stellacorn Herder (89%) drawing as they move. The top end is **Astral Heron (91%, ×3)
  into Baron Nashor (80%)**: Heron discounts the next card by 2 Energy and 2 Power.
- **Interaction behind it:** Defy and Discipline in every list; Star-Crossed 89%, Rebuke 87%,
  Switcheroo 83%, Zhonya's Hourglass 93%, Blitzcrank, Impassive 83% (pulls a unit to her
  battlefield). Ki Burst is in only 33% of results, Riven, Deserter 9%.
- **Wins by:** holding the battlefields it develops onto, then Heron and Baron outsizing the
  board late. Baron can't be chosen, and his Baron Pit is a third battlefield.
- **Fears:** Vex, Apathetic (stuns what she plays and stops it moving, cancelling "enter
  ready"); being kept off battlefields she controls, which is where the engine works.
- **From Sivir:** press, and deny her battlefields. Rebuke the first Heron the turn after it
  lands, before it pays for Baron. Once the Baron Pit exists, the final point by conquer needs
  all three battlefields (§473.1.b.1): win by holding at 7. (Guide §10; the Riven plan update
  is pending.)
- **Engine:** exhaust — Riven, Broken Blade and Reckless Innovator pay off becoming exhausted;
  attacking, moving and Blade of the Exile's equip feed them.
- **Sources:** riftbound.gg (Radiance theorycraft, 12 Oct 2026): "hold oriented legend".
- **Call (28 Oct 2026):** Midrange · Holds. The shape is midrange (Heron and Baron, 11 draw);
  the legend pays off battlefields she controls (Holds). The measured tempo is
  the Hidden-and-Reaction count (How to read this page). Replaces the 19 Oct call's heading ("exhaust midrange"),
  which agreed on midrange.

### Ivern, Green Father — Midrange · Holds
*Calm / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Bird, Cat, Dog, Poro tags; Ivern, Friend to All scores a point on conquer or hold if your units have all four; the legend turns battlefields into Brush tokens.
- **Engine:** none — tribe tags, which the reader does not read.
- **Call (20 Oct 2026):** midrange, as measured over its 8 placed lists. It builds the four-tribe board for Ivern, Friend to All.

### Poppy, Keeper of the Hammer — Midrange · Holds
*Body / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
XP from holds and Demacian Diplomat, spent to draw (the legend), buff (Enthralling Protector) or discount Poppy, Defender of the Meek; Keeper's Verdict tucks an enemy unit.
- **Variants:** two speeds: midrange 62%, aggro 32% of lists. Aurora in 6 of 44 lists: a variant, not the deck.
- **Engine:** XP — from holds and Demacian Diplomat, spent to draw, buff and discount Poppy.

**Midrange · Ramp:** Renekton, Butcher of the Sands, Fiora, Grand Duelist, Volibear, Relentless Storm.

### Renekton, Butcher of the Sands — Midrange · Ramp
*Body / Fury.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend turns two Power into two Energy for units; Renekton, Rage Fueled deals 2 to
  all enemy units at his battlefield when he attacks, if you control 4 or fewer runes.
- **Engine:** none — a unit-ramp curve: the legend's Energy is for units, and nothing loops.

### Fiora, Grand Duelist — Midrange · Ramp
*Body / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** Aurora in 27 of 156 lists (Ramp · *Aurora*); in Vendetta her lists split into two decks (lib/netdeck.mjs).
- **Plan:** the legend channels a rune when a unit becomes Mighty; Fiora, Victorious gains Deflect,
  Ganking and Shield while Mighty; Riposte counters a spell and pumps; Harnessed Dragon kills an
  enemy unit when played.
- **Against it:** keeping its units below Mighty denies the ramp and the keywords together.
- **Engine:** Mighty — the legend ramps whenever a unit becomes Mighty; Fiora, Victorious gains her keywords while Mighty.
- **Sources:** riftbound.gg tier list (3 Oct 2026): Tier 3, "ramp play style" for her best list — extra runes early to reach 8-cost units.
- **Call (19 Oct 2026):** ramp, confirmed: its 36 Radiance-era lists measure ramp too (average cost 4.1), matching the tier list.

### Volibear, Relentless Storm — Midrange · Ramp
*Body / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** Aurora in 25 of 64 lists (Ramp · *Aurora*).
- **Plan:** Mobilize and Mighty units feed the legend's rune channelling into Volibear, Furious (5
  damage split on attack), Kadregrin (draw per Mighty unit) and Sky Splitter. The slowest deck on
  this page by a distance.
- **Engine:** Mighty — the legend ramps on every Mighty unit, Kadregrin draws per Mighty unit.

**Midrange · Extra resources:** Master Yi, Wuju Master.

### Master Yi, Wuju Master — Midrange · Extra resources
*Body / Calm.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** gain XP (Hunt cards: Gemhand Hunter, Wuju Apprentice, Herald of Spring), reach Level 6
  for +1 Might on all units and Level 11 for units entering ready; Master Yi, Unstoppable costs
  less at every level.
- **Against it:** XP comes from Hunt triggers and conquests; slowing its early fights slows the
  whole curve.
- **Engine:** XP — Hunt cards and conquests feed it; the legend's Level 6 and Level 11 are what it buys.
- **Sources:** riftbound.gg guide (Unleashed, 17 Jul 2026): "midrange, off-tempo play style": Hunt to Level 6, then 11, then overwhelm.

## Control — answers first, win late; in Riftbound, usually by holding

**Control · Movement:** Akali, Rogue Assassin.

### Akali, Rogue Assassin — Control · Movement
*Calm / Fury.* **Evidence:** Radiance results, 10 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** the legend pulls a unit out of a showdown to base (and readies it if Empowered) —
  escapes, and re-uses of play effects. Akali, Deadly Weapon pings whenever she moves; Akali,
  Silent can't be chosen outside combat and grows on moving; Stellacorn Herder and Shuriken Flip.
  Falling Star, Astral Heron and Back Off behind. Radiance adds Akali, Brash (*in none of the 10 Radiance results*) (Energy on first move,
  plays the top card on the second).
- **Also in nearly every Radiance result** (90%+, not named above): Defy, Discipline, Blitzcrank, Impassive, Zhonya's Hourglass, Long Sword.
- **Wins by:** grinding: card advantage from moves, removal, untouchable threats.
- **From Sivir:** *press.* Shuriken Flip 96% (2), Akali's 1, Falling Star 78%; Defy 89%. Bring in 2 Unyielding Spirit; take out 2 Sabotage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** movement — Akali, Deadly Weapon and Akali, Silent (*in none of the 10 Radiance results*) pay off moving; the legend pulls units home to move again.
- **Sources:** riftbound.gg guide (Vendetta, 14 Sep 2026): no label; "plays more aggressively than the Blade Dancer"; Astral Heron as the late-game anchor, Stellacorn Herder and Kai'Sa, Survivor for cards.
- **Call (20 Oct 2026):** tempo. The riftbound.gg guide (14 Sep 2026), after Vendetta's big events, says Akali "plays more aggressively than the Blade Dancer", and Irelia is tempo here. The 12 interaction that measures control is the Fury removal she uses to fight for the board.
- **Call (28 Oct 2026):** Control · Movement, replacing the 20 Oct tempo call (a Vendetta guide): her 10 Radiance results run Falling Star, Shuriken Flip, Defy and Back Off in every list, with Zhonya's and Astral Heron, and 7 of 10 measure control.

**Control · Go-wide:** Viktor, Herald of the Arcane.

### Viktor, Herald of the Arcane — Control · Go-wide
*Mind / Order.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend makes a Recruit for [1]; Viktor, Leader makes one whenever another non-Recruit
  unit of yours dies; **Imperial Decree: when any unit takes damage this turn, kill it**; Cull the
  Weak, Hidden Blade, Wages of Pain. It answers early and wins with tokens.
- **From Sivir:** *hold.* Hidden Blade 92%, Cull the Weak 87%; Recruit tokens go wide. Bring in 2 Graves; take out 2 Sabotage. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** tokens — Recruits from the legend and Viktor, Leader.

**Control · Spells:** Kai'Sa, Daughter of the Void, Seraphine, Starry-Eyed Songstress, Jhin, Virtuoso, Lux, Lady of Luminosity.

### Kai'Sa, Daughter of the Void — Control · Spells
*Fury / Mind.* **Evidence:** Radiance results, 15 good finishes from 2 events (LDXP Sacramento - Radiance-Win-A-Case; LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** the legend adds Power for spells; Falling Star, Hextech Ray, Stupefy, Bellows Breath
  answer early; Watchful Sentry and Lecturing Yordle draw; then the top end — Thousand-Tailed
  Watcher (−3 Might to every enemy unit that turn), Brynhir Thundersong (opponents can't play cards
  that turn), **Time Warp (take an extra turn)**. Kai'Sa, Evolutionary (*in none of the 15 Radiance results*) replays a spell from the trash.
- **Also in nearly every Radiance result** (90%+, not named above): Kai'Sa, Survivor, Thousand-Tailed Watcher, Bilgewater Tracker, Plundering Poro, Temporal Breach, Noxus Hopeful, Smoke Screen.
- **Wins by:** removing the early board, then turns the opponent cannot answer.
- **Fears:** being raced before the 7-drops (3.4 average cost).
- **From Sivir:** *press; spread out.* Hextech Ray 98% (3), Falling Star 97% (6), Bellows Breath 88% (1); Thousand-Tailed Watcher (95%) shrinks your board; Void Gate adds 1; **at Rockfall Path hide a spell, not a unit**; Lost to the Sands (36%) reaches Edge. Bring in 2 Unyielding Spirit; take out 2 Tornado. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** spells — the legend's Power is for spells; the list is removal into a spell top end.
- **Call (20 Oct 2026):** midrange. The riftbound.gg guide (13 Jul 2026): "a midrange proactive play style, supported by spells for a third consecutive set", meaning strong units it tries to stick. The 13 interaction that measures control is those support spells.
- **Call (28 Oct 2026):** Control · Spells, replacing the 20 Oct midrange call: her 15 Radiance results (2 events) carry 14 interaction and read control or ramp, never midrange. Orb: "Spell-Based Control".

### Seraphine, Starry-Eyed Songstress — Control · Spells *(Radiance)*
*Mind / Order.* **Evidence:** Radiance results, 2 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend exhausts itself and three friendly units to cut a spell's cost by 2;
  Seraphine, Inspiring draws when you exhaust three units at once; Seraphine, Not Alone makes a
  Recruit when played or exhausted and has +1 Might per other exhausted unit. Concert Poster and
  Encore make the bodies; Fanfare draws per unit played.
- **Against it:** it taps its own board to cast — punish the turn it does.
- **Engine:** exhaust — the legend exhausts three units to cut a spell's cost; Seraphine, Inspiring draws for it.
- **Sources:** riftbound.gg guide (Radiance theorycraft, 14 Oct 2026): "token synergy" for the exhaust-three cost, and "control oriented lists" as the only competitive option.

### Jhin, Virtuoso — Control · Spells
*Fury / Mind.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
Banish four 4+ spells with the legend to channel 4 runes and draw; Jhin, Meticulous Killer is played for one Power after a 4+ spell; Curtain Call, Rocket Barrage.
- **Engine:** spells — four 4+ spells banished to the legend.
- **Sources:** riftbound.gg guide (Unleashed, 17 Jul 2026, before Vendetta): "combo oriented legend": wins with Gutter Palace, not points — four units and four cards in hand.
- **Call (19 Oct 2026):** still ramp. The guide's Gutter Palace combo predates Vendetta: Gutter Palace is in 3 of 37 Jhin lists now, and Time Warp in 20.

### Lux, Lady of Luminosity — Control · Spells
*Mind / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend draws when you play a spell costing 5 or more, so the deck is 25 spells averaging 4.4: Blast of Power and Falling Comet, Lux, Crownguard on top.
- **Engine:** spells — the legend pays off every big spell.

---

**Control · Holds:** Master Yi, Wuju Bladesman, Vex, Gloomist, Ahri, Nine-Tailed Fox, Renata Glasc, Chem-Baroness, Shen, Eye of Twilight.

### Master Yi, Wuju Bladesman — Control · Holds
*Body / Calm.* **Evidence:** Radiance results, 5 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** the legend gives a friendly unit **+2 Might while it defends alone**, so the deck holds
  battlefields with one unit and wins the combat math around it with 1-Energy tricks: Discipline,
  En Garde (+1 more if it is the only unit), Punch First. Defy protects the trick that matters,
  Charm moves an attacker away, Zhonya's Hourglass saves the defender. Master Yi, Tempered banks XP
  toward Level 6 (Deflect and Ganking); Rengar, Trophy Hunter Ambushes in; Lonely Poro draws if it
  dies alone.
- **Also in nearly every Radiance result** (90%+, not named above): First Mate, Pit Rookie, Ruin Runner, Onslaught, Rampage.
- **Wins by:** holds the opponent cannot break profitably, one trick ahead in every combat step.
- **Against it:** attack with two — the +2 is only for a lone defender. A stunned unit deals no
  combat damage, however big. Its tricks are cheap non-unit cards, which Sabotage strips.
- **Sources disagree on its pace:** the
  Sivir guide (retired guide, in git history) calls it "trick-dense combat-math midrange",
  the Rek'Sai guide (retired guide, in git history) "cheap wide aggro-tempo", Jun "develop
  hard, then hold"; the numbers say tempo (11 Reactions, cost 2.4), the card text midrange.
- **From Sivir:** *attack with two.* His +2 is for a lone defender; cheap tricks protect it; Charm 64%, Defy 75%. Bring in — (Sabotage stays: it strips his tricks). ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** none — tricks around one lone defender; the legend's +2 is a combat bonus, not a loop.
- **Sources:** Jun (his Master Yi notes, [Jun's Notes](jun.md) §8);
  the Riven gauntlet (retired guide, in git history); riftbound.gg tier list (3 Oct 2026): Tier 1. The
  only legend here printed solely in a starter deck — the builders skipped it until 19 Oct 2026.
- **Call (19 Oct 2026):** midrange. Jun, who plays against it, and the Sivir guide both describe develop-then-hold; the tempo reading is the measured label's 10-Reaction threshold, which also calls Vex and Leona tempo. Radiance adds nothing that changes the plan, and its first Radiance-era results are weak (#26 and #46 of 50).
- **Call (28 Oct 2026):** Control · Holds, replacing the 19 Oct midrange call. Jun's "develop hard, then hold" is control as this page defines it: winning by holding (riftbound.gg: control "grinds out points by holding Battlefields over time"; Orb: "Defensive Control").

### Vex, Gloomist — Control · Holds
*Calm / Chaos.* **Evidence:** Radiance results, 5 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026.
- **Plan:** **Vex, Apathetic stuns every unit an opponent plays while she is at a battlefield, and
  they cannot move it that turn.** The rest buys time around that (Back Off, Switcheroo, Tornado
  Warrior, Astral Heron) and the legend draws when you hold.
- **Also in nearly every Radiance result** (90%+, not named above): Defy, Discipline, Bedeviling Stranger, Star-Crossed.
- **Wins by:** making your development turn useless while it holds.
- **From Sivir:** *remove their Vex first.* Their Vex (95%) and Back Off (94%) stun your units, hidden ones too; your hidden *spells and gear* still work; Deflect makes Rebuke on Vex cost 1 more Power; Defy 87%. Bring in Siren's Song; take out 1 Tornado. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** none — Vex, Apathetic's stun lock and removal buy time; Steel Paws empowering itself is not a loop.
- **Sources:** riftbound.gg guide (14 Sep 2026): "control play style", "hold oriented": take a battlefield early with Vex, Apathetic, deny the comeback with stuns and counters, Astral Heron late. Tier list (3 Oct): Tier 3, "hold oriented".
- **Call (28 Oct 2026):** Control · Holds: her legend draws on holds, and her Radiance results cross the control line (interaction 12).

### Ahri, Nine-Tailed Fox — Control · Holds
*Calm / Mind.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
The legend gives enemy attackers −1 Might; Ahri, Inquisitive −2 when she fights; Ahri, Alluring scores a point when she holds; Radiance's Ahri, Confident grows whenever you shrink an enemy at her battlefield.
- **Engine:** none — shrink and removal; nothing loops.

### Renata Glasc, Chem-Baroness — Control · Holds
*Mind / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Gold everywhere; Hostile Takeover steals an enemy unit for a turn; Renata Glasc, Mastermind scores a point for a large activation while at a battlefield.
- **Engine:** none — Gold, which is mana, not an engine.
- **Call (20 Oct 2026):** midrange. The Gold pays for Renata Glasc, Mastermind's big activation, but only 2 cards cost 7 or more, so it isn't ramp in this page's sense. Its 11 interaction includes Hostile Takeover.

### Shen, Eye of Twilight — Control · Holds
*Calm / Order.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
Shen, Kinkou is a Reaction Tank; Shen, Leader **scores a point when he holds with exactly one other unit**; Disciple of Shen gets Shield 3 in the same spot; Ki Barrier prevents 7. A deck that wins by holding small, very hard battlefields.
- **Engine:** none — pair defence; it wins by holding, not by a loop.
- **Call (20 Oct 2026):** midrange, the same call as Bladesman's lone defender. It wins by holding small, very hard battlefields, and its Reactions protect a hold rather than trade tempo.

**Control · Ramp:** Nasus, Curator of the Sands, Jayce, Defender of Tomorrow.

### Nasus, Curator of the Sands — Control · Ramp
*Calm / Mind.* **Evidence:** Radiance results, 4 good finishes from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** 7+ cost cards ready two runes via the legend; Find Your Center and Tasty Faefolk ramp;
  Nasus, Ascended scores a point when he conquers while Empowered (Empower 8); Steel Paws becomes
  7 Might when Empowered. Thousand-Tailed Watcher and Bellows Breath hold the early board.
- **Against it:** slow by design (1.9 units by turn 3). Points before its 8-drops arrive.
- **Engine:** none — big-spell ramp: the legend readies runes for 7+ costs, and nothing loops.
- **Sources:** riftbound.gg guide (Vendetta, 20 Aug 2026): no label; reach seven runes, then pair a big unit with a cheap spell. Tier list (3 Oct): "depends heavily on" Find Your Center.

### Jayce, Defender of Tomorrow — Control · Ramp *combo*
*Body / Mind.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
- **Variants:** **Aurora in 104 of 159 lists: the Aurora build (Ramp · *Aurora*) is the majority Jayce.**
- **Plan:** almost no units. Ramp gear (Platewyrm Egg adds Energy; the legend readies gear),
  card flow (Garbage Grabber, Clairvoyance, Dredge Up), then the top end: Dazzling Aurora plays a
  free unit from the top every end of turn, Elder Dragon, Catalyst of Aeons. And **Gutter Palace:
  at the start of your Beginning Phase, with exactly 4 cards in hand and exactly 4 units at
  battlefields, you win the game** (61% of lists).
- **Wins by:** surviving to the turn its gear takes over, or by Gutter Palace.
- **Fears:** early pressure — it has nothing on the board for three turns (0.3 units by turn 3 in
  the goldfish).
- **From Sivir:** *press.* Almost nothing on board for three turns; Elder Dragon (50%, 10 Might) late; pings 1 at a time. Bring in 2 Offer, Prefect; take out 2 Tornado, 1 Star-Crossed. ([Sivir guide](../guides/sivir-trying-her-best.md) §10; from the cards and online lists, not tested.)
- **Engine:** gear — ramp gear the legend readies, into the top end and Gutter Palace.
- **Sources:** riftbound.gg guide (Vendetta, 14 Sep 2026): no label; "a ton of draw and ramp" and "a bit of early control": Elder Dragon early via Dazzling Aurora and Promising Future; Gutter Palace if it goes long.

**Control · No engine:** Ezreal, Prodigal Explorer, Annie, Dark Child.

### Ezreal, Prodigal Explorer — Control · No engine
*Chaos / Mind.* **Evidence:** Radiance results, 1 good finish from 1 event (LDXP Sacramento - Riftbound Showdown 25k), as of 28 Oct 2026. **Thin**: card shares below are indicative.
- **Plan:** the legend draws when you've chosen enemy units/gear twice in a turn. The List (−2 to a
  named tag), Pack of Wonders (bounce your own gear, unit or Hidden card), Treasure Trove, Deadly
  Flourish and Bellows Breath; Turn to Dust makes gear Temporary.
- **Wins by:** answering everything twice and drawing for it.
- **Engine:** none — answers that choose twice draw a card; removal, not a loop.
- **Call (20 Oct 2026):** control, as before. The sub-archetype is removal, not gear. The riftbound.gg guide (14 Sep 2026): Ezreal stalls to an impasse with "a large kit of removal cards", sure the legend's draw outlasts the opponent. The gear supports that plan.

### Annie, Dark Child — Control · No engine
*Chaos / Fury.* **Evidence:** **No one-on-one Radiance results yet** (28 Oct 2026): the plan below is Vendetta evidence and the cards' text.
cards) · thin* — the legend readies two runes at the end of your turn, so the Energy is up on
theirs; Firestorm, Incinerate and Disintegrate spend it as burn, with Annie, Stubborn and Tibbers
behind.
- **Engine:** none — burn removal on the legend's end-of-turn runes; nothing loops.
- **Call (20 Oct 2026):** aggro. The riftbound.gg guide (3 Jul 2026) calls it "among the more aggressive legends": it gets ahead on the scoreboard, with the legend's two end-of-turn runes kept for reacting. The burn is reach, not control. The 15 interaction in its 27 posted lists (none placed) is what measures control.

## Colour pairs

What the colours bring, whatever the legend. Each pair's legends are placed above.

## Body / Calm — protected threats

Calm brings the reactive shell almost every Calm deck shares (Defy, Discipline, Scuttle Crab,
Zhonya's Hourglass); Body brings raw Might (Punch First, Rampage). Together: build one threat
worth protecting, protect it, and win the fights it is in. Lee Sin, Jax, Master Yi and K'Sante
each pick a different thing to grow — buffs, Equipment, levels, Shield.

Legends: Lee Sin, Blind Monk (Midrange · Fights); Jax, Grandmaster at Arms (Midrange · Gear); Master Yi, Wuju Master (Midrange · Extra resources); Master Yi, Wuju Bladesman (Control · Holds); K'Sante, Pride of Nazumah (Midrange · Fights).

## Body / Chaos — isolate and punish

Chaos moves things — your units and theirs — and hides cards facedown; Body adds the Might to
win the fight once it is set up (Punch First, Rampage, Star-Crossed, Fizz, Switcheroo are in nearly
every list). The pair's whole idea is **choosing the fight**: drag an enemy unit where you want it,
alone if possible, and win there.

Legends: Kha'Zix, Voidreaver (Aggro · Movement); Evelynn, Agony's Embrace (Tempo · Facedown); Sivir, Battle Mistress (Aggro · Extra resources); Miss Fortune, Bounty Hunter (Tempo · Movement).

## Body / Fury — the curve

The aggressive pair: Pit Rookie, First Mate, Kinkou Initiate, Noxus Hopeful, Ferrous Forerunner,
Inferna and Kai'Sa, Survivor turn up across all four legends, with Punch First and Sabotage. Lots
of units, played every turn, each a little bigger than it should be.

Legends: Rengar, Pridestalker (Aggro · Fights); Lucian, Purifier (Aggro · Gear); Renekton, Butcher of the Sands (Midrange · Ramp); Volibear, Relentless Storm (Midrange · Ramp).

## Body / Mind — Jayce alone



Legends: Jayce, Defender of Tomorrow (Control · Ramp).

## Body / Order — buffs and Mighty

Order brings buffs, Hidden Blade and Challenge; Body the Might. Sett, Fiora, Ambessa, Poppy and
Jarvan IV each turn "make units bigger" into a different engine — buffs, Mighty, Empower, XP,
Deploy gear.

Legends: Sett, The Boss (Midrange · Fights); Fiora, Grand Duelist (Midrange · Ramp); Ambessa, Matriarch of War (Aggro · Fights); Poppy, Keeper of the Hammer (Midrange · Holds); Jarvan IV, Exemplar of Demacia (Aggro · Gear); Garen, Might of Demacia (Midrange · Go-wide).

## Calm / Chaos — tempo

The densest reactive pair: Defy, Discipline, Tideturner, Scuttle Crab, Boots of Swiftness,
Star-Crossed, Zhonya's Hourglass, Ride the Wind and Vex, Apathetic run across all four legends, and
Stellacorn Herder across three. **Move, ready, react**: units that act more than once a turn, cheap
Reactions to win fights after the opponent commits, and bounce.

Legends: Irelia, Blade Dancer (Tempo · Movement); Vex, Gloomist (Control · Holds); Yasuo, Unforgiven (Tempo · Movement); Riven, The Exile (Midrange · Holds).

## Calm / Fury — Akali alone



Legends: Akali, Rogue Assassin (Control · Movement).

## Calm / Mind — value engines

Defy, Charm, Scuttle Crab, Discipline, Thousand-Tailed Watcher, Stupefy and Ravenbloom Student
across five legends: the most card-flow-heavy pair, each legend building a different engine on top.

Legends: Ornn, Fire Below the Mountain (Aggro · Gear); Nasus, Curator of the Sands (Control · Ramp); Lillia, Bashful Bloom (Tempo · Go-wide); Ahri, Nine-Tailed Fox (Control · Holds); Orianna, Lady of Clockwork (Midrange · Gear).

## Calm / Order — tokens and stuns

Discipline, Defy, Hidden Blade, Back Off, B.F. Sword, Deathgrip and Vi, Peacekeeper across four
legends — the pair with the most hard answers and the most protected bodies.

Legends: Azir, Emperor of the Sands (Tempo · Go-wide); Shen, Eye of Twilight (Control · Holds); Leona, Radiant Dawn (Midrange · Fights); Ivern, Green Father (Midrange · Holds).

## Chaos / Fury — aggression from odd angles

Tideturner, Switcheroo, Noxus Hopeful, Kai'Sa, Survivor, Cleave, Falling Star and Gust across five
legends: tempo bodies and burn. Each legend has a payoff for something unusual — winning combats,
discarding, bombs, banishing.

Legends: Draven, Glorious Executioner (Midrange · Fights); Pyke, Bloodharbor Ripper (Tempo · Extra resources); Ziggs, Hexplosives Expert (Tempo · Gear); Zed, Master of Shadows (Midrange · Go-wide); Jinx, Loose Cannon (Aggro · Card flow); Annie, Dark Child (Control · No engine).

## Chaos / Mind — answers and spells

Star-Crossed, Stupefy, Gust, Fizz, Vex, Apathetic, Sprite Fountain, Thousand-Tailed Watcher and
Singularity across four legends: the interaction-heaviest pair.

Legends: Ezreal, Prodigal Explorer (Control · No engine); Diana, Scorn of the Moon (Tempo · Spells); Mel, Soul's Reflection (Midrange · Spells); Teemo, Swift Scout (Aggro · Facedown).

## Chaos / Order — Kennen alone



Legends: Kennen, Heart of the Tempest (Midrange · Card flow).

## Fury / Mind — spells and big turns

Thousand-Tailed Watcher, Stupefy, Falling Star, Time Warp, Kai'Sa, Survivor, Noxus Hopeful and
Bellows Breath across four legends.

Legends: Kai'Sa, Daughter of the Void (Control · Spells); Rumble, Mechanized Menace (Midrange · Fights); Jhin, Virtuoso (Control · Spells); Ekko, Boy Who Shattered Time (Midrange · Card flow).

## Fury / Order — go wide

Noxus Hopeful, Falling Star, Carrion Dredger, Faithful Manufactor, Cleave, Honest Broker, Cull the
Weak and Inferna across four legends: tokens, Deathknell value, and Assault.

Legends: Rek'Sai, Void Burrower (Aggro · Go-wide); Darius, Hand of Noxus (Aggro · Fights); Vi, Piltover Enforcer (Aggro · Movement); Mordekaiser, Iron Revenant (Midrange · Go-wide).

## Mind / Order — Deathknell and answers

Hidden Blade, Thousand-Tailed Watcher, Vi, Peacekeeper, Honest Broker, Soaring Scout, Sacrifice
and Glasc Mixologist across four legends.

Legends: LeBlanc, Deceiver (Midrange · Go-wide); Viktor, Herald of the Arcane (Control · Go-wide); Renata Glasc, Chem-Baroness (Control · Holds); Seraphine, Starry-Eyed Songstress (Control · Spells); Lux, Lady of Luminosity (Control · Spells).

## What would change this page

- **Sanctioned Radiance results** (from 2026-10-23): rewrite the Radiance entries and re-check every
  "measured" line against the new snapshot.
- **Your logged games**: each "From Kha'Zix / Riven / Rek'Sai" line becomes a real matchup note once
  the journal has games against that legend.
- **A Radiance FAQ**: may change how Deploy, Show Off or Disarm play, and with them Jarvan IV, Ziggs,
  Orianna and Kai'Sa, Rebel.
