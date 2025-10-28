<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  let currentTime = $state('');
  let currentDate = $state('');
  
  $effect(() => {
    function updateTime() {
      const now = new Date();
      currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      currentDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  });
</script>

<svelte:head>
  <title>Clock - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Clock" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto bg-black flex items-center justify-center" style="-webkit-overflow-scrolling: touch;">
    <div class="text-center p-8 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- Digital Clock -->
      <div class="mb-8">
        <div class="text-8xl font-bold text-white mb-4 tracking-tighter" style="font-variant-numeric: tabular-nums;">
          {currentTime}
        </div>
        <div class="text-2xl text-white/70 font-medium">
          {currentDate}
        </div>
      </div>
      
      <!-- Analog Clock Placeholder -->
      <div class="w-64 h-64 mx-auto rounded-full bg-white/10 backdrop-blur-xl border-4 border-white/20 flex items-center justify-center relative shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div class="absolute w-1 h-24 bg-white/90 rounded-full origin-bottom" style="transform: rotate(0deg) translateY(-48px);"></div>
        <div class="absolute w-1 h-20 bg-white/70 rounded-full origin-bottom" style="transform: rotate(90deg) translateY(-40px);"></div>
        <div class="absolute w-0.5 h-28 bg-[#FF453A] rounded-full origin-bottom" style="transform: rotate(180deg) translateY(-56px);"></div>
        <div class="w-4 h-4 bg-white rounded-full absolute z-10"></div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
        <div class="bg-white/10 backdrop-blur-xl rounded-[16px] p-4 text-center border border-white/10">
          <i class="fas fa-bell text-3xl text-[#FF9F0A] mb-2"></i>
          <div class="text-white text-sm font-medium">Alarm</div>
        </div>
        <div class="bg-white/10 backdrop-blur-xl rounded-[16px] p-4 text-center border border-white/10">
          <i class="fas fa-stopwatch text-3xl text-[#0A84FF] mb-2"></i>
          <div class="text-white text-sm font-medium">Stopwatch</div>
        </div>
        <div class="bg-white/10 backdrop-blur-xl rounded-[16px] p-4 text-center border border-white/10">
          <i class="fas fa-hourglass text-3xl text-[#30D158] mb-2"></i>
          <div class="text-white text-sm font-medium">Timer</div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>
