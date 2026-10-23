---
title: Sivir for Nexus Night — deckbuilding worksheet
subtitle: Sivir, Battle Mistress (Body/Chaos), Radiance. A 3-0 at a Nexus Night, rebuilt from the decklab Sivir Midrange list. Built together, step by step.
started: 2026-10-23
status: list complete 23 Oct 2026 (sections 1, 2, 4) · section 3 and the full guide next
---

The second Sivir worksheet. The first, [sivir-midrange.md](sivir-midrange.md), is the base: its
list is where this starts, and every card in it has to earn its slot again under the goal below.
Same five sections (see [README.md](README.md)), each agreed before the next.

**Two method fixes from the first build** (23 Oct 2026):
- **Plan first, then slots.** The first build compared cards slot by slot against Randyyy's list,
  which cannot find a card for a job his list had no slot for. Here the plan's jobs come first,
  and every job is checked for what covers it.
- **Every card read, one by one.** All 178 legal units and 110 legal spells and gear, each
  placed with its own reason. Radiance cards have no results yet, so results never rank them.

**The base list** (the first worksheet, 23 Oct): 3 Staunch Survivor, 3 Bedeviling Stranger,
3 Traveling Merchant, 2 Tideturner, 3 Ezreal, Prodigy, 2 Fizz, Trickster, 2 Tornado Warrior,
2 Tail-Cloaked Matriarch, 2 Graves, Blasting Through, Sivir, Mercenary; 3 Punch First, 3 Rampage,
3 Star-Crossed, 2 Switcheroo, 2 Gust, 2 Sabotage; 2 Edge of Night. 6 Body / 6 Chaos. Zaun
Warrens, Emperor's Dais, Sigil of the Storm.

---

## 1. How it wins — agreed 2026-10-23

**The goal: three match wins at a Nexus Night.** Jay's store: 3 rounds, best of three, 50-minute
rounds, a mixed and casual field, low OPL (TR §205.2).

**What that asks of a deck, beyond being good:**

1. **Finishing inside the clock.** 50 minutes is about 16 minutes a game if all three are played.
   At time the active player finishes the turn, three more turns are played, and a game still on
   is won only by a player ahead by 2 or more points; otherwise it is a draw, and no new game
   starts (TR §408.2). **A drawn match is not a 3-0.** The first list is a hold deck that wins
   slowly, so speed is the biggest change.
2. **Breadth over narrow answers.** The field is unknown: the store locator has recorded no
   legends at any Nexus Night (README, the locator), and Jay expects precons, budget decks and
   homebrews beside a few net decks. A card that answers one deck is dead against most of this
   field. Flexible answers and our own threats are worth more; narrow answers go to the sideboard.
3. **Consistency over up to nine games.** Three matches is up to nine games. The deck has to
   work when its engine (Matriarch, the Gold) doesn't show up.

**How it wins, in one paragraph.** Cheap bodies take **both** battlefields early and keep
them: a player holding both wins in four turns, and that clock is what finishes games inside 16
minutes. Hidden cards defend the holds, pumps win the fights, and the recursion keeps bodies
coming. **The default role is the beatdown.** Against a mixed field most opponents will be
slower or less interactive than the online field the first list was built for; that is a
reading of what casual fields bring, not data, so it gets checked against Jay's first night. It
switches to holding only against decks that are faster than us (Rengar, Rek'Sai and other
go-wide decks).

**Goal tiers.** Each card earns its slot on its highest tier; lower tiers only break ties.

| tier | goal | changed from the first build |
|---|---|---|
| 0 | **win inside the clock: points every turn** | the clock is now part of tier 0. A card that scores, or speeds the double hold, ranks here |
| 1 | **presence and fights:** bodies on both battlefields, winning fights there | unchanged |
| 2 | **staying power:** replace what was spent | unchanged, but only as much as games last; a long game is the failure case |
| 3 | **denial, flexible only:** answers that work against anything | narrow answers move to the sideboard |
| 4 | **engine perks** | still 0 dedicated slots |

**Always on:** flexible, not fragile (from the first build); enough copies to be consistent; a
curve and colours that work; **and decisions fast enough to finish games** — complexity is
welcome where it wins fights, not where it only adds thinking time.

**Settled with Jay** (23 Oct 2026):
- **Beatdown by default: yes.** The store does bring meta decks (Irelia, for one), but nothing
  like Aurora. So the online field is a fair guide to the threats, minus Aurora, and breadth still
  matters for the homebrews and precons beside it.
- **Champion: Sivir, Mercenary,** unchanged.
- **How wide: two bodies a battlefield, and the hidden card is the third** (Jay asked Claude to
  decide). Measured on the same goldfish (`data/archetypes.json`, units on board by turn 3):

  | deck | units by turn 3 | Might by turn 4 | kind |
  |---|---|---|---|
  | Rek'Sai | 4.2 | 13.3 | truly wide |
  | Mordekaiser · Rengar · Kha'Zix · LeBlanc | 3.6–3.9 | 13.8–16.9 | wide-ish |
  | **this base list** | **3.5** | **14.3** | |
  | Kennen · Master Yi, Bladesman · Riven · Akali | 2.9–3.2 | 13.2–13.7 | hold and tempo |
  | Kai'Sa · Irelia | 2.5–2.8 | 11.9–14.4 | few, strong units |

  Sivir sits between the hold decks and the swarm: wider than Riven or Irelia, narrower than
  Rek'Sai, with more Might per body (Staunch Survivor fights at 4). Going wider than that is the
  wrong direction. The Gold pays Power, never Energy, so it adds no bodies. 2-Might bodies are what
  Kai'Sa's and Akali's area damage kill. And Body/Chaos has no go-wide payoff in the list's style.
  **So the target is enough bodies to contest both battlefields (about two each by turn 3–4), and
  the hidden card is the third defender at each.** It is width the opponent can't see or sweep
  until it flips, and the reason the Hidden package survives the beatdown role. Against Irelia,
  who fields the fewest units here (2.5 by turn 3), two battlefields of pressure make every turn
  two fights, which is the Kha'Zix guide's advice against her too.

---

## 2. Roles and slots — step 1, jobs and targets (agreed 23 Oct 2026)

Jobs come from section 1's plan, not from a reference list. Targets start from what winning
lists look like and bend to the plan. **Good finishes by measured style** (`lib/placing.mjs`
`goodFinishes`, medians): aggro (44 lists) 22 units, 24 cards at 2 Energy or less, 4 at 5+,
average 2.67; midrange (48) 26 units, 18 cheap, 3 at 5+, 2.75; tempo (138) 18 units, 24 cheap,
5 at 5+, 2.67. A beatdown deck that holds both battlefields sits nearest aggro.

Cards count toward every job they do, so the column does not sum to 40.

| job (tier) | target | base list | gap |
|---|---|---|---|
| **1. Take both battlefields early** (1): units at 2 Energy or less; units in all | 12–14 cheap units; 22–24 units; 22–24 cards at 2 Energy or less | 11 cheap units; 22 units; 20 cards at 2 or less | **1–3 cheap cards short** |
| **2. Keep both** (1): Hidden cards (two battlefields to hide at now); Reactions from hand | 10–12 Hidden; 4–6 Reactions | 11 Hidden; 5 (3 Star-Crossed, 2 Gust) | none |
| **3. Win the fight there** (1): pumps and swaps, Action or Reaction | 7–9 | 7 (3 Punch First, 2 Switcheroo, 2 Edge of Night), plus 2 Tornado | none |
| **4. Close inside the clock** (0): ways to break a hold; ways to score more than 1 a battlefield | 8–10 breakers; **2–3 scorers** | 10 breakers (3 Star-Crossed, 3 Rampage, 2 Graves, 2 Gust) and Mercenary; **0 scorers** | **2–3 scorers** |
| **5. Keep cards coming** (2): draw and recursion | 6–8 (games are shorter now) | 10 (3 Ezreal, 3 Merchant, 2 Fizz, 2 Matriarch) | **2–4 over** |
| **6. Flexible denial** (3): answers and information that work against anything | 2–3, narrow answers to the sideboard | 2 Sabotage | none |
| curve | average 2.5–2.7; 2–4 at 5+ | 2.50; 2 at 5+ | none |

**What the gaps say before any card is named:** move 2–4 slots from staying power (job 5) to
cheap bodies (job 1) and to scoring (job 4). An open question for step 2: whether protecting a
hidden card from a lost battlefield is a job of its own (Pack of Wonders) or a play rule.

### Step 2a — the two gaps, every candidate read (draft, 23 Oct 2026)

The legal pool for Sivir: 188 units and 110 spells and gear (colours, bans, Standard, other
champions' signatures; `data/cards.json`, errata applied).

**Job 1, cheap bodies: every legal unit at 2 Energy or less** (tokens excluded):

| card | what it does here | verdict |
|---|---|---|
| Staunch Survivor · Bedeviling Stranger · Traveling Merchant · Tideturner | in the base list | see below |
| **Windsinger** (SFD, 1 Might, Hidden) | returns another unit at a battlefield with 3 Might or less to hand. From hand on our turn it clears a defender so a battlefield can be taken; from face down it does it at Reaction speed. Body, hold-breaker and Hidden in one | **in, 2** |
| **Irresistible Faefolk** (UNL, 1 Might) | when it moves to a battlefield, move an enemy unit to that battlefield. Pulls their only defender off the other battlefield so it can be taken, or into a fight we win. Jun's Kha'Zix turn-1 play | **in, 1** |
| Evelynn, Entrancing (UNL, 2 Might, Hidden, Backline) | flipped on our turn, pulls an enemy unit from elsewhere to her battlefield. Faefolk's job, but needs a hide spot first | bench: first back if Faefolk works |
| Sinister Poro (UNL, 1 Might, 1 Power) | when it attacks, pay 1 to send an enemy unit there home | bench: a 1-Might attacker |
| Teemo, Scout (OGN, 1 Might, Hidden) | +3 Might the turn it is played: a 4-Might defender from face down, a 1-Might body after | bench: Tornado's 3 stays |
| Pit Rookie (OGN, 2 Might) · Legion Marauder (VEN, 2 Might, Empower to 3) · Sea Monkey (SFD, 2 Might, 3 for an extra Energy) | plain bodies, a little bigger | out: Staunch Survivor fights at 4 for the same cost |
| Siren of the Shallows (RAD, 1 Might, Disarm, Ganking) | a 2-drop that changes battlefields | out: 1 Might loses the fight it Ganks into |
| Overzealous Fan (SFD, 2 Might) | sacrifices itself to send an attacker home | out: a hold card, and the role is beatdown |
| Dragonsoul Sage (UNL, 1 Might) | exhaust: 1 Energy | out: ramp is not a job |
| Shadow Order Disciple · Mystic Poro · Cithria · Sneaky Zeebles · Treasure Hunter · Noxian Demolitionist · Gust Monk · Determined Sentry · Veteran Poro · Overloaded Traveler · Demacian Diplomat · Gemhand Hunter · Mister Root | 1–2 Might with a payoff this deck doesn't feed (XP, buffs, Deploy, equipment, Gold) or no effect | out |

**Job 4, scoring: every legal card that scores or pays on a hold or conquer:**

| card | what it does here | verdict |
|---|---|---|
| **Evelynn, In Control** (RAD 4E 1P, 4 Might, Disarm) | when she holds with a facedown card of ours there, +1 point (a hold effect, §383.4.d; not gated, §473.1.a.1). A held battlefield with a hide pays 2 a turn | **in, 2** |
| Draven, Audacious (SFD 6E 1P, 6 Might, Deflect) | +1 point the first time he wins a combat each turn; the opponent gets 1 if he dies in combat | bench: a 6-drop whose loss is a point for them |
| Yasuo, Windrider (OGN 5E 1P) | a point on his third move in a turn | out: three moves a turn is not this deck |
| Explosimian (RAD 6E, 6 Might) | when he holds, three Bombs to one battlefield | out: a hold payoff at 6 |
| The Good Stuff (RAD gear) · K'Sante · Qiyana · Sett, Brawler · Zed · Illaoi · Jarvan IV · Pillaged Armory · Yone · Kennen, Storm of Shuriken · Sivir, Ambitious · Corrupted Dragon · the Hunt units | pay off a hold or conquer with cards, runes, buffs or XP, not points | out of this job (The Good Stuff is read again under job 5) |

**Proposal (draft): −1 Ezreal, −1 Matriarch, −1 Rampage, −1 Bedeviling Stranger, −1 Tornado
Warrior; +2 Evelynn, In Control, +2 Windsinger, +1 Irresistible Faefolk.**
- Staying power 10 → 8 (the target's top): one Ezreal and one Matriarch, the slowest of it.
- Stranger out for Windsinger: the same Hidden 2-drop slot, an unconditional bounce instead of
  one that needs 4 units there.
- One Tornado out: with one Matriarch its reset is rarer; Hidden stays at 11.
- One Rampage out: hold-breakers go up anyway (Windsinger, Faefolk).
- Shape: 23 units, 13 at 2 Energy or less, 22 cards at 2 or less (target 22–24), average 2.48,
  11 Hidden, 2 at 5+. Goldfish: 15.8 Energy over turns 1–4 on the play, 3.6 units by turn 3
  (3.9 on the draw). Runes stay 6 / 6, still the sweep's best.

### Revised with Jay, 23 Oct 2026 — midrange: hold early, go tall later (draft)

**Two objections from Jay, both right:**
- **1-Might bodies are fragile in this field.** Radiance's Fury removal kills them for almost
  nothing: Bilgewater Tracker (3 Energy: 1 damage to each of up to 2 units) and Scorched Earth
  (5 damage split among units at one battlefield). Irresistible Faefolk and Windsinger are both
  1 Might. Both go to the bench; Bedeviling Stranger (2 Might) keeps its slot.
- **Stay midrange.** Section 1's "beatdown by default" is replaced: **hold early, go tall
  later.** Take the open battlefields early and hold them with two bodies and a hide each; from
  the midgame, put the resources into one big threat (Mercenary, a unit wearing Edge of Night,
  Graves) that breaks their last hold. This is the first worksheet's plan, kept.

**How that still meets the clock.** Holding is scoring: a held battlefield pays every turn, and
holding both wins in four. The new piece is **Evelynn, In Control**, whose point at a held
battlefield with a hide makes that battlefield pay 2. That is how a hold deck scores fast enough
to finish in 16 minutes a game.

**Targets move back to midrange medians** (good finishes, measured midrange: 26 units, 18 cards
at 2 Energy or less, 3 at 5+, average 2.75): job 1 becomes 18–22 cheap cards, which the base list
already meets. Job 5 (staying power) goes back to 8–10: hold games run longer than beatdown ones.

**Proposal (draft): +2 Evelynn, In Control; −1 Rampage, −1 Traveling Merchant.**
- Evelynn is the only scorer in the pool, and a hold-with-a-hide deck is exactly what she
  rewards. She is also a 4-Might body for the tall phase.
- Traveling Merchant draws when it moves. A deck that holds moves less, so it is the staying-power
  card the new role weakens most (10 → 9).
- Rampage is main-phase removal on our turn; Star-Crossed, Gust and Graves cover defenders, and
  two copies stay.
- Shape: 22 units, 19 cards at 2 Energy or less (midrange median 18), average 2.58, 11 Hidden,
  2 at 5+. Goldfish: 15.8 Energy over turns 1–4 on the play, 3.3 units by turn 3, Might by turn 4
  14.4. Runes stay 6 / 6.

### Audit of the proposal — 23 Oct 2026 (Jay: "audit it strongly")

**Rules Evelynn depends on, verbatim:**
- Her point is **gaining points**, not Scoring (§470.2: "Score X points" means gaining), so the
  final-point gate never applies to it (§473.1.a.1).
- "When I hold, if you control a facedown card here" is a hold effect (§383.4.d), and the "if"
  right after the condition is part of the condition (§383.2.a.1). **The facedown card has to be
  there in your Beginning Phase**, so it has to survive their turn unflipped.
- So **at 6 points, a held battlefield with Evelynn and a hide wins at the start of your turn**:
  the hold makes 7, her point makes 8. Nothing else in the list closes without a fight.

**What the audit found:**
1. **Two copies is too few for the deck's only scorer.** 2 copies: 41% to have seen one by
   turn 5; 3 copies: 56% (39-card library, no draw effects counted). The clock is tier 0 and
   "enough copies to be consistent" is an always-on rule. **Three.**
2. **Cutting Rampage widens a known gap.** "Answer a 6+ Might unit" is thin, and in the tall
   phase Rampage *is* that answer: a 6-Might Mercenary with its Body paid deals 8. Keep two at
   least; the proposal's cut takes it from 3 to 2, and a third Evelynn should not take another.
3. **The tension at her battlefield.** Flipping the hide there to defend costs her point that
   turn. Hold her battlefield with bodies strong enough not to need the flip, and fight with the
   hide at the other one.
4. **Fragility, Jay's test:** at 4 Might she survives Bilgewater Tracker, Hextech Ray (3) and
   Bellows Breath; she dies to Lost to the Sands (4), Falling Star (3+3) and Scorched Earth. She
   will draw removal — which is removal not spent on the 2-drops.
5. **The turn-4 crowd:** Matriarch, Evelynn and Mercenary all want turn 4. Mercenary waits in
   the Champion Zone, so it is a choice, not a clog; 3-drops (3 Ezreal, 2 Fizz, 2 Tornado) keep
   turn 3 full.
6. **One Merchant out holds up:** cheap units 11 → 10; a 2-drop in the opening 4 75% → 71%, by
   turn 2 88% → 85%. Staying power 10 → 9, inside the 8–10 target.

**Variants, same 20,000 shuffles** (the goldfish can't see Evelynn's points; it checks the
curve didn't break):

| variant | cheap cards | 4-drops | Energy T1–4 (play) | units T3 | Might T4 |
|---|---|---|---|---|---|
| A: +2 Eve −Rampage −Merchant | 19 | 4 | 15.8 | 3.3 | 14.4 |
| B: +2 Eve −Merchant −Sabotage | 18 | 4 | 15.8 | 3.4 | 14.5 |
| **C: +3 Eve −Merchant −Sabotage −Rampage** | 18 | 5 | 15.9 | 3.4 | 14.6 |
| D: +3 Eve −Merchant −Sabotage −Gust | 17 | 5 | 15.9 | 3.4 | 14.6 |

**Recommendation: C.** Three Evelynn for the clock; Rampage 3 → 2, kept for big units; the second
Sabotage goes, because Evelynn is tier 0 and Sabotage tier 3 (the third copy stays in the
sideboard for Riven, Kai'Sa, Jayce and Irelia's Reactions). Gust stays: a 1-Energy Reaction is a
hold card. This reverses the earlier second Sabotage; the goal changed under it (a clock now
matters).

### Decided — 23 Oct 2026: +3 Evelynn, In Control; −1 Traveling Merchant, −1 Rampage, −1 Sabotage

**The list after step 2a (40):** 3 Staunch Survivor, 3 Bedeviling Stranger, 2 Traveling Merchant,
2 Tideturner, 3 Ezreal, Prodigy, 2 Fizz, Trickster, 2 Tornado Warrior, 2 Tail-Cloaked Matriarch,
3 Evelynn, In Control, 2 Graves, Blasting Through, Sivir, Mercenary; 3 Punch First, 2 Rampage,
3 Star-Crossed, 2 Switcheroo, 2 Gust, 1 Sabotage; 2 Edge of Night. Runes 6 / 6; battlefields
unchanged so far. Sideboard unchanged until step 2b.

### Step 2b — the other jobs, all 110 spells and gear read (draft, 23 Oct 2026)

Read against jobs 2 (keep both), 3 (win the fight), 5 (keep cards coming), 6 (flexible denial)
and the two known gaps (save a hide; answer a 6+ Might unit). In the list: Punch First,
Switcheroo, Star-Crossed, Gust, Rampage, Sabotage, Edge of Night.

**Worth a slot or a bench place:**

| card | what it does here | verdict |
|---|---|---|
| **Challenge** (OGN 2E 1 Body, Action) | your unit and theirs deal their Might to each other — Rampage's effect at **Action speed**, so it works inside a fight and on their turn when they attack your hold; the friendly unit can be anywhere, so a tall unit in base shoots into a battlefield | **in for both Rampage** |
| **Wind and Ghosts** (VEN 3E, Action) | a unit at a battlefield: 3 Might or less is **banished** (no Deathknell, no recursion), bigger is returned to hand. Answers anything, big units included, without needing a unit of ours | **in for Sabotage** |
| Marching Orders (SFD 3E, Action, Repeat 3) | Challenge's effect with no Power and a repeat for 3 more | bench: Challenge is a turn cheaper |
| Existential Dread (UNL 1E 1P, Action, Repeat 2) | stun an attacker; repeat to bounce it | sideboard candidate against attackers (Rengar, Rek'Sai, Irelia) |
| Bushwhack Trap (RAD 1E gear, Deploy) | a second facedown card at a battlefield you control — fixes Evelynn's tension (keep one hide for her point, flip the other) | bench: first in if her point keeps getting spent on defence |
| The Good Stuff (RAD 3E 1P gear, Deploy) | discard 1, draw 3; returns to hand when you hold there, to do it again | bench: staying power is at target (9) |
| Pack of Wonders (OGN 2E gear) | exhaust: return a friendly unit, gear or facedown card to hand — saves a hide, resets Matriarch | bench: the hide-protection gap, if games show it |
| Repulse (UNL 1E 1P, Reaction) | counters a spell that targets one friendly unit — protects Evelynn or Mercenary | sideboard candidate against removal decks |
| Cannon Barrage (OGN 2E 1P, Reaction) | 2 to every enemy unit in combat | sideboard candidate against go-wide attacks |
| Siren's Song (RAD 2E, Reaction) | moves an enemy unit that moved this turn — sends an attacker home | bench: Gust does it for 1 |
| Grim Resolve · Hold 'Em · Guttural Roar | +3, +3, +2 (+4 Empowered), no Power | bench: Punch First's +5 wins more fights; useful only if Body Power runs short |
| Lunar Boon · Spoils of War | Reaction draw | out: staying power at target |

**Out, by why:**
- **Equipment that only adds Might** (Doran's Blade, Doran's Ring, Hexdrinker, Warmog's Armor,
  Trinity Force, Boneshiver, Boots of Swiftness, Cull, Hunter's Machete, Jagged Cutlass, Last
  Rites): Edge of Night does the same from face down, at Reaction speed, for nothing.
- **Payoffs we don't feed:** buffs (Arena Bar, Mistfall, Overt Operation, Wallop, Pillaged
  Armory, Pirate's Haven), XP (Blood Rose, Concentrate, Conscription, Scryer's Bloom), Mighty
  (Show of Strength, Titanic Shrine), Deploy and Bombs (Satchel Charge, Hexplosive pieces,
  Portable Portal, Nazuman Ntofo), Empower gear (Tools of Empire, Hextech Disc), Flow (Twilight
  Step, Onslaught, Up from the Deep).
- **Ramp and mana:** Seal of Strength, Seal of Discord, Ancient Henge, Platewyrm Egg, Mobilize,
  Catalyst of Aeons, Treasure Trove, The Waters' Wage — the legend's Gold already does this.
- **Hurts us or is symmetric:** Flurry of Blades (1 to every unit at battlefields), Avalanche,
  Whirlwind, Invert Timelines, Downwell, Cataclysmic Duel, Clash of Giants, Acceptable Losses
  (kills our Edge), Temptation, Call to Battle, Bone Skewer.
- **Narrow or slow:** Decree of Strength (Mind cards only), Decree of Discord (Order units only),
  The List, Factory Recall, Confront, Isolate, Stare Down, Strike Down, Fading Memories,
  Cataclysm, Primal Strength, Primordial Roar, Gentlemen's Duel, Possession, The Harrowing,
  Morbid Return, Shadows of the Past, Cursed Sarcophagus, Forgotten Relic, Mechanical Bandit,
  Blast Cone, Spirit Wheel, Petricite Monument, The Syren, Demon Shade, Here to Help, Rebuke
  (Wind and Ghosts does it and banishes small units), Hard Bargain, Abandon, Wild Claw, Ride the
  Wind (out on 23 Oct), On the Hunt (no Action).
- **Never:** Dazzling Aurora (`lib/avoid.mjs`).

**Proposal (draft): −2 Rampage, +2 Challenge; −1 Sabotage, +1 Wind and Ghosts.**
- Rampage was our-turn-only removal; Challenge does it inside fights and on their turn, which a
  hold deck needs, for 1 Energy less. The tall unit still makes it removal: Mercenary at 6 deals 6.
- Wind and Ghosts fills the "answer a 6+ Might unit" gap without needing a unit of ours, and
  banishes small ones so they don't come back. Sabotage keeps its sideboard copy.
- Shape: rules pass; 19 cards at 2 Energy or less; average 2.65; 15.8 Energy over turns 1–4;
  3.4 units by turn 3. Printed Power Body 13, Chaos 17. Rune sweep: 5/7 and 6/6 tie on Energy
  (16.9); 5/7 sticks 8.4% against 9.8%. Kept at 6/6 for turn 1's Staunch Survivor (no Gold yet);
  re-check once the list is final.

### Step 2b decided — 23 Oct 2026: no changes; both proposed swaps reversed

**Rampage stays (Jay).** The proposal undersold its optional cost. Exactly:
- Rampage's optional Body gives our unit **+2 before the exchange**, so it wins trades Challenge
  only draws: a 6-Might Mercenary with Rampage kills a 6-Might unit and survives; with Challenge
  both die. Against a 7-Might unit, Rampage kills it and survives at 8; Challenge kills nothing.
- **Ezreal makes that +2 free** (an optional additional cost, §356.4.c). Challenge's Body is its
  base cost, which Ezreal doesn't touch.
- **Gold:** paying Rampage's Body by recycling a rune makes a Gold. Challenge's Body is
  mandatory, so it always makes one; the real difference is the +2, not the Gold.
- Challenge's only edge is timing (Action), and this deck already has Action and Reaction answers
  for fights: 3 Star-Crossed, 2 Gust, 3 Punch First, 2 Switcheroo and 11 Hidden cards. Rampage's
  +2 is the thing nothing else gives.

**Sabotage stays (Jay: a staple).** It is, in these colours: all 7 of 7 Body/Chaos good finishes
run it, an older card with a real record. Its job, stripping the Reaction that beats our pump
before the tall phase's fight, matters against Irelia (Defiant Dance, En Garde) at Jay's store.

**Wind and Ghosts goes to the bench, first in for big units.** Every slot it could take costs
something the plan needs: for a Gust, cheap cards fall to 17 (target 18–22); for an Edge of Night,
Hidden spells and gear fall to 3 (the Vex rule says 4); for a Star-Crossed, the deck's best
two-for-one. Big units are covered for now by 2 Rampage with a tall unit, 3 Star-Crossed and
2 Switcheroo. Bring it in if games show 6+ Might units walking through.

**The list stays the step-2a list.** Bench additions: Wind and Ghosts (big units), Challenge
(if fights on their turn are the problem), Bushwhack Trap (Evelynn's hide), The Good Stuff,
Pack of Wonders, Marching Orders.

### Step 2c — battlefields and sideboard (draft, 23 Oct 2026)

**Battlefields: all 71 legal ones read** (good finishes: all 358 / Radiance-era 22). Each player
brings one per game, so ours helps whoever controls it; in a best-of-three each is used once in
decided games (§488.5). "You" on a battlefield means its controller (§190.6.d).

| battlefield | for this plan | verdict |
|---|---|---|
| **Bandle Tree** (OGN; 6 / 0) | *"You may hide an additional card here."* Two facedown cards at the battlefield we hold: one kept for Evelynn's point, one to flip in defence — the tension the audit found, solved by the battlefield instead of a card slot. We are the deck with 11 Hidden; the opponent gains it only if they take it | **in, game 1** (replaces Zaun Warrens) |
| Emperor's Dais (SFD; 61 / 7) | bounce-and-replay Ezreal, Fizz or Matriarch; a Sand Soldier keeps the hold | **keep, going first** |
| Sigil of the Storm (OGN; 53 / 3) | the conqueror recycles a rune: a lost rune for them, a Gold for us | **keep, going second** |
| Zaun Warrens (OGN; 40 / 7) | filter on conquer | out: low impact was its job; Bandle Tree does more for us |
| Hallowed Tomb (OGN; 5 / 0) | hold: return the Chosen Champion from the trash | bench: Mercenary insurance, but symmetric |
| Forbidding Waste (UNL; 74 / 3) | a lone defender has −2 | bench: punishes Irelia and Master Yi, Bladesman, who defend alone; we hold with two |
| Grove of the God-Willow (OGN; 29 / 0) | hold: draw 1 | bench: staying power at target |
| Star Spring (UNL; 85 / 6) | first unit played here each turn lets another walk home | out: helps the deck that leaves, we stay |
| Power Nexus (SFD; 3 / 0) | hold: pay four Power for a point | out: four Power a turn is more than the Gold makes |
| Rockfall Path · Mystic Vortex · Vaults of Helia | stop units played there (our hidden units) · tax Reactions there (our flips) · tax the holder | out: each hurts this deck most |
| the other 59 | payoffs for Mighty, buffs, XP, Dragons, gear, equipment, Repeat or Temporary; card draw on conquest that a holder rarely uses; symmetric effects with no edge for us | out |

**Sideboard (10), rebuilt for the store** (meta decks, Irelia among them, no Aurora; casual decks
beside them):

| card | in against | why |
|---|---|---|
| 2 Vex, Apathetic | Rengar, Rek'Sai, Riven, Evelynn, Kennen, Irelia | stuns every unit they play while she's at a battlefield, ambush and hidden ones included |
| **2 Existential Dread** (new) | Irelia, Rengar, Rek'Sai, Riven | 1 Energy, 1 Power, Action: stun an attacker (no combat damage); repeat for 2 to stun another or bounce the stunned one. Irelia fears stuns most |
| **1 Wind and Ghosts** (new) | Kai'Sa, Mordekaiser, Kennen (Rhasa), LeBlanc | big units bounced, small ones banished (no Deathknell) |
| 1 Unyielding Spirit | Kai'Sa, Akali, LeBlanc, Fury removal (Bilgewater Tracker, Scorched Earth) | prevents all spell and ability damage this turn |
| 1 An Offer You Can't Refuse | Jayce, Riven (Blade of the Exile), Kennen (Last Rites) | kills a gear at Action speed |
| 1 Sabotage | Kai'Sa, Riven, Irelia, Jayce | the second copy |
| 1 Graves, Blasting Through | Rek'Sai, Rengar, LeBlanc | the third copy against width |
| 1 Disposal Order | Kennen, Mordekaiser, LeBlanc | recycles 3 cards from their trash at Reaction speed |

Out of the old sideboard: the second Offer and Ravenbloom Prefect (no Aurora Jayce at the store,
so one gear answer), and Flash (Unyielding Spirit and Wind and Ghosts cover what it covered).
Copy limits hold: Graves 2 + 1, Sabotage 1 + 1.

---

## 4. Full audit — 23 Oct 2026

**The list audited.** Main (40): 3 Staunch Survivor, 3 Bedeviling Stranger, 2 Traveling Merchant,
2 Tideturner, 3 Ezreal, Prodigy, 2 Fizz, Trickster, 2 Tornado Warrior, 2 Tail-Cloaked Matriarch,
3 Evelynn, In Control, 2 Graves, Blasting Through, Sivir, Mercenary; 3 Punch First, 2 Rampage,
3 Star-Crossed, 2 Switcheroo, 2 Gust, 1 Sabotage; 2 Edge of Night. Runes 6 Body / 6 Chaos.
Battlefields: Bandle Tree, Emperor's Dais, Sigil of the Storm. Sideboard (10): 2 Vex, Apathetic,
2 Existential Dread, 1 Wind and Ghosts, 1 Unyielding Spirit, 1 An Offer You Can't Refuse,
1 Sabotage, 1 Graves, Blasting Through, 1 Disposal Order.

**Deck rules:** all 11 pass (`deckChecks`), sideboard included; Graves 2 + 1 and Sabotage 1 + 1
inside the 3-copy limit.

**Shape, against the targets:**

| | this list | target | |
|---|---|---|---|
| units / spells / gear | 25 / 13 / 2 | midrange median 26 units | ok |
| cards at 2 Energy or less | 18 (10 units) | 18–22 | ok, at the floor |
| 5+ Energy | 2 | 2–4 | ok |
| average cost | 2.65 | 2.5–2.75 | ok |
| curve (1 / 2 / 3 / 4 / 5) | 6 / 12 / 14 / 6 / 2 | | the 3s are the deck's centre |
| Hidden (spells or gear) | 11 (4), plus Bandle Tree's second slot | 10–12 (4+) | ok |
| Reactions from hand | 5 (3 Star-Crossed, 2 Gust) | 4–6 | ok |
| pumps and swaps | 7 + 2 Tornado | 7–9 | ok |
| hold-breakers / scorers | 9 + Mercenary / 3 Evelynn | 8–10 / 2–3 | ok |
| staying power | 9 | 8–10 | ok |
| flexible denial | 1 Sabotage + the removal | 2–3 | **thin**, the sideboard's second Sabotage comes in often |

**Goldfish** (`lib/sim.mjs`, 20,000 games): Energy turns 1–4 15.9 on the play, 17.9 on the draw;
units 3.4 / 3.8 by turn 3, two units by turn 3 98% / 99%; Might by turn 4 14.6 / 16.0; no play on
turns 1–2 0%; stuck on colour by turn 3 11% / 9% (no Gold modelled). Best mulligan: keep all.
Per-card keep values run Matriarch +1.1 to Sabotage −0.7; Staunch Survivor reads −0.5 because the
sim charges its Body Power with no Gold back.

**Runes: 6 / 6 confirmed.** The sweep ties 5/7 and 6/6 on Energy (16.9); 5/7 sticks 9.0% against
10.5%, because the Chaos cards recycle more Chaos over a game. The exact odds before any Gold
still favour 6/6 where it matters, the first turns:

| with no Gold, going first / second | 5 Body / 7 Chaos | 6 Body / 6 Chaos |
|---|---|---|
| 1 Body by turn 1 (Staunch Survivor) | 68% / 84% | **77% / 91%** |
| 2 Body by turn 2 (Punch First) | 58% / 75% | **73% / 88%** |
| 2 Chaos by turn 3 (Switcheroo from hand) | 99% / 100% | 96% / 99% |
| 2 Chaos by turn 4 (Mercenary with Accelerate) | 100% / 100% | 100% / 100% |
| 2 Body and 2 Chaos by turn 3 | 87% / 95% | **92% / 98%** |

Late Chaos is what the Gold covers, so 6/6 stays.

**Draw odds** (39-card library, no draws counted): a 2-drop unit in the opening 4 71%, by turn 2
85%; Evelynn by turn 5 56%; a Hidden card by turn 2 85%.

**New rules this list relies on, checked verbatim:** Evelynn's point is gaining points, not gated
(§470.2, §473.1.a.1), checked when she holds (§383.2.a.1, §383.4.d); Bandle Tree's "you" is its
controller (§190.6.d), and a Facedown Zone's size can change (§107.3.b.1); a stunned unit deals no
combat damage (Existential Dread, §424.1.b); Wind and Ghosts banishes, which is not a death, so no
Deathknell (§428.2).

**What the audit found:**
1. **Bandle Tree doubles the stake.** Two facedown cards there means losing it trashes both
   (§323.6.a). Play rule: the second hide only when the hold is safe.
2. **Bedeviling Stranger is the weakest card against the store's top decks.** Its bounce needs 4
   units at the battlefield, and Irelia (2.5 units by turn 3), Riven (2.9), Master Yi, Bladesman
   (holds alone) and Kai'Sa rarely put that many there. Against them it is a 2-Might Hidden body,
   which still does jobs 1 and 2. It is the first card out in most sideboard plans below. Not cut:
   the alternatives are 1-Might bodies the Fury pings kill.
3. **Flexible denial is one card.** One main-deck Sabotage; the second comes in against most of
   the meta decks.
4. **Turn 4 is crowded:** 2 Matriarch and 3 Evelynn, with Mercenary waiting. A choice, not a clog,
   but a hand of two 4-drops and no 2-drop is a mulligan.
5. **Gaps still open, by design:** saving a hidden card (Pack of Wonders on the bench), big units
   (Wind and Ghosts in the sideboard), and the clock is now Evelynn's 3 copies.

**Matchups at the store** (role, what decides it, and the sideboard plan, 1 for 1):

| opponent | role | what decides it | in | out |
|---|---|---|---|---|
| Irelia (S) | hold, attack with two | she fields few units and wins fights with Reactions (Defiant Dance, En Garde); stuns beat her readied units | 2 Existential Dread, 1 Sabotage | 2 Bedeviling Stranger, 1 Rampage |
| Kennen (S) | press early | pressure before the trash fills and Rhasa lands | Disposal Order, Wind and Ghosts, 1 Vex | 1 Graves, 1 Edge of Night, 1 Tideturner |
| Riven (S) | hold; deny her holds | her units enter ready on battlefields she controls; Defy can't counter Punch First or Switcheroo | 2 Vex, 1 Offer, 1 Sabotage | 1 Gust, 1 Bedeviling Stranger, 1 Traveling Merchant, 1 Edge of Night |
| Master Yi, Bladesman (S) | attack with two | the +2 is only for a lone defender; his tricks are 1-Energy Reactions | 1 Sabotage, 1 Wind and Ghosts | 2 Bedeviling Stranger |
| Kai'Sa (A) | press; don't overcommit | removal and Watcher (−3, minimum 1); Time Warp | Unyielding Spirit, Wind and Ghosts, Sabotage | 1 Bedeviling Stranger, 1 Tornado Warrior, 1 Edge of Night |
| Rengar (A) | hold | ambushes need their units already there | 2 Vex, 2 Existential Dread, 1 Graves | 1 Sabotage, 2 Edge of Night, 1 Fizz, 1 Matriarch |
| Rek'Sai (B) | hold | the widest board; conquests feed its engine | 2 Vex, 2 Existential Dread, 1 Graves | 1 Sabotage, 2 Edge of Night, 1 Fizz, 1 Matriarch |
| LeBlanc (A) | hold; bounce, banish | it wants its units to die | Disposal Order, Wind and Ghosts, Unyielding Spirit | 1 Sabotage, 2 Rampage |
| Evelynn (A) | press her hide spots | taking a battlefield trashes her facedown cards | 2 Vex | 1 Sabotage, 1 Edge of Night |
| Vex, Gloomist (A) | remove Vex first | Vex, Apathetic stuns our units played, hidden ones too; our 4 Hidden spells and gear still work | Wind and Ghosts, Sabotage | 1 Bedeviling Stranger, 1 Tornado Warrior |
| Akali (B) | hold | pings and Falling Star on small bodies | Unyielding Spirit | 1 Traveling Merchant |
| Jayce, non-Aurora (A) | press | nothing on board for three turns; Gutter Palace | Offer, Sabotage | 2 Graves |

These plans are starting points from the cards, not tested. Log what changes.

**Verdict:** legal, on every shape target, runes confirmed, every card read. The list is ready to
test. Card by card (section 3) and the guide follow once Jay agrees.

## 5. Log

- **23 Oct 2026 — the list is complete and saved** to the Decks tab as `Sivir — Nexus Night
  (decklab, 23 Oct)`. A table guide is at [guides/sivir-nexus-night.md](../guides/sivir-nexus-night.md)
  for the first night; section 3 (card by card) and the full guide follow. 12 cards to get, all
  Radiance plus Bandle Tree. First night: Sip & Play, 23 Oct. Log each match: opponent, result,
  and whether Evelynn's point landed, the early game held, and big units walked through.
