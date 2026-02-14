import Phaser from 'phaser';
import { SIZES } from '../../config/theme.js';
import { drawStar, createConfetti } from './UIHelpers.js';

/**
 * Star Display — Real star polygon shapes with glow, bounce, and particles
 */
export class StarDisplay {
  constructor(scene, x, y, maxStars = 3) {
    this.scene = scene;
    this.maxStars = maxStars;
    this.stars = [];
    this.earnedStars = 0;

    const starSize = SIZES.starSize;
    const spacing = starSize + 24;
    const startX = x - ((maxStars - 1) * spacing) / 2;

    for (let i = 0; i < maxStars; i++) {
      const sx = startX + i * spacing;

      // Unearned star (grey)
      const star = drawStar(scene, sx, y, starSize, {
        fillColor: 0xE5E7EB,
        strokeColor: 0x9CA3AF,
        strokeWidth: 2,
        glow: false,
        depth: 19,
      });
      star.setScale(0);

      this.stars.push({ container: star, x: sx, y });

      // Pop in
      scene.tweens.add({
        targets: star,
        scale: 1,
        duration: 300,
        delay: i * 120,
        ease: 'Back.easeOut',
      });
    }
  }

  award(count) {
    this.earnedStars = Math.min(count, this.maxStars);

    for (let i = 0; i < this.earnedStars; i++) {
      this.scene.time.delayedCall(i * 500, () => {
        const { container, x, y } = this.stars[i];

        // Remove old grey star
        container.removeAll(true);

        // Add golden star with glow
        const golden = drawStar(this.scene, x, y, SIZES.starSize, {
          fillColor: 0xFACC15,
          strokeColor: 0xCA8A04,
          strokeWidth: 3,
          glow: true,
          glowColor: 0xFACC15,
          glowAlpha: 0.35,
          depth: 19,
        });

        // Bounce in
        golden.setScale(0);
        this.scene.tweens.add({
          targets: golden,
          scale: 1.4,
          duration: 250,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.scene.tweens.add({
              targets: golden,
              scale: 1,
              duration: 150,
            });
          },
        });

        // Mini confetti
        createConfetti(this.scene, x, y, {
          count: 8,
          spread: 60,
          duration: 800,
          colors: [0xFACC15, 0xFFD700, 0xFB923C],
        });
      });
    }
  }

  destroy() {
    this.stars.forEach((s) => s.container.destroy(true));
  }
}
