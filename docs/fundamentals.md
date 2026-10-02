---
title: Fundamentals of Riftbound
subtitle: How the game works, how points are actually won, and what the field plays — the teaching layer over docs/rules.md
author: rift toolchain
date: 2026-10-02
---

How the game works, and what you will face across the table. Three pages divide the job:

- **[rules.md](rules.md)** is the reference layer: the rule number to show a judge.
- **This page** is the teaching layer: what the rules add up to, and what the field plays.
- **[strategy.md](strategy.md)** is the decision layer: how to choose between two legal plays.

When this page and rules.md disagree, **rules.md is right and this file has a bug.**

Card shares come from **1,048 decks dated 24 September – 1 October 2026**, the post-ban window, with banned cards excluded. [Where these numbers come from](#where-these-numbers-come-from) explains the window and its limits; read it before quoting a share.

---

## 1. The one sentence everything hangs off

**You win at 8 points, and points come from battlefields.**

Not from damage, not from decking your opponent, not from killing their units. Killing things is a means. The scoreboard is the game.

Two ways to score, and they are the whole engine (§469):

- **Conquer** — you gain control of a battlefield you have not yet scored this turn. **1 point.**
- **Hold** — you still control it at the **start of your turn**. **1 point.**

**Once per battlefield per turn, either way** (§470). So a battlefield you take and keep pays 1 the turn you take it, and 1 every turn after.

In a 1v1 there are **two battlefields on the table** (§485.4), one from each player. That caps the rate at 2 points a turn.

| board | their rate | they win in |
|---|---|---|
| they hold both | 2/turn | **4 turns** |
| one each | 1/turn each | 8 turns |

### The clock runs whether you act or not

Hold scoring happens in the **Beginning Phase**, before Channel, before Draw, before you get to do anything (§315.2.b.2). A player with an empty hand and both battlefields still wins in four turns.

**So "playing slow" is only a strategy while the board is split.** Patience is often right: develop now, spend later ([§7](#7-points-holds-and-roles)). But it is never right while they hold both battlefields, because that clock does not care what you are building. This is the biggest difference from games where you win by reducing a life total, and the place where imported instincts go wrong.

### The eighth point is gated, and a Hold is not

When you try to gain a point from **Conquer** and you are already **within 1 of the Victory Score** (7 or more in 1v1), you only get it **if you have Scored every battlefield on the table this turn.** Otherwise you draw a card instead (§471.1.b, §471.1.b.1). Points from anything other than Conquer are not gated at all (§471.1.a.1).

That gives the endgame table worth knowing cold:

| you are at | and you | result |
|---|---|---|
| **7** | **Hold** a battlefield at the start of your turn | **you win** |
| **7** | Conquer, having Scored the other battlefield this turn | you win |
| **7** | Conquer, **not** having Scored the other | **you draw instead** |
| **6** | Hold one, then Conquer the other | win: the Hold counts as that battlefield's Score |
| **6** | Hold nothing, Conquer both | win: the first Conquer makes 7 and Scores that battlefield |

Read it from their side too. **An opponent at 7 who holds a battlefield wins at the start of their next turn unless you take it from them now.** That outranks every other plan.

### Running out of cards is not a loss

It is a **Burn Out** (§431): shuffle your trash back into your Main Deck, **an opponent of your choice gains 1 point**, and finish the draw. If your trash is empty too, you burn out repeatedly, handing out a point each time. So "grind them out of cards" is not a win condition. You still need 8 points.

---

## 2. Your deck

Five things, and they are not the same kind of thing (§103):

| | count | notes |
|---|---|---|
| **Champion Legend** | 1 | never leaves the Legend Zone. Sets your **Domain Identity** |
| **Chosen Champion** | 1 | starts face-up in the Champion Zone and is playable from there. Counts toward the 40 |
| **Main Deck** | 40 | exactly 40 in competition |
| **Rune Deck** | 12 | shuffled, kept separate |
| **Battlefields** | 3 | registered; only one is used per game in 1v1 |

**Domain Identity.** There are six domains: Fury, Calm, Mind, Body, Chaos, Order. Your Legend's domains *are* your identity, and a card is legal only if your identity contains **all** of that card's domains (§103.1.b.4). So a card that punishes Mind does nothing against a Fury/Calm legend: they cannot be playing Mind cards at all.

**Copy limits.** 3 of any name (§103.2.b), and **names include the subtitle**: `Kai'Sa, Survivor` and `Kai'Sa, Evolutionary` are different cards. Your Chosen Champion counts against its own 3. **Unique** cards are limited to 1.

**Sideboard** is tournament-only: **10 or fewer**, every card legal for your identity, and the 3-copy limit spans main deck and sideboard **together**. Runes, Legend and battlefields never change after registration (TR §403.4.b).

**A typical deck in the window** runs **18.5 units, 16.9 spells and 4.6 gear** in its 40. **78% of decks run at least one gear**, and 20% run Zhonya's Hourglass alone, so a deck with no answer to gear meets the problem most rounds. *An earlier edition of this page said 43%. That was the share of decks with an **Equip** card, not of decks with gear.*

---

## 3. The turn

Six phases, but only one of them is open (§315–317):

1. **Awaken** — ready everything.
2. **Beginning** — **Scoring Step: Hold every battlefield you control, 1 point each.** Your points arrive here, before you act.
3. **Channel** — channel 2 runes, ready.
4. **Draw** — draw 1. An empty deck here is a Burn Out, then you still draw.
5. **Main** — every player's rune pool empties, then it is open. There is no structure: any number of actions in any order. **Combats and showdowns happen inside this phase**, as a consequence of what you do.
6. **Ending** — heal all units, expire "this turn" effects, empty every rune pool.

**The ordering trap:** Hold scoring comes **before** Channel and Draw. A battlefield you are about to lose is still worth taking to the start of your turn.

**Going second** channels an extra rune on its first Channel Phase (§485.7). That is the whole compensation for going second.

---

## 4. Resources: Energy and Power

Conflating these is the most common beginner error.

- **Energy** — the numeral in the cost. Colourless.
- **Power** — the symbols under it. Usually has a domain; `[A]` (rainbow) pays any domain.

**Runes make both** (§164.2):

- `[E]` — **exhaust** the rune for 1 Energy.
- **Recycle** it — send it to the bottom of the Rune Deck for 1 Power of its domain.

**Those are different costs, and that is the trick.** Recycling does not require the rune to be ready, so **the same rune can be exhausted for Energy and then recycled for Power in the same turn.** The formula that decides every turn:

```
max(E, P) runes on the board, at least E of them READY
```

A card costing 1 Energy and 2 Body Power needs **two** Body runes, not three. A card costing 10 Energy and 3 Power needs ten runes, three of the right domain, not thirteen.

**What recycling costs is next turn.** The rune leaves your board, and you only channel 2 a turn to refill. **That makes Power expensive early.** Jun's illustration: in a seven-turn game, a Power spent on turn 2 costs you about five Energy over the game. It is why strong players develop units first and cast their Power spells in the midgame.

**Rune pools empty at the start of every player's Main Phase and at the end of every player's turn** (§167), everyone's, not just the turn player's. There is no floating resource between turns.

---

## 5. Combat

**Combat is never declared.** It happens on its own, in a cleanup, at a **Contested** battlefield where both players have units. You start a fight by *moving somewhere*.

**Contested** is applied when a unit arrives at a battlefield its controller does not control, and the battlefield is not already Contested (§190.3.a.1).

> **The player whose unit applied Contested is the Attacker** (§464.2.c.1).

That sentence decides more games than it looks like it should. If you drag an enemy unit onto *your* battlefield, **they** are the attacker. That matters because many cards read "while attacking" or "while defending".

### How damage works

**Sum each side's Might.** There is no blocking and no pairing off: two totals, each assigned across the other side's units. **The attacker assigns first**, so the defender allocates knowing the attacker's choices; only the *dealing* is simultaneous. The assignment rules that bite:

- **Lethal means a non-zero amount at or above the unit's Might.** A unit at 0 Might does **not** die on its own; it needs at least 1 damage marked.
- **Full lethal to one unit before any to the next.** 5 damage into four 3-Might units is 3 and 2, never 2/1/1/1.
- **No overkill**: you may not assign more than minimum lethal while others are unassigned, and marked damage counts.
- **Tank first, Backline last.**
- **Stunned units deal nothing**, but still need full Might to die.

**So cheap bodies are a real resource.** A 1-Might token absorbs exactly one point of their total and no more.

### Who won

> A player **wins** a combat if they held a designation and are the **only** player with units remaining at that battlefield (§466.3.a).

Everything else is **No Result**: a mutual wipe, both sides surviving, or attackers being recalled (§466.3.d). **Defending pays exactly what attacking pays.**

- **A tie destroys both boards**, because each side's total is at or above the other's.
- **Failed attacks are punished; failed defences are not.** Attackers are recalled if defenders survive (§466.1.a.2), and defenders stay. Attacking into an uncertain fight costs more than being attacked.

Survivors **heal in the Combat Cleanup** (§466.1.a.1), so damage does not carry to a second fight that turn.

---

## 6. The chain, and why your spell did not resolve

The game is always in one of four states (§310), and the state is the whole permission system:

| | **Open** (no chain) | **Closed** (chain exists) |
|---|---|---|
| **Neutral** | turn player plays anything | **Reaction only** |
| **Showdown** | **Action or Reaction only** | **Reaction only** |

- **`[Action]`** buys you into showdowns, on anyone's turn.
- **`[Reaction]`** buys you that *plus* closed states, responding to things on the chain.

### HOT FEPR

The loop the game runs on (§334): Handle Outstanding Tasks, then **F**inalize, **E**xecute, **P**ass, **R**esolve.

1. **Finalize** — the oldest pending item completes. **Finalizing does not pass priority** (§337.1.a).
2. **Execute** — the player with priority plays something, or passes.
3. **Pass** — when everyone passes in sequence with nothing added, resolve.
4. **Resolve** — **the newest finalized item resolves** (§340.1). Last in, first out.

**Two things beginners get wrong here:**

- **Passing does not resolve the whole chain.** Only the newest item resolves, then the loop runs again and priority comes back round. Your spell at the *bottom* resolves **last**.
- **Some things never wait to be answered.** A **Unit, a Gear, or an ability that Adds resources resolves the instant it finalizes** (§337.2). You cannot respond to an opponent playing a gear; it is already done.

---

## 7. Points, holds and roles

The rules above say how points are made. This section is how strong players think about making them, drawn from [strategy.md](strategy.md) and Jun's Kha'Zix guide.

**Conquering and holding are different kinds of advantage.** Conquering takes a point or denies one. Holding keeps a battlefield so they cannot freely enter and score. **Conquering is often easier than holding**, because the holder has parked material where the opponent can plan an attack, and has to pass without knowing what is coming. A hold is strong only if it is **hard to break, expensive to break, or backed by a punish** for the attempt: a facedown card, an Ambush threat, a retake ready in base.

**"The best defence is a good offence"** (Jun). The player in the lead who can mostly conquer is better placed than the player holding to keep up. **But holding is the most powerful way to score and the riskiest**, because a failed hold often loses the game. So the question to ask is not "should I hold?" but **"can I win this game without a hold?"** If not, force one, even if it may fail. Refusing a hold you needed loses as surely as a bad one.

**Who is happier if nothing happens?** That player can afford patience, and the other must force the game ([strategy.md §2](strategy.md#2-every-deck-is-solving-a-different-problem)). Ask it again whenever the board changes, because roles flip mid-game: the aggressor becomes the defender once the race turns, and the slow deck becomes the aggressor the turn its window opens. The hold clock bounds the answer. Patience is only patience while the board is split.

**The first-in trap.** The player who commits to a battlefield first shows their allocation first. The responder sees exactly what they need to beat. In fight-heavy matchups both players often wait for this reason. Going first is right when it takes options away from them, and wrong when the information it gives away is worth more than the point.

**A bad win** is a fight that succeeds locally and loses to what follows: the conquest that empties your base, or the combat won with two tricks that leaves nothing for the swing-back. After any local success, ask what the next position looks like, and who prefers it.

**Refuse the exchange they prepared.** When they pass with runes open, the reactive mistake is to fight into them anyway. Often the strong play is to **develop without offering a target**, so the interaction they held up expires unused.

---

## 8. The keywords that actually matter

Measured by how many decks in the window run at least one card carrying them:

| keyword | reach | what it does |
|---|---|---|
| **Hidden** | **82%** | pay `[A]` to hide it facedown at a battlefield you control; from next turn it gains Reaction and costs **nothing** |
| **Deathknell** | 64% | "when I die", so killing it is not always the answer |
| **Deflect X** | 59% | **opponents** pay X more Power to target it; can price a removal spell out of reach |
| **Accelerate** | 48% | optional extra `[1][C]` as you play: the unit **enters ready** |
| **Stun** | 48% | it deals no combat damage this turn, but still needs full Might to die |
| **Equip** | 46% | attach gear to a unit you control |
| **Ganking** | 43% | adds battlefield → battlefield to your standard move |
| **Ambush** | 40% | play it as a `[Reaction]` to a battlefield where you already have units |
| **Flow [cost]** | 39% | play the spell **from your trash**, then banish it |
| **Empower** | 38% | pay a cost to gain the Empowered status, permanent until it leaves the board |
| **Assault X** | 37% | +X Might **while attacking** |
| **Repeat [cost]** | 33% | pay again to execute the whole effect an **extra** time |
| **Shield X** / **Tank** / **Temporary** | 25% each | +X Might while defending / assigned lethal **first** / dies at the start of its controller's Beginning Phase, **before scoring** |
| **Backline** | 10% | assigned lethal **last** |

**Hidden deserves its own paragraph**, because it is in 82% of decks and it changes how you read a board. A facedown card is a free card at Reaction speed from the turn after it is hidden. You can see that it exists but not what it is. **Treat any opponent with a facedown card as having one more open answer than their runes suggest.** Playing from Hidden ignores the base cost entirely, so "they're tapped out" can be false.

The catch that costs games: a hidden **permanent** must be played to the battlefield it was hidden at, and its play effect reads that battlefield **off the source**. Remove the source in response to its own trigger, by bounce **or kill**, and the read returns null and the instruction is ignored. See **When the source leaves the board** in [rules.md](rules.md) and the recorded ruling in [rules-rulings.md](rules-rulings.md).

**And their facedown card can only act at its own battlefield.** You can only hide at a battlefield you control, and a hidden card's targets must be at that battlefield (§811.1.b, §811.1.d.2). So in a 1v1, the card they hid can hurt you when **you attack its battlefield**, not anywhere else.

---

## 9. The staples

**Basis:** the 1,048-deck window, banned cards excluded. A share is the fraction of decks running at least one copy, with alternate printings counted once. Costs are written Energy/Power, so a bare "2E" costs no Power.

### The twelve to know, across every domain

| | share | |
|---|---|---|
| **Defy** | **38%** | 1E/1 Calm · `[Reaction]` counter a spell costing **≤4 Energy and ≤1 Power** |
| **Discipline** | **36%** | 2E Calm · `[Reaction]` +2 Might this turn, **draw 1** |
| **Charm** | 24% | 1E/1 Calm · move an enemy unit |
| **Hidden Blade** | 22% | 2E/1 Order · `[Hidden][Action]` **kill a unit** at a battlefield; its controller draws 2 |
| **Scuttle Crab** | 22% | 2E Calm · **0 Might** unit · draw 1 on play; Deathknell hand reveal |
| **Star-Crossed** | 21% | 3E/1 Chaos · `[Reaction]` return **one of each player's** units to hand |
| **Punch First** | 20% | 1E/2 Body · `[Action]` **+5 Might** this turn |
| **Zhonya's Hourglass** | 20% | 2E Calm gear · `[Hidden]` if a friendly unit would die, kill this instead and recall it |
| **Back Off** | 20% | 3E Calm · `[Hidden][Action]` **Stun** a unit; draw 1 if played from hand |
| **Ride the Wind** | 20% | 2E/1 Chaos · `[Action]` move a friendly unit **and ready it** |
| **Stupefy** | 20% | 1E Mind · `[Reaction]` −1 Might this turn, **draw 1** |
| **Tideturner** | 20% | 2E Chaos · 2 Might · `[Hidden]` swap places with a unit you control elsewhere |

**Six of the twelve are Calm, and nine are interaction rather than threats.** That is the shape of the format. You are rarely beaten by a card being bigger than yours; you are beaten by one answering yours at the moment it mattered.

### Two readings that cost games

**Defy counters at ≤4 Energy *and* ≤1 Power.** *And*, not *or*, so **anything costing two Power walks straight through it, however cheap.** Punch First at 1E/2 Body is permanently Defy-proof. That tells you exactly which of your spells are safe to commit into open Calm.

**Check whose unit a bounce returns.** **Retreat** (Mind) returns a **friendly** unit: value and tempo for its controller, not removal, and it cannot touch you. **Star-Crossed** returns one of each. **Gust** returns any unit at ≤3 Might. Six of the pool's fourteen unit-bounce cards are self-bounce only, so fear the right ones.

### Self-replacing interaction is the format's engine

Look at what the top cards share: **Discipline** pumps *and* draws, **Stupefy** shrinks *and* draws, **Hidden Blade** kills *and* draws (for its victim). Riftbound mostly does not sell you a card that only draws cards. It sells you a trick that replaces itself. **A deck with no self-replacing interaction runs out first**, and that is usually what "they out-grind me" means in practice.

### The staples, by domain

The deckbuilding view: your Legend's identity decides which of these tables you may read. **There is no "goodstuff" tier below this.** No main-deck card is domainless (only battlefields are colourless), and every two-domain card is fringe. The most-played are Lightning Rush at 6%, Shuriken Flip at 5% and Defiant Dance at 4%. So a two-domain Legend reads exactly two of these tables, and the breadth of your identity is the breadth of your card pool.

#### Fury — damage and aggression

| | share | |
|---|---|---|
| **Noxus Hopeful** | 15% | 4E · 4 Might · **Legion**: costs 2 less if you have played another card this turn |
| **Falling Star** | 14% | 2E/2 · **Deal 3 to a unit. Deal 3 to a unit.** Two instances, and both can hit one unit |
| **Kai'Sa, Survivor** | 13% | 4E · 4 Might · Accelerate · when I conquer, draw 1 |
| **Ferrous Forerunner** | 11% | 6E/1 · 6 Might · Deathknell: two 3-Might Mech tokens to your base |
| **Inferna** | 10% | 2E · 1 Might · `[Ambush]` · Assault 2 |
| **Cleave** | 9% | 1E · `[Action]` give a unit **Assault 3** this turn |
| **Darius, Trifarian** | 8% | 5E/1 · 5 Might · on your **second card each turn**, +2 Might and ready me |
| **Long Sword** | 7% | 2E/1 gear · `[Quick-Draw]` · `[Equip]` Fury |
| **Perfect Execution** | 6% | 3E/1 · ready a unit and give it Assault 3 · Flow |
| **Blood Rush** | 5% | 1E · `[Action]` `[Repeat]` give a unit Assault 2 |

Fury's staples are the least concentrated of any domain: no card above 15%. It pays in damage and attack buffs rather than in cards.

#### Calm — interaction, and the most-played domain

| | share | |
|---|---|---|
| **Defy** | **38%** | 1E/1 · `[Reaction]` counter ≤4 Energy **and** ≤1 Power |
| **Discipline** | **36%** | 2E · `[Reaction]` +2 Might, draw 1 |
| **Charm** | 24% | 1E/1 · move an enemy unit |
| **Scuttle Crab** | 22% | 2E · **0 Might** · draw 1 on play; Deathknell hand reveal |
| **Zhonya's Hourglass** | 20% | 2E gear · `[Hidden]` save a unit from dying, recall it |
| **Back Off** | 20% | 3E · `[Hidden][Action]` Stun a unit |
| **En Garde** | 17% | 1E · `[Reaction]` +1 Might, and +1 more if it is the only unit you control there |
| **Not So Fast** | 13% | 2E/1 · `[Reaction]` counter an enemy spell or ability **that chooses a friendly unit or gear** |
| **Lonely Poro** | 13% | 2E · 2 Might · Deathknell: if I died **alone**, draw 1 |
| **Astral Heron** | 11% | 7E · 7 Might · while it is **at a battlefield**, your first card each turn makes the next one cost `[2][A][A]` less |

**Scuttle Crab at 0 Might is a real card**, because lethal damage must be non-zero: it cannot die to damage at all without something assigning it at least 1. **Astral Heron** is why the "Heron" builds of Irelia and Akali want battlefields: its discount only works while it stands on one, so the battlefield it stands on is the one to contest.

#### Mind — shrink, reach, and card flow

| | share | |
|---|---|---|
| **Stupefy** | 20% | 1E · `[Reaction]` −1 Might, draw 1 |
| **Thousand-Tailed Watcher** | 18% | 7E/1 · 7 Might · on play, **all enemy units −3 Might this turn** |
| **Bellows Breath** | 12% | 1E/1 · `[Action]` `[Repeat]` deal 1 to up to three units at one location |
| **Singularity** | 12% | 6E/2 · deal 6 to each of up to two units |
| **Sprite Fountain** | 11% | 2E/1 gear · Temporary · a ready 3-Might Sprite token |
| **Ravenbloom Student** | 10% | 2E · 2 Might · +1 Might whenever you play a spell |
| **Sprite Burst** | 9% | 5E · two ready 3-Might Temporary Sprite tokens |
| **Wages of Pain** | 7% | 3E · `[Hidden][Action]` deal 3 at a battlefield, plus a Gold token |
| **Temporal Breach** | 7% | 2E/1 · `[Hidden]` banish a unit and replay it at the same location |
| **Deadly Flourish** | 6% | 4E · deal 3 to an enemy unit; a Gold token when it dies |

Mind shrinks Might rather than dealing damage, which **dodges damage prevention**: a unit reduced to 1 Might is still alive, but loses every fight it is in.

#### Body — pumps, bodies and disruption

| | share | |
|---|---|---|
| **Punch First** | 20% | 1E/2 · `[Action]` **+5 Might** this turn, the biggest cheap swing, and Defy-proof |
| **Sabotage** | 18% | 1E/1 · reveal their hand, recycle a **non-unit** card |
| **First Mate** | 17% | 3E · 3 Might · on play, **ready another unit** |
| **Rampage** | 17% | 3E (+1 Body optional) · two units deal damage equal to their Might to each other |
| **Pit Rookie** | 15% | 2E · 2 Might · on play, buff another friendly unit |
| **Rengar, Trophy Hunter** | 14% | 5E/1 · 6 Might · can `[Ambush]` to a battlefield **even with no units there** |
| **Irresistible Faefolk** | 8% | 2E · 1 Might · when I **move to a battlefield**, drag an enemy unit there |
| **Kinkou Initiate** | 7% | 3E · 3 Might · draw 1 on play if your **other** units total 5+ Might |
| **Master Yi, Tempered** | 7% | 4E · 4 Might · Hunt 2; at Level 6, Deflect and Ganking |
| **Mobilize** | 6% | 2E · channel a rune exhausted; if you can't, draw 1 |

#### Chaos — movement and repositioning

| | share | |
|---|---|---|
| **Star-Crossed** | 21% | 3E/1 · `[Reaction]` return one unit of each player's to hand |
| **Ride the Wind** | 20% | 2E/1 · `[Action]` move a friendly unit **and ready it** |
| **Tideturner** | 20% | 2E · 2 Might · `[Hidden]` swap places with a unit you control elsewhere |
| **Switcheroo** | 18% | 2E/2 · `[Hidden][Action]` **swap the Might of two units** at one battlefield |
| **Gust** | 18% | 1E · `[Reaction]` return a unit at ≤3 Might to hand |
| **Vex, Apathetic** | 16% | 4E · 4 Might · `[Deflect]` · **Stuns any unit an opponent plays** while she is at a battlefield |
| **Fizz, Trickster** | 16% | 3E/1 · 3 Might · replay a ≤3-Energy spell from your trash, paying only its Power |
| **Traveling Merchant** | 14% | 2E · 2 Might · when I move, discard 1 then draw 1 |
| **Flash** | 11% | 2E · `[Reaction]` move up to two friendly units to base |
| **Boots of Swiftness** | 9% | 3E gear · `[Equip]` Chaos |

Chaos decides **where** fights happen rather than who wins them. **Flash** is the quiet one to know: two units leave a fight at Reaction speed, which leaves the battlefield to the opponent but saves the bodies.

#### Order — removal and stuns

| | share | |
|---|---|---|
| **Hidden Blade** | **22%** | 2E/1 · `[Hidden][Action]` **kill a unit** at a battlefield; its controller draws 2 |
| **Vi, Peacekeeper** | 17% | 5E/1 · 5 Might · `[Ambush]` · when I attack, Stun an enemy unit here |
| **Deathgrip** | 11% | 2E · `[Reaction]` kill your own unit to give another +Might equal to its Might; draw 1 |
| **Cull the Weak** | 10% | 2E/1 · **each player** kills one of their units |
| **Salvage** | 10% | 2E/1 · `[Action]` kill up to one gear, draw 1 |
| **Kennen, Keeper of Balance** | 10% | 3E · 2 Might · `[Hidden]` pay 2 to Stun on play or attack |
| **Honest Broker** | 9% | 2E · 2 Might · Deathknell: a Gold gear token |
| **Carrion Dredger** | 9% | 2E · 1 Might · Deathknell: a 1-Might Deflect Bird token |
| **Sacrifice** | 8% | 1E · `[Reaction]` kill a friendly Mighty unit: draw 2 and channel a rune |
| **B.F. Sword** | 8% | 4E gear · `[Equip]` Order |

**Hidden Blade is the most-played unconditional removal in the game.** It is the reason "can they punish my flip?" is not only about bounce, because killing a unit removes it from the board exactly as returning it does.

### Protection

**Zhonya's Hourglass** (20%, 2E Calm gear, `[Hidden]`): *if a friendly unit would die, kill this instead; heal that unit, exhaust it, and recall it.* It saves the body, but the unit leaves the battlefield, so **you still win the combat and take the battlefield**. Against a points-based win condition that is a trade you are usually happy to make.

**Deflect** (59% of decks) is the quieter one. It is a mandatory additional cost on *opponents*, so it does not announce itself. It just makes your removal cost more, or makes it uncastable if you cannot pay.

---

## 10. Battlefields

You register three and play one per game in 1v1, so they are a real deckbuilding decision. **In a best-of-three you choose each game, and every battlefield used in a game someone won is retired for the match, yours included** (§486.5). After a draw the same ones may return (§486.5.a). So plan the order across three games, not just the first.

The field's choices:

| | share | |
|---|---|---|
| **Seat of Power** | 17% | when you conquer here, draw 1 for each other battlefield you control |
| **Star Spring** | 16% | the first non-token unit played here each turn lets that player walk another unit home |
| **Zaun Warrens** | 16% | when you conquer here, discard 1 then draw 1 |
| **Forbidding Waste** | 15% | while a unit here is **defending alone**, it has **−2 Might** |
| **Sigil of the Storm** | 12% | when you conquer here, **you must recycle one of your runes** |
| **Grove of the God-Willow** | 12% | **when you hold here, draw 1** |
| **Targon's Peak** | 11% | when you conquer here, ready up to 2 runes at end of turn |
| **Sunken Temple** | 11% | when you conquer here with a **Mighty** unit, pay 1 to draw |
| **Emperor's Dais** | 9% | when you conquer here, pay 1 and return a unit there to hand to play a 2-Might Sand Soldier |
| **Trifarian War Camp** | 9% | **units here have +1 Might**, both players' |
| **Void Gate** | 8% | spells and abilities deal **1 bonus damage** to units here |
| **Rockfall Path** | 8% | **units can't be played here** |
| **Minefield** | 8% | when you conquer here, put your top 2 cards into your trash |
| **Forgotten Monument** | 8% | nobody can score here until their third turn |

**Almost all of them are symmetric.** Grove rewards whoever holds it, including them, and Trifarian War Camp pumps *both* sides. Read a battlefield as *"what does this do for the person who ends up holding it"*, because that person is frequently not you. **Sigil of the Storm** is the exception that taxes its conqueror: every conquest there costs a rune.

**Symmetric is not the same as neutral.** A battlefield whose trigger fits your deck better than theirs is asymmetric in practice. Jun's example is Zaun Warrens in a trash deck: you choose what you discard, so you get more from the same trigger.

**Three change a game plan rather than add value:**
- **Rockfall Path** means nothing can be *played* there: no Ambush, and no flipping a Hidden unit hidden there.
- **Vilemaw's Lair** (units can't move from there to base) makes committing permanent. Against a repositioning deck it is a cage.
- **Forgotten Monument** slows the deck that wants to race.

**Watch the ban list before you register one.** The Dreaming Tree, The Arena's Greatest, Obelisk of Power, Reaver's Row and Aspirant's Climb are **banned in constructed**, but they still appear in archived lists from before the ban and from unsanctioned play.

---

## 11. Things that are not what they look like

The short list of rulings most likely to catch you, each verified in [rules.md](rules.md):

- **Recalls are not moves** — they do not trigger "when I move", and movement prevention does not stop them.
- **Banish is not a kill** — Deathknell does not fire.
- **Hiding is not playing** — it opens no chain and cannot be responded to. *Playing from* hidden does.
- **Assigning damage is not dealing damage** — assignment happens for everyone first, then it is all dealt at once.
- **A countered card was never played** for triggers, but it *was* finalized, and costs are not refunded.
- **Tokens are not cards** — a token in any non-board zone except the chain ceases to exist, so bouncing a token kills it.
- **A unit is Mighty at 5 current Might**, not 5 printed.
- **Attaching is not a move**, and it does not change ready/exhausted state.
- **A unit moved to base mid-fight is out of the fight** (§359.3.e.5) — that is how Flash and Zhonya's save a body while conceding the battlefield.

---

## 12. Reading a deck you have never seen

You will face decks no guide covers. Classify on two questions, both answerable in the first two turns.

**1. Can they contest both battlefields?** Count cheap units and token-makers. A deck with ten 1–2 Energy bodies covers everything; a deck with three does not.

**2. Do they beat you in a long game?** Count card draw and recursion. If they draw more than you, time is theirs.

| | | your plan |
|---|---|---|
| can't contest two | — | **take both and race**; 2 a turn ends it in four |
| contests everywhere, out-grinds you | hardest | **win one fight early and convert it** |
| contests everywhere, you out-grind them | — | **hold one, refuse trades**, let them run out |

The tells, roughly:
- **Aggro:** two or more units on battlefields by turn 2, and everything costs 1–2.
- **Combo:** few units, cheap non-unit cards, drawing and searching.
- **Control:** removal on your first threat, and few bodies.
- **Ramp:** almost no early board, and expensive units.

**Then read their plan, not their cards** ([strategy.md §4](strategy.md#4-information-is-about-plans-not-cards)). First ask what their deck would *normally* do this turn. A play the deck makes with almost any hand tells you little. **A deviation tells you a lot**: a declined fight, a skipped development, a hold they could break and did not. **Not interacting does not prove they lack the card. Interacting *instead of* developing usually proves something.**

**And start well.** Jun's mulligan rule holds for almost every deck: **have a play for turn 1 and turn 2. If you don't, put two cards back.** Points come from units on battlefields, so a hand of tricks with no bodies has nothing to trick.

The two rules that hold in every matchup: **never hold zero battlefields, and never take a fight you have not already rigged.**

---

## Where these numbers come from

**Rule text** is [rules-full.md](rules-full.md), Riot's Core Rules verbatim. [rules-faq.md](rules-faq.md) outranks it where they differ, and [rules-rulings.md](rules-rulings.md) covers what neither states. Every `§N` here is a Core Rules entry.

**Card text** is `data/cards.json` with `data/errata.json` applied. Riot's feed serves **printed** text, and errata are published separately and never flow back into it, so the raw catalog shows superseded wording. Power costs are the catalog's `p` field, which agrees with riftbound.gg's card database on all 1,140 printings both carry.

**Card shares** come from `data/decks.json`, restricted to the **1,048 decks dated 24 September – 1 October 2026**:
- **Excluded:** the 23 September bulk-import day, 901 decks posted within minutes that skew every share they touch.
- **Composition:** 357 of the 1,048 are tournament-vouched, and **most carry no region**. Of those that do, nearly all are Asian. Treat shares as the shape of the format, not as anyone's local meta.
- **How counted:** a share is the fraction of decks with at least one copy. Alternate printings, promos and alternate-art runes are counted as one card. Banned cards are excluded.
- **Limits:** the window is 8 days, not the 60 the archive's header declares, so **ordering is reliable and gaps of a few points are not**.

**The previous edition** used a 506-deck slice dated 18–20 September, because the archive was mid-rebuild at the time. Its numbers sit within a few points of these; the gear figure was the one real error (see [§2](#2-your-deck)).

**Strategy material** in [§7](#7-points-holds-and-roles) is distilled in [strategy.md](strategy.md) (Mateo Ferreira) and [Jun's notes](../guides/khazix-voidreaver-jun.md). Both are paid sources, read in full and summarised in our own words.

**What this page does not do** is explain the three Radiance keywords. `[Deploy]`, `[Disarm]` and `[Show Off]` are printed on cards, but the Core Rules define none of them. Radiance releases **23 October 2026**, and this page will need its shares, staples and keywords redone after it. See **Printed, but not yet in the rules** in [rules.md](rules.md).
