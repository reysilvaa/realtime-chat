<script lang="ts">
  interface Props {
    count?: number;
  }
  
  let { count = 5 }: Props = $props();
</script>

<div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4 animate-pulse">
  <div class="space-y-3">
    {#each Array(count) as _}
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
          <div class="h-3 bg-[var(--bg-tertiary)] rounded w-1/2"></div>
        </div>
      </div>
    {/each}
  </div>
</div>
