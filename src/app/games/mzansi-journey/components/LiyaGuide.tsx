'use client';

import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { LIYA_COLORS, LIYA_POSITION } from '../lib/constants';
import type { GamePhase } from '@/types/game';

interface LiyaGuideProps {
  phase: GamePhase;
}

/**
 * Liya — Joyful Storyteller, guide for Mzansi Journey.
 * Uses the shared SimpleCharacter component with Liya's Bible v1.0 colors.
 * Phase-aware: wave on explore, bounce on discover/practice.
 */
export default function LiyaGuide({ phase }: LiyaGuideProps) {
  return (
    <SimpleCharacter
      position={LIYA_POSITION}
      bodyColor={LIYA_COLORS.body}
      headColor={LIYA_COLORS.skin}
      accentColor={LIYA_COLORS.accent}
      scale={1.1}
      bounce={phase === 'practice' || phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}
