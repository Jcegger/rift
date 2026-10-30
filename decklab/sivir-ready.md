---
title: Sivir, Ready and Gank — deckbuilding worksheet
subtitle: Battle Mistress (Body/Chaos), Radiance. Jay's own Sivir, rebuilt around Sivir as the finisher. Built with Jay a stage at a time.
started: 2026-10-29
status: stage 1 agreed (direction); stage 2 drafted — the deck in play stays v1 until this one is built and tested
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

**Still to agree in this stage:** the closing-turn plan for each S/A legend, sorted by what stops
the closing turn (Defy and Calm; stuns and Reaction removal on attackers; pure removal and race),
with a check that the B tier holds up.

## Log

- **29 Oct 2026:** opened. Direction agreed: Sivir as the finisher, Power spent on readying.
  Correction on record: Sivir's condition is 2 *Power*, not Energy.
- **29 Oct 2026:** plan agreed: raid, race to 6, win in one turn (Claude's call; Jay deferred). Goal
  tiers agreed: closing turn, clearing the way, early pressure, value. Defy checked: Ride the Wind is
  Defy-able, On the Hunt and Punch First are not.
