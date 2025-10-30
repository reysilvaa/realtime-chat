import { browser } from '$app/environment';

export interface StorageOptions {
  expiresIn?: number; // in milliseconds
}

interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

export function setItem<T>(key: string, value: T, options?: StorageOptions): void {
  if (!browser) return;

  try {
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined
    };

    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

export function getItem<T>(key: string): T | null {
  if (!browser) return null;

  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item: StorageItem<T> = JSON.parse(itemStr);

    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

export function removeItem(key: string): void {
  if (!browser) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

export function clear(): void {
  if (!browser) return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export function hasItem(key: string): boolean {
  if (!browser) return false;

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage (${key}):`, error);
    return false;
  }
}

export function getTimestamp(key: string): number | null {
  if (!browser) return null;

  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item: StorageItem<any> = JSON.parse(itemStr);
    return item.timestamp;
  } catch (error) {
    console.error(`Error getting timestamp from localStorage (${key}):`, error);
    return null;
  }
}

export function isExpired(key: string): boolean {
  if (!browser) return true;

  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return true;

    const item: StorageItem<any> = JSON.parse(itemStr);
    
    if (!item.expiresAt) return false;
    
    return Date.now() > item.expiresAt;
  } catch (error) {
    console.error(`Error checking expiration (${key}):`, error);
    return true;
  }
}

export const STORAGE_KEYS = {
  EMOJIS: 'app:emojis',
  EMOJI_CATEGORIES: 'app:emoji_categories',
  WEATHER: 'app:weather',
  LOCATION: 'app:location',
  USER_PREFERENCES: 'app:user_preferences'
} as const;
