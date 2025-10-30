import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { CACHE_DURATIONS } from '$lib/config';
import { isCacheValid } from '$lib/utils/cache';
import { getCurrentLocation, getLocationName } from '$lib/utils/location';
import type { WeatherData } from '$lib/services/weatherApi';
import { fetchWeather } from '$lib/services/weatherApi';

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

  async function loadWeatherData(latitude: number, longitude: number) {
    update(state => ({ ...state, loading: true, error: null }));

    try {
      const cityName = await getLocationName({ latitude, longitude });
      const weatherData = await fetchWeather(latitude, longitude, cityName);

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
      await loadWeatherData(coords.latitude, coords.longitude);
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
