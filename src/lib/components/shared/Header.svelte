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

<!-- Combined blur background for StatusBar + Header -->
<div class="fixed top-0 left-0 right-0 h-[91px] z-[1000] bg-black/92 backdrop-blur-[25px] border-b border-white/[0.08]" style="backdrop-filter: saturate(180%) blur(25px); -webkit-backdrop-filter: saturate(180%) blur(25px);"></div>

<!-- Header content -->
<div class="fixed top-[47px] left-0 right-0 z-[1001] px-4 h-11 flex items-center">
  <div class="flex items-center gap-3 w-full">
    {#if backLink}
      <a href={backLink} class="flex items-center gap-1.5 px-2 py-2 -ml-2 rounded-lg transition-all no-underline text-[#0A84FF] active:opacity-60 active:bg-[#0A84FF]/15">
        <i class="fas fa-arrow-left"></i>
      </a>
    {:else}
      <i class="fas fa-heart text-[#0A84FF]"></i>
    {/if}
    
    <div class="flex-1 text-center flex flex-col items-center">
      <h1 class="text-[17px] font-semibold text-white m-0" style="letter-spacing: -0.408px;">{title}</h1>
      {#if showStatus}
        <span class="flex items-center gap-1.5 text-xs text-white/60 mt-0.5">
          <span class="w-2 h-2 rounded-full {status === 'connected' ? 'bg-[#30D158]' : 'bg-white/30'} {status === 'connected' ? 'animate-pulse' : ''}"></span>
          <span>{status === 'connected' ? 'Online' : status === 'connecting' ? 'Connecting...' : 'Offline'}</span>
        </span>
      {/if}
    </div>
    
    {#if user && !backLink}
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
        <i class="fas fa-user-circle"></i>
        <span>{user.userName}</span>
      </div>
    {/if}
  </div>
</div>
