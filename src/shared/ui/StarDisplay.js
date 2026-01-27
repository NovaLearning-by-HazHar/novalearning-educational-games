import Phaser from 'phaser';
import { COLORS, SIZES } from '../../config/theme.js';

/**
 * Star Display — Shows 1-3 stars for level completion
 * Animates in sequence for celebration feel
 */
export class StarDisplay {
  constructor(scene, x, y, maxStars = 3) {
    this.scene = scene;
    this.maxStars = maxStars;
    this.stars = [];
    this.earnedStars = 0;

    const spacing = SIZES.starSize + 16;
    const startX = x - ((maxStars - 1) * spacing) / 2;

    for (let i = 0; i < maxStars; i++) {
      const star = scene.add
        .text(startX + i * spacing, y, '★', {
          fontFamily: 'Arial, sans-serif',
          fontSize: `${SIZES.starSize}px`,
          color: '#D4D4D4', // Grey = unearned
        })
        .setOrigin(0.5);
      
      star.setScale(0);
      this.stars.push(star);
    }

    // Pop in empty stars
    this.stars.forEach((star, i) => {
      scene.tweens.add({
        targets: star,
        scale: 1,
        duration: 300,
        delay: i * 100,
        ease: 'Back.easeOut',
      });
    });
  }

  /**
   * Animate earning stars (call after level complete)
   */
  award(count) {
    this.earnedStars = Math.min(count, this.maxStars);

    for (let i = 0; i < this.earnedStars; i++) {
      this.scene.time.delayedCall(i * 400, () => {
        const star = this.stars[i];
        star.setColor(COLORS.star);
        
        // Bounce + grow animation
        this.scene.tweens.add({
          targets: star,
          scale: 1.5,
          duration: 200,
          yoyo: true,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            this.scene.tweens.add({
              targets: star,
              scale: 1,
              duration: 150,
            });
          },
        });
      });
    }
  }

  destroy() {
    this.stars.forEach((s) => s.destroy());
  }
}
