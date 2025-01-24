import { createClient } from '@supabase/supabase-js';
//The unique url to our supabase db
export const supabaseUrl = 'https://mmfaqriobfskiinvrjya.supabase.co';
//it is safe to expose this key only because we have Row Level Security policies implemented on the tables
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZmFxcmlvYmZza2lpbnZyanlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTcwMDIsImV4cCI6MjA1Mjk3MzAwMn0.kx49C2ywQIkOnRA2-USWRgB3Fye_FRgz7833GhwflsM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
