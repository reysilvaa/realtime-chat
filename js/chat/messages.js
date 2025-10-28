import { getSupabaseClient } from '../core/config.js';
import { formatMessageTime, renderMessage } from './ui.js';

export async function loadMessages(currentUserName) {
    const supabase = getSupabaseClient();
    const messagesList = document.getElementById('messagesList');
    
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(100);
        
        if (error) throw error;
        
        if (!messages || messages.length === 0) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>Belum ada pesan<br>Mulai percakapan sekarang!</p>
                </div>
            `;
            return;
        }
        
        messagesList.innerHTML = '<div class="date-separator"><span>Hari ini</span></div>';
        
        messages.forEach(message => {
            const isSent = message.sender_name === currentUserName;
            const messageEl = renderMessage(message, isSent);
            messagesList.appendChild(messageEl);
        });
        
        // Mark messages as read
        await markMessagesAsRead(currentUserName);
        
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Gagal memuat pesan</p>
            </div>
        `;
    }
}

export async function sendMessage(messageText, senderName) {
    const supabase = getSupabaseClient();
    const recipientName = senderName === 'Rey' ? 'Annisa' : 'Rey';
    
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            sender_name: senderName,
            recipient_name: recipientName,
            message: messageText,
            created_at: new Date().toISOString()
        }])
        .select()
        .single();
    
    if (error) throw error;
    
    return data;
}

export function subscribeToMessages(currentUserName) {
    const supabase = getSupabaseClient();
    const messagesList = document.getElementById('messagesList');
    
    // Subscribe to new messages
    const channel = supabase
        .channel('messages-channel')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            },
            (payload) => {
                const message = payload.new;
                const isSent = message.sender_name === currentUserName;
                
                // Remove empty state if exists
                const emptyState = messagesList.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                
                // Add new message
                const messageEl = renderMessage(message, isSent);
                messagesList.appendChild(messageEl);
                
                // Scroll to bottom
                const messagesContainer = document.getElementById('messagesContainer');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Mark as read if received
                if (!isSent) {
                    markMessageAsRead(message.id);
                }
            }
        )
        .subscribe();
    
    return channel;
}

async function markMessagesAsRead(currentUserName) {
    const supabase = getSupabaseClient();
    
    try {
        await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('recipient_name', currentUserName)
            .is('read_at', null);
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

async function markMessageAsRead(messageId) {
    const supabase = getSupabaseClient();
    
    try {
        await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', messageId);
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}
