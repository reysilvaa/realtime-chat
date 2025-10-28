import { SUPABASE_CONFIG, setSupabaseClient, getSupabaseClient } from '../core/config.js';
import { elements } from './dom.js';
import { formatDate } from '../core/utils.js';
import { showNotification, showLetterSection } from './ui.js';
import { generateLetter } from './letter.js';
import { detectDeviceAndSetName } from './device.js';

export async function initializeSupabase() {
    const client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    setSupabaseClient(client);
    
    const { data, error } = await client.from('letters').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') {
        throw error;
    }
    
    return client;
}

export async function saveLetter(letterData) {
    const supabase = getSupabaseClient();
    
    const data = {
        sender_name: letterData.senderName,
        recipient_name: letterData.recipientName,
        exit_date: letterData.exitDate,
        exit_time: letterData.exitTime,
        return_date: letterData.returnDate,
        return_time: letterData.returnTime,
        destination: letterData.destination,
        purpose: letterData.purpose,
        companions: letterData.companions || null,
        created_at: new Date().toISOString()
    };
    
    const { data: result, error } = await supabase
        .from('letters')
        .insert([data]);
    
    if (error) throw error;
    
    await loadHistory();
    return result;
}

export async function loadHistory() {
    const supabase = getSupabaseClient();
    
    try {
        const { data: letters, error } = await supabase
            .from('letters')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) {
            console.log('History table might not exist yet:', error);
            return;
        }
        
        displayHistory(letters);
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function displayHistory(letters) {
    if (!letters || letters.length === 0) {
        elements.historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Belum ada riwayat surat</div>';
        return;
    }
    
    const historyHTML = letters.map(letter => {
        const date = formatDate(new Date(letter.created_at));
        const exitDate = formatDate(new Date(letter.exit_date));
        
        return `
            <div class="history-item" onclick="window.loadLetterFromHistory('${letter.id}')">
                <div class="history-meta">
                    <span class="history-date">${date}</span>
                    <span class="history-status status-approved">Tersimpan</span>
                </div>
                <div class="history-preview">
                    <strong>${letter.sender_name}</strong> → ${letter.recipient_name}<br>
                    ${exitDate} • ${letter.destination}
                </div>
            </div>
        `;
    }).join('');
    
    elements.historyList.innerHTML = historyHTML;
}

export async function loadLetter(letterId) {
    const supabase = getSupabaseClient();
    
    try {
        const { data: letter, error } = await supabase
            .from('letters')
            .select('*')
            .eq('id', letterId)
            .single();
        
        if (error) throw error;
        
        elements.exitDate.value = letter.exit_date;
        elements.exitTime.value = letter.exit_time;
        elements.returnDate.value = letter.return_date;
        elements.returnTime.value = letter.return_time;
        elements.destination.value = letter.destination;
        elements.purpose.value = letter.purpose;
        elements.companions.value = letter.companions || '';
        
        detectDeviceAndSetName();
        generateLetter();
        showLetterSection();
        
        showNotification('Surat berhasil dimuat');
        
    } catch (error) {
        console.error('Error loading letter:', error);
        showNotification('Gagal memuat surat', 'error');
    }
}

export async function checkConnection() {
    const supabase = getSupabaseClient();
    if (!supabase) return false;
    
    try {
        await supabase.from('letters').select('count').limit(1);
        return true;
    } catch (error) {
        return false;
    }
}
