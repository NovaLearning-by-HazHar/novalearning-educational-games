import Phaser from 'phaser';
import { COLORS } from '../config/theme.js';
import { DEVICE_CONFIG } from '../config/device.js';
import { audioManager } from '../state/audioManager.js';
import { getAllAudioKeys } from '../config/audio.js';

/**
 * Boot Scene — Shared preloader for all games
 * Shows NovaLearning logo + progress bar while assets load
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  init(data) {
    this.nextScene = data.nextScene || 'Menu';
    this.gameAssets = data.assets || [];
  }

  preload() {
    this.createProgressBar();
    this.loadSharedAssets();
    this.loadGameAssets();
  }

  createProgressBar() {
    const { width, height } = DEVICE_CONFIG;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    this.cameras.main.setBackgroundColor(COLORS.bgWarm);

    // "NovaLearning" text
    this.add
      .text(centerX, centerY - 100, 'NovaLearning', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: COLORS.primary,
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(centerX, centerY - 50, 'I am because we are', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'italic',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    // Progress bar background
    const barWidth = 400;
    const barHeight = 30;
    const barX = centerX - barWidth / 2;
    const barY = centerY + 20;

    this.add
      .rectangle(centerX, barY + barHeight / 2, barWidth, barHeight)
      .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(COLORS.textMuted).color)
      .setFillStyle(0xffffff);

    // Progress bar fill
    this.progressBar = this.add
      .rectangle(barX + 2, barY + 2, 0, barHeight - 4)
      .setOrigin(0, 0);

    // Progress text
    this.progressText = this.add
      .text(centerX, barY + barHeight + 30, 'Loading...', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '16px',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    // Progress events
    this.load.on('progress', (value) => {
      this.progressBar.width = (barWidth - 4) * value;
      this.progressBar.setFillStyle(
        Phaser.Display.Color.HexStringToColor(COLORS.primary).color
      );
      this.progressText.setText(`Loading... ${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      this.progressText.setText('Ready!');
    });
  }

  loadSharedAssets() {
    // Preload all audio from registry via Howler (not Phaser loader)
    // Missing files fail silently — audio hooks are wired, files can be added later
    audioManager.preloadFromRegistry(getAllAudioKeys());
  }

  loadGameAssets() {
    // Game-specific assets passed via init data
    this.gameAssets.forEach((asset) => {
      switch (asset.type) {
        case 'image':
          this.load.image(asset.key, asset.path);
          break;
        case 'spritesheet':
          this.load.spritesheet(asset.key, asset.path, asset.frameConfig);
          break;
        case 'audio':
          this.load.audio(asset.key, asset.path);
          break;
        case 'atlas':
          this.load.atlas(asset.key, asset.imagePath, asset.jsonPath);
          break;
      }
    });
  }

  create() {
    // Brief pause to show "Ready!" then transition
    this.time.delayedCall(500, () => {
      this.scene.start(this.nextScene);
    });
  }
}
