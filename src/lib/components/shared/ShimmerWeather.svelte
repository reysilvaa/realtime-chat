<div class="space-y-4">
  <!-- Current Weather Shimmer -->
  <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6 animate-pulse">
    <div class="h-5 bg-[var(--bg-tertiary)] rounded w-2/3 mx-auto mb-3"></div>
    <div class="h-20 bg-[var(--bg-tertiary)] rounded w-32 mx-auto mb-3"></div>
    <div class="h-8 bg-[var(--bg-tertiary)] rounded w-40 mx-auto mb-3"></div>
    <div class="h-4 bg-[var(--bg-tertiary)] rounded w-32 mx-auto mb-4"></div>
    <div class="h-16 bg-[var(--bg-tertiary)] rounded-full w-16 mx-auto"></div>
  </div>
  
  <!-- Hourly Forecast Shimmer -->
  <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4 animate-pulse">
    <div class="h-3 bg-[var(--bg-tertiary)] rounded w-32 mb-3"></div>
    <div class="flex gap-4 overflow-hidden">
      {#each Array(6) as _}
        <div class="flex flex-col items-center min-w-[60px]">
          <div class="h-4 bg-[var(--bg-tertiary)] rounded w-12 mb-2"></div>
          <div class="h-8 bg-[var(--bg-tertiary)] rounded-full w-8 mb-2"></div>
          <div class="h-5 bg-[var(--bg-tertiary)] rounded w-10"></div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Daily Forecast Shimmer -->
  <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4 animate-pulse">
    <div class="h-3 bg-[var(--bg-tertiary)] rounded w-32 mb-3"></div>
    <div class="space-y-3">
      {#each Array(5) as _}
        <div class="flex items-center justify-between">
          <div class="h-5 bg-[var(--bg-tertiary)] rounded w-16"></div>
          <div class="h-6 bg-[var(--bg-tertiary)] rounded-full w-6"></div>
          <div class="flex gap-3">
            <div class="h-5 bg-[var(--bg-tertiary)] rounded w-10"></div>
            <div class="h-5 bg-[var(--bg-tertiary)] rounded w-10"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Details Shimmer -->
  <div class="grid grid-cols-2 gap-4 animate-pulse">
    <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
      <div class="h-3 bg-[var(--bg-tertiary)] rounded w-16 mb-2"></div>
      <div class="h-10 bg-[var(--bg-tertiary)] rounded w-20"></div>
    </div>
    <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
      <div class="h-3 bg-[var(--bg-tertiary)] rounded w-16 mb-2"></div>
      <div class="h-10 bg-[var(--bg-tertiary)] rounded w-24"></div>
    </div>
  </div>
</div>
