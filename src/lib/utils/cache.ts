export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function isCacheValid(timestamp: number | null, cacheDuration: number): boolean {
  if (!timestamp) return false;
  const now = Date.now();
  return (now - timestamp) < cacheDuration;
}

export function createCache<T>(cacheDuration: number) {
  let cache: CacheEntry<T> | null = null;

  return {
    get(): T | null {
      if (cache && isCacheValid(cache.timestamp, cacheDuration)) {
        return cache.data;
      }
      return null;
    },

    set(data: T): void {
      cache = {
        data,
        timestamp: Date.now()
      };
    },

    clear(): void {
      cache = null;
    },

    isValid(): boolean {
      return cache !== null && isCacheValid(cache.timestamp, cacheDuration);
    }
  };
}
