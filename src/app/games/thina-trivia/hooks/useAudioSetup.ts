'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateCorrectDing,
  generateGentleNudge,
  generateStarEarned,
  generateCelebrationMelody,
  generateButtonTap,
} from '../lib/audioGenerator';

export function useAudioSetup(): { ready: boolean } {
  const { ready: sharedReady } = useSharedAudio();
  const [synthReady, setSynthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        if (typeof OfflineAudioContext === 'undefined') {
          setSynthReady(true);
          return;
        }

        const [correctDing, gentleNudge, starEarned, celebrateMelody, buttonTap] = await Promise.all([
          generateCorrectDing(),
          generateGentleNudge(),
          generateStarEarned(),
          generateCelebrationMelody(),
          generateButtonTap(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music'][] = [
          ['correct-ding', correctDing, 'sfx'],
          ['gentle-nudge', gentleNudge, 'sfx'],
          ['star-earned', starEarned, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['button-tap', buttonTap, 'sfx'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) setSynthReady(true);
      } catch {
        if (!cancelled) setSynthReady(true);
      }
    }

    setup();
    return () => { cancelled = true; };
  }, []);

  return { ready: sharedReady && synthReady };
}
