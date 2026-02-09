'use client';

import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';

/**
 * Count to 5 with Sipho — Numeracy game.
 * Phase 0: Scaffold only. Phase 1+: Full 3D implementation.
 *
 * Gameplay: Sipho guides child to tap 5 mangoes from a tree.
 * Each tap: mango detaches + marimba note + voice "One!", "Two!", etc.
 * After 5: All 6 characters celebrate together (Ubuntu).
 */
export default function CountToFivePage() {
  return (
    <GameShell title="Count to 5 with Sipho">
      <Scene>
        <ambientLight intensity={0.8} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#FFB800" />
        </mesh>
      </Scene>
    </GameShell>
  );
}
