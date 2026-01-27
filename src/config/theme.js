/**
 * Theme Configuration — South African + Ubuntu visual identity
 * Warm, inviting, culturally grounded
 */

export const COLORS = {
  // Primary palette (inspired by SA flag + earth tones)
  primary: '#2D9B4E',       // Ubuntu green
  secondary: '#E8A317',     // Gold/amber
  accent: '#D94B2B',        // Warm red
  
  // Backgrounds
  bgWarm: '#FFF8E7',        // Warm cream (main bg)
  bgLight: '#FFFDF5',       // Lighter cream
  bgDark: '#2C1810',        // Rich dark brown
  
  // UI
  textDark: '#2C1810',
  textLight: '#FFFDF5',
  textMuted: '#8B7355',
  
  // Feedback
  success: '#2D9B4E',
  warning: '#E8A317',
  error: '#D94B2B',
  star: '#FFD700',
  
  // SA flag colors (for celebrations/rewards)
  saGreen: '#007A4D',
  saYellow: '#FFB612',
  saRed: '#DE3831',
  saBlue: '#002395',
  saBlack: '#000000',
  saWhite: '#FFFFFF',
};

export const FONTS = {
  // Will use web-safe initially, custom fonts loaded in Boot scene
  heading: 'Nunito',        // Rounded, friendly, great for kids
  body: 'Nunito',
  letter: 'Nunito',         // For letter display — clear, rounded
  fallback: 'Arial, sans-serif',
};

export const SIZES = {
  // Relative to 720x1280 canvas
  letterLarge: 200,          // Main letter display
  letterSmall: 80,           // Letter in lists/options
  animalSprite: 256,         // Animal illustration size
  buttonWidth: 300,
  buttonHeight: 80,
  buttonRadius: 20,
  starSize: 64,              // 64px min for Grade R kids (was 48)
  minTouchTarget: 64,        // Google recommends 48, Grade R needs 64+
  padding: 24,
  paddingSmall: 12,
};

export const ANIMATIONS = {
  fadeIn: 300,
  fadeOut: 200,
  bounce: 400,
  celebration: 1500,
  letterTrace: 800,
  sceneTransition: 500,
};
