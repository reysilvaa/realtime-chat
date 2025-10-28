<script lang="ts">
  let { isOpen = $bindable(false) } = $props<{ isOpen: boolean }>();
  
  let brightness = $state(75);
  let volume = $state(60);
  let wifiEnabled = $state(true);
  let bluetoothEnabled = $state(true);
  let airplaneMode = $state(false);
  let flashlightOn = $state(false);
  
  function close() {
    isOpen = false;
  }
  
  function toggleWifi() {
    wifiEnabled = !wifiEnabled;
  }
  
  function toggleBluetooth() {
    bluetoothEnabled = !bluetoothEnabled;
  }
  
  function toggleAirplane() {
    airplaneMode = !airplaneMode;
  }
  
  function toggleFlashlight() {
    flashlightOn = !flashlightOn;
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
    onclick={close}
  ></div>
  
  <!-- Control Center -->
  <div 
    class="fixed top-[100px] right-4 w-[340px] max-w-[calc(100vw-32px)] z-[9999] animate-[slideDown_0.3s_ease-out]"
  >
    <div class="bg-black/90 backdrop-blur-2xl rounded-[24px] p-4 shadow-2xl border border-white/10">
      <!-- Connectivity Cards -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <!-- Connectivity Group -->
        <div class="col-span-2 bg-white/10 rounded-[18px] p-3">
          <div class="grid grid-cols-3 gap-2">
            <!-- WiFi -->
            <button 
              onclick={toggleWifi}
              class="aspect-square rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-95 {wifiEnabled ? 'bg-[#0A84FF]' : 'bg-white/10'}"
            >
              <i class="fas fa-wifi text-2xl {wifiEnabled ? 'text-white' : 'text-white/40'} mb-1"></i>
              <span class="text-[10px] {wifiEnabled ? 'text-white' : 'text-white/40'}">Wi-Fi</span>
            </button>
            
            <!-- Bluetooth -->
            <button 
              onclick={toggleBluetooth}
              class="aspect-square rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-95 {bluetoothEnabled ? 'bg-[#0A84FF]' : 'bg-white/10'}"
            >
              <i class="fab fa-bluetooth text-2xl {bluetoothEnabled ? 'text-white' : 'text-white/40'} mb-1"></i>
              <span class="text-[10px] {bluetoothEnabled ? 'text-white' : 'text-white/40'}">Bluetooth</span>
            </button>
            
            <!-- Airplane Mode -->
            <button 
              onclick={toggleAirplane}
              class="aspect-square rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-95 {airplaneMode ? 'bg-[#FF9F0A]' : 'bg-white/10'}"
            >
              <i class="fas fa-plane text-2xl {airplaneMode ? 'text-white' : 'text-white/40'} mb-1"></i>
              <span class="text-[10px] {airplaneMode ? 'text-white' : 'text-white/40'}">Airplane</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Brightness -->
      <div class="bg-white/10 backdrop-blur-xl rounded-[18px] p-4 mb-3">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-sun text-white/70"></i>
          <span class="text-white text-sm font-medium flex-1">Brightness</span>
          <span class="text-white/60 text-sm">{brightness}%</span>
        </div>
        <input 
          type="range" 
          bind:value={brightness}
          min="0" 
          max="100"
          class="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>
      
      <!-- Volume -->
      <div class="bg-white/10 backdrop-blur-xl rounded-[18px] p-4 mb-3">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-volume-up text-white/70"></i>
          <span class="text-white text-sm font-medium flex-1">Volume</span>
          <span class="text-white/60 text-sm">{volume}%</span>
        </div>
        <input 
          type="range" 
          bind:value={volume}
          min="0" 
          max="100"
          class="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-3">
        <!-- Flashlight -->
        <button 
          onclick={toggleFlashlight}
          class="aspect-square rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-95 {flashlightOn ? 'bg-white/90' : 'bg-white/10'}"
        >
          <i class="fas fa-flashlight text-2xl {flashlightOn ? 'text-black' : 'text-white'} mb-1"></i>
        </button>
        
        <!-- Calculator -->
        <a href="/calculator" class="aspect-square rounded-[14px] flex flex-col items-center justify-center bg-[#FF9F0A] transition-all active:scale-95">
          <i class="fas fa-calculator text-2xl text-white mb-1"></i>
        </a>
        
        <!-- Camera -->
        <button class="aspect-square rounded-[14px] flex flex-col items-center justify-center bg-white/10 transition-all active:scale-95">
          <i class="fas fa-camera text-2xl text-white mb-1"></i>
        </button>
        
        <!-- Settings -->
        <a href="/settings" class="aspect-square rounded-[14px] flex flex-col items-center justify-center bg-white/10 transition-all active:scale-95">
          <i class="fas fa-cog text-2xl text-white mb-1"></i>
        </a>
      </div>
      
      <!-- Music Player (Optional) -->
      <div class="bg-white/10 backdrop-blur-xl rounded-[18px] p-4 mt-3">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[10px] flex items-center justify-center">
            <i class="fas fa-music text-white text-xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-white font-semibold text-sm">Not Playing</div>
            <div class="text-white/60 text-xs">Music</div>
          </div>
        </div>
        <div class="flex items-center justify-center gap-6">
          <button class="text-white/60 text-2xl transition-all active:scale-95">
            <i class="fas fa-backward"></i>
          </button>
          <button class="text-white text-3xl transition-all active:scale-95">
            <i class="fas fa-play"></i>
          </button>
          <button class="text-white/60 text-2xl transition-all active:scale-95">
            <i class="fas fa-forward"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
