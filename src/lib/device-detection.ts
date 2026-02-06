export type PerformanceTier = 'low' | 'medium' | 'high';
export interface DeviceProfile {
  tier: PerformanceTier; maxVertices: number; maxTextureSize: number;
  enableShadows: boolean; enablePostProcessing: boolean;
  pixelRatio: number; targetFPS: number; maxDrawCalls: number;
}
const PROFILES: Record<PerformanceTier, DeviceProfile> = {
  low: { tier:'low', maxVertices:5000, maxTextureSize:256, enableShadows:false, enablePostProcessing:false, pixelRatio:1, targetFPS:30, maxDrawCalls:50 },
  medium: { tier:'medium', maxVertices:10000, maxTextureSize:512, enableShadows:false, enablePostProcessing:false, pixelRatio:1.5, targetFPS:60, maxDrawCalls:100 },
  high: { tier:'high', maxVertices:25000, maxTextureSize:1024, enableShadows:true, enablePostProcessing:true, pixelRatio:2, targetFPS:60, maxDrawCalls:200 },
};
export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'low';
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase() : '';
  const deviceMemory = (navigator as any).deviceMemory || 2;
  const cores = navigator.hardwareConcurrency || 2;
  const isLowGPU = /mali-g5[0-2]|mali-t|adreno.[0-5]\d\d|powervr/i.test(renderer);
  const isHighGPU = /adreno.[7-9]\d\d|mali-g7[1-9]|apple gpu|nvidia|radeon/i.test(renderer);
  if (isHighGPU && deviceMemory >= 6 && cores >= 6) return 'high';
  if (isLowGPU || deviceMemory <= 3 || cores <= 2) return 'low';
  return 'medium';
}
export function getDeviceProfile(): DeviceProfile { return PROFILES[detectPerformanceTier()]; }
export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
export function isBaselineDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('sm-a035') || ua.includes('galaxy a03');
}