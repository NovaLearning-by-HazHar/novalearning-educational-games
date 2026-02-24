#!/usr/bin/env python3
"""
NovaLearning Audio Pipeline - Edge TTS Bulk Generator
=====================================================
Generates all bulk audio (phonics, encouragement, instructions) using
Microsoft Edge TTS (completely free, unlimited).

Usage:
    python3 generate_edge_tts.py
    python3 generate_edge_tts.py --category phonics
    python3 generate_edge_tts.py --language en-ZA
    python3 generate_edge_tts.py --category encouragement --language zu-ZA

Requirements:
    pip install edge-tts

Output:
    public/audio/edge-tts/{category}/{id}_{language}.mp3
"""

import asyncio
import json
import os
import sys
import argparse
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Install edge-tts: pip install edge-tts")
    sys.exit(1)

SCRIPTS_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPTS_DIR.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "audio"

# Voice mapping for SA languages
VOICES = {
    "en-ZA": {"female": "en-ZA-LeahNeural", "male": "en-ZA-LukeNeural"},
    "af-ZA": {"female": "af-ZA-AdriNeural", "male": "af-ZA-WillemNeural"},
    "zu-ZA": {"female": "zu-ZA-ThandoNeural", "male": "zu-ZA-ThembaNeural"},
}

# Language code to manifest key mapping
LANG_KEY = {
    "en-ZA": "en",
    "af-ZA": "af",
    "zu-ZA": "zu",
}

# SSML rate/pitch adjustments per category
CATEGORY_PROSODY = {
    "phonics": {"rate": "-10%", "pitch": "+5Hz"},
    "encouragement": {"rate": "+5%", "pitch": "+0Hz"},
    "instructions": {"rate": "-15%", "pitch": "+0Hz"},
}


def load_manifest():
    manifest_path = SCRIPTS_DIR / "config" / "audio_manifest.json"
    with open(manifest_path, "r") as f:
        return json.load(f)


async def generate_audio(text: str, voice: str, output_path: str, rate: str = "+0%", pitch: str = "+0Hz"):
    """Generate a single audio file using Edge TTS."""
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
    )
    await communicate.save(output_path)

    # Check file size
    size_kb = os.path.getsize(output_path) / 1024
    if size_kb > 50:
        print(f"  WARNING: {output_path} is {size_kb:.1f}KB (limit: 50KB)")
    return size_kb


async def generate_category(manifest: dict, category: str, languages: list[str]):
    """Generate all audio for a category across specified languages."""
    cat_data = manifest["categories"].get(category)
    if not cat_data:
        print(f"Category '{category}' not found")
        return

    if cat_data["tier"] != "edge_tts":
        print(f"Skipping '{category}' - tier is '{cat_data['tier']}' (not edge_tts)")
        return

    voice_pref = cat_data.get("voice_preference", "female")
    prosody = CATEGORY_PROSODY.get(category, {"rate": "+0%", "pitch": "+0Hz"})

    output_base = OUTPUT_DIR / "edge-tts" / category
    output_base.mkdir(parents=True, exist_ok=True)

    total_generated = 0
    total_size_kb = 0

    for item in cat_data["items"]:
        item_id = item["id"]

        for lang in languages:
            lang_key = LANG_KEY.get(lang)
            if not lang_key or lang_key not in item:
                continue

            text = item[lang_key]
            voice = VOICES[lang][voice_pref]
            filename = f"{item_id}_{lang}.mp3"
            output_path = output_base / filename

            try:
                size_kb = await generate_audio(
                    text=text,
                    voice=voice,
                    output_path=str(output_path),
                    rate=prosody["rate"],
                    pitch=prosody["pitch"],
                )
                total_generated += 1
                total_size_kb += size_kb
                status = "OK" if size_kb <= 50 else "WARN"
                print(f"  [{status}] {filename} ({size_kb:.1f}KB)")
            except Exception as e:
                print(f"  [FAIL] {filename} - Error: {e}")

    print(f"\n  {category}: {total_generated} files, {total_size_kb:.1f}KB total")
    return total_generated, total_size_kb


async def main():
    parser = argparse.ArgumentParser(description="NovaLearning Edge TTS Audio Generator")
    parser.add_argument("--category", "-c", help="Generate specific category only")
    parser.add_argument("--language", "-l", help="Generate specific language only (en-ZA, af-ZA, zu-ZA)")
    args = parser.parse_args()

    manifest = load_manifest()

    # Determine categories to process
    edge_categories = [
        name for name, data in manifest["categories"].items()
        if data["tier"] == "edge_tts"
    ]

    if args.category:
        if args.category in edge_categories:
            categories = [args.category]
        else:
            print(f"'{args.category}' is not an edge_tts category. Available: {edge_categories}")
            return
    else:
        categories = edge_categories

    # Determine languages
    languages = [args.language] if args.language else list(VOICES.keys())

    print("=" * 60)
    print("NovaLearning Audio Pipeline - Edge TTS Generator")
    print("=" * 60)
    print(f"Categories: {', '.join(categories)}")
    print(f"Languages:  {', '.join(languages)}")
    print(f"Voices:     {', '.join(VOICES[l]['female'] for l in languages)}")
    print(f"Output:     {OUTPUT_DIR / 'edge-tts'}")
    print("=" * 60)

    grand_total_files = 0
    grand_total_size = 0

    for category in categories:
        print(f"\nGenerating: {category.upper()}")
        print("-" * 40)
        result = await generate_category(manifest, category, languages)
        if result:
            grand_total_files += result[0]
            grand_total_size += result[1]

    print("\n" + "=" * 60)
    print(f"COMPLETE: {grand_total_files} audio files ({grand_total_size:.1f}KB)")
    print(f"Output: {OUTPUT_DIR / 'edge-tts'}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
