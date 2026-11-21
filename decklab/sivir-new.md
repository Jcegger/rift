# New Sivir (Battle Mistress): the challenger

Started 21 Nov 2026. A from-scratch Sivir built by the staged co-op process (identity → jobs → cards → test →
freeze). **Sivir Is Trying Her Best stays live as the benchmark**: this list has to beat it on tests and in games
before it replaces anything. Nothing goes into the app until Jay approves (`deck-write`). Decide after the first
post-ban weekend (about 29–30 Nov).

> **Shelved (21 Nov 2026).** Draft B breaks the measured rules in `docs/deckbuilding.md`, which I hadn't read
> when building it: two champion units (93% of good finishes run one), ~20 changes from the anchor (winners change
> 6–9; past 16 is a new deck), Bedeviling Stranger kept after cutting the Faefolk that gets it to 4 units, and
> "proven" Evelynn cards that are proven partly by Evelynn's legend (it draws on each face-down play). It was also
> judged on "Mercenary on", the measure it was built to win. **The live question is one role swap in Trying Her
> Best: −3 Ride the Wind +3 On the Hunt** (signatures run 3 or 0). On the bench that swap gets most of Draft B's gain:
> Mercenary on 26/34/38 → 34/41/44%, Defy targets 4.6 → 3.2, two units by t3 on the play 98 → 94%, answers on their
> turn unchanged. What the bench can't see: no Ride the Wind left for their showdowns (it's an Action; On the Hunt isn't).
> Kept below for the reasoning and the rules work. Future deck work goes through the `deck-build` skill.

**Stage now: cards. Draft B, waiting on Jay (21 Nov). Sideboard still to do.** Jobs approved 21 Nov (5 second-move cards; if Sivir is answered, fall back on the board of proven Evelynn units).

## 1. Identity (picked by Jay, 21 Nov)

**The Mercenary, with Hidden Gold support.** Sivir, Mercenary switched on every turn by Power that Gold pays back,
then two conquests in one turn. Support slots come from the face-down Gold cards that win in Evelynn, Agony's Embrace
(same Body/Chaos pool).

Why this deck and not another Body/Chaos legend: only Battle Mistress turns spent Power into Gold, and only Sivir
turns spent Power into a 6-Might ganker.

### The engine, in card text

- **Battle Mistress:** recycle a rune → exhaust her for a Gold (exhausted). An enemy unit dying readies her.
- **Gold:** kill and exhaust it to add one Power of any domain. **Paying Power from a rune is a recycle**, so most
  Power we spend makes Gold for a later turn.
- **Sivir, Mercenary:** Accelerate (+1 Energy, +1 Chaos Power); with 2 Power spent this turn, +2 Might (6) and
  Ganking. **Played with Accelerate she has spent 2 Power on her own** (her cost plus Accelerate), so she enters
  ready, at 6 Might, with Ganking.
- **The double conquest:** conquer A, ready her (On the Hunt; or move her with Ride the Wind or Void Assault, which
  don't need Ganking), conquer B. Both battlefields are scored, so the eighth-point gate is met. From 6 points
  that's 6 → 7 → 8, with no hold needed.
- **Other Gold sources** in the pool (not a job; see §3): Bandle Scouts' Academy (hide a card here → Gold), Reckless Innovator,
  Treasure Hunter, Pyke, Returned (an enemy dies → Gold), The Waters' Wage (from face down on your turn: three
  *ready* Gold), Black Market Broker (each face-down play → Gold), Sigil of the Storm (conquer → recycle → the
  legend's Gold).

Rules premises: `docs/rules-rulings.md`, "Sivir, Mercenary's double conquest" (21 Nov; derived, no staff ruling).
The weakest link is effect moves between battlefields without Ganking (§451.1). Ask a judge before an event leans
on it.

## 2. Where the card evidence comes from

Sivir has no record (45 lists ever, 2 placings). The same 39-card pool is played by other legends:

- **Evelynn, Agony's Embrace:** 25 vouched lists finished in the top quarter since 23 Oct, and 23 of them run
  no banned card. **Proven** below means a card in most of those 23.
- **Kha'Zix, Voidreaver:** 18 top-quarter lists, but only 4 are clean of bans (Star Spring), so this is thin.
- **Sivir's own 22 Radiance lists:** what other Sivir players run, no results. Marked **crowd**.
- **Theory:** a card no result backs, picked for the engine.

## 3. Jobs (approved by Jay, 21 Nov)

40 cards counting Sivir in the Champion Zone. Counts are a starting point.

| # | job | slots | candidates (evidence) |
|---|---|---|---|
| 1 | **The champion** | 2 | Sivir, Mercenary: Champion Zone + 1 in the deck, so losing her once isn't the game (crowd avg 1.3) |
| 2 | **The second move** (ready her or move her a second time) | 5–6 | On the Hunt (crowd 7/22; 2 Power, so Defy can't counter it, and it switches her on) · Ride the Wind (crowd 10/22; 1 Power, Defy-able) · Void Assault (proven in Kha'Zix 4/4 at 3 copies; moves an enemy unit too) |
| 3 | **Win the fight** (Power sinks that turn combat) | 6–7 | Punch First (proven 19/23; 2 Power, not Defy-able) · Hold 'Em (proven 22/23; 0 Power) · Switcheroo (proven 18/23; 2 Power) |
| 4 | **Removal that kills** (a kill readies the legend: another Gold) | 4–5 | Rampage (proven 20/23) · Star-Crossed (proven 20/23; a bounce, so no ready) · Gust (14/23; bounce, ≤3 Might) |
| 5 | **Board and disruption** | 9–11 | Pyke, Returned (proven 23/23, avg 2.7; also Gold when an enemy dies) · Vex, Apathetic (proven 22/23) · Rengar, Trophy Hunter (proven 21/23) · Gutter Guardian (proven 21/23; its Show Off adds Power, which counts for Sivir) · Evelynn, Entrancing (proven 23/23; the pull from face down) · Bedeviling Stranger (15/23) |
| 6 | **Cards in hand** | 4–5 | Reckless Innovator (Kha'Zix 4/4; draw or Gold) · Ezreal, Prodigy · Traveling Merchant (crowd 10/22; draws when it moves) · The Good Stuff · Kinkou Initiate |
| 7 | **Gear** | 2–4 | Edge of Night (proven 21/23; Hidden) · Boots of Swiftness (13/23; Ganking for a second unit) |
| — | **Battlefields** (3) | 3 | Bandle Scouts' Academy (proven 23/23; hiding makes Gold) · Sigil of the Storm (crowd 20/45; conquer → recycle → Gold) · Packed Amphitheater (14/23; Sivir +1) |

### No Gold job (Jay's call, 21 Nov)

The legend already turns recycled Power into Gold, so a separate Gold job mostly piles up Gold. The bench agrees.
Trying Her Best with −3 Reckless Innovator, +3 Kinkou Initiate (`scripts/rift try`; quiet / normal / heavy
opponent):

- **Gold a game barely drops:** 3.51 → 3.12, 4.12 → 3.85, 3.75 → 3.76.
- **"Mercenary on" (2+ Power spent, turns 4–8) doesn't move:** 26%, 34%, 38% → 37%.

What holds Sivir back is **having 2 Power of useful things to spend each turn**, not Gold. Paying with Gold isn't a
recycle, so it doesn't trigger the legend either. So "makes Gold" is only a tiebreaker: Pyke, Bandle Scouts' Academy
and maybe Innovator keep it because they earn their slot anyway. The Waters' Wage, Black Market Broker and Treasure
Hunter are out. The freed slots go to things that spend Power usefully (Punch First, Switcheroo, On the Hunt) and to
card draw. The draft is judged on raising "Mercenary on" against the benchmark. Caveat: these numbers come from the
old list's cards, so re-measure on the draft.

### What's deliberately out

No Aurora, no banned card, and no card in only because the old list ran it. Cards from the old list come back only
if they win their job here.

### Open questions for the jobs stage

1. **How many second-move cards?** The double conquest needs one in hand on the closing turn. Having seen at least one
   by the time 9–10 cards are seen (about turn 6; mulligan ignored): 4 copies 66–70%, 5 copies 74–78%, 6 copies
   81–85% (hypergeometric, 40 cards). Some get spent earlier, so the real figure is lower.
2. **Defy:** the second-move job is where Defy bites (Ride the Wind and Void Assault are 1 Power). On the Hunt isn't
   Defy-able, so lean on it if Defy decks rise.
3. **The trap plan as a fallback:** Faefolk, Stranger and the hold-A plan are not in the jobs. If Sivir is answered,
   the deck falls back on a board of proven Evelynn units rather than the trap.

## 5. Draft B (the list to review)

40 cards: Sivir in the Champion Zone plus 39. Evidence: **P** proven (in most of the 23 top-quarter Evelynn lists),
**C** crowd (other Sivir players), **K** kept from Trying Her Best.

| job | cards |
|---|---|
| Champion (2) | Sivir, Mercenary ×1 Champion Zone + ×1 deck |
| Second move (5) | On the Hunt ×3 (C; Sivir's signature, 3 is the cap; 2 Power, Defy-proof) · Ride the Wind ×2 (C, K) |
| Win the fight (5) | Punch First ×3 (P, K) · Switcheroo ×2 (P, K) |
| Removal and answers (7) | Rampage ×2 (P, K) · Star-Crossed ×2 (P, K) · Rebuke ×2 (K; 2 Power, Defy-proof, answers on their turn) · Gust ×1 (P, K) |
| Board and disruption (14) | Pyke, Returned ×3 (P) · Gutter Guardian ×2 (P) · Vex, Apathetic ×2 (P, K) · Rengar, Trophy Hunter ×2 (P, K) · Bedeviling Stranger ×2 (P, K) · Evelynn, Entrancing ×1 (P, K) · Traveling Merchant ×2 (C; cheap body, loots when it moves) |
| Cards in hand (5) | Reckless Innovator ×3 (K; draw or Gold) · Ezreal, Prodigy ×2 (K) |
| Gear (2) | Edge of Night ×2 (P) |
| Battlefields | Bandle Scouts' Academy (P; hiding makes Gold) · Sigil of the Storm (C, K; conquer → recycle → Gold) · Packed Amphitheater (P; Sivir +1) |
| Runes | 6 Body / 6 Chaos for now. Printed Power is now Chaos 22, Body 14, and stuck on colour at t3 on the play went 4% → 6%: test 5 Body / 7 Chaos |

**Out of the old list:** Irresistible Faefolk ×3, Tideturner ×2, Nidalee ×3, Ember Monk, Existential Dread, one
Gust, one Ride the Wind, Boots of Swiftness, Amateur Recital, Forbidding Waste.

**Honest note:** 26 of the 39 are cards the old list already plays. Starting from scratch landed close to it,
because most of its spells and disruption are also in the proven Evelynn lists. That confirms those cards
independently, but this isn't a radically different deck. What changes is the close (the double conquest instead
of the trap), the Faefolk/Nidalee/Tideturner package (Pyke, Gutter Guardian, Traveling Merchant and On the Hunt
replace it), and the battlefields.

## 6. Bench (`scripts/rift try` against Trying Her Best, 21 Nov)

20,000 goldfish games, 5,000 engine games a scenario. Quiet / normal / heavy opponent. Card text and counts only:
none of this is a win rate.

| measure | Trying Her Best | Draft B |
|---|---|---|
| Mercenary on (turns 4–8, 2+ Power spent) | 26 / 34 / 38% | **37 / 43 / 46%** |
| Gold a game | 3.5 / 4.1 / 3.75 | 4.1 / 4.5 / 4.2 |
| Defy-countered spells expected (field) | 4.6 | **3.2** |
| An answer usable on their turn, t3 / t5 (play) | 22 / 65% | 29 / 57% |
| Same, on the draw | 26 / 77% | 31 / 70% |
| Two units by turn 3 (play / draw) | 98 / 99% | 90 / 98% |
| Might by turn 5 (normal) | 14.9 | 13.1 |
| Cheap cards (≤2 Energy) | 20 | 18 |

**Read:** Sivir switches on about 10 points more often and Defy has a third fewer targets. The price is a slightly
slower start on the play and a little less to do on their turn by t5. The bench can't see Sivir's +2 Might,
Ganking moves or the double conquest, so Might understates the draft and the close isn't measured at all.

**Rejected on the way:**
- **Void Assault** is Kha'Zix's signature card (§103.3.d), so it's illegal under Battle Mistress.
- **Draft A** (Hold 'Em ×2 for Rebuke, Kinkou Initiate, Boots kept): Mercenary on 36 / 39 / 38%, but two units by
  t3 on the play fell to 85% and answers on their turn by t5 to 39%. Hold 'Em costs no Power, so it doesn't help
  switch Sivir on.

## 7. Next

1. Jay reviews Draft B (§5).
2. Sideboard (10), aimed at the post-ban field: gear answers, Charm, Kai'Sa's removal.
3. Test it against Trying Her Best with `scripts/rift try` (same settings), and `scripts/rift versus` for the
   projected top archetypes. The bench can't see Ganking moves or the double conquest; name that gap, don't guess.
4. After the first post-ban weekend: re-read the field and decide with Jay.
