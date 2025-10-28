<script lang="ts">
  import { messages } from '$lib/stores/messages';
  import { formatMessageTime, escapeHtml } from '$lib/utils/formatters';
  import type { Message } from '$lib/types';
  
  let { currentUserName }: { currentUserName: string } = $props();
  
  function isSent(message: Message): boolean {
    return message.sender_name === currentUserName;
  }
  
  function getReadIcon(message: Message): string {
    return message.read_at 
      ? '<i class="fas fa-check-double"></i>' 
      : '<i class="fas fa-check"></i>';
  }
</script>

<div class="flex flex-col gap-2 max-w-full">
  {#if $messages.length === 0}
    <div class="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <i class="fas fa-comments text-6xl mb-4"></i>
      <p class="text-lg">Belum ada pesan<br>Mulai percakapan sekarang!</p>
    </div>
  {:else}
    <div class="flex justify-center my-4">
      <span class="px-4 py-2 bg-black/20 text-white/70 text-xs font-medium rounded-full backdrop-blur-sm">
        Hari ini
      </span>
    </div>
    {#each $messages as message (message.id)}
      <div 
        class="flex mb-1 animate-[messageSlideIn_0.3s_cubic-bezier(0.4,0,0.2,1)] {isSent(message) ? 'justify-end' : 'justify-start'}"
      >
        <div 
          class="max-w-[75%] px-4 py-2.5 rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.12)] break-words {
            isSent(message) 
              ? 'bg-[#0A84FF] text-white rounded-br-[6px]' 
              : 'bg-[#E5E5EA] text-black rounded-bl-[6px]'
          }"
        >
          <div class="text-[17px] leading-normal break-words" style="letter-spacing: -0.408px;">
            {@html escapeHtml(message.message)}
          </div>
          <div class="flex items-center gap-2 mt-1 text-xs opacity-70">
            <span>{formatMessageTime(message.created_at)}</span>
            {#if isSent(message)}
              <span>{@html getReadIcon(message)}</span>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  @keyframes messageSlideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
