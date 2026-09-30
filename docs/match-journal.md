# The match journal

A pen-and-paper template for logging games, to be ruled up by hand in a notebook you
already own. **This is a plan, not a finished thing** — the layout below is a first
draft that has never been used at a table, and the open questions at the bottom are
real. Nothing in the app reads it yet.

## Why this exists, and why it is a template rather than a product

[Codex Journals](https://codexjournals.com/products/riftbound-journal-codex-of-arcane-standard-edition)
sells a Riftbound match journal: A5, spiral-bound, 188 pages, £30 — and currently sold
out. There is a [digital edition](https://codexjournals.com/products/riftbound-journal-digital-codex-of-the-arcane)
at £20, a PDF for tablets.

Neither is worth buying for what it is, because the value is entirely in the page
design and the page design is guessable. What is *not* guessable from their listing is
the detail, so this records what could actually be established about it rather than
what it might contain.

## What their journal contains, as far as it can be established

**They publish no interior previews**, for any of their titles, and no third-party
unboxing shows a page. The only hint at density is a customer review: *"Each page covers
way more info than I expected."*

But the same journal is sold for three games, and each listing describes its own
version. The differences give away the template:

| | Flesh and Blood | Lorcana | Riftbound |
|---|---|---|---|
| **Tracker ×80** | Life Tracker | Lore Tracking | Point Tracker |
| **Review ×80** | key plays and decisions | glimmers played, inkwell decisions, win/loss, reflections | battlefield choices, point progression, key reflections |
| **Milestone ×8** | deck performance, mental game, next steps | deck performance, meta position | deck synergy, matchups, performance |
| **Notes** | deck tweaks, sideboarding | theorycrafting | tech swaps, event observations |

So the structure is: a **tracker page filled in live**, carrying whatever the game's
running score resource is; a **review page filled in after**, carrying that game's
characteristic decisions plus win/loss and a reflection; a **milestone every ten
matches**; and notes at the back.

**The one thing worth stealing is the milestone cadence.** Reviewing every ten games
rather than every game is what turns a pile of logs into a decision about the deck.

## What changes when you draw it yourself

Their 188 pages can afford to be dense, and to spend two pages per match. A hand-ruled
page cannot: **every field has to be worth the pen strokes**, and anything that takes
more than about twenty seconds to draw will not get drawn on round three of a long day.

Two consequences:

- **One page per match, not two.** Tracker and review merge.
- **Three prompts, not ten.** The rest will be left blank, and a template with blanks in
  it stops being used.

## The match page

```
#__   date ______   event ____________   rd __

me   ______________ / ______________      ← legend / champion
opp  ______________ / ______________
BF   mine ____________  theirs ____________
first?   me  /  them

 T │ me           │ them         │ score
───┼──────────────┼──────────────┼───────
 1 │              │              │
 2 │              │              │
 3 │              │              │
 4 │              │              │
 5 │              │              │
 6 │              │              │
 7 │              │              │
 8 │              │              │

result  W / L      final ___ – ___
at 7+:  had I Scored every BF that turn?   y / n / —
turning point ___________________________
one change ______________________________
```

### The grid is the whole idea

Write **how** you scored, not the total. Four characters a turn:

| | |
|---|---|
| `C1` | Conquered battlefield 1 |
| `H2` | Held battlefield 2 |
| `B` | a point from an opponent burning out (§431) |
| `E` | a point from a card effect |

A turn might read `H1 C2`. Points come from Conquer and Hold, **once per battlefield per
turn either way** (§469, §470), so this grid *is* the battlefield-transition history
their listing gestures at, and the running total falls out of it. That is why there is
no separate tracker page: the tracker was only ever a view of this.

### The "at 7+" line earns its own row

At 7 points or more, a **Conquer only pays if you Scored every battlefield on the table
that turn** — otherwise you draw a card instead (§471.1.b, §471.1.b.1). **Hold is not
gated at all** (§471.1.a.1).

Because Hold is one of the two ways to Score (§469), the usual line in a 1v1 is: Hold
one battlefield in your Beginning Phase to reach 7, then Conquer the other — the Hold
already counts as that battlefield's Score, so the gate opens. Starting *at* 7 the
Conquer is never needed, since a Hold is not gated and simply wins.

It is the most commonly misplayed moment in the format and it is invisible in a plain
score column. One checkbox tells you afterwards whether you actually had it.

## The milestone page, every ten matches

```
matches __–__     deck ________________   record __–__

  archetype          W–L    what happened
  _______________    ___    ______________
  _______________    ___    ______________
  _______________    ___    ______________

worst matchup _________ → plan ____________
card that underperformed __________________
card I kept wanting _______________________
change I'm making _________________________
```

`card I kept wanting` is the line that justifies the page. It is how a real conclusion
about a deck arrives from play rather than from simulation — the second Switcheroo in
[the midrange dossier](../guides/khazix-voidreaver-postban.md) is exactly the kind of
finding that should have come from ten games rather than from a Monte Carlo.

## Open questions

1. **Is eight turns enough?** Drawn from the 8-point Victory Score (§194.3) and one
   point per battlefield per turn, so eight rows is the floor, not the ceiling. Untested.
2. **Does merging tracker and review actually work at a table?** The argument for one
   page is hand-drawing cost. The argument for two is that you write in the tracker
   *during* the game and the review *after*, and one page means writing on it twice.
3. **Does `first? me / them` matter in Riftbound** the way play/draw does elsewhere?
   Worth a few games before it keeps a line.
4. **Phone-viewable version?** Not built. Would help while ruling up a notebook.
5. **Should the app read any of this back?** Win-rate by matchup would feed
   `scripts/rift`, but that means typing games in twice. Deliberately deferred.

## Status

Drafted 2026-09-30 from the research above. Not yet used in a game. Next step is to rule
up one page, play ten matches, and see which fields stay blank.
