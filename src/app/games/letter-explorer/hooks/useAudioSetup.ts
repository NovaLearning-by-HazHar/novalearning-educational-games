'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';
import type { AudioCategory } from '@/lib/audio';
import {
  generateMarimbaTone,
  generateAardvarkSound,
  generateBaboonSound,
  generateCheetahSound,
  generateDungBeetleSound,
  generateElephantSound,
  generateFlamingoSound,
  generateDiscoverChime,
  generateMatchCorrect,
  generateMatchTryAgain,
  generateCelebrationMelody,
  generateAmbientSavanna,
} from '../lib/audioGenerator';

/**
 * Generates all Letter Explorer audio as Web Audio blobs on mount.
 * Loads them into the shared AudioManager via blob URLs.
 * Returns ready=true when all audio is loaded (or on failure — game still works).
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

        // Generate all audio blobs in parallel
        const [
          marimbaA, marimbaB, marimbaC, marimbaD, marimbaE, marimbaF,
          animalAardvark, animalBaboon, animalCheetah,
          animalDungBeetle, animalElephant, animalFlamingo,
          discoverChime, matchCorrect, matchTryAgain,
          celebrateMelody, ambientSavanna,
        ] = await Promise.all([
          generateMarimbaTone('A'),
          generateMarimbaTone('B'),
          generateMarimbaTone('C'),
          generateMarimbaTone('D'),
          generateMarimbaTone('E'),
          generateMarimbaTone('F'),
          generateAardvarkSound(),
          generateBaboonSound(),
          generateCheetahSound(),
          generateDungBeetleSound(),
          generateElephantSound(),
          generateFlamingoSound(),
          generateDiscoverChime(),
          generateMatchCorrect(),
          generateMatchTryAgain(),
          generateCelebrationMelody(),
          generateAmbientSavanna(),
        ]);

        if (cancelled) return;

        const blobs: [string, Blob, AudioCategory][] = [
          ['marimba-A', marimbaA, 'sfx'],
          ['marimba-B', marimbaB, 'sfx'],
          ['marimba-C', marimbaC, 'sfx'],
          ['marimba-D', marimbaD, 'sfx'],
          ['marimba-E', marimbaE, 'sfx'],
          ['marimba-F', marimbaF, 'sfx'],
          ['animal-aardvark', animalAardvark, 'voice'],
          ['animal-baboon', animalBaboon, 'voice'],
          ['animal-cheetah', animalCheetah, 'voice'],
          ['animal-dungBeetle', animalDungBeetle, 'voice'],
          ['animal-elephant', animalElephant, 'voice'],
          ['animal-flamingo', animalFlamingo, 'voice'],
          ['discover-chime', discoverChime, 'sfx'],
          ['match-correct', matchCorrect, 'sfx'],
          ['match-try-again', matchTryAgain, 'sfx'],
          ['celebrate-melody', celebrateMelody, 'music'],
          ['ambient-savanna', ambientSavanna, 'ambient'],
        ];

        for (const [id, blob, category] of blobs) {
          const url = URL.createObjectURL(blob);
          audioManager.load(id, url, category);
        }

        if (!cancelled) setReady(true);
      } catch {
        // Audio generation failed — game still playable
        if (!cancelled) setReady(true);
      }
    }

    setup();
    return () => { cancelled = true; };
  }, []);

  return { ready };
}
