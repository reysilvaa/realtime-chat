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
