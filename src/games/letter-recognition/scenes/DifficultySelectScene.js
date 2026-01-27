import Phaser from 'phaser';
import { COLORS, SIZES } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { DIFFICULTY, DIFFICULTY_ORDER } from '../../../config/difficulty.js';
import { getLetterConfig } from '../../../config/letters.js';
import { gameStore } from '../../../state/gameStore.js';
import { Button } from '../../../shared/ui/Button.js';

/**
 * Difficulty Select Scene — Choose Guided / Assisted / Independent
 * Shows which levels are unlocked based on star progress
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

    this.cameras.main.setBackgroundColor(COLORS.bgWarm);

    // Back button
    this.add
      .text(30, 40, '← Back', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.primary,
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Menu'));

    // Letter display
    this.add
      .text(centerX, 100, this.letter, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '120px',
        fontStyle: 'bold',
        color: config.animal.color,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 190, `${config.animal.name} — ${config.ubuntuValue.english}`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // Ubuntu value description
    this.add
      .text(centerX, 225, config.ubuntuValue.description, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'italic',
        color: COLORS.textMuted,
        wordWrap: { width: width - 80 },
        align: 'center',
      })
      .setOrigin(0.5);

    // Difficulty buttons
    this.createDifficultyButtons(centerX, 340);

    // Animal fact
    this.add
      .text(centerX, height - 120, `💡 ${config.animal.fact}`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '14px',
        color: COLORS.textMuted,
        wordWrap: { width: width - 60 },
        align: 'center',
      })
      .setOrigin(0.5);
  }

  createDifficultyButtons(centerX, startY) {
    const state = gameStore.getState();
    const buttonSpacing = 120;

    const difficultyColors = {
      guided: COLORS.primary,
      assisted: COLORS.secondary,
      independent: COLORS.accent,
    };

    const difficultyEmojis = {
      guided: '🌱',
      assisted: '🌿',
      independent: '🌳',
    };

    DIFFICULTY_ORDER.forEach((diffId, index) => {
      const diff = Object.values(DIFFICULTY).find((d) => d.id === diffId);
      const y = startY + index * buttonSpacing;
      const isUnlocked = state.isLevelUnlocked(this.letter, diffId);
      const progress = state.letterProgress[this.letter]?.[diffId];

      // Button
      const btn = new Button(this, centerX, y, `${difficultyEmojis[diffId]} ${diff.label}`, {
        width: 400,
        height: 80,
        bgColor: isUnlocked ? difficultyColors[diffId] : '#CCCCCC',
        fontSize: '28px',
        onClick: () => {
          if (!isUnlocked) return;
          gameStore.getState().setCurrentDifficulty(diffId);
          this.scene.start('LetterGame', {
            letter: this.letter,
            difficulty: diffId,
          });
        },
      });

      if (!isUnlocked) {
        btn.setDisabled(true);
      }

      // Stars for this difficulty
      if (progress) {
        const stars = '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars);
        this.add
          .text(centerX, y + 45, stars, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: isUnlocked ? COLORS.star : '#CCCCCC',
          })
          .setOrigin(0.5);
      }

      // Lock icon for locked levels
      if (!isUnlocked) {
        this.add
          .text(centerX + 220, y, '🔒', {
            fontSize: '24px',
          })
          .setOrigin(0.5);
      }
    });
  }
}
