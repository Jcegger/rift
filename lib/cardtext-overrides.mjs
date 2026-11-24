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
};
