/** Ubuntu Garden — Garden items with associated mini-tasks in 5 languages */

export type ItemCategory = 'animals' | 'trees' | 'flowers' | 'structures';

export type TaskType = 'count' | 'letter' | 'colour';

export interface MiniTaskData {
  type: TaskType;
  question: Record<string, string>;
  options: string[];
  correctIndex: number;
}

export interface GardenItemData {
  id: string;
  category: ItemCategory;
  name: Record<string, string>;
  emoji: string;
  task: MiniTaskData;
}

export interface CategoryInfo {
  id: ItemCategory;
  label: Record<string, string>;
  emoji: string;
}

const LANGS = ['en', 'af', 'zu', 'xh', 'st'] as const;
export type Lang = (typeof LANGS)[number];
export { LANGS };

export const ITEM_CATEGORIES: CategoryInfo[] = [
  {
    id: 'animals',
    label: { en: 'Animals', af: 'Diere', zu: 'Izilwane', xh: 'Izilwanyana', st: 'Diphoofolo' },
    emoji: '🐾',
  },
  {
    id: 'trees',
    label: { en: 'Trees', af: 'Bome', zu: 'Izihlahla', xh: 'Imithi', st: 'Difate' },
    emoji: '🌳',
  },
  {
    id: 'flowers',
    label: { en: 'Flowers', af: 'Blomme', zu: 'Izimbali', xh: 'Iintyatyambo', st: 'Lipalesa' },
    emoji: '🌸',
  },
  {
    id: 'structures',
    label: { en: 'Structures', af: 'Strukture', zu: 'Izakhiwo', xh: 'Izakhiwo', st: 'Mehaho' },
    emoji: '🏠',
  },
];

export const GARDEN_ITEMS: GardenItemData[] = [
  // ── Animals ──
  {
    id: 'tortoise',
    category: 'animals',
    name: { en: 'Tortoise', af: 'Skilpad', zu: 'Ufudu', xh: 'Ufudo', st: 'Kgudu' },
    emoji: '🐢',
    task: {
      type: 'count',
      question: {
        en: 'Count to 3!',
        af: 'Tel tot 3!',
        zu: 'Bala kuze kube u-3!',
        xh: 'Bala ufike ku-3!',
        st: 'Bala ho fihla ho 3!',
      },
      options: ['1', '2', '3'],
      correctIndex: 2,
    },
  },
  {
    id: 'rabbit',
    category: 'animals',
    name: { en: 'Rabbit', af: 'Haas', zu: 'Unogwaja', xh: 'Umvundla', st: 'Mmutla' },
    emoji: '🐇',
    task: {
      type: 'letter',
      question: {
        en: 'Find the letter B!',
        af: 'Vind die letter B!',
        zu: 'Thola uhlamvu B!',
        xh: 'Fumana unobumba B!',
        st: 'Fumana tlhaku B!',
      },
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
    },
  },
  {
    id: 'bird',
    category: 'animals',
    name: { en: 'Bird', af: 'Voel', zu: 'Inyoni', xh: 'Intaka', st: 'Nonyana' },
    emoji: '🐦',
    task: {
      type: 'colour',
      question: {
        en: 'What colour is the sky?',
        af: 'Watter kleur is die lug?',
        zu: 'Yiluphi umbala wesibhakabhaka?',
        xh: 'Yintoni umbala wesibhakabhaka?',
        st: 'Lehodimo le mebala efe?',
      },
      options: ['🔴', '🔵', '🟢'],
      correctIndex: 1,
    },
  },
  {
    id: 'frog',
    category: 'animals',
    name: { en: 'Frog', af: 'Padda', zu: 'Ixoxo', xh: 'Isele', st: 'Segwagwa' },
    emoji: '🐸',
    task: {
      type: 'count',
      question: {
        en: 'How many legs does a frog have?',
        af: 'Hoeveel bene het \'n padda?',
        zu: 'Ixoxo linemilenze emingaki?',
        xh: 'Isele sinemilenze emingaphi?',
        st: 'Segwagwa se na le maoto a makae?',
      },
      options: ['2', '3', '4'],
      correctIndex: 2,
    },
  },
  // ── Trees ──
  {
    id: 'oak-tree',
    category: 'trees',
    name: { en: 'Oak Tree', af: 'Eikeboom', zu: 'Isihlahla se-Oki', xh: 'Umthi we-Oki', st: 'Sefate sa Oke' },
    emoji: '🌳',
    task: {
      type: 'letter',
      question: {
        en: 'Find the letter T for Tree!',
        af: 'Vind die letter B vir Boom!',
        zu: 'Thola uhlamvu S!',
        xh: 'Fumana unobumba M!',
        st: 'Fumana tlhaku S!',
      },
      options: ['P', 'Q', 'T', 'R'],
      correctIndex: 2,
    },
  },
  {
    id: 'palm-tree',
    category: 'trees',
    name: { en: 'Palm Tree', af: 'Palmboom', zu: 'Isundu', xh: 'Umthi wesundu', st: 'Sefate sa palema' },
    emoji: '🌴',
    task: {
      type: 'colour',
      question: {
        en: 'What colour are leaves?',
        af: 'Watter kleur is blare?',
        zu: 'Amahlamvu anombala muni?',
        xh: 'Amagqabi anombala mni?',
        st: 'Makhasi a mebala efe?',
      },
      options: ['🔴', '🔵', '🟢'],
      correctIndex: 2,
    },
  },
  {
    id: 'fruit-tree',
    category: 'trees',
    name: { en: 'Fruit Tree', af: 'Vrugteboom', zu: 'Isihlahla sezithelo', xh: 'Umthi weziqhamo', st: 'Sefate sa ditholwana' },
    emoji: '🍎',
    task: {
      type: 'count',
      question: {
        en: 'Count to 3!',
        af: 'Tel tot 3!',
        zu: 'Bala kuze kube u-3!',
        xh: 'Bala ufike ku-3!',
        st: 'Bala ho fihla ho 3!',
      },
      options: ['1', '2', '3'],
      correctIndex: 2,
    },
  },
  {
    id: 'baobab',
    category: 'trees',
    name: { en: 'Baobab', af: 'Kremetart', zu: 'Isihlahla somkhomo', xh: 'Umthi webaobab', st: 'Sefate sa baobab' },
    emoji: '🌲',
    task: {
      type: 'letter',
      question: {
        en: 'Find the letter B for Baobab!',
        af: 'Vind die letter K!',
        zu: 'Thola uhlamvu S!',
        xh: 'Fumana unobumba M!',
        st: 'Fumana tlhaku S!',
      },
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
    },
  },
  // ── Flowers ──
  {
    id: 'sunflower',
    category: 'flowers',
    name: { en: 'Sunflower', af: 'Sonneblom', zu: 'Isimbali selanga', xh: 'Intyatyambo yelanga', st: 'Palesa ea letsatsi' },
    emoji: '🌻',
    task: {
      type: 'colour',
      question: {
        en: 'What colour is a sunflower?',
        af: 'Watter kleur is \'n sonneblom?',
        zu: 'Isimbali selanga sinombala muni?',
        xh: 'Intyatyambo yelanga inombala mni?',
        st: 'Palesa ea letsatsi e mebala efe?',
      },
      options: ['🔵', '🟡', '🟢'],
      correctIndex: 1,
    },
  },
  {
    id: 'daisy',
    category: 'flowers',
    name: { en: 'Daisy', af: 'Madeliefie', zu: 'Ideyizi', xh: 'Ideyizi', st: 'Palesa ea deyisi' },
    emoji: '🌼',
    task: {
      type: 'count',
      question: {
        en: 'Count to 3!',
        af: 'Tel tot 3!',
        zu: 'Bala kuze kube u-3!',
        xh: 'Bala ufike ku-3!',
        st: 'Bala ho fihla ho 3!',
      },
      options: ['1', '2', '3'],
      correctIndex: 2,
    },
  },
  {
    id: 'rose',
    category: 'flowers',
    name: { en: 'Rose', af: 'Roos', zu: 'Irozi', xh: 'Irozi', st: 'Palesa ea rouse' },
    emoji: '🌹',
    task: {
      type: 'letter',
      question: {
        en: 'Find the letter R for Rose!',
        af: 'Vind die letter R vir Roos!',
        zu: 'Thola uhlamvu R!',
        xh: 'Fumana unobumba R!',
        st: 'Fumana tlhaku R!',
      },
      options: ['P', 'R', 'S', 'T'],
      correctIndex: 1,
    },
  },
  {
    id: 'protea',
    category: 'flowers',
    name: { en: 'Protea', af: 'Protea', zu: 'IProtea', xh: 'IProtea', st: 'Protea' },
    emoji: '🏵️',
    task: {
      type: 'colour',
      question: {
        en: 'What colour is the sky?',
        af: 'Watter kleur is die lug?',
        zu: 'Yiluphi umbala wesibhakabhaka?',
        xh: 'Yintoni umbala wesibhakabhaka?',
        st: 'Lehodimo le mebala efe?',
      },
      options: ['🔴', '🔵', '🟢'],
      correctIndex: 1,
    },
  },
  // ── Structures ──
  {
    id: 'house',
    category: 'structures',
    name: { en: 'House', af: 'Huis', zu: 'Indlu', xh: 'Indlu', st: 'Ntlo' },
    emoji: '🏠',
    task: {
      type: 'count',
      question: {
        en: 'How many sides does a square have?',
        af: 'Hoeveel sye het \'n vierkant?',
        zu: 'Isikwele sinamahlangothi amangaki?',
        xh: 'Iskwere sinamacala amangaphi?',
        st: 'Sekwere se na le mahlakoreng a makae?',
      },
      options: ['3', '4', '5'],
      correctIndex: 1,
    },
  },
  {
    id: 'fence',
    category: 'structures',
    name: { en: 'Fence', af: 'Heining', zu: 'Uthango', xh: 'Ucingo', st: 'Terata' },
    emoji: '🏗️',
    task: {
      type: 'letter',
      question: {
        en: 'Find the letter F for Fence!',
        af: 'Vind die letter H vir Heining!',
        zu: 'Thola uhlamvu U!',
        xh: 'Fumana unobumba U!',
        st: 'Fumana tlhaku T!',
      },
      options: ['D', 'E', 'F', 'G'],
      correctIndex: 2,
    },
  },
  {
    id: 'bench',
    category: 'structures',
    name: { en: 'Bench', af: 'Bank', zu: 'Ibhentshi', xh: 'Ibhentshi', st: 'Setulo' },
    emoji: '🪑',
    task: {
      type: 'colour',
      question: {
        en: 'What colour is the grass?',
        af: 'Watter kleur is die gras?',
        zu: 'Utshani bunombala muni?',
        xh: 'Ingca inombala mni?',
        st: 'Jwang bo mebala efe?',
      },
      options: ['🔴', '🔵', '🟢'],
      correctIndex: 2,
    },
  },
  {
    id: 'bridge',
    category: 'structures',
    name: { en: 'Bridge', af: 'Brug', zu: 'Ibhuloho', xh: 'Ibrorho', st: 'Borogo' },
    emoji: '🌉',
    task: {
      type: 'count',
      question: {
        en: 'Count to 3!',
        af: 'Tel tot 3!',
        zu: 'Bala kuze kube u-3!',
        xh: 'Bala ufike ku-3!',
        st: 'Bala ho fihla ho 3!',
      },
      options: ['1', '2', '3'],
      correctIndex: 2,
    },
  },
];
