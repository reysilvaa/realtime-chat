<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  // Mock weather data
  const weather = {
    location: 'Jakarta, Indonesia',
    temperature: 28,
    condition: 'Partly Cloudy',
    icon: 'fa-cloud-sun',
    high: 32,
    low: 25,
    humidity: 75,
    wind: 12,
    hourly: [
      { time: '12:00', temp: 28, icon: 'fa-cloud-sun' },
      { time: '13:00', temp: 29, icon: 'fa-sun' },
      { time: '14:00', temp: 31, icon: 'fa-sun' },
      { time: '15:00', temp: 32, icon: 'fa-sun' },
      { time: '16:00', temp: 30, icon: 'fa-cloud-sun' },
      { time: '17:00', temp: 28, icon: 'fa-cloud' }
    ],
    weekly: [
      { day: 'Mon', high: 32, low: 25, icon: 'fa-sun' },
      { day: 'Tue', high: 31, low: 24, icon: 'fa-cloud-sun' },
      { day: 'Wed', high: 29, low: 23, icon: 'fa-cloud-rain' },
      { day: 'Thu', high: 30, low: 24, icon: 'fa-cloud-sun' },
      { day: 'Fri', high: 32, low: 25, icon: 'fa-sun' }
    ]
  };
</script>

<svelte:head>
  <title>Weather - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[radial-gradient(circle_at_top,#5AC8FA_0%,#007AFF_100%)]">
  <Header title="Weather" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="p-6 space-y-6 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- Current Weather -->
      <div class="text-center text-white">
        <div class="text-2xl font-medium mb-2">{weather.location}</div>
        <div class="text-8xl font-light mb-4">{weather.temperature}°</div>
        <div class="text-3xl mb-2">{weather.condition}</div>
        <div class="text-xl">H:{weather.high}° L:{weather.low}°</div>
        <i class="fas {weather.icon} text-7xl my-6 opacity-90"></i>
      </div>
      
      <!-- Hourly Forecast -->
      <div class="bg-white/15 backdrop-blur-[40px] rounded-[22px] p-4 border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
        <div class="text-white/80 text-sm font-semibold mb-3">HOURLY FORECAST</div>
        <div class="flex gap-4 overflow-x-auto pb-2">
          {#each weather.hourly as hour}
            <div class="flex flex-col items-center min-w-[60px] text-white">
              <div class="text-sm mb-2">{hour.time}</div>
              <i class="fas {hour.icon} text-2xl mb-2"></i>
              <div class="font-semibold">{hour.temp}°</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Weekly Forecast -->
      <div class="bg-white/15 backdrop-blur-[40px] rounded-[22px] p-4 border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
        <div class="text-white/80 text-sm font-semibold mb-3">7-DAY FORECAST</div>
        <div class="space-y-3">
          {#each weather.weekly as day}
            <div class="flex items-center justify-between text-white">
              <div class="w-12 font-semibold">{day.day}</div>
              <i class="fas {day.icon} text-xl w-8 text-center"></i>
              <div class="flex gap-3 w-20 justify-end">
                <span class="font-semibold">{day.high}°</span>
                <span class="opacity-60">{day.low}°</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Details -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/15 backdrop-blur-[40px] rounded-[20px] p-4 border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
          <div class="text-white/80 text-xs font-semibold mb-2">HUMIDITY</div>
          <div class="text-white text-3xl font-semibold">{weather.humidity}%</div>
        </div>
        <div class="bg-white/15 backdrop-blur-[40px] rounded-[20px] p-4 border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
          <div class="text-white/80 text-xs font-semibold mb-2">WIND</div>
          <div class="text-white text-3xl font-semibold">{weather.wind} km/h</div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>
