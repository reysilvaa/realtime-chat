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

<div class="messages-list">
  {#if $messages.length === 0}
    <div class="empty-state">
      <i class="fas fa-comments"></i>
      <p>Belum ada pesan<br>Mulai percakapan sekarang!</p>
    </div>
  {:else}
    <div class="date-separator">
      <span>Hari ini</span>
    </div>
    {#each $messages as message (message.id)}
      <div class="message {isSent(message) ? 'sent' : 'received'}">
        <div class="message-bubble">
          <div class="message-text">{@html escapeHtml(message.message)}</div>
          <div class="message-meta">
            <span class="message-time">{formatMessageTime(message.created_at)}</span>
            {#if isSent(message)}
              <span class="message-status">{@html getReadIcon(message)}</span>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
