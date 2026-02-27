import { useEffect, useRef, useState } from 'react';
import { useGetEntriesWithLocation } from '../hooks/useQueries';
import { decodeLocationPlaceName, stripPlaceNames } from '../lib/guestbookFormat';

// Leaflet is loaded via CDN in index.html
declare const L: any;

export default function WorldMapPage() {
  const { data: entries = [], isLoading } = useGetEntriesWithLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Guard: wait for Leaflet CDN to be available
    if (typeof L === 'undefined') return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add/update markers when entries change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || typeof L === 'undefined') return;

    const map = mapInstanceRef.current;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const validEntries = entries.filter((e) => e.currentLocation != null);

    if (validEntries.length === 0) return;

    // Create custom SVG pin icon
    const pinIcon = L.divIcon({
      className: '',
      html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-world" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
          </filter>
        </defs>
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#2d6a4f" filter="url(#shadow-world)"/>
        <circle cx="14" cy="14" r="6" fill="white"/>
      </svg>`,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -36],
    });

    const bounds: [number, number][] = [];

    validEntries.forEach((entry) => {
      const lat = entry.currentLocation!.latitude;
      const lon = entry.currentLocation!.longitude;
      bounds.push([lat, lon]);

      const placeName = decodeLocationPlaceName(entry.comment, 'current') || entry.trailName || 'Unknown location';
      const authorName = entry.name || 'Anonymous';
      const trailInfo = entry.trailName
        ? `<div style="color:#666;font-size:12px;margin-top:2px;">${entry.trailName}</div>`
        : '';
      const stripped = stripPlaceNames(entry.comment);
      const commentPreview = stripped
        ? `<div style="color:#555;font-size:12px;margin-top:4px;max-width:200px;word-wrap:break-word;">${stripped.slice(0, 100)}${stripped.length > 100 ? '…' : ''}</div>`
        : '';

      const popupContent = `
        <div style="font-family:sans-serif;min-width:150px;">
          <div style="font-weight:bold;font-size:14px;color:#1a1a1a;">${authorName}</div>
          <div style="color:#2d6a4f;font-size:13px;margin-top:2px;">${placeName}</div>
          ${trailInfo}
          ${commentPreview}
        </div>
      `;

      const marker = L.marker([lat, lon], { icon: pinIcon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 250 });

      markersRef.current.push(marker);
    });

    // Fit map to show all pins
    if (bounds.length === 1) {
      map.setView(bounds[0], 8);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [mapReady, entries]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">World Map</h1>
        <p className="text-sm text-muted-foreground">Where hikers are on the trail right now</p>
      </div>

      <div
        className="flex-1 relative mx-4 mb-4 rounded-xl border border-border shadow-md overflow-hidden"
        style={{ minHeight: 360 }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60 z-10">
            <span className="text-muted-foreground text-sm">Loading map…</span>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: 360 }} />

        {!isLoading && entries.filter((e) => e.currentLocation != null).length === 0 && mapReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-card/90 rounded-lg px-4 py-3 text-center shadow">
              <p className="text-muted-foreground text-sm">No location data yet.</p>
              <p className="text-muted-foreground text-xs mt-1">Add an entry with your current location!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
