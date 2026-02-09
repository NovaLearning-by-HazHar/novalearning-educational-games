'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import TraceLetterAGame from './TraceLetterAGame';
import TracingCelebration from './components/TracingCelebration';
import TracingProgressOverlay from './components/TracingProgressOverlay';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useTracingState } from './hooks/useTracingState';
import { useCompletedStrokeCount, useOverallProgress } from './hooks/useTracingState';
import { TOTAL_STROKES } from './lib/constants';

/**
 * Trace Letter A with Thandi — Language/Literacy game.
 *
 * Gameplay: Thandi guides child to trace the letter "A" on an easel.
 * 3 strokes: left leg, right leg, crossbar.
 * Each stroke: visual + audio feedback as finger follows the path.
 * After all 3: 3 MVP characters celebrate together (Ubuntu).
 */
export default function TraceLetterAPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const completedCount = useCompletedStrokeCount();
  const overallProgress = useOverallProgress();
  const showThandiHint = useTracingState((s) => s.showThandiHint);
  const resetTracing = useTracingState((s) => s.resetTracing);

  // Session tracking
  const { trackPhase, endSession, resetSession } = useGameSession('trace-letter-a');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Initialize game state on mount
  useEffect(() => {
    reset();
    setActiveCharacter('thandi');
    setTargetInteractions(1); // 1 letter = 1 interaction
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-nature');
    }
  }, [audioReady, setLoaded]);

  // Track phase changes
  useEffect(() => {
    trackPhase(phase);
  }, [phase, trackPhase]);

  // Play celebration melody and record session
  useEffect(() => {
    if (phase === 'celebrate') {
      audioManager.play('celebrate-melody');
      const session = endSession(TOTAL_STROKES);
      addCompletion('trace-letter-a', TOTAL_STROKES, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [phase, endSession, addCompletion]);

  // Play Again handler
  const handlePlayAgain = useCallback(() => {
    reset();
    resetTracing();
    resetSession();
    setActiveCharacter('thandi');
    setTargetInteractions(1);
    setLoaded(true);
    audioManager.play('ambient-nature');
  }, [reset, resetTracing, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Trace Letter A with Thandi">
          <div className="relative w-full h-full">
            <Scene
              cameraPosition={[0, 1.5, 5]}
              cameraFov={50}
              backgroundColor="#E3F2FD"
            >
              <TracingCelebration />
            </Scene>

            {/* Celebration HTML overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-4">
                We traced the letter A together!
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
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameShell title="Trace Letter A with Thandi">
        <div className="relative w-full h-full">
          <Scene
            cameraPosition={[0, 1.5, 5]}
            cameraFov={50}
            backgroundColor="#90CAF9"
          >
            <TraceLetterAGame />
          </Scene>

          {/* Progress overlay */}
          <TracingProgressOverlay
            completedCount={completedCount}
            overallProgress={overallProgress}
            showHint={showThandiHint}
            visible={phase !== 'explore'}
          />
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
