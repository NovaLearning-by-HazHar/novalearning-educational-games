'use client';

import { create } from 'zustand';
import type { CoinId } from '../types/money-skills';

interface MoneySkillsState {
  coinsExplored: CoinId[];
  selectedCoin: CoinId | null;
  coinsInspected: CoinId[];
  practiceRound: number;
  practiceCorrect: number;
  practiceAttempted: number;
  wrongAttemptsThisRound: number;
  showHintGlow: boolean;

  exploreCoin: (id: CoinId) => void;
  selectCoin: (id: CoinId | null) => void;
  inspectCoin: (id: CoinId) => void;
  submitPracticeAnswer: (id: CoinId, correctId: CoinId) => void;
  nextPracticeRound: () => void;
  resetMoneySkills: () => void;
}

export const useMoneySkillsState = create<MoneySkillsState>((set, get) => ({
  coinsExplored: [],
  selectedCoin: null,
  coinsInspected: [],
  practiceRound: 0,
  practiceCorrect: 0,
  practiceAttempted: 0,
  wrongAttemptsThisRound: 0,
  showHintGlow: false,

  exploreCoin: (id: CoinId) => {
    const { coinsExplored } = get();
    if (coinsExplored.includes(id)) return;
    set({ coinsExplored: [...coinsExplored, id] });
  },

  selectCoin: (id: CoinId | null) => {
    set({ selectedCoin: id });
  },

  inspectCoin: (id: CoinId) => {
    const { coinsInspected } = get();
    if (coinsInspected.includes(id)) return;
    set({ coinsInspected: [...coinsInspected, id] });
  },

  submitPracticeAnswer: (id: CoinId, correctId: CoinId) => {
    const { wrongAttemptsThisRound } = get();
    if (id === correctId) {
      set((s) => ({
        practiceCorrect: s.practiceCorrect + 1,
        practiceAttempted: s.practiceAttempted + 1,
        wrongAttemptsThisRound: 0,
        showHintGlow: false,
      }));
    } else {
      const newWrong = wrongAttemptsThisRound + 1;
      set({
        practiceAttempted: get().practiceAttempted + 1,
        wrongAttemptsThisRound: newWrong,
        showHintGlow: newWrong >= 2,
      });
    }
  },

  nextPracticeRound: () => {
    set((s) => ({
      practiceRound: s.practiceRound + 1,
      wrongAttemptsThisRound: 0,
      showHintGlow: false,
    }));
  },

  resetMoneySkills: () => {
    set({
      coinsExplored: [],
      selectedCoin: null,
      coinsInspected: [],
      practiceRound: 0,
      practiceCorrect: 0,
      practiceAttempted: 0,
      wrongAttemptsThisRound: 0,
      showHintGlow: false,
    });
  },
}));

/** Derived: number of unique coins explored */
export function useExploredCount() {
  return useMoneySkillsState((s) => s.coinsExplored.length);
}

/** Derived: number of unique coins inspected */
export function useInspectedCount() {
  return useMoneySkillsState((s) => s.coinsInspected.length);
}
