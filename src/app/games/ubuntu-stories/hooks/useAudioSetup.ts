'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generatePageTurn,
  generateClueFound,
  generateTaskComplete,
  generateCelebrationMelody,
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

        const [pageTurn, clueFound, taskComplete, celebrateMelody] = await Promise.all([
          generatePageTurn(),
          generateClueFound(),
          generateTaskComplete(),
          generateCelebrationMelody(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music'][] = [
          ['page-turn', pageTurn, 'sfx'],
          ['clue-found', clueFound, 'sfx'],
          ['task-complete', taskComplete, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
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
