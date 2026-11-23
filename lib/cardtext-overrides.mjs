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
  "Forecaster": { "Your Mechs have [Vision].": noPoints("draw") },
  "Frigid Jewel": { "When you draw your second card each turn, give a friendly unit +2 M this turn.": noPoints("draw") },
};
