// The field forecast: what Jay will face, and how good it is — counts and quotes, no score.
// scripts/build-field.mjs gathers the evidence; this is the rules it is read by, on one page.
// It replaces the preseason model's ranking (lib/preseason.mjs), which turned card reads and
// thin samples into a 1–75 rank (22 Oct 2026): the Vendetta backtest (model/expert-backtest.json)
// found that what people PLAY at preview events predicted Barcelona better than any expert,
// and that the experts' consensus flags the obvious winner and ranks the rest poorly.
//
// Three kinds of evidence, never averaged into one number:
// - TIER: the median of the experts' published grades (model/expert-predictions.json). The only
//   source that has already read the new cards for every legend. Only a grade said as a letter
//   (or a tier number) counts; a rank, a card score or a "top group" is shown, not counted.
// - RECORD: last format's Riot RQ tables (Day 2 against Day 1) and top-16 finishes at 40+ player
//   events. Big samples. A record two tiers from the experts' is flagged; one tier is normal
//   (about 60% of a legend's edge survives a set change).
// - PREVIEWS: pilots, top 8s and match win rates at the new format's events. Thin — 2 to 14
//   pilots a legend in October 2026 — so they are shown with their counts and NEVER flag a
//   legend on their own: Kennen won 43% across 14 pilots at Showdown 5 while converting Day 2
//   at twice the field's rate at every Vendetta RQ, and the 43% was the field teching against
//   the most-played deck, not Kennen being weak (22 Oct 2026, Jay caught it).

// When each format became legal. "Last format" is the newest set before the current one; its
// RQ tables are the record. Add a line per set (Riot's release date).
export const FORMAT_FROM = { VEN: "2026-07-31", RAD: "2026-10-23" };

// Grades on one scale: S 5 … F 0, "low"/"high" a third of a step. Tier numbers (Takolandia,
// Digi Slots: Tier 1 / 1.5 / 2 / 2.5) read as S / A / B / C.
const LETTER = { S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 };
const TIER_NUM = { 1: 5, 1.5: 4, 2: 3, 2.5: 2, 3: 1 };
export const LETTERS = ["F", "D", "C", "B", "A", "S"];

export function gradeValue(g) {
  const s = String(g ?? "").trim();
  let m = /^(low |high )?([SABCDF])$/i.exec(s);
  if (m) return LETTER[m[2].toUpperCase()] + (m[1] ? (m[1].toLowerCase() === "low " ? -1 / 3 : 1 / 3) : 0);
  m = /^(?:tier )?(\d(?:\.5)?)$/i.exec(s);
  if (m && TIER_NUM[m[1]] != null) return TIER_NUM[m[1]];
  return null;
}

// A grade that names two letters ("C or B", "A/B", "low S or high A") is between them, not either.
export function gradeOf(g) {
  const v = gradeValue(g);
  if (v != null) return v;
  const m = /^(.+?)(?: or |\s*\/\s*)(.+)$/i.exec(String(g ?? ""));
  if (m) { const a = gradeValue(m[1]), b = gradeValue(m[2]); if (a != null && b != null) return (a + b) / 2; }
  return null;
}

// A source's grade on its own scale: a bare number is a grade only on a tier-number scale
// (Takolandia's "Tier 1 / 1.5 / 2 / 2.5"); on a rank scale ("rank 1–9") 2 is second place, not
// Tier 2 — Riftbound Insider's ranks were read as tiers until 22 Oct 2026.
export function gradeFor(g, scale) {
  if (/^\s*\d/.test(String(g ?? "")) && !/tier/i.test(String(scale ?? ""))) return null;
  return gradeOf(g);
}

export const letterOf = (v) => LETTERS[Math.max(0, Math.min(5, Math.round(v)))];

const quantile = (xs, q) => {
  const s = [...xs].sort((a, b) => a - b), i = (s.length - 1) * q, lo = Math.floor(i);
  return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo);
};

// Agreement on the middle half, not the full range: with ten or more sources every legend
// has an outlier (22 Oct 2026: every new legend's full range spanned two letters or more).
export const THIN = 3, SPLIT_IQR = 1;
export function consensus(values) {
  if (!values.length) return null;
  const median = quantile(values, 0.5), q1 = quantile(values, 0.25), q3 = quantile(values, 0.75);
  const agreement = values.length < THIN ? "thin" : q3 - q1 > SPLIT_IQR ? "split" : "agree";
  return { n: values.length, median, q1, q3, lo: Math.min(...values), hi: Math.max(...values), tier: letterOf(median), agreement };
}

// Last format's record on the same letters, from observed over expected Day 2s (shrunk toward
// ×1.00 by K_REC expected Day 2s, so a legend with a handful of pilots reads near average).
// The cuts are the preseason model's (S converts 40%+ above an average deck, A above average,
// B within 20% below, C within 35% below, D the rest).
export const K_REC = 5, MIN_E = 5;
export const RECORD_CUTS = [["S", 1.4], ["A", 1.0], ["B", 0.8], ["C", 0.65], ["D", 0]];
export const recordRatio = (O, E) => (O + K_REC) / (E + K_REC);
export const recordTier = (ratio) => RECORD_CUTS.find(([, c]) => ratio >= c)[0];

// A record this many tiers from the experts' tier is flagged. Only for a record with at least
// MIN_E expected Day 2s — a thin one is shown, never flagged.
export const DISAGREE_TIERS = 2;
export function disagreement(expertTier, rec) {
  if (!expertTier || !rec || rec.E < MIN_E) return null;
  const d = LETTERS.indexOf(rec.tier) - LETTERS.indexOf(expertTier);
  return Math.abs(d) >= DISAGREE_TIERS ? { by: d, says: rec.tier } : null;
}

// The handover. The question is how good a legend is NOW, so the new format's results take the
// tier from the experts as soon as there are enough of them: Riot's first RQ table, or
// HANDOVER_MAJORS one-on-one events of 40+ players since the legal date (Jay, 22 Oct 2026:
// "the idea was how they'll be NOW"). Last format's record is context from then on, not a tier.
export const HANDOVER_MAJORS = 5;
export const handedOver = ({ rqTables = 0, majors = 0 }) => rqTables > 0 || majors >= HANDOVER_MAJORS;

// Results in the new format, weighted to the recent: a set's first weeks move fast, so an
// event's top finishes count half as much every HALF_LIFE days. Rows are { o, e, age } —
// observed top finishes, expected (pilots × cut / field), days since the event.
export const HALF_LIFE = 14;
export function resultsRatio(rows) {
  let O = 0, E = 0;
  for (const r of rows) { const w = 0.5 ** ((r.age || 0) / HALF_LIFE); O += r.o * w; E += r.e * w; }
  return { O, E, ratio: recordRatio(O, E), tier: E >= MIN_E ? recordTier(recordRatio(O, E)) : null };
}

// How likely Jay is to face a legend: LIKELY at 3+ real preview pilots or 5%+ of last format's
// RQ Day 1, POSSIBLE at 1–2 pilots or 2–5%, RARE below both, UNKNOWN with neither a pilot count
// nor a last format (a new legend nobody has played yet). Starting guesses, said so; the
// scorecard regrades them after the first RQ.
export const LIKELY_PILOTS = 3, LIKELY_SHARE = 0.05, POSSIBLE_SHARE = 0.02;
export function groupOf(pilots, share) {
  if (pilots >= LIKELY_PILOTS || (share ?? 0) >= LIKELY_SHARE) return "LIKELY";
  if (pilots >= 1 || (share ?? 0) >= POSSIBLE_SHARE) return "POSSIBLE";
  if (share == null && !pilots) return "UNKNOWN";
  return "RARE";
}
