import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (!browser) return 'light';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

// Create the store
function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme());
  
  return {
    subscribe,
    setTheme: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    },
    toggle: () => {
      update(current => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    },
    init: () => {
      const theme = getInitialTheme();
      if (browser) {
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();

// Theme color classes
export const themeColors = {
  // Backgrounds
  bgPrimary: 'bg-[var(--bg-primary)]',
  bgSecondary: 'bg-[var(--bg-secondary)]',
  bgTertiary: 'bg-[var(--bg-tertiary)]',
  
  // Text colors
  textPrimary: 'text-[var(--text-primary)]',
  textSecondary: 'text-[var(--text-secondary)]',
  textTertiary: 'text-[var(--text-tertiary)]',
  
  // Border colors
  borderPrimary: 'border-[var(--border-primary)]',
  borderSecondary: 'border-[var(--border-secondary)]',
  
  // Card colors
  cardBg: 'bg-[var(--card-bg)]',
  cardBorder: 'border-[var(--card-border)]',
  
  // Input colors
  inputBg: 'bg-[var(--input-bg)]',
  inputBorder: 'border-[var(--input-border)]',
  inputFocusBorder: 'focus:border-[var(--input-focus-border)]',
};
