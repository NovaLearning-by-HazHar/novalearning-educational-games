import { createStore } from 'zustand/vanilla';
import { LETTER_ORDER } from '../config/letters.js';

/**
 * Game State Store — Zustand vanilla (no React dependency)
 * Tracks progress, scores, unlocks across all games
 */

const STORAGE_KEY = 'novalearning-progress';

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    const { currentLetter: _cl, currentDifficulty: _cd, currentGame: _cg, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

const defaultProgress = () => {
  const progress = {};
  LETTER_ORDER.forEach((letter) => {
    progress[letter] = {
      guided: { completed: false, stars: 0, bestScore: 0, attempts: 0 },
      assisted: { completed: false, stars: 0, bestScore: 0, attempts: 0 },
      independent: { completed: false, stars: 0, bestScore: 0, attempts: 0 },
    };
  });
  return progress;
};

const initialState = {
  // Session state (not persisted)
  currentGame: null,
  currentLetter: null,
  currentDifficulty: 'guided',
  
  // Persisted state
  playerName: '',
  soundEnabled: true,
  musicEnabled: true,
  letterProgress: defaultProgress(),
  totalStars: 0,
  ubuntuValues: [], // Collected Ubuntu values
  achievements: [],
  lastPlayed: null,
};

export const gameStore = createStore((set, get) => {
  const saved = loadSavedState();
  const merged = saved ? { ...initialState, ...saved } : { ...initialState };

  return {
    ...merged,

    // --- Session actions ---
    setCurrentGame: (game) => set({ currentGame: game }),
    setCurrentLetter: (letter) => set({ currentLetter: letter }),
    setCurrentDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),

    // --- Player actions ---
    setPlayerName: (name) => {
      set({ playerName: name });
      saveState(get());
    },

    // --- Settings ---
    toggleSound: () => {
      set((s) => ({ soundEnabled: !s.soundEnabled }));
      saveState(get());
    },
    toggleMusic: () => {
      set((s) => ({ musicEnabled: !s.musicEnabled }));
      saveState(get());
    },

    // --- Progress ---
    completeLevel: (letter, difficulty, score, stars) => {
      set((state) => {
        const letterProgress = { ...state.letterProgress };
        const levelData = { ...letterProgress[letter][difficulty] };
        
        levelData.completed = true;
        levelData.attempts += 1;
        levelData.stars = Math.max(levelData.stars, stars);
        levelData.bestScore = Math.max(levelData.bestScore, score);
        
        letterProgress[letter] = { ...letterProgress[letter], [difficulty]: levelData };
        
        // Recalculate total stars
        let totalStars = 0;
        Object.values(letterProgress).forEach((lp) => {
          Object.values(lp).forEach((dp) => {
            totalStars += dp.stars;
          });
        });

        const newState = {
          letterProgress,
          totalStars,
          lastPlayed: Date.now(),
        };

        return newState;
      });
      saveState(get());
    },

    // --- Ubuntu Values ---
    collectUbuntuValue: (value) => {
      set((state) => {
        if (state.ubuntuValues.includes(value)) return state;
        return { ubuntuValues: [...state.ubuntuValues, value] };
      });
      saveState(get());
    },

    // --- Achievements ---
    unlockAchievement: (achievement) => {
      set((state) => {
        if (state.achievements.find((a) => a.id === achievement.id)) return state;
        return {
          achievements: [...state.achievements, { ...achievement, unlockedAt: Date.now() }],
        };
      });
      saveState(get());
    },

    // --- Reset ---
    resetProgress: () => {
      set({
        letterProgress: defaultProgress(),
        totalStars: 0,
        ubuntuValues: [],
        achievements: [],
        lastPlayed: null,
      });
      saveState(get());
    },

    // --- Queries ---
    isLevelUnlocked: (letter, difficulty) => {
      const state = get();
      if (difficulty === 'guided') return true;
      
      const prev = difficulty === 'assisted' ? 'guided' : 'assisted';
      const prevData = state.letterProgress[letter]?.[prev];
      return prevData?.completed && prevData?.stars >= 2;
    },

    getLetterStars: (letter) => {
      const state = get();
      const lp = state.letterProgress[letter];
      if (!lp) return 0;
      return Object.values(lp).reduce((sum, d) => sum + d.stars, 0);
    },
  };
});
