'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animate } from 'animejs';
import { buildAnimal } from '../lib/animals';
import { TIMINGS, type AnimalDef } from '../lib/constants';
import FloatingLetter from './FloatingLetter';

interface AnimalHotspotProps {
  animal: AnimalDef;
  discovered: boolean;
  onTap: (animalId: string) => void;
}

/**
 * Tappable animal hotspot: procedural animal mesh + floating letter bubble.
 * Gentle idle bounce, pop animation on tap, visual "discovered" state.
 */
export default function AnimalHotspot({ animal, discovered, onTap }: AnimalHotspotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const animalRef = useRef<THREE.Group>(null);

  // Build animal geometry once, cached via useMemo
  const animalGroup = useMemo(
    () => buildAnimal(animal.id, animal.colors),
    [animal.id, animal.colors],
  );

  // Attach the imperatively-built THREE.Group to the scene
  useEffect(() => {
    if (!animalRef.current) return;
    // Clear previous children
    while (animalRef.current.children.length > 0) {
      animalRef.current.remove(animalRef.current.children[0]);
    }
    animalRef.current.add(animalGroup);
  }, [animalGroup]);

  // Idle animation: gentle hover bob
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y =
      animal.position[1] + Math.sin(t * 1.5 + animal.position[0]) * 0.04;
  });

  // Pop animation on tap
  const handleClick = useCallback(() => {
    if (discovered) return;
    onTap(animal.id);

    // Spring pop via anime.js v4
    if (groupRef.current) {
      const proxy = { scale: 1 };
      animate(proxy, {
        scale: [1, 1.3, 1],
        duration: TIMINGS.animalPopDuration,
        ease: 'outElastic(1, 0.5)',
        onUpdate: () => {
          if (groupRef.current) {
            groupRef.current.scale.setScalar(proxy.scale);
          }
        },
      });
    }
  }, [animal.id, discovered, onTap]);

  return (
    <group
      ref={groupRef}
      position={animal.position}
      onClick={handleClick}
    >
      {/* Animal mesh container */}
      <group
        ref={animalRef}
        rotation={[0, animal.rotation, 0]}
        scale={discovered ? 0.9 : 1}
      >
        {/* animalGroup attached imperatively via useEffect */}
      </group>

      {/* Floating letter bubble above the animal */}
      <FloatingLetter
        letter={animal.letter}
        position={[0, 0, 0]}
        discovered={discovered}
        scale={0.8}
      />

      {/* Invisible hitbox for easier tapping (bigger than visual) */}
      <mesh visible={false}>
        <boxGeometry args={[1.5, 2.5, 1.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
