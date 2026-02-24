'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SA_COINS, COIN_LINE_POSITIONS, GOGO_COLORS, SIPHO_COLORS } from '../lib/constants';
import SACoin from './SACoin';
import { audioManager } from '@/lib/audio';
import type { CoinId } from '../types/money-skills';

/**
 * Celebration scene: coins arranged by value (small to large).
 * Gogo Nomsa and Sipho celebrate together (Ubuntu community).
 * Instanced confetti particles for performance.
 */
export default function CoinCelebration() {
  const confettiRef = useRef<THREE.InstancedMesh>(null);

  // Confetti particle data
  const confettiCount = 25;
  const confettiData = useMemo(() => {
    return Array.from({ length: confettiCount }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: Math.random() * 4 + 1,
      z: (Math.random() - 0.5) * 3,
      speed: 0.3 + Math.random() * 0.5,
      rotSpeed: Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const confettiColors = useMemo(() => {
    const palette = ['#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043'];
    return palette.map((c) => new THREE.Color(c));
  }, []);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!confettiRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < confettiCount; i++) {
      const d = confettiData[i];
      const y = d.y - ((t * d.speed) % 5);
      const x = d.x + Math.sin(t * 1.5 + d.phase) * 0.3;

      tempMatrix.makeRotationFromEuler(
        new THREE.Euler(t * d.rotSpeed, t * d.rotSpeed * 0.7, 0)
      );
      tempMatrix.setPosition(x, y < -0.5 ? 4 : y, d.z);
      confettiRef.current.setMatrixAt(i, tempMatrix);
      confettiRef.current.setColorAt(i, tempColor.copy(confettiColors[i % confettiColors.length]));
    }

    confettiRef.current.instanceMatrix.needsUpdate = true;
    if (confettiRef.current.instanceColor) {
      confettiRef.current.instanceColor.needsUpdate = true;
    }
  });

  const handleCoinTap = (id: CoinId) => {
    audioManager.play(`coin-tone-${id}`);
    audioManager.play('coin-tap');
  };

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#D2B48C" />
      </mesh>

      {/* Coins arranged by value */}
      {SA_COINS.map((coin, i) => (
        <SACoin
          key={coin.id}
          coinId={coin.id}
          position={COIN_LINE_POSITIONS[i]}
          onClick={handleCoinTap}
        />
      ))}

      {/* Gogo Nomsa (right side, waving) */}
      <group position={[3.2, 0, 0.5]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.6, 8]} />
          <meshBasicMaterial color={GOGO_COLORS.body} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial color={GOGO_COLORS.skin} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.18, 8, 4]} />
          <meshBasicMaterial color={GOGO_COLORS.accent} />
        </mesh>
      </group>

      {/* Sipho (left side) */}
      <group position={[-3.2, 0, 0.5]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
          <meshBasicMaterial color={SIPHO_COLORS.body} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color={SIPHO_COLORS.skin} />
        </mesh>
      </group>

      {/* Instanced confetti */}
      <instancedMesh ref={confettiRef} args={[undefined, undefined, confettiCount]}>
        <planeGeometry args={[0.08, 0.08]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
}
