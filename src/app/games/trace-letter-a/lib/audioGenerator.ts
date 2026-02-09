/**
 * Web Audio API tone synthesis for Trace Letter A game.
 * Generates tracing feedback sounds, letter pronunciation,
 * and celebration audio — zero file downloads.
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

/** Soft continuous tone while tracing (gentle sine hum) */
export async function generateTracingTone(): Promise<Blob> {
  return generateTone({
    frequency: 440,
    duration: 0.3,
    type: 'sine',
    attack: 0.02,
    decay: 0.1,
    sustain: 0.4,
    release: 0.1,
    volume: 0.25,
  });
}

/** Stroke checkpoint ding — ascending per checkpoint */
export async function generateCheckpointTone(index: number): Promise<Blob> {
  const freq = 392 + index * 40; // G4 ascending
  return generateTone({
    frequency: freq,
    duration: 0.2,
    type: 'sine',
    attack: 0.005,
    decay: 0.1,
    sustain: 0.2,
    release: 0.08,
    volume: 0.4,
  });
}

/** Stroke complete chime — satisfying major chord arpeggio */
export async function generateStrokeComplete(): Promise<Blob> {
  const notes = [523.25, 659.26, 783.99]; // C5, E5, G5
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
    gain.gain.linearRampToValueAtTime(0.45, start + 0.005);
    gain.gain.linearRampToValueAtTime(0.1, start + noteDuration * 0.8);
    gain.gain.linearRampToValueAtTime(0, start + noteDuration + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration + 0.15);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/**
 * Letter "A" pronunciation placeholder.
 * Short vowel sound approximation via formant synthesis.
 * Real recording replaces this in polish phase.
 */
export async function generateLetterSound(): Promise<Blob> {
  const duration = 0.5;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  // Fundamental frequency ~120Hz (natural voice)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 120;

  // Formant filter for "ah" sound (~800Hz center)
  const formant = ctx.createBiquadFilter();
  formant.type = 'bandpass';
  formant.frequency.value = 800;
  formant.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.4, 0.03);
  gain.gain.setValueAtTime(0.4, duration * 0.6);
  gain.gain.linearRampToValueAtTime(0, duration);

  osc1.connect(formant);
  formant.connect(gain);
  gain.connect(ctx.destination);
  osc1.start(0);
  osc1.stop(duration);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Ascending celebration melody C5→E5→G5→C6 */
export async function generateCelebrationMelody(): Promise<Blob> {
  const notes = [523.25, 659.26, 783.99, 1046.5];
  const noteDuration = 0.25;
  const totalDuration = notes.length * noteDuration + 0.2;

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
    gain.gain.linearRampToValueAtTime(0, start + noteDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Gentle ambient nature loop (birdsong-like filtered noise, 3s) */
export async function generateAmbientNature(): Promise<Blob> {
  const duration = 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const noiseBuffer = ctx.createBuffer(1, SAMPLE_RATE * duration, SAMPLE_RATE);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  // Bandpass for soft nature ambience
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;

  const gain = ctx.createGain();
  gain.gain.value = 0.08;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}
