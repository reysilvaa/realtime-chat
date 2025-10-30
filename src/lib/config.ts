import { browser } from '$app/environment';

export const SUPABASE_CONFIG = {
  url: 'https://zomhbdgmjoczkebtslhb.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbWhiZGdtam9jemtlYnRzbGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Njk2NDYsImV4cCI6MjA3NzI0NTY0Nn0.v92vqtBjxXLDM8EX6jLKn7iY2PRmJt3K2ZhU1tx1D3c'
} as const;

export const DEV_MODE = browser && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.search.includes('dev=true')
);

export const EMOTICONS = [
  '😀', '😂', '🥰', '😍', '🤔', '😎', '😭', '😴',
  '🤗', '😘', '🙄', '😤', '🥺', '😊', '🤭', '😋',
  '👍', '👎', '❤️', '💔', '🔥', '⭐', '🎉', '💯'
] as const;

export const WEATHER_API = {
  baseUrl: 'https://api.open-meteo.com/v1',
  geocodingUrl: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  cacheDuration: 15 * 1000 // 15 seconds
} as const;

export const EMOJI_API = {
  baseUrl: 'https://emoji-api.com/emojis',
  categoriesUrl: 'https://emoji-api.com/categories',
  accessKey: '55e184678795c32ffcd44efdbea49a4949f6ac95'
} as const;

export const CACHE_DURATIONS = {
  weather: 15 * 1000, // 15 seconds
  messages: 15 * 1000, // 15 seconds
  location: 15 * 1000 // 15 seconds
} as const;
