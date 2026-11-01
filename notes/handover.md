# Handover: the Sivir deck (as of 31 October 2026)

Where the work stands, for the next session. Read this, then `decklab/sivir-ready.md` §5 and its log.

## The deck

- **Main deck:** `Sivir Is Trying Her Best` in the app (renamed from "One Army, Two Fights" on 1 Nov; Battle Mistress,
  Body/Chaos). Read it live with `scripts/rift export "Trying Her Best"`; never trust a cached copy, since Jay edits in the app between sessions.
- **No backup deck:** the v1 deck was deleted from the app on 1 Nov (row backed up, `backups/state-pre-rename-2026-11-01.json`);
  its guide `guides/sivir-trying-her-best.md` is kept as "Sivir v1 (retired)". `guides/sivir-v2.md` is superseded.
- **Current list** (after the pros' swaps, `cb1653c`, and −2 First Mate +2 Bedeviling Stranger, 1 Nov):
  - **Units:** Sivir · Faefolk ×3 · Evelynn · Staunch ×2 · Bedeviling Stranger ×2 · Innovator ×3 · Ezreal ×2 ·
    Fizz ×2 · Nidalee ×3 · Vex ×2 · Rengar ×2
  - **Spells:** Punch First ×3 · Ride the Wind ×3 · Gust ×2 · Rebuke ×2 · Star-Crossed ×2 · Rampage ×2 · Switcheroo ×2
  - **Gear:** The Good Stuff (replaced Portable Portal, 1 Nov)
  - **Runes:** 6 Body / 6 Chaos
  - **Battlefields:** Sigil of the Storm (game 1) · Amateur Recital (after a loss: Jay picks the seat, goes first; replaced Targon's Peak 1 Nov) · Forbidding Waste (after a win)
  - **Sideboard:** Ravenbloom Prefect (gear hate; Jay: must stay) · Graves ×2 · Ruin Runner · Gust · Repulse ·
    Sabotage · Unyielding Spirit ×2 · Star-Crossed
- **To get:** Nidalee, Cat Form ×3 (owned 0).

## The plan, as it now stands

**Since 1 Nov: A is a trap.** Hold one battlefield, pull their units into it, punish them there. Closing turn: Faefolk
walks into A and pulls B's defender in (A now has 4 units even with one holder), a face-down Stranger bounces it,
and Sivir walks into the empty B. On their turn the same trap defends: Stranger, Switcheroo, Ambush, Vex, Staunch. A
hold at 7 also wins. Judge later swaps by this. Full reasoning: the worksheet's 1 Nov log entry.

- **Win:** reach 6, then conquer both battlefields in one turn. Sivir (Champion Zone, Accelerate) enters ready
  with her own 2 Power spent: 6 Might and Ganking. Faefolk pulls B's defender into A; Sivir takes the empty B.
- **Since the pros (31 Oct):** don't try to win early fights. Play **midrange and win on interaction on turns
  3–4** (Gust their 2-drop when they Punch First, Star-Crossed their loaded unit), and **carry top end that
  doesn't depend on Sivir living**. Expert reasoning outranks the test bench here.
- **Jay's goal:** 2-1 at Nexus Night (Sip & Play), playing Sivir and doing something interesting. Never an Aurora deck;
  no Calm, no Kennen; cost and ownership are never arguments.

## Decided 1 Nov 2026: what stays, and what changed

Jay's calls, so don't re-propose these without journal evidence:
- **Staunch stays.** Tideturner's "free" Hidden play costs a recycled rune, the same as Staunch's Power, and
  the facedown slot is already contested (Switcheroo ×2, Evelynn; one per battlefield, §811.1.b).
  Staunch is the turn-2 defender against the local aggro decks.
- **Switcheroo stays** ("it would really help against the big units"). It's an answer the bench can't see:
  the bench counts only Rebuke and Star-Crossed.
- **Punch First stays at 3** ("the best card in the deck"). So Rengar #3 has no slot.
- **The field (1,101 legal midrange lists since 23 Oct):** 21.6 units / 13.5 spells / 4.9 gear, and about 7
  two-drop units, almost none costing Power (top-25% finishes: 22.2 / 13.0 / 4.8). This list is 23 / 16 / 1
  with 6 two-drops: close to the norm. The pros' 8–9 is the high end (Rengar, Kennen, Zed, Mordekaiser).
- **First Mate → Bedeviling Stranger** (later the same day; see the trap plan above). Tideturner lost out because
  Ambush (Nidalee ×3, Rengar ×2) already does its job of bringing a unit into a fight.
- **If game results call for a change:** "lost the early board" points to Tideturner (it's in 97% of Irelia
  lists, 79% of Riven); the slot would not come from Staunch, Switcheroo or Punch First (the engine job is
  now 8 against a target of 7). The 1-gear count against the field's ~5 is unexamined.

## Open, to iterate (in this order, Jay's call on each)

0. ~~Portal's slot~~: done, The Good Stuff (1 Nov; worksheet log). Medium confidence; Rengar #3 is the fallback.
1. ~~More two-drops~~: done (8 now, Stranger). 2. ~~Rengar to 3~~: parked, see above.
3. **Challenge vs Rampage** (Challenge: 2E 1P, Action, so it works in showdowns; Rampage: 3E, main phase only).
4. **Whirlwind against Baron:** "each player may return a unit". Its text doesn't say "choose", so Baron's "can't
   be chosen" may not stop it. **Rules check first** (CLAUDE.md order), and the opponent returns first.
5. Hard Bargain (Energy held up, like Abandon); Onslaught (Jay likes it; 4E 0P fails the Energy test).
6. "Sea monkey / empowered guy," a 3-drop that's also a 2-drop: card unknown; ask Jay.
7. ~~Rewrite the guide and sheet~~: done 1 Nov ("Sivir — The Trap"), with a rules check of every step, a matchup
   read of 17 legends and outside sources (in the guide). The journal's matchup card now reads its §9 table too.
8. **Judge questions before an event:** can a face-down Stranger choose its own battlefield (§811.1.d.3, no ruling)?
   Does a Baron Pit gate the 8th-point conquest (the repo's own reading)?

## How to change the deck (it's a live app)

Pull the row fresh, save it to `backups/state-pre-<what>-<date>.json` (gitignored), check the deck still matches
the last read (stop if Jay changed it), change only that deck's `cards`/`sb`, POST the whole row back
(`Prefer: resolution=merge-duplicates`, the app's own write in `index.html`), then `scripts/rift export` to
confirm. Test any change first: `RIFT_STATE=<saved state> scripts/rift try --deck "Trying Her Best" "-N Card" "+N Card"`.
Log every change in `decklab/sivir-ready.md`; commit and push once Jay confirms.

## Corrections to remember (each was said wrong at least once)

- **Baron Nashor can't be chosen**: nothing in the deck bounces, pulls or kills him. Win by holding.
- **A card played from face down ignores its whole cost** (§811.1.b): a hidden Switcheroo spends no Power for Sivir.
- **Evelynn's pull lands on a battlefield you control**, so the pulled unit becomes the attacker there. She serves
  the holding line (hold A → 7, pull B's defender into A, Sivir takes B), not the raid line.
- **Targon's Peak's two runes** can't pay a 3-Energy spell (Star-Crossed).
- **The pull starts a fight at once, and they have focus first** (§323.12, §466.2.c.1.a): flip Stranger when focus
  reaches you. Without Stranger, a surviving defender sends their unit to *their base* (§468.1.a.2), so B stays empty.
- **Vex, Apathetic stuns any unit the opponent plays while she's at a battlefield**, anywhere, not only at hers.
- **Units enter at your base or a battlefield you control, exhausted** unless Accelerate (§355.2.a, §143.4), not "§149" (that's gear).
- **Ezreal's discount on Sivir:** take the Energy, not the rune, or her 2 Power isn't spent (§445.1.b).
- **The test bench is blind to** The Good Stuff, battlefields, combat draws (Nidalee), Innovator's paid draw,
  counterspells as answers, and pulls (Faefolk, Evelynn). Its "0.0 cards drawn" once caused a 9-card overcorrection.
  Swap like-for-like by job, and check every swap against the goal tiers in the worksheet.
- **Hold-trigger battlefields serve the holder**, who's usually the opponent of a raid deck (why Amateur Recital went).

## Where things are

- `decklab/sivir-ready.md`: the worksheet. §5 has the list history, the audit, battlefields, and the per-game log categories.
- `guides/sivir-one-army.md`, `guides/sivir-one-army-sheet.md`: the guide and table sheet (to rewrite).
- `decklab/sivir-matchups.md`: card reads for every S-to-B legend (written for older lists; use the reads, not the verdicts).
- **Per game, log which of four it was:** couldn't reach 6 · couldn't open a battlefield · missed the second conquest · Sivir got answered.
