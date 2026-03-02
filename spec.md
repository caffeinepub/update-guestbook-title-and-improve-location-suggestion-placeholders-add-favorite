# Specification

## Summary
**Goal:** Fix the guestbook entry save bug, add per-entry edit/delete controls for admins and entry owners, and add a hamburger menu to the app header with About, Create Account, and How to Use options.

**Planned changes:**
- Investigate and fix the bug where submitting the guestbook entry form saves the map pin but does not persist text fields (name, trail name, comment, place names) to the backend; ensure all fields are correctly passed to `addEntry` and a success/error message is shown.
- Add Edit and Delete buttons to guestbook entry cards/detail pages, visible only to the entry's author or the admin principal; editing opens the existing EditEntryDialog pre-populated with current data; deleting removes the entry from the feed and maps.
- Enforce edit/delete authorization in the backend so non-owners and non-admins cannot modify or delete others' entries.
- Add a hamburger (three-line) icon to the app header via a new or non-immutable component composed into AppLayout.
- Hamburger menu opens a drawer/dropdown with at least three items: "About" (opens existing AboutDialog), "Create Account" (opens a modal explaining Internet Identity and the Internet Computer with a login/create identity button), and "How to Use" (opens a modal with brief usage instructions).
- Menu closes on item selection or outside click.

**User-visible outcome:** Guestbook entries now save all text fields correctly. Logged-in users can edit or delete their own entries, and the admin can edit or delete any entry. All visitors can access About, Create Account, and How to Use information via a hamburger menu in the header.
