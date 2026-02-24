/**
 * ModelRouter
 *
 * AI cost control layer for NovaLearning.
 * Routes interactions to the correct Claude model tier based on
 * complexity, ensuring cost-effective API usage.
 *
 * Tier allocation:
 *   Haiku  (~80% of traffic) — simple interactions, UI, phase tracking
 *   Sonnet (~15% of traffic) — content generation, story adaptation
 *   Opus   (~5%  of traffic) — cultural validation, CAPS alignment
 *
 * Without this: every interaction hits Opus → API bill kills margins.
 * With this: Haiku handles the volume, Opus handles the value.
 *
 * Pricing context (as of implementation):
 *   Haiku:  $0.25 / $1.25 per MTok (input/output)
 *   Sonnet: $3 / $15 per MTok
 *   Opus:   $15 / $75 per MTok
 */

import type { ModelTier, ModelRoutingDecision, Domain } from '../types/progress';

// ─── Interaction Types ───────────────────────────────────────────

export type InteractionType =
  // Haiku-tier: simple, high-frequency
  | 'phase-completion'
  | 'button-interaction'
  | 'navigation'
  | 'progress-query'
  | 'simple-feedback'
  | 'hint-request'
  | 'ui-response'
  // Sonnet-tier: moderate complexity
  | 'content-generation'
  | 'story-adaptation'
  | 'concept-explanation'
  | 'encouragement-generation'
  | 'parent-summary'
  | 'cross-domain-connection'
  // Opus-tier: complex, high-value
  | 'cultural-validation'
  | 'caps-alignment-check'
  | 'ubuntu-philosophy-check'
  | 'curriculum-analysis'
  | 'complex-assessment';

// ─── Tier Classification ─────────────────────────────────────────

const TIER_MAP: Record<InteractionType, ModelTier> = {
  // Haiku — fast, cheap, high-volume
  'phase-completion': 'haiku',
  'button-interaction': 'haiku',
  'navigation': 'haiku',
  'progress-query': 'haiku',
  'simple-feedback': 'haiku',
  'hint-request': 'haiku',
  'ui-response': 'haiku',

  // Sonnet — balanced quality and cost
  'content-generation': 'sonnet',
  'story-adaptation': 'sonnet',
  'concept-explanation': 'sonnet',
  'encouragement-generation': 'sonnet',
  'parent-summary': 'sonnet',
  'cross-domain-connection': 'sonnet',

  // Opus — maximum quality for critical tasks
  'cultural-validation': 'opus',
  'caps-alignment-check': 'opus',
  'ubuntu-philosophy-check': 'opus',
  'curriculum-analysis': 'opus',
  'complex-assessment': 'opus',
};

// ─── Token Estimates ─────────────────────────────────────────────
// Rough estimates for budgeting. Actual usage varies.

const TOKEN_ESTIMATES: Record<InteractionType, number> = {
  'phase-completion': 50,
  'button-interaction': 30,
  'navigation': 20,
  'progress-query': 100,
  'simple-feedback': 80,
  'hint-request': 150,
  'ui-response': 60,
  'content-generation': 500,
  'story-adaptation': 800,
  'concept-explanation': 400,
  'encouragement-generation': 200,
  'parent-summary': 300,
  'cross-domain-connection': 350,
  'cultural-validation': 600,
  'caps-alignment-check': 700,
  'ubuntu-philosophy-check': 500,
  'curriculum-analysis': 1000,
  'complex-assessment': 800,
};

// ─── Cost Tracking ───────────────────────────────────────────────

interface CostTracker {
  haiku: { calls: number; estimatedTokens: number };
  sonnet: { calls: number; estimatedTokens: number };
  opus: { calls: number; estimatedTokens: number };
  sessionStart: number;
}

let costTracker: CostTracker = {
  haiku: { calls: 0, estimatedTokens: 0 },
  sonnet: { calls: 0, estimatedTokens: 0 },
  opus: { calls: 0, estimatedTokens: 0 },
  sessionStart: Date.now(),
};

// ─── Model Router ────────────────────────────────────────────────

export const ModelRouter = {
  /**
   * Route an interaction to the appropriate model tier.
   * This is the primary entry point — call before every AI interaction.
   */
  route(interactionType: InteractionType): ModelRoutingDecision {
    const tier = TIER_MAP[interactionType] ?? 'haiku';
    const estimatedTokens = TOKEN_ESTIMATES[interactionType] ?? 100;

    // Track the call
    costTracker[tier].calls += 1;
    costTracker[tier].estimatedTokens += estimatedTokens;

    return {
      tier,
      reason: this._getRoutingReason(interactionType, tier),
      estimatedTokens,
    };
  },

  /**
   * Route with context-aware override.
   * Some interactions may need upgrading based on context.
   *
   * Example: A "hint-request" is normally Haiku, but if the learner
   * has failed 3+ times, upgrade to Sonnet for a better explanation.
   */
  routeWithContext(
    interactionType: InteractionType,
    context: {
      failureCount?: number;
      domain?: Domain;
      isFirstTime?: boolean;
      requiresCulturalContext?: boolean;
    }
  ): ModelRoutingDecision {
    let tier = TIER_MAP[interactionType] ?? 'haiku';
    let reason = '';

    // Upgrade rules
    if (context.failureCount && context.failureCount >= 3 && tier === 'haiku') {
      tier = 'sonnet';
      reason = `Upgraded from Haiku: learner struggled (${context.failureCount} attempts)`;
    }

    if (context.isFirstTime && tier === 'haiku') {
      tier = 'sonnet';
      reason = 'Upgraded from Haiku: first-time experience needs richer response';
    }

    if (context.requiresCulturalContext && tier !== 'opus') {
      tier = 'opus';
      reason = 'Upgraded to Opus: cultural context validation required';
    }

    if (!reason) {
      reason = this._getRoutingReason(interactionType, tier);
    }

    const estimatedTokens = TOKEN_ESTIMATES[interactionType] ?? 100;
    costTracker[tier].calls += 1;
    costTracker[tier].estimatedTokens += estimatedTokens;

    return { tier, reason, estimatedTokens };
  },

  /**
   * Get the model string for API calls.
   */
  getModelString(tier: ModelTier): string {
    switch (tier) {
      case 'haiku':
        return 'claude-haiku-4-5-20251001';
      case 'sonnet':
        return 'claude-sonnet-4-5-20250929';
      case 'opus':
        return 'claude-opus-4-6';
    }
  },

  /**
   * Get the approximate cost per 1K tokens for a tier.
   * Returns { input, output } in USD.
   */
  getCostPer1KTokens(tier: ModelTier): { input: number; output: number } {
    switch (tier) {
      case 'haiku':
        return { input: 0.00025, output: 0.00125 };
      case 'sonnet':
        return { input: 0.003, output: 0.015 };
      case 'opus':
        return { input: 0.015, output: 0.075 };
    }
  },

  // ─── Cost Analytics ─────────────────────────────────────────

  /**
   * Get the current session cost breakdown.
   */
  getCostBreakdown(): {
    tiers: CostTracker;
    estimatedTotalUSD: number;
    tierPercentages: Record<ModelTier, number>;
  } {
    const totalCalls =
      costTracker.haiku.calls +
      costTracker.sonnet.calls +
      costTracker.opus.calls;

    const tierPercentages: Record<ModelTier, number> = {
      haiku: totalCalls > 0 ? (costTracker.haiku.calls / totalCalls) * 100 : 0,
      sonnet: totalCalls > 0 ? (costTracker.sonnet.calls / totalCalls) * 100 : 0,
      opus: totalCalls > 0 ? (costTracker.opus.calls / totalCalls) * 100 : 0,
    };

    // Rough cost estimate (input + output averaged)
    const haikuCost =
      (costTracker.haiku.estimatedTokens / 1000) *
      (0.00025 + 0.00125) / 2;
    const sonnetCost =
      (costTracker.sonnet.estimatedTokens / 1000) *
      (0.003 + 0.015) / 2;
    const opusCost =
      (costTracker.opus.estimatedTokens / 1000) *
      (0.015 + 0.075) / 2;

    return {
      tiers: { ...costTracker },
      estimatedTotalUSD: haikuCost + sonnetCost + opusCost,
      tierPercentages,
    };
  },

  /**
   * Check if the Opus budget has been exceeded.
   * Useful for hard cost caps during development.
   */
  isOpusBudgetExceeded(maxOpusCallsPerSession: number = 10): boolean {
    return costTracker.opus.calls >= maxOpusCallsPerSession;
  },

  /**
   * Reset cost tracking (call at session start).
   */
  resetCostTracking(): void {
    costTracker = {
      haiku: { calls: 0, estimatedTokens: 0 },
      sonnet: { calls: 0, estimatedTokens: 0 },
      opus: { calls: 0, estimatedTokens: 0 },
      sessionStart: Date.now(),
    };
  },

  /**
   * Get a human-readable cost report.
   */
  getCostReport(): string {
    const breakdown = this.getCostBreakdown();
    const elapsed = Math.round(
      (Date.now() - costTracker.sessionStart) / 1000 / 60
    );

    return [
      '── NovaLearning AI Cost Report ──',
      `Session duration: ${elapsed} min`,
      ``,
      `Haiku:  ${costTracker.haiku.calls} calls (${breakdown.tierPercentages.haiku.toFixed(0)}%)`,
      `Sonnet: ${costTracker.sonnet.calls} calls (${breakdown.tierPercentages.sonnet.toFixed(0)}%)`,
      `Opus:   ${costTracker.opus.calls} calls (${breakdown.tierPercentages.opus.toFixed(0)}%)`,
      ``,
      `Est. cost: $${breakdown.estimatedTotalUSD.toFixed(4)}`,
      `─────────────────────────────────`,
    ].join('\n');
  },

  // ─── Internal Helpers ───────────────────────────────────────

  /** @internal */
  _getRoutingReason(type: InteractionType, tier: ModelTier): string {
    switch (tier) {
      case 'haiku':
        return `Standard routing: ${type} is a simple interaction`;
      case 'sonnet':
        return `Content routing: ${type} requires generation quality`;
      case 'opus':
        return `Critical routing: ${type} requires maximum accuracy`;
    }
  },
};
