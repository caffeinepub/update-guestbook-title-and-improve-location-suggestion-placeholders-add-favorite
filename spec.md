# Specification

## Summary
**Goal:** Allow any visitor to submit a guestbook entry without requiring Internet Identity authentication.

**Planned changes:**
- Remove the authentication/authorization check in the backend `addEntry` function so anonymous principals are accepted and entries are stored without error
- Remove the sign-in gate, disabled state, and any authentication error messages on the `AddEntryPage` so the form is fully submittable without logging in
- Keep the Internet Identity login/logout button in the header for users who wish to sign in voluntarily

**User-visible outcome:** Visitors can enter their name and message and submit a guestbook entry without signing in. No account or Internet Identity login is required to use the guestbook form.
