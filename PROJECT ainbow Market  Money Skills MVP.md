# PROJECT: Rainbow Market — Money Skills MVP
**Date:** 2026-02-13 | **Status:** Planning → Awaiting Approval
**Estimated Build:** 3 hours to live Vercel URL
**Investor Pitch Line:** "Watch a 5-year-old in Khayelitsha learn to count coins on a R1,500 phone."

---

## 1. WHAT WE'RE BUILDING (AND WHY THIS SCOPE)

A single-screen 3D market game where a Grade R child taps SA coins (R1, R2, R5) to "buy" familiar South African food items. Three rounds, one celebration, done.

**Why this specific scope:**
- Full Ubuntu learning loop in <3 minutes (DISCOVER coins → SHARE payment → CELEBRATE together → GROW to next round)
- Demonstrates CAPS Mathematics alignment (coin recognition, value comparison, simple addition)
- Runs on Galaxy A03 without a single frame drop
- Playable demo for investors/teachers in 48 hours
- Zero dependency on 3D model pipeline (procedural geometry only)
- Game logic is asset-agnostic — swap cylinders for GLB models in Phase 2 without changing a line of game code

**What we're deliberately NOT building:**

| Feature | Why Deferred | Phase |
|---------|-------------|-------|
| Orbital mechanics (Savings Planet) | Complex, not needed to validate learning loop | 2 |
| Character selection (6 Rainbow Nation kids) | Art pipeline dependency, no impact on core gameplay | 2 |
| Multiple market stalls | Single stall proves the mechanic; expand later | 2 |
| Audio/voice (Howler.js) | Adds 50KB+ bundle, text feedback works for MVP | 2 |
| QR code scanning | Solved infrastructure (we proved this already) | 2 |
| Supabase backend | localStorage validates persistence; backend for teacher dashboard | 3 |
| PWA service worker | Offline capability after core game works online | 3 |
| Afrikaans/Xhosa localization | English-only MVP per business decision | 3 |

---

## 2. UBUNTU CORE LOOP — THE HEART OF THE GAME

Every game mechanic must pass the Ubuntu test: **"Does this reinforce 'I am because we are'?"**

### The 30-Second Ubuntu Cycle (from skill: novalearning-ubuntu-game-design)

```
1. DISCOVER → Child sees market item with price tag ("Vetkoek costs R3!")
2. SHARE    → Child selects coins to help Gogo (grandmother) at the market  
3. CELEBRATE → Community celebration when payment is correct
4. GROW     → Everyone benefits — Gogo gets food, child earns a star, community progress fills
```

### Ubuntu Design Decisions

| Decision | Individual Approach ❌ | Ubuntu Approach ✅ |
|----------|----------------------|-------------------|
| Goal framing | "Buy food for yourself" | "Help Gogo buy food for the family" |
| Progress tracking | Personal score counter | Community progress ring (shared) |
| Wrong answer | "Wrong! Try again" | "Almost! Let's count together" (no failure state) |
| Celebration | Solo fireworks | Group sparkles — ALL objects in scene celebrate |
| Stars earned | "Your stars: ★★★" | "Stars for our community: ★★★" |
| Difficulty | Gets harder to challenge YOU | Adapts to help the slowest learner (no child left behind) |

### Narrative Frame
**"Gogo needs help at the market today. Can you help her buy the food our family needs?"**

This frames the child as a HELPER (strongest Ubuntu motivation for ages 4-6 per player psychology research in the skill). Every correct purchase helps the family, not just the player.

---

## 3. CAPS CURRICULUM ALIGNMENT

**Subject:** Mathematics — Grade R
**Focus Area:** Numbers, Operations & Relationships
**Content Area:** Money

| CAPS Requirement | How Our Game Addresses It |
|-----------------|--------------------------|
| Recognise SA coins (R1, R2, R5) | 3D coin objects with embossed value text, distinct sizes and colors |
| Compare coin values | Price tags require choosing correct combination |
| Simple addition to R10 | Wallet running total updates as coins are selected |
| Practical money use | Buying real SA food items at a market stall |
| Problem-solving | Multiple valid coin combinations per price |

**Difficulty Progression (3 Rounds):**

| Round | Item | Price | Available Coins | Complexity | Ubuntu Element |
|-------|------|-------|----------------|------------|----------------|
| 1 | Vetkoek | R2 | R1, R1, R2, R5 | Simple — only R2 works directly | "Gogo is hungry, let's help!" |
| 2 | Koeksister | R3 | R1, R2, R2, R5 | Medium — R1+R2 combination needed | "The family wants something sweet!" |
| 3 | Bunny Chow | R5 | R1, R2, R2, R5 | Easy win — R5 coin, but R2+R2+R1 also valid | "A big meal for everyone to share!" |

**Design Note:** Round 3 is intentionally easier than Round 2. This follows the "end on success" principle — the child finishes feeling confident and accomplished. The Ubuntu celebration is biggest on the last round.

---

## 4. AESTHETIC DIRECTION — "Township Vibrant" × "Ubuntu Community"

Choosing a hybrid of two palettes from the NovaLearning Frontend Design skill:

### Color System (CSS Variables)
```css
:root {
  /* Ubuntu Community Palette */
  --community-primary: #E67E22;   /* Ubuntu orange — warmth, togetherness */
  --community-secondary: #27AE60; /* Ubuntu green — growth, nature */  
  --celebration: #F39C12;          /* Joy yellow — celebration moments */
  --earth-base: #8B4513;           /* Grounding brown — earth, heritage */
  --sky-calm: #87CEEB;             /* Peaceful blue — sky background */
  
  /* Township Vibrant Accents */
  --ndebele-red: #D32F2F;          /* Bold red — energy, life */
  --protea-pink: #E91E63;          /* Protea — national flower */
  
  /* SA Coin Colors (realistic-ish) */
  --coin-r1: #C0C0C0;    /* Silver */
  --coin-r2: #B87333;     /* Copper */
  --coin-r5: #FFD700;     /* Gold */
  
  /* SA Food Colors */
  --vetkoek: #D4A574;     /* Golden dough */
  --koeksister: #C68E17;  /* Caramelized syrup */
  --bunny-chow: #E8B960;  /* Curry bread */
  
  /* Performance Optimized Tokens */
  --border-radius: 16px;
  --shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
  --transition: 0.2s ease;
  --safe-area: 16px;
  --min-touch: 56px;  /* 48px minimum + 8px comfort buffer */
}
```

### Typography
- **Display:** Comic Neue Bold (child-friendly, not patronizing)
- **Body:** Comic Neue Regular
- **Fallback:** system cursive → sans-serif
- **Max 7 words per instruction** (Grade R reading level constraint)
- **Font size:** `clamp(20px, 5vw, 28px)` for instructions

### Visual Style
- Sky gradient background (light blue → warm peach at horizon)
- Market stall: warm wood-brown box with colorful awning stripe (Ndebele-inspired)
- Coins: metallic cylinders with embossed "R" values, gentle idle rotation
- Ground plane: warm earth-brown with subtle grass-green edge
- HUD: rounded rondavel-inspired containers (Ubuntu design language)
- Celebrations: gold particle burst + expanding community ripple rings

---

## 5. TECHNICAL ARCHITECTURE

### Performance Budget (Galaxy A03 — 2GB RAM, Mali-G52 GPU)

| Resource | Budget | Strategy |
|----------|--------|----------|
| JS Bundle (gzipped) | <250KB | React 18 (~40KB) + R3F (~30KB) + Three.js (~150KB) + Zustand (~1KB) + app (~15KB) |
| Total Download | <400KB | No textures, no GLB, no audio for v0.1 |
| Geometry | <2K vertices/scene | Procedural: cylinders (coins), boxes (stall), plane (ground) |
| Materials | MeshLambertMaterial | No PBR. Single AmbientLight + one DirectionalLight |
| Draw Calls | <15 per frame | Material pooling, no dynamic shadows |
| Frame Rate | 30fps target | CSS overlay animations, minimal Three.js rerenders |
| Memory | <80MB | Dispose geometry/materials on scene transitions |
| Touch Latency | <100ms feedback | Immediate visual state change on tap, async game logic |

### Material Pool (from skill: offline-3d-web-games)
```javascript
// Reuse materials to minimize GPU state changes
const MATERIALS = {
  coinR1: new MeshLambertMaterial({ color: 0xC0C0C0 }),
  coinR2: new MeshLambertMaterial({ color: 0xB87333 }),
  coinR5: new MeshLambertMaterial({ color: 0xFFD700 }),
  coinSelected: new MeshLambertMaterial({ color: 0x27AE60, emissive: 0x27AE60, emissiveIntensity: 0.3 }),
  stallWood: new MeshLambertMaterial({ color: 0x8B4513 }),
  stallAwning: new MeshLambertMaterial({ color: 0xE67E22 }),
  ground: new MeshLambertMaterial({ color: 0xD2B48C }),
  food: null, // Set per-round from level data
};
```

### File Structure (7 source files, surgical scope)

```
rainbow-market-mvp/
├── index.html                    # Mount point + Comic Neue font link
├── vite.config.js                # Chunk splitting for Three.js
├── src/
│   ├── main.jsx                  # React mount, global styles
│   ├── App.jsx                   # Game state router (title → play → summary)
│   ├── store.js                  # Zustand: game state + actions
│   ├── data/
│   │   └── levels.js             # 3 rounds: item, price, coins, colors, ubuntu text
│   ├── scene/
│   │   ├── GameScene.jsx         # R3F Canvas + camera + lights + ground
│   │   ├── Coin.jsx              # Tappable cylinder + value text + selection glow
│   │   └── MarketStall.jsx       # Box stall + awning + food item + price HTML tag
│   ├── ui/
│   │   ├── HUD.jsx               # Wallet total, round counter, Ubuntu greeting
│   │   ├── PayButton.jsx         # "Help Gogo Pay" action button
│   │   └── Celebration.jsx       # Particle burst + community ripple + star + text
│   └── screens/
│       ├── TitleScreen.jsx       # "Help Gogo at the Market!" + Start button
│       └── SummaryScreen.jsx     # Stars earned + "Play Again" + community message
```

### Game State (Zustand Store)

```javascript
const useGameStore = create((set, get) => ({
  // Game phase
  phase: 'title',           // title | playing | celebrating | summary
  
  // Round state
  round: 0,                  // 0-indexed, 3 rounds total
  levels: LEVELS_DATA,       // from levels.js
  
  // Coin selection
  selectedCoins: [],          // indices of selected coins in current level
  currentTotal: 0,            // sum of selected coin values
  
  // Progress
  stars: 0,                   // earned this session
  roundResults: [],           // { item, price, coinsUsed, attempts }
  
  // Ubuntu state
  communityProgress: 0,       // 0-1, fills across all rounds
  gogoMessage: '',            // narrative text from Gogo
  
  // Actions
  startGame: () => set({ phase: 'playing', round: 0, stars: 0, roundResults: [], communityProgress: 0 }),
  
  selectCoin: (index) => {
    const state = get();
    const level = state.levels[state.round];
    const coin = level.coins[index];
    
    if (state.selectedCoins.includes(index)) {
      // Deselect
      set({
        selectedCoins: state.selectedCoins.filter(i => i !== index),
        currentTotal: state.currentTotal - coin,
      });
    } else {
      // Select
      set({
        selectedCoins: [...state.selectedCoins, index],
        currentTotal: state.currentTotal + coin,
      });
    }
  },
  
  attemptPayment: () => {
    const state = get();
    const level = state.levels[state.round];
    
    if (state.currentTotal === level.price) {
      // Correct! Ubuntu celebration
      const newStars = state.stars + 1;
      const newProgress = (state.round + 1) / state.levels.length;
      
      set({
        phase: 'celebrating',
        stars: newStars,
        communityProgress: newProgress,
        gogoMessage: level.ubuntuSuccess,
        roundResults: [...state.roundResults, {
          item: level.item,
          price: level.price,
          coinsUsed: state.selectedCoins.map(i => level.coins[i]),
          correct: true,
        }],
      });
      
      // Auto-advance after celebration
      setTimeout(() => {
        const s = get();
        if (s.round < s.levels.length - 1) {
          set({ phase: 'playing', round: s.round + 1, selectedCoins: [], currentTotal: 0 });
        } else {
          // Save to localStorage
          const saved = JSON.parse(localStorage.getItem('rainbow-market') || '{}');
          saved.lastPlayed = Date.now();
          saved.totalStars = (saved.totalStars || 0) + s.stars;
          saved.gamesCompleted = (saved.gamesCompleted || 0) + 1;
          localStorage.setItem('rainbow-market', JSON.stringify(saved));
          
          set({ phase: 'summary' });
        }
      }, 2500);
      
    } else if (state.currentTotal > level.price) {
      // Too much — gentle Ubuntu redirect
      set({ gogoMessage: level.ubuntuTooMuch });
    } else {
      // Not enough — encouraging Ubuntu message
      set({ gogoMessage: level.ubuntuNotEnough });
    }
  },
  
  resetRound: () => set({ selectedCoins: [], currentTotal: 0 }),
  restartGame: () => set({ phase: 'title' }),
}));
```

### Level Data (Cultural + Curriculum + Ubuntu)

```javascript
export const LEVELS = [
  {
    item: 'Vetkoek',
    price: 2,
    coins: [1, 1, 2, 5],
    foodColor: '#D4A574',
    ubuntuIntro: "Gogo is hungry! Help her buy vetkoek.",
    ubuntuSuccess: "Enkosi! Gogo says thank you! The family eats together. ★",
    ubuntuNotEnough: "Not quite enough yet. Try adding another coin!",
    ubuntuTooMuch: "That's too many rands! Gogo only needs R2. Try again!",
  },
  {
    item: 'Koeksister',
    price: 3,
    coins: [1, 2, 2, 5],
    foodColor: '#C68E17',
    ubuntuIntro: "The family wants something sweet! Can you help?",
    ubuntuSuccess: "Siyabonga! Everyone shares the koeksister. ★",
    ubuntuNotEnough: "Almost there! Count the coins with me.",
    ubuntuTooMuch: "A little less, friend. The koeksister is R3.",
  },
  {
    item: 'Bunny Chow',
    price: 5,
    coins: [1, 2, 2, 5],
    foodColor: '#E8B960',
    ubuntuIntro: "A big meal for the whole family! R5 please.",
    ubuntuSuccess: "Wena uphile! A feast for everyone! Our community is strong! ★★★",
    ubuntuNotEnough: "We need more for this big meal. Keep going!",
    ubuntuTooMuch: "That's generous, but R5 is just right!",
  },
];
```

---

## 6. INTERACTION DESIGN (Ages 4-6 Optimized)

### Touch Targets & Feedback
| Element | Size | Feedback | Latency |
|---------|------|----------|---------|
| Coins | 72px diameter (3D) | Green glow + gentle bounce | <50ms visual |
| Pay Button | 56px height, full width | Ripple effect + color shift | <50ms visual |
| Play Again | 56px height, full width | Scale pulse | <50ms visual |
| Deselect coin | Tap selected coin | Remove glow + settle animation | <50ms visual |

### Visual Hierarchy (one focal point per screen)
- **Title screen:** Big "Help Gogo!" text + single Start button
- **Playing screen:** Market stall top center (goal), coins bottom center (action), HUD top (context)
- **Celebration:** Full-screen particle burst + star + Gogo's message
- **Summary:** Stars earned + community progress ring + Play Again

### Error Prevention (Not Correction)
- Coins can be deselected by tapping again (forgiving interaction)
- "Help Gogo Pay" button only appears when at least 1 coin is selected
- Overpayment shows gentle message but doesn't reset selection (child figures it out)
- No time pressure anywhere (exploration at own pace — from Ubuntu anti-patterns)

---

## 7. CELEBRATION SYSTEM — THE MONEY SHOT

This is what investors and teachers remember. The celebration must feel ALIVE.

### Correct Payment Celebration (2.5 seconds)
```
T+0.0s  → Coins fly toward stall (spring animation)
T+0.3s  → Food item scales up with bounce
T+0.5s  → Gold particle burst (drei Sparkles, 30 particles)
T+0.7s  → Community ripple rings expand from center (CSS)
T+1.0s  → Star appears and floats to community progress ring
T+1.2s  → Gogo's Ubuntu message fades in
T+2.0s  → Scene gently fades
T+2.5s  → Next round loads (or summary screen)
```

### Final Round Mega Celebration (3.5 seconds)
Everything above PLUS:
- All previous food items reappear on the stall (the family's full meal)
- Community progress ring completes with golden pulse
- "Wena uphile!" text is larger and stays longer
- Extra sparkle particles (50 instead of 30)

### Wrong Amount — Gentle Redirect (No Punishment)
```
T+0.0s  → Coins do a small horizontal shake (not violent — playful)
T+0.3s  → Gogo's encouraging message appears
T+0.5s  → Message stays for 2 seconds, then fades
         → Coins remain selected (child can adjust, not start over)
```

---

## 8. EXECUTION PLAN — 25 TASKS, 3 HOURS

### Phase 1: Scaffold (25 min)
- [ ] **1.** `npm create vite@latest rainbow-market-mvp -- --template react` (2 min)
- [ ] **2.** Install deps: `three @react-three/fiber @react-three/drei zustand` (3 min)
- [ ] **3.** Configure `vite.config.js` — chunk Three.js separately, set build target (5 min)
- [ ] **4.** Create `src/store.js` — full Zustand store (10 min)
- [ ] **5.** Create `src/data/levels.js` — 3 rounds with Ubuntu messaging (5 min)

### Phase 2: 3D Scene (45 min)
- [ ] **6.** `GameScene.jsx` — R3F Canvas, camera at (0, 4, 6), AmbientLight + DirectionalLight, sky gradient (15 min)
- [ ] **7.** Ground plane — flat box with earth-brown LambertMaterial (3 min)
- [ ] **8.** `Coin.jsx` — CylinderGeometry, embossed "R" via drei/Text, idle rotation, onClick → selectCoin, selected glow (15 min)
- [ ] **9.** `MarketStall.jsx` — Box stall + awning, drei/Html price tag, food sphere with level color (12 min)

### Phase 3: UI Overlays (30 min)
- [ ] **10.** `HUD.jsx` — Ubuntu greeting, Gogo's message, wallet total, round dots, community progress (15 min)
- [ ] **11.** `PayButton.jsx` — "Help Gogo Pay" with ripple CSS, conditional visibility (10 min)
- [ ] **12.** Global CSS — Comic Neue, Ubuntu color variables, rondavel borders (5 min)

### Phase 4: Game Logic (20 min)
- [ ] **13.** Wire coin taps → store → visual feedback (5 min)
- [ ] **14.** Wire Pay button → attemptPayment → correct/incorrect (5 min)
- [ ] **15.** Round progression → level swap → coin reset (5 min)
- [ ] **16.** localStorage save/load (5 min)

### Phase 5: Celebration (25 min)
- [ ] **17.** `Celebration.jsx` — drei/Sparkles gold particle burst (10 min)
- [ ] **18.** Star animation — spring scale from 0→1.2→1.0 (5 min)
- [ ] **19.** Community ripple CSS rings (5 min)
- [ ] **20.** Ubuntu success message fade-in (5 min)

### Phase 6: Screens (20 min)
- [ ] **21.** `TitleScreen.jsx` — narrative intro + Start button (10 min)
- [ ] **22.** `SummaryScreen.jsx` — stars + progress ring + Play Again (10 min)

### Phase 7: Polish & Deploy (15 min)
- [ ] **23.** Mobile viewport, touch-action, tap-highlight (3 min)
- [ ] **24.** Build → verify bundle <250KB (5 min)
- [ ] **25.** Deploy Vercel → test mobile emulation → share URL (7 min)

---

## 9. SUCCESS CRITERIA

| Metric | Target | Verification |
|--------|--------|--------------|
| Bundle (gzipped JS) | <250KB | `vite build` output |
| First Load | <3s on 3G | Chrome DevTools throttle |
| Frame Rate | 30fps+ | Performance tab |
| Touch Response | <100ms | Manual + Performance tab |
| Full Game Loop | 3 rounds completable | Manual playthrough |
| Ubuntu Loop | All 4 stages per round | DISCOVER/SHARE/CELEBRATE/GROW verified |
| CAPS Alignment | Coin recognition + addition | Correct answers require both |
| No Failure States | 0 dead ends | Wrong amounts always recoverable |
| Progress Persists | Survives reload | localStorage check |
| Mobile Playable | 360px viewport | Device emulation |
| Live URL | Worldwide accessible | Vercel deployment |

---

## 10. ALTERNATIVES REJECTED

| Alternative | Why Rejected |
|------------|-------------|
| **Phaser 2D** | 3D is the differentiator; 2D looks like every other EdTech app |
| **Full orbital mechanics first** | 3-5 day build for a feature that doesn't validate the learning loop |
| **GLB models from day 1** | Asset pipeline bottleneck blocks all progress |
| **Supabase from day 1** | Auth + RLS + API = 2+ days overhead for single-player MVP |
| **GSAP animations** | +30KB bundle; useFrame + CSS achieves the same |
| **Canvas 2D UI overlay** | Breaks accessibility, loses HTML semantics |

---

## 11. PHASE 2 ROADMAP

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P1 | GLB models (Meshy.ai) | 1 day | Visual quality leap |
| P2 | Audio (coin clinks, Gogo voice) | 0.5 day | Engagement + accessibility |
| P3 | Character selection (6 kids) | 1 day | Cultural representation |
| P4 | 10 levels (R1→R10 range) | 0.5 day | Content depth |
| P5 | Orbital mechanics | 2 days | Investor "wow" feature |
| P6 | QR code workbook routing | 0.5 day | Physical-digital bridge |
| P7 | PWA offline | 0.5 day | Township/rural viability |
| P8 | Supabase + teacher dashboard | 3 days | B2B enablement |

---

## 12. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Three.js bundle >250KB | Medium | High | Cherry-pick drei, use `vite-bundle-visualizer` |
| R3F touch events unreliable | Medium | High | Fallback to Canvas pointer overlay |
| Comic Neue font load fail | Low | Medium | System cursive fallback chain |
| drei/Sparkles GPU-heavy | Medium | Medium | Replace with CSS particles if <20fps |
| Rapid tap race condition | Low | Low | 100ms debounce on selectCoin |

---

## 13. ASSETS & SKILLS USED

**Repos:** rainbow-market-orbit, RangerNova, Counting-Safari, NovaLearning-Workbook-50-Pages
**Skills:** novalearning-game-dev, novalearning-ubuntu-game-design, novalearning-frontend-design, novalearning-offline-3d-web-games, frontend-design (public)
**Vercel Team:** team_iTGFwTXO0xBN2BQyLDEKSVC0

---

*Ready to execute. Say "Go" and I start with Phase 1.*
