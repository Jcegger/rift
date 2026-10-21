---
title: Sivir — Gold-fuelled midrange (Radiance)
subtitle: Riftbound, Radiance season (from 23 October 2026) — the test deck: list, plan, sideboard and what to log
author: rift toolchain
date: 2026-10-21
---

**Untested, and locked in as the test deck (21 Oct).** A reasoned brew, not a net-deck: Sivir has one legal placed list since the bans, and no Radiance results yet. The source of truth is `builds/sivir-gold-midrange-radiance.json` (also on the site under Find a deck → Sivir). This page is a reading copy of it.

A midrange Sivir for Radiance, locked in as the test deck on 21 Oct after an audit. It starts from the only legal Sivir result, Randyyy's 146th of 2,165 at the Los Angeles RQ (a Fizz and Matriarch value list with lots of interaction), and changes 9 cards. Radiance cards that make Gold turn the legend into a Power engine, Graves turns every pump into a sweeper, and the early curve is kept because an empty turn 1 costs the battlefield the Gold plan needs. Every other placed Sivir list ran Stacked Deck, which is banned, so there is almost nothing to net-deck. This is a reasoned brew and is marked untested.

## The list

**Legend:** Battle Mistress (Body/Chaos). When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me.

**Runes:** 5 Body / 7 Chaos · **Battlefields:** Sigil of the Storm (When you conquer here, recycle one of your runes.), Zaun Warrens (When you conquer here, discard 1, then draw 1.), Black Market ([A][A]: Draw 1. Each player may use this ability once on their turn.)

### Units (23)

- **2× Bedeviling Stranger** — 2, 2 Might. [Hidden] When you play me, choose a battlefield. If there are 4 or more units there, you may return an enemy unit there to its owner's hand.
- **2× Tideturner** — 2, 2 Might. [Hidden] When you play me, you may choose a friendly unit. Move me to its location and it to my original location.
- **2× Traveling Merchant** — 2, 2 Might. When I move, discard 1, then draw 1.
- **3× Ezreal, Prodigy** — 3+1P, 3 Might. When you play me, discard 1, then draw 2. Optional additional costs you pay cost [1] or [A] less.
- **3× Fizz, Trickster** — 3+1P, 3 Might. When you play me, you may play a spell from your trash with Energy cost no more than [3], ignoring its Energy cost. Recycle that spell after you play it.
- **1× Pyke, Returned** — 3, 3 Might. [Hidden] [Backline] Once each turn, when an enemy unit dies while I'm at a battlefield, play a Gold gear token exhausted.
- **3× Reckless Innovator** — 3, 3 Might. [Accelerate] When I become exhausted, choose one — Play a Gold gear token exhausted. Pay [Chaos] to draw 1.
- **1× Tornado Warrior** — 3, 3 Might. [Hidden] When you play me from face down, you may empower something here. Disempower it at end of turn.
- **1× Sivir, Mercenary** — 4+1P, 4 Might. [Accelerate] If you've spent at least [A][A] this turn, I have +2 Might and [Ganking].
- **3× Tail-Cloaked Matriarch** — 4, 4 Might. [Empower] [2][Chaos] When I become [Empowered], you may choose a unit in your trash with Energy cost no more than [3] and Power cost no more than [A]. Play it to your base, ignoring its cost.
- **2× Graves, Blasting Through** — 5+1P, 4 Might. When I attack or defend, deal damage equal to my Might to all enemy units here. I don't deal combat damage.

### Spells (15)

- **1× Gust** — 1. [Reaction] Return a unit at a battlefield with 3 Might or less to its owner's hand.
- **3× Punch First** — 1+2P. [Action] Give a unit +5 Might this turn.
- **2× Sabotage** — 1+1P. Choose an opponent. They reveal their hand. Choose a non-unit card from it, and recycle that card.
- **2× The Waters' Wage** — 1. [Hidden] Play a Gold gear token exhausted. If it's your turn and you played this from face down, play three ready Gold gear tokens instead.
- **2× Switcheroo** — 2+2P. [Hidden] [Action] Swap the Might of two units at the same battlefield this turn.
- **3× Rampage** — 3. As you play this, you may pay [Body] as an additional cost. Choose a friendly unit and an enemy unit. If you paid the additional cost, give the friendly unit +2 Might this turn. They deal damage equal to their Mights to each other.
- **2× Star-Crossed** — 3+1P. [Reaction] Return a friendly unit and an enemy unit to their owners' hands.

### Gear (2)

- **1× Edge of Night** — 3. [Hidden] When you play this from face down, attach it to a unit you control here. [Equip] [Chaos]
- **1× Last Rites** — 3. [Equip] — [Chaos], Recycle 2 cards from your trash

### Sideboard (10)

- **1× Acceptable Losses** — 1. [Action] Each player kills one of their gear.
- **2× An Offer You Can't Refuse** — 2. [Action] Kill a gear. Its controller plays a Gold gear token exhausted.
- **1× Bedeviling Stranger** — 2. [Hidden] When you play me, choose a battlefield. If there are 4 or more units there, you may return an enemy unit there to its owner's hand.
- **2× Hard Bargain** — 2. [Reaction] [Repeat] [2] Counter a spell unless its controller pays [2].
- **2× Overzealous Fan** — 2. When I defend, you may kill me to move an attacking unit to its base.
- **1× Primordial Roar** — 4+2P. [Show Off] a unit. If you showed off a unit, deal damage equal to that unit's Might to a unit.
- **1× Vex, Apathetic** — 4. [Deflect] When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn.

## The plan

- The engine is Power. Every Power cost you pay by recycling a rune lets Battle Mistress exhaust for a Gold token, and she readies whenever an enemy unit dies. Gold enters exhausted: a Gold made this turn is next turn's Power, Power you didn't take from your runes. Eighteen of the forty cost Power, and hiding a card costs [A], so she fires most turns.
- Turns 1–3: develop and take a battlefield. A 2-drop on turn 1 (Tideturner, Merchant, Stranger), then Innovator or Fizz. Holding a battlefield is what gives you a hide slot. Sabotage the trick that would beat you.
- Hidden has a limit: one facedown card per battlefield you control (§811.1.b). Give the slot to The Waters' Wage first, then Tornado Warrior hidden where Matriarch stands (its flip empowers her, which fires her replay). Tideturner, Stranger, Pyke and Switcheroo all play fine from hand.
- The value chain: Matriarch's Empower ([2] plus a Chaos Power) replays a unit costing 3 or less from your trash. Replay Fizz and Fizz replays a spell (Punch First, Rampage, Gust, Star-Crossed), or replay Innovator or Ezreal for more cards.
- The turn the deck wants: flip The Waters' Wage for three ready Gold, then Sivir at 6 Might with Ganking, or Graves with Punch First already on him. Black Market turns any Gold left over into a card.
- Battlefields: you get one per game, and both players can use it. In a best-of-3 you choose, and each is retired after a decided game (§488.5.a), so you'll usually play all three. Take Sigil of the Storm first, because it favours you: your conquer there recycles a rune and Battle Mistress makes a Gold, while theirs just costs them a rune. Zaun Warrens' discard feeds Fizz and Matriarch. Black Market is best in slower matchups.
- Mulligan (goldfish, 10,000 games): keeping everything beats any rule. Most wanted in the opening 4: Tail-Cloaked Matriarch, any 2-drop, Reckless Innovator. Least wanted: spells and Ezreal.
- Watch out for: a deck that never lets you hold a battlefield also shuts off The Waters' Wage. Graves deals no combat damage himself: the sweep is the damage.

## Matchups and sideboarding

- **Kennen, Heart of the Tempest.** The most placed Radiance-preview legend (20). Its plan is one Rhasa the Sunderer turn off a full trash. Keep Sabotage for Last Rites or the spell that sets it up; Hard Bargain comes in for Edge of Night and Tornado Warrior. A reading, not a result.
- **Yasuo, Unforgiven (Spiderling).** A pile of Spiderlings on one battlefield is what Graves and Bedeviling Stranger are for. Bring in the third Stranger (for Edge of Night). A reading, not a result.
- **Gear decks (Mordekaiser's Baited Hook, Ornn, Azir).** Acceptable Losses and both An Offer You Can't Refuse come in for Edge of Night, Tornado Warrior and a Switcheroo. An Offer hands them a Gold, so aim it at the gear that matters.
- **Big units (Jayce's dragons, Baron, Astral Heron).** Primordial Roar comes in for Edge of Night: show off a pumped unit and deal its Might.
- **Aggro (Rengar, Ornn).** Overzealous Fan ×2 comes in for The Waters' Wage ×2. Against a race, a 2-drop that undoes an attack beats a slow Gold turn. Trade early and let Graves end the board.
- **Everything else.** Sivir has no Radiance-era matchup records. Log games in the journal; ten will say more than this box.

## Testing it

Log each game in the journal (opponent, W/L), plus three words: **which battlefield** you had, **did the Waters' Wage turn happen**, **did Graves sweep**. After 10–20 games those answer the open questions:

1. **The Waters' Wage:** if it rarely flips for three Gold (no battlefield held, or the slot taken), cut it for a second Tornado Warrior and a third Merchant.
2. **Graves:** if he's the best card in most games, try a third (for Edge of Night).
3. **Black Market vs Sandswept Tomb:** compare the games each was in play.

## What changed from the anchor, and why

Anchor: Randyyy's list from the Los Angeles RQ (2 Oct 2026, 146th of 2,165), the only placed Sivir list with no banned card; the other 8 placings ran Stacked Deck. 9 in / 9 out from it, at the top of the 6–9 cards winners usually stray (docs/deckbuilding.md), plus Black Market for Sandswept Tomb. Graves and Black Market also appear in a posted Radiance Sivir brew ("Sivir - RAD", 9 Oct). No result backs this list.

- **−1 Traveling Merchant, +3 Reckless Innovator.** Card flow on a 3-Might body with Accelerate, plus a Gold token whenever it exhausts. The brew system's top upgrade for Sivir (+0.97 by lib/roles.mjs over Merchant). Two Merchants stay for the curve (see the audit below); their loot also feeds Fizz and Matriarch from the trash. Innovator costs 3 Energy and no Power, so Matriarch can replay it.
- **−3 Shadow Order Disciple, +2 Bedeviling Stranger.** Disciple is an aggro 2-drop that burns your own cards to attack. Stranger is a 2-Might 2-drop that is Hidden but plays fine from hand, and bounces an enemy unit wherever 4+ units stand. Midrange boards get there, and against Yasuo's Spiderlings it's the best card you have. A third copy is in the sideboard.
- **−2 Tornado Warrior (3 → 1), −1 Edge of Night (2 → 1), +2 The Waters' Wage.** Only one card can be hidden at each battlefield (§811.1.b), and Tornado (empowers on its flip), Edge (attaches on its flip) and the Wage (three ready Gold on its flip) all want that slot. The Wage gets it: hide it for [A] (a rune recycle, so Battle Mistress makes a Gold too), then from the next turn on, on your own turn, play it face up for free for three ready Gold. That's Graves a turn early, or Sivir at 6 with Ganking plus Punch First. The one Tornado still empowers Matriarch on its flip, which fires her replay.
- **−1 Acceptable Losses, −1 Grim Resolve, +2 Graves, Blasting Through.** The top end. When Graves attacks or defends he deals his Might to every enemy unit there instead of combat damage, so Punch First him and then move him in for 9 to each enemy. Every death readies Battle Mistress for another Gold. Acceptable Losses moves to the sideboard; Grim Resolve's XP does nothing for Sivir.
- **Black Market for Sandswept Tomb.** Black Market: [A][A]: draw 1, once per turn for each player. Two Power switches Sivir on by herself (+2 Might and Ganking), spare Gold becomes a card every turn, and paying with a rune recycle fires Battle Mistress. The opponent can use it too, but no deck makes spare Power like this one. Sandswept Tomb is symmetric too, and it discounts the opponent's 2-Power pumps (Punch First in Rengar, Yi and Kha'Zix). One reading to check with a judge: that an ability's cost counts as Power "spent" for Sivir.
- **The audit (21 Oct).** The first draft cut 6 of Randyyy's 8 two-drops and ran 13 three-drops. In goldfish games (10,000 a list) it had 2.5 units down by turn 3 and was stuck on turn 3 9.6% of the time; Randyyy's list had 3.3 and 6.5%. With six 2-drops this list has 3.1 and 7.8%, and still spends more Energy on turn 5 than Randyyy's (5.2 against 4.6). Primordial Roar came out (6 total cost, turn speed, usually 4 damage) and went to the sideboard. Cutting The Waters' Wage measures slightly smoother (3.2 units by turn 3), but the goldfish can't count Gold, and the Wage is the thing under test.
- **Option: Bandle Scouts' Academy.** The other Gold battlefield. Only one card can be hidden per battlefield, so it's at most one Gold per hide, and it rewards an opponent's Hidden cards just as much. Behind Black Market.
- **Option: The Good Stuff.** A Radiance gear the other Sivir brew runs. Deploy, then discard 1 and draw 3 (the discard feeds Fizz and Matriarch), and it returns to hand when you hold there. Try it for Edge of Night or Last Rites if the deck runs out of cards.

## Goldfish

Goldfish, 10,000 games a list, against Randyyy's: Energy spent turns 1–4 16.5 on the play (his 16.7); 3.1 units by turn 3 (his 3.3); stuck on turn 3 7.8% (his 6.5%); turn 5 spends 5.2 Energy (his 4.6). 5 Body / 7 Chaos is the best rune split of the nine tried. Consistency only: it plays no opponent, and it doesn't model Gold, Hidden or the legend.
