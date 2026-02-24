'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, BOB_AMPLITUDE, BOB_SPEED } from '../lib/constants';
import type { ItemCategory } from '../data/garden-items';
import { GARDEN_ITEMS } from '../data/garden-items';

interface GardenItemProps {
  itemId: string;
  position: [number, number, number];
}

/** Look up item category from ID */
function getCategory(itemId: string): ItemCategory {
  const item = GARDEN_ITEMS.find((g) => g.id === itemId);
  return item?.category ?? 'trees';
}

/** Tree: cone (canopy) + cylinder (trunk) ~100 vertices */
function TreeItem({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * BOB_SPEED) * BOB_AMPLITUDE * 0.3;
  });

  return (
    <group ref={ref} position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshBasicMaterial color={COLORS.treeTrunk} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.3, 0.5, 6]} />
        <meshBasicMaterial color={COLORS.treeCanopy} />
      </mesh>
    </group>
  );
}

/** Flower: small sphere + thin cylinder ~50 vertices */
function FlowerItem({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * BOB_SPEED * 1.2) * BOB_AMPLITUDE * 0.5;
  });

  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshBasicMaterial color={COLORS.flowerStem} />
      </mesh>
      {/* Petal */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color={COLORS.flowerPetal} />
      </mesh>
      {/* Center */}
      <mesh position={[0, 0.32, 0.06]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color={COLORS.flowerCenter} />
      </mesh>
    </group>
  );
}

/** Animal: 2 spheres (body+head) + 4 tiny cylinders (legs) ~200 vertices */
function AnimalItem({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.abs(Math.sin(clock.elapsedTime * BOB_SPEED)) * BOB_AMPLITUDE;
  });

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.18, 6, 6]} />
        <meshBasicMaterial color={COLORS.animalBody} />
      </mesh>
      {/* Head */}
      <mesh position={[0.15, 0.32, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color={COLORS.animalHead} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.22, 0.35, 0.06]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Legs */}
      {[[-0.08, 0, 0.08], [0.08, 0, 0.08], [-0.08, 0, -0.08], [0.08, 0, -0.08]].map((lp, i) => (
        <mesh key={i} position={[lp[0], 0.05, lp[2]]}>
          <cylinderGeometry args={[0.025, 0.025, 0.12, 4]} />
          <meshBasicMaterial color={COLORS.animalLeg} />
        </mesh>
      ))}
    </group>
  );
}

/** Structure: box = ~24 vertices */
function StructureItem({ itemId, position }: { itemId: string; position: [number, number, number] }) {
  if (itemId === 'house') {
    return (
      <group position={position}>
        {/* Walls */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.35]} />
          <meshBasicMaterial color={COLORS.structureWall} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.48, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.32, 0.2, 4]} />
          <meshBasicMaterial color={COLORS.structureRoof} />
        </mesh>
      </group>
    );
  }

  if (itemId === 'fence') {
    return (
      <group position={position}>
        {/* Posts */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
            <meshBasicMaterial color={COLORS.fencePost} />
          </mesh>
        ))}
        {/* Rail */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 4]} />
          <meshBasicMaterial color={COLORS.fencePost} />
        </mesh>
      </group>
    );
  }

  if (itemId === 'bench') {
    return (
      <group position={position}>
        {/* Seat */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.2]} />
          <meshBasicMaterial color={COLORS.benchSeat} />
        </mesh>
        {/* Legs */}
        {[[-0.15, 0.07, 0.07], [0.15, 0.07, 0.07], [-0.15, 0.07, -0.07], [0.15, 0.07, -0.07]].map((lp, i) => (
          <mesh key={i} position={[lp[0], lp[1], lp[2]]}>
            <boxGeometry args={[0.03, 0.14, 0.03]} />
            <meshBasicMaterial color={COLORS.benchLeg} />
          </mesh>
        ))}
      </group>
    );
  }

  // bridge (default structure)
  return (
    <group position={position}>
      {/* Deck */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.25]} />
        <meshBasicMaterial color={COLORS.bridgeDeck} />
      </mesh>
      {/* Rails */}
      <mesh position={[0, 0.2, 0.12]}>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
        <meshBasicMaterial color={COLORS.bridgeRail} />
      </mesh>
      <mesh position={[0, 0.2, -0.12]}>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
        <meshBasicMaterial color={COLORS.bridgeRail} />
      </mesh>
    </group>
  );
}

/**
 * GardenItem — renders the correct low-poly 3D item based on category.
 * All items use meshBasicMaterial only (Galaxy A03 compatible).
 */
export default function GardenItem({ itemId, position }: GardenItemProps) {
  const category = getCategory(itemId);

  switch (category) {
    case 'trees':
      return <TreeItem position={position} />;
    case 'flowers':
      return <FlowerItem position={position} />;
    case 'animals':
      return <AnimalItem position={position} />;
    case 'structures':
      return <StructureItem itemId={itemId} position={position} />;
    default:
      return <TreeItem position={position} />;
  }
}
