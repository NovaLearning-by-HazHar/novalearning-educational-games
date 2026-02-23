import Phaser from 'phaser';
import { COLORS, SIZES } from '../../config/theme.js';

/**
 * Reusable UI Button — rounded rectangle with text
 * Supports hover, press, and disabled states
 * Designed for touch-first (Grade R kids with big fingers)
 */
export class Button {
  constructor(scene, x, y, text, options = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    const width = options.width || SIZES.buttonWidth;
    const height = options.height || SIZES.buttonHeight;
    const bgColor = options.bgColor || COLORS.primary;
    const textColor = options.textColor || COLORS.textLight;
    const fontSize = options.fontSize || '28px';
    const radius = options.radius || SIZES.buttonRadius;

    // Background rounded rect
    this.bg = scene.add.graphics();
    this.drawBg(bgColor, width, height, radius);

    // Hit area (invisible rectangle for touch)
    this.hitArea = scene.add
      .rectangle(x, y, width, height)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001); // Invisible but interactive

    // Text
    this.label = scene.add
      .text(x, y, text, {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize,
        fontStyle: 'bold',
        color: textColor,
      })
      .setOrigin(0.5);

    // Container for easy manipulation
    this.container = scene.add.container(0, 0, [this.bg, this.hitArea, this.label]);

    // Interaction states
    this.hitArea.on('pointerover', () => this.onHover());
    this.hitArea.on('pointerout', () => this.onOut());
    this.hitArea.on('pointerdown', () => this.onPress());
    this.hitArea.on('pointerup', () => {
      this.onRelease();
      if (options.onClick) options.onClick();
    });

    this._bgColor = bgColor;
    this._width = width;
    this._height = height;
    this._radius = radius;
    this._disabled = false;
  }

  drawBg(color, width, height, radius) {
    this.bg.clear();
    this.bg.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
    this.bg.fillRoundedRect(
      this.x - width / 2,
      this.y - height / 2,
      width,
      height,
      radius
    );
  }

  onHover() {
    if (this._disabled) return;
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100,
    });
  }

  onOut() {
    if (this._disabled) return;
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
    });
  }

  onPress() {
    if (this._disabled) return;
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 50,
    });
  }

  onRelease() {
    if (this._disabled) return;
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
    });
  }

  setDisabled(disabled) {
    this._disabled = disabled;
    if (disabled) {
      this.hitArea.disableInteractive();
    } else {
      this.hitArea.setInteractive({ useHandCursor: true });
    }
    this.container.setAlpha(disabled ? 0.5 : 1);
  }

  setText(text) {
    this.label.setText(text);
  }

  destroy() {
    this.container.destroy(true);
  }
}
