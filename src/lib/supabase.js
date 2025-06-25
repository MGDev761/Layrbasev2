import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pthzpmwjsoetvbwggdbd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aHpwbXdqc29ldHZid2dnZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTUxNjUsImV4cCI6MjA2NTk5MTE2NX0.LpJU5ln5EN0l_chKYolNv_81XmZPp7doMb9d4cutU-s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: 'https://layrbase.vercel.app/auth/callback'
  }
}); 