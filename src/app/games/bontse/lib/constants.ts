/** Bontse — Discover Mode Constants */

// Sipho guide character
export const SIPHO_POSITION: [number, number, number] = [2.5, 0, 1.5];

// Camera
export const CAMERA_POSITION: [number, number, number] = [0, 2, 5];
export const CAMERA_FOV = 50;

// Colors
export const COLORS = {
  skyTop: '#87CEEB',
  skyBottom: '#FFB74D',
  ground: '#7CB342',
  groundDark: '#558B2F',
  bush1: '#388E3C',
  bush2: '#2E7D32',
  flower1: '#FF7043',
  flower2: '#FFD54F',
  flower3: '#AB47BC',
} as const;

// Category panel colors
export const CATEGORY_COLORS: Record<string, string> = {
  animals: '#FF6B35',
  cultures: '#6A1B9A',
  monuments: '#1565C0',
  provinces: '#2E7D32',
};

// Animation
export const SPIN_SPEED = 0.5;
export const BOB_AMPLITUDE = 0.08;
export const BOB_SPEED = 2;

// Discovery target (how many to trigger celebration)
export const DISCOVERY_TARGET = 6;

// Celebration
export const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];

export const CONFETTI_COUNT = 30;
