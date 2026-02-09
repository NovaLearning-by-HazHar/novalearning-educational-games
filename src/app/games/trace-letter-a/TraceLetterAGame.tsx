'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import { useTracingState } from './hooks/useTracingState';
import {
  LETTER_A_STROKES,
  CELEBRATE_DELAY_MS,
} from './lib/constants';
import WritingEnvironment from './components/WritingEnvironment';
import LetterPath from './components/LetterPath';
import TracingInteraction from './components/TracingInteraction';
import ThandiGuide from './components/ThandiGuide';

/**
 * Trace Letter A 3D game scene — orchestrator.
 * Composes WritingEnvironment, LetterPath, TracingInteraction, and ThandiGuide.
 * Handles tracing logic, audio triggers, and phase transitions.
 */
export default function TraceLetterAGame() {
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const setPhase = useGameStore((s) => s.setPhase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);

  const strokes = useTracingState((s) => s.strokes);
  const currentStroke = useTracingState((s) => s.currentStroke);
  const isTracing = useTracingState((s) => s.isTracing);
  const lastCheckpoint = useTracingState((s) => s.strokes[s.currentStroke]?.lastCheckpoint ?? -1);
  const startTracing = useTracingState((s) => s.startTracing);
  const stopTracing = useTracingState((s) => s.stopTracing);
  const updateStrokeProgress = useTracingState((s) => s.updateStrokeProgress);
  const completeCurrentStroke = useTracingState((s) => s.completeCurrentStroke);
  const triggerThandiHint = useTracingState((s) => s.triggerThandiHint);

  const completedStrokes = strokes.map((s) => s.completed);
  const currentProgress = strokes[currentStroke]?.progress ?? 0;

  const handleTraceStart = useCallback(() => {
    startTracing();

    // Phase transition: on first trace, advance explore → discover → practice
    if (phase === 'explore') {
      advancePhase(); // explore → discover
      setTimeout(() => advancePhase(), 300); // discover → practice
    }

    audioManager.play('tracing-tone');
  }, [phase, advancePhase, startTracing]);

  const handleTraceProgress = useCallback(
    (checkpoint: number, totalCheckpoints: number) => {
      updateStrokeProgress(checkpoint, totalCheckpoints);

      // Play checkpoint tone
      const toneIndex = checkpoint % 6;
      audioManager.play(`checkpoint-${toneIndex + 1}`);
    },
    [updateStrokeProgress]
  );

  const handleStrokeComplete = useCallback(() => {
    completeCurrentStroke();
    audioManager.play('stroke-complete');

    // Check if all strokes are now complete
    const completedCount = strokes.filter((s) => s.completed).length + 1;
    const totalStrokes = LETTER_A_STROKES.length;

    if (completedCount >= totalStrokes) {
      // All strokes complete — play letter sound then celebrate
      audioManager.play('letter-sound');
      incrementInteraction();

      setTimeout(() => {
        audioManager.stopCategory('ambient');
        setPhase('celebrate');
      }, CELEBRATE_DELAY_MS);
    }
  }, [strokes, completeCurrentStroke, incrementInteraction, setPhase]);

  const handleTraceEnd = useCallback(() => {
    stopTracing();
  }, [stopTracing]);

  const handleEmptyTap = useCallback(() => {
    if (phase === 'explore' || phase === 'practice') {
      triggerThandiHint();
    }
  }, [phase, triggerThandiHint]);

  return (
    <>
      <WritingEnvironment />
      <LetterPath
        completedStrokes={completedStrokes}
        currentStroke={currentStroke}
        currentProgress={currentProgress}
      />
      <TracingInteraction
        currentStroke={currentStroke}
        isTracing={isTracing}
        lastCheckpoint={lastCheckpoint}
        onTraceStart={handleTraceStart}
        onTraceProgress={handleTraceProgress}
        onStrokeComplete={handleStrokeComplete}
        onTraceEnd={handleTraceEnd}
        onEmptyTap={handleEmptyTap}
      />
      <ThandiGuide phase={phase} />

      {/* Background plane for empty-area taps */}
      <mesh
        position={[0, 2, -5]}
        onClick={handleEmptyTap}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
