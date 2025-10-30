<script lang="ts">
  import { showNotification } from "$lib/stores/notifications";
  import { emojiStore } from "$lib/stores/emojis";
  import { onMount } from "svelte";

  // Props style baru Svelte 5
  const { onSend }: { onSend: (message: string) => Promise<void> } = $props();

  let message = $state("");
  let textarea = $state<HTMLTextAreaElement | null>(null);
  let showEmoticons = $state(false);
  let isSending = $state(false);
  let selectedCategory = $state<string | null>(null);

  onMount(() => {
    emojiStore.loadEmojis();
  });

  const displayedEmojis = $derived(
    selectedCategory
      ? $emojiStore.groupedEmojis.get(selectedCategory) || []
      : Array.from($emojiStore.groupedEmojis.values()).flat().slice(0, 80)
  );

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

<div
  class="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-[40px] border-t border-white/20 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
  style="backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);"
>
  {#if showEmoticons}
    <div
      class="border-b border-white/20 bg-white/5 backdrop-blur-sm animate-[slideUp_0.2s_ease-out]"
    >
      {#if $emojiStore.loading}
        <div class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3 text-white/60">
            <i class="fas fa-spinner fa-spin text-xl"></i>
            <span class="text-sm">Loading emojis...</span>
          </div>
        </div>
      {:else if $emojiStore.error}
        <div class="flex items-center justify-center py-12">
          <div class="text-center text-white/60">
            <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
            <p class="text-sm">Gagal memuat emoji</p>
          </div>
        </div>
      {:else if $emojiStore.groupedEmojis.size > 0}
        <div
          class="flex gap-1 overflow-x-auto px-3 py-2 border-b border-white/10 no-scrollbar"
        >
          <button
            type="button"
            class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all {selectedCategory ===
            null
              ? 'bg-[#007AFF] text-white'
              : 'text-white/70 hover:bg-white/10'}"
            onclick={() => (selectedCategory = null)}
          >
            All
          </button>
          {#each Array.from($emojiStore.groupedEmojis.keys()) as category}
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all {selectedCategory ===
              category
                ? 'bg-[#007AFF] text-white'
                : 'text-white/70 hover:bg-white/10'}"
              onclick={() => (selectedCategory = category)}
            >
              {category}
            </button>
          {/each}
        </div>

        <div class="max-h-[240px] overflow-y-auto">
          <div class="grid grid-cols-8 gap-1 p-3">
            {#each displayedEmojis as emoji}
              <button
                type="button"
                class="text-2xl text-center cursor-pointer transition-all hover:scale-125 active:scale-95 p-2.5 rounded-[12px] hover:bg-white/15 flex items-center justify-center"
                onclick={() => insertEmoji(emoji.character)}
                title={emoji.unicodeName}
              >
                {emoji.character}
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <div class="flex items-center justify-center py-12">
          <p class="text-sm text-white/60">Tidak ada emoji tersedia</p>
        </div>
      {/if}
    </div>
  {/if}

  <form class="flex items-end gap-3 p-4" onsubmit={handleSubmit}>
    <button
      type="button"
      class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm {showEmoticons
        ? 'bg-[#007AFF] text-white'
        : 'text-[#007AFF] hover:bg-white/15 active:scale-95'}"
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
      class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-lg {message.trim() &&
      !isSending
        ? 'bg-[#007AFF] text-white hover:opacity-90 active:scale-[0.92]'
        : 'bg-white/15 text-white/40 cursor-not-allowed'}"
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

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
