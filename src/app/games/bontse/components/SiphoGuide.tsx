'use client';

import SimpleCharacter from '@/components/SimpleCharacter';
import { ALL_CHARACTER_COLORS } from '@/lib/characterColors';
import { SIPHO_POSITION } from '../lib/constants';

interface SiphoGuideProps {
  bounce?: boolean;
  wave?: boolean;
}

/** Sipho guide character for Bontse. Reuses SimpleCharacter. */
export default function SiphoGuide({ bounce = false, wave = true }: SiphoGuideProps) {
  const colors = ALL_CHARACTER_COLORS.sipho;
  return (
    <SimpleCharacter
      position={SIPHO_POSITION}
      bodyColor={colors.body}
      headColor={colors.skin}
      accentColor={colors.accent}
      scale={0.9}
      bounce={bounce}
      wave={wave}
    />
  );
}
