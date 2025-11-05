<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";
  import IPhoneFrame from "$lib/components/shared/iPhoneFrame.svelte";
  import Notification from "$lib/components/shared/Notification.svelte";
  import PWAInstallPrompt from "$lib/components/shared/PWAInstallPrompt.svelte";
  import { theme } from "$lib/stores/theme";
  import { registerServiceWorker } from "$lib/utils/pwa";

  let { children }: { children: Snippet } = $props();

  import "../app.css";

  let isHomePage = $derived($page.url.pathname === "/");

  // Initialize theme on mount
  $effect(() => {
    theme.init();
  });

  // Register PWA service worker and request notification permission
  onMount(async () => {
    // vite-plugin-pwa akan auto-register service worker
    // Kita hanya perlu setup handlers
    registerServiceWorker();

    // Hide system UI bars
    if (typeof window !== "undefined") {
      // Hide Android navigation bar
      if ("navigator" in window && "standalone" in navigator) {
        // Already in standalone mode
      } else {
        // Try to enter fullscreen/immersive mode
        try {
          const doc = document.documentElement as any;
          if (doc.requestFullscreen) {
            // Fullscreen API available but don't auto-request (requires user gesture)
          }
        } catch (e) {
          console.log("Fullscreen not available");
        }
      }

      // Prevent default browser UI
      document.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      // Prevent pull to refresh
      let lastTouchY = 0;
      document.addEventListener(
        "touchmove",
        (e) => {
          const touchY = e.touches[0].clientY;
          if (touchY > lastTouchY && window.scrollY === 0) {
            e.preventDefault();
          }
          lastTouchY = touchY;
        },
        { passive: false }
      );

      // Hide address bar on mobile
      const hideAddressBar = () => {
        setTimeout(() => {
          window.scrollTo(0, 1);
          // Force hide on Android
          if (window.navigator.userAgent.includes("Android")) {
            const metaViewport = document.querySelector(
              'meta[name="viewport"]'
            );
            if (metaViewport) {
              metaViewport.setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui"
              );
            }
          }
        }, 100);
      };

      window.addEventListener("load", hideAddressBar);
      window.addEventListener("orientationchange", () => {
        setTimeout(hideAddressBar, 500);
      });

      // Prevent Android navigation bar from showing
      if (window.navigator.userAgent.includes("Android")) {
        // Add minimal-ui to viewport on Android
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
          let content = metaViewport.getAttribute("content") || "";
          if (!content.includes("minimal-ui")) {
            metaViewport.setAttribute("content", content + ", minimal-ui");
          }
        }
      }
    }

    // Request notification permission after a short delay
    setTimeout(async () => {
      const { requestNotificationPermission } = await import("$lib/utils/pwa");

      // Check current permission first
      if (typeof window !== "undefined" && "Notification" in window) {
        const NotificationAPI = window.Notification;
        console.log(
          "📱 Current notification permission:",
          NotificationAPI.permission
        );

        if (NotificationAPI.permission === "default") {
          // Only request if permission is not yet set
          const permission = await requestNotificationPermission();

          if (permission === "granted") {
            console.log("✅ Notification permission granted");
          } else if (permission === "denied") {
            console.log("❌ Notification permission denied");
          } else {
            console.log("⚠️ Notification permission:", permission);
          }
        } else {
          console.log(
            "📱 Notification permission already set to:",
            NotificationAPI.permission
          );
        }
      }
    }, 1000);
  });
</script>

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui"
  />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />
  <meta name="apple-mobile-web-app-title" content="iPhone" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="iPhone - Only Us" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <style>
    /* Hide system UI bars globally */
    html,
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    /* Hide system UI bars on mobile */
    @media screen and (max-width: 768px) {
      /* Hide Android navigation bar */
      html {
        height: 100%;
        height: -webkit-fill-available;
        position: fixed;
        width: 100%;
        overflow: hidden;
      }

      body {
        height: 100%;
        height: -webkit-fill-available;
        position: fixed;
        width: 100%;
        overflow: hidden;
        /* Remove any default padding/margin */
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Hide status bar area */
      ::-webkit-scrollbar {
        display: none;
      }

      /* Prevent system UI overlays */
      * {
        -webkit-tap-highlight-color: transparent;
      }
    }

    /* Fullscreen mode for PWA */
    @media (display-mode: standalone) {
      html {
        height: 100%;
        height: -webkit-fill-available;
      }

      body {
        padding-top: env(safe-area-inset-top, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        padding-left: env(safe-area-inset-left, 0px);
        padding-right: env(safe-area-inset-right, 0px);
      }
    }

    /* iOS Safari fullscreen */
    @supports (-webkit-touch-callout: none) {
      @media screen and (max-width: 768px) {
        html {
          height: 100%;
          height: -webkit-fill-available;
        }

        body {
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      }
    }
  </style>
</svelte:head>

<IPhoneFrame>
  {@render children()}
</IPhoneFrame>

<Notification />
<PWAInstallPrompt />
