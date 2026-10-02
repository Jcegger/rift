---
title: Kha'Zix Voidreaver — Champion Matchup Guide
subtitle: Riftbound, Vendetta season — every ranked archetype against Jun's midrange list, after the Los Angeles Regional
author: rift toolchain
date: 2026-10-01
---

**Your list:** `Kha'Zix Midrange (Jun, post-ban)` — 40 main, 12 runes (6 Body / 6 Chaos), 3 battlefields, 10 sideboard.
**Companion to:** the [midrange dossier](khazix-voidreaver-postban.md), which explains *why* the deck works. This page is only *who you are playing against*.
**Every Board line swaps one for one.** Decree of Strength lives in the board, so it is never a cut. The outs are reasoned from card text and the numbers here, not simulated; the dossier's §14 names the four patterns they follow.

---

## The headline: this is the Los Angeles list

The archive carries a deck titled **"Kha'Zix Top 32 Los Angeles RQ"**, dated 30 September. Compared card for card against the list in your app:

> **All 56 cards identical. No differences.**

So the list you are holding is the one that made Top 32 at a **2,165-player** regional — the largest field this archive has ever carried for the format. Treat the Top 32 as the **deck author's own claim**: it is in the title, not in an upstream result field (`tour: 0`, no placing recorded). The event and its field size are records; the finish is a claim.

What that changes: **stop treating this as a brew.** It has a regional result and the tuning is somebody's considered answer to this field, not a draft.

**And the deck is Tier 4.3** on riftbound.gg's list as of 1 October — down a tier after LA. Both things are true at once. It converts in the hands of someone who knows the matchups, and it does not convert on raw power.

---

## How to read a card

Every entry carries the same five lines.

**The numbers** are Monte Carlo at 120,000 trials, two of your units against two of theirs, drawn from your real Might distribution (24 units, mean 3.04) and theirs from the archive. Four columns:

| | |
|---|---|
| **bare** | a fair 2v2 with no trick — how often you simply win |
| **+PF** | with Punch First (+5) |
| **+Sw** | with Switcheroo, optimal swap |
| **iso** | two of yours against one of theirs, plus Kha'Zix's +2 |

**Flip safety** is the share of their archived lists holding a card that can **remove your unit from the board at Reaction speed** — bounce *or* kill. Either springs the §5 trap. The threat set is five cards: **Gust, Star-Crossed, Hidden Blade, Temporal Breach, Windsinger**.

**Two different tells.** Gust and Star-Crossed need **open runes**, which you count. Hidden Blade and Temporal Breach are `[Hidden]`, so they need a **facedown card**, which you can see — and Hidden Blade from hand is `[Action]`, so it cannot fire on your turn at all.

**Defy-proof.** Defy counters a spell at **≤4 Energy *and* ≤1 Power**. Your **Punch First** (2 Body) and **Switcheroo** (2 Chaos) walk through it forever. Void Assault, Star-Crossed and Rampage do not.

---

## Before the dice roll: which game is this?

Two questions, both answerable from their first two turns.

| if they… | you play | why |
|---|---|---|
| **cannot cover two battlefields** (few cheap units) | **take both, race** | 2 points a turn ends it in four |
| **cover two and out-grind you** (grind > 10) | **win one fight early, convert it** | you can neither spread nor wait |
| **cover two but you out-grind them** (grind < 10) | **hold one, refuse trades** | they need it short; you do not |

Your grind number is **12**. Never hold zero battlefields; never take a fight you have not rigged.

---

# Tier 1

## Irelia, Blade Dancer — Tier 1.1 · 4.4% · Calm/Chaos · mean Might 2.6

**Verdict: your best fair fight on the page, and one of your worst for flipping.**

**They play:** Defy 100%, Discipline 100%, Ride the Wind 100%, Stellacorn Herder 98%, Boots of Swiftness 98%, Defiant Dance 95%.
**Your numbers:** **56 bare** · 94 +PF · 98 +Sw · 96 iso.
**Flip safety: 66%** — Gust and Star-Crossed. Open Chaos is the tell.
**The plan:** the only archetype you beat more often than not with no trick at all. Their 2.6 mean is the smallest board you meet. **Keep the pumps, board the Switcheroo out** — against a flat board the swap has nothing to swap into. They out-grind you at 10.9, so do not let it go long: contest early and convert.
**Board:** +2 Gust, +1 Hard Bargain. −1 Switcheroo, −2 Star-Crossed — Gust does Star-Crossed's job against a 2.6 board for 1 Energy, without bouncing your own unit.

## Akali, Rogue Assassin — Tier 1.2 · 5.0% · Fury/Calm · mean Might 3.6

**Verdict: hardest quadrant on the page — but the only Tier 1 deck that cannot punish a flip.**

**They play:** Defy 100%, Shuriken Flip 96%, Discipline 90%, Zhonya's Hourglass 90%, Falling Star 86%, Stellacorn Herder 84%.
**Your numbers:** 32 bare · 84 +PF · **97 +Sw** · 92 iso.
**Flip safety: 0%.** One of only three. Hide and flip on curve.
**Attack on your own turn.** Their legend reads *"If it's **your** turn, move a friendly unit in a showdown to base"* — that is **their** turn. They can bail out of a losing fight they started; they cannot bail out of one you start.
**Akali, Silent cannot be touched outside combat** — *"I can't be chosen by enemy spells and abilities unless I'm in combat"*. She is 6 Might on the turn she moves in — her +2 reads *"when I move to a battlefield … this turn"* — and **4 sitting still on your turn**, which is when to fight her. Void Assault, Faefolk, Evelynn and Rampage all *choose*, so none of them reach her outside combat, and Rampage has no Action keyword, so it can never be cast inside one. **Switcheroo is `[Action]`** — play it in the combat showdown, where she can be chosen.
**Watch Falling Star:** 2E/2 Fury, *"Deal 3 to a unit. Deal 3 to a unit."* Two instances — both can hit Rengar.
**Their escapes cost them the battlefield.** Zhonya's and the legend both remove the unit from the fight, which leaves you the only player with units there — so you still win the combat and take the point. You win on points, not kills.
**Board:** +2 Ravenbloom Prefect, +2 Acceptable Losses (Zhonya's 90%), +1 Hard Bargain (for Defy). −2 Rampage, −2 Star-Crossed, −1 Up from the Deep — Rampage cannot reach Silent, Defy counters both spells, and Akali, Deadly Weapon's move ping and Shuriken Flip kill Tentacles for free.

## LeBlanc, Deceiver — Tier 1.3 · 3.9% · Mind/Order · mean Might 3.82

**Verdict: new to Tier 1 and absent from your dossier. Token-wide, Hidden-heavy, and Decree is live.**

**They play:** Soaring Scout 95%, Mirror Image 95%, Watchful Sentry 92%, Glasc Mixologist 92%, **Hidden Blade 90%**, Windswept Hillock 90%.
**Your numbers:** 29 bare · 79 +PF · **98 +Sw** · 90 iso.
**Flip safety: 92%** — Hidden Blade *and* Temporal Breach, both `[Hidden]`. **The facedown slot is the tell, not their runes.**
**The plan:** 7 cheap units and 4.1 token-makers per deck means they cover both battlefields; grind 12.2 means they beat you long. That is the hardest quadrant — **win one fight early and convert it**. 29% bare is near the bottom of the page, so nothing unrigged.
**Windswept Hillock gives units Ganking** — battlefield to battlefield movement, so their board repositions in ways yours cannot.
**Board:** **+1 Decree of Strength** (Mind/Order — live), +1 Hard Bargain, +1 Rampage. −1 Sabotage, −1 Tornado Warrior, −1 Traveling Merchant. Decree does Sabotage's job here and can take a unit; both their removal cards are Hidden, so Tornado Warrior is the flip to drop. Punch First stays — 79% is not a card you cut.

## Jayce, Defender of Tomorrow — Tier 1.4 · 4.1% · Mind/Body · mean Might 5.45

**Verdict: the biggest board you will meet. Win on the swap or not at all.**

**They play:** Platewyrm Egg 83%, Bellows Breath 78%, Garbage Grabber 73%, Flurry of Blades 73%, Catalyst of Aeons 73%, Sabotage 73%.
**Your numbers:** **15 bare** · **49 +PF** · **97 +Sw** · 71 iso.
**Flip safety: 44%** — Temporal Breach, `[Hidden]`. Facedown slot is the tell.
**The plan:** 1.5 cheap units per deck — **they cannot contest two battlefields early.** Take both and race; 2 points a turn ends it in four, and their grind of 15.9 is the highest in Tier 1, so a long game is theirs. Punch First at 49% is barely a coin flip; **Switcheroo is the matchup**, and you mulligan toward it.
**Keep Faefolk** — their small bodies exist to be swapped up.
**Board:** **+1 Decree of Strength** (Mind/Body — live), +1 Rampage. −2 Punch First.

---

# Tier 2

## Azir, Emperor of the Sands — Tier 2.1 · 4.2% · Calm/Order · mean Might 3.8

**Verdict: deferred, not slow. Equipment count is the size of their board.**

**They play:** Doran's Shield 98%, Eye of the Herald 98%, **Guards! 98%**, Hall of Legends 98%, Discipline 95%, B.F. Sword 95%. **7.1 token-makers per deck.**
**Your numbers:** **24 bare** · 85 +PF · 96 +Sw · **95 iso**.
**Flip safety: 93%** — **Hidden Blade**. The dossier said 0% for a long time and it was wrong.
**The tell that makes it playable:** Hidden Blade is `[Action]`, so from hand they can only cast it on *their* turn or in a showdown. Evelynn's trigger resolves on **your** turn before any showdown opens. **Empty facedown slot → flip freely.** Occupied → hide Switcheroo, which reads nothing off itself.
**The plan:** 0.3 cheap units means they cannot contest two early — **take both before Arise! lands.** `Arise!` plays a Sand Soldier **for each Equipment you control**; the legend also drips a token every turn they play an Equipment. **Killing gear shrinks their board in advance.**
**Board:** **+2 Ravenbloom Prefect, +2 Acceptable Losses** — this is the matchup the gear package exists for. −2 Rampage, −1 Tornado Warrior, −1 Traveling Merchant: Rampage trades Might into a bigger board, Hidden Blade makes Tornado Warrior the riskiest flip, and the Merchant does least in a race.

## Rengar, Pridestalker — Tier 2.2 · 3.1% · Fury/Body · mean Might 2.96

**Verdict: the best matchup on the page. They cannot punish a flip and you out-grind them.**

**They play:** Pit Rookie 100%, Inferna 100%, Irresistible Faefolk 100%, Nidalee Cat Form 100%, **Thrill of the Hunt 100%**, Punch First 97%.
**Your numbers:** **45 bare** · **96 +PF** · 97 +Sw · **98 iso**.
**Flip safety: 0%.** One of only three.
**The plan:** grind 8.0 against your 12 — **you win the long game.** 9.4 cheap units means they contest everywhere, so **hold one battlefield and refuse marginal trades.** Let them run out.
**Thrill of the Hunt is the trap**: `[Reaction]` banish a friendly unit, replay it to **any** battlefield ignoring its cost. It is not a threat to your flip — it is a 6-Might body arriving in a fight you thought you had counted. **Count it before you commit.**
**Board:** +1 Rampage. −1 Ride the Wind — you hold one and grind, so the repositioning card is the one you need least. (There is no second Switcheroo in the board to bring in.)

## Vex, Gloomist — Tier 2.3 · 5.2% · Calm/Chaos · mean Might 2.88

**Verdict: small, interactive, and happy to answer you. You out-grind it.**

**They play:** Back Off 94%, Vex Apathetic 94%, Defy 88%, Discipline 88%, Mutated Mouser 77%, Startipped Peak 73%.
**Your numbers:** **50 bare** · 90 +PF · 98 +Sw · 94 iso.
**Flip safety: 77%** — Star-Crossed and Gust. Count their Chaos.
**The plan:** grind 9.4 against your 12 — **hold one and grind.** Their 2.88 mean means Punch First decides most fights.
**The Vex mirror:** you play two yourself. Deflect taxes *opponents'* spells and abilities, so your Rampage into their Vex costs `[A]` more (§809) — and theirs into yours does the same.
**Kill their Vex, Apathetic before you play a unit.** *"When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn."* She only has to be *at a battlefield* — the unit you play can be anywhere, base included. While she stands, Rengar, an Ambush Kha'Zix and every other unit from hand arrive dealing no combat damage and unable to move. So the turn's order is: remove her, *then* deploy. Drag her into your biggest unit with Faefolk or Void Assault — both *choose*, so her Deflect charges you `[A]` — and **move the big unit first**: into an empty battlefield it takes control in a non-combat showdown, and Faefolk then walks in and pulls her. Move Faefolk first and she fights Vex alone at 1 Might, because nobody walks in once a fight has started (§144.1).
**Board:** +1 Hard Bargain (for Defy). −1 Ride the Wind.

## Kennen, Heart of the Tempest — Tier 2.4 · 6.6% · Order/Chaos · mean Might 3.32

**Verdict: the most-played deck you will face, and the one that answers everything.**

**They play:** Lightning Rush 98%, Traveling Merchant 91%, Ride the Wind 89%, Zaun Warrens 88%, Rhasa the Sunderer 86%, Fizz 85%.
**Your numbers:** 40 bare · 89 +PF · 97 +Sw · 94 iso.
**Flip safety: 97%** — **Gust, Star-Crossed *and* Hidden Blade.** The highest-coverage answer suite in the format, and it covers both tells at once: count runes *and* watch the facedown slot.
**The plan:** grind **17.0**, the second-highest on the page, against your 12. You cannot win long. 7.5 cheap units means you cannot spread either. **Win one fight early and convert it** — and refuse the trade, because an even trade pays them and costs you three things.
**Board:** +2 Gust, +1 Hard Bargain. −2 Star-Crossed, −1 Tornado Warrior — Gust does Star-Crossed's job for 1 Energy, and at 97% flip safety Tornado Warrior is the Hidden unit to drop.

## Rek'Sai, Void Burrower — Tier 2.5 · 3.3% · Fury/Order · mean Might 2.63

**Verdict: good on the numbers, worse in practice. Their units want to die.**

**They play:** Noxus Hopeful 100%, Cleave 97%, Cull the Weak 97%, Carrion Dredger 97%, The Candlelit Sanctum 94%, Honest Broker 94%.
**Your numbers:** **55 bare** · **97 +PF** · 98 +Sw · **98 iso**.
**Flip safety: 39%** — Hidden Blade. Lower than most, but not zero.
**The plan:** grind **1.8** — the lowest in the format against your 12. **Time is a weapon here.** 11.2 cheap units and 8 token-makers mean they cover everything, so hold one battlefield and let them exhaust themselves. **Killing their board is not beating them**, so prioritise holding over trading.
**Battlefield note:** Rek'Sai wants units returning home and **Star Spring's trigger is symmetric.** Bring Zaun Warrens or Sandswept Tomb instead.
**Board:** none. Extra removal is wrong against a deck paid for dying.

## Master Yi, Wuju Bladesman — Tier 2.6 · 7.6% · Calm/Body · mean Might 3.35

**Verdict: the single most-played archetype, and the one where your main plan backfires.**

**They play:** Defy 95%, Discipline 93%, Charm 91%, En Garde 84%, First Mate 83%, Zhonya's Hourglass 81%.
**Your numbers:** 39 bare · 85 +PF · 98 +Sw · 92 iso.
**Flip safety: 0%** — one of only three, and the one to know cold. **Their bounce is all friendly-only**, so the card you see is not the card that beats you.
**The isolation trap.** Their legend: *"While a friendly unit **defends** alone, it gets +2 `[M]`."* The board state your whole deck manufactures is the one that pays them — their +2 cancels Kha'Zix's exactly.
**The way out is the direction of the fight.** Do not attack into their lone unit — **drag it to yours.** The unit that moves in applies Contested and becomes the **attacker** (§190.3.a.1, §464.2.c.1), so their legend switches off while Kha'Zix's *"attack **or** defend"* still fires. Evelynn and Void Assault pull that way; walking over and attacking does not.
**Board:** +2 Ravenbloom Prefect, +2 Acceptable Losses (Zhonya's 81%). −1 Switcheroo (flat board), −2 Star-Crossed, −1 Rampage — Defy counters both. Void Assault stays: it is how you drag.

## Ezreal, Prodigal Explorer — Tier 2.7 · 2.1% · Mind/Chaos · mean Might 3.61

**Verdict: absent from your dossier. Every list answers a flip, and Decree is live.**

**They play:** **Stupefy 100%, Gust 100%, Wages of Pain 100%, Fizz 100%, Star-Crossed 100%**, Singularity 95%.
**Your numbers:** 32 bare · 85 +PF · 96 +Sw · 92 iso.
**Flip safety: 100%** — Gust, Star-Crossed *and* Temporal Breach. Tied with nobody; this is the worst flip matchup in the format alongside Diana.
**The plan:** 0.8 cheap units — **they cannot contest two battlefields.** Take both and race. Grind 9.7 is below your 12, so you are not under pressure to rush, but their interaction is total, so forcing them to answer two battlefields at once is better than forcing them to answer one card.
**Play the Hidden package as though you did not have it.** Switcheroo is the only safe hide.
**Board:** **+1 Decree of Strength** (Mind/Chaos — live), +1 Hard Bargain. −1 Evelynn, −1 Tornado Warrior — the Hidden units whose triggers must survive a Reaction they always hold. Punch First stays at 85%.

## Fiora, Grand Duelist — Tier 2.8 · 4.1% · Body/Order · mean Might 3.68

**Verdict: a standard midrange fight decided by whether you see the trick.**

**They play:** **Riposte 100%**, Sunken Temple 93%, Punch First 88%, Pit Rookie 83%, First Mate 73%, Fiora Victorious 73%.
**Your numbers:** 30 bare · 85 +PF · 97 +Sw · 93 iso.
**Flip safety: 59%** — Hidden Blade. Facedown slot.
**Riposte is the card to play around**: 2E/2 Chaos, `[Reaction]`, counters a spell **and** gives their unit +Might equal to that spell's Energy cost. Walking Punch First into it swings the fight both ways at once.
**The plan:** grind 6.5 against your 12 — **you win long.** Hold one, refuse trades.
**Board:** +1 Rampage, +1 Hard Bargain. −1 Tornado Warrior, −1 Ride the Wind. Hard Bargain also counters Riposte; Hidden Blade makes Tornado Warrior the flip to drop; you win long, so Ride the Wind goes.

---

# Tier 3

## Ornn, Fire Below the Mountain — Tier 3.1 · 1.8% · Calm/Mind · mean Might 2.24

**Verdict: the smallest board in the format, and it cannot punish a flip.**
**They play:** Defy 100%, Seal of Focus 100%, Guardian Angel 100%, Sprite Fountain 100%, Patched Porobot 100%, Poro Snax 94%.
**Numbers:** **66 bare** · 98 +PF · 97 +Sw · 98 iso. · **Flip safety 0%.**
Gear-heavy ramp with a 2.24 mean — your best raw matchup anywhere. Grind 14.7 means do not let it go long. **+2 Ravenbloom Prefect, +2 Acceptable Losses, +1 Decree** (Calm/Mind — live). −1 Switcheroo, −2 Star-Crossed, −1 Rampage, −1 Sabotage — the swap has nothing to swap into, Defy counters both spells, and Decree takes Sabotage's slot.

## Viktor, Herald of the Arcane — Tier 3.2 · 4.0% · Mind/Order · mean Might 3.31

**Verdict: 4% of the field, absent from your dossier, and 100% flip coverage.**
**They play:** **Hidden Blade 100%**, Cull the Weak 95%, Stupefy 90%, Viktor Leader 80%, Imperial Decree 73%, Bellows Breath 65%. **8.1 token-makers.**
**Numbers:** 38 bare · 89 +PF · 98 +Sw · 94 iso. · **Flip safety 100%** — Hidden Blade in every list.
Grind 6.9 — **you out-grind them**, so hold one and grind. **Never flip into an occupied facedown slot.** **+1 Decree** (Mind/Order — live), −1 Tornado Warrior.

## Kai'Sa, Daughter of the Void — Tier 3.3 · 1.5% · Fury/Mind · mean Might 3.55

**They play:** Falling Star 100%, Stupefy 100%, Thousand-Tailed Watcher 100%, Hextech Ray 93%, Kai'Sa Survivor 93%, Lecturing Yordle 93%.
**Numbers:** 35 bare · 83 +PF · 98 +Sw · 91 iso. · **Flip safety 67%** — Temporal Breach.
**Thousand-Tailed Watcher gives your units −3 Might on play** — a 7-Might body that also wipes your combat maths for a turn. Count it. **+1 Decree** (live), −1 Tornado Warrior.

## Lucian, Purifier — Tier 3.4 · 0.9% · Fury/Body · mean Might 3.2
**Numbers:** 38 bare · 94 +PF · 97 +Sw · 97 iso. · **Flip safety 0%.** Grind 5.8 — you out-grind them comfortably. Hold one, flip freely, win late.

## Mel, Soul's Reflection — Tier 3.5 · 1.0% · Mind/Chaos · mean Might 3.33
**They play:** Stupefy 100%, Star-Crossed 90%, Rebuttal 90%, Ride the Wind 90%, Gust 80%.
**Numbers:** 35 bare · 92 +PF · 96 +Sw · 96 iso. · **Flip safety 100%** — Gust and Star-Crossed. Grind 15.3, so do not go long. **+1 Decree** (live), −1 Evelynn.

## Lillia, Bashful Bloom — Tier 3.6 · 2.1% · Calm/Mind · mean Might 3.21
**They play:** Sprite Burst 95%, Defy 90%, Discipline 90%, Stupefy 90%, Dusk Rose Lab 90%. **9.4 token-makers — the most in the format.**
**Numbers:** 42 bare · 89 +PF · 97 +Sw · 94 iso. · **Flip safety 5%** — effectively safe to flip.
A token swarm that covers both battlefields. Hold one. **+1 Decree** (live), −1 Sabotage.

---

# Tier 4 and below, by how often you will see them

## Viktor and Zed are the two you will actually meet

**Zed, Master of Shadows — Tier 5.6 but 3.0% of the field**, more played than nine ranked above it.
**They play:** Death Mark 100%, Zaun Warrens 97%, Shadow Order Disciple 93%, Traveling Merchant 87%, Perfect Execution 83%.
**Numbers:** 35 bare · 89 +PF · 97 +Sw · 95 iso. · **Flip safety 57%** — Star-Crossed and Gust. Grind **18.2 — the highest in the format.** You cannot win a long game against this. Race it.

## Vi, Piltover Enforcer — Tier 4.1 · 2.1% · Fury/Order
**Numbers:** 36 bare · 91 +PF · 98 +Sw · 96 iso. · **Flip safety 57%** (Hidden Blade). Grind 5.7 — you out-grind them. Hold one.

## Diana, Scorn of the Moon — Tier 4.2 · 2.0% · Mind/Chaos
**Numbers:** 39 bare · 93 +PF · 97 +Sw · 96 iso. · **Flip safety 95%** — Gust, Star-Crossed, Temporal Breach. **Do not flip Evelynn into open Chaos, ever.** **+1 Decree, +1 Hard Bargain; −1 Evelynn, −1 Tornado Warrior.**

## Kha'Zix, Voidreaver — the mirror · Tier 4.3 · 1.5%
**Numbers:** 43 bare · 91 +PF · 98 +Sw · 95 iso. · **Flip safety 80%** — they hold Star-Crossed and Gust, because they are you.
**The mirror is decided by XP, not by board.** Both decks lose fair fights and both rig them. Whoever lands the first clean combat win compounds it into buffs. Isolation beats isolation: the player who makes the *other* one the attacker wins the exchange.

## Teemo, Swift Scout — Tier 4.7 · 1.5% · Mind/Chaos
**Numbers:** **61 bare** · 95 +PF · 98 +Sw · 97 iso. · **Flip safety 87%** — all four threat cards appear. A tiny board (2.51 mean) you beat straight, but every list answers a flip. **+1 Decree** (live), −1 Tornado Warrior.

## Nasus, Shen, Draven, Ambessa, Sett — 1.0–1.6% each
All within a few points of 36–43 bare, 76–97 with Punch First. **Nasus is the outlier: 76 with Punch First and 83 isolated**, the worst Punch First conversion on the page, because 3.65 mean with a 2 median means a few very large bodies. **Shen, Ambessa and Sett hold Hidden Blade** (50–90%). **Nasus is Mind — Decree live.**

## The worst board in the game is Tier 5

**Volibear, Furious — Tier 5.3, 0.7%, mean Might 6.46.**
**3% bare. 27% with Punch First.** 63% isolated plus Kha'Zix. There is no fair fight here at any point — **97% with Switcheroo** is the entire matchup. You will almost never see it, but if you do, the swap is not a nice-to-have.

---

## Quick reference

### Flip safety — can they punish a Hidden flip?

| safe (0%) | low | high | total |
|---|---|---|---|
| **Akali · Master Yi · Rengar** · Ornn · Lucian · Volibear · Jax · Lee Sin | Lillia 5% · Rek'Sai 39% · Jayce 44% | Vi 57% · Zed 57% · Fiora 59% · Irelia 66% · Vex 77% | **Ezreal 100% · Viktor 100% · Mel 100% · Kennen 97% · Diana 95% · Azir 93% · LeBlanc 92%** |

### Where Decree of Strength is live

**31% of the ranked field is Mind** — far more than the two archetypes the dossier names.

**Tier 1–3:** LeBlanc (1.3) · Jayce (1.4) · Ezreal (2.7) · Ornn (3.1) · Viktor (3.2) · Kai'Sa (3.3) · Mel (3.5) · Lillia (3.6)
**Below:** Diana · Teemo · Nasus · Lux · Jhin · Rumble · Ahri · Renata Glasc

**This changes the sideboard case.** The dossier cut Decree to one copy because it was live against two of eleven archetypes. Across the real field it is live against roughly a third, including **two Tier 1 decks**. The second copy is worth re-testing.

### Who out-grinds you (your grind is 12)

**They win long:** Zed 18.2 · Kennen 17.0 · Jayce 15.9 · Mel 15.3 · Nasus 15.1 · Ornn 14.7 · Akali 14.2 · Kai'Sa 12.4 · LeBlanc 12.2
**You win long:** Rek'Sai 1.8 · Sett 4.4 · Ambessa 5.1 · Draven 5.2 · Vi 5.7 · Lucian 5.8 · Fiora 6.5 · Viktor 6.9 · Ivern 7.8 · Azir 7.9 · Rengar 8.0 · Vex 9.4

### Who cannot contest two battlefields

**Azir 0.3 cheap units · Ezreal 0.8 · Volibear 0.9 · Jayce 1.5 · Miss Fortune 2.9.** Against these, take both and race.

---

## Sources and method

**Archetype data** is `data/decks.json` restricted to **992 decks dated 2026-09-24 to 10-01**, with the **2026-09-23 bulk-import day excluded**. That day is 901 decks posted in a few minutes and it skews every share it touches — with it in, Punch First reads 12% and Cleave 22%; with it out, 20% and 9%, which agrees with the independent 18–20 September snapshot the dossier uses. Archetypes with fewer than 6 archived lists are omitted.

**Tier placement** is riftbound.gg's Vendetta list scraped **2026-10-01** — 49 ranked archetypes. The list moved after Los Angeles: Kennen fell out of Tier 1, LeBlanc and Jayce entered it, and Kha'Zix sits at **4.3**.

**The Los Angeles claim** is the deck author's, carried in `ce`/`cp` and not in an upstream result field. `data/events.json` independently records the **Riftbound Regional Qualifier – Los Angeles, 26 September, 2,165 players**. The event and its size are records; the Top 32 finish is a claim, and the card-for-card match against your list is this repo's own comparison.

**Simulations** are Monte Carlo at 120,000 trials implementing §465.2 and §466.3 directly: a clean win when your Might total strictly exceeds theirs. Your distribution is the 24 units of the current list weighted by copies (mean 3.04); theirs is each archetype's units in the archive weighted by copies.

**Flip safety** counts cards that remove an **enemy** unit from the board at **Reaction** speed — bounce or kill, hand-checked rather than pattern-matched: **Gust, Star-Crossed, Hidden Blade, Temporal Breach, Windsinger**. Retreat and Mesmerize are excluded because their bounce is friendly-only.

**What this page does not claim.** Shares below about 2% rest on 10–20 decks and should be read as shape rather than measurement. The archive is still rebuilding after an upstream feed change and holds 8 days rather than the 60 its window declares, so **ordering is reliable and small gaps are not.** Nothing here claims the deck is good — it claims the deck has a regional result and a knowable set of matchups.
