interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

const CACHE_PREFIX = 'nexus_geocode_';

export async function geocodeCity(query: string): Promise<Coordinates | null> {
  if (!query.trim()) return null;

  const cacheKey = CACHE_PREFIX + query.toLowerCase().trim();
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as Coordinates;
    } catch {
      // ignore
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NEXUS-Platform/1.0 (nexus.app)',
        'Accept-Language': 'fr',
      },
    });

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();
    if (!results.length) return null;

    const coords: Coordinates = {
      lat: parseFloat(results[0].lat),
      lon: parseFloat(results[0].lon),
    };

    localStorage.setItem(cacheKey, JSON.stringify(coords));
    return coords;
  } catch {
    return null;
  }
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
