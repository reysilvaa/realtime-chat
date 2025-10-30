import { WEATHER_API, CACHE_DURATIONS } from '$lib/config';
import { browser } from '$app/environment';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationData {
  coordinates: Coordinates;
  locationName: string;
  timestamp: number;
}

let cachedLocation: LocationData | null = null;

/**
 * Get user's current location using browser's Geolocation API
 */
export function getCurrentLocation(forceRefresh: boolean = false): Promise<Coordinates> {
  if (!browser) {
    return Promise.reject(new Error('Geolocation only works in browser'));
  }

  // Check cache
  if (!forceRefresh && cachedLocation && isCacheValid()) {
    console.log('✅ Using cached location coordinates');
    return Promise.resolve(cachedLocation.coordinates);
  }

  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        console.log('📍 Location obtained:', coords);
        resolve(coords);
      },
      (error) => {
        console.error('Location error:', error);
        let errorMessage = 'Location access denied.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please check your connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
}

/**
 * Get location name from coordinates using reverse geocoding
 */
export async function getLocationName(coords: Coordinates, forceRefresh: boolean = false): Promise<string> {
  // Check cache
  if (!forceRefresh && cachedLocation && 
      cachedLocation.coordinates.latitude === coords.latitude &&
      cachedLocation.coordinates.longitude === coords.longitude &&
      isCacheValid()) {
    console.log('✅ Using cached location name');
    return cachedLocation.locationName;
  }

  console.log('🔍 Reverse geocoding:', coords);
  
  try {
    const response = await fetch(
      `${WEATHER_API.geocodingUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📍 Geocoding result:', data);
    
    const locationName = formatLocationName(data);
    
    // Update cache
    cachedLocation = {
      coordinates: coords,
      locationName,
      timestamp: Date.now()
    };
    
    return locationName;
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return 'Unknown Location';
  }
}

/**
 * Format location name from geocoding data
 */
function formatLocationName(data: any): string {
  if (!data) return 'Unknown Location';
  
  const parts: string[] = [];
  const administrative = data.localityInfo?.administrative || [];
  
  // Structure:
  // [0] = Country, [1] = Island/Region, [2] = Province/State
  // [3] = Regency/County, [4] = District/Subdistrict
  
  // Add district/subdistrict level (like Balongbendo)
  const district = administrative[4]?.name;
  const regency = administrative[3]?.name;
  
  // Add district if it exists and different from regency
  if (district && district !== regency) {
    parts.push(district);
  }
  
  // Add regency/city level (like Sidoarjo)
  if (regency && !parts.includes(regency)) {
    parts.push(regency);
  } else if (data.city && !parts.includes(data.city)) {
    parts.push(data.city);
  }
  
  // Add province/state level (like "Jawa Timur")
  const province = administrative[2]?.name || data.principalSubdivision;
  if (province && !parts.includes(province)) {
    parts.push(province);
  }
  
  // Add country
  if (data.countryName && parts.length > 0) {
    parts.push(data.countryName);
  }
  
  const locationString = parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  console.log('✅ Location formatted:', locationString);
  return locationString;
}

/**
 * Check if cached location is still valid
 */
function isCacheValid(): boolean {
  if (!cachedLocation) return false;
  const now = Date.now();
  return (now - cachedLocation.timestamp) < CACHE_DURATIONS.location;
}

/**
 * Get full location data (coordinates + name)
 */
export async function getFullLocation(forceRefresh: boolean = false): Promise<LocationData> {
  const coords = await getCurrentLocation(forceRefresh);
  const locationName = await getLocationName(coords, forceRefresh);
  
  return {
    coordinates: coords,
    locationName,
    timestamp: Date.now()
  };
}

/**
 * Clear location cache
 */
export function clearLocationCache(): void {
  cachedLocation = null;
  console.log('🗑️ Location cache cleared');
}
