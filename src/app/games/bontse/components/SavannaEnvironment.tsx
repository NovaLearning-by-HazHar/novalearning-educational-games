'use client';

import { COLORS } from '../lib/constants';

/** Simple savanna ground + sky + bushes. Low-poly, meshBasicMaterial only. */
export default function SavannaEnvironment() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color={COLORS.ground} />
      </mesh>

      {/* Bushes — decorative spheres */}
      <mesh position={[-3, 0.3, -2]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshBasicMaterial color={COLORS.bush1} />
      </mesh>
      <mesh position={[3.5, 0.25, -1.5]}>
        <sphereGeometry args={[0.4, 6, 6]} />
        <meshBasicMaterial color={COLORS.bush2} />
      </mesh>
      <mesh position={[-2, 0.2, 1]}>
        <sphereGeometry args={[0.35, 6, 6]} />
        <meshBasicMaterial color={COLORS.bush1} />
      </mesh>

      {/* Flowers */}
      <mesh position={[-1.5, 0.15, 1.5]}>
        <sphereGeometry args={[0.08, 4, 4]} />
        <meshBasicMaterial color={COLORS.flower1} />
      </mesh>
      <mesh position={[2, 0.12, 2]}>
        <sphereGeometry args={[0.08, 4, 4]} />
        <meshBasicMaterial color={COLORS.flower2} />
      </mesh>
      <mesh position={[0.5, 0.1, 2.5]}>
        <sphereGeometry args={[0.06, 4, 4]} />
        <meshBasicMaterial color={COLORS.flower3} />
      </mesh>
    </group>
  );
}
