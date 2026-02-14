import Phaser from 'phaser';
import { COLORS, SIZES, ANIMATIONS } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { getLetterConfig, LETTER_ORDER } from '../../../config/letters.js';
import { getDifficulty } from '../../../config/difficulty.js';
import { gameStore } from '../../../state/gameStore.js';
import { audioManager } from '../../../state/audioManager.js';
import { StarDisplay } from '../../../shared/ui/StarDisplay.js';
import {
  createThemedBackground,
  createFloatingDecor,
  createChunkyText,
  createGameButton,
  createAnimalDisplay,
  drawCard,
  createBurstEffect,
  createConfetti,
  screenFlash,
  createBanner,
  createBackButton,
  createPhaseIndicator,
} from '../../../shared/ui/UIHelpers.js';

/**
 * Letter Game Scene — Core gameplay (redesigned with game-quality visuals)
 *
 * Flow:
 * 1. Letter Introduction — Cinematic reveal with animal + audio
 * 2. Letter Tracing — Draw over the ghost letter
 * 3. Letter Matching — Find correct letter among rich card options
 * 4. Results — Celebration, stars, Ubuntu value reveal
 */
export class LetterGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LetterGame' });
  }

  init(data) {
    this.letter = data.letter;
    this.difficulty = data.difficulty;
    this.letterConfig = getLetterConfig(this.letter);
    this.diffConfig = getDifficulty(this.difficulty);

    this.score = 0;
    this.mistakes = 0;
    this.phase = 'intro';
  }

  create() {
    const { width, height } = DEVICE_CONFIG;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.sceneWidth = width;
    this.sceneHeight = height;

    // Start with intro
    this.showIntro();
  }

  // ==================== SHARED UI ====================

  setupScene(themeName = 'safari') {
    createThemedBackground(this, themeName);
    createFloatingDecor(this, { emojis: ['🌿', '🍃', '✨'], count: 5, depth: -10 });
    createBackButton(this, () => this.scene.start('DifficultySelect', { letter: this.letter }));
  }

  // ==================== PHASE 1: INTRODUCTION ====================
  showIntro() {
    this.phase = 'intro';
    this.children.removeAll(true);

    const color = this.letterConfig.animal.color;
    this.setupScene('safari');
    createPhaseIndicator(this, 1);

    // === CINEMATIC LETTER REVEAL ===

    // Large colored backdrop circle
    const backdropColor = Phaser.Display.Color.HexStringToColor(color).color;
    const backdrop = this.add.graphics().setDepth(1);
    backdrop.fillStyle(backdropColor, 0.12);
    backdrop.fillCircle(this.centerX, 300, 180);

    // Big letter — starts off-screen, bounces in
    const bigLetter = createChunkyText(this, this.centerX, 280, this.letter, {
      fontSize: '200px',
      color: color,
      strokeColor: '#FFFFFF',
      strokeThickness: 8,
      shadowOffsetY: 6,
      depth: 10,
    });
    bigLetter.setScale(0);

    this.tweens.add({
      targets: bigLetter,
      scale: 1,
      duration: 700,
      ease: 'Back.easeOut',
      onComplete: () => {
        audioManager.playLetterSound(this.letter);
        // Sparkle burst on letter
        createBurstEffect(this, this.centerX, 280, {
          count: 8,
          emojis: ['✨', '💫'],
          spread: 120,
          duration: 1000,
        });
      },
    });

    // Lowercase letter
    const smallLetter = createChunkyText(this, this.centerX + 110, 340, this.letterConfig.lower, {
      fontSize: '80px',
      color: color,
      strokeColor: '#FFFFFF',
      strokeThickness: 5,
      depth: 10,
    });
    smallLetter.setAlpha(0);
    this.tweens.add({
      targets: smallLetter,
      alpha: 0.7,
      duration: 400,
      delay: 500,
    });

    // Animal showcase (real sprite if loaded, placeholder otherwise)
    const animal = createAnimalDisplay(this, this.centerX, 560, this.letter, color, 160, this.letterConfig.animal.sprite);
    animal.setDepth(8);

    // Animal name banner
    this.time.delayedCall(600, () => {
      const nameText = createChunkyText(this, this.centerX, 680,
        `${this.letter} is for ${this.letterConfig.animal.name}!`, {
          fontSize: '28px',
          color: '#4A3728',
          strokeColor: '#FFFFFF',
          strokeThickness: 4,
          depth: 10,
        });
      nameText.setScale(0);
      this.tweens.add({
        targets: nameText,
        scale: 1,
        duration: 400,
        ease: 'Back.easeOut',
      });
    });

    // Zulu name
    this.time.delayedCall(800, () => {
      createChunkyText(this, this.centerX, 720, this.letterConfig.animal.zuluName, {
        fontSize: '18px',
        color: '#8B7355',
        strokeColor: '#FFFFFF',
        strokeThickness: 2,
        depth: 10,
      });
    });

    // Phonics hint (guided mode)
    if (this.diffConfig.showHints) {
      this.time.delayedCall(1000, () => {
        createChunkyText(this, this.centerX, 780,
          `🔊 "${this.letterConfig.phonics.sound}"`, {
            fontSize: '18px',
            color: '#2D9B4E',
            strokeColor: '#FFFFFF',
            strokeThickness: 2,
            depth: 10,
          });
      });
    }

    // "Tap to continue" button
    this.time.delayedCall(1500, () => {
      const continueBtn = createGameButton(this, this.centerX, 900, 'Let\'s Go!', {
        width: 280,
        height: 70,
        gradientTop: 0xFB923C,
        gradientBottom: 0xEA580C,
        shadowColor: 0x7C2D12,
        fontSize: 28,
        icon: '▶',
        depth: 15,
        onClick: () => this.showTracing(),
      });

      // Gentle pulse to draw attention
      this.tweens.add({
        targets: continueBtn,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  // ==================== PHASE 2: TRACING ====================
  showTracing() {
    this.phase = 'trace';
    this.children.removeAll(true);

    this.setupScene('safari');
    createPhaseIndicator(this, 2);

    // Header
    createBanner(this, this.centerX, 80, 400, 'Trace the Letter!', {
      bgColor: Phaser.Display.Color.HexStringToColor(this.letterConfig.animal.color).color,
      fontSize: '26px',
      height: 50,
    });

    // Tracing area card
    drawCard(this, this.centerX, 440, this.sceneWidth - 60, 500, {
      fillColor: 0xFFFFF8,
      radius: 24,
      shadowAlpha: 0.15,
      shadowOffsetY: 6,
      depth: 1,
    });

    // Ghost letter (large, faded — trace target)
    createChunkyText(this, this.centerX, 440, this.letter, {
      fontSize: '280px',
      color: this.letterConfig.animal.color,
      strokeColor: '#FFFFFF',
      strokeThickness: 4,
      depth: 2,
    }).setAlpha(0.15);

    // Drawing surface
    this.traceGraphics = this.add.graphics().setDepth(10);
    this.traceGraphics.lineStyle(14, Phaser.Display.Color.HexStringToColor(this.letterConfig.animal.color).color, 1);

    this.isDrawing = false;
    this.tracePoints = [];

    // Touch input handlers
    this._onTraceDown = (pointer) => {
      // Only trace within the card area
      if (pointer.y < 200 || pointer.y > 680) return;
      this.isDrawing = true;
      this.tracePoints = [{ x: pointer.x, y: pointer.y }];
      this.traceGraphics.beginPath();
      this.traceGraphics.moveTo(pointer.x, pointer.y);
    };
    this._onTraceMove = (pointer) => {
      if (!this.isDrawing) return;
      this.tracePoints.push({ x: pointer.x, y: pointer.y });
      this.traceGraphics.lineTo(pointer.x, pointer.y);
      this.traceGraphics.strokePath();
      this.traceGraphics.beginPath();
      this.traceGraphics.moveTo(pointer.x, pointer.y);
    };
    this._onTraceUp = () => {
      this.isDrawing = false;
      if (this.tracePoints.length > 15 && this.validateTrace()) {
        this.onTraceComplete();
      } else if (this.tracePoints.length > 5) {
        this.showTraceHint('Keep going! Trace the whole letter.');
      }
    };

    this.input.on('pointerdown', this._onTraceDown);
    this.input.on('pointermove', this._onTraceMove);
    this.input.on('pointerup', this._onTraceUp);

    // Hint for guided mode
    if (this.diffConfig.showHints) {
      createChunkyText(this, this.centerX, 730, '👆 Trace over the letter!', {
        fontSize: '18px',
        color: '#8B7355',
        strokeColor: '#FFFFFF',
        strokeThickness: 2,
        depth: 10,
      });
    }

    // Skip button
    createChunkyText(this, this.sceneWidth - 60, 40, 'Skip →', {
      fontSize: '18px',
      color: '#FFFFFF',
      strokeColor: '#8B7355',
      strokeThickness: 3,
      depth: 50,
    });

    this.add.rectangle(this.sceneWidth - 60, 40, 100, 64)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001)
      .setDepth(51)
      .on('pointerdown', () => this.onTraceComplete());
  }

  validateTrace() {
    if (this.tracePoints.length < 15) return false;
    const letterBounds = {
      minX: this.centerX - 120,
      maxX: this.centerX + 120,
      minY: 440 - 140,
      maxY: 440 + 140,
    };
    const pointsInBounds = this.tracePoints.filter(
      (p) => p.x >= letterBounds.minX && p.x <= letterBounds.maxX &&
             p.y >= letterBounds.minY && p.y <= letterBounds.maxY
    );
    return pointsInBounds.length / this.tracePoints.length >= 0.4;
  }

  showTraceHint(message) {
    if (this._traceHintText) this._traceHintText.destroy();
    this._traceHintText = createChunkyText(this, this.centerX, 780, message, {
      fontSize: '18px',
      color: '#E8A317',
      strokeColor: '#FFFFFF',
      strokeThickness: 2,
      depth: 15,
    });
    this.tweens.add({
      targets: this._traceHintText,
      alpha: 0,
      duration: 600,
      delay: 2000,
      onComplete: () => {
        if (this._traceHintText) this._traceHintText.destroy();
        this._traceHintText = null;
      },
    });
  }

  onTraceComplete() {
    this.score += 10;
    audioManager.playFeedback('correct');

    this.input.off('pointerdown', this._onTraceDown);
    this.input.off('pointermove', this._onTraceMove);
    this.input.off('pointerup', this._onTraceUp);

    // Big checkmark + burst
    const check = createChunkyText(this, this.centerX, 440, '✓', {
      fontSize: '120px',
      color: '#2D9B4E',
      strokeColor: '#FFFFFF',
      strokeThickness: 6,
      depth: 20,
    });
    check.setScale(0);

    this.tweens.add({
      targets: check,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });

    createBurstEffect(this, this.centerX, 440, {
      count: 12,
      emojis: ['⭐', '✨', '💫'],
      spread: 150,
      duration: 1200,
    });

    const feedback = createChunkyText(this, this.centerX, 600, 'Great Tracing!', {
      fontSize: '28px',
      color: '#2D9B4E',
      strokeColor: '#FFFFFF',
      strokeThickness: 4,
      depth: 20,
    });
    feedback.setScale(0);
    this.tweens.add({
      targets: feedback,
      scale: 1,
      duration: 300,
      delay: 200,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1500, () => this.showMatching());
  }

  // ==================== PHASE 3: MATCHING ====================
  showMatching() {
    this.phase = 'match';
    this.children.removeAll(true);

    this.setupScene('sky');
    createPhaseIndicator(this, 3);

    // Header
    createBanner(this, this.centerX, 80, 450, `Find the letter ${this.letter}!`, {
      bgColor: Phaser.Display.Color.HexStringToColor(this.letterConfig.animal.color).color,
      fontSize: '26px',
      height: 50,
    });

    // Target letter display
    createChunkyText(this, this.centerX, 160, this.letter, {
      fontSize: '80px',
      color: this.letterConfig.animal.color,
      strokeColor: '#FFFFFF',
      strokeThickness: 6,
      depth: 10,
    });

    // Generate and shuffle options
    const options = this.generateOptions();
    const shuffled = Phaser.Utils.Array.Shuffle([...options]);

    // Card grid
    const cols = 3;
    const cardSize = 160;
    const gap = 24;
    const rows = Math.ceil(shuffled.length / cols);
    const totalGridHeight = rows * (cardSize + gap) - gap;
    const startX = this.centerX - ((cols - 1) * (cardSize + gap)) / 2;
    const startY = 250 + (this.sceneHeight - 250 - 100 - totalGridHeight) / 2;

    this.matchAttempts = 0;

    shuffled.forEach((opt, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardSize + gap);
      const y = startY + row * (cardSize + gap);

      this.createMatchCard(x, y, opt, cardSize);
    });

    // Guided hint timer
    if (this.diffConfig.showHints) {
      this._hintTimer = this.time.delayedCall(5000, () => {
        this.children.each((child) => {
          if (child.type === 'Text' && child.getData && child.getData('isMatchLetter') &&
              (child.text === this.letter || child.text === this.letterConfig.lower)) {
            this.tweens.add({
              targets: child,
              scale: 1.2,
              duration: 500,
              yoyo: true,
              repeat: 2,
              ease: 'Sine.easeInOut',
            });
          }
        });
      });
    }
  }

  createMatchCard(x, y, letter, size) {
    // Card background with depth
    const card = drawCard(this, x, y, size, size, {
      fillColor: 0xFFFFF5,
      radius: 20,
      shadowAlpha: 0.2,
      shadowOffsetY: 5,
      strokeColor: 0xCCCCCC,
      strokeWidth: 2,
      depth: 5,
    });

    // Letter text
    const letterText = createChunkyText(this, x, y, letter, {
      fontSize: '72px',
      color: '#4A3728',
      strokeColor: '#FFFFFF',
      strokeThickness: 4,
      depth: 10,
    });
    letterText.setData('isMatchLetter', true);

    // Hit area (entire card)
    const hitArea = this.add.rectangle(x, y, size, size)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001)
      .setDepth(15);

    hitArea.on('pointerdown', () => {
      if (hitArea.getData('disabled')) return;

      if (letter === this.letter || letter === this.letterConfig.lower) {
        hitArea.setData('disabled', true);
        this.onCorrectMatch(card, letterText, x, y, size);
      } else {
        hitArea.setData('disabled', true);
        this.onWrongMatch(card, letterText, x, y, size, hitArea);
      }
    });
  }

  generateOptions() {
    const similarLetters = {
      A: ['H', 'V', 'M', 'N', 'W'],
      B: ['D', 'P', 'R', 'E', 'G'],
      C: ['G', 'O', 'Q', 'U', 'S'],
      D: ['B', 'P', 'O', 'Q', 'G'],
      E: ['F', 'B', 'L', 'T', 'H'],
      F: ['E', 'T', 'P', 'L', 'I'],
    };
    const pool = similarLetters[this.letter] || 'GHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffledPool = Phaser.Utils.Array.Shuffle([...pool]);
    const numDistractors = this.difficulty === 'guided' ? 3 : 4;
    const distractors = shuffledPool.slice(0, numDistractors);
    return [this.letter, this.letterConfig.lower, ...distractors];
  }

  onCorrectMatch(card, letterText, x, y, size) {
    this.score += 20;
    audioManager.playFeedback('correct');

    // Green glow
    const glow = this.add.graphics().setDepth(4);
    glow.fillStyle(0x2D9B4E, 0.3);
    glow.fillRoundedRect(x - size / 2 - 6, y - size / 2 - 6, size + 12, size + 12, 24);

    letterText.setColor('#2D9B4E');

    // Bounce + sparkle
    this.tweens.add({
      targets: letterText,
      scale: 1.4,
      duration: 200,
      yoyo: true,
    });

    createBurstEffect(this, x, y, {
      count: 10,
      emojis: ['⭐', '✨', '🎉'],
      spread: 100,
      duration: 1000,
    });

    screenFlash(this, this.sceneWidth, this.sceneHeight, 0x2D9B4E, 300);

    // Success message
    const msg = createChunkyText(this, this.centerX, this.sceneHeight - 120, '🎉 Correct!', {
      fontSize: '36px',
      color: '#2D9B4E',
      strokeColor: '#FFFFFF',
      strokeThickness: 5,
      depth: 30,
    });
    msg.setScale(0);
    this.tweens.add({
      targets: msg,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1500, () => this.showResults());
  }

  onWrongMatch(card, letterText, x, y, size, hitArea) {
    this.mistakes += 1;
    this.matchAttempts += 1;
    audioManager.playFeedback('wrong');

    // Red flash on card
    const redFlash = this.add.graphics().setDepth(4);
    redFlash.fillStyle(0xD94B2B, 0.2);
    redFlash.fillRoundedRect(x - size / 2, y - size / 2, size, size, 20);

    this.tweens.add({
      targets: redFlash,
      alpha: 0,
      duration: 500,
      onComplete: () => redFlash.destroy(),
    });

    // Shake
    this.tweens.add({
      targets: letterText,
      x: letterText.x + 12,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        letterText.setAlpha(0.3);
      },
    });

    // Encouraging message
    if (this.diffConfig.audioPrompts) {
      const msgs = ['Try again!', 'Almost!', 'Keep looking!', 'You can do it!'];
      const msg = msgs[this.matchAttempts % msgs.length];

      const hint = createChunkyText(this, this.centerX, this.sceneHeight - 120, msg, {
        fontSize: '22px',
        color: '#E8A317',
        strokeColor: '#FFFFFF',
        strokeThickness: 3,
        depth: 30,
      });

      this.tweens.add({
        targets: hint,
        alpha: 0,
        duration: 800,
        delay: 1000,
        onComplete: () => hint.destroy(),
      });
    }

    // Max attempts check
    if (this.diffConfig.maxAttempts !== Infinity && this.matchAttempts >= this.diffConfig.maxAttempts) {
      this.time.delayedCall(500, () => this.showResults());
    }
  }

  // ==================== PHASE 4: RESULTS ====================
  showResults() {
    this.phase = 'results';
    this.children.removeAll(true);

    // Celebration gradient
    createThemedBackground(this, 'celebration');

    const { width, height } = DEVICE_CONFIG;

    // Calculate stars
    let stars = 1;
    if (this.mistakes === 0) stars = 3;
    else if (this.mistakes <= 2) stars = 2;

    // Save progress
    gameStore.getState().completeLevel(this.letter, this.difficulty, this.score, stars);
    gameStore.getState().collectUbuntuValue(this.letterConfig.ubuntuValue.english);

    // === "WELL DONE!" HEADER ===
    const header = createChunkyText(this, this.centerX, 100, 'Well Done!', {
      fontSize: '52px',
      color: '#FFD700',
      strokeColor: '#4A3728',
      strokeThickness: 6,
      shadowOffsetY: 4,
      depth: 20,
    });
    header.setScale(0);
    this.tweens.add({
      targets: header,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // === STAR DISPLAY ===
    const starDisplay = new StarDisplay(this, this.centerX, 200);
    this.time.delayedCall(500, () => {
      starDisplay.award(stars);
      audioManager.playFeedback('complete');
      for (let i = 0; i < stars; i++) {
        this.time.delayedCall(i * 400, () => audioManager.playFeedback('star'));
      }
    });

    // Score
    createChunkyText(this, this.centerX, 270, `Score: ${this.score}`, {
      fontSize: '26px',
      color: '#4A3728',
      strokeColor: '#FFFFFF',
      strokeThickness: 3,
      depth: 20,
    });

    // === UBUNTU VALUE CARD ===
    const ubuntuCard = drawCard(this, this.centerX, 420, 560, 200, {
      fillColor: 0x2D9B4E,
      fillAlpha: 0.15,
      radius: 24,
      shadowAlpha: 0.1,
      shadowOffsetY: 4,
      strokeColor: 0x2D9B4E,
      strokeWidth: 2,
      depth: 10,
    });

    createChunkyText(this, this.centerX, 350, '🌍 Ubuntu Value Earned!', {
      fontSize: '18px',
      color: '#2D9B4E',
      strokeColor: '#FFFFFF',
      strokeThickness: 2,
      depth: 15,
    });

    createChunkyText(this, this.centerX, 400, this.letterConfig.ubuntuValue.english, {
      fontSize: '36px',
      color: '#2D9B4E',
      strokeColor: '#FFFFFF',
      strokeThickness: 4,
      depth: 15,
    });

    this.add.text(this.centerX, 445, `"${this.letterConfig.ubuntuValue.description}"`, {
      fontFamily: 'Nunito, Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'italic',
      color: COLORS.textDark,
      wordWrap: { width: 480 },
      align: 'center',
    }).setOrigin(0.5).setDepth(15);

    createChunkyText(this, this.centerX, 490, `Zulu: ${this.letterConfig.ubuntuValue.zulu}`, {
      fontSize: '15px',
      color: '#8B7355',
      strokeColor: '#FFFFFF',
      strokeThickness: 2,
      depth: 15,
    });

    // === CELEBRATION ===
    this.createCelebration();

    // === ACTION BUTTONS ===
    const btnY = 620;

    createGameButton(this, this.centerX - 130, btnY, 'Replay', {
      width: 200,
      height: 64,
      preset: 'secondary',
      fontSize: 22,
      icon: '🔄',
      depth: 20,
      onClick: () => {
        this.scene.start('LetterGame', {
          letter: this.letter,
          difficulty: this.difficulty,
        });
      },
    });

    // Next letter button
    const nextIndex = LETTER_ORDER.indexOf(this.letter) + 1;
    if (nextIndex < LETTER_ORDER.length) {
      const nextLetter = LETTER_ORDER[nextIndex];
      createGameButton(this, this.centerX + 130, btnY, `Next: ${nextLetter}`, {
        width: 200,
        height: 64,
        preset: 'success',
        fontSize: 22,
        icon: '→',
        depth: 20,
        onClick: () => this.scene.start('DifficultySelect', { letter: nextLetter }),
      });
    }

    // Menu button
    createGameButton(this, this.centerX, btnY + 80, 'Back to Menu', {
      width: 250,
      height: 56,
      preset: 'small',
      fontSize: 20,
      depth: 20,
      onClick: () => this.scene.start('Menu'),
    });
  }

  createCelebration() {
    // Confetti burst (real colored shapes)
    createConfetti(this, this.centerX, 100, {
      count: 35,
      spread: 400,
      duration: 3000,
    });

    // Emoji burst overlay
    this.time.delayedCall(200, () => {
      createBurstEffect(this, this.centerX, 200, {
        count: 12,
        emojis: ['⭐', '🌟', '✨', '🎉'],
        spread: 300,
        duration: 2500,
      });
    });

    screenFlash(this, 0xFACC15, 400);
  }

  // ==================== UTILITY ====================
  getAnimalEmoji() {
    const map = {
      A: '🐜', B: '🐒', C: '🐊', D: '🦌', E: '🐘', F: '🦩',
    };
    return map[this.letter] || '🐾';
  }
}
