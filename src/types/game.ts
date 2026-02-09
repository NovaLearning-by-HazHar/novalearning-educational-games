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

/** Supabase row shape for progress table */
export interface ProgressRow {
  id?: string;
  child_id: string;
  game_id: string;
  completed_at: string;
  interactions: number;
  duration_seconds: number | null;
  phases_visited: string[];
  device_tier: string | null;
}
