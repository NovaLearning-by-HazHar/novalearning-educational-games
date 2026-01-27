import Phaser from 'phaser';
import { COLORS, SIZES } from '../../config/theme.js';
import { createBurstEffect } from './UIHelpers.js';

/**
 * Star Display — Shows 1-3 stars for level completion
 * Game-quality: chunky stars with glow, bounce, and particle effects
 */
export class StarDisplay {
  constructor(scene, x, y, maxStars = 3) {
    this.scene = scene;
    this.maxStars = maxStars;
    this.stars = [];
    this.earnedStars = 0;

    const starSize = SIZES.starSize;
    const spacing = starSize + 20;
    const startX = x - ((maxStars - 1) * spacing) / 2;

    for (let i = 0; i < maxStars; i++) {
      const sx = startX + i * spacing;

      // Shadow behind each star
      const shadow = scene.add.text(sx + 2, y + 3, '★', {
        fontSize: `${starSize}px`,
        color: '#000000',
      }).setOrigin(0.5).setAlpha(0.15).setDepth(18);

      // Star (grey = unearned)
      const star = scene.add.text(sx, y, '★', {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${starSize}px`,
        color: '#CCCCCC',
        stroke: '#999999',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(19);

      star.setScale(0);
      this.stars.push({ star, shadow, x: sx, y });

      // Pop in empty stars
      scene.tweens.add({
        targets: star,
        scale: 1,
        duration: 300,
        delay: i * 120,
        ease: 'Back.easeOut',
      });
    }
  }

  /**
   * Animate earning stars (call after level complete)
   */
  award(count) {
    this.earnedStars = Math.min(count, this.maxStars);

    for (let i = 0; i < this.earnedStars; i++) {
      this.scene.time.delayedCall(i * 500, () => {
        const { star, x, y } = this.stars[i];

        // Color it gold
        star.setColor('#FFD700');
        star.setStroke('#FF8C00', 3);

        // Glow ring
        const glow = this.scene.add.graphics().setDepth(17);
        glow.fillStyle(0xFFD700, 0.3);
        glow.fillCircle(x, y, SIZES.starSize * 0.6);

        // Bounce + scale
        this.scene.tweens.add({
          targets: star,
          scale: 1.6,
          duration: 250,
          yoyo: true,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            this.scene.tweens.add({
              targets: star,
              scale: 1.1,
              duration: 150,
            });
          },
        });

        // Mini burst on each star
        createBurstEffect(this.scene, x, y, {
          count: 6,
          emojis: ['✨', '💫'],
          spread: 60,
          duration: 800,
          minSize: 14,
          maxSize: 22,
        });
      });
    }
  }

  destroy() {
    this.stars.forEach((s) => {
      s.star.destroy();
      s.shadow.destroy();
    });
  }
}
