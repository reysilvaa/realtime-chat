<script lang="ts">
  import { onMount } from "svelte";
  import { musicStore } from "$lib/stores/music";
  import { formatDuration, searchTracks } from "$lib/services/musicApi";
  import type { Track, RadioStation } from "$lib/services/musicApi";
  import YouTubePlayer from "./YouTubePlayer.svelte";

  let activeTab = $state<"tracks" | "radio">("tracks");
  let searchQuery = $state("");
  let searchResults = $state<Track[]>([]);
  let isSearching = $state(false);
  let searchTimeout: number;
  let youtubePlayerRef: any; // Component ref, doesn't need $state

  onMount(() => {
    musicStore.loadPopularTracks();
    musicStore.loadRadioStations();
  });

  async function handleSearch(query: string) {
    searchQuery = query;

    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);

    // Debounce search
    if (activeTab === "tracks" && query.length >= 2) {
      isSearching = true;
      searchTimeout = window.setTimeout(async () => {
        const results = await searchTracks(query);
        searchResults = results;
        isSearching = false;
      }, 500);
    } else if (query.length < 2) {
      searchResults = [];
      isSearching = false;
    }
  }

  async function handlePlayTrack(track: Track) {
    console.log("[MusicPlayer] Playing track:", track.name, "ID:", track.id);
    // Set track in store - this will remount the YouTubePlayer component due to {#key}
    musicStore.setCurrentTrack(track, "youtube");
    // Player will auto-play on mount with autoplay: 1
  }

  async function handlePlayRadio(station: RadioStation) {
    await musicStore.playRadio(station);
  }

  function handlePause() {
    if ($musicStore.playerType === "youtube" && youtubePlayerRef) {
      youtubePlayerRef.pause();
      musicStore.setPlayingState(false);
    } else if ($musicStore.playerType === "audio") {
      musicStore.pauseRadio();
    }
  }

  function handlePlay() {
    if ($musicStore.playerType === "youtube" && youtubePlayerRef) {
      youtubePlayerRef.play();
      musicStore.setPlayingState(true);
    } else if ($musicStore.playerType === "audio" && $musicStore.currentTrack) {
      musicStore.playRadio($musicStore.currentTrack as RadioStation);
    }
  }

  function handleSeek(e: Event) {
    const input = e.target as HTMLInputElement;
    const time = Number(input.value);

    if ($musicStore.playerType === "youtube" && youtubePlayerRef) {
      youtubePlayerRef.seekTo(time);
    } else if ($musicStore.playerType === "audio") {
      musicStore.seekRadio(time);
    }
  }

  function onYouTubeStateChange(state: number) {
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    musicStore.setPlayingState(state === 1);
  }

  function onYouTubeTimeUpdate(currentTime: number, duration: number) {
    musicStore.setTimeAndDuration(currentTime, duration);
  }

  const displayTracks = $derived(
    searchQuery.length >= 2 ? searchResults : $musicStore.tracks
  );

  const filteredStations = $derived(
    $musicStore.radioStations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="flex-1 flex flex-col pt-[107px] pb-32 bg-[var(--bg-primary)]">
  <!-- Tabs -->
  <div class="px-4 mb-4">
    <div class="flex gap-2 bg-white/10 rounded-[10px] p-1">
      <button
        onclick={() => {
          activeTab = "tracks";
          searchQuery = "";
          searchResults = [];
        }}
        class="flex-1 py-2 px-4 rounded-[8px] text-[15px] font-semibold transition-all {activeTab ===
        'tracks'
          ? 'bg-white text-black shadow-sm'
          : 'text-white/70'}"
      >
        Tracks
      </button>
      <button
        onclick={() => {
          activeTab = "radio";
          searchQuery = "";
          searchResults = [];
        }}
        class="flex-1 py-2 px-4 rounded-[8px] text-[15px] font-semibold transition-all {activeTab ===
        'radio'
          ? 'bg-white text-black shadow-sm'
          : 'text-white/70'}"
      >
        Radio
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="px-4 mb-4">
    <div class="relative bg-white/10 rounded-[10px] px-4 py-3">
      <i
        class="fas fa-search text-white/50 absolute left-4 top-1/2 -translate-y-1/2"
      ></i>
      <input
        type="text"
        value={searchQuery}
        oninput={(e) => handleSearch(e.currentTarget.value)}
        placeholder="Search {activeTab === 'tracks'
          ? 'tracks'
          : 'radio stations'}..."
        class="bg-transparent text-white pl-8 w-full outline-none placeholder:text-white/50"
      />
      {#if isSearching}
        <i
          class="fas fa-spinner fa-spin text-white/50 absolute right-4 top-1/2 -translate-y-1/2"
        ></i>
      {/if}
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-4">
    {#if $musicStore.loading}
      <div class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <i class="fas fa-spinner fa-spin text-white text-3xl"></i>
          <span class="text-white/70">Loading...</span>
        </div>
      </div>
    {:else if $musicStore.error}
      <div class="flex items-center justify-center py-20">
        <div class="text-center text-white/70">
          <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
          <p>{$musicStore.error}</p>
        </div>
      </div>
    {:else if activeTab === "tracks"}
      <!-- Tracks List -->
      {#if displayTracks.length === 0 && searchQuery.length >= 2}
        <div class="flex items-center justify-center py-20">
          <div class="text-center text-white/70">
            <i class="fas fa-search text-4xl mb-2"></i>
            <p>No tracks found for "{searchQuery}"</p>
          </div>
        </div>
      {:else if displayTracks.length === 0}
        <div class="flex items-center justify-center py-20">
          <div class="text-center text-white/70">
            <i class="fas fa-music text-4xl mb-2"></i>
            <p>No tracks available</p>
          </div>
        </div>
      {:else}
        <div class="space-y-2">
          {#each displayTracks as track}
            <button
              onclick={() => handlePlayTrack(track)}
              class="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-left"
            >
              <div
                class="relative w-14 h-14 rounded-[8px] overflow-hidden flex-shrink-0 bg-white/10"
              >
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <i class="fab fa-youtube text-red-500 text-2xl"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-semibold truncate text-[15px]">
                  {track.name}
                </div>
                <div class="text-white/60 text-[13px] truncate">
                  {track.artist}
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-white/50 text-[13px]">
                  {formatDuration(track.duration)}
                </span>
                <i class="fab fa-youtube text-red-500 text-sm"></i>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    {:else}
      <!-- Radio Stations List -->
      <div class="space-y-2">
        {#each filteredStations as station}
          <button
            onclick={() => handlePlayRadio(station)}
            class="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-left"
          >
            <div
              class="relative w-14 h-14 rounded-[8px] overflow-hidden flex-shrink-0 bg-white/10"
            >
              <img
                src={station.favicon}
                alt={station.name}
                class="w-full h-full object-cover"
                onerror={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target) target.src = "https://via.placeholder.com/100";
                }}
              />
              {#if $musicStore.currentTrack?.id === station.id && $musicStore.isPlaying}
                <div
                  class="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div
                    class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                  ></div>
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-white font-semibold truncate text-[15px]">
                {station.name}
              </div>
              <div class="text-white/60 text-[13px] truncate">
                {station.country}
              </div>
            </div>
            <i class="fas fa-broadcast-tower text-white/50 text-sm"></i>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- YouTube Player Component -->
{#if $musicStore.currentTrack && $musicStore.playerType === "youtube"}
  {#key $musicStore.currentTrack.id}
    <YouTubePlayer
      bind:this={youtubePlayerRef}
      track={$musicStore.currentTrack as Track | null}
      onStateChange={onYouTubeStateChange}
      onTimeUpdate={onYouTubeTimeUpdate}
    />
  {/key}
{/if}

<!-- Now Playing Bar (Fixed Bottom) -->
{#if $musicStore.currentTrack}
  <div
    class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-[40px] border-t border-white/10 z-50"
    style="backdrop-filter: saturate(180%) blur(40px);"
  >
    <!-- Progress Bar (for YouTube tracks) -->
    {#if $musicStore.playerType === "youtube" && $musicStore.duration > 0}
      <input
        type="range"
        min="0"
        max={$musicStore.duration}
        value={$musicStore.currentTime}
        oninput={handleSeek}
        class="w-full h-1 appearance-none bg-white/20 accent-white cursor-pointer"
        style="margin: 0;"
      />
    {/if}

    <div class="px-4 py-3 flex items-center gap-3">
      <!-- Album Art / Image -->
      <div
        class="w-12 h-12 rounded-[8px] overflow-hidden flex-shrink-0 bg-white/10"
      >
        <img
          src={"imageUrl" in $musicStore.currentTrack
            ? $musicStore.currentTrack.imageUrl
            : $musicStore.currentTrack.favicon}
          alt=""
          class="w-full h-full object-cover"
          onerror={(e) => {
            const target = e.target as HTMLImageElement;
            if (target) target.src = "https://via.placeholder.com/100";
          }}
        />
      </div>

      <!-- Track/Station Info -->
      <div class="flex-1 min-w-0">
        <div class="text-white font-semibold text-[14px] truncate">
          {$musicStore.currentTrack.name}
        </div>
        <div class="text-white/60 text-[12px] truncate">
          {"artist" in $musicStore.currentTrack
            ? $musicStore.currentTrack.artist
            : $musicStore.currentTrack.country}
        </div>
      </div>

      <!-- Time Display (for YouTube) -->
      {#if $musicStore.playerType === "youtube" && $musicStore.duration > 0}
        <div class="text-white/50 text-[12px] flex-shrink-0">
          {formatDuration(Math.floor($musicStore.currentTime))} / {formatDuration(
            Math.floor($musicStore.duration)
          )}
        </div>
      {/if}

      <!-- Play/Pause Button -->
      <button
        onclick={() => ($musicStore.isPlaying ? handlePause() : handlePlay())}
        class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition-transform"
      >
        {#if $musicStore.isPlaying}
          <i class="fas fa-pause text-lg"></i>
        {:else}
          <i class="fas fa-play text-lg ml-0.5"></i>
        {/if}
      </button>
    </div>
  </div>
{/if}

<style>
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 0;
    height: 0;
  }

  input[type="range"]::-moz-range-thumb {
    width: 0;
    height: 0;
    border: none;
    background: transparent;
  }
</style>
