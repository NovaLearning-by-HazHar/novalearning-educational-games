'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOB_AMPLITUDE, BOB_SPEED, SPIN_SPEED } from '../lib/constants';

interface AnimalDisplayProps {
  /** Which animal to show — simple procedural shapes */
  animalId: string;
  visible: boolean;
}

/** Procedural color map for known animals */
const ANIMAL_COLORS: Record<string, { body: string; accent: string }> = {
  lion: { body: '#D4A017', accent: '#8B6914' },
  elephant: { body: '#808080', accent: '#606060' },
  springbok: { body: '#C68E17', accent: '#FFFFFF' },
  penguin: { body: '#1A1A2E', accent: '#FFFFFF' },
  // Fallback for non-animal items
  default: { body: '#FF6B35', accent: '#FFD54F' },
};

function getColors(id: string) {
  return ANIMAL_COLORS[id] || ANIMAL_COLORS.default;
}

/**
 * Simple low-poly 3D display for discovered items.
 * Animals get a body+head shape; non-animals get a simple sphere+star.
 * <5K vertices. Rotates slowly + bobs.
 */
export default function AnimalDisplay({ animalId, visible }: AnimalDisplayProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = t * SPIN_SPEED;
    groupRef.current.position.y = 1.2 + Math.sin(t * BOB_SPEED) * BOB_AMPLITUDE;
  });

  if (!visible) return null;

  const colors = getColors(animalId);
  const isAnimal = ['lion', 'elephant', 'springbok', 'penguin'].includes(animalId);

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {isAnimal ? (
        <>
          {/* Body — ellipsoid */}
          <mesh>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshLambertMaterial color={colors.body} />
          </mesh>
          {/* Head */}
          <mesh position={[0.4, 0.3, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshLambertMaterial color={colors.body} />
          </mesh>
          {/* Eyes */}
          <mesh position={[0.55, 0.38, 0.15]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={[0.55, 0.38, -0.15]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          {/* Legs (4) */}
          {[[-0.25, -0.5, 0.2], [-0.25, -0.5, -0.2], [0.2, -0.5, 0.2], [0.2, -0.5, -0.2]].map(
            (pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.06, 0.06, 0.3, 4]} />
                <meshLambertMaterial color={colors.accent} />
              </mesh>
            ),
          )}
        </>
      ) : (
        <>
          {/* Generic discovery object — octahedron */}
          <mesh>
            <octahedronGeometry args={[0.4, 0]} />
            <meshLambertMaterial color={colors.body} />
          </mesh>
          {/* Accent ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.04, 4, 8]} />
            <meshBasicMaterial color={colors.accent} />
          </mesh>
        </>
      )}
    </group>
  );
}
