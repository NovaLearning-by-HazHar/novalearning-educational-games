import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Supabase client for NovaLearning.
 * Used for: auth, progress tracking, parent portal.
 * Returns null if environment variables are not configured.
 */
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
