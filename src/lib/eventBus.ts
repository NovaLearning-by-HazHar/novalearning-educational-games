import type { GamePhase, CharacterName } from '@/types/game';
import type { AudioCategory } from '@/lib/audio';

/** Typed game event definitions (Pattern 4: Event Subscription) */
export type GameEvents = {
  'game:interaction': { gameId: string; type: string; data?: unknown };
  'game:phase_change': { from: GamePhase; to: GamePhase };
  'game:session_start': { gameId: string; sessionId: string };
  'game:session_end': { gameId: string; sessionId: string; duration: number };
  'audio:play': { id: string; category: AudioCategory };
  'celebration:trigger': { gameId: string; characters: CharacterName[] };
};

type Listener<T> = (data: T) => void;

/**
 * Typed publish-subscribe event bus.
 * Singleton pattern matching AudioManager in audio.ts.
 * Decouples game orchestrators from audio, analytics, and celebration.
 */
class EventBus<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<Listener<never>>>();

  /** Subscribe to an event. Returns cleanup function for useEffect. */
  on<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn as Listener<never>);
    return () => { this.listeners.get(event)?.delete(fn as Listener<never>); };
  }

  /** Emit an event to all subscribers. Synchronous. */
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.listeners.get(event)?.forEach((fn) => (fn as Listener<EventMap[K]>)(data));
  }

  /** Remove all listeners (for cleanup/testing). */
  clear(): void {
    this.listeners.clear();
  }
}

/** Singleton game event bus */
export const gameEvents = new EventBus<GameEvents>();
