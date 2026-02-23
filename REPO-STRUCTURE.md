# NovaLearning Games — Repository Structure

> **What actually exists.** No phantom files, no aspirational folders.
> Last updated: 2026-02-22

## Root

```
C:\Users\h3ogr\novalearning-games\
│
├── README.md                          # Project overview
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript config
├── vite.config.ts                     # Build config (Galaxy A03 optimised)
├── .gitignore
│
├── public\                            # Static assets served as-is
│   ├── index.html                     # Entry HTML
│   ├── manifest.json                  # PWA manifest
│   └── sw.js                          # Service worker (offline support)
│
└── src\                               # All source code
    ├── index.ts                       # App entry point & barrel export
    │
    ├── types\                         # ── Type Definitions ──────────
    │   ├── index.ts                   # Barrel export
    │   └── progress.ts                # ★ Core types: learner, phases,
    │                                  #   domains, sessions, concepts
    │
    ├── services\                      # ── Platform Services ─────────
    │   ├── index.ts                   # Barrel export
    │   ├── OfflineProgressStore.ts    # ★ localStorage persistence
    │   │                              #   (save/load/sync/migrate)
    │   ├── ParentNotificationService.ts # ★ WhatsApp-ready summaries
    │   │                              #   (daily, weekly, nudges)
    │   └── CrossDomainConnectionService.ts # ★ Cross-domain concept
    │                                  #   reinforcement (Series A feature)
    │
    ├── education\                     # ── Education Logic ───────────
    │   ├── index.ts                   # Barrel export
    │   └── DomainContextManager.ts    # ★ Universal Scaffold router
    │                                  #   (1 engine, 7 content packs)
    │
    └── ai\                            # ── AI Cost Control ───────────
        ├── index.ts                   # Barrel export
        └── ModelRouter.ts             # ★ Haiku/Sonnet/Opus routing
                                       #   (80/15/5% split)
```

### Legend

- `★` = New files (the 6-file service layer)
- All other files are existing project scaffolding

---

## What each folder does

| Folder | Purpose | Status |
|--------|---------|--------|
| `src/types/` | Shared type definitions — everything imports from here | ✅ Complete |
| `src/services/` | Platform services: persistence, notifications, connections | ✅ Complete |
| `src/education/` | Education logic: scaffold phases, domain routing, content packs | ✅ Complete |
| `src/ai/` | AI model routing and cost control | ✅ Complete |
| `public/` | Static assets and PWA config | Scaffolded |

---

## Folders that do NOT exist yet

These will be needed as the project grows. **Do not create them until needed.**

| Future Folder | When to create | What goes there |
|--------------|----------------|-----------------|
| `src/engine/` | When integrating Three.js game loop | Game engine, renderer, scene manager |
| `src/content-packs/` | When building Money Skills MVP | Per-domain content (levels, assets, concepts) |
| `src/components/` | When building React UI | UI components (buttons, HUD, menus) |
| `src/assets/` | When adding textures/models | Optimised assets (<512px textures, <10K vertex models) |
| `src/workers/` | When adding background sync | Web workers for sync queue processing |

---

## Dependency graph (build order)

```
progress.ts (types)
    │
    ├──→ OfflineProgressStore.ts
    │         │
    │         ├──→ ParentNotificationService.ts
    │         │
    │         └──→ CrossDomainConnectionService.ts
    │
    ├──→ DomainContextManager.ts
    │         │
    │         └──→ CrossDomainConnectionService.ts
    │
    └──→ ModelRouter.ts (standalone, no internal deps)
```

---

## Key constraints

- **Galaxy A03**: 2GB RAM, Mali-G52 GPU, Android 11+
- **Bundle**: <500KB initial load
- **Storage**: localStorage (NOT IndexedDB) — sync, fast, zero-dependency
- **Offline**: 100% functionality without network
- **Philosophy**: Ubuntu — cooperative, not competitive
- **Curriculum**: CAPS aligned, English-only MVP
- **AI costs**: Haiku 80% / Sonnet 15% / Opus 5%
