'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { animate } from 'animejs';
import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import {
  ALL_EXPLORER_CHARACTERS,
  EXPLORER_CHARACTER_COLORS,
  CELEBRATION_POSITIONS_6,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from '../lib/constants';

/**
 * Celebration scene: All 6 Rainbow Nation characters in a semicircle,
 * instanced confetti, "We learned together!" banner.
 * Ubuntu: community celebration, everyone together.
 */
export default function ExplorerCelebration() {
  return (
    <>
      <color attach="background" args={['#FFF8E1']} />
      <ambientLight intensity={1.0} />

      <CelebrationCharacters />
      <Confetti />

      {/* Banner text */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.4}
        color="#5D4E37"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
      >
        We learned together!
      </Text>

      {/* Sub-banner */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.22}
        color="#FF6F00"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
      >
        A B C D E F
      </Text>
    </>
  );
}

function CelebrationCharacters() {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  // Stagger entrance: characters scale from 0 -> 1 with delay
  useEffect(() => {
    const proxies = ALL_EXPLORER_CHARACTERS.map(() => ({ scale: 0 }));

    ALL_EXPLORER_CHARACTERS.forEach((_, i) => {
      animate(proxies[i], {
        scale: [0, 1],
        duration: 500,
        delay: i * 150,
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
      {ALL_EXPLORER_CHARACTERS.map((charName, i) => {
        const colors = EXPLORER_CHARACTER_COLORS[charName];
        const pos = CELEBRATION_POSITIONS_6[i];
        return (
          <group
            key={charName}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
            scale={0}
          >
            <SimpleCharacter
              position={pos}
              bodyColor={colors.body}
              headColor={colors.skin}
              accentColor={colors.accent}
              scale={1.1}
              bounce
              wave={i === 0 || i === 5}
            />
          </group>
        );
      })}
    </>
  );
}

function Confetti() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 8,
        y: 5 + Math.random() * 4,
        z: (Math.random() - 0.5) * 4,
        speed: 0.4 + Math.random() * 1.2,
        rotSpeed: Math.random() * 3,
        colorIndex: i % CONFETTI_COLORS.length,
      })),
    [],
  );

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

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const p = particles[i];
      const y = ((p.y - p.speed * t) % 10) + 5;
      const wobble = Math.sin(t * 2 + i) * 0.3;

      dummy.position.set(p.x + wobble, y > -5 ? y : y + 10, p.z);
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
