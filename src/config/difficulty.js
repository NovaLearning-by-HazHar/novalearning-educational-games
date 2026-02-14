/**
 * Difficulty Configuration
 * Three levels that scaffold learning for Grade R (ages 5-6)
 */

export const DIFFICULTY = {
  GUIDED: {
    id: 'guided',
    label: 'Guided',
    description: 'Full support — visual hints, audio prompts, no time pressure',
    showHints: true,
    audioPrompts: true,
    timerEnabled: false,
    maxAttempts: Infinity,
    pointsMultiplier: 1,
    unlockRequirement: null, // Available from start
  },
  ASSISTED: {
    id: 'assisted',
    label: 'Assisted',
    description: 'Some support — fewer hints, gentle encouragement on mistakes',
    showHints: false,
    audioPrompts: true,
    timerEnabled: false,
    maxAttempts: 3,
    pointsMultiplier: 1.5,
    unlockRequirement: { level: 'guided', starsRequired: 2 },
  },
  INDEPENDENT: {
    id: 'independent',
    label: 'Independent',
    description: 'Minimal support — child demonstrates mastery',
    showHints: false,
    audioPrompts: false,
    timerEnabled: true,
    timerSeconds: 30,
    maxAttempts: 1,
    pointsMultiplier: 2,
    unlockRequirement: { level: 'assisted', starsRequired: 2 },
  },
};

export const DIFFICULTY_ORDER = ['guided', 'assisted', 'independent'];

export function getDifficulty(id) {
  return Object.values(DIFFICULTY).find((d) => d.id === id) || DIFFICULTY.GUIDED;
}
