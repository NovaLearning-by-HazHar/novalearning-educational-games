# novalearning-context.md — Full Project Context
<!-- Loaded on demand via CLAUDE.md. Contains all project constants. -->
<!-- Last Updated: 2026-02-24 | Merged from 4 source files -->

---

## PROJECT IDENTITY
NovaLearning: Ubuntu-first offline web-based 3D educational games for SA Grade R (ages 4-6).
CAPS-aligned. Galaxy A03 optimised. Offline-first PWA. MVP domain: money-skills.
QR-code triggered after workbook completion. English-only MVP.

---

## TECH STACK
```
Engine:      Three.js r128 ONLY (never import newer versions)
Framework:   Next.js (App Router)
Hosting:     Vercel (edge functions, CDN)
DB:          Supabase (auth, progress tracking)
Payments:    Stripe (parent subscriptions)
Language:    TypeScript strict mode — no .js, no any types
State:       Zustand (global) · useState (local)
CSS:         Tailwind utility classes — no CSS modules
Tests:       Vitest (unit) · Playwright (e2e)
Commits:     Conventional commits (feat:, fix:, perf:)
```

---

## DEVICE CONSTRAINTS (Galaxy A03 — #1 constraint)
```
RAM:         2GB — budget ~60MB for app
GPU:         Mali-G52 — WebGL 1.0 safe, NO WebGL 2.0 features
Network:     Intermittent 3G — offline-first mandatory
Bundle:      <500KB JS | <3s on 3G | 30fps min | <100MB RAM
FPS:         Target 60fps — minimum 30fps acceptable
Draw calls:  <50 per frame
VRAM:        <50MB
Geometry:    <5K triangles per model | <10,000 vertices per scene
Textures:    256x512px max WebP/AVIF — NO 512x512 unless justified
Audio:       MP3 mono, 22kHz, <100KB per clip
Antialias:   DISABLED
Shadows:     DISABLED
Materials:   Lambert only
Font:        Nunito ONLY — Comic Neue banned entirely
Touch:       48px minimum — no exceptions
```

---

## UNIVERSAL SCAFFOLD
```
ENCOUNTER → IDENTIFY → COMBINE → APPLY
Orboot:  EXPLORE → DISCOVER → PRACTICE → CELEBRATE
```

---

## UBUNTU PHILOSOPHY ("I am because we are")
Every mechanic must reinforce:
- Cooperative > competitive — help friends, not beat enemies
- Community achievements, not individual leaderboards
- Sharing resources as core gameplay loop
- Group celebrations on success
- Characters that need help, not defeating

BANNED mechanics: `scores, leaderboards, stars, timers-as-pressure, competitive-rankings, streak-counters, lock-gates`

---

## CHARACTERS (Bible v2.0 — 2026-02-24) ← CANONICAL

**In-Game (voiced, interactive — Rainbow Nation roster):**
| Name | Community | Role | Status |
|------|-----------|------|--------|
| Sipho | Zulu | The Friend — eager, energetic | ✅ Generated |
| Aisha | Cape Malay | The Creator — imaginative, expressive | ✅ Generated |
| Anke | Afrikaans (white) | The Helper — caring, nurturing | ✅ Generated |
| Naledi | Xhosa | The Leader — confident, wise | ⏳ Needs generation |
| Priya | Indian/Tamil | The Thinker — curious, precise | ⏳ Needs generation |
| Chanel | Coloured | The Storyteller — warm, funny | ⏳ Needs generation |

Visual direction: Pixar-cartoon 3D style.

**RETIRED (never use):** Gogo Thandi, Amahle, Jabu, Liya, Themba, Lerato — superseded by Bible v2.0.

**Brand Mascots (images only — workbooks, marketing, loading screens):**
Ella (Elephant) · Ardo (Aardvark) · Zara (Zebra) · Siyanda (SA girl)

---

## COLOUR CONSTANTS
```
Brand:    --nova-green: #007749  --nova-gold: #FFB612  --nova-orange: #E67E22
CAPS:     --caps-maths: #457B9D  --caps-language: #2A9D8F  --caps-life: #E9C46A
Scaffold: --encounter: #52B788  --identify: #4EA8DE  --combine: #9B72CF  --apply: #FF6B6B
```

---

## AGENT RESPONSIBILITIES
| Agent | Domain | Debug Authority |
|-------|--------|----------------|
| Alex | Strategy, business, proposals | Business logic, pricing |
| Kimbal | Content, narrative, curriculum | Content pipeline, MCP tools |
| Harlan | QA, validation, compliance | ALL errors — final authority |
| Hazely | Support, docs, community | Communication, workflows |
| Elon | Code, tech, performance | All technical/code errors |

Escalation: Any agent → Harlan → Damian (if CRITICAL)
Model routing: Haiku → mechanical | Sonnet → components | Opus → architecture only

---

## 4 GUARD RULES (check before every commit)

**1. Performance Guard**
Bundle <500KB? Textures <=256x512px? Models <5K tri? No WebGL 2.0? Frame budget active?

**2. GBL Guard**
No stars/points/leaderboards? Debrief present? Parent bridge accessible? Orboot loop complete?

**3. Ubuntu Guard**
No competitive mechanics? Community benefit as win condition? "We" language? No individual hero?

**4. Accessibility Guard**
Touch >=48px? No text-only instructions? Audio for all text? High contrast supported?

---

## PERFORMANCE RULES (enforced before any PR/deploy)
```
1. npm run build — zero warnings
2. Bundle analysis — no single chunk >200KB
3. Lighthouse mobile >80
4. No useEffect without cleanup
5. All Three.js geometries/materials disposed on unmount
6. Texture loading via useLoader with Suspense boundaries
7. No synchronous asset loading — everything async
8. Object pooling for frequently created/destroyed objects
```

---

## CONFLICT RULINGS (2026-02-24 — canonical)
| # | Conflict | Ruling |
|---|----------|--------|
| 1 | Font: Comic Neue vs Nunito | **Nunito only. Comic Neue banned.** |
| 2 | aframe: Tier 1 vs MVP ban | **Tier 4 for MVP.** Phase 3+ only. |
| 3 | phaser-expert skill | **docs/skills/phaser-expert.md canonical.** No stars/locks/streaks. |
| 4 | Touch: 44px vs 48px | **48px minimum everywhere.** |
| 5 | Characters: various lists | **Bible v2.0 canonical.** 6 in-game characters above. |
| 6 | Agent team: 5 vs 8 | **5 named agents.** Skill-12's 8 are sub-roles under Elon. |

---

## REPO LOOKUP ORDER (mandatory before building from scratch)
1. Tier 0 (8): three, phaser, zustand, nextjs, tailwindcss, supabase, vercel, typescript
2. Tier 1 (12): gsap, react-three-fiber, workbox, jest, playwright, storybook, eslint, prettier, husky, github-actions, framer-motion
3. Tier 2 (15): howler, matter-js, cannon, lottie-react, react-query, zod, pdf-lib, canvas-confetti, use-gesture + 6 more
4. Tier 3 (8): lodash, classnames, react-error-boundary, react-hot-toast, react-window + 3 more
5. Tier 4 (Phase 3/4 only): tensorflow, mediapipe, webrtc, socket.io, aframe
6. Build from scratch — only if nothing found above

Full list: `docs/shared/47_ESSENTIAL_REPOSITORIES.md`

---

## DOCS FOLDER STRUCTURE
```
docs/
├── always/            → core-principles.md
├── gdds/              → 00-GDD-TEMPLATE through 07-GDD-UBUNTU-COMMUNITY
├── skills/            → 14 numbered skill files + phaser-expert.md
├── shared/            → Scope Instruction, Handoff, 47 Repos, engine-spec, projectplan
├── design/            → Style Guide, SA Education Brief, Canva specs
├── session-templates/ → session-01 through session-06
├── archive/           → Knowledge Base, File Consolidation Map
├── skills-registry.md
├── skills-conflicts.md
├── context-map.json   → Task type → file loading map
└── setup-folders.ps1
```

---

## NOTION SYNC
ECKB data source: `collection://bdc1c8eb-ed85-4453-9238-37c5eeb06072`
After logging any fix → sync to Notion ECKB with standard properties.

---

## SESSION PROTOCOL
Start: Read CLAUDE.md + routing-table.md + this file. Load task-type files from context-map.json.
End: Log fixes to FIXES.md → Sync Notion → Update projectplan → git commit.
Emergency: 3+ failed attempts → STOP → Log partial → Skip → Move on.

---
*Merged 2026-02-24 from: CLAUDE.md (170L), CLAUDE_md_NovaLearning.md (108L). Junk from CLAUDE__1_.md discarded.*
