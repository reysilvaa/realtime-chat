<script lang="ts">
  import StatusBar from "./StatusBar.svelte";

  let { children } = $props<{ children?: import("svelte").Snippet }>();

  let currentTime = $state("");

  function updateTime() {
    const now = new Date();
    currentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  }

  $effect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
</script>

<div
  class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] z-[999999] p-5 max-[430px]:static max-[430px]:transform-none max-[430px]:max-w-full max-[430px]:p-0"
>
  <div
    class="w-full max-w-[390px] h-[844px] bg-black rounded-[55px] relative overflow-hidden flex flex-col max-[430px]:max-w-full max-[430px]:h-screen max-[430px]:rounded-none"
    style="box-shadow: 0 0 0 2px #1a1a1a, 0 0 0 4px #2a2a2a, 0 30px 60px rgba(0, 0, 0, 0.8), inset 0 0 1px rgba(255, 255, 255, 0.1);"
  >
    <!-- Status Bar -->
    <StatusBar time={currentTime} />

    <!-- Notch (on top of status bar) -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[210px] h-[30px] bg-black rounded-b-[20px] z-[10001] flex items-center justify-center gap-2 pointer-events-none"
    >
      <div
        class="w-3 h-3 bg-[#1a1a1a] rounded-full shadow-[inset_0_0_3px_rgba(100,100,255,0.3)]"
      ></div>
      <div class="w-[60px] h-1.5 bg-[#0a0a0a] rounded-[3px]"></div>
    </div>

    <!-- Screen Content -->
    <div
      class="flex-1 bg-black overflow-hidden relative [&_:global(.ios-homescreen)]:overflow-hidden [&_:global(*::-webkit-scrollbar)]:hidden"
    >
      {#if children}
        {@render children()}
      {/if}
    </div>

    <!-- Home Indicator -->
    <div
      class="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/30 rounded-[3px] z-[10000]"
    ></div>
  </div>
</div>
