# Nano Banana Pro (Gemini 3 Pro Image) - MCP Skill
*AI Image Generation & Editing for NovaLearning Development*

## Overview
Generate or edit images via Gemini 3 Pro Image using the Nano Banana Pro tool. Particularly useful for NovaLearning game assets, marketing materials, and client presentations.

## Prerequisites
- **Environment Variable:** `GEMINI_API_KEY`
- **Dependencies:** `uv` (Python package manager)
- **Installation:** `brew install uv` (if not installed)

## Core Usage Patterns

### 1. Generate New Images
```bash
uv run {baseDir}/scripts/generate_image.py \
  --prompt "your image description" \
  --filename "output.png" \
  --resolution 1K
```

### 2. Edit Existing Images
```bash
uv run {baseDir}/scripts/generate_image.py \
  --prompt "edit instructions" \
  --filename "output.png" \
  -i "/path/input.png" \
  --resolution 2K
```

### 3. Multi-Image Composition (up to 14 images)
```bash
uv run {baseDir}/scripts/generate_image.py \
  --prompt "combine these into one scene" \
  --filename "output.png" \
  -i img1.png -i img2.png -i img3.png
```

## NovaLearning-Specific Applications

### Game Asset Creation
```bash
# South African animal characters for counting games
uv run scripts/generate_image.py \
  --prompt "friendly cartoon springbok character for children's educational game, Ubuntu philosophy inspired, warm colors" \
  --filename "2025-02-13-springbok-character.png" \
  --resolution 1K

# Cultural backgrounds for math games
uv run scripts/generate_image.py \
  --prompt "South African township playground background, colorful, child-friendly, educational game style" \
  --filename "2025-02-13-township-background.png" \
  --resolution 2K
```

### Marketing & Presentation Assets
```bash
# Investor pitch graphics
uv run scripts/generate_image.py \
  --prompt "modern infographic showing AR educational technology for South African children" \
  --filename "2025-02-13-investor-infographic.png" \
  --resolution 4K
```

### Client Work Templates
```bash
# Website hero images for dr-roof-website template
uv run scripts/generate_image.py \
  --prompt "professional roofing company hero image, South African architecture, trustworthy" \
  --filename "2025-02-13-roofing-hero.png" \
  --resolution 2K
```

## Resolution Guidelines
- **1K (1024px):** Default, good for web assets, game textures
- **2K (2048px):** High quality presentations, marketing materials
- **4K (4096px):** Print materials, investor presentations

## File Naming Convention
Use timestamps for version control:
`yyyy-mm-dd-hh-mm-ss-descriptive-name.png`

Examples:
- `2025-02-13-14-30-00-counting-game-background.png`
- `2025-02-13-14-31-15-ubuntu-character-elephant.png`

## Galaxy A03 Optimization Considerations
When generating game assets:
- Keep textures ≤ 512px for Galaxy A03 performance
- Use simple, high-contrast designs
- Avoid fine details that won't render well on low-res screens

## API Configuration
Set `GEMINI_API_KEY` in:
1. Environment variable (recommended)
2. `~/.openclaw/openclaw.json`:
```json
{
  "skills": {
    "nano-banana-pro": {
      "apiKey": "your-key-here"
    }
  }
}
```

## Integration with Other MCP Tools
- **Cloudinary MCP:** Upload generated images for CDN hosting
- **Figma MCP:** Import as design system assets
- **GitHub MCP:** Commit to novalearning-cultural-content repo
- **Vercel MCP:** Deploy with web games for production

## Output Handling
- Script prints `MEDIA:` line for auto-attachment
- **Do not read images back** - report saved path only
- Move final assets to appropriate repo directories

## Strategic Usage for Damian's Workflows
1. **Asset-First Approach:** Generate missing visuals for existing repos
2. **Cultural Authenticity:** Create SA-specific educational content
3. **Client Deliverables:** Professional graphics for consulting projects
4. **Rapid Prototyping:** Visual mockups for NovaLearning features
5. **Brand Consistency:** Maintain Ubuntu philosophy in visual assets

## Success Metrics
- ✅ Generates culturally appropriate SA educational content
- ✅ Produces Galaxy A03-optimized game textures
- ✅ Creates professional client presentation assets
- ✅ Maintains Ubuntu philosophy visual language
- ✅ Integrates with existing repo workflows

## Time Savings
- **Manual design:** 2-4 hours per asset
- **With Nano Banana Pro:** 5-10 minutes per asset
- **ROI:** 90%+ time reduction for visual content creation
