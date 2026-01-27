/**
 * Device Configuration — Multi-device support
 * Primary target: Samsung Galaxy A03 (budget tier)
 * Must hit 30fps with <3s load time on budget devices
 */

// Device profiles — budget-first, scale up
export const DEVICE_PROFILES = {
  // Budget tier (primary target)
  'galaxy-a03': {
    width: 720,
    height: 1600,
    maxFPS: 30,
    ram: 3,
    antialias: false,
  },
  'galaxy-a05': {
    width: 720,
    height: 1600,
    maxFPS: 30,
    ram: 4,
    antialias: false,
  },
  'galaxy-a06': {
    width: 720,
    height: 1612,
    maxFPS: 30,
    ram: 4,
    antialias: false,
  },
  // Mid-tier (stretch goal)
  'galaxy-a15': {
    width: 1080,
    height: 2340,
    maxFPS: 60,
    ram: 4,
    antialias: true,
  },
  // Fallback
  'default': {
    width: 720,
    height: 1280,
    maxFPS: 30,
    ram: 3,
    antialias: false,
  },
};

// Active profile — change this to test different devices
const ACTIVE_PROFILE = 'galaxy-a03';
const profile = DEVICE_PROFILES[ACTIVE_PROFILE] || DEVICE_PROFILES['default'];

export const DEVICE_CONFIG = {
  // Game canvas dimensions (portrait, safe area)
  width: profile.width,
  height: Math.min(profile.height, 1280), // Cap canvas height for safe area

  // Performance targets
  maxFPS: profile.maxFPS,
  pixelArt: false,
  antialias: profile.antialias,
  powerPreference: 'low-power',

  // Asset budget
  maxTotalAssetsMB: 50,
  maxSingleAssetMB: 2,
  maxLoadTimeSeconds: 3,

  // Audio
  audioFormat: ['mp3', 'ogg'], // mp3 first (wider support), ogg fallback

  // Active device info
  activeProfile: ACTIVE_PROFILE,
  ram: profile.ram,
};

/**
 * Build Phaser config at runtime (after Phaser is loaded)
 * Can't reference Phaser constants at module level — Phaser may not be imported here.
 */
export function createPhaserConfig(Phaser) {
  return {
    type: Phaser.AUTO,
    width: DEVICE_CONFIG.width,
    height: DEVICE_CONFIG.height,
    backgroundColor: '#FFF8E7',
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    fps: {
      target: DEVICE_CONFIG.maxFPS,
      forceSetTimeOut: true, // More consistent on low-end devices
    },
    render: {
      pixelArt: DEVICE_CONFIG.pixelArt,
      antialias: DEVICE_CONFIG.antialias,
      powerPreference: DEVICE_CONFIG.powerPreference,
    },
  };
}
