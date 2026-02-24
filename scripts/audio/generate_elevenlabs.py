#!/usr/bin/env python3
"""
NovaLearning Audio Pipeline - ElevenLabs Premium Generator
===========================================================
Generates premium "hero moment" audio using ElevenLabs API.
Use sparingly - these consume API credits.

Usage:
    export ELEVENLABS_API_KEY="your_key_here"
    python3 generate_elevenlabs.py
    python3 generate_elevenlabs.py --item narr_welcome
    python3 generate_elevenlabs.py --list-voices

Requirements:
    pip install elevenlabs

Output:
    public/audio/elevenlabs/narration/{id}_{language}.mp3
"""

import json
import os
import sys
import argparse
from pathlib import Path

try:
    from elevenlabs import ElevenLabs
except ImportError:
    print("Install elevenlabs: pip install elevenlabs")
    sys.exit(1)

SCRIPTS_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPTS_DIR.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "audio"

# Language code mapping
LANG_KEY = {"en-ZA": "en", "af-ZA": "af", "zu-ZA": "zu"}

# ElevenLabs recommended voices for children's content
RECOMMENDED_VOICES = {
    "narrator": {
        "voice_id": None,
        "name": "Rachel",
        "description": "Main narrator voice for hero moments",
    },
    "thandi": {
        "voice_id": None,
        "name": "Thandi",
        "description": "Main character - warm, encouraging young female",
    },
}


def load_manifest():
    manifest_path = SCRIPTS_DIR / "config" / "audio_manifest.json"
    with open(manifest_path, "r") as f:
        return json.load(f)


def get_client():
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        print("Set ELEVENLABS_API_KEY environment variable")
        print("   export ELEVENLABS_API_KEY='your_key_here'")
        sys.exit(1)
    return ElevenLabs(api_key=api_key)


def list_voices(client):
    """List all available ElevenLabs voices."""
    print("\nAvailable ElevenLabs Voices:")
    print("=" * 70)

    response = client.voices.get_all()
    for voice in response.voices:
        labels = voice.labels or {}
        accent = labels.get("accent", "")
        age = labels.get("age", "")
        gender = labels.get("gender", "")
        use_case = labels.get("use_case", "")

        print(f"  {voice.voice_id}  {voice.name:20s} {gender:8s} {accent:15s} {age:12s} {use_case}")

    print(f"\nTotal: {len(response.voices)} voices")
    print("\nRecommended for children's educational content:")
    print("   - Rachel (clear, warm female narrator)")
    print("   - Elli (young female, encouraging)")
    print("   - Or clone a custom voice for Thandi character")
    print("\nFor multilingual (en/af/zu), use model: eleven_multilingual_v2")


def generate_audio(client, text: str, voice_id: str, output_path: str, model: str = "eleven_multilingual_v2"):
    """Generate a single audio file using ElevenLabs."""

    audio_generator = client.text_to_speech.convert(
        voice_id=voice_id,
        text=text,
        model_id=model,
        output_format="mp3_22050_32",
        voice_settings={
            "stability": 0.65,
            "similarity_boost": 0.75,
            "style": 0.35,
            "use_speaker_boost": True,
        },
    )

    # Collect audio bytes
    audio_bytes = b""
    for chunk in audio_generator:
        audio_bytes += chunk

    with open(output_path, "wb") as f:
        f.write(audio_bytes)

    size_kb = len(audio_bytes) / 1024
    return size_kb


def estimate_cost(manifest: dict):
    """Estimate ElevenLabs API cost for all narration items."""
    narration = manifest["categories"].get("narration", {})
    items = narration.get("items", [])

    total_chars = 0
    for item in items:
        for lang_key in ["en", "af", "zu"]:
            text = item.get(lang_key, "")
            total_chars += len(text)

    print(f"\nCost Estimate:")
    print(f"   Total characters: {total_chars:,}")
    print(f"   Narration items:  {len(items)} x 3 languages = {len(items) * 3} clips")
    print(f"   Starter plan ($5/mo): 30,000 chars -> {'Within limit' if total_chars < 30000 else 'Exceeds limit'}")
    print(f"   Free tier:            10,000 chars -> {'Within limit' if total_chars < 10000 else 'Exceeds limit'}")
    return total_chars


def main():
    parser = argparse.ArgumentParser(description="NovaLearning ElevenLabs Premium Generator")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--estimate", action="store_true", help="Estimate cost without generating")
    parser.add_argument("--item", "-i", help="Generate specific item ID only")
    parser.add_argument("--voice-id", "-v", help="Override voice ID")
    parser.add_argument("--language", "-l", help="Generate specific language only (en-ZA, af-ZA, zu-ZA)")
    parser.add_argument("--model", "-m", default="eleven_multilingual_v2", help="ElevenLabs model ID")
    args = parser.parse_args()

    manifest = load_manifest()

    if args.estimate:
        estimate_cost(manifest)
        return

    client = get_client()

    if args.list_voices:
        list_voices(client)
        return

    # Get voice ID
    voice_id = args.voice_id
    if not voice_id:
        el_config = manifest.get("voices", {}).get("elevenlabs", {}).get("narrator", {})
        voice_id = el_config.get("voice_id")
        if not voice_id or voice_id == "YOUR_VOICE_ID_HERE":
            print("No voice ID specified.")
            print("   Run: python3 generate_elevenlabs.py --list-voices")
            print("   Then: python3 generate_elevenlabs.py --voice-id <id>")
            return

    narration = manifest["categories"].get("narration", {})
    items = narration.get("items", [])
    languages = [args.language] if args.language else ["en-ZA", "af-ZA", "zu-ZA"]

    output_base = OUTPUT_DIR / "elevenlabs" / "narration"
    output_base.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("NovaLearning Audio Pipeline - ElevenLabs Premium")
    print("=" * 60)
    print(f"Voice ID:   {voice_id}")
    print(f"Model:      {args.model}")
    print(f"Languages:  {', '.join(languages)}")
    print(f"Items:      {len(items) if not args.item else 1}")
    print("=" * 60)

    total_chars = 0
    total_files = 0
    total_size = 0

    for item in items:
        if args.item and item["id"] != args.item:
            continue

        for lang in languages:
            lang_key = LANG_KEY.get(lang)
            if not lang_key or lang_key not in item:
                continue

            text = item[lang_key]
            filename = f"{item['id']}_{lang}.mp3"
            output_path = output_base / filename

            print(f"\nGenerating: {filename}")
            print(f"   Text: {text[:80]}{'...' if len(text) > 80 else ''}")

            try:
                size_kb = generate_audio(
                    client=client,
                    text=text,
                    voice_id=voice_id,
                    output_path=str(output_path),
                    model=args.model,
                )
                total_chars += len(text)
                total_files += 1
                total_size += size_kb
                print(f"   [OK] {size_kb:.1f}KB | Characters used: {len(text)}")
            except Exception as e:
                print(f"   [FAIL] Error: {e}")

    print("\n" + "=" * 60)
    print(f"Generated: {total_files} files ({total_size:.1f}KB)")
    print(f"Characters used: {total_chars:,}")
    print(f"Output: {output_base}")
    print("=" * 60)


if __name__ == "__main__":
    main()
