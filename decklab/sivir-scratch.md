# Sivir from scratch (name to come): brewed for Nexus Nights at Sip & Play

Started 2026-11-26 with the `deck-brew` skill. Goal (Jay): a clear plan for early, mid and lethal, and **3–0 at a Nexus
Night**. Must-haves are decided together at stage 2. The identity block below is what `scripts/rift identity --id <this file>` checks a list against. Fill it gate by
gate. A gate is confirmed only by Jay's own words, quoted in `gates`. Confidence stays low until games exist.

Benchmark: Sivir Is Trying Her Best (Jay's live list, 5–4 in the journal). Draft B (`decklab/sivir-new.md`, shelved) is reasoning to draw on, not a start.
Draft list: `decklab/sivir-scratch.deck.txt` (Piltover paste text; `rift <cmd> --file` tests it without the app).

```identity
{
  "legend": "Sivir, Battle Mistress",
  "mode": "brew",
  "anchor": "to choose at stage 6",
  "field": [],
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
    { "gate": "1 field", "date": "", "confirmed": false, "jay": "" },
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

## 1. Field (proposed 26 Nov, waiting on gate 1)

Sources: Jay's Nexus Night regulars (memory, 29 Oct: Vex, Rengar, LeBlanc, Diana; Kai'Sa a weekly regular; Kha'Zix,
Viktor, Orianna and Irelia some weeks), `rift journal` (Sivir 5–4: Pyke 1–0, Lillia 0–1, Evelynn 0–2, Ekko 2–0, Draven
2–1, all 2–3 Nov), `rift field --tiers`, and `rift meta <legend> --since 2026-10-23` (Radiance lists; post-ban lists
are still too few, so these are pre-ban counts, shares of the legend's legal lists).

| deck | tier | what it does | its answers (share of lists, copies) | threat to us |
|---|---|---|---|---|
| **Vex, Gloomist** (Calm/Chaos) | A | reactive control: stops units and spells | Defy 80% ×2.7 (counters a spell ≤4 Energy, ≤1 Power) · Back Off 84% ×2.4 · Discipline 75% ×2.5 · Star-Crossed 68% · Switcheroo 66% · Vex, Apathetic 98% | our 0–1 Power spells get countered; units we play get stunned |
| **Rengar, Pridestalker** (Body/Fury) | A | fast board, then Rengar (6 Might) | Thrill of the Hunt 90% ×2.6 · Punch First 80% ×3 · Rampage 76% ×2.2 · 2-drops at ×3 (Inferna, Pit Rookie, Faefolk) | out-board us early; wins fights with pumps |
| **LeBlanc, Deceiver** (Mind/Order) | A | wide cheap units, sacrifice value, big top end | Mirror Image 96% ×2.5 · Sacrifice 82% · Hidden Blade 81% ×2.3 · Deathgrip 80% ×2.2 · Ruined Rex 84% · Vi 84% · Glasc 89% | grinds long games; kills our key unit |
| **Kai'Sa, Daughter of the Void** (Fury/Mind) | A | spells and damage, then 7–8 Might finishers | Hextech Ray 93% ×2.8 · Stupefy 92% ×3 · Falling Star 86% ×2.9 · Smoke Screen 86% · Watcher 80% · The Empyrean 76% | damage kills Sivir before she swings; big late units |
| **Diana, Scorn of the Moon** (Chaos/Mind) | B | tempo: bounce and move, then Hwei | Gust 98% · Stupefy 97% ×3 · Star-Crossed 97% · Moonfall 95% · Eclipse 87% · Hard Bargain 84% · Ride the Wind 97% | bounces our board back to hand, undoing tempo |
| *Evelynn, Agony's Embrace* (Body/Chaos) | A | our own card pool: Hidden Gold and face-down tricks | Hold 'Em 75% · Switcheroo 64% · Rampage 63% · Star-Crossed 62% · Edge of Night 65% | 0–2 against it in the journal |

**Proposed five:** Vex, Rengar, LeBlanc, Kai'Sa, Diana (the regulars you named). Evelynn as the sixth, since it's 0–2.
## 2. Identity (the options, the pick, the restatement)
## 3. Worth doing, and roles
## 4. Goal tiers and yardstick
## 5. Jobs and counts
## 6. Cards by job (each labelled: proven here · crowd here · proven under X · theory)
## 7. Audit (`rift identity` output, turns 1–4 on the play and on the draw)
## 8. Tests (each change, the same test)
## 9. Freeze and watch items
