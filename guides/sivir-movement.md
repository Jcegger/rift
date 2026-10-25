---
title: Sivir Movement Midrange — Deck Guide
subtitle: Riftbound, Radiance — a found list, played as written: everything moves. How it wins, how to play it, the rules its tricks run on, and what to log
author: rift toolchain
date: 2026-10-25
---

**Legend:** Battle Mistress (Body/Chaos) · **Champion:** Sivir, Mercenary
**Registered:** 40 main (Champion included) + 12 runes (7 Body / 5 Chaos) + 3 battlefields + 1 legend · **Sideboard:** 10 of 10
**Shuffled library:** 39. The Champion starts in the Champion Zone and is playable from there (§103.3.a.1, §108.3.d)
**Where it came from:** a list Jay found, built by a player we don't know, with **no known record**. We play it **exactly as written** for a night or two, so the games tell us whether its idea works. Saved in the app as `Sivir — Movement midrange (found list, 25 Oct)`
**Collection status:** 2 to get by the app's count: 1 Staunch Survivor, 1 Last Rites
**Good until:** a night or two of logged games, or Riot's Radiance FAQ, which outranks the Core Rules where they differ

**Companions.** [strategy.md](../docs/strategy.md) is how to think about any turn; [archetypes.md](../docs/archetypes.md) is what each opponent is doing; [the Nexus Night guide](sivir-nexus-night.md) has the store's clock and field. The worksheet log ([decklab/sivir-nexus-night.md](../decklab/sivir-nexus-night.md), 25 Oct) says why we're trying this list.

---

## The list

| | |
|---|---|
| **Units (19 + champion)** | 3 Traveling Merchant · 3 Staunch Survivor · 3 Tideturner · 3 Ezreal, Prodigy · 2 Fizz, Trickster · 2 Graves, Blasting Through · 2 Vex, Apathetic · 1 Rengar, Trophy Hunter · *Sivir, Mercenary* |
| **Spells (17)** | 3 Punch First · 3 Rampage · 3 Ride the Wind · 2 Sabotage · 2 Switcheroo · 2 Star-Crossed · 2 Siren's Song |
| **Gear (3)** | 2 Portable Portal · 1 Last Rites |
| **Battlefields** | Sigil of the Storm · Zaun Warrens · Sandswept Tomb |
| **Runes** | 7 Body · 5 Chaos |
| **Sideboard** | 2 Unyielding Spirit · 2 An Offer You Can't Refuse · 2 Gust · 2 Akshan, Mischievous · 1 Sabotage · 1 Star-Crossed |

---

## The short version

*Read before every round.*

**What the deck does: everything moves.** Most decks put a unit on a battlefield and leave it there. This one moves units *during* fights. Ride the Wind pulls a defender into a battlefield under attack. Siren's Song sends their attacker away. Portable Portal and Mercenary give Ganking, so units jump battlefield to battlefield. Tideturner swaps places. Every move by a Traveling Merchant is a loot (discard 1, draw 1), so the card flow comes from the moving itself.

**How it wins.** Take battlefields early with solid 2-drops (Staunch Survivor fights at 4). Defend them with tricks the opponent can't see coming. Then break their hold with Mercenary, Graves or a Rengar ambush, plus a Punch First. Vex makes every unit they play arrive stunned and stuck.

**The legend's part.** Ride the Wind, Punch First, Switcheroo, Star-Crossed, Ezreal, Fizz, Sabotage and Mercenary all cost Power, and Battle Mistress makes Power renewable. **Energy is what runs out, not Power**, so spend Gold freely on the Power side of your cards.

**Your turn, in order:** lethal check, both players → count Gold and runes → **pump before you move** (Punch First on Graves before he goes in; see the Graves note) → take open battlefields → develop → fight → keep Energy for Ride the Wind or Siren's Song on their turn when you can.

**The three rules that matter most:**
1. **Pay Power with Gold first; recycle a rune only for the rest.** The first rune you recycle each turn makes a Gold (the legend starts every turn ready). A second recycle makes nothing, unless an enemy unit died in between: **recycle, kill, recycle.**
2. **The eighth point by Conquer needs both battlefields scored this turn** (§473.1.b). Hold one at the start of your turn, then conquer the other: the hold counts. A hold at 7 simply wins (§473.1.a.1).
3. **Moving isn't playing.** The opponent can respond to the *spell* that moves a unit, but not to the move itself (§448.3.c).

---

## The tricks, and the rules they run on

**Ride the Wind** (2 Energy, 1 Chaos; Action): *"Move a friendly unit and ready it."*
- The card sets no limit on where the unit goes, so it can go anywhere: base to battlefield, battlefield to battlefield, back to base (§451.1).
- **An Action can be played in any showdown, on either turn.** When they attack a battlefield, move a defender in from elsewhere. A unit that arrives mid-fight gets its designation at the next cleanup and **defends**, and its triggers fire (§466.2.c.3.a, §383.4.e).
- **On your turn:** move a unit that already attacked and ready it again, or ready a fresh unit that can't move yet (units enter exhausted, §143.4).
- **A moved Merchant loots.**
- **Catch:** while their **Mageseeker Warden** is at a battlefield, our readies are cancelled. The move still happens; only the ready doesn't (rulings, the Warden entry).

**Siren's Song** (2 Energy; Reaction): *"Move an enemy unit that moved this turn."*
- Their attacker moved to get there, so it qualifies. **Send it away before damage.** If no attacker is left, the attack fizzles and your hold stands.
- As a Reaction it works even while a trigger is on the chain, such as Graves's blast.
- It only hits a unit that **moved** this turn: not one played straight to the battlefield, and not an Ambush.

**Portable Portal** (2 Energy, gear; Deploy): *"When you play this, you may pay a Body Power to ready a unit here. Friendly units here have Ganking."*
- **Deploy:** it can be played to **any** battlefield, open or enemy-occupied, and only to a battlefield. It isn't recalled. **It dies when an opponent holds there** (§830.1.b).
- Put it where your units are, and from then on they can move straight to the other battlefield.

**Tideturner** (2 Energy; Hidden): when played, swap it with one of your units elsewhere. Hidden, so it's free from face down on their turn: pull your best unit into a fight while Tideturner takes its place. **A Merchant swapped by Tideturner moves, so it loots.**

**Rengar, Trophy Hunter** (5 Energy, 1 Power; 6 Might; Ambush):
- Ambush lets him be played to a battlefield where you have units, **with Reaction speed** while played that way (§822.1.b). His text adds battlefields where **they** have units, even if you have none.
- So he can drop into their attack as a 6-Might defender, or straight into their battlefield to start a fight.
- Against Mageseeker Warden he can only come down at base (rulings).

**Vex, Apathetic** (4 Energy; 4 Might; Deflect): *"When an opponent plays a unit while I'm at a battlefield, stun it. They can't move it this turn."*
- Any battlefield counts, and playing a hidden card from face down counts as playing.
- So it shuts down Ambush, units that enter ready, and surprise flips. A stunned unit deals no combat damage (§424.1.b).
- **Keep Vex on a battlefield,** not in base.

**Graves, Blasting Through** (5 Energy, 1 Power; 4 Might): when he attacks or defends, he deals damage equal to his Might to every enemy unit there, and deals no combat damage himself.
- **Pump him before the fight.** His trigger goes on the chain when combat starts, and while it's there only Reactions can be played. Punch First is an Action, so cast it in your main phase, before he moves: +5 makes the blast 9. The damage is read when the trigger resolves (§359.3.f.2), so a Reaction pump in response (a face-down Switcheroo swap, say) still counts.

**Mercenary** (4 Energy, 1 Power, from the Champion Zone): once you've spent two Power in a turn, she has **6 Might and Ganking**.
- **Punch First alone switches her on** (2 Power), then adds +5.
- With Accelerate she pays two Power herself and arrives ready.
- **Ezreal's discount** covers Accelerate's extra cost (his text: optional additional costs cost 1 Energy or 1 Power less).

**Fizz** (3 Energy, 1 Power): when played, recast a spell of 3 Energy or less from your trash, paying only its Power, then recycle it. Every spell in this deck qualifies. A Ride the Wind or Punch First from the trash is the usual best.

**Last Rites** (gear): Equip costs a Chaos plus recycling 2 cards from your trash, for +2 Might while attached (§137.3). Late game, when the trash is full.

**Star-Crossed** (Reaction): returns one of their units **and one of yours** to hand. Pick your Ezreal or Fizz, to replay for value.

---

## Turns

- **Turn 1:** a 2-drop. A free one first (Merchant, Tideturner). Staunch Survivor needs a Body Power, which is a recycled rune on turn 1, so it's better on turn 2 off the Gold. If Staunch is your only play, play it.
- **Turns 2–3:** take both battlefields if they're open. Two bodies at the one they'll attack.
- **Turns 3–5:** Vex onto a battlefield, Portal where your units gather. **Keep 2 Energy up on their turn** when you can (Ride the Wind or Siren's Song). That's this deck's version of a face-down card.
- **Closing:** hold one battlefield, then break the other with Mercenary (Punch First), Graves (pumped first), or a Rengar ambush.

---

## Matchups (reading only; untested)

- **Rengar, Kha'Zix, Evelynn and other ambush or hidden decks:** Vex is the card; keep it on a battlefield. Siren's Song doesn't hit an ambush (that's a play, not a move).
- **Big breakers** (Astral Heron decks: Irelia, Vex): Siren's Song sends the attacker away; Switcheroo face down swaps its Might; Star-Crossed bounces it.
- **Kennen:** Jun warns that Kennen abuses Zaun Warrens; consider Sandswept Tomb or Sigil of the Storm when picking your battlefield against him.
- **Kai'Sa:** lots of removal. Don't put everything on one battlefield. **Unyielding Spirit** (sideboard) blanks a turn of her damage spells.
- **Jayce and gear decks:** sideboard **An Offer You Can't Refuse** (kill a gear; they get a Gold) and **Akshan** (steals a gear).

---

## What to log (the questions this list has to answer)

1. **Ride the Wind and Siren's Song:** how often did one swing a fight? How often were they stuck in hand?
2. **Portable Portal:** did Ganking matter, or did it die to their hold?
3. **Vex:** what did it stop?
4. **Cards:** did you run out? (There's no recursion here; Merchant and Ezreal are the card flow.)
5. **Rengar, the one big body:** enough top end, or too few big units?

After a night or two, the journal decides: keep it, tune it, or switch to the Randyyy-based list (in the worksheet log).
