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

<div class="status-bar">
  <div class="status-left">
    <span class="time">{time}</span>
  </div>
  
  <div class="status-right">
    <!-- Cellular Signal -->
    <div class="cellular-signal">
      {#each Array(cellularStrength) as _, i}
        <div class="bar" style="height: {(i + 1) * 3}px"></div>
      {/each}
    </div>
    
    <!-- WiFi -->
    <div class="wifi-icon">
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
    <div class="battery">
      <div class="battery-body">
        <div class="battery-fill" style="width: {battery}%"></div>
        {#if isCharging}
          <div class="charging-icon">⚡</div>
        {/if}
      </div>
      <div class="battery-cap"></div>
      {#if battery > 20}
        <span class="battery-percent">{battery}%</span>
      {:else}
        <span class="battery-percent low">{battery}%</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .status-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 47px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    padding-top: 8px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    z-index: 9999;
    background: transparent;
  }
  
  .status-left,
  .status-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .time {
    font-size: 15px;
    letter-spacing: -0.3px;
    font-feature-settings: "tnum";
  }
  
  /* Cellular Signal */
  .cellular-signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
  }
  
  .cellular-signal .bar {
    width: 3px;
    background: white;
    border-radius: 1px;
  }
  
  /* WiFi Icon */
  .wifi-icon {
    display: flex;
    align-items: center;
  }
  
  /* Battery */
  .battery {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  
  .battery-body {
    width: 24px;
    height: 11px;
    border: 1.5px solid white;
    border-radius: 3px;
    padding: 1.5px;
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .battery-fill {
    height: 100%;
    background: white;
    border-radius: 1px;
    transition: width 0.3s ease, background 0.3s ease;
  }
  
  .battery-fill[style*="width: 100%"] {
    background: #34C759;
  }
  
  .battery-body:has(.battery-fill[style*="width: 1"]),
  .battery-body:has(.battery-fill[style*="width: 2"]) {
    border-color: #FF3B30;
  }
  
  .battery-body:has(.battery-fill[style*="width: 1"]) .battery-fill,
  .battery-body:has(.battery-fill[style*="width: 2"]) .battery-fill {
    background: #FF3B30;
  }
  
  .battery-cap {
    width: 1.5px;
    height: 5px;
    background: white;
    border-radius: 0 1px 1px 0;
  }
  
  .battery-percent {
    font-size: 12px;
    margin-left: 2px;
  }
  
  .battery-percent.low {
    color: #FF3B30;
  }
  
  .charging-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 8px;
    color: #000;
  }
  
  /* Notch Spacing */
  @media (max-width: 430px) {
    .status-bar {
      padding: 0 16px;
    }
  }
</style>
