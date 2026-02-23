'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateProvinceChime,
  generateMapTap,
  generateStickerCollect,
  generateCelebrationMelody,
  generateAmbientNature,
} from '../lib/audioGenerator';

/**
 * Loads shared pipeline audio (encouragement, instructions, UI sounds)
 * and generates game-specific synth audio (province chime, map tap, etc.)
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

        const [provinceChime, mapTap, stickerCollect, celebrateMelody, ambientNature] =
          await Promise.all([
            generateProvinceChime(),
            generateMapTap(),
            generateStickerCollect(),
            generateCelebrationMelody(),
            generateAmbientNature(),
          ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'ambient'][] = [
          ['province-chime', provinceChime, 'sfx'],
          ['map-tap', mapTap, 'sfx'],
          ['sticker-collect', stickerCollect, 'sfx'],
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
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready: sharedReady && synthReady };
}
