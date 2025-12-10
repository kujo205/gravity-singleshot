import * as PIXI from 'pixi.js';
import { Assets } from 'pixi.js';
import { SceneManager } from './SceneManager';
import { Starfield } from './Starfield.ts';
import type { GameRound } from './game/GameRound.ts';
import { roundsFactory } from './game/rounds.ts';
import { GameState } from './game/GameState.ts';

declare global {
  interface GlobalThis {
    __PIXI_APP__: PIXI.Application;
  }
}

class PixiApp {
  public app!: PIXI.Application;
  public sceneManager!: SceneManager;
  private starfield?: Starfield;
  public rounds: GameRound[] = [];
  public gameState: GameState;

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

    globalThis.__PIXI_APP__ = this.app;

    await this.loadAssetsBundle();

    this.initializeBackgroundWithStars();

    this.rounds = roundsFactory();

    this.gameState = new GameState(this.rounds);

    this.sceneManager = new SceneManager(this.app, this.gameState);

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

  private async loadAssetsBundle() {
    Assets.addBundle('global-assets', {
      'red-giant': '/assets/red-giant.gif',
      earth: '/assets/earth.gif',
      'green-dwarf': '/assets/green-dwarf.gif',
      blackhole: '/assets/blackhole.gif',
      diamond: '/assets/diamond.gif'
    });

    await Assets.loadBundle('global-assets');
  }
}

export const pixiApp = new PixiApp();
