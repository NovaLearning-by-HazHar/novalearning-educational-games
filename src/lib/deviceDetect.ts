import type { DeviceTier } from '@/types/game';

/** Renderer configuration derived from device tier */
export interface DeviceConfig {
  tier: DeviceTier;
  dpr: number;
  antialias: boolean;
  maxTextureSize: number;
  targetFps: number;
  shadowsEnabled: false; // never — baked lighting only
  maxTriangles: number;
  maxAssetKB: number;
}

const TIER_CONFIGS: Record<DeviceTier, Omit<DeviceConfig, 'tier'>> = {
  low: {
    dpr: 1,
    antialias: false,
    maxTextureSize: 512,
    targetFps: 30,
    shadowsEnabled: false,
    maxTriangles: 5_000,
    maxAssetKB: 50,
  },
  medium: {
    dpr: 1.5,
    antialias: true,
    maxTextureSize: 512,
    targetFps: 30,
    shadowsEnabled: false,
    maxTriangles: 8_000,
    maxAssetKB: 75,
  },
  high: {
    dpr: 2,
    antialias: true,
    maxTextureSize: 1024,
    targetFps: 60,
    shadowsEnabled: false,
    maxTriangles: 10_000,
    maxAssetKB: 100,
  },
};

/** Cached result so detection only runs once */
let cachedConfig: DeviceConfig | null = null;

/**
 * Detects device performance tier using GPU renderer, memory, and cores.
 * Galaxy A03 baseline: 3GB RAM, Mali-G52, 720x1600.
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low';
  return getDeviceConfig().tier;
}

/**
 * Returns full device config with renderer settings.
 * Cached after first call — safe to call frequently.
 */
export function getDeviceConfig(): DeviceConfig {
  if (cachedConfig) return cachedConfig;
  if (typeof window === 'undefined') {
    return { tier: 'low', ...TIER_CONFIGS.low };
  }

  const tier = classifyDevice();
  cachedConfig = { tier, ...TIER_CONFIGS[tier] };
  return cachedConfig;
}

function classifyDevice(): DeviceTier {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return 'low';

  // GPU renderer sniffing
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
    : '';

  canvas.remove();

  // Known low-end GPUs (Galaxy A03 class)
  const lowEndGpus = ['mali-g52', 'mali-g51', 'mali-t', 'adreno 5', 'adreno 4', 'powervr'];
  const isLowGpu = lowEndGpus.some((gpu) => renderer.includes(gpu));

  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 2;
  const cores = navigator.hardwareConcurrency ?? 2;
  const screenPixels = window.screen.width * window.screen.height;

  // Score-based classification
  let score = 0;
  if (memory >= 6) score += 2;
  else if (memory >= 4) score += 1;
  if (cores >= 8) score += 2;
  else if (cores >= 6) score += 1;
  if (screenPixels > 2_000_000) score += 1; // > 1080p
  if (isLowGpu) score -= 2;

  if (score <= 1) return 'low';
  if (score <= 3) return 'medium';
  return 'high';
}

/**
 * Checks if WebGL 1.0 is available (mandatory requirement).
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const available = !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
    canvas.remove();
    return available;
  } catch {
    return false;
  }
}
