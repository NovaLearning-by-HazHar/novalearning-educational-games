'use client';

import { useGameStore } from '@/stores/gameStore';
import GogoThandiDisplay from './components/GogoThandiDisplay';

/**
 * Ubuntu Stories — 3D scene content (minimal).
 * This game is primarily 2D narrative. The 3D scene shows Gogo Thandi
 * as a character portrait display only.
 */
export default function UbuntuStoriesGame() {
  const phase = useGameStore((s) => s.phase);

  return (
    <group>
      <GogoThandiDisplay
        wave={phase === 'explore'}
        bounce={phase === 'discover' || phase === 'practice'}
      />
    </group>
  );
}
