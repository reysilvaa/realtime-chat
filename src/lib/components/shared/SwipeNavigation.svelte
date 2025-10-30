<script lang="ts">
  import { goto } from '$app/navigation';
  
  let { backLink }: { backLink?: string } = $props();
  
  let touchStartX = $state(0);
  let touchStartY = $state(0);
  let touchEndX = $state(0);
  let touchEndY = $state(0);
  let isSwiping = $state(false);
  let swipeProgress = $state(0);
  
  const MIN_SWIPE_DISTANCE = 50;
  const SWIPE_THRESHOLD = 100;
  
  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping) return;
    
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // Only track horizontal swipes from left edge
    if (touchStartX < 50 && deltaX > 0 && deltaY < 50) {
      swipeProgress = Math.min(deltaX / SWIPE_THRESHOLD, 1);
      
      // Prevent default to avoid page scroll
      if (swipeProgress > 0.1) {
        e.preventDefault();
      }
    }
  }
  
  function handleTouchEnd() {
    if (!isSwiping) return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // Swipe right from left edge = back navigation
    if (touchStartX < 50 && deltaX > MIN_SWIPE_DISTANCE && deltaY < 50) {
      if (backLink) {
        goto(backLink);
      } else {
        window.history.back();
      }
    }
    
    // Reset
    isSwiping = false;
    swipeProgress = 0;
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  }
</script>

<!-- Swipe Gesture Overlay -->
<div
  class="fixed inset-0 z-[9999] pointer-events-none"
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  style="pointer-events: {isSwiping ? 'auto' : 'none'};"
>
  <!-- Swipe Progress Indicator (iPhone style) -->
  {#if swipeProgress > 0}
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 transition-opacity"
      style="opacity: {swipeProgress}; transform: translateX({swipeProgress * 20}px) translateY(-50%);"
    >
      <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center ml-4">
        <i class="fas fa-chevron-left text-white text-xl" style="transform: translateX({swipeProgress * 3}px);"></i>
      </div>
    </div>
    
    <!-- Page transition overlay -->
    <div
      class="absolute inset-0 bg-black pointer-events-none transition-opacity"
      style="opacity: {swipeProgress * 0.3};"
    ></div>
  {/if}
</div>

