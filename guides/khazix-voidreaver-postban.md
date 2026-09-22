---
title: Kha'Zix Voidreaver — Midrange Dossier
subtitle: Riftbound, Vendetta season — Jun's midrange build, September update, with the Hidden package
author: rift toolchain
date: 2026-09-22
---

**Legend:** Voidreaver (Body/Chaos) · **Champion:** Kha'Zix, Mutating Horror
**Registered:** 40 main (Champion included) + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39 — the Champion starts outside the deck (rule 103.2.a.1, 108.3.d)
**Collection status:** complete, nothing to get
**Built from:** Jun's September update to the midrange list — saved in the app as `Kha'Zix Midrange (Jun, post-ban)`, read live from the app's state on 22 September 2026

*This file kept the `khazix-voidreaver-postban` slug so the links in the [aggro dossier](khazix-voidreaver-aggro.md) still resolve. Both Jun lists are post-ban now; this is the midrange one.*

---

## The short version

*Everything here is expanded below with the rule text behind it. This page is the part worth having at the table.*

**What changed.** Four cards with **Hidden** came in — Evelynn, Entrancing; Pyke, Returned; Tideturner; and a main-deck Switcheroo — and **Forbidding Waste became Star Spring**. Onslaught is gone, Traveling Merchant fell 3 → 1, Up from the Deep 3 → 2, Zed 2 → 1, Kinkou Initiate 2 → 3. The sideboard traded Unyielding Spirit, Angler Beast and a Hard Bargain for **2 Decree of Strength and a Rebuke**. Full diff in §1.

**The deck is now a Hidden deck, and that is a different deck.** Hiding is a cost you pay a turn early in exchange for a card that later costs nothing and can be played at Reaction speed. Four of your forty cards work that way. The whole of §3 and §4 is about doing it correctly, because doing it carelessly loses cards for free.

**The one rule that still governs everything.** Voidreaver pays XP only when you **win** a combat — you are the *only* player with units left at that battlefield (rule 466.3). A mutual wipe, an even trade, or attackers bouncing off survivors are all **No Result**, and No Result pays nothing. **An even trade is still a failure here.** The Hidden package does not change that; it changes how cheaply you can rig the fight.

**Five facts about Hidden you must have straight before you sleeve this.**

| | |
|---|---|
| To hide | Your turn, **Open State**, pay `[A]`, at a battlefield **you already control** (§811.1.b) |
| One per battlefield | The Facedown Zone holds **one card** (§107.3.b) |
| When you can flip it | **The next turn**, not this one — and from then on it has **Reaction** and costs **0** (§811.1.b) |
| Where the unit lands | **That battlefield.** No choice (§811.1.d.1) |
| If you lose the battlefield | The card is **trashed and revealed** — it does not come back to hand (§107.3.d, §323.7, §421.4) |

**Hiding cannot be answered.** It does not open a chain (§811.1.c.2) and it is not playing a card (§811.1.c.1), so no counterspell, no Legion trigger, no response. The card simply becomes a facedown object your opponent can see the back of.

**The trap that will cost you games.** A hidden permanent's play effect reads its battlefield **off the source**. Bounce the source in response to its own trigger and that read returns null, the target cannot be confirmed, and the instruction is **ignored** (§359.3.e.12, §359.3.f.2.a, and the recorded Kennen ruling). Evelynn is 2 Might, Tideturner is 2, Pyke is 3 — **all three sit inside Gust's range**, and Gust is in 14.5% of the archive. §5 is entirely about this.

**Your new best card against big-unit decks is Switcheroo, and it is not close.** Swapping the Might of your smallest unit and their largest is a swing of **twice the gap**. Simulated 2v2 it converts a clean win **93–97% of the time against every archetype measured** — including Jayce at 97%, where Punch First manages 49%. Punch First decays as their units grow; Switcheroo *scales with it*.

**Your turn, in order:** activate the legend → buff → develop → **hide** → arrange the fight → *then* move or flip → hold up everything with Action, Reaction or a facedown card. Flipping Evelynn starts a combat, so it comes last, not first (§11).

**Three numbers worth memorising.**

- **Body 10 pips, Chaos 9, three flexible, plus up to four `[A]` for hiding.** The Hidden tax is paid in *any* domain — that is what Pyke's Gold tokens are for (§6).
- **36.3% of opening hands contain a Hidden card**, and you cannot hide on turn one because you do not control a battlefield yet.
- **You still lose most untricked even fights** — 15–61% clean wins with no trick, and under half against eight of the eleven archetypes measured (§7).

**The most common way to lose with this build:** hiding a card at a battlefield you then lose, and handing them a 2-for-0.

---

## The list

Sorted by set number, the way you build it. **Kha'Zix counts toward the 40 but starts outside the shuffled pile**, so you sleeve 39 and set him next to the legend.

| | Card | Number | Cost | Note |
|---|---|---|---|---|
| 2 | Sabotage | OGN-156 | 1E / 1 Body | |
| 1 | Ride the Wind | OGN-173 | 2E / 1 Chaos · Action | |
| 1 | Traveling Merchant | OGN-185 | 2E · 2 Might | **3 → 1** |
| **1** | **Tideturner** | **OGN-199** | **2E · 2 Might · Hidden** | **new** |
| 3 | Punch First | SFD-097 | 1E / 2 Body · Action | |
| 3 | Fizz, Trickster | SFD-140 | 3E / 1 Chaos · 3 Might | |
| **1** | **Switcheroo** | **SFD-145** | **2E / 2 Chaos · Action · Hidden** | **board → main** |
| 3 | Kinkou Initiate | UNL-097 | 3E · 3 Might | **2 → 3** |
| 3 | Irresistible Faefolk | UNL-112 | 2E · 1 Might | |
| 2 | Rengar, Trophy Hunter | UNL-120 | 5E / 1 Body · 6 Might · Ambush | |
| 2 | Star-Crossed | UNL-128 | 3E / 1 Chaos · Reaction | |
| **1** | **Evelynn, Entrancing** | **UNL-141** | **2E · 2 Might · Hidden, Backline** | **new** |
| **1** | **Kha'Zix, Mutating Horror** | **UNL-143** | **4E / 1 Chaos · 4 Might — Champion Zone** | |
| **1** | **Pyke, Returned** | **UNL-145** | **3E · 3 Might · Hidden, Backline** | **new** |
| 2 | Vex, Apathetic | UNL-150 | 4E · 4 Might · Deflect | |
| 3 | Void Assault | UNL-202 | 2E / 1 Power | |
| 2 | Rampage | VEN-083 | 3E (+1 Body optional) | |
| 3 | Shadow Order Disciple | VEN-095 | 2E · 2 Might | |
| 2 | Up from the Deep | VEN-100 | 3E · Flow 3E | **3 → 2** |
| 2 | Tail-Cloaked Matriarch | VEN-104 | 4E · 4 Might · Empower 2E/1 Chaos | |
| 1 | Zed, Without a Sound | VEN-112 | 5E · 5 Might | **2 → 1** |

**Legend** Voidreaver `UNL-201` · **Runes** 6 Body `OGN-126` / 6 Chaos `OGN-166`
**Battlefields** Zaun Warrens `OGN-298` · **Star Spring `UNL-215`** *(replaces Forbidding Waste)* · Sandswept Tomb `VEN-164`

**Sideboard** (10) — 2 Gust `OGN-169` · 1 Sabotage `OGN-156` · 1 Rebuke `OGN-172` *(new)* · 1 Acceptable Losses `OGN-179` · 1 Hard Bargain `SFD-136` *(2 → 1)* · 1 Switcheroo `SFD-145` · 2 Decree of Strength `VEN-085` *(new)* · 1 Ravenbloom Prefect `VEN-102`

**24 units / 16 spells.** Curve: 1E ×5, 2E ×14, 3E ×13, 4E ×5, 5E ×3 — mean 2.68 Energy, down from the previous build. **Sabotage sits at 2 main + 1 board, exactly at the three-copy cap** across the whole deck (§103.2.b); **Switcheroo is 1 main + 1 board**, two of a legal three.

---

## 1. What changed, and why

Jun's update does three separate things, and it is worth keeping them apart because only one of them is the interesting one.

### The Hidden package — four cards in

**Evelynn, Entrancing ×1** `UNL-141` · 2E · 2 Might · Hidden, Backline
> *When you play me from face down on your turn, you may move an enemy unit at a different location to my battlefield.*

**Pyke, Returned ×1** `UNL-145` · 3E · 3 Might · Hidden, Backline
> *Once each turn, when an enemy unit dies while I'm at a battlefield, play a Gold gear token exhausted. (It has "[Reaction][>] Kill this, `[E]`: [Add] `[A]`.")*

**Tideturner ×1** `OGN-199` · 2E · 2 Might · Hidden — **errata'd**, current text:
> *When you play me, you may choose a unit you control at another location. Move me to its location and it to my original location.*

**Switcheroo ×1** `SFD-145` · 2E / 2 Chaos · Action, Hidden
> *Swap the Might of two units at the same battlefield this turn.*

These are not fringe cards. Across the 1,226-deck archive, **Tideturner is the third most-played Hidden card in the format at 19.0%**, Switcheroo the sixth at 11.3%; Evelynn is in 4.5% of decks and Pyke in 3.6%. **83% of all archived decks run at least one Hidden card.** Nor is this new to the archetype: **six of the fourteen archived Voidreaver lists already run at least one Hidden card** — two on Evelynn, two on Switcheroo, one on Tideturner, none on Pyke. What is unusual is running all four at once, and building the battlefield around them.

### The battlefield swap

**Forbidding Waste → Star Spring.**

> **Forbidding Waste** `UNL-210` — *While a unit here is defending alone, it has -2 `[M]`.*
> **Star Spring** `UNL-215` — *The first time a player plays a non-token unit here each turn, they may move another unit they control here to its base.*

Forbidding Waste was a weapon against an isolated defender and a liability whenever the lone defender was yours. Star Spring is a **free copy of your legend's two-XP walk-home ability**, once per turn, triggered by exactly the thing you now do every turn: play a unit at that battlefield. It is in 6 of the 14 archived Voidreaver lists (43%), second only to Forbidding Waste at 9 — so the archetype is already split on exactly this choice.

Two details that make it better than it reads. It has **no exhaustion requirement**, where the legend's ability does (*"move an **exhausted** friendly unit"*) — so Star Spring can rescue a ready unit the legend cannot touch. And the move it grants **is a move**, so it triggers *"when I move"* abilities: Traveling Merchant loots, Shadow Order Disciple can Burn for +1. It does **not** trigger Irresistible Faefolk, whose text is *"when I move **to a battlefield**"* and this is a move to base.

It is symmetric — your opponent gets their own first-time-each-turn trigger there. Against a deck that wants its units at battlefields, that is close to irrelevant; against Rek'Sai, who wants units returning home, read it before you choose it.

### The trimming

| | was | now | what it means |
|---|---|---|---|
| Onslaught | 1 | **0** | The +6 is gone. It cost 4 Energy, carried no Action keyword, and sat outside Fizz's rebuy range. Switcheroo replaces it as the big swing and is strictly better at the job (§4). |
| Traveling Merchant | 3 | **1** | The deck's repeatable selection is nearly gone. This is the change I like least, and §15 is where I would put copies back. |
| Up from the Deep | 3 | **2** | One fewer pair of Tentacles. Flow 3E means the copies you draw are effectively worth more than one card each, which is the argument for going to two. |
| Zed, Without a Sound | 2 | **1** | 5 Energy in a deck whose mean cost fell to 2.68. |
| Kinkou Initiate | 2 | **3** | The one that went up. A 3-Might body that replaces itself, and the extra cheap bodies make its *"other units have total Might 5 or more"* condition easier to meet. |
| Hard Bargain (board) | 2 | **1** | |
| Unyielding Spirit, Angler Beast (board) | 1, 1 | **0** | |
| Decree of Strength (board) | 0 | **2** | A Mind-domain Sabotage. Structurally dead against nine of the eleven archetypes in §13 — see §14 before you board it in. |
| Rebuke (board) | 0 | **1** | 2E / 2 Chaos, **Action**, returns *any* unit at a battlefield to hand. Gust with no Might cap and no Reaction timing. |

**What the trimming costs you in one sentence:** the deck has traded one large Main-Phase pump and two loot bodies for four cards that cost nothing on the turn you use them, and it is now a deck about *timing* rather than about *size*.

---

## 2. The rule that governs the deck

Unchanged from the previous build, and still the first thing to have straight.

> **466.3.** Determine the result of combat. A player holding a designation wins if they are the only player with units remaining at that battlefield. It is **No Result** if the attackers were recalled, if both players still have units there, or if neither does.

Voidreaver reads *"When you win a combat, gain 1 XP."* So:

- You attack, kill everything, keep a unit → **win**, 1 XP.
- You attack, kill everything, lose everything → **No Result**, 0 XP. The battlefield goes Uncontrolled (§466.5.b).
- You attack, they survive → your attackers are **recalled** (§466.1.a.2) → **No Result**, 0 XP.
- **They** attack you, you kill everything and keep a unit → **win**, 1 XP. Defending pays exactly the same as attacking.

That last line is the one the Hidden package leans on. **Evelynn makes you the defender of a combat you chose** (§4), and defending is cheaper: your units are not recalled, and a fight you merely survive costs you nothing but the turn.

**What the legend can and cannot do**

| | |
|---|---|
| Gains XP | Every combat you win — no limit per turn, no cost, automatic |
| Spends XP | **Once per turn** (it exhausts), and **only in your own Main Phase, in an Open State** |
| 1 XP | `[Buff]` a unit: permanent +1 Might, **one buff per unit at a time** (§702.3) |
| 2 XP | Move an **exhausted** friendly unit from a battlefield to its base |
| Never | Mid-combat, mid-showdown, or on their turn at all (§381) |

Voidreaver has no Action or Reaction keyword. The Vendetta FAQ states it plainly for the same shape of card: *"Abilities can only be used in your Main Phase, outside of a showdown, unless they have the Action or Reaction keyword."* **Once a showdown opens, your legend is switched off for the rest of the turn.** That is why the sequencing in §11 puts the activation first and not fifth.

**Kha'Zix is free.** He starts in the Champion Zone and is playable from there as normal (§108.3.d). You have him every game, from turn one, with no draw required. One copy is correct, not an oversight.

---

## 3. Hidden, precisely

This is the section the update exists for. Read it once properly and the four cards play themselves.

### What hiding is

> **811.1.b.** It is functionally short for *"While this card is in your hand or in your Champion Zone on your turn during an Open State, you may pay `[A]` to hide this facedown at a battlefield you control that doesn't already have a facedown card hidden there for as long as you control that battlefield. Beginning on the next turn, this gains [Reaction] and you may play this, ignoring its base cost."*

Unpack that into the five things it actually constrains.

**1. Timing: your turn, Open State.** Not during a showdown, not during a combat, not on their turn. Hiding is a Discretionary Action (§421.2), so it lives in the same window as your legend activation and your standard moves.

**2. Cost: `[A]` — one Power of any domain.** You pay it by **recycling a rune**, which sends that rune to the bottom of your Rune Deck and shrinks your board by one until you channel it back. You channel 2 a turn (§315.3.b), so **a hide costs you half a turn of ramp.** It is the cheapest thing in the deck in Energy and the most expensive in tempo.

**3. Prerequisite: a battlefield you already control.** The FAQ says it outright: *"you must already control a battlefield (have units there) to hide the card at."* Control is having units there and having established it (§190.4). **You cannot hide on turn one.** The earliest realistic hide is turn two: move a unit to an open battlefield, the non-combat showdown closes with you taking control (§348.2.a — that is a Conquer, 1 point), then hide in the same Main Phase.

**4. Capacity: one card per battlefield.** *"Each Facedown Zone has a maximum occupancy of one card"* (§107.3.b). In a 1v1 there are only two battlefields on the table (§485.4), and you will rarely control both, so **in practice you have one facedown slot at a time.** Four Hidden cards competing for one slot is the real deckbuilding constraint here, and it is why one copy of each is right rather than three of one.

**5. Delay: next turn, not this turn.** *"Beginning on the next turn."* The FAQ confirms: *"You can't play cards the same turn you hide them."*

### What hiding buys

**It costs nothing to play afterwards.** *"You may play this, ignoring its base cost"* — 0 Energy, 0 Power. Switcheroo's 2 Energy and 2 Chaos Power vanish. Pyke's 3 Energy vanishes.

**It gains Reaction.** §811.6: *"A card that is Hidden gains Reaction while facedown or played from facedown."* That is the full Reaction permission — showdowns, closed states, anyone's turn. And per the FAQ, *"You can play them any time you can normally play a reaction, which includes when you're not actually reacting to anything. You're not restricted to playing them during showdowns at their own battlefield."*

**It cannot be answered.** Hiding does not open a chain (§811.1.c.2) and hiding is not playing (§811.1.c.1) — so it dodges counterspells entirely, and it does not turn on Legion for anybody. The opponent sees a facedown card appear and learns nothing except that it exists. *Playing* from facedown does open a chain (§811.1.c.3), and that chain is answerable like any other.

**The property is private.** §811.6.a: *"The property is granted to the card in its facedown state, and is not publicly known."* Facedown Zones are public but the card in them is private (§107.3.f) — only you may look.

### The three restrictions when you flip it

> **811.1.d.** Some choices made while playing a card from Hidden are restricted to the battlefield where it was hidden. A card cannot be played from Hidden if it is a spell with no valid targets under these restrictions.

**a. A hidden permanent must be played to that battlefield** (§811.1.d.1). No choice. This overrides gear's normal base-only restriction (§811.1.d.1.a), and it is the reason a hidden unit is always exposed to whatever can reach a battlefield.

**b. Each target must be chosen from among options at that battlefield** — *"unless the ability explicitly restricts targeting in a way that makes this impossible"* (§811.1.d.2). And crucially, **each target is judged separately** (§811.1.d.2.a): one target on a card can be pinned to the battlefield while another on the same card is free.

**c. If the card causes you to play a unit, that unit goes to that battlefield too** (§811.1.d.3).

**And nothing else is restricted.** §811.2 is explicit: *"Abilities and instructions of hidden cards other than the choices listed above function as normal."* The Vendetta FAQ restates it as *"Only effects that choose are restricted."* A hidden card's non-choosing text works normally, everywhere.

### Where each of your four sits

| Card | Pinned to the hide battlefield? | Why |
|---|---|---|
| **Switcheroo** | **Yes — both units** | Nothing in its text restricts targeting elsewhere, so §811.1.d.2 pins both. It wants two units at one battlefield anyway; the rule just decides *which* battlefield. |
| **Tideturner** | **No** | §811.1.d.2 uses Tideturner as its own worked example: *"Because its play effect has a targeting restriction that can never be fulfilled by a unit at its battlefield, its target may be chosen freely."* **He** still lands at the hide battlefield under 811.1.d.1. |
| **Evelynn** | **No** | *"an enemy unit **at a different location**"* — the same exception, for the same reason. She lands at the hide battlefield. |
| **Pyke** | n/a | He has no play effect and chooses nothing. He simply lands at the hide battlefield. |

### The cost of being wrong about the battlefield

> **107.3.d.** If a player loses Control of a Battlefield, any cards in the Facedown Zone associated with that Battlefield are removed during the next Cleanup.
> **323.7.** Remove all Hidden cards from all Battlefields that are not controlled by the same player and place them in their owner's Trash.
> **466.5.c.** Remove all Hidden cards from this Battlefield that do not share a controller with the Battlefield.
> **421.4.** If a facedown card would change zones or if the game ends, its owner reveals it to all players.

**Four things follow, and they are the whole risk profile of this package.**

1. Lose the battlefield, lose the card. It goes to your **trash**, not your hand.
2. **A mutual wipe does it too.** If neither player has units left, the battlefield becomes Uncontrolled (§466.5.b) — and an uncontrolled battlefield is not controlled by *the same player* as your facedown card, so §323.7 trashes it. The even trade that already paid you no XP now costs you a card as well. **In this deck the even trade got worse, not better.**
3. You **reveal it** on the way out. They learn what you had, for free.
4. The trash is not nowhere. Evelynn, Pyke and Tideturner are all within **Tail-Cloaked Matriarch's** rebuy range (Energy ≤ 3, Power ≤ `[A]`), and Switcheroo is within **Fizz's** (Energy ≤ 3, you still pay the 2 Chaos). A trashed facedown card is a setback, not a write-off — but the rebuy plays it from the trash, not from face down, so **Evelynn's play effect does not trigger off a Matriarch rebuy.**

### One more that is easy to miss

**A facedown card is a legal target.** The Vendetta FAQ: *"A facedown card at a battlefield can be a target, because while the card's face is Private information, its presence as a facedown card in that zone is Public."* In this format that matters mostly for **Pack of Wonders** (`OGN-181`, 2.3% of the archive), which returns a *friendly* facedown card to hand — so it is a card that rescues your hidden cards, not one that kills them. There is no meaningful facedown-hate deck in the archive. The way your hidden cards die is by losing the battlefield, and only that.

---

## 4. The four Hidden cards, and how to use each

### Evelynn, Entrancing — the card the build is for

> *[Hidden] · [Backline] (I must be assigned combat damage last.) · When you play me **from face down on your turn**, you may move an enemy unit **at a different location** to my battlefield.*

**Read the trigger condition first.** *"When you play me from face down on your turn"* — the conditional sits immediately after the trigger, which makes it part of the **condition**, not the effect (§383.2.a.1). So the ability does not even go on the chain unless both halves are true. **Evelynn played from hand does nothing. Evelynn flipped on their turn does nothing.** She is a 2-Energy 2/2 with Backline, and that is all.

That is unusually demanding, and it is why she is the card that most rewards knowing the rules: **there is exactly one way to get value out of her, and you have to set it up a turn in advance.**

**What she does when you do it right.** In your Main Phase, for free, she drags a lone enemy unit from anywhere on the board to your battlefield. Then:

- That unit arrives at a battlefield its controller does not control, which **applies Contested** (§190.3.a.1).
- **§464.2.c.1: "The Attacker is the player whose unit(s) applied the Contested status."** Their unit applied it. **They are the attacker. You are the defender.**
- If Kha'Zix is at that battlefield, his trigger reads *"When I attack **or defend**, if an enemy unit is alone here, give me +2 `[M]` this turn and **gain 2 XP**."* One dragged unit with no friends there is **alone** (§740.2.a: no other *friendly* unit at the same location). The trigger fires on defence exactly as it does on attack.
- If you win the fight, that is **another** XP from the legend. Kha'Zix's 2 plus the win's 1 is **3 XP from a card that cost you one rune, last turn.**
- If you lose the fight, your attackers are not recalled — you did not attack. If any of your units survive, **their** unit is recalled and it is a No Result (§466.1.a.2). You are out a body, not a battlefield.

**The sequencing rule this creates, and it is absolute.** Flipping Evelynn ends your ability to do anything else. Her trigger resolves, the chain empties, a Cleanup runs, Contested is applied, combat is staged, and it opens because you are in a Neutral Open state (§323.9–§323.12). **There is no window between the drag and the fight.** So: activate the legend, buff, develop every body you intend to have in the fight, *then* flip her.

**What to drag.** The single best target is a lone enemy unit sitting on a battlefield they control, because taking it away also strips their board there. The second best is a unit at their base — a unit at base is doing nothing, and dragging it into a fight it will lose is a clean two-for-one. Both are "a different location", so both are legal, and §811.1.d.2's exception means you may choose freely rather than from your own battlefield.

**Backline is not decoration.** *"I must be assigned combat damage last"* (§826) — she is assigned lethal only after every one of your units without Backline. At 2 Might in a defensive fight she survives anything that does not have the damage to spare, which means the unit that set up the fight is usually still there to hold the battlefield afterwards.

### Tideturner — free Reaction-speed reinforcement

> *[Hidden] · When you play me, you may choose a unit you control at another location. Move me to its location and it to my original location.* **(errata'd — see §12)**

He lands at the hide battlefield (§811.1.d.1), then swaps places with any unit of yours elsewhere. His original location *is* that battlefield, so **the unit you choose arrives there and Tideturner leaves.**

**What that actually is: a free, 0-cost, Reaction-speed way to put a big unit into a fight.** Hide Tideturner at your battlefield. They attack it. Mid-showdown, flip him: he enters, then swaps with **Rengar at your base**, and a 6-Might body is suddenly a defender. A unit that becomes present after designations are handed out gains its designation in the following Cleanup (§464.2.c.3.a) and its attack or defend trigger *does* fire, because that is its first time gaining the designation (§383.4.e).

Compare the two ways to get Rengar into a fight at Reaction speed. **Ambush** costs 5 Energy and a Body rune and requires you to have units there. **Tideturner** costs a rune paid last turn, and works with a Rengar already on the board that you cannot otherwise move (he exhausted to get to base, or he has already moved this turn). **These stack** — Tideturner brings the Rengar you already have, Ambush brings the one in hand.

Three more uses worth having in mind:

- **He is not restricted to reinforcing.** Swap him with a unit that is *about to die* in a fight you have lost. The unit goes to Tideturner's battlefield and Tideturner goes to theirs — read which way the swap runs before you commit; it moves both, and it is not a recall.
- **The move he performs is a move**, so both Shadow Order Disciple (*"when I move, you may Burn 1 for +1 Might"*) and Traveling Merchant (*"when I move, discard 1, then draw 1"*) trigger. Irresistible Faefolk does **not** — her text is *"when I move **to a battlefield**"*, and Tideturner's swap sends him to wherever the chosen unit was, which may be your base.
- **He does not exhaust anybody.** Effect-based moves are not standard moves; the exhaust cost in §144 belongs to the standard move alone. A unit that arrives by Tideturner is ready and can still use an `[E]` ability if it has Action or Reaction.

### Pyke, Returned — the card that pays the Hidden tax

> *[Hidden] · [Backline] · Once each turn, when an enemy unit dies while I'm at a battlefield, play a Gold gear token exhausted. (It has "[Reaction][>] Kill this, `[E]`: [Add] `[A]`.")*

**This is a rune engine, and it is specifically the engine for this package.** Every hide costs `[A]`. Every Gold token *is* an `[A]`. Pyke turns each turn in which you kill something into one free hide.

Four details.

1. **The trigger does not require the death to be at his battlefield.** *"When an enemy unit dies while I'm at a battlefield"* — the location condition is on **Pyke**, not on the dying unit. Kill something anywhere while Pyke stands on any battlefield and you get the token.
2. **Once each turn.** A combat that kills three of their units still makes one token.
3. **The token enters exhausted**, and its ability costs `[E]` — exhausting it. An exhausted permanent cannot pay `[E]` (§414.1.b). **So the token is usable from your next Awaken, not the turn it appears.** Plan a turn ahead, the same way you plan the hide itself.
4. **The token's ability has Reaction**, so once it is ready you can crack it at any moment you are asked to pay — including mid-payment of a cost, with no priority, and it resolves the instant it finalizes without passing priority (§429.2, §429.3, §444.2.c). It is a Power you can always produce.

**Pyke himself is a fine body.** 3 Energy, 3 Might, Backline. Hidden makes him free. He is the one of the four whose flip is never a decision about targets — he is just a body that arrives at Reaction speed for nothing, which is exactly what you want mid-showdown when the fight is one point of Might away.

**Where he wants to stand:** the battlefield you intend to keep. His engine only runs while he is at a battlefield, and Backline keeps him alive while it does.

### Switcheroo — the biggest swing in the deck

> *[Hidden] · [Action] · Swap the Might of two units at the same battlefield this turn.*

**The arithmetic.** Let your total be `M`, theirs be `T`, the unit of yours you swap be `m`, and theirs be `t`. After the swap your total is `M − m + t` and theirs is `T − t + m`, so the gap moves by **2 × (t − m)**. Swap your smallest into their largest and you get **twice the gap** in one card.

That is why it behaves so differently from a pump. **Punch First's +5 is a constant; Switcheroo's swing grows with their units.** Against Jayce, whose units average 5.42 Might against your 3.04, swapping a 1-Might Faefolk for a 7-Might unit is a **12-point** swing.

Simulated 2v2 against real archetype Might distributions (method in §7):

| | Kennen | Master Yi | Azir | Jayce | Rengar | Rek'Sai |
|---|---|---|---|---|---|---|
| no trick | 39% | 46% | 27% | **15%** | 39% | 55% |
| + Punch First | 91% | 91% | 86% | **49%** | 88% | 97% |
| + **Switcheroo** | **96%** | **96%** | **94%** | **97%** | **96%** | **95%** |

**Read the Jayce column.** Punch First gets you to 49%; Switcheroo gets you to 97%. The previous dossier's conclusion — *"against big-unit decks the lever is removal, not Might"* — was right about Punch First and is no longer the whole story. **Switcheroo is the answer to the two matchups this deck could not previously fight.**

Three things to watch.

- **From Hidden, both targets are pinned to the hide battlefield** (§811.1.d.2 — nothing in its text restricts targeting elsewhere). Since the card requires two units at one battlefield anyway, that only bites when the fight you want to affect is happening somewhere else. **A hidden Switcheroo is a defensive card.** For an attack, you cast it from hand for 2E / 2 Chaos.
- **Lethal is non-zero.** Swapping a unit down to 1 Might does not kill it; it still needs 1 damage marked (§142.4.b). And swapping down to 0 leaves a unit that **cannot die to damage at all** without something assigning it at least 1.
- **Sandswept Tomb discounts it.** *"Each spell that chooses one or more units here that are friendly to it costs `[A]` less."* Switcheroo chooses one of yours, so cast from hand at Sandswept Tomb it is 2E / **1** Chaos.

---

## 5. The trap: removed in response

**This is the single most important rules interaction in the build, and it is the one the published rules do not state in one place.**

The repo carries the ruling: [*A Hidden permanent removed in response to its own play effect loses the target*](../docs/rules-rulings.md), from Riot dev/design relayed through judge channels on 17 September 2026. Quoting the answer:

> …the play effect itself doesn't contain the information of what battlefield its source was played from; it has to reference that information from its source itself. If the source is no longer on the board to have its information referenced (per 359.3.e.12), the triggered ability can't confirm that the target in question is at the correct battlefield, and thus that target will not be legal.

**The general shape.** A triggered ability normally outlives its source — the ability on the chain is not the card, and its instructions still execute (§204.3.a, §359.3.f.3). What does *not* survive is **information read off the source**:

> **359.3.e.12.** If an instruction checks information about a card whose location, zone, or status has changed such that that information is no longer available, the check returns null and everything computed from it is ignored.
> **359.3.f.2.a.** When a referent checks information on execution of the instruction related to a target, and that target isn't legal, that referent will return "null" and all instructions related to it will be ignored.

**Applied to your cards.**

**Evelynn.** Her effect is *"move an enemy unit at a different location **to my battlefield**."* Both halves read off her: *"a different location"* is different from *hers*, and *"my battlefield"* is a referent in the §359.3.f.1 sense (*"recognized by the presence of words like 'here,' 'my,' or 'its'"*), checked on execution (§359.3.f.2). Bounce her in response to the trigger and there is no location to be different from and nowhere to move the unit to. **Nothing moves.** You have spent a card and a rune and produced a 2/2 in your hand.

**Tideturner.** Same shape: *"Move me to its location and it to **my original location**."* Remove him and the destination is null.

There is a genuine tension in the rules here worth knowing, because it is the kind of thing a judge will be asked. §359.3.f.2 checks referents **on execution**, which gives the null; §359.3.f.3 freezes information taken **from the trigger condition** when the trigger fires, which would preserve it — that is the Lillia case, *"when I move from a location, play a token **there**."* Tideturner's word is *"original"*, which reads like a referent to me rather than trigger-condition information, and the recorded ruling resolves the identical shape for Kennen the same way. **Play as though it does not work, and call a judge if a match hinges on it.** The practical answer does not change either way: do not flip him into open Reaction mana you have not accounted for.

**Pyke and Switcheroo are not exposed.** Pyke has no play effect. Switcheroo chooses both targets at play time and reads nothing off itself — it is a spell, and a spell on the chain is not a permanent that can be bounced.

### Why this bites this deck specifically

> **Gust** `OGN-169` — *[Reaction] Return a unit at a battlefield with 3 `[M]` or less to its owner's hand.*

**Evelynn is 2 Might. Tideturner is 2. Pyke is 3.** All three are inside Gust's range, and Gust is in **14.5%** of the archive. **Star-Crossed** (24.5%) and **Retreat** (10.6%) are Reaction-speed too; **Rebuke** (8.2%) is Action-speed and has no Might cap. **50% of all archived decks carry at least one bounce effect and 38% carry one at Reaction speed.**

And Hidden makes it worse, for the reason the recorded ruling spells out: **from hand you could have played Evelynn to your base, where Gust cannot reach her. From Hidden you cannot.** §811.1.d.1 makes the battlefield compulsory. *Hidden removes the safe option.*

**What to do about it.**

1. **Count their open runes before you flip.** A flip is free, which makes it feel free to do at a bad moment. It is not: the card is the cost.
2. **Flip into a tapped-out opponent**, or after they have spent their Reaction on something else. Your Void Assaults and your standard moves are the bait.
3. **Prefer their turn for Pyke and Tideturner** — Pyke has nothing to lose, and Tideturner mid-combat is usually flipped when they have already committed.
4. **Prefer your own Main Phase for Evelynn**, because you have no choice; her trigger requires it. Accept that she is the most exposed of the four and hide her when you have a reason, not because the slot is empty.
5. **Board in Hard Bargain** against the decks that hold up Gust. It is the one card that protects the flip, and §14 covers when it is worth the slot.

---

## 6. The rune math, and the `[A]` tax

Your Rune Deck is **6 Body / 6 Chaos**, unchanged. The demand it serves did change.

**Mandatory pips in the main deck:**

| Domain | Pips | Where |
|---|---|---|
| **Body** | **10** | Punch First ×3 @ 2, Sabotage ×2 @ 1, Rengar ×2 @ 1 |
| **Chaos** | **9** | Fizz ×3 @ 1, Star-Crossed ×2 @ 1, Switcheroo ×1 @ 2, Kha'Zix @ 1, Ride the Wind @ 1 |
| Either | 3 | Void Assault ×3 @ 1 — it is Body/Chaos, so its `[C]` reads as either (§135.2.e.6) |
| **Any** | **up to 4** | **Hiding: Evelynn, Pyke, Tideturner, Switcheroo** |
| Optional | 2 | Rampage ×2's additional Body cost |

**Chaos demand rose from 7 to 9** — entirely Switcheroo's two pips. That is the one card in the deck that wants two Power of one colour, and it is the reason to remember the Sandswept Tomb discount.

**The new line in that table is the important one.** The Hidden tax is paid in `[A]`, *any* domain. It never competes with Punch First for a Body rune or with Fizz for a Chaos one — it takes whichever rune you were least going to use. In practice that is a Body rune on a Chaos turn and vice versa, which is why the tax is much cheaper than four extra pips would suggest.

**The formula, restated because it decides every turn.** To cast something costing **E** Energy and **P** Power you need

```
max(E, P) runes on the board, at least E of them READY
```

Exhausting a rune for Energy and recycling it for Power are different costs — recycling does not require the rune to be ready — so **the same rune can pay Energy and then Power in the same turn** (§164.2). What recycling costs you is next turn's board.

**Three ways this deck refills the Power it spends hiding:**

- **Pyke's Gold tokens** — one per turn on a kill, usable from the following Awaken, `[Add] [A]`. Purpose-built for the tax.
- **Channelling.** 2 a turn. A hide is half a turn of it.
- **Not hiding.** The slot holds one card. If the facedown slot is occupied, the tax is zero for that turn.

**A cheap turn-two line worth knowing.** Move a 2-Energy unit to the open battlefield (that is a Conquer and 1 point when the non-combat showdown closes, §348.2.a.1), then recycle one rune to hide. You end the turn with three runes instead of four and a point on the board, and next turn a free card.

---

## 7. How combat resolves, and the clean-win maths

**Combat is never declared.** It happens on its own in a Cleanup, at a Contested battlefield where opposing units are both present, the chain is empty and no other fight is running (§460, §323.9). You start a fight by *moving somewhere* — or, now, by *dragging something to you*.

**There is no blocking and no pairing off.** Each side sums the Might of all its units and assigns that whole total across the other side's units. The attacker assigns first (§465.2.c), and cannot overkill:

> **465.2.c.4.** Units cannot have more damage assigned to them than the minimum required to constitute lethal damage unless no further units remain to have damage assigned to them.

That rule is a resource: a 1-Might Tentacle absorbs exactly one point and no more.

**Backline changes who absorbs it.** §826: a unit with Backline must be assigned lethal **after** every one of your units without it. **Evelynn and Pyke are your two Backline units**, and in a defensive fight that is genuine protection — they are the last things to die, which means they are usually the things still standing when the attackers are recalled and you hold the battlefield.

**The condition, collapsed:**

> **You win outright exactly when your Might total exceeds theirs.**

Kill all of theirs needs your total ≥ theirs; they kill all of yours if their total ≥ yours; so a clean win is strictly greater. Stun changes the second half only — a stunned unit contributes no Might to damage but still needs its full Might to die (§423.1.b–c).

### The table

Monte Carlo, 200,000 trials, **two of your units against two of theirs**, drawn from your actual unit Might distribution (24 units, mean 3.04, median 3) and from each archetype's real distribution in `data/decks.json`.

| | no trick | + Punch First | **+ Switcheroo** | + Vex stun | isolated 2v1 | isolated + Kha'Zix |
|---|---|---|---|---|---|---|
| Kennen | 39% | 91% | **96%** | 53% | 82% | 95% |
| Akali | 43% | 91% | **96%** | 56% | 83% | 95% |
| Master Yi | 46% | 91% | **96%** | 58% | 82% | 95% |
| Irelia | 61% | 98% | 95% | 74% | 92% | 99% |
| Rengar | 39% | 88% | **96%** | 51% | 81% | 94% |
| **Azir** | **27%** | 86% | **94%** | 37% | 76% | 96% |
| Fiora | 38% | 92% | **95%** | 52% | 84% | 96% |
| **Jayce** | **15%** | **49%** | **97%** | 21% | 56% | 71% |
| Rek'Sai | 55% | 97% | 95% | 68% | 89% | 98% |
| Vex (Gloomist) | 55% | 94% | **96%** | 67% | 87% | 96% |
| Diana | 39% | 92% | 93% | 53% | 83% | 96% |

**Five things follow.**

**You still lose most untricked even fights.** 15–61%, and under 50% against eight of the eleven. Patience is arithmetic, not temperament.

**Punch First is still the workhorse and still decays.** +52 points against Kennen, +34 against Jayce, because +5 stops mattering once their average body is bigger than your best one.

**Switcheroo does not decay.** It is 93–97% across the board and it is *best* where Punch First is worst. One copy is not enough of a card this good; §15 argues for the second.

**Isolation is still the plan.** Their one unit alone against two of yours is **76–92%**, and **94–99%** once Kha'Zix adds his +2 — against everyone except Jayce, who sits at 56% and 71%. That is what Void Assault ×3, Irresistible Faefolk ×3 and now Evelynn buy — **seven cards that choose where the fight happens**, up from six.

**Azir and Jayce remain the hard boards** at 27% and 15% bare, and Jayce is the one archetype where even the isolation line only reaches 71%. Against Jayce, Switcheroo is not a nice-to-have, it is the plan.

**One caveat on the Azir row.** Those 37 decks contribute only 97 units between them — Azir lists are thin on bodies by construction. The distribution is real but the sample behind it is small, and I would not bet a sideboard slot on the second decimal.

---

## 8. Card by card

### The isolation package — seven cards that choose the fight

**Kha'Zix, Mutating Horror ×1** (4E / 1 Chaos / 4 Might, Ambush) — *"When I attack or defend, if an enemy unit is alone here, give me +2 `[M]` this turn and gain 2 XP."*
The whole deck's reason for existing. **Alone** means no other unit *friendly to it* at that location (§740.2.a) — their unit, by itself, whatever else you have there. The trigger checks its condition once per combat, at the moment designations are handed out (§383.4.e.2.a); if they are not alone at that instant it never fires that combat. Ambush lets him arrive at Reaction speed to a battlefield where you have units, and the permission is re-checked through finalization — if there are no units at all there by the time it completes, Ambush no longer authorises the play (§822.3).

**Void Assault ×3** (2E / 1 Power) — *"Move a friendly unit, then move an enemy unit."*
Still the deepest card in the deck: it makes the fight, chooses which of their units is in it, and decides who attacks. Note the parenthetical — *if they both move to a battlefield you don't control, you're the attacker*. It has **no Action keyword**, so it is Main-Phase setup and cannot be held up.

**Irresistible Faefolk ×3** (2E / 1 Might) — *"When I move to a battlefield, you may move an enemy unit to that battlefield."*
A 1-Might body that drags. Read the trigger precisely: **"when I move to a battlefield"**, not "when I move". Moving her home to base does nothing, and neither does Star Spring's move or a Tideturner swap that lands her at base.

**Evelynn, Entrancing ×1** — §4. The only one of the seven that makes you the **defender**.

### The Hidden package

Covered in full in §4. In list terms: **Evelynn ×1, Pyke ×1, Tideturner ×1, Switcheroo ×1** — four cards, one facedown slot, 36.3% of opening hands contain at least one.

### The bodies

**Shadow Order Disciple ×3** (2E / 2 Might) — *"When I move, you may [Burn 1] to give me +1 `[M]` this turn."*
The cheapest way to add Might to a fight, and it triggers on **any** move, including Star Spring's walk home and a Tideturner swap. Burn puts the top card of your deck in your trash (§440), which is a cost in a deck with **two** Flow cards and two Matriarchs — you are filling the resource, not spending it. It **can** burn you out (§440.4).

**Kinkou Initiate ×3** (3E / 3 Might) — *"When you play me, draw 1 if your other units have total Might 5 or more."*
**"Other units" is board-wide**, not per-location — base and battlefields both count, and Kinkou himself does not. Going to three copies and adding four cheap bodies makes the condition trivial from turn three. The condition sits *after* the trigger, so it is part of the effect and checked on resolution.

**Fizz, Trickster ×3** (3E / 1 Chaos / 3 Might) — *"When you play me, you may play a spell from your trash with Energy cost no more than 3, ignoring its Energy cost. Then recycle it. (You must still pay its Power cost.)"* **(errata'd — §12)**
With Traveling Merchant down to one, Fizz is the closest thing to selection this deck has left. It does not dig; it turns a dead spell in the trash into a live one for its Power cost alone. **Switcheroo is in range** (2 Energy) — you still pay the 2 Chaos, and at Sandswept Tomb only 1.

**Traveling Merchant ×1** (2E / 2 Might) — *"When I move, discard 1, then draw 1."*
Down from three. At one copy it is no longer a plan, but it is still the best partner Star Spring has: flip a unit at Star Spring, walk the Merchant home, loot. Discard-then-draw is a real order — you may discard the card you are about to replace.

**Tail-Cloaked Matriarch ×2** (4E / 4 Might, Empower 2E/1 Chaos) — *"When I become [Empowered], you may choose a unit in your trash with Energy cost no more than 3 and Power cost no more than `[A]`. Play it to your base, ignoring its cost."*
The trash rebuy, and now it has four more targets: **Evelynn, Pyke and Tideturner all qualify** (2–3 Energy, no Power), as do Fizz, Kinkou, Disciple, Faefolk and the Merchant. Kha'Zix at 4 Energy does not. Empowered is permanent until the card leaves the board (§442), and Empower may only be activated while not already Empowered (§827.1.c.1). **The rebuy plays to your base and is not "from face down", so Evelynn's trigger does not fire.**

**Vex, Apathetic ×2** (4E / 4 Might, Deflect) — *"When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn."*
Read her narrowly: she triggers on a **unit being played**, not on one moving. Deflect makes opponents pay `[A]` more per time they choose her with a spell or ability (§809), which is often enough to price a removal spell out of reach entirely.

**Rengar, Trophy Hunter ×2** (5E / 1 Body / 6 Might, Ambush) — *"I can [Ambush] to a battlefield where there are enemy units, even if you don't have units there."* **(errata'd — §12)**
Your biggest body and the only one that can arrive at Reaction speed into a board you do not occupy. **And now Tideturner can fetch the one already on your board**, which is the interaction that makes two copies feel like three.

**Zed, Without a Sound ×1** (5E / 5 Might) — *"When I conquer, play a 0 `[M]` Shadow Clone token to your base… [Action][>] 1E / 1 Chaos: Move me and a Shadow Clone you control to each other's locations."*
Down to one. His activated ability is the deck's **only non-spell Action**, so the clone swap is available mid-showdown. Remember the clone is a **token**: tokens cease to exist in any non-board zone except the chain (§186.1), so bouncing one kills it.

### The spells

**Punch First ×3** (1E / 2 Body, Action) — +5 Might, and the single biggest lever in the deck by clean-win rate. At 2 Power it is permanently out of Defy's reach (§206), so it is the one spell you can always commit into open Power.

**Star-Crossed ×2** (3E / 1 Chaos, Reaction) — returns one of yours and one of theirs to hand. Subtraction is worth roughly double addition for a clean win: it removes their unit's Might from the sum *and* removes a body you must kill. It costs you a body of your own, which is why pointing it at your own Tentacle token is a real line — tokens that leave the board cease to exist (§186.1), so you lose nothing.

**Rampage ×2** (3E, +1 Body optional) — *"Choose a friendly unit and an enemy unit. If you paid the additional cost, give the friendly unit +2 `[M]` this turn. They deal damage equal to their Mights to each other."* The deck's only removal that does not need a combat, and it reaches units at base. No Action keyword.

**Sabotage ×2** (1E / 1 Body) — hand disruption that hits **non-unit** cards. Against 83% of the field it can also take a Hidden card out of their hand before they can hide it — though not once it is facedown.

**Ride the Wind ×1** (2E / 1 Chaos, Action) — *"Move a friendly unit and ready it."* The only card that repositions at Action speed. Readying is what makes it more than a move: a unit that already moved this turn can move again.

**Up from the Deep ×2** (3E, Flow 3E) — two 1-Might Tentacles, and playable again from the trash for its Flow cost, after which it is banished. Flow's banish is a delayed replacement on leaving the chain (§829.1.b.1), so a Flow'd copy that gets countered goes to Banishment rather than to hand.

**Switcheroo ×1** — §4.

### The runes and battlefields

**6 Body / 6 Chaos.** §6.

**Zaun Warrens** `OGN-298` — *"When you conquer here, discard 1, then draw 1."* A free Traveling Merchant trigger every time you take it.

**Star Spring** `UNL-215` — §1. The reason to bring it is that it is a free walk-home the turn you flip a hidden unit.

**Sandswept Tomb** `VEN-164` — *"Each spell that chooses one or more units here that are friendly to it costs `[A]` less."* Punch First for 1E/1 Body, Switcheroo for 2E/1 Chaos, Star-Crossed for 3E/0. In a deck whose Chaos demand just went up, this is the one battlefield that fixes it.

Only **one** of the three is used in any given 1v1 game (§485.4.a), chosen during setup. You register all three and you may not change the registered set between games in constructed (TR §403.4.b).

---

## 9. How the cards combine

### The Evelynn line — three XP for one rune

The reason this build exists. Turn N: control a battlefield, hide Evelynn (`[A]`). Turn N+1: activate the legend, buff whatever needs it, develop every body you want in the fight, put Kha'Zix at that battlefield, **then** flip Evelynn and drag their lone unit in.

What you collect: **Kha'Zix's 2 XP** for an enemy unit alone at his battlefield (the trigger reads *attack or defend*), **+2 Might on him this turn**, **1 XP** if you win the combat, and their unit is dead. You are the defender, so nothing of yours is recalled. Total outlay: one rune, recycled a turn ago.

**Why the order is not negotiable:** the legend switches off once a showdown opens, and flipping Evelynn opens one in the same Cleanup, with no window in between.

### Tideturner → Rengar — the free 6 Might

Hide Tideturner at the battlefield you expect them to attack. When they commit, flip him for 0 at Reaction speed; he enters there, then swaps with Rengar at your base. Rengar gains the Defender designation in the following Cleanup (§464.2.c.3.a) and adds 6 Might to a fight they had already counted. Cost: one rune, a turn ago.

This is strictly additive with Rengar's own Ambush. One Rengar comes off the board, the other out of your hand.

### Pyke → the tax

Pyke at a battlefield, any enemy unit dies anywhere, once a turn: a Gold token. It enters exhausted, readies on your Awaken, and cracks for `[A]` at Reaction speed. **That is next turn's hide, paid for by this turn's kill.** With Pyke online the Hidden package costs you no runes at all.

### Switcheroo → the biggest unit on the table

Their 7-Might threat and your 1-Might Faefolk at the same battlefield is a 12-point swing for one card. From hand it is 2E / 2 Chaos, or 2E / 1 Chaos at Sandswept Tomb, or free from facedown if the fight is at the battlefield you hid it at. **Against Jayce and Azir this is the card you mulligan toward.**

### Star Spring + Traveling Merchant — free loot on the flip

Flip any hidden unit at Star Spring. Its trigger — *the first time a player plays a non-token unit here each turn* — lets you walk another of your units there home to base. Send the Traveling Merchant: *"when I move, discard 1, then draw 1."* You get the hidden card for free, a loot for free, and the Merchant off a battlefield you may be about to lose. **Shadow Order Disciple** also triggers on that move, though +1 Might at base is usually worthless — take the Burn only if you want a specific card in the trash for Fizz or Matriarch.

### Star Spring instead of two XP

The legend's walk-home costs **2 XP** and requires the unit to be **exhausted**. Star Spring costs nothing and does not care. Any turn you flip a unit at Star Spring, you have effectively banked the legend's activation for a buff instead. Over a long game that is the difference between three buffs and one.

### The trash is a resource, and it just got deeper

Four routes out of the trash: **Fizz** (a spell ≤3 Energy, pay its Power), **Matriarch** (a unit ≤3 Energy and ≤`[A]` Power, to your base), **Up from the Deep**'s Flow, and a Burn from Shadow Order Disciple *filling* it deliberately. A hidden card lost to a lost battlefield lands in the trash where two of those four can reach it. That does not make losing the battlefield fine; it makes it survivable.

### Sabotage before they can hide

Sabotage takes a **non-unit** card from their hand. Switcheroo, Zhonya's Hourglass, Hidden Blade, Temporal Breach and Back Off are all non-unit Hidden cards, and all five are top-ten in the field. Taking one pre-emptively is better than answering it later, because **once it is facedown you cannot touch it** — it is private, and nothing in the legal pool meaningfully removes an opponent's facedown card.

### Two things that look like synergies and are not

**Matriarch does not rebuy Evelynn's trigger.** The rebuy plays her to your base from the trash. Her condition is *"from face down on your turn"*. She arrives as a vanilla 2/2 with Backline.

**Faefolk does not trigger off Tideturner or Star Spring.** *"When I move **to a battlefield**"* — a swap that lands her at base, or a walk home, is not that.

---

## 10. Mulligans

Opening hand is **4 cards** from a **39-card** library (§116). You may set aside up to **2**, draw that many, then recycle the set-aside cards to the bottom — one pass, not a redraw (§117).

**Exact hypergeometric, 4 from 39:**

| | rate |
|---|---|
| At least one 2- or 3-Energy unit (16 in deck) | **89.2%** |
| At least one 2-Energy unit (9) | 66.7% |
| At least one **Hidden** card (4) | **36.3%** |
| At least one Void Assault (3) | 28.4% |
| At least one Punch First (3) | 28.4% |

**Monte Carlo, 200,000 hands, against the previous build under the same definition** — a keep being *a 2-Energy unit plus a card that uses it* (Void Assault, Punch First, Faefolk or Evelynn):

| | previous build | **this build** |
|---|---|---|
| Functional keep, pre-mulligan | 46.3% | **50.5%** |
| Functional keep, after one mulligan | 65.9% | **70.1%** |
| No 2-Energy unit at all | 33.4% | 33.4% |
| Spell-flooded (one unit or none) | 21.1% | **17.8%** |

**The list got more keepable**, by about four points, and that is the quiet benefit of the update: twenty-four units instead of twenty-three, and a lower curve.

**Keep** anything with a 2-Energy unit and a way to use it. That is half of all hands and seven in ten after the mulligan.

**Ship** hands with three or more spells and one unit. Every trick in this deck modifies a combat; with no board there is no combat to modify.

**Ship** Rengar-plus-Zed-plus-Matriarch hands with no early body. The top end is unbeatable late and irrelevant on turn two.

**Do not ship a Hidden card to make a marginal keep.** You will see one in only 36% of openers, the whole package runs on having one down early, and **the tempo cost of hiding falls every turn you delay it** — a rune recycled on turn two is back by turn four; one recycled on turn six is a rune you needed.

**Do not ship a Void Assault.** Seven cards choose where the fight happens, you have none in 44% of hands, and you cannot dig for more.

**The test, in one question:** *by turn three, can I see a fight I win outright?* Not a fight I can take — a fight where all of their units at that battlefield die and one of mine lives.

---

## 11. Sequencing — how your turn actually goes

Before your Main Phase, three things happen on their own: you **ready everything** including Voidreaver; you **Hold every battlefield you control**, 1 point each — so last turn's board is what pays you today; then you channel 2 and draw 1. Hold scoring happens in the Beginning Phase, **before** Channel and Draw, so a battlefield you are about to lose is worth taking to the start of your turn.

**Step 1 — activate the legend first.** It is the scarcest thing you own, once per turn, and **the window closes the moment any showdown starts.** Buff, walk an exhausted unit home, or bank — but know that banking spends the turn's activation on nothing.

**Step 2 — buff before you move or flip, always.** A buff applied after the showdown opens is not a legal play.

**Step 3 — develop.** Bodies first. They soak assignment under the no-overkill rule and they stop your threats being *alone*.

**Step 4 — hide.** After developing, before anything that might start a fight. Hiding needs an **Open State**, so it is illegal the moment a showdown is live. Check three things: do you control the battlefield, is its facedown slot empty, and can you afford the rune this turn rather than next.

**Step 5 — arrange, then move or flip.** Moving is what creates combat, and **so is flipping Evelynn.** Drag the lone enemy where you want it, confirm your sum kills *all* of theirs, and only then commit. There is no window between Evelynn's trigger resolving and the combat opening.

**Step 6 — hold up everything with Action, Reaction, or a face down.** Your showdown-legal plays:

| | |
|---|---|
| **Action** | Punch First ×3 · Ride the Wind ×1 · **Switcheroo ×1** · Zed's clone swap |
| **Reaction** | Star-Crossed ×2 |
| **Ambush (Reaction while played that way)** | Kha'Zix ×1 · Rengar ×2 |
| **Facedown** | whatever is in the slot — free, Reaction speed, from the turn after you hid it |
| **No keyword at all** | Rampage · Sabotage · Void Assault · Up from the Deep — Main Phase only, cannot be held up |

**Seven showdown-legal spells, up from six**, plus the facedown slot. That slot is the real gain: it is a card you already paid for, at Reaction speed, that does not cost you a card in hand.

**The one-line version:** *activate, buff, develop, hide, arrange, move or flip, then hold up everything with Action, Reaction or a face down.*

---

## 12. Errata that change your cards

Card text throughout this dossier is `data/cards.json` with `data/errata.json` applied. Three cards in this list are errata'd, and one of the three matters a great deal.

**Tideturner** `OGN-199` — **functional, and it is the reason he is playable from Hidden at all.**
> **Was:** *When you play me, you may choose a friendly unit. Move me to its location and it to my original location.*
> **Now:** *When you play me, you may choose **a unit you control at another location**. Move me to its location and it to my original location.*

The Vendetta FAQ explains the change directly: *"Tideturner is receiving minor errata, both to restrict its targeting to a unit you control and to make sure that it can target a unit at another location under these rules."* Without the words **at another location**, §811.1.d.2 would pin his target to his own battlefield and the card would do nothing from Hidden. With them, the exception applies and the target is free. §811.1.d.2 now uses him as its own worked example.

**Rengar, Trophy Hunter** `UNL-120` — functional.
> **Was:** *I can be played to a battlefield where there are enemy units.*  **Now:** *I can **[Ambush]** to a battlefield where there are enemy units, even if you don't have units there.*

The permission is now explicitly tied to Ambush, which means it carries Ambush's Reaction timing and Ambush's re-check through finalization (§822.3).

**Fizz, Trickster** `SFD-140` — cosmetic. *"Recycle that spell after you play it"* became *"Then recycle it."*

---

## 13. Matchups

**Share figures are actual counts** from the 1,226-deck archive rebuilt 20 September, covering 22 July to 20 September. Two caveats you should carry into every line below.

**The post-ban field is four days old.** Only 506 of those 1,226 decks are dated 18 September or later, and 466 of those are from two days. The post-ban ordering is directionally interesting and statistically thin — Vex/Gloomist leads it at 6.3% having been eighth in Tier 2 the week before. I report both windows and lean on the full one.

**riftbound.gg's Vendetta week 4 tier list (20 September) puts Kha'Zix Voidreaver at Tier 3, rank 4** — sixteenth of the forty-nine ranked archetypes. That is the honest starting position, and the archive agrees: **14 Voidreaver decks out of 1,226, four of them tournament-vouched.** The archetype has ranged between 6 and 18 decks on every day the history file records since 27 August, with no trend in either direction. This is an off-meta deck and the update does not change that.

### Kennen, Heart of the Tempest — Tier 1, 7.2% overall / 4.2% post-ban

Their core: Lightning Rush, Ride the Wind, Traveling Merchant, Star-Crossed, Kennen Storm of Shuriken. A self-milling tempo deck that plays from its trash much as you do, goes wide, and is happy to trade — which costs you XP and costs them nothing.

**Clean win 39% bare, 91% with Punch First, 96% with Switcheroo.** Mean unit Might 3.26.

They lost more to the ban than you did (75% of Kennen lists in the archive ran a now-banned card, against 36% of Voidreaver's) but kept Lightning Rush, so their digging went from six cards to three rather than to zero.

**The Hidden consideration:** Kennen lists carry Star-Crossed at high rates and **Kennen, Keeper of Balance is itself a Hidden card in 5.4% of the field.** Assume a Reaction is up. Flip Pyke, never Evelynn, into open Chaos.

### Master Yi, Wuju Bladesman — Tier 1, 9.0% overall, the most-played legend in the archive

110 decks, 90 of them tournament-vouched. Cheap, wide, Calm/Body, and it lost almost nothing to the ban — 4% of its lists ran a banned card. Mean unit Might 2.97.

**Clean win 46% bare, 91% with Punch First, 82% isolated.** The best raw matchup of the Tier 1 decks for you, because their units are small enough that +5 is decisive.

**Plan:** this is the matchup where going wide beats going tall. Up from the Deep's Tentacles tax their assignment; Kinkou Initiate turns on trivially. Hide **Switcheroo** only if they have a single large unit — against a genuinely flat board it is your worst Hidden card.

### Akali, Rogue Assassin — Tier 1, 4.3% overall / 4.0% post-ban

Fury/Calm, mean Might 3.08, and **zero** of its 53 archived lists ran a banned card — so expect the share to hold or rise. **43% bare, 91% with Punch First, 96% with Switcheroo.**

### Irelia, Blade Dancer — Tier 1, 5.6% overall

Mean Might **2.36**, the smallest board you fight regularly, and **61% bare** — your best matchup on this table. Punch First takes it to 98%. Irelia is Calm/Chaos and was hit hard by the ban: 68% of her archived lists ran a banned card.

**Note the one row where Switcheroo is worse than Punch First** — 95% against 98%. Against genuinely small boards the swap has nothing to swap into. Board it out, keep the pumps.

### Azir, Emperor of the Sands — Tier 2, 3.0% overall / 3.0% post-ban

**27% bare.** Their units average 3.68 Might, median 4, they run very few of them, and they are among the hardest of the common boards to fight straight. Punch First reaches 86%; **Switcheroo reaches 94%.**

**Plan:** do not enter a fight you have not already rigged. Isolation gets you to 76% and isolation-plus-Kha'Zix to 96%. Hide Switcheroo at the battlefield you intend to defend.

### Jayce, Defender of Tomorrow — Tier 2, 3.7% overall / 3.2% post-ban

Mean Might **5.42**, median 5 — the biggest board you will actually have to fight, from only 308 units across 45 lists. **15% bare, 49% with Punch First, 56% isolated, 71% isolated-plus-Kha'Zix.** Every one of those is a losing or coin-flip number.

**And 97% with Switcheroo.** Swapping your 1-Might Faefolk into a 7-Might Jayce unit is a twelve-point swing that no other card in your deck approximates.

**Plan:** this is the matchup the update fixed. Board in the **second Switcheroo**. Keep Faefolk — their small bodies exist to be swapped up. Do not try to win on Might; win on the swap and on Rampage. **Jayce is Mind/Body**, which makes him one of only two archetypes on this page that Decree of Strength can touch — bring both copies.

### Rengar, Pridestalker — Tier 2, 3.6% post-ban

Mean Might 3.33 and effectively untouched by the ban (3% exposure), so expect more of them — they are 2.4% of the full archive but 3.6% of the post-ban window. **39% bare, 88% with Punch First, 96% with Switcheroo.**

### Rek'Sai, Void Burrower — Tier 2, 4.9% overall

Mean Might 2.63, and untouched by the ban. **55% bare, 97% with Punch First** — a good matchup on the numbers. Their Deathknell units *want* to die, so clean wins are harder to convert than the table implies: killing their board is not the same as beating them.

**The one battlefield note in this dossier:** Rek'Sai wants units returning home, and **Star Spring's trigger is symmetric.** Against Rek'Sai, bring Zaun Warrens or Sandswept Tomb instead.

### Vex, Gloomist — Tier 2, 6.3% of the post-ban window

The archetype that jumped hardest after the ban — 3.2% of the full archive, 6.3% of the four days since. Read that gain carefully: only 7 of its 39 archived lists are tournament-vouched. Calm/Chaos, mean Might 2.65. **55% bare, 94% with Punch First.** You play two Vex, Apathetic yourself, so the mirror on that card is worth knowing: Deflect taxes *opponents'* spells, so your Rampage into their Vex costs `[A]` more.

### Fiora, Grand Duelist — Tier 2, 4.3% post-ban

Body/Order, mean Might 3.27. **38% bare, 92% with Punch First, 95% with Switcheroo.** A standard midrange fight decided by whether you can see the trick.

### What you are least built for

The archive still contains ramp lists whose average unit dwarfs anything here. Against a board where minimum lethal is switched off — Elder Dragon's *"any amount of your damage is enough to kill enemy units"* — every line in §7 that depends on cheap bodies taxing their assignment is false. Tentacles stop absorbing, Faefolk stops being a body, and Switcheroo is the only card that still does its job. Answer the enabler by **returning it to hand**, which is what Rebuke is in the board for.

---

## 14. The sideboard

**1 Ravenbloom Prefect · 1 Acceptable Losses · 2 Decree of Strength · 2 Gust · 1 Hard Bargain · 1 Rebuke · 1 Sabotage · 1 Switcheroo**

Ten of ten. Swaps are one-for-one between games, you may change your Chosen Champion, and you may **never** change runes, Legend or battlefields after registration (TR §403.4.b). No sideboarding before game 1 or after a draw.

**Switcheroo ×1** — the most important card in the board, and it should probably not be in the board (§15). In against Jayce, Azir, Rengar and anything with a single large threat. Out against Irelia and flat Master Yi boards.

**Gust ×2** (1E, Reaction, returns a unit at a battlefield with 3 Might or less) — does three jobs. It manufactures the **alone** condition Kha'Zix needs by removing the second unit; it answers their cheap threats; and it is the mirror-image of the card that beats your own Hidden flips, so knowing how it plays from their side is worth something.

**Hard Bargain ×1** (2E, Reaction, Repeat 2E, counter unless they pay 2) — **the card that protects a flip.** Against Kennen, Irelia and anything else holding up Gust, this is the difference between Evelynn working and Evelynn being a 2/2. One copy is thin for that job; see §15.

**Rebuke ×1** (2E / 2 Chaos, **Action**, return *any* unit at a battlefield to hand) — Gust with no Might cap. In against Jayce, Azir and anything that cheats a large unit into play, where returning it to hand is strictly better than killing it because they must recast it.

**Sabotage ×1** — third copy, taking you to the legal maximum of three across main and board. In against combo and against decks whose Hidden cards you would rather take from hand.

**Acceptable Losses ×1** (1E, Action, each player kills one of their gear) — gear hate. **Note the interaction with your own Pyke:** it is symmetric, and a Gold token is gear. Crack the token first, then cast it.

**Ravenbloom Prefect ×1** (3E / 3 Might, *"when an opponent plays a gear, you may banish me to banish it"*) — a body that doubles as gear removal.

**Decree of Strength ×2** (1E, no Power: they reveal their hand, you make them recycle a **Mind** card) — narrow, and aimed more precisely than it first looks. A card is only in their deck if their Legend's identity contains its domains (§103.1.b.4), so Decree is a **literal blank** against nine of the eleven archetypes in §13: Kennen (Order/Chaos), Akali (Fury/Calm), Master Yi (Calm/Body), Irelia (Calm/Chaos), Rengar (Fury/Body), Azir (Calm/Order), Fiora (Body/Order), Rek'Sai (Fury/Order) and Vex (Calm/Chaos).

The two it is live against are **Jayce (Mind/Body)** and **Diana (Mind/Chaos)** — 3.7% and 4.4% of the archive, 8.1% together — and Jayce is the single worst board in §7. So it is not a bad card, it is a **hyper-specific** one, and it is aimed at the right target. Whether that justifies two of ten slots is the question §15 asks.

---

## 15. What I'd test

**1. The second Switcheroo belongs in the main deck.** It is 93–97% across every archetype measured and it is the only card in the list that fixes Jayce and Azir. One copy in a 39-card library is in your opening hand 10.3% of the time and in your first nine cards 23% of the time — for the best card in the deck against your worst matchups, that is too rare. **Move the board copy main, over the second Sabotage**, and register the third copy in the board.

**2. Traveling Merchant at one is too few.** The deck lost Stacked Deck, then lost two Merchants, and Fizz is not selection. Star Spring and Zaun Warrens both exist to trigger the Merchant, and at one copy those battlefields are doing less than they should. **Test Merchant 1 → 2, cutting the Ride the Wind.**

**3. One Decree of Strength, not two.** Live against Jayce and Diana and structurally dead against the other nine, and one copy already answers the single card you most want gone. **Test the freed slot as a second Hard Bargain** — protecting a flip against the Gust decks is worth more than the second narrow discard, and Hard Bargain's Repeat gives it a late-game mode.

**4. Is one Pyke enough to matter?** His engine is excellent and a single copy reaches your hand in the first nine cards 23% of the time. The argument for a second is that he is the only card that pays the Hidden tax; the argument against is the single facedown slot. **Test Pyke 1 → 2 over the second Vex** and see whether the slot competition is as bad in practice as it looks on paper.

**5. Does Evelynn justify her demands?** She needs a controlled battlefield, a spare rune, a turn of setup, an empty facedown slot, a lone enemy unit worth dragging, and an opponent without Gust. Every one of those is likely; all six at once is not. The payoff when they line up is three XP for a rune. **Track how many games she actually converts.** If it is under a third, the slot is a Kinkou Initiate.

**6. Star Spring against Rek'Sai.** The symmetric trigger reads like a real liability there and I have not tested it. Zaun Warrens is the obvious substitute.

---

## Sources and method

**Rule text** is `docs/rules-full.md` — Riot's Core Rules and Tournament Rules (2026-07-16, Vendetta update effective 2026-07-24), verbatim, generated by `scripts/build-rules.mjs` from the PDFs on the Rules Hub. Every unqualified "rule N" or `§N` here is a **Core Rules** entry; the two documents number independently and several numbers collide. Every citation was checked against that file rather than from memory, working from `docs/rules.md` first.

**Where the FAQ outranks the rules**, the FAQ is what is quoted. `docs/rules-faq.md` carries the Vendetta FAQ of 2026-08-14, which states that where it differs from the Core Rules Document it takes precedence until a newer Core Rules Document is published. The Hidden restrictions in §3 and the Tideturner errata in §12 are both FAQ material.

**The Hidden-removed-in-response ruling in §5** is `docs/rules-rulings.md`, dated 2026-09-17: Riot dev/design relayed through judge channels, confirming an existing CN ruling. **Its provenance is secondary** — the primary document has not been read directly from this repo — and it expires at the next Core Rules update, where dev stated the Hidden rules "don't currently express that with 100% clarity" and "we will make this clearer in a future rules update". Nothing in §5 can be derived from the published rules alone, which is why that file exists.

**Card text** is `data/cards.json` with `data/errata.json` applied on read (catalog 2026-09-20). Three cards in this list are errata'd and all three are named in §12.

**The decklist** was read live from the app's Supabase state on 22 September 2026 via `scripts/rift deck "Kha'Zix Midrange"`, not from a cached copy. The list is complete against the collection: nothing to acquire.

**Archetype data** — Might distributions, card adoption, bounce density, Hidden density — comes from `data/decks.json`: **1,226 decks over 2026-07-22 to 2026-09-20**, of which 720 are tournament-vouched and 506 fall after the 18 September bans. **Every archetype join in this dossier is keyed on the legend's name, not its collector number**, because alternate printings of a legend carry unrelated numbers — Heart of the Tempest is `VEN-155` *and* `VEN-197`, Voidreaver is `UNL-201` *and* `UNL-236`. A number-keyed join silently drops a third of Kennen's lists and a fifth of yours, and the first draft of this page was built that way before the counts were checked against `ln`. Upstream's archive is North American, online and Chinese-circuit; `data/events.json` records 1,375 events and **zero** of them resolve to decklists, so the archive is reliable for *composition* and weak for *share*. Tier placement is riftbound.gg's curated Vendetta week 4 list, scraped 2026-09-20.

**Simulations** are hypergeometric where a closed form exists and Monte Carlo at 200,000 trials otherwise. The combat model implements §465.2 and §466.3 directly: a clean win when your Might total strictly exceeds theirs, with stun removing a unit's damage contribution but not its Might for lethal purposes (§423.1.b–c). The Switcheroo column assumes optimal choice of which two units to swap. Your own Might distribution is the 24 units of this list weighted by copies (mean 3.04); theirs is each archetype's units in the archive weighted by copies. **The mulligan comparison in §10 uses one definition applied to both lists** — it does not reproduce the previous dossier's figure, which used a different keep rule, and the two are not comparable.

**What this dossier does not claim.** It does not claim the deck is now good. riftbound.gg has it at Tier 3, the archive has fourteen of it out of 1,226, and the archetype has not moved in a month. What the update changes is the shape of its bad matchups: Jayce and Azir went from unwinnable-on-Might to a single card, and the deck acquired a resource — the facedown slot — that costs a rune and pays a whole card. That is a real improvement and it is not a tier change. It also does not claim the Tideturner referent question in §5 is settled; the recorded ruling covers the identical shape for a different card, and a match that turns on it deserves a judge.
