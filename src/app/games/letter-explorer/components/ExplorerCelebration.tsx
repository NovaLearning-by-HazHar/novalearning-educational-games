'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import {
  CELEBRATION_POSITIONS_6,
  EXPLORER_CHARACTER_COLORS,
  ALL_EXPLORER_CHARACTERS,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from '../lib/constants';

/**
 * 6-character Ubuntu celebration scene.
 * All Rainbow Nation characters in a semicircle, bouncing together.
 * Instanced confetti mesh for performance (single draw call).
 */
export default function ExplorerCelebration() {
  const confettiRef = useRef<THREE.InstancedMesh>(null);
  const confettiData = useRef<
    { position: THREE.Vector3; velocity: THREE.Vector3; rotation: number; rotSpeed: number }[]
  >([]);

  // Initialize confetti particles
  const confettiColors = useMemo(() => {
    const colors = new Float32Array(CONFETTI_COUNT * 3);
    confettiData.current = [];

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      // Random color from palette
      const color = new THREE.Color(CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random spawn position (above the characters)
      confettiData.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          3 + Math.random() * 5,
          (Math.random() - 0.5) * 5,
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -(0.01 + Math.random() * 0.02),
          (Math.random() - 0.5) * 0.02,
        ),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }

    return colors;
  }, []);

  // Set initial instance colors
  useEffect(() => {
    if (!confettiRef.current) return;
    const mesh = confettiRef.current;

    // Apply colors to instances
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const color = new THREE.Color(
        confettiColors[i * 3],
        confettiColors[i * 3 + 1],
        confettiColors[i * 3 + 2],
      );
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [confettiColors]);

  // Animate confetti falling
  useFrame(() => {
    if (!confettiRef.current) return;
    const mesh = confettiRef.current;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const particle = confettiData.current[i];
      particle.position.add(particle.velocity);
      particle.rotation += particle.rotSpeed;

      // Gentle sway
      particle.velocity.x += Math.sin(particle.position.y * 2) * 0.0003;

      // Reset when fallen below ground
      if (particle.position.y < -1) {
        particle.position.set(
          (Math.random() - 0.5) * 8,
          4 + Math.random() * 3,
          (Math.random() - 0.5) * 5,
        );
      }

      dummy.position.copy(particle.position);
      dummy.rotation.set(particle.rotation, particle.rotation * 0.7, 0);
      dummy.scale.setScalar(0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* 6 Rainbow Nation characters in semicircle */}
      {ALL_EXPLORER_CHARACTERS.map((name, i) => {
        const colors = EXPLORER_CHARACTER_COLORS[name];
        return (
          <SimpleCharacter
            key={name}
            position={CELEBRATION_POSITIONS_6[i]}
            bodyColor={colors.body}
            headColor={colors.skin}
            accentColor={colors.accent}
            scale={1.1}
            bounce
            wave={i % 2 === 0}
          />
        );
      })}

      {/* Instanced confetti (single draw call) */}
      <instancedMesh ref={confettiRef} args={[undefined, undefined, CONFETTI_COUNT]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}
