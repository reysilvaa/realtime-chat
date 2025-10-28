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

<div class="message-input-container">
  {#if showEmoticons}
    <div class="emoticon-picker show">
      <div class="emoticon-grid">
        {#each EMOTICONS as emoji}
          <span
            class="emoticon"
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

  <form class="message-form" onsubmit={handleSubmit}>
    <button
      type="button"
      class="emoji-btn {showEmoticons ? 'active' : ''}"
      onclick={toggleEmoticons}
      aria-label="Toggle emoticons"
    >
      <i class="fas fa-smile"></i>
    </button>

    <textarea
      bind:this={textarea}
      bind:value={message}
      oninput={autoResize}
      onkeydown={handleKeydown}
      placeholder="Ketik pesan..."
      rows="1"
      maxlength="1000"
    ></textarea>

    <button
      type="submit"
      class="send-btn"
      disabled={!message.trim() || isSending}
      aria-label="Send message"
    >
      <i class="fas fa-paper-plane"></i>
    </button>
  </form>
</div>
