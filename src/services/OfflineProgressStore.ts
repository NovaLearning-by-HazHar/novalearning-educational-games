/**
 * OfflineProgressStore
 *
 * localStorage-based persistence for learner progress.
 * Deliberately uses localStorage instead of IndexedDB:
 *   - Synchronous reads = no async overhead on Galaxy A03
 *   - Zero dependencies
 *   - Known-good performance on low-RAM Android WebView
 *   - 5MB limit is sufficient for progress JSON (~20KB typical)
 *
 * Handles: save, load, sync queue management, schema migration.
 */

import type {
  ProgressSnapshot,
  PhaseCompletion,
  SessionRecord,
  ConceptLearned,
  Domain,
  DomainProgress,
} from '../types/progress';
import {
  createDefaultProgressSnapshot,
} from '../types/progress';

// ─── Constants ───────────────────────────────────────────────────

const STORAGE_KEY = 'novalearning_progress';
const CURRENT_VERSION = 1;
const MAX_RECENT_SESSIONS = 30;
const MAX_SYNC_QUEUE = 200;

// ─── Core Store ──────────────────────────────────────────────────

export const OfflineProgressStore = {
  /**
   * Load the full progress snapshot from localStorage.
   * Returns null if no data exists yet.
   */
  load(): ProgressSnapshot | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed: ProgressSnapshot = JSON.parse(raw);

      // Run migrations if schema version is outdated
      if (parsed.version < CURRENT_VERSION) {
        return this._migrate(parsed);
      }

      return parsed;
    } catch (err) {
      console.error('[OfflineProgressStore] Failed to load:', err);
      return null;
    }
  },

  /**
   * Load or create a new snapshot for a first-time learner.
   */
  loadOrCreate(learnerId: string, displayName: string): ProgressSnapshot {
    const existing = this.load();
    if (existing) return existing;

    const fresh = createDefaultProgressSnapshot(learnerId, displayName);
    this._write(fresh);
    return fresh;
  },

  /**
   * Save a phase completion to the progress store.
   * This is the primary write path — called at the end of each
   * ENCOUNTER / IDENTIFY / COMBINE / APPLY phase.
   */
  save(completion: PhaseCompletion): void {
    const snapshot = this.load();
    if (!snapshot) {
      console.error('[OfflineProgressStore] No snapshot exists. Call loadOrCreate first.');
      return;
    }

    // 1. Update domain progress summary
    const dp = snapshot.domainProgress[completion.domain];
    dp.totalPhasesCompleted += 1;
    dp.totalTimeSeconds += completion.durationSeconds;
    dp.lastPhase = completion.phase;
    dp.lastActivityAt = new Date(completion.timestamp).toISOString();

    // Advance level when full APPLY phase is completed
    if (completion.phase === 'APPLY' && completion.score >= 60) {
      dp.currentLevel += 1;
    }

    // 2. Append to current session or create new one
    this._appendToSession(snapshot, completion);

    // 3. Add to sync queue for eventual server upload
    snapshot.syncQueue.push(completion);
    if (snapshot.syncQueue.length > MAX_SYNC_QUEUE) {
      snapshot.syncQueue = snapshot.syncQueue.slice(-MAX_SYNC_QUEUE);
    }

    // 4. Update learner last-active timestamp
    snapshot.learner.lastActiveAt = new Date(completion.timestamp).toISOString();

    this._write(snapshot);
  },

  /**
   * Record a concept the learner demonstrated.
   */
  recordConcept(concept: ConceptLearned): void {
    const snapshot = this.load();
    if (!snapshot) return;

    const existing = snapshot.conceptsLearned.find(
      (c) => c.conceptId === concept.conceptId
    );

    if (existing) {
      existing.reinforcementCount += 1;
      // Add cross-domain reference if learned in a new domain
      if (
        concept.originDomain !== existing.originDomain &&
        !existing.crossDomainReferences.includes(concept.originDomain)
      ) {
        existing.crossDomainReferences.push(concept.originDomain);
      }
    } else {
      snapshot.conceptsLearned.push(concept);
    }

    this._write(snapshot);
  },

  /**
   * Get progress for a specific domain.
   */
  getDomainProgress(domain: Domain): DomainProgress | null {
    const snapshot = this.load();
    if (!snapshot) return null;
    return snapshot.domainProgress[domain] ?? null;
  },

  /**
   * Get all concepts that have been referenced across multiple domains.
   * Used by CrossDomainConnectionService.
   */
  getCrossDomainConcepts(): ConceptLearned[] {
    const snapshot = this.load();
    if (!snapshot) return [];
    return snapshot.conceptsLearned.filter(
      (c) => c.crossDomainReferences.length > 0
    );
  },

  /**
   * Get today's session records for notification summaries.
   */
  getTodaySessions(): SessionRecord[] {
    const snapshot = this.load();
    if (!snapshot) return [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    return snapshot.recentSessions.filter(
      (s) => s.startedAt >= todayIso
    );
  },

  /**
   * Update the streak count for a domain.
   * Call this once per day when the learner opens a domain.
   */
  updateStreak(domain: Domain): void {
    const snapshot = this.load();
    if (!snapshot) return;

    const dp = snapshot.domainProgress[domain];
    const lastActivity = dp.lastActivityAt;

    if (!lastActivity) {
      dp.streak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      const now = new Date();
      const diffMs = now.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        dp.streak += 1;
      } else if (diffDays > 1) {
        dp.streak = 1; // Streak broken
      }
      // diffDays === 0 means same day, streak unchanged
    }

    this._write(snapshot);
  },

  // ─── Sync Queue Management ──────────────────────────────────

  /**
   * Get all items pending sync to the server.
   */
  getSyncQueue(): PhaseCompletion[] {
    const snapshot = this.load();
    if (!snapshot) return [];
    return snapshot.syncQueue;
  },

  /**
   * Clear synced items from the queue after successful upload.
   */
  clearSyncedItems(syncedUpToTimestamp: number): void {
    const snapshot = this.load();
    if (!snapshot) return;

    snapshot.syncQueue = snapshot.syncQueue.filter(
      (item) => item.timestamp > syncedUpToTimestamp
    );
    snapshot.lastSyncTimestamp = syncedUpToTimestamp;

    this._write(snapshot);
  },

  // ─── Data Management ────────────────────────────────────────

  /**
   * Export the full snapshot as a JSON string.
   * Useful for backup or manual sync.
   */
  export(): string | null {
    const snapshot = this.load();
    if (!snapshot) return null;
    return JSON.stringify(snapshot);
  },

  /**
   * Import a snapshot from JSON string (e.g. from backup restore).
   */
  import(jsonString: string): boolean {
    try {
      const parsed: ProgressSnapshot = JSON.parse(jsonString);
      if (!parsed.version || !parsed.learner) {
        console.error('[OfflineProgressStore] Invalid snapshot format');
        return false;
      }
      this._write(parsed);
      return true;
    } catch {
      console.error('[OfflineProgressStore] Import failed');
      return false;
    }
  },

  /**
   * Completely clear stored progress. Use with caution.
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Check storage usage (approximate).
   * localStorage has ~5MB limit; progress is typically ~20KB.
   */
  getStorageUsageBytes(): number {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    // Rough estimate: 2 bytes per char in UTF-16
    return raw.length * 2;
  },

  // ─── Internal Helpers ───────────────────────────────────────

  /** @internal */
  _write(snapshot: ProgressSnapshot): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      // localStorage full — attempt to trim old sessions
      console.error('[OfflineProgressStore] Write failed, trimming data:', err);
      snapshot.recentSessions = snapshot.recentSessions.slice(-10);
      snapshot.syncQueue = snapshot.syncQueue.slice(-50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        console.error('[OfflineProgressStore] Critical: storage full after trim');
      }
    }
  },

  /** @internal */
  _appendToSession(
    snapshot: ProgressSnapshot,
    completion: PhaseCompletion
  ): void {
    const activeSession = snapshot.recentSessions.find(
      (s) => s.sessionId === completion.sessionId
    );

    if (activeSession) {
      activeSession.phasesCompleted.push(completion);
      activeSession.durationSeconds += completion.durationSeconds;
      activeSession.endedAt = new Date(completion.timestamp).toISOString();
    } else {
      const newSession: SessionRecord = {
        sessionId: completion.sessionId,
        startedAt: new Date(completion.timestamp).toISOString(),
        endedAt: null,
        domain: completion.domain,
        phasesCompleted: [completion],
        durationSeconds: completion.durationSeconds,
      };
      snapshot.recentSessions.push(newSession);

      // Cap session history
      if (snapshot.recentSessions.length > MAX_RECENT_SESSIONS) {
        snapshot.recentSessions = snapshot.recentSessions.slice(
          -MAX_RECENT_SESSIONS
        );
      }
    }
  },

  /** @internal - Schema migrations */
  _migrate(snapshot: ProgressSnapshot): ProgressSnapshot {
    // Future migrations go here
    // if (snapshot.version === 0) { ... snapshot.version = 1; }
    console.log(
      `[OfflineProgressStore] Migrated from v${snapshot.version} to v${CURRENT_VERSION}`
    );
    snapshot.version = CURRENT_VERSION;
    this._write(snapshot);
    return snapshot;
  },
};
