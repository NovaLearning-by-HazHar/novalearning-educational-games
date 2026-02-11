'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import type { GamePhase } from '@/types/game';
import LetterExplorerGame from './LetterExplorerGame';
import ExplorerCelebration from './components/ExplorerCelebration';
import ExplorerOverlay from './components/ExplorerOverlay';
import SpotlightPopup from './components/SpotlightPopup';
import MatchingMiniGame from './components/MatchingMiniGame';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useExplorerState } from './hooks/useExplorerState';
import { ANIMALS } from './lib/constants';

/**
 * Letter Explorer with Sipho — Literacy/Language game.
 *
 * Gameplay: Sipho guides child across a savanna to discover 6 SA animals (A-F).
 * Tap an animal → spotlight popup with letter, name, ubuntu value.
 * After 3 discoveries → matching mini-game (letter ↔ animal).
 * All matched → 6 Rainbow Nation characters celebrate together (Ubuntu).
 *
 * Phase flow: explore → spotlight → explore → ... → matching → celebrate
 */

/** Map explorer phases to central gameStore phases for analytics */
const PHASE_MAP: Record<string, GamePhase> = {
  explore: 'explore',
  spotlight: 'discover',
  matching: 'practice',
  celebrate: 'celebrate',
};

export default function LetterExplorerPage() {
  // Central game store (analytics, loaded state, character)
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);
  const setGamePhase = useGameStore((s) => s.setPhase);

  // Explorer-specific state
  const explorerPhase = useExplorerState((s) => s.phase);
  const currentSpotlight = useExplorerState((s) => s.currentSpotlight);
  const dismissSpotlight = useExplorerState((s) => s.dismissSpotlight);
  const resetExplorer = useExplorerState((s) => s.resetExplorer);

  // Audio
  const { ready: audioReady } = useAudioSetup();

  // Session tracking
  const { trackPhase, endSession, resetSession } = useGameSession('letter-explorer');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Initialize game state on mount
  useEffect(() => {
    reset();
    setActiveCharacter('sipho');
    setTargetInteractions(ANIMALS.length);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready, start ambient
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-savanna');
    }
  }, [audioReady, setLoaded]);

  // Map explorer phases → central gameStore for session analytics
  useEffect(() => {
    const mapped = PHASE_MAP[explorerPhase];
    if (mapped) {
      setGamePhase(mapped);
      trackPhase(mapped);
    }
  }, [explorerPhase, setGamePhase, trackPhase]);

  // On celebrate: play melody, record session + completion
  useEffect(() => {
    if (explorerPhase === 'celebrate') {
      audioManager.stopCategory('ambient');
      audioManager.play('celebrate-melody');

      const session = endSession(ANIMALS.length);
      addCompletion('letter-explorer', ANIMALS.length, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [explorerPhase, endSession, addCompletion]);

  // Play Again handler — proper state reset, no page reload
  const handlePlayAgain = useCallback(() => {
    resetExplorer();
    reset();
    resetSession();
    setActiveCharacter('sipho');
    setTargetInteractions(ANIMALS.length);
    setLoaded(true);
    audioManager.play('ambient-savanna');
  }, [resetExplorer, reset, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Derived booleans
  const isExplore = explorerPhase === 'explore' || explorerPhase === 'spotlight';
  const isMatching = explorerPhase === 'matching';
  const isCelebrate = explorerPhase === 'celebrate';

  // ── Celebrate phase ──────────────────────────────────────────────
  if (isCelebrate) {
    return (
      <ErrorBoundary>
        <GameShell title="Letter Explorer with Sipho">
          <div className="relative w-full h-full">
            <Scene
              cameraPosition={[0, 1.5, 5]}
              cameraFov={50}
              backgroundColor="#FEF7EC"
            >
              <ExplorerCelebration />
            </Scene>

            {/* Celebration HTML overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <h2 className="text-2xl md:text-3xl font-display text-nova-earth text-center mb-4">
                We explored the savanna together!
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

  // ── Explore / Spotlight / Matching phases ────────────────────────
  return (
    <ErrorBoundary>
      <GameShell title="Letter Explorer with Sipho">
        <div className="relative w-full h-full">
          {/* 3D scene — visible during explore and as dimmed backdrop during matching */}
          <Scene
            cameraPosition={[0, 10, 20]}
            cameraFov={45}
            backgroundColor="#87CEEB"
          >
            <LetterExplorerGame />
          </Scene>

          {/* Progress overlay — explore phase only */}
          {isExplore && <ExplorerOverlay />}

          {/* Spotlight popup — when an animal is just discovered */}
          {explorerPhase === 'spotlight' && currentSpotlight && (
            <SpotlightPopup
              animalId={currentSpotlight}
              onDismiss={dismissSpotlight}
            />
          )}

          {/* Matching mini-game — full-screen overlay */}
          {isMatching && (
            <>
              <div className="absolute inset-0 bg-black/60 z-40 pointer-events-none" />
              <MatchingMiniGame />
            </>
          )}
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
