import Phaser from 'phaser';
import { COLORS, SIZES, ANIMATIONS } from '../../../config/theme.js';
import { DEVICE_CONFIG } from '../../../config/device.js';
import { getLetterConfig, LETTER_ORDER } from '../../../config/letters.js';
import { getDifficulty } from '../../../config/difficulty.js';
import { gameStore } from '../../../state/gameStore.js';
import { audioManager } from '../../../state/audioManager.js';
import { StarDisplay } from '../../../shared/ui/StarDisplay.js';

/**
 * Letter Game Scene — Core gameplay
 * 
 * Flow:
 * 1. Letter Introduction — Show the letter big + animal + audio
 * 2. Letter Tracing — Trace the letter shape (simplified for MVP)
 * 3. Letter Matching — Find the correct letter among options
 * 4. Results — Stars, Ubuntu value reveal, celebration
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
    this.phase = 'intro'; // intro → trace → match → results
  }

  create() {
    const { width, height } = DEVICE_CONFIG;
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.cameras.main.setBackgroundColor(COLORS.bgWarm);

    // Back button with padded hit area (64px min for kids)
    this.backBtn = this.add
      .text(30, 40, '← Back', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.primary,
        padding: { x: 16, y: 12 },
      })
      .setInteractive({ useHandCursor: true, hitArea: new Phaser.Geom.Rectangle(-10, -10, 140, 64), hitAreaCallback: Phaser.Geom.Rectangle.Contains })
      .on('pointerdown', () => this.scene.start('DifficultySelect', { letter: this.letter }));

    // Start with intro phase
    this.showIntro();
  }

  // ==================== PHASE 1: INTRODUCTION ====================
  showIntro() {
    this.phase = 'intro';
    this.clearPhase();

    const { width } = DEVICE_CONFIG;

    // Big letter with entrance animation
    this.bigLetter = this.add
      .text(this.centerX, 250, this.letter, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '200px',
        fontStyle: 'bold',
        color: this.letterConfig.animal.color,
      })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: this.bigLetter,
      scale: 1,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Play letter pronunciation when it lands
        audioManager.playLetterSound(this.letter);
      },
    });

    // Lowercase
    this.smallLetter = this.add
      .text(this.centerX + 100, 330, this.letterConfig.lower, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '80px',
        color: this.letterConfig.animal.color,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.smallLetter,
      alpha: 0.7,
      duration: 400,
      delay: 400,
    });

    // Animal name
    this.animalText = this.add
      .text(this.centerX, 480, `${this.letter} is for ${this.letterConfig.animal.name}`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '32px',
        fontStyle: 'bold',
        color: COLORS.textDark,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.animalText,
      alpha: 1,
      duration: 400,
      delay: 700,
    });

    // Animal Zulu name
    this.zuluText = this.add
      .text(this.centerX, 520, this.letterConfig.animal.zuluName, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'italic',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.zuluText,
      alpha: 1,
      duration: 400,
      delay: 900,
    });

    // Phonics hint (guided mode)
    if (this.diffConfig.showHints) {
      this.phonicsHint = this.add
        .text(this.centerX, 580, `🔊 "${this.letterConfig.phonics.sound}"`, {
          fontFamily: 'Nunito, Arial, sans-serif',
          fontSize: '20px',
          color: COLORS.primary,
        })
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: this.phonicsHint,
        alpha: 1,
        duration: 400,
        delay: 1100,
      });
    }

    // Animal placeholder (colored circle until real sprites)
    this.animalPlaceholder = this.add.graphics();
    this.animalPlaceholder.fillStyle(
      Phaser.Display.Color.HexStringToColor(this.letterConfig.animal.color).color,
      0.3
    );
    this.animalPlaceholder.fillCircle(this.centerX, 750, 100);
    
    this.animalEmoji = this.add
      .text(this.centerX, 750, this.getAnimalEmoji(), {
        fontSize: '80px',
      })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: this.animalEmoji,
      scale: 1,
      duration: 500,
      delay: 600,
      ease: 'Back.easeOut',
    });

    // "Tap to continue" prompt
    this.continueText = this.add
      .text(this.centerX, 950, 'Tap to continue →', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.primary,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.continueText,
      alpha: 1,
      duration: 400,
      delay: 1500,
    });

    // Pulse animation on continue text
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: this.continueText,
        alpha: 0.4,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    });

    // Tap zone covering the content area (below back button) to proceed
    // Using a zone instead of global input.once to avoid capturing back button taps
    this.time.delayedCall(1500, () => {
      const { width, height } = DEVICE_CONFIG;
      const tapZone = this.add
        .rectangle(width / 2, height / 2 + 40, width, height - 80)
        .setInteractive({ useHandCursor: true })
        .setAlpha(0.001);

      tapZone.once('pointerdown', () => {
        tapZone.destroy();
        this.time.delayedCall(200, () => this.showTracing());
      });
    });
  }

  // ==================== PHASE 2: TRACING ====================
  showTracing() {
    this.phase = 'trace';
    this.clearPhase();

    const { width } = DEVICE_CONFIG;

    // Phase label
    this.phaseLabel = this.add
      .text(this.centerX, 100, 'Trace the letter!', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // Ghost letter (large, faded — trace target)
    this.ghostLetter = this.add
      .text(this.centerX, 450, this.letter, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '300px',
        fontStyle: 'bold',
        color: this.letterConfig.animal.color,
      })
      .setOrigin(0.5)
      .setAlpha(0.15);

    // Drawing surface — use a hit zone so tracing doesn't conflict with back/skip buttons
    this.traceGraphics = this.add.graphics();
    this.traceGraphics.lineStyle(12, Phaser.Display.Color.HexStringToColor(this.letterConfig.animal.color).color, 1);

    this.isDrawing = false;
    this.tracePoints = [];

    // Invisible drawing zone (centered, below header, above hints)
    const drawZone = this.add
      .rectangle(DEVICE_CONFIG.width / 2, 450, DEVICE_CONFIG.width - 40, 500)
      .setInteractive()
      .setAlpha(0.001);

    // Track touch/mouse input for drawing within the zone
    this._onTraceDown = (pointer) => {
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
      // Validate: enough points AND roughly covered the ghost letter area
      if (this.tracePoints.length > 15 && this.validateTrace()) {
        this.onTraceComplete();
      } else if (this.tracePoints.length > 5) {
        // Some effort but not enough — encourage
        this.showTraceHint('Keep going! Trace the whole letter.');
      }
    };

    this.input.on('pointerdown', this._onTraceDown);
    this.input.on('pointermove', this._onTraceMove);
    this.input.on('pointerup', this._onTraceUp);

    // Hint: show trace path in guided mode
    if (this.diffConfig.showHints) {
      this.hintText = this.add
        .text(this.centerX, 650, '👆 Use your finger to trace over the letter', {
          fontFamily: 'Nunito, Arial, sans-serif',
          fontSize: '18px',
          color: COLORS.textMuted,
          align: 'center',
        })
        .setOrigin(0.5);
    }

    // Skip button (for testing/accessibility)
    this.add
      .text(width - 30, 40, 'Skip →', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '18px',
        color: COLORS.textMuted,
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.onTraceComplete());
  }

  /**
   * Validate trace quality — did the child draw in roughly the right area?
   * Not checking letter accuracy (too hard for MVP), just coverage.
   */
  validateTrace() {
    if (this.tracePoints.length < 15) return false;

    // Ghost letter is centered at (this.centerX, 450), ~300px font = ~240px actual
    // Check: did the trace points overlap the letter's bounding area?
    const letterBounds = {
      minX: this.centerX - 120,
      maxX: this.centerX + 120,
      minY: 450 - 140,
      maxY: 450 + 140,
    };

    const pointsInBounds = this.tracePoints.filter(
      (p) =>
        p.x >= letterBounds.minX &&
        p.x <= letterBounds.maxX &&
        p.y >= letterBounds.minY &&
        p.y <= letterBounds.maxY
    );

    // At least 40% of points should be in the letter area
    return pointsInBounds.length / this.tracePoints.length >= 0.4;
  }

  /**
   * Show encouraging hint when trace attempt wasn't quite right
   */
  showTraceHint(message) {
    // Remove existing hint if any
    if (this._traceHintText) this._traceHintText.destroy();

    this._traceHintText = this.add
      .text(this.centerX, 750, message, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '20px',
        color: COLORS.secondary,
        align: 'center',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this._traceHintText,
      alpha: 0,
      duration: 800,
      delay: 2000,
      onComplete: () => {
        if (this._traceHintText) this._traceHintText.destroy();
        this._traceHintText = null;
      },
    });
  }

  onTraceComplete() {
    // Celebrate the trace
    this.score += 10;
    audioManager.playFeedback('correct');
    
    // Remove only tracing input listeners (not all listeners)
    this.input.off('pointerdown', this._onTraceDown);
    this.input.off('pointermove', this._onTraceMove);
    this.input.off('pointerup', this._onTraceUp);

    // Show success feedback
    const feedback = this.add
      .text(this.centerX, 800, '✓ Great tracing!', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        color: COLORS.success,
      })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: feedback,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1200, () => this.showMatching());
  }

  // ==================== PHASE 3: MATCHING ====================
  showMatching() {
    this.phase = 'match';
    this.clearPhase();

    const { width } = DEVICE_CONFIG;

    // Phase label
    this.add
      .text(this.centerX, 100, `Find the letter ${this.letter}!`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // Generate options (correct + distractors)
    const options = this.generateOptions();
    const shuffled = Phaser.Utils.Array.Shuffle([...options]);

    // Show as grid of big tappable letters
    // Adaptive grid: 3 columns, rows depend on option count
    const cols = 3;
    const cardSize = 160; // 160px well above 64px minimum for kids
    const gap = 30;
    const startX = this.centerX - ((cols - 1) * (cardSize + gap)) / 2;
    const rows = Math.ceil(shuffled.length / cols);
    const totalGridHeight = rows * (cardSize + gap) - gap;
    const startY = 350 + (DEVICE_CONFIG.height - 350 - 200 - totalGridHeight) / 2; // Center vertically in available space

    this.matchAttempts = 0;

    shuffled.forEach((opt, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardSize + gap);
      const y = startY + row * (cardSize + gap);

      // Card background
      const card = this.add.graphics();
      card.fillStyle(0xffffff, 1);
      card.fillRoundedRect(x - cardSize / 2, y - cardSize / 2, cardSize, cardSize, 16);
      card.lineStyle(3, Phaser.Display.Color.HexStringToColor(COLORS.textMuted).color, 0.3);
      card.strokeRoundedRect(x - cardSize / 2, y - cardSize / 2, cardSize, cardSize, 16);

      // Letter text
      const letterText = this.add
        .text(x, y, opt, {
          fontFamily: 'Nunito, Arial, sans-serif',
          fontSize: '80px',
          fontStyle: 'bold',
          color: COLORS.textDark,
        })
        .setOrigin(0.5);

      // Hit area
      const hitArea = this.add
        .rectangle(x, y, cardSize, cardSize)
        .setInteractive({ useHandCursor: true })
        .setAlpha(0.001);

      hitArea.on('pointerdown', () => {
        if (opt === this.letter || opt === this.letterConfig.lower) {
          this.onCorrectMatch(card, letterText, x, y, cardSize);
        } else {
          this.onWrongMatch(card, letterText, x, y, cardSize);
        }
      });
    });

    // Hint for guided mode — subtle glow on correct answers after 5 seconds
    if (this.diffConfig.showHints) {
      this._hintTimer = this.time.delayedCall(5000, () => {
        // Find all correct option cards and pulse them
        this.children.each((child) => {
          if (child.type === 'Text' && child.style &&
              (child.text === this.letter || child.text === this.letterConfig.lower)) {
            this.tweens.add({
              targets: child,
              scale: 1.15,
              duration: 600,
              yoyo: true,
              repeat: 2,
              ease: 'Sine.easeInOut',
            });
          }
        });
      });
    }
  }

  generateOptions() {
    // Visually similar letters for meaningful distractors (Grade R appropriate)
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
    
    // Pick distractors based on difficulty
    let numDistractors;
    if (this.difficulty === 'guided') {
      numDistractors = 3; // 5 total (2 correct + 3 wrong) — easier
    } else if (this.difficulty === 'assisted') {
      numDistractors = 4; // 6 total
    } else {
      numDistractors = 4; // 6 total, but visually harder
    }

    const distractors = shuffledPool.slice(0, numDistractors);

    // Include both upper and lower case of the correct letter
    return [this.letter, this.letterConfig.lower, ...distractors];
  }

  onCorrectMatch(card, letterText, x, y, cardSize) {
    this.score += 20;
    audioManager.playFeedback('correct');
    
    // Green highlight
    card.clear();
    card.fillStyle(Phaser.Display.Color.HexStringToColor(COLORS.success).color, 0.2);
    card.fillRoundedRect(x - cardSize / 2, y - cardSize / 2, cardSize, cardSize, 16);
    card.lineStyle(4, Phaser.Display.Color.HexStringToColor(COLORS.success).color);
    card.strokeRoundedRect(x - cardSize / 2, y - cardSize / 2, cardSize, cardSize, 16);

    letterText.setColor(COLORS.success);

    // Bounce
    this.tweens.add({
      targets: letterText,
      scale: 1.3,
      duration: 200,
      yoyo: true,
    });

    // Success text
    const successMsg = this.add
      .text(this.centerX, 800, '🎉 Correct!', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
        color: COLORS.success,
      })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: successMsg,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1500, () => this.showResults());
  }

  onWrongMatch(card, letterText, x, y, cardSize) {
    this.mistakes += 1;
    this.matchAttempts += 1;
    audioManager.playFeedback('wrong');

    // Red shake + disable this card so it can't be tapped again
    card.clear();
    card.fillStyle(Phaser.Display.Color.HexStringToColor(COLORS.error).color, 0.1);
    card.fillRoundedRect(x - cardSize / 2, y - cardSize / 2, cardSize, cardSize, 16);

    letterText.setAlpha(0.3); // Fade wrong answer

    this.tweens.add({
      targets: letterText,
      x: letterText.x + 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
    });

    // Encouraging message
    if (this.diffConfig.audioPrompts) {
      const msgs = ['Try again!', 'Almost!', 'Keep looking!', 'You can do it!'];
      const msg = msgs[this.matchAttempts % msgs.length];
      
      const hint = this.add
        .text(this.centerX, 800, msg, {
          fontFamily: 'Nunito, Arial, sans-serif',
          fontSize: '24px',
          color: COLORS.secondary,
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: hint,
        alpha: 0,
        duration: 1000,
        delay: 800,
        onComplete: () => hint.destroy(),
      });
    }

    // After max attempts in non-guided, auto-complete
    if (this.diffConfig.maxAttempts !== Infinity && this.matchAttempts >= this.diffConfig.maxAttempts) {
      this.time.delayedCall(500, () => this.showResults());
    }
  }

  // ==================== PHASE 4: RESULTS ====================
  showResults() {
    this.phase = 'results';
    this.clearPhase();

    const { width, height } = DEVICE_CONFIG;

    // Calculate stars
    let stars = 1; // Completed = 1 star minimum
    if (this.mistakes === 0) stars = 3;
    else if (this.mistakes <= 2) stars = 2;

    // Save progress
    gameStore.getState().completeLevel(this.letter, this.difficulty, this.score, stars);
    gameStore.getState().collectUbuntuValue(this.letterConfig.ubuntuValue.english);

    // "Well done!" header
    this.add
      .text(this.centerX, 120, 'Well Done!', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: COLORS.primary,
      })
      .setOrigin(0.5);

    // Star display with audio
    const starDisplay = new StarDisplay(this, this.centerX, 220);
    this.time.delayedCall(500, () => {
      starDisplay.award(stars);
      audioManager.playFeedback('complete');
      // Play star sounds staggered
      for (let i = 0; i < stars; i++) {
        this.time.delayedCall(i * 400, () => audioManager.playFeedback('star'));
      }
    });

    // Score
    this.add
      .text(this.centerX, 300, `Score: ${this.score}`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '28px',
        color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // Ubuntu value reveal
    const ubuntuCard = this.add.graphics();
    ubuntuCard.fillStyle(Phaser.Display.Color.HexStringToColor(COLORS.primary).color, 0.1);
    ubuntuCard.fillRoundedRect(this.centerX - 280, 370, 560, 200, 20);

    this.add
      .text(this.centerX, 400, '🌍 Ubuntu Value Earned', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '18px',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    this.add
      .text(this.centerX, 440, this.letterConfig.ubuntuValue.english, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
        color: COLORS.primary,
      })
      .setOrigin(0.5);

    this.add
      .text(this.centerX, 480, `"${this.letterConfig.ubuntuValue.description}"`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'italic',
        color: COLORS.textDark,
        wordWrap: { width: 500 },
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(this.centerX, 530, `Zulu: ${this.letterConfig.ubuntuValue.zulu}`, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '16px',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    // Celebration particles
    this.createCelebration();

    // Buttons
    const btnY = 700;

    // Replay button
    this.add
      .text(this.centerX - 120, btnY, '🔄 Replay', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
        color: COLORS.secondary,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('LetterGame', {
          letter: this.letter,
          difficulty: this.difficulty,
        });
      });

    // Next letter button
    const nextLetterIndex = LETTER_ORDER.indexOf(this.letter) + 1;
    if (nextLetterIndex < LETTER_ORDER.length) {
      const nextLetter = LETTER_ORDER[nextLetterIndex];
      this.add
        .text(this.centerX + 120, btnY, `Next: ${nextLetter} →`, {
          fontFamily: 'Nunito, Arial, sans-serif',
          fontSize: '24px',
          fontStyle: 'bold',
          color: COLORS.primary,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.scene.start('DifficultySelect', { letter: nextLetter });
        });
    }

    // Menu button
    this.add
      .text(this.centerX, btnY + 60, 'Back to Menu', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '20px',
        color: COLORS.textMuted,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Menu'));
  }

  createCelebration() {
    // Simple particle-like celebration with text emojis
    const emojis = ['⭐', '🌟', '✨', '🎉', '🌈'];
    
    for (let i = 0; i < 15; i++) {
      const emoji = Phaser.Utils.Array.GetRandom(emojis);
      const x = Phaser.Math.Between(50, DEVICE_CONFIG.width - 50);
      const startY = -50;

      const particle = this.add
        .text(x, startY, emoji, { fontSize: '32px' })
        .setOrigin(0.5);

      this.tweens.add({
        targets: particle,
        y: Phaser.Math.Between(100, DEVICE_CONFIG.height - 200),
        x: x + Phaser.Math.Between(-100, 100),
        angle: Phaser.Math.Between(-180, 180),
        alpha: 0,
        duration: Phaser.Math.Between(1500, 3000),
        delay: i * 100,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // ==================== UTILITIES ====================

  clearPhase() {
    // Remove all children except the back button
    this.children.removeAll(true);
    
    // Re-add back button with padded hit area
    this.backBtn = this.add
      .text(30, 40, '← Back', {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: '22px',
        color: COLORS.primary,
        padding: { x: 16, y: 12 },
      })
      .setInteractive({ useHandCursor: true, hitArea: new Phaser.Geom.Rectangle(-10, -10, 140, 64), hitAreaCallback: Phaser.Geom.Rectangle.Contains })
      .on('pointerdown', () => this.scene.start('DifficultySelect', { letter: this.letter }));
  }

  getAnimalEmoji() {
    const map = {
      A: '🐜', // Aardvark (closest emoji)
      B: '🐃', // Buffalo
      C: '🦎', // Chameleon
      D: '🪰', // Dragonfly (closest)
      E: '🐘', // Elephant
      F: '🦩', // Flamingo
    };
    return map[this.letter] || '🐾';
  }
}
