<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';
  import IPhoneFrame from '$lib/components/shared/iPhoneFrame.svelte';
  import Notification from '$lib/components/shared/Notification.svelte';
  import { theme } from '$lib/stores/theme';
  
  let { children }: { children: Snippet } = $props();
  
  import '../app.css';
  
  let isHomePage = $derived($page.url.pathname === '/');
  
  // Initialize theme on mount
  $effect(() => {
    theme.init();
  });
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#000000">
</svelte:head>

<IPhoneFrame>
  {@render children()}
</IPhoneFrame>

<Notification />
