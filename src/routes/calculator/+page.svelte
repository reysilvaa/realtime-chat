<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  let display = $state('0');
  let formula = $state('');
  let currentValue = $state(0);
  let previousValue = $state(0);
  let operation = $state<string | null>(null);
  let resetDisplay = $state(false);
  
  detectUser();
  
  function appendNumber(num: string) {
    if (resetDisplay) {
      display = num;
      resetDisplay = false;
    } else {
      display = display === '0' ? num : display + num;
    }
    if (operation) {
      formula = `${previousValue} ${operation} ${display}`;
    }
  }
  
  function appendDecimal() {
    if (resetDisplay) {
      display = '0.';
      resetDisplay = false;
    } else if (!display.includes('.')) {
      display += '.';
    }
  }
  
  function setOperation(op: string) {
    if (operation !== null) {
      calculate();
    }
    previousValue = parseFloat(display);
    operation = op;
    formula = `${display} ${op}`;
    resetDisplay = true;
  }
  
  function calculate() {
    if (operation === null) return;
    
    currentValue = parseFloat(display);
    let result = 0;
    
    switch (operation) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '×':
        result = previousValue * currentValue;
        break;
      case '÷':
        result = previousValue / currentValue;
        break;
    }
    
    formula = `${previousValue} ${operation} ${currentValue}`;
    display = result.toString();
    operation = null;
    resetDisplay = true;
  }
  
  function clear() {
    display = '0';
    formula = '';
    currentValue = 0;
    previousValue = 0;
    operation = null;
    resetDisplay = false;
  }
  
  function backspace() {
    if (display.length > 1) {
      display = display.slice(0, -1);
    } else {
      display = '0';
    }
  }
</script>

<svelte:head>
  <title>Calculator - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-secondary)]">
  <Header title="Calculator" backLink="/" />
  
  <div class="flex-1 pt-[91px] pb-6 px-6 flex flex-col justify-end animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
    <!-- Display Area -->
    <div class="mb-6 text-right px-2">
      {#if formula}
        <div class="text-[var(--text-secondary)] text-3xl mb-2 font-light" style="font-variant-numeric: tabular-nums;">
          {formula}
        </div>
      {/if}
      <div class="text-[var(--text-primary)] text-7xl font-light overflow-x-auto scrollbar-hide" style="font-variant-numeric: tabular-nums;">
        {display}
      </div>
    </div>
    
    <!-- Calculator Buttons -->
    <div class="grid grid-cols-4 gap-3">
      <!-- Row 1 -->
      <button class="aspect-square rounded-full bg-[#A5A5A5] text-black text-3xl font-normal flex items-center justify-center transition-all active:brightness-75" onclick={clear}>AC</button>
      <button class="aspect-square rounded-full bg-[#A5A5A5] text-black text-3xl font-normal flex items-center justify-center transition-all active:brightness-75" onclick={backspace}>
        <i class="fas fa-plus-minus text-2xl"></i>
      </button>
      <button class="aspect-square rounded-full bg-[#A5A5A5] text-black text-3xl font-normal flex items-center justify-center transition-all active:brightness-75" onclick={appendDecimal}>%</button>
      <button class="aspect-square rounded-full bg-[#FF9F0A] text-white text-4xl font-light flex items-center justify-center transition-all active:brightness-90" onclick={() => setOperation('÷')}>÷</button>
      
      <!-- Row 2 -->
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('7')}>7</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('8')}>8</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('9')}>9</button>
      <button class="aspect-square rounded-full bg-[#FF9F0A] text-white text-4xl font-light flex items-center justify-center transition-all active:brightness-90" onclick={() => setOperation('×')}>×</button>
      
      <!-- Row 3 -->
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('4')}>4</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('5')}>5</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('6')}>6</button>
      <button class="aspect-square rounded-full bg-[#FF9F0A] text-white text-4xl font-light flex items-center justify-center transition-all active:brightness-90" onclick={() => setOperation('-')}>−</button>
      
      <!-- Row 4 -->
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('1')}>1</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('2')}>2</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={() => appendNumber('3')}>3</button>
      <button class="aspect-square rounded-full bg-[#FF9F0A] text-white text-4xl font-light flex items-center justify-center transition-all active:brightness-90" onclick={() => setOperation('+')}>+</button>
      
      <!-- Row 5 -->
      <button class="col-span-2 rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-start pl-8 transition-all active:bg-[#505050]" style="aspect-ratio: 2.2/1;" onclick={() => appendNumber('0')}>0</button>
      <button class="aspect-square rounded-full bg-[#333333] text-white text-3xl font-light flex items-center justify-center transition-all active:bg-[#505050]" onclick={appendDecimal}>.</button>
      <button class="aspect-square rounded-full bg-[#FF9F0A] text-white text-4xl font-light flex items-center justify-center transition-all active:brightness-90" onclick={calculate}>=</button>
    </div>
  </div>
  
  <DevSelector />
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>

