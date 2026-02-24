'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';
import SavannaEnvironment from './components/SavannaEnvironment';
import AnimalHotspot from './components/AnimalHotspot';
import SiphoGuide from './components/SiphoGuide';
import { useExplorerState } from './hooks/useExplorerState';
import { ANIMALS } from './lib/constants';

/**
 * Letter Explorer 3D scene — orchestrator.
 * Composes SavannaEnvironment, 6 AnimalHotspots, and SiphoGuide.
 * Handles tap logic, audio triggers, and phase transitions.
 */
export default function LetterExplorerGame() {
  const globalPhase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);

  const explorerPhase = useExplorerState((s) => s.phase);
  const discoveries = useExplorerState((s) => s.discoveries);
  const discover = useExplorerState((s) => s.discover);

  const handleAnimalTap = useCallback(
    (animalId: string) => {
      if (explorerPhase !== 'explore') return;
      if (discoveries.has(animalId)) return;

      // Find animal index for audio
      const animalIndex = ANIMALS.findIndex((a) => a.id === animalId);

      // Play audio: animal tone + letter announce
      audioManager.play(`animal-${animalIndex}`);
      setTimeout(() => audioManager.play(`letter-${animalIndex}`), 200);
      audioManager.play('discover-sfx');

      // Update explorer state (opens spotlight)
      discover(animalId);

      // Update global game store phase transitions
      if (globalPhase === 'explore') {
        advancePhase(); // explore -> discover
        setTimeout(() => advancePhase(), 300); // discover -> practice
      }

      // Increment global interaction count
      incrementInteraction();
    },
    [explorerPhase, discoveries, discover, globalPhase, advancePhase, incrementInteraction],
  );

  const handleEmptyTap = useCallback(() => {
    // Empty taps during explore — could trigger hint
  }, []);

  return (
    <>
      <SavannaEnvironment />

      {/* 6 animal hotspots */}
      {ANIMALS.map((animal) => (
        <AnimalHotspot
          key={animal.id}
          animal={animal}
          discovered={discoveries.has(animal.id)}
          onTap={handleAnimalTap}
        />
      ))}

      {/* Sipho guide character */}
      <SiphoGuide phase={explorerPhase} />

      {/* Invisible background plane catches empty-area taps */}
      <mesh position={[0, 2, -10]} onClick={handleEmptyTap}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
