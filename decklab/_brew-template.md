# <Deck name>: <one-line concept>

Copy to `decklab/<legend>-<concept>.md` at the start of a brew (`deck-brew` skill) or a net-deck build (`deck-netdeck`
skill). The identity block below is what `scripts/rift identity --id <this file>` checks a list against. Fill it gate by
gate. A gate is confirmed only by Jay's own words, quoted in `gates`. Confidence stays low until games exist.

Benchmark: <the deck this has to beat, usually Jay's current list for the legend>.
Draft list: `decklab/<legend>-<concept>.deck.txt` (Piltover paste text; `rift <cmd> --file` tests it without the app).

```identity
{
  "legend": "Sivir, Battle Mistress",
  "mode": "brew | netdeck",
  "anchor": "net | <saved deck name> | file:<name>",
  "field": ["the top 5 we build against, by name"],
  "plan": "One sentence: what the deck does each game.",
  "early": "Turns 1–3: what the deck does, and what it must stop the opponent doing.",
  "mid": "Turns 4–6: how it builds its advantage, and what resource it spends.",
  "lethal": "The closing turn from 6–7 points: the exact line, on which turn, and what breaks it.",
  "winCondition": "How a normal game ends, and on which turn.",
  "givesUp": "What it is weak to, on purpose.",
  "worthDoing": "What it does that the net deck or the benchmark doesn't, and which matchups that wins.",
  "roles": { "Riven": "beatdown | control" },
  "goalTiers": ["tier 0: …", "tier 1: …"],
  "yardstick": "The measure set before any card was picked, and the result that would kill the concept.",
  "jobs": {
    "early-unit": { "by": 7, "target": 0.85 },
    "removal": { "by": 9, "target": 0.75 },
    "closer": { "cards": ["named by hand when the job isn't one lib/jobs.mjs reads"], "by": 10, "target": 0.6 }
  },
  "keyCards": ["the cards the plan can't run without"],
  "gates": [
    { "gate": "1 field", "date": "YYYY-MM-DD", "confirmed": false, "jay": "" },
    { "gate": "2a direction", "date": "", "confirmed": false, "jay": "" },
    { "gate": "2b early", "date": "", "confirmed": false, "jay": "" },
    { "gate": "2c mid", "date": "", "confirmed": false, "jay": "" },
    { "gate": "2d lethal", "date": "", "confirmed": false, "jay": "" },
    { "gate": "2e gives up", "date": "", "confirmed": false, "jay": "" },
    { "gate": "3 worth doing", "date": "", "confirmed": false, "jay": "" },
    { "gate": "4 tiers and yardstick", "date": "", "confirmed": false, "jay": "" },
    { "gate": "5 jobs", "date": "", "confirmed": false, "jay": "" },
    { "gate": "6 the draft is the identity", "date": "", "confirmed": false, "jay": "" }
  ]
}
```

Jobs `lib/jobs.mjs` reads from card text: early-unit, mid-unit, top-unit, removal, bounce, stun, counter, draw, move,
pump, token, ramp, gear (`rift pool <legend>` lists them). Any other job name needs its `cards` listed.

## 1. Field
## 2. Identity (the options, the pick, the restatement)
## 3. Worth doing, and roles
## 4. Goal tiers and yardstick
## 5. Jobs and counts
## 6. Cards by job (each labelled: proven here · crowd here · proven under X · theory)
## 7. Audit (`rift identity` output, turns 1–4 on the play and on the draw)
## 8. Tests (each change, the same test)
## 9. Freeze and watch items
