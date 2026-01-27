/**
 * Letter Configuration — A through F
 * Each letter maps to a South African animal and Ubuntu value
 */

export const LETTERS = {
  A: {
    upper: 'A',
    lower: 'a',
    animal: {
      name: 'Aardvark',
      zuluName: 'iSambane',
      fact: 'Aardvarks dig burrows that become homes for many other animals — sharing shelter like Ubuntu teaches us.',
      color: '#C4A87A', // Sandy brown
    },
    ubuntuValue: {
      english: 'Appreciation',
      zulu: 'Ukwazisa',
      description: 'Seeing the good in others and saying thank you.',
    },
    phonics: {
      sound: '/a/ as in aardvark',
      audioFile: 'letter-a.mp3',
      animalAudio: 'aardvark.mp3',
    },
  },
  B: {
    upper: 'B',
    lower: 'b',
    animal: {
      name: 'Buffalo',
      zuluName: 'iNyathi',
      fact: 'Cape buffalo always protect their herd — no buffalo is left behind, just like Ubuntu.',
      color: '#4A3728', // Dark brown
    },
    ubuntuValue: {
      english: 'Bravery',
      zulu: 'Ubuqhawe',
      description: 'Standing up for what is right, even when it is hard.',
    },
    phonics: {
      sound: '/b/ as in buffalo',
      audioFile: 'letter-b.mp3',
      animalAudio: 'buffalo.mp3',
    },
  },
  C: {
    upper: 'C',
    lower: 'c',
    animal: {
      name: 'Chameleon',
      zuluName: 'uNwabu',
      fact: 'Chameleons adapt to their surroundings — they teach us to be flexible and respect different environments.',
      color: '#5BA55B', // Green
    },
    ubuntuValue: {
      english: 'Compassion',
      zulu: 'Isihawu',
      description: 'Feeling kindness in your heart for everyone around you.',
    },
    phonics: {
      sound: '/k/ as in chameleon',
      audioFile: 'letter-c.mp3',
      animalAudio: 'chameleon.mp3',
    },
  },
  D: {
    upper: 'D',
    lower: 'd',
    animal: {
      name: 'Dragonfly',
      zuluName: 'uZiyane',
      fact: 'Dragonflies work together near water — they remind us that we are stronger as a community.',
      color: '#3B82D6', // Blue
    },
    ubuntuValue: {
      english: 'Dignity',
      zulu: 'Isithunzi',
      description: 'Treating every person as important and worthy of respect.',
    },
    phonics: {
      sound: '/d/ as in dragonfly',
      audioFile: 'letter-d.mp3',
      animalAudio: 'dragonfly.mp3',
    },
  },
  E: {
    upper: 'E',
    lower: 'e',
    animal: {
      name: 'Elephant',
      zuluName: 'iNdlovu',
      fact: 'Elephants never forget their family — the whole herd raises every calf together.',
      color: '#8B8B8B', // Grey
    },
    ubuntuValue: {
      english: 'Empathy',
      zulu: 'Uzwela',
      description: 'Understanding how someone else feels and caring about it.',
    },
    phonics: {
      sound: '/e/ as in elephant',
      audioFile: 'letter-e.mp3',
      animalAudio: 'elephant.mp3',
    },
  },
  F: {
    upper: 'F',
    lower: 'f',
    animal: {
      name: 'Flamingo',
      zuluName: 'iNtshe ePhinki',
      fact: 'Flamingos stand together in huge flocks — they show us the beauty of community.',
      color: '#FF7EB3', // Pink
    },
    ubuntuValue: {
      english: 'Friendship',
      zulu: 'Ubungani',
      description: 'Sharing joy and helping each other every day.',
    },
    phonics: {
      sound: '/f/ as in flamingo',
      audioFile: 'letter-f.mp3',
      animalAudio: 'flamingo.mp3',
    },
  },
};

export const LETTER_ORDER = ['A', 'B', 'C', 'D', 'E', 'F'];

export function getLetterConfig(letter) {
  return LETTERS[letter.toUpperCase()] || null;
}
