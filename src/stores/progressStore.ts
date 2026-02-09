import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameProgress {
  gameId: string;
  completedAt: string;
  interactions: number;
}

interface ProgressState {
  /** History of completed game sessions */
  completedGames: GameProgress[];
  /** Last synced timestamp with Supabase (ISO string) */
  lastSynced: string | null;

  addCompletion: (gameId: string, interactions: number) => void;
  setLastSynced: (timestamp: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedGames: [],
      lastSynced: null,

      addCompletion: (gameId, interactions) =>
        set((state) => ({
          completedGames: [
            ...state.completedGames,
            {
              gameId,
              completedAt: new Date().toISOString(),
              interactions,
            },
          ],
        })),
      setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
    }),
    {
      name: 'novalearning-progress',
    }
  )
);
