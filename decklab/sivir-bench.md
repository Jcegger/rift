---
title: Sivir bench — the alternative version, for later
subtitle: Battle Mistress (Body/Chaos). The deck stays as it is; this is what to try when the journal asks, measured where the model can and flagged where it can't.
started: 2026-10-28
status: bench drafted — nothing here is in the deck; the deck in play is guides/sivir-trying-her-best.md, unchanged
---

How this worksheet works: [README.md](README.md). Jay (28 Oct 2026): "let's keep it as is now,
but let's think of a bench or an alternative version I can try later." Every card here is in
Body or Chaos, owned, and not Dazzling Aurora.

## Why a bench: what the evidence said about the deck (28 Oct 2026)

From the archetype work (`decklab/archetype-taxonomy.md`) and the Radiance tournament results
(141 finishes across the 11 legends with 5+):

- **Well aimed:** the Calm decks at the top (Riven, Akali, Master Yi, Wuju Bladesman, Vex) run
  Defy and Discipline in **every** tournament list, and Defy cannot touch Punch First,
  Switcheroo, Rebuke or any unit. Hush, the counter for 2-Power spells, is in 1% of results.
- **The soft spot: Zhonya's Hourglass** (Riven 93%, Akali 100%, Master Yi 100%, Vex 60%; 43% of
  those results). It turns a kill into a recall, so Rampage loses its kill and the legend does
  not ready. *How much that costs is smaller than first said:* the engine model counts 0.37
  kills a game under normal pressure (all from Rampage), so the legend's death-readying was
  never much of the deck's Gold.
- **Rampage is the weakest card against the Calm half**: Defy counters it, Discipline flips the
  trade as a Reaction, Zhonya's saves the unit.
- **The turn 2–4 Energy squeeze**: 1.77 tricks a game crowded out (engine model, normal pressure).
- **Riven's top end**: Astral Heron (91% of her results) into Baron Nashor (80%).

## The bench

| card | cost | what it is for | evidence |
|---|---|---|---|
| **The Waters' Wage** | 1E, Chaos, Hidden | a Gold; **three ready Gold** if played from face down on your turn. Gold that no Zhonya can stop | 94 lists since 16 Oct, 5 recorded finishes, nearly all Evelynn |
| **Black Market Broker** | 3E unit, Chaos | a Gold every time you play a card from face down; the deck has 7 Hidden cards | 36 lists, 1 recorded, Evelynn |
| **Rebuke** (a second in the main) | 2E 2P, Chaos | the Defy-proof answer to any size; Heron's answer; Fizz recasts it | 87% of Riven's results; in the deck already |
| **Repulse** (already in the sideboard) | 1E 1P, Body | counters a stun, Star-Crossed, Rebuke or Hidden Blade aimed at one of your units | the Riven plan |
| **Isolate** | 2E, Chaos | moves an enemy unit to base (no kill, so no Zhonya); draws if one is left alone there | 7 lists |
| **Stare Down** | 2E, Body | every enemy unit at a battlefield smaller than your chosen unit goes to base | 11 lists; the Riven open note |
| **Downwell** | 8E 2P, Chaos | returns all units and gear: Baron can't refuse it | the Riven open note; you own 1 |
| **Gust** | 1E, Chaos | the engine model's best-scoring cheap trick (an earlier sweep) | in the guide's §13 |

## Version B, "Hidden Gold" — a candidate, not a decision

**Step 1: −3 Rampage, +2 The Waters' Wage, +1 Rebuke.** Spells stay at 13, so Fizz keeps its
targets. What the engine model shows (`scripts/rift try`, 5,000 games a scenario):

| | now | Version B |
|---|---|---|
| cards at 2 Energy or less | 14 | 17 |
| average cost | 2.77 | 2.65 |
| Hidden cards | 7 | 9 |
| tricks crowded out by Energy, a game (normal / heavy pressure) | 1.77 / 3.35 | **1.44 / 2.77** |
| Defy-counterable spells, expected | 3.1 | 2.6 |
| copies that answer each top unit | 10 | **8** (Rampage counted as one) |
| Fizz finds a spell | 75% | 77% |
| kills a game | 0.37 | 0 |
| Gold made a game | 4.18 | *not measurable: see below* |

**Step 2, only after step 1 is tested: Black Market Broker for a non-Hidden unit.** Not for
Tornado Warrior: tried, and it lowers the Hidden count Broker pays off (7 → 5).

**What the model cannot see.** lib/sim.mjs counts Gold only from a card's own "play a Gold" line,
so it misses **Black Market Broker's trigger** and **The Waters' Wage's three ready Gold**
("play three *ready* Gold", which its pattern does not match). The Gold row above is therefore
blind to exactly what Version B is for. Before trusting a number, either test it at the table
or teach the sim those two cards (a small, testable change to lib/sim.mjs).

## When to reach for it

The deck changes only when the journal trips one of these (guide §13):
- **Rampage keeps failing against Calm decks** (countered, out-tricked by Discipline, saved by
  Zhonya's): Version B step 1.
- **Gold short in long games**: The Waters' Wage first, Broker second.
- **Heron or Baron winning games**: Rebuke main (step 1), then Downwell or Stare Down from the
  sideboard (the Riven plan).

## Log

- **28 Oct 2026:** bench drafted. Version B step 1 measured; the sim's blind spot for the two
  Gold cards found and recorded.
