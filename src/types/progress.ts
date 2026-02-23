/**
 * NovaLearning Progress Types
 * 
 * Foundation type definitions for the entire service layer.
 * All data shapes are flat JSON — no complex object graphs.
 * Optimised for localStorage serialisation on Galaxy A03.
 * 
 * Universal Scaffold: ENCOUNTER → IDENTIFY → COMBINE → APPLY
 * Ubuntu Philosophy: "I am because we are"
 */

// ─── Universal Scaffold Phases ───────────────────────────────────

export type ScaffoldPhase = 'ENCOUNTER' | 'IDENTIFY' | 'COMBINE' | 'APPLY';

export const SCAFFOLD_PHASES: readonly ScaffoldPhase[] = [
  'ENCOUNTER',
  'IDENTIFY',
  'COMBINE',
  'APPLY',
] as const;

// ─── Content Domains ─────────────────────────────────────────────

export type Domain =
  | 'money-skills'    // MVP domain
  | 'language-world'
  | 'number-forest'
  | 'shape-garden'
  | 'life-skills'
  | 'creative-arts'
  | 'physical-play';

export const DOMAINS: readonly Domain[] = [
  'money-skills',
  'language-world',
  'number-forest',
  'shape-garden',
  'life-skills',
  'creative-arts',
  'physical-play',
] as const;

// ─── Growth Mindset Principles ───────────────────────────────────

export type GrowthMindsetPrinciple =
  | 'effort-leads-to-growth'
  | 'mistakes-help-learning'
  | 'challenges-build-strength'
  | 'practice-builds-skill'
  | 'asking-help-is-brave'
  | 'everyone-learns-differently'
  | 'keep-trying-is-powerful'
  | 'we-grow-together';

// ─── Learner Profile ─────────────────────────────────────────────

export interface LearnerProfile {
  /** Unique learner ID — generated once, persisted in localStorage */
  learnerId: string;
  /** Display name (first name only for privacy) */
  displayName: string;
  /** Preferred language code — 'en' for MVP */
  language: string;
  /** ISO date string of first session */
  createdAt: string;
  /** ISO date string of last activity */
  lastActiveAt: string;
}

// ─── Phase Completion Record ─────────────────────────────────────

export interface PhaseCompletion {
  /** Which domain this phase belongs to */
  domain: Domain;
  /** Which scaffold phase was completed */
  phase: ScaffoldPhase;
  /** Numeric score 0–100 */
  score: number;
  /** Unix timestamp (ms) of completion */
  timestamp: number;
  /** Session ID grouping related completions */
  sessionId: string;
  /** Time spent in this phase (seconds) */
  durationSeconds: number;
  /** Number of attempts before completion */
  attempts: number;
  /** Did the learner use the help system? */
  usedHelp: boolean;
}

// ─── Domain Progress Summary ─────────────────────────────────────

export interface DomainProgress {
  domain: Domain;
  /** Current level within this domain (1-based) */
  currentLevel: number;
  /** Total phases completed across all levels */
  totalPhasesCompleted: number;
  /** Total time spent in this domain (seconds) */
  totalTimeSeconds: number;
  /** Last phase completed */
  lastPhase: ScaffoldPhase | null;
  /** ISO date string of last activity in this domain */
  lastActivityAt: string | null;
  /** Highest consecutive sessions streak */
  streak: number;
}

// ─── Session Record ──────────────────────────────────────────────

export interface SessionRecord {
  sessionId: string;
  /** ISO date string */
  startedAt: string;
  /** ISO date string — null if session still active */
  endedAt: string | null;
  /** Primary domain for this session */
  domain: Domain;
  /** All phases completed during this session */
  phasesCompleted: PhaseCompletion[];
  /** Total duration (seconds) */
  durationSeconds: number;
}

// ─── Concept Learned ─────────────────────────────────────────────

export interface ConceptLearned {
  /** Machine-readable concept key e.g. 'saving', 'counting-to-10' */
  conceptId: string;
  /** Human-readable label */
  label: string;
  /** Domain where this concept was first learned */
  originDomain: Domain;
  /** ISO date string */
  learnedAt: string;
  /** How many times the learner demonstrated this concept */
  reinforcementCount: number;
  /** Other domains where this concept was referenced */
  crossDomainReferences: Domain[];
}

// ─── Full Progress Snapshot ──────────────────────────────────────
// This is the shape of what gets saved to localStorage.

export interface ProgressSnapshot {
  /** Schema version for migration support */
  version: number;
  learner: LearnerProfile;
  /** Per-domain progress summaries */
  domainProgress: Record<Domain, DomainProgress>;
  /** Most recent session records (capped at 30) */
  recentSessions: SessionRecord[];
  /** All concepts the learner has demonstrated */
  conceptsLearned: ConceptLearned[];
  /** Growth mindset principles demonstrated */
  mindsetProgress: Partial<Record<GrowthMindsetPrinciple, number>>;
  /** Pending sync queue — items not yet sent to server */
  syncQueue: PhaseCompletion[];
  /** Unix timestamp of last successful sync */
  lastSyncTimestamp: number | null;
}

// ─── Notification Payloads ───────────────────────────────────────

export interface DailySummary {
  learnerName: string;
  date: string;
  activitiesCompleted: number;
  domainsVisited: Domain[];
  totalMinutes: number;
  /** Human-readable highlight message */
  highlightMessage: string;
  /** Specific concepts practiced */
  conceptsPracticed: string[];
  /** Current streak */
  streak: number;
}

// ─── Cross-Domain Connection ─────────────────────────────────────

export interface CrossDomainConnection {
  conceptId: string;
  conceptLabel: string;
  fromDomain: Domain;
  toDomain: Domain;
  /** Template string for the connection message */
  connectionMessage: string;
  /** Cultural context if applicable */
  culturalContext: string | null;
}

// ─── AI Model Tier ───────────────────────────────────────────────

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

export interface ModelRoutingDecision {
  tier: ModelTier;
  reason: string;
  /** Estimated token cost for this interaction */
  estimatedTokens: number;
}

// ─── Utility: Default Factories ──────────────────────────────────

export function createDefaultDomainProgress(domain: Domain): DomainProgress {
  return {
    domain,
    currentLevel: 1,
    totalPhasesCompleted: 0,
    totalTimeSeconds: 0,
    lastPhase: null,
    lastActivityAt: null,
    streak: 0,
  };
}

export function createDefaultProgressSnapshot(
  learnerId: string,
  displayName: string
): ProgressSnapshot {
  const now = new Date().toISOString();
  const domainProgress = {} as Record<Domain, DomainProgress>;

  for (const domain of DOMAINS) {
    domainProgress[domain] = createDefaultDomainProgress(domain);
  }

  return {
    version: 1,
    learner: {
      learnerId,
      displayName,
      language: 'en',
      createdAt: now,
      lastActiveAt: now,
    },
    domainProgress,
    recentSessions: [],
    conceptsLearned: [],
    mindsetProgress: {},
    syncQueue: [],
    lastSyncTimestamp: null,
  };
}
