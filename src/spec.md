# Specification

## Summary
**Goal:** Replace static map images with interactive Leaflet maps, add hover tooltips showing place names, enable edit/delete functionality for entries, and implement zoom controls.

**Planned changes:**
- Replace static map images in WorldMapPage and ATMapPage with interactive Leaflet maps using OpenStreetMap tiles
- Display place names in tooltips when hovering over map pins
- Add delete functionality for guestbook entries (users can delete their own entries)
- Enable edit functionality for entries via EditEntryDialog
- Remove generic hiking trail logo from AT pin board
- Add zoom in/out controls and mouse wheel zoom to both maps
- Auto-fit map views to show all pinned locations when entries exist

**User-visible outcome:** Users can interact with accurate, zoomable maps showing their pinned locations, hover over pins to see place names, and edit or delete their own guestbook entries.
