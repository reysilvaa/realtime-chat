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
    background: rgba(255, 59, 48, 0.9);
    backdrop-filter: saturate(180%) blur(30px);
    -webkit-backdrop-filter: saturate(180%) blur(30px);
    color: white;
    padding: 12px 16px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px rgba(255, 59, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    z-index: 9999;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: devPulse 2s infinite;
  }
  
  @keyframes devPulse {
    0%, 100% { box-shadow: 0 8px 24px rgba(255, 59, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
    50% { box-shadow: 0 8px 32px rgba(255, 59, 48, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
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
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .dev-select {
    background: rgba(255, 255, 255, 0.95);
    color: #1d1d1f;
    border: none;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
