'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import { SA_COINS } from '../lib/constants';
import {
  generateCoinTone,
  generateCoinTapSfx,
  generateCoinFlipSfx,
  generateCelebrationMelody,
  generateAmbientMarket,
  generateCorrectSfx,
  generateTryAgainSfx,
} from '../lib/audioGenerator';

/**
 * Loads shared pipeline audio and generates game-specific synth audio.
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
        const coinTonePromises = SA_COINS.map((coin) => generateCoinTone(coin.id));
        const [
          ...coinTones
        ] = await Promise.all(coinTonePromises);

        const [
          coinTapSfx,
          coinFlipSfx,
          celebrateMelody,
          ambientMarket,
          correctSfx,
          tryAgainSfx,
        ] = await Promise.all([
          generateCoinTapSfx(),
          generateCoinFlipSfx(),
          generateCelebrationMelody(),
          generateAmbientMarket(),
          generateCorrectSfx(),
          generateTryAgainSfx(),
        ]);

        if (cancelled) return;

        // Register coin tones
        for (let i = 0; i < SA_COINS.length; i++) {
          const url = URL.createObjectURL(coinTones[i]);
          audioManager.load(`coin-tone-${SA_COINS[i].id}`, url, 'voice');
        }

        // Register SFX and ambient
        const blobs: [string, Blob, 'sfx' | 'music' | 'ambient'][] = [
          ['coin-tap', coinTapSfx, 'sfx'],
          ['coin-flip', coinFlipSfx, 'sfx'],
          ['money-celebrate', celebrateMelody, 'music'],
          ['ambient-market', ambientMarket, 'ambient'],
          ['correct-sfx', correctSfx, 'sfx'],
          ['try-again-sfx', tryAgainSfx, 'sfx'],
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
