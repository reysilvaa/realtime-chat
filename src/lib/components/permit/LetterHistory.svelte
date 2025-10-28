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

<div class="mb-6 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-white flex items-center gap-2">
      <i class="fas fa-history text-[#0A84FF]"></i> Riwayat Surat
    </h3>
    <button class="px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors" onclick={toggleHistory} aria-label="Toggle history">
      <i class="fas fa-chevron-{isExpanded ? 'up' : 'down'}"></i>
    </button>
  </div>
  
  {#if isExpanded}
    <div class="space-y-3">
      {#if letters.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-white/40">
          <i class="fas fa-inbox text-5xl mb-3"></i>
          <p class="text-lg">Belum ada riwayat surat</p>
        </div>
      {:else}
        {#each letters as letter (letter.id)}
          <div class="bg-white/10 backdrop-blur-xl p-4 rounded-[16px] border border-white/10 hover:bg-white/15 transition-all">
            <div class="flex gap-3">
              <div class="flex-1">
                <div class="font-semibold text-white mb-2">{letter.destination}</div>
                <div class="flex gap-4 text-sm text-white/60 mb-2">
                  <span><i class="fas fa-calendar mr-1"></i> {formatDate(letter.exit_date)}</span>
                  <span><i class="fas fa-user mr-1"></i> {letter.sender_name}</span>
                </div>
                <div class="text-sm text-white/70 line-clamp-2">{letter.purpose}</div>
              </div>
              <div class="flex flex-col gap-2">
                <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0A84FF]/20 text-[#0A84FF] hover:bg-[#0A84FF]/30 transition-colors" onclick={() => onLoad(letter)} title="Lihat">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" onclick={() => letter.id && onDelete(letter.id)} title="Hapus">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
