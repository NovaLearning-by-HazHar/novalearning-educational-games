import { Howl } from 'howler';

type SoundId = string;

/**
 * Audio manager wrapping Howler.js.
 * Handles marimba melodies, nature sounds, character voices, and community cheers.
 * All audio files must be < 50KB each.
 */
class AudioManager {
  private sounds: Map<SoundId, Howl> = new Map();
  private _muted = false;

  /** Preload an audio file */
  load(id: SoundId, src: string): void {
    if (this.sounds.has(id)) return;
    const howl = new Howl({
      src: [src],
      preload: true,
      volume: this._muted ? 0 : 1,
    });
    this.sounds.set(id, howl);
  }

  /** Play a loaded sound */
  play(id: SoundId): void {
    const sound = this.sounds.get(id);
    if (sound) sound.play();
  }

  /** Stop a playing sound */
  stop(id: SoundId): void {
    const sound = this.sounds.get(id);
    if (sound) sound.stop();
  }

  /** Mute/unmute all sounds */
  setMuted(muted: boolean): void {
    this._muted = muted;
    this.sounds.forEach((sound) => sound.volume(muted ? 0 : 1));
  }

  get muted(): boolean {
    return this._muted;
  }

  /** Dispose all sounds */
  dispose(): void {
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
  }
}

/** Singleton audio manager instance */
export const audioManager = new AudioManager();
