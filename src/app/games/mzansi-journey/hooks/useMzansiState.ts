'use client';

import { create } from 'zustand';
import type { Lang } from '../data/provinces';

interface MzansiState {
  /** Currently selected province ID (null = map overview) */
  selectedProvince: string | null;
  /** Set of visited province IDs */
  visitedProvinces: string[];
  /** Whether the fact panel is visible */
  showPanel: boolean;
  /** Current fact index (0-2) */
  currentFactIndex: number;
  /** Active display language */
  lang: Lang;

  selectProvince: (id: string) => void;
  closePanel: () => void;
  nextFact: () => void;
  setLang: (lang: Lang) => void;
  resetMzansi: () => void;
}

export const useMzansiState = create<MzansiState>((set, get) => ({
  selectedProvince: null,
  visitedProvinces: [],
  showPanel: false,
  currentFactIndex: 0,
  lang: 'en',

  selectProvince: (id: string) => {
    const { visitedProvinces } = get();
    const alreadyVisited = visitedProvinces.includes(id);
    set({
      selectedProvince: id,
      showPanel: true,
      currentFactIndex: 0,
      visitedProvinces: alreadyVisited
        ? visitedProvinces
        : [...visitedProvinces, id],
    });
  },

  closePanel: () => set({ showPanel: false, selectedProvince: null }),

  nextFact: () => {
    const { currentFactIndex } = get();
    set({ currentFactIndex: (currentFactIndex + 1) % 3 });
  },

  setLang: (lang: Lang) => set({ lang }),

  resetMzansi: () =>
    set({
      selectedProvince: null,
      visitedProvinces: [],
      showPanel: false,
      currentFactIndex: 0,
    }),
}));

/** Derived: number of provinces visited */
export function useVisitCount() {
  return useMzansiState((s) => s.visitedProvinces.length);
}
