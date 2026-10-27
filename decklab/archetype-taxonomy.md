---
title: Archetype taxonomy — worksheet
subtitle: Overarching archetypes, sub-archetypes, and where every legend and net deck sits. Built with Jay a section at a time; the result rewrites docs/archetypes.md.
started: 2026-10-27
status: stage 1 (the two axes) drafted — the questions below are Jay's
---

How this works: like a deck worksheet ([README.md](README.md)), each section agreed before
the next. Claude brings the data and the drafts; Jay makes the calls. Nothing here is on the
site, and docs/archetypes.md is not touched until the placements (§3) are agreed.

**Why** (27 Oct 2026, Jay): a shared map of what kinds of decks exist — overarching archetypes,
sub-archetypes under them, and which legends and decks fit where — with room for a legend
that plays more than one deck.

**The sections.**
1. **The two axes:** what the overarching archetype means and where it comes from, and what
   the sub-archetype is.
2. **The families:** the sub-archetypes, and which engines go in each.
3. **Placements:** every legend, and every net deck where a legend splits.
4. **Legends with several decks.**
5. **The doc scan:** every entry in docs/archetypes.md checked against today's lists, then
   the rewrite.

---

## 1. The two axes — draft

**Overarching: how the deck wins the race.** The five words the repo already uses: *aggro*
(fast, cheap, wide, little interaction), *tempo* (cheap, reactive, wins exchanges), *midrange*
(bigger bodies, trades into a better late board), *control* (answers first, wins late), *ramp*
(accelerates into big cards).

**Sub-archetype: the engine, the loop the deck runs.** The engine reader (lib/engines.mjs)
finds 18 loops in a list; docs/archetypes.md names one per legend on its Engine line, and
lib/engines.test.mjs keeps the two agreeing. The families in §2 group those 18 into a
handful a person can hold in their head.

**The problem to settle first: the overarching label has two sources, and they disagree on
35 of 58 legends.**
- **The doc's word** (the heading of each entry) is hand-written. Several were written from
  one or two lists, and "midrange" reads like a default: 16 of the 35 disagreements are a
  doc "midrange".
- **The measured word** (data/archetypes.json, build-archetypes.mjs) is a fixed-threshold
  rule on the representative list. Its "tempo" means **10+ Hidden or Reaction cards at an
  average cost of 3.2 or less**. Radiance put Hidden cards everywhere, and 22 of 58 legends
  now read tempo. The file itself says the hand-written word is "the one to read".

**Claude's recommendation:** the overarching archetype is **judged, not measured**: written
by us in §3, legend by legend, with the measured profile shown beside it as evidence (cost,
units, interaction, reactive cards, big cards). The measured rule stays as a cross-check,
and a disagreement is a thing to look at, not an error. The alternative, fixing the
thresholds until the rule agrees with our judgment, is fitting the rule to the answer.

**Questions for Jay**
1. Judged with the measurement as evidence (recommended), or measured only?
2. Are the five words the right five? (The classifier also has *combo*, for 12+ copies of one
   card; nothing reads combo today.)

---

## 2. The families — draft, after §1

| family | engines (lib/engines.mjs keys) | what it is |
|---|---|---|
| **Fights** | combat, mighty, buff, legion, stun | wins battlefields by winning combats: bigger units, pumps, buffs, stuns |
| **Movement** | move, exhaust | units that pay off for moving or exhausting, and ways to move again |
| **Gear** | gear | equipment and gear as the threat |
| **Go-wide** | tokens, death | many bodies; tokens, and payoffs for units dying |
| **Card flow** | offhand, trash, reveal, discard | value from the trash, the top of the deck, discards, playing from elsewhere |
| **Spells** | spells, hidden, empower | spell count, facedown cards, Empowered |
| **Levelling** | xp | XP as the resource |
| **No engine** | none | a curve, removal or ramp with no loop; the overarching word carries it |

**Known reader limits that will show in §3:** Sivir, Battle Mistress reads *hidden* (Gold and
Ganking are not patterns the reader knows; on engines.test's known misses); Rek'Sai reads
*reveal* where the doc says go-wide; Kennen reads *offhand* (plays from elsewhere), which is
right. Placements fix these by judgment, with the reason written down.

**The grid as the data has it today** (measured word × the reader's family; *not* a
proposal, the input to §3):

| family | aggro | tempo | midrange | control | ramp |
|---|---|---|---|---|---|
| **Fights** |  | K'Sante, Leona, Draven | Lee Sin, Rengar, Renekton, Sett, Garen, Darius |  | Volibear, Fiora |
| **Movement** | Kha'Zix, Vi | Riven, Irelia, Yasuo, Pyke, Diana | Seraphine | Miss Fortune, Akali |  |
| **Gear** | Jarvan IV | Orianna, Azir | Jax, Lucian, Ornn |  | Jayce |
| **Go-wide** |  | Lillia | Ziggs, Mordekaiser, Viktor |  | LeBlanc |
| **Card flow** | Rek'Sai | Kennen | Jinx, Zed |  |  |
| **Spells** | Sivir, Ambessa | Evelynn, Vex, Teemo, Mel |  | Jhin | Kai'Sa, Lux |
| **Levelling** |  | Master Yi | Poppy |  |  |
| **No engine** |  | Master Yi, Ahri, Ivern, Shen, Ekko | Rumble, Renata Glasc | Annie, Ezreal | Nasus |

---

## 3. Placements — raw input, after §2

One row per legend: the measured word (the doc's in brackets where it differs), the reader's
engine and family, the other loops it found, the doc's label today, and the evidence. **Thin**
= under 3 good placings: the profile is read from posted lists, not winners.

| legend | macro (measured) | family | engine (reader) | other loops | doc label today | evidence |
|---|---|---|---|---|---|---|
| Rengar, Pridestalker | midrange (doc: aggro) | Fights | combat | — | ambush aggro | 34 placed / 190 lists |
| Sett, The Boss | midrange | Fights | buff | — | buff midrange | 6 placed / 103 lists |
| Renekton, Butcher of the Sands | midrange (doc: ramp) | Fights | combat | — | unit ramp | 4 placed / 61 lists |
| Darius, Hand of Noxus | midrange (doc: aggro) | Fights | legion | — | legion aggro | 3 placed / 25 lists |
| Lee Sin, Blind Monk | midrange | Fights | buff | — | buff midrange | 1 placed / 37 lists · **thin** |
| Garen, Might of Demacia | midrange | Fights | combat | — | go-wide midrange | 0 placed / 16 lists · **thin** |
| Fiora, Grand Duelist | ramp | Fights | mighty | — | Mighty ramp | 15 placed / 156 lists |
| Volibear, Relentless Storm | ramp | Fights | mighty | — | big Mighty ramp | 0 placed / 48 lists · **thin** |
| Draven, Glorious Executioner | tempo (doc: midrange) | Fights | combat | — | combat-draw midrange | 6 placed / 31 lists |
| Leona, Radiant Dawn | tempo (doc: midrange) | Fights | buff | stun, combat | stun midrange | 2 placed / 61 lists · **thin** |
| K'Sante, Pride of Nazumah | tempo (doc: midrange) | Fights | combat | — | Shield midrange | 1 placed / 95 lists · **thin** |
| Kha'Zix, Voidreaver | aggro (doc: midrange) | Movement | move | combat, xp | isolation midrange | 8 placed / 91 lists |
| Vi, Piltover Enforcer | aggro | Movement | move | combat | equipment aggro | 4 placed / 98 lists |
| Akali, Rogue Assassin | control (doc: tempo) | Movement | move | — | movement tempo | 32 placed / 252 lists |
| Miss Fortune, Bounty Hunter | control (doc: tempo) | Movement | move | — | open-battlefield tempo | 0 placed / 31 lists · **thin** |
| Seraphine, Starry-Eyed Songstress | midrange (doc: control) | Movement | exhaust | — | exhaust-three control | 2 placed / 167 lists · **thin** |
| Riven, The Exile | tempo (doc: midrange) | Movement | exhaust | — | exhaust midrange | 52 placed / 250 lists |
| Irelia, Blade Dancer | tempo | Movement | move | — | movement tempo | 19 placed / 180 lists |
| Diana, Scorn of the Moon | tempo | Movement | move | — | showdown-spell tempo | 8 placed / 87 lists |
| Pyke, Bloodharbor Ripper | tempo (doc: control) | Movement | move | — | bounce control | 1 placed / 52 lists · **thin** |
| Yasuo, Unforgiven | tempo | Movement | move | — | movement tempo | 0 placed / 38 lists · **thin** |
| Jarvan IV, Exemplar of Demacia | aggro | Gear | gear | — | Deploy aggro | 2 placed / 91 lists · **thin** |
| Ornn, Fire Below the Mountain | midrange (doc: aggro) | Gear | gear | — | gear aggro | 9 placed / 110 lists |
| Lucian, Purifier | midrange (doc: aggro) | Gear | gear | — | equipment aggro | 5 placed / 60 lists |
| Jax, Grandmaster at Arms | midrange | Gear | gear | — | equipment midrange | 2 placed / 30 lists · **thin** |
| Jayce, Defender of Tomorrow | ramp | Gear | gear | — | gear ramp, with an alternate win | 20 placed / 159 lists |
| Azir, Emperor of the Sands | tempo | Gear | gear | tokens | soldier-token tempo | 19 placed / 180 lists |
| Orianna, Lady of Clockwork | tempo (doc: midrange) | Gear | gear | — | gear-to-unit midrange | 2 placed / 140 lists · **thin** |
| Viktor, Herald of the Arcane | midrange (doc: control) | Go-wide | tokens | death | recruit control | 17 placed / 212 lists |
| Mordekaiser, Iron Revenant | midrange (doc: ramp) | Go-wide | death | — | sacrifice ramp | 5 placed / 165 lists |
| Ziggs, Hexplosives Expert | midrange (doc: tempo) | Go-wide | tokens | — | bomb tempo | 2 placed / 179 lists · **thin** |
| LeBlanc, Deceiver | ramp (doc: midrange) | Go-wide | death | tokens | Deathknell midrange | 32 placed / 208 lists |
| Lillia, Bashful Bloom | tempo (doc: midrange) | Go-wide | tokens | — | Sprite-token midrange | 8 placed / 145 lists |
| Rek'Sai, Void Burrower | aggro (doc: midrange) | Card flow | reveal | death, combat | go-wide midrange | 21 placed / 172 lists |
| Jinx, Loose Cannon | midrange (doc: aggro) | Card flow | discard | combat | discard aggro | 0 placed / 41 lists · **thin** |
| Zed, Master of Shadows | midrange | Card flow | trash | move | clone midrange | 0 placed / 151 lists · **thin** |
| Kennen, Heart of the Tempest | tempo (doc: midrange) | Card flow | offhand | move | plays-from-elsewhere midrange | 62 placed / 237 lists |
| Ambessa, Matriarch of War | aggro | Spells | empower | move | empower aggro | 4 placed / 78 lists |
| Sivir, Battle Mistress | aggro | Spells | hidden | — | gold aggro | 1 placed / 25 lists · **thin** |
| Jhin, Virtuoso | control (doc: ramp) | Spells | spells | — | four-spell ramp | 3 placed / 60 lists |
| Kai'Sa, Daughter of the Void | ramp (doc: midrange) | Spells | spells | — | spell midrange | 31 placed / 190 lists |
| Lux, Lady of Luminosity | ramp | Spells | spells | — | big-spell ramp | 0 placed / 26 lists · **thin** |
| Vex, Gloomist | tempo (doc: control) | Spells | hidden | — | stun control | 17 placed / 278 lists |
| Evelynn, Agony's Embrace | tempo (doc: aggro) | Spells | hidden | — | facedown aggro | 6 placed / 217 lists |
| Teemo, Swift Scout | tempo (doc: aggro) | Spells | hidden | — | Hidden-swarm aggro | 2 placed / 76 lists · **thin** |
| Mel, Soul's Reflection | tempo (doc: midrange) | Spells | empower | move | empowered-spell midrange | 1 placed / 59 lists · **thin** |
| Poppy, Keeper of the Hammer | midrange | Levelling | xp | — | XP midrange | 3 placed / 43 lists |
| Master Yi, Wuju Master | tempo (doc: midrange) | Levelling | xp | — | levelling midrange | 4 placed / 63 lists |
| Ezreal, Prodigal Explorer | control | No engine | none | — | removal control | 7 placed / 86 lists |
| Annie, Dark Child | control (doc: aggro) | No engine | none | — | burn aggro | 0 placed / 40 lists · **thin** |
| Rumble, Mechanized Menace | midrange | No engine | none | — | Mech midrange | 1 placed / 64 lists · **thin** |
| Renata Glasc, Chem-Baroness | midrange | No engine | none | — | gold midrange | 0 placed / 31 lists · **thin** |
| Nasus, Curator of the Sands | ramp | No engine | none | — | big-spell ramp | 12 placed / 102 lists |
| Master Yi, Wuju Bladesman | tempo (doc: midrange) | No engine | none | — | lone-defender midrange | 37 placed / 256 lists |
| Ekko, Boy Who Shattered Time | tempo | No engine | none | — | re-buy tempo | 4 placed / 111 lists |
| Ivern, Green Father | tempo (doc: midrange) | No engine | none | — | tribes midrange | 2 placed / 95 lists · **thin** |
| Shen, Eye of Twilight | tempo (doc: midrange) | No engine | none | — | pair-defence midrange | 2 placed / 112 lists · **thin** |
| Ahri, Nine-Tailed Fox | tempo (doc: control) | No engine | none | — | shrink control | 0 placed / 75 lists · **thin** |

---

## 4. Legends with several decks — after §3

A legend is shown as several net decks only where its own lists earn it
(lib/netdeck.mjs SPLIT_EDGE, 27 Oct 2026). Today that is **none in Radiance**; in Vendetta,
**Fiora, Grand Duelist** and **Kennen, Heart of the Tempest**. Each split deck gets its own
row in §3 as it appears, placed on its own engine. A variant Jay knows from play that the
lists do not yet show goes here by hand, marked as judged.

---

## 5. The doc scan — after §4

**Thin entries** (25), written or measured from under 3 good placings:
Jax, Grandmaster at Arms (2), Lee Sin, Blind Monk (1), K'Sante, Pride of Nazumah (1), Sivir, Battle Mistress (1), Miss Fortune, Bounty Hunter (0), Volibear, Relentless Storm (0), Jarvan IV, Exemplar of Demacia (2), Garen, Might of Demacia (0), Yasuo, Unforgiven (0), Orianna, Lady of Clockwork (2), Ahri, Nine-Tailed Fox (0), Leona, Radiant Dawn (2), Ivern, Green Father (2), Shen, Eye of Twilight (2), Ziggs, Hexplosives Expert (2), Pyke, Bloodharbor Ripper (1), Jinx, Loose Cannon (0), Annie, Dark Child (0), Zed, Master of Shadows (0), Teemo, Swift Scout (2), Mel, Soul's Reflection (1), Rumble, Mechanized Menace (1), Seraphine, Starry-Eyed Songstress (2), Lux, Lady of Luminosity (0), Renata Glasc, Chem-Baroness (0).

Then every entry is re-read against its current lists, and docs/archetypes.md is rewritten
in the agreed structure: overarching archetype → family → legends and decks.

---

## Log

- **27 Oct 2026:** opened. Data from the snapshot of 27 Oct (LDXP Sacramento 25k included).
  The split rule (lib/netdeck.mjs) and the Leona and Vi Engine lines went in the same day.
