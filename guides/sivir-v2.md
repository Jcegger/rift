---
title: Sivir v2 — Deck Guide
subtitle: Riftbound, Radiance — the same Sivir rebuilt on the job structure winning midrange decks share, with a real top end. The game plan on one page, what changed from v1, how to sequence it, every card's job, and the field matchup by matchup
author: rift toolchain
date: 2026-10-28
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main (Champion included) + 12 runes (5 Body / 7 Chaos) + 3 battlefields + 1 legend · **Sideboard:** 10 of 10
**Shuffled library:** 39. The Champion starts in the Champion Zone and is playable from there (§103.3.a.1, §108.3.d)
**Saved in the app as** `Sivir v2 (draft)` · **Archetype:** Midrange · Extra resources ([archetypes.md](../docs/archetypes.md))
**Where it came from:** v1, *[Sivir Is Trying Her Best](sivir-trying-her-best.md)*, rebuilt in the [v2 worksheet](../decklab/sivir-v2.md) on 28 October from six winning midrange lists' shape: four jobs, each six-plus deep, and a real top end. **35 of the 40 cards are v1's.**
**Record:** none yet. Log every game under `Sivir v2 (draft)`; after about three Nexus Nights the journal decides between v1 and v2
**Collection status:** everything owned, sideboard included
**Status:** superseded on 31 October 2026 by [Sivir — One Army, Two Fights](sivir-one-army.md), Jay's main deck. Kept for the record

**Companions.** [The v1 guide](sivir-trying-her-best.md) has the long version of the sequencing this deck shares (its §3). [The matchups worksheet](../decklab/sivir-matchups.md) reads every S-to-B legend against both versions. [strategy.md](../docs/strategy.md) is how to think about any turn.

---

## Executive summary: the game plan

*Read this before every round.*

**What the deck is.** v1's deck with a late game. A Gold deck: Battle Mistress makes Power, the deck is built from cards **cheap in Energy and paid in Power**, and the trash engine (Fizz, Matriarch, Ezreal, Merchant) turns that Power into cards. **v2 adds threats that outsize the board from turn 5**, when Energy stops being tight: Rengar, two Graves and Beast Below beside Sivir.

**How it wins.** Take battlefields early with cheap bodies that leave value. Lock one with Vex and face-down cards. **From turn 5, take over**: Graves holds a battlefield against anything small, Beast Below bounces their biggest threat and replays your Ezreal, Rengar ambushes. Open their battlefield (Evelynn, Rebuke, Beast) and take the eighth point. Or hold at 7.

**What changed from v1, in one line each:**
- **Graves, Blasting Through ×2 (main):** his blast hits every enemy unit at his battlefield when he attacks **or defends**. 4 damage, **9 with Punch First**. The field is full of small units: most S and A decks run mostly units at 4 Might or less.
- **Beast Below ×1:** 7 Energy, 8 Might; when played it returns **another unit of yours and one of theirs** to hand. Bounce their Heron, replay your Ezreal (2 more cards) or your Matriarch (another revive).
- **Out:** Tornado Warrior ×2 (the Matriarch combo measured near zero), one Rampage (blanked by the Calm decks at the top).

**The resource rule** (as v1). Energy comes only from runes and is tight on turns 2–4. Power comes from Gold and recycled runes and renews every turn. **A Gold is next turn's Power.** New in v2: **your rune board stays at about 7–9 all game**, because recycling for Gold keeps shrinking it, so **your top end tops out at 7 Energy**: 5-drops castable from turn 4 (94%+), Beast Below most turns from 5 (71% on turn 5, 78% on turn 6).

**Every turn, in this order** (v1 guide §3 has each step):
1. **Terminal scan.** Can either player reach 8 before the other acts again? A hold at 7 wins.
2. **Role.** Pressing or holding? The matchup decides (§10).
3. **Count.** Runes, ready Gold, cards; what their open mana threatens.
4. **Develop or hold up.** On turns 3–4, do one fully. **Rengar is the exception: his Ambush lets a held-up turn still develop.**
5. **Pump before you move.**
6. **Move and take open battlefields.** Hide at every battlefield you hold.
7. **Fight.** Switcheroo on a unit at 4+ Might while they have Energy for Gust.
8. **End of turn.** Spend Gold, or keep it ready on purpose.

**The plan by stage.**

| stage | job | the play |
|---|---|---|
| turn 1 (2 Energy) | presence | a 2-drop: Merchant, Evelynn, or Staunch with a recycled rune |
| turn 2 (4 Energy) | develop | a 3-drop and a 1, or two 2-drops; start hiding |
| turn 3 (6 Energy) | two plays | two 3-drops (Innovator, Fizz, Ezreal); or Matriarch plus her Empower; or Sivir and a 2 |
| turn 4 (8 runes, usually ~6.5 by now) | lock or threaten | Vex at a battlefield; or a 5-drop (Rengar, Graves); Edge on a holder |
| turn 5+ | **take over** | Graves defending your hold; Beast Below on their best threat; Rengar ambushes; Fizz and Matriarch rebuild |

**The six rules that matter most.**
1. **Hold at 7 and win.** Hold points aren't gated (§473.1.a.1). By **conquer**, the eighth needs every battlefield scored that turn (§473.1.b), all **three** once a Baron Pit exists ([rules-rulings.md](../docs/rules-rulings.md)).
2. **Gold first, runes for the rest.** Recycle, kill, recycle.
3. **Hide every turn you can**, Switcheroo and Edge first; losing the battlefield trashes it.
4. **Defend with Graves; attack with him only with Punch First ready.** His blast hits only the units present when it triggers, and he deals no combat damage. Units that arrive after it (Ambush, a flip from face down) are untouched, and he can't kill them.
5. **Beast Below needs another unit of yours on the board**, or it can't bounce at all (§355.8). Pick the return: Ezreal (2 cards), Matriarch (another revive), Fizz (a spell back).
6. **Switcheroo on a unit at 4+ Might** while they have Energy for Gust.

---

## 1. The list

| | |
|---|---|
| **Units (26)** | 3 Traveling Merchant · 1 Evelynn, Entrancing · 2 Staunch Survivor · 3 Reckless Innovator · 3 Fizz, Trickster · 3 Ezreal, Prodigy · 3 Tail-Cloaked Matriarch · 2 Vex, Apathetic · 2 Rengar, Trophy Hunter · **2 Graves, Blasting Through** · **1 Beast Below** · *Sivir, Mercenary* |
| **Spells (12)** | 3 Punch First · **2 Rampage** · 2 Sabotage · 2 Star-Crossed · 2 Switcheroo · 1 Rebuke |
| **Gear (2)** | 2 Edge of Night |
| **Battlefields** | Zaun Warrens · Sigil of the Storm · Sandswept Tomb |
| **Runes** | 5 Body · 7 Chaos |
| **Sideboard** | 2 Unyielding Spirit · 2 An Offer You Can't Refuse · 1 Rebuke · 1 Repulse · 1 Ruin Runner · 1 Ravenbloom Prefect · **1 Rampage · 1 Tornado Warrior** |

**From v1:** +2 Graves (from the sideboard), +1 Beast Below; −2 Tornado Warrior, −1 Rampage (both to the sideboard). The sideboard is a placeholder: v1's, with the two Graves (now main) swapped for the cards that left.

**The four jobs** (the [worksheet](../decklab/sivir-v2.md)'s stage 3):

| job | cards | count |
|---|---|---|
| **Trash-and-recursion bodies**: take a battlefield, leave value whether they live or die (or fight above their cost) | Merchant 3, Evelynn 1, Staunch 2, Innovator 3, Fizz 3, Ezreal 3, Matriarch 3 | 18* |
| **Gold-paid fight tricks**: win the fight where Defy can't reach, or save a unit that must stay | Punch First 3, Switcheroo 2, Edge of Night 2 (+ Star-Crossed as the save) | 7 |
| **Clear the battlefield you need**: half of it works through Zhonya's | Rampage 2, Sabotage 2, Star-Crossed 2, Rebuke 1, Vex 2, (Evelynn's pull) | 9–10 |
| **Turn-5 threats that spend the spare Power** | Sivir, Rengar 2, Graves 2, Beast Below 1 | 6 |

*Evelynn sits in both the first and third rows.

**Shape.** Average cost 2.98 (v1 2.77). Energy 1 / 2 / 3 / 4 / 5 / 7: **5 / 9 / 15 / 6 / 4 / 1**. 14 cards at 2 Energy or less (the curve rule asks for 8+). Power: 17 cards cost 1, 7 cost 2 (Body 14, Chaos 17 symbols). Hidden: 5 (Switcheroo 2, Edge 2, Evelynn).

---

## 2. How it got here

The [v2 worksheet](../decklab/sivir-v2.md) has every step; in short:
- **Six winning midrange lists**, from the LA Regional Qualifier winner (Rengar) to Riven at the LDXP Sacramento 25k, share a shape: four to six jobs, each six-plus deep, one-ofs only inside pools, and **real top end in every one**. v1 had eight jobs, two of them on one or two copies (Vex, Evelynn), and the lightest top end of any of them.
- **Four jobs, targets from the winners**, bent for Sivir: Power-paid jobs at the top of the range, because the legend makes Power.
- **The top end, capped by the rune board**: engine games showed the board averaging 7.3 runes on turn 5, so **Baron Nashor (10) was out** (castable on 7% of turn 5s) and the top end stops at 7. Gold *rose* with a bigger top end (4.18 → 4.43 a game).
- **Graves over Anivia, Primal**: cheaper, sweeps when defending too, and scales with Punch First. **Beast Below kept despite Star-Crossed**: its value lands before they can answer it, and Repulse saves it.
- **Two bodies out, measured four ways**: cutting Tornado kept Matriarch's revives (0.93 a game against v1's 1.00; cutting a Matriarch dropped them to 0.64). The Tornado-into-Matriarch line measured about 0.01 revives a game.
- **Rampage 3 → 2**: the LA winner runs exactly two; the Calm decks at the top blank it.

**Tried and set aside:** Baron Nashor (the rune board), Anivia, Primal (Graves does the job cheaper), a third Rengar (five 5-drops would crowd turn 4), Black Market Broker and The Waters' Wage (the model couldn't see their Gold; Jay wasn't convinced), **Bullet Time** (an X spell rewards banking Gold the engine wants spent every turn; at a realistic X of 2–3 it does Graves's job, and the Calm decks whose small boards it's for all run Defy, which counters it; 28 Oct). Revisit it only as a sideboard card against the non-Calm wide decks, if Graves is blanked again and again.

---

## 3. Sequencing — what's different from v1

Everything in [v1's §3](sivir-trying-her-best.md) holds: the terminal scan, paying costs, develop or hold up, what to hide, fights, the engine, the closing lines. What v2 changes:

### 3.1 The rune board, and your top end

Recycling for Gold keeps your board small. **Plan your 5-drops for turn 4 and your Beast Below for turns 5–6.** On a turn you mean to play Beast, think twice about recycling: each recycle is a rune you won't have.

| runes on the board | turn 4 | turn 5 | turn 6 | turn 8 |
|---|---|---|---|---|
| average | 6.5 | 7.3 | 7.8 | 9.0 |
| 5+ (Rengar, Graves) | 94% | 95% | 96% | 98% |
| 7+ (Beast Below) | 54% | 71% | 78% | 90% |

*From the engine model, which recycles whenever it needs Power. Saving runes for a big turn does a little better.*

### 3.2 Graves, Blasting Through

- **His trigger:** when he attacks or defends, he deals damage equal to his Might to **every enemy unit at that battlefield**. He deals no combat damage himself.
- **Defending is where he's best.** When they attack your battlefield, he blasts the attackers before damage, and they don't get defending bonuses. A face-down card of theirs can't reinforce an attack at *your* battlefield (a hidden permanent is played where it's hidden, §811.1.d.1).
- **Attacking:** he blasts the defenders, then can't kill anything that survives, and anything that arrives after his trigger (Ambush, a face-down flip) is untouched. **Attack with him only with Punch First ready** (9 damage), and not into Hidden or Ambush decks.
- **What blanks him:** Switcheroo (swaps his Might with a 0-Might unit), a bounce in response (a unit off the board reads null Might, §359.3.e.12), a −Might effect (Eclipse, Smoke Screen; Leona, Zealot's −8 to stunned units). **Repulse counters anything that chooses him.** Stuns alone don't stop the blast: it's ability damage, not combat damage.
- **Sizes:** Riven's Blade of the Exile (+3) and other equipment lift units out of 4; Punch First brings them back.
- **His blast doesn't choose**, so units that can't be chosen (Ruin Runner, Baron) still take it.

### 3.3 Beast Below

- **When played:** return **another friendly unit** and **an enemy unit** to their owners' hands. Both are targets; with no other friendly unit, it can't bounce at all (§355.8).
- **The friendly return is the point:** Ezreal (discard 1, draw 2 again), Matriarch (replay, empower, revive again), Fizz (recast a spell), Innovator. The unit can be in your base.
- **The enemy return:** their most expensive threat at a battlefield or anywhere: Astral Heron, Harnessed Dragon, Elder Dragon, a Mordekaiser. **A token returned to hand ceases to exist** (§186.1): a Sand Soldier, Recruit, Sprite or Mech is gone for good.
- **What stops it:** Not So Fast counters the bounce (it chooses their unit). Defy and Riposte can't: Beast is a unit and its bounce is an ability, not a spell. Baron Nashor can't be chosen.
- **When it gets Star-Crossed:** the value already happened; replaying it repeats it. The cost is tempo (7 Energy against their 3 and 1).

### 3.4 Rengar on held-up turns

Rengar's Ambush lets him be played as a Reaction to a battlefield where you have units, or where they do. **Hold your Energy through their turn**: if they attack, Ambush him into the fight; if they don't, play him on your turn. It's the deck's answer to "develop or hold up" (v1 §3.3) on turns 4–5.

---

## 4. The game, turn by turn

**Draw odds** (39-card library, 4 + t cards seen by turn t, before mulligans):

| card or group | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| a 2-drop unit (Merchant, Evelynn, Staunch) | 59% | 66% | 72% | 77% | 82% | 85% |
| a 3-drop unit (Innovator, Fizz, Ezreal) | 75% | 82% | 87% | 90% | 93% | 95% |
| a Matriarch | 35% | 40% | 46% | 51% | 56% | 60% |
| a Vex / a Graves / a Rengar | 24% | 29% | 33% | 37% | 41% | 45% |
| Beast Below / Rebuke | 13% | 15% | 18% | 21% | 23% | 26% |
| a Punch First | 35% | 40% | 46% | 51% | 56% | 60% |

**Turns 1–3** play as v1 (its §4), with one difference: **9 three-drop units instead of 11**, so turn 3's two-3-drop play is a little rarer. Fill it with a 3-drop and a 2-drop, or Matriarch and her Empower.

**Turn 4.** Vex at a battlefield, **or** a 5-drop: Graves to the battlefield you hold, Rengar held up for their turn. Edge of Night on a holder.

**Turn 5 and later.** **Beast Below** on their best threat, returning your Ezreal or Matriarch. Graves defends what you hold; Rengar ambushes. Fizz and Matriarch rebuild. Look for the closing line (v1 §3.7).

---

## 5. Card by card — the new cards, and what moved

*Every other card plays as in [v1's §5](sivir-trying-her-best.md).*

- **Graves, Blasting Through ×2** (5 Energy, 1 Body; 4 Might). §3.2. Out of Gust's range (4). With Edge of Night, a 6-damage blast; with Punch First, 9.
- **Beast Below ×1** (7 Energy, 2 Chaos; 8 Might). §3.3. Out of every ping and most single removal spells in the field.
- **Rampage ×2** (was 3). Still your one main-phase kill, best against the decks with no Defy, Discipline or Zhonya's (Kennen, Kai'Sa, Rengar, Diana), and worst against the Calm decks (Riven, Akali, Master Yi, Vex) and against LeBlanc and Mordekaiser, whose deaths feed them. The third is in the sideboard.
- **Tornado Warrior** (sideboard). Brings back a hide card and the Matriarch line when you want them.
- **Star-Crossed ×2** now doubles as job 2's save: return your own threatened unit and one of theirs.

---

## 6. Mulligans

As v1 (its §6): keep a 2-drop plus a 3-drop, or two 3-drops; ship a hand of only tricks or with no play before turn 3. **New:** a hand with Graves or Beast Below and no early play is a ship; a hand with one of them *plus* a 2- and a 3-drop is a strong keep.

---

## 7. Power and Energy, by the numbers

From `scripts/rift try` (engine model, normal pressure), v2 against v1:

| | v1 | v2 |
|---|---|---|
| Gold made a game | 4.18 | **4.43** |
| Energy spent, turns 1–4 (on the play) | 15.3 | 15.7 |
| units by turn 5 | 4.9 | 4.7 |
| Matriarch revives a game | 1.00 | 0.93 |
| tricks crowded out by Energy | 1.77 | 1.88 |
| Fizz finds a spell | 75% | 72% |
| Mercenary on, turns 4–8 | 52% | 58% |

**The model can't see** combat kills, Beast Below's replay value, or Graves's blast; none of this is a win rate.

**Colour demand.** Body 14 symbols (Punch First 6, Rengar 2, Graves 2, Staunch 2, Sabotage 2), Chaos 17 (Switcheroo 4, Rebuke 2, Beast Below 2, Ezreal 3, Fizz 3, Star-Crossed 2, Sivir 1), plus Matriarch's Empower and Edge's equip. 5 Body / 7 Chaos still fits; Gold pays any colour.

---

## 8. The rules this deck leans on

Everything in [v1's §8](sivir-trying-her-best.md), plus:

| rule | what it means here |
|---|---|
| §355.10.d | "all enemy units here" chooses nothing: Graves's blast reaches units that can't be chosen |
| §359.3.e.12 | a unit off the board has null Might: bounce Graves in response and the blast deals nothing |
| §355.8 | every target needs a legal choice: Beast Below with no other friendly unit can't bounce at all |
| §186.1 | a token put anywhere but the board or chain ceases to exist: bounce a token and it's gone |
| §811.1.d.1 | a hidden permanent is played where it's hidden: they can't flip a defender into *your* battlefield |
| §187.8–9, §473.1.b.1 | once a Baron Pit exists, the eighth point by conquer needs all three battlefields scored (derived; [rules-rulings.md](../docs/rules-rulings.md)) |

---

## 9. The sideboard

| card | what it does | in against |
|---|---|---|
| 2 Unyielding Spirit | prevent all spell and ability damage that turn | burn and damage removal: Kai'Sa, Annie, Akali, Ezreal |
| 2 An Offer You Can't Refuse | kill a gear (its controller gets a Gold) | gear: Riven's Blade and Zhonya's, Azir, Jayce, Ornn, Lucian, Kennen's Seal and Last Rites |
| 1 Rebuke | a second Defy-proof bounce | Heron decks (Riven, Vex, Akali), and LeBlanc and Mordekaiser (bounce, don't kill) |
| 1 Repulse | counter a spell or ability that chooses one of your units | anything that blanks Graves (Switcheroo, Charm, a bounce); Hidden Blade |
| 1 Ruin Runner | 6 Energy, 5 Might, can't be chosen by enemy spells or abilities | for a Graves where their answers choose: Kennen (Switcheroo), Diana (Eclipse, Smoke Screen), Kai'Sa (Falling Star, Hextech Ray) |
| 1 Ravenbloom Prefect | banish himself to banish a gear they play | Azir, Jayce, Ornn |
| 1 Rampage | the third copy | the decks with no Calm protection: Kennen, Diana, Rengar, Viktor |
| 1 Tornado Warrior | a hide card, and the Matriarch line | when Graves is out (LeBlanc, Mordekaiser, Jayce) |

**Graves comes out** against decks that want their units to die (LeBlanc, Mordekaiser) and decks with almost no units (Jayce). **Ruin Runner replaces a Graves** where the opponent answers him with a spell that chooses (Kennen, Diana, Kai'Sa): it can't be chosen, so it also stands in for the Repulse that was there to protect him.

---

## 10. Matchups

From the [matchups worksheet](../decklab/sivir-matchups.md), which reads each legend from its Radiance tournament results (or posted lists where there are none) and plays both versions through. **Readings, not records**; the plans are starting points.

| opponent | v2 vs v1 | role | what decides it | bring in | take out |
|---|---|---|---|---|---|
| **Riven** (S) | better | **press**; deny her battlefields | Graves on her small board (Blade lifts some out of 4: Punch First); Beast and Rebuke on Heron; Baron can't be chosen: hold at 7 | Rebuke, Repulse, 2 Offer | 2 Rampage, 1 Sabotage, 1 Star-Crossed |
| **Kennen** (S) | **v1 slightly** | **press early** | no Defy, Discipline or Zhonya's, so Rampage is clean; Switcheroo in every list zeroes Graves; Rhasa shrugs off bounce | Rampage, Ruin Runner, 2 Offer | 2 Sabotage, 1 Graves, 1 Edge of Night |
| **Irelia** (S) | about the same | press; attack with two | the densest tricks in the field; Flash and Defiant Dance blunt Graves | Repulse | 1 Rampage |
| **Master Yi** (S) | better | attack with two | Ruin Runner can't be chosen: Graves with Punch First; Beast or Rampage clears a lone defender; he has no bounce, so Vex sticks | Repulse (if Charm keeps moving Graves) | 1 Star-Crossed |
| **Rengar** (A) | better | hold | 26 of 30 units at 4 or less; Ambush lands after Graves's trigger: defend with him | Rampage, Tornado | 2 Sabotage |
| **Vex** (A) | better | remove their Vex first | stuns don't stop Graves's blast; Heron ×3: Beast and Rebuke | Rebuke, Repulse | 2 Rampage |
| **Azir** (A) | better | **press** before the equipment lands | Graves answers Arise!; a bounced Soldier is gone | 2 Offer, Prefect | 2 Rampage, 1 Sabotage |
| **Evelynn** (A) | about the same | press her hide spots | taking her battlefield trashes her face-down cards; Graves defends, doesn't attack her hide spots | Rampage | 1 Edge of Night |
| **Kai'Sa** (A) | about the same | press; spread out | her removal kills Graves; Beast and Ruin Runner survive it; Rampage clean | Ruin Runner, 1 Unyielding Spirit, Rampage | 2 Graves, 1 Edge of Night |
| **LeBlanc** (A) | same; better after siding | hold; **bounce, don't kill** | every kill feeds her Deathknells, twice with Karthus | Rebuke, Tornado, Repulse | 2 Graves, 1 Rampage |
| **Jayce** (A) | about the same | **press** | nothing on board for three turns; Beast on Elder Dragon; Sabotage on Palace or Aurora | 2 Offer, Prefect, Tornado | 2 Graves, 1 Rampage, 1 Star-Crossed |
| **Akali** (B) | slightly better | press | Calm protection and Heron ×3; her removal is Graves's problem | Rebuke, 2 Unyielding Spirit | 2 Rampage, 1 Sabotage |
| **Diana** (B) | **v1 slightly** | press | Eclipse, Smoke Screen, Flash, Switcheroo all answer Graves at fight speed; none can choose Ruin Runner; Rampage clean | Rampage, Ruin Runner | 1 Graves, 1 Sabotage |
| **Mordekaiser** (B) | same; better after siding | hold; bounce his big ones | deaths fuel him | Rebuke, Tornado | 2 Graves |
| **Viktor, Rek'Sai, Jarvan IV, Darius, Lillia, Rumble** (B) | **better** | hold | boards of tokens and 1–3 Might units: a blast is a 2- or 3-for-1; a bounced token is gone. Imperial Decree (Viktor, Rek'Sai): don't fight into it | Rampage | 1 Sabotage |
| **Lucian** (B) | better | press | equipped units climb past 4: Punch First on Graves; Ruin Runner needs the 9-damage blast | 2 Offer | 2 Rampage |
| **Fiora** (B) | better | press | Mighty units climb past 4: Punch First on Graves; her Riposte (96%) counters your spells on her units but not Beast (an ability, not a spell) | — | — |
| **casual or unknown** | — | hold early, read their plan | ask what they do if nothing happens ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)) | — | — |

The B-tier legends not listed (Kha'Zix, Sett, Ambessa, Ornn, Orianna, Leona, Draven, Pyke, Annie, Ezreal, Teemo, the Sivir mirror) are read in the worksheet; most are "about the same" or "slightly better".

---

## 11. Mistakes that lose games

*v1's list ([its §11](sivir-trying-her-best.md)) all applies. New with v2:*

| mistake | type | instead |
|---|---|---|
| attacking with Graves into face-down cards or an Ambush deck | state | defend with him; attack only with Punch First ready, into what's already there |
| Graves into open Switcheroo or a bounce with no Repulse | information | wait until they're tapped, or bring Repulse |
| Beast Below with no other unit of yours on the board | state | it can't bounce at all (§355.8): play a body first |
| Beast returning a unit with nothing to replay | conversion | return Ezreal, Matriarch or Fizz |
| recycling runes on the turn you meant to play Beast | conversion | count to 7 before you recycle |
| sweeping LeBlanc's or Mordekaiser's board | conversion | their deaths are their engine: bounce instead; side Graves out |
| conquering for the eighth with a Baron Pit on the board | terminal | the Pit makes three battlefields: win by holding |

---

## 12. Open questions for a judge

v1's four (its §12), plus:
1. **Ambessa, The Wolf** ("can't be dealt damage unless I'm in combat"): is a unit defending against Graves in combat when his attack trigger deals its damage? Not settled; don't rely on the blast reaching her.
2. **Overzealous Fan** (Draven) against an attacking Graves: does the Fan's defence trigger send him home before his attack trigger resolves?

---

## 13. What to log, and what decides v1 against v2

**Log every game under `Sivir v2 (draft)`**, with a line on how it went. After about three Nexus Nights, compare it with v1's record.

**The questions:**
1. **Turn 3:** did you miss v1's extra 3-drops?
2. **Graves:** did his blast resolve, or was it Switcheroo'd, bounced or dodged? Did you defend with him?
3. **Beast Below:** did it land on turns 5–6? What did it bounce, what did you replay? Did they answer it first?
4. **Gold:** spent every turn, or short?
5. **Losses:** classify each with the seven types (§11, [strategy.md §8](../docs/strategy.md#8-reviewing-a-game)).

**What to try if the journal shows it:**

| if the journal shows… | try |
|---|---|
| Beast Below landing with value most games | a second Beast Below for the second Rengar |
| turn 3 feeling thin | a Tornado Warrior back, for a Staunch |
| Graves blanked again and again | Repulse main, for a Sabotage |
| Kennen or Diana beating you | the third Rampage main, for a Graves |
| v2 no better than v1 after three nights | back to v1: its five cards are in this sideboard |

---

## Sources and method

- **The list:** the [v2 worksheet](../decklab/sivir-v2.md) (28 Oct 2026), from v1 and six winning midrange lists (Riot's top decks; the LDXP Sacramento 25k).
- **Matchups:** the [matchups worksheet](../decklab/sivir-matchups.md): every S-to-B legend of the Radiance field forecast, from its tournament results or posted lists.
- **Rules:** [rules.md](../docs/rules.md) first, then the verbatim rules, the FAQ and the [rulings](../docs/rules-rulings.md).
- **Numbers:** `scripts/rift try` (engine model, 5,000–6,000 games a scenario), exact draw odds, and the rune-board counts from `lib/sim.mjs`.

## What this guide does not claim

- **No win rate, and no record**: v2 hasn't been played.
- **The matchup readings are untested**: they come from card text and lists, and most B-tier lists are posted, not placed.
- **The model's blind spots** (combat, Beast Below's replay, Graves's blast) are exactly where v2 differs most from v1. The table decides.
