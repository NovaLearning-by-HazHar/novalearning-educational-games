# routing-table.md — Full Task Router
*Loaded on demand by CLAUDE.md. Contains all routing detail.*

---

## 🎮 GAME DEVELOPMENT
*Triggers: "build game", "Three.js", "NovaLearning game", "ENCOUNTER", "Money Skills", "game scene", "Rosebud", "WebSim", "game demo", "Galaxy A03"*

```
MODEL:    claude-opus-4-6 (architecture complexity)
FAST:     /fast for live demos, client sessions

PLUGINS:
  - feature-dev          ← explore → architect → build → review pipeline
  - orchestrator-discipline  ← MANDATORY: plan before any code
  - verification-gate    ← MANDATORY: must pass before DONE
  - ralph-loop           ← iterative build→test→fix cycle
  - security-guidance    ← hooks warn on unsafe patterns
  - context7             ← Three.js r128 docs on demand

MCP:
  - context7             ← live library docs
  - github               ← check 249 repos BEFORE building

SKILLS:
  - .claude/skills/ai-web-game-builder/SKILL.md  ← LOAD FIRST for any game task

SKIP: firebase, playwright, frontend-design, commit-commands
```

### Tool Decision Matrix (When to Use What)

| Need | Tool | Time to Demo | Use When |
|------|------|--------------|----------|
| Playable prototype fast | Rosebud.ai | 15 min | Investor demo, concept validation, game jam |
| Custom Three.js scene | Cursor + Claude | 2-4 hrs | Specific mechanics, custom shaders, precise control |
| Complex game logic | Claude Code | 4-8 hrs | State machines, AI behavior, multi-file architecture |
| Quick landing/demo page | WebSim.ai | 30 min | Marketing site, interactive mockup, pitch deck supplement |
| Pure Three.js from scratch | Claude Code | 6-12 hrs | Full custom game, no external dependencies |

### Galaxy A03 Hard Constraints (NEVER EXCEED)

| Metric | Limit | How to Check |
|--------|-------|--------------|
| Frame rate | ≥30 FPS | `stats.js` or Chrome DevTools |
| Draw calls | <50/frame | `renderer.info.render.calls` |
| Triangles | <100K visible | `renderer.info.render.triangles` |
| Texture memory | <50MB | `renderer.info.memory.textures` |
| JS heap | <100MB | Chrome DevTools → Memory |
| Initial load | <3 seconds | Lighthouse |
| Total bundle | <5MB | Network tab |
| Three.js version | r128 ONLY | Never import newer |

---

## 🖥️ FRONTEND / UI / ARTIFACT
*Triggers: "build UI", "component", "artifact", "dashboard", "landing page", "HTML"*

```
MODEL:    claude-sonnet-4-6

PLUGINS:
  - frontend-design      ← UI/UX component creation
  - code-simplifier      ← clean up after build
  - verification-gate    ← quality check before delivery
  - playwright           ← E2E test the UI if needed

MCP:
  - github               ← check existing assets first

SKIP: context7, firebase, orchestrator-discipline, feature-dev
```

---

## 📊 DOCUMENTS / DECKS / PDFs
*Triggers: "report", "deck", "pitch", "proposal", "docx", "PDF", "pptx"*

```
MODEL:    claude-sonnet-4-6

PLUGINS:
  - superpowers          ← combines capabilities for complex docs

MCP:
  - github               ← only if referencing code in doc

SKIP: All dev plugins, context7, firebase, playwright
```

---

## 🤖 MULTI-AGENT / ORCHESTRATION
*Triggers: "run agents", "automate", "pipeline", "Alex/Kimbal/Harlan/Hazely/Elon"*

```
MODEL:    claude-opus-4-6

PLUGINS:
  - orchestrator-discipline  ← MANDATORY first
  - feature-dev          ← delegate specialized tasks
  - verification-gate    ← gate every agent output
  - agent-sdk-dev        ← if building new agents
  - plugin-dev           ← if building new plugins

MCP:
  - github               ← if agents touch code

SKIP: playwright, frontend-design, firebase (unless task needs it)
```

---

## 🏥 MEDICLAIMSA
*Triggers: "MediClaimSA", "medical claims", "pre-validation", "John Van Zyl", "ICD"*

```
MODEL:    claude-opus-4-6 (domain accuracy — no hallucinations)
ROOT:     C:\Users\h3ogr\MedC 2\

PLUGINS:
  - orchestrator-discipline  ← plan before any implementation
  - verification-gate    ← medical accuracy must pass
  - security-guidance    ← patient data protection
  - feature-dev          ← structured build pipeline
  - typescript-lsp       ← type safety on all claims logic

MCP:
  - firebase             ← database ops
  - github               ← repo management

SKIP: context7, frontend-design, playwright (unless UI task)
```

---

## 🌐 WEBSITE RESCUE
*Triggers: "Website Rescue", "client website", "broker site", "R15K", "R50K", "redesign"*

```
MODEL:    claude-sonnet-4-6

PLUGINS:
  - frontend-design      ← UI mockups and build
  - code-review          ← review before client delivery
  - verification-gate    ← quality gate before shipping
  - playwright           ← test client site cross-browser
  - commit-commands      ← clean commits for client repo

MCP:
  - github               ← client repo management

SKIP: context7, firebase, orchestrator-discipline, agent-sdk-dev
```

---

## 🔍 RESEARCH / ANALYSIS
*Triggers: "research", "find", "compare", "what is", "how does", "analyse"*

```
MODEL:    claude-haiku-4-5 (upgrade to Sonnet if >500 word synthesis)

PLUGINS:  NONE

MCP:
  - context7             ← technical library docs if needed

SKIP: All build plugins, firebase, github (unless looking up repo)
```

---

## 💾 GIT / CODE OPS
*Triggers: "push", "commit", "PR", "pull request", "create repo", "branch"*

```
MODEL:    claude-sonnet-4-6

PLUGINS:
  - commit-commands      ← conventional commits + push + PR
  - code-review          ← review before push
  - security-guidance    ← scan before committing

MCP:
  - github               ← all repo operations

SKIP: context7, firebase, frontend-design, playwright
```

---

## 🔧 PLUGIN / AGENT BUILDING
*Triggers: "build plugin", "create agent", "new skill", "agent-sdk"*

```
MODEL:    claude-opus-4-6

PLUGINS:
  - agent-sdk-dev        ← plugin development kit
  - plugin-dev           ← create new plugins
  - claude-md-management ← update CLAUDE.md after build
  - verification-gate    ← test plugin before publishing

MCP:
  - github               ← version and publish plugin

SKIP: firebase, playwright, frontend-design
```

---

## ✅ CODE QUALITY / REVIEW
*Triggers: "review", "simplify", "refactor", "clean up", "audit"*

```
MODEL:    claude-sonnet-4-6

PLUGINS:
  - code-review          ← comprehensive review
  - code-simplifier      ← refactor complex code
  - typescript-lsp       ← type error detection
  - security-guidance    ← security scan
  - verification-gate    ← confirm quality before done

SKIP: All build/feature plugins unless fixing found issues
```

---

## 🛠️ CLAUDE CODE — COMPLETE REFERENCE

### What Claude Code Is
Claude Code is a **terminal-based agentic coding tool** that runs locally on your machine. It has direct filesystem access, can run shell commands, manage git, and iterate on code across multiple files.

### When to Use Claude Code vs Other Tools

| Situation | Use Claude Code | Use Alternative |
|-----------|-----------------|-----------------|
| Multi-file refactor | ✅ Yes | — |
| Complex game architecture | ✅ Yes | — |
| State machines, AI behavior | ✅ Yes | — |
| Git operations (commit, PR, branch) | ✅ Yes | — |
| Quick prototype to show someone | — | Rosebud (15 min) |
| Landing page mockup | — | WebSim (30 min) |
| Live client demo session | ✅ /fast mode | — |
| Research-only task | — | Claude.ai or Haiku |
| Single file edit | ✅ Yes, but overkill | Cursor faster |

### Claude Code Session Startup Protocol

Every Claude Code session in NovaLearning:

```
1. CLAUDE.md auto-loads (project constitution)
2. Read routing-table.md (this file)
3. Match task to TASK TYPE
4. Announce: MODEL + PLUGINS + MCP + SKIPPING
5. Check .claude/plans/active-plan.md (create if missing)
6. Load skill if needed: read .claude/skills/[name]/SKILL.md
7. Execute with verification-gate before marking DONE
```

### Claude Code Commands Reference

| Command | Purpose |
|---------|---------|
| `/fast` | Toggle Opus 4.6 fast mode (lower latency, same quality) |
| `/model opus` | Switch to Opus 4.6 |
| `/model sonnet` | Switch to Sonnet 4.6 |
| `/model haiku` | Switch to Haiku 4.5 |
| `/clear` | Clear conversation context |
| `/compact` | Summarize and compress context |
| `/cost` | Show token usage and cost |
| `read [path]` | Load file into context |
| `write [path]` | Write file to disk |

### Claude Code + NovaLearning Workflow

**Starting a game development session:**
```
cd C:\Users\h3ogr\novalearning-games
claude

# Claude Code opens, CLAUDE.md auto-loads
# You say:
"Building Money Skills ENCOUNTER phase coin identification mechanic"

# Claude Code responds with confirmation block:
TASK TYPE:   GAME DEVELOPMENT
MODEL:       claude-opus-4-6 (architecture complexity)
PLUGINS:     feature-dev, orchestrator-discipline, verification-gate, ralph-loop, context7
MCP TOOLS:   context7, github
SKIPPING:    firebase, playwright, frontend-design
SKILL:       Loading .claude/skills/ai-web-game-builder/SKILL.md
PLAN FILE:   Checking .claude/plans/active-plan.md
STARTING:    Searching github repos for existing coin assets

# Then executes
```

**15-Round Iteration Pattern (from SKILL.md):**
```
Rounds 1-3:   Core mechanic only (one interaction, no polish)
Rounds 4-6:   Add one supporting feature
Rounds 7-9:   Performance audit + Galaxy A03 optimization
Rounds 10-12: Visual polish (only after perf passes)
Rounds 13-15: Edge cases, error states, final QA
```

**Performance Check Command:**
```
# Run this after any scene change:
console.log('Draw calls:', renderer.info.render.calls);
console.log('Triangles:', renderer.info.render.triangles);
console.log('Textures:', renderer.info.memory.textures);

# If ANY exceed limits → stop → optimize → continue
```

### Claude Code + MCP Tools

**github MCP — Asset-First Rule:**
```
# BEFORE building any new feature, ALWAYS:
1. Search 249 repos for existing implementation
2. Check /assets/ folders for models/textures
3. Adapt existing > build new

# Example search:
github search "coin mesh three.js" in:novalearning-games
```

**context7 MCP — Three.js r128 Docs:**
```
# When you need Three.js API reference:
context7 query "InstancedMesh usage" library:three.js version:r128

# CRITICAL: Only r128 — newer versions break Galaxy A03
```

### Claude Code Error Recovery

| Error | Cause | Fix |
|-------|-------|-----|
| "Model rate limited" | Too many requests | /fast auto-falls back to standard |
| "Context too long" | Too much loaded | /compact to summarize |
| "File not found" | Wrong path | Use absolute paths from project root |
| "Permission denied" | Protected file | Check .gitignore, run as admin if needed |
| Verification gate fails | Quality issue | Fix issue, rerun gate, then mark DONE |

### Claude Code + Plans Protocol

```
# Every implementation task:
1. Check: Does .claude/plans/active-plan.md exist?
2. If NO → Create it with:
   - Task description
   - Success criteria
   - Subtasks with checkboxes
   - Performance targets
3. If YES → Read it, find your task, update status
4. When done → Write summary back to plan
5. orchestrator-discipline plugin enforces this
```

### Claude Code Pricing (for cost awareness)

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| Opus 4.6 | $15/MTok | $75/MTok | Architecture, complex logic |
| Opus /fast | $30/MTok | $150/MTok | Live demos (same quality, lower latency) |
| Sonnet 4.6 | $3/MTok | $15/MTok | Frontend, docs, most tasks |
| Haiku 4.5 | $0.25/MTok | $1.25/MTok | Research, lookups |

**Cost optimization:**
- Use Sonnet as default (5x cheaper than Opus)
- Upgrade to Opus only for architecture/complex tasks
- Use /compact to reduce context before expensive operations
- Use /cost to monitor spend

---

## 📚 SKILLS REFERENCE

*Skills are detailed how-to files loaded on demand. Not auto-loaded — read when needed.*

| Skill | Path | Load When |
|-------|------|-----------|
| AI Web Game Builder | `.claude/skills/ai-web-game-builder/SKILL.md` | Any game dev, Three.js, Rosebud, demo builds |

### Loading Skills

```
# In Claude Code:
read .claude/skills/ai-web-game-builder/SKILL.md

# Skill provides:
- Tool decision matrix (Rosebud vs Cursor vs Claude Code)
- Galaxy A03 performance patterns (copy-paste code)
- Three.js optimization (object pooling, LOD, dispose)
- Workflow templates (15-round iteration, Rosebud 6-step)
- Prompt engineering templates
- Anti-patterns to avoid
```

### Creating New Skills

```
1. Create folder: .claude/skills/[skill-name]/
2. Add SKILL.md with:
   - Triggers (when to load)
   - Constraints (hard limits)
   - Workflows (step-by-step)
   - Templates (copy-paste)
   - Anti-patterns (never do)
3. Register in this table
4. Reference in relevant TASK TYPE section
```

### Skill File Structure Template

```markdown
# [SKILL NAME] — SKILL.md

## Triggers
When to load this skill...

## Constraints
Hard limits that cannot be exceeded...

## Workflows
### Workflow 1: [Name]
Step-by-step process...

### Workflow 2: [Name]
Step-by-step process...

## Templates
### Template 1: [Name]
Copy-paste template...

## Anti-Patterns
1. ❌ Never do this...
2. ❌ Never do that...

## Resources
- Link 1
- Link 2
```

---

## PLANS PROTOCOL

Every implementation task requires:
```
1. Check .claude/plans/active-plan.md
2. If missing → CREATE IT before touching any code
3. Write implementation summary back to plan when done
4. orchestrator-discipline enforces this — do not bypass
```

### Plan File Template

```markdown
# Active Plan: [Task Name]
Created: [Date]
Status: IN PROGRESS | BLOCKED | COMPLETE

## Objective
One sentence describing what we're building.

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Performance: 30fps on Galaxy A03

## Subtasks
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Performance Targets
| Metric | Target | Actual |
|--------|--------|--------|
| FPS | ≥30 | — |
| Draw calls | <50 | — |
| Load time | <3s | — |

## Notes
Any blockers, decisions, or context...

## Completion Summary
Written when task is DONE...
```

---

## QUALITY GATE PROTOCOL

```
verification-gate must PASS before any task is marked DONE
If it fails → fix → rerun gate → only then mark complete
No exceptions for NovaLearning game builds or MediClaimSA logic
```

### Verification Gate Checklist

**For Game Development:**
- [ ] FPS ≥30 on Galaxy A03 constraints
- [ ] Draw calls <50
- [ ] No console errors
- [ ] All interactions work on touch
- [ ] LIYA dialogue is age-appropriate
- [ ] Ubuntu philosophy reflected in feedback

**For MediClaimSA:**
- [ ] Medical terminology accurate
- [ ] ICD codes validate correctly
- [ ] No patient data in logs
- [ ] Error messages are helpful
- [ ] All edge cases handled

**For Website Rescue:**
- [ ] Responsive on mobile
- [ ] Lighthouse score >90
- [ ] Forms work correctly
- [ ] Cross-browser tested
- [ ] Client branding accurate

---

## CHARACTERS QUICK REFERENCE

| Name | Community | Role | Status |
|------|-----------|------|--------|
| Sipho | Zulu | The Friend — eager, energetic | ✅ Art done |
| Aisha | Cape Malay | The Creator — imaginative, expressive | ✅ Art done |
| Anke | Afrikaans | The Helper — caring, nurturing | ✅ Art done |
| Naledi | Xhosa | The Leader — confident, wise | ⏳ Needs art |
| Priya | Indian/Tamil | The Thinker — curious, precise | ⏳ Needs art |
| Chanel | Coloured | The Storyteller — warm, funny | ⏳ Needs art |
| LIYA | AI Guide | Adaptive, supportive | In-game only |

**RETIRED — never use:** Thandi, Lerato, Lebo, Liya, Amahle, Jabu, Themba

**⚠️ NEVER use "Lebo" — always LIYA for AI guide character name**

---

## NOVALEARNING SCAFFOLD PHASES

| Phase | Time | Player Does | System Does |
|-------|------|-------------|-------------|
| ENCOUNTER | 2 min | Explore freely | Introduce concept via LIYA |
| IDENTIFY | 3 min | Find/match items | Gentle guidance, no failure states |
| COMBINE | 4 min | Solve puzzle | Scaffolded hints if stuck >30s |
| APPLY | 3 min | Real scenario | Celebrate + Ubuntu reflection |

**Total session: ~12 minutes**
**Orboot 4-phase loop runs once per session**

---

*Updated: February 2026 | Part of two-tier CLAUDE.md system*
*Maintainer: Damian Harrison | HazHar Eco Solutions*
