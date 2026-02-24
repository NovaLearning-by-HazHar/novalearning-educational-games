'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import type { CoinId } from './types/money-skills';
import { SA_COINS, COIN_SCATTER_POSITIONS, EXPLORE_THRESHOLD, DISCOVER_THRESHOLD } from './lib/constants';
import { useMoneySkillsState } from './hooks/useMoneySkillsState';
import WovenMat from './components/WovenMat';
import SACoin from './components/SACoin';
import GogoNomsa from './components/GogoNomsa';

interface MoneySkillsGameProps {
  onCoinTap: (id: CoinId) => void;
}

/**
 * Money Skills 3D scene orchestrator.
 * Composes WovenMat, 7 SACoin instances, and GogoNomsa.
 * Handles coin tap logic, audio triggers, and phase transitions.
 */
export default function MoneySkillsGame({ onCoinTap }: MoneySkillsGameProps) {
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);

  const coinsExplored = useMoneySkillsState((s) => s.coinsExplored);
  const coinsInspected = useMoneySkillsState((s) => s.coinsInspected);
  const exploreCoin = useMoneySkillsState((s) => s.exploreCoin);
  const showHintGlow = useMoneySkillsState((s) => s.showHintGlow);

  const handleCoinTap = useCallback(
    (id: CoinId) => {
      // Play coin-specific tone and tap SFX
      audioManager.play(`coin-tone-${id}`);
      audioManager.play('coin-tap');
      incrementInteraction();

      if (phase === 'explore') {
        // Track exploration
        exploreCoin(id);
        const newCount = coinsExplored.includes(id) ? coinsExplored.length : coinsExplored.length + 1;

        // Auto-advance after exploring enough unique coins
        if (newCount >= EXPLORE_THRESHOLD) {
          setTimeout(() => advancePhase(), 600); // explore -> discover
        }
      }

      if (phase === 'discover') {
        // Track inspection
        const newInspectedCount = coinsInspected.includes(id)
          ? coinsInspected.length
          : coinsInspected.length + 1;

        if (newInspectedCount >= DISCOVER_THRESHOLD) {
          // Will advance from discover -> practice after inspection overlay closes
        }
      }

      // Notify page for overlay handling
      onCoinTap(id);
    },
    [phase, advancePhase, incrementInteraction, exploreCoin, coinsExplored, coinsInspected, onCoinTap]
  );

  return (
    <>
      <WovenMat />

      {/* 7 SA coins scattered on the mat */}
      {SA_COINS.map((coin, i) => (
        <SACoin
          key={coin.id}
          coinId={coin.id}
          position={COIN_SCATTER_POSITIONS[i]}
          onClick={handleCoinTap}
          highlighted={coinsExplored.includes(coin.id)}
          hintGlow={showHintGlow && phase === 'practice'}
        />
      ))}

      <GogoNomsa wave={phase === 'celebrate'} />

      {/* Invisible background plane catches empty-area taps */}
      <mesh position={[0, 2, -5]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
