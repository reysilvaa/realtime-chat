<script lang="ts" let:theme>
  import { onMount } from "svelte";
  import { musicStore } from "$lib/stores/music";
  import {
    formatDuration,
    getLyrics,
    searchTracks,
  } from "$lib/services/musicApi";
  import type { Track, RadioStation, Lyrics } from "$lib/services/musicApi";
  import YouTubePlayer from "./YouTubePlayer.svelte";
  import SwipeNavigation from "$lib/components/shared/SwipeNavigation.svelte";
  import { theme } from "$lib/stores/theme";

  let activeView = $state<"player" | "lyrics">("player");
  let searchQuery = $state("");
  let searchResults = $state<Track[]>([]);
  let isSearching = $state(false);
  let searchTimeout: number;
  let youtubePlayerRef: any;
  let lyrics = $state<Lyrics | null>(null);
  let isLoadingLyrics = $state(false);
  let showFullPlayer = $state(false);

  onMount(() => {
    musicStore.loadPopularTracks();
    musicStore.loadRadioStations();
  });

  async function handleSearch(query: string) {
    searchQuery = query;
    if (searchTimeout) clearTimeout(searchTimeout);

    if (query.length >= 2) {
      isSearching = true;
      searchTimeout = window.setTimeout(async () => {
        const results = await searchTracks(query);
        searchResults = results;
        isSearching = false;
      }, 500);
    } else {
      searchResults = [];
      isSearching = false;
    }
  }

  async function handlePlayTrack(track: Track) {
    console.log(
      "[AppleMusicPlayer] Playing track:",
      track.name,
      "ID:",
      track.id
    );
    musicStore.setCurrentTrack(track, "youtube");
    showFullPlayer = true;
    activeView = "player";

    // Load lyrics
    await loadLyrics(track.id);
  }

  async function loadLyrics(videoId: string) {
    isLoadingLyrics = true;
    lyrics = null;
    try {
      const lyricsData = await getLyrics(videoId);
      lyrics = lyricsData;
    } catch (error) {
      console.error("Failed to load lyrics:", error);
    } finally {
      isLoadingLyrics = false;
    }
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
    musicStore.setPlayingState(state === 1);
  }

  function onYouTubeTimeUpdate(currentTime: number, duration: number) {
    musicStore.setTimeAndDuration(currentTime, duration);
  }

  function toggleFullPlayer() {
    showFullPlayer = !showFullPlayer;
  }

  const currentTrack = $derived($musicStore.currentTrack as Track | null);
</script>

<!-- Swipe Navigation -->
<SwipeNavigation backLink="/" />

<!-- Main Container with Theme Support -->
<div
  class="min-h-screen flex flex-col"
  class:bg-gradient-to-b={$theme === "light"}
  class:from-[#FF375F]={$theme === "light"}
  class:via-[#FF2D55]={$theme === "light"}
  class:to-[#D1093D]={$theme === "light"}
  class:bg-black={$theme === "dark"}
  style="padding-top: 60px;"
>
  <!-- Search Bar -->
  <div class="px-4 py-3">
    <div class="relative">
      <i
        class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm {$theme ===
        'light'
          ? 'text-white/50'
          : 'text-white/60'}"
      ></i>
      <input
        type="text"
        bind:value={searchQuery}
        oninput={(e) => handleSearch(e.currentTarget.value)}
        placeholder="Search songs..."
        class="w-full backdrop-blur-xl text-white pl-10 pr-4 py-3 rounded-ios border outline-none transition-all {$theme ===
        'light'
          ? 'bg-white/15 border-white/20 placeholder:text-white/50 focus:border-white/40 focus:bg-white/20'
          : 'bg-white/10 border-white/10 placeholder:text-white/40 focus:border-white/20 focus:bg-white/15'}"
      />
      {#if isSearching}
        <i
          class="fas fa-spinner fa-spin absolute right-4 top-1/2 -translate-y-1/2 {$theme ===
          'light'
            ? 'text-white/50'
            : 'text-white/60'}"
        ></i>
      {/if}
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto pb-32">
    {#if searchResults.length > 0}
      <!-- Search Results -->
      <div class="px-4 py-4">
        <h2 class="text-white font-bold text-xl mb-4">Search Results</h2>
        <div class="space-y-2">
          {#each searchResults as track}
            <button
              onclick={() => handlePlayTrack(track)}
              class="w-full flex items-center gap-3 p-3 rounded-ios bg-white/10 backdrop-blur-md hover:bg-white/15 active:scale-[0.98] transition-all text-left border border-white/10"
            >
              <img
                src={track.imageUrl}
                alt={track.name}
                class="w-14 h-14 rounded-[11px] object-cover flex-shrink-0 shadow-lg"
              />
              <div class="flex-1 min-w-0">
                <div class="text-white font-semibold truncate text-[15px]">
                  {track.name}
                </div>
                <div class="text-white/70 text-sm truncate">{track.artist}</div>
              </div>
              <i class="fab fa-youtube text-red-500 text-lg flex-shrink-0"></i>
            </button>
          {/each}
        </div>
      </div>
    {:else if $musicStore.loading}
      <div class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <i class="fas fa-spinner fa-spin text-white text-3xl"></i>
          <span class="text-white/70">Loading...</span>
        </div>
      </div>
    {:else if $musicStore.tracks.length > 0}
      <!-- Popular Tracks -->
      <div class="px-4 py-4">
        <h2
          class="text-white font-bold text-2xl mb-4"
          style="letter-spacing: -0.5px;"
        >
          Popular Tracks
        </h2>
        <div class="space-y-2">
          {#each $musicStore.tracks as track}
            <button
              onclick={() => handlePlayTrack(track)}
              class="w-full flex items-center gap-3 p-3 rounded-ios bg-white/10 backdrop-blur-md hover:bg-white/15 active:scale-[0.98] transition-all text-left group border border-white/10"
            >
              <div class="relative w-14 h-14 flex-shrink-0">
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  class="w-full h-full rounded-[11px] object-cover shadow-lg"
                />
                <div
                  class="absolute inset-0 bg-black/40 rounded-[11px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i class="fas fa-play text-white text-xl"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-semibold truncate text-[15px]">
                  {track.name}
                </div>
                <div class="text-white/70 text-sm truncate">{track.artist}</div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-white/60 text-sm"
                  >{formatDuration(track.duration)}</span
                >
                <i class="fab fa-youtube text-red-500"></i>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Full Screen Player Overlay -->
  {#if currentTrack && showFullPlayer}
    <div
      class="fixed inset-0 z-50 bg-gradient-to-b from-purple-900/95 via-black to-black backdrop-blur-2xl overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-10 px-4 py-4 flex items-center justify-between bg-black/30 backdrop-blur-xl border-b border-white/10"
      >
        <button
          onclick={toggleFullPlayer}
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Minimize player"
        >
          <i class="fas fa-chevron-down text-white text-xl"></i>
        </button>

        <div class="flex gap-2">
          <button
            onclick={() => (activeView = "player")}
            class="px-4 py-2 rounded-full text-sm font-semibold transition-all {activeView ===
            'player'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'}"
          >
            Player
          </button>
          <button
            onclick={() => (activeView = "lyrics")}
            class="px-4 py-2 rounded-full text-sm font-semibold transition-all {activeView ===
            'lyrics'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'}"
          >
            Lyrics
          </button>
        </div>

        <button
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
          aria-label="More options"
        >
          <i class="fas fa-ellipsis-h text-white text-xl"></i>
        </button>
      </div>

      <div class="px-6 pb-8">
        {#if activeView === "player"}
          <!-- Album Art -->
          <div class="mt-12 mb-8">
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.name}
              class="w-full max-w-[360px] mx-auto aspect-square object-cover rounded-ios-lg shadow-2xl"
            />
          </div>

          <!-- Track Info -->
          <div class="text-center mb-8">
            <h1
              class="text-white text-2xl font-bold mb-2"
              style="letter-spacing: -0.5px;"
            >
              {currentTrack.name}
            </h1>
            <p class="text-white/70 text-lg">{currentTrack.artist}</p>
            {#if currentTrack.album}
              <p class="text-white/50 text-sm mt-1">{currentTrack.album}</p>
            {/if}
          </div>

          <!-- Progress Bar -->
          <div class="mb-8">
            <input
              type="range"
              min="0"
              max={$musicStore.duration || 100}
              value={$musicStore.currentTime}
              oninput={handleSeek}
              class="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer ios-slider"
              style="--progress: {($musicStore.currentTime /
                ($musicStore.duration || 1)) *
                100}%"
            />
            <div class="flex justify-between text-white/50 text-xs mt-2">
              <span>{formatDuration(Math.floor($musicStore.currentTime))}</span>
              <span>{formatDuration(Math.floor($musicStore.duration))}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-center gap-6 mb-8">
            <button
              class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Shuffle"
            >
              <i class="fas fa-random text-white/70 text-lg"></i>
            </button>

            <button
              class="w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Previous"
            >
              <i class="fas fa-backward text-white text-2xl"></i>
            </button>

            <button
              onclick={() =>
                $musicStore.isPlaying ? handlePause() : handlePlay()}
              class="w-20 h-20 flex items-center justify-center rounded-full bg-white hover:scale-105 active:scale-95 transition-all shadow-2xl"
              aria-label={$musicStore.isPlaying ? "Pause" : "Play"}
            >
              {#if $musicStore.isPlaying}
                <i class="fas fa-pause text-black text-2xl"></i>
              {:else}
                <i class="fas fa-play text-black text-2xl ml-1"></i>
              {/if}
            </button>

            <button
              class="w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Next"
            >
              <i class="fas fa-forward text-white text-2xl"></i>
            </button>

            <button
              class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Repeat"
            >
              <i class="fas fa-redo text-white/70 text-lg"></i>
            </button>
          </div>

          <!-- Volume & Additional Controls -->
          <div class="flex items-center justify-between px-4">
            <button
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Volume"
            >
              <i class="fas fa-volume-up text-white/70"></i>
            </button>

            <button
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Like"
            >
              <i class="fas fa-heart text-white/70"></i>
            </button>
          </div>
        {:else if activeView === "lyrics"}
          <!-- Lyrics View -->
          <div class="max-w-2xl mx-auto py-8">
            {#if isLoadingLyrics}
              <div class="flex flex-col items-center justify-center py-20">
                <i class="fas fa-spinner fa-spin text-white text-3xl mb-4"></i>
                <p class="text-white/70">Loading lyrics...</p>
              </div>
            {:else if lyrics}
              <div class="space-y-4">
                {#each lyrics.lyrics.split("\n") as line}
                  {#if line.trim()}
                    <p
                      class="text-white/90 text-lg leading-relaxed text-center"
                      style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;"
                    >
                      {line}
                    </p>
                  {:else}
                    <div class="h-4"></div>
                  {/if}
                {/each}
              </div>
              <p class="text-white/40 text-sm text-center mt-8">
                Source: {lyrics.source}
              </p>
            {:else}
              <div class="flex flex-col items-center justify-center py-20">
                <i class="fas fa-music text-white/30 text-4xl mb-4"></i>
                <p class="text-white/70 text-center">
                  Lyrics not available for this track
                </p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Mini Player (Bottom Bar) -->
  {#if currentTrack && !showFullPlayer}
    <div
      class="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-white/10"
    >
      <!-- Progress Bar -->
      <div class="h-1 bg-white/10">
        <div
          class="h-full bg-white transition-all duration-300"
          style="width: {($musicStore.currentTime / $musicStore.duration) *
            100}%"
        ></div>
      </div>

      <!-- Player Content -->
      <div class="w-full px-4 py-3 flex items-center gap-3">
        <button
          onclick={toggleFullPlayer}
          class="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 active:scale-[0.98] transition-all"
        >
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.name}
            class="w-12 h-12 rounded-[11px] object-cover flex-shrink-0 shadow-lg"
          />
          <div class="flex-1 min-w-0 text-left">
            <div class="text-white font-semibold text-sm truncate">
              {currentTrack.name}
            </div>
            <div class="text-white/60 text-xs truncate">
              {currentTrack.artist}
            </div>
          </div>
        </button>
        <button
          onclick={() => ($musicStore.isPlaying ? handlePause() : handlePlay())}
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          aria-label={$musicStore.isPlaying ? "Pause" : "Play"}
        >
          {#if $musicStore.isPlaying}
            <i class="fas fa-pause text-black"></i>
          {:else}
            <i class="fas fa-play text-black ml-0.5"></i>
          {/if}
        </button>
      </div>
    </div>
  {/if}
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

<style>
  /* iOS Style Progress Slider */
  .ios-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ios-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .ios-slider::-webkit-slider-thumb:active {
    transform: scale(1);
  }

  .ios-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ios-slider::-moz-range-thumb:hover {
    transform: scale(1.2);
  }

  /* Track fill color */
  .ios-slider::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      white var(--progress, 0%),
      rgba(255, 255, 255, 0.2) var(--progress, 0%)
    );
    height: 4px;
    border-radius: 2px;
  }

  .ios-slider::-moz-range-track {
    background: rgba(255, 255, 255, 0.2);
    height: 4px;
    border-radius: 2px;
  }

  .ios-slider::-moz-range-progress {
    background: white;
    height: 4px;
    border-radius: 2px;
  }
</style>
