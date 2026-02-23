'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { ALL_CHARACTER_COLORS } from '@/app/games/count-to-five/lib/constants';
import { CELEBRATION_POSITIONS, CONFETTI_COLORS, CONFETTI_COUNT } from '../lib/constants';

const CHARACTERS = [
  { id: 'sipho', ...ALL_CHARACTER_COLORS.sipho },
  { id: 'gogo_thandi', ...ALL_CHARACTER_COLORS.gogo_thandi },
  { id: 'amahle', ...ALL_CHARACTER_COLORS.amahle },
];

export default function BontseCelebration() {
  const confettiRef = useRef<THREE.InstancedMesh>(null);

  const confettiData = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: Math.random() * 4 + 2,
      z: (Math.random() - 0.5) * 4,
      speed: 0.5 + Math.random() * 1,
      wobble: Math.random() * Math.PI * 2,
      colorIndex: Math.floor(Math.random() * CONFETTI_COLORS.length),
    }));
  }, []);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!confettiRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const d = confettiData[i];
      const y = ((d.y - d.speed * t * 0.5) % 5) + 0.5;
      const x = d.x + Math.sin(t * 2 + d.wobble) * 0.3;
      tempMatrix.makeTranslation(x, y, d.z);
      tempMatrix.multiply(new THREE.Matrix4().makeRotationZ(t * 2 + d.wobble));
      confettiRef.current.setMatrixAt(i, tempMatrix);
      confettiRef.current.setColorAt(i, tempColor.set(CONFETTI_COLORS[d.colorIndex]));
    }
    confettiRef.current.instanceMatrix.needsUpdate = true;
    if (confettiRef.current.instanceColor) confettiRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* Three celebration characters */}
      {CHARACTERS.map((char, i) => (
        <SimpleCharacter
          key={char.id}
          position={CELEBRATION_POSITIONS[i]}
          bodyColor={char.body}
          headColor={char.skin}
          accentColor={char.accent}
          bounce
          wave={i === 0}
        />
      ))}

      {/* Confetti */}
      <instancedMesh ref={confettiRef} args={[undefined, undefined, CONFETTI_COUNT]}>
        <planeGeometry args={[0.08, 0.08]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
}
