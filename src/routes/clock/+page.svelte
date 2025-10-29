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

<div class="min-h-full h-full flex flex-col bg-[var(--bg-secondary)]">
  <Header title="Clock" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto flex items-center justify-center" style="-webkit-overflow-scrolling: touch;">
    <div class="text-center p-8 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- Digital Clock -->
      <div class="mb-8">
        <div class="text-8xl font-bold text-[var(--text-primary)] mb-4 tracking-tighter" style="font-variant-numeric: tabular-nums;">
          {currentTime}
        </div>
        <div class="text-2xl text-[var(--text-secondary)] font-medium">
          {currentDate}
        </div>
      </div>
      
      <!-- Analog Clock Placeholder -->
      <div class="w-64 h-64 mx-auto rounded-full bg-[var(--card-bg)] border-4 border-[var(--border-primary)] flex items-center justify-center relative shadow-[var(--shadow-md)]">
        <div class="absolute w-1 h-24 bg-[var(--text-primary)] rounded-full origin-bottom" style="transform: rotate(0deg) translateY(-48px); opacity: 0.9;"></div>
        <div class="absolute w-1 h-20 bg-[var(--text-primary)] rounded-full origin-bottom" style="transform: rotate(90deg) translateY(-40px); opacity: 0.7;"></div>
        <div class="absolute w-0.5 h-28 bg-[#FF3B30] rounded-full origin-bottom" style="transform: rotate(180deg) translateY(-56px);"></div>
        <div class="w-4 h-4 bg-[var(--text-primary)] rounded-full absolute z-10"></div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
        <div class="bg-[var(--card-bg)] rounded-[16px] p-4 text-center border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
          <i class="fas fa-bell text-3xl text-[#FF9500] mb-2"></i>
          <div class="text-[var(--text-primary)] text-sm font-medium">Alarm</div>
        </div>
        <div class="bg-[var(--card-bg)] rounded-[16px] p-4 text-center border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
          <i class="fas fa-stopwatch text-3xl text-[#007AFF] mb-2"></i>
          <div class="text-[var(--text-primary)] text-sm font-medium">Stopwatch</div>
        </div>
        <div class="bg-[var(--card-bg)] rounded-[16px] p-4 text-center border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
          <i class="fas fa-hourglass text-3xl text-[#34C759] mb-2"></i>
          <div class="text-[var(--text-primary)] text-sm font-medium">Timer</div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>
