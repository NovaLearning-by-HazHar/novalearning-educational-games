# CLAUDE.md — NovaLearning Agent Memory
<!-- Claude Code reads this file AUTOMATICALLY at every session start -->
<!-- Keep under 2000 tokens. Older rules → CLAUDE_ARCHIVE.md -->
<!-- Last Updated: 2026-02-23 | Maintained by: Harlan -->

---

## 🔴 CRITICAL RULES (Read before ANY task)

1. **Galaxy A03**: `antialias: false` in ALL WebGLRenderer instances. Non-negotiable.
2. **Bundle size**: Never exceed 500KB total. Run `du -sh dist/` after every build step.
3. **Offline first**: Zero external CDN calls in game runtime. All assets local.
4. **FIXES.md first**: Search FIXES.md before writing any new code or config.
5. **Harlan validates**: No fix goes to Status ✅ Active without Harlan sign-off.
6. **Ubuntu check**: Every output must pass Ubuntu philosophy alignment before delivery.
7. **Two character rosters**: In-game = Bible v1.0 (Gogo Thandi, Sipho, Amahle, Jabu, Liya, Themba). Brand mascots = Ella, Ardo, Zara, Siyanda (images only — never in game logic, voice lines, or 3D models).
8. **Model routing**: Haiku → mechanical. Sonnet → components. Opus → architecture only. Never leave Opus running for Haiku-level tasks.

---

## 🤖 AGENT IDENTITY & ROUTING

| Agent | Primary Domain | Debug Authority |
|-------|----------------|-----------------|
| **Alex** | Strategy, Business, Proposals | Business logic errors, pricing bugs |
| **Kimbal** | Content, Narrative, Marketing | Content pipeline errors, MCP content tools |
| **Harlan** | QA, Review, Validation | ALL errors — final validation authority |
| **Hazely** | Support, Docs, Community | Communication errors, support workflow bugs |
| **Elon** | Code, Tech, Performance | All technical/code errors |

**Debug Escalation Path:** Any agent → Harlan → Damian (if CRITICAL)

---

## 📁 PROJECT ROOTS

```
NovaLearning:  C:\Users\h3ogr\novalearning-games\
MediClaimSA:   C:\Users\h3ogr\MedC 2\
```

Each project has its own `FIXES.md` and `CLAUDE.md`. Never cross-contaminate.

---

## 📄 FILE REFERENCE (load as needed)

| File | Purpose | Load When |
|---|---|---|
| `CLAUDE.md` | This file — session loader, rules | Every session (auto) |
| `brand-guide.md` | Colours, typography, touch targets | Building UI/components |
| `GAME-BRIEF.md` | Characters, game modes, schemas | Building game content |
| `docs/engine-spec.md` | Galaxy A03 renderer constraints | Building 3D/renderer |
| `projectplan.md` | Sprint status, phase progress | Every session |
| `FIXES.md` | Error correction knowledge base | Before any new code |
| `PROMPT_TEMPLATES.md` | 3-level prompt system, agent primes | Complex/multi-agent tasks |
| `AGENT_LOG.md` | 5-line session summaries | Session end |

---

## 🔧 MODEL ROUTING TABLE

| Model | Use For | Cost |
|---|---|---|
| **Haiku** | git, npm, mkdir, file moves, JSON data | $1/$5 MTok |
| **Sonnet** | React components, CSS, content, validation | $3/$15 MTok |
| **Opus** | Architecture decisions, debugging, 3D engine | $15/$75 MTok |

Default: Sonnet. After every Opus task, switch back immediately.

---

## 🔄 NOTION SYNC COMMAND

After logging any fix to FIXES.md, sync to Notion ECKB:
```
notion-create-pages with parent data_source_id: bdc1c8eb-ed85-4453-9238-37c5eeb06072
Properties:
  "Fix": "FIX-### | Short description"
  "Agent": "[agent name]"
  "date:Date:start": "YYYY-MM-DD"
  "Severity": "HIGH"
  "Project": "NovaLearning"
  "Tags": "[\"#tag1\", \"#tag2\"]"
  "Status": "Pending Validation"
```
Paste returned Notion URL back into FIXES.md under "Notion Link".

---

## 🎭 CHARACTER ROSTERS

### In-Game (Character Bible v1.0 — voiced, interactive)
Gogo Thandi (Xhosa elder) · Sipho (Zulu) · Amahle (Zulu/Xhosa) · Jabu (Sotho) · Liya (Cape Malay) · Themba (Afrikaans/mixed) · Narrator (non-character voice)

### Brand Mascots (images only — workbooks, marketing, loading screens)
Ella (Elephant) · Ardo (Aardvark) · Zara (Zebra) · Siyanda (SA girl)

Mascot assets: `src/assets/mascots/` (PNG/SVG). Game assets: `characters/` (GLB per Bible).

---

## ⚡ RECENT FIXES (Last 5 — full details in FIXES.md & Notion)

| Fix ID | Summary | Tags | Added By |
|--------|---------|------|----------|
| — | No fixes logged yet | — | — |

---

## 📋 SESSION START CHECKLIST

```
[ ] Read CRITICAL RULES above
[ ] grep "[task keywords]" FIXES.md
[ ] Check Notion ECKB for deeper context
[ ] git worktree list — correct branch?
[ ] npm run build && du -sh dist/ — bundle ok?
[ ] Read projectplan.md — current status
[ ] Complex task? Read PROMPT_TEMPLATES.md for agent prime
```

---

## 📤 SESSION END PROTOCOL

```
[ ] Log fixes to FIXES.md (standard format)
[ ] Sync to Notion ECKB via MCP (data source below)
[ ] Update "Recent Fixes" table above (top 5)
[ ] Write 5-line summary to AGENT_LOG.md
[ ] Update projectplan.md with task reports
[ ] git add -A && git commit && git push
```

---

## 🚨 EMERGENCY BRAKE

3+ failed attempts on same error → STOP. Log as ⚠️ Partial in FIXES.md. Sync to Notion. Skip task. Move on.

---

## 🧠 PROMPT SYSTEM

3-level system: Context Prime → Task Instruction → Output Format.
Full templates → `PROMPT_TEMPLATES.md`

---

## 🔗 KEY LINKS

- **Notion ECKB:** https://www.notion.so/8e552d65acc7414abaf173d714c6952a
- **Notion Sprint Board:** https://www.notion.so/d322c9654c1c49659bd6c4c856d7658f
- **ECKB Data Source:** `collection://bdc1c8eb-ed85-4453-9238-37c5eeb06072`
- **Character Bible:** `characters/bible/character-design-bible.docx`
