'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/lib/audio';
import { useCountingState } from './hooks/useCountingState';
import GardenEnvironment from './components/GardenEnvironment';
import MangoTree from './components/MangoTree';
import SiphoGuide from './components/SiphoGuide';

/**
 * Count to Five 3D game scene — orchestrator.
 * Composes GardenEnvironment, MangoTree (with Mangoes + Basket), and SiphoGuide.
 * Handles pick logic, audio triggers, and phase transitions.
 */
export default function CountToFiveGame() {
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const setPhase = useGameStore((s) => s.setPhase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);

  const mangoes = useCountingState((s) => s.mangoes);
  const pickMango = useCountingState((s) => s.pickMango);
  const mangoArrived = useCountingState((s) => s.mangoArrived);
  const triggerSiphoHint = useCountingState((s) => s.triggerSiphoHint);

  const pickedMangoes = mangoes.map((m) => m.picked);
  const arrivedMangoes = mangoes.map((m) => m.arrivedAtBasket);
  const pickedCount = mangoes.filter((m) => m.picked).length;

  const handlePickMango = useCallback(
    (id: number) => {
      // Mark mango as picked (triggers arc animation in Mango component)
      pickMango(id);

      // Audio: immediate marimba note + delayed counting beep
      audioManager.play(`marimba-${id + 1}`);
      setTimeout(() => audioManager.play(`count-${id + 1}`), 200);

      // Pick SFX
      audioManager.play('pick-sfx');

      // Phase transition: on first pick, advance explore → discover → practice
      if (phase === 'explore') {
        advancePhase(); // explore → discover
        setTimeout(() => advancePhase(), 300); // discover → practice
      }

      // Increment interaction count
      incrementInteraction();

      // Check if this is the 5th mango
      const newPickedCount = pickedCount + 1;
      if (newPickedCount >= 5) {
        // Delay celebrate transition to let arc animation finish
        setTimeout(() => {
          audioManager.stopCategory('ambient');
          setPhase('celebrate');
        }, 1000);
      }
    },
    [phase, advancePhase, setPhase, incrementInteraction, pickMango, pickedCount]
  );

  const handleMangoArrive = useCallback(
    (id: number) => {
      mangoArrived(id);
    },
    [mangoArrived]
  );

  const handleEmptyTap = useCallback(() => {
    if (phase === 'explore' || phase === 'practice') {
      triggerSiphoHint();
    }
  }, [phase, triggerSiphoHint]);

  return (
    <>
      <GardenEnvironment />
      <MangoTree
        pickedMangoes={pickedMangoes}
        arrivedMangoes={arrivedMangoes}
        onPickMango={handlePickMango}
        onMangoArrive={handleMangoArrive}
      />
      <SiphoGuide phase={phase} />

      {/* Invisible background plane catches empty-area taps → triggers Sipho hint */}
      <mesh
        position={[0, 2, -5]}
        onClick={handleEmptyTap}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
