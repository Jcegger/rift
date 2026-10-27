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
- 17 of the reader's 18 engines map to exactly one family, and Empower to none on purpose
  (below); *re-run after Holds and the payoff rule*;
- 51 of 58 legends have every loop the reader finds inside one family (49 before Facedown
  split from Spells), and the cross-family pairs are scattered, so no two families want
  merging;
- **the reader's family is a hint, not a placement**: it counts cards, and the payoff rule
  below can overrule it (Vex reads Hidden and is Holds); Holds and Ramp have no reader key;
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

**Added 27 Oct 2026 (Jay: "I like holds; Vex and Ivern are known as hold decks"): Holds**, the
eleventh family. Questioning Vex's Hidden showed a plan the ten did not cover; four legends
reward holding. Where a hold pays out in a resource (Renata's Gold, Poppy's XP), the hold is
the trigger, so the deck is Holds, with Extra resources as how the reward arrives.

**Tags** sit on top of a place, never instead of one:
- **combo:** the win is a specific interaction (§1).
- **Aurora:** runs Dazzling Aurora, a 9-Energy gear that plays a free unit off the top every
  turn: a ramp payoff, so usually *Ramp · Aurora*. 295 lists across 14 legends (Jayce,
  Defender of Tomorrow 104; Miss Fortune 67; Master Yi, Wuju Bladesman 44; Fiora 27;
  Volibear 25). lib/netdeck.mjs already partitions Aurora lists into their own decks, so an
  Aurora version of a legend is its own row in §3. Never suggested to Jay (CLAUDE.md), always
  covered as a matchup.

**The placement rule (from questioning Empower and Hidden, 27 Oct 2026): a deck is in a family
for its payoffs, not its card counts.** A mechanic is the deck's family only when something
in the deck, usually the legend, rewards it beyond the card itself. Checked on the four
legends whose top loop the reader calls Hidden:

| legend | Hidden cards | what rewards being face down | so |
|---|---|---|---|
| Teemo, Swift Scout | 27 | his legend hides for 1 Energy instead of 1 Power; Guerilla Warfare returns Hidden cards from the trash | **Facedown**: the legend is why he runs so many |
| Evelynn, Agony's Embrace | 18 | legend draws on every face-down play; Ember Monk, Gutter Guardian; Evelynn, In Control scores with a face-down card | **Facedown** |
| Vex, Gloomist | 12 | nothing for face down; her legend draws on holds | Hidden is free tricks protecting holds: **Holds**, not Facedown |
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
| **Holds** | *no reader key yet* | rewarded for keeping battlefields, with Hidden tricks and interaction to protect them. Legends: Vex, Gloomist (draw on hold), Ivern, Green Father (Brush on hold), Renata Glasc, Chem-Baroness (Gold on hold), Poppy, Keeper of the Hammer (XP on hold); 42 other cards pay off holding |
| **Ramp** | *none yet: the reader has no ramp loop* | reaching the 12-rune cap early (rune ramp) or making big cards cheap (cost ramp), to land them turns ahead |
| **Extra resources** | xp; Gold *(no reader key yet)* | a second resource the deck builds and spends: XP (Poppy, Master Yi, Wuju Master), Gold (Sivir, Renata Glasc) |
| **No engine** | none | a curve or a removal suite with no loop; the overarching word carries it |

**Known reader limits that will show in §3:** Sivir, Battle Mistress reads *hidden* (Gold and
Ganking are not patterns the reader knows; on engines.test's known misses); Rek'Sai reads
*reveal* where the doc says go-wide; Kennen reads *offhand* (plays from elsewhere), which is
right. Placements fix these by judgment, with the reason written down.

**The grid as the data has it today** (measured word × the reader's family *hint*, regenerated
27 Oct 2026 with the current families; the input to §3, not a proposal):

| reader family hint | aggro | tempo | midrange | control | ramp |
|---|---|---|---|---|---|
| **Fights** |  | K'Sante, Leona, Draven | Lee Sin, Rengar, Renekton, Sett, Garen, Darius |  | Volibear, Fiora |
| **Movement** | Kha'Zix, Vi | Riven, Irelia, Yasuo, Pyke, Diana | Seraphine | Miss Fortune, Akali |  |
| **Gear** | Jarvan IV | Orianna, Azir | Jax, Lucian, Ornn |  | Jayce |
| **Go-wide** |  | Lillia | Ziggs, Mordekaiser, Viktor |  | LeBlanc |
| **Card flow** | Rek'Sai | Kennen | Jinx, Zed |  |  |
| **Spells** |  |  |  | Jhin | Kai'Sa, Lux |
| **Facedown** | Sivir | Evelynn, Vex, Teemo |  |  |  |
| **Extra resources** |  | Master Yi | Poppy |  |  |
| **(switch: by payoff)** | Ambessa | Mel |  |  |  |
| **No engine** |  | Master Yi, Ahri, Ivern, Shen, Ekko | Rumble, Renata Glasc | Annie, Ezreal | Nasus |

---

## 3. Placements — raw input, regenerated 27 Oct 2026 with the current families

One row per legend. **The legend text comes first, because it is usually the payoff** (the
placement rule, §2). Then the measured word (the doc's in brackets where it differs), the
reader's engine and the family it hints at, the other loops it found, the doc's label today,
and the evidence. **Thin** = under 3 good placings: read from posted lists, not winners.
Placements are judged from these, chunk by chunk, each with its reason.

| legend | legend text (the usual payoff) | measured | reader → family hint | other loops | doc label today | evidence |
|---|---|---|---|---|---|---|
| Rengar, Pridestalker | When you play a unit, give a unit +1 Might this turn. | midrange (doc: aggro) | combat → Fights | — | ambush aggro | 34 placed / 190 lists |
| Fiora, Grand Duelist | When one of your units becomes [Mighty], you may exhaust me to channel 1 rune exhausted. | ramp | mighty → Fights | — | Mighty ramp | 15 placed / 156 lists |
| Sett, The Boss | When a buffed unit you control would die, you may pay 1P and exhaust me to spend its buff and recall it exhausted instead. When you conquer, ready me. | midrange | buff → Fights | — | buff midrange | 6 placed / 103 lists |
| Draven, Glorious Executioner | When you win a combat, draw 1. | tempo (doc: midrange) | combat → Fights | — | combat-draw midrange | 6 placed / 31 lists |
| Renekton, Butcher of the Sands | [Reaction][>] 1P1P, exhaust: [Add] ·. Spend this Energy only to play units or activated abilities of units. | midrange (doc: ramp) | combat → Fights | — | unit ramp | 4 placed / 61 lists |
| Darius, Hand of Noxus | exhaust: [Reaction], [Legion] — [Add] 1E. | midrange (doc: aggro) | legion → Fights | — | legion aggro | 3 placed / 25 lists |
| Leona, Radiant Dawn | When you stun one or more enemy units, buff a friendly unit. | tempo (doc: midrange) | buff → Fights | stun, combat | stun midrange | 2 placed / 61 lists · **thin** |
| Lee Sin, Blind Monk | 1E, exhaust: Buff a friendly unit. | midrange | buff → Fights | — | buff midrange | 1 placed / 37 lists · **thin** |
| K'Sante, Pride of Nazumah | 1E, exhaust: Give a friendly unit "I have [Assault] equal to my [Shield]" this turn. | tempo (doc: midrange) | combat → Fights | — | Shield midrange | 1 placed / 95 lists · **thin** |
| Volibear, Relentless Storm | When you play a [Mighty] unit, you may exhaust me to channel 1 rune exhausted. | ramp | mighty → Fights | — | big Mighty ramp | 0 placed / 48 lists · **thin** |
| Garen, Might of Demacia | When you conquer, if you have 4+ units at that battlefield, draw 2. | midrange | combat → Fights | — | go-wide midrange | 0 placed / 16 lists · **thin** |
| Riven, The Exile | Units you play to battlefields you control enter ready. | tempo (doc: midrange) | exhaust → Movement | — | exhaust midrange | 52 placed / 250 lists |
| Akali, Rogue Assassin | [Empower] ·1P [Action][>] exhaust: If it's your turn, move a friendly unit in a showdown to base and if I'm [Empowered], ready it. | control (doc: tempo) | move → Movement | — | movement tempo | 32 placed / 252 lists |
| Irelia, Blade Dancer | When you choose a friendly unit, you may exhaust me and pay 1P to ready it. When you conquer, you may pay 1E to ready me. | tempo | move → Movement | — | movement tempo | 19 placed / 180 lists |
| Kha'Zix, Voidreaver | When you win a combat, gain 1 XP. Spend 1 XP, exhaust: [Buff] a unit. Spend 2 XP, exhaust: Move an exhausted friendly unit from a battlefield to its base. | aggro (doc: midrange) | move → Movement | combat, xp | isolation midrange | 8 placed / 91 lists |
| Diana, Scorn of the Moon | [Reaction][>] exhaust: [Add] 1E. Spend this Energy only during showdowns. | tempo | move → Movement | — | showdown-spell tempo | 8 placed / 87 lists |
| Vi, Piltover Enforcer | When you conquer, if you assigned 3 or more excess damage, you may exhaust me to ready a unit. | aggro | move → Movement | combat | equipment aggro | 4 placed / 98 lists |
| Seraphine, Starry-Eyed Songstress | As an additional cost to play a spell, you may exhaust me and three friendly units to reduce the cost of that spell by ·. | midrange (doc: control) | exhaust → Movement | — | exhaust-three control | 2 placed / 167 lists · **thin** |
| Pyke, Bloodharbor Ripper | 1E, exhaust: Return a friendly unit at a battlefield to its owner's hand. Play a Gold gear token exhausted. | tempo (doc: control) | move → Movement | — | bounce control | 1 placed / 52 lists · **thin** |
| Miss Fortune, Bounty Hunter | exhaust: Give a unit [Ganking] this turn. | control (doc: tempo) | move → Movement | — | open-battlefield tempo | 0 placed / 31 lists · **thin** |
| Yasuo, Unforgiven | ·, exhaust: Move a friendly unit to or from your base. | tempo | move → Movement | — | movement tempo | 0 placed / 38 lists · **thin** |
| Jayce, Defender of Tomorrow | [Empower] ·1P1P 1E, exhaust: Ready a gear. [Empowered][>] 1E, exhaust: Ready 2 gear. | ramp | gear → Gear | — | gear ramp, with an alternate win | 20 placed / 159 lists |
| Azir, Emperor of the Sands | Your Sand Soldiers have [Weaponmaster]. 1E, exhaust: Play a 2 Might Sand Soldier unit token to your base. Use only if you've played an Equipment this turn. | tempo | gear → Gear | tokens | soldier-token tempo | 19 placed / 180 lists |
| Ornn, Fire Below the Mountain | exhaust: [Reaction] — [Add] 1P. Use only to play gear or use gear abilities. | midrange (doc: aggro) | gear → Gear | — | gear aggro | 9 placed / 110 lists |
| Lucian, Purifier | Your Equipment each give [Assault]. | midrange (doc: aggro) | gear → Gear | — | equipment aggro | 5 placed / 60 lists |
| Jax, Grandmaster at Arms | 1E, exhaust: Attach a detached Equipment you control to a unit you control. exhaust: Attach an attached Equipment you control to a unit you control. | midrange | gear → Gear | — | equipment midrange | 2 placed / 30 lists · **thin** |
| Jarvan IV, Exemplar of Demacia | When you play a gear with [Deploy], you may exhaust me and pay 1P to move a friendly unit to that battlefield. | aggro | gear → Gear | — | Deploy aggro | 2 placed / 91 lists · **thin** |
| Orianna, Lady of Clockwork | At the start of your Main Phase, you may pay 1E to choose a friendly gear. It becomes a unit gear with Might equal to its Energy cost until you choose another gear with me. | tempo (doc: midrange) | gear → Gear | — | gear-to-unit midrange | 2 placed / 140 lists · **thin** |
| LeBlanc, Deceiver | When you conquer or hold, you may discard 1 and exhaust me to play a ready Reflection unit token there. It becomes a copy of another unit there. Give it [Temporary]. | ramp (doc: midrange) | death → Go-wide | tokens | Deathknell midrange | 32 placed / 208 lists |
| Viktor, Herald of the Arcane | 1E, exhaust: Play a 1 Might Recruit unit token. | midrange (doc: control) | tokens → Go-wide | death | recruit control | 17 placed / 212 lists |
| Lillia, Bashful Bloom | ·, exhaust: Play a ready 3 Might Sprite unit token with [Temporary]. This ability costs 1E less for each friendly unit with [Temporary]. | tempo (doc: midrange) | tokens → Go-wide | — | Sprite-token midrange | 8 placed / 145 lists |
| Mordekaiser, Iron Revenant | [Reaction][>] Banish a unit or gear from your trash, exhaust: [Add] 1P. Spend this Power only to play units or gear. | midrange (doc: ramp) | death → Go-wide | — | sacrifice ramp | 5 placed / 165 lists |
| Ziggs, Hexplosives Expert | 1E1P, exhaust: Play a Bomb gear token to a battlefield. | midrange (doc: tempo) | tokens → Go-wide | — | bomb tempo | 2 placed / 179 lists · **thin** |
| Kennen, Heart of the Tempest | When you play a card from anywhere other than your hand, empower me. [Action][>] Disempower me, exhaust: Give a unit [Assault 2] this turn. | tempo (doc: midrange) | offhand → Card flow | move | plays-from-elsewhere midrange | 62 placed / 237 lists |
| Rek'Sai, Void Burrower | When you conquer, you may exhaust me to reveal the top 2 cards of your Main Deck. You may play one. Then recycle the rest. | aggro (doc: midrange) | reveal → Card flow | death, combat | go-wide midrange | 21 placed / 172 lists |
| Jinx, Loose Cannon | At start of your Beginning Phase, draw 1 if you have one or fewer cards in your hand. | midrange (doc: aggro) | discard → Card flow | combat | discard aggro | 0 placed / 41 lists · **thin** |
| Zed, Master of Shadows | When you banish a card you own, empower me. [Action][>] Disempower me, exhaust: Discard 1, then draw 1. | midrange | trash → Card flow | move | clone midrange | 0 placed / 151 lists · **thin** |
| Kai'Sa, Daughter of the Void | exhaust: [Reaction] — [Add] 1P. Use only to play spells. | ramp (doc: midrange) | spells → Spells | — | spell midrange | 31 placed / 190 lists |
| Jhin, Virtuoso | When you play a spell, if you spent · or more, you may banish it. Then, if there are four spells banished with me, put each in its trash, channel 4 runes, and draw 1. | control (doc: ramp) | spells → Spells | — | four-spell ramp | 3 placed / 60 lists |
| Lux, Lady of Luminosity | When you play a spell that costs · or more, draw 1. | ramp | spells → Spells | — | big-spell ramp | 0 placed / 26 lists · **thin** |
| Vex, Gloomist | When you or an ally hold, you may exhaust me to draw 1. | tempo (doc: control) | hidden → Facedown | — | stun control | 17 placed / 278 lists |
| Evelynn, Agony's Embrace | Once each turn, when you play a card from face down, draw 1. Then, if it's not your turn, discard 1. | tempo (doc: aggro) | hidden → Facedown | — | facedown aggro | 6 placed / 217 lists |
| Teemo, Swift Scout | You may pay 1E to hide a card with [Hidden] instead of 1P. 1E, exhaust: Put a Teemo unit you own into your hand from your Champion Zone or the board. | tempo (doc: aggro) | hidden → Facedown | — | Hidden-swarm aggro | 2 placed / 76 lists · **thin** |
| Sivir, Battle Mistress | When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more enemy units die, ready me. | aggro | hidden → Facedown | — | gold aggro | 1 placed / 25 lists · **thin** |
| Master Yi, Wuju Master | [Level 6][>] Your units have +1 Might. [Level 11][>] Your units enter ready. | tempo (doc: midrange) | xp → Extra resources | — | levelling midrange | 4 placed / 63 lists |
| Poppy, Keeper of the Hammer | When you hold, gain 1 XP. Spend 3 XP, exhaust: Draw 1. | midrange | xp → Extra resources | — | XP midrange | 3 placed / 43 lists |
| Ambessa, Matriarch of War | When you empower something else, empower me. Disempower me, 1P, exhaust: Ready a unit. | aggro | empower → (switch: by payoff) | move | empower aggro | 4 placed / 78 lists |
| Mel, Soul's Reflection | When you empower something else, empower me. Disempower me, exhaust: Give a unit at a battlefield -2 Might this turn. | tempo (doc: midrange) | empower → (switch: by payoff) | move | empowered-spell midrange | 1 placed / 59 lists · **thin** |
| Master Yi, Wuju Bladesman | While a friendly unit defends alone, it gets +2 Might. | tempo (doc: midrange) | none → No engine | — | lone-defender midrange | 37 placed / 256 lists |
| Nasus, Curator of the Sands | When you play a unit, gear, or activated ability with Energy cost · or more, you may exhaust me to ready up to 2 runes. | ramp | none → No engine | — | big-spell ramp | 12 placed / 102 lists |
| Ezreal, Prodigal Explorer | exhaust: [Reaction] — Draw 1. Use only if you've chosen enemy units and/or gear twice this turn with spells or unit abilities. | control | none → No engine | — | removal control | 7 placed / 86 lists |
| Ekko, Boy Who Shattered Time | [Empower] — 1E, exhaust Disempower me, exhaust: Reduce the cost of the next unit you play this turn by ·1P and give it "Kill me at end of turn." | tempo | none → No engine | — | re-buy tempo | 4 placed / 111 lists |
| Ivern, Green Father | When you conquer or hold, you may exhaust me to replace that battlefield with a Brush battlefield token. | tempo (doc: midrange) | none → No engine | — | tribes midrange | 2 placed / 95 lists · **thin** |
| Shen, Eye of Twilight | [Action][>] exhaust: Give a friendly unit [Tank] this turn. | tempo (doc: midrange) | none → No engine | — | pair-defence midrange | 2 placed / 112 lists · **thin** |
| Rumble, Mechanized Menace | Your Mechs have [Shield]. | midrange | none → No engine | — | Mech midrange | 1 placed / 64 lists · **thin** |
| Ahri, Nine-Tailed Fox | When an enemy unit attacks a battlefield you control, give it -1 Might this turn, to a minimum of 1 Might. | tempo (doc: control) | none → No engine | — | shrink control | 0 placed / 75 lists · **thin** |
| Annie, Dark Child | At the end of your turn, ready 2 runes. | control (doc: aggro) | none → No engine | — | burn aggro | 0 placed / 40 lists · **thin** |
| Renata Glasc, Chem-Baroness | When you or an ally hold, you may exhaust me to play a Gold gear token exhausted. While your score is within 3 points of the Victory Score, your Gold [Add] an additional 1E. | midrange | none → No engine | — | gold midrange | 0 placed / 31 lists · **thin** |

---

## 4. Legends with several decks — after §3

A legend is shown as several net decks only where its own lists earn it
(lib/netdeck.mjs SPLIT_EDGE, 27 Oct 2026). Today that is **none in Radiance**; in Vendetta,
**Fiora, Grand Duelist** and **Kennen, Heart of the Tempest**. Each split deck gets its own
row in §3 as it appears, placed on its own engine. **Aurora versions** are separate decks too (lib/netdeck.mjs
partitions them by policy), so a legend with Aurora lists gets an Aurora row, tagged, beside
its clean one: Jayce, Miss Fortune, Wuju Yi, Fiora and Volibear at least. A variant Jay knows from play that the
lists do not yet show goes here by hand, marked as judged.

---

## 5. The doc scan — after §4

**Thin entries** (25), written or measured from under 3 good placings:
Jax, Grandmaster at Arms (2), Lee Sin, Blind Monk (1), K'Sante, Pride of Nazumah (1), Sivir, Battle Mistress (1), Miss Fortune, Bounty Hunter (0), Volibear, Relentless Storm (0), Jarvan IV, Exemplar of Demacia (2), Garen, Might of Demacia (0), Yasuo, Unforgiven (0), Orianna, Lady of Clockwork (2), Ahri, Nine-Tailed Fox (0), Leona, Radiant Dawn (2), Ivern, Green Father (2), Shen, Eye of Twilight (2), Ziggs, Hexplosives Expert (2), Pyke, Bloodharbor Ripper (1), Jinx, Loose Cannon (0), Annie, Dark Child (0), Zed, Master of Shadows (0), Teemo, Swift Scout (2), Mel, Soul's Reflection (1), Rumble, Mechanized Menace (1), Seraphine, Starry-Eyed Songstress (2), Lux, Lady of Luminosity (0), Renata Glasc, Chem-Baroness (0).

Then every entry is re-read against its current lists, and docs/archetypes.md is rewritten
in the agreed structure: overarching archetype → family → legends and decks.

---

## Log

- **27 Oct 2026:** §2 audit re-run and the §2 grid and §3 table regenerated with the current
  families (Jay: "do you need to re-do the other steps?"); legend text added to §3.
- **27 Oct 2026:** Holds added as the eleventh family (Vex, Ivern, Renata, Poppy); Aurora a tag
  (Jay: Poppy is an Aurora deck), usually on Ramp.
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
