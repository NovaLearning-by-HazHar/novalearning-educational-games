# NovaLearning Games — Project Plan

## Current Phase: Phase 4 (Second Game + Workbook) — COMPLETE
## Status: Phase 4 COMPLETE. Trace Letter A game + workbook pages generated.
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

## Phase 3: Infrastructure ✅

### Phase 3a: Hooks + Schema (commit b1493bb)
- [x] Event bus (typed pub-sub for decoupled game events)
- [x] Auth hook (useSupabaseAuth — state machine, null-safe)
- [x] Session tracking hook (useGameSession — ref-based, zero re-renders)
- [x] Progress sync hook (useProgressSync — debounced, offline-resilient)
- [x] Extended progressStore with session metrics (duration, phases, deviceTier)
- [x] Extended types (AuthStatus, SyncStatus, GameSession, ProgressRow)
- [x] Supabase helpers (upsertProgress, getChildProgress — null-safe)
- [x] Database schema (profiles, children, progress tables with RLS + POPIA)

### Phase 3b: UI + Deployment Config
- [x] Parent login page (/parent/login — sign in/signup, null-safe fallback)
- [x] Parent dashboard (/parent/dashboard — child management + local progress)
- [x] QR code reference page (/parent/qr-codes — for workbook print layout)
- [x] QR code utility (lib/qrCodes.ts — Google Charts API URL generation)
- [x] ProgressSyncProvider in app layout (auto-sync when authenticated)
- [x] Home page parent portal link
- [x] Vercel config (vercel.json — Cape Town region, security headers, SW rules)
- [x] Fixed overflow for scrollable parent pages

### Remaining Manual Steps
- [ ] Create Supabase project on supabase.com (Africa South region)
- [ ] Run supabase/migrations/001_initial_schema.sql in SQL Editor
- [ ] Add .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Connect Git repo to Vercel and deploy
- [ ] Test auth flow end-to-end with real Supabase credentials
- [ ] Offline caching verification (airplane mode after first load)
- [ ] Galaxy A03 real device testing (or BrowserStack emulation)
- [ ] Signed JWT for premium QR content (deferred to Phase 5)

## Phase 4: Second Game + Workbook DONE

- [x] Second game: Trace Letter A with Thandi (Language)
  - Reuses SimpleCharacter, GameShell, gameStore phase machine
  - Touch-tracing mechanic: 3-stroke letter A on easel board
  - Thandi as guide character (Creative storyteller, Visual learner)
  - TracingInteraction: pointer raycaster plane path checkpoint matching
  - LetterPath: CatmullRomCurve3 tube geometry, per-stroke progress fill
  - WritingEnvironment: sky gradient, easel board, bushes, flowers
  - TracingCelebration: 3 characters + floating letter A + confetti
  - useTracingState: Zustand store with per-stroke progress tracking
  - Audio: tracing tones, checkpoint dings, stroke chime, letter A sound
  - 11 new files mirroring count-to-five structure
- [x] Workbook page 15: Counting activity + QR code (pdfkit)
- [x] Workbook page 22: Letter tracing activity + QR code (pdfkit)
- [x] Extend to 6 characters (Pieter, Fatima, Amahle color configs added)
- [x] QR code mapping updated (page 22 to trace-letter-a)
- [x] Home page updated with second game link
- [x] Workbook generator script: npm run workbook outputs to out/ directory

## Phase 5: Workbook Production Pipeline

### Phase 5a: Design System Setup (Canva Pro)
- [ ] Create Canva Pro workspace with NovaLearning brand kit
  - CMYK color palette (SA flag colors + brand green/gold)
  - Font set: KG Primary Dots (tracing), Sassoon Primary (body), Arial Rounded (headings)
  - Rainbow Nation character illustrations (6 kids, consistent style)
  - SA animal illustrations (10 animals per design guide)
  - Ndebele border patterns (5 variations)
  - Activity icons (scissors, pencil, crayon, eye, hand)
- [ ] Build 5 master Canva templates (Activity, Coloring, Writing Practice, Matching/Connect, Sequencing)
  - Each includes: name field, page number, logo, activity icon, QR zone (20x20mm bottom-right), reward star, Ubuntu moment

### Phase 5b: Page Design (in Canva)
- [ ] Design 50 pages across CAPS Term 1 curriculum
  - Batch 10 pages/week (~5 week timeline)
  - Teacher review checkpoint at pages 10, 25, 50
- [ ] Export all pages as 300 DPI PNG from Canva
  - Note: Expect ~500MB+ total (50 x A4 @ 300 DPI). Store in `assets/workbook-pages/` with naming convention `page-XX-{type}.png`

### Phase 5c: Print Pipeline (pdfkit + Ghostscript)
- [ ] Enhance `scripts/generate-workbook.ts`:
  - Accept directory of Canva PNG exports as input
  - **Stream pages into PDF one at a time** (do NOT load all 500MB+ of PNGs into memory)
  - Insert QR codes from `src/lib/qrCodes.ts` (all 50 page mappings)
  - Page numbering (bottom-center, 14pt)
  - NovaLearning logo (bottom-left, 15mm)
  - 3mm bleed + crop marks
  - Combined 50-page PDF output
- [ ] RGB->CMYK conversion step (CRITICAL -- Canva exports RGB only)
  - Option A: Ghostscript with FOGRA39 ICC profile: `gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK -sOutputICCProfile=FOGRA39.icc -o output-cmyk.pdf input-rgb.pdf`
  - Option B: Sharp library for per-image conversion before PDF assembly
  - Validate: spot-check converted colors against design guide CMYK values
- [ ] PDF/X-1a compliance check
- [ ] Parallelise: Start 5c pipeline dev in weeks 1-2 of 5b so compilation is ready when exports land

### Phase 5d: Print Production
- [ ] Source 3 Cape Town printers (get quotes for 10-book pilot)
- [ ] Test print: verify colors, margins, QR readability at A4
  - Specifically verify CMYK conversion didn't shift brand colors
- [ ] 10-book pilot print run

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
|| 2026-02-09 | pdfkit for workbook generation | Dev-time PDF, not runtime; reproducible, no Canva dependency |
|| 2026-02-09 | CatmullRomCurve3 + TubeGeometry for letter paths | Smooth curves for tracing, easy checkpoint detection |
|| 2026-02-09 | 3-stroke letter A | Matches standard handwriting instruction; segment-based progress |
|| 2026-02-09 | Reuse SimpleCharacter across games | Same component, different color props; no code duplication |
|| 2026-02-09 | ALL_CHARACTER_COLORS (6) alongside MVP (3) | Backward compatible; games choose which set to use |
|| 2026-02-09 | Canva Pro + pdfkit hybrid for workbook | Canva Enterprise API costs unjustified at MVP; Canva Pro for visual design, pdfkit for print compilation. Polotno as fallback. |
|| 2026-02-09 | Full workbook production deferred to Phase 5 | Phase 4 pdfkit pages validated QR mapping + layout. 50-page production is a design task, not a dev task. |

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

### Phase 3
| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Home First Load JS | 96.3KB | 500KB | OK (unchanged) |
| Game First Load JS | 329KB | 500KB | OK (66%) |
| Parent Dashboard JS | 152KB | — | OK |
| Parent Login JS | 150KB | — | OK |
| QR Codes page JS | 98.1KB | — | OK |
| Static pages | 9 | — | +3 new parent pages |
| TypeScript errors | 0 | 0 | OK |
| ESLint warnings | 0 | 0 | OK |

### Phase 4
| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Home First Load JS | 96.3KB | 500KB | OK (unchanged) |
| Count Game JS | 331KB | 500KB | OK (66%) |
| Trace Game JS | 331KB | 500KB | OK (66%) |
| Static pages | 10 | - | +1 new game page |
| TypeScript errors | 0 | 0 | OK |
| ESLint warnings | 0 | 0 | OK |
| Workbook PDFs | 3 files | - | page-15, page-22, combined |

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

## Files Changed (Phase 4)

| File | Action | Description |
|------|--------|-------------|
| src/app/games/trace-letter-a/page.tsx | New | Full page assembly with phase routing, celebration |
| src/app/games/trace-letter-a/TraceLetterAGame.tsx | New | Orchestrator composing all tracing sub-components |
| src/app/games/trace-letter-a/lib/constants.ts | New | Letter A path data, Thandi position, colors, timing |
| src/app/games/trace-letter-a/lib/audioGenerator.ts | New | Web Audio API synthesis (tracing, checkpoint, letter sound) |
| src/app/games/trace-letter-a/hooks/useTracingState.ts | New | Zustand store: per-stroke progress, isTracing, completion |
| src/app/games/trace-letter-a/hooks/useAudioSetup.ts | New | Generate + load 11 audio blobs on mount |
| src/app/games/trace-letter-a/components/ThandiGuide.tsx | New | Thandi character wrapper with phase-aware behavior |
| src/app/games/trace-letter-a/components/WritingEnvironment.tsx | New | Ground, sky, easel board, bushes, flowers |
| src/app/games/trace-letter-a/components/LetterPath.tsx | New | CatmullRomCurve3 tube geometry with progress fill |
| src/app/games/trace-letter-a/components/TracingInteraction.tsx | New | Pointer raycasting to path checkpoint matching |
| src/app/games/trace-letter-a/components/TracingProgressOverlay.tsx | New | HTML overlay: stroke indicators + progress bar |
| src/app/games/trace-letter-a/components/TracingCelebration.tsx | New | 3 chars + floating letter A + confetti |
| src/app/games/count-to-five/lib/constants.ts | Enhanced | Added ALL_CHARACTER_COLORS (6 chars) + ALL_CHARACTERS |
| src/app/page.tsx | Enhanced | Added Trace Letter A game link |
| src/lib/qrCodes.ts | Enhanced | Added page 22 QR mapping for trace-letter-a |
| scripts/generate-workbook.ts | New | pdfkit workbook generator (page 15 + 22 + combined) |
| scripts/workbook-templates/counting-page.ts | New | Page 15: counting activity layout |
| scripts/workbook-templates/tracing-page.ts | New | Page 22: letter tracing activity layout |
| scripts/workbook-templates/shared/page-layout.ts | New | Shared layout: A4 dims, brand colors, Ndebele border, QR helper |
| package.json | Enhanced | Added workbook script, tsx + pdfkit dev deps |

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
