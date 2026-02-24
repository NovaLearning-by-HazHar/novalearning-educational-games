'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CoinId } from '../types/money-skills';
import { COIN_MAP } from '../lib/constants';

interface SACoinProps {
  coinId: CoinId;
  position: [number, number, number];
  onClick?: (id: CoinId) => void;
  highlighted?: boolean;
  hintGlow?: boolean;
  /** When true, show coin flipped to back side */
  showBack?: boolean;
  /** Override scale for zoom inspector */
  scaleOverride?: number;
}

/**
 * Procedural SA coin mesh: cylinder body + ring markings.
 * Touch target is 64px equivalent (oversized invisible hit area).
 * ~100 triangles per coin.
 */
export default function SACoin({
  coinId,
  position,
  onClick,
  highlighted = false,
  hintGlow = false,
  showBack = false,
  scaleOverride,
}: SACoinProps) {
  const coin = COIN_MAP[coinId];
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const bounceRef = useRef(0);

  // Bounce animation on tap
  const handleClick = useCallback(() => {
    bounceRef.current = 1.0;
    onClick?.(coinId);
  }, [coinId, onClick]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Bounce decay
    if (bounceRef.current > 0) {
      bounceRef.current = Math.max(0, bounceRef.current - delta * 4);
      groupRef.current.position.y = position[1] + Math.sin(bounceRef.current * Math.PI) * 0.3;
    }

    // Hint glow pulsing via scale
    if (hintGlow) {
      const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.08;
      const base = scaleOverride ?? coin.size;
      groupRef.current.scale.setScalar(base * pulse);
    }

    // Flip rotation for back view
    if (showBack) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        Math.PI,
        delta * 4
      );
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        delta * 4
      );
    }
  });

  const baseScale = scaleOverride ?? coin.size;
  const edgeColor = highlighted || hovered ? '#FFD700' : '#555555';

  return (
    <group
      ref={groupRef}
      position={position}
      scale={baseScale}
    >
      {/* Coin body -- flat cylinder */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.04, 16]} />
        <meshBasicMaterial color={coin.color} />
      </mesh>

      {/* Coin rim -- slightly larger ring */}
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.02, 16]} />
        <meshBasicMaterial color={edgeColor} />
      </mesh>

      {/* Front face marking -- small circle */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 8]} />
        <meshBasicMaterial color={edgeColor} />
      </mesh>

      {/* Back face marking -- different pattern */}
      <mesh position={[0, -0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 6]} />
        <meshBasicMaterial color={edgeColor} />
      </mesh>

      {/* Invisible oversized hit area for 64px+ touch target */}
      <mesh visible={false} onClick={handleClick}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Hint glow ring */}
      {hintGlow && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.55, 16]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
