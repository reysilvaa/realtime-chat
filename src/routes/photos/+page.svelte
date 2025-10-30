<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import { photos } from '$lib/stores/photos';
  
  detectUser();
  
  let allPhotos = $photos;
  let selectedPhoto = $state<string | null>(null);
  
  function deletePhoto(id: string) {
    if (confirm('Delete this photo?')) {
      photos.deletePhoto(id);
    }
  }
  
  function closePreview() {
    selectedPhoto = null;
  }
</script>

<svelte:head>
  <title>Photos - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header title="Photos" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="p-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-[var(--text-primary)]">
          {#if allPhotos.length > 0}
            {allPhotos.length} {allPhotos.length === 1 ? 'Photo' : 'Photos'}
          {:else}
            No Photos
          {/if}
        </h2>
        {#if allPhotos.length > 0}
          <button 
            onclick={() => {
              if (confirm('Delete all photos?')) {
                photos.clearAll();
              }
            }}
            class="text-[#FF3B30] text-sm font-medium active:opacity-60"
          >
            Clear All
          </button>
        {/if}
      </div>
      
      {#if allPhotos.length === 0}
        <!-- Empty State -->
        <div class="flex flex-col items-center justify-center py-20">
          <i class="fas fa-camera text-6xl text-[var(--text-tertiary)] mb-4"></i>
          <p class="text-[var(--text-secondary)] text-center mb-2">No photos yet</p>
          <p class="text-[var(--text-tertiary)] text-sm text-center mb-6">Take photos with Camera to see them here</p>
          <a 
            href="/camera"
            class="px-6 py-3 bg-[#007AFF] text-white rounded-[12px] font-semibold transition-all active:opacity-60"
          >
            Open Camera
          </a>
        </div>
      {:else}
        <!-- Photo Grid -->
        <div class="grid grid-cols-3 gap-1">
          {#each allPhotos as photo (photo.id)}
            <div class="aspect-square overflow-hidden rounded-sm relative group cursor-pointer">
              <button
                onclick={() => selectedPhoto = photo.dataUrl}
                class="w-full h-full"
              >
                <img 
                  src={photo.dataUrl} 
                  alt={photo.name}
                  class="w-full h-full object-cover transition-transform group-active:scale-95"
                />
                <div class="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors"></div>
              </button>
              <button
                onclick={(e) => {
                  e.stopPropagation();
                  deletePhoto(photo.id);
                }}
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i class="fas fa-trash text-white text-xs"></i>
              </button>
            </div>
          {/each}
        </div>
      {/if}
      
      <!-- Albums -->
      <div class="mt-8">
        <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Albums</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-[var(--card-bg)] rounded-[12px] p-4 border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
            <div class="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-[12px] mb-3 flex items-center justify-center">
              <i class="fas fa-heart text-white text-4xl"></i>
            </div>
            <div class="text-[var(--text-primary)] font-semibold">Favorites</div>
            <div class="text-[var(--text-secondary)] text-sm">0 items</div>
          </div>
          <div class="bg-[var(--card-bg)] rounded-[12px] p-4 border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
            <div class="aspect-square bg-gradient-to-br from-green-500 to-teal-600 rounded-[12px] mb-3 flex items-center justify-center">
              <i class="fas fa-images text-white text-4xl"></i>
            </div>
            <div class="text-[var(--text-primary)] font-semibold">Recent</div>
            <div class="text-[var(--text-secondary)] text-sm">{photos.length} items</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
  
  <!-- Photo Preview Modal -->
  {#if selectedPhoto}
    <div class="fixed inset-0 bg-black z-[9999] flex flex-col">
      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 p-4 pt-12 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onclick={closePreview}
          class="w-10 h-10 flex items-center justify-center text-white"
        >
          <i class="fas fa-times text-2xl"></i>
        </button>
        <button 
          onclick={() => {
            const link = document.createElement('a');
            link.href = selectedPhoto;
            link.download = `photo-${Date.now()}.jpg`;
            link.click();
          }}
          class="w-10 h-10 flex items-center justify-center text-white"
        >
          <i class="fas fa-download text-xl"></i>
        </button>
      </div>
      
      <!-- Image -->
      <div class="flex-1 flex items-center justify-center p-4">
        <img 
          src={selectedPhoto} 
          alt="Preview"
          class="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  {/if}
</div>
