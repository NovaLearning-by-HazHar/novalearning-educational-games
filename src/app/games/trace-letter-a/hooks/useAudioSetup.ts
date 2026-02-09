'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import {
  generateTracingTone,
  generateCheckpointTone,
  generateStrokeComplete,
  generateLetterSound,
  generateCelebrationMelody,
  generateAmbientNature,
} from '../lib/audioGenerator';

/**
 * Generates all tracing game audio as Web Audio API blobs on mount.
 * Loads them into AudioManager via blob URLs.
 * Returns ready=true when all audio is loaded.
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
          tracingTone,
          checkpoint1, checkpoint2, checkpoint3,
          checkpoint4, checkpoint5, checkpoint6,
          strokeComplete,
          letterSound,
          celebrateMelody,
          ambientNature,
        ] = await Promise.all([
          generateTracingTone(),
          generateCheckpointTone(0),
          generateCheckpointTone(1),
          generateCheckpointTone(2),
          generateCheckpointTone(3),
          generateCheckpointTone(4),
          generateCheckpointTone(5),
          generateStrokeComplete(),
          generateLetterSound(),
          generateCelebrationMelody(),
          generateAmbientNature(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, 'sfx' | 'music' | 'voice' | 'ambient'][] = [
          ['tracing-tone', tracingTone, 'sfx'],
          ['checkpoint-1', checkpoint1, 'sfx'],
          ['checkpoint-2', checkpoint2, 'sfx'],
          ['checkpoint-3', checkpoint3, 'sfx'],
          ['checkpoint-4', checkpoint4, 'sfx'],
          ['checkpoint-5', checkpoint5, 'sfx'],
          ['checkpoint-6', checkpoint6, 'sfx'],
          ['stroke-complete', strokeComplete, 'sfx'],
          ['letter-sound', letterSound, 'voice'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-nature', ambientNature, 'ambient'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) {
          setReady(true);
        }
      } catch {
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
