---
title: Kha'Zix Voidreaver — Deck Guide
subtitle: Riftbound, Vendetta season — Jun's post-ban midrange list, how to play it, and the rules it runs on
author: rift toolchain
date: 2026-10-03
---

**Legend:** Voidreaver (Body/Chaos) · **Champion:** Kha'Zix, Mutating Horror
**Registered:** 40 main (Champion included) + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39 — the Champion starts outside the deck (§103.2.a.1, §108.3.d)
**Collection status:** complete, nothing to get
**The list:** Jun's **3 October** midrange revision, saved in the app as `Kha'Zix Midrange (Jun, post-ban)`. Two swaps from his 23 September build: **−Tideturner, −Ride the Wind, +Grim Resolve, +1 Traveling Merchant** ([§6](#6-card-by-card))
**Its results:** **Best-of-Kha'Zix at the Los Angeles RQ** (26 September, 2,165 players), won by Cuoemrei on the 23 September list, which shares **54 of these 56 cards** · **36th of 78** at the Orlando $10k (HTCG Dizoo, the same 23 September 56) · a deck in the archive titled "Kha'Zix Top 32 Los Angeles RQ", also the 23 September list
**Good until:** Radiance, released **23 October** (prereleases from the 16th). Jun will retest every build then.

**Companions.** [Jun's notes](khazix-voidreaver-jun.md) are the source this guide leans on hardest. The [matchup guide](khazix-voidreaver-matchups.md) covers who you are playing. [strategy.md](../docs/strategy.md) is how to think about any turn. This page is how to play *this deck*.

---

## The short version

*The part worth reading before every session. Everything below expands it.*

**What the deck does.** You are the proactive deck and they are the reactive one. You threaten a removal-plus-conquest every turn, so they can never safely pass with no runes open. **Develop units first, spells second. Aim to reach 6 points before they do.** Your finishers (Void Assault above all) pull units out of holds, so the last two points need very little setup.

**The one rule that governs everything.** Voidreaver pays XP only when you **win** a combat, meaning you are the *only* player with units left there (§466.3). A mutual wipe, an even trade, or attackers bouncing off survivors are all **No Result**, and No Result pays nothing. **An even trade is a failure here.**

**Kha'Zix is a combat trick that develops your base, not a unit to develop** (Jun). Ambush him onto an isolated enemy and he attacks as 6 Might, for 3 XP: 2 from his trigger and 1 for the win. Spend 2 walking him home, and you have won a fight and left nothing behind to be hit.

**Post-ban, the deck holds.** The Heron decks (Irelia and Akali) punish you if they can conquer for free and drop Astral Heron unopposed. So the Hidden cards are there to make **midgame holds cheap**: a hidden card costs one rune now and nothing later. Jun's test for any game is ***"can I win this without a hold?"*** If not, force one, even though it's risky.

**Your turn, in order:** check for lethal (§3) → decide the legend activation → buff → **take the open battlefields** → develop, onto them if it helps → **hide** → start the fights, flipping Evelynn last → hold up only what is free or spare.

**Five facts about Hidden.**

| | |
|---|---|
| To hide | Your turn, **Open State**, pay `[A]`, at a battlefield **you already control** (§811.1.b) |
| One per battlefield | The Facedown Zone holds **one card** (§107.3.b) |
| When you can flip it | **The next turn**, not this one. From then on it has **Reaction** and costs **0** (§811.1.b) |
| Where a unit lands | **That battlefield.** No choice (§811.1.d.1) |
| If you lose the battlefield | The card is **trashed and revealed** (§107.3.d, §323.7, §421.4) |

**The trap that costs games.** A hidden unit's play effect reads its battlefield off the unit. Bounce or kill the unit in response to its own trigger and the effect does nothing (§5). **Evelynn and Tornado Warrior are both inside Gust's range.** Count their open Chaos, and for Evelynn their open Calm too, before you flip.

**The three ways this deck loses:**
1. Hiding a card at a battlefield you then lose. That hands them a 2-for-0.
2. Impatience: casting your spells before your board can make them count.
3. A bad hold, or refusing a hold the game required.

---

## 1. What the deck is trying to do

Every deck values a position differently ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). This one values **board development first, then XP, then points.** Points come in bursts once the board is built.

**Two engines, one condition.** XP comes only from winning combats outright. Combat is won outright only when your total Might is strictly greater than theirs at that battlefield ([§8](#8-the-numbers)). So everything in the deck either **makes a fight unfair** (Punch First, Switcheroo, Rampage, Star-Crossed) or **chooses which fight happens** (Void Assault, Faefolk, Evelynn, Kha'Zix's Ambush). The XP then pays for safety: walking a unit home after it conquers, or a buff that puts it past removal.

**Why "proactive" does not mean "aggressive."** Jun's whole post-ban argument is about patience. The spells are what make the deck good, and they are weak without units behind them. Units also cost less Power than spells, so developing first builds your rune economy as well. On a quiet turn, ask *who is happier if nothing happens* ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). Against most of the field you want quiet early turns, because your late game (removal, finishers, Fizz, Matriarch) is the better one. Against the decks that out-grind you, the [matchup guide's role table](khazix-voidreaver-matchups.md#before-the-dice-roll-which-game-is-this) tells you to force the issue earlier.

**The 6-point rule.** It matters more for this deck than for most to **reach 6 points before the opponent.** At 6, Void Assault and your Ambush units can take two battlefields in one turn for the 7th and 8th. Few decks can do that, because few can break holds as easily. So you may invest heavily to reach 6, **provided the finishing cards are still in hand**. Spending everything on the 6th point and arriving out of gas is the classic error.

---

## 2. The game in four stages

### Opening (turns 1–2)

Jun plays one of two starts.

- **Tempo start: Irresistible Faefolk on turn 1, Kha'Zix on turn 2.** Faefolk on turn 1 either stops them playing a unit or gets that unit killed next turn. If they skip their turn-1 play to dodge it, switch to the developmental start.
- **Developmental start: a 2-drop on turn 1, a 4-drop on turn 2** (Vex, Apathetic or Tail-Cloaked Matriarch). You are happy to be slower. Any free point they take gets punished next turn by a conquest that kills the unit that took it.

**Up from the Deep on turn 1 going second** is the ideal opener: score twice with the Tentacles on turn 2, then develop, for example with Zed. Hiding is impossible on turn 1, because you do not control a battlefield yet. The earliest realistic hide is turn 2: move a unit to an open battlefield (a Conquer, §348.2.a), then recycle a rune to hide.

**Power is expensive early.** Jun's illustration: in a seven-turn game, a Power spent on turn 2 costs you about five Energy over the game. That is why Punch First, Void Assault and Switcheroo-from-hand wait for the midgame.

### Midgame (turns 3–5)

**Turn 3 is flexible, and Jun usually develops again.** A developed Zed can win the game.

From turn 3 or 4 the spells start. Rampage, Star-Crossed and above all Void Assault turn a developed board into a lead in both board and points. **Keep spending leftover Energy on units.**

**Score with expendable bodies.** Tentacles take open battlefields. When the opponent kills them to retake a battlefield, your developed base kills *their* units in turn, scores again, and the XP from the win walks your unit home. Losing Tentacles in that exchange is a good trade.

**Hold when it is cheap.** Conquer a battlefield, hide behind it, and the opponent has to attack into a card they cannot see. That is the "backed by a punish" kind of hold that is worth having ([strategy.md §1](../docs/strategy.md#1-the-board-is-not-the-position)). Against Heron decks this is not optional, because the battlefield where Astral Heron stands is the one making their cards cheaper (Heron's discount only works *while it is at a battlefield*).

### Reaching 6

This is where you spend. Finish their board with removal and take the points, but **count what you have left for the last turn first.**

### Closing (6–8 points)

**From 5 points on, check for lethal every turn, for both players** ([strategy.md §0](../docs/strategy.md#0-the-order-of-every-decision)):

| you are at | and you | result |
|---|---|---|
| **7** | **hold** a battlefield at the start of your turn | **you win**. Hold points are not gated (§471.1.a.1) |
| **7** | conquer, having scored the other battlefield this turn | you win |
| **7** | conquer, **not** having scored the other this turn | **you draw a card instead** (§471.1.b.1) |
| **6** | hold one, then conquer the other | win |
| **6** | hold nothing, conquer both | win. The first conquest makes 7 and counts as scoring that battlefield |

**At 7, hold with a split board and a facedown card behind it** (Jun). Units on both battlefields plus a hidden card "can really mess with your opponent's attacks." Jun named Tideturner, which he cut on 3 October; the hidden cards you have now are Tornado Warrior (a free 3 Might on their turn) and Switcheroo, which is pinned to its battlefield and so is a defensive card anyway.

**If they are at 7 and holding**, they win at the start of their turn unless you take the battlefield now. That outranks every plan you had.

### Playing from behind

Behind on points is fine if you are ahead on development. Let them score, then enter, win the fight and retreat. **Some games you develop for several turns, then wipe their board in one turn** with Void Assault, Faefolk and Rampage. A board they cannot rebuild in one turn stays wiped. What you cannot do is fall so far behind on points that the double conquest is not enough, so watch the score clock while you build.

---

## 3. Your turn, in order

Before your Main Phase, three things happen on their own: you **ready everything**, including Voidreaver; you **Hold every battlefield you control**, scoring 1 point each; then you channel 2 and draw 1 (§315). Hold scoring comes *before* Channel and Draw, so a battlefield you are about to lose is still worth taking to the start of your turn.

**Step 0 — check for lethal, for both players.** If you have a line to 8 now, nothing below matters. If they have one next turn, stopping it comes first.

**Step 1 — decide the legend activation, even if you are holding it.** It is the scarcest thing you own: it exhausts, and **it is unavailable from the moment a showdown opens until every fight has resolved** (§381, and §4 below). You have three options:
- spend it now on a buff the coming fight needs;
- spend it now walking an exhausted unit home;
- **hold it deliberately** and spend the XP the fight pays you once it is over.

**Step 2 — buff before you move or flip, always.** A buff after the showdown opens is not a legal play. **If a second trick of theirs would beat you, buff now.** Jun lost a fight on camera exactly this way: an unbuffed Kha'Zix into a second Defiant Dance ([Jun's notes §10](khazix-voidreaver-jun.md#10-jun-on-video)). The cost is that a buffed unit has used the turn's activation, so it cannot also walk home.

**Step 3 — take the open battlefields first** (Jun). Move into any battlefield nobody holds before you play anything. That is a Conquer when its showdown closes (§348.2.a). Doing it first shows them less before they must decide on their interaction, and it opens options: **a unit may be played to a battlefield you control** (§355.2.a), and you can only hide at one you control.

**Step 4 — develop, and decide where each body lands.** Units enter exhausted (§143.4), and a standard move costs exhausting the unit (§144.2), so **nothing you play this turn can make a standard move this turn**. Effects still can — Void Assault above all. Where it enters is the decision:
- **base**, ready to attack next turn;
- **a battlefield you control**, to make a hold bigger, soak damage under the no-overkill rule, or stop your threat being *alone*.

**Step 5 — hide.** After developing, before anything that might start a fight. Hiding needs an **Open State**, so it is illegal once a showdown is live. Check three things: you control the battlefield, its facedown slot is empty, and you can afford the rune this turn rather than next.

**Step 6 — start the fights.** Moves into their battlefields, Void Assault, Faefolk, and **flipping Evelynn, which starts a combat too, so it comes last.** Drag the lone enemy where you want it, confirm your total kills *all* of theirs, and only then commit. There is no window between Evelynn's trigger and the fight. Once every fight has resolved, you are back in your Main Phase: the legend is live again if unused, and you can still play cards.

**Step 7 — hold up only what is free or spare.** Your showdown-legal plays:

| | |
|---|---|
| **Action** | Punch First ×3 · Grim Resolve ×1 · Switcheroo ×1 · Zed's clone swap |
| **Reaction** | Star-Crossed ×2 |
| **Ambush** (Reaction when played that way) | Kha'Zix ×1 · Rengar ×2 |
| **Facedown** | whatever is in the slot: free, Reaction speed, from the turn after you hid it |
| **No keyword** | Rampage · Sabotage · Void Assault · Up from the Deep. Main Phase only; cannot be held up |

**Do not hold Energy open *instead of* developing.** Jun calls "developing through Ambush" a rookie mistake. If you keep five runes open to Ambush Rengar on their turn, a good opponent just develops, and five open runes announce Rengar anyway. **The facedown slot is what makes this deck different:** it threatens a Reaction for 0 Energy, so it costs you nothing on their turn.

**Jun also rarely plays Rengar on their turn.** You can, but you want to be sure you win the fight, and that is easiest on your own turn, when *they* have already committed.

---

## 4. The rule that governs the deck, and the legend

> **466.3.a.** A Player has won a combat if they received either the attacker or defender designation and are the only Player that has units remaining at this battlefield during this step.
>
> **466.3.d.** There is "No Result" if units were recalled during step 3d of the Combat Cleanup, if both Players have units present during this task, or if neither player has units present during this task.

So:

- You attack, kill everything, keep a unit → **win**, 1 XP.
- You attack, kill everything, lose everything → **No Result**, 0 XP, and the battlefield goes Uncontrolled (§466.5.b).
- You attack, they survive → your attackers are **recalled** (§466.1.a.2) → **No Result**.
- **They** attack you, you kill everything and keep a unit → **win**, 1 XP. **Defending pays exactly what attacking pays**, and a failed defence costs you nothing but the turn, because defenders are never recalled.

**What the legend can and cannot do**

| | |
|---|---|
| Gains XP | Every combat you win. No limit per turn, no cost, automatic |
| Spends XP | **Once per turn** (it exhausts), and **only in your own Main Phase, in an Open State** |
| 1 XP | `[Buff]` a unit: permanent +1 Might, **one buff per unit at a time** (§702.3) |
| 2 XP | Move an **exhausted** friendly unit from a battlefield to its base |
| Never | Mid-combat, mid-showdown, or on their turn (§381) |

**Its best use is the walk-home** (Jun). Move a unit off the battlefield after it conquers, and the inevitable retake kills nothing. **The buff is for thresholds:** 7 Might is much safer than 6 against Singularity (6 damage) or Falling Star (3 + 3).

**Why it is dead mid-fight.** Voidreaver has no Action or Reaction keyword, and §806.1.a names legend abilities as one of the things the keyword exists for. The Vendetta FAQ puts it plainly: *"Abilities can only be used in your Main Phase, outside of a showdown, unless they have the Action or Reaction keyword."* The trap is §381's wording, "during an Open State", because §310.3 calls a showdown with an empty chain *Showdown Open*. That reading is wrong: §310.1.a means **Neutral** Open, and if Showdown Open counted, the Action keyword would grant nothing. **Once every fight has resolved, you are back in Neutral Open and the legend is live again** if you haven't used it.

**Kha'Zix is free.** He starts in the Champion Zone and is playable from there (§108.3.d). You have him every game, so one copy is correct.

---

## 5. Hidden, precisely

### What hiding is

> **811.1.b.** It is functionally short for *"While this card is in your hand or in your Champion Zone on your turn during an Open State, you may pay `[A]` to hide this facedown at a battlefield you control that doesn't already have a facedown card hidden there for as long as you control that battlefield. Beginning on the next turn, this gains [Reaction] and you may play this, ignoring its base cost."*

- **Cost: one Power of any domain**, paid by recycling a rune. You channel 2 a turn, so **a hide costs half a turn of ramp.** It is the cheapest thing in the deck in Energy and the most expensive in tempo. It takes whichever rune you were least going to use, which is most of why four Hidden cards are affordable.
- **It cannot be answered.** Hiding is not playing (§811.1.c.1) and does not open a chain (§811.1.c.2). No counterspell, no response. *Playing* from facedown does open a chain (§811.1.c.3).
- **It is private.** They see a card back and nothing more (§107.3.f, §811.6.a).
- **It is a legal target**, though almost nothing in the field targets facedown cards. The way your hidden cards die is by losing the battlefield.

**Plan the hide a turn earlier than feels necessary.** A rune recycled on turn 2 is back by turn 4; one recycled on turn 6 is a rune you needed.

### The restrictions when you flip

- **A hidden permanent must be played to that battlefield** (§811.1.d.1).
- **Each target must be chosen at that battlefield**, *unless the card's own text makes that impossible* (§811.1.d.2), and **each target is judged separately** (§811.1.d.2.a).
- **A unit the card makes you play goes there too** (§811.1.d.3).
- Nothing else is restricted (§811.2). The FAQ's line: *"Only effects that choose are restricted."*

| card | target pinned to the hide battlefield? | why |
|---|---|---|
| **Switcheroo** | **yes, both units** | nothing in its text points elsewhere. **So a hidden Switcheroo is a defensive card**; for an attack, cast it from hand |
| **Evelynn** | **no** | *"an enemy unit at a different location"*: a restriction that can never be met at her own battlefield, which is §811.1.d.2's exception (its worked example is Tideturner) |
| **Tornado Warrior** | **yes** | *"empower something **here**"* |

### The cost of losing the battlefield

> **323.7.** Remove all Hidden cards from all Battlefields that are not controlled by the same player and place them in their owner's Trash.

1. Lose the battlefield, and the card goes to your **trash**, revealed (§421.4). **Moving your own last unit off counts.** A legend walk-home, Star Spring's move, or a standard move all leave you with no units there, and you lose control at the next cleanup in an Open state (§190.4.c, §323.6). The same cleanup trashes the card (§323.7). Flip it first, or keep a second unit there. That is why Jun's Star Spring save works: the flipped unit stays behind.
2. **A mutual wipe does it too.** If nobody has units left, the battlefield is Uncontrolled (§466.5.b), which is not "the same player", so §323.7 trashes it. **In this deck the even trade got worse**: no XP *and* a lost card.
3. The trash is not nowhere. Tail-Cloaked Matriarch can rebuy Evelynn or Tornado Warrior, and Fizz can recast Switcheroo. A rebuy plays from the trash, though, not from face down, so **Evelynn's trigger does not fire off a Matriarch rebuy.**

### The trap: removed in response

A hidden unit's play effect reads its battlefield **off the unit**, not off the chain. If the unit leaves the board in response to its own trigger, that read returns null and the instruction is ignored (§359.3.e.12, §359.3.f.2). This is a recorded ruling from Riot dev/design: [*A Hidden permanent removed in response to its own play effect loses the target*](../docs/rules-rulings.md). Killing the unit strips its location just as bouncing does.

**Cite §359.3.f.2 first if a judge asks.** §359.3.e.12 sits under "A Spell lingers on the Chain", but §359.3.f.2's own worked example is this exact play: a Yasuo attack trigger whose *"here"* is moved away by a hidden Fight or Flight.

- **Evelynn** (*"move an enemy unit at a different location **to my battlefield**"*): bounced in response, nothing moves.
- **Tornado Warrior** (*"empower something **here**"*): no *here*, no empower.
- **Switcheroo is safe.** It chooses both targets when you play it and reads nothing off itself.

**What can do it to you.** Most "bounce" in the format is friendly-only: Retreat, Pack of Wonders, Grim Apothecary, Bloodharbor Ripper, Mesmerize and Emperor's Dais **cannot touch your flip.** The real threats are **Gust** (1E Reaction, ≤3 Might), **Star-Crossed** (Reaction), and rarely Shakedown. Two more Reactions **counter Evelynn's trigger** instead of removing her: **Not So Fast** and **Repulse**. Switcheroo can be countered by any spell counter except Defy, which its 2 Power puts out of reach.

**Their facedown card cannot touch your flip.** They can only hide at a battlefield they control, and its targets must be at that battlefield (§811.1.b, §811.1.d.2). In a 1v1 that is never yours. What it *can* do is protect *their* unit. A Temporal Breach on the unit Evelynn pulls makes it a new object, and the move has nothing to move. **So pull from their base, or from a battlefield with no facedown card.**

**The three questions per flip:**

| | what beats it | count it by |
|---|---|---|
| **Tornado Warrior** | Gust, Star-Crossed | their open Chaos |
| **Evelynn** | the above, **plus** Not So Fast / Repulse, **plus** a Temporal Breach on her target | open Chaos *and* open Calm; where her target stands |
| **Switcheroo** | any spell counter except Defy | open runes of their counter's colour |

Per-archetype rates are in the [matchup guide's quick reference](khazix-voidreaver-matchups.md#quick-reference). In short: **Ezreal, Diana, Mel and Kennen punish almost every flip; LeBlanc, Rek'Sai, Viktor, Azir and Rengar punish almost none.**

**Read open runes against their baseline** ([strategy.md §4](../docs/strategy.md#4-information-is-about-plans-not-cards)). Open Calm on a normal development turn is weak evidence. A rune they kept open *instead of* developing is strong evidence. And a flip into a tapped-out opponent, or after they spent the Reaction on something else, is free. **Your Void Assaults and standard moves are the bait.**

---

## 6. Card by card

Card text is `data/cards.json` with `data/errata.json` applied. "Jun" marks how he uses the card.

### The cards that choose the fight

**Kha'Zix, Mutating Horror ×1** · 4E / 1 Chaos · 4 Might · Ambush — *"When I attack or defend, if an enemy unit is alone here, give me +2 `[M]` this turn and gain 2 XP."*
**Alone** means no other unit *friendly to it* at that location (§740.2.a). The trigger checks once, when designations are handed out (§383.4.e.2.a). Ambush lets him arrive at Reaction speed where you have units, re-checked through finalization (§822.3).
- **Jun:** a combat trick that develops your base. Ambush onto the isolated unit, take 3 XP, spend 2 walking him home.
- **Do it on your own turn.** The walk-home moves an *exhausted* unit, and only in your Main Phase. Ambush him on *their* turn and he readies at your next Awaken, before you can spend the XP, so he stays on the battlefield they get to plan against. That is the rules reason behind Jun's "keep combat happening in your own turn".
- **Jun:** don't count him as your turn-2 unit, and seldom play him to base and pass.

**Void Assault ×3** · 2E / 1 Power — *"Move a friendly unit, then move an enemy unit. (If they both move to a battlefield you don't control, you're the attacker.)"*
No Action keyword, so it is Main-Phase only.
- **Jun:** the best card in the deck, and he argues the best in the game. It scores and removes a unit in one card, and it is the card for the final double conquest.
- **Do not use it like a Charm.** If Faefolk, Star-Crossed or Rampage can remove that backline unit, save the Void Assault. The test is *does my own unit need to move this turn?*

**Irresistible Faefolk ×3** · 2E · 1 Might — *"When I move to a battlefield, you may move an enemy unit to that battlefield."*
**"To a battlefield"**: moving her home or Star Spring's walk-home do nothing.
- **Jun:** the best 2-cost unit in the game. On turn 1 it either stops their unit or gets it killed, and it stays live as removal all game.

**Evelynn, Entrancing ×1** · 2E · 2 Might · Hidden, Backline — *"When you play me from face down on your turn, you may move an enemy unit at a different location to my battlefield."* See [§7](#the-evelynn-line-three-xp-for-one-rune).
The condition is part of the trigger (§383.2.a.1). **Played from hand, or flipped on their turn, she does nothing.** Backline means she is assigned lethal last (§826).

### The Hidden package

**Tideturner — cut on 3 October.** He swapped a unit already on your board into a fight at Reaction speed. Nothing does that now: **Rengar's Ambush, from hand, is your only Reaction-speed reinforcement**, and three Hidden cards share the slot instead of four.

**Tornado Warrior ×1** · 3E · 3 Might · Hidden — *"When you play me from face down, you may empower something here. Disempower it at end of turn."*
- **Not restricted to your turn.**
- The one card it cares about is **Tail-Cloaked Matriarch** standing at that battlefield: flip him for 0, she becomes Empowered, and she rebuys a unit from your trash.
- *"Disempower at end of turn"* is an upside. Empowered is otherwise permanent (§442), and Empower can only be activated while not already Empowered (§827.1.c.1), so Tornado Warrior re-arms her own Empower for later.
- His floor is a free 3 Might at Reaction speed.

**Switcheroo ×1** · 2E / 2 Chaos · Action, Hidden — *"Swap the Might of two units at the same battlefield this turn."*
The gap moves by **twice the difference** between the two units. Its swing grows with *their* units, where Punch First's +5 does not.
- **Jun's best use:** attack just over their hold with a unit plus a Tentacle. They spend a pump to save the fight, and you swap the Tentacle's Might with **the unit they just pumped**. So it is good against small boards too: the swap target is whatever they make big.
- Swapping a unit down to 1 Might doesn't kill it. Lethal must be non-zero (§142.4.b).
- At Sandswept Tomb it costs 2E / **1** Chaos.

### The bodies

**Shadow Order Disciple ×3** · 2E · 2 Might — *"When I move, you may [Burn 1] to give me +1 `[M]` this turn."*
It triggers on **any** move, including Star Spring's walk-home. Burn fills the trash Fizz and Matriarch draw from, and it *can* burn you out (§440.4).
- **Jun:** the second-best 2-drop. On the draw it slows the game, because their 2-drop does not want to score a point and then die to it.

**Kinkou Initiate ×3** · 3E · 3 Might — *"When you play me, draw 1 if your other units have total Might 5 or more."*
"Other units" is board-wide.
- **Jun:** the post-ban replacement for Stacked Deck's selection. Card draw on a body, and it is easy to burn and replay with Matriarch.

**Fizz, Trickster ×3** · 3E / 1 Chaos · 3 Might — *"When you play me, you may play a spell from your trash with Energy cost no more than 3, ignoring its Energy cost. Then recycle it. (You must still pay its Power cost.)"*
- **Jun:** keep him for the late game, where he takes games over.

**Traveling Merchant ×2** · 2E · 2 Might — *"When I move, discard 1, then draw 1."* Your plan when low on cards: it draws even with nothing to discard. **Back to two copies on 3 October**, so Star Spring's walk-home and Zaun Warrens' conquest loot more often.

**Tail-Cloaked Matriarch ×2** · 4E · 4 Might · Empower 2E / 1 Chaos — *"When I become [Empowered], you may choose a unit in your trash with Energy cost no more than 3 and Power cost no more than `[A]`. Play it to your base, ignoring its cost."*
- **Jun:** a turn-2 developer whose Empower stays a threat for turns. Late, **keep her in hand and reveal her on the turn you Empower immediately**, above all to bring back Fizz.

**Vex, Apathetic ×2** · 4E · 4 Might · Deflect — *"When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn."*
She triggers on a unit being **played**, not moved.
- **Jun:** a great turn-2 play, since 4 Energy and no Power, and Deflect makes her hard to remove.
- **Jun's plan B:** once their units are cleared, leave her on a battlefield. Scoring both battlefields to 6 while she stuns anything they play is a real way to win.

**Rengar, Trophy Hunter ×2** · 5E / 1 Body · 6 Might · Ambush (**errata'd**) — *"I can [Ambush] to a battlefield where there are enemy units, even if you don't have units there."*
- **Jun:** a powerhouse that jumps in with no setup and often holds afterwards. Use him on your own turn, where you know you win the fight.

**Zed, Without a Sound ×1** · 5E · 5 Might — *"When I conquer, play a 0 `[M]` Shadow Clone token to your base…"* His clone swap is an Action, the deck's only non-spell one. The clone is a token, so bouncing it kills it (§186.1).
- **Jun:** Zed pulls an *even* game your way, where Rengar gets you back in from behind. Play him on curve only if they cannot clear him. Otherwise Sabotage first, or pair him with Void Assault in one turn.
- **Jun:** one Shadow Clone is enough, so don't get greedy.

### The spells

**Punch First ×3** · 1E / 2 Body · Action — +5 Might.
At 2 Power, Defy can never touch it (§206), and since it only chooses your own unit, Not So Fast cannot either.
- **Jun:** midgame to late. Don't force early fights with it.

**Star-Crossed ×2** · 3E / 1 Chaos · Reaction — returns one of yours and one of theirs. Subtraction is worth roughly double addition for a clean win. **Pointing it at your own Tentacle costs nothing**, because tokens cease to exist off the board (§186.1).
- **Jun:** keep it for emergencies: a lost fight, or a big hold you must break. **Bouncing your own Fizz to replay him** is the best version.

**Rampage ×2** · 3E (+1 Body optional) — *"Choose a friendly unit and an enemy unit. If you paid the additional cost, give the friendly unit +2 `[M]` this turn. They deal damage equal to their Mights to each other."*
Your only removal that needs no combat, and it reaches units at base.
- **Jun:** save it for the key unit (their champion, or Stellacorn Herder against Irelia), or fire it in the last turns, when bodies matter most.

**Sabotage ×2** · 1E / 1 Body — reveal their hand, recycle a **non-unit** card. It takes Hidden cards and Equipment out of their hand *before* they can hide them. Once a card is facedown you cannot touch it.
- **Jun:** save it for turns with a lot of combat, or use it *defensively*: before playing a unit you cannot afford to lose, check that the coast is clear.

**Grim Resolve ×1** · 2E · Action — *"Give a friendly unit +3 Might this turn. When it wins a combat this turn, gain 2 XP."* **New on 3 October**, replacing Ride the Wind.
- **An XP card first.** A win pays the legend's 1 **plus 2 more**. On an isolated Kha'Zix that is five XP from one fight ([§7](#grim-resolve-on-an-isolated-khazix-five-xp-from-one-fight)).
- **The unit must survive.** Units inherit the combat result only if they are *"at this battlefield"* when it is determined (§466.3.c). If the buffed unit dies, no 2 XP, even when you take the battlefield.
- **Defy counters it** (2 Energy, no Power); Not So Fast cannot, because it only chooses your unit. Against Defy decks, Punch First goes first.
- **Jun's notes said he deliberately did not run it** ("early pumps cost development"). He changed his mind on 3 October; the same patience applies, so it is a midgame card like Punch First.

**Up from the Deep ×2** · 3E · Flow 3E — two 1-Might Tentacles, replayable from the trash and then banished (§829.1.b.1).
- **Jun:** the cheap scoring bodies the whole plan relies on, and still useful from the trash.

### Runes and battlefields

**6 Body / 6 Chaos.** Body demand is 10 pips (Punch First, Sabotage, Rengar). Chaos demand is 8 (Fizz, Star-Crossed, Switcheroo's two, Kha'Zix), down from 9 when Ride the Wind left. Void Assault takes either (§135.2.e.6), and the hide tax takes any.

**Zaun Warrens: Jun's game-1 default.** *"When you conquer here, discard 1, then draw 1."* You choose what goes to the trash, which suits a deck built around the trash, and you can pitch narrow cards in matchups where they are dead. That makes a symmetric battlefield play asymmetric for you.

**Sandswept Tomb: usually saved for going second in games 2 and 3.** *"Each spell that chooses one or more units here that are friendly to it costs `[A]` less."* Punch First becomes 1E / 1 Body, Switcheroo 2E / 1 Chaos, Star-Crossed 3E / 0. Jun would save up to 4 Power a game. It is symmetric, so their self-targeting pumps get cheaper too.

**Star Spring: the battlefield Jun hates and runs anyway.** *"The first time a player plays a non-token unit here each turn, they may move another unit they control here to its base."* Its best case is a turn-1 Faefolk, which he puts at 45.7% of games. What earned it the slot is the Hidden save in [§7](#star-spring-and-a-hidden-unit-the-0-energy-flash).
- The move it grants has no exhaustion requirement, unlike the legend's, and it triggers "when I move" abilities.
- **It is symmetric.** Never bring it against Rek'Sai or LeBlanc, whose units want to come home or die. It is **risky against Rengar**, which has ten-plus Reaction-speed ways to trigger it.

In a Bo3 you choose each game, and **every battlefield used in a game that someone won is retired for the match, yours included**, whoever won (§486.5). So game 1's choice is gone for game 2, and the three-battlefield plan has to last the match: Zaun Warrens first, then Sandswept Tomb or Star Spring. After a draw the same battlefields may be reused (§486.5.a). Registration is fixed for the event (TR §403.4.b).

---

## 7. Lines that win games

### The Evelynn line: three XP for one rune

Turn N: control a battlefield and hide Evelynn. Turn N+1: activate the legend, buff, develop every body you want in the fight, put Kha'Zix at that battlefield, **then** flip her and drag their lone unit in.
- **They are the attacker**, because their unit applied Contested (§190.3.a.1, §464.2.c.1). So nothing of yours is recalled if it goes wrong.
- Kha'Zix's trigger reads *attack or defend*: +2 Might and 2 XP. Win the fight for 1 more.
- **Drag a lone unit from a battlefield they control** (it strips their board there), or from their base (it was doing nothing).

### Grim Resolve on an isolated Kha'Zix: five XP from one fight

Drag their lone unit onto Kha'Zix (Faefolk, Void Assault or Evelynn). His trigger gives +2 and **2 XP**. Cast Grim Resolve on him in the combat showdown for **+3 more**, so a 4-Might Kha'Zix fights at 9. Win, and you collect the legend's 1 XP and Grim Resolve's 2 on top: **five XP from one combat**. It needs him alive at the end (§466.3.c), which at 9 Might he usually is. Into tapped Calm if they play Defy.

### Tornado Warrior → Matriarch: a free rebuy on their turn

Matriarch at a battlefield, Tornado Warrior hidden there. On their turn, mid-showdown, flip him: she Empowers and rebuys a 2–3 Energy unit from your trash, and her own Empower re-arms at end of turn. **A Hidden card you lost earlier is the obvious rebuy.** It comes back to your base, not face down.

### Star Spring and a hidden unit: the 0-Energy Flash

Jun's post-ban line. Conquer Star Spring with a strong unit (Vex or Rengar), then hide a card behind it. If the hold goes wrong on their turn, flip the hidden unit: Star Spring moves your strong unit home, out of the fight. Jun calls it "a 1-Power, 0-Energy Flash."
- **Under the rules:** playing from Hidden is playing the card (§811.1.b), the unit is played to that battlefield (§811.1.d.1), and a unit moved to base "is no longer in combat" (§359.3.e.5's own example).
- **Caveat:** Star Spring fires only on **the first** non-token unit played there each turn.
- **The cheaper version:** walk a Traveling Merchant home instead, for a free loot. With two in the list, it is there more often.

### Switcheroo into the pumped unit

Attack barely over their hold, with a Tentacle in the fight. They answer with a pump, and you swap the Tentacle's Might with the unit they pumped. It works against any board, because their pump is what creates the target.

### Zed + Void Assault: an 8-Might Shadow Clone

Attack with the Shadow Clone so it gains Assault 4, then swap it with Zed. Zed trades, and Void Assault brings the Clone back in for a second Assault 4. Use it to break a big hold.

### Zed + Switcheroo: conquer without losing a unit

Zed is pumped into their hold and they answer with their own pump. Swap Zed out for a Clone, Switcheroo the Clone with their biggest unit, then swap Zed back in and conquer.

### Fizz from the trash

- **Fizz + Void Assault:** from an empty board, develop a body, start a fight and score. Players feel safe when you have no units.
- **Fizz + Rampage:** 5 damage anywhere and a body, for 3 Energy plus 2 Power.
- **Fizz + Up from the Deep:** mass early development. The earlier the better, but early Power is costly.
- **Fizz + Star-Crossed:** bounce Fizz and replay him, taking another spell from the trash.
- **Fizz + Grim Resolve: completely free.** Fizz ignores the Energy cost and you pay only the Power, and Grim Resolve has none. Through Fizz, Punch First still costs 2 Body and Switcheroo 2 Chaos. It is Main Phase, before the fight, so put the +3 on the unit about to fight, not on Fizz, who enters exhausted. **Against Defy decks it is the best bait you have**: a Defy spent on it costs you nothing from hand, and the Punch First that follows is out of Defy's reach. The spell is recycled afterwards, so it is one free cast per trip through the trash.

### The Vex lock: free points to close

Clear their board, then leave Vex, Apathetic on a battlefield: anything they play is stunned and cannot move, so they cannot contest it. Jun took a game from 5 to 8 points this way with a Vex on each battlefield ([Jun's notes §10](khazix-voidreaver-jun.md#10-jun-on-video)). It works best after a board wipe, which is why "develop, then clear them at once" and Vex belong together.

### Use it or lose it: drag the unit guarding their facedown card

Their lone unit at the battlefield where their facedown card sits is guarding that card. Drag it away with Void Assault, Faefolk or Evelynn, and they face a choice.
- **Flip in response.** While your spell or trigger is on the chain the state is Closed, so control cannot change yet, and the hidden card has Reaction (§811.6). But its targets must be at *that* battlefield (§811.1.d.2), so it can only protect or replace things there.
- **Or lose it.** Once the unit is gone and the chain empties, they lose control in the next Open-state cleanup and the card is trashed, revealed (§190.4.c, §323.6, §323.7).

Either way they spend the card now, on your terms, not when it would have hurt you. Expect the response: a unit flip (Guards!, Kennen, Tideturner) keeps them a unit there, and a **Temporal Breach** on the unit you are dragging blinks it, so your move fizzles. That is why the Evelynn line prefers targets from their base when you need the fight itself to happen.

### Strip the counter before the spell that wins

When one spell wins the game, such as Star-Crossed on their key unit, they keep Defy up for exactly that. Make something else eat it first: **Sabotage** (which also shows you the rest of their hand), or a lesser spell they cannot let resolve. Then cast the one that matters.

### Vex holding, Rengar in hand

Pass and play reactively. If they conquer the other battlefield, Ambush Rengar there. If they only develop, Vex stuns what they play and Rengar comes down beside her.

### Two that look like synergies and are not

- **Matriarch does not rebuy Evelynn's trigger.** The rebuy plays her from the trash to your base, so her "from face down on your turn" condition fails.
- **Faefolk does not trigger off a move to base.** Her text is "when I move **to a battlefield**", so Star Spring's walk-home does nothing.

---

## 8. The numbers

### Combat is never declared, and ties destroy both boards

Combat happens on its own in a Cleanup, at a Contested battlefield with both players' units present (§460, §323.9). Each side sums its Might and assigns that total across the other side's units. **The attacker assigns first, and no one may overkill while other units are unassigned** (§465.2.c.4). So a 1-Might Tentacle absorbs exactly one point.

> **You win outright exactly when your Might total is strictly greater than theirs.**

A stun removes a unit's damage but not the Might it needs to die (§423.1.b–c).

### Clean-win rates, two of yours against two of theirs

Monte Carlo over 200,000 trials, from your actual unit Might distribution (24 units, mean 3.04) against each archetype's real distribution in the archive as of 20 September. **The trick columns assume the trick resolves.**

| | no trick | + Punch First | + Switcheroo | isolated 2v1 | isolated + Kha'Zix |
|---|---|---|---|---|---|
| Irelia | 58% | 98% | 97% | 91% | 99% |
| Rek'Sai | 54% | 97% | 98% | 88% | 98% |
| Vex | 53% | 93% | 98% | 86% | 96% |
| Master Yi | 43% | 89% | 98% | 80% | 94% |
| Akali | 40% | 91% | 97% | 82% | 96% |
| Diana | 39% | 93% | 97% | 84% | 96% |
| Kennen | 38% | 89% | 97% | 82% | 95% |
| Rengar | 38% | 88% | 98% | 81% | 94% |
| Fiora | 35% | 90% | 97% | 82% | 95% |
| **Azir** | **24%** | 86% | 94% | 75% | 96% |
| **Jayce** | **12%** | **46%** | **97%** | 53% | 69% |

**What to take from it:**
- **You lose most untricked even fights.** Patience is arithmetic, not temperament.
- **Isolation is the plan.** One of theirs against two of yours is 75–91%, and 94–99% once Kha'Zix adds his +2. Jayce is the exception at 69%.
- **Punch First decays as their units grow; Switcheroo does not.**
- **The simulation's blind spot is the one Jun corrected.** It swaps against the board as it stands, so it rates Switcheroo low against small boards. A real opponent pumps a unit to save the fight, and that pumped unit becomes the swap target. **Simulations model the board you can see, not the answer they are about to play.**

### Opening hands

Opening hand is 4 cards from 39. Set aside up to 2, draw that many, and the set-aside cards go to the bottom (§116, §117).

| | rate |
|---|---|
| At least one 2- or 3-Energy unit | 89.2% |
| At least one 2-Energy unit | 66.7% |
| At least one Hidden card (three in the list) | 28.4% |
| At least one Void Assault | 28.4% |
| At least one Punch First | 28.4% |

### The rune formula

To cast something costing **E** Energy and **P** Power, you need **max(E, P) runes on the board, at least E of them ready** (§164.2). Exhausting a rune for Energy and recycling it for Power are different costs, so the same rune can do both in one turn. What recycling costs you is next turn's board.

---

## 9. Mulligans

**Jun's rules:**

- **Always have a unit for turn 1 and turn 2. If you don't, put two cards back.** Kha'Zix does not count as your turn-2 unit, because he is a trick.
- **Removal is interchangeable.** What matters is having some, not which. With several removal spells in hand, recycle some.
- **Mulliganing a 1-of loses it for the match**, so sometimes keep the Rampage over a second Void Assault. Two different cards beat two copies of one.
- **When in doubt, keep Void Assault.**

**And this page's additions:**

- **Do not ship a Hidden card to make a marginal keep.** You see one in only 36% of openers, and the tempo cost of hiding rises every turn you delay it.
- **Ship top-end-only hands.** Rengar, Zed and Matriarch with no early body are unbeatable late and irrelevant on turn 2.
- **The one-question test:** *by turn 3, can I see a fight I win outright?*

---

## 10. Sideboarding

**The board:** 2 Gust · 2 Acceptable Losses · 2 Ravenbloom Prefect · 1 Sabotage · 1 Hard Bargain · 1 Rampage · 1 Decree of Strength. Ten of ten, and per-matchup swaps live in the [matchup guide](khazix-voidreaver-matchups.md).

**Jun's principles:**

- **The curve comes first.** On the draw, trim 2-drops. On the play, trim some 3s and 5s. Not blindly: ask whether a 3-drop is a good turn-2 play *in this matchup*.
- **Keep the unit-to-spell balance.** Most board cards are spells and units are the easy cuts, but six units out for six spells is rarely right. Cut the least useful *spells* first.
- **Variety beats copies.**

**What each board card is for:**

| card | job |
|---|---|
| **Gust ×2** | Star-Crossed's job against small boards for 1 Energy, without bouncing your own unit. **Jun's main answer to Kennen replaying Ride the Wind**: wait for the Ride the Wind and react |
| **Acceptable Losses ×2** | each player kills one of their gear. You make no gear, so it is one-sided. It answers Zhonya's Hourglass and Equipment for 1 Energy, and Fizz replays it |
| **Ravenbloom Prefect ×2** | a 3-Might body that banishes a gear as it is played. **Jun: "incredibly oppressive" against Dazzling Aurora**, and he often brings it in on the draw to play on turn 1 |
| **Hard Bargain ×1** | counters a spell unless they pay 2. **Jun holds it for his own turn**, where it counters the one pump they kept open. This guide also uses it to protect flips, which can be on their turn. That is newer than Jun's write-up |
| **Sabotage ×1** | the third copy, at the three-copy cap |
| **Rampage ×1** | the third copy: removal that needs no fight |
| **Decree of Strength ×1** | a Power-free Sabotage that only works against **Mind** decks: LeBlanc, Jayce, Ezreal, Viktor, Mel, Kai'Sa, Lillia, Ornn, Diana, Teemo |

---

## 11. Mistakes that lose games

From Jun's list and this page's own:

1. **Impatience.** Casting spells before the board can use them. Jun: "you'll get punished by being impatient."
2. **A bad hold, or a missing one.** Holding is the most powerful way to score and the riskiest, because a failed hold often loses the game. Refusing a hold the game required loses it too.
3. **Hiding at a battlefield you then lose.** That is a 2-for-0 for them.
4. **Taking the even trade.** No XP, and with a card hidden there you lose that card too.
5. **Void Assault as a Charm.** Spent on a job another card could do, it is missing on the turn only it can win.
6. **Developing through Ambush.** Holding five runes open for Rengar while a good opponent simply develops past you.
7. **Flipping into open Chaos.** Or, for Evelynn, into open Calm.
8. **Trying to use the legend mid-fight.** Buff first, or hold it and spend the fight's XP after.
9. **Missing lethal**, for yourself or for them. From 5 points, check every turn.
10. **Not buffing before a fight a second trick would beat.** Jun's own on-camera mistake. If their open runes could hold two pumps, buff first.
11. **Holding when retreating is better.** The defender shows what is defending, and the attacker builds the fight around it. Walking a unit home is not conceding the point; it sets up the next turn (Jun).

---

## 12. Errata that change your cards

**Tideturner** *(cut 3 October; kept because §811.1.d.2 uses him as its worked example)* — **the reason he worked from Hidden at all.**
> **Was:** *…choose a friendly unit…* **Now:** *…choose **a unit you control at another location**…*

Without *at another location*, §811.1.d.2 would pin his target to his own battlefield and the card would do nothing from Hidden.

**Rengar, Trophy Hunter.**
> **Was:** *I can be played to a battlefield where there are enemy units.* **Now:** *I can **[Ambush]** to a battlefield where there are enemy units, even if you don't have units there.*

The permission now carries Ambush's Reaction timing and its re-check (§822.3).

**Fizz, Trickster** — cosmetic.

---

## 13. Questions to bring to Jun

Jun's list has the results, and this repo's standing rule is to pick between his lists, not to edit them. These are the questions this guide could not settle from the data, best answered by him or by your own games:

1. **One Switcheroo across all 56.** He brought it in against five of his six written matchups when it lived in the board. What made the board copy the one to cut?
2. **Four gear slots in a ten-card board.** Is that a read of the Yi, Akali and Azir lists, or of Jayce's Dazzling Aurora?
3. **How often is Matriarch actually standing where Tornado Warrior is hidden?** It is worth tracking in your journal.
4. **Evelynn's conversion rate.** She needs a controlled battlefield, a spare rune, a turn of setup, an empty slot, a lone target and no open Chaos or Calm. Track how many games she converts.
5. **Star Spring against Rek'Sai.** The symmetric trigger looks like a liability. Is it?
6. **Grim Resolve.** His guide said he does not run it because early pumps cost development. What changed by 3 October — and is it the card he holds for the five-XP Kha'Zix fight?

---

## Sources and method

**The list** is Jun's 3 October revision, written to the app's Supabase state on 3 October and read back via `scripts/rift deck "Kha'Zix Midrange"`.
- **Its results:** riftbound.gg's *All Best-of Legends Prizing Decks in Los Angeles* names Cuoemrei as the Best-of Kha'Zix winner, and the archive carries Cuoemrei's list, identical to this one. HTCG Dizoo's Orlando list is tournament-vouched in the archive (`tour: 1`, placing 36), at an event `data/events.json` records with 78 players. The Top 32 LA title is the deck author's claim.
- **Tier:** riftbound.gg's tier list of 1 October has Kha'Zix at Tier 4, noting it "didn't do much in third-party events before the bans either, but typically rose to the occasion during regional tournaments."

**Jun's guide** is distilled in [Jun's notes](khazix-voidreaver-jun.md), and every "Jun" here traces to it. His card-by-card chapter was written for his **pre-ban** list. Where a card's role changed since, this guide says so.

**Rule text** is `docs/rules-full.md`, with `docs/rules-faq.md` outranking it where they differ (the Hidden restrictions and the Tideturner errata are FAQ material). The **removed-in-response ruling** is `docs/rules-rulings.md`: secondary provenance, and it expires at the next Core Rules update. The **Star Spring save** is a composition of §811.1.b, §811.1.d.1 and §359.3.e.5, derived here, not a ruling.

**The combat table and opening-hand figures** are from the previous edition of this dossier and were computed against the 20 September archive (1,226 decks). They are Monte Carlo at 200,000 trials for combat and exact hypergeometric for hands. The combat model implements §465.2 and §466.3 directly. **Alternate printings are collapsed by name** on both sides of every join. Matchup-level figures are recomputed from the current window in the matchup guide. **The 3 October swap moves none of the combat or curve figures**: Tideturner and the second Merchant are both 2-Energy 2-Might units, and Ride the Wind and Grim Resolve both 2-Energy spells. Only the Hidden-card rate changes (36.3% → 28.4%).

**Release date:** riftbound.gg, *Radiance Preconstructed Decks & All Products*: launch 23 October 2026, Pre-Rift events 16–22 October.

**What this guide does not claim.** It does not claim the deck is Tier 1. It claims the list has the best Kha'Zix results of the post-ban format, that its plan is the one its designer describes, and that the rules here are checked.
