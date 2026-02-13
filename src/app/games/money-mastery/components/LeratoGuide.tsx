'use client';

import { useGameStore } from '@/stores/gameStore';
import { LERATO_POSITION, MVP_CHARACTER_COLORS, TEXT_CONTENT } from '../lib/constants';
import SimpleCharacter from '../../count-to-five/components/SimpleCharacter';
import { useMoneyState } from '../hooks/useMoneyState';

/**
 * Lerato character guide positioned at the shop counter.
 * Shows context-sensitive speech bubbles based on game phase.
 */
export default function LeratoGuide() {
  const phase = useGameStore((s) => s.phase);
  const showLeratoHint = useMoneyState((s) => s.showLeratoHint);

  const colors = MVP_CHARACTER_COLORS.lerato;

  // Determine speech bubble text based on phase
  let bubbleText = '';
  if (phase === 'explore') {
    bubbleText = showLeratoHint ? TEXT_CONTENT.explore.prompt : TEXT_CONTENT.explore.greeting;
  } else if (phase === 'discover') {
    bubbleText = TEXT_CONTENT.discover.prompt;
  } else if (phase === 'practice') {
    bubbleText = showLeratoHint ? TEXT_CONTENT.practice.bonusGarden : '';
  }

  return (
    <>
      <SimpleCharacter
        position={LERATO_POSITION}
        bodyColor={colors.body}
        headColor={colors.skin}
        accentColor={colors.accent}
        scale={1}
        bounce={phase === 'discover'}
        wave={phase === 'explore'}
      />

      {/* Speech bubble HTML overlay */}
      {bubbleText && (
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '3px solid #2E7D32',
            borderRadius: '16px',
            padding: '16px 24px',
            maxWidth: '280px',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2E7D32',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {bubbleText}
        </div>
      )}
    </>
  );
}