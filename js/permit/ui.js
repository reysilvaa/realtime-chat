import { elements } from './dom.js';
import { loadHistory } from './supabase.js';

export function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 4000);
}

export function updateConnectionStatus(isConnected) {
    if (isConnected) {
        elements.statusDot.classList.add('online');
        elements.statusText.textContent = 'Ready';
    } else {
        elements.statusDot.classList.remove('online');
        elements.statusText.textContent = 'Offline';
    }
}

export function showFormSection() {
    elements.formSection.style.display = 'block';
    elements.letterSection.style.display = 'none';
    elements.formSection.classList.add('fade-in');
}

export function showLetterSection() {
    elements.formSection.style.display = 'none';
    elements.letterSection.style.display = 'block';
    elements.letterSection.classList.add('fade-in');
    
    elements.letterSection.scrollIntoView({ behavior: 'smooth' });
}

export function toggleHistory() {
    const isVisible = elements.historyList.style.display !== 'none';
    
    if (isVisible) {
        elements.historyList.style.display = 'none';
        elements.toggleHistoryBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        elements.historyList.style.display = 'block';
        elements.toggleHistoryBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        loadHistory();
    }
}
