import { Howl, Howler } from 'howler';

type SoundId = string;

/** Audio categories with independent volume control */
export type AudioCategory = 'music' | 'sfx' | 'voice' | 'ambient';

interface SoundEntry {
  howl: Howl;
  category: AudioCategory;
}

/**
 * Audio manager wrapping Howler.js.
 * Handles marimba melodies, nature sounds, character voices, and community cheers.
 * All audio files must be < 50KB each.
 *
 * Categories:
 * - music: Background marimba melodies
 * - sfx: Interaction sounds (tap, collect, celebrate)
 * - voice: Character voice lines ("One!", "Two!", etc.)
 * - ambient: Nature sounds (birds, wind, water)
 */
class AudioManager {
  private sounds: Map<SoundId, SoundEntry> = new Map();
  private _muted = false;
  private _volumes: Record<AudioCategory, number> = {
    music: 0.4,
    sfx: 0.8,
    voice: 1.0,
    ambient: 0.3,
  };
  private _unlocked = false;

  /** Preload an audio file with category */
  load(id: SoundId, src: string, category: AudioCategory = 'sfx'): void {
    if (this.sounds.has(id)) return;
    const howl = new Howl({
      src: [src],
      preload: true,
      volume: this._muted ? 0 : this._volumes[category],
      html5: category === 'ambient' || category === 'music', // streaming for long audio
    });
    this.sounds.set(id, { howl, category });
  }

  /** Play a loaded sound. Returns the Howl play ID for stopping specific instances. */
  play(id: SoundId): number | undefined {
    const entry = this.sounds.get(id);
    if (!entry) return undefined;
    if (this._muted) return undefined;
    return entry.howl.play();
  }

  /** Play with volume override (0-1) */
  playAt(id: SoundId, volume: number): number | undefined {
    const entry = this.sounds.get(id);
    if (!entry || this._muted) return undefined;
    const playId = entry.howl.play();
    if (playId !== undefined) {
      entry.howl.volume(volume * this._volumes[entry.category], playId);
    }
    return playId;
  }

  /** Stop a playing sound */
  stop(id: SoundId): void {
    const entry = this.sounds.get(id);
    if (entry) entry.howl.stop();
  }

  /** Stop all sounds in a category */
  stopCategory(category: AudioCategory): void {
    this.sounds.forEach((entry) => {
      if (entry.category === category) entry.howl.stop();
    });
  }

  /** Set volume for a category (0-1) */
  setCategoryVolume(category: AudioCategory, volume: number): void {
    this._volumes[category] = Math.max(0, Math.min(1, volume));
    if (!this._muted) {
      this.sounds.forEach((entry) => {
        if (entry.category === category) {
          entry.howl.volume(this._volumes[category]);
        }
      });
    }
  }

  /** Mute/unmute all sounds */
  setMuted(muted: boolean): void {
    this._muted = muted;
    Howler.mute(muted);
  }

  get muted(): boolean {
    return this._muted;
  }

  /**
   * Unlock audio context on first user interaction.
   * Required by mobile browsers — call this from a touch/click handler.
   */
  unlock(): void {
    if (this._unlocked) return;
    this._unlocked = true;
    // Howler handles AudioContext unlocking, but we ensure it's resumed
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  }

  get unlocked(): boolean {
    return this._unlocked;
  }

  /** Check if a sound is loaded */
  isLoaded(id: SoundId): boolean {
    const entry = this.sounds.get(id);
    return entry ? entry.howl.state() === 'loaded' : false;
  }

  /** Dispose all sounds */
  dispose(): void {
    this.sounds.forEach((entry) => entry.howl.unload());
    this.sounds.clear();
  }
}

/** Singleton audio manager instance */
export const audioManager = new AudioManager();
