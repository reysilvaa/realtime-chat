<script lang="ts">
  import StatusBar from './StatusBar.svelte';
  
  let { children } = $props<{ children?: import('svelte').Snippet }>();
  
  let currentTime = $state('');
  
  function updateTime() {
    const now = new Date();
    currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  $effect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
</script>

<div class="iphone-simulator">
  <div class="iphone-frame">
    <!-- Notch -->
    <div class="notch">
      <div class="notch-camera"></div>
      <div class="notch-speaker"></div>
    </div>
    
    <!-- Status Bar -->
    <StatusBar time={currentTime} />
    
    <!-- Screen Content -->
    <div class="iphone-screen">
      {#if children}
        {@render children()}
      {/if}
    </div>
    
    <!-- Home Indicator -->
    <div class="home-indicator"></div>
  </div>
</div>

<style>
  .iphone-simulator {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
    z-index: 999999;
    padding: 20px;
  }
  
  .iphone-frame {
    width: 100%;
    max-width: 390px;
    height: 844px;
    background: #000000;
    border-radius: 55px;
    box-shadow: 
      0 0 0 2px #1a1a1a,
      0 0 0 4px #2a2a2a,
      0 30px 60px rgba(0, 0, 0, 0.8),
      inset 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  /* iPhone Notch */
  .notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 210px;
    height: 30px;
    background: #000000;
    border-radius: 0 0 20px 20px;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .notch-camera {
    width: 12px;
    height: 12px;
    background: #1a1a1a;
    border-radius: 50%;
    box-shadow: inset 0 0 3px rgba(100, 100, 255, 0.3);
  }
  
  .notch-speaker {
    width: 60px;
    height: 6px;
    background: #0a0a0a;
    border-radius: 3px;
  }
  
  /* iPhone Screen */
  .iphone-screen {
    flex: 1;
    background: #000000;
    overflow: hidden;
    position: relative;
  }
  
  .iphone-screen :global(.ios-homescreen) {
    overflow: hidden;
  }
  
  .iphone-screen :global(.app-container),
  .iphone-screen :global(.main-content) {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  
  .iphone-screen :global(*::-webkit-scrollbar) {
    display: none;
  }
  
  /* Home Indicator */
  .home-indicator {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 134px;
    height: 5px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    z-index: 10000;
  }
  
  /* Responsive - Hide frame on small screens */
  @media (max-width: 430px) {
    .iphone-simulator {
      position: static;
      transform: none;
      max-width: 100%;
      height: 100vh;
      padding: 0;
      background: #000000;
    }
    
    .iphone-frame {
      max-width: 100%;
      height: 100vh;
      border-radius: 0;
      box-shadow: none;
    }
    
    .notch {
      border-radius: 0 0 20px 20px;
    }
  }
</style>
