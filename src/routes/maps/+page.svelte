<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import Map from '$lib/components/maps/Map.svelte';
  
  detectUser();
</script>

<svelte:head>
  <title>Maps - ReyNisa</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-white">
  <Header title="Maps" backLink="/" />
  
  <Map />
  
  <DevSelector />
</div>
