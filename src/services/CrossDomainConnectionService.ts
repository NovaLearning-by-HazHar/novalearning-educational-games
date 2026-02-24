/**
 * CrossDomainConnectionService
 *
 * The Series A wow feature.
 *
 * When a learner enters a new domain, this service checks what they've
 * learned in other domains and surfaces meaningful connections.
 *
 * Example: Amara learns "saving" in Money Skills → opens Language World →
 * "You remember saving? Today's word is 'ukonga' — it means to save in isiZulu."
 *
 * This transforms NovaLearning from a game collection into a learning SYSTEM.
 * Cross-domain concept reinforcement is something no competitor has.
 *
 * Ubuntu alignment: knowledge shared across domains mirrors how knowledge
 * is shared across community — "I am because we are."
 */

import type {
  Domain,
  ConceptLearned,
  CrossDomainConnection,
} from '../types/progress';
import { OfflineProgressStore } from './OfflineProgressStore';

// ─── Connection Templates ────────────────────────────────────────
// Templates for generating cross-domain messages.
// {concept} = concept label, {fromDomain} / {toDomain} = domain names.

interface ConnectionTemplate {
  /** Which pair of domains this template connects */
  from: Domain;
  to: Domain;
  /** Message templates — randomly selected for variety */
  templates: string[];
}

const DOMAIN_LABELS: Record<Domain, string> = {
  'money-skills': 'Money Skills',
  'language-world': 'Language World',
  'number-forest': 'Number Forest',
  'shape-garden': 'Shape Garden',
  'life-skills': 'Life Skills',
  'creative-arts': 'Creative Arts',
  'physical-play': 'Physical Play',
};

// ─── Built-in Connection Templates ───────────────────────────────
// These cover the most common cross-domain pairings.
// Additional templates can be registered at runtime.

const builtInTemplates: ConnectionTemplate[] = [
  // Money Skills → Language World
  {
    from: 'money-skills',
    to: 'language-world',
    templates: [
      'You learned about {concept} in Money Skills! Today in Language World, can you find the word for {concept}? 📚💰',
      'Remember {concept} from Money Skills? Let\'s learn how to say it in different languages! 🌍',
      'In Money Skills you explored {concept}. Words have value too — let\'s find the right ones! ✨',
    ],
  },
  // Money Skills → Number Forest
  {
    from: 'money-skills',
    to: 'number-forest',
    templates: [
      'You counted coins in Money Skills! In Number Forest, numbers grow on trees — let\'s keep counting! 🌲',
      'Remember {concept} from Money Skills? Numbers are everywhere — even in the forest! 🔢',
      '{concept} uses numbers too! Let\'s practise more in Number Forest! 🌳',
    ],
  },
  // Language World → Money Skills
  {
    from: 'language-world',
    to: 'money-skills',
    templates: [
      'You learned the word for {concept} in Language World! Now let\'s use it in Money Skills! 💰',
      'Words help us understand money too. Remember {concept}? Let\'s see it in action! 🪙',
    ],
  },
  // Number Forest → Shape Garden
  {
    from: 'number-forest',
    to: 'shape-garden',
    templates: [
      'You counted to {concept} in Number Forest! Shapes have sides to count too — let\'s explore! 🌸',
      'Numbers and shapes are best friends! Remember {concept}? Shapes love numbers! 🔷',
    ],
  },
  // Shape Garden → Creative Arts
  {
    from: 'shape-garden',
    to: 'creative-arts',
    templates: [
      'You discovered {concept} in Shape Garden! Artists use shapes to create beautiful things! 🎨',
      'Remember {concept}? Every painting starts with shapes. Let\'s create! ✏️',
    ],
  },
  // Life Skills → all domains (generic)
  {
    from: 'life-skills',
    to: 'money-skills',
    templates: [
      'In Life Skills you learned about {concept}. That helps with money too! 💡',
    ],
  },
  {
    from: 'life-skills',
    to: 'language-world',
    templates: [
      'Life skills and language go hand in hand! Remember {concept}? Let\'s talk about it! 💬',
    ],
  },
];

// ─── Custom Template Registry ────────────────────────────────────

const customTemplates: ConnectionTemplate[] = [];

// ─── Cultural Concept Map ────────────────────────────────────────
// Maps concept IDs to cultural context (SA languages, Ubuntu values).

interface CulturalMapping {
  conceptId: string;
  isiZulu: string | null;
  isiXhosa: string | null;
  afrikaans: string | null;
  ubuntuConnection: string | null;
}

const culturalMappings: CulturalMapping[] = [
  {
    conceptId: 'saving',
    isiZulu: 'ukonga',
    isiXhosa: 'ukonga',
    afrikaans: 'spaar',
    ubuntuConnection: 'In a stokvel, we save together — that\'s Ubuntu! 🤝',
  },
  {
    conceptId: 'sharing',
    isiZulu: 'ukwabelana',
    isiXhosa: 'ukwabelana',
    afrikaans: 'deel',
    ubuntuConnection: 'Sharing is the heart of Ubuntu — what\'s mine is ours! 💜',
  },
  {
    conceptId: 'counting',
    isiZulu: 'ukubala',
    isiXhosa: 'ukubala',
    afrikaans: 'tel',
    ubuntuConnection: 'When we count together, every number matters! 🔢',
  },
  {
    conceptId: 'helping',
    isiZulu: 'ukusiza',
    isiXhosa: 'ukunceda',
    afrikaans: 'help',
    ubuntuConnection: 'Helping each other is how communities grow strong! 🌱',
  },
  {
    conceptId: 'growing',
    isiZulu: 'ukukhula',
    isiXhosa: 'ukukhula',
    afrikaans: 'groei',
    ubuntuConnection: 'We grow not alone, but together — I am because we are! 🌻',
  },
];

// ─── Cross-Domain Connection Service ─────────────────────────────

export const CrossDomainConnectionService = {
  /**
   * Get relevant cross-domain connections when entering a new domain.
   * This is the main entry point — call when a session starts.
   *
   * @param targetDomain — the domain the learner is about to enter
   * @returns Array of connections, sorted by relevance (most recent first)
   */
  getConnections(targetDomain: Domain): CrossDomainConnection[] {
    // 1. Get concepts the learner has demonstrated in OTHER domains
    const allConcepts = OfflineProgressStore.load()?.conceptsLearned ?? [];
    const relevantConcepts = allConcepts.filter(
      (c) => c.originDomain !== targetDomain
    );

    if (relevantConcepts.length === 0) return [];

    // 2. Build connections for each concept
    const connections: CrossDomainConnection[] = [];

    for (const concept of relevantConcepts) {
      const connection = this._buildConnection(
        concept,
        concept.originDomain,
        targetDomain
      );
      if (connection) {
        connections.push(connection);
      }
    }

    // 3. Sort by recency (most recently learned concepts first)
    connections.sort((a, b) => {
      const conceptA = relevantConcepts.find((c) => c.conceptId === a.conceptId);
      const conceptB = relevantConcepts.find((c) => c.conceptId === b.conceptId);
      const dateA = conceptA?.learnedAt ?? '';
      const dateB = conceptB?.learnedAt ?? '';
      return dateB.localeCompare(dateA);
    });

    // 4. Limit to top 3 to avoid overwhelming the learner
    return connections.slice(0, 3);
  },

  /**
   * Get a single, best connection for the session intro screen.
   * This is what gets displayed as the "welcome back" message.
   */
  getBestConnection(targetDomain: Domain): CrossDomainConnection | null {
    const connections = this.getConnections(targetDomain);
    return connections[0] ?? null;
  },

  /**
   * Format a connection as a child-friendly message.
   * Used in the game UI intro screen.
   */
  formatForChild(connection: CrossDomainConnection): string {
    let message = connection.connectionMessage;

    // Add cultural context if available
    if (connection.culturalContext) {
      message += `\n\n${connection.culturalContext}`;
    }

    return message;
  },

  /**
   * Register a custom connection template.
   * Content packs can add domain-specific templates at startup.
   */
  registerTemplate(template: ConnectionTemplate): void {
    customTemplates.push(template);
  },

  /**
   * Add a cultural mapping for a concept.
   */
  addCulturalMapping(mapping: CulturalMapping): void {
    const existing = culturalMappings.find(
      (m) => m.conceptId === mapping.conceptId
    );
    if (existing) {
      Object.assign(existing, mapping);
    } else {
      culturalMappings.push(mapping);
    }
  },

  /**
   * Record that a cross-domain connection was shown to a learner.
   * Updates the concept's reinforcement count and cross-domain references.
   */
  recordConnectionShown(conceptId: string, inDomain: Domain): void {
    const snapshot = OfflineProgressStore.load();
    if (!snapshot) return;

    const concept = snapshot.conceptsLearned.find(
      (c) => c.conceptId === conceptId
    );
    if (concept) {
      concept.reinforcementCount += 1;
      if (!concept.crossDomainReferences.includes(inDomain)) {
        concept.crossDomainReferences.push(inDomain);
      }
    }

    // Write updated snapshot
    OfflineProgressStore.recordConcept(
      concept ?? {
        conceptId,
        label: conceptId,
        originDomain: inDomain,
        learnedAt: new Date().toISOString(),
        reinforcementCount: 1,
        crossDomainReferences: [],
      }
    );
  },

  /**
   * Get all cultural mappings for a concept.
   */
  getCulturalContext(conceptId: string): CulturalMapping | null {
    return culturalMappings.find((m) => m.conceptId === conceptId) ?? null;
  },

  // ─── Analytics ──────────────────────────────────────────────

  /**
   * Get stats on cross-domain connections for the dashboard.
   */
  getConnectionStats(): {
    totalConceptsWithConnections: number;
    mostConnectedConcept: string | null;
    domainPairsUsed: number;
  } {
    const concepts = OfflineProgressStore.getCrossDomainConcepts();

    let mostConnected: ConceptLearned | null = null;
    const domainPairs = new Set<string>();

    for (const concept of concepts) {
      if (
        !mostConnected ||
        concept.crossDomainReferences.length >
          mostConnected.crossDomainReferences.length
      ) {
        mostConnected = concept;
      }

      for (const refDomain of concept.crossDomainReferences) {
        domainPairs.add(`${concept.originDomain}→${refDomain}`);
      }
    }

    return {
      totalConceptsWithConnections: concepts.length,
      mostConnectedConcept: mostConnected?.label ?? null,
      domainPairsUsed: domainPairs.size,
    };
  },

  // ─── Internal Helpers ───────────────────────────────────────

  /** @internal */
  _buildConnection(
    concept: ConceptLearned,
    fromDomain: Domain,
    toDomain: Domain
  ): CrossDomainConnection | null {
    // Find a matching template
    const template = this._findTemplate(fromDomain, toDomain);
    if (!template) {
      // Fallback: generic connection message
      return {
        conceptId: concept.conceptId,
        conceptLabel: concept.label,
        fromDomain,
        toDomain,
        connectionMessage: `You learned about ${concept.label} in ${DOMAIN_LABELS[fromDomain]}! Let's see how it connects to ${DOMAIN_LABELS[toDomain]}! ✨`,
        culturalContext: this._getCulturalContextString(concept.conceptId),
      };
    }

    // Pick a random template string for variety
    const templateStr =
      template.templates[
        Math.floor(Math.random() * template.templates.length)
      ];

    // Fill in the template
    const message = templateStr.replace(/\{concept\}/g, concept.label);

    return {
      conceptId: concept.conceptId,
      conceptLabel: concept.label,
      fromDomain,
      toDomain,
      connectionMessage: message,
      culturalContext: this._getCulturalContextString(concept.conceptId),
    };
  },

  /** @internal */
  _findTemplate(
    from: Domain,
    to: Domain
  ): ConnectionTemplate | null {
    // Check custom templates first (domain-specific overrides)
    const custom = customTemplates.find(
      (t) => t.from === from && t.to === to
    );
    if (custom) return custom;

    // Fall back to built-in templates
    return (
      builtInTemplates.find((t) => t.from === from && t.to === to) ?? null
    );
  },

  /** @internal */
  _getCulturalContextString(conceptId: string): string | null {
    const mapping = culturalMappings.find((m) => m.conceptId === conceptId);
    if (!mapping) return null;

    const translations: string[] = [];
    if (mapping.isiZulu) translations.push(`isiZulu: *${mapping.isiZulu}*`);
    if (mapping.isiXhosa) translations.push(`isiXhosa: *${mapping.isiXhosa}*`);
    if (mapping.afrikaans) translations.push(`Afrikaans: *${mapping.afrikaans}*`);

    let context = '';
    if (translations.length > 0) {
      context = `🌍 In our languages: ${translations.join(', ')}`;
    }

    if (mapping.ubuntuConnection) {
      context += context ? `\n${mapping.ubuntuConnection}` : mapping.ubuntuConnection;
    }

    return context || null;
  },
};
