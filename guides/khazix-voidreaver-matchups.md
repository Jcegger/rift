---
title: Kha'Zix Voidreaver — Champion Matchup Guide
subtitle: Riftbound, Vendetta season — every ranked archetype against Jun's midrange list, after the Los Angeles Regional
author: rift toolchain
date: 2026-10-02
---

**Your list:** `Kha'Zix Midrange (Jun, post-ban)`: 40 main, 12 runes (6 Body / 6 Chaos), 3 battlefields (Zaun Warrens, Star Spring, Sandswept Tomb), 10 sideboard.
**Companions:** the [deck guide](khazix-voidreaver.md) explains *how* to play the deck, and [Jun's notes](khazix-voidreaver-jun.md) are its designer's own reading. This page is *who you are playing against*.
**Where a matchup has Jun's write-up, his plan leads the box**, marked (Jun). His matchup chapters predate the ban and the Hidden package, so where the field has changed since, the box says so. **Every Board line swaps one for one**, and Decree of Strength lives in the board, so it is never a cut.

---

## The headline: this list won Best-of-Kha'Zix at Los Angeles

**Cuoemrei won the Best-of-Kha'Zix prize at the Los Angeles RQ** on 26 September, a 2,165-player field and the largest this archive has carried. The archive carries Cuoemrei's list: Jun's 23 September build, which shares **54 of your 56 cards**. So does HTCG Dizoo's list at the Orlando $10k the same weekend (36th of 78, tournament-vouched), and a list titled "Kha'Zix Top 32 Los Angeles RQ". **Your list is Jun's 3 October revision**, two cards different.

**And the deck is Tier 4** on riftbound.gg's list as of 1 October. Their note: Kha'Zix "didn't do much in third-party events before the bans either, but typically rose to the occasion during regional tournaments." Both are true at once. **It converts in the hands of someone who knows the matchups, and it does not convert on raw power.** That is what this page is for.

**Jun's own post-ban read of the field:**
- Jayce and LeBlanc have "always been superb" for Kha'Zix.
- Irelia and Akali, the Astral Heron decks, are decent.
- Rengar and Master Yi are even or slightly unfavoured, "nothing we can't beat". On ban day he called Master Yi "not so great" and Azir "a good matchup" ([Jun's notes §10](khazix-voidreaver-jun.md#10-jun-on-video)).
- Kennen got much worse with the ban.

---

## How to use this page

Built to sit beside a practice game. Every Tier 1 and Tier 2 opponent gets the same parts, in the same order:

| part | what it answers | read it |
|---|---|---|
| **At the table** | how you win, the mulligan, early, middle and late, whether to flip, and the one mistake to avoid | before the game, and between turns |
| **Their deck** | the legend, the shape of the list, and the cards that will hurt you | before the game |
| **Fights** | how often you win a 2v2, and how to rig it | when you are about to commit |
| **Flips and counters** | which of your three Hidden cards they can punish, and what to count | before every flip |
| **Their facedown card** | what is likely hiding at *their* battlefield, and what it does when you attack there | when you attack into it |
| **Battlefields** | what their battlefields do to you, and any reason to change your usual order | at setup |
| **Board** | games 2 and 3 | between games |

Tier 3 entries keep the box and compress the rest. Tier 4 and below get a box and a line.

**Four things hold in every matchup**, so the entries do not repeat them:

1. **Check for lethal first, from 5 points on, for both players.** A hold at 7 wins outright, and at 6 a hold plus a conquest of the other battlefield wins ([deck guide §2](khazix-voidreaver.md#closing-68-points)).
2. **Punch First is your hardest trick to counter.** It costs 2 Power, so Defy cannot touch it, and it only chooses *your* unit, so Not So Fast cannot either. Grim Resolve also dodges Not So Fast, but it costs no Power, so **Defy counters it**: against Defy decks, cast Punch First first. Only a counter that takes any spell (Riposte, Hard Bargain, Abandon) stops it.
3. **Their facedown card cannot touch your flip.** They can only hide at a battlefield they control, and its targets must be at that battlefield (§811.1.b, §811.1.d.2), so it is never at yours. What it *can* do is hurt you when **you attack its battlefield**. That is what the "Their facedown card" line is for.
4. **Kha'Zix starts in your Champion Zone.** You have him every game. His *"if an enemy unit is alone here"* trigger fires whether he attacks or defends.

**Battlefields, in a match.** You choose one each game, and **every battlefield used in a game someone won is retired for the match, yours included** (§486.5). In a single unsanctioned game they are picked at random (§485.5). **Jun's order:** Zaun Warrens in game 1. Sandswept Tomb mostly when going second in games 2–3. Star Spring when the hidden-unit save is worth more than its symmetry. The Battlefields line in each entry only says when to break that order.

| | text | for you |
|---|---|---|
| **Zaun Warrens** | *"When you conquer here, discard 1, then draw 1."* | You choose what feeds the trash, so it plays asymmetric for you. **Jun's game-1 default.** Kennen and Zed run it themselves |
| **Sandswept Tomb** | *"Each spell that chooses one or more units here that are friendly to it costs `[A]` less."* | Punch First becomes 1E / 1 Body, Switcheroo 2E / 1 Chaos. Their self-targeting pumps get cheaper too |
| **Star Spring** | *"The first time a player plays a non-token unit here each turn, they may move another unit they control here to its base."* | A free walk-home, and with a hidden unit there, a 0-Energy save for a hold that is going wrong ([deck guide §7](khazix-voidreaver.md#star-spring-and-a-hidden-unit-the-0-energy-flash)). **Never against Rek'Sai or LeBlanc**, whose units want to come home or die. **Risky against Rengar**, who has ten-plus Reaction-speed ways to trigger it |

---

## Before the dice roll: which game is this?

The question under every matchup is ***if neither of us acts, who is happier?*** ([strategy.md §2](../docs/strategy.md#2-every-deck-is-solving-a-different-problem)). The player time favours can wait, and the other has to force the game. Two questions answer it from their first two turns:

| if they… | you play | why |
|---|---|---|
| **cannot cover two battlefields** (few cheap units) | **take both, race** | 2 points a turn, but five turns at best from the first unit: it enters exhausted (§143.4) and attacks the turn after |
| **cover two and out-grind you** (grind > 12) | **win one fight early, convert it** | you can neither spread nor wait |
| **cover two but you out-grind them** (grind < 12) | **hold one, refuse trades** | they need it short; you do not |

**Your grind number is 12**, and every entry compares theirs to it: above 12 they win long, below it you do. It is a keyword count, not a measurement, so treat 10.9 against 12 as even ([Sources](#sources-and-method)).

**Three rules from Jun that sit on top of the table:**
- **Whatever the plan, the target is 6 points before them.** Your end-game needs little setup, because Void Assault and the Ambush units can take both battlefields in one turn.
- **Ask, every game, "can I win this without a hold?"** If not, force one. Post-ban that is most games against the Heron decks.
- **Re-ask the role question when the board changes.** A "hold one, grind" game becomes "push now" the turn they land the engine piece that beats you long, whether that is Astral Heron, Dazzling Aurora or a resolved Rhasa.

**Three more board changes that flip the plan** ([strategy.md](../docs/strategy.md)):
- **They hold both battlefields.** Patience works only while the board is split. Once they hold both, the setup is already paid: 2 points every Beginning Phase whatever you build, four turns at most from zero. Break it now (§2).
- **Either player reaches 5.** Scan every turn for a line to 8, theirs before yours (§0). Void Assault and the Ambush units take both battlefields in one turn.
- **Their base is big but slow.** Pressure it before it converts (§2).

**Patience is a habit, not a plan.** It is "the deck's first skill" in every matchup: units first, spells second ([Jun §3](khazix-voidreaver-jun.md#3-patience-development-and-the-curve)). The table decides what the developed board then does. **Pushing is not recycling runes**: even in a race, spend Power on the turn that scores, because Power is expensive early.

Never hold zero battlefields, and never take a fight you have not rigged.

---

## At a glance

| Opponent | Jun | Plan | Flip Evelynn? | Flip the rest? | The thing that beats you |
|---|---|---|---|---|---|
| Irelia | decent | press: score early, reach 6 first | tapped Chaos *and* Calm | tapped Chaos | Not So Fast on a flip; a free Astral Heron |
| Akali | decent | one fight early, **your turn only**; offer a fight before Heron | tapped Calm | **freely** | Falling Star on Rengar; Marai when you attack them |
| LeBlanc | superb | one fight early, rigged only | **freely** | **freely** | Thousand-Tailed Watcher at 7 runes; one mistake against a veteran |
| Jayce | superb | take both, race; answer Aurora | pull from base | **freely** | a fair fight (15%); an unanswered Dazzling Aurora |
| Azir | good | develop, then clear them at once | **freely** | **freely** | Equipment piling up |
| Rengar | even | patient: hold one, make them act first | **freely** | **freely** | the early game; Ambush bodies mid-fight |
| Vex | — | hold one, grind | tapped Chaos *and* Calm | tapped Chaos | playing units while Vex, Apathetic is out |
| Kennen | tough, weaker post-ban | pressure their setup, then one big turn | tapped Chaos | tapped Chaos | a completed setup by turn 4–5; an even trade |
| Rek'Sai | — | hold one, let time work | **freely** | **freely** | trading bodies; Falling Star |
| Master Yi | even to slightly unfavoured | develop hard, then **hold** | tapped Calm | **freely** | attacking a lone defender |
| Ezreal | — | take both, race | **don't** | **don't** | flipping at all |
| Fiora | — | hold one, win long | **freely** | **freely** | any spell into open Body + Order (Riposte) |

"Jun" is his post-ban rating where he gives one. "—" means he did not rate it.

---

# Tier 1

## Irelia, Blade Dancer — Tier 1.1 · 4.4% · Calm/Chaos · mean Might 2.6

**In a sentence:** the smallest board you meet and your best fair fight — but the most reactive deck on the page, and the one that punishes your tricks hardest.

> **At the table**
> - **How you win (Jun):** press. Score a lot early without losing value, and reach 6 first. Irelia plays few units, so it rarely builds the extraordinary hold it needs to stop your double conquest. You win 56% of fair 2v2s, the only matchup on the page where you are favoured with no trick at all.
> - **Mulligan:** keep units. A 2-drop plus a 3-drop is a fine hand; you do not need a trick to win fights against 2.6 Might.
> - **Early:** develop two bodies and take a battlefield with a straight fight. Do not lead with spells, because Defy is in every list. **Be patient with your spells and aggressive with your units** (Jun). Giving up a unit for a point is fine.
> - **Middle:** they will use the legend to ready a unit and fight twice, so keep a body back at the battlefield you hold. **Punish a greedy tap-out with removal** (Jun). His named Rampage target here is **Stellacorn Herder** (98%), which draws every time it moves. **Astral Heron** is in 38% of lists, and its discount works only while it stands at a battlefield, so contest that battlefield the turn it lands.
> - **Closing:** game 1, Punch First is your finisher: Defy and Not So Fast cannot touch it. In games 2–3 Jun takes two out and leans on Sabotage, Hard Bargain and Switcheroo; this page's board takes one.
> - **Flips:** Tornado Warrior only into tapped Chaos. Evelynn only into tapped Chaos *and* Calm, because Not So Fast is in 72% of lists. Switcheroo: flip it after they pump.
> - **From Jun's Irelia video (pre-ban):** open a key turn with **Sabotage** to see what you are playing into, and make it, or a lesser spell, eat their Defy before the **Star-Crossed** on their Irelia. Bouncing her usually wins. Close with the **Vex lock**: with their board cleared, Vex on a battlefield stuns whatever they play.
> - **Never:** cast Void Assault or Rampage into open Calm. Defy counters both.

### Their deck

> **Blade Dancer** — *"When you choose a friendly unit, you may exhaust me and pay `[A]` to ready it. When you conquer, you may pay `[1]` to ready me."*

Every pump they cast on their own unit can also **ready** it — so a unit that just fought can move and fight again. 14 units a deck, 6 of them at 2 Energy or less, and **13 Reactions a deck**: they hold runes up and answer you. Six or seven Hidden cards a deck, mostly Tideturner, Zhonya's Hourglass and Edge of Night.

| card | in | what it does to you |
|---|---|---|
| **Defy** | 100% | counters a spell up to 4 Energy and 1 Power — everything you cast except Punch First and Switcheroo |
| **Discipline** | 100% | Reaction +2 Might and draw — the reason a fight you counted is suddenly two short |
| **Defiant Dance** | 96% | Reaction +2 to theirs *and* −2 to yours: a four-point swing for 1 Energy |
| **Boots of Swiftness** | 98% | Equipment, +2 Might |
| **Not So Fast** | 72% | counters any spell or ability that chooses their unit — Switcheroo, Void Assault, Rampage, Evelynn's trigger |
| **Charm** | 70% | moves your unit — their version of Void Assault |
| **Vex, Apathetic** | 62% | stuns every unit you play while she is at a battlefield (see Vex) |

### Fights

**56 bare · 94 +PF · 98 +Sw · 96 iso.**

- Count their open runes, not their board. Discipline and Defiant Dance are 1–2 Energy each; two open runes is +2 to +4 on their side of any fight.
- **Punch First is the trick that lands.** Hold it for the fight where they have already spent a pump.
- Their units are small enough that Kha'Zix isolation (96%) is overkill. Spend your setup cards on tempo, not on manufacturing a lone defender.

### Flips and counters

**66% can remove your hidden unit · 96% can counter Evelynn · 77% can counter Switcheroo.** Gust and Star-Crossed need Chaos; Not So Fast needs Calm. No flip is free here.

### Their facedown card

Usually **Zhonya's Hourglass** (85%) or **Tideturner** (89%). Zhonya's saves the next unit of theirs that would die and sends it home — you still win the combat if it was their last unit there. Tideturner swaps one of their units into the fight.

### Battlefields

They bring **Abandoned Hall** (89% — any player who casts a spell may give a unit there +1, which suits their 13 Reactions), **Sunken Temple** (87%) and **Targon's Peak** (83%). **Jun rates Irelia "slightly favoured" on Targon's Peak**, which readies their runes after a conquest, so they keep pumps up through your turn. Expect it in one game of the three, and once used it is retired for the match (§486.5). Usual order otherwise; Sandswept Tomb's Punch First discount matters most here in games 2–3.

### Board

+2 Gust, +1 Hard Bargain. −2 Star-Crossed, −1 Punch First. Gust does Star-Crossed's job against a 2.6 board for 1 Energy, without bouncing your own unit; Hard Bargain answers Not So Fast and Defy alike. **Switcheroo stays.** An earlier version of this line cut it because "there is nothing to swap into against a flat board", but its target is the unit they just pumped, not their natural biggest. Jun brings Switcheroo in here and cuts two Punch First ([Jun's notes §7](khazix-voidreaver-jun.md#7-sideboarding)).

---

## Akali, Rogue Assassin — Tier 1.2 · 5.0% · Fury/Calm · mean Might 3.6

**In a sentence:** they out-grind you, cover both battlefields and counter half your deck — but they can only escape fights on their own turn, so you win by fighting on yours.

> **At the table**
> - **How you win:** take one battlefield early and keep it. **Start every fight on your own turn**: their legend can only rescue a unit on theirs, and a rescued unit leaves you the battlefield anyway.
> - **The Heron rule (Jun):** Astral Heron is in 80% of their lists. **Do not let them conquer for free and drop Heron unopposed**, or you fall very far behind. Offer a fight before it lands. Once it is down, contest the battlefield it stands on, because its discount works only while it is at a battlefield. This is the matchup the hold-centric list was built for.
> - **Mulligan:** Punch First is the card to keep, the one trick neither Defy nor Not So Fast can touch. A 2-drop plus Punch First is the ideal four.
> - **Who you are facing (Jun, ban day):** Akali is hard to play, with **below-50% win rates** in his stats; it keeps doing well through a few excellent pilots. An Akali deep in an event is probably one of them, so expect them to punish loose fights.
> - **Early:** take a battlefield before their 4-drops land. Kai'Sa, Survivor (75%) draws when she conquers, so the battlefield you hold is also card advantage you deny.
> - **Middle:** watch for **two open Fury**: Falling Star is 3 + 3 damage, enough to kill Rengar. Fight Akali, Silent on your turn, when she is 4, not on hers, when she is 6.
> - **Closing:** they win long, so convert. When they hold up runes, make them spend them on your turn.
> - **Flips:** Tornado Warrior freely, because nothing removes your hidden unit. Evelynn and Switcheroo only into tapped Calm: Not So Fast (67%) counters both.
> - **Never:** attack their battlefield with a 2-Might unit while they have a facedown card there. Mischievous Marai (73%) kills it on arrival.

### Their deck

> **Rogue Assassin** — *"[Empower] `[3][A]`. [Action] Exhaust: If it's your turn, move a friendly unit in a showdown to base and if I'm Empowered, ready it."*

**"Your" turn is theirs.** On their turn they can pull a losing unit out of a fight; on yours they cannot. When they do, they are no longer at the battlefield — so you are the only player left, you win the combat, and you take the point. 18 units a deck at 3.6 mean Might, about 5 of them cheap, with a real top end in **Astral Heron** (7 Might) and **Darius**.

| card | in | what it does to you |
|---|---|---|
| **Defy** | 100% | counters everything you cast except Punch First and Switcheroo |
| **Shuriken Flip** | 96% | 2 damage to your unit, then they move one of theirs — kills Faefolk, Tentacles and every 2-drop |
| **Akali, Deadly Weapon** | 94% | deals 1 (2 empowered) whenever she moves to or from a battlefield |
| **Zhonya's Hourglass** | 90% | their next dying unit goes home instead |
| **Falling Star** | 86% | 3 damage, twice — kills Rengar on its own |
| **Astral Heron** | 80% | 7 Might, and their next card each turn costs `[2][A][A]` less |
| **Back Off** | 76% | Hidden stun |
| **Kai'Sa, Survivor** | 75% | 4 Might, draws when she conquers |
| **Mischievous Marai** | 73% | Hidden; deals 2 to an enemy unit at its battlefield when played |
| **Not So Fast** | 67% | counters Switcheroo, Void Assault, Rampage and Evelynn's trigger |

**Akali, Silent** reads *"I can't be chosen by enemy spells and abilities unless I'm in combat. When I move to a battlefield, give me +2 Might this turn."* She is 6 on the turn she moves in and **4 sitting still on your turn**. Void Assault, Faefolk, Evelynn and Rampage all choose, so none reach her outside combat — and Rampage, with no Action keyword, can never be cast inside one.

### Fights

**32 bare · 84 +PF · 97 +Sw · 92 iso.**

- **Punch First wins 84% and nothing they hold can stop it.** Switcheroo's 97% assumes it resolves — Not So Fast says it does not, two times in three, unless their Calm is tapped.
- Isolation works on your turn (92%), because their legend's escape is switched off. Pull their unit to yours with Faefolk or Void Assault — into tapped Calm, or Defy counters the Void Assault.
- Switcheroo on Silent: play it **in the combat showdown**, where she can be chosen.
- Do not leave Rengar exposed to two open Fury. Falling Star can split its damage, but it does not have to.

### Flips and counters

**2% can remove your hidden unit · 67% can counter Evelynn · 67% can counter Switcheroo.** All of it is Not So Fast, which needs Calm. Tornado Warrior is your free flip.

### Their facedown card

At their battlefield it is **Zhonya's Hourglass** (90%), **Back Off** (76%) or **Mischievous Marai** (73%). Attacking into it means one of: a unit that will not die, a unit of yours that deals no damage, or 2 damage to one of yours on arrival. **Attack with 3-Might units or bigger, and expect the fight to be one unit worse than it looks.**

### Battlefields

They bring **Void Gate** (76%) — *"Spells and abilities affecting units here each deal 1 Bonus Damage"*, which makes Falling Star 4 + 4 and Shuriken Flip 3 — **Sigil of the Storm** (59%) and **Forgotten Monument** (39%, nobody scores there until their third turn). Do not fight with Rengar at Void Gate into open Fury. Usual order.

### Board

+2 Ravenbloom Prefect, +2 Acceptable Losses (Zhonya's 90%), +1 Hard Bargain (for Not So Fast and Defy). −2 Rampage, −2 Star-Crossed, −1 Up from the Deep — Rampage cannot reach Silent, Defy counters both spells, and Akali, Deadly Weapon's move ping and Shuriken Flip kill Tentacles for free.

---

## LeBlanc, Deceiver — Tier 1.3 · 3.9% · Mind/Order · mean Might 3.82

**In a sentence:** a Deathknell engine that wants its units to die, with a seven-drop that wipes your combat maths — and nothing at all that punishes a flip.

> **At the table**
> - **How you win:** win one battlefield early and convert it. They cover both and beat you long (grind 12.2), and 29% bare means you never fight unrigged. Jun rates this one "superb" for Kha'Zix, **but warns that a single mistake against a veteran LeBlanc player puts you in a spot you cannot come back from**. They won the CCS Houston event, and the deck has a steep learning curve.
> - **Mulligan:** keep Switcheroo (98%), or a Faefolk plus a 2-drop. You need a way to make the fight unfair.
> - **Early:** take a battlefield before their 5-drops. Their early units are 1-Might Deathknell bodies, and killing them pays them a card or a rune, so **fight for the battlefield, not the bodies**.
> - **Middle:** when they reach 7 runes, assume **Thousand-Tailed Watcher** (88%): every unit you have is −3 that turn. Do not set up a fight you need to win on that turn; set it up for the next one.
> - **Closing:** they rebuy dead units (Glasc Mixologist, Rift Herald) faster than you can grind them. Turn the battlefield you hold into points, not kills.
> - **Flips:** freely. Nothing in their lists removes your hidden unit or counters a trigger.
> - **Why it rose (Jun, ban day):** LeBlanc lost nothing to the ban, and with fewer Chaos decks around it rarely meets Gust or Star-Crossed. That is also why it never answers your flips.
> - **Never:** trade a unit just because you can. Karthus (88%) makes every Deathknell trigger twice.
> - **Watch:** Jun's 23 September video, *Kha'Zix Midrange vs LeBlanc*, on Metafy. It is the one post-ban LeBlanc game we know of from him.

### Their deck

> **Deceiver** — *"When you conquer or hold, you may discard 1 and exhaust me to play a ready Reflection unit token there. It becomes a copy of another unit there. Give it [Temporary]."*

27 units a deck — the most on this page — built to die and pay out. Watchful Sentry draws, Soaring Scout ramps, Ruined Rex deals 4, Glasc Mixologist replays a unit; **Karthus, Eternal doubles all of it**. About two Hidden cards a deck.

| card | in | what it does to you |
|---|---|---|
| **Mirror Image** | 95% | a temporary copy of the best unit on the table |
| **Thousand-Tailed Watcher** | 88% | 7 Energy: *"give enemy units −3 Might this turn, to a minimum of 1"* |
| **Karthus, Eternal** | 88% | their Deathknell effects trigger an additional time |
| **Hidden Blade** | 88% | kills a unit at *its* battlefield — a fight card, not a flip card |
| **Vi, Peacekeeper** | 85% | Ambush 5-drop that stuns one of yours when she attacks |
| **Ruined Rex** | 85% | Deathknell: deal 4 to one of your units |
| **Harnessed Dragon** | 60% | 8 Energy, kills one of your units on play |

### Fights

**29 bare · 79 +PF · 98 +Sw · 90 iso.**

- **Switcheroo is the matchup**, and nothing they run counters it.
- Ruined Rex's Deathknell deals 4 *after* it dies. Count that 4 against your surviving units before you kill it.
- Vi, Peacekeeper on Ambush turns a fight you counted into one where your best unit deals nothing. Leave a margin of one unit.

### Flips and counters

**0% · 0% · 0%.** Flip on curve; Evelynn here is a free 3 XP and a free isolation.

### Their facedown card

**Hidden Blade** (88%) — it kills one of your units if you attack its battlefield, and you draw 2. Attack it with a spare unit in the fight, not a lone Rengar.

### Battlefields

**Windswept Hillock** (90%, units there gain Ganking — yours too), **Dusk Rose Lab** (72%, they kill their own unit there to draw, which their Deathknells love) and **Star Spring** (70%). **Never Star Spring**, which hands their units free walk-homes. Zaun Warrens, then Sandswept Tomb.

### Board

**+1 Decree of Strength** (Mind/Order — live). −1 Sabotage: Decree does Sabotage's job here and can take a unit, Thousand-Tailed Watcher included.

---

## Jayce, Defender of Tomorrow — Tier 1.4 · 4.1% · Mind/Body · mean Might 5.45

**In a sentence:** the biggest board you meet, and it arrives late — so take both battlefields and race before it does.

> **At the table**
> - **How you win:** take both battlefields and race. They run 8 units a deck, only 1.5 of them cheap, so they cannot contest two battlefields early, and their grind of 15.9 means a long game is theirs. Jun rates it "superb" for Kha'Zix.
> - **The Aurora rule (Jun):** the game usually turns on whether they find **Dazzling Aurora** (70%) on time and whether you find the answer on time. **Sabotage** takes it from their hand (it is a non-unit card). **Ravenbloom Prefect** banishes it as it is played; Jun calls the Prefect "incredibly oppressive" here and often brings it in on the draw. **Acceptable Losses** kills it once it resolves, but only if it is their only gear, because they choose which one dies.
> - **Mulligan:** keep **Switcheroo** above everything: it is 97% here and nothing else in your deck comes close. Faefolk is the other keep, a 1-Might body to swap. On the draw in games 2–3, **a Ravenbloom Prefect on turn 1 or 2** can be "already too much for a Jayce deck to handle" (Jun).
> - **Early:** spread. Two battlefields with a unit each is two points a turn while they ramp.
> - **Middle:** hide Switcheroo as soon as you can. **Sabotage (76%) takes it from your hand, but cannot reach a facedown card.** Flip it at the battlefield their big unit attacks.
> - **Closing:** you need eight points before Elder Dragon or Aurora takes over. Every turn you hold two battlefields is a turn closer.
> - **Flips:** Tornado Warrior and Switcheroo freely. Evelynn: pull from their base, not from the battlefield with their facedown card (Temporal Breach, 43%).
> - **Never:** take a fair fight. 15% bare.

### Their deck

> **Defender of Tomorrow** — *"[Empower] `[2][A][A]`. `[1]`, Exhaust: Ready a gear. [Empowered] `[1]`, Exhaust: Ready 2 gear."*

A ramp deck. Platewyrm Egg and the legend make extra Energy; Catalyst of Aeons and Mobilize channel runes; Clairvoyance and Dredge Up dig. Then it lands units the size of your whole board.

| card | in | what it does to you |
|---|---|---|
| **Sabotage** | 76% | takes a non-unit card from your hand — Switcheroo or Punch First |
| **Bellows Breath** | 76% | 1 damage to up to three units at one location, repeatable |
| **Flurry of Blades** | 74% | Reaction: 1 damage to **every** unit at battlefields — Faefolk, Tentacles and Shadow Clones die |
| **Elder Dragon** | 72% | 10 Might, 12 Energy: *"any amount of your damage is enough to kill enemy units"* — and 1 damage to one of yours at each location on play |
| **Dazzling Aurora** | 70% | 9-Energy gear: a free unit off the top of their deck every turn |
| **Gutter Palace** | 67% | an alternate win: exactly 4 cards in hand and 4 units at battlefields at the start of their Beginning Phase |
| **Sprite Burst** | 67% | two ready 3-Might tokens |
| **Temporal Breach** | 43% | Hidden blink — protects their unit from your Evelynn pull |

### Fights

**15 bare · 49 +PF · 97 +Sw · 71 iso.**

- Punch First is a coin flip; isolation plus Kha'Zix is 71%; **Switcheroo is 97%**. Swap your Faefolk's 1 with their biggest unit.
- Elder Dragon switches off minimum lethal, so your cheap bodies stop soaking damage. Against a resolved Dragon, Switcheroo is the only card that still does its job.
- **Watch Gutter Palace.** If they sit on four cards and four units at battlefields, they win at their next Beginning Phase. Killing one unit breaks it.

### Flips and counters

**0% can remove your hidden unit · 2% counter Evelynn (+43% Temporal Breach guarding her target) · 2% counter Switcheroo.**

### Their facedown card

**Temporal Breach** (43%) — it blinks one of their units at that battlefield, which fizzles anything of yours that chose it.

### Battlefields

**Sigil of the Storm** (72%), **Forgotten Monument** (65% — no scoring there until each player's third turn, which slows *your* race) and **Dragon Roost** (46%, any player may pay `[A][A]` to play a Dragon there). Usual order. Forgotten Monument slows your race, so the faster you start scoring elsewhere the better.

### Board

**+2 Ravenbloom Prefect, +1 Decree of Strength** (Mind/Body — live). −2 Punch First, −1 Up from the Deep. Prefect is the Aurora answer Jun names. Punch First converts only 49% against their size, and Flurry of Blades (74%) and Elder Dragon kill Tentacles for free. *An earlier version of this line had no Prefect; it is the card Jun singles out for this matchup.*

---

# Tier 2

## Azir, Emperor of the Sands — Tier 2.1 · 4.2% · Calm/Order · mean Might 3.8

**In a sentence:** almost no units in the list and a board made of tokens and Equipment. Their early game is theirs, so develop through it and clear the board in one go, because Azir rebuilds one unit a turn.

> **At the table**
> - **How you win (Jun):** let them have the early game and win the late one. Their units are cheap and leave Equipment behind, and Azir usually develops only one unit a turn and runs out of cards. So develop, accept their early point lead, then clear their board with removal in as few turns as you can, because a cleared board stays cleared. *An earlier version of this box said "take both battlefields before Arise! lands"; Jun's plan replaced it.*
> - **Mulligan:** keep cheap units and Switcheroo.
> - **Early:** develop first. They have 0.3 cheap units a deck, so a free early point is there if it costs you no development, but it is not the plan.
> - **Middle:** watch your rune economy (Jun); this is a game you win by spending well, not fast. Every Equipment you kill is a Sand Soldier they never get, and Ravenbloom Prefect banishes Equipment as it is played. **Sabotage takes their non-unit cards** (Equipment, Arise!, Guards!) before they can use them (Jun).
> - **Closing:** isolation is 95%, because their units are few and large. Drag one onto Kha'Zix. **Play around Arise!** (93%): a Sand Soldier for each Equipment they control, two of them ready.
> - **Flips:** freely. Nothing they run removes your hidden unit; Not So Fast is in 7%.
> - **Never:** cast Star-Crossed or Void Assault into open Calm. Defy is in 93%.

### Their deck

> **Emperor of the Sands** — *"Sand Soldiers you play have [Weaponmaster]. `[1]`, Exhaust: Play a 2 Might Sand Soldier unit token to your base. Use only if you've played an Equipment this turn."*

Weaponmaster lets a Sand Soldier pick up an Equipment as it arrives, for `[A]` less. So every Equipment is a bigger token, and every token is a home for the next Equipment. **7.1 token-makers a deck**, and 7.5 Hidden cards (Guards!, Hidden Blade, Back Off, Kennen).

| card | in | what it does to you |
|---|---|---|
| **Guards!** | 98% | Hidden: a 2-Might Sand Soldier, readied for `[Order]` |
| **Equipment** | 95–98% each | Doran's Shield, Eye of the Herald, Soul Sword, Brutalizer, B.F. Sword (+3) |
| **Arise!** | 93% | a Sand Soldier for each Equipment they control, two of them ready |
| **Defy** | 93% | counters your cheap spells |
| **Hidden Blade** | 93% | kills a unit at *its* battlefield |
| **Back Off** | 81% | Hidden stun |
| **Deathgrip** | 79% | Reaction: kill their own unit to add its Might to another |
| **Vi, Peacekeeper** | 63% | Ambush, stuns one of yours on attack |

### Fights

**24 bare · 85 +PF · 96 +Sw · 95 iso.**

- The board is bigger than its units: count Equipment. A 2-Might token with B.F. Sword is 5.
- **Isolation is the plan** (95%). Faefolk and Void Assault drag one of their few units onto Kha'Zix.
- Deathgrip moves Might between their units at Reaction speed. When you count a fight, count their biggest unit as if it had the other's Might too.

### Flips and counters

**0% · 7% · 12%.** Flip on curve.

### Their facedown card

**Guards!** (98% — a 2-Might token arriving mid-fight), **Hidden Blade** (93%) or **Back Off** (81%). Attacking their battlefield, expect one more defender, one dead attacker, or one stunned attacker.

### Battlefields

**Hall of Legends** (98%, conquer to ready their legend for `[1]` — another token), **Trifarian War Camp** (88%, +1 Might to every unit there, both sides) and **Seat of Power** (65%). Usual order.

### Board

**+2 Ravenbloom Prefect, +2 Acceptable Losses** — this is the matchup the gear package exists for. −1 Zed, −1 Up from the Deep, −1 Star-Crossed, −1 Traveling Merchant. Defy counters Star-Crossed, and Jun cuts Zed and Up from the Deep here. **Rampage stays**, because clearing their board at once is the plan. Keep all four Hidden cards.

---

## Rengar, Pridestalker — Tier 2.2 · 3.1% · Fury/Body · mean Might 2.96

**In a sentence:** a mirror of your own tools — Faefolk, Punch First, Rengar — but you out-grind it, and it cannot punish a flip.

> **At the table**
> - **How you win (Jun):** be patient, and do not bleed points. **Their early game is stronger, and one misstep there can lose the game.** Once your board is better you need take no risks. When they tap out to develop and get back in, remove their units for free. You out-grind them (8.0 against your 12), so hold one battlefield and let them run out.
> - **The Punch First rule (Jun):** both decks run it as a trump card. **Enter combat only when you are already winning it**, so they have to act first. They spend their Punch First, then yours wins the fight and their trump is gone.
> - **Mulligan:** Punch First (96%) plus any 2-drop.
> - **Early:** take one battlefield and make it expensive to attack. Refuse fights you have not counted *including their Ambush*.
> - **Middle:** assume an Ambush unit or Thrill of the Hunt in every fight. They hold about 12 Reaction or Ambush cards a deck, and their legend adds +1 Might every time they play a unit.
> - **Closing:** you win the long game. Do not hand them a coin-flip fight to end it sooner.
> - **Flips:** freely (Repulse in 6%).
> - **Never:** commit everything to one fight. A Rengar arriving on Ambush is 6 Might plus their legend's +1.

### Their deck

> **Pridestalker** — *"When you play a unit, give a unit +1 Might this turn."*

30 units a deck, and **every unit played gives +1** — including the ones they Ambush into your fight. They run your Faefolk, your Punch First and your Rengar.

| card | in | what it does to you |
|---|---|---|
| **Thrill of the Hunt** | 100% | Reaction: banish one of their units and replay it to **any** battlefield for free |
| **Inferna** | 100% | 2-Energy Ambush, Assault 2 |
| **Nidalee, Cat Form** | 100% | 3-Energy Ambush, 4 Might, draws on a win |
| **Punch First** | 97% | your own best trick, in their hands |
| **Rengar, Trophy Hunter** | 97% | the same 6-Might Ambush you run |
| **Grim Apothecary** | 97% | Ambush that returns one of their units to hand — saves a unit you were about to kill |
| **Irresistible Faefolk** | 97% | they drag too |
| **Sabotage** | 94% | takes Punch First or Switcheroo from your hand |
| **Rampage** | 88% | removal that reaches your base |

### Fights

**45 bare · 96 +PF · 97 +Sw · 98 iso.**

- Every fight has a hidden third card: their Ambush. Before committing, count their open runes — Inferna is 2, Nidalee 3 + 1, Rengar 5 + 1, Thrill 2 + 1 — and add their legend's +1 per unit played.
- Sabotage takes your trick out of your hand. **Hide Switcheroo** if you are holding it for a later fight.

### Flips and counters

**0% · 6% · 6%.**

### Their facedown card

**Pyke, Dockside Butcher** (82%) or **Pakaa Cub** (62%) — bodies, not tricks. Expect one more unit in the fight.

### Battlefields

**Emperor's Dais** (97%), **Star Spring** (94%) and **Seat of Power** (88%). **Avoid your Star Spring here**: Rengar has ten-plus Reaction-speed ways to trigger it (Jun). Zaun Warrens, then Sandswept Tomb.

### Board

+1 Rampage, +1 Hard Bargain. −1 Grim Resolve, −1 Sabotage — Punch First already wins 96% here, so the smaller pump is the one you need least. Jun brings in Hard Bargain and takes out Sabotage here.

---

## Vex, Gloomist — Tier 2.3 · 5.2% · Calm/Chaos · mean Might 2.88

**In a sentence:** small and interactive, built around a unit that stuns everything you play — and you out-grind it once she is gone.

> **At the table**
> - **How you win:** hold one battlefield and grind (9.4 against your 12). Their 2.88 mean means Punch First decides most fights.
> - **Mulligan:** Faefolk or Void Assault — a way to drag Vex, Apathetic — plus Punch First.
> - **Early:** take a battlefield. Develop before she lands, because after she does every unit you play is stunned.
> - **Middle:** **kill Vex, Apathetic before you play units.** Drag her into your biggest unit with Faefolk or Void Assault (her Deflect charges you `[A]`). Move the big unit first, then Faefolk.
> - **Closing:** grind. They draw off holding with their legend, so taking their battlefield away matters more than killing units.
> - **Flips:** Tornado Warrior into tapped Chaos (Gust, Star-Crossed). Evelynn also needs tapped Calm (Not So Fast, 31%). Switcheroo is countered 45% of the time.
> - **Never:** play Rengar or an Ambush Kha'Zix while she stands at a battlefield.

### Their deck

> **Gloomist** — *"When you or an ally hold, you may exhaust me to draw 1."*

21 units a deck at 2.89 mean, 9 of them cheap, and **10 Hidden cards a deck** — the most of any Tier 1–2 deck. Holding a battlefield draws them a card.

| card | in | what it does to you |
|---|---|---|
| **Vex, Apathetic** | 100% | *"When an opponent plays a unit while I'm at a battlefield, [Stun] it. They can't move it this turn."* |
| **Back Off** | 95% | Hidden stun |
| **Defy** | 89% | counters your cheap spells |
| **Discipline** | 89% | +2 Might at Reaction speed |
| **Mutated Mouser** | 78% | 1 Might, Shield 2, Tank — defends at 3 and must be assigned damage first |
| **Switcheroo** | 75% | the swap cuts both ways — your 6-Might Rengar is the unit worth swapping |
| **Star-Crossed** | 73% | removes your hidden unit mid-flip |
| **Steel Paws** | 60% | 0 Might, Deflect; empowered for 7 Energy it is 7 Might |
| **Gust** | 47% | removes a 3-Might-or-less unit mid-flip |

### Fights

**50 bare · 90 +PF · 98 +Sw · 94 iso.**

- **Order of moves:** a unit that moves into an empty battlefield takes it without a fight. Move your big unit there first, *then* move Faefolk in and pull Vex — Faefolk alone fights her at 1 Might, and nobody walks in once a fight starts (§144.1).
- Steel Paws empowers once they have 7 Energy. Kill it before they reach that.
- Mouser is Tank: your damage has to go into it first. Count it as a 3-Might wall.

### Flips and counters

**78% can remove your hidden unit · 82% can counter Evelynn · 45% can counter Switcheroo.**

### Their facedown card

**Back Off** (95%) — one of your attackers deals no damage. **Switcheroo** (75%) — your biggest attacker becomes their smallest. Attack their battlefield with a margin of one unit.

### Battlefields

**Startipped Peak** (71%, they channel a rune when they hold), **Fortified Position** (49%, a defender there gains Shield 2), **Grove of the God-Willow** (25%) and **Bandle Tree** (24%, a second facedown card). Usual order.

### Board

+1 Hard Bargain (for Defy and the flip). −1 Grim Resolve — Defy (89%) counters it and cannot touch Punch First.

---

## Kennen, Heart of the Tempest — Tier 2.4 · 6.6% · Order/Chaos · mean Might 3.32

**In a sentence:** the most tournament-tested deck you will meet and the best answer suite in the format — win one fight early and never trade.

> **At the table**
> - **How you win (Jun):** keep the pressure high and deny their setup. Kennen cannot both contest your board and build its trash, so make it choose. They out-grind you badly (17.0) once set up, so a slow game is theirs. Jun calls it a hard matchup, but much weaker since the ban took Stacked Deck.
> - **Mulligan:** Punch First (89%) and a 2-drop. Their mean is small enough that +5 decides most fights.
> - **Early:** **kill Kennen, Storm of Shuriken (91%) the moment it lands** (Jun). Score with expendable bodies such as Tentacles, so the points cost you nothing.
> - **Middle:** expect their setup to be complete by **turns 4–5**, and expect a **10+ Might hold**: a conquest, then Rhasa the Sunderer (86%) at that battlefield. Keep Punch First and a developed base to break it. **Sabotage Last Rites (85%) the turn before they would play it** (Jun). Refuse every even trade: a trade fills their trash, and their trash is their hand.
> - **Closing:** if they set up anyway, the game is not over. **Wipe their board in one turn** with all your removal, which cuts off the conquer-and-hold loop they use to rebuild. Get to 6 first.
> - **Flips:** only into tapped Chaos, because Gust or Star-Crossed is in 92% of lists. **Gust is Jun's main answer to them replaying Ride the Wind**: wait for the Ride the Wind and react.
> - **Never:** trade a unit for a unit.

### Their deck

> **Heart of the Tempest** — *"When you play a card from anywhere other than your hand, empower me. [Action] Disempower me, Exhaust: Give a unit [Assault 2] this turn."*

Every card played from the trash (Flow, Fizz) charges a +2 attack. **54 of 65 lists are tournament-vouched**, the highest share on the page.

| card | in | what it does to you |
|---|---|---|
| **Lightning Rush** | 98% | digs and fills the trash; Flow from it again |
| **Ride the Wind** | 89% | moves and readies a unit — a second fight |
| **Rhasa the Sunderer** | 86% | 6 Might, 1 less for each card in their trash |
| **Fizz, Trickster** | 85% | replays a spell from the trash |
| **Switcheroo** | 82% | swaps your big unit with their small one |
| **Star-Crossed** | 80% | removes your hidden unit mid-flip |
| **Gust** | 77% | same |
| **Flash** | 52% | Reaction: up to two of their units go home — escaping a fight, and leaving you the battlefield |

### Fights

**40 bare · 89 +PF · 97 +Sw · 94 iso.**

- Their Switcheroo (82%) is the trick to fear: never count a fight on Rengar's 6 alone.
- Flash escapes a fight at Reaction speed. Like Akali's legend, it leaves you the only player there — you still win the battlefield.

### Flips and counters

**92% · 92% · 38%.** Count their open Chaos before any flip.

### Their facedown card

**Switcheroo** or **Tideturner** (72%). Assume a swap when you attack their battlefield.

### Battlefields

**Zaun Warrens** (88%) and **Minefield** (85%, conquer mills two — fuel for them). Usual order; they run Zaun Warrens too, so it is fully symmetric here.

### Board

+2 Gust, +1 Hard Bargain. −2 Star-Crossed, −1 Tornado Warrior — Gust does Star-Crossed's job for 1 Energy, and with Gust or Star-Crossed in 92% of lists Tornado Warrior is the Hidden unit to drop.

---

## Rek'Sai, Void Burrower — Tier 2.5 · 3.3% · Fury/Order · mean Might 2.63

**In a sentence:** good for you on paper and in time, as long as you remember their units are paid for dying.

> **At the table**
> - **How you win:** hold one battlefield and let time work. Their grind is 1.8, the lowest in the format.
> - **Mulligan:** any working curve. You beat a 2.63 board straight (55%).
> - **Early:** take a battlefield and make them come to you.
> - **Middle:** they have 11 cheap units and 8 token-makers a deck. Holding beats trading — each of their dead units pays a Deathknell.
> - **Closing:** points, not kills.
> - **Flips:** freely. Nothing in their lists punishes one.
> - **Never:** fight with Rengar into two open Fury — Falling Star (88%).

### Their deck

> **Void Burrower** — *"When you conquer, you may exhaust me to reveal the top 2 cards of your Main Deck. You may banish one, then play it. Recycle the rest."*

25 units a deck at 2.65, built around Deathknell bodies and cheap Assault. Every conquer is a free card off the top.

| card | in | what it does to you |
|---|---|---|
| **Cull the Weak** | 97% | each player kills one of their own units — keep a cheap spare so you choose what dies |
| **Cleave** · **Blood Rush** | 97% · 88% | Assault for a turn — their attacks are bigger than their units |
| **Carrion Dredger** · **Honest Broker** | 97% · 94% | Deathknell bodies: a token or a Gold on death |
| **Undertitan** | 94% | 6 Energy: +2 Might to all their other units this turn |
| **Falling Star** | 88% | 3 + 3 damage |
| **Vi, Peacekeeper** | 61% | Ambush, stuns on attack |

### Fights

**55 bare · 97 +PF · 98 +Sw · 98 iso.**

- Their attacks carry Assault from spells. Count their open runes before you rely on a defender.
- Undertitan turns their whole board up by 2. When they reach 6 runes, keep a margin.

### Flips and counters

**0% · 0% · 0%.**

### Their facedown card

**Hidden Blade** (39%) when there is one.

### Battlefields

**The Candlelit Sanctum** (94%), **Forbidding Waste** (82% — a lone defender there is −2, good for your isolation and bad for your lone defender) and **Mystic Vortex** (36% — Reactions cost `[A]` more in showdowns there, Hidden flips included). **Bring Zaun Warrens or Sandswept Tomb; never Star Spring**, which hands their units the walk-home they are built to use.

### Board

None. Extra removal is wrong against a deck paid for dying.

---

## Master Yi, Wuju Bladesman — Tier 2.6 · 7.6% · Calm/Body · mean Might 3.35

**In a sentence:** the most-played archetype, and the one where your isolation plan feeds their legend — unless you make *them* attack.

> **At the table**
> - **How you win (Jun):** develop hard, then **hold**. Yi has the stronger early and mid game; your late-game spells force bad fights for them. **This is one of the few matchups where you actively want to hold.** Make them invest heavily every time they retake a battlefield, because resources are scarce for Yi.
> - **Isolate in the right direction:** their legend gives a lone *defender* +2. **Drag their lone unit to your battlefield** so it is the attacker, or move their units so they attack into your hold. Never attack a lone defender. Holding with more than one unit also switches their +2 off.
> - **Mulligan:** Void Assault or Faefolk, the drag, plus Punch First.
> - **Early:** take a battlefield with two units on it, so you are never the lone defender yourself.
> - **Middle:** watch Charm (91%): on their turn they can move *your* unit onto their lone defender, which makes you the attacker into their +2.
> - **Closing:** Ruin Runner (69%) cannot be chosen at all, not by Switcheroo and not by Rampage. Beat it in combat or play around it.
> - **Flips:** Tornado Warrior freely. Evelynn into tapped Calm; Not So Fast is in 28%.
> - **Never:** attack into a lone defender.

### Their deck

> **Wuju Bladesman** — *"While a friendly unit defends alone, it gets +2 Might."*

Their +2 cancels Kha'Zix's +2 exactly. **The unit that moves in applies Contested and becomes the attacker** (§190.3.a.1, §464.2.c.1), and an attacking unit is not defending, so their legend switches off — while Kha'Zix's *"attack or defend"* still fires.

| card | in | what it does to you |
|---|---|---|
| **Defy** | 95% | counters your cheap spells — Void Assault included |
| **Discipline** | 93% | +2 at Reaction speed |
| **Charm** | 91% | *"Move an enemy unit"* — their drag, on their turn |
| **En Garde** | 84% | Reaction +1, or +2 if their unit is alone |
| **Zhonya's Hourglass** | 81% | their next dying unit goes home |
| **Punch First** | 80% | your own trick |
| **Rengar, Trophy Hunter** | 75% | the same 6-Might Ambush you run |
| **Ruin Runner** | 69% | 5 Might, can't be chosen by your spells or abilities |
| **Onslaught** | 67% | +6 Might, with Flow |

### Fights

**39 bare · 85 +PF · 98 +Sw · 92 iso** — the isolation number assumes you got the direction right.

- A lone defender of theirs is +2 from the legend and +2 more from En Garde. That is +4 on a unit you thought you had isolated.
- Evelynn and Void Assault pull their unit to you. Walking your unit over does the opposite.

### Flips and counters

**0% · 29% · 29%.**

### Their facedown card

**Zhonya's Hourglass** (81%) or **Back Off** (29%).

### Battlefields

**Emperor's Dais** (79%), **Star Spring** (72%), **Seat of Power** (47%) and **Grove of the God-Willow** (36%). Usual order.

### Board

+2 Ravenbloom Prefect, +2 Acceptable Losses (Zhonya's 81%). −1 Up from the Deep, −2 Star-Crossed, −1 Rampage — Defy counters both. Void Assault stays: it is how you drag. **Switcheroo stays too.** Jun brings it in here and cuts Up from the Deep instead ([Jun's notes §7](khazix-voidreaver-jun.md#7-sideboarding)).

---

## Ezreal, Prodigal Explorer — Tier 2.7 · 2.1% · Mind/Chaos · mean Might 3.61

**In a sentence:** a control deck with an answer for everything — so make it answer two battlefields at once.

> **At the table**
> - **How you win:** take both battlefields and race. They run one cheap unit a deck and cannot contest two.
> - **Mulligan:** two cheap units. Tricks matter less than bodies on the board.
> - **Early:** spread across both battlefields before their 3-drops.
> - **Middle:** they answer one threat at a time with Gust, Star-Crossed, Wages of Pain and Singularity. Present two.
> - **Closing:** at 7 runes, Thousand-Tailed Watcher (95%) shrinks your whole board by 3 for a turn; at 6, Singularity deals 6 to two units.
> - **Flips:** don't. Gust is in every list, Star-Crossed in 95%, and 68% can counter Switcheroo.
> - **Never:** flip a Hidden unit into open Chaos.

### Their deck

> **Prodigal Explorer** — *"Exhaust: [Reaction] Draw 1. Use only if you've chosen enemy units and/or gear twice this turn with spells or unit abilities."*

12 units a deck, 6 Hidden cards and 9 Reactions. The second time in a turn they choose one of your units or gear, the legend draws them a card.

| card | in | what it does to you |
|---|---|---|
| **Gust** | 100% | bounces a 3-Might-or-less unit at Reaction speed |
| **Stupefy** | 100% | −1 and draw |
| **Wages of Pain** | 100% | Hidden: 3 damage at its battlefield |
| **Star-Crossed** | 95% | bounces one of yours |
| **Singularity** | 95% | 6 damage to each of two units |
| **Thousand-Tailed Watcher** | 95% | −3 to all your units for a turn |
| **Vex, Apathetic** | 86% | stuns every unit you play |
| **Hard Bargain** | 55% | counters a spell unless you pay 2 |

### Fights

**32 bare · 85 +PF · 96 +Sw · 92 iso.**

- Punch First is the trick that survives here — Hard Bargain is the only counter that touches it, and paying 2 beats it.
- Vex, Apathetic (86%): kill her before you deploy, as in the Vex entry.

### Flips and counters

**100% · 100% · 68%.**

### Their facedown card

**Wages of Pain** — 3 damage to one of your attackers at that battlefield.

### Battlefields

**Sigil of the Storm** (91%), **Frozen Fortress** (82%, 1 damage to every unit there at each Beginning Phase — Faefolk and Tentacles die) and **Heisho, Shell of the World** (59%, Deflect is ignored there). Usual order.

### Board

**+1 Decree of Strength** (Mind/Chaos — live), +1 Hard Bargain. −1 Evelynn, −1 Tornado Warrior — the Hidden units whose triggers must survive a Reaction they always hold. Punch First stays at 85%.

---

## Fiora, Grand Duelist — Tier 2.8 · 4.1% · Body/Order · mean Might 3.68

**In a sentence:** a straight midrange fight decided by one card — Riposte, which counters any spell you cast and makes their unit bigger.

> **At the table**
> - **How you win:** hold one battlefield, refuse trades, win long (grind 6.5).
> - **Mulligan:** units over tricks. Your tricks run into Riposte.
> - **Early:** take a battlefield.
> - **Middle:** cast tricks only when they cannot pay for Riposte — **2 Energy, one Body and one Order**. Bait it with a cheap spell first.
> - **Closing:** they grow units to 5+ Might (Mighty) for value. Kill or swap the Mighty one.
> - **Flips:** freely — Repulse in 21% is the only thing that touches one. But Switcheroo is a spell, and Riposte counters it.
> - **Never:** cast Punch First into open Body + Order.

### Their deck

> **Grand Duelist** — *"When one of your units becomes [Mighty], you may exhaust me to channel 1 rune exhausted."*

20 units a deck at 3.75 mean. Mighty (5+ Might) is the axis: Fiora, Victorious gains Deflect, Ganking and Shield while Mighty; Sunken Temple draws on a Mighty conquer.

| card | in | what it does to you |
|---|---|---|
| **Riposte** | 95% | Reaction: counter any spell and give their unit + its Energy cost |
| **Punch First** | 88% | your trick, in their hands — it makes a unit Mighty |
| **Fiora, Victorious** | 72% | while Mighty: Deflect, Ganking, Shield |
| **Rampage** | 67% | removal |
| **Harnessed Dragon** | 60% | 8 Energy, kills one of your units on play |
| **Call to Glory** | 58% | Reaction +3, free if they spend a buff |
| **Hidden Blade** | 58% | kills a unit at its battlefield |
| **Rengar, Trophy Hunter** | 51% | 6-Might Ambush |

### Fights

**30 bare · 85 +PF · 97 +Sw · 93 iso** — the trick numbers assume the trick resolves.

- **Riposte answers Punch First with +1**, and Switcheroo with +2. Count their open Body and Order before any spell.
- Isolation needs no spell when you flip Evelynn or Ambush Kha'Zix. Prefer the plans Riposte cannot see.

### Flips and counters

**0% · 21% · 95%.**

### Their facedown card

**Hidden Blade** (58%) — one dead attacker. Attack their battlefield with a spare unit.

### Battlefields

**Sunken Temple** (93%), **Monastery of Hirana** (49%) and **Valley of Idols** (28%, any unit played there can be buffed for `[1]`). Usual order.

### Board

+1 Hard Bargain — to counter Riposte, not to protect flips. −1 Grim Resolve: Riposte punishes it most (+2 to their unit).

---

# Tier 3

## Ornn, Fire Below the Mountain — Tier 3.1 · 1.8% · Calm/Mind · mean Might 2.24

> **At the table**
> - **How you win:** beat it straight (66% bare, your best raw matchup) — but end it, because they win long (grind 14.7).
> - **Watch:** Defy (100%) on your cheap spells; their gear engine. Kill gear.
> - **Flips:** freely (Not So Fast in 5%).
> - **Never:** let it go long.

**Their deck:** a gear engine — 15 units a deck at 2.3 Might, Sprite Fountain tokens, Guardian Angel, Brutalizer, and Ornn, Forge God growing +1 per gear. **66 bare · 98 +PF · 97 +Sw · 98 iso.**
**Board:** +2 Ravenbloom Prefect, +2 Acceptable Losses, +1 Decree (Calm/Mind — live). −1 Switcheroo, −2 Star-Crossed, −1 Rampage, −1 Sabotage — the swap has nothing to swap into, Defy counters both spells, and Decree takes Sabotage's slot.

## Viktor, Herald of the Arcane — Tier 3.2 · 4.0% · Mind/Order · mean Might 3.31

> **At the table**
> - **How you win:** hold one and grind (6.9 — you win long).
> - **Watch:** Cull the Weak (95%) — keep a spare cheap unit. Imperial Decree (73%) makes any damage lethal for a turn. Thousand-Tailed Watcher (63%) at 7 runes.
> - **Flips:** freely — Hidden Blade is in every list and cannot reach a flip.
> - **Never:** attack their battlefield with one unit into a facedown card.

**Their deck:** Recruit tokens from the legend and Viktor, Leader; removal through Hidden Blade, Wages of Pain and Singularity. **38 bare · 89 +PF · 98 +Sw · 94 iso.** Battlefields: Forbidding Waste, **Rockfall Path** (units can't be played there — no Ambush, and no flipping a Hidden unit), **Vilemaw's Lair** (units can't move from there to base — no legend walk-home).
**Board:** +1 Decree (Mind/Order — live), −1 Sabotage.

## Kai'Sa, Daughter of the Void — Tier 3.3 · 1.5% · Fury/Mind · mean Might 3.55

> **At the table**
> - **How you win:** rig every fight and convert one battlefield (grind 12.4 — even to slightly theirs).
> - **Watch:** Falling Star and Hextech Ray (94% each) — 3 damage at Action speed; Thousand-Tailed Watcher (94%) at 7 runes; **Time Warp** (88%) at 10.
> - **Flips:** freely, but pull Evelynn's target from their base — Temporal Breach (65%) guards units at its battlefield.
> - **Never:** fight with Rengar into open Fury.

**Their deck:** spell-heavy burn and card draw; **Void Gate** (94%) adds 1 damage to every spell there. **35 bare · 83 +PF · 98 +Sw · 91 iso.**
**Board:** +1 Decree (live), −1 Sabotage.

## Lucian, Purifier — Tier 3.4 · 0.9% · Fury/Body · mean Might 3.2

> **At the table:** hold one, flip freely, win late (grind 5.8). Their Equipment all grant Assault, so their attacks are bigger than their units; Falling Star (80%) is the removal to respect.

**38 bare · 94 +PF · 97 +Sw · 97 iso.**

## Mel, Soul's Reflection — Tier 3.5 · 1.0% · Mind/Chaos · mean Might 3.33

> **At the table**
> - **How you win:** do not go long (grind 15.3). Convert early.
> - **Watch:** **Rebuttal** (90%) — counters a spell up to 4 Energy, or *steals* it for `[A]`. Your Switcheroo can come back at you.
> - **Flips:** don't — Star-Crossed 90%, Gust 80%.
> - **Never:** cast a key spell into open Mind + Chaos.

**35 bare · 92 +PF · 96 +Sw · 96 iso.**
**Board:** +1 Decree (live), −1 Evelynn.

## Lillia, Bashful Bloom — Tier 3.6 · 2.1% · Calm/Mind · mean Might 3.21

> **At the table**
> - **How you win:** hold one against the token swarm — 9.4 token-makers a deck, the most in the format. Temporary tokens die at their own Beginning Phase, so they never Hold.
> - **Watch:** Defy (93%), Lilting Lullaby (48%, counters a spell and stops you casting spells for the rest of the turn), Unchecked Power (41%, 12 damage to everything at battlefields).
> - **Flips:** freely — but 56% can counter Switcheroo.

**42 bare · 89 +PF · 97 +Sw · 94 iso.**
**Board:** +1 Decree (live), −1 Sabotage.

---

# Tier 4 and below, by how often you will see them

## Zed is the one you will actually meet

> **At the table:** **Zed, Master of Shadows — Tier 5.6 but 3.0% of the field.** Race it — grind 18.2 is the highest in the format, so you cannot win long. Flip only into tapped Chaos (Star-Crossed 52%, Gust 27%). They run your Zed and your Disciples; Perfect Execution (82%) readies a unit for a second attack.

**35 bare · 89 +PF · 97 +Sw · 95 iso.**

## Vi, Piltover Enforcer — Tier 4.1 · 2.1% · Fury/Order

> **At the table:** hold one and grind (5.7). Flip freely. Vi, Peacekeeper (every list) stuns your best attacker; Hextech Gauntlets (96%) and Vi, Hotheaded (52%) inflate their Might.

**36 bare · 91 +PF · 98 +Sw · 96 iso.**

## Diana, Scorn of the Moon — Tier 4.2 · 2.0% · Mind/Chaos

> **At the table (Jun):** read their open Energy every turn. If you win the fight against what they have left open, punish them for spending runes on development. If they kept too much up, develop instead. They hold battlefields well and are stronger very late, so do not stall too long, and do not over-extend early. Use Sabotage when they hold Energy up, but only once your board is developed. **Play as if you had no Hidden cards**: Star-Crossed 95%, Gust 91%, and 91% can counter Switcheroo. **Never flip Evelynn into open Chaos.** Moonfall (95%) drags your unit and gives it −2.

**39 bare · 93 +PF · 97 +Sw · 96 iso.**
**Board:** +1 Decree, +1 Hard Bargain; −1 Evelynn, −1 Tornado Warrior.

## Kha'Zix, Voidreaver — the mirror · Tier 4.3 · 1.5%

> **At the table:** land the first clean combat win and buff off it — the mirror is decided by XP. Drag their unit to yours so *they* attack. Flip into tapped Chaos (Star-Crossed 72%).

**43 bare · 91 +PF · 98 +Sw · 95 iso.**

## Teemo, Swift Scout — Tier 4.7 · 1.5% · Mind/Chaos

> **At the table:** beat the tiny board straight (61% bare). They run 24 Hidden cards a deck. Flip into tapped Chaos (Gust 27%, Star-Crossed 13%), and pull Evelynn's target from their base (Temporal Breach 53%).

**61 bare · 95 +PF · 98 +Sw · 97 iso.**
**Board:** +1 Decree (live), −1 Sabotage.

## Nasus, Shen, Draven, Ambessa, Sett — 1.0–1.6% each

> **At the table:** ordinary fair fights. Nasus has a few very large bodies — save Switcheroo for those.

All within a few points of 36–43 bare, 76–97 with Punch First. **Nasus is the outlier: 76 with Punch First and 83 isolated**, the worst Punch First conversion on the page, because 3.65 mean with a 2 median means a few very large bodies. **Nasus is Mind — Decree live.**

## The worst board in the game is Tier 5

> **At the table:** Volibear — no fair fight exists. Switcheroo is the matchup.

**Volibear, Furious — Tier 5.3, 0.7%, mean Might 6.46.**
**3% bare. 27% with Punch First.** 63% isolated plus Kha'Zix. **97% with Switcheroo** is the entire matchup. You will almost never see it, but if you do, the swap is not a nice-to-have.

---

## Between games: the pocket card

The Tier 1–2 entries above, cut to one row each. `scripts/build-journal` prints this table as `matchup-card.pdf`, so **edit it here** and the card follows. It is a note from outside the match: **read it between games, never during one** (TR §416.4, §416.5), which is also when you sideboard.

| opponent | Jun | plan | flips | never | board | battlefield |
|---|---|---|---|---|---|---|
| Irelia | decent | press: score early, reach 6 first | Tide/Tornado into tapped Chaos; Evelynn into tapped Chaos + Calm | Void Assault or Rampage into open Calm | +2 Gust +1 Hard Bargain; −2 Star-Crossed −1 Punch First | their Targon's Peak favours them |
| Akali | decent | one fight early, your turn only; fight before Heron lands | Tornado freely; Evelynn and Switcheroo into tapped Calm | a 2-Might attacker into their facedown card (Marai) | +2 Prefect +2 Acceptable Losses +1 Hard Bargain; −2 Rampage −2 Star-Crossed −1 Up from the Deep | no Rengar fights at Void Gate into open Fury |
| LeBlanc | superb | one fight early, rigged only; points, not kills | freely | trading just because you can (Karthus) | +1 Decree; −1 Sabotage | never your Star Spring |
| Jayce | superb | take both, race; answer Aurora | freely; Evelynn pulls from their base | a fair fight (15%) | +2 Prefect +1 Decree; −2 Punch First −1 Up from the Deep | Forgotten Monument slows your race |
| Azir | good | develop, then clear them at once | freely | Star-Crossed or Void Assault into open Calm | +2 Prefect +2 Acceptable Losses; −1 Zed −1 Up from the Deep −1 Star-Crossed −1 Merchant | usual order |
| Rengar | even | patient, hold one; make them act first | freely | committing everything to one fight | +1 Rampage +1 Hard Bargain; −1 Grim Resolve −1 Sabotage | avoid your Star Spring |
| Vex | — | hold one, grind; kill Vex, Apathetic before you deploy | Tornado into tapped Chaos; Evelynn into tapped Chaos + Calm | playing units while Vex, Apathetic stands | +1 Hard Bargain; −1 Grim Resolve | usual order |
| Kennen | tough, weaker post-ban | pressure their setup; kill Kennen, Storm of Shuriken on sight | only into tapped Chaos | an even trade | +2 Gust +1 Hard Bargain; −2 Star-Crossed −1 Tornado Warrior | they run Zaun Warrens too |
| Rek'Sai | — | hold one, let time work | freely | Rengar into two open Fury | none | never your Star Spring |
| Master Yi | even to slightly unfavoured | develop, then hold; drag their lone unit to you | Tornado freely; Evelynn into tapped Calm | attacking a lone defender | +2 Prefect +2 Acceptable Losses; −1 Up from the Deep −2 Star-Crossed −1 Rampage | usual order |
| Ezreal | — | take both, race | don't | flipping into open Chaos | +1 Decree +1 Hard Bargain; −1 Evelynn −1 Tornado Warrior | usual order |
| Fiora | — | hold one, win long | freely | Punch First into open Body + Order (Riposte) | +1 Hard Bargain; −1 Grim Resolve | usual order |

"Usual order" is Zaun Warrens, then Sandswept Tomb or Star Spring. Every battlefield used in a decided game retires for the match, yours and theirs (§486.5).

---

## Quick reference

### What can punish a flip, and what can counter Switcheroo

| archetype | removes your hidden unit | …or counters Evelynn | counters Switcheroo |
|---|---|---|---|
| Ezreal | 100% | 100% | 68% |
| Mel | 100% | 100% | 90% |
| Diana | 95% | 95% | 91% |
| Kennen | 92% | 92% | 38% |
| Mirror | 83% | 89% | 61% |
| Vex | 78% | 82% | 45% |
| Irelia | 66% | **96%** | 77% |
| Zed | 61% | 61% | 24% |
| Teemo | 40% | 40% (+53% Breach) | 27% |
| Akali | 2% | **67%** | 67% |
| Master Yi | 0% | 29% | 29% |
| Fiora | 0% | 21% | **95%** |
| Lillia | 0% | 4% | 56% |
| Jayce | 0% | 2% (+43% Breach) | 2% |
| Azir · Rengar · Ornn | 0% | 5–7% | 5–12% |
| **LeBlanc · Rek'Sai · Viktor · Vi** | 0–4% | 0–4% | 0% |

"Breach" is Temporal Breach guarding the unit Evelynn chose — it only matters if that unit stands at their facedown card's battlefield.

### Where Decree of Strength is live

**31% of the ranked field is Mind**, far more than the two archetypes the previous dossier named.

**Tier 1–3:** LeBlanc (1.3) · Jayce (1.4) · Ezreal (2.7) · Ornn (3.1) · Viktor (3.2) · Kai'Sa (3.3) · Mel (3.5) · Lillia (3.6)
**Below:** Diana · Teemo · Nasus · Lux · Jhin · Rumble · Ahri · Renata Glasc

**This changes the sideboard case.** Decree went to one copy when it looked live against two of eleven archetypes. Across the real field it is live against roughly a third, including **two Tier 1 decks**. Whether the second copy is worth a slot is a question for Jun ([deck guide §13](khazix-voidreaver.md#13-questions-to-bring-to-jun)), not an edit to make.

### Who out-grinds you (your grind is 12)

**They win long (above 12):** Zed 18.2 · Kennen 17.0 · Jayce 15.9 · Mel 15.3 · Nasus 15.1 · Ornn 14.7 · Akali 14.2 · Kai'Sa 12.4 · LeBlanc 12.2
**Roughly even (10–12):** Irelia 10.9
**You win long (below 10):** Rek'Sai 1.8 · Sett 4.4 · Ambessa 5.1 · Draven 5.2 · Vi 5.7 · Lucian 5.8 · Fiora 6.5 · Viktor 6.9 · Ivern 7.8 · Azir 7.9 · Rengar 8.0 · Vex 9.4

### Who cannot contest two battlefields

**Azir 0.3 cheap units · Ezreal 0.8 · Volibear 0.9 · Jayce 1.5 · Miss Fortune 2.9.** Against these, take both and race.

### Battlefields that change how you play

| battlefield | who brings it | what it does to you |
|---|---|---|
| **Rockfall Path** | Viktor, Kai'Sa, Mel, Diana | units can't be played there — no Ambush, and **a Hidden unit hidden there can never be flipped** |
| **Vilemaw's Lair** | Viktor, Ezreal | units can't move from there to base — your legend's walk-home and Star Spring both fail |
| **Void Gate** | Akali, Kai'Sa | +1 damage on every spell or ability there — Falling Star is 4 + 4 |
| **Frozen Fortress** | Ezreal, Kai'Sa | 1 damage to every unit there each Beginning Phase |
| **Forbidding Waste** | Rek'Sai, Viktor, Akali, LeBlanc | a lone defender is −2 — your isolation gets better, your lone defender worse |
| **Mystic Vortex** | Rek'Sai | Reactions cost `[A]` more in showdowns there, Hidden flips included |
| **Trifarian War Camp** | Azir, Rek'Sai | +1 Might to every unit there |
| **Forgotten Monument** | Jayce, Akali | nobody scores there until their third turn |

---

## Sources and method

**Archetype shares and the simulation inputs** are `data/decks.json` restricted to **992 decks dated 2026-09-24 to 10-01**, with the **2026-09-23 bulk-import day excluded**. That day is 901 decks posted in a few minutes and it skews every share it touches — with it in, Punch First reads 12% and Cleave 22%; with it out, 20% and 9%. Archetypes with fewer than 6 archived lists are omitted.

**Card play rates, deck shapes, battlefields and the flip table** were re-read on 1 October from the same window, which had grown to **1,048 decks**; a card's rate is the share of lists holding at least one copy, alternate printings counted once. Every bare, +PF and isolation figure on this page reproduces within two points against that larger set.

**Tier placement** is riftbound.gg's Vendetta list scraped **2026-10-01** — 49 ranked archetypes.

**The Los Angeles claim** is the deck author's, carried in `ce`/`cp` and not in an upstream result field. `data/events.json` independently records the **Riftbound Regional Qualifier – Los Angeles, 26 September, 2,165 players**. The event and its size are records; the Top 32 finish is a claim, and the card-for-card match against your list is this repo's own comparison.

**Simulations** are Monte Carlo at 120,000 trials implementing §465.2 and §466.3 directly: a clean win when your Might total strictly exceeds theirs. Your distribution is the 24 units of the current list weighted by copies (mean 3.04); theirs is each archetype's units in the archive weighted by copies. **The +PF and +Sw columns assume the spell resolves** — read them next to the counter rates in each entry.

**Grind** is not defined anywhere in this repo. Reverse-engineered, it behaves like the copies per deck of cards whose text mentions **draw, trash, recycle or Flow**: that count gives your list exactly 12 and Irelia 10.9, lands within a point for Kennen, Vex, Fiora, Jayce and Ezreal, and misses Rek'Sai and LeBlanc by 2.4 and 2.8. It is a keyword count, not a measured card-advantage rate, so read it as direction: well above or well below 12 means something, 10.9 against 12 does not.

**Flip threats** count Reaction-speed cards **from hand** that can remove your hidden unit at your battlefield — Gust, Star-Crossed, Shakedown — and the two that counter Evelynn's trigger, Not So Fast and Repulse. **Facedown cards are excluded** because a hidden card's targets must be at its own battlefield (§811.1.d.2), and theirs is never at yours (§811.1.b, §323.7); earlier versions of this page counted Hidden Blade and Temporal Breach and were wrong to. Temporal Breach is reported separately, because it can blink *their* unit that Evelynn chose. **Switcheroo counters** are Not So Fast, Repulse, Hard Bargain, Abandon, Riposte, Rebuttal, Wind Wall, Lilting Lullaby, Flurry of Feathers and Crumbling Sands — every spell counter in the field except Defy, which Switcheroo's 2 Power puts out of reach.

**What this page does not claim.** Shares below about 2% rest on 10–20 decks and should be read as shape rather than measurement. The archive holds 8 days rather than the 60 its window declares, so **ordering is reliable and small gaps are not.** Nothing here claims the deck is good — it claims the deck has a regional result and a knowable set of matchups.
