'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { SAVANNA_COLORS } from '../lib/constants';

/**
 * Low-poly African savanna environment.
 * Ground plane, vertex-color sky gradient, 3 acacia tree silhouettes, scattered grass tufts.
 * ~500 triangles total. No shadows. WebGL 1.0 safe.
 */
export default function SavannaEnvironment() {
  return (
    <>
      <Ground />
      <SkyGradient />
      <AcaciaTree position={[-5, 0, -4]} scale={1.0} />
      <AcaciaTree position={[5.5, 0, -5]} scale={0.85} />
      <AcaciaTree position={[0, 0, -7]} scale={1.15} />
      <GrassTufts />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color={SAVANNA_COLORS.ground} />
    </mesh>
  );
}

/** Vertical backdrop plane with vertex-color gradient sky */
function SkyGradient() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array([
      -20, -2, -18,
       20, -2, -18,
      -20, 14, -18,
       20, 14, -18,
    ]);

    const topColor = new THREE.Color(SAVANNA_COLORS.skyTop);
    const bottomColor = new THREE.Color(SAVANNA_COLORS.skyBottom);

    const colors = new Float32Array([
      bottomColor.r, bottomColor.g, bottomColor.b,
      bottomColor.r, bottomColor.g, bottomColor.b,
      topColor.r, topColor.g, topColor.b,
      topColor.r, topColor.g, topColor.b,
    ]);

    geo.setIndex([0, 1, 2, 2, 1, 3]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Flat-top acacia tree silhouette: cylinder trunk + flattened sphere canopy */
function AcaciaTree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 2.4, 6]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeTrunk} />
      </mesh>

      {/* Canopy — flat-topped ellipsoid */}
      <mesh position={[0, 2.8, 0]} scale={[2.0, 0.5, 1.5]}>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeCanopy} />
      </mesh>

      {/* Canopy highlight layer */}
      <mesh position={[0.2, 2.9, 0.1]} scale={[1.4, 0.35, 1.1]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeCanopyLight} />
      </mesh>
    </group>
  );
}

/** Scattered grass tufts — thin cones on the ground plane */
function GrassTufts() {
  const tufts = useMemo(
    () => [
      { pos: [-2.5, 0, 3] as [number, number, number], h: 0.3 },
      { pos: [3.5, 0, 2.5] as [number, number, number], h: 0.25 },
      { pos: [-4, 0, 1] as [number, number, number], h: 0.35 },
      { pos: [1.0, 0, 3.5] as [number, number, number], h: 0.2 },
      { pos: [-1, 0, -1] as [number, number, number], h: 0.28 },
      { pos: [4.0, 0, -1.5] as [number, number, number], h: 0.22 },
      { pos: [-3.5, 0, -3] as [number, number, number], h: 0.3 },
      { pos: [2.5, 0, -2.5] as [number, number, number], h: 0.26 },
    ],
    [],
  );

  return (
    <group>
      {tufts.map((t, i) => (
        <mesh key={i} position={[t.pos[0], t.h / 2, t.pos[2]]}>
          <coneGeometry args={[0.08, t.h, 4]} />
          <meshBasicMaterial color={i % 2 === 0 ? SAVANNA_COLORS.grass : SAVANNA_COLORS.grassDark} />
        </mesh>
      ))}
    </group>
  );
}
