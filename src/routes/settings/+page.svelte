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

<div class="app-container">
  <Header title="Settings" backLink="/" />
  
  <div class="main-content">
    <div class="settings-container fade-in">
      <div class="settings-section">
        <h3><i class="fas fa-user"></i> Informasi Pengguna</h3>
        <div class="settings-card">
          <div class="setting-item">
            <span class="setting-label">Nama:</span>
            <span class="setting-value">{user?.userName || 'Loading...'}</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">Device:</span>
            <span class="setting-value">{user?.device || 'Loading...'}</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">Mode:</span>
            <span class="setting-value">{DEV_MODE ? '🔧 Development' : '✅ Production'}</span>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3><i class="fas fa-info-circle"></i> Tentang Aplikasi</h3>
        <div class="settings-card">
          <div class="setting-item">
            <span class="setting-label">Nama:</span>
            <span class="setting-value">ReyNisa App</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">Versi:</span>
            <span class="setting-value">2.0.0 (SvelteKit + TypeScript)</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">Framework:</span>
            <span class="setting-value">SvelteKit 2.0</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">Database:</span>
            <span class="setting-value">Supabase</span>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3><i class="fas fa-book"></i> Fitur</h3>
        <div class="settings-card">
          <div class="feature-list">
            <div class="feature-item">
              <i class="fas fa-comments"></i>
              <span>Chat Real-time</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-file-alt"></i>
              <span>Surat Izin Keluar</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-calculator"></i>
              <span>Calculator</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-mobile-alt"></i>
              <span>Auto User Detection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>

<style>
  .settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .settings-section {
    margin-bottom: 30px;
  }
  
  .settings-section h3 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .settings-section h3 i {
    color: #667eea;
  }
  
  .settings-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .setting-item:last-child {
    border-bottom: none;
  }
  
  .setting-label {
    font-weight: 600;
    color: #666;
  }
  
  .setting-value {
    color: #333;
    font-weight: 500;
  }
  
  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
  
  .feature-item i {
    color: #667eea;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    .settings-container {
      padding: 15px;
    }
    
    .feature-list {
      grid-template-columns: 1fr;
    }
  }
</style>
