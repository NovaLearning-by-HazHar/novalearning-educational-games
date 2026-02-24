'use client';

import SimpleCharacter from '@/app/games/count-to-five/components/SimpleCharacter';
import { JABU_POSITION, JABU_COLORS } from '../lib/constants';

interface JabuGuideProps {
  bounce?: boolean;
  wave?: boolean;
}

/** Jabu guide character for Ubuntu Garden. Reuses SimpleCharacter. */
export default function JabuGuide({ bounce = false, wave = true }: JabuGuideProps) {
  return (
    <SimpleCharacter
      position={JABU_POSITION}
      bodyColor={JABU_COLORS.body}
      headColor={JABU_COLORS.skin}
      accentColor={JABU_COLORS.accent}
      scale={0.9}
      bounce={bounce}
      wave={wave}
    />
  );
}
