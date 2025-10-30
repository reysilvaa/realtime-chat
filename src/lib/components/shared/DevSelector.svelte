<script lang="ts">
  import { browser } from '$app/environment';
  import { DEV_MODE } from '$lib/config';
  import { currentUser } from '$lib/stores/user';
  
  function handleUserChange(event: Event) {
    if (!browser) return;
    const target = event.target as HTMLSelectElement;
    const url = new URL(window.location.href);
    url.searchParams.set('user', target.value);
    window.location.href = url.toString();
  }
</script>

{#if DEV_MODE}
  <div class="dev-user-selector">
    <div class="dev-selector-content">
      <span class="dev-label">🔧 DEV MODE</span>
      <select 
        class="dev-select" 
        value={$currentUser?.userName.toLowerCase()}
        onchange={handleUserChange}
      >
        <option value="rey">Rey (Android/Desktop)</option>
        <option value="annisa">Annisa (iOS)</option>
      </select>
    </div>
  </div>
{/if}

<style>
  .dev-user-selector {
    position: fixed;
    bottom: 12px;
    right: 12px;
    background: rgba(255, 59, 48, 0.85);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    color: white;
    padding: 6px 10px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
    z-index: 9999;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  .dev-user-selector:hover {
    opacity: 1;
  }
  
  .dev-selector-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .dev-label {
    font-weight: 700;
    font-size: 9px;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .dev-select {
    background: rgba(255, 255, 255, 0.95);
    color: #1d1d1f;
    border: none;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .dev-select:hover {
    background: white;
    transform: scale(1.02);
  }
  
  .dev-select:active {
    transform: scale(0.98);
  }
</style>
