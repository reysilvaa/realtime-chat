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

<div class="mb-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
  <div class="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
    <button class="w-full flex items-center justify-between" onclick={toggleHistory} aria-label="Toggle history">
      <h3 class="text-[17px] font-semibold text-[#1C1C1E] flex items-center gap-2" style="letter-spacing: -0.408px;">
        <i class="fas fa-clock-rotate-left text-[#007AFF]"></i> Riwayat Surat
      </h3>
      <i class="fas fa-chevron-{isExpanded ? 'up' : 'down'} text-[#8E8E93] text-sm"></i>
    </button>
  
  {#if isExpanded}
    <div class="space-y-2 mt-3">
      {#if letters.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-[#8E8E93]">
          <i class="fas fa-inbox text-5xl mb-3 opacity-50"></i>
          <p class="text-[15px]">Belum ada riwayat surat</p>
        </div>
      {:else}
        {#each letters as letter (letter.id)}
          <div class="bg-[#F2F2F7] p-4 rounded-[10px] active:bg-[#E5E5EA] transition-all">
            <div class="flex gap-3">
              <div class="flex-1">
                <div class="font-semibold text-[#1C1C1E] mb-1.5 text-[17px]" style="letter-spacing: -0.408px;">{letter.destination}</div>
                <div class="flex gap-3 text-[13px] text-[#8E8E93] mb-1" style="letter-spacing: -0.08px;">
                  <span>{formatDate(letter.exit_date)}</span>
                  <span>•</span>
                  <span>{letter.sender_name}</span>
                </div>
                <div class="text-[15px] text-[#3C3C43] line-clamp-2" style="letter-spacing: -0.24px;">{letter.purpose}</div>
              </div>
              <div class="flex gap-2 items-center">
                <button class="w-9 h-9 flex items-center justify-center rounded-full bg-[#007AFF] text-white transition-all active:scale-90" onclick={() => onLoad(letter)} title="Lihat">
                  <i class="fas fa-eye text-sm"></i>
                </button>
                <button class="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF3B30] text-white transition-all active:scale-90" onclick={() => letter.id && onDelete(letter.id)} title="Hapus">
                  <i class="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
  </div>
</div>
