/**
 * Audio Registry — All game sounds mapped to files
 * 
 * Files can be missing — audioManager.load() will fail silently for missing files.
 * This lets us wire all hooks now and drop in real audio later.
 * 
 * Convention:
 *   assets/audio/letters/  → letter pronunciations
 *   assets/audio/sfx/      → UI and feedback sounds
 *   assets/audio/music/    → background music (optional)
 */

const AUDIO_BASE = 'assets/audio';

export const AUDIO_KEYS = {
  // === Letter pronunciations (English) ===
  'letter-a': `${AUDIO_BASE}/letters/letter-a.mp3`,
  'letter-b': `${AUDIO_BASE}/letters/letter-b.mp3`,
  'letter-c': `${AUDIO_BASE}/letters/letter-c.mp3`,
  'letter-d': `${AUDIO_BASE}/letters/letter-d.mp3`,
  'letter-e': `${AUDIO_BASE}/letters/letter-e.mp3`,
  'letter-f': `${AUDIO_BASE}/letters/letter-f.mp3`,

  // === Feedback SFX ===
  'feedback-correct': `${AUDIO_BASE}/sfx/correct.mp3`,
  'feedback-wrong':   `${AUDIO_BASE}/sfx/try-again.mp3`,
  'feedback-star':    `${AUDIO_BASE}/sfx/star-earn.mp3`,
  'feedback-complete': `${AUDIO_BASE}/sfx/level-complete.mp3`,

  // === UI SFX ===
  'ui-tap':    `${AUDIO_BASE}/sfx/tap.mp3`,
  'ui-whoosh': `${AUDIO_BASE}/sfx/whoosh.mp3`,

  // === Music (optional) ===
  'music-menu': `${AUDIO_BASE}/music/menu.mp3`,
  'music-game': `${AUDIO_BASE}/music/game.mp3`,
};

/**
 * Get audio keys needed for a specific letter game session
 */
export function getLetterAudioKeys(letter) {
  const l = letter.toLowerCase();
  return [
    `letter-${l}`,
    'feedback-correct',
    'feedback-wrong',
    'feedback-star',
    'feedback-complete',
    'ui-tap',
  ];
}

/**
 * Get all audio keys for preloading
 */
export function getAllAudioKeys() {
  return Object.keys(AUDIO_KEYS);
}
