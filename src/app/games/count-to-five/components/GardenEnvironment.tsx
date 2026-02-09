'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';

/**
 * Garden scene: ground plane, sky gradient, decorative bushes & flowers.
 * Keeps draw calls low (~8-10) and triangle count minimal.
 */
export default function GardenEnvironment({
  showDecorations = true,
}: {
  showDecorations?: boolean;
}) {
  return (
    <>
      <Ground />
      <SkyGradient />
      {showDecorations && <Decorations />}
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color={COLORS.ground} />
    </mesh>
  );
}

/** Vertical plane at z=-15 with vertex colors for sky gradient */
function SkyGradient() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // 4 vertices: bottom-left, bottom-right, top-left, top-right
    const positions = new Float32Array([
      -15, -2, -15,   // bottom-left
       15, -2, -15,   // bottom-right
      -15, 12, -15,   // top-left
       15, 12, -15,   // top-right
    ]);

    const topColor = new THREE.Color(COLORS.skyTop);
    const bottomColor = new THREE.Color(COLORS.skyBottom);

    const colors = new Float32Array([
      bottomColor.r, bottomColor.g, bottomColor.b,
      bottomColor.r, bottomColor.g, bottomColor.b,
      topColor.r, topColor.g, topColor.b,
      topColor.r, topColor.g, topColor.b,
    ]);

    const indices = [0, 1, 2, 2, 1, 3];

    geo.setIndex(indices);
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

/** Decorative bushes and flowers */
function Decorations() {
  return (
    <group>
      {/* Bushes flanking tree */}
      <mesh position={[-2.5, 0.3, 1]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush1} />
      </mesh>
      <mesh position={[2.5, 0.25, 0.8]}>
        <sphereGeometry args={[0.45, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush2} />
      </mesh>
      <mesh position={[-2.0, 0.2, 2.0]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush3} />
      </mesh>

      {/* Tiny flowers on ground */}
      <Flower position={[-1.5, 0.05, 3.0]} color={COLORS.flower1} />
      <Flower position={[1.8, 0.05, 2.5]} color={COLORS.flower2} />
      <Flower position={[-0.5, 0.05, 3.5]} color={COLORS.flower3} />
      <Flower position={[2.2, 0.05, 3.2]} color={COLORS.flower4} />
    </group>
  );
}

function Flower({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
      <circleGeometry args={[0.12, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
