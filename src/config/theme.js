/**
 * NovaLearning Theme — Premium Kids Educational Game Aesthetic
 * Safari Adventure theme — warm oranges, greens, sky blues, golden rewards
 * Inspired by Orboot AR / PlayShifu quality
 */

export const NOVA = {
  // Primary - Warm Sunset Orange (Main brand)
  primary: {
    50:  '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',  // Main buttons
    500: '#F97316',  // Pressed
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  // Secondary - Safari Green (Success, Nature)
  secondary: {
    300: '#86EFAC',
    400: '#4ADE80',  // Stars, success
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
  },
  // Accent - Sky Blue (Interactive elements)
  accent: {
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',  // Letter cards, hints
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },
  // Reward - Golden Yellow
  reward: {
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
  },
  // Gentle - Soft Coral (errors)
  gentle: {
    400: '#FB7185',
    500: '#F43F5E',
  },
};

export const COLORS = {
  // Main semantic colors
  primary:    NOVA.primary[400],
  primaryDark: NOVA.primary[600],
  secondary:  NOVA.secondary[500],
  accent:     NOVA.accent[400],
  star:       NOVA.reward[400],
  success:    NOVA.secondary[400],
  warning:    NOVA.primary[500],
  error:      NOVA.gentle[400],

  // Backgrounds
  bgCream:    '#FEF7EC',
  bgSand:     '#F5EBE0',
  bgSky:      '#E0F4FF',
  bgGrass:    '#E8F5E0',
  bgSunset:   '#FFF1E6',
  bgWarm:     '#FEF7EC',

  // Text
  textDark:   '#2D1B0E',
  textMedium: '#5C4033',
  textLight:  '#8B7355',
  textWhite:  '#FFFFFF',
  textMuted:  '#8B7355',

  // SA flag colors (celebrations)
  saGreen:  '#007A4D',
  saYellow: '#FFB612',
  saRed:    '#DE3831',
  saBlue:   '#002395',
  saBlack:  '#000000',
  saWhite:  '#FFFFFF',
};

export const FONTS = {
  display: 'Fredoka One, Nunito, Arial, sans-serif',  // Bold, playful titles
  heading: 'Nunito, Arial, sans-serif',                // Rounded, warm
  body: 'Quicksand, Nunito, Arial, sans-serif',        // Clean, child-friendly
  letter: 'Fredoka One, Nunito, Arial, sans-serif',    // Letters for learning
  fallback: 'Arial, sans-serif',
};

export const TYPE_SCALE = {
  hero:     { size: 48, weight: 800, lineHeight: 1.1 },
  title:    { size: 36, weight: 700, lineHeight: 1.2 },
  subtitle: { size: 28, weight: 600, lineHeight: 1.3 },
  button:   { size: 24, weight: 700, lineHeight: 1.0 },
  label:    { size: 20, weight: 600, lineHeight: 1.2 },
  body:     { size: 18, weight: 500, lineHeight: 1.4 },
  caption:  { size: 14, weight: 500, lineHeight: 1.3 },
  letter:   { size: 96, weight: 800, lineHeight: 1.0 },
  score:    { size: 32, weight: 700, lineHeight: 1.0 },
};

export const SIZES = {
  letterLarge: 200,
  letterSmall: 80,
  animalSprite: 256,
  buttonWidth: 240,
  buttonHeight: 72,
  buttonRadius: 24,
  starSize: 48,
  minTouchTarget: 64,
  padding: 24,
  paddingSmall: 12,
  cardRadius: 20,
};

export const ANIMATIONS = {
  fadeIn: 300,
  fadeOut: 200,
  bounce: 400,
  celebration: 1500,
  letterTrace: 800,
  sceneTransition: 500,
  popIn: 400,
  slideUp: 500,
};

// Background themes
export const BACKGROUNDS = {
  safari: {
    topColor: '#FFF7ED',
    bottomColor: '#FED7AA',
    blobs: [
      { xPct: 10, yPct: 20, size: 200, color: 0xFDBA74, alpha: 0.3 },
      { xPct: 85, yPct: 60, size: 150, color: 0xFB923C, alpha: 0.2 },
    ],
  },
  sky: {
    topColor: '#E0F2FE',
    bottomColor: '#BAE6FD',
    blobs: [
      { xPct: 20, yPct: 30, size: 180, color: 0xFFFFFF, alpha: 0.4 },
      { xPct: 70, yPct: 15, size: 120, color: 0xFFFFFF, alpha: 0.3 },
    ],
  },
  jungle: {
    topColor: '#F0FDF4',
    bottomColor: '#DCFCE7',
    blobs: [
      { xPct: 15, yPct: 80, size: 200, color: 0x86EFAC, alpha: 0.3 },
      { xPct: 90, yPct: 70, size: 160, color: 0x4ADE80, alpha: 0.2 },
    ],
  },
  celebration: {
    topColor: '#FFF1E6',
    bottomColor: '#FFEDD5',
    blobs: [
      { xPct: 10, yPct: 10, size: 100, color: 0xFACC15, alpha: 0.4 },
      { xPct: 90, yPct: 20, size: 80, color: 0x4ADE80, alpha: 0.3 },
      { xPct: 50, yPct: 90, size: 120, color: 0x38BDF8, alpha: 0.2 },
    ],
  },
};

// Button style presets
export const BUTTON_STYLES = {
  primary: {
    width: 240, height: 72, radius: 24,
    gradientTop: 0xFB923C, gradientBottom: 0xEA580C,
    shadowColor: 0x7C2D12,
    textColor: '#FFFFFF', textStroke: '#9A3412',
    fontSize: 28,
  },
  secondary: {
    width: 200, height: 64, radius: 20,
    gradientTop: 0x38BDF8, gradientBottom: 0x0284C7,
    shadowColor: 0x075985,
    textColor: '#FFFFFF', textStroke: '#0369A1',
    fontSize: 24,
  },
  success: {
    width: 240, height: 72, radius: 24,
    gradientTop: 0x4ADE80, gradientBottom: 0x16A34A,
    shadowColor: 0x166534,
    textColor: '#FFFFFF', textStroke: '#15803D',
    fontSize: 28,
  },
  small: {
    width: 140, height: 56, radius: 16,
    gradientTop: 0xFB923C, gradientBottom: 0xEA580C,
    shadowColor: 0x7C2D12,
    textColor: '#FFFFFF', textStroke: '#9A3412',
    fontSize: 22,
  },
};
