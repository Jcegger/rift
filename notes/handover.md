# Handover: the Sivir deck (as of 31 October 2026)

Where the work stands, for the next session. Read this, then `decklab/sivir-ready.md` §5 and its log.

## The deck

- **Main deck:** `Sivir: One Army, Two Fights (draft)` in the app (Battle Mistress, Body/Chaos). Read it live with
  `scripts/rift export "One Army"`; never trust a cached copy, since Jay edits in the app between sessions.
- **Backup deck:** `Sivir is trying her best` (v1, guide `guides/sivir-trying-her-best.md`). `guides/sivir-v2.md` is superseded.
- **Current list** (after the pros' swaps, commit `cb1653c`):
  - **Units:** Sivir · Faefolk ×3 · Evelynn · Staunch ×2 · Innovator ×3 · Ezreal ×2 · Fizz ×2 · Nidalee ×3 ·
    First Mate ×2 · Vex ×2 · Rengar ×2
  - **Spells:** Punch First ×3 · Ride the Wind ×3 · Gust ×2 · Rebuke ×2 · Star-Crossed ×2 · Rampage ×2 · Switcheroo ×2
  - **Gear:** Portable Portal
  - **Runes:** 6 Body / 6 Chaos
  - **Battlefields:** Sigil of the Storm (blind) · Targon's Peak (going first) · Forbidding Waste (on the draw)
  - **Sideboard:** Ravenbloom Prefect (gear hate; Jay: must stay) · Graves ×2 · Ruin Runner · Gust · Repulse ·
    Sabotage · Unyielding Spirit ×2 · Star-Crossed
- **To get:** Nidalee, Cat Form ×3 (owned 0).

## The plan, as it now stands

- **Win:** reach 6, then conquer both battlefields in one turn. Sivir (Champion Zone, Accelerate) enters ready
  with her own 2 Power spent: 6 Might and Ganking. Faefolk pulls B's defender into A; Sivir takes the empty B.
- **Since the pros (31 Oct):** don't try to win early fights. Play **midrange and win on interaction on turns
  3–4** (Gust their 2-drop when they Punch First, Star-Crossed their loaded unit), and **carry top end that
  doesn't depend on Sivir living**. Expert reasoning outranks the test bench here.
- **Jay's goal:** 2-1 at Nexus Night (Sip & Play), playing Sivir and doing something interesting. Never an Aurora deck;
  no Calm, no Kennen; cost and ownership are never arguments.

## Open, to iterate (in this order, Jay's call on each)

1. **More two-drops that cost no Power** (pros: 8–9; now 4: Faefolk ×3, Evelynn). Candidates: Tideturner, Pit
   Rookie, Bedeviling Stranger, Gust Monk. Staunch (costs Power) is the obvious swap-out.
2. **Rengar to 3** (top end).
3. **Challenge vs Rampage** (Challenge: 2E 1P, Action, so it works in showdowns; Rampage: 3E, main phase only).
4. **Whirlwind against Baron:** "each player may return a unit". Its text doesn't say "choose", so Baron's "can't
   be chosen" may not stop it. **Rules check first** (CLAUDE.md order), and the opponent returns first.
5. Hard Bargain (Energy held up, like Abandon); Onslaught (Jay likes it; 4E 0P fails the Energy test).
6. "Sea monkey / empowered guy," a 3-drop that's also a 2-drop: card unknown; ask Jay.
7. **Rewrite `guides/sivir-one-army.md` and the sheet** once the list settles. Both are flagged as describing the
   pre-pros list and the old raid framing. `scripts/build-journal`'s matchup card still reads the v1 guide
   (`MATCHUPS` in that script).

## How to change the deck (it's a live app)

Pull the row fresh, save it to `backups/state-pre-<what>-<date>.json` (gitignored), check the deck still matches
the last read (stop if Jay changed it), change only that deck's `cards`/`sb`, POST the whole row back
(`Prefer: resolution=merge-duplicates`, the app's own write in `index.html`), then `scripts/rift export` to
confirm. Test any change first: `RIFT_STATE=<saved state> scripts/rift try --deck "One Army" "-N Card" "+N Card"`.
Log every change in `decklab/sivir-ready.md`; commit and push once Jay confirms.

## Corrections to remember (each was said wrong at least once)

- **Baron Nashor can't be chosen**: nothing in the deck bounces, pulls or kills him. Win by holding.
- **A card played from face down ignores its whole cost** (§811.1.b): a hidden Switcheroo spends no Power for Sivir.
- **Evelynn's pull lands on a battlefield you control**, so the pulled unit becomes the attacker there. She serves
  the holding line (hold A → 7, pull B's defender into A, Sivir takes B), not the raid line.
- **Targon's Peak's two runes** can't pay a 3-Energy spell (Star-Crossed).
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
