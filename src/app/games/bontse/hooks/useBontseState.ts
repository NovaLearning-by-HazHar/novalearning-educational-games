'use client';

import { create } from 'zustand';
import type { DiscoveryCategory } from '../data/discoveries';

interface DiscoveredItem {
  categoryId: DiscoveryCategory;
  itemId: string;
}

interface BontseState {
  selectedCategory: DiscoveryCategory | null;
  selectedItemId: string | null;
  currentFactIndex: number;
  discovered: DiscoveredItem[];
  showPanel: boolean;
  lang: string;

  selectCategory: (cat: DiscoveryCategory) => void;
  selectItem: (itemId: string) => void;
  nextFact: () => void;
  closePanel: () => void;
  markDiscovered: (categoryId: DiscoveryCategory, itemId: string) => void;
  setLang: (lang: string) => void;
  resetBontse: () => void;
}

export const useBontseState = create<BontseState>((set, get) => ({
  selectedCategory: null,
  selectedItemId: null,
  currentFactIndex: 0,
  discovered: [],
  showPanel: false,
  lang: 'en',

  selectCategory: (cat) => set({ selectedCategory: cat, selectedItemId: null, showPanel: false }),

  selectItem: (itemId) => {
    const { selectedCategory } = get();
    if (!selectedCategory) return;
    set({ selectedItemId: itemId, currentFactIndex: 0, showPanel: true });

    // Auto-mark discovered
    const { discovered } = get();
    const already = discovered.some((d) => d.categoryId === selectedCategory && d.itemId === itemId);
    if (!already) {
      set({ discovered: [...discovered, { categoryId: selectedCategory, itemId }] });
    }
  },

  nextFact: () => {
    const { currentFactIndex } = get();
    set({ currentFactIndex: (currentFactIndex + 1) % 3 });
  },

  closePanel: () => set({ showPanel: false, selectedItemId: null }),

  markDiscovered: (categoryId, itemId) => {
    const { discovered } = get();
    const already = discovered.some((d) => d.categoryId === categoryId && d.itemId === itemId);
    if (!already) {
      set({ discovered: [...discovered, { categoryId, itemId }] });
    }
  },

  setLang: (lang) => set({ lang }),

  resetBontse: () => set({
    selectedCategory: null,
    selectedItemId: null,
    currentFactIndex: 0,
    discovered: [],
    showPanel: false,
  }),
}));

/** Derived: total discoveries count */
export function useDiscoveryCount() {
  return useBontseState((s) => s.discovered.length);
}
