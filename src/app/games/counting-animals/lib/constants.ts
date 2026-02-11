/** South African animals for the counting game */
export interface SAAnimal {
  name: string;
  image: string;
  emoji: string;
  color: string;
}

export const SA_ANIMALS: SAAnimal[] = [
  { name: 'Aardvark', image: '/assets/animals/aardvark.webp', emoji: '🐽', color: '#C4A882' },
  { name: 'Baboon', image: '/assets/animals/baboon.webp', emoji: '🐒', color: '#8B7355' },
  { name: 'Cheetah', image: '/assets/animals/cheetah.webp', emoji: '🐆', color: '#DAA520' },
  { name: 'Dung Beetle', image: '/assets/animals/dung-beetle.webp', emoji: '🪲', color: '#2F4F4F' },
  { name: 'Elephant', image: '/assets/animals/elephant.webp', emoji: '🐘', color: '#8B8589' },
  { name: 'Flamingo', image: '/assets/animals/flamingo.webp', emoji: '🦩', color: '#FF69B4' },
  { name: 'Giraffe', image: '/assets/animals/giraffe.webp', emoji: '🦒', color: '#D4A543' },
  { name: 'Hippo', image: '/assets/animals/hippo.webp', emoji: '🦛', color: '#7B6B8D' },
  { name: 'Impala', image: '/assets/animals/impala.webp', emoji: '🦌', color: '#A0522D' },
  { name: 'Jackal', image: '/assets/animals/jackal.webp', emoji: '🐺', color: '#B8860B' },
  { name: 'Kudu', image: '/assets/animals/kudu.webp', emoji: '🦌', color: '#6B4423' },
  { name: 'Lion', image: '/assets/animals/lion.webp', emoji: '🦁', color: '#C4873A' },
  { name: 'Meerkat', image: '/assets/animals/meerkat.webp', emoji: '🦡', color: '#C2B280' },
  { name: 'Nyala', image: '/assets/animals/nyala.webp', emoji: '🦌', color: '#5C4033' },
  { name: 'Ostrich', image: '/assets/animals/ostrich.webp', emoji: '🐦', color: '#2C2C2C' },
  { name: 'Pangolin', image: '/assets/animals/pangolin.webp', emoji: '🦎', color: '#8B6914' },
  { name: 'Quagga', image: '/assets/animals/quagga.webp', emoji: '🦓', color: '#8B6C5C' },
  { name: 'Rhino', image: '/assets/animals/rhino.webp', emoji: '🦏', color: '#7A7A7A' },
  { name: 'Springbok', image: '/assets/animals/springbok.webp', emoji: '🦌', color: '#C19A6B' },
  { name: 'Tortoise', image: '/assets/animals/tortoise.webp', emoji: '🐢', color: '#4A7A4A' },
  { name: 'Vulture', image: '/assets/animals/vulture.webp', emoji: '🦅', color: '#4A4A4A' },
  { name: 'Warthog', image: '/assets/animals/warthog.webp', emoji: '🐗', color: '#6B4226' },
  { name: 'X-ray Fish', image: '/assets/animals/x-ray-fish.webp', emoji: '🐟', color: '#87CEEB' },
  { name: 'Yellow Mongoose', image: '/assets/animals/yellow-mongoose.webp', emoji: '🦡', color: '#DAA520' },
  { name: 'Zebra', image: '/assets/animals/zebra.webp', emoji: '🦓', color: '#2D2D2D' },
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
