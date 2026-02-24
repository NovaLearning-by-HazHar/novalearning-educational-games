'use client';

import { create } from 'zustand';
import { STORIES, type LangCode } from '../data/stories';

interface StoryState {
  currentStoryIndex: number;
  currentChapterIndex: number;
  currentStepIndex: number;
  completedClues: string[];
  lang: LangCode;
  taskAnswered: boolean;

  // Actions
  nextStep: () => void;
  completeClue: (clueId: string) => void;
  setLang: (lang: LangCode) => void;
  selectStory: (index: number) => void;
  setTaskAnswered: (answered: boolean) => void;
  resetStory: () => void;
}

export const useStoryState = create<StoryState>((set, get) => ({
  currentStoryIndex: -1, // -1 = story selection screen
  currentChapterIndex: 0,
  currentStepIndex: 0,
  completedClues: [],
  lang: 'en',
  taskAnswered: false,

  nextStep: () => {
    const { currentStoryIndex, currentChapterIndex, currentStepIndex } = get();
    if (currentStoryIndex < 0) return;

    const story = STORIES[currentStoryIndex];
    if (!story) return;

    const chapter = story.chapters[currentChapterIndex];
    if (!chapter) return;

    if (currentStepIndex < chapter.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1, taskAnswered: false });
    }
    // If at last step, stay there (celebration step)
  },

  completeClue: (clueId) => {
    const { completedClues } = get();
    if (!completedClues.includes(clueId)) {
      set({ completedClues: [...completedClues, clueId], taskAnswered: true });
    }
  },

  setLang: (lang) => set({ lang }),

  selectStory: (index) => set({
    currentStoryIndex: index,
    currentChapterIndex: 0,
    currentStepIndex: 0,
    taskAnswered: false,
  }),

  setTaskAnswered: (answered) => set({ taskAnswered: answered }),

  resetStory: () => set({
    currentStoryIndex: -1,
    currentChapterIndex: 0,
    currentStepIndex: 0,
    completedClues: [],
    taskAnswered: false,
  }),
}));

/** Derived: total completed clue count */
export function useCompletedClueCount() {
  return useStoryState((s) => s.completedClues.length);
}
