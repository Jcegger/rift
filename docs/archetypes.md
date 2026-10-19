---
title: Archetypes — What Each Legend Is Trying to Do
subtitle: Riftbound, the 15 colour pairs and their legends — game plans, engines, what each fears, and how your decks meet them
author: rift toolchain
date: 2026-10-19
---

The layer above the cards. [rules.md](rules.md) says what the rules are, [strategy.md](strategy.md)
says how to choose a line, and the deck guides in `guides/` go deep on one deck. This page says
**what every legend's deck is for**: how it wins, the engine it runs on, the cards that make it
itself, what beats it, and what each matchup turns on from your decks' side — Kha'Zix
(Voidreaver), Riven (The Exile) and Rek'Sai (Void Burrower).

**How it was made, and how far to trust it.** Every entry is written from three things: the
legend's and its key cards' printed text (`data/cards.json`, errata applied), the measured
profile of its placed lists (`data/archetypes.json`: the list those lists add up to, its curve,
interaction count and goldfish speed), and the cards it plays far more often than its colours
do (`data/synergy.json`). The **archetype named in each heading is a judgement** made from those;
the **measured style** beside it is the numbers' own fixed-threshold reading, and where the two
differ the difference is usually the interesting part. Game plans are readings of the cards,
not tested lines. Matchup notes say what a matchup **turns on**, never who is favoured — there
is no matchup record behind them yet, and the [match journal](match-journal.md) is where one gets
made.

**The data is mostly Vendetta.** The snapshot spans 60 days, so most placed lists predate
Radiance (legal 2026-10-23); its share is given per legend, and the nine Radiance legends are
read from brews and online previews. Expect the Radiance entries to move most.

**Reading the numbers.** *u/s/g* is units / spells / gear in the representative 40; *cost* the
average Energy; *int* the interaction it holds (removal, counters, bounce, stuns); *E4* the
Energy a goldfish spends over turns 1–4 on the play, a speed proxy. The roles — who is happier if
nothing happens — are [strategy.md §2](strategy.md#2-every-deck-is-solving-a-different-problem).

---

## Body / Calm — protected threats

Calm brings the reactive shell almost every Calm deck shares (Defy, Discipline, Scuttle Crab,
Zhonya's Hourglass); Body brings raw Might (Punch First, Rampage). Together: build one threat
worth protecting, protect it, and win the fights it is in. Lee Sin, Jax, Master Yi and K'Sante
each pick a different thing to grow — buffs, Equipment, levels, Shield.

### Lee Sin, Blind Monk — buff midrange
*measured midrange · 5 placed · u18 s15 g7 · cost 2.2 · int 9*
- **Plan:** cheap units early, then the legend's `[1], [E]: Buff a friendly unit` every turn, so
  every unit carries a buff. Lee Sin, Centered gives other buffed units at his battlefield +2
  Might; Wizened Elder and Stand United pay off buffs again.
- **Wins by:** a battlefield of buffed units that out-Might anything sent at it.
- **Fears:** answers to the one battlefield it stacks; going wide matters less if the buffs sit on
  two units.
- **Against it:** removal before the buffs accumulate is worth more than removal after.

### Jax, Grandmaster at Arms — equipment midrange
*measured midrange · 6 placed · u16 s15 g9 · cost 2.5 · int 7*
- **Plan:** Equipment-dense (Brutalizer, Guardian Angel, Doran's Blade); the legend moves
  Equipment between units, so killing the carrier does not kill the investment. Jax, Unmatched
  gives Equipment in hand Quick-Draw; Lucian, Merciless readies the first time he conquers.
- **Wins by:** re-equipping a fresh threat each turn faster than you can remove them.
- **Against it:** the gear is the real board. Answers to gear, or to the unit at the moment the
  Equipment is moving, beat answers to units.

### Master Yi, Wuju Master — levelling ramp
*measured tempo · 3 placed · u19 s18 g3 · cost 3.1 · int 7 · thin*
- **Plan:** gain XP (Hunt cards: Gemhand Hunter, Wuju Apprentice, Herald of Spring), reach Level 6
  for +1 Might on all units and Level 11 for units entering ready; Master Yi, Unstoppable costs
  less at every level.
- **Against it:** XP comes from Hunt triggers and conquests; slowing its early fights slows the
  whole curve.

### K'Sante, Pride of Nazumah — Shield aggro *(Radiance)*
*measured tempo · 1 placed / 35 lists · u17 s19 g4 · cost 1.9 · thin, brews*
- **Plan:** the legend turns Shield into Assault (`Give a friendly unit "I have [Assault] equal to
  my [Shield]" this turn`), so Shield cards (Block, Mutated Mouser, Nazuman Ntofo, Ntofo Strikes)
  attack as well as defend. K'Sante, Dauntless doubles a unit's Shield when he attacks or defends.
- **Against it:** the cheapest curve in the game here (average cost 1.9). Shield is per combat;
  removal outside combat ignores it.

## Body / Chaos — isolate and punish

Chaos moves things — your units and theirs — and hides cards facedown; Body adds the Might to
win the fight once it is set up (Punch First, Rampage, Star-Crossed, Fizz, Switcheroo are in nearly
every list). The pair's whole idea is **choosing the fight**: drag an enemy unit where you want it,
alone if possible, and win there.

### Kha'Zix, Voidreaver — isolation midrange · *your deck*
*measured aggro · 12 placed · u22 s18 g0 · cost 2.6 · int 7 · E4 17.0*
- **Plan:** the legend gains XP when you win a combat and spends it to buff a unit or **walk an
  exhausted friendly unit home** from a battlefield. Kha'Zix, Mutating Horror gets +2 Might and 2
  XP when an enemy unit is **alone** at his battlefield — so the deck moves enemies into lonely
  spots (Void Assault moves a friendly then an enemy; Irresistible Faefolk drags an enemy to its
  battlefield). Develop first, spells second ([Jun](../guides/khazix-voidreaver-jun.md)).
- **Wins by:** a stream of won fights that pay XP, then conquests the walk-home keeps from being
  punished.
- **Engine:** movement — Faefolk, Void Assault, Ride the Wind, Tideturner, the legend's walk-home.
- **Fears:** decks that never present a lone unit (go-wide boards), and mass shrink (−Might to all
  enemies) that turns its +2 into nothing.
- **Measured vs. named:** the numbers say aggro; Jun's plan is midrange (develop, then win the
  late game). The deep dive is the [deck guide](../guides/khazix-voidreaver.md) and the
  [matchup guide](../guides/khazix-voidreaver-matchups.md); where they disagree with this page,
  they win.

### Evelynn, Agony's Embrace — facedown tempo *(Radiance)*
*measured control · 2 placed / 71 lists · reactive 32 of 40 · brews*
- **Plan:** almost everything is Hidden. The legend draws 1 the first time each turn you play a
  card from face down (and discards 1 if it is not your turn). Evelynn, Consuming readies and grows
  when you play a card from face down; Evelynn, In Control **scores a point when she holds with a
  facedown card of yours there**. Momentary Companion and Bedeviling Stranger are the new Hidden
  bodies.
- **Wins by:** hiding at every battlefield it controls and never playing into your open mana.
- **Against it:** a facedown card can only act at its own battlefield (rules.md, Hidden). Taking
  the battlefield trashes what it hid there.
- **From Kha'Zix:** Scuttle Crab's Deathknell lets you look at their facedown cards that turn —
  information this deck is otherwise built to deny you.

### Sivir, Battle Mistress — gold aggro
*measured aggro · 1 placed / 21 lists · thin*
- **Plan:** the legend makes Gold when you recycle a rune and readies when enemy units die; Sivir,
  Mercenary gets +2 Might and Ganking once you have spent two Power. A fast, combat-first deck.

### Miss Fortune, Bounty Hunter — open-battlefield tempo
*measured control · 0 placed in this window / 19 lists · thin*
- **Plan:** the legend gives Ganking; Miss Fortune, Buccaneer lets units be played to **open**
  battlefields; Miss Fortune, Captain readies something the first time she moves. A movement deck
  that contests battlefields you thought were safe.

## Body / Fury — the curve

The aggressive pair: Pit Rookie, First Mate, Kinkou Initiate, Noxus Hopeful, Ferrous Forerunner,
Inferna and Kai'Sa, Survivor turn up across all four legends, with Punch First and Sabotage. Lots
of units, played every turn, each a little bigger than it should be.

### Rengar, Pridestalker — ambush aggro
*measured midrange · 59 placed · u30 s10 g0 · cost 2.8 · int 5 · E4 17.9 · Might T4 16.9*
- **Plan:** 30 units. The legend gives +1 Might whenever you play a unit, and the units arrive
  where it hurts — Ambush (Inferna, Grim Apothecary, Nidalee, Cat Form, Rengar, Trophy Hunter, which
  can be played to a battlefield with enemy units) and Reaction (Rengar, Pouncing, into a
  battlefield you are attacking). Thrill of the Hunt replays a unit at any battlefield.
- **Wins by:** fights the opponent cannot plan for, because the attackers are still in hand.
- **Fears:** answers held for the moment Ambush units land; mass shrink.
- **From Kha'Zix:** it rarely leaves a unit alone — it adds them. Your Mutating Horror bonus is
  harder to switch on than usual.
- **From Riven:** both decks want to act after the other commits; it has more units to commit.
- **From Rek'Sai:** a race. Both decks win by numbers on the board; theirs arrive mid-combat.

### Lucian, Purifier — equipment aggro
*measured midrange · 14 placed · u23 s9 g8 · int 2*
- **Plan:** the legend gives every Equipment Assault; Lucian, Merciless readies the first time he
  conquers; Relentless Pursuit moves and equips in one card. Low interaction (2) — it means to win
  the board, not answer yours.
- **Against it:** with so little interaction, it cannot stop a big unit it did not race.

### Renekton, Butcher of the Sands — unit ramp
*measured midrange · 5 placed · u30 s10 · thin*
- **Plan:** the legend turns two Power into two Energy for units; Renekton, Rage Fueled deals 2 to
  all enemy units at his battlefield when he attacks, if you control 4 or fewer runes.

### Volibear, Relentless Storm — big Mighty ramp
*measured ramp · 0 placed in this window · cost 6.1, 19 cards at 7+ · thin*
- **Plan:** Mobilize and Mighty units feed the legend's rune channelling into Volibear, Furious (5
  damage split on attack), Kadregrin (draw per Mighty unit) and Sky Splitter. The slowest deck on
  this page by a distance.

## Body / Mind — Jayce alone

### Jayce, Defender of Tomorrow — gear ramp, with an alternate win
*measured ramp · 44 placed · u3 s27 g10 · cost 4.3 · 9 cards at 7+ · Might T4 0.9*
- **Plan:** almost no units. Ramp gear (Platewyrm Egg adds Energy; the legend readies gear),
  card flow (Garbage Grabber, Clairvoyance, Dredge Up), then the top end: Dazzling Aurora plays a
  free unit from the top every end of turn, Elder Dragon, Catalyst of Aeons. And **Gutter Palace:
  at the start of your Beginning Phase, with exactly 4 cards in hand and exactly 4 units at
  battlefields, you win the game** (61% of lists).
- **Wins by:** surviving to the turn its gear takes over, or by Gutter Palace.
- **Fears:** early pressure — it has nothing on the board for three turns (0.3 units by turn 3 in
  the goldfish).
- **From Kha'Zix:** Sabotage reveals the hand and recycles a non-unit card — Gutter Palace, Dazzling
  Aurora and its ramp gear are all non-units. Pressure early; it cannot defend battlefields with
  units it does not run.
- **From Riven / Rek'Sai:** the race is the plan. Every turn it spends ramping is a battlefield you
  hold.

## Body / Order — buffs and Mighty

Order brings buffs, Hidden Blade and Challenge; Body the Might. Sett, Fiora, Ambessa, Poppy and
Jarvan IV each turn "make units bigger" into a different engine — buffs, Mighty, Empower, XP,
Deploy gear.

### Sett, The Boss — buff midrange
*measured midrange · 41 placed · u23 s15 g2 · cost 3.1 · int 5*
- **Plan:** buff everything (Pit Rookie, Cithria of Cloudfield, Kinkou Monk, Arena Bar), then cash
  buffs in: Call to Glory is free if you spend a buff; Sett, Kingpin gets +1 Might per buffed unit at
  his battlefield; Sett, Brawler spends his buff for +4. The legend saves a buffed unit from dying
  (spend the buff, recall it).
- **Fears:** removal that ignores the save (it costs a buff and the legend's exhaust, once).
- **From Rek'Sai:** a fight of wide boards; its buffs make each unit worth more than your 1-Might
  tokens.

### Fiora, Grand Duelist — Mighty ramp
*measured midrange · 31 placed · u21 s16 g3 · cost 3.6*
- **Plan:** the legend channels a rune when a unit becomes Mighty; Fiora, Victorious gains Deflect,
  Ganking and Shield while Mighty; Riposte counters a spell and pumps; Harnessed Dragon kills an
  enemy unit when played.
- **Against it:** keeping its units below Mighty denies the ramp and the keywords together.

### Ambessa, Matriarch of War — empower aggro
*measured aggro · 21 placed · u22 s16 g2 · cost 2.6*
- **Plan:** Empower everything (Legion Marauder, Kayle, Justified, Solari Sunhawk, both Ambessas);
  the legend empowers itself whenever you empower something else and spends it to ready a unit.
  Guttural Roar gives +4 to an Empowered unit. Ambessa, Respected and Feared kills a smaller enemy
  when she attacks while Empowered.
- **Against it:** the Empower costs are paid up front; answers after the investment are the
  efficient ones.

### Poppy, Keeper of the Hammer — XP midrange
*measured midrange · 3 placed · thin* — XP from holds and Demacian Diplomat, spent to draw (the
legend), buff (Enthralling Protector) or discount Poppy, Defender of the Meek; Keeper's Verdict tucks
an enemy unit.

### Jarvan IV, Exemplar of Demacia — Deploy aggro *(Radiance)*
*measured aggro · 1 placed / 34 lists · u25 s6 g9 · brews*
- **Plan:** cheap Deploy gear at battlefields — Concert Poster (Recruit tokens), Pillaged Armory
  (buffs), Demacian Standard (+2 to an attacker) — and the legend moves a friendly unit to the
  battlefield you just deployed to. Jarvan IV, Martial Paragon gives Deploy gear Action and ramps on
  conquests there.
- **Fears:** Deploy gear dies when an opponent **holds** its battlefield (rules.md, Deploy) — the
  deck must keep the battlefields it builds on.

## Calm / Chaos — tempo

The densest reactive pair: Defy, Discipline, Tideturner, Scuttle Crab, Boots of Swiftness,
Star-Crossed, Zhonya's Hourglass, Ride the Wind and Vex, Apathetic run across all four legends, and
Stellacorn Herder across three. **Move, ready, react**: units that act more than once a turn, cheap
Reactions to win fights after the opponent commits, and bounce.

### Irelia, Blade Dancer — movement tempo
*measured tempo · 45 placed · u13 s22 g5 · cost 2.2 · reactive 23 · int 11*
- **Plan:** when you choose a friendly unit, the legend can exhaust itself and take [A] to ready
  it, and it readies itself when you conquer — so a unit attacks or moves, a spell chooses it, and
  it goes again. Stellacorn Herder (98% of lists) draws every time it moves; Irelia, Fervent grows
  whenever chosen or readied; Defiant Dance and En Garde win fights on the opponent's commit.
- **Wins by:** out-acting the opponent: more moves, more fights, more cards drawn from them.
- **Engine:** ready → move → draw (Herder). Her idea page's Engines panel lists the Radiance
  cards that would feed it (Lulu, Whimsical is the one the experiment tries).
- **Fears:** answers that do not choose (mass effects), and stuns that stop the readied unit acting.
- **From Riven:** the mirror of your colours; same shell, different engine. Whoever holds the last
  Reaction usually wins the fight.
- **From Kha'Zix:** she rarely leaves a unit alone and readies the one you isolate.

### Vex, Gloomist — stun control
*measured tempo · 35 placed · u19 s17 g4 · reactive 21 · int 10*
- **Plan:** **Vex, Apathetic stuns every unit an opponent plays while she is at a battlefield, and
  they cannot move it that turn.** The rest buys time around that (Back Off, Switcheroo, Tornado
  Warrior, Astral Heron) and the legend draws when you hold.
- **Wins by:** making your development turn useless while it holds.
- **From Riven:** your units entering ready is exactly what she cancels — a unit played while she
  is at a battlefield is stunned on arrival. Remove or move her before the turn you develop.
- **From Rek'Sai:** a deck that plays several units a turn into a card that stuns each one.

### Yasuo, Unforgiven — Spiderling swarm
*measured combo · 12 placed · 39 Spiderling + Yasuo, Windrider*
- **Plan:** Spiderling is Hidden, and has **+1 Might for each other Spiderling you control at its
  battlefield**; its text lets a deck run any number. Hide them, flip them together, and one
  battlefield holds a pile of units that grow with each other. Yasuo, Windrider has Ganking and
  scores a point the third time he moves in a turn; the legend moves a unit to or from base.
- **Fears:** anything that hits a whole battlefield: Bellows Breath (1 to up to three units at a
  location), Imperial Decree, Singularity, Thousand-Tailed Watcher's −3.
- **From Riven:** Bedeviling Stranger returns an enemy unit when a battlefield has 4 or more units
  — Spiderling battlefields usually do.

### Riven, The Exile — exhaust tempo *(Radiance)* · *your deck*
*measured tempo · 9 placed (online previews) · u21 s13 g6 · reactive 19 · draw 12*
- **Plan:** **units you play to battlefields you control enter ready**, so they act the turn they
  land. Riven, Broken Blade and Reckless Innovator trigger when they become exhausted (buff/stun/
  ready, or Gold/draw), so attacking and moving pays; Ki Burst's cost exhausts on demand; Riven,
  Deserter readies a unit by exhausting another. Blade of the Exile can be equipped by exhausting a
  unit.
- **Wins by:** holding the battlefields it develops onto, with interaction (Defy, Discipline,
  Star-Crossed, Rebuke) behind.
- **Fears:** Vex, Apathetic (see above); mass shrink; anything that keeps it off the battlefields
  it controls, since that is where the ready-on-entry works.
- **Deep dive:** the Nova list and the consensus are on Riven's idea page (Find a deck); the
  [gauntlet guide](../guides/riven-exile-gauntlet.md) predates any Radiance results.

## Calm / Fury — Akali alone

### Akali, Rogue Assassin — movement control
*measured control · 62 placed · u20 s15 g5 · int 12 · draw 15*
- **Plan:** the legend pulls a unit out of a showdown to base (and readies it if Empowered) —
  escapes, and re-uses of play effects. Akali, Deadly Weapon pings whenever she moves; Akali,
  Silent can't be chosen outside combat and grows on moving; Stellacorn Herder and Shuriken Flip.
  Falling Star, Astral Heron and Back Off behind. Radiance adds Akali, Brash (Energy on first move,
  plays the top card on the second).
- **Wins by:** grinding: card advantage from moves, removal, untouchable threats.
- **From Rek'Sai:** her pings and Falling Star (3 and 3) are efficient into small units.

## Calm / Mind — value engines

Defy, Charm, Scuttle Crab, Discipline, Thousand-Tailed Watcher, Stupefy and Ravenbloom Student
across five legends: the most card-flow-heavy pair, each legend building a different engine on top.

### Ornn, Fire Below the Mountain — gear engine
*measured midrange · 26 placed · u15 s5 g20 · cost 2.0*
- **Plan:** 20 gear. The legend adds Power for gear; Pit Crew readies when you play a gear; Poro
  Snax and Patched Porobot draw; Ornn, Blacksmith finds gear; Ornn, Forge God has +1 Might per
  friendly gear.
- **Against it:** gear removal is unit removal here.

### Nasus, Curator of the Sands — big-spell ramp
*measured ramp · 25 placed · 8 cards at 7+ · int 12*
- **Plan:** 7+ cost cards ready two runes via the legend; Find Your Center and Tasty Faefolk ramp;
  Nasus, Ascended scores a point when he conquers while Empowered (Empower 8); Steel Paws becomes
  7 Might when Empowered. Thousand-Tailed Watcher and Bellows Breath hold the early board.
- **Against it:** slow by design (1.9 units by turn 3). Points before its 8-drops arrive.

### Lillia, Bashful Bloom — Sprite tokens
*measured tempo · 14 placed · u10 s21 g9* — the legend makes ready 3-Might Temporary Sprites,
cheaper per Temporary unit you have; Sprite Burst makes two; Smoke and Mirrors swaps a Temporary unit
across battlefields; Unchecked Power deals 12 to everything at battlefields.

### Ahri, Nine-Tailed Fox — shrink control
*measured ramp · 7 placed* — the legend gives enemy attackers −1 Might; Ahri, Inquisitive −2 when
she fights; Ahri, Alluring scores a point when she holds; Radiance's Ahri, Confident grows whenever
you shrink an enemy at her battlefield.

### Orianna, Lady of Clockwork — gear-to-unit *(Radiance)*
*measured tempo · 0 placed / 52 lists · u10 s14 g16 · brews*
- **Plan:** at the start of your Main Phase the legend turns a gear into a unit with Might equal to
  its cost. So expensive gear — Resplendent Rostrum (8), The Ball (5), Gravity Field (5) — become
  big units, and Command: Attack (92%) moves Deploy gear or digs for gear. Orianna, Mechanical
  Marvel discounts gear.
- **Against it:** one gear is a unit at a time; it changes only when she picks another.

## Calm / Order — tokens and stuns

Discipline, Defy, Hidden Blade, Back Off, B.F. Sword, Deathgrip and Vi, Peacekeeper across four
legends — the pair with the most hard answers and the most protected bodies.

### Azir, Emperor of the Sands — soldier tokens
*measured tempo · 42 placed · u3 s21 g16 · cost 2.3*
- **Plan:** three units, sixteen gear. Cheap Equipment (Doran's Shield, Eye of the Herald, Soul
  Sword, Hand Hammer); the legend makes a 2-Might Sand Soldier after you play an Equipment, and Sand
  Soldiers have Weaponmaster. **Arise! makes a Sand Soldier for each Equipment you control and readies
  two**; Guards! is a Hidden one. Azir, Sovereign brings token units along when he attacks.
- **Wins by:** the turn Arise! turns its gear into a board.
- **Fears:** gear removal, and area damage into 2-Might soldiers.
- **From Rek'Sai:** two go-wide decks; its tokens are 2 Might, yours mostly 1.

### Shen, Eye of Twilight — pair defence
*measured tempo · 8 placed* — Shen, Kinkou is a Reaction Tank; Shen, Leader **scores a point when he
holds with exactly one other unit**; Disciple of Shen gets Shield 3 in the same spot; Ki Barrier
prevents 7. A deck that wins by holding small, very hard battlefields.

### Leona, Radiant Dawn — stun midrange
*measured tempo · 5 placed* — the legend buffs when you stun; Leona, Determined stuns on attack;
**Leona, Zealot gives stunned enemies at her battlefield −8 Might** and enters ready late in the game;
Zenith Blade stuns and moves in.

### Ivern, Green Father — tribes
*measured tempo · 3 placed* — Bird, Cat, Dog, Poro tags; Ivern, Friend to All scores a point on
conquer or hold if your units have all four; the legend turns battlefields into Brush tokens.

## Chaos / Fury — aggression from odd angles

Tideturner, Switcheroo, Noxus Hopeful, Kai'Sa, Survivor, Cleave, Falling Star and Gust across five
legends: tempo bodies and burn. Each legend has a payoff for something unusual — winning combats,
discarding, bombs, banishing.

### Draven, Glorious Executioner — combat draw aggro
*measured aggro · 6 placed* — the legend draws whenever you win a combat; Draven, Showboat has your
points as extra Might; Spinning Axe and Overzealous Fan (kill it on defence to send an attacker home)
keep fights one-sided.

### Pyke, Bloodharbor Ripper — bounce tempo
*measured tempo · 3 placed* — the legend returns a friendly unit to hand for Gold (re-buy play
effects); Piercing Light, Bewitching Spirit's discard.

### Ziggs, Hexplosives Expert — bombs *(Radiance)*
*measured midrange · 2 placed / 73 lists · u12 s18 g10 · brews*
- **Plan:** the legend, Amateur Demolitionist, Satchel Charge and both Ziggs make **Bomb gear tokens
  at battlefields** (Deploy; when one dies it deals 2 to an enemy there and kills your other Bombs
  there). Hexplosive Minefield kills your own Bombs on purpose and replaces them at end of turn;
  Detonate kills any gear and draws. Ziggs, Short-Fused gives friendly gear abilities 1 bonus damage.
- **Against it:** the Bombs are gear — they die to gear removal, and to an opponent holding there.

### Zed, Master of Shadows — clones
*measured midrange · 2 placed / 99 lists* — Shadow Clone tokens; Zed, Without a Sound swaps places
with a clone; the legend empowers whenever you banish a card you own; Perfect Execution readies with
Assault 3.

### Jinx, Loose Cannon — discard aggro
*measured midrange · 0 placed in this window / 31 lists* — Jinx, Demolitionist discards 2, Flame
Chompers plays itself when discarded, Jinx, Rebel readies when you discard; the legend draws 1 at
the start of your turn when your hand is down to one card or none.

## Chaos / Mind — answers and spells

Star-Crossed, Stupefy, Gust, Fizz, Vex, Apathetic, Sprite Fountain, Thousand-Tailed Watcher and
Singularity across four legends: the interaction-heaviest pair.

### Ezreal, Prodigal Explorer — gear control
*measured control · 15 placed · int 16 · E4 14.4*
- **Plan:** the legend draws when you've chosen enemy units/gear twice in a turn. The List (−2 to a
  named tag), Pack of Wonders (bounce your own gear, unit or Hidden card), Treasure Trove, Deadly
  Flourish and Bellows Breath; Turn to Dust makes gear Temporary.
- **Wins by:** answering everything twice and drawing for it.
- **From Rek'Sai:** Bellows Breath (1 to up to three units at one location) is built for 1-Might
  tokens.

### Diana, Scorn of the Moon — showdown spells
*measured tempo · 8 placed* — the legend adds Energy only during showdowns; Diana, Lunari Predicts
when a showdown starts; Diana, No Longer Human grows per spell; Moonfall pulls an enemy in and
shrinks them; Hwei moves and filters.

### Mel, Soul's Reflection — empowered spells
*measured tempo · 5 placed* — Applied Researchers (spells cost less while Empowered), Shock Blast
(cheaper with anything Empowered), Rebuttal steals a spell; Mel, Defiant Soul banishes a small enemy
when empowered.

### Teemo, Swift Scout — Hidden swarm
*measured tempo · 3 placed / 47 lists · reactive 26* — the legend hides for [1] instead of [A] and
returns Teemos to hand to re-hide; Teemo, Strategist pings for every Hidden card in the top 5;
Guerilla Warfare rebuys Hidden cards and hides for free; Nocturne, Horrifying is played for one Power
when seen on top.

## Chaos / Order — Kennen alone

### Kennen, Heart of the Tempest — plays from elsewhere
*measured tempo · 67 placed · u20 s15 g5 · cost 2.8 · E4 15.7*
- **Plan:** the legend empowers **whenever you play a card from anywhere other than your hand**, then
  disempowers to give a unit Assault 2. So the deck plays from the trash and the top of the deck:
  Lightning Rush (Flow), Fizz, Trickster (casts a spell from the trash), Tail-Cloaked Matriarch
  (replays a unit from the trash), Nocturne off the top, Kennen, Storm of Shuriken (gives a trash
  spell Flow when he conquers). Rhasa the Sunderer costs 1 less per card in the trash, which all of
  this fills.
- **Wins by:** a long game of free value that turns into Assault on the attack.
- **Fears:** early pressure before the trash fills; Rhasa and the Flow cards are its late game.
- **From Kha'Zix:** its Gust, Star-Crossed and Switcheroo are the same tricks you use; it holds them
  for your fights.
- **From Riven:** it was the best converter at the LA RQ (Vendetta) and won the Haven preview.

## Fury / Mind — spells and big turns

Thousand-Tailed Watcher, Stupefy, Falling Star, Time Warp, Kai'Sa, Survivor, Noxus Hopeful and
Bellows Breath across four legends.

### Kai'Sa, Daughter of the Void — spell control
*measured control · 44 placed · u20 s20 · int 13 · E4 18.1*
- **Plan:** the legend adds Power for spells; Falling Star, Hextech Ray, Stupefy, Bellows Breath
  answer early; Watchful Sentry and Lecturing Yordle draw; then the top end — Thousand-Tailed
  Watcher (−3 Might to every enemy unit that turn), Brynhir Thundersong (opponents can't play cards
  that turn), **Time Warp (take an extra turn)**. Kai'Sa, Evolutionary replays a spell from the trash.
- **Wins by:** removing the early board, then turns the opponent cannot answer.
- **Fears:** being raced before the 7-drops (3.4 average cost).
- **From Kha'Zix:** Watcher's −3 lands on their turn's play; Sabotage can strip Time Warp.
- **From Rek'Sai:** the most removal-dense deck you will face; Watcher blunts your whole board.

### Rumble, Mechanized Menace — mechs
*measured midrange · 4 placed* — Mech synergies: Bubble Bot readies a Mech, Production Surge makes
one, Forecaster gives Vision, both Rumbles boost Mechs, Breakneck Mech gives them Deflect and Ganking.

### Jhin, Virtuoso — four-spell ramp
*measured control · 3 placed* — banish four 4+ spells with the legend to channel 4 runes and draw;
Jhin, Meticulous Killer is played for one Power after a 4+ spell; Curtain Call, Rocket Barrage.

### Ekko, Boy Who Shattered Time — re-buy tempo *(Radiance)*
*measured midrange · 2 placed / 43 lists · brews* — the legend discounts the next unit by 2 and
kills it at end of turn; Ekko, Ingenious returns a friendly unit as his cost (re-use play effects);
Chronobreak banishes and replays your units; Temporal Breach. A deck of play effects used twice.

## Fury / Order — go wide

Noxus Hopeful, Falling Star, Carrion Dredger, Faithful Manufactor, Cleave, Honest Broker, Cull the
Weak and Inferna across four legends: tokens, Deathknell value, and Assault.

### Rek'Sai, Void Burrower — go-wide aggro · *your deck*
*measured aggro · 52 placed · u24 s16 g0 · cost 2.6 · int 4 · units T3 4.2*
- **Plan:** the most units on the board by turn 3 of any deck here (4.2 in the goldfish). Token
  makers (Faithful Manufactor, Noxian Emissary, Vanguard Captain), Deathknell units that leave value
  (Carrion Dredger's Bird, Honest Broker's Gold), Noxus Hopeful cheap with Legion. When you conquer,
  the legend reveals the top 2 and plays one; Rek'Sai, Breacher gives units played from anywhere but
  hand Accelerate; Undertitan gives the others +2 the turn it lands. Blood Rush and Cleave turn the
  wide board into attackers.
- **Wins by:** more battlefields contested than the opponent can defend, then Undertitan.
- **Engine:** reveal — the top of the deck. Conquer, flip two, play one: the legend on conquest,
  Void Rush any time, Breacher's Accelerate so the flipped unit fights now, Undertitan's [Add] 2 as
  it is revealed. Every conquest is a gamble on the top two, which is why the deck is all cheap
  bodies (27 of 40 at 2 or less): almost anything flipped is playable. Legion (Noxus Hopeful,
  Vanguard Captain) rewards the second card each turn. The Deathknell units are insurance that
  makes losing a fight cheap, not a plan to build on — winners run none of the Deathknell payoffs
  (Karthus 0 of 61; docs/research.md).
- **Fears:** area effects — Bellows Breath, Imperial Decree, Thousand-Tailed Watcher — and Vex,
  Apathetic stunning each unit you play.

### Darius, Hand of Noxus — legion midrange
*measured midrange · 9 placed* — the legend adds Energy with Legion; Darius, Trifarian grows and
readies on your second card each turn; Spectral Matron and Baited Hook replay units from the trash.

### Vi, Piltover Enforcer — equipment aggro
*measured aggro · 6 placed* — the legend readies a unit after conquering with 3+ excess damage;
Hextech Gauntlets, Vault Breaker (Assault 2 and Ganking), Vi, Peacekeeper stuns on attack.

### Mordekaiser, Iron Revenant — death ramp *(Radiance)*
*measured ramp · 5 placed (online previews) / 63 lists · u29 s5 g6*
- **Plan:** the legend banishes a unit or gear from your trash for Power (units and gear only), so
  every death fuels the next play. Mordekaiser, Twice Slain (Assault 3) survives by killing another
  friendly unit; Mordekaiser, Dominating discards to kill a unit or gear on play and attack. Realm
  of Death is removal that pumps your side.
- **Against it:** the trash is its mana — what it has banished is gone for good.

## Mind / Order — Deathknell and answers

Hidden Blade, Thousand-Tailed Watcher, Vi, Peacekeeper, Honest Broker, Soaring Scout, Sacrifice
and Glasc Mixologist across four legends.

### LeBlanc, Deceiver — Deathknell value
*measured ramp · 57 placed · u30 s7 · cost 4.0 · int 1*
- **Plan:** thirty units, most with Deathknell (Ruined Rex deals 4, Glasc Mixologist replays a small
  unit from the trash, Black Rose Dignitary and Soaring Scout channel, LeBlanc, Fragmented draws), and
  **Karthus, Eternal makes every Deathknell trigger an additional time**. The legend copies a unit at a
  battlefield you conquer or hold (Temporary, so it dies — and triggers — again). Sacrifice and Baited
  Hook kill its own units on purpose.
- **Wins by:** trading every unit for more than it is worth.
- **Fears:** answers that don't kill — bounce, Banish — so no Deathknell fires.
- **From Kha'Zix:** Star-Crossed and Switcheroo-style answers beat it better than damage; see the
  [matchup guide](../guides/khazix-voidreaver-matchups.md).
- **From Rek'Sai:** your Cull the Weak makes it kill one of its own units too — which it wants.

### Viktor, Herald of the Arcane — recruit control
*measured midrange · 43 placed · u14 s23 · int 11*
- **Plan:** the legend makes a Recruit for [1]; Viktor, Leader makes one whenever another non-Recruit
  unit of yours dies; **Imperial Decree: when any unit takes damage this turn, kill it**; Cull the
  Weak, Hidden Blade, Wages of Pain. It answers early and wins with tokens.
- **From Rek'Sai:** Imperial Decree punishes a wide board of small units in one card.

### Renata Glasc, Chem-Baroness — gold
*measured tempo · 2 placed* — Gold everywhere; Hostile Takeover steals an enemy unit for a turn;
Renata Glasc, Mastermind scores a point for a large activation while at a battlefield.

### Seraphine, Starry-Eyed Songstress — exhaust-three spells *(Radiance)*
*measured midrange · 0 placed / 64 lists · u9 s25 · brews*
- **Plan:** the legend exhausts itself and three friendly units to cut a spell's cost by 2;
  Seraphine, Inspiring draws when you exhaust three units at once; Seraphine, Not Alone makes a
  Recruit when played or exhausted and has +1 Might per other exhausted unit. Concert Poster and
  Encore make the bodies; Fanfare draws per unit played.
- **Against it:** it taps its own board to cast — punish the turn it does.

---

## What would change this page

- **Sanctioned Radiance results** (from 2026-10-23): rewrite the Radiance entries and re-check every
  "measured" line against the new snapshot.
- **Your logged games**: each "From Kha'Zix / Riven / Rek'Sai" line becomes a real matchup note once
  the journal has games against that legend.
- **A Radiance FAQ**: may change how Deploy, Show Off or Disarm play, and with them Jarvan IV, Ziggs,
  Orianna and Kai'Sa, Rebel.
