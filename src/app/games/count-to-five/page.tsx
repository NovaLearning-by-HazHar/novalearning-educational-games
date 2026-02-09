'use client';

import { useEffect } from 'react';
import GameShell from '@/components/GameShell';
import Scene from '@/components/Scene';
import { useGameStore } from '@/stores/gameStore';
import CelebrationScene from '@/components/CelebrationScene';
import CountToFiveGame from './CountToFiveGame';

/**
 * Count to 5 with Sipho — Numeracy game.
 *
 * Gameplay: Sipho guides child to tap 5 mangoes from a tree.
 * Each tap: mango detaches + marimba note + voice "One!", "Two!", etc.
 * After 5: All 6 characters celebrate together (Ubuntu).
 */
export default function CountToFivePage() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter);
  const setTargetInteractions = useGameStore((s) => s.setTargetInteractions);
  const setLoaded = useGameStore((s) => s.setLoaded);

  useEffect(() => {
    reset();
    setActiveCharacter('sipho');
    setTargetInteractions(5);
    // Mark loaded once the component mounts — Phase 2 will add real asset loading
    setLoaded(true);
  }, [reset, setActiveCharacter, setTargetInteractions, setLoaded]);

  if (phase === 'celebrate') {
    return (
      <GameShell title="Count to 5 with Sipho">
        <CelebrationScene />
      </GameShell>
    );
  }

  return (
    <GameShell title="Count to 5 with Sipho">
      <Scene
        cameraPosition={[0, 2, 6]}
        cameraFov={45}
        backgroundColor="#87CEEB"
      >
        <CountToFiveGame />
      </Scene>
    </GameShell>
  );
}
