'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useSupabaseAuth } from '@/lib/useSupabaseAuth';
import { upsertProgress } from '@/lib/supabase';
import type { SyncStatus, ProgressRow } from '@/types/game';

/**
 * Progress sync hook (Pattern 1: Request Lifecycle + Pattern 6: Reconnect).
 *
 * Adapts useMCPConnection's sendRequest() lifecycle and reconnect() into
 * a debounced, offline-resilient Zustand-to-Supabase sync.
 *
 * Behavior:
 * - Fully inert when unauthenticated or supabase unavailable (zero overhead)
 * - Debounces 2s after new completions before syncing
 * - Listens for browser 'online' event to flush on reconnect
 * - Silent failure — local store is source of truth
 */
export function useProgressSync(childId?: string) {
  const { status: authStatus } = useSupabaseAuth();
  const completedGames = useProgressStore((s) => s.completedGames);
  const lastSynced = useProgressStore((s) => s.lastSynced);
  const setLastSynced = useProgressStore((s) => s.setLastSynced);
  const getUnsynced = useProgressStore((s) => s.getUnsynced);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Can we sync right now? */
  const canSync = authStatus === 'authenticated' && !!childId;

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
      const rows: ProgressRow[] = unsynced.map((g) => ({
        child_id: childId!,
        game_id: g.gameId,
        completed_at: g.completedAt,
        interactions: g.interactions,
        duration_seconds: g.durationSeconds ?? null,
        phases_visited: g.phasesVisited ?? [],
        device_tier: g.deviceTier ?? null,
      }));

      const result = await upsertProgress(rows);

      if (result?.error) {
        console.warn('Progress sync error:', result.error.message);
        setSyncStatus('error');
        // Auto-recover to idle after 30s
        setTimeout(() => setSyncStatus('idle'), 30000);
        return;
      }

      setLastSynced(new Date().toISOString());
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Progress sync failed:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 30000);
    }
  }, [canSync, childId, getUnsynced, setLastSynced]);

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
