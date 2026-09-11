# The rules of Riftbound

Riot publishes the rules as two PDFs and nothing else — 120 pages of Core Rules and 50
of Tournament Rules, 3,326 numbered rules between them. This is that, rewritten to be
read: the same rules, in the order you actually need them, with every claim carrying the
rule number it came from.

**Describes Core Rules 2026-07-16 and Tournament Rules 2026-07-16** — the Vendetta
update, effective 2026-07-24. Sourced from
[Riot's Rules Hub](https://playriftbound.com/en-us/rules-hub/).

That line is a contract, not a note: `check.mjs` parses those two dates and compares
them to the rules actually committed in `data/rules.json`. The verbatim half rebuilds
itself from Riot; this half does not, so when they part company the build says so.

- **[rules-faq.md](rules-faq.md)** is Riot's per-set rules FAQs, and the current one
  **outranks the Core Rules**: the Vendetta FAQ (2026-08-14) states that where it differs
  from the Core Rules Document the FAQ takes precedence, until a newer Core Rules
  Document is published. It post-dates the Core Rules here by four weeks. None of the
  FAQs are linked from Riot's Rules Hub, so check it before relying on anything below.
  Earlier FAQs are weaker: the Unleashed one declares itself obsolete at the next rules
  update (which has since happened), and Riot's Origins one carries a "may no longer
  reflect Riftbound's rules" banner. They bind only where the current Core Rules still
  carry them — which, for the two Unleashed rulings cited below, they do.
- **[rules-full.md](rules-full.md)** is Riot's own wording, unedited, every rule in order.
  Every `§` below resolves there — `grep -n '807\.' docs/rules-full.md`. When this file
  and that file disagree, that file is right and this one has a bug.
- **`scripts/build-rules.mjs`** regenerates it. `data/rules.json` carries the version
  stamp, the section index, and the map from every bracketed term a card can print to
  the rule that defines it.
- This file is **hand-written and does not rebuild itself.** When the builder reports
  that Riot's date moved, this file is stale until someone reads the patch notes.

Two rules outrank everything below. **The card wins** — when a card contradicts the
rules, the card is what is true (§002). And **"can't" beats "can"** — a card forbidding
something beats a card allowing it, always (§054.1).

---

## The shape of a game

**You win at the Victory Score, and points come from battlefields.** Almost everything
else is in service of that sentence. The Victory Score is **8 by default** — 1v1 and
free-for-all — but **11 in 2v2**, and card effects can move it (§194.3, §194.3.a, §489.3).

There are 2–3 battlefields on the table depending on the mode. In a 1v1 there are
**two** — each player registers three and brings one (§485.4). You take a battlefield by
putting units there and winning the fight, and then you get paid for it every turn you
keep it. Two ways to score (§469):

- **Conquer** — you gain control of a battlefield you have not yet scored this turn. 1 point.
- **Hold** — you still control it at the start of your turn. 1 point.

**Once per battlefield per turn, either way** (§470). So a battlefield you take and keep
pays 1 on the turn you take it and 1 every turn after.

The game ends in a **cleanup**, not the instant you cross the line: a player wins when a
cleanup happens and they have ≥ the Victory Score and strictly more than anyone else
(§194.2, §323.1). Ties keep playing (§194.2.b).

The exception is the runaway burn-out chain below — once it is repeating, a point that
puts someone at the Victory Score **and ahead of every opponent** wins immediately, with
no cleanup (§431.3.c, §431.3.c.1). It skips the cleanup, not the tiebreak.

### The eighth point is not like the others

The last point by Conquer is gated. When you try to gain a point from Conquer and your
total is **within 1 of the Victory Score or higher** — 7+ in 1v1, 10+ in 2v2 — you only
get the point **if you have Scored every battlefield on the table this turn.** Otherwise
you draw a card instead (§471.1.b, §471.1.b.1). In 2v2, "every battlefield" excepts any
your ally **occupied** during the scoring step of your Beginning Phase (§489.8.g.1).
Separately, a battlefield your ally **controlled** at that moment is disqualified from
your team conquering it at all (§469.1.a) — occupation excuses you from the requirement,
control is what blocks the conquer, and they are not the same test.

**Read "Scored", not "conquered".** Hold is one of the two ways to Score (§469), so a
battlefield you Held in your Beginning Phase already counts toward "every battlefield
this turn". In a 1v1 that means: Hold one battlefield in your Beginning Phase to reach
7, then Conquer the other — the Hold already counts as that battlefield's Score, so the
gate opens and the eighth point is yours. You do **not** have to conquer both. (Starting
*at* 7 the Conquer is never needed: a Hold is not gated at all, so it simply wins.)

Points from anything other than Conquer — Hold, card effects, an opponent burning out —
are not subject to the gate at all (§471.1.a.1).

### Losing your deck does not lose you the game

Running out of cards is a **Burn Out** (§431), not a loss. You shuffle your trash back
into your Main Deck, **an opponent of your choice gains 1 point**, and you finish the
draw. If your trash is empty too you burn out repeatedly, handing out a point each time,
until someone wins (§431.3.a) — and those repeat points can't be prevented (§431.3.b).

---

## Your deck

Five things, and they are not all the same kind of thing (§103):

| | count | notes |
|---|---|---|
| **Champion Legend** | 1 | starts in the Legend Zone, never leaves it (§107.4.d). Sets your **Domain Identity**. |
| **Chosen Champion** | 1 | a champion unit whose champion tag matches your Legend (§103.2.a.2). Starts face-up in the Champion Zone and is playable from there (§108.3.d). |
| **Main Deck** | 40 | units, gear, spells. "At least 40" in the Core Rules; **exactly 40 in competition** (TR §402.1, TR §601.1.b). The Chosen Champion counts toward it. |
| **Rune Deck** | 12 | shuffled, kept separate (§103.3). |
| **Battlefields** | 3 | registered, each a different name (§103.4.c). Only one is used per game in 1v1 (§485.4.a). |

**Domain Identity.** Six domains: Fury (red), Calm (green), Mind (blue), Body (orange),
Chaos (purple), Order (yellow) (§134.2). Your Legend's domains *are* your identity, and
a card is legal only if your identity contains **all** of that card's domains (§103.1.b.4)
— a two-domain card needs both. Domainless cards go in anything. Runes obey the same
rule (§103.3.a.1). The one escape: a game effect may add a card to your deck regardless
of its domains, and it then counts as part of your identity anyway (§103.1.b.5).

**Copy limits.** 3 of any name (§103.2.b), and names include the subtitle — `Kai'Sa,
Evolutionary` and `Kai'Sa, Survivor` are different cards and you may run 3 of each
(§132.4). **Your Chosen Champion counts against that 3**, so it plus at most 2 more
copies (§103.2.b.1). **Signature cards are capped at 3 total across the whole
deck regardless of name**, and they must all match your Legend's champion tag (§103.2.d).
Cards with **Unique** are limited to 1 (§825.3.a).

**Sideboard** (tournament only, TR §601.1.c): **10 or fewer cards**, up from 8 before
2026-07-24. Every card in it must be a **valid Main Deck card** for your deck — right
type, inside your Domain Identity, legal in the format — not merely a main-deck card
type (TR §601.1.c.2). The 3-copy limit spans the main deck and sideboard **together**.
Swaps are 1-for-1 between games and you may change your Chosen Champion; **in
constructed** you may never change runes, Legend or battlefields after registration
(TR §403.4.b) — limited has its own battlefield rules (TR §602.3). No sideboarding
before game 1 (TR §403.5), or after a draw (TR §403.10). `scripts/state.mjs` enforces
the size, type and copy limits on hand-entered decks.

---

## Setup

1. Legend to the Legend Zone; Chosen Champion to the Champion Zone; battlefields set
   aside (§111–113).
2. Shuffle Main and Rune decks separately (§114).
3. Determine turn order (§115).
4. **Everyone draws 4** (§116).
5. **Mulligan, in turn order** (§117): set aside up to 2 cards, draw that many, then
   recycle the set-aside cards to the bottom of your deck. One pass, not a full redraw.
6. First player begins. **The player going second channels an extra rune on their first
   Channel Phase** (§485.7) — that is the whole on-the-play compensation in 1v1.

---

## Resources

Two resources, and conflating them is the most common beginner error.

- **Energy** — the numeral in the cost. Colourless, no domain (§163.1).
- **Power** — the symbols under it. Power normally has a domain (§163.2.a), but some is
  **Universal** and pays a cost of any domain (§163.2.b, §135.2.e.5.b).

`:rb_energy_2::rb_rune_fury:` is "2 Energy and one Fury Power." Energy pays the number;
Fury Power pays the Fury symbol. Rainbow Power (`[A]`) pays any domain's Power cost
(§135.2.e.5).

**Runes make both.** Every basic rune has exactly two abilities (§164.2):

- `[E]: [Reaction] — Add [1].` — exhaust for 1 Energy.
- `Recycle this: [Reaction] — Add [C].` — send it back to the Rune Deck for 1 Power of
  its own domain.

**Those two abilities have different costs, and that is the whole trick.** The first
costs `[E]` — exhausting the rune. The second costs *recycling* it, and recycling is not
exhausting: nothing in that cost requires the rune to be ready. So the same rune can be
**exhausted for Energy and then recycled for Power in the same turn**. Energy and Power
are not an either/or on a given rune.

What recycling actually costs you is the *next* turn: the rune goes to the bottom of the
Rune Deck and your board shrinks by one. You channel 2 a turn (§315.3.b) to refill.

The practical formula. To cast something costing **E** Energy and **P** Power, you need

```
max(E, P) runes on the board, at least E of them READY
```

— E *ready* ones exhausted for Energy (an already-exhausted rune cannot pay `[E]` again,
§414.1.b), P of them recycled for Power, and the recycled ones may be the very ones you
just exhausted, provided P of them match the domain. A card costing 1 Energy and 2 Body
Power needs two Body runes, not three. A card costing 10 Energy and 3 Power needs ten
runes, three of them the right domain — not thirteen.

**Rune pools empty at the start of every player's Main Phase and at the end of every
player's turn**, and unspent resources are lost (§167) — everyone's, not just the turn
player's. There is no floating mana between turns, and none carried into a showdown on
someone else's turn.

**You can always Add in response.** Reaction abilities that Add resources can be
activated at *any* moment you are asked to pay — mid-payment, during another spell's
resolution, even with no priority (§429.3, §444.2.c). They finalize and resolve
immediately and do not pass priority (§429.2.a). You never lose a card to "I didn't tap
first."

**Paying is optional, but the consequence depends on what you were paying for.** If you
decline (§444.2): when it was part of a card's or ability's own cost, the entire play is
**undone** and the card goes back where it came from (§444.2.a); when it was any other
cost, only that linked effect fails to happen (§444.2.b).

---

## The board

**Locations** are the places permanents live: each player's **Base**, and the
**Battlefields** (§198.1). Everything else is a zone but not a location.

| zone | who | privacy |
|---|---|---|
| Base | each player | public (§107.1.d) |
| Battlefields | shared | public (§107.2.c) |
| Facedown Zone | one per battlefield, **1 card by default** — effects can raise or lower it (§107.3.b.1) | zone public, the card private (§107.3.f) |
| Legend Zone | each player | public |
| Champion Zone | each player | public (§108.3.e) |
| Hand | each player | private; the *count* is public (§108.7.e) |
| Main Deck / Rune Deck | each player | secret order (§108.4.d) |
| Trash | each player | **public, unordered** (§108.2.d) |
| Banishment | each player | **public** (§108.6.e) |
| The Chain | shared, exists only while something is on it (§330) | public |

Two consequences worth internalising: **everyone can read your trash and your
banishment at any time**, and **a facedown card at a battlefield is genuinely hidden** —
only you may look (§128.4).

**A battlefield's abilities are controlled by whoever controls the battlefield**
(§190.6.a); while it is uncontrolled the **turn player** runs them and counts as their
controller (§190.6.b). But if an ability names a specific player as the one who chooses,
**that player controls it outright**, whoever holds the battlefield (§190.6.c). And "you"
in a battlefield's text means its controller — with no controller, instructions that
imply "you" are simply ignored (§190.6.d).

A card that leaves the board to a non-board zone **becomes a new object**: damage
cleared, counters gone, granted keywords gone, statuses gone (§124.1). Flicker it and it
comes back clean — and it is no longer a legal target for anything that targeted it
(§359.3.e.4).

---

## The turn

Six phases. Only the Main Phase gives you an open window to act freely; the other five
run their tasks automatically — though a chain formed in any of them opens a Reaction
window, so they are not choice-free (§309.1.a, §312.2.c–d). (§315 groups the first four
under "Start of Turn".)

1. **Awaken** — ready everything you control (§315.1.b).
2. **Beginning** — start-of-turn effects, then the **Scoring Step**: you Hold every
   battlefield you control, 1 point each (§315.2.b.2). **This is where Hold points
   happen — before you do anything.**
3. **Channel** — channel 2 runes from your Rune Deck, ready (§315.3.b, §430.2.a).
4. **Draw** — draw 1. Empty deck here means Burn Out, then you still draw (§315.4.b).
5. **Main** — **every player's** rune pool empties (§316.3), start-of-Main effects happen,
   then it is open. No structure: take any number of actions in any order (§316.5).
   Combats and showdowns happen *inside* this phase as a consequence of what you do
   (§316.6).
6. **Ending** — end-of-turn effects, then the Expiration Step: **heal all units, expire
   all "this turn" effects, empty every rune pool** (§317.2.b–d).

Note the ordering trap: **Hold scoring is in the Beginning Phase, before Channel and
Draw.** A battlefield you are about to lose is worth taking to the start of your turn.

### Standard Move

Units have one inherent ability: exhaust to move (§144). Restrictions that matter:

- Main Phase only, **Open State only, and never during a showdown or combat**
  (§144.1.a–c). Once the fight starts nobody is walking in or out on a standard move.
- Base → battlefield, or battlefield → base (§144.4.a–b). **Battlefield → battlefield
  requires Ganking** (§810).
- In multiplayer only, you cannot move to a battlefield already holding two *other*
  players' units, or where a combat between two other players is **staged or in progress**
  (§144.4.a.1, §447.2.a). Never binds in 1v1.
- With teammates, your **teammate's** occupied battlefields are invalid destinations for
  any move of your units (§447.2.b).
- You may move several units at once as **one game action** if they share a destination;
  origins may differ, and all the exhaust costs are paid together (§144.3).

---

## Playing a card

Six steps (§353–359). They matter because things can go wrong at each one.

1. **To the chain.** The card leaves its zone and becomes a **Pending** chain item. This
   closes the state (§354.1).
2. **Choices.** Location for a unit, modes, targets, and **whether to pay optional
   additional costs** (§355.1.a). Everything targeted is locked in here.
3. **Total cost.** Base cost modifications, then additional costs, then increases, then
   **discounts**, then whole-cost modifiers (§356.1–356.5). Order matters: a discount on
   a component applies before a discount on the total (§356.4.d), and you choose the
   order within a tier (§356.4.c.1, §356.4.d.1). That choice is worth real Energy only
   because a discount's stated minimum binds **that discount alone** (§356.4.e) — so
   apply the minimum-bearing one first.
4. **Pay.** Resources, then non-standard costs in any order (§357). You do not need the
   resources floating beforehand: you may exhaust runes and fire Reaction Add abilities
   *inside* this step to produce exactly what you are paying (§357.1.a).
5. **Check legality.** Targets still legal, costs paid, no illegal game state, correct
   timing permission (§358). **If any check fails the whole thing is undone** (§358.5).
6. **Finalize.** It stops being Pending. A permanent leaves the chain and enters the
   board immediately; a spell stays on the chain waiting to resolve (§359.2–359.3).

Units enter **exhausted** (§143.4) — unless Accelerate or a similar effect changes that
(§143.4.a) — at the location you chose. By default that is your base or a battlefield you
control (§355.2.a), and effects can make other locations valid (§355.2.b). Non-unit gear
enters **ready** at your base, again unless an effect says otherwise (§149.1, §149.2).

**A card's cost is its printed or copied cost.** Anything checking "a spell that costs 5
or more" reads that, no matter what you actually paid (§206). An **ability's** cost is
read as its *base* cost, ignoring alterations unless the checking effect says otherwise
(§206.1).

**When two effects demand different play locations, you pick one and ignore the rest**
(Vendetta FAQ) — but only among *mandatory positive* requirements. A restriction ("can't
be played here") is never overridden this way; "can't" beats "can" as always (§054.1).
One location is absolute in every mode: **a unit can never be played into another
player's base**, by any means.

### Targeting, and how it goes wrong

A thing you choose is a **target** (§355.7), with exceptions worth knowing (§355.10):

- Something in a **non-public zone is not targeted** — "play a unit from your hand"
  targets nothing (§355.10.a).
- A **restriction is not a target** — "kill a unit at a battlefield" targets the unit,
  not the battlefield; "kill all units at a battlefield" targets the battlefield, not the
  units (§355.10.b).
- Things included **only** as part of a **cost, trigger condition or replacement effect**
  are not targets (§355.10.c) — the "only" is load-bearing. "Choose a friendly unit. The
  next time it would die this turn…" *does* target, because the choice is separate from
  the replacement effect.
- Things selected **programmatically** are not targets — "kill all gear" targets nothing
  (§355.10.d).
- Objects in a set chosen wholly or partly by **other players** are not targets — "each
  player kills a unit they control" targets nothing (§355.10.e).
- Anything named in an instruction a player **"must"** complete is not a target, and the
  choice happens on resolution: "you must recycle one of your runes" targets nothing,
  while "recycle a rune you control" targets (§355.10.f).

**Mistargeting**: if a target stops being legal before resolution, the spell still
resolves and that target is simply unaffected (§359.3.e.5). An instruction with targets
drops out when **all** of them went illegal (§359.3.e.7); a multi-target instruction still
executes on whichever survive (§359.3.e.8).

**Ignored vs negated — the Vendetta FAQ narrows this, and it outranks the Core Rules.**
An instruction is *ignored* **only** when it mistargeted. An instruction stopped any
other way is *negated*: a replacement effect, a "can't" restriction, a game action
performed on something already in that state (buffing a buffed unit), or an untargeted
object having left its zone. **Only an ignored instruction drags its linked instructions
down with it**; a negated one does not, unless the linked text refers specifically to the
action having been performed.

So Hidden Blade on a unit that "can't be killed" *still* draws 2 — the kill was negated,
not ignored. Hidden Blade on a unit that Flashed to base does not. This explicitly
reverses the Ride the Wind / Vilemaw's Lair example printed at §359.3.e.6. And if an instruction's information source is gone, it returns **null** and
everything computed from it is ignored (§359.3.e.12).

**Linked instructions** ("Kill a unit. *Its* controller draws 2") are chained: if the
first was **ignored**, the second is too (§359.3.e.14.a) — but see the ignored/negated
split above, which is narrower than that rule reads.

**A targeting relationship outlives the target becoming illegal** (Unleashed FAQ). While
the object stays **on the board**, the spell still counts as targeting it even once it
no longer meets the restrictions — which is what effects reading "a spell that chooses
it and no other friendly unit" are looking at. The one thing that breaks the
relationship is a change to a **non-board zone**, because that makes it a new object
(§124).

---

## States, the chain, priority and focus

The turn is always in exactly one of four states (§310), and the state determines what
anyone may do:

| | **Open** (no chain) | **Closed** (chain exists) |
|---|---|---|
| **Neutral** (no fight) | turn player plays anything | **Reaction only** |
| **Showdown** (fight running) | **Action or Reaction only** | **Reaction only** |

That table is the whole permission system. `[Action]` buys you into showdowns on anyone's
turn (§806.1.b); `[Reaction]` buys you that *plus* closed states — responding to things
already on the chain (§813.1.c).

**The Chain** exists only while something is on it (§330), and only one can exist at a
time (§330.1). Items are **Pending** until they pass step 5, then **Finalized** (§329).

**Priority** is the right to act (§312). **Focus** is the showdown-specific version:
whoever has focus is the one whose turn it is to act in the alternating back-and-forth
(§313). Gaining focus gains you priority (§313.2); passing priority does *not* lose you
focus (§313.3).

### HOT FEPR

The loop the whole game runs on (§334): **H**andle **O**utstanding **T**asks, then
**F**inalize, **E**xecute, **P**ass, **R**esolve.

1. **Finalize** — the oldest pending item completes steps 2–5 (§337.1). Finalizing does
   **not** pass priority (§337.1.a). **A unit, a gear, or an ability that Adds resources
   resolves the instant it finalizes** — it never waits and can't be responded to
   (§337.2).
2. **Execute** — the player with priority plays something legal, or passes.
3. **Pass** — once everyone has passed in sequence with nothing added, resolve.
4. **Resolve** — **the newest finalized item resolves** (§340.1). Last in, first out.

While something is resolving, nothing else resolves and no cleanup happens (§158.3,
§321). It finishes entirely first.

More generally, **cleanups fall between the FEPR steps and never inside one** (§320,
Unleashed FAQ): after an item is added, after it finalizes, after it resolves. A cleanup
pauses the process until it completes, but it cannot cut a step in half.

### Showdowns

A **showdown** is the structured window where both players get to act (§342). It opens
during a cleanup when a battlefield becomes **Contested** and the turn is in a Neutral
Open state (§344).

- **Contested** is applied when a unit arrives at a battlefield its controller does not
  control **and the battlefield is not already Contested** (§190.3.a.1). That is the
  trigger for everything — and because later arrivals do not re-apply it, focus stays
  with whoever applied it first (§345).
- The player who applied Contested gets focus first (§345).
- Players alternate: play something, or pass. **When everyone passes in sequence, the
  showdown closes** (§347–348).
- A **non-combat showdown** (you moved to an empty battlefield) closes with control
  passing to the single player who still has units there, if they don't already control
  it (§348.2.a) — a **Conquer** if they haven't scored it this turn (§348.2.a.1). If both
  players have units there when it closes, nobody takes control.
- Focus passes when a chain empties during a showdown — *except* when that chain was
  opened by a triggered ability or an Add ability (§346.1). The combat chain is opened by
  triggers, so the attacker keeps focus after it clears.

---

## Combat

**Combat is never declared.** It happens on its own, in a cleanup, at a **Contested**
battlefield where opposing units are both present, the chain is empty, and no other fight
is running (§460, §323.9). You start a fight by moving somewhere, and then the rules take
over.

Only ever **two players** (§462). Three steps:

### Step 1 — Combat Showdown (§464)

1. Start-of-combat effects.
2. **Attacker = the player who applied Contested. Defender = the other one** (§464.2.c).
   Units at the battlefield get the matching designation.
3. Attacker gains focus (§464.2.d). Read that against §464.2.c.1.b, which says that when
   a showdown was *already* running as combat opens, whoever holds focus keeps it — the
   two sit in tension and §464.2.d states no exception. Worth a judge call.
4. Attack and defend triggers go on the combat chain — attacker's first, then
   non-defenders in turn order, then the defender (§464.2.e.1).
5. Then it plays out as a showdown until everyone passes.

A unit that arrives *after* designations are handed out gets its designation in the
**next cleanup** (§464.2.c.3.a). That is its *first* time gaining the designation, so its
attack trigger **does** fire (§383.4.e). What §383.4.e.2.a prevents is a *second* trigger
if a unit loses and re-gains the designation in the same combat.

### Step 2 — Combat Damage (§465)

**Sum each side's Might.** There is no blocking and no pairing off — it is two totals,
each assigned across the other side's units. **The attacker assigns first, then the
defender** (§465.2.c), so the defender allocates knowing the attacker's choices; only the
*dealing* is simultaneous (§465.2.c.1.a).

Assignment rules, in order of how often they bite:

- **Lethal before moving on.** You must assign full lethal damage to one unit before
  assigning any to the next (§465.2.c.3). 5 damage into four 3-Might units is 3 and 2,
  never 2/1/1/1.
- **No overkill.** You may not assign more than the minimum lethal amount to a unit
  while others remain unassigned (§465.2.c.4) — and existing marked damage counts, so a
  3-Might unit with 1 damage takes exactly 2.
- **Tank first, Backline last** (§815, §826). Units with **Tank** must all be assigned
  lethal before any unit without it; units with **Backline** only after every unit
  without it. A unit with both lets the assigner pick which requirement to satisfy
  (§465.2.c.8).
- **Stunned units deal nothing** but still need their full Might in damage to die
  (§423.1.b–c).
- **Might below 0 counts as 0** for damage purposes, though the real negative value is
  kept for arithmetic (§143.2.b).
- **Every replacement effect that would touch combat damage applies at assignment**,
  not after (§465.2.c.5) — prevention, doubling, anything. A 2-Might unit with "prevent
  3" needs 5 damage assigned to be lethal. When several apply to one unit, **that unit's
  controller picks the order** (§372), and the choice is real: prevent-then-double and
  double-then-prevent give different results.
- **Lethal damage is a value effects can change**, not a synonym for Might (Unleashed
  FAQ). Anything reading "lethal damage" — cleanup deaths and combat assignment alike —
  uses the altered figure.

Then the damage step's own FEPR is **skipped** and outstanding tasks cancelled — you go
straight to resolution (§465.3). The window is not gone for good: anything that triggered
off combat damage or the combat cleanup resolves with a normal FEPR during resolution,
before the result is determined (§466.2).

### Step 3 — Resolution (§466)

Each of the four sub-steps below is followed by a full FEPR window before the next
begins (§466.2, §466.4, §466.6) — anything that triggered gets resolved, and players act,
between determining the result and establishing control.

1. **Combat Cleanup**: units with lethal damage die, then **heal all units**, then
   **recall the attackers if any defender is still standing** (§466.1.a).
2. **Determine the result** (§466.3): a player holding a designation wins if they are the
   only one with units left there. It is **No Result** if attackers were recalled in step
   3d, if both players still have units, or if neither does (§466.3.d) — so the ordinary
   "attackers get sent home" case is *No Result*, not a defender win. If both still have
   units, a fresh showdown and combat are staged and you do it again (§466.3.d.1).
3. **If nothing got re-staged here** (§466.5): establish control, clear Contested, remove
   hidden cards not controlled by the battlefield's controller — a **Conquer** if that
   player hasn't scored it this turn. It does *not* have to be the attacker (§466.5.e).
   If no units remain at all, the battlefield becomes **Uncontrolled** (§466.5.b).
4. Combat ends: designations removed, "this combat" effects expire (§466.7).

**The practical shape of an attack**: you need to kill every defender, or you get
recalled. But an even trade is not simply a loss — a mutual wipe leaves nobody there, so
the battlefield goes **Uncontrolled** (§466.5.b). If the defender controlled it going in,
trading evenly costs them the Hold, which is often worth the cards.

---

## Cleanups

Cleanups are the game's garbage collector, and most of the board's behaviour lives here
rather than in any card. One happens after almost every state change: chain items added
or removed, objects entering or leaving the board, any status change, any completed move,
any phase transition (§319). They repeat until nothing changes (§322).

The order (§323), abbreviated but in sequence:

1. **Someone at ≥ Victory Score with the lead wins.**
2. Assign or remove attacker/defender designations.
3. Death-triggers go on the chain, **then** units with lethal damage die (§323.4–5).
4. Players lose control of battlefields where they have no units — open state only, and
   **not while a showdown or combat is ongoing there** (§323.6).
5. Recall stray gear and runes, and permanents sitting in a foreign base; **trash** any
   hidden card at a battlefield its controller does not control (§323.7) — they go to the
   owner's trash, they are not returned.
6. Stage showdowns at Contested battlefields.
7. Stage combats at **Contested** battlefields where opposing units are both present
   (§323.9).
8. Clear Contested where it no longer applies.
9. Open a staged showdown at a battlefield with **no combat staged**, if in a Neutral
   Open state — turn player picks which (§323.12).
10. Open a staged combat, if in a Neutral Open state — turn player picks which.

Two things to take from that. **Deaths are batched**: damage does not kill on the spot,
it kills at the next cleanup, and everything that died dies together. And **the turn
player chooses the order of multiple fights** (§461.1) — which is a real decision, since
each combat resolves fully before the next opens.

---

## Abilities

Five kinds (§361.1):

- **Passive** — statements of fact; no chain, no activation. They can be conditional
  ("if" / "while", §364.3) and a permanent's are normally only active while it is on the
  board (§365.1).
- **Replacement** — alter another effect before it happens. Spot them by **"as,"
  "would," "instead"** (§369.1).
- **Activated** — `cost : effect`. Uses the chain. **Your turn, open state only**
  (§381), unless it has Action or Reaction.
- **Triggered** — "when," "at," "the Nth time." Goes on the chain when its condition is
  met (§383).
- **Delayed** — created by another ability, fires later at a specified time (§390).

### Triggered abilities worth naming

The rules give these categories their own names because cards refer to them (§383.4):
**Play effects** ("when you play me"), **Targeting effects** ("when you choose me"),
**Conquer effects**, **Hold effects**, **Attack triggers**, **Defend triggers**.

The "you may" position rule catches people (§383.3.a): if **"you may" is the first thing
in the effect**, you decide whether to perform the whole trigger during finalization, and
declining removes it from the chain entirely. If "you may" appears **later**, the trigger
always goes on the chain and you decide on resolution.

Attack and defend triggers **check their condition once per combat** (§383.4.e.2.a), and
if the extra requirements aren't met at that moment they never fire that combat.

**When a trigger reads its information matters, and it splits two ways** (Vendetta FAQ).
Information that comes **from the trigger condition** is frozen when the ability
triggers, not on resolution — Iascylla's delayed trigger means the battlefield she
*held*, whatever has happened since. Information that is merely a **referent** on the
ability ("here", "my") is checked **on resolution** — Azir's attack trigger means
whichever battlefield he is at when it resolves, so moving him from one battlefield to
another just changes which one it means. It mistargets only if he is no longer at a
battlefield **at all** (§359.3.f.2, §359.3.f.2.a).

**Anatomy, in order.** A triggered ability is up to four things, and the slot decides
the timing (Unleashed FAQ, §383.2.a.1, §383.3.b):

1. the **trigger condition** ("when…", "at…", "the Nth time…");
2. a **conditional statement immediately after it**, which is part of the *condition* —
   so Sona's "at the end of your turn, **if I'm at a battlefield**" does not even go on
   the chain unless she is there, while Loose Cannon's "draw 1 **if** you have one or
   fewer cards" sits later and is therefore part of the *effect*;
3. **"you may"**, per the position rule above;
4. a **cost within instructions** in that first slot, which becomes the trigger's **base
   cost and is paid at finalization** — Ekko's "[Deathknell] Recycle me to ready your
   runes" costs you the recycle to put it on the chain at all. Later in the effect, the
   same shape is paid on resolution instead.

**Reflexive triggers** are not a sixth category but a *kind of triggered ability*
(§387): "**do this:**" or "do one of the following" creates a **new chain item** when its
condition is met (§387.1, §388.1), which is what gives everyone a window between the two
halves of one card. They are why so much errata inserts "Then do this:".

### Replacement effects

Each one applies **once to an event, and to anything that replaces that event** (§370.2)
— it cannot chase its own replacement. Across *simultaneous* events it may cover any
number of them, but only in one **uninterrupted sequence** (§373.2, §373.2.a): once
another replacement is applied in between, the events it had not yet reached are out of
reach — *unless* that intervening replacement was itself replacing an event or action
belonging to the first, which does not count as an interruption (§373.2.a.1). If several apply to the same event, the
**controller of the affected object** chooses the order (§372): the affected player if a
player is being acted on (§372.1), and the **turn player** if it is an uncontrolled
battlefield, which by definition has no controller (§372.2). Their instructions
execute before any simultaneous unmodified event (§373.1.a) — the unit that gets saved is
saved before the other one dies.

An **event** is the single moment produced by a game action or a state change
(§370.1.a). Replacing the event is the same as the action never occurring, so nothing
that watches for it triggers (§370.1.a.1). That is exactly what **Skip** does (§443).

**And the converse, which is easy to miss: no event means nothing to replace** (Vendetta
FAQ). Stunning an already-stunned unit performs no stun action, so a replacement effect
waiting on "when I would be stunned" never fires. Same for a buff on a buffed unit, a
`-0` modification, or an action a "can't" effect forbids outright. The game action has to
*actually be performed* for there to be an event at all.

**Replacements inherit the modifications of the effect that generated the event**
(§375, Vendetta FAQ). If Stupefy's "give -1 [M] **to a minimum of 1**" is replaced with
"-2 [M] instead", the replacement carries the minimum along with it.

**"As X happens, do Y" is sequential, not simultaneous** (Vendetta FAQ). The original
event executes first and the added action second, so an ability triggering on the first
event cannot see what the second one did.

### Layers

When effects fight over a value, they apply in three layers, repeatedly until stable
(§476, §477):

1. **Trait-altering** — name, type, tags, controller, cost, domain, **Might assignment**
   ("becomes 4"), and **copy effects**. A copy takes the **printed** traits (or the
   copied ones, if the thing being copied is itself already a copy) — name, supertype,
   type, tags, cost, domain, rules text — and **Might**, which §477.1.b.1.a omits but the
   Vendetta FAQ adds explicitly. It does **not** take statuses or
   temporary modifications: damage, buffs, Empowered, Temporary, attacker/defender all
   stay with the original and whatever the copying object already had stays on it
   (Vendetta FAQ). Each copied instance of an ability is a *separate* ability.
2. **Ability-altering** — granting and removing keywords, passives, rules text.
3. **Arithmetic** — **all increases first, then all decreases** (§477.3.e).

Within a layer, **dependency** wins: if applying A changes what B does but not vice
versa, B depends on A and A goes first (§478–479). Otherwise **timestamp order**, oldest
first (§480).

**Layers evaluate instantaneously** (Vendetta FAQ). There is no window mid-evaluation
in which a unit is briefly 5 Might before an arithmetic effect drops it to 4, so nothing
"becomes Mighty" on the way through. Relatedly, any "becomes X" trigger needs a genuine
**transition into** the state: a unit that never left the state didn't become it again.

**Snapshotting** (§477.3.b): a non-passive arithmetic effect with a limit locks in its
computed value at application time. "-4 [M] to a minimum of 1" on a 2-Might unit becomes
a flat -1 that persists at -1. Passive abilities do not snapshot — they recompute.

---

## Keywords

All 25 in the glossary (§805–§829). Card counts are printings in `data/cards.json` as
of the catalog dated **2026-09-08** — indicative, not asserted, and they move when a set
lands. `X` omitted always means 1.

### Combat

- **Assault X** — §807 · 58 cards. +X Might **while I am an attacker**. Multiple sources
  sum (§807.2). The designation is what matters, not who moved.
- **Shield X** — §814 · 35 cards. +X Might **while I am a defender**. Sums the same way.
- **Tank** — §815 · 32 cards. Must be assigned lethal combat damage before any of your
  units without Tank. Redundant in multiples.
- **Backline** — §826 · 6 cards. Must be assigned lethal damage **after** every one of
  your units without it.
- **Ganking** — §810 · 52 cards. Adds battlefield → battlefield to your standard move.
  No extra cost, no extra move — just a new destination (§810.1.c).

### Timing permissions

- **Action** — §806 · 102 cards. May be **played** (on cards) or **activated** (on rune,
  legend and permanent abilities) during showdowns, on anyone's turn (§806.1.a, §806.1.c).
  Purely additive: the card keeps every timing it would otherwise have (§806.2), and
  Action changes nothing about how it resolves (§806.3).
- **Reaction** — §813 · 131 cards. Everything Action grants, **plus** closed states —
  i.e. responding to things on the chain. The most common keyword in the game.

Both are permission only: a unit with Reaction still enters at a legal location under
the normal rules (§813.3.a).

### Cost modifiers

- **Accelerate** — §805 · 41 cards. Optional additional `[1][C]` as you play: the unit
  **enters ready**. It's a replacement, not a ready-up, so nothing that watches for units
  becoming ready triggers (§805.6.a). Paid at play time only — never from the board.
- **Deflect X** — §809 · 72 cards. **Opponents'** spells and abilities that target me
  cost X more Power, per time they choose me (§809.1.c). Payable with any domain's Power
  (§809.1.c.1). Multiple sources sum (§809.2). It's a mandatory additional cost, so it
  can simply price a removal spell out of reach.
- **Repeat [cost]** — §820 · 24 cards. An optional additional cost; **each instance you
  pay executes the resolution instructions one additional time** (§820.3), so two paid
  instances means three executions. Each instance is paid or skipped individually and
  each only once (§820.1.c.2–.3). Choices for the extra executions are made up front and
  may differ (§820.2.a). Still only *played* once (§820.3.a).
- **Flow [cost]** — §829 · 18 cards. **Play this spell from your trash** for an alternate
  cost, then banish it. The banish is a **delayed replacement effect on leaving the
  chain** (§829.1.b.1): *any* exit the spell's own execution didn't instruct becomes a
  banish, so a Flow spell that is countered and returned to hand goes to Banishment
  instead (Vendetta FAQ). Doesn't change *when* you may play it, only *where from*
  (§829.1.b.2).

### Placement and concealment

- **Hidden** — §811 · 61 cards. Pay `[A]` **during an Open State on your turn** to put
  the card **facedown at a battlefield you control**, for as long as you control it (one
  per battlefield, §811.1.b). **From the next turn on it gains Reaction and may be played
  ignoring its base cost.** Three separate catches. A hidden **permanent must** be played
  to that battlefield — no exception, and this overrides gear's normal base-only
  restriction (§811.1.d.1, §811.1.d.1.a). **Each target individually** must be chosen from
  that battlefield unless *that target's own* restriction makes it impossible (§811.1.d.2,
  §811.1.d.2.a) — one target can be pinned to the battlefield while another on the same
  card is free. Third: if a hidden card causes you to **play a unit**, that unit must go to
  that battlefield too (§811.1.d.3). And a hidden spell with no legal target under these
  rules cannot be played from hidden at all (§811.1.d).
- **Ambush** — §822 · 23 cards. May be played to a battlefield **where you already have
  units**, and has Reaction while being played that way (§822.1.b). Also appears as a
  verb meaning "play with Ambush's permissions" (§822.1.d). The permission is re-checked
  through finalization: if there are **no units at all** at that location by the time it
  completes, Ambush no longer authorises the play (§822.3).
- **Temporary** — §816 · 35 cards. Dies at the start of its **current controller's**
  Beginning Phase, **before scoring** (§816.1.b–c) — so it can never Hold for whoever
  holds it. Steal one and it dies on *your* Beginning Phase. Multiple instances are
  redundant and trigger only once (§816.2.a) — but that counts only instances that
  *could* trigger, so an inactive printed Temporary on attached Equipment does not
  suppress an active granted one (Unleashed FAQ).

### Triggers

- **Deathknell** — §808 · 27 cards. "When I die." Goes on the chain *before* the card
  reaches the trash (§808.1.d.2). **If the death is replaced — recalled, saved — the
  trigger is removed from the chain** (§808.1.d.1).
- **Vision** — §817 · 15 cards. "When this is played, predict" — but the real trigger is
  the permanent **entering the board** (§817.1.c), so it fires even when something puts
  it there without playing it. Multiple instances trigger separately, each with its own
  recycle choice, and if you don't recycle and nothing intervenes between resolutions
  they see the same card (§817.2.a–b).
- **Hunt X** — §823 · 15 cards. Both a conquer and a hold effect: **gain X XP when I
  conquer or hold** (§823.1.c.1). Multiple sources sum into one payout (§823.2).
- **Weaponmaster** — §821 · 20 cards. A play effect: you **may** choose an Equipment you
  control and pay its Equip cost **reduced by [A]**, ignoring Equip's normal timing, to
  attach it to me. The Equip ability is not actually activated, and **the Weaponmaster
  unit is not chosen** — unlike Equip, it is not a target (§821.1.c.6). Multiple
  instances trigger separately (§821.1.c.7).

### Equipment

- **Equip [cost]** — §818 · 55 cards. Activated ability on Equipment gear: attach this
  to a unit you control. The unit is a target (§818.1.b.1).
- **Quick-Draw** — §819 · 6 cards. The gear has Reaction inherently and attaches itself
  to one of your units when played (§819.1.d).

### Conditional (dependent keywords)

These have the shape `[Keyword][>] text` — the text is **inactive** until the condition
is met (§727.1.b), though other effects can still see it (§722.1).

- **Legion** — §812 · 15 cards. Active if **you have played another card this turn**.
  One card satisfies every Legion on your board (§812.2). A countered card still counts —
  it was finalized (§419.4.b).
- **Level N** — §824 · 29 cards (N = 3, 6, 11, 16). Active while you have **N or more
  XP**. Rechecked continuously, and it follows the *current* controller's XP (§824.1.c.1).
- **Empowered** — §828 · 70 cards. Active while the card has the **Empowered** status.

If a **single ability** carries several dependent keywords (`[Level 11][>>][Legion][>] …`),
all of their conditions must hold for that ability to be active (§727.1.b.3). Separate
dependent abilities on the same card each switch on independently.

### Vendetta's mechanic

- **Empower [cost]** — §827 · 53 cards. An activated ability: pay the cost to give
  **this** the Empowered status. Only usable if not already Empowered (§827.1.c.1).

**Empowered** (the status, §441) is binary (§441.1.a) and **permanent** — it lasts until
the card leaves the board or something Disempowers it (§442). Card text can override
that: Kayle, Justified stacks up to 3 empowered statuses via the golden rule, her Empower
may be activated even while empowered, and **Disempower removes exactly one instance**,
not all of them (Vendetta FAQ). It does nothing by itself; it is
the switch that `[Empowered][>]` abilities read.

### Deckbuilding only

- **Unique** — §825 · 3 cards. One copy per deck by name. No gameplay effect at all.

---

## Bracketed terms that are not keywords

Cards print game actions in brackets exactly like keywords, with no visual distinction.
These six appear in `data/cards.json` and are defined in the rules body rather than the
keyword glossary — **Game Actions** (§407) for Add, Stun, Buff, Predict and Burn,
**Additional Rules** (§700) for Mighty and the buff counter itself. `data/rules.json`
records which is which, and `check.mjs` asserts that every bracket on every card resolves
to one of them.

- **[Add]** — §429 · 50 cards. Put resources in your rune pool. Add abilities
  **resolve immediately on finalizing** and never pass priority (§429.2).
- **[Stun]** — §423 · 18 cards. Binary status. A stunned unit **contributes no Might to
  combat damage** but still needs its full Might in damage to die (§423.1.b–c). Wears
  off at end of turn. Stunning an already-stunned unit does nothing, and doesn't trigger
  "when you stun" (§423.1.a.1).
- **[Buff]** — §426, §701 · 12 cards. A counter worth **+1 Might** (§703). **One at a
  time** (§702.3) — buffing an already-buffed unit does nothing and triggers nothing. But
  buffs can be **spent** as a cost (§702.2.b), which frees the slot for another, and some
  effects explicitly permit multiple buffs (§426.1.b.2).
- **[Predict X]** — §436 · 9 cards. Look at the top X, recycle any number, put the rest
  back in any order. Never causes a Burn Out (§436.4.a).
- **[Burn X]** — §440 · 9 cards. Top X of your Main Deck to your trash. **Can** burn you
  out (§440.4).
- **[Mighty]** — §706 · 14 cards. Not an action either — a description. A unit **is
  Mighty while its Might is 5 or greater** (§708), evaluated on current Might on the
  board and **printed Might everywhere else** (§710–711). "Becomes Mighty" fires only on
  crossing the threshold from below (§709).

---

## Symbols on cards

`data/cards.json` stores Riot's symbol codes verbatim. The mapping to the rules'
shorthand:

| in card text | rules | means |
|---|---|---|
| `:rb_energy_N:` | `[N]` | N Energy (§131.2) |
| `:rb_rune_fury:` | `[R]` | Fury Power — red (§134.2.a) |
| `:rb_rune_calm:` | `[G]` | Calm Power — green (§134.2.b) |
| `:rb_rune_mind:` | `[B]` | Mind Power — blue (§134.2.c) |
| `:rb_rune_body:` | `[O]` | Body Power — orange (§134.2.d) |
| `:rb_rune_chaos:` | `[P]` | Chaos Power — purple (§134.2.e) |
| `:rb_rune_order:` | `[Y]` | Order Power — yellow (§134.2.f) |
| `:rb_rune_rainbow:` | `[A]` | Power of **any** domain (§135.2.e.5) |
| `:rb_might:` | `[M]` | Might (§135.2.e.3) |
| `:rb_exhaust:` | `[E]` | "exhaust this" as a cost (§135.2.e.2) |
| — | `[C]` | Power matching **this card's own** domain (§135.2.e.6). Multi-domain: any of them. No domain: reads as `[A]`. **In an Accelerate cost** all three modern FAQs say a multi-domain unit's `[C]` becomes `[A]` — any domain — which contradicts §135.2.e.6.c's Tibbers example. The FAQ post-dates the rules and wins, but it is unchanged boilerplate across three sets, so worth a judge call. |
| — | `[>]` | separates a keyword from the ability it governs (§135.2.e.7) |

Older material used `[T]` for exhaust and `[S]` for Might; the rules note both changes
explicitly (§135.2.e.2–3).

---

## Special terms

The rules define ordinary-sounding words precisely (§740):

- **Friendly** — shares a controller, or controllers are teammates. **Enemy** — the
  controllers are opponents (§740.1).
- **Alone** — no other *friendly* unit at the same location (§740.2.a).
- **One on one** — this unit and the enemy unit at its location are both alone
  (§740.2.b).
- **In combat** — at a battlefield where combat is ongoing **and** carrying a designation
  (§740.2.c).
- **Occupied / uncontrolled / open** for battlefields: has a unit / nobody controls it /
  **neither — unoccupied *and* uncontrolled** (§170.11.a–c). "Open" is the empty one.
- **Tie** — units of different players still present at step 3d of the combat cleanup
  (§740.3.a).

**Naming a card** (§759, Vendetta FAQ): you may not name something that does not exist
in Riftbound, and the name has to **identify one card unambiguously**. It need not be the
printed name — "the red Kai'Sa", "the [3] spell with Flow that makes tentacles" all work
— but bare "Kai'Sa" fails when two cards answer to it.

**XP** (§728) is a player resource, public, unbounded, not a game object, and not shared
between teammates. It is what **Level** reads and what **Hunt** generates.

**Counters** (§741) are game objects but **cannot be targeted** (§704.1). They vanish
when the card leaves the board (§748).

**Untargetable** (§756): if something becomes untargetable *after* being targeted, the
spell **mistargets** on resolution rather than being countered (§758.1). And it can swing
back — if the spell or the object changes such that the restriction no longer applies,
it becomes a legal target again (§758.2).

---

## Things that are not what they look like

A list of the rulings most likely to be got wrong, each verified against the text.

- **Recalls are not moves** (§456). They don't trigger "when I move," and effects that
  stop movement don't stop them.
- **Banish is not a kill and not a discard** (§427.2). Deathknell does not fire.
- **Attaching is not a move** (§434.4.a), and attaching doesn't change ready/exhausted
  state (§434.5).
- **Assigning damage is not dealing damage** (§417.1.a). Assignment happens first for
  everyone, then it is all dealt at once.
- **Hiding is not playing** (§811.1.c.1) and doesn't open a chain — but playing *from*
  hidden does (§811.1.c.3).
- **A countered card was never played** for triggers (§425.1.b), but it *was* finalized,
  so Legion still counts it (§419.4.b). Costs are not refunded (§425.1.c).
- **Tokens are not cards** (§185), and can never become them (§185.1.a) — nor can a card
  become a token (§185.1.b). Separately,
  inside *card effects* "card" means Main Deck card, so runes, legends and battlefields
  aren't cards there — though they remain cards for the rules themselves (§052). A token
  in any non-board zone except the chain ceases to exist (§186.1).
- **A unit is Mighty at 5, not at 5 base** (§710) — current Might on board, printed Might
  in the trash.
- **A gear that is also a unit** keeps every unit property: it enters exhausted, can
  move, has Might, and is hit by both "kill all units" and "kill all gear" (§178).
- **Effect Text is inactive unless attached** (§724); a card's **printed** Rules Text
  goes inactive when attached (§718.2) — **granted** Rules Text stays live. So attached
  Equipment still dies to a granted Temporary and still charges a granted Deflect, while
  its own printed abilities are off. An equipment sitting in your base has its Effect
  Text off but its Rules Text live (§723), which is why you can activate Equip there.
- **The Chosen Champion can't go home by normal means** (§108.3.c) — but an effect that
  instructs the return succeeds if the Champion Zone is empty (§108.3.c.1). It plays from
  the Champion Zone, and a second copy in hand is also "your Chosen Champion" for every
  rule that cares (§103.2.a.3).
- **You can decline an instruction that names a type *or quality* of card in a secret
  *or* private zone** (§128.6) — your hand and your decks both. "Play a unit from your
  hand, ignoring its cost" is optional in practice even without "may", and so is anything
  reaching into your Main Deck for a named quality.

---

## Errata

Riot errata cards rather than reprinting them, and the errata is binding. Four rounds so
far. The overwhelming majority are one change made over and over: **rewriting "pay X. If
you do, Y" into "pay X to Y"**, which converts a two-step instruction into a proper
*cost within instructions* (§740.4.a) — the difference is whether the effect checks that
a cost was *paid* or that an action was *performed*, which matters when a replacement
effect intervenes (§205).

- **Origins**, 2025-10-28 — much the largest round. The ones that change play:
  **Zhonya’s Hourglass** became "**If** a friendly unit would die" (from "the next
  time"), **Highlander** and **The Boss** became "heal it, exhaust it, and recall it,"
  and a family of "play from among them" cards became "**banish** it, then play it."
- **Spiritforged**, 2026-01-14. `Do this N times` was expanded into repeated
  instructions on **Falling Star** and **Icathian Rain**; **Jax, Unmatched** widened to
  "your Equipment **everywhere** have Quick-Draw"; **Tianna Crownguard** changed "score
  points" to "**gain** points," which is a real difference (§468.1).
- **Unleashed**, 2026-04-03 — nearly all of it inserting "**Then do this:**" to make a
  reflexive trigger explicit (§387). **Rengar, Trophy Hunter** was reworded to use
  `[Ambush]` as a verb.
- **Vendetta**, 2026-07-23. Mostly the pay-to-do rewrite (**Draven,
  Vanquisher**; **Diana, Lunari**; **Emperor's Dais**), plus **Astral Heron** and
  **Gangplank, Naval** gaining the missing "**this turn**" duration.

Current text always wins over the printed card, and these summaries are not a
substitute for the pages — read them when a specific card matters:
[Origins](https://playriftbound.com/en-us/news/rules-and-releases/riftbound-origins-card-errata/) ·
[Spiritforged](https://playriftbound.com/en-us/news/rules-and-releases/riftbound-spiritforged-errata/) ·
[Unleashed](https://playriftbound.com/en-us/news/rules-and-releases/unleashed-errata-updates/) ·
[Vendetta](https://playriftbound.com/en-us/news/announcements/vendetta-errata-updates/)

---

## Modes

| mode | players | victory | battlefields | notes |
|---|---|---|---|---|
| **1v1 Duel** | 2 | 8 | 2 (1 each) | best of 1; battlefield chosen at random from your 3 (§485) |
| **1v1 Match** | 2 | 8 | 2 (1 each) | best of 3; **you choose**, and a battlefield used in a *decided* game is retired for the match. After a draw the same ones *may* be reused (§486.5.a) — and in sanctioned play **must** be (TR §406.1.b) |
| **FFA3 Skirmish** | 3 | 8 | 3 | §487 |
| **FFA4 War** | 4 | 8 | 3 | first player's battlefields are removed (§488) |
| **2v2 Magma Chamber** | 4 | **11** | 3 | shared points, alternating turn order, teammates may act on your turn when invited (§489) |

In every multiplayer mode the player going **first skips their first draw**, and the
player going **last channels an extra rune** (§487.7). In 1v1 only the extra rune applies
(§485.7).

Best-of-5 matches may reuse a battlefield in games 4 and 5, but only once all **three**
you registered have been presented, and never more than twice (§486.6.a).

**2v2 has its own rules worth knowing** (§489.8): control is not shared, you can't hide
at your teammate's battlefield or issue *standard movement* to their units — card effects
that move a friendly unit still can, since "friendly" includes them — points *are* shared, "friendly"
includes their units, teammates can't share a Legend or a battlefield, and battlefields
your teammate controlled at your scoring step are disqualified from your team scoring
them that turn.

---

## Tournament rules worth carrying

- **Registration** — exactly 40 main, 1 Legend, 12 runes, 3 uniquely-named battlefields
  (TR §402.1).
- **Sideboard** — ≤10 cards, each a **valid Main Deck card** for your deck (type, domain
  identity and format legality — not merely a main-deck type), 3-copy limit shared with
  the main deck (TR §601.1.c). Enforced by `scripts/state.mjs`.
- **Matches** are best of 3 by default; draws don't count toward the two wins, and on
  time the winner is whoever has more game wins (TR §404).
- **You may count your opponent's sideboard at any time** (TR §403.6).
- **Conceding** removes you from the game; in a team mode your teammate loses too
  (§651.4). A removed player's cards are banished and their battlefield is replaced with
  a blank token battlefield (§652).
- Bans are per-format and live in `data/banned.json`; Riot bans outright rather than
  restricting.

---

## Keeping this current

```
node scripts/build-rules.mjs           # rebuild only if Riot's date moved
node scripts/build-rules.mjs --force   # rebuild regardless
```

```
node scripts/build-errata.mjs          # the card-text corrections
```

The builder reads the Rules Hub for the current PDF URLs — they are content hashes, so
every revision is a new URL and a hardcoded link would silently serve last set's rules
forever. It also reads the **Rules and Releases** news index, because that is the only
place the FAQs and errata pages appear; what it compares between runs is a **hash of
each page's text**, since a ruling edited in place keeps its publish date. It reports
what moved and fails loudly if a bracket on a card no longer resolves to a rule.

`node scripts/check.mjs` asserts, offline, that `docs/rules-full.md` matches its stamp,
that every bracketed term in the catalog resolves, that both consumers apply the errata
overlay, and that **every `§` cited in this file exists in the right rulebook** — the two
number independently and collide on 146 numbers, which is why tournament citations are
written `TR §`. A rule number invented here fails the build.

What none of that can check is whether a claim *attached* to a real rule is true. Four
audit passes against the verbatim text found 59, then 15, then 3, then 4 defective
claims. Assume a residue.

The rules have moved four times in a year — Origins, Spiritforged, Unleashed, Vendetta —
so assume this file is one set behind until the builder says otherwise.
