<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  // Mock photos data
  const photos = [
    { id: 1, url: 'https://picsum.photos/400/400?random=1', title: 'Photo 1' },
    { id: 2, url: 'https://picsum.photos/400/400?random=2', title: 'Photo 2' },
    { id: 3, url: 'https://picsum.photos/400/400?random=3', title: 'Photo 3' },
    { id: 4, url: 'https://picsum.photos/400/400?random=4', title: 'Photo 4' },
    { id: 5, url: 'https://picsum.photos/400/400?random=5', title: 'Photo 5' },
    { id: 6, url: 'https://picsum.photos/400/400?random=6', title: 'Photo 6' },
    { id: 7, url: 'https://picsum.photos/400/400?random=7', title: 'Photo 7' },
    { id: 8, url: 'https://picsum.photos/400/400?random=8', title: 'Photo 8' },
    { id: 9, url: 'https://picsum.photos/400/400?random=9', title: 'Photo 9' }
  ];
</script>

<svelte:head>
  <title>Photos - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Photos" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto bg-black overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="p-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <h2 class="text-2xl font-bold text-white mb-4">All Photos</h2>
      
      <!-- Photo Grid -->
      <div class="grid grid-cols-3 gap-1">
        {#each photos as photo (photo.id)}
          <div class="aspect-square overflow-hidden rounded-sm relative group cursor-pointer">
            <img 
              src={photo.url} 
              alt={photo.title}
              class="w-full h-full object-cover transition-transform group-active:scale-95"
            />
            <div class="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors"></div>
          </div>
        {/each}
      </div>
      
      <!-- Albums -->
      <div class="mt-8">
        <h3 class="text-xl font-bold text-white mb-4">Albums</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/10 backdrop-blur-xl rounded-[16px] p-4 border border-white/10">
            <div class="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-[12px] mb-3 flex items-center justify-center">
              <i class="fas fa-heart text-white text-4xl"></i>
            </div>
            <div class="text-white font-semibold">Favorites</div>
            <div class="text-white/60 text-sm">0 items</div>
          </div>
          <div class="bg-white/10 backdrop-blur-xl rounded-[16px] p-4 border border-white/10">
            <div class="aspect-square bg-gradient-to-br from-green-500 to-teal-600 rounded-[12px] mb-3 flex items-center justify-center">
              <i class="fas fa-images text-white text-4xl"></i>
            </div>
            <div class="text-white font-semibold">Recent</div>
            <div class="text-white/60 text-sm">{photos.length} items</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>
