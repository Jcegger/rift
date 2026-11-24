// Hand-written entries for sentences lib/cardtext.mjs's grammar can't parse, in the same
// language: card name → { "<sentence as sentencesOf gives it>": ability | static | noTurn }.
// Each is written from the card's text; a rules premise behind one goes in docs/rules-rulings.md.
// `rift cards --coverage` lists what's still unread, heaviest first.
const noPoints = (why) => ({ kind: "noTurn", why });
const me = { who: "me", choose: false };
export const OVERRIDES = {
  // The save recalls the unit (§468 aside, it leaves the battlefield either way), so a battlefield's
  // result this turn is the same as the unit dying; only the card survives. No points change.
  "Zhonya's Hourglass": { "If a friendly unit would die, kill this instead.": noPoints("noPoints"), "Heal that unit, exhaust it, and recall it.": noPoints("noPoints") },
  // Played from hand to base: it returns an enemy unit at a battlefield with 4 or more units there.
  // (From face down inside a fight, lib/fight.mjs plays it.)
  "Bedeviling Stranger": {
    "When you play me, choose a battlefield.": { kind: "ability", trigger: "play", effects: [{ op: "chooseBf" }], text: "When you play me, choose a battlefield." },
    "If there are 4 or more units there, you may return an enemy unit there to its owner's hand.": { kind: "ability", trigger: "spell", cond: "if there are 4 or more units there", effects: [{ op: "bounce", optional: true, target: { who: "unit", side: "enemy", where: "here", choose: true } }], text: "" },
  },
  "Astral Heron": { "When you play your first card each turn, if I'm at a battlefield, the next card you play this turn costs [e2]{A}{A} less.": { kind: "ability", trigger: "youPlayFirst", cond: "if i'm at a battlefield", effects: [{ op: "discountNext", cost: "[e2]{A}{A}" }], text: "" } },
  "Sprite Fountain": { "[Deathknell][>] Repeat this gear's play effect.": { kind: "ability", trigger: "die", effects: [{ op: "token", count: 1, ready: true, might: 3, name: "Sprite", keywords: ["Temporary"], to: "your base" }], text: "" } },
  "En Garde": { "Give a friendly unit +1 M this turn, then an additional +1 M this turn if it is the only unit you control there.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 1, until: "turn", target: { who: "unit", side: "friendly", choose: true } }], text: "" } },
  "Nocturne, Horrifying": { "As you look at or reveal me from the top of your deck, you may banish me.": noPoints("unknownCards"), "If you do, you may play me for {A}.": noPoints("unknownCards") },
  "Tail-Cloaked Matriarch": { "Play it to your base, ignoring its cost.": noPoints("unknownCards") },
  "Call to Glory": { "If you do, ignore this spell's cost.": { kind: "cost", optional: true, text: "" } },
  "Pack of Wonders": { "{T}: Return another friendly gear, unit, or facedown card to its owner's hand.": { kind: "ability", trigger: "activated", cost: "{T}", effects: [{ op: "bounce", target: { who: "unit", side: "friendly", other: true, choose: true } }], text: "" } },
  "Undertitan": { "As I'm revealed from your deck, [Add] [e2].": noPoints("unknownCards") },
  "Shadow Order Disciple": { "When I move, you may [Burn 1] to give me +1 M this turn.": { kind: "ability", trigger: "move", effects: [{ op: "might", n: 1, until: "turn", optional: true, target: me }], text: "" } },
  // Only units that moved this turn: on our turn their units haven't moved.
  "Siren's Song": { "Move an enemy unit that moved this turn.": noPoints("theirTurn") },
  "Dazzling Aurora": { "Play it, ignoring its cost, and recycle the rest.": noPoints("unknownCards") },
  // From face down on your turn the three Gold arrive ready, so they pay this turn; otherwise the one Gold is exhausted (read: "later").
  "The Waters' Wage": { "If it's your turn and you played this from face down, play three ready Gold gear tokens instead.": { kind: "ability", trigger: "spell", cond: "if it's your turn and you played this from face down", effects: [{ op: "gold", n: 3, ready: true }], text: "" } },
  // A spell's second sentence doesn't join the first by itself, so the swap is written into the choice and the condition sentence is folded.
  "Smoke and Mirrors": {
    "Choose a unit you control and another unit you control at a different location.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true }, target2: { who: "unit", side: "friendly", choose: true } }, { op: "swapTwo" }], text: "" },
    "If at least one of them has [Temporary], move each to the other's location.": { kind: "folded" },
  },
  // Read by the damage op (lib/turn.mjs) and by fights (lib/fight.mjs: lethal is 1 past prevention, blasts included).
  "Elder Dragon": { "Any amount of your damage is enough to kill enemy units.": { kind: "static", op: "anyDamageKills" } },
  // The unit enters exhausted at base (§178.1.a.1), so it can't move this turn. Not read: paying its [Accelerate]
  // (§805.6) to have it enter ready and move.
  "Rift Herald": { "[Deathknell][>] Play a unit from your hand to your base, ignoring its Energy cost.": noPoints("later") },
  // Read where a unit dies outside a fight (lib/turn.mjs dieOutside). If Karthus is the one dying, his static has left with him.
  "Karthus, Eternal": { "Your [Deathknell] effects trigger an additional time.": { kind: "static", op: "deathknellTwice" } },
  // Enemy gear isn't on the solver's board (`close` takes none), and gear targets find nothing (lib/turn.mjs candidates),
  // so disempowering or killing it changes nothing this turn; she plays as her body.
  "Tomb-Raider Barbara": { "If it's [Empowered], disempower it.": noPoints("noPoints"), "Otherwise, kill it.": noPoints("noPoints") },
  // "Instead" replaces the 4: one damage effect that is 7 at 7+ runes (a spell's follow-on doesn't join, so it's folded).
  "Siphoning Strike": {
    "Deal 4 to a unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: 4, ifRunes: { min: 7, n: 7 }, target: { who: "unit", where: "bf", choose: true } }], text: "" },
    "If you control 7 or more runes, deal 7 to it instead.": { kind: "folded" },
  },
  "Forecaster": { "Your Mechs have [Vision].": noPoints("draw") },

  // ── 23 Nov, second batch ──
  // The extra rune is channelled exhausted (§ channel): next turn's resource.
  "Seraphic Wyvern": { "If you would channel runes, channel that many runes plus 1 exhausted rune instead.": noPoints("later") },
  // Gold gear tokens played exhausted add nothing until they ready (§415.4).
  "Card Sharp": { "When you play me, you and each opponent may play a Gold gear token exhausted.": noPoints("later"), "For each opponent who did, you play a Gold gear token exhausted.": noPoints("later") },
  "Fanfare": { "The next three times you play a unit this turn, draw 1.": noPoints("draw") },
  "Promising Future": { "Each player looks at the top 5 cards of their Main Deck, banishes one of them, then recycles the rest.": noPoints("unknownCards"), "Starting with the next player, each player plays those cards, ignoring Energy costs.": noPoints("unknownCards") },
  "Void Rush": { "You may banish one, then play it, reducing its cost by [e2].": noPoints("unknownCards") },
  "Diana, Lunari": { "If it's a spell, draw it.": noPoints("draw") },
  // The whole ability is a defend trigger: on our turn our units attack; they defend on theirs.
  "Teemo, Strategist": { "Deal 1 to that unit for each card with [Hidden] revealed this way, then recycle the revealed cards.": noPoints("theirTurn") },
  "Ziggs, Explosive": { "When I defend, you may kill a friendly gear to give me +2 M this turn.": noPoints("theirTurn") },
  "Overzealous Fan": { "When I defend, you may kill me to move an attacking unit to its base.": noPoints("theirTurn") },
  // Our Gravity Field taxes the opponent's moves (their turn). Their gear isn't on the solver's board.
  "Gravity Field": { "Opponents must pay [e1]{A} to move one or more units to this battlefield.": noPoints("theirTurn") },
  // A card hidden this turn can't be played this turn (lib/turn.mjs hidNow), so an extra hide pays off later.
  "Bushwhack Trap": { "While you or an ally control this battlefield, that player may hide an additional card here.": noPoints("later") },
  // Saves like Zhonya's Hourglass: the unit leaves the battlefield either way, so this turn's result is the same.
  "Mordekaiser, Twice Slain": { "Once each turn, if I would die, you may kill a friendly unit to heal me, exhaust me, and recall me instead.": noPoints("noPoints") },
  "Tactical Retreat": { "The next time it would die this turn, heal it, exhaust it, and recall it instead.": noPoints("noPoints") },

  // Read into the language.
  "Dragon Form": { "Its base M becomes 5 this turn.": { kind: "folded" }, "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "baseMight", n: 5, target: { who: "it", choose: false }, until: "turn" }], text: "" } },
  "High Note": { "Give a unit –M this turn equal to the number of exhausted units you control.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: "minusExhaustedMine", until: "turn", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" } },
  // Both at one battlefield: the pair is chosen together (sameLoc), then each is stunned.
  "Facebreaker": { "Stun a friendly unit and an enemy unit at the same battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", sameLoc: true, target: { who: "unit", side: "friendly", where: "bf", choose: true }, target2: { who: "unit", side: "enemy", where: "bf", choose: true } }, { op: "stun", target: { who: "it", choose: false } }, { op: "stun", target: { who: "it2", choose: false } }], text: "" } },
  "Janna, Savior": { "When you play me, heal your units here, then move up to one enemy unit from here to its base.": { kind: "ability", trigger: "play", effects: [{ op: "heal", target: { who: "each", side: "friendly", where: "here", choose: false } }, { op: "move", to: "base", target: { who: "upTo", n: 1, side: "enemy", where: "here", choose: true } }], text: "" } },
  "Hunting Blind": { "When you play this, you may move an enemy unit to this battlefield.": { kind: "ability", trigger: "play", effects: [{ op: "move", to: "here", optional: true, target: { who: "unit", side: "enemy", where: "any", choose: true } }], text: "" } },
  // "To or from": read as the battlefield I arrive at (narrower than the card; never claims a line it doesn't have).
  "Akali, Deadly Weapon": {
    "When I move, you may deal 1 to a unit at a battlefield I moved to or from.": { kind: "ability", trigger: "move", effects: [{ op: "damage", n: 1, ifEmpowered: 2, optional: true, target: { who: "unit", side: "any", where: "here", choose: true } }], text: "" },
    "If I'm [Empowered], deal 2 instead.": { kind: "folded" },
  },
  // Combat triggers (lib/fight.mjs reads only the blast): compiled here, not yet played.
  "Dune Drake": { "When I attack, give me +2 M this turn if there is a ready enemy unit here.": { kind: "ability", trigger: "attack", cond: "if there is a ready enemy unit here", effects: [{ op: "might", n: 2, until: "turn", target: me }], text: "" } },
  // Played in lib/turn.mjs's fight stage on the strongest attacker (ref).
  "Demacian Standard": { "When one or more friendly units attack here, give one of them +2 M this turn.": { kind: "ability", trigger: "allyAttacksHere", effects: [{ op: "might", n: 2, until: "turn", target: { who: "it", choose: false } }], text: "" } },
  "Azir, Sovereign": { "When I attack, you may move any number of your token units to this battlefield.": { kind: "ability", trigger: "attack", effects: [{ op: "move", to: "here", optional: true, target: { who: "upTo", n: 9, side: "friendly", token: true, where: "any", choose: true } }], text: "" } },
  "Ntofo Strikes": { "Give a friendly unit [Shield 2] this turn, then deal damage equal to its [Shield] to an enemy unit.": { kind: "ability", trigger: "spell", effects: [{ op: "keyword", keyword: "Shield", n: 2, until: "turn", target: { who: "unit", side: "friendly", where: "any", choose: true } }, { op: "damage", n: "refShield", target: { who: "unit", side: "enemy", where: "any", choose: true } }], text: "" } },
  // Costs the solver doesn't pay (killing or exhausting a friendly unit): compiled, flagged "activated cost".
  "Escaped Grayback": { "[Empower] — Kill a friendly unit": { kind: "ability", trigger: "activated", cost: "kill a friendly unit", speed: "main", effects: [{ op: "empower", target: me }], text: "" } },
  "Riven, Deserter": { "Exhaust a friendly unit: Ready a unit.": { kind: "ability", trigger: "activated", cost: "exhaust a friendly unit", speed: "main", effects: [{ op: "ready", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" }, "Use this ability only once each turn.": { kind: "folded" } },
  // Killing our own unit or gear for a draw: the kill is read (Deathknell lines use it), the draw isn't this turn's.
  // The second line counts only Deathknells here, which lib/turn.mjs's deathknell() can't tell apart: compiled, not played.
  "Detonation Amplifier": {
    "When you play this, you may kill another friendly unit or gear to draw 1.": { kind: "ability", trigger: "play", modal: true, pick: 1, effects: [], modes: [
      { effects: [{ op: "kill", optional: true, target: { who: "unit", side: "friendly", other: true, where: "any", choose: true } }, { op: "noTurn", why: "draw" }] },
      { effects: [{ op: "killGear", one: true, optional: true, other: true }, { op: "noTurn", why: "draw" }] }], text: "" },
    "Friendly [Deathknell] effects here trigger an additional time.": { kind: "static", op: "deathknellTwiceHere" },
  },
  // "Four instead" of two: two more Recruits when the show-off was paid.
  "Rousing Display": { "If you showed off, play four to your base instead.disa": { kind: "ability", trigger: "spell", cond: "if you showed off", effects: [{ op: "token", count: 2, ready: false, might: 1, name: "Recruit", keywords: [], to: "your base" }], text: "" } },
  "Sett, Brawler": { "Spend my buff: Give me +4 M this turn.": { kind: "ability", trigger: "activated", cost: "spend my buff", speed: "main", effects: [{ op: "might", n: 4, until: "turn", target: me }], text: "" } },
  "Frigid Jewel": { "When you draw your second card each turn, give a friendly unit +2 M this turn.": noPoints("draw") },

  // ── 23 Nov, third batch: points cards the solver now plays ──
  "Confront": { "Units you play this turn enter ready.": { kind: "ability", trigger: "spell", effects: [{ op: "enterReadyTurn" }], text: "" } },
  // Played to a battlefield it contests it at once (lib/turn.mjs: the same arrival as an open-battlefield play). The buff is folded in.
  "Last Caress": {
    "The next unit you play this turn, even from face down, can be played to any battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "nextUnitAnywhere", buff: true }], text: "" },
    "When you play it, [Buff] it.": { kind: "folded" },
  },
  "Herald of Scales": { "Your Dragons' Energy costs are reduced by [e2], to a minimum of [e1].": { kind: "static", op: "tagCostLess", tag: "Dragon", n: 2, min: 1 } },
  "Sky Splitter": { "This spell's Energy cost is reduced by the highest M among units you control.": { kind: "static", op: "costLessHighestMight" } },
  // Read where the solver plays from somewhere other than a hand: the Champion Zone. Not read: tokens and other
  // effect plays (whether an effect's play can take an optional additional cost is an open rules question).
  "Rek'Sai, Breacher": { "Friendly units played from anywhere other than a player's hand have [Accelerate].": { kind: "static", op: "accelNotFromHand" } },
  // Empowered as a count (lib/turn.mjs u.empowered); +2 per time is a "for each" the solver counts.
  "Kayle, Justified": { "I can be [Empowered] up to three times.": { kind: "static", op: "empowerCap", n: 3 } },
  // One spell, so the copy, its readiness and its [Temporary] are one token effect on the chosen unit.
  "Mirror Image": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "token", copyRef: true, count: 1, ready: true, might: 0, name: "Reflection", keywords: ["Temporary"], to: "your base" }], text: "" },
    "Play a ready Reflection unit token to your base.": { kind: "folded" },
    "Then do this: It becomes a copy of that unit.": { kind: "folded" },
    "Give it [Temporary].": { kind: "folded" },
  },
  // At the start of our Beginning Phase, before anything is scored: an alternate win (lib/turn.mjs solveTurn).
  "Gutter Palace": { "At the start of your Beginning Phase, if you have exactly 4 cards in hand and exactly 4 units at battlefields, you win the game.": { kind: "ability", trigger: "startTurn", cond: "if you have exactly 4 cards in hand and exactly 4 units at battlefields", effects: [{ op: "winGame" }], text: "" } },
  // Gear on the board has a location in the solver (lib/turn.mjs gearMeta), and a Bomb's Deathknell runs when it dies.
  // Acceptable Losses: our half (one of our gear, if we have any). Their gear isn't on the solver's board.
  "Acceptable Losses": { "Each player kills one of their gear.": { kind: "ability", trigger: "spell", effects: [{ op: "killGear", one: true }], text: "" } },
  "Hexplosive Minefield": { "Kill any number of friendly Bomb tokens.": { kind: "ability", trigger: "spell", effects: [{ op: "killGear", tag: "Bomb", any: true }], text: "" } },
  // The kill and the free gear are one ability, so "if you do" sees the kill.
  "Jayce, Man of Progress": {
    "When you play me, you may kill a friendly gear.": { kind: "ability", trigger: "play", effects: [{ op: "killGear", one: true, optional: true }, { op: "freeGear", maxE: 7, onlyIfDid: true }], text: "" },
    "If you do, you may play a gear with Energy cost no more than [e7] from hand this turn, ignoring its Energy cost.": { kind: "folded" },
  },
  "Command: Attack": { "Move a friendly gear with [Deploy] to a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "moveGear" }], text: "" } },
  // The Pit is a third battlefield (docs/rules-rulings.md, "The Baron Pit is a battlefield"); lib/turn.mjs op addPit.
  "Baron Nashor": {
    "As you play me, add the Baron Pit battlefield token to the board if it's not there already.": { kind: "ability", trigger: "play", effects: [{ op: "addPit" }], text: "" },
    "If you do, I enter there.": { kind: "folded" },
  },
  "Ziggs, Short-Fused": { "Abilities of friendly gear deal 1 Bonus Damage.": { kind: "static", op: "gearBonusDamage", n: 1 } },
  // The named tag isn't known from a position: the naming is a static the solver doesn't play.
  "The List": {
    "As you play this, name a tag.": { kind: "static", op: "namedTag" },
    "{T}: Give a unit with the named tag -2 M this turn.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "might", n: -2, until: "turn", target: { who: "unit", side: "any", where: "any", namedTag: true, choose: true } }], text: "" },
  },

  // ── 23 Nov, batch 6: triggers ──
  // "When any unit takes damage this turn, kill it": any damage kills, both sides, in and out of fights (lib/turn.mjs decree).
  "Imperial Decree": { "When any unit takes damage this turn, kill it.": { kind: "ability", trigger: "spell", effects: [{ op: "decree" }], text: "" } },
  // The +3 and the delayed XP are one spell: the XP is paid when that unit wins a combat this turn (winXp on the unit).
  "Grim Resolve": {
    "Give a friendly unit +3 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 3, until: "turn", target: { who: "unit", side: "friendly", where: "any", choose: true } }, { op: "winXp", n: 2, target: { who: "it", choose: false } }], text: "" },
    "When it wins a combat this turn, gain 2 XP.": { kind: "folded" },
  },
  // The Sprite is played where she left ("there"), so a battlefield she moves away from stays occupied.
  "Lillia, Fae Fawn": { "When I move from a location, play a 3 M Sprite unit token with [Temporary] there.": { kind: "ability", trigger: "moveFrom", effects: [{ op: "token", count: 1, ready: false, might: 3, name: "Sprite", keywords: ["Temporary"], to: "here" }], text: "" } },
  // The end of our turn comes after this turn's scoring; ready runes are for their turn.
  "Sona, Harmonious": { "At the end of your turn, if I'm at a battlefield, ready up to 4 friendly runes.": noPoints("later") },
  "Rally the Troops": { "When a friendly unit is played this turn, buff it.": { kind: "ability", trigger: "spell", effects: [{ op: "buffOnPlay" }], text: "" } },
  // XP as an activation cost (§728): paid from this turn's XP.
  "Enthralling Protector": { "Spend 2 XP: [Buff] me.": { kind: "ability", trigger: "activated", cost: "spend 2 xp", speed: "main", effects: [{ op: "buff", target: me }], text: "" } },
  "Crowd Favorite": { "Spend 2 XP: [Buff] me.": { kind: "ability", trigger: "activated", cost: "spend 2 xp", speed: "main", effects: [{ op: "buff", target: me }], text: "" } },

  // ── 23 Nov, batch 7: the heaviest one-offs ──
  // Fights read "I don't deal combat damage" from a unit's text (lib/fight.mjs); lib/turn.mjs adds it to the smaller enemies.
  "Vilemaw": { "Enemy units here with less M than me don't deal combat damage.": { kind: "static", op: "vilemaw" } },
  // He enters ready (his first line), so banishing and replaying him at base is a fresh, ready attacker.
  "Ekko, Revolutionary": { "[Action][>] Discard 1, [e1]{Fury}: Banish me, then play me to your base, ignoring my cost.": { kind: "ability", trigger: "activated", cost: "discard 1, [e1]{Fury}", speed: "action", effects: [{ op: "redeploy", target: me, to: "its base" }], text: "" } },
  "Punching Poro": { "[Empower] — Discard 1": { kind: "ability", trigger: "activated", cost: "discard 1", speed: "main", effects: [{ op: "empower", target: me }], text: "" } },
  "Zed, Without a Sound": { "[Action][>] [e1]{Chaos}: Move me and a Shadow Clone you control to each other's locations.": { kind: "ability", trigger: "activated", cost: "[e1]{Chaos}", speed: "action", effects: [{ op: "choose", target: { who: "unit", side: "friendly", tag: "Shadow Clone", choose: true } }, { op: "swapPlaces" }], text: "" } },
  // Each mode starts with the choice, since a mode runs only its own effects.
  "Demon Shade": {
    "Choose a friendly unit, then choose one —": { kind: "ability", trigger: "spell", modal: true, pick: 1, effects: [], modes: [
      { effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "move", to: "an open battlefield", target: { who: "it", choose: false } }] },
      { effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "keyword", keyword: "Ganking", n: 1, until: "turn", cond: "if there are no open battlefields", target: { who: "it", choose: false } }] }], text: "" },
    "Move it to an open battlefield.": { kind: "folded" },
    "Give it [Ganking] this turn if there are no open battlefields.": { kind: "folded" },
  },
  "Ambessa, The Wolf": { "[Empowered][>] I have +3 M and can't be dealt damage unless I'm in combat.": { kind: "static", op: "myMight", n: 3, cond: "[Empowered][>]", noDamageOutsideCombat: true } },
  // Their hand is in the position: a unit from it is played to the chosen battlefield and stunned. One spell, so one ability.
  "Bone Skewer": {
    "Choose a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "chooseBf" }, { op: "pullFromHand", optional: true, stun: true }], text: "" },
    "An opponent reveals their hand.": { kind: "folded" }, "You may choose a unit from it.": { kind: "folded" },
    "They play that unit to that battlefield, ignoring any and all costs.": { kind: "folded" }, "If they do, then do this: [Stun] it.": { kind: "folded" },
  },
  "Illaoi, Prophet of the Great Kraken": { "When you play me or when I score, play a [e1] M Tentacle unit token from Bilgewater.": { kind: "ability", trigger: "playOrScore", effects: [{ op: "token", count: 1, ready: false, might: 1, name: "Tentacle", keywords: [], to: "your base" }], text: "" } },
  "Here to Help": { "You may play a unit from hand to a battlefield you control, reducing its cost by [e3].": { kind: "ability", trigger: "spell", effects: [{ op: "nextUnitAnywhere", mine: true, discount: 3 }], text: "" } },
  "Nami, Headstrong": { "When I hold, the next time you play a unit this turn, ready it and [Buff] it.": { kind: "ability", trigger: "hold", effects: [{ op: "nextUnitReady" }], text: "" } },
  "Sett, Kingpin": { "I get +1 M for each buffed friendly unit at my battlefield.": { kind: "static", op: "myMight", n: 1, per: "buffed friendly unit at my battlefield" } },
  "Armored Tusker": { "When I move, you may deal damage equal to my [Shield] to a unit at a battlefield.": { kind: "ability", trigger: "move", effects: [{ op: "damage", n: "myShield", optional: true, target: { who: "unit", where: "bf", choose: true } }], text: "" } },
  "Allay, Eager Admirer": { "While I'm at a battlefield, your other units here have [Deflect].": { kind: "static", op: "auraKeyword", keywords: ["Deflect"], here: true, other: true, cond: "While I'm at a battlefield" } },
  "Eager Apprentice": { "While I'm at a battlefield, the Energy costs for spells you play is reduced by [e1], to a minimum of [e1].": { kind: "static", op: "spellsCostLess", n: 1, min: 1, cond: "While I'm at a battlefield" } },
  "Orianna, Mechanical Marvel": { "Once each turn, while I'm at a battlefield, you may pay [e1]{A} less to play a gear.": { kind: "static", op: "gearCostLess", e: 1, p: 1, cond: "While I'm at a battlefield" } },
  "Piltovan Guidebot": { "When you play a card, you may have my base M become equal to that card's Energy cost this turn.": { kind: "ability", trigger: "youPlayCard", effects: [{ op: "baseMight", n: "playedCost", optional: true, until: "turn", target: me }], text: "" } },
  "Back to Back": { "Give two friendly units each +2 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 2, until: "turn", target: { who: "upTo", n: 2, side: "friendly", where: "any", choose: true } }], text: "" } },
  "Lacerate": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "disempower", cond: "if the chosen unit is [Empowered]", target: { who: "it", choose: false } }, { op: "kill", cond: "if it has 3 M or less", target: { who: "it", choose: false } }], text: "" },
    "If it's [Empowered], disempower it.": { kind: "folded" }, "Then kill it if it has 3 M or less.": { kind: "folded" },
  },
  // Gear targets find nothing on the solver's board, so the "or a gear" half changes nothing this turn.
  "Burn Away": { "Banish a unit with 3 M or less or a gear.": { kind: "ability", trigger: "spell", effects: [{ op: "banish", target: { who: "unit", side: "any", where: "any", max: 3, choose: true } }], text: "" } },
  "Resonating Strike": {
    "Choose a battlefield you control and a unit you control at a different location.": { kind: "ability", trigger: "spell", effects: [{ op: "chooseBf", controlled: true }, { op: "choose", target: { who: "unit", side: "friendly", where: "elsewhere", choose: true } }, { op: "move", to: "that battlefield", target: { who: "it", choose: false } }, { op: "might", n: 2, until: "turn", target: { who: "it", choose: false } }], text: "" },
    "Move that unit to that battlefield and give it +2 M this turn.": { kind: "folded" },
  },
  "Get Excited!": {
    "Discard 1.": { kind: "ability", trigger: "spell", effects: [{ op: "discard" }, { op: "damage", n: "discardedCost", target: { who: "unit", where: "bf", choose: true } }], text: "" },
    "Deal its Energy cost as damage to a unit at a battlefield.": { kind: "folded" },
  },
  "Ultrasoft Poro": {
    "{T}: Play two 1 M Bird unit tokens with [Deflect].": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "token", count: 2, ready: false, might: 1, name: "Bird", keywords: ["Deflect"], to: "your base" }], text: "" },
    "Use this ability only while I'm at a battlefield.": { kind: "folded" },
  },
  // "Something besides me that's exhausted": read as one of our units (a rune or gear would also do; not read).
  "Jayce, Brilliant Inventor": { "When you play me or the first time you play a non-token gear each turn, you may ready something besides me that's exhausted.": { kind: "ability", trigger: "playOrFirstGear", effects: [{ op: "ready", optional: true, target: { who: "unit", side: "friendly", other: true, where: "any", choose: true } }], text: "" } },
  "Shepherd's Heirloom": { "[Equip] — Spend 1 XP": { kind: "keywords" } },
  "Flame Chompers": { "When you discard me, you may pay {Fury} to play me.": { kind: "ability", trigger: "discardMe", effects: [{ op: "playSelf", pay: "{Fury}" }], text: "" } },
  // No effect this turn, with the reason.
  "Forge of the Future": { "Kill this: Recycle up to 4 cards from trashes.": noPoints("unknownCards") },
  "Shadows of the Past": { "Return up to 2 units from trashes to their owners' hands.": noPoints("unknownCards") },
  "Dockside Lock-Up": { "When you hold here, kill this to play the banished card, ignoring its cost.": noPoints("unknownCards") },
  "Ivern, Nurturer": { "Then if you revealed a Bird, Cat, Dog, or Poro, do this: [Buff] a friendly unit.": noPoints("unknownCards") },
  "Rumble, Hotheaded": { "Reduce its Energy cost by the M of the unit you recycled.": noPoints("unknownCards") },
  "Invigorating Bloom": { "Exhaust a friendly [Mighty] unit, {T}: Draw 1.": noPoints("draw") },
  "Questionable Tome": { "Disempower this, [e1], {T}: Draw 1.": noPoints("draw") },
  "Disintegrate": { "If this kills it, do this: draw 1.": noPoints("draw") },
  // Their choice: damage or our draw. The solver takes the answer worse for us, so it's a draw.
  "Shakedown": { "Deal 6 to it unless its controller has you draw 2.": noPoints("draw") },
  // A card hidden this turn can't be played this turn (lib/turn.mjs hidNow).
  "Guerilla Warfare": { "You can hide ignoring costs this turn.": noPoints("later") },
  "Coalesced Energy": { "At the end of your turn, recycle all your runes, then channel 4 runes exhausted.": noPoints("later") },
  // [Action] is timing; the solver already plays our main phase, where gear can be played anyway.
  "Jarvan IV, Martial Paragon": { "Your gear with [Deploy] have [Action].": noPoints("noPoints") },
  // On our turn our units attack, and Shield is "+N while a defender": doubling it adds nothing to an attacker.
  "K'Sante, Dauntless": { "When I attack or defend, double the [Shield] of a unit you control here this turn.": noPoints("noPoints") },

  // ── 23 Nov, batch 8 ──
  "Renata Glasc, Industrialist": { "Your tokens enter ready.": { kind: "static", op: "tokensReady" } },
  "Zenith Blade": {
    "Stun an enemy unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "stun", target: { who: "unit", side: "enemy", where: "bf", choose: true } }, { op: "move", to: "refLocation", optional: true, target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
    "You may move a friendly unit to that enemy unit's battlefield.": { kind: "folded" },
  },
  "Rally for War": {
    "Choose an occupied enemy battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "chooseBf", enemyOccupied: true }, { op: "token", count: 3, ready: false, might: 1, name: "Recruit", keywords: [], to: "here" }], text: "" },
    "Play three 1 M Recruit unit tokens there.": { kind: "folded" },
  },
  // Recalls aren't moves (a losing attacker's return, §468.1.a.2, still happens).
  "Minotaur Reckoner": { "Units can't move to base.": { kind: "static", op: "noMoveToBase" } },
  "Daisy!": { "Reduce my cost by [e1] for each of the following tags among your units — Bird, Cat, Dog, and Poro.": { kind: "static", op: "costLess", n: 1, per: "tags among your units" } },
  "Annie, Fiery": { "Your spells and abilities deal 1 Bonus Damage.": { kind: "static", op: "spellBonusDamage", n: 1 } },
  "Neeko, Blending In": {
    "If Neeko is in your deck, choose up to 3 different legends in addition to your starting legend.": noPoints("deckbuilding"),
    // Which legend joins isn't in the position.
    "When you play me, choose one of those Legends and add it to your Legend Zone while I'm on the board.": noPoints("unknownCards"),
  },
  // Recalled instead of dying, as Zhonya's Hourglass: the battlefield's result is the same this turn.
  "Soraka, Wanderer": { "If another unit you control here would die, if it has less M than me, instead heal it, exhaust it, and recall it.": noPoints("noPoints") },
  // Their hand is in the position: the card we pick leaves it.
  "Mindsplitter": { "Choose a card from it, and they discard that card.": { kind: "ability", trigger: "spell", effects: [{ op: "theirDiscard" }], text: "" } },
  "Fight or Flight": { "Move a unit from a battlefield to its base.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "base", target: { who: "unit", side: "any", where: "bf", choose: true } }], text: "" } },
  // The XP additional cost isn't paid by the play loop, so we always kill one of ours too (the cautious reading).
  "Safety Inspector": {
    "When you play me, each player must kill one of their units.": { kind: "ability", trigger: "play", effects: [{ op: "edict", skipMineIfPaid: true }], text: "" },
    "If you paid my additional cost, you don't kill a unit this way.": { kind: "folded" },
  },
  "Arena Bar": { "{T}: Buff an exhausted friendly unit.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "buff", target: { who: "unit", side: "friendly", exhausted: true, choose: true } }], text: "" } },
  "Lulu, Whimsical": { "When I move, you may have another unit's base M become 4 this turn.": { kind: "ability", trigger: "move", effects: [{ op: "baseMight", n: 4, optional: true, until: "turn", target: { who: "unit", side: "any", other: true, where: "any", choose: true } }], text: "" } },
  "Jhin, Meticulous Killer": { "If you've spent [e4] or more to play a spell this turn, you may play me for {Mind}.": { kind: "static", op: "jhinCost" } },
  "Morgana, Vindictive": { "When you play me, deal damage to a unit equal to the damage marked on it.": { kind: "ability", trigger: "play", effects: [{ op: "damage", n: "itsDamage", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" } },
  "Stalwart Goatherd": { "When you play me, you may kill a gear with Energy cost [e4] or less.": noPoints("noPoints") },
  "Blast Cone": { "When you move an enemy unit, you may exhaust this to [Stun] it.": { kind: "static", op: "blastCone" } },
  "Miss Fortune, Buccaneer": { "Friendly units may be played to open battlefields.": { kind: "static", op: "unitsToOpen" } },
  "Mel, Newly Awakened": {
    "[Empowered][>] Your spells and abilities can't be countered.": { kind: "static", op: "uncounterable", cond: "[Empowered][>]" },
    "If a spell or ability you control would give -M to a unit it chooses, it gives an additional -1 M.": { kind: "static", op: "extraMinus" },
  },
  "Fox-Fire": { "Kill any number of units at a battlefield with total M 4 or less.": { kind: "ability", trigger: "spell", effects: [{ op: "foxFire", total: 4 }], text: "" } },
  "Counter Strike": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "prevent", n: 99, target: { who: "it", choose: false } }], text: "" },
    "The next time that unit would be dealt damage this turn, prevent it.": { kind: "folded" },
  },
  "Stormbringer": {
    "Choose a friendly unit in your base.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", where: "base", choose: true } }, { op: "chooseBf" }, { op: "damage", n: "refMight", target: { who: "each", side: "enemy", where: "here", choose: false } }, { op: "move", to: "that battlefield", target: { who: "it", choose: false } }], text: "" },
    "Deal damage equal to its M to all enemy units at a battlefield, then move your unit there.": { kind: "folded" },
  },
  "Shadow Dash": {
    "Move an enemy unit to a battlefield where you have units.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "a battlefield where you have units", twoBonus: 1, target: { who: "unit", side: "enemy", where: "any", choose: true } }], text: "" },
    "If you have exactly two units there, they each get +1 M this turn.": { kind: "folded" },
  },
  "Blue Sentinel": { "Your hold effects for holding here trigger an additional time.": { kind: "static", op: "holdTwiceHere" } },
  "Entrenched Boar": { "You may have me enter ready.": noPoints("noPoints"), "If you do, I can't move this turn.": noPoints("noPoints") },
  "Chakram Dancer": { "When you play me, give your other units here [Shield] this turn.": noPoints("noPoints") },
  "Keeper of Law": { "I cost [e2]{Order} less if you control a battlefield with exactly two units there.": { kind: "static", op: "costLess", cost: "[e2]{Order}", cond: "if you control a battlefield with exactly two units there" } },
  "Cataclysm": {
    "Opponents can't play spells this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "noSpells" }], text: "" },
    "Move a friendly unit to an occupied enemy battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "an occupied enemy battlefield", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
  },
  // A ready trigger runs in place on its first result, so Ganking (the mode that moves) is listed first.
  "Jayce, Hammer in Hand": { "When I become ready, choose one to give me this turn —": { kind: "ability", trigger: "readied", modal: true, pick: 1, effects: [], modes: [
    { effects: [{ op: "keyword", keyword: "Ganking", n: 1, until: "turn", target: me }] }, { effects: [{ op: "keyword", keyword: "Assault", n: 2, until: "turn", target: me }] }, { effects: [{ op: "keyword", keyword: "Deflect", n: 2, until: "turn", target: me }] }], text: "" } },
  "Ravenbloom Prefect": { "When an opponent plays a gear, you may banish me to banish it.": noPoints("theirTurn") },
  "Deadbloom Predator": { "You may play me to an occupied enemy battlefield.": { kind: "static", op: "ambushAnywhere" } },
  "Yasuo, Windrider": { "The third time I move in a turn, you score 1 point.": { kind: "ability", trigger: "thirdMove", effects: [{ op: "score", n: 1 }], text: "" } },
  // The solver plays spells from hand or face down (already free): the discount never applies.
  "Drag Under": { "I cost [e2] less to play from anywhere other than your hand.": noPoints("noPoints") },
  "Hostile Takeover": {
    "Take control of an enemy unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "takeControl", target: { who: "unit", side: "enemy", where: "bf", choose: true } }, { op: "ready", target: { who: "it", choose: false } }], text: "" },
    "Ready it.": { kind: "folded" },
    "Lose control of that unit and recall it at end of turn.": noPoints("later"),
  },
  "Scryer's Bloom": { "Kill this, [e1], {T}: [Predict 2], then draw 1.": noPoints("draw") },
  "Riven, Shattered": { "Deal 2 to it for each Equipment attached to me.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: "twoPerEquipment", target: { who: "it", choose: false } }], text: "" } },
  "Acceleration Gate": { "Ready up to 4 units, gear, and/or runes.": { kind: "ability", trigger: "spell", effects: [{ op: "readyUpTo", n: 4 }], text: "" } },
  "Atakhan": { "When I attack, the defender must kill one of their units here.": { kind: "ability", trigger: "attack", effects: [{ op: "edictThere" }], text: "" } },
  "Friendship": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "might", n: "tagsAmong", until: "turn", target: { who: "it", choose: false } }], text: "" },
    "Give it +1 M this turn for each of the following tags among your units — Bird, Cat, Dog, and Poro.": { kind: "folded" },
  },

  // ── 23 Nov, batch 9 ──
  "Ashe, Focused": { "Choose a card revealed this way and banish it.": { kind: "ability", trigger: "spell", effects: [{ op: "theirDiscard" }], text: "" }, "When they hold, return it to their hand.": noPoints("theirTurn") },
  // Their targeting of our gear isn't on the solver's board.
  "Watchful Curator": { "Your gear have [Deflect].": noPoints("noPoints") },
  "Whirling Twirligig": {
    "Kill a friendly gear, {T}: Play a 1 M Recruit unit token.": { kind: "ability", trigger: "activated", cost: "kill a friendly gear, {T}", speed: "main", effects: [{ op: "token", count: 1, ready: false, might: 1, name: "Recruit", keywords: [], to: "your base" }], text: "" },
    "Kill a friendly unit, {T}: Play a 3 M Mech unit token.": { kind: "ability", trigger: "activated", cost: "kill a friendly unit, {T}", speed: "main", effects: [{ op: "token", count: 1, ready: false, might: 3, name: "Mech", keywords: [], to: "your base" }], text: "" },
  },
  // The top of the deck decides both branches.
  "Apprentice Smith": { "If it's a gear, draw it.": noPoints("unknownCards") },
  "Pakaa Protector": { "If it's a unit, draw it.": noPoints("unknownCards"), "Otherwise, put it in your trash and give me +2 M this turn.": noPoints("unknownCards") },
  "Public Execution": {
    "Choose a friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "kill", target: { who: "unit", side: "enemy", where: "any", lessThanRef: true, choose: true } }], text: "" },
    "Kill an enemy unit with less M than it.": { kind: "folded" },
  },
  "Against the Odds": { "Give a friendly unit at a battlefield +2 M this turn for each enemy unit there.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: "twoPerEnemyThere", until: "turn", target: { who: "unit", side: "friendly", where: "bf", choose: true } }], text: "" } },
  "Leona, Zealot": { "Stunned enemy units here have -8 M, to a minimum of 1 M.": { kind: "static", op: "leona" } },
  "Danger Zone": { "Give your Mechs +1 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 1, until: "turn", target: { who: "each", side: "friendly", tag: "Mech", where: "any", choose: false } }], text: "" } },
  // "One on one": this unit and the enemy unit at its location are both alone (rules.md, Keywords).
  "Fiora, Peerless": { "When I attack or defend one on one, double my M this combat.": { kind: "ability", trigger: "attackOrDefend", cond: "if I'm one on one", effects: [{ op: "might", n: "myMight", until: "combat", target: me }], text: "" } },
  "Magma Wurm": { "Other friendly units enter ready.": { kind: "static", op: "othersEnterReady" } },
  "Scrapheap": { "When this is played, discarded, or killed, draw 1.": noPoints("draw") },
  "Crimson Pigeons": { "I have +2 M while I'm attacking with another unit.": { kind: "static", op: "myMight", n: 2, cond: "While I'm attacking with another unit" } },
  "Avalanche": { "Deal 3 to all units in bases.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: 3, target: { who: "each", side: "any", where: "base", choose: false } }], text: "" } },
  "Improvised Projectile": {
    "Choose a friendly gear.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: "bestGearCost", target: { who: "unit", where: "bf", choose: true } }], text: "" },
    "Deal damage equal to its Energy cost to a unit at a battlefield.": { kind: "folded" },
  },
  "Jax, Unmatched": { "Your Equipment everywhere have [Quick-Draw].": { kind: "static", op: "equipQuickDraw" } },
  // [Temporary] acts at the start of the next turn.
  "LeBlanc, Everywhere at Once": { "Your [Temporary] effects at my battlefield don't trigger.": noPoints("later") },
  "Fading Memories": { "Give a unit at a battlefield or a gear [Temporary].": noPoints("later") },
  "Last Breath": {
    "Ready a friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "ready", target: { who: "it", choose: false } }, { op: "damage", n: "refMight", target: { who: "unit", side: "enemy", where: "bf", choose: true } }], text: "" },
    "It deals damage equal to its M to an enemy unit at a battlefield.": { kind: "folded" },
  },
  // Their gear isn't on the board; ours is (a Bomb costs nothing, so it qualifies).
  "Pickpocket": { "When you play me, you may kill a gear with Energy cost no more than [e1].": { kind: "ability", trigger: "play", effects: [{ op: "killGear", one: true, optional: true, maxE: 1 }], text: "" } },
  "Draven, Showboat": { "My M is increased by your points.": { kind: "static", op: "myMight", n: 1, per: "your points" } },
  "Heroic Charge": { "Give a friendly unit +1 M this turn and [Stun] an enemy unit at its location.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 1, until: "turn", target: { who: "unit", side: "friendly", where: "bf", choose: true } }, { op: "stun", target: { who: "unit", side: "enemy", where: "refLoc", choose: true } }], text: "" } },
  "Bushwhack": { "Friendly units enter ready this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "enterReadyTurn" }], text: "" } },
  "Renata Glasc, Mastermind": {
    "[e4]{Mind}{Mind}{Mind}{Mind}, {T}: Score 1 point.": { kind: "ability", trigger: "activated", cost: "[e4]{Mind}{Mind}{Mind}{Mind}, {T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "score", n: 1 }], text: "" },
    "Use my abilities only while I'm at a battlefield.": { kind: "folded" },
  },
  "Isolate": {
    "Move an enemy unit from a battlefield to its base.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "base", target: { who: "unit", side: "enemy", where: "bf", choose: true } }], text: "" },
    "Then, if there's an enemy unit alone at that battlefield, draw 1.": noPoints("draw"),
  },
  "Crescent Strike": {
    "Choose a battlefield and an enemy unit there.": { kind: "ability", trigger: "spell", effects: [{ op: "chooseBf" }, { op: "choose", target: { who: "unit", side: "enemy", where: "here", choose: true } }, { op: "damage", n: 4, target: { who: "it", choose: false } }, { op: "damage", n: 1, target: { who: "each", side: "enemy", where: "here", otherThanRef: true, choose: false } }], text: "" },
    "Deal 4 to that unit and 1 to each other enemy unit there.": { kind: "folded" },
  },
  "Mel, Defiant Soul": { "[Empower] — Discard a spell": { kind: "ability", trigger: "activated", cost: "discard a spell", speed: "main", effects: [{ op: "empower", target: me }], text: "" } },
  "Arachnoid Horror": {
    "I can be played to an occupied battlefield if an enemy unit is alone there.": { kind: "static", op: "playToLoneEnemy" },
    "Friendly units can be played to an occupied battlefield if an enemy unit is alone there.": { kind: "static", op: "unitsToLoneEnemy" },
  },
  "Brawl": { "Give a unit [Assault] this turn equal to its M.": { kind: "ability", trigger: "spell", effects: [{ op: "keyword", keyword: "Assault", n: "itsMight", until: "turn", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" } },
  "Ocean Drake": { "When you play me, you may return a non-Dragon unit to its owner's hand.": { kind: "ability", trigger: "play", effects: [{ op: "bounce", optional: true, target: { who: "unit", side: "any", where: "any", notTag: "Dragon", choose: true } }], text: "" } },
  "Clocktower Guardian": { "When you play me or when I hold, [Predict 3].": noPoints("draw"), "You may play it, ignoring its Energy cost.": noPoints("unknownCards") },
  "Repair Specialist": { "I have [Assault] equal to the number of gear you control.": { kind: "static", op: "assaultPerGear" } },
  "Wizened Elder": { "While I'm buffed, I have an additional +1 M.": { kind: "static", op: "myMight", n: 1, cond: "While I'm buffed" } },
  "Lotus Trap": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "doubleDamage", target: { who: "it", choose: false } }], text: "" },
    "Double all damage that would be dealt to it this turn.": { kind: "folded" },
  },
  "Miss Fortune, Captain": { "The first time I move each turn, you may ready something else that's exhausted.": { kind: "ability", trigger: "firstMove", effects: [{ op: "ready", optional: true, target: { who: "unit", side: "friendly", other: true, exhausted: true, choose: true } }], text: "" } },
  // The [e2] pays only for spells (lib/turn.mjs spellE).
  "Lux, Crownguard": {
    "{T}: [Reaction] — [Add] [e2].": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", effects: [{ op: "add", power: [], energy: 2, spellsOnly: true }], text: "" },
    "Use only to play spells.": { kind: "folded" },
  },
  "Highlander": { "The next time it would die this turn, heal it, exhaust it, and recall it instead.": noPoints("noPoints") },
  "Warwick, Hunter": { "When I attack, kill all damaged enemy units here.": { kind: "ability", trigger: "attack", effects: [{ op: "kill", target: { who: "each", side: "enemy", where: "here", damaged: true, choose: false } }], text: "" } },
  "Chemtech Cask": { "When you play a spell on an opponent's turn, you may exhaust me to play a Gold gear token exhausted.": noPoints("theirTurn") },
  // To the top or bottom of their deck: off the board with no Deathknell, as a banish.
  "Keeper's Verdict": {
    "Choose an enemy unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "banish", target: { who: "unit", side: "enemy", where: "bf", choose: true } }], text: "" },
    "Its owner places it on the top or bottom of their Main Deck.": { kind: "folded" },
  },
  "Drakehound Packmaster": { "Choose one and banish it, then play it, ignoring its cost.": noPoints("unknownCards") },
  "Yuumi, Magical Cat": { "When I attack or defend, give one of your other units here +3 M and [Tank] this turn.": { kind: "ability", trigger: "attackOrDefend", effects: [{ op: "might", n: 3, until: "turn", keyword: "Tank", kn: 1, target: { who: "unit", side: "friendly", other: true, where: "here", choose: true } }], text: "" } },
  "Bullet Time": { "Pay any amount of {A} to deal that much damage to all enemy units at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "bulletTime" }], text: "" } },
  "Downwell": { "Return all units and gear to their owners' hands.": { kind: "ability", trigger: "spell", effects: [{ op: "returnAll" }], text: "" } },

  // ── 23 Nov, batch 10 ──
  "Forgotten Signpost": { "[Action][>] Exhaust a unit you control, {T}: Move a different unit you control to the location of the unit you exhausted to pay for this ability.": { kind: "ability", trigger: "activated", cost: "exhaust a friendly unit, {T}", speed: "action", effects: [{ op: "move", to: "lastExhaustedLoc", target: { who: "unit", side: "friendly", notLastExhausted: true, choose: true } }], text: "" } },
  "Unlicensed Armory": { "The next time it would die this turn, you may pay {Fury} to heal it, exhaust it, and recall it instead.": noPoints("noPoints") },
  "Maddened Marauder": { "When you play me, move a unit from a battlefield to its base.": { kind: "ability", trigger: "play", effects: [{ op: "move", to: "base", target: { who: "unit", side: "any", where: "bf", choose: true } }], text: "" } },
  "Stand United": { "Buffs give an additional +1 M to friendly units this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "buffPlus" }], text: "" } },
  "Honeyfruit": { "[Level 6][>] [>>][Reaction][>] {T}: [Add] [e1]{A}.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", cond: "[Level 6][>]", effects: [{ op: "add", power: ["A"], energy: 1 }], text: "" } },
  "Corrupted Dragon": { "When I attack, you may move any number of enemy units here each with 5 M or less to their base.": { kind: "ability", trigger: "attack", effects: [{ op: "move", to: "base", target: { who: "each", side: "enemy", where: "here", max: 5, choose: false } }], text: "" } },
  "Mysterious Chronomancer": { "When you play me, [Predict 2].": noPoints("draw") },
  "Lee Sin, Centered": { "Other buffed friendly units at my battlefield have +2 M.": { kind: "static", op: "aura", n: 2, here: true, buffedOnly: true } },
  "Monch": { "If an opponent controls a stunned unit, I cost [e2] less and enter ready.": { kind: "static", op: "costLess", n: 2, cond: "if an opponent controls a stunned unit", alsoEnterReady: true } },
  // "We deal damage equal to our Mights to each other": me and the chosen enemy.
  "Carnivorous Snapvine": {
    "When you play me, choose an enemy unit at a battlefield.": { kind: "ability", trigger: "play", effects: [{ op: "choose", target: me, target2: { who: "unit", side: "enemy", where: "bf", choose: true } }, { op: "fight" }], text: "" },
    "We deal damage equal to our M to each other.": { kind: "folded" },
  },
  // Their points matter on our turn too: we win only with more than them (§194.2).
  "Draven, Audacious": { "When I die in combat, choose an opponent.": { kind: "ability", trigger: "dieInCombat", effects: [{ op: "scoreOpp", n: 1 }], text: "" }, "They score 1 point.": { kind: "folded" } },
  // He takes the tag our units lack (the best choice for the four-tag point).
  "Ivern, Friend to All": {
    "As you play me, choose Bird, Cat, Dog, or Poro.": { kind: "static", op: "ivernTag" }, "I gain that tag.": { kind: "folded" },
    "When I conquer or hold, score 1 point if your units have all of the following tags among them — Bird, Cat, Dog, and Poro.": { kind: "ability", trigger: "conquerOrHold", cond: "if your units have all of the following tags", effects: [{ op: "score", n: 1 }], text: "" },
  },
  "Zilean, Time Mage": { "Once each turn, if you would play a token unit while I'm at a battlefield, you may play that token and an additional copy of it instead.": { kind: "static", op: "zilean", cond: "While I'm at a battlefield" } },
  "Noxus Saboteur": { "Your opponents' [Hidden] cards can't be revealed here.": { kind: "static", op: "saboteur" } },
  "Primordial Roar": { "If you showed off a unit, deal damage equal to that unit's M to a unit.": { kind: "ability", trigger: "spell", cond: "if you showed off a unit", effects: [{ op: "damage", n: "shownMight", target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" } },
  "Strike Down": {
    "Choose an equipped friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", equipped: true, choose: true } }, { op: "damage", n: "refMight", target: { who: "unit", side: "enemy", where: "any", choose: true } }, { op: "detach" }], text: "" },
    "It deals damage equal to its M to an enemy unit.": { kind: "folded" }, "Then detach an Equipment from it.": { kind: "folded" },
  },
  "Spirit Wheel": { "When you choose a friendly unit, you may pay [e1] and exhaust this to draw 1.": noPoints("draw") },
  "Fresh Beans": { "When you play a unit during a showdown, you may exhaust this to draw 1.": noPoints("draw") },
  "Swain, Visionary": { "When I conquer, if you've played a non-token unit, a non-token gear, and a spell this turn, you score 1 point.": { kind: "ability", trigger: "conquer", cond: "if you've played a non-token unit, a non-token gear, and a spell this turn", effects: [{ op: "score", n: 1 }], text: "" } },
  "Lord Broadmane": { "When you play me, give your other units here [Assault] this turn.": { kind: "ability", trigger: "play", effects: [{ op: "keyword", keyword: "Assault", n: 1, until: "turn", target: { who: "each", side: "friendly", other: true, where: "here", choose: false } }], text: "" } },
  "Soul Shepherd": { "Your token units have +1 M.": { kind: "static", op: "aura", n: 1, tokenOnly: true } },
  "Keeper of Masks": {
    "When you play me, play two Reflection unit tokens here.": { kind: "ability", trigger: "play", effects: [{ op: "token", count: 2, copySelf: true, ready: false, might: 0, name: "Reflection", keywords: [], to: "here" }], text: "" },
    "Then do this: They become copies of me.": { kind: "folded" },
  },
  "Caitlyn, Patrolling": {
    "{T}: Deal damage equal to my M to a unit at a battlefield.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "damage", n: "myMight", target: { who: "unit", where: "bf", choose: true } }], text: "" },
    "Use this ability only while I'm at a battlefield.": { kind: "folded" },
  },
  "Xerath, Freed": {
    "{Fury}, {T}: Deal 3 to a unit.": { kind: "ability", trigger: "activated", cost: "{Fury}, {T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "damage", n: 3, target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" },
    "Use this ability only while I'm at a battlefield.": { kind: "folded" },
  },
  // The solver uses a non-exhaust ability once a turn already.
  "Azir, Ascendant": { "Use only once per turn.": { kind: "folded" } },
  "Blade of the Ruined King": { "[Equip] — {Order}, Kill a friendly unit": { kind: "keywords" } },
  "Dauntless Vanguard": { "You may play me to an occupied enemy battlefield.": { kind: "static", op: "ambushAnywhere" } },
  "Fae Porter": { "When I move to a battlefield, you may pay {Chaos} to move a unit you control to the same battlefield.": { kind: "ability", trigger: "move", effects: [{ op: "move", to: "here", optional: true, pay: "{Chaos}", target: { who: "unit", side: "friendly", other: true, where: "any", choose: true } }], text: "" } },
  "Called Shot": { "Draw one and recycle the other.": noPoints("draw") },
  "Spirit's Refuge": { "Friendly buffed units have [Deflect] if they didn't already.": { kind: "static", op: "auraKeyword", keywords: ["Deflect"], buffedOnly: true } },
  "Scrutinizing Scope": { "They guess a card type.": noPoints("unknownCards"), "Otherwise, draw it.": noPoints("draw") },
  "Hextech Anomaly": { "{T}: [Reaction] — Pay any amount of {A} to [Add] that much Energy.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", effects: [{ op: "powerToEnergy" }], text: "" } },
  "Apprentice Mage": { "When I become [Empowered], [Predict 2].": noPoints("draw") },
  "Bonds of Strength": { "Give two friendly units each +1 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: 1, until: "turn", target: { who: "upTo", n: 2, side: "friendly", where: "any", choose: true } }], text: "" } },
  "Grumpy Rockbear": { "This ability costs [e1] less for each rune you control.": { kind: "folded" } },
  "Lee Sin, Ascetic": { "I can have any number of buffs.": { kind: "static", op: "multiBuff" } },
  "Garen, Commander": { "Other friendly units have +1 M here.": { kind: "static", op: "aura", n: 1, here: true } },
  "Firebrand Raider": { "Other units enter ready.": { kind: "static", op: "othersEnterReady" }, "Units don't ready during the Awaken Phase.": noPoints("later") },
  "Raging Firebrand": { "When you play me, the next spell you play this turn costs [e5] less.": { kind: "ability", trigger: "play", effects: [{ op: "discountNext", cost: "[e5]", spellsOnly: true }], text: "" } },
  "Convergent Mutation": {
    "Choose a friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "might", n: "toBestOther", until: "turn", target: { who: "it", choose: false } }], text: "" },
    "This turn, increase its M to the M of another friendly unit.": { kind: "folded" },
  },
  // The four mode lines that follow become its modes.
  "Udyr, Wildman": { "Spend my buff: Choose one you've not chosen this turn —": { kind: "ability", trigger: "activated", cost: "spend my buff", speed: "main", modal: true, pick: 1, modes: [], effects: [], text: "" } },
  "Tianna Crownguard": { "While I'm at a battlefield, opponents can't gain points.": { kind: "static", op: "noOppPoints", cond: "While I'm at a battlefield" } },
  "Vi, Hotheaded": { "[e2]{Fury}: Double my M this turn.": { kind: "ability", trigger: "activated", cost: "[e2]{Fury}", speed: "main", effects: [{ op: "might", n: "myMight", until: "turn", target: me }], text: "" } },
  "Dame the Despoiler": { "Increase my M to its M this turn, then give me +1 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: "toRefPlusOne", until: "turn", target: me }], text: "" } },
  "Mageseeker Investigator": { "Opponents must pay {A} for each unit beyond the first to move multiple units to my battlefield at the same time.": noPoints("theirTurn") },
  // Closing positions come after turn 3.
  "Ol' Poro": { "I can't be played on your first, second, or third turns.": noPoints("noPoints") },
};
