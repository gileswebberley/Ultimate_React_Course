import { createClient } from '@supabase/supabase-js';
//The unique url to our supabase db
export const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

export default supabase;
