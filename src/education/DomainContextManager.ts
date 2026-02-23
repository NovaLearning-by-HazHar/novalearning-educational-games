/**
 * DomainContextManager
 *
 * The brain of the Universal Scaffold.
 * Routes learners into the correct domain, loads the right content pack,
 * and manages the 4-phase Orboot loop per session.
 *
 * Architecture: 1 engine + 7 domain content packs.
 * Entry point: QR code scan after workbook completion.
 *
 * Universal Scaffold: ENCOUNTER → IDENTIFY → COMBINE → APPLY
 */

import type {
  Domain,
  ScaffoldPhase,
  DomainProgress,
  PhaseCompletion,
} from '../types/progress';
import { SCAFFOLD_PHASES, DOMAINS } from '../types/progress';
import { OfflineProgressStore } from '../services/OfflineProgressStore';

// ─── Content Pack Interface ──────────────────────────────────────
// Each domain implements this interface to plug into the engine.

export interface DomainContentPack {
  domain: Domain;
  /** Display name shown to the learner */
  displayName: string;
  /** Short description for parent dashboard */
  description: string;
  /** CAPS curriculum subject code */
  capsSubjectCode: string;
  /** Available levels in this content pack */
  levels: DomainLevel[];
  /** Concepts this domain can teach */
  concepts: DomainConcept[];
}

export interface DomainLevel {
  levelNumber: number;
  title: string;
  /** Phase content for each scaffold stage */
  encounter: PhaseContent;
  identify: PhaseContent;
  combine: PhaseContent;
  apply: PhaseContent;
}

export interface PhaseContent {
  /** Instructions for the game engine */
  engineDirective: string;
  /** Assets needed (geometry IDs, texture keys) */
  requiredAssets: string[];
  /** Success criteria */
  completionThreshold: number;
  /** Time limit in seconds (0 = no limit) */
  timeLimitSeconds: number;
  /** Cultural context for this phase */
  culturalNote: string | null;
}

export interface DomainConcept {
  conceptId: string;
  label: string;
  /** Which level introduces this concept */
  introducedAtLevel: number;
  /** IsiZulu/IsiXhosa/Afrikaans translations for cross-domain */
  translations: Record<string, string>;
}

// ─── Session Context ─────────────────────────────────────────────

export interface SessionContext {
  sessionId: string;
  domain: Domain;
  currentLevel: number;
  currentPhase: ScaffoldPhase;
  phaseIndex: number;
  contentPack: DomainContentPack | null;
  startedAt: string;
}

// ─── Content Pack Registry ───────────────────────────────────────
// Content packs register themselves here at app startup.

const contentPackRegistry = new Map<Domain, DomainContentPack>();

// ─── Domain Context Manager ──────────────────────────────────────

export const DomainContextManager = {
  /** Current active session — null when no session running */
  _currentSession: null as SessionContext | null,

  // ─── Content Pack Registration ──────────────────────────────

  /**
   * Register a domain content pack.
   * Call once per domain at app startup.
   */
  registerContentPack(pack: DomainContentPack): void {
    contentPackRegistry.set(pack.domain, pack);
    console.log(`[DomainContext] Registered: ${pack.displayName}`);
  },

  /**
   * Get all registered domains.
   */
  getRegisteredDomains(): Domain[] {
    return Array.from(contentPackRegistry.keys());
  },

  /**
   * Check if a domain has a content pack loaded.
   */
  isDomainAvailable(domain: Domain): boolean {
    return contentPackRegistry.has(domain);
  },

  // ─── Session Management ─────────────────────────────────────

  /**
   * Start a new session in a domain.
   * Typically called when a QR code is scanned after workbook completion.
   *
   * @param domain — which domain to enter
   * @param learnerId — the learner's ID (for progress lookup)
   * @returns SessionContext with the starting phase and level
   */
  startSession(domain: Domain, _learnerId: string): SessionContext | null {
    const pack = contentPackRegistry.get(domain);
    if (!pack) {
      console.error(`[DomainContext] No content pack for domain: ${domain}`);
      return null;
    }

    // Look up where the learner left off
    const progress = OfflineProgressStore.getDomainProgress(domain);
    const currentLevel = progress?.currentLevel ?? 1;

    // Determine starting phase
    // If they completed ENCOUNTER last time, start at IDENTIFY, etc.
    const startPhase = this._determineStartPhase(progress);
    const phaseIndex = SCAFFOLD_PHASES.indexOf(startPhase);

    const sessionId = this._generateSessionId();

    const session: SessionContext = {
      sessionId,
      domain,
      currentLevel,
      currentPhase: startPhase,
      phaseIndex,
      contentPack: pack,
      startedAt: new Date().toISOString(),
    };

    this._currentSession = session;

    // Update streak tracking
    OfflineProgressStore.updateStreak(domain);

    console.log(
      `[DomainContext] Session started: ${domain} L${currentLevel} @ ${startPhase}`
    );

    return session;
  },

  /**
   * Get the current phase content for the active session.
   */
  getCurrentPhaseContent(): PhaseContent | null {
    const session = this._currentSession;
    if (!session || !session.contentPack) return null;

    const level = session.contentPack.levels.find(
      (l) => l.levelNumber === session.currentLevel
    );
    if (!level) return null;

    const phaseKey = session.currentPhase.toLowerCase() as
      | 'encounter'
      | 'identify'
      | 'combine'
      | 'apply';

    return level[phaseKey] ?? null;
  },

  /**
   * Get the assets required for the current phase.
   * The game engine uses this to preload only what's needed.
   */
  getRequiredAssets(): string[] {
    const content = this.getCurrentPhaseContent();
    return content?.requiredAssets ?? [];
  },

  /**
   * Complete the current phase and advance to the next.
   * Returns the next phase, or null if the full loop is done.
   */
  completePhase(
    score: number,
    durationSeconds: number,
    attempts: number,
    usedHelp: boolean
  ): ScaffoldPhase | null {
    const session = this._currentSession;
    if (!session) return null;

    // Record the completion
    const completion: PhaseCompletion = {
      domain: session.domain,
      phase: session.currentPhase,
      score,
      timestamp: Date.now(),
      sessionId: session.sessionId,
      durationSeconds,
      attempts,
      usedHelp,
    };

    OfflineProgressStore.save(completion);

    // Advance to next phase
    const nextIndex = session.phaseIndex + 1;

    if (nextIndex >= SCAFFOLD_PHASES.length) {
      // Full loop completed — session ends
      console.log(
        `[DomainContext] Full loop completed for ${session.domain} L${session.currentLevel}`
      );
      this._currentSession = null;
      return null;
    }

    // Move to next phase
    session.phaseIndex = nextIndex;
    session.currentPhase = SCAFFOLD_PHASES[nextIndex];

    console.log(
      `[DomainContext] Advanced to ${session.currentPhase} in ${session.domain}`
    );

    return session.currentPhase;
  },

  /**
   * End the current session early (e.g. app backgrounded, timeout).
   */
  endSession(): void {
    if (this._currentSession) {
      console.log(
        `[DomainContext] Session ended: ${this._currentSession.domain}`
      );
      this._currentSession = null;
    }
  },

  /**
   * Get the active session context (if any).
   */
  getActiveSession(): SessionContext | null {
    return this._currentSession;
  },

  // ─── Domain Routing ─────────────────────────────────────────

  /**
   * Route a QR code to the correct domain.
   * QR codes encode: domain + optional level hint.
   *
   * Format: "nova://{domain}/{level?}"
   * Example: "nova://money-skills/3"
   */
  routeFromQR(qrPayload: string): { domain: Domain; level: number } | null {
    try {
      const match = qrPayload.match(/^nova:\/\/([a-z-]+)(?:\/(\d+))?$/);
      if (!match) return null;

      const domain = match[1] as Domain;
      if (!DOMAINS.includes(domain)) return null;

      const level = match[2] ? parseInt(match[2], 10) : 1;
      return { domain, level };
    } catch {
      return null;
    }
  },

  /**
   * Get concept information for cross-domain connections.
   * Used by CrossDomainConnectionService.
   */
  getConceptsForDomain(domain: Domain): DomainConcept[] {
    const pack = contentPackRegistry.get(domain);
    return pack?.concepts ?? [];
  },

  /**
   * Find a concept across all registered domains.
   */
  findConceptAcrossDomains(
    conceptId: string
  ): { domain: Domain; concept: DomainConcept }[] {
    const results: { domain: Domain; concept: DomainConcept }[] = [];

    for (const [domain, pack] of Array.from(contentPackRegistry)) {
      const concept = pack.concepts.find((c) => c.conceptId === conceptId);
      if (concept) {
        results.push({ domain, concept });
      }
    }

    return results;
  },

  // ─── Internal Helpers ───────────────────────────────────────

  /** @internal */
  _determineStartPhase(progress: DomainProgress | null): ScaffoldPhase {
    if (!progress || !progress.lastPhase) return 'ENCOUNTER';

    const lastIndex = SCAFFOLD_PHASES.indexOf(progress.lastPhase);

    // If they completed APPLY, start fresh at ENCOUNTER (next level)
    if (lastIndex >= SCAFFOLD_PHASES.length - 1) return 'ENCOUNTER';

    // Otherwise, resume at the next phase
    return SCAFFOLD_PHASES[lastIndex + 1];
  },

  /** @internal */
  _generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `s_${timestamp}_${random}`;
  },
};
