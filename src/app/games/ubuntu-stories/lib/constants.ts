/** Ubuntu Stories — Constants */

// ─── Camera (minimal 3D) ────────────────────────────────────────────
export const CAMERA_POSITION: [number, number, number] = [0, 1.5, 4];
export const CAMERA_FOV = 45;

// ─── Gogo Thandi (Wisdom Keeper / Guide) ────────────────────────────
export const GOGO_THANDI_COLORS = {
  body: '#1565C0',
  accent: '#42A5F5',
  skin: '#6D4C41',
} as const;

// ─── Scene Colors ───────────────────────────────────────────────────
export const COLORS = {
  background: '#FFF8E1',
  panelBg: '#FFFFFF',
  panelBorder: '#E0E0E0',
  textPrimary: '#3E2723',
  textSecondary: '#5D4037',
  accentBlue: '#1565C0',
  accentGreen: '#2E7D32',
  accentOrange: '#E65100',
  correctGreen: '#4CAF50',
  celebrationGold: '#FFD54F',
} as const;

// ─── Timing ─────────────────────────────────────────────────────────
export const TEXT_ADVANCE_DELAY = 300; // ms debounce for tap-to-advance
export const CELEBRATION_DELAY = 500; // ms before celebration audio
export const TASK_FEEDBACK_DURATION = 1200; // ms to show correct/try again

// ─── Celebration ────────────────────────────────────────────────────
export const CELEBRATION_POSITIONS: [number, number, number][] = [
  [-1.5, 0, 0.5],
  [0, 0, 1],
  [1.5, 0, 0.5],
];

export const CONFETTI_COLORS = [
  '#FF5722', '#FFD54F', '#4CAF50', '#42A5F5', '#AB47BC', '#FF7043',
];

export const CONFETTI_COUNT = 30;

// ─── Touch Targets ──────────────────────────────────────────────────
export const MIN_TOUCH_TARGET = 48;
export const RECOMMENDED_TOUCH_TARGET = 64;

// ─── Story completion target (total clues across both stories) ──────
export const CLUE_TARGET = 3; // clues per story chapter to complete
