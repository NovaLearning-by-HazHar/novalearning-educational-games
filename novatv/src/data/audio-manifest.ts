export interface AudioLine {
  id: string;
  character: string;
  file: string | null;
  durationSeconds: number;
  durationFrames: number;
  text: string;
}

export const AUDIO_MANIFEST: AudioLine[] = [
  {
    id: 'miss-vdm-intro',
    character: 'Miss van der Merwe',
    file: null,
    durationSeconds: 6,
    durationFrames: 180,
    text: "Welcome to our neighbourhood! I'm Miss van der Merwe, and I have some very special friends for you to meet!",
  },
  {
    id: 'sipho',
    character: 'Sipho',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Hi! I'm Sipho! I love counting things. One, two, three \u2014 I can count everything at the corner shop!",
  },
  {
    id: 'aisha',
    character: 'Aisha',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Salaam! I'm Aisha. I love cooking with my family. Do you know how many eggs we need for koeksisters? Let me show you!",
  },
  {
    id: 'jaedon',
    character: 'Jaedon',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Hey! I'm Jaedon! I love sport. When I score a goal, the whole neighbourhood cheers! How many goals can you count?",
  },
  {
    id: 'emma',
    character: 'Emma',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Hello! I'm Emma. I love animals on the farm. Can you help me count the chickens? One, two, three, four, five!",
  },
  {
    id: 'priya',
    character: 'Priya',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Namaste! I'm Priya. I love music! Clap with me \u2014 one clap, two claps, three claps! Can you feel the rhythm?",
  },
  {
    id: 'danie',
    character: 'Danie',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Howzit! I'm Danie. I love building things. Look at my tower \u2014 one block, two blocks, three blocks tall!",
  },
  {
    id: 'naledi',
    character: 'Naledi',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Dumela! I'm Naledi. I love the stars! At night I count them. One star, two stars \u2014 there are so many!",
  },
  {
    id: 'kagiso',
    character: 'Kagiso',
    file: null,
    durationSeconds: 8,
    durationFrames: 240,
    text: "Dumelang! I'm Kagiso. I love stories! Every story starts with one word, then two, then a whole adventure!",
  },
  {
    id: 'all-together',
    character: 'All',
    file: null,
    durationSeconds: 2,
    durationFrames: 60,
    text: 'Come learn with us!',
  },
  {
    id: 'miss-vdm-outro',
    character: 'Miss van der Merwe',
    file: null,
    durationSeconds: 5,
    durationFrames: 150,
    text: "These are your new friends! Together, we're going to learn, play, and grow. See you next time!",
  },
];

export const BG_MUSIC = {
  file: null as string | null,
  durationSeconds: 30,
  loop: true,
  volume: 0.12,
};

export const TOTAL_SPEECH_SECONDS = AUDIO_MANIFEST.reduce(
  (sum, l) => sum + l.durationSeconds,
  0,
);
export const TOTAL_SPEECH_FRAMES = AUDIO_MANIFEST.reduce(
  (sum, l) => sum + l.durationFrames,
  0,
);
