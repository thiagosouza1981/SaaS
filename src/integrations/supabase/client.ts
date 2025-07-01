import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zblalosogbtxhhnxosaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibGFsb3NvZ2J0eGhobnhvc2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzQ5MTcsImV4cCI6MjA2Njk1MDkxN30.b_zvB9QC_k0hSpk-8WLsebRfDniPaXPP7gAUag2zmIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});