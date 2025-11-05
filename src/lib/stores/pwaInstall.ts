import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { BeforeInstallPromptEvent } from '$lib/types';

export const installPrompt = writable<BeforeInstallPromptEvent | null>(null);
export const isInstalled = writable<boolean>(false);
export const isStandalone = writable<boolean>(false);
export const isIOS = writable<boolean>(false);
export const isIOSStandalone = writable<boolean>(false);

if (browser) {
  // Detect iOS
  const checkIOS = () => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isIOSStandaloneMode = (window.navigator as any).standalone === true;
    
    isIOS.set(isIOSDevice);
    isIOSStandalone.set(isIOSStandaloneMode);
    
    if (isIOSDevice && isIOSStandaloneMode) {
      isInstalled.set(true);
      isStandalone.set(true);
    }
  };
  
  checkIOS();
  
  // Check if app is already installed (standalone mode)
  const checkStandalone = () => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    isStandalone.set(standalone);
    
    if (standalone) {
      isInstalled.set(true);
    }
  };
  
  checkStandalone();
  
  // Also check after a delay to ensure everything is loaded
  setTimeout(() => {
    checkIOS();
    checkStandalone();
  }, 1000);

  // Listen for beforeinstallprompt event (Android/Chrome)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt.set(e as BeforeInstallPromptEvent);
    console.log('✅ PWA install prompt available (Android/Chrome)');
  });

  // Check if app is installed after load
  window.addEventListener('appinstalled', () => {
    isInstalled.set(true);
    isStandalone.set(true);
    installPrompt.set(null);
    console.log('✅ PWA installed successfully');
  });
}

