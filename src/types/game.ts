/** Character Bible v1.0 identifiers */
/** Bible v1.0 core cast */
export type CoreCharacterId = 'gogo_thandi' | 'sipho' | 'amahle' | 'jabu' | 'liya' | 'themba';

/** Money Skills game-specific character IDs */
export type MoneyCharacterId = 'chanel' | 'priya' | 'naledi';

/** All character identifiers across the project */
export type CharacterId = CoreCharacterId | MoneyCharacterId;

/** Companion animal identifiers */
export type CompanionId = 'elephant_calf' | 'springbok' | 'meerkat' | 'weaver_bird' | 'cape_penguin' | 'tortoise';

/** @deprecated Use CharacterId instead */
export type CharacterName = CharacterId;

/** Character definition (Bible v1.0) */
export interface Character {
  id: CharacterId;
  fullName: string;
  role: 'wisdom_keeper' | 'curious_explorer' | 'caring_helper' | 'creative_builder' | 'joyful_storyteller' | 'gentle_protector';
  ethnicity: string;
  companion: CompanionId;
  skinTone: string;
  languages: string[];
  catchphrase: Record<string, string>;
  vertices: number;
}

/** Companion animal definition */
export interface Companion {
  id: CompanionId;
  animal: string;
  belongsTo: CharacterId;
  vertices: number;
  sounds: string[];
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

// --- Phase 3: Infrastructure types (adapted from useMCPConnection patterns) ---

/** Auth state for parent login (Pattern 2: Connection State Machine) */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

/** Sync state for progress upload (Pattern 1: Request Lifecycle) */
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

/** Play session data (Pattern 5: Session Management) */
export interface GameSession {
  sessionId: string;
  gameId: string;
  startedAt: string;
  endedAt: string | null;
  interactions: number;
  durationSeconds: number;
  phasesVisited: GamePhase[];
  deviceTier: DeviceTier;
}

/** Student (child) linked to a parent in Supabase */
export interface Student {
  id: string;
  parent_id: string;
  display_name: string;
  age: number;
  grade: string;
  avatar_emoji: string;
}

/** Supabase row shape for game_sessions table */
export interface GameSessionRow {
  id?: string;
  student_id: string;
  game_id: string;
  started_at?: string;
  completed_at?: string;
  score: number;
  max_score: number;
  duration_seconds: number;
  attempts: number;
  completed: boolean;
  performance_data: Record<string, unknown>;
  device_info: Record<string, unknown>;
}

/** Supabase row shape for student_progress table (aggregate per skill) */
export interface StudentProgressRow {
  id?: string;
  student_id: string;
  skill_category: string;
  current_level: number;
  total_games_played: number;
  total_time_seconds: number;
  mastery_percentage: number;
  last_played_at: string;
}
