# NovaLearning — Engine Specification

> Galaxy A03 constraints | Renderer config | Adaptive quality | Asset budgets
> Load ONLY when building 3D/renderer code.
> Last updated: 2026-02-23

---

## Target Device: Samsung Galaxy A03

| Spec | Value |
|---|---|
| RAM | 2GB (usable ~1.2GB for browser) |
| GPU | Mali-G52 MP1 |
| CPU | MediaTek Helio P35 (8-core, 2.3GHz) |
| Screen | 720x1600 (HD+) |
| OS | Android 11+ |
| Browser | Chrome 90+ |
| WebGL | 1.0 (2.0 on some firmware) |
| Storage | 32GB (limited free space) |

---

## 3-Tier Device Detection

Score-based classification in `src/lib/deviceDetect.ts`:

| Tier | GPU | RAM | Cores | DPR | Renderer Settings |
|---|---|---|---|---|---|
| **low** | Mali-G52, Adreno 5xx, PowerVR | <3GB | <4 | 1.0 | No shadows, no AA, flat toneMapping, frameloop="demand" |
| **medium** | Mali-G7x, Adreno 6xx | 3-6GB | 4-6 | 1.5 | Basic shadows, FXAA, ACESFilmic |
| **high** | Adreno 7xx, Apple GPU | >6GB | 6+ | 2.0 | Full shadows, MSAA, ACESFilmic |

### Detection Method

```typescript
// GPU renderer sniffing via WEBGL_debug_renderer_info
const gl = canvas.getContext('webgl');
const ext = gl.getExtension('WEBGL_debug_renderer_info');
const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
```

Score = memory (0-3) + cores (0-3) + screenPixels (0-3) + gpuTier (0-3)
- low: score 0-4
- medium: score 5-8
- high: score 9-12

Result cached after first detection.

---

## Renderer Configuration

### R3F Canvas Settings (per tier)

```typescript
// Low tier (Galaxy A03)
<Canvas
  dpr={1}
  gl={{ antialias: false, powerPreference: 'low-power', alpha: false }}
  camera={{ position: [0, 2, 5], fov: 60 }}
  frameloop="demand"
  flat
>
```

### Performance Budgets

| Metric | Target | Maximum | Auto-Fail |
|---|---|---|---|
| FPS | 30fps | 24fps min | <20fps sustained |
| Draw calls/frame | 20 | 50 | >100 |
| Triangles/frame | 10K | 25K | >50K |
| Memory usage | 100MB | 150MB | >200MB |
| Initial load | 2s | 3s | >5s |
| Total JS bundle | 350KB | 500KB | >600KB |

### Performance Monitoring

`usePerformance()` R3F hook tracks:
- FPS (current + 60-frame average)
- Memory (if `performance.memory` available)
- Draw calls and triangle count
- Warns when below MIN_FPS (24)

`useFpsMonitor()` standalone hook for outside Canvas context.

---

## Asset Constraints

### 3D Models

| Asset | Vertices | Triangles | Format |
|---|---|---|---|
| Character | ~500 | ~300 | GLB or procedural |
| Companion | ~300 | ~200 | GLB or procedural |
| Environment prop | ~100 | ~60 | Procedural preferred |
| Tree/plant | ~200 | ~120 | Procedural preferred |

**Current approach:** All Phase 2-4 models are procedural geometry (cylinders, spheres, boxes). GLB loading deferred until asset pipeline is ready.

### Textures

| Context | Max Size | Format |
|---|---|---|
| Character skin | 256x256 | Vertex color (no texture) |
| Environment | 512x512 | WebP preferred |
| UI elements | 128x128 | PNG/SVG |

### Audio

| Type | Max Size | Format | Strategy |
|---|---|---|---|
| Music/ambient | 100KB | MP3/OGG | HTML5 streaming |
| SFX | 50KB | MP3/OGG | WebAudio sprite |
| Voice lines | 100KB | MP3 | Preloaded |
| Generated tones | 0KB (runtime) | WAV blob | OfflineAudioContext |

**Current approach:** All audio is Web Audio API tone generation (zero file downloads). Howler.js integration ready for when recorded audio is added.

---

## Asset Loading Strategy

### Sequential Loading (memory-safe)

```
1. Core JS bundle (cached by SW)
2. Game-specific code (lazy loaded)
3. Audio blobs (generated in-memory)
4. 3D assets (cache-first via Workbox)
```

Load one asset at a time on low-tier devices to prevent memory spikes.

### Service Worker Caching

| Resource | Strategy | Expiry |
|---|---|---|
| Game assets (GLB, audio, images) | CacheFirst | 30 days |
| JS/CSS bundles | StaleWhileRevalidate | 7 days |
| Google Fonts | CacheFirst | 1 year |
| Game pages | StaleWhileRevalidate | 7 days |

Total cache budget: 50MB

---

## Gameplay Loop (Orboot-style)

```
Explore → Discover → Practice → Celebrate
```

State machine in `src/stores/gameStore.ts`:

| Phase | Description | Transition |
|---|---|---|
| Explore | Child looks around, taps environment | Auto → Discover on first meaningful tap |
| Discover | Character introduces concept | Auto → Practice after intro |
| Practice | Repeated interactions (target: 5) | Auto → Celebrate when target reached |
| Celebrate | Ubuntu message, confetti, stars | Manual → Explore (Play Again) |

### Money Skills Scaffold Override

```
ENCOUNTER → IDENTIFY → COMBINE → APPLY → Celebrate
```

Each phase has its own interaction target. Completion unlocks next phase.

---

## Memory Management

### Galaxy A03 Specific

- Available browser memory: ~1.2GB (of 2GB total)
- Target game memory: 100MB (max 150MB)
- Dispose Three.js geometries/materials after scene transitions
- Use `renderer.dispose()` on unmount
- Monitor via `performance.memory` (Chrome only)

### Garbage Collection Hints

```typescript
// After scene transition
scene.traverse((obj) => {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
    else obj.material.dispose();
  }
});
renderer.renderLists.dispose();
```

---

*This file is loaded only when building 3D/renderer code. For visual rules see `brand-guide.md`, for characters see `GAME-BRIEF.md`.*
