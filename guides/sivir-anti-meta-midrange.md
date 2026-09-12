---
title: Anti-Meta Sivir Midrange — Deck Dossier
subtitle: Riftbound, Vendetta season
author: rift toolchain
date: 2026-09-12
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 8 of 10
**Collection status:** complete — 0 cards still to get, $0.00 gap
**riftbound.gg tier:** Tier 4, #6 (24th of 49 ranked champions)

## 1. What this deck is

It does not race. It wins by making every fight happen somewhere the opponent
didn't choose, at a Might total they didn't plan for, with the card that would
have saved them already stripped out of their hand.

Three things do that work:

- **Forced repositioning.** Irresistible Faefolk, Evelynn, and Tideturner drag
  or displace enemy units. Gust, Star-Crossed and Flash undo positioning
  entirely.
- **Hand and combat disruption.** Sabotage strips a non-unit before it matters.
  Punch First and Switcheroo win the combat-math argument after blockers are
  committed.
- **A slow, grinding resource edge.** Every Power you spend recycles a rune,
  and every recycled rune is a Battle Mistress trigger. Traveling Merchant
  loots on every move; Seat of Power draws on a spread board.

Sivir herself is a single copy and a payoff, not a plan. Baron Nashor is the
two-copy finisher the disruption is meant to survive toward.

## 2. The engine, and the timing detail that matters

**Battle Mistress** — *"When you recycle a rune, you may exhaust me to play a
Gold gear token exhausted. When one or more enemy units die, ready me."*

Recycling a rune is not a niche event: it is *how you pay every Power cost in
the game* (rules 164.2.b). Twenty-three of your forty cards cost Power, so
Battle Mistress triggers on almost every turn you do anything.

The detail the card's own wording hides: **the Gold token enters exhausted, and
a Gold token's ability is "Kill this, {exhaust}: Add 1 rainbow Power."** An
exhausted token cannot pay that exhaust cost. It readies in your next Awaken
Phase (rule 415.3.a). So:

> A Gold token made this turn is **next turn's** Power, not this turn's.

That is still excellent — it is the only resource in the deck that produces
Power *without consuming a rune*, and because it's a Reaction it can be cracked
mid-combat or mid-chain. But never sequence a turn assuming you can cash a token
you just made.

The ready clause is the other half. *Any* enemy unit dying readies her — combat,
Challenge, a chump trade at a battlefield you don't even contest — so in a turn
with kills she can produce more than one token.

**Sivir, Mercenary** (4 Energy / 1 Chaos Power / 4 Might, Accelerate) —
*"If you've spent at least 2 rainbow Power this turn, I have +2 Might and
Ganking."* Two Power of **any** domain, in any combination. Punch First (2 Body
Power) or Switcheroo (2 Chaos Power) clears it single-handed; so does any pair
of 1-Power cards; so does her own casting cost plus one more. A 6-Might
Ganking body for 4 Energy is above rate, and you will clear the threshold by
accident more often than on purpose.

## 3. Rune math — read this before you plan a Baron turn

You channel exactly 2 runes per turn (rule 315.3.b) and your rune deck is
exactly 12 (rule 402.1). The part that's easy to get wrong is that a rune's two
abilities have **different costs**, so you can use both on the same rune:

- **Exhaust it** → add 1 Energy (rule 164.2.a).
- **Recycle it** → add 1 Power of its domain (rule 164.2.b). Recycling costs
  "recycle this," *not* exhausting — so an already-exhausted rune can still be
  recycled. The FAQ names this as the standard idiom: "take an additional ready
  rune, exhaust it, and then recycle that same rune."

So the ceiling with N runes on board is **N Energy and N Power in the same
turn**, not N total. Twelve runes is twelve of each.

Pricing the finisher (10 Energy / 3 Chaos Power):

| Line | Runes on board needed | Earliest |
|---|---|---|
| Baron Nashor, hard cast | 10, of which ≥3 Chaos | turn 5 |
| Baron via Here to Help (hidden, so free) | 7, of which ≥3 Chaos | turn 4 |

Hard-casting him is fine: exhaust ten runes for ten Energy, then recycle three
of those same exhausted Chaos runes for the Power. The binding constraint isn't
the total, it's the **domain split** — your three Chaos Power has to come from
the six Chaos runes in a twelve-rune deck, and Punch First wants two *Body*
runes on the same turn. Look at what's on the board, not just how much.

The real cost of Power is paid **next** turn. A recycled rune leaves the board
and goes back to the rune deck (161.2.b), and you only re-channel two per turn,
so a three-Power turn shrinks your next turn's ceiling by three. A Baron turn
at twelve runes leaves you at nine, then eleven, then back to twelve. Plan the
turn after the big turn.

Which is exactly what Battle Mistress is for: a Gold token is one Power that
**doesn't cost you a rune**, so it's the only thing in the deck that breaks the
shrink cycle. Bank tokens on the cheap turns to pay for the expensive ones.

**Here to Help** is still the best Baron line — it's a full turn faster and it
leaves five runes untouched for protection — but it's an accelerant, not a
requirement. Hidden on an earlier turn it costs nothing at all to play (rule
811.1.b: a card played from Hidden ignores its *entire* base cost, Power
included), and played from Hidden it must play the unit at the battlefield it
was hidden at (rule 811.1.d.3).

### Does Here to Help even work on Baron?

Yes — the two effects sit on different layers and never argue.

- Here to Help settles the **play location**. You choose it as you play him
  (rule 355.2), and a battlefield you control is already a legal place to play
  any unit by default (355.2.a), so Here to Help isn't granting permission —
  it's naming the location that earns the discount. The cost reduction is
  applied while paying, well before he enters.
- Baron's *"I enter there"* is a **replacement effect on entering** (rule
  369.3), which swaps "entering at his original play location" for "entering at
  the Baron Pit."

The FAQ settles it directly, in the Mageseeker Warden discussion: Baron "enters
at the Baron Pit regardless of effects preventing him from being played to
battlefields… The replacement effect gets around effects like Mageseeker Warden
which limit where you can play units." Play-location rules and his entering
replacement are independent. Here to Help resolves, you keep the 3 Energy, and
he lands in the Pit.

**But read his trigger again, because you run two of him:**

> "add the Baron Pit battlefield token to the board **if it's not there
> already**. **If you do**, I enter there."

The redirect is conditional on *creating* the Pit — rule 369.3 spells this out,
"entering at the Baron Pit **if it was created**." So:

| | Where he enters | What Here to Help bought you |
|---|---|---|
| **First Baron** | The Baron Pit, always | Only the 3 Energy — the location you chose is discarded |
| **Second Baron** (Pit already up) | Exactly where you played him | The 3 Energy **and** the placement |

So Here to Help is a discount on Baron #1 and a genuine deployment tool on
Baron #2 — that's the copy you can drop straight onto a contested battlefield.

Being sent to the Pit isn't a punishment, either. His +2 Might aura has no
location clause, so it pumps your whole board from anywhere, and a Baron
standing alone on a brand-new uncontested battlefield conquers it (rule 469.1),
which hands you control of a fourth battlefield and one more card off Seat of
Power. The catch is mobility: "Units can move here from anywhere" describes
moving *in*, not out, so without Ganking he's parked there for a while.

## 4. The forty

Text below is current text, with Riot's errata applied — four of your cards no
longer read the way they're printed. See §13.

### Repositioning and displacement — 11 cards

- **Gust** (1E, Chaos, Reaction) — return a unit at a battlefield with 3 Might
  or less to its owner's hand. Cheapest answer in the list, and the only one
  that is *permanent* against tokens (see §8, Azir).
- **Star-Crossed** (3E / 1 Chaos, Reaction) — returns a friendly **and** an
  enemy unit. Both halves are mandatory; no Might cap. Budget a spare body.
- **Flash** (2E, Chaos, Reaction) — move up to 2 friendly units to base. Purely
  defensive; it does nothing to the opponent. The weakest card in the 40 and
  your first board-out slot.
- **Tideturner** (2E, Chaos, Hidden, 2 Might) — **errata'd**: swaps with a unit
  you control *at another location*. It can no longer shuffle two units standing
  in the same place.
- **Irresistible Faefolk** ×3 (2E, Body, 1 Might) — *when I move to a
  battlefield, you may move an enemy unit to that battlefield.* The deck's best
  two-drop: every move is a forced enemy regroup, and it costs no Power.
- **Evelynn, Entrancing** (2E, Chaos, Hidden, Backline, 2 Might) — hidden, then
  drags an enemy unit from another location to her battlefield on the reveal.
  Unseeable; the reveal costs 0 Energy.

### Hand and combat disruption — 10 cards

- **Sabotage** ×3 (1E / 1 Body) — reveal their hand, recycle a non-unit. In this
  format that is a 32%-of-decks Defy, a 30% Discipline, a 23% Hidden Blade. The
  single highest-value one-mana play you have, and it doubles as perfect
  information for the rest of the turn.
- **Punch First** ×3 (1E / **2 Body Power**) — +5 Might. Enormous, and
  structurally uncounterable by Defy (§7).
- **Switcheroo** ×2 (2E / **2 Chaos Power**, Hidden) — swap two units' Might at
  one battlefield. Also Defy-proof. The clean answer to a single pumped threat.
- **Challenge** ×2 (2E / 1 Body) — your unit and theirs deal Might to each
  other. A precise two-for-one when your bodies are bigger, and it kills an
  enemy unit, which readies Battle Mistress.

### Card flow — 8 cards

- **Traveling Merchant** ×3 (2E, Chaos, 2 Might) — *when I move, discard 1, then
  draw 1.* Not card advantage: card **selection**, plus it fills your trash.
  That second half matters — it's the fuel for Fizz.
- **Stacked Deck** ×3 (1E, Chaos) — look at 3, keep 1. Note it spends **no**
  Power, so it contributes nothing to Sivir's threshold.
- **Fizz, Trickster** ×2 (3E / 1 Chaos, 3 Might) — replay a spell of 3 Energy or
  less from your trash for free, then recycle it; you still pay its Power cost.
  **Every single spell in your deck qualifies.** Fizz is a blank on turn three
  with an empty trash and a two-for-one once Merchant has looted twice or a
  showdown has emptied your hand.

### Bodies, threats and delivery — 11 cards

- **Kha'Zix, Mutating Horror** ×2 (4E / 1 Chaos, 4 Might, Ambush) — +2 Might and
  2 XP when it attacks or defends against a lone enemy unit. **The XP does
  nothing in this list** — there is no Level card and nothing that spends XP in
  the 40. Treat him as a 4/4 Ambush that's sometimes a 6/6, and no more.
- **Rengar, Trophy Hunter** ×2 (5E / 1 Body, 6 Might, Ambush) — errata'd to say
  it plainly: he can Ambush into a battlefield with enemy units *even where you
  have none*. Reach that nothing else in the deck has.
- **Vex, Apathetic** ×2 (4E, Chaos, 4 Might, Deflect) — *"When an opponent plays
  a unit **while I'm at a battlefield**, Stun it. They can't move it this
  turn."* Read the condition carefully: it qualifies **Vex's** location, not the
  new unit's. As written, every unit the opponent plays anywhere comes down
  stunned and frozen for the turn while she stands on any battlefield. There is
  no published FAQ narrowing this; if your playgroup reads it as "here," say so
  before game one, because it's the difference between a good card and the best
  card in the deck. Either way she blanks Ambush, which normally dodges this
  kind of interaction entirely.
- **Baron Nashor** ×2 (10E / 3 Chaos, 12 Might) — can't be chosen by enemy
  spells or abilities; other friendly units get +2 Might (no location clause —
  the aura reaches the whole board). See §3 for how he actually gets cast, and
  for why only your *second* Baron can be aimed at a battlefield. His protection dodges Hidden Blade (23% of decks) and
  every other "choose a unit" removal in the format — but not combat, not
  Flurry of Blades, and not your own sideboard Downwell.
- **Sivir, Mercenary** ×1 — the champion. See §12; you own three.
- **Here to Help** ×2 (2E / 1 Body, Hidden) — play a unit from hand to a
  battlefield you control for 3 less Energy. Hidden on an earlier turn it costs
  nothing at all to play, which makes it the fastest Baron Nashor line in the
  deck — a full turn ahead of hard-casting him, with five runes left over (§3).
  It's also fine on Rengar or Sivir when Baron isn't the plan.

### Battlefields — 3

- **Emperor's Dais** — errata'd: on conquer, pay 1 Energy and return a unit you
  control here to hand *to* play a 2-Might Sand Soldier here. The bounce is now
  part of the cost, not a separate effect. Recurs an enter-the-board trigger
  (Evelynn, Merchant) and leaves a body behind.
- **Forbidding Waste** — a unit defending alone here has -2 Might. Punishes
  every deck that leaves one body home to hold. Note the exact anti-synergy in
  §8: Master Yi's legend gives a lone defender +2, and the two cancel precisely.
- **Seat of Power** — on conquer, draw 1 for each **other** battlefield you or
  allies control. Best pure card advantage in the list, and a 14%-of-format
  staple for the same reason.

## 5. What each card is hunting for

Eight cards in the 40 are conditional — they need something specific to exist
before they do anything. A deck fails quietly when those targets aren't actually
there, so here is the density check on each.

### Here to Help — a discount, not a placement tool

The clause "to a battlefield you control" reads like permission. It isn't. By
default, valid play locations for *any* unit already include your base **or a
battlefield you control** (rule 355.2.a). Here to Help grants nothing you
couldn't already do; it is purely **−3 Energy**.

That reframes when to play it. From hand it costs 2 Energy and 1 Body Power and
a card, to save 3 Energy — a net gain of one Energy for a whole card. **Play it
from Hidden or don't play it.** Hidden, it costs nothing at all on the turn that
matters (rule 811.1.b), and the 1 rainbow you paid to hide it was itself a rune
recycle, so Battle Mistress got a Gold token out of it.

Targets are the nine units costing 4+ Energy — 22% of the deck:

| Target | Normal | Via Here to Help | Verdict |
|---|---|---|---|
| **Sivir + Accelerate** | 5E + 2 Chaos | **2E + 2 Chaos** | The best target in the deck |
| Baron Nashor, 2nd copy | 10E + 3 Chaos | 7E + 3 Chaos | Yes — the copy you can actually aim (§3) |
| Baron Nashor, 1st copy | 10E + 3 Chaos | 7E + 3 Chaos | Discount only; he leaves for the Pit |
| Vex / Kha'Zix | 4E | 1E | Fine, unexciting |
| Rengar | 5E + 1 Body | 2E + 1 Body | Usually worse than just Ambushing him |

**The Sivir line is the one to learn.** Hide Here to Help on turn two for 1
rainbow Power. Next turn, play it free, play Sivir, and pay Accelerate: 4E + 1
Chaos base, plus Accelerate's 1E + 1 Chaos, minus 3E — discounts reduce
additional costs too (rule 356.4.f) — for **2 Energy and 2 Chaos Power**. Two
Chaos runes pay the entire bill: exhaust both for the Energy, then recycle those
same two for the Power (§3). And those 2 Chaos Power *are* her threshold, so she
lands **ready, 6 Might, with Ganking**, off two runes, as early as turn three.

The one string attached: played from Hidden, she must enter at the battlefield
you hid at (rule 811.1.d.3). She has Ganking, so she can leave immediately.

### Fizz — every spell is legal; the trash is the constraint

All twenty spells in the deck cost 3 Energy or less, so Fizz never lacks a
*legal* target. He lacks a *populated* trash. Traveling Merchant's loot is your
only proactive way to fill it, which makes the sequence explicit: move Merchant,
discard the spell you want back, then cast Fizz.

### Gust — density swings hard by matchup

Across all 424 lists, 27% of an average main deck is a unit of 3 Might or less
(58% of unit copies). By opponent, as a share of that archetype's units:

| Opponent | Gust-legal | Read |
|---|---|---|
| Irelia — Blade Dancer | 75% | Excellent. Stellacorn Herder is exactly 3 |
| Diana, Vex/Gloomist, Lillia | 65–66% | Strong |
| Fiora, Master Yi, Viktor, LeBlanc | 58–60% | Fine |
| Kennen | 53% | Fine |
| Zed — Master of Shadows | 49% | Understated: Shadow Clones are 0-Might tokens |
| Azir — Emperor of the Sands | 26% | Misleading: their board is 2-Might tokens |

Tokens never appear in a decklist, and tokens are exactly where Gust is at its
best — bounced to hand, they cease to exist (rule 186.1). Read the two bottom
rows as *better* than the number, not worse.

### Sabotage — strongest where you'd least expect

Share of each archetype's main deck that is a non-unit, i.e. a legal grab:

| Opponent | Non-unit share |
|---|---|
| **Azir — Emperor of the Sands** | **91%** |
| Irelia, Lillia | 64–67% |
| Diana, Master Yi, Viktor | 53–58% |
| Fiora, Vex/Gloomist, Kennen | 48–52% |
| Zed, LeBlanc | 42–43% |

Against Azir, nine of every ten cards is Equipment or a spell — Sabotage is very
close to a guaranteed hit, and the card you take is usually Hidden Blade or
Arise!. Zed and LeBlanc are the whiff risks, and Zed is also the deck where
recycling a card half-helps them (§9).

### Kha'Zix — needs a *lone* enemy, and you have to build it

+2 Might and 2 XP only when a single enemy unit is at his battlefield. Nothing
gives that to you for free: Faefolk drags one body in, or Gust removes the
second. Set up first, Ambush second. Without the setup he is a vanilla 4/4 — and
the 2 XP is dead either way (§4).

### Emperor's Dais — eight units are worth the bounce

The conquer trigger returns one of your units here to make a 2-Might Sand
Soldier. That's only value if the returned unit has an enter-the-board trigger
worth replaying: Traveling Merchant ×3, Tideturner ×2, Fizz ×2, Evelynn ×1 —
eight of your twenty units. On any of the other twelve you are trading a real
body for a token.

### Switcheroo — wants a gap, not a target

Dead on an even board; best the moment they commit one oversized unit. Your
*smallest* body is the resource that makes it work, which is another quiet
argument for three Irresistible Faefolk at 1 Might.

## 6. What the format actually plays

424 public and tournament lists, 2026-07-12 to 2026-09-10. Percentages are the
share of decks running at least one copy.

| Card | Decks | Cost | What it does to you |
|---|---|---|---|
| Defy | 32% | 1E / 1 Calm | Counters a spell costing ≤4E and ≤1 Power |
| Discipline | 30% | 2E Calm | +2 Might, draw 1 — at Reaction speed |
| Stupefy | 25% | 1E Mind | -1 Might (min 1), draw 1 |
| Hidden Blade | 23% | 2E / 1 Order | Kills a unit at a battlefield; you draw 2 |
| Charm | 22% | 1E / 1 Calm | Moves *your* unit wherever they like |
| Back Off | 18% | 3E Calm, Hidden | Stuns a unit, draws them a card |
| Star-Crossed | 17% | 3E / 1 Chaos | The mirror of your own bounce |
| Not So Fast | 12% | 2E / 1 Calm | Counters anything that chooses their unit |
| Deathgrip | 10% | 2E Order | Sacrifices a unit to pump another, draw 1 |

## 7. Playing around the top four

**Defy (32%)** counters a spell costing *no more than 4 Energy and no more than
1 rainbow Power*. Check your suite against that line:

| Counterable | Cost | Structurally immune | Cost |
|---|---|---|---|
| Gust | 1E / 0 | **Punch First** | 1E / **2 Body** |
| Flash | 2E / 0 | **Switcheroo** | 2E / **2 Chaos** |
| Stacked Deck | 1E / 0 | | |
| Sabotage, Challenge, Here to Help | ≤2E / 1 | | |
| Star-Crossed, Fizz | 3E / 1 | | |

Punch First and Switcheroo cost two Power. They are over the cap, full stop,
and no amount of Calm mana changes that. Lead with an expendable cheap spell to
draw the Defy, then land the real play. And your own **Hard Bargain** from the
sideboard taxes their counter by 2 Energy — hold it up on the turn you expect
the blowout.

**Discipline (30%) and En Garde (14%) break Gust.** Gust checks Might on
resolution. They respond with +2 (or +1/+2 alone), the target is now 4 or 5
Might, the spell has no legal target and does nothing. Against any Calm deck,
either Gust in a window where they're tapped low, or accept that Gust is your
bait spell and Switcheroo is your real removal.

**Hidden Blade (23%) unconditionally kills** any unit at a battlefield — Vex's
Deflect only taxes it 1 Power, and Kha'Zix, Rengar, Fizz and Sivir all just die.
Baron Nashor does not. It's the strongest argument for keeping your important
bodies in base until the turn they matter.

**Zhonya's Hourglass (14%)**, errata'd, now *heals* the protected unit,
exhausts it and recalls it to base. Killing through it doesn't remove the unit
from the game, it resets it. Bouncing the unit instead sidesteps the Hourglass
entirely.

## 8. Matchups

Ordered by how often the archetype actually appeared in the 60-day window —
which is a different order from the tier list, and the more useful one.
Card-frequency lines are copies of that legend's lists running the card.

### Zed — Master of Shadows · 29 decks (most-played in the format) · Tier 5, #2

*Fury/Chaos.* **Staples:** Death Mark (29/29), Zed, Without a Sound (28/29),
Zaun Warrens (26/29), Traveling Merchant (26/29), Perfect Execution (25/29),
Shadow Order Disciple (21/29), Minefield (20/29), Up from the Deep (18/29).

The single deck you are most likely to sit across from, and the old tier list
has it in Tier 5. It self-mills (Death Mark's Burn 3, Minefield, Zaun Warrens'
loot) to empower the legend, then replays spells from the trash via Flow —
Death Mark for 1E + 2 Power, Perfect Execution for 3E + 1 Fury, Up from the Deep
for 3E. Shadow Clone tokens carry Assault 4 by banishing units from the trash.

- **Their plan:** flood cheap Shadow Clone tokens, ready and pump one attacker
  with Perfect Execution, and grind value from a trash that never runs out.
- **Your answer:** Shadow Clones are 0-Might **tokens**. Every Gust on one is a
  permanent kill (rule 186.1 — a token put into any non-board zone ceases to
  exist), and every clone that dies readies Battle Mistress. Vex is excellent:
  she taxes their token flood and stops Zed's swap line cold. Forbidding Waste
  punishes the lone clone left to hold.
- **Watch for:** their engine *wants* cards in the trash, so Sabotage is far
  weaker here than elsewhere — recycling a card is close to helping them. Save
  it for a hand-read, not a resource denial.

### Fiora — Grand Duelist · 20 decks · Tier 2, #4

*Body/Order.* **Staples:** Riposte (20/20), Sunken Temple (20/20), Punch First
(15/20), Rampage (15/20), First Mate (12/20), Pit Rookie (12/20), Hidden Blade
(12/20), Harnessed Dragon (12/20), B.F. Sword (12/20).

Everything keys off **Mighty** (5+ Might). The legend channels a rune whenever a
unit becomes Mighty; Sunken Temple draws when Mighty units conquer; Fiora,
Victorious gains Deflect, Ganking and Shield while Mighty.

- **Their plan:** get one unit to 5 Might and keep it there, converting each
  threshold crossing into cards and runes.
- **Your answer:** **Switcheroo is your best card in the format here.** Swapping
  a 6-Might Fiora with your 1-Might Faefolk turns off Deflect, Ganking, Shield
  and Sunken Temple simultaneously, and it can't be Defied. Gust catches their
  small bodies (Pit Rookie 2, First Mate 3) before a buff lifts them out of
  range.
- **Watch for:** **Riposte** (2E / 2 Power) counters a spell *and* pumps their
  unit by that spell's Energy cost. Your Star-Crossed makes their unit +3. It is
  in 20 of 20 lists. Assume it is live every single game, and bait it with Gust.

### Vex — Gloomist · 18 decks · Tier 3, #7

*Calm/Chaos.* **Staples:** Back Off (17/18), Vex, Apathetic (17/18), Defy
(13/18), Mutated Mouser (13/18), Evelynn, Entrancing (13/18).

A slow hold-and-draw deck: the legend draws a card every time they hold a
battlefield. They run your Vex and your Evelynn.

- **Their plan:** park Tank/Shield bodies (Mutated Mouser), hold, draw, and
  grind you out of cards.
- **Your answer:** this is the matchup where you are the aggressor. Holding is
  their engine, so denying the hold — Faefolk dragging their holder off,
  Star-Crossed bouncing it on their Beginning Phase — is worth more than any
  trade. Sabotage on Back Off or Defy before they can stabilize.
- **Watch for:** if both Vexes are at battlefields, both players' units come
  down stunned. The player who commits units second wins that exchange, so hold
  bodies in base and make them deploy first.

### Master Yi — Wuju Bladesman · 15 decks, 6 of them tournament · Tier 1, #2

*Calm/Body.* **Staples:** Charm (14/15), Defy (14/15), Discipline (13/15),
First Mate (13/15), Rengar, Trophy Hunter (13/15), En Garde (12/15), Sabotage
(12/15), Punch First (12/15), Master Yi, Tempered (12/15), Ruin Runner (11/15),
Emperor's Dais (11/15), Zhonya's Hourglass (10/15).

The best-represented tournament deck in the window (best finish: 14th). A
trick-dense combat-math midrange that shares five cards with you, including the
exact Rengar in your list.

- **Their plan:** win individual combat steps with 1-Energy tricks, protect the
  key one with Defy, and let Master Yi, Tempered bank 2 XP per conquer or hold
  toward Level 6 (Deflect + Ganking).
- **Your answer:** the best Sabotage matchup in the format — Defy, Discipline
  and En Garde are all non-unit cards, all cheap, and stripping one makes your
  whole turn go through. Punch First and Switcheroo are already Defy-proof; lead
  with Gust to eat the counter.
- **Watch for two things.** First: their legend gives a **lone defender +2
  Might**, which cancels your Forbidding Waste exactly — that battlefield is a
  blank against them, don't build a plan on it. Second: Level 6 is a threshold
  on their **XP total**, a permanent player resource. Bouncing or killing Yi
  does not unwind it. Kill him before 6 XP, not after.

### LeBlanc — Deceiver · 16 decks · Tier 3, #1

*Mind/Order.* **Staples:** Hidden Blade (16/16), Watchful Sentry (15/16),
Windswept Hillock (15/16), Deathgrip (15/16), Vi, Peacekeeper (14/16), Mirror
Image (14/16), Honest Broker (13/16), Thousand-Tailed Watcher (13/16).

Removal-dense value control. Their legend copies a unit on every conquer or
hold; Mirror Image copies one at instant speed.

- **Their plan:** answer everything you commit one-for-one, then copy the best
  unit on the board — often yours.
- **Your answer:** Reflection tokens are **Temporary** (they die at the start of
  their controller's Beginning Phase), and they're tokens, so Gust deletes one
  permanently. Don't over-commit into open Order mana; this deck wants you to
  play a threat so it can kill it and draw. Baron Nashor is close to unanswerable
  here — Hidden Blade and Deathgrip both choose.
- **Watch for:** **Thousand-Tailed Watcher** (7/7) gives all your units -3 Might
  on arrival, which can wipe a board of Faefolk and Merchants outright, and
  Windswept Hillock grants Ganking to everything standing on it.

### Diana — Scorn of the Moon · 16 decks · Tier 2, #2

*Mind/Chaos.* **Staples:** Stupefy (16/16), Ravenbloom Student (16/16), Gust
(15/16), Ride the Wind (15/16), Diana, Lunari (15/16), Star-Crossed (15/16),
Moonfall (15/16), Fizz (14/16), Abandoned Hall (14/16), Tideturner (13/16).

The closest thing to a mirror — Chaos tempo with your Gust, your Star-Crossed,
your Fizz, your Tideturner. The difference is that they're a spell-count deck:
Ravenbloom Student and Abandoned Hall grow with every spell cast.

- **Their plan:** chain cheap spells to grow units, with the legend adding
  showdown-only Energy so they can always afford one more.
- **Your answer:** you have the bigger bodies and they have the better spells,
  so fight on bodies. Vex, Kha'Zix and Rengar all outclass a Ravenbloom Student
  that hasn't had three spells poured into it. Punch First is unbeatable in a
  Might race they're trying to win by +1s.
- **Watch for:** **Moonfall** — moves one of your units to a battlefield of
  their choosing *and* gives your units there -2 Might. It is a positioning card
  and a combat trick at once, and it's in 15 of 16 lists.

### Irelia — Blade Dancer · 13 decks · Tier 1, #3

*Calm/Chaos.* **Staples:** Stellacorn Herder (13/13), Boots of Swiftness
(13/13), Defy (11/13), Discipline (11/13), Ride the Wind (11/13), Defiant Dance
(11/13), Abandoned Hall (11/13), Sunken Temple (11/13), Scuttle Crab (10/13),
Targon's Peak (10/13).

A movement-value engine like yours, built to snowball rather than disrupt. The
legend readies a chosen friendly unit for 1 Power, and readies *itself* for 1
Energy on conquer — so one unit can conquer, attack and draw repeatedly.

- **Their plan:** re-ready the same two or three units all turn. Stellacorn
  Herder draws on every move; Boots hand Ganking to anything.
- **Your answer:** Stellacorn Herder is 3 Might — exactly inside Gust's cap, and
  denying it breaks the loop rather than trading resources. Faefolk dragging a
  readied attacker somewhere it wasn't headed wrecks their sequencing outright.
  Irelia, Fervent has Deflect *and* grows every time they choose or ready her, so
  bounce her, don't fight her.
- **Watch for:** Boots of Swiftness gives Ganking to literally anything. Never
  assume a unit is stuck.

### Azir — Emperor of the Sands · 11 decks · Tier 1, #4

*Calm/Order.* **Staples:** Discipline, Hidden Blade, Brutalizer, Guards!, B.F.
Sword, Deathgrip, Azir Sovereign, Arise! (all 11/11), Trifarian War Camp
(10/11), Doran's Shield (10/11), Eye of the Herald (9/11).

The only Tier-1 deck sharing no domain with you. Go-wide Equipment tokens:
Guards! and the legend make 2-Might Sand Soldiers with free Weaponmaster,
Equipment buffs whoever wears it, Arise! makes one Sand Soldier per Equipment.

- **Their plan:** flood tokens, dress them in Equipment, remove your blockers
  with Hidden Blade and Deathgrip.
- **Your answer:** **bounce is secretly removal here.** Sand Soldiers are
  tokens; a token returned to hand ceases to exist (rule 186.1). Gust on a
  2-Might Sand Soldier is a permanent, 1-Energy kill, and sideboard Downwell
  erases the entire token board for good. Forbidding Waste taxes every lone
  token left to hold.
- **Watch for:** Equipment survives its wearer — killing the body leaves the gear
  to be re-equipped. **Akshan, Mischievous** from your sideboard (pay 2 Body
  extra) steals it outright instead. And Downwell returns *all* units and gear
  including yours: Baron's "can't be chosen" doesn't save him, because Downwell
  chooses nothing. Fire it only when you're the one with the emptier board.

### Kennen — Heart of the Tempest · 9 decks · Tier 1, #1

*Order/Chaos.* **Staples:** Lightning Rush (9/9), Ride the Wind (8/9), Stacked
Deck (8/9), Traveling Merchant (8/9), Nocturne, Horrifying (8/9), Rhasa the
Sunderer (8/9), Minefield (8/9), Star-Crossed (8/9), Kennen Storm of Shuriken
(8/9).

riftbound.gg's #1 deck, and the fifth-rarest of the nine here in actual lists.
It mills itself, replays spells from the trash with Flow, and the legend banks
an empower every time they play a card from anywhere but hand, spending it for
Assault 2.

- **Their plan:** fill the trash, convert it into free spells and a cheap huge
  body, and push through with repeated Assault 2 buffs.
- **Your answer:** their buffs are *attacker-only* and applied before damage — a
  reactive Gust or Star-Crossed on the buffed attacker erases the whole turn for
  less than they spent. Vex taxes the stream of bodies they play out of the
  trash and off the top.
- **Watch for:** **Rhasa the Sunderer** costs 1 Energy less per card in their
  trash — a 10-Energy 6-Might body that routinely costs 2 or 3 by turn six.
  **Nocturne, Horrifying**, errata'd, can now banish itself off the top of their
  deck and be played for a single rainbow Power — a 4-Might Ganking body from
  nowhere. Neither is reliably answerable; both are inside Star-Crossed's
  no-cap bounce.

### The rest, briefly

| Archetype | Decks | Key thing to know |
|---|---|---|
| Viktor — Herald of the Arcane | 16 | Cull the Weak (14/16) makes *each* player kill a unit — you choose yours, so Baron is safe |
| Lillia — Bashful Bloom | 15 | Sprite Fountain in 15/15; Unchecked Power (10/15) is a 7E board-damage sweep |
| Shen — Eye of Twilight | 12 | Defensive; expect long games and prioritise Seat of Power |
| Ambessa — Matriarch of War | 12 | Aggro; Vex and Forbidding Waste are your best cards |
| Akali — Rogue Assassin | 11 | Defy 11/11, Zhonya's 10/11 — the most protection-dense deck in the format |
| Jayce — Defender of Tomorrow | 11 | Platewyrm Egg (10/11); gear-centric, Akshan boards in |

## 9. The *other* Battle Mistress deck

Seven Battle Mistress lists appear in the window. Five are tournament entries —
second only to Master Yi's six — with a best finish of 10th of 82. That number
is worth reading carefully before it flatters anyone: four of the five are the
same 56 cards give or take one flex slot, from three pilots, all dated
2026-07-13 to 2026-07-20. It's one deck at one cluster of July events, not a
sustained result.

And **it is not your deck.** Their shell:

| Their card | Copies | What it does |
|---|---|---|
| Catalyst of Aeons | 3 | Channel 2 runes exhausted |
| Mobilize | 3 | Channel 1 rune exhausted |
| Sigil of the Storm | 1 (battlefield) | On conquer, you *must* recycle a rune |
| Scryer's Bloom | 3 | 1E gear: Predict 2, draw 1 |
| Dazzling Aurora | 3 | Free unit off the top every end step |
| Baron Nashor | **3** | — |
| Elder Dragon | 1 | 12E/10 Might; any amount of your damage kills |
| The Harrowing | 1 | Replay a unit from the trash |
| Ride the Wind | 3 | Move a friendly unit and ready it |
| Aspirant's Climb, Forgotten Monument | 1 each | Battlefields that *slow the game down* |

They attack §3's shrink cycle head-on: Catalyst and Mobilize channel extra
runes so recycling for Power never costs them tempo, Sigil of the Storm forces
an extra recycle every conquer (which is another Gold token), and the two
battlefields buy the turns that plan needs. Then they cast three Barons and an
Elder Dragon off a rune base that never contracts.

You share exactly nine cards with them: Battle Mistress, Baron Nashor, the
runes, Challenge, Gust, Punch First, Sabotage, Stacked Deck, Sivir Mercenary,
and Hard Bargain out of the board. Zero units in common besides Baron. It is a
ramp-control deck wearing the same legend.

Two honest conclusions. First: nothing in their results says your deck is bad —
they're evidence about a different list. Second: they are getting far more out
of Battle Mistress's Gold engine than you are, because they manufacture rune
recycles instead of waiting for them. §12 takes the cheapest piece of that idea
without turning your deck into theirs.

## 10. Mulligans

Keep a hand that can do something on turns two and three and has a way to
refuel. Concretely:

- **Keep:** any two of {Faefolk, Merchant, Tideturner} plus a 1-Energy
  interaction spell. This is the deck's actual opening.
- **Keep:** Sabotage plus two two-drops. Turn-one information shapes everything
  after it.
- **Ship:** hands with both Barons and no early play. He's castable from turn
  five (§3), but a hand that does nothing until then loses the board before it
  gets there. One Baron and a curve is fine; two Barons and a Fizz is not.
- **Ship:** hands with three-plus Power-heavy cards and one rune colour's worth
  of plan. Punch First wants two Body runes *at once*.
- **Fizz is not a keep.** With an empty trash he's a 3/3 for 3E and 1 Power.

## 11. Sequencing

1. **Hide Here to Help early**, on a battlefield you expect to hold. It costs 1
   rainbow Power now and nothing later, and it pulls Baron a full turn forward
   while leaving five runes up. Hiding it also spends Power, which recycles a
   rune, which is a Gold token.
2. **Spend Power before casting Sivir**, not after. Decide the whole turn first;
   she reads "if you've *spent*," so the threshold is already met or it isn't.
3. **Bank Gold tokens the turn before you need them.** They enter exhausted.
   Plan them one turn ahead, every time.
4. **Loot before you Fizz.** Move a Traveling Merchant, discard the spell you
   want, then Fizz it back for free. This is the deck's only real two-for-one
   and it needs one turn of setup.
5. **Bait with Gust.** It is your most Defy-able, most Discipline-able card and
   your cheapest. Fire it into open Calm mana on purpose, then resolve the real
   spell.
6. **Hold Flash and a Gust** on a turn you expect a big swing rather than
   tapping out. Both are Reactions; neither needs Power.
7. **Kill anything, ready Battle Mistress.** When two lines are otherwise equal,
   take the one that kills an enemy unit — even a token — for the free untap.

## 12. What I'd test next

You own everything below already; the deck is at 0 cards still to get, so all
of this is free.

**Ride the Wind** (2E / 1 Chaos — *move a friendly unit and ready it*), ×2.
The clearest gap in the list. In this deck it is: a Traveling Merchant loot, an
Irresistible Faefolk forced drag, a re-ready for a unit that already attacked,
and one Power toward Sivir's threshold — on one card for two Energy. It's in
19% of all format decks, 15/16 Diana lists, 11/13 Irelia lists, and 3 of 3 of
the competitive Battle Mistress lists. You run zero and own two.
*Cut:* Flash (does nothing to the opponent) and one Stacked Deck.

**A second Sivir, Mercenary.** You own three copies and register one. She's a
4-Energy 6-Might Ganking body in a deck where 23 of 40 cards spend Power, and
she is the champion the legend is named for. One copy means you draw her in
roughly a third of games.
*Cut:* the second Here to Help, or the third Stacked Deck.

**Boots of Swiftness** (3E Chaos Equipment, Equip 1 Chaos — grants Ganking),
×1, as a flex. In all seven Battle Mistress lists and all thirteen Irelia
lists. Ganking on a Traveling Merchant is a loot every single turn; Ganking on
Baron Nashor makes a 12-Might body that can go anywhere.

**Rampage over Challenge? No — but Rampage *alongside* it, maybe.** The case for
the swap is real: your bodies sit at 4 Might, and Rampage's kicked +2 turns an
even trade into a clean kill. Three things outweigh it.

| | Challenge | Rampage |
|---|---|---|
| Cost | 2E + 1 Body | 3E, +1 Body optional for +2 Might |
| Timing | **[Action]** — playable in showdowns, either player's turn | no timing keyword — your Main Phase only |
| Power spent | always 1 | 0 unless you kick it |

Timing is the one that decides it. Rule 316.8.c: a showdown only admits cards
with Action or Reaction. Rampage has neither, so it can never be cast during the
fight — only before one, on your own turn. This deck drags people into fights
they didn't choose and then wins on information; a combat card that can't be
played during combat works against that.

The other two compound it. Kicked Rampage is a full Energy *more* than Challenge
for the same fight. And unkicked it spends no Power at all — no rune recycle, so
no Gold token and no progress toward Sivir's threshold, which in this deck is an
engine input and not just a bill. Meanwhile the +2 Might job is already held by
three Punch First (+5 for 1E + 2 Body, [Action], Defy-proof).

The data agrees for this legend specifically: **all five tournament Battle
Mistress lists run 3× Challenge and zero Rampage.** The only Sivir list in the
data with Rampage is a public brew that cut Challenge entirely. Rampage's real
homes are Fiora (15 of 20 lists), Ambessa (11 of 12) and Rengar (4 of 4) — Body
aggro decks with naturally big units, where Fiora in particular needs to cross 5
Might to turn on Mighty. Your units are 1–4 Might.

Where your friends are right: Rampage's unkicked mode costs **no Power**, which
is quietly excellent on a Baron turn when every Chaos rune is already committed
(§3). If you want to try it, add 1–2 over Flash and the third Stacked Deck and
keep all three Challenge — eight decks in the data run both, and you own nine
copies.

**Kha'Zix, Evolving Hunter** ($0.57, not owned) if you want the XP to mean
anything. As built, Kha'Zix's 2 XP per trigger is simply discarded. Either
accept that and value him as a 4/4, or buy the payoff — but don't count XP as
upside in the current 40.

## 13. Errata that change your cards

Riot publishes errata on its own pages and never feeds them back into the card
data, so four of your cards don't read the way they're printed:

- **Tideturner** — now requires the swap partner to be *at another location*.
  Printed text let you swap two units standing together; it no longer does.
- **Fizz, Trickster** — clarified sequencing: play the spell, *then* recycle it.
  You still pay its Power cost.
- **Emperor's Dais** — the bounce is now part of the cost of making the Sand
  Soldier, not a separate "if you do."
- **Rengar, Trophy Hunter** — reworded to confirm he can **Ambush** into a
  battlefield holding only enemy units. It's an Ambush, so it's still a Reaction
  with Ambush timing.

Opposing cards you'll meet whose current text differs from print: Zhonya's
Hourglass (now *heals* and recalls, 14% of decks), Nocturne, Horrifying (now
banishes itself off the top and plays for 1 Power, 8/9 Kennen lists), Guards!
and Arise! (Azir), Targon's Peak (*up to* 2 runes), Deathgrip, Sigil of the
Storm, and both LeBlanc copy effects.

## 14. Sideboard

Eight of ten slots used: Akshan, Mischievous ×2 · Ruin Runner ×2 · Hard Bargain
×2 · Downwell ×1 · Gust ×1.

| Vs. | Bring in | Why |
|---|---|---|
| Azir | Akshan ×2, Downwell, Ruin Runner | Akshan steals Equipment outright; Downwell permanently erases a token board; Ruin Runner ignores Hidden Blade and Deathgrip |
| Master Yi | Hard Bargain ×2, Ruin Runner | Defy is the card worth taxing; Ruin Runner can't be chosen, so Charm-into-combat lines don't work on it |
| Irelia | Hard Bargain ×2, Gust | Same Defy problem; their whole board is inside Gust's 3-Might cap |
| LeBlanc | Ruin Runner ×2, Gust | Removal-dense — bring bodies they can't choose |
| Fiora | Gust, Ruin Runner | Riposte counters spells; a unit they can't choose sidesteps the argument |
| Zed | Gust, Hard Bargain ×2 | Tax the Flow replays; Gust permanently kills clones |
| Vex / Gloomist | Hard Bargain ×2 | Slow game, few targets; taxing their draw-engine spells is the fastest clock you have |
| Rengar / aggro | Gust | Cheap trades beat grind here |

**Cut first when boarding in:** Flash, then the second Here to Help, then the
third Stacked Deck. Two open slots remain — a third Hard Bargain and a second
Downwell are the obvious candidates if you meet more counterspell decks or more
token decks. Remember §601.1.c: ten cards maximum, no Legends, Runes or
Battlefields, and the three-copy limit spans main deck and sideboard together.

## Sources and method

Deck list, card text and ownership: the live collection state via
`scripts/rift deck sivir`, joined to `data/cards.json` with `data/errata.json`
overlaid, so every quotation above is current text rather than printed text.
Rules citations are section numbers from `docs/rules-full.md`.

Meta figures: `data/decks.json` — 424 public and tournament decklists from
riftbound.gg for 2026-07-12 to 2026-09-10, of which 20 are tournament entries.
Per-archetype "staples" are the share of that legend's lists running at least
one copy. Tier placements: `data/tiers.json`, riftbound.gg's curated Vendetta
week-4 list, generated 2026-09-10.

Two caveats worth carrying. The tournament sample is small — 20 decks across
eight events — so treat every placing as anecdote, including the Battle
Mistress ones in §9. And the tier list is one site's editorial judgement, which
§8 shows diverging sharply from what people actually register: its #1 deck is
the fifth-rarest archetype in the data, and the most-played deck in the format
sits in its Tier 5.
