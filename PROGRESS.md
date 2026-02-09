# NovaLearning -- Session Progress

## Session
- Date: 2026-02-09
- Phase: Phase 5 (Workbook Production Pipeline)

## Phase 3 -- COMPLETE
- [x] Schema aligned with deployed Supabase (students/student_progress/games/game_sessions)
- [x] New Supabase helpers: createGameSession, completeGameSession, upsertStudentProgress
- [x] Progress sync adapted for game_sessions + student_progress flow
- [x] Dashboard updated: children -> students, age_years -> age, added grade/avatar_emoji
- [x] Migration SQL rewritten to match live schema exactly
- [x] .env.local created with Supabase credentials
- [x] ErrorBoundary component added (Ubuntu-friendly: lion emoji + "Let's try again!")
- [x] Game page wrapped in ErrorBoundary
- [x] Loading skeleton already exists in GameShell (globe emoji + "Loading...")
- [x] Phase Gate 3 -> 4: PASSED

## Phase 4 -- COMPLETE
- [x] Trace Letter A with Thandi game (11 new files)
  - TraceLetterAGame orchestrator with phase transitions
  - LetterPath: CatmullRomCurve3 tube geometry + per-stroke progress fill
  - TracingInteraction: pointer raycaster to path checkpoint matching
  - WritingEnvironment: sky gradient, easel board, decorations
  - ThandiGuide: phase-aware character (wave/bounce)
  - TracingCelebration: 3 chars + floating letter A + confetti
  - useTracingState: Zustand store (3 strokes, per-stroke progress)
  - Audio: tracing tones, checkpoint dings, stroke chime, letter "A" sound
- [x] Extended character system to 6 (ALL_CHARACTER_COLORS + ALL_CHARACTERS)
- [x] Home page updated with Trace Letter A game card
- [x] QR code mapping: page 22 -> trace-letter-a
- [x] Workbook PDF generator: npm run workbook
  - Page 15: Counting activity (mango outlines, number tracing, drawing area)
  - Page 22: Letter A tracing (stroke guides, practice lines, "A is for..." matching)
  - Combined PDF with both pages
  - Shared layout: A4, Ndebele border, brand colors, QR placeholder
- [x] Phase Gate 4 -> 5: PASSED

## Build State
- TSC: PASS (0 errors)
- Lint: PASS (0 warnings)
- Build: PASS (10 static pages)
- Bundle: Home=96.3KB | Count=331KB (66%) | Trace=331KB (66%) | Parent=152KB
- Workbook: 3 PDFs in out/ directory

## Files Created (Phase 4)
| File | Description |
|------|-------------|
| src/app/games/trace-letter-a/page.tsx | Page assembly, phase routing, celebration |
| src/app/games/trace-letter-a/TraceLetterAGame.tsx | Orchestrator for tracing components |
| src/app/games/trace-letter-a/lib/constants.ts | Letter A path data, colors, timing |
| src/app/games/trace-letter-a/lib/audioGenerator.ts | Web Audio synthesis for tracing |
| src/app/games/trace-letter-a/hooks/useTracingState.ts | Zustand store: strokes, progress |
| src/app/games/trace-letter-a/hooks/useAudioSetup.ts | Audio blob generation + loading |
| src/app/games/trace-letter-a/components/ThandiGuide.tsx | Thandi wrapper |
| src/app/games/trace-letter-a/components/WritingEnvironment.tsx | 3D environment |
| src/app/games/trace-letter-a/components/LetterPath.tsx | Letter path tubes + progress |
| src/app/games/trace-letter-a/components/TracingInteraction.tsx | Touch tracing handler |
| src/app/games/trace-letter-a/components/TracingProgressOverlay.tsx | HTML progress UI |
| src/app/games/trace-letter-a/components/TracingCelebration.tsx | Celebration scene |
| scripts/generate-workbook.ts | Workbook PDF generator |
| scripts/workbook-templates/counting-page.ts | Page 15 template |
| scripts/workbook-templates/tracing-page.ts | Page 22 template |
| scripts/workbook-templates/shared/page-layout.ts | Shared page layout |

## Files Modified (Phase 4)
| File | Change |
|------|--------|
| src/app/games/count-to-five/lib/constants.ts | Added ALL_CHARACTER_COLORS, ALL_CHARACTERS |
| src/app/page.tsx | Added Trace Letter A game link |
| src/lib/qrCodes.ts | Added page 22 QR mapping |
| package.json | Added workbook script + tsx/pdfkit dev deps |

## Spec Reconciliation -- COMPLETE
- [x] Rainbow Nation Edition spec reconciled with existing codebase
  - Stripped: AR references, Phaser.js, React Native, 25-game scope
  - Kept: 50-page content outline, articulation hierarchy, production specs, financial model, market strategy
  - Confirmed: 2 games for MVP (Count to 5 + Trace Letter A), R3F stack, PWA only, NO AR
- [x] Created `docs/workbook-content-map.md` — 50-page content outline
  - Section 1 (pp 1-6): Rainbow Nation Foundation
  - Section 2 (pp 7-32): Literacy A-Z with SA animals + cultural values
  - Section 3 (pp 33-42): Rainbow Numeracy (1-10 with sporting/cultural context)
  - Section 4 (pp 43-50): Ubuntu Life Skills
  - Template distribution: ACT ×19, WRT ×18, COL ×9, MAT ×4, SEQ ×2
  - QR codes: pages 15 and 22 ONLY (2 MVP games)
- [x] Updated `projectplan.md` with:
  - Articulation hierarchy (8-level pedagogical framework)
  - Enriched Phase 5b with content map reference and section breakdown
  - Production specs (150gsm, perfect bound, laminated cover)
  - Financial model (R180 price, R40 cost, 303 break-even)
  - Expanded Phase 6 market entry strategy (pilots, B2C, provincial expansion)
  - 8 new decisions log entries (spec reconciliation rejections + adoptions)

## Phase 5 -- IN PROGRESS (Workbook Production Pipeline)
**Status:** Content map created. Ready for Canva Pro design.

**Architecture Decision:** Canva Pro + pdfkit hybrid
- Canva Pro ($12.99/mo) for visual design of 50 pages
- Content guide: `docs/workbook-content-map.md` (page-by-page outline)
- Existing pdfkit pipeline for print compilation (QR codes, bleed, crop marks)
- Ghostscript post-process for RGB->CMYK conversion (FOGRA39 ICC profile -> PDF/X-1a)
- Polotno Studio (already forked) as fallback if Canva dependency becomes problematic

### 5a: Design System Setup
- [ ] Canva Pro workspace + brand kit (CMYK palette, fonts, character illustrations)
- [ ] 5 master templates (Activity, Coloring, Writing, Matching, Sequencing)
- [ ] Universal page elements (name field, page #, logo, QR zone, reward, Ubuntu moment)

### 5b: Page Design (in Canva)
- [ ] Design 50 pages per `docs/workbook-content-map.md` (~5 weeks at 10 pages/week)
- [ ] Teacher review checkpoints at pages 10, 25, 50
- [ ] Export as 300 DPI PNG

### 5c: Print Pipeline (pdfkit + Ghostscript)
- [ ] Enhance generate-workbook.ts: stream Canva PNGs, insert QR codes (pp 15+22 only), bleed, crop marks
- [ ] RGB->CMYK conversion via Ghostscript with FOGRA39 ICC profile
- [ ] PDF/X-1a compliance validation
- [ ] Start 5c dev during weeks 1-2 of 5b (parallel track)

### 5d: Print Production
- [ ] 150gsm paper, perfect bound, laminated cover, 52 pages (50 + 2 covers)
- [ ] Source 3 Cape Town printers, test print (verify CMYK), 10-book pilot

**Critical Path:** 5b page design (~5 weeks). 5c pipeline dev should run in parallel during weeks 1-2.
**Dependencies from Phase 4:** QR-to-game mapping validated, Ndebele border patterns validated, page-layout.ts scaffold in place

## Manual Steps
- [ ] Deploy to Vercel (npx vercel login + npx vercel --prod)
- [ ] Verify both games at deployed URL
- [ ] Replace workbook QR placeholders with actual QR code images
- [ ] Replace workbook emoji placeholders with SA-themed illustrations
