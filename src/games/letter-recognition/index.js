import Phaser from 'phaser';
import { createPhaserConfig } from '../../config/device.js';
import { BootScene } from '../../engine/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { DifficultySelectScene } from './scenes/DifficultySelectScene.js';
import { LetterGameScene } from './scenes/LetterGameScene.js';

/**
 * Letter Recognition Game — Entry Point
 * First game in the NovaLearning suite
 * Letters A-F with SA animals and Ubuntu values
 */
export function launchLetterGame(parentElement) {
  const config = {
    ...createPhaserConfig(Phaser),
    parent: parentElement || 'game-container',
    scene: [BootScene, MenuScene, DifficultySelectScene, LetterGameScene],
  };

  return new Phaser.Game(config);
}
