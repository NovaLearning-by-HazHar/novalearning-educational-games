'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { animate } from 'animejs';
import { COLORS, BASKET_MANGO_OFFSETS } from '../lib/constants';

interface BasketProps {
  position: [number, number, number];
  collectedCount: number;
}

/**
 * Collection basket with woven appearance.
 * Shows collected mangoes and bounces on each new arrival.
 */
export default function Basket({ position, collectedCount }: BasketProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleProxy = useRef({ y: 1 });

  // Bounce animation when a new mango arrives
  useEffect(() => {
    if (collectedCount === 0 || !groupRef.current) return;

    scaleProxy.current.y = 1;

    animate(scaleProxy.current, {
      y: [1, 1.15, 0.92, 1],
      duration: 400,
      ease: 'inOutQuad',
      onUpdate: () => {
        if (groupRef.current) {
          groupRef.current.scale.y = scaleProxy.current.y;
        }
      },
    });
  }, [collectedCount]);

  return (
    <group ref={groupRef} position={position}>
      {/* Basket body — truncated cylinder */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.55, 0.4, 0.4, 12]} />
        <meshBasicMaterial color={COLORS.basket} />
      </mesh>

      {/* Basket rim */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 6, 12]} />
        <meshBasicMaterial color={COLORS.basketRim} />
      </mesh>

      {/* Collected mangoes inside basket */}
      {Array.from({ length: collectedCount }).map((_, i) => (
        <mesh
          key={i}
          position={[
            BASKET_MANGO_OFFSETS[i][0],
            BASKET_MANGO_OFFSETS[i][1],
            BASKET_MANGO_OFFSETS[i][2],
          ]}
          scale={[0.7, 0.9, 0.65]}
        >
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshBasicMaterial color={COLORS.mango} />
        </mesh>
      ))}
    </group>
  );
}
