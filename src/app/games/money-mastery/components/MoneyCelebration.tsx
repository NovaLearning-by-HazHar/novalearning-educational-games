'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animate } from 'animejs';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';
import { MVP_CHARACTER_COLORS, TEXT_CONTENT } from '../lib/constants';
import { useMoneyState } from '../hooks/useMoneyState';
import { useGameStore } from '@/stores/gameStore';

// Ndebele-inspired confetti colors
const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];
const CONFETTI_COUNT = 30;

const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

const MVP_NAMES = ['sipho', 'thandi', 'lerato'] as const;

/**
 * 3D celebration scene with metrics overlay.
 * 3 characters bounce + confetti rain + Ubuntu message + Play Again.
 * Pattern: mirrors CountingCelebration from count-to-five.
 */
export function MoneyCelebration3D() {
  return (
    <>
      <color attach="background" args={['#FFF8E1']} />
      <ambientLight intensity={1.0} />
      <CelebrationCharacters />
      <Confetti />
    </>
  );
}

/**
 * HTML overlay showing metrics and Play Again button.
 * Rendered OUTSIDE the R3F Canvas (absolute positioned).
 */
export function MoneyCelebrationOverlay({ onPlayAgain }: { onPlayAgain?: () => void }) {
  const purchases = useMoneyState((s) => s.purchases);
  const gardenCycleCount = useMoneyState((s) => s.gardenCycleCount);
  const resetMoney = useMoneyState((s) => s.resetMoney);
  const setPhase = useGameStore((s) => s.setPhase);
  const reset = useGameStore((s) => s.reset);

  const assetsOwned = purchases.filter((p) => p.type === 'asset').length;
  const funPurchases = purchases.filter((p) => p.type === 'consumption').length;
  const totalEarned = gardenCycleCount * 5 + purchases
    .filter((p) => p.type === 'asset')
    .reduce((sum, a) => sum + (a.incomePerCycle || 0) * Math.max(0, gardenCycleCount - 1), 0);

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      resetMoney();
      reset();
      setPhase('explore');
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '8%',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Ubuntu title */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid #FFD700',
          borderRadius: '20px',
          padding: '12px 24px',
          fontSize: '20px',
          fontWeight: 700,
          color: '#2E7D32',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        {TEXT_CONTENT.celebrate.title}
      </div>

      {/* Metrics card */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid #FFD700',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '12px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#333',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '280px',
          width: '85%',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          {TEXT_CONTENT.celebrate.totalEarned}{' '}
          <span style={{ color: '#FFD700', fontWeight: 700 }}>R{totalEarned}</span>
        </div>
        <div style={{ marginBottom: '4px' }}>
          {TEXT_CONTENT.celebrate.assetsOwned}{' '}
          <span style={{ color: '#2E7D32', fontWeight: 700 }}>{assetsOwned}</span>
        </div>
        <div>
          {TEXT_CONTENT.celebrate.consumptionPurchases}{' '}
          <span style={{ color: '#C62828', fontWeight: 700 }}>{funPurchases}</span>
        </div>
      </div>

      {/* Play Again button */}
      <button
        onClick={handlePlayAgain}
        style={{
          padding: '14px 36px',
          fontSize: '18px',
          fontWeight: 700,
          color: '#fff',
          background: '#2E7D32',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          touchAction: 'manipulation',
          pointerEvents: 'auto',
        }}
      >
        {TEXT_CONTENT.celebrate.playAgain}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal 3D sub-components
// ---------------------------------------------------------------------------

function CelebrationCharacters() {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => {
    const proxies = MVP_NAMES.map(() => ({ scale: 0 }));

    MVP_NAMES.forEach((_, i) => {
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
      {MVP_NAMES.map((charName, i) => {
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
              wave={i === 0}
            />
          </group>
        );
      })}
    </>
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

      dummy.position.set(p.x + Math.sin(t * 2 + i) * 0.3, y > -4 ? y : y + 8, p.z);
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
