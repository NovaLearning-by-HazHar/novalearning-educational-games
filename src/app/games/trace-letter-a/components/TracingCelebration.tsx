'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animate } from 'animejs';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';
import {
  MVP_CHARACTERS,
  MVP_CHARACTER_COLORS,
  CELEBRATION_POSITIONS,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from '../lib/constants';

/**
 * 3D celebration scene for letter tracing completion.
 * 3 MVP characters bounce & wave with confetti and a floating letter "A".
 */
export default function TracingCelebration() {
  return (
    <>
      <color attach="background" args={['#E3F2FD']} />
      <ambientLight intensity={1.0} />

      <CelebrationCharacters />
      <FloatingLetter />
      <Confetti />
    </>
  );
}

function CelebrationCharacters() {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

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
              wave={i === 1} // Thandi waves (index 1)
            />
          </group>
        );
      })}
    </>
  );
}

/** Large floating letter "A" above the characters */
function FloatingLetter() {
  const groupRef = useRef<THREE.Group>(null);

  // Scale-in animation
  useEffect(() => {
    if (!groupRef.current) return;
    const proxy = { scale: 0, y: 3.5 };
    animate(proxy, {
      scale: [0, 1],
      y: [3.5, 2.8],
      duration: 800,
      delay: 600,
      ease: 'outBack',
      onUpdate: () => {
        if (groupRef.current) {
          groupRef.current.scale.setScalar(proxy.scale);
          groupRef.current.position.y = proxy.y;
        }
      },
    });
  }, []);

  // Gentle bob
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 2.8 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 2.8, 0.5]} scale={0}>
      {/* Simple "A" shape from boxes — no text geometry needed */}
      {/* Left leg */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.12, 1.0, 0.12]} />
        <meshBasicMaterial color="#FF6D00" />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.12, 1.0, 0.12]} />
        <meshBasicMaterial color="#FF6D00" />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.45, 0.1, 0.12]} />
        <meshBasicMaterial color="#FF6D00" />
      </mesh>
    </group>
  );
}

function Confetti() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

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
      const y = ((p.y - p.speed * t) % 8) + 4;
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
