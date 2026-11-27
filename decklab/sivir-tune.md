# Sivir Is Trying Her Best: tune plan for the post-ban field

Written 21 Nov 2026, in TUNE mode (`deck-build` skill). Two days before the 23 Nov bans, so the field is a
forecast ([sivir-postban.md](sivir-postban.md)). **Nothing here is in the app.** Every change is a candidate, to be
decided with Jay after the first post-ban weekend (about 29–30 Nov) and his own games. Any write goes through
`deck-write`.

**Anchor:** Jay's live list (`scripts/rift export "Trying Her Best"`, read 21 Nov), with today's −3 Ride the Wind
+3 On the Hunt already in. No Sivir net deck exists (`rift ideas sivir`: one Radiance finish, #11 of 21; the crowd's
list is the Vendetta Randyyy copy, 25 copies off). **Record with it:** 5–4 in games, 2–1 at Nexus Night (3 Nov).

**The bench** is `scripts/rift try` (20,000 goldfish games, 5,000 engine games a scenario). Its field is the S and
A tiers of `data/field.json`: 4,448 legal lists since 16 Oct, so mostly **pre-ban** decks with their banned cards
stripped out. It can't see pulls, bounces, face-down swaps, Ember Monk's trigger, Boots' Ganking, battlefields or
the double conquest. Read it for shape, not verdicts. None of its numbers is a win rate.

**Baseline (live list)**, the yardstick for every row below:

| measure | play | draw |
|---|---|---|
| two units by turn 3 | 95% | 99% |
| an answer usable on their turn, t3 / t5 | 21% / 64% | 26% / 75% |
| stuck on colour, turn 3 | 5% | 4% |
| Defy-countered spells, expected (popularity · results) | 3.2 · 3.4 | |
| Mercenary on, turns 4–8 (quiet / normal / heavy) | 34 / 40 / 44% | |
| extra cards drawn (quiet / normal / heavy) | 1.3 / 1.5 / 1.4 | |

## 1. Goal and plan

1. **Goal (Jay's):** 2–1 at Nexus Night playing Sivir and doing something interesting. Met on 3 Nov; the list is locked, and it changes only when game results call for it.
2. **Win:** hold one battlefield (A) with two units and a face-down card, and make attacking it a mistake. A hold at 7 wins on its own.
3. **Close:** start on 6 holding A. The hold makes 7. Faefolk walks into A and pulls B's defender in. Stranger bounces it or Dread stuns it. Sivir comes out with Accelerate and walks into the empty B for 8.
4. **Backups:** a holder wearing Boots walks A → B (Ganking). On the Hunt lets Sivir conquer twice. After a loss, Amateur Recital scores two points a turn.
5. **Discipline:** one hold is enough. The default pace is slow; race Baron decks and Ramp. Don't spend Power early, and take Innovator's Gold early and its draw late.

## 2. Every slot, by job

Post-ban pressures (from the forecast): **Defy** in 87–96% of Azir, Orianna, Ornn, Vex and Yi lists. **Charm** moves
your A holder (Yi 89%, Ornn 74%, Orianna 47%). **Gear decks** are rising. Opposing **Vex** stuns what you play.

| card | job | verdict |
|---|---|---|
| Sivir, Mercenary (Champion Zone) | the closer | **keep** |
| Irresistible Faefolk ×3 | the pull | **keep**. It's the close; hold one in base from turn 4 |
| Evelynn, Entrancing ×1 | pull from face down | **keep** |
| Bedeviling Stranger ×2 | punish at A (bounce) | **keep**. Tideturner ×3 over Stranger is on the rejected list |
| Tideturner ×2 | Power-free holder; hidden swap | **keep** |
| Reckless Innovator ×3 | Gold or a card | **keep**. On the Hunt readies it, so it can exhaust again for a second trigger |
| Nidalee, Cat Form ×3 | Ambush punisher; draws on a win | **keep** |
| Ezreal, Prodigy ×2 | card flow | **keep**. A third copy is candidate C1 |
| Ember Monk ×1 | holder that rewards flips | **question**. The bench can't see its trigger; it's the slot candidate C1 cuts |
| Vex, Apathetic ×2 | stuns what they play | **keep**. It stuns Ambush blockers, and Vex and Evelynn both survive the bans |
| Rengar, Trophy Hunter ×2 | Ambush top end | **keep**. It's no B closer once B is emptied |
| Existential Dread ×1 | answers the pulled unit, held in hand | **question**. It's Defy-able (1P); candidate C3 |
| Gust ×2 | 1E Reaction bounce, ≤3 Might | **keep**. Defy-able, but the cheapest answer on their turn |
| On the Hunt ×3 | second move; Sivir's signature | **keep, on test**. 2 Power, so Defy-proof; your main phase only |
| Punch First ×3 | wins the fight; 2 Power | **keep**. Defy-proof, and it switches Sivir on |
| Rebuke ×2 | Defy-proof answer; works in showdowns | **keep**. It won Ekko game 1 and answers their Vex |
| Switcheroo ×1 | Defy-proof trick, face down at A | **keep** |
| Rampage ×2 | the only kill, so it readies the legend | **question**. Defy-able, your turn only, and already sided out against Calm; candidate C4 |
| Star-Crossed ×2 | Reaction bounce; rebuys your Ezreal | **keep main**. Defy-able, so it's the card to side out against Defy (C5) |
| Boots of Swiftness ×1 | +2 and Ganking: the walk A → B | **keep**. Worth more now that On the Hunt readies a Boots holder for a second Ganking move. Swapping it for Edge measured flat because the bench can't see Ganking |
| Edge of Night ×1 | face-down +2 that stays | **keep** |

## 3. Candidates

Each is one like-for-like swap, benched alone against the live list. Adopt one change at a time and judge it on the
watch items (§8), not on the bench. Nothing on the rejected list in `notes/handover.md` is re-proposed. One champion
unit and On the Hunt at 3 hold in every candidate, and every row passes the rules check.

**C1. −1 Ember Monk, +1 Ezreal, Prodigy** (role: a mid-curve body, swapped toward card flow). *Reason:* card draw is
the brief's top watch item (game 1: "card draw felt short"). Ezreal #3 was already the bench's best draw option.
Ride the Wind's slot was the old home for that ready swap, and it's gone.

| | before | after |
|---|---|---|
| extra cards drawn (q / n / h) | 1.3 / 1.5 / 1.4 | **2.0 / 2.3 / 2.1** |
| two units by t3 (play / draw) | 95 / 99% | 95 / 99% |
| answer on their turn t3 / t5, play | 21 / 64% | 21 / 61% |
| same, draw | 26 / 75% | 26 / 74% |
| Mercenary on (q / n / h) | 34 / 40 / 44% | 37 / 44 / 47% |
| Defy-countered · stuck on colour t3 | 3.2 · 5% / 4% | 3.2 · 5% / 4% |

**Confidence:** moderate on direction, low on size. **Adopt if** the logs show turns with no useful card. **Reverse
if** A falls to attacks a 6-Might Monk would have held, or Ezreal's discard keeps costing trap cards.
*Alternative in the same slot:* Kinkou Initiate measured flat (draws 1.5 → 1.5, Mercenary 40 → 40%), but the model
probably misses its conditional draw. **Low.**

**C2 (conditional, the same slot):** if Power, not cards, is what bites, keep Monk. It costs no Power. C1 adds a Power
pip (Chaos 18 → 19).

**C3. −1 Existential Dread, +1 Switcheroo** (role: an answer at A on their turn, swapped to a Defy-proof one). *New
evidence:* the post-ban forecast puts Defy in most of the rising decks. This reverses the 1 Nov swap, so it needs that
evidence to land.

| | before | after |
|---|---|---|
| answer on their turn t3 / t5, play | 21 / 64% | **30 / 63%** |
| same, draw | 26 / 75% | **32 / 72%** |
| Defy-countered (pop · res) | 3.2 · 3.4 | **2.7 · 2.9** |
| two units by t3 (play / draw) | 95 / 99% | 94 / 98% |
| Mercenary on (q / n / h) | 34 / 40 / 44% | 37 / 43 / 46% |
| stuck on colour t3 | 5% / 4% | 4% / 4% |

*Costs:* Switcheroo needs A's single face-down slot, and Dread didn't (Hidden count 8 → 9). It also loses Dread's
Repeat bounce. **Confidence: low.** **Adopt if** Defy decks are about 40% or more of the post-ban top results, or if
Dread is logged as countered. **Reverse if** a hidden card sits stuck in hand because the slot at A is taken.

**C4. −1 Rampage, +1 Rebuke** (role: removal, swapped to a Defy-proof answer that also works on their turn).

| | before | after |
|---|---|---|
| answer on their turn t3 / t5, play | 21 / 64% | 21 / **66%** |
| same, draw | 26 / 75% | 28 / **80%** |
| Defy-countered (pop · res) | 3.2 · 3.4 | **2.7 · 2.9** |
| kills a game (readies the legend; n / h) | 0.31 / 0.53 | **0.15 / 0.26** |
| two units by t3 (play / draw) | 95 / 99% | 94 / 99% |
| Mercenary on (n / h) | 40 / 44% | 42 / 47% |
| stuck on colour t3 | 5% / 4% | 4% / 4% |

*Costs:* half the legend's kill readies, and Chaos Power demand rises 18 → 20. Mordekaiser and LeBlanc (deaths feed
them) prefer the bounce. **Confidence: low.** **Adopt if** Rampage is logged countered or stuck in hand against the
new field. **Reverse if** games are lost to a blocker Rebuke's bounce only delays. Don't run C3 and C4 together
before one of them has games behind it.

**C5 (sideboarding, needs S1). Against Defy decks: −1 Star-Crossed, +1 Switcheroo from the sideboard.**

| | before | after |
|---|---|---|
| answer on their turn t3 / t5, play | 21 / 64% | **33 / 66%** |
| same, draw | 26 / 75% | **37 / 74%** |
| Defy-countered (pop · res) | 3.2 · 3.4 | **2.7 · 2.9** |
| two units by t3 (play / draw) | 95 / 99% | 94 / 98% |
| stuck on colour t3 | 5% / 4% | 4% / 4% |

**Confidence: low**, and the case is the matchup-specific one. If C3 goes main, the same idea applies to a second
Switcheroo, but that's 3 copies across main and sideboard, the cap.

**S1. Sideboard −1 Sabotage, +1 Switcheroo.** *Reason:* the sideboard has no Defy-proof answer for Calm decks, and
Sabotage lost a target: Kennen, its fourth, is hit hard by the bans. Sabotage is also 1 Power, so Defy-able itself.
**Confidence: low.** **Reverse if** you lose to Back Off or a hidden trick Sabotage would have taken (Vex, Kai'Sa,
Seraphine).

**S2. Sideboard −1 Unyielding Spirit, +1 An Offer You Can't Refuse.** *Reason:* gear decks are forecast to rise
(Azir, Orianna, Ornn), and Offer also covers part of Spirit's Orianna job (The Ball's damage). No goldfish change,
since it's sideboard only. **Confidence: none until results.** **Adopt if** Azir, Orianna or Ornn reach the post-ban
top 5. **Reverse if** Kai'Sa (local) keeps killing Sivir with Smoke Screen + Hextech Ray.

**Considered, not proposed:** Boots → Edge #2 (bench flat; the Ganking walk matters more with On the Hunt).
Bandle Scouts' Academy (proven in Evelynn lists, whose legend draws on face-down plays; here Gold isn't the
bottleneck, as `sivir-new.md` measured).

**Win rates (`data/winrates.json`, online, user-submitted; RiftLite, Radiance, latest 7,000 games, pre-ban).**
Sivir: 19 games in total, too few to read. **Evelynn, as a Body/Chaos proxy only** (different legend, small cells):
25% vs Kai'Sa (n 34), 32% vs Vex (33), 33% vs Rek'Sai (25), 18% vs Rengar (18), 25% vs Lillia (19), 15% vs Irelia
(15); 61% vs Riven (31), 71% vs Mordekaiser (21), 86% vs LeBlanc (16), 64% vs Yi (17); 47% vs Ornn (23), 54% vs
Orianna (16), 44% vs Azir (10). If the proxy says anything, it points the sideboard at Kai'Sa, Vex and Rengar, which
are local too. That's a reason to keep Unyielding Spirit ×2 and Graves ×2 until S2's trigger fires.

## 4. Sideboard for the post-ban field (10)

Live sideboard: Ruin Runner ×2 · Graves ×2 · Repulse · An Offer You Can't Refuse · Ravenbloom Prefect · Sabotage ·
Unyielding Spirit ×2. Proposed, with S1 in and S2 held as a trigger:

| card | for |
|---|---|
| Ruin Runner ×2 | Charm decks (Yi, Ornn, Orianna), Diana, Vex, Evelynn, Mordekaiser: an A holder nothing can choose |
| Graves ×2 | Rengar, LeBlanc, Rek'Sai, Seraphine: wide attacks into A |
| Unyielding Spirit ×2 | Kai'Sa (Smoke Screen + Ray on Sivir), Ziggs, Orianna. **→ ×1 if S2 fires** |
| Repulse | Diana (Moonfall on Sivir, Gust on Stranger), Vex (Back Off) |
| An Offer You Can't Refuse | Azir, Orianna, Ornn, Jarvan IV (the gear that matters). **×2 if S2 fires** |
| Ravenbloom Prefect | Ziggs (Bombs), plus gear decks. Jay: must stay |
| Switcheroo (S1, in for Sabotage) | Defy decks (Vex, Azir, Ornn, Orianna, Yi): in for a Star-Crossed (C5) |

**Out:** Sabotage (S1). Its remaining targets are Vex, Kai'Sa and Seraphine, and Repulse covers Back Off.

## 5. Runes

`try` can't swap runes (rune names are excluded from its changes), so the split was swept with `lib/sim.mjs`'s
`sweepRunes` on the live list: 20,000 games a split, play and draw together. The figure is the share of hands stuck
on colour at turn 3.

| split (Body / Chaos) | Energy turns 1–4 | stuck t3 | with hiding on: Energy | stuck t3 |
|---|---|---|---|---|
| 5 / 7 | 17.23 | 4.7% | 16.02 | 6.1% |
| **6 / 6 (live)** | **17.26** | **3.3%** | **16.03** | **4.1%** |
| 7 / 5 | 17.23 | 3.2% | 16.01 | 3.4% |

**Keep 6/6.** 5/7 is worse, and 7/5 is within a point (0.7 with hiding), under the 3-point bar for a change. Printed
Power is now Chaos 18 / Body 17: On the Hunt evened it out. Re-sweep if C1 or C4 goes in, since both add Chaos.

## 6. Battlefields

- **Sigil of the Storm (game 1, blind): keep.** It gives no hold reward to whoever sits on it. Their conquest costs them a rune, while yours can become a Gold through the legend. On a double-conquest turn the forced recycle costs a rune for next turn, so count it.
- **Amateur Recital (after a loss, go first): keep.** It's the trap's engine, scoring two points a turn. It still has no record, so log whether you claimed it and whether it fired.
- **Forbidding Waste (after a win): keep.** It punishes their lone holder. Walk Faefolk in *with* a real unit there (the Evelynn games 3–4 misplay).
- No change. Star Spring is banned. Bandle Tree stays parked for a clogged A slot, and C3 or S1 would make that more likely.

## 7. Mulligan and play with the On the Hunt close

**Rules premises** (`rules-question`: `docs/rules.md` states table; `docs/rules-rulings.md`, "Sivir, Mercenary's
double conquest", 21 Nov, derived, no staff ruling):

- On the Hunt has no Action or Reaction, so you can cast it only in your own main phase, in an open state.
- A readied unit at a battlefield can only standard-move to base unless it has Ganking (§144.4, §810). The units that matter are Sivir with 2 Power spent and a Boots holder.
- Sivir played with Accelerate has spent 2 Power and enters ready with Ganking (§805.1).
- The 8th point by conquest needs every battlefield scored this turn (§473.1.b.1). A hold counts.

**Mulligan.**
- Keep two two-drops and a 3-drop. With one unit or fewer in the opening 4, send back two spells.
- **On the Hunt is the first card to bottom.** In the goldfish it costs the most tempo of any card (−1.2 Energy over turns 1–4), and it does nothing before the closing turns. Punch First is next (−0.7).
- Keep first: Vex, Innovator, Monk, Tideturner. Rengar measured as a good keep too, but the guide bottoms him in a hand with no two-drop. Follow the guide.

**Play.**
- **Turns 1–4 don't change.** Claim A, hide a card, hold up Gust and Ambush. On the Hunt is never a turn-3 play.
- **The default close (6 holding A) doesn't need On the Hunt.** Hold → 7, pull, then Sivir walks into the empty B → 8. Keep On the Hunt in hand as the backup.
- **On the Hunt's own lines:**
  1. **Double conquest from 6 with no hold.** Sivir (Accelerate: 5 Energy, 2 Power; ready, 6 Might, Ganking) conquers one battlefield → 7. On the Hunt (1 Energy, 2 Power) readies her, and she ganks into the other → 8. That's 6 Energy and 4 Power in one turn, so plan it a turn ahead: Gold pays Power. Their Reaction answers on Sivir (Star-Crossed, Smoke Screen, Moonfall) still work; only Defy can't touch it.
  2. **Sivir already on the board at A.** Any 2 Power that turn (On the Hunt, Punch First, Rebuke) gives her Ganking, so she walks A → B herself.
  3. **Boots holder second wave.** After a first combat at B, On the Hunt readies the Boots holder for another Ganking move.
  4. **Hit-and-run (Ride the Wind's old job).** Walk a base unit into an empty B, conquer, then On the Hunt and walk it home. It costs a card, so use it only when the point is worth it.
  5. **Innovator.** Readied after it exhausts, it can exhaust again for a second Gold or draw.
- **What's gone:** nothing in the main deck moves or readies a unit on their turn or in a showdown any more. A is reinforced only by face-down flips (Tideturner) and Ambush. Hold two units at A against Charm decks.
- **Don't over-commit** (Lillia, Evelynn and Draven game 2). On the Hunt's 2 Power is easy to spend early on a pointless second attack. Its job is points on the turn it's cast.

## 8. Watch items for the next games

1. **On the Hunt:** which line it was used for (1–5 above); whether it sat in hand; whether a game was lost for want of Ride the Wind on their turn.
2. **Card draw:** turns with no useful card, and whether Innovator survived. This decides C1.
3. **Defy:** each spell countered, by name. Dread, Rampage, Star-Crossed and Gust decide C3, C4 and C5.
4. **A's face-down slot:** a hidden card stuck in hand because the slot was taken. This decides against C3 and S1.
5. **Charm or a move pulling your A holder** (Yi, Ornn, Orianna), and whether Ruin Runner fixed it.
6. **Gear:** which equipment beat you, for S2.
7. **Power:** early overspend, and whether Mercenary was on when it mattered.
8. **The brief's standing items:** units by turn 3, the four failure types, whether the trap fired, and whether Recital was claimed.
9. **The field:** after the bans, run `scripts/rift meta --since 2026-11-23` and `rift field`, and check whether Defy decks reach about 40% and gear decks reach the top 5.

*Logistics, not an argument:* Piltover shows 2 On the Hunt owned against 3 in the list. Proxy the third until it's in.

## Re-benched 21 Nov, after the simulator fixes

C1 (−1 Ember Monk +1 Ezreal), same command, quiet / normal / heavy opponent: cards drawn 1.3/1.5/1.4 → 2.0/2.3/2.1;
Mercenary on 34/40/44 → 37/44/47%; answers on their turn t5 (play) 64 → 61%; Gold 4.38 → 4.57 (normal). Same
verdict: C1 stays the first candidate. The bench still can't see Ember Monk's +2, Faefolk's pull, Nidalee's draw,
Rengar, Vex's stun, On the Hunt, Sivir's own attacks or the battlefields, so the trap and the double conquest
aren't in these numbers.


## Closing turns, 21 Nov (the turn solver, `lib/turn.mjs`)

Command: `rift try --deck "Sivir Is Trying Her Best" <changes> --close --close-games 800`. A close rate on model
boards, not a win rate: positions come from `lib/match.mjs` games, the solver sees their hand, and their next turn
isn't searched. Positions aren't paired between lists (the games diverge), about 400 per row, so a gap under ~6
points is noise. About half the positions hold a card it can't read (Nidalee, Ezreal, Rengar, Innovator, Vex).

| from (after holds) | the list today | C1 (−Ember Monk +Ezreal) | Ride the Wind back (−3 On the Hunt) |
|---|---|---|---|
| 6: a winning line exists | 7% | 9% | 6% |
| 7: a winning line exists | 39% | **46%** | 40% |
| 7: the greedy model actually won | 22% | 28% | 25% |
| double-conquest wins (of all wins) | 28 of 186 | 41 of 218 | 26 of 202 |

- **The model plays the close badly.** From 7, a winning line exists about 39% of the time and the model takes 22%.
  At the table, check both battlefields and On the Hunt before settling for one conquest.
- **C1 holds up and leans better** (+7 from 7, borderline on this sample): one more body to move. Ezreal's own loot
  isn't read here, so it's the body, not the text.
- **On the Hunt vs Ride the Wind is a wash on closing** (39 vs 40%). The swap stands on the other reason: Defy can't
  counter On the Hunt (2 Power), and Ride the Wind is counterable. In these runs Defy never showed up among the
  cards that broke a winning line, so that edge is untested here.
- **What breaks your winning lines** most often (their list's cards added to their hand): Punch First, Star-Crossed,
  Rebuke, Switcheroo. Pump and bounce held up, not counters.


### Re-run 22 Nov on the card-text engine (the solver now plays 83% of played copies; 400 games)

| from 7 (after holds): a winning line | the list today | C1 | Bounty Board |
|---|---|---|---|
| 21 Nov engine (800 games) | 39% | 46% | 34% |
| 22 Nov engine (400 games) | 39% | **52%** | 39% |

From 6: today 9%, C1 8%, Bounty Board 1%. C1 still leans better; Bounty Board still closes worse from 6 and about the same from 7.
About 200 unpaired positions per cell, so gaps under ~9 points are noise. The heaviest card the solver still can't
read in your positions is Existential Dread (26% of positions: its "already stunned → return it instead").


## Re-run 26 Nov, after the [Flow] and misread fixes (up to 232c18f)

**Mechanism checks inside the model, not verdicts.** The model tracks real swap results at about r 0.31
(`docs/model-calibration.md`, Swaps); for Sivir's own cards (Innovator, Edge of Night, Ride the Wind, Nidalee) it is
weakest. The verdict waits for `rift lifts --legend "battle mistress"` after the 29–30 Nov weekend (HANDOVER item 2).
List as of today: Ride the Wind ×3 main.

**Search** (`rift search --cands decklab/sivir-search.json --games 120 --keep 3 --budget 8000`; stopped at keep 3
after 1,560 games, 248 s). Margin = our points minus theirs by turn 8, paired with the list as is, 95% interval.

| candidate | games | margin vs as is | won |
|---|---|---|---|
| as is | 240 | | 66% (60–72) |
| C3 −1 Existential Dread +1 Switcheroo | 240 | +0.07 (−0.49 to +0.64) | 69% |
| C4 −1 Rampage +1 Rebuke | 240 | −0.08 (−0.65 to +0.50) | 67% |
| C5 −1 Star-Crossed +1 Switcheroo | 240 | −0.14 (−0.71 to +0.42) | 65% |
| C1 −1 Ember Monk +1 Ezreal | 240 | **−0.63 (−1.21 to −0.05)** | 60% |
| C1b −1 Ember Monk +1 Kinkou Initiate | 240 | **−0.76 (−1.34 to −0.18)** | 57% |
| PLANT −3 Nidalee +3 Whiteflame (should lose) | 120 | −1.03 (−1.93 to −0.13) | 52% |

The plant lost, so the run can see something. C5 plays as a main swap against the whole field here, and the sideboard
holds no Switcheroo (S1 was never applied), so it says nothing about the Defy plan it was meant for.

**Closing turns** (`try … --close --close-games 400`; a winning line from 7 points, unpaired, gaps under ~9 are noise;
the solver now reads every position, against about half on 21–22 Nov):

| | list as is | C1 | C3 | C4 |
|---|---|---|---|---|
| from 7: a winning line | 32% | 34% | 36% | 33% |
| from 6: a winning line | 5% | 5% | 3% | 5% |

**What each change does:**
- **C1 reversed.** It was the first candidate on 21–22 Nov (closing from 7: 39 → 52%). Now it closes the same (32 →
  34%) and loses margin. It still draws about 2 more cards a game (3.1 → 5.0, normal) and turns Mercenary on more
  (38 → 44%). But more tricks are stranded for Energy (1.50 → 1.69; heavy 2.85 → 3.22), and answers on their turn at
  t5 drop (59 → 55% on the play). The old closing edge was measured while half the positions held cards the solver
  couldn't read; read in full, the extra draws don't turn into points. C1b (Kinkou) loses the same way, so the cost
  is Ember Monk's absence, not Ezreal.
- **C3 is the only one that leans positive**, and only on answers: an answer on their turn at t3 goes 22 → 33% (play)
  and 27 → 36% (draw), answers free from face down 0.9 → 1.8, Defy-countered spells 3.6 → 3.3. The cost from
  21 Nov stands: Switcheroo takes A's single face-down slot (Hidden 8 → 9).
- **C4 trades kills for answers:** answers at t5 59 → 62%, Defy-countered 3.6 → 3.3, but kills a game halve (0.28 →
  0.14; heavy 0.54 → 0.27), and kills are what ready the legend.

**What the lifts must show** (after the 29–30 Nov weekend; 11 placed lists ever, so it may stay too thin, and then
the list stays as it is):
- C1: good finishes run Ezreal ×3 or Ember Monk ×0 with an interval above 0 would overturn this; otherwise C1 is off
  the table.
- C3: good finishes run more Switcheroo or fewer Existential Dread. Without that, a +0.07 inside the model isn't a
  reason to change.
- C4: Rebuke over Rampage in good finishes. Without it, keep Rampage for the kills.


## 27 Nov: tuning against Master Yi, and the field (after two Yi losses on 25 Nov)

Jay, 25 Nov: lost twice to Master Yi (one was a very strong local, "Chicos"); "charm crushed me. en garde was tough."
The journal is logged (0–2 against Yi).

**Real data** (`rift lifts --since 2026-08-01`, 11 placed Sivir lists, 5 good finishes; thin):
- good finishes run more **Sabotage +1.53 (+0.13 to +2.80)** and **Challenge +1.47 (+0.20 to +3.00)**;
- and fewer **Ride the Wind −1.27 (−2.40 to −0.07)**. You run 3.

**Master Yi, read off the cards:**
- Defy (71%) counters 11 of your 13 spells. Punch First, Rebuke and Switcheroo (2 Power) are safe.
- Their legend gives a lone defender +2, and En Garde gives +1, then +1 more if alone.
- Master Yi, Unstoppable can't be chosen only at Level 16 (`rift versus` misreads it as always).
- **Charm on a unit in base makes you the attacker** into their lone, buffed defender (§190.3.a.1, §466.2.c.1;
  `docs/rules-rulings.md`, 27 Nov). Repulse can't protect a base unit, because it chooses "a friendly unit at a
  battlefield". Ruin Runner can't be chosen anywhere.

**Model, inside the model** (`rift search --hold-up 1`; the field is 11 S/A legends):

| whole field (70% as is) | margin | won |
|---|---|---|
| −1 Ride the Wind +1 Switcheroo | +0.18 (−0.26 to +0.63) | 73% |
| −2 Ride the Wind −1 Existential Dread +1 Sabotage +1 Challenge +1 Switcheroo | −0.05 (−0.54 to +0.45) | 71% |
| −1 Existential Dread +1 Sabotage | −0.06 (−0.54 to +0.41) | 70% |
| −1 Gust +1 Rebuke | −0.09 (−0.53 to +0.34) | 70% |
| −1 Ember Monk +1 Pyke, Returned | −0.09 (−0.50 to +0.32) | 69% |
| −1 Ride the Wind +1 Challenge | −0.11 (−0.53 to +0.32) | 70% |
| −1 Existential Dread +1 Repulse | −0.18 (−0.65 to +0.28) | 68% |
| control −3 Nidalee +3 Whiteflame Protector | −0.78 (−1.47 to −0.08) | 59% (out) |

| Master Yi only, `--vs "master yi"` (69% as is) | margin | won |
|---|---|---|
| **−1 Ride the Wind +1 Switcheroo** | **+0.59 (+0.03 to +1.15)** | 74% |
| the data package (as above) | +0.13 (−0.47 to +0.73) | 70% |
| −1 Star-Crossed +1 Graves | +0.10 (−0.42 to +0.62) | 71% |
| −1 Gust +1 Rebuke | −0.05 (−0.60 to +0.49) | 68% (out, round 2) |
| −1 Gust +1 Repulse | −0.12 (−0.93 to +0.70) | 65% (out, round 1) |
| −1 Existential Dread +1 Sabotage | −0.35 (−1.19 to +0.49) | 63% (out, round 1) |
| −1 Ember Monk +1 Ruin Runner | −0.36 (−1.21 to +0.49) | 64% (out, round 1) |
| control | −0.58 (−1.39 to +0.23) | 61% (out, round 1) |

**Reading.**
- **One change has all three kinds of evidence: −1 Ride the Wind, +1 Switcheroo.**
  - Real data: winners run fewer Ride the Wind.
  - Rules: Defy can't counter Switcheroo, and can counter Ride the Wind.
  - The model: the best swap against the field, and clearly positive against Yi.
- **Sabotage and Challenge** have real data behind them, but the model sees nothing. They stay sideboard or a later test.
- **The model and the table disagree on Yi.** The model gives Trying Her Best 69% against Yi; Jay went 0–2. Either the
  model's Yi misplays Charm and En Garde, or it was the pilot and the night. That's worth a `rift trace` of a model Yi
  game before trusting the Yi numbers further.

**Applied 27 Nov (Jay: "yep"):** −1 Ride the Wind, +1 Switcheroo. The list as is now wins 73% in the model (70% before).

**Round 2, from the new list** (`search --hold-up 1`, whole field):

| change | margin | won |
|---|---|---|
| N1 −1 Ride the Wind +1 Switcheroo (to 1 / 3) | **+0.27 (−0.14 to +0.68)** | 75% |
| N6 −1 Tideturner +1 Staunch Survivor | −0.08 (−0.51 to +0.35) | 73% |
| N5 −1 Ember Monk +1 Gutter Guardian | −0.12 (−0.49 to +0.25) | 72% |
| N4 −1 Edge of Night +1 Hold 'Em | −0.30 (−0.72 to +0.12) | 71% (out) |
| N3 −1 Boots of Swiftness +1 Treasure Trove | −0.13 (−0.66 to +0.41) | 72% (out) |
| N2 −1 Existential Dread +1 Challenge | −0.27 (−0.86 to +0.33) | 70% (out) |
| control | −0.71 (−1.68 to +0.27) | 64% (out) |

**Master Yi only, the survivors:** N1 +0.24 (−0.14 to +0.63), 74% against 72%; N6 +0.05; N5 −0.10; the control lost.

**Reading.** N1 leads again, in both runs, and real data agrees (fewer Ride the Wind in winners). It's the second step
of the same swap. Nothing else from the review beats the cards it would replace.

**Applied 27 Nov (Jay: "hell yeah"):** the second step, so Ride the Wind ×1 and Switcheroo ×3.

**Sideboard pass** (`search --vs <legend> --hold-up 1`, 240 games each; the list as it was before the second step,
with Ride the Wind ×2). Each card from the sideboard swapped in for a main-deck card:

| matchup (model, as is) | best swap | margin |
|---|---|---|
| Azir 87% | Sabotage for Existential Dread | +0.06 (−0.41 to +0.53) |
| Vex 80% | Ruin Runner ×2 for Star-Crossed ×2 | +0.01 (−0.56 to +0.58) |
| Master Yi 72% | Graves ×2 for Rampage ×2 | +0.01 (−0.50 to +0.52) |
| Evelynn 62% | Ravenbloom Prefect for Ember Monk | −0.14 (−0.76 to +0.48) |
| Kai'Sa 56% | Sabotage for Existential Dread | −0.14 (−0.74 to +0.45); Unyielding Spirit ×2 for Gust ×2 −0.53 |

Every control lost.

**Reading.**
- No sideboard swap beats the main deck in the model in any of the five.
- The sideboard plan in the guide stays. Its reasons are card-text ones the model can't price: Charm-proof holders,
  gear removal, damage prevention.
- **The weak matchups are Kai'Sa (56%) and Evelynn (62%)**, and nothing in the sideboard fixes them in the model.
  That's the next thing to work on.

