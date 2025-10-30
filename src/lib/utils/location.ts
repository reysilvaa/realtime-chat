import { CACHE_DURATIONS } from '$lib/config';
import type { Coordinates, LocationData } from '$lib/services/locationApi';
import { getCurrentLocation as getCoords, getLocationName as getLocName } from '$lib/services/locationApi';

interface CachedLocationData extends LocationData {
  timestamp: number;
}

let cachedLocation: CachedLocationData | null = null;

export type { Coordinates, LocationData };

export function getCurrentLocation(forceRefresh: boolean = false): Promise<Coordinates> {
  // Check cache
  if (!forceRefresh && cachedLocation && isCacheValid()) {
    console.log('✅ Using cached location coordinates');
    return Promise.resolve(cachedLocation.coordinates);
  }

  return getCoords();
}

export async function getLocationName(coords: Coordinates, forceRefresh: boolean = false): Promise<string> {
  // Check cache
  if (!forceRefresh && cachedLocation && 
      cachedLocation.coordinates.latitude === coords.latitude &&
      cachedLocation.coordinates.longitude === coords.longitude &&
      isCacheValid()) {
    console.log('✅ Using cached location name');
    return cachedLocation.locationName;
  }

  const locationName = await getLocName(coords);
  
  // Update cache
  cachedLocation = {
    coordinates: coords,
    locationName,
    timestamp: Date.now()
  };
  
  return locationName;
}

function isCacheValid(): boolean {
  if (!cachedLocation) return false;
  const now = Date.now();
  return (now - cachedLocation.timestamp) < CACHE_DURATIONS.location;
}

export async function getFullLocation(forceRefresh: boolean = false): Promise<LocationData> {
  const coords = await getCurrentLocation(forceRefresh);
  const locationName = await getLocationName(coords, forceRefresh);
  
  return {
    coordinates: coords,
    locationName
  };
}

export function clearLocationCache(): void {
  cachedLocation = null;
  console.log('🗑️ Location cache cleared');
}
