'use client';

import { useState, useEffect } from 'react';
import PlantPot from './PlantPot';
import { COIN_GARDEN_POSITIONS, GAME_SETTINGS } from '../lib/constants';
import { useMoneyState, calculateEarnings } from '../hooks/useMoneyState';
import { audioManager } from '@/lib/audio';
import type { PlantPotState } from '../types/money';

/**
 * Manages 3 plant pots for the coin garden mini-game.
 * Tracks watering, coin spawning, and collection.
 * Emits earnings when all 3 coins are collected.
 */
export default function CoinGarden() {
  const { addBalance, incrementGardenCycle, purchases, triggerJabuHint } =
    useMoneyState();

  const [pots, setPots] = useState<PlantPotState[]>([
    { id: 0, watered: false, coinSpawned: false, coinCollected: false },
    { id: 1, watered: false, coinSpawned: false, coinCollected: false },
    { id: 2, watered: false, coinSpawned: false, coinCollected: false },
  ]);

  // Handle watering a pot
  const handleWater = (potId: number) => {
    setPots((prev) =>
      prev.map((pot) => (pot.id === potId ? { ...pot, watered: true } : pot))
    );

    // Spawn coin after delay
    setTimeout(() => {
      setPots((prev) =>
        prev.map((pot) =>
          pot.id === potId ? { ...pot, coinSpawned: true } : pot
        )
      );
    }, GAME_SETTINGS.coinSpawnDelay);
  };

  // Handle collecting a coin
  const handleCollect = (potId: number) => {
    setPots((prev) =>
      prev.map((pot) =>
        pot.id === potId ? { ...pot, coinCollected: true } : pot
      )
    );
  };

  // Check if all coins collected
  useEffect(() => {
    const allCollected = pots.every((pot) => pot.coinCollected);

    if (allCollected) {
      // Calculate earnings based on base + owned assets
      const earnings = calculateEarnings(purchases);

      // Add base earning
      addBalance(GAME_SETTINGS.baseEarning);

      // Add asset bonuses with staggered audio
      const assetBonus = earnings - GAME_SETTINGS.baseEarning;
      if (assetBonus > 0) {
        setTimeout(() => {
          addBalance(assetBonus);
          audioManager.play('cha-ching');
          triggerJabuHint(); // Show "Let's earn together!" hint
        }, GAME_SETTINGS.assetBonusAudioDelay);
      }

      // Play completion sound
      audioManager.play('garden-complete');

      // Increment cycle count
      incrementGardenCycle();

      // Reset pots for next cycle after a delay
      setTimeout(() => {
        setPots([
          { id: 0, watered: false, coinSpawned: false, coinCollected: false },
          { id: 1, watered: false, coinSpawned: false, coinCollected: false },
          { id: 2, watered: false, coinSpawned: false, coinCollected: false },
        ]);
      }, 1000);
    }
  }, [pots, purchases, addBalance, incrementGardenCycle, triggerJabuHint]);

  const positions = [
    COIN_GARDEN_POSITIONS.pot1,
    COIN_GARDEN_POSITIONS.pot2,
    COIN_GARDEN_POSITIONS.pot3,
  ];

  return (
    <group>
      {pots.map((pot, idx) => (
        <PlantPot
          key={pot.id}
          position={positions[idx]}
          watered={pot.watered}
          coinSpawned={pot.coinSpawned}
          coinCollected={pot.coinCollected}
          onWater={() => handleWater(pot.id)}
          onCollect={() => handleCollect(pot.id)}
        />
      ))}
    </group>
  );
}
