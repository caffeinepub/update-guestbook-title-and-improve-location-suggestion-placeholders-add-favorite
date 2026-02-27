# Specification

## Summary
**Goal:** Fix broken Leaflet map rendering and restore the ability to create new guestbook entries.

**Planned changes:**
- Remove Leaflet CDN `<script>` and `<link>` tags from `frontend/index.html`
- Install Leaflet as an npm package (`leaflet` + `@types/leaflet`) and import its CSS directly in `WorldMapPage.tsx` and `ATMapPage.tsx`
- Fix default marker icon broken asset paths by setting `L.Icon.Default.mergeOptions` with correct URLs pointing to `leaflet/dist/images`
- Ensure map container divs have explicit pixel heights so maps render correctly
- Fix `AddEntryPage` so form submission and `PlaceSearchField` geocoding work without runtime errors and do not depend on Leaflet map state

**User-visible outcome:** Users can view interactive maps with visible pins and popups, and can successfully submit new guestbook entries that appear in the feed.
