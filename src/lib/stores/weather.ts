import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { WEATHER_API, CACHE_DURATIONS } from '$lib/config';
import { isCacheValid } from '$lib/utils/cache';
import { getCurrentLocation, getLocationName } from '$lib/utils/location';

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
  lastFetched: number | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null
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
      const cityName = await getLocationName({ latitude, longitude });

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

      set({ data: weatherData, loading: false, error: null, lastFetched: Date.now() });
    } catch (error) {
      set({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load weather',
        lastFetched: null
      });
    }
  }

  async function loadWeather(forceRefresh: boolean = false) {
    if (!browser) return;

    // Check if we have valid cached data
    let currentState: WeatherState | undefined;
    const unsubscribe = subscribe(state => { currentState = state; });
    unsubscribe();
    
    if (!forceRefresh && currentState?.data && isCacheValid(currentState.lastFetched, CACHE_DURATIONS.weather)) {
      console.log('✅ Using cached weather data');
      return;
    }

    console.log('🔄 Fetching fresh weather data...');
    update(state => ({ ...state, loading: true, error: null }));

    try {
      const coords = await getCurrentLocation(forceRefresh);
      await fetchWeather(coords.latitude, coords.longitude);
    } catch (error) {
      update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get location',
        lastFetched: null
      }));
    }
  }

  return {
    subscribe,
    loadWeather,
    refresh: () => loadWeather(true)
  };
}

export const weather = createWeatherStore();
