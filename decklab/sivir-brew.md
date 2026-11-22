# Sivir brew: "Bounty Board" (Battle Mistress, kill engine)

Written 21 Nov 2026, two days before the bans take effect. This is a **new deck** (19 main-deck copies and all 3
battlefields off the benchmark *Sivir Is Trying Her Best*), brewed by `docs/deckbuilding-theory.md` §2. It was
built without reading the benchmark's notes or guides; the benchmark list was used only as the thing to test
against. **Confidence: low.** No games, no results, and the bench can't see most of the engine (see 8).

Evidence labels: **proven (X)** = in vouched good finishes under legend X; **crowd** = posted lists, no record;
**theory** = from card text only.

## The concept in one paragraph

Battle Mistress has two lines: a rune recycle makes Gold, and **enemy units dying readies her** for another Gold.
The benchmark mostly bounces things (Gust, Rebuke, Star-Crossed, Existential Dread), and bounce never kills, so
her second line rarely fires. This brew **kills instead**, and does most of it with things Defy can't counter:
Graves's attack/defend trigger (4 damage to every enemy unit at his battlefield), fights (Rampage), and combat.
Each kill readies the legend, and each Power payment after that (a hide, Mercenary's Accelerate, On the Hunt,
Punch First) makes a Gold. Pyke adds a Gold when an enemy dies, Bandle Scouts' Academy adds a Gold per hide, and
Gutter Guardian adds a Power. The chassis is Evelynn's Hidden net deck, the best-proven Body/Chaos list.

**Worth doing (the one sentence):** it turns on the legend's second line by killing rather than bouncing, with a
main-deck sweeper (3 Graves) the benchmark only sideboards, so it should beat the small-unit and token boards
the post-ban field is full of (Riven's and Master Yi's Scuttle Crab shells, Vex's 0–1 Might bodies, Evelynn's
3-Might Hidden units, and the token decks Rek'Sai, Mordekaiser, Azir, Viktor, Seraphine), and it gives up ground
to Kai'Sa.

That case is real but narrow. It rests on Graves, which the bench can't model, and on the post-ban field forecast.

## 1. Field, top-down (post-ban forecast)

Sources: `rift field --tiers`, `rift meta --since 2026-10-23`, `rift bans`, `decklab/sivir-postban.md` §1.

- **Expected top 5 after 23 Nov:** Riven (rebuilt; 9.2% pre-ban, 92% of lists hit), Kai'Sa (5.7%, loses Brynhir
  only), Evelynn (5.7%, barely touched), Vex (3.7%), Master Yi (3.2%). Kennen (4.9%) loses its core (Nocturne,
  Rhasa). Rising behind them: Orianna, Mordekaiser, Azir, Rek'Sai (riftbound.gg's post-ban picks: Azir, Rek'Sai,
  Orianna, Ornn).
- **Counters:** Defy (counters a spell costing ≤4 Energy and ≤1 Power) runs 2.1–2.8 copies per list in Riven
  (clean post-ban lists), Vex, Orianna and Azir, and appears in no Kai'Sa, Evelynn, Rek'Sai or Mordekaiser list
  I counted. Not So Fast (counters a spell *or ability that chooses* a friendly unit) is light (0.3–0.6).
- **Removal:** Kai'Sa: Falling Star (3 + 3), Hextech Ray (3), Stupefy. Mordekaiser and Viktor: Hidden Blade
  1.3–2.6. Master Yi: Rampage, Charm.
- **Board shape.** Unit copies per list by Might, from the lists played since 23 Oct without a banned card (my
  count from `data/decks.json`). "Token makers" = card copies whose text plays a unit token (rough regex):

| archetype | lists | units | ≤1 Might | 2 | 3 | token makers |
|---|---|---|---|---|---|---|
| Riven (clean) | 64 | 18.8 | 2.3 | 5.7 | 4.3 | 0.2 |
| Kai'Sa (clean) | 64 | 20.0 | 1.9 | 5.6 | 3.0 | 1.3 |
| Evelynn | 471 | 24.0 | 2.0 | 3.2 | 8.6 | 0.1 |
| Vex | 150 | 20.9 | 5.3 | 4.5 | 4.2 | 0.5 |
| Mordekaiser | 223 | 25.8 | 5.3 | 3.5 | 6.5 | 7.6 |
| Rek'Sai | 280 | 26.4 | 7.1 | 5.5 | 7.4 | 9.2 |
| Viktor | 259 | 12.0 | 2.6 | 2.2 | 2.4 | 11.3 |
| Seraphine | 258 | 16.6 | 2.9 | 5.1 | 4.0 | 13.9 |
| Azir | 207 | 2.9 | 0.3 | 0.4 | 0.0 | 7.0 |

  Named small bodies: Scuttle Crab (0 Might) in 271 of 355 Master Yi lists and 632 of 821 Riven lists; Steel Paws
  (0) and Mutated Mouser (1) in Vex; Inferna and Carrion Dredger (1) in Rek'Sai; Watchful Sentry (1) in Kai'Sa.

## 2. Gap, bottom-up

- **Most of the field's units have 3 Might or less, and token decks are rising.** Body/Chaos's sweep effects are
  Graves (4 to all enemy units at his battlefield on attack *or* defend), Cannon Barrage (2 to all enemy units in
  combat) and Flurry of Blades. The benchmark has none in the main deck (2 Graves in its sideboard).
- **Defy and Not So Fast can't touch Graves.** Defy counters only spells. Not So Fast counters an ability only if
  it *chooses* a friendly unit, and Graves's trigger chooses nothing ("all enemy units here"). From card text;
  see Rules premises.
- **Each death event readies the legend.** Her ready trigger has no once-a-turn limit. A Graves sweep is one
  event (it readies her once), a Rampage kill another, a combat kill another.
- **What Gold pays for.** Gold adds one Power of any colour and no Energy. So it pays hides, Mercenary's Power
  and Accelerate, On the Hunt (2 Power), Punch First (2 Power), Rampage's extra Body, and Graves's and Rengar's
  1 Power, all without recycling a rune and shrinking the board.

## 3. Worth doing

See the sentence above. If Graves turns out to be a sideboard card in practice (too slow at 5 Energy, or dies to
Kai'Sa's Falling Star before he attacks), there's no case left, and the right move is tuning the benchmark (a
main-deck Graves or two) rather than this deck.

## 4. Roles against the top 5

| opponent | role | why |
|---|---|---|
| Riven (rebuilt) | **beatdown** | Defy/Discipline control with late Astral Heron (7) and Baron. Kill the 0–3 Might early board with Graves and fights (no Defy target), close before the 7–10 drops. |
| Kai'Sa | **beatdown**, and probably losing | Spell removal kills Graves (4) and Pyke (3). Her late units (Watcher 7, Empyrean 8) are out of the sweep's range. Race; Star-Crossed and Switcheroo for the big body. |
| Evelynn | **control** | Her Hidden bodies are mostly 3 Might (8.6 per list); Graves on defence kills them. No Defy in her lists. |
| Vex | **control, then beatdown** | 5.3 bodies at ≤1 Might per list die to any sweep. Her Vex stuns units *played* at her battlefield, Hidden flips included, so flip elsewhere. |
| Master Yi | **control early, beatdown late** | Scuttle Crab, Lonely Poro, Pit Rookie and First Mate die to Graves. Ruin Runner (5 Might, can't be chosen) survives 4 damage; Rampage can't choose it. Charm moves the Graves away. |

The deck can play both roles: Graves defends as well as he attacks, and On the Hunt plus a ready Mercenary is
the beatdown turn.

## 5. Anchor

**Anchor: Evelynn, Agony's Embrace's early net deck** (`rift ideas "Agony's Embrace"`: 24 finishes, 13 events,
23 recorded, best claimed 1st; not a net deck yet, its lists sit a median 11 copies from the count). The closest
real list is Brad Johnson's (#125 of 556, 6 copies from the count).

- **13 copies off the anchor** (+3 Graves, +3 On the Hunt, +2 Cannon Barrage, +2 Tideturner, +1 Rampage,
  +1 Fizz, +1 Sivir as champion; −3 Tornado Warrior, −3 Tail-Cloaked Matriarch, −2 K'Sante, −2 Momentary
  Companion, −1 Boots, −1 Gust, −1 Ezreal). That's within the 16 that "costs nothing measurable", but the anchor
  is **another legend's** list.
- **What the anchor owes to Evelynn's legend:** "Once each turn, when you play a card from face down, draw 1." That
  is her card advantage. Under Battle Mistress the same flips make Gold, not cards. The brew's card flow is weak
  (see Jobs), and the bench agrees: "extra cards drawn" goes from 1.5 to 0.0 a game.
- **Change count against the benchmark:** 19 main-deck copies, all 3 battlefields, and 2 sideboard copies. Past
  16, so this is **a new deck**. New decks under a legend placed about a third less often (31% against ~49%;
  70 lists, direction not size).

## 6. Jobs and copy counts

Odds are from the consistency table (at least one copy among the first *n* cards; 4 in the opening hand, no
mulligan).

| job | cards | copies | target | table |
|---|---|---|---|---|
| **Kill something** (readies the legend) | Graves 3, Rampage 3, Cannon Barrage 2 (+ Fizz recasting Rampage or Barrage, 2) | 8 (10) | one by the 8th card, 85% | 8 → 86% ✓ (10 → 92%) |
| **Something to hide** (each hide: a Gold from the legend, plus one at Academy) | Evelynn, Entrancing 1, Bedeviling Stranger 2, Tideturner 2, Pyke 3, Gutter Guardian 3, Switcheroo 1, Edge of Night 2 | 14 | one by turn 2 (5–6 cards), 85% | 12 → 85–90% ✓ |
| **Early bodies** (≤3 Energy units) | the 2-drops above (5) + Pyke 3, Gutter Guardian 3, Fizz 2, Kinkou Initiate 2 | 15 | a play on turn 2, 90% | 12+ → 85% by 5 cards ✓ |
| **Turn-1 two-drop** | Evelynn 1, Stranger 2, Tideturner 2 | 5 | — | 43% in the opening 4, **weak** |
| **Close** | Sivir, Mercenary (champion zone, always there), On the Hunt 3, Rengar 2, Punch First 2, Hold 'Em 2 | 1 + 9 | a pump or ready by the 9th card, 90% | 9 → ~93% ✓ |
| **Answer the big unit** | Star-Crossed 1, Switcheroo 1, Rampage (shared), Vex 2 | 4 + 3 | — | thin by design; Kai'Sa is the cost |
| **Card flow** | Kinkou Initiate 2, Fizz 2 (gets a spell back), Graves multi-kills | 4 | — | **weak**: the honest gap left by losing Evelynn's draw |

**Synergy check** (every kept card's enabler is in the list):

- Gutter Guardian shows off a Hidden card: 14 Hidden in the main deck.
- Hold 'Em is cheaper if a unit or gear was played to a battlefield this turn: Hidden flips, Rengar and Edge from
  face down all do that.
- Fizz needs a ≤3-Energy spell in the trash: 14 such spells.
- Pyke's Gold needs enemy deaths: the kill job.
- Mercenary needs 2 Power spent this turn: her own 1 plus Accelerate's 1 does it alone (rulings.md, 21 Nov).
- Bandle Scouts' Academy needs hides: the Hidden job.
- Packed Amphitheater (champion units +1 Might): Sivir, Pyke, Graves, Vex, Rengar, Fizz and Evelynn are all
  champion units.
- **Signatures:** On the Hunt ×3, Sivir's only one. No other legend's signature (Bullet Time is Miss Fortune's,
  Last Caress Evelynn's, Void Assault Kha'Zix's). **One champion unit** (Sivir, Mercenary, in the zone). No Aurora.

## 7. Front to back (a normal draw, not the best case)

**On the play** (2 / 3 / 4 / 5 runes):

- **T1:** a 2-drop to base only 43% of the time, and that's the weak spot. Otherwise pass.
- **T2:** a 3-drop (Pyke, Gutter Guardian, Kinkou, Fizz), or a 2-drop and move the T1 unit out to take a
  battlefield.
- **T3:** hide a card at the battlefield you hold (1 Power, recycled: Gold from the legend, plus a second at
  Academy) and play a 3-drop, or play Vex.
- **T4:** Sivir with Accelerate (5 Energy, 2 Power: enters ready with +2 Might and Ganking), or Graves into their
  board. Gold from T3 pays Power without shrinking the runes.

**On the draw** (3 / 4 / 5 / 6 runes): a 3-drop on T1. T2: a 2-drop and a hide. T3 (5 runes): Graves a turn
early, or Sivir with Accelerate. T4 (6 runes): the other of those, or Rengar, plus a flip.

The bench's goldfish matches this: units by turn 3 are 2.4 on the play (benchmark 3.0) and 3.3 on the draw (3.6).
The brew is a turn slower to develop and makes it back with the sweep.

## 8. The list and the bench

**Bounty Board** (Sivir, Battle Mistress · champion Sivir, Mercenary)

| | |
|---|---|
| Units (22) | 1 Evelynn, Entrancing · 2 Bedeviling Stranger · 2 Tideturner · 3 Pyke, Returned · 3 Gutter Guardian · 2 Fizz, Trickster · 2 Kinkou Initiate · 2 Vex, Apathetic · 3 Graves, Blasting Through · 2 Rengar, Trophy Hunter |
| Spells (14) | 3 On the Hunt · 3 Rampage · 2 Punch First · 2 Hold 'Em · 2 Cannon Barrage · 1 Star-Crossed · 1 Switcheroo |
| Gear (3) | 2 Edge of Night · 1 Boots of Swiftness |
| Battlefields | Bandle Scouts' Academy · Packed Amphitheater · Rakelstake |
| Runes | 6 Body · 6 Chaos |
| Sideboard (10) | benchmark's, with 2 Graves → 2 Gust: 1 Ravenbloom Prefect · 2 Gust · 2 Ruin Runner · 1 Repulse · 1 Sabotage · 2 Unyielding Spirit · 1 An Offer You Can't Refuse |

Evidence per card: **proven (Evelynn)**: Evelynn, Entrancing, Pyke, Gutter Guardian, Vex, Rengar, Hold 'Em,
Rampage, Punch First, Star-Crossed, Switcheroo, Edge, Boots, Bedeviling Stranger, Kinkou Initiate, Fizz,
Academy, Amphitheater, Rakelstake. Several of them (Gutter Guardian, the Hidden bodies) earned their place
partly through Evelynn's draw-on-flip. **Proven (Kha'Zix, Body/Chaos):** Fizz, Rampage, Punch First. **Graves:**
proven under Evelynn (96 lists, 14 vouched), Rengar (19 vouched) and the Master Yi starter (33 vouched); no
Sivir record. **Cannon Barrage:** crowd only (49 lists, none vouched); theory here. **Tideturner:** proven
(Riven), and it's in the benchmark. **On the Hunt:** Sivir's signature; no vouched Sivir finish exists (Sivir has
0 good Radiance finishes).

**Bench:** `rift try --deck "Trying Her Best"`, the 19 changes in and out, battlefields
`-Amateur Recital -Forbidding Waste -Sigil of the Storm +Bandle Scouts' Academy +Packed Amphitheater
+Rakelstake`, sideboard `sb-2 Graves sb+2 Gust`. **Rules check: all pass** (the first draft failed "no more
than 3 of a name": 3 main Graves plus 2 in the sideboard, so the sideboard pair became Gust).

| | benchmark | brew |
|---|---|---|
| **two units by turn 3**, play / draw | 95% / 99% | **88% / 98%** |
| units by turn 2 / 3 (play) | 1.7 / 3.0 | 1.4 / 2.4 |
| **an answer usable on their turn**, t3 / t5, play | 21% / 64% | **16% / 22%** |
| same, draw | 26% / 75% | 15% / 29% |
| **Mercenary on** (turns 4–8, 2+ Power spent), quiet / normal / heavy | 34 / 40 / 44% | **30 / 34 / 34%** |
| **Defy-countered spells, expected** (popularity · results) | 3.2 · 3.4 | **3.7 · 3.9** |
| **stuck on colour, turn 3**, play / draw | 5% / 4% | **3% / 2%** |
| kills a game (readies the legend), normal / heavy | 0.31 / 0.53 | **1.04 / 1.50** |
| Gold made a game, normal | 4.38 | 3.70 |
| extra cards drawn a game, normal | 1.5 | 0.0 |
| face down by turn 4, play | 0.7 | 1.4 |
| cheap (≤2 Energy) · 5+ Energy · average cost | 20 · 2 · 2.48 | 13 · 5 · 2.88 |
| answer copies per regular 6+ unit | 9.1 · 8.8 | 9.4 · 9.3 |
| their unit copies a blast kills alone | — | 74% · 73% |

**Read honestly:**

- **Worse on the benchmark's own measures.** Slower (two units by T3 88% against 95% on the play), fewer
  on-their-turn answers, Mercenary on less often, and *more* Defy exposure, not less. The fight spells (Rampage,
  Hold 'Em, Cannon Barrage, Star-Crossed) are all Defy-able. The Defy-proof claim holds only for Graves, Pyke and
  the hides.
- **Better on what it was built for.** Three times the kills, so the legend readies (1.04 against 0.31 a game),
  twice the face-down cards, and colour misses slightly down.
- The ANSWERS panel shows 10 copies against every S/A legend's key units, against the benchmark's 12, because the
  bounce left.

**What the bench can't see** (it reads spells and goldfish draws, not unit triggers or battlefields):

- Graves's sweep (a unit trigger) isn't counted as a kill or an answer, so "kills a game" undercounts the deck's
  main engine.
- Pyke's Gold, Academy's Gold per hide and Gutter Guardian's Power aren't modelled. "Gold made" comes only from
  the legend, and the sim spends Gold on hides first, which skips the recycle that would make more.
- Cannon Barrage is a Reaction but isn't on the goldfish's list of on-their-turn answers (Rebuke, Switcheroo,
  Star-Crossed, Existential Dread). Neither are Graves on defence or Hidden units flipped at Reaction speed, so
  the 22% is low.
- The opponent is a scenario, not a deck. Against a real wide board the sweep is worth far more than the sim's
  "deaths per turn" knob.

## Win-rate proxy (labelled: not this deck)

`data/winrates.json` (RiftLite: online, user-logged, legend against legend, mostly pre-ban). Sivir has 19 games,
too few to read. **Proxy: Evelynn, Agony's Embrace**, the anchor's legend, which has a different engine. Against
Riven 61% (n 31), Master Yi 64% (n 17), Mordekaiser 71% (n 21), Orianna 54% (n 16); against Kai'Sa 25% (n 34),
Vex 32% (n 33), Rek'Sai 33% (n 25), Viktor 33% (n 20). This chassis struggles against Kai'Sa and Vex already. Its
Rek'Sai and Viktor results come mostly from Evelynn lists without Graves, which is the part this brew changes,
so they neither support nor refute the token-deck claim.

## Rules premises (through `rules-question`)

1. **Paying Power from a rune recycles it** (§164.2.b: "Recycle this: Add [C]"), so it triggers "When you recycle
   a rune". Power paid by Gold doesn't recycle a rune, so it makes no Gold.
2. **Hiding is "pay [A]"** (§811.1.b), so a hide paid from a rune is a recycle → Gold. Hidden cards gain Reaction
   from the next turn (§811.1.b).
3. **Gold's Power, a hide and Accelerate all count as "spent"** for Mercenary (rules-rulings.md, 21 Nov 2026,
   derived, not a staff ruling). Mercenary with Accelerate enters ready and on.
4. **The legend's ready has no per-turn limit** (card text, no "once each turn"). One event can kill several
   units and still readies her once ("one or more").
5. **Defy counters spells only** ("Counter a spell that costs no more than [4] and no more than [A]"). On the Hunt,
   Punch First and Switcheroo (2 Power) are out of its range.
6. **Graves's trigger can't be Not So Fast'd**, because it chooses no unit. From card text; ask a judge before an
   event relies on it.

## Confidence, and what would reverse it

**Low.** What would kill the brew:

- Graves is too slow at 5 Energy, or the field's units grow past 4 Might after the bans (Riven's rebuild going
  bigger).
- Kai'Sa staying on top (the proxy's 25% is the warning).
- Defy decks cutting the fight spells down.

What would raise it:

- The first post-ban weekend (about 29–30 Nov) showing token and small-unit decks rising (Rek'Sai, Azir,
  Mordekaiser).
- A Graves sweep readying the legend for 2+ Gold in real games.

Test it with about 10 games before keeping or scrapping it; the bench above can't settle it.

### Pre-flight

- **Anchor:** named (Evelynn early net deck), 13 copies off it.
- **Champion and signatures:** one champion unit; On the Hunt ×3.
- **Change count:** 19 main-deck copies off the benchmark, called a new deck.
- **Jobs:** consistency counted per job, against a stated target.
- **Synergies:** every kept card's enabler is in the list.
- **Evidence:** labelled by legend.
- **Yardstick:** set before the bench (kills, Gold, Mercenary on, Defy exposure, two units by T3, answers on
  their turn), and the brew was read on the benchmark's measures too, where it's worse.
- **Breaks the doc's shape:** ≤2 Energy count 13 against winners' ~22. That's inherited from the anchor (8 at ≤2),
  and named rather than fixed.
