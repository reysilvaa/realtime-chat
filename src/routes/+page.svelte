<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import type { User } from '$lib/types';
  import { stats, loadStats } from '$lib/stores/stats';
  import { logDevInfo } from '$lib/utils/devTools';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import '$lib/styles/ios-homescreen.css';
  
  let user = $state<User | null>(detectUser());
  let statsData = $stats;
  
  $effect(() => {
    if (!user) return;
    logDevInfo(user);
    loadStats(user.userName);
  });
</script>

<svelte:head>
  <title>iPhone - ReyNisa</title>
</svelte:head>

<div class="ios-homescreen">
  <!-- iOS Search -->
  <div class="ios-search">
    <i class="fas fa-search"></i>
    <span>Search</span>
  </div>
  
  <!-- Widget -->
  <div class="widget-area">
    <div class="widget-header">
      <span class="widget-title">Quick Stats</span>
    </div>
    <div class="widget-stats">
      <div class="widget-stat">
        <div class="widget-stat-value">{statsData.totalMessages}</div>
        <div class="widget-stat-label">Messages</div>
      </div>
      <div class="widget-stat">
        <div class="widget-stat-value">{statsData.totalLetters}</div>
        <div class="widget-stat-label">Letters</div>
      </div>
      {#if statsData.unreadMessages > 0}
        <div class="widget-stat">
          <div class="widget-stat-value">{statsData.unreadMessages}</div>
          <div class="widget-stat-label">Unread</div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- iOS App Grid -->
  <div class="app-grid">
    <!-- Messages -->
    <a href="/chat" class="app-icon">
      <div class="app-icon-image green">
        <i class="fas fa-comment"></i>
        {#if statsData.unreadMessages > 0}
          <span class="app-badge">{statsData.unreadMessages}</span>
        {/if}
      </div>
      <span class="app-name">Messages</span>
    </a>
    
    <!-- Safari -->
    <a href="/settings" class="app-icon">
      <div class="app-icon-image blue">
        <i class="fas fa-compass"></i>
      </div>
      <span class="app-name">Safari</span>
    </a>
    
    <!-- Photos -->
    <a href="/permit" class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(135deg, #FF3B30 0%, #FF9500 50%, #FFCC00 100%);">
        <i class="fas fa-image"></i>
      </div>
      <span class="app-name">Photos</span>
    </a>
    
    <!-- Camera -->
    <div class="app-icon">
      <div class="app-icon-image gray">
        <i class="fas fa-camera"></i>
      </div>
      <span class="app-name">Camera</span>
    </div>
    
    <!-- Mail -->
    <div class="app-icon">
      <div class="app-icon-image blue">
        <i class="fas fa-envelope"></i>
      </div>
      <span class="app-name">Mail</span>
    </div>
    
    <!-- Clock -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: #000; border: 2px solid #fff;">
        <i class="fas fa-clock" style="color: white;"></i>
      </div>
      <span class="app-name">Clock</span>
    </div>
    
    <!-- Maps -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);">
        <i class="fas fa-map-marker-alt"></i>
      </div>
      <span class="app-name">Maps</span>
    </div>
    
    <!-- Weather -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%);">
        <i class="fas fa-cloud-sun"></i>
      </div>
      <span class="app-name">Weather</span>
    </div>
    
    <!-- Notes -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(180deg, #FFCC00 0%, #FF9500 100%);">
        <i class="fas fa-sticky-note"></i>
      </div>
      <span class="app-name">Notes</span>
    </div>
    
    <!-- Reminders -->
    <div class="app-icon">
      <div class="app-icon-image red">
        <i class="fas fa-check-circle"></i>
      </div>
      <span class="app-name">Reminders</span>
    </div>
    
    <!-- Calculator -->
    <a href="/calculator" class="app-icon">
      <div class="app-icon-image" style="background: #1C1C1E;">
        <i class="fas fa-calculator" style="color: #FF9F0A;"></i>
      </div>
      <span class="app-name">Calculator</span>
    </a>
    
    <!-- Settings -->
    <a href="/settings" class="app-icon">
      <div class="app-icon-image gray">
        <i class="fas fa-cog"></i>
      </div>
      <span class="app-name">Settings</span>
    </a>
    
    <!-- Files (Permit) -->
    <a href="/permit" class="app-icon">
      <div class="app-icon-image blue">
        <i class="fas fa-folder"></i>
      </div>
      <span class="app-name">Files</span>
    </a>
    
    <!-- Health -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(135deg, #FF2D55 0%, #FF3B30 100%);">
        <i class="fas fa-heartbeat"></i>
      </div>
      <span class="app-name">Health</span>
    </div>
    
    <!-- Wallet -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: #000;">
        <i class="fas fa-wallet" style="color: white;"></i>
      </div>
      <span class="app-name">Wallet</span>
    </div>
    
    <!-- App Store -->
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%);">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
          <path d="M12.5 3c-.3 0-.6.1-.8.4l-3 5.2c-.3.5-.1 1.2.4 1.4.5.3 1.2.1 1.4-.4l2-3.5 2 3.5c.2.4.6.6 1 .6.2 0 .3 0 .5-.1.5-.3.7-.9.4-1.4l-3-5.2c-.3-.3-.6-.5-.9-.5zm-6 4c-.3 0-.6.1-.8.4-.3.5-.1 1.2.4 1.4l8.5 4.9-1.7 3c-.3.5-.1 1.2.4 1.4.2.1.3.1.5.1.4 0 .7-.2.9-.5l2-3.5 2 3.5c.2.3.5.5.9.5.2 0 .3 0 .5-.1.5-.3.7-.9.4-1.4l-1.7-3 8.5-4.9c.5-.3.7-.9.4-1.4-.3-.5-.9-.7-1.4-.4l-8.5 4.9-8.5-4.9c-.1-.1-.3-.1-.4-.1zm-2 10c-.3 0-.6.1-.8.4-.3.5-.1 1.2.4 1.4l8 4.6c.2.1.3.1.5.1s.3 0 .5-.1l8-4.6c.5-.3.7-.9.4-1.4-.3-.5-.9-.7-1.4-.4l-7.5 4.3-7.5-4.3c-.2 0-.4-.1-.6-.1z"/>
        </svg>
      </div>
      <span class="app-name">App Store</span>
    </div>
  </div>
  
  <!-- Page Dots -->
  <div class="page-dots">
    <div class="page-dot active"></div>
    <div class="page-dot"></div>
  </div>
  
  <!-- iOS Dock -->
  <div class="ios-dock">
    <a href="/chat" class="app-icon">
      <div class="app-icon-image green">
        <i class="fas fa-comment"></i>
      </div>
    </a>
    
    <div class="app-icon">
      <div class="app-icon-image blue">
        <i class="fas fa-compass"></i>
      </div>
    </div>
    
    <div class="app-icon">
      <div class="app-icon-image" style="background: linear-gradient(135deg, #FF375F 0%, #FF2D55 100%);">
        <i class="fas fa-music"></i>
      </div>
    </div>
    
    <a href="/permit" class="app-icon">
      <div class="app-icon-image blue">
        <i class="fas fa-folder"></i>
      </div>
    </a>
  </div>
  
  <DevSelector />
</div>
