'use client';

import { useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import { useProgressStore } from '@/stores/progressStore';
import { audioManager } from '@/lib/audio';
import { useGameSession } from '@/lib/useGameSession';
import MoneyMasteryGame from './MoneyMasteryGame';
import ShopItemCards from './components/ShopItemCards';
import { MoneyCelebration3D, MoneyCelebrationOverlay } from './components/MoneyCelebration';
import { useAudioSetup } from './hooks/useAudioSetup';
import { useMoneyState } from './hooks/useMoneyState';
import {
  SHOP_COLORS,
  GAME_SETTINGS,
  TEXT_CONTENT,
  AUDIO_IDS,
} from './lib/constants';

/**
 * Money Mastery with Lerato — Financial Literacy game.
 *
 * Gameplay: Lerato guides child through a coin garden + spaza shop.
 * Water pots → grow coins → buy assets/treats → learn saving vs spending.
 * After 4 purchases: 3 MVP characters celebrate together (Ubuntu).
 */
export default function MoneyMasteryPage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  const { ready: audioReady } = useAudioSetup();
  const balance = useMoneyState((s) => s.balance);
  const showLeratoHint = useMoneyState((s) => s.showLeratoHint);
  const resetMoney = useMoneyState((s) => s.resetMoney);

  // Phase 3: Session tracking
  const { trackPhase, endSession, resetSession } = useGameSession('money-mastery');
  const addCompletion = useProgressStore((s) => s.addCompletion);

  // Initialize game state on mount
  useEffect(() => {
    reset();
    setActiveCharacter('lerato');
    setTargetInteractions(GAME_SETTINGS.targetInteractions);
  }, [reset, setActiveCharacter, setTargetInteractions]);

  // Mark loaded when audio is ready
  useEffect(() => {
    if (audioReady) {
      setLoaded(true);
      audioManager.play(AUDIO_IDS.ambientWind);
    }
  }, [audioReady, setLoaded]);

  // Track phase changes for session analytics
  useEffect(() => {
    trackPhase(phase);
  }, [phase, trackPhase]);

  // Record session on celebrate
  useEffect(() => {
    if (phase === 'celebrate') {
      audioManager.play(AUDIO_IDS.celebrateMelody);
      setTimeout(() => audioManager.playRandomEncouragement(), 800);
      const session = endSession(GAME_SETTINGS.targetInteractions);
      addCompletion('money-mastery', GAME_SETTINGS.targetInteractions, {
        durationSeconds: session.durationSeconds,
        phasesVisited: session.phasesVisited,
        deviceTier: session.deviceTier,
      });
    }
  }, [phase, endSession, addCompletion]);

  // Play Again handler
  const handlePlayAgain = useCallback(() => {
    resetMoney();
    reset();
    resetSession();
    setActiveCharacter('lerato');
    setTargetInteractions(GAME_SETTINGS.targetInteractions);
    setLoaded(true);
    audioManager.play(AUDIO_IDS.ambientWind);
  }, [resetMoney, reset, resetSession, setActiveCharacter, setTargetInteractions, setLoaded]);

  // Lerato speech bubble text (replicated from LeratoGuide — HTML inside R3F is ignored)
  let bubbleText = '';
  if (phase === 'explore') {
    bubbleText = showLeratoHint ? TEXT_CONTENT.explore.prompt : TEXT_CONTENT.explore.greeting;
  } else if (phase === 'discover') {
    bubbleText = TEXT_CONTENT.discover.prompt;
  } else if (phase === 'practice') {
    bubbleText = showLeratoHint ? TEXT_CONTENT.practice.bonusGarden : '';
  }

  // ---------------------------------------------------------------------------
  // Celebration render
  // ---------------------------------------------------------------------------
  if (phase === 'celebrate') {
    return (
      <ErrorBoundary>
        <GameShell title="Money Mastery with Lerato">
          <div className="relative w-full h-full">
            <Scene
              cameraPosition={[0, 1.5, 5]}
              cameraFov={50}
              backgroundColor="#FFF8E1"
            >
              <MoneyCelebration3D />
            </Scene>

            <MoneyCelebrationOverlay onPlayAgain={handlePlayAgain} />
          </div>
        </GameShell>
      </ErrorBoundary>
    );
  }

  // ---------------------------------------------------------------------------
  // Gameplay render (explore / discover / practice)
  // ---------------------------------------------------------------------------
  return (
    <ErrorBoundary>
      <GameShell title="Money Mastery with Lerato">
        <div className="relative w-full h-full">
          <Scene
            cameraPosition={[0, 2, 5]}
            cameraFov={50}
            backgroundColor="#87CEEB"
          >
            <MoneyMasteryGame />
          </Scene>

          {/* Balance HUD */}
          <div
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            style={{
              background: SHOP_COLORS.balanceBg,
              border: `3px solid ${SHOP_COLORS.balanceBorder}`,
            }}
          >
            <span style={{ color: SHOP_COLORS.coinIcon, fontSize: '24px' }}>
              &#x1FA99;
            </span>
            <span className="font-display text-xl font-bold text-nova-earth">
              R{balance}
            </span>
          </div>

          {/* Lerato speech bubble (HTML overlay — HTML inside R3F Canvas is ignored) */}
          {bubbleText && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                top: '15%',
                right: '10%',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '3px solid #2E7D32',
                borderRadius: '16px',
                padding: '16px 24px',
                maxWidth: '280px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#2E7D32',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {bubbleText}
            </div>
          )}

          {/* Shop item cards (visible during discover + practice) */}
          <ShopItemCards />
        </div>
      </GameShell>
    </ErrorBoundary>
  );
}
