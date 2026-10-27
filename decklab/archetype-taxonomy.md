---
title: Archetype taxonomy — worksheet
subtitle: Overarching archetypes, sub-archetypes, and where every legend and net deck sits. Built with Jay a section at a time; the result rewrites docs/archetypes.md.
started: 2026-10-27
status: §1, §2 and §3 chunk 1 (aggro) agreed 27 Oct 2026; chunk 2 (tempo) drafted for Jay
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


### Chunk 1: aggro — agreed 27 Oct 2026

*Jay left the two borderline calls to Claude ("whatever makes sense"): **Teemo aggro**, since his
Hidden cards mostly deploy (Sprite Call, Teemo, Scout, Consult the Past) rather than answer,
with interaction 5; **Darius aggro**, since Legion pays for two cheap cards a turn and, with
interaction 4 and no big cards, nothing trades into a better late board.*

Candidates: every legend the measurement *or* the doc calls aggro (14). **Aggro** here means
§1's: a cheap curve, many units, little interaction, closing before the opponent stabilizes.
The profile numbers are the representative list's (data/archetypes.json). *Borderline* and
*thin* (under 3 good placings) are flagged; those are the calls most worth your eye.

| legend | placed | family | why |
|---|---|---|---|
| **Rengar, Pridestalker** | Aggro | Fights | 30 units, interaction 5, the fastest deck in the field by turn 4 (`versus`: 16.1 Might). Measured midrange only because its average cost is 2.8, just over the rule's 2.7. Legend: +1 Might per unit played |
| **Rek'Sai, Void Burrower** | Aggro | Go-wide | 27 cards at 2 or less, interaction 3, the most units by turn 3 (4.2). The reader says *reveal* (its legend), but the deck's payoffs are tokens and Deathknell value (Carrion Dredger, Honest Broker). Doc said midrange |
| **Kha'Zix, Voidreaver** | Aggro | Movement | Cost 2.6, 23 units, interaction 7. Legend: won fights pay XP, spent to walk an exhausted unit home, "in to win the fight, out before the retake" (doc, settled by Jun). **Jun has two lists, Aggro and Midrange**: a §4 row by hand. Doc said midrange |
| **Lucian, Purifier** | Aggro | Gear | Interaction 2, 21 cards at 2 or less; the 8 Equipment lift the average to 2.8. Legend: every Equipment gives Assault |
| **Vi, Piltover Enforcer** | Aggro | Movement | Cost 2.6, 25 units, interaction 2. Legend readies a unit after a big conquest; Ganking moves it on (Engine line fixed today) |
| **Ambessa, Matriarch of War** | Aggro | Fights | Cost 2.4, 23 cards at 2 or less. Empower is a switch (§2), so placed by what Empowered does here: Legion Marauder, Kayle, Guttural Roar (+4 to an Empowered unit): bigger units |
| **Jarvan IV, Exemplar of Demacia** | Aggro | Gear | Cost 2.7, interaction 2, 10 Deploy gear; the legend moves a unit to each one. *Thin (2)* |
| **Sivir, Battle Mistress** | Aggro | Extra resources | Cost 2.5, 19 cards at 2 or less: the *field's* Sivir is a fast combat curve. Gold is the payoff the reader cannot see. *Thin (1)*. **Aurora in 10 of 36 lists**: an Aurora row. **Jay's own deck** (Sivir Is Trying Her Best) plays longer, "outlasts them": a §4 row by hand, placed with Jay |
| **Darius, Hand of Noxus** | Aggro | Fights | 27 units, interaction 4; Legion (the legend adds Energy on the second card). *Borderline*: cost 2.9 and 16 cheap cards could read midrange. *Thin (3)* |
| **Jinx, Loose Cannon** | Aggro | Card flow | Legend draws only with one card or fewer in hand, so the deck empties its hand fast; Flame Chompers and Jinx, Rebel pay off discarding. *Thin (0 placed, 41 lists)* |
| **Teemo, Swift Scout** | Aggro | Facedown | 25 cards at 2 or less, interaction 5: a swarm. *Borderline*: 26 Hidden or Reaction cards are why it measures tempo, and his Hidden cards win exchanges (Switcheroo, Tideturner). *Thin (2)* |

**Moved out of aggro, to their own chunks:**
- **Evelynn, Agony's Embrace → Tempo · Facedown.** Average 3.2 and only 8 cards at 2 or less:
  not a cheap curve. 21 reactive cards, played from face down on either turn.
- **Ornn, Fire Below the Mountain → Midrange · Gear.** Only 15 units and 13 draw: it builds
  an engine of 19 gear rather than rushing; the low average (1.9) is cheap gear.
- **Annie, Dark Child → Control · No engine.** 19 interaction and 21 spells; the legend readies
  2 runes at the end of your turn, which is mana for answers on theirs. *Thin (0)*.

**What this chunk sends back up:**
- **§4 gets rows by hand**: Kha'Zix (Jun's Aggro and Midrange lists) and Sivir (Jay's own
  deck, and the Aurora lists). The lists do not split them yet (lib/netdeck.mjs), but they
  are known decks.
- **Legends that reward conquering** (Rek'Sai, Vi) went to their deck's payoffs, not to a
  "Conquer" family: conquering is what every aggro deck does, so it does not separate them.
  Holds is different because holding is a choice to stop attacking.


### Chunk 2: tempo — drafted 27 Oct 2026, for Jay

Candidates: every legend left that the measurement or the doc calls tempo, plus Evelynn from
chunk 1 (24). **Tempo** is §1's: cheap and reactive, staying ahead by winning exchanges.
Two things decided most rows. **Control, in Riftbound, is holding**: riftbound.gg defines it
as "grinds out points by holding Battlefields over time", and Orb's tier list calls Wuju Yi
"Defensive Control", so the defensive Holds decks with interaction are Control, not tempo.
And the measured rule's tempo is a Hidden-and-Reaction count (§1), which most Radiance decks
now pass; the shape decides instead.

**Tempo (10)**

| legend | family | why |
|---|---|---|
| **Irelia, Blade Dancer** | Movement | Cost 2.6, 26 cheap, 21 reactive. Legend readies a unit you choose; ready, move, draw (Stellacorn Herder). 19 placed |
| **Akali, Rogue Assassin** | Movement | Legend pulls a unit home from a showdown and readies it; Akali, Deadly Weapon deals damage on each move. Measures control only because those move-damage cards count as interaction (12). 32 placed |
| **Diana, Scorn of the Moon** | Spells | Legend's Energy is spendable only in showdowns: the payoff is showdown spells. 22 spells. 8 placed |
| **Lillia, Bashful Bloom** | Go-wide | Legend makes ready 3-Might Sprites, cheaper per Temporary unit: efficient bodies that act at once. 31 cheap. 8 placed |
| **Evelynn, Agony's Embrace** | Facedown | From chunk 1: cost 3.2, 21 reactive, played from face down on either turn |
| **Miss Fortune, Bounty Hunter** (clean) | Movement | Cost 2.3, 25 cheap; legend gives Ganking. *Thin (0)*. **67 of her 101 lists run Aurora**: a separate §4 row |
| **Yasuo, Unforgiven** | Movement | Cost 2.2, 32 cheap, 18 reactive; legend moves a unit to or from base. *Thin (0)* |
| **K'Sante, Pride of Nazumah** | Fights | Cost 2.4, 31 cheap; legend turns Shield into Assault, so defensive cards attack. *Thin (1)* |
| **Pyke, Bloodharbor Ripper** | Extra resources | Legend bounces your own unit for a Gold, so play effects repeat and Gold piles up. *Thin (1)* |
| **Ziggs, Hexplosives Expert** | Gear | Legend makes Bomb gear at battlefields, killed on purpose and remade. *Borderline*: the Bombs are removal, which could read control. *Thin (2)* |

**Control (4): the hold decks**

| legend | family | why |
|---|---|---|
| **Vex, Gloomist** | Holds | Legend draws on holds; Vex, Apathetic stuns, Hidden tricks protect the holds (§2 table). 17 placed |
| **Master Yi, Wuju Bladesman** | Holds | Legend: +2 to a unit defending alone. Cheap tricks around one defender; Orb: "Defensive Control". 37 placed |
| **Ahri, Nine-Tailed Fox** | Holds | Legend shrinks every attacker of a battlefield you control. *Thin (0)* |
| **Shen, Eye of Twilight** | Holds | Legend gives Tank; "pair defence; it wins by holding" (doc). *Thin (2)* |

**Midrange (9)**

| legend | family | why |
|---|---|---|
| **Riven, The Exile** | Holds | **The chunk's biggest call.** Cost 2.9, 4 big (Astral Heron, Baron), 11 draw: a midrange shape. Her legend pays off battlefields **she controls** (units played there enter ready), which is why denying them is the plan against her (her matchup guide). The exhaust loop (Riven, Broken Blade, Innovator, Ki Burst) is the engine inside it. *Borderline family*: Movement, on that loop. 52 placed |
| **Kennen, Heart of the Tempest** | Card flow | Legend empowers on every card played from elsewhere (Flow, Fizz, Matriarch) and turns it into Assault; Rhasa late. Interaction only 3: value, not answers. 62 placed |
| **Azir, Emperor of the Sands** | Go-wide | 3 units and 16 Equipment: the legend's Sand Soldiers are the board, made per Equipment. Slow start (2.1 units by turn 3), strong late. Orb: "Token-Based Midrange". 19 placed |
| **Ekko, Boy Who Shattered Time** | Card flow | Legend makes a unit cheap and kills it at end of turn: re-buying play effects, value the reader cannot see. 26 units, cost 3. 4 placed |
| **Leona, Radiant Dawn** | Fights | Cost 3, 16 cheap: bigger bodies. Stuns into buffs. *Thin (2)* |
| **Ivern, Green Father** | Holds | Legend makes a Brush on conquest or hold; tribes. Cost 3.1, 5 big. Jay: known as a hold deck. *Thin (2)* |
| **Orianna, Lady of Clockwork** | Gear | 7 units, 18 gear, 15 draw: the legend turns a gear into a unit. An engine, not a rush. *Thin (2)* |
| **Master Yi, Wuju Master** | Extra resources | Levels (XP) into +1 Might and units entering ready: grows into a late board. *Thin (4)* |
| **Mel, Soul's Reflection** | Spells | Empower placed by what it does: Shock Blast and Applied Researchers get cheaper while something is Empowered. 22 spells, 13 draw. *Thin (1)* |

**Aggro (1), back to chunk 1:** **Draven, Glorious Executioner · Fights.** 25 units, interaction
6, legend draws for every combat won. Orb: "Aggressive Midrange". 6 placed.

**What this chunk sends back up:**
- **Holds is now the largest home for control** (4 of 4) and takes Riven and Ivern in midrange.
  Holds and Control overlap a lot but are not the same axis: Riven and Ivern hold without
  being control. Worth watching in the control chunk.
- **§4:** a Miss Fortune Aurora row (67 of 101 lists).

---

## 4. Legends with several decks — after §3

A legend is shown as several net decks only where its own lists earn it
(lib/netdeck.mjs SPLIT_EDGE, 27 Oct 2026). Today that is **none in Radiance**; in Vendetta,
**Fiora, Grand Duelist** and **Kennen, Heart of the Tempest**. Each split deck gets its own
row in §3 as it appears, placed on its own engine. **Aurora versions** are separate decks too (lib/netdeck.mjs
partitions them by policy), so a legend with Aurora lists gets an Aurora row, tagged, beside
its clean one: Jayce, Miss Fortune, Wuju Yi, Fiora and Volibear at least. A variant Jay knows from play that the
lists do not yet show goes here by hand, marked as judged.

**Rows by hand:**

| deck | placed | family | why |
|---|---|---|---|
| **Sivir Is Trying Her Best** (Jay's) | **Midrange** | Extra resources | Measured with the field's own rule (build-archetypes `label`): cost 2.8, 14 cards at 2 or less, 25 units / 13 spells, 9 draw, interaction 6, so midrange. The field's Sivir (25 lists, cost 2.5, 19 cheap, 6 draw) reads aggro: a different deck, the Randyyy-style curve Jay rebuilt away from after 0-3 on 26 Oct ("early leads faded"). Its matchup plans press some opponents (Riven, Kennen): that is a role, not the archetype (strategy.md §2). Gold into cards is the payoff |
| Sivir, Battle Mistress, Aurora | *to place* | Ramp, *Aurora* | 10 of 36 lists |
| Kha'Zix, Voidreaver: Jun's Aggro and Midrange | *to place* | Movement | two known lists (in the app); the lists do not split yet |
| Miss Fortune, Bounty Hunter, Aurora | *to place* | Ramp, *Aurora* | 67 of 101 lists; Orb's "Midrange Ramp" |

---

## 5. The doc scan — after §4

**Thin entries** (25), written or measured from under 3 good placings:
Jax, Grandmaster at Arms (2), Lee Sin, Blind Monk (1), K'Sante, Pride of Nazumah (1), Sivir, Battle Mistress (1), Miss Fortune, Bounty Hunter (0), Volibear, Relentless Storm (0), Jarvan IV, Exemplar of Demacia (2), Garen, Might of Demacia (0), Yasuo, Unforgiven (0), Orianna, Lady of Clockwork (2), Ahri, Nine-Tailed Fox (0), Leona, Radiant Dawn (2), Ivern, Green Father (2), Shen, Eye of Twilight (2), Ziggs, Hexplosives Expert (2), Pyke, Bloodharbor Ripper (1), Jinx, Loose Cannon (0), Annie, Dark Child (0), Zed, Master of Shadows (0), Teemo, Swift Scout (2), Mel, Soul's Reflection (1), Rumble, Mechanized Menace (1), Seraphine, Starry-Eyed Songstress (2), Lux, Lady of Luminosity (0), Renata Glasc, Chem-Baroness (0).

Then every entry is re-read against its current lists, and docs/archetypes.md is rewritten
in the agreed structure: overarching archetype → family → legends and decks.

---

## Log

- **27 Oct 2026:** chunk 2 (tempo) drafted: 10 tempo, 4 control (all Holds), 9 midrange, Draven
  back to aggro; Miss Fortune Aurora to §4.
- **27 Oct 2026:** chunk 1 agreed; Teemo and Darius aggro, Claude's calls.
- **27 Oct 2026:** Jay's Sivir measured, not felt (Jay: "aren't we calling Sivir midrange?"):
  midrange by the field's own rule; the field's Sivir is aggro, a different deck. §4 row added.
- **27 Oct 2026:** §3 chunk 1 (aggro) drafted: 11 placed, 3 moved out; §4 gets Kha'Zix and
  Sivir by hand.
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
