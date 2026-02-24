'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  LETTER_HEIGHT_OFFSET,
  LETTER_BOB_SPEED,
  LETTER_BOB_AMPLITUDE,
  LETTER_COLOR,
  LETTER_BG_COLOR,
} from '../lib/constants';

interface FloatingLetterProps {
  letter: string;
  /** Base position (letter floats above this Y) */
  position: [number, number, number];
  /** Whether this letter has been discovered */
  discovered?: boolean;
  /** Scale override */
  scale?: number;
  /** Disable bobbing (e.g. for matching game) */
  static?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Highlight state (e.g. selected in matching) */
  highlighted?: boolean;
}

/**
 * Floating letter bubble: circular orange disc + white letter text.
 * Bobs gently up and down. Shows checkmark when discovered.
 */
export default function FloatingLetter({
  letter,
  position,
  discovered = false,
  scale = 1,
  static: isStatic = false,
  onClick,
  highlighted = false,
}: FloatingLetterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1] + LETTER_HEIGHT_OFFSET;

  useFrame(({ clock }) => {
    if (!groupRef.current || isStatic) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y = baseY + Math.sin(t * LETTER_BOB_SPEED) * LETTER_BOB_AMPLITUDE;
  });

  const bgColor = highlighted ? '#4CAF50' : discovered ? '#66BB6A' : LETTER_BG_COLOR;

  return (
    <group
      ref={groupRef}
      position={[position[0], isStatic ? position[1] : baseY, position[2]]}
      scale={scale}
      onClick={onClick}
    >
      {/* Background disc */}
      <mesh>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color={bgColor} side={THREE.DoubleSide} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[0.33, 0.38, 16]} />
        <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      {/* Letter text */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.35}
        color={LETTER_COLOR}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {discovered ? '\u2713' : letter}
      </Text>
    </group>
  );
}
