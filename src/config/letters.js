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
      sprite: 'a-aardvark',
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
      name: 'Baboon',
      zuluName: 'iMfene',
      fact: 'Baboons live in large troops and groom each other to build trust — caring for one another is Ubuntu in action.',
      color: '#8B6914', // Golden brown
      sprite: 'b-baboon',
    },
    ubuntuValue: {
      english: 'Bravery',
      zulu: 'Ubuqhawe',
      description: 'Standing up for what is right, even when it is hard.',
    },
    phonics: {
      sound: '/b/ as in baboon',
      audioFile: 'letter-b.mp3',
      animalAudio: 'baboon.mp3',
    },
  },
  C: {
    upper: 'C',
    lower: 'c',
    animal: {
      name: 'Crocodile',
      zuluName: 'iNgwenya',
      fact: 'Mother crocodiles carry their babies gently in their jaws — even the fiercest protect their young with tenderness.',
      color: '#4A7A3D', // Dark green
      sprite: 'c-crocodile',
    },
    ubuntuValue: {
      english: 'Compassion',
      zulu: 'Isihawu',
      description: 'Feeling kindness in your heart for everyone around you.',
    },
    phonics: {
      sound: '/k/ as in crocodile',
      audioFile: 'letter-c.mp3',
      animalAudio: 'crocodile.mp3',
    },
  },
  D: {
    upper: 'D',
    lower: 'd',
    animal: {
      name: 'Duiker',
      zuluName: 'iMpunzi',
      fact: 'Duikers are small, shy antelope that hide in the bush — they teach us that being gentle is its own kind of strength.',
      color: '#A0522D', // Sienna brown
      sprite: 'd-duiker',
    },
    ubuntuValue: {
      english: 'Dignity',
      zulu: 'Isithunzi',
      description: 'Treating every person as important and worthy of respect.',
    },
    phonics: {
      sound: '/d/ as in duiker',
      audioFile: 'letter-d.mp3',
      animalAudio: 'duiker.mp3',
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
      sprite: 'e-elephant',
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
      sprite: 'f-flamingo',
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
