'use client';

import { useEffect, useCallback } from 'react';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import CountToFiveGame from './CountToFiveGame';
import CountingCelebration from './components/CountingCelebration';
import ProgressOverlay from './components/ProgressOverlay';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useCountingState, usePickedCount } from './hooks/useCountingState';

/**
 * Count to 5 with Sipho — Numeracy game.
 *
 * Gameplay: Sipho guides child to tap 5 mangoes from a tree.
 * Each tap: mango arcs to basket + marimba note + counting beep.
 * After 5: 3 MVP characters celebrate together (Ubuntu).
 */
export default function CountToFivePage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const pickedCount = usePickedCount();
  const showSiphoHint = useCountingState((s) => s.showSiphoHint);
  const resetCounting = useCountingState((s) => s.resetCounting);

  // Initialize game state on mount
  useEffect(() => {
    reset();
    setActiveCharacter('sipho');
    setTargetInteractions(5);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      // Start ambient wind
      audioManager.play('ambient-wind');
    }
  }, [audioReady, setLoaded]);

  // Play celebration melody when entering celebrate phase
  useEffect(() => {
    if (phase === 'celebrate') {
      audioManager.play('celebrate-melody');
    }
  }, [phase]);

  // Play Again handler
  const handlePlayAgain = useCallback(() => {
    reset();
    resetCounting();
    setActiveCharacter('sipho');
    setTargetInteractions(5);
    setLoaded(true);
    // Restart ambient
    audioManager.play('ambient-wind');
  }, [reset, resetCounting, setActiveCharacter, setTargetInteractions, setLoaded]);

  if (phase === 'celebrate') {
    return (
      <GameShell title="Count to 5 with Sipho">
        <div className="relative w-full h-full">
          <Scene
            cameraPosition={[0, 1.5, 5]}
            cameraFov={50}
            backgroundColor="#FFF8E1"
          >
            <CountingCelebration />
          </Scene>

          {/* Celebration HTML overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
            <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-4">
              We counted to five together!
            </h2>
            <button
              onClick={handlePlayAgain}
              className="pointer-events-auto px-8 py-3 bg-nova-sun text-nova-earth font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform"
            >
              Play Again
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Count to 5 with Sipho">
      <div className="relative w-full h-full">
        <Scene
          cameraPosition={[0, 2, 6]}
          cameraFov={45}
          backgroundColor="#87CEEB"
        >
          <CountToFiveGame />
        </Scene>

        {/* Progress overlay */}
        <ProgressOverlay
          pickedCount={pickedCount}
          total={5}
          showHint={showSiphoHint}
          visible={phase !== 'explore'}
        />
      </div>
    </GameShell>
  );
}
