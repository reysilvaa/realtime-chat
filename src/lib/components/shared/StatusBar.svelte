<script lang="ts">
  let { time }: { time: string } = $props();
  
  let battery = $state(100);
  let isCharging = $state(false);
  let wifiStrength = $state(3);
  let cellularStrength = $state(4);
  
  $effect(() => {
    // Get real battery info if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        battery = Math.round(bat.level * 100);
        isCharging = bat.charging;
        
        bat.addEventListener('levelchange', () => {
          battery = Math.round(bat.level * 100);
        });
        
        bat.addEventListener('chargingchange', () => {
          isCharging = bat.charging;
        });
      });
    }
    
    // Simulate network (in real app, use navigator.connection)
    wifiStrength = 3;
    cellularStrength = 4;
  });
</script>

<div class="absolute top-0 left-0 right-0 h-[47px] flex items-center justify-between px-6 pt-2 text-white text-[15px] font-semibold z-[9999] bg-transparent">
  <div class="flex items-center gap-1.5">
    <span class="text-[15px] tracking-[-0.3px]" style="font-feature-settings: 'tnum';">{time}</span>
  </div>
  
  <div class="flex items-center gap-1.5">
    <!-- Cellular Signal -->
    <div class="flex items-end gap-0.5 h-3">
      {#each Array(cellularStrength) as _, i}
        <div class="w-[3px] bg-white rounded-[1px]" style="height: {(i + 1) * 3}px"></div>
      {/each}
    </div>
    
    <!-- WiFi -->
    <div class="flex items-center">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
        <path d="M8 11C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11Z"/>
        {#if wifiStrength >= 1}
        <path d="M8 7C9.10457 7 10 7.89543 10 9H6C6 7.89543 6.89543 7 8 7Z" opacity="0.8"/>
        {/if}
        {#if wifiStrength >= 2}
        <path d="M8 4C10.2091 4 12 5.79086 12 8H4C4 5.79086 5.79086 4 8 4Z" opacity="0.6"/>
        {/if}
        {#if wifiStrength >= 3}
        <path d="M8 1C11.3137 1 14 3.68629 14 7H2C2 3.68629 4.68629 1 8 1Z" opacity="0.4"/>
        {/if}
      </svg>
    </div>
    
    <!-- Battery -->
    <div class="flex items-center gap-0.5">
      <div class="w-6 h-[11px] border-[1.5px] {battery <= 20 ? 'border-[#FF3B30]' : 'border-white'} rounded-[3px] p-[1.5px] relative flex items-center">
        <div class="h-full {battery === 100 ? 'bg-[#34C759]' : battery <= 20 ? 'bg-[#FF3B30]' : 'bg-white'} rounded-[1px] transition-all duration-300" style="width: {battery}%"></div>
        {#if isCharging}
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-black">⚡</div>
        {/if}
      </div>
      <div class="w-[1.5px] h-[5px] bg-white rounded-r-[1px]"></div>
      <span class="text-xs ml-0.5 {battery <= 20 ? 'text-[#FF3B30]' : 'text-white'}">{battery}%</span>
    </div>
  </div>
</div>
