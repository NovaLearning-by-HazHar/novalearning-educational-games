/** Mzansi Journey — Tour Mode Constants */

// ─── Liya Guide ─────────────────────────────────────────────────────
export const LIYA_COLORS = {
  body: '#6A1B9A',
  accent: '#AB47BC',
  skin: '#A1887F',
} as const;

export const LIYA_POSITION: [number, number, number] = [2.5, 0, 1.5];

// ─── Camera ─────────────────────────────────────────────────────────
export const CAMERA_POSITION: [number, number, number] = [0, 2, 5];
export const CAMERA_FOV = 50;

// ─── Background ─────────────────────────────────────────────────────
export const BG_COLOR = '#FFF8F0';
export const TEXT_COLOR = '#1A1A2E';

// ─── Province map colors ────────────────────────────────────────────
export const PROVINCE_COLORS: Record<string, string> = {
  'western-cape': '#42A5F5',
  'eastern-cape': '#66BB6A',
  'northern-cape': '#FF7043',
  'kwazulu-natal': '#AB47BC',
  'free-state': '#FFD54F',
  'gauteng': '#FF5722',
  'mpumalanga': '#4CAF50',
  'limpopo': '#8D6E63',
  'north-west': '#FFCA28',
};

// ─── Discovery / Celebration ────────────────────────────────────────
/** Number of province visits to trigger celebration */
export const VISIT_TARGET = 9;

export const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];

export const CONFETTI_COUNT = 30;

// ─── Animation ──────────────────────────────────────────────────────
export const SPIN_SPEED = 0.5;
export const BOB_AMPLITUDE = 0.08;
export const BOB_SPEED = 2;

// ─── Province highlight (hover/visited opacity) ─────────────────────
export const PROVINCE_DEFAULT_OPACITY = 0.6;
export const PROVINCE_VISITED_OPACITY = 0.9;
export const PROVINCE_ACTIVE_OPACITY = 1.0;
