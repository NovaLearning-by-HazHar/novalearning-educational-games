'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GOGO_COLORS, GOGO_POSITION } from '../lib/constants';

interface GogoNomsaProps {
  wave?: boolean;
}

/**
 * Gogo Nomsa -- market elder NPC guide character.
 * Uses SimpleCharacter pattern (~300 triangles).
 * Positioned to the right of the mat, facing the player.
 */
export default function GogoNomsa({ wave = false }: GogoNomsaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Gentle breathing sway
    groupRef.current.position.y = GOGO_POSITION[1] + Math.sin(t * 1.5) * 0.02;

    // Wave arm during celebrate
    if (wave && leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 4) * 0.6 + 0.8;
    }
  });

  return (
    <group ref={groupRef} position={GOGO_POSITION} rotation={[0, -0.4, 0]}>
      {/* Body -- slightly wider for elder character */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.6, 8]} />
        <meshBasicMaterial color={GOGO_COLORS.body} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial color={GOGO_COLORS.skin} />
      </mesh>

      {/* Headwrap (doek) */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.18, 8, 4]} />
        <meshBasicMaterial color={GOGO_COLORS.accent} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.07, 0.88, 0.19]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[0.07, 0.88, 0.19]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.8, 0.2]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 4, 8, Math.PI]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Left arm (wave arm) */}
      <mesh ref={leftArmRef} position={[-0.28, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 4]} />
        <meshBasicMaterial color={GOGO_COLORS.skin} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.28, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 4]} />
        <meshBasicMaterial color={GOGO_COLORS.skin} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.09, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 4]} />
        <meshBasicMaterial color={GOGO_COLORS.body} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.09, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 4]} />
        <meshBasicMaterial color={GOGO_COLORS.body} />
      </mesh>
    </group>
  );
}
