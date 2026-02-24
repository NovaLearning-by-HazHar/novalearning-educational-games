# CLAUDE.md — NovaLearning

## Project
NovaLearning: Web-based 3D educational games for South African Grade R students (ages 4-6). QR-code triggered after workbook completion. English-only MVP.

## Tech Stack
- **Engine**: Three.js + React Three Fiber
- **Framework**: Next.js (App Router)
- **Hosting**: Vercel (edge functions, CDN)
- **DB**: Supabase (auth, progress tracking)
- **Payments**: Stripe (parent subscriptions)
- **Language**: TypeScript strict mode

## Target Device: Galaxy A03
This is the #1 constraint. Every decision filters through this:
- **RAM**: 2GB (budget ~60MB for our app)
- **GPU**: Mali-G52 (WebGL 1.0 safe, avoid WebGL 2.0 features)
- **Network**: Intermittent 3G (offline-first mandatory)
- **Bundle**: < 500KB initial load, < 2MB total with assets
- **FPS**: Target 60fps, minimum 30fps acceptable
- **Geometry**: < 10,000 vertices per scene
- **Textures**: 256x512px max, compressed (WebP/AVIF)
- **Lighting**: Baked only — no real-time shadows
- **Physics**: Bounding box collisions only
- **Audio**: MP3 mono, 22kHz, < 100KB per clip

## Ubuntu Philosophy ("I am because we are")
Every game mechanic must reinforce:
- Cooperative > competitive (help friends, not beat enemies)
- Community achievements, not individual leaderboards
- Sharing resources as core gameplay loop
- Group celebrations on success
- Characters that need help, not defeating

## Architecture Patterns
```
src/
├── app/           # Next.js app router pages
├── components/    # React components
│   ├── ui/        # Shadcn/UI components
│   └── game/      # Three.js game components
├── lib/           # Shared utilities
│   ├── three/     # Three.js helpers, loaders
│   ├── supabase/  # DB client, queries
│   └── audio/     # Sound manager (pool pattern)
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── types/         # TypeScript type definitions
└── public/
    ├── models/    # GLB files (draco compressed)
    └── textures/  # WebP textures
```

## Coding Standards
- All files TypeScript (.ts/.tsx), no .js
- Components: functional + hooks only, no class components
- State: Zustand for global, useState for local
- 3D scenes: React Three Fiber declarative, not imperative Three.js
- CSS: Tailwind utility classes, no CSS modules
- Imports: absolute paths via `@/` alias
- Tests: Vitest for unit, Playwright for e2e
- Commits: conventional commits (feat:, fix:, perf:, etc.)

## Performance Rules (ENFORCED)
Before any PR or deploy:
1. `npm run build` — must succeed with zero warnings
2. Bundle analysis — no single chunk > 200KB
3. Lighthouse mobile score > 80
4. No `useEffect` without cleanup
5. All Three.js geometries/materials disposed on unmount
6. Texture loading via `useLoader` with Suspense boundaries
7. No synchronous asset loading — everything async
8. Object pooling for frequently created/destroyed objects

## CAPS Curriculum Alignment
Games align to South African CAPS Grade R curriculum:
- **Mathematics**: Counting 1-10, shapes, patterns, sorting
- **Life Skills**: Social behavior, health, safety
- **Language**: Phonics, vocabulary, storytelling
- **Physical**: Fine motor (touch/drag), gross motor concepts

## Key Commands
- `/gamecheck` — Run performance audit (bundle, FPS, Galaxy A03 compat)
- `/plan` — Generate implementation plan in projectplan.md
- `/review` — Code review against our standards
- `/test` — Run full test suite

## Asset Repos (Check Before Building)
- `RangerNova` — Main 3D game engine (forked)
- `Counting-Safari` — Reference counting game
- `NovaLearning-Workbook-50-Pages` — Workbook content source
- `speechbrain` (forked) — Voice/pronunciation scoring
- `novalearning-cultural-content` — SA cultural assets, stories
- `saas-app` — Supabase + Stripe SaaS template

## Session Protocol
1. Start: Read SCRATCHPAD.md for context from last session
2. Work: Follow projectplan.md todos, mark complete
3. End: Update SCRATCHPAD.md with progress, blockers, next steps

## DO NOT
- Use WebGL 2.0 features (Galaxy A03 incompatible)
- Import large libraries without checking bundle impact
- Create real-time shadows or dynamic lighting
- Use `any` type — always explicit types
- Push directly to main — feature branches only
- Hardcode strings — use constants/i18n even for English MVP
- Skip dispose() on Three.js objects
