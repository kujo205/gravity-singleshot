import * as PIXI from 'pixi.js';
import type { ISceneManager } from '@types';

export abstract class Scene extends PIXI.Container {
  protected sceneManager: ISceneManager;
  protected screenWidth: number;
  protected screenHeight: number;

  constructor(sceneManager: ISceneManager) {
    super();
    this.sceneManager = sceneManager;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  /**
   * Initialize the scene - called once when the scene is first set
   */
  public abstract init(): void;

  /**
   * Update loop - called every frame
   */
  public abstract update(deltaTime: number): void;

  /**
   * Resize handler - called when the window is resized
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Clean up resources when scene is destroyed
   */
  public destroy(options?: Parameters<PIXI.Container['destroy']>[0]): void {
    super.destroy(options);
  }
}
