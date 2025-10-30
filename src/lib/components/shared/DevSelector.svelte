<script lang="ts">
  import { browser } from "$app/environment";
  import { DEV_MODE } from "$lib/config";
  import { currentUser } from "$lib/stores/user";

  function handleUserChange(event: Event) {
    if (!browser) return;
    const target = event.target as HTMLSelectElement;
    const url = new URL(window.location.href);
    url.searchParams.set("user", target.value);
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
    bottom: 8px;
    right: 8px;
    background: rgba(255, 59, 48, 0.75);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    color: white;
    padding: 3px 6px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 6px rgba(255, 59, 48, 0.2);
    z-index: 9999;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0.5;
    transition: all 0.2s ease;
    max-width: 32px;
    overflow: hidden;
  }

  .dev-user-selector:hover {
    opacity: 1;
    max-width: 300px;
    padding: 6px 10px;
  }

  .dev-selector-content {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .dev-label {
    font-weight: 700;
    font-size: 8px;
    letter-spacing: 0.2px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .dev-select {
    background: rgba(255, 255, 255, 0.95);
    color: #1d1d1f;
    border: none;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
