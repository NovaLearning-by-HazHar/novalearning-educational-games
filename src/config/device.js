/**
 * Device Configuration — Target: Samsung Galaxy A03
 * 720x1600 display, 3GB RAM, Mali-G52 GPU
 * Must hit 30fps with <3s load time
 */

export const DEVICE_CONFIG = {
  // Game canvas dimensions (portrait, safe area)
  width: 720,
  height: 1280,

  // Performance targets
  maxFPS: 30,
  pixelArt: false,
  antialias: false,
  powerPreference: 'low-power',

  // Asset budget
  maxTotalAssetsMB: 50,
  maxSingleAssetMB: 2,
  maxLoadTimeSeconds: 3,

  // Audio
  audioFormat: ['mp3', 'ogg'], // mp3 first (wider support), ogg fallback
};

export const PHASER_CONFIG = {
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
