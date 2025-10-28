<script lang="ts">
  import { notifications, removeNotification } from '$lib/stores/notifications';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2.5 pointer-events-none">
  {#each $notifications as notification (notification.id)}
    <div 
      class="pointer-events-auto cursor-pointer px-5 py-3.5 rounded-[14px] min-w-[280px] text-center text-white font-medium shadow-lg backdrop-blur-xl {
        notification.type === 'success' 
          ? 'bg-[#30D158]/95 border border-[#30D158]' 
          : notification.type === 'error' 
            ? 'bg-[#FF453A]/95 border border-[#FF453A]' 
            : 'bg-[#0A84FF]/95 border border-[#0A84FF]'
      }"
      transition:fly={{ y: -20, duration: 300 }}
      onclick={() => removeNotification(notification.id)}
      onkeydown={(e) => e.key === 'Enter' && removeNotification(notification.id)}
      role="button"
      tabindex="0"
    >
      {notification.message}
    </div>
  {/each}
</div>
