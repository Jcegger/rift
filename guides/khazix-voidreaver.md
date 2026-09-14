---
title: Kha'Zix Voidreaver — Deck Dossier
subtitle: Riftbound, Vendetta season
author: rift toolchain
date: 2026-09-14
---

**Legend:** Voidreaver (Body/Chaos) · **Champion:** Kha'Zix, Mutating Horror
**Registered:** 40 main + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Collection status:** 3 cards still to get, $19.88 gap
**riftbound.gg tier:** Tier 3, #2 (12th of 49 ranked champions)
**List:** JUN's current build, from his Metafy guide published 2026-09-11

## The short version

*Everything below is expanded later with the rules behind it. This page is the part
worth having at the table.*

**The one rule that governs the deck.** Voidreaver pays XP only when you **win** a
combat — meaning you are the *only* player with units left at that battlefield
(rule 466.3.a). A mutual wipe, an even trade, or your attackers bouncing off
survivors are all **No Result**, and No Result pays nothing. Surviving a fight is
not winning it. **If you cannot answer "how does every one of their units here die,
with at least one of mine alive?", do not start the fight.**

**What your legend can and cannot do.**

| | |
|---|---|
| Gains XP | Every combat you win — **no limit per turn**, no cost, automatic |
| Spends XP | **Once per turn** (it exhausts), and **only in your own Main Phase** |
| 1 XP | Buff a unit: **permanent +1 Might**, max one buff per unit, ever |
| 2 XP | Walk an exhausted unit home from a battlefield |
| Never | Mid-combat, mid-showdown, or on their turn at all (rule 381) |

So: **earning is free and unlimited, spending is the bottleneck.** Bank freely. A
turn where you win three combats banks three XP even though you can only cash one.

**Your turn, in order:** activate the legend → buff → develop → arrange the fight →
*then* move → hold up everything with Action or Reaction on it. Moving is what
starts combat, so it comes last. (§11)

**Four ways to turn a trade into a clean win:** stun it (Vex), grow it (Punch
First), remove it (Star-Crossed, Rebuke, Rampage), or add bodies (Up from the Deep —
a 1-Might token eats exactly 1 damage of their assignment and no more).

**Three numbers worth memorising.**

- **Body Power is your scarce resource**, not Chaos — weighted demand is Body 10 vs
  Chaos 6 on a 6/6 base, and Punch First ×3 is 6 of that 10. Count Body runes first.
- **Punch First cannot be countered by Defy** (2 Power puts it out of range). It is
  the one spell you can always commit into their open Power.
- **Vex stuns every unit they play, anywhere on the board** — not just at her
  battlefield. Against a deployment deck she is the whole matchup.

**The most common way to lose:** moving first and thinking second, into a fight you
will merely survive.

**What to expect of yourself.** At the last RQ, 54 Kha'Zix pilots averaged about
**57%** in matches while JUN posted **83%** on this same list. That gap is reps, not
cards. The deck will feel worse than its results for a while; that is normal, and
not evidence the list is wrong. (§8)

## 1. What this deck is

You had the shape of it right: this is a patience deck that builds, and it
removes to protect the building. But there is a specific reason it must be
patient, and it is not a matter of temperament. It is a rule.

Voidreaver reads *"When you **win** a combat, gain 1 XP."* Winning a combat is a
defined term, and it is much narrower than surviving one:

> **rule 466.3.a** — A Player has won a combat if they received either the
> attacker or defender designation and are the **only** Player that has units
> remaining at this battlefield during this step.

Everything else is No Result. Both sides wiped: No Result. Your attackers bounced
off surviving defenders and recalled: No Result. A clean, even trade where the
last two units kill each other: No Result. The Unleashed FAQ amended the rule
specifically to close the last hole, and it now reads that there is No Result
*"if units were recalled during the Combat Cleanup, if both Players have units
present during this task, or if neither player has units present during this
task"* (rule 466.3.d).

**No Result pays nothing.** No XP, no buff, no engine.

That single fact separates this deck from every trading midrange list in the
format, and it is worth saying plainly because it inverts normal card-game
instinct: **an even trade is a failure here.** You are not trying to break even
on cards. You are trying to kill every enemy unit at a battlefield while keeping
at least one of yours alive, because only that pays XP. The removal suite exists
to turn trades into clean wins. The patience exists because a clean win you
cannot yet guarantee is a combat you should not start.

## 2. The engine, and its three hard ceilings

**Voidreaver** — *"When you win a combat, gain 1 XP. Spend 1 XP, {exhaust}: Buff
a unit. Spend 2 XP, {exhaust}: Move an exhausted friendly unit from a battlefield
to its base."*

XP itself is unbounded — *"There is no limit to an amount of XP a player can
accrue"* (rule 733), it is public information (729.2), and it is not a game
object, so it cannot be targeted, readied or exhausted (731.1). Nobody can
interact with your XP. That is the good news, and it is why banking is safe.

The ceilings are all on the spending, and there are three: how often, how much,
and when.

**Ceiling one: one activation per turn.** Note the asymmetry between the three
lines. *"When you win a combat, gain 1 XP"* carries no cost at all — it is a
triggered ability (rule 174.7) and it fires on **every** combat you win, as many
times a turn as you can win them. Earning is uncapped and automatic.

The other two lines are activated abilities whose cost includes the exhaust
symbol, and rule 414.5 is explicit that *"In abilities, the Exhaust symbol
represents the cost 'Exhaust this' or 'Exhaust me.'"* A legend can pay it: the
Legend Zone is part of the Board (rule 107.4, inside "The Board" at 107 —
non-board zones do not begin until 108), and the Champion Legend there is a Game
Object (107.4.c). It comes back via rule 415.3.a: *"A player Readies all
non-spell Game Objects they Control during the Awakening Phase on their turn."*

So you get one activation per turn cycle — either a buff or a rescue, never both.
An eight-XP bank does not buy eight buffs on one turn. It buys one buff a turn for
eight turns. **Earning is passive and unlimited; spending is the bottleneck**, and
that gap is the whole reason a multi-combat turn is worth setting up even though
you can only cash one point of it immediately.

**Ceiling two: one buff per unit, +1 Might each.**

> **rule 702.3** — There can only be one Buff on a Unit at a time.
> **rule 703** — Each Buff individually contributes +1 Might to a Unit.
> **rule 426.1.b.1** — If the unit already has a Buff Counter on it, it does not
> get another one.

So a buff is a permanent +1, and it does not stack. You cannot build one enormous
unit out of XP; you build a **wide board of slightly-better units**, one per turn.
And rule 705 takes it all back if the unit leaves play — which is why bouncing
your buffed units (your own Star-Crossed, their Charm) costs real accumulated
value, not just tempo.

Put the first two ceilings together and the deck's whole clock falls out of them: your
board improves by exactly +1 Might per turn, permanently, for as long as you keep
winning combats outright. That is slow. It is also compounding, because every +1
makes the *next* clean win easier to guarantee, which pays the next XP. Nothing in
this deck is explosive. The whole thing is a loop that tightens.

**Ceiling three, and the one that governs how you play: neither ability is a
trick.** Both are Activated Abilities (rule 377.1 — a cost, a colon, an effect),
and neither carries Action or Reaction. Three rules stack on that:

> **rule 381** — All Activated Abilities can only be activated on the
> Controlling Player's Turn and during an Open State.
> **rule 308.1.a** — Only cards and abilities with the Action or Reaction
> keywords can be played or activated in a Showdown State.
> **rule 309.1.a** — Only cards and abilities with the Reaction keyword can be
> played or activated in a Closed State.

So Voidreaver operates **only in a Neutral Open state, on your own turn**: your
Main Phase, no chain on the stack, no combat running. You cannot buff in response
to their combat trick. You cannot buff mid-showdown at all. And on their turn the
legend does nothing whatsoever.

**The 2-XP mode is therefore proactive, not a rescue.** *"Move an exhausted
friendly unit from a battlefield to its base"* has to be used in your Main Phase,
**before** the combat is staged — it cannot pull a unit out of a fight that is
already happening, and it can never save anything on their turn. Its real use is
disengagement: a unit of yours is exhausted at a contested battlefield, the
Cleanup would stage a combat you have worked out you cannot win outright, and you
walk it home instead. The buff goes with it (rule 705 strips buffs only when a
unit *leaves play*, and Base is on the Board per rule 107.1.b and 141.1.a.1).

Two turns of buff progress to decline one fight is a real price. But declining a
fight you would not have won costs you nothing in XP — because, per §1, a fight
you do not win outright pays nothing anyway.

## 3. How combat actually resolves

This deck lives inside the combat rules more than most, so these four properties
are worth knowing exactly.

**Combat is never declared.** It happens on its own, in a Cleanup, when the Chain
is empty, a Combat is staged at a Battlefield, and no Showdown or Combat is
running anywhere else (rule 460). A Combat is staged at any Battlefield that
Contested was applied to with units present from opposing players (rule 323.9).
You start a fight by *moving somewhere* — which is precisely why Void Assault and
Irresistible Faefolk are combat cards, not utility cards.

**There is no blocking and no pairing off.** Each side sums the Might of all its
units and assigns that whole total across the other side's units (rule 465.2.a–c).
A 1-Might token and a 6-Might Rengar are, for the purposes of the sum, seven
Might. Nothing blocks anything.

**The attacker assigns first, and cannot overkill.** The defender allocates
knowing the attacker's choices; only the *dealing* is simultaneous (rule 465.2.c,
465.2.c.1.a). Assignment must put lethal damage on a unit in full before moving to
the next (465.2.c.3) and may not exceed the minimum lethal amount while other
units remain (465.2.c.4).

That no-overkill rule is a resource in this deck. A 1-Might Tentacle token absorbs
**exactly one** point of their assignment and no more. Two tokens tax two points
off the total they have available to kill anything that matters. Cheap bodies are
not chaff here; they are damage-assignment friction.

**The Showdown is your window.** Combat opens with a Combat Showdown before any
damage (rule 464), and in a Showdown State only cards with Action or Reaction can
be played (rule 308.1.a). Punch First, Stacked Deck, Rebuke, Switcheroo and
Acceptable Losses are Actions; Hard Bargain, Star-Crossed, Abandon and Unyielding
Spirit are Reactions; Ambush units arrive with Reaction timing; Hidden cards come
back as Reactions. You are allowed to rewrite the sum after the opponent has
committed to it.

**And the asymmetry that this deck cares about more than any other.** If the
defenders survive, the attackers are *recalled* (rule 466.1.a.2) and the result is
No Result (466.3.d). If everyone dies, no units remain, the Battlefield becomes
Uncontrolled (466.5.b) — and, again, No Result. The FAQ spells out the mutual-kill
case directly: *"both sides will assign damage to the other side equal to the
total Might of all units there, which will end up killing all units on both sides.
No units will remain to control the battlefield, leaving it open and nobody will
score a point."*

Nobody scores, and **you gain no XP**. In a Sivir-style trading deck an even trade
at a held battlefield is a point swing worth taking. Here it is the worst outcome
available: you spent cards, you got no point, and you got no XP. Do not take it.

One more from the FAQ, easy to misplay: units heal at the end of every combat and
at the end of every turn, so damage does not carry between fights. A unit that
survived at 1 Might remaining is back to full immediately.

## 4. Winning a combat outright: the four levers

Since only clean wins pay, it is worth naming the exact tools that convert a trade
into a win.

**Lever one — stun (Vex).** *"A Stunned Unit does not contribute its might to
damage in the combat damage step"* (rule 423.1.b). Stunning their biggest unit
subtracts its Might from their assignment total while leaving it on the board as a
body you still have to kill (423.1.c — it still needs its full Might in damage).
That is the single cleanest way to survive a fight you would otherwise tie.
Stunned status ends at end-of-turn cleanup (423.1.a.2), so it is a one-combat
effect.

**Lever two — raw Might (Punch First, Onslaught).** +5 for 1E/2P at Action speed,
+6 for 4E, but Main-Phase only — Onslaught has no Action keyword — with Flow to rebuy. Raising your sum kills more of
theirs; it does not by itself keep yours alive.

**Lever three — subtraction (Star-Crossed, Rebuke, Rampage, Angler Beast).**
Removing a unit from the fight before damage removes its Might from their sum
*and* removes it as a body you must kill. Subtraction is worth roughly double
addition for the purposes of a clean win, which is why this deck plays removal it
does not strictly need for tempo.

**Lever four — bodies (Up from the Deep, Shadow Clone).** Extra units both add
Might and soak assignment under the no-overkill rule, and they keep your real
threats from being *alone* — which matters at Forbidding Waste and is the
difference between your unit eating the -2 and theirs.

## 5. Card by card — the main deck

### The legend

**Voidreaver ×1.** Covered in §2. The habit to build: decide at the *start* of
your turn whether this turn's activation is a buff or a rescue, before you move
anything, because the exhaust is the scarcest thing you own.

### Units — the isolation package

**Kha'Zix, Mutating Horror ×1** (4E / 1 Chaos / 4 Might, Ambush) — *"When I attack
or defend, if an enemy unit is alone here, give me +2 Might this turn and gain 2
XP."*

The champion, and a single copy, because it is a payoff and not a plan. Read the
trigger carefully: it checks whether an **enemy** unit is alone, and *"a unit is
alone when there are no other friendly units at the same location"* (rule 740.2.a)
— friendly to *it*. So the condition is "they have exactly one unit here." Two
enemy units and Kha'Zix is a vanilla 4-Might Ambush body.

**Why this Kha'Zix and not the other one.** Voidreaver's champion tag admits two
legal Chosen Champions (rule 103.2.a.2), and they play very differently.
**Kha'Zix, Evolving Hunter** (5E / 1 Body / 5 Might) has *"[Hunt] (When I conquer
or hold, gain 1 XP)"* and *"When I attack, you may spend 3 XP to deal damage equal
to my Might to an enemy unit here."* Hunt pays XP for **scoring rather than
winning a fight** — it routes straight around §1's constraint — and the 3-XP mode
is removal.

Mutating Horror is the more explosive and the more fragile: 2 XP at once instead
of 1, but only if you have engineered the isolation, and nothing at all if you
have not. Evolving Hunter is the grindier, more reliable card. JUN plays Mutating
Horror, which fits a list with three Faefolk and three Void Assault to manufacture
the condition on demand. If you find the isolation is not reliably there, Evolving
Hunter is the switch to make, not a second Mutating Horror.

Two XP in one trigger is worth two full turns of the legend's grind, so
manufacturing the isolation is a real line, not a coincidence. Irresistible
Faefolk and Void Assault both drag a single enemy unit somewhere; that somewhere
should frequently be a battlefield where Kha'Zix can Ambush in.

Ambush means *"I may be played to a battlefield where you control Units"* and
*"I have Reaction as long as I'm being played to a battlefield where you control
Units"* (rule 822.1.b) — so he arrives mid-showdown, after they have committed.
Careful with rule 822.3: if there are no units at the chosen location when
Finalization completes, Ambush's permission is no longer valid.

**Rengar, Trophy Hunter ×2** (5E / 1 **Body** / 6 Might, Ambush) — *"I can [Ambush]
to a battlefield where there are enemy units, even if you don't have units there."*

Six Might that can be deployed into a battlefield **where you control nothing** —
which no other card in the deck can do. The rules document uses Rengar by name as
its example of Ambush-as-a-verb (rule 822.1.d): the verb means "play with the
permissions of the Ambush keyword," and his text "expands the normal permissions
of the Ambush keyword to include battlefields where there are enemy units."

**One open question, and you should know it before you rely on it.** Ambush is
*two* grants (rule 822.1.b): *"I may be played to a battlefield where you control
Units"* **and** *"I have [Reaction] as long as I'm being played to a battlefield
where you control Units."* Rengar plainly expands the first. Whether he expands
the second is not stated anywhere — and at a battlefield where you control no
units, the Reaction clause's own written condition is false. Read strictly, Rengar
into an empty-of-yours battlefield is **Main-Phase speed only**; read as a
permissions package (822.1.d's wording), he keeps Reaction timing.

The Core Rules do not resolve it and no FAQ mentions Ambush at all. Where you
*do* control a unit at the battlefield, both grants apply and he is unambiguously
a Reaction. **Ask a judge before relying on the Reaction-speed empty-battlefield
line in a tournament**, and until then treat it as a Main-Phase play.

Practical read: any battlefield holding a lone enemy unit of 6 Might or less is a
battlefield you can simply take, at Reaction speed, for one card. And a lone enemy
is exactly Kha'Zix's condition — the two cards want the same board.

**Irresistible Faefolk ×3** (2E / 1 Might) — *"When I move to a battlefield, you
may move an enemy unit to that battlefield."*

The isolation engine, and the reason there are three. Note it triggers on *move to
a battlefield*, not on play, so it keeps working every turn you move it. It drags
an enemy unit **to** the Faefolk, which means you choose the fight's location. Use
it to pull one unit away from a stack (creating "alone" for Kha'Zix at the old
location, or a clean 1-v-many at the new one), or to pull a unit into a
battlefield where your buffed board already stands.

A 1-Might body also costs them exactly 1 damage of assignment to kill, per §3.

**Tideturner ×1** (2E / 2 Might, Hidden) — *"When you play me, you may choose a
unit you control **at another location**. Move me to its location and it to my
original location."*

**Read the errata text, not the printed card** (§12). It is "a unit you control at
another location," and the location restriction is what makes it work from Hidden.
The rules document uses Tideturner as its worked example of rule 811.1.d.2: because
its targeting restriction *can never be fulfilled by a unit at its own
battlefield*, a Tideturner played from Hidden may choose its target **freely**,
rather than being confined to the battlefield it was hidden at.

That is a genuinely powerful exception. Hide it for a rainbow Power, and on a
later turn it is a 0-Energy Reaction that teleports any unit you control across
the board mid-showdown. Pulling a 6-Might Rengar into a fight he was not present
for, at Reaction speed, for zero Energy, is the best use.

**Traveling Merchant ×2** (2E / 2 Might) — *"When I move, discard 1, then draw 1."*

Loot on every move, and this deck moves constantly. It is also trash-filling: the
discard feeds Fizz, Tail-Cloaked Matriarch and the Flow spells (§6). Two copies is
right — it is a value engine, not a threat.

**Shadow Order Disciple ×3** (2E / 2 Might) — *"When I move, you may [Burn 1] to
give me +1 Might this turn."*

Burning is *"moving cards from the top of a player's Main Deck to their trash"*
(rule 440.1). So this is a 2-drop that becomes a 3-drop whenever you want, paid
for in trash — and trash is a resource this deck spends (Fizz, Matriarch, Flow).
It is the cleanest example of the deck's economy: your library is fuel.

Three copies, and they are your early-board filler. The +1 is optional and per
move, so it is repeatable across turns.

### Units — the standalone threats

**Fizz, Trickster ×3** (3E / 1 Chaos / 3 Might) — *"When you play me, you may play
a spell from your trash with Energy cost no more than 3, ignoring its Energy cost.
Then recycle it."*

A 3-Might body that rebuys a spell for free. The pool is **every spell in the deck
except one** — Onslaught, at 4 Energy, is the sole card out of range:

| Legal for Fizz | Power you still owe |
|---|---|
| Punch First (1E) | 2 Body |
| Sabotage (1E) | 1 Body |
| Stacked Deck (1E) | — |
| Hard Bargain (2E) | — |
| Void Assault (2E) | 1 |
| Rampage (3E) | — (Body optional) |
| Star-Crossed (3E) | 1 |
| Up from the Deep (3E) | — |

Free Stacked Deck, Up from the Deep, Rampage and Hard Bargain are the ones that
cost you literally nothing extra; Punch First is the biggest swing but wants 2
Body Power on a turn you are already casting a 3-drop.

Two things to hold in mind. You still pay the spell's **Power** cost — Punch First
still wants 2 Body Power, Void Assault still wants 1. And the spell is recycled
afterward, not trashed, so it goes back into the rune economy rather than staying
available for a second Fizz.

**Tail-Cloaked Matriarch ×2** (4E / 4 Might, Empower 2E + Chaos rune) — *"When I
become Empowered, you may choose a unit in your trash with Energy cost no more
than 3 and Power cost no more than one rainbow. Play it to your base, ignoring its
cost."*

The other half of the trash economy, and the one that rewards the Burn. Twelve of
your forty cards are legal targets — every unit at 3 Energy or less with at most
one Power:

| Legal | Copies | Why you'd take it |
|---|---|---|
| **Fizz, Trickster** (3E/1P) | 3 | **The best get by far** — see below |
| Irresistible Faefolk (2E) | 3 | Another drag, another isolation |
| Shadow Order Disciple (2E) | 3 | Body + more Burn |
| Traveling Merchant (2E) | 2 | Loot engine |
| Tideturner (2E) | 1 | Repositioning |

Illegal: Kha'Zix (4E), Vex (4E), the other Matriarch (4E), Rengar (5E), Zed (5E).
The ceiling is low by design.

**The line worth knowing: Matriarch into Fizz.** Empowering fetches Fizz free from
the trash, and Fizz's own play trigger then replays a spell free from that same
trash. One Empower activation converts two dead cards in your trash into a
3-Might body plus a spell. That is the deck's biggest single swing of raw card
advantage, and it is the reason to Burn aggressively in the early turns (§6).

Note the unit arrives **at your base**, not at a battlefield, so it is board
development on a delay, not a combat trick — and Fizz's spell is cast from base,
which matters for anything that chooses units by location.

Empower is an activated cost you pay on a later turn, which fits the patience
theme: the Matriarch is a 4-Might body now and a free unit whenever you have 2E
and a Chaos rune spare.

**Vex, Apathetic ×2** (4E / 4 Might, Deflect) — *"When an opponent plays a unit
while I'm at a battlefield, [Stun] it. They can't move it this turn."*

The best card in the deck against half the format, and the single strongest
guarantor of clean wins. Per §4, a stunned unit contributes no Might to combat
damage.

**Read her trigger carefully, because it is board-wide.** The condition is
*"while **I'm** at a battlefield"* — that is a clause about Vex's own location,
not about where the unit is played. Riftbound templates location-restricted
effects with the word *here* (Valley of Idols: *"When a player plays a unit
**here**"*), and reserves *"while I'm at a battlefield"* for global effects keyed
to the source's position — Mageseeker Warden (*"opponents can only play units to
their base"*), Tianna Crownguard (*"opponents can't score points"*), Sandstone
Chimera (*"players only channel 1 rune"*). Vex is written in the global pattern.

So while Vex stands at **any** battlefield, **every unit your opponent plays,
anywhere on the board, enters stunned** — contributing no Might to combat damage
that turn — and cannot be moved by them that turn. Against a deployment deck she
is not a roadblock at one location; she taxes their entire development.

The no-move clause is worth a second look. Units already enter exhausted (rule
178.1.a.1) and a Standard Move costs exhausting the unit (rule 144.2), so a
freshly played unit could not walk anywhere regardless. What the clause actually
stops is being *readied* into motion — and **Ride the Wind** (*"Move a friendly
unit and ready it"*) appears in 8 of 9 Kennen lists. Vex blanks it on anything
they just deployed.

Deflect (*"Opponents must pay one rainbow Power to choose me with a spell or
ability"*) is a real tax in a format where removal is Power-tight. She must be
**at a battlefield** for any of this — a Vex sitting at base does nothing at
all.

**Zed, Without a Sound ×2** (5E / 5 Might) — *"When I conquer, play a 0-Might
Shadow Clone unit token to your base"* (the token: *"When I attack, you may banish
a unit from your trash. If you do, give me [Assault 4] this turn."*) and
*"[Action] 1E + Chaos: Move me and a Shadow Clone you control to each other's
locations."*

The top end, and a threat that generates its own reach. Conquering makes a clone;
the clone can swap places with Zed at Action speed for 1E — so Zed can be at base
during their turn and teleport into a fight, or conquer one battlefield and
relocate to defend another. A 0-Might clone that grants itself Assault 4 by
banishing from your trash is another trash payoff.

Conquer is *"A player gains Control of a Battlefield they did not yet Score this
turn"* (rule 469.1), so Zed wants to be taking *new* battlefields, not sitting on
held ones.

### Spells — the removal and the tricks

**Void Assault ×3** (2E / 1 Power, Body/Chaos) — *"Move a friendly unit, then move
an enemy unit. (If they both move to a battlefield you don't control, you're the
attacker.)"*

The deck's signature card and the one you are 2 copies short of (§13). It is a
two-sided repositioning tool that manufactures the fight you want: bring your unit
in, bring their unit in, and the parenthetical tells you who gets the attacker
designation — which per rule 464.2.c.1 is whoever applied Contested.

Being the attacker matters both ways. You assign damage first (rule 465.2.c),
which is how you guarantee a clean kill. But if the defenders survive, *you* are
the one recalled and the result is No Result. So take the attacker role when your
sum kills their whole board, and decline it when it does not.

It also, quietly, sets up Kha'Zix: move one enemy unit somewhere it is alone.

**Punch First ×3** (1E / 2 Body, Action) — *"Give a unit +5 Might this turn."*

Five Might for one Energy at showdown speed is the most efficient combat swing in
the deck. The Power is the constraint, not the Energy: 2 Body Power out of a
6-Body rune base is a real commitment on a turn you also want to cast something.

**Star-Crossed ×2** (3E / 1 Power, Reaction) — *"Return a friendly unit and an
enemy unit to their owners' hands."*

Reaction-speed subtraction, and the symmetry is the cost. It removes a unit from
their combat sum entirely — better than any amount of +Might for the purpose of
winning outright. Remember rule 705: whichever of *your* units you bounce loses
its buff permanently. Bounce an unbuffed body, or a Faefolk you intend to replay
for another drag.

**Rampage ×1** (3E, Body) — *"As you play this, you may pay a Body rune as an
additional cost. Choose a friendly unit and an enemy unit. If you paid the
additional cost, give the friendly unit +2 Might this turn. They deal damage equal
to their Mights to each other."*

Removal that happens *outside* the combat damage step, which is the important part:
you can kill a defending unit before the sums are calculated, or before a combat exists at
all. A buffed unit duelling with the +2 rider covers a lot of the format's
4-and-5-Might units.

**Onslaught ×1** (4E, Body, Flow 4E) — *"Give a unit +6 Might this turn."*

The biggest single Might swing in the deck, and the only spell Fizz cannot rebuy
(§5, Fizz). Two things make the one-of correct rather than stingy. It has **no
Action keyword**, so unlike Punch First it cannot be played in a showdown — it is a
Main-Phase commitment made *before* they respond, which is the same constraint the
legend labours under (§2). And Flow lets you cast it a second time from the trash
for 4 Energy, then banishes it, so a single copy is effectively two uses spread
across a long game.

Use it as a pre-combat declaration when you are the attacker and want to guarantee
the clean sweep §1 demands: +6 on a buffed 4-drop is 11 Might assigning first. Do
not hold it as a trick — it cannot be one.

**Sabotage ×2** (1E / 1 Body) — *"Choose an opponent. They reveal their hand.
Choose a non-unit card from it, and recycle that card."*

Proactive protection for a deck whose plan is slow enough to be disrupted. It
takes the counterspell (Defy, Hard Bargain), the removal, or the trick before it
can answer your build-up, and the reveal is information you use for the next three
turns. Non-unit only — it cannot take their threats.

**Stacked Deck ×3** (1E, Action) — *"Look at the top 3 cards of your Main Deck. Put
1 into your hand and recycle the rest."*

Consistency at Action speed, so it costs you nothing to hold it up. Three copies in
a deck with this many situational cards is correct: it finds the Vex against
deployment decks and the Punch First in a showdown.

**Hard Bargain ×1** (2E, Chaos, Reaction, Repeat 2E) — *"Counter a spell unless its
controller pays 2 Energy."*

A soft counter that mostly buys a turn, and Repeat (rule 820) lets you tax them 4
Energy if you have it spare. One copy main, one more in the board.

**Up from the Deep ×3** (3E, Chaos, Flow 3E) — *"Play two 1-Might Tentacle unit
tokens from Bilgewater."*

Two bodies for one card, and with Flow you get them a second time from the trash.
Per §4 they are assignment friction, Might-sum padding, and "not alone" insurance
in one card. In a deck that needs to win combats outright rather than trade, two
free bodies that each cost the opponent exactly one point of assignment is worth
more than the raw stats suggest.

### The runes (12) — 6 Body / 6 Chaos

Twelve cards, exactly, because rule 161.2.a requires *"Exactly 12 Rune cards chosen
during Deck Construction."* They are a fifth of your registered deck and they are
not background scenery, so they get an entry.

**What a rune does.** Every Basic Rune carries the same two abilities (rule 164.2):

> **164.2.a** — {exhaust}: **[Reaction]** — Add 1 Energy.
> **164.2.b** — **Recycle this**: **[Reaction]** — Add 1 Power.
> **164.2.b.1** — The Power added this way corresponds to the Domain of the Rune
> that is being Recycled.

Two consequences worth internalising. First, **paying Power means recycling the
rune** — the card physically leaves your Base and goes to the bottom of your Rune
Deck. Energy is rented; Power is spent. Second, **both abilities are Reactions**,
which is why you can pay for Star-Crossed or Hard Bargain mid-chain. Your runes are
the one part of your board that always operates at Reaction speed, even though your
legend never does (§2).

You channel **2 runes per turn** (rule 315.3.b), so a 12-rune deck cycles roughly
every six turns of Power-spending.

**The tension in this base, stated honestly.** Weight each Power symbol by the
number of copies that demand it:

| Domain | Weighted demand | Runes |
|---|---|---|
| **Body** | **10** | 6 |
| Chaos | 6 | 6 |
| Either (Void Assault ×3) | 3 | — |

Body demand runs well ahead of Chaos on an evenly split base, and one card causes
most of it: **Punch First ×3 at 2 Body each is 6 of that 10** — half your Body
runes for a single playset. Sabotage ×2 and Rengar ×2 want Body as well.

The practical habit: **treat Body Power as the scarce resource and Chaos as the
loose one.** Chaos costs in this deck are all single symbols (Fizz, Kha'Zix,
Star-Crossed) or rune-costs on abilities (Matriarch's Empower, Zed's swap). Body is
where you get stuck. On a turn you intend to hold up Punch First, count your Body
runes *first* and build the rest of the turn around what is left — and remember
Sandswept Tomb shaves one Power off a spell choosing your units there, which is
most often how you afford Punch First and a 3-drop on the same turn.

The even split is defensible because Body is heavily concentrated in one card while
Chaos is spread thin across many; if you cut Punch First, cut Body runes with it.

### The battlefields

**Forbidding Waste ×1** — *"While a unit here is defending alone, it has -2
Might."*

Symmetrical, and you must respect that. It punishes lone **defenders** — which is
usually them, because your whole gameplan is dragging a single unit somewhere. Pair
with Kha'Zix: an enemy defending alone here is at -2 *and* switches on his +2 and
2 XP.

Do not leave a single unit of yours defending here.

**Sandswept Tomb ×1** — *"Each spell that chooses one or more units here that are
friendly to it costs one rainbow less."*

A discount on Punch First, Star-Crossed, Rampage and Switcheroo when they touch
your units here. In a deck this Power-tight it effectively makes Punch First cost
1 Body instead of 2 at this battlefield.

**Zaun Warrens ×1** — *"When you conquer here, discard 1, then draw 1."*

A loot on conquer, and a trash-filler that lines up with Fizz and the Matriarch.

## 6. The trash is a resource

Worth pulling out as its own idea, because four cards depend on it and new pilots
tend to treat the trash as a graveyard rather than a second hand.

**Filling it:** Shadow Order Disciple (Burn 1 on every move), Traveling Merchant
(discard on every move), Zaun Warrens (discard on conquer).

**Spending it:** Fizz (free spell ≤3E), Tail-Cloaked Matriarch (free unit ≤3E/1P),
Onslaught and Up from the Deep (Flow — *"You may play this from your trash for its
Flow cost. Then banish it"*, rule 829), Shadow Clone (banish a unit from trash for
Assault 4).

The practical consequence: **Burn is not a cost, it is a setup.** When Shadow Order
Disciple offers you +1 Might for a Burn, the default answer in the early game is
yes even when you do not need the Might, because you are loading the resource four
other cards spend. The exception is when your deck is thin late and you cannot
afford to mill a specific answer.

## 7. Keywords, precisely

Short reference for the ones this deck's lines actually hinge on.

| Keyword | What it does | The detail that catches people |
|---|---|---|
| **Ambush** (822) | Play to a battlefield where you control units; has Reaction while doing so | If no units remain there at Finalization, the permission is void (822.3) |
| **Hidden** (811) | Hide facedown for a rainbow; from the next turn it is a Reaction you play for 0 | Targets are normally confined to that battlefield (811.1.d.2) — Tideturner is the documented exception |
| **Empower** (827/441) | Activated cost that flips a permanent to Empowered | One-way and permanent; "use only if not Empowered" |
| **Burn** (440) | Top of your Main Deck to your trash | Mandatory when instructed; burn as many as possible |
| **Flow** (829) | Play a spell from your trash for its Flow cost, then banish it | Banished, so once each — it is not a loop |
| **Deflect** (809) | Opponents pay a rainbow to choose it with a spell or ability | A tax, not a prohibition |
| **Stun** (423) | Unit contributes no Might to combat damage | Still needs full Might in damage to die (423.1.c); wears off at end of turn |
| **Repeat** (820) | Optional additional cost to execute the effect twice | |

## 8. What the format actually plays

Two Regional Qualifiers frame the current format. **Singapore (4–6 Sep 2026, 2,055
players)** is the more recent and sits only days before your list was published, so
it is the better read; **Barcelona (21–23 Aug 2026, 2,130+ players)** is where JUN
posted his result. Both tables below are Top 64.

**Singapore — the current picture**

| Legend | Field share (Top 64) | Match win rate |
|---|---|---|
| **Kennen, Heart of the Tempest** | **34.4%** (22) | 72.8% |
| Master Yi, Wuju Bladesman | 9.4% (6) | — |
| Rengar, Pridestalker | 9.4% (6) | — |
| Rek'Sai | 4.7% (3) | 71.9% |
| Azir · Diana · Ezreal · Vex · Fiora | 4.7% (3) each | — |
| **Kha'Zix, Voidreaver** | **4.7%** (3) | **67.8%** |

**Barcelona — one event earlier**

| Legend | Field share (Top 64) | Match win rate |
|---|---|---|
| Kennen | 28.1% (18) | 72.1% |
| Irelia, Blade Dancer | 12.5% (8) | 68.4% |
| Master Yi | 12.5% (8) | 68.3% |
| Rengar | 7.8% (5) | 69.6% |
| Lux | 4.7% (3) | 73.0% |
| Azir · Rek'Sai | 4.7% (3) each | ~66% |

**Three things to take from this.**

**Kennen is the format and is still growing** — 28.1% to 34.4% of the Top 64 across
two events, at a 72%+ win rate both times. Better than a third of the tables you
face at a competitive event will be Kennen. Sideboard for it first and everything
else second. (This is also why Vex being board-wide, §5, matters so much.)

**Irelia looks like it is falling off.** It was 12.5% of the Barcelona Top 64 and
does not appear in Singapore's upper tier at all. §9 still carries a full Irelia
section because the deck is a bad matchup you should know, but weight your practice
toward Kennen.

**And the number you should sit with, because it is the honest one.** At Singapore
54 Kha'Zix pilots went a combined **238-178-15 — about 57% in matches**, averaging
13.5 points. That is a respectable but unremarkable archetype. In the same window
JUN went 10-2-1 at Barcelona and posted an **83% win rate**, and has never missed
Top 128 across five RQs.

The gap between 57% and 83% is not the decklist — you are holding his decklist. It
is reps. This deck asks you to correctly answer "does every one of their units here
die?" several times a game (§1), under a legend that cannot help you once the
showdown starts (§2). Pilots who have not internalised that take the even trades and
land at 57%. **Expect the deck to feel worse than its results for the first several
nights, and do not conclude from that that the list is wrong.**

## 9. Matchups

A caveat first: the local deck archive is North-American-and-online only, so the
archetype card lists below come from it, while the share and win-rate figures come
from the Singapore and Barcelona RQ standings (§8). The lists are therefore
*representative of the archetype*, not necessarily of what a given RQ opponent
registered. Treat the lists as representative, not as JUN's own tuning — his
matchup work is in his guide, and it is not mine to reproduce.

### Kennen, Heart of the Tempest — 34.4% of the Singapore Top 64, 72.8% win rate

Their core: Lightning Rush, Ride the Wind, Stacked Deck, Traveling Merchant,
Nocturne Horrifying, Rhasa the Sunderer, Star-Crossed, Kennen Storm of Shuriken,
Minefield.

This is a self-milling tempo deck that plays from its trash much as you do — Rhasa
costs 1 Energy less per card in *their* trash, and Minefield puts two more there on
every conquer. Lightning Rush digs and refuels.

What it means for you: they are fast and they go wide, and both of those attack the
premise of §1 — they are happy to trade, because trades cost you XP and cost them
nothing. **Vex is your best card here**, because every unit they deploy at her
battlefield arrives stunned and their whole plan is deployment. Ride the Wind
(*move a friendly unit and ready it*) means they can reposition at Action speed, so
do not count a fight as locked until the showdown closes.

Rhasa at 6 Might is the one body your buffs will not out-scale; answer it with
Rampage or Star-Crossed rather than trying to win the Might race.

### Irelia, Blade Dancer — 12.5% at Barcelona, absent from Singapore's top tier

Their core: Stellacorn Herder, Boots of Swiftness, Defy, Discipline, Ride the Wind,
Defiant Dance, Charm, plus Abandoned Hall / Sunken Temple / Targon's Peak.

The Calm interaction deck. **Defy** counters a spell costing no more than 4 Energy
**and** no more than one rainbow Power. Check your suite against that second
clause, because it is the one that matters:

| Structurally immune (Power > 1) | Counterable |
|---|---|
| **Punch First** (1E / **2P**) | Sabotage, Stacked Deck, Hard Bargain, Void Assault |
| **Rebuke** (2E / **2P**, SB) | Rampage, Star-Crossed, Up from the Deep, Onslaught |
| **Switcheroo** (2E / **2P**, SB) | Abandon, Acceptable Losses, Unyielding Spirit (SB) |

**Your best combat trick cannot be countered.** Punch First's two Power puts it
permanently outside Defy's range, and rule 206 makes that structural rather than
incidental: *"Effects that need to determine a card's cost for any purpose always
use its printed or copied cost, even if that cost is increased, decreased, or
ignored as the card is played"* — and the rule uses Defy itself as the worked
example. A discount (Sandswept Tomb) never drags a spell into Defy range, and
never lifts one out.

That reshapes the matchup. Do not play around Defy with Punch First; play around
it with everything else, and let Punch First be the card you commit into an open
Power. It also makes **Rebuke and Switcheroo the two best things you can bring in
from the board here** — both are 2 Power, both are uncounterable, and both answer
the single threat their deck builds.

Discipline gives +2 and draws at Reaction speed, so their combat sums move after
yours do. Sabotage is still excellent — take the Defy before the turn that
matters — and **Rengar is still strong here**, because a unit is not a spell and
cannot be Defied at all.

Charm (*move an enemy unit*) will drag your buffed units out of position for one
Power; remember a moved unit keeps its buff, so this is tempo loss, not value loss.

### Master Yi, Wuju Bladesman — 9.4% of the Singapore Top 64

Their core: Charm, Defy, Discipline, First Mate, En Garde, Sabotage, Punch First,
Scuttle Crab, Pit Rookie, Ruin Runner, Emperor's Dais.

A cheap, wide aggro-tempo deck running the same Punch First and Sabotage you do,
plus Defy. They will have a trick up whenever they have Power, and their units are
small enough that your buffs matter more here than anywhere.

Wide boards are where **Up from the Deep** and the no-overkill rule earn their
slot, and where Vex is merely good rather than great — she stuns one unit a turn
and they have six.

### Rengar, Pridestalker — 9.4% of the Singapore Top 64

Their core: Noxus Hopeful, Kai'Sa Survivor, First Mate, Pit Rookie, Sabotage, Punch
First, Inferna, Grim Apothecary, Kinkou Initiate, and **Irresistible Faefolk** — a
card you also play, so expect your isolation plan to be contested by a mirror of
itself.

### Azir, Emperor of the Sands — 4.7% of the Singapore Top 64

Their core: Discipline, Hidden Blade, Brutalizer, Guards!, B.F. Sword, Deathgrip,
Azir Sovereign, Arise!, Trifarian War Camp.

Gear-heavy, which is the one archetype where **Acceptable Losses** out of the board
(*each player kills one of their gear*) is live, and where **Akshan** — who steals
an enemy gear and attaches it if it is Equipment — is a genuine swing rather than a
cute body.

## 10. Mulligans

The deck's failure mode is a hand that cannot win a *first* combat outright, because
the engine never starts. Keep hands that do three things: develop on 2, have a way
to choose the location of the first fight, and hold one trick.

**Keep:** any two of {Shadow Order Disciple, Irresistible Faefolk, Traveling
Merchant} plus a Void Assault or Punch First. Stacked Deck makes a marginal hand
keepable because it is Action-speed and costs 1.

**Keep:** Vex plus two 2-drops against Kennen or any deployment deck. She is the
matchup.

**Ship:** hands with Zed, Rengar and Tail-Cloaked Matriarch and no 2-drop. The top
end is unbeatable late and irrelevant on turn 2, and this deck does not get to turn
8 for free.

**Ship:** hands with three or more spells and one unit. Every trick in the deck
modifies a combat; with no board there is no combat to modify.

**The test to apply, in one question.** Look at the hand and ask: *by turn three,
can I see a fight I win outright?* Not a fight I can take — a fight where all of
their units at that battlefield die and one of mine lives. If the hand cannot
picture that, it does not start the engine, and a Voidreaver deck that has not
started its engine is a pile of slightly undersized units.

That is a stricter test than most decks want, and it is why this deck mulligans
more aggressively than its curve suggests. Two 2-drops and a Void Assault is a
keep. Three 2-drops and no way to choose where they fight is closer to a ship than
it looks, because you will be taking the combats *they* offer, and those are
exactly the even trades that pay you nothing (§1).

**What "a way to choose the fight" means concretely.** Void Assault (moves both
sides), Irresistible Faefolk (drags one enemy to you), Tideturner if you can hide
it early, or simply having two more bodies at a battlefield than they do. One of
these in the opener, or you are reacting rather than building.

**On the draw, keep one more card back.** You see their development first, which is
worth more to this deck than tempo is — the whole plan is picking fights, and
picking is easier with information. A slightly slower hand with Vex in it is better
on the draw than a faster hand without her.

**Rule of thumb for the top end.** One 5-drop in an opener is fine if the rest
develops on 2 and 3. Two is a mulligan. Zed and Rengar win games you have already
stabilised; they do not stabilise anything themselves.

## 11. Sequencing — how your turn actually goes

The Main Phase *"has no defined structure"* (rule 316.5), so the order is yours to
choose — and in this deck the order matters more than in most, because two of your
resources cannot be spent late.

**Before your Main Phase, three things happen on their own:**

1. **Awaken Phase** (rule 315.1.b) — you ready everything you control, Voidreaver
   included. Your one legend activation is now available.
2. **Beginning Phase, Scoring Step** (rule 315.2.b.2) — you **Hold all battlefields
   you control**, scoring 1 point each. This happens *before* you get to do
   anything, so last turn's board is what pays you today. It is the reason to
   decline a fight you cannot win cleanly rather than throw units at it.
3. **Channel Phase** (315.3.b) then **Draw Phase** (315.4.b) — 2 runes, 1 card.

**Then the Main Phase, in this order:**

**Step 1 — Decide the legend activation before you touch anything else.** It is the
scarcest resource you own (§2), it is once per turn, and rule 381 means the window
closes the moment a showdown starts. Ask: is there a unit whose permanent +1 makes a
fight I want this turn winnable *outright*? If yes, buff now. If instead there is an
exhausted unit stuck somewhere I cannot win, spend 2 XP and walk it home now. If
neither, bank the XP — but know you have spent the turn's activation on nothing, and
that is a genuine cost.

**Step 2 — Buff before you move, always.** A buff applied after the showdown opens
is not a legal play. Pre-commit it, accept that they can see it, and plan the combat
around the number you have already put on the board.

**Step 3 — Develop.** Play your 2-drops, Empower a Matriarch, cast Up from the Deep.
Bodies first, because bodies are what soak assignment (§4) and what stop your
threats being *alone*.

**Step 4 — Set up the fight, then start it.** Moving is what creates combat (rules
460 and 323.9), so everything that repositions — Void Assault, Irresistible Faefolk,
a standard move — is the trigger, not the setup. Do the arranging first: drag the
lone enemy where you want it, make sure your side has the bodies, confirm your sum
kills *all* of theirs. Only then move in.

**Step 5 — Hold your Actions and Reactions for the showdown.** Punch First, Stacked
Deck, Rebuke, Switcheroo and Acceptable Losses are Actions; Hard Bargain,
Star-Crossed, Abandon and Unyielding Spirit are Reactions; Ambush units arrive with
Reaction timing. These are the only things you can still do once the fight starts —
so do not spend the Energy and Power they need during steps 3 and 4. Count your Body
runes before you commit (§5, the runes).

**The one-line version:** *activate, buff, develop, arrange, move, then hold up
everything with Action or Reaction on it.*

**The most common way to lose with this deck** is to move first and think second,
starting a fight you will merely survive. Surviving pays nothing (§1). If at step 4
you cannot answer "how does every one of their units here die, with at least one of
mine alive?", do not move.

## 12. Errata that change your cards

Three cards in this deck no longer read as printed. `data/cards.json` still carries
the printed text; `data/errata.json` carries the corrections.

**Tideturner — functional.** Printed: *"you may choose a friendly unit."* Current:
*"you may choose a unit you control **at another location**."* Two changes: it must
be a unit you *control* (not merely friendly, which in team formats includes an
ally's), and it must be **elsewhere** — you can no longer swap with something at the
same battlefield. This is also what makes the Hidden interaction work at all, per
rule 811.1.d.2, which cites Tideturner as its example.

**Rengar, Trophy Hunter — functional, and in your favour.** Printed: *"I can be
played to a battlefield where there are enemy units."* Current: *"I can [Ambush] to
a battlefield where there are enemy units, even if you don't have units there."*
The change from a plain play-permission to the **Ambush verb** matters, because rule
822.1.d defines the verb as "play with the permissions of the Ambush keyword" —
which is a permissions package, not just a location. The rules document uses this
exact card as its worked example.

**Fizz, Trickster — cosmetic.** *"Recycle that spell after you play it"* became
*"Then recycle it."* Same effect.

## 13. The sideboard, and what you still owe

Ten of ten, at the current legal maximum — Tournament Rules 601.1.c raised the cap
from 8 to 10 on 2026-07-24. Main-deck card types only, and the three-copy limit
spans main and board together.

Each entry says what it is for and what it comes in *over*, because a ten-card
board you cannot sideboard with is nine cards and a comfort blanket.

**Akshan, Mischievous** (4E / 0P Body, 4 Might, Weaponmaster) — *"You may pay two
Body runes as an additional cost. If you do, move an enemy gear to your base. You
control it until I leave the board. If it's an Equipment, attach it to me."*
The anti-gear card, and note the additional cost is **2 Body Power** — expensive on
the base described above, so plan the turn around it. Steals rather than destroys,
so it is card advantage plus a 4-Might body.
*In:* vs Azir and anything on Brutalizer / B.F. Sword. *Out:* Hard Bargain, or the
third Stacked Deck.

**Angler Beast** (5E / 1P Chaos, 5 Might) — *"When you play me, return all units
with 2 Might or less to their owners' hands."*
Read "one-sided sweeper" with care: **it is not one-sided against this deck.** Your
own casualties at 2 Might or less are Irresistible Faefolk ×3 (1M), Shadow Order
Disciple ×3 (2M), Traveling Merchant ×2 (2M), Tideturner ×1 (2M), every Tentacle
token (1M) and every Shadow Clone (0M) — **nine main-deck units plus all your
tokens**, and every buff sitting on them (rule 705 strips a buff the moment a unit
leaves play).

It is a reset button for when you are behind on a wide board, not a sweeper you
build around.
*In:* vs Master Yi and token decks, **only when you are losing the width war**.
*Out:* Up from the Deep — the two cards actively fight each other.

**Sett, Brawler** (5E / 1P Body, 4 Might) — *"When I'm played and when I conquer,
buff me. Spend my buff: Give me +4 Might this turn."*
The one card that touches your own buff economy, and it is worth understanding how.
Sett buffs **himself** without spending XP or your legend's once-per-turn
activation (§2), which makes him the only source of buffs that does not compete
with Voidreaver. But per rule 702.3 he can only hold one buff at a time, and
spending it for +4 removes it — so he is a self-contained threat, not an engine
piece. Do not waste a legend activation buffing him; he does it himself.
*In:* vs grindy midrange where a recurring 8-Might attacker matters. *Out:* the
one-of Onslaught.

**Abandon** (2E / 0P Chaos, Reaction) — *"Counter a spell. Return it to its owner's
hand instead of putting it in their trash."* Plus Predict.
A hard counter, unlike main-deck Hard Bargain's soft tax. The return-to-hand clause
is usually a drawback — but against Kennen, whose Rhasa gets cheaper per card in
their trash and whose Lightning Rush rebuys with Flow, **denying the trash is the
point**. Counter it and they do not get to fuel from it.
*In:* vs Kennen and any Flow/trash deck. *Out:* Rampage.

**Acceptable Losses** (1E / 0P Chaos, Action) — *"Each player kills one of their
gear."*
Symmetrical, and your main deck runs **zero gear** — so it is strictly one-sided
for you. Dead against everything that is not a gear deck.

**Do not board it in alongside Akshan.** They want the same matchup and they fight
each other: once Akshan has stolen a gear you *control* it, so Acceptable Losses
would force you to kill the thing you just took. Pick one — Akshan if you want the
gear, Acceptable Losses if you just want it gone and would rather spend 1 Energy
than 4 plus two Body Power.
*In:* vs Azir only. *Out:* Star-Crossed (the second copy).

**Hard Bargain #2** (2E / 0P Chaos, Reaction, Repeat 2E) and **Sabotage #3** (1E /
1P Body) — more interaction for the counterspell matchups. Sabotage is the better
of the two against Irelia, since it takes the Defy *proactively* rather than
racing it.
*In:* vs Irelia and Master Yi. *Out:* Zed (second copy) on the draw, where 5-drops
are too slow.

**Rebuke** (2E / **2P Chaos**, Action) — *"Return a unit at a battlefield to its
owner's hand."*
Subtraction per §4 — removing a body beats adding Might for the purpose of a clean
win. And per §9 its 2 Power makes it **structurally un-Defiable**, which is exactly
why it is the card you want against Irelia. Note it only hits units *at a
battlefield*, never at base.
*In:* vs Irelia, and vs any single oversized threat. *Out:* Hard Bargain.

**Switcheroo** (2E / **2P Chaos**, Hidden, Action) — *"Swap the Might of two units
at the same battlefield this turn."*
The answer to one threat too big to kill: swap their 7-Might bomb with your
1-Might Tentacle and the fight inverts. Also **un-Defiable** at 2 Power, and Hidden
means you can bank it for a rainbow and fire it for 0 Energy later. Both units must
be **at the same battlefield**, so set it up with Void Assault or Faefolk.
*In:* vs Azir, Kennen (Rhasa), and any deck with one oversized finisher.
*Out:* Sabotage (the second copy) where their threats are units, not spells.

**Unyielding Spirit** (1E / 1P Body, Reaction) — *"Prevent all spell and ability
damage this turn."*
Read it precisely: **spell and ability** damage, **not combat damage**. It does
nothing in a damage step and will not save a unit from a fight. It blanks a
burn/ping/direct-damage plan for a turn.
*In:* only vs decks that kill your units with spells rather than combat.
*Out:* Onslaught.

**Still to get: 3 cards, $19.88.** Two Void Assault (you own 1 of 3, $12.12) and one
Sett, Brawler for the board ($7.76). The Void Assaults are the urgent ones — it is
a 3-of for a reason and it is the card that manufactures the isolation Kha'Zix and
Rengar both want. Sett is a sideboard one-of and can wait.

## 14. What I'd test

The theme connecting the first two: §1 says the engine only pays on a clean combat
win, and §2 says the legend can only act in your own Main Phase. Both of those are
bottlenecks, and the format contains cards that route around them. All four below
are legal in Voidreaver's Body/Chaos identity — I checked.

**Grim Resolve** (2E Body, **Action**) — *"Give a friendly unit +3 Might this turn.
When it wins a combat this turn, gain 2 XP."* This is the most interesting card I
found that is not in the list. It is a Punch First that also **pays the engine**,
and because it is an Action it works in a showdown — so it generates XP at a speed
the legend itself structurally cannot (§2). Two XP is two turns of buffs. The cost
is that +3 is less than Punch First's +5 and it is Defy-legal at 2E/0P where Punch
First is not (§9). Worth trying over the third Stacked Deck.

**Demacian Diplomat** (2E Body) — *"When you play me, gain 1 XP."* XP with **no
combat requirement at all**, on a 2-drop body you want anyway. It directly answers
the deck's worst draw: the one where you never win an early fight and the legend
never switches on. Other Kha'Zix builds in the RQ data run it; JUN's current list
does not, which is a deliberate choice worth understanding before copying either
way.

**A second Kha'Zix.** One copy of a card that pays 2 XP in a deck with three Faefolk
and three Void Assault to manufacture the isolation looks light. The
counter-argument is that he is a 4-drop that is blank against wide boards — 35% of
the field.

**Forbidding Waste's symmetry.** It punishes lone defenders regardless of owner, and
this deck frequently leaves a single dragged unit somewhere. Worth tracking across a
league night whether it costs you more than it earns.

Also seen in other Kha'Zix lists and plausible here: **Qiyana, Victorious** (4E/1P
Body, Deflect, draws or channels on conquer) and **Illaoi** (6E Chaos, makes
Tentacles and grows with them, so it lines up with Up from the Deep).

## Sources and method

**Reading the rule citations.** `docs/rules-full.md` concatenates two separate
documents — Riot's Core Rules and its Tournament Rules — and **they number
independently**, so several numbers appear twice. Every unqualified "rule N" in
this dossier means the **Core Rules** entry. Six citations here collide with a
Tournament Rules entry of the same number (206, 414.5, 415.3.a, 702.3, 703, 705):
grep for 702.3 and you will find a penalty guideline for forgetting to score before
you find the buff-stacking rule. The quoted text in each case is the Core one.
Citations explicitly marked "Tournament Rules" (601.1.c, §13) mean the other
document.

Card text is `data/cards.json` with `data/errata.json` applied on read — 52 cards
are corrected across 70 printings, and three of them are in this deck (§12). Rules
citations are verified against `docs/rules-full.md` (Core Rules, 2026-07-16) and
`docs/rules-faq.md`; the amended No-Result wording in §1 and §3 is from the
Unleashed FAQ, which states it takes precedence over the Core Rules on points where
they differ.

Collection and deck state come from the live app state via `scripts/rift deck kha`.

Tier placement is riftbound.gg's editorial judgement (Tier 3, #2 of 49). Event
shares are from the Barcelona RQ standings. **Note that the local deck archive
covers North American and online events only** — every Regional Qualifier, Barcelona
and Utrecht included, sits in its `unresolvedClaimEvents` list, so `data/decks.json`
has no tournament Kha'Zix decks at all. That is a gap in the scrape, not a fact
about the format, and any claim in §8–§9 that rests on RQ data came from outside
this repo.

**External sources consulted.** Yomi's Place carries per-archetype RQ standings and
is the primary source for every figure in §8 — it is also the only one of these
sites that serves automated requests. From it: Singapore Top 64 shares and win
rates, the Kha'Zix cohort's combined 238-178-15, Barcelona Top 64 shares, and JUN's
own results (1st of 53 Kha'Zix pilots at Utrecht, 10-3-0; 1st of 79 at Barcelona,
10-2-1, 83% win rate, ~28th overall).
hextechanalytics and riftboundfrance both publish free Kha'Zix overviews; the former
independently flags the Main-Phase-only constraint that §2 now covers, and the
latter supplied the alternative-build cards in §14. riftbound.gg, Mobalytics and
riftDecks all refuse automated fetches (HTTP 403), so anything attributed to them
here came via search results rather than the pages themselves — treat those figures
as second-hand.

**Claims checked and corrected in review.** Four errors were found and fixed after
first draft, recorded here because they were all the same kind of mistake — reading
a card or rule at a glance instead of verbatim: the legend's abilities were
described as usable reactively (they cannot be, rule 381); Vex was described as
stunning only at her own battlefield (her trigger is board-wide); Punch First was
listed as Defy-able (its 2 Power puts it structurally out of range, rule 206); and
Rengar's Reaction timing at a battlefield where you control no units was asserted
as fact when the rules do not settle it. The card pools in §5 are now computed from
`data/cards.json` rather than recalled.

**This dossier deliberately does not reproduce JUN's guide.** The decklist is his,
published via Metafy on 2026-09-11; the analysis here is derived independently from
the cards, the rules, and public event data. Where you want his specific reasoning,
it belongs in his guide, not this file.
