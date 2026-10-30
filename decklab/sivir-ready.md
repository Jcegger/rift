---
title: Sivir, Ready and Gank — deckbuilding worksheet
subtitle: Battle Mistress (Body/Chaos), Radiance. Jay's own Sivir, rebuilt around Sivir as the finisher. Built with Jay a stage at a time.
started: 2026-10-29
status: stages 1–3 agreed 29 Oct 2026; stage 4 (card by card) next — the deck in play stays v1 until this one is built and tested
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
