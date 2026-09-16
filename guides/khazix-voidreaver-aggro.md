---
title: Kha'Zix Voidreaver — Aggro Dossier
subtitle: Riftbound, Vendetta season — Jun's aggressive build, after the 18 September bans
author: rift toolchain
date: 2026-09-16
---

**Legend:** Voidreaver (Body/Chaos) · **Champion:** Kha'Zix, Mutating Horror
**Registered:** 40 main (Champion included) + 12 runes (6 Body / 6 Chaos) + 3 battlefields + 1 legend = 56 · **Sideboard:** 10 of 10
**Shuffled library:** 39 — the Champion starts outside the deck (rule 103.2.a.1)
**Collection status:** 2 cards still to get, $41.58 gap
**Built from:** Jun's post-ban aggressive list, 16 September — saved in the app as `Kha'Zix Aggro (Jun, post-ban)`

**This is a companion to the [post-ban midrange dossier](khazix-voidreaver-postban.md), not a replacement for it.** The two lists share 34 of 40 cards, the same legend, the same rune base and the same sideboard. Everything that dossier establishes about combat resolution (§4), the XP rules (§2), keywords (§6) and the clean-win maths still applies here unchanged, and is not repeated. This page is about the six cards that differ and what they change.

---

## The short version

*Everything here is expanded below.*

**The six-card swap.** −3 Traveling Merchant, −2 Zed Without a Sound, −1 Onslaught, +3 Mister Root, +2 Ride the Wind, +1 Rengar Trophy Hunter. That is the whole difference.

**It is not an aggro deck.** Average Energy is **2.65**. Akali sits at 2.59, Master Yi at 2.43, Irelia and Azir at 2.22. Measured against the decks that actually attack in this format, this list is *slower than all of them*. Calling it "aggro" sets you up to lose races you should never have entered. It is the **proactive** Kha'Zix build — the one that generates its own resources instead of waiting to win a fight.

**What it actually does differently.** The midrange list earns XP the way the legend intends: win a combat, gain 1. This one adds **Mister Root, which gains 2 XP every time it moves to a battlefield** — twice a combat win, for no combat at all — and three Ride the Wind to move it. Six movement cards against nine payoffs, where midrange has four.

**Two things it is strictly better at.** Showdown density is **8 copies against midrange's 6**, and with Onslaught gone **every one of your 18 spells is inside Fizz's 3-Energy rebuy range** — the hole the midrange dossier names in its §1 does not exist here.

**Two things it is worse at.** The trash economy loses its best filler and one whole spender: no Traveling Merchant looting on every move, no Shadow Clone banishing from the bin. And the **Body squeeze gets worse** — Power demand on Body rises to 11 against a 6-rune base, because the third Rengar costs Body and nothing that costs Body was cut.

**Who it is for.** It beats the ramp and the big-unit decks more reliably than midrange does, and it loses to Master Yi and Akali by more. Since those two are 13.5% of the archive against the other two's 7.4%, this is the build you register when you know your room, not the one you register blind.

**It is also the easier deck to pilot**, and that is not a consolation prize — see §9.

---

## The list

Sorted by set number, the way you build it. **Kha'Zix counts toward the 40 but starts outside the shuffled pile**, so you sleeve 39 and set him next to the legend.

| | Card | Number | Cost |
|---|---|---|---|
| 2 | Sabotage | OGN-156 | 1E / 1 Body |
| 3 | Ride the Wind | OGN-173 | 2E / 1 Chaos · Action |
| 3 | Punch First | SFD-097 | 1E / 2 Body · Action |
| 3 | Fizz, Trickster | SFD-140 | 3E / 1 Chaos · 3 Might |
| 2 | Kinkou Initiate | UNL-097 | 3E · 3 Might |
| 3 | Irresistible Faefolk | UNL-112 | 2E · 1 Might |
| 3 | Rengar, Trophy Hunter | UNL-120 | 5E / 1 Body · 6 Might |
| 3 | Mister Root | UNL-127 | 2E · 1 Might · Accelerate |
| 2 | Star-Crossed | UNL-128 | 3E / 1 Chaos · Reaction |
| **1** | **Kha'Zix, Mutating Horror** | **UNL-143** | **4E / 1 Chaos · 4 Might — Champion Zone** |
| 2 | Vex, Apathetic | UNL-150 | 4E · 4 Might |
| 3 | Void Assault | UNL-202 | 2E / 1 Power |
| 2 | Rampage | VEN-083 | 3E |
| 3 | Shadow Order Disciple | VEN-095 | 2E · 2 Might |
| 3 | Up from the Deep | VEN-100 | 3E · Flow 3E |
| 2 | Tail-Cloaked Matriarch | VEN-104 | 4E · 4 Might |

**Legend** Voidreaver `UNL-201` · **Runes** 6 Body `OGN-126` / 6 Chaos `OGN-166`
**Battlefields** Zaun Warrens `OGN-298` · Forbidding Waste `UNL-210` · Sandswept Tomb `VEN-164`

**Sideboard** — 2 Gust `OGN-169` · 2 Hard Bargain `SFD-136` · 1 Unyielding Spirit `OGN-145` · 1 Sabotage `OGN-156` · 1 Acceptable Losses `OGN-179` · 1 Switcheroo `SFD-145` · 1 Angler Beast `UNL-132` · 1 Ravenbloom Prefect `VEN-102`

22 units / 18 spells. **Sabotage (2 + 1) sits exactly at the three-copy cap** across main deck and sideboard.

---

## 1. What this deck is, and what it is not

It is called the aggressive build and it is not an aggressive deck. That is worth settling before anything else, because the name will cost you games.

Average main-deck Energy, measured across every archetype in the 1,184-list snapshot that carries a tournament result:

| Archetype | avg Energy |
|---|---|
| Azir, Emperor of the Sands | 2.22 |
| Irelia, Blade Dancer | 2.22 |
| Diana, Scorn of the Moon | 2.38 |
| Master Yi, Wuju Bladesman | 2.43 |
| Rek'Sai, Void Burrower | 2.57 |
| Akali, Rogue Assassin | 2.59 |
| **This list** | **2.65** |
| Kha'Zix midrange (Jun) | 2.77 |
| LeBlanc, Deceiver | 3.59 |
| Jayce, Defender of Tomorrow | 4.01 |

**Every deck in this format that is trying to race is faster than you are.** Against Akali you are the slow deck. Against Master Yi you are the slow deck. The curve is 1:5 · 2:15 · 3:12 · 4:5 · 5:3, and the fifteen two-drops look like a beatdown deck until you notice that nine of them are units with 1 or 2 Might whose job is to enable a move, not to attack.

What the list actually is: the configuration of Kha'Zix that **manufactures its own XP** rather than waiting for the legend to pay out. It is proactive, not fast. Every plan that follows from "I am the beatdown" is wrong here; every plan that follows from "I choose when the fights happen" is right.

---

## 2. The six cards

```
out                          in
3 Traveling Merchant   ->    3 Mister Root
2 Zed, Without a Sound  ->   2 Ride the Wind  (a third copy; midrange runs one)
1 Onslaught             ->   1 Rengar, Trophy Hunter  (a third copy; midrange runs two)
```

Thirty-four cards are identical, including the entire rune base, all three battlefields and all ten sideboard slots. Everything this dossier says about the deck's identity rests on six cards, so they are worth reading individually.

**In — Mister Root ×3** (2E / 0 Power · 1 Might · Chaos). *"[Accelerate] (You may pay 1 Energy + 1 Chaos as an additional cost to have me enter ready.) When I move to a battlefield, gain 2 XP."*

The card the build is named around, whatever the label says. **Two XP per move is twice what winning a combat pays**, and it does not require a combat, an opponent's mistake, or a surviving unit. With three Ride the Wind and three Void Assault in the same list, a Mister Root that lives two turns is four to six XP the midrange build simply cannot generate.

Accelerate is a real decision each time and not a formality: paying 1 Energy and a Chaos rune to enter ready means it can move the same turn it lands, which converts the 2 Energy body into 2 XP immediately. The Chaos is the part that hurts — see §5.

**In — Ride the Wind, second and third copies** (2E / 1 Chaos · Action). *"Move a friendly unit and ready it."* The midrange dossier covers the single copy in its §6. At three it stops being a trick and becomes the deck's tempo engine: it is simultaneously a Mister Root trigger, a Shadow Order Disciple trigger, an Irresistible Faefolk trigger, an escape hatch, and a way to attack twice.

**In — Rengar, third copy** (5E / 1 Body · 6 Might · Ambush). The largest body in either list, and the only card that can open a battlefield where you have nothing. Three copies means the Rengar → Kha'Zix chain is live far more often — and it means one more Body rune of demand on a base that cannot afford it.

**Out — Traveling Merchant ×3** (2E · 2 Might). *"When I move, discard 1, then draw 1."* Losing this is the single biggest cost of the swap and it is easy to under-rate. Merchant is the deck's only repeatable selection *and* its best trash filler, and the aggro list replaces it with a card that generates XP but no cards at all.

**Out — Zed ×2** (5E · 5 Might). A 5-Might body that survives the format's cheap removal, a token generator, and an escape hatch via the Shadow Clone swap. Its absence is felt most in exactly the matchups this build is already worst at — see §10.

**Out — Onslaught ×1** (4E / 0 Power, Flow 4E). The biggest number in the deck, and the only spell outside Fizz's range. Losing it costs reach and gains consistency; §4 argues the trade is good.

---

## 3. The engine: XP you make rather than XP you win

Voidreaver reads: *when you win a combat, gain 1 XP; spend 1 XP to buff a unit permanently; spend 2 XP to walk an exhausted unit home.* It spends **once per turn** and only in your own Main Phase. That is the ceiling both builds live under.

The midrange list has exactly one XP source: winning combats. Which means the midrange list cannot start buffing until it is already winning fights — and the midrange dossier's §2 says plainly that an even trade pays nothing.

This list has two. Count the movement:

| | movers | payoffs |
|---|---|---|
| **This list** | 3 Void Assault, 3 Ride the Wind = **6** | 3 Mister Root, 3 Shadow Order Disciple, 3 Irresistible Faefolk = 9 |
| Midrange | 3 Void Assault, 1 Ride the Wind = **4** | 3 Traveling Merchant, 3 Shadow Order Disciple, 3 Irresistible Faefolk = 9 |

Nine payoffs in both lists; **six movers against four**. And one of those payoffs pays in the legend's own currency. The practical consequence is that this build can be buffing on turn three off a Mister Root that has moved once, in a game where it has not yet won a single combat — and a permanent +1 Might on a 2-drop is how you start winning the combats that pay the rest.

**The discipline this demands:** the legend exhausts to spend, so XP you bank is XP you are not using. Mister Root makes it much easier to have XP than to have a turn to spend it. If you find yourself sitting on 4 XP, you have misplayed the previous two turns — not the current one.

---

## 4. What this build is strictly better at

Two things, and both are structural rather than matchup-dependent.

**Showdown density: 8 copies against 6.**

| | Actions | Reactions | total |
|---|---|---|---|
| **This list** | Punch First ×3, Ride the Wind ×3 | Star-Crossed ×2 | **8** |
| Midrange | Punch First ×3, Ride the Wind ×1 | Star-Crossed ×2 | **6** |

Plus Kha'Zix and **three** Rengar arriving at Reaction timing on Ambush, against midrange's two. In a format where the two most-played decks both hold three Defy and three Discipline, being the deck with more to do inside a showdown is worth a great deal.

**Fizz reaches every spell you own.** The midrange dossier's §1 concedes a hole: *"Onslaught is the only card in the deck Fizz cannot reach."* With Onslaught cut, **all 18 spells cost 3 Energy or less** and every one is a legal Fizz target. Three Fizz at 100% coverage is a meaningfully better card than three Fizz at 94%, and it makes the trash a genuinely general resource rather than one with a known gap.

---

## 5. What this build gives up

**The trash economy loses a filler and a spender.** The midrange dossier's §7 counts six filler copies against ten spenders. Here:

| | fills the trash | spends it |
|---|---|---|
| **This list** | Shadow Order Disciple ×3, Zaun Warrens | Fizz ×3, Tail-Cloaked Matriarch ×2, Up from the Deep ×3 |
| Midrange | Shadow Order Disciple ×3, Traveling Merchant ×3, Zaun Warrens | the same, plus Onslaught's Flow and Zed's Shadow Clone |

Three filler copies against eight spenders, where midrange has six against ten. **Burn matters more here and you have fewer ways to do it.** The midrange default of *don't Burn unless a spender is in hand* becomes closer to *Burn when the spender is in hand and you can afford the card*, because Shadow Order Disciple is now carrying the fill side almost alone.

**The Body squeeze gets worse.** Single-domain Power demand across the main deck:

- **Body: 11** — Punch First ×3 at 2 each, Sabotage ×2, **Rengar ×3**
- **Chaos: 9** — Ride the Wind ×3, Fizz ×3, Star-Crossed ×2, Kha'Zix

Against **6 Body runes and 6 Chaos runes**. Midrange's Body demand is 10; the third Rengar takes it to 11, and nothing that costs Body was cut to pay for it. Mister Root's Accelerate wants a Chaos rune on top of that.

The practical rule, and it is the single most common way to misplay this list: **count Body before you commit anything else.** Three Punch First and three Rengar cannot all be cast in a game where you draw them, and deciding which one the Body is for is a real decision on most turns.

**You lose the two bodies that survive removal.** Zed at 5 Might lived through a Void-Gate'd Falling Star. Unit Might in this list: **9 units at ≤2, 5 at exactly 3, 5 at 4–5, 3 at 6+.** Fourteen of your twenty-two units die to a single cheap spell in the Akali matchup, and the three that comfortably do not are all the same card.

---

## 6. How the cards combine

**Everything in the midrange dossier's §8 applies here**, including the Rengar → Kha'Zix chain, the Forbidding Waste four-point swing, Sandswept Tomb as the rune fix, Sabotage taking a Defy before you commit, rule 186.1 on bounced tokens, and both of the traps. What follows is what is specific to these six cards.

### Mister Root + Ride the Wind — the two-card XP engine

Play Mister Root. Move it with Ride the Wind: **2 XP, and it is ready again**. That is the line the whole build exists for, and it is available on turn three off two 2-Energy cards with no opponent interaction required.

Accelerate makes it a one-card version at a price: pay 1 Energy and a Chaos rune, Mister Root enters ready, move it the same turn, 2 XP immediately. Whether that is worth a Chaos rune depends on whether Ride the Wind or Fizz needs the rune more this turn — see §5.

### Ride the Wind + Rengar — attacking twice

Rengar ambushes into a fight at Reaction speed. Ride the Wind readies him afterwards. A 6-Might body that has already been in one combat and can enter another is the largest tempo swing in the list, and it is the closest this deck comes to actually being aggressive.

### Mister Root + Forbidding Waste — the one to be careful with

Mister Root is a 1-Might unit whose whole purpose is to arrive at battlefields. The Waste gives **-2 Might to any unit defending alone**, which takes a lone Mister Root to -1.

**That does not kill it by itself.** Rule **142.4.b**: *"Lethal Damage for a Unit is a non-zero amount greater than or equal to that Unit's Might,"* and its own example is a 0-Might unit, which *"must have at least 1 damage marked on it"* to have lethal damage. A unit at zero or below with nothing marked on it is alive — which is also why Scuttle Crab at 0 Might is a real card.

What it does mean is that **any damage at all is lethal**, and a defender at -1 Might loses every combat it is in. Moving Mister Root to the Waste is fine on your turn; leaving it there alone into their turn is how you hand over the engine for one Shuriken Flip.

### Three Rengar and the Body rune

Nothing combines badly here so much as competes. Rengar costs 1 Body, Punch First costs 2, and both want the same six runes. **Holding a Rengar for Ambush and a Punch First for the showdown needs 3 Body in one turn — half your base.** Plan the turn around which one is the payoff, not both.

---

## 7. Mulligans

The midrange dossier's §9 numbers were simulated against a list with three Traveling Merchant and two Zed. The threshold it lands on — *one 2-drop, plus a way to use it* — holds here and is easier to meet: **fifteen of the forty cards cost 2**, and nine of those are units.

**What changes:**

- **Keep any hand with Mister Root and a mover.** That is a functional keep on its own, whatever else is in it, because it is the only two-card sequence in the deck that generates a resource without needing the board to co-operate.
- **Ship spell-flooded hands harder than midrange does.** With Traveling Merchant gone you have no way to convert excess spells into cards. A hand of four spells is four spells for the rest of the game.
- **Do not ship a Void Assault or a Ride the Wind.** Six cards choose where the fight happens; half of your opening hands will have none.
- **Rengar at three is not a keep-all.** Two Rengar and no two-drop is still a mulligan — 10 Energy of top end in a four-card hand, on a Body base that cannot cast both.

**The test, unchanged from the midrange dossier and still the right one:** *by turn three, can I see a fight I win outright?* Not one I can take — one where every enemy unit at that battlefield dies and one of mine lives.

---

## 8. Sequencing

The order is the same as the midrange dossier's §10 — *activate, buff, develop, arrange, move, then hold up everything with Action or Reaction on it* — with one insertion.

**Step 3.5 — move Mister Root before you arrange the fight.** Its 2 XP is a Main Phase resource, and the legend's activation happens at Step 1. If you move Mister Root after you have already activated, the XP sits unusable until next turn. On a turn where you plan to move Mister Root at all, you are choosing between:

1. Activate first, spend the XP you already had, then move Mister Root and bank the 2.
2. Move Mister Root first, then activate with 2 more XP available.

**Option 2 is right more often than it looks**, because the legend spends only once per turn either way, and a buff is permanent. The exception is when the buff is what makes the fight winnable — then it has to be Step 1, because a buff applied after the showdown opens is not a legal play.

**Step 5 — what you hold up.** Punch First ×3 and Ride the Wind ×3 at Action speed, Star-Crossed ×2 at Reaction, plus Kha'Zix and three Rengar on Ambush. Eight spell copies and four bodies. **Void Assault, Up from the Deep, Sabotage and Rampage carry no keyword** and are Main-Phase setup only.

Note what having three Ride the Wind does to this step that midrange cannot do: you can hold up a card that *changes where the fight is* rather than only how big your unit is. Against a deck that commits to a battlefield expecting a combat, moving your unit out is often better than winning the fight.

---

## 9. Piloting — why this is the easier of the two

This is worth stating with numbers, because it is a real argument and not a soft one.

| | midrange | this list |
|---|---|---|
| trash-dependent copies | 11 across 5 cards | **8 across 3** |
| activated abilities | Zed's clone swap | Mister Root's Accelerate |
| Reaction-speed cards | 5 | 6 |

The counts are close. The **kind** of decision is not.

Midrange's hard cards defer: Zed makes a Shadow Clone and then has an ability that swaps their positions, Tail-Cloaked Matriarch rebuys from a trash you stocked three turns ago, Onslaught has Flow from that same trash. Those decisions depend on board and bin state you created earlier, and a misplay does not announce itself until later.

This list's added complexity is Mister Root's Accelerate — *pay 1 Energy and a Chaos rune to enter ready?* — asked and answered on the spot, three times a game. The same volume of choices, far less state to carry between turns.

**If you play this list noticeably better than the midrange one, that is a legitimate reason to register it**, and it can outweigh a matchup edge of a few percent. A deck you pilot cleanly beats a deck that is theoretically better and that you misplay once a round.

---

## 10. Matchups

Shares are actual counts from the 1,184-list snapshot of 16 September. All seven board plans use the ten cards in §11 — the same ten as the midrange list.

### Master Yi, Wuju Bladesman — 9.0%, and the worst matchup in the format for this build

Everything the midrange dossier says applies, and two things are worse.

Their legend reads *"while a friendly unit defends alone, it gets +2 Might"* and yours pays out when *an enemy unit is alone* — you spend cards manufacturing the board state that rewards them for free. That is true of both builds. What is specific here: **you cut the two cards that beat them in a long game.** Zed at 5 Might outlives their removal and Traveling Merchant refuels; this list has neither, and its replacement resources are XP rather than cards.

Their three Defy also bite harder. Midrange has six showdown-legal spells of which three are Defy-immune Punch First; this list has eight of which three are. **Five of your eight held-up cards can be countered**, against midrange's three of six.

*In:* Hard Bargain ×2, Gust ×2, Angler Beast ×1, Sabotage ×1. *Out:* Rampage ×2, Star-Crossed ×1, Tail-Cloaked Matriarch ×2, Kinkou Initiate ×1.
**Leave Unyielding Spirit out** — Charm, Defy, En Garde and Discipline are moves, counters and pumps. There is no spell damage to prevent.

### Akali, Rogue Assassin — 4.5%, the best result set in the archive

Shuriken Flip for 2, Falling Star for 3 twice, Mischievous Marai for 2 on arrival, and 71% of their best lists run Void Gate — *"spells and abilities affecting units here each deal 1 Bonus Damage."* With the Gate up, Shuriken Flip kills a 3-Might unit and each half of Falling Star kills a 4.

**Fourteen of your twenty-two units die to one cheap spell**, and Mister Root — the engine — is a 1-Might body that dies to everything. This is the matchup where the six-card swap costs you most: you gave up the two most resilient bodies in the archetype to a deck whose entire plan is killing small ones.

**Unyielding Spirit is the best card you can bring and you have one.** It blanks their whole removal suite for a turn including the Gate bonus.

*In:* Unyielding Spirit ×1, Hard Bargain ×2, Gust ×2, Ravenbloom Prefect ×1, Acceptable Losses ×1. *Out:* Rampage ×2, Up from the Deep ×2, Star-Crossed ×2, Kinkou Initiate ×1.

### Jayce with Dazzling Aurora — the matchup this build is *for*

Four units in the entire deck and payoffs at 9 and 12 Energy. Enemy units are almost always alone, so **Kha'Zix's bonus is live essentially every turn**, and every turn you take is one closer to Aurora flipping free units off the top at each end step.

This is where six movers beat four. You are not racing them so much as conquering repeatedly before the engine assembles, and the XP that Mister Root generates while you do it converts into permanent buffs that make the next conquest cheaper. **The midrange list wins this too, more slowly; this one wins it before the question is asked.**

*In:* Ravenbloom Prefect ×1, Acceptable Losses ×1, Sabotage ×1, Hard Bargain ×2. *Out:* Rampage ×2, Up from the Deep ×1, Star-Crossed ×2.
Ravenbloom Prefect banishes a gear **as it is played**, so it has to be on the board before the Aurora resolves — deploy it turn three and hold it.

### LeBlanc, Deceiver — 4.3%

Twenty-nine units, a curve that peaks at 3 and then gaps entirely at 4 before six cards at 8 Energy. A deck with a hole in the middle and a slow top end is a deck you attack through the hole. You cannot out-grind Ruined Rex and Harnessed Dragon, so do not try.

*In:* Gust ×2, Angler Beast ×1, Hard Bargain ×2. *Out:* Rampage ×2, Sabotage ×2, Kinkou Initiate ×1.

### Kennen, Heart of the Tempest — 6.3%, and much diminished

Stacked Deck was in 16 of their 17 archived top-8 lists at ~2.9 copies and the ban named their legend as the reason. They keep Lightning Rush, so they kept an engine, but this is no longer the deck to beat. Vex remains your best card — every unit they deploy arrives stunned and their whole plan is deployment.

*In:* Hard Bargain ×2, Gust ×2. *Out:* Rampage ×2, Sabotage ×2.

### Rek'Sai, Void Burrower — 5.4%, untouched by the bans

Wide, small, no counterspells, and an engine that runs on revealing the top of its own deck. **Angler Beast is excellent and Hard Bargain is dead** — leave the counters in the box. The reveal engine means they are ahead on cards in a long game and behind on board in a short one, which is the argument for this build over midrange in the matchup.

*In:* Gust ×2, Angler Beast ×1, Switcheroo ×1. *Out:* Rampage ×2, Sabotage ×2.

### Azir, Emperor of the Sands — 2.8%

A token swarm that counts equipment, not a big-equipped-threat deck. Vex stuns every Sand Soldier as it arrives; **Angler Beast sweeps a board of 1-Might tokens without catching much of yours**, which is the one matchup where its symmetry does not hurt. Remember rule 186.1: bounced tokens cease to exist, so Gust and Star-Crossed are hard removal here rather than tempo.

*In:* Gust ×2, Angler Beast ×1, Hard Bargain ×2. *Out:* Rampage ×2, Up from the Deep ×2, Kinkou Initiate ×1.

---

## 11. The sideboard

**Identical to the midrange list's ten**, and the reasoning in that dossier's §12 stands unchanged — including the correction that Unyielding Spirit was cut from an earlier board against a field that had no spell damage in it, and that the field has since changed.

One thing is different here and it is a scheduling problem. Against Master Yi and Akali the cards that want to come in total ten, and this list has **less it can comfortably cut** than midrange does: the top end is three Rengar you need, and the two-drops are the engine. The realistic cut list is Rampage ×2, then Star-Crossed, then Kinkou Initiate, then Up from the Deep — and past that you are cutting things that make the deck work.

Priority when you cannot fit all ten: **Hard Bargain, then Unyielding Spirit (Akali only), then Gust, then the gear hate.**

---

## 12. What to watch, and what to ask Jun

This section is deliberately not a list of card swaps. Jun has the reps on this archetype and these seventy-five are his; the useful thing a dossier can do is say what to measure and hand the result back to him.

**Measure these four things over your first few nights:**

1. **How often Mister Root moves twice.** The entire case for this build over midrange rests on XP you generate rather than win. If the average Mister Root moves once and dies, the engine is theoretical and the midrange list is simply better.
2. **How often you are Body-screwed.** Demand is 11 against 6 runes. Count the games where you hold a Rengar and a Punch First and cast neither.
3. **Whether you miss Traveling Merchant.** Specifically: how many games you lose with cards in hand you could not cast, versus games you lose having run out of things to do.
4. **Whether the sideboard fits.** If you are consistently wanting an eleventh card against Yi and Akali, that is a fact worth reporting rather than a problem to solve at the table.

**The question worth putting to Jun:** which of his two builds he would register after the 18th, and whether the aggro list was designed for a particular room. He built both knowing Stacked Deck was gone, and a deck built for a known metagame is a different object from a deck built blind.

**The standing recommendation**, stated plainly so this page does not pretend to be neutral: against the field as the archive currently measures it, **the midrange build is the better choice** — Yi and Akali are 13.5% of the archive against Jayce and LeBlanc's 7.4%, and this list is worse against the larger half. Register this one when you know the room favours it, or when you know you pilot it better.

---

## Sources and method

**Rule text** is `docs/rules-full.md` — Riot's Core Rules and Tournament Rules, verbatim, generated by `scripts/build-rules.mjs` from the PDFs on the Rules Hub. Every unqualified "rule N" here is a **Core Rules** entry.

**Card text** is `data/cards.json` with `data/errata.json` applied on read. Two cards in this list are errata'd: **Rengar, Trophy Hunter** (functional — Ambush as a verb) and **Fizz, Trickster** (cosmetic).

**Archetype shares, curves and Might distributions** are computed from `data/decks.json` — the 1,184-list snapshot of 16 September, the first to carry riftbound.gg's backfill of the Chinese tournament circuit. Shares are of the whole archive, not of a Top 64.

**Collection figures** are from the live app state via `scripts/rift deck aggro`.

**What this page does not repeat:** combat resolution, the clean-win simulation, the XP rules in full, keyword definitions and the shared interactions all live in the [post-ban midrange dossier](khazix-voidreaver-postban.md). The two lists share 34 of 40 cards and there is no version of this deck that can be played well without that page.
