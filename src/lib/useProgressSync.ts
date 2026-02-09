'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useSupabaseAuth } from '@/lib/useSupabaseAuth';
import {
  createGameSession,
  completeGameSession,
  upsertStudentProgress,
} from '@/lib/supabase';
import type { SyncStatus } from '@/types/game';

/** Skill category lookup for known games. */
const GAME_SKILL_MAP: Record<string, string> = {
  'count-to-five': 'numeracy',
  'trace-letter-a': 'literacy',
};

/**
 * Progress sync hook (Pattern 1: Request Lifecycle + Pattern 6: Reconnect).
 *
 * Adapts useMCPConnection's sendRequest() lifecycle and reconnect() into
 * a debounced, offline-resilient Zustand-to-Supabase sync.
 *
 * Flow per unsynced completion:
 * 1. Create game_sessions row (via games.slug lookup)
 * 2. Complete the session with score/duration
 * 3. Upsert student_progress aggregate for the skill category
 *
 * Behavior:
 * - Fully inert when unauthenticated or supabase unavailable (zero overhead)
 * - Debounces 2s after new completions before syncing
 * - Listens for browser 'online' event to flush on reconnect
 * - Silent failure — local store is source of truth
 */
export function useProgressSync(studentId?: string) {
  const { status: authStatus } = useSupabaseAuth();
  const completedGames = useProgressStore((s) => s.completedGames);
  const lastSynced = useProgressStore((s) => s.lastSynced);
  const setLastSynced = useProgressStore((s) => s.setLastSynced);
  const getUnsynced = useProgressStore((s) => s.getUnsynced);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Can we sync right now? */
  const canSync = authStatus === 'authenticated' && !!studentId;

  /** Execute sync of unsynced completions to Supabase */
  const sync = useCallback(async () => {
    if (!canSync) return;

    const unsynced = getUnsynced();
    if (unsynced.length === 0) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('syncing');

    try {
      for (const g of unsynced) {
        const skillCategory = GAME_SKILL_MAP[g.gameId] ?? 'numeracy';

        // 1. Create game session (looks up game by slug)
        const session = await createGameSession(
          studentId!,
          g.gameId,
          g.deviceTier ? { tier: g.deviceTier } : undefined
        );

        if (session) {
          // 2. Complete the session with results
          await completeGameSession(session.id, {
            score: g.interactions,
            maxScore: g.interactions, // perfect score for counting game
            durationSeconds: g.durationSeconds ?? 0,
            completed: true,
            attempts: 1,
            performanceData: {
              phasesVisited: g.phasesVisited ?? [],
              deviceTier: g.deviceTier ?? null,
            },
          });
        }

        // 3. Upsert aggregate student progress
        await upsertStudentProgress(studentId!, skillCategory, {
          totalGamesPlayed: completedGames.filter((c) => c.gameId === g.gameId).length,
          totalTimeSeconds: g.durationSeconds ?? 0,
          masteryPercentage: 100, // completed = full mastery for now
        });
      }

      setLastSynced(new Date().toISOString());
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Progress sync failed:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 30000);
    }
  }, [canSync, studentId, getUnsynced, setLastSynced, completedGames]);

  // Debounced sync when completedGames changes
  useEffect(() => {
    if (!canSync) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { sync(); }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [completedGames.length, canSync, sync]);

  // Sync on network reconnect (Pattern 6: Reconnect)
  useEffect(() => {
    if (!canSync) return;

    const handleOnline = () => { sync(); };
    window.addEventListener('online', handleOnline);
    return () => { window.removeEventListener('online', handleOnline); };
  }, [canSync, sync]);

  // Set offline status when disconnected
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine && canSync) {
      setSyncStatus('offline');
    }

    const handleOffline = () => { if (canSync) setSyncStatus('offline'); };
    const handleOnline = () => { if (canSync) setSyncStatus('idle'); };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [canSync]);

  const unsyncedCount = lastSynced
    ? completedGames.filter((g) => g.completedAt > lastSynced).length
    : completedGames.length;

  return { syncStatus, unsyncedCount, sync };
}
