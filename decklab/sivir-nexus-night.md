---
title: Sivir for Nexus Night — deckbuilding worksheet
subtitle: Sivir, Battle Mistress (Body/Chaos), Radiance. A 3-0 at a Nexus Night, rebuilt from the decklab Sivir Midrange list. Built together, step by step.
started: 2026-10-23
status: section 1 agreed 23 Oct 2026 · section 2 next
---

The second Sivir worksheet. The first, [sivir-midrange.md](sivir-midrange.md), is the base: its
list is where this starts, and every card in it has to earn its slot again under the goal below.
Same five sections (see [README.md](README.md)), each agreed before the next.

**Two method fixes from the first build** (23 Oct 2026):
- **Plan first, then slots.** The first build compared cards slot by slot against Randyyy's list,
  which cannot find a card for a job his list had no slot for. Here the plan's jobs come first,
  and every job is checked for what covers it.
- **Every card read, one by one.** All 178 legal units and 110 legal spells and gear, each
  placed with its own reason. Radiance cards have no results yet, so results never rank them.

**The base list** (the first worksheet, 23 Oct): 3 Staunch Survivor, 3 Bedeviling Stranger,
3 Traveling Merchant, 2 Tideturner, 3 Ezreal, Prodigy, 2 Fizz, Trickster, 2 Tornado Warrior,
2 Tail-Cloaked Matriarch, 2 Graves, Blasting Through, Sivir, Mercenary; 3 Punch First, 3 Rampage,
3 Star-Crossed, 2 Switcheroo, 2 Gust, 2 Sabotage; 2 Edge of Night. 6 Body / 6 Chaos. Zaun
Warrens, Emperor's Dais, Sigil of the Storm.

---

## 1. How it wins — agreed 2026-10-23

**The goal: three match wins at a Nexus Night.** Jay's store: 3 rounds, best of three, 50-minute
rounds, a mixed and casual field, low OPL (TR §205.2).

**What that asks of a deck, beyond being good:**

1. **Finishing inside the clock.** 50 minutes is about 16 minutes a game if all three are played.
   At time the active player finishes the turn, three more turns are played, and a game still on
   is won only by a player ahead by 2 or more points; otherwise it is a draw, and no new game
   starts (TR §408.2). **A drawn match is not a 3-0.** The first list is a hold deck that wins
   slowly, so speed is the biggest change.
2. **Breadth over narrow answers.** The field is unknown: the store locator has recorded no
   legends at any Nexus Night (README, the locator), and Jay expects precons, budget decks and
   homebrews beside a few net decks. A card that answers one deck is dead against most of this
   field. Flexible answers and our own threats are worth more; narrow answers go to the sideboard.
3. **Consistency over up to nine games.** Three matches is up to nine games. The deck has to
   work when its engine (Matriarch, the Gold) doesn't show up.

**How it wins, in one paragraph.** Cheap bodies take **both** battlefields early and keep
them: a player holding both wins in four turns, and that clock is what finishes games inside 16
minutes. Hidden cards defend the holds, pumps win the fights, and the recursion keeps bodies
coming. **The default role is the beatdown.** Against a mixed field most opponents will be
slower or less interactive than the online field the first list was built for; that is a
reading of what casual fields bring, not data, so it gets checked against Jay's first night. It
switches to holding only against decks that are faster than us (Rengar, Rek'Sai and other
go-wide decks).

**Goal tiers.** Each card earns its slot on its highest tier; lower tiers only break ties.

| tier | goal | changed from the first build |
|---|---|---|
| 0 | **win inside the clock: points every turn** | the clock is now part of tier 0. A card that scores, or speeds the double hold, ranks here |
| 1 | **presence and fights:** bodies on both battlefields, winning fights there | unchanged |
| 2 | **staying power:** replace what was spent | unchanged, but only as much as games last; a long game is the failure case |
| 3 | **denial, flexible only:** answers that work against anything | narrow answers move to the sideboard |
| 4 | **engine perks** | still 0 dedicated slots |

**Always on:** flexible, not fragile (from the first build); enough copies to be consistent; a
curve and colours that work; **and decisions fast enough to finish games** — complexity is
welcome where it wins fights, not where it only adds thinking time.

**Settled with Jay** (23 Oct 2026):
- **Beatdown by default: yes.** The store does bring meta decks (Irelia, for one), but nothing
  like Aurora. So the online field is a fair guide to the threats, minus Aurora, and breadth still
  matters for the homebrews and precons beside it.
- **Champion: Sivir, Mercenary,** unchanged.
- **How wide: two bodies a battlefield, and the hidden card is the third** (Jay asked Claude to
  decide). Measured on the same goldfish (`data/archetypes.json`, units on board by turn 3):

  | deck | units by turn 3 | Might by turn 4 | kind |
  |---|---|---|---|
  | Rek'Sai | 4.2 | 13.3 | truly wide |
  | Mordekaiser · Rengar · Kha'Zix · LeBlanc | 3.6–3.9 | 13.8–16.9 | wide-ish |
  | **this base list** | **3.5** | **14.3** | |
  | Kennen · Master Yi, Bladesman · Riven · Akali | 2.9–3.2 | 13.2–13.7 | hold and tempo |
  | Kai'Sa · Irelia | 2.5–2.8 | 11.9–14.4 | few, strong units |

  Sivir sits between the hold decks and the swarm: wider than Riven or Irelia, narrower than
  Rek'Sai, with more Might per body (Staunch Survivor fights at 4). Going wider than that is the
  wrong direction. The Gold pays Power, never Energy, so it adds no bodies. 2-Might bodies are what
  Kai'Sa's and Akali's area damage kill. And Body/Chaos has no go-wide payoff in the list's style.
  **So the target is enough bodies to contest both battlefields (about two each by turn 3–4), and
  the hidden card is the third defender at each.** It is width the opponent can't see or sweep
  until it flips, and the reason the Hidden package survives the beatdown role. Against Irelia,
  who fields the fewest units here (2.5 by turn 3), two battlefields of pressure make every turn
  two fights, which is the Kha'Zix guide's advice against her too.

---

## 2. Roles and slots — step 1, jobs and targets (draft, 23 Oct 2026)

Jobs come from section 1's plan, not from a reference list. Targets start from what winning
lists look like and bend to the plan. **Good finishes by measured style** (`lib/placing.mjs`
`goodFinishes`, medians): aggro (44 lists) 22 units, 24 cards at 2 Energy or less, 4 at 5+,
average 2.67; midrange (48) 26 units, 18 cheap, 3 at 5+, 2.75; tempo (138) 18 units, 24 cheap,
5 at 5+, 2.67. A beatdown deck that holds both battlefields sits nearest aggro.

Cards count toward every job they do, so the column does not sum to 40.

| job (tier) | target | base list | gap |
|---|---|---|---|
| **1. Take both battlefields early** (1): units at 2 Energy or less; units in all | 12–14 cheap units; 22–24 units; 22–24 cards at 2 Energy or less | 11 cheap units; 22 units; 20 cards at 2 or less | **1–3 cheap cards short** |
| **2. Keep both** (1): Hidden cards (two battlefields to hide at now); Reactions from hand | 10–12 Hidden; 4–6 Reactions | 11 Hidden; 5 (3 Star-Crossed, 2 Gust) | none |
| **3. Win the fight there** (1): pumps and swaps, Action or Reaction | 7–9 | 7 (3 Punch First, 2 Switcheroo, 2 Edge of Night), plus 2 Tornado | none |
| **4. Close inside the clock** (0): ways to break a hold; ways to score more than 1 a battlefield | 8–10 breakers; **2–3 scorers** | 10 breakers (3 Star-Crossed, 3 Rampage, 2 Graves, 2 Gust) and Mercenary; **0 scorers** | **2–3 scorers** |
| **5. Keep cards coming** (2): draw and recursion | 6–8 (games are shorter now) | 10 (3 Ezreal, 3 Merchant, 2 Fizz, 2 Matriarch) | **2–4 over** |
| **6. Flexible denial** (3): answers and information that work against anything | 2–3, narrow answers to the sideboard | 2 Sabotage | none |
| curve | average 2.5–2.7; 2–4 at 5+ | 2.50; 2 at 5+ | none |

**What the gaps say before any card is named:** move 2–4 slots from staying power (job 5) to
cheap bodies (job 1) and to scoring (job 4). An open question for step 2: whether protecting a
hidden card from a lost battlefield is a job of its own (Pack of Wonders) or a play rule.
