/**
 * ParentNotificationService
 *
 * Generates WhatsApp-ready daily summaries from learner progress.
 * Parent retention mechanic — keeps caregivers engaged with
 * their child's learning journey.
 *
 * Output: Plain text messages formatted for WhatsApp sharing.
 * No API dependencies — works fully offline from localStorage data.
 *
 * Demo value: Show to DBE and Mastercard Foundation as proof
 * that parents stay engaged with learner outcomes.
 */

import type {
  DailySummary,
  Domain,
  SessionRecord,
  ProgressSnapshot,
  ScaffoldPhase,
} from '../types/progress';
import { OfflineProgressStore } from './OfflineProgressStore';

// ─── Domain Display Names ────────────────────────────────────────

const DOMAIN_NAMES: Record<Domain, string> = {
  'money-skills': 'Money Skills 💰',
  'language-world': 'Language World 📚',
  'number-forest': 'Number Forest 🌲',
  'shape-garden': 'Shape Garden 🌸',
  'life-skills': 'Life Skills 🌟',
  'creative-arts': 'Creative Arts 🎨',
  'physical-play': 'Physical Play ⚽',
};

const _PHASE_NAMES: Record<ScaffoldPhase, string> = {
  ENCOUNTER: 'explored something new',
  IDENTIFY: 'practised recognising patterns',
  COMBINE: 'connected ideas together',
  APPLY: 'showed what they learned',
};

// ─── Celebration Messages ────────────────────────────────────────
// Ubuntu-aligned: celebrate the community, not just the individual.

const CELEBRATION_MESSAGES = [
  '🌟 What a wonderful learning day!',
  '🎉 Growing stronger every day!',
  '✨ Every step forward matters!',
  '🌈 Learning is a beautiful journey!',
  '💪 Practice makes progress!',
  '🌻 Blooming with knowledge!',
  '🦁 Brave and curious today!',
  '🌍 Learning to make our world better!',
];

const STREAK_MESSAGES: Record<number, string> = {
  3: "🔥 That's 3 days in a row! Keep it up!",
  5: '⭐ 5-day streak! Amazing dedication!',
  7: '🏆 A whole week of learning! Incredible!',
  14: '🌟 Two weeks strong! A true learner!',
  30: '👑 30-day streak! An inspiration to us all!',
};

// ─── Parent Notification Service ─────────────────────────────────

export const ParentNotificationService = {
  /**
   * Generate a daily summary for the learner.
   * Call this at the end of the day or when the parent taps "Summary".
   */
  generateDailySummary(): DailySummary | null {
    const snapshot = OfflineProgressStore.load();
    if (!snapshot) return null;

    const todaySessions = OfflineProgressStore.getTodaySessions();
    if (todaySessions.length === 0) return null;

    // Aggregate today's data
    const domainsVisited = this._getUniqueDomainsFromSessions(todaySessions);
    const totalActivities = todaySessions.reduce(
      (sum, s) => sum + s.phasesCompleted.length,
      0
    );
    const totalSeconds = todaySessions.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    );
    const totalMinutes = Math.round(totalSeconds / 60);
    const conceptsPracticed = this._getConceptsPracticed(snapshot, todaySessions);

    // Get max streak across domains
    const maxStreak = this._getMaxStreak(snapshot);

    // Build highlight message
    const highlightMessage = this._buildHighlightMessage(
      snapshot.learner.displayName,
      domainsVisited,
      totalActivities,
      todaySessions
    );

    return {
      learnerName: snapshot.learner.displayName,
      date: new Date().toISOString().split('T')[0],
      activitiesCompleted: totalActivities,
      domainsVisited,
      totalMinutes,
      highlightMessage,
      conceptsPracticed,
      streak: maxStreak,
    };
  },

  /**
   * Format the daily summary as a WhatsApp-ready text message.
   */
  formatForWhatsApp(summary: DailySummary): string {
    const lines: string[] = [];

    // Header
    lines.push(`📖 *NovaLearning Daily Update*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push('');

    // Greeting
    lines.push(`Hi! Here's what ${summary.learnerName} did today:`);
    lines.push('');

    // Activities
    lines.push(
      `✅ *${summary.activitiesCompleted} activities* completed`
    );
    lines.push(`⏱️ *${summary.totalMinutes} minutes* of learning`);

    // Domains visited
    if (summary.domainsVisited.length > 0) {
      const domainList = summary.domainsVisited
        .map((d) => DOMAIN_NAMES[d])
        .join(', ');
      lines.push(`🗺️ Explored: ${domainList}`);
    }

    lines.push('');

    // Highlight message
    lines.push(summary.highlightMessage);
    lines.push('');

    // Concepts practiced
    if (summary.conceptsPracticed.length > 0) {
      lines.push(`📝 *Concepts practised:*`);
      for (const concept of summary.conceptsPracticed.slice(0, 5)) {
        lines.push(`  • ${concept}`);
      }
      lines.push('');
    }

    // Streak
    if (summary.streak > 1) {
      const streakMsg =
        STREAK_MESSAGES[summary.streak] ??
        `🔥 ${summary.streak}-day learning streak!`;
      lines.push(streakMsg);
      lines.push('');
    }

    // Celebration
    const celebration =
      CELEBRATION_MESSAGES[
        Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
      ];
    lines.push(celebration);

    lines.push('');
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`_Powered by NovaLearning 🇿🇦_`);

    return lines.join('\n');
  },

  /**
   * Generate a short encouragement nudge for inactive days.
   * Send when the learner hasn't played in 2+ days.
   */
  generateInactivityNudge(): string | null {
    const snapshot = OfflineProgressStore.load();
    if (!snapshot) return null;

    const lastActive = new Date(snapshot.learner.lastActiveAt);
    const now = new Date();
    const daysSinceActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActive < 2) return null;

    const name = snapshot.learner.displayName;

    if (daysSinceActive <= 3) {
      return (
        `📖 Hi! ${name} hasn't played NovaLearning in ${daysSinceActive} days. ` +
        `A quick 5-minute session keeps the learning going! 🌟`
      );
    }

    if (daysSinceActive <= 7) {
      return (
        `📖 We miss ${name} at NovaLearning! ` +
        `It's been ${daysSinceActive} days since their last session. ` +
        `Even a short visit helps — learning is a journey, not a race! 🌈`
      );
    }

    return (
      `📖 Hi! ${name}'s NovaLearning adventure is waiting! ` +
      `It's been a while since their last session. ` +
      `Every day is a great day to learn something new! 🌻`
    );
  },

  /**
   * Generate a weekly progress report.
   */
  generateWeeklyReport(): string | null {
    const snapshot = OfflineProgressStore.load();
    if (!snapshot) return null;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoIso = weekAgo.toISOString();

    const weeklySessions = snapshot.recentSessions.filter(
      (s) => s.startedAt >= weekAgoIso
    );

    if (weeklySessions.length === 0) return null;

    const name = snapshot.learner.displayName;
    const totalActivities = weeklySessions.reduce(
      (sum, s) => sum + s.phasesCompleted.length,
      0
    );
    const totalMinutes = Math.round(
      weeklySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    );
    const uniqueDomains = this._getUniqueDomainsFromSessions(weeklySessions);

    const lines: string[] = [];
    lines.push(`📊 *${name}'s Weekly Report*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push('');
    lines.push(`📅 Sessions this week: *${weeklySessions.length}*`);
    lines.push(`✅ Activities completed: *${totalActivities}*`);
    lines.push(`⏱️ Total learning time: *${totalMinutes} minutes*`);
    lines.push(
      `🗺️ Domains explored: *${uniqueDomains.length}* of 7`
    );
    lines.push('');

    // Per-domain breakdown
    for (const domain of uniqueDomains) {
      const domainSessions = weeklySessions.filter(
        (s) => s.domain === domain
      );
      const domainActivities = domainSessions.reduce(
        (sum, s) => sum + s.phasesCompleted.length,
        0
      );
      lines.push(
        `  ${DOMAIN_NAMES[domain]}: ${domainActivities} activities`
      );
    }

    lines.push('');
    lines.push(
      `🌍 _"I am because we are" — every step matters!_`
    );
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`_NovaLearning Weekly 🇿🇦_`);

    return lines.join('\n');
  },

  // ─── Internal Helpers ───────────────────────────────────────

  /** @internal */
  _getUniqueDomainsFromSessions(sessions: SessionRecord[]): Domain[] {
    const domainSet = new Set<Domain>();
    for (const session of sessions) {
      domainSet.add(session.domain);
    }
    return Array.from(domainSet);
  },

  /** @internal */
  _getConceptsPracticed(
    snapshot: ProgressSnapshot,
    todaySessions: SessionRecord[]
  ): string[] {
    // Get concepts from domains active today
    const activeDomains = this._getUniqueDomainsFromSessions(todaySessions);
    return snapshot.conceptsLearned
      .filter((c) => activeDomains.includes(c.originDomain))
      .map((c) => c.label)
      .slice(0, 5);
  },

  /** @internal */
  _getMaxStreak(snapshot: ProgressSnapshot): number {
    let max = 0;
    for (const domain of Object.values(snapshot.domainProgress)) {
      if (domain.streak > max) max = domain.streak;
    }
    return max;
  },

  /** @internal */
  _buildHighlightMessage(
    name: string,
    domains: Domain[],
    activities: number,
    sessions: SessionRecord[]
  ): string {
    if (domains.length === 0) return '';

    const primaryDomain = domains[0];
    const domainName = DOMAIN_NAMES[primaryDomain];

    // Check for APPLY phase completions (the biggest achievement)
    const applyCompletions = sessions.flatMap((s) =>
      s.phasesCompleted.filter((p) => p.phase === 'APPLY')
    );

    if (applyCompletions.length > 0) {
      return (
        `🎯 ${name} *showed what they learned* in ${domainName} today! ` +
        `That's the final step of the learning journey — amazing!`
      );
    }

    if (activities >= 5) {
      return `💪 ${name} was on fire today — ${activities} activities across ${domains.length} area${domains.length > 1 ? 's' : ''}!`;
    }

    if (domains.length > 1) {
      return `🌈 ${name} explored ${domains.length} different learning areas today — what a curious mind!`;
    }

    return `📖 ${name} spent time in ${domainName} today. Every bit of practice counts!`;
  },
};
