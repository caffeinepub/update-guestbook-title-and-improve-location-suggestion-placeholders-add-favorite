# VTH Guest Book: Vicarious Thru-Hiker

## Current State

The project has a full implementation in `src/` covering:
- Motoko backend with GuestbookEntry, anonymous addEntry, updateEntry, deleteEntry, getAllEntries, getEntriesWithLocation, getEntriesWithFavoritePlace, user profiles, and role-based admin authorization
- React frontend with 5 pages: GuestbookFeed, AddEntry, EntryDetail, WorldMap, ATMap (Trail Map)
- Leaflet + OpenStreetMap interactive maps with SVG pin icons and clickable popups routing to entries
- HamburgerMenu with About, CreateAccount, HowToUse dialogs (all scrollable, z-index above maps)
- Warm beige/burnt red/forest green HSL color theme
- PlaceSearchField with Nominatim geocoding
- Trail dropdown with 17 popular trails + custom entry
- Edit/Delete for owners and admins

The problem: Persistent IC0508 (canister stopped) and IC0537 (no wasm module) errors on the backend canister, and the live URL vth.caffeine.xyz is not accessible. The backend canister has become non-functional and needs a fresh deployment.

## Requested Changes (Diff)

### Add
- Nothing new; this is a clean rebuild of all existing features

### Modify
- Fresh Motoko backend canister (new canister ID, resolves IC0508/IC0537)
- Rebuild all frontend code identically from current implementation

### Remove
- Broken/stale canister bindings

## Implementation Plan

1. Generate fresh Motoko backend with all existing functionality (guestbook entries, anonymous posting, admin controls, location data)
2. Rebuild all frontend components exactly as they exist, ensuring all dialogs have z-index 99999 to appear above Leaflet maps, HSL color tokens, and proper actor initialization
3. Deploy fresh draft and publish live
