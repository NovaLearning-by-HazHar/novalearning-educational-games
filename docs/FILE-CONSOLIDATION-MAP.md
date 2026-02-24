# NovaLearning — File Consolidation Map
## Purpose: Reduce 11 overlapping docs → 4 authoritative files
## Used by: Claude Code (Step 1, one-time, run on Haiku)
## Date: 2026-02-23

---

## THE PROBLEM

11+ documentation files share ~70% overlapping content, burning ~45K context tokens per session. This wastes money and confuses Claude Code about which file is authoritative.

---

## 4 AUTHORITATIVE FILES (KEEP & MAINTAIN)

| # | File | Purpose | Max Lines | Loads Every Session? |
|---|---|---|---|---|
| 1 | `CLAUDE.md` | Session loader, agent system, quick constraints | 150 | ✅ Yes |
| 2 | `brand-guide.md` | Colours, typography, touch targets, visual pipeline | 200 | ✅ Yes |
| 3 | `GAME-BRIEF.md` | Characters, 6 game modes, data schemas, build order | 300 | ✅ Yes |
| 4 | `docs/engine-spec.md` | Universal engine tech spec, renderer config, asset budgets | 500 | ❌ Only when needed |

**Total token budget per session:** ~15K tokens (down from ~45K)

---

## 7 FILES TO ARCHIVE (move to `docs/archive/`)

### 1. NOVA-CLAUDE-CODE-MASTER-BRIEF.md → Archive
**Why:** 90% duplicate of GAME-BRIEF.md
**Merge before archiving:**
- Any character details not in GAME-BRIEF.md → copy to GAME-BRIEF.md
- Any build order info not in projectplan.md → copy to projectplan.md
- Then move to `docs/archive/`

### 2. NOVALEARNING-GAME-FRAMEWORK.md → Archive
**Why:** Overlaps GAME-BRIEF.md (game modes) + engine-spec.md (Orboot loop)
**Merge before archiving:**
- Orboot 4-phase loop detail → docs/engine-spec.md
- GBL research principles → GAME-BRIEF.md (add a "Pedagogy" section)
- Kenney.nl asset list → GAME-BRIEF.md
- Then move to `docs/archive/`

### 3. novalearning-universal-engine-spec.md → Rename + Archive original
**Why:** This IS the engine spec, just badly named
**Action:**
- Copy to `docs/engine-spec.md` (the authoritative location)
- Clean up: remove any content already in GAME-BRIEF.md
- Move original to `docs/archive/`

### 4. novalearning-engine-spec.jsx → Archive
**Why:** React visualization of engine layers — reference only, not needed by Claude Code
**Action:** Move to `docs/archive/` (keep for Damian's reference)

### 5. novalearning-asset-pipeline.md → Merge into GAME-BRIEF.md
**Why:** Asset pipeline info belongs with game content
**Merge before archiving:**
- Visual pipeline (3D → workbook → QR) → brand-guide.md
- Asset budget tables → docs/engine-spec.md
- Kenney pack list → GAME-BRIEF.md
- Then move to `docs/archive/`

### 6. Agent_Instructions.md → Merge into CLAUDE.md
**Why:** WAT framework (Workflows, Agents, Tools) belongs in session loader
**Merge before archiving:**
- Agent roster (5 departments, 12 agents) → CLAUDE.md
- Activation commands ("Hey [Department]") → CLAUDE.md
- Tool references → CLAUDE.md
- Then move to `docs/archive/`

### 7. NOVA-CORE.md + NOVA-CORE-prompts.md → Reconstruct
**Why:** Agent personalities and prompts need to live in `.claude/agents/` not loose docs
**Action:**
- Extract agent personality data → `.claude/agents/[agent-name].md` (one per agent)
- Core constraints → already in CLAUDE.md
- Move originals to `docs/archive/`

---

## MERGE CHECKLIST

Before archiving each file, verify NO unique content is lost:

```
For each file being archived:
  1. Read the file
  2. For each section/paragraph:
     - Is this info already in one of the 4 authoritative files? → Skip
     - Is this unique info? → Copy to the correct authoritative file
  3. After all unique content is merged → move to docs/archive/
  4. Update any references in CLAUDE.md or other files
```

---

## POST-CONSOLIDATION VERIFICATION

After all files are consolidated, verify:

- [ ] `CLAUDE.md` contains: agent roster, activation commands, session load order, key constraints
- [ ] `brand-guide.md` contains: full colour palette, typography, touch targets, visual pipeline
- [ ] `GAME-BRIEF.md` contains: 5 characters, 6 game modes, data schemas, build order, pedagogy section, Kenney assets
- [ ] `docs/engine-spec.md` contains: Galaxy A03 constraints, renderer config, adaptive quality tiers, asset budgets, Orboot loop, memory management
- [ ] All 7 archived files are in `docs/archive/`
- [ ] No broken references in remaining files
- [ ] `projectplan.md` updated with consolidation report

---

## DIRECTORY AFTER CONSOLIDATION

```
C:\Users\h3ogr\novalearning-games\
├── CLAUDE.md                          ← Session loader (150 lines)
├── brand-guide.md                     ← Visual decisions (200 lines)
├── GAME-BRIEF.md                      ← Game content (300 lines)
├── projectplan.md                     ← Sprint status
├── docs/
│   ├── engine-spec.md                 ← Tech spec (500 lines)
│   ├── FILE-CONSOLIDATION-MAP.md      ← This file (reference only)
│   └── archive/                       ← Old files (never load)
│       ├── NOVA-CLAUDE-CODE-MASTER-BRIEF.md
│       ├── NOVALEARNING-GAME-FRAMEWORK.md
│       ├── novalearning-universal-engine-spec.md
│       ├── novalearning-engine-spec.jsx
│       ├── novalearning-asset-pipeline.md
│       ├── Agent_Instructions.md
│       ├── NOVA-CORE.md
│       └── NOVA-CORE-prompts.md
├── .claude/
│   └── agents/                        ← Agent personality files
│       ├── alex.md
│       ├── kimbal.md
│       ├── hazely.md
│       ├── harlan.md
│       └── elon.md
└── src/                               ← Code goes here
```

---

## TOKEN SAVINGS ESTIMATE

| Before | After | Savings |
|---|---|---|
| 11 files × ~4K tokens avg = ~45K tokens/session | 4 files × ~3.5K tokens avg = ~15K tokens/session | ~30K tokens/session |

At Opus 4.6 pricing ($15/MTok input): saves ~$0.45/session on context loading alone.
At Sonnet pricing ($3/MTok input): saves ~$0.09/session.
Over 100 sessions: $9–$45 saved just on doc loading.

---

*This file is consumed once during consolidation, then ignored. Do not load it in regular sessions.*
