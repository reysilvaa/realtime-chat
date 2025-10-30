<script lang="ts">
  import { detectUser } from "$lib/utils/userDetection";
  import DevSelector from "$lib/components/shared/DevSelector.svelte";
  import AppleMusicPlayer from "$lib/components/music/AppleMusicPlayer.svelte";

  detectUser();
</script>

<svelte:head>
  <title>Music - ReyNisa</title>
</svelte:head>

<AppleMusicPlayer />
<DevSelector />
