# Miss trace, 2026-11-25: cards the biggest per-legend misses never play

Ornn (model 16%, real 49%), Diana (26%, real 53%) and Volibear (63%, real 35%) were each played for 40 games with
calibrate's own lists and opponents (`calibrationSet`, top list, the others' top 3). Each drawn card was counted as
played if it left the hand, on our turn or between our turns (a reaction on theirs). The script (`stuck.mjs`) lives in
the session scratchpad and isn't kept; it reads `matchGame`'s trace events. Ekko isn't in the 20-legend set.

## One misread: a spell's chosen units never reach its next sentence (10 spells)

Challenge is drawn 11 times by Volibear and cast 0. Given a board where it wins on the spot (our 6 and their 4 trade
damage, their 4 dies, our 3 walks into B), the solver doesn't cast it.

Cause: "Choose a friendly unit and an enemy unit." and "They deal damage equal to their M to each other." compile as
two separate spell abilities (`lib/cardtext.mjs`: a spell's follow-on sentence joins the one before it only by a
`folded` override, or when it has its own condition). The `fight` op reads `ctx.ref`/`ctx.ref2`, which the first
ability set and the second never sees, so the spell does nothing. The same holds for every spell whose later sentence
says "it" or "they" without a condition:

- **Fight spells:** Challenge, Gentlemen's Duel, Realm of Death, Clash of Giants, **Rampage**. Rampage is the narrow
  run's Rengar swap: real +0.37, model −0.13 (`notes/swap-trace-2026-11-25.md`).
- **"It" follow-ons:** Last Stand and Shadow's Call ("Give it [Temporary]"), Hunker Down ("It can't move"), Twilight
  Shroud ("can't be chosen"), Ki Barrier ("Prevent the next 7").

Fix (not started; waits on Jay's go): in `compile`, a Spell's trigger-less, condition-less follow-on sentence whose
effects use the chosen units (`who: "it"/"it2"`, or `fight`) joins the ability before it, as unit and gear sentences
already do. One rule instead of 10 overrides. Tests: a closing turn won by Challenge, with its no-win twin; Rampage the
same. Then the narrow run and `calibrate --legends 20`, as with fixes 1 and 2.

## Stuck, but not clearly misreads (look again after the fix above)

| legend | card | played / drawn | reading |
|---|---|---|---|
| Ornn | Retreat ([Reaction], return a friendly unit) | 0 / 14 | Only worth it to save a unit about to die. The fight solver may value the outcome (hold or conquer), not the unit kept. A policy gap, not text. |
| Diana | Retreat | 3 / 14 | as above |
| Ornn | Defy ([Reaction] counter, ≤[e4] and ≤{A}) | 3 / 30 (1 off-turn) | Ornn spends its runes on gear on its own turn, so it may have nothing left to counter with. Check whether runes are held up. |
| Ornn | Helm of Suppression ([e4]{Calm}, their spells cost more) | 3 / 12 | Expensive, and the value function gives a gear 0.25 whatever it does. Taxing their spells is worth nothing to the model. |
| Volibear | Elder Dragon | 7 / 27 | Top of the curve; plausible. |
| Diana | Moonfall | 11 / 23 | Needs our units at a battlefield and an enemy worth pulling; plausible. |

Ornn won 6 of 40 here. Its equipment is played every time it's drawn (Sterak's Gage, Brutalizer, Seal of Focus,
Poro Snax: 88–100%), so its gap isn't dead cards. The 24 Nov note still applies: its units die on the opponent's turn.
The next look is its games against Vex (`rift trace --only Ornn --min 5 --verbose N`, with a null swap of "Ornn,
Blacksmith").
