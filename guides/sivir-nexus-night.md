---
title: Sivir for Nexus Night — Deck Guide
subtitle: Riftbound, Radiance — the decklab list for a 3-0 at a Nexus Night (best of three, 50-minute rounds): how it wins, how to play it inside the clock, the rules it runs on, and the store's field
author: rift toolchain
date: 2026-10-23
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main (Champion included) + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39. The Champion starts outside the deck (§103.3.a.1, §108.3.d)
**Collection status:** 12 to get: 3 Bedeviling Stranger, 3 Staunch Survivor, 2 Evelynn, In Control, 2 Graves, Blasting Through, 1 Bandle Tree; sideboard 1 Graves
**The list:** built a step at a time on 23 October in [decklab/sivir-nexus-night.md](../decklab/sivir-nexus-night.md), from the first decklab Sivir ([its guide](sivir-midrange.md)). Saved in the app as `Sivir — Nexus Night (decklab, 23 Oct)`; the deck page's **Copy list** exports it
**Its results:** **none yet. Untested.** Every Radiance card in it is too new to have a record
**Good until:** the first results, or Riot's Radiance FAQ, which outranks the Core Rules where they differ

**Companions.** [The worksheet](../decklab/sivir-nexus-night.md) is why each card is in and what was benched. [strategy.md](../docs/strategy.md) is how to think about any turn; [archetypes.md](../docs/archetypes.md) is what each opponent is doing. This page is how to play *this deck* at *this event*.

---

## The short version

*Read before every round. Everything below expands it.*

**What the deck does.** It is midrange that **holds early and goes tall later.** Cheap bodies take the open battlefields; each held battlefield gets two bodies and a hidden card, so the opponent attacks into something it can't see. Holding is scoring: a point per battlefield every turn. **Evelynn, In Control** turns a held battlefield with a hide into two points a turn, which is how a hold deck finishes inside a 50-minute round. From the midgame, the resources go into one big threat (Mercenary, Graves, a unit wearing Edge of Night) that breaks their last hold.

**The rule that wins games.** Evelynn: *"When I hold, if you control a facedown card here, score 1 point."* That point is **gaining** points, not Scoring, so the final-point gate never applies to it (§470.2, §473.1.a.1). **At 6 points, a held battlefield with Evelynn and a hidden card wins at the start of your turn**: the hold makes 7, her point makes 8.

**The rule that loses games.** A hidden card at a battlefield you lose is **trashed** (§323.6.a). At Bandle Tree that can be two cards.

**The clock.** About 16 minutes a game if three are played. At time, the active player finishes the turn, three more turns are played, and a game still going is won only by a player **2 or more points ahead**; otherwise it is a draw, and no new game starts between games (TR §408.2). **A drawn match is not a 3-0.**

**Your turn, in order:** lethal check, both players → count Power and Gold → take the open battlefields → buff before you move → develop onto the battlefields you hold → hide (at Evelynn's battlefield, a card you won't need to flip) → fight.

**Five facts about Hidden.**

| | |
|---|---|
| To hide | Your turn, **Open State**, pay `[A]` (a Gold pays it), at a battlefield **you already control** (§811.1.b) |
| How many | One per battlefield (§107.3.b); **Bandle Tree holds two** for whoever controls it (§107.3.b.1, §190.6.d) |
| When you can flip it | **The next turn**, not this one. From then on it has **Reaction** and is played ignoring its base cost, Energy and Power (§811.1.b, §204.1.a) |
| Where it acts | **That battlefield.** A unit lands there; a play effect's or a spell's targets are chosen there (§811.1.d.1–.3) |
| If you lose the battlefield | The card is **trashed** (§323.6.a) |

**The three ways this deck loses:**
1. Hiding at a battlefield you then lose (two cards, at Bandle Tree).
2. Flipping the hide at Evelynn's battlefield to defend, and losing her point.
3. A draw on time: a slow game 2, or a game 3 started that can't finish.

---

## 1. What the deck is trying to do

**The goal is three match wins at a Nexus Night**: Jay's store runs 3 rounds, best of three, 50-minute rounds, low OPL (TR §205.2), with meta decks (Irelia among them, no Aurora) beside casual and homebrew decks. That asks three things beyond being good: **finishing inside the clock**, **breadth** (flexible answers in the main deck, narrow ones in the sideboard), and **consistency over up to nine games**.

**Goal tiers.** Each card earns its slot on its highest tier; lower tiers only break ties.

| tier | goal | the cards |
|---|---|---|
| 0 | **win inside the clock: points every turn** | Evelynn, In Control; every hold |
| 1 | **presence and fights**: bodies on battlefields, winning fights there | Staunch Survivor, Bedeviling Stranger, Tideturner, Tornado Warrior, Graves, Mercenary; Punch First, Rampage, Switcheroo, Edge of Night |
| 2 | **staying power** | Ezreal, Traveling Merchant, Fizz, Matriarch; the legend's Gold |
| 3 | **flexible denial** | Star-Crossed, Gust, Sabotage, Rampage, Graves |
| 4 | **engine perks** | no dedicated slots |

**How wide.** Two bodies a battlefield, and the hidden card is the third. Sivir sits between the hold decks and the swarm: 3.4 units by turn 3 in the goldfish, against Riven's 2.9, Irelia's 2.5 and Rek'Sai's 4.2. Going wider is the wrong direction: the Gold pays Power, never Energy, so it adds no bodies, and 2-Might bodies are what area damage kills.

**Early to late.**
1. **Early (turns 1–3):** 2-drops onto open battlefields. Each one you take is a Conquer when its showdown closes (§348.2.a), and a battlefield you control is where you can play units and hide.
2. **Midgame (turns 3–5):** two bodies and a hide at each battlefield you hold. Evelynn lands at the battlefield you can keep, with a hide she won't need to flip.
3. **Late:** one big threat breaks their last hold; Evelynn's points finish it.

---

## 2. The game in four stages

### Opening (turns 1–2)

**Turn 1: a 2-drop.** Staunch Survivor is the best one: 2 Energy and one Body Power, and **recycling that Body rune makes your first Gold** (exhausted; it readies at your next Awaken). Traveling Merchant, Bedeviling Stranger or Tideturner keep the runes on the board. A unit plays to your base or a battlefield you control (§355.2.a), so on turn 1 it goes to base.

**Turn 2: take the open battlefield, then develop.** Move first: a Conquer, and a battlefield to play onto and hide at. Then a second body there, or a hide behind the first.

**The earliest hide is turn 2**, behind a hold that is hard to break.

### Midgame (turns 3–5)

**Turn 3: Ezreal or a third body.** Ezreal discards 1 and draws 2, and from then on discounts optional additional costs (Rampage's Body, Mercenary's Accelerate) by `[1]` or `[A]` (§356.4.c, §356.4.f.1).

**Turn 4: Evelynn, Matriarch or Mercenary.** All three want turn 4; Mercenary waits in the Champion Zone, so the choice is between the two in hand. **Evelynn first if you already hold a battlefield with a hide**: she scores from your next turn. Matriarch first if the trash holds Fizz, Ezreal or a body you need back.

**Hold when it is cheap.** A held battlefield with a hidden card behind it is the "backed by a punish" hold ([strategy.md §1](../docs/strategy.md#1-the-board-is-not-the-position)): they attack into a card they can't see, and your flip costs nothing on their turn.

### Going tall (turn 5 on)

Stop spreading. Pick the threat: **Mercenary** (with Accelerate she enters ready at 6 Might with Ganking, and can be played to the battlefield you hold and move straight to the other, §805, §810), **Graves** (his attack trigger deals his Might to every enemy unit there), or **a unit wearing Edge of Night**. Pump it before it moves; the attacker must kill every defender or be recalled (§468.1.a).

### Closing (6–8 points)

**From 5 points on, check for lethal every turn, both players** ([strategy.md §0](../docs/strategy.md#0-the-order-of-every-decision)):

| you are at | and you | result |
|---|---|---|
| **6** | hold a battlefield **with Evelynn and a facedown card there** at the start of your turn | **you win**: 7 from the hold, 8 from her |
| **7** | **hold** a battlefield at the start of your turn | **you win**. Hold points are not gated (§473.1.a.1) |
| **7** | conquer, having scored the other battlefield this turn | you win |
| **7** | conquer, **not** having scored the other this turn | **you draw a card instead** (§473.1.b.1) |
| **6** | hold one, then conquer the other | win |
| **6** | hold nothing, conquer both | win |

**If they are at 7 and holding**, they win at the start of their turn unless you take the battlefield now. That outranks everything.

**Playing from behind.** The recursion is your late game: retake a battlefield with a body back from the trash, trade one-for-one. But **a player holding both battlefields wins in four turns**; break a double hold the turn it appears.

---

## 3. The clock: playing to finish

Fifty minutes for up to three games is about **16 minutes a game**. Midrange runs long when both players are careful, and **a drawn match is not a 3-0.**

**What happens at time** (TR §408.2): the player whose turn it is finishes it; then **three more turns** are played (untimed at this level); if the game is still going, a player **2 or more points ahead** wins it, otherwise it is a **draw**. **If time is called between games, no new game starts.** The match goes to whoever has more game wins.

**How to play fast without playing worse:**
- **Think on their turn.** Answer "what does their open Power beat, and which fight is rigged?" while they act, so your turn is execution.
- **Decide sideboarding before the match.** The table in section 11 makes it a one-minute job.
- **Watch the clock from game 2.** If game 2 starts past the 30-minute mark, a third game probably won't finish: play game 2 to win it outright, not to set up a long game.
- **When time is called, count the three turns.** Who gets the last one? Can you be 2 ahead at the end of it? Evelynn's point and a hold are two points in one Beginning Phase.
- **Don't hold Reactions you won't use.** A turn spent passing with runes up is a turn the clock runs and the score doesn't.

---

## 4. Your turn, in order

Before your Main Phase: you **ready everything** (the legend and last turn's Gold included), you **Hold every battlefield you control** and Evelynn's hold trigger fires, then you channel 2 and draw 1 (§315).

**Step 0 — lethal, both players.** At 6 with Evelynn and a hide on a held battlefield, you have already won at the start of this turn. Otherwise: a line to 8 now? Are they at 7 and holding?

**Step 1 — count your Power.** Ready runes by colour, ready Gold, the legend (ready after Awaken). **One rune recycled a turn makes the next Gold; pay the rest with Gold.**

**Step 2 — take the open battlefields first.** Before you play anything.

**Step 3 — buff before you move into a fight.** Attack triggers go on the chain before anyone has focus, and a showdown is Action or Reaction only (§466.2.d.1, §310). Edge of Night's Equip has no Action: your turn, Open State (§381).

**Step 4 — develop onto the battlefields you hold.** Units enter exhausted (§143.4) and still defend (§466.2.c.3).

**Step 5 — hide.** At a battlefield you control and expect to keep. **At Evelynn's battlefield, hide a card you won't need to flip.** At Bandle Tree, the second hide only when the hold is safe.

**Step 6 — fight.** The turn player orders the fights (§463.1).

**Timing, for every card in the 50:**

| speed | cards | when |
|---|---|---|
| **Reaction** | Star-Crossed, Gust, Unyielding Spirit, Disposal Order; every Hidden card once face down; Gold | any time, including on the chain (§813) |
| **Action** | Punch First, Switcheroo, Existential Dread, Wind and Ghosts, An Offer You Can't Refuse | your turn, and any showdown (§806) |
| **No keyword** | Rampage, Sabotage, units from hand, Matriarch's Empower, Edge of Night's Equip, hiding | your turn, Open State, no showdown |

---

## 5. The legend and the Gold

*When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me.* A Gold is *"[Reaction] Kill this, exhaust: Add [A]"* (§187.5): one Power of any colour.

Paying Power means recycling a rune (§164.2.b), which shrinks your board. The legend turns the first recycle each turn into a Gold that pays a Power **next** turn without recycling anything.

| Power spent each turn | runes recycled, without the legend | with the legend, once a Gold is banked |
|---|---|---|
| 1 | 1 | 1 (recycle, to keep the Gold coming) |
| 2 | 2 | **1** |
| 3 | 3 | 2, or 1 if an enemy unit died between recycles |

1. **Recycle at least once a turn**, or the Gold stops.
2. **Kills mid-turn are a second Gold**: the legend readies when enemy units die.
3. **Gold is next turn's Power, at Reaction speed**, so it pays for flips and Star-Crossed on their turn too.

Gold is never Energy. **Sigil of the Storm** (*the conqueror must recycle a rune*) is a lost rune for them and a Gold for you.

---

## 6. Hidden, precisely

**Hiding** costs `[A]`, Open State on your turn, at a battlefield you control (§811.1.b). It is not playing and opens no chain (§811.1.c.1). Gold pays the `[A]`.

**Flipping** is playing the card from face down, from your next turn on, with Reaction, ignoring its base cost (§811.1.b, §204.1.a).

**The battlefield pin** (§811.1.d): a hidden unit is played to that battlefield; a hidden spell's targets are at the battlefield it was played from; a hidden permanent's play effect targets at the battlefield it was played to. A target whose own text makes that impossible is exempt (§811.1.d.4): **Tideturner** reaches "a unit you control at another location". **The pin is read off the source** (§811.1.d.3.a): remove the hidden unit before its play effect resolves and the effect does nothing. Bedeviling Stranger and Tideturner are inside Gust's range.

**A facedown card can't answer a flip at the other battlefield**: in a 1v1, yours and theirs are always at different battlefields.

**Bandle Tree.** *"You may hide an additional card here"*, and "you" is its controller (§190.6.d): up to two facedown cards there. One for Evelynn's point, one to flip. **Losing it trashes both.** If the opponent takes it, they get the extra slot.

**The eleven Hidden cards:**

| card | from face down | best for |
|---|---|---|
| 3 Bedeviling Stranger | a 2-Might body; with 4+ units there, return an enemy unit there to hand | a wide attack |
| 2 Tideturner | swaps with a unit you control elsewhere: Graves, Mercenary or Evelynn into the fight | any attack into a hold |
| 2 Tornado Warrior | a 3-Might body; empower something there, disempowered at end of turn | Matriarch standing there (a second revive) |
| 2 Switcheroo | swap the Might of two units there, this turn | their pumped unit; Graves's trigger |
| 2 Edge of Night | attaches to a unit you control there: +2, kept | a fight decided by 1 or 2; **the best keeper under Evelynn**, since it costs nothing to leave down |

**Opponents' Hidden.** Taking the battlefield trashes it (§323.6.a). Against Evelynn decks, conquering is denial.

---

## 7. Card by card

### The legend and the champion

**Battle Mistress** — §5.

**Sivir, Mercenary** (4 Energy, 1 Chaos; 4 Might; Accelerate; *+2 Might and Ganking if you've spent two Power this turn*). Always available from the Champion Zone. **With Accelerate she pays two Power herself** and enters ready at 6 Might with Ganking (§805, §810). Any Power counts, a hide or a Gold included. Ezreal's discount can take Accelerate's Chaos away; then pay another. Star-Crossed or Emperor's Dais returns her to hand to replay.

### The clock

**Evelynn, In Control** (4 Energy, 1 Chaos; 4 Might; Disarm) — *when I hold, if you control a facedown card here, score 1 point.* A hold effect (§383.4.d) whose "if" is part of the condition (§383.2.a.1): she must be there **and** the facedown card must be there at your Beginning Phase. Her point is gaining points (§470.2), never gated (§473.1.a.1). **Disarm:** when she attacks, an enemy unit there gets −1 this turn (§831.1.d). At 4 Might she survives Bilgewater Tracker, Hextech Ray and Bellows Breath; Lost to the Sands, Falling Star and Scorched Earth kill her. She will draw removal, which is removal not spent on your 2-drops. Three copies: 56% to have seen one by turn 5.

### Presence: the 2-drops

**Staunch Survivor** (2 Energy, 1 Body; 2 Might; Assault 2, Shield 2) — **4 Might in every fight** (§807, §814). The turn-1 play.

**Bedeviling Stranger** (2 Energy, Chaos; 2 Might; Hidden) — a body either way; its bounce needs 4 or more units at the battlefield, both sides counted. **Against the store's few-unit decks (Irelia, Riven, Master Yi, Kai'Sa) it is a 2-Might Hidden body**, which is why it is the first card out in most sideboard plans.

**Traveling Merchant** (2 Energy, Chaos; 2 Might) — *when I move, discard 1, then draw 1.* Tideturner's swap is a move too.

**Tideturner** (2 Energy, Chaos; 2 Might; Hidden) — swaps with a unit you control at another location. The Graves defence.

### The 3s

**Ezreal, Prodigy** (3 Energy, 1 Chaos; 3 Might) — discard 1, draw 2; optional additional costs cost `[1]` or `[A]` less: **Rampage's +2 for free.**

**Fizz, Trickster** (3 Energy, 1 Chaos; 3 Might) — casts a spell from the trash with Energy 3 or less, ignoring its Energy, **paying its Power**, then recycles it. Every spell in the main deck qualifies.

**Tornado Warrior** (3 Energy, Chaos; 3 Might; Hidden) — a free 3-Might body from face down. With Matriarch at that battlefield it empowers her (she revives now) and disempowers her at end of turn, so her own Empower is live again next turn. Whether it resets a Matriarch who has *already* revived rests on a reading (§442.1.c with §359.3.e.14.b), not a ruling: ask a judge.

### The engine

**Tail-Cloaked Matriarch** (4 Energy, Chaos; 4 Might; Empower `[2]` + Chaos) — when Empowered, plays a unit from your trash with Energy 3 or less and Power 1 or less to your base, ignoring its cost: Staunch Survivor, Stranger, Merchant, Tideturner, Ezreal, Fizz, Tornado. It is played, so its play effect fires. **Once per time on the board** (§442.1.b, §443) unless Tornado, Star-Crossed or the Dais resets her. Her Empower is your turn, Open State (§381).

### The top end

**Graves, Blasting Through** (5 Energy, 1 Body; 4 Might) — *when I attack or defend, deal damage equal to my Might to all enemy units here; I don't deal combat damage.* Read on resolution (§359.3.f.2): pump him first. A unit moved into a fight late gets its designation and its trigger (§466.2.c.3.a, §383.4.e). Against LeBlanc, the blast fires every Deathknell.

### Fights

**Punch First** (1 Energy, 2 Body; Action) — +5 this turn. Defy can't counter it (two Power; a card's cost is its printed cost, §206).

**Rampage** (3 Energy, Body; **no timing keyword**) — your unit and theirs deal their Might to each other; **paying the optional Body gives yours +2 first**, so it wins trades that would otherwise be even. Free with Ezreal. Your turn only. With a 6-Might Mercenary it kills a 7-Might unit and she survives at 8.

**Switcheroo** (2 Energy, 2 Chaos; Hidden; Action) — swaps Might at one battlefield this turn. In response to Graves's trigger: he blasts with their biggest unit's Might.

**Edge of Night** (3 Energy, Chaos gear; +2 attached; Hidden; Equip Chaos) — from face down, attaches free to a unit you control there (Spiritforged errata "(here)"). The +2 stays while attached (§137.3).

### Denial

**Star-Crossed** (3 Energy, 1 Chaos; Reaction) — returns a friendly and an enemy unit to hand. Takes their last defender out; saves your unit; resets Fizz, Ezreal or Matriarch. Needs both targets.

**Gust** (1 Energy, Chaos; Reaction) — returns a unit at a battlefield with 3 Might or less. Theirs or yours.

**Sabotage** (1 Energy, 1 Body; no timing keyword) — reveal their hand, recycle a non-unit card. **Before the tall phase's big fight**, take the Reaction that beats your pump (Defiant Dance, Defy, Discipline, En Garde). One copy main, one in the sideboard.

### Battlefields

| game | battlefield | text | why |
|---|---|---|---|
| **1** | **Bandle Tree** | you may hide an additional card here | two hides at the battlefield you hold: one for Evelynn, one to flip |
| **going first** | **Emperor's Dais** | when you conquer here, you may pay `[1]` and return a unit you control here to hand to play a 2-Might Sand Soldier here | replay Ezreal (draw 2), Fizz (recast) or Matriarch (a fresh revive); the Soldier keeps the hold |
| **going second** | **Sigil of the Storm** | when you conquer here, you must recycle one of your runes | their recycle is a lost rune, ours a Gold; going second we have the extra rune (§487.7) |

A battlefield used in a decided game is removed for the match (§488.5); after a draw the same ones are used again (§488.5.a, TR §406.1.b). Any of the three helps the opponent if they control it.

---

## 8. Lines that win games

**1. The Evelynn close.** At 5–6 points, hold a battlefield with Evelynn and two bodies; hide Edge of Night or another card you won't flip. Defend that battlefield with the bodies and the other battlefield's hide. At 6, the start of your turn wins.

**2. Bandle Tree's two hides.** Hold Bandle Tree with Evelynn. Hide twice: a keeper for her point, and a fighter (Tideturner, Tornado, Switcheroo) to flip when they attack. She scores either way.

**3. The Graves defence.** Graves at base, a hidden Tideturner at the battlefield you hold. They attack; flip Tideturner; Graves arrives as a defender and blasts every attacker for his Might. Equip Edge of Night on him the turn before for 6.

**4. Graves with Switcheroo.** Graves defends; his trigger goes on the chain; flip Switcheroo and swap his Might with their biggest attacker before it resolves (§359.3.f.2).

**5. The Mercenary close.** At 6 holding A: Beginning Phase, 7. Play Mercenary with Accelerate to A (ready, 6 Might, Ganking), Punch First on her, move to B as an 11-Might attacker. Star-Crossed their last defender if she can't kill it. Conquering B with A scored this turn is the eighth point (§473.1.b).

**6. Sabotage, then the pump.** Before you move, Sabotage: see their hand, recycle the answer to your fight. Then buff and move.

**7. Rampage with a tall unit.** Ezreal on board makes the Body free: a 6-Might Mercenary at 8 kills their 7-drop and lives.

**8. Matriarch into Fizz into the trick.** Empower Matriarch; Fizz returns and recasts Star-Crossed or Punch First from the trash.

**9. Dais replay.** Conquer the Dais with Ezreal or Matriarch there; pay 1; a Sand Soldier holds; replay the unit for its play effect.

**10. Star-Crossed on the last defender.** Kill one of two defenders; return the other with Star-Crossed: you are the only player left, so you win the fight and conquer.

---

## 9. The numbers

**Opening hands** (39-card library, no mulligan; both players draw on turn 1 in a 1v1):

| card or group | copies | opening 4 | turn 1 | turn 2 | turn 3 | turn 4 | turn 5 |
|---|---|---|---|---|---|---|---|
| a unit at 2 Energy | 10 | 71% | 79% | 85% | 90% | 93% | 95% |
| a Hidden card | 11 | 75% | 83% | 88% | 92% | 95% | 97% |
| Evelynn, In Control | 3 | 28% | 35% | 40% | 46% | 51% | 56% |
| Star-Crossed or Gust | 5 | 44% | 52% | 59% | 65% | 70% | 75% |
| Fizz or Matriarch | 4 | 36% | 44% | 50% | 56% | 62% | 67% |
| Ezreal | 3 | 28% | 35% | 40% | 46% | 51% | 56% |
| Punch First | 3 | 28% | 35% | 40% | 46% | 51% | 56% |
| Graves | 2 | 20% | 24% | 29% | 33% | 37% | 41% |
| Sabotage | 1 | 10% | 13% | 15% | 18% | 21% | 23% |

Ezreal and Merchant draw beyond this.

**The goldfish** (`lib/sim.mjs`, 20,000 games; no Gold, no hiding, no fights, no Evelynn points):

| | on the play | on the draw |
|---|---|---|
| Energy spent, turns 1–4 | 15.9 | 17.9 |
| units on board by turn 3 | 3.4 | 3.8 |
| two units by turn 3 | 98% | 99% |
| Might on board by turn 4 | 14.6 | 16.0 |
| no play on turns 1–2 | 0% | 0% |
| a card stuck on its colour, turn 3 | 11% | 9% |

**Runes: 6 Body / 6 Chaos.** The sweep ties 5/7 and 6/6 on Energy; the exact odds before any Gold favour 6/6 where it matters:

| with no Gold, going first / second | 5 Body / 7 Chaos | 6 Body / 6 Chaos |
|---|---|---|
| a Body rune on turn 1 (Staunch Survivor) | 68% / 84% | **77% / 91%** |
| 2 Body by turn 2 (Punch First) | 58% / 75% | **73% / 88%** |
| 2 Chaos by turn 3 (Switcheroo from hand) | 99% / 100% | 96% / 99% |
| 2 Body and 2 Chaos by turn 3 | 87% / 95% | **92% / 98%** |

**The rune formula.** To cast E Energy and P Power you need **max(E, P) runes, E of them ready** ([rules.md](../docs/rules.md), Resources). Gold pays Power without a rune.

| play | cost | runes |
|---|---|---|
| Staunch Survivor | 2 + 1 Body | 2, one Body |
| Evelynn, In Control | 4 + 1 Chaos | 4, one Chaos (or a Gold) |
| Punch First | 1 + 2 Body | 2 Body, or 1 and a Gold |
| Mercenary with Accelerate | 5 + 2 Chaos | 5, two Chaos or one and a Gold |
| a hide | `[A]` | any rune, or a Gold |

**Combat sizes** (two totals; lethal is damage at or above Might, §142.4.b):

| unit | in a fight | + Punch First | + Edge of Night | + Rampage's +2 |
|---|---|---|---|---|
| Merchant, Stranger, Tideturner | 2 | 7 | 4 | 4 |
| Ezreal, Fizz, Tornado | 3 | 8 | 5 | 5 |
| Staunch Survivor | **4** | 9 | 6 | 6 |
| Evelynn, Matriarch, Graves | 4 | 9 | 6 | 6 |
| Mercenary, two Power spent | **6** | **11** | 8 | 8 |

---

## 10. Mulligans

Set aside up to 2, draw that many, the set-aside cards go to the bottom (§117).

**The goldfish says keep all.** Keep values (Energy over turns 1–4, kept against bottomed): Matriarch +1.1, Tornado +0.8, Stranger +0.8, Tideturner +0.8, Merchant +0.8, Graves +0.6, Edge of Night +0.5, Ezreal −0.1, Fizz −0.1, Evelynn −0.1, Staunch Survivor −0.5, Switcheroo −0.6, Punch First −0.7, Sabotage −0.7. It charges every Power as a lost rune with no Gold back, which is why Staunch Survivor reads negative; read it as "the curve's bodies are keeps".

**The working rule** (a reading of the plan, not tested):
- **Keep** a 2-drop plus any of: a second 2-drop, Ezreal, Evelynn, a Hidden card.
- **Bottom up to two** from a hand with no 2-drop (29% of hands), or with two 4-drops and nothing cheaper.
- **Bottom** a second situational spell (Sabotage, Punch First, Switcheroo) when the hand has no early body.
- Against Irelia, Master Yi or Riven (few units), Graves is a weaker keep than a second body; against Rengar or Rek'Sai, Graves and a Hidden card are keeps.

---

## 11. Matchups and sideboarding

**The store.** Meta decks (Irelia named) beside casual ones, no Aurora. The online forecast (`data/field.json`) is a fair guide to the meta decks' threats; the casual ones get the default plan, hold early and read their plan.

**Sideboarding.** Swaps are 1 for 1 between games; you may count their sideboard at any time (TR §403.6); runes, legend and battlefields never change (TR §403.4.b). **These plans are starting points from the cards, not tested.** Log what you change.

**The sideboard:**

| card | what it does | in against |
|---|---|---|
| 2 Vex, Apathetic | stuns every unit they play while she is at a battlefield (hidden and Ambush ones too); they can't move it that turn; Deflect | Rengar, Rek'Sai, Riven, Evelynn, Kennen, Irelia |
| 2 Existential Dread | 1 Energy, 1 Power, Action: stun an attacking enemy unit (it deals no combat damage, §424.1.b); Repeat 2 (§820): stun another, or return the stunned one to hand | Irelia, Rengar, Rek'Sai, Riven |
| 1 Wind and Ghosts | Action: a unit at a battlefield with 3 Might or less is banished (not a death, so no Deathknell, §428.2), a bigger one returns to hand | Kai'Sa, Mordekaiser, Kennen's Rhasa, LeBlanc, Vex |
| 1 Unyielding Spirit | Reaction: prevent all spell and ability damage this turn | Kai'Sa, Akali, LeBlanc, Fury removal (Bilgewater Tracker, Scorched Earth) |
| 1 An Offer You Can't Refuse | Action: kill a gear; they get an exhausted Gold | Jayce, Riven's Blade of the Exile, Kennen's Last Rites |
| 1 Sabotage | the second copy | Kai'Sa, Riven, Irelia, Jayce, Master Yi |
| 1 Graves, Blasting Through | the third copy | Rek'Sai, Rengar, LeBlanc |
| 1 Disposal Order | Reaction: recycle 3 cards from their trash, then draw 1 | Kennen, Mordekaiser, LeBlanc |

| opponent | role | what decides it | in | out |
|---|---|---|---|---|
| **Irelia** | hold; attack with two | few units (2.5 by turn 3); she wins fights with Reactions (Defiant Dance, En Garde) and readies units; stuns beat her | 2 Existential Dread, 1 Sabotage | 2 Bedeviling Stranger, 1 Rampage |
| **Kennen** | press early | before the trash fills and Rhasa lands; it holds Gust, Star-Crossed and Switcheroo for your fights, so buff before you move | Disposal Order, Wind and Ghosts, 1 Vex | 1 Graves, 1 Edge of Night, 1 Tideturner |
| **Riven** | hold; deny her holds | her units enter ready on battlefields she controls; **Defy can't counter Punch First or Switcheroo** | 2 Vex, 1 Offer, 1 Sabotage | 1 Gust, 1 Bedeviling Stranger, 1 Traveling Merchant, 1 Edge of Night |
| **Master Yi, Bladesman** | attack with two | his +2 is only for a lone defender; 1-Energy tricks and Defy protect it | 1 Sabotage, 1 Wind and Ghosts | 2 Bedeviling Stranger |
| **Kai'Sa** | press; don't overcommit | cheap removal; Thousand-Tailed Watcher (−3, minimum 1) makes their fight that turn lopsided; Time Warp | Unyielding Spirit, Wind and Ghosts, Sabotage | 1 Bedeviling Stranger, 1 Tornado Warrior, 1 Edge of Night |
| **Rengar** | hold | Ambush needs their units already at the battlefield (§822.1.b) | 2 Vex, 2 Existential Dread, 1 Graves | 1 Sabotage, 2 Edge of Night, 1 Fizz, 1 Matriarch |
| **Rek'Sai** | hold | the widest board; conquests feed its engine | 2 Vex, 2 Existential Dread, 1 Graves | 1 Sabotage, 2 Edge of Night, 1 Fizz, 1 Matriarch |
| **LeBlanc** | hold; bounce and banish | it wants its units to die | Disposal Order, Wind and Ghosts, Unyielding Spirit | 1 Sabotage, 2 Rampage |
| **Evelynn** | press her hide spots | taking a battlefield trashes her facedown cards; Gust her hidden units in response to their play effects (§811.1.d.3.a) | 2 Vex | 1 Sabotage, 1 Edge of Night |
| **Vex, Gloomist** | remove Vex first | Vex, Apathetic stuns our units played, hidden ones too; our 4 Hidden spells and gear still work | Wind and Ghosts, Sabotage | 1 Bedeviling Stranger, 1 Tornado Warrior |
| **Akali** | hold | pings and Falling Star on small bodies | Unyielding Spirit | 1 Traveling Merchant |
| **Jayce** (no Aurora) | press | nothing on board for three turns; Gutter Palace wins with exactly 4 cards in hand and 4 units at battlefields | Offer, Sabotage | 2 Graves |
| **Kha'Zix** | hold with two | its Mutating Horror gets +2 only against a lone enemy unit; two bodies a battlefield deny it | — | — |
| **casual or unknown** | hold early, read their plan | ask what they do if nothing happens ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)) | — | — |

---

## 12. Mistakes that lose games

Types from [strategy.md §8](../docs/strategy.md#8-reviewing-a-game), so the match journal's tallies stay comparable.

| mistake | type | instead |
|---|---|---|
| flipping the hide at Evelynn's battlefield to defend | conversion | defend her battlefield with bodies; flip the other battlefield's hide |
| a second hide at Bandle Tree behind a weak hold | conversion | the second hide only when the hold is safe; losing it trashes both |
| hiding at a battlefield you then lose | conversion | hide only behind a hold that is hard to break |
| starting game 3 with no chance to finish | terminal | past the 30-minute mark in game 2, play game 2 to win it outright |
| not counting the three extra turns at time | terminal | who gets the last turn; can you be 2 ahead after it? |
| paying every Power from runes while a Gold sits ready | conversion | one recycle a turn for the Gold, the rest from Gold |
| planning Rampage as a fight trick | state | no Action: your turn only |
| Rampage without its Body when you could pay it | conversion | the +2 is what wins the trade; free with Ezreal |
| Mercenary with one Power spent | state | Accelerate plus her cost is two, unless Ezreal discounted one |
| buffing after the move | state | buff, then move |
| attacking into a hold you can't clear | state | the attacker must kill every defender (§468.1.a) |
| going wide into Kai'Sa's Watcher turn | pressure | commit what the battlefield needs |
| missing their hold at 7 | terminal | if they are at 7 and holding, take that battlefield now |

---

## 13. Errata, rulings and open questions

**Errata that touches the deck:** Edge of Night (Spiritforged: "attach it to a unit you control (here)"); Tideturner (Vendetta FAQ: a unit you control, at another location); Emperor's Dais (Vendetta: pay-to-do).

**Open questions for a judge, or the Radiance FAQ:**
1. **Tornado Warrior on an already-Empowered Matriarch**: does its end-of-turn disempower still reset her? This guide's reading says yes (§442.1.c, §359.3.e.14.b); no ruling.
2. **Mercenary on the opponent's turn**: "this turn" read as whichever turn it is, so two Power spent on their turn makes her a 6-Might defender. Plain on the card, not ruled.
3. **Evelynn and a removed facedown card**: her condition is checked when she holds (§383.2.a.1). If the facedown card leaves after the trigger and before it resolves, the reading is that the point is still gained (the condition was met). Not ruled.
4. **Battlefield order in games 2 and 3**: the loser of a game chooses who plays first (TR §407.4), and battlefields are chosen at setup (§488.5). The plan assumes you know the order first.

---

## Sources and method

- **The list:** [decklab/sivir-nexus-night.md](../decklab/sivir-nexus-night.md), plan first (the jobs the plan needs, then the cards), with all 188 legal units, 110 spells and gear and 71 battlefields read one by one. Base: the first decklab Sivir.
- **Targets:** good finishes by measured style (`lib/placing.mjs`, `data/archetypes.json`).
- **Rules:** [rules.md](../docs/rules.md), then the verbatim [rules-full.md](../docs/rules-full.md) and the [FAQ](../docs/rules-faq.md). Core Rules and Tournament Rules 2026-10-09.
- **Numbers:** `lib/sim.mjs` (goldfish, mulligans, rune sweep); exact hypergeometric odds; `data/field.json` for the online field.
- **The store:** Jay — 3 rounds, best of three, 50 minutes; meta decks (Irelia) beside casual ones, no Aurora.

## What this guide does not claim

- **That the deck is good, or will 3-0.** No results. It is a reasoned list; the first night tests it.
- **Who is favoured in any matchup.** The notes say what each turns on.
- **That the sideboard plans are right.** Starting plans from the cards.
- **Anything the goldfish can't see:** the Gold, hiding, fights, Evelynn's points.

**What to log, every match:** opponent, result, and three yes/no notes — **did Evelynn's point land?**, **did the early game hold with 10 cheap units?**, **did 6+ Might units walk through?** The bench has the fix for each: Bushwhack Trap, more 2-drops, Wind and Ghosts in the main deck.
