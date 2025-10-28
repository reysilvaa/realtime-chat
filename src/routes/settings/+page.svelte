<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import { DEV_MODE } from '$lib/config';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import type { User } from '$lib/types';
  
  let user = $state<User | null>(detectUser());
</script>

<svelte:head>
  <title>Settings - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Settings" backLink="/" />
  
  <div class="flex-1 p-4 pt-[107px] max-w-full mx-auto overflow-y-auto bg-black" style="-webkit-overflow-scrolling: touch;">
    <div class="max-w-3xl mx-auto p-5 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <div class="mb-8">
        <h3 class="text-white text-xl mb-4 flex items-center gap-2.5 font-semibold">
          <i class="fas fa-user text-[#0A84FF]"></i> Informasi Pengguna
        </h3>
        <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 border border-white/10">
          <div class="flex justify-between items-center py-4 border-b border-white/10">
            <span class="font-semibold text-white/70">Nama:</span>
            <span class="text-white font-medium">{user?.userName || 'Loading...'}</span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-white/10">
            <span class="font-semibold text-white/70">Device:</span>
            <span class="text-white font-medium">{user?.device || 'Loading...'}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="font-semibold text-white/70">Mode:</span>
            <span class="text-white font-medium">{DEV_MODE ? '🔧 Development' : '✅ Production'}</span>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-white text-xl mb-4 flex items-center gap-2.5 font-semibold">
          <i class="fas fa-info-circle text-[#0A84FF]"></i> Tentang Aplikasi
        </h3>
        <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 border border-white/10">
          <div class="flex justify-between items-center py-4 border-b border-white/10">
            <span class="font-semibold text-white/70">Nama:</span>
            <span class="text-white font-medium">ReyNisa App</span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-white/10">
            <span class="font-semibold text-white/70">Versi:</span>
            <span class="text-white font-medium">2.0.0 (SvelteKit + TypeScript)</span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-white/10">
            <span class="font-semibold text-white/70">Framework:</span>
            <span class="text-white font-medium">SvelteKit 2.0</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="font-semibold text-white/70">Database:</span>
            <span class="text-white font-medium">Supabase</span>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-white text-xl mb-4 flex items-center gap-2.5 font-semibold">
          <i class="fas fa-book text-[#0A84FF]"></i> Fitur
        </h3>
        <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 border border-white/10">
          <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            <div class="flex items-center gap-2.5 p-4 bg-white/5 rounded-[14px] transition-all hover:bg-white/10 hover:-translate-y-0.5">
              <i class="fas fa-comments text-[#0A84FF] text-xl"></i>
              <span class="text-white">Chat Real-time</span>
            </div>
            <div class="flex items-center gap-2.5 p-4 bg-white/5 rounded-[14px] transition-all hover:bg-white/10 hover:-translate-y-0.5">
              <i class="fas fa-file-alt text-[#0A84FF] text-xl"></i>
              <span class="text-white">Surat Izin Keluar</span>
            </div>
            <div class="flex items-center gap-2.5 p-4 bg-white/5 rounded-[14px] transition-all hover:bg-white/10 hover:-translate-y-0.5">
              <i class="fas fa-calculator text-[#0A84FF] text-xl"></i>
              <span class="text-white">Calculator</span>
            </div>
            <div class="flex items-center gap-2.5 p-4 bg-white/5 rounded-[14px] transition-all hover:bg-white/10 hover:-translate-y-0.5">
              <i class="fas fa-mobile-alt text-[#0A84FF] text-xl"></i>
              <span class="text-white">Auto User Detection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>

