'use client';

import { THANDI_POSITION, MVP_CHARACTER_COLORS } from '../lib/constants';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';
import type { GamePhase } from '@/types/game';

interface ThandiGuideProps {
  phase: GamePhase;
}

/**
 * Thandi — Xhosa creative storyteller, guide for the letter tracing game.
 * Phase-aware behavior:
 * - explore: wave to invite child
 * - discover/practice: bounce with encouragement during tracing
 * - celebrate: handled by TracingCelebration scene
 */
export default function ThandiGuide({ phase }: ThandiGuideProps) {
  const colors = MVP_CHARACTER_COLORS.thandi;

  return (
    <SimpleCharacter
      position={THANDI_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1.1}
      bounce={phase === 'practice' || phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}
