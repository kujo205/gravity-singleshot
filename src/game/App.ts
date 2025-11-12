import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';
import { Starfield } from './Starfield.ts';

class PixiApp {
  public app!: PIXI.Application;
  public sceneManager!: SceneManager;
  private starfield?: Starfield;

  init(canvas: HTMLCanvasElement) {
    console.log('window inner size:', window.innerWidth, window.innerHeight);

    this.app = new PIXI.Application();

    this.app
      .init({
        view: canvas,
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000
      })
      .then(() => {
        this.initializeBackgroundWithStars();
      });

    this.sceneManager = new SceneManager(this.app);

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.initializeBackgroundWithStars();
    });
  }

  private initializeBackgroundWithStars() {
    const app = this.app;

    // Flush previous starfield if it exists
    if (this.starfield) {
      this.starfield.destroy();
    }

    // Create a new one
    this.starfield = new Starfield(app, 4, 1000);
  }
}

export const pixiApp = new PixiApp();
