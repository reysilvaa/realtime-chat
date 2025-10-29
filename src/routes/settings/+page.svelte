<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import { DEV_MODE } from '$lib/config';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import { theme } from '$lib/stores/theme';
  import type { User } from '$lib/types';
  
  let user = $state<User | null>(detectUser());
  let currentTheme = $theme;
  
  $effect(() => {
    theme.init();
  });
  
  function toggleTheme() {
    theme.toggle();
  }
</script>

<svelte:head>
  <title>Settings - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header title="Settings" backLink="/" />
  
  <div class="flex-1 p-4 pt-[107px] max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="max-w-3xl mx-auto p-5 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- Appearance Section -->
      <div class="mb-6">
        <h3 class="text-[var(--text-primary)] text-[17px] mb-3 flex items-center gap-2 font-semibold" style="letter-spacing: -0.408px;">
          <i class="fas fa-palette text-[#007AFF]"></i> Appearance
        </h3>
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <button 
            onclick={toggleTheme}
            class="w-full flex items-center justify-between p-4 transition-all active:bg-[var(--bg-tertiary)]"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center">
                <i class="fas fa-{currentTheme === 'dark' ? 'moon' : 'sun'} text-white text-lg"></i>
              </div>
              <div class="text-left">
                <div class="text-[var(--text-primary)] font-medium text-[17px]" style="letter-spacing: -0.408px;">Theme</div>
                <div class="text-[var(--text-secondary)] text-[13px]" style="letter-spacing: -0.08px;">{currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[var(--text-tertiary)] text-[15px]">{currentTheme === 'dark' ? '🌙' : '☀️'}</span>
              <i class="fas fa-chevron-right text-[#C7C7CC] text-sm"></i>
            </div>
          </button>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-[var(--text-primary)] text-[17px] mb-3 flex items-center gap-2 font-semibold" style="letter-spacing: -0.408px;">
          <i class="fas fa-user text-[#007AFF]"></i> User Information
        </h3>
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] divide-y divide-[var(--border-primary)]">
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Name</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">{user?.userName || 'Loading...'}</span>
          </div>
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Device</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">{user?.device || 'Loading...'}</span>
          </div>
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Mode</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">{DEV_MODE ? '🔧 Dev' : '✅ Prod'}</span>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-[var(--text-primary)] text-[17px] mb-3 flex items-center gap-2 font-semibold" style="letter-spacing: -0.408px;">
          <i class="fas fa-info-circle text-[#007AFF]"></i> About
        </h3>
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] divide-y divide-[var(--border-primary)]">
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">App Name</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">ReyNisa App</span>
          </div>
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Version</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">2.0.0</span>
          </div>
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Framework</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">SvelteKit</span>
          </div>
          <div class="flex justify-between items-center p-4">
            <span class="text-[var(--text-secondary)] text-[15px]">Database</span>
            <span class="text-[var(--text-primary)] font-medium text-[15px]">Supabase</span>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-[var(--text-primary)] text-[17px] mb-3 flex items-center gap-2 font-semibold" style="letter-spacing: -0.408px;">
          <i class="fas fa-sparkles text-[#007AFF]"></i> Features
        </h3>
        <div class="bg-[var(--card-bg)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-4">
          <div class="grid gap-3 grid-cols-2">
            <div class="flex items-center gap-2.5 p-3 bg-[var(--bg-tertiary)] rounded-[10px]">
              <i class="fas fa-comment text-[#007AFF] text-lg"></i>
              <span class="text-[var(--text-primary)] text-[15px]">Chat</span>
            </div>
            <div class="flex items-center gap-2.5 p-3 bg-[var(--bg-tertiary)] rounded-[10px]">
              <i class="fas fa-file-alt text-[#007AFF] text-lg"></i>
              <span class="text-[var(--text-primary)] text-[15px]">Permits</span>
            </div>
            <div class="flex items-center gap-2.5 p-3 bg-[var(--bg-tertiary)] rounded-[10px]">
              <i class="fas fa-calculator text-[#007AFF] text-lg"></i>
              <span class="text-[var(--text-primary)] text-[15px]">Calculator</span>
            </div>
            <div class="flex items-center gap-2.5 p-3 bg-[var(--bg-tertiary)] rounded-[10px]">
              <i class="fas fa-cloud-sun text-[#007AFF] text-lg"></i>
              <span class="text-[var(--text-primary)] text-[15px]">Weather</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>

