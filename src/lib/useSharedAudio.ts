'use client';

import { useEffect, useState, useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import type { AudioLanguage, AudioMap } from '@/types/audioMap';

/**
 * Fetches the pipeline-generated audio_map.json and loads all shared audio
 * (UI sounds, encouragement, instructions, phonics) into the AudioManager.
 *
 * Usage:
 *   const { ready, language, setLanguage } = useSharedAudio();
 *
 * Call this from any game page. The AudioManager is a singleton, so
 * calling this multiple times is safe — it won't re-fetch or reload.
 */
export function useSharedAudio(initialLanguage: AudioLanguage = 'en-ZA') {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<AudioLanguage>(initialLanguage);

  useEffect(() => {
    let cancelled = false;

    async function loadAudioMap() {
      try {
        const res = await fetch('/audio/audio_map.json');
        if (!res.ok) {
          console.warn('[useSharedAudio] Failed to fetch audio_map.json:', res.status);
          if (!cancelled) setReady(true);
          return;
        }

        const audioMap: AudioMap = await res.json();

        if (cancelled) return;

        // Set language before loading so the right variants are picked
        audioManager.setLanguage(initialLanguage);
        audioManager.loadFromMap(audioMap);

        if (!cancelled) {
          setReady(true);
        }
      } catch (err) {
        console.warn('[useSharedAudio] Audio map load error:', err);
        // Game is playable without shared audio
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadAudioMap();

    return () => {
      cancelled = true;
    };
  }, [initialLanguage]);

  const setLanguage = useCallback((lang: AudioLanguage) => {
    setLanguageState(lang);
    audioManager.setLanguage(lang);
  }, []);

  return { ready, language, setLanguage };
}
