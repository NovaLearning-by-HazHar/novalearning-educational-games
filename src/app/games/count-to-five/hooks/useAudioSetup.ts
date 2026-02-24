'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateMarimbaTone,
  generatePickSfx,
  generateCountingBeep,
  generateCelebrationMelody,
  generateAmbientWind,
} from '../lib/audioGenerator';

/**
 * Loads shared pipeline audio (encouragement, instructions, UI sounds)
 * and generates game-specific synth audio (marimba, counting beeps, etc.)
 * Returns ready=true when both are loaded.
 */
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

        // Generate all game-specific audio blobs in parallel
        const [
          marimba1, marimba2, marimba3, marimba4, marimba5,
          pickSfx,
          count1, count2, count3, count4, count5,
          celebrateMelody,
          ambientWind,
        ] = await Promise.all([
          generateMarimbaTone(0),
          generateMarimbaTone(1),
          generateMarimbaTone(2),
          generateMarimbaTone(3),
          generateMarimbaTone(4),
          generatePickSfx(),
          generateCountingBeep(1),
          generateCountingBeep(2),
          generateCountingBeep(3),
          generateCountingBeep(4),
          generateCountingBeep(5),
          generateCelebrationMelody(),
          generateAmbientWind(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'voice' | 'ambient'][] = [
          ['marimba-1', marimba1, 'sfx'],
          ['marimba-2', marimba2, 'sfx'],
          ['marimba-3', marimba3, 'sfx'],
          ['marimba-4', marimba4, 'sfx'],
          ['marimba-5', marimba5, 'sfx'],
          ['pick-sfx', pickSfx, 'sfx'],
          ['count-1', count1, 'voice'],
          ['count-2', count2, 'voice'],
          ['count-3', count3, 'voice'],
          ['count-4', count4, 'voice'],
          ['count-5', count5, 'voice'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-wind', ambientWind, 'ambient'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) {
          setSynthReady(true);
        }
      } catch {
        if (!cancelled) {
          setSynthReady(true);
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready: sharedReady && synthReady };
}
