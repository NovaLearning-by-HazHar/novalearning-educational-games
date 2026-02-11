'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useCountingAnimalsState } from './hooks/useCountingAnimalsState';
import CountingAnimalsGame from './CountingAnimalsGame';

/**
 * Counting Animals — Numeracy game (2D).
 *
 * Gameplay: Child counts SA animals displayed on screen, picks the correct number.
 * 5 rounds per session. Three difficulty levels (1-3, 1-5, 1-10).
 *
 * Integration:
 * - GameShell: mute toggle, loading state, audio unlock
 * - gameStore: maps screens to EXPLORE→PRACTICE→CELEBRATE phases
 * - progressStore: records completed sessions
 * - useGameSession: session tracking + eventBus emissions
 * - audioManager: Web Audio synthesis for all sounds
 */
export default function CountingAnimalsPage() {
  const setPhase = useGameStore((s) => s.setPhase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const screen = useCountingAnimalsState((s) => s.screen);
  const correctAnswers = useCountingAnimalsState((s) => s.correctAnswers);

  const { ready: audioReady } = useAudioSetup();
  const { trackPhase, endSession } = useGameSession('counting-animals');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Initialize game store on mount
  useEffect(() => {
    reset();
    setActiveCharacter('lerato'); // Lerato = Kind helper, social learning
    setTargetInteractions(5);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
    }
  }, [audioReady, setLoaded]);

  // Map game screens to gameStore phases for analytics
  useEffect(() => {
    switch (screen) {
      case 'menu':
        setPhase('explore');
        trackPhase('explore');
        break;
      case 'playing':
        setPhase('practice');
        trackPhase('practice');
        break;
      case 'celebration':
        // Mid-round celebration (handled within playing)
        break;
      case 'complete':
        setPhase('celebrate');
        trackPhase('celebrate');
        // Record completed session
        audioManager.play('ca-celebrate');
        audioManager.stopCategory('ambient');
        const session = endSession(correctAnswers);
        addCompletion('counting-animals', correctAnswers, {
          durationSeconds: session.durationSeconds,
          phasesVisited: session.phasesVisited,
          deviceTier: session.deviceTier,
        });
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <ErrorBoundary>
      <GameShell title="Counting Animals">
        <CountingAnimalsGame />
      </GameShell>
    </ErrorBoundary>
  );
}
