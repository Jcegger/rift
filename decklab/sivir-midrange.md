---
title: Sivir Midrange — deckbuilding worksheet
subtitle: Sivir, Battle Mistress (Body/Chaos), Radiance. Built together, step by step; nothing here is automatic.
started: 2026-10-23
status: section 1 agreed · section 2 next
---

How this worksheet works (see `decklab/README.md`): five sections, filled in order. Each one
is agreed before the next starts. Cards are argued against the slot they compete for, with
their rules checked and their evidence stated, and no card is in because a tool picked it.

---

## 1. How it wins — agreed 2026-10-23

**Identity.** A tempo-leaning midrange backed by Hidden. The legend makes one Gold each time
it is ready and you recycle a rune; it readies at your Awaken and whenever enemy units die.
So spending one Power from a rune each turn becomes **+1 Power the next turn**, and more on
turns when enemies die. A hide is the cheapest thing to spend it on: it costs [A], and the
hidden card is later played **ignoring its base cost**, Energy and Power both (§811.1.b,
§204.1.a), at Reaction speed. That is the combination: Sivir turns one Power a turn into a
free card later, without the rune-for-a-card trade other decks make.

**How it differs from its neighbours.** Evelynn (Body/Chaos) is the deeper Hidden deck: she
draws on each flip, and Evelynn, In Control scores off a facedown hold, but she pays every
hide with a recycled rune. Sivir pays the same rune and gets a Gold back. Kha'Zix
(Body/Chaos) wins one isolated fight at a time for XP. Vex (Calm/Chaos) holds by stunning.

**The plan.**

1. **Early: go wide with cheap bodies.** What they do depends on the matchup (below). A
   turn-1 Staunch Survivor (2 Energy, 1 Body Power) makes the first Gold.
2. **Every turn: spend one Power from a rune**, which makes next turn's Gold. **Hide only
   behind a hold that is hard to break**: a facedown card at a battlefield you lose goes to
   the trash, along with the Power spent on it (§323.6.a).
3. **Fights: kills ready the legend** for an extra Gold, which pays for a Power trick in
   the same fight (Punch First, Switcheroo, Star-Crossed, Ride the Wind, Rampage's +2).
4. **Mid-game: refocus on one battlefield.** Sivir, Mercenary (6 Might with Ganking after
   2 Power spent; 11 with Punch First) with Ride the Wind takes the second battlefield or
   breaks their hold. Conquering needs height, because the attacker must kill every
   defender (§468.1.a).
5. **Close.** At 6, hold one and conquer the other. At 7, a hold wins (hold points are not
   gated, §473.1.a.1).

**Role by matchup.** Midrange changes role, and misjudging it is the classic way it loses.

| opponent | what it fears (`docs/archetypes.md`) | our role |
|---|---|---|
| Kennen | early pressure before the trash fills | **attack early** |
| Kai'Sa | being raced before the 7-drops | **attack early** |
| Jayce | nothing on board for three turns | **attack early** |
| Riven, Rengar (ambush), Rek'Sai (go-wide) | — they come at you | **hold**: they attack into hides, Graves, Vex |

**Where the value comes from.** The curve is tempo-low (average cost 2.48 in the v3 draft
against winners' 2.8), so card advantage is concentrated: Fizz recasts a spell, Tail-Cloaked
Matriarch brings back a unit, Ezreal draws, Graves kills several units for one card. The
late game is thin, so it cannot sit back against Kai'Sa.

**Known risks.**
- Area effects against wide 2-Might bodies (Kai'Sa's Thousand-Tailed Watcher: −3 Might to
  every enemy unit). Commit fewer bodies at once there.
- Vex, Apathetic (in Evelynn's, Kha'Zix's and Vex's lists) stuns units we play, hidden units
  included. Hidden spells and gear still work, so the package needs both.
- No Body-colour legend has a good Radiance finish yet: Staunch Survivor and Graves are
  checked on the rules, not proven in results.

**Rules checked for this plan** (handbook, then verbatim): Graves's trigger can only be
answered by Reactions (closed state); a facedown Switcheroo in response to it changes the
damage, which is read on execution (§359.3.f.2); a unit moved into a fight defends and its
trigger fires (§466.2.c.3.a, §383.4.e); exhausted units defend (§466.2.c.3); Ezreal's
discount covers Rampage's optional Body and Mercenary's Accelerate (§356.4.c, §356.4.f.1).

---

## 2. Roles and slots — next

The jobs the plan needs, with target counts, before any card is named. To settle:
- **cheap bodies** to go wide with: count, and how many must be Survivor-like (fight above
  their size);
- **Hidden:** how many keep one ready most turns, measured with `lib/sim.mjs`, and the
  split between hidden units and hidden spells or gear (Vex, Apathetic);
- **Power tricks** for fights and the conquer turn;
- **hold tools** (Vex, Apathetic main deck?, Graves, Ziggs, Explosive as a holder);
- **card flow and value** (Ezreal, Traveling Merchant, Fizz, Tail-Cloaked Matriarch);
- **the closer** (Sivir, Mercenary) and how much top end;
- **battlefields:** one low-impact for game 1, one for going first, one for going second
  (Ultimate Guard's method); candidates Zaun Warrens, Sandswept Tomb, Bandle Scouts'
  Academy, Sigil of the Storm;
- **runes:** set by the Power counts, checked with `sweepRunes`.

Shape targets from winning lists (good finishes, 23 Oct): about 20 units, 22 cards at 2
Energy or less, 3–5 at 5+, average cost about 2.8.

## 3. Card by card — not started

## 4. Checks — not started

Deck rules, curve against winners, the goldfish and the rune sweep (`lib/sim.mjs`). The
simulator does not model the legend's Gold or the cost of hiding, so its "stuck on colour"
figure is pessimistic for this deck.

## 5. Log — not started

Games, results, and every change with its reason.

---

## Sources and starting points (not decisions)

- **Randyyy's Los Angeles RQ list** (Riot's Top Decks, #146 of 2,165, the best Sivir there):
  the only legal, non-Aurora Sivir result in the data. Seven of Riot's nine Sivir results
  are Aurora decks; the Vegas one runs four cards banned since.
- **riftbound.gg, "10 Most Buffed Legends with Radiance"** (Den, 21 Oct 2026): Sivir's Gold
  pays for hiding; names Ziggs, Explosive (RAD-112) and Momentary Companion (RAD-095).
  A brainstorm, not tested.
- **MoreThatMillGuy, "Sivir Is INSANE Again & MIDRANGE IS BACK!?"** (14 Oct 2026): Staunch
  Survivor on turn 1, Graves with Tideturner and Switcheroo, Ezreal with Rampage. His four
  rules questions all check out. His posted list is an older, different deck.
- **Midrange:** StarCityGames, "What's in a Midrange?"; Sullivan on the midrange deck;
  riftbound.gg and Breakflip on Sett midrange (attrition, strong in best-of-one).
- **Draft lists so far** (chat, 23 Oct): v3 is Randyyy's list with Staunch Survivor,
  Bedeviling Stranger, Graves and Ride the Wind in, 5 Body / 7 Chaos runes. These are
  inputs to section 2, not the answer.
