# CLAUDE.md — NovaLearning Router
<!-- Auto-loaded every session. This file routes — it does not contain project detail. -->
<!-- Last Updated: 2026-02-24 | Two-tier architecture v2.0 -->

---

## OPERATOR
Damian Harrison | HazHar Eco Solutions (Pty) Ltd | Cape Town, SA
Projects: NovaLearning · MediClaimSA · Website Rescue

---

## MANDATORY FIRST STEP
Before selecting any model, plugin, or tool — read:
1. `.claude/memory/routing-table.md` — task routing + plugin selection
2. `.claude/memory/novalearning-context.md` — project constants + guard rules

Match task → TASK TYPE. Load only what is listed. Nothing else.

---

## AGENT PROTOCOL
```
1. Read task
2. Read .claude/memory/routing-table.md
3. Match task → TASK TYPE
4. Load listed MODEL + PLUGINS + MCP TOOLS only
5. Check .claude/plans/active-plan.md (create if missing)
6. Print CONFIRMATION BLOCK
7. Execute
```

---

## CONFIRMATION BLOCK (required before every task)
```
TASK TYPE:   [matched type]
MODEL:       [model + one-word reason]
PLUGINS:     [names only]
MCP TOOLS:   [names only]
SKIPPING:    [excluded tools]
PLAN FILE:   [exists / creating now]
STARTING:    [first action in one sentence]
```

---

## MODEL RULES
```
Opus 4.6:     Game architecture · MediClaimSA · Multi-agent · High-stakes decisions
Opus /fast:   Live demos · Client sessions (same quality, lower latency)
Sonnet 4.6:   Frontend · Docs · Website Rescue · Git ops · DEFAULT
Haiku 4.5:    Pure research lookups · Single facts · Summaries only
```

---

## GLOBAL QUALITY GATES
```
orchestrator-discipline:  MUST confirm plan before any code starts
verification-gate:        MUST pass before any task = DONE
No exceptions for game builds or MediClaimSA logic.
```

---

## PROJECT ROOTS
```
NovaLearning:   C:\Users\h3ogr\novalearning-games\
MediClaimSA:    C:\Users\h3ogr\MedC 2\
Ubuntu Tales:   PARKED — do not develop until game MVP ships
```

---
*Route via routing-table.md. Project detail in novalearning-context.md. Keep this file under 60 lines.*
