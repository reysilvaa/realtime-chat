import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Message, ConnectionStatus } from '$lib/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const messages = writable<Message[]>([]);
export const isLoading = writable<boolean>(false);
export const connectionStatus = writable<ConnectionStatus>('connecting');

let realtimeChannel: RealtimeChannel | null = null;

export async function loadMessages(): Promise<void> {
  isLoading.set(true);
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (error) throw error;
    
    messages.set(data || []);
    connectionStatus.set('connected');
  } catch (error) {
    console.error('Error loading messages:', error);
    connectionStatus.set('error');
    throw error;
  } finally {
    isLoading.set(false);
  }
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
        messages.update(msgs => [...msgs, payload.new as Message]);
        
        if ((payload.new as Message).recipient_name === userName) {
          markMessageAsRead((payload.new as Message).id);
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
