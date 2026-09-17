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
**Rules:** §811.1.d.2, §359.3.e.12, §359.3.e.5, §359.3.e.6
**Expires:** the next Core Rules update — dev stated the Hidden rules "don't currently express that with 100% clarity" and "we will make this clearer in a future rules update"

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

So the chain runs: §811.1.d.2 pins a hidden permanent's play-effect target to the battlefield
it was played from → that battlefield is **not carried by the chain item**, it is read off the
source → §359.3.e.12 makes any read off an off-board permanent return null, and a unit that
has left the board explicitly "has no location" → the target cannot be confirmed legal →
§359.3.e.5 and §359.3.e.6 ignore the instruction.

**The contrast that makes it make sense:**

| Kennen played… | Gusted in response to the trigger | Result |
|---|---|---|
| from hand | yes | **Still stuns.** No battlefield restriction exists, so nothing needs reading off the source. |
| **from Hidden** | yes | **No stun.** The restriction exists and is anchored to the source. |

**What this does *not* change.** The 2 Energy is the base cost of the triggered ability and
is paid at finalisation (§204.3.a), so it is spent either way. The ability is not countered
and does not fizzle — it resolves, and only the instruction whose target went illegal is
ignored. A triggered ability generally outlives its source: Overzealous Fan kills itself as
its own finalisation cost and still moves the attacking unit.

**Why it is easy to get wrong.** Nothing in §811 mentions resolution, and nothing in §359.3.e
mentions Hidden. The composition is the ruling, and §359.3.e.12 is phrased as "location,
zone, or status has changed such that that information is no longer available" — it contains
none of the words *bounce*, *return to hand* or *leaves the board*, so searching the verbatim
rules in a player's vocabulary will not surface it. See
[When the source leaves the board](rules.md#when-the-source-leaves-the-board).

**Practical note.** Hidden is also the *only* reason Gust can reach this Kennen at all. He
has no Ambush, so played from hand he enters base, where Gust — which requires a unit "at a
battlefield" — cannot target him (§822.1.c). Played from Hidden he must enter at that
battlefield (§811.1.d.1) at 2 Might. And the window closes on resolution: with a stunned
enemy at his battlefield he is 4 Might and out of Gust's range for good.
