import Phaser from 'phaser';

/**
 * UI Helper functions for rich, game-quality visuals
 * Inspired by Orboot AR / PlayShifu style — vibrant, 3D depth, child-friendly
 */

/**
 * Draw a gradient-filled rounded rectangle (game-style button/card)
 * Phaser Graphics doesn't support gradients natively, so we layer
 */
export function drawCard(scene, x, y, width, height, options = {}) {
  const {
    radius = 20,
    fillColor = 0xffffff,
    fillAlpha = 1,
    strokeColor = null,
    strokeWidth = 0,
    shadowColor = 0x000000,
    shadowAlpha = 0.15,
    shadowOffsetY = 6,
    shadowBlur = 0, // Simulated with multiple layers
    glowColor = null,
    glowAlpha = 0.3,
    depth = 0,
  } = options;

  const container = scene.add.container(0, 0);
  container.setDepth(depth);

  // Shadow layer
  if (shadowAlpha > 0) {
    const shadow = scene.add.graphics();
    shadow.fillStyle(shadowColor, shadowAlpha);
    shadow.fillRoundedRect(
      x - width / 2 + 2,
      y - height / 2 + shadowOffsetY,
      width,
      height,
      radius
    );
    container.add(shadow);

    // Extra shadow spread for depth
    if (shadowBlur > 0) {
      const spread = scene.add.graphics();
      spread.fillStyle(shadowColor, shadowAlpha * 0.4);
      spread.fillRoundedRect(
        x - width / 2 + 1,
        y - height / 2 + shadowOffsetY + 3,
        width + 2,
        height + 2,
        radius + 2
      );
      container.add(spread);
    }
  }

  // Glow layer (for selected/active states)
  if (glowColor !== null) {
    const glow = scene.add.graphics();
    glow.fillStyle(glowColor, glowAlpha);
    glow.fillRoundedRect(
      x - width / 2 - 4,
      y - height / 2 - 4,
      width + 8,
      height + 8,
      radius + 4
    );
    container.add(glow);
  }

  // Main card body
  const body = scene.add.graphics();
  body.fillStyle(fillColor, fillAlpha);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);

  // Top highlight strip (simulates 3D lighting)
  const highlight = scene.add.graphics();
  highlight.fillStyle(0xffffff, 0.15);
  highlight.fillRoundedRect(
    x - width / 2 + 4,
    y - height / 2 + 2,
    width - 8,
    height * 0.35,
    { tl: radius - 2, tr: radius - 2, bl: 0, br: 0 }
  );

  container.add(body);
  container.add(highlight);

  // Border stroke
  if (strokeColor !== null && strokeWidth > 0) {
    const border = scene.add.graphics();
    border.lineStyle(strokeWidth, strokeColor, 1);
    border.strokeRoundedRect(
      x - width / 2,
      y - height / 2,
      width,
      height,
      radius
    );
    container.add(border);
  }

  return container;
}

/**
 * Create chunky outlined text (game-style lettering)
 * Multiple layers for stroke effect since Phaser text doesn't support thick outlines well
 */
export function createChunkyText(scene, x, y, text, options = {}) {
  const {
    fontSize = '48px',
    fontFamily = 'Nunito, Arial, sans-serif',
    color = '#FFFFFF',
    strokeColor = '#000000',
    strokeThickness = 6,
    shadowColor = '#00000044',
    shadowOffsetX = 2,
    shadowOffsetY = 4,
    align = 'center',
    depth = 10,
  } = options;

  const textObj = scene.add.text(x, y, text, {
    fontFamily,
    fontSize,
    fontStyle: 'bold',
    color,
    align,
    stroke: strokeColor,
    strokeThickness,
    shadow: {
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY,
      color: shadowColor,
      blur: 4,
      fill: true,
    },
  });

  textObj.setOrigin(0.5).setDepth(depth);
  return textObj;
}

/**
 * Draw a gradient background (top to bottom, two-color)
 * Uses a bitmap texture since Phaser Graphics doesn't do gradients
 */
export function createGradientBackground(scene, width, height, colorTop, colorBottom) {
  // Create a canvas texture for the gradient
  const key = `gradient-${colorTop}-${colorBottom}-${width}-${height}`;

  if (!scene.textures.exists(key)) {
    const canvas = scene.textures.createCanvas(key, width, height);
    const ctx = canvas.getContext();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    canvas.refresh();
  }

  const bg = scene.add.image(width / 2, height / 2, key);
  bg.setDepth(-100);
  return bg;
}

/**
 * Create floating decorative elements (clouds, stars, leaves)
 * Gives the background life — subtle ambient animation
 */
export function createFloatingDecor(scene, width, height, options = {}) {
  const {
    emojis = ['✨', '⭐', '🌿', '🍃'],
    count = 8,
    minSize = 16,
    maxSize = 28,
    speed = 0.3,
    depth = -50,
  } = options;

  const decorItems = [];

  for (let i = 0; i < count; i++) {
    const emoji = Phaser.Utils.Array.GetRandom(emojis);
    const x = Phaser.Math.Between(20, width - 20);
    const y = Phaser.Math.Between(50, height - 50);
    const size = Phaser.Math.Between(minSize, maxSize);

    const item = scene.add.text(x, y, emoji, { fontSize: `${size}px` })
      .setOrigin(0.5)
      .setAlpha(Phaser.Math.FloatBetween(0.15, 0.35))
      .setDepth(depth);

    // Gentle floating animation
    scene.tweens.add({
      targets: item,
      y: y + Phaser.Math.Between(-20, 20),
      x: x + Phaser.Math.Between(-15, 15),
      alpha: item.alpha + Phaser.Math.FloatBetween(-0.1, 0.1),
      duration: Phaser.Math.Between(3000, 6000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: i * 200,
    });

    decorItems.push(item);
  }

  return decorItems;
}

/**
 * Create a ribbon/banner header (game-style header)
 */
export function createBanner(scene, x, y, width, text, options = {}) {
  const {
    bgColor = 0x2D9B4E,
    textColor = '#FFFFFF',
    fontSize = '32px',
    height = 60,
    ribbonTails = true,
    depth = 20,
  } = options;

  const container = scene.add.container(0, 0);
  container.setDepth(depth);

  // Banner body
  const body = scene.add.graphics();
  body.fillStyle(bgColor, 1);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);

  // Darker bottom edge for 3D
  const edge = scene.add.graphics();
  edge.fillStyle(0x000000, 0.2);
  edge.fillRect(x - width / 2 + 6, y + height / 2 - 6, width - 12, 6);

  container.add(body);
  container.add(edge);

  // Ribbon tails
  if (ribbonTails) {
    const tail = scene.add.graphics();
    tail.fillStyle(bgColor, 0.7);
    // Left tail
    tail.fillTriangle(
      x - width / 2 - 15, y - height / 2 + 5,
      x - width / 2 + 5, y,
      x - width / 2 - 15, y + height / 2 - 5
    );
    // Right tail
    tail.fillTriangle(
      x + width / 2 + 15, y - height / 2 + 5,
      x + width / 2 - 5, y,
      x + width / 2 + 15, y + height / 2 - 5
    );
    container.add(tail);
  }

  // Text
  const label = createChunkyText(scene, x, y, text, {
    fontSize,
    color: textColor,
    strokeThickness: 3,
    shadowOffsetY: 2,
    depth: depth + 1,
  });

  container.add(label);
  return container;
}

/**
 * Create a 3D-style game button
 */
export function createGameButton(scene, x, y, text, options = {}) {
  const {
    width = 300,
    height = 80,
    bgColor = 0x2D9B4E,
    textColor = '#FFFFFF',
    fontSize = '28px',
    radius = 16,
    onClick = null,
    depth = 10,
    icon = '',
  } = options;

  const container = scene.add.container(0, 0);
  container.setDepth(depth);

  // Bottom shadow/edge (3D effect)
  const bottomEdge = scene.add.graphics();
  bottomEdge.fillStyle(0x000000, 0.25);
  bottomEdge.fillRoundedRect(x - width / 2, y - height / 2 + 6, width, height, radius);
  container.add(bottomEdge);

  // Main button body
  const body = scene.add.graphics();
  body.fillStyle(bgColor, 1);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  container.add(body);

  // Top shine
  const shine = scene.add.graphics();
  shine.fillStyle(0xffffff, 0.2);
  shine.fillRoundedRect(
    x - width / 2 + 4,
    y - height / 2 + 2,
    width - 8,
    height * 0.4,
    { tl: radius - 2, tr: radius - 2, bl: 0, br: 0 }
  );
  container.add(shine);

  // Button text
  const displayText = icon ? `${icon} ${text}` : text;
  const label = createChunkyText(scene, x, y, displayText, {
    fontSize,
    color: textColor,
    strokeThickness: 2,
    shadowOffsetY: 2,
    depth: depth + 1,
  });
  container.add(label);

  // Hit area
  const hitArea = scene.add.rectangle(x, y, width, height)
    .setInteractive({ useHandCursor: true })
    .setAlpha(0.001)
    .setDepth(depth + 2);

  // Press animation
  hitArea.on('pointerdown', () => {
    scene.tweens.add({
      targets: container,
      y: container.y + 4,
      duration: 60,
    });
  });

  hitArea.on('pointerup', () => {
    scene.tweens.add({
      targets: container,
      y: container.y - 4,
      duration: 60,
      onComplete: () => {
        if (onClick) onClick();
      },
    });
  });

  container.hitArea = hitArea;
  container.label = label;
  container.bodyGraphics = body;

  container.setEnabled = (enabled) => {
    if (enabled) {
      hitArea.setInteractive({ useHandCursor: true });
      container.setAlpha(1);
    } else {
      hitArea.disableInteractive();
      container.setAlpha(0.5);
    }
  };

  return container;
}

/**
 * Burst particle effect (for celebrations)
 */
export function createBurstEffect(scene, x, y, options = {}) {
  const {
    count = 20,
    emojis = ['⭐', '🌟', '✨', '🎉', '💫', '🌈'],
    spread = 300,
    duration = 2000,
    minSize = 20,
    maxSize = 40,
  } = options;

  for (let i = 0; i < count; i++) {
    const emoji = Phaser.Utils.Array.GetRandom(emojis);
    const size = Phaser.Math.Between(minSize, maxSize);
    const angle = (i / count) * Math.PI * 2;
    const distance = Phaser.Math.Between(spread * 0.3, spread);
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;

    const particle = scene.add.text(x, y, emoji, { fontSize: `${size}px` })
      .setOrigin(0.5)
      .setDepth(100)
      .setScale(0);

    scene.tweens.add({
      targets: particle,
      x: targetX,
      y: targetY,
      scale: { from: 0, to: 1 },
      angle: Phaser.Math.Between(-360, 360),
      alpha: { from: 1, to: 0 },
      duration: Phaser.Math.Between(duration * 0.7, duration),
      delay: i * 30,
      ease: 'Quad.easeOut',
      onComplete: () => particle.destroy(),
    });
  }
}

/**
 * Screen flash effect
 */
export function screenFlash(scene, width, height, color = 0xffffff, duration = 300) {
  const flash = scene.add.rectangle(width / 2, height / 2, width, height, color, 0.4)
    .setDepth(200);

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration,
    onComplete: () => flash.destroy(),
  });
}

/**
 * Create an animal display — uses real sprite if loaded, falls back to styled placeholder
 * @param {string} spriteKey - Optional sprite texture key (from letters.js animal.sprite)
 */
export function createAnimalPlaceholder(scene, x, y, letter, colorHex, size = 180, spriteKey = null) {
  const container = scene.add.container(0, 0);
  const color = Phaser.Display.Color.HexStringToColor(colorHex).color;

  // Check if real sprite is loaded
  const hasSprite = spriteKey && scene.textures.exists(spriteKey) &&
    scene.textures.get(spriteKey).key !== '__MISSING';

  if (hasSprite) {
    // === REAL SPRITE ===
    // Shadow underneath
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.12);
    shadow.fillEllipse(x, y + size * 0.42, size * 0.7, size * 0.15);
    container.add(shadow);

    // Sprite image — fit to size
    const sprite = scene.add.image(x, y, spriteKey)
      .setOrigin(0.5)
      .setDepth(5);

    // Scale to fit within size bounds
    const scale = Math.min(size / sprite.width, size / sprite.height) * 0.9;
    sprite.setScale(scale);

    container.add(sprite);

    // Subtle colored ring behind
    const ring = scene.add.graphics();
    ring.lineStyle(3, color, 0.3);
    ring.strokeCircle(x, y, size / 2);
    container.add(ring);
  } else {
    // === PLACEHOLDER (styled circle + emoji) ===
    // Shadow
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.15);
    shadow.fillCircle(x + 3, y + 5, size / 2);
    container.add(shadow);

    // Main circle
    const body = scene.add.graphics();
    body.fillStyle(color, 0.85);
    body.fillCircle(x, y, size / 2);
    container.add(body);

    // Highlight (top-left shine)
    const highlight = scene.add.graphics();
    highlight.fillStyle(0xffffff, 0.25);
    highlight.fillCircle(x - size * 0.15, y - size * 0.15, size * 0.3);
    container.add(highlight);

    // Border ring
    const ring = scene.add.graphics();
    ring.lineStyle(3, 0xffffff, 0.4);
    ring.strokeCircle(x, y, size / 2);
    container.add(ring);

    // Emoji
    const emojiMap = {
      A: '🐜', B: '🐒', C: '🐊', D: '🦌', E: '🐘', F: '🦩',
    };
    const emoji = emojiMap[letter] || '🐾';
    const emojiText = scene.add.text(x, y, emoji, { fontSize: `${Math.floor(size * 0.45)}px` })
      .setOrigin(0.5)
      .setDepth(5);
    container.add(emojiText);
  }

  return container;
}
