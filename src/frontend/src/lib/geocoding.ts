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

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "VTHGuestbook/1.0";

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  const trimmedQuery = query.trim();
  const url = new URL(`${NOMINATIM_BASE_URL}/search`);
  url.searchParams.set("q", trimmedQuery);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(
      `Geocoding service returned ${response.status}: ${response.statusText}`,
    );
  }

  const data: NominatimResult[] = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid response from geocoding service");
  }

  if (data.length === 0) {
    throw new Error(`No results found for "${trimmedQuery}"`);
  }

  return data.map((result) => ({
    displayName: result.display_name,
    latitude: Number.parseFloat(result.lat),
    longitude: Number.parseFloat(result.lon),
    type: result.type,
    importance: result.importance,
  }));
}
