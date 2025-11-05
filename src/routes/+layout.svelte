<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";
  import IPhoneFrame from "$lib/components/shared/iPhoneFrame.svelte";
  import Notification from "$lib/components/shared/Notification.svelte";
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
    registerServiceWorker();

    // Request notification permission after a short delay
    setTimeout(async () => {
      const { requestNotificationPermission } = await import("$lib/utils/pwa");
      const permission = await requestNotificationPermission();

      if (permission === "granted") {
        console.log("✅ Notification permission granted");
      } else if (permission === "denied") {
        console.log("❌ Notification permission denied");
      }
    }, 1000);
  });
</script>

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />
  <meta name="apple-mobile-web-app-title" content="iPhone" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="iPhone - Only Us" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
</svelte:head>

<IPhoneFrame>
  {@render children()}
</IPhoneFrame>

<Notification />
