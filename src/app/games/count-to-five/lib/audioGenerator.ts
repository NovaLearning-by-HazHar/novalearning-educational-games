/**
 * Web Audio API placeholder tone synthesis.
 * Generates all game audio as in-memory WAV blobs — zero file downloads.
 * These are placeholder tones; real recordings replace them in polish phase.
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

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
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
    frequency, duration, type, attack, decay, sustain, release,
    volume = 0.5,
  } = config;

  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  // ADSR envelope
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

/** Pentatonic scale: C4, D4, E4, G4, A4 */
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0];

/** Marimba-like tone for each mango (0-4) */
export async function generateMarimbaTone(noteIndex: number): Promise<Blob> {
  const freq = PENTATONIC[Math.min(noteIndex, PENTATONIC.length - 1)];
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

/** Satisfying pluck sound effect on pick */
export async function generatePickSfx(): Promise<Blob> {
  return generateTone({
    frequency: 800,
    duration: 0.15,
    type: 'triangle',
    attack: 0.001,
    decay: 0.1,
    sustain: 0.0,
    release: 0.04,
    volume: 0.4,
  });
}

/** Counting beep per number (1-5) — placeholder for voice recordings */
export async function generateCountingBeep(count: number): Promise<Blob> {
  const freq = 300 + count * 50;
  return generateTone({
    frequency: freq,
    duration: 0.25,
    type: 'sine',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.1,
    volume: 0.5,
  });
}

/** Ascending celebration melody C4→E4→G4→A4→C5 */
export async function generateCelebrationMelody(): Promise<Blob> {
  const notes = [261.63, 329.63, 392.0, 440.0, 523.25];
  const noteDuration = 0.3;
  const totalDuration = notes.length * noteDuration;

  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * noteDuration;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.5, start + 0.01);
    gain.gain.linearRampToValueAtTime(0.1, start + noteDuration * 0.8);
    gain.gain.linearRampToValueAtTime(0, start + noteDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Brown noise ambient wind (3 seconds) */
export async function generateAmbientWind(): Promise<Blob> {
  const duration = 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  // Create white noise buffer
  const noiseBuffer = ctx.createBuffer(1, SAMPLE_RATE * duration, SAMPLE_RATE);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  // Lowpass filter to make brown-ish noise
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;

  const gain = ctx.createGain();
  gain.gain.value = 0.15;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}
