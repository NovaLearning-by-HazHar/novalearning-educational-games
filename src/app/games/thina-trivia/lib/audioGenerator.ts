/**
 * Thina Trivia — Audio synthesis. Quiz sounds + celebration.
 * Zero file downloads — all generated in-memory via OfflineAudioContext.
 */

const SAMPLE_RATE = 22050;

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

/** Correct answer ding — bright ascending two-note */
export async function generateCorrectDing(): Promise<Blob> {
  const duration = 0.4;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const notes = [523.25, 783.99]; // C5, G5
  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.45, start + 0.01);
    gain.gain.linearRampToValueAtTime(0.05, start + 0.18);
    gain.gain.linearRampToValueAtTime(0, start + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Gentle nudge for wrong answer — soft low tone, not alarming */
export async function generateGentleNudge(): Promise<Blob> {
  const duration = 0.3;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 330; // E4 — gentle

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.25, 0.01);
  gain.gain.linearRampToValueAtTime(0.1, 0.15);
  gain.gain.linearRampToValueAtTime(0, 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(0.3);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Star earned — sparkle chime, ascending arpeggio */
export async function generateStarEarned(): Promise<Blob> {
  const duration = 0.6;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const notes = [659.25, 783.99, 987.77]; // E5, G5, B5
  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[i];

    const start = i * 0.13;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
    gain.gain.linearRampToValueAtTime(0.08, start + 0.18);
    gain.gain.linearRampToValueAtTime(0, start + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  }

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Celebration melody — joyful ascending scale */
export async function generateCelebrationMelody(): Promise<Blob> {
  const notes = [261.63, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99];
  const noteDuration = 0.22;
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

/** Button tap — short click */
export async function generateButtonTap(): Promise<Blob> {
  const duration = 0.08;
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * duration), SAMPLE_RATE);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 600;

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.3, 0.001);
  gain.gain.linearRampToValueAtTime(0, 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(0.08);

  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}
