'use client';

import { useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';
import LiyaGuide from './components/LiyaGuide';
import ProvinceAnimal from './components/ProvinceAnimal';
import { useMzansiState } from './hooks/useMzansiState';

/**
 * Mzansi Journey — 3D scene orchestrator.
 * Composes a simple environment, Liya guide, and province animal display.
 * The SVG map and province panels are HTML overlays (not in this 3D scene).
 */
export default function MzansiJourneyGame() {
  const phase = useGameStore((s) => s.phase);
  const selectedProvince = useMzansiState((s) => s.selectedProvince);
  const visitCount = useMzansiState((s) => s.visitedProvinces.length);

  const handleEmptyTap = useCallback(() => {
    audioManager.play('map-tap');
  }, []);

  return (
    <>
      {/* Simple ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#7CB342" />
      </mesh>

      {/* Sky gradient effect via stretched plane behind */}
      <mesh position={[0, 5, -8]}>
        <planeGeometry args={[30, 12]} />
        <meshBasicMaterial color="#87CEEB" />
      </mesh>

      {/* Liya guide */}
      <LiyaGuide phase={phase} />

      {/* Province animal display (when a province is selected) */}
      <ProvinceAnimal
        provinceId={selectedProvince || ''}
        visible={!!selectedProvince && visitCount < 9}
      />

      {/* Cape Penguin companion — small penguin near Liya */}
      <group position={[3.2, 0, 2]}>
        {/* Penguin body */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.25, 6]} />
          <meshLambertMaterial color="#1A1A2E" />
        </mesh>
        {/* Penguin belly */}
        <mesh position={[0, 0.2, 0.06]}>
          <cylinderGeometry args={[0.05, 0.07, 0.18, 6]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        {/* Penguin head */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshLambertMaterial color="#1A1A2E" />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.04, 0.42, 0.07]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.04, 0.42, 0.07]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Beak */}
        <mesh position={[0, 0.38, 0.1]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.02, 0.05, 4]} />
          <meshLambertMaterial color="#FF8C00" />
        </mesh>
      </group>

      {/* Invisible background plane catches empty-area taps */}
      <mesh position={[0, 2, -5]} onClick={handleEmptyTap}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
