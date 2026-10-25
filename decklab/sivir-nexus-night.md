---
title: Sivir for Nexus Night — deckbuilding worksheet
subtitle: Sivir, Battle Mistress (Body/Chaos), Radiance. A 3-0 at a Nexus Night, rebuilt from the decklab Sivir Midrange list. Built together, step by step.
started: 2026-10-23
status: list complete 23 Oct 2026 (sections 1–4) · full guide written · section 5 logs games
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

## 1b. How it wins, v2 — agreed 25 Oct 2026 (replaces the plan above)

**Why a v2.** The points model (`lib/match.mjs`) put Evelynn's point at about 0.4 a game
against the field, not the clock the v1 plan assumed. Then Jun's Radiance Kha'Zix update
(24 Oct) said Evelynn's own legend "does not help with the main drawback of hiding: your rune
economy", and that hidden units are cheap development: hide one early, play it next turn for a
Power and no Energy. Battle Mistress is exactly the missing piece. Stage 1 stands (legend,
champion, Body/Chaos, midrange); this redoes stage 2.

**The core: pay Power, not Energy** (Jay: "the big perk of Sivir"). The legend makes Power
renewable (each turn's first recycle makes a Gold), and Hidden turns Power into board and
answers: hide for `[A]`, and from the next turn on play it ignoring its cost (§811.1.b). Our
Energy goes to bodies while our Power builds a second line face down; the opponent pays Energy
for everything.

**The game:**
1. **Turns 1–3, take and hold.** Cheap bodies to the open battlefields (turn 1: a free 2-drop).
   From turn 2, hide at a battlefield you hold, **a unit first** (Jay: Jun's logic). Most decks
   can't contest an early hold, and a hidden unit is both a surprise defender on their turn and
   free development on yours.
2. **Turns 3–5, develop for free.** Flip hidden units on your own turn: a unit for one Power.
   Switch the face-down card to an answer once a breaker (a 5+ Might unit) is on their board or
   can come down: that is the Astral Heron plan.
3. **Turns 5 and on, break and close.** Mercenary (two Power spent: 6 Might, Ganking) or a
   pumped fighter takes their last battlefield; close by holding one and conquering the other
   (§473.1.b).

**Rules this leans on** (handbook, §811): hide only on your turn, Open State, at a battlefield
you control, one card each (Bandle Tree: two there); from the next turn on it has Reaction and
plays ignoring its whole cost, Power included; a hidden unit, and any unit a hidden card
plays, must go to that battlefield (§811.1.d.1, §811.1.d.5); lose the battlefield and the card
is trashed (§323.6.a). So the engine runs at one or two face-down cards, only where we hold.

**Evelynn, In Control: no longer planned around** (Jay: skeptical — flipping hides to cheat out
units fights her point, and Jun doesn't run her even in his Hidden list). She competes for her
slots in stage 4 like any card; the keep-a-card habit applies only while she is on board.

**What the plan wants from the pool** (stage 3 sets the counts): hidden units worth cheating out
(Momentary Companion 4 Might, permanent when flipped on your turn; Ember Monk; Gutter Guardian,
which refunds the Power; Pyke, Returned; Tornado Warrior; Stranger and Tideturner); **Here to
Help** (from face down: play a unit from hand to that battlefield 3 Energy cheaper — one Power
turned into three Energy); Energy relief (K'Sante, Courageous: a hold channels a ready rune;
Reckless Innovator: a Gold or a card when he exhausts); answers face down for the breakers.

**Goal tiers v2** (`decklab/sivir-nexus-night.tiers.json`):

| tier | goal |
|---|---|
| 0 | win inside the clock: points by turn 8, ours up and theirs down (`lib/match.mjs`) |
| 1 | presence: bodies on battlefields, winning fights there (units from face down count) |
| 2 | **the engine: Power turned into board or answers** (hidden units, Here to Help, Fizz's recast, Gold makers) |
| 3 | staying power: replace what was spent |
| 4 | denial, flexible only |
| 5 | perks |

**Battlefields** (Jay: "whatever makes sense"): a stage 3 job, decided once the model plays
battlefield effects. Candidates beside ours (Bandle Tree, Emperor's Dais, Sigil of the Storm):
Bandle Scouts' Academy (a Gold for each hide there: the engine pays for itself) and Packed
Amphitheater (champion units +1 Might; we run 11 champion-unit copies). Each is used once a
match (§488.5.a).

### Stage 3 v2 — jobs and targets (draft, 25 Oct 2026)

**The principle** (agreed with Jay): **every card is a body or an answer; the engine is how we
pay for them, not extra cards.** The legend's edge is a cost structure, not a combo, so it
needs no payoff cards: it needs cards that are good alone *and* cheaper with our Power. A
hidden unit is still a unit; Kraken Hunter (3 Energy, 2 Power, 5 Might) is still a 5-Might body.
The cut test for every slot: **is it good when nothing else goes right?** This grounds v1's
"engine perks: 0 dedicated slots".

**On the Hunt is out** (Jay: "seems worth not using it"). Sivir's signature (1 Energy, 2 Power:
ready your units) does three things in this plan — switches Mercenary on, lets a fresh or
flipped unit attack the turn it arrives, readies Ganking units for a second conquer — but it
does nothing alone, it is main-phase only, a readied unit at a battlefield can only go back to
base without Ganking, and two hides switch Mercenary on without spending a card. 7 of 33
Sivir lists ran it; none of the 14 with a record or a claim. Win-more; no signature copies.

**Targets** start from good midrange finishes (`lib/placing.mjs`: 26 units, 18 cards at 2
Energy or less, 3 at 5+, average 2.75) and from Jun's two Radiance Kha'Zix lists (Hidden: 26
units, 10 Hidden, 8 of them units; midrange: 25 units, 3 Hidden), bent to the plan:

| job (tier) | target | now | note |
|---|---|---|---|
| **Bodies** (1) | 25–27 units | 26 | most of the deck; break ties toward hidden units and Power-priced bodies |
| ↳ hidden units: development for a Power (2) | 8–10 | 8 | Jun's Hidden list runs 8; they must be good bodies from hand too |
| ↳ cards at 2 Energy or less (1) | 18–22 | 19 | turn 1–2 plays (v1 target, kept) |
| ↳ cards at 5+ Energy (always) | 2–4 | 3 | |
| **Answers usable on their turn** (1, 4) | 6+ copies, 3+ of them free from face down | 9 (Switcheroo 3, Star-Crossed 3, Punch First 3) | the Astral Heron plan: an answer face down once a breaker can come down |
| **Face-down cards in all** (2) | 10–12 | 11 | hidden units plus face-down answers |
| **Energy relief** (2) | 2–4, each also a body or a battlefield | 0 | K'Sante, Reckless Innovator; Bandle Scouts' Academy; Here to Help only if it tests as more than a combo |
| **Staying power** (3) | 8–10 | 9 | Merchant, Ezreal, Fizz, Matriarch (v1) |
| **The closer** | Mercenary | Mercenary | Champion Zone, no deck slot; hides switch her on |
| **Battlefields** | 3 | Bandle Tree, Dais, Sigil | decided once the model plays battlefield effects |

Cards count toward every job they do, so the column does not sum to 40.

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

## 3. Card by card — written into the guide (23 Oct 2026)

Each card's job, rules and competitors are in step 2 above and in the guide's card-by-card
section ([guides/sivir-nexus-night.md](../guides/sivir-nexus-night.md), §7), with the lines that
use them (§8). Every rule cited there was checked against the verbatim rules.

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

## Head to head: the S and A tiers — 24 Oct 2026

Jay's two concerns: Graves may be matchup-specific (good against small units, not against
big ones like Astral Heron), and the deck may be short of small bodies that survive. Checked
with `scripts/rift versus <legend> --deck "nexus night"` (`lib/versus.mjs`): every legal list
of each legend since 16 Oct, each card weighted by the share of lists running it. **Card by
card, read off the text; not a game simulation and not a win rate.** Thin samples: Master Yi
and Jayce have no recorded placings; Irelia, LeBlanc, Evelynn, Vex and Azir have 2–3 each.

| legend (tier) | lists (placed) | Graves alone / with +2 | kills your 2s | kills your 4s | any-unit removal | Defy | turns Graves's blast | big units (5+ Might, in 25%+) |
|---|---|---|---|---|---|---|---|---|
| Kennen (S) | 62 (14) | 86% / 99% | Gust 76% | — | Star-Crossed 84% | — | Switcheroo 82% | Rhasa 6 (77%) |
| Riven (S) | 121 (13) | 79% / 88% | Gust 41% | — | Star-Crossed 65% | 93% | Discipline 93% | Heron 7, Blitzcrank 5, Baron 12, Riven 5 |
| Irelia (S) | 41 (3) | 93% / 94% | Gust 41% | — | Star-Crossed 61% | 98% | Discipline 98% | Heron 7 (27%) |
| Master Yi (S) | 44 (0) | 69% / 94% | — | — | — | 84% | Discipline 82% | Ruin Runner 5, Rengar 6 |
| Kai'Sa (A) | 55 (13) | 67% / 84% | Hextech Ray 98% | Falling Star 96% | — | — | Stupefy 100% | Watcher 7 (95%), Brynhir 5, Empyrean 8, Forerunner 6 |
| Jayce (A) | 17 (0) | 55% / 76% | Singularity 18% | Singularity 18% | — | — | Stupefy 35% | Jayce 6, Elder Dragon 10, Jayce 5 |
| LeBlanc (A) | 35 (3) | 51% / 87% | — | — | Hidden Blade 83% | — | — | Rex 6 (100%), Mixologist 5, Vi 5, Watcher 7 |
| Evelynn (A) | 91 (2) | 87% / 99% | Gust 34% | — | Star-Crossed 49% | — | Switcheroo 62% | Evelynn 5, Elnuk Herd 5, Rengar 6 |
| Rengar (A) | 36 (4) | 88% / 100% | — | — | Rampage 94% (a fight) | — | — | Rengar 6, Forerunner 6, Darius 5, Elnuk 5 |
| Vex (A) | 73 (2) | 84% / 92% | Gust 48% | — | Star-Crossed 67% | 86% | Discipline 82% | Heron 7 (49%), Kharox 5 |
| Azir (A) | 32 (2) | 73% / 98% | — | — | Hidden Blade 81% | 91% | Discipline 81% | Vi 5 (38%) |

"Graves alone / with +2": the share of their unit copies his blast kills at 4, and at 6 with
Edge of Night flipped under him. "Turns the blast": their most-played Reaction that changes it
in response (a hidden swap, a pump on their unit, a −Might on him). Azir's Sand Soldiers are
tokens, made in play, so they are not in the lists and not in his numbers.

**Concern 1, Graves: right about the big-unit decks, but his real weakness is Reactions.**
- His blast kills 51–93% of their unit copies alone and 76–100% with Edge of Night under him.
  Weakest alone against **LeBlanc (51%), Jayce (55%) and Kai'Sa (67%)**, the three big-unit decks.
- **Ten of the eleven run a Reaction that turns the blast**: a hidden Switcheroo (Kennen 82%),
  a +2 on their unit (Discipline: Riven 93%, Irelia 98%), or −Might on him (Stupefy, Kai'Sa 100%).
  Only Rengar has none.
- **The blast can't be countered.** It chooses nothing, so Defy and Not So Fast can't touch it.
  That matters most against Irelia, where Defy and Not So Fast hit the deck's other removal.
- **Play rule:** Graves with a facedown card at his battlefield, or a pump cast before he
  attacks. **Sideboard:** the third copy in against Kennen, Rengar and Evelynn (small boards);
  Graves out against LeBlanc, Jayce and Kai'Sa.

**Concern 2, small bodies: size buys little in this field.**
- The removal limited by Might is mostly **Gust** (Kennen 76%, Vex 48%, Riven and Irelia 41%),
  which reaches a 2- or 3-Might body. Staunch Survivor is out of its reach while fighting (4).
- **Most removal here ignores Might:** Star-Crossed (49–84%), Hidden Blade (LeBlanc 83%, Azir
  81%), Rengar's Rampage (94%). A bigger body doesn't dodge these.
- **Kai'Sa is the exception, and size doesn't save you there either:** Hextech Ray (98%) kills
  every 2 and 3, Falling Star (96%) every 4, and Thousand-Tailed Watcher (95%) gives your whole
  board −3. That matchup is about not over-committing, which the guide already says.
- Speed (goldfish, units by turn 3 / Might by turn 4): yours 3.4 / 14.7. Only Rengar (3.5 /
  16.3) and Kai'Sa's Might (15.3) are ahead. **No change to the body count.**

**What the head to head found that nobody asked:**
- **Defy is in 84–98% of five S/A decks** (Riven, Irelia, Master Yi, Vex, Azir). It counters
  Gust, Star-Crossed, Rampage and Sabotage, but not Punch First or Switcheroo (two Power, §206).
  Against those five the uncounterable plays are Graves's blast, Evelynn's point, pumps and swaps.
- Edge of Night is gear: Kennen (An Offer 31%, Salvage 27%), Kai'Sa (Lost to the Sands 35%) and
  Azir (Salvage 16%) can kill it.

## 5. Log

- **23 Oct 2026 — the list is complete and saved** to the Decks tab as `Sivir — Nexus Night
  (decklab, 23 Oct)`. A table guide is at [guides/sivir-nexus-night.md](../guides/sivir-nexus-night.md)
  for the first night.
- **23 Oct 2026 — the full guide replaces the table guide** at the same path (and on the
  reMarkable): the clock, Evelynn and Bandle Tree play rules, card by card, ten lines that win,
  the numbers, mulligans, and the store's matchups with sideboard plans. 12 cards to get, all
  Radiance plus Bandle Tree. First night: Sip & Play, 23 Oct. Log each match: opponent, result,
  and whether Evelynn's point landed, the early game held, and big units walked through.
- **24 Oct 2026 — this is the Sivir deck; the Midrange list is retired as a separate deck.** The
  two mains differ by three cards (+3 Evelynn, In Control; −1 Traveling Merchant, −1 Rampage,
  −1 Sabotage), plus Bandle Tree and a sideboard built for the store. Evelynn adds no enablers:
  the 11 Hidden and the Gold that pays for them were already the hold plan, and she fills the
  Midrange worksheet's own "score faster than 1 a battlefield" gap. **Revert trigger:** if her
  point rarely lands across logged matches, the three Midrange cards come back.
- **24 Oct 2026 — audit of the guide against the cards and the verbatim rules.** The saved deck
  matches this list. Every card's text was re-read with errata applied. No Radiance FAQ is out
  yet, and none of the 9 Oct patch-note rulings touch these cards. Six fixes to the guide:
  Disposal Order is *choose one*; the Evelynn close can't use the other battlefield's hide
  (§811.1.d); flip the hide under Evelynn when the battlefield is otherwise lost; open question 3
  is answered by §383.2.a.1's Sona example (the point resolves once triggered); with Ezreal, take
  his discount off Accelerate's `[1]`; and in games 2–3, after a win, assume the battlefield is
  chosen blind (default Emperor's Dais). There are still no Radiance results for Sivir anywhere.
- **24 Oct 2026 — head to head against the S and A tiers** (section above). No list change.
  Graves stays at 2, played with a facedown card or a pre-cast pump; the sideboard plans gain
  "Graves out against LeBlanc, Jayce and Kai'Sa; third Graves in against Kennen, Rengar and
  Evelynn". Small bodies unchanged: most removal in this field ignores Might.
- **24 Oct 2026 — −1 Edge of Night, +1 Switcheroo; sideboard −2 Existential Dread, +2 Rebuke.**
  Worked from what breaks the plan, not card against card. The plan's defence is a hidden card
  behind a hold, and the breaker is **one big unit attacking into it** (Astral Heron, Thousand-
  Tailed Watcher, Ruined Rex, Rhasa, Baron: in 7 of the 11 S/A decks). Nine of the eleven hidden
  cards can't stop a 6–7 Might attacker; Switcheroo can, from face down for free (§811.1.b,
  §204.1.a), past Defy (two Power) and past stuns on play (a spell). Answers castable on their
  turn go from 5 to 6: 65% → 72% to have one by turn 3, 75% → 82% by turn 5.
  - **Against the tiers:** tier 0 (the clock) — protects the holds that score and, cast from
    hand in their attack (Action), keeps Evelynn's facedown card down; tier 1 (fights) — wins the
    fights the plan loses, against bigger units, and turns Graves's blast on a big unit; tier 2 —
    Fizz recasts it (Edge, a gear, he can't); tier 3 — it shrinks their unit as denial; tier 4 —
    neutral (both pay Power). Always-on: Switcheroo at 3; Edge becomes a 1-of, but no line needs it
    specifically (its job is shared with 3 Punch First, 3 Switcheroo, 2 Tornado).
  - **Checks** (`deckChecks`, `lib/sim.mjs` 20,000 games): all 11 rules pass; Hidden 11 (4 spells
    or gear, the Vex rule); cheap cards 18 → 19; average cost 2.65 → 2.63; goldfish units by
    turn 3 3.4 → 3.3, Might by turn 4 14.6 → 14.4 (the sim plays Edge as Might and holds
    Switcheroo as interaction). Printed Chaos 16 → 18: 6/6 sticks on colour 10.5% → 11.6% with no
    Gold modelled; 5/7 is 10.1%. **Runes stay 6/6** for turn 1's Staunch Survivor, and a hidden
    Switcheroo costs no Chaos at all.
  - **Costs, honestly:** the permanent +2 for a tall unit (Punch First covers most of it), and
    Irelia's Not So Fast (80%) can counter a Switcheroo that chooses her unit, as it can Gust,
    Star-Crossed and Rampage.
  - **Rebuke in the sideboard, not the main deck:** it beats Rampage only against the five Defy
    decks, so it comes in after game 1 shows Defy, two for two, with no 1-ofs. Existential Dread
    went because Defy and Not So Fast counter it in the matchups it was meant for.
  - **Rejected:** Rebuke main (matchup-dependent; the field splits about half and half on Defy);
    Mel, Defiant Soul (her banish is 3 Might or less); Gentlemen's Duel and Clash of Giants (6
    Energy). Saved to the Decks tab the same day; the row was backed up first.
- **24 Oct 2026 — the simulator learns Power, and a full recheck; −1 Edge of Night, +1 Elnuk
  Herd.** Jay asked for Power everywhere. `lib/sim.mjs` now makes the legend's Gold, hides
  (opt-in), and reports whether an answer is *usable* on their turn, not just in hand.
  - **What moved:** the old "72% to have an answer by turn 3" counted Switcheroo or
    Star-Crossed in hand. Usable on their turn: 40% by turn 3, 55–64% by turn 5, nearly all of
    it a face-down Switcheroo (42% by turn 4 against 3–10% from hand after developing). New
    first rule: hide Switcheroo first.
  - **Rechecked with Gold and hiding:** runes 6/6 still best (10.1% stuck; 4/8–7/5 within 0.1
    Energy); keep all; Staunch Survivor's keep value 0.0 (was −0.5 with no Gold); two units by
    turn 3 97–99%, by turn 2 74% on the play and 94% on the draw.
  - **The field, completed:** the S/A legends' abilities and battlefields read (guide §11a).
    New for the plan: Kai'Sa's Rockfall Path (78%) blocks hidden units, so hide spells there;
    Void Gate (95%) lets Hextech Ray kill 4s. Weighted over the field (popularity · results):
    a regular 6+ Might unit 95% · 96%, 7+ 56% · 61%; a Reaction that turns Graves's blast
    73% · 79%; Defy 46% · 33%; stuns 42% · 30%; Rockfall 7% · 18%.
  - **Elnuk Herd for Edge of Night, judged on the field, not on the suggestion:** the slot must
    be a hidden card (hand cards are rarely usable on their turn), and every legal hidden card
    was read. Graves kills 97% of their unit copies with +3 against 92% with +2 (the 7-Might
    units); +3 on a defender; the +3 lands through a stun; a 5-Might body with no Power from
    hand. Edge's case: permanence, Rockfall Path, cheaper from hand. Confidence moderate; Edge
    comes back against Kai'Sa if she is common at the store. Also read and rejected: Ember Monk
    (+2 per flip, but a 4-drop and not hidden), Momentary Companion, Teemo, Scout.
  - Saved to the Decks tab (row backed up first). Sideboard plans: Kai'Sa takes out Elnuk with
    the two Graves.
- **24 Oct 2026 — one Elnuk, not two** (Jay asked, comparing Kha'Zix's two Rengar). Rengar
  was Kha'Zix's only big unit; here Mercenary is that unit, always available. Elnuk's job is the
  +3 flip, its best line needs one of two Graves, and as a 6-Energy card in hand it is the
  deck's worst keep after Switcheroo. A second copy would replace a Tornado Warrior, which adds
  the same ~3 Might on defence but stays as a body and resets Matriarch. **Watch:** if games
  show the Graves + Elnuk line winning fights, or Tornado's body stunned or blocked at Rockfall
  Path, go −1 Tornado Warrior, +1 Elnuk Herd.
- **25 Oct 2026 — the engine and the Power budget, from the legend down.** Jay asked whether a
  trash engine on top of a hold plan is too much, and pushed back on reading Randyyy's engine
  (3 Shadow Order Disciple, 3 Traveling Merchant, 3 Fizz, 3 Matriarch) as noise. `lib/sim.mjs`
  now models the trash (spells cast, chosen discards, burns, deaths), move triggers, Ezreal's
  draw (the goldfish had never resolved a unit's draw), Fizz's recast and Matriarch's revive,
  with the opponent as labelled scenarios, and a Power budget.
  - **Start from the legend.** Battle Mistress rewards spending Power (Gold) and enemy deaths
    (a second Gold). The hidden package and the engine are both Gold sinks — hiding, Fizz's
    recast, Matriarch's Empower, Mercenary, Punch First and Switcheroo — so "hold plus engine"
    is one economy with several places to spend it. That's the midrange: choose where the Power
    goes each turn.
  - **The budget answered it: Energy, not Power.** Normal pressure, per game, turns 1–5: 7.6
    Power spent (develop 5.7, hide 1.25, recasts 0.3, Empower 0.3), Gold made 3.0 with about
    0.75 unspent, hides blocked 0.00 — but about 2 tricks a game crowded out by Energy (2.8 under
    heavy pressure). The deck has more good things to do with Energy than Energy. Play rule:
    spare Gold on Power-only things (hide, recast); Energy is the turn's real choice.
  - **Fizz stays, for a measured reason:** his recast costs Power, never Energy. A played Fizz
    finds a spell about half the time (ours 51%, Randyyy's 68%; the gap is how fast the trash
    fills, not spell count: 14 spells at 3 or less against his 15). Star-Crossed and Emperor's
    Dais replays of Fizz aren't modelled, so he is better than that.
  - **Shadow Order Disciple doesn't fix it:** one copy changes nothing measurable; three (for all
    three Strangers) add 3–5 points of Fizz hits, attacking or not. Randyyy's engine works by
    density — it was his plan; ours is a hold deck with the engine as its staying power.
  - **Kill against bounce doesn't move the economy:** −2 Gust +2 Challenge or −1 Star-Crossed +1
    Rampage made almost no extra Gold (a kill only pays if a rune is recycled after it that
    turn). Bounce stays: Star-Crossed's resets of your own Fizz and Matriarch matter more.
  - **Turns 1 and 2:** a turn-1 unit 76% going first (94% second), a new turn-2 unit 96% (99%).
  - **No list change.** The Shadow Order Disciple test for the first night (the slot of the
    missing Stranger) still stands as a live check; log "Fizz had nothing to recast" and "Fizz
    got reused". Next: the plan against Astral Heron decks, using the budget (holding Energy up).
- **25 Oct 2026 — turn 1 without spending a rune?** (Jay: if Energy is the squeeze, don't
  recycle on turn 1.) Measured (`opts.t1NoPower`): preferring a free 2-drop is what the
  simulator already does, and it's right. Strict "never spend Power on turn 1" when Staunch
  Survivor is the only play: going first, Energy even (15.1), runes on turn 2 4.0 against 3.8,
  answers usable on turn 4 50% against 47%, but a turn-1 unit 64% against 76% and two units by
  turn 2 69% against 74%; going second, worse on everything (Energy 17.1 against 17.7). Rule:
  a free 2-drop on turn 1 when you have one, Staunch on turn 2 off the Gold; Staunch on turn 1
  only when it's the only play. −1 Staunch +1 Merchant measured neutral: no list change.
- **25 Oct 2026 — stage 2 redone: how it wins, v2 (§1b).** The points model put Evelynn's
  point at about 0.4 a game against the field; her slots against all 269 legal cards, then the
  leads rechecked on fresh games with Disarm and her keep modelled: Nilah ties her, Jayce
  +0.10 ± 0.06 (not significant), plain bodies lose by 0.18–0.20. Then Jun's Kha'Zix update:
  Hidden's drawback is the rune economy, which our legend fixes, and hidden units are cheap
  development. Agreed with Jay: the core is **pay Power, not Energy**; hidden units first, an
  answer face down once a breaker can come down; Evelynn no longer planned around (she competes
  in stage 4); the engine is goal tier 2, below presence; battlefields are a stage 3 job.
  How sure: high on the core (an expert reached it independently, and it is what our legend
  does), none yet on any card (the model doesn't yet flip hidden units on our turn, play
  Temporary, hold or exhaust triggers, or battlefields). Next: stage 3 jobs and targets, and
  the model fixes. Reverses if: the fixed model or Jay's games show hidden development losing
  to plain bodies.
- **25 Oct 2026 — On the Hunt out; stage 3 v2 drafted (§1b).** Sivir's signature reads well
  for the new plan (switches Mercenary on, readies fresh and flipped units, a second conquer
  with Ganking), but Jay asked why almost nobody plays it: no winning Sivir list does (7 of 33
  lists, 0 of the 14 with a record or a claim), it does nothing alone, and hides already switch
  Mercenary on. Principle agreed: every card is a body or an answer, the engine is how we pay
  for them. Jobs and targets drafted from good midrange finishes and Jun's two lists. How sure:
  high on On the Hunt staying out (results and reading agree); the targets are a draft.
