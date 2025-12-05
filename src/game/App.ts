import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';
import { Starfield } from './Starfield.ts';

class PixiApp {
  public app!: PIXI.Application;
  public sceneManager!: SceneManager;
  private starfield?: Starfield;

  async init(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application();

    await this.app.init({
      view: canvas,
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      autoDensity: true
    });

    this.initializeBackgroundWithStars();

    globalThis.__PIXI_APP__ = this.app;

    this.sceneManager = new SceneManager(this.app);

    this.sceneManager.changeScene('MAIN_MENU');

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.initializeBackgroundWithStars();
    });
  }

  private initializeBackgroundWithStars() {
    const app = this.app;

    if (this.starfield) {
      this.starfield.destroy();
    }

    this.starfield = new Starfield(app, 2, 400);
  }
}

export const pixiApp = new PixiApp();
