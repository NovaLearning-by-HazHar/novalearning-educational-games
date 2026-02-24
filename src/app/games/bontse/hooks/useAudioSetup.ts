'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateDiscoveryChime,
  generateCategoryTap,
  generateCelebrationMelody,
  generateAmbientNature,
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

        const [discoveryChime, categoryTap, celebrateMelody, ambientNature] = await Promise.all([
          generateDiscoveryChime(),
          generateCategoryTap(),
          generateCelebrationMelody(),
          generateAmbientNature(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'ambient'][] = [
          ['discovery-chime', discoveryChime, 'sfx'],
          ['category-tap', categoryTap, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-nature', ambientNature, 'ambient'],
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
