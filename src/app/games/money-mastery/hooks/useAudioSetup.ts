'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateWaterSplash,
  generateCoinPop,
  generateGardenComplete,
  generatePurchaseChime,
  generateChaChing,
} from '../lib/audioGenerator';

/**
 * Loads shared pipeline audio (encouragement, instructions, UI sounds)
 * and generates Money Mastery synth audio (water splash, coin pop, etc.)
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
        const [waterSplash, coinPop, gardenComplete, purchaseChime, chaChing] =
          await Promise.all([
            generateWaterSplash(),
            generateCoinPop(),
            generateGardenComplete(),
            generatePurchaseChime(),
            generateChaChing(),
          ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'voice' | 'ambient'][] = [
          ['water-splash', waterSplash, 'sfx'],
          ['coin-pop', coinPop, 'sfx'],
          ['garden-complete', gardenComplete, 'music'],
          ['purchase-chime', purchaseChime, 'sfx'],
          ['cha-ching', chaChing, 'sfx'],
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