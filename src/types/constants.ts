import type { Character } from './game';

export const CHARACTERS: Record<string, Character> = {
  sipho: {
    name: 'sipho',
    displayName: 'Sipho',
    heritage: 'Zulu',
    personality: 'Brave explorer',
    learningStyle: 'kinesthetic',
  },
  thandi: {
    name: 'thandi',
    displayName: 'Thandi',
    heritage: 'Xhosa',
    personality: 'Creative storyteller',
    learningStyle: 'visual',
  },
  lerato: {
    name: 'lerato',
    displayName: 'Lerato',
    heritage: 'Sotho',
    personality: 'Kind helper',
    learningStyle: 'social',
  },
  pieter: {
    name: 'pieter',
    displayName: 'Pieter',
    heritage: 'Afrikaans',
    personality: 'Curious builder',
    learningStyle: 'logical',
  },
  fatima: {
    name: 'fatima',
    displayName: 'Fatima',
    heritage: 'Cape Malay',
    personality: 'Patient teacher',
    learningStyle: 'auditory',
  },
  amahle: {
    name: 'amahle',
    displayName: 'Amahle',
    heritage: 'Ndebele',
    personality: 'Joyful artist',
    learningStyle: 'creative',
  },
};

/** Performance budget constants */
export const BUDGETS = {
  MAX_BUNDLE_KB: 500,
  MAX_ASSET_KB: 50,
  MAX_TEXTURE_SIZE: 512,
  MAX_TRIANGLES: 5000,
  TARGET_FPS: 30,
  MIN_FPS: 24,
  TARGET_LOAD_S: 3,
  MAX_LOAD_S: 5,
  MAX_MEMORY_MB: 200,
} as const;
