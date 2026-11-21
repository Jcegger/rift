---
name: rules-question
description: Answering a Riftbound rules question, or any rules claim made along the way. Use for "is this a legal play", "how does X interact with Y", "what happens when this triggers / resolves / leaves the board", timing and priority, scoring, and whether a ruling exists. Also use before building play advice or a deck change on a rules premise.
---

# Answering a rules question

The answer stands on what the rules say, read and quoted. A claim inferred from what a
rule *must* mean is a wrong premise waiting to invalidate every piece of advice built on it.

## Lookup order

Start from the handbook every time. Grepping the verbatim rules first is how this repo has
produced its confident wrong answers, twice, both from rules the handbook already cited.
The order is handbook, then verbatim, then FAQ, then rulings
(`scripts/check.mjs` asserts this list stays in this order):

1. **`docs/rules.md`**: which rules are involved, and how they compose. It indexes the rest.
2. **`docs/rules-full.md`**: Riot's exact wording. Quote it when the claim is load-bearing.
3. **`docs/rules-faq.md`**: the FAQ outranks the Core Rules where they differ (`docs/rules.md` says until when).
4. **`docs/rules-rulings.md`**: Riot staff rulings on what the published rules leave
   ambiguous. These cannot be derived; no careful reading finds them.

## Translate the question first

Questions arrive in players' words; the rules use their own vocabulary. §359.3.e.12 decides
what happens when a permanent is bounced in response to its own trigger, and contains none
of *bounce*, *return to hand* or *leaves the board*. So:

1. Map the player's words to the concept with `docs/jargon.md` ("chase the queen" means
   repeated removal on the deck's protected champion unit). Look it up there before asking Jay.
2. Search the handbook by concept, then the verbatim by keyword.

## Compose

The answer is usually a composition that no single rule states. Hidden pinning a target to
a battlefield (§811.1.d.3) plus off-board reads returning null (§359.3.e.12) made a ruling
neither rule contained, until Riot wrote it in as §811.1.d.3.a.

When you derive a composition like that and it matters, record it in
`docs/rules-rulings.md` with its four fields (Date, Source, Rules, Expires);
`check.mjs` enforces them.

## Done when

The answer cites the rule numbers it stands on, quotes the verbatim text for any
load-bearing step, and has been checked against the FAQ and the rulings.
