import Phaser from 'phaser';
import { FONTS, NOVA, BACKGROUNDS, BUTTON_STYLES } from '../../config/theme.js';
import { DEVICE_CONFIG } from '../../config/device.js';

/**
 * NovaLearning UI Component Library
 * Premium kids educational game aesthetic (Orboot/PlayShifu quality)
 */

// ======================== BACKGROUNDS ========================

/**
 * Create a themed gradient background with decorative accent blobs
 */
export function createThemedBackground(scene, themeName = 'safari') {
  const { width, height } = DEVICE_CONFIG;
  const theme = BACKGROUNDS[themeName] || BACKGROUNDS.safari;

  // Gradient via canvas texture
  const key = `bg-${themeName}-${width}-${height}`;
  if (!scene.textures.exists(key)) {
    const canvas = scene.textures.createCanvas(key, width, height);
    const ctx = canvas.getContext();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, theme.topColor);
    gradient.addColorStop(1, theme.bottomColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    canvas.refresh();
  }

  const bg = scene.add.image(width / 2, height / 2, key).setDepth(-100);

  // Accent blobs (organic, warm feel)
  if (theme.blobs) {
    theme.blobs.forEach((blob) => {
      const bx = (blob.xPct / 100) * width;
      const by = (blob.yPct / 100) * height;
      const g = scene.add.graphics().setDepth(-90);
      g.fillStyle(blob.color, blob.alpha);
      g.fillCircle(bx, by, blob.size);
    });
  }

  return bg;
}

/**
 * Create floating decorative elements
 */
export function createFloatingDecor(scene, options = {}) {
  const { width, height } = DEVICE_CONFIG;
  const {
    emojis = ['✨', '🌿', '🍃', '🦋'],
    count = 8,
    depth = -50,
  } = options;

  for (let i = 0; i < count; i++) {
    const emoji = Phaser.Utils.Array.GetRandom(emojis);
    const x = Phaser.Math.Between(20, width - 20);
    const y = Phaser.Math.Between(50, height - 50);
    const size = Phaser.Math.Between(16, 28);

    const item = scene.add.text(x, y, emoji, { fontSize: `${size}px` })
      .setOrigin(0.5)
      .setAlpha(Phaser.Math.FloatBetween(0.12, 0.3))
      .setDepth(depth);

    scene.tweens.add({
      targets: item,
      y: y + Phaser.Math.Between(-25, 25),
      x: x + Phaser.Math.Between(-15, 15),
      duration: Phaser.Math.Between(3000, 6000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: i * 200,
    });
  }
}

// ======================== TYPOGRAPHY ========================

/**
 * Create chunky game-style text (outlined, shadowed)
 */
export function createChunkyText(scene, x, y, text, options = {}) {
  const {
    fontSize = '36px',
    fontFamily = FONTS.display,
    color = '#FFFFFF',
    strokeColor = NOVA.primary[900],
    strokeThickness = 4,
    shadowOffsetX = 2,
    shadowOffsetY = 3,
    shadowColor = 'rgba(45,27,14,0.4)',
    depth = 10,
    align = 'center',
    wordWrap = null,
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
      blur: 3,
      fill: true,
    },
    wordWrap: wordWrap ? { width: wordWrap } : undefined,
  });

  textObj.setOrigin(0.5).setDepth(depth);
  return textObj;
}

// ======================== BUTTONS ========================

/**
 * Create a 3D-style gradient game button
 */
export function createGameButton(scene, x, y, text, options = {}) {
  const style = options.preset ? BUTTON_STYLES[options.preset] : {};
  const {
    width = style.width || 240,
    height = style.height || 72,
    radius = style.radius || 24,
    gradientTop = style.gradientTop || 0xFB923C,
    gradientBottom = style.gradientBottom || 0xEA580C,
    shadowColor = style.shadowColor || 0x7C2D12,
    textColor = style.textColor || '#FFFFFF',
    textStroke = style.textStroke || '#9A3412',
    fontSize = style.fontSize || 28,
    icon = '',
    onClick = null,
    depth = 10,
  } = options;

  const container = scene.add.container(0, 0).setDepth(depth);

  // Shadow (3D bottom edge)
  const shadow = scene.add.graphics();
  shadow.fillStyle(shadowColor, 0.35);
  shadow.fillRoundedRect(x - width / 2 + 2, y - height / 2 + 6, width, height, radius);
  container.add(shadow);

  // Button body with gradient
  const body = scene.add.graphics();
  body.fillGradientStyle(gradientTop, gradientTop, gradientBottom, gradientBottom, 1);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  container.add(body);

  // Top shine strip
  const shine = scene.add.graphics();
  shine.fillStyle(0xFFFFFF, 0.25);
  shine.fillRoundedRect(
    x - width / 2 + 6, y - height / 2 + 3,
    width - 12, height * 0.38,
    { tl: radius - 3, tr: radius - 3, bl: 0, br: 0 }
  );
  container.add(shine);

  // Label
  const displayText = icon ? `${icon} ${text}` : text;
  const label = createChunkyText(scene, x, y, displayText, {
    fontSize: `${fontSize}px`,
    color: textColor,
    strokeColor: textStroke,
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

  hitArea.on('pointerdown', () => {
    scene.tweens.add({ targets: container, y: container.y + 4, duration: 50 });
  });

  hitArea.on('pointerup', () => {
    scene.tweens.add({
      targets: container, y: container.y - 4, duration: 50,
      onComplete: () => { if (onClick) onClick(); },
    });
  });

  container.hitArea = hitArea;
  container.label = label;

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

// ======================== CARDS ========================

/**
 * Draw a card with shadow and highlight (3D depth)
 */
export function drawCard(scene, x, y, width, height, options = {}) {
  const {
    fillColor = 0xFEF7EC,
    radius = 20,
    shadowAlpha = 0.15,
    shadowOffsetY = 6,
    strokeColor = null,
    strokeWidth = 0,
    depth = 0,
  } = options;

  const container = scene.add.container(0, 0).setDepth(depth);

  // Shadow
  if (shadowAlpha > 0) {
    const shadow = scene.add.graphics();
    shadow.fillStyle(0x2D1B0E, shadowAlpha);
    shadow.fillRoundedRect(x - width / 2 + 3, y - height / 2 + shadowOffsetY, width, height, radius);
    container.add(shadow);
  }

  // Body
  const body = scene.add.graphics();
  body.fillStyle(fillColor, 1);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  container.add(body);

  // Top highlight
  const hl = scene.add.graphics();
  hl.fillStyle(0xFFFFFF, 0.2);
  hl.fillRoundedRect(
    x - width / 2 + 6, y - height / 2 + 3,
    width - 12, height * 0.3,
    { tl: radius - 3, tr: radius - 3, bl: 0, br: 0 }
  );
  container.add(hl);

  // Border
  if (strokeColor !== null && strokeWidth > 0) {
    const border = scene.add.graphics();
    border.lineStyle(strokeWidth, strokeColor, 1);
    border.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);
    container.add(border);
  }

  return container;
}

// ======================== BANNERS ========================

/**
 * Create a ribbon banner header
 */
export function createBanner(scene, x, y, width, text, options = {}) {
  const {
    bgColor = 0xFB923C,
    textColor = '#FFFFFF',
    fontSize = '30px',
    height = 56,
    depth = 20,
  } = options;

  const container = scene.add.container(0, 0).setDepth(depth);

  // Ribbon tails
  const tail = scene.add.graphics();
  tail.fillStyle(bgColor, 0.65);
  tail.fillTriangle(
    x - width / 2 - 14, y - height / 2 + 6,
    x - width / 2 + 6, y,
    x - width / 2 - 14, y + height / 2 - 6
  );
  tail.fillTriangle(
    x + width / 2 + 14, y - height / 2 + 6,
    x + width / 2 - 6, y,
    x + width / 2 + 14, y + height / 2 - 6
  );
  container.add(tail);

  // Banner body
  const body = scene.add.graphics();
  body.fillStyle(bgColor, 1);
  body.fillRoundedRect(x - width / 2, y - height / 2, width, height, 14);
  container.add(body);

  // Bottom edge (3D)
  const edge = scene.add.graphics();
  edge.fillStyle(0x000000, 0.2);
  edge.fillRect(x - width / 2 + 8, y + height / 2 - 5, width - 16, 5);
  container.add(edge);

  // Shine
  const shine = scene.add.graphics();
  shine.fillStyle(0xFFFFFF, 0.2);
  shine.fillRoundedRect(
    x - width / 2 + 6, y - height / 2 + 3,
    width - 12, height * 0.35,
    { tl: 12, tr: 12, bl: 0, br: 0 }
  );
  container.add(shine);

  // Text
  const label = createChunkyText(scene, x, y, text, {
    fontSize,
    color: textColor,
    strokeColor: '#7C2D12',
    strokeThickness: 3,
    shadowOffsetY: 2,
    depth: depth + 1,
  });
  container.add(label);

  return container;
}

// ======================== ANIMAL DISPLAY ========================

/**
 * Create an animal display — real sprite or styled placeholder
 */
export function createAnimalDisplay(scene, x, y, letter, colorHex, size = 180, spriteKey = null) {
  const container = scene.add.container(0, 0);
  const color = Phaser.Display.Color.HexStringToColor(colorHex).color;

  const hasSprite = spriteKey && scene.textures.exists(spriteKey) &&
    scene.textures.get(spriteKey).key !== '__MISSING';

  // Frame border (thick orange ring)
  const frameBorder = scene.add.graphics();
  frameBorder.fillStyle(0xFB923C, 1);
  frameBorder.fillCircle(x, y, size / 2 + 8);
  container.add(frameBorder);

  // Inner circle
  const inner = scene.add.graphics();
  inner.fillStyle(0xFEF7EC, 1);
  inner.fillCircle(x, y, size / 2);
  container.add(inner);

  if (hasSprite) {
    const sprite = scene.add.image(x, y, spriteKey).setOrigin(0.5).setDepth(5);
    const scale = Math.min(size / sprite.width, size / sprite.height) * 0.85;
    sprite.setScale(scale);
    container.add(sprite);
  } else {
    // Colored fill + emoji
    const fill = scene.add.graphics();
    fill.fillStyle(color, 0.6);
    fill.fillCircle(x, y, size / 2 - 4);
    container.add(fill);

    const emojiMap = { A: '🐜', B: '🐒', C: '🐊', D: '🦌', E: '🐘', F: '🦩' };
    const emoji = emojiMap[letter] || '🐾';
    container.add(
      scene.add.text(x, y, emoji, { fontSize: `${Math.floor(size * 0.4)}px` })
        .setOrigin(0.5).setDepth(5)
    );
  }

  // Top highlight
  const hl = scene.add.graphics();
  hl.fillStyle(0xFFFFFF, 0.2);
  hl.fillCircle(x - size * 0.12, y - size * 0.12, size * 0.25);
  container.add(hl);

  // Shadow underneath
  const shadow = scene.add.graphics().setDepth(-1);
  shadow.fillStyle(0x2D1B0E, 0.1);
  shadow.fillEllipse(x, y + size / 2 + 10, size * 0.6, 12);
  container.add(shadow);

  return container;
}

// For backward compatibility
export const createAnimalPlaceholder = createAnimalDisplay;

// ======================== STAR POLYGON ========================

/**
 * Get points for a 5-pointed star polygon
 */
export function getStarPoints(cx, cy, outerRadius, innerRadius = null) {
  if (!innerRadius) innerRadius = outerRadius * 0.45;
  const points = [];
  const spikes = 5;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI / spikes) - Math.PI / 2;
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return points;
}

/**
 * Draw a star shape with fill and optional glow
 */
export function drawStar(scene, x, y, size, options = {}) {
  const {
    fillColor = 0xFACC15,
    strokeColor = 0xCA8A04,
    strokeWidth = 2,
    glow = false,
    glowColor = 0xFACC15,
    glowAlpha = 0.3,
    depth = 10,
  } = options;

  const container = scene.add.container(0, 0).setDepth(depth);
  const points = getStarPoints(x, y, size / 2);

  if (glow) {
    const g = scene.add.graphics();
    g.fillStyle(glowColor, glowAlpha);
    g.fillCircle(x, y, size * 0.7);
    container.add(g);
  }

  const star = scene.add.graphics();
  star.fillStyle(fillColor, 1);
  star.fillPoints(points, true);
  if (strokeWidth > 0) {
    star.lineStyle(strokeWidth, strokeColor, 1);
    star.strokePoints(points, true);
  }
  container.add(star);

  // Shine dot
  const shine = scene.add.graphics();
  shine.fillStyle(0xFFFFFF, 0.5);
  shine.fillCircle(x - size * 0.1, y - size * 0.15, size * 0.08);
  container.add(shine);

  return container;
}

// ======================== CELEBRATIONS ========================

/**
 * Confetti particles — real colored shapes, not emojis
 */
export function createConfetti(scene, x, y, options = {}) {
  const {
    count = 30,
    spread = 300,
    duration = 2500,
    colors = [0xFB923C, 0x4ADE80, 0x38BDF8, 0xFACC15, 0xFB7185],
  } = options;

  for (let i = 0; i < count; i++) {
    const particle = scene.add.graphics().setDepth(100);
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.fillStyle(color, 1);

    // Random shape: circle or rectangle confetti
    if (Math.random() > 0.5) {
      particle.fillCircle(0, 0, 4 + Math.random() * 5);
    } else {
      particle.fillRect(-3, -6, 6, 12);
    }

    particle.x = x + (Math.random() - 0.5) * 80;
    particle.y = y;

    scene.tweens.add({
      targets: particle,
      x: particle.x + (Math.random() - 0.5) * spread,
      y: y + 300 + Math.random() * 200,
      rotation: Math.random() * 10,
      alpha: 0,
      duration: duration + Math.random() * 1000,
      ease: 'Cubic.easeOut',
      delay: i * 25,
      onComplete: () => particle.destroy(),
    });
  }
}

/**
 * Emoji burst effect (supplementary celebration)
 */
export function createBurstEffect(scene, x, y, options = {}) {
  const {
    count = 15,
    emojis = ['⭐', '🌟', '✨', '🎉', '💫'],
    spread = 250,
    duration = 2000,
  } = options;

  for (let i = 0; i < count; i++) {
    const emoji = Phaser.Utils.Array.GetRandom(emojis);
    const size = Phaser.Math.Between(18, 34);
    const angle = (i / count) * Math.PI * 2;
    const dist = Phaser.Math.Between(spread * 0.3, spread);
    const tx = x + Math.cos(angle) * dist;
    const ty = y + Math.sin(angle) * dist;

    const p = scene.add.text(x, y, emoji, { fontSize: `${size}px` })
      .setOrigin(0.5).setDepth(100).setScale(0);

    scene.tweens.add({
      targets: p,
      x: tx, y: ty,
      scale: { from: 0, to: 1 },
      angle: Phaser.Math.Between(-360, 360),
      alpha: { from: 1, to: 0 },
      duration: Phaser.Math.Between(duration * 0.7, duration),
      delay: i * 25,
      ease: 'Quad.easeOut',
      onComplete: () => p.destroy(),
    });
  }
}

/**
 * Screen flash
 */
export function screenFlash(scene, color = 0xFFFFFF, duration = 300) {
  const { width, height } = DEVICE_CONFIG;
  const flash = scene.add.rectangle(width / 2, height / 2, width, height, color, 0.4)
    .setDepth(200);
  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration,
    onComplete: () => flash.destroy(),
  });
}

// ======================== UTILITY ========================

/**
 * Create a back button with 64px hit area
 */
export function createBackButton(scene, onBack) {
  createChunkyText(scene, 60, 40, '← Back', {
    fontSize: '22px',
    color: '#FFFFFF',
    strokeColor: NOVA.primary[700],
    strokeThickness: 4,
    depth: 50,
  });

  scene.add.rectangle(60, 40, 140, 64)
    .setInteractive({ useHandCursor: true })
    .setAlpha(0.001)
    .setDepth(51)
    .on('pointerdown', onBack);
}

/**
 * Phase indicator dots
 */
export function createPhaseIndicator(scene, currentPhase, totalPhases = 4) {
  const { width, height } = DEVICE_CONFIG;
  const dotSpacing = 40;
  const startX = width / 2 - ((totalPhases - 1) * dotSpacing) / 2;
  const y = height - 28;

  for (let i = 0; i < totalPhases; i++) {
    const x = startX + i * dotSpacing;
    const isActive = i + 1 === currentPhase;
    const isPast = i + 1 < currentPhase;

    const dot = scene.add.graphics().setDepth(40);
    if (isActive) {
      dot.fillStyle(0xFB923C, 1);
      dot.fillCircle(x, y, 8);
      dot.fillStyle(0xFB923C, 0.3);
      dot.fillCircle(x, y, 12);
    } else if (isPast) {
      dot.fillStyle(0x4ADE80, 0.8);
      dot.fillCircle(x, y, 6);
    } else {
      dot.fillStyle(0xCCCCCC, 0.4);
      dot.fillCircle(x, y, 6);
    }
  }
}
