import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Stats } from '$lib/types';

export const stats = writable<Stats>({
  totalMessages: 0,
  totalLetters: 0,
  unreadMessages: 0
});

export async function loadStats(userName?: string): Promise<void> {
  try {
    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    const { count: lettersCount } = await supabase
      .from('letters')
      .select('*', { count: 'exact', head: true });
    
    let unreadCount = 0;
    if (userName) {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_name', userName)
        .is('read_at', null);
      unreadCount = count || 0;
    }
    
    stats.set({
      totalMessages: messagesCount || 0,
      totalLetters: lettersCount || 0,
      unreadMessages: unreadCount
    });
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
