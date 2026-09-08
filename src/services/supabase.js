import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co');
let client = null;
if (isSupabaseConfigured) {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey);
    }
    catch (error) {
        console.warn('Failed to initialize Supabase client. Running in resilient Demo/Local Mode.', error);
    }
}
export const supabase = client;
