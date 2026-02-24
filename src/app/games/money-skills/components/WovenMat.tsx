'use client';

import { COLORS } from '../lib/constants';

/**
 * Background woven mat surface -- procedural plane with pattern.
 * Simple 3D plane with border ring. ~20 triangles total.
 */
export default function WovenMat() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main mat surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
        <planeGeometry args={[4.5, 3.5]} />
        <meshBasicMaterial color={COLORS.matBase} />
      </mesh>

      {/* Woven pattern stripes (horizontal) */}
      {[-1.0, -0.33, 0.33, 1.0].map((z, i) => (
        <mesh key={`h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, z + 0.2]}>
          <planeGeometry args={[4.3, 0.12]} />
          <meshBasicMaterial color={COLORS.matPattern} />
        </mesh>
      ))}

      {/* Woven pattern stripes (vertical) */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={`v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0.2]}>
          <planeGeometry args={[0.12, 3.3]} />
          <meshBasicMaterial color={COLORS.matPattern} />
        </mesh>
      ))}

      {/* Mat border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0.2]}>
        <ringGeometry args={[2.2, 2.35, 4]} />
        <meshBasicMaterial color={COLORS.matBorder} />
      </mesh>

      {/* Ground plane beneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color={COLORS.ground} />
      </mesh>
    </group>
  );
}
