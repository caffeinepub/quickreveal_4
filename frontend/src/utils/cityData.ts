export const SWISS_ROMANDE_CITIES = [
  'Genève',
  'Lausanne',
  'Fribourg',
  'Neuchâtel',
  'Sion',
  'Montreux',
  'Yverdon',
  'Nyon',
  'Morges',
  'Sierre',
] as const;

export type SwissCity = (typeof SWISS_ROMANDE_CITIES)[number];

// Proximity zones: cities grouped by how close they are
export const CITY_ZONES: Record<string, string[]> = {
  'Genève': ['Genève', 'Nyon', 'Morges'],
  'Lausanne': ['Lausanne', 'Morges', 'Nyon', 'Montreux', 'Yverdon'],
  'Fribourg': ['Fribourg', 'Neuchâtel'],
  'Neuchâtel': ['Neuchâtel', 'Fribourg', 'Yverdon'],
  'Sion': ['Sion', 'Sierre', 'Montreux'],
  'Montreux': ['Montreux', 'Lausanne', 'Sion', 'Sierre'],
  'Yverdon': ['Yverdon', 'Lausanne', 'Neuchâtel'],
  'Nyon': ['Nyon', 'Genève', 'Lausanne', 'Morges'],
  'Morges': ['Morges', 'Lausanne', 'Nyon', 'Genève'],
  'Sierre': ['Sierre', 'Sion', 'Montreux'],
};

// Approximate distances between cities in km
export const CITY_DISTANCES: Record<string, Record<string, number>> = {
  'Genève': { 'Genève': 0, 'Nyon': 25, 'Morges': 40, 'Lausanne': 60, 'Yverdon': 90, 'Fribourg': 150, 'Neuchâtel': 130, 'Montreux': 90, 'Sion': 160, 'Sierre': 175 },
  'Lausanne': { 'Lausanne': 0, 'Morges': 15, 'Nyon': 35, 'Genève': 60, 'Montreux': 30, 'Yverdon': 40, 'Fribourg': 75, 'Neuchâtel': 55, 'Sion': 100, 'Sierre': 115 },
  'Fribourg': { 'Fribourg': 0, 'Neuchâtel': 45, 'Lausanne': 75, 'Yverdon': 60, 'Bern': 35, 'Genève': 150, 'Morges': 80, 'Nyon': 110, 'Montreux': 80, 'Sion': 130, 'Sierre': 145 },
  'Neuchâtel': { 'Neuchâtel': 0, 'Fribourg': 45, 'Yverdon': 35, 'Lausanne': 55, 'Genève': 130, 'Morges': 65, 'Nyon': 100, 'Montreux': 80, 'Sion': 140, 'Sierre': 155 },
  'Sion': { 'Sion': 0, 'Sierre': 15, 'Montreux': 65, 'Lausanne': 100, 'Genève': 160, 'Fribourg': 130, 'Neuchâtel': 140, 'Yverdon': 130, 'Nyon': 145, 'Morges': 110 },
  'Montreux': { 'Montreux': 0, 'Lausanne': 30, 'Sion': 65, 'Sierre': 80, 'Morges': 45, 'Nyon': 65, 'Genève': 90, 'Fribourg': 80, 'Neuchâtel': 80, 'Yverdon': 65 },
  'Yverdon': { 'Yverdon': 0, 'Lausanne': 40, 'Neuchâtel': 35, 'Fribourg': 60, 'Morges': 50, 'Nyon': 65, 'Genève': 90, 'Montreux': 65, 'Sion': 130, 'Sierre': 145 },
  'Nyon': { 'Nyon': 0, 'Genève': 25, 'Morges': 20, 'Lausanne': 35, 'Yverdon': 65, 'Montreux': 65, 'Fribourg': 110, 'Neuchâtel': 100, 'Sion': 145, 'Sierre': 160 },
  'Morges': { 'Morges': 0, 'Lausanne': 15, 'Nyon': 20, 'Genève': 40, 'Montreux': 45, 'Yverdon': 50, 'Fribourg': 80, 'Neuchâtel': 65, 'Sion': 110, 'Sierre': 125 },
  'Sierre': { 'Sierre': 0, 'Sion': 15, 'Montreux': 80, 'Lausanne': 115, 'Genève': 175, 'Fribourg': 145, 'Neuchâtel': 155, 'Yverdon': 145, 'Nyon': 160, 'Morges': 125 },
};

export function getDistanceBetweenCities(city1: string, city2: string): number {
  if (city1 === city2) return 0;
  const dist = CITY_DISTANCES[city1]?.[city2];
  if (dist !== undefined) return dist;
  const distReverse = CITY_DISTANCES[city2]?.[city1];
  if (distReverse !== undefined) return distReverse;
  return 999;
}

export type ProximityCategory = 'same' | 'nearby' | 'far';

export function getCityProximity(city1: string, city2: string): ProximityCategory {
  const dist = getDistanceBetweenCities(city1, city2);
  if (dist === 0) return 'same';
  if (dist <= 50) return 'nearby';
  return 'far';
}

export function getCitiesWithinRadius(centerCity: string, radiusKm: number): string[] {
  return SWISS_ROMANDE_CITIES.filter(city => {
    const dist = getDistanceBetweenCities(centerCity, city);
    return dist <= radiusKm;
  });
}

export function formatCityDistance(city1: string, city2: string): string {
  if (city1 === city2) return 'Même ville';
  const dist = getDistanceBetweenCities(city1, city2);
  if (dist >= 999) return 'Loin';
  return `${dist} km`;
}
