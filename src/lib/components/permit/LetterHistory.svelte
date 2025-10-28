<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  import type { Letter } from '$lib/types';
  
  interface Props {
    letters: Letter[];
    onLoad: (letter: Letter) => void;
    onDelete: (id: number) => void;
  }
  
  let { letters, onLoad, onDelete }: Props = $props();
  
  let isExpanded = $state(false);
  
  function toggleHistory() {
    isExpanded = !isExpanded;
  }
</script>

<div class="history-section fade-in">
  <div class="history-header">
    <h3><i class="fas fa-history"></i> Riwayat Surat</h3>
    <button class="btn-ghost" onclick={toggleHistory} aria-label="Toggle history">
      <i class="fas fa-chevron-{isExpanded ? 'up' : 'down'}"></i>
    </button>
  </div>
  
  {#if isExpanded}
    <div class="history-list">
      {#if letters.length === 0}
        <div class="empty-history">
          <i class="fas fa-inbox"></i>
          <p>Belum ada riwayat surat</p>
        </div>
      {:else}
        {#each letters as letter (letter.id)}
          <div class="history-item">
            <div class="history-content">
              <div class="history-title">{letter.destination}</div>
              <div class="history-meta">
                <span><i class="fas fa-calendar"></i> {formatDate(letter.exit_date)}</span>
                <span><i class="fas fa-user"></i> {letter.sender_name}</span>
              </div>
              <div class="history-purpose">{letter.purpose}</div>
            </div>
            <div class="history-actions">
              <button class="btn-icon" onclick={() => onLoad(letter)} title="Lihat">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-icon danger" onclick={() => letter.id && onDelete(letter.id)} title="Hapus">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
