'use client';

import { GOGO_THANDI_POSITION, MVP_CHARACTER_COLORS } from '../lib/constants';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';
import type { GamePhase } from '@/types/game';

interface GogoThandiGuideProps {
  phase: GamePhase;
}

/**
 * Gogo Thandi — Xhosa elder wisdom keeper, guide for the letter tracing game.
 * Phase-aware behavior:
 * - explore: wave to invite child
 * - discover/practice: bounce with encouragement during tracing
 * - celebrate: handled by TracingCelebration scene
 */
export default function GogoThandiGuide({ phase }: GogoThandiGuideProps) {
  const colors = MVP_CHARACTER_COLORS.gogo_thandi;

  return (
    <SimpleCharacter
      position={GOGO_THANDI_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1.1}
      bounce={phase === 'practice' || phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}
