# Rulings not yet in the rules

Answers from Riot's dev/design or judge staff that decide a question the published rules
leave ambiguous. **Nothing here can be derived from [rules-full.md](rules-full.md)** — that
is the entire reason the file exists. Each entry records a question that was actually asked,
the answer that was actually given, and the rules the answer composes, so the next person
can check the reasoning rather than take it on faith.

**Where these sit.** Below the current FAQ ([rules-faq.md](rules-faq.md)), which Riot states
outranks the Core Rules outright. Above any reading of the Core Rules arrived at by
inference, including mine. A ruling is superseded the moment a rules update absorbs it, and
every entry names the update it is waiting for.

**On provenance.** These arrive second-hand — screenshots, relayed judge answers, translated
posts — far more often than as a published document. Each entry says plainly how strong its
source is. A ruling whose primary document nobody in this repo has read is still worth
recording, but it is worth recording *as that*.

**Format.** One `##` per ruling, with `**Date:**`, `**Source:**`, `**Rules:**` and
`**Expires:**` lines. `scripts/check.mjs` parses those four and asserts that every `§`
cited resolves to a real rule in the Core Rules, so a ruling cannot quietly cite a rule
number that does not exist or that a future rules update renumbers.

---

## A Hidden permanent removed in response to its own play effect loses the target

**Date:** 2026-09-17
**Source:** Riot dev/design, relayed in judge channels, confirming an existing CN ruling — quoted verbatim below. Secondary: the primary document has not been read directly from this repo.
**Rules:** §811.1.d.3, §811.1.d.3.a, §359.3.e.12, §359.3.e.5, §359.3.e.6
**Expires:** absorbed. The Core Rules of 2026-10-09 wrote it in as §811.1.d.3.a, as dev said they would. Kept for the reasoning and the from-hand contrast, which the rule's own example does not draw.

> **Now a published rule.** §811.1.d.3.a (Core Rules 2026-10-09): *"A play effect of a
> permanent played from facedown references information from its source when determining
> what battlefield it was played from and what targets are legal. … If the unit is no longer
> on the board when the play effect attempts to resolve, the play effect will not be able to
> reference the information of where the unit was played from, and it will mistarget."* The
> same update split the old §811.1.d.2 in two: a hidden **spell** targets at the battlefield
> it was played *from* (§811.1.d.2), a hidden **permanent's** play effect at the battlefield
> it was played *to* (§811.1.d.3). Rule numbers below are the current ones.

**Question.** Kennen, Keeper of Balance (`VEN-135`) reads *"[Hidden] · When you play me or I
attack, you may pay `[2]` to [Stun] a unit."* He is played from Hidden at a battlefield, his
play effect is finalised with a target chosen, and the opponent responds with Gust
(`OGN-169`, *"return a unit at a battlefield with 3 Might or less to its owner's hand"*)
targeting **Kennen himself**. Does the unit still get stunned?

**Ruling. No — the stun does not happen.** But only because he was played from Hidden. The
same play against a Kennen played from hand *does* still stun.

**Why.** Quoting the answer:

> …the play effect itself doesn't contain the information of what battlefield its source was
> played from; it has to reference that information from its source itself. If the source is
> no longer on the board to have its information referenced (per 359.3.e.12), the triggered
> ability can't confirm that the target in question is at the correct battlefield, and thus
> that target will not be legal.

So the chain runs: §811.1.d.3 pins a hidden permanent's play-effect target to the battlefield
it was played to → that battlefield is **not carried by the chain item**, it is read off the
source → §359.3.e.12 makes any read off an off-board permanent return null, and a unit that
has left the board explicitly "has no location" → the target cannot be confirmed legal →
§359.3.e.5 and §359.3.e.6 ignore the instruction (a mistarget, in §811.1.d.3.a's word).

**The contrast that makes it make sense:**

| Kennen played… | Gusted in response to the trigger | Result |
|---|---|---|
| from hand | yes | **Still stuns.** No battlefield restriction exists, so nothing needs reading off the source. |
| **from Hidden** | yes | **No stun.** The restriction exists and is anchored to the source. |

**What this does *not* change.** The 2 Energy is the base cost of the triggered ability and
is paid at finalisation (§204.1.c), so it is spent either way. The ability is not countered
and does not fizzle — it resolves, and only the instruction whose target went illegal is
ignored. A triggered ability generally outlives its source: Overzealous Fan kills itself as
its own finalisation cost and still moves the attacking unit.

**Why it was easy to get wrong.** Until 9 Oct nothing in §811 mentioned resolution, and
nothing in §359.3.e mentions Hidden. The composition is the ruling, and §359.3.e.12 is phrased as "location,
zone, or status has changed such that that information is no longer available" — it contains
none of the words *bounce*, *return to hand* or *leaves the board*, so searching the verbatim
rules in a player's vocabulary will not surface it. See
[When the source leaves the board](rules.md#when-the-source-leaves-the-board).

**Practical note — it is about choice, not legality.** By default a unit may be played to
its controller's base *or* a battlefield they control (§355.2.a), so a Kennen cast from hand
*can* legally be put on a battlefield and Gusted there. The difference is that from hand
that is optional and you will normally choose base, where Gust — which requires a unit "at a
battlefield" — cannot reach him. **From Hidden it is compulsory**: §811.1.d.1 says a hidden
permanent *must* be played to that battlefield, and you hide only at battlefields you
control (§811.1.b). So Hidden removes the safe option, and at 2 Might he lands inside Gust's
range with no say in it. He has no Ambush, so battlefields he does not control are not
available to him either way (§822.1.c). The window then closes on resolution: with a stunned
enemy at his battlefield he is 4 Might and out of Gust's range for good.

## Mageseeker Warden strands a Thrill of the Hunt target in banishment

**Date:** 2026-10-19
**Source:** Derived in this repo, not a staff ruling. Re-derived on 2026-10-19 against the 2026-10-09 Core Rules, which removed the sentence the first derivation quoted; the outcome is unchanged. Ask a judge before relying on it at an event.
**Rules:** §355.17.b, §358.5, §358.3.a, §806.3
**Expires:** when Riot rules on it, or a Core Rules or FAQ update covers "banish, then play" against a play-location restriction

> **Basis changed 2026-10-19.** The §358.3.a text quoted under *Why* is from the Core Rules of
> 2026-07-16. The 2026-10-09 edition dropped its last sentence ("On resolution, that game
> action will be skipped as it is an impossible instruction") and the Here to Help example;
> its example is now Flash at Vilemaw's Lair, where the move is *negated*. The answer now
> rests on §355.17.b: a restriction on where a card is played must be followed, *"Failure to
> do so means the card will fail to finalize"*, and its second example is Mageseeker Warden
> stopping a unit being played to a battlefield. A play that fails to finalize is undone as
> though it never happened (§358.5), which leaves the unit where the play started: banished.
> That last step is this repo's reading, not a sentence Riot wrote.

**Question.** You control Mageseeker Warden (`OGN-070`, *"While I'm at a battlefield,
opponents can only play units to their base"*) at a battlefield. Your opponent plays Thrill
of the Hunt (`Fury/Body`, *"Banish a friendly unit, then its owner plays it to any
battlefield, ignoring its cost"*). What happens to their unit?

**Derived answer. It is banished and stays banished.** The banish is a legal instruction and
happens. The play that follows is to a battlefield, which Warden forbids, so it fails to
finalize and is undone (§355.17.b, §358.5). Nothing returns the unit.

**Why.** §358.3.a: *"If a Game Effect prevents the performance of a game action, that effect
doesn't prevent cards … that instruct a player to perform that game action from being played
… On resolution, that game action will be skipped as it is an impossible instruction. Example:
A player plays Here to Help when their opponent controls a Mageseeker Warden at a battlefield
… On resolution, no unit will be played."* Thrill is the same shape as Here to Help with a
banish in front of it, and a skipped later instruction does not undo an earlier one in the
same effect. The FAQ's Perched Grimwyrm answer states the general principle: *"In Riftbound,
'can't' beats 'can'."* Warden's "only to their base" is the "can't"; Thrill's "to any
battlefield" is the "can".

**The same reading covers** Rengar, Trophy Hunter's Ambush onto a battlefield (only base is
legal, so it comes down at base); LeBlanc, Deceiver's Reflection token "there" at a
battlefield (no token); and every "ready" in an enemy spell or ability while Warden is at a
battlefield, from Warden's second line (Irelia's legend, Arise!, Guards!, Ride the Wind,
Jayce's legend on gear, Akali's empowered ready, Pit Crew). The unit or gear still moves or is
played where it legally can; only the ready is negated (§358.3.a's Flash example).

## Temporal Breach on a unit at Rockfall Path leaves it banished

**Date:** 2026-10-30
**Source:** Derived in this repo from two FAQ answers, not a staff ruling. Seen at the table by Jay against Kai'Sa: "temporal breach… didn't let me add the unit back to the battlefield after banishing so then they stay banished." Ask a judge before relying on it at an event.
**Rules:** §054.1, §054.2, §355.17.b, §358.5
**Expires:** when Riot rules on it, or a Core Rules or FAQ update covers "banish, then play to the same location" against a play-location restriction

**Question.** A unit is at Rockfall Path (`SFD-216`, *"Units can't be played here"*). Temporal
Breach (`VEN-066`, 2E 1P, Hidden: *"Banish a unit, then its owner plays it to the same location,
ignoring its cost"*) chooses it. What happens?

**Derived answer. It is banished and stays banished.** The banish happens. The play is to Rockfall
Path, which forbids it, so it fails to finalize and is undone (§355.17.b, §358.5), leaving the unit
in banishment. One 2-Energy spell removes any unit on their Rockfall Path for good.

**Why.** Two FAQ answers compose it. The Dragon Roost answer names Rockfall Path as *"a restriction on
playing units to Rockfall Path"* and restates "can't" beats "can" (§054.1, §054.2). The Hostile
Takeover answer is Temporal Breach itself failing its play: *"The unit will remain in Banishment … During
the check legality step of finalization, the unit will be returned to banishment from the chain and all
actions taken will be undone."* Same shape as Mageseeker Warden stranding a Thrill of the Hunt target
(above).

**Why it matters.** Kai'Sa runs both: 73 of her 83 lists since 23 Oct 2026 have Temporal Breach and
Rockfall Path (`data/decks.json`). Against her, a unit on her Rockfall Path is one Breach from gone,
not bounced. Answers in Jay's Sivir decks: Abandon counters it (Reaction); Repulse (sideboard)
counters a spell choosing one friendly unit at a battlefield; Star-Crossed in response returns the
unit to hand first, so Breach loses its target.

## Switcheroo fizzles if the other unit leaves in response; a resolved swap stays

**Date:** 2026-10-25
**Source:** Derived in this repo, not a staff ruling; the second half rests on the rules FAQ (the Gangplank, Naval answer, which names Switcheroo). Seen at the table on 2026-10-25: an opponent answered Switcheroo with Sacrifice on their Thousand-Tailed Watcher, and no Might moved. Ask a judge before relying on the first half at an event.
**Rules:** §359.3.e.12, §359.3.e.5, §359.3.e.6
**Expires:** when Riot rules on it, or a Core Rules or FAQ update defines the swap game action

**Question.** You play Switcheroo (*"Swap the Might of two units at the same battlefield this
turn"*) on your unit and theirs. (1) They kill or sacrifice their unit in response. (2) They
do it after Switcheroo has resolved. Does your unit get the Might?

**Derived answer.** (1) **No swap.** At resolution their unit is off the board, so its Might
reads null (§359.3.e.12) and the swap computed from it is ignored; it is also no longer a legal
target (§359.3.e.5, §359.3.e.6). Your unit keeps its own Might; the spell is spent. (2) **Your
unit keeps it for the turn.** The FAQ: a swap "calculates the difference in Might and generates
two effects: an increase, and a decrease". Each is its own "this turn" effect, already applied,
so the other unit leaving afterwards changes nothing.

**Why.** The test from the handbook's section on a source leaving the board: does the
instruction have to read anything off the departed unit? A swap reads both Mights, so in case
(1) it does, and the read is null. In case (2) the reading is done.

## The Baron Pit is a battlefield: once it is on the board, the final point by conquer needs all three

**Date:** 2026-10-28
**Source:** Derived in this repo from §185.2.d (added 21 Nov 2026), and the same answer from community judges ([RiftJudge 10117](https://app.riftjudge.com/questions/10117), [RiftJudge 11487](https://app.riftjudge.com/rulings/11487/if-my-opponent-is-at-7-and-he-plays-baron-nashor-do-the-points-received-from-bar), [riftboundfaq.com](https://www.riftboundfaq.com/cards/baron-nashor)). Still no Riot staff ruling. It matters against Riven, The Exile, whose tournament lists run Baron Nashor (80% of her Radiance results, 28 Oct 2026).
**Rules:** §185.2.d, §187.8, §187.9, §471.1, §471.2, §473.1.a.1, §473.1.b.1
**Expires:** when Riot rules on it, or a Core Rules or FAQ update says how battlefield tokens count for the Final Point

**Question.** Baron Nashor adds the Baron Pit battlefield token to the board and enters there.
You are at 7, you held one battlefield this turn, and you conquer the other. Is that the
eighth point?

**Derived answer. No: you draw a card instead.** The final point by conquer needs every
battlefield scored this turn (§473.1.b.1), and the Pit is one of them. A **hold** at 7 still
wins: hold points are not gated (§473.1.a.1).

**Why.** The Baron Pit is "a domainless battlefield token" (§187.9), and a token **is** its type:
*"Tokens have a type. They follow all rules for their type unless otherwise specified. Example: A token
unit is a unit."* (§185.2.d). So the Pit is a Battlefield, and §473.1.b.1's "Scored every Battlefield
this turn" counts it. (Until 21 Nov this entry said no rule stated that; §185.2.d does.) Also, the other battlefield token is written to be scored:
the Brush reads "When you score here" (§187.8), and scoring is something a player does to a
battlefield, by conquering or holding it (§471.1, §471.2). So the Pit is a battlefield that can
be scored, and "every Battlefield" counts it. The practical upshot against Baron: hold your two
battlefields and win by holding, not by conquering.

**Added 23 Nov 2026 (for the turn solver, `lib/turn.mjs` op `addPit`).** Two more steps, derived, no ruling read:

1. **Baron conquers the Pit as he enters it.** He is played straight onto an open battlefield, so he
   establishes Control there when the showdown closes (§348.2.a), and gaining Control of a Battlefield
   not yet Scored this turn is a Conquer (§471.1, §468.5.d). It's the same premise as an open-battlefield
   play (Sneaky Deckhand, "Turn solver premises" below). RiftJudge 11487, cited above, asks about "the points
   received from" the Baron Pit, which assumes the same.
2. **A conquest that draws at the gate still Scores the battlefield.** *"Scoring is a distinct process
   from Gaining Points"* (§470.1). A Conquer is the Scoring (§471.1), and §473.1.b.1 swaps only the
   point for a draw. So when you play Baron at 7, the Pit is Scored (you draw), and a conquest of your
   other battlefield afterwards has every battlefield Scored and gains the eighth point. The FAQ says
   the same in its own words ("only get the last point if you have already scored all of the other
   battlefields this turn", rules-faq.md, "Final point"). **Order matters:** Baron first, then the
   conquest. The other way round, the conquest draws, then the Pit's conquest draws too.

## Sivir, Mercenary's double conquest: spell moves, "spent" Power, and the Final Point

**Date:** 2026-11-21
**Source:** Derived in this repo from the Core Rules and the FAQ's Jhin answer; no Riot staff ruling or community ruling read. Asked while building a new Sivir (Battle Mistress) deck.
**Rules:** §144.4, §451.1, §810.1.c, §810.1.c.3, §135.2.e.5.b, §445.1, §811.1.b, §805.1, §471.1, §473.1.b.1
**Expires:** when Riot rules on any of the three points, or a rules update changes how effect moves or "spent" resources work

**Questions.** (1) Can a spell move (Ride the Wind: "Move a friendly unit and ready it"; Void
Assault) take a unit from one battlefield to another without Ganking? (2) Does Sivir's "If you've
spent at least [A][A] this turn" count Power from a Gold token, and Power paid to hide a card?
(3) Sivir conquers A, On the Hunt readies her, she ganks to B and conquers it: does that win from 6 or 7?

**Derived answers.**

1. **Yes.** Ganking only adds a destination to the *Standard Move* (§810.1.c, §810.1.c.3: "only new
   options for the Standard Move"); the base ↔ battlefield limit is §144.4's, which is the Standard
   Move's. An effect move is a different action, and *"The source of the Move will provide details on
   any restrictions on legality for Destination"* (§451.1). Ride the Wind names none, so any
   battlefield is a legal destination.
2. **Yes to both.** Gold adds [A], which *"can be spent to pay a Power cost of any Domain"*
   (§135.2.e.5.b). Paying a cost removes it from the pool (§445.1), and the FAQ's Jhin answer treats
   resources paid for a card as spent even if the card is later countered. Hiding is "pay [A]"
   (§811.1.b), so it counts too. So does Accelerate's [1][Chaos] (§805.1): **Sivir played with
   Accelerate has spent 2 Power on her own** (1 for her cost, 1 for Accelerate), so she enters ready
   with +2 Might and Ganking.
3. **Yes.** Conquering A scores it (§471.1); at 7 the conquest of B needs every battlefield scored
   this turn (§473.1.b.1), and A was. From 6 that's 6 → 7 → 8. (With a Baron Pit on the board, it
   needs the Pit too.)

**Weakest link:** point 1 rests on reading §451.1 as the only limit on effect moves. Ask a judge
before an event depends on it.

## Turn solver premises: combat membership, recalls, exhausted Gold, walk-ins

**Date:** 2026-11-21
**Source:** Derived in this repo from the Core Rules, for `lib/turn.mjs`; no Riot staff ruling read.
**Rules:** §466.2.c.1, §466.2.c.3, §468.1.a.2, §348.2.a, §348.2.a.1, §144.2, §144.3, §415.4, §323.5
**Expires:** when a Core Rules update changes combat designations, recalls, exhaust costs or non-combat showdowns

1. **Every unit at the battlefield fights.** *"Units at the Contested Battlefield controlled by the Attacker or
   Defender gain the Attacker or Defender designation now"* (§466.2.c.3). The attacker is *"the player whose
   unit(s) applied the Contested status"* (§466.2.c.1): so when Irresistible Faefolk pulls their unit into a
   battlefield we control, **they** are the attacker there and we defend with everything at it.
2. **Losing attackers go back to base**: *"Recall Attackers present at the Battlefield if Defenders are still
   present"* (§468.1.a.2). They stay exhausted (the move's cost, §144.2); On the Hunt can ready them again.
3. **Several units moving together is one move** (§144.3), so they fight as one attack.
4. **An empty battlefield is conquered when its showdown closes** with only our units there (§348.2.a, a Conquer
   if not yet scored this turn, §348.2.a.1). Their Reactions can still answer the unit before it closes.
5. **Gold that enters exhausted adds nothing this turn.** Gold's ability costs exhausting it, and *"When
   Exhausting is listed as a Cost, then the Action must be able to be completed for the cost to be paid"*
   (§415.4). So Battle Mistress's and Pyke's Gold, played exhausted, are next turn's Power.
6. **Leaving a battlefield empty gives it up** (§323.5): Sivir ganking A → B leaves A uncontrolled, but A's
   conquest this turn still counts as scored for the eighth point (the Mercenary ruling, point 3).

**Weakest link:** point 4's window: which of their cards can answer a lone unit in a non-combat showdown is
read from `fight()` (bounce, kill, damage); Ambush units played into it are not modelled.

## Turn solver premises (2): tokens are played; "can't play cards" includes face-down cards

**Date:** 2026-11-22
**Source:** Derived in this repo from the Core Rules, for `lib/turn.mjs`'s card-text executor; no Riot staff ruling read.
**Rules:** §185.2.a, §811.1.c.1, §811.1.c.3
**Expires:** when a Core Rules update changes how tokens or hidden cards are played

1. **A token unit is played.** *"Tokens can be played by their owner if their card type is played, following all the
   applicable steps for playing a card"* (§185.2.a). So "when an opponent plays a unit" (Vex, Apathetic) triggers on
   a token unit too, and the solver stuns it.
2. **"Opponents can't play cards this turn" (Brynhir Thundersong) stops their face-down cards.** Playing from hidden
   is playing (§811.1.c.3). Hiding is not (§811.1.c.1), so it doesn't stop a hide.

**Weakest link:** point 1 assumes "plays a unit" counts token units; tokens aren't cards (§185), but the trigger names
a unit, not a card.

## Turn solver premises (3): face-down plays are free; open battlefields; Ambush; Zhonya's save

**Date:** 2026-11-22
**Source:** Derived in this repo from the Core Rules, for `lib/turn.mjs`; no Riot staff ruling read.
**Rules:** §811.1.b, §811.1.d.1, §822.1.b, §822.1.d, §170.11.c, §190.3.a.1, §348.2.a, §467.2.c.5
**Expires:** when a Core Rules update changes Hidden, Ambush, open battlefields or damage prevention

1. **A face-down card plays free, at its battlefield.** Hidden: *"Beginning on the next turn, this gains [Reaction]
   and you may play this, ignoring its base cost"* (§811.1.b); *"A hidden permanent must be played to that
   battlefield"* (§811.1.d.1). The solver plays ours only if hidden on an earlier turn.
2. **Ambush** is *"I may be played to a battlefield where you control Units"* with Reaction while played that way
   (§822.1.b): a defender's Ambush unit can join a fight from hand, and so can an attacker's. Rengar, Trophy Hunter's
   text widens it to battlefields with enemy units (§822.1.d).
3. **An open battlefield** is *"unoccupied and uncontrolled"* (§170.11.c). A unit played there contests it
   (§190.3.a.1) and its controller conquers when the showdown closes (§348.2.a): Sneaky Deckhand.
4. **Prevention applies at assignment** (§467.2.c.5): lethal counts the prevented damage.
5. **Zhonya's Hourglass is classified "no points change"**: its save recalls the unit, so the battlefield is left
   just as if it had died. The card survives for later turns.


## Turn solver premises (4): XP this turn turns Level on this turn; Hunt pays on every Conquer; Deploy goes anywhere

**Date:** 2026-11-23
**Source:** Derived in this repo from the Core Rules, for `lib/turn.mjs` (card-text batches 4 and 5); no Riot staff ruling read.
**Rules:** §728, §823.1.c.1, §823.2, §824.1.b.1, §824.1.d, §830.1.b.1, §740.2.a
**Expires:** when a Core Rules update changes XP, Hunt, Level, Deploy or "alone"

1. **XP gained this turn counts for Level this turn.** Level is *"functionally short for 'While you have [N] or more
   XP, this card gains [Text]'"* (§824.1.b.1), and it goes inactive *"as soon as the controlling player has less than
   [N] XP"* (§824.1.d). XP is a player resource (§728). So "gain N XP" is not a next-turn resource: the solver adds it
   to `s.xp` at once (until 23 Nov it was filed `later`, which was wrong).
2. **Hunt pays on the Conquer, even one swapped for a draw at 7.** Hunt is *"When I Conquer or Hold, my controller
   gains X XP"* (§823.1.c.1), summed across sources (§823.2). The Conquer happens whether or not its point is
   replaced (see the Baron Pit entry: Scoring isn't Gaining Points).
3. **Deploy gear goes to any battlefield.** *"Deploy grants permission for Gear to be played to any Battlefield,
   including enemy occupied and open battlefields"* (§830.1.b.1). Bomb tokens (§187.12) are Deploy gear.
4. **"Alone"** is no other friendly unit at the same location (§740.2.a). Units that die in the same combat weren't
   alone, so a Deathknell's "if I died alone" is taken before the dead are removed.
