/**
 * Money Mastery Game Constants
 * All configuration values, shop items, colors, and positions
 */

interface CharacterColors {
  body: string;
  accent: string;
  skin: string;
}

// ============================================================================
// SHOP ITEMS (Option C: Seeds + Spaza Stock / Car + Fizzy Drink)
// ============================================================================

export interface ShopItem {
  id: string;
  name: string;
  type: 'asset' | 'consumption';
  price: number;
  incomePerCycle?: number; // Only for assets
  imageUrl: string;
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // GREEN Assets (Generate Ongoing Income)
  {
    id: 'veg-seeds',
    name: 'Vegetable Seeds',
    type: 'asset',
    price: 5,
    incomePerCycle: 1,
    imageUrl: '/games/money-mastery/items/seeds.png',
    description: 'Grows food and coins!',
  },
  {
    id: 'spaza-stock',
    name: 'Spaza Shop Stock',
    type: 'asset',
    price: 10,
    incomePerCycle: 2,
    imageUrl: '/games/money-mastery/items/spaza.png',
    description: 'Start your own shop!',
  },
  // RED Consumption (Temporary Joy, No Lasting Value)
  {
    id: 'toy-car',
    name: 'Wire Toy Car',
    type: 'consumption',
    price: 5,
    imageUrl: '/games/money-mastery/items/car.png',
    description: 'Zoom zoom!',
  },
  {
    id: 'fizzy-drink',
    name: 'Fizzy Drink',
    type: 'consumption',
    price: 5,
    imageUrl: '/games/money-mastery/items/drink.png',
    description: 'Refreshing!',
  },
];

// ============================================================================
// COLORS
// ============================================================================

export const SHOP_COLORS = {
  // Border colors for asset vs consumption
  assetBorder: '#2E7D32', // GREEN (Jabu's green)
  consumptionBorder: '#C62828', // RED

  // Shop scene colors
  counterWood: '#8D6E63', // Brown wood counter
  shelfWood: '#A1887F', // Lighter wood shelves
  ground: '#D7CCC8', // Light brown ground

  // Coin garden colors
  potBrown: '#795548',
  potRim: '#6D4C41',
  plantGreen: '#4CAF50',
  plantDark: '#2E7D32',
  coinGold: '#FFD700',
  coinShine: '#FFF9C4',

  // UI colors
  balanceBg: '#FFF9C4', // Light yellow
  balanceBorder: '#FFD700', // Gold
  coinIcon: '#FFD700',
};

// ============================================================================
// POSITIONS (3D Scene Layout)
// ============================================================================

// Jabu's position (right side of counter)
export const JABU_POSITION: [number, number, number] = [2.5, 0, 1];

// Shop counter position and dimensions
export const SHOP_COUNTER = {
  position: [0, 0.4, 0] as [number, number, number],
  dimensions: [4, 0.8, 1.5] as [number, number, number],
};

// Back shelf position
export const BACK_SHELF = {
  position: [0, 1.2, -0.8] as [number, number, number],
  dimensions: [4, 1.5, 0.2] as [number, number, number],
};

// Ground plane
export const GROUND_PLANE = {
  position: [0, 0, 0] as [number, number, number],
  dimensions: [12, 0.1, 8] as [number, number, number],
};

// Coin Garden positions (3 pots)
export const COIN_GARDEN_POSITIONS = {
  pot1: [-1.2, 0.5, 2.5] as [number, number, number],
  pot2: [0, 0.5, 2.5] as [number, number, number],
  pot3: [1.2, 0.5, 2.5] as [number, number, number],
};

// Shop item card positions (HTML overlay, grid layout)
export const SHOP_ITEM_POSITIONS = {
  'veg-seeds': { top: '60%', left: '15%' },
  'spaza-stock': { top: '60%', left: '35%' },
  'toy-car': { top: '60%', left: '55%' },
  'fizzy-drink': { top: '60%', left: '75%' },
};

// Owned assets display positions (on back shelf)
export const ASSET_DISPLAY_POSITIONS: Record<string, [number, number, number]> = {
  'veg-seeds': [-1.5, 1.2, -0.7],
  'spaza-stock': [1.5, 1.2, -0.7],
};

// ============================================================================
// CHARACTER COLORS
// ============================================================================

export const MVP_CHARACTER_COLORS: Record<string, CharacterColors> = {
  jabu: {
    body: '#2E7D32', // Green
    accent: '#66BB6A', // Lighter green
    skin: '#5D4037', // Brown (Bible v1.0)
  },
  sipho: {
    body: '#E65100', // Orange
    accent: '#FF6D00',
    skin: '#8D6E63',
  },
  gogo_thandi: {
    body: '#1565C0', // Blue
    accent: '#42A5F5',
    skin: '#6D4C41',
  },
};

// ============================================================================
// GAME SETTINGS
// ============================================================================

export const GAME_SETTINGS = {
  // Phase settings
  targetInteractions: 4, // Number of purchases before celebrate
  baseEarning: 5, // R5 base from coin garden

  // Timing
  exploreHintDelay: 3000, // 3s before showing hint in explore phase
  discoverPhaseDuration: 300, // 300ms discover phase
  celebrationIntroDelay: 1000, // 1s before characters appear

  // Animation durations
  plantGrowDuration: 500, // 500ms for plant scale animation
  coinSpawnDelay: 500, // 500ms after watering before coin spawns
  coinPopDuration: 600, // 600ms for coin pop animation
  purchaseAnimationDuration: 800, // 800ms for purchase feedback

  // Audio
  assetBonusAudioDelay: 200, // 200ms between each asset bonus "cha-ching"
};

// ============================================================================
// TEXT CONTENT
// ============================================================================

export const TEXT_CONTENT = {
  explore: {
    greeting: '👋 Welcome to my shop!',
    prompt: "Let's grow some coins!",
  },
  discover: {
    prompt: 'Now you can buy something!',
  },
  practice: {
    assetPurchase: 'Great choice!',
    consumptionPurchase: 'That was fun!',
    bonusGarden: "Let's earn together!",
    insufficientFunds: 'Need more coins? Play the garden!',
  },
  celebrate: {
    title: 'We learned about money together!',
    totalEarned: 'Total Earned:',
    assetsOwned: 'Assets Owned:',
    consumptionPurchases: 'Fun Purchases:',
    playAgain: 'Play Again',
  },
};

// ============================================================================
// AUDIO IDS
// ============================================================================

export const AUDIO_IDS = {
  // Garden mini-game
  waterSplash: 'water-splash',
  coinPop: 'coin-pop',
  gardenComplete: 'garden-complete',

  // Shopping
  purchaseChime: 'purchase-chime',
  chaChing: 'cha-ching',

  // Voice (using existing audioManager encouragement system)
  voiceGreatChoice: 'voice-great-choice',
  voiceThatWasFun: 'voice-that-was-fun',
  voiceLetEarnTogether: 'voice-lets-earn-together',

  // Ambient (reuse existing)
  ambientWind: 'ambient-wind',
  celebrateMelody: 'celebrate-melody',
};
