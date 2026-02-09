'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createTimeline } from 'animejs';
import {
  COLORS,
  BASKET_POSITION,
  BASKET_MANGO_OFFSETS,
  MANGO_PICK_DURATION,
  SWAY_SPEED,
  BOB_AMPLITUDE,
} from '../lib/constants';

type MangoAnimState = 'idle' | 'picking' | 'in_basket';

interface MangoProps {
  id: number;
  treePosition: [number, number, number];
  picked: boolean;
  onPick: (id: number) => void;
  onArriveAtBasket: (id: number) => void;
}

/**
 * Interactive mango with 3 animation states:
 * - idle: gentle sway + bob on tree
 * - picking: anime.js arc from tree → basket
 * - in_basket: static in basket, scaled down
 */
export default function Mango({
  id,
  treePosition,
  picked,
  onPick,
  onArriveAtBasket,
}: MangoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const animState = useRef<MangoAnimState>('idle');
  const [hovered, setHovered] = useState(false);

  // Position proxy for anime.js (it can't animate Three.js objects directly)
  const posProxy = useRef({ x: treePosition[0], y: treePosition[1], z: treePosition[2] });
  const rotProxy = useRef({ z: 0 });

  // Idle animation via useFrame
  useFrame(({ clock }) => {
    if (!groupRef.current || animState.current !== 'idle') return;
    const t = clock.elapsedTime * SWAY_SPEED + id * 1.3;
    groupRef.current.position.y = treePosition[1] + Math.sin(t) * BOB_AMPLITUDE;
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.05;
  });

  // Sync anime.js proxy → Three.js group position during picking
  useFrame(() => {
    if (!groupRef.current || animState.current !== 'picking') return;
    groupRef.current.position.set(posProxy.current.x, posProxy.current.y, posProxy.current.z);
    groupRef.current.rotation.z = rotProxy.current.z;
  });

  // Trigger pick animation when `picked` changes to true
  useEffect(() => {
    if (!picked || animState.current !== 'idle') return;
    animState.current = 'picking';

    const basketTarget = [
      BASKET_POSITION[0] + BASKET_MANGO_OFFSETS[id][0],
      BASKET_POSITION[1] + BASKET_MANGO_OFFSETS[id][1],
      BASKET_POSITION[2] + BASKET_MANGO_OFFSETS[id][2],
    ];

    // Midpoint for arc (higher Y for parabolic feel)
    const midX = (treePosition[0] + basketTarget[0]) / 2;
    const midY = Math.max(treePosition[1], basketTarget[1]) + 1.5;
    const midZ = (treePosition[2] + basketTarget[2]) / 2;

    // Reset proxy to current tree position
    posProxy.current = { x: treePosition[0], y: treePosition[1], z: treePosition[2] };
    rotProxy.current = { z: 0 };

    // anime.js v4 API: createTimeline + .add(target, props)
    const tl = createTimeline({
      defaults: { duration: MANGO_PICK_DURATION, ease: 'inOutQuad' },
      onComplete: () => {
        animState.current = 'in_basket';
        // Snap to final basket position
        if (groupRef.current) {
          groupRef.current.position.set(basketTarget[0], basketTarget[1], basketTarget[2]);
          groupRef.current.scale.setScalar(0.8);
          groupRef.current.rotation.z = 0;
        }
        onArriveAtBasket(id);
      },
    });

    // Arc: tree → midpoint → basket
    tl.add(posProxy.current, {
      x: [treePosition[0], midX, basketTarget[0]],
      y: [treePosition[1], midY, basketTarget[1]],
      z: [treePosition[2], midZ, basketTarget[2]],
    }, 0);

    // Spin during arc
    tl.add(rotProxy.current, {
      z: [0, Math.PI * 2],
      ease: 'inOutSine',
    }, 0);
  }, [picked, id, treePosition, onArriveAtBasket]);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      if (animState.current === 'idle' && !picked) {
        onPick(id);
      }
    },
    [picked, onPick, id]
  );

  return (
    <group ref={groupRef} position={treePosition}>
      {/* Mango body — ellipsoid */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={
          hovered && animState.current === 'idle'
            ? [1.15 * 1, 1.15 * 1.3, 1.15 * 0.9]
            : [1, 1.3, 0.9]
        }
      >
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshBasicMaterial color={COLORS.mango} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.25, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.015, 0.02, 0.08, 4]} />
        <meshBasicMaterial color={COLORS.mangoStem} />
      </mesh>
    </group>
  );
}
