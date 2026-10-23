---
title: Sivir Midrange — deckbuilding worksheet
subtitle: Sivir, Battle Mistress (Body/Chaos), Radiance. Built together, step by step; nothing here is automatic.
started: 2026-10-23
status: list complete 23 Oct 2026 (sections 1–4) · section 5 logs games
---

How this worksheet works (see `decklab/README.md`): five sections, filled in order. Each one
is agreed before the next starts. Cards are argued against the slot they compete for, with
their rules checked and their evidence stated, and no card is in because a tool picked it.

---

## 1. How it wins — agreed 2026-10-23 (revised the same day)

**How it wins, in one paragraph.** Cheap bodies take battlefields early: they attack slow
decks and hold against fast ones. Fights are won with tricks the Gold helps pay for, and
hidden cards defend the holds. When trades thin our board, Tail-Cloaked Matriarch and Fizz
bring bodies and tricks back from the trash, so we are still contesting battlefields after
the opponent runs out. Mid-game we refocus on one battlefield, and Sivir, Mercenary takes the
other or breaks their hold, to close at 6 or 7.

**Midrange, here.** Midrange changes role by matchup (attack slower decks, defend against
faster ones), and misjudging the role is the classic way it loses. It wins on cards that are
good on their own, and on attrition: having bodies and tricks left when the opponent does
not. Engines are the means; points from holding and conquering are the end.

**The four-job test.** Every card must do at least one, and an engine is judged by how much
of these it produces:

1. **Presence** — put or keep a body on a battlefield.
2. **Fights** — win a fight there (tricks, removal).
3. **Staying power** — replace what was spent, so 1 and 2 continue (draw, recursion, Gold).
4. **Denial** — break their plan or their scoring (interaction).

**Goal tiers — the rule for picking cards.** A card must earn its slot on its highest tier;
lower tiers only break ties. Budgets keep any one goal from getting everything thrown at it.

| tier | goal | budget (Randyyy's) |
|---|---|---|
| 0 | **win: points from holding and conquering** | — |
| 1 | **presence and fights:** bodies on battlefields, winning fights there | bodies ~11–13, fights ~8–10 (9 tricks) |
| 2 | **staying power:** draw and recursion | ~8–10 (12) |
| 3 | **denial:** stop their points and plans, sized to the field; best-of-three lets the sideboard carry much of it | ~5–7 (6) |
| 4 | **engine perks:** extra Gold, trash synergy, Hidden extras | **0 dedicated slots** — tie-breakers only |

Always on: no single point of failure, enough copies to be consistent, a curve and colours
that work.

**The three engines, and what each is for.** Read from Randyyy's LA list, card by card.

- **Trash and recursion (staying power).** Filling the trash: Shadow Order Disciple burns
  its top card when it moves (§441.1) and gets +1 Might; Traveling Merchant discards on a
  move, Ezreal on play, Zaun Warrens on conquer; units die in combat. The discards are
  choices: a spell for Fizz, a unit for Matriarch. Using it: Tail-Cloaked Matriarch, when
  Empowered, plays a unit of 3 Energy or less and 1 Power or less from the trash to base for
  free; Fizz recasts a spell of 3 Energy or less from the trash, ignoring its Energy but
  **paying its Power**. Matriarch reviving Fizz reviving a Punch First is one chain.
  Star-Crossed can bounce our own Fizz or Ezreal to replay it. Tension: Last Rites's Equip
  cost recycles 2 cards from the trash, competing for it.
- **Hidden (the switch, and the defence).** A hidden Tornado Warrior flipped next to Matriarch
  empowers her for free; becoming Empowered by the Empower action triggers her (§442.2.a), and
  Tornado's own text disempowers her at end of turn, so it can happen again later. (Corrected
  in section 3: otherwise Empowered is permanent, §443, and she revives once per time on the
  board. Tornado was later benched.) Tideturner,
  Pyke, Returned, Switcheroo and Edge of Night defend a held battlefield for the 1 Power to
  hide, then are played ignoring their base cost (§811.1.b, §204.1.a).
- **Gold (the fuel).** The legend makes one Gold each time it is ready and you recycle a rune
  to pay Power; it readies at your Awaken and whenever enemy units die. Matriarch's Empower
  (2 Energy, 1 Chaos Power), Fizz and Ezreal (1 Power each), Fizz's recasts, Punch First
  (2 Body Power), Edge of Night's Equip and Sivir, Mercenary all pay Power. Gold enters
  exhausted and readies at your next Awaken: it is next turn's Power, usable at Reaction
  speed on their turn too. **The legend already makes Gold every turn**, so another Gold
  maker earns a slot only if the deck has Power to spend beyond it.

**Role by matchup.**

| opponent | what it fears (`docs/archetypes.md`) | our role |
|---|---|---|
| Kennen | early pressure before the trash fills | **attack early** |
| Kai'Sa | being raced before the 7-drops | **attack early** |
| Jayce | nothing on board for three turns | **attack early** |
| Riven, Rengar (ambush), Rek'Sai (go-wide) | — they come at you | **hold**: they attack into hides |

**Early to late.**
1. **Early:** cheap bodies go wide — pressure against slow decks, holds against fast ones.
   Their moves and combat stock the trash.
2. **Every turn:** spend Power from a rune, which makes next turn's Gold. Hide only behind a
   hold that is hard to break: a facedown card at a battlefield you lose goes to the trash
   with the Power spent on it (§323.6.a).
3. **Fights:** tricks win them; kills ready the legend for another Gold that turn.
4. **Mid-game:** Matriarch is the engine — switched on by her own Empower (Tornado was benched) —
   bringing back Fizz (who recasts a trick), Ezreal, or a fallen body. Then refocus on one
   battlefield: Sivir, Mercenary (6 Might with Ganking after 2 Power spent, 11 with Punch
   First) takes the second, since the attacker must kill every defender (§468.1.a).
5. **Close:** at 6, hold one and conquer the other; at 7, a hold wins (§473.1.a.1).

**Known risks.**
- Setup: Matriarch must be at the battlefield with a hidden Tornado, and she is one 4-Might
  unit any removal answers. The deck must still function without her.
- Area effects against wide 2-Might bodies (Kai'Sa's Thousand-Tailed Watcher: −3 Might to
  every enemy unit). Commit fewer bodies at once there.
- Vex, Apathetic (in Evelynn's, Kha'Zix's and Vex's lists) stuns units we play, hidden units
  included. Hidden spells and gear still work.
- Interaction is under-discussed so far: Kai'Sa's sweepers, Jayce's gear, Rengar's ambushes.
- No Body-colour legend has a good Radiance finish yet: Staunch Survivor and Graves are
  checked on the rules, not proven in results.

**Rules checked** (handbook, then verbatim): Graves's trigger can only be answered by
Reactions; a facedown Switcheroo in response changes the damage, read on execution
(§359.3.f.2); a unit moved into a fight defends and its trigger fires (§466.2.c.3.a,
§383.4.e); exhausted units defend (§466.2.c.3); Ezreal's discount covers Rampage's optional
Body and Mercenary's Accelerate (§356.4.c, §356.4.f.1); equipment adds its Might Bonus while
attached (§137.3) — Edge of Night and Last Rites are +2; Tornado empowering Matriarch triggers
her (§442.2.a); a hidden card is played ignoring Energy and Power (§811.1.b, §204.1.a).

**Decided before section 2** (Jay, 23 Oct 2026):
- **Format: best-of-three.** The sideboard matters, and battlefields follow the game-1 /
  going-first / going-second method.
- **Flexible, not fragile.** Complexity is welcome; dependence is not. No card or combo the
  plan needs to see: every card must be good on its own (the four-job test), every engine
  needs more than one way to switch on, and the deck must win games where Matriarch never
  shows up.
- **Chosen Champion: Sivir, Mercenary** (4 Energy, 1 Power; Accelerate; 6 Might with Ganking
  after 2 Power spent) — the cheap, mobile closer, over Sivir, Ambitious (6 Energy, 3 Power,
  7 Might, Deflect 2).
- **Sivir's signature, On the Hunt** (1 Energy, 2 Power: ready your units), is a real
  candidate in the fights slot. Winning lists run signatures at 3 or none; Randyyy ran none.

---

## 2. Roles and slots — agreed 2026-10-23

Slots are built from the four jobs, before any card is named. **Method:** Randyyy's LA list
is the reference: its counts per role are the starting point, overridden only for a stated
reason. Candidates, new or old, must show which job they do better than what they replace.

### Decided

**Hidden: about 10, at least 4 of them spells or gear** (23 Oct 2026).
- **Randyyy runs exactly this:** 10 Hidden, 6 units (2 Tideturner, 3 Tornado Warrior,
  1 Pyke, Returned) and 4 spells or gear (2 Switcheroo, 2 Edge of Night). It fits the
  riftbound.gg article's case: Sivir's Gold pays for hiding.
- **The engine does not need a hide every turn:** 34 of 39 cards in the v3 draft's shuffle
  can spend Power (only Traveling Merchant and Gust cannot), plus Sivir, Mercenary.
- **Hides wanted:** turn 2 at the earliest (you must control a battlefield), one facedown
  card per battlefield you control, only behind a strong hold — realistically 2–3 over
  turns 2–5.
- **Draw odds** (4 cards plus one per turn; mulligans and draw effects ignored):

  | Hidden | at least one in hand by turn 2 / 3 / 4 | average seen by turn 5 |
  |---|---|---|
  | 8 | 77% / 83% / 87% | 1.8 |
  | 10 | 85% / 90% / 93% | 2.3 |
  | 12 | 91% / 94% / 96% | 2.8 |

  8 is the floor if 10 plays heavy; past 12 the gain flattens.
- **Spare Hidden cards cost little:** most play from hand as normal cards.
- **At least 4 spells or gear:** Vex, Apathetic stuns units we play, hidden ones included.

**Presence: 22 units, Randyyy's count** (23 Oct 2026; leaves 18 cards for fights and denial).

| card | job (tier) | why | evidence (Chaos-colour Radiance winners /15; Body/Chaos finishes /7) |
|---|---|---|---|
| 3 Staunch Survivor | presence, fights (1) | 4 Might in every fight; turn-1 Gold is a bonus; Matriarch can revive it | none yet — no Body-colour Radiance winners; video's premise. Body Power: the colour cost to watch |
| 3 Bedeviling Stranger | presence (1), bounce with 4+ units there, both sides counted (3) | Hidden; a body either way | 11 |
| 3 Traveling Merchant | staying power (2), a 2-Might body | cycles a card each move, the discard chosen | 6 |
| 2 Tideturner | presence, fights (1) | a body, or a hidden swap (the Graves trick) | 9 |
| 3 Ezreal, Prodigy | staying power (2) | discard 1, draw 2; discounts Rampage's +2 and Mercenary's Accelerate | 5 · 2 |
| 2 Fizz, Trickster | staying power (2), recast fights (1) | recasts a spell of 3 Energy or less, paying its Power | 7 · 6 |
| ~~1 Elnuk Herd~~ → **1 Tornado Warrior** (23 Oct, see log) | fights (1), at Reaction speed | hidden: +3 Might on a friendly unit at that battlefield for the 1 Power to hide (§811.1.b, .d.3), then recycles to the deck to come again; drawn without a hide, a 6-Energy 5-Might body with no Power — the top end we lacked. Replaced Tornado Warrior (fights slot, 23 Oct). One copy, not two: it is cheap only when hidden, hides are limited (one per battlefield you control, behind a strong hold), and from hand it is the worst Hidden card to hold — a second copy cost early board (cheap cards 22 → 21, units by turn 3 3.4 → 3.2) | none; adopted by pros early in the backtest (Rengar) |
| 2 Tail-Cloaked Matriarch | staying power (2), a 4-Might body | revives a unit of 3 Energy / 1 Power or less; her own Empower is always available, so nothing depends on Tornado | 5 · 3 |
| 2 Graves, Blasting Through | fights, denial against wide boards (1, 3) | LeBlanc, Rengar decks and Rek'Sai are likely; a 3rd belongs in the sideboard for them (41% to see one of 2 by turn 5, 56% with 3) | none yet |
| Sivir, Mercenary (Champion Zone) | presence, fights (1): the closer | always available, never drawn | — |

Two-drops 11, three-drops 5, four and up 5, plus Mercenary. Hidden: 10 — 6 units
(3 Stranger, 2 Tideturner, 1 Tornado) and 4 spells or gear. Staying power uses 10 unit slots,
the top of its budget: fights and denial come from the spells, and no more draw goes in.

**Benched, with reasons:**
- **Tornado Warrior** — a free 3-Might body from face down and Matriarch's free switch; out
  for Elnuk Herd. **The reason given was wrong** (Jay, 23 Oct): her own Empower is *not* always
  available, because Empowered is permanent (§443) and she empowers only if not Empowered.
  Tornado's "Disempower it at end of turn" is the reset that makes her a second revive. Back in
  for Elnuk Herd: see the log.
- **Shadow Order Disciple** — an engine piece, but only 3 Might when it moves and its burn is
  random; the trash already fills with chosen cards. First back if the trash runs dry.
- **Kennen, Storm of Shuriken** — its 7 winners are Kennen's decks, where the burn feeds
  Rhasa; none of the Body/Chaos finishes. For us a 4-Might 3-drop that mills our own cards.
- **Rengar, Trophy Hunter** (5 of 7 Body/Chaos finishes) — a surprise 6-Might body at
  Reaction speed (Ambush, §822.1.b, .d), but Sivir, Mercenary already does that job from the
  Champion Zone. Strong for Kha'Zix, which has no Mercenary.
- **Vex, Apathetic** — sideboard: a matchup card against Hidden, ambush and go-wide decks.
- **Kinkou Initiate, Nocturne, Pyke, Reckless Innovator, Momentary Companion, Ziggs,
  Evelynn, In Control, Repair Specialist, Black Market Broker, Treasure Hunter** — none does
  a tier-1 or tier-2 job better than what is in; Gold makers are redundant with the legend.

**Fights: 12 spells and gear, plus the hidden units' role** (Elnuk Herd, then Tornado Warrior) (23 Oct 2026). Checked against all
110 spells and gear legal for Sivir (colours, bans, and other champions' signatures — Void
Assault is Kha'Zix's). B = Body/Chaos good finishes of 7; W = Chaos-colour Radiance winners of 15.

| card | job | B | W | why |
|---|---|---|---|---|
| 3 Punch First | win the fight; Mercenary to 11 | 7 | — | +5 for 1 Energy, 2 Body Power |
| 3 Rampage | fight and removal (also counts toward denial) | 7 | — | units deal their Might to each other; +2 if Body paid, free with Ezreal |
| 2 Switcheroo | swap Might; the Graves trick | 6 | 11 | Hidden; Reaction speed from face down |
| 2 Ride the Wind | the conquer turn: move a unit and ready it | 3 | 11 | Action speed, unlike On the Hunt |
| 2 Edge of Night | a lasting +2 that attaches free from face down | 1 | 3 | Hidden; keeps the 4 Hidden spells or gear |

Fizz can recast all four spells. Every card pays Power, so the Gold keeps coming without a
dedicated engine card. (Battlefields: Emperor's Dais took Sandswept Tomb's slot, below.)

**Benched:** On the Hunt (Sivir's signature: readies all units, but has no Action or Reaction,
so it can't be played in a fight — Ride the Wind does the job at Action speed; and
signatures run at 3 or none), Grim Resolve (its XP does nothing here), Last Rites (6 winners,
but its Equip eats 2 trash cards and it isn't Hidden), Onslaught, Hold 'Em, Primal Strength,
Guttural Roar, Challenge (to denial), Primordial Roar, Demon Shade. Void Assault is Kha'Zix's
signature and not legal.

**Checked on the current 40** (denial placeholders): all deck rules pass; 22 units, 16 spells,
2 gear; Matriarch revives 6 different units; Fizz recasts every spell. Open: the rune split
(goldfish ~13% stuck, pessimistic), battlefields. Full audit after denial.

**Denial: 6 main, sized to the field; the sideboard carries the rest** (23 Oct 2026).
Randyyy's budget was 6 (2 Sabotage, 2 Star-Crossed, 1 Gust, 1 Acceptable Losses).

| card | job | W | B | why |
|---|---|---|---|---|
| 3 Star-Crossed | denial and fights, at Reaction speed | 13 | — | returns a friendly and an enemy unit: saves ours from removal, takes a defender out of a fight, and resets our own Fizz, Ezreal or Matriarch to replay |
| 2 Gust | denial, at Reaction speed | 10 | — | 1 Energy, no Power: bounces a unit of 3 Might or less at a battlefield, ours or theirs; answers a hidden unit's play effect by removing its source (§811.1.d.3.a) |
| 1 Sabotage | information and denial | — | 7 of 7 | sees the hand and recycles a non-unit card from it; one copy, the second in the sideboard for spell-heavy and gear decks |

Rampage (fights table) is the fourth piece of removal, and Graves the answer to wide boards.
**Acceptable Losses is out:** each player kills a gear, and ours is Edge of Night.

**Sideboard: 10**, mapped to who we expect. The Body/Chaos colours were searched in full;
each card answers a sequence a likely opponent depends on, not one card.

| card | brings it in against | what it does there |
|---|---|---|
| 2 Vex, Apathetic | Rengar, Rek'Sai, Riven, Evelynn, LeBlanc | stuns any unit they play while she is at a battlefield, hidden and Ambush units included, and they can't move it that turn; Deflect taxes their answer |
| 2 An Offer You Can't Refuse | Jayce, Riven (Blade of the Exile), Kennen (Last Rites), Akali | kills a gear at Action speed; they get an exhausted Gold |
| 1 Ravenbloom Prefect | Jayce, Riven | banishes itself to banish a gear they play |
| 1 Graves, Blasting Through | Rek'Sai, Rengar, LeBlanc | the third copy against wide boards (41% to see one of 2 by turn 5, 56% with 3) |
| 1 Disposal Order | Kennen, Mordekaiser, LeBlanc | at Reaction speed, recycles 3 cards from their trash: Rhasa's discount, Mordekaiser's Power, LeBlanc's replays |
| 1 Flash | Kai'Sa, Akali | at Reaction speed, moves 2 of our units home out of removal or a fight we are losing |
| 1 Unyielding Spirit | Kai'Sa, Akali, LeBlanc, Jayce | prevents all spell and ability damage this turn: Falling Star, Bellows Breath, Hextech Ray, Akali's pings, Ruined Rex, Elder Dragon's ping |
| 1 Sabotage | Kai'Sa (Time Warp), Jayce (Gutter Palace, Aurora), Kennen | the second copy |

Kai'Sa's Thousand-Tailed Watcher gives −3 Might **to a minimum of 1**: it does not kill on its
own, it makes their fight that turn lopsided. Unyielding Spirit does not stop it, and Flash is
the answer (pull the units home before the combat).

**Battlefields** (23 Oct 2026, reviewed against Radiance's): best-of-three uses each one once
in decided games (§488.5).

| game | battlefield | why |
|---|---|---|
| 1 | **Zaun Warrens** | low impact for both players; for us, conquer → discard 1, draw 1 stocks the trash for Fizz and Matriarch |
| going first | **Emperor's Dais** (replaces Sandswept Tomb) | conquer → pay 1, return a unit there to hand, leave a 2-Might Sand Soldier holding. The bounce replays Ezreal (draw 2), Fizz (another recast) or Matriarch (a second revive, since Empowered is permanent, §443). The strongest evidence of any battlefield among this format's good finishes: 7 of 22 Radiance, 61 overall |
| going second | **Sigil of the Storm** | conquer → the conqueror must recycle a rune. For us that is a Gold (the legend), for them a lost rune. We go second with the extra rune (§487.7), so their early conquests cost more |

Sandswept Tomb (Randyyy's) discounts our spells there, but only on our units at it, and the
Dais does more for a deck that replays play effects. Bandle Scouts' Academy (Gold on hiding)
is the legend's job again.

**Runes: 5 Body / 7 Chaos**, confirmed by `sweepRunes` (below). Printed Power: Body 12, Chaos 8
(Punch First is 6 of the Body), but the Chaos-only cards (Fizz, Ezreal, Mercenary,
Matriarch's Empower, Edge of Night's Equip, Switcheroo) are the ones played early and often.

### Shape, against winners

| | this list | good finishes (median) | Randyyy |
|---|---|---|---|
| units / spells / gear | 22 / 16 / 2 | ~20 units | 22 / 16 / 2 |
| cards at 2 Energy or less | 21 | 22 | 18 |
| cards at 5+ Energy | 2 (2 Graves) | 3–5 | 0 |
| average cost | 2.50 | ~2.8 | 2.48 |
| Hidden | 10 | — | 10 |

## 3. Card by card — written into the guide

Each card's role, rules and the competitors for its slot are in sections 2 above and in the
deck guide's card-by-card section ([guides/sivir-midrange.md](../guides/sivir-midrange.md)). Two
corrections came out of writing it, both checked in the handbook and the verbatim rules:

- **Empowered is permanent** (§442, §443: it lasts until the card leaves the board or something
  disempowers it). Matriarch's Empower is "only if not Empowered", so **she revives once per time
  on the board.** A second revive needs her to leave and come back: Star-Crossed on her, or
  Emperor's Dais. Tornado Warrior's empower ending at end of turn is that card's own text
  ("Disempower it at end of turn"), not §443; section 1 cited it wrongly.
- **Rampage has no Action:** it is main-phase removal on our turn, never a trick in a showdown.
  The fights tricks are Punch First, Switcheroo, Ride the Wind and, from face down, Tornado
  Warrior and Edge of Night.

## 4. Checks — 23 Oct 2026

- **Deck rules:** all 11 pass (`lib/decks.mjs` `deckChecks`): one legend, 40 main, a Sivir
  champion, 12 runes, 3 different battlefields, inside Body/Chaos, 3-copy limit across main and
  sideboard, no other champion's signature, sideboard 10 of 10, nothing banned, Standard-legal.
- **Goldfish** (`lib/sim.mjs`, 20,000 games, seed 1). Energy spent turns 1–4: **15.9 on the play,
  17.6 on the draw** (Randyyy 16.7). Units on board by turn 3: 3.4 / 3.8. Two units by turn 3:
  98% / 99%. No play on turns 1–2: 0%. Best mulligan policy: keep all.
- **Stuck on colour by turn 3:** 11% on the play, 9% on the draw (Randyyy 6%). Pessimistic: the
  simulator does not make the legend's Gold, which pays any colour.
- **Rune sweep:** 5 Body / 7 Chaos is the best split (16.7 Energy, 10% stuck); 4/8 and 6/6 are
  within 0.1 Energy but stick more often (14%, 11%).
- **What the simulator cannot see:** the legend's Gold, the cost of hiding, any fight. Its
  per-card keep values are goldfish Energy only.

**Watch list, from the audit:** Staunch Survivor (its Body Power on turn 1–2), Tornado Warrior (its
reset needs Matriarch at its battlefield), the single Sabotage. Cut first if the deck plays
clunky: the second Edge of Night.

## 5. Log

- **23 Oct 2026 — the list is complete.** Saved to the Decks tab as `Sivir — Midrange
  (decklab, 23 Oct)`; the guide is [guides/sivir-midrange.md](../guides/sivir-midrange.md).
  Emperor's Dais replaced Sandswept Tomb as the going-first battlefield. No games yet.
- **23 Oct 2026 — Tornado Warrior in for Elnuk Herd** (Jay's point). Tornado was benched on a
  wrong premise: Matriarch's own Empower is not always available (Empowered is permanent,
  §443), and Tornado's end-of-turn disempower is what makes her a second revive. On the tiers:
  fights are a tie (both add about 3 Might there from face down; Elnuk's +3 is targeted at
  Reaction speed and out of Gust's range, Tornado's 3 stays as a body and costs 3 from hand,
  not 6), so the Matriarch reset breaks it. **Results were set aside:** Tornado's 36 good
  finishes against Elnuk's 0 only measure that Elnuk is a Radiance card legal today. Shape:
  5+ Energy cards 3 → 2, average cost 2.58 → 2.50; goldfish unchanged (15.9 Energy on the
  play). The list is frozen until games give a reason.

Games, results, and every change with its reason go here.

---

## Sources and candidates (not decisions)

- **Randyyy's Los Angeles RQ list** (Riot's Top Decks, #146 of 2,165, the best Sivir there):
  the only legal, non-Aurora Sivir result in the data. Seven of Riot's nine Sivir results
  are Aurora decks; the Vegas one runs four cards banned since. Main: 3 Traveling Merchant,
  2 Tideturner, 3 Fizz, 1 Sivir, Mercenary, 1 Pyke, Returned, 3 Shadow Order Disciple,
  3 Tornado Warrior, 3 Tail-Cloaked Matriarch, 3 Ezreal, 2 Sabotage, 1 Gust, 1 Acceptable
  Losses, 3 Punch First, 2 Switcheroo, 1 Grim Resolve, 2 Star-Crossed, 3 Rampage, 2 Edge of
  Night, 1 Last Rites; 5 Body / 7 Chaos; Sandswept Tomb, Sigil of the Storm, Zaun Warrens.
  Sideboard: 3 Ravenbloom Prefect, Acceptable Losses, Akshan, Decree of Strength, Gust,
  Sabotage, Star-Crossed, Unyielding Spirit.
- **riftbound.gg, "10 Most Buffed Legends with Radiance"** (Den, 21 Oct 2026): Sivir's Gold
  pays for hiding; names Ziggs, Explosive (RAD-112) and Momentary Companion (RAD-095).
  A brainstorm, not tested.
- **MoreThatMillGuy, "Sivir Is INSANE Again & MIDRANGE IS BACK!?"** (14 Oct 2026): Staunch
  Survivor on turn 1, Graves with Tideturner and Switcheroo, Ezreal with Rampage. His four
  rules questions all check out. His posted list is an older, different deck.
- **Midrange:** StarCityGames, "What's in a Midrange?"; Sullivan on the midrange deck;
  riftbound.gg and Breakflip on Sett midrange (attrition, strong in best-of-one); Ultimate
  Guard on choosing battlefields.
- **Radiance candidates** (W = Chaos-colour Radiance winners of 15; P = posted Body/Chaos
  Radiance lists of 786): Bedeviling Stranger (W11), Reckless Innovator (W7, a Gold maker),
  An Offer You Can't Refuse (W6), The Good Stuff (W3, discard 1 draw 3), Staunch Survivor
  (P32), Graves (P88), Ziggs (P73), Momentary Companion (W1), Elnuk Herd (P65, a free +3 from
  face down), The Waters' Wage (P67, three ready Gold from face down on your turn), Gutter
  Guardian (P57), Evelynn, In Control (P92, scores holding with a facedown card).
- **Older cards that read differently now** (searched by Radiance's hooks): Repair
  Specialist (Assault equal to gear you control — Gold tokens are gear, §187.5), Black Market
  Broker (Gold on each face-down play), Mask Mother (a +2 when discarded), Pack of Wonders
  (return a gear, unit or Hidden card to hand), Heedless Resurrection (Reaction-speed swap
  with the trash).
- **Draft lists so far** (chat, 23 Oct): v3 is Randyyy's list with Staunch Survivor,
  Bedeviling Stranger, Graves and Ride the Wind in, 5 Body / 7 Chaos runes. Written before
  the recursion engine was understood; an input, not the answer.
