<script lang="ts">
  import { onMount } from 'svelte';
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import ShimmerWeather from '$lib/components/shared/ShimmerWeather.svelte';
  import { weather } from '$lib/stores/weather';
  import { theme } from '$lib/stores/theme';
  
  detectUser();
  
  $effect(() => {
    theme.init();
  });
  
  onMount(() => {
    weather.loadWeather();
  });
</script>

<svelte:head>
  <title>Weather - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header title="Weather" backLink="/" />
  
  <div class="flex-1 p-4 pt-[107px] max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="max-w-3xl mx-auto space-y-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      {#if $weather.loading}
        <ShimmerWeather />
      {:else if $weather.error}
        <!-- Error State -->
        <div class="text-center text-[var(--text-primary)] py-20">
          <i class="fas fa-exclamation-triangle text-6xl mb-4 opacity-60 text-red-500"></i>
          <div class="text-xl mb-4">{$weather.error}</div>
          <button 
            onclick={() => weather.refresh()}
            class="bg-[#007AFF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0051D5] transition-colors"
          >
            Try Again
          </button>
        </div>
      {:else if $weather.data}
        <!-- Current Weather -->
        <div class="text-center text-[var(--text-primary)] bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
          <div class="text-lg font-medium mb-1 text-[var(--text-secondary)]">{$weather.data.location}</div>
          <div class="text-7xl font-light mb-2">{$weather.data.temperature}°</div>
          <div class="text-2xl mb-2">{$weather.data.condition}</div>
          <div class="text-base text-[var(--text-secondary)]">H:{$weather.data.high}° L:{$weather.data.low}°</div>
          <i class="fas {$weather.data.icon} text-6xl my-4 text-[#007AFF]"></i>
        </div>
      
        <!-- Hourly Forecast -->
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
          <div class="text-[var(--text-secondary)] text-xs font-semibold mb-3 uppercase tracking-wide">Hourly Forecast</div>
          <div class="flex gap-4 overflow-x-auto pb-2">
            {#each $weather.data.hourly as hour}
              <div class="flex flex-col items-center min-w-[60px] text-[var(--text-primary)]">
                <div class="text-sm mb-2 text-[var(--text-secondary)]">{hour.time}</div>
                <i class="fas {hour.icon} text-2xl mb-2 text-[#007AFF]"></i>
                <div class="font-semibold">{hour.temp}°</div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Daily Forecast -->
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
          <div class="text-[var(--text-secondary)] text-xs font-semibold mb-3 uppercase tracking-wide">5-Day Forecast</div>
          <div class="space-y-3">
            {#each $weather.data.daily as day}
              <div class="flex items-center justify-between text-[var(--text-primary)]">
                <div class="w-16 font-semibold">{day.day}</div>
                <i class="fas {day.icon} text-xl w-8 text-center text-[#007AFF]"></i>
                <div class="flex gap-3 w-20 justify-end">
                  <span class="font-semibold">{day.high}°</span>
                  <span class="text-[var(--text-secondary)]">{day.low}°</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
            <div class="text-[var(--text-secondary)] text-xs font-semibold mb-2 uppercase tracking-wide">Humidity</div>
            <div class="text-[var(--text-primary)] text-3xl font-semibold">{$weather.data.humidity}%</div>
          </div>
          <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
            <div class="text-[var(--text-secondary)] text-xs font-semibold mb-2 uppercase tracking-wide">Wind</div>
            <div class="text-[var(--text-primary)] text-3xl font-semibold">{$weather.data.windSpeed} km/h</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <DevSelector />
</div>
