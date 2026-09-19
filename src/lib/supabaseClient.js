import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crylfdmolimcdynbskvt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ASjW1nfYQHX6CKdE3B-KUw_o7Rwa_4y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
