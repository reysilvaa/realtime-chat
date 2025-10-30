<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import MusicPlayer from '$lib/components/music/MusicPlayer.svelte';
  
  detectUser();
</script>

<svelte:head>
  <title>Music - ReyNisa</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-gradient-to-b from-[#FF375F] via-[#FF2D55] to-[#D1093D]">
  <Header title="Music" backLink="/" />
  
  <MusicPlayer />
  
  <DevSelector />
</div>
