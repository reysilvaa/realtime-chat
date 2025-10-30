<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Track } from "$lib/services/musicApi";

  interface Props {
    track: Track | null;
    onReady?: () => void;
    onStateChange?: (state: number) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
  }

  let { track, onReady, onStateChange, onTimeUpdate }: Props = $props();

  let playerElement: HTMLDivElement;
  let player: any = null;
  let isPlayerReady = false;
  let updateInterval: number;
  let currentVideoId: string | null = null;

  function extractVideoId(track: Track | null): string | null {
    if (!track) return null;

    // Try to extract from youtubeUrl
    if (track.youtubeUrl) {
      const match = track.youtubeUrl.match(/[?&]v=([^&]+)/);
      if (match) return match[1];
    }

    // Fallback to track.id
    return track.id;
  }

  function loadYouTubeAPI() {
    return new Promise<void>((resolve) => {
      // Check if API already loaded
      if ((window as any).YT && (window as any).YT.Player) {
        resolve();
        return;
      }

      // Load the IFrame Player API code asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // API will call this function when ready
      (window as any).onYouTubeIframeAPIReady = () => {
        resolve();
      };
    });
  }

  function createPlayer(videoId: string) {
    if (!playerElement) return;

    currentVideoId = videoId;
    console.log("[YouTubePlayer] Creating player with video ID:", videoId);

    player = new (window as any).YT.Player(playerElement, {
      height: "0",
      width: "0",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          isPlayerReady = true;
          console.log("[YouTubePlayer] Player ready");
          onReady?.();

          // Start time update interval
          updateInterval = window.setInterval(() => {
            if (player && player.getCurrentTime && player.getDuration) {
              const currentTime = player.getCurrentTime();
              const duration = player.getDuration();
              onTimeUpdate?.(currentTime, duration);
            }
          }, 1000);
        },
        onStateChange: (event: any) => {
          onStateChange?.(event.data);
        },
      },
    });
  }

  onMount(async () => {
    await loadYouTubeAPI();

    const videoId = extractVideoId(track);
    if (videoId) {
      createPlayer(videoId);
    }
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    if (player && player.destroy) {
      player.destroy();
    }
  });

  // Watch for track changes
  $effect(() => {
    console.log(
      "[YouTubePlayer] Effect triggered - player:",
      !!player,
      "ready:",
      isPlayerReady,
      "track:",
      track?.name
    );

    if (!player || !isPlayerReady || !track) {
      console.log("[YouTubePlayer] Skipping - not ready");
      return;
    }

    const videoId = extractVideoId(track);
    console.log(
      "[YouTubePlayer] Current videoId:",
      currentVideoId,
      "New videoId:",
      videoId
    );

    // Only load if video ID changed
    if (videoId && videoId !== currentVideoId) {
      console.log(
        "[YouTubePlayer] Loading new video:",
        videoId,
        "previous:",
        currentVideoId
      );
      currentVideoId = videoId;

      // Stop current video first
      if (player.stopVideo) {
        console.log("[YouTubePlayer] Stopping current video");
        player.stopVideo();
      }

      // Load and play new video
      if (player.loadVideoById) {
        console.log("[YouTubePlayer] Loading video by ID:", videoId);
        player.loadVideoById({
          videoId: videoId,
          startSeconds: 0,
        });
      }
    } else {
      console.log("[YouTubePlayer] Video ID unchanged, not loading");
    }
  });

  // Export player controls
  export function play() {
    if (player && player.playVideo) {
      player.playVideo();
    }
  }

  export function pause() {
    if (player && player.pauseVideo) {
      player.pauseVideo();
    }
  }

  export function seekTo(seconds: number) {
    if (player && player.seekTo) {
      player.seekTo(seconds, true);
    }
  }

  export function getPlayerState(): number {
    if (player && player.getPlayerState) {
      return player.getPlayerState();
    }
    return -1;
  }
</script>

<!-- Hidden YouTube player -->
<div bind:this={playerElement} class="absolute -top-[9999px] left-0"></div>
