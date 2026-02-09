import { create } from 'zustand';
import type { GamePhase, CharacterName } from '@/types/game';

/** Valid phase transitions in the Ubuntu gameplay loop */
const PHASE_ORDER: GamePhase[] = ['explore', 'discover', 'practice', 'celebrate'];

interface GameState {
  /** Current phase in the Ubuntu gameplay loop */
  phase: GamePhase;
  /** Whether the game scene is loaded and ready */
  isLoaded: boolean;
  /** Active guide character for this game */
  activeCharacter: CharacterName;
  /** Number of interactions completed in current session */
  interactionCount: number;
  /** Target interactions needed to advance from practice → celebrate */
  targetInteractions: number;

  setPhase: (phase: GamePhase) => void;
  /** Advance to the next phase in EXPLORE→DISCOVER→PRACTICE→CELEBRATE */
  advancePhase: () => void;
  setLoaded: (loaded: boolean) => void;
  setActiveCharacter: (character: CharacterName) => void;
  setTargetInteractions: (count: number) => void;
  incrementInteraction: () => void;
  /** Check if we should auto-advance to celebrate phase */
  shouldCelebrate: () => boolean;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'explore',
  isLoaded: false,
  activeCharacter: 'sipho',
  interactionCount: 0,
  targetInteractions: 5,

  setPhase: (phase) => set({ phase }),

  advancePhase: () => {
    const { phase } = get();
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      set({ phase: PHASE_ORDER[currentIndex + 1] });
    }
  },

  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setActiveCharacter: (character) => set({ activeCharacter: character }),
  setTargetInteractions: (count) => set({ targetInteractions: count }),

  incrementInteraction: () => {
    const { interactionCount, targetInteractions, phase } = get();
    const newCount = interactionCount + 1;
    set({ interactionCount: newCount });
    // Auto-advance to celebrate when target reached during practice
    if (phase === 'practice' && newCount >= targetInteractions) {
      set({ phase: 'celebrate' });
    }
  },

  shouldCelebrate: () => {
    const { interactionCount, targetInteractions } = get();
    return interactionCount >= targetInteractions;
  },

  reset: () =>
    set({
      phase: 'explore',
      isLoaded: false,
      interactionCount: 0,
    }),
}));
