<script lang="ts">
  interface Props {
    count?: number;
    height?: string;
  }
  
  let { count = 1, height = 'h-24' }: Props = $props();
</script>

<div class="space-y-4 animate-pulse">
  {#each Array(count) as _}
    <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
      <div class="h-4 bg-[var(--bg-tertiary)] rounded w-3/4 mb-3"></div>
      <div class="{height} bg-[var(--bg-tertiary)] rounded w-full"></div>
    </div>
  {/each}
</div>
