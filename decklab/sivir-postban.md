# Sivir Is Trying Her Best after the 23 Nov bans

Written 21 Nov 2026, two days before the bans take effect. **Everything about the field below is a forecast**: built
from the lists that don't run a banned card (`scripts/rift bans`), what each archetype loses, and riftbound.gg's
[post-ban article](https://riftbound.gg/radiance-post-ban-metagame-decks). No post-ban results exist yet. The list
stays locked; this says what to watch and what would justify a change, which gets decided after the first
post-ban weekend (about 29–30 Nov).

**Short version:** the deck is well placed. It loses nothing to the bans, it's faster than most of the decks
expected to rise, and the close doesn't depend on spells that Defy can counter. Hold the list. Watch for Defy decks
and gear decks rising. Confidence: moderate on the direction, low on the specifics until results come in.

## 1. The field to expect (forecast)

What each archetype loses decides whether it's still there. Many hits are battlefields (Emperor's Dais, Star Spring)
or one 2–3 copy card, which are easy to replace.

| group | archetypes (pre-ban share) | what the bans take |
|---|---|---|
| **Untouched, expected to rise** | Evelynn (5.7%), Orianna (3.3%), Mordekaiser (3.3%), Azir (2.4%), Rek'Sai, Seraphine, Viktor, Ziggs, Ornn, Ezreal | nothing, or one card (Mordekaiser's Baited Hook; Orianna's Zhonya's in 40% of lists) |
| **Lose a card or two, stay** | Kai'Sa (5.8%; 3× Brynhir), Vex (3.7%; ~2× Zhonya's), Master Yi (3.2%; two battlefields and Zhonya's), Rengar (2.2%; two battlefields), LeBlanc (2.1%; Star Spring and Baited Hook) | replaceable |
| **Rebuilt** | Riven (9.2%; ~8 cards incl. Broken Blade in 99%) | the expert read is "still solid" with new draw and a new 4-drop |
| **Hit hard** | Kennen (4.9%; Nocturne and Rhasa, ~6 cards), Akali, Irelia (Stellacorn Herder) | core cards |

riftbound.gg's article picks Azir, Rek'Sai, Orianna and Ornn as the new proactive decks, Ezreal as the attrition
deck that gains most, and Vex and Master Yi as the strong all-rounders. It doesn't mention Evelynn, but she's the
most-played deck the bans barely touch (8% of her lists hit).

**Locally (Sip & Play):** Vex, Rengar, LeBlanc, Diana and Kai'Sa all survive; Kai'Sa loses Brynhir.

## 2. Sivir against it

Speed is the goldfish on the play, 30 lists each (`scripts/rift versus`; lists since 16 Oct, so pre-ban lists
included). Units by turn 3 / Might by turn 4. Yours: **3.3 / 15.3**.

| archetype | their speed | what threatens the plan | read |
|---|---|---|---|
| Azir | 2.2 / 12.6 | Hidden Blade 82% (kills from face down), Back Off 79%, **Defy 96%**, equipment (B.F. Sword +3 in 97%) | you're faster; their gear is the problem |
| Orianna | 1.9 / 9.6 | Charm 47% (moves your A holder), Defy 91%, gear | you're much faster |
| Ornn | 2.5 / 11.0 | Charm 74%, Defy 87%, gear | you're faster |
| Ezreal | 2.4 / 10.4 | Star-Crossed 92%, Gust 88%, damage spells | you're faster; attrition favours them late |
| Vex | 3.1 / 12.7 | her Vex 98% (stuns what you play), Back Off 83%, Defy 89% | the Boots walk beats her Vex (not played that turn) |
| Master Yi | 2.9 / 13.1 | **Charm 89%**, Rampage 80%, Defy 91% | Charm breaks the A trap; Ruin Runner (sb) can't be chosen |
| Evelynn | 3.3 / 14.9 | Star-Crossed 61%, Rampage 57%, her Vex 57% | **no Defy, Discipline or Zhonya's**: your spells are clean. Your 0–2 came largely from a Faefolk misplay at Forbidding Waste |
| Kai'Sa | 2.7 / 15.0 | Falling Star 97% (6 damage), Hextech Ray 96% | as before; Unyielding Spirit (sb) |
| Rek'Sai | **4.0** / 14.4 | Cull the Weak 95%, Falling Star 88% | faster than you on units; race it |
| Mordekaiser | 3.5 / 14.9 | Realm of Death 90%, Mordekaiser, Dominating 69%, Hidden Blade 64% | even speed, lots of removal |
| Rengar | 3.6 / **16.7** | Rampage 91% | faster on Might; he walks into A, which is your trap |
| Riven (rebuilt) | 2.9 / 13.8 | was Broken Blade's stun 91% (banned); Gust, Rebuke, Star-Crossed 76–78% | read again once her new lists show |

**What the new field pressures:**

1. **Defy.** It's in 87–96% of Azir, Orianna, Ornn, Vex, Master Yi and Riven lists, and it counters any spell
   costing up to 4 Energy and 1 Power. That's 10 of your cards: Ride the Wind ×3, Gust ×2, Star-Crossed ×2,
   Rampage ×2 and Existential Dread. It can't touch Rebuke, Punch First or Switcheroo (2 Power), units or gear.
   **The close survives:** the face-down Stranger and the Boots walk aren't spells. Only the Dread and Ride the Wind
   branches are exposed.
2. **Charm** (move an enemy unit) pulls your A holder out of the trap: Master Yi 89%, Ornn 74%, Orianna 47%.
   Ruin Runner in the sideboard can't be chosen.
3. **Gear decks** (Azir's equipment, Orianna, Ornn) should rise now that Zhonya's and Baited Hook are gone and
   fewer decks pack gear removal. You have two gear answers in the sideboard (An Offer You Can't Refuse, Ravenbloom
   Prefect).

The numbers the 21 Nov fixes moved are current here: an answer usable on their turn by turn 3 is **22% on the play,
26% on the draw** (Switcheroo counted again); Gold a game **3.5 / 4.1 / 3.75** (quiet / normal / heavy; Innovator
counted).

## 3. Candidate changes (tested, not adopted)

| candidate | test (`scripts/rift try`) | read | adopt if |
|---|---|---|---|
| **Main: −1 Ride the Wind, +1 Kinkou Initiate** (the existing ready swap) | units by turn 5 +0.2, Might +0.6; Defy-able spells expected 4.6 → 4.1; Gold −0.1; Mercenary on 1 point less often | small gain, but **not like-for-like**: Ride the Wind is a closing backup (move and ready), Kinkou is a body that sometimes draws. Confidence low | Defy decks are about 40%+ of the post-ban top results, or your logs show Ride the Wind countered or stuck in hand |
| **Sideboard: a second gear answer** (Offer or Prefect) in for a Ruin Runner or Unyielding Spirit | sideboard only, no goldfish change | depends entirely on whether gear decks rise. Confidence none yet | Azir, Orianna or Ornn reach the post-ban top 5 |
| **Everything else: hold** | — | the sideboard was re-aimed for the bans on 13 Nov (Repulse in for Acceptable Losses); nothing in it targets only a banned-out deck | — |

## 4. After the first post-ban weekend

- `scripts/rift meta --since 2026-11-23` and `scripts/rift field` for what actually placed; compare with section 1.
- Re-run `scripts/rift versus` for the real top 5, and `scripts/rift try` for the candidates above.
- Your games: log each one (journal plus `decklab/sivir-ready.md`), especially against Defy and Charm decks.
- Then decide the candidates together. Any list change is a live write (`deck-write` skill).
