# Research — where the cards and the winners disagree

The engine finder (`lib/engines.mjs`) reads card text. Text is not play. When a card has
been legal all along, fits a legend's engine by its text, is played heavily by some other
legend, and the legend's own **winning lists skip it**, the likelier story is that the
winners know something the pattern doesn't. `scripts/build-research.mjs` finds these and
writes them to `data/research.json`, one question per legend and engine, with the evidence
that usually explains them already counted:

- **elsewhere** — who does play it, so a real card is told from one nobody plays;
- **engine** — whether it feeds the deck's main engine or a side one;
- **cost** — its Energy against the curve, its Power against the domain the list already
  asks most of;
- **slot** — the core cards already at its cost;
- **new cards** — what the next set adds to the same engine in these colours, which can
  undo an old reason.

Until a question is answered here, the site and `scripts/rift ideas` **do not suggest the
card**: it is listed under "Winners skip these" instead of "Could add". New cards are never
questions — nobody has had the chance to skip them — and stay suggestible as untested.

## How to answer one

A section per question, headed by its id from `data/research.json` (an engine-level id
answers every card in it; a card-level id, `<legend>--<card>`, overrides for that card):

```
### reksai-void-burrower--engine-death
**Verdict:** skip | test | model
**Answer:** one paragraph: the reason, and where it comes from.
```

- **skip** — the winners are right; the card stays out of suggestions, with this answer.
- **test** — there is a reason to think the winners are wrong or out of date (often: a new
  card changes the maths). The card is suggested again, with the answer beside it.
- **model** — the reader is wrong (the card does not do what its pattern says); fix
  `lib/engines.mjs`, and the question goes away.

Answer from sources, not from what a rule *must* mean: the card text, the legend's
written plan (`docs/archetypes.md`), a guide in `guides/`, a winning player's own
explanation. An answer that is a guess says so. `check.mjs` requires every answer to have a
verdict from the three and flags answers whose question no longer exists (the data moved;
re-read before deleting).

Before answering, **check the model**: a question can be a symptom of the model reading the
deck wrong. Rek'Sai's first one was — the finder called it a Deathknell deck because it
could not see its real engine (revealing the top of the deck), and every Deathknell payoff
in its colours turned up as a puzzle. The fix was the reveal engine, not nine answers.

---

## Answered

### reksai-void-burrower--engine-death
**Verdict:** skip
**Answer:** Rek'Sai's engine is the top of the deck, not deaths: conquer, reveal two, play one, with Breacher's Accelerate and Undertitan's [Add] 2 paying off what arrives that way. The deck is cheap bodies so that almost anything it flips is playable (27 of 40 cards at 2 Energy or less), and its Deathknell units are insurance that makes a lost fight cheap (guides/reksai-void-burrower.md §6). The payoffs add little when flipped or when they fight: the 3-Energy ones (Karthus, Black Rose Dignitary, Loyal Poro) would take the slot of Faithful Manufactor and Breacher, the 2-Energy ones (Soaring Scout, Unsung Hero) that of Inferna and the Deathknell bodies they would pay off, and the Order payoffs compete for the Order Power that Undertitan, Vanguard Captain and Cull the Weak already ask for. LeBlanc plays these cards because LeBlanc's deck is the Deathknell deck; Rek'Sai's winners, 0 of 61, are right not to.

### reksai-void-burrower--karthus-eternal
**Verdict:** skip
**Answer:** As the engine answer, and smaller still: Karthus doubles what Rek'Sai's Deathknells give — a 1-Might Bird, an exhausted Gold, two Recruits once Empowered — for 3 Energy and the deck's scarcest Power (Order). It is a 3-Might body that does nothing on the turn it is played, in a deck that wins by having more bodies at more battlefields than the opponent can answer. Doubling Ruined Rex (LeBlanc) is a different card. The discovery report's first lead was this card, and it was wrong. Whether it stacks with Detonation Amplifier is also unsettled by the rules (only Repeat stacks, §820.3) — a second reason not to build around it.
