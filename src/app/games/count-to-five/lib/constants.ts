/** Phase 2: Count to Five — Game Constants */

// ─── Mango Tree Positions ───────────────────────────────────────────
/** 5 mango positions on the tree branches (world space) */
export const MANGO_TREE_POSITIONS: [number, number, number][] = [
  [-1.0, 2.6, 0.4],
  [0.7, 2.9, -0.2],
  [-0.4, 3.3, 0.3],
  [1.2, 2.4, 0.1],
  [0.1, 2.1, -0.4],
];

/** Basket position (in front of tree) */
export const BASKET_POSITION: [number, number, number] = [0, 0.2, 2.5];

/** Offsets for mangoes once collected inside the basket */
export const BASKET_MANGO_OFFSETS: [number, number, number][] = [
  [-0.2, 0.25, 0.0],
  [0.2, 0.25, 0.0],
  [0.0, 0.25, 0.15],
  [-0.1, 0.35, -0.1],
  [0.1, 0.35, 0.1],
];

/** Sipho guide position (right of tree) */
export const SIPHO_POSITION: [number, number, number] = [3, 0, 1];

// ─── Animation Timing ───────────────────────────────────────────────
/** Duration of mango pick arc animation (seconds) */
export const MANGO_PICK_DURATION = 800; // ms for anime.js
/** Idle sway speed multiplier */
export const SWAY_SPEED = 1.5;
/** Idle bob amplitude */
export const BOB_AMPLITUDE = 0.04;

// ─── Colors ─────────────────────────────────────────────────────────
export const COLORS = {
  mango: '#FFB300',
  mangoStem: '#4CAF50',
  treeTrunk: '#6D4C41',
  treeCanopy: '#388E3C',
  ground: '#7CB342',
  skyTop: '#87CEEB',
  skyBottom: '#FFB74D',
  basket: '#A1887F',
  basketRim: '#8D6E63',
  flower1: '#FF7043',
  flower2: '#FFD54F',
  flower3: '#AB47BC',
  flower4: '#42A5F5',
  bush1: '#558B2F',
  bush2: '#33691E',
  bush3: '#689F38',
} as const;

// ─── MVP Character Colors (3 only) ─────────────────────────────────
export interface CharacterColors {
  body: string;
  accent: string;
  skin: string;
}

export const MVP_CHARACTER_COLORS: Record<string, CharacterColors> = {
  sipho: { body: '#E65100', accent: '#FF6D00', skin: '#8D6E63' },
  thandi: { body: '#1565C0', accent: '#42A5F5', skin: '#A1887F' },
  lerato: { body: '#2E7D32', accent: '#66BB6A', skin: '#8D6E63' },
};

/** Single source of truth for which characters appear in MVP */
export const MVP_CHARACTERS = ['sipho', 'thandi', 'lerato'] as const;

/** Celebration character positions (3-character arc) */
export const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

/** Confetti particle colors */
export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];

/** Number of confetti particles */
export const CONFETTI_COUNT = 30;
