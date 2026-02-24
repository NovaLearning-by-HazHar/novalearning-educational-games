# NovaLearning — Brand Guide

> Colours, typography, touch targets, visual pipeline
> Last updated: 2026-02-23

---

## Colour Palette

### CSS Custom Properties

```css
:root {
  --nova-primary:   #FF6B35;  /* Sunset Orange */
  --nova-secondary: #FFD23F;  /* Ubuntu Gold */
  --nova-accent:    #2ECC71;  /* Fynbos Green */
  --nova-deep:      #C0392B;  /* Karoo Red */
  --nova-sky:       #3498DB;  /* Cape Blue */
  --nova-earth:     #F39C12;  /* Kalahari Sand */
  --nova-text:      #1A1A2E;  /* Rich Night */
  --nova-bg:        #FFF8F0;  /* Warm Cream */
}
```

### Usage Rules

| Colour | Use For | Never Use For |
|---|---|---|
| `--nova-primary` (#FF6B35) | Character names, CTAs, active states | Body text |
| `--nova-secondary` (#FFD23F) | Stars, rewards, highlights | Backgrounds (low contrast) |
| `--nova-accent` (#2ECC71) | Success states, progress bars | Error indicators |
| `--nova-deep` (#C0392B) | Headings, emphasis | Error states (no fail states exist) |
| `--nova-sky` (#3498DB) | Links, info panels, water | — |
| `--nova-earth` (#F39C12) | Badges, warmth accents | — |
| `--nova-text` (#1A1A2E) | All body text, labels | — |
| `--nova-bg` (#FFF8F0) | All page backgrounds | — |

### Hard Rules

- Never pure white (`#FFFFFF`) — use `--nova-bg` (#FFF8F0)
- Never pure black (`#000000`) — use `--nova-text` (#1A1A2E)
- Never red for errors — **no fail states exist** in NovaLearning
- 4.5:1 contrast minimum (WCAG AA)

---

## Typography

| Use | Font | Weight | Fallback |
|---|---|---|---|
| Headings | Comic Neue | Bold (700) | "Comic Sans MS", cursive |
| Body text | Comic Neue | Regular (400) | "Comic Sans MS", cursive |
| Tracing guides | KG Primary Dots | — | monospace |
| Workbook body | Sassoon Primary | — | "Comic Sans MS", cursive |

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
```

Cache via Workbox CacheFirst strategy (1 year expiry).

---

## Touch & Interaction

| Rule | Value |
|---|---|
| Minimum touch target | 48px (64px recommended) |
| Touch action | `touch-action: manipulation` on game viewport |
| Double-tap zoom | Prevented via `preventDoubleTapZoom()` |
| Tap feedback | Scale to 0.95 on press, bounce back |
| Audio latency | <200ms from tap to sound |

---

## Visual Pipeline

```
3D Models (GLB) → R3F Game Scenes → PWA (offline)
                                  ↘
Canva Pro (design) → PNG export → pdfkit (compile) → PDF/X-1a (print)
                                                    ↘
                                              Ghostscript (RGB→CMYK)
```

### Asset Budgets

| Asset Type | Target | Maximum | Auto-Fail |
|---|---|---|---|
| Character model | ~500 vertices | 700 vertices | >1000 vertices |
| Companion model | ~300 vertices | 450 vertices | >600 vertices |
| Texture | 256x256 | 512x512 | >1024x1024 |
| Audio file | 50KB | 100KB | >200KB |
| Sprite sheet | 200KB | 500KB | >1MB |
| Total JS bundle | 350KB | 500KB | >600KB |

### Image Format Rules

| Context | Format | Notes |
|---|---|---|
| In-game textures | WebP / PNG | WebP preferred, PNG fallback |
| Mascot assets | PNG / SVG | `src/assets/mascots/` |
| Workbook pages | 300 DPI PNG | Canva export → pdfkit |
| Print output | PDF/X-1a (CMYK) | Ghostscript conversion |

---

## Character Skin Tones

From Character Bible v1.0 (see GAME-BRIEF.md):

```
Gogo Thandi:  #6D4C41    Sipho:   #8D6E63    Amahle:  #795548
Jabu:         #5D4037    Liya:    #A1887F    Themba:  #BCAAA4
```

---

## Workbook Print Specs

| Spec | Value |
|---|---|
| Page size | A4 portrait |
| Paper weight | 150gsm uncoated interior |
| Cover | 300gsm laminated |
| Binding | Perfect bound |
| Total pages | 52 (50 content + 2 covers) |
| Bleed | 3mm all sides |
| Color space | CMYK (FOGRA39 ICC profile) |

---

*This file is authoritative for visual rules. See `GAME-BRIEF.md` for characters, `docs/engine-spec.md` for tech constraints.*
