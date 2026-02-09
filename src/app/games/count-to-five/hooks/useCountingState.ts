'use client';

import { create } from 'zustand';

interface MangoState {
  picked: boolean;
  arrivedAtBasket: boolean;
}

interface CountingState {
  mangoes: MangoState[];
  showSiphoHint: boolean;

  pickMango: (id: number) => void;
  mangoArrived: (id: number) => void;
  triggerSiphoHint: () => void;
  resetCounting: () => void;
}

const initialMangoes = (): MangoState[] =>
  Array.from({ length: 5 }, () => ({ picked: false, arrivedAtBasket: false }));

export const useCountingState = create<CountingState>((set, get) => ({
  mangoes: initialMangoes(),
  showSiphoHint: false,

  pickMango: (id: number) => {
    const { mangoes } = get();
    if (id < 0 || id >= mangoes.length || mangoes[id].picked) return;

    const next = [...mangoes];
    next[id] = { ...next[id], picked: true };
    set({ mangoes: next });
  },

  mangoArrived: (id: number) => {
    const { mangoes } = get();
    if (id < 0 || id >= mangoes.length) return;

    const next = [...mangoes];
    next[id] = { ...next[id], arrivedAtBasket: true };
    set({ mangoes: next });
  },

  triggerSiphoHint: () => {
    set({ showSiphoHint: true });
    setTimeout(() => {
      set({ showSiphoHint: false });
    }, 2000);
  },

  resetCounting: () => {
    set({ mangoes: initialMangoes(), showSiphoHint: false });
  },
}));

/** Derived: count of picked mangoes */
export function usePickedCount() {
  return useCountingState((s) => s.mangoes.filter((m) => m.picked).length);
}

/** Derived: count of mangoes that arrived at basket */
export function useArrivedCount() {
  return useCountingState((s) => s.mangoes.filter((m) => m.arrivedAtBasket).length);
}
