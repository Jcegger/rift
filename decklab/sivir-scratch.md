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
  "anchor": "file:sivir-la",
  "field": ["Vex", "Kai'Sa", "Master Yi", "LeBlanc", "Diana", "Rengar", "Rek'Sai", "Azir", "Evelynn", "Mordekaiser"],
  "plan": "Body/Chaos fight deck: every Power buys a won fight, Fizz buys it twice, and Sivir turns the fights into a double conquest.",
  "early": "Two cheap units by turn 3; kill their best early unit (Rampage or a won fight) to ready the legend; stop wide starts and an early Vex; fill the trash for Fizz.",
  "mid": "Pick one fight a turn and win it: Sivir with Accelerate (or Rengar), Gold pays Punch First / Switcheroo in their combat, Fizz rebuys a trick; kill their Vex before a key unit.",
  "lethal": "From 6: Sivir conquers A, On the Hunt readies her, she ganks to B and conquers (8). Broken by removal on Sivir, a Vex stun, or a blocker over 6 at B, so a second attacker matters.",
  "winCondition": "A double conquest around turn 7–8 after winning the mid-game fights.",
  "givesUp": "Decks that won't fight (Azir wide behind Defy, Mordekaiser late), an early Vex we can't kill, long value grinds (LeBlanc, Kai'Sa); the sideboard covers them.",
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
    { "gate": "2a direction", "date": "2026-11-27", "confirmed": true, "jay": "yes, this feels good! (the Body/Chaos fight deck: every Power buys a won fight, Fizz buys it twice, Sivir turns the fights into a double conquest)" },
    { "gate": "2b early", "date": "2026-11-27", "confirmed": true, "jay": "these all seem good! just make sure you're considering any and all cards available to us, which you can take your time on" },
    { "gate": "2c mid", "date": "2026-11-27", "confirmed": true, "jay": "these all seem good! just make sure you're considering any and all cards available to us, which you can take your time on" },
    { "gate": "2d lethal", "date": "2026-11-27", "confirmed": true, "jay": "these all seem good! just make sure you're considering any and all cards available to us, which you can take your time on" },
    { "gate": "2e gives up", "date": "2026-11-27", "confirmed": true, "jay": "these all seem good! just make sure you're considering any and all cards available to us, which you can take your time on" },
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

### 2a, round 2. What is the Power for? (Jay, 27 Nov: "power every turn is nice but what are we using it for" · "it's ok if it's similar to evelynn and uses orange/purple fundamentals, i just want to be intentional!")

**What Sivir's good finishes spent Power on.** `data/decks.json` holds 57 Sivir lists and 5 good finishes, all from
30 Sep to 2 Oct, before the bans:
- 2 Aurora ramp (out);
- 2 hand attack (Sabotage, Mindsplitter: the style Jay finds mean);
- 1 tempo (LA Regional #146/2165: Punch First ×3, Switcheroo ×2, Rampage ×3).

Each spent Power on one thing that won.

**The Body/Chaos fundamentals** (good finishes since 23 Oct: Evelynn 31, Kha'Zix 25). Cards in both cores:

| card | Evelynn | Kha'Zix | job |
|---|---|---|---|
| Punch First (1E 2P) | 77% ×2.0 | 100% ×3.0 | win a fight (+5) |
| Switcheroo (2E 2P, Hidden) | 74% ×1.5 | 100% ×1.2 | win a fight (swap Mights) |
| Rampage (3E) | 81% ×2.0 | 96% ×1.4 | fight to kill |
| Star-Crossed (3E 1P) | 77% ×1.4 | 100% ×1.5 | answer on their turn |
| Vex, Apathetic (4E) | 87% ×2.3 | 92% ×2.0 | stuns what they play |
| Rengar, Trophy Hunter (5E 1P) | 87% ×2.4 | 88% ×2.0 | 6-Might Ambush threat |
| Fizz, Trickster (3E 1P) | 48% ×1.5 | 100% ×2.2 | recasts a spell from the trash |
| Gust (1E) | 61% ×1.6 | 76% ×1.3 | cheap answer on their turn |

Each legend adds its own package. Evelynn adds Hidden units (Pyke 90%, Gutter Guardian 84%, Evelynn, Entrancing 97%),
Hold 'Em 87%, Edge of Night 84% and Bandle Scouts' Academy 94%. Kha'Zix adds movement (Faefolk ×3, Void Assault ×3,
Traveling Merchant, Reckless Innovator) and Sabotage. **The fundamentals are a fight deck**, proven in these colours.

**Where Battle Mistress tilts it.** These are what the Power is for:
1. **The 2-Power tricks cost us less.**
   - Power paid from a rune is a recycle, and the legend turns it into a Gold for later
     (`docs/rules-rulings.md`, 26 Nov). A rune recycled for Power is normally next turn's loss
     (`docs/rules.md`, Runes); here it comes back.
   - **Tilt:** Punch First ×3 and Switcheroo ×2–3. Defy reads the printed 2 Power, so it can't counter either.
2. **Fizz casts each trick twice.**
   - Fizz, Trickster: "play a spell from your trash with Energy cost no more than [3], ignoring its Energy cost.
     Recycle that spell after you play it. (You must still pay its Power cost.)" A used Punch First comes back for 2
     Power, which Gold pays in any domain.
   - **Tilt:** Fizz ×2–3.
3. **Kills over bounces.**
   - "When one or more enemy units die, ready me": a kill readies the legend for another Gold, and a bounce doesn't.
   - **Tilt:** Rampage (and Pyke, Returned, Gold on a death) above Gust and Star-Crossed. One or two bounces stay for
     what can't be killed.
4. **Sivir is the payoff.** A turn with Punch First or Switcheroo has already spent 2 Power, so she has +2 Might and
   Ganking. On the Hunt ×3 ("Ready your units", 2 Power) turns a won fight into a second conquest.
5. **Left behind unless they win fights:** Evelynn's Hidden units and Kha'Zix's movement. Their legends paid for them;
   ours doesn't.

**Proposed identity: "Body/Chaos fight deck. Every Power buys a won fight, Fizz buys it twice, and Sivir turns the
fights into a double conquest."**
- **Early:** trade with cheap units, and Rampage their best one.
- **Mid:** Sivir with Accelerate, or Rengar or Vex. Gold held for tricks in their combat; Fizz rebuys a used trick.
- **Lethal:** win A, On the Hunt, win B.
- **Gives up:** decks that won't fight (Azir going wide behind Defy). The sideboard covers them.

### 2a confirmed (27 Nov)

Jay: "yes, this feels good!" Then, before building:
- **Timing:** "i would usually go on tuesday, but i have plans. i may go to a different one that week, but we can still
  test more. i wanna get it done but we have some time".
- **Anchor:** "we can focus on the regional list, but it's a new meta now so i'm fine truly from scratch. i also don't
  HAVE TO use her signature spell". The LA Regional list is the reference. It's legal today card for card; its
  battlefields are Sigil of the Storm, Zaun Warrens and Sandswept Tomb, runes 5 Body / 7 Chaos. On the Hunt isn't fixed.
- **Defy:** "i think defy can be used during showdowns/combat (maybe) but i don't necassarily want to worry tooooooooo
  much about it, i'll try to bait it. so somewhere between 1 and 2". So we kill mostly in combat and bait Defy when it
  matters. Yes, Defy works in combat (`docs/rules-rulings.md`, 27 Nov).

**Defy, by card:** it can't counter Punch First, Switcheroo, On the Hunt or Rebuke (2 Power). It can counter Rampage,
Challenge, Gust and Star-Crossed (0–1 Power).

**Two rules findings that shape 2b–2d** (`docs/rules-rulings.md`, 27 Nov):
- **Fizz's recast happens when Fizz is played, in our Main Phase.** It's a pump before an attack, or On the Hunt after
  a first conquest, never a trick in their combat.
- **While their Vex, Apathetic is at a battlefield, every unit we play is stunned**, wherever it goes. Vex, Apathetic
  is in 98% of Vex lists, 86% of Diana lists and 87% of good Evelynn finishes. Sivir with Accelerate or an ambushing
  Rengar does nothing that turn. Kill Vex first (4 Might; Deflect costs an extra Power to target her), or develop
  before she lands.

### 2b–2e. Early, mid, lethal, gives up (confirmed 27 Nov: "these all seem good!")

**2b. Early (turns 1–3): trade evenly, kill their best early unit, and set up the trash for Fizz.**
- **Two units by turn 3** from cheap bodies the colours' winners run (candidates: Shadow Order Disciple, Tideturner,
  Traveling Merchant, Bedeviling Stranger; picked at stage 6).
- **By turn 3–4, Rampage (or a fight we win) kills their best early unit.** It's a kill, so the legend readies for a
  Gold. Rampage costs 0 Power, so Defy can counter it; bait with it, or fight in combat instead.
- **What it must stop:** Rek'Sai's and Rengar's wide starts (out-boarded by turn 3), and **their Vex landing before we
  develop**, since every unit we play after that is stunned.
- **Why:** the deck wins mid-game fights, so it only needs to not fall behind early. And each early spell cast fills
  the trash for Fizz.

**2c. Mid (turns 4–6): pick one fight a turn and win it with Power.**
- **Threats:** Sivir with Accelerate (she has spent 2 Power on her own, so she enters ready at 6 Might with Ganking),
  or Rengar (6 Might, Ambush) when Sivir is answered.
- **Tricks paid with Gold:** Punch First and Switcheroo in their combat, which Defy can't counter, without leaving
  runes up on our turn.
- **Fizz** on the turn it rebuys a Punch First for an attack.
- **Kill their Vex before playing a key unit** (Deflect: an extra Power to target her).
- **Why:** Power-costed tricks are cheap for this legend (each rune Power comes back as Gold), and a won fight is a kill
  that readies her again.

**2d. Lethal: the double conquest, with On the Hunt ×3.**
- **From 6:** Sivir, switched on, conquers A (7). On the Hunt ("Ready your units", 2 Power) readies her; she ganks to B
  and conquers it (8). The 7→8 conquest counts because A was scored this turn (`docs/rules-rulings.md`, 21 Nov).
- **Why On the Hunt rather than none:**
  - A unit moves by exhausting (§144), so without a readier each unit takes one battlefield a turn.
  - On the Hunt is the only readier Defy can't counter (Ride the Wind is 1 Power), and it readies every unit, so a
    second attacker joins.
  - Fizz can recast it (1 Energy).
  - Signatures run 3 or 0 in good finishes.
- **Without it,** the close needs two units conquering two battlefields, or a hold plus a conquest: slower, and more
  counterable.
- **What breaks it:** removal on Sivir before she swings (Falling Star, Hidden Blade), a stun from Vex, or a blocker
  bigger than 6 at B. So the second attacker (Rengar, Nidalee) matters.

**2e. Gives up, on purpose.**
- **Decks that won't fight:** Azir going wide behind Defy, and Mordekaiser's late game. Sideboard: Graves (hits every
  enemy at his battlefield), more Defy-proof answers (Rebuke).
- **An early Vex we can't kill:** sideboard more ways to kill a 4-Might Deflect unit.
- **Long grinds** against LeBlanc and Kai'Sa's 7–8 Might finishers: we aim to close by turn 7–8 and don't try to
  out-value them.

### 2a. My recommendation, with reasons (round 1, superseded) (26 Nov, Jay asked for help deciding; waiting on his words)

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
## 3. Worth doing, and roles (proposed 27 Nov, waiting on Jay)

**Worth doing:** it kills and wins fights where Trying Her Best bounces and holds, so the legend's second line ("when
enemy units die, ready me") fires and its Power-costed tricks come back as Gold. Unlike Evelynn's net deck, it spends
Power on won fights and a double conquest, not hidden value. It should beat the decks that fight for the board (Rengar,
Rek'Sai, LeBlanc, Evelynn, Diana), and stay even with the Defy decks, because its tricks cost 2 Power.

**Roles** (who has to force the game):

| deck | we are | why |
|---|---|---|
| Vex | beatdown | they're the control deck; every turn we give them, Vex stuns another unit |
| Kai'Sa | beatdown | their 7–8 Might finishers win long games; close by turn 7 |
| Master Yi | beatdown | Defy and Charm grind; make them use answers on our pace |
| LeBlanc | beatdown | value and big late units; don't trade into their grind |
| Diana | beatdown | tempo bounce; play cheap threats and fight before Hwei |
| Azir | beatdown | wide and Defy, and it gets better late |
| Mordekaiser | beatdown | 9-Energy finishers late |
| Rengar | control early, then beatdown | kill their 2-drops, then our tricks win the mid-game fights |
| Rek'Sai | control early, then beatdown | Flurry and kills against the 1-Might swarm, then race |
| Evelynn | control | same pool; we kill their hidden units, they don't fight well into tricks paid by Gold |
## 4. Goal tiers and yardstick (proposed 27 Nov, waiting on Jay)

**Yardstick: 3–0 at a Nexus Night.** The concept dies if it loses 3 of its first 5 logged games against the field it's
built for (gate 1's ten decks), or if the bench shows it closes no better than Trying Her Best and wins no more fights.

**Goal tiers, worked back from it**, each against Trying Her Best on the same games:
- **Tier 0, consistent (goldfish, `rift try --file`):** rules pass (`rift identity`); two units by turn 3 on 95%+ of
  draws; Mercenary on (2+ Power spent, turns 4–8) above Trying Her Best's 38%; Gold a game at least as high.
- **Tier 1, the plan works (model boards):** a winning line from 7 at least Trying Her Best's 32% (`--close`); search
  margin not worse with its interval (`rift search --file`); every key card actually cast (`rift trace`).
- **Tier 2, real games:** the journal, against the field. 3–0 nights are the goal; 3 losses in the first 5 kills it.

### Decisions, 27 Nov (Jay)

- **Sabotage is in:** "sabotage is fair and good, don't worry about what i've said before. i'm talking more about
  cheesy tricks".
- **From scratch:** "let's truly start from scratch here". The LA list stays only as the reference that `rift
  identity` counts changes against; past 16 we call it a new deck, and we expect to be.
- **Battlefields:** "i like sigil". So Sigil of the Storm (conquer → recycle a rune → the legend's Gold), Hallowed Tomb
  (brings Sivir back on a hold) and Hall of Legends (conquer → pay 1 to ready the legend → another Gold).
- **Curve:** "i also think we need to think about energy curves here" and "as long as we're looking at curves, not
  just averages … a certain amount of 2 drops (which can be a loose range), 3 drops, etc". Also: "units counts, pluss
  like spells and gear (we'll likely be light on gear) counts. these can be flexible but we def need enough units haha".

### Curve research (27 Nov)

#### What the curve research found
**How Energy grows** (`docs/rules.md`, §315.3.b, §487.7):
- You channel 2 runes a turn, ready, so you have 2, 4, 6, 8, 10, then 12 runes (the cap) on turns 1–6. Going second,
  you have 3 on turn 1.
- Every Power paid from a rune recycles it, so the next turn has one fewer.
- Energy isn't scarce; **cards are.** By turn 4 you've had 20 Energy but seen only about 8 cards. To spend it all, a
  card has to average about 2.5 Energy, and **turn 1 needs a 2-drop.**

**What wins in our colours** (good finishes since 23 Oct, average copies per list by Energy cost):

| | units at 2 / 3 / 4 / 5 / 6+ | spells at 1 / 2 / 3 | avg cost | at 2 or less | Power a list |
|---|---|---|---|---|---|
| Kha'Zix, the fight deck (25) | 8.2 / 6.0 / 3.6 / 3.5 / 0.3 | 5.3 / 6.0 / 4.4 | 2.70 | 19.5 | 23.4 |
| Evelynn, the hidden deck (31) | 2.8 / 10.2 / 5.6 / 3.9 / 1.1 | 3.6 / 2.3 / 5.4 | 3.18 | 9.5 | 16.0 |
| Sivir, non-Aurora good finishes (3) | 3.3 / 8.7 / 3.0 / 0.3 / 1.3 | 8.3 / 4.7 / 5.3 | 2.51 | 20.3 | 26.0 |
| every good finish (1,606) | 6.7 / 4.1 / 3.3 / 1.5 / 3.5 | 6.1 / 6.7 / 1.9 | 2.91 | 22.6 | 19.7 |

`docs/deckbuilding.md` §5: winners run slightly cheaper decks with more 2-drops (top 8s average 2.81, with 22.4 cards at
2 or less). Outside sources:
- Riot's primer: "a large number (9+) of 2–4 cost units, enough that you can reliably draw one by your first or second
  turn".
- Mobalytics: play an X-cost unit once you have X runes, and use most of your runes each turn.
- Shonen TCG (Rek'Sai): "at least nine 2-cost units" in the top lists.

**What that means for this deck:** a fight deck in our colours looks like Kha'Zix's: about 2.7 average, about 19–20
cards at 2 or less, and the most Power of any plan. That Power is what Battle Mistress pays back.

#### The curve as counts per cost, not an average (Jay: "a certain amount of 2 drops … 3 drops, etc")
Copies per Energy cost in good finishes since 23 Oct, as the median [10th–90th percentile range] across lists:

| | 2E units | 3E units | 4E units | 5E units | 6E+ units | 1E spells | 2E spells | 3E spells | 4E+ spells | gear |
|---|---|---|---|---|---|---|---|---|---|---|
| Kha'Zix (25), fight deck | 8 [8–9] | 5 [5–8] | 3 [3–5] | 4 [2–4] | 0 [0–1] | 5 [5–6] | 6 [5–7] | 4 [4–6] | 1 [0–1] | 3 [0–3] |
| Rengar (82, since Aug), Body fight deck | 9 [9–10] | 12 [10–12] | 6 [5–6] | 2 [1–2] | 1 [1–4] | 5 [4–6] | 3 [2–3] | 2 [2–3] | 0 | 0 |
| Evelynn (31), hidden deck | 3 [1–4] | 10 [3–15] | 5 [3–9] | 3 [1–5] | 0 [0–3] | 3 [2–6] | 2 [1–4] | 6 [4–7] | 0 [0–1] | 4 [1–7] |
| every good finish (1,606) | 8 [3–9] | 3 [1–8] | 3 [1–6] | 1 [0–4] | 3 [0–8] | 5 [3–11] | 7 [3–9] | 1 [0–4] | 0 [0–4] | 5 [0–8] |

The two fight decks agree on a tight 8–10 two-drops; Evelynn's hidden plan doesn't need them. 1-Energy units barely
exist (0 in every group).

**On-curve odds** (exact; the mulligan adds a little):
- **A 2-drop on turn 1:** 8 copies → 69% by card 5 on the play, 76% by card 6 on the draw; 10 → 78% and 85%.
- **A 3-drop by turn 2:** 6 → 71% by card 7; 8 → 82%.
- **A 4-drop by turn 3:** 4 → 61% by card 8; 6 → 76%.
- **A 5-drop by turn 4:** 3 → 55% by card 9; 5 → 74%.

**Proposed slot targets (loose ranges):**

| slot | target | fills it (candidates) |
|---|---|---|
| 2E units | **9–10** | early units: Shadow Order Disciple, Tideturner, Traveling Merchant, Staunch Survivor, Pit Rookie, Sneaky Zeebles |
| 3E units | **5–7** | Fizz ×3, Ezreal ×2, First Mate, Reckless Innovator, Nidalee |
| 4E units | **3–4** | Vex ×2 (plus Sivir in the Champion Zone, always available) |
| 5E+ units | **2–3** | Rengar ×2, Carnivorous Snapvine |
| 1E spells | **5–7** | Punch First ×3, On the Hunt (1E 2P), Sabotage, Flurry of Blades |
| 2E spells | **4–6** | Switcheroo, Challenge, Rebuke |
| 3E spells | **3–4** | Rampage ×3, Marching Orders |
| 4E+ spells | **0–1** | |
| gear | **0–2** | |

That's about 21–23 units and 15–17 spells: the Kha'Zix shape, with Sivir's turn-3 Accelerate as the 4-drop that
matters.

**Is the curve worth tuning? Tested within each legend.** Across the 34 legends with 5+ good and 5+ other recorded
finishes since August, I compared good finishes with the rest at every cost. The differences are all under a quarter of
a card and inside their 95% intervals (2-drops +0.12 ± 0.20; 1E spells +0.18 ± 0.19; every other slot within ±0.10).
So the curve comes with the plan, and its players converge on it; winners don't win by tweaking it, which matches
`docs/deckbuilding.md` §5. **Use the plan's peer ranges (the fight decks), and don't fuss over ±1 in a slot.**

**What the outside research says, the same logic by slot:**
- [Riftbound Guide](https://riftboundguide.com/2026/05/12/how-to-build-a-riftbound-deck/): 8–10 units at 1–2 Energy,
  6–8 at 3–4, 2–4 at 5+.
- [Riot's primer](https://riftbound.leagueoflegends.com/en-us/news/rules-and-releases/deckbuilding-primer): 9+ units
  at 2–4, "enough that you can reliably draw one by your first or second turn".
- [Mobalytics](https://mobalytics.gg/riftbound/guides/deckbuilding-fundamentals): a good number of 2-drops, preferring
  ones with no Power cost, since Power on turn 1 recycles a rune and costs turn 2. **Under Battle Mistress that recycle
  also makes a Gold**, so a Power-cost 2-drop (Staunch Survivor) costs us less than it costs others.
- **General TCG curve writing** (MTG aggro, scaled from 60 cards): most cards at 1–2, a handful at 3, almost nothing
  above; an average above 2.5 means midrange
  ([Draftsim](https://draftsim.com/mtg-aggro-deck/), [StarCityGames](https://articles.starcitygames.com/articles/building-good-aggro-decks/)).
  Riftbound's runes grow 2 a turn, not 1, so the same logic shifts up about one Energy; that's why 2-drops are our
  "1-drops".
- **[Miracle Sivir](https://riftbound.cardsrealm.com/en-au/articles/riftbound-deck-tech-miracle-sivir)** (Jan 2026,
  set 2, no list given, so it's dated): "Over half of this deck is cards you can play on the first few turns"; Gold
  tokens are "the main resource", spent on Punch First; and Sivir, Mercenary is "a bit expensive", not for turns 2–3.
  That last point is a test for us: **Sivir on turn 3 with Accelerate (costing 2 runes) against turn 4 without it.**
  The goldfish and `--close` compare both.

#### Units, spells and gear (Jay: "we def need enough units haha", "likely be light on gear")
Copies of each card type in good finishes, as the median [10th–90th percentile range]:

| | units | spells | gear |
|---|---|---|---|
| Kha'Zix (25), our colours' fight deck | 21 [20–23] | 16 [15–18] | 3 [0–3] |
| Evelynn (31), hidden deck | 24 [21–28] | 12 [9–15] | 4 [1–7] |
| Rengar (82, since Aug), all-unit fight deck | 30 [30–31] | 10 [9–10] | 0 |
| Sivir non-Aurora good (3) | 14 [14–22] | 20 [15–20] | 6 [3–6] |
| every good finish (1,606) | 20 [12–26] | 15 [10–22] | 5 [0–8] |

Within each legend, good finishes and the rest are identical on all three (units 0.00 ± 0.29, spells 0.00 ± 0.31,
gear 0.00 ± 0.21 over 34 legends). Again, the plan sets the split.

**Proposed: units 21–23, spells 15–17, gear 0–2.** Why not fewer units:
- every fight spell (Rampage, Challenge, Punch First, Switcheroo) needs a unit of ours on the battlefield to work;
- the double conquest needs units to hold one battlefield while Sivir takes the other;
- Rek'Sai's Cull the Weak makes us kill one of our units, and spare bodies protect Sivir;
- Vex stuns what we play, so units already on the board are worth more.

The 2-drops (9–10) alone keep the early board covered. Trying Her Best runs 22 units, for comparison. The draft is
checked on the goldfish's "two units by turn 3" (Trying Her Best: 98% on the play) and "units by turn 5".

#### The proposed curve, turn by turn (on the play)
- **Turn 1 (2 runes):** a 2-drop unit. With 10 of them, about 78% have one by card 5, more after the mulligan.
- **Turn 2 (4):** two 2-drops, or a 3-drop and a 1-Energy spell.
- **Turn 3 (6): Sivir with Accelerate.** 4E + 1E = 5 Energy, and 2 Chaos Power from recycling two of the exhausted
  runes. She enters ready at 6 Might with Ganking, and the first recycle makes a Gold. The cost: turn 4 has 6 runes,
  not 8.
- **Turn 4 (6–8):** Rengar (5E 1P) and a trick, or Fizz recasting Punch First, plus a 2–3 drop.
- **Shape:** about 10 two-drop units, about 6 three-drops (Fizz, Ezreal…), about 3–4 four-drops (Vex, First Mate is
  3), 2–3 at 5+ (Rengar), and about 14 spells, almost all at 1–3 Energy. Average about 2.6–2.7.
- **Power by domain:** Sivir and Accelerate need Chaos; Punch First, Rampage's +2 and Sabotage need Body. The rune
  split (LA ran 5 Body / 7 Chaos) is set at the draft from the Power counts, and checked with the goldfish's "stuck on
  colour".

## 5. Jobs and counts (proposed 27 Nov, waiting on Jay)

*Revised with the curve: the jobs fill the slot targets above (2-drop units 9–10, units 21–23, spells 15–17, gear 0–2).*

Copies by job, with the chance of one by the Nth card seen (exact; `lib/identity.mjs`, the theory doc's table). Sivir
starts in the Champion Zone, so she's always available and isn't counted as a draw.

| job | copies | odds | candidates (`decklab/sivir-scratch-cards.md`) |
|---|---|---|---|
| early unit (2 Energy or less) | 9 | 86% by card 7 | Shadow Order Disciple, Tideturner, Traveling Merchant, Staunch Survivor, Pit Rookie, Sneaky Zeebles |
| kill | 6 | 81% by card 9 | Rampage ×3; Challenge, Marching Orders, Flurry of Blades, Carnivorous Snapvine |
| fight trick, 2 Power | 6 | 76% by card 8 | Punch First ×3, Switcheroo ×3 (Hold 'Em, Grim Resolve, Primal Strength the 0–1 Power ones) |
| readier (the double conquest) | 5 | 78% by card 10 | On the Hunt ×3, First Mate ×2 (Ride the Wind, Portable Portal, Miss Fortune, Captain) |
| second closer | 4 | 66% by card 9, plus Sivir always | Rengar ×2, Nidalee ×2 (Lucian, Here to Help) |
| Fizz | 3 | 55% by card 9 | Fizz, Trickster |
| card flow | 4–5 | 66–74% by card 9 | Ezreal ×2, Yordle Explorer, Reckless Innovator, Spoils of War |
| disruption | 2 | | Vex, Apathetic |

That's 39–40 with overlaps (Ezreal is a 3-drop that draws). **Fizz's fuel** is every spell of 3 Energy or less (Punch
First, Switcheroo, Rampage, On the Hunt, Challenge): 12+ copies, so a target is usually in the trash by turn 4.

**Open for the draft:**
- Sabotage: it takes their Defy before a fight, has a +1.53 lift in Sivir's good finishes, and is a single strip,
  not a lock. Does it fit Jay's taste?
- Repulse to protect Sivir.
- The battlefields: Hallowed Tomb, which brings Sivir back on a hold, and Hall of Legends, a legend ready on each
  conquest, lead.
## 6. Cards by job (each labelled: proven here · crowd here · proven under X · theory)

The full review of every legal card (295, plus 67 battlefields) is `decklab/sivir-scratch-cards.md`: 9 in, 42
candidates, 244 out, each with its reason.
## 7. Audit (`rift identity` output, turns 1–4 on the play and on the draw)
## 8. Tests (each change, the same test)
## 9. Freeze and watch items
