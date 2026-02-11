'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import {
  generateTapSfx,
  generateCorrectChime,
  generateTryAgainTone,
  generateCelebrationMelody,
  generateCountingBeep,
  generateAmbientSavanna,
} from '../lib/audioGenerator';

/**
 * Generates all Counting Animals audio as Web Audio API blobs on mount.
 * Loads them into the existing AudioManager via blob URLs.
 * Returns ready=true when all audio is loaded (or if generation fails gracefully).
 */
export function useAudioSetup(): { ready: boolean } {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        if (typeof OfflineAudioContext === 'undefined') {
          setReady(true);
          return;
        }

        const [
          tapSfx,
          correctChime,
          tryAgainTone,
          celebrateMelody,
          count1, count2, count3, count4, count5,
          count6, count7, count8, count9, count10,
          ambientSavanna,
        ] = await Promise.all([
          generateTapSfx(),
          generateCorrectChime(),
          generateTryAgainTone(),
          generateCelebrationMelody(),
          generateCountingBeep(1),
          generateCountingBeep(2),
          generateCountingBeep(3),
          generateCountingBeep(4),
          generateCountingBeep(5),
          generateCountingBeep(6),
          generateCountingBeep(7),
          generateCountingBeep(8),
          generateCountingBeep(9),
          generateCountingBeep(10),
          generateAmbientSavanna(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'voice' | 'ambient'][] = [
          ['ca-tap', tapSfx, 'sfx'],
          ['ca-correct', correctChime, 'sfx'],
          ['ca-tryagain', tryAgainTone, 'sfx'],
          ['ca-celebrate', celebrateMelody, 'music'],
          ['ca-count-1', count1, 'voice'],
          ['ca-count-2', count2, 'voice'],
          ['ca-count-3', count3, 'voice'],
          ['ca-count-4', count4, 'voice'],
          ['ca-count-5', count5, 'voice'],
          ['ca-count-6', count6, 'voice'],
          ['ca-count-7', count7, 'voice'],
          ['ca-count-8', count8, 'voice'],
          ['ca-count-9', count9, 'voice'],
          ['ca-count-10', count10, 'voice'],
          ['ca-ambient', ambientSavanna, 'ambient'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) {
          setReady(true);
        }
      } catch {
        // Audio generation failed — game still works without audio
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready };
}
