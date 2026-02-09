'use client';

import { create } from 'zustand';
import { TOTAL_STROKES } from '../lib/constants';

interface StrokeState {
  /** Progress through this stroke (0-1) */
  progress: number;
  /** Whether this stroke is fully completed */
  completed: boolean;
  /** Index of the last matched checkpoint along this stroke */
  lastCheckpoint: number;
}

interface TracingState {
  /** Per-stroke state */
  strokes: StrokeState[];
  /** Index of the stroke currently being traced (0-based) */
  currentStroke: number;
  /** Whether the user is actively touching/tracing */
  isTracing: boolean;
  /** Show Thandi's hint bubble */
  showThandiHint: boolean;
  /** Whether all strokes are complete */
  allComplete: boolean;

  /** Start tracing (finger down) */
  startTracing: () => void;
  /** Stop tracing (finger up) */
  stopTracing: () => void;
  /** Update progress on current stroke */
  updateStrokeProgress: (checkpoint: number, totalCheckpoints: number) => void;
  /** Mark current stroke as complete, advance to next */
  completeCurrentStroke: () => void;
  /** Show Thandi hint (auto-dismiss after 2s) */
  triggerThandiHint: () => void;
  /** Reset all tracing state */
  resetTracing: () => void;
}

const initialStrokes = (): StrokeState[] =>
  Array.from({ length: TOTAL_STROKES }, () => ({
    progress: 0,
    completed: false,
    lastCheckpoint: -1,
  }));

export const useTracingState = create<TracingState>((set, get) => ({
  strokes: initialStrokes(),
  currentStroke: 0,
  isTracing: false,
  showThandiHint: false,
  allComplete: false,

  startTracing: () => set({ isTracing: true }),

  stopTracing: () => set({ isTracing: false }),

  updateStrokeProgress: (checkpoint: number, totalCheckpoints: number) => {
    const { strokes, currentStroke } = get();
    if (currentStroke >= TOTAL_STROKES) return;
    if (checkpoint <= strokes[currentStroke].lastCheckpoint) return;

    const next = [...strokes];
    const progress = Math.min(1, (checkpoint + 1) / totalCheckpoints);
    next[currentStroke] = {
      ...next[currentStroke],
      progress,
      lastCheckpoint: checkpoint,
    };
    set({ strokes: next });
  },

  completeCurrentStroke: () => {
    const { strokes, currentStroke } = get();
    if (currentStroke >= TOTAL_STROKES) return;

    const next = [...strokes];
    next[currentStroke] = {
      ...next[currentStroke],
      progress: 1,
      completed: true,
    };

    const nextStroke = currentStroke + 1;
    const allComplete = nextStroke >= TOTAL_STROKES;

    set({
      strokes: next,
      currentStroke: nextStroke,
      isTracing: false,
      allComplete,
    });
  },

  triggerThandiHint: () => {
    set({ showThandiHint: true });
    setTimeout(() => {
      set({ showThandiHint: false });
    }, 2000);
  },

  resetTracing: () => {
    set({
      strokes: initialStrokes(),
      currentStroke: 0,
      isTracing: false,
      showThandiHint: false,
      allComplete: false,
    });
  },
}));

/** Derived: count of completed strokes */
export function useCompletedStrokeCount() {
  return useTracingState((s) => s.strokes.filter((st) => st.completed).length);
}

/** Derived: overall progress (0-1) across all strokes */
export function useOverallProgress() {
  return useTracingState((s) => {
    const total = s.strokes.length;
    if (total === 0) return 0;
    const sum = s.strokes.reduce((acc, st) => acc + st.progress, 0);
    return sum / total;
  });
}
