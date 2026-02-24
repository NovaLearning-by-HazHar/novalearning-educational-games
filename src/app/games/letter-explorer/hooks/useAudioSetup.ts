'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import { useSharedAudio } from '@/lib/useSharedAudio';
import {
  generateAnimalTone,
  generateLetterAnnounce,
  generateMatchCorrect,
  generateMatchWrong,
  generateCelebrationMelody,
  generateSavannaAmbient,
} from '../lib/audioGenerator';

/**
 * Loads shared pipeline audio (encouragement, instructions, UI sounds)
 * and generates game-specific synth audio (animal tones, letter chimes, etc.)
 * Returns ready=true when both are loaded (or if generation fails).
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
          animalTone0,
          animalTone1,
          animalTone2,
          animalTone3,
          animalTone4,
          animalTone5,
          letterAnnounce0,
          letterAnnounce1,
          letterAnnounce2,
          letterAnnounce3,
          letterAnnounce4,
          letterAnnounce5,
          matchCorrect,
          matchWrong,
          celebrateMelody,
          savannaAmbient,
        ] = await Promise.all([
          generateAnimalTone(0),
          generateAnimalTone(1),
          generateAnimalTone(2),
          generateAnimalTone(3),
          generateAnimalTone(4),
          generateAnimalTone(5),
          generateLetterAnnounce(0),
          generateLetterAnnounce(1),
          generateLetterAnnounce(2),
          generateLetterAnnounce(3),
          generateLetterAnnounce(4),
          generateLetterAnnounce(5),
          generateMatchCorrect(),
          generateMatchWrong(),
          generateCelebrationMelody(),
          generateSavannaAmbient(),
        ]);

        if (cancelled) return;

        // Load into AudioManager as blob URLs
        const blobs: [string, Blob, 'sfx' | 'music' | 'voice' | 'ambient'][] = [
          ['animal-tone-0', animalTone0, 'sfx'],
          ['animal-tone-1', animalTone1, 'sfx'],
          ['animal-tone-2', animalTone2, 'sfx'],
          ['animal-tone-3', animalTone3, 'sfx'],
          ['animal-tone-4', animalTone4, 'sfx'],
          ['animal-tone-5', animalTone5, 'sfx'],
          ['letter-announce-0', letterAnnounce0, 'voice'],
          ['letter-announce-1', letterAnnounce1, 'voice'],
          ['letter-announce-2', letterAnnounce2, 'voice'],
          ['letter-announce-3', letterAnnounce3, 'voice'],
          ['letter-announce-4', letterAnnounce4, 'voice'],
          ['letter-announce-5', letterAnnounce5, 'voice'],
          ['match-correct', matchCorrect, 'sfx'],
          ['match-wrong', matchWrong, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-savanna', savannaAmbient, 'ambient'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) {
          setSynthReady(true);
        }
      } catch {
        // Audio generation failed — game playable without audio
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
