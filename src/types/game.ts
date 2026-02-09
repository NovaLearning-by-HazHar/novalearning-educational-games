/** Character heritage identifiers */
export type CharacterName = 'sipho' | 'thandi' | 'lerato' | 'pieter' | 'fatima' | 'amahle';

/** Character definition */
export interface Character {
  name: CharacterName;
  displayName: string;
  heritage: string;
  personality: string;
  learningStyle: 'kinesthetic' | 'visual' | 'social' | 'logical' | 'auditory' | 'creative';
}

/** Device performance tiers */
export type DeviceTier = 'low' | 'medium' | 'high';

/** Game phase in the Ubuntu gameplay loop */
export type GamePhase = 'explore' | 'discover' | 'practice' | 'celebrate';

/** Curriculum area alignment */
export type CurriculumArea =
  | 'language'
  | 'numeracy'
  | 'life-skills'
  | 'motor-skills'
  | 'cultural-awareness';

/** Game metadata for registry */
export interface GameMeta {
  id: string;
  title: string;
  curriculum: CurriculumArea;
  description: string;
  targetAge: [number, number];
}
