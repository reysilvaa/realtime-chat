<script lang="ts">
  import { onMount } from "svelte";
  import {
    installPrompt,
    isInstalled,
    isStandalone,
    isIOS,
    isIOSStandalone,
  } from "$lib/stores/pwaInstall";
  import { showNotification } from "$lib/stores/notifications";

  let showPrompt = $state(false);
  let dismissed = $state(false);
  let showIOSInstructions = $state(false);

  // Check if should show prompt
  $effect(() => {
    const prompt = $installPrompt;
    const installed = $isInstalled;
    const standalone = $isStandalone;
    const ios = $isIOS;
    const iosStandalone = $isIOSStandalone;

    // For iOS: show instructions if not installed
    if (ios && !iosStandalone && !installed && !dismissed) {
      setTimeout(() => {
        showIOSInstructions = true;
        showPrompt = true;
      }, 2000);
      return;
    }

    // For Android/Chrome: show prompt if available
    if (prompt && !installed && !standalone && !dismissed && !ios) {
      // Delay showing prompt for better UX
      setTimeout(() => {
        showIOSInstructions = false;
        showPrompt = true;
      }, 2000);
    } else {
      showPrompt = false;
      showIOSInstructions = false;
    }
  });

  async function handleInstall() {
    const prompt = $installPrompt;
    if (!prompt) return;

    try {
      // Show the install prompt
      await prompt.prompt();

      // Wait for user response
      const { outcome } = await prompt.userChoice;

      if (outcome === "accepted") {
        showNotification("Aplikasi sedang diinstall...", "success");
        installPrompt.set(null);
        showPrompt = false;
      } else {
        showNotification("Installasi dibatalkan", "info");
        dismissed = true;
        showPrompt = false;
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      showNotification("Gagal menginstall aplikasi", "error");
    }
  }

  function handleDismiss() {
    dismissed = true;
    showPrompt = false;
    // Store dismissal in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    }
  }

  onMount(() => {
    // Check if user previously dismissed
    if (typeof window !== "undefined") {
      const dismissedTime = localStorage.getItem("pwa-install-dismissed");
      if (dismissedTime) {
        const daysSinceDismissed =
          (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        // Show again after 7 days
        if (daysSinceDismissed < 7) {
          dismissed = true;
        }
      }
    }
  });
</script>

{#if showPrompt}
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-end sm:items-center justify-center p-4"
    style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
    onclick={handleDismiss}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Escape" && handleDismiss()}
  >
    <div
      class="bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.key === "Escape" && handleDismiss()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      tabindex="-1"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div
          class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
        >
          <i class="fas fa-mobile-alt text-white text-4xl"></i>
        </div>
      </div>

      <!-- iOS Instructions -->
      {#if showIOSInstructions}
        <!-- Title -->
        <h2
          id="install-title"
          class="text-2xl font-bold text-gray-900 text-center mb-2"
        >
          Tambah ke Home Screen
        </h2>

        <!-- Description -->
        <p class="text-gray-600 text-center mb-6 text-[15px] leading-relaxed">
          Untuk menginstall aplikasi di iPhone/iPad, ikuti langkah berikut:
        </p>

        <!-- iOS Steps -->
        <div class="space-y-4 mb-6">
          <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-[14px]">
            <div
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold"
            >
              1
            </div>
            <div class="flex-1">
              <p class="text-gray-800 font-medium text-[14px] mb-1">
                Tap tombol Share
              </p>
              <p class="text-gray-600 text-[13px]">
                Di bagian bawah browser (ikon kotak dengan panah ke atas)
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-[14px]">
            <div
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold"
            >
              2
            </div>
            <div class="flex-1">
              <p class="text-gray-800 font-medium text-[14px] mb-1">
                Pilih "Add to Home Screen"
              </p>
              <p class="text-gray-600 text-[13px]">
                Scroll ke bawah dan pilih opsi "Tambahkan ke Layar Utama"
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-[14px]">
            <div
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold"
            >
              3
            </div>
            <div class="flex-1">
              <p class="text-gray-800 font-medium text-[14px] mb-1">
                Tap "Add"
              </p>
              <p class="text-gray-600 text-[13px]">
                Konfirmasi untuk menambahkan aplikasi ke home screen
              </p>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="bg-gray-50 rounded-[14px] p-4 mb-6">
          <p class="text-gray-700 text-[13px] font-medium mb-2">
            Setelah diinstall:
          </p>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-check text-green-600 text-xs"></i>
              <span class="text-gray-600 text-[12px]"
                >Akses cepat tanpa browser</span
              >
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-check text-green-600 text-xs"></i>
              <span class="text-gray-600 text-[12px]">Notifikasi real-time</span
              >
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-check text-green-600 text-xs"></i>
              <span class="text-gray-600 text-[12px]">Bekerja offline</span>
            </div>
          </div>
        </div>

        <!-- Button -->
        <button
          onclick={handleDismiss}
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-[14px] transition-all active:scale-[0.98] shadow-lg"
        >
          Mengerti
        </button>
      {:else}
        <!-- Android/Chrome Install -->
        <!-- Title -->
        <h2
          id="install-title"
          class="text-2xl font-bold text-gray-900 text-center mb-2"
        >
          Install Aplikasi
        </h2>

        <!-- Description -->
        <p class="text-gray-600 text-center mb-6 text-[15px] leading-relaxed">
          Install aplikasi untuk pengalaman yang lebih baik, akses cepat, dan
          notifikasi langsung!
        </p>

        <!-- Benefits -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-check text-green-600 text-sm"></i>
            </div>
            <span class="text-gray-700 text-[14px]"
              >Akses cepat tanpa browser</span
            >
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-check text-green-600 text-sm"></i>
            </div>
            <span class="text-gray-700 text-[14px]">Notifikasi real-time</span>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-check text-green-600 text-sm"></i>
            </div>
            <span class="text-gray-700 text-[14px]">Bekerja offline</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            onclick={handleInstall}
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-[14px] transition-all active:scale-[0.98] shadow-lg"
          >
            Install Sekarang
          </button>
          <button
            onclick={handleDismiss}
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-[14px] transition-all active:scale-[0.98]"
          >
            Nanti
          </button>
        </div>
      {/if}

      <!-- Close button -->
      <button
        onclick={handleDismiss}
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        aria-label="Tutup"
      >
        <i class="fas fa-times text-gray-600 text-sm"></i>
      </button>
    </div>
  </div>
{/if}
