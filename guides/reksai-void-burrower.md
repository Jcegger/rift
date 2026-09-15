---
title: Rek'Sai Void Burrower — Deck Dossier
subtitle: Riftbound, Vendetta season — revised after the 18 September bans
author: rift toolchain
date: 2026-09-15
---

**Legend:** Void Burrower (Fury/Order) · **Champion:** Rek'Sai, Breacher
**Registered:** 40 main (Champion included) + 12 runes (6 Fury / 6 Order) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39 — the Champion starts outside the deck (rule 103.2.a.1, §2)
**Collection status:** complete — 0 cards still to get, $0.00 gap
**Ban status:** **unaffected.** Neither card banned on 2026-09-18 is legal in Fury/Order (§8)
**List:** Kevplayer's Barcelona RQ registration, main deck matched card-for-card

## The short version

*Everything below is expanded later with the rules behind it. This page is the part
worth having at the table.*

**The one thing to unlearn first.** Void Burrower does **not** cheat cards into play.
Its text is *"banish one, then play it"* — not *"ignoring its cost."* You pay full
price for whatever you dig up. Void Rush at least knocks 2 Energy off; the legend
knocks off nothing. Almost every new pilot misplays this deck by revealing something
expensive and then having no Power left to actually cast it.

**The engine runs backwards from most decks.** You must **conquer first**, and only
then does the legend do anything. It is a reward for already being ahead, not a way
to get ahead. Before your first conquer, you are a pile of cheap Order bodies.

**What the legend costs.**

| | |
|---|---|
| Trigger | **When you conquer** — a triggered ability, so it works during combat |
| Cost | Exhaust the legend, paid to put the trigger on the chain |
| Effect | Reveal top 2, banish one and **play it at full cost**, recycle the rest |
| Frequency | Once per turn (it readies in your Awaken Phase) |
| On their turn? | Yes, if you take a battlefield you did not already control |

**Your turn, in order:** develop cheap bodies → set up the fight → win it → conquer →
*then* the reveal, with Power still unspent. Holding Power back through combat is the
whole skill of the deck. (§11)

**Three numbers worth memorising.**

- **Order Power is your scarce resource**, not Fury — weighted demand is Order 10 vs
  Fury 7 on a 6/6 base, and Undertitan ×3 plus Vanguard Captain ×2 all want it late.
- **Falling Star is your only Defy-proof spell** (2 Power puts it out of range). And
  under the revised Deflect rule it pays a Deflect tax **twice** if you point both
  halves at the same Deflect unit (rule 809.1.c).
- **26 of your 40 cards cost 2 Energy or less.** This is a curve-out deck that
  happens to have a top end, not a ramp deck.

**The free-est line in the deck:** Void Rush revealing Noxus Hopeful. Legion is
already on (you just played Void Rush), so Hopeful costs 4 − 2 − 2 = **0 Energy**.

**What to expect of yourself.** At Barcelona, 109 Rek'Sai pilots averaged 55.5% in
matches. Kevplayer — whose list this is — went 10-2-1 and first among all of them.
That gap is reps, not cards. (§8)

## 1. What this deck is

It is a *curve-out deck with a payoff engine bolted to the back*, and the two halves
want opposite things from your resources. That tension is the whole deck.

The front half is cheap and wide: twenty-one cards at 2 Energy, five at 1, a pile of
Order bodies that make tokens when they arrive and make more tokens when they die.
It wants to fill a battlefield early and take it.

The back half is Void Burrower, which reads *"When you conquer, you may exhaust me to
reveal the top 2 cards of your Main Deck. You may banish one, then play it. Recycle
the rest."* That is a real payoff — a free card off the top of your deck every turn
you take a battlefield — with one enormous caveat that the card does not spell out
and that most pilots miss:

> **You pay for what you play.** The errata'd text says *"banish one, then play it."*
> Compare the rules' own example of cost-free play in rule 355.10.a: *"You may play a
> unit from your hand, **ignoring its costs**."* Void Burrower has no such clause. The
> banish is bookkeeping — the FAQ says so explicitly, *"banishing the card ensures
> that the game has a place to put the card until it's actually played"* — not a
> discount.

So the engine only pays out if you finish combat with Energy and Power still in the
bank. A turn where you tap out to win the fight and then flip a 6-Energy Undertitan
you cannot cast is a turn where the legend did nothing.

**And the sequencing runs the wrong way round from instinct.** Most engines help you
get ahead. This one activates only *after* you conquer — it is a reward for already
having won something. Before your first conquer the legend is a blank card, which is
why the mulligan rules in §10 are about board, not about the top end.

## 2. The engine, and what it actually costs

**Void Burrower** is a **triggered** ability, and that distinction does more work than
it looks like.

Its cost sits inside the instruction — *"you may **exhaust me to** reveal"* — which
rule 383.3.b defines precisely: *"If a Triggered Ability contains a cost within
instructions at the beginning of the effect or immediately following the 'you may'…
that cost is treated as the base cost of the Triggered Ability."* And 383.3.b.1: the
cost must be paid to finalize the trigger onto the chain.

**Why "triggered" rather than "activated" matters.** Activated abilities are locked to
their controller's own turn and an Open State (rule 381) — that is the constraint that
governs a legend like Voidreaver. Triggered abilities have no such restriction: they
go on the chain whenever their condition is met (rule 383.3). Conquering happens in
the **Combat Cleanup** (rule 466.5.d), so Void Burrower fires *inside combat
resolution*, not in some later window.

It also means the legend can fire **on your opponent's turn** — if they attack a
battlefield you do not control, lose, and you are left as the only player with units
there, you Establish Control and that is a Conquer (466.5, 469.1). Rule 466.5.e says so
explicitly: *"This does not have to be the player that applied Contested to the
Battlefield."* The defender can conquer. It will then stay
exhausted until your own Awaken Phase (rule 315.1.b), so treat it as spending next
turn's trigger.

**The three real costs of using it.**

1. **The exhaust** — one trigger per turn cycle, no matter how many battlefields you
   take.
2. **The card's full cost** — Energy *and* Power, at the moment the trigger resolves,
   which is the middle of a combat you have just won and probably spent resources on.
3. **The other card** — *"Recycle the rest"* puts the card you did not take on the
   bottom of your deck. You do not draw it, you do not bank it.

**The practical consequence, which is the single most useful habit in the deck:**
**budget backwards from the reveal.** Before you commit to a fight, ask what you can
afford to flip. Two Energy spare means you can take a Carrion Dredger or a Honest
Broker. Four spare with an Order Power means Undertitan is live. Nothing spare means
you are conquering for the point only, and you should probably not exhaust the legend
at all — declining the trigger costs you nothing and keeps it ready.

### The Champion is free, and that is not obvious from the list

**One copy of Rek'Sai, Breacher is not a singleton.** It is your **Chosen Champion**,
and the rules put it outside the deck before the game starts:

> **103.2.** A Main Deck of at least 40 cards: A Chosen Champion Unit, as well as
> Units, Gear, and Spells
> **103.2.a.1.** This will be placed in the Champion Zone at the start of the game.
> **108.3.d.** The Chosen Champion can be played from here as normal, following the
> rules of Playing a Card.

Two consequences, and both matter more here than in most decks.

**You have Breacher in every game, from turn one, without drawing him.** A deck whose
engine only switches on after a conquer gets to treat its Accelerate enabler as a
guaranteed turn-three play rather than a card it hopes to see.

**Your library is 39, not 40.** Every consistency figure in this dossier is computed
against that number. It is also why the mulligan advice in §10 is about the *rest* of
the deck — the one card you would most like to guarantee is already guaranteed.

Note 103.2.a.3: any additional copy of the same card, anywhere, also counts as your
Chosen Champion for rules purposes. This list runs one, so it does not come up — but
it is why running a second would be redundancy rather than access.

---

**Rek'Sai, Breacher ×1** (3E / 3 Might, Fury) is the other half of the engine, and it
too is less free than it looks: *"Friendly units played from anywhere other than a
player's hand have [Accelerate]."* Accelerate is an **optional additional cost**, not
a free effect — rule 805.1.a is explicit, *"As you play me, you may pay [1][C] as an
additional cost. If you do, I enter ready."* And 805.1.a.1 pins the domain: the Power
must match one of the unit's own domains, so an Order unit flipped off the legend
wants **1 Energy and 1 Order Power** on top of its printed cost to arrive ready.

That is often worth it — a unit that enters ready can move and fight the same turn —
but it is a third line item on a turn that already has two. Breacher is a 3-Might
Assault body first and an enabler second.

## 3. How combat actually resolves

The fundamentals are the same in every Riftbound deck, so this is the short version;
what changes is which parts this deck exploits.

**Combat is never declared.** It happens in a Cleanup when the Chain is empty and a
Combat is staged at a Battlefield (rule 460), and a Combat is staged wherever
Contested was applied with units from opposing players present (rule 323.9). Moving is
what starts fights.

**There is no blocking.** Each side sums the Might of all its units and assigns that
total across the other side's units (rule 465.2.a–c). The attacker assigns first (rule
465.2.c), must assign lethal to a unit in full before moving on (465.2.c.3), and may
not overkill while other units remain (465.2.c.4).

**That no-overkill rule is why this deck plays tokens.** A 1-Might Recruit absorbs
exactly one point of their assignment and no more. Five bodies at a battlefield is not
five Might of padding, it is five separate lethal thresholds they must clear.

**You want to be the attacker, and this deck is built for it.** Assault is *"While I
am an attacker, I have +X Might"* (rule 807.1.c) — it does **nothing on defence**.
Blood Rush, Cleave, Inferna and Rek'Sai herself are all attack-only. Assault values
from multiple sources sum (807.2), and the rules use Cleave as the worked example.

**Winning versus conquering are different things.** You win a combat by being the only
player with units left (rule 466.3.a). You *conquer* by gaining Control of a
battlefield you have not yet scored this turn (rule 469.1) — and that is what the
legend keys off, not the win. Mostly they coincide. They come apart when you win a
fight at a battlefield you **already controlled**: that is a win with no conquer, so
no trigger. Taking a *new* battlefield is worth more to this deck than defending an
old one.

**Trifarian War Camp** (*"Units here have +1 Might. This includes attackers"*) makes it
your preferred place to fight, and **Forbidding Waste** (*"while a unit here is
defending alone, it has -2 Might"*) punishes exactly the lone defender you are trying
to run over — but it is symmetrical, so do not leave one of yours alone there.

### How often you actually win one

Put the assignment rules together and the condition collapses to arithmetic you can do
at the table. To kill all of their units you need **your total Might ≥ their total**;
they kill all of yours if **their damage total ≥ yours**. So you win outright exactly
when **your Might exceeds their damage total**.

Simulated against the real Might distributions of the archetypes in §9, with your board
built from *cards played* — units plus the tokens they bring — and attacking:

| | your 3 cards vs their 2 units | vs their 3 units | vs 3, **with Undertitan** |
|---|---|---|---|
| Kennen | 66% | 30% | **96%** |
| Master Yi | 69% | 36% | **99%** |
| Rengar | 78% | 40% | **100%** |
| **Azir** | 59% | **18%** | **100%** |
| Irelia | 83% | 54% | **100%** |
| Kha'Zix, Voidreaver | 72% | 36% | **99%** |

**Three things fall out, and they are the deck's whole strategy stated numerically.**

**You win by out-*carding* them, not by out-statting them.** Three cards against two of
their units is 59–83%. The same three cards against three units is 18–54%. Your units
are small; what wins is having more of them on the board, which is exactly what the
token-makers buy.

**Undertitan's anthem is the largest single swing in the deck** — *"give your other
units +2 Might this turn"* takes an even board from roughly a third to essentially
certain. §4's advice to budget the reveal is really advice to budget for *this card*.
It is also why revealing it with no Order Power available is the most expensive misplay
available to you.

**Getting there a turn late is fatal.** From a two-card board rather than three, the
same fights read 21–52% against two units and **3–23% against three**. This is the
arithmetic behind §10's insistence on early bodies.

**Might delivered per card**, which printed stats understate badly:

| Card | Bodies | Total Might |
|---|---|---|
| **Vanguard Captain** (Legion) | **3** | **5** |
| **Faithful Manufactor** | **2** | **3** |
| Noxus Hopeful | 1 | 4 |
| Vi, Peacekeeper | 1 | 5 |
| Rek'Sai, Breacher | 1 | 3 (+1 attacking) |
| Honest Broker / Noxian Emissary | 1 | 2 |
| Inferna | 1 | 1 (+2 attacking) |
| Carrion Dredger | 1 | 1 |

A Legion'd Vanguard Captain is three lethal thresholds and five Might for three Energy.
That is the best rate in the deck and the reason §11 opens with "play a cheap card
first."

*Modelling note: this ignores Blood Rush, Cleave and Hidden Blade, so treat every figure
as a floor for a hand that also has a trick. Vi's stun is worth about ten points on its
own — real, but not a substitute for bodies.*

## 4. The reveal economy: what you can actually afford

Because you pay full price, the reveal is a budgeting problem. Here is the whole deck
priced for a Void Rush (which reduces Energy cost by 2) — the legend gives no discount
at all, so add 2 Energy back for those.

| Revealed | Printed | Via Void Rush | Notes |
|---|---|---|---|
| **Noxus Hopeful** | 4E | **0E** | Legion is already on — see below |
| **Undertitan** | 6E / 1 Order | 4E / 1 Order | but refunds 2E on reveal — net **2E / 1 Order** |
| Vi, Peacekeeper | 5E / 1 Order | 3E / 1 Order | Ambush, stuns on attack |
| Rage Amplifier | 4E / 1 Fury | 2E / 1 Fury | anthem, +1 Might to everything |
| Vanguard Captain | 3E / 1 Order | 1E / 1 Order | two Recruits with Legion on |
| Rek'Sai, Breacher | 3E | 1E | |

**The best line in the deck: Void Rush into Noxus Hopeful.** Legion is *"If you have
played another card this turn, this card gains [Text]"* (rule 812.1.b.1), and you have
just played Void Rush, so Hopeful's *"I cost 2 Energy less"* is live. Four Energy,
minus 2 for Legion, minus 2 for Void Rush, is **zero** — and it really is zero, because
neither discount states a minimum and rule 356.6 floors costs at 0, not at 1. A free 4-Might body, and a
single card played earlier in the turn switches on every Legion ability you control
(rule 812.2).

**The other one worth knowing: Undertitan pays for itself.** *"As I'm revealed from
your deck, [Add] 2 Energy."* The Add happens on the reveal, before you decide whether
to banish and play it — so the 2 Energy is in your Rune Pool either way. Off a Void
Rush that is 6 − 2 (Void Rush) − 2 (its own refund) = **2 Energy and one Order Power**
for a 5-Might body that gives *your other units +2 Might this turn*. That is the
deck's biggest single tempo swing, and it is why you want the tokens on the board
*before* it lands, not after.

Adding resources is immediate and uninterruptible — rule 429.2.a: *"Priority and Focus
will not pass from Add abilities being finalized or resolving."*

**What you do not want to flip** is a situational spell with nothing to point at.
Cull the Weak with no spare token, Hidden Blade with no target, Falling Star with 2
Fury Power you have already spent. When the top two are both dead cards, take neither
and let both recycle — declining is always legal, and the exhaust is only paid if you
choose to trigger.

## 5. Card by card — the main deck

### The legend and the champion

**Void Burrower ×1.** Covered in §2. The habit: decide *before* the fight what you can
afford to flip, and decline the trigger when the answer is nothing.

**Rek'Sai, Breacher ×1** (3E / 3 Might, Fury, Accelerate, Assault) — *"Friendly units
played from anywhere other than a player's hand have [Accelerate]."*

Also §2. Note the grant covers units played from **anywhere but hand** — off the
legend, off Void Rush, and out of the trash if anything put them there. Accelerate
still costs 1 Energy plus a Power matching the unit's domain (rule 805.1.a.1), and it
is a replacement effect, so the unit never enters exhausted at all — it *"does not
enter exhausted and then become ready"* (805.6). That also means it will not trigger
anything that keys off units becoming ready (805.6.a).

**The other legal champion.** Void Burrower's tag admits **Rek'Sai, Swarm Queen** (5E /
1 Order / 5 Might) — *"When I attack, you may reveal the top 2 cards of your Main Deck.
You may banish one, then play it. If it is a unit, you may play it here."* That is a
second copy of the legend's effect on a body, triggering on **attack** rather than
conquer — it does not require you to win first, and it can deploy the unit **directly
to the contested battlefield**. It is slower (5E versus 3E) and it is Order rather than
Fury. Breacher is the correct pick for a curve-out list like this one; Swarm Queen is
what you would move to if you rebuilt the deck around a grindier midgame.

### Units — the Deathknell core (9 cards)

These are the reason the deck functions. All three are 2-Energy Order bodies that pay
you when they die, which turns your own removal and your own bad combats into value.

**Carrion Dredger ×3** (2E / 1 Might, Order) — *"[Deathknell] Play a 1 Might Bird unit
token with [Deflect] to your base."*

A 1-Might body that replaces itself with a 1-Might body when it dies — except the
replacement has **Deflect**, meaning *"spells and abilities an opponent controls that
choose me cost an amount of Power equal to [1] more… for each time they choose me"*
(rule 809.1.c). Your opponent must pay extra to remove a token. That is an
extraordinarily annoying card to play against, and it is the best thing to feed to
Cull the Weak.

**Honest Broker ×3** (2E / 2 Might, Order) — *"[Deathknell] Play a Gold gear token
exhausted."*

A Gold gear token is *"a domainless gear token with '[Reaction] Kill this, {exhaust}:
[Add] 1 rainbow Power'"* (rule 187.5). Read the word **exhausted** carefully: the token
enters exhausted, and an exhausted token cannot pay its own exhaust cost. It readies in
your next Awaken Phase (rule 415.3.a). So **a Gold token made this turn is next turn's
Power**, never this turn's — which matters enormously in a deck where the reveal is a
Power problem (§4). A Broker that dies on turn four fixes your turn-five Undertitan.

**Noxian Emissary ×3** (2E / 2 Might, Order, Empower 1E + Order) —
*"[Empowered][Deathknell] Play two 1 Might Recruit unit tokens to your base."*

**The Deathknell only works if you have Empowered it first.** Empowered is a dependent
keyword — *"While I have the Empowered status, this card gains '[Text]'"* (rule
828.1.b.1) — so an un-Empowered Emissary that dies gives you nothing at all. Paying the
1 Energy and an Order Power is a real cost on a curve this tight, and it is easy to
forget until the moment the body dies for free. Empower it on a turn you have a spare
Energy, not on the turn you need it.

Two bodies from one death is the best Deathknell in the deck when it is switched on.

### Units — the token engine

**Faithful Manufactor ×3** (3E / 2 Might, Order) — *"When you play me, play a 1 Might
Recruit unit token here."*

Two bodies for one card, and note **here** — the token arrives wherever the Manufactor
does, so playing it at a battlefield gives you two units at that battlefield
immediately. Four Might across two bodies for 3 Energy is the widest cheap play you
have, and width is what the no-overkill rule rewards (§3).

**Vanguard Captain ×2** (3E / 1 Order / 3 Might, Order) — *"[Legion] When you play me,
play two 1 Might Recruit unit tokens here."*

Three bodies and 5 Might for 3 Energy and a Power — but only with Legion active, so
**play something else first**, even a 1-Energy Blood Rush. Without Legion it is a
vanilla 3-Might unit and a wasted turn. The single most common sequencing error in the
deck is leading on Vanguard Captain.

### Units — the beef

**Noxus Hopeful ×3** (4E / 4 Might, Fury) — *"[Legion] I cost 2 Energy less."*

A 2-Energy 4-Might unit in practice, which is above rate, and free off a Void Rush
(§4). Same discipline as the Captain: play any other card first. There is no Power in
its cost at all, which makes it the easiest thing to jam on a turn your Order Power is
committed.

**Undertitan ×3** (6E / 1 Order / 5 Might, Order) — *"When you play me, give your other
units +2 Might this turn."* and *"As I'm revealed from your deck, [Add] 2 Energy."*

The top end and the payoff. Six Energy is a lot in a deck whose curve tops out at
three otherwise, which is why three copies looks strange until you notice the reveal
clause — it is the card you most want to flip, and flipping it partially pays for it
(§4). The anthem is *this turn* and it hits *your other units*, so its value is a
direct function of how many bodies you already have. With four Recruits out that is
+8 Might spread across the board for the price of one card.

Hard-cast it only when the turn does something; otherwise it is a 5-Might body for six.

**Inferna ×2** (2E / 1 Might, Fury, Ambush, Assault 2) — a 1-Might body that hits for 3
as an attacker, arriving at Reaction speed via Ambush (*"I may be played to a
battlefield where you control Units"*, rule 822.1.b). Cheap, and the Ambush means it
can appear after they have committed to a combat's arithmetic.

**Vi, Peacekeeper ×1** (5E / 1 Order / 5 Might, Order, Ambush) — *"When I attack,
[Stun] an enemy unit here."*

Your only stun, and it is attached to a 5-Might Ambush body. A stunned unit *"does not
contribute its might to damage in the combat damage step"* (rule 423.1.b) but still
requires its full Might in damage to die (423.1.c). Flashing Vi in during a showdown
both adds 5 Might to your side and subtracts their best unit's Might from theirs — a
ten-point swing on a 5-Might target, which is usually the whole fight.

### Spells

**Void Rush ×3** (2E / 1 Power, Fury/Order) — *"Reveal the top 2 cards of your Main
Deck. You may banish one, then play it, reducing its cost by 2 Energy. Draw any you
didn't banish."*

The legend's effect on a card, available without conquering, and **strictly better than
the legend in one respect**: the card you do not take is *drawn*, not recycled. So Void
Rush is never a blank — worst case it is a 2-Energy "draw 2, then you may play one of
them cheaply."

This is the card that makes the deck consistent, and the reason there are three. See §4
for what to hit.

**Falling Star ×3** (2E / **2 Fury Power**) — *"Deal 3 to a unit. Deal 3 to a unit."*

Your removal, and the most rules-dense card in the deck.

The errata split it into two separate instructions (§12), and the Game Director's note
explains the intent: *"you pick all the targets up front, the other player can react
before any of it resolves, and then each of the units affected take the damage."* Six
damage split however you like, or both halves at one 6-Might target.

**Two consequences.** Its 2 Power makes it **the only spell in your deck Defy cannot
counter** (§9). And against Deflect, pointing both halves at the same unit pays the tax
**twice** — rule 809.1.c was itself errata'd to read *"for each time they choose me."*
Against a Deflect target, splitting the damage across two units costs you less than
doubling up on one.

**Cull the Weak ×3** (2E / 1 Order) — *"Each player kills one of their units."*

Symmetrical on paper, extremely one-sided in this deck. You have nine Deathknell
bodies and a stream of 1-Might tokens; they usually do not. Kill a spare Recruit and
the spell is pure removal for 2 Energy. Kill a Carrion Dredger and you *upgrade* it
into a Deflect Bird. Kill an Empowered Noxian Emissary and you net a body.

Note rule 808.1.d.1: a Deathknell will not trigger if the permanent is not actually
sent to the trash — if its death gets replaced by a recall, the trigger comes off the
chain.

It is also your answer to things you cannot kill with damage, and the reason is worth
knowing precisely: **it does not target.** Rule 355.10.e excludes from targeting
anything *"part of a set of objects chosen in whole or in part by other players"* and
gives as its example a card templated almost identically to this one — *"'Each player
kills a unit they control' does not target. Each player, including the one who played
the spell, chooses a unit to kill as the spell or ability resolves."*

So Deflect does not tax it, "can't be chosen" does not stop it, and Might is irrelevant.
The flip side is that **the opponent picks their own casualty**, so it is a poor answer
to one specific threat and an excellent answer to a board where everything is scary.

**Blood Rush ×3** (1E, Fury, Action, Repeat 1E) — *"Give a unit [Assault 2] this turn."*
**Cleave ×2** (1E, Fury, Action) — *"Give a unit [Assault 3] this turn."*

Your combat tricks, both Actions so both live in showdowns, and both **attack-only**
(rule 807.1.c). Assault values sum (807.2), so Blood Rush with Repeat paid is Assault 4
on one unit for 2 Energy, and the rules' own example is Cleave stacking with a unit's
printed Assault.

The errata added *"this turn"* to Blood Rush (§12) — it was never permanent, but the
printed card did not say so.

**Hidden Blade ×1** (2E / 1 Order, Hidden, Action) — *"Kill a unit at a battlefield.
Its controller draws 2."*

Unconditional removal with a real drawback: they draw two cards. It is your answer to
the one threat that must die *right now* regardless of Might. Hidden lets you bank it
for a rainbow Power and fire it later for 0 Energy as a Reaction; note that a card
played from Hidden usually has to choose targets at the battlefield it was hidden at
(rule 811.1.d.2).

One copy is correct — the card-draw clause means you do not want to be casting it
twice a game.

### Gear

**Rage Amplifier ×1** (4E / 1 Fury, Gear, Empower 6E + Fury) — *"Your units have +1
Might. If I'm [Empowered], they have +2 Might instead."*

An anthem in a deck that goes wide, which is the correct place for one. +1 Might on
eight bodies is +8 Might. The Empower cost of 6 Energy and a Fury Power is a
late-game-only luxury and you will rarely pay it; treat the card as a 4-Energy +1
anthem that occasionally gets better.

One copy because it is dead when you are behind on board — it multiplies units you
already have rather than making any.

### The runes (12) — 6 Fury / 6 Order

Exactly twelve, because rule 161.2.a requires *"Exactly 12 Rune cards chosen during
Deck Construction."* Each carries the same two abilities (rule 164.2): **{exhaust}:
Add 1 Energy**, and **Recycle this: Add 1 Power** of that rune's domain (164.2.b.1).
Both are Reactions, so your runes always operate at Reaction speed. You channel 2 per
turn (rule 315.3.b).

**Order is the tight domain here**, and by a clear margin:

| Domain | Weighted Power demand | Runes |
|---|---|---|
| **Order** | **10** | 6 |
| Fury | 7 | 6 |
| Either (Void Rush ×3) | 3 | — |

Order pays for Undertitan ×3, Cull the Weak ×3, Vanguard Captain ×2, Vi and Hidden
Blade — and Accelerate on any Order unit you flip (§2). Fury's demand is concentrated
almost entirely in Falling Star ×3 at 2 Power each, which is 6 of its 7.

The practical habit: **Fury Power comes in lumps, Order Power comes in a steady
trickle.** On a turn you want to hold up Falling Star you need two Fury specifically,
and on a turn you want to conquer into an Undertitan reveal you need one Order kept
clear through the whole combat. Those are different plans; pick one before you move.

### The battlefields

**Trifarian War Camp ×1** — *"Units here have +1 Might. (This includes attackers.)"*
Symmetrical but you go wider, so it favours you. With five bodies here that is +5
Might. Your preferred battleground.

**Forbidding Waste ×1** — *"While a unit here is defending alone, it has -2 Might."*
Punishes the lone defender, which is usually the position you are attacking into. Also
symmetrical — never leave a single unit of yours defending here.

**The Candlelit Sanctum ×1** — *"When you conquer here, look at the top two cards of
your Main Deck. You may recycle one or both of them. Put those you don't back in any
order."*

Deck manipulation stapled to the exact trigger your legend cares about, and the most
valuable battlefield in the deck for that reason alone. Even used on its own it is
strong: bury two cards you do not want, or leave an Undertitan on top for next turn's
reveal.

**The tempting line, and the honest caveat.** Both this and Void Burrower trigger on the
same conquer, so it is natural to want to sculpt with the Sanctum *first* and then flip
with the legend into a stacked deck. Whether you can actually sequence them that way is
**not something the Core Rules settle.** Resolution runs newest-first (rule 340.4 gives
priority to *"the controller of the newest item on the chain"*), so the order they go on
the chain decides it — but the only rule that explicitly hands a player that choice is
808.2.a, and it covers multiple Deathknell instances on a single permanent, not two
triggers from different sources.

So: if you can order them, put Void Burrower on the chain first and the Sanctum second,
and the Sanctum resolves first. **Ask a judge before relying on it in a tournament.**
The battlefield is worth prioritising either way — it just may be setting up next turn's
reveal rather than this turn's.

## 6. Deathknell, tokens, and why your units want to die

Worth its own section, because it inverts a normal instinct.

**You have nine units that pay you for dying** (Carrion Dredger ×3, Honest Broker ×3,
Noxian Emissary ×3) and **five cards that make tokens** (those plus Faithful Manufactor
and Vanguard Captain). Deathknell is simply *"When I die, [Effect]"* (rule 808.1.c),
and each instance triggers separately (808.2).

The consequences worth internalising:

- **Losing a combat is not a disaster** the way it is for most decks. A fight that
  kills three of your 2-drops hands you a Deflect Bird, a Gold gear, and two Recruits.
- **Cull the Weak is one-sided** whenever you have a spare token or a Dredger.
- **Chump-blocking has no real cost.** Adding a 1-Might Recruit to a fight you will
  lose still taxes one point off their damage assignment (§3) and may hand you value.
- **Your Gold gear tokens are next turn's Power** (§5, Honest Broker), which is the
  most reliable way to reach Undertitan's Order Power on time.

The failure mode is the opposite one: **holding back Deathknell bodies to keep them
alive**. They are worth more dead than idle. Send them in.

## 7. Keywords, precisely

| Keyword | What it does | The detail that catches people |
|---|---|---|
| **Accelerate** (805) | Optional additional cost 1E + 1 Power: enter ready | Power must match the unit's own domain (805.1.a.1); it is a replacement, so it never enters exhausted (805.6) |
| **Assault** (807) | +X Might **while attacking** | Nothing on defence; multiple sources sum (807.2) |
| **Deathknell** (808) | "When I die, [Effect]" | Will not trigger if the death is replaced and it never reaches the trash (808.1.d.1) |
| **Legion** (812) | "If you've played another card this turn…" | *Any* other card switches on *every* Legion ability you control (812.2) |
| **Empower / Empowered** (827/828) | Pay a cost to flip a permanent to Empowered | Noxian Emissary's Deathknell is **off** until you pay |
| **Deflect** (809) | Opponents pay extra Power to choose it | Taxed **per choice**, so Falling Star doubling up pays twice (809.1.c) |
| **Ambush** (822) | Play to a battlefield where you control units; has Reaction while doing so | Permission is void if no units remain there at Finalization (822.3) |
| **Hidden** (811) | Hide for a rainbow; later a 0-Energy Reaction | Targets usually confined to the battlefield it was hidden at (811.1.d.2) |
| **Add** (429) | Put resources in your Rune Pool | Resolves immediately; priority does not pass (429.2.a) |

## 8. What the format actually plays

Two Regional Qualifiers frame the format. **Singapore (4–6 Sep 2026, 2,055 players)**
is the more recent; **Barcelona (21–23 Aug 2026, 2,130+ players)** is where this list
was registered. Both tables are Top 64.

| Legend | Singapore share | Barcelona share |
|---|---|---|
| **Kennen, Heart of the Tempest** | **34.4%** (72.8% WR) | 28.1% (72.1% WR) |
| Master Yi, Wuju Bladesman | 9.4% | 12.5% (68.3% WR) |
| Rengar, Pridestalker | 9.4% | 7.8% (69.6% WR) |
| Irelia, Blade Dancer | — | 12.5% (68.4% WR) |
| **Rek'Sai, Void Burrower** | **4.7%** (71.9% WR) | 4.7% (66.3% WR) |

**Kennen was the format.** More than a third of the top tables, at a 72%+ win rate
across both events. That was true when this list was registered, and it is the single
thing the September ban changed.

### What the 18 September ban did to this deck: nothing, which is the point

Stacked Deck and Ekko, Recurrent were banned effective 2026-09-18. **Neither is legal
in Fury/Order**, so this list does not change by a single card. What changes is who
you are playing against.

Measured across the 424-deck archive, by the domains in each legend's identity:

| Domain | Decks running a now-banned card |
|---|---|
| **Chaos** | **59%** |
| Mind | 20% |
| Fury | 19% |
| Body | 13% |
| Calm | 9% |
| **Order** | **9%** |

Stacked Deck was a Chaos card. Ekko is Mind. **You are the only pairing on that table
that is cheap on both axes.** Checking the archetype directly: of the nine Void
Burrower decks in the archive, exactly two run any banned card at all, and in both
cases it is **The Arena's Greatest** — a Colorless battlefield banned back in July,
nothing to do with this wave.

By legend, against the decks in §9:

| Their legend | Domains | % of decks hit | avg copies |
|---|---|---|---|
| **Kennen** | Order/**Chaos** | **89%** | 3.0 |
| Kha'Zix, Voidreaver | Body/**Chaos** | 80% | 2.9 |
| **Irelia** | Calm/**Chaos** | **69%** | 2.2 |
| Master Yi | Calm/Body | **0%** | — |
| Rengar | Fury/Body | **0%** | — |
| Azir | Calm/Order | **0%** | — |
| **You** | Fury/Order | **0%** | — |

**One caveat before you celebrate.** Kennen keeps **Lightning Rush** — 1 Energy, look
at the top 3, draw 1 — which is Order/Chaos and survived. It did not lose its engine,
it lost redundancy, going from six diggers to three. Expect its share to fall and its
win rate to soften, not to disappear.

**What that means at the table.** Projecting the Singapore shares forward by ban
exposure: Kennen down to roughly 24% and still the most common deck; Master Yi to
~13%, Rengar to ~12%, Azir and you to ~7% each. **Sideboard for Kennen first still** —
but the decks gaining on you are the wide Body ones in §9, not the Chaos ones, and
that shifts which of your cards are live.

The honest summary is that **this deck's position improved without the deck changing.**
§8's read below — that the archetype is average and shrinking — was measured before the
ban. The shrinking half is the part most likely to have reversed.

**But be careful with that 71.9%.** It is the win rate of the three Rek'Sai decks that
*made* the Top 64 — survivorship, not a read on the archetype. The honest number is the
full cohort:

| Event | Rek'Sai pilots | Cohort match WR | Cohort game WR |
|---|---|---|---|
| Barcelona | **109** | 55.5% (452-362) | 52.5% |
| Singapore | **69** | 53.9% (268-229-11) | 50.7% |

Two things fall out. **The archetype is average** — a coin flip plus a few points, not
a tier-one deck. And **it is shrinking**: 109 pilots to 69 across three weeks, with the
win rate drifting down with it.

Against that, **Kevplayer finished first of all 109 Rek'Sai pilots at Barcelona** —
10-2-1, 31 points, Elo 1633, a 68.8% game win rate against a cohort average of 52.5%,
and a median opponent on 12 points. He placed 50th overall.

You are holding his exact 40. The 16-point gap between his game win rate and the
cohort's is the part that does not come in the box.

## 9. Matchups

A caveat: the local deck archive is North-American-and-online only, so the archetype
card lists below come from it while shares and win rates come from the RQ standings
(§8).

**Read the percentages in these headings as history, not as forecast.** They are what
actually happened at Singapore, which is solid data — but Singapore was played before
the 18 September ban. The post-ban projections in §8 are a model, and I have left the
measured numbers in place rather than overwrite good data with an estimate.

**The direction of travel, applied to this section:** Kennen (~34% → ~24%) and Irelia
(69% ban exposure) get less common; Master Yi, Rengar and Azir get more common at zero
exposure. **So weight your practice toward the three sections below that did not lose a
card.** One card list below is now stale in a useful way: Kennen's core still shows
Stacked Deck, which they can no longer play — expect a third digger rather than six,
and a deck that stumbles more often than these notes assume.

### Kennen, Heart of the Tempest — 34.4% of the Singapore Top 64

Their core: Lightning Rush, Ride the Wind, Stacked Deck, Traveling Merchant, Nocturne
Horrifying, Rhasa the Sunderer, Star-Crossed, Kennen Storm of Shuriken, Minefield.

A self-milling tempo deck that plays from its own trash — Rhasa costs 1 less per card
in their trash, Minefield fills it, Lightning Rush digs and rebuys with Flow.

**The good news:** they go wide with small units, and your board goes wider. Cull the
Weak is excellent, Falling Star's six damage split across two of their bodies is a
clean two-for-one, and your Deathknell core means their removal does not generate the
tempo it usually does.

**The bad news:** Ride the Wind (*move a friendly unit and ready it*) at Action speed
means a battlefield you thought was safe is not, and your conquer — and therefore your
whole engine — can be denied at the last moment. Do not exhaust the legend
speculatively; wait until Control is actually established.

Rhasa at 6 Might needs both halves of a Falling Star or a Hidden Blade.

### Irelia, Blade Dancer — 12.5% at Barcelona, absent from Singapore's top tier

Their core: Stellacorn Herder, Boots of Swiftness, Defy, Discipline, Ride the Wind,
Defiant Dance, Charm.

The counterspell matchup. **Defy** counters a spell costing no more than 4 Energy and
no more than one rainbow Power — which is every spell you play **except Falling Star**,
whose 2 Fury Power puts it structurally out of range (rule 206 makes this about printed
cost, so no discount changes it either way).

That single fact shapes the matchup: **Falling Star is your uncounterable removal, and
Void Rush is your most Defy-vulnerable card.** Bait with Void Rush or a Cull the Weak
before committing to the turn that matters.

Charm (*move an enemy unit*) drags a body out of a battlefield you were about to
conquer — again, the conquer is the thing they can deny.

### Master Yi, Wuju Bladesman — 9.4%

Their core: Charm, Defy, Discipline, First Mate, En Garde, Sabotage, Punch First,
Scuttle Crab, Pit Rookie, Ruin Runner, Emperor's Dais.

A cheap wide aggro-tempo deck that wants the same thing you do — the early board — and
gets there a turn faster. This is the matchup where **Trifarian War Camp** and the
token-makers matter most, and where Undertitan's anthem turn usually decides it.

They run Punch First (+5 at Action speed), so a fight you have calculated as won by 2
is not won. Hold Blood Rush rather than spending it early.

### Rengar, Pridestalker — 9.4%

Their core: Noxus Hopeful, Kai'Sa Survivor, First Mate, Pit Rookie, Sabotage, Punch
First, Inferna, Grim Apothecary, Kinkou Initiate, Irresistible Faefolk — note they play
**your** Noxus Hopeful and Inferna. A grindier mirror of your own front half; the
Deathknell core and the legend are what break the symmetry, so protect the conquer.

### Azir, Emperor of the Sands — 4.7%

Their core: Discipline, Hidden Blade, Brutalizer, Guards!, B.F. Sword, Deathgrip, Azir
Sovereign, Arise!, Trifarian War Camp.

Gear-heavy, which is the matchup **Brittle Steel** (*kill a gear*, with Flow to rebuy)
comes in for — two copies, and the Flow means each is effectively two uses.

## 10. Mulligans

**The failure mode is a hand with no early board**, because the legend does nothing
until you conquer and you cannot conquer without units. Everything else is secondary.

**The test, in one question:** *can I contest a battlefield on turn two and take one by
turn three or four?* Not "do I have good cards" — this deck's good cards are all
downstream of a board.

**Keep:** any two 2-drops. With twenty-one cards at 2 Energy and five at 1, a hand
without two of them has actively mulliganed itself.

**And unlike most decks, that keep is easy.** Your opening hand is 4 cards (rule 116)
from a 39-card library, with one mulligan that swaps up to 2 (117.1). Against that:

| | in the opening 4 | after the mulligan |
|---|---|---|
| **Two or more cards at 2 Energy or less** | **90.1%** | **98.9%** |
| Two or more 2-Energy *units* specifically | 31.3% | 55.3% |
| Two or more Undertitan (the auto-ship) | **2.3%** | — |

**This is the deck's quiet structural advantage.** Twenty-six of forty cards cost two
or less, so the hand you need turns up nine times in ten before you have even
mulliganed. Compare a toolbox deck built on singletons, where the equivalent keep sits
near 10%. You are not fighting your opening hand; you are fighting the board.

Read the second row carefully though. Two *cards* at 2 Energy is nearly automatic; two
2-Energy **units** is barely a coin flip, because eleven of those twenty-one are
spells. A hand of two 2-drop spells and no body is not the keep this rule means.

And the auto-ship is genuinely rare — you will see a double Undertitan opener about
once in forty-three games. Do not build your mulligan habits around it.

**Keep:** Faithful Manufactor or Vanguard Captain plus a 1-Energy spell. The spell
turns the Captain on (Legion) and the Manufactor is two bodies by itself.

**Keep:** Void Rush plus anything. It is never dead — worst case it draws you two
cards (§5).

**Ship:** hands with Undertitan and no 2-drop. Six Energy is turn five at the earliest
and you will not be alive on board to use it. Two Undertitans is an automatic mulligan.

**Ship:** three or more spells and one unit. Blood Rush and Cleave modify combats you
have to be in; Falling Star and Cull the Weak answer a board you have to survive to
see.

**On the play, prioritise width; on the draw, prioritise removal.** On the draw you are
a turn behind on the board race that decides this matchup set, so the hands that work
are the ones that trade rather than the ones that develop.

**Rage Amplifier is not a keep.** It multiplies a board you do not have yet.

## 11. Sequencing — how your turn actually goes

**Before your Main Phase, three things happen on their own:** you ready everything in
the **Awaken Phase** (rule 315.1.b) — the legend included; you **Hold** every
battlefield you control in the Beginning Phase Scoring Step for a point each (rule
315.2.b.2); then you channel 2 runes and draw 1 (315.3.b, 315.4.b).

**Then the Main Phase, in this order:**

**Step 1 — Play a cheap card first, always.** Legion checks whether you have played
*another card this turn* (rule 812.1.c), and one card switches on every Legion ability
you control (812.2). Leading a 1-Energy Blood Rush before a Vanguard Captain is the
difference between three bodies and one. This is the single most common misplay in the
deck.

**Step 2 — Develop wide before you develop big.** Tokens first, because Undertitan's
anthem and Rage Amplifier both multiply bodies you already have, and because width is
what the no-overkill rule rewards (§3).

**Step 3 — Budget the reveal before you commit to the fight.** Work out what you will
have left after the combat, and therefore what you can actually afford to flip (§4).
Two Energy spare is a 2-drop. Four plus an Order Power is Undertitan. Nothing spare
means do not exhaust the legend at all.

**Step 4 — Arrange, then move.** Moving is what starts combat (rules 460, 323.9), so it
is the trigger, not the setup. Prefer **The Candlelit Sanctum** when you have a choice,
because conquering there lets you sculpt what the legend is about to reveal (§5).

**Step 5 — Hold your Actions through the showdown.** Blood Rush, Cleave and Hidden
Blade are Actions; Inferna and Vi arrive at Reaction speed via Ambush. Assault does
nothing on defence (rule 807.1.c), so these are cards for fights you start.

**Step 6 — Conquer, then decide on the trigger.** The legend fires on the conquer, in
the Combat Cleanup. Declining is free and keeps it ready.

**The one-line version:** *cheap card first, go wide, budget the reveal, arrange, move,
hold your Actions, then flip.*

**The most common way to lose with this deck** is to spend everything winning the fight
and have nothing left when the engine finally turns on. The conquer is not the end of
the turn — it is the middle.

## 12. Errata that change your cards

Four cards here no longer read as printed. `data/cards.json` carries the printed text;
`data/errata.json` carries the corrections.

**Void Burrower — the legend.** Printed: *"You may play one. Then recycle the rest."*
Current: *"You may **banish** one, then play it. Recycle the rest."* The Spiritforged
FAQ explains it as bookkeeping — *"banishing the card ensures that the game has a place
to put the card until it's actually played, and a place to send the card back to if it
can't be played"* — and notes it works the same 99% of the time. It does **not** make
the card free; see §1.

**Void Rush.** The same banish-then-play rewording, and *"Draw any you did not play
this way"* became *"Draw any you didn't banish."* A small but real difference: you draw
what you did not **banish**, so if you banish a card and then cannot pay for it, you do
not get to draw it instead.

**Falling Star.** Printed: *"Do this twice: Deal 3 to a unit."* Current: *"Deal 3 to a
unit. Deal 3 to a unit."* This reverses an earlier Origins change that had made it a
reflexive trigger. The Game Director's note is unusually direct — *"This was a mistake,
and we shouldn't have done this"* — and the practical effect is that you now **pick both
targets up front**, they respond once, and both hits resolve together.

**Blood Rush.** *"Give a unit [Assault 2]"* became *"Give a unit [Assault 2] **this
turn**."* Clarification rather than a change, but worth knowing the pump was never
permanent.

**And one errata to the rules themselves.** The same FAQ revised the Deflect rule so
the tax is paid *"for each time they choose me"* rather than once per spell. That
revision has since been absorbed into the current Core Rules at **809.1.c** — so cite
809.1.c, not the historical rule number the FAQ names, which has been renumbered since.
It matters here because Falling Star now chooses twice (§5).

## 13. The sideboard

Ten of ten, at the legal maximum — Tournament Rules 601.1.c raised the cap from 8 to 10
on 2026-07-24. Main-deck card types only, and the three-copy limit spans main deck and
sideboard together.

This is Kevplayer's registered board, and you own every card in it.

**Forge of the Future ×3** (2E, Order, Gear) — *"When you play this, play a 1 Might
Recruit unit token at your base. Kill this: Recycle up to 4 cards from trashes."*
A body plus trash disruption attached to it, and three copies signals what he expected to
face. *"Recycle up to 4 cards from trashes"* is plural and **includes theirs** — this is
the anti-Kennen card, aimed squarely at Rhasa's cost reduction and Lightning Rush's
Flow rebuy.
*In:* vs Kennen and any trash-fuelled deck. *Out:* Rage Amplifier, and a Cleave.

**Kennen, Keeper of Balance ×2** (3E / 2 Might, Order, Hidden) — *"When you play me or
I attack, you may pay 2 Energy to [Stun] a unit. While there's a stunned enemy unit
here, I have +2 Might."*
A repeatable stun on a body, which is the effect this deck otherwise has exactly one of
(Vi). Hidden means you can bank it and deploy for 0 Energy later.
*In:* vs decks with one oversized threat, and vs Master Yi where stunning their best
attacker decides fights. *Out:* Inferna ×2.

**Brittle Steel ×2** (2E / 1 Fury) — *"Kill a gear."* with Flow 4E + Fury.
Gear removal that rebuys itself from the trash once. Dead against half the format and
excellent against the other half.
*In:* vs Azir and anything on Brutalizer / B.F. Sword. *Out:* Cull the Weak ×2 —
symmetrical removal is weak against a deck whose threats are gear rather than units.

**Against the Odds ×1** (2E, Fury, Reaction) — *"Give a friendly unit at a battlefield
+2 Might this turn for each enemy unit there."*
A Reaction, so it lands after their arithmetic is committed, and it scales with *their*
board — which makes it the trick for exactly the fights Blood Rush is too small for.
Against three enemy units it is +6 Might for 2 Energy.
*In:* vs wide decks — Master Yi, Kennen. *Out:* a Blood Rush.

**Decree of Unity ×1** (2E / 1 Order) — *"Kill an enemy Chaos unit or gear."*
Unconditional removal, narrowly. Chaos-only makes it a sideboard card by construction:
live against Kennen, Vex and Kha'Zix decks, blank against Irelia, Master Yi and Azir.
*In:* vs any Chaos deck. *Out:* Hidden Blade, whose draw-2 clause you would rather not
give a tempo deck.

**Ferrous Forerunner ×1** (6E / 1 Fury / 6 Might) — *"[Deathknell] Play two 3 Might Mech
unit tokens to your base."*
Six Might that becomes six more Might when it dies — eleven Might of material from one
card. It is the grindy-matchup trump, and it is genuinely hard to answer profitably
since killing it is what turns it on.
*In:* vs midrange and control, anywhere games go long. *Out:* an Undertitan on the
draw, where six Energy twice is too slow.

**A note on what is not here.** No counterspell, and nothing that interacts on the
opponent's turn beyond Against the Odds. This board is built to win board-state
matchups harder, not to answer a combo. If the format shifts toward something that
wins without contesting battlefields, this board has no answer in it.

## 14. What I'd test

**Rek'Sai, Swarm Queen over Breacher.** Covered in §5: she copies the legend's effect
on a 5-Might body, triggers on **attack** rather than conquer — so she does not require
you to win first — and can deploy the revealed unit **directly to the contested
battlefield**. In a deck whose central weakness is that the engine needs a conquer
before it does anything, a second engine that only needs an *attack* addresses the
problem directly. The cost is two more Energy and an Order Power in the tightest
domain.

**A fourth Void Rush effect.** Void Rush is the only card that runs the engine without
conquering and is never dead. There is no fourth copy to play, but the same slot could
hold a second Hidden Blade or a third Vanguard Captain.

**Cutting the Rage Amplifier.** One-of anthems are dead when behind, and §10 already
says it is not a keep. The slot could be a third Faithful Manufactor, which makes the
bodies the anthem wants to multiply.

**Whether Noxian Emissary earns its Empower.** Three copies of a 2-drop whose whole
payoff is gated behind a second payment, in a deck with a Power problem in that exact
domain (§5, the runes). Worth tracking over a league night how often you actually
Empower them before they die.

## Sources and method

**Reading the rule citations.** `docs/rules-full.md` concatenates Riot's Core Rules and
its Tournament Rules, and **they number independently**, so some numbers appear twice.
Every unqualified "rule N" here means the **Core Rules** entry; citations marked
"Tournament Rules" (601.1.c, §13) mean the other document. Two citations here collide
with a Tournament Rules entry of the same number — **206** (printed cost, versus a
Tournament definition of a round cycle) and **415.3.a** (readying in the Awaken Phase,
versus score-tracking guidance). Both are the Core entries.

**A live example of why that matters.** The Spiritforged FAQ issues errata to the
Deflect rule and names it "rule 735.1.c". In the current Core Rules, 735 is about
Additional Turns — Deflect has since been renumbered to **809**, and 809.1.c already
carries the revised *"for each time they choose me"* wording. The FAQ's rule number is
historical; the current citation is 809.1.c.

Card text is `data/cards.json` with `data/errata.json` applied on read. Four cards in
this deck carry errata (§12), including the legend. Rules are verified against
`docs/rules-full.md` (Core Rules, 2026-07-16) and `docs/rules-faq.md`. Where a FAQ and
the Core Rules differ, the FAQ header in that file explains which wins by date; the
Core Rules here are newer than every FAQ except Vendetta's.

Collection and deck state come from the live app state via `scripts/rift deck rek`.
Target pools and the Power-demand figures in §5 are computed from `data/cards.json`
rather than recalled.

**The tier placement has been dropped from the header.** riftbound.gg had this at Tier
3, #4 of 49 in its week-4 report (2026-09-10) — but that judgement predates the 18
September ban, and §8 argues the ban moved this deck's position without moving the
deck. A stale tier is worse than no tier.

The clean-win figures in §3 and the mulligan figures in §10 are simulations, not
observations: hypergeometric where a closed form exists, Monte Carlo at 60,000–200,000
trials otherwise, against the Might distributions in `data/decks.json`. The combat model
implements rules 465.2 and 466.3 directly. Post-ban share projections in §8 are a model
anchored to the measured RQ standings — the measured numbers are marked as such and the
projections are not presented as data.

Event shares, cohort records and Kevplayer's finish come from the Yomi's
Place RQ standings — the only one of these sites that serves automated requests.
riftbound.gg, Mobalytics and riftDecks all return HTTP 403, so anything attributed to
them came via search results rather than the pages themselves. **Note that
`data/decks.json` is blind to Regional Qualifiers** — every RQ sits in its
`unresolvedClaimEvents` list — so no claim in §8 rests on it.

The decklist is Kevplayer's Barcelona registration; the main deck matched his
card-for-card before the sideboard was entered. The analysis here is derived
independently from the cards, the rules and public event data.
