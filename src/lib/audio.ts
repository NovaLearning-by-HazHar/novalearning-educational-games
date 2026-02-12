import { Howl, Howler } from 'howler';
import type { AudioLanguage, AudioMap, AudioMapEntry } from '@/types/audioMap';

type SoundId = string;

/** Audio categories with independent volume control */
export type AudioCategory = 'music' | 'sfx' | 'voice' | 'ambient';

interface SoundEntry {
  howl: Howl;
  category: AudioCategory;
}

/** Base path for serving audio files from public/audio/ */
const AUDIO_BASE_PATH = '/audio/';

/**
 * Infer the audio category from a pipeline audio ID prefix.
 * - enc_*, inst_*, phon_* -> voice
 * - ui_* -> sfx
 * - narr_* -> voice
 */
function categoryFromId(id: string): AudioCategory {
  if (id.startsWith('ui_')) return 'sfx';
  if (id.startsWith('enc_') || id.startsWith('inst_') || id.startsWith('phon_') || id.startsWith('narr_')) return 'voice';
  return 'sfx';
}

/**
 * Audio manager wrapping Howler.js.
 * Handles marimba melodies, nature sounds, character voices, and community cheers.
 * Supports language switching for pipeline-generated multilingual audio.
 * All audio files must be < 50KB each.
 *
 * Categories:
 * - music: Background marimba melodies
 * - sfx: Interaction sounds (tap, collect, celebrate)
 * - voice: Character voice lines, encouragement, instructions, phonics
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
  private _language: AudioLanguage = 'en-ZA';
  private _audioMap: AudioMap | null = null;

  /** Current language for multilingual audio */
  get language(): AudioLanguage {
    return this._language;
  }

  /**
   * Set the active language. Clears and reloads language-specific sounds
   * from the audio map if one has been loaded.
   */
  setLanguage(language: AudioLanguage): void {
    if (this._language === language) return;
    this._language = language;

    // Unload language-specific sounds (not UI sounds or blob-based game sounds)
    const toRemove: string[] = [];
    this.sounds.forEach((entry, id) => {
      // Only remove pipeline voice sounds that are language-specific
      if (
        id.startsWith('enc_') ||
        id.startsWith('inst_') ||
        id.startsWith('phon_') ||
        id.startsWith('narr_')
      ) {
        entry.howl.unload();
        toRemove.push(id);
      }
    });
    toRemove.forEach((id) => this.sounds.delete(id));

    // Reload from audio map if available
    if (this._audioMap) {
      this.loadFromMap(this._audioMap);
    }
  }

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

  /**
   * Bulk-load audio from the pipeline audio map.
   * For each entry, picks the current language variant (or "all" for UI sounds).
   * Stores the map for language-switch reloading.
   */
  loadFromMap(audioMap: AudioMap): void {
    this._audioMap = audioMap;

    for (const [audioId, entry] of Object.entries(audioMap)) {
      // Skip if already loaded
      if (this.sounds.has(audioId)) continue;

      const fileEntry = this.resolveMapEntry(entry);
      if (!fileEntry) continue;

      const category = categoryFromId(audioId);
      const src = AUDIO_BASE_PATH + fileEntry.path;
      this.load(audioId, src, category);
    }
  }

  /**
   * Resolve the best file entry from an audio map entry,
   * preferring current language, then falling back to "all" or "en-ZA".
   */
  private resolveMapEntry(entry: AudioMapEntry) {
    return entry[this._language] || entry['all'] || entry['en-ZA'] || null;
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

  /**
   * Play a random encouragement clip.
   * Picks from loaded enc_* sounds for variety.
   */
  playRandomEncouragement(): number | undefined {
    const encIds = [
      'enc_great',
      'enc_amazing',
      'enc_star',
      'enc_proud',
      'enc_rainbow',
      'enc_ubuntu',
      'enc_together',
      'enc_keepgoing',
    ];
    const loaded = encIds.filter((id) => this.sounds.has(id));
    if (loaded.length === 0) return undefined;
    const pick = loaded[Math.floor(Math.random() * loaded.length)];
    return this.play(pick);
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
    this._audioMap = null;
  }
}

/** Singleton audio manager instance */
export const audioManager = new AudioManager();
