<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  let display = $state('0');
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
    
    display = result.toString();
    operation = null;
    resetDisplay = true;
  }
  
  function clear() {
    display = '0';
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

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Calculator" backLink="/" />
  
  <div class="flex-1 p-4 pt-[107px] max-w-full mx-auto overflow-y-auto bg-black" style="-webkit-overflow-scrolling: touch;">
    <div class="flex justify-center items-center p-5 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]" style="min-height: calc(100vh - 200px);">
      <div class="bg-white/10 backdrop-blur-xl rounded-[24px] p-6 w-full max-w-md border border-white/10">
        <div class="text-white px-6 py-8 rounded-[20px] text-right text-5xl font-semibold mb-5 min-h-[90px] flex items-center justify-end break-all shadow-[0_4px_16px_rgba(102,126,234,0.3)]" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          {display}
        </div>
        
        <div class="grid grid-cols-4 gap-3">
          <button class="p-5 text-2xl border-none rounded-[16px] bg-red-500 text-white font-semibold cursor-pointer transition-all hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={clear}>C</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-red-500 text-white font-semibold cursor-pointer transition-all hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={backspace}>←</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-red-500 text-white font-semibold cursor-pointer transition-all hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => setOperation('÷')}>÷</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-purple-600 text-white font-semibold cursor-pointer transition-all hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => setOperation('×')}>×</button>
          
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('7')}>7</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('8')}>8</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('9')}>9</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-purple-600 text-white font-semibold cursor-pointer transition-all hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => setOperation('-')}>-</button>
          
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('4')}>4</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('5')}>5</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('6')}>6</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-purple-600 text-white font-semibold cursor-pointer transition-all hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => setOperation('+')}>+</button>
          
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('1')}>1</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('2')}>2</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={() => appendNumber('3')}>3</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-green-500 text-white font-semibold cursor-pointer transition-all hover:bg-green-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 row-span-2" onclick={calculate}>=</button>
          
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 col-span-2" onclick={() => appendNumber('0')}>0</button>
          <button class="p-5 text-2xl border-none rounded-[16px] bg-gray-100 text-gray-800 font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onclick={appendDecimal}>.</button>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>

