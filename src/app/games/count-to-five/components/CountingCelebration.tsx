'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animate } from 'animejs';
import SimpleCharacter from './SimpleCharacter';
import {
  MVP_CHARACTERS,
  MVP_CHARACTER_COLORS,
  CELEBRATION_POSITIONS,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from '../lib/constants';

/**
 * 3D celebration scene: 3 MVP characters bounce & wave,
 * confetti particles rain down with stagger entrance via anime.js.
 */
export default function CountingCelebration() {
  return (
    <>
      {/* Warm background */}
      <color attach="background" args={['#FFF8E1']} />

      {/* Ambient light for visibility */}
      <ambientLight intensity={1.0} />

      {/* 3 MVP characters */}
      <CelebrationCharacters />

      {/* Confetti particles */}
      <Confetti />
    </>
  );
}

function CelebrationCharacters() {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  // Stagger entrance: characters scale from 0 → 1 with delay
  useEffect(() => {
    const proxies = MVP_CHARACTERS.map(() => ({ scale: 0 }));

    MVP_CHARACTERS.forEach((_, i) => {
      animate(proxies[i], {
        scale: [0, 1],
        duration: 500,
        delay: i * 200,
        ease: 'outBack',
        onUpdate: () => {
          const ref = groupRefs.current[i];
          if (ref) {
            ref.scale.setScalar(proxies[i].scale);
          }
        },
      });
    });
  }, []);

  return (
    <>
      {MVP_CHARACTERS.map((charName, i) => {
        const colors = MVP_CHARACTER_COLORS[charName];
        const pos = CELEBRATION_POSITIONS[i];
        return (
          <group
            key={charName}
            ref={(el) => { groupRefs.current[i] = el; }}
            scale={0}
          >
            <SimpleCharacter
              position={pos}
              bodyColor={colors.body}
              headColor={colors.skin}
              accentColor={colors.accent}
              scale={1.2}
              bounce
              wave={i === 0} // Sipho waves
            />
          </group>
        );
      })}
    </>
  );
}

function Confetti() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate random confetti positions and velocities
  const particles = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 6,
      y: 4 + Math.random() * 3,
      z: (Math.random() - 0.5) * 3,
      speed: 0.5 + Math.random() * 1.5,
      rotSpeed: Math.random() * 3,
      colorIndex: i % CONFETTI_COLORS.length,
    }));
  }, []);

  // Set up instance colors
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const color = new THREE.Color();

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      color.set(CONFETTI_COLORS[particles[i].colorIndex]);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  // Animate falling
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const p = particles[i];
      const y = ((p.y - p.speed * t) % 8) + 4; // Loop when below -4
      const wobble = Math.sin(t * 2 + i) * 0.3;

      dummy.position.set(p.x + wobble, y > -4 ? y : y + 8, p.z);
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.7, 0);
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CONFETTI_COUNT]}>
      <boxGeometry args={[1, 1, 0.2]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}
