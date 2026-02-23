'use client';

import { useGameStore } from '@/stores/gameStore';
import GardenGround from './components/GardenGround';
import GardenScene from './components/GardenScene';
import JabuGuide from './components/JabuGuide';
import { usePlacedCount } from './hooks/useGardenState';
import { PLACEMENT_TARGET } from './lib/constants';

/**
 * Ubuntu Garden — Build Mode orchestrator (3D scene content).
 * Child taps items, completes mini-tasks, places items in a shared garden.
 * Jabu guides. Community counter tracks garden progress.
 */
export default function UbuntuGardenGame() {
  const phase = useGameStore((s) => s.phase);
  const placedCount = usePlacedCount();

  return (
    <group>
      <GardenGround />
      <JabuGuide
        bounce={phase === 'discover' || phase === 'practice'}
        wave={phase === 'explore'}
      />
      {placedCount < PLACEMENT_TARGET && <GardenScene />}
      {placedCount >= PLACEMENT_TARGET && <GardenScene />}
    </group>
  );
}
