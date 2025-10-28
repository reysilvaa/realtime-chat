<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  let url = $state('https://www.google.com');
  let searchQuery = $state('');
  
  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
        url = searchQuery;
      } else if (searchQuery.includes('.')) {
        url = 'https://' + searchQuery;
      } else {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(searchQuery);
      }
    }
  }
</script>

<svelte:head>
  <title>Safari - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Safari" backLink="/" />
  
  <div class="flex-1 pt-[107px] max-w-full mx-auto bg-black flex flex-col" style="-webkit-overflow-scrolling: touch;">
    <!-- Search Bar -->
    <div class="p-4 bg-white/10 backdrop-blur-xl border-b border-white/10">
      <form onsubmit={handleSearch} class="flex gap-2">
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search or enter website"
          class="flex-1 px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#0A84FF]"
        />
        <button type="submit" class="px-5 py-3 bg-[#0A84FF] text-white rounded-[12px] font-semibold transition-all active:opacity-60">
          Go
        </button>
      </form>
    </div>
    
    <!-- Browser Frame -->
    <div class="flex-1 bg-white m-4 rounded-[12px] overflow-hidden shadow-lg animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <iframe 
        src={url} 
        class="w-full h-full border-none"
        title="Safari Browser"
      ></iframe>
    </div>
    
    <!-- Quick Links -->
    <div class="p-4 bg-white/10 backdrop-blur-xl">
      <div class="grid grid-cols-4 gap-3">
        <button onclick={() => { searchQuery = 'https://www.google.com'; handleSearch(new Event('submit')); }} class="p-3 bg-white/5 rounded-[12px] text-white text-xs text-center transition-all active:bg-white/10">
          <i class="fas fa-search text-lg mb-1"></i>
          <div>Google</div>
        </button>
        <button onclick={() => { searchQuery = 'https://www.youtube.com'; handleSearch(new Event('submit')); }} class="p-3 bg-white/5 rounded-[12px] text-white text-xs text-center transition-all active:bg-white/10">
          <i class="fab fa-youtube text-lg mb-1"></i>
          <div>YouTube</div>
        </button>
        <button onclick={() => { searchQuery = 'https://www.github.com'; handleSearch(new Event('submit')); }} class="p-3 bg-white/5 rounded-[12px] text-white text-xs text-center transition-all active:bg-white/10">
          <i class="fab fa-github text-lg mb-1"></i>
          <div>GitHub</div>
        </button>
        <button onclick={() => { searchQuery = 'https://www.twitter.com'; handleSearch(new Event('submit')); }} class="p-3 bg-white/5 rounded-[12px] text-white text-xs text-center transition-all active:bg-white/10">
          <i class="fab fa-twitter text-lg mb-1"></i>
          <div>Twitter</div>
        </button>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>
