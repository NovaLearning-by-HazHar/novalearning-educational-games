'use client';

import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { SIPHO_POSITION, EXPLORER_CHARACTER_COLORS } from '../lib/constants';

interface SiphoGuideProps {
  /** Current explorer phase — used to drive animation state */
  phase: string;
}

/**
 * Sipho character guide — waves during explore, bounces otherwise.
 * Same SimpleCharacter reused from count-to-five.
 */
export default function SiphoGuide({ phase }: SiphoGuideProps) {
  const colors = EXPLORER_CHARACTER_COLORS.sipho;

  return (
    <SimpleCharacter
      position={SIPHO_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1.0}
      bounce={phase !== 'explore'}
      wave={phase === 'explore'}
    />
  );
}
