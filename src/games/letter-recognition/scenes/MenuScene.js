import Phaser from 'phaser';
import { COLORS, SIZES, ANIMATIONS } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { LETTER_ORDER, getLetterConfig } from '../../../config/letters.js';
import { gameStore } from '../../../state/gameStore.js';
import {
  createGradientBackground,
  createFloatingDecor,
  createBanner,
  createChunkyText,
  drawCard,
  createAnimalPlaceholder,
} from '../../../shared/ui/UIHelpers.js';

/**
 * Menu Scene — Letter selection hub
 * Game-quality design: gradient background, 3D cards, animated elements
 * Inspired by Orboot AR / modern children's educational games
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    const { width, height } = DEVICE_CONFIG;
    const centerX = width / 2;

    // === BACKGROUND ===
    // Rich gradient (African sunset feel — warm gold to deep green)
    createGradientBackground(this, width, height, '#FFE8A0', '#A8D5A2');

    // Floating decorative elements
    createFloatingDecor(this, width, height, {
      emojis: ['🌿', '🍃', '✨', '🌻', '🦋'],
      count: 10,
      depth: -10,
    });

    // === HEADER BANNER ===
    createBanner(this, centerX, 55, 500, 'NovaLearning', {
      bgColor: 0x2D9B4E,
      fontSize: '36px',
      height: 56,
    });

    // Subtitle
    createChunkyText(this, centerX, 105, '🌍 Choose Your Letter!', {
      fontSize: '22px',
      color: '#4A3728',
      strokeColor: '#FFFFFF',
      strokeThickness: 3,
      shadowOffsetY: 2,
    });

    // Total stars display
    const state = gameStore.getState();
    const totalPossible = LETTER_ORDER.length * 9;
    this.createStarCounter(centerX, 145, state.totalStars, totalPossible);

    // === LETTER GRID ===
    this.createLetterGrid(centerX, 200);

    // === SETTINGS ===
    this.createSettingsBar(centerX, height - 60);
  }

  createStarCounter(x, y, current, total) {
    // Star counter with glow
    const container = this.add.container(0, 0).setDepth(15);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.2);
    bg.fillRoundedRect(x - 80, y - 18, 160, 36, 18);
    container.add(bg);

    const inner = this.add.graphics();
    inner.fillStyle(0xFFD700, 0.3);
    inner.fillRoundedRect(x - 78, y - 16, 156, 32, 16);
    container.add(inner);

    const text = createChunkyText(this, x, y, `⭐ ${current} / ${total}`, {
      fontSize: '20px',
      color: '#FFD700',
      strokeColor: '#4A3728',
      strokeThickness: 3,
      depth: 16,
    });
    container.add(text);

    return container;
  }

  createLetterGrid(centerX, startY) {
    const cols = 2;
    const cardWidth = 300;
    const cardHeight = 280;
    const gapX = 24;
    const gapY = 20;

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
    const animalColor = Phaser.Display.Color.HexStringToColor(config.animal.color).color;

    // Card with shadow and depth
    const card = drawCard(this, x, y, cardWidth, cardHeight, {
      fillColor: 0xFFFFF5,
      radius: 24,
      shadowAlpha: 0.2,
      shadowOffsetY: 8,
      strokeColor: animalColor,
      strokeWidth: 3,
      depth: 5,
    });

    // Colored accent bar at top of card
    const accent = this.add.graphics().setDepth(6);
    accent.fillStyle(animalColor, 0.9);
    accent.fillRoundedRect(
      x - cardWidth / 2,
      y - cardHeight / 2,
      cardWidth,
      50,
      { tl: 24, tr: 24, bl: 0, br: 0 }
    );

    // Big letter (chunky game-style)
    createChunkyText(this, x - 40, y - cardHeight / 2 + 26, letter, {
      fontSize: '40px',
      color: '#FFFFFF',
      strokeColor: config.animal.color,
      strokeThickness: 4,
      depth: 8,
    });

    // Lowercase
    createChunkyText(this, x + 40, y - cardHeight / 2 + 28, config.lower, {
      fontSize: '28px',
      color: '#FFFFFF',
      strokeColor: config.animal.color,
      strokeThickness: 3,
      depth: 8,
    }).setAlpha(0.8);

    // Animal display (real sprite if loaded, placeholder otherwise)
    const animalSize = 110;
    createAnimalPlaceholder(this, x, y + 10, letter, config.animal.color, animalSize, config.animal.sprite);

    // Animal name
    createChunkyText(this, x, y + animalSize / 2 + 28, config.animal.name, {
      fontSize: '20px',
      color: '#4A3728',
      strokeColor: '#FFFFFF',
      strokeThickness: 3,
      depth: 8,
    });

    // Ubuntu value
    this.add.text(x, y + animalSize / 2 + 52, config.ubuntuValue.english, {
      fontFamily: 'Nunito, Arial, sans-serif',
      fontSize: '14px',
      fontStyle: 'italic',
      color: COLORS.primary,
    }).setOrigin(0.5).setDepth(8);

    // Stars display (visual, not text)
    this.createCardStars(x, y + cardHeight / 2 - 28, stars, 9);

    // Interactive hit area (covers entire card, 64px+ in all directions)
    const hitArea = this.add
      .rectangle(x, y, cardWidth, cardHeight)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001)
      .setDepth(20);

    hitArea.on('pointerdown', () => {
      // Bounce press effect
      this.tweens.add({
        targets: card,
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

  createCardStars(x, y, earned, total) {
    const starSize = 18;
    const spacing = starSize + 2;
    const visibleStars = Math.min(total, 9); // Show max 9
    const startX = x - ((visibleStars - 1) * spacing) / 2;

    for (let i = 0; i < visibleStars; i++) {
      const sx = startX + i * spacing;
      const filled = i < earned;

      // Star shadow
      if (filled) {
        const glow = this.add.graphics().setDepth(7);
        glow.fillStyle(0xFFD700, 0.3);
        glow.fillCircle(sx, y, starSize * 0.6);
      }

      const star = this.add.text(sx, y, filled ? '⭐' : '☆', {
        fontSize: `${starSize}px`,
        color: filled ? '#FFD700' : '#CCC',
      }).setOrigin(0.5).setDepth(8);

      if (filled) {
        // Subtle shine animation on earned stars
        this.tweens.add({
          targets: star,
          scale: 1.1,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          delay: i * 150,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }

  createSettingsBar(x, y) {
    const state = gameStore.getState();

    // Settings background pill
    const bg = this.add.graphics().setDepth(15);
    bg.fillStyle(0x000000, 0.15);
    bg.fillRoundedRect(x - 80, y - 28, 160, 56, 28);

    // Sound toggle — 64px hit area
    const soundBtn = createChunkyText(this, x - 35, y, state.soundEnabled ? '🔊' : '🔇', {
      fontSize: '32px',
      color: '#FFFFFF',
      strokeThickness: 0,
      depth: 16,
    });

    const soundHit = this.add.rectangle(x - 35, y, 64, 64)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001)
      .setDepth(17);

    soundHit.on('pointerdown', () => {
      gameStore.getState().toggleSound();
      const newState = gameStore.getState();
      soundBtn.setText(newState.soundEnabled ? '🔊' : '🔇');
    });

    // Music toggle — 64px hit area
    const musicBtn = createChunkyText(this, x + 35, y, '🎵', {
      fontSize: '32px',
      color: '#FFFFFF',
      strokeThickness: 0,
      depth: 16,
    });
    musicBtn.setAlpha(state.musicEnabled ? 1 : 0.4);

    const musicHit = this.add.rectangle(x + 35, y, 64, 64)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001)
      .setDepth(17);

    musicHit.on('pointerdown', () => {
      gameStore.getState().toggleMusic();
      const newState = gameStore.getState();
      musicBtn.setAlpha(newState.musicEnabled ? 1 : 0.4);
    });
  }
}
