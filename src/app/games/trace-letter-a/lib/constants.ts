/** Phase 4: Trace Letter A — Game Constants */

// ─── Letter A Path Data ────────────────────────────────────────────
/**
 * Letter "A" defined as 3 strokes (segments).
 * Each stroke is a series of 3D points on z=0 plane.
 * Coordinates are in world space, centered around origin.
 * Stroke 1: Left diagonal (bottom-left to top)
 * Stroke 2: Right diagonal (top to bottom-right)
 * Stroke 3: Horizontal crossbar
 */
export const LETTER_A_STROKES: [number, number, number][][] = [
  // Stroke 1: Left leg (bottom-left → apex)
  [
    [-1.0, -1.5, 0],
    [-0.85, -1.0, 0],
    [-0.7, -0.5, 0],
    [-0.55, 0.0, 0],
    [-0.4, 0.5, 0],
    [-0.25, 1.0, 0],
    [-0.1, 1.3, 0],
    [0.0, 1.5, 0],
  ],
  // Stroke 2: Right leg (apex → bottom-right)
  [
    [0.0, 1.5, 0],
    [0.1, 1.3, 0],
    [0.25, 1.0, 0],
    [0.4, 0.5, 0],
    [0.55, 0.0, 0],
    [0.7, -0.5, 0],
    [0.85, -1.0, 0],
    [1.0, -1.5, 0],
  ],
  // Stroke 3: Crossbar (left → right)
  [
    [-0.55, 0.0, 0],
    [-0.35, 0.0, 0],
    [-0.15, 0.0, 0],
    [0.0, 0.0, 0],
    [0.15, 0.0, 0],
    [0.35, 0.0, 0],
    [0.55, 0.0, 0],
  ],
];

/** Total number of strokes in the letter */
export const TOTAL_STROKES = LETTER_A_STROKES.length;

/** Tolerance radius for path matching (world units) */
export const TRACE_TOLERANCE = 0.35;

/** Minimum distance between checkpoints to count as progress */
export const MIN_CHECKPOINT_DISTANCE = 0.15;

/** How close to stroke start to begin a new stroke */
export const STROKE_START_TOLERANCE = 0.5;

// ─── Thandi Position ──────────────────────────────────────────────
/** Thandi guide position (right of letter) */
export const THANDI_POSITION: [number, number, number] = [2.8, -0.5, 1];

// ─── Animation Timing ─────────────────────────────────────────────
/** Duration of stroke completion flash (ms) */
export const STROKE_COMPLETE_FLASH_MS = 400;
/** Duration of letter completion celebration delay (ms) */
export const CELEBRATE_DELAY_MS = 800;

// ─── Colors ───────────────────────────────────────────────────────
export const COLORS = {
  /** Letter guide outline (light, inviting) */
  letterGuide: '#B0BEC5',
  /** Active tracing line */
  tracingActive: '#FF6D00',
  /** Completed stroke */
  strokeComplete: '#4CAF50',
  /** Current stroke highlight */
  strokeCurrent: '#42A5F5',
  /** Tracing finger dot */
  traceDot: '#FF6D00',
  /** Ground */
  ground: '#E8F5E9',
  /** Sky gradient */
  skyTop: '#90CAF9',
  skyBottom: '#E3F2FD',
  /** Environment accents */
  bush1: '#558B2F',
  bush2: '#33691E',
  bush3: '#689F38',
  flower1: '#AB47BC',
  flower2: '#FF7043',
  flower3: '#FFD54F',
  flower4: '#42A5F5',
  /** Easel / writing board */
  easelFrame: '#6D4C41',
  easelBoard: '#FFFDE7',
} as const;

// ─── Character Colors (reuse from count-to-five) ─────────────────
export {
  MVP_CHARACTER_COLORS,
  ALL_CHARACTER_COLORS,
  MVP_CHARACTERS,
  ALL_CHARACTERS,
  CELEBRATION_POSITIONS,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from '../../count-to-five/lib/constants';
export type { CharacterColors } from '../../count-to-five/lib/constants';
