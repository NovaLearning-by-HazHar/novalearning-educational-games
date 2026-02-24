'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generatePlantSound,
  generateTaskComplete,
  generateItemTap,
  generateCelebrationMelody,
  generateAmbientGarden,
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

        const [plantSound, taskComplete, itemTap, celebrateMelody, ambientGarden] = await Promise.all([
          generatePlantSound(),
          generateTaskComplete(),
          generateItemTap(),
          generateCelebrationMelody(),
          generateAmbientGarden(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'ambient'][] = [
          ['plant-sound', plantSound, 'sfx'],
          ['task-complete', taskComplete, 'sfx'],
          ['item-tap', itemTap, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-garden', ambientGarden, 'ambient'],
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
