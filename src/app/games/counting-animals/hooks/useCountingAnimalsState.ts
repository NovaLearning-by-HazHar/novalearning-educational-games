'use client';

import { create } from 'zustand';
import type { SAAnimal } from '../lib/constants';
import { SA_ANIMALS, TOTAL_ROUNDS, DIFFICULTY_RANGES } from '../lib/constants';

type GameScreen = 'menu' | 'playing' | 'celebration' | 'complete';

interface CountingAnimalsState {
  /** Current screen */
  screen: GameScreen;
  /** Selected difficulty index (0=gentle, 1=growing, 2=confident) */
  difficulty: number;
  /** Current round (0-indexed) */
  round: number;
  /** Current animal being displayed */
  currentAnimal: SAAnimal | null;
  /** How many animals to count this round */
  targetCount: number;
  /** Which number the child selected (null if none yet) */
  selectedAnswer: number | null;
  /** Whether the selected answer is correct (null if not answered) */
  isCorrect: boolean | null;
  /** Total animals counted across all rounds */
  totalAnimalsCounted: number;
  /** Total correct answers */
  correctAnswers: number;
  /** The 4 shuffled answer options for the current round */
  numberOptions: number[];

  // Actions
  startGame: (difficulty: number) => void;
  generateRound: () => void;
  submitAnswer: (answer: number) => void;
  clearAnswer: () => void;
  advanceRound: () => void;
  completeGame: () => void;
  goToMenu: () => void;
  resetGame: () => void;
}

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate 4 shuffled answer options including the correct answer */
function generateOptions(correct: number, min: number, max: number): number[] {
  const options = new Set<number>([correct]);

  // Generate distractors that are different from correct
  let attempts = 0;
  while (options.size < 4 && attempts < 50) {
    const distractor = Math.floor(Math.random() * (max - min + 1)) + min;
    options.add(distractor);
    attempts++;
  }

  // If range is too small to get 4 unique, pad with nearby numbers
  let padding = 1;
  while (options.size < 4) {
    if (correct + padding <= 10) options.add(correct + padding);
    if (options.size < 4 && correct - padding >= 1) options.add(correct - padding);
    padding++;
  }

  // Shuffle using Fisher-Yates
  const arr = Array.from(options);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export const useCountingAnimalsState = create<CountingAnimalsState>((set, get) => ({
  screen: 'menu',
  difficulty: 0,
  round: 0,
  currentAnimal: null,
  targetCount: 0,
  selectedAnswer: null,
  isCorrect: null,
  totalAnimalsCounted: 0,
  correctAnswers: 0,
  numberOptions: [],

  startGame: (difficulty) => {
    set({ screen: 'playing', difficulty, round: 0, correctAnswers: 0, totalAnimalsCounted: 0 });
    // Generate first round immediately
    get().generateRound();
  },

  generateRound: () => {
    const { difficulty } = get();
    const [min, max] = DIFFICULTY_RANGES[difficulty];
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const animal = pickRandom(SA_ANIMALS);
    const options = generateOptions(count, min, max);

    set({
      currentAnimal: animal,
      targetCount: count,
      selectedAnswer: null,
      isCorrect: null,
      numberOptions: options,
    });
  },

  submitAnswer: (answer) => {
    const { targetCount } = get();
    const correct = answer === targetCount;
    set((s) => ({
      selectedAnswer: answer,
      isCorrect: correct,
      totalAnimalsCounted: correct ? s.totalAnimalsCounted + targetCount : s.totalAnimalsCounted,
      correctAnswers: correct ? s.correctAnswers + 1 : s.correctAnswers,
    }));
  },

  clearAnswer: () => {
    set({ selectedAnswer: null, isCorrect: null });
  },

  advanceRound: () => {
    const { round } = get();
    if (round + 1 >= TOTAL_ROUNDS) {
      set({ screen: 'complete' });
    } else {
      set({ round: round + 1, screen: 'playing' });
      get().generateRound();
    }
  },

  completeGame: () => {
    set({ screen: 'complete' });
  },

  goToMenu: () => {
    set({ screen: 'menu' });
  },

  resetGame: () => {
    set({
      screen: 'playing',
      round: 0,
      correctAnswers: 0,
      totalAnimalsCounted: 0,
      selectedAnswer: null,
      isCorrect: null,
    });
    get().generateRound();
  },
}));

/** Selector hooks for common values */
export const useScreen = () => useCountingAnimalsState((s) => s.screen);
export const useRound = () => useCountingAnimalsState((s) => s.round);
export const useCurrentAnimal = () => useCountingAnimalsState((s) => s.currentAnimal);
export const useTargetCount = () => useCountingAnimalsState((s) => s.targetCount);
export const useNumberOptions = () => useCountingAnimalsState((s) => s.numberOptions);
