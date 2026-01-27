# Asset Manifest — NovaLearning Letter Recognition Game

## Pipeline

| Asset Type | Creator | Tool | Format | Location |
|------------|---------|------|--------|----------|
| Animal sprites (A-Z) | Damian (via Canva/HuggingFace) | Canva MCP, HuggingFace MCP | PNG, transparent bg | `sprites/animals/` |
| Letter images (A-Z) | Damian (via Canva/HuggingFace) | Canva MCP | PNG | `sprites/letters/` |
| UI elements | Damian (via Canva) | Canva MCP | PNG | `sprites/ui/` |
| Spritesheets | Damian | Compile from PNGs | PNG atlas + JSON | `spritesheets/` |
| Letter audio (A-Z) | TBD | ElevenLabs / SA recordings | MP3 + OGG | `audio/letters/` |
| SFX (stars, correct, etc) | TBD | - | MP3 + OGG | `audio/sfx/` |
| Fonts | Damian | Source free commercial | WOFF2 | `fonts/` |
| 3D models (future AR) | Damian (via Blender MCP) | Blender MCP, Meshy AI | GLB | (separate repo/storage) |

## Phase 1 Assets Needed (A-F Only)

### Animals (SA themed) — Updated Jan 27
- [ ] `a-aardvark.png` — A (Aardvark)
- [ ] `b-baboon.png` — B (Baboon) ← was Buffalo
- [ ] `c-crocodile.png` — C (Crocodile) ← was Chameleon
- [ ] `d-duiker.png` — D (Duiker) ← was Dragonfly
- [ ] `e-elephant.png` — E (Elephant)
- [ ] `f-flamingo.png` — F (Flamingo)

**Drop location:** `public/assets/sprites/animals/`
**Sprite key format:** `{letter}-{animal}` (e.g., `a-aardvark`)
**Auto-loaded:** BootScene preloads all sprite keys from letters.js
**Fallback:** Styled placeholder circles + emojis when file not found

### Letters
- [ ] `letter-A.png` through `letter-F.png` (uppercase, bold, child-friendly)
- [ ] `letter-a.png` through `letter-f.png` (lowercase variants)

### UI
- [ ] `btn-primary.png` — Main action button
- [ ] `btn-secondary.png` — Back/cancel
- [ ] `star-empty.png` — Progress star (unfilled)
- [ ] `star-filled.png` — Progress star (filled)
- [ ] `progress-bar-bg.png` — Progress bar background
- [ ] `progress-bar-fill.png` — Progress bar fill

### Audio
- [ ] `letter-A.mp3` through `letter-F.mp3` — Pronunciation
- [ ] `correct.mp3` — Correct answer SFX
- [ ] `incorrect.mp3` — Try again SFX
- [ ] `star-earn.mp3` — Star earned SFX
- [ ] `level-complete.mp3` — Level completion

### Fonts
- [ ] Child-friendly primary font (e.g., Nunito, Quicksand, or similar)

## Specs

- **Animal sprites:** 256x256px PNG, transparent background, flat/cartoon style, vibrant colors
- **Letter images:** 128x128px PNG, transparent background, thick strokes
- **UI elements:** 9-slice compatible where possible
- **Audio:** MP3 primary, OGG fallback. Normalize to -14 LUFS.
- **Budget:** Total assets < 50MB, single asset < 2MB
