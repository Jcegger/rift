// The nine Radiance Pre-Rift champion packs: what each one holds, so a scan of a kit can be
// checked card by card (`rift intake check <champion>`). The same lists are guides/radiance-pre-rift.md
// §5a, which has each card's cost and text.
//
// Riot has not published these. They come from riftbound.org's Pre-Rift kit pages and
// riftbound.zone's "All Nine Seeded Decklists", read 20 Oct 2026, which agree on all nine; every
// code was checked against data/cards.json and the pack's two domains. One copy of each card.
// Hand-written, not generated: if a pack you open differs, the pack is right and this is the bug.

export const PRE_RIFT_KITS = {
  "Ekko": ["RAD-139", "RAD-061", "RAD-162", "RAD-060", "RAD-050", "RAD-058", "RAD-049", "RAD-009", "RAD-008", "RAD-003", "RAD-005", "RAD-051", "RAD-010", "RAD-006", "RAD-002"],
  "Evelynn": ["RAD-153", "RAD-109", "RAD-157", "RAD-077", "RAD-081", "RAD-076", "RAD-095", "RAD-099", "RAD-105", "RAD-103", "RAD-097", "RAD-102", "RAD-098", "RAD-100", "RAD-070"],
  "Jarvan IV": ["RAD-155", "RAD-133", "RAD-163", "RAD-080", "RAD-078", "RAD-075", "RAD-072", "RAD-128", "RAD-129", "RAD-070", "RAD-121", "RAD-117", "RAD-123", "RAD-116", "RAD-073"],
  "K'Sante": ["RAD-147", "RAD-086", "RAD-161", "RAD-077", "RAD-081", "RAD-078", "RAD-083", "RAD-072", "RAD-031", "RAD-070", "RAD-032", "RAD-025", "RAD-024", "RAD-071", "RAD-073"],
  "Mordekaiser": ["RAD-143", "RAD-020", "RAD-166", "RAD-125", "RAD-118", "RAD-126", "RAD-119", "RAD-120", "RAD-014", "RAD-005", "RAD-006", "RAD-007", "RAD-124", "RAD-002", "RAD-116"],
  "Orianna": ["RAD-145", "RAD-042", "RAD-163", "RAD-030", "RAD-031", "RAD-037", "RAD-049", "RAD-054", "RAD-053", "RAD-035", "RAD-024", "RAD-052", "RAD-056", "RAD-025", "RAD-033"],
  "Riven": ["RAD-149", "RAD-043", "RAD-163", "RAD-093", "RAD-105", "RAD-097", "RAD-031", "RAD-026", "RAD-027", "RAD-035", "RAD-034", "RAD-029", "RAD-028", "RAD-025", "RAD-104"],
  "Seraphine": ["RAD-151", "RAD-065", "RAD-159", "RAD-125", "RAD-118", "RAD-120", "RAD-049", "RAD-053", "RAD-059", "RAD-048", "RAD-047", "RAD-127", "RAD-116", "RAD-057", "RAD-122"],
  "Ziggs": ["RAD-141", "RAD-112", "RAD-165", "RAD-001", "RAD-093", "RAD-094", "RAD-005", "RAD-105", "RAD-012", "RAD-096", "RAD-006", "RAD-014", "RAD-097", "RAD-099", "RAD-106"],
};

// Riot's promo in every kit (riftbound.gg's id; the rift catalog has only the base printing).
export const PRE_RIFT_PROMO = { id: "RAD-132-P", name: "Heimerdinger, Academy Instructor (Prerelease Promo)", base: "RAD-132" };
