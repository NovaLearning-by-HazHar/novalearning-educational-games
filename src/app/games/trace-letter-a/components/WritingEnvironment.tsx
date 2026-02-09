'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../lib/constants';

/**
 * Writing scene environment: soft ground, sky gradient, easel/board,
 * decorative bushes & flowers. Low draw calls (~10).
 */
export default function WritingEnvironment({
  showDecorations = true,
}: {
  showDecorations?: boolean;
}) {
  return (
    <>
      <Ground />
      <SkyGradient />
      <Easel />
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

function SkyGradient() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array([
      -15, -2, -15,
       15, -2, -15,
      -15, 12, -15,
       15, 12, -15,
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

/** Simple easel/writing board for the letter to appear on */
function Easel() {
  return (
    <group position={[0, 1.2, 0]}>
      {/* Board background */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.5, 4.0, 0.08]} />
        <meshBasicMaterial color={COLORS.easelBoard} />
      </mesh>

      {/* Frame — top */}
      <mesh position={[0, 2.02, 0]}>
        <boxGeometry args={[3.6, 0.1, 0.12]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>
      {/* Frame — bottom */}
      <mesh position={[0, -2.02, 0]}>
        <boxGeometry args={[3.6, 0.1, 0.12]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>
      {/* Frame — left */}
      <mesh position={[-1.77, 0, 0]}>
        <boxGeometry args={[0.1, 4.14, 0.12]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>
      {/* Frame — right */}
      <mesh position={[1.77, 0, 0]}>
        <boxGeometry args={[0.1, 4.14, 0.12]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>

      {/* Easel legs */}
      <mesh position={[-0.8, -2.8, 0.3]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 4]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>
      <mesh position={[0.8, -2.8, 0.3]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 4]} />
        <meshBasicMaterial color={COLORS.easelFrame} />
      </mesh>
    </group>
  );
}

function Decorations() {
  return (
    <group>
      {/* Bushes */}
      <mesh position={[-3.0, 0.25, 1]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush1} />
      </mesh>
      <mesh position={[3.5, 0.2, 0.5]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush2} />
      </mesh>
      <mesh position={[-2.5, 0.18, 2.0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshBasicMaterial color={COLORS.bush3} />
      </mesh>

      {/* Small flowers */}
      <Flower position={[-2.0, 0.05, 3.0]} color={COLORS.flower1} />
      <Flower position={[2.5, 0.05, 2.8]} color={COLORS.flower2} />
      <Flower position={[-0.8, 0.05, 3.5]} color={COLORS.flower3} />
      <Flower position={[3.0, 0.05, 3.2]} color={COLORS.flower4} />
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
      <circleGeometry args={[0.1, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
