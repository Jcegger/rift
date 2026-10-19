// The tweak bench's simulator, off the main thread: a 1,500-game goldfish takes a couple
// of seconds, and the page should not freeze while it runs. Same engine as scripts/sim.
// In: { id, list: {code: qty}, cards: [the catalog rows those codes name], games }.
// Out: { id, r } with the handful of numbers the bench shows, or { id, error }.
import { buildDeck, simulate } from "./sim.mjs";

onmessage = (e) => {
  const { id, list, cards, games = 1500 } = e.data;
  try {
    const BY = new Map(cards.map((c) => [c.c, c]));
    const deck = buildDeck(list, { BY });
    const s = simulate(deck, { games, seed: 1 });
    const e4 = (x) => x.spent.slice(0, 4).reduce((a, b) => a + b, 0);
    postMessage({ id, r: {
      games: s.games, best: s.best, flat: !!s.flat,
      energy: [e4(s.play), e4(s.draw)], units3: [s.play.units[2], s.draw.units[2]],
      stuck3: [s.play.stuck[2], s.draw.stuck[2]], noPlay: [s.play.noPlayT1T2, s.draw.noPlayT1T2],
    } });
  } catch (err) { postMessage({ id, error: String(err.message || err) }); }
};
