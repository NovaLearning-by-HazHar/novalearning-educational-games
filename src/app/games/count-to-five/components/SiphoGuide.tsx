'use client';

import { SIPHO_POSITION, MVP_CHARACTER_COLORS } from '../lib/constants';
import SimpleCharacter from './SimpleCharacter';
import type { GamePhase } from '@/types/game';

interface SiphoGuideProps {
  phase: GamePhase;
}

/**
 * Sipho — Zulu brave explorer, guide for the counting game.
 * Phase-aware behavior:
 * - explore: wave to invite child
 * - discover/practice: bounce with excitement on picks
 * - celebrate: handled by CountingCelebration scene
 */
export default function SiphoGuide({ phase }: SiphoGuideProps) {
  const colors = MVP_CHARACTER_COLORS.sipho;

  return (
    <SimpleCharacter
      position={SIPHO_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={1.1}
      bounce={phase === 'practice' || phase === 'discover'}
      wave={phase === 'explore'}
    />
  );
}
