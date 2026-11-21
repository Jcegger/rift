# CLAUDE.md

Operating notes for this repo: things that have gone wrong, and what to do instead.
[README.md](README.md) explains how everything works; where the two disagree, README.md is right.

- **Check:** `~/anaconda3/lib/python3.8/site-packages/playwright/driver/node scripts/check.mjs`
  (node is not on PATH here; takes about 2 to 3 minutes; passes on `all checks pass`).

Any rules claim, even one made mid-task, goes through the `rules-question` skill.
Any deck, list or card-swap proposal goes through the `deck-build` skill.

## State and decks

- The collection, decks, wants and settings are not in git: they live in one Supabase row
  the app mirrors to, read by `scripts/rift`. Jay edits between sessions, so read it fresh.
  Changing one is a live write to a running app (`deck-write` skill).
- Decks exist to feed advice. The Decks tab is an input surface for `scripts/rift`, not a
  deckbuilder: a deck-side change to the app reaches the CLI in the same commit.

## The data pipeline

- `data/*.json` is generated. Fix the builder and re-run it; README lists the hand-written files.
- `check.mjs` is the gate, and it is meant to block: the daily refresh commits nothing if it
  fails, because stale data that works beats fresh data that lies. When it goes red, find what
  changed upstream. Loosen an assertion only when the world changed shape, and name the
  replacement invariant in the commit.
- Upstream changes shape silently while still returning `200 OK` and the right row count
  (an endpoint turned paginated, a card name split into `name` + `subtitle`, 12 identical
  39-Spiderling lists that were players hiding decks). Assert the meaning.
- A single failing source keeps its last-good file and the run stays green, so read
  `Sources rebuilt: N of 10` on green runs too.

## Standing rules

- **Never invent a number.** No made-up field sizes, no zero standing in for unknown, no
  estimated player counts. Unknown is printed as unknown.
- **Cost is never the axis.** Recommend or reject a deck, list or card on matchups, results and
  card quality, never on price or what Jay already owns.
- **Distinguish a record from a claim.** `tour`/`ev`/`pl`/`ec` mean upstream vouched for it;
  `cp`/`ce`/`cm` are the deck author's own title claim. When ranking archetypes, union both:
  `tour` alone hides every RQ result.
- **Never suggest an Aurora deck.** Lists running Dazzling Aurora are out for Jay's own play:
  no brew, build, swap or "consider" option names one (`lib/avoid.mjs`). They stay in everything about the field (matchups, gauntlets, meta tables,
  scouting), because Jay plays against them.
- **Correct yourself plainly and move on.** State the correction, fix it, continue.

## Muse reads this data

Jay's MCP connector (`~/projects/jayegger-site/functions/api/mcp.js`, live at
jayegger.com/api/mcp) lets Meta Muse read his decks and log games by voice. It depends on the
Supabase row's `decks[].{id,name,cards,sb}` and `journal[].{id,at,deck,opp,res}`, and on
`data/tiers.json`, `data/news.json` and `data/cards.json` (Legend fields `t`, `v`, `g[0]`, `n`).
Rename or reshape any of these and update `mcp.js` in the same session.
