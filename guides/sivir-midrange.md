---
title: Sivir Midrange — Deck Guide
subtitle: Riftbound, Radiance season (from 23 October 2026) — the list built together in decklab, how to play it, the rules it runs on, and the field it meets
author: rift toolchain
date: 2026-10-23
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main (Champion included) + 12 runes (5 Body / 7 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39. The Champion starts outside the deck (§103.3.a.1, §108.3.d)
**Collection status:** 11 to get, all Radiance cards: 3 Bedeviling Stranger, 3 Staunch Survivor, 2 Graves, Blasting Through, 1 Elnuk Herd; sideboard 1 Graves, 1 An Offer You Can't Refuse
**The list:** built a section at a time on 23 October in [decklab/sivir-midrange.md](../decklab/sivir-midrange.md), saved in the app as `Sivir — Midrange (decklab, 23 Oct)`
**Its results:** **none yet. Untested.** Its reference is Randyyy's list at the Los Angeles RQ (146th of 2,165, the only legal non-Aurora Sivir result in the data), which shares **42 of these 56 cards**: 27 of the 40, all 12 runes, the legend and two battlefields
**Good until:** the first Radiance results, or Riot's Radiance FAQ, whichever comes first. Re-read the rules sections when the FAQ lands, because it outranks the Core Rules.

**Companions.** [The worksheet](../decklab/sivir-midrange.md) is why each card is in. [strategy.md](../docs/strategy.md) is how to think about any turn, and [archetypes.md](../docs/archetypes.md) is what every opponent is trying to do. This page is how to play *this deck*.

---

## The short version

*The part worth reading before every session. Everything below expands it.*

**What the deck does.** Cheap bodies take battlefields early: they **attack slow decks and hold against fast ones**. Fights are won with tricks the Gold helps pay for, and hidden cards defend the holds. When trades thin the board, Tail-Cloaked Matriarch and Fizz bring bodies and tricks back from the trash, so you are still contesting battlefields after they run out. Mid-game you refocus on one battlefield, and **Sivir, Mercenary** takes the other or breaks their hold, to close from 6 or 7.

**The one rule that governs the deck.** The legend makes **one Gold each time it is ready and you recycle a rune**, and it readies at your Awaken and whenever enemy units die. Gold enters exhausted, so **this turn's Gold is next turn's Power** (§187.5). In steady state: recycle one rune a turn for the Gold, pay the rest of your Power with Gold. Two Power a turn then costs you one rune, not two.

**Midrange means choosing a role every game.** Ask *who is happier if nothing happens* ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). Against Kennen, Kai'Sa, Jayce and Mordekaiser that is them: **attack early**. Against Riven, Rengar, Rek'Sai and Evelynn it is you: **hold**, and let them attack into your hidden cards. Misjudging the role is how midrange loses.

**Your turn, in order:** check for lethal, both players → count your Power and Gold → **take the open battlefields** → buff before you move → develop → **hide behind a strong hold** → start the fights → keep a Reaction up if it is spare.

**Five facts about Hidden.**

| | |
|---|---|
| To hide | Your turn, **Open State**, pay `[A]` (a Gold pays it), at a battlefield **you already control** (§811.1.b) |
| One per battlefield | The Facedown Zone holds **one card** (§107.3.b.1) |
| When you can flip it | **The next turn**, not this one. From then on it has **Reaction** and is played ignoring its base cost, Energy and Power (§811.1.b, §204.1.a) |
| Where it acts | **That battlefield.** A unit lands there; a play effect's or a spell's targets are chosen there (§811.1.d.1–.3) |
| If you lose the battlefield | The card is **trashed and revealed**, and the Power you spent on it is gone (§107.3.d, §323.6.a, §422.4) |

**The three things that are not what they look like.**
1. **Rampage has no Action.** It is removal on your own turn, never a trick inside a fight.
2. **Matriarch revives once.** Empowered is permanent (§443) and her Empower is "only if not Empowered", so one revive per time she is on the board. Star-Crossed or Emperor's Dais resets her.
3. **Mercenary needs two Power spent this turn** to be 6 Might with Ganking. Accelerate's Chaos is one of them; Ezreal's discount can take it away.

**The three ways this deck loses:**
1. Hiding a card at a battlefield you then lose: a 2-for-0, and the Power with it.
2. Going wide into a sweeper turn (Kai'Sa's Thousand-Tailed Watcher, Graves-like effects): commit what you need, not everything.
3. Playing the wrong role: holding against a ramp deck until its top end arrives, or racing a deck that wants you to attack into it.

---

## 1. What the deck is trying to do

Every deck values a position differently ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). This one values **battlefields held by cheap bodies, then cards in hand, then the closer.** It does not need any one card to work. That was the design brief: complexity welcome, dependence not.

**Four jobs, in order of priority.** Every card in the 40 does at least one of these, and was picked for the highest one it does:

| tier | job | the cards |
|---|---|---|
| 0 | **win: points from holding and conquering** | everything below serves this |
| 1 | **presence and fights:** bodies on battlefields, winning fights there | Staunch Survivor, Bedeviling Stranger, Tideturner, Graves, Elnuk Herd, Mercenary; Punch First, Rampage, Switcheroo, Ride the Wind, Edge of Night |
| 2 | **staying power:** replacing what was spent | Ezreal, Traveling Merchant, Fizz, Matriarch; the legend's Gold |
| 3 | **denial:** breaking their plan or their scoring | Star-Crossed, Gust, Sabotage, Rampage, Graves; most of the sideboard |
| 4 | **engine perks** | no dedicated slots. Trash synergy and extra Gold are tie-breakers only |

**Three engines, none required.**
- **Trash and recursion.** The trash fills with choices: Traveling Merchant discards when it moves, Ezreal on play, Zaun Warrens on conquer, and units die in fights. A spell in the trash is ammunition for Fizz; a cheap unit is a revive for Matriarch. Matriarch reviving Fizz, who recasts a Punch First, is one chain.
- **Hidden.** Ten cards can hide. They defend a held battlefield for the `[A]` it costs to hide them, and are then played for nothing on the opponent's turn. Four are spells or gear, so an opponent's Vex, Apathetic (which stuns units we play, hidden ones included) does not shut the package off.
- **Gold.** The legend's Gold pays hides, Punch First's Body Power, Matriarch's Chaos, Fizz's recasts and Mercenary's Accelerate. Every one of the 40 except Traveling Merchant, Gust and the Energy-only units can spend Power, so the Gold never sits idle.

**Why midrange, and why these bodies.** Riftbound pays a point per battlefield per turn, held or conquered (§471, §472), so a 2-Might body that takes an open battlefield on turn 2 is already scoring. Midrange wins on cards that are good on their own and on attrition, having bodies and tricks left when the opponent does not. That is what the recursion is for: the game is long enough for Matriarch and Fizz to matter only if the early bodies kept you level on points.

**Going wide early, tall late.** Early, every battlefield you put a body on is a question they must answer ([strategy.md §1](../docs/strategy.md#1-the-board-is-not-the-position)): ignore it and it scores, spend too much on it and your base is stronger for the next wave. Mid-game, stop spreading. Pick the battlefield you will hold, back it with a hidden card, and send Mercenary at the other.

---

## 2. The game in four stages

### Opening (turns 1–2)

**Turn 1: a 2-drop.** You start with 2 runes, 3 going second (§487.7). Staunch Survivor is the best turn-1 play: 2 Energy and one Body Power, and **recycling that Body rune makes your first Gold** (exhausted; it readies at your next Awaken). Traveling Merchant, Bedeviling Stranger or Tideturner are the Energy-only alternatives and keep the runes on the board.

**Where to put it.** A unit plays to your base or to a battlefield you control (§355.2.a), so on turn 1 it goes to base and moves next turn. Moving onto an open battlefield is a Conquer when the showdown closes (§348.2.a): 1 point, and now you control a battlefield to hide at and to play units onto.

**Turn 2: take the open battlefield, then develop.** Move first, develop after. A move reveals less than a board full of new units, and the battlefield you take is where you can now play units and hide. Two 2-drops, or a 2-drop and a hide, is a normal turn 2 with 4 runes and a Gold.

**The earliest hide is turn 2**, and only behind a hold that is hard to break. A hidden card at a battlefield you lose is trashed with the Power you spent (§323.6.a).

### Midgame (turns 3–5)

**Turn 3 is the first real decision: Ezreal or Fizz, a third body, or a trick held up.** Ezreal discards 1 and draws 2, and from then on discounts every optional additional cost you pay by `[1]` or `[A]` (Rampage's Body, Mercenary's Accelerate). Fizz needs a spell in the trash to be more than a 3-Might body. If the trash is empty, Ezreal first.

**Turns 4–5: the engine turns.** Matriarch costs 4; her Empower another 2 Energy and one Chaos. A turn-4 Matriarch empowered on turn 5, or both in one turn with 6 runes, revives the best unit in the trash to your base: Fizz (who recasts a spell), Ezreal (who draws 2), or whatever body the fight just cost you. Remember she does this **once** per time on the board.

**Score with expendable bodies, keep the engine at home.** A 2-Might body holding a battlefield is doing its job even when it dies: the kill readied their legend, not yours, but your next turn retakes it with a body back from the trash. Matriarch and Ezreal are worth more in your base than as defenders.

**Hold when it is cheap.** A held battlefield with a hidden card behind it is the "backed by a punish" kind of hold ([strategy.md §1](../docs/strategy.md#1-the-board-is-not-the-position)). The opponent attacks into a card they cannot see, and your flip costs nothing on their turn.

### Reaching 6

**Refocus.** Stop contesting both battlefields evenly. Choose the one your board can hold through their best turn, put the hidden card there, and keep Mercenary's turn ready for the other. Count Power before you start: Mercenary with Accelerate is 5 Energy and two Chaos Power (a Gold pays one), and Punch First on her is two Body Power more.

### Closing (6–8 points)

**From 5 points on, check for lethal every turn, for both players** ([strategy.md §0](../docs/strategy.md#0-the-order-of-every-decision)):

| you are at | and you | result |
|---|---|---|
| **7** | **hold** a battlefield at the start of your turn | **you win.** Hold points are not gated (§473.1.a.1) |
| **7** | conquer, having scored the other battlefield this turn | you win |
| **7** | conquer, **not** having scored the other this turn | **you draw a card instead** (§473.1.b.1) |
| **6** | hold one, then conquer the other | win |
| **6** | hold nothing, conquer both | win. The first conquest makes 7 and scores that battlefield |

**The closing turn is usually: hold one in your Beginning Phase, then Mercenary takes the other.** Accelerate makes her enter ready (§805); with two Power spent she has +2 Might and Ganking, so she can be played to the battlefield you hold and move straight to the other (§810). The attacker must kill every defender or be recalled (§468.1.a): count their Might, and keep Punch First (+5) or a Star-Crossed (take their last defender out) for it.

**At 7, hold with a split board and a facedown card behind it.** If they cannot take the battlefield you hold, you win at the start of your next turn.

**If they are at 7 and holding**, they win at the start of their turn unless you take the battlefield now. That outranks every plan you had.

### Playing from behind

Behind on points is fine if you are ahead on cards. Midrange's late game is the recursion: let them score once, take the battlefield back with a body from the trash, and trade one-for-one until their hand is empty and yours is not. What you cannot do is fall so far behind that the hold clock beats you: **a player holding both battlefields wins in four turns** ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). Break a double hold the turn it appears, even at a bad price.

---

## 3. Your turn, in order

Before your Main Phase, three things happen on their own: you **ready everything**, the legend and last turn's Gold included; you **Hold every battlefield you control**, 1 point each; then you channel 2 runes and draw 1 (§315). Hold scoring comes *before* Channel and Draw.

**Step 0 — check for lethal, for both players.** If you have a line to 8 now, take it. If they have one next turn, stopping it comes first.

**Step 1 — count your Power.** Ready runes by domain, ready Gold, and whether the legend is ready (it is, after Awaken). The plan for the turn is usually: **one rune recycled for Power (makes a Gold), everything else paid by Gold.** If you expect enemy units to die this turn, the legend readies again and a second recycle makes a second Gold.

**Step 2 — take the open battlefields first.** Move onto any battlefield nobody holds before you play anything. It is a Conquer when the showdown closes (§348.2.a), and it opens options: a unit can be played to a battlefield you control (§355.2.a), and you can only hide at one you control.

**Step 3 — buff before you move into a fight.** Once a fight starts, attack triggers go on the chain before anyone has focus, and a showdown is Action or Reaction only (§466.2.d.1, §310). Punch First on Graves *before* he moves is a 9-damage attack trigger; after, it is too late for the trigger. Edge of Night's Equip is an activated ability with no Action, so it is your turn, Open State only (§381).

**Step 4 — develop, and decide where each body lands.** Units enter exhausted (§143.4) unless Accelerate says otherwise, and a standard move costs exhausting the unit (§144), so nothing you play this turn walks anywhere this turn. Exhausted units still defend (§466.2.c.3). Where it enters is the decision:
- **base**, ready to move next turn;
- **a battlefield you control**, to defend it now;
- Tideturner played to a battlefield **swaps with a unit you control elsewhere**: it brings an exhausted conqueror home and stands in for it.

**Step 5 — hide.** Only at a battlefield you control and expect to keep. Pick the card for the fight you expect: Tideturner (bring Graves in), Switcheroo (swap Might with their pumped unit), Elnuk Herd (+3 at Reaction speed), Edge of Night (+2 that stays), Bedeviling Stranger (bounce an attacker if 4+ units end up there).

**Step 6 — start the fights.** The turn player chooses the order when several are staged (§463.1). Fight the one whose result changes the other first.

**Step 7 — keep a Reaction up if it is spare.** Star-Crossed (3 Energy, 1 Power) and Gust (1 Energy) are the deck's Reaction-speed answers from hand. Don't skip development to hold them up unless the matchup asks for it.

**Timing, for every card in the deck:**

| speed | cards | when |
|---|---|---|
| **Reaction** | Star-Crossed, Gust; every Hidden card once face down; Gold | any time, including on the chain (§813) |
| **Action** | Punch First, Switcheroo, Ride the Wind | your turn, and any showdown, either player's (§806) |
| **No keyword** | Rampage, Sabotage, all units from hand, Matriarch's Empower, Edge of Night's Equip, hiding | your turn, Open State, no showdown |

---

## 4. The legend and the Gold

**The text.** *When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me.* A Gold token is *"[Reaction] Kill this, exhaust: Add [A]"* (§187.5): a Power of any domain, once, at Reaction speed.

**What it actually gives you.** Paying Power means recycling a rune (§164.2.b). The rune goes to the bottom of the rune deck and your board is one smaller. The legend turns the first recycle each turn into a Gold that pays a Power **next** turn without recycling anything.

| Power you spend each turn | runes recycled each turn, without the legend | with the legend, once a Gold is banked |
|---|---|---|
| 1 | 1 | 1 (pay it by recycling, to keep the Gold coming) or 0 (pay with the Gold, and get none next turn) |
| 2 | 2 | **1** |
| 3 | 3 | 2, or 1 if an enemy unit died between recycles |

**Three rules that follow.**
1. **Recycle at least once a turn**, or the Gold stops. A Gold paid with a Gold makes nothing.
2. **Kills mid-turn are worth a second Gold.** The legend readies when enemy units die, so recycle again after a fight you won. Any trick that kills on their turn readies it too.
3. **Gold is next turn's Power, at Reaction speed.** It enters exhausted and readies at your Awaken, so last turn's Gold pays for Star-Crossed or a flip on their turn as well as your own.

**What the Gold is not.** It is not Energy: Gold adds Power only. It does not make the deck cheaper to play, only cheaper in runes, and it does not replace the second rune you channel each turn. The legend does not make a Gold when Gold pays the Power, because no rune was recycled.

**Sigil of the Storm, read for this legend.** *When you conquer here, you must recycle one of your runes.* For an opponent that is a lost rune. For you it is a recycle, so it makes a Gold if the legend is ready.

---

## 5. Hidden, precisely

**Hiding** costs `[A]`, during an Open State on your turn, at a battlefield you control, one card per battlefield (§811.1.b, §107.3.b.1). Hiding is not playing, and opens no chain (§811.1.c.1). Gold pays the `[A]`.

**Flipping** is playing the card from face down, from your next turn on, with Reaction, ignoring its base cost (§811.1.b). That is Energy **and** Power: Switcheroo's two Power and Elnuk Herd's six Energy are both ignored (§204.1.a).

**The battlefield pin** (§811.1.d):
- A hidden **unit** must be played to that battlefield (§811.1.d.1).
- A hidden **spell's** targets are chosen at the battlefield it was played from (§811.1.d.2). Switcheroo from face down swaps two units **there**.
- A hidden **permanent's play effect** chooses its targets at the battlefield it was played to (§811.1.d.3). Elnuk's +3 goes to a friendly unit there; Edge of Night attaches to a unit you control there.
- A target whose own text makes that impossible is exempt (§811.1.d.4). **Tideturner** chooses "a unit you control at another location", so it reaches your base (its errata exists for exactly this, Vendetta FAQ).
- **The pin is read off the source** (§811.1.d.3.a). If the hidden unit is removed before its play effect resolves, the effect does nothing. Bedeviling Stranger and Tideturner are both inside Gust's range: count their open Chaos before you flip.

**A facedown card cannot answer a flip at the other battlefield.** In a 1v1 your facedown card and theirs are always at different battlefields, because you can only hide at a battlefield you control (rules.md, Hidden). Only a Reaction from hand crosses over.

**If you lose the battlefield, the card is trashed** at the next cleanup, revealed (§323.6.a). That is why you hide only behind strong holds. The trashed card is not wasted entirely: a Switcheroo there is Fizz ammunition, a Tideturner or Stranger a Matriarch revive.

**The ten Hidden cards, and what each does from face down:**

| card | from face down | best against |
|---|---|---|
| 3 Bedeviling Stranger | a 2-Might body there; if 4+ units are there, return an enemy unit there to hand | go-wide attacks (Rek'Sai, Rengar) |
| 2 Tideturner | swaps with a unit you control elsewhere: brings Graves, Mercenary or Staunch Survivor into the fight | any attack into a hold |
| 1 Elnuk Herd | +3 Might to a friendly unit there, then recycles itself into your deck | a close fight; it comes again later |
| 2 Switcheroo | swap Might of two units there, this turn | their pumped unit; Graves's trigger |
| 2 Edge of Night | attaches to a unit you control there: +2 Might, kept | a fight you will win by 1 or 2 |

**Opponents' Hidden.** Their facedown card can only act at its own battlefield. Taking that battlefield trashes it (§323.6.a). Against Evelynn, conquering is also denial.

---

## 6. Card by card

### The legend and the champion

**Battle Mistress** — see §4. Body/Chaos sets the colours: every card in the 75 is Body, Chaos or both.

**Sivir, Mercenary** (Chosen Champion: 4 Energy, 1 Chaos; 4 Might; Accelerate; *if you've spent at least two Power this turn, +2 Might and Ganking*). Always available from the Champion Zone, never drawn. **With Accelerate she pays two Power by herself** (her own and Accelerate's Chaos) and enters ready at 6 Might with Ganking: played to a battlefield you control, she can move to the other at once (§805, §810). Any Power counts, a hide or a Gold included, and "this turn" also covers the opponent's turn, so on their turn two Power spent makes her a 6-Might defender. **Ezreal's discount can take Accelerate's Chaos away**, leaving her at one Power spent; pay it or spend another. She is not revivable by Matriarch (4 Energy); Star-Crossed or Emperor's Dais returns her to hand to replay.

### Presence: the 2-drops

**Staunch Survivor** (2 Energy, 1 Body; 2 Might; Assault 2, Shield 2) — **4 Might in every fight**, attacking or defending (§807, §814). The turn-1 play: the Body rune you recycle makes your first Gold. On the watch list: no Body-colour legend has a good Radiance finish yet, so it is chosen on its text, not results.

**Bedeviling Stranger** (2 Energy, Chaos; 2 Might; Hidden) — a body either way. Its bounce needs **4 or more units at the chosen battlefield, both sides counted**, itself included once it is there. From hand, it chooses any battlefield; from face down, its own (§811.1.d.3).

**Traveling Merchant** (2 Energy, Chaos; 2 Might) — *when I move, discard 1, then draw 1*. Every move, standard or by effect, filters a card and stocks the trash. Tideturner's swap and Ride the Wind are moves too.

**Tideturner** (2 Energy, Chaos; 2 Might; Hidden) — swaps places with a unit you control at another location. From face down: Graves into a fight. From hand: play it to a battlefield you control and bring an exhausted unit home, or revive it with Matriarch and swap a battlefield unit back to base.

### Staying power

**Ezreal, Prodigy** (3 Energy, 1 Chaos; 3 Might) — discard 1, draw 2, and **optional additional costs you pay cost `[1]` or `[A]` less** (§356.4.c, §356.4.f.1): Rampage's Body for free, Mercenary's Accelerate for one less. Choose the discard: a spell for Fizz, a cheap unit for Matriarch.

**Fizz, Trickster** (3 Energy, 1 Chaos; 3 Might) — plays a spell from your trash with Energy 3 or less, ignoring its Energy; **you still pay its Power**; then it is recycled. Every spell in the deck qualifies. Best targets: Punch First (+5, two Body Power), Star-Crossed (a two-for-one), Rampage (removal, no Power). Without a spell in the trash Fizz is a 3-Might body, which is fine.

**Tail-Cloaked Matriarch** (4 Energy, Chaos; 4 Might; Empower `[2]` + Chaos) — when she becomes Empowered, play a unit from your trash with Energy 3 or less and Power 1 or less to your base, ignoring its cost. Eligible: Staunch Survivor, Bedeviling Stranger, Traveling Merchant, Tideturner, Ezreal, Fizz. It is **played**, so its play effect fires. Her Empower is an activated ability without Action: your turn, Open State (§381). **Once per time on the board** (§442.1.b, §443). The deck must, and does, win games where she never appears.

### The top end

**Graves, Blasting Through** (5 Energy, 1 Body; 4 Might) — *when I attack or defend, deal damage equal to my Might to all enemy units here; I don't deal combat damage.* The damage is read when the trigger resolves (§359.3.f.2), so everything that raises his Might before then multiplies across their board. While the trigger is on the chain, only Reactions can be played (§310). A unit moved into a fight late gets its designation and its trigger (§466.2.c.3.a, §383.4.e): that is what Tideturner exploits. Against Deathknell decks, his blast fires their triggers too.

**Elnuk Herd** (6 Energy, Body; 5 Might; Hidden) — a hide, not a 6-drop. From face down it costs nothing, gives +3 Might to a friendly unit there at Reaction speed, and **recycles itself** to the bottom of your deck to come again. From hand it is a 5-Might body for 6 and no Power, which is the fallback, not the plan. One copy: hides are limited, and a second clogged early hands.

### Fights

**Punch First** (1 Energy, 2 Body; Action) — +5 Might this turn. Mercenary to 11, Graves to a 9-damage blast. Two Body Power is the price, so a Gold pays half. **Riven's Defy cannot counter it** (Defy reaches one Power at most, and a card's cost is its printed cost, §206).

**Rampage** (3 Energy, Body; **no timing keyword**) — your unit and theirs deal damage equal to their Mights to each other; paying the optional Body gives yours +2 first (free with Ezreal). Main-phase removal on your turn. Not a fight trick.

**Switcheroo** (2 Energy, 2 Chaos; Hidden; Action) — swaps the Might of two units at the same battlefield, this turn. Best target: the unit they just pumped. From face down, at Reaction speed, in response to Graves's trigger: Graves takes their biggest unit's Might and blasts with it. Defy cannot counter it either (two Power).

**Ride the Wind** (2 Energy, 1 Chaos; Action) — moves a friendly unit and readies it. The card names no destination limit (§451.1), so it moves battlefield to battlefield, into a fight already running (the late arrival defends or attacks, §466.2.c.3.a), or home. It is the double-conquest turn: conquer with a unit, then send it to the other battlefield, ready.

**Edge of Night** (3 Energy, Chaos gear; +2 Might attached; Hidden; Equip Chaos) — from face down it attaches to a unit you control there for free (the errata's "(here)", Spiritforged errata). From hand it goes to your base and Equips for one Chaos on your turn. The +2 stays while attached (§137.3) and returns home if the unit dies (§459.1).

### Denial

**Star-Crossed** (3 Energy, 1 Chaos; Reaction) — returns a friendly unit and an enemy unit to their owners' hands. It needs both. Uses, in order of value: take their last defender out so your attackers win; save your unit from removal while bouncing theirs; reset your own Fizz, Ezreal or Matriarch to replay. A unit returned to hand becomes a new object (§124.1).

**Gust** (1 Energy, Chaos; Reaction) — returns a unit at a battlefield with 3 Might or less to its owner's hand. Theirs or yours. Against a hidden unit's play effect, Gust the unit in response and the effect does nothing (§811.1.d.3.a).

**Sabotage** (1 Energy, 1 Body; no timing keyword) — they reveal their hand and you recycle a non-unit card from it. It must be cast before the fight opens. Decide whether you want their answer removed or spent ([strategy.md §5](../docs/strategy.md#5-pressure-is-the-removal-of-good-choices)).

### Battlefields

| game | battlefield | text | why |
|---|---|---|---|
| **1** | **Zaun Warrens** | when you conquer here, discard 1, then draw 1 | low impact for both players; for us it stocks the trash |
| **going first** | **Emperor's Dais** | when you conquer here, you may pay `[1]` and return a unit you control here to hand, to play a 2-Might Sand Soldier here | the bounce replays Ezreal (draw 2), Fizz (another recast) or Matriarch (a fresh revive), and the Soldier keeps the battlefield. The strongest record of any battlefield in this format's good finishes |
| **going second** | **Sigil of the Storm** | when you conquer here, you must recycle one of your runes | lopsided: their recycle is a lost rune, ours is a Gold. Going second we also have the extra rune (§487.7) |

**Best-of-three.** A battlefield used in a decided game is removed for the match (§488.5); after a draw the same ones are used again (§488.5.a, TR §406.1.b). So game 1 is Zaun Warrens, and games 2 and 3 get the Dais and the Sigil in whichever order the play order points to. **The opponent can use your Dais too**: a Rengar or Rek'Sai player bounces an Ambush unit or a revealed one to replay it. Count that before taking it from them is worth a point.

---

## 7. Lines that win games

**1. The Graves defence.** Graves at base. A hidden Tideturner at the battlefield you hold. They attack. Flip Tideturner: it swaps with Graves, who arrives as a defender and triggers (§466.2.c.3.a, §383.4.e): 4 damage to every attacker. With Edge of Night equipped to him at base the turn before, 6. Their pump spells can't save a unit from damage dealt before combat damage.

**2. Graves with Switcheroo.** Graves defends at a battlefield with a hidden Switcheroo. His trigger goes on the chain. In response, flip Switcheroo (Reaction from face down) and swap his Might with their biggest attacker. The trigger resolves with his new Might (§359.3.f.2). A hidden Elnuk Herd does the same job for +3.

**3. The Mercenary close.** You are at 6 and hold battlefield A. Beginning Phase: hold, 7. Play Mercenary with Accelerate to A (5 Energy, two Chaos, a Gold paying one): ready, 6 Might, Ganking. Punch First on her (+5) before she moves, then move A → B: an 11-Might attacker that has to kill every defender (§468.1.a). Keep Star-Crossed for the defender she can't kill. Conquering B with A already scored this turn is the eighth point (§473.1.b).

**4. Matriarch into Fizz into the trick.** Empower Matriarch (2 Energy, one Chaos). Fizz comes back from the trash to your base and recasts Star-Crossed or Punch First from the trash, paying only its Power. One activation, a 3-Might body and a spell, and your legend probably made a Gold along the way.

**5. Dais replay.** Conquer Emperor's Dais with Ezreal there. Pay 1, return Ezreal, a Sand Soldier holds the battlefield. Replay Ezreal: discard 1, draw 2. With Matriarch instead, the replay is a fresh Empower and a second revive.

**6. The double conquest.** One unit takes battlefield A (a Conquer). Ride the Wind moves it to B and readies it. If B is open, a second Conquer; if it is held, that unit plus whatever else you moved attacks. With Traveling Merchant as the unit, each move also filters a card.

**7. The Stranger blowout.** A hidden Bedeviling Stranger at a battlefield where they attack wide. If the fight puts 4 or more units there (theirs plus yours plus the Stranger), flip it and return their best attacker to hand before damage.

**8. Star-Crossed on the last defender.** You attack into two defenders and kill one. Star-Crossed returns the other (and a spent unit of yours to replay later): you are the only player left there, so you win the fight and conquer.

---

## 8. The numbers

**Opening hands.** Chance of at least one of each in the cards seen so far (39-card library, no mulligan; both players draw on turn 1 in a 1v1):

| card or group | copies | opening 4 | by turn 1 | turn 2 | turn 3 | turn 4 | turn 5 |
|---|---|---|---|---|---|---|---|
| a unit at 2 Energy | 11 | 75% | 83% | 88% | 92% | 95% | 97% |
| a Hidden card | 10 | 71% | 79% | 85% | 90% | 93% | 95% |
| Star-Crossed or Gust | 5 | 44% | 52% | 59% | 65% | 70% | 75% |
| Fizz or Matriarch | 4 | 36% | 44% | 50% | 56% | 62% | 67% |
| Ezreal | 3 | 28% | 35% | 40% | 46% | 51% | 56% |
| Punch First | 3 | 28% | 35% | 40% | 46% | 51% | 56% |
| Matriarch | 2 | 20% | 24% | 29% | 33% | 37% | 41% |
| Graves | 2 | 20% | 24% | 29% | 33% | 37% | 41% |

Ezreal and Traveling Merchant draw beyond this, so the real figures are higher by the middle turns. **Matriarch at 41% by turn 5 is why the deck may not need her**: more than half your games she arrives late or not at all.

**The goldfish** (`lib/sim.mjs`, 20,000 games, no opponent). It does not make the legend's Gold or charge for hiding, and it plays no fights.

| | on the play | on the draw |
|---|---|---|
| Energy spent, turns 1–4 | 15.8 | 17.5 |
| units on board by turn 3 | 3.4 | 3.7 |
| two units by turn 3 | 97% | 99% |
| no play on turns 1–2 | 0% | 0% |
| a card stuck on its colour, turn 3 | 11% | 9% |

The stuck figure is pessimistic: a ready Gold pays either colour. **Runes: 5 Body / 7 Chaos** was the best of every split from 3/9 to 9/3 on the same shuffles (16.6 Energy over turns 1–4, 10% stuck; 4/8 and 6/6 within 0.1 Energy but stuck 14% and 12%).

**The rune formula.** To cast something costing E Energy and P Power you need **max(E, P) runes on the board, at least E of them ready** (rules.md, Resources): the same rune can be exhausted for Energy and then recycled for Power. Gold pays Power without a rune. Examples:

| play | cost | runes needed |
|---|---|---|
| Staunch Survivor | 2 Energy, 1 Body | 2, one Body |
| Punch First | 1 Energy, 2 Body | 2 Body, or 1 Body and a Gold |
| Mercenary with Accelerate | 5 Energy, 2 Chaos | 5, two Chaos or one and a Gold |
| Matriarch, then Empower | 4, then 2 Energy and 1 Chaos | 6 in one turn |
| a hide | `[A]` | any rune, or a Gold |

**Runes on the board** at the start of turn *t*: 2*t* going first, 2*t* + 1 going second, minus every rune you have recycled. That last term is what the Gold reduces.

**Combat sizes.** Fights are two totals, attacker assigns first (§467.2.c), and lethal is damage at or above Might (§142.4.b).

| unit | Might in a fight | with Punch First | with Edge of Night | with Elnuk |
|---|---|---|---|---|
| Traveling Merchant, Stranger, Tideturner | 2 | 7 | 4 | 5 |
| Ezreal, Fizz | 3 | 8 | 5 | 6 |
| Staunch Survivor | **4** (Assault or Shield 2) | 9 | 6 | 7 |
| Matriarch, Graves | 4 | 9 | 6 | 7 |
| Mercenary, two Power spent | **6** | **11** | 8 | 9 |

Rampage with its Body paid adds +2 before the exchange.

---

## 9. Mulligans

You set aside up to 2, draw that many, and the set-aside cards go to the bottom (§117). One pass.

**What the goldfish says.** "Keep all" spends the most Energy over turns 1–4 of the four policies tried (keep all, bottom 5+, bottom 4+, need a 2-drop). Per card, on the same shuffles, keeping it rather than bottoming it is worth, in Energy over turns 1–4:

| keep | Energy | | keep | Energy |
|---|---|---|---|---|
| Tail-Cloaked Matriarch | +1.5 | | Fizz, Trickster | +0.1 |
| Tideturner | +0.9 | | Ezreal, Prodigy | +0.1 |
| Graves | +0.9 | | Ride the Wind | −0.1 |
| Traveling Merchant | +0.8 | | Switcheroo | −0.5 |
| Bedeviling Stranger | +0.7 | | Staunch Survivor | −0.5 |
| Edge of Night | +0.7 | | Punch First | −0.7 |
| Elnuk Herd | +0.3 | | Sabotage | −0.8 |

**How to read it.** The simulator measures only Energy spent, and charges every Power as a recycled rune with no Gold back. It undervalues every card that pays Power early, which is why Staunch Survivor shows negative when it is the deck's best turn-1 play. Treat it as "cheap Energy-only bodies and the curve's 4s and 5s are keeps".

**The working rule** (a reading of the plan, not tested):
- **Keep** any hand with a 2-Energy unit and one of: a second 2-drop, Ezreal, Matriarch, or a hidden card.
- **Bottom** a second copy of a situational spell (Sabotage, Punch First, Switcheroo) when the hand has no early body.
- **Bottom Elnuk Herd** from a hand without a 2-drop: it is a hide, and a hide needs a battlefield first.
- **Bottom up to two** from a hand with no unit at 2 Energy. It happens one hand in four (75% to have one).
- Against Kai'Sa or Jayce (attack early) keep the hand with the most bodies; against Rengar or Rek'Sai (hold) a hand with a hidden card and Graves is better than a third 2-drop.

---

## 10. Matchups and sideboarding

**Who you will meet.** The field is a forecast until Radiance's first results: pilots at the online preview events before release, and the experts' median tier (`data/field.json`, 23 Oct). Preview events are previews, not results.

| legend | tier | preview pilots | our role | the sequence that decides it |
|---|---|---|---|---|
| Kennen, Heart of the Tempest | S | 27 | **attack early** | pressure before the trash fills and Rhasa arrives |
| Kai'Sa, Daughter of the Void | A | 13 | **attack early** | race the 7-drops; don't overcommit into Watcher |
| Riven, The Exile | S | 11 | **hold** | they develop onto held battlefields ready; break or keep that |
| Rengar, Pridestalker | A | 7 | **hold** | ambushes need their units already there |
| LeBlanc, Deceiver | A | 7 | **hold, bounce** | answers that don't kill |
| Jayce, Defender of Tomorrow | A | 6 | **attack early** | nothing on its board for three turns; Gutter Palace |
| Rek'Sai, Void Burrower | B | 6 | **hold** | the widest board by turn 3 |
| Mordekaiser, Iron Revenant | B | 6 | **attack early** | its trash is its Power |
| Evelynn, Agony's Embrace | A | 5 | **attack early** | taking a battlefield trashes what it hid there |
| Akali, Rogue Assassin | B | 5 | **hold** | pings and Falling Star on 2-Might bodies |

**Sideboarding rules.** Swaps are 1-for-1 between games, and you may count their sideboard at any time (TR §403.6). Runes, legend and battlefields never change (TR §403.4.b). **The in-and-out plans below are starting plans, reasoned from the cards, not tested.** Log what you change and why in the worksheet.

**The sideboard, and what each card is for:**

| card | what it does | in against |
|---|---|---|
| 2 Vex, Apathetic | stuns any unit they play while she is at a battlefield (hidden, Ambush and revealed ones too), and it can't move that turn; Deflect taxes the answer (§809) | Rengar, Rek'Sai, Riven, Evelynn, LeBlanc, Kennen |
| 2 An Offer You Can't Refuse | kills a gear at Action speed; they get an exhausted Gold | Jayce, Riven, Kennen, Akali |
| 1 Ravenbloom Prefect | banishes itself to banish a gear as they play it | Jayce, Riven |
| 1 Graves, Blasting Through | the third Graves | Rek'Sai, Rengar, LeBlanc |
| 1 Disposal Order | Reaction: recycle 3 cards from their trash, then draw 1 | Kennen, Mordekaiser, LeBlanc |
| 1 Flash | Reaction: move 2 of your units to base | Kai'Sa, Akali |
| 1 Unyielding Spirit | Reaction: prevent all spell and ability damage this turn | Kai'Sa, Akali, LeBlanc, Jayce |
| 1 Sabotage | the second Sabotage | Kai'Sa, Jayce, Kennen |

### Kennen, Heart of the Tempest — attack early

**What it does.** The legend empowers whenever Kennen plays a card from anywhere but hand, and spends it on Assault 2. So it plays from the trash: Fizz and Matriarch (the same ones you run), Lightning Rush's Flow, Kennen, Storm of Shuriken, Nocturne off the top. Rhasa the Sunderer costs 1 less per card in its trash. It holds Gust, Star-Crossed and Switcheroo for your fights.

**The plan.** It fears early pressure before the trash fills. Take both battlefields early with cheap bodies, make it answer on its own turn, and keep the points coming before Rhasa. Its Star-Crossed and Gust are your tricks too: buff before you move, so a bounce in response does not strand a pump.

**Board.** In: Disposal Order, Sabotage, 1 Vex, Apathetic (its trash plays are plays). Out: 1 Graves, Elnuk Herd, 1 Edge of Night. Disposal Order in response to Rhasa's cast is not possible (the cost is set when it is played), so cast it at the end of their turn or in response to a Flow play, while the trash is its fuel.

### Kai'Sa, Daughter of the Void — attack early

**What it does.** Removal into a top end: Hextech Ray (3 to a unit at a battlefield), Falling Star (3 and 3), Bellows Breath (1 to up to three units, repeatable), then Thousand-Tailed Watcher (7 Energy: −3 Might to every enemy unit that turn, to a minimum of 1), Brynhir Thundersong (opponents can't play cards that turn), Time Warp (10 Energy, an extra turn).

**The plan.** It is slow (3.5 average cost) and fears being raced. Pressure from turn 1 and make every removal spell a one-for-one on a 2-drop. **Don't overcommit**: Watcher does not kill, it makes their fight that turn lopsided, so the units you committed are the ones you lose. On the turn it can play Brynhir, your hidden cards and Reactions are off: play around it by not needing them that turn.

**Board.** In: Unyielding Spirit, Flash, Sabotage. Out: 1 Bedeviling Stranger (four units at one battlefield is rare against this much removal), Elnuk Herd, 1 Edge of Night. Sabotage's best target is Time Warp or the sweeper.

### Riven, The Exile — hold

**What it does.** Units it plays to battlefields it controls enter ready. Riven, Broken Blade and Reckless Innovator trigger on becoming exhausted (buff, stun, ready, Gold, draw), Ki Burst exhausts on demand, Blade of the Exile equips by exhausting a unit. Interaction: Defy, Discipline, Star-Crossed, Rebuke.

**The plan.** Its engine works on battlefields it already controls, so **deny it the hold** and make it attack into yours. Hide behind your hold; flip when it commits. **Punch First and Switcheroo dodge Defy** (it counters spells with at most one Power), so they are the tricks to lean on; Star-Crossed, Gust and Rampage can be countered.

**Board.** In: 2 Vex, Apathetic, 1 An Offer You Can't Refuse, Ravenbloom Prefect. Out: 1 Gust (its key units are 4 Might), Elnuk Herd, 1 Sabotage, 1 Traveling Merchant. Vex stuns the units it plays and stops them moving that turn, which is most of what "enter ready" buys.

### Rengar, Pridestalker — hold

**What it does.** Thirty units; the legend gives +1 Might each time it plays one. Ambush units (Inferna, Nidalee, Rengar, Trophy Hunter) are played to a battlefield where **it already has units** (§822.1.b), and Rengar, Pouncing to a battlefield it is attacking. Thrill of the Hunt replays a unit anywhere.

**The plan.** Its fights are planned from hand. Hold, and make it attack into a hidden card. A battlefield where it has no units cannot be Ambushed. Graves is the punish for a wide attack, and Bedeviling Stranger's four-unit bounce turns on easily here.

**Board.** In: 2 Vex, Apathetic, 1 Graves. Out: 1 Sabotage (ten spells, few worth it), 1 Ride the Wind, 1 Edge of Night.

### LeBlanc, Deceiver — hold, and bounce rather than kill

**What it does.** Thirty units, most with Deathknell (Ruined Rex deals 4 on death, Glasc Mixologist replays a small unit from the trash), and Karthus, Eternal makes every Deathknell trigger twice. The legend copies a unit at a battlefield it conquers or holds.

**The plan.** It wants its units to die. Star-Crossed and Gust remove without killing, so no Deathknell fires. Graves's blast fires every Deathknell at once: use it when the board after the triggers still favours you. Each enemy death readies your legend, so the trades at least pay Gold.

**Board.** In: Disposal Order (Mixologist's targets), Unyielding Spirit (Ruined Rex's 4), 1 Vex, Apathetic. Out: 1 Sabotage (seven spells), Elnuk Herd, 1 Rampage (a kill).

### Jayce, Defender of Tomorrow — attack early

**What it does.** Almost no units: ramp gear (Platewyrm Egg), card flow, then Dazzling Aurora (a free unit off the top every end of turn), Elder Dragon, Catalyst of Aeons. **Gutter Palace: at the start of its Beginning Phase, with exactly 4 cards in hand and exactly 4 units at battlefields, it wins.** 63% of its lists in the field data run Aurora.

**The plan.** It has nothing on the board for three turns. Take both battlefields and keep them; every ramp turn is two points. Watch Gutter Palace's count on your turn: make sure it does not start its turn with exactly 4 units at battlefields and exactly 4 cards in hand.

**Board.** In: 2 An Offer You Can't Refuse, Ravenbloom Prefect, Sabotage. Out: 2 Graves (no wide board to blast), 2 Gust (few units, and Elder Dragon is far above 3 Might). Unyielding Spirit is the fifth card in if Elder Dragon's ping is what beats you.

### Rek'Sai, Void Burrower — hold

**What it does.** The widest board by turn 3 of any deck (4.2 units in its goldfish). When it conquers, the legend reveals 2 and plays one; Rek'Sai, Breacher gives those Accelerate; Undertitan gives the others +2 the turn it lands.

**The plan.** Hold, and let Graves and the Stranger punish the width. A conquest is its engine, so a hold it cannot break is also denial.

**Board.** In: 1 Graves, 2 Vex, Apathetic (its revealed units are played, so Vex stuns them). Out: 1 Sabotage, 1 Ride the Wind, 1 Edge of Night.

### Mordekaiser, Iron Revenant — attack early

**What it does.** The legend banishes units or gear from its own trash for Power, so deaths fuel the next play. Mordekaiser, Twice Slain (7 Energy, Assault 3) survives by killing another friendly unit; Mordekaiser, Dominating (9) discards to kill a unit or gear when played or attacking.

**The plan.** It is ramp: race it. Star-Crossed on a 7- or 9-drop is tempo it cannot afford, and a bounce goes around Twice Slain's death replacement.

**Board.** In: Disposal Order (its trash is its Power). Out: 1 Edge of Night.

### Evelynn, Agony's Embrace — attack early

**What it does.** Nearly everything is Hidden. The legend draws when it plays from face down; Evelynn, In Control scores a point when she holds with a facedown card there; Evelynn, Consuming grows on every flip.

**The plan.** Its hidden cards can only act at their own battlefield, and **taking that battlefield trashes them** (§323.6.a). Attack the battlefield it hid at. Gust its hidden units in response to their play effects (§811.1.d.3.a).

**Board.** In: 2 Vex, Apathetic (units played from face down are played). Out: Elnuk Herd, 1 Sabotage.

### Akali, Rogue Assassin — hold

**What it does.** Movement: the legend pulls a unit home out of a showdown, Akali, Deadly Weapon pings when she moves, Akali, Silent can't be chosen outside combat. Falling Star and Astral Heron behind.

**The plan.** Its pings and Falling Star are efficient into 2-Might bodies. Don't spread thin: fewer, bigger bodies (Staunch Survivor, Matriarch, Mercenary). Akali, Silent can be bounced only in combat.

**Board.** In: Unyielding Spirit, Flash, 1 An Offer You Can't Refuse. Out: 1 Bedeviling Stranger, 1 Traveling Merchant, Elnuk Herd.

**Not in the table, still worth a line.** Kha'Zix (Body/Chaos, B) runs your tricks and Matriarch too; its Voidreaver only pays for fights it wins outright, so an even trade is a good result for you. Master Yi, Wuju Bladesman and Irelia (both S, 4 preview pilots each) are covered in [archetypes.md](../docs/archetypes.md).

---

## 11. Mistakes that lose games

Each one is a type from [strategy.md §8](../docs/strategy.md#8-reviewing-a-game), so the match journal's tallies stay comparable.

| mistake | type | instead |
|---|---|---|
| hiding at a battlefield you then lose | conversion | hide only behind a hold that is hard to break |
| paying every Power from runes while a Gold sits ready | conversion | one recycle a turn for the Gold, the rest from Gold |
| paying every Power from Gold and never recycling | conversion | the Gold stops; recycle once |
| planning Rampage as a fight trick | state | it has no Action: use it on your turn, before the fight |
| empowering Matriarch with nothing worth reviving | conversion | she revives once per stay; wait for Fizz, Ezreal or a lost body in the trash |
| playing Mercenary with one Power spent | state | count it: Accelerate plus her cost is two, unless Ezreal discounted one |
| buffing after the move | state | buff, then move; triggers go on the chain before anyone has focus |
| attacking into a hold you can't clear | state | the attacker must kill every defender (§468.1.a); otherwise No Result and a recall |
| going wide into Kai'Sa's Watcher turn | pressure | commit what the battlefield needs |
| holding against a ramp deck until it ramps | role | ask the role question each turn; attack Kennen, Kai'Sa, Jayce, Mordekaiser early |
| missing their hold at 7 | terminal | if they are at 7 and holding, take that battlefield now |
| hard-casting Elnuk Herd at 6 when a hide was possible | conversion | it is a hide first |

---

## 12. Errata and open questions

**Errata that touches the deck** (current text wins over the printed card):
- **Edge of Night** (Spiritforged errata): "attach it to a unit you control (here)". It still attaches at the battlefield you played it from; the wording fixes a recall during resolution.
- **Tideturner** (Vendetta FAQ): restricted to a unit you control, and allowed to reach another location under the Hidden rules.
- **Emperor's Dais** (Vendetta errata): rewritten as pay-to-do, "pay `[1]` and return a unit … to play a Sand Soldier".

**Open questions, to ask a judge or settle with the Radiance FAQ:**
1. **Battlefield choice and play order in games 2 and 3.** The battlefields are selected during setup (§488.5) and the previous game's loser chooses who plays first (TR §407.4). Whether you always know the order before you present a battlefield was not checked here. The plan assumes you do; if not, the Dais and the Sigil are both fine either way.
2. **Mercenary on the opponent's turn.** Her condition reads "this turn"; this guide reads that as whichever turn it is, so two Power spent on their turn makes her a 6-Might defender. Plain on the card, not confirmed by a ruling.
3. **Graves's trigger and a late Reaction.** Damage "equal to my Might" is read on execution (§359.3.f.2), so a Reaction in response changes it. Confirmed in the rules; the Switcheroo line (§7.2) relies on it.
4. **Vex, Apathetic against our hidden units**, the opponent's copy: it stuns units we play, and a hidden unit is played. The four Hidden spells and gear are unaffected.

---

## Sources and method

- **The list** was built in [decklab/sivir-midrange.md](../decklab/sivir-midrange.md), one section at a time and agreed before the next: how it wins, roles and slots, card by card, checks. Every card was argued against the slot it competed for, and every one of the 110 spells and gear legal for Sivir was checked (colours, bans, other champions' signatures).
- **Reference list:** Randyyy's Los Angeles RQ Sivir (Riot's Top Decks, 146th of 2,165).
- **riftbound.gg, "10 Most Buffed Legends with Radiance"** (Den, 21 Oct 2026): Sivir's Gold pays for hiding. A brainstorm, not tested.
- **MoreThatMillGuy, "Sivir Is INSANE Again & MIDRANGE IS BACK!?"** (14 Oct 2026): Staunch Survivor on turn 1, Graves with Tideturner and Switcheroo, Ezreal with Rampage. His rules questions all checked out.
- **Midrange theory:** StarCityGames, "What's in a Midrange?"; Sullivan on the midrange deck; Ultimate Guard on choosing battlefields.
- **Rules:** [rules.md](../docs/rules.md) first, then the verbatim [rules-full.md](../docs/rules-full.md) and the [FAQ](../docs/rules-faq.md). Core Rules 2026-10-09.
- **Numbers:** `lib/sim.mjs` (goldfish, mulligans, rune sweep), exact hypergeometric odds for the opening-hand table, `data/field.json` for the field.
- **Opponents:** [archetypes.md](../docs/archetypes.md) and their cards' current text (`data/cards.json`, errata applied).

## What this guide does not claim

- **That the deck is good.** It has no results. It is a reasoned list with a real reference behind it, and the first games will move it. Log them in the worksheet's section 5.
- **Who is favoured in any matchup.** The matchup notes say what each one turns on. There is no record behind them.
- **That the sideboard plans are right.** They are starting plans from the cards' text.
- **That the field is the field.** It is a forecast from previews and expert tiers, before a single Radiance event.
- **The simulator's view of the deck's speed.** It cannot see the Gold, hiding or fights, and undervalues every card that pays Power early.
