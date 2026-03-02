import type { Principal } from '@dfinity/principal';

export function formatAuthorLabel(creator: Principal): string {
  const str = creator.toString();
  if (str.length <= 12) return str;
  return str.slice(0, 6) + '…' + str.slice(-4);
}

export function formatTimestamp(timestamp: bigint): string {
  // ICP timestamps are in nanoseconds
  const ms = Number(timestamp / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

/**
 * Decodes the comment field, stripping out encoded place name tags.
 * Returns the clean comment text without the [loc:...] and [fav:...] markers.
 */
export function decodeComment(comment: string): { cleanComment: string } {
  const cleanComment = comment
    .replace(/\n\[loc:[^\]]*\]/g, '')
    .replace(/\n\[fav:[^\]]*\]/g, '')
    .trim();
  return { cleanComment };
}

/**
 * Extracts place names encoded in the comment field.
 */
export function decodePlaceNames(comment: string): {
  currentLocationName: string | null;
  favoritePlaceName: string | null;
} {
  const locMatch = comment.match(/\[loc:([^\]]+)\]/);
  const favMatch = comment.match(/\[fav:([^\]]+)\]/);
  return {
    currentLocationName: locMatch ? locMatch[1] : null,
    favoritePlaceName: favMatch ? favMatch[1] : null,
  };
}
