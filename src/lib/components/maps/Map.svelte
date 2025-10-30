<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { MAPS_API } from '$lib/config';
  import { getCurrentLocation } from '$lib/services/locationApi';
  import { searchPlaces, reverseGeocode, type SearchResult } from '$lib/services/mapsApi';

  let map: any;
  let mapContainer: HTMLDivElement;
  let L: any;
  let userMarker: any;
  let searchMarker: any;
  let searchQuery = $state('');
  let searchResults = $state<SearchResult[]>([]);
  let showSearchResults = $state(false);
  let isSearching = $state(false);
  let currentLocationName = $state('Finding location...');
  let showLocationInfo = $state(false);
  let selectedLocation: SearchResult | null = $state(null);
  let userLat = $state(0);
  let userLon = $state(0);

  onMount(async () => {
    if (!browser) return;

    // Load Leaflet
    const leaflet = await import('leaflet');
    L = leaflet.default;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Initialize map
    map = L.map(mapContainer, {
      zoomControl: false,
      attributionControl: false
    }).setView([0, 0], 2);

    L.tileLayer(MAPS_API.tileUrl, {
      maxZoom: MAPS_API.maxZoom,
      attribution: MAPS_API.attribution
    }).addTo(map);

    // Get user location
    try {
      const coords = await getCurrentLocation();
      userLat = coords.latitude;
      userLon = coords.longitude;

      map.setView([coords.latitude, coords.longitude], MAPS_API.defaultZoom);

      // Custom user location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #007AFF;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,122,255,0.5);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarker = L.marker([coords.latitude, coords.longitude], {
        icon: userIcon
      }).addTo(map);

      // Get location name
      currentLocationName = await reverseGeocode(coords.latitude, coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      currentLocationName = 'Location unavailable';
    }
  });

  async function handleSearch() {
    if (searchQuery.length < 3) {
      searchResults = [];
      return;
    }

    isSearching = true;
    const results = await searchPlaces(searchQuery);
    searchResults = results;
    showSearchResults = results.length > 0;
    isSearching = false;
  }

  function selectLocation(result: SearchResult) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    map.setView([lat, lon], 16);

    // Remove existing search marker
    if (searchMarker) {
      map.removeLayer(searchMarker);
    }

    // Add new marker
    const icon = L.divIcon({
      className: 'custom-search-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #FF3B30;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 12px rgba(255,59,48,0.4);
        "></div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    searchMarker = L.marker([lat, lon], { icon }).addTo(map);

    selectedLocation = result;
    showSearchResults = false;
    showLocationInfo = true;
    searchQuery = '';
  }

  function goToUserLocation() {
    if (userLat && userLon) {
      map.setView([userLat, userLon], MAPS_API.defaultZoom);
    }
  }

  function clearSearch() {
    searchQuery = '';
    searchResults = [];
    showSearchResults = false;
  }

  function closeLocationInfo() {
    showLocationInfo = false;
    if (searchMarker) {
      map.removeLayer(searchMarker);
      searchMarker = null;
    }
    selectedLocation = null;
  }

  function openDirections() {
    if (!selectedLocation) return;

    const destLat = parseFloat(selectedLocation.lat);
    const destLon = parseFloat(selectedLocation.lon);
    const destName = encodeURIComponent(selectedLocation.display_name);

    // Detect if iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Try to open Apple Maps
      const appleMapsUrl = `maps://maps.apple.com/?daddr=${destLat},${destLon}&dirflg=d`;
      window.location.href = appleMapsUrl;
      
      // Fallback to web Apple Maps if native app doesn't open
      setTimeout(() => {
        window.open(
          `https://maps.apple.com/?daddr=${destLat},${destLon}&dirflg=d`,
          '_blank'
        );
      }, 500);
    } else {
      // Open Google Maps for other devices
      if (userLat && userLon) {
        // With origin
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${destLat},${destLon}&travelmode=driving`,
          '_blank'
        );
      } else {
        // Without origin, just destination
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}&travelmode=driving`,
          '_blank'
        );
      }
    }
  }

  function shareLocation() {
    if (!selectedLocation) return;

    const destLat = parseFloat(selectedLocation.lat);
    const destLon = parseFloat(selectedLocation.lon);
    const locationUrl = `https://www.google.com/maps?q=${destLat},${destLon}`;
    
    if (navigator.share) {
      // Use Web Share API if available (iOS Safari supports this)
      navigator.share({
        title: selectedLocation.display_name.split(',')[0],
        text: `Check out this location: ${selectedLocation.display_name}`,
        url: locationUrl
      }).catch((error) => {
        console.log('Share cancelled or failed:', error);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(locationUrl).then(() => {
        alert('Location link copied to clipboard!');
      }).catch(() => {
        alert(`Location: ${locationUrl}`);
      });
    }
  }
</script>

<!-- Map Container -->
<div class="flex-1 relative pt-[107px]">
  <div bind:this={mapContainer} class="w-full h-full z-0"></div>

  <!-- Search Bar -->
  <div class="absolute top-[123px] left-4 right-4 z-[1000]">
    <div class="relative">
      <div class="relative bg-white/95 backdrop-blur-[20px] rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-black/5">
        <div class="flex items-center px-4 py-3">
          <i class="fas fa-search text-gray-400 text-base mr-3"></i>
          <input
            type="text"
            bind:value={searchQuery}
            oninput={handleSearch}
            placeholder="Search for a place"
            class="flex-1 bg-transparent text-black text-[17px] outline-none placeholder:text-gray-400"
          />
          {#if searchQuery}
            <button onclick={clearSearch} class="ml-2 text-gray-400 hover:text-gray-600">
              <i class="fas fa-times-circle text-lg"></i>
            </button>
          {/if}
          {#if isSearching}
            <i class="fas fa-spinner fa-spin text-gray-400 ml-2"></i>
          {/if}
        </div>
      </div>

      <!-- Search Results -->
      {#if showSearchResults && searchResults.length > 0}
        <div class="mt-2 bg-white/95 backdrop-blur-[20px] rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-black/5 max-h-[300px] overflow-y-auto">
          {#each searchResults as result}
            <button
              onclick={() => selectLocation(result)}
              class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
            >
              <div class="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0">
                <i class="fas fa-map-marker-alt text-white text-sm"></i>
              </div>
              <div class="flex-1 text-left">
                <div class="text-black text-[15px] font-medium line-clamp-1">
                  {result.display_name.split(',')[0]}
                </div>
                <div class="text-gray-500 text-[13px] line-clamp-1">
                  {result.display_name.split(',').slice(1).join(',').trim()}
                </div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Current Location Button -->
  <button
    onclick={goToUserLocation}
    class="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center z-[1000] active:scale-95 transition-transform"
  >
    <i class="fas fa-location-arrow text-[#007AFF] text-lg"></i>
  </button>

  <!-- Current Location Info -->
  <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-[20px] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-black/5 p-4 z-[999]">
    <div class="flex items-start gap-3">
      <div class="w-12 h-12 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0">
        <i class="fas fa-location-dot text-white text-lg"></i>
      </div>
      <div class="flex-1">
        <div class="text-gray-500 text-[11px] font-semibold uppercase tracking-wide mb-1">Current Location</div>
        <div class="text-black text-[15px] font-semibold">{currentLocationName}</div>
      </div>
    </div>
  </div>
</div>

<!-- Location Info Bottom Sheet -->
{#if showLocationInfo && selectedLocation}
  <div class="absolute inset-0 z-[1001] flex items-end">
    <button
      onclick={closeLocationInfo}
      class="absolute inset-0 bg-black/30 backdrop-blur-sm"
    ></button>
    
    <div class="relative w-full bg-white rounded-t-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.2)] animate-[slideUp_0.3s_ease-out]">
      <div class="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4"></div>
      
      <div class="px-6 pb-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-14 h-14 rounded-full bg-[#FF3B30] flex items-center justify-center flex-shrink-0">
            <i class="fas fa-map-marker-alt text-white text-xl"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-black text-[20px] font-bold mb-1">
              {selectedLocation.display_name.split(',')[0]}
            </h3>
            <p class="text-gray-600 text-[15px]">
              {selectedLocation.display_name.split(',').slice(1).join(',').trim()}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button 
            onclick={openDirections}
            class="flex items-center justify-center gap-2 bg-[#007AFF] text-white py-3 rounded-[12px] font-semibold text-[15px] active:scale-95 transition-transform"
          >
            <i class="fas fa-directions"></i>
            Directions
          </button>
          <button 
            onclick={shareLocation}
            class="flex items-center justify-center gap-2 bg-gray-100 text-black py-3 rounded-[12px] font-semibold text-[15px] active:scale-95 transition-transform"
          >
            <i class="fas fa-share"></i>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :global(.leaflet-container) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  :global(.leaflet-popup-content-wrapper) {
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  }

  :global(.leaflet-popup-tip) {
    display: none;
  }
</style>
