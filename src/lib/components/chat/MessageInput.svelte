<script lang="ts">
  import { EMOTICONS } from "$lib/config";
  import { showNotification } from "$lib/stores/notifications";

  // Props style baru Svelte 5
  const { onSend }: { onSend: (message: string) => Promise<void> } = $props();

  let message = $state("");
  let textarea = $state<HTMLTextAreaElement | null>(null);
  let showEmoticons = $state(false);
  let isSending = $state(false);

  function autoResize() {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    isSending = true;
    try {
      await onSend(text);
      message = "";
      if (textarea) textarea.style.height = "auto";
    } catch (error) {
      console.error(error);
      showNotification("Gagal mengirim pesan", "error");
    } finally {
      isSending = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function insertEmoji(emoji: string) {
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    message = message.slice(0, cursorPos) + emoji + message.slice(cursorPos);

    queueMicrotask(() => {
      const newPos = cursorPos + emoji.length;
      textarea?.setSelectionRange(newPos, newPos);
      textarea?.focus();
      autoResize();
    });

    showEmoticons = false;
  }

  function toggleEmoticons() {
    showEmoticons = !showEmoticons;
  }
</script>

<div class="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-[40px] border-t border-white/20 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
  {#if showEmoticons}
    <div class="max-h-[240px] overflow-y-auto border-b border-white/20 bg-white/5 backdrop-blur-sm animate-[slideUp_0.2s_ease-out]">
      <div class="grid grid-cols-8 gap-2 p-4">
        {#each EMOTICONS as emoji}
          <span
            class="text-3xl text-center cursor-pointer transition-transform hover:scale-125 active:scale-95 p-2 rounded-[10px] hover:bg-white/15"
            role="button"
            tabindex="0"
            onclick={() => insertEmoji(emoji)}
            onkeydown={(e) => e.key === "Enter" && insertEmoji(emoji)}
          >
            {emoji}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <form class="flex items-end gap-3 p-4" onsubmit={handleSubmit}>
    <button
      type="button"
      class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm {
        showEmoticons 
          ? 'bg-[#007AFF] text-white' 
          : 'text-[#007AFF] hover:bg-white/15 active:scale-95'
      }"
      onclick={toggleEmoticons}
      aria-label="Toggle emoticons"
    >
      <i class="fas fa-smile text-xl"></i>
    </button>

    <textarea
      bind:this={textarea}
      bind:value={message}
      oninput={autoResize}
      onkeydown={handleKeydown}
      placeholder="Ketik pesan..."
      rows="1"
      maxlength="1000"
      class="flex-1 bg-white/10 text-white px-4 py-3 rounded-[20px] resize-none outline-none border border-white/20 placeholder:text-white/50 focus:border-[#007AFF] focus:bg-white/15 transition-all max-h-[120px] overflow-y-auto backdrop-blur-sm"
      style="font-size: 17px; letter-spacing: -0.408px;"
    ></textarea>

    <button
      type="submit"
      class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-lg {
        message.trim() && !isSending
          ? 'bg-[#007AFF] text-white hover:opacity-90 active:scale-[0.92]'
          : 'bg-white/15 text-white/40 cursor-not-allowed'
      }"
      disabled={!message.trim() || isSending}
      aria-label="Send message"
    >
      <i class="fas fa-paper-plane text-base"></i>
    </button>
  </form>
</div>

<style>
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
