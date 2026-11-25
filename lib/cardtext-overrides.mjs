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
  // Read as a draw until 25 Nov, so neither solver ever killed with it. Discarding is the cost (lib/turn.mjs payDiscard).
  "Mordekaiser, Dominating": { "When you play me or when I attack, you may discard 1 to kill a unit or gear.": { kind: "ability", trigger: "playOrAttack", effects: [{ op: "kill", payDiscard: 1, target: { side: "any", where: "any", choose: true, who: "unit", kind: "permanent" } }], text: "" } },
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

  "Annie, Fiery": { "Your spells and abilities deal 1 Bonus Damage.": { kind: "static", op: "spellBonusDamage", n: 1 } },
  "Neeko, Blending In": {
    "If Neeko is in your deck, choose up to 3 different legends in addition to your starting legend.": noPoints("deckbuilding"),
    // Which legend joins isn't in the position.
    "When you play me, choose one of those Legends and add it to your Legend Zone while I'm on the board.": noPoints("unknownCards"),
  },
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
  // [Temporary] units die at the start of our Beginning Phase (§816.1.b–c; lib/turn.mjs solveTurn): not at her battlefield.
  "LeBlanc, Everywhere at Once": { "Your [Temporary] effects at my battlefield don't trigger.": { kind: "static", op: "leblancTemporary" } },
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
    "Use only to play spells.": { kind: "folded" }, "Spend this Energy only to play spells.": { kind: "folded" },   // the promo's wording
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
    "I must be assigned combat damage last.": { kind: "static", op: "backlineText" },   // Backline's wording (§826.3)
    "{T}: Deal damage equal to my M to a unit at a battlefield.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "damage", n: "myMight", target: { who: "unit", where: "bf", choose: true } }], text: "" },
    "Use this ability only while I'm at a battlefield.": { kind: "folded" },
  },
  "Xerath, Freed": {
    "{Fury}, {T}: Deal 3 to a unit.": { kind: "ability", trigger: "activated", cost: "{Fury}, {T}", speed: "main", cond: "While I'm at a battlefield", effects: [{ op: "damage", n: 3, target: { who: "unit", side: "any", where: "any", choose: true } }], text: "" },
    "Use this ability only while I'm at a battlefield.": { kind: "folded" },
  },
  // The solver uses a non-exhaust ability once a turn already.
  "Azir, Ascendant": {
    "Use only once per turn.": { kind: "folded" },
    // Joins the swap ability before it: one of the chosen unit's Equipment attaches to him (feature 7).
    "If it's equipped, you may attach one of its Equipment to me.": { kind: "ability", trigger: "spell", effects: [{ op: "takeEquipFromRef" }], text: "" },
  },
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

  // ── 24 Nov, batch 11 ──
  "Solari Shrine": { "When you kill a stunned enemy unit, you may exhaust this to draw 1.": noPoints("draw") },
  "Portal Rescue": { "Banish a friendly unit, then its owner plays it to their base, ignoring its cost.": { kind: "ability", trigger: "spell", effects: [{ op: "redeploy", to: "its base", target: { who: "unit", side: "friendly", choose: true } }], text: "" } },
  "Sun Disc": { "{T}: [Legion] — The next unit you play this turn enters ready.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", cond: "[Legion]", effects: [{ op: "nextUnitReady", buff: false }], text: "" } },
  // One spell: the moved unit and another enemy at its destination fight.
  "Dragon's Rage": {
    "Move an enemy unit.": { kind: "ability", trigger: "spell", effects: [{ op: "move", target: { who: "unit", side: "enemy", where: "any", choose: true } }, { op: "choose", target: { who: "it", choose: false }, target2: { who: "unit", side: "enemy", where: "refLoc", otherThanRef: true, choose: true } }, { op: "fight" }], text: "" },
    "Then do this: Choose another enemy unit at its destination.": { kind: "folded" }, "They deal damage equal to their M to each other.": { kind: "folded" },
  },
  "Siphon Power": {
    "Choose a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "chooseBf" }, { op: "might", n: 1, until: "turn", target: { who: "each", side: "friendly", where: "here", choose: false } }, { op: "might", n: -1, floor: 1, until: "turn", target: { who: "each", side: "enemy", where: "here", choose: false } }], text: "" },
    "Give friendly units there +1 M this turn and enemy units there -1 M this turn, to a minimum of 1 M.": { kind: "folded" },
  },
  "Altar of Memories": { "When a friendly unit dies, you may exhaust me to draw 1, then put a card from your hand on the top or bottom of your Main Deck.": noPoints("draw") },
  "Aurok General": { "[Empowered][>] Your units that are [Empowered] have +2 M.": { kind: "static", op: "aura", n: 2, cond: "[Empowered][>]", empoweredOnly: true, includeSelf: true } },
  "Frostcoat Mother": { "This ability costs [e1] less for each rune you control.": { kind: "folded" } },
  "Baccai Sandspinner": { "This ability costs [e3] less if you control 4 or fewer runes.": { kind: "folded" } },
  "Wild Claw": { "Then you may do this: Empower it.": noPoints("unknownCards") },
  "Kog'Maw, Caustic": { "[Deathknell] — Deal 4 to all units at my battlefield.": { kind: "ability", trigger: "die", effects: [{ op: "damage", n: 4, target: { who: "each", side: "any", where: "here", choose: false } }], text: "" } },
  // Our unattached Equipment onto one of our units, for free (detaching never helps our points).
  "Angle Shot": { "Choose a unit and an Equipment with the same controller.": { kind: "ability", trigger: "spell", effects: [{ op: "attachEquip" }], text: "" }, "Attach that Equipment to that unit or detach that Equipment from that unit.": { kind: "folded" } },
  "Lucian, Gunslinger": { "When I attack, deal damage equal to my [Assault] to an enemy unit here.": { kind: "ability", trigger: "attack", effects: [{ op: "damage", n: "myAssault", target: { who: "unit", side: "enemy", where: "here", choose: true } }], text: "" } },
  "Raving Witness": { "If it's [Mighty], draw it.": noPoints("unknownCards") },
  "Void Drone": { "I cost [e2] less to play from anywhere other than your hand.": noPoints("noPoints") },
  "Noxian Demolitionist": { "When I conquer, you may kill a gear with Energy cost no more than my M.": { kind: "ability", trigger: "conquer", effects: [{ op: "killGear", one: true, optional: true, maxE: "myMight" }], text: "" } },
  "Mechanical Bandit": { "If you revealed a card with the lowest Energy cost, draw it.": noPoints("unknownCards") },
  "Arcane Shift": { "Banish a friendly unit, then its owner plays it, ignoring its cost.": { kind: "ability", trigger: "spell", effects: [{ op: "redeploy", to: "its base", target: { who: "unit", side: "friendly", choose: true } }], text: "" } },
  "Iascylla": { "When I hold, at the start of your next Main Phase, you may move an enemy unit to this battlefield.": noPoints("later") },
  "Decree of Rage": { "This can't be countered.": { kind: "static", op: "uncounterableSelf" }, "Deal 4 to an enemy Calm unit.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: 4, target: { who: "unit", side: "enemy", domain: "Calm", choose: true } }], text: "" } },
  // Their choice either way, and neither half changes this turn: a draw, or runes that arrive exhausted.
  "Party Favors": { "Each other player chooses Cards or Runes.": noPoints("draw"), "For each player that chooses Cards, you and that player each draw 1.": noPoints("draw"), "For each player that chooses Runes, you and that player each channel 1 rune exhausted.": noPoints("later") },
  "Mistfall": { "When you buff a friendly unit, you may pay {Body} and exhaust this to ready it.": { kind: "static", op: "mistfall" } },
  "Darius, Executioner": { "Other friendly units have +1 M here.": { kind: "static", op: "aura", n: 1, here: true } },
  "Ravenborn Tome": { "{T}: The next spell you play this turn deals 1 Bonus Damage.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "spellBonusNext" }], text: "" } },
  "Mageseeker Warden": { "While I'm at a battlefield, opponents can only play units to their base.": { kind: "static", op: "wardenNoAmbush", cond: "While I'm at a battlefield" }, "While I'm at a battlefield, spells and abilities can't ready enemy units and gear.": noPoints("theirTurn") },
  "Void Hatchling": { "You may recycle it.": noPoints("unknownCards"), "Then reveal those cards.": noPoints("unknownCards") },
  "Rek'Sai, Swarm Queen": { "You may banish one, then play it.": noPoints("unknownCards"), "If it is a unit, you may play it here.": noPoints("unknownCards") },
  "Red Brambleback": { "Your conquer effects for conquering here trigger an additional time.": { kind: "static", op: "conquerTwiceHere" } },
  "Malzahar, Fanatic": { "Kill a friendly unit or gear, {T}: [Action] — [Add] {A}{A}.": { kind: "ability", trigger: "activated", cost: "kill a friendly unit or gear, {T}", speed: "action", effects: [{ op: "add", power: ["A", "A"], energy: 0 }], text: "" } },
  "Lillia, Protector of Dreams": { "Your token units have [Tank].": { kind: "static", op: "auraKeyword", keywords: ["Tank"], tokenOnly: true } },
  "Noxian Guillotine": {
    "Choose a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "kill", cond: "[Legion]", target: { who: "it", choose: false } }, { op: "dieOnDamage", cond: "not([Legion])", target: { who: "it", choose: false } }], text: "" },
    "Kill it the next time it takes damage this turn.": { kind: "folded" }, "[Legion] — Kill it now instead.": { kind: "folded" },
  },
  "Stare Down": {
    "Choose a friendly unit and a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "chooseBf" }, { op: "move", to: "base", target: { who: "each", side: "enemy", where: "here", lessThanRef: true, choose: false } }], text: "" },
    "Move all enemy units at that battlefield with less M than the chosen unit to their base.": { kind: "folded" },
  },
  // Recalls aren't moves, and it never needs to move to base for points.
  "Determined Sentry": { "I can't move to base.": noPoints("noPoints") },
  "Disposal Order": { "Choose up to 3 cards from opponents' trashes.": noPoints("unknownCards"), "Their owners recycle them.": noPoints("unknownCards") },
  "Crescent Guardian": { "If you've played a spell this turn, you may pay {Chaos} as an additional cost to play me.": { kind: "cost", optional: true }, "If you do, I enter ready.": { kind: "static", op: "enterReady", cond: "if you paid the additional cost" } },
  "Bottled Constellation": { "At the start of your Main Phase, you may kill 3 other friendly units and/or gear to score 1 point.": { kind: "static", op: "bottled" } },
  "Decree of Unity": { "Kill an enemy Chaos unit or gear.": { kind: "ability", trigger: "spell", effects: [{ op: "kill", target: { who: "unit", side: "enemy", domain: "Chaos", choose: true } }], text: "" } },
  "Temptation": { "Move an enemy unit to a location where there's a unit with the same controller.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "theirUnitLocation", target: { who: "unit", side: "enemy", where: "any", choose: true } }], text: "" } },
  "Tricksy Tentacles": { "Move any number of enemy units with the same controller and a total M of 8 or less to a single location.": { kind: "ability", trigger: "spell", effects: [{ op: "tentacles", total: 8 }], text: "" } },
  "Sky Cruiser": { "Discard a gear, [e1], {T}: Deal 4 to a unit at a battlefield.": { kind: "ability", trigger: "activated", cost: "discard a gear, [e1], {T}", speed: "main", effects: [{ op: "damage", n: 4, target: { who: "unit", where: "bf", choose: true } }], text: "" } },
  // Taken and recalled at once: ours, at base, and the battlefield isn't conquered (it's empty of theirs after the cleanup).
  "Possession": {
    "Choose an enemy unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "possess", target: { who: "unit", side: "enemy", where: "bf", choose: true } }], text: "" },
    "Take control of it and recall it.": { kind: "folded" },
  },
  "Endless Riches": { "When you play this, banish your hand and trash, then [Burn 7].": noPoints("unknownCards"), "Skip your Draw Phase.": noPoints("later") },
  "Sanction": { "Disempower a unit that's [Empowered].": { kind: "ability", trigger: "spell", effects: [{ op: "disempower", target: { who: "unit", side: "any", empoweredOnly: true, choose: true } }], text: "" }, "Empower it at end of turn.": noPoints("later") },
  "Decree of Insight": { "Ignore [Deflect] while paying this spell's cost.": { kind: "cost", optional: false }, "Give an enemy Body unit -5 M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: -5, until: "turn", ignoreDeflect: true, target: { who: "unit", side: "enemy", domain: "Body", choose: true } }], text: "" } },

  // ── 24 Nov, batch 12: the last one-offs ──
  "Peak Guardian": { "Then, if I am at a battlefield, buff all other friendly units there.": { kind: "ability", trigger: "spell", cond: "if i'm at a battlefield", effects: [{ op: "buff", target: { who: "each", side: "friendly", other: true, where: "here", choose: false } }], text: "" } },
  "Last Stand": { "Double a friendly unit's M this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: "itsOwnMight", until: "turn", target: { who: "unit", side: "friendly", choose: true } }], text: "" } },
  "Laurent Bladekeeper": { "Ganking": { kind: "static", op: "myKeywords", keywords: ["Ganking"] } },
  "Scorchclaw": { "[Level 3][>] I have +1 M and enter ready.": { kind: "static", op: "myMight", n: 1, cond: "[Level 3][>]", alsoEnterReady: true } },
  "Ancient Warmonger": { "I have [Assault] equal to the number of enemy units here.": { kind: "static", op: "assaultPerEnemyHere" } },
  "Gearhead": { "Each Equipment attached to me gives double its base M bonus.": { kind: "static", op: "gearhead" } },
  "Needlessly Large Yordle": { "I cost [e2]{Calm} less for each point you scored from holding this turn.": { kind: "static", op: "costLess", n: 2, pLess: 1, per: "point you scored from holding this turn" } },
  "Rell, Magnetic": { "When I attack, you may play an Equipment with Energy cost no more than [e2], ignoring its cost.": { kind: "ability", trigger: "attack", effects: [{ op: "equipFromHand", maxE: 2 }], text: "" } },
  "Kha'Zix, Evolving Hunter": { "When I attack, you may spend 3 XP to deal damage equal to my M to an enemy unit here.": { kind: "ability", trigger: "attack", effects: [{ op: "damage", n: "myMight", optional: true, payXp: 3, target: { who: "unit", side: "enemy", where: "here", choose: true } }], text: "" } },
  "Insightful Investigator": { "You may pay 2 XP to choose a card from their hand.": { kind: "ability", trigger: "spell", effects: [{ op: "theirDiscard", optional: true, payXp: 2 }], text: "" }, "If you do, they discard that card and draw 1.": { kind: "folded" } },
  "Decree of Strength": { "They recycle that card.": { kind: "ability", trigger: "spell", effects: [{ op: "theirDiscard", domain: "Mind" }], text: "" } },
  "Marching Orders": {
    "Choose a friendly unit anywhere and an enemy unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", where: "any", choose: true }, target2: { who: "unit", side: "enemy", where: "bf", choose: true } }, { op: "fight" }], text: "" },
    "They deal damage equal to their M to each other.": { kind: "folded" },
  },
  // The XP additional cost isn't paid by the play loop, so this reads the ≤ 3 M choice (the cautious one).
  "Conscription": {
    "Choose an enemy unit at a battlefield with 3 M or less.": { kind: "ability", trigger: "spell", effects: [{ op: "possess", target: { who: "unit", side: "enemy", where: "bf", max: 3, choose: true } }], text: "" },
    "If you paid the additional cost, choose any enemy unit at a battlefield instead.": { kind: "folded" },
    "Take control of it, exhaust it, and recall it.": { kind: "folded" },
  },
  // Each player keeps one: we choose ours (branched), they keep their strongest.
  "Cataclysmic Duel": { "Each player chooses a unit they control.": { kind: "ability", trigger: "spell", effects: [{ op: "duel" }], text: "" }, "Kill the rest.": { kind: "folded" } },
  // They choose one of their own units: their weakest.
  "King's Edict": { "Starting with the next player, each other player chooses a unit you don't control that hasn't been chosen for this spell.": { kind: "ability", trigger: "spell", effects: [{ op: "theirEdict" }], text: "" }, "Kill those units.": { kind: "folded" } },
  "Decree of Discord": { "Return any number of enemy Order units with total M 5 or less to their owners' hands.": { kind: "ability", trigger: "spell", effects: [{ op: "bounceTotal", total: 5, domain: "Order" }], text: "" } },
  "Imposing Challenger": { "When I move, you may move an enemy unit here with less M than me to a different battlefield.": { kind: "ability", trigger: "move", effects: [{ op: "move", to: "a different battlefield", optional: true, target: { who: "unit", side: "enemy", where: "here", lessThanMe: true, choose: true } }], text: "" } },
  "Maduli the Gatekeeper": {
    "I can't be readied.": { kind: "static", op: "noReady" },
    "{Chaos}: Move me to an occupied enemy battlefield if my M is greater than the total M of enemy units there.": { kind: "ability", trigger: "activated", cost: "{Chaos}", speed: "main", effects: [{ op: "move", to: "weaker enemy battlefield", target: me }], text: "" },
  },
  "Hungry Wolf": {
    "{Order}: Ready me and give me +1 M this turn.": { kind: "ability", trigger: "activated", cost: "{Order}", speed: "main", cond: "if you've chosen an enemy unit this turn", effects: [{ op: "ready", target: me }, { op: "might", n: 1, until: "turn", target: me }], text: "" },
    "Use only if you've chosen an enemy unit this turn and only once each turn.": { kind: "folded" },
  },
  "Kato the Arm": { "When I move to a battlefield, give another friendly unit my keywords and +M equal to my M this turn.": { kind: "ability", trigger: "move", effects: [{ op: "kato", target: { who: "unit", side: "friendly", other: true, choose: true } }], text: "" } },
  "Overt Operation": { "For each friendly unit, you may spend its buff to ready it.": { kind: "ability", trigger: "spell", effects: [{ op: "overt" }], text: "" } },
  "Ancient Henge": { "{T}: [Reaction] — Pay any amount of Energy to [Add] that much {A}.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", effects: [{ op: "energyToPower" }], text: "" } },
  // No effect this turn, with the reason.
  "Blind Fury": { "Choose one and banish it, then play it, ignoring its cost.": noPoints("unknownCards") },
  "Reinforce": { "You may banish a unit from among them, then play it, reducing its cost by [e5].": noPoints("unknownCards"), "Recycle the remaining cards.": noPoints("unknownCards") },
  "The Zero Drive": { "[e3]{Mind}, Banish this: Play all units banished with this, ignoring their costs.": noPoints("unknownCards") },
  "Twisted Fate, Gambler": { "Do one of the following based on its domain:": noPoints("unknownCards"), "{Fury} — Deal 2 to an enemy unit here and 1 to all other enemy units here.{Mind} — Draw 1.{Order} — Stun an enemy unit.": noPoints("unknownCards") },
  "Forgotten Relic": { "When you burn a unit this way, do this: Give a friendly unit +M equal to the burned card's M this turn.": noPoints("unknownCards") },
  "Cursed Sarcophagus": { "{T}: Play a unit banished with this.": noPoints("unknownCards") },
  "Titanic Shrine": { "When you play a unit with M greater than each other unit on the board, exhaust me to draw 1.": noPoints("draw") },
  // It follows a draw (the drawn cards are unknown to the solver).
  "Zero Point Inflection": { "When you draw 1 or more cards with 9 or more other cards in your hand, discard your hand, kill this, and choose an opponent.": noPoints("draw"), "They score 1 point.": noPoints("draw") },
  // Each player discards (their pick) or draws.
  // Discarding is our choice from hand, so the discard mode can feed Jinx, Rebel or Mask Mother; their discard and the draws change nothing now.
  "Minah Swiftfoot": { "Each player discards 1.": { kind: "ability", trigger: "spell", effects: [{ op: "discard" }], text: "" }, "Each player draws 1.": noPoints("draw") },
  "Sandstone Chimera": { "While I'm at a battlefield, players only channel 1 rune at the start of their Channel Phase.": noPoints("later") },
  "Albus Ferros": { "When you play me, spend any number of buffs.": noPoints("later"), "For each buff spent, channel 1 rune exhausted.": noPoints("later") },
  "Loyal Pup": { "When you defend at a battlefield, you may move me there.": noPoints("theirTurn") },
  "Perched Grimwyrm": { "Play me only to a battlefield you conquered this turn.": noPoints("noPoints") },
  "Walking Roost": { "They play a 1 M Bird unit token with [Deflect].": noPoints("noPoints") },

  // ── 24 Nov, feature 1: spells inside fights (lib/fight.mjs reads these from the card text; see its header) ──
  "Vex, Cheerless": { "While I'm in combat, friendly spells cost [e1]{A} less to a minimum of [e1], and enemy spells cost [e1]{A} more.": { kind: "static", op: "vexCheerless" } },
  // Answers to a spell on the chain: played only in lib/fight.mjs's response window (a no-op in the main phase).
  "Rebuttal": {
    "Choose a spell with Energy cost no more than [e4].": { kind: "ability", trigger: "spell", effects: [{ op: "counter", maxE: 4 }], text: "" },
    "You may pay {A}.": { kind: "folded" }, "If you do, gain control of it and you may make new choices for it.": { kind: "folded" },
    "Otherwise, counter it.": { kind: "folded" },   // lib/fight.mjs plays the takeover and its "otherwise, counter it" as one move
  },
  "Mystic Reversal": { "Gain control of a spell.": { kind: "ability", trigger: "spell", effects: [{ op: "counter" }], text: "" }, "You may make new choices for it.": { kind: "folded" } },
  "Unyielding Spirit": { "Prevent all spell and ability damage this turn.": { kind: "ability", trigger: "spell", effects: [{ op: "noSpellDamage" }], text: "" } },
  "Alpha Wildclaw": { "Your units here with less M than me can't be chosen by enemy spells and abilities.": { kind: "static", op: "wildclaw" } },
  "Lilting Lullaby": { "Its controller can't play spells this turn.": { kind: "folded" } },
  "Fallen Feline": {
    "When you play me, name a spell.": { kind: "ability", trigger: "play", effects: [{ op: "nameSpell" }], text: "" },
    "While I'm at a battlefield, opponents can't play spells with that name.": { kind: "static", op: "feline", cond: "While I'm at a battlefield" },
  },
  "Esteemed Hierophant": { "While you control 7 or more runes, prevent all damage that enemy spells and abilities would deal to me.": { kind: "static", op: "hierophant" } },
  "Gangplank, Naval": { "[Empowered][>] If a spell or ability that chooses me would stun me, give me -M, or return me to hand, give me +3 M this turn instead.": { kind: "static", op: "gangplank", cond: "[Empowered][>]" } },
  "Syndra, Transcendent": { "While I'm in a showdown, your spells have [Repeat] [e2]{Chaos}.": { kind: "static", op: "syndra" } },
  // Its +4 needs an enemy Fury unit in the combat: played only in lib/fight.mjs (a no-op in the main phase).
  "Decree of Focus": {
    "Choose a friendly unit that's in combat with an enemy Fury unit or that's being chosen by an enemy Fury spell.": { kind: "ability", trigger: "spell", effects: [{ op: "noop", why: "fightOnly" }], text: "" },
    "Give it +4 M this turn.": { kind: "folded" },
  },
  "Irelia, Graceful": { "Your spells that choose me cost [e1] or {A} less.": { kind: "static", op: "ireliaGraceful" } },

  // ── 24 Nov, feature 2: combat internals (lib/fight.mjs reads these from the card text) ──
  // Backline's own wording (§826.3, §467.2.c.6).
  "Soraka, Wanderer": {
    "I must be assigned combat damage last.": { kind: "static", op: "backlineText" },
    // Recalled instead of dying, as Zhonya's Hourglass: the battlefield's result is the same this turn.
    "If another unit you control here would die, if it has less M than me, instead heal it, exhaust it, and recall it.": noPoints("noPoints"),
  },
  "Kayn, Unleashed": { "If I have moved twice this turn, I don't take damage.": { kind: "static", op: "kaynNoDamage" } },
  "Dune Surfer": { "You ignore [Tank] while assigning combat damage here.": { kind: "static", op: "ignoreTank" } },
  // Excess: assigned past lethal once no enemy unit there is left to take it (§467.2.c.4). Read in lib/turn.mjs resolveAt.
  "Sivir, Ambitious": { "When I conquer after an attack, if you assigned 5 or more excess damage to enemy units, you may deal that much to an enemy unit.": { kind: "static", op: "excessStrike" } },
  "Ava Achiever": {
    "When I attack, you may pay {Mind} to play a card with [Hidden] from your hand, ignoring its cost.": { kind: "static", op: "ava" },
    "If it's a unit, play it here.": { kind: "folded" },
  },
  "Stalking Wolf": { "You may [Ambush] me to its battlefield, even if you don't have other units there.": { kind: "static", op: "stalkingWolf" } },

  // ── 24 Nov, feature 3: legends on the board (lib/turn.mjs s.legend; `rift close --legend`) ──
  "Heartening Soul": {
    "When you play me, ready a friendly legend.": { kind: "ability", trigger: "play", effects: [{ op: "readyLegend" }], text: "" },
    "Friendly legends have \"{T}: Give a unit +3 M this turn.\"": { kind: "static", op: "legendPump" },
  },
  // Exhausting their legend changes nothing on our turn (and it isn't on the solver's board): read as ready ours.
  "Royal Entourage": { "When you play me, ready or exhaust a legend.": { kind: "ability", trigger: "play", effects: [{ op: "readyLegend" }], text: "" } },
  "Bard, Mercurial": { "When you play me, if you paid the additional cost, move any number of your units to an open battlefield.": { kind: "ability", trigger: "play", cond: "if you paid the additional cost", effects: [{ op: "move", to: "an open battlefield", target: { who: "upTo", n: 9, side: "friendly", where: "any", choose: true } }], text: "" } },
  "Profiteer": { "When you play me, you may disempower something you control to empower a legend, unit, or gear.": { kind: "ability", trigger: "play", effects: [{ op: "profiteer", optional: true }], text: "" } },

  // ── 24 Nov, feature 4: gear Empowered status (lib/turn.mjs gearMeta.empowered) ──
  // "Your units have +1 M. If I'm [Empowered], they have +2 M instead": one more while it's Empowered.
  "Rage Amplifier": { "If I'm [Empowered], they have +2 M instead.": { kind: "static", op: "aura", n: 1, includeSelf: true, cond: "If I'm [Empowered]" } },
  // Read by lib/turn.mjs helmTax: [e1]{A} while it's Empowered.
  "Helm of Suppression": {
    "Opponents' spells cost [e1] more.": { kind: "static", op: "helm" },
    "If this is [Empowered], they cost [e1]{A} more instead.": { kind: "folded" },
  },
  "Hextech Disc": { "Disempower this, [e1], {T}: Play a 3 M Mech unit token to your base.": { kind: "ability", trigger: "activated", cost: "disempower this, [e1], {T}", speed: "main", effects: [{ op: "token", count: 1, ready: false, might: 3, name: "Mech", keywords: [], to: "your base" }], text: "" } },
  // Giving it away is how you dodge its end-of-turn damage; both happen after this turn's scoring.
  "Glowstone": {
    "Disempower this, {T}: Choose a player.": noPoints("later"), "They gain control of this and recall it.": noPoints("later"),
    "At the end of your turn, kill this and deal 5 to all units you control.": noPoints("later"),
  },

  // ── 24 Nov, feature 5: the opponent's own choices (lib/turn.mjs theirPick: the option worst for us) ──
  "Angler Wyrm": { "They must move a unit they control to my battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "theirMove", to: "my battlefield" }], text: "" } },
  "Call to Battle": {
    "Move a unit you control to a battlefield you control.": { kind: "ability", trigger: "spell", effects: [{ op: "move", to: "a battlefield you control", target: { who: "unit", side: "friendly", where: "any", choose: true } }, { op: "theirMove", to: "refLocation" }], text: "" },
    "They move a unit they control to the same battlefield.": { kind: "folded" },
  },
  "Whirlwind": { "Starting with the next player, each player may return a unit to its owner's hand.": { kind: "ability", trigger: "spell", effects: [{ op: "whirlwind" }], text: "" } },
  "Divine Judgment": { "Each player chooses 2 units, 2 gear, 2 runes, and 2 cards in their hands.": { kind: "ability", trigger: "spell", effects: [{ op: "judgment" }], text: "" } },
  "Invert Timelines": { "Each player discards their hand, then draws 4.": { kind: "ability", trigger: "spell", effects: [{ op: "invert" }], text: "" } },

  // ── 24 Nov, feature 6: unusual costs (lib/turn.mjs: additional costs as options; equipCost; [Weaponmaster]) ──
  // What paying the additional cost buys is read from the card's text in the play loop.
  "Kraken Hunter": { "Reduce my cost by {Body} for each buff you spend.": { kind: "folded" } },
  "Wallop": { "If you do, ignore this spell's cost.": { kind: "folded" } },
  "Brazen Buccaneer": { "If you do, reduce my cost by [e2].": { kind: "folded" } },
  "Spirit of the Forge": { "When you play me, if you paid the additional cost, ready me and give me +M this turn equal to the Energy cost of the gear you returned.": { kind: "ability", trigger: "play", cond: "if you paid the additional cost", effects: [{ op: "ready", target: me }, { op: "might", n: "returnedGearE", until: "turn", target: me }], text: "" } },
  "Commander Ledros": { "Reduce my cost by {Order} for each killed this way.": { kind: "folded" } },
  "Square Up": { "[Repeat] — Discard 1": { kind: "keywords" } },
  "Chronobreak": { "Banish that many units you control, then for each, its owner plays that unit back to the same location or to their base, ignoring its cost.": { kind: "ability", trigger: "spell", effects: [{ op: "chronobreak" }], text: "" } },
  "Temporal Portal": { "{A}, {T}: Give the next spell you play this turn [Repeat] equal to its cost.": { kind: "ability", trigger: "activated", cost: "{A}, {T}", speed: "main", effects: [{ op: "portalRepeat" }], text: "" } },
  "Hextech Gauntlets": { "This ability's Energy cost is reduced by the M of the unit you choose.": { kind: "folded" } },

  // ── 24 Nov, feature 7: copies and one-of-a-kind effects ──
  // Effect text is appended to the equipped unit (§136.2.c): with Svellsongur the unit has its text twice (lib/turn.mjs attachStates).
  "Svellsongur": { "As this is attached to a unit, copy that unit's text to this Equipment's effect text for as long as this is attached to it.": { kind: "static", op: "svellsongur" } },
  // A copy takes printed traits (§479.1): the equipped unit becomes a copy of another friendly unit (branched on attach).
  "Shady Spectacles": { "As this is attached to a unit, choose another friendly unit.": { kind: "static", op: "spectacles" }, "The equipped unit becomes a copy of that unit for as long as this is attached to it.": { kind: "folded" } },
  "Heimerdinger, Inventor": { "I have all {T} abilities of all friendly legends, units, and gear.": { kind: "static", op: "heimer" } },
  "Curtain Call": {
    "[Repeat] — [e1] / {A} / [e1]{A}": { kind: "keywords" },
    "Choose one you haven't already chosen —": { kind: "ability", trigger: "spell", modal: true, pick: 1, modes: [], effects: [], repeatCosts: [{ e: 1, p: 0 }, { e: 0, p: 1 }, { e: 1, p: 1 }], text: "" },
  },
  "Alpha Strike": {
    "Choose a friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "choose", target: { who: "unit", side: "friendly", choose: true } }, { op: "splitKill" }], text: "" },
    "It deals damage equal to its M split among enemy units at battlefields.": { kind: "folded" }, "Then for each unit this kills, do this: Gain 1 XP.": { kind: "folded" },
  },
  "Dominus": { "This turn, double a unit's M and give it \"{A}{A}: Ready me.\"": { kind: "ability", trigger: "spell", effects: [{ op: "might", n: "itsOwnMight", until: "turn", target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "grantReady", target: { who: "it", choose: false } }], text: "" } },
  "Dancing Grenade": {
    "Deal 2 to a unit.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: 2, target: { who: "unit", side: "any", where: "any", choose: true } }, { op: "grenade" }], text: "" },
    "Its controller may play this spell again for {A}.": { kind: "folded" }, "If they do, this deals 1 additional Bonus Damage for each time this spell has dealt damage this turn.": { kind: "folded" },
  },
  "Relentless Pursuit": {
    "Move a friendly unit.": { kind: "ability", trigger: "spell", effects: [{ op: "move", target: { who: "unit", side: "friendly", where: "any", choose: true } }, { op: "attachToRef" }], text: "" },
    "You may attach up to one Equipment with the same controller to it.": { kind: "folded" },
    // The unit is exhausted at base afterwards and the conquest already scored.
    "This turn, that unit has \"When I conquer, you may move me to my base.\"": noPoints("noPoints"),
  },
  "Transpositionist": { "You may play a unit with less M than that unit had, ignoring its cost.": { kind: "ability", trigger: "spell", effects: [{ op: "playLesser" }], text: "" } },
  "Shard of Undoing": { "The first time a friendly unit dies during your Beginning Phase each turn, each opponent must kill one of their units.": { kind: "static", op: "shard" } },
  "Stealthy Pursuer": { "When a friendly unit moves from my location, I may be moved with it.": { kind: "static", op: "pursuer" } },
  // ── 24 Nov, polish: the last cards the solver didn't fully play ──
  // "At the start of your Beginning Phase": run by solveTurn before holds (pos.their.runes; unknown is not met).
  "Oasis Raider": { "If you control fewer runes than an opponent at the start of your Beginning Phase, give me +2 M and [Ganking] this turn.": { kind: "ability", trigger: "beginRunes", cond: "If you control fewer runes than an opponent at the start of your Beginning Phase", effects: [{ op: "might", n: 2, until: "turn", keyword: "Ganking", kn: 1, target: me }], text: "" } },
  "Forsaken Baccai": { "If you control fewer runes than an opponent at the start of your Beginning Phase, give me +1 M this turn.": { kind: "ability", trigger: "beginRunes", cond: "If you control fewer runes than an opponent at the start of your Beginning Phase", effects: [{ op: "might", n: 1, until: "turn", target: me }], text: "" } },
  // In a fight she's in, our spells can be played like Reactions (lib/turn.mjs resolveAt: our fight hand takes main-speed spells).
  "Kai'Sa, Rebel": { "While I'm in a showdown, your spells have [Reaction].": { kind: "static", op: "kaisa" } },
  // A replacement on the damaged unit: if it dies this turn it's banished (no Deathknell).
  "Smite": {
    "Deal 3 to a unit at a battlefield.": { kind: "ability", trigger: "spell", effects: [{ op: "damage", n: 3, banishOnDie: true, target: { who: "unit", side: "any", where: "bf", choose: true, kind: "unit" } }], text: "" },
    "If it would die this turn, banish it instead.": { kind: "folded" },
  },
  // Hwei draws an unknown card, then discards one we choose: a known card from hand gives its type's effect (unit: +3 M;
  // gear: ready up to 2 runes; spell: a draw). Discarding the drawn card itself gives nothing we can count.
  "Hwei, Brooding Painter": {
    "When I move, draw 1, then discard 1.": { kind: "ability", trigger: "move", effects: [{ op: "hwei" }], text: "" },
    "Then, do the following based on the discarded card's type:": { kind: "folded" }, "Spell — Draw 1.": noPoints("draw"),
    "Gear — Ready up to 2 runes.": { kind: "folded" }, "Unit — Give me +3 M this turn.": { kind: "folded" },
  },
  "Daisy!": { "Reduce my cost by [e1] for each of the following tags among your units — Bird, Cat, Dog, and Poro.": { kind: "static", op: "costLess", n: 1, per: "tags among your units" }, "When I attack while your units have all 4 tags, [Stun] an enemy unit here.": { kind: "ability", trigger: "attack", cond: "if your units have all of the following tags", effects: [{ op: "stun", target: { who: "unit", side: "enemy", where: "here", choose: true } }], text: "" } },
  // lib/turn.mjs token op: each unit token we play may be a 3 M Mech instead (both are branches).
  "Heimerdinger, Academy Instructor": { "If you would play a unit token to a location while I'm at a battlefield, you may play a 3 M Mech unit token to that same location instead.": { kind: "static", op: "heimerMech" } },
  // The additional cost is an option per friendly unit in the play loop (lib/turn.mjs): its Energy and Power come off.
  "Atakhan": { "When I attack, the defender must kill one of their units here.": { kind: "ability", trigger: "attack", effects: [{ op: "edictThere" }], text: "" }, "If you do, I cost [e1] less for each Energy it costs and {Order} less for each Power it costs.": { kind: "cost", text: "" } },
  // Enemy gear on the board is Equipment on their units: take one and attach it to Akshan.
  "Akshan, Mischievous": {
    "When you play me, if you paid the additional cost, move an enemy gear to your base.": { kind: "ability", trigger: "play", cond: "if you paid the additional cost", effects: [{ op: "akshan" }], text: "" },
    "You control it until I leave the board.": noPoints("noPoints"), "If it's an Equipment, attach it to me.": { kind: "folded" },
  },
  // The named tag: chosen as it's played (one branch per tag on the board), or pos.listTag for one already out.
  "The List": { "As you play this, name a tag.": { kind: "static", op: "listTag" }, "{T}: Give a unit with the named tag -2 M this turn.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "might", n: -2, until: "turn", target: { who: "unit", side: "any", where: "any", choose: true, listTag: true } }], text: "" } },
  // From the trash (pos.trash; unknown: nothing to play). [e2] less with a pet among the choices, which then must be the pet.
  // "From your trash" was filed as unknown cards until 25 Nov, but the turn solver tracks our trash (fromTrash).
  "Gust Monk": { "When you play me, if you paid the additional cost, banish a card from any trash to give a unit [Assault 2] this turn.": { kind: "ability", trigger: "play", cond: "if you paid the additional cost", effects: [{ op: "keyword", keyword: "Assault", n: 2, until: "turn", banishTrash: 1, target: { side: "friendly", where: "any", choose: true, who: "unit", kind: "unit" } }], text: "" } },
  "Spectral Matron": { "When you play me, you may play a unit costing no more than [e3] and no more than {A} from your trash, ignoring its cost.": { kind: "ability", trigger: "play", effects: [{ op: "fromTrash", maxE: 3, maxP: 1, optional: true }], text: "" } },
  "Glasc Mixologist": { "[Deathknell] — You may play a unit with cost no more than [e3] and no more than {A} from your trash, ignoring its cost.": { kind: "ability", trigger: "die", effects: [{ op: "fromTrash", maxE: 3, maxP: 1, optional: true }], text: "" } },
  "Undying Loyalty": {
    "This costs [e2] less if you choose a Bird, Cat, Dog, or Poro.": { kind: "static", op: "costLess", n: 2, cond: "if you can choose a pet from your trash" },
    "Play a unit with cost no more than [e2] and no more than {A} from your trash, ignoring its cost.": { kind: "ability", trigger: "spell", effects: [{ op: "fromTrash", maxE: 2, maxP: 1, petFirst: true }], text: "" },
  },
  // The revised text (docs/rules-faq.md): cards recycled to the Main Deck, which on our turn follow looks and predicts (filed as draws).
  "Karma, Channeler": { "When you recycle one or more cards to your Main Deck, buff a friendly unit.": noPoints("draw") },
  // A tie recalls every unit instead of killing them: the battlefield is uncontrolled either way, so no point changes; only
  // Deathknells that would have run are skipped.
  "Symbol of the Solari": { "If a combat where you are the attacker ends in a tie, recall ALL units instead.": noPoints("noPoints") },

  // ── 24 Nov, legends: read on the board (lib/turn.mjs fireLegend, legend statics, "me" = the legend) ──
  // Trigger names are the legend's own (fireLegend calls them), so a unit with the same words isn't read by accident.
  "The Exile": { "Units you play to battlefields you control enter ready.": { kind: "static", op: "exileReady" } },
  "Daughter of the Void": { "{T}: [Reaction] — [Add] {A}.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", effects: [{ op: "add", power: ["A"], energy: 0, spellsOnly: true }], text: "" }, "Use only to play spells.": { kind: "folded" } },
  "Agony's Embrace": { "Then, if it's not your turn, discard 1.": noPoints("theirTurn") },
  "Heart of the Tempest": {
    "When you play a card from anywhere other than your hand, empower me.": { kind: "ability", trigger: "youPlayNotFromHand", effects: [{ op: "empower", target: me }], text: "" },
    "[Action][>] Disempower me, {T}: Give a unit [Assault 2] this turn.": { kind: "ability", trigger: "activated", cost: "Disempower me, {T}", speed: "action", effects: [{ op: "keyword", keyword: "Assault", n: 2, until: "turn", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
  },
  "Gloomist": { "When you or an ally hold, you may exhaust me to draw 1.": noPoints("draw") },
  // Defending happens on our turn only when they attack us there (Irresistible Faefolk's pull makes them the attacker).
  "Wuju Bladesman - Starter": { "While a friendly unit defends alone, it gets +2 M.": { kind: "static", op: "defendAlone", n: 2 } },
  "Iron Revenant": { "[Reaction][>] Banish a unit or gear from your trash, {T}: [Add] {A}.": { kind: "ability", trigger: "activated", cost: "Banish a unit or gear from your trash, {T}", speed: "reaction", effects: [{ op: "add", power: ["A"], energy: 0, notSpells: true }], text: "" }, "Spend this Power only to play units or gear.": { kind: "folded" } },
  // An action at the start of our Main Phase (lib/turn.mjs actions, before anything else is done).
  "Lady of Clockwork": { "At the start of your Main Phase, you may pay [e1] to choose a friendly gear.": { kind: "static", op: "clockwork" }, "It becomes a unit gear with M equal to its Energy cost until you choose another gear with me.": { kind: "folded" } },
  "Void Burrower": { "You may play one.": noPoints("unknownCards"), "You may banish one, then play it.": noPoints("unknownCards") },   // two printings
  "Starry-Eyed Songstress": { "As an additional cost to play a spell, you may exhaust me and three friendly units to reduce the cost of that spell by [e2].": { kind: "static", op: "songstress" } },
  "Emperor of the Sands": {
    "Your Sand Soldiers have [Weaponmaster].": { kind: "static", op: "sandWeaponmaster" }, "Sand Soldiers you play have [Weaponmaster].": { kind: "static", op: "sandWeaponmaster" },
    "[e1], {T}: Play a 2 M Sand Soldier unit token to your base.": { kind: "ability", trigger: "activated", cost: "[e1], {T}", speed: "main", cond: "if you've played an equipment this turn", effects: [{ op: "token", count: 1, ready: false, might: 2, name: "Sand Soldier", keywords: [], to: "your base" }], text: "" },
    "Use only if you've played an Equipment this turn.": { kind: "folded" },
  },
  "Blade Dancer": {
    "When you choose a friendly unit, you may exhaust me and pay {A} to ready it.": { kind: "ability", trigger: "youChooseFriendly", exhaustMe: true, effects: [{ op: "ready", pay: "{A}", target: { who: "it", choose: false } }], text: "" },
    "When you conquer, you may pay [e1] to ready me.": { kind: "ability", trigger: "legendConquer", effects: [{ op: "ready", pay: "[e1]", optional: true, target: me }], text: "" },
  },
  // In a fight we're losing (lib/turn.mjs resolveAt): our strongest attacker goes to base before damage, ready if she's Empowered.
  "Rogue Assassin": { "[Action][>] {T}: If it's your turn, move a friendly unit in a showdown to base and if I'm [Empowered], ready it.": { kind: "static", op: "akaliRescue" } },
  "Bashful Bloom": { "This ability costs [e1] less for each friendly unit with [Temporary].": { kind: "cost", text: "" } },
  "Deceiver": {
    "When you conquer or hold, you may discard 1 and exhaust me to play a ready Reflection unit token there.": { kind: "ability", trigger: "youConquerOrHold", exhaustMe: true, needsDiscard: true, effects: [{ op: "discard" }, { op: "choose", target: { who: "unit", side: "any", where: "here", choose: true } }, { op: "token", count: 1, ready: true, might: 0, name: "Reflection", copyRef: true, keywords: ["Temporary"], to: "here" }], text: "" },
    "It becomes a copy of another unit there.": { kind: "folded" }, "Then do this: It becomes a copy of another unit there.": { kind: "folded" }, "Give it [Temporary].": { kind: "folded" },
  },
  // "Kill me at end of turn": after this turn's scoring.
  "Boy Who Shattered Time": { "Disempower me, {T}: Reduce the cost of the next unit you play this turn by [e2]{A} and give it \"Kill me at end of turn.\"": { kind: "ability", trigger: "activated", cost: "Disempower me, {T}", speed: "main", effects: [{ op: "discountNext", cost: "[e2]{A}", unitsOnly: true }], text: "" } },
  // Its [e1] only pays inside a showdown (lib/turn.mjs budgetOf / resolveAt: our fight budget while the legend is ready).
  "Scorn of the Moon": { "[Reaction][>] {T}: [Add] [e1].": { kind: "static", op: "showdownEnergy" }, "Spend this Energy only during showdowns.": { kind: "folded" } },
  "Defender of Tomorrow": {
    "[e1], {T}: Ready a gear.": { kind: "ability", trigger: "activated", cost: "[e1], {T}", speed: "main", effects: [{ op: "readyGear", n: 1 }], text: "" },
    "[Empowered][>] [e1], {T}: Ready 2 gear.": { kind: "ability", trigger: "activated", cost: "[e1], {T}", speed: "main", cond: "[Empowered]", effects: [{ op: "readyGear", n: 2 }], text: "" },
  },
  "Pride of Nazumah": { "[e1], {T}: Give a friendly unit \"I have [Assault] equal to my [Shield]\" this turn.": { kind: "ability", trigger: "activated", cost: "[e1], {T}", speed: "main", effects: [{ op: "keyword", keyword: "Assault", n: "itsShield", until: "turn", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" } },
  "Fire Below the Mountain": { "{T}: [Reaction] — [Add] {A}.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", effects: [{ op: "add", power: ["A"], energy: 0, gearOnly: true }], text: "" }, "Use only to play gear or use gear abilities.": { kind: "folded" } },
  // Runes channelled exhausted pay nothing this turn (§415.4 in premise 5 of the first list).
  "Relentless Storm": { "When you play a [Mighty] unit, you may exhaust me to channel 1 rune exhausted.": noPoints("later") },
  "Exemplar of Demacia": { "When you play a gear with [Deploy], you may exhaust me and pay {A} to move a friendly unit to that battlefield.": { kind: "ability", trigger: "youPlayDeployGear", exhaustMe: true, effects: [{ op: "move", pay: "{A}", to: "that battlefield", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" } },
  "Grand Duelist": { "When one of your units becomes [Mighty], you may exhaust me to channel 1 rune exhausted.": noPoints("later") },
  "Master of Shadows": {
    "When you banish a card you own, empower me.": { kind: "ability", trigger: "youBanishOwn", effects: [{ op: "empower", target: me }], text: "" },
    "[Action][>] Disempower me, {T}: Discard 1, then draw 1.": { kind: "ability", trigger: "activated", cost: "Disempower me, {T}", speed: "action", effects: [{ op: "discard" }, { op: "noTurn", why: "draw" }], text: "" },
  },
  // Units and gear (abilities with an Energy cost of 7+ are rare enough to leave).
  "Curator of the Sands": { "When you play a unit, gear, or activated ability with Energy cost [e7] or more, you may exhaust me to ready up to 2 runes.": { kind: "ability", trigger: "youPlayCost7", exhaustMe: true, effects: [{ op: "readyRunes", n: 2 }], text: "" } },
  "Swift Scout": {
    "You may pay [e1] to hide a card with [Hidden] instead of {A}.": { kind: "static", op: "hideForEnergy" },
    // A Teemo back to hand is played again at full price; the solver already plays it from hand.
    "[e1], {T}: Put a Teemo unit you own into your hand from your Champion Zone or the board.": noPoints("noPoints"),
  },
  "Voidreaver": {
    "When you win a combat, gain 1 XP.": { kind: "ability", trigger: "youWinCombat", effects: [{ op: "xp", n: 1 }], text: "" },
    // Our own exhausted unit home: nothing scores from it.
    "Spend 2 XP, {T}: Move an exhausted friendly unit from a battlefield to its base.": noPoints("noPoints"),
  },
  // The battlefield is replaced after this turn's conquest or hold has scored.
  "Green Father": { "When you conquer or hold, you may exhaust me to replace that battlefield with a Brush battlefield token.": noPoints("later") },
  "Nine-Tailed Fox": { "When an enemy unit attacks a battlefield you control, give it -1 M this turn, to a minimum of 1 M.": noPoints("theirTurn") },
  "Prodigal Explorer": { "Use only if you've chosen enemy units and/or gear twice this turn with spells or unit abilities.": noPoints("draw") },
  "Radiant Dawn": { "When you stun one or more enemy units, buff a friendly unit.": { kind: "ability", trigger: "youStun", effects: [{ op: "buff", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" } },
  "Wuju Master": { "[Level 11][>] Your units enter ready.": { kind: "static", op: "othersEnterReady", cond: "[Level 11]" } },
  "Butcher of the Sands": { "[Reaction][>] {A}{A}, {T}: [Add] [e2].": { kind: "ability", trigger: "activated", cost: "{A}{A}, {T}", speed: "reaction", effects: [{ op: "add", power: [], energy: 2, unitsOnly: true }], text: "" }, "Spend this Energy only to play units or activated abilities of units.": { kind: "folded" } },
  // Four spells banished with Jhin is history the position doesn't carry; the payoff is runes and a draw.
  "Virtuoso": { "Then, if there are four spells banished with me, put each in its trash, channel 4 runes, and draw 1.": noPoints("later") },
  "Loose Cannon": { "At start of your Beginning Phase, draw 1 if you have one or fewer cards in your hand.": noPoints("draw") },
  "Piltover Enforcer": { "When you conquer, if you assigned 3 or more excess damage, you may exhaust me to ready a unit.": { kind: "ability", trigger: "legendConquer", cond: "if you assigned 3 or more excess damage", exhaustMe: true, effects: [{ op: "ready", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" } },
  "Unforgiven": {   // two printings word it "its base" and "your base"
    "[e2], {T}: Move a friendly unit to or from its base.": { kind: "ability", trigger: "activated", cost: "[e2], {T}", speed: "main", effects: [{ op: "move", to: "to or from its base", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
    "[e2], {T}: Move a friendly unit to or from your base.": { kind: "ability", trigger: "activated", cost: "[e2], {T}", speed: "main", effects: [{ op: "move", to: "to or from your base", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
  },
  "Purifier": { "Your Equipment each give [Assault].": { kind: "static", op: "equipAssault" } },
  "Soul's Reflection": {
    "When you empower something else, empower me.": { kind: "ability", trigger: "youEmpowerOther", effects: [{ op: "empower", target: me }], text: "" },
    "Disempower me, {T}: Give a unit at a battlefield -2 M this turn.": { kind: "ability", trigger: "activated", cost: "Disempower me, {T}", speed: "main", effects: [{ op: "might", n: -2, until: "turn", target: { who: "unit", side: "any", where: "bf", choose: true } }], text: "" },
  },
  "Matriarch of War": {
    "When you empower something else, empower me.": { kind: "ability", trigger: "youEmpowerOther", effects: [{ op: "empower", target: me }], text: "" },
    "Disempower me, {A}, {T}: Ready a unit.": { kind: "ability", trigger: "activated", cost: "Disempower me, {A}, {T}", speed: "main", effects: [{ op: "ready", target: { who: "unit", side: "friendly", where: "any", choose: true } }], text: "" },
  },
  "Dark Child - Starter": { "At the end of your turn, ready 2 runes.": noPoints("later"), "At the end of your turn, ready up to 2 runes.": noPoints("later") },   // the errata's wording
  "Chem-Baroness": {
    "When you or an ally hold, you may exhaust me to play a Gold gear token exhausted.": noPoints("later"),
    "While your score is within 3 points of the Victory Score, your Gold [Add] an additional [e1].": { kind: "static", op: "renataGold" },
    "While your score is within 3 points of the Victory Score, your Gold [ADD] an additional [e1].": { kind: "static", op: "renataGold" },
  },
  "Grandmaster at Arms": {
    "[e1], {T}: Attach a detached Equipment you control to a unit you control.": { kind: "ability", trigger: "activated", cost: "[e1], {T}", speed: "main", effects: [{ op: "attachEquip" }], text: "" },
    "{T}: Attach an attached Equipment you control to a unit you control.": { kind: "ability", trigger: "activated", cost: "{T}", speed: "main", effects: [{ op: "moveEquip" }], text: "" },
  },
  "Battle Mistress": {
    "When you recycle a rune, you may exhaust me to play a Gold gear token exhausted.": noPoints("later"),
    "When one or more enemy units die, ready me.": { kind: "ability", trigger: "legendEnemyDies", effects: [{ op: "ready", target: me }], text: "" },
  },
  "Hand of Noxus": { "{T}: [Reaction], [Legion] — [Add] [e1].": { kind: "ability", trigger: "activated", cost: "{T}", speed: "reaction", cond: "[Legion]", effects: [{ op: "add", power: [], energy: 1 }], text: "" } },
  // The save recalls the unit: no points change (as Zhonya's Hourglass). Conquering readies her.
  "The Boss": { "When a buffed unit you control would die, you may pay {A} and exhaust me to spend its buff and recall it exhausted instead.": noPoints("noPoints"),
    "If a buffed unit you control would die, you may pay {A}, exhaust me, and spend its buff to heal it, exhaust it, and recall it instead.": noPoints("noPoints"),   /* the errata's wording */ "When you conquer, ready me.": { kind: "ability", trigger: "legendConquer", effects: [{ op: "ready", target: me }], text: "" } },
};
