/** Ubuntu Garden — Build Mode Constants */

// ─── Grid ─────────────────────────────────────────────────────────
/** 4x4 grid, each cell is 1 unit */
export const GRID_SIZE = 4;
export const CELL_SIZE = 1;

/** Grid positions: [col, row] mapped to [x, z] world coords. Origin at grid centre. */
export function gridToWorld(col: number, row: number): [number, number, number] {
  const offset = (GRID_SIZE - 1) / 2; // centre the grid
  return [(col - offset) * CELL_SIZE, 0, (row - offset) * CELL_SIZE];
}

/** Total grid slots */
export const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE;

// ─── Camera ───────────────────────────────────────────────────────
export const CAMERA_POSITION: [number, number, number] = [0, 5, 5];
export const CAMERA_FOV = 50;

// ─── Jabu guide ───────────────────────────────────────────────────
export const JABU_POSITION: [number, number, number] = [3.5, 0, 2.5];
export const JABU_COLORS = {
  body: '#2E7D32',
  accent: '#66BB6A',
  skin: '#5D4037',
} as const;

// ─── Scene colours ────────────────────────────────────────────────
export const COLORS = {
  ground: '#7CB342',
  groundDark: '#558B2F',
  gridLine: '#4CAF50',
  skyBg: '#87CEEB',
  treeCanopy: '#388E3C',
  treeTrunk: '#6D4C41',
  flowerPetal: '#FF7043',
  flowerCenter: '#FFD54F',
  flowerStem: '#558B2F',
  animalBody: '#8D6E63',
  animalHead: '#A1887F',
  animalLeg: '#6D4C41',
  structureWall: '#BCAAA4',
  structureRoof: '#D84315',
  fencePost: '#8D6E63',
  benchSeat: '#A1887F',
  benchLeg: '#6D4C41',
  bridgeDeck: '#8D6E63',
  bridgeRail: '#A1887F',
} as const;

// ─── Category colours (for selector borders) ─────────────────────
export const CATEGORY_COLORS: Record<string, string> = {
  animals: '#8D6E63',
  trees: '#388E3C',
  flowers: '#FF7043',
  structures: '#BCAAA4',
};

// ─── Vertex budgets ───────────────────────────────────────────────
export const VERTEX_BUDGET = {
  tree: 100,
  flower: 50,
  animal: 200,
  structure: 24,
  ground: 100,
  totalScene: 8000,
} as const;

// ─── Animation ────────────────────────────────────────────────────
export const BOB_AMPLITUDE = 0.06;
export const BOB_SPEED = 2;

// ─── Discovery target (how many placements to trigger celebration) ─
export const PLACEMENT_TARGET = 8;

// ─── Celebration ──────────────────────────────────────────────────
export const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];

export const CONFETTI_COUNT = 30;
