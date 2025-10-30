import { writable } from 'svelte/store';
import type { EmojiData, EmojiCategory } from '$lib/services/emojiApi';
import { fetchEmojis, fetchCategories, groupEmojisByCategory } from '$lib/services/emojiApi';
import { getItem, setItem, STORAGE_KEYS } from '$lib/utils/localStorage';

interface EmojiState {
  allEmojis: EmojiData[];
  categories: EmojiCategory[];
  groupedEmojis: Map<string, EmojiData[]>;
  loading: boolean;
  error: string | null;
}

interface StoredEmojiData {
  allEmojis: EmojiData[];
  categories: EmojiCategory[];
  groupedEmojisArray: [string, EmojiData[]][];
}

function createEmojiStore() {
  const { subscribe, set, update } = writable<EmojiState>({
    allEmojis: [],
    categories: [],
    groupedEmojis: new Map(),
    loading: false,
    error: null
  });

  return {
    subscribe,
    async loadEmojis(forceRefresh: boolean = false) {
      // Try to load from localStorage first
      if (!forceRefresh) {
        const cached = getItem<StoredEmojiData>(STORAGE_KEYS.EMOJIS);
        if (cached && cached.allEmojis.length > 0) {
          console.log('✅ Using cached emojis from localStorage');
          const groupedEmojis = new Map(cached.groupedEmojisArray);
          
          set({
            allEmojis: cached.allEmojis,
            categories: cached.categories,
            groupedEmojis,
            loading: false,
            error: null
          });
          return;
        }
      }

      console.log('🔄 Fetching emojis from API...');
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const [allEmojis, categories] = await Promise.all([
          fetchEmojis(),
          fetchCategories()
        ]);
        
        const groupedEmojis = groupEmojisByCategory(allEmojis);
        
        // Store to localStorage (convert Map to array for storage)
        const toStore: StoredEmojiData = {
          allEmojis,
          categories,
          groupedEmojisArray: Array.from(groupedEmojis.entries())
        };
        setItem(STORAGE_KEYS.EMOJIS, toStore, { expiresIn: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        
        update(state => ({
          ...state,
          allEmojis,
          categories,
          groupedEmojis,
          loading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load emojis'
        }));
      }
    },
    refresh: function() {
      return this.loadEmojis(true);
    }
  };
}

export const emojiStore = createEmojiStore();
