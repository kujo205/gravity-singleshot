import { App } from '@core/App';
import { SceneManager } from '@core/SceneManager';
import { Resize } from '@core/Resize';
import { BootScene } from '@scenes/BootScene';
import { MenuScene } from '@scenes/MenuScene';
import { LevelSelectScene } from '@scenes/LevelSelectScene';
import { PlayScene } from '@scenes/PlayScene';
import { ResultsScene } from '@scenes/ResultsScene';
import { ShopScene } from '@scenes/ShopScene';

/**
 * Main entry point for Gravity Singleshot
 */
class Game {
  private app: App;
  private sceneManager: SceneManager;
  private resize: Resize;

  constructor() {
    // Initialize the app
    this.app = new App();

    // Create scene manager
    this.sceneManager = new SceneManager(this.app);

    // Register all scenes
    this.sceneManager.register('boot', BootScene);
    this.sceneManager.register('menu', MenuScene);
    this.sceneManager.register('levelselect', LevelSelectScene);
    this.sceneManager.register('play', PlayScene);
    this.sceneManager.register('results', ResultsScene);
    this.sceneManager.register('shop', ShopScene);

    // Setup resize handling
    this.resize = new Resize(this.app);

    // Start with boot scene
    this.sceneManager.goto('boot');
  }

  public getApp(): App {
    return this.app;
  }

  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }
}

// Start the game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  console.log('Gravity Singleshot started!');

  // Make game accessible for debugging
  (window as unknown as { game: Game }).game = game;
});
