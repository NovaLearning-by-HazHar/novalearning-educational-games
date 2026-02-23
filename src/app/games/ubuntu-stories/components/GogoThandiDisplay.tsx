'use client';

import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { GOGO_THANDI_COLORS } from '../lib/constants';

interface GogoThandiDisplayProps {
  wave?: boolean;
  bounce?: boolean;
}

/**
 * 3D character display for Gogo Thandi (Wisdom Keeper).
 * Minimal — portrait display only. Uses SimpleCharacter from count-to-five.
 */
export default function GogoThandiDisplay({ wave = false, bounce = false }: GogoThandiDisplayProps) {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#7CB342" />
      </mesh>

      {/* Gogo Thandi — center */}
      <SimpleCharacter
        position={[0, 0, 1]}
        bodyColor={GOGO_THANDI_COLORS.body}
        headColor={GOGO_THANDI_COLORS.skin}
        accentColor={GOGO_THANDI_COLORS.accent}
        scale={1.2}
        bounce={bounce}
        wave={wave}
      />
    </group>
  );
}
