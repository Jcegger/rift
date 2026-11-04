# Sivir pool audit: every legal Body/Chaos card (4 Nov 2026)

Jay, after Nexus Night 3 Nov: draw was better than expected, so maybe an Innovator could go. "Audit every
single card available ... no need to think of what to replace, just want to think of options."

**The pool:** 293 unit, spell and gear cards in Body, Chaos or both, printed in a Standard set, not
banned, and not another champion's signature card (`data/cards.json` + `data/banned.json`, filtered through
`lib/decks.mjs`). Dazzling Aurora is in the pool and is out for Jay (CLAUDE.md).

**What these are:** Claude's reads of the card text against the trap plan (`guides/sivir-one-army.md`).
They are notes, not tiers and not measured. Nothing here has been run through `scripts/rift try`. "N/30"
is how many of the 30 legal Sivir lists in the archive run the card (`scripts/rift meta Sivir`; 1 vouched
result, so it is thin).

**What the list is short on, which the notes below are written against:**
- **Power.** It prints 26 Power against the field's ~19 (guide §"What to watch"), and Jay's lesson from 3 Nov
  was not to spend Power early. A card that does a current card's job for less Power, or makes Power, counts.
- **Two-drops.** 8 two-drop units now; the field's top-16 lists run 6.7 units at 2 Energy or less, and
  essentially none of them cost Power.
- **The face-down slot.** One face-down card per battlefield you control (§811.1.b), and the list already
  has 7 Hidden cards (Stranger ×2, Evelynn, Tideturner ×2, Switcheroo, Edge). Every Hidden card added
  competes for A's one slot unless Bushwhack Trap is out.

**Two rules points the notes rely on:**
- A Hidden card played from face down ignores its base cost, so a Hidden 4-drop unit costs nothing that
  turn (§811). Its play effect targets at the battlefield it was played to, and a unit it plays goes there too
  (§811.1.d.3, §811.1.d.5).
- Points from anything other than Conquer, card effects included, are never gated (§473.1.a.1). That is what
  makes Evelynn, In Control a possible winning point.

---

## 1. Worth a real look

Grouped by what they would do for the trap. Within each group, the strongest reads come first.

### Turn the hold into the win

| card | cost | read |
|---|---|---|
| **Evelynn, In Control** | 4E 1P · 4 Might | *"When I hold, if you control a facedown card here, score 1 point."* A hold at A with a face-down card there is **2 points**. The extra point isn't gated (§473.1.a.1), so **one hold from 6 wins**: a second way to close alongside Sivir at B. Disarm too. The catch: she has to survive at A through their turn **and** the face-down card has to still be there, so you can't flip Stranger on their turn and still get the point. Considered and parked on 1 Nov as "the bonus idea for later". 0% of Evelynn's own Radiance results run it (archetype-taxonomy §5) |

### Hold A and punish whoever walks in

| card | cost | read |
|---|---|---|
| **Windsinger** | 2E · 1 Might | Hidden. *"When you play me, you may return another unit at a battlefield with 3 Might or less."* A face-down Gust on a body; from face down its target is at A. A Power-free two-drop, and it triggers Ember Monk. Unlike Stranger, it doesn't need 4 units there |
| **Momentary Companion** | 4E · 4 Might | Hidden. Free from face down. On their turn it's a 4-Might defender at A that's Temporary (it dies at the start of your Beginning Phase, before scoring, so it defends A but doesn't help score it). On your turn it's a permanent 4 Might for nothing. Power-free |
| **Teemo, Scout** | 2E · 1 Might | Hidden, +3 this turn: a 4-Might surprise defender for free. Power-free two-drop. Teemo decks are a field legend; this card is just a unit |
| **Overzealous Fan** | 2E · 2 Might | *"When I defend, you may kill me to move an attacking unit to its base."* Makes attacking A bad at 2 Energy, no Power. 7/30 Sivir lists |
| **Cannon Barrage** | 2E 1P | Reaction: 2 to every enemy unit in combat. A fight at A after a pull or an attack is exactly that. Punishes swarms (Draven, Kha'Zix tokens) |
| **Elnuk Herd** | 6E · 5 Might | Hidden: hide for 1 Power, then from face down it gives another friendly unit +3 at Reaction speed and recycles itself. Effectively a 1-Power Hidden pump that triggers Ember Monk. It takes A's slot, though |
| **Loyal Pup** | 3E · 3 Might | *"When you defend at a battlefield, you may move me there."* Sits in base and shows up at A. Power-free |
| **Fiora, Peerless** | 3E 1P · 3 Might | Doubles her Might attacking or defending one on one. A Faefolk pull makes a one-on-one at A |
| **Kha'Zix, Mutating Horror** | 4E 1P · 4 Might | Ambush; +2 when an enemy unit is alone there, the shape Faefolk's pull makes. 6 Might arriving at Reaction speed |
| **Evelynn, Consuming** | 5E 1P · 5 Might | Ambush; *"When you play a card from face down, ready me and give me +1."* On the closing turn, the Stranger flip readies her. The same slot as Rengar, with a stronger face-down tie |
| **Kog'Maw, Caustic** | 3E 1P · 1 Might | Deathknell: 4 to every unit at his battlefield. A trap that goes off when they kill him at A, but it hits your own units there too |

### The pull, and clearing B for Sivir

| card | cost | read |
|---|---|---|
| **Blast Cone** | 4E 1P · gear | Moves an enemy when played; *"when you move an enemy unit, you may exhaust this to Stun it."* So Faefolk or Evelynn pulls a unit and it deals no combat damage. A permanent that makes every pull win its fight |
| **Isolate** | 2E | Move an enemy unit from a battlefield to its base; draw 1 if an enemy is then alone there. Empties B without a fight and without Power. Main phase only (no Action) |
| **Twilight Step** | 2E 1P | Move a unit with 3 Might or less, either side's. Moving your own Faefolk to a battlefield triggers its pull, and it can be played again later from the trash (Flow 4E + Chaos) |
| **Temptation** | 2E | Move an enemy unit to a location where they have another unit (their base counts). Repeat 2E. Main phase only |
| **Demon Shade** | 3E | Hidden: move a friendly unit to an open battlefield. **Check "open" in the rules before relying on it** for B on the closing turn; from face down its target must be at A (§811.1.d.4) |
| **Pitiless Stalker** | 5E 1P · 5 Might | Exhaust: Stun an enemy unit, every turn. Clears a defender's combat damage without a spell. Pricey |
| **Maddened Marauder** | 5E · 4 Might | Tank; when played, sends any unit at a battlefield to base. A body plus a clear for B |

### Power relief

| card | cost | read |
|---|---|---|
| **Wind and Ghosts** | 3E 1P | Action: a unit at a battlefield with 3 Might or less is banished, anything bigger goes back to hand. **Rebuke's job for 1 Power instead of 2**, and the small ones don't come back |
| **Gutter Guardian** | 3E · 3 Might | Hidden. Show Off a Hidden card (from hand or on the board): add 1 Power. A free body from face down that refunds Power. Power-free |
| **Black Market Broker** | 3E · 3 Might | A Gold (1 Power when you cash it) every time you play a card from face down. With 7 Hidden cards it pays regularly. Power-free |
| **The Waters' Wage** | 1E | Hidden: on your turn from face down, **three ready Gold** = 3 Power on the closing turn, and it triggers Ember Monk. Costs 1 Power to hide and takes A's slot |
| **Seal of Discord** | 0E 1P · gear | Exhaust: add 1 Chaos, every turn. Pays once and then makes Power. Turn-1 plays are scarce |
| **Ancient Henge** | 2E 1P · gear | Exhaust: turn Energy into Power of any domain. Converts the resource you have spare into the one you're short of |

### More face-down room

| card | cost | read |
|---|---|---|
| **Bushwhack Trap** | 1E · gear | Deploy at A: you may hide an additional card there. Already "open, for games to decide" in the guide. More relevant the more Hidden cards there are |

### Cards, if an Innovator goes

| card | cost | read |
|---|---|---|
| **Kinkou Initiate** | 3E · 3 Might | Draws 1 if your other units have 5+ total Might, which a board holding A usually has. Power-free |
| **Lunar Boon** | 3E | Reaction: discard 1, draw 2. Instant-speed filtering |
| **Disposal Order** | 2E | Reaction: draw 1, or make opponents recycle up to 3 cards from their trashes. Power-free cantrip |
| **Confront** | 2E | Action: units you play this turn enter ready; draw 1. Rengar or Nidalee ready on the closing turn |
| **Spirit Wheel** | 2E · gear | Pay 1 when you choose a friendly unit: draw 1 (Ride the Wind, Punch First, Tideturner, Rampage all choose one) |
| **Yordle Explorer** | 4E · 4 Might | Draws 1 each time you play a card costing 2+ Power: Punch First ×3, Rebuke ×2, Switcheroo |
| **The Good Stuff** | 3E 1P · gear | Already parked in the guide: back "if A holds easily" (draws 3 on every hold) |

### Closers and bodies that move

| card | cost | read |
|---|---|---|
| **Jayce, Hammer in Hand** | 4E 1P · 5 Might | Each time he readies, choose Assault 2, Deflect 2 or **Ganking**. A holder that can walk A → B, or a hard-to-answer attacker |
| **Laurent Bladekeeper** | 3E · 3 Might | Ganking on a 3-drop: a holder that walks A → B. Power-free |
| **Pack of Wonders** | 2E · gear | Exhaust: return a friendly gear, unit or **face-down card** to hand. Replay Faefolk for another pull, Ezreal for another draw 2, or save a unit from removal |
| **Petricite Monument** | 2E · gear | Temporary: all your units have Deflect this turn. Closing-turn protection that taxes their answers (no counter) |
| **Flash** | 2E | Reaction: move up to 2 friendly units to base. Saves the board from a wipe or a bad fight. 5/30 lists |

---

## 2. Already in the list, the sideboard, or tried and out

- **Main:** Sivir, Mercenary · Faefolk · Bedeviling Stranger · Evelynn, Entrancing · Tideturner · Reckless
  Innovator · Nidalee, Cat Form · Ezreal, Prodigy · Ember Monk · Vex, Apathetic · Rengar · Punch First · Gust ·
  Ride the Wind · Rebuke · Switcheroo · Existential Dread · Rampage · Star-Crossed · Boots of Swiftness · Edge
  of Night.
- **Sideboard:** Ruin Runner · Graves · Ravenbloom Prefect · Acceptable Losses · An Offer You Can't Refuse ·
  Sabotage · Unyielding Spirit.
- **Tried and cut, with reasons in `sivir-ready.md`:** Fizz (the deck's "foot in two camps") · Staunch Survivor ·
  First Mate · Nilah · Traveling Merchant · Tail-Cloaked Matriarch · Tornado Warrior (the recursion half) ·
  On the Hunt · Repulse (sideboard against Vex) · Portable Portal · Stare Down · Hard Bargain (narrow) · Abandon ·
  Hold 'Em · Challenge · Cataclysm · Siren's Song · Zed · Baron Nashor (10E, and his Pit gates our own
  eighth-point conquest).

## 3. Doesn't fit the trap

**6+ Energy** (the curve tops out at Rengar, and Sivir closes for 5): Armored Tusker · Angler Wyrm · Anivia ·
Arachnoid Horror · Beast Below · Bilgewater Bully · Bloodscent Swarm · Cataclysmic Duel · Clash of Giants ·
Corrupted Dragon · Deadbloom Predator · Direwing · Downwell · Draven, Audacious · Elder Dragon · Explosimian ·
Fae Dragon · Fretful Feline · Gangplank · Garen · Gentle Gemdragon · Gentlemen's Duel · The Harrowing ·
Illaoi · Jaull-Fish · Kayn · Kharox · Lee Sin · Maduli · Master Bingwen · Master Yi, Honed · Megatusk ·
Mindsplitter · Minah Swiftfoot · Mountain Drake · Ocean Drake · Possession · Rhasa · Sai Scout · Seraphic
Wyvern · Sivir, Ambitious · Soulgorger · Stormclaw Ursine · Syndra · Targonian Visionary · Transpositionist ·
Udyr · Volibear · Warwick · Wild Claw · Wrath of the Freljord. (Elnuk Herd is the exception: Hidden makes it
free.) **Dazzling Aurora: never.**

**XP and Level** (no XP engine here): Blood Rose · Concentrate · Conscription · Crowd Favorite · Demacian
Diplomat · Gemhand Hunter · Grim Resolve (Power-free +3, but the Power in Punch First is what turns Sivir on) ·
Insightful Investigator · Kha'Zix, Evolving Hunter · Master Yi, Tempered · Mister Root · Poppy · Scryer's Bloom ·
Vicious Snapjaws · Voracious Gromp · Wily Newtfish.

**Empower:** Ambessa · Baccai Witherclaw · Brutal Hunter · Dame the Despoiler · Guttural Roar · Hextech Disc ·
Kinkou Lifeblade · Legion Marauder · Mel · Platewyrm Egg · Profiteer · Renekton · Tools of Empire.

**Buffs:** Arena Bar · Buhru Captain · Cithria · Kinkou Monk · Kraken Hunter · Mistfall · Overt Operation ·
Pillaged Armory · Pirate's Haven · Pit Rookie · Sea Monkey · Sett · Wallop · Wildclaw Shaman.

**Equipment-matters** (two pieces of gear isn't enough to feed them): Akshan · Boneshiver · Combat Chef · Cull ·
Doran's Blade · Doran's Ring · Hexdrinker · Hunter's Machete · Jagged Cutlass · Jax · Last Rites (14/30 Sivir
lists, from the older equipment builds) · Lucian · Nazuman Ntofo · Strike Down · Trinity Force · Veteran Poro ·
Warmog's Armor · Yone.

**Trash, Flow and recursion** (Jay wasn't sold on the recursion half): Annie · Cemetery Attendant · Cursed
Sarcophagus · Forgotten Relic · Gust Monk · Heedless Resurrection · Kennen · Morbid Return · Onslaught ·
Shadow Order Disciple · Shadowblade Lurker · Shadows of the Past · Stargazer · Up from the Deep.

**Dragons and Mighty:** Herald of Scales · Raving Witness · Show of Strength.

**Hate against other domains** (sideboard at most): Decree of Discord (Order units) · Decree of Strength (Mind cards).

**Text that doesn't work here:** Twisted Fate (his attack reveals a rune; Fury, Mind and Order do something, and
this rune deck is Body and Chaos) · Angler Beast (returns every unit with 2 Might or less, including your
two-drops) · Flurry of Blades (1 to everything, including Faefolk) · Avalanche (hits units in bases, including
yours) · Whirlwind (symmetric) · Invert Timelines (symmetric) · Suave Negotiator (symmetric draw) · Bone Skewer
(gives them a free unit) · Call to Battle (they pick the unit) · Spiderling (wants many copies).

**Fine cards, outclassed in this deck's slots:** Bewitching Spirit · Catalyst of Aeons · Corrupt Enforcer ·
Crackshot Corsair · Crescent Guardian · Dauntless Vanguard · Determined Sentry · Diana, No Longer Human
(Ambush, +2 per spell; behind Rengar and Nidalee) · Disposal Expert · Dragonsoul Sage · Dune Drake ·
Evershade Stalker · Factory Recall · Fading Memories · Fae Porter · Harpoon Squad · Here to Help (Hidden; plays a
unit from hand to A for 3 less, but A's slot is better spent) · Imposing Challenger · Irelia · Jae Medarda ·
Jarvan IV (Deploy gear) · Jinx · K'Sante (Shield 2, ramps when he holds: a 5-drop holder for A) · Kato ·
Lulu · Marching Orders · Mask Mother · Mechanical Bandit · Miss Fortune, Buccaneer · Miss Fortune, Captain ·
Mobilize · Mystic Poro · Nocturne · Noxian Demolitionist · Overloaded Traveler · Pakaa Cub (vanilla Hidden 3) ·
Primal Strength · Primordial Roar · Pyke, Returned (9/30 Sivir lists) · Qiyana · Repair Specialist · Riven,
Deserter · Satchel Charge · Shipyard Skulker · Siren of the Shallows · Sinister Poro (Power on a two-drop) ·
Skystrike Squadron · Snapvine · Sneaky Deckhand · Sneaky Zeebles · Spoils of War · Stalwart Goatherd · The List ·
The Syren · Titanic Shrine · Towering Combatant · Treasure Hunter · Treasure Trove · Undercover Agent · Vex,
Cheerless · Walking Roost · Yasuo · Ziggs · Zaunite Bouncer · Ancient Warmonger · Seal of Strength (Body
Power; Chaos is the colour short on Power).
