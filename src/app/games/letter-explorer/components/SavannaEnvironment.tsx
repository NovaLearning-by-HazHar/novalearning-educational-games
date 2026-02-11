'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { SAVANNA_COLORS } from '../lib/constants';

/** Single acacia tree (~100 tris) */
function AcaciaTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 2.4, 6]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeTrunk} />
      </mesh>
      {/* Canopy — flat-top disc shape */}
      <mesh position={[0, 2.6, 0]} scale={[1, 0.25, 1]}>
        <sphereGeometry args={[1.2, 8, 4]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeCanopy} />
      </mesh>
      {/* Lighter top patch */}
      <mesh position={[0.2, 2.75, 0.1]} scale={[1, 0.2, 1]}>
        <sphereGeometry args={[0.7, 6, 4]} />
        <meshLambertMaterial color={SAVANNA_COLORS.treeCanopyLight} />
      </mesh>
    </group>
  );
}

/** Grass tuft (~8 tris) */
function GrassTuft({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-0.06, 0.12, 0]} rotation={[0, 0, 0.15]}>
        <coneGeometry args={[0.04, 0.25, 3]} />
        <meshLambertMaterial color={SAVANNA_COLORS.grass} />
      </mesh>
      <mesh position={[0.06, 0.14, 0]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.04, 0.28, 3]} />
        <meshLambertMaterial color={SAVANNA_COLORS.grassDark} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]} rotation={[0.1, 0, 0]}>
        <coneGeometry args={[0.03, 0.22, 3]} />
        <meshLambertMaterial color={SAVANNA_COLORS.grass} />
      </mesh>
    </group>
  );
}

/**
 * Low-poly savanna background for Letter Explorer.
 * Ground plane, sky gradient, acacia trees, grass tufts, distant hills.
 * ~500 triangles total. All static — no animations.
 */
export default function SavannaEnvironment() {
  // Sky gradient via vertex colors on a plane
  const skyGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 30, 1, 1);
    const colors = new Float32Array([
      // bottom-left (warm gold)
      ...new THREE.Color(SAVANNA_COLORS.skyBottom).toArray(),
      // bottom-right
      ...new THREE.Color(SAVANNA_COLORS.skyBottom).toArray(),
      // top-left (sky blue)
      ...new THREE.Color(SAVANNA_COLORS.skyTop).toArray(),
      // top-right
      ...new THREE.Color(SAVANNA_COLORS.skyTop).toArray(),
    ]);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <group>
      {/* Sky backdrop */}
      <mesh geometry={skyGeo} position={[0, 10, -20]}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshLambertMaterial color={SAVANNA_COLORS.ground} />
      </mesh>

      {/* Ground accent (darker patch in center) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[8, 12]} />
        <meshLambertMaterial color={SAVANNA_COLORS.groundDark} />
      </mesh>

      {/* Acacia trees — scattered around the edges */}
      <AcaciaTree position={[-6, 0, -5]} />
      <AcaciaTree position={[5.5, 0, -6]} />
      <AcaciaTree position={[7, 0, 2]} />

      {/* Distant hills */}
      <mesh position={[-10, 0.5, -12]} scale={[3, 0.8, 2]}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#B8A070" />
      </mesh>
      <mesh position={[8, 0.3, -14]} scale={[4, 0.6, 2.5]}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#C0A878" />
      </mesh>
      <mesh position={[0, 0.4, -16]} scale={[5, 0.7, 3]}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#B5A068" />
      </mesh>

      {/* Grass tufts scattered around */}
      <GrassTuft position={[-2, 0, 3]} />
      <GrassTuft position={[3.5, 0, 1]} />
      <GrassTuft position={[-5, 0, 0.5]} />
      <GrassTuft position={[1, 0, -1]} />
      <GrassTuft position={[-1, 0, -4]} />
      <GrassTuft position={[4, 0, -3.5]} />
      <GrassTuft position={[-3, 0, 2.5]} />
      <GrassTuft position={[2, 0, 4]} />
    </group>
  );
}
