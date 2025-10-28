<script lang="ts">
  import { notifications, removeNotification } from '$lib/stores/notifications';
  import { fly } from 'svelte/transition';
</script>

<div class="notifications-container">
  {#each $notifications as notification (notification.id)}
    <div 
      class="notification {notification.type} show"
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

<style>
  .notifications-container {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }
  
  .notification {
    pointer-events: all;
    cursor: pointer;
  }
</style>
