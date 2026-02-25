/**
 * Geocoding utility for place name lookup using OpenStreetMap Nominatim API.
 * Returns normalized candidate results with display name and coordinates.
 */

export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
  importance?: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  importance?: number;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'ATGuestbook/1.0';

/**
 * Search for places by name and return candidate results.
 * @param query - The place name to search for (e.g., "Newfound Gap")
 * @returns Array of geocoding results with coordinates
 * @throws Error if the API request fails or returns invalid data
 */
export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  const trimmedQuery = query.trim();
  
  try {
    const url = new URL(`${NOMINATIM_BASE_URL}/search`);
    url.searchParams.set('q', trimmedQuery);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding service returned ${response.status}: ${response.statusText}`);
    }

    const data: NominatimResult[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response from geocoding service');
    }

    if (data.length === 0) {
      throw new Error(`No results found for "${trimmedQuery}"`);
    }

    // Normalize results
    return data.map((result) => ({
      displayName: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      type: result.type,
      importance: result.importance,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to search for location. Please try again.');
  }
}
