import * as PIXI from 'pixi.js';
import type { Scene } from './Scene';
import type { ISceneManager } from '@types';

export class App {
  public app: PIXI.Application;
  private sceneManager: ISceneManager | null = null;
  private currentScene: Scene | null = null;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a1a2e,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    document.body.appendChild(this.app.view as HTMLCanvasElement);
  }

  public setSceneManager(sceneManager: ISceneManager): void {
    this.sceneManager = sceneManager;
  }

  public setScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.app.stage.removeChildren();
    }

    this.currentScene = scene;
    this.app.stage.addChild(scene);
    scene.init();
  }

  public getStage(): PIXI.Container {
    return this.app.stage;
  }

  public getRenderer(): PIXI.Renderer {
    return this.app.renderer as PIXI.Renderer;
  }

  public getTicker(): PIXI.Ticker {
    return this.app.ticker;
  }

  public resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
    this.currentScene?.resize(width, height);
  }

  public destroy(): void {
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}
