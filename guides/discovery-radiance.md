---
title: Discovery Report — What the Field Hasn't Tried
subtitle: Riftbound, Radiance (from 23 October 2026) — leads for your three decks and the field, each with its evidence, its rules check and how to test it
author: rift toolchain
date: 2026-10-19
---

> *Retired 23 Oct 2026:* the research queue and `docs/research.md` this report leans on were swept with the brews (git history), and the counts behind its leads were taken from lists missing every alt-art card. Read the leads as ideas to re-check against the net decks, not as findings.

**These are leads, not results.** Every lead below has been checked against what the
winning lists *don't* play: a long-legal card that a legend's winners skip is a research
question first (see lead 1 and [docs/research.md](../docs/research.md)), and only new cards,
or cards on legends too thin to tell, are offered as untried. Each one is something the data or the card text says *might*
be better than what people play, that almost nobody is playing yet. The site can find and rank
them, and the rules can be checked; only games decide them. Each lead says what would prove it
wrong, so a few rounds can settle it. Log them in the [match journal](../docs/match-journal.md).

**Where they come from.** Three scans of the deck snapshot (4,492 legal lists, 20 Aug–19 Oct),
read by hand against the card text and the rules:

- **Untried fits** — Radiance cards whose text feeds an engine a legend already runs, played by
  under 5% of that legend's lists (`lib/engines.mjs`).
- **Packages that don't travel** — cards one legend plays in most lists that a colour-mate with
  the same engine plays in almost none (`data/synergy.json`).
- **Finishes** — cards whose lists placed better or worse within a legend. The weakest of the
  three: small samples, and it mixes Vendetta with the online Radiance previews.

Every count below comes from those files on 2026-10-19. "Placed" includes title-claimed RQ
results, not only upstream's flagged events.

---

## Your decks

### 1. Rek'Sai: the first lead here was wrong, and why that matters

The first version of this report led with **Karthus, Eternal** for Rek'Sai: "doubles nine
Deathknell units, in 0 of 61 placed lists — untried." The 0 of 61 was the warning, not the
opportunity. Rek'Sai is not a Deathknell deck. It is cheap bodies and a gamble on the top of
the deck: conquer, reveal two, play one, with Breacher's Accelerate and Undertitan's [Add] 2
paying off what arrives that way. Its Deathknells are insurance that makes a lost fight cheap.
Karthus is a 3-Energy body that does nothing when flipped, competes with Manufactor and
Breacher, and spends the deck's scarcest Power (Order) to double a 1-Might Bird. The winners
were right. The full answer is in [docs/research.md](../docs/research.md).

**What changed because of it.** A long-legal card that winning lists skip is no longer
suggested as an "untried" add anywhere on the site or in `scripts/rift ideas`. It is queued as
a question with its evidence (who else plays it, which engine it feeds, its cost against the
curve and the Power the list already asks for, what the new set adds to the same engine). It
stays out until the question is answered. That queue is 30 questions over 20 legends today,
1 answered. The Rek'Sai "doubled Deathknells" experiment is retired. Radiance adds nothing
to Rek'Sai's real engine in Fury/Order that the card reader can see, so no Rek'Sai lead
replaces it yet.

### 2. Kha'Zix: the Radiance rebuild — see its idea page

A complete list, built on Jun's post-ban midrange list and kept on its own (Jun's lists are
untouched). On Find a deck → Kha'Zix, Voidreaver, as an **untested idea** with every change
explained and a Tweak button. In short: seven slots go to Radiance cards that make the enemy unit
be alone where you want it, and the fight there unanswerable.

| In | Text | Why for Kha'Zix |
|---|---|---|
| 2 **Siren's Song** | *"[Reaction] Move an enemy unit that moved this turn."* | Isolation at Reaction speed: split the pair they move in. **In 69 lists, none of them Kha'Zix.** |
| 1 **Cataclysm** | *"Opponents can't play spells this turn. Move a friendly unit to an occupied enemy battlefield."* | One spell-proof fight per game — facedown spells included, since flipping is playing (§811.1.c.3). Hidden **units** still can come in. |
| 1 **Pitiless Stalker** | *"[E]: [Stun] an enemy unit."* | Stun the defender before the fight. Only on your own Main Phase in an Open State (§381.1), not as a reaction. |
| 1 **Graves, Blasting Through** | *"When I attack or defend, deal damage equal to my Might to all enemy units here."* | For the go-wide decks that never present a lone unit. |
| 2 **Siren of the Shallows** | *[Disarm] [Ganking]* | A 2-drop that moves to set up the fight; replaces Traveling Merchant. |

**Out:** 2 Vex, Apathetic, 2 Traveling Merchant, Grim Resolve, Tornado Warrior, Zed. The Vex cut
is the riskiest: the data behind it is 9 lists against 6 (Vex lists finished 42 percentile points
worse), which is noise-sized. **Undo it first** if the deck feels worse. The goldfish says the
rebuild is about one Energy slower over turns 1–4 — the price of holding more interaction.

**What to ask Jun.** He said he would retest every Kha'Zix build when Radiance starts. The useful
questions for him: does Siren's Song do what the isolation plan needs, and is Cataclysm worth a
slot against the Calm/Chaos Reaction decks.

### 3. Riven: what Irelia knows that Riven doesn't

*Riven has 9 placed lists, under the 10 the research queue needs before "the winners skip it"
means anything, and the card reader can't yet read Riven's own legend text. Treat everything
here as untested, not as something the field missed.*

- **Boots of Swiftness** — in 92 of 93 placed Irelia lists, **0 of 9 placed Riven lists**. Same colours, both
  movement decks. Riven's Battle Preparations readies runes if you Show Off a gear, and Riven's
  gear count is what the Show Off reads; Boots is a cheap gear that also moves the deck's units.
- **Irelia, Fervent** — 87% of all Irelia lists, **0 of 9 placed Riven lists**. *"When you choose or ready me, give
  me +1 Might this turn."* Riven, Deserter (*"Exhaust a friendly unit: Ready a unit"*) and Hunker
  Down ready units; Fervent rewards it. A weaker lead — Fervent costs 5.
- **Riven, Deserter** is in only 2 of 9 placed Riven lists. It turns one unit's exhaust into
  another's ready — every exhaust also feeds Riven, Broken Blade and Reckless Innovator. Worth a
  copy over the flex slot the Nova winner gave to Twilight Shroud.
- **Test.** 2 Boots of Swiftness in for 1 Gust + 1 Twilight Shroud; watch how often Battle
  Preparations readies two runes.

---

## The field

### 4. Lulu, Whimsical in the movement decks

> *"When I move, you may have another unit's base Might become 4 this turn."* · 3E Chaos

In **7 lists in total**. Irelia, Kennen and Kha'Zix all move units several times a turn; each
move makes another unit's base Might 4 — a 1-Might unit becomes a real attacker, or (the text
says "another unit", not "friendly") an enemy's big unit becomes a 4. Which is better is a
judgement each board; untested either way. Your **Irelia experiment** tries 2.

### 5. Pillaged Armory in the Body/Order buff decks

> *"[Deploy] When you play this or when you conquer here, [Buff] a friendly unit."* · 1E Body

**86% of Jarvan IV lists (mostly brews), 0 of 73 placed Sett lists, 0 of 39 placed Fiora lists.** Sett's whole deck spends buffs (Call to
Glory free with a buff, Sett, Kingpin +1 Might per buffed unit); a 1-Energy gear that buffs on
play and again on every conquest there is exactly its fuel. The catch is Deploy: it dies when an
opponent holds its battlefield (rules.md, Deploy).

### 6. Siren's Song as the movement-deck answer

Beyond Kha'Zix: Irelia, Kennen and Yasuo (Windrider scores the third time he moves in a turn) all
live on movement, and Siren's Song moves a unit that moved. In 69 lists, 32 of them Evelynn's. A
Chaos deck facing the Calm/Chaos field has a cheap Reaction here that the field is not yet ready
for.

### 7. Cataclysm against the Reaction field

The field's best decks hold Reactions: Irelia (23 of 40 cards Hidden or Reaction), Riven (19),
Vex (21). **Cataclysm turns off all of their spells for a turn**, Hidden ones too. In 12 lists,
none from those decks' opponents yet. Body decks with one turn that must not be answered —
Rengar's alpha strike, Kha'Zix's isolation, Ambessa's Empowered attack — are the users.

### 8. Karthus in the other Deathknell decks — now an open question, not a lead

Viktor (Mind/Order) skips Karthus in all 50 placed lists, and with it twelve other Deaths
cards that LeBlanc plays. After Rek'Sai, that is a question to answer before it is a lead to
test: it is open on Viktor's idea page with its evidence. Mordekaiser is too new to tell.

---

## Rules worth knowing for these leads

| Interaction | What the rules say | Source |
|---|---|---|
| Two "trigger an additional time" effects (Karthus + Detonation Amplifier) | **Not stated.** Only Repeat stacks by rule. Ask a judge. | §820.3 (Repeat only) |
| Cataclysm vs a facedown spell | Blocked: playing from facedown is playing the card | §811.1.c.3 |
| Cataclysm vs a Hidden unit | Not blocked: it says spells | Cataclysm's text |
| Pitiless Stalker's stun | Your Main Phase, Open State only — not during a fight | §381.1 |
| Vex, Apathetic vs Riven | Riven's units enter ready, and Vex stuns each unit an opponent plays while she is at a battlefield; they can't move it that turn | both cards' text |
| Last Caress + a Hidden unit | Played to any battlefield, its play effect targets **there**, not where it was hidden — Riot uses this case as the example | §811.1.d.3 |

---

## What the finish data hints at — weakest evidence

Within a legend, lists with these cards placed better or worse. Small samples, mixed formats:
read each as "worth a look", never as "proven".

- **Kha'Zix** — better with Switcheroo (9 lists vs 6) and Up from the Deep (9 vs 6); worse with
  Vex, Apathetic (9 vs 6) and Grim Resolve. The rebuild keeps both of the first and cuts both of
  the last.
- **Irelia** — better with Not So Fast (29 vs 7), Astral Heron and Rebuke (8 each); worse with
  Gust and Flash (26 each).
- **Jayce** — better with Deadly Flourish (12 vs 12): one of the few interaction cards a 3-unit
  deck can run.
- **Kai'Sa** — better with Ferrous Forerunner (19 vs 9).

---

## How to run the tests

Pick one lead per deck, not all at once, or you will not know which one did it. Play it for an
evening (four to six games), log each game in the journal with the opponent's legend, and write
one line: *did the card do the job it was added for?* A lead that never gets drawn is not a
result — keep it another evening. Two evenings of "no" retire it; tell me and I will move it to
the "tried" list so it isn't suggested again.
