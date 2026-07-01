import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️  Supabase env vars not found. Running in offline-only mode.\n' +
        'Create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
        'See .env.example for instructions.'
    );
}

// Create client — works even with placeholder URLs (offline mode)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    }
);

export function isSupabaseConfigured(): boolean {
    return (
        !!import.meta.env.VITE_SUPABASE_URL &&
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
        !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder')
    );
}
