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

// --- Phase 3: Typed database helpers (null-safe, matches live schema) ---

import type { GameSessionRow, StudentProgressRow } from '@/types/game';

/** Look up game by slug, then insert a game_sessions row. */
export async function createGameSession(
  studentId: string,
  gameSlug: string,
  deviceInfo?: Record<string, unknown>
): Promise<{ id: string } | null> {
  if (!supabase) return null;

  const { data: game } = await supabase
    .from('games')
    .select('id')
    .eq('slug', gameSlug)
    .single();

  if (!game) return null;

  const { data: session } = await supabase
    .from('game_sessions')
    .insert({
      student_id: studentId,
      game_id: game.id,
      device_info: deviceInfo ?? {},
    })
    .select('id')
    .single();

  return session;
}

/** Complete a game session with results. */
export async function completeGameSession(
  sessionId: string,
  results: {
    score: number;
    maxScore: number;
    durationSeconds: number;
    completed: boolean;
    attempts?: number;
    performanceData?: Record<string, unknown>;
  }
) {
  if (!supabase) return null;
  return supabase
    .from('game_sessions')
    .update({
      completed_at: new Date().toISOString(),
      score: results.score,
      max_score: results.maxScore,
      duration_seconds: results.durationSeconds,
      completed: results.completed,
      attempts: results.attempts ?? 1,
      performance_data: results.performanceData ?? {},
    })
    .eq('id', sessionId);
}

/** Upsert aggregate student progress for a skill category. */
export async function upsertStudentProgress(
  studentId: string,
  skillCategory: string,
  stats: {
    currentLevel?: number;
    totalGamesPlayed: number;
    totalTimeSeconds: number;
    masteryPercentage: number;
  }
) {
  if (!supabase) return null;
  return supabase
    .from('student_progress')
    .upsert(
      {
        student_id: studentId,
        skill_category: skillCategory,
        current_level: stats.currentLevel ?? 1,
        total_games_played: stats.totalGamesPlayed,
        total_time_seconds: stats.totalTimeSeconds,
        mastery_percentage: stats.masteryPercentage,
        last_played_at: new Date().toISOString(),
      } satisfies Omit<StudentProgressRow, 'id'>,
      { onConflict: 'student_id,skill_category' }
    );
}

/** Get aggregate progress for a student. */
export async function getStudentProgress(studentId: string) {
  if (!supabase) return null;
  return supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', studentId)
    .order('last_played_at', { ascending: false });
}

/** Get game session history for a student with game titles. */
export async function getStudentSessions(studentId: string) {
  if (!supabase) return null;
  return supabase
    .from('game_sessions')
    .select('*, games(title, slug)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);
}

// Re-export types used by consumers
export type { GameSessionRow, StudentProgressRow };
