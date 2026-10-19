# Handoff — 19 Oct 2026

You were right about Rek'Sai, and fixing it turned into the system you asked for.

## What was wrong

The engine reader only knew engines it had patterns for. Rek'Sai's real one is revealing the
top of the deck and playing from it, and the reader couldn't see it, so it called the deck
by what it could see: the incidental Deathknells. That one misreading flowed into three
places:

- the archetype page said "Engine: deaths";
- the discovery report led with Karthus;
- there was a "doubled Deathknells" experiment.

Karthus was in 0 of 61 placed Rek'Sai lists. That was the warning sign, and nothing checked
for it.

## What's built now

**A reveal engine in the reader** (`lib/engines.mjs`). Engines are now ranked with the
legend's own engine first. Rek'Sai reads as *Top of the deck > Deaths*.

**A research queue** (`scripts/build-research.mjs` → `data/research.json`, rebuilt daily).
It models every legend: its engines, its core cards, and the signature cards no engine
explains. It also flags a legend whose own text the reader can't parse. Then it applies your
rule. A card counts as a contradiction when all of these hold:

- it has been legal all along;
- it fits the deck by text;
- some other legend plays it heavily;
- the legend's winners skip it (<5% of placed lists, with at least 10 placed).

A contradiction **becomes a question, not a suggestion**. Each question comes with the
evidence that usually explains it:

- who else plays it;
- whether it feeds the main engine or a side one;
- its cost against the curve, and the Power the list already demands;
- which core card already holds its slot;
- what Radiance adds to the same engine (that is the "every legend is different now" case).

Brand-new cards are never questions. They stay suggestible, marked untested.

**Answers are hand-written** in `docs/research.md`, with a verdict of **skip**, **test** or
**model** ("model" means the reader was wrong). Until a question is answered "test":

- the site shows the card under "Winners skip these" instead of "Could add", and each idea
  page has an **Open questions** panel;
- `scripts/rift ideas <legend>` prints the questions too;
- `check.mjs` checks the answers.

## Where it stands

- **30 questions over 20 legends.** One is answered: Rek'Sai and Deaths, with Karthus
  answered on its own. The verdict is that the winners are right.
- **The rest are open on purpose.** Viktor skipping Karthus and 10 other Deaths cards, Kha'Zix
  skipping 8 movement cards, Irelia, LeBlanc and others: I haven't researched those decks, and
  the rule is to read sources, not guess.
- **Rewritten:** the Rek'Sai game plan in `docs/archetypes.md`, now built around reveal and the
  cheap curve. In the discovery report, lead 1 is now the correction plus the system, lead 8
  is now an open question, and the Riven leads are marked thin.
- **Retired:** the Rek'Sai Deathknell experiment. The reader finds no Radiance cards that feed
  Rek'Sai's reveal engine, so there's no replacement yet.
- **Fixed along the way:** the Secret Garden promo legends (Lillia, Ivern) were counted as a
  separate "?, Lillia" legend in the synergy data. They now fold into their base legend.

## Gaps worth knowing

- **Riven has 9 placed lists**, under the threshold, so nothing about Riven is a question yet.
  The reader also can't parse Riven, The Exile's own legend text.
- **Some signature cards have no engine.** Rek'Sai's Inferna and Blood Rush and Kha'Zix's
  Faefolk and Void Assault are examples. That's the Assault/Legion aggro pattern, which the
  reader doesn't model yet. Each idea page lists these.
- **Good next session:** answer the Kha'Zix questions with Jun's guide, and the Viktor
  Deaths question.
