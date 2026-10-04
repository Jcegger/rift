---
title: Winning Positions — Strategy Notes
subtitle: How to think about a turn, distilled from Mateo Ferreira's The Mathematics of Winning Positions and applied to the current field
author: rift toolchain
date: 2026-10-02
---

The thinking layer. [fundamentals.md](fundamentals.md) says how the game works,
[rules.md](rules.md) says what the rules are, and the dossiers in `guides/` say what one
deck does. This page covers **how to choose between two lines that are both legal and
both look fine**. Where it touches a rule, **rules.md is right and this file has a bug**.

**Source.** Mateo Ferreira, *The Mathematics of Winning Positions: A Strategic Framework
for Competitive Riftbound* (2026, July-2026 edition, self-published on Gumroad). These
notes are a distillation in our own words, not a copy. The book's formulas, its
component-rating tables and its chapter on philosophy are left out. The author says
himself that the formulas are never calculated at the table, and the ideas survive
without them. Buy the book for the full argument.

**Why take it seriously.** The book does not list the author's results, so it has to earn
its place on its content. It does. The advice is consistent with what this repo found
independently: the matchup guide's "which game is this" table is the book's role
question, arrived at from the numbers. It also agrees with Jun, who has the RQ results
([Jun's notes](../guides/khazix-voidreaver-jun.md)), on most points where the two overlap.

**What is dated.** The book reflects the July 2026 field. Several of its example cards
are now banned, and those examples have been re-anchored to today's field. See
[§9](#9-what-has-changed-since-the-book).

---

## 0. The order of every decision

The book has one idea, said many ways: **a play is worth the position it leaves you in,
not what it does now.** Before that idea applies, though, one check comes first.

**1. Terminal scan: can the game end before anyone gets another turn?** Look for your win
first, then for theirs.

- **Your win now.** Is there a legal sequence to 8 this turn? Are all its costs payable?
  Do they have any response left, or are they tapped out? Does it survive the
  battlefields' text? If every answer is yes, **take it**. Flexibility is worth nothing
  once one line wins outright.
- **Their win next turn.** If they have a line to 8 on their turn, stopping it outranks
  everything below.

The scoring facts the scan runs on, which strong players carry without thinking:

| you are at | and you | result |
|---|---|---|
| **7** | **hold** a battlefield at the start of your turn | **you win.** Hold points are not gated (§471.1.a.1) |
| **7** | conquer, having scored the other battlefield this turn | you win |
| **7** | conquer, **not** having scored the other this turn | **you draw a card instead** (§471.1.b.1) |
| **6** | hold one, then conquer the other | win. The hold scored the first, so the conquest is the final point |
| **6** | hold nothing, conquer both | win. The first conquest makes 7 and scores that battlefield, so the second is the final point |

Read it from their side too. **An opponent at 7 who holds a battlefield wins at the start of
their turn unless you take it from them now.** That is a forced loss to prevent, and it
outranks any plan you had.

**2. Role: if neither of us acts, who is happier?** That player can afford patience, and
the other has to force the game. See [§2](#2-every-deck-is-solving-a-different-problem).

**3. Objective: what is my deck maximizing *right now*?** That means points, a key card
landing, XP, or denying their hold. Name what matters this turn, not the archetype label.

**4. Two real candidate lines.** Compare a real alternative, not your favourite line
against a strawman. For each, picture three replies:

- **clean**: the efficient answer they already wanted to play;
- **awkward**: an answer that solves the problem but bends their plan;
- **punish**: the reply that most exploits your line.

**5. Continuation test.** After the replies, **who prefers the resulting position?**
Choose the line whose *spread* of outcomes is better. Do not choose the line with the
best single outcome.

Step 1 is the case study the book ends on, and the reason it comes first. In the
**Utrecht RQ Grand Final, game 1**, Viktor sat at 6 against a tapped-out Azir and had a
two-point line on the board. Salvage the B.F. Sword to shrink the Hall of Legends
defence from 10 to 7. Attack with two Recruits and Ambush Vi, Peacekeeper to stun a
Sand Soldier, which wins the fight 7 into 5 and makes 7 points. Then Xin Zhao and a
Sprite through Forbidding Waste's −2 to a lone defender make 8. Instead, the Viktor
player set up a hold against the next Arise!. Azir untapped, Deathgrip moved the Might
around, and Azir won the game and the match 2–1. The book's verdict is that this was
**not a calculation error but an ordering error**: the player solved next turn's defence
before checking whether there needed to be a next turn. (Card text checked against
`data/cards.json`.)

---

## 1. The board is not the position

**Holding a battlefield and having board presence are different assets.** Holding is a
claim on a scoring location. Board presence is everything you can still do: contest,
reinforce, punish, retreat, rebuild. You can look dominant on both battlefields with an
empty base and an expensive hand, and be losing.

**Conquering is often easier than holding.** The holder has parked material where the
opponent can plan an attack, and has to pass without knowing what is coming. A hold is
only strong if it is **hard to break, expensive to break, or backed by a punish** for
the attempt.

**A small unit on a battlefield is often a question, not a plan.** If they ignore it, it
scores. If they spend too much removing it, the player who made the small commitment
still has the stronger base for the next wave. *They win the local fight and lose the
sequence around it.* Before spending heavily to clear a probe, check what is still
waiting in their base.

**Bad wins.** A bad win is a fight or conquest that succeeds locally and loses to what
follows. Typical shapes:

| local result | hidden cost |
|---|---|
| conquered now | base is empty, next turn is forced |
| won combat with two tricks | your hand for the swing-back is gone |
| broke their hold | walked into the finisher they were holding for exactly that |
| forced a trade | revealed the card you needed to keep hidden |

The test, after any local success: **what is the next position, and who prefers it?**
The book's warning against the opposite error matters just as much: *do not let thinking
about the future make you distrust immediate value when the immediate value is the game.*
That is step 1 again.

**Realized vs. unrealized advantage.** A point scored, a line denied, or a battlefield
they have to answer is *realized*. Cards you cannot cast in time, Might that has not
reached a battlefield, and inevitability that has not arrived are *unrealized*. Discount
unrealized value when it is slow or easy to disrupt, or when the score clock will not wait
for it. **Ending a game with a full hand or untapped runes is usually a symptom**: value
was saved when it needed to be spent.

---

## 2. Every deck is solving a different problem

Aggro, midrange, control and combo are not card labels. They are different answers to
**which features of a position matter**. An aggressive deck trades future flexibility
for points now. An engine deck accepts a slow start because its later turns get
disproportionately strong. The same board can be excellent for one and poor for the
other. **Judge your turn by whether it advanced your deck's objective, not by whether it
looked productive.**

**Roles are properties of positions, not decks.** The aggressor can become the defender
when the race turns against it, and the slow deck can become the aggressor when a window
opens. Ask the role question again whenever the score, the board or the hands shift. In
midrange games especially, the role flips during the game:

| what you see | likely role |
|---|---|
| you are ahead and your retakes are clean | **hold**, and deny them efficient conquests |
| you are behind and their engine is improving | **push** before it arrives |
| your hand is tricks, not development | force exchanges only if the end state improves |
| their base is big but slow | pressure before it converts |

**Inevitability** is who gains from quiet turns. If quiet turns help them, a passive turn
is a concession even though it loses nothing visible. If they help you, a quiet turn may
be exactly right.

**In Riftbound that is bounded by the hold clock.** Hold points arrive every Beginning
Phase whether anyone acts or not, so a player holding both battlefields wins in four
turns ([fundamentals §1](fundamentals.md)). Patience is a strategy only while the board
is split. Inevitability means "time is on my side *given the battlefields stay as they
are*". It never means you can ignore a double hold.

---

## 3. Resources are only what they can become

A card, rune or unit is worth **how much better it makes the futures you can reach**,
not the fact that you own it. A card you cannot cast in time is worth roughly nothing.
Count **flows, not stocks**: how fast resources turn into pressure, and pressure into
points.

**Efficiency is future value per unit spent.** Spending six runes and four cards to
secure a battlefield that a cheaper line nearly reaches is a worse line, even though
both "worked". The cost includes more than runes and cards: tempo, Might committed,
information revealed, flexibility lost, and **the hand you are left with**.

**Texture beats count.** Hand texture is *which* cards remain and how they fit the next
sequence. A hand of three tricks and no development has a different texture from three
units, even at the same count.

**Tempo** is a present advantage that forces the opponent to spend future turns catching
up. It equals the cost you impose on their future minus what you paid. A cheap answer to
an expensive unit generates tempo even if the card exchange is even, because they spend
a turn replaying while you develop.

**Point tempo.** A point matters most when it **changes who has to spend the next turn
catching up**. At 4–3 the gap looks like one point. But your next normal turn threatens
6, while theirs only gets back to 5, so the lead can buy you a development turn. Not all
points are equal. When you are far ahead, developing can beat forcing another point.
When they are approaching parity, the same conquest can become mandatory.

**Leverage: do not give their counters a target.** If their play pattern says they are
holding a counter, the best use of your strong proactive spell may be *not casting it*.
Develop differently and their hand stays dead. **A hand full of answers is only strong
if you present the question it answers.**

---

## 4. Information is about plans, not cards

Weak players ask *"what card could they have?"* Strong players ask ***"what game is this
sequence of decisions telling me they are playing?"*** A player who filters, refuses
favourable fights and leaves runes up has told you that battlefields are not their main
objective this turn. That is worth more than knowing one card.

**Information has value only if it changes your play.** If no possible answer would
change what you do, stop trying to work it out.

**The baseline problem.** First ask what their deck would *normally* do this turn. A play
the deck makes with almost any hand tells you almost nothing. A **deviation** tells you
a lot: a pass, a declined fight, a protection spell on something that should be
expendable, a skipped development, or a hold they normally break and did not.

**The asymmetry. This is the single most useful idea in the chapter.**

- **Not interacting does not prove absence.** If their turn is supposed to be a key unit
  and they play it, they may still hold the removal or counter. Development was simply
  worth more.
- **Interacting *instead of* developing is strong evidence.** It has to be justified by
  something: the key piece is missing, the hand is awkward, your pressure was too
  dangerous to ignore, or the interaction was unusually good.

**Open runes need context.** Some decks leave one rune open as part of their normal
development, so on those turns it means nothing. It becomes informative alongside a
deviation, such as a strange pass or a declined fight.

**Absence of a play is not absence of the card.** The book's Rengar example: you have a
unit on a battlefield and five open runes, and they do not drop Rengar into it. The lazy
read is "no Rengar". The better read is that *Rengar plus enough support to beat what
your open runes represent* has become less likely. Rengar with no support is still
possible, and so is no Rengar, and so is a plan that avoids your open hand. Shift the
weights; do not delete the branch.

**When they do not do what you expected, there are three explanations**, and the first
update should be to your model, not only to their hand:

1. **The line was not available.** They lack the cards. That is real hand information.
2. **They value the position differently.** That may be weaker play, or a priority you
   missed.
3. **Your baseline was wrong.** The "obvious" line was not actually best for their deck.

The question that tells these apart: *what future action would distinguish "missing the
card" from "a different plan"?* Watch for it.

**Think in continuation ranges.** Their mulligan, the units they played, the runes they
left open, the battlefields they refused and the chances they declined all narrow the
set of plausible *lines* they can still have. A narrow, linear deck becomes readable
fast. A deck whose normal turn holds up several kinds of card stays hard to read, and
each observation is worth less against it. Then **pick the play that makes the strongest
part of their range inefficient.**

**Stop at the useful depth.** "I think they think I have it" is only worth considering if
it changes your play. If adding a layer of second-guessing gives the same answer, stop
there. **Confidence is not knowledge**: keep what you know separate from what you
believe.

---

## 5. Pressure is the removal of good choices

Pressure is not aggression. **Pressure is making your opponent's good options disappear.**
They may still have plenty of legal plays. What shrinks is the set of plays that do not
lose. That is why pressure can feel crushing before the board looks lost, and why the
strongest pressure often looks quiet: it removes futures before it removes cards. Every
good play should widen your own options, narrow theirs, or ideally both.

**Initiative belongs to whoever is asking the questions**: deciding where resources must
go and which battlefield matters. It is not the same as being ahead on points.

**Plan damage: attack their normal line.** Every deck has turns that matter more than
others, where the key unit lands or the protection comes online. The best pressure hits
those turns **before they arrive**. The question is not "can they answer this?" but
**"can they answer this without wrecking the turn their deck wanted?"** An answer that
uses cards they meant to use anyway is cheap for them. An answer that replaces their
development turn is expensive, even when it wins the battlefield.

**The counterfactual test.** *What would they have done if my play did not exist?* If the
answer is "the same thing", your play did not pressure them. If it changed their turn,
it did. This separates pressure that looks active from pressure that works.

**Combat chains are hard to leave.** Once someone commits to a fight, the first trick
demands protection, the protection demands runes, and the runes were the development
turn. Aggressive conquest can extract more than a point: it **forces them to prove their
hand supports the whole chain**. Run this backwards before you start a fight yourself.

**A threat is real only if their best answer still hurts them.** Size is not threat. A
small unit that keeps scoring because nobody can contest it profitably is a big threat.
A big unit they remove cleanly is not. Some threats are real because of **what happens
when you kill them**. A unit whose Deathknell leaves a better board behind (the book's
example is Ferrous Forerunner: two 3-Might Mechs) raises the cost of conquering through
it. So ask ***"what begins if I conquer through this?"***, not only "can I?"

**The first-in trap.** The player who enters a battlefield first reveals their allocation
first. The responder sees exactly what they need to beat, and can commit precisely that
much. In fight-heavy matchups both players often wait for this reason. **Going first is
right when it takes options away from them, and wrong when the information it gives away
is worth more than the point.**

**Refuse the exchange they prepared.** They pass with five runes open. The reactive
mistake is to force a fight into it anyway. The strong play is often **to develop without
offering a target**, so the interaction they held up expires unused while you improve.

| their plan | your punish |
|---|---|
| hold interaction open | develop without offering the trigger |
| force an inefficient fight | decline, improve your future turns |
| represent many answers | make every answer low-value this turn |

**Every trick sends a message.** Review a fight twice: once for **who won**, and once for
**the message**. Which card did I make them spend? Which did I reveal, and which did I
keep? What does each player now believe about the next fight? Sometimes the right trick
is the weaker one, because it baits out the answer you wanted gone (a Reaction pump, say)
before the fight that matters. Sometimes the right line is to *not* bait it, and keep
your own trick for later. **The best trick is the one that sets up the best next fight,
not the one that wins this one.** Pre-showdown choices belong here too. Sabotage has no
Action keyword, so it must be cast **before** the showdown opens. It reveals their whole
hand and recycles one non-unit card from it. Decide before the fight whether you want
their answer *removed* (Sabotage it) or *spent* (let them use it).

**Point lead, forced hold, retake.** The book's Viktor example is still live (Tier 3.2).
Once a deck like that is ahead, it can add pressure cheaply while building its base. The
opponent is pushed into a big hold just to stay in the race, and that hold is exactly
what Thousand-Tailed Watcher or Imperial Decree was waiting for. **Pressure is strongest
when the answer you force them into walks into your prepared punish.**

---

## 6. Matchups are two systems competing

A matchup is not a list of good and bad card interactions. It is **which deck manages to
keep its own engine efficient while making the other's clumsy**. An underdog deck wins
by forcing a sequence where the favourite's best cards answer the wrong problem. In
Riftbound that often means *not* fighting over the small unit that only represents a
point, and preparing for the board-wide fight that follows.

**Sideboard cards earn their slot by changing the sequence**, not by answering one card.
A narrow card is excellent if it makes their efficient line inefficient. A generically
strong card is poor if it does not touch the sequence that decides the matchup.

**How to learn a matchup.** Pick one important matchup and map its three recurring
sequences:

1. **Early pressure vs. clean development.** Contest now, allow the point, or force them
   off their natural development turn?
2. **First-in vs. the punish.** Who benefits from entering first, and who gets the
   cleaner response?
3. **Point lead, forced hold, retake.** When does the score make holding compulsory, and
   whose engine wins the retake?

For each, write the normal line and the clean, awkward and punish replies, and compare
the results. Do not memorize a script. Stage it: solve one spot with full information,
add hidden hands, find the same structure in a second matchup, then do it in real time.
**The point is less load on your thinking at the table, not more rules.**

---

## 7. Applied to Kha'Zix Voidreaver

The book is general; Jun is specific. Where they meet, the advice is as solid as this repo has. **Where they differ, Jun wins.** The detail lives in the [deck guide](../guides/khazix-voidreaver.md), the [matchup guide](../guides/khazix-voidreaver-matchups.md) and [Jun's notes](../guides/khazix-voidreaver-jun.md). This section is the map between them.

| the book says | Jun says, for this deck | so at the table |
|---|---|---|
| **Who is happier if nothing happens?** ([§2](#2-every-deck-is-solving-a-different-problem)) | your late game (removal, finishers, Fizz, Matriarch) is the better one against most of the field, so **develop first, spells second** | quiet early turns usually favour you. Against the decks that out-grind you, the matchup guide's role table says force it earlier |
| **Check for lethal first** ([§0](#0-the-order-of-every-decision)) | **reach 6 before them**: Void Assault and the Ambush units take both battlefields in one turn | from 5 points, scan every turn for both players. Keep the finishing cards for the turn that needs them |
| **A bad win loses to what follows** ([§1](#1-the-board-is-not-the-position)) | the legend's best use is the **walk-home** after a conquest; don't spend everything on the 6th point | an even trade is No Result and pays no XP (§466.3), a failed conversion, not a neutral outcome. Losing a battlefield you hid at is the bad win in its purest form |
| **The first-in trap** ([§5](#5-pressure-is-the-removal-of-good-choices)) | "the defender has already revealed what the defending units will be"; **retreating is not surrendering a point**. Kha'Zix "represents six Might", which makes them respond first | your Ambush, Hidden and Evelynn cards are built to answer second. Make them commit, and walk home rather than hold a battlefield they can plan against |
| **A hold is strong only if it is backed** ([§1](#1-the-board-is-not-the-position)) | **"can I win this game without a hold?"** If not, force one. Post-ban, the Heron decks make that most games | hold with a facedown card behind you. At 7, a split board with a hidden card |
| **Refuse the exchange they prepared** ([§5](#5-pressure-is-the-removal-of-good-choices)) | "developing through Ambush" is a rookie mistake, seen from the other side: don't hold five runes open for a Rengar a good player will simply develop past | hiding is your way to refuse: it cannot be answered (§811.1.c.1, §811.1.c.2) and costs no Energy on their turn. Flipping into open Chaos or Calm is offering them the exchange |
| **Information is about plans, and needs a baseline** ([§4](#4-information-is-about-plans-not-cards)) | **Sabotage first** to see what you are playing into, and cast a spell *before* the fight to see whether they answer it | open Calm on a normal development turn is weak evidence; a rune kept open *instead of* developing is strong. The flip rules in the matchup guide turn on exactly that |
| **Every trick sends a message** ([§5](#5-pressure-is-the-removal-of-good-choices)) | make Sabotage, or a lesser spell, **eat their Defy before the Star-Crossed that wins**. Switcheroo's target is **the unit they just pumped** | choose your trick for the next fight, not just this one. **If a second trick of theirs would beat you, buff before the fight**: Jun lost a game on camera by not doing it |
| **Roles change mid-game** ([§2](#2-every-deck-is-solving-a-different-problem)) | aggressor or defender "can change mid-match" | re-ask the role question the turn they land the piece that beats you long: Astral Heron, Dazzling Aurora, a resolved Rhasa |

**Two places the book's general advice needs Jun's correction:**
- **Conquering is not always worse than holding, for this deck.** The book warns that holders reveal their allocation. Kha'Zix's answer is to hold with *hidden* allocation: a facedown card, an Ambush threat, or Star Spring's walk-home behind a strong unit. That changes the trade.
- **The simulations behind this repo's numbers miss the opponent's answer.** A Monte Carlo swaps against the board as it stands, so it rated Switcheroo low against small boards. Jun's play shows the swap target is created by their pump. Treat simulated rates as a floor on what the card can do, and correct them from play.

---

## 8. Reviewing a game

**Do not review only the turn where the loss became obvious.** Find **the first turn where
your future became narrower than theirs**. The final mistake is usually just the moment
earlier damage showed.

**Classify each mistake by type**, because types repeat and that is what you can fix:

| type | you… |
|---|---|
| **terminal** | missed a win, or a loss you had to prevent. Check this first, before the others |
| **state** | judged the visible board instead of the position |
| **objective** | solved the wrong problem for your deck or matchup |
| **conversion** | spent resources and got too little future out of them |
| **information** | did not update after their actions, or read too much into a normal-line play |
| **pressure** | let your own good options vanish, or missed that theirs had |
| **role** | kept pushing (or holding) after the position had changed your role |

**Write the verdict as a conditional sentence**, so it can be tested:

> I prefer line A because it improves *X*, keeps *Y* and avoids *Z*. I would change my
> mind if *Q* turns out false.

A verdict with no reversal condition cannot be checked against your next games. **Keep the
wrong predictions.** A record of why your first judgment failed is the most useful
review you have.

The [match journal](match-journal.md) carries both: a type letter beside `my mistake`,
and the type tally on the ten-match review page. For Kha'Zix it also counts the deck's
own failure modes as marks: `h` a hidden card lost with its battlefield, `n` a No Result,
`f` a flip blown out. Those are conversion and information mistakes with a name on them.

**Jun's version of the same discipline** ([Jun's notes §10](../guides/khazix-voidreaver-jun.md#10-jun-on-video)):
in his Irelia commentary he stops on his own error, says what he should have done (buff
before the fight), and says why (a second Defiant Dance was likely). That is a review in
one breath: the state, the alternative line, and the evidence that should have changed
the choice.

---

## 9. What has changed since the book

The examples come from the July 2026 field. The principles carry over, but some of the
cards in the examples do not:

| book example | status now | the principle, re-anchored |
|---|---|---|
| **Lux combo** filtering with Stacked Deck, an Ekko sacrifice follow-up | **Stacked Deck and Ekko, Recurrent are banned**; Lux is off the tier list | an engine deck's quiet turns are its development (§2). Today: Azir building Equipment towards Arise! (Tier 2.1, "take both before Arise!") |
| **Draven** in first-in standoffs | **Draven, Vanquisher is banned**; the other Dravens are 1–1.6% of the field | the first-in trap (§5) holds in any fight-heavy matchup, and Kha'Zix lives on it (§7) |
| **Viktor** point-lead pressure, the Utrecht case study | Viktor is Tier 3.2. Rednaxell's list ran **The Arena's Greatest, now banned**; the lethal line did not use it | unchanged |
| **Diana vs. Irelia** | Irelia is Tier 1.1, Diana Tier 4.2 | unchanged |
| **Master Yi** open-rune reads, Sabotage before the fight | Master Yi is Tier 2.6 | unchanged |

Tiers are from the [matchup guide](../guides/khazix-voidreaver-matchups.md), riftbound.gg
as of 1 October, and will drift. The bans are from `data/banned.json`.

**One sentence to keep:** *a play is good when it moves the game into futures your deck
values more than the alternatives, after checking that the game is not already over.*
