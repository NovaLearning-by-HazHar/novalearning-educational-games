import { Howl, Howler } from 'howler';
import { gameStore } from './gameStore.js';
import { AUDIO_KEYS } from '../config/audio.js';

/**
 * Audio Manager — Howler.js wrapper
 * Manages all game audio: SFX, music, letter sounds, voice
 * Respects user sound/music preferences from game store
 * Gracefully handles missing audio files (logs warning, continues)
 */

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicKey = null;
    this._failedKeys = new Set(); // Track failed loads to avoid re-attempts
  }

  /**
   * Preload a sound effect
   */
  load(key, src, options = {}) {
    if (this.sounds[key] || this._failedKeys.has(key)) return;

    this.sounds[key] = new Howl({
      src: Array.isArray(src) ? src : [src],
      volume: options.volume || 1.0,
      loop: options.loop || false,
      preload: true,
      html5: options.html5 || false,
      onloaderror: (_id, err) => {
        console.warn(`[AudioManager] Failed to load "${key}" — file may not exist yet. (${err})`);
        delete this.sounds[key];
        this._failedKeys.add(key);
      },
    });
  }

  /**
   * Preload audio from the registry (call from Boot scene)
   * Only loads keys that have files. Missing files fail silently.
   */
  preloadFromRegistry(keys) {
    const toLoad = keys || Object.keys(AUDIO_KEYS);
    toLoad.forEach((key) => {
      const src = AUDIO_KEYS[key];
      if (src) this.load(key, src);
    });
  }

  /**
   * Play a sound effect (respects soundEnabled)
   */
  play(key) {
    const state = gameStore.getState();
    if (!state.soundEnabled) return null;

    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`[AudioManager] Sound not loaded: ${key}`);
      return null;
    }
    return sound.play();
  }

  /**
   * Play background music (respects musicEnabled)
   */
  playMusic(key) {
    const state = gameStore.getState();
    if (!state.musicEnabled) return;

    // Stop current music if different
    if (this.musicKey === key && this.music?.playing()) return;
    this.stopMusic();

    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`[AudioManager] Music not loaded: ${key}`);
      return;
    }

    sound.loop(true);
    sound.volume(0.3); // Background music at 30%
    sound.play();
    this.music = sound;
    this.musicKey = key;
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music = null;
      this.musicKey = null;
    }
  }

  /**
   * Play letter phonics sound
   */
  playLetterSound(letter) {
    return this.play(`letter-${letter.toLowerCase()}`);
  }

  /**
   * Play animal sound
   */
  playAnimalSound(animal) {
    return this.play(`animal-${animal.toLowerCase()}`);
  }

  /**
   * Play feedback sound (correct/wrong/star)
   */
  playFeedback(type) {
    return this.play(`feedback-${type}`);
  }

  /**
   * Update volume based on store state
   */
  syncWithStore() {
    const state = gameStore.getState();
    
    if (!state.soundEnabled) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }

    if (!state.musicEnabled && this.music) {
      this.stopMusic();
    }
  }

  /**
   * Cleanup all sounds
   */
  destroy() {
    this.stopMusic();
    Object.values(this.sounds).forEach((s) => s.unload());
    this.sounds = {};
  }
}

export const audioManager = new AudioManager();
