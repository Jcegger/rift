# CLAUDE.md

Operating notes for this repo. [README.md](README.md) explains how everything *works*;
this file is the short list of things that have actually gone wrong, and what to do
instead. When the two disagree, README.md is right and this file has a bug.

---

## Answering a rules question

**Read `docs/rules.md` first. Every time.** It is the hand-written handbook, and it is
the index to everything else. Grepping the verbatim rules as a first move is how this
repo has produced its confident wrong answers — twice, both times from rules the
handbook already cited.

The order is **handbook → verbatim → FAQ → rulings**:

1. **`docs/rules.md`** — which rules are involved, and how they compose.
2. **`docs/rules-full.md`** — Riot's exact wording. Quote it when the claim is load bearing.
3. **`docs/rules-faq.md`** — the current FAQ **outranks the Core Rules** where they differ.
4. **`docs/rules-rulings.md`** — rulings from Riot staff on things the published rules
   leave ambiguous. **These cannot be derived.** No amount of careful reading finds them.

**Grep alone will not find the rule.** The rules are written in the rules' vocabulary;
questions arrive in players'. §359.3.e.12 decides what happens when a permanent is
bounced in response to its own trigger and contains none of the words *bounce*, *return
to hand* or *leaves the board*. Search the handbook by concept before the verbatim by
keyword.

**The answer is usually a composition, and no single rule states it.** Hidden pinning a
target to a battlefield (§811.1.d.2) plus off-board reads returning null (§359.3.e.12)
is a ruling neither rule contains. When you derive one of these and it matters, record
it in `docs/rules-rulings.md` with its four fields — `check.mjs` enforces them.

**Never state a rules claim from inference about what a rule *must* mean.** Read what it
says. A wrong premise silently invalidates every piece of advice built on it.

---

## What lives where

**The collection, decks, wants and settings are not in git.** They live in a Supabase
row the app mirrors to, read by `scripts/state.mjs` (`scripts/rift`). Adding or changing
a deck is a **live write to a running app** — read the row, back it up, merge, write
back the whole blob. Never assume a cached copy is current; the user edits between
sessions.

**Decks exist to feed advice.** The Decks tab is an input surface for `scripts/rift`,
not a deckbuilder. Any deck-side change has to reach the CLI in the same commit, or the
next answer is built on data that silently went missing.

**`data/*.json` is generated.** Never hand-edit it. Fix the builder and re-run.
`docs/rules.md`, `docs/rules-rulings.md`, `guides/*.md`, `README.md` and this file are
hand-written and do not rebuild themselves.

---

## The data pipeline

**`check.mjs` is the gate, and it is meant to block.** The daily refresh commits nothing
if it fails — stale data that works beats fresh data that lies. When it goes red, the
question is *what changed upstream*, not *how do I get past this*. Loosen an assertion
only when the world genuinely changed shape, and say in the commit what the replacement
invariant is.

**Upstream changes shape silently and often** — three separate breakages in one week in
September 2026. A feed can return `200 OK`, well-formed, the right row count, and mean
something entirely different: an endpoint that quietly became paginated, a card name
split into `name` + `subtitle`, a page that stopped linking the report it used to.
Assert the *meaning*, not the status code.

**A single failing source keeps its last-good file and the run stays green.** So read the
summary line — `Sources rebuilt: N of 8` — on successful runs too. A source that quietly
fails every day is a failure waiting for its shelf life to expire.

**Be polite to upstream.** Several builders share one host and will rate-limit each
other. Space requests, back off on 429, and do not fetch twice what you can compute once.

---

## Standing rules

- **Never invent a number.** No made-up field sizes, no zero standing in for unknown, no
  estimated player counts. Unknown is printed as unknown. This is the repo's whole point.
- **Cost is never the axis.** Do not recommend a deck, list or card because it is cheap
  or already owned, and do not argue against one on what is still to get. Decide on
  matchups, results and card quality.
- **Distinguish a record from a claim.** `tour`/`ev`/`pl`/`ec` mean upstream vouched for
  it. `cp`/`ce`/`cm` are the deck author's own title claim. When ranking archetypes,
  union both — filtering on `tour` alone hides every RQ result.
- **Correct yourself plainly and move on.** State the correction, fix it, continue. No
  ruminating.

---

## Keeping this file honest

`check.mjs` asserts that every file in `docs/`, every builder in `scripts/`, and every
file in `data/` is named in README.md, and that the rules lookup order above still
appears here in order. Add a doc or a builder without documenting it and the build
fails. That is deliberate: this file is only useful while it is true.
