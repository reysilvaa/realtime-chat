import { SUPABASE_CONFIG, setSupabaseClient, getSupabaseClient } from '../core/config.js';
import { detectUser } from './user.js';
import { loadMessages, sendMessage, subscribeToMessages } from './messages.js';
import { showNotification, updateConnectionStatus, scrollToBottom } from './ui.js';
import { showUserSelector, logDevInfo } from '../core/dev-tools.js';

let currentUser;

async function initializeApp() {
    try {
        // Initialize Supabase
        const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        setSupabaseClient(supabase);
        
        // Test connection
        const { error } = await supabase.from('messages').select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        updateConnectionStatus(true);
        
        // Detect current user
        currentUser = detectUser();
        
        // Log dev info
        logDevInfo(currentUser);
        
        // Show dev user selector
        showUserSelector(currentUser);
        
        // Update UI
        const recipientName = currentUser.userName === 'Rey' ? 'Annisa' : 'Rey';
        document.getElementById('chatTitle').textContent = recipientName;
        
        // Load messages
        await loadMessages(currentUser.userName);
        
        // Subscribe to realtime updates
        subscribeToMessages(currentUser.userName);
        
        // Setup event listeners
        setupEventListeners();
        
        // Scroll to bottom
        setTimeout(scrollToBottom, 100);
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Gagal terhubung ke server', 'error');
        updateConnectionStatus(false);
    }
}

function setupEventListeners() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    
    // Form submit
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        try {
            await sendMessage(message, currentUser.userName);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Gagal mengirim pesan', 'error');
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Enter to send (Shift+Enter for newline)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);
