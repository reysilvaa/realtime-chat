import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Letter } from '$lib/types';

export const letters = writable<Letter[]>([]);
export const currentLetter = writable<Letter | null>(null);
export const isLoadingLetters = writable<boolean>(false);

export async function loadLetters(): Promise<void> {
  isLoadingLetters.set(true);
  
  try {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    letters.set(data || []);
  } catch (error) {
    console.error('Error loading letters:', error);
    throw error;
  } finally {
    isLoadingLetters.set(false);
  }
}

export async function saveLetter(letter: Letter): Promise<Letter> {
  const { data, error } = await supabase
    .from('letters')
    .insert([{
      ...letter,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  letters.update(list => [data, ...list]);
  
  return data;
}

export async function deleteLetter(id: number): Promise<void> {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  letters.update(list => list.filter(l => l.id !== id));
}
