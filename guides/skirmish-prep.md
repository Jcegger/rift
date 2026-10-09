---
title: Sunday at Sip & Play — Summoner Skirmish Prep
subtitle: Kha'Zix Midrange at the Vendetta Summoner Skirmish II, Brooklyn, 11 October 2026
author: rift toolchain
date: 2026-10-09
---

**What this is.** Everything to do between now and Sunday night, in order. The
[matchup guide](khazix-voidreaver-matchups.md) says how to beat each deck. This page says
**which ones to expect, how the day runs, and what costs you a game before a card is
played.** Where it touches a rule, [rules.md](../docs/rules.md) and the Tournament Rules in
[rules-full.md](../docs/rules-full.md) are right and this page has a bug.

**Your deck:** `Kha'Zix Midrange (Jun, post-ban)`, read live with
`scripts/rift deck "Kha'Zix Midrange"`, never from a printout. Jun's 3 October list:
40 main including Kha'Zix, 12 runes (6 Body / 6 Chaos), Zaun Warrens, Star Spring,
Sandswept Tomb, and 10 sideboard.

---

## 1. Sunday at a glance

| | |
|---|---|
| **Event** | *Sunday Morning Vendetta Summoner Skirmish II* ([locator event 501411](https://locator.riftbound.uvsgames.com/events/501411)) |
| **Where** | Sip & Play Boardgame Cafe, 471 5th Avenue, Brooklyn |
| **Start** | **10:30 AM**. Be seated well before |
| **Entry** | **$25** |
| **Registered** | 22 of 32, as of 9 October |
| **Format** | Vendetta Constructed, 1v1, **best of three**, **50-minute rounds** |
| **Structure** | **Swiss, then a top-8 cut.** The number of Swiss rounds is set by attendance |
| **Prizes** | not listed. Unknown. The standard Skirmish kit is participation, top-8 and champion promos, a champion playmat, and **a round-1 bye at a Regional Qualifier** for the winner ([Riot OP page](https://playriftbound.com/en-us/news/organizedplay/riftbound-organized-play/)) |
| **Legal cards** | Vendetta, current ban list. **No Radiance** (prerelease is 16 October). Sunday is the last day of the Skirmish II window |

**This store's last three Skirmishes** (locator):

| date | players | Swiss | cut | last round ended |
|---|---|---|---|---|
| 7 Jun | 35 | 6 | top 8 | about 11:05 PM |
| 5 Jul | 24 | 5 | top 8 | about 8:00 PM |
| 30 Aug | 24 | 5 | top 8 | about 8:45 PM |

**So plan for 5 Swiss rounds, then up to 3 more in the top 8: eight best-of-threes**, finishing
in the evening if you make the cut. Sip & Play is a café, so food is on site. Eat between
rounds anyway, because round 5 is where tired players make terminal mistakes.

### Two things to settle before Saturday night

1. **Your ticket.** For August, the store said *"your uvs signup does not count as a
   ticket"* and sold entry through a separate Square link ([event 501409](https://locator.riftbound.uvsgames.com/events/501409)).
   The October listing has no description, so whether that applies again is
   **unconfirmed**. Ask on the store Discord: [discord.gg/bdURvWC](https://discord.gg/bdURvWC).
2. **Rules enforcement.** The locator lists the event as **Casual**. Riot's OP page puts
   Summoner Skirmish at **Competitive**. Ask the organizer, and **prepare as if it is
   Competitive**. Every habit in §4 costs nothing at Casual, and skipping one costs a game
   at Competitive.

---

## 2. Who you will play

**Sip & Play records no legends**, at any event, so the store's own meta is unknown. But Riot's
locator is public, and **every Summoner Skirmish within 10 miles of the store over the last 60
days** can be read from it: **58 events, 760 entries, and 189 with a legend recorded**. The
other 571 weren't recorded, so this is the field at the stores that record, not all of NYC.
Rerun it any time with `scripts/rift event 501411 --scout-near 10` (about two minutes).

### The NYC local meta

| legend | recorded | share of recorded |
|---|---|---|
| **Irelia** | 22 | 11.6% |
| **Kennen** | 21 | 11.1% |
| **Master Yi** | 19 | 10.1% |
| **Rengar** | 17 | 9.0% |
| **LeBlanc** | 14 | 7.4% |
| Akali | 10 | 5.3% |
| Ezreal | 9 | 4.8% |
| Rek'Sai | 8 | 4.2% |
| Mel | 7 | 3.7% |
| Azir, Diana, Nasus, **Kha'Zix** | 6 each | 3.2% each |
| Ornn | 5 | 2.6% |
| 18 others | 1–4 each | |

**Two differences from the RQ field.** **Kennen is five times as common here** (11.1%, against
2.2% of legal lists online), so the rewritten Kennen entry matters more on Sunday than its
tier suggests. And Ornn, which won the Silk Road Skirmish on 3 October, is only 2.6% across
the city. That win was one event.

### Sunday's registered players

Sunday's registration list is public too: **22 of 32 as of 9 October**. Ten of them have a
legend on record at a nearby Skirmish. Their most recent recorded legend:

| player | most recent | also |
|---|---|---|
| **David P** | **LeBlanc** (Fireside Cafe, 19 Sep: 8th of 18) | **won the Brooklyn Strategist Skirmish on 5 Sep** (legend not recorded); LeBlanc at Hex Union Square 2 Sep |
| Andrew W | LeBlanc (Fireside Cafe, 19 Sep) | Kennen twice before that |
| Joshua C | LeBlanc (Hex East, 4 Oct: 5th of 13) | |
| Leul B | Kennen (Brooklyn Strategist, 5 Sep) | Kennen at Fireside 22 Aug; **Sip & Play top 8 in August** |
| Aleksei S | Kennen (Fireside Cafe, 22 Aug: 2nd of 19) | |
| Mario C | Irelia (Brooklyn Strategist, 5 Sep) | Irelia at Hex Union Square 2 Sep |
| Kevin H | Irelia (Hex East, 5 Sep) | |
| Fernando D | Akali (Silk Road, 3 Oct: 3rd of 17) | Mel at the Brooklyn Strategist 5 Sep |
| Kevin S | Nasus (Hex Union Square, 2 Sep) | Nasus at Solacido 23 Aug |
| Anthony L | **Kha'Zix** (Silk Road, 3 Oct) | 3rd at the Brooklyn Strategist 5 Sep, legend not recorded |

**Among the players you can read, LeBlanc and Kennen lead**: three LeBlancs, one of them the
best local result on the list, and two Kennens. Players change decks, and twelve registrants
have no recorded legend, so treat this as weights, not a forecast.

**Saturday night: the freshest read.** The Brooklyn Strategist runs its own Skirmish on
**Saturday 10 October at 11 AM** ([660038](https://locator.riftbound.uvsgames.com/events/660038)).
Five of Sunday's players are registered for it: Andrew W, Angus F, Joshua C, Max K and timothy c.
That store records legends. After it finishes, run:

```
scripts/rift event 660038                        # Saturday's standings and legends
scripts/rift event 501411 --scout 660038         # Sunday's field, against Saturday only
scripts/rift event 501411 --scout-near 10        # Sunday's field, against everything nearby
```

### Your priority list

Practise in this order. Each line is the plan from the matchup guide's entry; read the
entry before the practice game, not during it.

| # | opponent | why it's here | the plan in one line | board |
|---|---|---|---|---|
| 1 | **LeBlanc** | three of Sunday's readable players, including the Sep 5 winner | **points, not kills**: one rigged fight early, then walk home. Deathgrip is live in every fight. Bounce Ruined Rex rather than kill it. Assume Watcher at 7 runes | +1 Decree; −1 Sabotage |
| 2 | **Kennen** | 11% locally, two readable players | pressure the setup, kill Storm of Shuriken on sight, never an even trade. **Read the rewritten entry**: the post-ban list is a different deck | +2 Gust +1 Hard Bargain; −2 Star-Crossed −1 Tornado Warrior |
| 3 | **Irelia** | most played locally, two readable players | **press**: score early, reach 6 first. Never Void Assault or Rampage into open Calm | +2 Gust +1 Hard Bargain; −2 Star-Crossed −1 Punch First |
| 4 | **Master Yi** | 10% locally, most played at small events everywhere | develop, then **hold**: one of the few matchups where you want to. Drag their lone unit to you so they attack your hold. Never attack a lone defender (+2) | +2 Prefect +2 Acceptable Losses; −1 Up from the Deep −2 Star-Crossed −1 Rampage |
| 5 | **Rengar** | 9% locally; won LA | patient, hold one, make them act first. Their Punch First goes before yours | +1 Rampage +1 Hard Bargain; −1 Grim Resolve −1 Sabotage |
| 6 | **Akali** | Fernando D, 3rd at Silk Road on it | one fight early, **your turn only**; offer the fight before Astral Heron lands | +2 Prefect +2 Acceptable Losses +1 Hard Bargain; −2 Rampage −2 Star-Crossed −1 Up from the Deep |
| 7 | **the mirror** | Anthony L | the first clean combat win and its XP decide it. Drag their unit so *they* attack. Check where both Vexes stand before any Ambush | see the entry |

Nasus (Kevin S) is a Defy and Astral Heron control deck now, not the fair-fight deck the old
guide described; read its entry if there's time. Ornn and the rest are in the matchup guide,
and the pocket card has the main rows.

---

## 2b. Your Power budget

Power is the resource your turn runs out of first, and selective Power is the habit that
started winning (§6). `scripts/rift deck "Kha'Zix Midrange"` prints this. Cost is
Energy, then Power.

| Power | main-deck cards |
|---|---|
| **2** | Punch First ×3 (1E), Switcheroo ×1 (2E) |
| **1** | Fizz ×3 (3E), Kha'Zix (4E), Rengar ×2 (5E), Sabotage ×2 (1E), Star-Crossed ×2 (3E), Void Assault ×3 (2E) |
| **0** | the other 23, including **Grim Resolve** (2E), **Rampage** (3E, plus an optional Body for +2), **Up from the Deep**, Vex, Matriarch, Zed and every 2-drop |

- **Sandswept Tomb takes one Power off** each spell that chooses your unit there: Punch First
  becomes 1E / 1 Body, Switcheroo 2E / 1 Chaos, Star-Crossed 3E / 0.
- **Hiding a card costs 1 Power of any kind.** That's why a hidden card is a cheap hold.
- **Fizz still pays the recast spell's Power**, so Fizz into a Punch First from the trash is
  1 + 2 = 3 Power.
- **The sideboard:** Decree of Strength is 1E and **no Power**, which is why it's the cheap
  Sabotage against Mind decks. Gust, Hard Bargain, Acceptable Losses and Ravenbloom Prefect
  also cost none.
- **Against Defy** (counters up to 4 Energy and **1** Power): Punch First and Switcheroo, at 2
  Power, are out of its reach. Grim Resolve, Void Assault and Rampage are not.

---

## 3. The clock: 50 minutes, three games

**This is the part of Sunday most likely to cost you a match without losing a game.** Fifty
minutes for a best of three is about **16 minutes a game**. Midrange takes longer than that
when both players are careful.

**What happens at time** (TR §408.2): the active player finishes the turn, then **three more
turns** are played. If the game is still going, a player **leading by 2 or more points wins
it**; otherwise it's a draw. **No new game starts** if time is called between games. The
match goes to whoever has more game wins, so 1–0 at time wins the match and 1–1 is a draw.

**Draws are common here.** Several players finished the August Swiss with one or two
(4-1-1, 3-1-2). The locator shows a "Jay E" at Sip & Play's Tuesday Nexus Nights with
**two draws on 22 September**. If that's you, the pace problem has already happened once.

**How to play fast without playing worse:**

- **Think on their turn.** Your next turn's question is "what does their open Energy beat,
  and which fight is rigged?" Answer it while they act, so your own turn is execution.
- **Patience is about which fights you take, not about the clock.** The Kai'Sa win came
  from taking only rigged fights. That's a decision you can make in ten seconds once you've
  counted their runes. Taking a long time over every pass isn't patience.
- **Know your sideboard before the match starts.** The plans in §2 and the pocket card mean
  sideboarding takes one minute, not five. Shuffle well, but don't redesign the deck between
  games.
- **Watch the clock from game 2.** If game 2 starts past the 30-minute mark, a third game
  will probably not finish. **When time is called, count the turns**: yours or theirs, then
  three more. **A 2-point lead wins the game, so the terminal scan becomes a 2-point
  scan.** If you're ahead by 2, protect the lead. If you're behind, the remaining turns are
  your only turns.
- **Never slow down to run out the clock.** Slow play is an infraction, and playing to the
  clock when you're ahead is still slow play. Play at your normal pace and let the time
  rules work.

---

## 4. Things that lose a game before a card is played

If enforcement is Competitive, each of these is a **Game Loss**. At Casual they're warnings
or nothing, but do them anyway.

- **Decklist.** Registration is required at Competitive (TR §401.1), before round 1
  (§401.4), and it can't change afterwards (§401.3). **A decklist error is a Game Loss**
  (§703.3): a wrong count, a banned card, or a deck that doesn't match the list. Register
  exactly what `scripts/rift deck "Kha'Zix Midrange"` prints: Legend, 40 main *including
  Kha'Zix*, 12 runes, three battlefields, and the sideboard.
- **Count the physical deck against the list, card by card, on Saturday night.** Then
  again after every match, because the deck must be **back to its registered state before
  each new match** (§403.8).
- **Sideboard.** Up to 10 (§601.1.c.1). **Swaps are 1-for-1** (§403.4), and **never before
  game 1** (§403.5). Runes, the legend and battlefields never change (§403.4.b). No
  sideboarding after a drawn game (§403.10). Riot's OP page still says "8-card sideboard".
  The current Tournament Rules say 10, and the TR are the authority. If the store says 8,
  ask the head judge before round 1, not during it.
- **Being late.** At Competitive, **2–10 minutes late to a match is a Game Loss** (§703.8).
  Within 2 minutes is a warning; after 10 minutes is a Match Loss. Stay near the pairings
  board between rounds.
- **Warnings add up.** Three of the same game-play error in one event is a Game Loss
  (§702.1.b.1), and at Competitive so is **six warnings of any kind** (§702.1.b.2). If
  you're unsure about a rule, call a judge rather than guess.
- **Notes.** Start each match with an empty, visible sheet (§416). During a game you may
  use only notes made in this match. **Between games you may read notes made before the
  match** (§416.5). That is when the pocket card is legal, and only then.
- **No outside help** (§703.9). Nobody can advise you mid-match, and you can't ask.

---

## 5. Battlefields and play/draw across a best of three

- **You choose your battlefield every game** (CR §486.5). Any battlefield used in a game
  someone **won** is retired for the match, yours and theirs. After a draw, the same ones
  can be reused (§486.5.a). Showing a used battlefield is a Deck Presentation Error (TR
  §703.4.a.1).
- **Jun's order:** **Zaun Warrens in game 1.** Then **Sandswept Tomb mostly when going
  second**, or **Star Spring** when the hidden-unit save is worth more than its symmetry.
  Each entry's Battlefields line says when to break that. The two hard rules: **never your
  Star Spring against Rek'Sai or LeBlanc**, and it's risky against Rengar.
- **Who plays first:** game 1 by any random method. After that, **the loser of the previous
  game chooses** (TR §407.4). In the top cut, **the higher Swiss seed chooses for game 1**
  (§407.2.a). Going second, you channel an extra rune on turn 1 (CR §486.7).
- **Sideboard by play or draw, as Jun does.** On the draw, trim 2-drops. On the play, he
  wants all nine 2-drops and trims the top end. The matchup entries' board lines are the
  starting point; then ask whether a 3-drop is a good turn-2 play *in this matchup*.

---

## 6. The habits that are already working

You named these yourself. **Bring these two in first and add nothing new on Sunday.**

1. **Selective Power.** The Jhin win (3 October) came from being choosy about Power, and
   Grim Resolve (0 Power) closed it. Before any spell, ask whether this turn is the one that
   scores. **Recycling runes shrinks next turn's board**: the Viktor loss had 3 runes on
   board against their 10 on turn 12.
2. **Only rigged fights.** The Kai'Sa win (6 October): no panic, take your time, and fight
   only when the fight is already won. Count their open runes and what they can cast; if
   you don't beat it, develop instead.

And the check above both, every turn from 5 points, for both players: **can anyone reach 8
before the other acts again?** A hold at 7 wins at the start of that player's turn. At time,
the same scan counts a 2-point lead.

---

## 7. Between Thursday and Sunday

| when | do |
|---|---|
| **Thursday** | Ask about the ticket and enforcement level on the store Discord. Read the matchup entries for LeBlanc, Kennen and Irelia |
| **Friday** | Practise: **LeBlanc, Kennen, Irelia**, in that order. Play each one with a timer set to 16 minutes, then review against the entry |
| **Saturday** | Practise Master Yi and Rengar if there's time. **Count the deck against the live list.** Print the pocket card (`scripts/build-journal` → `matchup-card.pdf`) and match pages. **Saturday night: `scripts/rift event 660038`**, then re-scout Sunday's field (§2) and adjust the priority list |
| **Sunday morning** | Sleeves, deck box, dice and counters, pen, the printed pages, water, a charged phone for the pairings. Arrive early enough to register a list and sit down at 10:30 |
| **After each match** | One line in the match journal: the opponent, the result, **the first turn your options got narrower than theirs**, and its type letter ([strategy.md §8](../docs/strategy.md#8-reviewing-a-game)). Reset the deck to its registered state |
| **Sunday night** | The ten-match review page, if Sunday got you there. Keep the wrong predictions |

---

## Sources

- **Event and local field:** Riot's official store locator, read 9 October:
  [501411](https://locator.riftbound.uvsgames.com/events/501411) (Sunday),
  [501409](https://locator.riftbound.uvsgames.com/events/501409) (August),
  [660031](https://locator.riftbound.uvsgames.com/events/660031) (Brooklyn Strategist, 5 Sep),
  [508101](https://locator.riftbound.uvsgames.com/events/508101) (Silk Road, 3 Oct),
  [660038](https://locator.riftbound.uvsgames.com/events/660038) (Brooklyn Strategist, 10 Oct).
  Store pages: [Sip & Play weekly events](https://www.sipnplaynyc.com/general-5).
- **The tier and its rules:** [Riot organized play](https://playriftbound.com/en-us/news/organizedplay/riftbound-organized-play/),
  the [UVS Organized Play quick reference](https://uvsgames.com/wp-content/uploads/2025/12/Riftbound-Organized-Play-Quick-Reference-Guide-1.pdf),
  and the Tournament Rules in [rules-full.md](../docs/rules-full.md). Window dates are from
  *Vendetta Dates and Details* via a search summary; the PDF itself was too large to fetch.
- **The local meta and Sunday's field:** `scripts/rift event 501411 --scout-near 10`, run 9
  October against Riot's locator API: 58 Skirmishes within 10 miles over 60 days. Only stores
  that record a deck-defining card contribute, which is 189 of 760 entries.
- **Small-event shares:** `scripts/rift meta`, over lists with no banned card. The archive
  has **no decklists from any Skirmish**: 1,822 Skirmish events are recorded, and none of them
  has a list in the archive.
- **Power costs:** `data/cards.json`'s `p` field, printed by `scripts/rift deck`.
- **The two habits:** your own words, from 3 and 6 October.
- **Unknown, and printed as unknown:** Sunday's prizes, whether a separate ticket is needed,
  whether lists are collected, the round count, and Sip & Play's own meta.
