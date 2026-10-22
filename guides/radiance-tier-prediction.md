---
title: Radiance — The Preseason Poll
subtitle: Riftbound, 21 Oct 2026, two days before Radiance is legal. Committed predictions for all 58 legends, built like a preseason college football ranking.
author: rift toolchain
date: 2026-10-21
---

**The live ranking is the model, `scripts/rift poll`** (data/preseason.json, lib/preseason.mjs).
It computes this page's method from scored, sourced inputs, and hands over to real results as
they arrive. The numbered ranks below are the hand-made poll of 21 Oct, kept as written because
the scorecard grades them. Where the two differ, the model is the one to use.

**What the model learned from Riftbound's own history** (Riot's nine RQ write-ups):
- **About 60% of a legend's edge survives a new set.** This page's hand poll assumed all of it.
- **New legends are not weaker at launch.** At each set's first RQ they did as well as the
  older legends or better. The "new legends are overrated" discount used above was wrong, and
  the model drops it.
- **The crowd picks the winners among new legends.** The most-registered new legend at the
  first RQ became a top deck three times of three: Draven, LeBlanc, Kennen.

The model published **data only** until 22 Oct; since then its card reads (the judgment rows)
count at a third, with the data-only score kept beside them for grading. After its audit on 21 Oct the top six were Kennen, Riven,
Kai'Sa, LeBlanc, Rengar and Master Yi. The audit fixed one bug: Yasuo had zero pilots at Vendetta's RQs, and the model had read
that as a blank slate rather than as evidence nobody played it, which put a meme Spiderling list
— one identical list copied by 12 preview pilots — 5th. It is now 14th.

**22 Oct: that list was never a deck.** NovaRiftbound said after Showdown 5 that every all-Spiderling
list came from a player who asked to keep their real list private until the RC; the 3rd-place one
was Kennen. `build-decks.mjs` now holds such placeholders apart (12 of Nova's 74), so they count for
no legend, and Yasuo, with no real preview pilots, is NOT ENOUGH DATA. The hand poll's #11 below
stays as written, because the scorecard grades it, and it will likely miss.

**These are predictions, and they are meant to be graded.** No sanctioned Radiance event has been
played yet. This page ranks all 58 legends 1 to 58, names the risers, sleepers and busts, and ends
with a scorecard of calls to check against the first real results.

## How the poll was built

The method follows Bill Connelly's preseason SP+ projections and the AP voters' habits. A ranking
of what Radiance changed for each legend sits on top of that base.

- **Returning strength, about half the weight.** This is Day 2 conversion at the last three RQs:
  Los Angeles, Singapore and Barcelona, with 5,985 Day 1 pilots between them. A deck carries most of
  itself into a new set. SP+ treats last season plus returning production as about two-thirds of
  its preseason formula.
- **Transfers, the main driver of change.** This counts the Radiance cards that slot into the
  legend's *existing* engine. In SP+, a transfer with past production counts; a recruit's star
  rating barely does. A new card that fits a proven deck is the first kind.
- **Recruiting, low weight.** This is the raw power of new cards with no proven shell around them,
  which is where the new legends sit. SP+ cut recruiting from 20–25% of its formula to 1–2%.
- **Schedule.** This is how each deck matches up against the predicted top of the field, and
  against Radiance's new hate.
- **Hype discount.** New legends carry this penalty. When Spiritforged launched, its new legends
  took 11 of 32 top-8 slots in the first big events and none reached a final; the Origins incumbent
  Kai'Sa won all four of the largest.

**New interactions** were found by reading every legend's ability and champions against all 167
Radiance cards. The combos named here are checked against Riot's rules text, and rule numbers are
given where it matters. Preview finishes (two online events of 74 and 50 players, before the legal
date) are evidence, **not results**.

**Trust the top of the poll more than the middle.** Of AP preseason top-5 teams since 2014, 92%
finished the season ranked, against 30% of teams ranked 21–25. The same applies here: ranks 1–10 are
the calls I would stake something on, and 20–45 is mostly noise.

**Two things change who you face without changing strength:**
- **Best-Of foils at Regional Championships.** Only Unleashed, Vendetta and Radiance legends can win
  them. *(nB)* marks legends that can't, which means fewer of them at RCs.
- **Aurora decks are opponents only.** They are marked *(Aurora)* because you will face them, never
  because you should pick one.

---

## The Top 10

**1. Kennen, Heart of the Tempest** — *the defending champion*
- **Returning strength:** Vendetta's best deck by a distance, ×1.76 conversion, and ×1.66 or better
  at every RQ.
- **Transfers:** Trifarian Captain is already in 100% of its preview lists.
- **The new line:** Meticulous Restorationist on the Rhasa turn. Rhasa's *printed* cost is 10, so
  Restorationist comes back from the trash for one Order Power however little Rhasa cost you
  (§206). The replay also empowers the legend, and no Kennen list runs Restorationist yet.
- **Schedule:** Radiance prints no hate against an opponent's trash.
- **The risk:** Riven's tempo arriving before Kennen's trash fills.

**2. Kai'Sa, Daughter of the Void** *(nB)* — *the riser*
- **Transfers:** the biggest real upgrade any older legend received. Bilgewater Tracker is in 100%
  of her preview lists, The Empyrean in 75% and Lost to the Sands in 58%. She took 2nd of 74 at the
  Nova preview.
- **Untapped:** Kai'Sa, Rebel. While Rebel is in a showdown, your spells have Reaction. That makes
  Falling Star a combat trick, and lets Time Warp be cast on the opponent's turn, so you take two
  turns in a row while holding up interaction.
- **Schedule:** Scorched Earth answers the wide boards Riven and Kennen build.
- **History:** she won big events in both Origins and Spiritforged (Azir has since won RQs in two formats too). Expect her to beat
  her play rate; the Best-Of rule keeps her numbers low at RCs.

**3. Riven, The Exile** — *the best newcomer, discounted for hype* · *your deck*
- **Preview:** 1st, 8th, 11th and 16th of 74 at Nova, and her lists already agree on a core.
- **The new line nobody plays:** under Riven, a flipped Hidden unit always enters ready. A hidden
  card can only be played to its own battlefield (§811.1.d.1), and hidden cards on battlefields you
  don't control are removed (§323.6.a), so every flip lands where Riven's ability applies. Momentary
  Companion (in 72% of Evelynn lists, not in Riven's) becomes a free, ready 4-Might body.
- **Counters:** Rockfall Path ("Units can't be played here"), which switches her legend off on
  that battlefield and is in 27 of the 30 Kai'Sa lists running Radiance cards (22 Oct); gear
  removal on Blade of the Exile; and Vex, Apathetic, which stuns a unit played at her battlefield
  and stops it moving that turn. A stunned unit contributes no Might to combat damage
  (§424.1.b); nothing in §424 exhausts it, so the ready unit stays ready for exhaust costs.

**4. LeBlanc, Deceiver**
- **Returning strength:** ×1.35, steady across all three RQs.
- **The new line:** her consensus list already runs 3 Harnessed Dragon and 3 Rift Herald, both cost 8, and
  each one lets you replay Meticulous Restorationist from the trash. No LeBlanc list runs it.
- **Also new:** Mournful Spirit's Deathknell doubles under Karthus.
- **Schedule:** Radiance prints little banish, the one thing her Deathknell plan fears.

**5. Rengar, Pridestalker**
- **Returning strength:** ×1.29.
- **The new line:** Rally for War is an attack without a move. Its three Recruit tokens count as
  three units played, so the legend triggers three times. The tokens contest the battlefield
  (§190.3.a.1), so you are the attacker. Banner of Conquest gives them Assault.
- **The risk:** splash damage (Bilgewater Tracker, Scorched Earth) against his 1-Might bodies.

**6. Master Yi, Wuju Bladesman** *(nB)*
- **Returning strength:** ×1.27, and 89 Day 2s across Vendetta's three RQs, third behind Kennen (202) and Irelia (105).
- **The new line:** Hunting Blind, deployed on your own turn, moves an enemy unit into your lone
  Shield 2 defender. That unit made the battlefield contested, so it is the attacker, and the fight
  effectively removes it. Ntofo Strikes and Staunch Survivor are cheap Calm/Body defence.
- **The risk:** go-wide decks.

**7. Irelia, Blade Dancer** *(nB)* — *falls one tier*
- **Transfers:** Blade of the Exile works with her ready engine, since choosing a unit to equip
  readies it. Battle Preparations is in 67% of her preview lists.
- **Schedule:** Riven competes for the same colours and the same players.

**8. Azir, Emperor of the Sands** *(nB)*
- **Returning strength:** ×1.36.
- **Schedule:** Radiance is a wave of gear removal: Lost to the Sands, An Offer You Can't Refuse,
  Burn Away and Stalwart Goatherd.
- **The patch:** Watchful Curator gives his gear Deflect, and only one Azir list, unplaced, runs it (22 Oct).

**9. Vex, Gloomist** — *the riser nobody's talking about*
- **Returning strength:** ×1.10.
- **Schedule:** Apathetic is the natural answer to the two most-posted new decks in her colours,
  Riven and Evelynn, so the field tilts toward her.
- **The new line:** Pitiless Stalker's stun pulls in Vex, Mocking.

**10. Jayce, Defender of Tomorrow** *(Aurora — opponent only)*
- **Returning strength:** ×1.29.
- **Schedule:** Radiance aims more gear removal at Aurora than anything else, and non-Aurora Jayce
  is a brew, not a deck.

## 11–25

11. **Yasuo** *(nB)* — the dark horse. Best preview record of any legend (3rd, 5th, 6th of 74) with
    no Radiance card in any list. Bushwhack Trap's extra hide slot adds to it; Bedeviling Stranger
    punishes it.
12. **Ezreal** *(nB)* — ×1.33. The field is suddenly full of gear, and his answers hit it while
    drawing.
13. **Kha'Zix** · *your deck*
    - ×1.23. New line: Siren's Song moves one attacker out, then Ambush Mutating Horror in against
      the one left alone.
    - No Kha'Zix list runs Siren's Song. Pick between Jun's lists, don't edit them.
14. **Mordekaiser** · *your deck* — the best case among the new legends after Riven. Dune Devourer
    plus the 7+ chain (Forbidden Technique and Restorationist from the trash) is real ramp. Hype
    discount: none of its 5 preview pilots reached the top quarter.
15. **Diana** — ×1.08. Kai'Sa, Rebel turns her showdown-only Energy into Reaction-speed spells.
16. **Evelynn** — Riftbound Insider's #1 new legend.
    - Bushwhack Trap plus Evelynn, In Control makes 2-point holds.
    - Discounted: her two Nova pilots finished 35th and 58th, and Vex is waiting.
17. **Akali** — Akali, Brash plus the legend's move-to-base is a ready Brash, a free card and Power
    back. 4th and 7th of 74 at Nova.
18. **Annie** *(nB)* — **the sleeper of the set**; see below.
19. **Ekko** — the legend's discount turns Firebrand Raider into a 4-Energy, ready 6-Might attacker.
    The legend kills it at end of turn, before its "units don't ready" lock ever reaches an Awaken.
20. **Viktor** *(nB)* — Heimerdinger turns every token he makes into a 3-Might Mech. Only 4% of
    Viktor lists run Heimerdinger.
21. **Ziggs** — Bombs are Deathknell (§187.12), so Detonation Amplifier fires each one twice.
    Discounted because they are fragile gear in a gear-hate format.
22. **Rek'Sai** *(nB)* — ×0.99. Mordekaiser takes its colours, and Radiance's sweepers hit its wide
    board.
23. **Orianna** — strong if the field doesn't pack gear removal. It will.
24. **Ornn** *(nB)* — better tools, but the deck the new hate is aimed at.
25. **Seraphine** — the token engine is real; Avalanche, which hits bases, is printed to punish it.

## 26–45

26. **Sivir** *(nB)* · *your deck* — the Gold and Hidden fit is real: her legend turns Radiance's
    Power costs into Gold. The card pool around it is thin. Your Gold-midrange build is the test.
27. **K'Sante** — the Armored Tusker line is spicy; stun ignores Shield.
28. **Teemo** *(nB)* — Strigian Oracle predicts every time it exhausts, which plays Nocturne,
    Horrifying for one Power. Evelynn still does facedown better.
29. **Ambessa** — **sleeper.** While Empowered, The Wolf can't be damaged outside combat, and nearly
    all of Radiance's removal is damage. Ambessa lists don't run any of it yet.
30. **Nasus** — Heartening Soul readies his legend, so he ramps twice in a turn. The timing is
    rules-checked, and no Nasus list runs it.
31. **Fiora** *(nB)* — Herald of the Emperor sets a unit's base Might to 5, which makes it Mighty.
32. **Jarvan IV** — Martial Paragon gives Deploy gear Action speed. Mid-fight, drop Pillaged Armory
    and move a fresh unit in. Discounted for the gear hate.
33. **Miss Fortune** *(nB)* — Bloodscent Swarm and Sneaky Zeebles finally pay off her
    open-battlefield plays.
34. **Lillia** — her Temporary Sprites become free costs for Parallel Convergence.
35. **Vi** — Brawl is exactly the enabler her excess damage lacked.
36. **Zed** — Rhasa plus Forbidden Technique: the printed 7+ cost (§206) triggers it from the trash
    and readies Rhasa.
37. **Garen** — Heimerdinger Mech-wide makes Recruit the Vanguard four 3/3s. Bedeviling Stranger is
    its predator.
38. **Draven** *(nB)* — combat fixers (Pitiless Stalker, Siren's Song), but no early champion.
39. **Lucian** *(nB)* — Nazuman Ntofo is a 1-Energy Equipment his lists run 0 of. Gear hate caps him.
40. **Ahri** *(nB)* — Ahri, Confident gives shrink control a threat that grows.
41. **Rumble** *(nB)* — only one Radiance card, Clocktower Guardian, is actually a Mech. Incorrigible
    Construct and the rest make Mech tokens but aren't Mechs, so the bodies get none of his buffs.
42. **Jinx** *(nB)* — better discard outlets, but no new payoff.
43. **Jhin** — Kai'Sa, Rebel fixes his sorcery-speed problem; the legend is still slow.
44. **Leona** *(nB)* — Riven, Broken Blade gives her a double-stun loop; Storm Raptor draws off it.
45. **Pyke** — Shimmering Swimmer and Gold is a repeatable 2-damage machine, in a value deck in a
    tempo format.

## 46–58

46. **Volibear** *(nB, Aurora consensus)*
47. **Shen**
48. **Jax** *(nB)* — Ntofo gives him a real draw engine, from a long way down.
49. **Lux** *(nB)*
50. **Renata Glasc** *(nB)*
51. **Lee Sin** *(nB)*
52. **Sett** *(nB)*
53. **Darius** *(nB)*
54. **Mel**
55. **Poppy**
56. **Renekton**
57. **Ivern**
58. **Master Yi, Wuju Master** — Radiance prints no new XP sources.

---

## The sleeper: Annie, Dark Child

The boldest call on this page. Annie's lists run zero Radiance cards, she had 9 RQ pilots in
Vendetta, and she is ranked here at 18. The reasons:

- **Annie, Fiery is a Bomb multiplier.** Her text is "Your spells and abilities deal 1 Bonus
  Damage". Riot's rules use her as the example of Bonus Damage applying to each target separately
  (§715.2). A Bomb's Deathknell is your ability (§187.12), so every Bomb hits for 3. Detonation
  Amplifier fires each Bomb twice.
- **Radiance prints the Bombs in her colours.** Amateur Demolitionist, Hexplosive Minefield and
  Satchel Charge are all Fury or Fury/Chaos, and Bilgewater Tracker deals 1 to each of up to two units.
- **Her legend pays for Minefield on the opponent's turn.** Annie readies two runes at the end of
  your turn, which is exactly Hexplosive Minefield (2 Energy + 1 Power, Action speed). Cast it in a
  showdown on their turn to pop your Bombs where they attack, then replant them at end of turn.
- **Why only 18:** none of this has been played, Burn Away banishes Bombs (no Deathknell), and the
  format is full of gear removal. **Also watch Ziggs:** he can splash Annie, Fiery, and none of his
  lists do.

## Week one versus steady state

Martin Juza's three stages of a new format apply. Week one is proactive decks; week two, midrange
that beats copied aggro; week three, four to six real tier-1 decks with control arriving.

- **Weeks 1–2:** expect Riven, Rengar and Kennen at the top, and lots of Evelynn and Ziggs on hype.
  Kai'Sa, Vex and Mordekaiser arrive later.
- **Steady state:** Kennen and Kai'Sa, with Vex as the deck the field adjusts to.

## The scorecard

Graded +1 for a hit and −1 for a miss, the way reviewers' set calls have been scored, against the
first three weeks of sanctioned Radiance events (23 Oct – 13 Nov 2026).

1. Kennen is the most-played legend at the first RQ-sized event, and converts above ×1.2.
2. Kai'Sa converts in the top 3 of legends with 20+ pilots, despite the Best-Of rule.
3. A new legend top-8s an RQ-sized event, but no new legend wins one in the first three weeks.
4. Riven is the most-played new legend.
5. Irelia converts below Riven.
6. Annie posts a top-25% finish at a 64+ player event, or Ziggs lists adopt Annie, Fiery.
7. Watchful Curator appears in 25%+ of Azir or Orianna lists by 13 Nov.
8. Vex's share rises from week 1 to week 3.
9. Neither Teemo nor Rumble converts above ×1.0 with 20+ pilots.
10. Jayce's share falls below its Vendetta share.

## Sources

**Data (this repo)**
- RQ Day 2 tables: data/topdecks.json.
- Preview standings and lists: data/decks.json.
- Card shares: data/rising.json.
- Card text: data/cards.json.
- Rules: docs/rules-full.md (§187.12, §190.3.a.1, §206, §323.6.a, §715.2, §811.1.d.1).

**Method**
- [ESPN, 2026 SP+ rankings](https://www.espn.com/college-football/story/_/id/48306284/2026-college-football-sp+-rankings-138-fbs-teams)
  (Bill Connelly, 27 Mar 2026).
- [RotoWire, How reliable is the preseason poll](https://www.rotowire.com/cfootball/article/how-reliable-is-the-preseason-poll-126481)
  (6 Aug 2026).
- [Martin Juza, the 3 stages of exploring new formats](https://ultimateguard.com/es/blog/martin-juza-3-stages-of-exploring-new-formats)
  (16 Jun 2022).
- [riftbound.gg, Spiritforged's first tournaments in China](https://riftbound.gg/?p=1646)
  (Dec 2025).
- [CoolStuffInc, grading reviewers' set calls](https://www.coolstuffinc.com/a/review-review-roe-edition)
  (Dec 2010).

**Opinion**
- [riftbound.gg, 10 Most Buffed Legends with Radiance](https://riftbound.gg/10-most-buffed-legends-with-radiance/)
  (20 Oct 2026).
- [Riftbound Insider, Radiance's BEST and WORST Legends](https://www.youtube.com/watch?v=4kFtgkfduSs)
  (9 Oct 2026).
- [tcgtalk, Radiance best cards](https://tcgtalk.com/guides/riftbound-radiance-spoilers-best-cards).
- r/riftboundtcg threads, linked in the earlier draft's history.

**Prizing**
- [Riot, Regional Championships prizing](https://playriftbound.com/en-us/news/organizedplay/regional-championships-competitive-integrity-prizing/)
  (15 Oct 2026).
