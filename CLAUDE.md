# NOVALEARNING — CLAUDE CODE TERMINAL PROMPT (Level 3)
### Version: 2026-02-09 | Optimized for Claude Code CLI

---

## MISSION
South African EdTech: 50-page workbook (R150-R350) + QR-linked browser 3D games for Grade R (ages 5-6). Ubuntu philosophy ("I am because we are") is ARCHITECTURE, not decoration. Baseline device: Samsung Galaxy A03 (3GB RAM, Mali GPU, WebGL 1.0). English only for MVP. Ship fast.

---

## CURRENT STATE
- **Phase 0** COMPLETE (commit 9485f54) — scaffold, types, stores, agents
- **Phase 1** COMPLETE (commit 3e14344) — engine, device detect, audio, touch, perf
- **Phase 2** COMPLETE (commit df5cc88) — "Count to 5 with Sipho" game (14 files)
- **Phase 3** COMPLETE — auth UI, parent dashboard, QR codes, Vercel config, progress sync
- **Phase 4** NEXT — Second game (Trace Letter A with Thandi) + workbook pages
- **Build:** Home 96.3KB | Game 329KB (66%) | Parent 152KB | 0 errors | 9 pages
- **Tracking:** `projectplan.md` has full phase checklists + decisions log

### Key Files
```
src/app/games/count-to-five/    # 14 files: page, orchestrator, 8 components, 2 hooks, 2 lib
src/app/parent/login/page.tsx   # Parent auth (sign in/signup, null-safe Supabase)
src/app/parent/dashboard/page.tsx # Child management + local progress viewer
src/app/parent/qr-codes/page.tsx  # Workbook QR code reference for print
src/components/Scene.tsx         # R3F canvas (Galaxy A03 config, WebGL 1.0)
src/components/ProgressSyncProvider.tsx # Auto-sync wrapper (inert without auth)
src/stores/gameStore.ts          # Zustand: EXPLORE->DISCOVER->PRACTICE->CELEBRATE
src/stores/progressStore.ts      # Zustand persist: completed games + session metrics
src/lib/supabase.ts              # Null-safe client + upsertProgress/getChildProgress
src/lib/eventBus.ts              # Typed pub-sub singleton for game events
src/lib/qrCodes.ts               # Workbook page-to-game URL + QR image generation
src/lib/useSupabaseAuth.ts       # Auth state machine (null-safe when no Supabase)
src/lib/useGameSession.ts        # Ref-based session tracking, emits via eventBus
src/lib/useProgressSync.ts       # Debounced Supabase sync, offline-resilient
```

---

## LOCKED DECISIONS — DO NOT REVISIT
| Decision | Chosen | REJECTED (never suggest) |
|----------|--------|--------------------------|
| AR | **NO AR** | Camera AR, A-Frame, AR.js, WebXR |
| QR codes | **Opens browser URL** | Camera/marker scanning |
| MVP language | **English only** | Multi-language (Phase 2+) |
| Game framework | **React + Three.js (R3F)** | Phaser 3, Unity, native apps |
| State | **Zustand** | Redux, Context API |
| Competition | **None** | Leaderboards, scores, rankings |
| Hosting | **Vercel** | AWS, Netlify, self-hosted |
| Backend | **Supabase** | Firebase, custom backend |
| Distribution | **PWA (web only)** | Native app, App Store |

### Red Flags — Stop If You See:
- AR, A-Frame, WebXR, camera permissions
- Native app or App Store references
- Competitive mechanics ("winner", "score", "leaderboard")
- Failure states ("Game Over", "Wrong!", "Try harder")
- WebGL 2.0 features (compute shaders, transform feedback)
- Assets >50KB or textures >512x512
- Bundle approaching 1MB
- Content requiring reading ability
- Firebase or non-Supabase backend

---

## VERSION PINS + API GOTCHAS

### Dependencies (exact)
```
next@14.2.35  react@18  @react-three/fiber@8.18.0  @react-three/drei@9.122.0
three@0.160.1  zustand@5.0.11  animejs@4.3.5  howler@2.2.4
next-pwa@5.6.0  @supabase/supabase-js@2.95.3  posthog-js@1.343.0
```

**CRITICAL: R3F v8 with React 18.** R3F v9+ requires React 19. Next.js 14 ships React 18. Do NOT upgrade.

### anime.js v4 API (NOT v3)
```typescript
import { animate, createTimeline } from 'animejs'  // NO default export
animate(target, props)                               // NOT anime({ targets })
createTimeline({ defaults, onComplete })             // NOT anime.timeline()
timeline.add(target, props, offset)                  // NOT .add({ targets }, offset)
ease: 'inOutQuad'                                    // NOT easing: 'easeInOutQuad'
```

### Environment
- **Shell:** git bash (NOT cmd.exe) — use bash commands
- **Config:** `next.config.js` (CommonJS, required by next-pwa)
- **Export:** `output: 'export'` (static SSG, no API routes)
- **Windows:** `robocopy` exit code 1 = success; `.bashrc` BOM warning is harmless

---

## PERFORMANCE BUDGETS
| Metric | Target | Hard Limit |
|--------|--------|------------|
| Initial load | < 3s | 5s |
| Frame rate | 30 fps | 24 fps min |
| Bundle size | < 500 KB | 1 MB |
| Memory | < 200 MB | 300 MB |
| Per-asset | < 50 KB | 100 KB |
| Textures | 512x512 | 1024x1024 |
| Triangles | < 5K/model | 10K |

**Rendering:** WebGL 1.0 ONLY. No post-processing, no real-time shadows, flat/toon shading, GLTF/GLB format.

---

## UBUNTU RULES (Enforced in ALL Code)
```
DO: Community celebration, characters help each other, "Let's try again!",
    shared achievement, marimba melodies, Ndebele patterns, diverse representation
DON'T: Leaderboards, scores, rankings, competition, failure states,
       game over screens, lives, timer pressure, punitive feedback, reading required
```

### 6 Rainbow Nation Characters
| Name | Heritage | Personality | Learning Style |
|------|----------|-------------|----------------|
| Sipho | Zulu | Brave explorer | Kinesthetic |
| Thandi | Xhosa | Creative storyteller | Visual |
| Lerato | Sotho | Kind helper | Social |
| Pieter | Afrikaans | Curious builder | Logical |
| Fatima | Cape Malay | Patient teacher | Auditory |
| Amahle | Ndebele | Joyful artist | Creative |

MVP uses 3 (Sipho, Thandi, Lerato). All 6 defined in `src/types/constants.ts`.

---

## ARCHITECTURE
### Gameplay Loop (every game)
`EXPLORE -> DISCOVER -> PRACTICE -> CELEBRATE`
Managed by `gameStore.ts`: `advancePhase()`, `targetInteractions`, auto-celebrate.

### Established Patterns
- **Scene.tsx** — DeviceConfig-driven R3F Canvas (dpr, antialias per tier)
- **SimpleCharacter** — Procedural ~300 tri figure, reusable across games
- **audioGenerator.ts** — Web Audio API synthesis (zero file downloads)
- **useCountingState** — Game-specific Zustand store pattern
- **CountingCelebration** — 3 chars + instanced confetti template

### Agent files: `.claude/agents/` (10 specialist agents with tool permissions)

---

## SESSION PROTOCOL
```
1. Start: /plan mode
2. Iterate plan until solid
3. Implement (auto-accept or per-edit)
4. Run /project:verify after significant changes
5. Before clearing: write state to PROGRESS.md
6. /clear then /project:catchup to resume
7. NEVER use /compact — always Document & Clear
```

### Thinking Triggers (match to task complexity)
- `think` (4K tokens) — quick fixes, config changes
- `think hard` / `megathink` (10K) — schema design, refactoring
- `ultrathink` (32K) — architecture, complex debugging (use sparingly)

### Cost Management
- Standard Opus: $15/$75 per MTok | Fast mode: $30/$150
- Multi-agent = 3-4x cost. Only use when tasks are genuinely parallel.
- Check `/cost` every 30 minutes during long sessions.

---

## PHASE 4: SECOND GAME + WORKBOOK (NEXT)
- [ ] Second game: Trace Letter A with Thandi (Language)
  - Reuse SimpleCharacter, GameShell, gameStore phase machine
  - New touch-tracing mechanic (finger follows letter path)
  - Thandi as guide character (Creative storyteller, Visual learner)
- [ ] Workbook page 15: Counting activity + QR code (count-to-five)
- [ ] Workbook page layout template for Canva
- [ ] Extend to 6 characters (add Pieter, Fatima, Amahle to SimpleCharacter)

### Manual Steps (before Phase 4)
- [ ] Create Supabase project (supabase.com → Africa South)
- [ ] Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
- [ ] Add `.env.local` with NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Connect repo to Vercel and deploy

**Constraints:** Static export = no API routes. Supabase client-side SDK only. Games MUST work without backend.
