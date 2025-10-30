import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { WEATHER_API } from '$lib/config';

interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  hourly: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    icon: string;
  }>;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null
};

function createWeatherStore() {
  const { subscribe, set, update } = writable<WeatherState>(initialState);

  function getWeatherIcon(weatherCode: number, isDay: boolean = true): string {
    if (weatherCode === 0) return isDay ? 'fa-sun' : 'fa-moon';
    if (weatherCode <= 3) return 'fa-cloud-sun';
    if (weatherCode <= 48) return 'fa-cloud';
    if (weatherCode <= 67) return 'fa-cloud-rain';
    if (weatherCode <= 77) return 'fa-snowflake';
    if (weatherCode <= 82) return 'fa-cloud-showers-heavy';
    if (weatherCode <= 86) return 'fa-snowflake';
    return 'fa-bolt';
  }

  function getWeatherCondition(weatherCode: number): string {
    if (weatherCode === 0) return 'Clear';
    if (weatherCode <= 3) return 'Partly Cloudy';
    if (weatherCode <= 48) return 'Foggy';
    if (weatherCode <= 67) return 'Rainy';
    if (weatherCode <= 77) return 'Snowy';
    if (weatherCode <= 82) return 'Heavy Rain';
    if (weatherCode <= 86) return 'Heavy Snow';
    return 'Thunderstorm';
  }

  async function getCityName(lat: number, lon: number): Promise<string> {
    try {
      console.log('🔍 Reverse geocoding:', { lat, lon });
      const response = await fetch(
        `${WEATHER_API.geocodingUrl}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Geocoding result:', data);
      
      if (data) {
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
      return 'Unknown Location';
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      return 'Unknown Location';
    }
  }

  async function fetchWeather(latitude: number, longitude: number) {
    update(state => ({ ...state, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
        hourly: 'temperature_2m,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
        timezone: 'auto'
      });

      const response = await fetch(`${WEATHER_API.baseUrl}/forecast?${params}`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      const cityName = await getCityName(latitude, longitude);

      const now = new Date();
      const currentHour = now.getHours();
      
      const hourlyData = data.hourly.time
        .slice(currentHour, currentHour + 6)
        .map((time: string, index: number) => {
          const hour = new Date(time).getHours();
          return {
            time: `${hour.toString().padStart(2, '0')}:00`,
            temp: Math.round(data.hourly.temperature_2m[currentHour + index]),
            icon: getWeatherIcon(data.hourly.weather_code[currentHour + index])
          };
        });

      const dailyData = data.daily.time.slice(0, 5).map((date: string, index: number) => {
        const dayDate = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          day: index === 0 ? 'Today' : days[dayDate.getDay()],
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
          icon: getWeatherIcon(data.daily.weather_code[index])
        };
      });

      const weatherData: WeatherData = {
        location: cityName,
        latitude,
        longitude,
        temperature: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code, data.current.is_day === 1),
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        hourly: hourlyData,
        daily: dailyData
      };

      set({ data: weatherData, loading: false, error: null });
    } catch (error) {
      set({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load weather'
      });
    }
  }

  function loadWeather() {
    if (!browser) return;

    update(state => ({ ...state, loading: true, error: null }));

    if ('geolocation' in navigator) {
      // Request high accuracy location
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location obtained:', {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          fetchWeather(position.coords.latitude, position.coords.longitude);
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
          
          update(state => ({
            ...state,
            loading: false,
            error: errorMessage
          }));
        },
        options
      );
    } else {
      update(state => ({
        ...state,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      }));
    }
  }

  return {
    subscribe,
    loadWeather,
    refresh: loadWeather
  };
}

export const weather = createWeatherStore();
