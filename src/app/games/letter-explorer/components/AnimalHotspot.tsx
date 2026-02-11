'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildAnimal } from '../lib/animals';
import {
  LETTER_HEIGHT_OFFSET,
  LETTER_BOB_SPEED,
  LETTER_BOB_AMPLITUDE,
  LETTER_COLOR,
  LETTER_BG_COLOR,
  type AnimalDef,
} from '../lib/constants';

interface AnimalHotspotProps {
  animal: AnimalDef;
  discovered: boolean;
  onDiscover: () => void;
}

/**
 * Tappable animal hotspot in the savanna.
 * Shows a procedural animal mesh + floating letter badge above.
 * Glow ring on ground indicates tappability.
 * Idle bob animation on the animal.
 */
export default function AnimalHotspot({ animal, discovered, onDiscover }: AnimalHotspotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Build animal geometry once (cached)
  const animalGroup = useMemo(() => buildAnimal(animal.id, animal.colors), [animal.id, animal.colors]);

  const handleClick = useCallback(() => {
    if (!discovered) {
      onDiscover();
    }
  }, [discovered, onDiscover]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Floating letter bob
    if (letterRef.current) {
      letterRef.current.position.y =
        LETTER_HEIGHT_OFFSET + Math.sin(t * LETTER_BOB_SPEED + animal.position[0]) * LETTER_BOB_AMPLITUDE;
      letterRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }

    // Glow ring pulse
    if (glowRef.current) {
      const pulse = discovered ? 0.3 : 0.4 + Math.sin(t * 2) * 0.15;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
      const scale = discovered ? 1.0 : 1.0 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.scale.setScalar(scale);
    }

    // Gentle idle bob on the whole animal
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2 + animal.position[0] * 2) * 0.03;
    }
  });

  return (
    <group
      position={animal.position}
      rotation={[0, animal.rotation, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glow ring on ground */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[0.5, 0.7, 16]} />
        <meshBasicMaterial
          color={discovered ? '#4CAF50' : '#FFB800'}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animal mesh */}
      <group ref={groupRef} scale={hovered && !discovered ? 0.85 : 0.8}>
        <primitive object={animalGroup} />
      </group>

      {/* Floating letter badge */}
      <group ref={letterRef} position={[0, LETTER_HEIGHT_OFFSET, 0]}>
        {/* Circle background */}
        <mesh>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial
            color={discovered ? '#4CAF50' : LETTER_BG_COLOR}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Letter — rendered as a thin box placeholder (drei Text would add bundle weight) */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.35, 0.35]} />
          <meshBasicMaterial color={LETTER_COLOR} transparent opacity={0} />
        </mesh>
      </group>

      {/* HTML label for the letter (positioned via CSS in the overlay instead) */}
    </group>
  );
}
