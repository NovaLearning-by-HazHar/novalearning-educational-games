import type { Character } from './data/characters';
import type { AudioLine } from './data/audio-manifest';

// Re-export for convenience
export type { Character, AudioLine };

export const FPS = 30;

export type SignatureMomentType =
  | 'sipho'
  | 'aisha'
  | 'jaedon'
  | 'emma'
  | 'priya'
  | 'danie'
  | 'naledi'
  | 'kagiso';

export const CHARACTER_COLORS: Record<
  string,
  { bg: string; accent: string; text: string }
> = {
  'miss-vdm': { bg: '#FFF8E1', accent: '#8B5CF6', text: '#4A148C' },
  sipho: { bg: '#FFF3E0', accent: '#FF9800', text: '#E65100' },
  aisha: { bg: '#E8F5E9', accent: '#4CAF50', text: '#1B5E20' },
  jaedon: { bg: '#E3F2FD', accent: '#2196F3', text: '#0D47A1' },
  emma: { bg: '#FFF8E1', accent: '#FFC107', text: '#F57F17' },
  priya: { bg: '#FCE4EC', accent: '#E91E63', text: '#880E4F' },
  danie: { bg: '#EFEBE9', accent: '#795548', text: '#3E2723' },
  naledi: { bg: '#E8EAF6', accent: '#3F51B5', text: '#1A237E' },
  kagiso: { bg: '#F3E5F5', accent: '#9C27B0', text: '#4A148C' },
};

// Timing constants for CharacterIntro segments (in frames at 30fps)
export const INTRO_BEATS = {
  ENTRANCE_END: 45,
  BUBBLE_START: 45,
  BUBBLE_POP: 75,
  SIGNATURE_START: 120,
  SIGNATURE_PEAK: 180,
  BUBBLE_HIDE: 240,
  CELEBRATION_START: 255,
  EXIT_START: 285,
  TOTAL: 300,
};
