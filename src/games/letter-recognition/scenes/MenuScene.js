import Phaser from 'phaser';
import { COLORS, SIZES, ANIMATIONS } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { LETTER_ORDER, getLetterConfig } from '../../../config/letters.js';
import { gameStore } from '../../../state/gameStore.js';
import { Button } from '../../../shared/ui/Button.js';

/**
 * Menu Scene — Letter selection grid
 * Shows A-F with animal previews, star progress, and difficulty selection
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    const { width, height } = DEVICE_CONFIG;
    const centerX = width / 2;

    this.cameras.main.setBackgroundColor(COLORS.bgWarm);

    // Header
    this.add
      .text(centerX, 60, 'NovaLearning', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
        color: COLORS.primary,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 105, 'Choose a Letter', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '24px',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    // Total stars display
    const state = gameStore.getState();
    this.add
      .text(centerX, 145, `★ ${state.totalStars} / ${LETTER_ORDER.length * 9}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.star,
      })
      .setOrigin(0.5);

    // Letter grid (2 columns, 3 rows)
    this.createLetterGrid(centerX, 220);

    // Settings button (bottom)
    this.createSettingsButton(centerX, height - 80);
  }

  createLetterGrid(centerX, startY) {
    const cols = 2;
    const cardWidth = 280;
    const cardHeight = 260;
    const gapX = 30;
    const gapY = 24;

    LETTER_ORDER.forEach((letter, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = centerX + (col - 0.5) * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY) + cardHeight / 2;

      this.createLetterCard(x, y, letter, cardWidth, cardHeight);
    });
  }

  createLetterCard(x, y, letter, cardWidth, cardHeight) {
    const config = getLetterConfig(letter);
    const state = gameStore.getState();
    const stars = state.getLetterStars(letter);

    // Card background
    const card = this.add.graphics();
    card.fillStyle(0xffffff, 1);
    card.fillRoundedRect(
      x - cardWidth / 2,
      y - cardHeight / 2,
      cardWidth,
      cardHeight,
      16
    );
    // Subtle border
    card.lineStyle(2, Phaser.Display.Color.HexStringToColor(config.animal.color).color);
    card.strokeRoundedRect(
      x - cardWidth / 2,
      y - cardHeight / 2,
      cardWidth,
      cardHeight,
      16
    );

    // Big letter
    this.add
      .text(x, y - 60, letter, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '80px',
        fontStyle: 'bold',
        color: config.animal.color,
      })
      .setOrigin(0.5);

    // Lowercase
    this.add
      .text(x + 50, y - 30, config.lower, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '40px',
        color: config.animal.color,
      })
      .setOrigin(0.5)
      .setAlpha(0.6);

    // Animal name
    this.add
      .text(x, y + 30, config.animal.name, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // Ubuntu value
    this.add
      .text(x, y + 58, config.ubuntuValue.english, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'italic',
        color: COLORS.primary,
      })
      .setOrigin(0.5);

    // Stars
    const starText = '★'.repeat(Math.min(stars, 9)) + '☆'.repeat(Math.max(0, 9 - stars));
    this.add
      .text(x, y + 90, starText, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: COLORS.star,
      })
      .setOrigin(0.5);

    // Interactive hit area
    const hitArea = this.add
      .rectangle(x, y, cardWidth, cardHeight)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001);

    hitArea.on('pointerdown', () => {
      // Scale bounce on tap
      this.tweens.add({
        targets: [card],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          gameStore.getState().setCurrentLetter(letter);
          this.scene.start('DifficultySelect', { letter });
        },
      });
    });
  }

  createSettingsButton(x, y) {
    const state = gameStore.getState();
    
    // Sound toggle — 64px hit area for kid fingers
    const soundBtn = this.add
      .text(x - 60, y, state.soundEnabled ? '🔊' : '🔇', {
        fontSize: '36px',
      })
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
        hitArea: new Phaser.Geom.Rectangle(-32, -32, 64, 64),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      });

    soundBtn.on('pointerdown', () => {
      gameStore.getState().toggleSound();
      const newState = gameStore.getState();
      soundBtn.setText(newState.soundEnabled ? '🔊' : '🔇');
    });

    // Music toggle — 64px hit area
    const musicBtn = this.add
      .text(x + 60, y, state.musicEnabled ? '🎵' : '🎵', {
        fontSize: '36px',
      })
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
        hitArea: new Phaser.Geom.Rectangle(-32, -32, 64, 64),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      })
      .setAlpha(state.musicEnabled ? 1 : 0.4);

    musicBtn.on('pointerdown', () => {
      gameStore.getState().toggleMusic();
      const newState = gameStore.getState();
      musicBtn.setAlpha(newState.musicEnabled ? 1 : 0.4);
    });
  }
}
