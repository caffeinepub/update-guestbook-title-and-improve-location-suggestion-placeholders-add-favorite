# Specification

## Summary
**Goal:** Rename the "Favorite AT Location" label to "Favorite Location on the Trail" throughout the UI, and fix the "Actor not available" error that occurs when a user tries to add a location while signing the guest book.

**Planned changes:**
- Replace all occurrences of the string "Favorite AT Location" with "Favorite Location on the Trail" in the AddEntryPage form, EntryDetailPage, GuestbookFeedPage, and any other components where it appears
- Investigate and fix the "Actor not available" error in the add-entry flow by ensuring the actor is properly initialized or awaited before a location submission is attempted
- If the actor is not yet ready, display an appropriate loading state or login prompt instead of an error

**User-visible outcome:** Users see "Favorite Location on the Trail" everywhere the favorite place field is referenced, and can successfully add a location when signing the guest book without encountering an "Actor not available" error.
