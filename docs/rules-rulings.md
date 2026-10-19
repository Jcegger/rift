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
