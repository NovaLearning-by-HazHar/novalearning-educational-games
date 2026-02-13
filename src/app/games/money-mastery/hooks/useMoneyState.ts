'use client';

import { create } from 'zustand';
import type { ShopItem } from '../types/money';
import { GAME_SETTINGS } from '../lib/constants';

interface MoneyState {
  // Balance tracking
  balance: number;

  // Purchase tracking
  purchases: ShopItem[];

  // Garden state
  gardenActive: boolean;
  gardenCycleCount: number;

  // UI hints
  showLeratoHint: boolean;

  // Actions
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => void;
  addPurchase: (item: ShopItem) => void;
  setGardenActive: (active: boolean) => void;
  incrementGardenCycle: () => void;
  triggerLeratoHint: () => void;
  resetMoney: () => void;
}

export const useMoneyState = create<MoneyState>((set, get) => ({
  balance: 0,
  purchases: [],
  gardenActive: true, // Start with garden in explore phase
  gardenCycleCount: 0,
  showLeratoHint: false,

  addBalance: (amount) => {
    set({ balance: get().balance + amount });
  },

  deductBalance: (amount) => {
    const current = get().balance;
    set({ balance: Math.max(0, current - amount) });
  },

  addPurchase: (item) => {
    set({ purchases: [...get().purchases, item] });
  },

  setGardenActive: (active) => {
    set({ gardenActive: active });
  },

  incrementGardenCycle: () => {
    set({ gardenCycleCount: get().gardenCycleCount + 1 });
  },

  triggerLeratoHint: () => {
    set({ showLeratoHint: true });
    setTimeout(() => {
      set({ showLeratoHint: false });
    }, 2000);
  },

  resetMoney: () => {
    set({
      balance: 0,
      purchases: [],
      gardenActive: true,
      gardenCycleCount: 0,
      showLeratoHint: false,
    });
  },
}));

/** Derived: count of purchases made */
export function usePurchaseCount() {
  return useMoneyState((s) => s.purchases.length);
}

/** Derived: owned assets only */
export function useOwnedAssets() {
  return useMoneyState((s) => s.purchases.filter((p) => p.type === 'asset'));
}

/** Calculate earnings for current garden cycle based on owned assets */
export function calculateEarnings(purchases: ShopItem[]): number {
  const base = GAME_SETTINGS.baseEarning; // R5
  const assetIncome = purchases
    .filter((p) => p.type === 'asset')
    .reduce((sum, item) => sum + (item.incomePerCycle || 0), 0);
  return base + assetIncome;
}
