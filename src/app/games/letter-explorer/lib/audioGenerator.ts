/**
 * Letter Explorer — Web Audio API sound synthesis.
 * Generates all game audio as in-memory WAV blobs — zero file downloads.
 * Includes marimba tones, animal sounds, chimes, and ambient savanna.
 */

const SAMPLE_RATE = 22050;

// ─── WAV Encoding ────────────────────────────────────────────────────

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

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

// ─── Core Tone Generator ─────────────────────────────────────────────

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
  const { frequency, duration, type, attack, decay, sustain, release, volume = 0.5 } = config;
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

// ─── Marimba Tones (A-F, ascending pentatonic + extra) ───────────────

const LETTER_NOTES: Record<string, number> = {
  A: 261.63, // C4
  B: 293.66, // D4
  C: 329.63, // E4
  D: 392.0, // G4
  E: 440.0, // A4
  F: 523.25, // C5
};

/** Marimba-like tone for each letter discovery */
export async function generateMarimbaTone(letter: string): Promise<Blob> {
  const freq = LETTER_NOTES[letter] ?? 261.63;
  return generateTone({
    frequency: freq,
    duration: 0.6,
    type: 'sine',
    attack: 0.005,
    decay: 0.3,
    sustain: 0.1,
    release: 0.2,
    volume: 0.6,
  });
}

// ─── Animal Sounds (synthesized approximations) ──────────────────────

/** Aardvark — low snuffle (filtered noise burst) */
export async function generateAardvarkSound(): Promise<Blob> {
  const duration = 0.4;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const noiseBuffer = ctx.createBuffer(1, SAMPLE_RATE * duration, SAMPLE_RATE);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.4, 0.05);
  gain.gain.linearRampToValueAtTime(0.1, 0.2);
  gain.gain.linearRampToValueAtTime(0.35, 0.25);
  gain.gain.linearRampToValueAtTime(0, duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Baboon — bark (quick frequency sweep) */
export async function generateBaboonSound(): Promise<Blob> {
  const duration = 0.3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, 0);
  osc.frequency.linearRampToValueAtTime(250, 0.1);
  osc.frequency.linearRampToValueAtTime(350, 0.15);
  osc.frequency.linearRampToValueAtTime(200, duration);

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.5, 0.02);
  gain.gain.linearRampToValueAtTime(0.3, 0.1);
  gain.gain.linearRampToValueAtTime(0.4, 0.15);
  gain.gain.linearRampToValueAtTime(0, duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Cheetah — chirp (high short tone) */
export async function generateCheetahSound(): Promise<Blob> {
  return generateTone({
    frequency: 900,
    duration: 0.2,
    type: 'sine',
    attack: 0.005,
    decay: 0.08,
    sustain: 0.2,
    release: 0.08,
    volume: 0.4,
  });
}

/** Dung Beetle — buzz (sawtooth + tremolo) */
export async function generateDungBeetleSound(): Promise<Blob> {
  const duration = 0.5;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const tremolo = ctx.createOscillator();
  const tremoloGain = ctx.createGain();
  const mainGain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 150;

  tremolo.type = 'sine';
  tremolo.frequency.value = 30;
  tremoloGain.gain.value = 0.15;

  mainGain.gain.setValueAtTime(0, 0);
  mainGain.gain.linearRampToValueAtTime(0.35, 0.03);
  mainGain.gain.setValueAtTime(0.35, duration - 0.1);
  mainGain.gain.linearRampToValueAtTime(0, duration);

  tremolo.connect(tremoloGain);
  tremoloGain.connect(mainGain.gain);
  osc.connect(mainGain);
  mainGain.connect(ctx.destination);

  osc.start(0);
  tremolo.start(0);
  osc.stop(duration);
  tremolo.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Elephant — trumpet (frequency sweep up) */
export async function generateElephantSound(): Promise<Blob> {
  const duration = 0.6;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, 0);
  osc.frequency.linearRampToValueAtTime(500, 0.2);
  osc.frequency.setValueAtTime(500, 0.3);
  osc.frequency.linearRampToValueAtTime(250, duration);

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.5, 0.05);
  gain.gain.setValueAtTime(0.5, 0.3);
  gain.gain.linearRampToValueAtTime(0, duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Flamingo — honk (nasal tone) */
export async function generateFlamingoSound(): Promise<Blob> {
  const duration = 0.35;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.value = 500;
  osc2.type = 'sine';
  osc2.frequency.value = 502; // slight detuning for nasal quality

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.3, 0.02);
  gain.gain.setValueAtTime(0.3, duration - 0.1);
  gain.gain.linearRampToValueAtTime(0, duration);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc2.start(0);
  osc.stop(duration);
  osc2.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

// ─── UI Sounds ───────────────────────────────────────────────────────

/** Bright ascending 3-note discovery chime */
export async function generateDiscoverChime(): Promise<Blob> {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const noteDuration = 0.15;
  const totalDuration = notes.length * noteDuration + 0.2;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * noteDuration;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.45, start + 0.01);
    gain.gain.linearRampToValueAtTime(0.1, start + noteDuration * 0.7);
    gain.gain.linearRampToValueAtTime(0, start + noteDuration + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration + 0.15);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Happy two-tone match correct chime */
export async function generateMatchCorrect(): Promise<Blob> {
  const totalDuration = 0.5;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);

  const notes = [523.25, 783.99]; // C5, G5
  const times = [0, 0.12];

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    gain.gain.setValueAtTime(0, times[i]);
    gain.gain.linearRampToValueAtTime(0.5, times[i] + 0.01);
    gain.gain.linearRampToValueAtTime(0, times[i] + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(times[i]);
    osc.stop(times[i] + 0.35);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Gentle descending nudge for wrong match ("Let's try again") */
export async function generateMatchTryAgain(): Promise<Blob> {
  const totalDuration = 0.4;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, 0);
  osc.frequency.linearRampToValueAtTime(350, 0.3);

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.3, 0.02);
  gain.gain.setValueAtTime(0.3, 0.2);
  gain.gain.linearRampToValueAtTime(0, totalDuration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(totalDuration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** 6-note ascending celebration melody (C4→E4→G4→A4→B4→C5) */
export async function generateCelebrationMelody(): Promise<Blob> {
  const notes = [261.63, 329.63, 392.0, 440.0, 493.88, 523.25];
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
    gain.gain.linearRampToValueAtTime(0.5, start + 0.01);
    gain.gain.linearRampToValueAtTime(0.15, start + noteDuration * 0.8);
    gain.gain.linearRampToValueAtTime(0, start + noteDuration + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration + 0.2);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Ambient savanna — brown noise with filtered chirps (3 seconds) */
export async function generateAmbientSavanna(): Promise<Blob> {
  const duration = 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  // Brown noise base
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

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);

  // Add sparse chirps (bird-like)
  const chirpTimes = [0.5, 1.3, 2.1, 2.7];
  for (const t of chirpTimes) {
    const chirp = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirp.type = 'sine';
    chirp.frequency.setValueAtTime(2000 + Math.random() * 1000, t);
    chirp.frequency.linearRampToValueAtTime(1500 + Math.random() * 500, t + 0.08);

    chirpGain.gain.setValueAtTime(0, t);
    chirpGain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    chirpGain.gain.linearRampToValueAtTime(0, t + 0.1);

    chirp.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirp.start(t);
    chirp.stop(t + 0.1);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}
