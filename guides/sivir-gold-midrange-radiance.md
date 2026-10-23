---
title: Sivir — Gold-fuelled midrange (Radiance)
subtitle: Riftbound, Radiance season (from 23 October 2026) — the test deck, redone 21 Oct with the Hidden package: list, plan, sideboard and what to log
author: rift toolchain
date: 2026-10-21
---

> *Retired 23 Oct 2026:* the build file (`builds/sivir-gold-midrange-radiance.json`) and `scripts/sim-gold.mjs` behind this guide were swept with the brews, and are in git history. Its counts were taken from lists missing every alt-art card. Superseded by [Sivir Midrange](sivir-midrange.md), built 23 Oct.

**Untested; the test deck, redone 21 Oct.** A reasoned brew, not a net-deck: Sivir has one legal placed list since the bans, and no Radiance results yet. The source of truth is `builds/sivir-gold-midrange-radiance.json` (also on the site under Find a deck → Sivir). This page is a reading copy of it.

A midrange Sivir for Radiance, redone around riftbound.gg's read of the set ("10 Most Buffed Legends with Radiance", Den, 20 Oct). Sivir's Gold pays the Power cost of hiding, so the Chaos Hidden package — **Momentary Companion** first, "a 4/4 for just recycling a rune" — joins the Fizz and Matriarch value core. **Ziggs, Explosive** turns gear into defence. And the gear that "gear removal everywhere" punished is gone. It still starts from the only legal Sivir result, Randyyy's 146th of 2,165 at the Los Angeles RQ. In the Gold simulation it keeps every number the previous list had and adds 1.3–2.7 Might a game for free.

## The list

**Legend:** Battle Mistress (Body/Chaos). When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me.

**Runes:** 5 Body / 7 Chaos · **Battlefields:** Sigil of the Storm (When you conquer here, recycle one of your runes.), Black Market ([A][A]: Draw 1. Each player may use this ability once on their turn.), Bandle Scouts' Academy (When you hide a card here, play a Gold gear token exhausted.)

### Units (29)

- **2× Bedeviling Stranger** — 2, 2 Might. [Hidden] When you play me, choose a battlefield. If there are 4 or more units there, you may return an enemy unit there to its owner's hand.
- **2× Tideturner** — 2, 2 Might. [Hidden] When you play me, you may choose a friendly unit. Move me to its location and it to my original location.
- **2× Traveling Merchant** — 2, 2 Might. When I move, discard 1, then draw 1.
- **3× Ezreal, Prodigy** — 3+1P, 3 Might. When you play me, discard 1, then draw 2. Optional additional costs you pay cost [1] or [A] less.
- **3× Fizz, Trickster** — 3+1P, 3 Might. When you play me, you may play a spell from your trash with Energy cost no more than [3], ignoring its Energy cost. Recycle that spell after you play it.
- **1× Pyke, Returned** — 3, 3 Might. [Hidden] [Backline] Once each turn, when an enemy unit dies while I'm at a battlefield, play a Gold gear token exhausted.
- **3× Reckless Innovator** — 3, 3 Might. [Accelerate] When I become exhausted, choose one — Play a Gold gear token exhausted. Pay [Chaos] to draw 1.
- **2× Tornado Warrior** — 3, 3 Might. [Hidden] When you play me from face down, you may empower something here. Disempower it at end of turn.
- **3× Momentary Companion** — 4, 4 Might. [Hidden] When you play me, if it's not your turn, give me [Temporary]. *(Hide for one Power — which fires Battle Mistress — and flip it free next turn.)*
- **2× Ziggs, Explosive** — 4, 4 Might. [1], [Exhaust]: Play a Bomb gear token to a battlefield. When I defend, you may kill a friendly gear to give me +2 Might this turn.
- **1× Sivir, Mercenary** — 4+1P, 4 Might. [Accelerate] If you've spent at least [A][A] this turn, I have +2 Might and [Ganking].
- **3× Tail-Cloaked Matriarch** — 4, 4 Might. [Empower] [2][Chaos] When I become [Empowered], you may choose a unit in your trash with Energy cost no more than [3] and Power cost no more than [A]. Play it to your base, ignoring its cost.
- **2× Graves, Blasting Through** — 5+1P, 4 Might. When I attack or defend, deal damage equal to my Might to all enemy units here. I don't deal combat damage.

### Spells (11)

- **1× Gust** — 1. [Reaction] Return a unit at a battlefield with 3 Might or less to its owner's hand.
- **3× Punch First** — 1+2P. [Action] Give a unit +5 Might this turn.
- **2× Sabotage** — 1+1P. Choose an opponent. They reveal their hand. Choose a non-unit card from it, and recycle that card.
- **1× Switcheroo** — 2+2P. [Hidden] [Action] Swap the Might of two units at the same battlefield this turn.
- **2× Rampage** — 3. As you play this, you may pay [Body] as an additional cost. Choose a friendly unit and an enemy unit. If you paid the additional cost, give the friendly unit +2 Might this turn. They deal damage equal to their Mights to each other.
- **1× Star-Crossed** — 3+1P. [Reaction] Return a friendly unit and an enemy unit to their owners' hands.
- **1× Siren's Song** — 2. [Reaction] Move an enemy unit that moved this turn.

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
- Turns 1–3: develop and take a battlefield. A 2-drop on turn 1 (Tideturner, Merchant, Stranger), then Innovator or Fizz. From turn 2, hide a Momentary Companion at a battlefield you hold: one Power, which fires Battle Mistress for a Gold. Sabotage the trick that would beat you.
- Hidden has a limit: one facedown card per battlefield you control (§811.1.b). Give it to Momentary Companion where you need a holder, or Tornado Warrior where Matriarch stands (its flip empowers her, which fires her replay). Flip Companion on your own turn when you can: on the opponent's it gets Temporary and dies at your next Beginning Phase. Tideturner, Stranger, Pyke and Switcheroo all play fine from hand.
- The value chain: Matriarch's Empower ([2] plus a Chaos Power) replays a unit costing 3 or less from your trash. Replay Fizz and Fizz replays a spell (Punch First, Rampage, Gust, Star-Crossed), or replay Innovator or Ezreal for more cards.
- **Ziggs holds the battlefield.** For [1] and his exhaust, play a Bomb where he will defend. When he defends, kill that Bomb for +2 Might, and its Deathknell deals 2 to an enemy there (§187.12). An enemy death readies Battle Mistress. With no Bomb out, a Gold works for the +2, at the cost of a Power.
- Where the Gold comes from: Battle Mistress (once per turn, and again whenever an enemy unit dies) and Reckless Innovator, each time it exhausts. Spend it on Graves a turn early, Sivir at 6 Might with Ganking plus Punch First, or Black Market for a card.
- Battlefields: you get one per game, and both players can use it. In a best-of-3 you choose, and each is retired after a decided game (§488.5.a), so you'll usually play all three. Take Sigil of the Storm first, because it favours you: your conquer there recycles a rune and Battle Mistress makes a Gold, while theirs just costs them a rune. Bandle Scouts' Academy makes a Gold for every card you hide there, so hide on it first; it rewards an opponent's Hidden cards too, so it is weaker against Evelynn and Yasuo. Black Market is best in slower matchups.
- Mulligan (goldfish, 10,000 games, on the previous list; not re-run): keeping everything beats any rule. Most wanted in the opening 4: Tail-Cloaked Matriarch, any 2-drop, Reckless Innovator. Least wanted: spells and Ezreal.
- Watch out for: Graves deals no combat damage himself: the sweep is the damage. And Gold enters exhausted, so never plan a turn around Gold you made that turn.

## Matchups and sideboarding

- **Kennen, Heart of the Tempest.** The most placed Radiance-preview legend (20). Its plan is one Rhasa the Sunderer turn off a full trash. Keep Sabotage for the Last Rites or spell that sets it up; Hard Bargain comes in for Siren's Song and a Tornado Warrior. A reading, not a result.
- **Yasuo, Unforgiven (Spiderling).** A pile of Spiderlings on one battlefield is what Graves and Bedeviling Stranger are for. Bring in the third Stranger for a Tornado Warrior. A reading, not a result.
- **Riven, The Exile.** Her units enter ready at battlefields she holds, so the fight is over who holds. Siren's Song answers the unit she moves in; Ziggs and a flipped Companion hold against her. Vex, Apathetic (side) stuns the units she plays — in for Switcheroo. A reading, not a result.
- **Gear decks (Mordekaiser's Baited Hook, Ornn, Azir).** Acceptable Losses and both An Offer You Can't Refuse come in for a Tornado Warrior, Switcheroo and Siren's Song. An Offer hands them a Gold, so aim it at the gear that matters.
- **Big units (Jayce's dragons, Baron, Astral Heron).** Primordial Roar comes in for Siren's Song: show off a pumped unit and deal its Might.
- **Aggro (Rengar, Ornn).** Overzealous Fan ×2 comes in for a Tornado Warrior and Switcheroo. Against a race, a 2-drop that undoes an attack beats a slow hide; Ziggs is your best defender. Trade early and let Graves end the board.
- **Everything else.** Sivir has no Radiance-era matchup records. Log games in the journal; ten will say more than this box.

## Testing it

Log each game in the journal (opponent, W/L), plus a few words: **which battlefield** you had, **did Ziggs defend with a Bomb**, **did Graves sweep**, and **how much Gold** you made (roughly). After 10–20 games those answer the open questions:

1. **Ziggs, Explosive:** the simulation can't see him. If he's holding battlefields, keep both; if he sits exhausted making Bombs that never matter, the slot goes back to Rampage.
2. **Momentary Companion:** expected 1.3–2.7 free Might a game. If you rarely hold a battlefield to hide on, it plays as a 4-Energy 4/4 — still fine, but note it.
3. **Bandle Scouts' Academy:** in the games it's your battlefield, count the Gold it makes. Zaun Warrens (cut for it) is the fallback if it's under one a game.
4. **Graves:** if he's the best card in most games, try a third (for Switcheroo).

## The redo (21 Oct), and why

The authority is riftbound.gg's "10 Most Buffed Legends with Radiance" (Den, 20 Oct): its Sivir entry (Gold "alleviate[s] many power costs associated with hiding cards"; the best Las Vegas Sivir mixed "the best synergies available in the Chaos and Body domain"; a "cute synergy" with Ziggs, Explosive defending on Gold) and its Chaos Hidden-package picks. Evelynn's 85 Radiance-era lists — the crowd's Body/Chaos Hidden deck — agree: Momentary Companion 71%, Bedeviling Stranger 54%, Siren's Song 44%. riftbound.gg's Sivir legend guide (18 May) is an Unleashed Aurora deck and wasn't used.

- **+3 Momentary Companion, −1 Traveling Merchant, −1 Edge of Night, −1 Last Rites.** The article's top Chaos pick. For Sivir, the rune you recycle to hide it also fires Battle Mistress, so a hidden Companion is a Gold now and a free 4/4 next turn. In the Gold simulation it adds 1.3 free Might a game when you hold a battlefield half the time, 2.7 at 80%, with Gold, cards and Sivir's threshold unchanged. Edge of Night and Last Rites go: both are gear in a format where "gear removal was everywhere", and Edge competed for the one hide slot.
- **+2 Ziggs, Explosive, −1 Rampage, −1 Switcheroo.** The article's synergy, with a stronger line than it gives: a Bomb is a gear, so Ziggs can kill his own Bomb when he defends — +2 Might and 2 damage to an enemy there (§187.12), and a death readies Battle Mistress. He is a 4/4 holder for the battlefields the hide plan needs. The simulation has no combat, so it can't see him.
- **+1 Siren's Song, −1 Star-Crossed.** A 2-Energy Reaction, no Power, that moves an enemy unit that moved this turn. The article pairs it with Demon Shade; one Star-Crossed stays for the unit that didn't move.
- **Bandle Scouts' Academy for Zaun Warrens.** A Gold every time you hide there, with 11 Hidden cards in the list — and the article's "gears we can destroy" for Ziggs. Simulated: +0.3–0.4 Gold; Zaun's loot isn't modelled, so this rests on the synergy.
- **Tried and left out.** Bushwhack Trap (a second hide slot): no measurable effect at 0, 1 or 2 copies, and it's a gear. Gutter Guardian: its Power is lost when revealed on the opponent's turn (the article's warning). Demon Shade: the article's pair for rush legends, not a midrange hold.

## Before the redo: from the anchor, and why

Anchor: Randyyy's list from the Los Angeles RQ (2 Oct 2026, 146th of 2,165), the only placed Sivir list with no banned card; the other 8 placings ran Stacked Deck. 7 in / 7 out from it, inside the 6–9 cards winners usually stray (docs/deckbuilding.md), plus Black Market for Sandswept Tomb. Graves and Black Market also appear in a posted Radiance Sivir brew ("Sivir - RAD", 9 Oct). No result backs this list.

- **−3 Shadow Order Disciple, +3 Reckless Innovator.** Disciple is an aggro 2-drop that burns your own cards to attack. Innovator gives card flow on a 3-Might body with Accelerate, plus a Gold token whenever it exhausts. In the Gold simulation, it and Battle Mistress make nearly all of the deck's Gold. It costs 3 Energy and no Power, so Matriarch can replay it. All 3 Traveling Merchants stay for the curve; their loot also feeds Fizz and Matriarch from the trash.
- **−1 Tornado Warrior (3 → 2), −1 Edge of Night (2 → 1), +2 Bedeviling Stranger.** Only one card can be hidden at each battlefield (§811.1.b), and Tornado (empowers on its flip) and Edge (attaches on its flip) both want that slot. Stranger is a 2-Might 2-drop that is Hidden but plays fine from hand, and bounces an enemy unit wherever 4+ units stand. Midrange boards get there, and against Yasuo's Spiderlings it's the best card you have. A third copy is in the sideboard. Tornado hidden where Matriarch stands empowers her on its flip, which fires her replay.
- **−1 Acceptable Losses, −1 Grim Resolve, +2 Graves, Blasting Through.** The top end. When Graves attacks or defends he deals his Might to every enemy unit there instead of combat damage, so Punch First him and then move him in for 9 to each enemy. Every death readies Battle Mistress for another Gold. Acceptable Losses moves to the sideboard; Grim Resolve's XP does nothing for Sivir.
- **Black Market for Sandswept Tomb.** Black Market: [A][A]: draw 1, once per turn for each player. Two Power switches Sivir on by herself (+2 Might and Ganking), spare Gold becomes a card every turn, and paying with a rune recycle fires Battle Mistress. In the Gold simulation it adds about 0.5 cards a game (it's in play a third of the time), but that sim can't model the Tomb's discount, so the comparison flatters it. That's why it's the first thing to test. Sandswept Tomb is symmetric too: it discounts the opponent's 2-Power pumps (Punch First in Rengar, Yi and Kha'Zix). One reading to check with a judge: that an ability's cost counts as Power "spent" for Sivir.
- **The audit (21 Oct): curve.** The first draft cut 6 of Randyyy's 8 two-drops and ran 13 three-drops. In goldfish games (10,000 a list) it had 2.5 units down by turn 3 and was stuck on turn 3 9.6% of the time; Randyyy's list had 3.3 and 6.5%. With seven 2-drops this list has 3.2 and 7.1%, and still spends more Energy on turn 5 than Randyyy's (5.6 against 4.6). Primordial Roar came out (6 total cost, turn speed, usually 4 damage) and went to the sideboard.
- **The audit (21 Oct): Gold, and The Waters' Wage cut.** Jay's catch: the curve goldfish can't see Gold, Sivir's whole engine. scripts/sim-gold.mjs models it: Power from recycled runes, Battle Mistress, Gold, Hidden and the one-per-battlefield slot, Innovator, Black Market and Sivir's threshold. 20,000 games a variant, holding a battlefield 50% or 80% of the time. The Waters' Wage flipped for three Gold only 0.17–0.37 times a game: it has to be drawn, hidden at a battlefield you hold, and still held next turn. It added about 1 Gold a game and moved nothing else (resources spent, Sivir at 6 Might by turn 5 at 90–92%, Graves by turn 6 at about 52%). So it's out, for a second Tornado and a third Merchant. Sivir's threshold is never the bottleneck. The Gold sim's limits: no opponent, and it assumes Innovator exhausts every turn after it lands.
- **Option: The Waters' Wage.** Cut on the Gold simulation. Worth trying back if games show you hold a battlefield nearly every turn — with the Academy in, a Wage hidden there is a Gold before it flips.
- **Option: The Good Stuff.** A Radiance gear the other Sivir brew runs. Deploy, then discard 1 and draw 3, and it returns to hand when you hold there. Try it for Switcheroo if the deck runs out of cards; it's a gear, so expect it to meet removal.
- **Option: Gutter Guardian.** Shows off a Hidden card for a Power of any domain. Try it for a Tideturner if Power is short.

## Goldfish

Curve goldfish (lib/sim.mjs), 10,000 games, against the previous list: 3.29 units by turn 3 (3.24); 2 units by turn 3 in 98% (97%); 17.3 Energy over turns 1–4 (16.6); turn 5 spends 6.5 (5.6); 5 Body / 7 Chaos is still the best rune split.

Gold goldfish (scripts/sim-gold.mjs, now modelling Momentary Companion, Bushwhack Trap and Bandle Scouts' Academy), 20,000 games, the battlefield drawn from the deck's three: Gold 6.8–7.1 a game (6.9); extra cards 1.39–1.40 (1.42); Sivir at 6 Might by turn 5 89–90% (90%); Graves by turn 6 52% (52%); free Might from Companion flips 1.3–2.7 (0). Consistency only: neither plays an opponent, so Ziggs and Siren's Song are invisible to both.
