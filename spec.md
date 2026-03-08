# VTH Guest Book

## Current State
The app is a guestbook for Vicarious Thru-Hikers with a feed, add-entry form, entry detail page, world map (Leaflet), and trail map (Leaflet). The color scheme in `src/frontend/src/index.css` already has beige background, burnt red title, and forest green accent tokens defined. The "View Entry" link in map popups uses `window.history.pushState` + `PopStateEvent` which does NOT trigger TanStack Router navigation, causing "entry not found" errors.

## Requested Changes (Diff)

### Add
- Nothing new to add.

### Modify
- **Fix "View Entry" navigation in WorldMapPage.tsx and ATMapPage.tsx**: Replace the broken `window.history.pushState` + `PopStateEvent` approach with Leaflet's `popupopen` event listener. On popup open, find the `.view-entry-link` anchor element and attach a real click handler that calls `router.navigate({ to: "/entry/$timestamp", params: { timestamp } })`. Import `getRouterContext` or use `useNavigate` from TanStack Router via a React ref approach. Since these are non-React Leaflet popup contexts, the best approach is to use `window.__vthRouter` (set in App.tsx) or use a module-level router reference.
- **Color scheme**: Ensure `src/frontend/src/index.css` background is a warm beige (slightly warmer/more visible beige tint), burnt red logo title, and forest green primary/accent colors. The existing values look close — tweak background to be a more noticeable warm beige (e.g., `oklch(93% 0.025 75)`), keep burnt red title (`oklch(42% 0.2 28)`), keep forest green primary (`oklch(38% 0.14 145)`).

### Remove
- The broken `onclick="event.preventDefault(); window.history.pushState..."` inline handlers from popup HTML strings in both map pages.

## Implementation Plan
1. In `App.tsx`, expose the router instance on `window.__vthRouter` so Leaflet popup click handlers can call it.
2. In `WorldMapPage.tsx`: Change the "View Entry" anchor to use `class="view-entry-link"` and `data-ts="${timestamp}"`. After calling `.bindPopup()`, listen for the map's `popupopen` event. In that handler, find `.view-entry-link` in the popup DOM and attach a click handler that calls `(window as any).__vthRouter.navigate(...)`.
3. In `ATMapPage.tsx`: Same fix as WorldMapPage.
4. In `src/frontend/src/index.css`: Ensure background is a noticeable warm beige, burnt red title, forest green accents — adjust if current values look washed out.
