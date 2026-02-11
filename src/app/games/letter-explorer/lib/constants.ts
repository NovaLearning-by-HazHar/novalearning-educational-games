/** Letter Explorer Game — Constants */

import type { CharacterColors } from '@/app/games/count-to-five/lib/constants';

// ─── Animal Definitions ───────────────────────────────────────────────
export interface AnimalDef {
  id: string;
  letter: string;
  name: string;
  emoji: string;
  ubuntuValue: string;
  /** Icon name for the ubuntu value (emoji-free, rendered as simple shape) */
  valueIcon: 'magnifyingGlass' | 'heartFamily' | 'shield' | 'flexedArm' | 'star' | 'flower';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  /** World-space position on the savanna */
  position: [number, number, number];
  /** Y rotation so animal faces camera roughly */
  rotation: number;
}

export const ANIMALS: AnimalDef[] = [
  {
    id: 'aardvark',
    letter: 'A',
    name: 'Aardvark',
    emoji: '🐾',
    ubuntuValue: 'Curiosity',
    valueIcon: 'magnifyingGlass',
    colors: { primary: '#C4A882', secondary: '#A68B6B', accent: '#8B7355' },
    position: [-3.5, 0, -1.5],
    rotation: 0.3,
  },
  {
    id: 'baboon',
    letter: 'B',
    name: 'Baboon',
    emoji: '🐒',
    ubuntuValue: 'Family',
    valueIcon: 'heartFamily',
    colors: { primary: '#8B7D6B', secondary: '#6B5B4B', accent: '#D4A574' },
    position: [3.0, 0, -2.0],
    rotation: -0.4,
  },
  {
    id: 'cheetah',
    letter: 'C',
    name: 'Cheetah',
    emoji: '🐆',
    ubuntuValue: 'Courage',
    valueIcon: 'shield',
    colors: { primary: '#DAA520', secondary: '#B8860B', accent: '#333333' },
    position: [-2.0, 0, 1.5],
    rotation: 0.5,
  },
  {
    id: 'dungBeetle',
    letter: 'D',
    name: 'Dung Beetle',
    emoji: '🪲',
    ubuntuValue: 'Hard Work',
    valueIcon: 'flexedArm',
    colors: { primary: '#2F4F4F', secondary: '#1C3A3A', accent: '#4A7A6F' },
    position: [1.5, 0, 2.0],
    rotation: -0.2,
  },
  {
    id: 'elephant',
    letter: 'E',
    name: 'Elephant',
    emoji: '🐘',
    ubuntuValue: 'Wisdom',
    valueIcon: 'star',
    colors: { primary: '#808080', secondary: '#696969', accent: '#A9A9A9' },
    position: [0, 0, -3.0],
    rotation: 0,
  },
  {
    id: 'flamingo',
    letter: 'F',
    name: 'Flamingo',
    emoji: '🦩',
    ubuntuValue: 'Beauty',
    valueIcon: 'flower',
    colors: { primary: '#FF69B4', secondary: '#FF1493', accent: '#FF8C00' },
    position: [-4.0, 0, 0],
    rotation: 0.6,
  },
];

// ─── Savanna Colors ───────────────────────────────────────────────────
export const SAVANNA_COLORS = {
  ground: '#C2B280',
  groundDark: '#A89060',
  skyTop: '#87CEEB',
  skyBottom: '#FFD700',
  treeTrunk: '#6D4C41',
  treeCanopy: '#556B2F',
  treeCanopyLight: '#6B8E23',
  grass: '#8FBC8F',
  grassDark: '#6B8E23',
} as const;

// ─── Floating Letter ──────────────────────────────────────────────────
export const LETTER_HEIGHT_OFFSET = 1.8;
export const LETTER_BOB_SPEED = 1.2;
export const LETTER_BOB_AMPLITUDE = 0.08;
export const LETTER_COLOR = '#FFFFFF';
export const LETTER_BG_COLOR = '#FF6F00';

// ─── Sipho Guide ──────────────────────────────────────────────────────
export const SIPHO_POSITION: [number, number, number] = [4.5, 0, 1.5];

// ─── Timing ───────────────────────────────────────────────────────────
export const TIMINGS = {
  /** How long the spotlight popup stays (ms) */
  spotlightDuration: 3500,
  /** Delay before match feedback (ms) */
  matchFeedbackDelay: 300,
  /** Stagger between celebration character entrances (ms) */
  celebrationStagger: 200,
  /** How long before Play Again appears (ms) */
  playAgainDelay: 4000,
  /** Animal pop-up spring animation duration (ms) */
  animalPopDuration: 600,
  /** How many discoveries before matching game */
  discoveriesForMatching: 3,
} as const;

// ─── Character Colors (all 6 for celebration) ─────────────────────────
export const EXPLORER_CHARACTER_COLORS: Record<string, CharacterColors> = {
  sipho: { body: '#E65100', accent: '#FF6D00', skin: '#8D6E63' },
  thandi: { body: '#1565C0', accent: '#42A5F5', skin: '#A1887F' },
  lerato: { body: '#2E7D32', accent: '#66BB6A', skin: '#8D6E63' },
  pieter: { body: '#F57F17', accent: '#FFCA28', skin: '#FFCCBC' },
  fatima: { body: '#6A1B9A', accent: '#AB47BC', skin: '#D7CCC8' },
  amahle: { body: '#D84315', accent: '#FF8A65', skin: '#8D6E63' },
};

export const ALL_EXPLORER_CHARACTERS = [
  'sipho', 'thandi', 'lerato', 'pieter', 'fatima', 'amahle',
] as const;

/** Semicircle formation for 6 characters in celebration */
export const CELEBRATION_POSITIONS_6: [number, number, number][] = [
  [-2.5, 0, 0.5],
  [-1.5, 0, 1.5],
  [-0.5, 0, 2.0],
  [0.5, 0, 2.0],
  [1.5, 0, 1.5],
  [2.5, 0, 0.5],
];

/** Confetti particle colors (Ubuntu / SA flag inspired) */
export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];
export const CONFETTI_COUNT = 50;
