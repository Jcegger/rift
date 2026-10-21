---
title: Sivir — Gold-fuelled midrange (Radiance)
subtitle: Riftbound, Radiance season (from 23 October 2026) — the list, the plan and the sideboard
author: rift toolchain
date: 2026-10-21
---

**Untested.** A reasoned brew, not a net-deck: Sivir has one legal placed list since the bans, and no Radiance results yet. The source of truth is `builds/sivir-gold-midrange-radiance.json` (also on the site under Find a deck → Sivir). This page is a reading copy of it.

A midrange Sivir for Radiance. It starts from the only legal Sivir result, Randyyy's 146th of 2,165 at the Los Angeles RQ (a Fizz and Matriarch value list with lots of interaction), and changes 8 cards to make it midrange: it trades the cheap aggressive bodies for Radiance cards that make Gold, which turns the legend into a Power engine, plus Graves as a sweeper. Every other placed Sivir list ran Stacked Deck, which is banned, so there is almost nothing to net-deck. This is a reasoned brew and is marked untested.

## The list

**Legend:** Battle Mistress (Body/Chaos). When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me.

**Runes:** 5 Body / 7 Chaos · **Battlefields:** Sigil of the Storm, Sandswept Tomb, Zaun Warrens

### Units (21)

- **2× Tideturner** — 2, 2 Might. [Hidden] When you play me, you may choose a friendly unit. Move me to its location and it to my original location.
- **3× Ezreal, Prodigy** — 3+1P, 3 Might. When you play me, discard 1, then draw 2. Optional additional costs you pay cost [1] or [A] less.
- **3× Fizz, Trickster** — 3+1P, 3 Might. When you play me, you may play a spell from your trash with Energy cost no more than [3], ignoring its Energy cost. Recycle that spell after you play it.
- **1× Pyke, Returned** — 3, 3 Might. [Hidden] [Backline] Once each turn, when an enemy unit dies while I'm at a battlefield, play a Gold gear token exhausted.
- **3× Reckless Innovator** — 3, 3 Might. [Accelerate] When I become exhausted, choose one — Play a Gold gear token exhausted. Pay [Chaos] to draw 1.
- **3× Tornado Warrior** — 3, 3 Might. [Hidden] When you play me from face down, you may empower something here. Disempower it at end of turn.
- **1× Sivir, Mercenary** — 4+1P, 4 Might. [Accelerate] If you've spent at least [A][A] this turn, I have +2 Might and [Ganking].
- **3× Tail-Cloaked Matriarch** — 4, 4 Might. [Empower] [2][Chaos] When I become [Empowered], you may choose a unit in your trash with Energy cost no more than [3] and Power cost no more than [A]. Play it to your base, ignoring its cost.
- **2× Graves, Blasting Through** — 5+1P, 4 Might. When I attack or defend, deal damage equal to my Might to all enemy units here. I don't deal combat damage.

### Spells (16)

- **1× Gust** — 1. [Reaction] Return a unit at a battlefield with 3 Might or less to its owner's hand.
- **3× Punch First** — 1+2P. [Action] Give a unit +5 Might this turn.
- **2× Sabotage** — 1+1P. Choose an opponent. They reveal their hand. Choose a non-unit card from it, and recycle that card.
- **2× The Waters' Wage** — 1. [Hidden] Play a Gold gear token exhausted. If it's your turn and you played this from face down, play three ready Gold gear tokens instead.
- **2× Switcheroo** — 2+2P. [Hidden] [Action] Swap the Might of two units at the same battlefield this turn.
- **3× Rampage** — 3. As you play this, you may pay [Body] as an additional cost. Choose a friendly unit and an enemy unit. If you paid the additional cost, give the friendly unit +2 Might this turn. They deal damage equal to their Mights to each other.
- **2× Star-Crossed** — 3+1P. [Reaction] Return a friendly unit and an enemy unit to their owners' hands.
- **1× Primordial Roar** — 4+2P. [Show Off] a unit. If you showed off a unit, deal damage equal to that unit's Might to a unit.

### Gear (3)

- **2× Edge of Night** — 3. [Hidden] When you play this from face down, attach it to a unit you control here. [Equip] [Chaos]
- **1× Last Rites** — 3. [Equip] — [Chaos], Recycle 2 cards from your trash

### Sideboard (10)

- **1× Acceptable Losses** — 1. [Action] Each player kills one of their gear.
- **2× An Offer You Can't Refuse** — 2. [Action] Kill a gear. Its controller plays a Gold gear token exhausted.
- **2× Bedeviling Stranger** — 2. [Hidden] When you play me, choose a battlefield. If there are 4 or more units there, you may return an enemy unit there to its owner's hand.
- **2× Hard Bargain** — 2. [Reaction] [Repeat] [2] Counter a spell unless its controller pays [2].
- **2× Overzealous Fan** — 2. When I defend, you may kill me to move an attacking unit to its base.
- **1× Vex, Apathetic** — 4. [Deflect] When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn.

## The plan

- The engine is Power. Every Power cost you pay by recycling a rune triggers Battle Mistress for a Gold token, and the legend readies whenever an enemy unit dies. Nineteen of the forty cost Power, and hiding a card costs [A], so it fires almost every turn. Gold enters exhausted: a Gold made this turn is next turn's Power.
- Early, trade and disrupt rather than race. Hide Tornado Warrior, Tideturner or The Waters' Wage, play Reckless Innovator, and Sabotage the trick that would beat you. Ezreal and Fizz dig; Fizz replays Punch First, Rampage or Gust from the trash.
- Hidden has a limit: one facedown card per battlefield you control (§811.1.b), so the 12 Hidden cards compete for one or two slots. Give the slot to The Waters' Wage first: it's the one card that's weak from hand (one exhausted Gold instead of three ready). Tornado Warrior, Tideturner, Pyke and Switcheroo all play fine from hand.
- Battlefields: you get one per game, and both players can use it. In a best-of-3 you choose, and each one is retired after a decided game (§488.5.a), so you'll usually play all three. Take Sigil of the Storm first, because it's the one that favours you: your conquer there recycles a rune and Battle Mistress makes a Gold, while theirs just costs them a rune. Zaun Warrens' discard feeds Fizz and Matriarch from the trash.
- The turn the deck wants: flip The Waters' Wage for three ready Gold, then Sivir, Mercenary at 6 Might with Ganking, or Graves with Punch First already on him. Matriarch's Empower ([2] plus a Chaos Power, which is another Gold) replays an Innovator, Fizz or Pyke from the trash.
- Watch out for: gear removal doesn't touch Gold in play, but a tempo deck that never lets you hold a battlefield also stops The Waters' Wage, which must be hidden at a battlefield you control. And Graves deals no combat damage himself: the sweep is the damage.

## What changed from the anchor, and why

Anchor: Randyyy's list from the Los Angeles RQ (2 Oct 2026, 146th of 2,165), the only placed Sivir list with no banned card; the other 8 placings ran Stacked Deck. 8 in / 8 out from it, inside the 6–9 cards winners usually stray (docs/deckbuilding.md). Graves also appears in a posted Radiance Sivir brew ("Sivir - RAD", 9 Oct). No result backs this list.

- **−3 Traveling Merchant, +3 Reckless Innovator.** The brew system's top upgrade for Sivir (scripts/rift brew sivir). Same job, card flow, on a 3-Might body with Accelerate, plus a Gold token whenever it exhausts. Gold is next turn's Power, made without recycling a rune. It costs 3 Energy and no Power, so Tail-Cloaked Matriarch can replay it from the trash.
- **−3 Shadow Order Disciple, +2 The Waters' Wage.** Disciple is an aggro 2-drop that burns your own cards to attack. The Waters' Wage is the Gold plan's big turn: hide it for [A] (paid by recycling a rune, so Battle Mistress makes a Gold too), then from the next turn on, on your own turn, play it face up for free for three READY Gold. That's three Power at once: Sivir, Mercenary's +2 Might and Ganking (she needs 2 Power spent this turn) plus Punch First, or Graves a turn early.
- **−1 Acceptable Losses, +2 Graves, Blasting Through (and the third cut is Disciple's).** The midrange top end. When Graves attacks or defends he deals his Might to every enemy unit there instead of combat damage, so every pump becomes a sweeper: Punch First first, then move him in, and he deals 9 to each enemy. Every enemy that dies readies Battle Mistress for another Gold. Acceptable Losses moves to the sideboard for gear decks.
- **−1 Grim Resolve, +1 Primordial Roar.** Grim Resolve's XP does nothing in a Sivir deck, and the list had no hard removal: Rampage needs a unit to fight, Star-Crossed and Gust only bounce. Primordial Roar shows off a friendly unit and deals that unit's Might to any unit. Its value is locked in when it's played (§832.1.d.1), so a responding shrink doesn't save the target. Show off Sivir at 6 or a unit you just Punch Firsted. It costs 2 Power: that's Sivir's threshold met by itself, plus a Gold from the legend. It plays at turn speed, not mid-fight. 20 Oct, second pass.
- **Kept from the anchor.** Punch First, Rampage, Switcheroo, Star-Crossed, Sabotage and Gust: the interaction is the midrange. Fizz, Ezreal and Matriarch: the value engine. Tornado Warrior, Tideturner, Edge of Night and Pyke: the Hidden cards, which also make Gold when you hide them by recycling a rune.
- **Option: Black Market for Sandswept Tomb (the battlefield test).** Black Market: [A][A]: draw 1, each player once per turn. Spending those two Power switches Sivir on by itself (+2 Might and Ganking). Gold pays for it, so spare Gold turns into a card every turn, and paying with a rune recycle also fires Battle Mistress. The other posted Radiance Sivir brew runs it. The opponent can use it too, but no deck makes spare Power like this one. Sandswept Tomb is the slot because it's symmetric: it also discounts the opponent's 2-Power pumps (Punch First in Rengar, Yi and Kha'Zix). Corrected 21 Oct: it doesn't work against the Gold engine, as an earlier note said, because Battle Mistress fires once until she readies, so the Power it saves is mostly runes kept. One reading to check with a judge: that an ability's cost counts as Power "spent" for Sivir. Test it by logging which battlefield each game used (RiftAtlas best-of-1 picks one of your three at random).
- **Option: Bandle Scouts' Academy.** Last of the battlefield options. Only one card can be hidden per battlefield (§811.1.b), so it's at most one Gold per hide, and it rewards an opponent's Hidden cards just as much.

## Matchups and sideboarding

- **Kennen, Heart of the Tempest.** The most placed Radiance-preview legend (20). Its plan is one Rhasa the Sunderer turn off a full trash. Keep Sabotage for Last Rites or the spell that sets it up; Hard Bargain comes in. A reading, not a result.
- **Yasuo, Unforgiven (Spiderling).** A pile of Spiderlings on one battlefield is what Graves is for: one pumped attack hits every one of them. Bedeviling Stranger comes in, since its bounce needs 4+ units at a battlefield. A reading, not a result.
- **Gear decks (Mordekaiser's Baited Hook, Ornn, Azir).** Acceptable Losses and An Offer You Can't Refuse come in. An Offer hands them a Gold, so aim it at the gear that matters.
- **Aggro (Rengar, Ornn).** Overzealous Fan comes in to undo an attack; trade early and let Graves end the board.
- **Everything else.** Sivir has no Radiance-era matchup records. Log games in the journal; ten will say more than this box.

## Goldfish

Goldfish, 8,000 games, against the anchor list: Energy spent turns 1–4 17.3 on the play (anchor 17.6); 2.5 units by turn 3 (anchor 3.3); turn 5 spends 5.9 Energy (anchor 4.6); stuck on turn 3 9% (anchor 6%); 5 Body / 7 Chaos is the best rune split of the nine tried. Slower early and stronger late, which is what midrange buys. Consistency only: it plays no opponent, and it doesn't model Gold, Hidden or the legend.

## Testing it

Log each game in the journal (opponent, W/L), plus three words: **which battlefield** you had, **did the Waters' Wage turn happen**, **did Graves sweep**. After 10–20 games those answer the three open questions: Black Market vs Sandswept Tomb, whether The Waters' Wage earns its slot, and whether Graves wants a third copy.
