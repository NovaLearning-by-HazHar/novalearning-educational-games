'use client';

import { create } from 'zustand';
import { TIMINGS } from '../lib/constants';

/**
 * Letter Explorer — per-game Zustand store.
 * Tracks discoveries, spotlight, and matching mini-game state.
 * Uses `type` (not interface) so it satisfies Record<string, unknown> constraint.
 */

type ExplorerPhase = 'explore' | 'spotlight' | 'matching' | 'celebrate';

type ExplorerState = {
  /** Which game sub-phase we're in */
  phase: ExplorerPhase;
  /** Set of discovered animal IDs */
  discoveries: Set<string>;
  /** Animal currently shown in the spotlight popup (null = none) */
  currentSpotlight: string | null;
  /** Letter selected in matching game (null = none) */
  selectedLetter: string | null;
  /** Array of animal IDs that have been matched */
  matchedPairs: string[];
  /** The 3 animals chosen for the matching game */
  matchingAnimals: string[];

  /* ── Actions ──────────────────────────────────────────────── */
  discover: (animalId: string) => void;
  dismissSpotlight: () => void;
  selectLetter: (letter: string | null) => void;
  attemptMatch: (animalId: string) => boolean;
  startMatching: () => void;
  setPhase: (phase: ExplorerPhase) => void;
  resetExplorer: () => void;
};

export const useExplorerState = create<ExplorerState>((set, get) => ({
  phase: 'explore',
  discoveries: new Set<string>(),
  currentSpotlight: null,
  selectedLetter: null,
  matchedPairs: [],
  matchingAnimals: [],

  discover: (animalId: string) => {
    const { discoveries } = get();
    if (discoveries.has(animalId)) return;

    const next = new Set(discoveries);
    next.add(animalId);
    set({ discoveries: next, currentSpotlight: animalId, phase: 'spotlight' });
  },

  dismissSpotlight: () => {
    const { discoveries } = get();
    // Auto-transition to matching after enough discoveries
    if (discoveries.size >= TIMINGS.discoveriesForMatching) {
      set({ currentSpotlight: null, phase: 'explore' });
      // Small delay then start matching
      setTimeout(() => {
        get().startMatching();
      }, 500);
    } else {
      set({ currentSpotlight: null, phase: 'explore' });
    }
  },

  startMatching: () => {
    const { discoveries } = get();
    // Pick the first 3 discovered animals
    const animals = Array.from(discoveries).slice(0, 3);
    set({ phase: 'matching', matchingAnimals: animals, matchedPairs: [], selectedLetter: null });
  },

  selectLetter: (letter: string | null) => {
    set({ selectedLetter: letter });
  },

  attemptMatch: (animalId: string) => {
    const { matchedPairs, matchingAnimals } = get();
    // The component only calls attemptMatch after verifying the letter matches.
    // Store stays pure — no ANIMALS import needed.
    if (matchedPairs.includes(animalId)) return false;

    // Correct match!
    const next = [...matchedPairs, animalId];
    set({ matchedPairs: next, selectedLetter: null });

    // All 3 matched → celebrate
    if (next.length >= matchingAnimals.length) {
      setTimeout(() => {
        set({ phase: 'celebrate' });
      }, 800);
    }
    return true;
  },

  setPhase: (phase: ExplorerPhase) => set({ phase }),

  resetExplorer: () =>
    set({
      phase: 'explore',
      discoveries: new Set<string>(),
      currentSpotlight: null,
      selectedLetter: null,
      matchedPairs: [],
      matchingAnimals: [],
    }),
}));

/* ── Derived selectors ────────────────────────────────────────── */

export function useDiscoveryCount() {
  return useExplorerState((s) => s.discoveries.size);
}

export function useIsDiscovered(animalId: string) {
  return useExplorerState((s) => s.discoveries.has(animalId));
}

export function useCanStartMatching() {
  return useExplorerState(
    (s) => s.discoveries.size >= TIMINGS.discoveriesForMatching,
  );
}

export function useIsMatchingComplete() {
  return useExplorerState(
    (s) => s.matchedPairs.length >= s.matchingAnimals.length && s.matchingAnimals.length > 0,
  );
}
