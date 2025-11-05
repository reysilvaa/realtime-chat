import { browser } from '$app/environment';

export function registerServiceWorker() {
  if (!browser || !('serviceWorker' in navigator)) return;

  // Wait for page load
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      registerSW();
    });
  } else {
    registerSW();
  }
}

function registerSW() {
  if (!browser || !('serviceWorker' in navigator)) {
    console.log('⚠️ Service Worker not supported');
    return;
  }

  // vite-plugin-pwa dengan registerType: 'autoUpdate' akan auto-register service worker
  // Kita hanya perlu menunggu service worker ready dan setup notification handlers
  const setupServiceWorker = (registration: ServiceWorkerRegistration) => {
    console.log('✅ Service Worker ready:', registration);
    
    // Setup notification click handler via message event
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notificationclick') {
          const notificationData = event.data.data;
          if (notificationData && notificationData.url) {
            window.location.href = notificationData.url;
          }
        }
      });
    }
    
    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('🔄 New content available, please refresh');
            // You can show a notification to user here
            if (confirm('Update tersedia! Refresh halaman untuk mendapatkan versi terbaru?')) {
              window.location.reload();
            }
          }
        });
      }
    });
  };

  // Check if service worker is already registered
  if (navigator.serviceWorker.controller) {
    // Service worker already active
    navigator.serviceWorker.ready.then(setupServiceWorker).catch((error) => {
      console.error('❌ Service Worker ready error:', error);
    });
  } else {
    // Wait for service worker to be registered (by vite-plugin-pwa)
    // Polling check setiap 500ms untuk maksimal 10 detik
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = setInterval(() => {
      attempts++;
      if (navigator.serviceWorker.controller || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(setupServiceWorker).catch((error) => {
            console.error('❌ Service Worker ready error:', error);
          });
        } else {
          console.log('⚠️ Service Worker not registered yet (this is normal if vite-plugin-pwa is still loading)');
        }
      }
    }, 500);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!browser || !('Notification' in window)) {
    console.log('❌ Notifications not supported in this environment');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    console.log('✅ Notification permission already granted');
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    console.log('❌ Notification permission denied');
    return 'denied';
  }

  console.log('📱 Requesting notification permission...');
  const permission = await Notification.requestPermission();
  console.log('📱 Permission result:', permission);
  return permission;
}

export async function showNotification(title: string, options?: NotificationOptions) {
  if (!browser) {
    console.log('❌ Not in browser environment');
    return;
  }

  // Check permission first
  if (!('Notification' in window)) {
    console.log('❌ Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.log('❌ Notification permission not granted. Current permission:', Notification.permission);
    return;
  }

  console.log('✅ Permission granted, showing notification:', title);

  // Check if service worker is available
  if (!('serviceWorker' in navigator)) {
    console.log('⚠️ Service Worker not available, using browser notification');
    // Fallback to browser notification if service worker not available
    try {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });
      console.log('✅ Browser notification shown');
      return;
    } catch (error) {
      console.error('❌ Error showing browser notification:', error);
      return;
    }
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker ready');
    
    const notificationOptions: any = {
      badge: '/pwa-192x192.png',
      icon: '/pwa-192x192.png',
      tag: options?.tag || 'default',
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
      ...options
    };
    
    await registration.showNotification(title, notificationOptions);
    console.log('✅ Service Worker notification shown');
  } catch (error) {
    console.error('❌ Error showing service worker notification:', error);
    // Fallback to browser notification
    try {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });
      console.log('✅ Fallback browser notification shown');
    } catch (fallbackError) {
      console.error('❌ Error showing fallback notification:', fallbackError);
    }
  }
}

export async function showMessageNotification(senderName: string, message: string) {
  // Truncate long messages
  const truncatedMessage = message.length > 50 ? message.substring(0, 50) + '...' : message;
  
  const notificationOptions: any = {
    tag: `message-${senderName}`,
    body: truncatedMessage,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {
      url: '/chat',
      sender: senderName,
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Buka Chat'
      }
    ],
    renotify: true
  };
  
  await showNotification(`${senderName}`, notificationOptions);
}

