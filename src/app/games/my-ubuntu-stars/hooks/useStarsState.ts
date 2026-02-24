'use client';

import { create } from 'zustand';
import type { TabType } from '../lib/constants';

interface StarsState {
  /** Currently selected badge ID (for detail popup) */
  selectedBadge: string | null;
  /** Active tab — individual or community */
  activeTab: TabType;
  /** Current language code */
  lang: string;
  /** Set of earned badge IDs (loaded from progressStore) */
  earnedBadges: Set<string>;

  selectBadge: (id: string | null) => void;
  setActiveTab: (tab: TabType) => void;
  setLang: (lang: string) => void;
  setEarnedBadges: (badges: string[]) => void;
  addEarnedBadge: (badgeId: string) => void;
  resetStars: () => void;
}

export const useStarsState = create<StarsState>((set) => ({
  selectedBadge: null,
  activeTab: 'individual',
  lang: 'en',
  earnedBadges: new Set<string>(),

  selectBadge: (id) => set({ selectedBadge: id }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setLang: (lang) => set({ lang }),

  setEarnedBadges: (badges) => set({ earnedBadges: new Set(badges) }),

  addEarnedBadge: (badgeId) =>
    set((state) => {
      const next = new Set(state.earnedBadges);
      next.add(badgeId);
      return { earnedBadges: next };
    }),

  resetStars: () =>
    set({
      selectedBadge: null,
      activeTab: 'individual',
    }),
}));

/** Derived: count of earned badges */
export function useEarnedCount() {
  return useStarsState((s) => s.earnedBadges.size);
}

/** Derived: count of earned badges by point type */
export function usePointCounts() {
  const earnedBadges = useStarsState((s) => s.earnedBadges);
  // We import lazily to avoid circular deps — caller should provide badge data
  return earnedBadges;
}
