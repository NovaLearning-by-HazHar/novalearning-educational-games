# NovaLearning — Canva Template Design Specs

> **Purpose:** Exact specifications for building 5 master templates in Canva Pro.
> **Reference:** Use alongside `docs/workbook-content-map.md` for page content.
> **Last Updated:** 2026-02-09

---

## Page Setup (All Templates)

| Setting | Value | Notes |
|---------|-------|-------|
| **Size** | A4 (210 × 297 mm) | Portrait orientation only |
| **Resolution** | 300 DPI | Required for print |
| **Bleed** | 3 mm all sides | Canva Pro: File > Settings > Show print bleed |
| **Safe zone** | 5 mm inside trim | Keep all text/critical elements inside |
| **Binding margin** | 20 mm left side | Extra clearance for perfect binding spine |
| **Export format** | PNG, 300 DPI | Not PDF — pdfkit assembles the final PDF |
| **Color mode** | RGB in Canva | Ghostscript converts to CMYK post-export |
| **File naming** | `page-01.png` through `page-50.png` | Zero-padded, lowercase, into `scripts/pages/` |

---

## Brand Color Palette

Use these HEX values in Canva. Ghostscript handles CMYK conversion for print.

### Primary Brand Colors
| Name | HEX | Usage |
|------|-----|-------|
| Nova Earth | `#5D4037` | Headings, page numbers, body text |
| Nova Sun | `#FFB300` | Accents, reward stars, highlights |
| Nova Sky | `#42A5F5` | Subtitles, QR labels, secondary elements |
| Nova Green | `#4CAF50` | Success, progress, nature elements |
| Nova Sand | `#FFF8E1` | Page backgrounds, activity area fills |
| White | `#FFFFFF` | QR code background, clean areas |
| Dark text | `#333333` | Fine print, instructions |
| Light grey | `#E0E0E0` | Borders, divider lines |

### Character Colors (for character illustrations)
| Character | HEX | Heritage |
|-----------|-----|----------|
| Sipho | `#FF6D00` | Zulu |
| Thandi | `#1565C0` | Xhosa |
| Lerato | `#2E7D32` | Sotho |
| Pieter | `#F57F17` | Afrikaans |
| Fatima | `#6A1B9A` | Cape Malay |
| Amahle | `#D84315` | Ndebele |

### SA Flag Colors (for national identity pages)
| Color | HEX |
|-------|-----|
| SA Green | `#007749` |
| SA Gold | `#FFB81C` |
| SA Black | `#000000` |
| SA Red | `#DE3831` |
| SA Blue | `#002395` |
| SA White | `#FFFFFF` |

---

## Typography

### Font Stack
| Role | Font | Size | Canva Availability |
|------|------|------|--------------------|
| **Tracing exercises** | KG Primary Dots | 40-48 pt | Upload custom font |
| **Body text** | Sassoon Primary | 18-24 pt | Upload custom font |
| **Headings** | Arial Rounded MT Bold | 30-40 pt | Available in Canva |
| **Page numbers** | Arial Rounded MT Bold | 14 pt | Available in Canva |
| **Fallback body** | Comic Sans MS | 18-24 pt | Available in Canva |

### Font Notes
- KG Primary Dots: Free for personal use, download from kgfonts.com. Upload to Canva brand kit.
- Sassoon Primary: Commercial font used in SA schools. If unavailable, use Comic Sans MS as fallback.
- All text except tracing exercises is for parent/teacher reference. Children don't read — keep instructions minimal and pictorial.

---

## Universal Page Elements

Every page MUST include these elements in the same positions:

```
┌──────────────────────────────────┐
│  [Activity Icon]     [Name: ___] │  ← Top row
│                                  │
│                                  │
│         (Main content area)      │
│                                  │
│                                  │
│         (Activity area)          │
│                                  │
│  [Ubuntu moment text]            │  ← Small italic text
│                                  │
│  [Logo 15mm]    [##]   [QR 20mm] │  ← Bottom row
└──────────────────────────────────┘
```

### Element Positions
| Element | Position | Size | Details |
|---------|----------|------|---------|
| **Activity icon** | Top-left, 15mm from edges | 10 × 10 mm | One of: scissors, pencil, crayon, eye, hand |
| **Name field** | Top-right, 15mm from edges | 60 × 8 mm | Dotted underline: "Name: ____________" |
| **Page number** | Bottom-center | 14 pt | Nova Earth color (`#5D4037`) |
| **Logo** | Bottom-left, 15mm from edges | 15 × 15 mm | NovaLearning logo (create in brand kit) |
| **QR zone** | Bottom-right, 15mm from edges | 20 × 20 mm | **Only pages 15 and 22.** Leave blank on other pages. |
| **Reward star** | Varies per template | 12 × 12 mm | Gold star outline for teacher/parent stamp |
| **Ubuntu moment** | Above bottom row | 9 pt italic | Short Ubuntu quote (see content map) |

### QR Zone (Pages 15 and 22 ONLY)
- Leave a **white 20×20mm box** in the bottom-right corner
- The pdfkit pipeline will overlay the actual QR code image
- Add small text below: "Scan to play!" in Nova Sky (`#42A5F5`), 9pt
- Do NOT embed a QR code in Canva — the pipeline generates them with the correct URL

---

## Template 1: Activity (ACT) — 19 pages

**Used on:** Pages 1, 4, 5, 6, 10, 14, 15, 19, 21, 26, 27, 33, 36, 37, 39, 41, 45, 46, 48

### Layout
```
┌────────────────────────────────────┐
│ [Icon: hand]          [Name: ___]  │
│                                    │
│     ACTIVITY TITLE (30pt, Earth)   │
│     Subtitle (20pt, Sky)           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │    Activity Area 1           │  │
│  │    (Sand bg, 2pt border)     │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │    Activity Area 2           │  │
│  │    (optional, max 2/page)    │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  "Ubuntu moment" (9pt italic)  ☆   │
│  [Logo]         [42]        [QR?]  │
└────────────────────────────────────┘
```

### Specs
- Max 2 activity areas per page
- Activity areas: Sand background (`#FFF8E1`), 2pt rounded border (`#E0E0E0`), 8px corner radius
- 30% white space minimum
- Instructions as picture prompts (no reading required)
- Minimum interaction target: 15 × 15 mm (for any circling/drawing areas)

---

## Template 2: Coloring (COL) — 9 pages

**Used on:** Pages 2, 3, 12, 17, 29, 34, 38, 44, 47

### Layout
```
┌────────────────────────────────────┐
│ [Icon: crayon]        [Name: ___]  │
│                                    │
│     COLORING TITLE (30pt, Earth)   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │                              │  │
│  │    Large Outlined Image      │  │
│  │    (2pt black outline,       │  │
│  │     no fill, white bg)       │  │
│  │                              │  │
│  │    Min enclosed area: 20mm   │  │
│  │                              │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  "Ubuntu moment" (9pt italic)  ☆   │
│  [Logo]         [42]        [QR?]  │
└────────────────────────────────────┘
```

### Specs
- Single large coloring image, centered
- Outlines: 2pt black (`#333333`), no fill
- Minimum enclosed coloring area: 20 × 20 mm (small hands need big spaces)
- White background inside coloring area
- Simple shapes — Grade R children (ages 5-6) need bold, clear outlines
- No fine detail that would frustrate young learners

---

## Template 3: Writing Practice (WRT) — 18 pages

**Used on:** Pages 7, 8, 9, 11, 13, 16, 18, 20, 22, 24, 25, 28, 31, 34, 35, 40 (and partial on others)

### Layout
```
┌────────────────────────────────────┐
│ [Icon: pencil]        [Name: ___]  │
│                                    │
│     LETTER/NUMBER (48pt, tracing)  │
│     "X is for Xenops" (20pt, Sky)  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Aa  Aa  Aa  Aa  Aa  Aa     │  │
│  │  ─────────────────────────── │  │ ← Tracing guide (30% gray, 3pt)
│  │  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │  │ ← Dashed midline
│  │  ─────────────────────────── │  │ ← Solid baseline
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │  Free practice lines         │  │
│  │  (4 rows, 12mm height each)  │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  [Circle items starting with X]    │
│                                    │
│  "Ubuntu moment" (9pt italic)  ☆   │
│  [Logo]         [42]        [QR?]  │
└────────────────────────────────────┘
```

### Specs
- Tracing guide: 30% gray (`#B0B0B0`), 3pt stroke dashed letter outlines
- Writing lines: 12mm row height (solid baseline + dashed midline at 6mm)
- Baseline: 1pt solid (`#333333`)
- Midline: 1pt dashed (`#B0B0B0`)
- Tracing font: KG Primary Dots at 40-48pt
- Practice rows: minimum 4 rows for free writing
- Large example letter at top (both uppercase and lowercase)
- Associated SA animal illustration (see content map for which animal per letter)

---

## Template 4: Matching/Connect (MAT) — 4 pages

**Used on:** Pages 15, 23, 30, 49

### Layout
```
┌────────────────────────────────────┐
│ [Icon: eye]           [Name: ___]  │
│                                    │
│     MATCHING TITLE (30pt, Earth)   │
│                                    │
│  ┌──────┐              ┌──────┐   │
│  │ Img1 │──────────────│ Img4 │   │
│  └──────┘              └──────┘   │
│  ┌──────┐              ┌──────┐   │
│  │ Img2 │              │ Img5 │   │
│  └──────┘              └──────┘   │
│  ┌──────┐              ┌──────┐   │
│  │ Img3 │              │ Img6 │   │
│  └──────┘              └──────┘   │
│                                    │
│  (Draw lines to connect pairs)     │
│                                    │
│  "Ubuntu moment" (9pt italic)  ☆   │
│  [Logo]         [42]        [QR?]  │
└────────────────────────────────────┘
```

### Specs
- Items in two columns: left and right
- Each item: picture in a rounded box (8px radius, 1pt border)
- Matching dot targets: 8mm diameter circles at connection points
- Clear spacing between items (min 15mm vertical gap)
- 3-6 pairs per page (Grade R attention span)
- All items are pictures, no text labels (no reading required)
- Sufficient white space between columns for drawing lines

---

## Template 5: Sequencing (SEQ) — 2 pages

**Used on:** Pages 42, 43

### Layout
```
┌────────────────────────────────────┐
│ [Icon: hand]          [Name: ___]  │
│                                    │
│     SEQUENCING TITLE (30pt, Earth) │
│                                    │
│  ┌────────┐  ┌────────┐  ┌────────┐
│  │        │  │        │  │        │
│  │  Img 1 │  │  Img 2 │  │  Img 3 │
│  │        │  │        │  │        │
│  └────────┘  └────────┘  └────────┘
│    [ 1 ]       [ 2 ]       [ 3 ]   │ ← Number boxes to fill in
│                                    │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  "Draw what happens next"   │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                    │
│  "Ubuntu moment" (9pt italic)  ☆   │
│  [Logo]         [42]        [QR?]  │
└────────────────────────────────────┘
```

### Specs
- 3-4 images in a horizontal row (scrambled order)
- Number boxes below each image for children to write sequence number
- Optional "draw what happens next" area below
- Each image: min 40 × 40 mm, clear illustrations
- Images should tell a visual story even without text

---

## Ndebele Border Patterns

5 variations to rotate across pages. Use on section dividers and special pages.

### Pattern Style
- Geometric shapes: diamonds, triangles, zigzags, stepped patterns
- Colors rotate through: Sipho Orange (`#FF6D00`), Thandi Blue (`#1565C0`), Lerato Green (`#2E7D32`), Nova Sun (`#FFB300`)
- Border width: 4mm
- Style reference: Ndebele house paintings (bold, geometric, primary colors)

### Where to Use
- **Full border:** Pages 1 (welcome), 5 (Ubuntu), 50 (pledge)
- **Top/bottom border:** Section title pages (1, 7, 33, 43)
- **Corner accents:** All other pages (top-left + bottom-right corners)

---

## Activity Icons

Create 5 icons for the brand kit. Used in the top-left of each page.

| Icon | Template | Description |
|------|----------|-------------|
| Scissors | Activity | Simple scissors silhouette |
| Pencil | Writing Practice | Pencil at 45° angle |
| Crayon | Coloring | Thick crayon with color tip |
| Eye | Matching/Connect | Simple eye symbol (look & match) |
| Hand | Sequencing / Activity | Open hand (touch/arrange) |

- Size: 10 × 10 mm
- Style: Single color (Nova Earth `#5D4037`), simple line art
- Consistent stroke weight across all 5 icons

---

## Export Checklist (Per Page)

Before exporting each page from Canva:

- [ ] A4 portrait, 300 DPI
- [ ] Print bleed enabled (3mm)
- [ ] Name field present (top-right)
- [ ] Activity icon present (top-left)
- [ ] Page number present (bottom-center, 14pt, `#5D4037`)
- [ ] Logo placeholder present (bottom-left, 15mm)
- [ ] Ubuntu moment text present (above bottom row)
- [ ] Reward star present
- [ ] QR zone: white 20×20mm box on pages 15 and 22 ONLY
- [ ] No text that requires children to read
- [ ] Minimum 30% white space
- [ ] All illustration outlines are bold (2pt+) for young learners
- [ ] Colors match brand palette (no random colors)
- [ ] Export as PNG (not PDF) to `scripts/pages/page-NN.png`

---

## Workflow Summary

```
1. Open Canva Pro → Create design → A4 (custom 210×297mm)
2. Apply master template for the page type (ACT/COL/WRT/MAT/SEQ)
3. Add page-specific content from docs/workbook-content-map.md
4. Check all elements against export checklist above
5. Export as PNG 300 DPI → save to scripts/pages/page-NN.png
6. Run: npm run workbook
7. Review output in out/novalearning-workbook-v1.pdf
8. When all 50 pages are done: npm run workbook:cmyk
9. Send CMYK PDF to printer
```
