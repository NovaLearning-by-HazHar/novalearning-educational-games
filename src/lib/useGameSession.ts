'use client';

import { useRef, useCallback } from 'react';
import type { GamePhase, GameSession, DeviceTier } from '@/types/game';
import { getDeviceConfig } from '@/lib/deviceDetect';
import { gameEvents } from '@/lib/eventBus';

interface SessionRef {
  id: string;
  start: number;
  phases: Set<GamePhase>;
}

/**
 * Game session tracking hook (Pattern 5: Session Management).
 *
 * Adapts useMCPConnection's createSession() into a lightweight
 * mount-to-unmount play session tracker. Uses refs to avoid
 * re-renders on every tick. Session data feeds into progressStore
 * and eventBus on completion.
 */
export function useGameSession(gameId: string) {
  const sessionRef = useRef<SessionRef>({
    id: `${gameId}-${Date.now()}`,
    start: Date.now(),
    phases: new Set<GamePhase>(),
  });

  /** Record a phase visit */
  const trackPhase = useCallback((phase: GamePhase) => {
    const prev = sessionRef.current.phases;
    if (!prev.has(phase)) {
      const from = prev.size > 0
        ? Array.from(prev)[prev.size - 1]
        : phase;
      sessionRef.current.phases.add(phase);
      gameEvents.emit('game:phase_change', { from, to: phase });
    }
  }, []);

  /** End session and return data for progressStore */
  const endSession = useCallback((interactions: number): GameSession => {
    const s = sessionRef.current;
    const durationSeconds = Math.round((Date.now() - s.start) / 1000);
    let tier: DeviceTier = 'medium';
    try { tier = getDeviceConfig().tier; } catch { /* fallback */ }

    const session: GameSession = {
      sessionId: s.id,
      gameId,
      startedAt: new Date(s.start).toISOString(),
      endedAt: new Date().toISOString(),
      interactions,
      durationSeconds,
      phasesVisited: Array.from(s.phases) as GamePhase[],
      deviceTier: tier,
    };

    gameEvents.emit('game:session_end', {
      gameId,
      sessionId: s.id,
      duration: durationSeconds,
    });

    return session;
  }, [gameId]);

  /** Reset for Play Again */
  const resetSession = useCallback(() => {
    const newId = `${gameId}-${Date.now()}`;
    sessionRef.current = {
      id: newId,
      start: Date.now(),
      phases: new Set<GamePhase>(),
    };
    gameEvents.emit('game:session_start', { gameId, sessionId: newId });
  }, [gameId]);

  return { trackPhase, endSession, resetSession, sessionId: sessionRef.current.id };
}
