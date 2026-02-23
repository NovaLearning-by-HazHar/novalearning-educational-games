'use client';

import { useGameStore } from '@/stores/gameStore';
import { JABU_POSITION, MVP_CHARACTER_COLORS } from '../lib/constants';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';

/**
 * Jabu 3D character guide positioned at the shop counter.
 * Speech bubble is rendered as HTML overlay in page.tsx (outside R3F Canvas).
 */
export default function JabuGuide() {
  const phase = useGameStore((s) => s.phase);
  const colors = MVP_CHARACTER_COLORS.jabu;

  return (
    <SimpleCharacter
      position={JABU_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1}
      bounce={phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}
