<script lang="ts">
  import { notifications, removeNotification } from '$lib/stores/notifications';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2.5 pointer-events-none w-[calc(100%-32px)] max-w-[380px]">
  {#each $notifications as notification (notification.id)}
    <div 
      class="pointer-events-auto cursor-pointer px-4 py-4 rounded-[18px] text-white font-medium shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[40px] {
        notification.type === 'success' 
          ? 'bg-[#34C759]/90 border border-[#34C759]/30' 
          : notification.type === 'error' 
            ? 'bg-[#FF3B30]/90 border border-[#FF3B30]/30' 
            : 'bg-[#007AFF]/90 border border-[#007AFF]/30'
      }"
      style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);"
      transition:fly={{ y: -20, duration: 300 }}
      onclick={() => removeNotification(notification.id)}
      onkeydown={(e) => e.key === 'Enter' && removeNotification(notification.id)}
      role="button"
      tabindex="0"
    >
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          {#if notification.type === 'success'}
            <i class="fas fa-check text-white text-sm"></i>
          {:else if notification.type === 'error'}
            <i class="fas fa-times text-white text-sm"></i>
          {:else}
            <i class="fas fa-info text-white text-sm"></i>
          {/if}
        </div>
        <div class="flex-1 text-left">
          <div class="text-[15px] font-semibold" style="letter-spacing: -0.24px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
            {notification.message}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
