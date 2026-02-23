'use client';

import { create } from 'zustand';
import type { TriviaCategory } from '../lib/constants';
import { STAR_TARGET } from '../lib/constants';
import { QUESTIONS, getRandomQuestions } from '../data/questions';
import type { TriviaQuestion } from '../data/questions';

interface TriviaState {
  // Quiz state
  questions: TriviaQuestion[];
  currentIndex: number;
  stars: number;
  answeredCount: number;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrect: boolean;

  // Timer
  showTimer: boolean;
  timerActive: boolean;

  // Settings
  lang: string;
  categoryFilter: TriviaCategory | null;

  // Celebration
  celebrating: boolean;

  // Actions
  setLang: (lang: string) => void;
  setCategoryFilter: (cat: TriviaCategory | null) => void;
  startQuiz: () => void;
  submitAnswer: (index: number) => void;
  nextQuestion: () => void;
  toggleTimer: () => void;
  resetTrivia: () => void;
}

function buildQuestionPool(category: TriviaCategory | null): TriviaQuestion[] {
  if (category) {
    return getRandomQuestions(QUESTIONS.length, category);
  }
  return getRandomQuestions(QUESTIONS.length);
}

export const useTriviaState = create<TriviaState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  stars: 0,
  answeredCount: 0,
  selectedAnswer: null,
  showResult: false,
  isCorrect: false,

  showTimer: true,
  timerActive: false,

  lang: 'en',
  categoryFilter: null,

  celebrating: false,

  setLang: (lang) => set({ lang }),

  setCategoryFilter: (cat) => {
    set({ categoryFilter: cat });
    // Rebuild question pool when filter changes
    const pool = buildQuestionPool(cat);
    set({ questions: pool, currentIndex: 0, selectedAnswer: null, showResult: false });
  },

  startQuiz: () => {
    const { categoryFilter } = get();
    const pool = buildQuestionPool(categoryFilter);
    set({
      questions: pool,
      currentIndex: 0,
      stars: 0,
      answeredCount: 0,
      selectedAnswer: null,
      showResult: false,
      isCorrect: false,
      celebrating: false,
      timerActive: true,
    });
  },

  submitAnswer: (index) => {
    const { questions, currentIndex, stars, answeredCount, showResult } = get();
    if (showResult) return; // Prevent double-tap

    const question = questions[currentIndex];
    if (!question) return;

    const correct = index === question.correctIndex;
    const newStars = correct ? stars + 1 : stars;
    const celebrating = newStars >= STAR_TARGET;

    set({
      selectedAnswer: index,
      showResult: true,
      isCorrect: correct,
      stars: newStars,
      answeredCount: answeredCount + 1,
      celebrating,
      timerActive: false,
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions, categoryFilter } = get();
    const nextIndex = currentIndex + 1;

    // If we run out of questions, reshuffle
    if (nextIndex >= questions.length) {
      const pool = buildQuestionPool(categoryFilter);
      set({ questions: pool, currentIndex: 0, selectedAnswer: null, showResult: false, timerActive: true });
      return;
    }

    set({
      currentIndex: nextIndex,
      selectedAnswer: null,
      showResult: false,
      isCorrect: false,
      timerActive: true,
    });
  },

  toggleTimer: () => set((s) => ({ showTimer: !s.showTimer })),

  resetTrivia: () => set({
    questions: [],
    currentIndex: 0,
    stars: 0,
    answeredCount: 0,
    selectedAnswer: null,
    showResult: false,
    isCorrect: false,
    showTimer: true,
    timerActive: false,
    categoryFilter: null,
    celebrating: false,
  }),
}));

/** Derived: current question */
export function useCurrentQuestion(): TriviaQuestion | null {
  return useTriviaState((s) => s.questions[s.currentIndex] ?? null);
}

/** Derived: star count */
export function useStarCount(): number {
  return useTriviaState((s) => s.stars);
}
