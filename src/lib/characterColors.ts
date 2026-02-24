/** Shared character color definitions -- used across all game modules. */

export interface CharacterColors {
  body: string;
  accent: string;
  skin: string;
}

export const MVP_CHARACTER_COLORS: Record<string, CharacterColors> = {
  sipho: { body: '#E65100', accent: '#FF6D00', skin: '#8D6E63' },
  gogo_thandi: { body: '#1565C0', accent: '#42A5F5', skin: '#6D4C41' },
  jabu: { body: '#2E7D32', accent: '#66BB6A', skin: '#5D4037' },
};

/** All 6 Bible v1.0 character colors */
export const ALL_CHARACTER_COLORS: Record<string, CharacterColors> = {
  ...MVP_CHARACTER_COLORS,
  amahle: { body: '#D84315', accent: '#FF8A65', skin: '#795548' },
  liya: { body: '#6A1B9A', accent: '#AB47BC', skin: '#A1887F' },
  themba: { body: '#F57F17', accent: '#FFCA28', skin: '#BCAAA4' },
};

export const MVP_CHARACTERS = ['sipho', 'gogo_thandi', 'jabu'] as const;
export const ALL_CHARACTERS = ['gogo_thandi', 'sipho', 'amahle', 'jabu', 'liya', 'themba'] as const;
