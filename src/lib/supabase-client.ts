import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://wgjoajkwrtzafykrlnwo.supabase.co'; // Replace with your actual URL
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // Replace with your actual key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);