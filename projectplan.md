# NovaLearning Games — Project Plan

## Current Phase: Phase 2 (First Game)
## Status: READY TO START
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
- [x] Verify build passes (npx tsc + npm run build)
- [x] Initial git commit (9485f54)

## Phase 1: Engine Foundation ✅

- [x] R3F scene component with Galaxy A03 renderer settings
  - DeviceConfig-driven Canvas: dpr, antialias, powerPreference per tier
  - Configurable camera position/FOV, background color, frameloop
  - Built-in ambient + directional lighting, flat toneMapping
- [x] WebGL 1.0 detection and graceful fallback
  - `isWebGLAvailable()` with experimental-webgl fallback
  - User-friendly WebGLFallback component with guidance
  - Loading spinner while detecting device capabilities
- [x] 3-tier device detection (low/medium/high)
  - GPU renderer sniffing via WEBGL_debug_renderer_info
  - Known low-end GPU list (Mali-G52, Adreno 5xx, PowerVR, etc.)
  - Score-based classification: memory + cores + screen pixels + GPU
  - DeviceConfig exported with full tier-specific renderer settings
  - Cached after first detection (safe to call frequently)
- [x] Progressive asset loader with size budget enforcement
  - Cache-first strategy with in-memory Map
  - Sequential loading to avoid memory spikes on low-end devices
  - Progress callback for loading UI
  - Budget warnings (logs but doesn't block)
  - `getCachedAssetSizeKB()` and `clearAssetCache()` utilities
- [x] Workbox service worker for offline caching
  - CacheFirst for 3D assets (GLB/GLTF), audio (MP3/OGG/WAV), images/textures
  - StaleWhileRevalidate for game pages and JS/CSS bundles
  - CacheFirst for Google Fonts (1 year expiry)
  - 30-day expiry for game assets, 7-day for pages
- [x] Game state machine (Explore → Discover → Practice → Celebrate)
  - PHASE_ORDER array with `advancePhase()` sequential transitions
  - `targetInteractions` configurable per game (default: 5)
  - Auto-advance to celebrate phase when target reached during practice
  - `shouldCelebrate()` check, `reset()` for new sessions
- [x] Audio system integration (Howler.js manager)
  - 4 audio categories: music, sfx, voice, ambient
  - Independent volume per category (music 0.4, sfx 0.8, voice 1.0, ambient 0.3)
  - HTML5 streaming for long audio (ambient/music)
  - Mobile AudioContext unlock on first interaction
  - `stopCategory()`, `playAt()` with volume override
- [x] Touch input system (48px+ targets)
  - `useTouchInput()` R3F hook with raycasting
  - `preventDoubleTapZoom()` for HTML elements
  - CSS enforced 48px min touch targets via globals.css
  - `touch-action: manipulation` on game viewport
- [x] Performance profiling hook
  - `usePerformance()` R3F hook: FPS, avgFPS, memory, draw calls, triangles
  - Warning when below MIN_FPS (24) target
  - `useFpsMonitor()` standalone hook outside Canvas
- [x] Count-to-Five engine demo (placeholder 3D game)
  - 5 tappable mango spheres on a tree with bobbing animation
  - Pick animation (fall + rotate)
  - Full state machine flow: explore → discover → practice → celebrate
  - GameShell with working mute toggle and loading overlay
- [x] Build verification
  - Home: 96.3KB First Load JS
  - Game: 311KB First Load JS (62% of 500KB budget)
  - No TypeScript errors, no ESLint warnings

## Phase 2: First Game — Count to 5 with Sipho

- [ ] Garden scene (baked lighting, flat shading, <200KB total)
- [ ] Mango 3D asset (<50KB, <5K triangles) — replace placeholder spheres
- [ ] Sipho character model (low-poly, animated)
- [ ] Audio: marimba notes + Sipho voice lines + nature ambient
- [ ] Ubuntu celebration scene upgrade (3D animated with all 6 characters)
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
| 2026-02-09 | Score-based device classification | More robust than simple threshold — combines GPU, RAM, cores, screen |
| 2026-02-09 | Sequential asset loading | Prevents memory spikes on Galaxy A03 (3GB RAM) |
| 2026-02-09 | Audio categories with independent volumes | Music at 0.4, voice at 1.0 — prevents voice lines being drowned out |
| 2026-02-09 | CacheFirst for game assets | Offline-first: once downloaded, always available even without network |

## Build Metrics (Phase 1)

| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Home First Load JS | 96.3KB | 500KB | OK |
| Game First Load JS | 311KB | 500KB | OK (62%) |
| TypeScript errors | 0 | 0 | OK |
| ESLint warnings | 0 | 0 | OK |

## Files Changed (Phase 1)

| File | Action | Description |
|------|--------|-------------|
| src/lib/deviceDetect.ts | Enhanced | GPU sniffing, DeviceConfig, score-based tier classification |
| src/components/Scene.tsx | Enhanced | DeviceConfig-driven Canvas, configurable camera/bg, WebGL fallback |
| src/stores/gameStore.ts | Enhanced | Phase machine with advancePhase(), auto-celebrate, targetInteractions |
| src/lib/audio.ts | Enhanced | 4 categories, independent volumes, mobile unlock, HTML5 streaming |
| src/lib/assetLoader.ts | Enhanced | Cache-first, sequential loading, progress callback, size tracking |
| src/components/GameShell.tsx | Enhanced | Working mute toggle, loading overlay, audio unlock |
| src/lib/usePerformance.ts | New | R3F FPS/memory/drawcalls hook + standalone FPS monitor |
| src/lib/useTouchInput.ts | New | R3F raycasting hook + preventDoubleTapZoom |
| src/app/games/count-to-five/CountToFiveGame.tsx | New | 3D game demo with mango picking + state machine |
| src/app/games/count-to-five/page.tsx | Enhanced | Integrates game component, phase switching, celebration |
| next.config.js | Enhanced | Workbox runtime caching rules for offline play |

## Blockers

None currently.

---

## Agent Status

| Agent | Status | Last Task |
|-------|--------|-----------|
| Project Manager | ACTIVE | Phase 1 complete |
| Engine Agent | DONE | Phase 1 engine foundation |
| Performance Agent | IDLE | — |
| Content Agent | IDLE | — |
| QA Agent | IDLE | — |
| Workbook Agent | IDLE | — |
| Code Reviewer | IDLE | — |
| Backend Agent | IDLE | — |
| Deployment Agent | IDLE | — |
| Marketing Agent | IDLE | — |
