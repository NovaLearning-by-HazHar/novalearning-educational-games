/** Thina Trivia — Quiz Mode Constants */

// Amahle guide character colors
export const AMAHLE_COLORS = {
  body: '#D84315',
  accent: '#FF8A65',
  skin: '#795548',
} as const;

// Background gradient
export const BG_FROM = '#FFF8F0';
export const BG_TO = '#FFE0B2';

// Star meter
export const STAR_TARGET = 10;

// Discussion timer (seconds)
export const DISCUSSION_SECONDS = 30;

// Touch target minimum
export const MIN_TOUCH_TARGET = 64; // px

// Categories
export const CATEGORY_IDS = ['animals', 'cultures', 'counting', 'colours', 'letters', 'community'] as const;
export type TriviaCategory = (typeof CATEGORY_IDS)[number];

export const CATEGORY_META: Record<TriviaCategory, { label: Record<string, string>; emoji: string; color: string }> = {
  animals: {
    label: { en: 'Animals', af: 'Diere', zu: 'Izilwane', xh: 'Izilwanyana', st: 'Diphoofolo' },
    emoji: '🦁',
    color: '#FF6B35',
  },
  cultures: {
    label: { en: 'Cultures', af: 'Kulture', zu: 'Amasiko', xh: 'Iinkcubeko', st: 'Meetlo' },
    emoji: '🎭',
    color: '#6A1B9A',
  },
  counting: {
    label: { en: 'Counting', af: 'Tel', zu: 'Ukubala', xh: 'Ukubala', st: 'Ho bala' },
    emoji: '🔢',
    color: '#1565C0',
  },
  colours: {
    label: { en: 'Colours', af: 'Kleure', zu: 'Imibala', xh: 'Imibala', st: 'Mebala' },
    emoji: '🌈',
    color: '#E91E63',
  },
  letters: {
    label: { en: 'Letters', af: 'Letters', zu: 'Izinhlamvu', xh: 'Iileta', st: 'Ditlhaku' },
    emoji: '🔤',
    color: '#2E7D32',
  },
  community: {
    label: { en: 'Community', af: 'Gemeenskap', zu: 'Umphakathi', xh: 'Uluntu', st: 'Setjhaba' },
    emoji: '🤝',
    color: '#F57C00',
  },
};

// CAPS alignment terms
export const CAPS_TERMS = [
  'Assessment for Learning',
  'Life Skills',
  'Home Language',
  'Mathematics',
] as const;

// Celebration messages (multilingual)
export const CELEBRATION_MESSAGES: Record<string, string> = {
  en: 'Siyabonga! You helped the class!',
  af: 'Siyabonga! Jy het die klas gehelp!',
  zu: 'Siyabonga! Usize ikilasi!',
  xh: 'Siyabonga! Uncede iklasi!',
  st: 'Siyabonga! O thusitse sehlopha!',
};

// Encouragement on wrong answer (gentle, no error state)
export const TRY_AGAIN_MESSAGES: Record<string, string> = {
  en: 'Try again! You can do it!',
  af: 'Probeer weer! Jy kan dit doen!',
  zu: 'Zama futhi! Ungakwenza!',
  xh: 'Zama kwakhona! Unako!',
  st: 'Leka hape! O ka e etsa!',
};

// Languages
export const LANGS = ['en', 'af', 'zu', 'xh', 'st'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'af', label: 'AF' },
  { code: 'zu', label: 'ZU' },
  { code: 'xh', label: 'XH' },
  { code: 'st', label: 'ST' },
];
