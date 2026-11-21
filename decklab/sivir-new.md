# New Sivir (Battle Mistress): the challenger

Started 21 Nov 2026. A from-scratch Sivir built by the staged co-op process (identity → jobs → cards → test →
freeze). **Sivir Is Trying Her Best stays live as the benchmark**: this list has to beat it on tests and in games
before it replaces anything. Nothing goes into the app until Jay approves (`deck-write`). Decide after the first
post-ban weekend (about 29–30 Nov).

**Stage now: jobs (waiting on Jay).**

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
- **Extra Gold sources** in the pool: Bandle Scouts' Academy (hide a card here → Gold), Reckless Innovator,
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

## 3. Jobs (for Jay to approve before any card is picked)

40 cards counting Sivir in the Champion Zone. Counts are a starting point.

| # | job | slots | candidates (evidence) |
|---|---|---|---|
| 1 | **The champion** | 2 | Sivir, Mercenary: Champion Zone + 1 in the deck, so losing her once isn't the game (crowd avg 1.3) |
| 2 | **Gold makers** (fuel for Sivir and the Power spells) | 7–8 | Pyke, Returned (proven, 23/23, avg 2.7) · Reckless Innovator (proven in Kha'Zix 4/4; Evelynn 9/23) · Treasure Hunter (crowd 7/22; Miss Fortune) · The Waters' Wage (Evelynn 130/505 overall; theory for the 3-ready-Gold turn) · Black Market Broker (theory) |
| 3 | **The second move** (ready her or move her a second time) | 4–5 | On the Hunt (crowd 7/22; 2 Power, so Defy can't counter it, and it switches her on) · Ride the Wind (crowd 10/22; 1 Power, Defy-able) · Void Assault (proven in Kha'Zix 4/4 at 3 copies; moves an enemy unit too) |
| 4 | **Win the fight** (Power sinks that turn combat) | 5–6 | Punch First (proven 19/23; 2 Power, not Defy-able) · Hold 'Em (proven 22/23; 0 Power) · Switcheroo (proven 18/23; 2 Power) |
| 5 | **Removal that kills** (a kill readies the legend: another Gold) | 4–5 | Rampage (proven 20/23) · Star-Crossed (proven 20/23; a bounce, so no ready) · Gust (14/23; bounce, ≤3 Might) |
| 6 | **Board and disruption** | 8–10 | Vex, Apathetic (proven 22/23) · Rengar, Trophy Hunter (proven 21/23) · Gutter Guardian (proven 21/23; its Show Off adds Power, which counts for Sivir) · Evelynn, Entrancing (proven 23/23; the pull from face down) · Bedeviling Stranger (15/23) |
| 7 | **Cards in hand** | 3–4 | Ezreal, Prodigy · Traveling Merchant (crowd 10/22; draws when it moves) · The Good Stuff · Kinkou Initiate |
| 8 | **Gear** | 2–4 | Edge of Night (proven 21/23; Hidden) · Boots of Swiftness (13/23; Ganking for a second unit) |
| — | **Battlefields** (3) | 3 | Bandle Scouts' Academy (proven 23/23; hiding makes Gold) · Sigil of the Storm (crowd 20/45; conquer → recycle → Gold) · Packed Amphitheater (14/23; Sivir +1) |

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

## 4. Next

1. Jay approves or changes the jobs and counts.
2. Cards: fill each job, each pick labelled proven, crowd or theory.
3. Test it against Trying Her Best with `scripts/rift try` (same settings), and `scripts/rift versus` for the
   projected top archetypes. The bench can't see Ganking moves or the double conquest; name that gap, don't guess.
4. After the first post-ban weekend: re-read the field and decide with Jay.
