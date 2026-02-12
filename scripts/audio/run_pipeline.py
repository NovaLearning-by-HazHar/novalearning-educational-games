#!/usr/bin/env python3
"""
NovaLearning Audio Pipeline - Master Orchestrator
===================================================
Runs the complete audio generation pipeline:
1. Edge TTS (bulk: phonics, encouragement, instructions)
2. ElevenLabs (premium: narration hero moments)
3. Synthetic UI sounds

Usage:
    python3 run_pipeline.py              # Full pipeline (Edge TTS + UI sounds)
    python3 run_pipeline.py --all        # Include ElevenLabs (needs API key)
    python3 run_pipeline.py --stats      # Show stats only
    python3 run_pipeline.py --map        # Generate audio_map.json only

Requirements:
    pip install edge-tts elevenlabs
"""

import subprocess
import sys
import os
import json
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPTS_DIR.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "audio"


def run_script(script_name, args=None):
    """Run a pipeline script."""
    script_path = SCRIPTS_DIR / script_name
    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)

    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0


def show_stats():
    """Show output directory stats."""
    print("\nAudio Asset Statistics")
    print("=" * 50)

    total_files = 0
    total_size = 0

    for root, dirs, files in os.walk(OUTPUT_DIR):
        for f in files:
            if f.endswith((".mp3", ".wav", ".webm")):
                filepath = os.path.join(root, f)
                size = os.path.getsize(filepath) / 1024
                total_files += 1
                total_size += size

    # Breakdown by directory
    for subdir in sorted(OUTPUT_DIR.iterdir()):
        if subdir.is_dir():
            dir_files = 0
            dir_size = 0
            for root, dirs, files in os.walk(subdir):
                for f in files:
                    if f.endswith((".mp3", ".wav", ".webm")):
                        dir_files += 1
                        dir_size += os.path.getsize(os.path.join(root, f)) / 1024

            if dir_files > 0:
                print(f"  {subdir.name:20s} {dir_files:4d} files  {dir_size:8.1f}KB")

    print("-" * 50)
    print(f"  {'TOTAL':23s} {total_files:4d} files  {total_size:8.1f}KB")

    # Check against game budget
    budget_kb = 1024  # 1MB total asset budget
    print(f"\n  Game Asset Budget: {budget_kb}KB")
    print(f"  Audio Usage:      {total_size:.0f}KB ({total_size/budget_kb*100:.1f}%)")

    if total_size < budget_kb * 0.3:
        print("  Well within budget (< 30% of total assets)")
    elif total_size < budget_kb * 0.5:
        print("  Moderate usage (< 50% of total assets)")
    else:
        print("  Heavy usage - consider trimming audio files")


def generate_audio_map():
    """Generate a JSON map of all audio assets for the game to import."""
    audio_map = {}

    for root, dirs, files in os.walk(OUTPUT_DIR):
        for f in sorted(files):
            if not f.endswith((".mp3", ".wav")):
                continue

            filepath = os.path.join(root, f)
            rel_path = os.path.relpath(filepath, OUTPUT_DIR)

            # Parse filename: {id}_{lang}.mp3 or {id}.mp3
            name = f.rsplit(".", 1)[0]
            parts = name.rsplit("_", 1)

            if len(parts) == 2 and parts[1] in ["en-ZA", "af-ZA", "zu-ZA"]:
                audio_id = parts[0]
                lang = parts[1]
            else:
                audio_id = name
                lang = "all"

            if audio_id not in audio_map:
                audio_map[audio_id] = {}

            audio_map[audio_id][lang] = {
                "path": rel_path.replace("\\", "/"),
                "size_kb": round(os.path.getsize(filepath) / 1024, 1),
            }

    # Save audio map into the public/audio/ directory
    map_path = OUTPUT_DIR / "audio_map.json"
    with open(map_path, "w") as f:
        json.dump(audio_map, f, indent=2)

    print(f"\nAudio map generated: {map_path}")
    print(f"   {len(audio_map)} unique audio IDs")
    return audio_map


def main():
    import argparse
    parser = argparse.ArgumentParser(description="NovaLearning Audio Pipeline")
    parser.add_argument("--all", action="store_true", help="Include ElevenLabs generation")
    parser.add_argument("--stats", action="store_true", help="Show stats only")
    parser.add_argument("--map", action="store_true", help="Generate audio map only")
    args = parser.parse_args()

    if args.stats:
        show_stats()
        return

    if args.map:
        generate_audio_map()
        return

    print("=" * 60)
    print("NovaLearning Audio Pipeline - Full Run")
    print("=" * 60)

    # Step 1: Edge TTS (bulk)
    print("\n" + "=" * 60)
    print("STEP 1/3: Edge TTS Bulk Generation")
    print("=" * 60)
    success = run_script("generate_edge_tts.py")
    if not success:
        print("Edge TTS had errors, continuing...")

    # Step 2: UI Sounds (synthetic)
    print("\n" + "=" * 60)
    print("STEP 2/3: Synthetic UI Sounds")
    print("=" * 60)
    run_script("generate_ui_sounds.py")

    # Step 3: ElevenLabs (premium, optional)
    if args.all:
        if os.environ.get("ELEVENLABS_API_KEY"):
            print("\n" + "=" * 60)
            print("STEP 3/3: ElevenLabs Premium Generation")
            print("=" * 60)
            run_script("generate_elevenlabs.py")
        else:
            print("\nSkipping ElevenLabs (no ELEVENLABS_API_KEY set)")
    else:
        print("\nSkipping ElevenLabs (use --all to include)")

    # Generate audio map
    generate_audio_map()

    # Final stats
    show_stats()

    print("\nPipeline complete!")


if __name__ == "__main__":
    main()
