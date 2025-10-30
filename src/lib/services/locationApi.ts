import { GEOCODING_API } from '$lib/config';
import { browser } from '$app/environment';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationData {
  coordinates: Coordinates;
  locationName: string;
}

export function getCurrentLocation(): Promise<Coordinates> {
  if (!browser) {
    return Promise.reject(new Error('Geolocation only works in browser'));
  }

  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
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

export async function getLocationName(coords: Coordinates): Promise<string> {
  console.log('🔍 Reverse geocoding:', coords);
  
  try {
    const response = await fetch(
      `${GEOCODING_API.reverseGeocodeUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📍 Geocoding result:', data);
    
    return formatLocationName(data);
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return 'Unknown Location';
  }
}

function formatLocationName(data: any): string {
  if (!data) return 'Unknown Location';
  
  const parts: string[] = [];
  const administrative = data.localityInfo?.administrative || [];
  
  const district = administrative[4]?.name;
  const regency = administrative[3]?.name;
  
  if (district && district !== regency) {
    parts.push(district);
  }
  
  if (regency && !parts.includes(regency)) {
    parts.push(regency);
  } else if (data.city && !parts.includes(data.city)) {
    parts.push(data.city);
  }
  
  const province = administrative[2]?.name || data.principalSubdivision;
  if (province && !parts.includes(province)) {
    parts.push(province);
  }
  
  if (data.countryName && parts.length > 0) {
    parts.push(data.countryName);
  }
  
  const locationString = parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  console.log('✅ Location formatted:', locationString);
  return locationString;
}

export async function getFullLocation(): Promise<LocationData> {
  const coords = await getCurrentLocation();
  const locationName = await getLocationName(coords);
  
  return {
    coordinates: coords,
    locationName
  };
}
