'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import ShopEnvironment from './components/ShopEnvironment';
import PlantPot from './components/PlantPot';
import LeratoGuide from './components/LeratoGuide';
import { useMoneyState, calculateEarnings } from './hooks/useMoneyState';
import {
  COIN_GARDEN_POSITIONS,
  GAME_SETTINGS,
  AUDIO_IDS,
} from './lib/constants';
import type { PlantPotState } from './types/money';

const INITIAL_POTS: PlantPotState[] = [
  { id: 0, watered: false, coinSpawned: false, coinCollected: false },
  { id: 1, watered: false, coinSpawned: false, coinCollected: false },
  { id: 2, watered: false, coinSpawned: false, coinCollected: false },
];

const POT_POSITIONS: [number, number, number][] = [
  COIN_GARDEN_POSITIONS.pot1,
  COIN_GARDEN_POSITIONS.pot2,
  COIN_GARDEN_POSITIONS.pot3,
];

/**
 * MoneyMasteryGame — Pure 3D orchestrator.
 *
 * Composes ShopEnvironment + 3 PlantPots + LeratoGuide.
 * Manages garden cycle logic and phase transitions.
 * All HTML overlays (ShopItemCards, balance HUD, speech bubble) go in page.tsx.
 */
export default function MoneyMasteryGame() {
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);

  const purchases = useMoneyState((s) => s.purchases);
  const addBalance = useMoneyState((s) => s.addBalance);
  const incrementGardenCycle = useMoneyState((s) => s.incrementGardenCycle);
  const triggerLeratoHint = useMoneyState((s) => s.triggerLeratoHint);

  const [pots, setPots] = useState<PlantPotState[]>(INITIAL_POTS);
  const gardenCycleRef = useRef(0);

  // -------------------------------------------------------------------------
  // Garden cycle helpers
  // -------------------------------------------------------------------------

  const resetPots = useCallback(() => {
    setPots(INITIAL_POTS.map((p) => ({ ...p })));
  }, []);

  /** Called when all 3 coins collected — pay out and reset garden */
  const completeGardenCycle = useCallback(() => {
    const earnings = calculateEarnings(purchases);
    addBalance(earnings);
    incrementGardenCycle();
    audioManager.play(AUDIO_IDS.gardenComplete);

    gardenCycleRef.current += 1;

    // First cycle in explore → advance to discover
    if (gardenCycleRef.current === 1 && phase === 'explore') {
      advancePhase(); // explore → discover
    }

    // Reset pots after a brief pause so player sees the completed state
    setTimeout(resetPots, 600);
  }, [purchases, addBalance, incrementGardenCycle, phase, advancePhase, resetPots]);

  // -------------------------------------------------------------------------
  // Pot interaction handlers
  // -------------------------------------------------------------------------

  const handleWater = useCallback(
    (potId: number) => {
      setPots((prev) =>
        prev.map((p) => {
          if (p.id !== potId || p.watered) return p;
          return { ...p, watered: true };
        })
      );

      // Schedule coin spawn after delay
      setTimeout(() => {
        setPots((prev) =>
          prev.map((p) => {
            if (p.id !== potId) return p;
            return { ...p, coinSpawned: true };
          })
        );
      }, GAME_SETTINGS.coinSpawnDelay);
    },
    []
  );

  const handleCollect = useCallback(
    (potId: number) => {
      setPots((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== potId) return p;
          return { ...p, coinCollected: true };
        });

        // Check if all 3 coins collected
        const allCollected = updated.every((p) => p.coinCollected);
        if (allCollected) {
          // Use setTimeout to avoid setState-during-render
          setTimeout(() => completeGardenCycle(), 0);
        }

        return updated;
      });
    },
    [completeGardenCycle]
  );

  // -------------------------------------------------------------------------
  // Auto-advance discover → practice
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (phase === 'discover') {
      const timer = setTimeout(() => {
        advancePhase(); // discover → practice
      }, GAME_SETTINGS.discoverPhaseDuration);
      return () => clearTimeout(timer);
    }
  }, [phase, advancePhase]);

  // -------------------------------------------------------------------------
  // Show explore hint after delay
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (phase === 'explore') {
      const timer = setTimeout(() => {
        triggerLeratoHint();
      }, GAME_SETTINGS.exploreHintDelay);
      return () => clearTimeout(timer);
    }
  }, [phase, triggerLeratoHint]);

  // -------------------------------------------------------------------------
  // Garden visible during explore + practice (not discover/celebrate)
  // -------------------------------------------------------------------------

  const showGarden = phase === 'explore' || phase === 'practice';

  return (
    <>
      <ShopEnvironment />

      {showGarden &&
        pots.map((pot, idx) => (
          <PlantPot
            key={pot.id}
            position={POT_POSITIONS[idx]}
            watered={pot.watered}
            coinSpawned={pot.coinSpawned}
            coinCollected={pot.coinCollected}
            onWater={() => handleWater(pot.id)}
            onCollect={() => handleCollect(pot.id)}
          />
        ))}

      <LeratoGuide />
    </>
  );
}
