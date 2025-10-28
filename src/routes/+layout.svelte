<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';
  import IPhoneFrame from '$lib/components/shared/iPhoneFrame.svelte';
  import Notification from '$lib/components/shared/Notification.svelte';
  
  let { children }: { children: Snippet } = $props();
  
  import '$lib/styles/base.css';
  import '$lib/styles/header.css';
  import '$lib/styles/buttons.css';
  import '$lib/styles/notification.css';
  import '$lib/styles/animations.css';
  import '$lib/styles/landing.css';
  import '$lib/styles/chat.css';
  import '$lib/styles/form.css';
  import '$lib/styles/letter.css';
  import '$lib/styles/history.css';
  import '$lib/styles/responsive.css';
  
  let isHomePage = $derived($page.url.pathname === '/');
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
