import { MAPS_API, GEOCODING_API } from '$lib/config';

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}



export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 3) return [];

  try {
    // Use Photon API instead of Nominatim to avoid CORS issues
    const response = await fetch(
      `${MAPS_API.searchUrl}/?q=${encodeURIComponent(query)}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Convert Photon format to SearchResult format
    return data.features.map((feature: any) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      // Build display name from properties
      const nameParts = [];
      if (props.name) nameParts.push(props.name);
      if (props.street) nameParts.push(props.street);
      if (props.city) nameParts.push(props.city);
      if (props.state) nameParts.push(props.state);
      if (props.country) nameParts.push(props.country);
      
      return {
        place_id: props.osm_id || 0,
        display_name: nameParts.join(', '),
        lat: coords[1].toString(),
        lon: coords[0].toString(),
        type: props.osm_value || 'place',
        importance: 0.5,
        address: {
          road: props.street,
          suburb: props.district,
          city: props.city,
          state: props.state,
          country: props.country
        }
      };
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    // Use BigDataCloud API instead of Nominatim to avoid CORS issues
    const response = await fetch(
      `${GEOCODING_API.reverseGeocodeUrl}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocode failed: ${response.statusText}`);
    }

    const data = await response.json();
    return formatAddress(data);
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Unknown location';
  }
}

function formatAddress(data: any): string {
  if (!data) return 'Unknown location';
  
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
  
  return parts.length > 0 ? parts.join(', ') : 'Unknown location';
}
