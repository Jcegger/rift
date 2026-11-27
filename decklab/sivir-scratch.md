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
  "field": ["Vex", "Kai'Sa", "Master Yi", "LeBlanc", "Diana", "Rengar", "Rek'Sai", "Azir", "Evelynn", "Mordekaiser"],
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
    { "gate": "1 field", "date": "2026-11-26", "confirmed": true, "jay": "i do agree with these so far tho (Vex, Rengar, LeBlanc, Kai'Sa, Diana) · last week i played two master yis! · we want to be able to go against a broad meta, maybe do research on post-radiance ban meta · maybe we get more specific in the sideboard" },
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

## 1. Field (gate 1 confirmed 26 Nov)

Sources: Jay's Nexus Night regulars (memory, 29 Oct: Vex, Rengar, LeBlanc, Diana; Kai'Sa a weekly regular; Kha'Zix,
Viktor, Orianna and Irelia some weeks), `rift journal` (Sivir 5–4: Pyke 1–0, Lillia 0–1, Evelynn 0–2, Ekko 2–0, Draven
2–1, all 2–3 Nov), `rift field --tiers`, and `rift meta <legend> --since 2026-10-23` (Radiance lists; post-ban lists
are still too few, so these are pre-ban counts, shares of the legend's legal lists).

| deck | tier | what it does | its answers (share of lists, copies) | threat to us |
|---|---|---|---|---|
| **Vex, Gloomist** (Calm/Chaos) | A | reactive control: stops units and spells | Defy 80% ×2.7 (counters a spell ≤4 Energy, ≤1 Power) · Back Off 84% ×2.4 · Discipline 75% ×2.5 · Star-Crossed 68% · Switcheroo 66% · Vex, Apathetic 98% | our 0–1 Power spells get countered; units we play get stunned |
| **Rengar, Pridestalker** (Body/Fury) | A | fast board, then Rengar (6 Might) | Thrill of the Hunt 90% ×2.6 · Punch First 80% ×3 · Rampage 76% ×2.2 · 2-drops at ×3 (Inferna, Pit Rookie, Faefolk) | out-board us early; wins fights with pumps |
| **LeBlanc, Deceiver** (Mind/Order) | A | wide cheap units, sacrifice value, big top end | Mirror Image 96% ×2.5 · Sacrifice 82% · Hidden Blade 81% ×2.3 · Ruined Rex 84% · Vi 84% · Glasc 89% | grinds long games; kills our key unit |
| **Kai'Sa, Daughter of the Void** (Fury/Mind) | A | spells and damage, then 7–8 Might finishers | Hextech Ray 93% ×2.8 · Stupefy 92% ×3 · Falling Star 86% ×2.9 · Smoke Screen 86% · Watcher 80% · The Empyrean 76% | damage kills Sivir before she swings; big late units |
| **Diana, Scorn of the Moon** (Chaos/Mind) | B | tempo: bounce and move, then Hwei | Gust 98% · Stupefy 97% ×3 · Star-Crossed 97% · Moonfall 95% · Eclipse 87% · Hard Bargain 84% · Ride the Wind 97% | bounces our board back to hand, undoing tempo |
| *Evelynn, Agony's Embrace* (Body/Chaos) | A | our own card pool: Hidden Gold and face-down tricks | Hold 'Em 75% · Switcheroo 64% · Rampage 63% · Star-Crossed 62% · Edge of Night 65% | 0–2 against it in the journal |

**Proposed five:** Vex, Rengar, LeBlanc, Kai'Sa, Diana (the regulars you named). Evelynn as the sixth, since it's 0–2.

**Gate 1, Jay (26 Nov):** agreed with the five; added Master Yi ("last week i played two master yis!"); the main deck
should handle a broad meta, with the sideboard getting specific.

**So the field has two layers.**
- **The main deck answers the broad field:** the six at the table (Vex, Kai'Sa, Master Yi, LeBlanc, Diana, Rengar) and
  the post-ban risers (Rek'Sai, Azir, Evelynn, Mordekaiser).
- **The sideboard takes specific matchups.** It's planned at stage 6, after the main deck.

**What the main deck must survive, by kind of answer:**

| kind | who | what it means for us |
|---|---|---|
| spell counters | Vex (Defy 80% ×2.7), Master Yi (Defy 71% ×2.8), Azir (Defy 99% ×2.8) | spells with 0–1 Power get countered; 2 Power can't be |
| damage and kill removal | Kai'Sa (Hextech Ray ×2.8 and Falling Star ×2.9, about 5.7 a list; Stupefy's −1 finishes), LeBlanc (Hidden Blade 81%), Rek'Sai (Falling Star 87%; Cull the Weak is an edict, so we choose), Mordekaiser (Hidden Blade, Realm of Death) | a single key unit dies; the plan can't hang on Sivir alone. (Corrected 26 Nov: Deathgrip and Sacrifice kill their own unit, not ours. Azir has almost no removal and goes wide behind Defy.) |
| bounce | Diana (Gust, Star-Crossed, Moonfall), Vex (Back Off) | tempo undone; units we paid for come back to hand |
| moving our units | Master Yi (Charm 53% ×2.6) | a holder pulled off its battlefield |
| going wide | Rek'Sai (cheap 1–2 Might units, Undertitan), Azir (gear and Arise! tokens), Evelynn | many small bodies; one-for-one removal falls behind |
| racing | Rengar, Rek'Sai | out-boarded by turn 3 |

**Post-ban research (26 Nov):**
- **Posted lists since 23 Nov** (`rift meta --since 2026-11-23`): 477 lists, none with a recorded finish yet. Evelynn
  6.7%, Rek'Sai 5.5%, Kai'Sa 4.8%, Azir 4.6%, Viktor 4.2%, Mordekaiser 4.0%, Vex 3.6%. Riven and Kennen are down to about
  1.5%, Rengar to 1.3%.
- **RiftLite, 23–25 Nov:** 1,921 matches. Play share: Vex 6.4%, Evelynn 5.6%, Kai'Sa 4.7%, then Riven, Irelia, Nasus,
  Mordekaiser. Win rates wait for `lib/realfit.mjs`: the raw result field splits 716 / 1,149 by seat, so it isn't the
  simple "a won" it looks like.
- **Outside sources:**
  - [RiftMana](https://riftmana.com/meta-tier-list/): Azir and Vex in S; Rek'Sai, Kennen, Rengar, Master Yi and
    Evelynn in A.
  - [Riftdecks](https://riftdecks.com/legends?metagame_id=5&minimum_players=&date_range=all&top_percent=&relevance=&hide_banned=1&start_date=&end_date=): Rek'Sai first by share (11.3%).
  - [Shonen TCG](https://www.shonentcg.com/blog/riftbound-radiance-post-ban-what-to-play): Kai'Sa first, Rek'Sai
    second.
  - [riftbound.gg](https://riftbound.gg/radiance-post-ban-prediction-tier-list/) forecasts Azir and Vex at the top.
  - The bans took about 3 cards from a typical Kai'Sa list, and 6 from Riven and Kennen.

  Agreed across them: Rek'Sai, Azir and Vex.
- **Profiles of the risers** (`rift meta`, Radiance lists):
  - **Rek'Sai:** Noxus Hopeful, Inferna, Carrion Dredger, Undertitan and Cull the Weak, each about ×3 in 94%+ of lists;
    Falling Star 87%.
  - **Azir:** gear in 99% (Brutalizer, Doran's Shield, Eye of the Herald, B.F. Sword); Defy, Discipline and Guards!
    98%; Arise! 96%. (Deathgrip 86% kills their own unit for a pump.)
  - **Mordekaiser:** Realm of Death 88%, Hidden Blade 64%, Carrion Dredger 73%, Mordekaiser, Dominating (9E) 66%.
## 2. Identity (the options, the pick, the restatement)

### 2a. Direction: three options (proposed 26 Nov, waiting on Jay)

The engine, in card text (rift card):
- **Battle Mistress:** "When you recycle a rune, you may exhaust me to play a Gold gear token exhausted. When one or more
  enemy units die, ready me."
- **Sivir, Mercenary:** "[Accelerate] … If you've spent at least 2 Power this turn, I have +2 Might and [Ganking]."
- **Gold:** "Kill this, exhaust: add 1 Power of any domain."

Rules premise to re-check through `rules-question` once a direction is picked: paying Power from a rune is a recycle, so
each Power payment can make a Gold. It was worked through on 21 Nov in `decklab/sivir-new.md` "The engine, in card
text", and isn't re-checked yet this session.

**A. Paid in Power (Mercenary tempo).**
- **Engine:** spend Power every turn on 2-Power spells (Punch First, On the Hunt, Rebuke, Switcheroo). The Power
  switches Sivir on (6 Might, Ganking) and pays back as Gold.
- **Gap:** counters are everywhere. Defy, in Vex, Master Yi and Azir, can't counter a 2-Power spell.
- **Early:** two cheap units. **Mid:** Sivir with Accelerate and a 2-Power trick each turn. **Lethal:** a double
  conquest (conquer A, ready her with On the Hunt or move her, conquer B).
- **Weak to:** removal on Sivir (Kai'Sa, LeBlanc, Rek'Sai), and wide boards.
- **Note:** the closest of the three to Trying Her Best, so "worth doing" would be the hard gate.

**B. Bounty Board (the kill engine).**
- **Engine:** kill instead of bounce. Enemy deaths ready the legend (another Gold), Pyke, Returned makes Gold when an
  enemy dies, and Graves, Blasting Through deals his Might to every enemy unit at his battlefield when he attacks or
  defends.
- **Gap:** going wide is up after the bans (Rek'Sai, Azir's tokens, LeBlanc, Evelynn), and one sweep beats many small
  bodies.
- **Early:** trade units, and kill their 1–2 drops. **Mid:** Graves and Rampage for kills; each kill makes Gold.
- **Lethal:** a board they can't block, with Sivir switched on by the Gold.
- **Weak to:** decks with few, big units (Kai'Sa's Watcher and Empyrean, Mordekaiser), and Vex's control.
  Reasoning from `decklab/sivir-brew.md` (21 Nov), never tested.

**C. Ambush (Hidden Gold).**
- **Engine:** cards played face down (Hidden: Pyke, Gutter Guardian, Switcheroo, Edge of Night). Bandle Scouts' Academy
  makes a Gold each time you hide a card there. Revealing a hidden card on their turn costs no Energy.
- **Gap:** a hand they can't see. Their removal and counters have to guess, and the deck acts on their turn.
- **Early:** hide one card and play one unit. **Mid:** Gold from hiding, ambushes in their combat.
- **Lethal:** Sivir switched on from banked Gold, plus a hidden trick to win the deciding fight.
- **Weak to:** racing (Rengar, Rek'Sai) before the hidden cards pay off.
- **Note:** the most decisions of the three, and Evelynn's proven chassis (same domains). Defy reads a hidden spell's
  printed cost, so a hidden 2-Power spell is safe (`docs/rules-rulings.md`, 26 Nov).

### 2a. Does Evelynn do this better? (Jay's question, 26 Nov)

Jay: "my only fear is evelynn just does that strategy better, but i could be wrong".

- **Evelynn's legend (Agony's Embrace):** "Once each turn, when you play a card from face down, draw 1. Then, if it's
  not your turn, discard 1." Hiding becomes **cards**.
- **Battle Mistress** gives nothing for hiding as such. But a hide costs 1 Power, and Power from a rune is a recycle:
  `docs/rules-rulings.md`, "Battle Mistress and Hidden" (26 Nov, derived). So **each hide is half of Sivir's switch**
  ("Sivir, Mercenary's double conquest", 21 Nov: hide costs count as Power spent) and can make a Gold.
- **Gold is limited, though:** one per ready of the legend, so one a turn plus one each time enemy units die.
- **What holds Sivir back** (bench, 21 Nov, `sivir-new.md`) is having 2 Power of useful things to spend each turn,
  not Gold.

**Verdict.** For a pure Hidden deck, Jay is right: Evelynn draws a card per face-down play, has 529 lists and sits in
A tier; under Sivir the same pile is a worse Evelynn. What Sivir does differently is spend: Evelynn turns hiding into
cards, Sivir turns it into **tempo** (a 6-Might ganker every turn, and Gold for 2-Power spells Defy can't counter). So
the direction worth building is one Evelynn can't copy.

**D. Power every turn (the blend).**
- **From A:** the goal. Switch Sivir on every turn and close with a double conquest.
- **From C:** the fuel. Hidden cards are the cheapest useful Power spend, with a hidden 2-Power trick for the deciding
  fight.
- **From B:** the multiplier. Kills ready the legend for another Gold.
- **Weak to:** removal on Sivir, so the must-have question below decides whether she's the only win condition.

### 2a. My recommendation, with reasons (26 Nov, Jay asked for help deciding; waiting on his words)

1. **Direction: D.**
   - Plain A is nearly Trying Her Best, so it fails "worth doing".
   - Plain B has no plan against Kai'Sa's or Mordekaiser's few big units.
   - Plain C is Evelynn's deck.
   - D is the shape where Battle Mistress pays and Evelynn's doesn't, and it differs from Trying Her Best by killing
     instead of bouncing, and by closing with On the Hunt (2 Power, which Defy can't counter) instead of Ride the
     Wind (1 Power).
2. **Sivir is the best closer, not the only one.**
   - She's 4 Might, 6 when switched on, and dies to Falling Star (Kai'Sa, Rek'Sai), Hextech Ray plus Stupefy
     (Kai'Sa), Hidden Blade (LeBlanc, Mordekaiser) and Realm of Death (Mordekaiser).
   - The second closer comes in at instant speed (Ambush): Rengar, Trophy Hunter (6 Might) or Nidalee, Cat Form.
     Their Power costs keep the plan alive when Sivir is dead.
3. **Keepers: a clean slate with two fixed points.**
   - Fixed: Sivir, Mercenary ×1 and On the Hunt ×3 (the signature at 3; Defy-proof; readies every unit for the
     double conquest).
   - Everything else earns its slot at the card stage. Ride the Wind loses its job to On the Hunt, and the Faefolk
     trap is a holding plan where D races.
## 3. Worth doing, and roles
## 4. Goal tiers and yardstick
## 5. Jobs and counts
## 6. Cards by job (each labelled: proven here · crowd here · proven under X · theory)
## 7. Audit (`rift identity` output, turns 1–4 on the play and on the draw)
## 8. Tests (each change, the same test)
## 9. Freeze and watch items
