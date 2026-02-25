import type { GuestbookEntry } from '../backend';

export function getAuthorLabel(entry: GuestbookEntry): string {
  if (entry.name && entry.trailName) {
    return `${entry.name} (${entry.trailName})`;
  }
  if (entry.name) {
    return entry.name;
  }
  if (entry.trailName) {
    return entry.trailName;
  }
  return 'Anonymous Hiker';
}

export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

// Place name encoding/decoding for persisting in entry data
const PLACE_NAME_PREFIX = '[PLACE:';
const PLACE_NAME_SUFFIX = ']';

export function encodeLocationPlaceName(comment: string, placeName: string, locationType: 'current' | 'favorite'): string {
  const marker = locationType === 'current' ? 'CURRENT' : 'FAVORITE';
  return `${comment}\n${PLACE_NAME_PREFIX}${marker}:${placeName}${PLACE_NAME_SUFFIX}`;
}

export function decodeLocationPlaceName(comment: string, locationType: 'current' | 'favorite'): string | null {
  const marker = locationType === 'current' ? 'CURRENT' : 'FAVORITE';
  const pattern = new RegExp(`\\[PLACE:${marker}:([^\\]]+)\\]`);
  const match = comment.match(pattern);
  return match ? match[1] : null;
}

export function stripPlaceNames(comment: string): string {
  return comment.replace(/\[PLACE:(CURRENT|FAVORITE):[^\]]+\]/g, '').trim();
}
