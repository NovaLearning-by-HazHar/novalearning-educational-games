'use client';

import { useEffect, useCallback, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import type { CoinId } from './types/money-skills';
import { DISCOVER_THRESHOLD, PRACTICE_THRESHOLD } from './lib/constants';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useMoneySkillsState, useExploredCount } from './hooks/useMoneySkillsState';
import MoneySkillsGame from './MoneySkillsGame';
import CoinCelebration from './components/CoinCelebration';
import CoinInspector from './components/CoinInspector';
import PracticeRound from './components/PracticeRound';
import ProgressBeads from './components/ProgressBeads';

/**
 * Discover Gogo's Coins -- Money Skills L1 ENCOUNTER.
 *
 * Gameplay: Gogo Nomsa guides child to explore 7 SA coins on a woven mat.
 * 4 Orboot phases: EXPLORE > DISCOVER > PRACTICE > CELEBRATE.
 * Ubuntu: no scores, no competition, community celebration.
 */
export default function MoneySkillsPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const setPhase = useGameStore((s) => s.setPhase);

  const { ready: audioReady } = useAudioSetup();
  const exploredCount = useExploredCount();

  const selectedCoin = useMoneySkillsState((s) => s.selectedCoin);
  const coinsInspected = useMoneySkillsState((s) => s.coinsInspected);
  const practiceRound = useMoneySkillsState((s) => s.practiceRound);
  const selectCoin = useMoneySkillsState((s) => s.selectCoin);
  const inspectCoin = useMoneySkillsState((s) => s.inspectCoin);
  const resetMoneySkills = useMoneySkillsState((s) => s.resetMoneySkills);

  const [showInspector, setShowInspector] = useState(false);

  // Phase 3: Session tracking
  const { trackPhase, endSession, resetSession } = useGameSession('money-skills');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Initialize game state on mount
  useEffect(() => {
    reset();
    setActiveCharacter('sipho');
    setTargetInteractions(7);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play('ambient-market');
    }
  }, [audioReady, setLoaded]);

  // Track phase changes for session analytics
  useEffect(() => {
    trackPhase(phase);
  }, [phase, trackPhase]);

  // Play celebration melody on celebrate
  useEffect(() => {
    if (phase === 'celebrate') {
      audioManager.play('money-celebrate');
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(exploredCount);
      addCompletion('money-skills', exploredCount, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [phase, endSession, addCompletion, exploredCount]);

  // Handle coin tap from 3D scene
  const handleCoinTap = useCallback(
    (id: CoinId) => {
      if (phase === 'discover') {
        // Open inspector overlay
        selectCoin(id);
        inspectCoin(id);
        audioManager.play('coin-flip');
        setShowInspector(true);
      }
    },
    [phase, selectCoin, inspectCoin]
  );

  // Close inspector and possibly advance phase
  const handleCloseInspector = useCallback(() => {
    setShowInspector(false);
    selectCoin(null);

    // Check if enough coins inspected to advance to practice
    if (phase === 'discover' && coinsInspected.length >= DISCOVER_THRESHOLD) {
      setTimeout(() => advancePhase(), 400); // discover -> practice
    }
  }, [phase, coinsInspected.length, advancePhase, selectCoin]);

  // Practice complete handler
  const handlePracticeComplete = useCallback(() => {
    if (practiceRound >= PRACTICE_THRESHOLD - 1) {
      audioManager.stopCategory('ambient');
      setTimeout(() => setPhase('celebrate'), 600);
    }
  }, [practiceRound, setPhase]);

  // Play Again handler
  const handlePlayAgain = useCallback(() => {
    reset();
    resetMoneySkills();
    resetSession();
    setActiveCharacter('sipho');
    setTargetInteractions(7);
    setLoaded(true);
    audioManager.play('ambient-market');
  }, [reset, resetMoneySkills, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // -- Celebrate phase rendering --
  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Discover Gogo's Coins">
          <div className="relative w-full h-full">
            <Scene
              cameraPosition={[0, 1.5, 5]}
              cameraFov={50}
              backgroundColor="#FFF8E1"
            >
              <CoinCelebration />
            </Scene>

            {/* Celebration HTML overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 pointer-events-none">
              <h2 className="text-2xl md:text-3xl font-display text-amber-900 text-center mb-2 px-4">
                We know our coins now!
              </h2>
              <p className="text-sm font-body text-amber-700 text-center mb-4 px-4">
                We learned together -- well done!
              </p>
              <button
                onClick={handlePlayAgain}
                className="pointer-events-auto px-8 py-3 bg-amber-500 text-white font-display text-xl rounded-full shadow-lg active:scale-95 transition-transform min-w-[48px] min-h-[48px]"
              >
                Play Again
              </button>
            </div>
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  // -- Main game rendering --
  return (
    <ErrorBoundary>
      <GameShell title="Discover Gogo's Coins">
        <div className="relative w-full h-full">
          <Scene
            cameraPosition={[0, 3, 5]}
            cameraFov={45}
            backgroundColor="#FFF8E1"
          >
            <MoneySkillsGame onCoinTap={handleCoinTap} />
          </Scene>

          {/* Phase progress beads */}
          <ProgressBeads currentPhase={phase} />

          {/* Explore phase hint */}
          {phase === 'explore' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="bg-white/80 rounded-full px-4 py-2 shadow">
                <p className="text-sm font-body text-amber-800 text-center">
                  Tap the coins to explore!
                </p>
              </div>
            </div>
          )}

          {/* Discover phase hint */}
          {phase === 'discover' && !showInspector && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="bg-white/80 rounded-full px-4 py-2 shadow">
                <p className="text-sm font-body text-amber-800 text-center">
                  Tap a coin to look closely! ({coinsInspected.length}/{DISCOVER_THRESHOLD})
                </p>
              </div>
            </div>
          )}

          {/* Coin Inspector overlay (discover phase) */}
          {showInspector && selectedCoin && (
            <CoinInspector coinId={selectedCoin} onClose={handleCloseInspector} />
          )}

          {/* Practice phase overlay */}
          {phase === 'practice' && (
            <PracticeRound onComplete={handlePracticeComplete} />
          )}
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
