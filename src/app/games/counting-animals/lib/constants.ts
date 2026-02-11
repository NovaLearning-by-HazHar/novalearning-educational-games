/** South African animals for the counting game */
export interface SAAnimal {
  name: string;
  image: string;
  emoji: string;
  color: string;
}

export const SA_ANIMALS: SAAnimal[] = [
  { name: 'Elephant', image: '/assets/animals/elephant.webp', emoji: '🐘', color: '#8B8589' },
  { name: 'Lion', image: '/assets/animals/lion.webp', emoji: '🦁', color: '#C4873A' },
  { name: 'Zebra', image: '/assets/animals/zebra.webp', emoji: '🦓', color: '#2D2D2D' },
  { name: 'Giraffe', image: '/assets/animals/giraffe.webp', emoji: '🦒', color: '#D4A543' },
  { name: 'Hippo', image: '/assets/animals/hippo.webp', emoji: '🦛', color: '#7B6B8D' },
  { name: 'Rhino', image: '/assets/animals/rhino.webp', emoji: '🦏', color: '#7A7A7A' },
  { name: 'Flamingo', image: '/assets/animals/flamingo.webp', emoji: '🦩', color: '#FF69B4' },
  { name: 'Parrot', image: '/assets/animals/parrot.webp', emoji: '🦜', color: '#2ECC71' },
  { name: 'Turtle', image: '/assets/animals/turtle.webp', emoji: '🐢', color: '#4A7A4A' },
  { name: 'Butterfly', image: '/assets/animals/butterfly.webp', emoji: '🦋', color: '#9B59B6' },
];

/** Encouragement messages (Ubuntu: positive reinforcement only) */
export const ENCOURAGEMENT = [
  'Great job!',
  "You're amazing!",
  'Wonderful counting!',
  'You did it!',
  'Super counting!',
  "Let's celebrate!",
  'Well done, friend!',
];

/** Gentle retry message (Ubuntu: no punitive feedback) */
export const TRY_AGAIN_MESSAGE = "Let's count together! Try again";

/** Number words for display */
export const NUMBER_WORDS = [
  '', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Ten',
];

/** Total rounds per game session */
export const TOTAL_ROUNDS = 5;

/** Difficulty ranges: how many animals to count */
export const DIFFICULTY_RANGES: [number, number][] = [
  [1, 3],  // Gentle start
  [1, 5],  // Growing
  [1, 10], // Confident
];

/** Difficulty labels (non-competitive framing) */
export const DIFFICULTY_LABELS = [
  'Getting Started',
  'Growing',
  'Confident',
];

/** CSS keyframe animations shared across components */
export const SHARED_KEYFRAMES = `
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes gentleShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
`;
