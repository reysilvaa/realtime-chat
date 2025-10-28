// Konfigurasi Supabase
export const SUPABASE_CONFIG = {
    url: 'https://zomhbdgmjoczkebtslhb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbWhiZGdtam9jemtlYnRzbGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Njk2NDYsImV4cCI6MjA3NzI0NTY0Nn0.v92vqtBjxXLDM8EX6jLKn7iY2PRmJt3K2ZhU1tx1D3c'
};

export let supabaseClient = null;

export function setSupabaseClient(client) {
    supabaseClient = client;
}

export function getSupabaseClient() {
    return supabaseClient;
}
