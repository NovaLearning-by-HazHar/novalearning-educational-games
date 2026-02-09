# NovaLearning Games — Project Plan

## Current Phase: Phase 3 (Infrastructure) — IN PROGRESS
## Status: Phase 3a (hooks + schema) COMPLETE, Phase 3b (deploy + testing) pending
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

## Phase 2: First Game — Count to 5 with Sipho ✅

- [x] Garden environment (ground plane, sky gradient, bushes, flowers)
  - Vertex-colored sky gradient (orange → blue), meshBasicMaterial throughout
  - Decorative bushes + flowers, `showDecorations` prop for low-tier devices
- [x] Mango component with 3 animation states (idle/picking/in_basket)
  - Ellipsoid sphere + stem, sinusoidal sway/bob idle animation
  - anime.js v4 arc-to-basket pick animation with spin
  - Hover scale effect, click interaction with stopPropagation
- [x] MangoTree assembly (trunk + canopy + 5 mangoes + basket)
- [x] Basket with collected mango display + bounce animation on arrival
- [x] SimpleCharacter procedural figure (~300 triangles, reusable)
  - Cylinder body, sphere head, thin arms/legs, tiny sphere eyes
  - Bounce + wave animations via useFrame
- [x] SiphoGuide wrapper (phase-aware: wave on explore, bounce on discover/practice)
- [x] ProgressOverlay HTML (5 circle indicators, count label, Sipho hint bubble)
- [x] CountingCelebration 3D scene (3 MVP characters + instanced confetti)
  - Sipho, Thandi, Lerato with stagger entrance via anime.js v4
  - 30-particle InstancedMesh confetti with falling loop + wobble
- [x] Game-specific Zustand store (useCountingState)
  - 5 mangoes: picked/arrivedAtBasket tracking
  - Sipho hint auto-dismiss after 2s, derived selectors
- [x] Audio system (Web Audio API tone generation, zero file downloads)
  - Marimba notes (pentatonic C4-A4), pick SFX, counting beeps
  - Celebration melody, ambient wind (brown noise)
  - All generated in-memory as WAV blobs via OfflineAudioContext
- [x] CountToFiveGame orchestrator (composition of sub-components)
  - handlePickMango: audio + phase transitions + 5th mango delay
  - Empty-area tap → Sipho hint trigger
- [x] Page.tsx full assembly with phase routing
  - celebrate → CountingCelebration + "We counted to five together!" + Play Again
  - else → CountToFiveGame + ProgressOverlay
  - Ambient wind on load, celebration melody on celebrate phase
- [x] 3 MVP characters only (Sipho, Thandi, Lerato) — extensible to 6 later
- [x] Build verification
  - Game: 327KB First Load JS (65% of 500KB budget)
  - 0 TypeScript errors, 0 ESLint warnings

## Phase 2.5: Terminal Tooling Setup ✅

- [x] Committed Phase 2 (df5cc88 — 17 files, 1484 insertions)
- [x] Optimized CLAUDE.md (657→174 lines, saves ~11K tokens/message)
- [x] Created slash commands: /project:verify, /project:catchup, /project:phase3
- [x] Added hooks to .claude/settings.json (SessionStart git context, PostToolUse eslint fix)
- [x] Created PROGRESS.md for Document & Clear session pattern
- [x] Updated projectplan.md with Phase 2 commit + tooling notes

## Phase 3: Infrastructure

- [ ] Supabase project setup (auth, database, storage)
- [ ] Database schema (users, progress, games)
- [ ] Auth flow (parent email/password)
- [ ] Progress sync (Zustand → Supabase)
- [ ] Vercel deployment with Cape Town edge
- [ ] QR code generation for workbook pages
- [ ] Offline caching verification (full game playable offline)
- [ ] Signed JWT for premium QR content
- [ ] Galaxy A03 real device testing (or BrowserStack emulation)

## Phase 4: Second Game + Workbook

- [ ] Second game: Trace Letter A with Thandi (Language)
  - Reuse SimpleCharacter, GameShell, gameStore phase machine
  - New touch-tracing mechanic (finger follows letter path)
  - Thandi as guide character (Creative storyteller, Visual learner)
- [ ] Workbook page 1: Counting activity + QR code
- [ ] Workbook page 2: Letter tracing activity + QR code
- [ ] Parent dashboard stub (Supabase + simple React UI)
- [ ] Extend to 6 characters (add Pieter, Fatima, Amahle to SimpleCharacter)

## Phase 5: Workbook Pipeline

- [ ] Canva MCP page generation (batch 10 pages/day for rate limits)
- [ ] QR code generation linking to deployed game URLs
- [ ] Print-ready PDF compilation (CMYK, bleed, crop marks)
- [ ] CAPS curriculum coverage verification across all 50 pages
- [ ] Source 3 Cape Town printers (get quotes)
- [ ] 10-book pilot print run
- [ ] Teacher review of pilot books (CAPS alignment feedback)

## Phase 6: School Pilots & Launch

- [ ] Onboard 2 pilot schools (target 50 students each)
- [ ] Teacher training session (how workbook + QR games work together)
- [ ] Collect teacher testimonials (target 5)
- [ ] Collect parent testimonials (target 10)
- [ ] Premium school pitch deck (Bishops, Roedean, Herschel)
- [ ] 1,000-book print run (based on pilot feedback)
- [ ] Monitor pilot usage via Supabase analytics

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
| 2026-02-09 | anime.js v4.3.5 for pick animations | ~6KB gzipped, named exports API, cleaner timeline syntax than GSAP |
| 2026-02-09 | 3 MVP characters (Sipho, Thandi, Lerato) | Validate pipeline with 3, extend to 6 in Phase 3+ |
| 2026-02-09 | Procedural geometry only (Phase 2) | No GLTF downloads — all characters/objects built from primitives |
| 2026-02-09 | Web Audio API tone generation | Zero audio file downloads — OfflineAudioContext generates WAV blobs in memory |
| 2026-02-09 | CLAUDE.md terminal optimization | 657→174 lines saves ~11K tokens/msg (~$8-17/session on Opus) |
| 2026-02-09 | Document & Clear over /compact | PROGRESS.md + /clear + resume preserves full context without corruption |
| 2026-02-09 | Sequential Phase 3 (no multi-agent) | Tasks have dependencies; multi-agent adds 3-4x cost with no parallelism |

## Build Metrics

### Phase 1
| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Home First Load JS | 96.3KB | 500KB | OK |
| Game First Load JS | 311KB | 500KB | OK (62%) |
| TypeScript errors | 0 | 0 | OK |
| ESLint warnings | 0 | 0 | OK |

### Phase 2
| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Home First Load JS | 96.3KB | 500KB | OK |
| Game First Load JS | 327KB | 500KB | OK (65%) |
| Bundle increase | +16KB | — | anime.js + game components |
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

## Files Changed (Phase 2)

| File | Action | Description |
|------|--------|-------------|
| src/app/games/count-to-five/lib/constants.ts | New | Mango positions, colors, timing, character colors, celebration layout |
| src/app/games/count-to-five/lib/audioGenerator.ts | New | Web Audio API tone synthesis (marimba, SFX, melody, ambient) |
| src/app/games/count-to-five/hooks/useCountingState.ts | New | Zustand store: 5 mangoes, pick/arrive tracking, Sipho hints |
| src/app/games/count-to-five/hooks/useAudioSetup.ts | New | Generate + load 13 audio blobs on mount via OfflineAudioContext |
| src/app/games/count-to-five/components/GardenEnvironment.tsx | New | Ground, sky gradient, bushes, flowers |
| src/app/games/count-to-five/components/Mango.tsx | New | 3-state mango: idle sway, anime.js arc pick, basket arrival |
| src/app/games/count-to-five/components/Basket.tsx | New | Collection basket with bounce animation on arrival |
| src/app/games/count-to-five/components/MangoTree.tsx | New | Tree assembly: trunk + canopy + 5 mangoes + basket |
| src/app/games/count-to-five/components/SimpleCharacter.tsx | New | Reusable procedural figure (~300 tris, bounce/wave) |
| src/app/games/count-to-five/components/SiphoGuide.tsx | New | Sipho wrapper with phase-aware behavior |
| src/app/games/count-to-five/components/ProgressOverlay.tsx | New | HTML overlay: 5 indicators + count + hint bubble |
| src/app/games/count-to-five/components/CountingCelebration.tsx | New | 3 MVP characters + instanced confetti celebration |
| src/app/games/count-to-five/CountToFiveGame.tsx | Rewritten | Orchestrator composing all sub-components |
| src/app/games/count-to-five/page.tsx | Rewritten | Full assembly with audio, phase routing, Play Again |

## Blockers

None currently.

---

## Phase Gate Approvals

| Gate | Requirement | Approver |
|------|-------------|----------|
| Phase 2 → 3 | Build passes, game playable end-to-end, bundle <500KB | Damian |
| Phase 3 → 4 | Supabase auth working, Vercel deployed, offline verified on device | Damian |
| Phase 4 → 5 | Second game complete, workbook pages 1-2 with functional QR codes | Damian |
| Phase 5 → 6 | 50 pages complete, 10 pilot books printed, all QR codes resolve to live games | Damian |

## Risk Register

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| Galaxy A03 performance regression | Games unplayable for target users | Performance Agent approval per game; `usePerformance()` hook monitors FPS/memory | Performance Agent |
| Bundle size creep past 500KB | Slow load on 3G, poor UX | Track per-phase in Build Metrics table; hard limit enforced in CI | Code Reviewer |
| Printer delays for workbook | Pilot timeline slips | Get 3 Cape Town printer quotes by Phase 5 start; identify on-demand backup | Project Manager |
| School pilot rejection | No testimonials for premium sales | Target 5 schools to get 2 yes; offer free trial first month | Marketing Agent |
| Offline caching failure | Games unusable in low-connectivity areas | Workbox CacheFirst already configured; QA tests on airplane mode | QA Agent |
| Supabase free tier limits | Auth/storage caps during pilots | Monitor usage; upgrade plan before pilots if needed | Backend Agent |

## Agent Coordination Patterns

```
Sequential (per game):
  Engine → Performance → QA → Code Reviewer → Deployment

Parallel (across features):
  Engine (game) || Content (audio) || Workbook (pages)
       ↓              ↓                  ↓
              QA Agent (integration test)

Game creation flow:
  1. Content Agent → audio assets (Web Audio API synthesis or Howler.js)
  2. Engine Agent → R3F scene + game mechanics (anime.js animations)
  3. Performance Agent → Galaxy A03 profiling (usePerformance hook)
  4. QA Agent → CAPS alignment + accessibility + Ubuntu rules
  5. Code Reviewer → pre-merge quality check
  6. Deployment Agent → Vercel deploy + QR URL update
```

---

## Agent Status

| Agent | Status | Last Task |
|-------|--------|-----------|
| Project Manager | ACTIVE | Phase 2 complete |
| Engine Agent | DONE | Phase 2 game components + orchestrator |
| Content Agent | DONE | Phase 2 audio generation + character design |
| Performance Agent | IDLE | — |
| QA Agent | IDLE | — |
| Workbook Agent | IDLE | — |
| Code Reviewer | IDLE | — |
| Backend Agent | IDLE | — |
| Deployment Agent | IDLE | — |
| Marketing Agent | IDLE | — |
