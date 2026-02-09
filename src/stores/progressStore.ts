import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeviceTier, GamePhase } from '@/types/game';

interface GameProgress {
  gameId: string;
  completedAt: string;
  interactions: number;
  /** Session duration in seconds (Pattern 3: Metrics) */
  durationSeconds?: number;
  /** Phases visited during session (Pattern 3: Metrics) */
  phasesVisited?: GamePhase[];
  /** Device tier at time of play (Pattern 3: Metrics) */
  deviceTier?: DeviceTier;
}

interface ProgressState {
  /** History of completed game sessions */
  completedGames: GameProgress[];
  /** Last synced timestamp with Supabase (ISO string) */
  lastSynced: string | null;

  addCompletion: (
    gameId: string,
    interactions: number,
    session?: { durationSeconds?: number; phasesVisited?: GamePhase[]; deviceTier?: DeviceTier }
  ) => void;
  setLastSynced: (timestamp: string) => void;
  /** Get completions not yet synced to Supabase */
  getUnsynced: () => GameProgress[];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedGames: [],
      lastSynced: null,

      addCompletion: (gameId, interactions, session) =>
        set((state) => ({
          completedGames: [
            ...state.completedGames,
            {
              gameId,
              completedAt: new Date().toISOString(),
              interactions,
              durationSeconds: session?.durationSeconds,
              phasesVisited: session?.phasesVisited,
              deviceTier: session?.deviceTier,
            },
          ],
        })),
      setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
      getUnsynced: () => {
        const { completedGames, lastSynced } = get();
        if (!lastSynced) return completedGames;
        return completedGames.filter((g) => g.completedAt > lastSynced);
      },
    }),
    {
      name: 'novalearning-progress',
    }
  )
);
