import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Message, ConnectionStatus } from '$lib/types';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isCacheValid } from '$lib/utils/cache';
import { CACHE_DURATIONS } from '$lib/config';
import { showMessageNotification } from '$lib/utils/pwa';
import { browser } from '$app/environment';

export const messages = writable<Message[]>([]);
export const isLoading = writable<boolean>(false);
export const connectionStatus = writable<ConnectionStatus>('connecting');

let realtimeChannel: RealtimeChannel | null = null;
let lastFetched: number | null = null;

export async function loadMessages(forceRefresh: boolean = false): Promise<void> {
  // Check cache validity
  if (!forceRefresh && lastFetched && isCacheValid(lastFetched, CACHE_DURATIONS.messages)) {
    console.log('✅ Using cached messages');
    return;
  }

  console.log('🔄 Fetching fresh messages...');
  isLoading.set(true);
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (error) throw error;
    
    messages.set(data || []);
    lastFetched = Date.now();
    connectionStatus.set('connected');
  } catch (error) {
    console.error('Error loading messages:', error);
    lastFetched = null;
    connectionStatus.set('error');
    throw error;
  } finally {
    isLoading.set(false);
  }
}

export function refreshMessages(): Promise<void> {
  return loadMessages(true);
}

export async function sendMessage(messageText: string, senderName: string): Promise<Message> {
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
  
  // Update cache timestamp after sending
  lastFetched = Date.now();
  
  return data;
}

export function subscribeToMessages(userName: string): RealtimeChannel {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }
  
  realtimeChannel = supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        const newMessage = payload.new as Message;
        messages.update(msgs => [...msgs, newMessage]);
        // Update cache timestamp when new message arrives
        lastFetched = Date.now();
        
        // Show notification if message is for current user
        if (newMessage.recipient_name === userName) {
          markMessageAsRead(newMessage.id);
          
          // Show push notification (even in foreground for better UX)
          if (browser) {
            // Only show if app is hidden or if user wants notifications always
            if (document.hidden || !document.hasFocus()) {
              showMessageNotification(newMessage.sender_name, newMessage.message);
            }
          }
        }
      }
    )
    .subscribe();
  
  return realtimeChannel;
}

export async function markMessagesAsRead(userName: string): Promise<void> {
  try {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('recipient_name', userName)
      .is('read_at', null);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

async function markMessageAsRead(messageId: number): Promise<void> {
  try {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}

export function unsubscribeFromMessages(): void {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}
