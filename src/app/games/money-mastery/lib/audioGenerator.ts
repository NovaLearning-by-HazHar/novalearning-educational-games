/**
 * Web Audio API tone synthesis for Money Mastery game.
 * Generates all game audio as in-memory WAV blobs — zero file downloads.
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

  const ctx = new OfflineAudioContext(
    1,
    Math.ceil(SAMPLE_RATE * duration),
    SAMPLE_RATE
  );
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

/** Water splash sound — frequency sweep with noise */
export async function generateWaterSplash(): Promise<Blob> {
  const duration = 0.25;
  const ctx = new OfflineAudioContext(
    1,
    Math.ceil(SAMPLE_RATE * duration),
    SAMPLE_RATE
  );

  // Create noise buffer for splash texture
  const noiseBuffer = ctx.createBuffer(1, SAMPLE_RATE * duration, SAMPLE_RATE);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, 0);
  gain.gain.exponentialRampToValueAtTime(0.01, duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(0);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Coin pop sound — rising tone with quick envelope */
export async function generateCoinPop(): Promise<Blob> {
  return generateTone({
    frequency: 880,
    duration: 0.2,
    type: 'sine',
    attack: 0.001,
    decay: 0.12,
    sustain: 0.0,
    release: 0.08,
    volume: 0.5,
  });
}

/** Garden complete jingle — ascending pentatonic C5→D5→E5→G5 */
export async function generateGardenComplete(): Promise<Blob> {
  const notes = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
  const noteDuration = 0.12;
  const totalDuration = notes.length * noteDuration;

  const ctx = new OfflineAudioContext(
    1,
    Math.ceil(SAMPLE_RATE * totalDuration),
    SAMPLE_RATE
  );

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * noteDuration;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
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

/** Purchase chime — pleasant confirmation tone */
export async function generatePurchaseChime(): Promise<Blob> {
  return generateTone({
    frequency: 660,
    duration: 0.3,
    type: 'triangle',
    attack: 0.01,
    decay: 0.15,
    sustain: 0.3,
    release: 0.1,
    volume: 0.5,
  });
}

/** Cash register cha-ching — two-tone bell */
export async function generateChaChing(): Promise<Blob> {
  const duration = 0.4;
  const ctx = new OfflineAudioContext(
    1,
    Math.ceil(SAMPLE_RATE * duration),
    SAMPLE_RATE
  );

  // First bell tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 1046.5; // C6

  gain1.gain.setValueAtTime(0, 0);
  gain1.gain.linearRampToValueAtTime(0.5, 0.01);
  gain1.gain.exponentialRampToValueAtTime(0.01, 0.25);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(0);
  osc1.stop(0.25);

  // Second bell tone (slightly delayed, lower pitch)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 880; // A5

  const start2 = 0.08;
  gain2.gain.setValueAtTime(0, start2);
  gain2.gain.linearRampToValueAtTime(0.5, start2 + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.01, start2 + 0.32);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(start2);
  osc2.stop(start2 + 0.32);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}