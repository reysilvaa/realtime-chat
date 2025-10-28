import { SUPABASE_CONFIG } from '../core/config.js';
import { getUserFromQuery, showUserSelector, logDevInfo } from '../core/dev-tools.js';

let supabase;
let currentUser;

// Detect device and set user
function detectUser() {
    // Check for manual override via query parameter
    const manualUser = getUserFromQuery();
    if (manualUser) {
        return manualUser;
    }
    
    // Auto-detect from user agent
    const userAgent = navigator.userAgent.toLowerCase();
    let userName = '';
    let device = '';
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        userName = 'Annisa';
        device = 'iOS';
    } else if (userAgent.includes('android')) {
        userName = 'Rey';
        device = 'Android';
    } else {
        userName = 'Rey';
        device = 'Desktop';
    }
    
    return { userName, device };
}

async function initializeApp() {
    try {
        // Initialize Supabase
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        // Detect user
        currentUser = detectUser();
        document.getElementById('userName').textContent = currentUser.userName;
        
        // Log dev info
        logDevInfo(currentUser);
        
        // Show dev user selector
        showUserSelector(currentUser);
        
        // Load stats
        await loadStats();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

async function loadStats() {
    try {
        // Load total messages
        const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });
        
        document.getElementById('totalMessages').textContent = messagesCount || 0;
        
        // Load total letters
        const { count: lettersCount } = await supabase
            .from('letters')
            .select('*', { count: 'exact', head: true });
        
        document.getElementById('totalLetters').textContent = lettersCount || 0;
        
        // Load unread messages count for badge
        const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_name', currentUser.userName)
            .is('read_at', null);
        
        const chatBadge = document.getElementById('chatBadge');
        if (unreadCount > 0) {
            chatBadge.textContent = unreadCount;
            chatBadge.setAttribute('data-count', unreadCount);
        } else {
            chatBadge.setAttribute('data-count', '0');
        }
        
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('totalMessages').textContent = '-';
        document.getElementById('totalLetters').textContent = '-';
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
