import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
  name: string;
}

function createPhotosStore() {
  const loadPhotos = (): Photo[] => {
    if (!browser) return [];
    
    try {
      const stored = localStorage.getItem('camera_photos');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    return [];
  };

  const { subscribe, set, update } = writable<Photo[]>(loadPhotos());

  return {
    subscribe,
    addPhoto: (dataUrl: string) => {
      const photo: Photo = {
        id: `photo_${Date.now()}`,
        dataUrl,
        timestamp: Date.now(),
        name: `Photo ${new Date().toLocaleDateString()}`
      };
      
      update(photos => {
        const newPhotos = [photo, ...photos];
        
        // Save to localStorage
        if (browser) {
          try {
            localStorage.setItem('camera_photos', JSON.stringify(newPhotos));
          } catch (error) {
            console.error('Error saving photo:', error);
            // If storage is full, keep only last 10 photos
            const limited = newPhotos.slice(0, 10);
            localStorage.setItem('camera_photos', JSON.stringify(limited));
            return limited;
          }
        }
        
        return newPhotos;
      });
      
      return photo;
    },
    deletePhoto: (id: string) => {
      update(photos => {
        const newPhotos = photos.filter(p => p.id !== id);
        
        if (browser) {
          localStorage.setItem('camera_photos', JSON.stringify(newPhotos));
        }
        
        return newPhotos;
      });
    },
    clearAll: () => {
      set([]);
      if (browser) {
        localStorage.removeItem('camera_photos');
      }
    },
    loadFromStorage: () => {
      set(loadPhotos());
    }
  };
}

export const photos = createPhotosStore();
