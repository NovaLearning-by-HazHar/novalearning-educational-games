'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

/** Mango positions on the "tree" */
const MANGO_POSITIONS: [number, number, number][] = [
  [-1.2, 2.5, 0.3],
  [0.8, 2.8, -0.2],
  [-0.3, 3.2, 0.5],
  [1.3, 2.3, 0.1],
  [0.0, 2.0, -0.3],
];

const MANGO_COLOR = '#FFB800';
const MANGO_PICKED_COLOR = '#2D8B4E';

function Mango({
  position,
  index,
  picked,
  onPick,
}: {
  position: [number, number, number];
  index: number;
  picked: boolean;
  onPick: (index: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle bobbing animation for unpicked mangoes
  useFrame(({ clock }) => {
    if (!meshRef.current || picked) return;
    meshRef.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 2 + index) * 0.05;
  });

  // Falling animation for picked mangoes
  useFrame((_, delta) => {
    if (!meshRef.current || !picked) return;
    if (meshRef.current.position.y > -0.5) {
      meshRef.current.position.y -= delta * 3;
      meshRef.current.rotation.z += delta * 4;
    }
  });

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      if (!picked) onPick(index);
    },
    [picked, onPick, index]
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered && !picked ? 1.2 : 1}
    >
      {/* Mango shape: ellipsoid */}
      <sphereGeometry args={[0.25, 12, 8]} />
      <meshBasicMaterial
        color={picked ? MANGO_PICKED_COLOR : MANGO_COLOR}
        transparent={picked}
        opacity={picked ? 0.3 : 1}
      />
    </mesh>
  );
}

function Tree() {
  return (
    <group position={[0, 0, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.6, 8]} />
        <meshBasicMaterial color="#8B4513" />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[1.8, 12, 8]} />
        <meshBasicMaterial color="#2D8B4E" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#90C67C" />
    </mesh>
  );
}

/**
 * Count to Five 3D game scene.
 * Uses the engine foundation: game store state machine, touch input, Scene renderer.
 * Phase 2 will add: real GLTF models, audio (marimba + voice), character model.
 */
export default function CountToFiveGame() {
  const [pickedMangoes, setPickedMangoes] = useState<boolean[]>(
    new Array(5).fill(false)
  );
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const incrementInteraction = useGameStore((s) => s.incrementInteraction);

  const handlePick = useCallback(
    (index: number) => {
      setPickedMangoes((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });

      // Advance from explore → discover on first tap
      if (phase === 'explore') {
        advancePhase(); // → discover
        // Immediately advance to practice (discover is a brief learning moment)
        setTimeout(() => advancePhase(), 500); // → practice
      }

      incrementInteraction();
    },
    [phase, advancePhase, incrementInteraction]
  );

  return (
    <>
      <Ground />
      <Tree />
      {MANGO_POSITIONS.map((pos, i) => (
        <Mango
          key={i}
          position={pos}
          index={i}
          picked={pickedMangoes[i]}
          onPick={handlePick}
        />
      ))}
    </>
  );
}
