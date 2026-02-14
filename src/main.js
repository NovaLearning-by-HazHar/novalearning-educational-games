import { launchLetterGame } from './games/letter-recognition/index.js';

/**
 * NovaLearning Games — Main Entry Point
 * Currently launches the Letter Recognition game directly.
 * Future: will show a game selector hub.
 */

// Ensure the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('🌍 NovaLearning Games — Starting...');
  console.log('   "I am because we are" — Ubuntu philosophy');
  
  const game = launchLetterGame('game-container');

  // Handle visibility changes (pause when app is backgrounded)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      game.scene.scenes.forEach((scene) => {
        if (scene.scene.isActive()) scene.scene.pause();
      });
    } else {
      game.scene.scenes.forEach((scene) => {
        if (scene.scene.isPaused()) scene.scene.resume();
      });
    }
  });
}
