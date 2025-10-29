<script lang="ts">
  import { onMount } from 'svelte';
  import { detectUser } from '$lib/utils/userDetection';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;
  let stream: MediaStream | null = null;
  let capturedImage = $state<string | null>(null);
  let hasPermission = $state(false);
  let error = $state<string | null>(null);
  let facingMode = $state<'user' | 'environment'>('environment');
  let isCapturing = $state(false);
  let currentMode = $state<'photo' | 'video' | 'cinematic' | 'portrait'>('photo');
  let flashMode = $state<'auto' | 'on' | 'off'>('auto');
  let zoom = $state(1);
  let showControls = $state(false);
  
  async function startCamera() {
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Request camera access
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoElement) {
        videoElement.srcObject = stream;
        hasPermission = true;
        error = null;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      error = 'Unable to access camera. Please check permissions.';
      hasPermission = false;
    }
  }
  
  function capturePhoto() {
    if (!videoElement || !canvasElement) return;
    
    isCapturing = true;
    
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Draw video frame to canvas
    const context = canvasElement.getContext('2d');
    if (context) {
      context.drawImage(videoElement, 0, 0);
      capturedImage = canvasElement.toDataURL('image/jpeg', 0.9);
    }
    
    setTimeout(() => {
      isCapturing = false;
    }, 100);
  }
  
  function retakePhoto() {
    capturedImage = null;
  }
  
  function downloadPhoto() {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `photo-${Date.now()}.jpg`;
    link.click();
  }
  
  async function switchCamera() {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    await startCamera();
  }
  
  function toggleFlash() {
    if (flashMode === 'auto') flashMode = 'on';
    else if (flashMode === 'on') flashMode = 'off';
    else flashMode = 'auto';
  }
  
  function cycleZoom() {
    if (zoom === 1) zoom = 2;
    else if (zoom === 2) zoom = 5;
    else zoom = 1;
  }
  
  onMount(() => {
    startCamera();
    
    return () => {
      // Clean up stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });
</script>

<svelte:head>
  <title>Camera - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-black">
  
  <div class="flex-1 max-w-full mx-auto overflow-hidden relative">
    {#if error}
      <!-- Error State -->
      <div class="flex items-center justify-center h-full p-6">
        <div class="text-center">
          <i class="fas fa-camera-slash text-6xl text-[var(--text-secondary)] mb-4"></i>
          <p class="text-[var(--text-primary)] text-lg font-semibold mb-2">Camera Access Denied</p>
          <p class="text-[var(--text-secondary)] text-sm mb-4">{error}</p>
          <button 
            onclick={startCamera}
            class="px-6 py-3 bg-[#007AFF] text-white rounded-[12px] font-semibold transition-all active:opacity-60"
          >
            Try Again
          </button>
        </div>
      </div>
    {:else if capturedImage}
      <!-- Captured Photo View -->
      <div class="relative h-full flex flex-col bg-black">
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <img src={capturedImage} alt="Captured" class="max-w-full max-h-full object-contain" />
        </div>
        
        <!-- Photo Actions -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div class="flex justify-center gap-4">
            <button 
              onclick={retakePhoto}
              class="flex-1 max-w-[140px] py-3 bg-[var(--card-bg)] text-[var(--text-primary)] rounded-[12px] font-semibold transition-all active:opacity-60 flex items-center justify-center gap-2"
            >
              <i class="fas fa-redo"></i>
              Retake
            </button>
            <button 
              onclick={downloadPhoto}
              class="flex-1 max-w-[140px] py-3 bg-[#007AFF] text-white rounded-[12px] font-semibold transition-all active:opacity-60 flex items-center justify-center gap-2"
            >
              <i class="fas fa-download"></i>
              Save
            </button>
          </div>
        </div>
      </div>
    {:else}
      <!-- Camera View -->
      <div class="relative h-full bg-black">
        <video
          bind:this={videoElement}
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover"
          style="transform: scale({zoom});"
        ></video>
        
        <!-- Camera overlay -->
        <div class="absolute inset-0 pointer-events-none">
          <!-- Top Left - Close Button -->
          <div class="absolute top-12 left-4 pointer-events-auto z-20">
            <a href="/" class="w-10 h-10 flex items-center justify-center">
              <i class="fas fa-times text-white text-2xl drop-shadow-lg"></i>
            </a>
          </div>
          
          <!-- Top Right - Flash & More Controls -->
          <div class="absolute top-12 right-4 flex flex-col gap-4 pointer-events-auto z-20">
            <button 
              onclick={toggleFlash}
              class="w-10 h-10 flex items-center justify-center"
            >
              <i class="fas fa-bolt text-white text-xl drop-shadow-lg {flashMode === 'on' ? 'text-yellow-400' : ''}"></i>
              {#if flashMode === 'auto'}
                <span class="text-white text-xs absolute top-6 right-6 font-bold drop-shadow-lg">A</span>
              {/if}
            </button>
            
            <button 
              onclick={() => showControls = !showControls}
              class="w-10 h-10 flex items-center justify-center"
            >
              <i class="fas fa-chevron-up text-white text-xl drop-shadow-lg {showControls ? 'rotate-180' : ''} transition-transform"></i>
            </button>
          </div>
          
          <!-- Bottom Left - Gallery Thumbnail -->
          <div class="absolute bottom-[140px] left-8 pointer-events-auto z-10">
            <button class="w-10 h-10 bg-white/20 rounded-[8px] flex items-center justify-center border border-white/30 backdrop-blur-sm overflow-hidden">
              <i class="fas fa-images text-white text-sm"></i>
            </button>
          </div>
          
          <!-- Center - Horizontal Zoom Controls (Above Capture Button) -->
          <div class="absolute bottom-[200px] left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto z-10">
            <button 
              onclick={() => zoom = 0.5}
              class="text-white text-sm font-medium transition-all {zoom === 0.5 ? 'text-yellow-400 scale-110' : 'text-white/60'}"
            >
              .5
            </button>
            <button 
              onclick={() => zoom = 1}
              class="text-white text-xl font-bold transition-all {zoom === 1 ? 'text-yellow-400 scale-110' : 'text-white/60'}"
            >
              1x
            </button>
            <button 
              onclick={() => zoom = 2}
              class="text-white text-sm font-medium transition-all {zoom === 2 ? 'text-yellow-400 scale-110' : 'text-white/60'}"
            >
              2
            </button>
            <button 
              onclick={() => zoom = 5}
              class="text-white text-sm font-medium transition-all {zoom === 5 ? 'text-yellow-400 scale-110' : 'text-white/60'}"
            >
              5
            </button>
          </div>
          
          <!-- Bottom Controls -->
          <div class="absolute bottom-0 left-0 right-0 pb-8 pointer-events-auto z-20">
            <!-- Capture Button (Center) -->
            <div class="flex justify-center mb-5">
              <button 
                onclick={capturePhoto}
                class="relative w-[70px] h-[70px] rounded-full border-[3px] border-white transition-all active:scale-90 {isCapturing ? 'scale-90' : ''}"
              >
                {#if currentMode === 'video'}
                  <div class="absolute inset-[4px] rounded-full bg-red-600"></div>
                {:else}
                  <div class="absolute inset-[4px] rounded-full bg-white"></div>
                {/if}
              </button>
            </div>
            
            <!-- Mode Selector (Below Capture Button) - Simplified to 2 modes -->
            <div class="flex justify-center gap-4 mb-2">
              <button 
                onclick={() => currentMode = 'video'}
                class="px-5 py-2 rounded-full text-[11px] font-semibold tracking-wide transition-all {currentMode === 'video' ? 'bg-[rgba(235,235,245,0.3)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.3)]' : 'text-white/50'}"
              >
                VIDEO
              </button>
              <button 
                onclick={() => currentMode = 'photo'}
                class="px-5 py-2 rounded-full text-[11px] font-semibold tracking-wide transition-all {currentMode === 'photo' ? 'bg-[#FFD60A] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.4)]' : 'text-white/50'}"
              >
                PHOTO
              </button>
            </div>
          </div>
          
          <!-- Bottom Right - Rotate Camera -->
          <div class="absolute bottom-[140px] right-8 pointer-events-auto z-10">
            <button 
              onclick={switchCamera}
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all active:scale-90"
            >
              <i class="fas fa-sync-alt text-white text-lg"></i>
            </button>
          </div>
          
          <!-- More Controls Panel (Slides from top right) -->
          {#if showControls}
            <div class="absolute right-4 top-24 bg-black/70 backdrop-blur-2xl rounded-[24px] p-5 pointer-events-auto z-30 shadow-2xl" style="backdrop-filter: saturate(180%) blur(20px);">
              <div class="grid grid-cols-3 gap-x-6 gap-y-5 text-center text-white">
                <!-- Row 1 -->
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-bolt text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">FLASH</span>
                </button>
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-circle text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">LIVE</span>
                </button>
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-clock text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">TIMER</span>
                </button>
                
                <!-- Row 2 -->
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-plus-minus text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">EXPOSURE</span>
                </button>
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-palette text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">STYLES</span>
                </button>
                <button class="flex flex-col items-center gap-2">
                  <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                    <i class="fas fa-filter text-xl"></i>
                  </div>
                  <span class="text-[10px] font-medium tracking-wide">FILTER</span>
                </button>
                
                <!-- Row 3 (centered) -->
                <div class="col-span-3 flex justify-center mt-2">
                  <button class="flex flex-col items-center gap-2">
                    <div class="w-[52px] h-[52px] rounded-full bg-white/15 flex items-center justify-center">
                      <i class="fas fa-expand text-xl"></i>
                    </div>
                    <span class="text-[10px] font-medium tracking-wide">ASPECT</span>
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Hidden canvas for capturing -->
        <canvas bind:this={canvasElement} class="hidden"></canvas>
      </div>
    {/if}
  </div>
  
  <DevSelector />
</div>
