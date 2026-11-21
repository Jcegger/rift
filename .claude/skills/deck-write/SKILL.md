---
name: deck-write
description: Changing Jay's decks, collection, wants or settings — swapping, adding or cutting cards in a deck, adding or deleting a deck, marking wants, or asking how to do any of these. Use before touching `scripts/rift deck` or the Supabase row: it is a live write the running app also makes, not a git change.
---

# Changing a deck (a live write)

The collection, decks, wants and settings are one Supabase row that the app at
rift.jayegger.com reads and writes. Jay edits between sessions, so a copy read earlier is
stale until re-read.

1. Bench a card swap first: `scripts/rift try --deck "<name>" "-N Card" "+N Card"`.
2. Pull the row fresh and save it to `backups/state-pre-<what>-<date>.json` (gitignored).
3. Check the deck still matches what you last read. If Jay changed it, stop and ask.
4. Merge: change only that deck's `cards`/`sb`, keeping every other key as read.
5. Write back the whole row (`Prefer: resolution=merge-duplicates`, the same write the app
   makes in `index.html`).
6. Confirm with `scripts/rift export`.

For Jay's current main deck, `notes/handover.md` ("How to change the deck") lists the guides,
sheets and builds to update after the write.
