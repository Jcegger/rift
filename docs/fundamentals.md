# Fundamentals of Riftbound

How the game actually works, and what you will actually face across the table. This is
the teaching layer; [rules.md](rules.md) is the reference layer. Where this page explains
*why*, that one gives you the rule number to show a judge — and when the two disagree,
**rules.md is right and this file has a bug**.

Card shares come from `data/decks.json`. Read the caveat in **Where these numbers come
from** before you quote any of them.

---

## 1. The one sentence everything hangs off

**You win at 8 points, and points come from battlefields.**

Not from damage, not from decking your opponent, not from killing their units. Killing
things is a means. The scoreboard is the game.

Two ways to score, and they are the whole engine (§469):

- **Conquer** — you gain control of a battlefield you have not yet scored this turn. **1 point.**
- **Hold** — you still control it at the **start of your turn**. **1 point.**

**Once per battlefield per turn, either way** (§470). So a battlefield you take and keep
pays 1 the turn you take it, and 1 every turn after.

In a 1v1 there are **two battlefields on the table** (§485.4) — you each register three
and bring one. That caps the rate at 2 points a turn.

| board | their rate | they win in |
|---|---|---|
| they hold both | 2/turn | **4 turns** |
| one each | 1/turn each | 8 turns |

### The clock runs whether you act or not

Hold scoring happens in the **Beginning Phase**, before Channel, before Draw, before you
get to do anything (§315.2.b.2). A player with an empty hand and both battlefields still
wins in four turns.

**There is no durdling in this game.** "Playing slow" is not a strategy you can choose —
if you are not contesting, you are losing on a clock you can see. This is the single
biggest difference from games where you win by reducing a life total, and the place
where imported instincts go wrong.

### The eighth point is gated

When you try to gain a point from **Conquer** and your total is already **within 1 of the
Victory Score** — 7 or more in 1v1 — you only get it **if you have Scored every
battlefield on the table this turn.** Otherwise you draw a card instead
(§471.1.b, §471.1.b.1).

**Read "Scored", not "conquered".** Hold is one of the two ways to Score, so a battlefield
you Held in your Beginning Phase already counts. The practical line in a 1v1:

> **Hold one battlefield to reach 7, then Conquer the other.** The Hold already counts as
> that battlefield's Score, so the gate opens.

And from *exactly* 7, a Hold simply wins — Hold is not gated at all (§471.1.a.1).

### Running out of cards is not a loss

It is a **Burn Out** (§431): shuffle your trash back into your Main Deck, **an opponent of
your choice gains 1 point**, and finish the draw. If your trash is empty too you burn out
repeatedly, handing out a point each time.

So "grind them out of cards" is not a win condition. You still need 8 points.

---

## 2. Your deck

Five things, and they are not the same kind of thing (§103):

| | count | notes |
|---|---|---|
| **Champion Legend** | 1 | never leaves the Legend Zone. Sets your **Domain Identity**. |
| **Chosen Champion** | 1 | starts face-up in the Champion Zone and is playable from there. Counts toward the 40. |
| **Main Deck** | 40 | exactly 40 in competition. |
| **Rune Deck** | 12 | shuffled, kept separate. |
| **Battlefields** | 3 | registered; only one is used per game in 1v1. |

**Domain Identity.** Six domains — Fury, Calm, Mind, Body, Chaos, Order. Your Legend's
domains *are* your identity, and a card is legal only if your identity contains **all** of
that card's domains (§103.1.b.4). A two-domain card needs both.

This is why a card can be a total blank in a matchup: a Mind-hating card does nothing
against a Fury/Calm legend, because they cannot be playing Mind cards at all.

**Copy limits.** 3 of any name (§103.2.b), and **names include the subtitle** — `Kai'Sa,
Survivor` and `Kai'Sa, Evolutionary` are different cards and you may run 3 of each. Your
Chosen Champion counts against its own 3. **Unique** cards are limited to 1.

**Sideboard** is tournament-only: **10 or fewer**, every card a legal Main Deck card for
your identity, and the 3-copy limit spans main deck and sideboard **together**. You may
never change runes, Legend or battlefields after registration (TR §403.4.b).

**A typical archived deck** averages 19 units and 18 spells in its 40, plus its 12 runes
and 3 battlefields. The unit/spell split is close to even across the field — a deck much
past 24 of either is making a deliberate statement.

---

## 3. The turn

Six phases, but only one of them is open (§315–317):

1. **Awaken** — ready everything.
2. **Beginning** — **Scoring Step: Hold every battlefield you control, 1 point each.** This is where your points arrive, before you act.
3. **Channel** — channel 2 runes, ready.
4. **Draw** — draw 1. An empty deck here is a Burn Out, then you still draw.
5. **Main** — every player's rune pool empties, then it is open. No structure: any number of actions in any order. **Combats and showdowns happen inside this phase**, as a consequence of what you do.
6. **Ending** — heal all units, expire "this turn" effects, empty every rune pool.

**The ordering trap:** Hold scoring is in the Beginning Phase, **before** Channel and
Draw. A battlefield you are about to lose is still worth taking to the start of your turn.

**Going second** channels an extra rune on its first Channel Phase (§485.7). That is the
whole on-the-play compensation.

---

## 4. Resources: Energy and Power

Conflating these is the most common beginner error.

- **Energy** — the numeral in the cost. Colourless.
- **Power** — the symbols under it. Usually has a domain. `[A]` (rainbow) pays any domain.

**Runes make both** (§164.2):

- `[E]` — **exhaust** the rune for 1 Energy.
- **Recycle** it — send it to the bottom of the Rune Deck for 1 Power of its domain.

**Those are different costs, and that is the trick.** Recycling does not require the rune
to be ready, so **the same rune can be exhausted for Energy and then recycled for Power in
the same turn.**

The formula that decides every turn:

```
max(E, P) runes on the board, at least E of them READY
```

A card costing 1 Energy and 2 Body Power needs **two** Body runes, not three. A card
costing 10 Energy and 3 Power needs ten runes, three of the right domain — not thirteen.

**What recycling costs is next turn**: the rune leaves your board and you only channel 2 a
turn to refill.

**Rune pools empty at the start of every player's Main Phase and at the end of every
player's turn** (§167) — everyone's, not just the turn player's. There is no floating
resource between turns.

---

## 5. Combat

**Combat is never declared.** It happens on its own, in a cleanup, at a **Contested**
battlefield where both players have units. You start a fight by *moving somewhere*.

**Contested** is applied when a unit arrives at a battlefield its controller does not
control, and the battlefield is not already Contested (§190.3.a.1).

> **The player whose unit applied Contested is the Attacker** (§464.2.c.1).

That sentence decides more games than it looks like it should. If you drag an enemy unit
onto *your* battlefield, **they** are the attacker — which matters because many cards read
"while attacking" or "while defending".

### How damage works

**Sum each side's Might.** There is no blocking and no pairing off — two totals, each
assigned across the other side's units. **The attacker assigns first**, so the defender
allocates knowing the attacker's choices; only the *dealing* is simultaneous.

The assignment rules that actually bite:

- **Lethal means a non-zero amount at or above the unit's Might.** A unit at 0 Might does **not** die on its own — it needs at least 1 damage marked.
- **Full lethal to one unit before any to the next.** 5 damage into four 3-Might units is 3 and 2, never 2/1/1/1.
- **No overkill**: you may not assign more than minimum lethal while others are unassigned — and marked damage counts, so a 3-Might unit with 1 damage takes exactly 2.
- **Tank first, Backline last.**
- **Stunned units deal nothing** but still need full Might to die.

**This makes cheap bodies a real resource.** A 1-Might token absorbs exactly one point of
their total and no more.

### Who won

> A player **wins** a combat if they held a designation and are the **only** player with
> units remaining at that battlefield (§466.3.a).

Everything else is **No Result** — a mutual wipe, both sides surviving, or attackers being
recalled (§466.3.d). **Defending pays exactly what attacking pays.**

Two consequences worth internalising:

- **A tie destroys both boards**, because each side's total is at or above the other's.
- **Failed attacks are punished; failed defences are not.** Attackers are recalled if defenders survive (§466.1.a.2). Defenders stay. Attacking into an uncertain fight costs more than being attacked.

Survivors **heal in the Combat Cleanup** (§466.1.a.1), not at end of turn — damage does
not carry to a second fight that turn.

---

## 6. The chain, and why your spell did not resolve

The game is always in one of four states (§310), and the state is the whole permission
system:

| | **Open** (no chain) | **Closed** (chain exists) |
|---|---|---|
| **Neutral** | turn player plays anything | **Reaction only** |
| **Showdown** | **Action or Reaction only** | **Reaction only** |

- **`[Action]`** buys you into showdowns, on anyone's turn.
- **`[Reaction]`** buys you that *plus* closed states — responding to things on the chain.

### HOT FEPR

The loop the game runs on (§334): Handle Outstanding Tasks, then **F**inalize,
**E**xecute, **P**ass, **R**esolve.

1. **Finalize** — the oldest pending item completes. **Finalizing does not pass priority** (§337.1.a).
2. **Execute** — the player with priority plays something, or passes.
3. **Pass** — when everyone passes in sequence with nothing added, resolve.
4. **Resolve** — **the newest finalized item resolves** (§340.1). Last in, first out.

**Two things beginners get wrong here:**

**Passing does not resolve the whole chain.** Only the newest item resolves, then the loop
runs again and priority comes back around. Your spell is at the *bottom* of the chain, so
it resolves **last** — after everything stacked on top of it.

**Some things never wait to be answered at all.** A **Unit, a Gear, or an ability that
Adds resources resolves the instant it finalizes** (§337.2). You cannot respond to an
opponent flipping a gear; it is already done.

---

## 7. The keywords that actually matter

Measured by how many archived decks run at least one card carrying them:

| keyword | reach | what it does |
|---|---|---|
| **Accelerate** | 74% | optional extra `[1][C]` as you play: the unit **enters ready** |
| **Hidden** | 70% | pay `[A]` to hide it facedown at a battlefield you control; from next turn it gains Reaction and costs **nothing** |
| **Deflect X** | 69% | **opponents** pay X more Power to target it — can price a removal spell out of reach entirely |
| **Deathknell** | 58% | "when I die" |
| **Ganking** | 48% | adds battlefield → battlefield to your standard move |
| **Assault X** | 47% | +X Might **while attacking** |
| **Shield X** | 37% | +X Might **while defending** |
| **Tank / Backline** | — | must be assigned lethal **first** / **last** |

**Hidden deserves its own paragraph** because it is 70% of decks and it changes how you
read a board. A facedown card is a free card at Reaction speed from the turn after it is
hidden. You can see that it exists but not what it is. **Treat any opponent with a
facedown card as having one more open answer than their runes suggest** — playing from
Hidden ignores the base cost entirely, so "they're tapped out" can be false.

The catch that costs games: a hidden **permanent** must be played to the battlefield it
was hidden at, and its play effect reads that battlefield **off the source**. Remove the
source in response to its own trigger — bounce **or kill** — and the read returns null and
the instruction is ignored. See **When the source leaves the board** in
[rules.md](rules.md) and the recorded ruling in [rules-rulings.md](rules-rulings.md).

---

## 8. The staples

What you will actually see across the table, by function. Percentages are the share of
archived decks running at least one copy.

### Interaction you must play around

| | share | |
|---|---|---|
| **Stupefy** | **35%** | 1E Mind · `[Reaction]` −1 Might this turn, **draw 1** |
| **Defy** | **28%** | 1E/1 Calm · `[Reaction]` counter a spell costing **≤4 Energy and ≤1 Power** |
| **Falling Star** | 27% | 2E/2 Fury · **Deal 3 to a unit. Deal 3 to a unit.** (two instances — can stack on one) |
| **Retreat** | 25% | 1E Mind · `[Reaction]` return a **friendly** unit to hand, channel 1 |
| **Void Seeker** | 23% | 3E/1 Fury · `[Action]` deal 4 at a battlefield, draw 1 |
| **Hidden Blade** | 22% | 2E/1 Order · `[Hidden][Action]` **kill a unit** at a battlefield; its controller draws 2 |
| **Charm** | 21% | 1E/1 Calm · move an enemy unit |
| **Gust** | 20% | 1E Chaos · `[Reaction]` return a unit with **≤3 Might** to hand |

**Defy is the one to memorise.** It counters a spell at **≤4 Energy *and* ≤1 Power** —
*and* means anything costing 2 Power walks straight through it, however cheap. If you are
building, that is a reason to prefer two-pip cards; if you are playing, it tells you which
of your spells are safe to commit into open Calm.

**Retreat is a trap to misread.** It returns a **friendly** unit — it is value and
tempo-saving for its controller, not removal. Several cards that look like answers are
self-bounce; check whose unit before you fear them.

### Card advantage

| | share | |
|---|---|---|
| **Stupefy** | 35% | interaction that replaces itself |
| **Kai'Sa, Survivor** | 31% | 4E 4M Fury · Accelerate · **when I conquer, draw 1** |
| **Discipline** | 27% | 2E Calm · `[Reaction]` +2 Might this turn, **draw 1** |
| **Watchful Sentry** | 24% | 2E 1M Mind · **Deathknell — draw 1** |
| **Lecturing Yordle** | 20% | 3E 2M Mind · Tank · draw 1 on play |

Notice how much of it is **stapled to something else you wanted to do anyway**. Riftbound
mostly does not sell you a card that only draws cards; it sells you a trick that replaces
itself. A deck with no self-replacing interaction will run out first.

### Threats and payoffs

| | share | |
|---|---|---|
| **Thousand-Tailed Watcher** | 34% | 7E/1 Mind, 7 Might · on play, **enemy units get −3 Might this turn** |
| **Darius, Trifarian** | 30% | 5E/1 Fury, 5M · on your **second card each turn**, +2 Might and ready me |
| **Ravenbloom Student** | 29% | 2E 2M Mind · +1 Might whenever you play a spell |
| **Noxus Hopeful** | 27% | 4E 4M Fury · **Legion** — costs 2 less if you have played another card this turn |
| **Pouty Poro** | 26% | 2E 2M Fury · **Deflect** |

**The pattern worth seeing:** several of the most-played units reward playing *more cards
per turn* — Darius, Ravenbloom Student, Noxus Hopeful's Legion. Riftbound rewards
sequencing multiple cheap cards in one turn far more than most games do.

### Protection

**Zhonya's Hourglass** (18%, 2E Calm, `[Hidden]`) — *if a friendly unit would die, kill
this instead; heal that unit, exhaust it, and recall it.* It saves the body, but the unit
leaves the battlefield — so **you still win the combat and take the battlefield**. Against
a points-based win condition that is a trade you are usually happy to make.

**Deflect** (69% of decks) is the quieter one. It is a mandatory additional cost on
*opponents*, so it does not announce itself — it just makes your removal cost more, or
nothing at all if you cannot pay.

---

## 9. Battlefields

You register three and play one in 1v1, and they are a real deckbuilding decision rather
than a formality. The field's choices:

| | share | |
|---|---|---|
| **The Dreaming Tree** | 27% | first time each turn a player targets a friendly unit here with a spell, **they draw 1** |
| **Grove of the God-Willow** | 23% | **when you hold here, draw 1** |
| **Zaun Warrens** | 18% | when you conquer here, discard 1 then draw 1 |
| **Vilemaw's Lair** | 17% | **units can't move from here to base** |
| **The Arena's Greatest** | 16% | each player gains **1 point** at the start of their first Beginning Phase |
| **Obelisk of Power** | 14% | each player channels 1 extra rune on their first Beginning Phase |
| **Targon's Peak** | 14% | when you conquer here, ready up to 2 runes at end of turn |

**Almost all of them are symmetric.** Grove rewards whoever holds it — including them.
The Arena's Greatest gives *both* players a point. Read a battlefield as "what does this
do for the person who ends up holding it", not "what does it do for me", because the
person holding it is frequently not you.

**Vilemaw's Lair is the one that changes a game plan**: units cannot retreat home from it,
so committing there is permanent. Against a deck built on repositioning, it is a cage.

---

## 10. Things that are not what they look like

The short list of rulings most likely to catch you (each verified in [rules.md](rules.md)):

- **Recalls are not moves** — they do not trigger "when I move", and movement-prevention does not stop them.
- **Banish is not a kill** — Deathknell does not fire.
- **Hiding is not playing** — it opens no chain and cannot be responded to. *Playing from* hidden does.
- **Assigning damage is not dealing damage** — assignment happens for everyone first, then it is all dealt at once.
- **A countered card was never played** for triggers, but it *was* finalized, and costs are not refunded.
- **Tokens are not cards** — a token in any non-board zone except the chain ceases to exist, so bouncing a token kills it.
- **A unit is Mighty at 5 current Might**, not 5 printed.
- **Attaching is not a move**, and does not change ready/exhausted state.

---

## 11. Reading a deck you have never seen

You will face decks no guide covers. Classify on two questions, both answerable in the
first two turns:

**1. Can they contest both battlefields?** Count cheap units and token-makers. A deck with
ten 1–2 Energy bodies covers everything; a deck with three does not.

**2. Do they beat you in a long game?** Count card draw and recursion. If they draw more
than you, time is theirs.

| | | your plan |
|---|---|---|
| can't contest two | — | **take both and race**; 2/turn ends it in four |
| contests everywhere, out-grinds you | hardest | **win one fight early and convert it** |
| contests everywhere, you out-grind them | — | **hold one, refuse trades**, let them run out |

The tells, roughly: **two or more units on battlefields by turn 2 and everything costs
1–2** is aggro. **Few units, cheap non-unit cards, drawing and searching** is combo.
**Removal on your first threat and few bodies** is control. **Almost no early board and
expensive units** is ramp.

And the two rules that hold in every matchup: **never hold zero battlefields, and never
take a fight you have not already rigged.**

---

## Where these numbers come from

**Rule text** is [rules-full.md](rules-full.md) — Riot's Core Rules verbatim, with
[rules-faq.md](rules-faq.md) outranking it where they differ, and
[rules-rulings.md](rules-rulings.md) for what neither states. Every `§N` here is a Core
Rules entry.

**Card text** is `data/cards.json` with `data/errata.json` applied — Riot's feed serves
**printed** text, and errata are published separately and never flow back into it, so the
raw catalog confidently shows superseded wording.

**Card shares** are `data/decks.json`, and they need a health warning. After an upstream
feed change in late September 2026 the archive rebuilds a day at a time: at the time of
writing it holds **1,204 decks spanning 3 distinct dates**, not the 60 days its window
claims. The ordering of the big staples is robust — Stupefy and Defy are not going to turn
out to be fringe — but **anything separated by a few points is noise**, and the
archetype-level figures in the deck dossiers are deliberately pinned to an older, wider
snapshot.

**What this page does not do** is tell you what the three Radiance keywords do. `[Deploy]`,
`[Disarm]` and `[Show Off]` are printed on 20 cards between them and the Core Rules define
none of them. Do not infer them from the cards that carry them — see **Printed, but not
yet in the rules** in [rules.md](rules.md).
