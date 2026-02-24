/** Money Skills L1 — Game Constants */

import type { CoinData, CoinId, PracticeRoundData } from '../types/money-skills';
import type { MoneyCharacterId } from '@/types/game';

// ---- Money Skills Characters ----
export const CHARACTERS: Record<
  MoneyCharacterId,
  { name: string; role: string; trait: string; image: string; cardBg: string; accent: string }
> = {
  chanel: { name: 'Chanel', role: 'Storyteller', trait: 'Loves to share', image: '/characters/chanel-front.png', cardBg: '#FDE8D8', accent: '#E67E22' },
  priya:  { name: 'Priya',  role: 'Thinker',     trait: 'Loves to explore', image: '/characters/priya-front.png', cardBg: '#D8F0E8', accent: '#27AE60' },
  naledi: { name: 'Naledi', role: 'Leader',       trait: 'Loves to lead together', image: '/characters/naledi-front.png', cardBg: '#D8E8FF', accent: '#4A90D9' },
};

// ---- 7 SA Coins ----
export const SA_COINS: CoinData[] = [
  { id: 'coin-5c', name: '5 cents', value: 5, color: '#B87333', size: 0.7, description: 'small copper coin', clue: 'Find the smallest copper coin' },
  { id: 'coin-10c', name: '10 cents', value: 10, color: '#B87333', size: 0.75, description: 'medium copper coin', clue: 'Find the copper coin a little bigger than 5 cents' },
  { id: 'coin-20c', name: '20 cents', value: 20, color: '#B87333', size: 0.8, description: 'large copper coin', clue: 'Find the biggest copper coin' },
  { id: 'coin-50c', name: '50 cents', value: 50, color: '#C0C0C0', size: 0.85, description: 'silver coin', clue: 'Find the silver coin' },
  { id: 'coin-r1', name: '1 Rand', value: 100, color: '#DAA520', size: 0.9, description: 'gold coin', clue: 'Find the coin we call one Rand' },
  { id: 'coin-r2', name: '2 Rand', value: 200, color: '#DAA520', size: 0.95, description: 'bigger gold coin', clue: 'Find the coin worth two Rand' },
  { id: 'coin-r5', name: '5 Rand', value: 500, color: '#DAA520', size: 1.0, description: 'the biggest coin', clue: 'Find the biggest coin of all' },
];

export const COIN_MAP: Record<CoinId, CoinData> = Object.fromEntries(
  SA_COINS.map((c) => [c.id, c])
) as Record<CoinId, CoinData>;

// ---- Coin Scatter Positions on the mat (world space x, z) ----
export const COIN_SCATTER_POSITIONS: [number, number, number][] = [
  [-1.2, 0.05, -0.4],
  [-0.4, 0.05, 0.6],
  [0.5, 0.05, -0.6],
  [1.1, 0.05, 0.2],
  [-0.8, 0.05, 0.9],
  [0.2, 0.05, -0.1],
  [0.9, 0.05, 0.9],
];

// ---- Coin Celebration Line Positions (sorted by value, left to right) ----
export const COIN_LINE_POSITIONS: [number, number, number][] = [
  [-2.1, 0.05, 0],
  [-1.4, 0.05, 0],
  [-0.7, 0.05, 0],
  [0.0, 0.05, 0],
  [0.7, 0.05, 0],
  [1.4, 0.05, 0],
  [2.1, 0.05, 0],
];

// ---- Character Positions ----
export const GOGO_POSITION: [number, number, number] = [2.8, 0, -0.5];
export const SIPHO_POSITION: [number, number, number] = [-2.8, 0, 0.5];

// ---- Character Colors ----
export const GOGO_COLORS = {
  body: '#8B4513',
  accent: '#FFB612',
  skin: '#6D4C41',
};

export const SIPHO_COLORS = {
  body: '#E65100',
  accent: '#FF6D00',
  skin: '#8D6E63',
};

// ---- Practice Rounds (5 rounds) ----
export const PRACTICE_ROUNDS: PracticeRoundData[] = [
  { clue: 'Find the biggest coin of all', correctCoinId: 'coin-r5', options: ['coin-5c', 'coin-r1', 'coin-r5', 'coin-50c', 'coin-20c'] },
  { clue: 'Find the silver coin', correctCoinId: 'coin-50c', options: ['coin-10c', 'coin-50c', 'coin-r2', 'coin-5c', 'coin-20c'] },
  { clue: 'Find the smallest copper coin', correctCoinId: 'coin-5c', options: ['coin-5c', 'coin-10c', 'coin-20c', 'coin-r1', 'coin-50c'] },
  { clue: 'Find the coin we call one Rand', correctCoinId: 'coin-r1', options: ['coin-r2', 'coin-r1', 'coin-50c', 'coin-r5', 'coin-10c'] },
  { clue: 'Find the coin worth two Rand', correctCoinId: 'coin-r2', options: ['coin-r1', 'coin-r5', 'coin-r2', 'coin-20c', 'coin-50c'] },
];

// ---- Colors ----
export const COLORS = {
  matBase: '#8B6914',
  matPattern: '#A0782C',
  matBorder: '#6B4E0A',
  ground: '#D2B48C',
  skyTop: '#FFF8E1',
  skyBottom: '#FFE0B2',
  coinEdge: '#333333',
  hintGlow: '#FFD700',
} as const;

// ---- Thresholds ----
/** Unique coins to tap before auto-advancing from EXPLORE to DISCOVER */
export const EXPLORE_THRESHOLD = 5;
/** Coins to inspect before advancing from DISCOVER to PRACTICE */
export const DISCOVER_THRESHOLD = 3;
/** Practice rounds to attempt before can advance to CELEBRATE */
export const PRACTICE_THRESHOLD = 3;

// ---- Animation ----
export const COIN_BOUNCE_DURATION = 400; // ms
export const COIN_FLIP_DURATION = 600; // ms
export const COIN_ZOOM_SCALE = 3.0;

// ---- Audio Frequencies per coin (lower = smaller denomination) ----
export const COIN_FREQUENCIES: Record<CoinId, number> = {
  'coin-5c': 330,
  'coin-10c': 370,
  'coin-20c': 415,
  'coin-50c': 466,
  'coin-r1': 523,
  'coin-r2': 587,
  'coin-r5': 659,
};
