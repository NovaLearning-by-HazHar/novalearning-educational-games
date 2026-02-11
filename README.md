# NovaLearning Games

South African EdTech platform combining a 50-page printed workbook (R150--R350) with QR-linked 3D browser games for **Grade R learners (ages 5--6)**. Built on the Ubuntu philosophy -- "I am because we are" -- as a core architectural principle, not decoration.

Baseline target device: **Samsung Galaxy A03** (3 GB RAM, Mali GPU, WebGL 1.0).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (static export) |
| UI | React 18, Tailwind CSS |
| 3D | React Three Fiber 8, Drei 9, Three.js 0.160 |
| State | Zustand 5 |
| Animation | anime.js 4 |
| Audio | Howler.js (Web Audio API synthesis) |
| Backend | Supabase (client-side only, optional) |
| Hosting | Vercel (PWA) |
| Workbook | pdfkit + Ghostscript (RGB to CMYK) |

## Getting Started

```bash
# Clone
git clone https://github.com/<your-org>/novalearning-games.git
cd novalearning-games

# Install
npm install

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (optional)

Create a `.env.local` for Supabase and PostHog. Games work fully offline without these.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

## Project Structure

```
src/
  app/
    games/
      count-to-five/       # Count to 5 with Sipho (mango picking, 3D)
      trace-letter-a/      # Trace Letter A with Thandi (letter tracing, 3D)
      counting-animals/    # Counting Animals (A-Z South African animals, 2D)
      letter-explorer/     # Letter Explorer (savanna animal discovery)
    parent/
      login/               # Parent auth (sign in / sign up)
      dashboard/           # Child management + local progress viewer
      qr-codes/            # Workbook QR code reference for print
  components/              # Shared: Scene, GameShell, ErrorBoundary, CelebrationScene
  stores/                  # Zustand stores: gameStore, progressStore
  lib/                     # Hooks + utilities: audio, device detect, Supabase, touch, perf
  types/                   # Shared types and character constants
public/
  assets/
    animals/               # A-Z South African animal images (webp)
scripts/
  generate-workbook.ts     # pdfkit workbook generator
  fetch-animal-images.ts   # AI animal image fetcher (Sharp resize + webp)
  workbook-templates/      # Page templates + shared layout
docs/
  workbook-content-map.md  # 50-page content outline
```

## Games

| Game | Character | Description |
|------|-----------|-------------|
| Count to 5 with Sipho | Sipho (Zulu) | Pick mangoes from a tree, learn numbers 1--5 in a 3D garden |
| Trace Letter A with Thandi | Thandi (Xhosa) | Finger-trace the letter A on a 3D chalkboard |
| Counting Animals | Sipho | Count A--Z South African animals across difficulty levels |
| Letter Explorer | Sipho | Explore a savanna to discover animals and their letters |

### Gameplay Loop

Every game follows: **EXPLORE -> DISCOVER -> PRACTICE -> CELEBRATE**

No failure states, no competition, no timers. Encouragement only.

## Rainbow Nation Characters

| Name | Heritage | Personality | Learning Style |
|------|----------|-------------|----------------|
| Sipho | Zulu | Brave explorer | Kinesthetic |
| Thandi | Xhosa | Creative storyteller | Visual |
| Lerato | Sotho | Kind helper | Social |
| Pieter | Afrikaans | Curious builder | Logical |
| Fatima | Cape Malay | Patient teacher | Auditory |
| Amahle | Ndebele | Joyful artist | Creative |

MVP uses Sipho, Thandi, and Lerato. All six are defined in `src/types/constants.ts`.

## Scripts

```bash
npm run dev              # Next.js dev server
npm run build            # Static export build
npm run lint             # ESLint
npm run fetch:animals    # Fetch + resize animal images (webp, <50 KB)
npm run fetch:animals:force  # Re-fetch all, overwriting existing
npm run workbook         # Generate workbook PDF (pdfkit)
npm run workbook:cmyk    # Generate + convert to CMYK (Ghostscript)
```

## Performance Budgets

| Metric | Target | Hard Limit |
|--------|--------|------------|
| Initial load | < 3 s | 5 s |
| Frame rate | 30 fps | 24 fps min |
| Bundle size | < 500 KB | 1 MB |
| Memory | < 200 MB | 300 MB |
| Per-asset | < 50 KB | 100 KB |
| Textures | 512x512 | 1024x1024 |
| Triangles | < 5K / model | 10K |

Rendering: WebGL 1.0 only. No post-processing, no real-time shadows, flat/toon shading.

## Workbook

50-page printed workbook designed in Canva, compiled with pdfkit, converted to CMYK via Ghostscript (FOGRA39 ICC). Physical spec: A4 portrait, 150 gsm, perfect bound, laminated cover.

- **Pages 1--6:** Rainbow Nation Foundation
- **Pages 7--32:** Literacy A--Z (SA animal + cultural value per letter)
- **Pages 33--42:** Rainbow Numeracy (numbers 1--10)
- **Pages 43--50:** Ubuntu Life Skills
- **QR codes** on pages 15 and 22 link to the two MVP games

See [`docs/workbook-content-map.md`](docs/workbook-content-map.md) for the full outline.

## License

All rights reserved. Copyright 2026 NovaLearning.
