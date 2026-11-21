# How Claude reads Riftbound (for Jay to correct)

Written 21 Nov 2026 from `docs/rules.md` (Core Rules 2026-10-09), the Radiance FAQ (2026-10-26) and the
data as of today. Each claim cites its rule. Where it's wrong, mark it: the fix goes into the handbook or
into memory, so the same mistake doesn't come back. Section 8 lists what I'm least sure of.

## 1. What wins

- First to **8 points** in 1v1 (§194.3), checked in a cleanup: at least 8 **and** more than the opponent
  (§194.2, §323.1). Ties play on.
- Points come from the **two battlefields** (each player brings one of three registered, §487.4).
  **Conquer**: take control of one you haven't scored this turn. **Hold**: control it at the start of
  your turn. Each battlefield scores at most once per turn, either way (§471, §472).
- **The eighth point by conquer is gated**: at 7, a conquer only scores if you've scored *every*
  battlefield this turn; otherwise you draw a card instead (§473.1.b.1). A hold scores either way, and
  so do card points (§473.1.a.1). So the usual close is to hold one battlefield to reach 7, then conquer
  the other (the hold counts as that battlefield's score). Or start your turn at 7 holding one, which
  just wins.
- An empty deck isn't a loss. It's a **Burn Out**: shuffle the trash back in, and an opponent of your
  choice gains 1 point (§432).

## 2. Resources: Energy and Power

- A cost is **Energy** (the number, colourless) plus **Power** (domain symbols) (§163).
- Each rune has two abilities: **exhaust** for 1 Energy, and **recycle** (send it to the bottom of the
  Rune Deck) for 1 Power of its own domain (§164.2). Recycling isn't exhausting, so one rune can do both
  in the same turn.
- To cast **E Energy + P Power** you need **max(E, P) runes, E of them ready**, P of the right domain.
  The real price of Power is the next turn: a recycled rune is one fewer rune on your board, and you
  channel only 2 a turn (§315.3.b).
- Rune pools empty at the start of every Main Phase and at the end of every turn, so nothing carries
  over (§167).
- **Gold** (a gear token) can be killed to add one Power of any domain. Battle Mistress makes one when
  you recycle a rune (exhaust her), and she readies when enemy units die. That's Sivir's engine: Power
  spent becomes Gold back, and a kill turns it on again.
- This is why your Nexus Night lesson ("don't spend too much Power early") holds. Every Power is a
  recycled rune, unless Gold paid it.

## 3. The turn

Awaken (ready everything) → Beginning (start-of-turn effects, then **Hold scoring**) → Channel 2 runes →
Draw 1 → Main (open; combats happen inside it) → Ending (heal all units, "this turn" effects expire)
(§315–317). **Holds are scored before you channel or draw**, so a battlefield you keep through their
turn has already paid you before you act.

- Setup: draw 4, one mulligan of up to 2 cards to the bottom (§116, §117). The player going second
  channels **one extra rune** on their first turn, and that's the only compensation (§487.7).
- **Moving**: exhaust a unit to go base ↔ battlefield. Battlefield → battlefield needs **Ganking**
  (§144, §810). Main Phase, Open State, never during a showdown or combat.
- Units enter **exhausted** unless something says otherwise; **Accelerate** (pay [1][C] more) makes it
  enter ready (§143.4, §805). Gear enters ready at your base (§149).

## 4. Timing: states, chain, showdowns

- Four states. Open/Neutral: the turn player plays anything. Showdown: only **Action** and
  **Reaction**. Any time a chain exists: **Reaction only** (§310, §806, §813).
- The chain resolves newest first (§340.1). Units, gear and Add abilities resolve **the moment they
  finalize** and can't be responded to (§337.2).
- Moving into a battlefield you don't control makes it **Contested**, and that player gets focus first
  (§190.3.a.1, §345). With enemy units there, a **combat** starts on its own; nobody declares an attack
  (§462).

## 5. Combat

1. **Showdown.** Attacker = whoever made it Contested. Attack and defend triggers go on the chain, then
   both sides alternate Actions and Reactions, attacker first, until both pass (§466).
2. **Damage.** Each side totals its Might (Assault adds while attacking, Shield while defending) and
   assigns it across the other side. **The attacker assigns first, then the defender.** One unit must
   get full lethal before the next gets any. No overkill while others are unassigned. **Tank** units
   must be assigned lethal before your others, **Backline** after all of them (§467.2.c, §815, §826).
   Stunned units deal nothing (§424.1.b). A unit at 0 Might needs at least 1 damage to die (§142.4.b).
3. **Resolution.** Lethal units die, then **all units heal**, then attackers are recalled if any defender
   still stands (§468.1.a). Only one side left: it controls the battlefield (a conquer if not yet
   scored). Both sides wiped: the battlefield goes **uncontrolled**, so an even trade still costs the
   holder its hold (§468.5.b).

## 6. Hiding, equipment, and the keywords that come up

- **Hidden**: on your turn, pay [A] to put the card **face down at a battlefield you control** (one per
  battlefield). From your next turn it has Reaction and plays **ignoring its base cost**. A hidden
  permanent must be played to that battlefield, and its targets come from there. If the hidden unit is
  removed before its play effect resolves, the target can't be confirmed and the effect is ignored
  (§811.1.b, §811.1.d.1–3.a). In 1v1 your face-down card and theirs are always at different
  battlefields, so their face-down card can't answer your flip; only a Reaction from hand can.
- A hidden card at a battlefield you no longer control goes to your **trash** (§323.6.a).
- **Equipment**: Equip [cost] attaches it to a unit you control, and that unit is a target (§818). The
  strip under the text is what the **unit** gets: Boots of Swiftness give +2 Might and **Ganking**, so a
  holder wearing Boots can walk A → B. (The card data dropped these strips until today; see the commit
  of 21 Nov.) **Quick-Draw** gear has Reaction and attaches as it's played (§819). **Weaponmaster** units
  may equip for [A] less when played (§821).
- **Deflect X**: opponents pay X more Power to target it (§809). **Temporary**: dies at the start of its
  controller's Beginning Phase, before scoring, so it never holds (§816). **Deathknell**: fires as the
  unit dies, and not at all if the death is replaced (§808). **Legion / Level / Empowered**: text that
  switches on with a condition (§812, §824, §828).
- Radiance added **Deploy** (gear played to any battlefield; dies when an opponent holds there),
  **Disarm X** (an attack trigger, -X Might to an enemy unit there) and **Show Off** (§830–832).

## 7. The meta right now, and where Sivir sits

From `scripts/rift meta --since 2026-10-23`: 8,008 legal lists since Radiance became Standard.

- **Riven, The Exile is the deck to beat**: 8.6% of lists, S on riftbound.gg's week-2 tier list, 414
  vouched results. Then Evelynn (6.0%, mostly Chinese events), Kai'Sa (5.2%), Kennen (4.6%), Vex (3.5%),
  Mordekaiser (3.4%).
- **The 23 Nov bans reshape it**: Riven, Broken Blade (in 99% of Riven lists), Stellacorn Herder,
  Zhonya's Hourglass, Emperor's Dais, Star Spring, Brynhir Thundersong (in every Kai'Sa list), Rhasa and
  Nocturne (in 93–94% of Kennen lists), Baited Hook, Dazzling Aurora. 43% of the field runs at least one.
  The top three archetypes all lose a core piece. Expect a different field from next week, and read
  matchup numbers from before the 23rd as history.
- **Sivir Is Trying Her Best is untouched by the bans.** Your record is 5–4 in games (last logged 3
  Nov): 2–0 Ekko, 2–1 Draven, 1–0 Pyke, 0–1 Lillia, 0–2 Evelynn. The plan is one hold: battlefield A
  is the trap (two units and a face-down card), and you close by walking into the B they left. Star
  Spring, parked in the deck brief as a battlefield idea, is banned from the 23rd, so that idea is dead.
- Locally (Sip & Play): Vex, Rengar, LeBlanc, Diana and Kai'Sa. Kai'Sa loses Brynhir.

## 8. What I'm least sure of (check these first)

1. **The Baron Pit and the eighth point: settled after research (21 Nov).** Once the Pit exists, a winning
   conquer at 7 needs all three battlefields scored that turn. A token "follow[s] all rules for [its] type"
   (§185.2.d), so the Pit is a battlefield, and community judges (RiftJudge, riftboundfaq.com) rule the same.
   Against Baron, win by holding. No Riot staff ruling yet.
2. **Who attacks after a pull.** When Faefolk pulls their unit into A (your battlefield), *their* unit
   is the one arriving somewhere its controller doesn't control, so they apply Contested: their unit is
   the **attacker**, and they get focus first (§190.3.a.1, §466.2.c). Your A units defend, so Shield
   counts for them. (Forbidding Waste punishes a unit defending *alone*, so there it hurts a lone
   defender of yours, not theirs.) I first wrote this backwards while drafting the note, so it's
   worth confirming that it's how it plays at the table. Checked again 21 Nov: §466.2.c.1 says "The Attacker
   is the player whose unit(s) applied the Contested status", and §190.3.a.1 has the moved unit apply it
   when "that Unit's controller does not already control that battlefield". Your Faefolk moving into your own
   A applies nothing; their pulled unit does. Settled.
3. **Gold timing.** I read Gold as usable on the turn it's made only if it was made ready. Battle
   Mistress's Gold enters exhausted, so it pays from your next turn.
4. **The simulator is not the game.** It plays against nobody: it measures consistency, not who wins.
   The fight calculator resolves one combat. Today's audit found it ignores Tank and Backline, and
   that the sim counts some conditional Ganking (Bilgewater Bully, Gustwalker) as always on. Those fixes
   are next. Until then, numbers from boards with those cards are off.
