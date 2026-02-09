import type { DeviceTier } from '@/types/game';

/**
 * Detects device performance tier.
 * Galaxy A03 baseline: 3GB RAM, Mali GPU, 720x1600.
 * Returns 'low' for Galaxy A03 class, 'medium' for mid-range, 'high' for flagship.
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');

  if (!gl) return 'low';

  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 2;
  const cores = navigator.hardwareConcurrency ?? 2;

  canvas.remove();

  if (memory <= 3 || cores <= 4) return 'low';
  if (memory <= 6) return 'medium';
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
