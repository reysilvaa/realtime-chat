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

<div class="app-container">
  <Header title="Calculator" backLink="/" />
  
  <div class="main-content">
    <div class="calculator-container fade-in">
      <div class="calculator">
        <div class="calculator-display">{display}</div>
        
        <div class="calculator-buttons">
          <button class="btn-calc function" onclick={clear}>C</button>
          <button class="btn-calc function" onclick={backspace}>←</button>
          <button class="btn-calc function" onclick={() => setOperation('÷')}>÷</button>
          <button class="btn-calc operator" onclick={() => setOperation('×')}>×</button>
          
          <button class="btn-calc" onclick={() => appendNumber('7')}>7</button>
          <button class="btn-calc" onclick={() => appendNumber('8')}>8</button>
          <button class="btn-calc" onclick={() => appendNumber('9')}>9</button>
          <button class="btn-calc operator" onclick={() => setOperation('-')}>-</button>
          
          <button class="btn-calc" onclick={() => appendNumber('4')}>4</button>
          <button class="btn-calc" onclick={() => appendNumber('5')}>5</button>
          <button class="btn-calc" onclick={() => appendNumber('6')}>6</button>
          <button class="btn-calc operator" onclick={() => setOperation('+')}>+</button>
          
          <button class="btn-calc" onclick={() => appendNumber('1')}>1</button>
          <button class="btn-calc" onclick={() => appendNumber('2')}>2</button>
          <button class="btn-calc" onclick={() => appendNumber('3')}>3</button>
          <button class="btn-calc equals" onclick={calculate}>=</button>
          
          <button class="btn-calc zero" onclick={() => appendNumber('0')}>0</button>
          <button class="btn-calc" onclick={appendDecimal}>.</button>
        </div>
      </div>
    </div>
  </div>
  
  <DevSelector />
</div>

<style>
  .calculator-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 20px;
  }
  
  .calculator {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 400px;
    width: 100%;
  }
  
  .calculator-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 20px;
    border-radius: 15px;
    text-align: right;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 20px;
    word-break: break-all;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  .calculator-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .btn-calc {
    padding: 20px;
    font-size: 1.5rem;
    border: none;
    border-radius: 12px;
    background: #f8f9fa;
    color: #333;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-calc:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
  
  .btn-calc:active {
    transform: translateY(0);
  }
  
  .btn-calc.function {
    background: #ff6b6b;
    color: white;
  }
  
  .btn-calc.function:hover {
    background: #ee5a6f;
  }
  
  .btn-calc.operator {
    background: #667eea;
    color: white;
  }
  
  .btn-calc.operator:hover {
    background: #5568d3;
  }
  
  .btn-calc.equals {
    background: #51cf66;
    color: white;
    grid-row: span 2;
  }
  
  .btn-calc.equals:hover {
    background: #40c057;
  }
  
  .btn-calc.zero {
    grid-column: span 2;
  }
  
  @media (max-width: 768px) {
    .calculator-display {
      font-size: 2rem;
      padding: 20px 15px;
      min-height: 60px;
    }
    
    .btn-calc {
      padding: 15px;
      font-size: 1.2rem;
    }
  }
</style>
