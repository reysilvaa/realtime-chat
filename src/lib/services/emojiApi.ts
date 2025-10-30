import { EMOJI_API } from '$lib/config';

export interface EmojiData {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
}

export interface EmojiCategory {
  slug: string;
  subCategories: string[];
}

export async function fetchCategories(): Promise<EmojiCategory[]> {
  try {
    const response = await fetch(`${EMOJI_API.categoriesUrl}?access_key=${EMOJI_API.accessKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchEmojis(): Promise<EmojiData[]> {
  try {
    const response = await fetch(`${EMOJI_API.baseUrl}?access_key=${EMOJI_API.accessKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch emojis: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching emojis:', error);
    return [];
  }
}

export async function fetchEmojisByCategory(categorySlug: string): Promise<EmojiData[]> {
  try {
    const response = await fetch(`${EMOJI_API.categoriesUrl}/${categorySlug}?access_key=${EMOJI_API.accessKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch emojis for category ${categorySlug}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching emojis for category ${categorySlug}:`, error);
    return [];
  }
}

export function formatCategoryName(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function groupEmojisByCategory(emojis: EmojiData[]): Map<string, EmojiData[]> {
  const grouped = new Map<string, EmojiData[]>();
  
  emojis.forEach(emoji => {
    const category = emoji.group;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)?.push(emoji);
  });
  
  return grouped;
}
