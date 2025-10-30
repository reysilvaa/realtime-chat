<script lang="ts">
  import { onMount } from 'svelte';
  import { detectUser } from "$lib/utils/userDetection";
  import type { User } from "$lib/types";
  import { stats, loadStats } from "$lib/stores/stats";
  import { logDevInfo } from "$lib/utils/devTools";
  import DevSelector from "$lib/components/shared/DevSelector.svelte";
  import ControlCenter from "$lib/components/shared/ControlCenter.svelte";
  import { weather } from '$lib/stores/weather';

  let user = $state<User | null>(detectUser());
  let statsData = $stats;
  let showControlCenter = $state(false);
  let currentPage = $state(0);
  let touchStartX = $state(0);
  let touchEndX = $state(0);
  let isDragging = $state(false);
  let translateX = $state(0);

  // Haptic button drag
  let buttonY = $state(60);
  let buttonX = $state("right");
  let isDraggingButton = $state(false);
  let dragStartX = $state(0);
  let dragStartY = $state(0);
  let dragOffsetX = $state(0);
  let dragOffsetY = $state(0);

  const totalPages = 2;

  // Current date for calendar
  const today = new Date();
  const currentMonth = "APRIL";
  const daysInMonth = [
    ["", "", "", "", 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30],
  ];

  $effect(() => {
    if (!user) return;
    logDevInfo(user);
    loadStats(user.userName);
  });

  onMount(() => {
    weather.loadWeather();
  });

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchEndX = e.touches[0].clientX;
    isDragging = false; // Don't set to true immediately
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX = e.touches[0].clientX;
    const diff = Math.abs(touchEndX - touchStartX);

    // Only start dragging if movement is significant (more than 10px)
    if (diff > 10) {
      isDragging = true;
    }

    if (!isDragging) return;

    const horizontalDiff = touchEndX - touchStartX;
    translateX =
      -currentPage * 100 + (horizontalDiff / window.innerWidth) * 100;
  }

  function handleTouchEnd() {
    if (!isDragging) {
      // This was a tap, not a swipe - reset and allow normal click
      touchStartX = 0;
      touchEndX = 0;
      return;
    }

    isDragging = false;

    const diff = touchEndX - touchStartX;
    const threshold = 50;

    if (diff > threshold && currentPage > 0) {
      currentPage--;
    } else if (diff < -threshold && currentPage < totalPages - 1) {
      currentPage++;
    }

    translateX = -currentPage * 100;
    touchStartX = 0;
    touchEndX = 0;
  }

  function goToPage(page: number) {
    currentPage = page;
    translateX = -currentPage * 100;
  }

  // Haptic button drag handlers
  function handleButtonTouchStart(e: TouchEvent) {
    isDraggingButton = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;

    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    dragOffsetX = dragStartX - rect.left;
    dragOffsetY = dragStartY - rect.top;
  }

  function handleButtonTouchMove(e: TouchEvent) {
    if (!isDraggingButton) return;
    e.preventDefault();

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    // Update Y position
    buttonY = Math.max(
      60,
      Math.min(window.innerHeight - 100, currentY - dragOffsetY)
    );
  }

  function handleButtonTouchEnd(e: TouchEvent) {
    if (!isDraggingButton) return;
    isDraggingButton = false;

    const touch = e.changedTouches[0];
    const centerX = touch.clientX;

    // Snap to nearest edge
    buttonX = centerX < window.innerWidth / 2 ? "left" : "right";
  }

  const appIconClass =
    "flex flex-col items-center gap-2.5 no-underline transition-transform duration-200 active:scale-[0.88]";
  const appIconImageClass =
    "w-full aspect-square flex items-center justify-center text-[36px] relative overflow-hidden rounded-[23%] shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]";
  const appNameClass =
    "text-[13px] font-medium text-white text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap";
</script>

<svelte:head>
  <title>iPhone - ReyNisa</title>
</svelte:head>

<div
  class="h-screen px-6 relative overflow-hidden flex flex-col bg-gradient-to-b from-[#87CEEB] via-[#5B9FD7] to-[#4A90C8]"
  style="padding-top: 70px; padding-bottom: 110px;"
>
  <!-- Widgets Grid -->
  <div class="mb-5 grid grid-cols-2 gap-3 relative z-10">
    <!-- Weather Widget -->
    <a href="/weather" class="block no-underline">
      <div
        class="p-4 rounded-[22px] bg-white/15 backdrop-blur-[30px] border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95"
        style="backdrop-filter: saturate(180%) blur(30px);"
      >
        {#if $weather.loading}
          <div class="text-white/90 text-[13px] font-medium mb-0.5">Loading...</div>
          <div class="text-white text-[42px] font-light leading-none mb-2">--°</div>
        {:else if $weather.error}
          <div class="text-white/90 text-[13px] font-medium mb-0.5">No Location</div>
          <div class="text-white text-[42px] font-light leading-none mb-2">--°</div>
          <div class="text-white/80 text-[11px]">Tap to enable</div>
        {:else if $weather.data}
          <div class="text-white/90 text-[13px] font-medium mb-0.5">
            {$weather.data.location}
          </div>
          <div class="text-white text-[42px] font-light leading-none mb-2">{$weather.data.temperature}°</div>
          <div class="text-white/80 text-[13px] font-medium mb-1">
            {$weather.data.condition}
          </div>
          <div class="text-white/70 text-[11px]">H:{$weather.data.high}° L:{$weather.data.low}°</div>
        {/if}
      </div>
    </a>

    <!-- Calendar Widget -->
    <div
      class="p-3 rounded-[22px] bg-white/15 backdrop-blur-[30px] border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      style="backdrop-filter: saturate(180%) blur(30px);"
    >
      <div class="text-[#FF9500] text-[10px] font-bold mb-1 text-center">
        {currentMonth}
      </div>
      <div class="grid grid-cols-7 gap-0.5 text-[9px] text-white/90">
        {#each ["S", "M", "T", "W", "T", "F", "S"] as day}
          <div class="text-center font-medium">{day}</div>
        {/each}
        {#each daysInMonth as week}
          {#each week as day}
            <div
              class="text-center py-0.5 {day === 2
                ? 'bg-white/90 text-black rounded-full'
                : ''}"
            >
              {day || ""}
            </div>
          {/each}
        {/each}
      </div>
    </div>
  </div>

  <!-- Location Widget -->
  <div
    class="mb-5 p-4 rounded-[22px] bg-white/15 backdrop-blur-[30px] border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative z-10 flex items-center gap-3"
    style="backdrop-filter: saturate(180%) blur(30px);"
  >
    {#if $weather.loading}
      <div class="w-14 h-14 rounded-full bg-white/20 animate-pulse flex-shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
        <div class="h-3 bg-white/20 rounded w-24 animate-pulse"></div>
      </div>
    {:else if $weather.data}
      {@const locationParts = $weather.data.location.split(', ')}
      {@const initials = locationParts.map(part => part.charAt(0).toUpperCase()).join('')}
      <div
        class="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-semibold shadow-lg"
      >
        {initials.substring(0, 2)}
      </div>
      <div class="flex-1">
        <div class="text-white text-[15px] font-semibold mb-0.5">
          {locationParts[0] || 'Current Location'}
        </div>
        <div class="text-white/80 text-[13px]">
          {locationParts.slice(1).join(', ') || 'Unknown'}
        </div>
      </div>
    {:else}
      <div
        class="w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xl font-semibold shadow-lg"
      >
        <i class="fas fa-map-marker-alt text-sm"></i>
      </div>
      <div class="flex-1">
        <div class="text-white text-[15px] font-semibold mb-0.5">Location unavailable</div>
        <div class="text-white/80 text-[13px]">Enable location services</div>
      </div>
    {/if}
    <div
      class="text-white/70 text-[13px] font-medium px-3 py-1.5 rounded-full bg-white/20"
    >
      Find My
    </div>
  </div>

  <!-- iOS App Grid Container with Swipe -->
  <div
    class="relative z-10 overflow-hidden flex-1"
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
  >
    <div
      class="flex transition-transform duration-300 ease-out h-full"
      style="transform: translateX({translateX}%)"
    >
      <!-- Page 1 -->
      <div class="min-w-full px-2">
        <div class="grid grid-cols-4 gap-y-6 gap-x-5 mx-auto max-w-full px-0.5">
          <!-- Messages -->
          <a href="/chat" class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#32D74B_0%,#248A3D_100%)]"
            >
              <i
                class="fas fa-comment text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
              {#if statsData.unreadMessages > 0}
                <span
                  class="absolute -top-1.5 -right-1.5 text-white text-[11px] font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5 bg-[linear-gradient(135deg,#FF453A_0%,#FF3B30_100%)] shadow-[0_2px_8px_rgba(255,69,58,0.5),0_0_0_2px_rgba(0,0,0,0.8)]"
                  >{statsData.unreadMessages}</span
                >
              {/if}
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Messages</span
            >
          </a>

          <!-- Safari -->
          <a href="/safari" class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#0A84FF_0%,#0051D5_100%)]"
            >
              <i
                class="fas fa-compass text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Safari</span
            >
          </a>

          <!-- Permit (Izin Keluar) -->
          <a href="/permit" class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(135deg, #FF3B30 0%, #FF9500 50%, #FFCC00 100%);"
            >
              <i
                class="fas fa-file-alt text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Izin Keluar</span
            >
          </a>

          <!-- Camera -->
          <a href="/camera" class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#8E8E93_0%,#636366_100%)]"
            >
              <i
                class="fas fa-camera text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Camera</span
            >
          </a>

          <!-- Mail -->
          <div class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#0A84FF_0%,#0051D5_100%)]"
            >
              <i
                class="fas fa-envelope text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Mail</span
            >
          </div>

          <!-- Clock -->
          <a href="/clock" class={appIconClass}>
            <div class="{appIconImageClass} bg-black border-2 border-white">
              <i
                class="fas fa-clock text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Clock</span
            >
          </a>

          <!-- Maps -->
          <a href="/maps" class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);"
            >
              <i
                class="fas fa-map-marker-alt text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Maps</span
            >
          </a>

          <!-- Weather -->
          <a href="/weather" class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%);"
            >
              <i
                class="fas fa-cloud-sun text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Weather</span
            >
          </a>

          <!-- Notes -->
          <a href="/notes" class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(180deg, #FFCC00 0%, #FF9500 100%);"
            >
              <i
                class="fas fa-sticky-note text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Notes</span
            >
          </a>

          <!-- Calculator -->
          <a href="/calculator" class={appIconClass}>
            <div class="{appIconImageClass} bg-[#1C1C1E]">
              <i
                class="fas fa-calculator text-[#FF9F0A]"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Calculator</span
            >
          </a>

          <!-- Settings -->
          <a href="/settings" class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#98989D_0%,#636366_100%)]"
            >
              <i
                class="fas fa-cog text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Settings</span
            >
          </a>
        </div>
      </div>

      <!-- Page 2 -->
      <div class="min-w-full px-2">
        <div class="grid grid-cols-4 gap-y-6 gap-x-5 mx-auto max-w-full px-0.5">
          <!-- Reminders -->
          <div class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#FF453A_0%,#D22730_100%)]"
            >
              <i
                class="fas fa-check-circle text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Reminders</span
            >
          </div>

          <!-- Photos -->
          <a href="/photos" class={appIconClass}>
            <div
              class="{appIconImageClass} bg-[linear-gradient(135deg,#0A84FF_0%,#0051D5_100%)]"
            >
              <i
                class="fas fa-images text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Photos</span
            >
          </a>

          <!-- Health -->
          <div class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(135deg, #FF2D55 0%, #FF3B30 100%);"
            >
              <i
                class="fas fa-heartbeat text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Health</span
            >
          </div>

          <!-- Wallet -->
          <div class={appIconClass}>
            <div class="{appIconImageClass} bg-black">
              <i
                class="fas fa-wallet text-white"
                style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
              ></i>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >Wallet</span
            >
          </div>

          <!-- App Store -->
          <div class={appIconClass}>
            <div
              class={appIconImageClass}
              style="background: linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%);"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="white"
                class="w-[54%] h-[54%]"
                style="filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25));"
              >
                <path
                  d="M12.5 3c-.3 0-.6.1-.8.4l-3 5.2c-.3.5-.1 1.2.4 1.4.5.3 1.2.1 1.4-.4l2-3.5 2 3.5c.2.4.6.6 1 .6.2 0 .3 0 .5-.1.5-.3.7-.9.4-1.4l-3-5.2c-.3-.3-.6-.5-.9-.5zm-6 4c-.3 0-.6.1-.8.4-.3.5-.1 1.2.4 1.4l8.5 4.9-1.7 3c-.3.5-.1 1.2.4 1.4.2.1.3.1.5.1.4 0 .7-.2.9-.5l2-3.5 2 3.5c.2.3.5.5.9.5.2 0 .3 0 .5-.1.5-.3.7-.9.4-1.4l-1.7-3 8.5-4.9c.5-.3.7-.9.4-1.4-.3-.5-.9-.7-1.4-.4l-8.5 4.9-8.5-4.9c-.1-.1-.3-.1-.4-.1zm-2 10c-.3 0-.6.1-.8.4-.3.5-.1 1.2.4 1.4l8 4.6c.2.1.3.1.5.1s.3 0 .5-.1l8-4.6c.5-.3.7-.9.4-1.4-.3-.5-.9-.7-1.4-.4l-7.5 4.3-7.5-4.3c-.2 0-.4-.1-.6-.1z"
                />
              </svg>
            </div>
            <span
              class={appNameClass}
              style="letter-spacing: -0.1px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
              >App Store</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page Dots -->
  <div class="flex items-center justify-center gap-2 mt-auto mb-3">
    {#each Array(totalPages) as _, i}
      <button
        onclick={() => goToPage(i)}
        class="transition-all duration-300 {currentPage === i
          ? 'w-7 h-2 rounded bg-white/95'
          : 'w-2 h-2 rounded-full bg-white/25'}"
        aria-label="Go to page {i + 1}"
      ></button>
    {/each}
  </div>

  <!-- iOS Dock -->
  <div
    class="fixed left-1/2 -translate-x-1/2 flex gap-6 px-5 py-3.5 z-[100] rounded-[30px] bg-white/12 backdrop-blur-[40px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]"
    style="bottom: 20px; backdrop-filter: saturate(200%) blur(40px); -webkit-backdrop-filter: saturate(200%) blur(40px);"
  >
    <a href="/chat" class={appIconClass}>
      <div
        class="w-[64px] h-[64px] flex items-center justify-center text-[36px] relative overflow-hidden rounded-[23%] bg-[linear-gradient(135deg,#32D74B_0%,#248A3D_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
      >
        <i
          class="fas fa-comment text-white"
          style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
        ></i>
      </div>
    </a>

    <a href="/safari" class={appIconClass}>
      <div
        class="w-[64px] h-[64px] flex items-center justify-center text-[36px] relative overflow-hidden rounded-[23%] bg-[linear-gradient(135deg,#0A84FF_0%,#0051D5_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
      >
        <i
          class="fas fa-compass text-white"
          style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
        ></i>
      </div>
    </a>

    <div class={appIconClass}>
      <div
        class="w-[64px] h-[64px] flex items-center justify-center text-[36px] relative overflow-hidden rounded-[23%] shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
        style="background: linear-gradient(135deg, #FF375F 0%, #FF2D55 100%);"
      >
        <i
          class="fas fa-music text-white"
          style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
        ></i>
      </div>
    </div>

    <a href="/photos" class={appIconClass}>
      <div
        class="w-[64px] h-[64px] flex items-center justify-center text-[36px] relative overflow-hidden rounded-[23%] bg-[linear-gradient(135deg,#0A84FF_0%,#0051D5_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
      >
        <i
          class="fas fa-images text-white"
          style="text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);"
        ></i>
      </div>
    </a>
  </div>

  <!-- Control Center Button -->
  <button
    onclick={() =>
      !isDraggingButton && (showControlCenter = !showControlCenter)}
    ontouchstart={handleButtonTouchStart}
    ontouchmove={handleButtonTouchMove}
    ontouchend={handleButtonTouchEnd}
    class="fixed w-14 h-14 rounded-full bg-gradient-to-br from-white/25 to-white/15 border border-white/30 z-[100] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center {isDraggingButton
      ? ''
      : 'transition-all duration-300 active:scale-95'}"
    style="top: {buttonY}px; {buttonX}: 16px; backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); {isDraggingButton
      ? 'transition: none;'
      : ''}"
  >
    <!-- Concentric circles design with heavy blur -->
    <div class="relative w-8 h-8 flex items-center justify-center">
      <!-- Outer ring (heavily blurred) -->
      <div
        class="absolute w-9 h-9 rounded-full bg-white/30"
        style="filter: blur(3px);"
      ></div>
      <!-- Middle ring (heavily blurred) -->
      <div
        class="absolute w-6 h-6 rounded-full bg-white/45"
        style="filter: blur(2px);"
      ></div>
      <!-- Inner circle (soft blur) -->
      <div
        class="absolute w-3.5 h-3.5 rounded-full bg-white/60"
        style="filter: blur(1.5px);"
      ></div>
    </div>
  </button>

  <ControlCenter bind:isOpen={showControlCenter} />
  <DevSelector />
</div>
