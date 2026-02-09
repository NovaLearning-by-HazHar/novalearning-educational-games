'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SimpleCharacterProps {
  position: [number, number, number];
  bodyColor: string;
  headColor: string;
  accentColor: string;
  scale?: number;
  bounce?: boolean;
  wave?: boolean;
}

/**
 * Reusable procedural character figure (~300 triangles).
 * Cylinder body, sphere head, thin cylinder arms/legs, tiny sphere eyes.
 * Same component for all characters — just change colors.
 */
export default function SimpleCharacter({
  position,
  bodyColor,
  headColor,
  accentColor,
  scale = 1,
  bounce = false,
  wave = false,
}: SimpleCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Bounce: gentle Y oscillation
    if (bounce) {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 3)) * 0.15;
    }

    // Wave: left arm rotation
    if (wave && leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 4) * 0.6 + 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body — cylinder */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>

      {/* Head — sphere */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={headColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.07, 0.78, 0.17]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[0.07, 0.78, 0.17]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Left arm (wave arm) */}
      <mesh ref={leftArmRef} position={[-0.25, 0.45, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.25, 0.45, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.08, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 4]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 4]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>
    </group>
  );
}
