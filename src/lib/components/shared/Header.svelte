<script lang="ts">
  import type { User, ConnectionStatus } from '$lib/types';
  
  interface Props {
    title: string;
    backLink?: string;
    user?: User | null;
    showStatus?: boolean;
    status?: ConnectionStatus;
  }
  
  let { title, backLink, user = null, showStatus = false, status = 'connecting' }: Props = $props();
</script>

<div class="app-header">
  <div class="header-content">
    {#if backLink}
      <a href={backLink} class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </a>
    {:else}
      <i class="fas fa-heart"></i>
    {/if}
    
    <div class="chat-info">
      <h1>{title}</h1>
      {#if showStatus}
        <span class="online-indicator">
          <span class="status-dot {status === 'connected' ? 'online' : ''}"></span>
          <span>{status === 'connected' ? 'Online' : status === 'connecting' ? 'Connecting...' : 'Offline'}</span>
        </span>
      {/if}
    </div>
    
    {#if user && !backLink}
      <div class="user-badge">
        <i class="fas fa-user-circle"></i>
        <span>{user.userName}</span>
      </div>
    {/if}
  </div>
</div>
