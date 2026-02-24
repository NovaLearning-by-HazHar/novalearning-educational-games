/**
 * Letter Explorer — Web Audio API synthesis.
 * Generates all game audio as in-memory WAV blobs — zero file downloads.
 * Animal tones, letter announcements, match feedback, celebration, ambient.
 */

const SAMPLE_RATE = 22050;

/** Encode an AudioBuffer as a 16-bit PCM WAV blob */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = 1;
  const length = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);

  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/** Core tone generator with ADSR envelope */
async function generateTone(config: {
  frequency: number;
  duration: number;
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  volume?: number;
}): Promise<Blob> {
  const {
    frequency,
    duration,
    type,
    attack,
    decay,
    sustain,
    release,
    volume = 0.5,
  } = config;

  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  const now = 0;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
  gain.gain.setValueAtTime(volume * sustain, duration - release);
  gain.gain.linearRampToValueAtTime(0, duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

// ─── Animal Tones ──────────────────────────────────────────────────
// Each animal gets a unique pitch/timbre combination

/** Frequencies loosely mapped to animal character */
const ANIMAL_CONFIGS: { frequency: number; type: OscillatorType; duration: number }[] = [
  { frequency: 220, type: 'triangle', duration: 0.5 },   // Aardvark — deep, gentle
  { frequency: 330, type: 'square', duration: 0.4 },      // Baboon — bright, chattery
  { frequency: 440, type: 'sawtooth', duration: 0.35 },   // Cheetah — sharp, fast
  { frequency: 165, type: 'sine', duration: 0.6 },        // Dung Beetle — low hum
  { frequency: 130, type: 'triangle', duration: 0.7 },    // Elephant — deep rumble
  { frequency: 523, type: 'sine', duration: 0.45 },       // Flamingo — high, airy
];

/** Generate a unique animal-themed tone by index (0-5) */
export async function generateAnimalTone(index: number): Promise<Blob> {
  const cfg = ANIMAL_CONFIGS[Math.min(index, ANIMAL_CONFIGS.length - 1)];
  return generateTone({
    frequency: cfg.frequency,
    duration: cfg.duration,
    type: cfg.type,
    attack: 0.01,
    decay: 0.15,
    sustain: 0.3,
    release: 0.15,
    volume: 0.5,
  });
}

// ─── Letter Announcement ──────────────────────────────────────────
// Short ascending chime when a letter is revealed

const LETTER_FREQS = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0]; // C5-A5

/** Generate letter announcement tone by letter index (0-5 = A-F) */
export async function generateLetterAnnounce(letterIndex: number): Promise<Blob> {
  const freq = LETTER_FREQS[Math.min(letterIndex, LETTER_FREQS.length - 1)];
  return generateTone({
    frequency: freq,
    duration: 0.35,
    type: 'sine',
    attack: 0.005,
    decay: 0.15,
    sustain: 0.2,
    release: 0.1,
    volume: 0.55,
  });
}

// ─── Match Feedback ────────────────────────────────────────────────

/** Bright ascending two-note chime for correct match */
export async function generateMatchCorrect(): Promise<Blob> {
  const duration = 0.5;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  // Note 1: C5
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 523.25;
  gain1.gain.setValueAtTime(0, 0);
  gain1.gain.linearRampToValueAtTime(0.5, 0.01);
  gain1.gain.linearRampToValueAtTime(0, 0.25);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(0);
  osc1.stop(0.25);

  // Note 2: E5
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 659.25;
  gain2.gain.setValueAtTime(0, 0.15);
  gain2.gain.linearRampToValueAtTime(0.5, 0.16);
  gain2.gain.linearRampToValueAtTime(0, 0.45);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(0.15);
  osc2.stop(0.45);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Gentle low wobble for wrong match — encouraging, not punitive */
export async function generateMatchWrong(): Promise<Blob> {
  const duration = 0.4;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 250;
  // Gentle vibrato
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 6;
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  lfo.start(0);
  lfo.stop(duration);

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.3, 0.02);
  gain.gain.linearRampToValueAtTime(0, duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

// ─── Celebration ──────────────────────────────────────────────────

/** Ascending marimba celebration melody: C4 D4 E4 G4 A4 C5 */
export async function generateCelebrationMelody(): Promise<Blob> {
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const noteDuration = 0.28;
  const totalDuration = notes.length * noteDuration + 0.3;

  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * noteDuration;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.5, start + 0.008);
    gain.gain.linearRampToValueAtTime(0.1, start + noteDuration * 0.7);
    gain.gain.linearRampToValueAtTime(0, start + noteDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

// ─── Ambient Savanna ──────────────────────────────────────────────

/** Light wind + distant bird chirp ambience (3 seconds, loopable) */
export async function generateSavannaAmbient(): Promise<Blob> {
  const duration = 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  // Brown-ish wind noise
  const noiseBuffer = ctx.createBuffer(1, SAMPLE_RATE * duration, SAMPLE_RATE);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.1;

  source.connect(filter);
  filter.connect(windGain);
  windGain.connect(ctx.destination);
  source.start(0);

  // Distant bird chirps (short high sine bursts at random intervals)
  const chirpTimes = [0.4, 1.1, 1.8, 2.5];
  for (const t of chirpTimes) {
    const chirpOsc = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirpOsc.type = 'sine';
    chirpOsc.frequency.value = 2200 + Math.random() * 800;

    chirpGain.gain.setValueAtTime(0, t);
    chirpGain.gain.linearRampToValueAtTime(0.12, t + 0.01);
    chirpGain.gain.linearRampToValueAtTime(0, t + 0.08);

    chirpOsc.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirpOsc.start(t);
    chirpOsc.stop(t + 0.08);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}
