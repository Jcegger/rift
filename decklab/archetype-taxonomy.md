---
title: Archetype taxonomy — worksheet
subtitle: Overarching archetypes, sub-archetypes, and where every legend and net deck sits. Built with Jay a section at a time; the result rewrites docs/archetypes.md.
started: 2026-10-27
status: §1 and §2 agreed 27 Oct 2026; §3 (placements) next
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

## 1. The two axes — agreed 27 Oct 2026

**Agreed (Jay, 27 Oct 2026):**
- **Four overarching archetypes: aggro, tempo, midrange, control.** Judged legend by legend
  (and deck by deck where a legend splits), with the measured profile beside each as
  evidence. The measured label (build-archetypes.mjs) stays as a cross-check; a disagreement
  is something to look at, not an error.
- **Ramp is a family** (§2), not an overarching archetype: a ramp deck is placed by what it
  ramps into.
- **Combo is a tag** a deck can carry on top of its place, not a level.

The reasoning and the research it rests on, as drafted:

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

### Is ramp an overarching archetype? Research, 27 Oct 2026 (Jay: "I wonder if ramp is a subtype")

**Riftbound caps ramp, structurally.** The Rune Deck is exactly 12 runes (§103.4), everyone
channels 2 a turn (§315.3.b), and with fewer than 2 left you channel what remains
(§315.3.b.1, §431.3). So **every player has all 12 runes by turn 6, ramp or not**. Ramp
cannot build a bigger mana base than the opponent's, only reach the same one a turn or two
sooner. The cards are written for that ceiling: Mobilize and Catalyst of Aeons say "if you
can't, draw 1". (Recycling a rune for Power sends it back to the Rune Deck, so a deck can
fall below 12 and channel back up, but never above.) In Magic, ramp is a whole plan because
lands keep coming; here it is a few turns of acceleration.

**There are two kinds of "ramp" in the cards, and neither is a plan by itself:**
- **Rune ramp:** channel extra (Mobilize, Catalyst of Aeons, Stormclaw Ursine, K'Sante,
  Courageous; legends Grand Duelist and Relentless Storm). Body-heavy: Riot's own deckbuilding
  primer has the word "ramp" exactly once, as a Body trait: "Body decks often ramp their
  resources, play efficient and high impact units, and dominate combats".
- **Cost ramp:** cards that get cheaper (Astral Heron, Rhasa, Hunters' Circle). That is an
  engine, closer to what lib/engines.mjs reads than to an overall plan.

**The community doesn't use ramp as a top level either.**
- [RiftCompare](https://riftcompare.com/guides/riftbound-deck-archetypes-guide) (Sep 2026):
  three pillars, aggro, tempo and midrange, with tags layered on (combo, disruption, value,
  gear, spell, reach). No control, no ramp.
- [Riftbound Zone](https://riftbound.zone/en/guide/riftbound-deck-identity/) (Jun 2026):
  aggro, control, midrange, combo. Acceleration is one of a deck's engines, not an archetype.
- [riftbound.gg](https://riftbound.gg/riftbound-tcg-deck-archetypes-how-to-find-your-playstyle/)
  (Jul 2026): aggro, control, combo, "officially" with no source given; Riot's primer uses no
  archetype words at all.
- [Orb's tier list](https://orbtradingcards.com/store/blog/riftbound-tier-list-best-decks-2026)
  (Mar 2026): two-part labels almost everywhere, **"Buff-Based Midrange", "Token-Based
  Midrange", "Spell-Based Control", "Equipment Aggro", "Stun Control"**, and ramp once, as
  "Midrange Ramp" (Miss Fortune). That is this worksheet's two axes, in the wild.
- **Players' own titles** (7,614 lists in data/decks.json): archetype words are rare
  (midrange 14, control 13, tempo 11, aggro 8) and "ramp" appears twice. Decks are named by
  legend (docs/jargon.md).

**What follows for this map:** ramp is a **family** (§2), the way to get there, not where you
are going. A ramp deck is ramping *into* something: a midrange body, a control finisher.
The measured "ramp" label (7 legends today, e.g. Fiora, Kai'Sa, LeBlanc, Jayce) gets re-judged
as the macro it ramps into, with **Ramp** as its family where the acceleration is the deck's
loop. *Combo* is the same kind of word (a tag in every source above), and nothing measures
as combo today.

**Claude's recommendation:** four overarching archetypes, **aggro, tempo, midrange,
control**, judged, with the measured profile as evidence; **Ramp** joins the families in §2
(rune ramp and cost ramp); **combo** is a tag a deck can carry, not a level.

**Questions for Jay**
1. Judged with the measurement as evidence (recommended), or measured only?
2. Four overarching (aggro, tempo, midrange, control), with ramp a family and combo a tag?
   RiftCompare would drop control too; the field has real control decks (Kai'Sa, Jhin,
   Ezreal), so Claude would keep it.

---

## 2. The families — agreed 27 Oct 2026

**Agreed** (Jay: "feels pretty good", on Claude auditing it first). **The audit**, against the
27 Oct data:
- all 18 engines the reader knows map to exactly one family;
- 49 of 58 legends have every loop the reader finds inside one family, and the cross-family
  pairs are scattered (2 at most), so no two families want merging;
- 2 to 11 legends per family; the small ones (Facedown, Extra resources) fill by judgment in
  §3, since the reader has no Gold key;
- **Empower is in no family** (corrected the same day; Jay: "empower is pretty wide open… we
  use empower with Matriarch to bring back a unit"). The audit first moved it to Fights as
  "units getting stronger", from the 2 legends whose top loop it is, without reading the
  cards. The cards: 55 mention Empower, in all six domains and every card type, and what
  Empowered does ranges from Might (Steel Paws) to keywords (Shadow Fiend), interaction
  (Mel, Defiant Soul), cards (Questionable Tome), the trash (Tail-Cloaked Matriarch's revive)
  and scoring (Nasus, Ascended); Tornado Warrior, Sanction and Kennen's legend flip it.
  **Empower is a switch, not a plan**: a deck whose loop is Empower is placed by what its
  Empowered cards do, by judgment, in §3 (Ambessa, Mel).

**The placement rule (from questioning Empower and Hidden, 27 Oct 2026): a deck is in a family
for its payoffs, not its card counts.** A mechanic is the deck's family only when something
in the deck, usually the legend, rewards it beyond the card itself. Checked on the four
legends whose top loop the reader calls Hidden:

| legend | Hidden cards | what rewards being face down | so |
|---|---|---|---|
| Teemo, Swift Scout | 27 | his legend hides for 1 Energy instead of 1 Power; Guerilla Warfare returns Hidden cards from the trash | **Facedown**: the legend is why he runs so many |
| Evelynn, Agony's Embrace | 18 | legend draws on every face-down play; Ember Monk, Gutter Guardian; Evelynn, In Control scores with a face-down card | **Facedown** |
| Vex, Gloomist | 12 | nothing; her legend draws on holds | Hidden is free tricks protecting holds: placed on the hold plan, not Facedown |
| Sivir, Battle Mistress | 9 | nothing | hiding is where Gold goes: **Extra resources** |

Most Radiance decks run some Hidden as free tricks, so a Hidden count alone says nothing.
The same rule covers Empower above and any mechanic that turns up in §3.

**Follow-ups for the reader** (lib/engines.mjs), not blocking §3: a Gold key (Sivir is a known
miss because of it) and a Ramp key (channel extra, cost reduction).


*Revised 27 Oct 2026 after §1, by Claude: Facedown split from Spells (4 legends' top loop, and
it hides units and gear too); Gold joins XP as Extra resources (the doc already labels
Renata and Sivir "gold"); ramp out of No engine, now that it is a family.*

| family | engines (lib/engines.mjs keys) | what it is |
|---|---|---|
| **Fights** | combat, mighty, buff, legion, stun | wins battlefields by winning combats: bigger units, pumps, buffs, Mighty, stuns |
| **Movement** | move, exhaust | units that pay off for moving or exhausting, and ways to move again |
| **Gear** | gear | equipment and gear as the threat |
| **Go-wide** | tokens, death | many bodies; tokens, and payoffs for units dying |
| **Card flow** | offhand, trash, reveal, discard | value from the trash, the top of the deck, discards, playing from elsewhere |
| **Spells** | spells | spell count and spell payoffs |
| **Facedown** | hidden | cards hidden at your battlefields and played free later: units and gear as well as spells. Its own family since Radiance made Hidden common |
| **Ramp** | *none yet: the reader has no ramp loop* | reaching the 12-rune cap early (rune ramp) or making big cards cheap (cost ramp), to land them turns ahead |
| **Extra resources** | xp; Gold *(no reader key yet)* | a second resource the deck builds and spends: XP (Poppy, Master Yi, Wuju Master), Gold (Sivir, Renata Glasc) |
| **No engine** | none | a curve or a removal suite with no loop; the overarching word carries it |

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

- **27 Oct 2026:** placement rule added (Jay: "question everything… Teemo runs a lot of hidden"):
  a family needs a payoff, not a card count. Teemo's legend is why he runs 27 Hidden.
- **27 Oct 2026:** §2 agreed after Claude's audit. Empower first moved to Fights, then, on Jay's
  check and a read of all 55 Empower cards, out of every family: a switch, placed by what it does.
- **27 Oct 2026:** §1 agreed: judged overarching archetype with the measurement as evidence;
  aggro, tempo, midrange, control; ramp a family; combo a tag.
- **27 Oct 2026:** §1 research on ramp (Jay asked whether it is a subtype): ramp moved to a
  family; four overarching archetypes proposed.
- **27 Oct 2026:** opened. Data from the snapshot of 27 Oct (LDXP Sacramento 25k included).
  The split rule (lib/netdeck.mjs) and the Leona and Vi Engine lines went in the same day.
