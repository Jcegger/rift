---
title: Sivir, Ready and Gank — deckbuilding worksheet
subtitle: Battle Mistress (Body/Chaos), Radiance. Jay's own Sivir, rebuilt around Sivir as the finisher. Built with Jay a stage at a time.
started: 2026-10-29
status: R5 locked 30 Oct 2026, after the matchup audit and three stress tests, and made the new v1 — the app's "Sivir is trying her best" is now R5 (Jay; guides/sivir-trying-her-best.md updated). Stage 6 (freeze and play). "Sivir Ready (draft)" was removed from the app on 30 Oct 2026, with the other Sivir test decks (Jay: only the locked v1 stays); the pure readying build gets its own worksheet. To get: Nidalee ×2
---

How this worksheet works: [README.md](README.md). Six stages, each agreed before the next.
Sivir is rarely played, so this is our own build: Battle Mistress had 3 legal lists since
23 Oct 2026. The evidence comes from card text, the rules, and how the cards do in *other*
decks, not from Sivir winners.

## Why a new direction (29 Oct 2026)

From [sivir-v2.md](sivir-v2.md)'s "how it wins, reopened": the deck makes plenty of Power and
has almost nothing that turns it into a won fight. Without Punch First it can't close (Jay). Every
failed top end (Graves, Beast Below, Zed) had to survive an enemy turn before acting, and the
removal field took that window. Sivir was being spent as a 4-drop body ("one conquer and then
lose her") when she is **the one finisher the deck never has to draw**: the Chosen Champion starts
in the Champion Zone and is playable from there (§103.3.a.1).

Jay: "the recursion trick Randy did was cool, but maybe we just need a better direction."

## 1. Identity — agreed 29 Oct 2026

**Legend** Battle Mistress (Body/Chaos) · **Champion** Sivir, Mercenary · **Archetype** midrange
that **closes with readied threats**. **The goal** (carried over): fun, a little off-meta, 2-1 at
Nexus Night. Never Aurora; not a Kha'Zix clone.

**Sivir, Mercenary:** 4 Energy 1 Power, 4 Might. Accelerate (1 Energy + 1 Chaos: enters ready).
"If you've spent at least 2 Power this turn, I have +2 Might and Ganking." The Accelerate's Chaos
counts toward the 2.

## 2. How it wins — drafted 29 Oct 2026, to agree

**The engine (kept):** Battle Mistress turns recycled runes into Gold, so the deck is long on
Power and short on Energy. **The change:** the Power now pays for *readying*, so threats act the
turn they land and the closing turn attacks twice.

**The closing turn:** Sivir to base or a battlefield you control. Ready her (Accelerate, Ride the
Wind or First Mate), spend 2 Power (Accelerate's Chaos, Ride the Wind, On the Hunt, Punch First)
for 6 Might and Ganking, and take or break the last battlefield before they can answer. With
**On the Hunt** (1 Energy 2 Power, "ready your units") the board attacks, readies, and attacks again.

**The rule for every threat:** it acts the turn it lands (Accelerate, Ambush, a Hidden flip, or
readied by a card), or it isn't a threat in this field.

**Kept from v1** (Jay, 29 Oct, pulling weight): Sabotage, Rampage, Rengar, Reckless Innovator,
Punch First, Staunch Survivor, Ezreal, Fizz; Edge of Night (overperforming); Evelynn; Vex (liked,
often removed). **Likely to make room:** the recursion half Jay didn't name: Tornado Warrior,
Traveling Merchant, maybe a Tail-Cloaked Matriarch. Nothing is cut until stage 4.

**The readying pool** (Body/Chaos, legal; lists since 23 Oct, of 2,222):

| card | text | evidence |
|---|---|---|
| Ride the Wind (Chaos, 2E 1P, Action) | move a friendly unit and ready it | 403 lists, 172 placed (Riven, Kennen) |
| First Mate (Body, 3E, 3 Might) | when you play me, ready another unit | 234 lists, 79 placed (Rengar, Master Yi) |
| On the Hunt (Body/Chaos, 1E 2P) | ready your units | 3 lists, all Sivir |
| Existential Dread (Chaos, 1E 1P, Action) | stun an attacking enemy; Repeat | 87 lists, 30 placed |
| Portable Portal (Body gear, 2E, Deploy) | ready a unit there for 1 Body; your units there have Ganking | 111 lists, 36 placed |

**Zed, Without a Sound** comes back into question: Ride the Wind lets him conquer the turn he lands,
which was what he lacked (Jay: "still open to him").

### The plan: race to 6, win in one turn (agreed 29 Oct 2026; Claude's call, Jay deferred)

Jay: "whatever suits us with Gold generation and a champion unit that can Gank with 6 Might."

**Raid, don't hold.** Go in, conquer, score; don't build around surviving on a battlefield. Why:
- **The field punishes holding**: a holder has to survive their turn, and Kai'Sa, Kennen and Kha'Zix
  are built to remove it ("kept getting wiped").
- **Raiding blunts their removal**: a unit that conquered has already scored.
- **Readying is a raiding tool**: readied units conquer the turn they land; On the Hunt conquers twice.
- **The scoring rules give the finish**: at 6, conquer both battlefields in one turn and you win,
  holding nothing (`docs/strategy.md`, the terminal table: the first conquest makes 7, the second 8).
  Readied board takes one; Sivir, 6 Might with Ganking, takes the other.
- **The Gold engine likes it**: fights kill enemy units, which ready the legend for more Gold.

**Holding stays a second way to win**, not the plan: take a free hold point, and the hold at 7
(Rengar's Ambush defending) still closes.

**Defy shapes the closing turn** (it counters a spell of 4 Energy or less and 1 Power or less):
On the Hunt and Punch First (2 Power) and every unit are Defy-proof; **Ride the Wind (1 Power) is
not**. Against the Calm decks, ready with units, Accelerate and On the Hunt. (Correction: v2's spec
exempted spells that "choose your own unit" from Defy; Defy's text has no such clause.)

### Goal tiers (agreed 29 Oct 2026)

What a card is for, in order; the higher tier wins a contested slot.

| tier | a card earns its slot by… | today's examples |
|---|---|---|
| **1. The closing turn** | readying a threat, or turning Power into a won fight, ideally Defy-proof | Sivir, On the Hunt, First Mate, Punch First, Rengar |
| **2. Clearing the way** | removing the blocker or the trick that stops a conquest | Rampage, Sabotage, Star-Crossed |
| **3. Early pressure that scores** | cheap bodies that act on arrival | Staunch, Innovator (Accelerate), Ezreal, Fizz, Edge |
| **4. Value** | Gold, cards, recursion | Matriarch, Merchant |

**Over all of them: it stands on its own.** Nothing in the main deck that is only good in one
matchup; that goes to the sideboard. Built for the S and A tiers without falling apart in the B tier.

**What it means:** answers rank above bodies; cheap, active bodies above sturdy ones; Vex's
battlefield lock is a holding card, so her role shrinks. **The risk:** raiding decks lose to big
early blockers, which is why clearing the way is tier 2.

### The closing turn against each S/A legend (drafted 29 Oct 2026, to agree)

From [sivir-matchups.md](sivir-matchups.md)'s card reads. "Stops it" is what they can do *during
your closing turn*; everything else they must do on their own turn, before it.

| legend | stops the closing turn | the plan | sure |
|---|---|---|---|
| **Master Yi** (S) | Defy, Discipline (+2 to a defender, Reaction); +2 to a lone defender; Ruin Runner can't be chosen | attack with two at one battlefield (no lone-defender bonus); Sivir Ganks to the other. On the Hunt and Punch First, not Rampage, into open Calm | medium |
| **Riven** (S) | Defy, Discipline; **Star-Crossed 89%, Rebuke 87%** bounce Sivir mid-attack; **her Vex (37%) stuns what you play**, so Sivir can't move that turn | **her Vex first.** Make the first attack draw the bounce; Sivir is the second threat. Baron can't be chosen: win from 6 by conquering both, or hold at 7 | medium |
| **Irelia** (S) | the densest tricks: Defy, Defiant Dance (−2), Flash (moves her units home), Twilight Shroud | close when she's tapped out (her tricks chase her own readying on her turn); Defy-proof readying only | low |
| **Kennen** (S) | **Switcheroo 100%** (swaps Sivir's 6 with a small unit), Star-Crossed, Flash. No Calm | Rampage clears blockers cleanly; attack with two so one Switcheroo can't stop both | medium |
| **Evelynn** (A) | her own Vex (×2.3), Switcheroo, Star-Crossed, Hidden flips at Reaction speed. No Calm | **raiding suits it**: taking her battlefield trashes her face-down cards (§323.6.a). Her Vex first | medium |
| **Rengar** (A) | Ambush blockers (Inferna, Apothecary, Nidalee) when you attack into open runes; Punch First. No bounce or Calm | the fastest deck: hold early with Rengar's Ambush; close when he's tapped out. Watch Brynhir (you can't play cards that turn) | low |
| **Jayce** (A) | pings (Bellows, Flurry); almost no blockers for three turns | **the pure race**: reach 6 before Elder Dragon or Gutter Palace | high |
| **Vex** (A) | Defy, Discipline, **Back Off ×2 (Hidden stun on your attacker)**, her Vex, Star-Crossed, Rebuke, Switcheroo | **the hardest**: every answer at once. Sabotage her hand first (Defy-able, so when she's tapped), her Vex first, redundancy on the closing turn | low |
| **Azir** (A) | Hidden Blade (kill a unit), Back Off (stun), Defy | **race early**: 2.2 units by turn 3; reach 6 before the equipment lands | medium |
| **Kai'Sa** (A) | **Smoke Screen (−4, Reaction)** takes Sivir from 6 to 2 mid-fight; **Brynhir: you can't play cards that turn**. No Calm | do the closing turn in one go, with the first attack drawing Smoke Screen; never plan the close on a turn Brynhir landed | medium |
| **LeBlanc** (A) | Vi, Peacekeeper (Ambush stun) | race: points before her death engine; bounce, don't kill | medium |

**The local field (Jay, 29 Oct 2026, Nexus Night at Sip & Play):** he often plays **Vex, Rengar,
LeBlanc and Diana**, and met Kai'Sa, Kha'Zix, Viktor, Orianna and Irelia this week. **Jayce is rare**
(people avoid the Aurora deck). So weight the plan to Vex, Rengar, Diana and Kai'Sa: two of the
"low" rows above, and a B-tier deck that plays like the hardest ones:

| legend | stops the closing turn | the plan | sure |
|---|---|---|---|
| **Diana** (B, local) | her legend's Energy works only in showdowns, so **she answers in your fights**: Eclipse and Smoke Screen (−4), Flash, Switcheroo, Star-Crossed and Rebuke (80% each), **her own Vex 80%**. Gust can't reach Sivir (4+). No Calm | her Vex first; two threats, never one; Repulse for the shrink or bounce on Sivir. Rampage resolves (no Defy) | low |

**What the table says about stage 3:**
1. **One threat is not a closing turn.** Riven, Kennen, Kai'Sa, Vex and Master Yi each have one answer
   that stops a single attacker; the closing turn needs **two threats**, so readying more than one
   unit (On the Hunt, First Mate) matters.
2. **Opposing Vex, Apathetic** (Riven 37%, Evelynn ×2.3, Vex 100%, Diana 80%) stuns Sivir as she's played. The deck needs an
   answer to her before the closing turn (she has Deflect).
3. **Protecting Sivir's attack:** Repulse ("counter an enemy spell or ability that chooses one friendly
   unit") stops Star-Crossed, Rebuke, Switcheroo and Smoke Screen on her. A main-deck candidate, not
   just sideboard.
4. **Three decks are races** (Jayce, Azir, LeBlanc): early pressure (tier 3) wins those alone.

**Still to agree:** this table; then the B-tier check.

## 3. Jobs and targets — agreed 29 Oct 2026 (Jay: "open to a basic full rewrite")

**The winners' shapes** (`data/archetypes.json`, placed lists, 60 days): Kennen 24 units / avg 2.8 /
23 cheap / 3 interaction; Riven 19 / 2.9 / 24 / 8; Rengar 30 / 2.8 / 17 / 5; Kha'Zix 23 / 2.6 / 20 / 7.
v1: 25 / 2.77 / **14** / **~11**: a grind shape. A raid wants more cheap pressure, less removal.

| # | job | target | notes |
|---|---|---|---|
| 1 | **Closers**: threats that act the turn they land | **4** | Sivir (always available), then three of Rengar ×2, a third Rengar, Zed, settled in stage 4 |
| 2 | **The closing-turn engine**: ready a second threat, or turn 2 Power into a won fight | **7** | Punch First, On the Hunt, Ride the Wind, **Fizz** (recasts any of the three from the trash for its Power alone: a second On the Hunt on the closing turn, and the 2 Power meets Sivir's condition) |
| 3 | **Clearing the way**: the blocker, their Vex, the trick | **8** | **own Vex counts here**: her stun hits any unit they play while she's at a battlefield, so Ambush and ready-on-arrival blockers deal no combat damage that turn |
| 4 | **Protection**: Sivir's attack through a bounce or shrink | **3** | Switcheroo, Repulse |
| 5 | **Cheap pressure**: 3 Energy or less, acts on arrival, scores | **18** | Staunch, Innovator, Ezreal, First Mate (also readies), Evelynn, Edge |

About 22 units, average cost ~2.6, ~20 cheap cards: inside the winners' range. Cards may fill two jobs
(First Mate, Fizz, Edge) as long as each job reaches its count.

**Out with the recursion half** (Jay: "not sold on it"): Tail-Cloaked Matriarch, Traveling Merchant,
Tornado Warrior. **Zed's swap** is an Action, so once a removal spell is on the chain only Reactions
answer (§rules timing table): it dodges combat, not spells.

## 4. Card by card — first draft, 29 Oct 2026 (to decide)

**Rules checked for the plan** (`docs/rules.md`, `docs/rules-full.md`):
- **Ride the Wind moves anywhere.** A card-effect move has only the limits its source names (§451.1),
  so it takes a unit battlefield to battlefield, and works in a showdown (Action). Standard moves can't
  (§144.1.c, §144.4).
- **On the Hunt has no Action or Reaction**: your main phase, open state only. After the first combat
  you are back in an open state, so: conquer A, On the Hunt, then move again. **Readied units at A can
  only go home** unless they have Ganking (Sivir with 2 Power spent) or are moved by an effect; units
  readied in base can move to B. Fizz recasting On the Hunt readies Fizz too (he's on the board when his
  trigger resolves).
- **Ambush** (Nidalee, Rengar): played as a Reaction to a battlefield where you have units (§822),
  so with Sivir at B, Ambush adds a second threat there mid-showdown. **Rengar can also be played to a
  battlefield with only enemy units.** The permission is rechecked at finalization (§822.3).
- **Accelerate is a replacement, not a ready** (§805.6.a): nothing that watches "becomes ready" fires.
- **Repulse** counters an enemy spell or ability that chooses one friendly unit and no other of yours:
  their Smoke Screen, Eclipse, Rebuke, Star-Crossed and Switcheroo on Sivir. It is 1E 1P: Defy-able.
- **Deflect** (their Vex) adds 1 Power per choice (§809); combat and effects that don't choose her ignore it.
- **Your Vex's stun** hits every unit they play while she's at a battlefield, Hidden flips and Ambush
  included: no combat damage that turn.

**The draft, measured as a whole** (`try` from v1, normal pressure; the model can't play the closing
turn, so it shows the costs more than the gain):

| | v1 | draft A (all recursion out) | **draft B (2 Merchant back)** |
|---|---|---|---|
| units by turn 5 (normal · heavy) | 4.9 · 2.0 | 3.6 · 1.1 | **4.0 · 1.4** |
| two units by turn 3 | 95% | 88% | **91%** |
| extra cards drawn | 3.3 | 2.1 | **2.5** |
| stuck on colour, turn 3 | 7% | 10% | **9%** |
| Sivir's condition on, turns 4–8 | 52% | 57% | **55%** |
| Gold a game | 4.17 | 4.59 | **4.42** |

Draft A cut Merchant and lost both bodies and loot: the recursion half was partly doing the "have a
unit to play" job. **Draft B** (v1 −3 Matriarch, −1 Merchant, −2 Tornado, −2 Star-Crossed; +2 On the
Hunt, +1 Ride the Wind, +2 Nidalee, +2 First Mate, +1 Repulse; Repulse ↔ Star-Crossed with the sideboard):

- **Closers (3):** Sivir · Rengar ×2
- **Engine (6 + Fizz):** Punch First ×3 · On the Hunt ×2 · Ride the Wind ×1 · (Fizz ×3)
- **Clearing (8):** Rampage ×3 · Sabotage ×2 · Vex ×2 · Rebuke ×1
- **Protection (3):** Switcheroo ×2 · Repulse ×1
- **Pressure (20):** Staunch ×2 · Innovator ×3 · Ezreal ×3 · Fizz ×3 · Nidalee ×2 · First Mate ×2 ·
  Traveling Merchant ×2 · Evelynn ×1 · Edge ×2

**Open in the draft:** runes (Body Power demand 12 → 19; 6/6 may fix the colour misses, `try` can't swap
runes); a third Rengar or Zed for job 1 (one short of 4); Kinkou Initiate vs Merchant (the model doesn't
see Kinkou's draw).

**Flagged, not in the draft** (Jay: "just flag them"):
- **Stare Down** (Body, 2E): choose a friendly unit and a battlefield; every enemy unit there with less
  Might goes to base. It chooses only your unit, so Deflect, Zhonya's and "can't be chosen" don't apply:
  a 6-Might Sivir (11 with Punch First) empties the second battlefield and conquers unopposed. Main phase;
  Defy-able. 5 lists. **The strongest closing-turn find, unproven.**
- **Cataclysm** (Body, 4E 1P): opponents can't play spells this turn; move a friendly unit to an occupied
  enemy battlefield. Locks Diana, Kai'Sa and Kennen out of the closing turn; Defy-able when cast, so weak
  into Calm. 18 lists, 2 placed.
- **Kinkou Initiate** (draw), **Challenge** (2E 1P Action fight, 81 lists), **Hold 'Em** (+3, 1E after
  playing to a battlefield, 122 lists), **Kraken Hunter** (3E 2P, 5 Might, Accelerate: a cheap
  act-on-arrival threat whose Power counts for Sivir; 4 lists), **Pit Rookie** (2E buff, 222 lists).

### The fresh list, from the jobs (29 Oct 2026; Jay: "you don't have to base it off my own list"; Star-Crossed back)

Jay is right on **Star-Crossed**: the most-played Chaos card (585 lists, 250 placed), and three jobs in
one (a Reaction save, a bounce, an answer on their turn). Draft B's cut was wrong.

Built job by job from the whole Body/Chaos pool. Where v1's cards survive (Punch First, Innovator,
Ezreal, Fizz, Rampage, Sabotage, Switcheroo, Star-Crossed, Vex, Edge), it's because they're the
best-evidenced cards in these colours for the job, not because v1 had them.

**Fresh draft F2** (40):
- **Closers (3):** Sivir · Rengar ×2
- **Engine (7):** Punch First ×3 · On the Hunt ×2 · Stare Down ×1 · Ride the Wind ×1 (+ Fizz)
- **Clearing (8):** Star-Crossed ×2 · Rampage ×2 · Sabotage ×2 · Vex ×2
- **Protection (3):** Switcheroo ×2 · Repulse ×1
- **Pressure (19):** Staunch ×2 · Traveling Merchant ×2 · Evelynn ×1 · Innovator ×3 · Ezreal ×3 · Fizz ×3 ·
  Nidalee ×2 · First Mate ×1 · Edge of Night ×2

Measured against v1 (normal pressure): average cost 2.77 → 2.55; cheap cards 14 → 17; two units by
turn 3 95% → 91%; units by turn 5 4.9 → 3.9; cards drawn 3.3 → 2.6; Sivir's condition 52% → 56%; Gold
4.17 → 4.53; kills 0.37 → 0.24 (Rampage 3 → 2); Defy-countered spells 3.0 → 3.9. F1 (3 Rengar, 2 First
Mate, no Merchant): units by turn 5 3.6, draw 2.2. **Every version without Matriarch loses about one
unit by turn 5 in the model**, which counts her revives; the model can't play the closing turn, so the
plan's gain isn't in these numbers. Games decide it.

### Locked for testing: "Sivir Ready (draft)" in the app (29 Oct 2026)

F2 with **Rebuke for Stare Down** (Jay: "suspicious of Stare Down, since they just play those units on
the next turn". Right as removal; its case was the closing turn only. Rebuke is proven, 2 Power so
Defy-proof, and works at Action speed on any turn). Stare Down stays flagged.

- **Units (22):** Sivir · Rengar ×2 · Vex ×2 · Staunch ×2 · Traveling Merchant ×2 · Evelynn · Innovator ×3 ·
  Ezreal ×3 · Fizz ×3 · Nidalee ×2 · First Mate ×1
- **Spells (16):** Punch First ×3 · On the Hunt ×2 · Ride the Wind ×1 · Star-Crossed ×2 · Rampage ×2 ·
  Sabotage ×2 · Rebuke ×1 · Switcheroo ×2 · Repulse ×1
- **Gear (2):** Edge of Night ×2
- **Runes 6 Body / 6 Chaos** (changed from v1's 5/7 the same night: printed Power is Body 19, Chaos 20;
  stuck on colour by turn 3, going first / second, 9% / 7% → 8% / 6%). **Battlefields:** Emperor's
  Dais · Hunters' Circle · Sigil of the Storm.
- **Sideboard:** Graves ×2 · Ravenbloom Prefect · Offer ×2 · Rampage · Rebuke · Siren's Song · Unyielding
  Spirit ×2.
- **To get:** Nidalee ×2 (owned 0). Everything else owned.

**How the closing turn goes** (at 6 points; any order that fits): attack battlefield A from base;
On the Hunt (main phase, after the fight) readies the board; Sivir, with 2 Power spent this turn,
Ganks to B; units readied in base follow; Nidalee or Rengar Ambush in beside her. Ride the Wind moves
any unit anywhere and readies it, mid-showdown too. Keep Repulse up for the bounce or shrink on Sivir;
your Vex at a battlefield stuns their blockers.

**Open for the next session:** more Ride the Wind (Jay: "maybe more Ride the Wind? idk"): it's the
only readying card that also moves battlefield to battlefield and works mid-showdown, but it's
Defy-able (1 Power); a third Rengar or Zed; Kinkou Initiate vs Merchant; Stare Down and
Cataclysm as flags. **Per game, note:** did the closing turn happen, what stopped it, and whether you
had a unit to play.

## Unlocked: the closing turn's Energy (30 Oct 2026, Jay: "fine with a complete rework")

**Energy is capped by runes on the board.** 2 channelled a turn (§315.3.b), 12 at most; going first,
10 by turn 5 and 12 by turn 6, fewer for every rune recycled and not yet channelled back. Battle
Mistress's Gold adds Power (`[A]`), never Energy. On the closing turn the same rune can pay Energy and
then be recycled for Power (§164.2), so Power is not the limit; Energy is.

| route (Sivir accelerated: 5E, her Chaos + the Accelerate Chaos) | Energy | notes |
|---|---|---|
| + Punch First | 6 | a won fight, not a second threat; Defy-proof |
| + On the Hunt | 6 | readies everything that already attacked; Defy-proof |
| + Ride the Wind | 7 | moves and readies one unit, mid-showdown too; Defy-able |
| + Nidalee (Ambush) | 8 | a second threat beside Sivir |
| + First Mate | 8 | readies one unit |
| + Rengar (Ambush) | **10** | the whole turn's runes, with nothing else cast |

Hunters' Circle (first unit there costs 1 less) and Ezreal (Accelerate 1 Energy less) take 1 off a
route. **Read:** the cheap routes are the closing turn; Rengar is a threat on a different turn (or
the hold at 7), not a closing-turn piece. Cheap closing cards in the locked list: Punch First 3, On the
Hunt 2, Ride the Wind 1, Nidalee 2, First Mate 1 = **9**. Seen by turn 7 (draw-only, 11 of 40): one
96%, **two 79%**. At 12: 99% / 92%. At 14: 100% / 96%. The plan asks for two threats.

**Sivir's own cost counts** toward "spent at least `[A][A]` this turn" (Jay, 30 Oct 2026; the FAQ also
counts a paid cost as spent, Jhin, `rules-faq.md`). So an accelerated Sivir switches herself on: her
Chaos plus the Accelerate's Chaos. Nothing else that turn has to supply Power for her.

**She needs a battlefield to start from** (Jay). A unit is played only to your base or a battlefield
you control (§806.3); a standard move exhausts it (§144), and battlefield → battlefield needs Ganking
(§810). So from 6:

| you start the closing turn | the line | needs |
|---|---|---|
| **holding A** | the hold scores A (7); Sivir accelerated onto A, Ganks to B and conquers: 8, the gate open because A scored | **Sivir alone, 5 Energy** (4 with Hunters' Circle or Ezreal) |
| holding nothing, a board that can take A | the board conquers A (7); **then** Sivir accelerated onto A, now yours, Ganks to B, conquers: 8 (Jay) | Sivir + one won fight; 5 Energy, 4 if A is your Hunters' Circle (played to base instead she gets no discount) |
| holding nothing, one attacker | Sivir conquers A from base; On the Hunt readies her; she Ganks to B | Sivir + On the Hunt, 6 Energy |

**The closing turn is one conquest by the board, plus Sivir.** A hold makes it free (the battlefield
is already yours); otherwise the board wins the first fight that turn and Sivir launches from it
(Jay's line). So the cheap closing pieces have two jobs: **win that first fight** (Punch First,
Rampage) or **keep Sivir's attack alive** (protection). On the Hunt is the fallback when Sivir is
the only attacker.

## Stage 2 revised: midrange, the road to 6 (agreed 30 Oct 2026)

Jay: "midrange aggro, sliding in and out, and holding one if it fits… still technically midrange."
This replaces "raid, don't hold" (an aggro plan) with `docs/strategy.md` §2's role flip.

**Why holding comes back.** At most 2 points a turn (each battlefield scores once a turn, §472), and
lethal is 6 plus scoring both, or a hold at 7 (the terminal table). Trading a battlefield back and
forth scores 1 each and nobody pulls ahead. You pull ahead only by a **hold** (it survives their turn),
a **double turn** (both battlefields in one turn), or a **denial** (they fail to retake). Pure raiding
gave up the cheapest of the three.

**The legend prefers it** (moderate, card text, not measured): Battle Mistress readies when enemy units
die, and each ready is a Gold (Power) on the next recycle. Trades kill units; raids that dodge fights
don't. The Power pays Sivir's condition, Punch First and On the Hunt.

**The road to 6:**
1. **Early:** cheap units take the first point, usually their open battlefield.
2. **Middle:** win trades and **hold one when it fits**: a holder their removal can't take cheaply,
   backed by Rengar's Ambush or your Vex's stun on whatever they play to retake. A denial counts too.
3. **At 6:** the closing turn (costed above): Sivir plus a cheap piece, both battlefields scored.

**Two layers of cards:** a middle layer of sturdier 4–5 Energy cards that win trades and hold (Rengar,
Vex); a cheap layer, 3 Energy or less, for the early turns and the closing turn.

**Role by matchup:**

| matchup | role |
|---|---|
| Jayce, Azir, LeBlanc | push: race before their late game |
| Kai'Sa, Vex, Diana, Kennen | hold cheaply, close in one go; no big target for their answers |
| Rengar | defend first, then hold; take it back when he's tapped out |
| Riven, Master Yi, Irelia | close on the turn they tap out of Defy and tricks |

**The legend, honestly:** experts B (two graders, "thin"); 36 lists since Radiance, 10 Aurora; no 1v1
Radiance results. Unproven, not shown weak. The field's Battle Mistress lists are aggro, so this is
off-meta within an off-meta legend, and no one else's results stand in for ours.

## Stage 4 revisited: fight-winners and protection (30 Oct 2026)

Every legal Body/Chaos unit, spell and gear read (305 cards; evidence: one-on-one lists since 23 Oct
2026, Aurora lists left out, placings by `lib/placing.mjs`), plus an independent read by a second agent
given the plan but not Claude's picks. Its finds were checked against the verbatim rules here.

**Rules that shape the jobs:**
- **Face-down cards are pinned to their battlefield** (§811.1.d.2–3): a hidden Switcheroo, Edge or
  Teemo at A can't touch Sivir's fight at B. Her protection has to come from hand.
- **Repulse can't stop their Vex's stun**: the trigger names the played unit, it doesn't choose it.
  Nothing in the pool does, so **their Vex must be gone before the closing turn** (Rebuke, Star-Crossed
  or Rampage, each 1 Power more for her Deflect).
- **Defy reads printed cost** (§206).
- **Signatures are the champion's only, 3 in all** (§103.3.d): **Last Caress** (Evelynn's) and
  **Bullet Time** (Miss Fortune's) are out, though both read well. On the Hunt is Sivir's.

**Fight-winners, ranked** (win the closing turn's first fight, or the one at B):

| card | cost | evidence (lists / placed) | read |
|---|---|---|---|
| Punch First | 1E 2P, Action | 422 / 34 | +5; Defy-proof. In |
| **Gust** | 1E, Reaction | **410 / 78** | returns a ≤3-Might unit at a battlefield: their small blocker or an Ambush arrival mid-fight; saves your own on their turn. Defy-able; can't reach Vex. **New** |
| Rampage | 3E (+Body for +2) | 340 / 31 | a fight before combat; their Deflect applies. In |
| Switcheroo | 2E 2P, Action | 473 / 92 | from hand, Defy-proof; doubles as protection against a shrink on Sivir. In |
| Hold 'Em | 3E, or 1E once you've played a unit to a battlefield this turn | 119 / 6 | after Sivir lands on A, a 1-Energy +3 for her fight at B. Sideboard candidate |
| Challenge, Stare Down | 2E 1P · 2E | 76 / 2 · 5 / 0 | thin; Stare Down stays flagged |

**Protection, ranked** (Sivir's attack through the answer):

| card | cost | evidence | read |
|---|---|---|---|
| Repulse | 1E 1P, Reaction | 77 / 5 | counters Star-Crossed, Rebuke, Switcheroo, Smoke Screen, Eclipse, Back Off on her. In |
| **Abandon** | 2E, Reaction | 72 / 10 | counters **any** spell, Defy and their Discipline included; returns it to their hand, so it buys the turn, not the card. Defy-able. **New** |
| Switcheroo | 2E 2P | 473 / 92 | swaps back a shrink. In |
| Cataclysm | 4E 1P | 17 / 0 | no enemy spells all turn, and its move is the first attack: Sivir + Cataclysm is 9 Energy. Thin and heavy; Defy-able as cast. Flag |
| Hard Bargain | 2E, Reaction | 166 / 22 | a tax, weak when they've held runes up for exactly that turn |
| Petricite Monument | 2E gear | 4 / 0 | Deflect on your units: a tax, not a stop |

**Draft R2** (measured with `try` from the locked list, normal pressure):
**−First Mate, −Ride the Wind, −1 Sabotage; +2 Gust, +1 Abandon.**

- **Units (21):** Sivir · Rengar ×2 · Vex ×2 · Staunch ×2 · Traveling Merchant ×2 · Evelynn ·
  Innovator ×3 · Ezreal ×3 · Fizz ×3 · Nidalee ×2
- **Spells (17):** Punch First ×3 · On the Hunt ×2 · Gust ×2 · Star-Crossed ×2 · Rampage ×2 ·
  Switcheroo ×2 · Sabotage ×1 · Rebuke ×1 · Repulse ×1 · Abandon ×1
- **Gear (2):** Edge of Night ×2. Runes, battlefields and sideboard unchanged.

| measure | locked | R2 |
|---|---|---|
| units by turn 5 (normal · heavy) | 3.8 · 1.2 | 3.7 · 1.1 |
| two units by turn 3 | 92% | 92% |
| an answer usable on their turn, t5 (play) | 24% | 29% |
| attacks answered (normal) | 8% | 11% |
| Defy-countered spells, expected (popularity) | 3.5 | 3.9 |

Tried first: −First Mate −Merchant −Sabotage (units by turn 5 3.8 → 3.4). Rejected: the board has to
win the first fight, so cut a spell, not a body.

**Jobs, counted:** fight-winners Punch First 3 · Gust 2 · Rampage 2 · Switcheroo 2 (+ Edge 2);
protection Repulse 1 · Abandon 1 · Switcheroo 2 = 4; closing pieces at 3 Energy or less 13 (Punch
First, Gust, On the Hunt, Switcheroo, Nidalee, Rampage); clearing 10 counting own Vex.

**Decision records:**
- **+2 Gust.** Fixes: a cheap Reaction fight-winner, and removes Nidalee-sized Ambush blockers. Evidence:
  the best-placed cheap Chaos card in the pool. Sure: moderate. Reverse if: their blockers on the
  closing turn are mostly 4+ Might in logged games.
- **+1 Abandon.** Fixes: protection beyond spells that choose Sivir (Defy, Discipline). Evidence: 72 / 10.
  Sure: low to moderate. Reverse if: it's Defied or the spell is simply recast in logged games.
- **−First Mate, −Ride the Wind.** The closing turn no longer needs readying: the board's conquest
  or a hold gives Sivir her battlefield. On the Hunt stays as the one fallback. Sure: moderate. Reverse
  if: logged closing turns fail for want of a second attacker.
- **−1 Sabotage.** The cheapest cut that keeps bodies. Sure: low (Jay rated it). Reverse if: Jay prefers
  Sabotage to the second Gust. **Reversed the same day (R3, below).**

**Draft R3, current** (Jay: "both can get Defy'd, and Sabotage can also get rid of game breaking cards
like Time Warp, Zhonya's… although there's some luck involved"): **Sabotage stays at 2; Gust 1.**
**−First Mate, −Ride the Wind; +1 Gust, +1 Abandon.** Sabotage has a closing-turn job Gust lacks:
cast first on that turn (1 Energy), it shows their whole hand and recycles the answer that would stop
Sivir. If they Defy it, their Defy is spent before she lands. Either way the terminal scan gets an
answer, not a guess. Gust only handles a ≤3-Might blocker, once the fight is on. Measured (normal):
units by turn 5 3.8 → 3.6; an answer on their turn t5 24% → 28%; attacks answered 8% → 10%; Defy
exposure 3.5 → 3.9. Not in the app: Jay wants this build deliberate before it's locked.

## The engine, card by card (30 Oct 2026)

Jay: "make sure you know about the different interactions available within each card… I want to make
sure everything fits the engine." Card text from `data/cards.json`; the v1 guide
(`guides/sivir-trying-her-best.md` §3, §5) for how the engine was played.

### What the engine runs on (model, normal pressure, 6,000 games, 8 turns)

| | locked Ready | R3 | v1 |
|---|---|---|---|
| Power from recycled runes, a game | 9.15 | 8.87 | 8.08 |
| Power from Gold | 4.89 | 4.85 | 4.47 |
| Gold left unspent at the end | 0.82 | 0.83 | 0.83 |
| Energy spent, turns 1–8 | 33.2 | 32.1 | 38.1 |

**Read:** Gold never idles, in any version. **Most Power is paid by recycling runes**, and every
recycle is a rune off next turn's board, which is why Ready spends ~5 less Energy than v1 over
eight turns. So v1's rule ("a card with no Power leaves Gold idle") doesn't carry over: there's no
idle Gold to waste. In Ready the currency is **runes**, and a card's real price is its Energy plus
the runes recycled for its Power. **Cards that make Power without recycling** (Gold from Innovator and
kills, Seal of Discord) are worth more here than they were in v1. Model only: it plays a fixed
policy and can't play the closing turn.

### The links

1. **Recycle → Gold.** Each recycle while Battle Mistress is ready makes a Gold (exhausted: next turn's
   Power). **An enemy death readies her**, so: recycle, kill, recycle. Sigil's conquer recycle probably
   counts (open judge question, v1 guide §12).
2. **Fizz recasts** a spell of 3 Energy or less from the trash, Energy free, Power paid, then recycles it
   (§3.6). In R3: Punch First, On the Hunt, Sabotage, Rebuke, Switcheroo, Rampage, Star-Crossed, **Gust
   (free: no Power)**. Not Abandon or Repulse in practice: his trigger resolves on your main phase,
   where they rarely have a target. Fizz on the closing turn: 3 Energy for a body **and** a Punch First
   (+5), or a second On the Hunt, or a Sabotage.
3. **Filling the trash for Fizz:** Ezreal (discard 1, draw 2), Merchant (discard 1, draw 1 when he
   moves). Discard a spell when Fizz is coming.
4. **Ezreal's discount** ("optional additional costs… 1 Energy or 1 Power less"): Sivir's and Innovator's
   Accelerate, Rampage's Body. **On Sivir take the Energy, not the Power**: the Power discount drops her
   to 1 Power spent and switches her off.
5. **Own-unit bounce, replayed for value:** Star-Crossed, Gust and Emperor's Dais return Ezreal or Fizz
   to hand; the replay draws again or recasts again. Fizz → Star-Crossed → Fizz is the repo's strongest
   found loop (`rift loops`).
6. **Moving triggers:** Innovator (when exhausted: Gold, or a Chaos to draw), Merchant (loot).
   **On the Hunt readies them, so a second move triggers them again.**
7. **Hidden** (Switcheroo, Edge, Evelynn): hide for 1 Power at a battlefield you hold, play later free,
   Power included, but **pinned to that battlefield** (§811.1.d.2–3). It needs a hold.
8. **Hunters' Circle:** the first unit you play there on your turn costs 1 less: Sivir accelerated is 4.

### Every card in R3

| card | cost | gives the engine | links | road to 6 |
|---|---|---|---|---|
| **Sivir, Mercenary** | 4E 1P +Accelerate 1E 1 Chaos | 2 Power spent by herself: 6 Might, Ganking | Ezreal (Energy), Hunters' Circle, any battlefield you control | the close |
| Staunch Survivor ×2 | 2E 1P | turn-1 body that makes the first Gold | Edge → 6 in fights | early; holder |
| Traveling Merchant ×2 | 2E | loot on each move: trash for Fizz | On the Hunt → loots twice | early |
| Evelynn, Entrancing ×1 | 2E, Hidden | from face down on your turn: pulls an enemy unit from another location to hers | hide at A; pull B's lone holder; **B opens for Sivir** | middle / close |
| Reckless Innovator ×3 | 3E, Accelerate | **Gold or a draw each time he exhausts** (moves, attacks) | On the Hunt → second trigger | early; engine |
| Ezreal, Prodigy ×3 | 3E 1P | discard 1, draw 2; trash for Fizz | discount (link 4); own-bounce replays | early; engine |
| Fizz, Trickster ×3 | 3E 1P | a spell again from the trash | link 2; own-bounce replays | engine; close |
| Nidalee, Cat Form ×2 | 3E 1P, Ambush | a Reaction-speed 4-Might body; draws on a won fight | beside Sivir at B mid-showdown; or defends a hold | middle; close |
| Vex, Apathetic ×2 | 4E, Deflect | stuns every unit they play while she's at a battlefield; their Ambush and Hidden blockers deal no damage | kills in her fights ready the legend | middle (holds) |
| Rengar, Trophy Hunter ×2 | 5E 1P, Ambush | 6 Might at Reaction speed; can drop into a battlefield with only enemy units | Hunters' Circle −1 | middle (defends the hold) |
| Punch First ×3 | 1E 2P, Action | +5; Defy-proof | Fizz; Sivir's Power | close (first fight) |
| On the Hunt ×2 | 1E 2P (signature) | ready your units | Fizz (readies Fizz too); Innovator, Merchant re-trigger | close (fallback) |
| Gust ×1 | 1E, Reaction | bounce ≤3 Might at a battlefield | **Fizz recasts it free**; bounce your own Ezreal or Fizz to replay | close; protection of small units |
| Star-Crossed ×2 | 3E 1P, Reaction | one of theirs and one of yours to hand | own-bounce replays; Fizz loop; removes their Vex (+1 for Deflect) | clearing |
| Rampage ×2 | 3E (+Body: +2) | a fight before combat; **a kill readies the legend** | Ezreal pays the Body; Fizz | clearing |
| Switcheroo ×2 | 2E 2P, Hidden, Action | swap two Mights; free from face down | Fizz; pinned when hidden | fight-winner; protection from hand |
| Sabotage ×2 | 1E 1P | see their hand, recycle a non-unit | **Fizz recasts it on the closing turn** | close (first cast) |
| Rebuke ×1 | 2E 2P, Action | bounce any unit at a battlefield; Defy-proof | Fizz; their Vex (3 Power with Deflect) | clearing |
| Repulse ×1 | 1E 1P, Reaction | counter a spell or ability choosing only that unit | none | protection |
| Abandon ×1 | 2E, Reaction | counter any spell (back to hand); Predict | **none** | protection |
| Edge of Night ×2 | 3E, Hidden gear | +2 from face down, free; recalled if the unit dies; re-equip for a Chaos | Staunch → 6; Gold pays the equip | holder; fight-winner at a held battlefield |

**Battlefields:** Emperor's Dais (conquer: 1 Energy, return a unit there to hand for a 2-Might Sand
Soldier: replay Ezreal or Fizz) · Hunters' Circle (Sivir for 4) · Sigil of the Storm (conquer: recycle a
rune: a Gold if the legend is ready).

### What the map says

- **Abandon is the one card with no links**: no Fizz, no trash, no Power, no kill. It earns its slot on
  protection alone. Repulse is the same but costs a Power (a rune) for a narrower counter.
- **Gust fits better than it looked**: Fizz recasts it free, and bouncing your own Ezreal or Fizz is
  value, not just a save. Under v1's rule it failed; under Ready's real economy (runes) it's the cheapest
  fight-winner in total cost.
- **On the Hunt is more than the fallback**: with Innovator or Merchant out, it's a second Gold or loot.
- **Onslaught** (4E, +6, Flow 4: play it again from the trash for 4 Energy, then banished): 8 Energy for
  two +6s, and Fizz can't recast it (4 Energy is over his 3). In a deck whose limit is Energy, Punch
  First's 1 Energy for +5 does the same job.
- **Seal of Discord** (0E 1P gear; exhaust: add a Chaos, as a Reaction): ~1 Power a turn **without
  recycling a rune**, so the board keeps its runes and the deck keeps its Energy. It answers the one
  weakness the model shows (33 Energy against v1's 38). 117 lists, 28 placed. **The model doesn't see it**
  (it doesn't model gear that adds Power), so it can't be measured here; a gear, so Offer and Detonate
  reach it. **Out** (Jay, 30 Oct: "we generate power so I don't think it's worth taking up a slot").

## Midrange: what the research says, applied (30 Oct 2026)

Jay: "get even more general deckbuilding tips, esp around midrange if that's a thing." It is. Sources:
the repo's own (`docs/deckbuilding.md`, measured from placed lists; Jun's midrange Kha'Zix notes,
`docs/jun.md`; `docs/fundamentals.md` §9) and outside: Feldman, [What's in a Midrange?](https://articles.starcitygames.com/articles/deep-analysis-whats-in-a-midrange/)
(SCG, 2007); Thompson, [Anatomy of a Midrange Deck](https://articles.starcitygames.com/articles/anatomy-of-a-midrange-deck/)
(SCG, 2015); Flores, [Eight Core Principles of "Who's the Beatdown?"](https://articles.starcitygames.com/articles/eight-core-principles-of-whos-the-beatdown/)
(SCG, 2012); WotC, [How to Build Midrange](https://magic.wizards.com/en/articles/archive/how-build/how-build-midrange-2017-02-07)
(2017); [Riftbound France, deckbuilding](https://riftboundfrance.fr/en/guides/deckbuilding). Magic writing,
so principles only; none of it gives ratios, and the Riftbound guides' counts are for first decks
(the repo's measurements are for winning ones). **Other Battle Mistress lists can't teach us much**:
3 without Aurora since Radiance, none placed (`data/decks.json`).

**The principles, and what each says about this list:**

1. **Every threat should change a stalled mid-game board** (Thompson's test: drawn into a stall, does
   it swing the game?). Passes: Sivir (always available), Rengar, Vex, Fizz (body plus a spell back).
   Nidalee half-passes. The 2–3 Energy bodies don't, and aren't meant to: they're the early points.
2. **Cards should do more than one job; narrow cards are the failure mode** (Thompson, Feldman: dead
   cards in popular matchups; duplicates of a narrow answer get worse). Multi-job here: Fizz, Ezreal,
   Nidalee, Rengar, Vex, Star-Crossed, Gust, Switcheroo, Sabotage, Punch First. **Single-job: Repulse
   and Abandon** (protection only; blank against decks that win with units and few spells). This
   matches stage 2's own rule: nothing in the main deck that's only good in some matchups.
3. **Self-replacing interaction is Riftbound's engine** (`fundamentals.md` §9: Discipline, Stupefy, Hidden
   Blade each answer *and* draw; "a deck with no self-replacing interaction runs out first"). Body/Chaos
   has almost none printed, so this deck replaces cards through **Fizz recasts, own-unit bounces of
   Ezreal and Fizz, Nidalee's draw, Innovator's draw and Merchant's loot**. Those are what keep a
   midrange deck from running out, which is why they stay.
4. **"When two decks have the same end game, the faster one is favoured"** (Flores). Jun says the same in
   Riftbound terms: **reach 6 first, but still hold the cards for the last turn**. Sivir in the Champion
   Zone means the finisher can never be drawn out; the cheap closing piece is what to keep back.
5. **Against control and combo, attack; against aggro, block** (Feldman), decided per matchup and per
   game (Flores). That is stage 2's role table.
6. **Early Power is expensive** (Jun: a Power spent on turn 2 costs about five Energy over a seven-turn
   game). The model agrees (runes are the currency). Develop units first; Power tricks from the midgame.
7. **Test by matchup: how many of each card do you want to draw, and which are dead where?**
   (Thompson.) Not done yet for this list.

**Shape against winners** (`deckbuilding.md` §5: placed lists average 18.7 units, cost 2.87, 21.9 cards at
2 Energy or less): R3 is 20 units, cost about 2.5, 18 cheap. Slightly lower and more unit-heavy;
inside the range.

## The matchup audit (30 Oct 2026)

Nine agents, one per matchup: the local five (Vex, Rengar, LeBlanc, Diana, Kai'Sa) and the S tier (Riven,
Kennen, Irelia, Master Yi). Each rated every R3 card live, situational or dead from `rift versus`,
card text and the rules. A tenth agent consolidated them, and Claude checked the load-bearing rules
claims against the verbatim rules and FAQ. **No games are logged in any of these matchups**: every rating
is card text and list shares.

**The grid** (L / S / D; local five first):

| card | Vex | Ren | LeB | Dia | Kai | Riv | Ken | Ire | Yi | verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| Sivir | S | L | L | L | L | L | L | L | L | core |
| Rengar ×2 | S | L | L | L | L | L | L | L | L | core |
| Vex ×2 | L | L | L | L | L | L | L | L | L | core |
| Staunch ×2 | L | L | L | S | L | L | L | L | L | core |
| Merchant ×2 | S | S | S | S | S | S | S | S | S | question |
| Evelynn | S | S | S | S | S | S | S | S | S | question |
| Innovator ×3 | L | L | L | L | L | L | L | L | L | core |
| Ezreal ×3 | L | L | L | L | L | L | L | L | L | core |
| Fizz ×3 | L | L | L | L | L | L | L | L | L | core |
| Nidalee ×2 | S | L | L | S | L | L | L | L | L | keep |
| Punch First ×3 | L | L | L | L | L | L | L | L | L | core |
| On the Hunt ×2 | S | S | S | S | S | S | S | L | S | question |
| Gust | L | L | L | L | L | L | L | S | S | keep |
| Star-Crossed ×2 | L | L | L | L | L | S | L | S | S | core |
| Rampage ×2 | L | L | S | L | L | D | L | S | S | keep |
| Switcheroo ×2 | L | S | D | L | L | L | L | S | L | keep |
| Sabotage ×2 | L | S | L | L | L | S | L | S | L | keep |
| Rebuke | L | L | L | L | S | L | L | L | L | core, add a 2nd |
| Repulse | S | S | L | L | L | L | L | S | S | question |
| Abandon | L | S | S | L | L | L | L | S | L | keep, add a 2nd |
| Edge of Night ×2 | S | L | S | S | S | L | S | L | L | question |

**What it found** (rules checked by Claude):
- **What stops the close, across the field:** a single-target spell on Sivir at B (8 of 9 matchups) and
  **a defender added mid-fight** (8 of 9): their face-down **Tideturner** at B can swap in a unit from
  anywhere (FAQ errata: "a unit you control at another location"; `data/cards.json` still has the
  pre-errata text), Ambush, Rengar's Thrill of the Hunt, and **their Ride the Wind** (Kennen 84%, Diana,
  Irelia), which only Abandon counters.
- **Their face-down cards at B do act on Sivir.** B is theirs. The pinning rule only stops *ours* at A
  from helping.
- **Gust or Star-Crossed in response to a face-down unit's play effect** makes it miss (its unit left
  the board; §811.1.d.3.a): that answers Tideturner and Bedeviling Stranger.
- **Against their Vex:** her stun fires only while she's at a battlefield. **The walk-in close**: Sivir
  played to base on an earlier turn takes the stun when it doesn't matter. On the close, the board takes
  A and she walks base → B (no Ganking needed), and any 2-Power spell switches her on. No unit is
  played, so their Vex never triggers. Wrong against Kai'Sa (Falling Star 98% kills a 4-Might Sivir at base).
- **Unyielding Spirit doesn't stop Rampage or Challenge** (FAQ: damage a card tells a unit to deal is
  the unit's). It does stop LeBlanc's Rex deathknell and Kai'Sa's damage spells.
- **No answer in the 50 cards:** Baron (switch to holding at 7), Ruin Runner (only Punch First on
  Sivir out-sizes it), Rockfall Path (play Sivir onto the other battlefield).

**The close, by matchup:** hold at 7 against Rengar (his Ambush and Thrill refill B), and against
Riven once Baron lands. Against Vex, Diana and Irelia, remove their Vex first or walk Sivir in from base.
Against LeBlanc, bounce Rex before the close. Elsewhere, the board conquers A and Sivir Ganks.

**Repulse vs Abandon:** Abandon covers more of the close in 7 of 9 (pumps, Ride the Wind, Thrill, Defy).
Repulse is better only against LeBlanc (the Rex trigger is an ability) and splits Riven (Stranger).
**Abandon 2 main, Repulse 1 in the sideboard.**

**Option A** (the consolidator's recommendation): R3 **−1 Edge of Night, +1 Rebuke · −1 Repulse, +1
Abandon**. **Option B** (the rework): A, plus **−Evelynn, −1 Merchant, −1 On the Hunt; +2 Tideturner,
+1 Gust**. B's extra cuts rest on "situational" (narrow, not bad), and Tideturner on how it hurt us,
not on any read of it in our hands.

| measure (normal pressure) | locked | A | B |
|---|---|---|---|
| two units by turn 3 | 92% | 91% | 93% |
| Might by turn 5 | 14.3 | 13.7 | 13.9 |
| an answer usable on their turn, t5 | 24% | 37% | 40% |
| attacks answered | 8% | 13% | 15% |
| Defy-countered spells, expected | 3.5 | 3.9 | 4.3 |

**Sideboard (10):** Graves ×2 · Unyielding Spirit ×2 · An Offer You Can't Refuse ×2 · Repulse ·
Rampage · Edge of Night · Ravenbloom Prefect (Siren's Song out: no audit brought it in). Per-matchup swaps:
the consolidated file (below).

**Staples** (`fundamentals.md` §9): Punch First, Sabotage, Rampage, Rengar, Star-Crossed, Switcheroo,
Gust, Vex, Fizz and Merchant are in. **Flagged as underrated for this deck:** Tideturner (396 lists / 83
placed; a holding trick that swaps Rengar in from base) and Ride the Wind (four of the local five run no
Defy). Irresistible Faefolk is flagged too (thin): "Evelynn without the hold". First Mate, Pit Rookie,
Kinkou, Master Yi Tempered, Mobilize, Flash and Boots are out, each with what would change it.

**Corrections to this worksheet's matchup tables** (they supersede the rows above):
- **LeBlanc:** the stopper is Sacrifice (93%) or Deathgrip (86%) on Ruined Rex (93%) with Karthus
  (94%), 8 damage to Sivir, plus Hidden Blade (85%) at B. Not Vi: her stun is on her attack only.
- **Kennen:** Switcheroo 87%, not 100%. Add Ride the Wind 84%, Rhasa 84% (6 against 6) and
  Tideturner 50%. Flash isn't a stopper: it gives up the battlefield.
- **Diana:** Star-Crossed 91%, Rebuke 57%, Switcheroo 66% (not "80% each"). Add Hard Bargain 77%,
  Moonfall 95% and Tideturner 91%. Gust *can* reach Sivir once she's shrunk.
- **Riven:** Star-Crossed 75%, Rebuke 64%, Baron 51% (not 80%). Add Tideturner 79% and Bedeviling
  Stranger 81%.
- **Irelia:** Flash isn't a stopper. Add their Vex 60%, Discipline 98%, En Garde 68%, Not So Fast 78%.
- **Master Yi:** Bladesman-only lists (78). No legal Aurora lists since 16 Oct. Ruin Runner 68%; the
  lone-defender +2 takes Gust out of range.
- **Kai'Sa:** no Defy at all. Rockfall Path is in 84% of their registered battlefields (own count).
  Falling Star 98%; Time Warp 88%.

Full working: the nine reports and `CONSOLIDATED.md` (grid reasoning, stoppers ranked, contradictions
resolved, per-matchup sideboard swaps), in the session scratchpad. They aren't in the repo.

## R4 → R5: by feel, then stress-tested (30 Oct 2026)

**R4** (Claude's pick by feel; Jay: "go by feel here"): three straight swaps on R3, each a card for a
better card doing the same job: Repulse → Abandon (protection), one On the Hunt → a second Rebuke (it
switches Sivir on, Fizz recasts it, it clears), Evelynn → Tideturner (a hidden 2-drop that *defends* the
hold instead of attacking from it). Edge ×2 kept on Jay's real-game evidence.

**The stress test** (Jay: "really tension test it… my biggest concern now is not enough 2 drops for turn 1"):
- **Turn 1 on the play is the real gap.** Going second, the extra rune makes the 3-drops castable:
  about 99% to have a play. Going first, R4's five 2-drop units give a turn-1 play about 64% of the
  time even after a two-card mulligan (approximate odds); seven give about 77%. Jay went first in three
  of four games on 29 Oct, and bricked turn 1 against Irelia.
- **The second Abandon** has no engine links, and holding 2 Energy up for it competes with
  development in a deck whose limit is Energy. The audits counted what it covers, not what it costs.
- **On the Hunt** was S in 8 of 9 matchups, the weakest card left in the grid.

**R5:** R4 **−1 Abandon, −1 On the Hunt; +1 Tideturner, +1 Evelynn**. Seven 2-drop units.

| measure (normal pressure) | locked | R4 | **R5** |
|---|---|---|---|
| two units by turn 3 (on the play) | 92% | 93% | **97%** |
| units by turn 5 | 3.8 | 3.7 | **4.2** |
| Might by turn 5 | 14.3 | 13.9 | **15.3** |
| an answer usable on their turn, t5 | 24% | 38% | **39%** |
| attacks answered | 8% | 13% | 12% |
| Defy-countered spells, expected | 3.5 | 3.9 | **3.5** |

**R5, 40:** Sivir · Rengar ×2 · Vex ×2 · Staunch ×2 · Traveling Merchant ×2 · Tideturner ×2 · Evelynn ·
Innovator ×3 · Ezreal ×3 · Fizz ×3 · Nidalee ×2 (23 units) · Punch First ×3 · Star-Crossed ×2 ·
Rampage ×2 · Switcheroo ×2 · Sabotage ×2 · Rebuke ×2 · Abandon · Gust (15 spells) · Edge of Night ×2.
**Sideboard:** Graves ×2 · Unyielding Spirit ×2 · Offer ×2 · Rampage · Repulse · On the Hunt · Ravenbloom
Prefect.

**What R5 gives up, honestly:**
- **No On the Hunt main.** If removal wipes the board, Sivir alone takes one battlefield a turn, not
  two (the Kai'Sa loss on 29 Oct was a wiped board). It's in the sideboard for that matchup.
- **Protection is 3** (Abandon, Switcheroo ×2) plus Sabotage cast first, against stage 3's target of 4.
- **Tideturner in our hands is untested.** Its case is how it hurt us (5 of 9 audits) and its pool
  evidence (396 lists, 83 placed).

**The Tideturner route, checked and corrected** (Jay: "check with that play bonus"). It doesn't work as
first written. Tideturner swaps with "a unit you control at another location", and locations are only
bases and battlefields (§198.1). The Champion Zone is a separate zone (§108.3), so Sivir can't be
swapped out of it. The route only exists once Sivir is already in base, and then the plain walk-in
(the board takes A, she walks base → B) does the same without Tideturner. **Tideturner's real job is
defensive:** hidden at a held battlefield, it swaps Rengar (or a Sivir already in base) into their
attack at Reaction speed. (Whether "they can't move it this turn" from their Vex stops Tideturner's own
swap stays a judge question; it no longer matters to the close.)

### Stress test 2 (30 Oct 2026)

R5 against the locked list, normal pressure unless marked:

| check | locked | R5 | read |
|---|---|---|---|
| printed Power, Body / Chaos | 19 / 20 | 14 / 17 | **Chaos-leaning again**, the same 55% as v1, which ran 5/7 runes. 6/6 was set when demand was even |
| stuck on colour, turn 3 (play · draw) | 8% · 6% | 7% · 4% | fine at 6/6 so far; **5/7 is worth measuring** (`scripts/sim` runs a rune sweep, but only on a saved deck) |
| Power paid from runes, a game | 9.2 | 8.2 | fewer recycles, so a bigger board and more Energy |
| Gold made | 4.6 | 4.3 | fewer recycles, fewer Gold; Gold still never idles |
| Fizz finds a spell | 74% | 72% | 15 spells is enough |
| an answer usable on their turn, t5 (draw) | 44% | **59%** | |
| "Mercenary on" (2 Power spent, turns 4–8) | 57% | 49% | **a stale measure**: it counts Power spent apart from her, but her own cost switches her on |
| Hidden cards | 7 (4 spells/gear) | 7 | Tideturner ×2, Evelynn, Switcheroo ×2, Edge ×2 compete for at most two slots, and only behind a hold |

**Risks it leaves:**
- **Tideturner and Evelynn are 2-Might Gust bait** where Gust is common (Diana 98%, Kennen 82%,
  Riven 54%). From hand, they're just bodies.
- **Protection is 3.**
- **Tideturner in our hands is untested.**

**Owned:** Tideturner 3, Abandon 4, Gust 7, Rebuke 4. Still to get: Nidalee ×2.

### Stress test 3 and the lock (30 Oct 2026)

**The whole pool, against the gaps the audits left** (Jay: "look at any gaps we have again across the
whole suite of cards"):
- **Void Assault** (Body/Chaos, move yours then theirs; Jun's "best card in the game") is **Kha'Zix's
  signature**: illegal here, like Last Caress and Bullet Time.
- **Can't-be-chosen units:** only **Stare Down** clears Ruin Runner (it chooses your unit and a
  battlefield, not theirs). Thin (5 lists) and Jay was wary of it. A sideboard note against Master Yi,
  who isn't local. Nothing answers Baron: hold at 7.
- **Defenders added mid-fight:** Cannon Barrage (11 lists, none placed) is thinner than Abandon, Gust and
  Star-Crossed.
- **Card flow:** The Good Stuff (202 / 25) and Kinkou Initiate (192 / 18) if hands run dry.
- **No gap a card fixes better than R5 already does.**

**Draw odds for the close** (39-card library, draw only):

| piece | by turn 5 | by turn 7 |
|---|---|---|
| two cheap closing pieces (14 cards) | 92% | 97% |
| a fight-winner for the first fight | 90% | 95% |
| an answer to their Vex (Rebuke, Star-Crossed, Rampage) | 82% | 88% |
| **protection at B (Abandon, Switcheroo ×2)** | **56%** | **64%** |
| Sabotage to cast first | 41% | 49% |

Protection is the weak link, as it was this morning. With Sabotage counted it's about 80% by turn 7, and
Fizz recasts Sabotage and Switcheroo. More would mean taking back the second Abandon, which went for the
2-drops. **Accepted, and handled in play:** close when they're tapped out, Sabotage first, and keep
Sivir's window short (a held battlefield, or the walk-in).

**Runes:** `scripts/sim` on the saved list: **6/6 confirmed**, no split meaningfully better (Energy turns
1–4: 5/7 and 6/6 both 17.5). On the play: no play on turns 1–2 in 0% of games, two units by turn 3 97%.
Mulligan: keep all; bottom Punch First, Sabotage and Switcheroo first.

**Locked: R5**, written to the app as "Sivir Ready (draft)" (row backed up first; the write checked the
deck was the old locked list before changing it).

**Watch items** (stage 6: a change only when a logged game trips one):
1. **Did the closing turn happen?** If not, what stopped it: a spell on Sivir, a defender added at B,
   their Vex, or no first conquest?
2. **Tideturner:** did it defend a hold (swapping Rengar in), or sit as a 2-drop? Was it Gusted?
3. **Turn 1 on the play:** a play, or a brick?
4. **Protection:** was Sivir's attack answered while Abandon or Switcheroo was in hand, or not drawn?
5. **Hands:** run dry against removal decks? (Then The Good Stuff or Kinkou.)
6. **The walk-in against their Vex:** tried? Did Sivir survive the turn in base?
7. **Per game:** opponent, went first or second, battlefield picked.
8. **Ran out of gas late?** A loss with no units left to play around turns 7–9, against a removal deck
   that went long. That's what the 27 Oct list's Matriarch ×3 covered (a free unit from the trash);
   she's the first card back.
9. **No answer to a lone big unit?** A loss where one 6+ Might unit sat on a battlefield with no
   Switcheroo, Rampage or bounce in hand. Only Rengar is above 4 Might, so fights against size are won
   with tricks. If it happens more than once, the fix is another answer, not a bigger body.

## Audit with the sister deck's lessons (30 Oct 2026)

Jay: "we added some additional ideas to audit, can you do the same with the other one". Two agents:
a desk audit (battlefields, card draw, Defy-driven decisions) and eight hand-played games on the **same
seeds and opponents** as the sister deck's (`decklab/sivir-two-fights.md`, stress test 2). Hand-played
samples, every decision by one agent: not statistics.

**The games:** about 6 wins, 2 lean losses (the sister deck: 5, 2, 1 open). No game was won by two
conquests in one turn; holds closed most. Sivir's close happened in 4 games and made 7 in two of them;
the walk-in against their Vex worked (G1). R5 defends a held battlefield better (units played onto a
battlefield already held ignore their Vex's stun); the sister deck closed faster against light
opponents. **Both ran dry in the same two games** (on the draw against Rengar and LeBlanc's Dragons):
watch items 5 and 8. Dead in hand: Edge of Night (5 drawn, 1 used), Switcheroo (3 drawn, 0 cast),
Abandon (3 drawn, 0 cast, and absent in the one game that needed it). Turn 1 on the play: 2 of 4.

**Battlefields:** R5 is short of Energy, not Power (a rune pays Energy and is then recycled, §164.2), so
Power-only battlefields don't pay the close. **Sigil of the Storm is a rune tax on whoever conquers it**:
its forced recycle adds no Power (§417.4), and the Gold needs Battle Mistress ready, which she usually
isn't (model: 8.2 recycles, 4.3 Gold a game). The guide's "your conquest recycles into a Gold" overstates
it. **Proposed: Startipped Peak for Sigil** ("When you hold here, you may channel 1 rune exhausted": Energy
for a holding deck; R5 always has runes left to channel, §315.3.b.1). Circle (game 1: Sivir onto it costs
1 less) and Dais (going first) stay. Veiled Temple can ready a Gold made this turn (§415.4), but that's
Power, not Energy. None of the sister deck's three used.

**Card draw:** 8 copies that add a card (Innovator paid, Nidalee, Fizz, Dais), plus filtering (Ezreal,
Merchant). Enough to reach 6, thin for a long game against removal. The Good Stuff measured as a cost to
answers (39% → 34–35% on their turn by t5): the first card in if watch item 5 or 8 trips, not now.

**Defy-driven decisions:** Ride the Wind's cut (R2) carried a "Defy-able" label, but its main reason
holds without it: Sivir enters ready and Ganks herself, so R5's close doesn't need readying. Under Jay's
rule the label comes off; the slot doesn't change. Rebuke over Stare Down and the Cataclysm flag stand on
other grounds.

**Proposed: −1 Edge of Night +1 Abandon** (games: protection is the weak link, and the one stopped close
had no Abandon). `try`: answer on their turn t5 39 → 42% (play), attacks answered 12 → 14% (normal),
Defy-countered spells 3.5 → 3.9 (a weight, not a veto). Still 16 copies from the sister deck.

**Both locked** (Jay: "let's lock both in!"): written to the app (row backed up), guide §1 and its
battlefield section updated. Picks: Hunters' Circle game 1, Emperor's Dais going first, Startipped Peak
going second.

## Log

- **29 Oct 2026:** opened. Direction agreed: Sivir as the finisher, Power spent on readying.
  Correction on record: Sivir's condition is 2 *Power*, not Energy.
- **29 Oct 2026:** plan agreed: raid, race to 6, win in one turn (Claude's call; Jay deferred). Goal
  tiers agreed: closing turn, clearing the way, early pressure, value. Defy checked: Ride the Wind is
  Defy-able, On the Hunt and Punch First are not.
- **29 Oct 2026:** stage 2's matchup table drafted, the local field added (Vex, Rengar, LeBlanc, Diana;
  Jayce rare). Stage 3 agreed: closers 4, engine 7, clearing 8, protection 3, cheap pressure 18. The
  recursion half out; Fizz moves to the engine (recasts On the Hunt and Punch First); own Vex is a
  clearing card in a raid.
- **29 Oct 2026:** stage 4 first draft. Rules checked (Ride the Wind, On the Hunt timing, Ambush, Repulse,
  Deflect, Vex). Draft A (all recursion out) lost bodies and draw; draft B (2 Merchant back) measured.
  Flagged for Jay: Stare Down, Cataclysm, Kinkou Initiate, Challenge, Hold 'Em, Kraken Hunter, Pit Rookie.
- **29 Oct 2026:** fresh draft F2 built from the jobs (Jay: not from his list); Star-Crossed restored
  (Jay); F1/F2 measured.
- **29 Oct 2026:** Rebuke for Stare Down (Jay). Locked into the app as "Sivir Ready (draft)" (row backed
  up). Open: more Ride the Wind, runes 6/6, third Rengar or Zed.
- **29 Oct 2026:** runes 5/7 → 6/6 (Jay: "fix the rune split if it makes sense"): Power demand is even
  (Body 19, Chaos 20); colour misses by turn 3 9%/7% → 8%/6%. App updated (row backed up).
- **30 Oct 2026:** unlocked for a deeper look (Jay). First pass, plan first: the odds of having *seen*
  each closing-turn piece by turn 7 (draw-only, 11 cards from 40; an upper bound, since cards get
  spent earlier): a readier or Ambush threat 94%; On the Hunt 48%; any of Switcheroo/Repulse 63%,
  Repulse 28%; clearing 96%.
- **30 Oct 2026:** closing-turn Energy costed: Sivir accelerated is 5, so + Punch First or On the Hunt 6,
  + Nidalee 8, + Rengar 10 (Jay: "possible but def tricky"; Rengar is mid to mid-late). Open rules
  question: does Sivir's own Chaos count toward her 2 Power?
- **30 Oct 2026:** stage 2 revised and agreed: midrange with a role flip (Jay: "midrange aggro, sliding
  in and out, and holding one if it fits"), replacing "raid, don't hold". The road to 6 in three
  phases; two layers of cards; roles by matchup. Stage 3's jobs to be redone from it.
- **30 Oct 2026:** Jay: Sivir's own cost counts toward her 2 Power, and she needs a battlefield to
  play to for the Gank. Checked (§806.3, §144, §810): holding a battlefield at 6 makes Sivir alone a
  5-Energy closing turn. Protection 3 → 4 (Claude's call; Jay deferred).
- **30 Oct 2026:** Jay's line: conquer A with the board first, then play Sivir onto A and Gank to B.
  The closing turn is one won fight plus Sivir; the hold only makes that fight free.
- **30 Oct 2026:** stage 4 revisited for fight-winners and protection: all 305 legal Body/Chaos cards
  read, plus an independent agent read (its Last Caress and Bullet Time lines are illegal signatures;
  its rules finds checked: face-down pinning, Vex's stun, printed-cost Defy). Draft R2: −First Mate,
  −Ride the Wind, −1 Sabotage; +2 Gust, +1 Abandon. Not yet in the app.
- **30 Oct 2026:** R3 replaces R2 (Jay on Sabotage): Sabotage stays 2, Gust 1. Sabotage's closing-turn
  job: cast first, see the hand, strip the answer or draw out the Defy. The app stays on the locked
  list until the build is deliberate (Jay).
- **30 Oct 2026:** the engine mapped card by card (Jay: every interaction, everything fits the engine).
  Model: Gold never idles; Power is mostly recycled runes (~9 a game), so Ready spends ~5 less Energy
  than v1 over eight turns. v1's "paid in Power" rule doesn't carry; runes are the currency. Abandon has
  no engine links; Gust has several; Seal of Discord flagged (Power without recycling; not modelled).
- **30 Oct 2026:** Seal of Discord out (Jay: the deck generates Power). Midrange research recorded
  (repo docs, Jun, four Magic articles, one Riftbound guide). It flags Repulse and Abandon as the list's
  only single-job cards. Next: the dead-card audit by matchup.
- **30 Oct 2026:** the matchup audit: nine agents, one per matchup, plus a consolidator (Jay: "open to
  a complete rework"; staples given an extra look). Rules claims checked against the FAQ (Tideturner
  errata, Unyielding Spirit). Option A (R3 −Edge +Rebuke, −Repulse +Abandon) and Option B (A −Evelynn
  −Merchant −On the Hunt +2 Tideturner +Gust) measured; corrections to the matchup rows recorded.
  Decisions open for Jay.
- **30 Oct 2026:** R4 by feel (Jay agreed with all of it), then stress-tested on Jay's turn-1 concern:
  R5 = R4 −1 Abandon −1 On the Hunt +1 Tideturner +1 Evelynn. Seven 2-drops; better than R4 on every
  measure. Not yet in the app.
- **30 Oct 2026:** the Tideturner close corrected: Sivir in the Champion Zone isn't at a location
  (§198.1, §108.3), so it can't swap her out; its job is defensive. Stress test 2: Power demand leans
  Chaos (14/17), so 5/7 runes is worth a sweep once R5 is saved; "Mercenary on" is a stale measure.
- **30 Oct 2026:** stress test 3: the whole pool against the gaps (Void Assault is Kha'Zix's signature;
  Stare Down a sideboard note against Yi; no better fix than R5). Protection at B is the weak link,
  accepted. **R5 locked** (Jay: "then we can lock it in"): written to the app with the row backed up.
  Runes 6/6 confirmed by `scripts/sim`. Watch items set.
- **30 Oct 2026:** Jay: R5 "feels a little bit like we're going back to what we were playing before"
  — true (33 of 40 copies shared with the 27 Oct list; `deckbuilding.md` §3 puts two winning lists ~8
  apart). The cards were v1's; the plan was new. Jay: lock it in as the new v1. Goldfish side by side
  (`scripts/sim`, 20,000 games, on the play): R5 two units by turn 3 97% (v1 95%), Might by turn 5 20.0
  (v1 21.3), Energy turns 1–4 17.5 (v1 18.3); the engine model and the nine audits favour R5. **"Sivir is
  trying her best" now holds R5** (row backed up; guide's header and list updated). Runes 6/6 (the sweep
  ties 5/7 and picks 6/6). Next: a pure readying build, as a separate deck, to test against it.
- **30 Oct 2026:** two watch items added (Jay): running out of gas late (the recursion R5 gave up), and
  no answer to a lone big unit (the top end is 4 Might except Rengar; Punch First is 3 of ~11 fight
  tricks, and the real limit on the close is Power, not size).
- **30 Oct 2026:** the app cleared to one Sivir deck (Jay): "Sivir v2 (draft)", "Sivir + Stranger (test)",
  "Sivir + Zed (test)" and "Sivir Ready (draft)" removed (row backed up; no journal games referred to
  them). Identity for the readying build agreed: "one army, two fights", in its own worksheet.
