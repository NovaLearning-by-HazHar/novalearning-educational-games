# NovaLearning — Game Brief

> Character Bible v1.0 | Game modes | Data schemas | Build order
> Last updated: 2026-02-23

---

## Character System

### In-Game Characters (Character Bible v1.0 — playable, voiced)

| Character | Role | Ethnicity | Vertices | Companion | Languages |
|---|---|---|---|---|---|
| Gogo Thandi | Wisdom Keeper | Xhosa elder | ~650 | Elephant Calf (~450v) | EN, XH, AF |
| Sipho Dlamini | Curious Explorer | Zulu | ~500 | Springbok (~300v) | EN, ZU |
| Amahle Ndlovu | Caring Helper | Zulu/Xhosa | ~500 | Meerkat (~250v) | EN, ZU, AF |
| Jabu Mokoena | Creative Builder | Sotho | ~550 | Weaver Bird (~200v) | EN, ST |
| Liya Abrahams | Joyful Storyteller | Cape Malay | ~520 | Cape Penguin (~280v) | EN, AF |
| Themba van der Merwe | Gentle Protector | Afrikaans/mixed | ~530 | Tortoise (~220v) | EN, AF |
| Narrator | Instructions/bridges | (non-character voice) | N/A | N/A | EN, AF, XH |

### Skin Tones

```
Gogo Thandi:  #6D4C41    Sipho:   #8D6E63    Amahle:  #795548
Jabu:         #5D4037    Liya:    #A1887F    Themba:  #BCAAA4
```

### Legacy Code Characters (existing in src/types/game.ts)

The codebase currently uses: `sipho`, `thandi`, `lerato`, `pieter`, `fatima`, `amahle`.
These map to the Bible roster as follows:

| Code Name | Bible Name | Notes |
|---|---|---|
| sipho | Sipho Dlamini | Direct match |
| thandi | Gogo Thandi | Now an elder character |
| amahle | Amahle Ndlovu | Direct match |
| lerato | — | Not in Bible v1.0 (replace with Jabu) |
| pieter | — | Not in Bible v1.0 (replace with Themba) |
| fatima | — | Not in Bible v1.0 (replace with Liya) |

**Migration note:** Update `CharacterName` type in `src/types/game.ts` when ready.

---

## Brand Mascots (visual ambassadors — NOT in gameplay)

| Mascot | Species | Where they appear | Where they DON'T appear |
|---|---|---|---|
| **Ella** | Elephant | Workbook covers, marketing, app icon, loading screens, posters, merch | Game scenes, voice lines, gameplay logic |
| **Ardo** | Aardvark | Workbook illustrations, social media, investor deck | Game scenes, voice lines, gameplay logic |
| **Zara** | Zebra | Print materials, classroom posters, parent guides | Game scenes, voice lines, gameplay logic |
| **Siyanda** | SA girl | Brand ambassador imagery, website hero, app store screenshots | Game scenes, voice lines, gameplay logic |

**Rules:**
- Mascots are **decorative images only** — no 3D models, no game logic, no voice lines
- Mascots may appear on loading screens and splash pages alongside in-game characters
- Mascot assets live in `src/assets/mascots/` (PNG/SVG only)
- In-game character assets live in `characters/` (GLB + textures + animations per Bible)
- Never confuse the two rosters. If building game code, use Bible characters ONLY.

---

## Ubuntu Buddies (Workbook Characters)

These appear in the printed workbook and Money Skills game:

| Letter | Animal | Character | Hex Color | Ubuntu Value |
|---|---|---|---|---|
| A | Aardvark | Ayo | #E85D04 | Achievement |
| B | Baboon | Buhle | #4CC9F0 | Bravery |
| C | Cheetah | Cindy | #F4A261 | Champions |
| D | Dung Beetle | Dumisani | #8D6748 | Determination |
| E | Elephant | Elethu | #52B788 | Empathy (Ubuntu) |
| F | Flamingo | Fezile | #FF6B9D | Family |

---

## Game Modes (6 planned)

| # | Mode | Curriculum | Phase | Status |
|---|---|---|---|---|
| 1 | Count to 5 with Sipho | Numeracy | Phase 2 | Done |
| 2 | Trace Letter A with Thandi | Language | Phase 4 | Done |
| 3 | Money Skills (ENCOUNTER-IDENTIFY-COMBINE-APPLY) | Numeracy | MVP Focus | In Progress |
| 4 | Shape Sorting | Life Skills | Future | Not Started |
| 5 | Animal Sounds & Letters | Language | Future | Not Started |
| 6 | Ubuntu Story Builder | Cultural Awareness | Future | Not Started |

---

## Gameplay Loop (Universal)

```
Explore → Discover → Practice → Celebrate
```

Phase machine in `src/stores/gameStore.ts`:
- `advancePhase()` moves through PHASE_ORDER sequentially
- `targetInteractions` configurable per game (default: 5)
- Auto-advance to celebrate when target reached during practice
- `shouldCelebrate()` check, `reset()` for new sessions

### Money Skills Scaffold (MVP)

```
ENCOUNTER → IDENTIFY → COMBINE → APPLY
```

| Phase | Activity | Description |
|---|---|---|
| ENCOUNTER | Meet the Coins | Ubuntu Buddy introduces SA coins with fun facts |
| IDENTIFY | Sort & Name | Drag-and-drop coins onto targets by value |
| COMBINE | Add Coins Together | Make target amounts using coin combinations |
| APPLY | Tuck Shop | Buy items by selecting correct coin combinations |

SA Coins: 5c, 10c, 20c, 50c, R1, R2, R5

---

## Data Schemas

### characters.json
```json
{
  "name": "Sipho Dlamini",
  "role": "Curious Explorer",
  "ethnicity": "Zulu",
  "catchphrase": "Let's discover together!",
  "skinTone": "#8D6E63",
  "companion": { "name": "Springbok", "vertices": 300, "sounds": ["bleat", "hop"] },
  "vertices": 500
}
```

### companions.json
```json
{
  "name": "Springbok",
  "character": "Sipho Dlamini",
  "vertices": 300,
  "sounds": ["bleat", "hop"]
}
```

---

## Build Order

See `projectplan.md` for full sprint status. Current focus:

1. ~~Phase 0: Project Setup~~ (Done)
2. ~~Phase 1: Engine Foundation~~ (Done)
3. ~~Phase 2: Count to 5~~ (Done)
4. ~~Phase 3: Infrastructure~~ (Done)
5. ~~Phase 4: Trace Letter A + Workbook~~ (Done)
6. **Phase 5: Workbook Production Pipeline** (In Progress)
7. Phase 6: School Pilots & Market Launch

---

## Pedagogy

### Articulation Hierarchy (8 levels)

| Level | Name | Description |
|---|---|---|
| L1 | Discrimination | Visual/audio pattern recognition |
| L2 | Isolation | Individual sounds/elements |
| L3 | Syllables | Sound pattern building |
| L4 | Words | Complete vocabulary development |
| L5 | Sentences | Structured communication |
| L6 | Stories | Narrative development |
| L7 | Conversation | Interactive dialogue |
| L8 | Generalization | Cross-context application |

### Ubuntu Philosophy (core to all games)
- Cooperative, never competitive
- Community count (shared), not individual scores
- Every reward screen includes an Ubuntu message
- Characters model helping behavior

---

*This file is authoritative for characters, game modes, and content. See `brand-guide.md` for visual rules, `docs/engine-spec.md` for tech constraints.*
