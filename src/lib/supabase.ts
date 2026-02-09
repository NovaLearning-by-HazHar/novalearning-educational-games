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

// --- Phase 3: Typed database helpers (null-safe) ---

import type { ProgressRow } from '@/types/game';

/** Insert or update progress rows. Returns null if supabase unavailable. */
export async function upsertProgress(rows: ProgressRow[]) {
  if (!supabase || rows.length === 0) return null;
  return supabase.from('progress').upsert(rows);
}

/** Get progress for a child. Returns null if supabase unavailable. */
export async function getChildProgress(childId: string) {
  if (!supabase) return null;
  return supabase
    .from('progress')
    .select('*')
    .eq('child_id', childId)
    .order('completed_at', { ascending: false });
}
