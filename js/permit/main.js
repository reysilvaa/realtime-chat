import { elements } from './dom.js';
import { detectDeviceAndSetName } from './device.js';
import { showNotification, updateConnectionStatus, toggleHistory } from './ui.js';
import { initializeSupabase, loadHistory, loadLetter, checkConnection } from './supabase.js';
import { 
    handleFormSubmit, 
    handlePreview, 
    handleEdit, 
    handlePrint, 
    handleSave,
    setupFormValidation,
    setDefaultDates
} from './form.js';
import { setupAutoSave, loadFormData } from './storage.js';
import { showUserSelector, logDevInfo } from '../core/dev-tools.js';

async function initializeApp() {
    try {
        await initializeSupabase();
        updateConnectionStatus(true);
        setupEventListeners();
        loadHistory();
        
        const currentUser = detectDeviceAndSetName();
        logDevInfo({ userName: currentUser.senderName, device: currentUser.device });
        showUserSelector({ userName: currentUser.senderName, device: currentUser.device });
        
        setDefaultDates();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Gagal terhubung ke server. Periksa koneksi internet.', 'error');
        updateConnectionStatus(false);
    }
}

function setupEventListeners() {
    elements.permitForm.addEventListener('submit', handleFormSubmit);
    elements.previewBtn.addEventListener('click', handlePreview);
    elements.editBtn.addEventListener('click', handleEdit);
    elements.printBtn.addEventListener('click', handlePrint);
    elements.saveBtn.addEventListener('click', handleSave);
    elements.toggleHistoryBtn.addEventListener('click', toggleHistory);
    
    setupFormValidation();
    setupAutoSave();
}

function setupConnectionMonitoring() {
    document.addEventListener('visibilitychange', async function() {
        if (!document.hidden) {
            const isConnected = await checkConnection();
            updateConnectionStatus(isConnected);
        }
    });
    
    setInterval(async function() {
        const isConnected = await checkConnection();
        updateConnectionStatus(isConnected);
    }, 30000);
}

window.loadLetterFromHistory = loadLetter;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupConnectionMonitoring();
    setTimeout(loadFormData, 100);
});
