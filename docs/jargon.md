---
title: Talking Riftbound — Player Jargon
subtitle: How players say it, what the rules call it, and where to look it up
author: rift toolchain
date: 2026-10-09
---
**Why this exists.** Players say "chased the queen", not "made repeated removal attempts on
Irelia, Fervent". The rules say neither. This page maps how people talk onto what the rules
call it, so a question asked in players' words finds the right concept.

**Evidence key.** A URL means the term was seen used that way in a Riftbound source. "TCG"
means general trading-card-game usage seen applied to Riftbound, or so standard it needs no
citation. "Jay" means Jay's own phrasing in this repo or its sessions. Terms that are
plausible but were **not** seen in a Riftbound source are in the last section, *Unconfirmed*.
Do not promote one without a sighting.

## 1. The champion and "the queen"

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **the queen** / **protect the queen** | the one unit a deck is built to land and keep alive. For Irelia, **Irelia, Fervent** | the **Chosen Champion** in the Champion Zone (§103.2.a.1). The champion *unit*, not the legend | cardsrealm *Deck Tech: Voltron Irelia*: "Irelia (your queen!)", section "Protect Your Queen!" ([link](https://riftbound.cardsrealm.com/en-za/articles/riftbound-deck-tech-voltron-irelia)); Jay: "tried to chase the queen" |
| **chase the queen** | keep spending removal and tricks on the protected champion | the losing exchange in the Irelia entry: each attempt pays Deflect and walks into Defy, Not So Fast or a pump that also readies her | Jay |
| **Voltron** | a deck that stacks its resources on one unit | Irelia (Fervent plus Reaction pumps), equipment-on-one-unit lists | cardsrealm *Voltron Irelia* ("that's why it's called a Voltron list") |
| **win condition / wincon** | the card or plan that actually wins | the champion, or a finisher | animealley Irelia guide ("Your win condition is straightforward"); cardsrealm ("your main win condition"). "wincon" itself: TCG |
| **must-answer** | a threat that loses you the game if left alone | | animealley Irelia guide ("a must-answer that rarely gets answered cleanly") |
| **legend vs champion** | players say "Irelia" for both | the **Legend** (Blade Dancer) is in the Legend zone and is not a unit; the **champion** (Irelia, Fervent) is the unit. "Chase Irelia" means the unit | rules; repo naming (`ln` is the legend's name, e.g. *Deceiver* for LeBlanc) |
| **deck called by champion** | "Yi", "Kennen", "LeBlanc", "KZ"? | archetype = the legend; this repo writes "Master Yi, Wuju Bladesman" | riftbound.gg / Mobalytics decklist titles ("Irelia Blade Dancer…", "Kha'Zix Voidreaver…"). The "KZ" abbreviation was **not** seen |

## 2. Scoring and battlefields

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **conquer / hold** | take a battlefield / keep it into your next turn | conquer and hold scoring (§471); a hold at 7 wins (§471.1.a.1) | ultimateguard ("conquer one and hold it until our next turn"); cardsrealm ("conquer and hold your battlefields") |
| **double conquer** | take both battlefields in one turn | the 6→8 line in strategy.md §0; at 7, conquering without having scored the other battlefield draws a card instead (§471.1.b.1) | tacter Chongqing write-up, via search summary ("go for the double conquer right away"); exact wording unconfirmed, page 404 on fetch |
| **play chicken** (with a hold) | sit on one battlefield and dare them to break it | the role question, strategy.md §2 | tacter Chongqing, via search summary |
| **retreat** | pull units home rather than defend | Jun: "retreating is not surrendering a point"; the legend's walk-home (spend 2 XP) | tacter (summary); Jun's Top-5 video (repo) |
| **walk home** | move a unit that just fought back to base | Voidreaver's 2-XP move, or Star Spring | repo (Jun's notes, matchup guide) |
| **showdown** | the window where both players act at a battlefield | §342; it opens when a battlefield becomes Contested | ultimateguard, riftmana, Mobalytics |
| **board presence** | units on the table | units at battlefields and in base | ultimateguard; animealley |
| **8th point / final point** | the winning point, with its special rule | §471.1.b.1 | riftboundguide/rarecandy beginner guides |

## 3. Resources

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **runes / mana** | the resource | runes: **Energy** from exhausting, **Power** from recycling. "Mana" is MTG carry-over | ultimateguard ("spend more Runes"); search summaries ("count the open mana") |
| **open runes / open mana / holding up** | runes left untapped on the opponent's turn | Reaction range. The matchup guide's flip rules run on this | TCG; repo ("open Calm") |
| **tapped / exhausted** | used this turn | exhausting a rune or unit; "legally distinct tapped" | search summary of a review ("even the developers called it 'legally distinct tapped'") |
| **recycle runes / rune recycle** | turn a rune on the board into Power | each basic rune: "Recycle this: Add 1 Power of this rune's domain". It **shrinks next turn's board** | cardgamer/riftboundguide recycling guides; cardsrealm ("recycle runes"); Jay's Viktor loss (memory) |
| **Power** | the domain-coloured cost | the catalog's `p` | rules; repo |
| **curve / on curve** | playing a card on the turn its cost first allows | | ultimateguard; cardsrealm ("play Irelia - Fervent on curve") |
| **trash** | discard pile | the trash | rarecandy |

## 4. Combat and trades

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **trade / even trade** | both sides' units die | **No Result** if nobody remains (§466.3): no XP, no point | Mobalytics beginner guide, via search summary ("units with the same Might value defeat each other") |
| **rigged fight** | a fight already won before it starts | strategy.md §5; Jay's habit | Jay (memory, "rigged fights only") |
| **bare / fair fight** | no tricks on either side | the matchup guide's "bare" column | repo |
| **pump / buff** | a temporary Might boost | "+N Might this turn" Reactions; **Buff** is also a defined action | TCG; rules |
| **trick** | a combat spell cast mid-fight | Reaction or Action spells in a showdown | TCG; repo |
| **removal / bounce** | kill / return to hand | Rampage and Void Assault / Gust and Star-Crossed. Bounce dodges Deathknell | ultimateguard ("Counterspells, removal, or bounce"); cardsrealm ("direct removals") |
| **counterspell / countermagic** | stops a spell | Defy, Not So Fast, Hard Bargain, Abandon | ultimateguard; animealley |
| **sweeper / mass removal** | kills many units at once | Imperial Decree, Thousand-Tailed Watcher's −3 | ultimateguard ("play around a mass removal spell"); animealley |
| **gank** | a unit moving battlefield to battlefield | the **Ganking** keyword. A LoL word that is a real Riftbound rule | LoL wiki *Riftbound:Ganking* |
| **isolate / alone** | leave an enemy unit by itself | Kha'Zix's "if an enemy unit is alone here" | repo |

## 5. Hidden, flips and information

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **hide / hidden / facedown** | a card set face down for 1 Power of any domain, played later for 0 Energy | §811 | rules; repo |
| **flip** | play your hidden card | playing from Hidden; its choices are restricted to that battlefield (§811.1.d.2) | repo |
| **flipped card** (judge sense) | a card accidentally face up in your deck | a technical error, not a game play | sheepesports Vancouver RQ final interview (Alanzq) |
| **play around** | avoid the line their card punishes | | ultimateguard ("slow-roll its Units to play around a mass removal spell") |
| **slow-roll** | deploy threats a few at a time, so one answer doesn't catch them all | | ultimateguard |
| **represent** | act as if you hold a card | Jun: Kha'Zix "represents six Might" | repo (Jun's notes) |

## 6. Deck types and the field

| term | means | Riftbound mapping | evidence |
|---|---|---|---|
| **aggro / midrange / control / combo** | deck roles | strategy.md §2: roles are properties of positions, not decks | riftbound.gg archetypes article; ultimateguard; animealley |
| **tempo / value** | a short-term board edge / a long-term card edge | strategy.md §3 | ultimateguard ("Tempo gives you a short-term advantage… value… long-term advantage, like drawing more cards") |
| **card advantage / grindy / grind** | out-drawing them / long games | the matchup guide's grind number | animealley ("card advantage", "in grindy games") |
| **inevitability** | who wins if nothing happens | strategy.md §2 | animealley |
| **clock** | how fast a deck kills you | the hold clock: a double hold wins in 4 turns | animealley ("a legitimate clock") |
| **cantrip** | a play that replaces itself by drawing a card | Discipline, Stupefy | animealley |
| **vanilla** | a unit with no useful ability right now | | cardsrealm ("just a vanilla card on the board") |
| **finisher** | the card that ends it | Punch First, in game 1 against Irelia | cardsrealm |
| **meta / meta call / matchup / sideboard / mirror / tech** | the field / betting on it / a pairing / the 10-card board / same deck / a narrow card for a matchup | `scripts/rift meta`; TR §403 sideboarding | cardsrealm; tacter Hangzhou ("the mirror is probably the matchup players test least", "aggro meta call"); sheepesports Vancouver ("technical misplay") |
| **misplay / punt** | a sub-optimal play / a mistake that costs the game | strategy.md §8's seven mistake types | sheepesports Vancouver ("everyone makes a misplay or two"); "punt" defined only in an MTG source (Hipsters of the Coast) |
| **netdeck** | copying a published list | | TCG |
| **pub-stomp(er)** | a top-meta deck taken to a casual night | | Jay ("dislikes pub-stomping", memory) |

## 7. Events and records

| term | means | evidence |
|---|---|---|
| **NN / Nexus Night** | the weekly casual store event (low OPL) | Jay ("0-3 at nn"); playriftbound OP page; ultimateguard ("Nexus Night Master") |
| **Skirmish / Summoner Skirmish** | the top store event tier (Bo3, Swiss + cut). **Not** the rules' "Skirmish" (§487, three-player FFA) | skirmish-prep.md |
| **RQ / RO / CC** | Regional Qualifier / Chinese Regional Open / City Challenge | events.json names; tacter "Regional Open" |
| **0-3, 3-0, X-1, 4-1-1** | match record: wins-losses-draws | Swiss standings (store locator) |
| **Day 2 / conversion** | made the second day / the share of an archetype's pilots who did | Gamer Tag Mythras LA table (matchup guide) |
| **Best-Of** | Riot's best finisher per legend at an RQ | playriftbound LA top decks |
| **RiftAtlas** | an online play platform. "got rekt on riftatlas" is an online game | Jay; events.json claim "RiftAtlas Convergence #2" |
| **rekt** | lost badly | Jay |
| **on the play / on the draw** | going first / second. Going second channels an extra rune turn 1 (§486.7) | Jun's notes ("on the play… on the draw") |
| **mull / mulligan** | redraw up to 2 of the opening 4 | §117; animealley ("Mulligan aggressively for her") |

## 8. League of Legends words

Riftbound's audience is LoL players, so expect LoL words. Only **gank** is a rule (the
*Ganking* keyword), and **Baron** is a card (Baron Nashor). **Nexus** is the event name
(Nexus Night), not a game term. The rest below were **not** seen used about the card game in
any source checked. If Jay uses one, read it the LoL way:

| LoL word | LoL meaning | likely card-game reading |
|---|---|---|
| carry | the unit or champion that wins | the champion / wincon |
| peel | protect your carry | protection Reactions (Defiant Dance, Discipline) |
| feed | give the enemy kills | trade units into their payoff (Deathknell, XP) |
| diff ("jungle diff") | "the other player was simply better at X" | pilot skill, not the deck |
| int | throw on purpose | a punt |
| snowball | an early lead that keeps growing | point tempo, XP buffs |
| lane / jungle | map areas | battlefields / the Unleashed jungle set |

## Unconfirmed: plausible, but not seen in a Riftbound source

blowout · chump (block or attack) · 2-for-1 · top-deck · brick / bricked · flood / screw ·
BM · sandbag · alpha strike · the nuts · spicy · jank · rogue · go wide / go tall · tilt ·
lethal (Riftbound says "8 points"; the repo says "terminal scan") · "KZ" for Kha'Zix.
Read them with their ordinary TCG meaning, and ask if a reading would change the advice.

## How to read a player's sentence

1. **"Chased the queen and got blown out by a Dance."** → Kept targeting Irelia, Fervent.
   A Defiant Dance (+2 to her, −2 to your unit, and the legend readies her) swung the fight.
   Diagnosis: repeated Deflect-taxed removal into open Calm/Chaos. Fix: press the battlefield
   she isn't on.
2. **"Went 0-3 at NN."** → Lost all three Swiss matches at Nexus Night (best of 3 at Jay's
   store). Each match is three games at most, so 0-3 is up to nine games of signal.
3. **"Recycled too much and ran out of gas."** → Spent Power by recycling runes, so the
   following turns had fewer runes and fewer plays (the Viktor loss).
4. **"I held up Gust but they just developed."** → Kept 1 Chaos open on their turn for a
   Reaction. They played around it by not giving it a target. Strategy.md §5: "refuse the
   exchange they prepared", from the other side.
5. **"Flipped Evelynn into open Chaos and got Gusted."** → Played the Hidden Evelynn while
   they had Chaos untapped. Gust returned her before her move trigger resolved. That is the
   journal's `f` mark.
6. **"Double conquered from 6."** → Took both battlefields in one turn from 6 points, the
   §0 winning line.
7. **"Traded evenly and got nothing."** → Both sides' units died, so No Result (§466.3): no
   XP and no point. The journal's `n` mark.
8. **"Yi diff" / "deck diff."** → Blaming pilot skill or deck strength. Ask which: the
   answer decides whether the next step is practice or sideboard.

**Sources checked:** [cardsrealm Voltron Irelia](https://riftbound.cardsrealm.com/en-za/articles/riftbound-deck-tech-voltron-irelia) ·
[animealley Irelia guide](https://animealley.ca/blogs/the-synergy-lab/irelia-blade-dancer-riftbound-deck-guide) ·
[Ultimate Guard, three concepts](https://ultimateguard.com/en/blog/riftbound-three-concepts-to-master-to-become-a-better-player) ·
[riftbound.gg archetypes](https://riftbound.gg/riftbound-tcg-deck-archetypes-how-to-find-your-playstyle/) ·
[LoL wiki: Ganking](https://wiki.leagueoflegends.com/en-us/Riftbound:Ganking) ·
[RiftJudge: Baron and gank](https://app.riftjudge.com/rulings/10230/does-baron-come-in-exhausted-or-can-he-gank-right-away) ·
[Sheep Esports, Vancouver RQ final](https://www.sheepesports.com/articles/rq-vancouver-finalists-after-close-final-we-both-made-a-lot-more-mistakes-than-people-think/en) (via search summary; the page returned 403) ·
[tacter Chongqing](https://www.tacter.com/riftbound/guides/3-competitive-takeaways-to-make-you-better-at-riftbound-chongqing-riftbound-regional-open-finals-match-9307eb6b) and [Hangzhou](https://www.tacter.com/riftbound/guides/3-competitive-takeaways-to-make-you-better-at-riftbound-hangzhou-riftbound-regional-open-finals-match-2f9a07b1) (via search summaries) ·
[cardgamer recycling](https://cardgamer.com/guides/recycling-in-riftbound/) ·
[rarecandy beginner guide](https://rarecandy.com/blog/what-is-riftbound-a-complete-beginners-guide-2025).
No r/Riftbound thread surfaced in search, so Reddit usage is unchecked.
