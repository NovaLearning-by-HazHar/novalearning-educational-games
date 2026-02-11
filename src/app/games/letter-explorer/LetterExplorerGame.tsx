'use client';

import SavannaEnvironment from './components/SavannaEnvironment';
import AnimalHotspot from './components/AnimalHotspot';
import SiphoGuide from './components/SiphoGuide';
import { useExplorerState } from './hooks/useExplorerState';
import { ANIMALS } from './lib/constants';

/**
 * Letter Explorer — 3D scene orchestrator.
 *
 * Renders only R3F children (runs inside <Scene>):
 * - SavannaEnvironment (background)
 * - 6 AnimalHotspot components (tappable animals with floating letters)
 * - SiphoGuide (phase-aware Sipho character)
 *
 * HTML overlays (ExplorerOverlay, SpotlightPopup, MatchingMiniGame)
 * live in page.tsx since they sit outside the Canvas.
 */
export default function LetterExplorerGame() {
  const phase = useExplorerState((s) => s.phase);
  const discoveries = useExplorerState((s) => s.discoveries);
  const discover = useExplorerState((s) => s.discover);

  return (
    <>
      <SavannaEnvironment />

      {ANIMALS.map((animal) => (
        <AnimalHotspot
          key={animal.id}
          animal={animal}
          discovered={discoveries.has(animal.id)}
          onDiscover={() => discover(animal.id)}
        />
      ))}

      <SiphoGuide phase={phase} />
    </>
  );
}
