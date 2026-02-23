import Phaser from 'phaser';
import { COLORS } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { DIFFICULTY_ORDER } from '../../../config/difficulty.js';
import { getLetterConfig } from '../../../config/letters.js';
import { gameStore } from '../../../state/gameStore.js';
import {
  createThemedBackground,
  createFloatingDecor,
  createChunkyText,
  createGameButton,
  createAnimalDisplay,
  createBackButton,
  drawCard,
} from '../../../shared/ui/UIHelpers.js';

/**
 * Difficulty Select Scene — Choose Guided / Assisted / Independent
 * Game-quality design with depth, animation, and rich visuals
 */
export class DifficultySelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DifficultySelect' });
  }

  init(data) {
    this.letter = data.letter;
  }

  create() {
    const { width, height } = DEVICE_CONFIG;
    const centerX = width / 2;
    const config = getLetterConfig(this.letter);
    const animalColor = config.animal.color;

    // === BACKGROUND ===
    createThemedBackground(this, 'jungle');

    createFloatingDecor(this, {
      emojis: ['🌿', '🍃', '✨', '🌻'],
      count: 6,
      depth: -10,
    });

    // === BACK BUTTON ===
    createBackButton(this, () => this.scene.start('Menu'));

    // === LETTER HERO SECTION ===
    // Big card showing the letter + animal
    const _heroCard = drawCard(this, centerX, 190, width - 60, 280, {
      fillColor: 0xFFFFF5,
      radius: 28,
      shadowAlpha: 0.2,
      shadowOffsetY: 8,
      strokeColor: Phaser.Display.Color.HexStringToColor(animalColor).color,
      strokeWidth: 3,
      depth: 5,
    });

    // Giant letter
    createChunkyText(this, centerX - 120, 160, this.letter, {
      fontSize: '140px',
      color: animalColor,
      strokeColor: '#FFFFFF',
      strokeThickness: 6,
      shadowOffsetY: 5,
      depth: 10,
    });

    // Lowercase
    createChunkyText(this, centerX - 40, 200, config.lower, {
      fontSize: '60px',
      color: animalColor,
      strokeColor: '#FFFFFF',
      strokeThickness: 4,
      depth: 10,
    }).setAlpha(0.7);

    // Animal display (real sprite if loaded, placeholder otherwise)
    createAnimalDisplay(this, centerX + 100, 170, this.letter, animalColor, 130, config.animal.sprite);

    // Animal name + Ubuntu value
    createChunkyText(this, centerX, 270, `${config.animal.name}`, {
      fontSize: '24px',
      color: '#4A3728',
      strokeColor: '#FFFFFF',
      strokeThickness: 3,
      depth: 10,
    });

    this.add.text(centerX, 300, `"${config.ubuntuValue.description}"`, {
      fontFamily: 'Nunito, Arial, sans-serif',
      fontSize: '15px',
      fontStyle: 'italic',
      color: COLORS.textMuted,
      wordWrap: { width: width - 100 },
      align: 'center',
    }).setOrigin(0.5).setDepth(10);

    // === DIFFICULTY BUTTONS ===
    this.createDifficultyButtons(centerX, 400);

    // === ANIMAL FACT ===
    const _factCard = drawCard(this, centerX, height - 90, width - 40, 100, {
      fillColor: 0x2D9B4E,
      fillAlpha: 0.1,
      radius: 16,
      shadowAlpha: 0,
      depth: 5,
    });

    this.add.text(centerX, height - 90, `💡 ${config.animal.fact}`, {
      fontFamily: 'Nunito, Arial, sans-serif',
      fontSize: '13px',
      color: COLORS.textMuted,
      wordWrap: { width: width - 80 },
      align: 'center',
    }).setOrigin(0.5).setDepth(10);
  }

  createDifficultyButtons(centerX, startY) {
    const state = gameStore.getState();
    const buttonSpacing = 95;

    const difficultyStyles = {
      guided: { color: 0x4ADE80, icon: '🌱', label: 'Guided' },
      assisted: { color: 0xFB923C, icon: '🌿', label: 'Assisted' },
      independent: { color: 0x38BDF8, icon: '🌳', label: 'Independent' },
    };

    DIFFICULTY_ORDER.forEach((diffId, index) => {
      const style = difficultyStyles[diffId];
      const y = startY + index * buttonSpacing;
      const isUnlocked = state.isLevelUnlocked(this.letter, diffId);
      const progress = state.letterProgress[this.letter]?.[diffId];

      const btn = createGameButton(this, centerX, y, style.label, {
        width: 420,
        height: 72,
        bgColor: isUnlocked ? style.color : 0x999999,
        fontSize: '26px',
        icon: isUnlocked ? style.icon : '🔒',
        depth: 10,
        onClick: isUnlocked ? () => {
          gameStore.getState().setCurrentDifficulty(diffId);
          this.scene.start('LetterGame', {
            letter: this.letter,
            difficulty: diffId,
          });
        } : null,
      });

      if (!isUnlocked) {
        btn.setEnabled(false);
      }

      // Stars for this difficulty
      if (progress && progress.stars > 0) {
        const starsText = '⭐'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars);
        createChunkyText(this, centerX, y + 42, starsText, {
          fontSize: '16px',
          color: '#FFD700',
          strokeColor: '#4A3728',
          strokeThickness: 2,
          depth: 11,
        });
      }
    });
  }
}
