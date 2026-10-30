---
title: Sivir, One Army Two Fights — deckbuilding worksheet
subtitle: Battle Mistress (Body/Chaos), Radiance. The readying build: midrange that races to 6, then wins with two fights in one turn from many angles. Built with Jay a stage at a time.
started: 2026-10-30
status: two stress tests done; in the app as "Sivir: One Army, Two Fights (draft)" 30 Oct 2026 (D5b + The Good Stuff), stage 6 (play it). To get: Nidalee ×2. Tested against R5 ("Sivir is trying her best", sivir-ready.md) when built
---

How this worksheet works: [README.md](README.md). Six stages, each agreed before the next.
Built from scratch (Jay), not from R5. The test at the end is this deck against R5, so the two have to
be genuinely different decks.

## 1. Identity — agreed 30 Oct 2026

**One army, two fights.** Win battlefield A, ready the units, take them to B and win there too. Two
conquests in a turn scores both battlefields, which is what lets the 8th point count (§473.1.b).

**As the finisher, not the routine** (Jay agreed, after the research below). Every turn is the wrong
frequency:
1. You can usually score twice without readying: a unit to each battlefield already does it when both
   are lightly defended. Readying earns its card only when one battlefield needs the whole force.
2. Moving the army A → B leaves A empty, and they walk in for free: a "bad win" (`docs/strategy.md` §1).
3. Each two-fight turn spends a readier and a Ganker. Doing it every turn empties the hand.

So: midrange to 6, the same road as R5, then a closing turn that has many ways to happen.

**The research** (30 Oct 2026; thin): riftbound.gg's movement guide (June 2025, before most of the pool;
its example is a 7–7 game won by taking one battlefield and Ganking into the other), its note on
"conqueror" decks that "go to 6 points, and then look to conquer both battlefields at once", Red Riot
Games' "When to conquer" (decide on what *their* board does next turn), and a RiftJudge ruling (one
standard move can't attack two battlefields). Riftmana refused the fetch. `docs/strategy.md` remains
the better guide.

## 2. How it wins — drafted 30 Oct 2026, to agree

### What makes it a different deck from R5 (Jay: "as long as we feel it's distinct")

| | R5 | this deck |
|---|---|---|
| **the close** | one Ganker: Sivir, played onto the conquered battlefield | many: Nocturne, Nilah, Miss Fortune, Jayce, Sivir, any unit standing on a Portable Portal, any unit Ride the Wind moves |
| **what stops the close** (the audit's two: a spell on the Ganker at B, a defender added mid-fight) | protection: Abandon, Switcheroo, Star-Crossed, Gust | redundancy: answer one Ganker and the next one goes |
| **their Vex** | stuns Sivir as she's played, so the close needs the walk-in or Vex gone | stuns only units *played* ("When an opponent plays a unit…"). An army already on the board isn't played that turn, so the two-fight turn ignores her |
| **slots spent on** | interaction | readiers and Ganking bodies |

**Distinctness test** (a target, to agree): two winning lists of the same legend differ by a median of
9 copies (`docs/deckbuilding.md` §3). A different deck, not a variant, should differ from R5 by clearly
more: **at least 15 of 40 copies**, checked when the list exists.

### The two pieces of the closing turn (rules checked)

- **Portable Portal** (2E, gear, Deploy): plays *only* to a battlefield, any battlefield, even theirs
  (§830.1.b.1); stays there (not recalled, §830.1.b); dies when an opponent holds there. "Friendly units
  here have Ganking." **Played at A, it gives the whole army at A Ganking**, and paying a Body readies one
  of them. With On the Hunt, the whole army goes A → B.
- **Ride the Wind** (2E 1P, Action): "Move a friendly unit and ready it." An effect move has only the
  limits its card names (§451.1), so it moves a unit A → B **without Ganking**. It's a Gank by itself.
  Defy can counter it.
- **On the Hunt** (1E 2P, Sivir's signature): readies every unit. Fizz can recast it.
- **First Mate** (on play, ready another unit), **Miss Fortune, Captain** (the first time she moves each
  turn, ready something else), **Lucian, Merciless** (readies himself on his first conquer each turn).

### Four routes to 8, and which deck leans on which (Jay: "an ideal winning move, but flexibility")

Every deck wins on points, so the win condition is the same in both decks. What differs is which
route each one is built to take. From 6 (or 7), the last points come one of four ways:

| route | how | needs | R5 | this deck |
|---|---|---|---|---|
| **1. two fights** | win A, ready, take B the same turn | a readier and a way to B | Sivir only | **the ideal**: many angles |
| **2. split** | a unit from base to each battlefield | width, both lightly defended | yes | yes: the bodies are the same ones |
| **3. hold + one fight** | hold A at the start of your turn (that counts as scoring A, `docs/rules.md` "Read 'Scored'"), then conquer B | a holder that survives their turn | **its strength** | needs keeping |
| **4. hold at 7** | a hold is never gated (§473.1.a.1) | the same holder, one more turn | its answer to Rengar and Baron | needs keeping |

**R5 leans on routes 3 and 4** (holders plus answers on their turn); **this deck leans on 1 and 2**
(readiers and width). That's the real difference in how they win.

**The flexibility rule for stage 3:** route 1 is the ideal, never the only way. The list keeps enough
sturdy holders and answers on their turn that routes 3 and 4 still exist, and prefers readiers that
are also bodies (First Mate, Miss Fortune, Nocturne, Jayce) over ones that do only route 1 (On the
Hunt, Portable Portal). A route-1 card that's dead when the close isn't on should be the exception.

### The road to 6

1. **Early:** cheap units take the first point, as in R5.
2. **Middle:** win trades, hold one when it's backed (`strategy.md` §2's role flip). Ganking bodies
   earn their keep here too: a unit at A can retake B without going home first.
3. **At 6:** any turn with a readier and a Ganker (or a Portal) on hand is a winning threat. The
   threat makes them defend both battlefields, which is pressure even on turns you don't take it.

### Goal tiers (drafted, to agree)

| tier | goal | measure |
|---|---|---|
| 1 | the two-fight turn: from 6 points, a readier and a way to reach B | by turn 7, the chance of holding both (goldfish) |
| 2 | getting to 6: bodies early, trades won | two units by turn 3; Might by turn 5 |
| 3 | the board survives until then: answers to what kills or locks it | an answer usable on their turn; field answers per 6+ Might unit |
| 4 | value: Gold and cards back | Innovator, Merchant, Treasure Hunter-type payoffs |

### Role by matchup (drafted from R5's audit; no games)

| matchup | role | what matters for two fights |
|---|---|---|
| Vex | push | her stun doesn't touch the army already out. Their **Tideturner at B** still adds a defender |
| Rengar | defend first, then hold at 7 | his Ambush and Thrill refill B mid-fight; the hold at 7 is cleaner than two fights |
| LeBlanc | push | bounce Rex before the close, as in R5 |
| Diana, Irelia, Kennen | hold cheaply, close in one go | their Ride the Wind adds a defender at B (Kennen 84% of lists) |
| Kai'Sa | hold cheaply, close in one go | the army at A is a target for her sweepers; don't overcommit before the close |
| Riven, Master Yi | close on the turn they tap out of Defy and tricks | Defy counters Ride the Wind, not On the Hunt (1E 2P) |

### Risks, up front

- **All-in on the board.** Readying spells do nothing with no units out; a sweeper the turn before the
  close costs more here than in R5.
- **Gear hate.** An Offer You Can't Refuse (174 Body/Chaos lists since 23 Oct) kills the Portal; holding
  at A kills it too.
- **Mageseeker Warden** at a battlefield stops spells and abilities readying our units
  (`docs/rules-rulings.md`: the move still happens, only the ready is negated). Rare: 7 of 2,222 lists
  since 23 Oct, one each in seven legends.
- **Less interaction.** The slots go to readiers and Gankers, so fewer answers on their turn than R5's
  39% by turn 5. Stage 3 sets how far that can drop.

## 3. Jobs and targets — drafted 30 Oct 2026, to agree

Stage 2 agreed (Jay: "as long as we're building something distinct… keep rolling").

**The winners' shapes** (sivir-ready.md stage 3, `data/archetypes.json`): 19–30 units, average cost
2.6–2.9, 17–24 cheap cards, 3–8 interaction. R5: 23 units, 15 spells, 2 gear.

**What the odds say** (hypergeometric, 39-card library; 11 cards seen by turn 7, draw-only, an upper
bound since some get spent earlier): at least one of a job by then is 88% with 6 copies, 92% with 7,
95% with 8. A readier *and* a separate Ganker by turn 7 is 76% at 7 + 5, 81% at 7 + 6, 84% at 8 + 6.

**Sivir is always the backup Ganker.** She starts in the Champion Zone, so route 1 never needs a
second card to reach B, only a readier and 2 Power. Cards that do both jobs at once count double:
**Ride the Wind** (moves A → B and readies), **Portable Portal** (readies one, gives Ganking),
**Miss Fortune** (Ganks, readies another).

| # | job | target | candidates (stage 4 decides) |
|---|---|---|---|
| 1 | **Readiers**: ready a fighter at A, or move one A → B ready | **8** (95% by turn 7) | Ride the Wind, First Mate, On the Hunt, Portable Portal, Miss Fortune, Lucian; Fizz recasts On the Hunt |
| 2 | **Ways to B** besides Sivir | **6** | Nocturne, Nilah, Miss Fortune, Jayce, Portable Portal, Ride the Wind |
| 3 | **Holders**: survive their turn at a battlefield (routes 3–4) | **6** | Rengar, Vex, Staunch, Nidalee… |
| 4 | **Answers on their turn / clearing** | **6–8** | R5 had ~13; this is where the slots come from |
| 5 | **Cheap pressure**: 3 Energy or less, scores early | **~17** | the early curve, as in R5 |

Cards fill two jobs where they can; each job must reach its count. The flexibility rule (stage 2)
means job 1 should lean on cards that are also bodies or also Ganks.

**On the Hunt: three or none?** It's Sivir's signature. Winning lists run a signature at 3 (44%) or
not at all (31%); in between is 25% (`docs/deckbuilding.md` §1). It's the strongest readier (all
units) but does only route 1. To decide with Jay.

## 4. Card by card — started 30 Oct 2026

On the Hunt ×2 agreed (Jay).

**Draft D1** (as swaps from R5; 17 copies different, so it passes the distinctness bar):
−2 Merchant −2 Tideturner −1 Evelynn −3 Ezreal −2 Rampage −2 Rebuke −1 Abandon −1 Gust −2 Edge −1 Sabotage;
+3 First Mate +3 Nocturne +2 Treasure Hunter +2 Irresistible Faefolk +1 Miss Fortune, Captain +2 On the
Hunt +3 Ride the Wind +1 Portable Portal. Readiers 10, ways to B 8.

**`try` against R5: D1 fails the flexibility rule.**
- An answer usable on their turn by turn 5 falls from 39% to 7% (on the play) and from 60% to 21% (on the draw).
- Answer copies per regular 6+ Might unit fall from 7.3 to 3.8, and every S/A legend's key units drop from 8–9 answers to 4.
- Extra cards drawn fall from 2.7 to 0 (Ezreal gone).
- Two units by turn 3 is 94%, against 97%.

**Next, D2:** trim the route-1 extras (Miss Fortune, Portal, Treasure Hunter) back to readiers 8 and ways
to B 6, and spend the slots on answers that also clear B for the two-fight turn. The candidates not in R5 are
Bedeviling Stranger (a Hidden 2-drop), Challenge, Hard Bargain and Existential Dread; add draw (Kinkou
Initiate, or Ezreal back if distinctness allows). Then re-run `try`, and check the turn-1 2-drops.

**D2, five variants measured** (`try` against R5; the goldfish's "answer usable on their turn" counts
Rebuke, Star-Crossed and face-down cards):

| variant (from D1 −MF −Portal −2 Treasure Hunter) | answer on their turn t5, play / draw | answers per 6+ unit | two units by t3 |
|---|---|---|---|
| D2a +2 Stranger +2 Challenge | 10% / 25% | 5.5 | 93% |
| D2b +2 Stranger +2 Hard Bargain | 10% / 25% | 3.8 | 93% |
| D2c D2a −2 Faefolk +2 Ezreal | 6% / 22% | 5.5 | 91% |
| **D2d: Rebuke ×2 kept, +2 Stranger** | **19% / 44%** | **5.5** | **93%** |
| D2e D2d −2 Faefolk +1 The Good Stuff +1 Kinkou | 14% / 40% | 5.5 | 90% |
| R5, for reference | 39% / 60% | 7.3 | 97% |

**D2d is the draft.** Rebuke is both an answer and the cleanest way to clear B's defender, so it earns its
place here even though R5 runs it too. Exactly 15 copies differ from R5, so it meets the bar.

| | cards |
|---|---|
| units (25) | Sivir · Rengar ×2 · Vex ×2 · Staunch ×2 · Bedeviling Stranger ×2 · Irresistible Faefolk ×2 · Reckless Innovator ×3 · Fizz ×3 · Nidalee ×2 · First Mate ×3 · Nocturne ×3 |
| spells (15) | On the Hunt ×2 · Ride the Wind ×3 · Punch First ×3 · Star-Crossed ×2 · Switcheroo ×2 · Rebuke ×2 · Sabotage |

The jobs: readiers 8 (On the Hunt, Ride the Wind, First Mate); ways to B 6 (Ride the Wind, Nocturne), Sivir
always; holders Rengar, Vex, Staunch, Nidalee, Nocturne; answers 9 with Stranger and Sabotage (12 with
Punch First); 19 cheap; six 2-drops (R5: seven).

**Open: card draw.** The goldfish counts 0 extra cards against R5's 2.7: Ezreal is gone. It doesn't
model Innovator's paid draw, Nidalee's draw on a won fight, or The Good Stuff and Kinkou, so the true
number isn't 0, but this deck is more exposed to running dry than R5 is. Ezreal back for Faefolk puts
it at 13 different, under the bar.

## Stress test 1 (30 Oct 2026)

Four agents (rules and interactions, the local five, the S tier, play patterns with web research), the
same brief, reports in the session scratchpad. Jay: "feel free to add cards back in". No games: card
text, list shares since 23 Oct, and the rules.

**What it found:**
- **Readying doesn't move the army** (§144.4, §810.1.b). After A, only a unit with Ganking goes on to B.
  Without Portable Portal, B is fought by Nocturne, Sivir, a Ride the Wind unit, Rengar's Ambush
  (§822.1.d), or a fresh unit walking in from base. On the Hunt only helps Nocturne; Sivir enters ready
  through Accelerate anyway. Stage 2's "whole army goes A → B" was true only with Portal.
- **Move to B in one go.** The first arrival starts B's fight and shuts off further normal moves
  (§323.12, §144.1.c). Damage heals after A's fight (§468.1.a.1); "this turn" effects carry over.
- **Gold made on the closing turn can't be spent that turn** (it enters exhausted, §415.1.b). Sivir's
  2 Power comes from runes or earlier Gold.
- **Faefolk's real job:** pull B's lone defender into A, so A is one big fight and B is a walk-in. It also
  trashes their face-down card at B if B empties (§323.6.a). Live against Vex (pulls her) and Yi.
- **Bedeviling Stranger** does nothing on our attacking turn (Hidden only works at a battlefield we
  control); it earns its slot on defence and as a 2-drop.
- **By matchup**, two fights is the close against Kai'Sa, early LeBlanc, Kennen and Azir (with two
  threats at B). Against Vex, Rengar, Diana, Riven, Irelia and Yi the close is a hold (route 3 or 4) or
  a split, because Defy counters Ride the Wind (85–97% of their lists) and something refills B. Baron
  lands: only the hold at 7.
- **Where it breaks, most likely first:** a lone attacker at B answered (no counterspell in D2d); B
  refilled mid-fight (Ride the Wind 403 and Tideturner 401 of 2,222 lists); a sweep the turn before
  (Thousand-Tailed Watcher, 416 lists); running dry.

**D3** = D2d −2 On the Hunt +2 Portable Portal, −1 Switcheroo +1 Repulse; sideboard −Repulse +Switcheroo,
−1 Offer +Gust, −1 Unyielding Spirit +Abandon. Sources: Portal (play patterns; also my V1/V3), Repulse
(local), sideboard (local, S tier). Not taken: −Sabotage +Abandon (S tier; Jay keeps Sabotage, Abandon
goes to the sideboard instead); Nilah for First Mate (both agents rated First Mate live everywhere, and
with Portal it readies a fought unit that can then Gank).

**Why Portal now:** an army *holding* A starts the turn ready, so with Portal there every unit at A Ganks
to B: route 3 (hold A, conquer B) with the whole army, the cheapest close. Gear can't be responded to
(§337.2), so Defy can't stop it. First Mate's ready on a fought unit at a Portal is a second fighter at B.

| `try` against R5 | R5 | D2d | D3 |
|---|---|---|---|
| answer usable on their turn by t5, play / draw | 39% / 60% | 20% / 44% | **26% / 51%** |
| two units by turn 3 (play) | 97% | 93% | 98% |
| Might by turn 5 (normal) | 15.3 | 15.2 | 15.7 |
| Defy-countered spells (popularity) | 3.5 | 2.6 | 3.0 |
| Fizz finds a spell (normal) | 72% | 65% | 62% |
| Sivir switched on, turns 4–8 (normal) | 49% | 53% | 47% |
| Gold a game (normal) | 4.31 | 4.39 | 4.05 |

Costs: An Offer You Can't Refuse kills Portal (174 Body/Chaos lists), and it dies when they hold there.
16 copies differ from R5. Readiers: Ride the Wind 3, First Mate 3, Portal 2 = 8. Ways to B: Ride the Wind 3,
Nocturne 3, Portal 2, Rengar 2 = 10, plus Sivir. **Reverses On the Hunt ×2 (Jay's call) on the rules
finding; to agree.**

**D4, agreed in principle** (Jay: "i agree, if not completely cutting it! up to what you think is best"):
D3 −1 First Mate +1 On the Hunt. With a Portal at A, On the Hunt readies the whole army after A's fight
and every unit Ganks to B, so ×1 has a real job. A Ride the Wind cut was measured and dropped (Jay: Defy is
a weight, not a veto; "they only have 3 Defys"). First Mate over Stranger, because both Strangers are 2-drops
and defence; the two measured the same (`try`: answer on their turn t5 27/50% vs 25/49%; two units by t3 97%
vs 96%). Readiers 8 (Ride the Wind 3, First Mate 2, Portal 2, On the Hunt 1), ways to B 10 plus Sivir;
16 different from R5.

## Stress test 2 (30 Oct 2026)

Three agents: the rules of D4's new lines, the field again (11 matchups), and eight hand-played games
(fixed-seed shuffles, opponents' median lists since 23 Oct; a small sample, every decision by one agent).
Reports in the session scratchpad (`rules2.md`, `field2.md`, `games.md`).

**Rules** (high confidence unless noted):
- **Portal after A is won, never before.** Gear can't be responded to (§337.2) and the moves after it
  can't be reacted to (§448.3.c); every gear removal in the field is Action speed or slower, so a Portal
  played on the closing turn can't be stopped. It's exposed only while it sits on the board.
- **Portal readies a unit by itself** (pay Body), and that Power counts toward Sivir's 2.
- **Fighting doesn't exhaust; moving does.** The cleanest close: Faefolk walks into the A we hold and
  pulls B's lone defender in; the army kills it and stays ready; B is empty; walk in.
- **Units leaving A:** if all of them leave, A goes uncontrolled and our face-down card there is trashed
  (§323.5, §323.6.a). Stress test 1's "A usually stays yours" was wrong once Portal is in. Always leave one.
- **Stress test 1's open items, settled:** their Vex's "can't move" cancels a Ride the Wind move (the
  unit still readies); Gold made on earlier turns pays Sivir's Accelerate Chaos (medium-high); their
  Stranger from Hidden is pinned to its own battlefield (plan as if; ask a judge); **Faefolk's pull
  chooses**, so Deflect, Not So Fast and "can't be chosen" stop it.

**The field:** Portal makes route 3 (hold A, the whole army to B) the best close against Vex, Riven
(before Baron), Irelia and Yi. But at least one Portal is only 49% by turn 7 (hypergeometric): in half
the games the close is Nocturne, Sivir or Ride the Wind. **On the Hunt ×1 earns its slot in 4 of 11
matchups**; its best line needs a Portal too (~13% by turn 7). Weakest main-deck slot.

**The games (8, hand-played):** about 5 wins, 2 losses, 1 open. **Holds closed five; the two-fight turn
never won a game** (it came up twice and worked once, as tempo). Portal mattered in 4 of the 6 games it
was drawn, each time as Ganking for one unit. The real close was "reach 7 holding both, win on the next
hold". On the Hunt was drawn twice, never cast. Turn 1 on the play had a play in 1 of 4 games: Staunch
needs a Body rune; only Faefolk and Stranger are colourless 2-drops (Innovator's turn-2 Accelerate covers
the gap). Ran out of bodies twice on the draw against big-unit decks.

**What this means for the identity.** In play the deck wins the way R5 does, by holds; what's distinct
is *how it takes the second battlefield*: Faefolk's pull, the Portal's Ganking, Ride the Wind, more
Gankers. That's a real difference, but smaller than stage 1 pitched.

**D5b** = D4 −1 On the Hunt (to the sideboard) +1 Faefolk; −1 Nocturne +1 Star-Crossed (field); Repulse ↔
Abandon, main to sideboard (field; Abandon covers Moonfall, Defiant Dance, their Ride the Wind, Charm).
Sideboard: Graves ×2, Unyielding Spirit, An Offer You Can't Refuse, Rampage, Switcheroo, On the Hunt,
Ravenbloom Prefect, Gust, Repulse. 15 different from R5 (the bar).

| `try` vs R5 | R5 | D4 | D5 (Portal 3 instead of Faefolk 3) | **D5b** |
|---|---|---|---|---|
| answer usable on their turn t5, play / draw | 39 / 60% | 27 / 50% | 37 / 62% | **37 / 62%** |
| answer copies per regular 6+ unit | 7.3 | 5.5 | 6.4 | **6.4** |
| two units by turn 3 (play) | 97% | 97% | 98% | **99%** |
| Might by turn 5 (normal) | 15.3 | 15.0 | 14.3 | **14.9** |
| Sivir switched on t4–8 (normal) | 49% | 49% | 45% | **45%** |
| Gold a game (normal) | 4.31 | 4.20 | 3.99 | **4.00** |

Not taken: −1 Fizz +1 Stranger (games; Fizz recast nothing in three games, but it's a 3-Might body and its
late recast is real); Portal ×3 (D5: more of the identity line, 64% by turn 7, at 0.6 Might).

## In the app: "Sivir: One Army, Two Fights (draft)" (30 Oct 2026)

D5b −1 Switcheroo +1 The Good Stuff (Jay: "if u think it's worth it… let's try it tho"). The draw fix for a
deck that wins by holds: discard 1, draw 3, and it returns to hand each time we hold its battlefield, so
every hold can replay it. The goldfish doesn't model its draw: answer on their turn t5 37→35% (play), Might
by turn 5 14.9→15.0. Fights without Switcheroo: Punch First ×3, five bounces (Star-Crossed ×3, Rebuke ×2),
Abandon, Ambush, Faefolk's pull; one Switcheroo stays in the sideboard. 16 copies differ from R5.

| | cards |
|---|---|
| units (24) | Sivir · Rengar ×2 · Vex ×2 · Staunch ×2 · Bedeviling Stranger ×2 · Irresistible Faefolk ×3 · Reckless Innovator ×3 · Fizz ×3 · Nidalee ×2 · First Mate ×2 · Nocturne ×2 |
| spells (14) | Ride the Wind ×3 · Punch First ×3 · Star-Crossed ×3 · Rebuke ×2 · Abandon · Sabotage |
| gear (2) | Portable Portal ×2 · The Good Stuff |
| runes, battlefields | 6 Body / 6 Chaos · Windswept Hillock, Amateur Recital, Zaun Warrens (below) |
| sideboard (10) | Graves ×2 · Unyielding Spirit · An Offer You Can't Refuse · Rampage · Switcheroo · On the Hunt · Ravenbloom Prefect · Gust · Repulse |

(Correction: the units line in the chat summary of D5b was garbled; this table is the list.)

**`scripts/sim`** (20,000 games): runes 6/6 stay; every split from 3/9 to 7/5 spends the same Energy
(18.3, turns 1–4), so no split is meaningfully better. Stuck on a Power colour on turn 1: 24% on the play
(Staunch is the Body 2-drop). Two units by turn 3: 100%. Mulligan: keep all; keep Innovator, Vex, Rengar,
First Mate, Faefolk first; bottom Punch First, Sabotage, Staunch first.

**Battlefields** (Jay: "we probably need distinct battlefields… zaun warrens"; then "anything ultra
specific that doesn't help the other person"). R5's three were Dais, Circle, Sigil. Every battlefield used
in a decided game is retired for the match (§488.5), so each has a slot:

| battlefield | why it's ours more than theirs | pick it |
|---|---|---|
| **Amateur Recital** | "When you hold here, you may move a unit at a battlefield to its base." The hold sends B's defender home at the start of our turn, so route 3 (hold A, conquer B) walks into an empty B: the way most hand-played games closed. Pays only the holder, and holding is our plan | **going first** (we reach it and hold it first) |
| **Windswept Hillock** | "Units here have Ganking." A free Portal: an army holding it Ganks to B every turn. We're the Ganking deck | **going second**; game 1 against Kennen |
| **Zaun Warrens** | loot on conquer; pitches the situational cards (Sabotage, Abandon, Ride the Wind into Defy) and digs for Portal and The Good Stuff. Jun's game-1 default | **game 1 (blind)**, except Kennen (87 Kennen lists run it) |

Looked at and passed: Grove of the God-Willow (rewards whoever holds it), Seat of Power (pays only on the
closing turn), Back-Alley Bar (+1 Might moving out; small), Firelights' Hideout, Veiled Temple, Hall of
Legends (narrow). The going-first/going-second split is reasoning, not measured; the journal checks it.
Recital's move chooses its target (stress test 2: moves that choose are blocked by Deflect and "can't be
chosen"), so their Vex at B costs 1 more Power to send home.

**Watch items** (stage 6: a change only when a logged game trips one):
1. **Which route closed?** Two fights, split, hold-then-conquer, or hold at 7. Did the Portal or Faefolk
   take B?
2. **Ran out of cards?** Turn and opponent; was The Good Stuff drawn, and how many times was it replayed?
3. **Turn 1 on the play:** a play, or stuck (Staunch behind Chaos runes)?
4. **Portal:** played after A was won? Killed? Did leaving A empty cost a game?
5. **A lone big unit with no bounce in hand** (Switcheroo gone).
6. **Per game:** opponent, went first or second, battlefield picked.

## Log

- **30 Oct 2026:** opened (Jay: "we can still create from scratch"). Identity agreed: "one army, two
  fights", as the finisher (Jay, after the research). Checked: their Vex stuns only units played;
  Ride the Wind moves battlefield to battlefield without Ganking (§451.1); Portable Portal's Deploy
  (§830). Stage 2 drafted, with a distinctness test against R5.
- **30 Oct 2026:** stages 2–3 agreed (four routes to 8; On the Hunt ×2). Stage 4: D1 failed the
  flexibility rule (answers 7%); D2d kept Rebuke. Stress test 1 (four agents): readying doesn't move the
  army without Ganking → D3/D4 with Portable Portal (Jay: On the Hunt "if not completely cutting it"; Defy
  is a weight, not a veto). Stress test 2 (three agents, eight hand-played games): holds close most games;
  D5b (−On the Hunt to the sideboard +Faefolk, −Nocturne +Star-Crossed, Abandon for Repulse), then
  −Switcheroo +The Good Stuff for draw (Jay). **Written to the app** as "Sivir: One Army, Two Fights
  (draft)" (row backed up). Runes 6/6 by `scripts/sim`. Watch items set.
