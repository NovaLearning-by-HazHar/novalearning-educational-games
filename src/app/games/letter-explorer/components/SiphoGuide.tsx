'use client';

import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { SIPHO_POSITION, EXPLORER_CHARACTER_COLORS } from '../lib/constants';

interface SiphoGuideProps {
  phase: string;
}

/**
 * Sipho guide character for the Letter Explorer game.
 * Reuses SimpleCharacter from count-to-five.
 * Phase-aware: waves during explore, bounces during spotlight/matching.
 */
export default function SiphoGuide({ phase }: SiphoGuideProps) {
  const colors = EXPLORER_CHARACTER_COLORS.sipho;
  const isExploring = phase === 'explore';
  const isExcited = phase === 'spotlight' || phase === 'matching';

  return (
    <SimpleCharacter
      position={SIPHO_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1.1}
      wave={isExploring}
      bounce={isExcited}
    />
  );
}
