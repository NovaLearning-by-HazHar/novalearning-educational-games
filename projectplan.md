# NovaLearning Games — Project Plan

## Current Phase: Phase 0 (Project Setup)
## Status: IN PROGRESS
## Last Updated: 2026-02-09

---

## Phase 0: Project Setup ✅

- [x] Initialize Next.js 14 project (TypeScript, Tailwind, App Router)
- [x] Install dependencies (Three.js 0.160.1, R3F 8.18.0, Zustand, Howler, next-pwa)
- [x] Configure next.config.js (SSG, PWA, asset loaders)
- [x] Configure tailwind.config.ts (brand colors, fonts)
- [x] Create type definitions (game.ts, constants.ts)
- [x] Create Zustand stores (gameStore, progressStore)
- [x] Create lib modules (deviceDetect, audio, assetLoader, supabase)
- [x] Create components (Scene, GameShell, CelebrationScene)
- [x] Create app pages (home, count-to-five stub)
- [x] Create PWA manifest (en-ZA, portrait, education)
- [x] Create .env.example
- [x] Create .claude/settings.json
- [x] Create 10 agent definition files
- [x] Create projectplan.md
- [ ] Verify build passes (npx tsc + npm run build)
- [ ] Initial git commit

## Phase 1: Engine Foundation

- [ ] R3F scene component with Galaxy A03 renderer settings
- [ ] WebGL 1.0 detection and graceful fallback
- [ ] 3-tier device detection (low/medium/high)
- [ ] Progressive asset loader with size budget enforcement
- [ ] Workbox service worker for offline caching
- [ ] Game state machine (Explore → Discover → Practice → Celebrate)
- [ ] Audio system integration (Howler.js manager)
- [ ] Touch input system (48px+ targets)

## Phase 2: First Game — Count to 5 with Sipho

- [ ] Garden scene (baked lighting, flat shading, <200KB total)
- [ ] Mango 3D asset (<50KB, <5K triangles)
- [ ] Sipho character model (low-poly, animated)
- [ ] Tap interaction: pick mangoes counting 1-5
- [ ] Audio: marimba notes + Sipho voice lines
- [ ] Ubuntu celebration scene (all 6 characters)
- [ ] CAPS numeracy alignment validation
- [ ] Galaxy A03 performance profiling (<3s load, 30fps)

## Phase 3: Infrastructure

- [ ] Supabase project setup (auth, database, storage)
- [ ] Database schema (users, progress, games)
- [ ] Auth flow (parent email/password)
- [ ] Progress sync (Zustand → Supabase)
- [ ] Vercel deployment with Cape Town edge
- [ ] QR code generation for workbook pages
- [ ] Offline caching (full game playable offline)
- [ ] Signed JWT for premium QR content

## Phase 4: Second Game + Workbook

- [ ] Second game: Trace Letter A with Thandi (Language)
- [ ] Workbook page 1: Counting activity + QR code
- [ ] Workbook page 2: Letter tracing activity + QR code
- [ ] Parent dashboard stub
- [ ] Cloudinary CDN integration

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-09 | R3F v8.18.0 (not v9) | Next.js 14 ships React 18; R3F v9+ requires React 19 |
| 2026-02-09 | next-pwa instead of raw Workbox | Cleaner Next.js integration, uses Workbox under the hood |
| 2026-02-09 | next.config.js (CJS) not .mjs | next-pwa uses require(), needs CommonJS |
| 2026-02-09 | Three.js ^0.160.0 | Stable version within R3F v8 peer dependency range |

## Blockers

None currently.

---

## Agent Status

| Agent | Status | Last Task |
|-------|--------|-----------|
| Project Manager | ACTIVE | Phase 0 setup |
| Engine Agent | IDLE | — |
| Performance Agent | IDLE | — |
| Content Agent | IDLE | — |
| QA Agent | IDLE | — |
| Workbook Agent | IDLE | — |
| Code Reviewer | IDLE | — |
| Backend Agent | IDLE | — |
| Deployment Agent | IDLE | — |
| Marketing Agent | IDLE | — |
