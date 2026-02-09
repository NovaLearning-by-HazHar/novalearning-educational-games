import { create } from 'zustand';
import type { GamePhase, CharacterName } from '@/types/game';

interface GameState {
  /** Current phase in the Ubuntu gameplay loop */
  phase: GamePhase;
  /** Whether the game scene is loaded and ready */
  isLoaded: boolean;
  /** Active guide character for this game */
  activeCharacter: CharacterName;
  /** Number of interactions completed in current session */
  interactionCount: number;

  setPhase: (phase: GamePhase) => void;
  setLoaded: (loaded: boolean) => void;
  setActiveCharacter: (character: CharacterName) => void;
  incrementInteraction: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'explore',
  isLoaded: false,
  activeCharacter: 'sipho',
  interactionCount: 0,

  setPhase: (phase) => set({ phase }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setActiveCharacter: (character) => set({ activeCharacter: character }),
  incrementInteraction: () =>
    set((state) => ({ interactionCount: state.interactionCount + 1 })),
  reset: () =>
    set({
      phase: 'explore',
      isLoaded: false,
      interactionCount: 0,
    }),
}));
