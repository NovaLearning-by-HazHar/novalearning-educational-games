#!/usr/bin/env python3
"""
NovaLearning Audio Pipeline - Synthetic UI Sound Generator
===========================================================
Generates child-friendly UI sounds programmatically using wave module.
No external dependencies or API keys needed.

Usage:
    python3 generate_ui_sounds.py

Output:
    public/audio/ui-sounds/{sound_id}.mp3
"""

import struct
import wave
import math
import os
import subprocess
from pathlib import Path

SAMPLE_RATE = 22050
SCRIPTS_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPTS_DIR.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "audio" / "ui-sounds"


def generate_tone(frequency, duration, volume=0.5, fade_in=0.01, fade_out=0.05):
    """Generate a sine wave tone."""
    num_samples = int(SAMPLE_RATE * duration)
    samples = []

    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Sine wave
        sample = math.sin(2 * math.pi * frequency * t) * volume

        # Fade in
        if t < fade_in:
            sample *= t / fade_in

        # Fade out
        remaining = duration - t
        if remaining < fade_out:
            sample *= remaining / fade_out

        samples.append(sample)

    return samples


def generate_chord(frequencies, duration, volume=0.3, fade_out=0.1):
    """Generate multiple tones layered together."""
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples

    for freq in frequencies:
        tone = generate_tone(freq, duration, volume / len(frequencies), fade_out=fade_out)
        for i in range(min(len(tone), num_samples)):
            samples[i] += tone[i]

    return samples


def save_wav(samples, filename):
    """Save samples as WAV file."""
    output_path = OUTPUT_DIR / f"{filename}.wav"

    with wave.open(str(output_path), "w") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)

        for sample in samples:
            # Clamp to [-1, 1]
            sample = max(-1.0, min(1.0, sample))
            packed = struct.pack("<h", int(sample * 32767))
            wav_file.writeframes(packed)

    return output_path


def convert_to_mp3(wav_path):
    """Convert WAV to MP3 using ffmpeg."""
    mp3_path = str(wav_path).replace(".wav", ".mp3")
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(wav_path), "-b:a", "64k", "-ar", "22050", mp3_path],
            capture_output=True,
            check=True,
        )
        os.remove(wav_path)
        size_kb = os.path.getsize(mp3_path) / 1024
        return mp3_path, size_kb
    except (subprocess.CalledProcessError, FileNotFoundError):
        size_kb = os.path.getsize(str(wav_path)) / 1024
        print(f"    ffmpeg not found, keeping WAV format ({size_kb:.1f}KB)")
        return str(wav_path), size_kb


# ============================================================
# SOUND DEFINITIONS
# ============================================================

def sound_ui_tap():
    """Soft tap/click sound."""
    samples = generate_tone(800, 0.05, volume=0.4, fade_out=0.03)
    # Add a subtle low thud
    thud = generate_tone(200, 0.03, volume=0.2, fade_out=0.02)
    for i in range(len(thud)):
        if i < len(samples):
            samples[i] += thud[i]
    return samples


def sound_ui_success():
    """Happy chime - 3 ascending notes."""
    all_samples = []
    notes = [523.25, 659.25, 783.99]  # C5, E5, G5 (major chord ascending)

    for i, freq in enumerate(notes):
        tone = generate_tone(freq, 0.15, volume=0.4, fade_out=0.08)
        # Add slight harmonic
        harmonic = generate_tone(freq * 2, 0.1, volume=0.1, fade_out=0.06)
        for j in range(len(harmonic)):
            if j < len(tone):
                tone[j] += harmonic[j]

        # Gap between notes
        gap = [0.0] * int(SAMPLE_RATE * 0.05)
        all_samples.extend(tone)
        all_samples.extend(gap)

    return all_samples


def sound_ui_gentle_error():
    """Soft double-note (not negative, just informative)."""
    note1 = generate_tone(440, 0.12, volume=0.3, fade_out=0.06)
    gap = [0.0] * int(SAMPLE_RATE * 0.06)
    note2 = generate_tone(392, 0.15, volume=0.25, fade_out=0.08)  # Slightly lower

    return note1 + gap + note2


def sound_ui_star_collect():
    """Sparkle/twinkle sound."""
    all_samples = []
    sparkle_freqs = [1200, 1600, 2000, 1800, 2400]

    for i, freq in enumerate(sparkle_freqs):
        tone = generate_tone(freq, 0.06, volume=0.25, fade_out=0.04)
        gap = [0.0] * int(SAMPLE_RATE * 0.02)
        all_samples.extend(tone)
        all_samples.extend(gap)

    return all_samples


def sound_ui_level_up():
    """Triumphant short fanfare."""
    all_samples = []
    # C major arpeggio ascending + final chord
    notes = [
        (523.25, 0.1),   # C5
        (659.25, 0.1),   # E5
        (783.99, 0.1),   # G5
        (1046.50, 0.25), # C6 (held longer)
    ]

    for freq, dur in notes:
        tone = generate_tone(freq, dur, volume=0.4, fade_out=dur * 0.4)
        harmonic = generate_tone(freq * 1.5, dur * 0.7, volume=0.15, fade_out=dur * 0.3)
        for j in range(len(harmonic)):
            if j < len(tone):
                tone[j] += harmonic[j]
        gap = [0.0] * int(SAMPLE_RATE * 0.03)
        all_samples.extend(tone)
        all_samples.extend(gap)

    # Final chord
    chord = generate_chord([523.25, 659.25, 783.99, 1046.50], 0.3, volume=0.35, fade_out=0.2)
    all_samples.extend(chord)

    return all_samples


def sound_ui_coin_drop():
    """Coin clink sound."""
    # High metallic hit
    samples = generate_tone(2500, 0.08, volume=0.4, fade_out=0.06)
    # Add a lower resonance
    resonance = generate_tone(1200, 0.12, volume=0.2, fade_out=0.1)
    for i in range(len(resonance)):
        if i < len(samples):
            samples[i] += resonance[i]
        else:
            samples.append(resonance[i])

    # Second lighter clink
    gap = [0.0] * int(SAMPLE_RATE * 0.05)
    clink2 = generate_tone(3000, 0.05, volume=0.25, fade_out=0.04)
    samples.extend(gap)
    samples.extend(clink2)

    return samples


def sound_ui_whoosh():
    """Gentle transition swoosh using noise-like frequencies."""
    duration = 0.25
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples

    # Sweep from low to high frequency
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        freq = 200 + progress * 1500  # Sweep 200Hz to 1700Hz
        volume = math.sin(math.pi * progress) * 0.3  # Volume envelope
        sample = math.sin(2 * math.pi * freq * t) * volume
        samples[i] = sample

    return samples


def sound_ui_pop():
    """Soft bubble pop."""
    # Quick frequency drop
    duration = 0.08
    num_samples = int(SAMPLE_RATE * duration)
    samples = []

    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        freq = 800 - progress * 500  # Drop from 800 to 300
        volume = (1 - progress) * 0.5  # Quick decay
        sample = math.sin(2 * math.pi * freq * t) * volume
        samples.append(sample)

    return samples


# ============================================================
# MAIN
# ============================================================

SOUNDS = {
    "ui_tap": sound_ui_tap,
    "ui_success": sound_ui_success,
    "ui_gentle_error": sound_ui_gentle_error,
    "ui_star_collect": sound_ui_star_collect,
    "ui_level_up": sound_ui_level_up,
    "ui_coin_drop": sound_ui_coin_drop,
    "ui_whoosh": sound_ui_whoosh,
    "ui_pop": sound_ui_pop,
}


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("NovaLearning Audio Pipeline - UI Sound Generator")
    print("=" * 60)

    total_size = 0

    for sound_id, generator_fn in SOUNDS.items():
        print(f"\nGenerating: {sound_id}")
        samples = generator_fn()
        wav_path = save_wav(samples, sound_id)
        final_path, size_kb = convert_to_mp3(wav_path)
        total_size += size_kb
        status = "OK" if size_kb <= 20 else "WARN"
        print(f"   [{status}] {os.path.basename(final_path)} ({size_kb:.1f}KB)")

    print("\n" + "=" * 60)
    print(f"Generated {len(SOUNDS)} UI sounds ({total_size:.1f}KB total)")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
