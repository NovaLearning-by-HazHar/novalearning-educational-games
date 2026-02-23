'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';
import SavannaEnvironment from './components/SavannaEnvironment';
import AnimalDisplay from './components/AnimalDisplay';
import SiphoGuide from './components/SiphoGuide';
import { useBontseState } from './hooks/useBontseState';
import { DISCOVERY_TARGET } from './lib/constants';

/**
 * Bontse — Discover Mode orchestrator (3D scene content).
 * Child taps categories to discover SA animals/cultures/landmarks.
 * Sipho guides. Community Discovery Counter tracks class progress.
 */
export default function BontseGame() {
  const phase = useGameStore((s) => s.phase);
  const selectedItemId = useBontseState((s) => s.selectedItemId);
  const discoveredCount = useBontseState((s) => s.discovered.length);

  const handleEmptyTap = useCallback(() => {
    // Encourage exploration
    audioManager.play('category-tap');
  }, []);

  return (
    <group onClick={handleEmptyTap}>
      <SavannaEnvironment />
      <SiphoGuide
        bounce={phase === 'discover' || phase === 'practice'}
        wave={phase === 'explore'}
      />
      <AnimalDisplay
        animalId={selectedItemId || ''}
        visible={!!selectedItemId && discoveredCount < DISCOVERY_TARGET}
      />
    </group>
  );
}
