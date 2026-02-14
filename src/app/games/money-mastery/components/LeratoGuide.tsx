'use client';

import { useGameStore } from '@/stores/gameStore';
import { LERATO_POSITION, MVP_CHARACTER_COLORS } from '../lib/constants';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';

/**
 * Lerato 3D character guide positioned at the shop counter.
 * Speech bubble is rendered as HTML overlay in page.tsx (outside R3F Canvas).
 */
export default function LeratoGuide() {
  const phase = useGameStore((s) => s.phase);
  const colors = MVP_CHARACTER_COLORS.lerato;

  return (
    <SimpleCharacter
      position={LERATO_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1}
      bounce={phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}