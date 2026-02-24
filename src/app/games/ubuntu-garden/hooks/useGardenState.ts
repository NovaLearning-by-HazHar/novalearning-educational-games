'use client';

import { create } from 'zustand';
import type { ItemCategory } from '../data/garden-items';

export interface PlacedItem {
  itemId: string;
  col: number;
  row: number;
}

interface GardenState {
  placedItems: PlacedItem[];
  currentTaskItemId: string | null;
  selectedCategory: ItemCategory | null;
  selectedItemId: string | null;
  lang: string;

  selectCategory: (cat: ItemCategory | null) => void;
  selectItem: (itemId: string) => void;
  startTask: (itemId: string) => void;
  completeTask: () => void;
  cancelTask: () => void;
  placeItem: (itemId: string, col: number, row: number) => void;
  setLang: (lang: string) => void;
  resetGarden: () => void;
}

/** Find next available grid cell (left-to-right, top-to-bottom) */
function findNextCell(placed: PlacedItem[], gridSize: number): { col: number; row: number } | null {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const taken = placed.some((p) => p.col === col && p.row === row);
      if (!taken) return { col, row };
    }
  }
  return null;
}

export const useGardenState = create<GardenState>((set, get) => ({
  placedItems: [],
  currentTaskItemId: null,
  selectedCategory: null,
  selectedItemId: null,
  lang: 'en',

  selectCategory: (cat) => set({ selectedCategory: cat, selectedItemId: null }),

  selectItem: (itemId) => set({ selectedItemId: itemId }),

  startTask: (itemId) => set({ currentTaskItemId: itemId }),

  completeTask: () => {
    const { currentTaskItemId, placedItems } = get();
    if (!currentTaskItemId) return;

    const cell = findNextCell(placedItems, 4);
    if (!cell) {
      // Grid full — just close task
      set({ currentTaskItemId: null, selectedItemId: null });
      return;
    }

    set({
      placedItems: [...placedItems, { itemId: currentTaskItemId, col: cell.col, row: cell.row }],
      currentTaskItemId: null,
      selectedItemId: null,
    });
  },

  cancelTask: () => set({ currentTaskItemId: null }),

  placeItem: (itemId, col, row) => {
    const { placedItems } = get();
    const taken = placedItems.some((p) => p.col === col && p.row === row);
    if (taken) return;
    set({ placedItems: [...placedItems, { itemId, col, row }] });
  },

  setLang: (lang) => set({ lang }),

  resetGarden: () => set({
    placedItems: [],
    currentTaskItemId: null,
    selectedCategory: null,
    selectedItemId: null,
  }),
}));

/** Derived: total placed items count */
export function usePlacedCount() {
  return useGardenState((s) => s.placedItems.length);
}
