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
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    z-index: 9999;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: devPulse 2s infinite;
  }
  
  @keyframes devPulse {
    0%, 100% { box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4); }
    50% { box-shadow: 0 4px 20px rgba(255, 107, 107, 0.6); }
  }
  
  .dev-selector-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .dev-label {
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  
  .dev-select {
    background: white;
    color: #333;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
  }
  
  .dev-select:hover {
    background: #f8f9fa;
  }
</style>
